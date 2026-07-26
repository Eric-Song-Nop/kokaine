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
// type resume-phase
export const Resume_build = 1; // resume-phase
export const Resume_ambient = 2; // resume-phase
export const Resume_publication = 3; // resume-phase
export const Resume_complete = 4; // resume-phase
 
// declarations
 
 
// Automatically generated. Tests for the `Resume-build` constructor of the `:resume-phase` type.
export function is_resume_build(resume_phase) /* (resume-phase : resume-phase) -> bool */  {
  return (resume_phase === 1);
}
 
 
// Automatically generated. Tests for the `Resume-ambient` constructor of the `:resume-phase` type.
export function is_resume_ambient(resume_phase) /* (resume-phase : resume-phase) -> bool */  {
  return (resume_phase === 2);
}
 
 
// Automatically generated. Tests for the `Resume-publication` constructor of the `:resume-phase` type.
export function is_resume_publication(resume_phase) /* (resume-phase : resume-phase) -> bool */  {
  return (resume_phase === 3);
}
 
 
// Automatically generated. Tests for the `Resume-complete` constructor of the `:resume-phase` type.
export function is_resume_complete(resume_phase) /* (resume-phase : resume-phase) -> bool */  {
  return (resume_phase === 4);
}
 
export function pack_capture(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> kokaine/reactive/internal/model/packed-capture */  {
  return function(consume /* forall<e> (kokaine/reactive/internal/model/plane<e>, kokaine/reactive/internal/model/trace<e>) -> 337 */ ) {
    return consume(plane, current);
  };
}
 
export function enqueue_trace(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> () */  {
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x1 = current.trace_gate.gate_state;
    var _x0 = _x1.value;
    if (_x0 === 2) {
       
      var _x2 = current.trace_gate.gate_state;
      ((_x2).value = ($kokaine_reactive_internal_model.Capture_pending));
      var _x2 = plane.plane_queue;
      return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x2, $kokaine_reactive_internal_model.Resume_work(current));
    }
    else if (_x0 === 4) {
      var _x3 = current.trace_gate.gate_state;
      return ((_x3).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
export function cut_capture(packed) /* (packed : kokaine/reactive/internal/model/packed-capture) -> () */  {
  return packed(function(plane /* kokaine/reactive/internal/model/plane<470> */ , current /* kokaine/reactive/internal/model/trace<470> */ ) {
    if (current === null) {
      return $std_core_types.Unit;
    }
    else {
      var _x5 = current.trace_gate.gate_state;
      var _x4 = _x5.value;
      if (_x4 === 5) {
        return $std_core_types.Unit;
      }
      else {
        return enqueue_trace(plane, current);
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
    var _x7 = parent.value.gate_state;
    var _x6 = _x7.value;
    if (_x6 === 3) {
      return true;
    }
    else if (_x6 === 4) {
      return true;
    }
    else if (_x6 === 5) {
      return false;
    }
    else if (_x6 === 1) {
      {
        // tail call
        var _x8 = parent.value.gate_parent;
        parent = _x8;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        var _x9 = parent.value.gate_parent;
        parent = _x9;
        continue tailcall;
      }
    }
  }
}}
 
export function pending_ancestor(parent) /* (parent : maybe<kokaine/reactive/internal/model/continuation-gate>) -> bool */  {
  return pending_ancestor_loop(parent);
}
 
export function notify_source(source) /* forall<a> (source : kokaine/reactive/internal/model/source<a>) -> () */  {
  var _x10 = source.source_captures;
  return $kokaine_internal_registry.registry_fs_visit_readonly(_x10, cut_capture);
}
 
export function activate_trace_loop(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> div () */  {
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x12 = current.trace_gate.gate_state;
    var _x11 = _x12.value;
    if (_x11 === 1) {
       
      var current_frame = (current.trace_frame).value;
       
      var _x13 = current.trace_gate.gate_state;
      ((_x13).value = ($kokaine_reactive_internal_model.Capture_live));
       
      var _x14 = current_frame.lifetime_token;
      ((_x14).value = ($kokaine_reactive_internal_model.Scope_live));
       
      activate_trace_loop(plane, (current.trace_child).value);
      var _x13 = current.trace_stale();
      if (_x13) {
        return enqueue_trace(plane, current);
      }
      else {
        return $std_core_types.Unit;
      }
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
export function activate_trace(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> () */  {
  return activate_trace_loop(plane, current);
}
 
export function work_runnable(current) /* forall<e> (current : kokaine/reactive/internal/model/work<e>) -> bool */  {
  if (current._tag === 2) {
    var _x15 = current.bootstrap_scope.scope_lifetime.lifetime_token;
    var _x14 = _x15.value;
    if (_x14 === 1) {
       
      var _x16 = current.bootstrap_scope.scope_bootstrap_slot;
      var maybe_10030 = _x16.value;
      if (maybe_10030 !== null) {
         
        var _x16 = current.bootstrap_scope.scope_parent;
        var b_10033 = pending_ancestor_loop(_x16);
        return (b_10033) ? false : true;
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
    if (current.resume_trace === null) {
      return false;
    }
    else {
      var _x17 = current.resume_trace.trace_gate.gate_state;
      var _x16 = _x17.value;
      if (_x16 === 3) {
         
        if (current.resume_trace === null) {
          var _x19 = $std_core_types.Nothing;
        }
        else {
          var _x19 = $std_core_types.Just(current.resume_trace.trace_gate);
        }
        if (_x19 === null) {
          var _x18 = $std_core_types.Nothing;
        }
        else {
          var _x18 = _x19.value.gate_parent;
        }
        var b_0_10038 = pending_ancestor_loop(_x18);
        return (b_0_10038) ? false : true;
      }
      else {
        return false;
      }
    }
  }
}
 
export function work_stale(current) /* forall<e> (current : kokaine/reactive/internal/model/work<e>) -> bool */  {
  if (current._tag === 2) {
    var _x19 = current.bootstrap_scope.scope_lifetime.lifetime_token;
    var _x18 = _x19.value;
    if (_x18 === 1) {
       
      var _x20 = current.bootstrap_scope.scope_bootstrap_slot;
      var maybe_10045 = _x20.value;
      return (maybe_10045 === null);
    }
    else {
      return true;
    }
  }
  else {
    if (current.resume_trace === null) {
      return true;
    }
    else {
      var _x21 = current.resume_trace.trace_gate.gate_state;
      var _x20 = _x21.value;
      if (_x20 === 5) {
        return true;
      }
      else if (_x20 === 1) {
        return true;
      }
      else if (_x20 === 2) {
        return true;
      }
      else {
        return false;
      }
    }
  }
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
  var _x22 = $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_pop(queue);
  if (_x22 === null) {
     
    restore_skipped(queue, skipped);
    return $std_core_types.Nothing;
  }
  else {
    var _x23 = work_runnable(_x22.value);
    if (_x23) {
       
      restore_skipped(queue, skipped);
      return $std_core_types.Just(_x22.value);
    }
    else {
      var _x24 = work_stale(_x22.value);
      if (_x24) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        {
          // tail call
          var _x25 = $std_core_types.Cons(_x22.value, skipped);
          skipped = _x25;
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
    var _x26 = plane.plane_queue;
    var _x27 = plane.plane_work_group;
    return $kokaine_reactive_internal_work_dash_transaction.route_bootstrap(_x26, _x27.value, current);
  }
  else {
    var _x28 = plane.plane_queue;
    return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x28, current);
  }
}
 
 
// monadic lift
export function _mlift_abandon_draft_frame_10502(_pat_5) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function abandon_draft_frame(current, drafts) /* forall<e> (current : kokaine/reactive/internal/model/frame<e>, drafts : list<kokaine/reactive/internal/model/trace<e>>) -> e () */  {
   
  var _x29 = current.lifetime_token;
  ((_x29).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x30 = current;
  var x_10520 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x30, drafts);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function collect_replaced_generation(old, old_frame) /* forall<e> (old : kokaine/reactive/internal/model/trace<e>, old-frame : kokaine/reactive/internal/model/frame<e>) -> list<kokaine/reactive/internal/model/retirement-work<e>> */  {
  return $kokaine_reactive_internal_lifetime.collect_retirement_loop($std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
        return $kokaine_reactive_internal_lifetime.trace_retirement_expand(old);
      }), $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
          var _x29 = old_frame;
          return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(_x29);
        }), $std_core_types.Nil)), $std_core_types.Nil);
}
 
export function retire_replaced_generation_raw(old, old_frame) /* forall<e> (old : kokaine/reactive/internal/model/trace<e>, old-frame : kokaine/reactive/internal/model/frame<e>) -> <div,exn|e> () */  {
  if (old === null) {
     
    var _x_x1_10451 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<1474> */ ) {
        return frame;
      }, old_frame);
    var _x30 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.lifetime_owner_fs_try_retire_empty, _x_x1_10451);
    if (_x30) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_1_10453 = $std_core_hnd._open_none1(function(frame_0 /* kokaine/reactive/internal/model/frame<1474> */ ) {
          return frame_0;
        }, old_frame);
      return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1474> */ ) {
            return _this.lifetime_retirement;
          }, _x_x1_1_10453), $std_core_hnd._open_none2(collect_replaced_generation, old, old_frame));
    }
  }
  else {
     
    var _x_x1_4_10457 = $std_core_hnd._open_none1(function(frame_1 /* kokaine/reactive/internal/model/frame<1474> */ ) {
        return frame_1;
      }, old_frame);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<1474> */ ) {
          return _this_0.lifetime_retirement;
        }, _x_x1_4_10457), $std_core_hnd._open_none2(collect_replaced_generation, old, old_frame));
  }
}
 
