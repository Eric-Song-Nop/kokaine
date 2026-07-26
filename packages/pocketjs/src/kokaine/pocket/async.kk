/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  PocketJS frame-time adapters for Kokaine Async.

  The JavaScript bridge owns the mount-scoped dispatcher and advances timers
  from Pocket's deterministic lifecycle frames. Koka callbacks stay behind
  revocable cells; every accepted completion enters the existing
  generation-bound Async interpreter instead of resuming a continuation
  directly from host code.
--------------------------------------------------------------------------*/
module kokaine/pocket/async

pub import kokaine/async/effects
pub import kokaine/async/structured
import kokaine/reactive
import kokaine/reactive/async/integration


// --------------------------------------------------------------------------
// Mount-scoped host scheduling
// --------------------------------------------------------------------------

abstract type schedule-subscription
  Schedule-subscription(value : any)

abstract type pocket-dispatcher
  Pocket-dispatcher(value : any)

extern capture-dispatcher-raw() : ui any
  js inline "(function(){ try { var bridge=globalThis[Symbol.for('kokaine.pocketjs.async')]; if(!bridge || bridge.version!==1 || typeof bridge.capture!=='function') throw new Error('Kokaine PocketJS async bridge version 1 is not installed'); var dispatcher=bridge.capture(); if(!dispatcher || typeof dispatcher.post!=='function' || typeof dispatcher.afterMilliseconds!=='function') throw new Error('Kokaine PocketJS async dispatcher is unavailable'); return { ok:true, dispatcher:dispatcher }; } catch(error) { return { ok:false, error:error }; } })()"

extern schedule-result-dispatcher(value : any) : pocket-dispatcher
  js inline "(#1).dispatcher"

extern dispatcher-post(dispatcher : pocket-dispatcher,
                       action : () -> ui ()) : ui bool
  js inline "(function(){ try { return (#1).post(#2)===true; } catch(error) { try { var message=error && error.message; console.error('Kokaine PocketJS async dispatcher failed: '+String(message == null ? error : message)); } catch(_) {} return false; } })()"

// Pocket's bridge rounds milliseconds upward to the latched simulation frame
// rate. Even a zero delay settles no earlier than the next virtual frame.
extern timer-setup-raw(milliseconds : int,
                       complete : () -> ui ()) : ui any
  js inline "(function(){ var state={ callback:#2, cancel:null }; try { var bridge=globalThis[Symbol.for('kokaine.pocketjs.async')]; if(!bridge || bridge.version!==1 || typeof bridge.capture!=='function') throw new Error('Kokaine PocketJS async bridge version 1 is not installed'); var dispatcher=bridge.capture(); if(!dispatcher || typeof dispatcher.afterMilliseconds!=='function') throw new Error('Kokaine PocketJS async dispatcher is unavailable'); var cancel=dispatcher.afterMilliseconds(#1,function(){ var callback=state.callback; state.callback=null; state.cancel=null; if(callback) callback(); }); if(cancel===false){ state.callback=null; return { ok:false, error:'PocketJS async dispatcher is retired' }; } if(typeof cancel!=='function'){ state.callback=null; return { ok:false, error:'PocketJS async dispatcher returned an invalid timer disposer' }; } state.cancel=cancel; return { ok:true, state:state }; } catch(error) { state.callback=null; state.cancel=null; return { ok:false, error:error }; } })()"

extern schedule-result-ok(value : any) : bool
  js inline "!!(#1).ok"

extern schedule-result-error(value : any) : any
  js inline "(#1).error"

extern schedule-error-message(value : any) : string
  js inline "(function(error){ try { var message=error && error.message; return String(message == null ? error : message); } catch(_) { return 'unprintable host error'; } })(#1)"

extern schedule-result-state(value : any) : schedule-subscription
  js inline "(#1).state"

// Revoke the language callback first. Timer cancellation is best-effort
// because a host disposer must never prevent generation retirement.
extern schedule-retire(value : schedule-subscription) : ui ()
  js inline "(function(){ var state=#1; if(!state) return; var cancel=state.cancel; state.callback=null; state.cancel=null; if(typeof cancel==='function'){ try { cancel(); } catch(_) {} } })()"


// --------------------------------------------------------------------------
// Public Async facade
// --------------------------------------------------------------------------

pub fun run-async(
    root : root<<ui>>,
    action : () -> <async,signal-read,signal-write,pure,ui> ())
    : <signal-read,signal-write,pure,ui> ()
  val captured = capture-dispatcher-raw()
  if !schedule-result-ok(captured)
  then throw(
    "PocketJS async dispatcher capture failed: " ++
    schedule-error-message(schedule-result-error(captured)))
  else
    val dispatcher = schedule-result-dispatcher(captured)
    val host = new-async-host-dispatcher(
      fn(turn) dispatcher-post(dispatcher,turn))
    run-async-with-dispatcher(root,host,action)

// Pocket uses integer milliseconds instead of `std/time/duration`: Koka 3.2's
// duration graph does not survive Pocket 0.6's Bun bundling pass.
pub fun sleep(milliseconds : int) : <async,exn> ()
  setup/await("PocketJS sleep " ++ milliseconds.show ++ "ms",fn(resume)
    val installed = timer-setup-raw(
      max(0,milliseconds),
      fn() resume(Ok(()))
    )
    if !schedule-result-ok(installed)
    then Error(Exception(
      "PocketJS timer setup failed: " ++
      schedule-error-message(schedule-result-error(installed)),
      ExnError))
    else
      val subscription = schedule-result-state(installed)
      Ok(fn() schedule-retire(subscription))
  )

pub fun yield() : <async,exn> ()
  sleep(0)

pub fun timeout(milliseconds : int,
                action : () -> <async,exn|e> a)
               : <async,exn|e> maybe<a>
  timeout-with(fn() sleep(milliseconds),action)
