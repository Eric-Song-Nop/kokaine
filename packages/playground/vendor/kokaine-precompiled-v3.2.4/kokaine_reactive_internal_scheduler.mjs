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
  return function(consume /* forall<e> (kokaine/reactive/internal/model/plane<e>, kokaine/reactive/internal/model/trace<e>) -> 369 */ ) {
    return consume(plane, current);
  };
}
 
export function take_failed_loop(failed, state, kept) /* (failed : list<kokaine/reactive/internal/model/failed-ticket>, state : ref<global,kokaine/reactive/internal/model/capture-state>, kept : list<kokaine/reactive/internal/model/failed-ticket>) -> div maybe<(kokaine/reactive/internal/model/failed-ticket, list<kokaine/reactive/internal/model/failed-ticket>)> */  { tailcall: while(1)
{
  if (failed === null) {
    return $std_core_types.Nothing;
  }
  else {
    var _x1 = failed.head.failed_state;
    var _x0 = Object.is(_x1,state);
    if (_x0) {
       
      var xs_10001 = $std_core_list.reverse_acc($std_core_types.Nil, kept);
      return $std_core_types.Just($std_core_types.Tuple2(failed.head, $std_core_list.append(xs_10001, failed.tail)));
    }
    else {
      {
        // tail call
        var _x2 = $std_core_types.Cons(failed.head, kept);
        failed = failed.tail;
        kept = _x2;
        continue tailcall;
      }
    }
  }
}}
 
 
// A quarantined ticket is still Pending, so an ordinary invalidation would
// not queue it again. Move it back when its own input changes.
export function readmit_failed_gate(plane, gate) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, gate : kokaine/reactive/internal/model/continuation-gate) -> () */  {
  var _x4 = plane.plane_failed;
  var _x3 = _x4.value;
  if (_x3 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x5 = gate.gate_state;
    var taken = take_failed_loop(_x3, _x5, $std_core_types.Nil);
    if (taken === null) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x5 = plane.plane_failed;
      var _x6 = taken.value.snd;
      ((_x5).value = _x6);
      return taken.value.fst.failed_requeue(true);
    }
  }
}
 