export function built_trace_fs_run_publication(built, plane) /* forall<e> (built : kokaine/reactive/internal/model/built-trace<e>, plane : kokaine/reactive/internal/model/plane<e>) -> <div|e> error<()> */  {
  return $kokaine_internal_compat.capture_error(function() {
    var _x31 = built.built_publication_action;
    return $kokaine_reactive_internal_lifetime.with_context(plane, $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/built-trace<1531> */ ) {
          return _this_0.built_publication_current;
        }, built), $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/built-trace<1531> */ ) {
          return _this_1.built_publication_frame;
        }, built), _x31);
  });
}
 
export function restore_resume_build_context(plane, previous_draft, previous_current, previous_frame) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, previous-draft : maybe<ref<global,list<kokaine/reactive/internal/model/trace<e>>>>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e>) -> () */  {
   
  var _x32 = plane.plane_current_frame;
  ((_x32).value = previous_frame);
   
  var _x33 = plane.plane_current;
  ((_x33).value = previous_current);
  var _x32 = plane.plane_draft;
  return ((_x32).value = previous_draft);
}
 
export function restore_resume_publication_context(plane, previous_current, previous_frame) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e>) -> () */  {
   
  var _x33 = plane.plane_current_frame;
  ((_x33).value = previous_frame);
  var _x33 = plane.plane_current;
  return ((_x33).value = previous_current);
}
 
 
// monadic lift
export function _mlift_rollback_resume_10503(draft_frame, drafts, _c_x10204) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, ()) -> () */  {
   
  var drafts_0_10612 = drafts.value;
   
  var _x34 = draft_frame.lifetime_token;
  ((_x34).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x35 = draft_frame;
  var x_10520 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x35, drafts_0_10612);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function rollback_resume(state, draft_frame, drafts) /* forall<e> (state : ref<global,kokaine/reactive/internal/model/capture-state>, draft-frame : kokaine/reactive/internal/model/frame<e>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e>>>) -> e () */  {
   
  var _x34 = state.value;
  if (_x34 === 4) {
    var x_10525 = ((state).value = ($kokaine_reactive_internal_model.Capture_pending));
  }
  else {
    var x_10525 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10204 /* () */ ) {
       
      var drafts_0_10614 = drafts.value;
       
      var _x34 = draft_frame.lifetime_token;
      ((_x34).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
       
      var _x35 = draft_frame;
      var x_10520 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x35, drafts_0_10614);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
          return $std_core_types.Unit;
        });
      }
      else {
        return $std_core_types.Unit;
      }
    });
  }
  else {
     
    var drafts_1_10616 = drafts.value;
     
    var _x34 = draft_frame.lifetime_token;
    ((_x34).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
     
    var _x35 = draft_frame;
    var x_10520_0 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x35, drafts_1_10616);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_pat_5_0 /* error<()> */ ) {
        return $std_core_types.Unit;
      });
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10504(_y_x10213) /* forall<e> (hnd/ev-index) -> <exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10213, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_resume_node_10505(_y_x10218) /* forall<e> (hnd/ev-index) -> <exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10218, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_resume_node_10506(_y_x10222) /* forall<e> (hnd/ev-index) -> <exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10222, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_resume_node_10507(draft_frame, phase, _c_x10221) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, phase : ref<global,resume-phase>, ()) -> () */  {
   
  var _x_x1_17_10482 = $std_core_hnd._open_none1(function(frame_0 /* kokaine/reactive/internal/model/frame<2412> */ ) {
      return frame_0;
    }, draft_frame);
   
  var target_18_10400 = $std_core_hnd._open_none1(function(_this_6 /* kokaine/reactive/internal/model/lifetime-owner<2412> */ ) {
      return _this_6.lifetime_token;
    }, _x_x1_17_10482);
   
  ((target_18_10400).value = ($kokaine_reactive_internal_model.Scope_live));
   
  ((phase).value = Resume_complete);
   
  var x_10532 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
   
  function next_10533(_y_x10222) /* (hnd/ev-index) -> <exn|2412> () */  {
    return $std_core_hnd._mask_at(_y_x10222, false, function() {
        return $std_core_types.Unit;
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10533);
  }
  else {
    return next_10533(x_10532);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10508(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___16) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, phase : ref<global,resume-phase>, plane : kokaine/reactive/internal/model/plane<e2>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, wild_@16 : ()) -> <div,exn|e2> () */  {
   
  var target_13_10383 = $std_core_hnd._open_none1(function(plane_12 /* kokaine/reactive/internal/model/plane<2412> */ ) {
      return plane_12.plane_current_frame;
    }, plane);
   
  ((target_13_10383).value = previous_frame);
   
  var target_14_10386 = $std_core_hnd._open_none1(function(plane_13 /* kokaine/reactive/internal/model/plane<2412> */ ) {
      return plane_13.plane_current;
    }, plane);
   
  ((target_14_10386).value = previous_current);
   
  ((phase).value = Resume_ambient);
  var _x34 = state.value;
  if (_x34 === 5) {
     
    var x_10536 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
     
    var next_10537 = function(_y_x10218 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10218, false, function() {
          return $std_core_types.Unit;
        });
    };
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_10537);
    }
    else {
      return next_10537(x_10536);
    }
  }
  else {
     
    var value_27_10393 = $std_core_hnd._open_none1(function(_this_4 /* kokaine/reactive/internal/model/built-trace<2412> */ ) {
        return _this_4.built_root;
      }, built);
     
    ((child).value = value_27_10393);
     
    var _x_x2_10480 = $std_core_hnd._open_none1(function(_this_5 /* kokaine/reactive/internal/model/built-trace<2412> */ ) {
        return _this_5.built_root;
      }, built);
     
    $std_core_hnd._open_none2(function(plane_14 /* kokaine/reactive/internal/model/plane<2412> */ , current_0 /* kokaine/reactive/internal/model/trace<2412> */ ) {
        return activate_trace_loop(plane_14, current_0);
      }, plane, _x_x2_10480);
     
    var _x35 = state.value;
    if (_x35 === 4) {
      var x_0_10539 = ((state).value = ($kokaine_reactive_internal_model.Capture_live));
    }
    else {
      var x_0_10539 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10221 /* () */ ) {
        return _mlift_resume_node_10507(draft_frame, phase, _c_x10221);
      });
    }
    else {
      return _mlift_resume_node_10507(draft_frame, phase, x_0_10539);
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10509(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___12) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, phase : ref<global,resume-phase>, plane : kokaine/reactive/internal/model/plane<e2>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, wild_@12 : ()) -> <div,exn|e2> () */  {
  var _x35 = state.value;
  if (_x35 === 5) {
     
    var x_10542 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
     
    var next_10543 = function(_y_x10213 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10213, false, function() {
          return $std_core_types.Unit;
        });
    };
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_10543);
    }
    else {
      return next_10543(x_10542);
    }
  }
  else {
     
    ((phase).value = Resume_publication);
     
    var target_11_10374 = $std_core_hnd._open_none1(function(plane_10 /* kokaine/reactive/internal/model/plane<2412> */ ) {
        return plane_10.plane_current;
      }, plane);
     
    var value_21_10375 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/built-trace<2412> */ ) {
        return _this_1.built_publication_current;
      }, built);
     
    ((target_11_10374).value = value_21_10375);
     
    var target_12_10378 = $std_core_hnd._open_none1(function(plane_11 /* kokaine/reactive/internal/model/plane<2412> */ ) {
        return plane_11.plane_current_frame;
      }, plane);
     
    var value_22_10379 = $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/built-trace<2412> */ ) {
        return _this_2.built_publication_frame;
      }, built);
     
    ((target_12_10378).value = value_22_10379);
     
    var publication = $std_core_hnd._open_none1(function(_this_3 /* kokaine/reactive/internal/model/built-trace<2412> */ ) {
        return _this_3.built_publication_action;
      }, built);
     
    var x_0_10545 = publication();
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___16 /* () */ ) {
        return _mlift_resume_node_10508(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___16);
      });
    }
    else {
      return _mlift_resume_node_10508(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, x_0_10545);
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10510(child, current_frame_slot, draft_frame, old_frame, phase, plane, previous_current, previous_draft, previous_frame, state, built) /* forall<_e,_e1,e2> (child : ref<global,kokaine/reactive/internal/model/trace<e2>>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, old-frame : kokaine/reactive/internal/model/frame<e2>, phase : ref<global,resume-phase>, plane : kokaine/reactive/internal/model/plane<e2>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-draft : maybe<ref<global,list<kokaine/reactive/internal/model/trace<e2>>>>, previous-frame : kokaine/reactive/internal/model/frame<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, built : kokaine/reactive/internal/model/built-trace<e2>) -> <div,exn|e2> () */  {
   
  var target_3_10351 = $std_core_hnd._open_none1(function(plane_7 /* kokaine/reactive/internal/model/plane<2412> */ ) {
      return plane_7.plane_current_frame;
    }, plane);
   
  ((target_3_10351).value = previous_frame);
   
  var target_4_10354 = $std_core_hnd._open_none1(function(plane_8 /* kokaine/reactive/internal/model/plane<2412> */ ) {
      return plane_8.plane_current;
    }, plane);
   
  ((target_4_10354).value = previous_current);
   
  var target_5_10357 = $std_core_hnd._open_none1(function(plane_9 /* kokaine/reactive/internal/model/plane<2412> */ ) {
      return plane_9.plane_draft;
    }, plane);
   
  ((target_5_10357).value = previous_draft);
   
  ((phase).value = Resume_ambient);
   
  var old = child.value;
   
  ((child).value = ($kokaine_reactive_internal_model.Trace_end));
   
  var _x_x1_5_10469 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2412> */ ) {
      return frame;
    }, old_frame);
   
  var target_8_10365 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<2412> */ ) {
      return _this_0.lifetime_token;
    }, _x_x1_5_10469);
   
  ((target_8_10365).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  ((current_frame_slot).value = draft_frame);
   
  var x_10547 = retire_replaced_generation_raw(old, old_frame);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___12 /* () */ ) {
      return _mlift_resume_node_10509(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___12);
    });
  }
  else {
    return _mlift_resume_node_10509(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, x_10547);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10511(attempt) /* forall<e> (attempt : error<()>) -> e result<(),exception> */  {
  if (attempt._tag === 1) {
    return $std_core_types.$Error(attempt.error);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function resume_node(plane, current, gate, child, current_frame_slot, resume) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<e>>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e>>, resume : (kokaine/reactive/internal/model/frame<e>) -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e>) -> <div|e> error<()> */  {
  var _x37 = gate.gate_state;
  var _x36 = _x37.value;
  if (_x36 === 3) {
     
    var _x38 = gate.gate_state;
    ((_x38).value = ($kokaine_reactive_internal_model.Capture_running));
     
    var old_frame = current_frame_slot.value;
     
    var _x39 = plane.plane_retirement;
    var draft_frame = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_starting, _x39);
     
    var drafts = { value: ($std_core_types.Nil) };
     
    var _x40 = plane.plane_draft;
    var previous_draft = _x40.value;
     
    var _x41 = plane.plane_current;
    var previous_current = _x41.value;
     
    var _x42 = plane.plane_current_frame;
    var previous_frame = _x42.value;
     
    var phase = { value: Resume_build };
     
    var x_10553 = $kokaine_internal_compat.capture_error(function() {
       
      var target_0_10342 = $std_core_hnd._open_none1(function(plane_4 /* kokaine/reactive/internal/model/plane<2412> */ ) {
          return plane_4.plane_draft;
        }, plane);
       
      ((target_0_10342).value = ($std_core_types.Just(drafts)));
       
      var target_1_10345 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<2412> */ ) {
          return plane_5.plane_current;
        }, plane);
       
      ((target_1_10345).value = ($std_core_types.Just(gate)));
       
      var target_2_10348 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<2412> */ ) {
          return plane_6.plane_current_frame;
        }, plane);
       
      ((target_2_10348).value = draft_frame);
       
      var x_0_10555 = resume(draft_frame);
       
      var next_0_10556 = function(built /* kokaine/reactive/internal/model/built-trace<2412> */ ) {
        var _x43 = gate.gate_state;
        return _mlift_resume_node_10510(child, current_frame_slot, draft_frame, old_frame, phase, plane, previous_current, previous_draft, previous_frame, _x43, built);
      };
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_0_10556);
      }
      else {
        return next_0_10556(x_0_10555);
      }
    });
     
    var next_10554 = function(attempt /* error<()> */ ) {
      if (attempt._tag === 1) {
        return $std_core_types.$Error(attempt.error);
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    };
    if ($std_core_hnd._yielding()) {
      var _x42 = $std_core_hnd.yield_extend(next_10554);
    }
    else {
      var _x42 = next_10554(x_10553);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x38 = phase.value;
        if (_x38 === 1) {
           
          restore_resume_build_context(plane, previous_draft, previous_current, previous_frame);
          var _x39 = gate.gate_state;
          return rollback_resume(_x39, draft_frame, drafts);
        }
        else if (_x38 === 2) {
          var _x40 = gate.gate_state;
          return rollback_resume(_x40, draft_frame, drafts);
        }
        else if (_x38 === 3) {
           
          restore_resume_publication_context(plane, previous_current, previous_frame);
          var _x41 = gate.gate_state;
          return rollback_resume(_x41, draft_frame, drafts);
        }
        else {
          return $std_core_types.Unit;
        }
      }, _x42);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function resume_capture(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> <div|e> error<()> */  {
  if (current === null) {
    return $std_core_types.Ok($std_core_types.Unit);
  }
  else {
    return resume_node(plane, current, current.trace_gate, current.trace_child, current.trace_frame, current.trace_resume);
  }
}
 
 
// monadic lift
export function _mlift_run_bootstrap_10512(_pat_3_3) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function run_bootstrap(scope) /* forall<e> (scope : kokaine/reactive/internal/model/continuation-scope<e>) -> <div|e> error<()> */  {
  var _x44 = scope.scope_lifetime.lifetime_token;
  var _x43 = _x44.value;
  if (_x43 === 1) {
     
    var _x45 = scope.scope_bootstrap_slot;
    var pending = _x45.value;
     
    var _x46 = scope.scope_bootstrap_slot;
    ((_x46).value = ($std_core_types.Nothing));
    if (pending === null) {
      return $kokaine_internal_compat.capture_error(function() {
        return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "bootstrap slot was already consumed while scope is starting");
      });
    }
    else {
      return $std_core_hnd.finally_prompt(function() {
          var _x46 = scope.scope_lifetime.lifetime_token;
          var _x45 = _x46.value;
          if (_x45 === 1) {
             
            var x_10561 = $kokaine_internal_compat.capture_error(function() {
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
    if (current.resume_trace === null) {
      return $std_core_types.Ok($std_core_types.Unit);
    }
    else {
      return resume_node(plane, current.resume_trace, current.resume_trace.trace_gate, current.resume_trace.trace_child, current.resume_trace.trace_frame, current.resume_trace.trace_resume);
    }
  }
  else {
    return run_bootstrap(current.bootstrap_scope);
  }
}
 
export function restore_deferred(plane, deferred) /* (plane : kokaine/reactive/internal/model/plane<total>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> () */  {
   
  var values_10091 = $std_core_list.reverse_acc($std_core_types.Nil, deferred);
  var _x47 = plane.plane_queue;
  return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(_x47, values_10091);
}
 
 
// monadic lift
export function _mlift_run_next_effect_10513(_y_x10248) /* forall<e> (error<()>) -> <div|e> result<bool,exception> */  {
  if (_y_x10248._tag === 1) {
    return $std_core_types.$Error(_y_x10248.error);
  }
  else {
    return $std_core_types.Ok(true);
  }
}
 
export function run_next_effect(plane) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>) -> <div|e> error<bool> */  {
   
  var _x48 = plane.plane_queue;
  var next = take_queued_work_loop(_x48, $std_core_types.Nil);
  if (next === null) {
    return $std_core_types.Ok(false);
  }
  else {
     
    var _x48 = plane.plane_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x48, next.value);
     
    var x_10564 = run_work_raw(plane, next.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10248 /* error<()> */ ) {
        if (_y_x10248._tag === 1) {
          return $std_core_types.$Error(_y_x10248.error);
        }
        else {
          return $std_core_types.Ok(true);
        }
      });
    }
    else {
      if (x_10564._tag === 1) {
        return $std_core_types.$Error(x_10564.error);
      }
      else {
        return $std_core_types.Ok(true);
      }
    }
  }
}
 
export function settle_failure(message) /* (message : string) -> kokaine/reactive/internal/model/settle-result */  {
  var _x48 = $kokaine_internal_compat.capture_error(function() {
    return $std_core_exn.$throw(message);
  });
  if (_x48._tag === 1) {
    return $kokaine_reactive_internal_model.Settle_failed(_x48.error);
  }
  else {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
}
 
export function settle_producer_body(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> div kokaine/reactive/internal/model/settle-result */  { tailcall: while(1)
{
  var _x50 = producer.producer_scope.scope_lifetime.lifetime_token;
  var _x49 = _x50.value;
  if (_x49 === 3) {
    var _x51 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired branch");
    });
    if (_x51._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x51.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x49 === 4) {
    var _x52 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired scope");
    });
    if (_x52._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x52.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x54 = producer.producer_scope.scope_parent;
    var _x53 = validate_owner_gate(_x54);
    if (_x53._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else if (_x53._tag === 3) {
      return $kokaine_reactive_internal_model.Settle_failed(_x53.settle_exception);
    }
    else {
      var _x56 = producer.producer_scope.scope_lifetime.lifetime_token;
      var _x55 = _x56.value;
      if (_x55 === 1) {
        var _x58 = producer.producer_scope;
        var _x57 = run_bootstrap(_x58);
        if (_x57._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x57.error);
        }
        else {
          {
            // tail call
            continue tailcall;
          }
        }
      }
      else if (_x55 === 2) {
        var _x59 = producer.producer_plane;
        var _x60 = producer.producer_scope.scope_body;
        return settle_trace_result(_x59, _x60.value);
      }
      else if (_x55 === 3) {
        var _x61 = $kokaine_internal_compat.capture_error(function() {
          return $std_core_exn.$throw("derived value belongs to a retired branch");
        });
        if (_x61._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x61.error);
        }
        else {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
      }
      else {
        var _x62 = $kokaine_internal_compat.capture_error(function() {
          return $std_core_exn.$throw("derived value belongs to a retired scope");
        });
        if (_x62._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x62.error);
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
  var _x65 = producer_0.producer_settling;
  var _x64 = _x65.value;
  if (_x64) {
    var _x66 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic derived continuation");
    });
    if (_x66._tag === 1) {
      var _x63 = $kokaine_reactive_internal_model.Settle_failed(_x66.error);
    }
    else {
      var _x63 = $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
     
    var _x67 = producer_0.producer_settling;
    ((_x67).value = true);
     
    var result = settle_producer_body(producer_0);
     
    var _x68 = producer_0.producer_settling;
    ((_x68).value = false);
    var _x63 = result;
  }
  return $std_core_hnd.finally_prompt(function() {
      return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
    }, _x63);
}
 
export function settle_read_node(plane, current, gate, child) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<total>>) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x68 = gate.gate_state;
  var _x67 = _x68.value;
  if (_x67 === 5) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x67 === 2) {
     
    if (gate.gate_input_producer === null) {
      var input = $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      var input = settle_producer_result(gate.gate_input_producer.value);
    }
    var _x70 = gate.gate_state;
    var _x69 = _x70.value;
    if (_x69 === 5) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      if (input._tag === 1) {
        return settle_read_child(plane, current, gate, child);
      }
      else if (input._tag === 2) {
        return $kokaine_reactive_internal_model.Settle_deferred;
      }
      else {
        return $kokaine_reactive_internal_model.Settle_failed(input.settle_exception);
      }
    }
  }
  else {
    return settle_trace_recheck(plane, current, gate);
  }
}
 
export function settle_trace_result(plane_0, current_0) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>) -> div kokaine/reactive/internal/model/settle-result */  {
  if (current_0 === null) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else {
    return settle_read_node(plane_0, current_0, current_0.trace_gate, current_0.trace_child);
  }
}
 
