// Koka generated module: kokaine/reactive/internal/model, koka version: 3.2.4
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
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_reactive_internal_resource from './kokaine_reactive_internal_resource.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
 
// externals
 
// type declarations
// type capture-state
export const Capture_draft = 1; // capture-state
export const Capture_live = 2; // capture-state
export const Capture_pending = 3; // capture-state
export const Capture_running = 4; // capture-state
export const Capture_dead = 5; // capture-state
// type retirement-coordinator
export function Retirement_coordinator(retirement_depth, retirement_disposal_requested, retirement_dispose_root) /* forall<e> (retirement-depth : ref<global,int>, retirement-disposal-requested : ref<global,bool>, retirement-dispose-root : ref<global,maybe<() -> <div,exn|e> ()>>) -> retirement-coordinator<e> */  {
  return { retirement_depth: retirement_depth, retirement_disposal_requested: retirement_disposal_requested, retirement_dispose_root: retirement_dispose_root };
}
// type retirement-work
export function Retirement_step(retirement_expand) /* forall<e> (retirement-expand : () -> div list<retirement-work<e>>) -> retirement-work<e> */  {
  return { _tag: 1, retirement_expand: retirement_expand };
}
export function Retirement_finalizer(retirement_action) /* forall<e> (retirement-action : () -> <div,exn|e> ()) -> retirement-work<e> */  {
  return { _tag: 2, retirement_action: retirement_action };
}
// type scope-state
export const Scope_starting = 1; // scope-state
export const Scope_live = 2; // scope-state
export const Scope_branch_dead = 3; // scope-state
export const Scope_dead = 4; // scope-state
// type lifetime-owner
export function Lifetime_owner(lifetime_token, lifetime_children, lifetime_finalizers, lifetime_retirement) /* forall<e> (lifetime-token : ref<global,scope-state>, lifetime-children : kokaine/internal/registry/registry<retirement-work<e>>, lifetime-finalizers : kokaine/internal/registry/registry<retirement-work<e>>, lifetime-retirement : retirement-coordinator<e>) -> lifetime-owner<e> */  {
  return { lifetime_token: lifetime_token, lifetime_children: lifetime_children, lifetime_finalizers: lifetime_finalizers, lifetime_retirement: lifetime_retirement };
}
// type frame
export function Frame(frame_lifetime) /* forall<e> (frame-lifetime : lifetime-owner<e>) -> frame<e> */  {
  return frame_lifetime;
}
// type built-trace
export function Built_trace(built_root, built_publish) /* forall<e> (built-root : trace<e>, built-publish : () -> <div|e> error<()>) -> built-trace<e> */  {
  return { built_root: built_root, built_publish: built_publish };
}
// type trace
export const Trace_end = null; // forall<e> trace<e>
export function Trace_read(trace_gate, trace_owner, trace_child, trace_frame, trace_resume, trace_finalize, trace_unlink, trace_stale) /* forall<e> (trace-gate : continuation-gate, trace-owner : ref<global,maybe<derive-producer>>, trace-child : ref<global,trace<e>>, trace-frame : ref<global,frame<e>>, trace-resume : (frame<e>) -> <div,exn|e> built-trace<e>, trace-finalize : () -> <div,exn|e> (), trace-unlink : () -> (), trace-stale : () -> bool) -> trace<e> */  {
  return { trace_gate: trace_gate, trace_owner: trace_owner, trace_child: trace_child, trace_frame: trace_frame, trace_resume: trace_resume, trace_finalize: trace_finalize, trace_unlink: trace_unlink, trace_stale: trace_stale };
}
// type continuation-scope
export function Scope(scope_lifetime, scope_body, scope_parent, scope_bootstrap_slot, scope_unlink) /* forall<e> (scope-lifetime : lifetime-owner<e>, scope-body : ref<global,trace<e>>, scope-parent : maybe<continuation-gate>, scope-bootstrap-slot : ref<global,maybe<() -> <div|e> error<()>>>, scope-unlink : ref<global,maybe<() -> bool>>) -> continuation-scope<e> */  {
  return { scope_lifetime: scope_lifetime, scope_body: scope_body, scope_parent: scope_parent, scope_bootstrap_slot: scope_bootstrap_slot, scope_unlink: scope_unlink };
}
// type derive-producer
export function Derive_producer(producer_plane, producer_scope, producer_settling) /* (producer-plane : plane<total>, producer-scope : continuation-scope<total>, producer-settling : ref<global,bool>) -> derive-producer */  {
  return { producer_plane: producer_plane, producer_scope: producer_scope, producer_settling: producer_settling };
}
// type continuation-gate
export function Continuation_gate(gate_state, gate_parent, gate_input_producer) /* (gate-state : ref<global,capture-state>, gate-parent : maybe<continuation-gate>, gate-input-producer : maybe<derive-producer>) -> continuation-gate */  {
  return { gate_state: gate_state, gate_parent: gate_parent, gate_input_producer: gate_input_producer };
}
// type plane
export function Plane(plane_queue, plane_work_group, plane_current, plane_current_frame, plane_draft, plane_retirement) /* forall<e> (plane-queue : kokaine/reactive/internal/work-transaction/work-queue<work<e>>, plane-work-group : ref<global,maybe<kokaine/reactive/internal/work-transaction/work-group<work<e>>>>, plane-current : ref<global,maybe<continuation-gate>>, plane-current-frame : ref<global,frame<e>>, plane-draft : ref<global,maybe<ref<global,list<trace<e>>>>>, plane-retirement : retirement-coordinator<e>) -> plane<e> */  {
  return { plane_queue: plane_queue, plane_work_group: plane_work_group, plane_current: plane_current, plane_current_frame: plane_current_frame, plane_draft: plane_draft, plane_retirement: plane_retirement };
}
// type work
export function Resume_work(resume_trace) /* forall<e> (resume-trace : trace<e>) -> work<e> */  {
  return { _tag: 1, resume_trace: resume_trace };
}
export function Bootstrap_work(bootstrap_scope, bootstrap_owner) /* forall<e> (bootstrap-scope : continuation-scope<e>, bootstrap-owner : ref<global,maybe<derive-producer>>) -> work<e> */  {
  return { _tag: 2, bootstrap_scope: bootstrap_scope, bootstrap_owner: bootstrap_owner };
}
// type cleanup-registration
export function Cleanup_registration(cleanup_node, cleanup_resource) /* forall<e> (cleanup-node : kokaine/internal/registry/registry-registration<retirement-work<e>>, cleanup-resource : kokaine/reactive/internal/resource/resource-k<e>) -> cleanup-registration<e> */  {
  return { cleanup_node: cleanup_node, cleanup_resource: cleanup_resource };
}
// type packed-capture
export function Packed_capture(run_packed) /* (run-packed : forall<a> (forall<e> (plane<e>, trace<e>) -> a) -> a) -> packed-capture */  {
  return run_packed;
}
// type root-key
export function Root_key(identity) /* (identity : ref<global,bool>) -> root-key */  {
  return identity;
}
// type source
export function Source(source_root, source_cell, source_equals, source_version, source_captures) /* forall<a> (source-root : root-key, source-cell : ref<global,a>, source-equals : (a, a) -> bool, source-version : ref<global,int>, source-captures : kokaine/internal/registry/registry<packed-capture>) -> source<a> */  {
  return { source_root: source_root, source_cell: source_cell, source_equals: source_equals, source_version: source_version, source_captures: source_captures };
}
// type memo
export function Memo(memo_source, memo_producer) /* forall<a> (memo-source : source<a>, memo-producer : derive-producer) -> memo<a> */  {
  return { memo_source: memo_source, memo_producer: memo_producer };
}
// type read-mode
export const Track_read = 1; // read-mode
export const Sample_read = 2; // read-mode
// type root
export function Root(root_key, root_derive_plane, root_effect_plane, root_lifetime, root_batch_depth, root_flushing, root_disposing, root_disposed) /* forall<e> (root-key : root-key, root-derive-plane : plane<total>, root-effect-plane : plane<e>, root-lifetime : lifetime-owner<e>, root-batch-depth : ref<global,int>, root-flushing : ref<global,bool>, root-disposing : ref<global,bool>, root-disposed : ref<global,bool>) -> root<e> */  {
  return { root_key: root_key, root_derive_plane: root_derive_plane, root_effect_plane: root_effect_plane, root_lifetime: root_lifetime, root_batch_depth: root_batch_depth, root_flushing: root_flushing, root_disposing: root_disposing, root_disposed: root_disposed };
}
// type settle-result
export const Settle_ok = { _tag: 1 }; // settle-result
export const Settle_deferred = { _tag: 2 }; // settle-result
export function Settle_failed(settle_exception) /* (settle-exception : exception) -> settle-result */  {
  return { _tag: 3, settle_exception: settle_exception };
}
// type signal
export function Signal(signal_source) /* forall<a> (signal-source : source<a>) -> signal<a> */  {
  return signal_source;
}
 
