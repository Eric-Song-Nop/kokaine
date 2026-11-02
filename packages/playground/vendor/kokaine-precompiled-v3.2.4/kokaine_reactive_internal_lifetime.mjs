// Koka generated module: kokaine/reactive/internal/lifetime, koka version: 3.2.4
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
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
 
// externals
 
// type declarations
 
// declarations
 
 
// `noinline`: Koka 3.2.8+ exports this body's inlined `unsafe-total` with a
// fresh `_e1` effect variable that its own `.kki` parser rejects, so every
// incremental build after the first fails. Keeping it out of the interface's
// inline section is stable on 3.2.3 through 3.2.9.
export function trace_state_of(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> kokaine/reactive/internal/model/capture-state */  {
  if (current === null) {
    return $kokaine_reactive_internal_model.Capture_dead;
  }
  else {
    var _x0 = current.trace_gate.gate_state;
    return $kokaine_reactive_internal_model.load(_x0);
  }
}
 
export function trace_gate_of(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> maybe<kokaine/reactive/internal/model/continuation-gate> */  {
  if (current === null) {
    return $std_core_types.Nothing;
  }
  else {
    return $std_core_types.Just(current.trace_gate);
  }
}
 
export function trace_parent_of(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> maybe<kokaine/reactive/internal/model/continuation-gate> */  {
  if (current === null) {
    var _x1 = $std_core_types.Nothing;
  }
  else {
    var _x1 = $std_core_types.Just(current.trace_gate);
  }
  if (_x1 === null) {
    return $std_core_types.Nothing;
  }
  else {
    return _x1.value.gate_parent;
  }
}
 
export function new_retirement_coordinator() /* forall<e> () -> kokaine/reactive/internal/model/retirement-coordinator<e> */  {
  return $kokaine_reactive_internal_model.Retirement_coordinator($kokaine_reactive_internal_model.cell(0), $kokaine_reactive_internal_model.cell(false), $kokaine_reactive_internal_model.cell($std_core_types.Nothing));
}
 
export function retirement_coordinator_fs_install_root_disposal(coordinator, dispose) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, dispose : () -> <div,exn|e> ()) -> () */  {
  var _x2 = coordinator.retirement_dispose_root;
  return $kokaine_reactive_internal_model.store(_x2, $std_core_types.Just(dispose));
}
 
export function retirement_coordinator_fs_request_root_disposal(coordinator) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>) -> bool */  {
  var _x4 = coordinator.retirement_depth;
  var _x3 = $std_core_types._int_le(($kokaine_reactive_internal_model.load(_x4)),0);
  if (_x3) {
    return false;
  }
  else {
     
    var _x5 = coordinator.retirement_disposal_requested;
    $kokaine_reactive_internal_model.store(_x5, true);
    return true;
  }
}
 
export function new_lifetime_owner(state, coordinator) /* forall<e> (state : kokaine/reactive/internal/model/scope-state, coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>) -> kokaine/reactive/internal/model/lifetime-owner<e> */  {
  return $kokaine_reactive_internal_model.Lifetime_owner($kokaine_reactive_internal_model.cell(state), $kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0)), $kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0)), coordinator);
}
 
export function lifetime_owner_fs_register_child(owner, work) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, work : kokaine/reactive/internal/model/retirement-work<e>) -> exn kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>> */  {
   
  var target_10006 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<679> */ ) {
      return _this.lifetime_children;
    }, owner);
  var _x5 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_10006, work);
  if (_x5 === null) {
    return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
  }
  else {
    return _x5.value;
  }
}
 
export function lifetime_owner_fs_register_finalizer(owner, work) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, work : kokaine/reactive/internal/model/retirement-work<e>) -> exn kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>> */  {
   
  var target_10008 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<707> */ ) {
      return _this.lifetime_finalizers;
    }, owner);
  var _x6 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_10008, work);
  if (_x6 === null) {
    return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
  }
  else {
    return _x6.value;
  }
}
 
 
// Empty generations still need an atomic structural close so stale frames
// cannot accept later children or finalizers.
export function lifetime_owner_fs_try_retire_empty(owner) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>) -> bool */  {
  var _x8 = owner.lifetime_token;
  var _x7 = $kokaine_reactive_internal_model.load(_x8);
  if (_x7 === 4) {
    return true;
  }
  else if (_x7 === 3) {
    var _x10 = $kokaine_internal_registry.load(owner.lifetime_children.registry_count);
    var _x9 = $std_core_types._int_ne(_x10,0);
    if (_x9) {
      return false;
    }
    else {
      var _x12 = $kokaine_internal_registry.load(owner.lifetime_finalizers.registry_count);
      var _x11 = $std_core_types._int_ne(_x12,0);
      if (_x11) {
        return false;
      }
      else {
         
        var _x13 = owner.lifetime_token;
        $kokaine_reactive_internal_model.store(_x13, $kokaine_reactive_internal_model.Scope_dead);
         
        var _x14 = owner.lifetime_children;
        var _pat_5_0 = $kokaine_internal_registry.registry_fs_seal_detach(_x14);
         
        var _x15 = owner.lifetime_finalizers;
        var _pat_6_0 = $kokaine_internal_registry.registry_fs_seal_detach(_x15);
        return true;
      }
    }
  }
  else {
    return false;
  }
}
 
