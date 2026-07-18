module cleanup-finalization

import kokaine/reactive
import std/core/unsafe


effect ctl abandon-cleanup() : ()

fun completes-cleanup(action : () -> <abandon-cleanup,exn> bool) : exn bool
  with final ctl abandon-cleanup() False
  action()

fun require-cleanup(action : () -> <abandon-cleanup,exn> a) : exn a
  with final ctl abandon-cleanup()
    throw("unexpected cleanup abandonment")
  action()

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a)
  unsafe-total { target := value }

fun emit(events : ref<global,list<string>>, event : string)
  store(events,load(events) ++ [event])

fun check(ok : bool, message : string)
  if ok then () else throw("cleanup finalization: " ++ message)

fun test-owned-cleanups-retire-lifo()
  val events = hidden([])
  val (root,()) : (root<total>,()) = create-root fn(root)
    on-cleanup(root,fn() emit(events,"first"))
    on-cleanup(root,fn() emit(events,"second"))

  check(load(events) == [],"registration ran cleanup before retirement")
  root.dispose()
  check(load(events) == ["second","first"],
        "owner retirement did not run cleanups in LIFO order")
  root.dispose()
  check(load(events) == ["second","first"],
        "repeated root disposal ran a cleanup twice")

fun test-failing-cleanup-cannot-skip-siblings()
  val events = hidden([])
  val (root,()) : (root<total>,()) = create-root fn(root)
    on-cleanup(root,fn() emit(events,"first"))
    on-cleanup(root,fn()
      emit(events,"second-fails")
      throw("intentional resource failure")
    )

  val failed : error<()> = mask<exn>{
    error/try(fn() root.dispose())
  }
  check(failed.is-error,"cleanup failure was swallowed")
  check(load(events) == ["second-fails","first"],
        "a failing cleanup skipped a remaining sibling")
  check(root.is-disposed,"a finalizer failure left its root undisposed")
  root.dispose()
  check(load(events) == ["second-fails","first"],
        "failed cleanup retirement was not one-shot")

fun test-final-control-cleanup-cannot-skip-siblings()
  val events = hidden([])
  val (root,()) : (root<<abandon-cleanup>>,()) = require-cleanup fn()
    create-root fn(root)
      on-cleanup(root,fn() emit(events,"first"))
      on-cleanup(root,fn()
        emit(events,"second-abandons")
        abandon-cleanup()
      )

  val completed = completes-cleanup fn()
    root.dispose()
    True
  check(!completed,"final control unexpectedly returned from cleanup")
  check(load(events) == ["second-abandons","first"],
        "final control skipped an older cleanup sibling")
  check(root.is-disposed,"final control left its root undisposed")
  val repeated = completes-cleanup fn()
    root.dispose()
    True
  check(repeated,"repeated disposal unexpectedly re-entered final control")
  check(load(events) == ["second-abandons","first"],
        "final-control cleanup retirement was not one-shot")

pub fun main()
  test-owned-cleanups-retire-lifo()
  test-failing-cleanup-cannot-skip-siblings()
  test-final-control-cleanup-cannot-skip-siblings()
  println("cleanup-finalization: all checks passed")
