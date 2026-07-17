/*--------------------------------------------------------------------------
  Runtime representation for continuation-native reactivity.

  This module is internal. Its concrete types are public only so the sibling
  implementation modules can share one strongly connected representation.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/model

import std/core/unsafe
import std/core/undiv
import kokaine/reactive/internal/resource

// --------------------------------------------------------------------------
// Persistent cells and root identity
// --------------------------------------------------------------------------

pub fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

pub fun load(value : ref<global,a>) : a
  unsafe-total { !value }

pub fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

// A derivation is dynamically read-only even when application code hides a
// reactive operation behind a locally handled public wrapper. This marker is
// runtime-wide on purpose: a calculator running for root A must not mutate or
// register work in root B either. The runtime is synchronous; nesting is still
// represented explicitly so targeted producer settlement is safe.
val pure-plane-depth : ref<global,int> = cell(0)

pub fun enter-pure-plane() : int
  val previous = load(pure-plane-depth)
  store(pure-plane-depth,previous + 1)
  previous

pub fun restore-pure-plane(previous : int) : ()
  store(pure-plane-depth,previous)

pub fun check-not-pure-plane(operation : string) : exn ()
  if load(pure-plane-depth) <= 0 then ()
  else throw(operation ++ " is forbidden while a pure derivation is running")

pub fun lift-div(action : () -> e a) : <div|e> a
  mask<div>{ action() }

pub fun lift-exn(action : () -> e a) : <exn|e> a
  mask<exn>{ action() }

pub type root-key
  Root-key(identity : ref<global,bool>)

pub fun same-root(left : root-key, right : root-key) : bool
  unsafe-ptr-eq(left.identity,right.identity)


// --------------------------------------------------------------------------
// Source-local existential capabilities for exact read continuations
// --------------------------------------------------------------------------

// Rank-2 packaging erases only the ambient effect row. Unlike a callback,
// this value contains the actual execution plane and continuation node and
// permits one operation: hand that typed pair to a polymorphic consumer.
pub type packed-capture
  Packed-capture(
    run-packed : forall<r> (forall<e::E> (plane<e>,trace<e>,trace<e>) -> r) -> r
  )

pub type source<a>
  Source(
    source-root     : root-key,
    source-cell     : ref<global,a>,
    source-equals   : (a,a) -> bool,
    source-version  : ref<global,int>,
    source-captures : ref<global,list<packed-capture>>
  )


// `Track-read` captures the exact suffix. `State-entry-read` injects the
// latest committed state into the memo entry continuation without subscribing
// the memo to its own source. `Sample-read` is the untracked override.
pub type read-mode
  Track-read
  Sample-read
  State-entry-read

pub value type signal<a>
  Signal(signal-source : source<a>)

pub alias disposer<e> = () -> <exn|e> ()


// --------------------------------------------------------------------------
// Captured execution trace
// --------------------------------------------------------------------------

pub type capture-state
  Capture-draft
  Capture-live
  Capture-pending
  Capture-running
  Capture-dead

pub type settle-result
  Settle-ok
  Settle-deferred
  Settle-failed(settle-exception : exception)

// Non-effectful structural identity shared across execution planes.
pub type continuation-gate
  Continuation-gate(
    gate-state          : ref<global,capture-state>,
    gate-parent         : maybe<continuation-gate>,
    gate-input-producer : maybe<derive-producer>
  )

pub div type trace<e::E>
  Trace-end
  Trace-read(
    trace-gate         : continuation-gate,
    trace-owner        : ref<global,maybe<derive-producer>>,
    trace-entry-target : maybe<trace<e>>,
    trace-child        : ref<global,trace<e>>,
    trace-frame        : ref<global,frame<e>>,
    trace-resume       : (frame<e>) -> <div,exn|e> built-trace<e>,
    trace-finalize     : () -> <div,exn|e> (),
    trace-unlink       : () -> (),
    trace-stale        : () -> bool
  )
  Trace-entry(
    entry-gate     : continuation-gate,
    entry-owner    : ref<global,maybe<derive-producer>>,
    entry-child    : ref<global,trace<e>>,
    entry-frame    : ref<global,frame<e>>,
    entry-resume   : (frame<e>) -> <div,exn|e> built-trace<e>,
    entry-finalize : () -> <div,exn|e> ()
  )

pub type built-trace<e::E>
  Built-trace(
    built-root    : trace<e>,
    built-publish : () -> <div|e> error<()>
  )

pub type scope-state
  Scope-starting
  Scope-live
  Scope-branch-dead
  Scope-dead

pub type owned<e::E>
  Owned-end
  Owned-fork(
    owned-scope : continuation-scope<e>,
    fork-back   : ref<global,ref<global,owned<e>>>,
    fork-next   : ref<global,owned<e>>
  )
  Owned-derive-fork(
    owned-derive-scope : continuation-scope<total>,
    derive-back        : ref<global,ref<global,owned<e>>>,
    derive-next        : ref<global,owned<e>>
  )
  Owned-resource(
    owned-resource-slot : ref<global,maybe<resource-k<e>>>,
    resource-back       : ref<global,ref<global,owned<e>>>,
    resource-next       : ref<global,owned<e>>
  )

// Every live node knows the cell which currently points at it. This preserves
// the exact mixed LIFO order while allowing removable cleanup registrations to
// unlink themselves without rebuilding the entire owner ledger.
pub fun owned/set-back(value : owned<e>,
                       pointer : ref<global,owned<e>>) : ()
  match value
    Owned-end -> ()
    Owned-fork(_,back,_) -> store(back,pointer)
    Owned-derive-fork(_,back,_) -> store(back,pointer)
    Owned-resource(_,back,_) -> store(back,pointer)

pub fun same-resource-slot(
    left : ref<global,maybe<resource-k<e>>>,
    right : ref<global,maybe<resource-k<e>>>) : bool
  unsafe-ptr-eq(left,right)

pub type continuation-scope<e::E>
  Scope(
    scope-state  : ref<global,scope-state>,
    scope-prefix : ref<global,owned<e>>,
    scope-body   : ref<global,trace<e>>,
    scope-parent : maybe<continuation-gate>,
    scope-bootstrap-slot : ref<global,maybe<() -> <div|e> error<()>>>
  )

pub type frame<e::E>
  Frame(
    frame-token : ref<global,scope-state>,
    frame-owned : ref<global,owned<e>>
  )

pub type work<e::E>
  Resume-work(resume-trace : trace<e>)
  Bootstrap-work(
    bootstrap-scope : continuation-scope<e>,
    bootstrap-owner : ref<global,maybe<derive-producer>>
  )

// Derivations use `plane<total>` while effects use `plane<e>`.
pub type plane<e::E>
  Plane(
    plane-queue         : ref<global,list<work<e>>>,
    plane-current       : ref<global,maybe<continuation-gate>>,
    plane-current-entry : ref<global,maybe<trace<e>>>,
    plane-current-frame : ref<global,frame<e>>,
    plane-draft         : ref<global,maybe<ref<global,list<trace<e>>>>>
  )

pub type root<e::E>
  Root(
    root-key          : root-key,
    root-derive-plane : plane<total>,
    root-effect-plane : plane<e>,
    root-token        : ref<global,scope-state>,
    root-owned        : ref<global,owned<e>>,
    root-batch-depth  : ref<global,int>,
    root-flushing     : ref<global,bool>,
    root-disposing    : ref<global,bool>,
    root-disposed     : ref<global,bool>
  )

// A host callback cannot retain Koka's dynamic handler stack after its
// originating turn returns. It can, however, retain the exact structural
// capability of that turn: the effect plane, continuation gate, and frame
// which own any reactive work created when the callback later re-enters.
pub value type reentry<e::E>
  Reentry(
    reentry-root       : root<e>,
    reentry-checkpoint : maybe<continuation-gate>,
    reentry-frame      : frame<e>
  )

pub type derive-producer
  Derive-producer(
    producer-plane    : plane<total>,
    producer-scope    : continuation-scope<total>,
    producer-settling : ref<global,bool>
  )

pub value type memo<a>
  Memo(
    memo-source   : source<a>,
    memo-producer : derive-producer
  )
