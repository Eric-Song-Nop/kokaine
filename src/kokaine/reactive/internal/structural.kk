/*--------------------------------------------------------------------------
  Stable structural lifetimes for integration-owned UI regions.

  A structural owner is only a lifetime/frame registered under the currently
  active frame. It has no queue, target mark, or retained ownership ledger.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/structural

import kokaine/reactive/internal/model
import kokaine/reactive/internal/lifetime
import kokaine/internal/registry
import kokaine/reactive/internal/scheduler
import std/core/undiv


pub type structural-owner<e::E>
  Structural-owner(
    structural-root         : root-key,
    structural-checkpoint   : maybe<continuation-gate>,
    structural-frame        : frame<e>,
    structural-registration : registry-registration<retirement-work<e>>
  )

pub fun open-structural-owner(root : root<e>) : exn structural-owner<e>
  check-not-pure-plane("structural owner creation")
  val plane = root.root-effect-plane
  val parent = load(plane.plane-current-frame)
  check-frame-registration(root,parent)
  val lifetime = new-lifetime-owner(Scope-live,plane.plane-retirement)
  val frame = Frame(lifetime)
  val registration = parent.frame-lifetime.register-child(
    lifetime-retirement-work(lifetime))
  Structural-owner(
    root.root-key,load(plane.plane-current),frame,registration)

pub fun with-structural-owner(root : root<r>, owner : structural-owner<r>,
                             action : () -> <div,exn|e> a)
                            : <div,exn|e> a
  check-not-pure-plane("structural owner entry")
  check-root(root,owner.structural-root)
  check-frame-registration(root,owner.structural-frame)
  val plane = root.root-effect-plane
  val previous-current = load(plane.plane-current)
  val previous-frame = load(plane.plane-current-frame)
  finally(
    fn() {
      store(plane.plane-current,previous-current)
      store(plane.plane-current-frame,previous-frame)
    },
    fn()
      store(plane.plane-current,owner.structural-checkpoint)
      store(plane.plane-current-frame,owner.structural-frame)
      action()
  )

pub fun dispose-structural-owner(owner : structural-owner<e>)
                                   : <exn|e> ()
  check-not-pure-plane("structural owner disposal")
  val _ = owner.structural-registration.take
  pretend-no-div{
    retire-lifetime(owner.structural-frame.frame-lifetime)
  }
