module internal-registry

import kokaine/internal/registry
import std/core/unsafe
import std/core/undiv


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load-hidden(value : ref<global,a>) : a
  unsafe-total { !value }

fun store-hidden(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun check(ok : bool, message : string)
  if ok then () else throw("internal registry: " ++ message)

tail fun insert-many(target : registry<int>, next : int, remaining : int,
                     handles : list<registry-registration<int>>)
                    : <div,exn> list<registry-registration<int>>
  if remaining <= 0 then handles else
    val registration = target.insert(next)
    insert-many(target,next + 1,remaining - 1,Cons(registration,handles))

tail fun take-all(handles : list<registry-registration<int>>, total : int)
                  : <div> int
  match handles
    Nil -> total
    Cons(registration,rest) ->
      match registration.take
        Nothing -> take-all(rest,total)
        Just(value) -> take-all(rest,total + value)

fun test-removable-registrations-scale-linearly()
  val target = new-registry()
  val size = 50000
  val handles = pretend-no-div{ insert-many(target,0,size,[]) }

  check(target.count == size,"insert count is exact")
  check(target.has-linked-nodes,"a non-empty registry owns linked nodes")
  check(target.snapshot.take(4) == [size - 1,size - 2,size - 3,size - 4],
        "snapshot preserves newest-first registration order")

  val sum = pretend-no-div{ take-all(handles,0) }
  val expected = pretend-no-div{ ((size - 1) * size) / 2 }
  check(sum == expected,"every registration was claimed exactly once")
  check(target.count == 0,"claims physically unlink every node")
  check(target.snapshot == [],"claimed nodes leave no tombstones")
  check(!target.has-linked-nodes,
        "individual claims release the registry's ownership edge")
  check(pretend-no-div{ take-all(handles,0) } == 0,"claim is idempotent")

fun test-seal-detaches-one-owned-snapshot()
  val target = new-registry()
  val first = target.insert(1)
  val second = target.insert(2)
  val third = target.insert(3)
  check(target.has-linked-nodes,"the seal fixture starts physically linked")

  match target.seal-detach
    Nothing -> throw("internal registry: first seal lost its snapshot")
    Just(values) ->
      check(values == [3,2,1],"seal owns the complete newest-first snapshot")

  check(target.sealed,"seal closes the registry before returning")
  check(target.count == 0,"seal clears the live count")
  check(!target.has-linked-nodes,
        "seal releases the registry's physical ownership edge")
  check(first.take.is-nothing && second.take.is-nothing && third.take.is-nothing,
        "snapshot wins every race with stale registration handles")
  check(target.seal-detach.is-nothing,"seal is idempotent")

  val rejected : error<registry-registration<int>> =
    error/try(fn() target.insert(4))
  check(rejected.is-error,"a sealed registry rejects late registration")
  check(target.try-insert(5).is-nothing,
        "non-throwing insertion reports a sealed registry atomically")

fun test-readonly-visit-preserves-registry-order()
  val target = new-registry()
  val first = target.insert(1)
  val second = target.insert(2)
  val third = target.insert(3)
  val seen = hidden([])

  target.visit-readonly(fn(value) {
    store-hidden(seen,Cons(value,load-hidden(seen)))
  })
  check(load-hidden(seen).reverse == [3,2,1],
        "readonly visit preserves newest-first registration order")
  check(target.count == 3,
        "readonly visit leaves every registration linked")

  val _ = second.take
  store-hidden(seen,[])
  target.visit-readonly(fn(value) {
    store-hidden(seen,Cons(value,load-hidden(seen)))
  })
  check(load-hidden(seen).reverse == [3,1],
        "readonly visit follows the remaining physical chain")
  val _ = first.take
  val _ = third.take
  ()

pub fun main()
  test-removable-registrations-scale-linearly()
  test-seal-detaches-one-owned-snapshot()
  test-readonly-visit-preserves-registry-order()
  println("internal-registry: all checks passed")
