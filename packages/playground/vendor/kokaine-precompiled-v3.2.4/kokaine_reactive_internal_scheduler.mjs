// Koka generated module: kokaine/reactive/internal/scheduler, koka version: 3.2.4
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
import * as $kokaine_reactive_internal_lifetime from './kokaine_reactive_internal_lifetime.mjs';
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
 
// externals
 
// type declarations
// type scheduler-transaction
export function Scheduler_transaction(transaction_root_key, transaction_derive_group, transaction_effect_group, transaction_publications) /* forall<e> (transaction-root-key : kokaine/reactive/internal/model/root-key, transaction-derive-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, transaction-effect-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>, transaction-publications : kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/work-transaction/work-publication<e>>) -> scheduler-transaction<e> */  {
  return { transaction_root_key: transaction_root_key, transaction_derive_group: transaction_derive_group, transaction_effect_group: transaction_effect_group, transaction_publications: transaction_publications };
}
 
// declarations
 
export function pack_capture(plane, target, owner) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, target : kokaine/reactive/internal/model/trace<e>, owner : kokaine/reactive/internal/model/trace<e>) -> kokaine/reactive/internal/model/packed-capture */  {
  return function(consume /* forall<e> (kokaine/reactive/internal/model/plane<e>, kokaine/reactive/internal/model/trace<e>, kokaine/reactive/internal/model/trace<e>) -> 504 */ ) {
    return consume(plane, target, owner);
  };
}
 
export function packed_active(packed) /* (packed : kokaine/reactive/internal/model/packed-capture) -> bool */  {
  return packed(function(___wildcard_x23__35 /* kokaine/reactive/internal/model/plane<559> */ , target /* kokaine/reactive/internal/model/trace<559> */ , owner /* kokaine/reactive/internal/model/trace<559> */ ) {
    var _x0 = $kokaine_reactive_internal_lifetime.trace_state_of(owner);
    if (_x0 === 5) {
      return false;
    }
    else {
      var _x1 = $kokaine_reactive_internal_lifetime.trace_state_of(target);
      return (_x1 === 5) ? false : true;
    }
  });
}
 
