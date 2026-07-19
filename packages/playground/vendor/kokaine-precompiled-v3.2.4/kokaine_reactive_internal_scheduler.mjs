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
 
// declarations
 
export function pack_capture(plane, current) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>) -> kokaine/reactive/internal/model/packed-capture */  {
  return function(consume /* forall<e> (kokaine/reactive/internal/model/plane<e>, kokaine/reactive/internal/model/trace<e>) -> 243 */ ) {
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
  return packed(function(plane /* kokaine/reactive/internal/model/plane<376> */ , current /* kokaine/reactive/internal/model/trace<376> */ ) {
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
  return $std_core_list.foreach($kokaine_internal_registry.registry_fs_snapshot(_x10), cut_capture);
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
export function _mlift_abandon_draft_frame_10412(_pat_5) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function abandon_draft_frame(current, drafts) /* forall<e> (current : kokaine/reactive/internal/model/frame<e>, drafts : list<kokaine/reactive/internal/model/trace<e>>) -> e () */  {
   
  var _x29 = current.lifetime_token;
  ((_x29).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x30 = current;
  var x_10437 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x30, drafts);
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
export function _mlift_resume_node_10413(draft_frame, drafts, _c_x10174) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, ()) -> () */  {
   
  var drafts_0_10544 = drafts.value;
   
  var _x29 = draft_frame.lifetime_token;
  ((_x29).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x30 = draft_frame;
  var x_10437 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x30, drafts_0_10544);
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
export function _mlift_resume_node_10414(failure, wild___2) /* forall<e> (failure : exception, wild_@2 : ()) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure);
}
 
 
// monadic lift
export function _mlift_resume_node_10415(draft_frame, drafts, failure, _c_x10182) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, failure : exception, ()) -> result<(),exception> */  {
   
  var drafts_0_10546 = drafts.value;
   
  var _x29 = draft_frame.lifetime_token;
  ((_x29).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x30 = draft_frame;
  var x_10437 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x30, drafts_0_10546);
   
  if ($std_core_hnd._yielding()) {
    var x_10441 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    var x_10441 = $std_core_types.Unit;
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
export function _mlift_resume_node_10416(failure_0, wild___7) /* forall<e> (failure@0 : exception, wild_@7 : ()) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure_0);
}
 
 
// monadic lift
export function _mlift_resume_node_10417(draft_frame, drafts, failure_0, _c_x10191) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, failure@0 : exception, ()) -> result<(),exception> */  {
   
  var drafts_0_10548 = drafts.value;
   
  var _x29 = draft_frame.lifetime_token;
  ((_x29).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x30 = draft_frame;
  var x_10437 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x30, drafts_0_10548);
   
  if ($std_core_hnd._yielding()) {
    var x_10445 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    var x_10445 = $std_core_types.Unit;
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
export function _mlift_resume_node_10418(wild___8) /* forall<e> (wild_@8 : ()) -> e result<(),exception> */  {
  return $std_core_types.Ok($std_core_types.Unit);
}
 
 
// monadic lift
export function _mlift_resume_node_10419(failure_1, wild___10) /* forall<e> (failure@1 : exception, wild_@10 : ()) -> e result<(),exception> */  {
  return $std_core_types.$Error(failure_1);
}
 
 
// monadic lift
export function _mlift_resume_node_10420(draft_frame, drafts, failure_1, _c_x10195) /* forall<_e,e1> (draft-frame : kokaine/reactive/internal/model/frame<e1>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e1>>>, failure@1 : exception, ()) -> result<(),exception> */  {
   
  var drafts_0_10550 = drafts.value;
   
  var _x29 = draft_frame.lifetime_token;
  ((_x29).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
   
  var _x30 = draft_frame;
  var x_10437 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x30, drafts_0_10550);
   
  if ($std_core_hnd._yielding()) {
    var x_10449 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    var x_10449 = $std_core_types.Unit;
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
export function _mlift_resume_node_10421(wild___11) /* forall<e> (wild_@11 : ()) -> e result<(),exception> */  {
  return $std_core_types.Ok($std_core_types.Unit);
}
 
 
// monadic lift
export function _mlift_resume_node_10422(_c_x10198) /* (()) -> result<(),exception> */  {
  return $std_core_types.Ok($std_core_types.Unit);
}
 
 
// monadic lift
export function _mlift_resume_node_10423(built, child, draft_frame, drafts, plane, state, publication) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, plane : kokaine/reactive/internal/model/plane<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, publication : error<()>) -> e2 result<(),exception> */  {
  if (publication._tag === 1) {
     
    var _x29 = state.value;
    if (_x29 === 4) {
      var x_10453 = ((state).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else {
      var x_10453 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10195 /* () */ ) {
        return _mlift_resume_node_10420(draft_frame, drafts, publication.error, _c_x10195);
      });
    }
    else {
      return _mlift_resume_node_10420(draft_frame, drafts, publication.error, x_10453);
    }
  }
  else {
    var _x29 = state.value;
    if (_x29 === 5) {
       
      var drafts_0_10552 = drafts.value;
       
      var _x30 = draft_frame.lifetime_token;
      ((_x30).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
       
      var _x31 = draft_frame;
      var x_10437 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x31, drafts_0_10552);
       
      if ($std_core_hnd._yielding()) {
        var x_0_10455 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
          return $std_core_types.Unit;
        });
      }
      else {
        var x_0_10455 = $std_core_types.Unit;
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
       
      var _x30 = built.built_root;
      ((child).value = _x30);
       
      var _x31 = built.built_root;
      activate_trace_loop(plane, _x31);
       
      var _x32 = draft_frame.lifetime_token;
      ((_x32).value = ($kokaine_reactive_internal_model.Scope_live));
       
      var _x33 = state.value;
      if (_x33 === 4) {
        var x_1_10458 = ((state).value = ($kokaine_reactive_internal_model.Capture_live));
      }
      else {
        var x_1_10458 = $std_core_types.Unit;
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_resume_node_10422);
      }
      else {
        return $std_core_types.Ok($std_core_types.Unit);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10424(built, child, draft_frame, drafts, plane, state, retired) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, plane : kokaine/reactive/internal/model/plane<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, retired : error<()>) -> e2 result<(),exception> */  {
  if (retired._tag === 1) {
     
    var _x30 = state.value;
    if (_x30 === 4) {
      var x_10460 = ((state).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else {
      var x_10460 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10191 /* () */ ) {
        return _mlift_resume_node_10417(draft_frame, drafts, retired.error, _c_x10191);
      });
    }
    else {
      return _mlift_resume_node_10417(draft_frame, drafts, retired.error, x_10460);
    }
  }
  else {
    var _x30 = state.value;
    if (_x30 === 5) {
       
      var drafts_0_10555 = drafts.value;
       
      var _x31 = draft_frame.lifetime_token;
      ((_x31).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
       
      var _x32 = draft_frame;
      var x_10437 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x32, drafts_0_10555);
       
      if ($std_core_hnd._yielding()) {
        var x_0_10462 = $std_core_hnd.yield_extend(function(_pat_5 /* error<()> */ ) {
          return $std_core_types.Unit;
        });
      }
      else {
        var x_0_10462 = $std_core_types.Unit;
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
       
      var x_1_10465 = built.built_publish();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(publication /* error<()> */ ) {
          return _mlift_resume_node_10423(built, child, draft_frame, drafts, plane, state, publication);
        });
      }
      else {
        return _mlift_resume_node_10423(built, child, draft_frame, drafts, plane, state, x_1_10465);
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10425(old_frame, _y_x10185) /* forall<e> (old-frame : kokaine/reactive/internal/model/frame<e>, kokaine/reactive/internal/model/retirement-work<e>) -> <div|e> list<kokaine/reactive/internal/model/retirement-work<e>> */  {
  return $kokaine_reactive_internal_lifetime.collect_retirement_loop($std_core_types.Cons(_y_x10185, $std_core_types.Cons($kokaine_reactive_internal_model.Retirement_step(function() {
          var _x31 = old_frame;
          return $kokaine_reactive_internal_lifetime.lifetime_retirement_expand(_x31);
        }), $std_core_types.Nil)), $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_resume_node_10426(built, child, draft_frame, drafts, old_frame, plane, state, retirement) /* forall<_e,_e1,e2> (built : kokaine/reactive/internal/model/built-trace<e2>, child : ref<global,kokaine/reactive/internal/model/trace<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, old-frame : kokaine/reactive/internal/model/frame<e2>, plane : kokaine/reactive/internal/model/plane<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, retirement : list<kokaine/reactive/internal/model/retirement-work<e2>>) -> e2 result<(),exception> */  {
   
  var x_10467 = $kokaine_internal_compat.capture_error(function() {
     
    var _x_x1_10392 = $std_core_hnd._open_none1(function(frame_1 /* kokaine/reactive/internal/model/frame<1957> */ ) {
        return frame_1;
      }, old_frame);
    return $kokaine_reactive_internal_lifetime.run_finalizers($std_core_hnd._open_none1(function(_this_2 /* kokaine/reactive/internal/model/lifetime-owner<1957> */ ) {
          return _this_2.lifetime_retirement;
        }, _x_x1_10392), retirement);
  });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(retired /* error<()> */ ) {
      return _mlift_resume_node_10424(built, child, draft_frame, drafts, plane, state, retired);
    });
  }
  else {
    return _mlift_resume_node_10424(built, child, draft_frame, drafts, plane, state, x_10467);
  }
}
 
 
// monadic lift
export function _mlift_resume_node_10427(completed, _c_x10203) /* forall<_e> (completed : ref<global,bool>, result<(),exception>) -> result<(),exception> */  {
   
  ((completed).value = true);
  return _c_x10203;
}
 
 
// monadic lift
export function _mlift_resume_node_10428(child, completed, current_frame_slot, draft_frame, drafts, old_frame, plane, state, attempt) /* forall<_e,_e1,e2> (child : ref<global,kokaine/reactive/internal/model/trace<e2>>, completed : ref<global,bool>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e2>>, draft-frame : kokaine/reactive/internal/model/frame<e2>, drafts : ref<global,list<kokaine/reactive/internal/model/trace<e2>>>, old-frame : kokaine/reactive/internal/model/frame<e2>, plane : kokaine/reactive/internal/model/plane<e2>, state : ref<global,kokaine/reactive/internal/model/capture-state>, attempt : error<kokaine/reactive/internal/model/built-trace<e2>>) -> e2 result<(),exception> */  {
   
  if (attempt._tag === 1) {
     
    var _x32 = state.value;
    if (_x32 === 4) {
      var x_0_10471 = ((state).value = ($kokaine_reactive_internal_model.Capture_pending));
    }
    else {
      var x_0_10471 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      var x_10469 = $std_core_hnd.yield_extend(function(_c_x10182 /* () */ ) {
        return _mlift_resume_node_10415(draft_frame, drafts, attempt.error, _c_x10182);
      });
    }
    else {
      var x_10469 = _mlift_resume_node_10415(draft_frame, drafts, attempt.error, x_0_10471);
    }
  }
  else {
     
    var old = child.value;
     
    ((child).value = ($kokaine_reactive_internal_model.Trace_end));
     
    var _x32 = old_frame.lifetime_token;
    ((_x32).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
     
    ((current_frame_slot).value = draft_frame);
     
    if ($std_core_hnd._yielding()) {
      var x_1_10473 = $std_core_hnd.yield_extend(function(_y_x10185 /* kokaine/reactive/internal/model/retirement-work<1957> */ ) {
        return _mlift_resume_node_10425(old_frame, _y_x10185);
      });
    }
    else {
      var x_1_10473 = _mlift_resume_node_10425(old_frame, $kokaine_reactive_internal_model.Retirement_step(function() {
          return $kokaine_reactive_internal_lifetime.trace_retirement_expand(old);
        }));
    }
    if ($std_core_hnd._yielding()) {
      var x_10469 = $std_core_hnd.yield_extend(function(retirement /* list<kokaine/reactive/internal/model/retirement-work<1957>> */ ) {
        return _mlift_resume_node_10426(attempt.value, child, draft_frame, drafts, old_frame, plane, state, retirement);
      });
    }
    else {
      var x_10469 = _mlift_resume_node_10426(attempt.value, child, draft_frame, drafts, old_frame, plane, state, x_1_10473);
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10203 /* result<(),exception> */ ) {
       
      ((completed).value = true);
      return _c_x10203;
    });
  }
  else {
     
    ((completed).value = true);
    return x_10469;
  }
}
 
export function resume_node(plane, current, gate, child, current_frame_slot, resume) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>, current : kokaine/reactive/internal/model/trace<e>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<e>>, current-frame-slot : ref<global,kokaine/reactive/internal/model/frame<e>>, resume : (kokaine/reactive/internal/model/frame<e>) -> <div,exn|e> kokaine/reactive/internal/model/built-trace<e>) -> <div|e> error<()> */  {
  var _x33 = gate.gate_state;
  var _x32 = _x33.value;
  if (_x32 === 3) {
     
    var _x34 = gate.gate_state;
    ((_x34).value = ($kokaine_reactive_internal_model.Capture_running));
     
    var old_frame = current_frame_slot.value;
     
    var _x35 = plane.plane_retirement;
    var draft_frame = $kokaine_reactive_internal_lifetime.new_lifetime_owner($kokaine_reactive_internal_model.Scope_starting, _x35);
     
    var drafts = { value: ($std_core_types.Nil) };
     
    var completed = { value: false };
     
    var x_0_10489 = $kokaine_reactive_internal_lifetime.attempt_build(plane, drafts, function() {
        return $kokaine_reactive_internal_lifetime.with_current(plane, current, draft_frame, function() {
            return resume(draft_frame);
          });
      });
     
    var next_0_10490 = function(attempt /* error<kokaine/reactive/internal/model/built-trace<1957>> */ ) {
      var _x36 = gate.gate_state;
      return _mlift_resume_node_10428(child, completed, current_frame_slot, draft_frame, drafts, old_frame, plane, _x36, attempt);
    };
    if ($std_core_hnd._yielding()) {
      var _x35 = $std_core_hnd.yield_extend(next_0_10490);
    }
    else {
      var _x35 = next_0_10490(x_0_10489);
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x34 = completed.value;
        if (_x34) {
          return $std_core_types.Unit;
        }
        else {
           
          var _x36 = gate.gate_state;
          var _x35 = _x36.value;
          if (_x35 === 4) {
            var _x37 = gate.gate_state;
            var x_10483 = ((_x37).value = ($kokaine_reactive_internal_model.Capture_pending));
          }
          else {
            var x_10483 = $std_core_types.Unit;
          }
           
          var next_10484 = function(_c_x10174 /* () */ ) {
             
            var drafts_0_10557 = drafts.value;
             
            var _x38 = draft_frame.lifetime_token;
            ((_x38).value = ($kokaine_reactive_internal_model.Scope_branch_dead));
             
            var _x39 = draft_frame;
            var x_10437 = $kokaine_reactive_internal_lifetime.try_retire_lifetime_drafts(_x39, drafts_0_10557);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_pat_5_0_0 /* error<()> */ ) {
                return $std_core_types.Unit;
              });
            }
            else {
              return $std_core_types.Unit;
            }
          };
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(next_10484);
          }
          else {
            return next_10484(x_10483);
          }
        }
      }, _x35);
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
export function _mlift_run_bootstrap_10429(_pat_3_3) /* forall<e> (error<()>) -> e () */  {
  return $std_core_types.Unit;
}
 
export function run_bootstrap(scope) /* forall<e> (scope : kokaine/reactive/internal/model/continuation-scope<e>) -> <div|e> error<()> */  {
  var _x37 = scope.scope_lifetime.lifetime_token;
  var _x36 = _x37.value;
  if (_x36 === 1) {
     
    var _x38 = scope.scope_bootstrap_slot;
    var pending = _x38.value;
     
    var _x39 = scope.scope_bootstrap_slot;
    ((_x39).value = ($std_core_types.Nothing));
    if (pending === null) {
      return $kokaine_internal_compat.capture_error(function() {
        return $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.$throw, "bootstrap slot was already consumed while scope is starting");
      });
    }
    else {
      return $std_core_hnd.finally_prompt(function() {
          var _x39 = scope.scope_lifetime.lifetime_token;
          var _x38 = _x39.value;
          if (_x38 === 1) {
             
            var x_10494 = $kokaine_internal_compat.capture_error(function() {
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
   
  var values_10068 = $std_core_list.reverse_acc($std_core_types.Nil, deferred);
  var _x40 = plane.plane_queue;
  return $kokaine_reactive_internal_work_dash_transaction.append_values_loop(_x40, values_10068);
}
 
 
// monadic lift
export function _mlift_run_next_effect_10430(_y_x10223) /* forall<e> (error<()>) -> <div|e> result<bool,exception> */  {
  if (_y_x10223._tag === 1) {
    return $std_core_types.$Error(_y_x10223.error);
  }
  else {
    return $std_core_types.Ok(true);
  }
}
 
export function run_next_effect(plane) /* forall<e> (plane : kokaine/reactive/internal/model/plane<e>) -> <div|e> error<bool> */  {
   
  var _x41 = plane.plane_queue;
  var next = take_queued_work_loop(_x41, $std_core_types.Nil);
  if (next === null) {
    return $std_core_types.Ok(false);
  }
  else {
     
    var _x41 = plane.plane_queue;
    $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x41, next.value);
     
    var x_10497 = run_work_raw(plane, next.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10223 /* error<()> */ ) {
        if (_y_x10223._tag === 1) {
          return $std_core_types.$Error(_y_x10223.error);
        }
        else {
          return $std_core_types.Ok(true);
        }
      });
    }
    else {
      if (x_10497._tag === 1) {
        return $std_core_types.$Error(x_10497.error);
      }
      else {
        return $std_core_types.Ok(true);
      }
    }
  }
}
 
export function settle_failure(message) /* (message : string) -> kokaine/reactive/internal/model/settle-result */  {
  var _x41 = $kokaine_internal_compat.capture_error(function() {
    return $std_core_exn.$throw(message);
  });
  if (_x41._tag === 1) {
    return $kokaine_reactive_internal_model.Settle_failed(_x41.error);
  }
  else {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
}
 
export function settle_producer_body(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> div kokaine/reactive/internal/model/settle-result */  { tailcall: while(1)
{
  var _x43 = producer.producer_scope.scope_lifetime.lifetime_token;
  var _x42 = _x43.value;
  if (_x42 === 3) {
    var _x44 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired branch");
    });
    if (_x44._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x44.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x42 === 4) {
    var _x45 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived value belongs to a retired scope");
    });
    if (_x45._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x45.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x47 = producer.producer_scope.scope_parent;
    var _x46 = validate_owner_gate(_x47);
    if (_x46._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else if (_x46._tag === 3) {
      return $kokaine_reactive_internal_model.Settle_failed(_x46.settle_exception);
    }
    else {
      var _x49 = producer.producer_scope.scope_lifetime.lifetime_token;
      var _x48 = _x49.value;
      if (_x48 === 1) {
        var _x51 = producer.producer_scope;
        var _x50 = run_bootstrap(_x51);
        if (_x50._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x50.error);
        }
        else {
          {
            // tail call
            continue tailcall;
          }
        }
      }
      else if (_x48 === 2) {
        var _x52 = producer.producer_plane;
        var _x53 = producer.producer_scope.scope_body;
        return settle_trace_result(_x52, _x53.value);
      }
      else if (_x48 === 3) {
        var _x54 = $kokaine_internal_compat.capture_error(function() {
          return $std_core_exn.$throw("derived value belongs to a retired branch");
        });
        if (_x54._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x54.error);
        }
        else {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
      }
      else {
        var _x55 = $kokaine_internal_compat.capture_error(function() {
          return $std_core_exn.$throw("derived value belongs to a retired scope");
        });
        if (_x55._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x55.error);
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
  var _x58 = producer_0.producer_settling;
  var _x57 = _x58.value;
  if (_x57) {
    var _x59 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic derived continuation");
    });
    if (_x59._tag === 1) {
      var _x56 = $kokaine_reactive_internal_model.Settle_failed(_x59.error);
    }
    else {
      var _x56 = $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
     
    var _x60 = producer_0.producer_settling;
    ((_x60).value = true);
     
    var result = settle_producer_body(producer_0);
     
    var _x61 = producer_0.producer_settling;
    ((_x61).value = false);
    var _x56 = result;
  }
  return $std_core_hnd.finally_prompt(function() {
      return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
    }, _x56);
}
 
export function settle_read_node(plane, current, gate, child) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/trace<total>, gate : kokaine/reactive/internal/model/continuation-gate, child : ref<global,kokaine/reactive/internal/model/trace<total>>) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x61 = gate.gate_state;
  var _x60 = _x61.value;
  if (_x60 === 5) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x60 === 2) {
     
    if (gate.gate_input_producer === null) {
      var input = $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      var input = settle_producer_result(gate.gate_input_producer.value);
    }
    var _x63 = gate.gate_state;
    var _x62 = _x63.value;
    if (_x62 === 5) {
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
  var _x65 = gate_1.gate_state;
  var _x64 = _x65.value;
  if (_x64 === 5) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x64 === 2) {
     
    var nested = settle_trace_result(plane_1, child_1.value);
    var _x67 = gate_1.gate_state;
    var _x66 = _x67.value;
    if (_x66 === 5) {
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
  var _x69 = gate_2.gate_state;
  var _x68 = _x69.value;
  if (_x68 === 3) {
    var _x71 = gate_2.gate_parent;
    var _x70 = pending_ancestor_loop(_x71);
    if (_x70) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      if (current_2 === null) {
        return settle_trace_result(plane_2, current_2);
      }
      else {
        var _x72 = resume_node(plane_2, current_2, current_2.trace_gate, current_2.trace_child, current_2.trace_frame, current_2.trace_resume);
        if (_x72._tag === 1) {
          return $kokaine_reactive_internal_model.Settle_failed(_x72.error);
        }
        else {
          return settle_trace_result(plane_2, current_2);
        }
      }
    }
  }
  else if (_x68 === 2) {
    return $kokaine_reactive_internal_model.Settle_ok;
  }
  else if (_x68 === 1) {
    var _x73 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a draft derivation");
    });
    if (_x73._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x73.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else if (_x68 === 4) {
    var _x74 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("cyclic read of a running derivation");
    });
    if (_x74._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x74.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x75 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived continuation was retired");
    });
    if (_x75._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x75.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
}
 
export function validate_owner_gate_current(gate_3_0) /* (gate : kokaine/reactive/internal/model/continuation-gate) -> div kokaine/reactive/internal/model/settle-result */  {
  var _x77 = gate_3_0.gate_state;
  var _x76 = _x77.value;
  if (_x76 === 2) {
    if (gate_3_0.gate_input_producer === null) {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
    else {
      var _x78 = settle_producer_result(gate_3_0.gate_input_producer.value);
      if (_x78._tag === 2) {
        return $kokaine_reactive_internal_model.Settle_deferred;
      }
      else if (_x78._tag === 3) {
        return $kokaine_reactive_internal_model.Settle_failed(_x78.settle_exception);
      }
      else {
        var _x80 = gate_3_0.gate_state;
        var _x79 = _x80.value;
        if (_x79 === 2) {
          return $kokaine_reactive_internal_model.Settle_ok;
        }
        else if (_x79 === 3) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else if (_x79 === 4) {
          return $kokaine_reactive_internal_model.Settle_deferred;
        }
        else {
          var _x81 = $kokaine_internal_compat.capture_error(function() {
            return $std_core_exn.$throw("derived owner changed while validating its input");
          });
          if (_x81._tag === 1) {
            return $kokaine_reactive_internal_model.Settle_failed(_x81.error);
          }
          else {
            return $kokaine_reactive_internal_model.Settle_ok;
          }
        }
      }
    }
  }
  else if (_x76 === 3) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x76 === 4) {
    return $kokaine_reactive_internal_model.Settle_deferred;
  }
  else if (_x76 === 1) {
    var _x82 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation is draft");
    });
    if (_x82._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x82.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    var _x83 = $kokaine_internal_compat.capture_error(function() {
      return $std_core_exn.$throw("derived owner continuation was retired");
    });
    if (_x83._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x83.error);
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
    var _x85 = parent_0.value.gate_parent;
    var _x84 = validate_owner_gate(_x85);
    if (_x84._tag === 1) {
      return validate_owner_gate_current(parent_0.value);
    }
    else if (_x84._tag === 2) {
      return $kokaine_reactive_internal_model.Settle_deferred;
    }
    else {
      return $kokaine_reactive_internal_model.Settle_failed(_x84.settle_exception);
    }
  }
}
 
 
// monadic lift
export function _mlift_run_derive_work_10431(current, plane, _c_x10252) /* (current : kokaine/reactive/internal/model/work<total>, plane : kokaine/reactive/internal/model/plane<total>, maybe<kokaine/reactive/internal/model/derive-producer>) -> kokaine/reactive/internal/model/settle-result */  {
  if (_c_x10252 === null) {
    var _x86 = run_work_raw(plane, current);
    if (_x86._tag === 1) {
      return $kokaine_reactive_internal_model.Settle_failed(_x86.error);
    }
    else {
      return $kokaine_reactive_internal_model.Settle_ok;
    }
  }
  else {
    return settle_producer_result(_c_x10252.value);
  }
}
 
export function run_derive_work(plane, current) /* (plane : kokaine/reactive/internal/model/plane<total>, current : kokaine/reactive/internal/model/work<total>) -> div kokaine/reactive/internal/model/settle-result */  {
   
  var previous_phase = $kokaine_reactive_internal_model.enter_pure_plane();
   
  if (current._tag === 1) {
    if (current.resume_trace === null) {
      var x_10505 = $std_core_types.Nothing;
    }
    else {
      var x_10505 = (current.resume_trace.trace_owner).value;
    }
  }
  else {
    var x_10505 = (current.bootstrap_owner).value;
  }
  if ($std_core_hnd._yielding()) {
    var _x87 = $std_core_hnd.yield_extend(function(_c_x10252 /* maybe<kokaine/reactive/internal/model/derive-producer> */ ) {
      return _mlift_run_derive_work_10431(current, plane, _c_x10252);
    });
  }
  else {
    var _x87 = _mlift_run_derive_work_10431(current, plane, x_10505);
  }
  return $std_core_hnd.finally_prompt(function() {
      return ((($kokaine_reactive_internal_model.pure_plane_depth)).value = previous_phase);
    }, _x87);
}
 
export function run_next_derived_loop(plane, deferred) /* (plane : kokaine/reactive/internal/model/plane<total>, deferred : list<kokaine/reactive/internal/model/work<total>>) -> div error<bool> */  { tailcall: while(1)
{
   
  var _x88 = plane.plane_queue;
  var next = take_queued_work_loop(_x88, $std_core_types.Nil);
  if (next === null) {
     
    restore_deferred(plane, deferred);
    return $std_core_types.Ok(false);
  }
  else {
    var _x88 = run_derive_work(plane, next.value);
    if (_x88._tag === 1) {
       
      var _x89 = work_stale(next.value);
      if (_x89) {
        $std_core_types.Unit;
      }
      else {
        if (next.value._tag === 2) {
          var _x90 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x90, next.value);
        }
        else {
          var _x91 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x91, next.value);
        }
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.Ok(true);
    }
    else if (_x88._tag === 2) {
      {
        // tail call
        var _x89 = $std_core_types.Cons(next.value, deferred);
        deferred = _x89;
        continue tailcall;
      }
    }
    else {
       
      var _x90 = work_stale(next.value);
      if (_x90) {
        $std_core_types.Unit;
      }
      else {
        if (next.value._tag === 2) {
          var _x91 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_append(_x91, next.value);
        }
        else {
          var _x92 = plane.plane_queue;
          $kokaine_reactive_internal_work_dash_transaction.work_queue_fs_prepend(_x92, next.value);
        }
      }
       
      restore_deferred(plane, deferred);
      return $std_core_types.$Error(_x88.settle_exception);
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
export function _mlift_settle_producer_10432(result) /* (result : kokaine/reactive/internal/model/settle-result) -> exn () */  {
  if (result._tag === 1) {
    return $std_core_types.Unit;
  }
  else if (result._tag === 2) {
    return $std_core_exn.$throw("derived value is waiting for its effect owner");
  }
  else {
     
    var ev_10507 = $std_core_hnd._evv_at(0);
    var _x90 = $std_core_exn.throw_exn_fs__select(ev_10507.hnd);
    return _x90(ev_10507.marker, ev_10507, result.settle_exception);
  }
}
 
 
// Synchronous memo reads can execute this capability without gaining the
// ambient effect row. It follows only the target scope's actual Trace-read
// producer capabilities and never drains unrelated pure or effect work.
export function settle_producer(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> exn () */  {
   
  var x_10510 = $std_core_hnd._open_none1(settle_producer_result, producer);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_settle_producer_10432);
  }
  else {
    if (x_10510._tag === 1) {
      return $std_core_types.Unit;
    }
    else if (x_10510._tag === 2) {
      return $std_core_exn.$throw("derived value is waiting for its effect owner");
    }
    else {
       
      var ev_10513 = $std_core_hnd._evv_at(0);
      var _x91 = $std_core_exn.throw_exn_fs__select(ev_10513.hnd);
      return _x91(ev_10513.marker, ev_10513, x_10510.settle_exception);
    }
  }
}
 
 
// monadic lift
export function _mlift_drain_loop_10433(root, _y_x10258) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, error<bool>) -> <div|e> result<(),exception> */  {
  if (_y_x10258._tag === 1) {
    return $std_core_types.$Error(_y_x10258.error);
  }
  else if (_y_x10258._tag === 2 && _y_x10258.value) {
    return drain_loop(root);
  }
  else {
    return $std_core_types.Ok($std_core_types.Unit);
  }
}
 
export function drain_loop(root_0) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div|e> error<()> */  { tailcall: while(1)
{
   
  var _x92 = root_0.root_derive_plane;
  var derivation = run_next_derived_loop(_x92, $std_core_types.Nil);
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
     
    var _x92 = root_0.root_effect_plane;
    var x_10516 = run_next_effect(_x92);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10258_0 /* error<bool> */ ) {
        return _mlift_drain_loop_10433(root_0, _y_x10258_0);
      });
    }
    else {
      if (x_10516._tag === 1) {
        return $std_core_types.$Error(x_10516.error);
      }
      else if (x_10516._tag === 2 && x_10516.value) {
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
export function _mlift_flush_10434(result) /* forall<e> (result : error<()>) -> <exn,div|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
}
 
 
// monadic lift
export function _mlift_flush_10435(root, _y_x10262) /* forall<_e,e1> (root : kokaine/reactive/internal/model/root<e1>, hnd/ev-index) -> <exn,div|e1> () */  {
   
  var x_10519 = $std_core_hnd._mask_at(_y_x10262, false, function() {
      return $std_core_hnd.finally_prompt(function() {
          var _x92 = root.root_flushing;
          return ((_x92).value = false);
        }, drain_loop(root));
    });
   
  function next_10520(result) /* (error<()>) -> <exn,div|3705> () */  {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10520);
  }
  else {
    return next_10520(x_10519);
  }
}
 
export function flush(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <div,exn|e> () */  {
   
  var value_10365 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3705> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x92 = value_10365.value;
  if (_x92) {
    return $std_core_types.Unit;
  }
  else {
     
    var value_0_10367 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3705> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x93 = value_0_10367.value;
    if (_x93) {
      return $std_core_types.Unit;
    }
    else {
       
      var value_1_10369 = $std_core_hnd._open_none1(function(root_2 /* kokaine/reactive/internal/model/root<3705> */ ) {
          return root_2.root_flushing;
        }, root);
      var _x94 = value_1_10369.value;
      if (_x94) {
        return $std_core_types.Unit;
      }
      else {
         
        var value_2_10371 = $std_core_hnd._open_none1(function(root_3 /* kokaine/reactive/internal/model/root<3705> */ ) {
            return root_3.root_batch_depth;
          }, root);
        var _x95 = $std_core_types._int_gt((value_2_10371.value),0);
        if (_x95) {
          return $std_core_types.Unit;
        }
        else {
           
          var target_10373 = $std_core_hnd._open_none1(function(root_4 /* kokaine/reactive/internal/model/root<3705> */ ) {
              return root_4.root_flushing;
            }, root);
           
          ((target_10373).value = true);
           
          var x_10524 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10262 /* hnd/ev-index */ ) {
              return _mlift_flush_10435(root, _y_x10262);
            });
          }
          else {
             
            var x_0_10527 = $std_core_hnd._mask_at(x_10524, false, function() {
                return $std_core_hnd.finally_prompt(function() {
                    var _x96 = root.root_flushing;
                    return ((_x96).value = false);
                  }, drain_loop(root));
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(result /* error<()> */ ) {
                return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, result);
              });
            }
            else {
              return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_exn.untry, x_0_10527);
            }
          }
        }
      }
    }
  }
}
 
export function check_root(root, key) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, key : kokaine/reactive/internal/model/root-key) -> exn () */  {
   
  var _x_x1_10403 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3774> */ ) {
      return root_0.root_key;
    }, root);
  var _x96 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/internal/model/root-key */ , right /* kokaine/reactive/internal/model/root-key */ ) {
      var _x97 = left;
      var _x98 = right;
      return Object.is(_x97,_x98);
    }, _x_x1_10403, key);
  if (_x96) {
     
    var value_10383 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3774> */ ) {
        return root_1.root_disposed;
      }, root);
     
    var _x_x1_1_10407 = value_10383.value;
    var _x99 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_1_10407);
    if (_x99) {
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
   
  var value_10385 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<3842> */ ) {
      return root_0.root_disposed;
    }, root);
  var _x100 = value_10385.value;
  if (_x100) {
    return $std_core_exn.$throw("reactive value created in a disposed root");
  }
  else {
     
    var value_0_10387 = $std_core_hnd._open_none1(function(root_1 /* kokaine/reactive/internal/model/root<3842> */ ) {
        return root_1.root_disposing;
      }, root);
    var _x101 = value_0_10387.value;
    if (_x101) {
      return $std_core_exn.$throw("reactive value created in a disposed root");
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_check_frame_registration_10436(current, wild__) /* forall<_e,e1> (current : kokaine/reactive/internal/model/frame<e1>, wild_ : ()) -> exn () */  {
   
  var _x_x1_10410 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3901> */ ) {
      return frame;
    }, current);
   
  var value_10389 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<3901> */ ) {
      return _this.lifetime_token;
    }, _x_x1_10410);
  var _x102 = value_10389.value;
  if (_x102 === 1) {
    return $std_core_types.Unit;
  }
  else if (_x102 === 2) {
    return $std_core_types.Unit;
  }
  else {
    return $std_core_exn.$throw("reactive value created under a retired continuation branch");
  }
}
 
export function check_frame_registration(root, current) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, current : kokaine/reactive/internal/model/frame<e>) -> exn () */  {
   
  var x_10533 = check_registration(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_check_frame_registration_10436(current, wild__);
    });
  }
  else {
     
    var _x_x1_10410 = $std_core_hnd._open_none1(function(frame /* kokaine/reactive/internal/model/frame<3901> */ ) {
        return frame;
      }, current);
     
    var value_10389 = $std_core_hnd._open_none1(function(_this /* kokaine/reactive/internal/model/lifetime-owner<3901> */ ) {
        return _this.lifetime_token;
      }, _x_x1_10410);
    var _x103 = value_10389.value;
    if (_x103 === 1) {
      return $std_core_types.Unit;
    }
    else if (_x103 === 2) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("reactive value created under a retired continuation branch");
    }
  }
}
 
export function new_source(root, value, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, value : a, equals : (a, a) -> bool) -> kokaine/reactive/internal/model/source<a> */  {
  var _x104 = root.root_key;
  return $kokaine_reactive_internal_model.Source(_x104, { value: value }, equals, { value: 0 }, $kokaine_internal_registry.new_registry());
}