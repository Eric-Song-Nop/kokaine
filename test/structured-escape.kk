module structured-escape

// Child final controls in race/parallel. Run on the JavaScript backend: Koka
// 3.2.3's C runtime corrupts its heap when re-yielding these controls (fixed
// upstream in koka-lang/koka@cf8711e, released in 3.2.8).

import kokaine/async/effects
import kokaine/async/structured
import std/core/unsafe
import std/core/undiv


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
val ownership-release-calls : ref<global,int> = hidden(0)

fun reset-host() : ()
  store(pending,[])
  store(canceled,[])
  store(installed-scopes,[])
  store(ownership-release-calls,0)

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
  fun complete(result)
    if !load(completed) then
      store(completed,True)
      callback(result)
  match setup(complete)
    Error(error) -> complete(Exception(error))
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
  with handler<async-ownership>
    fun async-own-disposer(_dispose)
      val live = hidden(True)
      fn()
        store(ownership-release-calls,load(ownership-release-calls) + 1)
        if load(live) then
          store(live,False)
          True
        else False
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

fun immediate-with-disposer(value : a, disposals : ref<global,int>)
                          : <async,exn> a
  mask<exn>{
    setup/await-noexn("immediate with disposer",fn(complete)
      complete(value)
      fn() store(disposals,load(disposals) + 1)
    )
  }


// A final control operation whose handler is installed outside the group.
effect ctl escape-group(code : int) : ()

// The outer handler observes `code` only after every sibling has finished
// unwinding; a negative answer proves that ordering.
fun with-escape(finished : ref<global,bool>,
                action : () -> <escape-group,async,exn> int)
               : <async,exn> int
  with final ctl escape-group(code)
    if load(finished) then 0 - code else 1000 + code
  action()

fun test-race-reraises-child-final-control()
  val disposed = hidden(False)
  val sibling-finalized = hidden(False)
  val escaped-tail = hidden(False)
  val result = run-async(fn()
    with-escape(sibling-finalized,fn()
      race(
        fn() {
          val _ = immediate(1)
          escape-group(7)
          store(escaped-tail,True)
          70
        },
        fn() finally(
          fn() store(sibling-finalized,True),
          fn() never(disposed,"race sibling of an escaping strand")
        )
      )
    )
  )
  check(result == Just(-7),
        "race re-raises a child final control after finishing siblings")
  check(load(disposed),"escaping race disposes the sibling await")
  check(!load(escaped-tail),"final control does not resume the escaping strand")
  check(load(pending).is-nil,"escaping race leaves no pending await")
  check(load(canceled).is-nil,"escaping race releases its cancellation marker")

fun test-parallel-reraises-synchronous-final-control()
  val disposed = hidden(False)
  val sibling-finalized = hidden(False)
  val result = run-async(fn()
    with-escape(sibling-finalized,fn()
      val (a,b) = parallel(
        fn() finally(
          fn() store(sibling-finalized,True),
          fn() never(disposed,"parallel sibling started first")
        ),
        fn() {
          escape-group(8)
          80
        }
      )
      a + b
    )
  )
  check(result == Just(-8),
        "parallel re-raises a final control raised before any await")
  check(load(disposed),"synchronous escape disposes the earlier sibling")
  check(load(pending).is-nil,"synchronous escape leaves no pending await")
  check(load(canceled).is-nil,"synchronous escape releases its marker")

fun test-final-control-awaits-sibling-cleanup()
  val disposed = hidden(False)
  val cleanup-done = hidden(False)
  val cleanup-value = hidden(0)
  val result = run-async(fn()
    with-escape(cleanup-done,fn()
      val (a,b) = parallel(
        fn() {
          val _ = immediate(1)
          escape-group(9)
          90
        },
        fn() finally(
          fn() {
            val first = in-parent-scope(fn() immediate(30))
            val second = in-parent-scope(fn() immediate(12))
            store(cleanup-value,first + second)
            store(cleanup-done,True)
          },
          fn() never(disposed,"parallel sibling with async cleanup")
        )
      )
      a + b
    )
  )
  check(result == Just(-9),
        "final control waits for sibling cleanup awaits before re-raising")
  check(load(cleanup-value) == 42,"sibling cleanup awaits receive real results")
  check(load(pending).is-nil,"async sibling cleanup leaves no pending await")
  check(load(canceled).is-nil,"async sibling cleanup releases its marker")

