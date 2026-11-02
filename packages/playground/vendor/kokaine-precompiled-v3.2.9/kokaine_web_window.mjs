// Koka generated module: kokaine/web/window, koka version: 3.2.9
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
import * as $std_core_bytes from './std_core_bytes.mjs';
import * as $std_core_bslice from './std_core_bslice.mjs';
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
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
 
// externals
// JavaScript primitives for the Koka module `kokaine/web/window` (kokaine/web/window.kk).
//
// This is not an ES module. `extern import { js file "window-inline.js" }` in
// kokaine/web/window.kk makes the Koka compiler paste this file verbatim into the generated
// `kokaine_web_window.mjs` at compile time, so:
//   - it must contain only top-level function declarations (no imports,
//     exports, or top-level side effects) and runs in strict mode;
//   - every name shares the generated module's scope, hence the
//     `kokaineWindow` prefix;
//   - a missing or unreadable file fails the Koka build, never the browser.
// Each function backs exactly one `extern`; the Koka declaration keeps the
// type and the design comment, and calls it as `js inline "name(#1,...)"`.
// Unit tests: test/sidecar/*.test.mjs (`node --test`).
/** Backs `extern window-event-setup-raw`. */
function kokaineWindowEventSetupRaw(name, complete, reject) {
  var eventName = name;
  var state = { complete: complete, reject: reject, listener: null };
  var listener = function () {
    var callback = state.complete;
    var fail = state.reject;
    state.complete = null;
    state.reject = null;
    state.listener = null;
    try {
      window.removeEventListener(eventName, listener);
    } catch (error) {
      if (fail)
        fail(error);
      return;
    }
    if (callback)
      callback();
  };
  state.listener = listener;
  try {
    window.addEventListener(eventName, listener, { passive: eventName === 'scroll' });
    return { ok: true, state: state, name: eventName };
  } catch (error) {
    state.complete = null;
    state.reject = null;
    state.listener = null;
    try {
      window.removeEventListener(eventName, listener);
    } catch (_) {
    }
    return { ok: false, error: error };
  }
}
/** Backs `extern window-monitor-open-raw`. */
function kokaineWindowMonitorOpenRaw() {
  var state = { closed: false, pending: [], waiter: null, listeners: [] };
  var install = function (name) {
    var listener = function () {
      if (state.closed) {
        // An earlier removal threw. Retry; this closure is inert either way.
        kokaineWindowMonitorCloseRaw(state);
        return;
      }
      if (state.pending.indexOf(name) < 0)
        state.pending.push(name);
      var waiter = state.waiter;
      if (waiter) {
        state.waiter = null;
        waiter(state.pending.shift());
      }
    };
    state.listeners.push({ name: name, listener: listener });
    window.addEventListener(name, listener, { passive: name === 'scroll' });
  };
  try {
    install('scroll');
    install('hashchange');
    return { ok: true, state: state };
  } catch (error) {
    kokaineWindowMonitorCloseRaw(state);
    return { ok: false, error: error };
  }
}
/** Backs `extern window-monitor-wait-raw`. */
function kokaineWindowMonitorWaitRaw(state, complete) {
  if (state.closed)
    return;
  if (state.pending.length > 0)
    complete(state.pending.shift());
  else
    state.waiter = complete;
}
/** Backs `extern window-monitor-cancel-wait-raw`. */
function kokaineWindowMonitorCancelWaitRaw(state) {
  state.waiter = null;
}
/** Backs `extern window-monitor-close-raw`. Never throws; idempotent. */
function kokaineWindowMonitorCloseRaw(state) {
  state.closed = true;
  state.waiter = null;
  state.pending = [];
  state.listeners = state.listeners.filter(function (entry) {
    try {
      window.removeEventListener(entry.name, entry.listener);
      return false;
    } catch (_) {
      return true;
    }
  });
}
/** Backs `extern host-attempt-raw`. */
function kokaineWindowHostAttemptRaw(action) {
  try {
    return { ok: true, value: (action)() };
  } catch (error) {
    return { ok: false, error: error };
  }
}
/** Backs `extern host-error-message`. */
function kokaineWindowHostErrorMessage(error) {
  try {
    var message = error && error.message;
    return String(message == null ? error : message);
  } catch (formatError) {
    try {
      return String(formatError);
    } catch (_) {
      return 'unprintable host error';
    }
  }
}
/** Backs `extern retire-window-event`. */
function kokaineWindowRetireWindowEvent(value) {
  var wrapper = value;
  if (!wrapper)
    return;
  var state = wrapper.state;
  if (!state)
    return;
  var listener = state.listener;
  state.complete = null;
  state.reject = null;
  state.listener = null;
  if (listener) {
    try {
      window.removeEventListener(wrapper.name, listener);
    } catch (_) {
    }
  }
  wrapper.state = null;
}
/** Backs `extern focus-selector-raw`. */
function kokaineWindowFocusSelectorRaw(selector) {
  try {
    var target = document.querySelector(selector);
    if (!target)
      throw new Error('DOM selector did not match: ' + selector);
    target.focus();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error };
  }
}
/** Backs `extern viewport-bounds-raw`. */
function kokaineWindowViewportBoundsRaw(selector) {
  try {
    var target = document.querySelector(selector);
    if (!target)
      throw new Error('DOM selector did not match: ' + selector);
    var rectangle = target.getBoundingClientRect();
    return { ok: true, top: Math.round(rectangle.top), bottom: Math.round(rectangle.bottom) };
  } catch (error) {
    return { ok: false, error: error };
  }
}
/** Backs `extern location-fragment-raw`. */
function kokaineWindowLocationFragmentRaw() {
  var raw = String(window.location.hash || '');
  if (raw.charCodeAt(0) === 35)
    raw = raw.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch (error) {
    if (typeof URIError === 'function' && error instanceof URIError)
      return raw;
    throw error;
  }
}
/** Backs `extern log-window-error`. */
function kokaineWindowLogWindowError(message) {
  try {
    if (globalThis.console && typeof globalThis.console.error === 'function')
      globalThis.console.error(message);
  } catch (_) {
  }
}
 
