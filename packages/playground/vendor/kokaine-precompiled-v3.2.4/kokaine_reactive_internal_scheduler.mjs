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
  var _x3 = $kokaine_reactive_internal_model.load(_x4);
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
      $kokaine_reactive_internal_model.store(_x5, _x6);
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
    var _x5 = $kokaine_reactive_internal_model.load(_x6);
    if (_x5 === 2) {
       
      var _x7 = current.trace_gate.gate_state;
      $kokaine_reactive_internal_model.store(_x7, $kokaine_reactive_internal_model.Capture_pending);
       
      var _x8 = plane.plane_queue;
      var target_0_10020 = $kokaine_reactive_internal_work_dash_transaction.load(_x8);
      var _x7 = plane.plane_queue;
      var _x8 = target_0_10020.deque_front;
      var _x9 = target_0_10020.deque_back;
      return $kokaine_reactive_internal_work_dash_transaction.store(_x7, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Cons($kokaine_reactive_internal_model.Resume_work(current), _x8), _x9));
    }
    else if (_x5 === 4) {
      var _x10 = current.trace_gate.gate_state;
      return $kokaine_reactive_internal_model.store(_x10, $kokaine_reactive_internal_model.Capture_pending);
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
    var _x11 = $kokaine_reactive_internal_lifetime.trace_state_of(current);
    if (_x11 === 5) {
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
    var _x13 = parent.value.gate_state;
    var _x12 = $kokaine_reactive_internal_model.load(_x13);
    if (_x12 === 3) {
      return true;
    }
    else if (_x12 === 4) {
      return true;
    }
    else if (_x12 === 5) {
      return false;
    }
    else if (_x12 === 1) {
      {
        // tail call
        var _x14 = parent.value.gate_parent;
        parent = _x14;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        var _x15 = parent.value.gate_parent;
        parent = _x15;
        continue tailcall;
      }
    }
  }
}}
 
export function pending_ancestor(parent) /* (parent : maybe<kokaine/reactive/internal/model/continuation-gate>) -> bool */  {
  return pending_ancestor_loop(parent);
}
 
export function notify_source(source) /* forall<a> (source : kokaine/reactive/internal/model/source<a>) -> () */  {
  var _x16 = source.source_captures;
  return $kokaine_internal_registry.registry_fs_visit_readonly(_x16, cut_capture);
}
 
export function activate_trace_loop(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> div () */  {
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x18 = current.trace_gate.gate_state;
    var _x17 = $kokaine_reactive_internal_model.load(_x18);
    if (_x17 === 1) {
       
      var current_frame = $kokaine_reactive_internal_model.load(current.trace_frame);
       
      var _x19 = current.trace_gate.gate_state;
      $kokaine_reactive_internal_model.store(_x19, $kokaine_reactive_internal_model.Capture_live);
       
      var _x20 = current_frame.lifetime_token;
      $kokaine_reactive_internal_model.store(_x20, $kokaine_reactive_internal_model.Scope_live);
       
      activate_trace_loop(plane, $kokaine_reactive_internal_model.load(current.trace_child));
      var _x19 = current.trace_stale();
      if (_x19) {
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
      var _x20 = left.resume_trace.trace_gate.gate_state;
      var _x21 = right.resume_trace.trace_gate.gate_state;
      return Object.is(_x20,_x21);
    }
    else {
      return false;
    }
  }
  else if (left._tag === 2) {
    if (right._tag === 2) {
      var _x22 = left.bootstrap_scope.scope_lifetime.lifetime_token;
      var _x23 = right.bootstrap_scope.scope_lifetime.lifetime_token;
      return Object.is(_x22,_x23);
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
  var _x25 = plane.plane_failed;
  var _x24 = $kokaine_reactive_internal_model.load(_x25);
  if (_x24 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x26 = plane.plane_failed;
    $kokaine_reactive_internal_model.store(_x26, $std_core_types.Nil);
    return $std_core_list.foreach($std_core_list.reverse_acc($std_core_types.Nil, _x24), requeue_behind);
  }
}
 
export function work_runnable(current) /* forall<e> (current : kokaine/reactive/internal/model/work<e>) -> bool */  {
  if (current._tag === 2) {
    var _x27 = current.bootstrap_scope.scope_lifetime.lifetime_token;
    var _x26 = $kokaine_reactive_internal_model.load(_x27);
    if (_x26 === 1) {
       
      var _x28 = current.bootstrap_scope.scope_bootstrap_slot;
      var maybe_10037 = $kokaine_reactive_internal_model.load(_x28);
      if (maybe_10037 !== null) {
         
        var _x28 = current.bootstrap_scope.scope_parent;
        var b_10039 = pending_ancestor_loop(_x28);
        return (b_10039) ? false : true;
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
    var _x28 = $kokaine_reactive_internal_lifetime.trace_state_of(current.resume_trace);
    if (_x28 === 3) {
       
      if (current.resume_trace === null) {
        var _x30 = $std_core_types.Nothing;
      }
      else {
        var _x30 = $std_core_types.Just(current.resume_trace.trace_gate);
      }
      if (_x30 === null) {
        var _x29 = $std_core_types.Nothing;
      }
      else {
        var _x29 = _x30.value.gate_parent;
      }
      var b_0_10043 = pending_ancestor_loop(_x29);
      return (b_0_10043) ? false : true;
    }
    else {
      return false;
    }
  }
}
 
export function work_stale(current) /* forall<e> (current : kokaine/reactive/internal/model/work<e>) -> bool */  {
  if (current._tag === 2) {
    var _x30 = current.bootstrap_scope.scope_lifetime.lifetime_token;
    var _x29 = $kokaine_reactive_internal_model.load(_x30);
    if (_x29 === 1) {
       
      var _x31 = current.bootstrap_scope.scope_bootstrap_slot;
      var maybe_10049 = $kokaine_reactive_internal_model.load(_x31);
      return (maybe_10049 === null);
    }
    else {
      return true;
    }
  }
  else {
    var _x31 = $kokaine_reactive_internal_lifetime.trace_state_of(current.resume_trace);
    if (_x31 === 5) {
      return true;
    }
    else if (_x31 === 1) {
      return true;
    }
    else if (_x31 === 2) {
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
     
    var target_0_10020 = $kokaine_reactive_internal_work_dash_transaction.load(queue);
     
    var _x32 = target_0_10020.deque_front;
    var _x33 = target_0_10020.deque_back;
    $kokaine_reactive_internal_work_dash_transaction.store(queue, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Cons(skipped.head, _x32), _x33));
    {
      // tail call
      skipped = skipped.tail;
      continue tailcall;
    }
  }
}}
 
export function take_queued_work_loop(queue, skipped) /* forall<e> (queue : kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<e>>, skipped : list<kokaine/reactive/internal/model/work<e>>) -> div maybe<kokaine/reactive/internal/model/work<e>> */  { tailcall: while(1)
{
  var _x32 = $kokaine_reactive_internal_work_dash_transaction.deque_fs_pop($kokaine_reactive_internal_work_dash_transaction.load(queue));
   
  $kokaine_reactive_internal_work_dash_transaction.store(queue, _x32.snd);
  if (_x32.fst === null) {
     
    restore_skipped(queue, skipped);
    return $std_core_types.Nothing;
  }
  else {
    var _x33 = work_runnable(_x32.fst.value);
    if (_x33) {
       
      restore_skipped(queue, skipped);
      return $std_core_types.Just(_x32.fst.value);
    }
    else {
      var _x34 = work_stale(_x32.fst.value);
      if (_x34) {
        {
          // tail call
          continue tailcall;
        }
      }
      else {
        {
          // tail call
          var _x35 = $std_core_types.Cons(_x32.fst.value, skipped);
          skipped = _x35;
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
     
    var target_0_10031 = $kokaine_reactive_internal_work_dash_transaction.load(queue);
    var _x36 = target_0_10031.deque_front;
    var _x37 = target_0_10031.deque_back;
    return $kokaine_reactive_internal_work_dash_transaction.store(queue, $kokaine_reactive_internal_work_dash_transaction.Deque(_x36, $std_core_types.Cons(current, _x37)));
  }
  else {
     
    var target_0_10020 = $kokaine_reactive_internal_work_dash_transaction.load(queue);
    var _x38 = target_0_10020.deque_front;
    var _x39 = target_0_10020.deque_back;
    return $kokaine_reactive_internal_work_dash_transaction.store(queue, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Cons(current, _x38), _x39));
  }
}
 
export function queue_work(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/work<e>) -> () */  {
  if (current._tag === 2) {
    var _x40 = plane.plane_queue;
    var _x41 = plane.plane_work_group;
    return $kokaine_reactive_internal_work_dash_transaction.route_bootstrap(_x40, $kokaine_reactive_internal_model.load(_x41), current);
  }
  else {
     
    var _x42 = plane.plane_queue;
    var target_0_10020 = $kokaine_reactive_internal_work_dash_transaction.load(_x42);
    var _x42 = plane.plane_queue;
    var _x43 = target_0_10020.deque_front;
    var _x44 = target_0_10020.deque_back;
    return $kokaine_reactive_internal_work_dash_transaction.store(_x42, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Cons(current, _x43), _x44));
  }
}
 
 
// monadic lift
export function _mlift_abandon_draft_frame_10510(_pat_5) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function abandon_draft_frame(current, drafts) /* forall<e> (current : kokaine/reactive/internal/model/frame<e>, drafts : list<kokaine/reactive/internal/model/trace<e>>) -> e () */  {
   
  var _x45 = current.lifetime_token;
  $kokaine_reactive_internal_model.store(_x45, $kokaine_reactive_internal_model.Scope_branch_dead);
   
  var _x46 = current;
  var x_10528 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x46, drafts);
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
          var _x45 = old_frame;
          return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(_x45);
        }), $std_core_types.Nil)), $std_core_types.Nil);
}
 
