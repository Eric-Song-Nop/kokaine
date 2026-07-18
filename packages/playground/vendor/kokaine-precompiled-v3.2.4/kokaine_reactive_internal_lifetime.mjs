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
import * as $kokaine_reactive_internal_resource from './kokaine_reactive_internal_resource.mjs';
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
 
// externals
 
// type declarations
 
// declarations
 
export function trace_state_of(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> kokaine/reactive/internal/model/capture-state */  {
  if (current._tag === 1) {
    return $kokaine_reactive_internal_model.Capture_dead;
  }
  else if (current._tag === 2) {
    var _x0 = current.trace_gate.gate_state;
    return _x0.value;
  }
  else {
    var _x1 = current.entry_gate.gate_state;
    return _x1.value;
  }
}
 
export function trace_gate_of(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> maybe<kokaine/reactive/internal/model/continuation-gate> */  {
  if (current._tag === 1) {
    return $std_core_types.Nothing;
  }
  else if (current._tag === 2) {
    return $std_core_types.Just(current.trace_gate);
  }
  else {
    return $std_core_types.Just(current.entry_gate);
  }
}
 
export function trace_parent_of(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> maybe<kokaine/reactive/internal/model/continuation-gate> */  {
  if (current._tag === 1) {
    var _x2 = $std_core_types.Nothing;
  }
  else if (current._tag === 2) {
    var _x2 = $std_core_types.Just(current.trace_gate);
  }
  else {
    var _x2 = $std_core_types.Just(current.entry_gate);
  }
  if (_x2 === null) {
    return $std_core_types.Nothing;
  }
  else {
    return _x2.value.gate_parent;
  }
}
 
export function new_retirement_coordinator() /* forall<e> () -> kokaine/reactive/internal/model/retirement-coordinator<e> */  {
  return $kokaine_reactive_internal_model.Retirement_coordinator({ value: 0 }, { value: false }, { value: ($std_core_types.Nothing) });
}
 
export function retirement_coordinator_fs_install_root_disposal(coordinator, dispose) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, dispose : () -> <div,exn|e> ()) -> () */  {
  var _x3 = coordinator.retirement_dispose_root;
  return ((_x3).value = ($std_core_types.Just(dispose)));
}
 
export function retirement_coordinator_fs_request_root_disposal(coordinator) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>) -> bool */  {
  var _x5 = coordinator.retirement_depth;
  var _x4 = $std_core_types._int_le((_x5.value),0);
  if (_x4) {
    return false;
  }
  else {
     
    var _x6 = coordinator.retirement_disposal_requested;
    ((_x6).value = true);
    return true;
  }
}
 
export function new_lifetime_owner(state, coordinator) /* forall<e> (state : kokaine/reactive/internal/model/scope-state, coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>) -> kokaine/reactive/internal/model/lifetime-owner<e> */  {
  return $kokaine_reactive_internal_model.Lifetime_owner({ value: state }, $kokaine_internal_registry.new_registry(), $kokaine_internal_registry.new_registry(), coordinator);
}
 
export function lifetime_owner_fs_register_child(owner, work) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, work : kokaine/reactive/internal/model/retirement-work<e>) -> exn kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>> */  {
   
  var target_10018 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<750> */ ) {
      return _this.lifetime_children;
    }, owner);
  var _x6 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_10018, work);
  if (_x6 === null) {
    return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
  }
  else {
    return _x6.value;
  }
}
 
export function lifetime_owner_fs_register_finalizer(owner, work) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, work : kokaine/reactive/internal/model/retirement-work<e>) -> exn kokaine/internal/registry/registry-registration<kokaine/reactive/internal/model/retirement-work<e>> */  {
   
  var target_10020 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<778> */ ) {
      return _this.lifetime_finalizers;
    }, owner);
  var _x7 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_10020, work);
  if (_x7 === null) {
    return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
  }
  else {
    return _x7.value;
  }
}
 
