/*--------------------------------------------------------------------------
  Rank-2 effect-row closure for retained browser turns.

  The runner carries no callback payload. Async invokes it around each
  complete completion or cancellation turn so a generic family row is closed
  before the action becomes a `ui`-only host callback.
--------------------------------------------------------------------------*/
module kokaine/reactive/async/internal/host-turn


pub type host-turn-runner<e::E,h::E>
  Host-turn-runner(
    run-host-turn : forall<a> (() -> <|e> a) -> <|h> a
  )

pub noinline fun host-turn-runner/run(runner : host-turn-runner<e,h>,
                                      action : () -> <|e> a)
                                     : <|h> a
  match runner
    Host-turn-runner(run-host-turn) -> run-host-turn(action)
