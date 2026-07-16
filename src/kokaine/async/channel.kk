/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  A browser-local queue used by structured async combinators. Host callbacks
  enqueue inert resumption thunks; the structured driver resumes them one at a
  time under the surrounding async handler.
--------------------------------------------------------------------------*/
module kokaine/async/channel

import kokaine/async/effects
import std/core/unsafe


type queue-state<a>
  Queue-state(
    front : list<a>,
    back : list<a>,
    waiters : list<() -> ui ()>
  )

abstract value type resume-queue<a>
  Resume-queue(state : ref<global,queue-state<a>>)

fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

pub fun new-resume-queue() : resume-queue<a>
  Resume-queue(cell(Queue-state([],[],[])))

pub fun resume-queue/has-value(queue : resume-queue<a>) : bool
  match queue
    Resume-queue(state) ->
      match load(state)
        Queue-state(Nil,Nil,_) -> False
        _ -> True

// Remove the oldest buffered value. The two-list representation keeps host
// enqueue O(1) while preserving browser-observed callback order.
pub fun resume-queue/try-take(queue : resume-queue<a>) : maybe<a>
  match queue
    Resume-queue(state) ->
      match load(state)
        Queue-state(Cons(value,rest),back,waiters) ->
          store(state,Queue-state(rest,back,waiters))
          Just(value)
        Queue-state(Nil,Nil,_) -> Nothing
        Queue-state(Nil,back,waiters) ->
          match back.reverse
            Nil -> Nothing
            Cons(value,rest) ->
              store(state,Queue-state(rest,[],waiters))
              Just(value)

// Called only by a browser callback interpreted as `ui`. Always buffer the
// inert value before waking a driver. In particular, if that driver's wakeup
// is scheduled but its owner retires first, the queued strand capability is
// still available to the structured cancellation drain.
pub fun resume-queue/push-from-host(queue : resume-queue<a>, value : a)
                                      : ui ()
  match queue
    Resume-queue(state) ->
      match load(state)
        Queue-state(front,back,Cons(waiter,rest)) ->
          store(state,Queue-state(front,Cons(value,back),rest))
          waiter()
        Queue-state(front,back,Nil) ->
          store(state,Queue-state(front,Cons(value,back),[]))

// The structured driver has at most one outstanding receive, but retaining a
// waiter list makes synchronous setup/completion re-entry harmless.
pub fun resume-queue/take(queue : resume-queue<a>) : async a
  match queue.try-take
    Just(value) -> value
    Nothing ->
      await0-noexn("structured resume",fn(resume)
        match queue
          Resume-queue(state) ->
            match load(state)
              Queue-state(front,back,waiters) ->
                if !front.is-nil || !back.is-nil then resume()
                else store(state,Queue-state(front,back,waiters ++ [resume]))
      )
      match queue.try-take
        Just(value) -> value
        Nothing -> impossible("structured resume woke without a queued value")

// Convert each suspension in `action` into an installed non-blocking await.
// The host callback stores, but never directly executes, the captured suffix.
// The suffix is resumed only when the structured driver consumes the queue.
pub fun route-awaits(queue,action)
  // A structured loser is synthetically canceled at most once. Once its
  // strand is unwinding, later awaits belong to cleanup and must receive the
  // real host result (including a real Cancel from their own scope).
  val cancel-started = cell(False)
  with override
    raw ctl do-await(setup,scope,label)
      no-await(setup,scope,"structured: " ++ label,fn(result)
        // The selector retains cancellation authority. A parent retirement
        // can therefore discontinue a running strand even after its ordinary
        // result has arrived, without repeatedly canceling cleanup awaits.
        queue.push-from-host(fn(force-cancel)
          match result
            Cancel ->
              store(cancel-started,True)
              rcontext.resume(Cancel)
            _ ->
              if force-cancel && !load(cancel-started) then
                store(cancel-started,True)
                rcontext.resume(Cancel)
              else
                rcontext.resume(result)
        )
      )
      ()
    fun no-await(setup,scope,label,callback)
      no-await(setup,scope,label,callback)
  action()
