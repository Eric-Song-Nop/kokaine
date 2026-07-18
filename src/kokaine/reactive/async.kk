/*--------------------------------------------------------------------------
  Generation-owned Async integration.

  This module binds the independent Async algebra to a reactive generation.
  The reactive core does not depend on this integration layer.
--------------------------------------------------------------------------*/
module kokaine/reactive/async

import kokaine/reactive
import kokaine/async/effects
import kokaine/reactive/async/internal/runtime


pub fun run-async(
    root : root<<ui>>,
    action : () -> <async,signal-read,signal-write,pure,ui> ())
    : <signal-read,signal-write,pure,ui> ()
  run-generation-async(internal/root-handle(root),action)