export function enqueue_trace(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> () */  {
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x6 = current.trace_gate.gate_state;
    var _x5 = _x6.value;
    if (_x5 === 2) {
       
      var _x7 = current.trace_gate.gate_state;
      ((_x7).value = ($kokaine_reactive_internal_model.Capture_pending));
      var _x7 = plane.plane_queue;
      return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x7, $kokaine_reactive_internal_model.Resume_work(current));
    }
    else if (_x5 === 4) {
      var _x8 = current.trace_gate.gate_state;
      return ((_x8).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else if (_x5 === 3) {
      return readmit_failed_gate(plane, current.trace_gate);
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
export function cut_capture(packed) /* (packed : kokaine/reactive/internal/model/packed-capture) -> () */  {
  return packed(function(plane /* kokaine/reactive/internal/model/plane<760> */ , current /* kokaine/reactive/internal/model/trace<760> */ ) {
    var _x9 = $kokaine_reactive_internal_lifetime.trace_state_of(current);
    if (_x9 === 5) {
      return $std_core_types.Unit;
    }
    else {
      return enqueue_trace(plane, current);
    }
  });
}
 
export function pending_ancestor_loop(parent) /* (parent : maybe<kokaine/reactive/internal/model/continuation-gate>) -> div bool */  { tailcall: while(1)
{
  if (parent === null) {
    return false;
  }
  else {
    var _x11 = parent.value.gate_state;
    var _x10 = _x11.value;
    if (_x10 === 3) {
      return true;
    }
    else if (_x10 === 4) {
      return true;
    }
    else if (_x10 === 5) {
      return false;
    }
    else if (_x10 === 1) {
      {
        // tail call
        var _x12 = parent.value.gate_parent;
        parent = _x12;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        var _x13 = parent.value.gate_parent;
        parent = _x13;
        continue tailcall;
      }
    }
  }
}}
 
export function pending_ancestor(parent) /* (parent : maybe<kokaine/reactive/internal/model/continuation-gate>) -> bool */  {
  return pending_ancestor_loop(parent);
}
 
export function notify_source(source) /* forall<a> (source : kokaine/reactive/internal/model/source<a>) -> () */  {
  var _x14 = source.source_captures;
  return $kokaine_internal_registry.registry_fs_visit_readonly(_x14, cut_capture);
}
 
export function activate_trace_loop(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> div () */  {
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x16 = current.trace_gate.gate_state;
    var _x15 = _x16.value;
    if (_x15 === 1) {
       
      var current_frame = (current.trace_frame).value;
       
      var _x17 = current.trace_gate.gate_state;
      ((_x17).value = ($kokaine_reactive_internal_model.Capture_live));
       
      var _x18 = current_frame.lifetime_token;
      ((_x18).value = ($kokaine_reactive_internal_model.Scope_live));
       
      activate_trace_loop(plane, (current.trace_child).value);
      var _x17 = current.trace_stale();
      if (_x17) {
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
 
export function same_work(left, right) /* forall<e> (left : kokaine/reactive/internal/model/work<e>, right : kokaine/reactive/internal/model/work<e>) -> bool */  {
  if (left._tag === 1 && left.resume_trace !== null) {
    if (right._tag === 1 && right.resume_trace !== null) {
      var _x18 = left.resume_trace.trace_gate.gate_state;
      var _x19 = right.resume_trace.trace_gate.gate_state;
      return Object.is(_x18,_x19);
    }
    else {
      return false;
    }
  }
  else if (left._tag === 2) {
    if (right._tag === 2) {
      var _x20 = left.bootstrap_scope.scope_lifetime.lifetime_token;
      var _x21 = right.bootstrap_scope.scope_lifetime.lifetime_token;
      return Object.is(_x20,_x21);
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}
 
export function requeue_behind(ticket) /* (ticket : kokaine/reactive/internal/model/failed-ticket) -> () */  {
  return ticket.failed_requeue(false);
}
 
 
// Explicit update boundaries give every quarantined ticket one recovery turn,
// queued behind the work that is already runnable.
export function readmit_failed(plane) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>) -> () */  {
  var _x23 = plane.plane_failed;
  var _x22 = _x23.value;
  if (_x22 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x24 = plane.plane_failed;
    ((_x24).value = ($std_core_types.Nil));
    return $std_core_list.foreach($std_core_list.reverse_acc($std_core_types.Nil, _x22), requeue_behind);
  }
}
 
export function work_runnable(current) /* forall<e> (current : kokaine/reactive/internal/model/work<e>) -> bool */  {
  if (current._tag === 2) {
    var _x25 = current.bootstrap_scope.scope_lifetime.lifetime_token;
    var _x24 = _x25.value;
    if (_x24 === 1) {
       
      var _x26 = current.bootstrap_scope.scope_bootstrap_slot;
      var maybe_10057 = _x26.value;
      if (maybe_10057 !== null) {
         
        var _x26 = current.bootstrap_scope.scope_parent;
        var b_10060 = pending_ancestor_loop(_x26);
        return (b_10060) ? false : true;
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
       
      if (current.resume_trace === null) {
        var _x28 = $std_core_types.Nothing;
      }
      else {
        var _x28 = $std_core_types.Just(current.resume_trace.trace_gate);
      }
      if (_x28 === null) {
        var _x27 = $std_core_types.Nothing;
      }
      else {
        var _x27 = _x28.value.gate_parent;
      }
      var b_0_10064 = pending_ancestor_loop(_x27);
      return (b_0_10064) ? false : true;
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
      var maybe_10071 = _x29.value;
      return (maybe_10071 === null);
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
  var _x30 = $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_pop(queue);
  if (_x30 === null) {
     
    restore_skipped(queue, skipped);
    return $std_core_types.Nothing;
  }
  else {
    var _x31 = work_runnable(_x30.value);
    if (_x31) {
       
      restore_skipped(queue, skipped);
      return $std_core_types.Just(_x30.value);
    }
    else {
      var _x32 = work_stale(_x30.value);
      if (_x32) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        {
          // tail call
          var _x33 = $std_core_types.Cons(_x30.value, skipped);
          skipped = _x33;
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
    var _x34 = plane.plane_queue;
    var _x35 = plane.plane_work_group;
    return $kokaine_reactive_internal_work_dash_transaction.route_bootstrap(_x34, _x35.value, current);
  }
  else {
    var _x36 = plane.plane_queue;
    return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x36, current);
  }
}
 
 
// monadic lift
export function _mlift_abandon_draft_frame_10568(_pat_5) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function abandon_draft_frame(current, drafts) /* forall<e> (current : kokaine/reactive/internal/model/frame<e>, drafts : list<kokaine/reactive/internal/model/trace<e>>) -> e () */  {
   
  var _x37 = current.lifetime_token;
  ((_x37).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x38 = current;
  var x_10589 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x38, drafts);
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
          var _x37 = old_frame;
          return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(_x37);
        }), $std_core_types.Nil)), $std_core_types.Nil);
}
 
export function retire_replaced_generation_raw(old, old_frame) /* forall<e> (old : kokaine/reactive/internal/model/trace<e>, old-frame : kokaine/reactive/internal/model/frame<e>) -> <div,exn|e> () */  {
  if (old === null) {
     
    var _x_x1_10517 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<1967> */ ) {
        return frame;
      }, old_frame);
    var _x38 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.lifetime_owner_fs_try_retire_empty, _x_x1_10517);
    if (_x38) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_1_10519 = $std_core_hnd._open_none1(function(frame_0 /* kokaine/reactive/internal/model/frame<1967> */ ) {
          return frame_0;
        }, old_frame);
      return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1967> */ ) {
            return _this.lifetime_retirement;
          }, _x_x1_1_10519), $std_core_hnd._open_none2(collect_replaced_generation, old, old_frame));
    }
  }
  else {
     
    var _x_x1_4_10523 = $std_core_hnd._open_none1(function(frame_1 /* kokaine/reactive/internal/model/frame<1967> */ ) {
        return frame_1;
      }, old_frame);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<1967> */ ) {
          return _this_0.lifetime_retirement;
        }, _x_x1_4_10523), $std_core_hnd._open_none2(collect_replaced_generation, old, old_frame));
  }
}
 
export function built_trace_fs_run_publication(built, plane) /* forall<e> (built : kokaine/reactive/internal/model/built-trace<e>, plane : kokaine/reactive/internal/model/plane<e>) -> <div|e> error<()> */  {
  return $kokaine_internal_compat.capture_error(function() {
    var _x39 = built.built_publication_action;
    return $kokaine_reactive_internal_lifetime.with_context(plane, $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/built-trace<2024> */ ) {
          return _this_0.built_publication_current;
        }, built), $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/built-trace<2024> */ ) {
          return _this_1.built_publication_frame;
        }, built), _x39);
  });
}
 
export function restore_resume_build_context(plane, previous_draft, previous_current, previous_frame) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, previous-draft : maybe<ref<global,list<kokaine/reactive/internal/model/trace<e>>>>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e>) -> () */  {
   
  var _x40 = plane.plane_current_frame;
  ((_x40).value = previous_frame);
   
  var _x41 = plane.plane_current;
  ((_x41).value = previous_current);
  var _x40 = plane.plane_draft;
  return ((_x40).value = previous_draft);
}
 
