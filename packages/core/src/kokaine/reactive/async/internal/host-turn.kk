/*--------------------------------------------------------------------------
  Host scheduling and rank-2 effect-row closure for retained async turns.

  The dispatcher retains only a `ui` callback, while the runner closes the
  generic family row around each complete completion or cancellation turn.
  Keeping the two capabilities separate lets each host choose when callbacks
  run without changing how a reactive continuation re-enters its generation.
--------------------------------------------------------------------------*/
module kokaine/reactive/async/internal/host-turn

import std/core/unsafe
import std/core/undiv


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


// --------------------------------------------------------------------------
// Coalesced host turns
// --------------------------------------------------------------------------

fun turn-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun turn-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun turn-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

// Shared state of one coalesced host queue. `pending` is a reversed list of
// turns accepted since the last drain started; `running` holds the remainder
// of the drain in progress. A drain is `posted` from the first accepted turn
// until it starts, so `pending` is empty whenever `posted` is False.
abstract type host-turn-coalescer
  Host-turn-coalescer(
    coalescer-post    : (() -> ui ()) -> ui bool,
    coalescer-pending : ref<global,list<() -> ui ()>>,
    coalescer-running : ref<global,list<() -> ui ()>>,
    coalescer-posted  : ref<global,bool>
  )

// Wrap a raw host post (for example `queueMicrotask`) so every turn accepted
// before the next drain starts shares one host callback. Each turn still runs
// in acceptance order and in its own re-entry batch; only the host callback
// is shared. A turn accepted while a drain runs is never appended to that
// drain: it posts a fresh host callback, exactly where the uncoalesced post
// would have placed it relative to host work queued by the running turn.
pub fun new-host-turn-coalescer(post : (() -> ui ()) -> ui bool)
                               : host-turn-coalescer
  Host-turn-coalescer(post,turn-cell([]),turn-cell([]),turn-cell(False))

fun host-turn-coalescer/run-running(coalescer : host-turn-coalescer) : <div,ui> ()
  match turn-load(coalescer.coalescer-running)
    Nil -> ()
    Cons(turn,rest) ->
      // Detach each turn before running it. A conforming turn is `ui`-closed
      // and cannot unwind; if a raw host throw escapes anyway, the remainder
      // stays queued and runs ahead of the next posted drain.
      turn-store(coalescer.coalescer-running,rest)
      turn()
      coalescer.run-running

fun host-turn-coalescer/drain(coalescer : host-turn-coalescer) : ui ()
  turn-store(coalescer.coalescer-posted,False)
  val pending = turn-load(coalescer.coalescer-pending)
  turn-store(coalescer.coalescer-pending,[])
  turn-store(coalescer.coalescer-running,
             turn-load(coalescer.coalescer-running) ++ pending.reverse)
  pretend-no-div{ coalescer.run-running }

pub fun host-turn-coalescer/post(coalescer : host-turn-coalescer,
                                 turn : () -> ui ()) : ui bool
  turn-store(coalescer.coalescer-pending,
             Cons(turn,turn-load(coalescer.coalescer-pending)))
  if turn-load(coalescer.coalescer-posted) then True
  else
    turn-store(coalescer.coalescer-posted,True)
    if (coalescer.coalescer-post)(fn() coalescer.drain) then True
    else
      // A closed host queue rejects this turn alone: no drain was pending, so
      // it is the only accepted entry. The caller then cancels its task.
      turn-store(coalescer.coalescer-posted,False)
      turn-store(coalescer.coalescer-pending,[])
      False

pub fun host-turn-coalescer/dispatcher(coalescer : host-turn-coalescer)
                                      : host-turn-dispatcher
  Host-turn-dispatcher(fn(turn) coalescer.post(turn))
