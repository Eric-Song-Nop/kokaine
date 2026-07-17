module resource-source-async-invalid

import kokaine/async/effects
import kokaine/reactive
import kokaine/resource

fun suspend() : async int
  await1-noexn("invalid resource source await",fn(_resume) ())

fun load(value : int) : <async,ui,exn> int
  value

pub fun main()
  val _ : (root<<ui>>,resource<int,int>) = create-root fn(root)
    resource(root,fn() Just(suspend()),load)
  ()