export function retire_replaced_generation_raw(old, old_frame) /* forall<e> (old : kokaine/reactive/internal/model/trace<e>, old-frame : kokaine/reactive/internal/model/frame<e>) -> <div,exn|e> () */  {
  if (old === null) {
     
    var _x_x1_10405 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<1967> */ ) {
        return frame;
      }, old_frame);
    var _x46 = $std_core_hnd._open_none1($kokaine_reactive_internal_lifetime.lifetime_owner_fs_try_retire_empty, _x_x1_10405);
    if (_x46) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_1_10407 = $std_core_hnd._open_none1(function(frame_0 /* kokaine/reactive/internal/model/frame<1967> */ ) {
          return frame_0;
        }, old_frame);
      return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<1967> */ ) {
            return _this.lifetime_retirement;
          }, _x_x1_1_10407), $std_core_hnd._open_none2(collect_replaced_generation, old, old_frame));
    }
  }
  else {
     
    var _x_x1_4_10411 = $std_core_hnd._open_none1(function(frame_1 /* kokaine/reactive/internal/model/frame<1967> */ ) {
        return frame_1;
      }, old_frame);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<1967> */ ) {
          return _this_0.lifetime_retirement;
        }, _x_x1_4_10411), $std_core_hnd._open_none2(collect_replaced_generation, old, old_frame));
  }
}
 
export function built_trace_fs_run_publication(built, plane) /* forall<e> (built : kokaine/reactive/internal/model/built-trace<e>, plane : kokaine/reactive/internal/model/plane<e>) -> <div|e> error<()> */  {
  return $kokaine_internal_compat.capture_error(function() {
    var _x47 = built.built_publication_action;
    return $kokaine_reactive_internal_lifetime.with_context(plane, $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/built-trace<2024> */ ) {
          return _this_0.built_publication_current;
        }, built), $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/built-trace<2024> */ ) {
          return _this_1.built_publication_frame;
        }, built), _x47);
  });
}
 
export function restore_resume_build_context(plane, previous_draft, previous_current, previous_frame) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, previous-draft : maybe<ref<global,list<kokaine/reactive/internal/model/trace<e>>>>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e>) -> () */  {
   
  var _x48 = plane.plane_current_frame;
  $kokaine_reactive_internal_model.store(_x48, previous_frame);
   
  var _x49 = plane.plane_current;
  $kokaine_reactive_internal_model.store(_x49, previous_current);
  var _x48 = plane.plane_draft;
  return $kokaine_reactive_internal_model.store(_x48, previous_draft);
}
 