// type declarations
// type window-event
export const Window_scroll = 1; // window-event
export const Window_hash_change = 2; // window-event
// type window-event-subscription
export function Window_event_subscription(value) /* (value : any) -> window-event-subscription */  {
  return value;
}
// type window-monitor
export function Window_monitor(value) /* (value : any) -> window-monitor */  {
  return value;
}
 
// declarations
 
 
// // Automatically generated. Tests for the `Window-scroll` constructor of the `:window-event` type.
export function is_window_scroll(window_event) /* (window-event : window-event) -> bool */  {
  return (window_event === 1);
}
 
 
// // Automatically generated. Tests for the `Window-hash-change` constructor of the `:window-event` type.
export function is_window_hash_change(window_event) /* (window-event : window-event) -> bool */  {
  return (window_event === 2);
}
 
 
// // Automatically generated. Retrieves the `value` constructor field of the `:window-event-subscription` type.
export function window_event_subscription_fs_value(_this) /* (window-event-subscription) -> any */  {
  return _this;
}
 
export function window_event_subscription_fs__copy(_this, value) /* (window-event-subscription, value : ? any) -> window-event-subscription */  {
  if (value !== undefined) {
    var _x0 = value;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
 
// // Automatically generated. Retrieves the `value` constructor field of the `:window-monitor` type.
export function window_monitor_fs_value(_this) /* (window-monitor) -> any */  {
  return _this;
}
 
export function window_monitor_fs__copy(_this, value) /* (window-monitor, value : ? any) -> window-monitor */  {
  if (value !== undefined) {
    var _x1 = value;
  }
  else {
    var _x1 = _this;
  }
  return _x1;
}
 
export function window_event_fs_name(value) /* (value : window-event) -> string */  {
  return (value === 1) ? "scroll" : "hashchange";
}
 
export function window_event_setup_raw(name, complete, reject) /* (name : string, complete : () -> ui (), reject : (any) -> ui ()) -> ui any */  {
  return kokaineWindowEventSetupRaw(name,complete,reject);
}
 
export function host_result_ok(value) /* (value : any) -> bool */  {
  return !!(value).ok;
}
 
export function host_result_error(value) /* (value : any) -> any */  {
  return (value).error;
}
 
export function host_result_state(value) /* (value : any) -> window-event-subscription */  {
  return (value);
}
 
export function host_attempt_raw(action) /* forall<a> (action : () -> ui a) -> ui any */  {
  return kokaineWindowHostAttemptRaw(action);
}
 
export function host_result_value(value) /* forall<a> (value : any) -> a */  {
  return (value).value;
}
 
export function host_error_message(value) /* (value : any) -> string */  {
  return kokaineWindowHostErrorMessage(value);
}
 
export function retire_window_event(value) /* (value : window-event-subscription) -> ui () */  {
  return kokaineWindowRetireWindowEvent(value);
}
 
export function window_monitor_open_raw() /* () -> ui any */  {
  return kokaineWindowMonitorOpenRaw();
}
 
export function host_result_monitor(value) /* (value : any) -> window-monitor */  {
  return (value).state;
}
 
export function window_monitor_wait_raw(monitor, complete) /* (monitor : window-monitor, complete : (string) -> ui ()) -> ui () */  {
  return kokaineWindowMonitorWaitRaw(monitor,complete);
}
 
export function window_monitor_cancel_wait_raw(monitor) /* (monitor : window-monitor) -> ui () */  {
  return kokaineWindowMonitorCancelWaitRaw(monitor);
}
 
export function window_monitor_close_raw(monitor) /* (monitor : window-monitor) -> ui () */  {
  return kokaineWindowMonitorCloseRaw(monitor);
}
 
export function focus_selector_raw(selector) /* (selector : string) -> ui any */  {
  return kokaineWindowFocusSelectorRaw(selector);
}
 
export function viewport_bounds_raw(selector) /* (selector : string) -> ui any */  {
  return kokaineWindowViewportBoundsRaw(selector);
}
 
export function viewport_result_top(value) /* (value : any) -> int */  {
  return Number((value).top);
}
 
export function viewport_result_bottom(value) /* (value : any) -> int */  {
  return Number((value).bottom);
}
 
export function viewport_height_raw() /* () -> ui int */  {
  return Math.round(window.innerHeight);
}
 
export function location_fragment_raw() /* () -> ui string */  {
  return kokaineWindowLocationFragmentRaw();
}
 
export function prefers_reduced_motion_raw() /* () -> ui bool */  {
  return !!(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
 
export function require_host_result(result, operation) /* (result : any, operation : string) -> exn () */  {
  var _x2 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x2) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10055 = $std_core_hnd._open_none1(host_result_error, result);
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_(operation, $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10055)))));
  }
}
 
 
// // monadic lift
export function _mlift_host_attempt_10083(result, wild) /* forall<a> (result : any, wild : ()) -> exn a */  {
  return $std_core_hnd._open_none1(host_result_value, result);
}
 
 
// // Native JavaScript throws do not automatically become Koka `exn`. Invoke
// // synchronous host reads behind one result box so Koka catch/finally clauses
// // remain authoritative at every public adapter boundary.
export function host_attempt(operation, action) /* forall<a> (operation : string, action : () -> ui a) -> <ui,exn> a */  {
   
  var result = $std_core_hnd._open_none1(host_attempt_raw, action);
   
  var x_10092 = require_host_result(result, operation);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return $std_core_hnd._open_none1(host_result_value, result);
    });
  }
  else {
    return $std_core_hnd._open_none1(host_result_value, result);
  }
}
 