export function unlink_scope_owner(current) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>) -> () */  {
   
  var _x13 = current.scope_unlink;
  var unlink = $kokaine_reactive_internal_model.load(_x13);
   
  var _x14 = current.scope_unlink;
  $kokaine_reactive_internal_model.store(_x14, $std_core_types.Nothing);
  if (unlink === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _pat_1_1 = unlink.value();
    return $std_core_types.Unit;
  }
}
 
export function reverse_onto(values, target) /* forall<a> (values : list<a>, target : list<a>) -> div list<a> */  { tailcall: while(1)
{
  if (values === null) {
    return target;
  }
  else {
    {
      // tail call
      var _x13 = $std_core_types.Cons(values.head, target);
      values = values.tail;
      target = _x13;
      continue tailcall;
    }
  }
}}
 
export function prepend_in_order(values, target) /* forall<a> (values : list<a>, target : list<a>) -> div list<a> */  {
  return reverse_onto($std_core_list.reverse_acc($std_core_types.Nil, values), target);
}
 
export function append_in_order(left, right) /* forall<a> (left : list<a>, right : list<a>) -> div list<a> */  {
  return reverse_onto($std_core_list.reverse_acc($std_core_types.Nil, left), right);
}
 
export function widen_pure_retirement(current) /* forall<e> (current : kokaine/reactive/internal/model/retirement-work<total>) -> div kokaine/reactive/internal/model/retirement-work<e> */  {
  if (current._tag === 1) {
    return $kokaine_reactive_internal_model.Retirement_step(function() {
      return widen_work_list(current.retirement_expand(), $std_core_types.Nil);
    });
  }
  else {
    return $kokaine_reactive_internal_model.Retirement_finalizer(function() {
      return $std_core_hnd._open_at0($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), current.retirement_action);
    });
  }
}
 
export function widen_work_list(values, collected) /* forall<e> (values : list<kokaine/reactive/internal/model/retirement-work<total>>, collected : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected);
  }
  else {
    {
      // tail call
      var _x14 = $std_core_types.Cons(widen_pure_retirement(values.head), collected);
      values = values.tail;
      collected = _x14;
      continue tailcall;
    }
  }
}}
 
export function lifetime_retirement_expand(owner) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  {
   
  var _x15 = owner.lifetime_token;
  $kokaine_reactive_internal_model.store(_x15, $kokaine_reactive_internal_model.Scope_dead);
   
  var _x17 = owner.lifetime_children;
  var _x16 = $kokaine_internal_registry.registry_fs_seal_detach(_x17);
  var children = (_x16 === null) ? $std_core_types.Nil : _x16.value;
   
  var _x19 = owner.lifetime_finalizers;
  var _x18 = $kokaine_internal_registry.registry_fs_seal_detach(_x19);
  var finalizers = (_x18 === null) ? $std_core_types.Nil : _x18.value;
  return reverse_onto($std_core_list.reverse_acc($std_core_types.Nil, children), finalizers);
}
 
export function lifetime_retirement_work(owner) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>) -> kokaine/reactive/internal/model/retirement-work<e> */  {
  return $kokaine_reactive_internal_model.Retirement_step(function() {
    return lifetime_retirement_expand(owner);
  });
}
 
export function trace_retirement_expand(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  {
  if (current === null) {
    return $std_core_types.Nil;
  }
  else {
    var _x16 = current.trace_gate.gate_state;
    var _x15 = $kokaine_reactive_internal_model.load(_x16);
    if (_x15 === 5) {
      return $std_core_types.Nil;
    }
    else {
       
      var current_frame = $kokaine_reactive_internal_model.load(current.trace_frame);
       
      var _x17 = current.trace_gate.gate_state;
      $kokaine_reactive_internal_model.store(_x17, $kokaine_reactive_internal_model.Capture_dead);
       
      var _x18 = current_frame.lifetime_token;
      $kokaine_reactive_internal_model.store(_x18, $kokaine_reactive_internal_model.Scope_branch_dead);
       
      current.trace_unlink();
       
      var nested = $kokaine_reactive_internal_model.load(current.trace_child);
       
      $kokaine_reactive_internal_model.store(current.trace_child, $kokaine_reactive_internal_model.Trace_end);
      return $std_core_types.Cons(trace_retirement_work(nested), $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
             
            var _x17 = current_frame.lifetime_token;
            $kokaine_reactive_internal_model.store(_x17, $kokaine_reactive_internal_model.Scope_dead);
             
            var _x19 = current_frame.lifetime_children;
            var _x18 = $kokaine_internal_registry.registry_fs_seal_detach(_x19);
            var children = (_x18 === null) ? $std_core_types.Nil : _x18.value;
             
            var _x21 = current_frame.lifetime_finalizers;
            var _x20 = $kokaine_internal_registry.registry_fs_seal_detach(_x21);
            var finalizers = (_x20 === null) ? $std_core_types.Nil : _x20.value;
            return reverse_onto($std_core_list.reverse_acc($std_core_types.Nil, children), finalizers);
          }), $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_finalizer(current.trace_finalize), $std_core_types.Nil)));
    }
  }
}
 
export function trace_retirement_work(current_0) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> div kokaine/reactive/internal/model/retirement-work<e> */  {
  return $kokaine_reactive_internal_model.Retirement_step(function() {
    return trace_retirement_expand(current_0);
  });
}
 
