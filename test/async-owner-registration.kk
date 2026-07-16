module async-owner-registration

import kokaine/async/effects
import kokaine/reactive/internal/model
import kokaine/reactive/internal/resource
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/async-runtime
import std/core/undiv


extern begin-result() : ui ()
  js inline "globalThis.__kokaineAsyncOwner={ done:false, owned:-1, outstanding:-1 }"

extern publish-result(owned : int, outstanding : int) : ui ()
  js inline "globalThis.__kokaineAsyncOwner={ done:true, owned:#1, outstanding:#2 }"

fun owned-resource-count(values : owned<e>) : <div> int
  match values
    Owned-end -> 0
    Owned-fork(_,next) -> owned-resource-count(next)
    Owned-derive-fork(_,next) -> owned-resource-count(next)
    Owned-resource(_,next) -> 1 + owned-resource-count(next)

fun root-owned-resource-count(root : root<e>) : int
  pretend-no-div{ owned-resource-count(load(root.root-owned)) }

fun complete-three() : async ()
  val _ = await1-noexn("owner registration one",fn(complete) complete(1))
  val _ = await1-noexn("owner registration two",fn(complete) complete(2))
  val _ = await1-noexn("owner registration three",fn(complete) complete(3))
  ()

pub fun main()
  begin-result()
  val (root,()) : (root<<ui>>,()) = create-root fn(_root) ()
  dispatch(root,fn()
    run-generation-async(root,fn()
      complete-three()
      publish-result(
        root-owned-resource-count(root),generation-async-outstanding())
    )
  )
