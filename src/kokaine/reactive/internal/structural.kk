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
    root.root-key,load(plane.plane-current),frame,plane.plane-queue,
    plane.plane-structural-mark,plane.plane-structural-targets)
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
            // Pure derivations use a separate queue, so targeted structural
            // bootstrap never drains them here. Mark the exact producer scope
            // instead; a synchronous memo read may then settle only that
            // producer through the running effect owner which created it.
            Owned-derive-fork(scope,next) ->
              store(scope.scope-target-mark,Just(mark))
              mark-structural-scopes(
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

fun validate-structural-owner-roots(
      expected : root-key, owners : list<structural-owner<e>>) : exn ()
  match owners
    Nil -> ()
    Cons(owner,rest) ->
      if same-root(expected,owner.structural-root)
      then validate-structural-owner-roots(expected,rest)
      else throw("structural owners belong to different reactive roots")

fun mark-structural-frames(frames : list<frame<e>>,
                           mark : ref<global,bool>) : <div> ()
  match frames
    Nil -> ()
    Cons(frame,rest) ->
      mark-structural-scopes(
        [Bootstrap-frame-task(frame)],mark)
      mark-structural-frames(rest,mark)

fun structural-frame-member(frame : frame<e>,
                            frames : list<frame<e>>) : bool
  match frames
    Nil -> False
    Cons(current,rest) ->
      if unsafe-ptr-eq(frame.frame-token,current.frame-token) then True
      else structural-frame-member(frame,rest)

fun register-structural-targets(owners : list<structural-owner<e>>,
                                targets : ref<global,list<frame<e>>>) : ()
  match owners
    Nil -> ()
    Cons(owner,rest) ->
      val frame = owner.structural-frame
      val current = load(targets)
      if structural-frame-member(frame,current) then ()
      else store(targets,Cons(frame,current))
      register-structural-targets(rest,targets)

fun bootstrap-structural-owners-loop(
      queue : ref<global,work-queue<e>>,
      targets : ref<global,list<frame<e>>>,
      mark : ref<global,bool>) : <div|e> error<()>
  mark-structural-frames(load(targets),mark)
  match bootstrap-structural-queue(
          mark,work-queue-values(load(queue)),False)
    Error(problem) -> Error(problem)
    Ok(True) -> bootstrap-structural-owners-loop(queue,targets,mark)
    Ok(False) -> Ok(())

pub fun bootstrap-structural-owners(owners : list<structural-owner<e>>)
                               : <div,exn|e> ()
  check-not-pure-plane("structural owner bootstrap")
  match owners
    Nil -> ()
    Cons(first,rest) ->
      validate-structural-owner-roots(first.structural-root,rest)
      val active = first.structural-active-mark
      val targets = first.structural-targets
      register-structural-targets(owners,targets)
      match load(active)
        Just(_) -> ()
        Nothing ->
          val mark = cell(True)
          store(active,Just(mark))
          val result = lift-exn(fn()
            finally(
              fn() {
                store(mark,False)
                store(active,Nothing)
                store(targets,[])
              },
              fn() bootstrap-structural-owners-loop(
                first.structural-queue,targets,mark)
            )
          )
          result.untry

pub fun bootstrap-structural-owner(owner : structural-owner<e>)
                              : <div,exn|e> ()
  bootstrap-structural-owners([owner])