export function scope_retirement_expand(current) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  {
   
  var _x17 = current.scope_bootstrap_slot;
  $kokaine_reactive_internal_model.store(_x17, $std_core_types.Nothing);
   
  var _x18 = current.scope_unlink;
  var unlink = $kokaine_reactive_internal_model.load(_x18);
   
  var _x19 = current.scope_unlink;
  $kokaine_reactive_internal_model.store(_x19, $std_core_types.Nothing);
   
  if (unlink === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _pat_1_1_0 = unlink.value();
    $std_core_types.Unit;
  }
  var _x18 = current.scope_lifetime.lifetime_token;
  var _x17 = $kokaine_reactive_internal_model.load(_x18);
  if (_x17 === 4) {
    return $std_core_types.Nil;
  }
  else {
     
    var _x19 = current.scope_lifetime.lifetime_token;
    $kokaine_reactive_internal_model.store(_x19, $kokaine_reactive_internal_model.Scope_dead);
     
    var _x20 = current.scope_body;
    var body = $kokaine_reactive_internal_model.load(_x20);
     
    var _x21 = current.scope_body;
    $kokaine_reactive_internal_model.store(_x21, $kokaine_reactive_internal_model.Trace_end);
    return $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
        return trace_retirement_expand(body);
      }), $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
           
          var _x19 = current.scope_lifetime.lifetime_token;
          $kokaine_reactive_internal_model.store(_x19, $kokaine_reactive_internal_model.Scope_dead);
           
          var _x21 = current.scope_lifetime.lifetime_children;
          var _x20 = $kokaine_internal_registry.registry_fs_seal_detach(_x21);
          var children = (_x20 === null) ? $std_core_types.Nil : _x20.value;
           
          var _x23 = current.scope_lifetime.lifetime_finalizers;
          var _x22 = $kokaine_internal_registry.registry_fs_seal_detach(_x23);
          var finalizers = (_x22 === null) ? $std_core_types.Nil : _x22.value;
          return reverse_onto($std_core_list.reverse_acc($std_core_types.Nil, children), finalizers);
        }), $std_core_types.Nil));
  }
}
 
export function scope_retirement_work(current) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>) -> kokaine/reactive/internal/model/retirement-work<e> */  {
  return $kokaine_reactive_internal_model.Retirement_step(function() {
    return scope_retirement_expand(current);
  });
}
 
export function collect_retirement_loop(pending, collected) /* forall<e> (pending : list<kokaine/reactive/internal/model/retirement-work<e>>, collected : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (pending === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected);
  }
  else {
    if (pending.head._tag === 2) {
      {
        // tail call
        var _x19 = $std_core_types.Cons(pending.head, collected);
        pending = pending.tail;
        collected = _x19;
        continue tailcall;
      }
    }
    else {
       
      var values_10049 = pending.head.retirement_expand();
      {
        // tail call
        var _x20 = reverse_onto($std_core_list.reverse_acc($std_core_types.Nil, values_10049), pending.tail);
        pending = _x20;
        continue tailcall;
      }
    }
  }
}}
 
export function collect_retirement_work(values) /* forall<e> (values : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  {
  return collect_retirement_loop(values, $std_core_types.Nil);
}
 
export function collect_scope(current) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>) -> div list<retirement<e>> */  {
  return collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
        return scope_retirement_expand(current);
      }), $std_core_types.Nil), $std_core_types.Nil);
}
 
