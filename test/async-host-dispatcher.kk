module async-host-dispatcher

import kokaine/async/effects
import kokaine/reactive
import kokaine/reactive/integration
import kokaine/reactive/async/integration
import kokaine/reactive/async/internal/runtime
import std/core/unsafe


fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun hidden-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun hidden-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun check(ok : bool, message : string)
  if ok then () else throw("async host dispatcher: " ++ message)

fun require-completion(slot : ref<global,maybe<int -> ui ()>>)
                       : exn (int -> ui ())
  match hidden-load(slot)
    Nothing -> throw("async host dispatcher: completion was not captured")
    Just(value) -> value

fun run-next(turns : ref<global,list<() -> ui ()>>) : <ui,exn> ()
  match hidden-load(turns)
    Nil -> throw("async host dispatcher: no retained host turn")
    Cons(turn,rest) ->
      hidden-store(turns,rest)
      turn()

fun dispatcher-for(turns : ref<global,list<() -> ui ()>>)
                  : async-host-dispatcher
  new-async-host-dispatcher(fn(action)
    hidden-store(turns,hidden-load(turns) ++ [action])
    True
  )

fun start-pending-task(
    root : root<<ui>>,
    dispatcher : async-host-dispatcher,
    completion : ref<global,maybe<int -> ui ()>>,
    resumed : ref<global,int>,
    disposals : ref<global,int>,
    finalizers : ref<global,int>,
    label : string)
    : <signal-write,pure,ui> ()
  mask<div>{
    mask<signal-write>{
      dispatch(root,fn()
        run-async-with-dispatcher(root,dispatcher,fn()
          finally(
            fn() hidden-store(finalizers,hidden-load(finalizers) + 1),
            fn()
              val _ = setup/await-noexn(label,fn(complete)
                hidden-store(completion,Just(complete))
                fn() hidden-store(disposals,hidden-load(disposals) + 1)
              )
              hidden-store(resumed,hidden-load(resumed) + 1)
          )
        )
      )
    }
  }

fun complete-if-present(
    completion : ref<global,maybe<int -> ui ()>>, value : int) : ui ()
  match hidden-load(completion)
    Nothing -> ()
    Just(complete) -> complete(value)

fun dispose-root-quietly(root : root<<ui>>) : ui ()
  with catch fn(_problem) ()
  root.dispose()

fun test-dispatcher-controls-generation-resumption()
  val turns : ref<global,list<() -> ui ()>> = hidden([])
  val dispatcher = dispatcher-for(turns)
  val completion : ref<global,maybe<int -> ui ()>> = hidden(Nothing)
  val observed = hidden(0)
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()

  dispatch(root,fn()
    run-async-with-dispatcher(root,dispatcher,fn()
      val value = setup/await-noexn("injected host turn",fn(complete)
        hidden-store(completion,Just(complete))
        fn() ()
      )
      hidden-store(observed,value)
    )
  )
  require-completion(completion)(42)
  check(hidden-load(observed) == 0,
        "accepted completion stays parked until the dispatcher runs it")
  run-next(turns)
  check(hidden-load(observed) == 42,
        "dispatcher resumes the captured generation")
  check(hidden-load(turns).is-nil,
        "one completion schedules exactly one resumption turn")
  root.dispose()

fun test-scheduled-action-uses-the-dispatcher()
  val turns : ref<global,list<() -> ui ()>> = hidden([])
  val dispatcher = dispatcher-for(turns)
  val observed = hidden(0)
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()

  dispatch(root,fn()
    run-async-with-dispatcher(root,dispatcher,fn()
      async-schedule(
        fn() hidden-store(observed,hidden-load(observed) + 1))
    )
  )
  check(hidden-load(turns).length == 1 && hidden-load(observed) == 0,
        "scheduled host action posts its setup turn")
  run-next(turns)
  check(hidden-load(turns).length == 1 && hidden-load(observed) == 0,
        "setup completion posts a separate resumption turn")
  run-next(turns)
  check(hidden-load(turns).is-nil && hidden-load(observed) == 1,
        "resumption executes the scheduled host action exactly once")
  check(generation-async-outstanding() == 0,
        "scheduled host action releases its generation ownership")
  root.dispose()

