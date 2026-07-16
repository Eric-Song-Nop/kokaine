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
import std/core/unsafe


pub fun open-structural-owner(root : root<e>) : exn structural-owner<e>
  check-not-pure-plane("structural owner creation")
  val plane = root.root-effect-plane
  val parent = load(plane.plane-current-frame)
  check-frame-registration(root,parent)
  val frame = Frame(cell(Scope-live),cell(Owned-end))
  val owner = Structural-owner(
    root.root-key,load(plane.plane-current),frame,plane.plane-queue)
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
// completed its first publication. Normal scheduler tickets remain queued and
// become stale after these targeted bootstraps, so unrelated root work is never
// drained recursively from inside reconciliation.
type structural-bootstrap-task<e::E>
  Bootstrap-owned-task(task-owned : owned<e>)
  Bootstrap-scope-task(task-scope : continuation-scope<e>)
  Bootstrap-trace-task(task-trace : trace<e>)
  Bootstrap-frame-task(task-frame : frame<e>)

fun mark-structural-scopes(
      pending : list<structural-bootstrap-task<e>>,
      mark : ref<global,bool>) : <div> ()
  match pending
    Nil -> ()
    Cons(current,rest) ->
      match current
        Bootstrap-frame-task(frame) ->
          match load(frame.frame-token)
            Scope-dead -> mark-structural-scopes(rest,mark)
            _ -> mark-structural-scopes(
              Cons(Bootstrap-owned-task(load(frame.frame-owned)),rest),mark)
        Bootstrap-owned-task(values) ->
          match values
            Owned-end -> mark-structural-scopes(rest,mark)
            Owned-resource(_,next) -> mark-structural-scopes(
              Cons(Bootstrap-owned-task(next),rest),mark)
            // Pure derivations use a separate plane and cannot register
            // structural descendants while their calculation is running.
            Owned-derive-fork(_,next) -> mark-structural-scopes(
              Cons(Bootstrap-owned-task(next),rest),mark)
            Owned-fork(scope,next) -> mark-structural-scopes(
              Cons(Bootstrap-scope-task(scope),
                Cons(Bootstrap-owned-task(next),rest)),mark)
            Owned-structural(child,next) -> mark-structural-scopes(
              Cons(Bootstrap-frame-task(child.structural-frame),
                Cons(Bootstrap-owned-task(next),rest)),mark)
        Bootstrap-scope-task(scope) ->
          store(scope.scope-target-mark,Just(mark))
          match load(scope.scope-state)
            Scope-live -> mark-structural-scopes(
              Cons(Bootstrap-owned-task(load(scope.scope-prefix)),
                Cons(Bootstrap-trace-task(load(scope.scope-body)),rest)),mark)
            _ -> mark-structural-scopes(rest,mark)
        Bootstrap-trace-task(current-trace) ->
          match current-trace
            Trace-end -> mark-structural-scopes(rest,mark)
            Trace-read(_,_,_,child,frame-slot,_,_,_,_) ->
              mark-structural-scopes(
                Cons(Bootstrap-owned-task(
                    load(load(frame-slot).frame-owned)),
                  Cons(Bootstrap-trace-task(load(child)),rest)),mark)
            Trace-entry(_,_,child,frame-slot,_,_) ->
              mark-structural-scopes(
                Cons(Bootstrap-owned-task(
                    load(load(frame-slot).frame-owned)),
                  Cons(Bootstrap-trace-task(load(child)),rest)),mark)

fun scope-has-target-mark(scope : continuation-scope<e>,
                          mark : ref<global,bool>) : bool
  match load(scope.scope-target-mark)
    Nothing -> False
    Just(current) -> unsafe-ptr-eq(current,mark)

// Frame ledgers encode ownership but cannot encode one total registration
// order across nested stable owners. Scan the plane's canonical FIFO and run
// only tickets which are still members of this structural subtree.
fun bootstrap-structural-queue(mark : ref<global,bool>,
                               values : list<work<e>>, progressed : bool)
                              : <div|e> error<bool>
  match values
    Nil -> Ok(progressed)
    Cons(current,rest) ->
      match current
        Resume-work(_) -> bootstrap-structural-queue(mark,rest,progressed)
        Bootstrap-work(scope,_) ->
          if targeted-bootstrap-runnable(scope) &&
             scope-has-target-mark(scope,mark)
          then
            match run-bootstrap(scope)
              Error(problem) -> Error(problem)
              Ok(_) -> bootstrap-structural-queue(mark,rest,True)
          else bootstrap-structural-queue(mark,rest,progressed)

fun bootstrap-structural-loop(owner : structural-owner<e>)
                             : <div|e> error<()>
  val frame = owner.structural-frame
  match load(frame.frame-token)
    Scope-dead -> Ok(())
    _ ->
      val mark = cell(False)
      mark-structural-scopes([Bootstrap-frame-task(frame)],mark)
      match bootstrap-structural-queue(
              mark,load(owner.structural-queue),False)
        Error(problem) -> Error(problem)
        Ok(True) -> bootstrap-structural-loop(owner)
        Ok(False) -> Ok(())

pub fun bootstrap-structural-owner(owner : structural-owner<e>)
                              : <div,exn|e> ()
  check-not-pure-plane("structural owner bootstrap")
  val result = lift-exn(fn() bootstrap-structural-loop(owner))
  result.untry