export function restore_resume_publication_context(plane, previous_current, previous_frame) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e>) -> () */  {
   
  var _x49 = plane.plane_current_frame;
  $kokaine_reactive_internal_model.store(_x49, previous_frame);
  var _x49 = plane.plane_current;
  return $kokaine_reactive_internal_model.store(_x49, previous_current);
}
 
 
// monadic lift
export function _mlift_rollback_resume_10511(draft_frame, drafts, _c_x10189) /* forall<e> (draft-frame : kokaine/reactive/internal/model/frame<e>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e>>>, ()) -> () */  {
   
  var drafts_0_10627 = $kokaine_reactive_internal_model.load(drafts);
   
  var _x50 = draft_frame.lifetime_token;
  $kokaine_reactive_internal_model.store(_x50, $kokaine_reactive_internal_model.Scope_branch_dead);
   
  var _x51 = draft_frame;
  var x_10528 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x51, drafts_0_10627);
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
   
  var _x50 = $kokaine_reactive_internal_model.load(state);
  if (_x50 === 4) {
    var x_10533 = $kokaine_reactive_internal_model.store(state, $kokaine_reactive_internal_model.Capture_pending);
  }
  else {
    var x_10533 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10189 /* () */ ) {
       
      var drafts_0_10629 = $kokaine_reactive_internal_model.load(drafts);
       
      var _x50 = draft_frame.lifetime_token;
      $kokaine_reactive_internal_model.store(_x50, $kokaine_reactive_internal_model.Scope_branch_dead);
       
      var _x51 = draft_frame;
      var x_10528 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x51, drafts_0_10629);
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
     
    var drafts_1_10631 = $kokaine_reactive_internal_model.load(drafts);
     
    var _x50 = draft_frame.lifetime_token;
    $kokaine_reactive_internal_model.store(_x50, $kokaine_reactive_internal_model.Scope_branch_dead);
     
    var _x51 = draft_frame;
    var x_10528_0 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x51, drafts_1_10631);
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
export function _mlift_resume_node_10512(_y_x10198) /* forall<e> (hnd/ev-index) -> <exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10198, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_resume_node_10513(_y_x10203) /* forall<e> (hnd/ev-index) -> <exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10203, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_resume_node_10514(_y_x10207) /* forall<e> (hnd/ev-index) -> <exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10207, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_resume_node_10515(draft_frame, phase, _c_x10206) /* forall<e> (draft-frame : kokaine/reactive/internal/model/frame<e>, phase : ref<global,resume-phase>, ()) -> () */  {
   
  var _x_x1_40_10478 = $std_core_hnd._open_none1(function(frame_0 /* kokaine/reactive/internal/model/frame<2905> */ ) {
      return frame_0;
    }, draft_frame);
   
  var _x_x1_39_10476 = $std_core_hnd._open_none1(function(_this_6 /* kokaine/reactive/internal/model/lifetime-owner<2905> */ ) {
      return _this_6.lifetime_token;
    }, _x_x1_40_10478);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_39_10476, $kokaine_reactive_internal_model.Scope_live);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, phase, Resume_complete);
   
  var x_10540 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
   
  function next_10541(_y_x10207) /* (hnd/ev-index) -> <exn|2905> () */  {
    return $std_core_hnd._mask_at(_y_x10207, false, function() {
        return $std_core_types.Unit;
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10541);
  }
  else {
    return next_10541(x_10540);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10516(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___16) /* forall<e> (built : kokaine/reactive/internal/model/built-trace<e>, child : ref<global,kokaine/reactive/internal/model/trace<e>>, draft-frame : kokaine/reactive/internal/model/frame<e>, phase : ref<global,resume-phase>, plane : kokaine/reactive/internal/model/plane<e>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e>, state : ref<global,kokaine/reactive/internal/model/capture-state>, wild_@16 : ()) -> <div,exn|e> () */  {
   
  var _x_x1_27_10458 = $std_core_hnd._open_none1(function(plane_15 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_15.plane_current_frame;
    }, plane);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_27_10458, previous_frame);
   
  var _x_x1_29_10461 = $std_core_hnd._open_none1(function(plane_16 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_16.plane_current;
    }, plane);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_29_10461, previous_current);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, phase, Resume_ambient);
  var _x50 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, state);
  if (_x50 === 5) {
     
    var x_10544 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
     
    var next_10545 = function(_y_x10203 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10203, false, function() {
          return $std_core_types.Unit;
        });
    };
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_10545);
    }
    else {
      return next_10545(x_10544);
    }
  }
  else {
     
    var _x_x2_15_10468 = $std_core_hnd._open_none1(function(_this_4 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_4.built_root;
      }, built);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, child, _x_x2_15_10468);
     
    var _x_x2_16_10471 = $std_core_hnd._open_none1(function(_this_5 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_5.built_root;
      }, built);
     
    $std_core_hnd._open_none2(function(plane_17 /* kokaine/reactive/internal/model/plane<2905> */ , current_0 /* kokaine/reactive/internal/model/trace<2905> */ ) {
        return activate_trace_loop(plane_17, current_0);
      }, plane, _x_x2_16_10471);
     
    var _x51 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, state);
    if (_x51 === 4) {
      var x_0_10547 = $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, state, $kokaine_reactive_internal_model.Capture_live);
    }
    else {
      var x_0_10547 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10206 /* () */ ) {
        return _mlift_resume_node_10515(draft_frame, phase, _c_x10206);
      });
    }
    else {
      return _mlift_resume_node_10515(draft_frame, phase, x_0_10547);
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10517(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___12) /* forall<e> (built : kokaine/reactive/internal/model/built-trace<e>, child : ref<global,kokaine/reactive/internal/model/trace<e>>, draft-frame : kokaine/reactive/internal/model/frame<e>, phase : ref<global,resume-phase>, plane : kokaine/reactive/internal/model/plane<e>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-frame : kokaine/reactive/internal/model/frame<e>, state : ref<global,kokaine/reactive/internal/model/capture-state>, wild_@12 : ()) -> <div,exn|e> () */  {
  var _x51 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, state);
  if (_x51 === 5) {
     
    var x_10550 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
     
    var next_10551 = function(_y_x10198 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10198, false, function() {
          return $std_core_types.Unit;
        });
    };
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_10551);
    }
    else {
      return next_10551(x_10550);
    }
  }
  else {
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, phase, Resume_publication);
     
    var _x_x1_20_10449 = $std_core_hnd._open_none1(function(plane_13 /* kokaine/reactive/internal/model/plane<2905> */ ) {
        return plane_13.plane_current;
      }, plane);
     
    var _x_x2_10_10450 = $std_core_hnd._open_none1(function(_this_1 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_1.built_publication_current;
      }, built);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_20_10449, _x_x2_10_10450);
     
    var _x_x1_23_10453 = $std_core_hnd._open_none1(function(plane_14 /* kokaine/reactive/internal/model/plane<2905> */ ) {
        return plane_14.plane_current_frame;
      }, plane);
     
    var _x_x2_11_10454 = $std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_2.built_publication_frame;
      }, built);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_23_10453, _x_x2_11_10454);
     
    var publication = $std_core_hnd._open_none1(function(_this_3 /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        return _this_3.built_publication_action;
      }, built);
     
    var x_0_10553 = publication();
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___16 /* () */ ) {
        return _mlift_resume_node_10516(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___16);
      });
    }
    else {
      return _mlift_resume_node_10516(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, x_0_10553);
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10518(child, current_frame_slot, draft_frame, old_frame, phase, plane, previous_current, previous_draft, previous_frame, state, built) /* forall<e> (child : ref<global,kokaine/reactive/internal/model/trace<e>>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e>>, draft-frame : kokaine/reactive/internal/model/frame<e>, old-frame : kokaine/reactive/internal/model/frame<e>, phase : ref<global,resume-phase>, plane : kokaine/reactive/internal/model/plane<e>, previous-current : maybe<kokaine/reactive/internal/model/continuation-gate>, previous-draft : maybe<ref<global,list<kokaine/reactive/internal/model/trace<e>>>>, previous-frame : kokaine/reactive/internal/model/frame<e>, state : ref<global,kokaine/reactive/internal/model/capture-state>, built : kokaine/reactive/internal/model/built-trace<e>) -> <div,exn|e> () */  {
   
  var _x_x1_5_10426 = $std_core_hnd._open_none1(function(plane_10 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_10.plane_current_frame;
    }, plane);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_5_10426, previous_frame);
   
  var _x_x1_7_10429 = $std_core_hnd._open_none1(function(plane_11 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_11.plane_current;
    }, plane);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_7_10429, previous_current);
   
  var _x_x1_9_10432 = $std_core_hnd._open_none1(function(plane_12 /* kokaine/reactive/internal/model/plane<2905> */ ) {
      return plane_12.plane_draft;
    }, plane);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_9_10432, previous_draft);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, phase, Resume_ambient);
   
  var old = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, child);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, child, $kokaine_reactive_internal_model.Trace_end);
   
  var _x_x1_15_10442 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<2905> */ ) {
      return frame;
    }, old_frame);
   
  var _x_x1_14_10440 = $std_core_hnd._open_none1(function(_this_0 /* kokaine/reactive/internal/model/lifetime-owner<2905> */ ) {
      return _this_0.lifetime_token;
    }, _x_x1_15_10442);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_14_10440, $kokaine_reactive_internal_model.Scope_branch_dead);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, current_frame_slot, draft_frame);
   
  var x_10555 = retire_replaced_generation_raw(old, old_frame);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___12 /* () */ ) {
      return _mlift_resume_node_10517(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, wild___12);
    });
  }
  else {
    return _mlift_resume_node_10517(built, child, draft_frame, phase, plane, previous_current, previous_frame, state, x_10555);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10519(attempt) /* forall<e> (attempt : error<()>) -> e result<(),exception> */  {
  if (attempt._tag === 1) {
    return $std_core_types.$Error(attempt.error);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function resume_node(plane, current, gate, child, current_frame_slot, resume) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<e>>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e>>, resume : (kokaine/reactive/internal/model/frame<e>) -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e>) -> <div|e> error<()> */  {
  var _x53 = gate.gate_state;
  var _x52 = $kokaine_reactive_internal_model.load(_x53);
  if (_x52 === 3) {
     
    var _x54 = gate.gate_state;
    $kokaine_reactive_internal_model.store(_x54, $kokaine_reactive_internal_model.Capture_running);
     
    var old_frame = $kokaine_reactive_internal_model.load(current_frame_slot);
     
    var _x55 = plane.plane_retirement;
    var draft_frame = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_starting, _x55);
     
    var drafts = $kokaine_reactive_internal_model.cell($std_core_types.Nil);
     
    var _x56 = plane.plane_draft;
    var previous_draft = $kokaine_reactive_internal_model.load(_x56);
     
    var _x57 = plane.plane_current;
    var previous_current = $kokaine_reactive_internal_model.load(_x57);
     
    var _x58 = plane.plane_current_frame;
    var previous_frame = $kokaine_reactive_internal_model.load(_x58);
     
    var phase = $kokaine_reactive_internal_model.cell(Resume_build);
     
    var x_10561 = $kokaine_internal_compat.capture_error(function() {
       
      var _x_x1_10417 = $std_core_hnd._open_none1(function(plane_7 /* kokaine/reactive/internal/model/plane<2905> */ ) {
          return plane_7.plane_draft;
        }, plane);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10417, $std_core_types.Just(drafts));
       
      var _x_x1_1_10420 = $std_core_hnd._open_none1(function(plane_8 /* kokaine/reactive/internal/model/plane<2905> */ ) {
          return plane_8.plane_current;
        }, plane);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_1_10420, $std_core_types.Just(gate));
       
      var _x_x1_3_10423 = $std_core_hnd._open_none1(function(plane_9 /* kokaine/reactive/internal/model/plane<2905> */ ) {
          return plane_9.plane_current_frame;
        }, plane);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_3_10423, draft_frame);
       
      var x_0_10563 = resume(draft_frame);
       
      var next_0_10564 = function(built /* kokaine/reactive/internal/model/built-trace<2905> */ ) {
        var _x59 = gate.gate_state;
        return _mlift_resume_node_10518(child, current_frame_slot, draft_frame, old_frame, phase, plane, previous_current, previous_draft, previous_frame, _x59, built);
      };
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_0_10564);
      }
      else {
        return next_0_10564(x_0_10563);
      }
    });
     
    var next_10562 = function(attempt /* error<()> */ ) {
      if (attempt._tag === 1) {
        return $std_core_types.$Error(attempt.error);
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    };
    if ($std_core_hnd._yielding()) {
      var _x58 = $std_core_hnd.yield_extend(next_10562);
    }
    else {
      var _x58 = next_10562(x_10561);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x54 = $kokaine_reactive_internal_model.load(phase);
        if (_x54 === 1) {
           
          var _x55 = plane.plane_current_frame;
          $kokaine_reactive_internal_model.store(_x55, previous_frame);
           
          var _x56 = plane.plane_current;
          $kokaine_reactive_internal_model.store(_x56, previous_current);
           
          var _x57 = plane.plane_draft;
          $kokaine_reactive_internal_model.store(_x57, previous_draft);
          var _x55 = gate.gate_state;
          return rollback_resume(_x55, draft_frame, drafts);
        }
        else if (_x54 === 2) {
          var _x56 = gate.gate_state;
          return rollback_resume(_x56, draft_frame, drafts);
        }
        else if (_x54 === 3) {
           
          var _x57 = plane.plane_current_frame;
          $kokaine_reactive_internal_model.store(_x57, previous_frame);
           
          var _x58 = plane.plane_current;
          $kokaine_reactive_internal_model.store(_x58, previous_current);
          var _x57 = gate.gate_state;
          return rollback_resume(_x57, draft_frame, drafts);
        }
        else {
          return $std_core_types.Unit;
        }
      }, _x58);
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
export function _mlift_run_bootstrap_10520(_pat_3_3) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function run_bootstrap(scope) /* forall<e> (scope : kokaine/reactive/internal/model/continuation-scope<e>) -> <div|e> error<()> */  {
  var _x60 = scope.scope_lifetime.lifetime_token;
  var _x59 = $kokaine_reactive_internal_model.load(_x60);
  if (_x59 === 1) {
     
    var _x61 = scope.scope_bootstrap_slot;
    var pending = $kokaine_reactive_internal_model.load(_x61);
     
    var _x62 = scope.scope_bootstrap_slot;
    $kokaine_reactive_internal_model.store(_x62, $std_core_types.Nothing);
    if (pending === null) {
      return $kokaine_internal_compat.capture_error(function() {
        return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "bootstrap slot was already consumed while scope is starting");
      });
    }
    else {
      return $std_core_hnd.finally_prompt(function() {
          var _x62 = scope.scope_lifetime.lifetime_token;
          var _x61 = $kokaine_reactive_internal_model.load(_x62);
          if (_x61 === 1) {
             
            var x_10569 = $kokaine_internal_compat.capture_error(function() {
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
  var _x63 = plane.plane_queue;
  return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(_x63, values_10091);
}
 
export function requeue_work(queue, current) /* forall<e> (queue : kokaine/reactive/internal/work-transaction/work-queue<kokaine/reactive/internal/model/work<e>>, current : kokaine/reactive/internal/model/work<e>) -> ((front : bool) -> ()) */  {
  return function(front /* bool */ ) {
    if (front) {
       
      var target_0_10020 = $kokaine_reactive_internal_work_dash_transaction.load(queue);
      var _x64 = target_0_10020.deque_front;
      var _x65 = target_0_10020.deque_back;
      return $kokaine_reactive_internal_work_dash_transaction.store(queue, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Cons(current, _x64), _x65));
    }
    else {
       
      var target_0_10031 = $kokaine_reactive_internal_work_dash_transaction.load(queue);
      var _x66 = target_0_10031.deque_front;
      var _x67 = target_0_10031.deque_back;
      return $kokaine_reactive_internal_work_dash_transaction.store(queue, $kokaine_reactive_internal_work_dash_transaction.Deque(_x66, $std_core_types.Cons(current, _x67)));
    }
  };
}
 
 
// monadic lift
export function _mlift_run_next_effect_10521(failure, _c_x10234) /* (failure : exception, ()) -> result<bool,exception> */  {
  return $std_core_types.$Error(failure);
}
 
 
// monadic lift
export function _mlift_run_next_effect_10522(current, plane, _y_x10233) /* forall<e> (current : kokaine/reactive/internal/model/work<e>, plane : kokaine/reactive/internal/model/plane<e>, error<()>) -> <div|e> result<bool,exception> */  {
  if (_y_x10233._tag === 1) {
     
    var _x68 = plane.plane_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_remove(_x68, function(other /* kokaine/reactive/internal/model/work<3475> */ ) {
        return same_work(other, current);
      });
     
    match: {
      if (current._tag === 1 && current.resume_trace !== null) {
         
        var b_10100 = work_stale(current);
        var _x69 = (b_10100) ? false : true;
        if (_x69){
           
          var _x70 = current.resume_trace.trace_gate.gate_state;
          var _x71 = plane.plane_queue;
          var ticket = $kokaine_reactive_internal_model.Failed_ticket(_x70, requeue_work(_x71, current));
          var _x70 = plane.plane_failed;
          var _x71 = plane.plane_failed;
          var x_10572 = $kokaine_reactive_internal_model.store(_x70, $std_core_types.Cons(ticket, $kokaine_reactive_internal_model.load(_x71)));
          break match;
        }
      }
      var x_10572 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10234 /* () */ ) {
        return $std_core_types.$Error(_y_x10233.error);
      });
    }
    else {
      return $std_core_types.$Error(_y_x10233.error);
    }
  }
  else {
    return $std_core_types.Ok(true);
  }
}
 
export function run_next_effect(plane) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>) -> <div|e> error<bool> */  {
   
  var _x68 = plane.plane_queue;
  var next = take_queued_work_loop(_x68, $std_core_types.Nil);
  if (next === null) {
    return $std_core_types.Ok(false);
  }
  else {
     
    var _x68 = plane.plane_queue;
    var target_0_10020 = $kokaine_reactive_internal_work_dash_transaction.load(_x68);
     
    var _x69 = plane.plane_queue;
    var _x70 = target_0_10020.deque_front;
    var _x71 = target_0_10020.deque_back;
    $kokaine_reactive_internal_work_dash_transaction.store(_x69, $kokaine_reactive_internal_work_dash_transaction.Deque($std_core_types.Cons(next.value, _x70), _x71));
     
    var x_10576 = run_work_raw(plane, next.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10233 /* error<()> */ ) {
        return _mlift_run_next_effect_10522(next.value, plane, _y_x10233);
      });
    }
    else {
      if (x_10576._tag === 1) {
         
        var _x68 = plane.plane_queue;
        $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_remove(_x68, function(other /* kokaine/reactive/internal/model/work<3475> */ ) {
            return same_work(other, next.value);
          });
         
        match: {
          if (next.value._tag === 1 && next.value.resume_trace !== null) {
             
            var b_10100 = work_stale(next.value);
            var _x69 = (b_10100) ? false : true;
            if (_x69){
               
              var _x70 = next.value.resume_trace.trace_gate.gate_state;
              var _x71 = plane.plane_queue;
              var ticket = $kokaine_reactive_internal_model.Failed_ticket(_x70, requeue_work(_x71, next.value));
              var _x70 = plane.plane_failed;
              var _x71 = plane.plane_failed;
              var x_0_10579 = $kokaine_reactive_internal_model.store(_x70, $std_core_types.Cons(ticket, $kokaine_reactive_internal_model.load(_x71)));
              break match;
            }
          }
          var x_0_10579 = $std_core_types.Unit;
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_c_x10234 /* () */ ) {
            return $std_core_types.$Error(x_10576.error);
          });
        }
        else {
          return $std_core_types.$Error(x_10576.error);
        }
      }
      else {
        return $std_core_types.Ok(true);
      }
    }
  }
}
 
