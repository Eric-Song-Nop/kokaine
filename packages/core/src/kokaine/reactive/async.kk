/*--------------------------------------------------------------------------
  Generation-owned Async integration.

  This module binds the independent Async algebra to a reactive generation.
  The reactive core does not depend on this integration layer.
--------------------------------------------------------------------------*/
module kokaine/reactive/async

import kokaine/reactive
import kokaine/async/effects
import kokaine/reactive/async/integration
import kokaine/reactive/async/internal/host-turn
import kokaine/reactive/async/internal/web-runtime


pub fun run-async(
    root : root<<ui>>,
    action : () -> <async,signal-read,signal-write,pure,ui> ())
    : <signal-read,signal-write,pure,ui> ()
  run-async-with-dispatcher(
    root,
    new-async-host-dispatcher(fn(turn) web-host-turns.post(turn)),
    action)
