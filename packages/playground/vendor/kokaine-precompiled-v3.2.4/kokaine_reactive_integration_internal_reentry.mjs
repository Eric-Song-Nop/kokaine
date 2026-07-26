// Koka generated module: kokaine/reactive/integration/internal/reentry, koka version: 3.2.4
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
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $kokaine_reactive_internal_lifetime from './kokaine_reactive_internal_lifetime.mjs';
import * as $kokaine_reactive_internal_scheduler from './kokaine_reactive_internal_scheduler.mjs';
import * as $kokaine_reactive_internal_handlers from './kokaine_reactive_internal_handlers.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
 
// externals
 
// type declarations
// type reentry
export function Reentry(reentry_root, reentry_checkpoint, reentry_frame) /* forall<e> (reentry-root : kokaine/reactive/internal/model/root<e>, reentry-checkpoint : maybe<kokaine/reactive/internal/model/continuation-gate>, reentry-frame : kokaine/reactive/internal/model/frame<e>) -> reentry<e> */  {
  return { reentry_root: reentry_root, reentry_checkpoint: reentry_checkpoint, reentry_frame: reentry_frame };
}
 
// declarations
 
 
// Automatically generated. Retrieves the `reentry-root` constructor field of the `:reentry` type.
export function reentry_fs_reentry_root(reentry) /* forall<e> (reentry : reentry<e>) -> kokaine/reactive/internal/model/root<e> */  {
  return reentry.reentry_root;
}
 
 
// Automatically generated. Retrieves the `reentry-checkpoint` constructor field of the `:reentry` type.
export function reentry_fs_reentry_checkpoint(reentry) /* forall<e> (reentry : reentry<e>) -> maybe<kokaine/reactive/internal/model/continuation-gate> */  {
  return reentry.reentry_checkpoint;
}
 
 
// Automatically generated. Retrieves the `reentry-frame` constructor field of the `:reentry` type.
export function reentry_fs_reentry_frame(reentry) /* forall<e> (reentry : reentry<e>) -> kokaine/reactive/internal/model/frame<e> */  {
  return reentry.reentry_frame;
}
 
export function reentry_fs__copy(_this, reentry_root, reentry_checkpoint, reentry_frame) /* forall<e> (reentry<e>, reentry-root : ? (kokaine/reactive/internal/model/root<e>), reentry-checkpoint : ? (maybe<kokaine/reactive/internal/model/continuation-gate>), reentry-frame : ? (kokaine/reactive/internal/model/frame<e>)) -> reentry<e> */  {
  if (reentry_root !== undefined) {
    var _x0 = reentry_root;
  }
  else {
    var _x0 = _this.reentry_root;
  }
  if (reentry_checkpoint !== undefined) {
    var _x1 = reentry_checkpoint;
  }
  else {
    var _x1 = _this.reentry_checkpoint;
  }
  if (reentry_frame !== undefined) {
    var _x2 = reentry_frame;
  }
  else {
    var _x2 = _this.reentry_frame;
  }
  return Reentry(_x0, _x1, _x2);
}
 
export function reentry_fs_root(value) /* forall<e> (value : reentry<e>) -> kokaine/reactive/internal/model/root<e> */  {
  return value.reentry_root;
}
 
 
// Cancellation is allowed to unwind a parked strand after its structural
// generation has retired, while ordinary host callbacks must still reject
// stale entry. This pure preflight is consumed immediately by the one-shot
// task runtime, before it invokes user or host code.
export function reentry_fs_can_run_live(value) /* forall<e> (value : reentry<e>) -> bool */  {
  var _x4 = value.reentry_root.root_disposed;
  var _x3 = _x4.value;
  if (_x3) {
    return false;
  }
  else {
    var _x6 = value.reentry_root.root_disposing;
    var _x5 = _x6.value;
    if (_x5) {
      return false;
    }
    else {
      var _x8 = value.reentry_frame.lifetime_token;
      var _x7 = _x8.value;
      if (_x7 === 1) {
        return true;
      }
      else if (_x7 === 2) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_capture_reentry_10069(root, wild__) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, wild_ : ()) -> exn reentry<e1> */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<358> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10041 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<358> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var current = value_10041.value;
   
  var value_0_10043 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<358> */ ) {
      return plane_1.plane_current;
    }, plane);
  return Reentry(root, value_0_10043.value, current);
}
 
 
// Capture is non-resumptive: it records the lifetime capability already
// established by the current exact-read continuation. The host callback may
// be invoked repeatedly while that generation remains live.
export function capture_reentry(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> exn reentry<e> */  {
   
  var x_10074 = $kokaine_reactive_internal_model.check_not_pure_plane("reactive re-entry capture");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_capture_reentry_10069(root, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<358> */ ) {
        return root_0.root_effect_plane;
      }, root);
     
    var value_10041 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<358> */ ) {
        return plane_0.plane_current_frame;
      }, plane);
     
    var current = value_10041.value;
     
    var value_0_10043 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<358> */ ) {
        return plane_1.plane_current;
      }, plane);
    return Reentry(root, value_0_10043.value, current);
  }
}
 
 
// monadic lift
export function _mlift_reentry_turn_10070(action, root, wild__) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a, root : kokaine/reactive/internal/model/root<e>, wild_ : ()) -> <kokaine/reactive/effects/signal-write,div,exn,kokaine/reactive/effects/signal-read|e> a */  {
  return $std_core_hnd.finally_prompt(function() {
       
      var _x_x1_1_10060 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<412> */ ) {
          return root_1.root_key;
        }, root);
      return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* kokaine/reactive/internal/model/root-key */ ) {
           
          var ev_10079 = $std_core_hnd._evv_at(0);
          var _x9 = $kokaine_reactive_effects.leave_batch_fs__select(ev_10079.hnd);
          return _x9(ev_10079.marker, ev_10079, key_0);
        }, _x_x1_1_10060);
    }, action());
}
 
