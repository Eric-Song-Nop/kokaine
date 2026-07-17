module async-resource

import kokaine/reactive
import kokaine/resource
import kokaine/async/effects
import kokaine/async/internal/web-schedule
import kokaine/reactive/internal/async-runtime
import std/core/unsafe


// --------------------------------------------------------------------------
// Browser-visible deterministic test result
// --------------------------------------------------------------------------

extern begin-result() : ui ()
  js inline "globalThis.__kokaineAsyncResource={ done:false, ok:false, message:'' }"

extern publish-result(ok : bool, message : string) : ui ()
  js inline "(function(){ globalThis.__kokaineAsyncResource={ done:true, ok:#1, message:#2 }; if(#1){ console.log('async-resource: all checks passed'); } else { console.error('async-resource: '+#2); } })()"

fun hidden(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun read-cell(value : ref<global,a>) : a
  unsafe-total { !value }

fun write-cell(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

val failures : ref<global,list<string>> = hidden([])
val check-count : ref<global,int> = hidden(0)

fun check(ok : bool, label : string) : ()
  write-cell(check-count,read-cell(check-count) + 1)
  if ok then () else
    write-cell(failures,Cons(label,read-cell(failures)))

fun record-exception(problem : exception) : ()
  write-cell(failures,
    Cons("unexpected exception: " ++ problem.show,read-cell(failures)))

fun stage(action : () -> <ui,exn> ()) : ui ()
  with catch fn(problem) record-exception(problem)
  action()

fun finish() : ui ()
  val messages = read-cell(failures).reverse
  match messages
    Nil -> publish-result(True,read-cell(check-count).show ++ " checks")
    _ -> publish-result(False,messages.join(" | "))


// --------------------------------------------------------------------------
// A cancelable fake host source
// --------------------------------------------------------------------------

type fake-request
  Fake-request(
    request-id : int,
    request-key : int,
    request-complete : error<int> -> ui (),
    request-disposed : ref<global,bool>
  )

val next-request-id : ref<global,int> = hidden(1)
val requests : ref<global,list<fake-request>> = hidden([])
val dispose-count : ref<global,int> = hidden(0)
val self-cancel-setup-count : ref<global,int> = hidden(0)
val self-cancel-finally-count : ref<global,int> = hidden(0)
val staged-load-count : ref<global,int> = hidden(0)
val last-active-owned : ref<global,maybe<owned-host>> = hidden(Nothing)
val last-released-owned : ref<global,maybe<owned-host>> = hidden(Nothing)

// A JavaScript-owned fixture distinguishes a value which is merely still
// stored from one whose underlying host lifetime is still valid.
abstract type owned-host
  Owned-host(host-object : any)

extern new-owned-host(payload : int) : ui owned-host
  js inline "({ payload:#1, live:true, disposeCount:0 })"

extern owned-host/payload(value : owned-host) : ui int
  js inline "Number((#1).payload)"

extern owned-host/live(value : owned-host) : ui bool
  js inline "!!(#1).live"

extern owned-host/disposals(value : owned-host) : ui int
  js inline "Number((#1).disposeCount)"

extern retire-owned-host(value : owned-host) : ui ()
  js inline "(function(host){ if(host.live){ host.live=false; host.disposeCount+=1; } })(#1)"

fun require-stored-owned(slot : ref<global,maybe<owned-host>>,
                         label : string) : exn owned-host
  match read-cell(slot)
    Just(value) -> value
    Nothing -> throw(label)

fun fake-request/request-number(request : fake-request) : int
  match request
    Fake-request(id,_,_,_) -> id

fun fake-request/source-key(request : fake-request) : int
  match request
    Fake-request(_,key,_,_) -> key

fun request-count() : int
  read-cell(requests).length

fun current-request() : exn fake-request
  match read-cell(requests)
    Cons(request,_) -> request
    Nil -> throw("fake loader did not install a request")

fun fake-request/succeed(request : fake-request, value : int) : ui ()
  match request
    Fake-request(_,_,complete,_) -> complete(Ok(value))

fun fake-request/fail(request : fake-request, message : string) : ui ()
  match request
    Fake-request(_,_,complete,_) ->
      complete(Error(Exception(message,ExnError)))

fun retire-fake(disposed : ref<global,bool>) : ui ()
  if read-cell(disposed) then () else
    write-cell(disposed,True)
    write-cell(dispose-count,read-cell(dispose-count) + 1)

fun fake-load(key : int) : <async,ui,exn> int
  setup/await("resource fake " ++ key.show,fn(complete)
    val id = read-cell(next-request-id)
    val disposed = hidden(False)
    write-cell(next-request-id,id + 1)
    write-cell(requests,
      Cons(Fake-request(id,key,complete,disposed),read-cell(requests)))
    Ok(fn() retire-fake(disposed))
  )

fun fake-owned-load(key : int) : <async,ui,exn> owned-host
  val payload = fake-load(key)
  val value = new-owned-host(payload)
  val release = async-own(fn() retire-owned-host(value))
  value

// This shape acquires ownership before its first suspension. Replacing the
// request must retire this active group even though the scheduler constructs
// the next effect generation before finalizing the previous one.
fun active-owned-load(key : int) : <async,ui,exn> owned-host
  val value = new-owned-host(key)
  write-cell(last-active-owned,Just(value))
  val release = async-own(fn() retire-owned-host(value))
  val completed = fake-load(key)
  value

// Releasing an ownership edge transfers the raw host lifetime to the caller.
// A later Resource transition must not reinterpret release as disposal.
fun released-owned-load(key : int) : <async,ui,exn> owned-host
  val value = new-owned-host(key)
  write-cell(last-released-owned,Just(value))
  val release = async-own(fn() retire-owned-host(value))
  release()
  val completed = fake-load(key)
  value

fun cancel-before-setup() : <async,ui,exn> int
  finally(
    fn() write-cell(self-cancel-finally-count,
          read-cell(self-cancel-finally-count) + 1),
    fn() cancelation-scope(fn()
      cancel-outstanding()
      setup/await-noexn("self-canceled resource load",fn(_complete)
        write-cell(self-cancel-setup-count,
          read-cell(self-cancel-setup-count) + 1)
        fn() ()
      )
    )
  )

fun self-cancel-load(_key : int) : <async,ui,exn> int
  cancel-before-setup()

fun staged-self-cancel-load(_key : int) : <async,ui,exn> int
  val request = read-cell(staged-load-count) + 1
  write-cell(staged-load-count,request)
  if request == 1 then
    await1-noexn("self-cancel seed",fn(complete) complete(100))
  elif request == 2 then
    cancel-before-setup()
  else
    await1-noexn("self-cancel recovery",fn(complete) complete(300))


// --------------------------------------------------------------------------
// State assertions
// --------------------------------------------------------------------------

fun read-state(root : root<<ui>>, value : resource<int,int>)
              : <ui,exn> resource-state<int>
  sample(root){ value.state }

fun read-latest(root : root<<ui>>, value : resource<int,int>)
               : <ui,exn> maybe<int>
  sample(root){ value.latest }

fun expect-pending(root : root<<ui>>, value : resource<int,int>,
                   previous : maybe<int>, label : string) : <ui,exn> ()
  match read-state(root,value)
    Pending(actual) -> check(actual == previous,label)
    _ -> check(False,label ++ " (not Pending)")

fun expect-ready(root : root<<ui>>, value : resource<int,int>,
                 expected : int, label : string) : <ui,exn> ()
  match read-state(root,value)
    Ready(actual) -> check(actual == expected,label)
    _ -> check(False,label ++ " (not Ready)")

fun expect-failed(root : root<<ui>>, value : resource<int,int>,
                  expected-message : string, previous : maybe<int>,
                  label : string)
                 : <ui,exn> ()
  match read-state(root,value)
    Failed(problem,actual) ->
      check(problem.message == expected-message && actual == previous,label)
    _ -> check(False,label ++ " (not Failed)")

fun read-owned-state(root : root<<ui>>,
                     value : resource<int,owned-host>)
                    : <ui,exn> resource-state<owned-host>
  sample(root){ value.state }

fun require-owned-ready(root : root<<ui>>,
                        value : resource<int,owned-host>,
                        label : string) : <ui,exn> owned-host
  match read-owned-state(root,value)
    Ready(current) ->
      check(True,label)
      current
    _ ->
      check(False,label)
      throw(label ++ " (not Ready)")

fun require-owned-pending-previous(
    root : root<<ui>>,
    value : resource<int,owned-host>,
    label : string) : <ui,exn> owned-host
  match read-owned-state(root,value)
    Pending(Just(previous)) ->
      check(True,label)
      previous
    _ ->
      check(False,label)
      throw(label ++ " (no Pending previous value)")


// --------------------------------------------------------------------------
// Churn scenario
// --------------------------------------------------------------------------

fun after-initial-failure(root : root<<ui>>, source : signal<int>,
                          value : resource<int,int>) : <ui,exn> ()
  expect-failed(root,value,"initial failure",Nothing,
    "initial rejection publishes Failed without a previous value")

  update(root){ value.refresh }
  expect-pending(root,value,Nothing,
    "refresh after initial failure publishes Pending")
  val second = current-request()
  check(second.source-key == 100,"refresh keeps the current source snapshot")
  second.succeed(100)

  val action = fn() after-first-success(root,source,value)
  val next = fn() stage(action)
  enqueue-microtask(next)

fun after-first-success(root : root<<ui>>, source : signal<int>,
                        value : resource<int,int>) : <ui,exn> ()
  expect-ready(root,value,100,"successful refresh publishes Ready")
  check(read-latest(root,value) == Just(100),
    "latest returns the successful value")

  // A second equal invalidation remains cut after the first request settled.
  update(root){ source.set(108) }
  check(request-count() == 2,
    "equal source snapshots do not restart the loader")
  check(read-cell(dispose-count) == 0,
    "equal source snapshots do not cancel completed or active work")

  update(root){ value.refresh }
  val stale = current-request()
  expect-pending(root,value,Just(100),
    "refresh retains the previous successful value")

  // Two source writes in one batch become one replacement request for 300.
  update(root){
    batch(root){
      source.set(200)
      source.set(300)
    }
  }
  val current = current-request()
  check(current.request-number != stale.request-number,
    "source change installs a fresh request")
  check(current.source-key == 300,
    "batched churn loads only the final snapshot")
  check(read-cell(dispose-count) == 1,
    "source replacement retires the previous request generation")
  expect-pending(root,value,Just(100),
    "source replacement retains the previous value")

  // A deliberately hostile host invokes the canceled callback anyway.
  stale.succeed(999)
  current.succeed(300)
  val action = fn() after-churn-success(root,source,value)
  val next = fn() stage(action)
  enqueue-microtask(next)

fun after-churn-success(root : root<<ui>>, source : signal<int>,
                        value : resource<int,int>) : <ui,exn> ()
  expect-ready(root,value,300,
    "stale completion cannot overwrite the current request")

  update(root){ value.refresh }
  expect-pending(root,value,Just(300),
    "refresh after Ready exposes Pending(previous)")
  current-request().fail("refresh failure")
  val action = fn() after-refresh-failure(root,source,value)
  val next = fn() stage(action)
  enqueue-microtask(next)

fun after-refresh-failure(root : root<<ui>>, source : signal<int>,
                          value : resource<int,int>) : <ui,exn> ()
  expect-failed(root,value,"refresh failure",Just(300),
    "refresh rejection retains the previous successful value")
  check(read-latest(root,value) == Just(300),
    "latest survives a refresh failure")

  update(root){ value.refresh }
  val canceled = current-request()
  update(root){ value.cancel }
  expect-ready(root,value,300,
    "explicit cancel restores the previous Ready value")
  check(read-cell(dispose-count) == 2,
    "explicit cancel retires the active request exactly once")
  canceled.succeed(777)

  // Separate turns exercise repeated retirement, not merely batch coalescing.
  update(root){ source.set(400) }
  val stale-one = current-request()
  update(root){ source.set(500) }
  val stale-two = current-request()
  update(root){ source.set(600) }
  val live = current-request()
  check(request-count() == 9,"rapid churn installs every distinct snapshot")
  check(read-cell(dispose-count) == 4,
    "rapid churn retires both superseded requests")
  expect-pending(root,value,Just(300),
    "rapid churn preserves one atomic Pending(previous) state")

  stale-one.succeed(401)
  stale-two.succeed(501)
  live.succeed(600)
  val action = fn() after-rapid-churn(root,value)
  val next = fn() stage(action)
  enqueue-microtask(next)

fun after-rapid-churn(root : root<<ui>>, value : resource<int,int>)
                      : <ui,exn> ()
  expect-ready(root,value,600,
    "only the live rapid-churn request can commit")
  check(read-latest(root,value) == Just(600),
    "latest advances with the winning request")

  update(root){ value.refresh }
  val retired = current-request()
  expect-pending(root,value,Just(600),
    "owner-retirement fixture starts with a pending request")
  root.dispose()
  check(read-cell(dispose-count) == 5,
    "root disposal retires the resource-owned request")

  // Root retirement has revoked the Koka continuation. Even an invalid host
  // callback cannot enqueue a stale resource state write.
  retired.succeed(1000)
  val next = fn() stage(test-batched-source-cancel)
  enqueue-microtask(next)


// --------------------------------------------------------------------------
// Cancellation precedence and owner-retirement scenarios
// --------------------------------------------------------------------------

fun test-batched-source-cancel() : <ui,exn> ()
  val requests-before = request-count()
  val disposals-before = read-cell(dispose-count)
  val (root,(source,value))
      : (root<<ui>>,(signal<int>,resource<int,int>)) =
    create-root fn(root)
      val source = signal(root,700)
      val value = resource(root,fn() Just(source.get),fake-load)
      (source,value)

  val canceled = current-request()
  check(request-count() == requests-before + 1,
    "batched cancel fixture starts one request")
  update(root){
    batch(root){
      source.set(701)
      value.cancel
    }
  }
  check(request-count() == requests-before + 1,
    "cancel dominates a source change from the same batch")
  check(read-cell(dispose-count) == disposals-before + 1,
    "batched source change plus cancel retires the active request once")
  match read-state(root,value)
    Unresolved -> check(True,
      "batched source change plus cancel leaves a canceled state")
    _ -> check(False,
      "batched source change plus cancel leaves a canceled state")

  canceled.succeed(701)
  root.dispose()
  test-owner-retirement()

fun read-escaped(
    escaped : ref<global,maybe<resource<int,int>>>)
    : exn resource<int,int>
  match read-cell(escaped)
    Nothing -> throw("owner fixture did not publish its resource")
    Just(value) -> value

fun test-owner-retirement() : <ui,exn> ()
  val disposals-before = read-cell(dispose-count)
  val escaped : ref<global,maybe<resource<int,int>>> = hidden(Nothing)
  val (root,owner) : (root<<ui>>,signal<int>) =
    create-root fn(root)
      val owner = signal(root,1)
      val payload = signal(root,900)
      val dispose-owner = create-effect(
        root,
        fn() owner.get,
        fn(version)
          if version != 1 then () else
            val value = resource(root,fn() Just(payload.get),fake-load)
            write-cell(escaped,Just(value))
      )
      owner

  val value = read-escaped(escaped)
  val retired = current-request()
  expect-pending(root,value,Nothing,
    "owner fixture starts with an active Pending resource")
  update(root){ owner.set(2) }
  check(read-cell(dispose-count) == disposals-before + 1,
    "resource owner retirement clears the active request")
  match read-state(root,value)
    Unresolved -> check(True,
      "escaped resource leaves Pending when its owner retires")
    _ -> check(False,
      "escaped resource leaves Pending when its owner retires")

  retired.succeed(901)
  val next = fn() stage(fn()
    match read-state(root,value)
      Unresolved -> check(True,
        "retired owner rejects a hostile late resource completion")
      _ -> check(False,
        "retired owner rejects a hostile late resource completion")
    root.dispose()
    test-self-cancel-resources()
  )
  enqueue-microtask(next)

fun test-self-cancel-resources() : <ui,exn> ()
  write-cell(self-cancel-setup-count,0)
  write-cell(self-cancel-finally-count,0)
  write-cell(staged-load-count,0)

  val (empty-root,empty-value)
      : (root<<ui>>,resource<int,int>) =
    create-root fn(root)
      resource(root,fn() Just(1),self-cancel-load)
  match read-state(empty-root,empty-value)
    Unresolved -> check(True,
      "initial self-cancel leaves Resource Unresolved")
    _ -> check(False,
      "initial self-cancel leaves Resource Unresolved")
  check(read-cell(self-cancel-setup-count) == 0,
    "self-cancel is observed before host setup")
  check(read-cell(self-cancel-finally-count) == 1,
    "self-canceled loader finalizes exactly once")
  check(generation-async-outstanding() == 0,
    "initial self-cancel leaves no generation task")
  empty-root.dispose()

  val (root,value) : (root<<ui>>,resource<int,int>) =
    create-root fn(root)
      resource(root,fn() Just(2),staged-self-cancel-load)
  expect-pending(root,value,Nothing,
    "self-cancel previous-value fixture starts Pending")
  enqueue-microtask(fn() stage(fn()
    after-self-cancel-seed(root,value)
  ))

fun after-self-cancel-seed(root : root<<ui>>,
                           value : resource<int,int>) : <ui,exn> ()
  expect-ready(root,value,100,
    "self-cancel previous-value fixture publishes its seed")
  update(root){ value.refresh }
  expect-ready(root,value,100,
    "self-cancel restores the previous Ready value")
  check(read-latest(root,value) == Just(100),
    "latest survives a self-canceled refresh")
  check(read-cell(self-cancel-setup-count) == 0,
    "self-canceled refresh does not install host work")
  check(read-cell(self-cancel-finally-count) == 2,
    "both self-canceled loaders finalize once")
  check(generation-async-outstanding() == 0,
    "self-canceled refresh leaves no generation task")

  update(root){ value.refresh }
  expect-pending(root,value,Just(100),
    "a request can restart after self-cancel")
  enqueue-microtask(fn() stage(fn()
    after-self-cancel-recovery(root,value)
  ))

fun after-self-cancel-recovery(root : root<<ui>>,
                               value : resource<int,int>) : <ui,exn> ()
  expect-ready(root,value,300,
    "a request completes normally after self-cancel")
  check(read-cell(staged-load-count) == 3,
    "self-cancel does not wedge request metadata")
  check(generation-async-outstanding() == 0,
    "self-cancel recovery leaves no generation task")
  root.dispose()
  test-ready-batched-nothing-cancel()


// --------------------------------------------------------------------------
// Ready cancellation precedence
// --------------------------------------------------------------------------

fun test-ready-batched-nothing-cancel() : <ui,exn> ()
  val requests-before = request-count()
  val (root,(source,value))
      : (root<<ui>>,(signal<maybe<int>>,resource<int,int>)) =
    create-root fn(root)
      val source = signal(root,Just(710))
      val value = resource(root,fn() source.get,fake-load)
      (source,value)

  val seed = current-request()
  check(request-count() == requests-before + 1,
    "Ready Nothing-plus-cancel fixture starts one request")
  seed.succeed(710)
  enqueue-microtask(fn() stage(fn()
    after-ready-batched-nothing-cancel(root,source,value)
  ))

fun after-ready-batched-nothing-cancel(
    root : root<<ui>>,
    source : signal<maybe<int>>,
    value : resource<int,int>) : <ui,exn> ()
  expect-ready(root,value,710,
    "Nothing-plus-cancel fixture first publishes Ready")
  val requests-before = request-count()

  update(root){
    batch(root){
      source.set(Nothing)
      value.cancel
    }
  }

  check(request-count() == requests-before,
    "Ready source Nothing plus cancel does not start a request")
  match read-state(root,value)
    Unresolved -> check(True,
      "Ready source Nothing plus cancel clears the resource state")
    _ -> check(False,
      "Ready source Nothing plus cancel clears the resource state")
  check(read-latest(root,value) == Nothing,
    "Ready source Nothing plus cancel clears latest")
  root.dispose()
  test-owned-resource-lifetime()


// --------------------------------------------------------------------------
// Host-owned Resource values
// --------------------------------------------------------------------------

fun test-owned-resource-lifetime() : <ui,exn> ()
  val (root,(source,value))
      : (root<<ui>>,(signal<maybe<int>>,resource<int,owned-host>)) =
    create-root fn(root)
      val source = signal(root,Just(800))
      val value = resource(root,fn() source.get,fake-owned-load)
      (source,value)

  current-request().succeed(800)
  enqueue-microtask(fn() stage(fn()
    after-owned-seed(root,source,value)
  ))

fun after-owned-seed(
    root : root<<ui>>,
    source : signal<maybe<int>>,
    value : resource<int,owned-host>) : <ui,exn> ()
  val previous = require-owned-ready(
    root,value,"owned Resource publishes its seed")
  check(previous.payload == 800 && previous.live,
    "owned Resource seed is live")
  check(previous.disposals == 0,
    "owned Resource seed has not been disposed")

  update(root){ value.refresh }
  val retained = require-owned-pending-previous(
    root,value,"owned refresh retains its previous value")
  check(retained.live,
    "owned previous remains live while refresh is pending")
  check(retained.disposals == 0,
    "owned previous is not disposed at refresh start")

  update(root){ value.cancel }
  val restored = require-owned-ready(
    root,value,"owned cancel restores its previous value")
  check(restored.live,
    "owned previous remains live after refresh cancellation")
  check(restored.disposals == 0,
    "owned previous is not disposed by refresh cancellation")

  update(root){ value.refresh }
  current-request().succeed(801)
  enqueue-microtask(fn() stage(fn()
    after-owned-replacement(root,source,value,previous)
  ))

fun after-owned-replacement(
    root : root<<ui>>,
    source : signal<maybe<int>>,
    value : resource<int,owned-host>,
    previous : owned-host) : <ui,exn> ()
  val current = require-owned-ready(
    root,value,"owned refresh publishes its replacement")
  check(current.payload == 801 && current.live,
    "owned replacement is live")
  check(previous.disposals == 1 && !previous.live,
    "successful replacement disposes the old value exactly once")

  update(root){ source.set(Nothing) }
  match read-owned-state(root,value)
    Unresolved -> check(True,
      "source Nothing clears an owned Resource")
    _ -> check(False,
      "source Nothing clears an owned Resource")
  check(current.disposals == 1 && !current.live,
    "source Nothing disposes the current value exactly once")
  check(generation-async-outstanding() == 0,
    "source Nothing leaves no owned Resource lease outstanding")

  root.dispose()
  test-owned-ready-root-retirement()

fun test-owned-ready-root-retirement() : <ui,exn> ()
  val (root,value) : (root<<ui>>,resource<int,owned-host>) =
    create-root fn(root)
      resource(root,fn() Just(900),fake-owned-load)
  current-request().succeed(900)
  enqueue-microtask(fn() stage(fn()
    after-owned-ready-root-retirement(root,value)
  ))

fun after-owned-ready-root-retirement(
    root : root<<ui>>,
    value : resource<int,owned-host>) : <ui,exn> ()
  val current = require-owned-ready(
    root,value,"root-retirement fixture publishes an owned Ready value")
  check(current.live && current.disposals == 0,
    "owned Ready value is live before root retirement")
  root.dispose()
  check(!current.live && current.disposals == 1,
    "root retirement disposes an owned Ready value exactly once")
  check(generation-async-outstanding() == 0,
    "owned Ready root retirement leaves no lease outstanding")
  test-active-owned-replacement()


// --------------------------------------------------------------------------
// Active ownership and explicit release
// --------------------------------------------------------------------------

fun test-active-owned-replacement() : <ui,exn> ()
  write-cell(last-active-owned,Nothing)
  val requests-before = request-count()
  val (root,(source,value))
      : (root<<ui>>,(signal<int>,resource<int,owned-host>)) =
    create-root fn(root)
      val source = signal(root,1000)
      val value = resource(
        root,fn() Just(source.get),active-owned-load)
      (source,value)

  val previous = require-stored-owned(
    last-active-owned,"active-owned loader did not publish its first host")
  check(previous.live && previous.disposals == 0,
    "active owned host starts live before suspension")
  check(request-count() == requests-before + 1,
    "active owned loader installs its first request")

  update(root){ source.set(1001) }
  val current = require-stored-owned(
    last-active-owned,"active-owned loader did not publish its replacement")
  check(request-count() == requests-before + 2,
    "active owned source replacement installs one request")
  check(!previous.live && previous.disposals == 1,
    "source replacement disposes the suspended old host exactly once")
  check(current.live && current.disposals == 0,
    "active owned replacement starts live")

  update(root){ value.cancel }
  check(!current.live && current.disposals == 1,
    "cancel disposes the replacement active host exactly once")
  match read-owned-state(root,value)
    Unresolved -> check(True,
      "cancel leaves the active-owned Resource Unresolved")
    _ -> check(False,
      "cancel leaves the active-owned Resource Unresolved")
  check(generation-async-outstanding() == 0,
    "active-owned replacement and cancel leave no lease outstanding")
  root.dispose()
  check(previous.disposals == 1 && current.disposals == 1,
    "root retirement does not dispose canceled active hosts twice")
  test-released-owned-lifetime()

fun test-released-owned-lifetime() : <ui,exn> ()
  write-cell(last-released-owned,Nothing)
  val (root,(source,value))
      : (root<<ui>>,(signal<maybe<int>>,resource<int,owned-host>)) =
    create-root fn(root)
      val source = signal(root,Just(1100))
      val value = resource(root,fn() source.get,released-owned-load)
      (source,value)

  val first = require-stored-owned(
    last-released-owned,"released loader did not publish its first host")
  current-request().succeed(1100)
  enqueue-microtask(fn() stage(fn()
    after-released-owned-seed(root,source,value,first)
  ))

fun after-released-owned-seed(
    root : root<<ui>>,
    source : signal<maybe<int>>,
    value : resource<int,owned-host>,
    first : owned-host) : <ui,exn> ()
  val ready = require-owned-ready(
    root,value,"explicitly released host reaches Ready")
  check(ready.payload == 1100 && ready.live && ready.disposals == 0,
    "explicit release keeps the successful host caller-owned")

  update(root){ value.refresh }
  val second = require-stored-owned(
    last-released-owned,"released loader did not publish its replacement")
  check(first.live && first.disposals == 0,
    "refresh does not dispose an explicitly released previous host")
  current-request().succeed(1101)
  enqueue-microtask(fn() stage(fn()
    after-released-owned-replacement(root,source,value,first,second)
  ))

fun after-released-owned-replacement(
    root : root<<ui>>,
    source : signal<maybe<int>>,
    value : resource<int,owned-host>,
    first : owned-host,
    second : owned-host) : <ui,exn> ()
  val ready = require-owned-ready(
    root,value,"released ownership refresh publishes a replacement")
  check(ready.payload == 1100,
    "explicitly released refresh keeps the source snapshot")
  check(ready.live,
    "explicitly released replacement is live")
  check(first.live && first.disposals == 0,
    "replacement does not dispose the explicitly released old host")

  update(root){ source.set(Nothing) }
  match read-owned-state(root,value)
    Unresolved -> check(True,
      "source Nothing clears an explicitly released Resource")
    _ -> check(False,
      "source Nothing clears an explicitly released Resource")
  check(second.live && second.disposals == 0,
    "source Nothing does not dispose an explicitly released host")
  check(generation-async-outstanding() == 0,
    "released ownership leaves no lease outstanding after source Nothing")

  update(root){ source.set(Just(1102)) }
  val third = require-stored-owned(
    last-released-owned,"released loader did not publish its final host")
  current-request().succeed(1102)
  enqueue-microtask(fn() stage(fn()
    after-released-owned-root-retirement(root,value,first,second,third)
  ))

fun after-released-owned-root-retirement(
    root : root<<ui>>,
    value : resource<int,owned-host>,
    first : owned-host,
    second : owned-host,
    third : owned-host) : <ui,exn> ()
  val ready = require-owned-ready(
    root,value,"released ownership fixture returns to Ready")
  check(ready.payload == 1102 && third.live && third.disposals == 0,
    "final explicitly released host is live before root retirement")
  root.dispose()
  check(first.live && second.live && third.live,
    "root retirement does not dispose explicitly released hosts")
  check(first.disposals == 0 && second.disposals == 0 &&
        third.disposals == 0,
    "Resource never invokes a released raw disposer")
  check(generation-async-outstanding() == 0,
    "released ownership root retirement leaves no lease outstanding")

  // Ownership was transferred to this test; retire each host explicitly.
  retire-owned-host(first)
  retire-owned-host(second)
  retire-owned-host(third)
  check(first.disposals == 1 && second.disposals == 1 &&
        third.disposals == 1,
    "transferred hosts remain independently disposable exactly once")
  finish()


pub fun main()
  write-cell(failures,[])
  write-cell(check-count,0)
  write-cell(next-request-id,1)
  write-cell(requests,[])
  write-cell(dispose-count,0)
  begin-result()

  val (root,(source,value))
      : (root<<ui>>,(signal<int>,resource<int,int>)) =
    create-root fn(root)
      val source = signal(root,100)
      val value = resource-by(
        root,
        fn() Just(source.get),
        fake-load,
        fn(left,right) left / 10 == right / 10)
      (source,value)

  expect-pending(root,value,Nothing,
    "initial source starts in Pending")
  val initial = current-request()
  check(initial.source-key == 100,
    "initial request receives its source snapshot")

  // The raw dependency changes while the request is pending, but explicit
  // equality cuts 100 and 109 into the same logical source. The derived source
  // therefore leaves the request's owning generation live.
  update(root){ source.set(109) }
  check(request-count() == 1,
    "equal source snapshots do not restart an active loader")
  check(read-cell(dispose-count) == 0,
    "equal source snapshots do not cancel an active loader")
  initial.fail("initial failure")

  val action = fn() after-initial-failure(root,source,value)
  val next = fn() stage(action)
  enqueue-microtask(next)
