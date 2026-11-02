// Koka generated module: kokaine/reactive/async/internal/host-turn, koka version: 3.2.4
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
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
 
// externals
 
// type declarations
// type host-turn-coalescer
export function Host_turn_coalescer(coalescer_post, coalescer_pending, coalescer_running, coalescer_posted) /* (coalescer-post : (() -> ui ()) -> ui bool, coalescer-pending : ref<global,list<() -> ui ()>>, coalescer-running : ref<global,list<() -> ui ()>>, coalescer-posted : ref<global,bool>) -> host-turn-coalescer */  {
  return { coalescer_post: coalescer_post, coalescer_pending: coalescer_pending, coalescer_running: coalescer_running, coalescer_posted: coalescer_posted };
}
// type host-turn-dispatcher
export function Host_turn_dispatcher(dispatch_host_turn) /* (dispatch-host-turn : (() -> ui ()) -> ui bool) -> host-turn-dispatcher */  {
  return dispatch_host_turn;
}
// type host-turn-runner
export function Host_turn_runner(run_host_turn) /* forall<e,e1> (run-host-turn : forall<a> (() -> e a) -> e1 a) -> host-turn-runner<e,e1> */  {
  return run_host_turn;
}
 
// declarations
 
 
// Automatically generated. Retrieves the `dispatch-host-turn` constructor field of the `:host-turn-dispatcher` type.
export function host_turn_dispatcher_fs_dispatch_host_turn(_this) /* (host-turn-dispatcher) -> ((() -> ui ()) -> ui bool) */  {
  return _this;
}
 