// declarations
 
export function cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
 
// A derivation is dynamically read-only even when application code hides a
// reactive operation behind a locally handled public wrapper. This marker is
// runtime-wide on purpose: a calculator running for root A must not mutate or
// register work in root B either. The runtime is synchronous; nesting is still
// represented explicitly so targeted producer settlement is safe.
export var pure_plane_depth;
var pure_plane_depth = { value: 0 };
 
export function enter_pure_plane() /* () -> int */  {
   
  var previous = pure_plane_depth.value;
   
  var value_0_10008 = $std_core_types._int_add(previous,1);
   
  ((pure_plane_depth).value = value_0_10008);
  return previous;
}
 
export function restore_pure_plane(previous) /* (previous : int) -> () */  {
  return ((pure_plane_depth).value = previous);
}
 
export function check_not_pure_plane(operation) /* (operation : string) -> exn () */  {
  var _x0 = $std_core_types._int_le((pure_plane_depth.value),0);
  if (_x0) {
    return $std_core_types.Unit;
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_(operation, " is forbidden while a pure derivation is running"));
  }
}
 
export function lift_div(action) /* forall<a,e> (action : () -> e a) -> <div|e> a */  {
  return action();
}
 
 
// monadic lift
export function _mlift_lift_exn_10073(action, _y_x10067) /* forall<a,e> (action : () -> e a, hnd/ev-index) -> <exn|e> a */  {
  return $std_core_hnd._mask_at(_y_x10067, false, action);
}
 
