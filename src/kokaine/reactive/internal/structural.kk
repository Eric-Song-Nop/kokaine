/*--------------------------------------------------------------------------
  Stable, explicitly disposable structural registration frames.

  This module is framework-internal.  Koka has no package-private visibility,
  so the opaque facade exposes reserved `internal/` wrappers for the DOM
  backend without exposing the concrete frame or continuation checkpoint.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/structural

import kokaine/reactive/internal/model
import kokaine/reactive/internal/lifetime
import kokaine/reactive/internal/resource
import kokaine/reactive/internal/scheduler
import std/core/undiv


pub fun open-structural-owner(root : root<e>) : exn structural-owner<e>
  check-not-pure-plane("structural owner creation")
  val plane = root.root-effect-plane
  val parent = load(plane.plane-current-frame)
  check-frame-registration(root,parent)
  val frame = Frame(cell(Scope-live),cell(Owned-end))
  val owner = Structural-owner(
    root.root-key,load(plane.plane-current),frame)
  // Link before returning.  Draft/bootstrap/final-control rollback can now
  // discover this owner through the ordinary frame ledger.
  store(parent.frame-owned,
        Owned-structural(owner,load(parent.frame-owned)))
  owner

pub fun with-structural-owner(root : root<r>, owner : structural-owner<r>,
                              action : () -> <div,exn|e> a)
                             : <div,exn|e> a
  check-not-pure-plane("structural owner entry")
  check-root(root,owner.structural-root)
  val frame = owner.structural-frame
  check-frame-registration(root,frame)
  val plane = root.root-effect-plane
  val previous-current = load(plane.plane-current)
  val previous-entry = load(plane.plane-current-entry)
  val previous-frame = load(plane.plane-current-frame)
  finally(
    fn() {
      store(plane.plane-current,previous-current)
      store(plane.plane-current-entry,previous-entry)
      store(plane.plane-current-frame,previous-frame)
    },
    fn()
      store(plane.plane-current,owner.structural-checkpoint)
      // Stateful entry targets never escape into a sibling structural owner.
      store(plane.plane-current-entry,Nothing)
      store(plane.plane-current-frame,frame)
      action()
  )

pub fun dispose-structural-owner(owner : structural-owner<e>) : <exn|e> ()
  check-not-pure-plane("structural owner disposal")
  pretend-no-div{ retire-structural-owner(owner) }

// Explicit row retirement leaves a dead registration shell in its parent's
// immutable-style ledger.  A keyed reconciler calls this once per turn so
// memory remains proportional to the currently owned structure instead of to
// the number of keys ever observed.
fun compact-structural-ledger(values : owned<e>) : owned<e>
  match values
    Owned-end -> Owned-end
    Owned-fork(scope,next) ->
      Owned-fork(scope,compact-structural-ledger(next))
    Owned-derive-fork(scope,next) ->
      Owned-derive-fork(scope,compact-structural-ledger(next))
    Owned-resource(resource,next) ->
      Owned-resource(resource,compact-structural-ledger(next))
    Owned-structural(child,next) ->
      match load(child.structural-frame.frame-token)
        Scope-dead -> compact-structural-ledger(next)
        _ -> Owned-structural(child,compact-structural-ledger(next))

pub fun compact-structural-owner(owner : structural-owner<e>) : ()
  val frame = owner.structural-frame
  match load(frame.frame-token)
    Scope-dead -> ()
    _ -> store(frame.frame-owned,
               compact-structural-ledger(load(frame.frame-owned)))

// A row is not committed until every effect in its freshly mounted subtree has
// completed its first publication.  Normal scheduler tickets remain queued and
// become stale after these targeted bootstraps, so unrelated root work is never
// drained recursively from inside reconciliation.
fun bootstrap-structural-trace(current : trace<e>) : <div|e> error<bool>
  match current
    Trace-end -> Ok(False)
    Trace-read(_,_,_,child,frame-slot,_,_,_,_) ->
      match bootstrap-structural-owned(
              load(load(frame-slot).frame-owned))
        Error(problem) -> Error(problem)
        Ok(frame-progress) ->
          match bootstrap-structural-trace(load(child))
            Error(problem) -> Error(problem)
            Ok(child-progress) -> Ok(frame-progress || child-progress)
    Trace-entry(_,_,child,frame-slot,_,_) ->
      match bootstrap-structural-owned(
              load(load(frame-slot).frame-owned))
        Error(problem) -> Error(problem)
        Ok(frame-progress) ->
          match bootstrap-structural-trace(load(child))
            Error(problem) -> Error(problem)
            Ok(child-progress) -> Ok(frame-progress || child-progress)

fun bootstrap-structural-scope-rest(scope : continuation-scope<e>,
                                    started : bool)
                                   : <div|e> error<bool>
  match load(scope.scope-state)
    Scope-live ->
      match bootstrap-structural-owned(load(scope.scope-prefix))
        Error(problem) -> Error(problem)
        Ok(prefix-progress) ->
          match bootstrap-structural-trace(load(scope.scope-body))
            Error(problem) -> Error(problem)
            Ok(body-progress) ->
              Ok(started || prefix-progress || body-progress)
    _ -> Ok(started)

fun bootstrap-structural-scope(scope : continuation-scope<e>)
                              : <div|e> error<bool>
  match load(scope.scope-state)
    Scope-starting ->
      match run-bootstrap(scope)
        Error(problem) -> Error(problem)
        Ok(_) -> bootstrap-structural-scope-rest(scope,True)
    _ -> bootstrap-structural-scope-rest(scope,False)

fun bootstrap-structural-owned(values : owned<e>) : <div|e> error<bool>
  match values
    Owned-end -> Ok(False)
    Owned-resource(_,next) -> bootstrap-structural-owned(next)
    // A synchronously read memo settles its own producer. Unobserved derived
    // work remains in normal queue order and cannot affect initial row DOM.
    Owned-derive-fork(_,next) -> bootstrap-structural-owned(next)
    Owned-fork(scope,next) ->
      // Ledgers are newest-first while scheduler bootstrap order is FIFO.
      match bootstrap-structural-owned(next)
        Error(problem) -> Error(problem)
        Ok(rest-progress) ->
          match bootstrap-structural-scope(scope)
            Error(problem) -> Error(problem)
            Ok(scope-progress) -> Ok(rest-progress || scope-progress)
    Owned-structural(child,next) ->
      match bootstrap-structural-owned(next)
        Error(problem) -> Error(problem)
        Ok(rest-progress) ->
          match bootstrap-structural-frame(child.structural-frame)
            Error(problem) -> Error(problem)
            Ok(child-progress) -> Ok(rest-progress || child-progress)

fun bootstrap-structural-frame(frame : frame<e>) : <div|e> error<bool>
  match load(frame.frame-token)
    Scope-dead -> Ok(False)
    _ -> bootstrap-structural-owned(load(frame.frame-owned))

fun bootstrap-structural-loop(frame : frame<e>) : <div|e> error<()>
  match bootstrap-structural-frame(frame)
    Error(problem) -> Error(problem)
    Ok(True) -> bootstrap-structural-loop(frame)
    Ok(False) -> Ok(())

pub fun bootstrap-structural-owner(owner : structural-owner<e>)
                              : <div,exn|e> ()
  val result = lift-exn(fn() bootstrap-structural-loop(
    owner.structural-frame))
  result.untry
