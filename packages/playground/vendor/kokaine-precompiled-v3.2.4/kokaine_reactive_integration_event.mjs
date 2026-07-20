// Koka generated module: kokaine/reactive/integration/event, koka version: 3.2.4
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
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
 
// externals
 
// type declarations
 
 
// runtime tag for the effect `:host-event`
export var host_event_fs__tag;
var host_event_fs__tag = "host-event@event";
// type event-result
export const Event_finished = null; // forall<e,a> event-result<e,a>
export function Event_master(master_resume) /* forall<e,a> (master-resume : (any) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure|e> event-result<e,a>) -> event-result<e,a> */  {
  return { master_resume: master_resume };
}
// type event-state
export function Event_live(resume) /* forall<e,a> (resume : (any) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure|e> event-result<e,a>) -> event-state<e,a> */  {
  return { resume: resume };
}
export const Event_retired = null; // forall<e,a> event-state<e,a>
// type event-continuation
export function Event_continuation(continuation_state) /* forall<e,a> (continuation-state : ref<global,event-state<e,a>>) -> event-continuation<e,a> */  {
  return continuation_state;
}
// type host-event
export function _Hnd_host_event(_cfc, _ctl_await_host_event) /* forall<e,a> (int, hnd/clause0<any,host-event,e,a>) -> host-event<e,a> */  {
  return { _cfc: _cfc, _ctl_await_host_event: _ctl_await_host_event };
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
 
 
// The erased payload keeps the raw control effect monomorphic while the public
// continuation remains typed. These identity casts never cross the host ABI;
// they only package the value retained by the opaque continuation.
export function host_event_box(value) /* forall<a> (value : a) -> any */  {
  return value;
}
 
export function host_event_unbox(value) /* forall<a> (value : any) -> a */  {
  return value;
}
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:host-event` type.
export function host_event_fs__cfc(_this) /* forall<e,a> (host-event<e,a>) -> int */  {
  return _this._cfc;
}
 
 
// handler for the effect `:host-event`
export function host_event_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : host-event<e,b>, ret : (res : a) -> e b, action : () -> <host-event|e> a) -> e b */  {
  return $std_core_hnd._hhandle(host_event_fs__tag, hnd, ret, action);
}
 
 
// Automatically generated. Retrieves the `@ctl-await-host-event` constructor field of the `:host-event` type.
export function host_event_fs__ctl_await_host_event(_this) /* forall<e,a> (host-event<e,a>) -> hnd/clause0<any,host-event,e,a> */  {
  return _this._ctl_await_host_event;
}
 
 
// select `await-host-event` operation out of effect `:host-event`
export function await_host_event_fs__select(hnd) /* forall<e,a> (hnd : host-event<e,a>) -> hnd/clause0<any,host-event,e,a> */  {
  return hnd._ctl_await_host_event;
}
 
 
// Call the `ctl await-host-event` operation of the effect `:host-event`
export function await_host_event() /* () -> host-event any */  {
   
  var ev_10042 = $std_core_hnd._evv_at(0);
  return ev_10042.hnd._ctl_await_host_event(ev_10042.marker, ev_10042);
}
 
 
// Automatically generated. Tests for the `Event-finished` constructor of the `:event-result` type.
export function is_event_finished(event_result) /* forall<a,e> (event-result : event-result<e,a>) -> bool */  {
  return (event_result === null);
}
 
 
// Automatically generated. Tests for the `Event-master` constructor of the `:event-result` type.
export function is_event_master(event_result) /* forall<a,e> (event-result : event-result<e,a>) -> bool */  {
  return (event_result !== null);
}
 
 
// Automatically generated. Tests for the `Event-live` constructor of the `:event-state` type.
export function is_event_live(event_state) /* forall<a,e> (event-state : event-state<e,a>) -> bool */  {
  return (event_state !== null);
}
 
 
// Automatically generated. Tests for the `Event-retired` constructor of the `:event-state` type.
export function is_event_retired(event_state) /* forall<a,e> (event-state : event-state<e,a>) -> bool */  {
  return (event_state === null);
}
 
 
// Automatically generated. Retrieves the `continuation-state` constructor field of the `:event-continuation` type.
export function event_continuation_fs_continuation_state(_this) /* forall<e,a> (event-continuation<e,a>) -> ref<global,event-state<e,a>> */  {
  return _this;
}
 
export function event_continuation_fs__copy(_this, continuation_state) /* forall<e,a> (event-continuation<e,a>, continuation-state : ? (ref<global,event-state<e,a>>)) -> event-continuation<e,a> */  {
  if (continuation_state !== undefined) {
    var _x0 = continuation_state;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
 
// monadic lift
export function event_continuation_fs__mlift_resume_10036(_pat_2) /* forall<a,e> (event-result<e,a>) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure|e> bool */  {
  return true;
}
 
 
// Returns False after retirement. The opaque gate is checked before touching
// the raw multi-shot capability, including during nested synchronous delivery.
export function event_continuation_fs_resume(value, input) /* forall<a,e> (value : event-continuation<e,a>, input : a) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure|e> bool */  {
  var _x1 = value.value;
  if (_x1 === null) {
    return false;
  }
  else {
     
    var x_10044 = _x1.resume($std_core_hnd._open_none1(host_event_box, input));
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_pat_2_0 /* event-result<735,734> */ ) {
        return true;
      });
    }
    else {
      return true;
    }
  }
}
 
 
// monadic lift
export function _mlift_reify_event_10037(wild__) /* forall<a,e> (wild_ : ()) -> <host-event,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> event-result<e,a> */  {
  return Event_finished;
}
 
 
// monadic lift
export function _mlift_reify_event_10038(action, value_0, _y_x10020) /* forall<a,e> (action : host-callback<e,a>, value@0 : any, hnd/ev-index) -> <host-event,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> event-result<e,a> */  {
   
  var x_10048 = $std_core_hnd._mask_at(_y_x10020, false, function() {
      return action($std_core_hnd._open_none1(host_event_unbox, value_0));
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return Event_finished;
    });
  }
  else {
    return Event_finished;
  }
}
 
 
// monadic lift
export function _mlift_reify_event_10039(action, value_0) /* forall<a,e> (action : host-callback<e,a>, value@0 : any) -> <host-event,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> event-result<e,a> */  {
   
  var x_10051 = $std_core_hnd._evv_index(host_event_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10020 /* hnd/ev-index */ ) {
      return _mlift_reify_event_10038(action, value_0, _y_x10020);
    });
  }
  else {
    return _mlift_reify_event_10038(action, value_0, x_10051);
  }
}
 
export function reify_event(action) /* forall<a,e> (action : host-callback<e,a>) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure|e> event-result<e,a> */  {
  return host_event_fs__handle(_Hnd_host_event(3, function(m /* hnd/marker<<div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|873>,event-result<873,872>> */ , ___wildcard_x680__16 /* hnd/ev<host-event> */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<any,event-result<873,872>>) -> <div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|873> event-result<873,872> */ ) {
            return Event_master(function(value /* any */ ) {
              return k($std_core_hnd.Deep(value));
            });
          });
      }), function(_res /* event-result<873,872> */ ) {
      return _res;
    }, function() {
       
      var x_0_10056 = $std_core_hnd._open_at0($std_core_hnd._evv_index(host_event_fs__tag), function() {
           
          var ev_10058 = $std_core_hnd._evv_at(0);
          return ev_10058.hnd._ctl_await_host_event(ev_10058.marker, ev_10058);
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(value_0 /* any */ ) {
          return _mlift_reify_event_10039(action, value_0);
        });
      }
      else {
        return _mlift_reify_event_10039(action, x_0_10056);
      }
    });
}
 
 
// monadic lift
export function _mlift_capture_event_10040(_y_x10024) /* forall<_e,a,e1> (event-result<e1,a>) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure|e1> event-continuation<e1,a> */  {
  if (_y_x10024 !== null) {
    return { value: (Event_live(_y_x10024.master_resume)) };
  }
  else {
    return { value: Event_retired };
  }
}
 
export function capture_event(action) /* forall<a,e> (action : host-callback<e,a>) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui,pure|e> event-continuation<e,a> */  {
   
  var x_10060 = reify_event(action);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10024 /* event-result<965,964> */ ) {
      return _mlift_capture_event_10040(_y_x10024);
    });
  }
  else {
    if (x_10060 !== null) {
      return { value: (Event_live(x_10060.master_resume)) };
    }
    else {
      return { value: Event_retired };
    }
  }
}
 
 
// Gate first and drop the sole retained raw capability. The parked suffix has
// not begun `action` and contains no acquired resource/finalizer, so abandoning
// it is the correct cancellation semantics; garbage collection reclaims K.
export function event_continuation_fs_close(value) /* forall<a,e> (value : event-continuation<e,a>) -> () */  {
  return ((value).value = Event_retired);
}
 
export function event_continuation_fs_is_live(value) /* forall<a,e> (value : event-continuation<e,a>) -> bool */  {
  var _x2 = value.value;
  return (_x2 !== null);
}