module structural-scopes

import kokaine/reactive
import std/core/unsafe

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun emit(events : ref<global,list<string>>, event : string) : ()
  store(events,load(events) ++ [event])

fun check(ok : bool, label : string)
  if ok then println("ok: " ++ label)
  else throw("FAILED: " ++ label)

fun check-events(actual : list<string>, expected : list<string>, label : string)
  check(actual == expected,
        label ++ " expected=" ++ expected.show ++ " actual=" ++ actual.show)

fun test-nested-replacement-and-disposal()
  val events = hidden([])
  val (root,(generation,payload,stop)) = create-root fn(root)
    val generation = signal(root,0)
    val payload = signal(root,10)
    val stop = create-effect(root,fn() generation.get,fn(g)
      emit(events,"parent-run:" ++ g.show)
      on-cleanup(root,fn() emit(events,"parent-clean:" ++ g.show))
      val child = create-effect(root,fn() payload.get,fn(value)
        emit(events,"child-run:" ++ g.show ++ ":" ++ value.show)
        on-cleanup(root,fn() emit(events,"child-clean:" ++ g.show))
      )
      ()
    )
    (generation,payload,stop)

  load(events).check-events(
    ["parent-run:0","child-run:0:10"],
    "nested scope bootstraps after its parent publishes")

  update(root){ generation.set(1) }
  load(events).check-events(
    ["parent-run:0","child-run:0:10","child-clean:0","parent-clean:0",
     "parent-run:1","child-run:1:10"],
    "old structural branch retires before replacement publish")

  update(root){ payload.set(11) }
  load(events).check-events(
    ["parent-run:0","child-run:0:10","child-clean:0","parent-clean:0",
     "parent-run:1","child-run:1:10","child-clean:1","child-run:1:11"],
    "only the replacement child continuation remains live")

  stop()
  load(events).check-events(
    ["parent-run:0","child-run:0:10","child-clean:0","parent-clean:0",
     "parent-run:1","child-run:1:10","child-clean:1","child-run:1:11",
     "child-clean:1","parent-clean:1"],
    "explicit scope disposal is postorder")
  stop()
  root.dispose()

fun run-parent-child-batch(generation-first : bool) : exn list<string>
  val events = hidden([])
  val (root,(generation,payload)) = create-root fn(root)
    val generation = signal(root,0)
    val payload = signal(root,10)
    val stop = create-effect(root,fn() generation.get,fn(g)
      val child = create-effect(root,fn() payload.get,fn(value)
        emit(events,"child-run:" ++ g.show ++ ":" ++ value.show)
        on-cleanup(root,fn() emit(events,"child-clean:" ++ g.show))
      )
      ()
    )
    (generation,payload)
  update(root)
    batch(root)
      if generation-first then
        generation.set(1)
        payload.set(11)
      else
        payload.set(11)
        generation.set(1)
  val result = load(events)
  root.dispose()
  result

fun test-structural-parent-is-the-runnable-frontier()
  val expected =
    ["child-run:0:10","child-clean:0","child-run:1:11"]
  run-parent-child-batch(True).check-events(expected,
    "parent generation gates a child queued later in the same batch")
  run-parent-child-batch(False).check-events(expected,
    "structural frontier is independent of source write order")

fun test-unstarted-child-is-gated-by-pending-parent()
  val events = hidden([])
  val (root,trigger) = create-root fn(root)
    val trigger = signal(root,0)
    val stop = create-effect(root,fn() trigger.get,fn(value)
      emit(events,"parent-run:" ++ value.show)
      if value == 1 then
        trigger.set(2)
        val child = create-effect(root,fn() 0,fn(_)
          emit(events,"stale-child-ran")
        )
        ()
      else ()
    )
    trigger

  update(root){ trigger.set(1) }
  load(events).check-events(
    ["parent-run:0","parent-run:1","parent-run:2"],
    "pending parent retires an unstarted child before its bootstrap")
  root.dispose()

