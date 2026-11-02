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
export function _mlift_reify_trace_10146(_pat_6_0) /* forall<e> (kokaine/reactive/internal/model/built-trace<e>) -> <div,exn|e> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_reify_trace_10147(child, current, nested) /* forall<e> (child : ref<global,kokaine/reactive/internal/model/trace<e>>, current : kokaine/reactive/internal/model/trace<e>, nested : kokaine/reactive/internal/model/built-trace<e>) -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e> */  {
   
  var _x_x2_7_10134 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/built-trace<844> */ ) {
      return _this.built_root;
    }, nested);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, child, _x_x2_7_10134);
  return $kokaine_reactive_internal_model.Built_trace(current, $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/built-trace<844> */ ) {
        return _this_0.built_publication_current;
      }, nested), $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/built-trace<844> */ ) {
        return _this_1.built_publication_frame;
      }, nested), $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/built-trace<844> */ ) {
        return _this_2.built_publication_action;
      }, nested));
}
 
 
// monadic lift
export function _mlift_reify_trace_10148(child, current, current_frame, plane, rcontext, registration, resumed, source, registered) /* forall<a,e> (child : ref<global,kokaine/reactive/internal/model/trace<e>>, current : kokaine/reactive/internal/model/trace<e>, current-frame : kokaine/reactive/internal/model/frame<e>, plane : kokaine/reactive/internal/model/plane<e>, rcontext : hnd/resume-context<a,<div,exn|e>,<kokaine/reactive/effects/signal-read,div,exn|e>,kokaine/reactive/internal/model/built-trace<e>>, registration : ref<global,maybe<kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture>>>, resumed : ref<global,bool>, source : kokaine/reactive/internal/model/source<a>, registered : kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture>) -> <exn,div|e> kokaine/reactive/internal/model/built-trace<e> */  {
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, registration, $std_core_types.Just(registered));
   
  var x_10159 = $kokaine_reactive_internal_lifetime.with_current(plane, current, current_frame, function() {
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, resumed, true);
       
      var _x_x1_28_10131 = $std_core_hnd._open_none1(function(source_6 /* kokaine/reactive/internal/model/source<746> */ ) {
          return source_6.source_cell;
        }, source);
       
      var x_0_10162 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_28_10131);
      return rcontext($std_core_hnd.Deep(x_0_10162));
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(nested /* kokaine/reactive/internal/model/built-trace<844> */ ) {
      return _mlift_reify_trace_10147(child, current, nested);
    });
  }
  else {
    return _mlift_reify_trace_10147(child, current, x_10159);
  }
}
 
 
// monadic lift
export function _mlift_reify_trace_10149(child, current, current_frame, plane, rcontext, registration, resumed, source, wild___1) /* forall<a,e> (child : ref<global,kokaine/reactive/internal/model/trace<e>>, current : kokaine/reactive/internal/model/trace<e>, current-frame : kokaine/reactive/internal/model/frame<e>, plane : kokaine/reactive/internal/model/plane<e>, rcontext : hnd/resume-context<a,<div,exn|e>,<kokaine/reactive/effects/signal-read,div,exn|e>,kokaine/reactive/internal/model/built-trace<e>>, registration : ref<global,maybe<kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture>>>, resumed : ref<global,bool>, source : kokaine/reactive/internal/model/source<a>, wild_@1 : ()) -> <exn,div|e> kokaine/reactive/internal/model/built-trace<e> */  {
   
  var _x_x1_22_10122 = $std_core_hnd._open_none1(function(source_5 /* kokaine/reactive/internal/model/source<746> */ ) {
      return source_5.source_captures;
    }, source);
   
  var _x_x2_2_10123 = $std_core_hnd._open_none2(function(plane_4 /* kokaine/reactive/internal/model/plane<844> */ , current_0 /* kokaine/reactive/internal/model/trace<844> */ ) {
      return function(consume /* forall<e> (kokaine/reactive/internal/model/plane<e>, kokaine/reactive/internal/model/trace<e>) -> 369 */ ) {
        return consume(plane_4, current_0);
      };
    }, plane, current);
   
  var x_10163 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target /* kokaine/internal/registry/registry<kokaine/reactive/internal/model/packed-capture> */ , value /* kokaine/reactive/internal/model/packed-capture */ ) {
      var _x0 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target, value);
      if (_x0 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x0.value;
      }
    }, _x_x1_22_10122, _x_x2_2_10123);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registered /* kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/packed-capture> */ ) {
      return _mlift_reify_trace_10148(child, current, current_frame, plane, rcontext, registration, resumed, source, registered);
    });
  }
  else {
    return _mlift_reify_trace_10148(child, current, current_frame, plane, rcontext, registration, resumed, source, x_10163);
  }
}
 
 
// monadic lift
export function _mlift_reify_trace_10150(mode, owner_slot, plane, producer, rcontext, source, wild__) /* forall<a,e> (mode : kokaine/reactive/internal/model/read-mode, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, plane : kokaine/reactive/internal/model/plane<e>, producer : maybe<kokaine/reactive/internal/model/derive-producer>, rcontext : hnd/resume-context<a,<div,exn|e>,<kokaine/reactive/effects/signal-read,div,exn|e>,kokaine/reactive/internal/model/built-trace<e>>, source : kokaine/reactive/internal/model/source<a>, wild_ : ()) -> <exn,div|e> kokaine/reactive/internal/model/built-trace<e> */  {
  if (mode === 2) {
     
    var _x_x1_1_10097 = $std_core_hnd._open_none1(function(source_1 /* kokaine/reactive/internal/model/source<746> */ ) {
        return source_1.source_cell;
      }, source);
     
    var x_10166 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10097);
    return rcontext($std_core_hnd.Deep(x_10166));
  }
  else {
     
    var _x_x1_3_10099 = $std_core_hnd._open_none1(function(source_2 /* kokaine/reactive/internal/model/source<746> */ ) {
        return source_2.source_version;
      }, source);
     
    var version = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_3_10099);
     
    var state = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $kokaine_reactive_internal_model.Capture_draft);
     
    var _x_x1_6_10102 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<844> */ ) {
        return plane_0.plane_current;
      }, plane);
     
    var gate = $kokaine_reactive_internal_model.Continuation_gate(state, $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_6_10102), producer);
     
    var child = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $kokaine_reactive_internal_model.Trace_end);
     
    var resumed = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false);
     
    var _x_x2_0_10107 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<844> */ ) {
        return plane_1.plane_retirement;
      }, plane);
     
    var current_frame = $std_core_hnd._open_none2($kokaine_reactive_internal_lifetime.new_lifetime_owner, $kokaine_reactive_internal_model.Scope_starting, _x_x2_0_10107);
     
    var current_frame_slot = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, current_frame);
     
    var registration = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing);
     
    var current = $kokaine_reactive_internal_model.Trace_read(gate, owner_slot, child, current_frame_slot, function(___wildcard_x67__20 /* kokaine/reactive/internal/model/frame<844> */ ) {
         
        var _x_x1_14_10111 = $std_core_hnd._open_none1(function(source_3 /* kokaine/reactive/internal/model/source<746> */ ) {
            return source_3.source_cell;
          }, source);
         
        var x_0_10168 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_14_10111);
        return rcontext($std_core_hnd.Deep(x_0_10168));
      }, function() {
        var _x0 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, resumed);
        if (_x0) {
          return $std_core_types.Unit;
        }
        else {
           
          var _x_x1_17_10114 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<844> */ ) {
              return plane_2.plane_current_frame;
            }, plane);
           
          var terminal = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_17_10114);
           
          var _x_x1_19_10116 = $std_core_hnd._open_none1(function(plane_3 /* kokaine/reactive/internal/model/plane<844> */ ) {
              return plane_3.plane_current;
            }, plane);
           
          var checkpoint = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_19_10116);
           
          var x_1_10169 = rcontext($std_core_hnd.Finalize($kokaine_reactive_internal_model.Built_trace($kokaine_reactive_internal_model.Trace_end, checkpoint, terminal, function() {
              return $std_core_types.Unit;
            })));
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_pat_6_0 /* kokaine/reactive/internal/model/built-trace<844> */ ) {
              return $std_core_types.Unit;
            });
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }, function() {
        var _x1 = $kokaine_reactive_internal_model.load(registration);
        if (_x1 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          $kokaine_reactive_internal_model.store(registration, $std_core_types.Nothing);
           
          var _pat_3_7 = $kokaine_internal_registry.registry_registration_fs_take(_x1.value);
          return $std_core_types.Unit;
        }
      }, function() {
        var _x2 = source.source_version;
        return $std_core_types._int_ne(($kokaine_reactive_internal_model.load(_x2)),version);
      });
     
    var x_3_10174 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_lifetime.record_draft, plane, current);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
        return _mlift_reify_trace_10149(child, current, current_frame, plane, rcontext, registration, resumed, source, wild___1);
      });
    }
    else {
      return _mlift_reify_trace_10149(child, current, current_frame, plane, rcontext, registration, resumed, source, x_3_10174);
    }
  }
}
 
