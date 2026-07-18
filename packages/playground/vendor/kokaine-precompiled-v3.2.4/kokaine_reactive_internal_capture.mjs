// Koka generated module: kokaine/reactive/internal/capture, koka version: 3.2.4
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
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
 
// externals
 
// type declarations
 
// declarations
 
 
// monadic lift
export function _mlift_reify_trace_10191(_pat_1_4) /* forall<e> (kokaine/reactive/internal/model/built-trace<e>) -> <div,exn|e> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_reify_trace_10192(child, current, nested) /* forall<_e,e1> (child : ref<global,kokaine/reactive/internal/model/trace<e1>>, current : kokaine/reactive/internal/model/trace<e1>, nested : kokaine/reactive/internal/model/built-trace<e1>) -> <div,exn|e1> kokaine/reactive/internal/model/built-trace<e1> */  {
   
  var value_9_10094 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/built-trace<1214> */ ) {
      return _this.built_root;
    }, nested);
   
  ((child).value = value_9_10094);
  return $kokaine_reactive_internal_model.Built_trace(current, $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/built-trace<1214> */ ) {
        return _this_0.built_publish;
      }, nested));
}
 
 
// monadic lift
export function _mlift_reify_trace_10193(child, current, current_frame, plane, rcontext, source, wild___1) /* forall<_e,_e1,a,e2> (child : ref<global,kokaine/reactive/internal/model/trace<e2>>, current : kokaine/reactive/internal/model/trace<e2>, current-frame : kokaine/reactive/internal/model/frame<e2>, plane : kokaine/reactive/internal/model/plane<e2>, rcontext : hnd/resume-context<a,<div,exn|e2>,<kokaine/reactive/effects/signal-read,div,exn|e2>,kokaine/reactive/internal/model/built-trace<e2>>, source : kokaine/reactive/internal/model/source<a>, wild_@1 : ()) -> <exn,div|e2> kokaine/reactive/internal/model/built-trace<e2> */  {
   
  var x_10207 = $kokaine_reactive_internal_lifetime.with_entry(plane, $std_core_types.Just(current), function() {
      return $kokaine_reactive_internal_lifetime.with_current(plane, current, current_frame, function() {
           
          var value_8_10091 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<1083> */ ) {
              return source_3.source_cell;
            }, source);
           
          var x_0_10210 = value_8_10091.value;
          return rcontext($std_core_hnd.Deep(x_0_10210));
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(nested /* kokaine/reactive/internal/model/built-trace<1214> */ ) {
      return _mlift_reify_trace_10192(child, current, nested);
    });
  }
  else {
    return _mlift_reify_trace_10192(child, current, x_10207);
  }
}
 
 
// monadic lift
export function _mlift_reify_trace_10194(_pat_6_0) /* forall<e> (kokaine/reactive/internal/model/built-trace<e>) -> <div,exn|e> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_reify_trace_10195(child_0, current_0, nested_0) /* forall<_e,e1> (child@0 : ref<global,kokaine/reactive/internal/model/trace<e1>>, current@0 : kokaine/reactive/internal/model/trace<e1>, nested@0 : kokaine/reactive/internal/model/built-trace<e1>) -> <div,exn|e1> kokaine/reactive/internal/model/built-trace<e1> */  {
   
  var value_24_10121 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/built-trace<1214> */ ) {
      return _this_1.built_root;
    }, nested_0);
   
  ((child_0).value = value_24_10121);
  return $kokaine_reactive_internal_model.Built_trace(current_0, $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/built-trace<1214> */ ) {
        return _this_2.built_publish;
      }, nested_0));
}
 
 
// monadic lift
export function _mlift_reify_trace_10196(child_0, current_frame_0, current_0, entry, plane, rcontext, registration, source, registered) /* forall<_e,_e1,a,e2> (child@0 : ref<global,kokaine/reactive/internal/model/trace<e2>>, current-frame@0 : kokaine/reactive/internal/model/frame<e2>, current@0 : kokaine/reactive/internal/model/trace<e2>, entry : maybe<kokaine/reactive/internal/model/trace<e2>>, plane : kokaine/reactive/internal/model/plane<e2>, rcontext : hnd/resume-context<a,<div,exn|e2>,<kokaine/reactive/effects/signal-read,div,exn|e2>,kokaine/reactive/internal/model/built-trace<e2>>, registration : ref<global,maybe<kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture>>>, source : kokaine/reactive/internal/model/source<a>, registered : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture>) -> <exn,div|e2> kokaine/reactive/internal/model/built-trace<e2> */  {
   
  ((registration).value = ($std_core_types.Just(registered)));
   
  var x_10211 = $kokaine_reactive_internal_lifetime.with_entry(plane, entry, function() {
      return $kokaine_reactive_internal_lifetime.with_current(plane, current_0, current_frame_0, function() {
           
          var value_23_10118 = $std_core_hnd._open_none1(function(source_8 /* kokaine/reactive/internal/model/source<1083> */ ) {
              return source_8.source_cell;
            }, source);
           
          var x_0_10214 = value_23_10118.value;
          return rcontext($std_core_hnd.Deep(x_0_10214));
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(nested_0 /* kokaine/reactive/internal/model/built-trace<1214> */ ) {
      return _mlift_reify_trace_10195(child_0, current_0, nested_0);
    });
  }
  else {
    return _mlift_reify_trace_10195(child_0, current_0, x_10211);
  }
}
 
 
// monadic lift
export function _mlift_reify_trace_10197(child_0, current_frame_0, current_0, entry, plane, rcontext, registration, source, wild___4) /* forall<_e,_e1,a,e2> (child@0 : ref<global,kokaine/reactive/internal/model/trace<e2>>, current-frame@0 : kokaine/reactive/internal/model/frame<e2>, current@0 : kokaine/reactive/internal/model/trace<e2>, entry : maybe<kokaine/reactive/internal/model/trace<e2>>, plane : kokaine/reactive/internal/model/plane<e2>, rcontext : hnd/resume-context<a,<div,exn|e2>,<kokaine/reactive/effects/signal-read,div,exn|e2>,kokaine/reactive/internal/model/built-trace<e2>>, registration : ref<global,maybe<kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture>>>, source : kokaine/reactive/internal/model/source<a>, wild_@4 : ()) -> <exn,div|e2> kokaine/reactive/internal/model/built-trace<e2> */  {
   
  var _x_x1_17_10177 = $std_core_hnd._open_none1(function(source_7 /* kokaine/reactive/internal/model/source<1083> */ ) {
      return source_7.source_captures;
    }, source);
   
  var _x0 = (entry === null) ? current_0 : entry.value;
  var _x_x2_4_10178 = $std_core_hnd._open_none3(function(plane_5 /* kokaine/reactive/internal/model/plane<1214> */ , target_3 /* kokaine/reactive/internal/model/trace<1214> */ , owner /* kokaine/reactive/internal/model/trace<1214> */ ) {
      return function(consume /* forall<e> (kokaine/reactive/internal/model/plane<e>, kokaine/reactive/internal/model/trace<e>, kokaine/reactive/internal/model/trace<e>) -> 504 */ ) {
        return consume(plane_5, target_3, owner);
      };
    }, plane, _x0, current_0);
   
  var x_10215 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_2 /* kokaine/internal/registry/registry<kokaine/reactive/internal/model/packed-capture> */ , value_21 /* kokaine/reactive/internal/model/packed-capture */ ) {
      var _x1 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_2, value_21);
      if (_x1 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x1.value;
      }
    }, _x_x1_17_10177, _x_x2_4_10178);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registered /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture> */ ) {
      return _mlift_reify_trace_10196(child_0, current_frame_0, current_0, entry, plane, rcontext, registration, source, registered);
    });
  }
  else {
    return _mlift_reify_trace_10196(child_0, current_frame_0, current_0, entry, plane, rcontext, registration, source, x_10215);
  }
}
 
 
// monadic lift
export function _mlift_reify_trace_10198(mode, owner_slot, plane, producer, rcontext, source, wild__) /* forall<_e,_e1,_e2,a,e3> (mode : kokaine/reactive/internal/model/read-mode, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, plane : kokaine/reactive/internal/model/plane<e3>, producer : maybe<kokaine/reactive/internal/model/derive-producer>, rcontext : hnd/resume-context<a,<div,exn|e3>,<kokaine/reactive/effects/signal-read,div,exn|e3>,kokaine/reactive/internal/model/built-trace<e3>>, source : kokaine/reactive/internal/model/source<a>, wild_ : ()) -> <exn,div|e3> kokaine/reactive/internal/model/built-trace<e3> */  {
  if (mode === 2) {
     
    var value_10075 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<1083> */ ) {
        return source_1.source_cell;
      }, source);
     
    var x_10218 = value_10075.value;
    return rcontext($std_core_hnd.Deep(x_10218));
  }
  else if (mode === 3) {
     
    var state = { value: ($kokaine_reactive_internal_model.Capture_draft) };
     
    var value_1_10078 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<1214> */ ) {
        return plane_0.plane_current;
      }, plane);
     
    var gate = $kokaine_reactive_internal_model.Continuation_gate(state, value_1_10078.value, $std_core_types.Nothing);
     
    var child = { value: ($kokaine_reactive_internal_model.Trace_end) };
     
    var _x_x2_0_10158 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<1214> */ ) {
        return plane_1.plane_retirement;
      }, plane);
     
    var current_frame = $std_core_hnd._open_none2($kokaine_reactive_internal_lifetime.new_lifetime_owner, $kokaine_reactive_internal_model.Scope_starting, _x_x2_0_10158);
     
    var current_frame_slot = { value: current_frame };
     
    var self = { value: ($kokaine_reactive_internal_model.Trace_end) };
     
    var current = $kokaine_reactive_internal_model.Trace_entry(gate, owner_slot, child, current_frame_slot, function(___wildcard_x63__20 /* kokaine/reactive/internal/model/frame<1214> */ ) {
        return $kokaine_reactive_internal_lifetime.with_entry(plane, $std_core_types.Just(self.value), function() {
             
            var value_6_10086 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<1083> */ ) {
                return source_2.source_cell;
              }, source);
             
            var x_0_10220 = value_6_10086.value;
            return rcontext($std_core_hnd.Deep(x_0_10220));
          });
      }, function() {
         
        var x_1_10221 = rcontext($std_core_hnd.Finalize($kokaine_reactive_internal_model.Built_trace($kokaine_reactive_internal_model.Trace_end, function() {
            return $std_core_types.Ok($std_core_types.Unit);
          })));
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_pat_1_4 /* kokaine/reactive/internal/model/built-trace<1214> */ ) {
            return $std_core_types.Unit;
          });
        }
        else {
          return $std_core_types.Unit;
        }
      });
     
    ((self).value = current);
     
    var x_3_10227 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_lifetime.record_draft, plane, current);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
        return _mlift_reify_trace_10193(child, current, current_frame, plane, rcontext, source, wild___1);
      });
    }
    else {
      return _mlift_reify_trace_10193(child, current, current_frame, plane, rcontext, source, x_3_10227);
    }
  }
  else {
     
    var value_10_10097 = $std_core_hnd._open_none1(function(source_4 /* kokaine/reactive/internal/model/source<1083> */ ) {
        return source_4.source_version;
      }, source);
     
    var version = value_10_10097.value;
     
    var value_11_10099 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<1214> */ ) {
        return plane_2.plane_current_entry;
      }, plane);
     
    var entry = value_11_10099.value;
     
    var state_0 = { value: ($kokaine_reactive_internal_model.Capture_draft) };
     
    var value_13_10102 = $std_core_hnd._open_none1(function(plane_3 /* kokaine/reactive/internal/model/plane<1214> */ ) {
        return plane_3.plane_current;
      }, plane);
     
    var gate_0 = $kokaine_reactive_internal_model.Continuation_gate(state_0, value_13_10102.value, producer);
     
    var child_0 = { value: ($kokaine_reactive_internal_model.Trace_end) };
     
    var _x_x2_2_10170 = $std_core_hnd._open_none1(function(plane_4 /* kokaine/reactive/internal/model/plane<1214> */ ) {
        return plane_4.plane_retirement;
      }, plane);
     
    var current_frame_0 = $std_core_hnd._open_none2($kokaine_reactive_internal_lifetime.new_lifetime_owner, $kokaine_reactive_internal_model.Scope_starting, _x_x2_2_10170);
     
    var current_frame_slot_0 = { value: current_frame_0 };
     
    var registration = { value: ($std_core_types.Nothing) };
     
    var current_0 = $kokaine_reactive_internal_model.Trace_read(gate_0, owner_slot, entry, child_0, current_frame_slot_0, function(___wildcard_x105__20 /* kokaine/reactive/internal/model/frame<1214> */ ) {
        return $kokaine_reactive_internal_lifetime.with_entry(plane, entry, function() {
             
            var value_17_10109 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<1083> */ ) {
                return source_5.source_cell;
              }, source);
             
            var x_4_10230 = value_17_10109.value;
            return rcontext($std_core_hnd.Deep(x_4_10230));
          });
      }, function() {
         
        var x_5_10231 = rcontext($std_core_hnd.Finalize($kokaine_reactive_internal_model.Built_trace($kokaine_reactive_internal_model.Trace_end, function() {
            return $std_core_types.Ok($std_core_types.Unit);
          })));
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_pat_6_0 /* kokaine/reactive/internal/model/built-trace<1214> */ ) {
            return $std_core_types.Unit;
          });
        }
        else {
          return $std_core_types.Unit;
        }
      }, function() {
        var _x0 = registration.value;
        if (_x0 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((registration).value = ($std_core_types.Nothing));
           
          var _pat_5_5 = $kokaine_internal_registry.registry_registration_fs_take(_x0.value);
          return $std_core_types.Unit;
        }
      }, function() {
        var _x1 = source.source_version;
        return $std_core_types._int_ne((_x1.value),version);
      });
     
    var x_7_10237 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_lifetime.record_draft, plane, current_0);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___4 /* () */ ) {
        return _mlift_reify_trace_10197(child_0, current_frame_0, current_0, entry, plane, rcontext, registration, source, wild___4);
      });
    }
    else {
      return _mlift_reify_trace_10197(child_0, current_frame_0, current_0, entry, plane, rcontext, registration, source, x_7_10237);
    }
  }
}
 