export function unlink_scope_owner(current) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>) -> () */  {
   
  var _x8 = current.scope_unlink;
  var unlink = _x8.value;
   
  var _x9 = current.scope_unlink;
  ((_x9).value = ($std_core_types.Nothing));
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
      var _x8 = $std_core_types.Cons(values.head, target);
      values = values.tail;
      target = _x8;
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
      var _x9 = $std_core_types.Cons(widen_pure_retirement(values.head), collected);
      values = values.tail;
      collected = _x9;
      continue tailcall;
    }
  }
}}
 
export function lifetime_retirement_expand(owner) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  {
   
  var _x10 = owner.lifetime_token;
  ((_x10).value = ($kokaine_reactive_internal_model.Scope_dead));
   
  var _x12 = owner.lifetime_children;
  var _x11 = $kokaine_internal_registry.registry_fs_seal_detach(_x12);
  var children = (_x11 === null) ? $std_core_types.Nil : _x11.value;
   
  var _x14 = owner.lifetime_finalizers;
  var _x13 = $kokaine_internal_registry.registry_fs_seal_detach(_x14);
  var finalizers = (_x13 === null) ? $std_core_types.Nil : _x13.value;
  return reverse_onto($std_core_list.reverse_acc($std_core_types.Nil, children), finalizers);
}
 
export function lifetime_retirement_work(owner) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>) -> kokaine/reactive/internal/model/retirement-work<e> */  {
  return $kokaine_reactive_internal_model.Retirement_step(function() {
    return lifetime_retirement_expand(owner);
  });
}
 
export function trace_retirement_expand(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  {
  if (current._tag === 1) {
    return $std_core_types.Nil;
  }
  else if (current._tag === 2) {
    var _x11 = current.trace_gate.gate_state;
    var _x10 = _x11.value;
    if (_x10 === 5) {
      return $std_core_types.Nil;
    }
    else {
       
      var current_frame = (current.trace_frame).value;
       
      var _x12 = current.trace_gate.gate_state;
      ((_x12).value = ($kokaine_reactive_internal_model.Capture_dead));
       
      var _x13 = current_frame.lifetime_token;
      ((_x13).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
       
      current.trace_unlink();
       
      var nested = (current.trace_child).value;
       
      (((current.trace_child)).value = ($kokaine_reactive_internal_model.Trace_end));
      return $std_core_types.Cons(trace_retirement_work(nested), $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            var _x12 = current_frame;
            return lifetime_retirement_expand(_x12);
          }), $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_finalizer(current.trace_finalize), $std_core_types.Nil)));
    }
  }
  else {
    var _x14 = current.entry_gate.gate_state;
    var _x13 = _x14.value;
    if (_x13 === 5) {
      return $std_core_types.Nil;
    }
    else {
       
      var current_frame_0 = (current.entry_frame).value;
       
      var _x15 = current.entry_gate.gate_state;
      ((_x15).value = ($kokaine_reactive_internal_model.Capture_dead));
       
      var _x16 = current_frame_0.lifetime_token;
      ((_x16).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
       
      var nested_0 = (current.entry_child).value;
       
      (((current.entry_child)).value = ($kokaine_reactive_internal_model.Trace_end));
      return $std_core_types.Cons(trace_retirement_work(nested_0), $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            var _x15 = current_frame_0;
            return lifetime_retirement_expand(_x15);
          }), $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_finalizer(current.entry_finalize), $std_core_types.Nil)));
    }
  }
}
 
export function trace_retirement_work(current_0) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> div kokaine/reactive/internal/model/retirement-work<e> */  {
  return $kokaine_reactive_internal_model.Retirement_step(function() {
    return trace_retirement_expand(current_0);
  });
}
 
