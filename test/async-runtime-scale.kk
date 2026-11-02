module async-runtime-scale

import kokaine/async/effects
import kokaine/async/web
import kokaine/reactive/integration/internal/reentry
import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import kokaine/reactive/async/internal/runtime
import kokaine/reactive/async/internal/web-runtime
import kokaine/internal/registry
import std/core/undiv
import std/core/unsafe


extern begin-scale() : ui ()
  js inline "globalThis.__kokaineAsyncScale={ done:false, count:0, canceled:0, disposed:0, scopedCanceled:0, scopedDisposed:0, leaseReleased:0, leaseDisposed:0, leaseCount:-1, leaseLinked:true, elapsed:-1, outstanding:-1, owned:-1 }"

extern bump-scale() : ui ()
  js inline "globalThis.__kokaineAsyncScale.count += 1"

extern bump-canceled() : ui ()
  js inline "globalThis.__kokaineAsyncScale.canceled += 1"

extern bump-disposed() : ui ()
  js inline "globalThis.__kokaineAsyncScale.disposed += 1"

extern bump-scoped-canceled() : ui ()
  js inline "globalThis.__kokaineAsyncScale.scopedCanceled += 1"

extern bump-scoped-disposed() : ui ()
  js inline "globalThis.__kokaineAsyncScale.scopedDisposed += 1"

extern bump-lease-released() : ui ()
  js inline "globalThis.__kokaineAsyncScale.leaseReleased += 1"

extern bump-lease-disposed() : ui ()
  js inline "globalThis.__kokaineAsyncScale.leaseDisposed += 1"

extern publish-lease-registry(count : int, linked : bool) : ui ()
  js inline "Object.assign(globalThis.__kokaineAsyncScale,{ leaseCount:#1, leaseLinked:#2 })"

extern start-scale-clock() : ui ()
  js inline "globalThis.__kokaineAsyncScaleStart=performance.now()"

extern after-microtasks(action : () -> ui ()) : ui ()
  js inline "setTimeout(#1,0)"

// Count host microtasks posted through the global queueMicrotask, which is
// the only scheduling primitive the Web async dispatcher uses.
extern install-microtask-counter() : ui ()
  js inline "(function(){ if(globalThis.__kokaineMicrotaskCounter) return; var original=globalThis.queueMicrotask; var counter={ count:0 }; globalThis.__kokaineMicrotaskCounter=counter; globalThis.queueMicrotask=function(callback){ counter.count+=1; return original.call(globalThis,callback); }; })()"

extern report-scale-error(message : string) : ui ()
  js inline "console.error(#1)"

extern microtask-count() : ui int
  js inline "globalThis.__kokaineMicrotaskCounter.count"

// Fifty fetch-like promises which all settle inside one host macrotask.
extern new-macrotask-gate() : ui any
  js inline "(function(){ var gate={ resolvers:[] }; gate.release=function(){ setTimeout(function(){ var pending=gate.resolvers; gate.resolvers=[]; pending.forEach(function(resolve,index){ resolve(index); }); },0); }; return gate; })()"

extern gate-promise(gate : any) : ui any
  js inline "new Promise(function(resolve){ (#1).resolvers.push(resolve); })"

extern gate-release(gate : any) : ui ()
  js inline "(#1).release()"

extern publish-cost(name : string, microtasks : int, batches : int,
                    supervisors : int, value : int) : ui ()
  js inline "(globalThis.__kokaineAsyncScale.costs=globalThis.__kokaineAsyncScale.costs||{})[#1]={ microtasks:#2, batches:#3, supervisors:#4, value:#5 }"

extern finish-scale(outstanding : int, owned : int) : ui ()
  js inline "Object.assign(globalThis.__kokaineAsyncScale,{ done:true, elapsed:performance.now()-globalThis.__kokaineAsyncScaleStart, outstanding:#1, owned:#2 })"

fun root-owned-resource-count(root : root<e>) : int
  root.root-lifetime.lifetime-finalizers.count

fun schedule-many(left : int) : <async,div> ()
  if left <= 0 then () else
    async-schedule(fn() bump-scale())
    schedule-many(left - 1)