export function lift_exn(action) /* forall<a,e> (action : () -> e a) -> <exn|e> a */  {
   
  var x_10076 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10067 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10067, false, action);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_10076, false, action);
  }
}
 
 
// Automatically generated. Retrieves the `identity` constructor field of the `:root-key` type.
export function root_key_fs_identity(_this) /* (root-key) -> ref<global,bool> */  {
  return _this;
}
 
export function root_key_fs__copy(_this, identity) /* (root-key, identity : ? (ref<global,bool>)) -> root-key */  {
  if (identity !== undefined) {
    var _x1 = identity;
  }
  else {
    var _x1 = _this;
  }
  return _x1;
}
 
export function same_root(left, right) /* (left : root-key, right : root-key) -> bool */  {
  var _x2 = left;
  var _x3 = right;
  return Object.is(_x2,_x3);
}
 
 
// Automatically generated. Retrieves the `run-packed` constructor field of the `:packed-capture` type.
export function packed_capture_fs_run_packed(_this) /* forall<a> (packed-capture) -> ((forall<e> (plane<e>, trace<e>) -> a) -> a) */  {
  return _this;
}
 
export function packed_capture_fs__copy(_this, run_packed) /* (packed-capture, run-packed : ? (forall<a> (forall<e> (plane<e>, trace<e>) -> a) -> a)) -> packed-capture */  {
  if (run_packed !== undefined) {
    var _x4 = run_packed;
  }
  else {
    var _x5 = _this;
    var _x4 = _x5;
  }
  return _x4;
}
 
 
// Automatically generated. Retrieves the `source-root` constructor field of the `:source` type.
export function source_fs_source_root(source) /* forall<a> (source : source<a>) -> root-key */  {
  return source.source_root;
}
 
 
// Automatically generated. Retrieves the `source-cell` constructor field of the `:source` type.
export function source_fs_source_cell(source) /* forall<a> (source : source<a>) -> ref<global,a> */  {
  return source.source_cell;
}
 
 
// Automatically generated. Retrieves the `source-equals` constructor field of the `:source` type.
export function source_fs_source_equals(source) /* forall<a> (source : source<a>) -> ((a, a) -> bool) */  {
  return source.source_equals;
}
 
 
// Automatically generated. Retrieves the `source-version` constructor field of the `:source` type.
export function source_fs_source_version(source) /* forall<a> (source : source<a>) -> ref<global,int> */  {
  return source.source_version;
}
 
 
// Automatically generated. Retrieves the `source-captures` constructor field of the `:source` type.
export function source_fs_source_captures(source) /* forall<a> (source : source<a>) -> kokaine/internal/registry/registry<packed-capture> */  {
  return source.source_captures;
}
 
export function source_fs__copy(_this, source_root, source_cell, source_equals, source_version, source_captures) /* forall<a> (source<a>, source-root : ? root-key, source-cell : ? (ref<global,a>), source-equals : ? ((a, a) -> bool), source-version : ? (ref<global,int>), source-captures : ? (kokaine/internal/registry/registry<packed-capture>)) -> source<a> */  {
  if (source_root !== undefined) {
    var _x6 = source_root;
  }
  else {
    var _x6 = _this.source_root;
  }
  if (source_cell !== undefined) {
    var _x7 = source_cell;
  }
  else {
    var _x7 = _this.source_cell;
  }
  if (source_equals !== undefined) {
    var _x8 = source_equals;
  }
  else {
    var _x8 = _this.source_equals;
  }
  if (source_version !== undefined) {
    var _x9 = source_version;
  }
  else {
    var _x9 = _this.source_version;
  }
  if (source_captures !== undefined) {
    var _x10 = source_captures;
  }
  else {
    var _x10 = _this.source_captures;
  }
  return Source(_x6, _x7, _x8, _x9, _x10);
}
 
 
// Automatically generated. Tests for the `Track-read` constructor of the `:read-mode` type.
export function is_track_read(read_mode) /* (read-mode : read-mode) -> bool */  {
  return (read_mode === 1);
}
 
 
// Automatically generated. Tests for the `Sample-read` constructor of the `:read-mode` type.
export function is_sample_read(read_mode) /* (read-mode : read-mode) -> bool */  {
  return (read_mode === 2);
}
 
 
// Automatically generated. Retrieves the `signal-source` constructor field of the `:signal` type.
export function signal_fs_signal_source(signal) /* forall<a> (signal : signal<a>) -> source<a> */  {
  return signal;
}
 
