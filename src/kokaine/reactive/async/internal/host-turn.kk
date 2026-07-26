/*--------------------------------------------------------------------------
  Host scheduling and rank-2 effect-row closure for retained async turns.

  The dispatcher retains only a `ui` callback, while the runner closes the
  generic family row around each complete completion or cancellation turn.
  Keeping the two capabilities separate lets each host choose when callbacks
  run without changing how a reactive continuation re-enters its generation.
--------------------------------------------------------------------------*/
module kokaine/reactive/async/internal/host-turn


pub type host-turn-dispatcher
  Host-turn-dispatcher(
    dispatch-host-turn : (() -> ui ()) -> ui bool
  )

pub noinline fun host-turn-dispatcher/dispatch(
    dispatcher : host-turn-dispatcher,
    action : () -> ui ()) : ui bool
  match dispatcher
    Host-turn-dispatcher(dispatch-host-turn) -> dispatch-host-turn(action)

pub type host-turn-runner<e::E,h::E>
  Host-turn-runner(
    run-host-turn : forall<a> (() -> <|e> a) -> <|h> a
  )

pub noinline fun host-turn-runner/run(runner : host-turn-runner<e,h>,
                                      action : () -> <|e> a)
                                     : <|h> a
  match runner
    Host-turn-runner(run-host-turn) -> run-host-turn(action)
