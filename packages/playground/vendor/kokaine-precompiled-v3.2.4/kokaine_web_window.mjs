// Koka generated module: kokaine/web/window, koka version: 3.2.4
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
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_async_structured from './kokaine_async_structured.mjs';
 
// externals
 
// type declarations
// type window-event
export const Window_scroll = 1; // window-event
export const Window_hash_change = 2; // window-event
// type window-event-subscription
export function Window_event_subscription(value) /* (value : any) -> window-event-subscription */  {
  return value;
}
 
// declarations
 
 
// Automatically generated. Tests for the `Window-scroll` constructor of the `:window-event` type.
export function is_window_scroll(window_event) /* (window-event : window-event) -> bool */  {
  return (window_event === 1);
}
 
 
// Automatically generated. Tests for the `Window-hash-change` constructor of the `:window-event` type.
export function is_window_hash_change(window_event) /* (window-event : window-event) -> bool */  {
  return (window_event === 2);
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:window-event-subscription` type.
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
 
export function window_event_fs_name(value) /* (value : window-event) -> string */  {
  return (value === 1) ? "scroll" : "hashchange";
}
 
export function window_event_setup_raw(name, complete, reject) /* (name : string, complete : () -> ui (), reject : (any) -> ui ()) -> ui any */  {
  return (function(){ var eventName=name; var state={ complete:complete, reject:reject, listener:null }; var listener=function(){ var callback=state.complete; var fail=state.reject; state.complete=null; state.reject=null; state.listener=null; try { window.removeEventListener(eventName,listener); } catch(error) { if(fail) fail(error); return; } if(callback) callback(); }; state.listener=listener; try { window.addEventListener(eventName,listener,{ passive:eventName==='scroll' }); return { ok:true, state:state, name:eventName }; } catch(error) { state.complete=null; state.reject=null; state.listener=null; try { window.removeEventListener(eventName,listener); } catch(_) {} return { ok:false, error:error }; } })();
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
  return (function(){ try { return { ok:true, value:(action)() }; } catch(error) { return { ok:false, error:error }; } })();
}
 
export function host_result_value(value) /* forall<a> (value : any) -> a */  {
  return (value).value;
}
 
export function host_error_message(value) /* (value : any) -> string */  {
  return (function(error){ try { var message=error && error.message; return String(message == null ? error : message); } catch(formatError) { try { return String(formatError); } catch(_) { return 'unprintable host error'; } } })(value);
}
 
export function retire_window_event(value) /* (value : window-event-subscription) -> ui () */  {
  return (function(){ var wrapper=value; if(!wrapper) return; var state=wrapper.state; if(!state) return; var listener=state.listener; state.complete=null; state.reject=null; state.listener=null; if(listener){ try { window.removeEventListener(wrapper.name,listener); } catch(_) {} } wrapper.state=null; })();
}
 
export function focus_selector_raw(selector) /* (selector : string) -> ui any */  {
  return (function(){ try { var target=document.querySelector(selector); if(!target) throw new Error('DOM selector did not match: '+selector); target.focus(); return { ok:true }; } catch(error) { return { ok:false, error:error }; } })();
}
 
export function viewport_bounds_raw(selector) /* (selector : string) -> ui any */  {
  return (function(){ try { var target=document.querySelector(selector); if(!target) throw new Error('DOM selector did not match: '+selector); var rectangle=target.getBoundingClientRect(); return { ok:true, top:Math.round(rectangle.top), bottom:Math.round(rectangle.bottom) }; } catch(error) { return { ok:false, error:error }; } })();
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
  return (function(){ var raw=String(window.location.hash || ''); if(raw.charCodeAt(0)===35) raw=raw.slice(1); try { return decodeURIComponent(raw); } catch(error) { if(typeof URIError==='function' && error instanceof URIError) return raw; throw error; } })();
}
 
export function prefers_reduced_motion_raw() /* () -> ui bool */  {
  return !!(typeof window.matchMedia==='function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
}
 
export function require_host_result(result, operation) /* (result : any, operation : string) -> exn () */  {
  var _x1 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x1) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10041 = $std_core_hnd._open_none1(host_result_error, result);
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_(operation, $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10041)))));
  }
}
 
 
// monadic lift
export function _mlift_host_attempt_10058(result, wild__) /* forall<a> (result : any, wild_ : ()) -> exn a */  {
  return $std_core_hnd._open_none1(host_result_value, result);
}
 
 
// Native JavaScript throws do not automatically become Koka `exn`. Invoke
// synchronous host reads behind one result box so Koka catch/finally clauses
// remain authoritative at every public adapter boundary.
export function host_attempt(operation, action) /* forall<a> (operation : string, action : () -> ui a) -> <ui,exn> a */  {
   
  var result = $std_core_hnd._open_none1(host_attempt_raw, action);
   
  var x_10065 = require_host_result(result, operation);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return $std_core_hnd._open_none1(host_result_value, result);
    });
  }
  else {
    return $std_core_hnd._open_none1(host_result_value, result);
  }
}
 
export function await_window_event(value) /* (value : window-event) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> () */  {
   
  var name = $std_core_hnd._open_none1(function(value_0 /* window-event */ ) {
      return (value_0 === 1) ? "scroll" : "hashchange";
    }, value);
  return $kokaine_async_effects.setup_fs_await($std_core_types._lp__plus__plus__rp_("window ", name), function(resume /* (error<()>) -> ui () */ ) {
       
      var installed = window_event_setup_raw(name, function() {
          return resume($std_core_types.Ok($std_core_types.Unit));
        }, function(reason /* any */ ) {
          return resume($std_core_types.$Error($std_core_exn.Exception($std_core_types._lp__plus__plus__rp_("browser window event completion failed: ", host_error_message(reason)), $std_core_exn.ExnError)));
        });
       
      var b_10001 = host_result_ok(installed);
      if (b_10001) {
         
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
 
 
// monadic lift
export function _mlift_monitor_window_events_10059(wild__) /* forall<e> (wild_ : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn,div|e> window-event */  {
  return Window_scroll;
}
 
 
// monadic lift
export function _mlift_monitor_window_events_10060(wild___0) /* forall<e> (wild_@0 : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn,div|e> window-event */  {
  return Window_hash_change;
}
 
export function monitor_window_events(action) /* forall<e> (action : (window-event) -> <kokaine/async/effects/async,div,exn|e> ()) -> <kokaine/async/effects/async,div,exn|e> () */  {
  return $std_core.$while(function() {
      return true;
    }, function() {
       
      var x_10070 = $kokaine_async_structured.race(function() {
           
          var x_0_10072 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), await_window_event, Window_scroll);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
              return Window_scroll;
            });
          }
          else {
            return Window_scroll;
          }
        }, function() {
           
          var x_1_10075 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), await_window_event, Window_hash_change);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___0_0 /* () */ ) {
              return Window_hash_change;
            });
          }
          else {
            return Window_hash_change;
          }
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(action);
      }
      else {
        return action(x_10070);
      }
    });
}
 
export function focus_selector(selector) /* (selector : string) -> <exn,ui> () */  {
   
  var result_10078 = $std_core_hnd._open_none1(focus_selector_raw, selector);
  var _x2 = $std_core_hnd._open_none1(host_result_ok, result_10078);
  if (_x2) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10041 = $std_core_hnd._open_none1(host_result_error, result_10078);
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("focus", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10041)))));
  }
}
 
 
// monadic lift
export function _mlift_viewport_bounds_10061(result, wild__) /* (result : any, wild_ : ()) -> exn (int, int) */  {
  return $std_core_types.Tuple2($std_core_hnd._open_none1(viewport_result_top, result), $std_core_hnd._open_none1(viewport_result_bottom, result));
}
 
export function viewport_bounds(selector) /* (selector : string) -> <exn,ui> (int, int) */  {
   
  var result = $std_core_hnd._open_none1(viewport_bounds_raw, selector);
   
  var _x3 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x3) {
    var x_10080 = $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10041 = $std_core_hnd._open_none1(host_result_error, result);
    var x_10080 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("geometry query", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10041)))));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return $std_core_types.Tuple2($std_core_hnd._open_none1(viewport_result_top, result), $std_core_hnd._open_none1(viewport_result_bottom, result));
    });
  }
  else {
    return $std_core_types.Tuple2($std_core_hnd._open_none1(viewport_result_top, result), $std_core_hnd._open_none1(viewport_result_bottom, result));
  }
}
 
 
// monadic lift
export function _mlift_viewport_height_10062(result, wild__) /* (result : any, wild_ : ()) -> exn int */  {
  return $std_core_hnd._open_none1(host_result_value, result);
}
 
export function viewport_height() /* () -> <exn,ui> int */  {
   
  var result = $std_core_hnd._open_none1(host_attempt_raw, viewport_height_raw);
   
  var _x3 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x3) {
    var x_10087 = $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10041 = $std_core_hnd._open_none1(host_result_error, result);
    var x_10087 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("viewport height", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10041)))));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return $std_core_hnd._open_none1(host_result_value, result);
    });
  }
  else {
    return $std_core_hnd._open_none1(host_result_value, result);
  }
}
 
 
// monadic lift
export function _mlift_location_fragment_10063(result, wild__) /* (result : any, wild_ : ()) -> exn string */  {
  return $std_core_hnd._open_none1(host_result_value, result);
}
 
export function location_fragment() /* () -> <exn,ui> string */  {
   
  var result = $std_core_hnd._open_none1(host_attempt_raw, location_fragment_raw);
   
  var _x3 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x3) {
    var x_10094 = $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10041 = $std_core_hnd._open_none1(host_result_error, result);
    var x_10094 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("location fragment", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10041)))));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return $std_core_hnd._open_none1(host_result_value, result);
    });
  }
  else {
    return $std_core_hnd._open_none1(host_result_value, result);
  }
}
 
 
// monadic lift
export function _mlift_prefers_reduced_motion_10064(result, wild__) /* (result : any, wild_ : ()) -> exn bool */  {
  return $std_core_hnd._open_none1(host_result_value, result);
}
 
export function prefers_reduced_motion() /* () -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(host_attempt_raw, prefers_reduced_motion_raw);
   
  var _x3 = $std_core_hnd._open_none1(host_result_ok, result);
  if (_x3) {
    var x_10101 = $std_core_types.Unit;
  }
  else {
     
    var _x_x1_0_10041 = $std_core_hnd._open_none1(host_result_error, result);
    var x_10101 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser window ", $std_core_types._lp__plus__plus__rp_("reduced motion query", $std_core_types._lp__plus__plus__rp_(" failed: ", $std_core_hnd._open_none1(host_error_message, _x_x1_0_10041)))));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return $std_core_hnd._open_none1(host_result_value, result);
    });
  }
  else {
    return $std_core_hnd._open_none1(host_result_value, result);
  }
}
 
export function log_window_error(message) /* (message : string) -> ui () */  {
  return (function(){ try { if(globalThis.console && typeof globalThis.console.error==='function') globalThis.console.error(message); } catch(_) {} })();
}