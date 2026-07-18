module work-transaction

import kokaine/reactive/internal/work-transaction
import kokaine/reactive/internal/scheduler
import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import std/core/unsafe
import std/core/undiv


effect ctl abandon-transaction() : ()

fun completes-transaction(action : () -> <abandon-transaction,pure|e> bool)
                         : <pure|e> bool
  with final ctl abandon-transaction() False
  action()

fun require-transaction(action : () -> <abandon-transaction,pure|e> a)
                        : <div,exn|e> a
  with final ctl abandon-transaction()
    throw("unexpected scheduler transaction abandonment")
  action()

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

fun discard-quietly(lease : provision-lease<total>) : ()
  with catch fn(_) ()
  discard-provision(lease)

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
  val (root,transaction) : (root<total>,provision-lease<total>) =
    create-root fn(root)
      val transaction = open-provision(root)
      val outer = create-effect(root,fn() 1,fn(_)
        emit(events,"outer")
        val inner = create-effect(root,fn() 2,fn(_)
          emit(events,"inner")
        )
        ()
      )
      transaction

  check(hidden-load(events).is-nil,
        "global flushing cannot consume an open transaction")
  pretend-no-div{ drain-provision(transaction) }
  check(hidden-load(events) == ["outer","inner"],
        "local draining includes nested bootstrap work in FIFO order")
  match transaction.state
    Work-ready -> ()
    _ -> throw("work transaction: a successful local drain must be ready")
  pretend-no-div{ promote-provision(transaction) }
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
  val transaction = open-provision(root)
  update(root){ source.set(1) }
  check(hidden-load(seen) == ["0","1"],
        "a live resumption never waits in the bootstrap transaction")
  discard-provision(transaction)
  match transaction.state
    Work-aborted -> ()
    _ -> throw("work transaction: abort must be terminal")
  stop()
  root.dispose()

  val abandoned = hidden(False)
  val (other,pending) : (root<total>,provision-lease<total>) =
    create-root fn(other-root)
      val pending = open-provision(other-root)
      val pending-effect = create-effect(other-root,fn() (),fn(_)
        hidden-store(abandoned,True)
      )
      pending
  discard-provision(pending)
  check(!hidden-load(abandoned),"abort drops an unstarted local bootstrap")
  other.dispose()

fun test-abort-retires-an-unstarted-derived-scope()
  val runs = hidden(0)
  val (root,(transaction,value))
      : (root<total>,(provision-lease<total>,memo<int>)) =
    create-root fn(root)
      val transaction = open-provision(root)
      val value = derive(root,0,fn()
        hidden-store(runs,hidden-load(runs) + 1)
        42
      )
      (transaction,value)

  check(hidden-load(runs) == 0,
        "an open transaction keeps the derived bootstrap local")
  discard-provision(transaction)
  val pulled : error<int> = mask<exn>{
    error/try(fn() sample(root){ value.get })
  }
  check(pulled.is-error,
        "an aborted derived scope cannot bootstrap through a direct pull")
  check(hidden-load(runs) == 0,
        "abort retires the derived bootstrap closure without running it")
  root.dispose()

fun test-abort-retires-successfully-drained-scopes()
  val events = hidden([])
  val (root,(source,transaction)) = create-root fn(root)
    val source = signal(root,0)
    val transaction = open-provision(root)
    val stop = create-effect(root,fn() source.get,fn(value)
      emit(events,"run:" ++ value.show)
      on-cleanup(root,fn() emit(events,"clean:" ++ value.show))
    )
    (source,transaction)

  pretend-no-div{ drain-provision(transaction) }
  check(hidden-load(events) == ["run:0"],
        "the ready transaction publishes its local scope once")

  discard-provision(transaction)
  check(hidden-load(events) == ["run:0","clean:0"],
        "aborting ready work retires every successfully drained scope")

  update(root){ source.set(1) }
  check(hidden-load(events) == ["run:0","clean:0"],
        "an aborted ready scope cannot remain subscribed")
  root.dispose()

