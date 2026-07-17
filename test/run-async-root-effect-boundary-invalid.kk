/*--------------------------------------------------------------------------
  This module is expected not to typecheck. Even when an async action itself
  uses only the closed browser row, flushing its root after a later host turn
  could invoke a reactive apply under a lexical handler which has returned.
--------------------------------------------------------------------------*/
module run-async-root-effect-boundary-invalid

import kokaine/async/effects
import kokaine/reactive

effect audit-effect
  fun audit-ping() : ()

fun suspend() : async ()
  await1-noexn("invalid custom-root run-async",fn(_resume) ())

fun run-with-audit(action : () -> <audit-effect|e> a) : e a
  with fun audit-ping() ()
  action()

pub fun main()
  run-with-audit fn()
    val (root,source) : (root<<audit-effect,ui>>,signal<int>) =
      create-root fn(root)
        val source = signal(root,0)
        val dispose = create-effect(root,fn() source.get,fn(_) audit-ping())
        source
    dispatch(root,fn()
      run-async(root,fn()
        suspend()
        source.set(1)
      )
    )