fun test-failed-publication-retires-draft-owned()
  val events = hidden([])
  val fail = hidden(False)
  val (root,generation) = create-root fn(root)
    val generation = signal(root,0)
    val stop = create-effect(root,fn() generation.get,fn(g)
      emit(events,"parent-run:" ++ g.show)
      on-cleanup(root,fn() emit(events,"parent-clean:" ++ g.show))
      val child = create-effect(root,fn() g,fn(value)
        emit(events,"child-run:" ++ value.show)
        on-cleanup(root,fn() emit(events,"child-clean:" ++ value.show))
      )
      if load(fail) then throw("intentional parent publication failure") else ()
    )
    generation

  store(fail,True)
  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ generation.set(1) }
  }
  check(failed.is-error,"publication failure escapes its update")
  load(events).check-events(
    ["parent-run:0","child-run:0","child-clean:0","parent-clean:0",
     "parent-run:1","parent-clean:1"],
    "failed draft cleans its unstarted child and registered cleanup")

  store(fail,False)
  update(root){ generation.set(2) }
  load(events).check-events(
    ["parent-run:0","child-run:0","child-clean:0","parent-clean:0",
     "parent-run:1","parent-clean:1","parent-run:2","child-run:2"],
    "pending continuation recovers without starting the failed child")
  root.dispose()
  load(events).check-events(
    ["parent-run:0","child-run:0","child-clean:0","parent-clean:0",
     "parent-run:1","parent-clean:1","parent-run:2","child-run:2",
     "child-clean:2","parent-clean:2"],
    "root disposal retires the committed replacement branch")

fun test-self-disposal-cannot-reattach-draft()
  val runs = hidden(0)
  val cleanups = hidden(0)
  val stop-slot : ref<global,maybe<disposer<total>>> = hidden(Nothing)
  val (root,source) : (root<total>,signal<int>) = create-root fn(root)
    val source = signal(root,0)
    val stop = create-effect(root,fn() source.get,fn(value)
      store(runs,load(runs) + 1)
      on-cleanup(root,fn() store(cleanups,load(cleanups) + 1))
      if value == 1 then
        match load(stop-slot)
          Just(dispose) -> dispose()
          Nothing -> ()
      else ()
    )
    store(stop-slot,Just(stop))
    source

  update(root){ source.set(1) }
  update(root){ source.set(2) }
  if load(runs) == 2 then ()
  else throw("self-disposed continuation published a later draft")
  if load(cleanups) == 2 then ()
  else throw("self-disposal did not clean both generations exactly once")
  root.dispose()

fun test-cleanup-cannot-escape-retired-frame()
  val cleanup-runs = hidden(0)
  val effect-runs = hidden(0)
  val orphan-runs = hidden(0)
  val allow-spawn = hidden(True)
  val (root,source) = create-root fn(root)
    val source = signal(root,0)
    val stop = create-effect(root,fn() source.get,fn(_)
      store(effect-runs,load(effect-runs) + 1)
      on-cleanup(root,fn()
        store(cleanup-runs,load(cleanup-runs) + 1)
        if load(allow-spawn) then
          val orphan = create-effect(root,fn() source.get,fn(_)
            store(orphan-runs,load(orphan-runs) + 1)
          )
          ()
        else ()
      )
    )
    source

  val failed : error<()> = mask<exn>{
    error/try fn() update(root){ source.set(1) }
  }
  check(failed.is-error,
    "cleanup cannot register work outside its retired continuation frame")
  check(load(cleanup-runs) == 1,
    "retired cleanup ran exactly once before registration was rejected")
  check(load(orphan-runs) == 0,
    "rejected cleanup registration left no root-level orphan")

  store(allow-spawn,False)
  update(root){ source.set(2) }
  check(load(effect-runs) == 2,
    "the pending parent continuation recovers after cleanup rejection")
  root.dispose()

pub fun main()
  test-nested-replacement-and-disposal()
  test-structural-parent-is-the-runnable-frontier()
  test-unstarted-child-is-gated-by-pending-parent()
  test-failed-publication-retires-draft-owned()
  test-self-disposal-cannot-reattach-draft()
  test-cleanup-cannot-escape-retired-frame()
  println("structural-scopes: all checks passed")