export function restore_resume_publication_context(plane, previous_current, previous_frame) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e>) -> () */  {
   
  var _x41 = plane.plane_current_frame;
  ((_x41).value = previous_frame);
  var _x41 = plane.plane_current;
  return ((_x41).value = previous_current);
}
 
 
// monadic lift
export function _mlift_rollback_resume_10569(draft_frame, drafts, _c_x10255) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, ()) -> () */  {
   
  var drafts_0_10694 = drafts.value;
   
  var _x42 = draft_frame.lifetime_token;
  ((_x42).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x43 = draft_frame;
  var x_10589 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x43, drafts_0_10694);
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
   
  var _x42 = state.value;
  if (_x42 === 4) {
    var x_10594 = ((state).value = ($kokaine_reactive_internal_model.Capture_pending));
  }
  else {
    var x_10594 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10255 /* () */ ) {
       
      var drafts_0_10696 = drafts.value;
       
      var _x42 = draft_frame.lifetime_token;
      ((_x42).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
       
      var _x43 = draft_frame;
      var x_10589 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x43, drafts_0_10696);
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
     
    var drafts_1_10698 = drafts.value;
     
    var _x42 = draft_frame.lifetime_token;
    ((_x42).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
     
    var _x43 = draft_frame;
    var x_10589_0 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x43, drafts_1_10698);
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
export function _mlift_resume_node_10570(_y_x10264) /* forall<e> (hnd/ev-index) -> <exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10264, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_resume_node_10571(_y_x10269) /* forall<e> (hnd/ev-index) -> <exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10269, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_resume_node_10572(_y_x10273) /* forall<e> (hnd/ev-index) -> <exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10273, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_resume_node_10573(draft_frame, phase, _c_x10272) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, phase : ref<global,resume-phase>, ()) -> () */  {
   
  var _x_x1_17_10548 = $std_core_hnd._open_none1(function(frame_0 /* kokaine/reactive/internal/model/frame<2905> */ ) {
      return frame_0;
    }, draft_frame);
   
  var target_18_10458 = $std_core_hnd._open_none1(function(_this_6 /* kokaine/reactive/internal/model/lifetime-owner<2905> */ ) {
      return _this_6.lifetime_token;
    }, _x_x1_17_10548);
   
  ((target_18_10458).value = ($kokaine_reactive_internal_model.Scope_live));
   
  ((phase).value = Resume_complete);
   
  var x_10601 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
   
  function next_10602(_y_x10273) /* (hnd/ev-index) -> <exn|2905> () */  {
    return $std_core_hnd._mask_at(_y_x10273, false, function() {
        return $std_core_types.Unit;
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10602);
  }
  else {
    return next_10602(x_10601);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10574(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___16) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, phase : ref<global,resume-phase>, plane : kokaine/reactive/internal/model/plane<e2>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, wild_@16 : ()) -> <div,exn|e2> () */  {
   
  var target_13_10441 = $std_core_hnd._open_none1(function(plane_12 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_12.plane_current_frame;
    }, plane);
   
  ((target_13_10441).value = previous_frame);
   
  var target_14_10444 = $std_core_hnd._open_none1(function(plane_13 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_13.plane_current;
    }, plane);
   
  ((target_14_10444).value = previous_current);
   
  ((phase).value = Resume_ambient);
  var _x42 = state.value;
  if (_x42 === 5) {
     
    var x_10605 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
     
    var next_10606 = function(_y_x10269 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10269, false, function() {
          return $std_core_types.Unit;
        });
    };
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_10606);
    }
    else {
      return next_10606(x_10605);
    }
  }
  else {
     
    var value_27_10451 = $std_core_hnd._open_none1(function(_this_4 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_4.built_root;
      }, built);
     
    ((child).value = value_27_10451);
     
    var _x_x2_10546 = $std_core_hnd._open_none1(function(_this_5 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_5.built_root;
      }, built);
     
    $std_core_hnd._open_none2(function(plane_14 /* kokaine/reactive/internal/model/plane<2905> */ , current_0 /* kokaine/reactive/internal/model/trace<2905> */ ) {
        return activate_trace_loop(plane_14, current_0);
      }, plane, _x_x2_10546);
     
    var _x43 = state.value;
    if (_x43 === 4) {
      var x_0_10608 = ((state).value = ($kokaine_reactive_internal_model.Capture_live));
    }
    else {
      var x_0_10608 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10272 /* () */ ) {
        return _mlift_resume_node_10573(draft_frame, phase, _c_x10272);
      });
    }
    else {
      return _mlift_resume_node_10573(draft_frame, phase, x_0_10608);
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10575(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___12) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, phase : ref<global,resume-phase>, plane : kokaine/reactive/internal/model/plane<e2>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, wild_@12 : ()) -> <div,exn|e2> () */  {
  var _x43 = state.value;
  if (_x43 === 5) {
     
    var x_10611 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
     
    var next_10612 = function(_y_x10264 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10264, false, function() {
          return $std_core_types.Unit;
        });
    };
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_10612);
    }
    else {
      return next_10612(x_10611);
    }
  }
  else {
     
    ((phase).value = Resume_publication);
     
    var target_11_10432 = $std_core_hnd._open_none1(function(plane_10 /* kokaine/reactive/internal/model/plane<2905> */ ) {
        return plane_10.plane_current;
      }, plane);
     
    var value_21_10433 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_1.built_publication_current;
      }, built);
     
    ((target_11_10432).value = value_21_10433);
     
    var target_12_10436 = $std_core_hnd._open_none1(function(plane_11 /* kokaine/reactive/internal/model/plane<2905> */ ) {
        return plane_11.plane_current_frame;
      }, plane);
     
    var value_22_10437 = $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_2.built_publication_frame;
      }, built);
     
    ((target_12_10436).value = value_22_10437);
     
    var publication = $std_core_hnd._open_none1(function(_this_3 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_3.built_publication_action;
      }, built);
     
    var x_0_10614 = publication();
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___16 /* () */ ) {
        return _mlift_resume_node_10574(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___16);
      });
    }
    else {
      return _mlift_resume_node_10574(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, x_0_10614);
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10576(child, current_frame_slot, draft_frame, old_frame, phase, plane, previous_current, previous_draft, previous_frame, state, built) /* forall<_e,_e1,e2> (child : ref<global,kokaine/reactive/internal/model/trace<e2>>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, old-frame : kokaine/reactive/internal/model/frame<e2>, phase : ref<global,resume-phase>, plane : kokaine/reactive/internal/model/plane<e2>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-draft : maybe<ref<global,list<kokaine/reactive/internal/model/trace<e2>>>>, previous-frame : kokaine/reactive/internal/model/frame<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, built : kokaine/reactive/internal/model/built-trace<e2>) -> <div,exn|e2> () */  {
   
  var target_3_10409 = $std_core_hnd._open_none1(function(plane_7 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_7.plane_current_frame;
    }, plane);
   
  ((target_3_10409).value = previous_frame);
   
  var target_4_10412 = $std_core_hnd._open_none1(function(plane_8 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_8.plane_current;
    }, plane);
   
  ((target_4_10412).value = previous_current);
   
  var target_5_10415 = $std_core_hnd._open_none1(function(plane_9 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_9.plane_draft;
    }, plane);
   
  ((target_5_10415).value = previous_draft);
   
  ((phase).value = Resume_ambient);
   
  var old = child.value;
   
  ((child).value = ($kokaine_reactive_internal_model.Trace_end));
   
  var _x_x1_5_10535 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2905> */ ) {
      return frame;
    }, old_frame);
   
  var target_8_10423 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<2905> */ ) {
      return _this_0.lifetime_token;
    }, _x_x1_5_10535);
   
  ((target_8_10423).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  ((current_frame_slot).value = draft_frame);
   
  var x_10616 = retire_replaced_generation_raw(old, old_frame);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___12 /* () */ ) {
      return _mlift_resume_node_10575(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___12);
    });
  }
  else {
    return _mlift_resume_node_10575(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, x_10616);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10577(attempt) /* forall<e> (attempt : error<()>) -> e result<(),exception> */  {
  if (attempt._tag === 1) {
    return $std_core_types.$Error(attempt.error);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function resume_node(plane, current, gate, child, current_frame_slot, resume) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<e>>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e>>, resume : (kokaine/reactive/internal/model/frame<e>) -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e>) -> <div|e> error<()> */  {
  var _x45 = gate.gate_state;
  var _x44 = _x45.value;
  if (_x44 === 3) {
     
    var _x46 = gate.gate_state;
    ((_x46).value = ($kokaine_reactive_internal_model.Capture_running));
     
    var old_frame = current_frame_slot.value;
     
    var _x47 = plane.plane_retirement;
    var draft_frame = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_starting, _x47);
     
    var drafts = { value: ($std_core_types.Nil) };
     
    var _x48 = plane.plane_draft;
    var previous_draft = _x48.value;
     
    var _x49 = plane.plane_current;
    var previous_current = _x49.value;
     
    var _x50 = plane.plane_current_frame;
    var previous_frame = _x50.value;
     
    var phase = { value: Resume_build };
     
    var x_10622 = $kokaine_internal_compat.capture_error(function() {
       
      var target_0_10400 = $std_core_hnd._open_none1(function(plane_4 /* kokaine/reactive/internal/model/plane<2905> */ ) {
          return plane_4.plane_draft;
        }, plane);
       
      ((target_0_10400).value = ($std_core_types.Just(drafts)));
       
      var target_1_10403 = $std_core_hnd._open_none1(function(plane_5 /* kokaine/reactive/internal/model/plane<2905> */ ) {
          return plane_5.plane_current;
        }, plane);
       
      ((target_1_10403).value = ($std_core_types.Just(gate)));
       
      var target_2_10406 = $std_core_hnd._open_none1(function(plane_6 /* kokaine/reactive/internal/model/plane<2905> */ ) {
          return plane_6.plane_current_frame;
        }, plane);
       
      ((target_2_10406).value = draft_frame);
       
      var x_0_10624 = resume(draft_frame);
       
      var next_0_10625 = function(built /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        var _x51 = gate.gate_state;
        return _mlift_resume_node_10576(child, current_frame_slot, draft_frame, old_frame, phase, plane, previous_current, previous_draft, previous_frame, _x51, built);
      };
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_0_10625);
      }
      else {
        return next_0_10625(x_0_10624);
      }
    });
     
    var next_10623 = function(attempt /* error<()> */ ) {
      if (attempt._tag === 1) {
        return $std_core_types.$Error(attempt.error);
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    };
    if ($std_core_hnd._yielding()) {
      var _x50 = $std_core_hnd.yield_extend(next_10623);
    }
    else {
      var _x50 = next_10623(x_10622);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x46 = phase.value;
        if (_x46 === 1) {
           
          restore_resume_build_context(plane, previous_draft, previous_current, previous_frame);
          var _x47 = gate.gate_state;
          return rollback_resume(_x47, draft_frame, drafts);
        }
        else if (_x46 === 2) {
          var _x48 = gate.gate_state;
          return rollback_resume(_x48, draft_frame, drafts);
        }
        else if (_x46 === 3) {
           
          restore_resume_publication_context(plane, previous_current, previous_frame);
          var _x49 = gate.gate_state;
          return rollback_resume(_x49, draft_frame, drafts);
        }
        else {
          return $std_core_types.Unit;
        }
      }, _x50);
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
export function _mlift_run_bootstrap_10578(_pat_3_3) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function run_bootstrap(scope) /* forall<e> (scope : kokaine/reactive/internal/model/continuation-scope<e>) -> <div|e> error<()> */  {
  var _x52 = scope.scope_lifetime.lifetime_token;
  var _x51 = _x52.value;
  if (_x51 === 1) {
     
    var _x53 = scope.scope_bootstrap_slot;
    var pending = _x53.value;
     
    var _x54 = scope.scope_bootstrap_slot;
    ((_x54).value = ($std_core_types.Nothing));
    if (pending === null) {
      return $kokaine_internal_compat.capture_error(function() {
        return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "bootstrap slot was already consumed while scope is starting");
      });
    }
    else {
      return $std_core_hnd.finally_prompt(function() {
          var _x54 = scope.scope_lifetime.lifetime_token;
          var _x53 = _x54.value;
          if (_x53 === 1) {
             
            var x_10630 = $kokaine_internal_compat.capture_error(function() {
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
   
  var values_10116 = $std_core_list.reverse_acc($std_core_types.Nil, deferred);
  var _x55 = plane.plane_queue;
  return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(_x55, values_10116);
}
 
export function requeue_work(queue, current) /* forall<e> (queue : kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<e>>, current : kokaine/reactive/internal/model/work<e>) -> ((front : bool) -> ()) */  {
  return function(front /* bool */ ) {
    if (front) {
      return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(queue, current);
    }
    else {
      return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(queue, current);
    }
  };
}
 
 
// monadic lift
export function _mlift_run_next_effect_10579(failure, _c_x10300) /* (failure : exception, ()) -> result<bool,exception> */  {
  return $std_core_types.$Error(failure);
}
 
 
// monadic lift
export function _mlift_run_next_effect_10580(current, plane, _y_x10299) /* forall<_e,_e1,e2> (current : kokaine/reactive/internal/model/work<e2>, plane : kokaine/reactive/internal/model/plane<e2>, error<()>) -> <div|e2> result<bool,exception> */  {
  if (_y_x10299._tag === 1) {
     
    var _x56 = plane.plane_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_remove(_x56, function(other /* kokaine/reactive/internal/model/work<3475> */ ) {
        return same_work(other, current);
      });
     
    match: {
      if (current._tag === 1 && current.resume_trace !== null) {
         
        var b_10123 = work_stale(current);
        var _x57 = (b_10123) ? false : true;
        if (_x57){
           
          var _x58 = current.resume_trace.trace_gate.gate_state;
          var _x61 = plane.plane_failed;
          var value_0 = $std_core_types.Cons($kokaine_reactive_internal_model.Failed_ticket(_x58, function(front /* bool */ ) {
                if (front) {
                  var _x59 = plane.plane_queue;
                  return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x59, current);
                }
                else {
                  var _x60 = plane.plane_queue;
                  return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x60, current);
                }
              }), _x61.value);
          var _x58 = plane.plane_failed;
          var x_10633 = ((_x58).value = value_0);
          break match;
        }
      }
      var x_10633 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10300 /* () */ ) {
        return $std_core_types.$Error(_y_x10299.error);
      });
    }
    else {
      return $std_core_types.$Error(_y_x10299.error);
    }
  }
  else {
    return $std_core_types.Ok(true);
  }
}
 
export function run_next_effect(plane) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>) -> <div|e> error<bool> */  {
   
  var _x56 = plane.plane_queue;
  var next = take_queued_work_loop(_x56, $std_core_types.Nil);
  if (next === null) {
    return $std_core_types.Ok(false);
  }
  else {
     
    var _x56 = plane.plane_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x56, next.value);
     
    var x_10637 = run_work_raw(plane, next.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10299 /* error<()> */ ) {
        return _mlift_run_next_effect_10580(next.value, plane, _y_x10299);
      });
    }
    else {
      if (x_10637._tag === 1) {
         
        var _x56 = plane.plane_queue;
        $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_remove(_x56, function(other /* kokaine/reactive/internal/model/work<3475> */ ) {
            return same_work(other, next.value);
          });
         
        match: {
          if (next.value._tag === 1 && next.value.resume_trace !== null) {
             
            var b_10123 = work_stale(next.value);
            var _x57 = (b_10123) ? false : true;
            if (_x57){
               
              var _x58 = next.value.resume_trace.trace_gate.gate_state;
              var _x61 = plane.plane_failed;
              var value_0 = $std_core_types.Cons($kokaine_reactive_internal_model.Failed_ticket(_x58, function(front /* bool */ ) {
                    if (front) {
                      var _x59 = plane.plane_queue;
                      return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x59, next.value);
                    }
                    else {
                      var _x60 = plane.plane_queue;
                      return $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x60, next.value);
                    }
                  }), _x61.value);
              var _x58 = plane.plane_failed;
              var x_0_10640 = ((_x58).value = value_0);
              break match;
            }
          }
          var x_0_10640 = $std_core_types.Unit;
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_c_x10300 /* () */ ) {
            return $std_core_types.$Error(x_10637.error);
          });
        }
        else {
          return $std_core_types.$Error(x_10637.error);
        }
      }
      else {
        return $std_core_types.Ok(true);
      }
    }
  }
}
 