fun test-failed-transaction-abort-retires-successful-prefix()
  val events = hidden([])
  val (root,transaction) : (root<total>,provision-lease<total>) =
    create-root fn(root)
      val transaction = open-provision(root)
      val first = create-effect(root,fn() (),fn(_)
        emit(events,"first-run")
        on-cleanup(root,fn() emit(events,"first-clean"))
      )
      val second = create-effect(root,fn() (),fn(_)
        emit(events,"second-fails")
        throw("intentional transaction drain failure")
      )
      transaction

  val drained : error<()> = mask<exn>{
    error/try(fn() pretend-no-div{
      drain-provision(transaction)
    })
  }
  check(drained.is-error,"the failing local bootstrap escapes the drain")
  match transaction.state
    Work-failed(_) -> ()
    _ -> throw("work transaction: a failed drain must retain failure state")

  discard-provision(transaction)
  check(hidden-load(events) ==
          ["first-run","second-fails","first-clean"],
        "aborting failed work retires its successful prefix")
  root.dispose()

fun test-final-control-aborts_and_detaches_the_active_transaction()
  val abandoned-runs = hidden(0)
  val prefix-cleanups = hidden(0)
  val built = require-transaction fn()
    create-root fn(root)
      val transaction = open-provision(root)
      val prefix-stop = create-effect(root,fn() (),fn(_)
        on-cleanup(root,fn()
          hidden-store(prefix-cleanups,hidden-load(prefix-cleanups) + 1)
        )
      )
      val pending = create-effect(root,fn() (),fn(_)
        hidden-store(abandoned-runs,hidden-load(abandoned-runs) + 1)
        abandon-transaction()
      )
      transaction
  val (root,transaction) = built

  val completed = completes-transaction fn()
    pretend-no-div{ drain-provision(transaction) }
    True
  check(!completed,"final control abandons the local bootstrap turn")
  check(hidden-load(abandoned-runs) == 1,
        "the abandoning bootstrap starts exactly once")
  check(hidden-load(prefix-cleanups) == 1,
        "dynamic abort retires every successfully drained prefix scope")
  match transaction.state
    Work-aborted -> ()
    _ -> throw("work transaction: final control must abort the transaction")

  val recovery-runs = hidden(0)
  val recovery = open-provision(root)
  val recovery-stop = require-transaction fn()
    update(root){
      create-effect(root,fn() (),fn(_)
        hidden-store(recovery-runs,hidden-load(recovery-runs) + 1)
      )
  }
  require-transaction fn()
    pretend-no-div{ drain-provision(recovery) }
  require-transaction fn()
    pretend-no-div{ promote-provision(recovery) }
  check(hidden-load(recovery-runs) == 1,
        "a fresh transaction opens and drains after dynamic rollback")
  require-transaction fn()
    recovery-stop()
    root.dispose()

fun test-root-retirement-claims-active-transaction-before-cleanup-reentry()
  val (root,transaction) : (root<total>,provision-lease<total>) =
    create-root fn(root)
      val transaction = open-provision(root)
      on-cleanup(root,fn() discard-quietly(transaction))
      transaction

  root.dispose()
  match transaction.state
    Work-aborted -> ()
    _ -> throw(
      "work transaction: root retirement must claim active groups before cleanup")

pub fun main()
  test-deque-routing-is-stack-safe()
  test-bootstrap-routing-follows-the-transaction-state()
  test-scheduler-drains_only_the_local_bootstrap_group()
  test-resume_is_global_and_abort_discards_bootstrap_work()
  test-abort-retires-an-unstarted-derived-scope()
  test-abort-retires-successfully-drained-scopes()
  test-failed-transaction-abort-retires-successful-prefix()
  test-final-control-aborts_and_detaches_the_active_transaction()
  test-root-retirement-claims-active-transaction-before-cleanup-reentry()
  println("work-transaction: all checks passed")
