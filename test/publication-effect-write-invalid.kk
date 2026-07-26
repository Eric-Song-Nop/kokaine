module publication-effect-write-invalid

import kokaine/reactive
import kokaine/reactive/integration

fun install(root : root<<ui>>, source : signal<int>, target : signal<int>)
           : signal-write ()
  val stop = create-ui-publication-effect(root,fn() source.get,fn(value)
    target.set(value)
  )
  ()