export function reify_trace(root, plane, owner_slot, track, publish) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e1>, plane : kokaine/reactive/internal/model/plane<e>, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, publish : (value : a) -> <div,exn|e> ()) -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e> */  {
  return $kokaine_reactive_effects.signal_read_fs__handle($kokaine_reactive_effects._Hnd_signal_read(3, function(m /* hnd/marker<<div,exn|844>,kokaine/reactive/internal/model/built-trace<844>> */ , ___wildcard_x598__16 /* hnd/ev<kokaine/reactive/effects/signal-read> */ , x /* (kokaine/reactive/internal/model/source<_123>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<_123,kokaine/reactive/internal/model/built-trace<844>>) -> <div,exn|844> kokaine/reactive/internal/model/built-trace<844> */ ) {
             
            var _x_x2_10095 = $std_core_hnd._open_none1(function(source_0 /* kokaine/reactive/internal/model/source<746> */ ) {
                return source_0.source_root;
              }, x.fst);
             
            var x_0_10177 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_root, root, _x_x2_10095);
             
            function next_10178(wild__) /* (()) -> <exn,div|844> kokaine/reactive/internal/model/built-trace<844> */  {
              return _mlift_reify_trace_10150(x.snd, owner_slot, plane, x.thd, k, x.fst, wild__);
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_10178);
            }
            else {
              return next_10178(x_0_10177);
            }
          });
      }, $std_core_hnd.clause_tail1(function(producer_0 /* kokaine/reactive/internal/model/derive-producer */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.settle_producer, producer_0);
      })), function(value_0 /* 843 */ ) {
       
      var _x_x1_36_10140 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<844> */ ) {
          return plane_5.plane_current_frame;
        }, plane);
       
      var terminal_0 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_36_10140);
       
      var _x_x1_38_10142 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<844> */ ) {
          return plane_6.plane_current;
        }, plane);
       
      var checkpoint_0 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_38_10142);
      return $kokaine_reactive_internal_model.Built_trace($kokaine_reactive_internal_model.Trace_end, checkpoint_0, terminal_0, function() {
          return publish(value_0);
        });
    }, function() {
      return $std_core_hnd._open0($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag), $std_core_types.Nil))), track);
    });
}
 
 
// monadic lift
export function _mlift_prepare_trace_10151(_pat_2_1) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_prepare_trace_10152(failure, _pat_6_0) /* forall<e> (failure : exception, error<()>) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure);
}
 
 
// monadic lift
export function _mlift_prepare_trace_10153(failure_0, _pat_11) /* forall<e> (failure@0 : exception, error<()>) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure_0);
}
 
 
// monadic lift
export function _mlift_prepare_trace_10154(_pat_16_0) /* forall<e> (error<()>) -> e result<(),exception> */  {
  return $std_core_types.Ok($std_core_types.Unit);
}
 
 
// monadic lift
export function _mlift_prepare_trace_10155(body, built, current, drafts, lifetime, plane, publication) /* forall<e> (body : ref<global,kokaine/reactive/internal/model/trace<e>>, built : kokaine/reactive/internal/model/built-trace<e>, current : kokaine/reactive/internal/model/continuation-scope<e>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e>>>, lifetime : kokaine/reactive/internal/model/lifetime-owner<e>, plane : kokaine/reactive/internal/model/plane<e>, publication : error<()>) -> e result<(),exception> */  {
  if (publication._tag === 1) {
     
    var x_10179 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, $kokaine_reactive_internal_model.load(drafts));
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
    var _x0 = $kokaine_reactive_internal_model.load(_x1);
    if (_x0 === 1) {
       
      var _x2 = built.built_root;
      $kokaine_reactive_internal_model.store(body, _x2);
       
      var _x3 = built.built_root;
      $kokaine_reactive_internal_scheduler.activate_trace_loop(plane, _x3);
       
      var _x4 = lifetime.lifetime_token;
      $kokaine_reactive_internal_model.store(_x4, $kokaine_reactive_internal_model.Scope_live);
      return $std_core_types.Ok($std_core_types.Unit);
    }
    else {
       
      var x_0_10183 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, $kokaine_reactive_internal_model.load(drafts));
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
export function _mlift_prepare_trace_10156(completed, _c_x10039) /* (completed : ref<global,bool>, result<(),exception>) -> result<(),exception> */  {
   
  $kokaine_reactive_internal_model.store(completed, true);
  return _c_x10039;
}
 
 
// monadic lift
export function _mlift_prepare_trace_10157(body, completed, current, drafts, lifetime, plane, attempt) /* forall<e> (body : ref<global,kokaine/reactive/internal/model/trace<e>>, completed : ref<global,bool>, current : kokaine/reactive/internal/model/continuation-scope<e>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e>>>, lifetime : kokaine/reactive/internal/model/lifetime-owner<e>, plane : kokaine/reactive/internal/model/plane<e>, attempt : error<kokaine/reactive/internal/model/built-trace<e>>) -> e result<(),exception> */  {
   
  if (attempt._tag === 1) {
     
    var x_0_10188 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, $kokaine_reactive_internal_model.load(drafts));
    if ($std_core_hnd._yielding()) {
      var x_10186 = $std_core_hnd.yield_extend(function(_pat_6_0 /* error<()> */ ) {
        return $std_core_types.$Error(attempt.error);
      });
    }
    else {
      var x_10186 = $std_core_types.$Error(attempt.error);
    }
  }
  else {
     
    var x_1_10192 = $kokaine_reactive_internal_scheduler.built_trace_fs_run_publication(attempt.value, plane);
    if ($std_core_hnd._yielding()) {
      var x_10186 = $std_core_hnd.yield_extend(function(publication /* error<()> */ ) {
        return _mlift_prepare_trace_10155(body, attempt.value, current, drafts, lifetime, plane, publication);
      });
    }
    else {
      var x_10186 = _mlift_prepare_trace_10155(body, attempt.value, current, drafts, lifetime, plane, x_1_10192);
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10039 /* result<(),exception> */ ) {
       
      $kokaine_reactive_internal_model.store(completed, true);
      return _c_x10039;
    });
  }
  else {
     
    $kokaine_reactive_internal_model.store(completed, true);
    return x_10186;
  }
}
 
 
// monadic lift
export function _mlift_prepare_trace_10158(current, wild___4) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, wild_@4 : ()) -> <exn|e> () */  {
  return $kokaine_reactive_internal_lifetime.retire_scope(current);
}
 