export function enqueue_trace(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> () */  {
  if (current._tag === 1) {
    return $std_core_types.Unit;
  }
  else if (current._tag === 2) {
    var _x3 = current.trace_gate.gate_state;
    var _x2 = _x3.value;
    if (_x2 === 2) {
       
      var _x4 = current.trace_gate.gate_state;
      ((_x4).value = ($kokaine_reactive_internal_model.Capture_pending));
      var _x4 = plane.plane_queue;
      return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x4, $kokaine_reactive_internal_model.Resume_work(current));
    }
    else if (_x2 === 4) {
      var _x5 = current.trace_gate.gate_state;
      return ((_x5).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else {
    var _x7 = current.entry_gate.gate_state;
    var _x6 = _x7.value;
    if (_x6 === 2) {
       
      var _x8 = current.entry_gate.gate_state;
      ((_x8).value = ($kokaine_reactive_internal_model.Capture_pending));
      var _x8 = plane.plane_queue;
      return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x8, $kokaine_reactive_internal_model.Resume_work(current));
    }
    else if (_x6 === 4) {
      var _x9 = current.entry_gate.gate_state;
      return ((_x9).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
export function cut_capture(packed) /* (packed : kokaine/reactive/internal/model/packed-capture) -> () */  {
  return packed(function(plane /* kokaine/reactive/internal/model/plane<780> */ , target /* kokaine/reactive/internal/model/trace<780> */ , owner /* kokaine/reactive/internal/model/trace<780> */ ) {
    var _x10 = $kokaine_reactive_internal_lifetime.trace_state_of(owner);
    if (_x10 === 5) {
      return $std_core_types.Unit;
    }
    else {
      var _x11 = $kokaine_reactive_internal_lifetime.trace_state_of(target);
      if (_x11 === 4) {
        var _x12 = $kokaine_reactive_internal_lifetime.trace_state_of(owner);
        if (_x12 === 2) {
          return $std_core_types.Unit;
        }
        else {
          return enqueue_trace(plane, target);
        }
      }
      else {
        return enqueue_trace(plane, target);
      }
    }
  });
}
 
export function pending_ancestor_loop(parent) /* (parent : maybe<kokaine/reactive/internal/model/continuation-gate>) -> div bool */  { tailcall: while(1)
{
  if (parent === null) {
    return false;
  }
  else {
    var _x14 = parent.value.gate_state;
    var _x13 = _x14.value;
    if (_x13 === 3) {
      return true;
    }
    else if (_x13 === 4) {
      return true;
    }
    else if (_x13 === 5) {
      return false;
    }
    else if (_x13 === 1) {
      {
        // tail call
        var _x15 = parent.value.gate_parent;
        parent = _x15;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        var _x16 = parent.value.gate_parent;
        parent = _x16;
        continue tailcall;
      }
    }
  }
}}
 
export function pending_ancestor(parent) /* (parent : maybe<kokaine/reactive/internal/model/continuation-gate>) -> bool */  {
  return pending_ancestor_loop(parent);
}
 
export function notify_source(source) /* forall<a> (source : kokaine/reactive/internal/model/source<a>) -> () */  {
  var _x17 = source.source_captures;
  return $std_core_list.foreach($kokaine_internal_registry.registry_fs_snapshot(_x17), cut_capture);
}
 
export function activate_trace_loop(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> div () */  { tailcall: while(1)
{
  if (current._tag === 1) {
    return $std_core_types.Unit;
  }
  else if (current._tag === 2) {
    var _x19 = current.trace_gate.gate_state;
    var _x18 = _x19.value;
    if (_x18 === 1) {
       
      var current_frame = (current.trace_frame).value;
       
      var _x20 = current.trace_gate.gate_state;
      ((_x20).value = ($kokaine_reactive_internal_model.Capture_live));
       
      var _x21 = current_frame.lifetime_token;
      ((_x21).value = ($kokaine_reactive_internal_model.Scope_live));
       
      activate_trace_loop(plane, (current.trace_child).value);
      var _x20 = current.trace_stale();
      if (_x20) {
        if (current.trace_entry_target === null) {
          return enqueue_trace(plane, current);
        }
        else {
          return enqueue_trace(plane, current.trace_entry_target.value);
        }
      }
      else {
        return $std_core_types.Unit;
      }
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else {
    var _x22 = current.entry_gate.gate_state;
    var _x21 = _x22.value;
    if (_x21 === 1) {
       
      var current_frame_0 = (current.entry_frame).value;
       
      var _x23 = current.entry_gate.gate_state;
      ((_x23).value = ($kokaine_reactive_internal_model.Capture_live));
       
      var _x24 = current_frame_0.lifetime_token;
      ((_x24).value = ($kokaine_reactive_internal_model.Scope_live));
      {
        // tail call
        var _x23 = (current.entry_child).value;
        current = _x23;
        continue tailcall;
      }
    }
    else {
      return $std_core_types.Unit;
    }
  }
}}
 
export function activate_trace(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> () */  {
  return activate_trace_loop(plane, current);
}
 
export function work_runnable(current) /* forall<e> (current : kokaine/reactive/internal/model/work<e>) -> bool */  {
  if (current._tag === 2) {
    var _x25 = current.bootstrap_scope.scope_lifetime.lifetime_token;
    var _x24 = _x25.value;
    if (_x24 === 1) {
       
      var _x26 = current.bootstrap_scope.scope_bootstrap_slot;
      var maybe_10048 = _x26.value;
      if (maybe_10048 !== null) {
         
        var _x26 = current.bootstrap_scope.scope_parent;
        var b_10051 = pending_ancestor_loop(_x26);
        return (b_10051) ? false : true;
      }
      else {
        return false;
      }
    }
    else {
      return false;
    }
  }
  else {
    var _x26 = $kokaine_reactive_internal_lifetime.trace_state_of(current.resume_trace);
    if (_x26 === 3) {
       
      var parent_0_10056 = $kokaine_reactive_internal_lifetime.trace_parent_of(current.resume_trace);
       
      var b_0_10055 = pending_ancestor_loop(parent_0_10056);
      return (b_0_10055) ? false : true;
    }
    else {
      return false;
    }
  }
}
 
export function work_stale(current) /* forall<e> (current : kokaine/reactive/internal/model/work<e>) -> bool */  {
  if (current._tag === 2) {
    var _x28 = current.bootstrap_scope.scope_lifetime.lifetime_token;
    var _x27 = _x28.value;
    if (_x27 === 1) {
       
      var _x29 = current.bootstrap_scope.scope_bootstrap_slot;
      var maybe_10061 = _x29.value;
      return (maybe_10061 === null);
    }
    else {
      return true;
    }
  }
  else {
    var _x29 = $kokaine_reactive_internal_lifetime.trace_state_of(current.resume_trace);
    if (_x29 === 5) {
      return true;
    }
    else if (_x29 === 1) {
      return true;
    }
    else if (_x29 === 2) {
      return true;
    }
    else {
      return false;
    }
  }
}
 
export function take_work_loop(values, skipped) /* forall<e> (values : list<kokaine/reactive/internal/model/work<e>>, skipped : list<kokaine/reactive/internal/model/work<e>>) -> div (maybe<kokaine/reactive/internal/model/work<e>>, list<kokaine/reactive/internal/model/work<e>>) */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Tuple2($std_core_types.Nothing, $std_core_list.reverse_acc($std_core_types.Nil, skipped));
  }
  else {
    var _x30 = work_runnable(values.head);
    if (_x30) {
       
      var xs_0_10065 = $std_core_list.reverse_acc($std_core_types.Nil, skipped);
      return $std_core_types.Tuple2($std_core_types.Just(values.head), $std_core_list.append(xs_0_10065, values.tail));
    }
    else {
      var _x31 = work_stale(values.head);
      if (_x31) {
        {
          // tail call
          values = values.tail;
          continue tailcall;
        }
      }
      else {
        {
          // tail call
          var _x32 = $std_core_types.Cons(values.head, skipped);
          values = values.tail;
          skipped = _x32;
          continue tailcall;
        }
      }
    }
  }
}}
 
export function take_work(values) /* forall<e> (values : list<kokaine/reactive/internal/model/work<e>>) -> (maybe<kokaine/reactive/internal/model/work<e>>, list<kokaine/reactive/internal/model/work<e>>) */  {
  return take_work_loop(values, $std_core_types.Nil);
}
 
export function restore_skipped(queue, skipped) /* forall<e> (queue : kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<e>>, skipped : list<kokaine/reactive/internal/model/work<e>>) -> div () */  { tailcall: while(1)
{
  if (skipped === null) {
    return $std_core_types.Unit;
  }
  else {
     
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(queue, skipped.head);
    {
      // tail call
      skipped = skipped.tail;
      continue tailcall;
    }
  }
}}
 
export function take_queued_work_loop(queue, skipped) /* forall<e> (queue : kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<e>>, skipped : list<kokaine/reactive/internal/model/work<e>>) -> div maybe<kokaine/reactive/internal/model/work<e>> */  { tailcall: while(1)
{
  var _x33 = $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_pop(queue);
  if (_x33 === null) {
     
    restore_skipped(queue, skipped);
    return $std_core_types.Nothing;
  }
  else {
    var _x34 = work_runnable(_x33.value);
    if (_x34) {
       
      restore_skipped(queue, skipped);
      return $std_core_types.Just(_x33.value);
    }
    else {
      var _x35 = work_stale(_x33.value);
      if (_x35) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        {
          // tail call
          var _x36 = $std_core_types.Cons(_x33.value, skipped);
          skipped = _x36;
          continue tailcall;
        }
      }
    }
  }
}}
 
export function take_queued_work(queue) /* forall<e> (queue : kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<e>>) -> maybe<kokaine/reactive/internal/model/work<e>> */  {
  return take_queued_work_loop(queue, $std_core_types.Nil);
}
 
export function queue_global_work(queue, current) /* forall<e> (queue : kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<e>>, current : kokaine/reactive/internal/model/work<e>) -> () */  {
  if (current._tag === 2) {
    return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(queue, current);
  }
  else {
    return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(queue, current);
  }
}
 
export function queue_work(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/work<e>) -> () */  {
  if (current._tag === 2) {
    var _x37 = plane.plane_queue;
    var _x38 = plane.plane_work_group;
    return $kokaine_reactive_internal_work_dash_transaction.route_bootstrap(_x37, _x38.value, current);
  }
  else {
    var _x39 = plane.plane_queue;
    return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x39, current);
  }
}
 
 
// monadic lift
export function _mlift_abandon_draft_frame_10922(_pat_5) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function abandon_draft_frame(current, drafts) /* forall<e> (current : kokaine/reactive/internal/model/frame<e>, drafts : list<kokaine/reactive/internal/model/trace<e>>) -> e () */  {
   
  var _x40 = current.lifetime_token;
  ((_x40).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x41 = current;
  var x_10970 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x41, drafts);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10923(draft_frame, drafts, _c_x10286) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, ()) -> () */  {
   
  var drafts_0_11193 = drafts.value;
   
  var _x40 = draft_frame.lifetime_token;
  ((_x40).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x41 = draft_frame;
  var x_10970 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x41, drafts_0_11193);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10924(failure, wild___2) /* forall<e> (failure : exception, wild_@2 : ()) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure);
}
 
 
// monadic lift
export function _mlift_resume_node_10925(draft_frame, drafts, failure, _c_x10294) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, failure : exception, ()) -> result<(),exception> */  {
   
  var drafts_0_11195 = drafts.value;
   
  var _x40 = draft_frame.lifetime_token;
  ((_x40).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x41 = draft_frame;
  var x_10970 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x41, drafts_0_11195);
   
  if ($std_core_hnd._yielding()) {
    var x_10974 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    var x_10974 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___2 /* () */ ) {
      return $std_core_types.$Error(failure);
    });
  }
  else {
    return $std_core_types.$Error(failure);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10926(failure_0, wild___7) /* forall<e> (failure@0 : exception, wild_@7 : ()) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure_0);
}
 
 
// monadic lift
export function _mlift_resume_node_10927(draft_frame, drafts, failure_0, _c_x10303) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, failure@0 : exception, ()) -> result<(),exception> */  {
   
  var drafts_0_11197 = drafts.value;
   
  var _x40 = draft_frame.lifetime_token;
  ((_x40).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x41 = draft_frame;
  var x_10970 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x41, drafts_0_11197);
   
  if ($std_core_hnd._yielding()) {
    var x_10978 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    var x_10978 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___7 /* () */ ) {
      return $std_core_types.$Error(failure_0);
    });
  }
  else {
    return $std_core_types.$Error(failure_0);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10928(wild___8) /* forall<e> (wild_@8 : ()) -> e result<(),exception> */  {
  return $std_core_types.Ok($std_core_types.Unit);
}
 
 
// monadic lift
export function _mlift_resume_node_10929(failure_1, wild___10) /* forall<e> (failure@1 : exception, wild_@10 : ()) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure_1);
}
 
 
// monadic lift
export function _mlift_resume_node_10930(draft_frame, drafts, failure_1, _c_x10307) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, failure@1 : exception, ()) -> result<(),exception> */  {
   
  var drafts_0_11199 = drafts.value;
   
  var _x40 = draft_frame.lifetime_token;
  ((_x40).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x41 = draft_frame;
  var x_10970 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x41, drafts_0_11199);
   
  if ($std_core_hnd._yielding()) {
    var x_10982 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    var x_10982 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___10 /* () */ ) {
      return $std_core_types.$Error(failure_1);
    });
  }
  else {
    return $std_core_types.$Error(failure_1);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10931(wild___11) /* forall<e> (wild_@11 : ()) -> e result<(),exception> */  {
  return $std_core_types.Ok($std_core_types.Unit);
}
 
 
// monadic lift
export function _mlift_resume_node_10932(_c_x10310) /* (()) -> result<(),exception> */  {
  return $std_core_types.Ok($std_core_types.Unit);
}
 
 
// monadic lift
export function _mlift_resume_node_10933(built, child, draft_frame, drafts, plane, state, publication) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, plane : kokaine/reactive/internal/model/plane<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, publication : error<()>) -> e2 result<(),exception> */  {
  if (publication._tag === 1) {
     
    var _x40 = state.value;
    if (_x40 === 4) {
      var x_10986 = ((state).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else {
      var x_10986 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10307 /* () */ ) {
        return _mlift_resume_node_10930(draft_frame, drafts, publication.error, _c_x10307);
      });
    }
    else {
      return _mlift_resume_node_10930(draft_frame, drafts, publication.error, x_10986);
    }
  }
  else {
    var _x40 = state.value;
    if (_x40 === 5) {
       
      var drafts_0_11201 = drafts.value;
       
      var _x41 = draft_frame.lifetime_token;
      ((_x41).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
       
      var _x42 = draft_frame;
      var x_10970 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x42, drafts_0_11201);
       
      if ($std_core_hnd._yielding()) {
        var x_0_10988 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
          return $std_core_types.Unit;
        });
      }
      else {
        var x_0_10988 = $std_core_types.Unit;
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___11 /* () */ ) {
          return $std_core_types.Ok($std_core_types.Unit);
        });
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    }
    else {
       
      var _x41 = built.built_root;
      ((child).value = _x41);
       
      var _x42 = built.built_root;
      activate_trace_loop(plane, _x42);
       
      var _x43 = draft_frame.lifetime_token;
      ((_x43).value = ($kokaine_reactive_internal_model.Scope_live));
       
      var _x44 = state.value;
      if (_x44 === 4) {
        var x_1_10991 = ((state).value = ($kokaine_reactive_internal_model.Capture_live));
      }
      else {
        var x_1_10991 = $std_core_types.Unit;
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_resume_node_10932);
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10934(built, child, draft_frame, drafts, plane, state, retired) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, plane : kokaine/reactive/internal/model/plane<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, retired : error<()>) -> e2 result<(),exception> */  {
  if (retired._tag === 1) {
     
    var _x41 = state.value;
    if (_x41 === 4) {
      var x_10993 = ((state).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else {
      var x_10993 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10303 /* () */ ) {
        return _mlift_resume_node_10927(draft_frame, drafts, retired.error, _c_x10303);
      });
    }
    else {
      return _mlift_resume_node_10927(draft_frame, drafts, retired.error, x_10993);
    }
  }
  else {
    var _x41 = state.value;
    if (_x41 === 5) {
       
      var drafts_0_11204 = drafts.value;
       
      var _x42 = draft_frame.lifetime_token;
      ((_x42).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
       
      var _x43 = draft_frame;
      var x_10970 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x43, drafts_0_11204);
       
      if ($std_core_hnd._yielding()) {
        var x_0_10995 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
          return $std_core_types.Unit;
        });
      }
      else {
        var x_0_10995 = $std_core_types.Unit;
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___8 /* () */ ) {
          return $std_core_types.Ok($std_core_types.Unit);
        });
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    }
    else {
       
      var x_1_10998 = built.built_publish();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(publication /* error<()> */ ) {
          return _mlift_resume_node_10933(built, child, draft_frame, drafts, plane, state, publication);
        });
      }
      else {
        return _mlift_resume_node_10933(built, child, draft_frame, drafts, plane, state, x_1_10998);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10935(old_frame, _y_x10297) /* forall<e> (old-frame : kokaine/reactive/internal/model/frame<e>, kokaine/reactive/internal/model/retirement-work<e>) -> <div|e> list<kokaine/reactive/internal/model/retirement-work<e>> */  {
  return $kokaine_reactive_internal_lifetime.collect_retirement_loop($std_core_types.Cons(_y_x10297, $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
          var _x42 = old_frame;
          return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(_x42);
        }), $std_core_types.Nil)), $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_resume_node_10936(built, child, draft_frame, drafts, old_frame, plane, state, retirement) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, old-frame : kokaine/reactive/internal/model/frame<e2>, plane : kokaine/reactive/internal/model/plane<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, retirement : list<kokaine/reactive/internal/model/retirement-work<e2>>) -> e2 result<(),exception> */  {
   
  var x_11000 = $kokaine_internal_compat.capture_error(function() {
     
    var _x_x1_10760 = $std_core_hnd._open_none1(function(frame_1 /* kokaine/reactive/internal/model/frame<2617> */ ) {
        return frame_1;
      }, old_frame);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/lifetime-owner<2617> */ ) {
          return _this_2.lifetime_retirement;
        }, _x_x1_10760), retirement);
  });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(retired /* error<()> */ ) {
      return _mlift_resume_node_10934(built, child, draft_frame, drafts, plane, state, retired);
    });
  }
  else {
    return _mlift_resume_node_10934(built, child, draft_frame, drafts, plane, state, x_11000);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10937(completed, _c_x10315) /* forall<_e> (completed : ref<global,bool>, result<(),exception>) -> result<(),exception> */  {
   
  ((completed).value = true);
  return _c_x10315;
}
 
 
// monadic lift
export function _mlift_resume_node_10938(child, completed, current_frame_slot, draft_frame, drafts, old_frame, plane, state, attempt) /* forall<_e,_e1,e2> (child : ref<global,kokaine/reactive/internal/model/trace<e2>>, completed : ref<global,bool>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, old-frame : kokaine/reactive/internal/model/frame<e2>, plane : kokaine/reactive/internal/model/plane<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, attempt : error<kokaine/reactive/internal/model/built-trace<e2>>) -> e2 result<(),exception> */  {
   
  if (attempt._tag === 1) {
     
    var _x43 = state.value;
    if (_x43 === 4) {
      var x_0_11004 = ((state).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else {
      var x_0_11004 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      var x_11002 = $std_core_hnd.yield_extend(function(_c_x10294 /* () */ ) {
        return _mlift_resume_node_10925(draft_frame, drafts, attempt.error, _c_x10294);
      });
    }
    else {
      var x_11002 = _mlift_resume_node_10925(draft_frame, drafts, attempt.error, x_0_11004);
    }
  }
  else {
     
    var old = child.value;
     
    ((child).value = ($kokaine_reactive_internal_model.Trace_end));
     
    var _x43 = old_frame.lifetime_token;
    ((_x43).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
     
    ((current_frame_slot).value = draft_frame);
     
    if ($std_core_hnd._yielding()) {
      var x_1_11006 = $std_core_hnd.yield_extend(function(_y_x10297 /* kokaine/reactive/internal/model/retirement-work<2617> */ ) {
        return _mlift_resume_node_10935(old_frame, _y_x10297);
      });
    }
    else {
      var x_1_11006 = _mlift_resume_node_10935(old_frame, $kokaine_reactive_internal_model.Retirement_step(function() {
          return $kokaine_reactive_internal_lifetime.trace_retirement_expand(old);
        }));
    }
    if ($std_core_hnd._yielding()) {
      var x_11002 = $std_core_hnd.yield_extend(function(retirement /* list<kokaine/reactive/internal/model/retirement-work<2617>> */ ) {
        return _mlift_resume_node_10936(attempt.value, child, draft_frame, drafts, old_frame, plane, state, retirement);
      });
    }
    else {
      var x_11002 = _mlift_resume_node_10936(attempt.value, child, draft_frame, drafts, old_frame, plane, state, x_1_11006);
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10315 /* result<(),exception> */ ) {
       
      ((completed).value = true);
      return _c_x10315;
    });
  }
  else {
     
    ((completed).value = true);
    return x_11002;
  }
}
 
export function resume_node(plane, current, gate, child, current_frame_slot, resume) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<e>>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e>>, resume : (kokaine/reactive/internal/model/frame<e>) -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e>) -> <div|e> error<()> */  {
  var _x44 = gate.gate_state;
  var _x43 = _x44.value;
  if (_x43 === 3) {
     
    var _x45 = gate.gate_state;
    ((_x45).value = ($kokaine_reactive_internal_model.Capture_running));
     
    var old_frame = current_frame_slot.value;
     
    var _x46 = plane.plane_retirement;
    var draft_frame = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_starting, _x46);
     
    var drafts = { value: ($std_core_types.Nil) };
     
    var completed = { value: false };
     
    var x_0_11022 = $kokaine_reactive_internal_lifetime.attempt_build(plane, drafts, function() {
        return $kokaine_reactive_internal_lifetime.with_current(plane, current, draft_frame, function() {
            return resume(draft_frame);
          });
      });
     
    var next_0_11023 = function(attempt /* error<kokaine/reactive/internal/model/built-trace<2617>> */ ) {
      var _x47 = gate.gate_state;
      return _mlift_resume_node_10938(child, completed, current_frame_slot, draft_frame, drafts, old_frame, plane, _x47, attempt);
    };
    if ($std_core_hnd._yielding()) {
      var _x46 = $std_core_hnd.yield_extend(next_0_11023);
    }
    else {
      var _x46 = next_0_11023(x_0_11022);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x45 = completed.value;
        if (_x45) {
          return $std_core_types.Unit;
        }
        else {
           
          var _x47 = gate.gate_state;
          var _x46 = _x47.value;
          if (_x46 === 4) {
            var _x48 = gate.gate_state;
            var x_11016 = ((_x48).value = ($kokaine_reactive_internal_model.Capture_pending));
          }
          else {
            var x_11016 = $std_core_types.Unit;
          }
           
          var next_11017 = function(_c_x10286 /* () */ ) {
             
            var drafts_0_11206 = drafts.value;
             
            var _x49 = draft_frame.lifetime_token;
            ((_x49).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
             
            var _x50 = draft_frame;
            var x_10970 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x50, drafts_0_11206);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_pat_5_0 /* error<()> */ ) {
                return $std_core_types.Unit;
              });
            }
            else {
              return $std_core_types.Unit;
            }
          };
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(next_11017);
          }
          else {
            return next_11017(x_11016);
          }
        }
      }, _x46);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function resume_capture(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> <div|e> error<()> */  {
  if (current._tag === 1) {
    return $std_core_types.Ok($std_core_types.Unit);
  }
  else if (current._tag === 2) {
    return resume_node(plane, current, current.trace_gate, current.trace_child, current.trace_frame, current.trace_resume);
  }
  else {
    return resume_node(plane, current, current.entry_gate, current.entry_child, current.entry_frame, current.entry_resume);
  }
}
 
 
// monadic lift
export function _mlift_run_bootstrap_10939(_pat_3_3) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function run_bootstrap(scope) /* forall<e> (scope : kokaine/reactive/internal/model/continuation-scope<e>) -> <div|e> error<()> */  {
  var _x48 = scope.scope_lifetime.lifetime_token;
  var _x47 = _x48.value;
  if (_x47 === 1) {
     
    var _x49 = scope.scope_bootstrap_slot;
    var pending = _x49.value;
     
    var _x50 = scope.scope_bootstrap_slot;
    ((_x50).value = ($std_core_types.Nothing));
    if (pending === null) {
      return $kokaine_internal_compat.capture_error(function() {
        return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "bootstrap slot was already consumed while scope is starting");
      });
    }
    else {
      return $std_core_hnd.finally_prompt(function() {
          var _x50 = scope.scope_lifetime.lifetime_token;
          var _x49 = _x50.value;
          if (_x49 === 1) {
             
            var x_11027 = $kokaine_internal_compat.capture_error(function() {
              return $kokaine_reactive_internal_lifetime.retire_scope(scope);
            });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_pat_3_3 /* error<()> */ ) {
                return $std_core_types.Unit;
              });
            }
            else {
              return $std_core_types.Unit;
            }
          }
          else {
            return $std_core_types.Unit;
          }
        }, pending.value());
    }
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function run_work_raw(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/work<e>) -> <div|e> error<()> */  {
  if (current._tag === 1) {
    return resume_capture(plane, current.resume_trace);
  }
  else {
    return run_bootstrap(current.bootstrap_scope);
  }
}
 