export function signal_fs__copy(_this, signal_source) /* forall<a> (signal<a>, signal-source : ? (source<a>)) -> signal<a> */  {
  if (signal_source !== undefined) {
    var _x11 = signal_source;
  }
  else {
    var _x11 = _this;
  }
  return _x11;
}
 
 
// Automatically generated. Tests for the `Capture-draft` constructor of the `:capture-state` type.
export function is_capture_draft(capture_state) /* (capture-state : capture-state) -> bool */  {
  return (capture_state === 1);
}
 
 
// Automatically generated. Tests for the `Capture-live` constructor of the `:capture-state` type.
export function is_capture_live(capture_state) /* (capture-state : capture-state) -> bool */  {
  return (capture_state === 2);
}
 
 
// Automatically generated. Tests for the `Capture-pending` constructor of the `:capture-state` type.
export function is_capture_pending(capture_state) /* (capture-state : capture-state) -> bool */  {
  return (capture_state === 3);
}
 
 
// Automatically generated. Tests for the `Capture-running` constructor of the `:capture-state` type.
export function is_capture_running(capture_state) /* (capture-state : capture-state) -> bool */  {
  return (capture_state === 4);
}
 
 
// Automatically generated. Tests for the `Capture-dead` constructor of the `:capture-state` type.
export function is_capture_dead(capture_state) /* (capture-state : capture-state) -> bool */  {
  return (capture_state === 5);
}
 
 
// Automatically generated. Tests for the `Settle-ok` constructor of the `:settle-result` type.
export function is_settle_ok(settle_result) /* (settle-result : settle-result) -> bool */  {
  return (settle_result._tag === 1);
}
 
 
// Automatically generated. Tests for the `Settle-deferred` constructor of the `:settle-result` type.
export function is_settle_deferred(settle_result) /* (settle-result : settle-result) -> bool */  {
  return (settle_result._tag === 2);
}
 
 
// Automatically generated. Tests for the `Settle-failed` constructor of the `:settle-result` type.
export function is_settle_failed(settle_result) /* (settle-result : settle-result) -> bool */  {
  return (settle_result._tag === 3);
}
 
 
// Automatically generated. Retrieves the `gate-state` constructor field of the `:continuation-gate` type.
export function continuation_gate_fs_gate_state(_this) /* (continuation-gate) -> ref<global,capture-state> */  {
  return _this.gate_state;
}
 
 
// Automatically generated. Retrieves the `gate-parent` constructor field of the `:continuation-gate` type.
export function continuation_gate_fs_gate_parent(_this) /* (continuation-gate) -> maybe<continuation-gate> */  {
  return _this.gate_parent;
}
 
 
// Automatically generated. Retrieves the `gate-input-producer` constructor field of the `:continuation-gate` type.
export function continuation_gate_fs_gate_input_producer(_this) /* (continuation-gate) -> maybe<derive-producer> */  {
  return _this.gate_input_producer;
}
 
export function continuation_gate_fs__copy(_this, gate_state, gate_parent, gate_input_producer) /* (continuation-gate, gate-state : ? (ref<global,capture-state>), gate-parent : ? (maybe<continuation-gate>), gate-input-producer : ? (maybe<derive-producer>)) -> continuation-gate */  {
  if (gate_state !== undefined) {
    var _x12 = gate_state;
  }
  else {
    var _x12 = _this.gate_state;
  }
  if (gate_parent !== undefined) {
    var _x13 = gate_parent;
  }
  else {
    var _x13 = _this.gate_parent;
  }
  if (gate_input_producer !== undefined) {
    var _x14 = gate_input_producer;
  }
  else {
    var _x14 = _this.gate_input_producer;
  }
  return Continuation_gate(_x12, _x13, _x14);
}
 
 
// Automatically generated. Tests for the `Trace-end` constructor of the `:trace` type.
export function is_trace_end(trace) /* forall<e> (trace : trace<e>) -> bool */  {
  return (trace === null);
}
 
 
// Automatically generated. Tests for the `Trace-read` constructor of the `:trace` type.
export function is_trace_read(trace) /* forall<e> (trace : trace<e>) -> bool */  {
  return (trace !== null);
}
 
 
// Automatically generated. Retrieves the `built-root` constructor field of the `:built-trace` type.
export function built_trace_fs_built_root(_this) /* forall<e> (built-trace<e>) -> trace<e> */  {
  return _this.built_root;
}
 
 
// Automatically generated. Retrieves the `built-publish` constructor field of the `:built-trace` type.
export function built_trace_fs_built_publish(_this) /* forall<e> (built-trace<e>) -> (() -> <div|e> error<()>) */  {
  return _this.built_publish;
}
 
 
// monadic lift
export function built_trace_fs__mlift_copy_10074(_this, built_root, _c_x10071) /* forall<e> (built-trace<e>, built-root : ? (trace<e>), () -> <div|e> error<()>) -> built-trace<e> */  {
  if (built_root !== undefined) {
    var _x15 = built_root;
  }
  else {
    var _x15 = _this.built_root;
  }
  return Built_trace(_x15, _c_x10071);
}
 