fun test-disposal-invalidates-posted-turn()
  val turns : ref<global,list<() -> ui ()>> = hidden([])
  val dispatcher = dispatcher-for(turns)
  val completion : ref<global,maybe<int -> ui ()>> = hidden(Nothing)
  val resumed = hidden(0)
  val disposals = hidden(0)
  val finalizers = hidden(0)
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()

  dispatch(root,fn()
    run-async-with-dispatcher(root,dispatcher,fn()
      finally(
        fn() hidden-store(finalizers,hidden-load(finalizers) + 1),
        fn()
          val _ = setup/await-noexn(
            "disposed posted turn",fn(complete)
              hidden-store(completion,Just(complete))
              fn() hidden-store(disposals,hidden-load(disposals) + 1)
          )
          hidden-store(resumed,hidden-load(resumed) + 1)
      )
    )
  )
  require-completion(completion)(7)
  check(hidden-load(turns).length == 1,
        "accepted completion posts one host turn")
  root.dispose()
  check(hidden-load(resumed) == 0,
        "root disposal does not resume the completed value")
  check(hidden-load(disposals) == 1,
        "root disposal claims the host disposer exactly once")
  check(hidden-load(finalizers) == 1,
        "root disposal unwinds the parked strand exactly once")
  check(generation-async-outstanding() == 0,
        "root disposal releases outstanding task ownership")

  run-next(turns)
  check(hidden-load(resumed) == 0,
        "a posted turn is inert after root disposal")
  check(hidden-load(disposals) == 1,
        "the inert turn cannot reclaim the disposer")
  check(hidden-load(finalizers) == 1,
        "the inert turn cannot unwind the strand again")
  check(generation-async-outstanding() == 0,
        "the inert turn cannot revive outstanding ownership")

fun test-dispatch-rejection-cancels-the-ready-task()
  val dispatcher = new-async-host-dispatcher(fn(_action) False)
  val resumed = hidden(0)
  val disposals = hidden(0)
  val finalizers = hidden(0)
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()

  dispatch(root,fn()
    run-async-with-dispatcher(root,dispatcher,fn()
      finally(
        fn() hidden-store(finalizers,hidden-load(finalizers) + 1),
        fn()
          val _ = setup/await-noexn(
            "rejected host turn",fn(complete)
              complete(7)
              fn() hidden-store(disposals,hidden-load(disposals) + 1)
          )
          hidden-store(resumed,hidden-load(resumed) + 1)
      )
    )
  )
  check(hidden-load(resumed) == 0,
        "a rejected dispatcher cannot resume the accepted result inline")
  check(hidden-load(disposals) == 1,
        "late setup disposal is claimed exactly once after rejection")
  check(hidden-load(finalizers) == 1,
        "dispatcher rejection cancels and unwinds the parked strand")
  check(generation-async-outstanding() == 0,
        "dispatcher rejection cannot retain a Ready task")
  root.dispose()

fun test-dispatch-rejection-batches-finalizer-writes()
  val dispatcher = new-async-host-dispatcher(fn(_action) False)
  val observed : ref<global,list<int>> = hidden([])
  val (root,(left,right)) = create-root fn(root)
    val left = signal(root,0)
    val right = signal(root,0)
    val observer = create-effect(root,fn() left.get * 10 + right.get,fn(value)
      hidden-store(observed,hidden-load(observed) ++ [value])
    )
    (left,right)

  dispatch(root,fn()
    run-async-with-dispatcher(root,dispatcher,fn()
      finally(
        fn() {
          left.set(1)
          right.set(2)
        },
        fn()
          val _ = setup/await-noexn(
            "rejected finalizer transaction",fn(complete)
              complete(())
              fn() ()
          )
          ()
      )
    )
  )
  check(hidden-load(observed) == [0,12],
        "dispatcher rejection publishes finalizer writes as one transaction")
  root.dispose()