export function await_window_event(value) /* (value : window-event) -> <async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,exn> () */  {
   
  var name = $std_core_hnd._open_none1(function(value_0 /* window-event */ ) {
      return (value_0 === 1) ? "scroll" : "hashchange";
    }, value);
  return $kokaine_async_effects.setup_fs_await($std_core_types._lp__plus__plus__rp_("window ", name), function(resume /* (error<()>) -> ui () */ ) {
       
      var installed = window_event_setup_raw(name, function() {
          return resume($std_core_types.Ok($std_core_types.Unit));
        }, function(reason /* any */ ) {
          return resume($std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser window event completion failed: ", host_error_message(reason)), $std_core_exn.ExnError)));
        });
       
      var b_10002 = host_result_ok(installed);
      if (b_10002) {
         
        var subscription = host_result_state(installed);
        return $std_core_types.Ok(function() {
          return retire_window_event(subscription);
        });
      }
      else {
        return $std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser window event setup failed: ", host_error_message(host_result_error(installed))), $std_core_exn.ExnError));
      }
    });
}
 
export function window_event_fs_from_name(name) /* (name : string) -> window-event */  {
  var _x3 = $std_core_string._lp__eq__eq__rp_(name, "hashchange");
  return (_x3) ? Window_hash_change : Window_scroll;
}
 
 
// // monadic lift
export function _mlift_monitor_window_events_10084(action, name) /* forall<e> (action : (window-event) -> <async/effects/async,div,exn|e> (), name : string) -> <async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn|e> () */  {
  return action($std_core_hnd._open_none1(function(name_0 /* string */ ) {
      var _x4 = $std_core_string._lp__eq__eq__rp_(name_0, "hashchange");
      return (_x4) ? Window_hash_change : Window_scroll;
    }, name));
}
 
 
// // monadic lift
export function _mlift_monitor_window_events_10085(action, monitor, release) /* forall<e> (action : (window-event) -> <async/effects/async,div,exn|e> (), monitor : window-monitor, release : () -> ui ()) -> <async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn|e> () */  {
  return $std_core_hnd.finally_prompt(function() {
      return $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_effects.async_host, function() {
           
          release();
          return window_monitor_close_raw(monitor);
        });
    }, $std_core.$while(function() {
        return true;
      }, function() {
         
        var x_10099 = $std_core_hnd._open2($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_effects.setup_fs_await_noexn, "window event", function(complete /* (string) -> ui () */ ) {
             
            window_monitor_wait_raw(monitor, complete);
            return function() {
              return window_monitor_cancel_wait_raw(monitor);
            };
          });
         
        function next_10100(name) /* (string) -> <async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn|955> () */  {
          return action($std_core_hnd._open_none1(function(name_0_0 /* string */ ) {
              var _x5 = $std_core_string._lp__eq__eq__rp_(name_0_0, "hashchange");
              return (_x5) ? Window_hash_change : Window_scroll;
            }, name));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(next_10100);
        }
        else {
          return next_10100(x_10099);
        }
      }));
}
 
 
// // monadic lift
export function _mlift_monitor_window_events_10086(action, opened, _c_x10015) /* forall<e> (action : (window-event) -> <async/effects/async,div,exn|e> (), opened : any, ()) -> () */  {
   
  var monitor = $std_core_hnd._open_none1(host_result_monitor, opened);
   
  var x_10103 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_effects.async_own, function() {
      return window_monitor_close_raw(monitor);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(release /* () -> ui () */ ) {
      return _mlift_monitor_window_events_10085(action, monitor, release);
    });
  }
  else {
    return _mlift_monitor_window_events_10085(action, monitor, x_10103);
  }
}
 
 
// // monadic lift
export function _mlift_monitor_window_events_10087(action, opened) /* forall<e> (action : (window-event) -> <async/effects/async,div,exn|e> (), opened : any) -> <async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn|e> () */  {
   
  var _x_x1_0_10061 = $std_core_hnd._open_none1(host_result_ok, opened);
   
  var _x5 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_0_10061);
  if (_x5) {
     
    var _x_x1_3_10065 = $std_core_hnd._open_none1(host_result_error, opened);
     
    var _x_x1_2_10063 = $std_core_types._lp__plus__plus__rp_("browser window event setup failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_3_10065));
    var x_10105 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, _x_x1_2_10063);
  }
  else {
    var x_10105 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10015 /* () */ ) {
      return _mlift_monitor_window_events_10086(action, opened, _c_x10015);
    });
  }
  else {
    return _mlift_monitor_window_events_10086(action, opened, x_10105);
  }
}
 
 
// // Follow scroll and hash changes until cancelled or `action` fails. Listeners
// // stay installed for the whole monitor and write into a mailbox, so an event
// // fired while `action` is running or between iterations is never lost. Repeats
// // of a kind that is already pending coalesce; kinds are delivered in the order
// // they first arrived. A lease closes the listeners when the owner retires.
export function monitor_window_events(action) /* forall<e> (action : (window-event) -> <async/effects/async,div,exn|e> ()) -> <async/effects/async,div,exn|e> () */  {
   
  var x_10107 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_effects.async_host, window_monitor_open_raw);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(opened /* any */ ) {
      return _mlift_monitor_window_events_10087(action, opened);
    });
  }
  else {
     
    var _x_x1_0_10061 = $std_core_hnd._open_none1(host_result_ok, x_10107);
     
    var _x5 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_0_10061);
    if (_x5) {
       
      var _x_x1_3_10065 = $std_core_hnd._open_none1(host_result_error, x_10107);
       
      var _x_x1_2_10063 = $std_core_types._lp__plus__plus__rp_("browser window event setup failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_3_10065));
      var x_0_10110 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, _x_x1_2_10063);
    }
    else {
      var x_0_10110 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10015 /* () */ ) {
        return _mlift_monitor_window_events_10086(action, x_10107, _c_x10015);
      });
    }
    else {
       
      var monitor = $std_core_hnd._open_none1(host_result_monitor, x_10107);
       
      var x_1_10113 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_effects.async_own, function() {
          return window_monitor_close_raw(monitor);
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(release /* () -> ui () */ ) {
          return _mlift_monitor_window_events_10085(action, monitor, release);
        });
      }
      else {
        return $std_core_hnd.finally_prompt(function() {
            return $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_effects.async_host, function() {
                 
                x_1_10113();
                return window_monitor_close_raw(monitor);
              });
          }, $std_core.$while(function() {
              return true;
            }, function() {
               
              var x_2_10118 = $std_core_hnd._open2($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_effects.setup_fs_await_noexn, "window event", function(complete /* (string) -> ui () */ ) {
                   
                  window_monitor_wait_raw(monitor, complete);
                  return function() {
                    return window_monitor_cancel_wait_raw(monitor);
                  };
                });
               
              var next_2_10119 = function(name /* string */ ) {
                return action($std_core_hnd._open_none1(function(name_0_0 /* string */ ) {
                    var _x5 = $std_core_string._lp__eq__eq__rp_(name_0_0, "hashchange");
                    return (_x5) ? Window_hash_change : Window_scroll;
                  }, name));
              };
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(next_2_10119);
              }
              else {
                return next_2_10119(x_2_10118);
              }
            }));
      }
    }
  }
}
 