export function built_trace_fs__copy(_this, built_root, built_publish) /* forall<e> (built-trace<e>, built-root : ? (trace<e>), built-publish : ? (() -> <div|e> error<()>)) -> built-trace<e> */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10071 /* () -> <div|1152> error<()> */ ) {
      if (built_root !== undefined) {
        var _x16 = built_root;
      }
      else {
        var _x16 = _this.built_root;
      }
      return Built_trace(_x16, _c_x10071);
    });
  }
  else {
    if (built_root !== undefined) {
      var _x17 = built_root;
    }
    else {
      var _x17 = _this.built_root;
    }
    if (built_publish !== undefined) {
      var _x18 = built_publish;
    }
    else {
      var _x18 = _this.built_publish;
    }
    return Built_trace(_x17, _x18);
  }
}
 
 
// Automatically generated. Tests for the `Scope-starting` constructor of the `:scope-state` type.
export function is_scope_starting(scope_state) /* (scope-state : scope-state) -> bool */  {
  return (scope_state === 1);
}
 
 
// Automatically generated. Tests for the `Scope-live` constructor of the `:scope-state` type.
export function is_scope_live(scope_state) /* (scope-state : scope-state) -> bool */  {
  return (scope_state === 2);
}
 
 
// Automatically generated. Tests for the `Scope-branch-dead` constructor of the `:scope-state` type.
export function is_scope_branch_dead(scope_state) /* (scope-state : scope-state) -> bool */  {
  return (scope_state === 3);
}
 
 
// Automatically generated. Tests for the `Scope-dead` constructor of the `:scope-state` type.
export function is_scope_dead(scope_state) /* (scope-state : scope-state) -> bool */  {
  return (scope_state === 4);
}
 
 
// Automatically generated. Tests for the `Retirement-step` constructor of the `:retirement-work` type.
export function is_retirement_step(retirement_work) /* forall<e> (retirement-work : retirement-work<e>) -> bool */  {
  return (retirement_work._tag === 1);
}
 
 
// Automatically generated. Tests for the `Retirement-finalizer` constructor of the `:retirement-work` type.
export function is_retirement_finalizer(retirement_work) /* forall<e> (retirement-work : retirement-work<e>) -> bool */  {
  return (retirement_work._tag === 2);
}
 
 
// Automatically generated. Retrieves the `retirement-depth` constructor field of the `:retirement-coordinator` type.
export function retirement_coordinator_fs_retirement_depth(_this) /* forall<e> (retirement-coordinator<e>) -> ref<global,int> */  {
  return _this.retirement_depth;
}
 
 
// Automatically generated. Retrieves the `retirement-disposal-requested` constructor field of the `:retirement-coordinator` type.
export function retirement_coordinator_fs_retirement_disposal_requested(_this) /* forall<e> (retirement-coordinator<e>) -> ref<global,bool> */  {
  return _this.retirement_disposal_requested;
}
 
 
// Automatically generated. Retrieves the `retirement-dispose-root` constructor field of the `:retirement-coordinator` type.
export function retirement_coordinator_fs_retirement_dispose_root(_this) /* forall<e> (retirement-coordinator<e>) -> ref<global,maybe<() -> <div,exn|e> ()>> */  {
  return _this.retirement_dispose_root;
}
 
export function retirement_coordinator_fs__copy(_this, retirement_depth, retirement_disposal_requested, retirement_dispose_root) /* forall<e> (retirement-coordinator<e>, retirement-depth : ? (ref<global,int>), retirement-disposal-requested : ? (ref<global,bool>), retirement-dispose-root : ? (ref<global,maybe<() -> <div,exn|e> ()>>)) -> retirement-coordinator<e> */  {
  if (retirement_depth !== undefined) {
    var _x19 = retirement_depth;
  }
  else {
    var _x19 = _this.retirement_depth;
  }
  if (retirement_disposal_requested !== undefined) {
    var _x20 = retirement_disposal_requested;
  }
  else {
    var _x20 = _this.retirement_disposal_requested;
  }
  if (retirement_dispose_root !== undefined) {
    var _x21 = retirement_dispose_root;
  }
  else {
    var _x21 = _this.retirement_dispose_root;
  }
  return Retirement_coordinator(_x19, _x20, _x21);
}
 
 
// Automatically generated. Retrieves the `lifetime-token` constructor field of the `:lifetime-owner` type.
export function lifetime_owner_fs_lifetime_token(_this) /* forall<e> (lifetime-owner<e>) -> ref<global,scope-state> */  {
  return _this.lifetime_token;
}
 
 
// Automatically generated. Retrieves the `lifetime-children` constructor field of the `:lifetime-owner` type.
export function lifetime_owner_fs_lifetime_children(_this) /* forall<e> (lifetime-owner<e>) -> kokaine/internal/registry/registry<retirement-work<e>> */  {
  return _this.lifetime_children;
}
 
 
// Automatically generated. Retrieves the `lifetime-finalizers` constructor field of the `:lifetime-owner` type.
export function lifetime_owner_fs_lifetime_finalizers(_this) /* forall<e> (lifetime-owner<e>) -> kokaine/internal/registry/registry<retirement-work<e>> */  {
  return _this.lifetime_finalizers;
}
 
 
// Automatically generated. Retrieves the `lifetime-retirement` constructor field of the `:lifetime-owner` type.
export function lifetime_owner_fs_lifetime_retirement(_this) /* forall<e> (lifetime-owner<e>) -> retirement-coordinator<e> */  {
  return _this.lifetime_retirement;
}
 
