/*--------------------------------------------------------------------------
  Runtime representation for continuation-native reactivity.

  This module is internal. Its concrete types are public only so the sibling
  implementation modules can share one strongly connected representation.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/model

import std/core/unsafe
import std/core/undiv
import kokaine/reactive/internal/resource
import kokaine/internal/registry
import kokaine/reactive/internal/work-transaction

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
    run-packed : forall<r> (forall<e::E> (plane<e>,trace<e>) -> r) -> r
  )

pub type source<a>
  Source(
    source-root     : root-key,
    source-cell     : ref<global,a>,
    source-equals   : (a,a) -> bool,
    source-version  : ref<global,int>,
    source-captures : registry<packed-capture>
  )


// `Track-read` captures the exact suffix. `Sample-read` is the untracked
// override.
pub type read-mode
  Track-read
  Sample-read

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
    trace-gate     : continuation-gate,
    trace-owner    : ref<global,maybe<derive-producer>>,
    trace-child    : ref<global,trace<e>>,
    trace-frame    : ref<global,frame<e>>,
    trace-resume   : (frame<e>) -> <div,exn|e> built-trace<e>,
    trace-finalize : () -> <div,exn|e> (),
    trace-unlink   : () -> (),
    trace-stale    : () -> bool
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

// Retirement is represented as data so the complete structural subtree can
// be marked and detached before the first user finalizer runs. Step expansion
// is pure structural work; only Finalizer carries the owner's effect row.
pub type retirement-work<e::E>
  Retirement-step(
    retirement-expand : () -> <div> list<retirement-work<e>>
  )
  Retirement-finalizer(
    retirement-action : () -> <div,exn|e> ()
  )

// Every structural lifetime in one execution plane shares a retirement
// coordinator. A root-disposal request made by a re-entrant cleanup is held
// until the outermost already-detached finalizer snapshot has drained.
pub type retirement-coordinator<e::E>
  Retirement-coordinator(
    retirement-depth             : ref<global,int>,
    retirement-disposal-requested: ref<global,bool>,
    retirement-dispose-root      : ref<global,maybe<() -> <div,exn|e> ()>>
  )

// Causal continuation gates and resource lifetime are deliberately separate.
// Children and user finalizers have distinct registries so every descendant
// is closed before any cleanup runs, while both classes retain LIFO order.
pub type lifetime-owner<e::E>
  Lifetime-owner(
    lifetime-token      : ref<global,scope-state>,
    lifetime-children   : registry<retirement-work<e>>,
    lifetime-finalizers : registry<retirement-work<e>>,
    lifetime-retirement : retirement-coordinator<e>
  )

pub type cleanup-registration<e::E>
  Cleanup-registration(
    cleanup-node     : registry-registration<retirement-work<e>>,
    cleanup-resource : resource-k<e>
  )

pub type continuation-scope<e::E>
  Scope(
    scope-lifetime       : lifetime-owner<e>,
    scope-body           : ref<global,trace<e>>,
    scope-parent         : maybe<continuation-gate>,
    scope-bootstrap-slot : ref<global,maybe<() -> <div|e> error<()>>>,
    scope-unlink         : ref<global,maybe<() -> bool>>
  )

pub type frame<e::E>
  Frame(
    frame-lifetime : lifetime-owner<e>
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
    plane-queue         : work-queue<work<e>>,
    plane-work-group    : ref<global,maybe<work-group<work<e>>>>,
    plane-current       : ref<global,maybe<continuation-gate>>,
    plane-current-frame : ref<global,frame<e>>,
    plane-draft         : ref<global,maybe<ref<global,list<trace<e>>>>>,
    plane-retirement    : retirement-coordinator<e>
  )

pub type root<e::E>
  Root(
    root-key          : root-key,
    root-derive-plane : plane<total>,
    root-effect-plane : plane<e>,
    root-lifetime     : lifetime-owner<e>,
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