export function focus_selector(selector) /* (selector : string) -> <exn,ui> () */  {
   
  var result_10122 = $std_core_hnd._open_none1(focus_selector_raw, selector);
  var _x5 = $std_core_hnd._open_none1(host_result_ok, result_10122);
  if (_x5) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10055 = $std_core_hnd._open_none1(host_result_error, result_10122);
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("focus", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10055)))));
  }
}
 
 
// // monadic lift
export function _mlift_viewport_bounds_10088(result, wild) /* (result : any, wild : ()) -> exn (int, int) */  {
  return $std_core_types.Tuple2($std_core_hnd._open_none1(viewport_result_top, result), $std_core_hnd._open_none1(viewport_result_bottom, result));
}
 
export function viewport_bounds(selector) /* (selector : string) -> <exn,ui> (int, int) */  {
   
  var result = $std_core_hnd._open_none1(viewport_bounds_raw, selector);
   
  var _x6 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x6) {
    var x_10124 = $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10055 = $std_core_hnd._open_none1(host_result_error, result);
    var x_10124 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("geometry query", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10055)))));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return $std_core_types.Tuple2($std_core_hnd._open_none1(viewport_result_top, result), $std_core_hnd._open_none1(viewport_result_bottom, result));
    });
  }
  else {
    return $std_core_types.Tuple2($std_core_hnd._open_none1(viewport_result_top, result), $std_core_hnd._open_none1(viewport_result_bottom, result));
  }
}
 
 
// // monadic lift
export function _mlift_viewport_height_10089(result, wild) /* (result : any, wild : ()) -> exn int */  {
  return $std_core_hnd._open_none1(host_result_value, result);
}
 
