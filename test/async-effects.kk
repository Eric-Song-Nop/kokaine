module async-effects

import kokaine/async
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

type completion-mode
  Complete-from-setup
  Forced-exception(error : exception)
  Forced-cancel

// A deterministic interpreter for algebra tests. Successful results are read
// from a synchronously invoked setup callback, which keeps this handler
// polymorphic in every individual `do-await` result type.
fun run-result(mode : completion-mode,
               action : () -> <async,exn> b) : <ui,exn> maybe<b>
  with handler<async-await>
    ctl do-await(setup,_scope,_label)
      match mode
        Forced-exception(error) -> resume(Exception(error))
        Forced-cancel -> resume(Cancel)
        Complete-from-setup ->
          val completed = hidden(Nothing)
          val capture = fn(result,_is-done)
            store(completed,Just(result))
          val installed = setup(capture)
          match installed
            Error(error) -> resume(Exception(error))
            Ok(_dispose) ->
              match load(completed)
                Just(result) -> resume(result)
                Nothing -> resume(Exception(
                  Exception("test setup did not complete synchronously",
                            ExnError)))
    fun no-await(_setup,_scope,_label,_callback) ()
  with handler<async-ioc>
    fun async-ioc(host-action) host-action()
    fun async-schedule-ioc(_scope,host-action) host-action()
  with handler<async-ownership>
    fun async-own-disposer(_dispose) fn() True
  with handler<async-cancel>
    val async-scope = root-scope
    fun cancel-scope(_scope) ()
    fun release-canceled-scope(_scope) ()
    fun is-scope-canceled(_scope) False
  with handler<discontinue>
    return(value) Just(value)
    final ctl discontinue() Nothing
  action()

fun test-await-results()
  val done = run-result(Complete-from-setup,fn()
    await1-noexn("result",fn(complete) complete(42))
  )
  check(done == Just(42),"Result resumes a direct-style await")

  val finalized = hidden(False)
  val canceled = run-result(Forced-cancel,fn()
    finally(
      fn() store(finalized,True),
      fn() await1-noexn("cancel",fn(_resume) ())
    )
  )
  check(canceled.is-nothing,"Cancel discontinues instead of returning")
  check(load(finalized),"Cancel executes finally clauses")

  val failed = error/try(fn()
    run-result(Forced-exception(Exception("async failure",ExnError)),fn()
      await1("exception",fn(_resume) Ok(fn() ()))
    )
  )
  match failed
    Error(problem) ->
      check(problem.message == "async failure",
            "Exception becomes the ordinary exn path")
    Ok(_) -> check(False,"Exception must not become a value")

fun test-scopes()
  val child = run-result(Complete-from-setup,fn()
    cancelation-scope(fn() async-scope)
  )
  match child
    Nothing -> check(False,"child scope unexpectedly canceled")
    Just(scope) ->
      check(scope != root-scope,"cancelation-scope allocates a child")
      check(scope <= root-scope,"child scope records its root ancestor")
      check(scope.parent == root-scope,"child scope exposes its parent")

  val parent = run-result(Complete-from-setup,fn()
    cancelation-scope(fn()
      in-parent-scope(fn() async-scope)
    )
  )
  check(parent == Just(root-scope),"in-parent-scope restores the parent")

pub fun main()
  test-await-results()
  test-scopes()
  println("async-effects: all checks passed")