export function scope_retirement_expand(current) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  {
   
  var _x16 = current.scope_bootstrap_slot;
  ((_x16).value = ($std_core_types.Nothing));
   
  unlink_scope_owner(current);
  var _x17 = current.scope_lifetime.lifetime_token;
  var _x16 = _x17.value;
  if (_x16 === 4) {
    return $std_core_types.Nil;
  }
  else {
     
    var _x18 = current.scope_lifetime.lifetime_token;
    ((_x18).value = ($kokaine_reactive_internal_model.Scope_dead));
     
    var _x19 = current.scope_body;
    var body = _x19.value;
     
    var _x20 = current.scope_body;
    ((_x20).value = ($kokaine_reactive_internal_model.Trace_end));
    return $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
        return trace_retirement_expand(body);
      }), $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
          var _x18 = current.scope_lifetime;
          return lifetime_retirement_expand(_x18);
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
       
      var values_10088 = pending.head.retirement_expand();
      {
        // tail call
        var _x20 = reverse_onto($std_core_list.reverse_acc($std_core_types.Nil, values_10088), pending.tail);
        pending = _x20;
        continue tailcall;
      }
    }
  }
}}
 
export function collect_retirement_work(values) /* forall<e> (values : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  {
  return collect_retirement_loop(values, $std_core_types.Nil);
}
 
export function collect_retirement(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> div list<retirement<e>> */  {
  return collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
        return trace_retirement_expand(current);
      }), $std_core_types.Nil), $std_core_types.Nil);
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
export function _mlift_run_finalizers_loop_10349(coordinator, latest, _y_x10143) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, latest : maybe<exception>, list<retirement<e>>) -> <div,exn|e> () */  {
  return run_finalizers_loop(coordinator, _y_x10143, latest);
}
 
 
// monadic lift
export function _mlift_run_finalizers_loop_10350(completed, result) /* forall<_e,e1> (completed : ref<global,bool>, result : error<()>) -> <div|e1> error<()> */  {
   
  ((completed).value = true);
  return result;
}
 
 
// monadic lift
export function _mlift_run_finalizers_loop_10351(completed_0, finalize, _y_x10147) /* forall<_e,e1> (completed : ref<global,bool>, finalize : () -> <div,exn|e1> (), hnd/ev-index) -> <exn,div|e1> error<()> */  {
  return $std_core_hnd._mask_at(_y_x10147, false, function() {
       
      var x_10364 = $kokaine_internal_compat.capture_error(finalize);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(result_0 /* error<()> */ ) {
          return _mlift_run_finalizers_loop_10350(completed_0, result_0);
        });
      }
      else {
        return _mlift_run_finalizers_loop_10350(completed_0, x_10364);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_finalizers_loop_10352(coordinator_0, latest_0, rest, attempted) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, latest : maybe<exception>, rest : list<retirement<e>>, attempted : error<()>) -> <div,exn|e> () */  {
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
           
          var ev_10366 = $std_core_hnd._evv_at(0);
          var _x21 = $std_core_exn.throw_exn_fs__select(ev_10366.hnd);
          return _x21(ev_10366.marker, ev_10366, exn);
        }, latest_1.value);
    }
  }
  else {
    if (finalizers.head._tag === 1) {
       
      var x_1_10369 = $std_core_hnd._open_none1(function(values /* list<kokaine/reactive/internal/model/retirement-work<2116>> */ ) {
          return collect_retirement_loop(values, $std_core_types.Nil);
        }, $std_core_types.Cons(finalizers.head, finalizers.tail));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10143_0 /* list<retirement<2116>> */ ) {
          return _mlift_run_finalizers_loop_10349(coordinator_1, latest_1, _y_x10143_0);
        });
      }
      else {
        {
          // tail call
          finalizers = x_1_10369;
          continue tailcall;
        }
      }
    }
    else {
       
      var completed_1 = { value: false };
       
      var x_3_10377 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
       
      if ($std_core_hnd._yielding()) {
        var _x23 = $std_core_hnd.yield_extend(function(_y_x10147_0 /* hnd/ev-index */ ) {
          return _mlift_run_finalizers_loop_10351(completed_1, finalizers.head.retirement_action, _y_x10147_0);
        });
      }
      else {
        var _x23 = _mlift_run_finalizers_loop_10351(completed_1, finalizers.head.retirement_action, x_3_10377);
      }
      var x_2_10372 = $std_core_hnd.finally_prompt(function() {
          var _x22 = completed_1.value;
          if (_x22) {
            return $std_core_types.Unit;
          }
          else {
            return run_finalizers_loop(coordinator_1, finalizers.tail, $std_core_types.Nothing);
          }
        }, _x23);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(attempted_0 /* error<()> */ ) {
          return _mlift_run_finalizers_loop_10352(coordinator_1, latest_1, finalizers.tail, attempted_0);
        });
      }
      else {
        if (x_2_10372._tag === 2 && x_2_10372.value === 1) {
          {
            // tail call
            finalizers = finalizers.tail;
            continue tailcall;
          }
        }
        else {
          {
            // tail call
            var _x22 = $std_core_types.Just(x_2_10372.error);
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
   
  var value_10229 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2289> */ ) {
      return _this.retirement_depth;
    }, coordinator);
   
  var x_10227 = value_10229.value;
   
  var _x_x2_10312 = $std_core_types._int_sub(x_10227,1);
   
  var next = $std_core_hnd._open_none2(function(i /* int */ , j /* int */ ) {
      return ($std_core_types._int_ge(i,j)) ? i : j;
    }, 0, _x_x2_10312);
   
  var target_10231 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/retirement-coordinator<2289> */ ) {
      return _this_0.retirement_depth;
    }, coordinator);
   
  ((target_10231).value = next);
  if ($std_core_types._int_gt(next,0)) {
    return $std_core_types.Unit;
  }
  else {
     
    var value_1_10235 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/retirement-coordinator<2289> */ ) {
        return _this_1.retirement_disposal_requested;
      }, coordinator);
     
    var _x_x1_2_10315 = value_1_10235.value;
    var _x23 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_2_10315);
    if (_x23) {
      return $std_core_types.Unit;
    }
    else {
       
      var target_0_10237 = $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/retirement-coordinator<2289> */ ) {
          return _this_2.retirement_disposal_requested;
        }, coordinator);
       
      ((target_0_10237).value = false);
       
      var value_3_10240 = $std_core_hnd._open_none1(function(_this_3 /* kokaine/reactive/internal/model/retirement-coordinator<2289> */ ) {
          return _this_3.retirement_dispose_root;
        }, coordinator);
      var _x24 = value_3_10240.value;
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
   
  var target_10242 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/retirement-coordinator<2360> */ ) {
      return _this.retirement_depth;
    }, coordinator);
   
  var value_0_10247 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/retirement-coordinator<2360> */ ) {
      return _this_0.retirement_depth;
    }, coordinator);
   
  var x_10245 = value_0_10247.value;
   
  var value_10243 = $std_core_types._int_add(x_10245,1);
   
  ((target_10242).value = value_10243);
  return $std_core_hnd.finally_prompt(function() {
      return retirement_coordinator_fs_leave(coordinator);
    }, run_finalizers_loop(coordinator, finalizers, $std_core_types.Nothing));
}
 