export function host_turn_dispatcher_fs__copy(_this, dispatch_host_turn) /* (host-turn-dispatcher, dispatch-host-turn : ? ((() -> ui ()) -> ui bool)) -> host-turn-dispatcher */  {
  if (dispatch_host_turn !== undefined) {
    var _x0 = dispatch_host_turn;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
export function host_turn_dispatcher_fs_dispatch(dispatcher, action) /* (dispatcher : host-turn-dispatcher, action : () -> ui ()) -> ui bool */  {
  return dispatcher(action);
}
 
 
// Automatically generated. Retrieves the `run-host-turn` constructor field of the `:host-turn-runner` type.
export function host_turn_runner_fs_run_host_turn(_this) /* forall<e,e1,a> (host-turn-runner<e,e1>) -> ((() -> e a) -> e1 a) */  {
  return _this;
}
 
 
// monadic lift
export function host_turn_runner_fs__mlift_copy_10077(_c_x10069) /* forall<a,e,e1> ((() -> e a) -> e1 a) -> (forall<a> (() -> e a) -> e1 a) */  {
  return _c_x10069;
}
 
 
// monadic lift
export function host_turn_runner_fs__mlift_copy_10078(_c_x10070) /* forall<e,e1> (forall<a> (() -> e a) -> e1 a) -> host-turn-runner<e,e1> */  {
  return _c_x10070;
}
 
export function host_turn_runner_fs__copy(_this, run_host_turn) /* forall<e,e1> (host-turn-runner<e,e1>, run-host-turn : ? (forall<a> (() -> e a) -> e1 a)) -> host-turn-runner<e,e1> */  {
   
  if (run_host_turn !== undefined) {
    var x_10079 = run_host_turn;
  }
  else {
    if ($std_core_hnd._yielding()) {
      var x_10079 = $std_core_hnd.yield_extend(function(_c_x10069 /* (() -> 213 180) -> 214 180 */ ) {
        return _c_x10069;
      });
    }
    else {
      var _x1 = _this;
      var x_10079 = _x1;
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10070 /* forall<a> (() -> 213 a) -> 214 a */ ) {
      return _c_x10070;
    });
  }
  else {
    return x_10079;
  }
}
 
export function host_turn_runner_fs_run(runner, action) /* forall<a,e,e1> (runner : host-turn-runner<e,e1>, action : () -> e a) -> e1 a */  {
  return runner(action);
}
 
export function turn_cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function turn_load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function turn_store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
 
// Automatically generated. Retrieves the `coalescer-post` constructor field of the `:host-turn-coalescer` type.
export function host_turn_coalescer_fs_coalescer_post(_this) /* (host-turn-coalescer) -> ((() -> ui ()) -> ui bool) */  {
  return _this.coalescer_post;
}
 
 
// Automatically generated. Retrieves the `coalescer-pending` constructor field of the `:host-turn-coalescer` type.
export function host_turn_coalescer_fs_coalescer_pending(_this) /* (host-turn-coalescer) -> ref<global,list<() -> ui ()>> */  {
  return _this.coalescer_pending;
}
 
 
// Automatically generated. Retrieves the `coalescer-running` constructor field of the `:host-turn-coalescer` type.
export function host_turn_coalescer_fs_coalescer_running(_this) /* (host-turn-coalescer) -> ref<global,list<() -> ui ()>> */  {
  return _this.coalescer_running;
}
 
 
// Automatically generated. Retrieves the `coalescer-posted` constructor field of the `:host-turn-coalescer` type.
export function host_turn_coalescer_fs_coalescer_posted(_this) /* (host-turn-coalescer) -> ref<global,bool> */  {
  return _this.coalescer_posted;
}
 
export function host_turn_coalescer_fs__copy(_this, coalescer_post, coalescer_pending, coalescer_running, coalescer_posted) /* (host-turn-coalescer, coalescer-post : ? ((() -> ui ()) -> ui bool), coalescer-pending : ? (ref<global,list<() -> ui ()>>), coalescer-running : ? (ref<global,list<() -> ui ()>>), coalescer-posted : ? (ref<global,bool>)) -> host-turn-coalescer */  {
  if (coalescer_post !== undefined) {
    var _x1 = coalescer_post;
  }
  else {
    var _x1 = _this.coalescer_post;
  }
  if (coalescer_pending !== undefined) {
    var _x2 = coalescer_pending;
  }
  else {
    var _x2 = _this.coalescer_pending;
  }
  if (coalescer_running !== undefined) {
    var _x3 = coalescer_running;
  }
  else {
    var _x3 = _this.coalescer_running;
  }
  if (coalescer_posted !== undefined) {
    var _x4 = coalescer_posted;
  }
  else {
    var _x4 = _this.coalescer_posted;
  }
  return Host_turn_coalescer(_x1, _x2, _x3, _x4);
}
 
 
// Wrap a raw host post (for example `queueMicrotask`) so every turn accepted
// before the next drain starts shares one host callback. Each turn still runs
// in acceptance order and in its own re-entry batch; only the host callback
// is shared. A turn accepted while a drain runs is never appended to that
// drain: it posts a fresh host callback, exactly where the uncoalesced post
// would have placed it relative to host work queued by the running turn.
export function new_host_turn_coalescer(post) /* (post : (() -> ui ()) -> ui bool) -> host-turn-coalescer */  {
  return Host_turn_coalescer(post, { value: ($std_core_types.Nil) }, { value: ($std_core_types.Nil) }, { value: false });
}
 
export function host_turn_coalescer_fs_run_running(coalescer) /* (coalescer : host-turn-coalescer) -> <div,ui> () */  { tailcall: while(1)
{
  var _x6 = coalescer.coalescer_running;
  var _x5 = _x6.value;
  if (_x5 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x7 = coalescer.coalescer_running;
    ((_x7).value = (_x5.tail));
     
    _x5.head();
    {
      // tail call
      continue tailcall;
    }
  }
}}
 
export function host_turn_coalescer_fs_drain(coalescer) /* (coalescer : host-turn-coalescer) -> ui () */  {
   
  var _x7 = coalescer.coalescer_posted;
  ((_x7).value = false);
   
  var _x8 = coalescer.coalescer_pending;
  var pending = _x8.value;
   
  var _x9 = coalescer.coalescer_pending;
  ((_x9).value = ($std_core_types.Nil));
   
  var _x10 = coalescer.coalescer_running;
  var xs_10036 = _x10.value;
   
  var ys_10037 = $std_core_list.reverse_acc($std_core_types.Nil, pending);
   
  var value_2_10034 = $std_core_list.append(xs_10036, ys_10037);
   
  var _x11 = coalescer.coalescer_running;
  ((_x11).value = value_2_10034);
  return host_turn_coalescer_fs_run_running(coalescer);
}
 
export function host_turn_coalescer_fs_post(coalescer, turn) /* (coalescer : host-turn-coalescer, turn : () -> ui ()) -> ui bool */  {
   
  var _x7 = coalescer.coalescer_pending;
  var value_10045 = $std_core_types.Cons(turn, _x7.value);
   
  var _x8 = coalescer.coalescer_pending;
  ((_x8).value = value_10045);
  var _x8 = coalescer.coalescer_posted;
  var _x7 = _x8.value;
  if (_x7) {
    return true;
  }
  else {
     
    var _x9 = coalescer.coalescer_posted;
    ((_x9).value = true);
    var _x9 = coalescer.coalescer_post(function() {
      return host_turn_coalescer_fs_drain(coalescer);
    });
    if (_x9) {
      return true;
    }
    else {
       
      var _x10 = coalescer.coalescer_posted;
      ((_x10).value = false);
       
      var _x11 = coalescer.coalescer_pending;
      ((_x11).value = ($std_core_types.Nil));
      return false;
    }
  }
}
 
export function host_turn_coalescer_fs_dispatcher(coalescer) /* (coalescer : host-turn-coalescer) -> host-turn-dispatcher */  {
  return function(turn /* () -> ui () */ ) {
    return host_turn_coalescer_fs_post(coalescer, turn);
  };
}