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