export function settle_failure(message) /* (message : string) -> kokaine/reactive/internal/model/settle-result */  {
  var _x68 = $kokaine_internal_compat.capture_error(function() {
    return $std_core_exn.$throw(message);
  });
  if (_x68._tag === 1) {
    return $kokaine_reactive_internal_model.Settle_failed(_x68.error);
  }
  else {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
}
 
export function settle_producer_body(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> div kokaine/reactive/internal/model/settle-result */  { tailcall: while(1)
{
  var _x70 = producer.producer_scope.scope_lifetime.lifetime_token;
  var _x69 = $kokaine_reactive_internal_model.load(_x70);
  if (_x69 === 3) {
    var _x71 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired branch");
    });
    if (_x71._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x71.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x69 === 4) {
    var _x72 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired scope");
    });
    if (_x72._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x72.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x74 = producer.producer_scope.scope_parent;
    var _x73 = validate_owner_gate(_x74);
    if (_x73._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else if (_x73._tag === 3) {
      return $kokaine_reactive_internal_model.Settle_failed(_x73.settle_exception);
    }
    else {
      var _x76 = producer.producer_scope.scope_lifetime.lifetime_token;
      var _x75 = $kokaine_reactive_internal_model.load(_x76);
      if (_x75 === 1) {
        var _x78 = producer.producer_scope;
        var _x77 = run_bootstrap(_x78);
        if (_x77._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x77.error);
        }
        else {
          {
            // tail call
            continue tailcall;
          }
        }
      }
      else if (_x75 === 2) {
        var _x79 = producer.producer_plane;
        var _x80 = producer.producer_scope.scope_body;
        return settle_trace_result(_x79, $kokaine_reactive_internal_model.load(_x80));
      }
      else if (_x75 === 3) {
        var _x81 = $kokaine_internal_compat.capture_error(function() {
          return $std_core_exn.$throw("derived value belongs to a retired branch");
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
          return $std_core_exn.$throw("derived value belongs to a retired scope");
        });
        if (_x82._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x82.error);
        }
        else {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
      }
    }
  }
}}
 
