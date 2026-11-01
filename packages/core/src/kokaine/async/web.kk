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

extern import
  js file "web-inline.js"


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
                       reject : any -> ui ()) : ui any
  js inline "kokaineAsyncWebTimerSetupRaw(#1,#2,#3)"

extern host-result-ok(value : any) : bool
  js inline "!!(#1).ok"

extern host-result-error(value : any) : any
  js inline "(#1).error"

// JavaScript promises may reject with any value, including a Proxy or object
// whose `message` getter/string conversion throws. Formatting must never keep
// the Koka completion callback from observing that rejection.
extern host-error-message(value : any) : string
  js inline "kokaineAsyncWebHostErrorMessage(#1)"

extern host-result-state(value : any) : timer-subscription
  js inline "(#1).state"

extern timer-retire(value : timer-subscription) : ui ()
  js inline "kokaineAsyncWebTimerRetire(#1)"

// Sleep without holding a Kokaine batch open. The generation handler invokes
// this setup only after it has registered the task with the current owner.
// Suspend the current async strand for `delay` using a browser timer. Effect:
// `<async,exn>`. While suspended no Kokaine batch is held open; the rest of
// the code runs in a later turn, and only if the owning generation is still
// live. Retirement or cancellation clears the timer. Delays longer than the
// browser's 32-bit `setTimeout` limit are split into chunks.
pub fun sleep(delay : duration) : <async,exn> ()
  setup/await("sleep " ++ delay.show,fn(resume)
    val installed = timer-setup-raw(
      max(0,delay.milli-seconds),
      fn() resume(Ok(())),
      fn(reason) resume(Error(Exception(
        "browser timer failed: " ++ host-error-message(reason),ExnError)))
    )
    if !host-result-ok(installed)
    then Error(Exception("browser timer setup failed: " ++
                         host-error-message(host-result-error(installed)),
                         ExnError))
    else
      val subscription = host-result-state(installed)
      Ok(fn() timer-retire(subscription))
  )

// Suspend until a later browser task (a zero-delay `sleep`). Effect:
// `<async,exn>`.
pub fun yield() : <async,exn> ()
  sleep(0.milli-seconds)

// Run `action` with a deadline. Returns `Just(result)` if it finishes first,
// or `Nothing` once `delay` elapses, in which case `action` is canceled (its
// `finally` clauses still run before `timeout` returns). Effect:
// `<async,exn|e>`. An exception from `action` propagates.
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
// Treat a JavaScript value as a `promise<a>`. Total, but unchecked: nothing
// verifies that the promise resolves to a Koka value of type `a`.
pub extern unsafe-promise(value : any) : promise<a>
  js inline "#1"

// Expose the underlying JavaScript promise object. Total.
pub extern promise/unsafe-any(value : promise<a>) : any
  js inline "#1"

extern promise-subscribe(value : promise<a>,
                         fulfill : a -> ui (),
                         reject : any -> ui ()) : ui any
  js inline "kokaineAsyncWebPromiseSubscribe(#1,#2,#3)"

extern promise-result-state(value : any) : promise-subscription
  js inline "(#1).state"

// Drop both Koka callbacks before touching any host object. A non-cancelable
// Promise may still settle, but its JavaScript closure then sees an inert cell.
extern promise-retire(value : promise-subscription) : ui ()
  js inline "kokaineAsyncWebPromiseRetire(#1)"

