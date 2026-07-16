/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Browser event-loop adapters for Kokaine async.

  JavaScript promises are confined to this FFI boundary. Application code
  awaits them in direct style through the algebra in `kokaine/async/effects`.
  Every subscription stores Koka callbacks behind a revocable JavaScript cell
  so cancellation can drop the continuation even when the host operation
  itself cannot be stopped.
--------------------------------------------------------------------------*/
module kokaine/async/web

import kokaine/async/effects
pub import kokaine/async/structured
import std/time/duration


// --------------------------------------------------------------------------
// Browser scheduling
// --------------------------------------------------------------------------

abstract type timer-subscription
  Timer-subscription(value : any)

// Browsers coerce one timeout delay through a signed 32-bit representation.
// Keep the exact total as a safe integer, schedule bounded chunks, and use a
// short monotonic deadline per chunk to absorb both early and late callbacks.
extern timer-setup-raw(milliseconds : int,
                       fulfill : () -> ui (),
                       reject : string -> ui ()) : ui any
  js inline "(function(){ var maxDelay=2147483647; var requested=Math.max(0,Number(#1)); var state={ fulfill:#2, reject:#3, handle:null, remaining:0, started:0, slice:0, deadline:0 }; function message(error){ return String(error && error.message != null ? error.message : error); } function clear(){ state.fulfill=null; state.reject=null; state.handle=null; } function complete(){ var callback=state.fulfill; clear(); if(callback) callback(); } function fail(error){ var callback=state.reject; clear(); if(callback) callback(message(error)); } function schedule(delay){ state.handle=setTimeout(tick,delay); } function arm(){ state.slice=Math.min(maxDelay,Math.ceil(state.remaining)); state.started=performance.now(); state.deadline=state.started+state.slice; schedule(state.slice); } function tick(){ state.handle=null; if(!state.fulfill) return; try { var now=performance.now(); var until=state.deadline-now; if(until>0){ schedule(Math.min(maxDelay,Math.ceil(until))); return; } state.remaining=Math.max(0,state.remaining-Math.max(state.slice,now-state.started)); if(state.remaining<=0) complete(); else arm(); } catch(error) { fail(error); } } if(!Number.isSafeInteger(requested)){ clear(); return { ok:false, message:'duration exceeds the exact browser timer range' }; } state.remaining=requested; try { arm(); return { ok:true, state:state }; } catch(error) { clear(); return { ok:false, message:message(error) }; } })()"

extern host-result-ok(value : any) : bool
  js inline "!!(#1).ok"

extern host-result-message(value : any) : string
  js inline "String((#1).message == null ? '' : (#1).message)"

extern host-result-state(value : any) : timer-subscription
  js inline "(#1).state"

extern timer-retire(value : timer-subscription) : ui ()
  js inline "(function(){ var state=#1; if(!state) return; var handle=state.handle; state.fulfill=null; state.reject=null; state.handle=null; if(handle!=null){ try { clearTimeout(handle); } catch(_) {} } })()"

// Sleep without holding a Kokaine batch open. The generation handler invokes
// this setup only after it has registered the task with the current owner.
pub fun sleep(delay : duration) : <async,exn> ()
  setup/await("sleep " ++ delay.show,fn(resume)
    val installed = timer-setup-raw(
      max(0,delay.milli-seconds),
      fn() resume(Ok(())),
      fn(message) resume(Error(Exception(
        "browser timer failed: " ++ message,ExnError)))
    )
    if !host-result-ok(installed)
    then Error(Exception("browser timer setup failed: " ++
                         host-result-message(installed),ExnError))
    else
      val subscription = host-result-state(installed)
      Ok(fn() timer-retire(subscription))
  )

pub fun yield() : <async,exn> ()
  sleep(0.milli-seconds)

pub fun timeout(delay : duration,
                action : () -> <async,exn|e> a)
               : <async,exn|e> maybe<a>
  timeout-with(fn() sleep(delay),action)


// --------------------------------------------------------------------------
// Promise interop
// --------------------------------------------------------------------------

// One-field browser wrappers erase to their JavaScript values on `jsweb`.
abstract type promise<a>
  Browser-promise(value : any)

abstract type promise-subscription
  Promise-subscription(value : any)

// Explicitly unsafe because no runtime check can prove the JavaScript promise
// resolves to Koka value `a`.
pub extern unsafe-promise(value : any) : promise<a>
  js inline "#1"

pub extern promise/unsafe-any(value : promise<a>) : any
  js inline "#1"