export function restore_deferred(plane, deferred) /* (plane : kokaine/reactive/internal/model/plane<total>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> () */  {
   
  var values_10086 = $std_core_list.reverse_acc($std_core_types.Nil, deferred);
  var _x51 = plane.plane_queue;
  return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(_x51, values_10086);
}
 
 
// monadic lift
export function _mlift_run_next_effect_10940(_c_x10337) /* (error<()>) -> result<bool,exception> */  {
  if (_c_x10337._tag === 1) {
    return $std_core_types.$Error(_c_x10337.error);
  }
  else {
    return $std_core_types.Ok(true);
  }
}
 
export function run_next_effect(plane) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>) -> <div|e> error<bool> */  {
   
  var _x52 = plane.plane_queue;
  var next = take_queued_work_loop(_x52, $std_core_types.Nil);
  if (next === null) {
    return $std_core_types.Ok(false);
  }
  else {
     
    var _x52 = plane.plane_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x52, next.value);
     
    if (next.value._tag === 1) {
      var x_11030 = resume_capture(plane, next.value.resume_trace);
    }
    else {
      var x_11030 = run_bootstrap(next.value.bootstrap_scope);
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_run_next_effect_10940);
    }
    else {
      if (x_11030._tag === 1) {
        return $std_core_types.$Error(x_11030.error);
      }
      else {
        return $std_core_types.Ok(true);
      }
    }
  }
}
 
 
// Automatically generated. Retrieves the `transaction-root-key` constructor field of the `:scheduler-transaction` type.
export function scheduler_transaction_fs_transaction_root_key(_this) /* forall<e> (scheduler-transaction<e>) -> kokaine/reactive/internal/model/root-key */  {
  return _this.transaction_root_key;
}
 
 
// Automatically generated. Retrieves the `transaction-derive-group` constructor field of the `:scheduler-transaction` type.
export function scheduler_transaction_fs_transaction_derive_group(_this) /* forall<e> (scheduler-transaction<e>) -> kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */  {
  return _this.transaction_derive_group;
}
 
 
// Automatically generated. Retrieves the `transaction-effect-group` constructor field of the `:scheduler-transaction` type.
export function scheduler_transaction_fs_transaction_effect_group(_this) /* forall<e> (scheduler-transaction<e>) -> kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>> */  {
  return _this.transaction_effect_group;
}
 
 
// Automatically generated. Retrieves the `transaction-publications` constructor field of the `:scheduler-transaction` type.
export function scheduler_transaction_fs_transaction_publications(_this) /* forall<e> (scheduler-transaction<e>) -> kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/work-transaction/work-publication<e>> */  {
  return _this.transaction_publications;
}
 
export function scheduler_transaction_fs__copy(_this, transaction_root_key, transaction_derive_group, transaction_effect_group, transaction_publications) /* forall<e> (scheduler-transaction<e>, transaction-root-key : ? kokaine/reactive/internal/model/root-key, transaction-derive-group : ? (kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>), transaction-effect-group : ? (kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>), transaction-publications : ? (kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/work-transaction/work-publication<e>>)) -> scheduler-transaction<e> */  {
  if (transaction_root_key !== undefined) {
    var _x52 = transaction_root_key;
  }
  else {
    var _x52 = _this.transaction_root_key;
  }
  if (transaction_derive_group !== undefined) {
    var _x53 = transaction_derive_group;
  }
  else {
    var _x53 = _this.transaction_derive_group;
  }
  if (transaction_effect_group !== undefined) {
    var _x54 = transaction_effect_group;
  }
  else {
    var _x54 = _this.transaction_effect_group;
  }
  if (transaction_publications !== undefined) {
    var _x55 = transaction_publications;
  }
  else {
    var _x55 = _this.transaction_publications;
  }
  return Scheduler_transaction(_x52, _x53, _x54, _x55);
}
 
export function scheduler_transaction_fs_state(transaction) /* forall<e> (transaction : scheduler-transaction<e>) -> kokaine/reactive/internal/work-transaction/work-transaction-state */  {
  var _x56 = transaction.transaction_derive_group;
  return $kokaine_reactive_internal_work_dash_transaction.work_group_fs_state(_x56);
}
 
export function plane_has_group(plane, expected) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, expected : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>) -> bool */  {
  var _x58 = plane.plane_work_group;
  var _x57 = _x58.value;
  if (_x57 === null) {
    return false;
  }
  else {
    var _x59 = _x57.value.group_state;
    var _x60 = expected.group_state;
    return Object.is(_x59,_x60);
  }
}
 
export function check_transaction_root(root, transaction) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, transaction : scheduler-transaction<e>) -> exn () */  {
   
  var _x_x1_10764 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3360> */ ) {
      return root_0.root_key;
    }, root);
   
  var _x_x2_10765 = $std_core_hnd._open_none1(function(_this /* scheduler-transaction<3360> */ ) {
      return _this.transaction_root_key;
    }, transaction);
  var _x61 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/model/root-key */ , right /* kokaine/reactive/internal/model/root-key */ ) {
      var _x62 = left;
      var _x63 = right;
      return Object.is(_x62,_x63);
    }, _x_x1_10764, _x_x2_10765);
  if (_x61) {
     
    var value_10591 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3360> */ ) {
        return root_1.root_disposed;
      }, root);
     
    var _x_x1_2_10769 = value_10591.value;
    var _x64 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_2_10769);
    if (_x64) {
       
      var value_0_10594 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<3360> */ ) {
          return root_2.root_disposing;
        }, root);
       
      var _x_x1_4_10771 = value_0_10594.value;
      var _x65 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
          return (b_0) ? false : true;
        }, _x_x1_4_10771);
      if (_x65) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_exn.$throw("scheduler transaction used outside its live reactive root");
      }
    }
    else {
      return $std_core_exn.$throw("scheduler transaction used outside its live reactive root");
    }
  }
  else {
    return $std_core_exn.$throw("scheduler transaction used outside its live reactive root");
  }
}
 
 
// monadic lift
export function _mlift_check_active_transaction_10941(root, transaction, _c_x10346) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, transaction : scheduler-transaction<e1>, bool) -> () */  {
   
  var _x_x1_1_10774 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3492> */ ) {
      return root_1.root_derive_plane;
    }, root);
   
  var _x_x2_10775 = $std_core_hnd._open_none1(function(_this_0 /* scheduler-transaction<3492> */ ) {
      return _this_0.transaction_derive_group;
    }, transaction);
  var _x66 = $std_core_hnd._open_none2(function(plane /* kokaine/reactive/internal/model/plane<total> */ , expected /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */ ) {
      var _x68 = plane.plane_work_group;
      var _x67 = _x68.value;
      if (_x67 === null) {
        return false;
      }
      else {
        var _x69 = _x67.value.group_state;
        var _x70 = expected.group_state;
        return Object.is(_x69,_x70);
      }
    }, _x_x1_1_10774, _x_x2_10775);
  if (_x66) {
     
    var _x_x1_4_10778 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<3492> */ ) {
        return root_2.root_effect_plane;
      }, root);
     
    var _x_x2_0_10779 = $std_core_hnd._open_none1(function(_this_1 /* scheduler-transaction<3492> */ ) {
        return _this_1.transaction_effect_group;
      }, transaction);
    var _x71 = $std_core_hnd._open_none2(function(plane_1 /* kokaine/reactive/internal/model/plane<3492> */ , expected_0 /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<3492>> */ ) {
        var _x73 = plane_1.plane_work_group;
        var _x72 = _x73.value;
        if (_x72 === null) {
          return false;
        }
        else {
          var _x74 = _x72.value.group_state;
          var _x75 = expected_0.group_state;
          return Object.is(_x74,_x75);
        }
      }, _x_x1_4_10778, _x_x2_0_10779);
    if (_x71) {
      if (_c_x10346) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_exn.$throw("scheduler transaction is not active on this root");
      }
    }
    else {
      return $std_core_exn.$throw("scheduler transaction is not active on this root");
    }
  }
  else {
    return $std_core_exn.$throw("scheduler transaction is not active on this root");
  }
}
 
 
// monadic lift
export function _mlift_check_active_transaction_10942(root, transaction, wild__) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, transaction : scheduler-transaction<e1>, wild_ : ()) -> exn () */  {
   
  var value_10596 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3492> */ ) {
      return root_0.root_work_publications;
    }, root);
   
  var _x76 = value_10596.value;
  if (_x76 !== null) {
     
    var right_10599 = $std_core_hnd._open_none1(function(_this /* scheduler-transaction<3492> */ ) {
        return _this.transaction_publications;
      }, transaction);
    var x_11033 = Object.is((_x76.value),right_10599);
  }
  else {
    var x_11033 = false;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10346 /* bool */ ) {
      return _mlift_check_active_transaction_10941(root, transaction, _c_x10346);
    });
  }
  else {
    return _mlift_check_active_transaction_10941(root, transaction, x_11033);
  }
}
 
export function check_active_transaction(root, transaction) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, transaction : scheduler-transaction<e>) -> exn () */  {
   
  var x_11035 = check_transaction_root(root, transaction);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_check_active_transaction_10942(root, transaction, wild__);
    });
  }
  else {
     
    var value_10596 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3492> */ ) {
        return root_0.root_work_publications;
      }, root);
     
    var _x76 = value_10596.value;
    if (_x76 !== null) {
       
      var right_10599 = $std_core_hnd._open_none1(function(_this /* scheduler-transaction<3492> */ ) {
          return _this.transaction_publications;
        }, transaction);
      var x_0_11038 = Object.is((_x76.value),right_10599);
    }
    else {
      var x_0_11038 = false;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10346 /* bool */ ) {
        return _mlift_check_active_transaction_10941(root, transaction, _c_x10346);
      });
    }
    else {
       
      var _x_x1_1_10774 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3492> */ ) {
          return root_1.root_derive_plane;
        }, root);
       
      var _x_x2_10775 = $std_core_hnd._open_none1(function(_this_0 /* scheduler-transaction<3492> */ ) {
          return _this_0.transaction_derive_group;
        }, transaction);
      var _x76 = $std_core_hnd._open_none2(function(plane /* kokaine/reactive/internal/model/plane<total> */ , expected /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */ ) {
          var _x78 = plane.plane_work_group;
          var _x77 = _x78.value;
          if (_x77 === null) {
            return false;
          }
          else {
            var _x79 = _x77.value.group_state;
            var _x80 = expected.group_state;
            return Object.is(_x79,_x80);
          }
        }, _x_x1_1_10774, _x_x2_10775);
      if (_x76) {
         
        var _x_x1_4_10778 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<3492> */ ) {
            return root_2.root_effect_plane;
          }, root);
         
        var _x_x2_0_10779 = $std_core_hnd._open_none1(function(_this_1 /* scheduler-transaction<3492> */ ) {
            return _this_1.transaction_effect_group;
          }, transaction);
        var _x81 = $std_core_hnd._open_none2(function(plane_1 /* kokaine/reactive/internal/model/plane<3492> */ , expected_0 /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<3492>> */ ) {
            var _x83 = plane_1.plane_work_group;
            var _x82 = _x83.value;
            if (_x82 === null) {
              return false;
            }
            else {
              var _x84 = _x82.value.group_state;
              var _x85 = expected_0.group_state;
              return Object.is(_x84,_x85);
            }
          }, _x_x1_4_10778, _x_x2_0_10779);
        if (_x81) {
          if (x_0_11038) {
            return $std_core_types.Unit;
          }
          else {
            return $std_core_exn.$throw("scheduler transaction is not active on this root");
          }
        }
        else {
          return $std_core_exn.$throw("scheduler transaction is not active on this root");
        }
      }
      else {
        return $std_core_exn.$throw("scheduler transaction is not active on this root");
      }
    }
  }
}
 
