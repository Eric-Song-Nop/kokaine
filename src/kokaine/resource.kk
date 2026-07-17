/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Reactive async resources for the browser runtime.

  Dependency discovery is confined to the synchronous `source` calculation.
  Each loader receives its immutable source snapshot under Kokaine's closed
  Web async row. Its task is owned by the create-effect generation which
  started it; successful host-value leases are promoted to the Resource.
--------------------------------------------------------------------------*/
module kokaine/resource

import kokaine/reactive
import kokaine/async/effects
import kokaine/reactive/internal/async-runtime
import std/core/unsafe


// --------------------------------------------------------------------------
// Public state and handle
// --------------------------------------------------------------------------

pub type resource-state<a>
  Unresolved
  Pending(previous : maybe<a>)
  Ready(value : a)
  Failed(error : exception, previous : maybe<a>)

type resource-command
  Refresh-command(revision : int)
  Cancel-command(revision : int)

type resource-input<s>
  Resource-input(source : maybe<s>, command : resource-command)

type request-terminal<a>
  Request-succeeded(value : a)
  Request-failed(error : exception)
  Request-canceled

// The constructor is private: callers observe the one atomic state signal and
// can only invalidate the private control signal through `refresh` or `cancel`.
abstract value type resource<s,a>
  Resource(
    resource-state-source : signal<resource-state<a>>,
    resource-control-source : signal<resource-command>
  )


// --------------------------------------------------------------------------
// Private request metadata
// --------------------------------------------------------------------------

fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun cell/read(value : ref<global,a>) : a
  unsafe-total { !value }