extern promise-subscribe(value : promise<a>,
                         fulfill : a -> ui (),
                         reject : string -> ui ()) : ui any
  js inline "(function(){ var state={ fulfill:#2, reject:#3 }; try { Promise.resolve(#1).then(function(value){ var callback=state.fulfill; state.fulfill=null; state.reject=null; if(callback) callback(value); },function(error){ var callback=state.reject; state.fulfill=null; state.reject=null; if(callback) callback(String(error && error.message != null ? error.message : error)); }); return { ok:true, state:state }; } catch(error) { state.fulfill=null; state.reject=null; return { ok:false, message:String(error && error.message != null ? error.message : error) }; } })()"

extern promise-result-state(value : any) : promise-subscription
  js inline "(#1).state"

// Drop both Koka callbacks before touching any host object. A non-cancelable
// Promise may still settle, but its JavaScript closure then sees an inert cell.
extern promise-retire(value : promise-subscription) : ui ()
  js inline "(function(){ var state=#1; if(state){ state.fulfill=null; state.reject=null; } })()"

pub fun promise/await(value : promise<a>) : <async,exn> a
  setup/await("promise",fn(resume)
    val installed = promise-subscribe(
      value,
      fn(result) resume(Ok(result)),
      fn(message) resume(Error(Exception(
        "browser Promise rejected: " ++ message,ExnError)))
    )
    if !host-result-ok(installed)
    then Error(Exception("browser Promise setup failed: " ++
                         host-result-message(installed),ExnError))
    else
      val subscription = promise-result-state(installed)
      Ok(fn() promise-retire(subscription))
  )


// --------------------------------------------------------------------------
// Fetch
// --------------------------------------------------------------------------

abstract type request
  Browser-request(value : any)

abstract type response
  Browser-response(value : any)

abstract type fetch-subscription
  Fetch-subscription(value : any)

pub extern request(url : string, method : string = "GET",
                   body : maybe<string> = Nothing) : request
  js inline "({ url:#1, init:{ method:#2, body:(#3 == null ? undefined : (#3).value) } })"

// Convenience constructors keep the common call sites direct and typed.
pub fun get(url : string) : request
  request(url)

pub fun post(url : string, body : string) : request
  request(url,"POST",Just(body))

extern fetch-subscribe(value : request,
                       fulfill : response -> ui (),
                       reject : string -> ui ()) : ui any
  js inline "(function(){ var controller=null; var state={ fulfill:#2, reject:#3, controller:null }; try { controller=new AbortController(); state.controller=controller; var request=#1; globalThis.fetch(request.url,Object.assign({},request.init,{ signal:controller.signal })).then(function(value){ var callback=state.fulfill; var activeController=state.controller; state.fulfill=null; state.reject=null; if(callback) callback({ response:value, controller:activeController, release:null }); },function(error){ var callback=state.reject; state.fulfill=null; state.reject=null; state.controller=null; if(callback) callback(String(error && error.message != null ? error.message : error)); }); return { ok:true, state:state }; } catch(error) { state.fulfill=null; state.reject=null; state.controller=null; return { ok:false, message:String(error && error.message != null ? error.message : error) }; } })()"

extern fetch-result-state(value : any) : fetch-subscription
  js inline "(#1).state"

// Revoke Koka closures first; AbortController is invoked only after the task
// has become inert, so a hostile/polyfilled abort cannot re-enter it.
extern fetch-retire(value : fetch-subscription) : ui ()
  js inline "(function(){ var state=#1; if(!state) return; var controller=state.controller; state.fulfill=null; state.reject=null; state.controller=null; if(controller){ try { controller.abort(); } catch(_) {} } })()"

pub fun fetch(value : request) : <async,exn> response
  val result = setup/await("fetch",fn(resume)
    val installed = fetch-subscribe(
      value,
      fn(result) resume(Ok(result)),
      fn(message) resume(Error(Exception(
        "browser Fetch rejected: " ++ message,ExnError)))
    )
    if !host-result-ok(installed)
    then Error(Exception("browser Fetch setup failed: " ++
                         host-result-message(installed),ExnError))
    else
      val subscription = fetch-result-state(installed)
      Ok(fn() fetch-retire(subscription))
  )
  // Header delivery completes the Fetch await, but the controller must remain
  // owned until the response is discarded or body consumption takes over.
  val release = async-own(fn() response-retire(result))
  async-host(fn() response-own(result,release))
  result

pub extern response/status(value : response) : ui int
  js inline "Number((#1).response.status)"

pub extern response/ok(value : response) : ui bool
  js inline "!!(#1).response.ok"

pub extern response/url(value : response) : ui string
  js inline "String((#1).response.url == null ? '' : (#1).response.url)"

extern response-own(value : response, release : dispose-fn) : ui ()
  js inline "(#1).release=#2"

