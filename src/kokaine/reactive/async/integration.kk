/*--------------------------------------------------------------------------
  Host dispatcher integration for generation-owned Async.

  Backends provide only a callback queue. The generation runtime keeps
  continuation re-entry, transactions, cancellation, and ownership internal.
--------------------------------------------------------------------------*/
module kokaine/reactive/async/integration

import kokaine/reactive
import kokaine/async/effects
import kokaine/reactive/async/internal/host-turn
import kokaine/reactive/async/internal/runtime


abstract type async-host-dispatcher
  Async-host-dispatcher(internal-dispatcher : host-turn-dispatcher)

pub fun new-async-host-dispatcher(
    post-host-turn : (() -> ui ()) -> ui bool) : async-host-dispatcher
  Async-host-dispatcher(Host-turn-dispatcher(post-host-turn))

pub fun run-async-with-dispatcher(
    root : root<<ui>>,
    dispatcher : async-host-dispatcher,
    action : () -> <async,signal-read,signal-write,pure,ui> ())
    : <signal-read,signal-write,pure,ui> ()
  match dispatcher
    Async-host-dispatcher(internal-dispatcher) ->
      val runner : host-turn-runner<<exn,ui>,<exn,ui>> =
        Host-turn-runner(fn(run-action) run-action())
      run-generation-async-with-host(
        internal/root-handle(root),internal-dispatcher,runner,action)