export function settle_read_child(plane_1, current_1, gate_1, child_1) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<total>>) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x72 = gate_1.gate_state;
  var _x71 = _x72.value;
  if (_x71 === 5) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x71 === 2) {
     
    var nested = settle_trace_result(plane_1, child_1.value);
    var _x74 = gate_1.gate_state;
    var _x73 = _x74.value;
    if (_x73 === 5) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      if (nested._tag === 1) {
        return settle_trace_recheck(plane_1, current_1, gate_1);
      }
      else {
        return nested;
      }
    }
  }
  else {
    return settle_trace_recheck(plane_1, current_1, gate_1);
  }
}
 
export function settle_trace_recheck(plane_2, current_2, gate_2) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x76 = gate_2.gate_state;
  var _x75 = _x76.value;
  if (_x75 === 3) {
    var _x78 = gate_2.gate_parent;
    var _x77 = pending_ancestor_loop(_x78);
    if (_x77) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      if (current_2 === null) {
        return settle_trace_result(plane_2, current_2);
      }
      else {
        var _x79 = resume_node(plane_2, current_2, current_2.trace_gate, current_2.trace_child, current_2.trace_frame, current_2.trace_resume);
        if (_x79._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x79.error);
        }
        else {
          return settle_trace_result(plane_2, current_2);
        }
      }
    }
  }
  else if (_x75 === 2) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x75 === 1) {
    var _x80 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a draft derivation");
    });
    if (_x80._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x80.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x75 === 4) {
    var _x81 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a running derivation");
    });
    if (_x81._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x81.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x82 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived continuation was retired");
    });
    if (_x82._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x82.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
}
 
