/*--------------------------------------------------------------------------
  Structured host re-entry through a captured continuation lifetime.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/reentry

import kokaine/reactive/internal/model
import kokaine/reactive/effects
import kokaine/reactive/internal/lifetime
import kokaine/reactive/internal/scheduler
import kokaine/reactive/internal/handlers
import std/core/undiv

// Capture is non-resumptive: it records the structural capability already
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
  // until the whole callback has had a chance to register its structural
  // children; batch exit then retires that complete generation atomically.
  enter-batch(root.root-key)
  finally(fn() leave-batch(root.root-key),action)

// Reinstall only Kokaine's reactive handlers and structural continuation
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
// unwind, but it must not gain a fresh registration or host batch. This is
// exported only for runtime-owned cancellation and restores the captured
// reactive handlers/context.
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
