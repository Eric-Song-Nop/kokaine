module async-host-dispatcher

import kokaine/async/effects
import kokaine/reactive
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

pub fun main()
  test-dispatcher-controls-generation-resumption()
  test-scheduled-action-uses-the-dispatcher()
  test-disposal-invalidates-posted-turn()
  test-dispatch-rejection-cancels-the-ready-task()
  test-dispatch-rejection-batches-finalizer-writes()
  println("async host dispatcher: all checks passed")