export function trace_retirement_coordinator(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> maybe<kokaine/reactive/internal/model/retirement-coordinator<e>> */  {
  if (current._tag === 1) {
    return $std_core_types.Nothing;
  }
  else if (current._tag === 2) {
     
    var frame_0_10101 = (current.trace_frame).value;
    var _x25 = frame_0_10101.lifetime_retirement;
    return $std_core_types.Just(_x25);
  }
  else {
     
    var frame_1_10104 = (current.entry_frame).value;
    var _x26 = frame_1_10104.lifetime_retirement;
    return $std_core_types.Just(_x26);
  }
}
 
export function traces_retirement_coordinator(values) /* forall<e> (values : list<kokaine/reactive/internal/model/trace<e>>) -> maybe<kokaine/reactive/internal/model/retirement-coordinator<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Nothing;
  }
  else {
    var _x27 = trace_retirement_coordinator(values.head);
    if (_x27 === null) {
      {
        // tail call
        values = values.tail;
        continue tailcall;
      }
    }
    else {
      return _x27;
    }
  }
}}
 
 
// monadic lift
export function _mlift_retire_trace_10353(coordinator, finalizers) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
  return run_finalizers(coordinator, finalizers);
}
 
export function retire_trace(current) /* forall<e> (current : kokaine/reactive/internal/model/trace<e>) -> <div,exn|e> () */  {
  var _x28 = $std_core_hnd._open_none1(trace_retirement_coordinator, current);
  if (_x28 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var x_10381 = $std_core_hnd._open_none1(collect_retirement, current);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(finalizers /* list<retirement<2547>> */ ) {
        return run_finalizers(_x28.value, finalizers);
      });
    }
    else {
      return run_finalizers(_x28.value, x_10381);
    }
  }
}
 
 
// monadic lift
export function _mlift_retire_lifetime_10354(owner, finalizers) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
  return run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2588> */ ) {
        return _this.lifetime_retirement;
      }, owner), finalizers);
}
 