export function detach_matching_group(plane, expected) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, expected : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>) -> () */  {
  var _x87 = plane.plane_work_group;
  var _x86 = _x87.value;
  if (_x86 === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x89 = _x86.value.group_state;
    var _x90 = expected.group_state;
    var _x88 = Object.is(_x89,_x90);
    if (_x88) {
      var _x91 = plane.plane_work_group;
      return ((_x91).value = ($std_core_types.Nothing));
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
export function detach_matching_publications(root, expected) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, expected : kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/work-transaction/work-publication<e>>) -> () */  {
  var _x93 = root.root_work_publications;
  var _x92 = _x93.value;
  if (_x92 === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x94 = Object.is((_x92.value),expected);
    if (_x94) {
      var _x95 = root.root_work_publications;
      return ((_x95).value = ($std_core_types.Nothing));
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_prepare_work_publications_loop_10943(rest, _y_x10358) /* forall<e> (rest : list<kokaine/reactive/internal/work-transaction/work-publication<e>>, ()) -> <exn|e> () */  {
  return prepare_work_publications_loop(rest);
}
 
export function prepare_work_publications_loop(values) /* forall<e> (values : list<kokaine/reactive/internal/work-transaction/work-publication<e>>) -> <exn|e> () */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var prepare = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/work-transaction/work-publication<3671> */ ) {
        return _this.publication_prepare;
      }, values.head);
     
    var x_11041 = prepare();
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10358_0 /* () */ ) {
        return _mlift_prepare_work_publications_loop_10943(values.tail, _y_x10358_0);
      });
    }
    else {
      {
        // tail call
        values = values.tail;
        continue tailcall;
      }
    }
  }
}}
 
export function prepare_work_publications(values) /* forall<e> (values : list<kokaine/reactive/internal/work-transaction/work-publication<e>>) -> <exn|e> () */  {
  return prepare_work_publications_loop(values);
}
 
export function publish_work_publications_loop(values) /* forall<e> (values : list<kokaine/reactive/internal/work-transaction/work-publication<e>>) -> () */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x96 = values.head.publication_publish();
    {
      // tail call
      values = values.tail;
      continue tailcall;
    }
  }
}}
 
export function publish_work_publications(values) /* forall<e> (values : list<kokaine/reactive/internal/work-transaction/work-publication<e>>) -> () */  {
  return publish_work_publications_loop(values);
}
 
export function prepend_bootstrap_retirements(values, collected) /* forall<e> (values : list<kokaine/reactive/internal/model/work<e>>, collected : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return collected;
  }
  else {
    if (values.head._tag === 2) {
      {
        // tail call
        var _x98 = function(_scope97 /* kokaine/reactive/internal/model/continuation-scope<3816> */ ) {
          return $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
              return $kokaine_reactive_internal_lifetime.scope_retirement_expand(_scope97);
            }), collected);
        }(values.head.bootstrap_scope);
        values = values.tail;
        collected = _x98;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        values = values.tail;
        continue tailcall;
      }
    }
  }
}}
 
export function prepend_pure_bootstrap_retirements(values, collected) /* forall<e> (values : list<kokaine/reactive/internal/model/work<total>>, collected : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return collected;
  }
  else {
    if (values.head._tag === 2) {
       
      var structural = $kokaine_reactive_internal_lifetime.widen_pure_retirement($kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.scope_retirement_expand(values.head.bootstrap_scope);
      }));
      {
        // tail call
        var _x99 = $std_core_types.Cons(structural, collected);
        values = values.tail;
        collected = _x99;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        values = values.tail;
        continue tailcall;
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_prepend_publication_rollbacks_10944(_c_x10370) /* forall<e> (() -> <exn|e> ()) -> () */  {
  return _c_x10370();
}
 
export function prepend_publication_rollbacks(values, collected) /* forall<e> (values : list<kokaine/reactive/internal/work-transaction/work-publication<e>>, collected : list<kokaine/reactive/internal/model/retirement-work<e>>) -> div list<kokaine/reactive/internal/model/retirement-work<e>> */  { tailcall: while(1)
{
  if (values === null) {
    return collected;
  }
  else {
    {
      // tail call
      var _x101 = function(_current100 /* kokaine/reactive/internal/work-transaction/work-publication<3956> */ ) {
        return $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_finalizer(function() {
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_c_x10370_0 /* () -> <exn|3956> () */ ) {
                return _mlift_prepend_publication_rollbacks_10944(_c_x10370_0);
              });
            }
            else {
              var _x102 = _current100.publication_rollback;
              return _mlift_prepend_publication_rollbacks_10944(_x102);
            }
          }), collected);
      }(values.head);
      values = values.tail;
      collected = _x101;
      continue tailcall;
    }
  }
}}
 
 
// monadic lift
export function _mlift_retire_transaction_bootstraps_10945(root, finalizers) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, finalizers : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var _x_x1_3_10790 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4029> */ ) {
      return root_0.root_lifetime;
    }, root);
  return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<4029> */ ) {
        return _this.lifetime_retirement;
      }, _x_x1_3_10790), finalizers);
}
 
 
// monadic lift
export function _mlift_retire_transaction_bootstraps_10946(root, structural) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, structural : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_11047 = $std_core_hnd._open_none1(function(values /* list<kokaine/reactive/internal/model/retirement-work<4029>> */ ) {
      return $kokaine_reactive_internal_lifetime.collect_retirement_loop(values, $std_core_types.Nil);
    }, structural);
   
  function next_11048(finalizers) /* (list<kokaine/reactive/internal/model/retirement-work<4029>>) -> <div,exn|4029> () */  {
     
    var _x_x1_3_10790 = $std_core_hnd._open_none1(function(root_0_0 /* kokaine/reactive/internal/model/root<4029> */ ) {
        return root_0_0.root_lifetime;
      }, root);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<4029> */ ) {
          return _this.lifetime_retirement;
        }, _x_x1_3_10790), finalizers);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_11048);
  }
  else {
    return next_11048(x_11047);
  }
}
 
 
// monadic lift
export function _mlift_retire_transaction_bootstraps_10947(derive_owned, root, effect_structural) /* forall<e> (derive-owned : list<kokaine/reactive/internal/model/work<total>>, root : kokaine/reactive/internal/model/root<e>, effect-structural : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_11051 = $std_core_hnd._open_none2(prepend_pure_bootstrap_retirements, derive_owned, effect_structural);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(structural /* list<kokaine/reactive/internal/model/retirement-work<4029>> */ ) {
      return _mlift_retire_transaction_bootstraps_10946(root, structural);
    });
  }
  else {
    return _mlift_retire_transaction_bootstraps_10946(root, x_11051);
  }
}
 
 
// monadic lift
export function _mlift_retire_transaction_bootstraps_10948(derive_owned, effect_owned, root, rollbacks) /* forall<e> (derive-owned : list<kokaine/reactive/internal/model/work<total>>, effect-owned : list<kokaine/reactive/internal/model/work<e>>, root : kokaine/reactive/internal/model/root<e>, rollbacks : list<kokaine/reactive/internal/model/retirement-work<e>>) -> <div,exn|e> () */  {
   
  var x_11053 = $std_core_hnd._open_none2(prepend_bootstrap_retirements, effect_owned, rollbacks);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(effect_structural /* list<kokaine/reactive/internal/model/retirement-work<4029>> */ ) {
      return _mlift_retire_transaction_bootstraps_10947(derive_owned, root, effect_structural);
    });
  }
  else {
    return _mlift_retire_transaction_bootstraps_10947(derive_owned, root, x_11053);
  }
}
 
export function retire_transaction_bootstraps(root, derive_owned, effect_owned, publications) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, derive-owned : list<kokaine/reactive/internal/model/work<total>>, effect-owned : list<kokaine/reactive/internal/model/work<e>>, publications : list<kokaine/reactive/internal/work-transaction/work-publication<e>>) -> <div,exn|e> () */  {
   
  var x_11055 = $std_core_hnd._open_none2(prepend_publication_rollbacks, publications, $std_core_types.Nil);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(rollbacks /* list<kokaine/reactive/internal/model/retirement-work<4029>> */ ) {
      return _mlift_retire_transaction_bootstraps_10948(derive_owned, effect_owned, root, rollbacks);
    });
  }
  else {
     
    var x_0_11058 = $std_core_hnd._open_none2(prepend_bootstrap_retirements, effect_owned, x_11055);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(effect_structural /* list<kokaine/reactive/internal/model/retirement-work<4029>> */ ) {
        return _mlift_retire_transaction_bootstraps_10947(derive_owned, root, effect_structural);
      });
    }
    else {
       
      var x_1_11061 = $std_core_hnd._open_none2(prepend_pure_bootstrap_retirements, derive_owned, x_0_11058);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(structural /* list<kokaine/reactive/internal/model/retirement-work<4029>> */ ) {
          return _mlift_retire_transaction_bootstraps_10946(root, structural);
        });
      }
      else {
         
        var x_2_11064 = $std_core_hnd._open_none1(function(values /* list<kokaine/reactive/internal/model/retirement-work<4029>> */ ) {
            return $kokaine_reactive_internal_lifetime.collect_retirement_loop(values, $std_core_types.Nil);
          }, x_1_11061);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(finalizers /* list<kokaine/reactive/internal/model/retirement-work<4029>> */ ) {
             
            var _x_x1_3_10790 = $std_core_hnd._open_none1(function(root_0_0 /* kokaine/reactive/internal/model/root<4029> */ ) {
                return root_0_0.root_lifetime;
              }, root);
            return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<4029> */ ) {
                  return _this.lifetime_retirement;
                }, _x_x1_3_10790), finalizers);
          });
        }
        else {
           
          var _x_x1_3_10790_0 = $std_core_hnd._open_none1(function(root_0_1 /* kokaine/reactive/internal/model/root<4029> */ ) {
              return root_0_1.root_lifetime;
            }, root);
          return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<4029> */ ) {
                return _this_0.lifetime_retirement;
              }, _x_x1_3_10790_0), x_2_11064);
        }
      }
    }
  }
}
 