export function viewport_height() /* () -> <exn,ui> int */  {
   
  var result = $std_core_hnd._open_none1(host_attempt_raw, viewport_height_raw);
   
  var _x6 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x6) {
    var x_10131 = $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10055 = $std_core_hnd._open_none1(host_result_error, result);
    var x_10131 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("viewport height", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10055)))));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return $std_core_hnd._open_none1(host_result_value, result);
    });
  }
  else {
    return $std_core_hnd._open_none1(host_result_value, result);
  }
}
 
 
// // monadic lift
export function _mlift_location_fragment_10090(result, wild) /* (result : any, wild : ()) -> exn string */  {
  return $std_core_hnd._open_none1(host_result_value, result);
}
 
export function location_fragment() /* () -> <exn,ui> string */  {
   
  var result = $std_core_hnd._open_none1(host_attempt_raw, location_fragment_raw);
   
  var _x6 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x6) {
    var x_10138 = $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10055 = $std_core_hnd._open_none1(host_result_error, result);
    var x_10138 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("location fragment", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10055)))));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return $std_core_hnd._open_none1(host_result_value, result);
    });
  }
  else {
    return $std_core_hnd._open_none1(host_result_value, result);
  }
}
 
 
// // monadic lift
export function _mlift_prefers_reduced_motion_10091(result, wild) /* (result : any, wild : ()) -> exn bool */  {
  return $std_core_hnd._open_none1(host_result_value, result);
}
 
export function prefers_reduced_motion() /* () -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(host_attempt_raw, prefers_reduced_motion_raw);
   
  var _x6 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x6) {
    var x_10145 = $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10055 = $std_core_hnd._open_none1(host_result_error, result);
    var x_10145 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("reduced motion query", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10055)))));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild /* () */ ) {
      return $std_core_hnd._open_none1(host_result_value, result);
    });
  }
  else {
    return $std_core_hnd._open_none1(host_result_value, result);
  }
}
 
export function log_window_error(message) /* (message : string) -> ui () */  {
  return kokaineWindowLogWindowError(message);
}