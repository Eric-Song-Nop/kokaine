/*--------------------------------------------------------------------------
  Host re-entry through a captured reactive lifetime.

  Re-entry is an integration capability: it lets a retained host callback
  restore the reactive context which registered it. The core scheduler owns
  the context primitives, but does not own the host callback policy.
--------------------------------------------------------------------------*/
module kokaine/reactive/integration/internal/reentry

import kokaine/reactive/internal/model
import kokaine/reactive/effects
import kokaine/reactive/internal/lifetime
import kokaine/reactive/internal/scheduler
import kokaine/reactive/internal/handlers
import std/core/undiv


abstract value type reentry<e::E>
  Reentry(
    reentry-root       : root<e>,
    reentry-checkpoint : maybe<continuation-gate>,
    reentry-frame      : frame<e>
  )

pub fun reentry/root(value : reentry<e>) : root<e>
  match value
    Reentry(root,_,_) -> root

// Cancellation is allowed to unwind a parked strand after its structural
// generation has retired, while ordinary host callbacks must still reject
// stale entry. This pure preflight is consumed immediately by the one-shot
// task runtime, before it invokes user or host code.
pub fun reentry/can-run-live(value : reentry<e>) : bool
  match value
    Reentry(root,_,current) ->
      if load(root.root-disposed) || load(root.root-disposing) then False else
        match load(current.frame-lifetime.lifetime-token)
          Scope-starting -> True
          Scope-live -> True
          _ -> False

// Capture is non-resumptive: it records the lifetime capability already
// established by the current exact-read continuation. The host callback may
// be invoked repeatedly while that generation remains live.
pub fun capture-reentry(root : root<e>) : exn reentry<e>
  check-not-pure-plane("reactive re-entry capture")
  val plane = root.root-effect-plane
  val current = load(plane.plane-current-frame)
  Reentry(root,load(plane.plane-current),current)

fun reentry-turn(root : root<e>,
                 action : () -> <signal-read,signal-write,pure|e> a)
                : <signal-read,signal-write,pure|e> a
  // A callback may invalidate the very generation it entered. Defer settling
  // until the whole callback has registered its children; batch exit then
  // retires that complete generation atomically.
  enter-batch(root.root-key)
  finally(fn() leave-batch(root.root-key),action)

// Reinstall only Kokaine's reactive handlers and captured continuation
// context. Arbitrary lexical user handlers are intentionally not fabricated.
pub fun run-reentry(value : reentry<e>,
                    action : () -> <signal-read,signal-write,pure|e> a)
                   : <exn|e> a
  check-not-pure-plane("reactive re-entry")
  match value
    Reentry(root,checkpoint,current) ->
      check-frame-registration(root,current)
      val plane = root.root-effect-plane
      pretend-no-div{
        with-context(plane,checkpoint,current,
          fn()
            lift-div(fn()
              dispatch-handled(root,fn()
                reentry-turn(root,action)
              )
            )
        )
      }

// Retirement marks the captured frame dead before finalizers run. A parked
// async strand still has to be discontinued so its lexical `finally` clauses
// unwind, but it must not gain a fresh registration or host batch.
pub fun run-retirement-reentry(
    value : reentry<e>,
    action : () -> <signal-read,signal-write,pure|e> a)
    : <exn|e> a
  check-not-pure-plane("reactive retirement re-entry")
  match value
    Reentry(root,checkpoint,current) ->
      val plane = root.root-effect-plane
      pretend-no-div{
        with-context(plane,checkpoint,current,
          fn() lift-div(fn() dispatch-handled(root,action)))
      }

// Dispatcher rejection normally needs a fresh live batch so cancellation
// finalizer writes publish atomically. If retirement already closed the frame
// or root, use the no-registration retirement path instead; trying live entry
// after the one-shot task was detached would lose the parked strand forever.
pub fun run-cancellation-reentry(
    value : reentry<e>,
    action : () -> <signal-read,signal-write,pure|e> a)
    : <exn|e> a
  if value.can-run-live
  then run-reentry(value,action)
  else run-retirement-reentry(value,action)