export function settle_producer_result(producer_0) /* (producer : kokaine/reactive/internal/model/derive-producer) -> div kokaine/reactive/internal/model/settle-result */  {
   
  var previous = $kokaine_reactive_internal_model.load($kokaine_reactive_internal_model.pure_plane_depth);
   
  $kokaine_reactive_internal_model.store($kokaine_reactive_internal_model.pure_plane_depth, $std_core_types._int_add(previous,1));
   
  var walk = $kokaine_reactive_internal_model.enter_settle_walk();
  var _x85 = producer_0.producer_settling;
  var _x84 = $kokaine_reactive_internal_model.load(_x85);
  if (_x84) {
    var _x86 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic derived continuation");
    });
    if (_x86._tag === 1) {
      var _x83 = $kokaine_reactive_internal_model.Settle_failed(_x86.error);
    }
    else {
      var _x83 = $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x88 = producer_0.producer_clean;
    var _x87 = $std_core_types._int_eq(($kokaine_reactive_internal_model.load(_x88)),walk);
    if (_x87) {
       
      var _x89 = producer_0.producer_scope.scope_lifetime.lifetime_token;
      var scope_state_10121 = $kokaine_reactive_internal_model.load(_x89);
      if (scope_state_10121 === 2) {
        var _x83 = $kokaine_reactive_internal_model.Settle_ok;
      }
      else {
         
        var _x89 = producer_0.producer_settling;
        $kokaine_reactive_internal_model.store(_x89, true);
         
        var result = settle_producer_body(producer_0);
         
        var _x90 = producer_0.producer_settling;
        $kokaine_reactive_internal_model.store(_x90, false);
         
        if (result._tag === 1) {
          var _x91 = producer_0.producer_clean;
          $kokaine_reactive_internal_model.store(_x91, walk);
        }
        else {
          $std_core_types.Unit;
        }
        var _x83 = result;
      }
    }
    else {
       
      var _x89 = producer_0.producer_settling;
      $kokaine_reactive_internal_model.store(_x89, true);
       
      var result_0 = settle_producer_body(producer_0);
       
      var _x90 = producer_0.producer_settling;
      $kokaine_reactive_internal_model.store(_x90, false);
       
      if (result_0._tag === 1) {
        var _x91 = producer_0.producer_clean;
        $kokaine_reactive_internal_model.store(_x91, walk);
      }
      else {
        $std_core_types.Unit;
      }
      var _x83 = result_0;
    }
  }
  return $std_core_hnd.finally_prompt(function() {
       
      var x_10009 = $kokaine_reactive_internal_model.load($kokaine_reactive_internal_model.settle_walk_depth);
       
      $kokaine_reactive_internal_model.store($kokaine_reactive_internal_model.settle_walk_depth, $std_core_types._int_sub(x_10009,1));
      return $kokaine_reactive_internal_model.store($kokaine_reactive_internal_model.pure_plane_depth, previous);
    }, _x83);
}
 