// Wait for a JavaScript promise in direct style. Effect: `<async,exn>`;
// rejection becomes an `exn`. Gotcha: cancellation only drops the Koka
// continuation; the underlying promise (and whatever started it) keeps
// running.
pub fun promise/await(value : promise<a>) : <async,exn> a
  setup/await("promise",fn(resume)
    val installed = promise-subscribe(
      value,
      fn(result) resume(Ok(result)),
      fn(reason) resume(Error(Exception(
        "browser Promise rejected: " ++ host-error-message(reason),ExnError)))
    )
    if !host-result-ok(installed)
    then Error(Exception("browser Promise setup failed: " ++
                         host-error-message(host-result-error(installed)),
                         ExnError))
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

// Build a Fetch request description: `url`, HTTP `method` (default `"GET"`),
// and an optional string `body`. Total; nothing is sent until `fetch`. No
// custom headers are set, so a string body uses the browser's default
// `text/plain` content type.
pub extern request(url : string, method : string = "GET",
                   body : maybe<string> = Nothing) : request
  js inline "({ url:#1, init:{ method:#2, body:(#3 == null ? undefined : (#3).value) } })"

// Convenience constructors keep the common call sites direct and typed.
// A `GET` request for `url`. Total.
pub fun get(url : string) : request
  request(url)

// A `POST` request for `url` with a string `body` (sent as `text/plain`).
// Total.
pub fun post(url : string, body : string) : request
  request(url,"POST",Just(body))

extern fetch-subscribe(value : request,
                       fulfill : response -> ui (),
                       reject : any -> ui ()) : ui any
  js inline "kokaineAsyncWebFetchSubscribe(#1,#2,#3)"

extern fetch-result-state(value : any) : fetch-subscription
  js inline "(#1).state"

// Revoke Koka closures first; AbortController is invoked only after the task
// has become inert, so a hostile/polyfilled abort cannot re-enter it.
extern fetch-retire(value : fetch-subscription) : ui ()
  js inline "kokaineAsyncWebFetchRetire(#1)"

// Send `value` with the browser Fetch API and wait for the response headers.
// Effect: `<async,exn>`; network failure becomes an `exn`. HTTP error statuses
// do not raise; use `require-ok` or check `ok`/`status`.
//
// The returned response stays owned by the current generation: retiring the
// generation aborts the request until the body is consumed with `text`/`json`
// or released with `discard`. Gotcha: call `discard` on a response you will
// not read, so the connection is released immediately rather than at
// retirement.
pub fun fetch(value : request) : <async,exn> response
  val result = setup/await("fetch",fn(resume)
    val installed = fetch-subscribe(
      value,
      fn(result) resume(Ok(result)),
      fn(reason) resume(Error(Exception(
        "browser Fetch rejected: " ++ host-error-message(reason),ExnError)))
    )
    if !host-result-ok(installed)
    then Error(Exception("browser Fetch setup failed: " ++
                         host-error-message(host-result-error(installed)),
                         ExnError))
    else
      val subscription = fetch-result-state(installed)
      Ok(fn() fetch-retire(subscription))
  )
  // Header delivery completes the Fetch await, but the controller must remain
  // owned until the response is discarded or body consumption takes over.
  val release = async-own(fn() response-retire(result))
  async-host(fn() response-own(result,release))
  result

// The HTTP status code. Effect: `ui`.
pub extern response/status(value : response) : ui int
  js inline "Number((#1).response.status)"

// Whether the status is in the 200-299 range. Effect: `ui`.
pub extern response/ok(value : response) : ui bool
  js inline "!!(#1).response.ok"

// The final response URL after redirects (empty when unavailable). Effect:
// `ui`.
pub extern response/url(value : response) : ui string
  js inline "String((#1).response.url == null ? '' : (#1).response.url)"

extern response-own(value : response, release : dispose-fn) : ui ()
  js inline "(#1).release=#2"

// Generation retirement owns this raw disposer. It must not call the lease's
// release action because the owner registration is already being finalized.
extern response-retire(value : response) : ui ()
  js inline "kokaineAsyncWebResponseRetire(#1)"

// A response which will not be consumed explicitly releases its generation
// lease before aborting. Clear the wrapper first so hostile host objects cannot
// observe or re-enter a live ownership edge.
// Release a response that will not be read: drop its generation lease, abort
// the request, and cancel the body stream. Effect: `ui`. Safe to call more
// than once.
pub extern response/discard(value : response) : ui ()
  js inline "kokaineAsyncWebResponseDiscard(#1)"

abstract type response-body-subscription
  Response-body-subscription(value : any)

// Response body consumption remains tied to the AbortController created for
// Fetch. `fetch()` resolves as soon as headers arrive, so revoking only the
// body Promise callbacks would otherwise leave a streaming network request
// alive after its Kokaine generation retired.
extern response-body-subscribe(value : response, as-json : bool,
                               fulfill : a -> ui (),
                               reject : any -> ui ()) : ui any
  js inline "kokaineAsyncWebResponseBodySubscribe(#1,#2,#3,#4)"

extern response-body-result-state(value : any) : response-body-subscription
  js inline "(#1).state"

// Revoke language callbacks before aborting the request. A locked body is
// canceled by AbortController; an as-yet-unlocked stream is canceled directly
// as well so custom Fetch implementations get the same retirement contract.
extern response-body-retire(value : response-body-subscription) : ui ()
  js inline "kokaineAsyncWebResponseBodyRetire(#1)"

fun await-response-body(value : response, as-json : bool)
                       : <async,exn> a
  setup/await("response body",fn(resume)
    val installed = response-body-subscribe(
      value,as-json,
      fn(result) resume(Ok(result)),
      fn(reason) resume(Error(Exception(
        "browser Response body rejected: " ++ host-error-message(reason),
        ExnError)))
    )
    if !host-result-ok(installed)
    then Error(Exception("browser Response body setup failed: " ++
                         host-error-message(host-result-error(installed)),
                         ExnError))
    else
      val subscription = response-body-result-state(installed)
      Ok(fn() response-body-retire(subscription))
  )

// Read the whole body as a string. Effect: `<async,exn>`. Takes over the
// response's ownership; cancellation aborts the request. A body can be read
// only once.
pub fun response/text(value : response) : <async,exn> string
  await-response-body(value,False)

// JSON stays an `any` FFI value. A domain adapter should validate/decode it at
// its boundary instead of asserting an unchecked generic Koka type.
// Read and parse the body as JSON. Effect: `<async,exn>`. The result is an
// untyped JavaScript value (`any`); validate or decode it at your boundary. A
// body can be read only once.
pub fun response/json(value : response) : <async,exn> any
  await-response-body(value,True)

// Return the response unchanged when `ok`; otherwise discard it and raise an
// HTTP-status exception. Effect: `<ui,exn>`.
pub fun response/require-ok(value : response) : <ui,exn> response
  if value.ok then value
  else
    val status = value.status
    value.discard
    throw("HTTP request failed with status " ++ status.show)
