/*--------------------------------------------------------------------------
  Structural lifetime and draft-transaction operations for captured traces.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/lifetime

import kokaine/reactive/internal/model
import std/core/undiv

// --------------------------------------------------------------------------
// Trace inspection and source invalidation
// --------------------------------------------------------------------------

pub fun trace-state-of(current : trace<e>) : capture-state
  match current
    Trace-end -> Capture-dead
    Trace-read(gate,_,_,_,_,_,_,_,_) -> load(gate.gate-state)
    Trace-entry(gate,_,_,_,_,_) -> load(gate.gate-state)

pub fun trace-gate-of(current : trace<e>) : maybe<continuation-gate>
  match current
    Trace-end -> Nothing
    Trace-read(gate,_,_,_,_,_,_,_,_) -> Just(gate)
    Trace-entry(gate,_,_,_,_,_) -> Just(gate)

pub fun trace-parent-of(current : trace<e>) : maybe<continuation-gate>
  match current.trace-gate-of
    Nothing -> Nothing
    Just(gate) -> gate.gate-parent

// --------------------------------------------------------------------------
// Structured trace retirement
// --------------------------------------------------------------------------

pub type retirement<e::E>
  Retirement(retirement-finalizer : () -> <div,exn|e> ())

pub fun collect-retirement(current : trace<e>)
                      : <div> list<retirement<e>>
  match current
    Trace-end -> []
    Trace-read(gate,_,_,child,current-frame-slot,_,finalize,unlink,_) ->
      val state = gate.gate-state
      match load(state)
        Capture-dead -> []
        _ ->
          val current-frame = load(current-frame-slot)
          store(state,Capture-dead)
          store(current-frame.frame-token,Scope-branch-dead)
          unlink()
          val nested = load(child)
          store(child,Trace-end)
          val structural = load(current-frame.frame-owned)
          store(current-frame.frame-owned,Owned-end)
          collect-retirement(nested) ++
          collect-owned(structural) ++ [Retirement(finalize)]
    Trace-entry(gate,_,child,current-frame-slot,_,finalize) ->
      val state = gate.gate-state
      match load(state)
        Capture-dead -> []
        _ ->
          val current-frame = load(current-frame-slot)
          store(state,Capture-dead)
          store(current-frame.frame-token,Scope-branch-dead)
          val nested = load(child)
          store(child,Trace-end)
          val structural = load(current-frame.frame-owned)
          store(current-frame.frame-owned,Owned-end)
          collect-retirement(nested) ++
          collect-owned(structural) ++ [Retirement(finalize)]

pub fun collect-scope(current : continuation-scope<e>)
                 : <div> list<retirement<e>>
  // Cancellation before bootstrap is still one-shot: retirement severs the
  // only retained path to the initial calculate closure.
  store(current.scope-bootstrap-slot,Nothing)
  match load(current.scope-state)
    Scope-dead -> []
    _ ->
      store(current.scope-state,Scope-dead)
      val body = load(current.scope-body)
      val structural-prefix = load(current.scope-prefix)
      store(current.scope-body,Trace-end)
      store(current.scope-prefix,Owned-end)
      collect-retirement(body) ++ collect-owned(structural-prefix)

pub fun widen-pure-retirement(current : retirement<total>) : retirement<e>
  match current
    Retirement(action) -> Retirement(fn() action())

// Structural children are completely marked dead before cleanup actions are
// allowed to run. This is what makes self-disposal and cleanup-triggered writes
// unable to re-enter a half-retired subtree.
pub fun collect-owned-forks(values : owned<e>)
                       : <div> list<retirement<e>>
  match values
    Owned-end -> []
    Owned-fork(current,next) ->
      collect-scope(current) ++ collect-owned-forks(next)
    Owned-derive-fork(current,next) ->
      collect-scope(current).map(widen-pure-retirement) ++
      collect-owned-forks(next)
    Owned-cleanup(_,_,next) -> collect-owned-forks(next)

pub fun collect-owned-cleanups(values : owned<e>)
                          : <div> list<retirement<e>>
  match values
    Owned-end -> []
    Owned-fork(_,next) -> collect-owned-cleanups(next)
    Owned-derive-fork(_,next) -> collect-owned-cleanups(next)
    Owned-cleanup(live,action,next) ->
      if !load(live) then collect-owned-cleanups(next) else
        store(live,False)
        Cons(Retirement(action),collect-owned-cleanups(next))

pub fun collect-owned(values : owned<e>)
                 : <div> list<retirement<e>>
  collect-owned-forks(values) ++ collect-owned-cleanups(values)

pub fun run-finalizers(finalizers : list<retirement<e>>)
                  : <div,exn|e> ()
  match finalizers
    Nil -> ()
    Cons(current,rest) ->
      match current
        Retirement(finalize) ->
          finally(fn() run-finalizers(rest),finalize)

pub fun retire-trace(current : trace<e>) : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-retirement(current) }
  run-finalizers(finalizers)

pub fun retire-owned(values : owned<e>) : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-owned(values) }
  run-finalizers(finalizers)

pub fun retire-scope(current : continuation-scope<e>) : <div,exn|e> ()
  val finalizers = pretend-no-div{ collect-scope(current) }
  run-finalizers(finalizers)

pub fun retire-drafts(values : list<trace<e>>) : <div,exn|e> ()
  match values
    Nil -> ()
    Cons(current,rest) ->
      finally(fn() retire-drafts(rest),fn() retire-trace(current))

pub fun retire-drafts-now(values : list<trace<e>>) : <exn|e> ()
  pretend-no-div{ retire-drafts(values) }

pub fun try-retire-owned(values : owned<e>) : e error<()>
  error/try(fn() pretend-no-div{ retire-owned(values) })

pub fun try-retire-drafts(values : list<trace<e>>) : e error<()>
  error/try(fn() retire-drafts-now(values))

pub fun record-draft(plane : plane<e>, current : trace<e>) : exn ()
  match load(plane.plane-draft)
    Nothing -> throw("continuation node created outside a draft transaction")
    Just(values) -> store(values,Cons(current,load(values)))

pub fun attempt-build(plane : plane<e>,
                  drafts : ref<global,list<trace<e>>>,
                  action : () -> <div,exn|e> built-trace<e>)
                 : <div|e> error<built-trace<e>>
  val previous = load(plane.plane-draft)
  val completed = cell(False)
  val result = finally(
    fn() lift-div(fn(){
      store(plane.plane-draft,previous)
      // A final control operation does not return an `Error` to the caller.
      // Retire every raw continuation captured by the abandoned transaction
      // while this dynamic extent still owns the concrete draft list.
      if load(completed) then () else
        val _ = try-retire-drafts(load(drafts))
        ()
    }),
    fn()
      store(plane.plane-draft,Just(drafts))
      val attempt = error/try(action)
      store(completed,True)
      attempt
  )
  result

pub fun with-frame(plane : plane<e>, current : frame<e>,
               action : () -> <div,exn|e> a) : <div,exn|e> a
  val previous = load(plane.plane-current-frame)
  finally(
    fn() store(plane.plane-current-frame,previous),
    fn()
      store(plane.plane-current-frame,current)
      action()
  )

pub fun with-current(plane : plane<e>, current : trace<e>, current-frame : frame<e>,
                 action : () -> <div,exn|e> a) : <div,exn|e> a
  match current.trace-gate-of
    Nothing -> with-context(plane,Nothing,current-frame,action)
    Just(gate) -> with-context(plane,Just(gate),current-frame,action)

pub fun with-context(plane : plane<e>, current : maybe<continuation-gate>,
                 current-frame : frame<e>,
                 action : () -> <div,exn|e> a) : <div,exn|e> a
  val previous = load(plane.plane-current)
  finally(
    fn() store(plane.plane-current,previous),
    fn()
      store(plane.plane-current,current)
      with-frame(plane,current-frame,action)
  )

// Entry targeting is a dynamic capability, deliberately separate from the
// structural gate parent. Structural scopes inherit `plane-current` for
// lifetime gating, but never inherit a surrounding state entry target.
pub fun with-entry(plane : plane<e>, current : maybe<trace<e>>,
               action : () -> <div,exn|e> a) : <div,exn|e> a
  val previous = load(plane.plane-current-entry)
  finally(
    fn() store(plane.plane-current-entry,previous),
    fn()
      store(plane.plane-current-entry,current)
      action()
  )
