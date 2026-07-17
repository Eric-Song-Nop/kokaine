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
  js inline "(function(){ var eventName=#1; var state={ complete:#2, reject:#3, listener:null }; var listener=function(){ var callback=state.complete; var fail=state.reject; state.complete=null; state.reject=null; state.listener=null; try { window.removeEventListener(eventName,listener); } catch(error) { if(fail) fail(error); return; } if(callback) callback(); }; state.listener=listener; try { window.addEventListener(eventName,listener,{ passive:eventName==='scroll' }); return { ok:true, state:state, name:eventName }; } catch(error) { state.complete=null; state.reject=null; state.listener=null; try { window.removeEventListener(eventName,listener); } catch(_) {} return { ok:false, error:error }; } })()"

extern host-result-ok(value : any) : bool
  js inline "!!(#1).ok"

extern host-result-error(value : any) : any
  js inline "(#1).error"

extern host-result-state(value : any) : window-event-subscription
  js inline "(#1)"

extern host-attempt-raw(action : () -> ui a) : ui any
  js inline "(function(){ try { return { ok:true, value:(#1)() }; } catch(error) { return { ok:false, error:error }; } })()"

extern host-result-value(value : any) : a
  js inline "(#1).value"

extern host-error-message(value : any) : string
  js inline "(function(error){ try { var message=error && error.message; return String(message == null ? error : message); } catch(formatError) { try { return String(formatError); } catch(_) { return 'unprintable host error'; } } })(#1)"

extern retire-window-event(value : window-event-subscription) : ui ()
  js inline "(function(){ var wrapper=#1; if(!wrapper) return; var state=wrapper.state; if(!state) return; var listener=state.listener; state.complete=null; state.reject=null; state.listener=null; if(listener){ try { window.removeEventListener(wrapper.name,listener); } catch(_) {} } wrapper.state=null; })()"

extern focus-selector-raw(selector : string) : ui any
  js inline "(function(){ try { var target=document.querySelector(#1); if(!target) throw new Error('DOM selector did not match: '+#1); target.focus(); return { ok:true }; } catch(error) { return { ok:false, error:error }; } })()"

extern viewport-bounds-raw(selector : string) : ui any
  js inline "(function(){ try { var target=document.querySelector(#1); if(!target) throw new Error('DOM selector did not match: '+#1); var rectangle=target.getBoundingClientRect(); return { ok:true, top:Math.round(rectangle.top), bottom:Math.round(rectangle.bottom) }; } catch(error) { return { ok:false, error:error }; } })()"

extern viewport-result-top(value : any) : int
  js inline "Number((#1).top)"

extern viewport-result-bottom(value : any) : int
  js inline "Number((#1).bottom)"

extern viewport-height-raw() : ui int
  js inline "Math.round(window.innerHeight)"

extern location-fragment-raw() : ui string
  js inline "(function(){ var raw=String(window.location.hash || ''); if(raw.charCodeAt(0)===35) raw=raw.slice(1); try { return decodeURIComponent(raw); } catch(error) { if(typeof URIError==='function' && error instanceof URIError) return raw; throw error; } })()"

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
  js inline "(function(){ try { if(globalThis.console && typeof globalThis.console.error==='function') globalThis.console.error(#1); } catch(_) {} })()"