export function abort_work_transaction(root, transaction) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, transaction : scheduler-transaction<e>) -> <exn|e> () */  {
   
  var _x_x1_0_10793 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4363> */ ) {
      return root_0.root_key;
    }, root);
   
  var _x_x2_10794 = $std_core_hnd._open_none1(function(_this /* scheduler-transaction<4363> */ ) {
      return _this.transaction_root_key;
    }, transaction);
   
  var _x_x1_10792 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/model/root-key */ , right /* kokaine/reactive/internal/model/root-key */ ) {
      var _x103 = left;
      var _x104 = right;
      return Object.is(_x103,_x104);
    }, _x_x1_0_10793, _x_x2_10794);
  var _x103 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_10792);
  if (_x103) {
    return $std_core_types.Unit;
  }
  else {
     
    var derive_group = $std_core_hnd._open_none1(function(_this_0 /* scheduler-transaction<4363> */ ) {
        return _this_0.transaction_derive_group;
      }, transaction);
     
    var effect_group = $std_core_hnd._open_none1(function(_this_1 /* scheduler-transaction<4363> */ ) {
        return _this_1.transaction_effect_group;
      }, transaction);
    var _x104 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, derive_group);
    if (_x104._tag === 5) {
      return $std_core_types.Unit;
    }
    else if (_x104._tag === 6) {
       
      var _x_x1_6_10800 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<4363> */ ) {
          return root_1.root_derive_plane;
        }, root);
       
      $std_core_hnd._open_none2(detach_matching_group, _x_x1_6_10800, derive_group);
       
      var _x_x1_8_10803 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<4363> */ ) {
          return root_2.root_effect_plane;
        }, root);
       
      $std_core_hnd._open_none2(detach_matching_group, _x_x1_8_10803, effect_group);
       
      var _x_x2_2_10807 = $std_core_hnd._open_none1(function(_this_2 /* scheduler-transaction<4363> */ ) {
          return _this_2.transaction_publications;
        }, transaction);
       
      $std_core_hnd._open_none2(detach_matching_publications, root, _x_x2_2_10807);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear, derive_group);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear, effect_group);
       
      var _x_x1_14_10811 = $std_core_hnd._open_none1(function(_this_3 /* scheduler-transaction<4363> */ ) {
          return _this_3.transaction_publications;
        }, transaction);
      return $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear, _x_x1_14_10811);
    }
    else {
       
      var derive_owned = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_rollback, derive_group);
       
      var effect_owned = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_rollback, effect_group);
       
      var _x_x1_18_10815 = $std_core_hnd._open_none1(function(_this_4 /* scheduler-transaction<4363> */ ) {
          return _this_4.transaction_publications;
        }, transaction);
       
      var publications = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_values, _x_x1_18_10815);
       
      var _x_x1_20_10817 = $std_core_hnd._open_none1(function(_this_5 /* scheduler-transaction<4363> */ ) {
          return _this_5.transaction_publications;
        }, transaction);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear, _x_x1_20_10817);
       
      var _x_x1_22_10819 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<4363> */ ) {
          return root_3.root_derive_plane;
        }, root);
       
      $std_core_hnd._open_none2(detach_matching_group, _x_x1_22_10819, derive_group);
       
      var _x_x1_24_10822 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<4363> */ ) {
          return root_4.root_effect_plane;
        }, root);
       
      $std_core_hnd._open_none2(detach_matching_group, _x_x1_24_10822, effect_group);
       
      var _x_x2_5_10826 = $std_core_hnd._open_none1(function(_this_6 /* scheduler-transaction<4363> */ ) {
          return _this_6.transaction_publications;
        }, transaction);
       
      $std_core_hnd._open_none2(detach_matching_publications, root, _x_x2_5_10826);
       
      var claimed = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_aborted, derive_group);
       
      $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_clear, effect_group);
      var _x105 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
          return (b_0) ? false : true;
        }, claimed);
      if (_x105) {
        return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "scheduler transaction abort lost its active state");
      }
      else {
        return retire_transaction_bootstraps(root, derive_owned, effect_owned, publications);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_commit_work_transaction_10949(completed, derive_group, effect_group, publications, root, transaction, wild___0) /* forall<_e,e1> (completed : ref<global,bool>, derive-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, effect-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e1>>, publications : list<kokaine/reactive/internal/work-transaction/work-publication<e1>>, root : kokaine/reactive/internal/model/root<e1>, transaction : scheduler-transaction<e1>, wild_@0 : ()) -> <exn|e1> () */  {
   
  var derive_residual = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_all, derive_group);
   
  var effect_residual = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_take_all, effect_group);
   
  var _x_x1_7_10842 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4686> */ ) {
      return root_0.root_derive_plane;
    }, root);
   
  $std_core_hnd._open_none2(detach_matching_group, _x_x1_7_10842, derive_group);
   
  var _x_x1_9_10845 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<4686> */ ) {
      return root_1.root_effect_plane;
    }, root);
   
  $std_core_hnd._open_none2(detach_matching_group, _x_x1_9_10845, effect_group);
   
  var _x_x2_2_10849 = $std_core_hnd._open_none1(function(_this_2 /* scheduler-transaction<4686> */ ) {
      return _this_2.transaction_publications;
    }, transaction);
   
  $std_core_hnd._open_none2(detach_matching_publications, root, _x_x2_2_10849);
   
  var _x_x1_14_10853 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<4686> */ ) {
      return root_2.root_derive_plane;
    }, root);
   
  var _x_x1_13_10851 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
      return plane.plane_queue;
    }, _x_x1_14_10853);
   
  $std_core_hnd._open_none2(function(target /* kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<total>> */ , values_0 /* list<kokaine/reactive/internal/model/work<total>> */ ) {
      return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(target, values_0);
    }, _x_x1_13_10851, derive_residual);
   
  var _x_x1_17_10857 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<4686> */ ) {
      return root_3.root_effect_plane;
    }, root);
   
  var _x_x1_16_10855 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<4686> */ ) {
      return plane_0.plane_queue;
    }, _x_x1_17_10857);
   
  $std_core_hnd._open_none2(function(target_0 /* kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<4686>> */ , values_1 /* list<kokaine/reactive/internal/model/work<4686>> */ ) {
      return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(target_0, values_1);
    }, _x_x1_16_10855, effect_residual);
  var _x106 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_committed, derive_group);
  if (_x106) {
     
    $std_core_hnd._open_none1(function(values_2 /* list<kokaine/reactive/internal/work-transaction/work-publication<4686>> */ ) {
        return publish_work_publications_loop(values_2);
      }, publications);
     
    var _x_x1_21_10861 = $std_core_hnd._open_none1(function(_this_3 /* scheduler-transaction<4686> */ ) {
        return _this_3.transaction_publications;
      }, transaction);
     
    $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_clear, _x_x1_21_10861);
     
    $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_release_rollback, derive_group);
     
    $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_release_rollback, effect_group);
    return ((completed).value = true);
  }
  else {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "scheduler transaction commit lost its ready state");
  }
}
 
 
// monadic lift
export function _mlift_commit_work_transaction_10950(root, transaction, wild__) /* forall<_e,_e1,_e2,e3> (root : kokaine/reactive/internal/model/root<e3>, transaction : scheduler-transaction<e3>, wild_ : ()) -> <exn|e3> () */  {
   
  var derive_group = $std_core_hnd._open_none1(function(_this /* scheduler-transaction<4686> */ ) {
      return _this.transaction_derive_group;
    }, transaction);
   
  var effect_group = $std_core_hnd._open_none1(function(_this_0 /* scheduler-transaction<4686> */ ) {
      return _this_0.transaction_effect_group;
    }, transaction);
  var _x107 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, derive_group);
  if (_x107._tag === 3) {
     
    var completed = { value: false };
     
    var _x_x1_3_10838 = $std_core_hnd._open_none1(function(_this_1 /* scheduler-transaction<4686> */ ) {
        return _this_1.transaction_publications;
      }, transaction);
     
    var publications = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_values, _x_x1_3_10838);
     
    var x_11071 = prepare_work_publications_loop(publications);
    if ($std_core_hnd._yielding()) {
      var _x109 = $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_commit_work_transaction_10949(completed, derive_group, effect_group, publications, root, transaction, wild___0);
      });
    }
    else {
      var _x109 = _mlift_commit_work_transaction_10949(completed, derive_group, effect_group, publications, root, transaction, x_11071);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x108 = completed.value;
        if (_x108) {
          return $std_core_types.Unit;
        }
        else {
          return abort_work_transaction(root, transaction);
        }
      }, _x109);
  }
  else {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "scheduler transaction must drain successfully before commit");
  }
}
 
export function commit_work_transaction(root, transaction) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, transaction : scheduler-transaction<e>) -> <div,exn|e> () */  {
   
  var x_11074 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), check_active_transaction, root, transaction);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_commit_work_transaction_10950(root, transaction, wild__);
    });
  }
  else {
    return _mlift_commit_work_transaction_10950(root, transaction, x_11074);
  }
}
 
export function check_root(root, key) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, key : kokaine/reactive/internal/model/root-key) -> exn () */  {
   
  var _x_x1_10869 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4755> */ ) {
      return root_0.root_key;
    }, root);
  var _x110 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/model/root-key */ , right /* kokaine/reactive/internal/model/root-key */ ) {
      var _x111 = left;
      var _x112 = right;
      return Object.is(_x111,_x112);
    }, _x_x1_10869, key);
  if (_x110) {
     
    var value_10682 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<4755> */ ) {
        return root_1.root_disposed;
      }, root);
     
    var _x_x1_1_10873 = value_10682.value;
    var _x113 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_1_10873);
    if (_x113) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("signal used outside its live reactive root");
    }
  }
  else {
    return $std_core_exn.$throw("signal used outside its live reactive root");
  }
}
 
export function check_registration(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> exn () */  {
   
  var value_10684 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4823> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x114 = value_10684.value;
  if (_x114) {
    return $std_core_exn.$throw("reactive value created in a disposed root");
  }
  else {
     
    var value_0_10686 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<4823> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x115 = value_0_10686.value;
    if (_x115) {
      return $std_core_exn.$throw("reactive value created in a disposed root");
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_current_work_transaction_10951(root, wild__) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, wild_ : ()) -> exn maybe<scheduler-transaction<e1>> */  {
   
  var _x_x1_10876 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<5079> */ ) {
      return root_0.root_derive_plane;
    }, root);
   
  var value_10688 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
      return plane.plane_work_group;
    }, _x_x1_10876);
  var _x116 = value_10688.value;
   
  var _x_x1_1_10878 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<5079> */ ) {
      return root_1.root_effect_plane;
    }, root);
   
  var value_0_10691 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<5079> */ ) {
      return plane_0.plane_work_group;
    }, _x_x1_1_10878);
  var _x117 = value_0_10691.value;
   
  var value_1_10694 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<5079> */ ) {
      return root_2.root_work_publications;
    }, root);
  var _x118 = value_1_10694.value;
  if (_x116 === null && _x117 === null && _x118 === null) {
    return $std_core_types.Nothing;
  }
  else if (_x116 !== null && _x117 !== null && _x118 !== null) {
     
    var _x_x1_4_10881 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */ , right /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<5079>> */ ) {
        var _x119 = left.group_state;
        var _x120 = right.group_state;
        return Object.is(_x119,_x120);
      }, _x116.value, _x117.value);
    var _x119 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_4_10881);
    if (_x119) {
      return $std_core_exn.$throw("reactive planes disagree about the active transaction");
    }
    else {
      var _x120 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, _x116.value);
      if (_x120._tag === 1) {
        return $std_core_types.Just(Scheduler_transaction($std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<5079> */ ) {
              return root_3.root_key;
            }, root), _x116.value, _x117.value, _x118.value));
      }
      else if (_x120._tag === 2) {
        return $std_core_types.Just(Scheduler_transaction($std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<5079> */ ) {
              return root_4.root_key;
            }, root), _x116.value, _x117.value, _x118.value));
      }
      else {
        return $std_core_exn.$throw("cannot join a terminal scheduler transaction");
      }
    }
  }
  else {
    return $std_core_exn.$throw("reactive root has a partially attached transaction");
  }
}
 
 
// Structural adapters can be invoked recursively while an outer bootstrap is
// draining. They must join that exact transaction instead of opening a second
// pair of local groups or scanning the global frontier. The returned value is
// only a borrowed capability; ownership remains with the caller which opened
// the transaction.
export function current_work_transaction(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> exn maybe<scheduler-transaction<e>> */  {
   
  var x_11076 = check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_current_work_transaction_10951(root, wild__);
    });
  }
  else {
     
    var _x_x1_10876 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<5079> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    var value_10688 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
        return plane.plane_work_group;
      }, _x_x1_10876);
    var _x121 = value_10688.value;
     
    var _x_x1_1_10878 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<5079> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    var value_0_10691 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<5079> */ ) {
        return plane_0.plane_work_group;
      }, _x_x1_1_10878);
    var _x122 = value_0_10691.value;
     
    var value_1_10694 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<5079> */ ) {
        return root_2.root_work_publications;
      }, root);
    var _x123 = value_1_10694.value;
    if (_x121 === null && _x122 === null && _x123 === null) {
      return $std_core_types.Nothing;
    }
    else if (_x121 !== null && _x122 !== null && _x123 !== null) {
       
      var _x_x1_4_10881 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>> */ , right /* kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<5079>> */ ) {
          var _x124 = left.group_state;
          var _x125 = right.group_state;
          return Object.is(_x124,_x125);
        }, _x121.value, _x122.value);
      var _x124 = $std_core_hnd._open_none1(function(b /* bool */ ) {
          return (b) ? false : true;
        }, _x_x1_4_10881);
      if (_x124) {
        return $std_core_exn.$throw("reactive planes disagree about the active transaction");
      }
      else {
        var _x125 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_state, _x121.value);
        if (_x125._tag === 1) {
          return $std_core_types.Just(Scheduler_transaction($std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<5079> */ ) {
                return root_3.root_key;
              }, root), _x121.value, _x122.value, _x123.value));
        }
        else if (_x125._tag === 2) {
          return $std_core_types.Just(Scheduler_transaction($std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<5079> */ ) {
                return root_4.root_key;
              }, root), _x121.value, _x122.value, _x123.value));
        }
        else {
          return $std_core_exn.$throw("cannot join a terminal scheduler transaction");
        }
      }
    }
    else {
      return $std_core_exn.$throw("reactive root has a partially attached transaction");
    }
  }
}
 
export function settle_failure(message) /* (message : string) -> kokaine/reactive/internal/model/settle-result */  {
  var _x126 = $kokaine_internal_compat.capture_error(function() {
    return $std_core_exn.$throw(message);
  });
  if (_x126._tag === 1) {
    return $kokaine_reactive_internal_model.Settle_failed(_x126.error);
  }
  else {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
}
 
export function settle_entry_node(plane, current, gate, child) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<total>>) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x128 = gate.gate_state;
  var _x127 = _x128.value;
  if (_x127 === 3) {
    return settle_trace_recheck(plane, current, gate);
  }
  else if (_x127 === 2) {
     
    var nested = settle_trace_result(plane, child.value);
    var _x130 = gate.gate_state;
    var _x129 = _x130.value;
    if (_x129 === 3) {
      return settle_trace_recheck(plane, current, gate);
    }
    else if (_x129 === 2) {
      return nested;
    }
    else {
      if (nested._tag === 1) {
        return settle_trace_recheck(plane, current, gate);
      }
      else {
        return nested;
      }
    }
  }
  else {
    return settle_trace_recheck(plane, current, gate);
  }
}
 
export function settle_trace_result(plane_0, current_0) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>) -> div kokaine/reactive/internal/model/settle-result */  {
  if (current_0._tag === 1) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (current_0._tag === 2) {
    return settle_read_node(plane_0, current_0, current_0.trace_gate, current_0.trace_entry_target, current_0.trace_child);
  }
  else {
    return settle_entry_node(plane_0, current_0, current_0.entry_gate, current_0.entry_child);
  }
}
 
export function settle_entry_target(plane_1, entry_0) /* (plane : kokaine/reactive/internal/model/plane<total>, entry : maybe<kokaine/reactive/internal/model/trace<total>>) -> div kokaine/reactive/internal/model/settle-result */  {
  if (entry_0 === null) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else {
    var _x131 = $kokaine_reactive_internal_lifetime.trace_state_of(entry_0.value);
    if (_x131 === 2) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else if (_x131 === 3) {
      return settle_trace_result(plane_1, entry_0.value);
    }
    else if (_x131 === 5) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else if (_x131 === 1) {
      var _x132 = $kokaine_internal_compat.capture_error(function() {
        return $std_core_exn.$throw("state entry target is draft");
      });
      if (_x132._tag === 1) {
        return $kokaine_reactive_internal_model.Settle_failed(_x132.error);
      }
      else {
        return $kokaine_reactive_internal_model.Settle_ok;
      }
    }
    else {
      var _x133 = $kokaine_internal_compat.capture_error(function() {
        return $std_core_exn.$throw("cyclic state entry target");
      });
      if (_x133._tag === 1) {
        return $kokaine_reactive_internal_model.Settle_failed(_x133.error);
      }
      else {
        return $kokaine_reactive_internal_model.Settle_ok;
      }
    }
  }
}
 
