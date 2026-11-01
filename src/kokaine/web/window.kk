/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Narrow browser-window adapter.

  Host callbacks only complete a one-shot async await. They never enter the
  reactive runtime or execute application policy themselves; the generation
  driver owns the disposer and resumes Koka code in a fresh managed turn.
--------------------------------------------------------------------------*/
module kokaine/web/window

import kokaine/async/effects
import kokaine/async/structured

extern import
  js file "window-inline.js"


pub type window-event
  Window-scroll
  Window-hash-change

abstract type window-event-subscription
  Window-event-subscription(value : any)


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

pub fun monitor-window-events(action : window-event -> <async,div,exn|e> ())
                             : <async,div,exn|e> ()
  while { True }
    val changed = race(
      fn() {
        await-window-event(Window-scroll)
        Window-scroll
      },
      fn() {
        await-window-event(Window-hash-change)
        Window-hash-change
      }
    )
    action(changed)

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