export function reify_trace(root, plane, owner_slot, track, publish) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e1>, plane : kokaine/reactive/internal/model/plane<e>, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, publish : (value : a) -> <div,exn|e> ()) -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e> */  {
  return $kokaine_reactive_effects.signal_read_fs__handle($kokaine_reactive_effects._Hnd_signal_read(3, function(m /* hnd/marker<<div,exn|1214>,kokaine/reactive/internal/model/built-trace<1214>> */ , ___wildcard_x598__16 /* hnd/ev<kokaine/reactive/effects/signal-read> */ , x /* (kokaine/reactive/internal/model/source<_156>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<_156,kokaine/reactive/internal/model/built-trace<1214>>) -> <div,exn|1214> kokaine/reactive/internal/model/built-trace<1214> */ ) {
             
            var _x_x2_10153 = $std_core_hnd._open_none1(function(source_0 /* kokaine/reactive/internal/model/source<1083> */ ) {
                return source_0.source_root;
              }, x.fst);
             
            var x_0_10240 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10153);
             
            function next_10241(wild__) /* (()) -> <exn,div|1214> kokaine/reactive/internal/model/built-trace<1214> */  {
              return _mlift_reify_trace_10198(x.snd, owner_slot, plane, x.thd, k, x.fst, wild__);
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_10241);
            }
            else {
              return next_10241(x_0_10240);
            }
          });
      }, $std_core_hnd.clause_tail1(function(producer_0 /* kokaine/reactive/internal/model/derive-producer */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.settle_producer, producer_0);
      })), function(value_25 /* 1213 */ ) {
       
      var value_26_10125 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<1214> */ ) {
          return plane_6.plane_current_frame;
        }, plane);
       
      var terminal = value_26_10125.value;
       
      var value_27_10127 = $std_core_hnd._open_none1(function(plane_7 /* kokaine/reactive/internal/model/plane<1214> */ ) {
          return plane_7.plane_current;
        }, plane);
       
      var checkpoint = value_27_10127.value;
      return $kokaine_reactive_internal_model.Built_trace($kokaine_reactive_internal_model.Trace_end, function() {
          return $kokaine_internal_compat.capture_error(function() {
            return $kokaine_reactive_internal_lifetime.with_entry(plane, $std_core_types.Nothing, function() {
                return $kokaine_reactive_internal_lifetime.with_context(plane, checkpoint, terminal, function() {
                    return publish(value_25);
                  });
              });
          });
        });
    }, function() {
      return $std_core_hnd._open0($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), $std_core_types.Nil))), track);
    });
}
 
 
// monadic lift
export function _mlift_prepare_trace_10199(_pat_2_1) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_prepare_trace_10200(failure, _pat_6_0) /* forall<e> (failure : exception, error<()>) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure);
}
 
 
// monadic lift
export function _mlift_prepare_trace_10201(failure_0, _pat_11) /* forall<e> (failure@0 : exception, error<()>) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure_0);
}
 
 
// monadic lift
export function _mlift_prepare_trace_10202(_pat_16_0) /* forall<e> (error<()>) -> e result<(),exception> */  {
  return $std_core_types.Ok($std_core_types.Unit);
}
 
 
// monadic lift
export function _mlift_prepare_trace_10203(body, built, current, drafts, lifetime, plane, publication) /* forall<_e,_e1,e2> (body : ref<global,kokaine/reactive/internal/model/trace<e2>>, built : kokaine/reactive/internal/model/built-trace<e2>, current : kokaine/reactive/internal/model/continuation-scope<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, lifetime : kokaine/reactive/internal/model/lifetime-owner<e2>, plane : kokaine/reactive/internal/model/plane<e2>, publication : error<()>) -> e2 result<(),exception> */  {
  if (publication._tag === 1) {
     
    var x_10242 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, drafts.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_pat_11 /* error<()> */ ) {
        return $std_core_types.$Error(publication.error);
      });
    }
    else {
      return $std_core_types.$Error(publication.error);
    }
  }
  else {
    var _x1 = lifetime.lifetime_token;
    var _x0 = _x1.value;
    if (_x0 === 1) {
       
      var _x2 = built.built_root;
      ((body).value = _x2);
       
      var _x3 = built.built_root;
      $kokaine_reactive_internal_scheduler.activate_trace_loop(plane, _x3);
       
      var _x4 = lifetime.lifetime_token;
      ((_x4).value = ($kokaine_reactive_internal_model.Scope_live));
      return $std_core_types.Ok($std_core_types.Unit);
    }
    else {
       
      var x_0_10246 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, drafts.value);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_pat_16_0 /* error<()> */ ) {
          return $std_core_types.Ok($std_core_types.Unit);
        });
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_prepare_trace_10204(completed, _c_x10066) /* forall<_e> (completed : ref<global,bool>, result<(),exception>) -> result<(),exception> */  {
   
  ((completed).value = true);
  return _c_x10066;
}
 
 
// monadic lift
export function _mlift_prepare_trace_10205(body, completed, current, drafts, lifetime, plane, attempt) /* forall<_e,_e1,e2> (body : ref<global,kokaine/reactive/internal/model/trace<e2>>, completed : ref<global,bool>, current : kokaine/reactive/internal/model/continuation-scope<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, lifetime : kokaine/reactive/internal/model/lifetime-owner<e2>, plane : kokaine/reactive/internal/model/plane<e2>, attempt : error<kokaine/reactive/internal/model/built-trace<e2>>) -> e2 result<(),exception> */  {
   
  if (attempt._tag === 1) {
     
    var x_0_10251 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, drafts.value);
    if ($std_core_hnd._yielding()) {
      var x_10249 = $std_core_hnd.yield_extend(function(_pat_6_0 /* error<()> */ ) {
        return $std_core_types.$Error(attempt.error);
      });
    }
    else {
      var x_10249 = $std_core_types.$Error(attempt.error);
    }
  }
  else {
     
    var x_1_10255 = attempt.value.built_publish();
    if ($std_core_hnd._yielding()) {
      var x_10249 = $std_core_hnd.yield_extend(function(publication /* error<()> */ ) {
        return _mlift_prepare_trace_10203(body, attempt.value, current, drafts, lifetime, plane, publication);
      });
    }
    else {
      var x_10249 = _mlift_prepare_trace_10203(body, attempt.value, current, drafts, lifetime, plane, x_1_10255);
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10066 /* result<(),exception> */ ) {
       
      ((completed).value = true);
      return _c_x10066;
    });
  }
  else {
     
    ((completed).value = true);
    return x_10249;
  }
}
 
 
// monadic lift
export function _mlift_prepare_trace_10206(current, wild___4) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, wild_@4 : ()) -> <exn|e> () */  {
  return $kokaine_reactive_internal_lifetime.retire_scope(current);
}
 
