module removable-cleanup

import kokaine/reactive/internal/model
import kokaine/reactive/internal/resource
import kokaine/reactive/internal/runtime
import std/core/unsafe
import std/core/undiv


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load-cell(value : ref<global,a>) : a
  unsafe-total { !value }

fun store-cell(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun emit(events : ref<global,list<string>>, value : string) : ()
  store-cell(events,load-cell(events) ++ [value])

fun check(ok : bool, label : string) : exn ()
  if ok then () else throw("removable cleanup: " ++ label)

fun owned-resource-count(values : owned<e>) : <div> int
  match values
    Owned-end -> 0
    Owned-fork(_,next) -> owned-resource-count(next)
    Owned-derive-fork(_,next) -> owned-resource-count(next)
    Owned-resource(_,next) -> 1 + owned-resource-count(next)

fun root-owned-resource-count(root : root<e>) : int
  pretend-no-div{ owned-resource-count(load(root.root-owned)) }

fun test-unregister-is-physical-and-idempotent()
  val events = hidden([])
  val (root,(_first,second,_third))
      : (root<total>,
         (cleanup-registration,cleanup-registration,cleanup-registration)) =
    create-root fn(root)
      val first = register-cleanup(root,fn() emit(events,"first"))
      val second = register-cleanup(root,fn() emit(events,"second"))
      val third = register-cleanup(root,fn() emit(events,"third"))
      (first,second,third)

  check(root-owned-resource-count(root) == 3,
        "registration did not create three owner entries")
  second.unregister
  second.unregister
  check(load-cell(events).is-nil,"unregister executed user cleanup")
  check(root-owned-resource-count(root) == 2,
        "unregister left an owner tombstone")
  root.dispose()
  check(load-cell(events) == ["third","first"],
        "unregister changed remaining LIFO cleanup order")

fun test-retirement-snapshot-wins-unregister_race()
  val events = hidden([])
  val first-slot : ref<global,maybe<cleanup-registration>> = hidden(Nothing)
  val (root,()) : (root<total>,()) = create-root fn(root)
    val first = register-cleanup(root,fn() emit(events,"first"))
    store-cell(first-slot,Just(first))
    val _second = register-cleanup(root,fn()
      emit(events,"second")
      match load-cell(first-slot)
        Nothing -> ()
        Just(registration) -> registration.unregister
    )
    ()

  root.dispose()
  check(load-cell(events) == ["second","first"],
        "cleanup unregistered a sibling already claimed by retirement")

pub fun main()
  test-unregister-is-physical-and-idempotent()
  test-retirement-snapshot-wins-unregister_race()
  println("removable-cleanup: all checks passed")