export function settle_read_child(plane_2, current_1, gate_1, entry_1, child_1) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate, entry : maybe<kokaine/reactive/internal/model/trace<total>>, child : ref<global,kokaine/reactive/internal/model/trace<total>>) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x134 = settle_entry_target(plane_2, entry_1);
  if (_x134._tag === 2) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x134._tag === 3) {
    return $kokaine_reactive_internal_model.Settle_failed(_x134.settle_exception);
  }
  else {
    var _x136 = gate_1.gate_state;
    var _x135 = _x136.value;
    if (_x135 === 5) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else if (_x135 === 2) {
       
      var nested_0 = settle_trace_result(plane_2, child_1.value);
      var _x137 = settle_entry_target(plane_2, entry_1);
      if (_x137._tag === 2) {
        return $kokaine_reactive_internal_model.Settle_deferred;
      }
      else if (_x137._tag === 3) {
        return $kokaine_reactive_internal_model.Settle_failed(_x137.settle_exception);
      }
      else {
        var _x139 = gate_1.gate_state;
        var _x138 = _x139.value;
        if (_x138 === 5) {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
        else {
          if (nested_0._tag === 1) {
            return settle_trace_recheck(plane_2, current_1, gate_1);
          }
          else {
            return nested_0;
          }
        }
      }
    }
    else {
      return settle_trace_recheck(plane_2, current_1, gate_1);
    }
  }
}
 
export function settle_read_node(plane_3, current_2, gate_2, entry_2, child_2) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate, entry : maybe<kokaine/reactive/internal/model/trace<total>>, child : ref<global,kokaine/reactive/internal/model/trace<total>>) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x140 = settle_entry_target(plane_3, entry_2);
  if (_x140._tag === 2) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x140._tag === 3) {
    return $kokaine_reactive_internal_model.Settle_failed(_x140.settle_exception);
  }
  else {
    var _x142 = gate_2.gate_state;
    var _x141 = _x142.value;
    if (_x141 === 5) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else if (_x141 === 2) {
       
      if (gate_2.gate_input_producer === null) {
        var input = $kokaine_reactive_internal_model.Settle_ok;
      }
      else {
        var input = settle_producer_result(gate_2.gate_input_producer.value);
      }
      var _x143 = settle_entry_target(plane_3, entry_2);
      if (_x143._tag === 2) {
        return $kokaine_reactive_internal_model.Settle_deferred;
      }
      else if (_x143._tag === 3) {
        return $kokaine_reactive_internal_model.Settle_failed(_x143.settle_exception);
      }
      else {
        var _x145 = gate_2.gate_state;
        var _x144 = _x145.value;
        if (_x144 === 5) {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
        else {
          if (input._tag === 1) {
            return settle_read_child(plane_3, current_2, gate_2, entry_2, child_2);
          }
          else if (input._tag === 2) {
            return $kokaine_reactive_internal_model.Settle_deferred;
          }
          else {
            return $kokaine_reactive_internal_model.Settle_failed(input.settle_exception);
          }
        }
      }
    }
    else {
      return settle_trace_recheck(plane_3, current_2, gate_2);
    }
  }
}
 
export function settle_producer_body(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> div kokaine/reactive/internal/model/settle-result */  { tailcall: while(1)
{
  var _x147 = producer.producer_scope.scope_lifetime.lifetime_token;
  var _x146 = _x147.value;
  if (_x146 === 3) {
    var _x148 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired branch");
    });
    if (_x148._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x148.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x146 === 4) {
    var _x149 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired scope");
    });
    if (_x149._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x149.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x151 = producer.producer_scope.scope_parent;
    var _x150 = validate_owner_gate(_x151);
    if (_x150._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else if (_x150._tag === 3) {
      return $kokaine_reactive_internal_model.Settle_failed(_x150.settle_exception);
    }
    else {
      var _x153 = producer.producer_scope.scope_lifetime.lifetime_token;
      var _x152 = _x153.value;
      if (_x152 === 1) {
        var _x155 = producer.producer_scope;
        var _x154 = run_bootstrap(_x155);
        if (_x154._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x154.error);
        }
        else {
          {
            // tail call
            continue tailcall;
          }
        }
      }
      else if (_x152 === 2) {
        var _x156 = producer.producer_plane;
        var _x157 = producer.producer_scope.scope_body;
        return settle_trace_result(_x156, _x157.value);
      }
      else if (_x152 === 3) {
        var _x158 = $kokaine_internal_compat.capture_error(function() {
          return $std_core_exn.$throw("derived value belongs to a retired branch");
        });
        if (_x158._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x158.error);
        }
        else {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
      }
      else {
        var _x159 = $kokaine_internal_compat.capture_error(function() {
          return $std_core_exn.$throw("derived value belongs to a retired scope");
        });
        if (_x159._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x159.error);
        }
        else {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
      }
    }
  }
}}
 
export function settle_producer_result(producer_0) /* (producer : kokaine/reactive/internal/model/derive-producer) -> div kokaine/reactive/internal/model/settle-result */  {
   
  var previous_phase = $kokaine_reactive_internal_model.enter_pure_plane();
  var _x162 = producer_0.producer_settling;
  var _x161 = _x162.value;
  if (_x161) {
    var _x163 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic derived continuation");
    });
    if (_x163._tag === 1) {
      var _x160 = $kokaine_reactive_internal_model.Settle_failed(_x163.error);
    }
    else {
      var _x160 = $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
     
    var _x164 = producer_0.producer_settling;
    ((_x164).value = true);
     
    var result = settle_producer_body(producer_0);
     
    var _x165 = producer_0.producer_settling;
    ((_x165).value = false);
    var _x160 = result;
  }
  return $std_core_hnd.finally_prompt(function() {
      return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
    }, _x160);
}
 
export function validate_owner_gate_current(gate_3) /* (gate : kokaine/reactive/internal/model/continuation-gate) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x165 = gate_3.gate_state;
  var _x164 = _x165.value;
  if (_x164 === 2) {
    if (gate_3.gate_input_producer === null) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      var _x166 = settle_producer_result(gate_3.gate_input_producer.value);
      if (_x166._tag === 2) {
        return $kokaine_reactive_internal_model.Settle_deferred;
      }
      else if (_x166._tag === 3) {
        return $kokaine_reactive_internal_model.Settle_failed(_x166.settle_exception);
      }
      else {
        var _x168 = gate_3.gate_state;
        var _x167 = _x168.value;
        if (_x167 === 2) {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
        else if (_x167 === 3) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else if (_x167 === 4) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else {
          var _x169 = $kokaine_internal_compat.capture_error(function() {
            return $std_core_exn.$throw("derived owner changed while validating its input");
          });
          if (_x169._tag === 1) {
            return $kokaine_reactive_internal_model.Settle_failed(_x169.error);
          }
          else {
            return $kokaine_reactive_internal_model.Settle_ok;
          }
        }
      }
    }
  }
  else if (_x164 === 3) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x164 === 4) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x164 === 1) {
    var _x170 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation is draft");
    });
    if (_x170._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x170.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x171 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation was retired");
    });
    if (_x171._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x171.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
}
 
export function validate_owner_gate(parent) /* (parent : maybe<kokaine/reactive/internal/model/continuation-gate>) -> div kokaine/reactive/internal/model/settle-result */  {
  if (parent === null) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else {
    var _x173 = parent.value.gate_parent;
    var _x172 = validate_owner_gate(_x173);
    if (_x172._tag === 1) {
      return validate_owner_gate_current(parent.value);
    }
    else if (_x172._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      return $kokaine_reactive_internal_model.Settle_failed(_x172.settle_exception);
    }
  }
}
 
export function settle_trace_recheck(plane_4, current_3, gate_5) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x175 = gate_5.gate_state;
  var _x174 = _x175.value;
  if (_x174 === 3) {
    var _x177 = gate_5.gate_parent;
    var _x176 = pending_ancestor_loop(_x177);
    if (_x176) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      var _x178 = resume_capture(plane_4, current_3);
      if (_x178._tag === 1) {
        return $kokaine_reactive_internal_model.Settle_failed(_x178.error);
      }
      else {
        return settle_trace_result(plane_4, current_3);
      }
    }
  }
  else if (_x174 === 2) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x174 === 1) {
    var _x179 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a draft derivation");
    });
    if (_x179._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x179.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x174 === 4) {
    var _x180 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a running derivation");
    });
    if (_x180._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x180.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x181 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived continuation was retired");
    });
    if (_x181._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x181.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
}
 
 
// monadic lift
export function _mlift_run_derive_work_10952(current, plane, _c_x10443) /* (current : kokaine/reactive/internal/model/work<total>, plane : kokaine/reactive/internal/model/plane<total>, maybe<kokaine/reactive/internal/model/derive-producer>) -> kokaine/reactive/internal/model/settle-result */  {
  if (_c_x10443 === null) {
    if (current._tag === 1) {
      var _x182 = resume_capture(plane, current.resume_trace);
    }
    else {
      var _x182 = run_bootstrap(current.bootstrap_scope);
    }
    if (_x182._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x182.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    return settle_producer_result(_c_x10443.value);
  }
}
 
export function run_derive_work(plane, current) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/work<total>) -> div kokaine/reactive/internal/model/settle-result */  {
   
  var previous_phase = $kokaine_reactive_internal_model.enter_pure_plane();
   
  if (current._tag === 1) {
    if (current.resume_trace._tag === 1) {
      var x_11083 = $std_core_types.Nothing;
    }
    else if (current.resume_trace._tag === 2) {
      var x_11083 = (current.resume_trace.trace_owner).value;
    }
    else {
      var x_11083 = (current.resume_trace.entry_owner).value;
    }
  }
  else {
    var x_11083 = (current.bootstrap_owner).value;
  }
  if ($std_core_hnd._yielding()) {
    var _x183 = $std_core_hnd.yield_extend(function(_c_x10443 /* maybe<kokaine/reactive/internal/model/derive-producer> */ ) {
      return _mlift_run_derive_work_10952(current, plane, _c_x10443);
    });
  }
  else {
    var _x183 = _mlift_run_derive_work_10952(current, plane, x_11083);
  }
  return $std_core_hnd.finally_prompt(function() {
      return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
    }, _x183);
}
 
export function run_next_derived_loop(plane, deferred) /* (plane : kokaine/reactive/internal/model/plane<total>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> div error<bool> */  { tailcall: while(1)
{
   
  var _x184 = plane.plane_queue;
  var next = take_queued_work_loop(_x184, $std_core_types.Nil);
  if (next === null) {
     
    restore_deferred(plane, deferred);
    return $std_core_types.Ok(false);
  }
  else {
    var _x184 = run_derive_work(plane, next.value);
    if (_x184._tag === 1) {
       
      var _x185 = work_stale(next.value);
      if (_x185) {
        $std_core_types.Unit;
      }
      else {
        if (next.value._tag === 2) {
          var _x186 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x186, next.value);
        }
        else {
          var _x187 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x187, next.value);
        }
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.Ok(true);
    }
    else if (_x184._tag === 2) {
      {
        // tail call
        var _x185 = $std_core_types.Cons(next.value, deferred);
        deferred = _x185;
        continue tailcall;
      }
    }
    else {
       
      var _x186 = work_stale(next.value);
      if (_x186) {
        $std_core_types.Unit;
      }
      else {
        if (next.value._tag === 2) {
          var _x187 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x187, next.value);
        }
        else {
          var _x188 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x188, next.value);
        }
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.$Error(_x184.settle_exception);
    }
  }
}}
 
export function run_next_derived(plane) /* (plane : kokaine/reactive/internal/model/plane<total>) -> div error<bool> */  {
  return run_next_derived_loop(plane, $std_core_types.Nil);
}
 
export function run_next_pure(plane) /* (plane : kokaine/reactive/internal/model/plane<total>) -> error<bool> */  {
  return run_next_derived_loop(plane, $std_core_types.Nil);
}
 
 
// Internal invariant probe used by transaction/root-retirement tests. A
// terminal capability must not retain publication callbacks after ownership
// has been claimed.
export function scheduler_transaction_fs_has_pending_publications(transaction) /* forall<e> (transaction : scheduler-transaction<e>) -> bool */  {
   
  var _x186 = transaction.transaction_publications;
  var list_10213 = $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_values(_x186);
  return (list_10213 === null) ? false : true;
}
 
 
// monadic lift
export function _mlift_open_work_transaction_10953(root, _y_x10448) /* forall<_e,_e1,_e2,_e3,e4> (root : kokaine/reactive/internal/model/root<e4>, hnd/ev-index) -> exn scheduler-transaction<e4> */  {
  return $std_core_hnd._mask_at(_y_x10448, false, function() {
       
      var state = { value: ($kokaine_reactive_internal_work_dash_transaction.Work_open) };
       
      var derive_group = $kokaine_reactive_internal_work_dash_transaction.Work_group(state, $kokaine_reactive_internal_work_dash_transaction.new_work_queue(), $kokaine_reactive_internal_work_dash_transaction.new_work_queue());
       
      var effect_group = $kokaine_reactive_internal_work_dash_transaction.Work_group(state, $kokaine_reactive_internal_work_dash_transaction.new_work_queue(), $kokaine_reactive_internal_work_dash_transaction.new_work_queue());
       
      var publications = $kokaine_reactive_internal_work_dash_transaction.new_work_queue();
       
      var _x186 = root.root_derive_plane.plane_work_group;
      ((_x186).value = ($std_core_types.Just(derive_group)));
       
      var _x187 = root.root_effect_plane.plane_work_group;
      ((_x187).value = ($std_core_types.Just(effect_group)));
       
      var _x188 = root.root_work_publications;
      ((_x188).value = ($std_core_types.Just(publications)));
      var _x186 = root.root_key;
      return Scheduler_transaction(_x186, derive_group, effect_group, publications);
    });
}
 
 
// monadic lift
export function _mlift_open_work_transaction_10954(root, wild__) /* forall<_e,_e1,_e2,_e3,_e4,e5> (root : kokaine/reactive/internal/model/root<e5>, wild_ : ()) -> exn scheduler-transaction<e5> */  {
   
  var _x_x1_0_10887 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<6625> */ ) {
      return root_0.root_derive_plane;
    }, root);
   
  var value_10702 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
      return plane.plane_work_group;
    }, _x_x1_0_10887);
   
  var _x_x1_10889 = value_10702.value;
  var _x187 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>> */ ) {
      return (maybe !== null);
    }, _x_x1_10889);
  if (_x187) {
    return $std_core_exn.$throw("a scheduler transaction is already active on this root");
  }
  else {
     
    var _x_x1_3_10890 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<6625> */ ) {
        return root_1.root_effect_plane;
      }, root);
     
    var value_0_10706 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<6625> */ ) {
        return plane_0.plane_work_group;
      }, _x_x1_3_10890);
     
    var _x_x1_2_10892 = value_0_10706.value;
    var _x188 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<6625>>> */ ) {
        return (maybe_0 !== null);
      }, _x_x1_2_10892);
    if (_x188) {
      return $std_core_exn.$throw("a scheduler transaction is already active on this root");
    }
    else {
       
      var value_1_10710 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<6625> */ ) {
          return root_2.root_work_publications;
        }, root);
       
      var _x_x1_5_10894 = value_1_10710.value;
      var _x189 = $std_core_hnd._open_none1(function(maybe_1 /* maybe<kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/work-transaction/work-publication<6625>>> */ ) {
          return (maybe_1 !== null);
        }, _x_x1_5_10894);
      if (_x189) {
        return $std_core_exn.$throw("a scheduler transaction is already active on this root");
      }
      else {
         
        var x_11085 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10448 /* hnd/ev-index */ ) {
            return _mlift_open_work_transaction_10953(root, _y_x10448);
          });
        }
        else {
          return _mlift_open_work_transaction_10953(root, x_11085);
        }
      }
    }
  }
}
 