export function settle_read_node(plane, current, gate, child) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<total>>) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x90 = gate.gate_state;
  var _x89 = $kokaine_reactive_internal_model.load(_x90);
  if (_x89 === 5) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x89 === 2) {
     
    if (gate.gate_input_producer === null) {
      var input = $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      var input = settle_producer_result(gate.gate_input_producer.value);
    }
    var _x92 = gate.gate_state;
    var _x91 = $kokaine_reactive_internal_model.load(_x92);
    if (_x91 === 5) {
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
  var _x94 = gate_1.gate_state;
  var _x93 = $kokaine_reactive_internal_model.load(_x94);
  if (_x93 === 5) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x93 === 2) {
     
    var nested = settle_trace_result(plane_1, $kokaine_reactive_internal_model.load(child_1));
    var _x96 = gate_1.gate_state;
    var _x95 = $kokaine_reactive_internal_model.load(_x96);
    if (_x95 === 5) {
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
  var _x98 = gate_2.gate_state;
  var _x97 = $kokaine_reactive_internal_model.load(_x98);
  if (_x97 === 3) {
    var _x100 = gate_2.gate_parent;
    var _x99 = pending_ancestor_loop(_x100);
    if (_x99) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      if (current_2 === null) {
        return settle_trace_result(plane_2, current_2);
      }
      else {
        var _x101 = resume_node(plane_2, current_2, current_2.trace_gate, current_2.trace_child, current_2.trace_frame, current_2.trace_resume);
        if (_x101._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x101.error);
        }
        else {
          return settle_trace_result(plane_2, current_2);
        }
      }
    }
  }
  else if (_x97 === 2) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x97 === 1) {
    var _x102 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a draft derivation");
    });
    if (_x102._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x102.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x97 === 4) {
    var _x103 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a running derivation");
    });
    if (_x103._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x103.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x104 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived continuation was retired");
    });
    if (_x104._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x104.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
}
 
