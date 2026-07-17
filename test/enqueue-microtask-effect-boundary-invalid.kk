/*--------------------------------------------------------------------------
  This module is expected not to typecheck. A bare browser microtask has no
  interpreter for arbitrary Koka effects when JavaScript invokes it later.
--------------------------------------------------------------------------*/
module enqueue-microtask-effect-boundary-invalid

import kokaine/async/internal/web-schedule

effect audit-effect
  fun audit-ping() : ()

fun invalid-schedule() : <audit-effect,ui> ()
  enqueue-microtask(fn() audit-ping())

pub fun main()
  ()