export function open_work_transaction(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> exn scheduler-transaction<e> */  {
   
  var x_11087 = check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_open_work_transaction_10954(root, wild__);
    });
  }
  else {
     
    var _x_x1_0_10887 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<6625> */ ) {
        return root_0.root_derive_plane;
      }, root);
     
    var value_10702 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<total> */ ) {
        return plane.plane_work_group;
      }, _x_x1_0_10887);
     
    var _x_x1_10889 = value_10702.value;
    var _x190 = $std_core_hnd._open_none1(function(maybe /* maybe<kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>> */ ) {
        return (maybe !== null);
      }, _x_x1_10889);
    if (_x190) {
      return $std_core_exn.$throw("a scheduler transaction is already active on this root");
    }
    else {
       
      var _x_x1_3_10890 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<6625> */ ) {
          return root_1.root_effect_plane;
        }, root);
       
      var value_0_10706 = $std_core_hnd._open_none1(function(plane_0 /* kokaine/reactive/internal/model/plane<6625> */ ) {
          return plane_0.plane_work_group;
        }, _x_x1_3_10890);
       
      var _x_x1_2_10892 = value_0_10706.value;
      var _x191 = $std_core_hnd._open_none1(function(maybe_0 /* maybe<kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<6625>>> */ ) {
          return (maybe_0 !== null);
        }, _x_x1_2_10892);
      if (_x191) {
        return $std_core_exn.$throw("a scheduler transaction is already active on this root");
      }
      else {
         
        var value_1_10710 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<6625> */ ) {
            return root_2.root_work_publications;
          }, root);
         
        var _x_x1_5_10894 = value_1_10710.value;
        var _x192 = $std_core_hnd._open_none1(function(maybe_1 /* maybe<kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/work-transaction/work-publication<6625>>> */ ) {
            return (maybe_1 !== null);
          }, _x_x1_5_10894);
        if (_x192) {
          return $std_core_exn.$throw("a scheduler transaction is already active on this root");
        }
        else {
           
          var x_0_11090 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10448 /* hnd/ev-index */ ) {
              return _mlift_open_work_transaction_10953(root, _y_x10448);
            });
          }
          else {
            return $std_core_hnd._mask_at(x_0_11090, false, function() {
                 
                var state = { value: ($kokaine_reactive_internal_work_dash_transaction.Work_open) };
                 
                var derive_group = $kokaine_reactive_internal_work_dash_transaction.Work_group(state, $kokaine_reactive_internal_work_dash_transaction.new_work_queue(), $kokaine_reactive_internal_work_dash_transaction.new_work_queue());
                 
                var effect_group = $kokaine_reactive_internal_work_dash_transaction.Work_group(state, $kokaine_reactive_internal_work_dash_transaction.new_work_queue(), $kokaine_reactive_internal_work_dash_transaction.new_work_queue());
                 
                var publications = $kokaine_reactive_internal_work_dash_transaction.new_work_queue();
                 
                var _x193 = root.root_derive_plane.plane_work_group;
                ((_x193).value = ($std_core_types.Just(derive_group)));
                 
                var _x194 = root.root_effect_plane.plane_work_group;
                ((_x194).value = ($std_core_types.Just(effect_group)));
                 
                var _x195 = root.root_work_publications;
                ((_x195).value = ($std_core_types.Just(publications)));
                var _x193 = root.root_key;
                return Scheduler_transaction(_x193, derive_group, effect_group, publications);
              });
          }
        }
      }
    }
  }
}
 
export function restore_group_skipped(group, skipped) /* forall<e> (group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>, skipped : list<kokaine/reactive/internal/model/work<e>>) -> div () */  { tailcall: while(1)
{
  if (skipped === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x194 = group.group_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x194, skipped.head);
    {
      // tail call
      skipped = skipped.tail;
      continue tailcall;
    }
  }
}}
 
export function take_group_work_loop(group, skipped) /* forall<e> (group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>, skipped : list<kokaine/reactive/internal/model/work<e>>) -> div maybe<kokaine/reactive/internal/model/work<e>> */  { tailcall: while(1)
{
  var _x194 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_pop(group);
  if (_x194 === null) {
     
    restore_group_skipped(group, skipped);
    return $std_core_types.Nothing;
  }
  else {
    var _x195 = work_runnable(_x194.value);
    if (_x195) {
       
      restore_group_skipped(group, skipped);
      return $std_core_types.Just(_x194.value);
    }
    else {
      var _x196 = work_stale(_x194.value);
      if (_x196) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        {
          // tail call
          var _x197 = $std_core_types.Cons(_x194.value, skipped);
          skipped = _x197;
          continue tailcall;
        }
      }
    }
  }
}}
 
export function take_group_work(group) /* forall<e> (group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>) -> maybe<kokaine/reactive/internal/model/work<e>> */  {
  return take_group_work_loop(group, $std_core_types.Nil);
}
 
export function restore_group_deferred(group, deferred) /* (group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> () */  {
   
  var values_10234 = $std_core_list.reverse_acc($std_core_types.Nil, deferred);
  var _x198 = group.group_queue;
  return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(_x198, values_10234);
}
 
export function run_next_derived_group_loop(plane, group, deferred) /* (plane : kokaine/reactive/internal/model/plane<total>, group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> div error<bool> */  { tailcall: while(1)
{
  var _x199 = take_group_work_loop(group, $std_core_types.Nil);
  if (_x199 === null) {
     
    restore_group_deferred(group, deferred);
    return $std_core_types.Ok(false);
  }
  else {
    var _x200 = run_derive_work(plane, _x199.value);
    if (_x200._tag === 1) {
       
      var _x201 = work_stale(_x199.value);
      if (_x201) {
        $std_core_types.Unit;
      }
      else {
        var _x202 = group.group_queue;
        $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x202, _x199.value);
      }
       
      restore_group_deferred(group, deferred);
      return $std_core_types.Ok(true);
    }
    else if (_x200._tag === 2) {
      {
        // tail call
        var _x201 = $std_core_types.Cons(_x199.value, deferred);
        deferred = _x201;
        continue tailcall;
      }
    }
    else {
       
      var _x202 = work_stale(_x199.value);
      if (_x202) {
        $std_core_types.Unit;
      }
      else {
        var _x203 = group.group_queue;
        $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x203, _x199.value);
      }
       
      restore_group_deferred(group, deferred);
      return $std_core_types.$Error(_x200.settle_exception);
    }
  }
}}
 
export function run_next_derived_group(plane, group) /* (plane : kokaine/reactive/internal/model/plane<total>, group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>) -> error<bool> */  {
  return run_next_derived_group_loop(plane, group, $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_run_next_effect_group_10955(_c_x10459) /* (error<()>) -> result<bool,exception> */  {
  if (_c_x10459._tag === 1) {
    return $std_core_types.$Error(_c_x10459.error);
  }
  else {
    return $std_core_types.Ok(true);
  }
}
 
export function run_next_effect_group(plane, group) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<e>>) -> <div|e> error<bool> */  {
  var _x202 = take_group_work_loop(group, $std_core_types.Nil);
  if (_x202 === null) {
    return $std_core_types.Ok(false);
  }
  else {
     
    var _x203 = group.group_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x203, _x202.value);
     
    if (_x202.value._tag === 1) {
      var x_11093 = resume_capture(plane, _x202.value.resume_trace);
    }
    else {
      var x_11093 = run_bootstrap(_x202.value.bootstrap_scope);
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_run_next_effect_group_10955);
    }
    else {
      if (x_11093._tag === 1) {
        return $std_core_types.$Error(x_11093.error);
      }
      else {
        return $std_core_types.Ok(true);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_drain_work_transaction_loop_10956(root, transaction, _y_x10462) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, transaction : scheduler-transaction<e>, error<bool>) -> <div|e> result<(),exception> */  {
  if (_y_x10462._tag === 1) {
    return $std_core_types.$Error(_y_x10462.error);
  }
  else if (_y_x10462._tag === 2 && _y_x10462.value) {
    return drain_work_transaction_loop(root, transaction);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function drain_work_transaction_loop(root_0, transaction_0) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, transaction : scheduler-transaction<e>) -> <div|e> error<()> */  { tailcall: while(1)
{
  var _x204 = root_0.root_derive_plane;
  var _x205 = transaction_0.transaction_derive_group;
  var _x203 = run_next_derived_group_loop(_x204, _x205, $std_core_types.Nil);
  if (_x203._tag === 1) {
    return $std_core_types.$Error(_x203.error);
  }
  else if (_x203._tag === 2 && _x203.value) {
    {
      // tail call
      continue tailcall;
    }
  }
  else {
     
    var _x206 = root_0.root_effect_plane;
    var _x207 = transaction_0.transaction_effect_group;
    var x_11096 = run_next_effect_group(_x206, _x207);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10462_0 /* error<bool> */ ) {
        return _mlift_drain_work_transaction_loop_10956(root_0, transaction_0, _y_x10462_0);
      });
    }
    else {
      if (x_11096._tag === 1) {
        return $std_core_types.$Error(x_11096.error);
      }
      else if (x_11096._tag === 2 && x_11096.value) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_drain_work_transaction_10957(_pat_3_0) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_drain_work_transaction_10958(_c_x10475, result, _c_x10476) /* (bool, result : error<()>, ()) -> (error<()>, bool) */  {
  return $std_core_types.Tuple2(result, _c_x10475);
}
 
 
// monadic lift
export function _mlift_drain_work_transaction_10959(completed, result, _c_x10475) /* forall<_e> (completed : ref<global,bool>, result : error<()>, bool) -> (error<()>, bool) */  {
   
  if (_c_x10475) {
    var x_11099 = ((completed).value = true);
  }
  else {
    var x_11099 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10476 /* () */ ) {
      return $std_core_types.Tuple2(result, _c_x10475);
    });
  }
  else {
    return $std_core_types.Tuple2(result, _c_x10475);
  }
}
 
 
// monadic lift
export function _mlift_drain_work_transaction_10960(completed, derive_group, result) /* forall<_e,e1> (completed : ref<global,bool>, derive-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, result : error<()>) -> <div|e1> (error<()>, bool) */  {
   
  if (result._tag === 1) {
    var x_11104 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_failed(derive_group, result.error);
  }
  else {
    var x_11104 = $kokaine_reactive_internal_work_dash_transaction.work_group_fs_mark_ready(derive_group);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10475 /* bool */ ) {
      return _mlift_drain_work_transaction_10959(completed, result, _c_x10475);
    });
  }
  else {
    return _mlift_drain_work_transaction_10959(completed, result, x_11104);
  }
}
 
 
// monadic lift
export function _mlift_drain_work_transaction_10961(_y_x10478) /* forall<e> ((error<()>, bool)) -> <exn,div|e> () */  {
  var _x206 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
      return (b_0) ? false : true;
    }, _y_x10478.snd);
  if (_x206) {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "scheduler transaction could not enter a terminal drain state");
  }
  else {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, _y_x10478.fst);
  }
}
 
 
// monadic lift
export function _mlift_drain_work_transaction_10962(completed, derive_group, root, transaction, _y_x10469) /* forall<_e,_e1,e2> (completed : ref<global,bool>, derive-group : kokaine/reactive/internal/work-transaction/work-group<kokaine/reactive/internal/model/work<total>>, root : kokaine/reactive/internal/model/root<e2>, transaction : scheduler-transaction<e2>, hnd/ev-index) -> <exn,div|e2> () */  {
   
  var x_11106 = $std_core_hnd._mask_at(_y_x10469, false, function() {
       
      var x_1_11114 = drain_work_transaction_loop(root, transaction);
      if ($std_core_hnd._yielding()) {
        var _x208 = $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
          return _mlift_drain_work_transaction_10960(completed, derive_group, result);
        });
      }
      else {
        var _x208 = _mlift_drain_work_transaction_10960(completed, derive_group, x_1_11114);
      }
      return $std_core_hnd.finally_prompt(function() {
          var _x207 = completed.value;
          if (_x207) {
            return $std_core_types.Unit;
          }
          else {
             
            var x_0_11111 = $kokaine_internal_compat.capture_error(function() {
              return abort_work_transaction(root, transaction);
            });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_pat_3_0 /* error<()> */ ) {
                return $std_core_types.Unit;
              });
            }
            else {
              return $std_core_types.Unit;
            }
          }
        }, _x208);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10478 /* (error<()>, bool) */ ) {
      return _mlift_drain_work_transaction_10961(_y_x10478);
    });
  }
  else {
    return _mlift_drain_work_transaction_10961(x_11106);
  }
}
 
 
// monadic lift
export function _mlift_drain_work_transaction_10963(root, transaction, wild__) /* forall<_e,_e1,_e2,e3> (root : kokaine/reactive/internal/model/root<e3>, transaction : scheduler-transaction<e3>, wild_ : ()) -> <exn,div|e3> () */  {
   
  var derive_group = $std_core_hnd._open_none1(function(_this /* scheduler-transaction<7515> */ ) {
      return _this.transaction_derive_group;
    }, transaction);
   
  var _x_x1_1_10898 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_begin_drain, derive_group);
  var _x207 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_1_10898);
  if (_x207) {
    return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "scheduler transaction can only be drained while open");
  }
  else {
     
    var completed = { value: false };
     
    var x_11117 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10469 /* hnd/ev-index */ ) {
        return _mlift_drain_work_transaction_10962(completed, derive_group, root, transaction, _y_x10469);
      });
    }
    else {
      return _mlift_drain_work_transaction_10962(completed, derive_group, root, transaction, x_11117);
    }
  }
}
 