export function collect_lifetime(owner) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>) -> div list<retirement<e>> */  {
  return collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
        return lifetime_retirement_expand(owner);
      }), $std_core_types.Nil), $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_run_finalizers_loop_10281(coordinator, latest, _y_x10093) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, latest : maybe<exception>, list<retirement<e>>) -> <div,exn|e> () */  {
  return run_finalizers_loop(coordinator, _y_x10093, latest);
}
 
 
// monadic lift
export function _mlift_run_finalizers_loop_10282(completed, result) /* forall<e> (completed : ref<global,bool>, result : error<()>) -> <div|e> error<()> */  {
   
  $kokaine_reactive_internal_model.store(completed, true);
  return result;
}
 
 
// monadic lift
export function _mlift_run_finalizers_loop_10283(completed_0, finalize, _y_x10097) /* forall<e> (completed : ref<global,bool>, finalize : () -> <div,exn|e> (), hnd/ev-index) -> <exn,div|e> error<()> */  {
  return $std_core_hnd._mask_at(_y_x10097, false, function() {
       
      var x_10296 = $kokaine_internal_compat.capture_error(finalize);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(result_0 /* error<()> */ ) {
          return _mlift_run_finalizers_loop_10282(completed_0, result_0);
        });
      }
      else {
        return _mlift_run_finalizers_loop_10282(completed_0, x_10296);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_finalizers_loop_10284(coordinator_0, latest_0, rest, attempted) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, latest : maybe<exception>, rest : list<retirement<e>>, attempted : error<()>) -> <div,exn|e> () */  {
  if (attempted._tag === 2 && attempted.value === 1) {
    return run_finalizers_loop(coordinator_0, rest, latest_0);
  }
  else {
    return run_finalizers_loop(coordinator_0, rest, $std_core_types.Just(attempted.error));
  }
}
 
export function run_finalizers_loop(coordinator_1, finalizers, latest_1) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, finalizers : list<retirement<e>>, latest : maybe<exception>) -> <pure|e> () */  { tailcall: while(1)
{
  if (finalizers === null) {
    if (latest_1 === null) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(exn /* exception */ ) {
           
          var ev_10298 = $std_core_hnd._evv_at(0);
          var _x21 = $std_core_exn.throw_exn_fs__select(ev_10298.hnd);
          return _x21(ev_10298.marker, ev_10298, exn);
        }, latest_1.value);
    }
  }
  else {
    if (finalizers.head._tag === 1) {
       
      var x_1_10301 = $std_core_hnd._open_none1(function(values /* list<kokaine/reactive/internal/model/retirement-work<2154>> */ ) {
          return collect_retirement_loop(values, $std_core_types.Nil);
        }, $std_core_types.Cons(finalizers.head, finalizers.tail));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10093_0 /* list<retirement<2154>> */ ) {
          return _mlift_run_finalizers_loop_10281(coordinator_1, latest_1, _y_x10093_0);
        });
      }
      else {
        {
          // tail call
          finalizers = x_1_10301;
          continue tailcall;
        }
      }
    }
    else {
       
      var completed_1 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false);
       
      var x_3_10309 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
       
      if ($std_core_hnd._yielding()) {
        var _x23 = $std_core_hnd.yield_extend(function(_y_x10097_0 /* hnd/ev-index */ ) {
          return _mlift_run_finalizers_loop_10283(completed_1, finalizers.head.retirement_action, _y_x10097_0);
        });
      }
      else {
        var _x23 = _mlift_run_finalizers_loop_10283(completed_1, finalizers.head.retirement_action, x_3_10309);
      }
      var x_2_10304 = $std_core_hnd.finally_prompt(function() {
          var _x22 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, completed_1);
          if (_x22) {
            return $std_core_types.Unit;
          }
          else {
            return run_finalizers_loop(coordinator_1, finalizers.tail, $std_core_types.Nothing);
          }
        }, _x23);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(attempted_0 /* error<()> */ ) {
          return _mlift_run_finalizers_loop_10284(coordinator_1, latest_1, finalizers.tail, attempted_0);
        });
      }
      else {
        if (x_2_10304._tag === 2 && x_2_10304.value === 1) {
          {
            // tail call
            finalizers = finalizers.tail;
            continue tailcall;
          }
        }
        else {
          {
            // tail call
            var _x22 = $std_core_types.Just(x_2_10304.error);
            finalizers = finalizers.tail;
            latest_1 = _x22;
            continue tailcall;
          }
        }
      }
    }
  }
}}
 
export function retirement_coordinator_fs_leave(coordinator) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>) -> <div,exn|e> () */  {
   
  var _x_x1_0_10223 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2327> */ ) {
      return _this.retirement_depth;
    }, coordinator);
   
  var x_10161 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10223);
   
  var _x_x2_10226 = $std_core_types._int_sub(x_10161,1);
   
  var next = $std_core_hnd._open_none2(function(i /* int */ , j /* int */ ) {
      return ($std_core_types._int_ge(i,j)) ? i : j;
    }, 0, _x_x2_10226);
   
  var _x_x1_2_10227 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/retirement-coordinator<2327> */ ) {
      return _this_0.retirement_depth;
    }, coordinator);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_2_10227, next);
  if ($std_core_types._int_gt(next,0)) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_5_10231 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/retirement-coordinator<2327> */ ) {
        return _this_1.retirement_disposal_requested;
      }, coordinator);
     
    var _x_x1_4_10230 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_5_10231);
    var _x23 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_4_10230);
    if (_x23) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_7_10233 = $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/retirement-coordinator<2327> */ ) {
          return _this_2.retirement_disposal_requested;
        }, coordinator);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_7_10233, false);
       
      var _x_x1_9_10236 = $std_core_hnd._open_none1(function(_this_3 /* kokaine/reactive/internal/model/retirement-coordinator<2327> */ ) {
          return _this_3.retirement_dispose_root;
        }, coordinator);
      var _x24 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_9_10236);
      if (_x24 === null) {
        return $std_core_types.Unit;
      }
      else {
        return _x24.value();
      }
    }
  }
}
 
export function run_finalizers(coordinator, finalizers) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_1_10238 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/retirement-coordinator<2398> */ ) {
      return _this_0.retirement_depth;
    }, coordinator);
   
  var x_10176 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238);
   
  var _x_x1_10240 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2398> */ ) {
      return _this.retirement_depth;
    }, coordinator);
   
  var _x_x2_10241 = $std_core_types._int_add(x_10176,1);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240, _x_x2_10241);
  return $std_core_hnd.finally_prompt(function() {
      return retirement_coordinator_fs_leave(coordinator);
    }, run_finalizers_loop(coordinator, finalizers, $std_core_types.Nothing));
}
 