export function validate_owner_gate_current(gate_3_0) /* (gate : kokaine/reactive/internal/model/continuation-gate) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x84 = gate_3_0.gate_state;
  var _x83 = _x84.value;
  if (_x83 === 2) {
    if (gate_3_0.gate_input_producer === null) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      var _x85 = settle_producer_result(gate_3_0.gate_input_producer.value);
      if (_x85._tag === 2) {
        return $kokaine_reactive_internal_model.Settle_deferred;
      }
      else if (_x85._tag === 3) {
        return $kokaine_reactive_internal_model.Settle_failed(_x85.settle_exception);
      }
      else {
        var _x87 = gate_3_0.gate_state;
        var _x86 = _x87.value;
        if (_x86 === 2) {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
        else if (_x86 === 3) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else if (_x86 === 4) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else {
          var _x88 = $kokaine_internal_compat.capture_error(function() {
            return $std_core_exn.$throw("derived owner changed while validating its input");
          });
          if (_x88._tag === 1) {
            return $kokaine_reactive_internal_model.Settle_failed(_x88.error);
          }
          else {
            return $kokaine_reactive_internal_model.Settle_ok;
          }
        }
      }
    }
  }
  else if (_x83 === 3) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x83 === 4) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x83 === 1) {
    var _x89 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation is draft");
    });
    if (_x89._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x89.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x90 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation was retired");
    });
    if (_x90._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x90.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
}
 
export function validate_owner_gate(parent_0) /* (parent : maybe<kokaine/reactive/internal/model/continuation-gate>) -> div kokaine/reactive/internal/model/settle-result */  {
  if (parent_0 === null) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else {
    var _x92 = parent_0.value.gate_parent;
    var _x91 = validate_owner_gate(_x92);
    if (_x91._tag === 1) {
      return validate_owner_gate_current(parent_0.value);
    }
    else if (_x91._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      return $kokaine_reactive_internal_model.Settle_failed(_x91.settle_exception);
    }
  }
}
 
 
// monadic lift
export function _mlift_run_derive_work_10514(current, plane, _c_x10277) /* (current : kokaine/reactive/internal/model/work<total>, plane : kokaine/reactive/internal/model/plane<total>, maybe<kokaine/reactive/internal/model/derive-producer>) -> kokaine/reactive/internal/model/settle-result */  {
  if (_c_x10277 === null) {
    var _x93 = run_work_raw(plane, current);
    if (_x93._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x93.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    return settle_producer_result(_c_x10277.value);
  }
}
 
export function run_derive_work(plane, current) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/work<total>) -> div kokaine/reactive/internal/model/settle-result */  {
   
  var previous_phase = $kokaine_reactive_internal_model.enter_pure_plane();
   
  if (current._tag === 1) {
    if (current.resume_trace === null) {
      var x_10572 = $std_core_types.Nothing;
    }
    else {
      var x_10572 = (current.resume_trace.trace_owner).value;
    }
  }
  else {
    var x_10572 = (current.bootstrap_owner).value;
  }
  if ($std_core_hnd._yielding()) {
    var _x94 = $std_core_hnd.yield_extend(function(_c_x10277 /* maybe<kokaine/reactive/internal/model/derive-producer> */ ) {
      return _mlift_run_derive_work_10514(current, plane, _c_x10277);
    });
  }
  else {
    var _x94 = _mlift_run_derive_work_10514(current, plane, x_10572);
  }
  return $std_core_hnd.finally_prompt(function() {
      return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
    }, _x94);
}
 