export function settle_failure(message) /* (message : string) -> kokaine/reactive/internal/model/settle-result */  {
  var _x56 = $kokaine_internal_compat.capture_error(function() {
    return $std_core_exn.$throw(message);
  });
  if (_x56._tag === 1) {
    return $kokaine_reactive_internal_model.Settle_failed(_x56.error);
  }
  else {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
}
 
 
// monadic lift
export function _mlift_settle_producer_result_10581(result, _c_x10312) /* (result : kokaine/reactive/internal/model/settle-result, ()) -> kokaine/reactive/internal/model/settle-result */  {
  return result;
}
 
 
// monadic lift
export function _mlift_settle_producer_result_10582(result_0, _c_x10314) /* (result@0 : kokaine/reactive/internal/model/settle-result, ()) -> kokaine/reactive/internal/model/settle-result */  {
  return result_0;
}
 
export function settle_producer_body(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> div kokaine/reactive/internal/model/settle-result */  { tailcall: while(1)
{
  var _x58 = producer.producer_scope.scope_lifetime.lifetime_token;
  var _x57 = _x58.value;
  if (_x57 === 3) {
    var _x59 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired branch");
    });
    if (_x59._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x59.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x57 === 4) {
    var _x60 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired scope");
    });
    if (_x60._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x60.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x62 = producer.producer_scope.scope_parent;
    var _x61 = validate_owner_gate(_x62);
    if (_x61._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else if (_x61._tag === 3) {
      return $kokaine_reactive_internal_model.Settle_failed(_x61.settle_exception);
    }
    else {
      var _x64 = producer.producer_scope.scope_lifetime.lifetime_token;
      var _x63 = _x64.value;
      if (_x63 === 1) {
        var _x66 = producer.producer_scope;
        var _x65 = run_bootstrap(_x66);
        if (_x65._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x65.error);
        }
        else {
          {
            // tail call
            continue tailcall;
          }
        }
      }
      else if (_x63 === 2) {
        var _x67 = producer.producer_plane;
        var _x68 = producer.producer_scope.scope_body;
        return settle_trace_result(_x67, _x68.value);
      }
      else if (_x63 === 3) {
        var _x69 = $kokaine_internal_compat.capture_error(function() {
          return $std_core_exn.$throw("derived value belongs to a retired branch");
        });
        if (_x69._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x69.error);
        }
        else {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
      }
      else {
        var _x70 = $kokaine_internal_compat.capture_error(function() {
          return $std_core_exn.$throw("derived value belongs to a retired scope");
        });
        if (_x70._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x70.error);
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
   
  var walk = $kokaine_reactive_internal_model.enter_settle_walk();
  var _x73 = producer_0.producer_settling;
  var _x72 = _x73.value;
  if (_x72) {
    var _x74 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic derived continuation");
    });
    if (_x74._tag === 1) {
      var _x71 = $kokaine_reactive_internal_model.Settle_failed(_x74.error);
    }
    else {
      var _x71 = $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x76 = producer_0.producer_clean;
    var _x75 = $std_core_types._int_eq((_x76.value),walk);
    if (_x75) {
       
      var _x77 = producer_0.producer_scope.scope_lifetime.lifetime_token;
      var scope_state_10151 = _x77.value;
      if (scope_state_10151 === 2) {
        var _x71 = $kokaine_reactive_internal_model.Settle_ok;
      }
      else {
         
        var _x77 = producer_0.producer_settling;
        ((_x77).value = true);
         
        var result_1 = settle_producer_body(producer_0);
         
        var _x78 = producer_0.producer_settling;
        ((_x78).value = false);
         
        if (result_1._tag === 1) {
          var _x79 = producer_0.producer_clean;
          var x_10647 = ((_x79).value = walk);
        }
        else {
          var x_10647 = $std_core_types.Unit;
        }
        if ($std_core_hnd._yielding()) {
          var _x71 = $std_core_hnd.yield_extend(function(_c_x10312_0 /* () */ ) {
            return _mlift_settle_producer_result_10581(result_1, _c_x10312_0);
          });
        }
        else {
          var _x71 = _mlift_settle_producer_result_10581(result_1, x_10647);
        }
      }
    }
    else {
       
      var _x77 = producer_0.producer_settling;
      ((_x77).value = true);
       
      var result_0_0 = settle_producer_body(producer_0);
       
      var _x78 = producer_0.producer_settling;
      ((_x78).value = false);
       
      if (result_0_0._tag === 1) {
        var _x79 = producer_0.producer_clean;
        var x_0_10649 = ((_x79).value = walk);
      }
      else {
        var x_0_10649 = $std_core_types.Unit;
      }
      if ($std_core_hnd._yielding()) {
        var _x71 = $std_core_hnd.yield_extend(function(_c_x10314_0 /* () */ ) {
          return _mlift_settle_producer_result_10582(result_0_0, _c_x10314_0);
        });
      }
      else {
        var _x71 = _mlift_settle_producer_result_10582(result_0_0, x_0_10649);
      }
    }
  }
  return $std_core_hnd.finally_prompt(function() {
       
      $kokaine_reactive_internal_model.leave_settle_walk();
      return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
    }, _x71);
}
 
export function settle_read_node(plane, current, gate, child) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<total>>) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x78 = gate.gate_state;
  var _x77 = _x78.value;
  if (_x77 === 5) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x77 === 2) {
     
    if (gate.gate_input_producer === null) {
      var input = $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      var input = settle_producer_result(gate.gate_input_producer.value);
    }
    var _x80 = gate.gate_state;
    var _x79 = _x80.value;
    if (_x79 === 5) {
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
  var _x82 = gate_1.gate_state;
  var _x81 = _x82.value;
  if (_x81 === 5) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x81 === 2) {
     
    var nested = settle_trace_result(plane_1, child_1.value);
    var _x84 = gate_1.gate_state;
    var _x83 = _x84.value;
    if (_x83 === 5) {
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
  var _x86 = gate_2.gate_state;
  var _x85 = _x86.value;
  if (_x85 === 3) {
    var _x88 = gate_2.gate_parent;
    var _x87 = pending_ancestor_loop(_x88);
    if (_x87) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      if (current_2 === null) {
        return settle_trace_result(plane_2, current_2);
      }
      else {
        var _x89 = resume_node(plane_2, current_2, current_2.trace_gate, current_2.trace_child, current_2.trace_frame, current_2.trace_resume);
        if (_x89._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x89.error);
        }
        else {
          return settle_trace_result(plane_2, current_2);
        }
      }
    }
  }
  else if (_x85 === 2) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x85 === 1) {
    var _x90 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a draft derivation");
    });
    if (_x90._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x90.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x85 === 4) {
    var _x91 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a running derivation");
    });
    if (_x91._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x91.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x92 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived continuation was retired");
    });
    if (_x92._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x92.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
}
 