export function prepare_trace(root, plane, owner_slot, parent, track, publish) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e1>, plane : kokaine/reactive/internal/model/plane<e>, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, parent : maybe<kokaine/reactive/internal/model/continuation-gate>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, publish : (value : a) -> <div,exn|e> ()) -> (kokaine/reactive/internal/model/continuation-scope<e>, kokaine/reactive/internal/model/work<e>, kokaine/reactive/internal/model/disposer<e>) */  {
   
  var _x2 = plane.plane_retirement;
  var lifetime = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_starting, _x2);
   
  var body = { value: ($kokaine_reactive_internal_model.Trace_end) };
   
  var bootstrap_slot = { value: ($std_core_types.Nothing) };
   
  var current = $kokaine_reactive_internal_model.Scope(lifetime, body, parent, bootstrap_slot, { value: ($std_core_types.Nothing) });
   
  ((bootstrap_slot).value = ($std_core_types.Just(function() {
    var _x4 = lifetime.lifetime_token;
    var _x3 = _x4.value;
    if (_x3 === 1) {
       
      var drafts = { value: ($std_core_types.Nil) };
       
      var completed = { value: false };
       
      var x_0_10266 = $kokaine_reactive_internal_lifetime.attempt_build(plane, drafts, function() {
          return $kokaine_reactive_internal_lifetime.with_entry(plane, $std_core_types.Nothing, function() {
              return $kokaine_reactive_internal_lifetime.with_context(plane, $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<1758> */ ) {
                    return _this_0.scope_parent;
                  }, current), lifetime, function() {
                  return reify_trace(root, plane, owner_slot, track, publish);
                });
            });
        });
      if ($std_core_hnd._yielding()) {
        var _x6 = $std_core_hnd.yield_extend(function(attempt /* error<kokaine/reactive/internal/model/built-trace<1758>> */ ) {
          return _mlift_prepare_trace_10205(body, completed, current, drafts, lifetime, plane, attempt);
        });
      }
      else {
        var _x6 = _mlift_prepare_trace_10205(body, completed, current, drafts, lifetime, plane, x_0_10266);
      }
      return $std_core_hnd.finally_prompt(function() {
          var _x5 = completed.value;
          if (_x5) {
            return $std_core_types.Unit;
          }
          else {
             
            var x_10262 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, drafts.value);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_pat_2_1 /* error<()> */ ) {
                return $std_core_types.Unit;
              });
            }
            else {
              return $std_core_types.Unit;
            }
          }
        }, _x6);
    }
    else {
      return $std_core_types.Ok($std_core_types.Unit);
    }
  })));
  return $std_core_types.Tuple3(current, $kokaine_reactive_internal_model.Bootstrap_work(current, owner_slot), function() {
       
      var x_1_10268 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive scope disposal");
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___4 /* () */ ) {
          return $kokaine_reactive_internal_lifetime.retire_scope(current);
        });
      }
      else {
        return $kokaine_reactive_internal_lifetime.retire_scope(current);
      }
    });
}