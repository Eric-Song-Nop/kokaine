/*--------------------------------------------------------------------------
  Internal-root Web adapter used by browser integration fixtures.

  Product code enters through `kokaine/reactive/async`; the generation runtime
  itself remains host-neutral.
--------------------------------------------------------------------------*/
module kokaine/reactive/async/internal/web-runtime

import kokaine/async/effects
import kokaine/async/internal/web-schedule
import kokaine/reactive/effects
import kokaine/reactive/internal/model
import kokaine/reactive/async/internal/host-turn
import kokaine/reactive/async/internal/runtime


pub fun run-web-generation-async(
    root : root<<ui>>,
    action : () -> <async,signal-read,signal-write,pure,ui> ())
    : <signal-read,signal-write,pure,ui> ()
  val dispatcher = Host-turn-dispatcher(fn(turn) {
    enqueue-microtask(turn)
    True
  })
  val runner : host-turn-runner<<exn,ui>,<exn,ui>> =
    Host-turn-runner(fn(run-action) run-action())
  run-generation-async-with-host(root,dispatcher,runner,action)
