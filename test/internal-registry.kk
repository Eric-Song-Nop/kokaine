module internal-registry

import kokaine/reactive/internal/registry


fun check(ok : bool, message : string)
  if ok then () else throw("internal registry: " ++ message)

tail fun insert-many(target : registry<int>, next : int, remaining : int,
                     handles : list<registry-registration<int>>)
                    : exn list<registry-registration<int>>
  if remaining <= 0 then handles else
    val handle = target.insert(next)
    insert-many(target,next + 1,remaining - 1,Cons(handle,handles))

tail fun take-all(handles : list<registry-registration<int>>, total : int)
                  : int
  match handles
    Nil -> total
    Cons(handle,rest) ->
      match handle.take
        Nothing -> take-all(rest,total)
        Just(value) -> take-all(rest,total + value)

fun test-removable-registrations-scale-linearly()
  val target = new-registry()
  val size = 50000
  val handles = insert-many(target,0,size,[])

  check(target.count == size,"insert count is exact")
  check(target.snapshot.take(4) == [size - 1,size - 2,size - 3,size - 4],
        "snapshot preserves newest-first registration order")

  val sum = take-all(handles,0)
  val expected = pretend-no-div{ ((size - 1) * size) / 2 }
  check(sum == expected,"every registration was claimed exactly once")
  check(target.count == 0,"claims physically unlink every node")
  check(target.snapshot == [],"claimed nodes leave no tombstones")
  check(take-all(handles,0) == 0,"claim is idempotent")

fun test-seal-detaches-one-owned-snapshot()
  val target = new-registry()
  val first = target.insert(1)
  val second = target.insert(2)
  val third = target.insert(3)

  match target.seal-detach
    Nothing -> throw("internal registry: first seal lost its snapshot")
    Just(values) ->
      check(values == [3,2,1],"seal owns the complete newest-first snapshot")

  check(target.sealed,"seal closes the registry before returning")
  check(target.count == 0,"seal clears the live count")
  check(first.take.is-nothing && second.take.is-nothing && third.take.is-nothing,
        "snapshot wins every race with stale registration handles")
  check(target.seal-detach.is-nothing,"seal is idempotent")

  val rejected : error<registry-registration<int>> =
    error/try(fn() target.insert(4))
  check(rejected.is-error,"a sealed registry rejects late registration")

pub fun main()
  test-removable-registrations-scale-linearly()
  test-seal-detaches-one-owned-snapshot()
  println("internal-registry: all checks passed")