fun cell/write(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

fun resource-command/is-refresh(command : resource-command) : bool
  match command
    Refresh-command(_) -> True
    Cancel-command(_) -> False

fun same-source(left : maybe<s>, right : maybe<s>,
                equals : (s,s) -> bool) : bool
  match (left,right)
    (Nothing,Nothing) -> True
    (Just(left-value),Just(right-value)) -> equals(left-value,right-value)
    _ -> False

fun source-changed(previous : maybe<maybe<s>>, current : maybe<s>,
                   equals : (s,s) -> bool) : bool
  match previous
    Nothing -> True
    Just(old) -> !same-source(old,current,equals)

fun canceled-state(previous : maybe<a>) : resource-state<a>
  match previous
    Nothing -> Unresolved
    Just(value) -> Ready(value)

fun take-lease-group(slot : ref<global,maybe<async-lease-group>>)
                    : maybe<async-lease-group>
  val current = cell/read(slot)
  cell/write(slot,Nothing)
  current

fun dispose-lease-group(current : maybe<async-lease-group>) : ui ()
  match current
    Nothing -> ()
    Just(group) -> group.dispose

// Keep loader-acquired host values under the Resource rather than the
// create-effect generation which happened to observe this request. The
// Resource can then retain a successful previous value across refresh while
// still retiring failed, canceled, replaced, or unreachable values exactly
// once.
fun in-resource-ownership(
    group : async-lease-group,
    action : () -> <async,ui,exn> a) : <async,ui,exn> a
  with override
    fun async-own-disposer(dispose)
      group.own(dispose)
  action()

fun settle-active-request(
    state-source : signal<resource-state<a>>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
    active-ownership : ref<global,maybe<async-lease-group>>,
    latest-ownership : ref<global,maybe<async-lease-group>>,
    terminal : request-terminal<a>) : <signal-write,ui> ()
  if !cell/read(request-active) then () else
    cell/write(request-active,False)
    val current-ownership = take-lease-group(active-ownership)
    match terminal
      Request-succeeded(value) ->
        val previous-ownership = take-lease-group(latest-ownership)
        cell/write(latest-ownership,current-ownership)
        cell/write(latest-success,Just(value))
        state-source.set(Ready(value))
        // Publish and detach first: a hostile disposer cannot re-enter an
        // intermediate state or claim the new value's group.
        dispose-lease-group(previous-ownership)
      Request-failed(problem) ->
        state-source.set(Failed(problem,cell/read(latest-success)))
        dispose-lease-group(current-ownership)
      Request-canceled ->
        state-source.set(canceled-state(cell/read(latest-success)))
        dispose-lease-group(current-ownership)

fun settle-request(
    state-source : signal<resource-state<a>>,
    request-generation : ref<global,int>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
    active-ownership : ref<global,maybe<async-lease-group>>,
    latest-ownership : ref<global,maybe<async-lease-group>>,
    ownership : async-lease-group,
    generation : int,
    terminal : request-terminal<a>) : <signal-write,ui> ()
  if cell/read(request-generation) != generation then
    // A newer draft generation may already have replaced the shared active
    // slot before this old structural generation retires. The request keeps
    // its exact group so that stale finalization still closes that lease.
    ownership.dispose
  else
    settle-active-request(
      state-source,request-active,latest-success,
      active-ownership,latest-ownership,terminal)

fun clear-resource(
    state-source : signal<resource-state<a>>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
    active-ownership : ref<global,maybe<async-lease-group>>,
    latest-ownership : ref<global,maybe<async-lease-group>>)
    : <signal-write,ui> ()
  val active = take-lease-group(active-ownership)
  val latest = take-lease-group(latest-ownership)
  cell/write(request-active,False)
  cell/write(latest-success,Nothing)
  state-source.set(Unresolved)
  // The latest group must still retire if a hostile active disposer aborts
  // control flow after both ownership edges have been detached.
  finally(fn() dispose-lease-group(latest),
          fn() dispose-lease-group(active))


// --------------------------------------------------------------------------
// Generation-bound request execution
// --------------------------------------------------------------------------

fun start-request(
    root : root<<ui>>,
    state-source : signal<resource-state<a>>,
    request-generation : ref<global,int>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
    active-ownership : ref<global,maybe<async-lease-group>>,
    latest-ownership : ref<global,maybe<async-lease-group>>,
    generation : int,
    snapshot : s,
    load : s -> <async,ui,exn> a)
    : <signal-write,pure,ui> ()
  val superseded-ownership = take-lease-group(active-ownership)
  val ownership = new-async-lease-group()
  cell/write(active-ownership,Just(ownership))
  cell/write(request-active,True)
  state-source.set(Pending(cell/read(latest-success)))

  // `load` has a closed row with no `signal-read`; it therefore cannot turn
  // reads across suspension points into tracked resource dependencies. A
  // plain dispatch interprets the generation runner's broader reactive row as
  // sampled reads and ordinary writes; it never captures tracked dependencies.
  // Effect generations are built before their predecessors are finalized.
  // Install and durably start the replacement before retiring a prior active
  // bucket, while `finally` still guarantees that the old edge is consumed.
  finally(
    fn() dispose-lease-group(superseded-ownership),
    fn()
      mask<div>{
        mask<signal-write>{
          dispatch(root,fn()
            run-async(root,fn()
              // Cancellation is final control, so terminal state publication
              // must live in the same unwind as the loader. Normal settlement
              // consumes `request-active` first and makes the finalizer a no-op.
              finally(
                fn() settle-request(
                  state-source,request-generation,request-active,latest-success,
                  active-ownership,latest-ownership,ownership,
                  generation,Request-canceled),
                fn() {
                  val load-owned = fn() load(snapshot)
                  val outcome = in-resource-ownership(
                    ownership,
                    fn() error/try(load-owned)
                  )
                  // The numeric guard rejects a completion which raced with a
                  // refresh/cancel before host retirement won.
                  match outcome
                    Ok(value) ->
                      settle-request(
                        state-source,request-generation,request-active,
                        latest-success,active-ownership,latest-ownership,
                        ownership,generation,Request-succeeded(value))
                    Error(problem) ->
                      settle-request(
                        state-source,request-generation,request-active,
                        latest-success,active-ownership,latest-ownership,
                        ownership,generation,Request-failed(problem))
                }
              )
            )
          )
        }
      }
  )

fun retire-resource(
    state-source : signal<resource-state<a>>,
    request-generation : ref<global,int>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
    active-ownership : ref<global,maybe<async-lease-group>>,
    latest-ownership : ref<global,maybe<async-lease-group>>)
    : <signal-write,ui> ()
  // The async task is retired before owner resources are finalized. Invalidate
  // its commit token as a second guard for hostile host callbacks, then make
  // an escaped resource observably terminal while its root is still live.
  cell/write(request-generation,cell/read(request-generation) + 1)
  clear-resource(
    state-source,request-active,latest-success,
    active-ownership,latest-ownership)

fun apply-input(
    root : root<<ui>>,
    state-source : signal<resource-state<a>>,
    last-source : ref<global,maybe<maybe<s>>>,
    last-command-revision : ref<global,int>,
    request-generation : ref<global,int>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
    active-ownership : ref<global,maybe<async-lease-group>>,
    latest-ownership : ref<global,maybe<async-lease-group>>,
    equals : (s,s) -> bool,
    load : s -> <async,ui,exn> a,
    input : resource-input<s>)
    : <signal-write,pure,ui> ()
  match input
    Resource-input(snapshot,command) ->
      val changed = source-changed(cell/read(last-source),snapshot,equals)
      val command-changed =
        cell/read(last-command-revision) != command.revision
      cell/write(last-source,Just(snapshot))
      cell/write(last-command-revision,command.revision)

      // Every applied source/control invalidation gets a fresh logical
      // generation, independently of whether the host operation is cancelable.
      val generation = cell/read(request-generation) + 1
      cell/write(request-generation,generation)

      match snapshot
        Nothing ->
          // Source absence is terminal even when the same batch also writes
          // Cancel. No cached value may remain observable without a source.
          if changed || command-changed then
            clear-resource(
              state-source,request-active,latest-success,
              active-ownership,latest-ownership)
          else ()
        Just(value) ->
          // For a present source, a new Cancel still dominates a simultaneous
          // source change. An unchanged Cancel is merely historical, so a
          // genuinely later source may start normally.
          if command-changed && !command.is-refresh then
            settle-active-request(
              state-source,request-active,latest-success,
              active-ownership,latest-ownership,Request-canceled)
          elif changed || (command-changed && command.is-refresh) then
            start-request(
              root,state-source,request-generation,request-active,
              latest-success,active-ownership,latest-ownership,
              generation,value,load)
          else ()


// --------------------------------------------------------------------------
// Public construction and observation
// --------------------------------------------------------------------------

pub fun resource-by(
    root : root<<ui>>,
    source : () -> signal-read maybe<s>,
    load : s -> <async,ui,exn> a,
    equals : (s,s) -> bool)
    : <signal-write,pure> resource<s,a>
  val state-source = signal-always(root,Unresolved)
  val control-source = signal-by(
    root,Refresh-command(0),
    fn(left,right) left.revision == right.revision)

  // A pure derived equality cut prevents an upstream invalidation whose
  // source snapshot is semantically equal from retiring the active request.
  val source-value = derive-by(
    root,Nothing,source,
    fn(left,right) same-source(left,right,equals))

  val last-source = cell(Nothing)
  val last-command-revision = cell(-1)
  val request-generation = cell(0)
  val request-active = cell(False)
  val latest-success = cell(Nothing)
  val active-ownership = cell(Nothing)
  val latest-ownership = cell(Nothing)

  val dispose-resource = create-effect(
    root,
    fn() Resource-input(source-value.get,control-source.get),
    fn(input) apply-input(
      root,state-source,last-source,last-command-revision,
      request-generation,request-active,latest-success,
      active-ownership,latest-ownership,equals,load,input)
  )

  on-cleanup(root,fn() {
    retire-resource(
      state-source,request-generation,request-active,latest-success,
      active-ownership,latest-ownership)
  })

  Resource(state-source,control-source)

pub fun resource(
    root : root<<ui>>,
    source : () -> signal-read maybe<s>,
    load : s -> <async,ui,exn> a,
    ?(==) : (s,s) -> bool)
    : <signal-write,pure> resource<s,a>
  resource-by(root,source,load,(==))

pub fun resource/state(value : resource<s,a>)
                       : signal-read resource-state<a>
  match value
    Resource(state-source,_) -> state-source.get

pub fun resource/latest(value : resource<s,a>) : signal-read maybe<a>
  match value.state
    Unresolved -> Nothing
    Pending(previous) -> previous
    Ready(current) -> Just(current)
    Failed(_,previous) -> previous

pub fun resource/refresh(value : resource<s,a>) : signal-write ()
  match value
    Resource(_,control-source) ->
      val next = fn(command)
        Refresh-command(command.revision + 1)
      control-source.modify(next)

pub fun resource/cancel(value : resource<s,a>) : signal-write ()
  match value
    Resource(_,control-source) ->
      val next = fn(command)
        Cancel-command(command.revision + 1)
      control-source.modify(next)