export function lifetime_owner_fs__copy(_this, lifetime_token, lifetime_children, lifetime_finalizers, lifetime_retirement) /* forall<e> (lifetime-owner<e>, lifetime-token : ? (ref<global,scope-state>), lifetime-children : ? (kokaine/internal/registry/registry<retirement-work<e>>), lifetime-finalizers : ? (kokaine/internal/registry/registry<retirement-work<e>>), lifetime-retirement : ? (retirement-coordinator<e>)) -> lifetime-owner<e> */  {
  if (lifetime_token !== undefined) {
    var _x22 = lifetime_token;
  }
  else {
    var _x22 = _this.lifetime_token;
  }
  if (lifetime_children !== undefined) {
    var _x23 = lifetime_children;
  }
  else {
    var _x23 = _this.lifetime_children;
  }
  if (lifetime_finalizers !== undefined) {
    var _x24 = lifetime_finalizers;
  }
  else {
    var _x24 = _this.lifetime_finalizers;
  }
  if (lifetime_retirement !== undefined) {
    var _x25 = lifetime_retirement;
  }
  else {
    var _x25 = _this.lifetime_retirement;
  }
  return Lifetime_owner(_x22, _x23, _x24, _x25);
}
 
 
// Automatically generated. Retrieves the `cleanup-node` constructor field of the `:cleanup-registration` type.
export function cleanup_registration_fs_cleanup_node(_this) /* forall<e> (cleanup-registration<e>) -> kokaine/internal/registry/registry-registration<retirement-work<e>> */  {
  return _this.cleanup_node;
}
 
 
// Automatically generated. Retrieves the `cleanup-resource` constructor field of the `:cleanup-registration` type.
export function cleanup_registration_fs_cleanup_resource(_this) /* forall<e> (cleanup-registration<e>) -> kokaine/reactive/internal/resource/resource-k<e> */  {
  return _this.cleanup_resource;
}
 
export function cleanup_registration_fs__copy(_this, cleanup_node, cleanup_resource) /* forall<e> (cleanup-registration<e>, cleanup-node : ? (kokaine/internal/registry/registry-registration<retirement-work<e>>), cleanup-resource : ? (kokaine/reactive/internal/resource/resource-k<e>)) -> cleanup-registration<e> */  {
  if (cleanup_node !== undefined) {
    var _x26 = cleanup_node;
  }
  else {
    var _x26 = _this.cleanup_node;
  }
  if (cleanup_resource !== undefined) {
    var _x27 = cleanup_resource;
  }
  else {
    var _x27 = _this.cleanup_resource;
  }
  return Cleanup_registration(_x26, _x27);
}
 
 
// Automatically generated. Retrieves the `scope-lifetime` constructor field of the `:continuation-scope` type.
export function continuation_scope_fs_scope_lifetime(_this) /* forall<e> (continuation-scope<e>) -> lifetime-owner<e> */  {
  return _this.scope_lifetime;
}
 
 
// Automatically generated. Retrieves the `scope-body` constructor field of the `:continuation-scope` type.
export function continuation_scope_fs_scope_body(_this) /* forall<e> (continuation-scope<e>) -> ref<global,trace<e>> */  {
  return _this.scope_body;
}
 
 
// Automatically generated. Retrieves the `scope-parent` constructor field of the `:continuation-scope` type.
export function continuation_scope_fs_scope_parent(_this) /* forall<e> (continuation-scope<e>) -> maybe<continuation-gate> */  {
  return _this.scope_parent;
}
 
 
// Automatically generated. Retrieves the `scope-bootstrap-slot` constructor field of the `:continuation-scope` type.
export function continuation_scope_fs_scope_bootstrap_slot(_this) /* forall<e> (continuation-scope<e>) -> ref<global,maybe<() -> <div|e> error<()>>> */  {
  return _this.scope_bootstrap_slot;
}
 
 
// Automatically generated. Retrieves the `scope-unlink` constructor field of the `:continuation-scope` type.
export function continuation_scope_fs_scope_unlink(_this) /* forall<e> (continuation-scope<e>) -> ref<global,maybe<() -> bool>> */  {
  return _this.scope_unlink;
}
 
export function continuation_scope_fs__copy(_this, scope_lifetime, scope_body, scope_parent, scope_bootstrap_slot, scope_unlink) /* forall<e> (continuation-scope<e>, scope-lifetime : ? (lifetime-owner<e>), scope-body : ? (ref<global,trace<e>>), scope-parent : ? (maybe<continuation-gate>), scope-bootstrap-slot : ? (ref<global,maybe<() -> <div|e> error<()>>>), scope-unlink : ? (ref<global,maybe<() -> bool>>)) -> continuation-scope<e> */  {
  if (scope_lifetime !== undefined) {
    var _x28 = scope_lifetime;
  }
  else {
    var _x28 = _this.scope_lifetime;
  }
  if (scope_body !== undefined) {
    var _x29 = scope_body;
  }
  else {
    var _x29 = _this.scope_body;
  }
  if (scope_parent !== undefined) {
    var _x30 = scope_parent;
  }
  else {
    var _x30 = _this.scope_parent;
  }
  if (scope_bootstrap_slot !== undefined) {
    var _x31 = scope_bootstrap_slot;
  }
  else {
    var _x31 = _this.scope_bootstrap_slot;
  }
  if (scope_unlink !== undefined) {
    var _x32 = scope_unlink;
  }
  else {
    var _x32 = _this.scope_unlink;
  }
  return Scope(_x28, _x29, _x30, _x31, _x32);
}
 
 
// Automatically generated. Retrieves the `frame-lifetime` constructor field of the `:frame` type.
export function frame_fs_frame_lifetime(frame) /* forall<e> (frame : frame<e>) -> lifetime-owner<e> */  {
  return frame;
}
 