export function trace_retirement_coordinator(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> maybe<kokaine/reactive/internal/model/retirement-coordinator<e>> */  {
  if (current === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    var frame_0_10059 = $kokaine_reactive_internal_model.load(current.trace_frame);
    var _x25 = frame_0_10059.lifetime_retirement;
    return $std_core_types.Just(_x25);
  }
}
 
export function traces_retirement_coordinator(values) /* forall<e> (values : list<kokaine/reactive/internal/model/trace<e>>) -> maybe<kokaine/reactive/internal/model/retirement-coordinator<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Nothing;
  }
  else {
    if (values.head === null) {
      var _x26 = $std_core_types.Nothing;
      if (_x26 === null) {
        {
          // tail call
          values = values.tail;
          continue tailcall;
        }
      }
      else {
        return _x26;
      }
    }
    else {
       
      var frame_0_10059 = $kokaine_reactive_internal_model.load(values.head.trace_frame);
      var _x27 = frame_0_10059.lifetime_retirement;
      return $std_core_types.Just(_x27);
    }
  }
}}
 
 
// monadic lift
export function _mlift_retire_lifetime_10285(owner, finalizers) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
   
  var coordinator_10358 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2541> */ ) {
      return _this_1.lifetime_retirement;
    }, owner);
   
  var _x_x1_1_10238 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/retirement-coordinator<2541> */ ) {
      return _this_0.retirement_depth;
    }, coordinator_10358);
   
  var x_10176 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238);
   
  var _x_x1_10240 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2541> */ ) {
      return _this.retirement_depth;
    }, coordinator_10358);
   
  var _x_x2_10241 = $std_core_types._int_add(x_10176,1);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240, _x_x2_10241);
  return $std_core_hnd.finally_prompt(function() {
      return retirement_coordinator_fs_leave(coordinator_10358);
    }, run_finalizers_loop(coordinator_10358, finalizers, $std_core_types.Nothing));
}
 
export function retire_lifetime(owner) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>) -> <div,exn|e> () */  {
   
  var x_10313 = $std_core_hnd._open_none1(function(owner_0 /* kokaine/reactive/internal/model/lifetime-owner<2541> */ ) {
      return collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return lifetime_retirement_expand(owner_0);
          }), $std_core_types.Nil), $std_core_types.Nil);
    }, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<retirement<2541>> */ ) {
       
      var coordinator_10360 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2541> */ ) {
          return _this_1.lifetime_retirement;
        }, owner);
       
      var _x_x1_1_10238 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/retirement-coordinator<2541> */ ) {
          return _this_0.retirement_depth;
        }, coordinator_10360);
       
      var x_10176 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238);
       
      var _x_x1_10240 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2541> */ ) {
          return _this.retirement_depth;
        }, coordinator_10360);
       
      var _x_x2_10241 = $std_core_types._int_add(x_10176,1);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240, _x_x2_10241);
      return $std_core_hnd.finally_prompt(function() {
          return retirement_coordinator_fs_leave(coordinator_10360);
        }, run_finalizers_loop(coordinator_10360, finalizers, $std_core_types.Nothing));
    });
  }
  else {
     
    var coordinator_0_10362 = $std_core_hnd._open_none1(function(_this_0_1 /* kokaine/reactive/internal/model/lifetime-owner<2541> */ ) {
        return _this_0_1.lifetime_retirement;
      }, owner);
     
    var _x_x1_1_10238_0 = $std_core_hnd._open_none1(function(_this_0_0 /* kokaine/reactive/internal/model/retirement-coordinator<2541> */ ) {
        return _this_0_0.retirement_depth;
      }, coordinator_0_10362);
     
    var x_10176_0 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238_0);
     
    var _x_x1_10240_0 = $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/retirement-coordinator<2541> */ ) {
        return _this_2.retirement_depth;
      }, coordinator_0_10362);
     
    var _x_x2_10241_0 = $std_core_types._int_add(x_10176_0,1);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240_0, _x_x2_10241_0);
    return $std_core_hnd.finally_prompt(function() {
        return retirement_coordinator_fs_leave(coordinator_0_10362);
      }, run_finalizers_loop(coordinator_0_10362, x_10313, $std_core_types.Nothing));
  }
}
 
 
// monadic lift
export function _mlift_retire_scope_10286(current, finalizers) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_0_10246 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<2589> */ ) {
      return _this_0.scope_lifetime;
    }, current);
   
  var coordinator_10364 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2589> */ ) {
      return _this_1.lifetime_retirement;
    }, _x_x1_0_10246);
   
  var _x_x1_1_10238 = $std_core_hnd._open_none1(function(_this_0_0 /* kokaine/reactive/internal/model/retirement-coordinator<2589> */ ) {
      return _this_0_0.retirement_depth;
    }, coordinator_10364);
   
  var x_10176 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238);
   
  var _x_x1_10240 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2589> */ ) {
      return _this.retirement_depth;
    }, coordinator_10364);
   
  var _x_x2_10241 = $std_core_types._int_add(x_10176,1);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240, _x_x2_10241);
  return $std_core_hnd.finally_prompt(function() {
      return retirement_coordinator_fs_leave(coordinator_10364);
    }, run_finalizers_loop(coordinator_10364, finalizers, $std_core_types.Nothing));
}
 