export function drain_work_transaction(root, transaction) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, transaction : scheduler-transaction<e>) -> <div,exn|e> () */  {
   
  var x_11119 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), check_active_transaction, root, transaction);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_drain_work_transaction_10963(root, transaction, wild__);
    });
  }
  else {
     
    var derive_group = $std_core_hnd._open_none1(function(_this /* scheduler-transaction<7515> */ ) {
        return _this.transaction_derive_group;
      }, transaction);
     
    var _x_x1_1_10898 = $std_core_hnd._open_none1($kokaine_reactive_internal_work_dash_transaction.work_group_fs_begin_drain, derive_group);
    var _x208 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_1_10898);
    if (_x208) {
      return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "scheduler transaction can only be drained while open");
    }
    else {
       
      var completed = { value: false };
       
      var x_0_11123 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10469 /* hnd/ev-index */ ) {
          return _mlift_drain_work_transaction_10962(completed, derive_group, root, transaction, _y_x10469);
        });
      }
      else {
         
        var x_1_11126 = $std_core_hnd._mask_at(x_0_11123, false, function() {
             
            var x_3_11135 = drain_work_transaction_loop(root, transaction);
            if ($std_core_hnd._yielding()) {
              var _x210 = $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
                return _mlift_drain_work_transaction_10960(completed, derive_group, result);
              });
            }
            else {
              var _x210 = _mlift_drain_work_transaction_10960(completed, derive_group, x_3_11135);
            }
            return $std_core_hnd.finally_prompt(function() {
                var _x209 = completed.value;
                if (_x209) {
                  return $std_core_types.Unit;
                }
                else {
                   
                  var x_2_11132 = $kokaine_internal_compat.capture_error(function() {
                    return abort_work_transaction(root, transaction);
                  });
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(function(_pat_3_0 /* error<()> */ ) {
                      return $std_core_types.Unit;
                    });
                  }
                  else {
                    return $std_core_types.Unit;
                  }
                }
              }, _x210);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10478 /* (error<()>, bool) */ ) {
            return _mlift_drain_work_transaction_10961(_y_x10478);
          });
        }
        else {
          var _x209 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
              return (b_0) ? false : true;
            }, x_1_11126.snd);
          if (_x209) {
            return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "scheduler transaction could not enter a terminal drain state");
          }
          else {
            return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, x_1_11126.fst);
          }
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_stage_work_publication_10964(prepare, publish, rollback, transaction, wild__) /* forall<e> (prepare : () -> <exn|e> (), publish : () -> (), rollback : () -> <exn|e> (), transaction : scheduler-transaction<e>, wild_ : ()) -> exn () */  {
  var _x210 = $std_core_hnd._open_none1(scheduler_transaction_fs_state, transaction);
  if (_x210._tag === 1) {
     
    var _x_x1_0_10907 = $std_core_hnd._open_none1(function(_this /* scheduler-transaction<7633> */ ) {
        return _this.transaction_publications;
      }, transaction);
    return $std_core_hnd._open_none2($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append, _x_x1_0_10907, $kokaine_reactive_internal_work_dash_transaction.Work_publication(prepare, publish, rollback));
  }
  else if (_x210._tag === 2) {
     
    var _x_x1_2_10910 = $std_core_hnd._open_none1(function(_this_0 /* scheduler-transaction<7633> */ ) {
        return _this_0.transaction_publications;
      }, transaction);
    return $std_core_hnd._open_none2($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append, _x_x1_2_10910, $kokaine_reactive_internal_work_dash_transaction.Work_publication(prepare, publish, rollback));
  }
  else {
    return $std_core_exn.$throw("cannot enlist publication in a terminal scheduler transaction");
  }
}
 
export function stage_work_publication(root, transaction, prepare, publish, rollback) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, transaction : scheduler-transaction<e>, prepare : () -> <exn|e> (), publish : () -> (), rollback : () -> <exn|e> ()) -> exn () */  {
   
  var x_11137 = check_active_transaction(root, transaction);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_stage_work_publication_10964(prepare, publish, rollback, transaction, wild__);
    });
  }
  else {
    var _x211 = $std_core_hnd._open_none1(scheduler_transaction_fs_state, transaction);
    if (_x211._tag === 1) {
       
      var _x_x1_0_10907 = $std_core_hnd._open_none1(function(_this /* scheduler-transaction<7633> */ ) {
          return _this.transaction_publications;
        }, transaction);
      return $std_core_hnd._open_none2($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append, _x_x1_0_10907, $kokaine_reactive_internal_work_dash_transaction.Work_publication(prepare, publish, rollback));
    }
    else if (_x211._tag === 2) {
       
      var _x_x1_2_10910 = $std_core_hnd._open_none1(function(_this_0 /* scheduler-transaction<7633> */ ) {
          return _this_0.transaction_publications;
        }, transaction);
      return $std_core_hnd._open_none2($kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append, _x_x1_2_10910, $kokaine_reactive_internal_work_dash_transaction.Work_publication(prepare, publish, rollback));
    }
    else {
      return $std_core_exn.$throw("cannot enlist publication in a terminal scheduler transaction");
    }
  }
}
 
 
// monadic lift
export function _mlift_settle_producer_10965(result) /* (result : kokaine/reactive/internal/model/settle-result) -> exn () */  {
  if (result._tag === 1) {
    return $std_core_types.Unit;
  }
  else if (result._tag === 2) {
    return $std_core_exn.$throw("derived value is waiting for its effect owner");
  }
  else {
     
    var ev_11140 = $std_core_hnd._evv_at(0);
    var _x212 = $std_core_exn.throw_exn_fs__select(ev_11140.hnd);
    return _x212(ev_11140.marker, ev_11140, result.settle_exception);
  }
}
 
 
// Synchronous memo reads can execute this capability without gaining the
// ambient effect row. It follows only the target scope's actual Trace-read
// producer capabilities and never drains unrelated pure or effect work.
export function settle_producer(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> exn () */  {
   
  var x_11143 = $std_core_hnd._open_none1(settle_producer_result, producer);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_settle_producer_10965);
  }
  else {
    if (x_11143._tag === 1) {
      return $std_core_types.Unit;
    }
    else if (x_11143._tag === 2) {
      return $std_core_exn.$throw("derived value is waiting for its effect owner");
    }
    else {
       
      var ev_11146 = $std_core_hnd._evv_at(0);
      var _x213 = $std_core_exn.throw_exn_fs__select(ev_11146.hnd);
      return _x213(ev_11146.marker, ev_11146, x_11143.settle_exception);
    }
  }
}
 
 
// monadic lift
export function _mlift_drain_loop_10966(root, _y_x10492) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, error<bool>) -> <div|e> result<(),exception> */  {
  if (_y_x10492._tag === 1) {
    return $std_core_types.$Error(_y_x10492.error);
  }
  else if (_y_x10492._tag === 2 && _y_x10492.value) {
    return drain_loop(root);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function drain_loop(root_0) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div|e> error<()> */  { tailcall: while(1)
{
   
  var _x214 = root_0.root_derive_plane;
  var derivation = run_next_derived_loop(_x214, $std_core_types.Nil);
  if (derivation._tag === 1) {
    return $std_core_types.$Error(derivation.error);
  }
  else if (derivation._tag === 2 && derivation.value) {
    {
      // tail call
      continue tailcall;
    }
  }
  else {
     
    var _x214 = root_0.root_effect_plane;
    var x_11149 = run_next_effect(_x214);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10492_0 /* error<bool> */ ) {
        return _mlift_drain_loop_10966(root_0, _y_x10492_0);
      });
    }
    else {
      if (x_11149._tag === 1) {
        return $std_core_types.$Error(x_11149.error);
      }
      else if (x_11149._tag === 2 && x_11149.value) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_flush_10967(result) /* forall<e> (result : error<()>) -> <exn,div|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
}
 
 
// monadic lift
export function _mlift_flush_10968(root, _y_x10496) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, hnd/ev-index) -> <exn,div|e1> () */  {
   
  var x_11152 = $std_core_hnd._mask_at(_y_x10496, false, function() {
      return $std_core_hnd.finally_prompt(function() {
          var _x214 = root.root_flushing;
          return ((_x214).value = false);
        }, drain_loop(root));
    });
   
  function next_11153(result) /* (error<()>) -> <exn,div|8004> () */  {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_11153);
  }
  else {
    return next_11153(x_11152);
  }
}
 
export function flush(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div,exn|e> () */  {
   
  var value_10742 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<8004> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x214 = value_10742.value;
  if (_x214) {
    return $std_core_types.Unit;
  }
  else {
     
    var value_0_10744 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<8004> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x215 = value_0_10744.value;
    if (_x215) {
      return $std_core_types.Unit;
    }
    else {
       
      var value_1_10746 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<8004> */ ) {
          return root_2.root_flushing;
        }, root);
      var _x216 = value_1_10746.value;
      if (_x216) {
        return $std_core_types.Unit;
      }
      else {
         
        var value_2_10748 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<8004> */ ) {
            return root_3.root_batch_depth;
          }, root);
        var _x217 = $std_core_types._int_gt((value_2_10748.value),0);
        if (_x217) {
          return $std_core_types.Unit;
        }
        else {
           
          var target_10750 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<8004> */ ) {
              return root_4.root_flushing;
            }, root);
           
          ((target_10750).value = true);
           
          var x_11157 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10496 /* hnd/ev-index */ ) {
              return _mlift_flush_10968(root, _y_x10496);
            });
          }
          else {
             
            var x_0_11160 = $std_core_hnd._mask_at(x_11157, false, function() {
                return $std_core_hnd.finally_prompt(function() {
                    var _x218 = root.root_flushing;
                    return ((_x218).value = false);
                  }, drain_loop(root));
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
                return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
              });
            }
            else {
              return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, x_0_11160);
            }
          }
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_check_frame_registration_10969(current, wild__) /* forall<_e,e1> (current : kokaine/reactive/internal/model/frame<e1>, wild_ : ()) -> exn () */  {
   
  var _x_x1_10920 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<8062> */ ) {
      return frame;
    }, current);
   
  var value_10757 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<8062> */ ) {
      return _this.lifetime_token;
    }, _x_x1_10920);
  var _x218 = value_10757.value;
  if (_x218 === 1) {
    return $std_core_types.Unit;
  }
  else if (_x218 === 2) {
    return $std_core_types.Unit;
  }
  else {
    return $std_core_exn.$throw("reactive value created under a retired continuation branch");
  }
}
 
export function check_frame_registration(root, current) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, current : kokaine/reactive/internal/model/frame<e>) -> exn () */  {
   
  var x_11166 = check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_check_frame_registration_10969(current, wild__);
    });
  }
  else {
     
    var _x_x1_10920 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<8062> */ ) {
        return frame;
      }, current);
     
    var value_10757 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<8062> */ ) {
        return _this.lifetime_token;
      }, _x_x1_10920);
    var _x219 = value_10757.value;
    if (_x219 === 1) {
      return $std_core_types.Unit;
    }
    else if (_x219 === 2) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("reactive value created under a retired continuation branch");
    }
  }
}
 
export function new_source(root, value, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, value : a, equals : (a, a) -> bool) -> kokaine/reactive/internal/model/source<a> */  {
  var _x220 = root.root_key;
  return $kokaine_reactive_internal_model.Source(_x220, { value: value }, equals, { value: 0 }, $kokaine_internal_registry.new_registry());
}