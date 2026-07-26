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
export function _mlift_reify_trace_10148(_pat_4_7) /* forall<e> (kokaine/reactive/internal/model/built-trace<e>) -> <div,exn|e> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_reify_trace_10149(child, current, nested) /* forall<_e,e1> (child : ref<global,kokaine/reactive/internal/model/trace<e1>>, current : kokaine/reactive/internal/model/trace<e1>, nested : kokaine/reactive/internal/model/built-trace<e1>) -> <div,exn|e1> kokaine/reactive/internal/model/built-trace<e1> */  {
   
  var value_15_10085 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/built-trace<815> */ ) {
      return _this.built_root;
    }, nested);
   
  ((child).value = value_15_10085);
  return $kokaine_reactive_internal_model.Built_trace(current, $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/built-trace<815> */ ) {
        return _this_0.built_publication_current;
      }, nested), $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/built-trace<815> */ ) {
        return _this_1.built_publication_frame;
      }, nested), $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/built-trace<815> */ ) {
        return _this_2.built_publication_action;
      }, nested));
}
 
 
// monadic lift
export function _mlift_reify_trace_10150(child, current, current_frame, plane, rcontext, registration, source, registered) /* forall<_e,_e1,a,e2> (child : ref<global,kokaine/reactive/internal/model/trace<e2>>, current : kokaine/reactive/internal/model/trace<e2>, current-frame : kokaine/reactive/internal/model/frame<e2>, plane : kokaine/reactive/internal/model/plane<e2>, rcontext : hnd/resume-context<a,<div,exn|e2>,<kokaine/reactive/effects/signal-read,div,exn|e2>,kokaine/reactive/internal/model/built-trace<e2>>, registration : ref<global,maybe<kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture>>>, source : kokaine/reactive/internal/model/source<a>, registered : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture>) -> <exn,div|e2> kokaine/reactive/internal/model/built-trace<e2> */  {
   
  ((registration).value = ($std_core_types.Just(registered)));
   
  var x_10161 = $kokaine_reactive_internal_lifetime.with_current(plane, current, current_frame, function() {
       
      var value_14_10082 = $std_core_hnd._open_none1(function(source_6 /* kokaine/reactive/internal/model/source<717> */ ) {
          return source_6.source_cell;
        }, source);
       
      var x_0_10164 = value_14_10082.value;
      return rcontext($std_core_hnd.Deep(x_0_10164));
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(nested /* kokaine/reactive/internal/model/built-trace<815> */ ) {
      return _mlift_reify_trace_10149(child, current, nested);
    });
  }
  else {
    return _mlift_reify_trace_10149(child, current, x_10161);
  }
}
 
 
// monadic lift
export function _mlift_reify_trace_10151(child, current, current_frame, plane, rcontext, registration, source, wild___1) /* forall<_e,_e1,a,e2> (child : ref<global,kokaine/reactive/internal/model/trace<e2>>, current : kokaine/reactive/internal/model/trace<e2>, current-frame : kokaine/reactive/internal/model/frame<e2>, plane : kokaine/reactive/internal/model/plane<e2>, rcontext : hnd/resume-context<a,<div,exn|e2>,<kokaine/reactive/effects/signal-read,div,exn|e2>,kokaine/reactive/internal/model/built-trace<e2>>, registration : ref<global,maybe<kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture>>>, source : kokaine/reactive/internal/model/source<a>, wild_@1 : ()) -> <exn,div|e2> kokaine/reactive/internal/model/built-trace<e2> */  {
   
  var _x_x1_10_10133 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<717> */ ) {
      return source_5.source_captures;
    }, source);
   
  var _x_x2_2_10134 = $std_core_hnd._open_none2(function(plane_4 /* kokaine/reactive/internal/model/plane<815> */ , current_0 /* kokaine/reactive/internal/model/trace<815> */ ) {
      return function(consume /* forall<e> (kokaine/reactive/internal/model/plane<e>, kokaine/reactive/internal/model/trace<e>) -> 337 */ ) {
        return consume(plane_4, current_0);
      };
    }, plane, current);
   
  var x_10165 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* kokaine/internal/registry/registry<kokaine/reactive/internal/model/packed-capture> */ , value_12 /* kokaine/reactive/internal/model/packed-capture */ ) {
      var _x0 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_12);
      if (_x0 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x0.value;
      }
    }, _x_x1_10_10133, _x_x2_2_10134);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registered /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture> */ ) {
      return _mlift_reify_trace_10150(child, current, current_frame, plane, rcontext, registration, source, registered);
    });
  }
  else {
    return _mlift_reify_trace_10150(child, current, current_frame, plane, rcontext, registration, source, x_10165);
  }
}
 
 
// monadic lift
export function _mlift_reify_trace_10152(mode, owner_slot, plane, producer, rcontext, source, wild__) /* forall<_e,_e1,_e2,a,e3> (mode : kokaine/reactive/internal/model/read-mode, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, plane : kokaine/reactive/internal/model/plane<e3>, producer : maybe<kokaine/reactive/internal/model/derive-producer>, rcontext : hnd/resume-context<a,<div,exn|e3>,<kokaine/reactive/effects/signal-read,div,exn|e3>,kokaine/reactive/internal/model/built-trace<e3>>, source : kokaine/reactive/internal/model/source<a>, wild_ : ()) -> <exn,div|e3> kokaine/reactive/internal/model/built-trace<e3> */  {
  if (mode === 2) {
     
    var value_10057 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<717> */ ) {
        return source_1.source_cell;
      }, source);
     
    var x_10168 = value_10057.value;
    return rcontext($std_core_hnd.Deep(x_10168));
  }
  else {
     
    var value_0_10059 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<717> */ ) {
        return source_2.source_version;
      }, source);
     
    var version = value_0_10059.value;
     
    var state = { value: ($kokaine_reactive_internal_model.Capture_draft) };
     
    var value_2_10062 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<815> */ ) {
        return plane_0.plane_current;
      }, plane);
     
    var gate = $kokaine_reactive_internal_model.Continuation_gate(state, value_2_10062.value, producer);
     
    var child = { value: ($kokaine_reactive_internal_model.Trace_end) };
     
    var _x_x2_0_10124 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<815> */ ) {
        return plane_1.plane_retirement;
      }, plane);
     
    var current_frame = $std_core_hnd._open_none2($kokaine_reactive_internal_lifetime.new_lifetime_owner, $kokaine_reactive_internal_model.Scope_starting, _x_x2_0_10124);
     
    var current_frame_slot = { value: current_frame };
     
    var registration = { value: ($std_core_types.Nothing) };
     
    var current = $kokaine_reactive_internal_model.Trace_read(gate, owner_slot, child, current_frame_slot, function(___wildcard_x63__20 /* kokaine/reactive/internal/model/frame<815> */ ) {
         
        var value_6_10069 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<717> */ ) {
            return source_3.source_cell;
          }, source);
         
        var x_0_10170 = value_6_10069.value;
        return rcontext($std_core_hnd.Deep(x_0_10170));
      }, function() {
         
        var value_7_10071 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<815> */ ) {
            return plane_2.plane_current_frame;
          }, plane);
         
        var terminal = value_7_10071.value;
         
        var value_8_10073 = $std_core_hnd._open_none1(function(plane_3 /* kokaine/reactive/internal/model/plane<815> */ ) {
            return plane_3.plane_current;
          }, plane);
         
        var checkpoint = value_8_10073.value;
         
        var x_1_10171 = rcontext($std_core_hnd.Finalize($kokaine_reactive_internal_model.Built_trace($kokaine_reactive_internal_model.Trace_end, checkpoint, terminal, function() {
            return $std_core_types.Unit;
          })));
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_pat_4_7 /* kokaine/reactive/internal/model/built-trace<815> */ ) {
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
           
          var _pat_3_7 = $kokaine_internal_registry.registry_registration_fs_take(_x0.value);
          return $std_core_types.Unit;
        }
      }, function() {
        var _x1 = source.source_version;
        return $std_core_types._int_ne((_x1.value),version);
      });
     
    var x_3_10176 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_lifetime.record_draft, plane, current);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
        return _mlift_reify_trace_10151(child, current, current_frame, plane, rcontext, registration, source, wild___1);
      });
    }
    else {
      return _mlift_reify_trace_10151(child, current, current_frame, plane, rcontext, registration, source, x_3_10176);
    }
  }
}
 