export function retire_scope(current) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>) -> <div,exn|e> () */  {
   
  var x_10318 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<2589> */ ) {
      return collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return scope_retirement_expand(current_0);
          }), $std_core_types.Nil), $std_core_types.Nil);
    }, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<retirement<2589>> */ ) {
       
      var _x_x1_0_10246 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<2589> */ ) {
          return _this_0.scope_lifetime;
        }, current);
       
      var coordinator_10366 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2589> */ ) {
          return _this_1.lifetime_retirement;
        }, _x_x1_0_10246);
       
      var _x_x1_1_10238 = $std_core_hnd._open_none1(function(_this_0_0 /* kokaine/reactive/internal/model/retirement-coordinator<2589> */ ) {
          return _this_0_0.retirement_depth;
        }, coordinator_10366);
       
      var x_10176 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238);
       
      var _x_x1_10240 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2589> */ ) {
          return _this.retirement_depth;
        }, coordinator_10366);
       
      var _x_x2_10241 = $std_core_types._int_add(x_10176,1);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240, _x_x2_10241);
      return $std_core_hnd.finally_prompt(function() {
          return retirement_coordinator_fs_leave(coordinator_10366);
        }, run_finalizers_loop(coordinator_10366, finalizers, $std_core_types.Nothing));
    });
  }
  else {
     
    var _x_x1_0_10246_0 = $std_core_hnd._open_none1(function(_this_0_0_0 /* kokaine/reactive/internal/model/continuation-scope<2589> */ ) {
        return _this_0_0_0.scope_lifetime;
      }, current);
     
    var coordinator_0_10368 = $std_core_hnd._open_none1(function(_this_1_0 /* kokaine/reactive/internal/model/lifetime-owner<2589> */ ) {
        return _this_1_0.lifetime_retirement;
      }, _x_x1_0_10246_0);
     
    var _x_x1_1_10238_0 = $std_core_hnd._open_none1(function(_this_0_1 /* kokaine/reactive/internal/model/retirement-coordinator<2589> */ ) {
        return _this_0_1.retirement_depth;
      }, coordinator_0_10368);
     
    var x_10176_0 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238_0);
     
    var _x_x1_10240_0 = $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/retirement-coordinator<2589> */ ) {
        return _this_2.retirement_depth;
      }, coordinator_0_10368);
     
    var _x_x2_10241_0 = $std_core_types._int_add(x_10176_0,1);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240_0, _x_x2_10241_0);
    return $std_core_hnd.finally_prompt(function() {
        return retirement_coordinator_fs_leave(coordinator_0_10368);
      }, run_finalizers_loop(coordinator_0_10368, x_10318, $std_core_types.Nothing));
  }
}
 
export function draft_work_list(values, collected) /* forall<e> (values : list<kokaine/reactive/internal/model/trace<e>>, collected : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected);
  }
  else {
    {
      // tail call
      var _x29 = function(_current28 /* kokaine/reactive/internal/model/trace<2642> */ ) {
        return $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return trace_retirement_expand(_current28);
          }), collected);
      }(values.head);
      values = values.tail;
      collected = _x29;
      continue tailcall;
    }
  }
}}
 
export function collect_scope_drafts(current, values) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, values : list<kokaine/reactive/internal/model/trace<e>>) -> div list<retirement<e>> */  {
   
  var work = draft_work_list(values, $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
        return scope_retirement_expand(current);
      }), $std_core_types.Nil));
  return collect_retirement_loop(work, $std_core_types.Nil);
}
 
export function collect_lifetime_drafts(owner, values) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, values : list<kokaine/reactive/internal/model/trace<e>>) -> div list<retirement<e>> */  {
   
  var work = draft_work_list(values, $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
        return lifetime_retirement_expand(owner);
      }), $std_core_types.Nil));
  return collect_retirement_loop(work, $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_retire_scope_drafts_10287(current, finalizers) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_0_10250 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<2784> */ ) {
      return _this_0.scope_lifetime;
    }, current);
   
  var coordinator_10370 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2784> */ ) {
      return _this_1.lifetime_retirement;
    }, _x_x1_0_10250);
   
  var _x_x1_1_10238 = $std_core_hnd._open_none1(function(_this_0_0 /* kokaine/reactive/internal/model/retirement-coordinator<2784> */ ) {
      return _this_0_0.retirement_depth;
    }, coordinator_10370);
   
  var x_10176 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238);
   
  var _x_x1_10240 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2784> */ ) {
      return _this.retirement_depth;
    }, coordinator_10370);
   
  var _x_x2_10241 = $std_core_types._int_add(x_10176,1);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240, _x_x2_10241);
  return $std_core_hnd.finally_prompt(function() {
      return retirement_coordinator_fs_leave(coordinator_10370);
    }, run_finalizers_loop(coordinator_10370, finalizers, $std_core_types.Nothing));
}
 
