/*--------------------------------------------------------------------------
  Typed, revocable transport for callbacks retained by a host integration.

  The host function is only an ABI trampoline. User work begins by resuming a
  guarded algebraic-effect continuation after the renderer has restored the
  owning reactive generation. The master resumption is deliberately multi-shot:
  host delivery may be synchronous and nested, while revocation remains one-way.
--------------------------------------------------------------------------*/
module kokaine/reactive/integration/event

import kokaine/reactive/effects
import std/core/unsafe


fun event-cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun event-load(value : ref<global,a>) : a
  unsafe-total { !value }

fun event-store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }


pub alias host-callback<e,a> = (value : a) -> <signal-read,signal-write,ui,pure|e> ()

// The erased payload keeps the raw control effect monomorphic while the public
// continuation remains typed. These identity casts never cross the host ABI;
// they only package the value retained by the opaque continuation.
extern host-event-box(value : a) : any
  inline "#1"

extern host-event-unbox(value : any) : a
  inline "#1"

effect host-event
  ctl await-host-event() : any

type event-result<e,a>
  Event-finished
  Event-master(
    master-resume : any -> <signal-read,signal-write,ui,pure|e> event-result<e,a>
  )

type event-state<e,a>
  Event-live(resume : any -> <signal-read,signal-write,ui,pure|e> event-result<e,a>)
  Event-retired

abstract type event-continuation<e,a>
  Event-continuation(
    continuation-state : ref<global,event-state<e,a>>
  )

fun reify-event(action : host-callback<e,a>)
               : <signal-read,signal-write,ui,pure|e> event-result<e,a>
  with raw ctl await-host-event()
    Event-master(fn(value) rcontext.resume(value))
  val value = await-host-event()
  mask<host-event>{ action(host-event-unbox(value)) }
  Event-finished

pub fun capture-event(action : host-callback<e,a>)
                     : <signal-read,signal-write,ui,pure|e> event-continuation<e,a>
  match reify-event(action)
    Event-master(resume) ->
      Event-continuation(event-cell(Event-live(resume)))
    // `reify-event` always suspends at its first operation. Keep the fallback
    // total so this invariant does not leak an exception capability.
    Event-finished -> Event-continuation(event-cell(Event-retired))

// Returns False after retirement. The opaque gate is checked before touching
// the raw multi-shot capability, including during nested synchronous delivery.
pub fun event-continuation/resume(value : event-continuation<e,a>, input : a)
    : <signal-read,signal-write,ui,pure|e> bool
  match value
    Event-continuation(state) ->
      match event-load(state)
        Event-retired -> False
        Event-live(resume) ->
          val _ = resume(host-event-box(input))
          True

// Gate first and drop the sole retained raw capability. The parked suffix has
// not begun `action` and contains no acquired resource/finalizer, so abandoning
// it is the correct cancellation semantics; garbage collection reclaims K.
pub fun event-continuation/close(value : event-continuation<e,a>) : ()
  match value
    Event-continuation(state) -> event-store(state,Event-retired)

pub fun event-continuation/is-live(value : event-continuation<e,a>) : bool
  match value
    Event-continuation(state) ->
      match event-load(state)
        Event-live(_) -> True
        Event-retired -> False