export function validate_owner_gate_current(gate_3_0) /* (gate : kokaine/reactive/internal/model/continuation-gate) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x94 = gate_3_0.gate_state;
  var _x93 = _x94.value;
  if (_x93 === 2) {
    if (gate_3_0.gate_input_producer === null) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      var _x95 = settle_producer_result(gate_3_0.gate_input_producer.value);
      if (_x95._tag === 2) {
        return $kokaine_reactive_internal_model.Settle_deferred;
      }
      else if (_x95._tag === 3) {
        return $kokaine_reactive_internal_model.Settle_failed(_x95.settle_exception);
      }
      else {
        var _x97 = gate_3_0.gate_state;
        var _x96 = _x97.value;
        if (_x96 === 2) {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
        else if (_x96 === 3) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else if (_x96 === 4) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else {
          var _x98 = $kokaine_internal_compat.capture_error(function() {
            return $std_core_exn.$throw("derived owner changed while validating its input");
          });
          if (_x98._tag === 1) {
            return $kokaine_reactive_internal_model.Settle_failed(_x98.error);
          }
          else {
            return $kokaine_reactive_internal_model.Settle_ok;
          }
        }
      }
    }
  }
  else if (_x93 === 3) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x93 === 4) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x93 === 1) {
    var _x99 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation is draft");
    });
    if (_x99._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x99.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x100 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation was retired");
    });
    if (_x100._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x100.error);
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
    var _x102 = parent_0.value.gate_parent;
    var _x101 = validate_owner_gate(_x102);
    if (_x101._tag === 1) {
      return validate_owner_gate_current(parent_0.value);
    }
    else if (_x101._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      return $kokaine_reactive_internal_model.Settle_failed(_x101.settle_exception);
    }
  }
}
 
 
// monadic lift
export function _mlift_run_derive_work_10583(current, plane, _c_x10334) /* (current : kokaine/reactive/internal/model/work<total>, plane : kokaine/reactive/internal/model/plane<total>, maybe<kokaine/reactive/internal/model/derive-producer>) -> kokaine/reactive/internal/model/settle-result */  {
  if (_c_x10334 === null) {
    var _x103 = run_work_raw(plane, current);
    if (_x103._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x103.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    return settle_producer_result(_c_x10334.value);
  }
}
 
export function run_derive_work(plane, current) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/work<total>) -> div kokaine/reactive/internal/model/settle-result */  {
   
  var previous_phase = $kokaine_reactive_internal_model.enter_pure_plane();
   
  if (current._tag === 1) {
    if (current.resume_trace === null) {
      var x_10653 = $std_core_types.Nothing;
    }
    else {
      var x_10653 = (current.resume_trace.trace_owner).value;
    }
  }
  else {
    var x_10653 = (current.bootstrap_owner).value;
  }
  if ($std_core_hnd._yielding()) {
    var _x104 = $std_core_hnd.yield_extend(function(_c_x10334 /* maybe<kokaine/reactive/internal/model/derive-producer> */ ) {
      return _mlift_run_derive_work_10583(current, plane, _c_x10334);
    });
  }
  else {
    var _x104 = _mlift_run_derive_work_10583(current, plane, x_10653);
  }
  return $std_core_hnd.finally_prompt(function() {
      return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
    }, _x104);
}
 
