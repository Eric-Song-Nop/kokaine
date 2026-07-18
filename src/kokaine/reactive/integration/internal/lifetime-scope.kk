/*--------------------------------------------------------------------------
  Persistent lifetimes for integration-owned regions.

  A lifetime scope is a frame registered beneath the active frame. It keeps
  no scheduler queue or host ownership ledger; entering it only restores the
  continuation checkpoint and frame captured when it was opened.
--------------------------------------------------------------------------*/
module kokaine/reactive/integration/internal/lifetime-scope

import kokaine/reactive/internal/model
import kokaine/reactive/internal/lifetime
import kokaine/internal/registry
import kokaine/reactive/internal/scheduler
import std/core/undiv


pub type lifetime-scope<e::E>
  Lifetime-scope(
    scope-root         : root-key,
    scope-checkpoint   : maybe<continuation-gate>,
    scope-frame        : frame<e>,
    scope-registration : registry-registration<retirement-work<e>>
  )

pub fun open-lifetime-scope(root : root<e>) : exn lifetime-scope<e>
  check-not-pure-plane("lifetime scope creation")
  val plane = root.root-effect-plane
  val parent = load(plane.plane-current-frame)
  check-frame-registration(root,parent)
  val lifetime = new-lifetime-owner(Scope-live,plane.plane-retirement)
  val frame = Frame(lifetime)
  val registration = parent.frame-lifetime.register-child(
    lifetime-retirement-work(lifetime))
  Lifetime-scope(
    root.root-key,load(plane.plane-current),frame,registration)

pub fun with-lifetime-scope(root : root<r>, scope : lifetime-scope<r>,
                            action : () -> <div,exn|e> a)
                           : <div,exn|e> a
  check-not-pure-plane("lifetime scope entry")
  check-root(root,scope.scope-root)
  check-frame-registration(root,scope.scope-frame)
  with-context(root.root-effect-plane,scope.scope-checkpoint,
               scope.scope-frame,action)

pub fun lifetime-scope/dispose(scope : lifetime-scope<e>) : <exn|e> ()
  check-not-pure-plane("lifetime scope disposal")
  match scope.scope-registration.take
    Nothing -> ()
    Just(_) -> pretend-no-div{
      retire-lifetime(scope.scope-frame.frame-lifetime)
    }