fun test-dispatcher-root-disposal-wins-before-false-rejection()
  val completion : ref<global,maybe<int -> ui ()>> = hidden(Nothing)
  val resumed = hidden(0)
  val disposals = hidden(0)
  val finalizers = hidden(0)
  val (root,()) : (root<<ui>>,()) = create-root fn(root)
    val dispatcher = new-async-host-dispatcher(fn(_action)
      dispose-root-quietly(root)
      False
    )
    start-pending-task(
      root,dispatcher,completion,resumed,disposals,finalizers,
      "disposal before false rejection")

  complete-if-present(completion,7)
  check(root.is-disposed,
        "dispatcher-triggered root disposal completes")
  check(hidden-load(resumed) == 0,
        "root disposal wins before a rejected ready result")
  check(hidden-load(disposals) == 1,
        "root disposal and rejection cannot double-run the disposer")
  check(hidden-load(finalizers) == 1,
        "root disposal unwinds the parked strand exactly once")
  check(generation-async-outstanding() == 0,
        "root disposal releases a synchronously rejected task")

fun test-rejection-from-retiring-frame-uses-retirement-reentry()
  val dispatcher = new-async-host-dispatcher(fn(_action) False)
  val completion : ref<global,maybe<int -> ui ()>> = hidden(Nothing)
  val resumed = hidden(0)
  val disposals = hidden(0)
  val finalizers = hidden(0)
  val (root,stop) = create-root fn(root)
    create-effect(root,fn() (),fn(_)
      start-pending-task(
        root,dispatcher,completion,resumed,disposals,finalizers,
        "rejection from retired frame")
      // Lifetime finalizers are LIFO. Complete before the supervisor cleanup
      // so dispatcher rejection must select retirement re-entry itself.
      on-cleanup(root,fn() complete-if-present(completion,7))
    )

  stop()
  check(hidden-load(resumed) == 0,
        "a retired generation cannot publish its accepted result")
  check(hidden-load(disposals) == 1,
        "retired-frame rejection claims the host disposer")
  check(hidden-load(finalizers) == 1,
        "retired-frame rejection still unwinds lexical finalizers")
  check(generation-async-outstanding() == 0,
        "retired-frame rejection releases task ownership")
  root.dispose()

fun test-deferred-root-disposal-before-rejection-still-unwinds()
  val completion : ref<global,maybe<int -> ui ()>> = hidden(Nothing)
  val resumed = hidden(0)
  val disposals = hidden(0)
  val finalizers = hidden(0)
  val (root,stop) = create-root fn(root)
    val dispatcher = new-async-host-dispatcher(fn(_action)
      // This runs inside another generation's retirement. Disposal is
      // deferred, but the root must reject fresh live re-entry immediately.
      dispose-root-quietly(root)
      False
    )
    start-pending-task(
      root,dispatcher,completion,resumed,disposals,finalizers,
      "deferred root disposal before rejection")
    create-effect(root,fn() (),fn(_)
      on-cleanup(root,fn() complete-if-present(completion,7))
    )

  stop()
  check(root.is-disposed,
        "deferred root disposal completes after outer retirement")
  check(hidden-load(resumed) == 0,
        "disposing root cannot publish an accepted result")
  check(hidden-load(disposals) == 1,
        "disposing-root rejection claims the host disposer")
  check(hidden-load(finalizers) == 1,
        "disposing-root rejection unwinds lexical finalizers")
  check(generation-async-outstanding() == 0,
        "disposing-root rejection releases task ownership")

fun test-synchronous-accepted-turn-cancels-after-frame-retirement()
  val dispatcher = new-async-host-dispatcher(fn(action)
    action()
    True
  )
  val completion : ref<global,maybe<int -> ui ()>> = hidden(Nothing)
  val resumed = hidden(0)
  val disposals = hidden(0)
  val finalizers = hidden(0)
  val (root,stop) = create-root fn(root)
    create-effect(root,fn() (),fn(_)
      start-pending-task(
        root,dispatcher,completion,resumed,disposals,finalizers,
        "synchronous accepted turn after retirement")
      on-cleanup(root,fn() complete-if-present(completion,7))
    )

  stop()
  check(hidden-load(resumed) == 0,
        "a synchronous host turn cannot resume a retired result")
  check(hidden-load(disposals) == 1,
        "synchronous retired turn claims the host disposer")
  check(hidden-load(finalizers) == 1,
        "synchronous retired turn unwinds lexical finalizers")
  check(generation-async-outstanding() == 0,
        "synchronous retired turn releases task ownership")
  root.dispose()