export function validate_owner_gate_current(gate_3_0) /* (gate : kokaine/reactive/internal/model/continuation-gate) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x106 = gate_3_0.gate_state;
  var _x105 = $kokaine_reactive_internal_model.load(_x106);
  if (_x105 === 2) {
    if (gate_3_0.gate_input_producer === null) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      var _x107 = settle_producer_result(gate_3_0.gate_input_producer.value);
      if (_x107._tag === 2) {
        return $kokaine_reactive_internal_model.Settle_deferred;
      }
      else if (_x107._tag === 3) {
        return $kokaine_reactive_internal_model.Settle_failed(_x107.settle_exception);
      }
      else {
        var _x109 = gate_3_0.gate_state;
        var _x108 = $kokaine_reactive_internal_model.load(_x109);
        if (_x108 === 2) {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
        else if (_x108 === 3) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else if (_x108 === 4) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else {
          var _x110 = $kokaine_internal_compat.capture_error(function() {
            return $std_core_exn.$throw("derived owner changed while validating its input");
          });
          if (_x110._tag === 1) {
            return $kokaine_reactive_internal_model.Settle_failed(_x110.error);
          }
          else {
            return $kokaine_reactive_internal_model.Settle_ok;
          }
        }
      }
    }
  }
  else if (_x105 === 3) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x105 === 4) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x105 === 1) {
    var _x111 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation is draft");
    });
    if (_x111._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x111.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x112 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation was retired");
    });
    if (_x112._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x112.error);
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
    var _x114 = parent_0.value.gate_parent;
    var _x113 = validate_owner_gate(_x114);
    if (_x113._tag === 1) {
      return validate_owner_gate_current(parent_0.value);
    }
    else if (_x113._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      return $kokaine_reactive_internal_model.Settle_failed(_x113.settle_exception);
    }
  }
}
 
export function run_derive_work(plane, current) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/work<total>) -> div kokaine/reactive/internal/model/settle-result */  {
   
  var previous = $kokaine_reactive_internal_model.load($kokaine_reactive_internal_model.pure_plane_depth);
   
  $kokaine_reactive_internal_model.store($kokaine_reactive_internal_model.pure_plane_depth, $std_core_types._int_add(previous,1));
   
  if (current._tag === 1) {
    if (current.resume_trace === null) {
      var owner = $std_core_types.Nothing;
    }
    else {
      var owner = $kokaine_reactive_internal_model.load(current.resume_trace.trace_owner);
    }
  }
  else {
    var owner = $kokaine_reactive_internal_model.load(current.bootstrap_owner);
  }
  if (owner === null) {
    var _x116 = run_work_raw(plane, current);
    if (_x116._tag === 1) {
      var _x115 = $kokaine_reactive_internal_model.Settle_failed(_x116.error);
    }
    else {
      var _x115 = $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x115 = settle_producer_result(owner.value);
  }
  return $std_core_hnd.finally_prompt(function() {
      return $kokaine_reactive_internal_model.store($kokaine_reactive_internal_model.pure_plane_depth, previous);
    }, _x115);
}
 
export function run_next_derived_loop(plane, deferred) /* (plane : kokaine/reactive/internal/model/plane<total>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> div error<bool> */  { tailcall: while(1)
{
   
  var _x117 = plane.plane_queue;
  var next = take_queued_work_loop(_x117, $std_core_types.Nil);
  if (next === null) {
     
    restore_deferred(plane, deferred);
    return $std_core_types.Ok(false);
  }
  else {
    var _x117 = run_derive_work(plane, next.value);
    if (_x117._tag === 1) {
       
      var _x118 = work_stale(next.value);
      if (_x118) {
        $std_core_types.Unit;
      }
      else {
        var _x119 = plane.plane_queue;
        queue_global_work(_x119, next.value);
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.Ok(true);
    }
    else if (_x117._tag === 2) {
      {
        // tail call
        var _x118 = $std_core_types.Cons(next.value, deferred);
        deferred = _x118;
        continue tailcall;
      }
    }
    else {
       
      var _x119 = work_stale(next.value);
      if (_x119) {
        $std_core_types.Unit;
      }
      else {
        var _x120 = plane.plane_queue;
        queue_global_work(_x120, next.value);
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.$Error(_x117.settle_exception);
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
export function _mlift_settle_producer_10523(result) /* (result : kokaine/reactive/internal/model/settle-result) -> exn () */  {
  if (result._tag === 1) {
    return $std_core_types.Unit;
  }
  else if (result._tag === 2) {
    return $std_core_exn.$throw("derived value is waiting for its effect owner");
  }
  else {
     
    var ev_10588 = $std_core_hnd._evv_at(0);
    var _x119 = $std_core_exn.throw_exn_fs__select(ev_10588.hnd);
    return _x119(ev_10588.marker, ev_10588, result.settle_exception);
  }
}
 
 
// Synchronous memo reads can execute this capability without gaining the
// ambient effect row. It follows only the target scope's actual Trace-read
// producer capabilities and never drains unrelated pure or effect work.
export function settle_producer(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> exn () */  {
   
  var x_10591 = $std_core_hnd._open_none1(settle_producer_result, producer);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_settle_producer_10523);
  }
  else {
    if (x_10591._tag === 1) {
      return $std_core_types.Unit;
    }
    else if (x_10591._tag === 2) {
      return $std_core_exn.$throw("derived value is waiting for its effect owner");
    }
    else {
       
      var ev_10594 = $std_core_hnd._evv_at(0);
      var _x120 = $std_core_exn.throw_exn_fs__select(ev_10594.hnd);
      return _x120(ev_10594.marker, ev_10594, x_10591.settle_exception);
    }
  }
}
 
 
// monadic lift
export function _mlift_drain_loop_10524(first_failure, root, _y_x10266) /* forall<e> (first-failure : maybe<exception>, root : kokaine/reactive/internal/model/root<e>, error<bool>) -> <div|e> result<(),exception> */  {
  if (_y_x10266._tag === 1) {
    var _x121 = root.root_constructing;
    if ($kokaine_reactive_internal_model.load(_x121)){
      return $std_core_types.$Error(_y_x10266.error);
    }
  }
  if (_y_x10266._tag === 1) {
    if (first_failure === null) {
      var _x122 = $std_core_types.Just(_y_x10266.error);
    }
    else {
      var _x122 = first_failure;
    }
    return drain_loop(root, _x122);
  }
  if (_y_x10266._tag === 2 && _y_x10266.value) {
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
   
  var _x123 = root_0.root_derive_plane;
  var derivation = run_next_derived_loop(_x123, $std_core_types.Nil);
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
     
    var _x123 = root_0.root_effect_plane;
    var x_10597 = run_next_effect(_x123);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10266_0 /* error<bool> */ ) {
        return _mlift_drain_loop_10524(first_failure_0, root_0, _y_x10266_0);
      });
    }
    else {
      if (x_10597._tag === 1) {
        var _x123 = root_0.root_constructing;
        if ($kokaine_reactive_internal_model.load(_x123)){
          return $std_core_types.$Error(x_10597.error);
        }
      }
      if (x_10597._tag === 1) {
        {
          // tail call
          if (first_failure_0 === null) {
            var _x124 = $std_core_types.Just(x_10597.error);
          }
          else {
            var _x124 = first_failure_0;
          }
          first_failure_0 = _x124;
          continue tailcall;
        }
      }
      if (x_10597._tag === 2 && x_10597.value) {
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
export function _mlift_flush_10525(result) /* forall<e> (result : error<()>) -> <exn,div|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
}
 
 
// monadic lift
export function _mlift_flush_10526(root, _y_x10271) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, hnd/ev-index) -> <exn,div|e> () */  {
   
  var x_10600 = $std_core_hnd._mask_at(_y_x10271, false, function() {
      return $std_core_hnd.finally_prompt(function() {
          var _x125 = root.root_flushing;
          return $kokaine_reactive_internal_model.store(_x125, false);
        }, drain_loop(root, $std_core_types.Nothing));
    });
   
  function next_10601(result) /* (error<()>) -> <exn,div|5101> () */  {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10601);
  }
  else {
    return next_10601(x_10600);
  }
}
 
export function flush(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div,exn|e> () */  {
   
  var _x_x1_10485 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<5101> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x125 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_10485);
  if (_x125) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x_x1_1_10487 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<5101> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x126 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10487);
    if (_x126) {
      return $std_core_types.Unit;
    }
    else {
       
      var _x_x1_3_10489 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<5101> */ ) {
          return root_2.root_flushing;
        }, root);
      var _x127 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_3_10489);
      if (_x127) {
        return $std_core_types.Unit;
      }
      else {
         
        var _x_x1_5_10491 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<5101> */ ) {
            return root_3.root_batch_depth;
          }, root);
        var _x128 = $std_core_types._int_gt(($std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_5_10491)),0);
        if (_x128) {
          return $std_core_types.Unit;
        }
        else {
           
          var _x_x1_7_10493 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<5101> */ ) {
              return root_4.root_flushing;
            }, root);
           
          $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_7_10493, true);
           
          var x_10605 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10271 /* hnd/ev-index */ ) {
              return _mlift_flush_10526(root, _y_x10271);
            });
          }
          else {
             
            var x_0_10608 = $std_core_hnd._mask_at(x_10605, false, function() {
                return $std_core_hnd.finally_prompt(function() {
                    var _x129 = root.root_flushing;
                    return $kokaine_reactive_internal_model.store(_x129, false);
                  }, drain_loop(root, $std_core_types.Nothing));
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
                return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
              });
            }
            else {
              return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, x_0_10608);
            }
          }
        }
      }
    }
  }
}
 
