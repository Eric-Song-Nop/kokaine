module work-transaction

import kokaine/reactive/internal/work-transaction
import kokaine/reactive/internal/scheduler
import kokaine/reactive
import std/core/unsafe
import std/core/undiv


fun check(ok : bool, message : string)
  if ok then () else throw("work transaction: " ++ message)

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun emit(events : ref<global,list<string>>, event : string) : ()
  hidden-store(events,hidden-load(events) ++ [event])

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

fun test-scheduler-drains_only_the_local_bootstrap_group()
  val events = hidden([])
  val (root,transaction) : (root<total>,scheduler-transaction<total>) =
    create-root fn(root)
      val transaction = open-work-transaction(root)
      val _ = create-effect(root,fn() 1,fn(_)
        emit(events,"outer")
        val _ = create-effect(root,fn() 2,fn(_)
          emit(events,"inner")
        )
        ()
      )
      transaction

  check(hidden-load(events).is-nil,
        "global flushing cannot consume an open transaction")
  drain-work-transaction(root,transaction)
  check(hidden-load(events) == ["outer","inner"],
        "local draining includes nested bootstrap work in FIFO order")
  match transaction.state
    Work-ready -> ()
    _ -> throw("work transaction: a successful local drain must be ready")
  commit-work-transaction(root,transaction)
  match transaction.state
    Work-committed -> ()
    _ -> throw("work transaction: a ready group must commit exactly once")
  root.dispose()

fun test-resume_is_global_and_abort_discards_bootstrap_work()
  val seen = hidden([])
  val (root,(source,stop)) = create-root fn(root)
    val source = signal(root,0)
    val stop = create-effect(root,fn() source.get,
      fn(value) emit(seen,value.show))
    (source,stop)
  val transaction = open-work-transaction(root)
  update(root){ source.set(1) }
  check(hidden-load(seen) == ["0","1"],
        "a live resumption never waits in the bootstrap transaction")
  abort-work-transaction(root,transaction)
  match transaction.state
    Work-aborted -> ()
    _ -> throw("work transaction: abort must be terminal")
  stop()
  root.dispose()

  val abandoned = hidden(False)
  val (other,pending) : (root<total>,scheduler-transaction<total>) =
    create-root fn(root)
      val pending = open-work-transaction(root)
      val _ = create-effect(root,fn() (),fn(_)
        hidden-store(abandoned,True)
      )
      pending
  abort-work-transaction(other,pending)
  check(!hidden-load(abandoned),"abort drops an unstarted local bootstrap")
  other.dispose()

pub fun main()
  test-deque-routing-is-stack-safe()
  test-bootstrap-routing-follows-the-transaction-state()
  test-scheduler-drains_only_the_local_bootstrap_group()
  test-resume_is_global_and_abort_discards_bootstrap_work()
  println("work-transaction: all checks passed")