tail fun install-pending(left : int, distinct-scopes : bool) : <async,div> ()
  if left <= 0 then () else
    val setup : await-setup<()> = fn(_complete)
      Ok(fn() {
        if distinct-scopes then bump-scoped-disposed() else bump-disposed()
      })
    val scope = if distinct-scopes
                then new-child-scope(async-scope)
                else async-scope
    no-await(setup,scope,"pending cancellation scale",fn(result)
      match result
        Cancel ->
          if distinct-scopes then bump-scoped-canceled() else bump-canceled()
        _ -> ()
    )
    install-pending(left - 1,distinct-scopes)

fun cancel-pending-wave(distinct-scopes : bool) : <ui,exn> ()
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(root,fn()
    run-web-generation-async(root,fn() {
      pretend-no-div{ install-pending(12000,distinct-scopes) }
      cancel-outstanding()
    })
  )
  root.dispose()

fun acquire-leases(group : async-lease-group, count : int,
                   dispose : dispose-fn) : ui list<ownership-release-fn>
  pretend-no-div{
    var remaining := count
    var releases : list<ownership-release-fn> := []
    while { remaining > 0 }
      releases := Cons(group.own(dispose),releases)
      remaining := remaining - 1
    releases
  }

fun release-leases(releases : list<ownership-release-fn>) : ui ()
  pretend-no-div{
    var pending := releases
    while { !pending.is-nil }
      match pending
        Nil -> ()
        Cons(release,rest) ->
          pending := rest
          if release() then bump-lease-released() else ()
  }

fun exercise-lease-registry() : ui ()
  val released = new-async-lease-group()
  val releases = acquire-leases(released,12000,fn() ())
  release-leases(releases)
  released.dispose

  val retired = new-async-lease-group()
  val retained = acquire-leases(
    retired,12000,fn() bump-lease-disposed())
  retired.dispose
  // Both explicit unlink and seal-detach must sever the intrusive chain. A
  // stale capability remains one-shot without scanning or retaining siblings.
  match retained
    Nil -> ()
    Cons(stale,_) ->
      if stale() then bump-lease-released() else ()
  publish-lease-registry(retired.count,retired.has-linked-entries)

type cost-mark
  Cost-mark(microtasks : int, batches : int, supervisors : int)

fun cost-mark() : ui cost-mark
  Cost-mark(microtask-count(),reentry-batch-count(),
            generation-async-supervisor-allocations())

fun publish-since(name : string, mark : cost-mark, value : int) : ui ()
  publish-cost(name,
    microtask-count() - mark.microtasks,
    reentry-batch-count() - mark.batches,
    generation-async-supervisor-allocations() - mark.supervisors,
    value)

fun start-fan-in(root : root<<ui>>, gate : any, total : ref<global,int>)
                 : <ui,exn> ()
  list(1,50).foreach fn(_)
    dispatch(root,fn()
      run-web-generation-async(root,fn() {
        with catch fn(_problem) ()
        val promise : promise<int> = unsafe-promise(gate-promise(gate))
        val value = promise.await
        unsafe-total { total := !total + value + 1 }
      })
    )

fun fan-in-wave(next : () -> ui ()) : <ui,exn> ()
  val gate = new-macrotask-gate()
  val total : ref<global,int> = unsafe-total { ref(0) }
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  val mark = cost-mark()
  start-fan-in(root,gate,total)
  gate-release(gate)
  after-microtasks(fn()
    after-microtasks(fn()
      publish-since("fanIn",mark,unsafe-total { !total })
      with catch fn(problem) report-scale-error(problem.message)
      root.dispose()
      next()
    )
  )

pub fun main()
  begin-scale()
  install-microtask-counter()
  fan-in-wave(fn() {
    with catch fn(problem) report-scale-error("async scale failed: " ++ problem.message)
    run-scale-waves()
  })

fun run-scale-waves() : <ui,exn> ()
  cancel-pending-wave(False)
  cancel-pending-wave(True)
  exercise-lease-registry()
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  val mark = cost-mark()
  dispatch(root,fn()
    run-web-generation-async(
      root,fn() pretend-no-div{ schedule-many(12000) })
  )
  start-scale-clock()
  after-microtasks(fn()
    publish-since("schedule",mark,0)
    finish-scale(
      generation-async-outstanding(),root-owned-resource-count(root))
  )
