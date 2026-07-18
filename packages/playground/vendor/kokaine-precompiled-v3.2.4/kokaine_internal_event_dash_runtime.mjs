// Koka generated module: kokaine/internal/event-runtime, koka version: 3.2.4
"use strict";
 
// imports
import * as $std_core_types from './std_core_types.mjs';
import * as $std_core_hnd from './std_core_hnd.mjs';
import * as $std_core_exn from './std_core_exn.mjs';
import * as $std_core_bool from './std_core_bool.mjs';
import * as $std_core_order from './std_core_order.mjs';
import * as $std_core_char from './std_core_char.mjs';
import * as $std_core_int from './std_core_int.mjs';
import * as $std_core_vector from './std_core_vector.mjs';
import * as $std_core_string from './std_core_string.mjs';
import * as $std_core_sslice from './std_core_sslice.mjs';
import * as $std_core_list from './std_core_list.mjs';
import * as $std_core_maybe from './std_core_maybe.mjs';
import * as $std_core_maybe2 from './std_core_maybe2.mjs';
import * as $std_core_either from './std_core_either.mjs';
import * as $std_core_result from './std_core_result.mjs';
import * as $std_core_tuple from './std_core_tuple.mjs';
import * as $std_core_lazy from './std_core_lazy.mjs';
import * as $std_core_show from './std_core_show.mjs';
import * as $std_core_debug from './std_core_debug.mjs';
import * as $std_core_delayed from './std_core_delayed.mjs';
import * as $std_core_console from './std_core_console.mjs';
import * as $std_core from './std_core.mjs';
import * as $kokaine_html from './kokaine_html.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
 
// externals
 
// type declarations
 
 
// runtime tag for the effect `:browser-event`
export var browser_event_fs__tag;
var browser_event_fs__tag = "browser-event@event-runtime";
// type browser-event
export function _Hnd_browser_event(_cfc, _ctl_await_browser_event) /* forall<e,a> (int, hnd/clause0<kokaine/html/event,browser-event,e,a>) -> browser-event<e,a> */  {
  return { _cfc: _cfc, _ctl_await_browser_event: _ctl_await_browser_event };
}
// type event-result
export const Event_finished = null; // event-result
export function Event_master(master_resume) /* (master-resume : (kokaine/html/event) -> kokaine/html/callback-effect event-result) -> event-result */  {
  return { master_resume: master_resume };
}
// type event-state
export function Event_live(resume) /* (resume : (kokaine/html/event) -> kokaine/html/callback-effect event-result) -> event-state */  {
  return { resume: resume };
}
export const Event_retired = null; // event-state
// type event-continuation
export function Event_continuation(continuation_state) /* (continuation-state : ref<global,event-state>) -> event-continuation */  {
  return continuation_state;
}
 
// declarations
 
