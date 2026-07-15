module final-control-rollback

import kokaine/reactive
import std/core/unsafe

// This final control deliberately discards the dynamic continuation of a
// replacement publication. The reactive runtime must still retire everything
// registered in that unpublished generation.
effect ctl discard-replacement() : ()

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun bump(target : ref<global,int>) : ()
  store(target,load(target) + 1)

fun emit(target : ref<global,list<string>>, value : string) : ()
  store(target,load(target) ++ [value])

fun count-value(values : list<string>, expected : string) : int
  values.filter(fn(value) value == expected).length

fun check(failures : ref<global,list<string>>, ok : bool, label : string)
  if ok then println("ok: " ++ label) else
    println("FAILED: " ++ label)
    emit(failures,label)

fun check-int(failures : ref<global,list<string>>,
              actual : int, expected : int, label : string)
  check(failures,actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun check-events(failures : ref<global,list<string>>,
                 actual : list<string>, expected : list<string>, label : string)
  check(failures,actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun completes-replacement(action : () -> <discard-replacement,pure|e> bool)
                          : <pure|e> bool
  with final ctl discard-replacement() False
  action()

fun require-replacement(action : () -> <discard-replacement,pure|e> a)
                         : <div,exn|e> a
  with final ctl discard-replacement()
    throw("unexpected replacement discard")
  action()

fun test-final-control-rolls-back-unpublished-generation()
  val failures = hidden([])
  val prefix-runs = hidden(0)
  val suffix-runs = hidden(0)
  val next-attempt = hidden(0)
  val discard-once = hidden(True)
  val apply-runs = hidden([])
  val cleanup-runs = hidden([])
  val child-runs = hidden([])

  val built = require-replacement fn()
      create-root fn(root)
        val generation = signal(root,0)
        val payload = signal(root,10)
        val stop = create-effect(root,fn()
          // Code before the synchronous read is the discarded prefix. A later
          // invalidation must enter the captured suffix, not call this again.
          bump(prefix-runs)
          val current = generation.get
          bump(suffix-runs)
          current
        ,fn(current)
          val attempt = load(next-attempt)
          bump(next-attempt)
          emit(apply-runs,current.show ++ "@" ++ attempt.show)
          on-cleanup(root,fn() emit(cleanup-runs,attempt.show))
          val child = create-effect(root,fn() payload.get,fn(value)
            emit(child-runs,attempt.show ++ ":" ++ current.show ++
                            ":" ++ value.show)
          )
          if current == 1 && load(discard-once) then
            store(discard-once,False)
            discard-replacement()
          else ()
        )
        (generation,payload,stop)
  val (root,(generation,payload,stop)) = built

  check-events(failures,load(apply-runs),["0@0"],
    "initial generation publishes once")
  check-events(failures,load(child-runs),["0:0:10"],
    "initial child starts only after publication")
  check-int(failures,load(prefix-runs),1,
    "initial calculation prefix runs once")
  check-int(failures,load(suffix-runs),1,
    "initial calculation suffix runs once")

  val completed = completes-replacement fn()
    update(root){ generation.set(1) }
    True
  check(failures,!completed,
    "custom final control aborts replacement publication")
  check-events(failures,load(apply-runs),["0@0","1@1"],
    "aborted generation reached apply exactly once")
  check-int(failures,count-value(load(cleanup-runs),"0"),1,
    "previous generation cleanup runs exactly once")
  check-int(failures,count-value(load(cleanup-runs),"1"),1,
    "aborted generation cleanup runs synchronously and exactly once")
  check-int(failures,load(prefix-runs),1,
    "replacement resumes the captured suffix without rerunning its prefix")
  check-int(failures,load(suffix-runs),2,
    "replacement enters the captured suffix exactly once")
  check-events(failures,load(child-runs),["0:0:10"],
    "child from the aborted attempt never starts")
  val committed = require-replacement fn()
    sample(root){ generation.get }
  check-int(failures,committed,1,
    "final control does not roll back the committed source write")

  val unrelated-completed = completes-replacement fn()
    update(root){ payload.set(11) }
    True
  check(failures,unrelated-completed,
    "next flush retries the pending parent continuation")
  check-events(failures,load(apply-runs),["0@0","1@1","1@2"],
    "pending continuation retries the committed value through its exact suffix")
  check-events(failures,load(child-runs),["0:0:10","2:1:11"],
    "retry publishes a fresh child, never the aborted attempt")
  check-int(failures,count-value(load(cleanup-runs),"1"),1,
    "retry cannot repeat the aborted attempt cleanup")
  check-int(failures,load(prefix-runs),1,
    "pending retry cannot replay the calculation prefix")
  check-int(failures,load(suffix-runs),3,
    "pending retry re-enters the actual captured suffix")

  val recovery-completed = completes-replacement fn()
    update(root){ generation.set(2) }
    True
  check(failures,recovery-completed,
    "next parent source value completes recovery")
  check-events(failures,load(apply-runs),["0@0","1@1","1@2","2@3"],
    "parent continuation recovers on the next source value")
  check-events(failures,load(child-runs),
    ["0:0:10","2:1:11","3:2:11"],
    "recovery publishes only the fresh child")
  check-int(failures,load(prefix-runs),1,
    "recovery still does not retain or replay the calculation prefix")
  check-int(failures,load(suffix-runs),4,
    "recovery re-enters the exact captured suffix")
  check-int(failures,count-value(load(cleanup-runs),"1"),1,
    "recovery cannot repeat aborted cleanup")

  val child-completed = completes-replacement fn()
    update(root){ payload.set(12) }
    True
  check(failures,child-completed,
    "recovered child update does not re-enter an aborted publication")
  check-events(failures,load(child-runs),
    ["0:0:10","2:1:11","3:2:11","3:2:12"],
    "only the recovered child remains live")
  check-int(failures,load(prefix-runs),1,
    "child updates cannot replay the parent prefix")

  val disposal-completed = completes-replacement fn()
    stop()
    root.dispose()
    True
  check(failures,disposal-completed,
    "disposal does not re-enter an aborted publication")
  check-int(failures,count-value(load(cleanup-runs),"1"),1,
    "disposal cannot finalize the aborted generation twice")

  match load(failures)
    Nil -> println("final-control-rollback: all checks passed")
    values -> throw("final-control-rollback failures: " ++ values.show)

pub fun main()
  test-final-control-rolls-back-unpublished-generation()