export function run_next_derived_loop(plane, deferred) /* (plane : kokaine/reactive/internal/model/plane<total>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> div error<bool> */  { tailcall: while(1)
{
   
  var _x105 = plane.plane_queue;
  var next = take_queued_work_loop(_x105, $std_core_types.Nil);
  if (next === null) {
     
    restore_deferred(plane, deferred);
    return $std_core_types.Ok(false);
  }
  else {
    var _x105 = run_derive_work(plane, next.value);
    if (_x105._tag === 1) {
       
      var _x106 = work_stale(next.value);
      if (_x106) {
        $std_core_types.Unit;
      }
      else {
        if (next.value._tag === 2) {
          var _x107 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x107, next.value);
        }
        else {
          var _x108 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x108, next.value);
        }
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.Ok(true);
    }
    else if (_x105._tag === 2) {
      {
        // tail call
        var _x106 = $std_core_types.Cons(next.value, deferred);
        deferred = _x106;
        continue tailcall;
      }
    }
    else {
       
      var _x107 = work_stale(next.value);
      if (_x107) {
        $std_core_types.Unit;
      }
      else {
        if (next.value._tag === 2) {
          var _x108 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x108, next.value);
        }
        else {
          var _x109 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x109, next.value);
        }
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.$Error(_x105.settle_exception);
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
export function _mlift_settle_producer_10584(result) /* (result : kokaine/reactive/internal/model/settle-result) -> exn () */  {
  if (result._tag === 1) {
    return $std_core_types.Unit;
  }
  else if (result._tag === 2) {
    return $std_core_exn.$throw("derived value is waiting for its effect owner");
  }
  else {
     
    var ev_10655 = $std_core_hnd._evv_at(0);
    var _x107 = $std_core_exn.throw_exn_fs__select(ev_10655.hnd);
    return _x107(ev_10655.marker, ev_10655, result.settle_exception);
  }
}
 
 
// Synchronous memo reads can execute this capability without gaining the
// ambient effect row. It follows only the target scope's actual Trace-read
// producer capabilities and never drains unrelated pure or effect work.
export function settle_producer(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> exn () */  {
   
  var x_10658 = $std_core_hnd._open_none1(settle_producer_result, producer);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_settle_producer_10584);
  }
  else {
    if (x_10658._tag === 1) {
      return $std_core_types.Unit;
    }
    else if (x_10658._tag === 2) {
      return $std_core_exn.$throw("derived value is waiting for its effect owner");
    }
    else {
       
      var ev_10661 = $std_core_hnd._evv_at(0);
      var _x108 = $std_core_exn.throw_exn_fs__select(ev_10661.hnd);
      return _x108(ev_10661.marker, ev_10661, x_10658.settle_exception);
    }
  }
}
 
 
// monadic lift
export function _mlift_drain_loop_10585(first_failure, root, _y_x10340) /* forall<_e,e1> (first-failure : maybe<exception>, root : kokaine/reactive/internal/model/root<e1>, error<bool>) -> <div|e1> result<(),exception> */  {
  if (_y_x10340._tag === 1) {
    var _x109 = root.root_constructing;
    if (_x109.value){
      return $std_core_types.$Error(_y_x10340.error);
    }
  }
  if (_y_x10340._tag === 1) {
    if (first_failure === null) {
      var _x110 = $std_core_types.Just(_y_x10340.error);
    }
    else {
      var _x110 = first_failure;
    }
    return drain_loop(root, _x110);
  }
  if (_y_x10340._tag === 2 && _y_x10340.value) {
    return drain_loop(root, first_failure);
  }
  if (first_failure === null) {
    return $std_core_types.Ok($std_core_types.Unit);
  }
  else {
    return $std_core_types.$Error(first_failure.value);
  }
}
 
export function drain_loop(root_0, first_failure_0) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, first-failure : maybe<exception>) -> <div|e> error<()> */  { tailcall: while(1)
{
   
  var _x111 = root_0.root_derive_plane;
  var derivation = run_next_derived_loop(_x111, $std_core_types.Nil);
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
     
    var _x111 = root_0.root_effect_plane;
    var x_10664 = run_next_effect(_x111);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10340_0 /* error<bool> */ ) {
        return _mlift_drain_loop_10585(first_failure_0, root_0, _y_x10340_0);
      });
    }
    else {
      if (x_10664._tag === 1) {
        var _x111 = root_0.root_constructing;
        if (_x111.value){
          return $std_core_types.$Error(x_10664.error);
        }
      }
      if (x_10664._tag === 1) {
        {
          // tail call
          if (first_failure_0 === null) {
            var _x112 = $std_core_types.Just(x_10664.error);
          }
          else {
            var _x112 = first_failure_0;
          }
          first_failure_0 = _x112;
          continue tailcall;
        }
      }
      if (x_10664._tag === 2 && x_10664.value) {
        {
          // tail call
          continue tailcall;
        }
      }
      if (first_failure_0 === null) {
        return $std_core_types.Ok($std_core_types.Unit);
      }
      else {
        return $std_core_types.$Error(first_failure_0.value);
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_flush_10586(result) /* forall<e> (result : error<()>) -> <exn,div|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
}
 
 
// monadic lift
export function _mlift_flush_10587(root, _y_x10345) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, hnd/ev-index) -> <exn,div|e1> () */  {
   
  var x_10667 = $std_core_hnd._mask_at(_y_x10345, false, function() {
      return $std_core_hnd.finally_prompt(function() {
          var _x113 = root.root_flushing;
          return ((_x113).value = false);
        }, drain_loop(root, $std_core_types.Nothing));
    });
   
  function next_10668(result) /* (error<()>) -> <exn,div|5101> () */  {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10668);
  }
  else {
    return next_10668(x_10667);
  }
}
 
export function flush(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div,exn|e> () */  {
   
  var value_10490 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<5101> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x113 = value_10490.value;
  if (_x113) {
    return $std_core_types.Unit;
  }
  else {
     
    var value_0_10492 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<5101> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x114 = value_0_10492.value;
    if (_x114) {
      return $std_core_types.Unit;
    }
    else {
       
      var value_1_10494 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<5101> */ ) {
          return root_2.root_flushing;
        }, root);
      var _x115 = value_1_10494.value;
      if (_x115) {
        return $std_core_types.Unit;
      }
      else {
         
        var value_2_10496 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<5101> */ ) {
            return root_3.root_batch_depth;
          }, root);
        var _x116 = $std_core_types._int_gt((value_2_10496.value),0);
        if (_x116) {
          return $std_core_types.Unit;
        }
        else {
           
          var target_10498 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<5101> */ ) {
              return root_4.root_flushing;
            }, root);
           
          ((target_10498).value = true);
           
          var x_10672 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10345 /* hnd/ev-index */ ) {
              return _mlift_flush_10587(root, _y_x10345);
            });
          }
          else {
             
            var x_0_10675 = $std_core_hnd._mask_at(x_10672, false, function() {
                return $std_core_hnd.finally_prompt(function() {
                    var _x117 = root.root_flushing;
                    return ((_x117).value = false);
                  }, drain_loop(root, $std_core_types.Nothing));
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
                return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
              });
            }
            else {
              return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, x_0_10675);
            }
          }
        }
      }
    }
  }
}
 