export function run_next_derived_loop(plane, deferred) /* (plane : kokaine/reactive/internal/model/plane<total>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> div error<bool> */  { tailcall: while(1)
{
   
  var _x95 = plane.plane_queue;
  var next = take_queued_work_loop(_x95, $std_core_types.Nil);
  if (next === null) {
     
    restore_deferred(plane, deferred);
    return $std_core_types.Ok(false);
  }
  else {
    var _x95 = run_derive_work(plane, next.value);
    if (_x95._tag === 1) {
       
      var _x96 = work_stale(next.value);
      if (_x96) {
        $std_core_types.Unit;
      }
      else {
        if (next.value._tag === 2) {
          var _x97 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x97, next.value);
        }
        else {
          var _x98 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x98, next.value);
        }
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.Ok(true);
    }
    else if (_x95._tag === 2) {
      {
        // tail call
        var _x96 = $std_core_types.Cons(next.value, deferred);
        deferred = _x96;
        continue tailcall;
      }
    }
    else {
       
      var _x97 = work_stale(next.value);
      if (_x97) {
        $std_core_types.Unit;
      }
      else {
        if (next.value._tag === 2) {
          var _x98 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x98, next.value);
        }
        else {
          var _x99 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x99, next.value);
        }
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.$Error(_x95.settle_exception);
    }
  }
}}
 