export function frame_fs__copy(_this, frame_lifetime) /* forall<e> (frame<e>, frame-lifetime : ? (lifetime-owner<e>)) -> frame<e> */  {
  if (frame_lifetime !== undefined) {
    var _x33 = frame_lifetime;
  }
  else {
    var _x33 = _this;
  }
  return _x33;
}
 
 
// Automatically generated. Tests for the `Resume-work` constructor of the `:work` type.
export function is_resume_work(work) /* forall<e> (work : work<e>) -> bool */  {
  return (work._tag === 1);
}
 
 
// Automatically generated. Tests for the `Bootstrap-work` constructor of the `:work` type.
export function is_bootstrap_work(work) /* forall<e> (work : work<e>) -> bool */  {
  return (work._tag === 2);
}
 
 
// Automatically generated. Retrieves the `plane-queue` constructor field of the `:plane` type.
export function plane_fs_plane_queue(plane) /* forall<e> (plane : plane<e>) -> kokaine/reactive/internal/work-transaction/work-queue<work<e>> */  {
  return plane.plane_queue;
}
 
 
// Automatically generated. Retrieves the `plane-work-group` constructor field of the `:plane` type.
export function plane_fs_plane_work_group(plane) /* forall<e> (plane : plane<e>) -> ref<global,maybe<kokaine/reactive/internal/work-transaction/work-group<work<e>>>> */  {
  return plane.plane_work_group;
}
 
 
// Automatically generated. Retrieves the `plane-current` constructor field of the `:plane` type.
export function plane_fs_plane_current(plane) /* forall<e> (plane : plane<e>) -> ref<global,maybe<continuation-gate>> */  {
  return plane.plane_current;
}
 
 
// Automatically generated. Retrieves the `plane-current-frame` constructor field of the `:plane` type.
export function plane_fs_plane_current_frame(plane) /* forall<e> (plane : plane<e>) -> ref<global,frame<e>> */  {
  return plane.plane_current_frame;
}
 
 
// Automatically generated. Retrieves the `plane-draft` constructor field of the `:plane` type.
export function plane_fs_plane_draft(plane) /* forall<e> (plane : plane<e>) -> ref<global,maybe<ref<global,list<trace<e>>>>> */  {
  return plane.plane_draft;
}
 
 
// Automatically generated. Retrieves the `plane-retirement` constructor field of the `:plane` type.
export function plane_fs_plane_retirement(plane) /* forall<e> (plane : plane<e>) -> retirement-coordinator<e> */  {
  return plane.plane_retirement;
}
 
export function plane_fs__copy(_this, plane_queue, plane_work_group, plane_current, plane_current_frame, plane_draft, plane_retirement) /* forall<e> (plane<e>, plane-queue : ? (kokaine/reactive/internal/work-transaction/work-queue<work<e>>), plane-work-group : ? (ref<global,maybe<kokaine/reactive/internal/work-transaction/work-group<work<e>>>>), plane-current : ? (ref<global,maybe<continuation-gate>>), plane-current-frame : ? (ref<global,frame<e>>), plane-draft : ? (ref<global,maybe<ref<global,list<trace<e>>>>>), plane-retirement : ? (retirement-coordinator<e>)) -> plane<e> */  {
  if (plane_queue !== undefined) {
    var _x34 = plane_queue;
  }
  else {
    var _x34 = _this.plane_queue;
  }
  if (plane_work_group !== undefined) {
    var _x35 = plane_work_group;
  }
  else {
    var _x35 = _this.plane_work_group;
  }
  if (plane_current !== undefined) {
    var _x36 = plane_current;
  }
  else {
    var _x36 = _this.plane_current;
  }
  if (plane_current_frame !== undefined) {
    var _x37 = plane_current_frame;
  }
  else {
    var _x37 = _this.plane_current_frame;
  }
  if (plane_draft !== undefined) {
    var _x38 = plane_draft;
  }
  else {
    var _x38 = _this.plane_draft;
  }
  if (plane_retirement !== undefined) {
    var _x39 = plane_retirement;
  }
  else {
    var _x39 = _this.plane_retirement;
  }
  return Plane(_x34, _x35, _x36, _x37, _x38, _x39);
}
 
 
// Automatically generated. Retrieves the `root-key` constructor field of the `:root` type.
export function root_fs_root_key(root) /* forall<e> (root : root<e>) -> root-key */  {
  return root.root_key;
}
 
 
// Automatically generated. Retrieves the `root-derive-plane` constructor field of the `:root` type.
export function root_fs_root_derive_plane(root) /* forall<e> (root : root<e>) -> plane<total> */  {
  return root.root_derive_plane;
}
 
 
// Automatically generated. Retrieves the `root-effect-plane` constructor field of the `:root` type.
export function root_fs_root_effect_plane(root) /* forall<e> (root : root<e>) -> plane<e> */  {
  return root.root_effect_plane;
}
 
 
// Automatically generated. Retrieves the `root-lifetime` constructor field of the `:root` type.
export function root_fs_root_lifetime(root) /* forall<e> (root : root<e>) -> lifetime-owner<e> */  {
  return root.root_lifetime;
}
 
 
// Automatically generated. Retrieves the `root-batch-depth` constructor field of the `:root` type.
export function root_fs_root_batch_depth(root) /* forall<e> (root : root<e>) -> ref<global,int> */  {
  return root.root_batch_depth;
}
 
 
// Automatically generated. Retrieves the `root-flushing` constructor field of the `:root` type.
export function root_fs_root_flushing(root) /* forall<e> (root : root<e>) -> ref<global,bool> */  {
  return root.root_flushing;
}
 
 
// Automatically generated. Retrieves the `root-disposing` constructor field of the `:root` type.
export function root_fs_root_disposing(root) /* forall<e> (root : root<e>) -> ref<global,bool> */  {
  return root.root_disposing;
}
 
 
// Automatically generated. Retrieves the `root-disposed` constructor field of the `:root` type.
export function root_fs_root_disposed(root) /* forall<e> (root : root<e>) -> ref<global,bool> */  {
  return root.root_disposed;
}
 