export function check_root(root, key) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, key : kokaine/reactive/internal/model/root-key) -> exn () */  {
   
  var _x_x1_10559 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<5170> */ ) {
      return root_0.root_key;
    }, root);
  var _x117 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/model/root-key */ , right /* kokaine/reactive/internal/model/root-key */ ) {
      var _x118 = left;
      var _x119 = right;
      return Object.is(_x118,_x119);
    }, _x_x1_10559, key);
  if (_x117) {
     
    var value_10508 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<5170> */ ) {
        return root_1.root_disposed;
      }, root);
     
    var _x_x1_1_10563 = value_10508.value;
    var _x120 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_1_10563);
    if (_x120) {
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
   
  var value_10510 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<5238> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x121 = value_10510.value;
  if (_x121) {
    return $std_core_exn.$throw("reactive value created in a disposed root");
  }
  else {
     
    var value_0_10512 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<5238> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x122 = value_0_10512.value;
    if (_x122) {
      return $std_core_exn.$throw("reactive value created in a disposed root");
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_check_frame_registration_10588(current, wild__) /* forall<_e,e1> (current : kokaine/reactive/internal/model/frame<e1>, wild_ : ()) -> exn () */  {
   
  var _x_x1_10566 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<5297> */ ) {
      return frame;
    }, current);
   
  var value_10514 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<5297> */ ) {
      return _this.lifetime_token;
    }, _x_x1_10566);
  var _x123 = value_10514.value;
  if (_x123 === 1) {
    return $std_core_types.Unit;
  }
  else if (_x123 === 2) {
    return $std_core_types.Unit;
  }
  else {
    return $std_core_exn.$throw("reactive value created under a retired continuation branch");
  }
}
 
export function check_frame_registration(root, current) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, current : kokaine/reactive/internal/model/frame<e>) -> exn () */  {
   
  var x_10681 = check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_check_frame_registration_10588(current, wild__);
    });
  }
  else {
     
    var _x_x1_10566 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<5297> */ ) {
        return frame;
      }, current);
     
    var value_10514 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<5297> */ ) {
        return _this.lifetime_token;
      }, _x_x1_10566);
    var _x124 = value_10514.value;
    if (_x124 === 1) {
      return $std_core_types.Unit;
    }
    else if (_x124 === 2) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("reactive value created under a retired continuation branch");
    }
  }
}
 
export function new_source(root, value, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, value : a, equals : (a, a) -> bool) -> kokaine/reactive/internal/model/source<a> */  {
  var _x125 = root.root_key;
  return $kokaine_reactive_internal_model.Source(_x125, { value: value }, equals, { value: 0 }, $kokaine_internal_registry.new_registry());
}