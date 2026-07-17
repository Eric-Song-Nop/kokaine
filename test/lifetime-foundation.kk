module lifetime-foundation

import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import std/core/unsafe
import std/core/undiv


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun emit(events : ref<global,list<string>>, event : string) : ()
  hidden-store(events,Cons(event,hidden-load(events)))

fun check(ok : bool, message : string)
  if ok then () else throw("lifetime foundation: " ++ message)

tail fun register-many(root : root<total>, remaining : int,
                       runs : ref<global,int>) : <div,exn> ()
  if remaining <= 0 then () else
    val _ = register-cleanup(root,fn()
      hidden-store(runs,hidden-load(runs) + 1)
    )
    register-many(root,remaining - 1,runs)

fun test-explicit-unregister-discards-without-running()
  val runs = hidden(0)
  val (root,registration) = create-root fn(root)
    register-cleanup(root,fn()
      hidden-store(runs,hidden-load(runs) + 1)
    )

  check(registration.unregister,"the live cleanup registration is removable")
  check(!registration.unregister,"cleanup unregistration is idempotent")
  check(hidden-load(runs) == 0,"unregister must discard rather than finalize")
  root.dispose()
  check(hidden-load(runs) == 0,"a removed cleanup cannot reappear at retirement")

fun test-retirement-snapshot-cannot-lose-a-sibling()
  val events = hidden([])
  val sibling-result = hidden(True)
  val older-slot : ref<global,maybe<cleanup-registration<total>>> =
    hidden(Nothing)
  val (root,()) : (root<total>,()) = create-root fn(root)
    val older = register-cleanup(root,fn() emit(events,"older"))
    hidden-store(older-slot,Just(older))
    val _ = register-cleanup(root,fn()
      emit(events,"newer")
      match hidden-load(older-slot)
        Nothing -> hidden-store(sibling-result,True)
        Just(current) -> hidden-store(sibling-result,current.unregister)
    )
    ()

  root.dispose()
  check(!hidden-load(sibling-result),
        "retirement must claim the whole snapshot before user cleanup")
  check(hidden-load(events).reverse == ["newer","older"],
        "snapshot ownership preserves exhaustive LIFO cleanup")

fun test-wide-retirement-is_stack_safe()
  val runs = hidden(0)
  val size = 50000
  val (root,()) : (root<total>,()) = create-root fn(root)
    pretend-no-div{ register-many(root,size,runs) }
  root.dispose()
  check(hidden-load(runs) == size,
        "wide retirement executes every finalizer exactly once")
  root.dispose()
  check(hidden-load(runs) == size,"wide retirement remains idempotent")

pub fun main()
  test-explicit-unregister-discards-without-running()
  test-retirement-snapshot-cannot-lose-a-sibling()
  test-wide-retirement-is_stack_safe()
  println("lifetime-foundation: all checks passed")
