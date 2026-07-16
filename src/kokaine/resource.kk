/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Generation-owned reactive resources for the browser runtime.

  Dependency discovery is confined to the synchronous `source` calculation.
  Each loader receives its immutable source snapshot under Kokaine's closed
  Web async row and is owned by the create-effect generation which started it.
--------------------------------------------------------------------------*/
module kokaine/resource

import kokaine/reactive
import kokaine/async/effects
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

fun settle-active-request(
    state-source : signal<resource-state<a>>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
    terminal : request-terminal<a>) : signal-write ()
  if !cell/read(request-active) then () else
    cell/write(request-active,False)
    match terminal
      Request-succeeded(value) ->
        cell/write(latest-success,Just(value))
        state-source.set(Ready(value))
      Request-failed(problem) ->
        state-source.set(Failed(problem,cell/read(latest-success)))
      Request-canceled ->
        state-source.set(canceled-state(cell/read(latest-success)))

fun settle-request(
    state-source : signal<resource-state<a>>,
    request-generation : ref<global,int>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
    generation : int,
    terminal : request-terminal<a>) : signal-write ()
  if cell/read(request-generation) != generation then () else
    settle-active-request(
      state-source,request-active,latest-success,terminal)


// --------------------------------------------------------------------------
// Generation-bound request execution
// --------------------------------------------------------------------------

fun start-request(
    root : root<<ui>>,
    state-source : signal<resource-state<a>>,
    request-generation : ref<global,int>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
    generation : int,
    snapshot : s,
    load : s -> <async,ui,exn> a)
    : <signal-write,pure,ui> ()
  cell/write(request-active,True)
  state-source.set(Pending(cell/read(latest-success)))

  // `load` has a closed row with no `signal-read`; it therefore cannot turn
  // reads across suspension points into tracked resource dependencies. A
  // plain dispatch interprets the generation runner's broader reactive row as
  // sampled reads and ordinary writes; it never captures tracked dependencies.
  mask<div>{
    mask<signal-write>{
      dispatch(root,fn()
        run-async(root,fn()
          // Cancellation is final control, so terminal state publication must
          // live in the same unwind as the loader. Normal settlement consumes
          // `request-active` first and makes the finalizer a no-op.
          finally(
            fn() settle-request(
              state-source,request-generation,request-active,latest-success,
              generation,Request-canceled),
            fn() {
              val outcome = error/try(fn() load(snapshot))
              // The numeric guard rejects a completion which raced with a
              // refresh/cancel before host retirement won.
              match outcome
                Ok(value) ->
                  settle-request(
                    state-source,request-generation,request-active,
                    latest-success,generation,Request-succeeded(value))
                Error(problem) ->
                  settle-request(
                    state-source,request-generation,request-active,
                    latest-success,generation,Request-failed(problem))
            }
          )
        )
      )
    }
  }

fun retire-resource(
    state-source : signal<resource-state<a>>,
    request-generation : ref<global,int>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>)
    : signal-write ()
  // The async task is retired before owner resources are finalized. Invalidate
  // its commit token as a second guard for hostile host callbacks, then make
  // an escaped resource observably terminal while its root is still live.
  cell/write(request-generation,cell/read(request-generation) + 1)
  settle-active-request(
    state-source,request-active,latest-success,Request-canceled)

fun apply-input(
    root : root<<ui>>,
    state-source : signal<resource-state<a>>,
    last-source : ref<global,maybe<maybe<s>>>,
    last-command-revision : ref<global,int>,
    request-generation : ref<global,int>,
    request-active : ref<global,bool>,
    latest-success : ref<global,maybe<a>>,
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

      // A cancel written in the same batch as a source change dominates that
      // source invalidation. On a later turn the unchanged Cancel command is
      // merely historical, so a genuinely new source can start normally.
      if command-changed && !command.is-refresh then
        settle-active-request(
          state-source,request-active,latest-success,Request-canceled)
      elif changed || (command-changed && command.is-refresh) then
        match snapshot
          Nothing ->
            cell/write(request-active,False)
            cell/write(latest-success,Nothing)
            state-source.set(Unresolved)
          Just(value) ->
            start-request(
              root,state-source,request-generation,request-active,
              latest-success,generation,value,load)
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

  val dispose-resource = create-effect(
    root,
    fn() Resource-input(source-value.get,control-source.get),
    fn(input) apply-input(
      root,state-source,last-source,last-command-revision,
      request-generation,request-active,latest-success,equals,load,input)
  )

  on-cleanup(root,fn() {
    retire-resource(
      state-source,request-generation,request-active,latest-success)
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