export function retire_lifetime(owner) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>) -> <div,exn|e> () */  {
   
  var x_10386 = $std_core_hnd._open_none1(function(owner_0 /* kokaine/reactive/internal/model/lifetime-owner<2588> */ ) {
      return collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return lifetime_retirement_expand(owner_0);
          }), $std_core_types.Nil), $std_core_types.Nil);
    }, owner);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<retirement<2588>> */ ) {
      return run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2588> */ ) {
            return _this.lifetime_retirement;
          }, owner), finalizers);
    });
  }
  else {
    return run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<2588> */ ) {
          return _this_0.lifetime_retirement;
        }, owner), x_10386);
  }
}
 
 
// monadic lift
export function _mlift_retire_scope_10355(current, finalizers) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_0_10325 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<2636> */ ) {
      return _this_0.scope_lifetime;
    }, current);
  return run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2636> */ ) {
        return _this.lifetime_retirement;
      }, _x_x1_0_10325), finalizers);
}
 
export function retire_scope(current) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>) -> <div,exn|e> () */  {
   
  var x_10391 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/continuation-scope<2636> */ ) {
      return collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return scope_retirement_expand(current_0);
          }), $std_core_types.Nil), $std_core_types.Nil);
    }, current);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<retirement<2636>> */ ) {
       
      var _x_x1_0_10325 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<2636> */ ) {
          return _this_0.scope_lifetime;
        }, current);
      return run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2636> */ ) {
            return _this.lifetime_retirement;
          }, _x_x1_0_10325), finalizers);
    });
  }
  else {
     
    var _x_x1_0_10325_0 = $std_core_hnd._open_none1(function(_this_0_0 /* kokaine/reactive/internal/model/continuation-scope<2636> */ ) {
        return _this_0_0.scope_lifetime;
      }, current);
    return run_finalizers($std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2636> */ ) {
          return _this_1.lifetime_retirement;
        }, _x_x1_0_10325_0), x_10391);
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
      var _x30 = function(_current29 /* kokaine/reactive/internal/model/trace<2689> */ ) {
        return $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
            return trace_retirement_expand(_current29);
          }), collected);
      }(values.head);
      values = values.tail;
      collected = _x30;
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
export function _mlift_retire_scope_drafts_10356(current, finalizers) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_0_10329 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<2831> */ ) {
      return _this_0.scope_lifetime;
    }, current);
  return run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2831> */ ) {
        return _this.lifetime_retirement;
      }, _x_x1_0_10329), finalizers);
}
 
export function retire_scope_drafts(current, values) /* forall<e> (current : kokaine/reactive/internal/model/continuation-scope<e>, values : list<kokaine/reactive/internal/model/trace<e>>) -> <div,exn|e> () */  {
   
  var x_10397 = $std_core_hnd._open_none2(collect_scope_drafts, current, values);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<retirement<2831>> */ ) {
       
      var _x_x1_0_10329 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/continuation-scope<2831> */ ) {
          return _this_0.scope_lifetime;
        }, current);
      return run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2831> */ ) {
            return _this.lifetime_retirement;
          }, _x_x1_0_10329), finalizers);
    });
  }
  else {
     
    var _x_x1_0_10329_0 = $std_core_hnd._open_none1(function(_this_0_0 /* kokaine/reactive/internal/model/continuation-scope<2831> */ ) {
        return _this_0_0.scope_lifetime;
      }, current);
    return run_finalizers($std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/lifetime-owner<2831> */ ) {
          return _this_1.lifetime_retirement;
        }, _x_x1_0_10329_0), x_10397);
  }
}
 
 
// monadic lift
export function _mlift_retire_lifetime_drafts_10357(owner, finalizers) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, finalizers : list<retirement<e>>) -> <div,exn|e> () */  {
  return run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2873> */ ) {
        return _this.lifetime_retirement;
      }, owner), finalizers);
}
 
