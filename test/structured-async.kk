module structured-async

import kokaine/async/effects
import kokaine/async/structured
import std/core/unsafe


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun check(ok : bool, label : string)
  if ok then println("ok: " ++ label)
  else throw("FAILED: " ++ label)


// The fake host retains only a type-erased cancellation closure. This lets a
// single deterministic registry cover awaits with different result types.
type pending-await
  Pending-await(scope : async-scope, cancel : () -> ui ())

val pending : ref<global,list<pending-await>> = hidden([])
val canceled : ref<global,list<async-scope>> = hidden([])
val installed-scopes : ref<global,list<async-scope>> = hidden([])

fun reset-host() : ()
  store(pending,[])
  store(canceled,[])
  store(installed-scopes,[])

fun scope-is-canceled(scope : async-scope) : bool
  load(canceled).any(fn(parent) scope <= parent)

fun add-pending(value : pending-await) : ()
  store(pending,Cons(value,load(pending)))

fun cancel-pending(scope : async-scope) : ui ()
  store(canceled,Cons(scope,load(canceled)))
  val awaits = load(pending)
  store(pending,[])
  awaits.foreach fn(item)
    match item
      Pending-await(owner,cancel) ->
        if owner <= scope then cancel()
        else add-pending(item)

fun release-canceled(scope : async-scope) : ui ()
  store(canceled,load(canceled).filter(fn(current) !(current == scope)))

fun install-no-await(setup : await-setup<a>, scope : async-scope,
                     callback : await-result<a> -> ui ()) : ui ()
  store(installed-scopes,Cons(scope,load(installed-scopes)))
  val completed = hidden(False)
  fun complete(result,is-done)
    if is-done && !load(completed) then
      store(completed,True)
      callback(result)
  match setup(complete)
    Error(error) -> complete(Exception(error),True)
    Ok(dispose) ->
      if load(completed) then ()
      else if scope-is-canceled(scope) then
        store(completed,True)
        dispose()
        callback(Cancel)
      else
        add-pending(Pending-await(scope,fn()
          if !load(completed) then
            store(completed,True)
            dispose()
            callback(Cancel)
        ))

fun run-async(action : () -> <async,exn> a) : <ui,exn> maybe<a>
  reset-host()
  with handler<async-await>
    ctl do-await(_setup,_scope,label)
      resume(Exception(Exception(
        "fake host unexpectedly blocked on " ++ label,ExnError)))
    fun no-await(setup,scope,_label,callback)
      install-no-await(setup,scope,callback)
  with handler<async-ioc>
    fun async-ioc(host-action) host-action()
    fun async-schedule-ioc(_scope,host-action) host-action()
    fun async-own-disposer(_dispose) fn() ()
  with handler<async-cancel>
    val async-scope = root-scope
    fun cancel-scope(scope) cancel-pending(scope)
    fun release-canceled-scope(scope) release-canceled(scope)
    fun is-scope-canceled(scope) scope-is-canceled(scope)
  with handler<discontinue>
    return(value) Just(value)
    final ctl discontinue() Nothing
  action()


fun immediate(value : a) : <async,exn> a
  mask<exn>{ await1-noexn("immediate",fn(complete) complete(value)) }

fun never(disposed : ref<global,bool>, label : string) : <async,exn> a
  mask<exn>{
    setup/await-noexn(label,fn(_complete)
      fn() store(disposed,True)
    )
  }

fun fail-after-await() : <async,exn> int
  await1("failed",fn(_complete)
    Error(Exception("expected strand failure",ExnError))
  )

fun test-parallel()
  val result = run-async(fn()
    parallel(fn() immediate(11),fn() immediate(22))
  )
  check(result == Just((11,22)),
        "parallel preserves argument order across queued completions")

fun test-sequential-awaits-keep-group-scope()
  val result = run-async(fn()
    parallel(
      fn() {
        val _ = immediate(1)
        immediate(2)
      },
      fn() immediate(3)
    )
  )
  check(result == Just((2,3)),
        "parallel resumes a child through sequential awaits")
  val scopes = load(installed-scopes)
  check(scopes.length == 3,
        "parallel installed all sequential child awaits")
  match scopes
    Cons(first,rest) ->
      check(first != root-scope,
            "structured awaits use an explicit child scope")
      check(rest.all(fn(scope) scope == first),
            "sequential and sibling awaits share the group scope")
    Nil -> check(False,"structured scope ledger unexpectedly empty")

fun test-race-drains-loser()
  val disposed = hidden(False)
  val finalized = hidden(False)
  val finalizer-saw-cancel = hidden(False)
  val result = run-async(fn()
    race(
      fn() immediate(7),
      fn() finally(
        fn() {
          store(finalized,True)
          store(finalizer-saw-cancel,is-canceled())
        },
        fn() never(disposed,"race loser")
      )
    )
  )
  check(result == Just(7),"race returns the first result")
  check(load(disposed),"race invokes the losing await disposer")
  check(load(finalized),"race drains the losing strand finalizer")
  check(load(finalizer-saw-cancel),
        "canceled scope remains visible while loser finalizers drain")
  check(load(pending).length == 0,"race leaves no retained fake-host await")
  check(load(canceled).is-nil,
        "structured scope releases its cancellation marker after drain")

fun test-race-cancels-queued-result()
  val winner-continued = hidden(False)
  val loser-continued = hidden(False)
  val loser-finalized = hidden(False)
  val result = run-async(fn()
    race(
      fn() {
        val value = immediate(17)
        store(winner-continued,True)
        value
      },
      fn() finally(
        fn() store(loser-finalized,True),
        fn()
          val value = immediate(29)
          store(loser-continued,True)
          value
      )
    )
  )
  check(result == Just(17),"race keeps the first queued completion")
  check(load(winner-continued),"race resumes the queued winner")
  check(!load(loser-continued),
        "race cancel-resumes a queued loser before its suffix runs")
  check(load(loser-finalized),
        "race finalizes a loser whose host task already completed")

