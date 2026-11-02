/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Narrow browser-window adapter.

  Host callbacks only complete a one-shot async await. They never enter the
  reactive runtime or execute application policy themselves; the generation
  driver owns the disposer and resumes Koka code in a fresh managed turn.
--------------------------------------------------------------------------*/
module kokaine/web/window

import kokaine/async/effects

extern import
  js file "window-inline.js"


pub type window-event
  Window-scroll
  Window-hash-change

abstract type window-event-subscription
  Window-event-subscription(value : any)

abstract type window-monitor
  Window-monitor(value : any)


fun window-event/name(value : window-event) : string
  match value
    Window-scroll -> "scroll"
    Window-hash-change -> "hashchange"

extern window-event-setup-raw(name : string,
                              complete : () -> ui (),
                              reject : any -> ui ()) : ui any
  js inline "kokaineWindowEventSetupRaw(#1,#2,#3)"

extern host-result-ok(value : any) : bool
  js inline "!!(#1).ok"

extern host-result-error(value : any) : any
  js inline "(#1).error"

extern host-result-state(value : any) : window-event-subscription
  js inline "(#1)"

extern host-attempt-raw(action : () -> ui a) : ui any
  js inline "kokaineWindowHostAttemptRaw(#1)"

extern host-result-value(value : any) : a
  js inline "(#1).value"

extern host-error-message(value : any) : string
  js inline "kokaineWindowHostErrorMessage(#1)"

extern retire-window-event(value : window-event-subscription) : ui ()
  js inline "kokaineWindowRetireWindowEvent(#1)"

extern window-monitor-open-raw() : ui any
  js inline "kokaineWindowMonitorOpenRaw()"

extern host-result-monitor(value : any) : window-monitor
  js inline "(#1).state"

extern window-monitor-wait-raw(monitor : window-monitor,
                               complete : string -> ui ()) : ui ()
  js inline "kokaineWindowMonitorWaitRaw(#1,#2)"

extern window-monitor-cancel-wait-raw(monitor : window-monitor) : ui ()
  js inline "kokaineWindowMonitorCancelWaitRaw(#1)"

extern window-monitor-close-raw(monitor : window-monitor) : ui ()
  js inline "kokaineWindowMonitorCloseRaw(#1)"

extern focus-selector-raw(selector : string) : ui any
  js inline "kokaineWindowFocusSelectorRaw(#1)"

extern viewport-bounds-raw(selector : string) : ui any
  js inline "kokaineWindowViewportBoundsRaw(#1)"

extern viewport-result-top(value : any) : int
  js inline "Number((#1).top)"

extern viewport-result-bottom(value : any) : int
  js inline "Number((#1).bottom)"

extern viewport-height-raw() : ui int
  js inline "Math.round(window.innerHeight)"

extern location-fragment-raw() : ui string
  js inline "kokaineWindowLocationFragmentRaw()"

extern prefers-reduced-motion-raw() : ui bool
  js inline "!!(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)"


fun require-host-result(result : any, operation : string) : exn ()
  if host-result-ok(result)
  then ()
  else throw("browser window " ++ operation ++ " failed: " ++
             host-error-message(host-result-error(result)))

// Native JavaScript throws do not automatically become Koka `exn`. Invoke
// synchronous host reads behind one result box so Koka catch/finally clauses
// remain authoritative at every public adapter boundary.
fun host-attempt(operation : string, action : () -> ui a) : <ui,exn> a
  val result = host-attempt-raw(action)
  require-host-result(result,operation)
  host-result-value(result)

pub fun await-window-event(value : window-event) : <async,exn> ()
  val name = value.name
  setup/await("window " ++ name,fn(resume)
    val installed = window-event-setup-raw(
      name,
      fn() resume(Ok(())),
      fn(reason) resume(Error(Exception(
        "browser window event completion failed: " ++
        host-error-message(reason),ExnError)))
    )
    if !host-result-ok(installed)
    then Error(Exception("browser window event setup failed: " ++
                         host-error-message(host-result-error(installed)),
                         ExnError))
    else
      val subscription = host-result-state(installed)
      Ok(fn() retire-window-event(subscription))
  )

fun window-event/from-name(name : string) : window-event
  if name == "hashchange" then Window-hash-change else Window-scroll

// Follow scroll and hash changes until cancelled or `action` fails. Listeners
// stay installed for the whole monitor and write into a mailbox, so an event
// fired while `action` is running or between iterations is never lost. Repeats
// of a kind that is already pending coalesce; kinds are delivered in the order
// they first arrived. A lease closes the listeners when the owner retires.
pub fun monitor-window-events(action : window-event -> <async,div,exn|e> ())
                             : <async,div,exn|e> ()
  val opened = async-host(fn() window-monitor-open-raw())
  if !host-result-ok(opened) then
    throw("browser window event setup failed: " ++
          host-error-message(host-result-error(opened)))
  val monitor = host-result-monitor(opened)
  val release = async-own(fn() window-monitor-close-raw(monitor))
  // `release` only gives up the lease; it does not run the disposer.
  val close = fn()
    release()
    window-monitor-close-raw(monitor)
  finally(fn() async-host(close),fn()
    while { True }
      val name = setup/await-noexn("window event",fn(complete)
        window-monitor-wait-raw(monitor,complete)
        fn() window-monitor-cancel-wait-raw(monitor)
      )
      action(name.from-name)
  )

pub fun focus-selector(selector : string) : <ui,exn> ()
  require-host-result(focus-selector-raw(selector),"focus")

pub fun viewport-bounds(selector : string) : <ui,exn> (int,int)
  val result = viewport-bounds-raw(selector)
  require-host-result(result,"geometry query")
  (viewport-result-top(result),viewport-result-bottom(result))

pub fun viewport-height() : <ui,exn> int
  host-attempt("viewport height",fn() viewport-height-raw())

pub fun location-fragment() : <ui,exn> string
  host-attempt("location fragment",fn() location-fragment-raw())

pub fun prefers-reduced-motion() : <ui,exn> bool
  host-attempt("reduced motion query",fn() prefers-reduced-motion-raw())

pub extern log-window-error(message : string) : ui ()
  js inline "kokaineWindowLogWindowError(#1)"
