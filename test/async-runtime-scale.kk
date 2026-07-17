module async-runtime-scale

import kokaine/async/effects
import kokaine/reactive/internal/model
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/async-runtime
import std/core/undiv


extern begin-scale() : ui ()
  js inline "globalThis.__kokaineAsyncScale={ done:false, count:0, elapsed:-1, outstanding:-1, owned:-1 }"

extern bump-scale() : ui ()
  js inline "globalThis.__kokaineAsyncScale.count += 1"

extern start-scale-clock() : ui ()
  js inline "globalThis.__kokaineAsyncScaleStart=performance.now()"

extern after-microtasks(action : () -> ui ()) : ui ()
  js inline "setTimeout(#1,0)"

extern finish-scale(outstanding : int, owned : int) : ui ()
  js inline "Object.assign(globalThis.__kokaineAsyncScale,{ done:true, elapsed:performance.now()-globalThis.__kokaineAsyncScaleStart, outstanding:#1, owned:#2 })"

fun owned-resource-count(values : owned<e>) : <div> int
  match values
    Owned-end -> 0
    Owned-fork(_,_,next) -> owned-resource-count(load(next))
    Owned-derive-fork(_,_,next) -> owned-resource-count(load(next))
    Owned-resource(_,_,next) -> 1 + owned-resource-count(load(next))

fun root-owned-resource-count(root : root<e>) : int
  pretend-no-div{ owned-resource-count(load(root.root-owned)) }

fun schedule-many(left : int) : <async,div> ()
  if left <= 0 then () else
    async-schedule(fn() bump-scale())
    schedule-many(left - 1)

pub fun main()
  begin-scale()
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(root,fn()
    run-generation-async(root,fn() pretend-no-div{ schedule-many(12000) })
  )
  start-scale-clock()
  after-microtasks(fn()
    finish-scale(
      generation-async-outstanding(),root-owned-resource-count(root))
  )