// Generation retirement owns this raw disposer. It must not call the lease's
// release action because the owner registration is already being finalized.
extern response-retire(value : response) : ui ()
  js inline "(function(){ var wrapper=#1; if(!wrapper) return; var response=wrapper.response; var controller=wrapper.controller; var body=response && response.body; wrapper.release=null; wrapper.controller=null; if(controller){ try { controller.abort(); } catch(_) {} } if(body && !body.locked){ try { var canceled=body.cancel(); if(canceled && canceled.catch) canceled.catch(function(){}); } catch(_) {} } })()"

// A response which will not be consumed explicitly releases its generation
// lease before aborting. Clear the wrapper first so hostile host objects cannot
// observe or re-enter a live ownership edge.
pub extern response/discard(value : response) : ui ()
  js inline "(function(){ var wrapper=#1; if(!wrapper) return; var response=wrapper.response; var release=wrapper.release; var controller=wrapper.controller; var body=response && response.body; wrapper.release=null; wrapper.controller=null; if(release){ try { release(); } catch(_) {} } if(controller){ try { controller.abort(); } catch(_) {} } if(body && !body.locked){ try { var canceled=body.cancel(); if(canceled && canceled.catch) canceled.catch(function(){}); } catch(_) {} } })()"

abstract type response-body-subscription
  Response-body-subscription(value : any)

// Response body consumption remains tied to the AbortController created for
// Fetch. `fetch()` resolves as soon as headers arrive, so revoking only the
// body Promise callbacks would otherwise leave a streaming network request
// alive after its Kokaine generation retired.
extern response-body-subscribe(value : response, as-json : bool,
                               fulfill : a -> ui (),
                               reject : string -> ui ()) : ui any
  js inline "(function(){ var wrapper=#1; var response=wrapper.response; var release=wrapper.release; var state={ fulfill:#3, reject:#4, controller:wrapper.controller, body:response.body }; wrapper.release=null; wrapper.controller=null; function clear(){ state.controller=null; state.body=null; } function stop(){ var controller=state.controller; var body=state.body; state.fulfill=null; state.reject=null; clear(); if(controller){ try { controller.abort(); } catch(_) {} } if(body && !body.locked){ try { var canceled=body.cancel(); if(canceled && canceled.catch) canceled.catch(function(){}); } catch(_) {} } } try { if(release) release(); var pending=(#2 ? response.json() : response.text()); Promise.resolve(pending).then(function(result){ var callback=state.fulfill; state.fulfill=null; state.reject=null; clear(); if(callback) callback(result); },function(error){ var callback=state.reject; state.fulfill=null; state.reject=null; clear(); if(callback) callback(String(error && error.message != null ? error.message : error)); }); return { ok:true, state:state }; } catch(error) { stop(); return { ok:false, message:String(error && error.message != null ? error.message : error) }; } })()"

extern response-body-result-state(value : any) : response-body-subscription
  js inline "(#1).state"

// Revoke language callbacks before aborting the request. A locked body is
// canceled by AbortController; an as-yet-unlocked stream is canceled directly
// as well so custom Fetch implementations get the same retirement contract.
extern response-body-retire(value : response-body-subscription) : ui ()
  js inline "(function(){ var state=#1; if(!state) return; var controller=state.controller; var body=state.body; state.fulfill=null; state.reject=null; state.controller=null; state.body=null; if(controller){ try { controller.abort(); } catch(_) {} } if(body && !body.locked){ try { var canceled=body.cancel(); if(canceled && canceled.catch) canceled.catch(function(){}); } catch(_) {} } })()"

fun await-response-body(value : response, as-json : bool)
                       : <async,exn> a
  setup/await("response body",fn(resume)
    val installed = response-body-subscribe(
      value,as-json,
      fn(result) resume(Ok(result)),
      fn(message) resume(Error(Exception(
        "browser Response body rejected: " ++ message,ExnError)))
    )
    if !host-result-ok(installed)
    then Error(Exception("browser Response body setup failed: " ++
                         host-result-message(installed),ExnError))
    else
      val subscription = response-body-result-state(installed)
      Ok(fn() response-body-retire(subscription))
  )

pub fun response/text(value : response) : <async,exn> string
  await-response-body(value,False)

// JSON stays an `any` FFI value. A domain adapter should validate/decode it at
// its boundary instead of asserting an unchecked generic Koka type.
pub fun response/json(value : response) : <async,exn> any
  await-response-body(value,True)

pub fun response/require-ok(value : response) : <ui,exn> response
  if value.ok then value
  else
    val status = value.status
    value.discard
    throw("HTTP request failed with status " ++ status.show)