export function run_next_derived(plane) /* (plane : kokaine/reactive/internal/model/plane<total>) -> div error<bool> */  {
  return run_next_derived_loop(plane, $std_core_types.Nil);
}
 
export function run_next_pure(plane) /* (plane : kokaine/reactive/internal/model/plane<total>) -> error<bool> */  {
  return run_next_derived_loop(plane, $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_settle_producer_10515(result) /* (result : kokaine/reactive/internal/model/settle-result) -> exn () */  {
  if (result._tag === 1) {
    return $std_core_types.Unit;
  }
  else if (result._tag === 2) {
    return $std_core_exn.$throw("derived value is waiting for its effect owner");
  }
  else {
     
    var ev_10574 = $std_core_hnd._evv_at(0);
    var _x97 = $std_core_exn.throw_exn_fs__select(ev_10574.hnd);
    return _x97(ev_10574.marker, ev_10574, result.settle_exception);
  }
}
 
 
// Synchronous memo reads can execute this capability without gaining the
// ambient effect row. It follows only the target scope's actual Trace-read
// producer capabilities and never drains unrelated pure or effect work.
export function settle_producer(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> exn () */  {
   
  var x_10577 = $std_core_hnd._open_none1(settle_producer_result, producer);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_settle_producer_10515);
  }
  else {
    if (x_10577._tag === 1) {
      return $std_core_types.Unit;
    }
    else if (x_10577._tag === 2) {
      return $std_core_exn.$throw("derived value is waiting for its effect owner");
    }
    else {
       
      var ev_10580 = $std_core_hnd._evv_at(0);
      var _x98 = $std_core_exn.throw_exn_fs__select(ev_10580.hnd);
      return _x98(ev_10580.marker, ev_10580, x_10577.settle_exception);
    }
  }
}
 
 
// monadic lift
export function _mlift_drain_loop_10516(root, _y_x10283) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, error<bool>) -> <div|e> result<(),exception> */  {
  if (_y_x10283._tag === 1) {
    return $std_core_types.$Error(_y_x10283.error);
  }
  else if (_y_x10283._tag === 2 && _y_x10283.value) {
    return drain_loop(root);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function drain_loop(root_0) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div|e> error<()> */  { tailcall: while(1)
{
   
  var _x99 = root_0.root_derive_plane;
  var derivation = run_next_derived_loop(_x99, $std_core_types.Nil);
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
     
    var _x99 = root_0.root_effect_plane;
    var x_10583 = run_next_effect(_x99);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10283_0 /* error<bool> */ ) {
        return _mlift_drain_loop_10516(root_0, _y_x10283_0);
      });
    }
    else {
      if (x_10583._tag === 1) {
        return $std_core_types.$Error(x_10583.error);
      }
      else if (x_10583._tag === 2 && x_10583.value) {
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
export function _mlift_flush_10517(result) /* forall<e> (result : error<()>) -> <exn,div|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
}
 
 
// monadic lift
export function _mlift_flush_10518(root, _y_x10287) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, hnd/ev-index) -> <exn,div|e1> () */  {
   
  var x_10586 = $std_core_hnd._mask_at(_y_x10287, false, function() {
      return $std_core_hnd.finally_prompt(function() {
          var _x99 = root.root_flushing;
          return ((_x99).value = false);
        }, drain_loop(root));
    });
   
  function next_10587(result) /* (error<()>) -> <exn,div|4160> () */  {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10587);
  }
  else {
    return next_10587(x_10586);
  }
}
 
export function flush(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div,exn|e> () */  {
   
  var value_10424 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4160> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x99 = value_10424.value;
  if (_x99) {
    return $std_core_types.Unit;
  }
  else {
     
    var value_0_10426 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<4160> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x100 = value_0_10426.value;
    if (_x100) {
      return $std_core_types.Unit;
    }
    else {
       
      var value_1_10428 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<4160> */ ) {
          return root_2.root_flushing;
        }, root);
      var _x101 = value_1_10428.value;
      if (_x101) {
        return $std_core_types.Unit;
      }
      else {
         
        var value_2_10430 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<4160> */ ) {
            return root_3.root_batch_depth;
          }, root);
        var _x102 = $std_core_types._int_gt((value_2_10430.value),0);
        if (_x102) {
          return $std_core_types.Unit;
        }
        else {
           
          var target_10432 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<4160> */ ) {
              return root_4.root_flushing;
            }, root);
           
          ((target_10432).value = true);
           
          var x_10591 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10287 /* hnd/ev-index */ ) {
              return _mlift_flush_10518(root, _y_x10287);
            });
          }
          else {
             
            var x_0_10594 = $std_core_hnd._mask_at(x_10591, false, function() {
                return $std_core_hnd.finally_prompt(function() {
                    var _x103 = root.root_flushing;
                    return ((_x103).value = false);
                  }, drain_loop(root));
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
                return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
              });
            }
            else {
              return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, x_0_10594);
            }
          }
        }
      }
    }
  }
}
 
