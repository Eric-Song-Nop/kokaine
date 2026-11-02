/*--------------------------------------------------------------------------
  Internal-root Web adapter used by browser integration fixtures.

  Product code enters through `kokaine/reactive/async`; the generation runtime
  itself remains host-neutral. Both entries share one microtask coalescer, so
  completions from every async family keep their global acceptance order.
--------------------------------------------------------------------------*/
module kokaine/reactive/async/internal/web-runtime

import kokaine/async/effects
import kokaine/async/internal/web-schedule
import kokaine/reactive/effects
import kokaine/reactive/internal/model
import kokaine/reactive/async/internal/host-turn
import kokaine/reactive/async/internal/runtime


// Every Web async family posts through this one queue. Turns accepted before
// the next microtask drain share it; see `new-host-turn-coalescer`.
pub val web-host-turns : host-turn-coalescer =
  new-host-turn-coalescer(fn(turn) {
    enqueue-microtask(turn)
    True
  })

pub fun run-web-generation-async(
    root : root<<ui>>,
    action : () -> <async,signal-read,signal-write,pure,ui> ())
    : <signal-read,signal-write,pure,ui> ()
  val dispatcher = web-host-turns.dispatcher
  val runner : host-turn-runner<<exn,ui>,<exn,ui>> =
    Host-turn-runner(fn(run-action) run-action())
  run-generation-async-with-host(root,dispatcher,runner,action)