export function retire_lifetime_drafts(owner, values) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>, values : list<kokaine/reactive/internal/model/trace<e>>) -> <div,exn|e> () */  {
   
  var x_10402 = $std_core_hnd._open_none2(collect_lifetime_drafts, owner, values);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<retirement<2873>> */ ) {
      return run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<2873> */ ) {
            return _this.lifetime_retirement;
          }, owner), finalizers);
    });
  }
  else {
    return run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<2873> */ ) {
          return _this_0.lifetime_retirement;
        }, owner), x_10402);
  }
}
 
 
// monadic lift
export function _mlift_retire_drafts_10358(coordinator, finalizers) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, finalizers : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
  return run_finalizers(coordinator, finalizers);
}
 
 
// monadic lift
export function _mlift_retire_drafts_10359(coordinator, work) /* forall<e> (coordinator : kokaine/reactive/internal/model/retirement-coordinator<e>, work : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_10407 = $std_core_hnd._open_none1(function(values_0 /* list<kokaine/reactive/internal/model/retirement-work<2937>> */ ) {
      return collect_retirement_loop(values_0, $std_core_types.Nil);
    }, work);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(finalizers /* list<kokaine/reactive/internal/model/retirement-work<2937>> */ ) {
      return run_finalizers(coordinator, finalizers);
    });
  }
  else {
    return run_finalizers(coordinator, x_10407);
  }
}
 
export function retire_drafts(values) /* forall<e> (values : list<kokaine/reactive/internal/model/trace<e>>) -> <div,exn|e> () */  {
  var _x31 = $std_core_hnd._open_none1(traces_retirement_coordinator, values);
  if (_x31 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var x_10411 = $std_core_hnd._open_none2(draft_work_list, values, $std_core_types.Nil);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(work /* list<kokaine/reactive/internal/model/retirement-work<2937>> */ ) {
        return _mlift_retire_drafts_10359(_x31.value, work);
      });
    }
    else {
       
      var x_0_10414 = $std_core_hnd._open_none1(function(values_0 /* list<kokaine/reactive/internal/model/retirement-work<2937>> */ ) {
          return collect_retirement_loop(values_0, $std_core_types.Nil);
        }, x_10411);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(finalizers /* list<kokaine/reactive/internal/model/retirement-work<2937>> */ ) {
          return run_finalizers(_x31.value, finalizers);
        });
      }
      else {
        return run_finalizers(_x31.value, x_0_10414);
      }
    }
  }
}
 
export function retire_drafts_now(values) /* forall<e> (values : list<kokaine/reactive/internal/model/trace<e>>) -> <exn|e> () */  {
  return retire_drafts(values);
}
 
export function try_retire_lifetime(owner) /* forall<e> (owner : kokaine/reactive/internal/model/lifetime-owner<e>) -> e error<()> */  {
  return $kokaine_internal_compat.capture_error(function() {
    return retire_lifetime(owner);
  });
}
 
export function try_retire_drafts(values) /* forall<e> (values : list<kokaine/reactive/internal/model/trace<e>>) -> e error<()> */  {
  return $kokaine_internal_compat.capture_error(function() {
    return retire_drafts(values);
  });
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
   
  var value_10264 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3165> */ ) {
      return plane_0.plane_draft;
    }, plane);
  var _x32 = value_10264.value;
  if (_x32 === null) {
    return $std_core_exn.$throw("continuation node created outside a draft transaction");
  }
  else {
     
    var value_0_10267 = $std_core_types.Cons(current, (_x32.value).value);
    return (((_x32.value)).value = value_0_10267);
  }
}
 
