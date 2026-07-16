module resource-finalization

import kokaine/reactive
import kokaine/reactive/internal/resource
import std/core/unsafe

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a)
  unsafe-total { target := value }

fun emit(events : ref<global,list<string>>, event : string)
  store(events,load(events) ++ [event])

fun check(ok : bool, message : string)
  if ok then () else throw("resource finalization: " ++ message)

fun test-direct-resource-capability()
  val events = hidden([])
  val resource : resource-k<total> =
    capture-resource(fn() emit(events,"direct"))
  val resource-copy = resource

  check(load(events) == [],"capture ran the parked finalizer")
  finalize-resource(resource)
  finalize-resource(resource-copy)
  check(load(events) == ["direct"],
        "an aliased resource continuation finalized more than once")

fun test-owned-resources-park-and-retire-lifo()
  val events = hidden([])
  val (root,()) : (root<total>,()) = create-root fn(root)
    on-cleanup(root,fn() emit(events,"first"))
    on-cleanup(root,fn() emit(events,"second"))

  check(load(events) == [],"registration ran cleanup before retirement")
  root.dispose()
  check(load(events) == ["second","first"],
        "owner retirement did not finalize parked resources in LIFO order")
  root.dispose()
  check(load(events) == ["second","first"],
        "repeated root disposal finalized a parked resource twice")

fun test-failing-resource-cannot-skip-siblings()
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
  check(failed.is-error,"resource finalizer failure was swallowed")
  check(load(events) == ["second-fails","first"],
        "a failing resource skipped a remaining sibling")
  check(root.is-disposed,"a finalizer failure left its root undisposed")
  root.dispose()
  check(load(events) == ["second-fails","first"],
        "failed resource retirement was not one-shot")

pub fun main()
  test-direct-resource-capability()
  test-owned-resources-park-and-retire-lifo()
  test-failing-resource-cannot-skip-siblings()
  println("resource-finalization: all checks passed")