fun test-cleanup-error-replaces-final-control()
  val disposed = hidden(False)
  val finished = hidden(False)
  val failed = error/try(fn()
    run-async(fn()
      with-escape(finished,fn()
        race(
          fn() {
            val _ = immediate(1)
            escape-group(10)
            100
          },
          fn() finally(
            fn() throw("cleanup after final control"),
            fn() never(disposed,"throwing sibling of an escaping strand")
          )
        )
      )
    )
  )
  match failed
    Error(problem) ->
      check(problem.message == "cleanup after final control",
            "a sibling cleanup exception replaces a pending final control")
    Ok(_) -> check(False,"a sibling cleanup exception was swallowed")
  check(load(disposed),"throwing sibling is disposed before re-raising")
  check(load(canceled).is-nil,"throwing sibling releases the cancel marker")

fun test-later-final-control-replaces-earlier()
  val disposed = hidden(False)
  val finished = hidden(True)
  val result = run-async(fn()
    with-escape(finished,fn()
      race(
        fn() {
          val _ = immediate(1)
          escape-group(11)
          110
        },
        fn() finally(
          fn() escape-group(12),
          fn() never(disposed,"escaping sibling cleanup")
        )
      )
    )
  )
  check(result == Just(-12),
        "a final control from sibling cleanup replaces the earlier one")
  check(load(disposed),"escaping cleanup still disposes the sibling await")
  check(load(canceled).is-nil,"double escape releases the cancel marker")

fun test-final-control-rolls-back-owned()
  val disposals = hidden(0)
  val finished = hidden(True)
  val result = run-async(fn()
    with-escape(finished,fn()
      val (a,b) = parallel(
        fn() {
          val kept-release = async-own(
            fn() store(disposals,load(disposals) + 1))
          5
        },
        fn() {
          val _ = immediate(1)
          val _ = immediate(2)
          escape-group(13)
          130
        }
      )
      a + b
    )
  )
  check(result == Just(-13),"parallel re-raises after an owned sibling result")
  check(load(disposals) == 1,
        "final control rolls back ownership acquired by a finished sibling")


// The parent scope is canceled while the escaping group is still draining a
// sibling whose cleanup awaits. The drain runs inside the driver's `finally`;
// the cancellation must reach the cleanup's await, the drain must finish, and
// the outer race must still report its winner with nothing left pending.
fun test-parent-cancel-during-escape-drain()
  val disposed = hidden(False)
  val cleanup-disposed = hidden(False)
  val cleanup-entered = hidden(False)
  val finished = hidden(False)
  val result = run-async(fn()
    race(
      fn() with-escape(finished,fn()
        val (a,b) = parallel(
          fn() {
            val _ = immediate(1)
            escape-group(14)
            140
          },
          fn() finally(
            fn() {
              store(cleanup-entered,True)
              val _ : int = in-parent-scope(fn() never(cleanup-disposed,"cleanup await during escape drain"))
              store(finished,True)
            },
            fn() never(disposed,"sibling of an escaping strand under a canceled parent")
          )
        )
        a + b
      ),
      fn() immediate(5)
    )
  )
  check(result == Just(5),"the outer race winner survives an escape drain")
  check(load(cleanup-entered),"the escaping group started draining its sibling")
  check(load(disposed),"the sibling's own await was disposed")
  check(load(cleanup-disposed),"parent cancellation reaches the cleanup await")
  check(load(pending).is-nil,"no await stays pending after the canceled drain")
  check(load(canceled).is-nil,"every cancellation marker is released")

pub fun main()
  test-race-reraises-child-final-control()
  test-parallel-reraises-synchronous-final-control()
  test-final-control-awaits-sibling-cleanup()
  test-cleanup-error-replaces-final-control()
  test-later-final-control-replaces-earlier()
  test-final-control-rolls-back-owned()
  test-parent-cancel-during-escape-drain()
  println("structured-escape: all checks passed")
