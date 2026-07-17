module async-runtime-scale

import kokaine/async/effects
import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/async-runtime
import kokaine/reactive/internal/registry
import std/core/undiv


extern begin-scale() : ui ()
  js inline "globalThis.__kokaineAsyncScale={ done:false, count:0, canceled:0, disposed:0, scopedCanceled:0, scopedDisposed:0, elapsed:-1, outstanding:-1, owned:-1 }"

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

pub fun main()
  begin-scale()
  cancel-pending-wave(False)
  cancel-pending-wave(True)
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(root,fn()
    run-generation-async(root,fn() pretend-no-div{ schedule-many(12000) })
  )
  start-scale-clock()
  after-microtasks(fn()
    finish-scale(
      generation-async-outstanding(),root-owned-resource-count(root))
  )
