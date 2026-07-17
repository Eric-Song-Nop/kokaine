module internal-int-index

import kokaine/internal/int-index


fun check(ok : bool, label : string)
  if ok then () else throw("FAILED: " ++ label)

tail fun insert-range(target : int-index<int>, next : int, remaining : int,
                      registrations : list<int-index-registration<int>>)
    : <div,exn> list<int-index-registration<int>>
  if remaining <= 0 then registrations else
    val registration = target.insert(next,next * 10)
    insert-range(target,next + 1,remaining - 1,
                 Cons(registration,registrations))

tail fun take-all(
    registrations : list<int-index-registration<int>>, total : int)
    : <div> int
  match registrations
    Nil -> total
    Cons(registration,rest) ->
      match registration.take
        Nothing -> take-all(rest,total)
        Just(value) -> take-all(rest,total + value)

pub fun main()
  val index = new-int-index()
  val registrations = insert-range(index,0,12000,[])
  check(index.count == 12000,"index counts every active key")
  check(index.lookup(0) == Just(0),"index finds the first key")
  check(index.lookup(6143) == Just(61430),"index finds a middle key")
  check(index.lookup(11999) == Just(119990),"index finds the last key")
  check(index.lookup(12000).is-nothing,"index rejects a missing key")
  check(index.capacity >= index.count,
        "growth keeps enough buckets for active keys")

  val _ = take-all(registrations,0)
  check(index.count == 0,"registrations unlink every active key")
  check(index.capacity == 16,
        "deletion reclaims the active-index high-water")
  match registrations
    Nil -> check(False,"scale fixture retains a stale registration")
    Cons(stale,_) ->
      check(stale.take.is-nothing,"a stale registration stays one-shot")

  // All three keys share a bucket in the initial table. Removing the middle
  // entry must preserve both neighbors and allow its key to be reused.
  val first = index.insert(1,10)
  val middle = index.insert(17,170)
  val last = index.insert(33,330)
  check(middle.take == Just(170),"collision unlink returns its value")
  check(index.lookup(1) == Just(10),"collision unlink preserves predecessor")
  check(index.lookup(33) == Just(330),"collision unlink preserves successor")
  val replacement = index.insert(17,171)
  check(index.lookup(17) == Just(171),"removed key can be reinserted")
  val _ = first.take
  val _ = last.take
  val _ = replacement.take
  check(index.count == 0 && index.capacity == 16,
        "collision fixture leaves no retained index state")

  println("internal-int-index: all checks passed")