export function attempt_build(plane, drafts, action) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e>>>, action : () -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e>) -> <div|e> error<kokaine/reactive/internal/model/built-trace<e>> */  {
   
  var _x33 = plane.plane_draft;
  var previous = _x33.value;
   
  var _x34 = plane.plane_draft;
  ((_x34).value = ($std_core_types.Just(drafts)));
  return $std_core_hnd.finally_prompt(function() {
      var _x33 = plane.plane_draft;
      return ((_x33).value = previous);
    }, $kokaine_internal_compat.capture_error(action));
}
 
export function with_frame(plane, current, action) /* forall<a,e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/frame<e>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
   
  var value_10277 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3326> */ ) {
      return plane_0.plane_current_frame;
    }, plane);
   
  var previous = value_10277.value;
   
  var target_0_10282 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<3326> */ ) {
      return plane_2.plane_current_frame;
    }, plane);
   
  ((target_0_10282).value = current);
  return $std_core_hnd.finally_prompt(function() {
       
      var target_10279 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<3326> */ ) {
          return plane_1.plane_current_frame;
        }, plane);
      return ((target_10279).value = previous);
    }, action());
}
 
export function with_context(plane, current, current_frame, action) /* forall<a,e> (plane : kokaine/reactive/internal/model/plane<e>, current : maybe<kokaine/reactive/internal/model/continuation-gate>, current-frame : kokaine/reactive/internal/model/frame<e>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
   
  var value_10285 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3413> */ ) {
      return plane_0.plane_current;
    }, plane);
   
  var previous = value_10285.value;
   
  var target_0_10290 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<3413> */ ) {
      return plane_2.plane_current;
    }, plane);
   
  ((target_0_10290).value = current);
  return $std_core_hnd.finally_prompt(function() {
       
      var target_10287 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<3413> */ ) {
          return plane_1.plane_current;
        }, plane);
      return ((target_10287).value = previous);
    }, with_frame(plane, current_frame, action));
}
 
export function with_current(plane, current, current_frame, action) /* forall<a,e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>, current-frame : kokaine/reactive/internal/model/frame<e>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
  var _x34 = $std_core_hnd._open_none1(function(current_0 /* kokaine/reactive/internal/model/trace<3482> */ ) {
      if (current_0._tag === 1) {
        return $std_core_types.Nothing;
      }
      else if (current_0._tag === 2) {
        return $std_core_types.Just(current_0.trace_gate);
      }
      else {
        return $std_core_types.Just(current_0.entry_gate);
      }
    }, current);
  if (_x34 === null) {
    return with_context(plane, $std_core_types.Nothing, current_frame, action);
  }
  else {
    return with_context(plane, $std_core_types.Just(_x34.value), current_frame, action);
  }
}
 
 
// Entry targeting is a dynamic capability, deliberately separate from the
// structural gate parent. Structural scopes inherit `plane-current` for
// lifetime gating, but never inherit a surrounding state entry target.
export function with_entry(plane, current, action) /* forall<a,e> (plane : kokaine/reactive/internal/model/plane<e>, current : maybe<kokaine/reactive/internal/model/trace<e>>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
   
  var value_10294 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<3560> */ ) {
      return plane_0.plane_current_entry;
    }, plane);
   
  var previous = value_10294.value;
   
  var target_0_10299 = $std_core_hnd._open_none1(function(plane_2 /* kokaine/reactive/internal/model/plane<3560> */ ) {
      return plane_2.plane_current_entry;
    }, plane);
   
  ((target_0_10299).value = current);
  return $std_core_hnd.finally_prompt(function() {
       
      var target_10296 = $std_core_hnd._open_none1(function(plane_1 /* kokaine/reactive/internal/model/plane<3560> */ ) {
          return plane_1.plane_current_entry;
        }, plane);
      return ((target_10296).value = previous);
    }, action());
}