export function event_cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function event_load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function event_store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:browser-event` type.
export function browser_event_fs__cfc(_this) /* forall<e,a> (browser-event<e,a>) -> int */  {
  return _this._cfc;
}
 
 
// handler for the effect `:browser-event`
export function browser_event_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : browser-event<e,b>, ret : (res : a) -> e b, action : () -> <browser-event|e> a) -> e b */  {
  return $std_core_hnd._hhandle(browser_event_fs__tag, hnd, ret, action);
}
 
 
// Automatically generated. Retrieves the `@ctl-await-browser-event` constructor field of the `:browser-event` type.
export function browser_event_fs__ctl_await_browser_event(_this) /* forall<e,a> (browser-event<e,a>) -> hnd/clause0<kokaine/html/event,browser-event,e,a> */  {
  return _this._ctl_await_browser_event;
}
 
 
// select `await-browser-event` operation out of effect `:browser-event`
export function await_browser_event_fs__select(hnd) /* forall<e,a> (hnd : browser-event<e,a>) -> hnd/clause0<kokaine/html/event,browser-event,e,a> */  {
  return hnd._ctl_await_browser_event;
}
 
 
// Call the `ctl await-browser-event` operation of the effect `:browser-event`
export function await_browser_event() /* () -> browser-event kokaine/html/event */  {
   
  var ev_10038 = $std_core_hnd._evv_at(0);
  return ev_10038.hnd._ctl_await_browser_event(ev_10038.marker, ev_10038);
}
 
 
// Automatically generated. Tests for the `Event-finished` constructor of the `:event-result` type.
export function is_event_finished(event_result) /* (event-result : event-result) -> bool */  {
  return (event_result === null);
}
 
 
// Automatically generated. Tests for the `Event-master` constructor of the `:event-result` type.
export function is_event_master(event_result) /* (event-result : event-result) -> bool */  {
  return (event_result !== null);
}
 
 
// Automatically generated. Tests for the `Event-live` constructor of the `:event-state` type.
export function is_event_live(event_state) /* (event-state : event-state) -> bool */  {
  return (event_state !== null);
}
 
 
// Automatically generated. Tests for the `Event-retired` constructor of the `:event-state` type.
export function is_event_retired(event_state) /* (event-state : event-state) -> bool */  {
  return (event_state === null);
}
 
 
// Automatically generated. Retrieves the `continuation-state` constructor field of the `:event-continuation` type.
export function event_continuation_fs_continuation_state(_this) /* (event-continuation) -> ref<global,event-state> */  {
  return _this;
}
 
export function event_continuation_fs__copy(_this, continuation_state) /* (event-continuation, continuation-state : ? (ref<global,event-state>)) -> event-continuation */  {
  if (continuation_state !== undefined) {
    var _x0 = continuation_state;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
 
// monadic lift
export function event_continuation_fs__mlift_resume_10032(_pat_2) /* (event-result) -> kokaine/html/callback-effect bool */  {
  return true;
}
 
 
// Returns False after retirement. The opaque gate is checked before touching
// the raw multi-shot capability, including during nested synchronous dispatch.
export function event_continuation_fs_resume(value, input) /* (value : event-continuation, input : kokaine/html/event) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> bool */  {
  var _x1 = value.value;
  if (_x1 === null) {
    return false;
  }
  else {
     
    var x_10040 = _x1.resume(input);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(event_continuation_fs__mlift_resume_10032);
    }
    else {
      return true;
    }
  }
}
 
 
// monadic lift
export function _mlift_reify_event_10033(wild__) /* (wild_ : ()) -> <browser-event,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> event-result */  {
  return Event_finished;
}
 
 
// monadic lift
export function _mlift_reify_event_10034(action, value_0, _y_x10020) /* (action : kokaine/html/callback, value@0 : kokaine/html/event, hnd/ev-index) -> <browser-event,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> event-result */  {
   
  var x_10043 = $std_core_hnd._mask_at(_y_x10020, false, function() {
      return action(value_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_reify_event_10033);
  }
  else {
    return Event_finished;
  }
}
 
 
// monadic lift
export function _mlift_reify_event_10035(action, value_0) /* (action : kokaine/html/callback, value@0 : kokaine/html/event) -> <browser-event,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> event-result */  {
   
  var x_10045 = $std_core_hnd._evv_index(browser_event_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10020 /* hnd/ev-index */ ) {
      return _mlift_reify_event_10034(action, value_0, _y_x10020);
    });
  }
  else {
    return _mlift_reify_event_10034(action, value_0, x_10045);
  }
}
 
export function reify_event(action) /* (action : kokaine/html/callback) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> event-result */  {
  return browser_event_fs__handle(_Hnd_browser_event(3, function(m /* hnd/marker<kokaine/html/callback-effect,event-result> */ , ___wildcard_x680__16 /* hnd/ev<browser-event> */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<kokaine/html/event,event-result>) -> kokaine/html/callback-effect event-result */ ) {
            return Event_master(function(value /* kokaine/html/event */ ) {
              return k($std_core_hnd.Deep(value));
            });
          });
      }), function(_res /* event-result */ ) {
      return _res;
    }, function() {
       
      var x_0_10050 = $std_core_hnd._open_at0(4, function() {
           
          var ev_10052 = $std_core_hnd._evv_at(0);
          return ev_10052.hnd._ctl_await_browser_event(ev_10052.marker, ev_10052);
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(value_0 /* kokaine/html/event */ ) {
          return _mlift_reify_event_10035(action, value_0);
        });
      }
      else {
        return _mlift_reify_event_10035(action, x_0_10050);
      }
    });
}
 
 
// monadic lift
export function _mlift_capture_event_10036(_y_x10024) /* forall<_e> (event-result) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> event-continuation */  {
  if (_y_x10024 !== null) {
    return { value: (Event_live(_y_x10024.master_resume)) };
  }
  else {
    return { value: Event_retired };
  }
}
 
export function capture_event(action) /* (action : kokaine/html/callback) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> event-continuation */  {
   
  var x_10054 = reify_event(action);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10024 /* event-result */ ) {
      return _mlift_capture_event_10036(_y_x10024);
    });
  }
  else {
    if (x_10054 !== null) {
      return { value: (Event_live(x_10054.master_resume)) };
    }
    else {
      return { value: Event_retired };
    }
  }
}
 
 
// Gate first and drop the sole retained raw capability. The parked suffix has
// not begun `action` and contains no acquired resource/finalizer, so abandoning
// it is the correct cancellation semantics; garbage collection reclaims K.
// This also remains safe when close races with an already-active nested resume.
export function event_continuation_fs_close(value) /* (value : event-continuation) -> () */  {
  return ((value).value = Event_retired);
}
 
export function event_continuation_fs_is_live(value) /* (value : event-continuation) -> bool */  {
  var _x2 = value.value;
  return (_x2 !== null);
}