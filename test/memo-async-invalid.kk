module memo-async-invalid

import kokaine/async/effects
import kokaine/reactive

fun suspend() : async int
  await1-noexn("invalid memo await",fn(_resume) ())

pub fun main()
  val _ = create-root fn(root)
    kokaine/reactive/memo(root,0,fn(_previous) suspend())
  ()