export function retire_scope_drafts(current, values) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, values : list<kokaine/reactive/internal/model/trace<e>>) -> <div,exn|e> () */  {
   
  var x_10324 = $std_core_hnd._open_none2(collect_scope_drafts, current, values);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<retirement<2784>> */ ) {
       
      var _x_x1_0_10250 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<2784> */ ) {
          return _this_0.scope_lifetime;
        }, current);
       
      var coordinator_10372 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2784> */ ) {
          return _this_1.lifetime_retirement;
        }, _x_x1_0_10250);
       
      var _x_x1_1_10238 = $std_core_hnd._open_none1(function(_this_0_0 /* kokaine/reactive/internal/model/retirement-coordinator<2784> */ ) {
          return _this_0_0.retirement_depth;
        }, coordinator_10372);
       
      var x_10176 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238);
       
      var _x_x1_10240 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2784> */ ) {
          return _this.retirement_depth;
        }, coordinator_10372);
       
      var _x_x2_10241 = $std_core_types._int_add(x_10176,1);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240, _x_x2_10241);
      return $std_core_hnd.finally_prompt(function() {
          return retirement_coordinator_fs_leave(coordinator_10372);
        }, run_finalizers_loop(coordinator_10372, finalizers, $std_core_types.Nothing));
    });
  }
  else {
     
    var _x_x1_0_10250_0 = $std_core_hnd._open_none1(function(_this_0_0_0 /* kokaine/reactive/internal/model/continuation-scope<2784> */ ) {
        return _this_0_0_0.scope_lifetime;
      }, current);
     
    var coordinator_0_10374 = $std_core_hnd._open_none1(function(_this_1_0 /* kokaine/reactive/internal/model/lifetime-owner<2784> */ ) {
        return _this_1_0.lifetime_retirement;
      }, _x_x1_0_10250_0);
     
    var _x_x1_1_10238_0 = $std_core_hnd._open_none1(function(_this_0_1 /* kokaine/reactive/internal/model/retirement-coordinator<2784> */ ) {
        return _this_0_1.retirement_depth;
      }, coordinator_0_10374);
     
    var x_10176_0 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238_0);
     
    var _x_x1_10240_0 = $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/retirement-coordinator<2784> */ ) {
        return _this_2.retirement_depth;
      }, coordinator_0_10374);
     
    var _x_x2_10241_0 = $std_core_types._int_add(x_10176_0,1);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240_0, _x_x2_10241_0);
    return $std_core_hnd.finally_prompt(function() {
        return retirement_coordinator_fs_leave(coordinator_0_10374);
      }, run_finalizers_loop(coordinator_0_10374, x_10324, $std_core_types.Nothing));
  }
}
 
 
// monadic lift
export function _mlift_retire_lifetime_drafts_10288(owner, finalizers) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
   
  var coordinator_10376 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2826> */ ) {
      return _this_1.lifetime_retirement;
    }, owner);
   
  var _x_x1_1_10238 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/retirement-coordinator<2826> */ ) {
      return _this_0.retirement_depth;
    }, coordinator_10376);
   
  var x_10176 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238);
   
  var _x_x1_10240 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2826> */ ) {
      return _this.retirement_depth;
    }, coordinator_10376);
   
  var _x_x2_10241 = $std_core_types._int_add(x_10176,1);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240, _x_x2_10241);
  return $std_core_hnd.finally_prompt(function() {
      return retirement_coordinator_fs_leave(coordinator_10376);
    }, run_finalizers_loop(coordinator_10376, finalizers, $std_core_types.Nothing));
}
 
export function retire_lifetime_drafts(owner, values) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, values : list<kokaine/reactive/internal/model/trace<e>>) -> <div,exn|e> () */  {
   
  var x_10329 = $std_core_hnd._open_none2(collect_lifetime_drafts, owner, values);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<retirement<2826>> */ ) {
       
      var coordinator_10378 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2826> */ ) {
          return _this_1.lifetime_retirement;
        }, owner);
       
      var _x_x1_1_10238 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/retirement-coordinator<2826> */ ) {
          return _this_0.retirement_depth;
        }, coordinator_10378);
       
      var x_10176 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238);
       
      var _x_x1_10240 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2826> */ ) {
          return _this.retirement_depth;
        }, coordinator_10378);
       
      var _x_x2_10241 = $std_core_types._int_add(x_10176,1);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240, _x_x2_10241);
      return $std_core_hnd.finally_prompt(function() {
          return retirement_coordinator_fs_leave(coordinator_10378);
        }, run_finalizers_loop(coordinator_10378, finalizers, $std_core_types.Nothing));
    });
  }
  else {
     
    var coordinator_0_10380 = $std_core_hnd._open_none1(function(_this_0_1 /* kokaine/reactive/internal/model/lifetime-owner<2826> */ ) {
        return _this_0_1.lifetime_retirement;
      }, owner);
     
    var _x_x1_1_10238_0 = $std_core_hnd._open_none1(function(_this_0_0 /* kokaine/reactive/internal/model/retirement-coordinator<2826> */ ) {
        return _this_0_0.retirement_depth;
      }, coordinator_0_10380);
     
    var x_10176_0 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10238_0);
     
    var _x_x1_10240_0 = $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/retirement-coordinator<2826> */ ) {
        return _this_2.retirement_depth;
      }, coordinator_0_10380);
     
    var _x_x2_10241_0 = $std_core_types._int_add(x_10176_0,1);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10240_0, _x_x2_10241_0);
    return $std_core_hnd.finally_prompt(function() {
        return retirement_coordinator_fs_leave(coordinator_0_10380);
      }, run_finalizers_loop(coordinator_0_10380, x_10329, $std_core_types.Nothing));
  }
}
 
 
// monadic lift
export function _mlift_retire_drafts_10289(coordinator, finalizers) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, finalizers : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
  return run_finalizers(coordinator, finalizers);
}
 
 
// monadic lift
export function _mlift_retire_drafts_10290(coordinator, work) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, work : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_10334 = $std_core_hnd._open_none1(function(values_0 /* list<kokaine/reactive/internal/model/retirement-work<2890>> */ ) {
      return collect_retirement_loop(values_0, $std_core_types.Nil);
    }, work);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<kokaine/reactive/internal/model/retirement-work<2890>> */ ) {
      return run_finalizers(coordinator, finalizers);
    });
  }
  else {
    return run_finalizers(coordinator, x_10334);
  }
}
 
