module root-construction

import kokaine/reactive
import std/core/unsafe

effect ctl abort-construction() : ()

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun bump(target : ref<global,int>) : ()
  store(target,load(target) + 1)

fun check(ok : bool, label : string)
  if ok then println("ok: " ++ label) else throw("FAILED: " ++ label)

fun completes-construction(
      action : () -> <abort-construction,pure|e> bool) : <pure|e> bool
  with final ctl abort-construction() False
  action()

// An exception in the construction action must not leave the implicit batch
// and bootstrap work that the action queued. Root-level cleanup still runs.
fun test-action-failure-rolls-back()
  val runs = hidden(0)
  val cleanups = hidden(0)
  val disposed = hidden(fn() False)

  val attempt : error<()> = error/try fn()
    val _ = create-root fn(root)
      store(disposed,fn() root.is-disposed)
      val source = signal(root,0)
      on-cleanup(root,fn() bump(cleanups))
      val stop = create-effect(root,fn() source.get,fn(_) bump(runs))
      throw("intentional construction failure")
    ()

  check(attempt.is-error,"construction action failure escapes")
  check(load(disposed)(),"failed construction retires its candidate root")
  check(load(runs) == 0,"failed action never starts queued bootstrap work")
  check(load(cleanups) == 1,"failed action runs root cleanup exactly once")

// A later bootstrap can fail after an earlier sibling has already published.
// The initial drain is part of construction, so both the published prefix and
// the failing scope must be retired before create-root reports the exception.
fun test-bootstrap-failure-rolls-back-published-prefix()
  val good-runs = hidden(0)
  val good-cleanups = hidden(0)
  val bad-runs = hidden(0)
  val bad-cleanups = hidden(0)
  val disposed = hidden(fn() False)

  val attempt : error<()> = error/try fn()
    val _ = create-root fn(root)
      store(disposed,fn() root.is-disposed)
      val source = signal(root,0)
      val good = create-effect(root,fn() source.get,fn(_)
        bump(good-runs)
        on-cleanup(root,fn() bump(good-cleanups))
      )
      val bad = create-effect(root,fn() source.get,fn(_)
        bump(bad-runs)
        on-cleanup(root,fn() bump(bad-cleanups))
        throw("intentional bootstrap failure")
      )
      ()
    ()

  check(attempt.is-error,"initial bootstrap failure escapes")
  check(load(disposed)(),"bootstrap failure retires its candidate root")
  check(load(good-runs) == 1 && load(bad-runs) == 1,
    "initial drain reached the published prefix and failing bootstrap once")
  check(load(good-cleanups) == 1,
    "bootstrap rollback retires an already-published sibling")
  check(load(bad-cleanups) == 1,
    "failing bootstrap cleanup runs exactly once")

// The rollback guard is dynamic, not merely an exception catch: a final
// control operation that discards create-root's continuation must retire the
// unpublished root too.
fun test-final-control-rolls-back()
  val runs = hidden(0)
  val cleanups = hidden(0)
  val disposed = hidden(fn() False)

  val completed = completes-construction fn()
    create-root fn(root)
      store(disposed,fn() root.is-disposed)
      val source = signal(root,0)
      on-cleanup(root,fn() bump(cleanups))
      val stop = create-effect(root,fn() source.get,fn(_) bump(runs))
      abort-construction()
    True

  check(!completed,"final control abandons root construction")
  check(load(disposed)(),"final control retires the unpublished root")
  check(load(runs) == 0,"final control cannot start queued bootstrap work")
  check(load(cleanups) == 1,"final control runs root cleanup exactly once")

pub fun main()
  test-action-failure-rolls-back()
  test-bootstrap-failure-rolls-back-published-prefix()
  test-final-control-rolls-back()
  println("root-construction: 13 checks passed")