export function root_fs__copy(_this, root_key, root_derive_plane, root_effect_plane, root_lifetime, root_batch_depth, root_flushing, root_disposing, root_disposed) /* forall<e> (root<e>, root-key : ? root-key, root-derive-plane : ? (plane<total>), root-effect-plane : ? (plane<e>), root-lifetime : ? (lifetime-owner<e>), root-batch-depth : ? (ref<global,int>), root-flushing : ? (ref<global,bool>), root-disposing : ? (ref<global,bool>), root-disposed : ? (ref<global,bool>)) -> root<e> */  {
  if (root_key !== undefined) {
    var _x40 = root_key;
  }
  else {
    var _x40 = _this.root_key;
  }
  if (root_derive_plane !== undefined) {
    var _x41 = root_derive_plane;
  }
  else {
    var _x41 = _this.root_derive_plane;
  }
  if (root_effect_plane !== undefined) {
    var _x42 = root_effect_plane;
  }
  else {
    var _x42 = _this.root_effect_plane;
  }
  if (root_lifetime !== undefined) {
    var _x43 = root_lifetime;
  }
  else {
    var _x43 = _this.root_lifetime;
  }
  if (root_batch_depth !== undefined) {
    var _x44 = root_batch_depth;
  }
  else {
    var _x44 = _this.root_batch_depth;
  }
  if (root_flushing !== undefined) {
    var _x45 = root_flushing;
  }
  else {
    var _x45 = _this.root_flushing;
  }
  if (root_disposing !== undefined) {
    var _x46 = root_disposing;
  }
  else {
    var _x46 = _this.root_disposing;
  }
  if (root_disposed !== undefined) {
    var _x47 = root_disposed;
  }
  else {
    var _x47 = _this.root_disposed;
  }
  return Root(_x40, _x41, _x42, _x43, _x44, _x45, _x46, _x47);
}
 
 
// Automatically generated. Retrieves the `producer-plane` constructor field of the `:derive-producer` type.
export function derive_producer_fs_producer_plane(_this) /* (derive-producer) -> plane<total> */  {
  return _this.producer_plane;
}
 
 
// Automatically generated. Retrieves the `producer-scope` constructor field of the `:derive-producer` type.
export function derive_producer_fs_producer_scope(_this) /* (derive-producer) -> continuation-scope<total> */  {
  return _this.producer_scope;
}
 
 
// Automatically generated. Retrieves the `producer-settling` constructor field of the `:derive-producer` type.
export function derive_producer_fs_producer_settling(_this) /* (derive-producer) -> ref<global,bool> */  {
  return _this.producer_settling;
}
 
export function derive_producer_fs__copy(_this, producer_plane, producer_scope, producer_settling) /* (derive-producer, producer-plane : ? (plane<total>), producer-scope : ? (continuation-scope<total>), producer-settling : ? (ref<global,bool>)) -> derive-producer */  {
  if (producer_plane !== undefined) {
    var _x48 = producer_plane;
  }
  else {
    var _x48 = _this.producer_plane;
  }
  if (producer_scope !== undefined) {
    var _x49 = producer_scope;
  }
  else {
    var _x49 = _this.producer_scope;
  }
  if (producer_settling !== undefined) {
    var _x50 = producer_settling;
  }
  else {
    var _x50 = _this.producer_settling;
  }
  return Derive_producer(_x48, _x49, _x50);
}
 
 
// Automatically generated. Retrieves the `memo-source` constructor field of the `:memo` type.
export function memo_fs_memo_source(memo) /* forall<a> (memo : memo<a>) -> source<a> */  {
  return memo.memo_source;
}
 
 
// Automatically generated. Retrieves the `memo-producer` constructor field of the `:memo` type.
export function memo_fs_memo_producer(memo) /* forall<a> (memo : memo<a>) -> derive-producer */  {
  return memo.memo_producer;
}
 
export function memo_fs__copy(_this, memo_source, memo_producer) /* forall<a> (memo<a>, memo-source : ? (source<a>), memo-producer : ? derive-producer) -> memo<a> */  {
  if (memo_source !== undefined) {
    var _x51 = memo_source;
  }
  else {
    var _x51 = _this.memo_source;
  }
  if (memo_producer !== undefined) {
    var _x52 = memo_producer;
  }
  else {
    var _x52 = _this.memo_producer;
  }
  return Memo(_x51, _x52);
}