export function reify_trace(root, plane, owner_slot, track, publish) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e1>, plane : kokaine/reactive/internal/model/plane<e>, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, publish : (value : a) -> <div,exn|e> ()) -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e> */  {
  return $kokaine_reactive_effects.signal_read_fs__handle($kokaine_reactive_effects._Hnd_signal_read(3, function(m /* hnd/marker<<div,exn|815>,kokaine/reactive/internal/model/built-trace<815>> */ , ___wildcard_x598__16 /* hnd/ev<kokaine/reactive/effects/signal-read> */ , x /* (kokaine/reactive/internal/model/source<_123>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<_123,kokaine/reactive/internal/model/built-trace<815>>) -> <div,exn|815> kokaine/reactive/internal/model/built-trace<815> */ ) {
             
            var _x_x2_10118 = $std_core_hnd._open_none1(function(source_0 /* kokaine/reactive/internal/model/source<717> */ ) {
                return source_0.source_root;
              }, x.fst);
             
            var x_0_10179 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10118);
             
            function next_10180(wild__) /* (()) -> <exn,div|815> kokaine/reactive/internal/model/built-trace<815> */  {
              return _mlift_reify_trace_10152(x.snd, owner_slot, plane, x.thd, k, x.fst, wild__);
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_10180);
            }
            else {
              return next_10180(x_0_10179);
            }
          });
      }, $std_core_hnd.clause_tail1(function(producer_0 /* kokaine/reactive/internal/model/derive-producer */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.settle_producer, producer_0);
      })), function(value_16 /* 814 */ ) {
       
      var value_17_10091 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<815> */ ) {
          return plane_5.plane_current_frame;
        }, plane);
       
      var terminal_0 = value_17_10091.value;
       
      var value_18_10093 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<815> */ ) {
          return plane_6.plane_current;
        }, plane);
       
      var checkpoint_0 = value_18_10093.value;
      return $kokaine_reactive_internal_model.Built_trace($kokaine_reactive_internal_model.Trace_end, checkpoint_0, terminal_0, function() {
          return publish(value_16);
        });
    }, function() {
      return $std_core_hnd._open0($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), $std_core_types.Nil))), track);
    });
}
 
 
// monadic lift
export function _mlift_prepare_trace_10153(_pat_2_1) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_prepare_trace_10154(failure, _pat_6_0) /* forall<e> (failure : exception, error<()>) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure);
}
 
 
// monadic lift
export function _mlift_prepare_trace_10155(failure_0, _pat_11) /* forall<e> (failure@0 : exception, error<()>) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure_0);
}
 
 
// monadic lift
export function _mlift_prepare_trace_10156(_pat_16_0) /* forall<e> (error<()>) -> e result<(),exception> */  {
  return $std_core_types.Ok($std_core_types.Unit);
}
 
 
// monadic lift
export function _mlift_prepare_trace_10157(body, built, current, drafts, lifetime, plane, publication) /* forall<_e,_e1,e2> (body : ref<global,kokaine/reactive/internal/model/trace<e2>>, built : kokaine/reactive/internal/model/built-trace<e2>, current : kokaine/reactive/internal/model/continuation-scope<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, lifetime : kokaine/reactive/internal/model/lifetime-owner<e2>, plane : kokaine/reactive/internal/model/plane<e2>, publication : error<()>) -> e2 result<(),exception> */  {
  if (publication._tag === 1) {
     
    var x_10181 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, drafts.value);
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
       
      var x_0_10185 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, drafts.value);
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
export function _mlift_prepare_trace_10158(completed, _c_x10048) /* forall<_e> (completed : ref<global,bool>, result<(),exception>) -> result<(),exception> */  {
   
  ((completed).value = true);
  return _c_x10048;
}
 
 
// monadic lift
export function _mlift_prepare_trace_10159(body, completed, current, drafts, lifetime, plane, attempt) /* forall<_e,_e1,e2> (body : ref<global,kokaine/reactive/internal/model/trace<e2>>, completed : ref<global,bool>, current : kokaine/reactive/internal/model/continuation-scope<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, lifetime : kokaine/reactive/internal/model/lifetime-owner<e2>, plane : kokaine/reactive/internal/model/plane<e2>, attempt : error<kokaine/reactive/internal/model/built-trace<e2>>) -> e2 result<(),exception> */  {
   
  if (attempt._tag === 1) {
     
    var x_0_10190 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, drafts.value);
    if ($std_core_hnd._yielding()) {
      var x_10188 = $std_core_hnd.yield_extend(function(_pat_6_0 /* error<()> */ ) {
        return $std_core_types.$Error(attempt.error);
      });
    }
    else {
      var x_10188 = $std_core_types.$Error(attempt.error);
    }
  }
  else {
     
    var x_1_10194 = $kokaine_reactive_internal_scheduler.built_trace_fs_run_publication(attempt.value, plane);
    if ($std_core_hnd._yielding()) {
      var x_10188 = $std_core_hnd.yield_extend(function(publication /* error<()> */ ) {
        return _mlift_prepare_trace_10157(body, attempt.value, current, drafts, lifetime, plane, publication);
      });
    }
    else {
      var x_10188 = _mlift_prepare_trace_10157(body, attempt.value, current, drafts, lifetime, plane, x_1_10194);
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10048 /* result<(),exception> */ ) {
       
      ((completed).value = true);
      return _c_x10048;
    });
  }
  else {
     
    ((completed).value = true);
    return x_10188;
  }
}
 
 
// monadic lift
export function _mlift_prepare_trace_10160(current, wild___4) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, wild_@4 : ()) -> <exn|e> () */  {
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
       
      var x_0_10205 = $kokaine_reactive_internal_lifetime.attempt_build(plane, drafts, function() {
          return $kokaine_reactive_internal_lifetime.with_context(plane, $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<1346> */ ) {
                return _this_0.scope_parent;
              }, current), lifetime, function() {
              return reify_trace(root, plane, owner_slot, track, publish);
            });
        });
      if ($std_core_hnd._yielding()) {
        var _x6 = $std_core_hnd.yield_extend(function(attempt /* error<kokaine/reactive/internal/model/built-trace<1346>> */ ) {
          return _mlift_prepare_trace_10159(body, completed, current, drafts, lifetime, plane, attempt);
        });
      }
      else {
        var _x6 = _mlift_prepare_trace_10159(body, completed, current, drafts, lifetime, plane, x_0_10205);
      }
      return $std_core_hnd.finally_prompt(function() {
          var _x5 = completed.value;
          if (_x5) {
            return $std_core_types.Unit;
          }
          else {
             
            var x_10201 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, drafts.value);
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
       
      var x_1_10207 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive scope disposal");
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