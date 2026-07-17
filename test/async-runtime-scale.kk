module async-runtime-scale

import kokaine/async/effects
import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/async-runtime
import kokaine/reactive/internal/registry
import std/core/undiv


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
    run-generation-async(root,fn() {
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

pub fun main()
  begin-scale()
  cancel-pending-wave(False)
  cancel-pending-wave(True)
  exercise-lease-registry()
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(root,fn()
    run-generation-async(root,fn() pretend-no-div{ schedule-many(12000) })
  )
  start-scale-clock()
  after-microtasks(fn()
    finish-scale(
      generation-async-outstanding(),root-owned-resource-count(root))
  )
