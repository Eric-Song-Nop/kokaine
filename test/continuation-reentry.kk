module continuation-reentry

import kokaine/reactive
import kokaine/reactive/integration
import std/core/unsafe

effect ctl abandon-host-turn() : ()

fun completes-host-turn(action : () -> <abandon-host-turn,exn> bool)
                       : exn bool
  with final ctl abandon-host-turn() False
  action()

fun handle-host-turn(action : () -> <abandon-host-turn,exn> ()) : exn ()
  with final ctl abandon-host-turn() ()
  action()

val checks : ref<global,int> = unsafe-total { ref(0) }

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun bump(target : ref<global,int>) : ()
  store(target,load(target) + 1)

fun check(ok : bool, label : string) : exn ()
  bump(checks)
  if ok then () else throw("FAILED: " ++ label)

fun check-int(actual : int, expected : int, label : string) : exn ()
  check(actual == expected,
    label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun require-reentry(slot : ref<global,maybe<reentry<total>>>)
                   : exn reentry<total>
  match load(slot)
    Nothing -> throw("reentry fixture was not initialized")
    Just(value) -> value

// Mutating run-reentry into a plain root dispatch makes the callback-created
// memo/effect root-owned. The old generation cleanup and silence checks below
// must then fail even though all signal values still propagate normally.
fun test-reentry-owns-callback-work() : exn ()
  val portal-slot : ref<global,maybe<reentry<total>>> = hidden(Nothing)
  val child-runs = hidden(0)
  val child-cleanups = hidden(0)
  val midturn-cleanups = hidden(0)
  val child-values : ref<global,list<int>> = hidden([])

  val (root,(generation,payload)) = create-root fn(root)
    val generation = signal(root,0)
    val payload = signal(root,2)
    val parent = create-effect(root,fn() generation.get,fn(_)
      store(portal-slot,Just(capture-reentry(root)))
    )
    (generation,payload)

  val stale = require-reentry(portal-slot)
  reenter(stale,fn()
    val scaled = derive(root,0,fn() payload.get * 10)
    val child = create-effect(root,fn() scaled.get,fn(value)
      bump(child-runs)
      store(child-values,Cons(value,load(child-values)))
      on-cleanup(root,fn() bump(child-cleanups))
    )
    ()
  )

  check-int(load(child-runs),1,
    "callback child bootstraps in the captured generation")
  check(load(child-values) == [20],
    "callback-owned derive publishes before its consumer")

  update(root){ payload.set(3) }
  check-int(load(child-runs),2,
    "callback child follows its exact captured read suffix")
  check(load(child-values) == [30,20],
    "callback child observes the updated derived value")
  check-int(load(child-cleanups),1,
    "child refresh retires its previous continuation frame")

  update(root){ generation.set(1) }
  check-int(load(child-cleanups),2,
    "parent replacement retires callback-created work")

  update(root){ payload.set(4) }
  check-int(load(child-runs),2,
    "retired callback child leaves no live source capability")

  val rejected : error<()> = mask<exn>{
    error/try(fn()
      reenter(stale,fn()
        val orphan = create-effect(root,fn() payload.get,fn(_) ())
        ()
      )
    )
  }
  check(rejected.is-error,
    "a retired continuation generation rejects later host re-entry")

  val fresh = require-reentry(portal-slot)
  reenter(fresh,fn()
    val child = create-effect(root,fn() payload.get,fn(_)
      bump(child-runs)
      on-cleanup(root,fn() bump(child-cleanups))
    )
    ()
  )
  check-int(load(child-runs),3,
    "the replacement generation exposes a fresh re-entry capability")

  reenter(fresh,fn()
    // This write makes the entered generation stale. Re-entry batching must
    // keep its frame live until the rest of this callback has registered.
    generation.set(2)
    on-cleanup(root,fn() bump(midturn-cleanups))
  )
  check-int(load(midturn-cleanups),1,
    "self-invalidating callback retires work registered later in its turn")
  check-int(load(child-cleanups),3,
    "self-invalidating callback retires its previously created child")

  update(root){ payload.set(5) }
  check-int(load(child-runs),3,
    "self-invalidated re-entry leaves no callback child behind")

  val newest = require-reentry(portal-slot)
  reenter(newest,fn()
    val child = create-effect(root,fn() payload.get,fn(_)
      bump(child-runs)
      on-cleanup(root,fn() bump(child-cleanups))
    )
    ()
  )
  check-int(load(child-runs),4,
    "a later continuation generation remains independently enterable")

  root.dispose()
  check-int(load(child-cleanups),4,
    "root disposal retires the fresh callback child exactly once")

fun test-final-control-restores-reentry-turn() : <abandon-host-turn,exn> ()
  val built : (root<<abandon-host-turn>>,signal<int>) =
    create-root fn(root) signal(root,0)
  val (root,source) = built
  val portal = capture-reentry(root)

  val completed = completes-host-turn(fn()
    reenter(portal,fn()
      source.set(1)
      abandon-host-turn()
      True
    )
  )
  check(!completed,
    "final control abandons the host callback")
  check-int(sample(root){ source.get },1,
    "abandoned re-entry still closes its batch and commits the write")

  update(root){ source.set(2) }
  check-int(sample(root){ source.get },2,
    "final control restores frame, gate, entry target, and batch depth")
  root.dispose()

pub fun main()
  test-reentry-owns-callback-work()
  handle-host-turn(fn() test-final-control-restores-reentry-turn())
  println("continuation-reentry: " ++ load(checks).show ++ " checks passed")