export function prepare_trace(root, plane, owner_slot, parent, track, publish) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e1>, plane : kokaine/reactive/internal/model/plane<e>, owner-slot : ref<global,maybe<kokaine/reactive/internal/model/derive-producer>>, parent : maybe<kokaine/reactive/internal/model/continuation-gate>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, publish : (value : a) -> <div,exn|e> ()) -> (kokaine/reactive/internal/model/continuation-scope<e>, kokaine/reactive/internal/model/work<e>, kokaine/reactive/internal/model/disposer<e>) */  {
   
  var _x2 = plane.plane_retirement;
  var lifetime = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_starting, _x2);
   
  var body = $kokaine_reactive_internal_model.cell($kokaine_reactive_internal_model.Trace_end);
   
  var bootstrap_slot = $kokaine_reactive_internal_model.cell($std_core_types.Nothing);
   
  var current = $kokaine_reactive_internal_model.Scope(lifetime, body, parent, bootstrap_slot, $kokaine_reactive_internal_model.cell($std_core_types.Nothing));
   
  $kokaine_reactive_internal_model.store(bootstrap_slot, $std_core_types.Just(function() {
      var _x4 = lifetime.lifetime_token;
      var _x3 = $kokaine_reactive_internal_model.load(_x4);
      if (_x3 === 1) {
         
        var drafts = $kokaine_reactive_internal_model.cell($std_core_types.Nil);
         
        var completed = $kokaine_reactive_internal_model.cell(false);
         
        var x_0_10203 = $kokaine_reactive_internal_lifetime.attempt_build(plane, drafts, function() {
            return $kokaine_reactive_internal_lifetime.with_context(plane, $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<1375> */ ) {
                  return _this_0.scope_parent;
                }, current), lifetime, function() {
                return reify_trace(root, plane, owner_slot, track, publish);
              });
          });
        if ($std_core_hnd._yielding()) {
          var _x6 = $std_core_hnd.yield_extend(function(attempt /* error<kokaine/reactive/internal/model/built-trace<1375>> */ ) {
            return _mlift_prepare_trace_10157(body, completed, current, drafts, lifetime, plane, attempt);
          });
        }
        else {
          var _x6 = _mlift_prepare_trace_10157(body, completed, current, drafts, lifetime, plane, x_0_10203);
        }
        return $std_core_hnd.finally_prompt(function() {
            var _x5 = $kokaine_reactive_internal_model.load(completed);
            if (_x5) {
              return $std_core_types.Unit;
            }
            else {
               
              var x_10199 = $kokaine_reactive_internal_lifetime.try_retire_scope_drafts(current, $kokaine_reactive_internal_model.load(drafts));
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
    }));
  return $std_core_types.Tuple3(current, $kokaine_reactive_internal_model.Bootstrap_work(current, owner_slot), function() {
       
      var x_1_10205 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "reactive scope disposal");
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