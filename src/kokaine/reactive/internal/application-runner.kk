/*--------------------------------------------------------------------------
  Explicit application-handler reinstallation for retained host callbacks.

  The runner is rank-2 in its result and polymorphic over complete effect
  rows. It carries no callback payload: each host turn invokes it afresh.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/application-runner


pub type app-runner<e::E,h::E>
  App-runner(
    run-app : forall<a> (() -> <|e> a) -> <|h> a
  )

pub noinline fun app-runner/run(runner : app-runner<e,h>,
                                action : () -> <|e> a)
                               : <|h> a
  match runner
    App-runner(run-app) -> run-app(action)
