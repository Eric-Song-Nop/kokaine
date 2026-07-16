/*--------------------------------------------------------------------------
  A retained browser listener uses JavaScript only as an ABI trampoline. User
  work begins by resuming this algebraic-effect continuation.

  The master resumption is deliberately multi-shot. DOM `dispatchEvent` is
  synchronous and may nest; a one-shot await loop cannot capture its next K
  until the current action finishes and would therefore reorder nested events.
  An explicit opaque state gate makes revocation one-way even though Koka raw
  resumptions are multi-shot.
--------------------------------------------------------------------------*/
module kokaine/internal/event-runtime

import kokaine/html
import std/core/unsafe


fun event-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun event-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun event-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }


effect browser-event
  ctl await-browser-event() : event

type event-result
  Event-finished
  Event-master(
    master-resume : event -> callback-effect event-result
  )

type event-state
  Event-live(resume : event -> callback-effect event-result)
  Event-retired

abstract type event-continuation
  Event-continuation(
    continuation-state : ref<global,event-state>
  )

fun reify-event(action : callback) : callback-effect event-result
  with raw ctl await-browser-event()
    Event-master(fn(value) rcontext.resume(value))
  val value = await-browser-event()
  mask<browser-event>{ action(value) }
  Event-finished

pub fun capture-event(action : callback) : callback-effect event-continuation
  match reify-event(action)
    Event-master(resume) ->
      Event-continuation(event-cell(Event-live(resume)))
    // `reify-event` always suspends at its first operation. Keep the fallback
    // total so this invariant does not leak an exception capability.
    Event-finished -> Event-continuation(event-cell(Event-retired))

// Returns False after retirement. The opaque gate is checked before touching
// the raw multi-shot capability, including during nested synchronous dispatch.
pub fun event-continuation/resume(value : event-continuation, input : event)
                                     : callback-effect bool
  match value
    Event-continuation(state) ->
      match event-load(state)
        Event-retired -> False
        Event-live(resume) ->
          val _ = resume(input)
          True

// Gate first and drop the sole retained raw capability. The parked suffix has
// not begun `action` and contains no acquired resource/finalizer, so abandoning
// it is the correct cancellation semantics; garbage collection reclaims K.
// This also remains safe when close races with an already-active nested resume.
pub fun event-continuation/close(value : event-continuation) : ()
  match value
    Event-continuation(state) -> event-store(state,Event-retired)

pub fun event-continuation/is-live(value : event-continuation) : bool
  match value
    Event-continuation(state) ->
      match event-load(state)
        Event-live(_) -> True
        Event-retired -> False
