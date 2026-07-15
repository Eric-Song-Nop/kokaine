module entry-structural

import kokaine/reactive
import std/core/unsafe

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

fun check(ok : bool, label : string)
  if ok then println("ok: " ++ label)
  else throw("FAILED: " ++ label)

fun check-int(actual : int, expected : int, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun check-events(actual : list<string>, expected : list<string>, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun test-entry-equality-and-structural-barrier()
  val memo-runs = hidden(0)
  val events = hidden([])

  val (root,(input,payload,stop)) = create-root fn(root)
    val input = signal(root,1)
    val payload = signal(root,10)
    val parity = memo(root,0,fn(_)
      bump(memo-runs)
      input.get % 2
    )
    val stop = create-effect(root,fn() parity.get,fn(value)
      emit(events,"parent:" ++ value.show)
      on-cleanup(root,fn() emit(events,"parent-clean:" ++ value.show))
      val child = create-effect(root,fn() payload.get,fn(current)
        emit(events,"child:" ++ value.show ++ ":" ++ current.show)
        on-cleanup(root,fn() emit(events,"child-clean:" ++ value.show))
      )
      ()
    )
    (input,payload,stop)

  load(memo-runs).check-int(1,"state entry bootstraps once")
  load(events).check-events(["parent:1","child:1:10"],
    "downstream structural scopes bootstrap after the state entry")

  update(root){ input.set(3) }
  load(memo-runs).check-int(2,"equal state result still enters calculation")
  load(events).check-events(["parent:1","child:1:10"],
    "state equality cuts off the downstream structural branch")

  update(root){ payload.set(11) }
  load(memo-runs).check-int(2,
    "child dependency does not target an ancestor state entry")
  load(events).check-events(
    ["parent:1","child:1:10","child-clean:1","child:1:11"],
    "child dependency resumes only its generation-local continuation")

  update(root){ input.set(2) }
  load(memo-runs).check-int(3,"changed state result resumes one entry")
  load(events).check-events(
    ["parent:1","child:1:10","child-clean:1","child:1:11",
     "child-clean:1","parent-clean:1","parent:0","child:0:11"],
    "state commit replaces the downstream structural generation")

  stop()
  root.dispose()

fun test-downstream-failure-keeps-latest-state()
  val fail = hidden(False)
  val seen = hidden([])

  val (root,(input,state,stop)) = create-root fn(root)
    val input = signal(root,1)
    val state = memo(root,0,fn(previous)
      previous + input.get
    )
    val stop = create-effect(root,fn() state.get,fn(value)
      if load(fail) then throw("intentional downstream failure")
      else emit(seen,value.show)
    )
    (input,state,stop)

  sample(root){ state.get }.check-int(1,"initial state is committed")
  store(fail,True)
  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ input.set(2) }
  }
  check(failed.is-error,"downstream failure escapes the update")
  sample(root){ state.get }.check-int(3,
    "entry result remains the latest committed previous after downstream failure")

  store(fail,False)
  update(root){ input.set(3) }
  sample(root){ state.get }.check-int(6,
    "entry resumes from the commit made before downstream failure")
  load(seen).check-events(["1","6"],
    "pending downstream continuation recovers at the latest state")

  stop()
  root.dispose()

pub fun main()
  test-entry-equality-and-structural-barrier()
  test-downstream-failure-keeps-latest-state()
  println("entry-structural: all checks passed")