fun test-timeout-drains-action()
  val disposed = hidden(False)
  val finalized = hidden(False)
  val result : maybe<maybe<int>> = run-async(fn()
    timeout-with(
      fn() immediate(()),
      fn() finally(
        fn() store(finalized,True),
        fn() never(disposed,"timed action")
      )
    )
  )
  check(result == Just(Nothing),"timeout-with returns Nothing on timer win")
  check(load(disposed),"timeout-with cancels the timed action")
  check(load(finalized),"timeout-with drains the timed action finalizer")

fun test-timeout-action-wins()
  val disposed = hidden(False)
  val finalized = hidden(False)
  val result = run-async(fn()
    timeout-with(
      fn() finally(
        fn() store(finalized,True),
        fn() never(disposed,"losing timer")
      ),
      fn() immediate(31)
    )
  )
  check(result == Just(Just(31)),
        "timeout-with returns Just when the action wins")
  check(load(disposed),"timeout-with cancels the losing timer")
  check(load(finalized),"timeout-with drains the timer finalizer")

fun test-race-drains-after-error()
  val disposed = hidden(False)
  val finalized = hidden(False)
  val failed = error/try(fn()
    run-async(fn()
      race(
        fn() fail-after-await(),
        fn() finally(
          fn() store(finalized,True),
          fn() never(disposed,"error loser")
        )
      )
    )
  )
  match failed
    Error(problem) ->
      check(problem.message == "expected strand failure",
            "race propagates the winning async error")
    Ok(_) -> check(False,"race must not turn an async error into a value")
  check(load(disposed),"async error cancels the losing await")
  check(load(finalized),"async error drains the losing finalizer")
  check(load(pending).length == 0,
        "async error leaves no retained fake-host await")

fun test-parallel-error-cancels-queued-result()
  val continued = hidden(False)
  val finalized = hidden(False)
  val failed = error/try(fn()
    run-async(fn()
      parallel(
        fn() fail-after-await(),
        fn() finally(
          fn() store(finalized,True),
          fn()
            val value = immediate(41)
            store(continued,True)
            value
        )
      )
    )
  )
  match failed
    Error(problem) ->
      check(problem.message == "expected strand failure",
            "parallel propagates a queued async failure")
    Ok(_) -> check(False,"parallel must propagate its queued failure")
  check(!load(continued),
        "parallel cancel-resumes a queued result after sibling failure")
  check(load(finalized),
        "parallel finalizes a queued result after sibling failure")

fun test-race-propagates-loser-cleanup-error()
  val disposed = hidden(False)
  val failed = error/try(fn()
    run-async(fn()
      race(
        fn() immediate(53),
        fn() finally(
          fn() throw("race loser cleanup failure"),
          fn() never(disposed,"throwing race loser")
        )
      )
    )
  )
  match failed
    Error(problem) ->
      check(problem.message == "race loser cleanup failure",
            "race propagates a losing finalizer exception")
    Ok(_) -> check(False,"race swallowed a losing finalizer exception")
  check(load(disposed),"race disposes a loser before cleanup throws")

fun test-parallel-prefers-cleanup-error()
  val disposed = hidden(False)
  val failed = error/try(fn()
    run-async(fn()
      parallel(
        fn() fail-after-await(),
        fn() finally(
          fn() throw("parallel cleanup failure"),
          fn() never(disposed,"throwing parallel loser")
        )
      )
    )
  )
  match failed
    Error(problem) ->
      check(problem.message == "parallel cleanup failure",
            "parallel cleanup exception replaces the triggering failure")
    Ok(_) -> check(False,"parallel swallowed a cleanup exception")
  check(load(disposed),"parallel disposes a sibling before cleanup throws")

fun test-race-resumes-awaits-in-loser-cleanup()
  val disposed = hidden(False)
  val cleanup-value = hidden(0)
  val cleanup-tail = hidden(False)
  val cleanup-finalized = hidden(False)
  val result = run-async(fn()
    race(
      fn() immediate(61),
      fn() finally(
        fn() finally(
          fn() store(cleanup-finalized,True),
          fn()
            val first = in-parent-scope(fn() immediate(21))
            val second = in-parent-scope(fn() immediate(22))
            store(cleanup-value,first + second)
            store(cleanup-tail,True)
        ),
        fn() never(disposed,"awaiting race loser cleanup")
      )
    )
  )
  check(result == Just(61),
        "race preserves its winner while loser cleanup awaits")
  check(load(disposed),"race disposes the awaiting loser")
  check(load(cleanup-value) == 43,
        "race resumes every parent-scope cleanup await")
  check(load(cleanup-tail),"race executes the tail after cleanup awaits")
  check(load(cleanup-finalized),"race finalizes the async cleanup extent")
  check(load(pending).is-nil,"async cleanup leaves no pending await")
  check(load(canceled).is-nil,
        "async cleanup releases its cancellation marker")

pub fun main()
  test-parallel()
  test-sequential-awaits-keep-group-scope()
  test-race-drains-loser()
  test-race-cancels-queued-result()
  test-timeout-drains-action()
  test-timeout-action-wins()
  test-race-drains-after-error()
  test-parallel-error-cancels-queued-result()
  test-race-propagates-loser-cleanup-error()
  test-parallel-prefers-cleanup-error()
  test-race-resumes-awaits-in-loser-cleanup()
  println("structured-async: all checks passed")