export function check_root(root, key) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, key : kokaine/reactive/internal/model/root-key) -> exn () */  {
   
  var _x_x1_10497 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<5170> */ ) {
      return root_0.root_key;
    }, root);
  var _x129 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/model/root-key */ , right /* kokaine/reactive/internal/model/root-key */ ) {
      var _x130 = left;
      var _x131 = right;
      return Object.is(_x130,_x131);
    }, _x_x1_10497, key);
  if (_x129) {
     
    var _x_x1_2_10501 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<5170> */ ) {
        return root_1.root_disposed;
      }, root);
     
    var _x_x1_1_10500 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_2_10501);
    var _x132 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_1_10500);
    if (_x132) {
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
   
  var _x_x1_10503 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<5238> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x133 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_10503);
  if (_x133) {
    return $std_core_exn.$throw("reactive value created in a disposed root");
  }
  else {
     
    var _x_x1_1_10505 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<5238> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x134 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10505);
    if (_x134) {
      return $std_core_exn.$throw("reactive value created in a disposed root");
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_check_frame_registration_10527(current, wild__) /* forall<e> (current : kokaine/reactive/internal/model/frame<e>, wild_ : ()) -> exn () */  {
   
  var _x_x1_0_10508 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<5297> */ ) {
      return frame;
    }, current);
   
  var _x_x1_10507 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<5297> */ ) {
      return _this.lifetime_token;
    }, _x_x1_0_10508);
  var _x135 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_10507);
  if (_x135 === 1) {
    return $std_core_types.Unit;
  }
  else if (_x135 === 2) {
    return $std_core_types.Unit;
  }
  else {
    return $std_core_exn.$throw("reactive value created under a retired continuation branch");
  }
}
 
export function check_frame_registration(root, current) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, current : kokaine/reactive/internal/model/frame<e>) -> exn () */  {
   
  var x_10614 = check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_check_frame_registration_10527(current, wild__);
    });
  }
  else {
     
    var _x_x1_0_10508 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<5297> */ ) {
        return frame;
      }, current);
     
    var _x_x1_10507 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<5297> */ ) {
        return _this.lifetime_token;
      }, _x_x1_0_10508);
    var _x136 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_10507);
    if (_x136 === 1) {
      return $std_core_types.Unit;
    }
    else if (_x136 === 2) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("reactive value created under a retired continuation branch");
    }
  }
}
 
export function new_source(root, value, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, value : a, equals : (a, a) -> bool) -> kokaine/reactive/internal/model/source<a> */  {
  var _x137 = root.root_key;
  return $kokaine_reactive_internal_model.Source(_x137, $kokaine_reactive_internal_model.cell(value), equals, $kokaine_reactive_internal_model.cell(0), $kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0)));
}