fun install-pending-no-await(
    scope : async-scope,
    completion : ref<global,maybe<() -> ui ()>>,
    cancellations : ref<global,int>,
    disposals : ref<global,int>,
    label : string) : <async,ui> ()
  val setup : await-setup<()> = fn(complete)
    hidden-store(completion,Just(fn() complete(Result(()))))
    Ok(fn() hidden-store(disposals,hidden-load(disposals) + 1))
  no-await(setup,scope,label,fn(result)
    match result
      Cancel ->
        hidden-store(cancellations,hidden-load(cancellations) + 1)
      _ -> ()
  )

fun run-completion-if-present(
    completion : ref<global,maybe<() -> ui ()>>) : ui ()
  match hidden-load(completion)
    Nothing -> ()
    Just(complete) -> complete()

fun exercise-reused-async-scope-frame-ownership(inner-first : bool)
  val turns : ref<global,list<() -> ui ()>> = hidden([])
  val dispatcher = dispatcher-for(turns)
  val outer-completion : ref<global,maybe<() -> ui ()>> = hidden(Nothing)
  val inner-completion : ref<global,maybe<() -> ui ()>> = hidden(Nothing)
  val outer-cancellations = hidden(0)
  val outer-disposals = hidden(0)
  val inner-cancellations = hidden(0)
  val inner-disposals = hidden(0)
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  val inner = dispatch(root,fn() open-lifetime-scope(root))

  dispatch(root,fn()
    run-async-with-dispatcher(root,dispatcher,fn()
      val scope = async-scope
      if inner-first then
        with-lifetime-scope(root,inner,fn()
          install-pending-no-await(
            scope,inner-completion,inner-cancellations,inner-disposals,
            "inner frame")
        )
        install-pending-no-await(
          scope,outer-completion,outer-cancellations,outer-disposals,
          "outer frame")
      else
        install-pending-no-await(
          scope,outer-completion,outer-cancellations,outer-disposals,
          "outer frame")
        with-lifetime-scope(root,inner,fn()
          install-pending-no-await(
            scope,inner-completion,inner-cancellations,inner-disposals,
            "inner frame")
        )
    )
  )
  check(generation-async-outstanding() == 2,
        "both frame-owned tasks remain pending before retirement")

  inner.dispose
  check(hidden-load(inner-cancellations) == 1,
        "retiring a lifetime frame cancels its own pending task")
  check(hidden-load(inner-disposals) == 1,
        "retiring a lifetime frame disposes its own host operation")
  check(hidden-load(outer-cancellations) == 0 &&
        hidden-load(outer-disposals) == 0,
        "inner retirement leaves the outer frame task alive")
  check(generation-async-outstanding() == 1,
        "inner retirement releases only its exact task ownership")
  run-completion-if-present(inner-completion)
  check(hidden-load(turns).is-nil &&
        hidden-load(inner-cancellations) == 1 &&
        hidden-load(inner-disposals) == 1,
        "a stale inner completion is inert after frame retirement")

  root.dispose()
  check(hidden-load(outer-cancellations) == 1 &&
        hidden-load(outer-disposals) == 1,
        "root retirement later claims the outer frame task")
  check(generation-async-outstanding() == 0,
        "all frame-owned task ownership is eventually released")

fun test-reused-async-scope-keeps-exact-frame-ownership()
  exercise-reused-async-scope-frame-ownership(False)
  exercise-reused-async-scope-frame-ownership(True)

pub fun main()
  test-dispatcher-controls-generation-resumption()
  test-scheduled-action-uses-the-dispatcher()
  test-disposal-invalidates-posted-turn()
  test-dispatch-rejection-cancels-the-ready-task()
  test-dispatch-rejection-batches-finalizer-writes()
  test-dispatcher-root-disposal-wins-before-false-rejection()
  test-rejection-from-retiring-frame-uses-retirement-reentry()
  test-deferred-root-disposal-before-rejection-still-unwinds()
  test-synchronous-accepted-turn-cancels-after-frame-retirement()
  test-reused-async-scope-keeps-exact-frame-ownership()
  println("async host dispatcher: all checks passed")