export function reentry_turn(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a */  {
   
  var _x_x1_10058 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<412> */ ) {
      return root_0.root_key;
    }, root);
   
  var x_10082 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key /* kokaine/reactive/internal/model/root-key */ ) {
       
      var ev_10085 = $std_core_hnd._evv_at(0);
      var _x10 = $kokaine_reactive_effects.enter_batch_fs__select(ev_10085.hnd);
      return _x10(ev_10085.marker, ev_10085, key);
    }, _x_x1_10058);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_reentry_turn_10070(action, root, wild__);
    });
  }
  else {
    return $std_core_hnd.finally_prompt(function() {
         
        var _x_x1_1_10060 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<412> */ ) {
            return root_1.root_key;
          }, root);
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), function(key_0 /* kokaine/reactive/internal/model/root-key */ ) {
             
            var ev_0_10090 = $std_core_hnd._evv_at(0);
            var _x10 = $kokaine_reactive_effects.leave_batch_fs__select(ev_0_10090.hnd);
            return _x10(ev_0_10090.marker, ev_0_10090, key_0);
          }, _x_x1_1_10060);
      }, action());
  }
}
 
 
// monadic lift
export function _mlift_run_reentry_10071(action, checkpoint, current, root, wild___0) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a, checkpoint : maybe<kokaine/reactive/internal/model/continuation-gate>, current : kokaine/reactive/internal/model/frame<e>, root : kokaine/reactive/internal/model/root<e>, wild_@0 : ()) -> <exn|e> a */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<513> */ ) {
      return root_0.root_effect_plane;
    }, root);
  return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, current, function() {
      return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
          return reentry_turn(root, action);
        });
    });
}
 
 
// monadic lift
export function _mlift_run_reentry_10072(action, value, wild__) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a, value : reentry<e>, wild_ : ()) -> <exn|e> a */  {
   
  var x_10094 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_frame_registration, value.reentry_root, value.reentry_frame);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_run_reentry_10071(action, value.reentry_checkpoint, value.reentry_frame, value.reentry_root, wild___0);
    });
  }
  else {
    return _mlift_run_reentry_10071(action, value.reentry_checkpoint, value.reentry_frame, value.reentry_root, x_10094);
  }
}
 
 
// Reinstall only Kokaine's reactive handlers and captured continuation
// context. Arbitrary lexical user handlers are intentionally not fabricated.
export function run_reentry(value, action) /* forall<a,e> (value : reentry<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var x_10096 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive re-entry");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_run_reentry_10072(action, value, wild__);
    });
  }
  else {
     
    var x_0_10099 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_frame_registration, value.reentry_root, value.reentry_frame);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_run_reentry_10071(action, value.reentry_checkpoint, value.reentry_frame, value.reentry_root, wild___0);
      });
    }
    else {
       
      var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<513> */ ) {
          return root_0.root_effect_plane;
        }, value.reentry_root);
      return $kokaine_reactive_internal_lifetime.with_context(plane, value.reentry_checkpoint, value.reentry_frame, function() {
          return $kokaine_reactive_internal_handlers.dispatch_handled(value.reentry_root, function() {
              return reentry_turn(value.reentry_root, action);
            });
        });
    }
  }
}
 
 
// monadic lift
export function _mlift_run_retirement_reentry_10073(action, value, wild__) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a, value : reentry<e>, wild_ : ()) -> <exn|e> a */  {
   
  var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<595> */ ) {
      return root_0.root_effect_plane;
    }, value.reentry_root);
  return $kokaine_reactive_internal_lifetime.with_context(plane, value.reentry_checkpoint, value.reentry_frame, function() {
      return $kokaine_reactive_internal_handlers.dispatch_handled(value.reentry_root, action);
    });
}
 
 
// Retirement marks the captured frame dead before finalizers run. A parked
// async strand still has to be discontinued so its lexical `finally` clauses
// unwind, but it must not gain a fresh registration or host batch.
export function run_retirement_reentry(value, action) /* forall<a,e> (value : reentry<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var x_10104 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive retirement re-entry");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_run_retirement_reentry_10073(action, value, wild__);
    });
  }
  else {
     
    var plane = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<595> */ ) {
        return root_0.root_effect_plane;
      }, value.reentry_root);
    return $kokaine_reactive_internal_lifetime.with_context(plane, value.reentry_checkpoint, value.reentry_frame, function() {
        return $kokaine_reactive_internal_handlers.dispatch_handled(value.reentry_root, action);
      });
  }
}
 
 
// Dispatcher rejection normally needs a fresh live batch so cancellation
// finalizer writes publish atomically. If retirement already closed the frame
// or root, use the no-registration retirement path instead; trying live entry
// after the one-shot task was detached would lose the parked strand forever.
export function run_cancellation_reentry(value, action) /* forall<a,e> (value : reentry<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
  var _x11 = $std_core_hnd._open_none1(reentry_fs_can_run_live, value);
  if (_x11) {
    return run_reentry(value, action);
  }
  else {
    return run_retirement_reentry(value, action);
  }
}