export function check_root(root, key) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, key : kokaine/reactive/internal/model/root-key) -> exn () */  {
   
  var _x_x1_10493 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4229> */ ) {
      return root_0.root_key;
    }, root);
  var _x103 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/model/root-key */ , right /* kokaine/reactive/internal/model/root-key */ ) {
      var _x104 = left;
      var _x105 = right;
      return Object.is(_x104,_x105);
    }, _x_x1_10493, key);
  if (_x103) {
     
    var value_10442 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<4229> */ ) {
        return root_1.root_disposed;
      }, root);
     
    var _x_x1_1_10497 = value_10442.value;
    var _x106 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_1_10497);
    if (_x106) {
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
   
  var value_10444 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<4297> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x107 = value_10444.value;
  if (_x107) {
    return $std_core_exn.$throw("reactive value created in a disposed root");
  }
  else {
     
    var value_0_10446 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<4297> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x108 = value_0_10446.value;
    if (_x108) {
      return $std_core_exn.$throw("reactive value created in a disposed root");
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_check_frame_registration_10519(current, wild__) /* forall<_e,e1> (current : kokaine/reactive/internal/model/frame<e1>, wild_ : ()) -> exn () */  {
   
  var _x_x1_10500 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<4356> */ ) {
      return frame;
    }, current);
   
  var value_10448 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<4356> */ ) {
      return _this.lifetime_token;
    }, _x_x1_10500);
  var _x109 = value_10448.value;
  if (_x109 === 1) {
    return $std_core_types.Unit;
  }
  else if (_x109 === 2) {
    return $std_core_types.Unit;
  }
  else {
    return $std_core_exn.$throw("reactive value created under a retired continuation branch");
  }
}
 
export function check_frame_registration(root, current) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, current : kokaine/reactive/internal/model/frame<e>) -> exn () */  {
   
  var x_10600 = check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_check_frame_registration_10519(current, wild__);
    });
  }
  else {
     
    var _x_x1_10500 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<4356> */ ) {
        return frame;
      }, current);
     
    var value_10448 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<4356> */ ) {
        return _this.lifetime_token;
      }, _x_x1_10500);
    var _x110 = value_10448.value;
    if (_x110 === 1) {
      return $std_core_types.Unit;
    }
    else if (_x110 === 2) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("reactive value created under a retired continuation branch");
    }
  }
}
 
export function new_source(root, value, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, value : a, equals : (a, a) -> bool) -> kokaine/reactive/internal/model/source<a> */  {
  var _x111 = root.root_key;
  return $kokaine_reactive_internal_model.Source(_x111, { value: value }, equals, { value: 0 }, $kokaine_internal_registry.new_registry());
}