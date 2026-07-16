/*--------------------------------------------------------------------------
  This module is expected not to typecheck. A generation-bound task cannot
  retain an arbitrary lexical handler across a browser suspension: only the
  reactive and async interpreters are reconstructed on the later host turn.
--------------------------------------------------------------------------*/
module run-async-effect-boundary-invalid

import kokaine/async/effects
import kokaine/reactive

effect audit-effect
  fun audit-ping() : ()

fun suspend() : async ()
  await1-noexn("invalid run-async effect",fn(_resume) ())

fun run-with-audit(action : () -> <audit-effect|e> a) : e a
  with fun audit-ping() ()
  action()

pub fun main()
  run-with-audit fn()
    val (root,_) : (root<<audit-effect,ui>>,()) = create-root fn(_root) ()
    dispatch(root,fn()
      run-async(root,fn()
        suspend()
        audit-ping()
      )
    )