export function retire_drafts(values) /* forall<e> (values : list<kokaine/reactive/internal/model/trace<e>>) -> <div,exn|e> () */  {
  var _x30 = $std_core_hnd._open_none1(traces_retirement_coordinator, values);
  if (_x30 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var x_10338 = $std_core_hnd._open_none2(draft_work_list, values, $std_core_types.Nil);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(work /* list<kokaine/reactive/internal/model/retirement-work<2890>> */ ) {
        return _mlift_retire_drafts_10290(_x30.value, work);
      });
    }
    else {
       
      var x_0_10341 = $std_core_hnd._open_none1(function(values_0 /* list<kokaine/reactive/internal/model/retirement-work<2890>> */ ) {
          return collect_retirement_loop(values_0, $std_core_types.Nil);
        }, x_10338);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(finalizers /* list<kokaine/reactive/internal/model/retirement-work<2890>> */ ) {
          return run_finalizers(_x30.value, finalizers);
        });
      }
      else {
        return run_finalizers(_x30.value, x_0_10341);
      }
    }
  }
}
 
export function retire_drafts_now(values) /* forall<e> (values : list<kokaine/reactive/internal/model/trace<e>>) -> <exn|e> () */  {
  return retire_drafts(values);
}
 
export function try_retire_scope_drafts(current, values) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, values : list<kokaine/reactive/internal/model/trace<e>>) -> e error<()> */  {
  return $kokaine_internal_compat.capture_error(function() {
    return retire_scope_drafts(current, values);
  });
}
 
export function try_retire_lifetime_drafts(owner, values) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, values : list<kokaine/reactive/internal/model/trace<e>>) -> e error<()> */  {
  return $kokaine_internal_compat.capture_error(function() {
    return retire_lifetime_drafts(owner, values);
  });
}
 
export function record_draft(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> exn () */  {
   
  var _x_x1_10259 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3058> */ ) {
      return plane_0.plane_draft;
    }, plane);
  var _x31 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_10259);
  if (_x31 === null) {
    return $std_core_exn.$throw("continuation node created outside a draft transaction");
  }
  else {
     
    var _x_x2_10262 = $std_core_types.Cons(current, $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x31.value));
    return $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x31.value, _x_x2_10262);
  }
}
 
export function attempt_build(plane, drafts, action) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e>>>, action : () -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e>) -> <div|e> error<kokaine/reactive/internal/model/built-trace<e>> */  {
   
  var _x32 = plane.plane_draft;
  var previous = $kokaine_reactive_internal_model.load(_x32);
   
  var _x33 = plane.plane_draft;
  $kokaine_reactive_internal_model.store(_x33, $std_core_types.Just(drafts));
  return $std_core_hnd.finally_prompt(function() {
      var _x32 = plane.plane_draft;
      return $kokaine_reactive_internal_model.store(_x32, previous);
    }, $kokaine_internal_compat.capture_error(action));
}
 
export function with_context(plane, current, current_frame, action) /* forall<a,e,e1> (plane : kokaine/reactive/internal/model/plane<e1>, current : maybe<kokaine/reactive/internal/model/continuation-gate>, current-frame : kokaine/reactive/internal/model/frame<e1>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
   
  var _x_x1_10264 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3272> */ ) {
      return plane_0.plane_current;
    }, plane);
   
  var previous_current = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_10264);
   
  var _x_x1_1_10266 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<3272> */ ) {
      return plane_1.plane_current_frame;
    }, plane);
   
  var previous_frame = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10266);
   
  var _x_x1_7_10274 = $std_core_hnd._open_none1(function(plane_4 /* kokaine/reactive/internal/model/plane<3272> */ ) {
      return plane_4.plane_current;
    }, plane);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_7_10274, current);
   
  var _x_x1_9_10277 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<3272> */ ) {
      return plane_5.plane_current_frame;
    }, plane);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_9_10277, current_frame);
  return $std_core_hnd.finally_prompt(function() {
       
      var _x_x1_3_10268 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<3272> */ ) {
          return plane_2.plane_current_frame;
        }, plane);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_3_10268, previous_frame);
       
      var _x_x1_5_10271 = $std_core_hnd._open_none1(function(plane_3 /* kokaine/reactive/internal/model/plane<3272> */ ) {
          return plane_3.plane_current;
        }, plane);
      return $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_5_10271, previous_current);
    }, action());
}
 
export function with_current(plane, current, current_frame, action) /* forall<a,e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>, current-frame : kokaine/reactive/internal/model/frame<e>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
  var _x33 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/trace<3350> */ ) {
      if (current_0 === null) {
        return $std_core_types.Nothing;
      }
      else {
        return $std_core_types.Just(current_0.trace_gate);
      }
    }, current);
  if (_x33 === null) {
    return with_context(plane, $std_core_types.Nothing, current_frame, action);
  }
  else {
    return with_context(plane, $std_core_types.Just(_x33.value), current_frame, action);
  }
}