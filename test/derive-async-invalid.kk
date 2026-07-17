module derive-async-invalid

import kokaine/async/effects
import kokaine/reactive

fun suspend() : async int
  await1-noexn("invalid derive await",fn(_resume) ())

pub fun main()
  val _ = create-root fn(root)
    derive(root,0,fn() suspend())
  ()
