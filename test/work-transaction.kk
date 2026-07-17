module work-transaction

import kokaine/reactive/internal/work-transaction
import std/core/undiv


fun check(ok : bool, message : string)
  if ok then () else throw("work transaction: " ++ message)

tail fun append-range(queue : work-queue<int>, current : int,
                      limit : int) : <div> ()
  if current >= limit then () else
    queue.append(current)
    append-range(queue,current + 1,limit)

tail fun check-range(queue : work-queue<int>, expected : int,
                     limit : int) : <div,exn> ()
  if expected >= limit then
    check(queue.pop.is-nothing,"the deque is exhausted exactly once")
  else
    match queue.pop
      Nothing -> throw("work transaction: deque ended early")
      Just(actual) ->
        check(actual == expected,"the deque preserves FIFO append order")
        check-range(queue,expected + 1,limit)

fun test-deque-routing-is-stack-safe()
  val queue = new-work-queue()
  val size = 50000
  pretend-no-div{ append-range(queue,0,size) }
  queue.prepend(-1)
  check(queue.pop == Just(-1),"prepend gives resumptions priority")
  pretend-no-div{ check-range(queue,0,size) }

fun test-bootstrap-routing-follows-the-transaction-state()
  val global = new-work-queue()
  val state = new-work-transaction-state()
  val group = new-work-group(state)

  route-bootstrap(global,Just(group),1)
  route-bootstrap(global,Just(group),2)
  route-resume(global,9)
  check(group.values == [1,2],"open bootstrap work stays local and FIFO")
  check(global.values == [9],"resume work always enters the global frontier")

  check(group.begin-drain,"an open group starts draining once")
  check(group.pop == Just(1),"the local drain observes its first bootstrap")
  route-bootstrap(global,Just(group),3)
  route-resume(global,8)
  check(group.values == [2,3],"nested bootstrap appends to the active group")
  check(global.values == [8,9],"nested resume still preempts globally")

  check(group.mark-ready,"a draining group can freeze as ready")
  route-bootstrap(global,Just(group),4)
  check(global.values == [8,9,4],"ready groups no longer capture bootstrap work")
  check(group.mark-aborted,"a ready group can be aborted")
  check(group.values.is-nil,"abort discards uncommitted local work")

pub fun main()
  test-deque-routing-is-stack-safe()
  test-bootstrap-routing-follows-the-transaction-state()
  println("work-transaction: all checks passed")
