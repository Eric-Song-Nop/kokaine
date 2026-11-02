// Koka generated module: kokaine/reactive/async/internal/runtime, koka version: 3.2.9
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
import * as $std_core_bytes from './std_core_bytes.mjs';
import * as $std_core_bslice from './std_core_bslice.mjs';
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
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_integration_internal_reentry from './kokaine_reactive_integration_internal_reentry.mjs';
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
import * as $kokaine_reactive_internal_scheduler from './kokaine_reactive_internal_scheduler.mjs';
import * as $kokaine_reactive_async_internal_host_dash_turn from './kokaine_reactive_async_internal_host_dash_turn.mjs';
import * as $kokaine_async_internal_one_dash_shot_dash_task from './kokaine_async_internal_one_dash_shot_dash_task.mjs';
import * as $kokaine_async_internal_cancellation_dash_supervisor from './kokaine_async_internal_cancellation_dash_supervisor.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $kokaine_internal_int_dash_index from './kokaine_internal_int_dash_index.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $kokaine_reactive_internal_resource from './kokaine_reactive_internal_resource.mjs';
import * as $kokaine_reactive_internal_work_dash_transaction from './kokaine_reactive_internal_work_dash_transaction.mjs';
 
// externals
 
// type declarations
// type task-cancellation
export function Task_cancellation(cancellation_strand, cancellation_dispose) /* (cancellation-strand : task-cancel-strand, cancellation-dispose : async/effects/dispose-fn) -> task-cancellation */  {
  return { cancellation_strand: cancellation_strand, cancellation_dispose: cancellation_dispose };
}
// type runtime-supervisor
export function Runtime_supervisor(supervisor_scope, supervisor_tasks, supervisor_reason, supervisor_owner, supervisor_family, supervisor_bucket_link) /* forall<e> (supervisor-scope : async/effects/async-scope, supervisor-tasks : async/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation>, supervisor-reason : ref<global,async/internal/one-shot-task/task-stop-reason>, supervisor-owner : ref<global,maybe<internal/model/cleanup-registration<<ui|e>>>>, supervisor-family : ref<global,maybe<internal/registry/registry-registration<runtime-supervisor<e>>>>, supervisor-bucket-link : ref<global,maybe<runtime-supervisor-bucket-link<e>>>) -> runtime-supervisor<e> */  {
  return { supervisor_scope: supervisor_scope, supervisor_tasks: supervisor_tasks, supervisor_reason: supervisor_reason, supervisor_owner: supervisor_owner, supervisor_family: supervisor_family, supervisor_bucket_link: supervisor_bucket_link };
}
// type runtime-supervisor-bucket
export function Runtime_supervisor_bucket(bucket_supervisors, bucket_index) /* forall<e> (bucket-supervisors : internal/registry/registry<runtime-supervisor<e>>, bucket-index : ref<global,maybe<internal/int-index/int-index-registration<runtime-supervisor-bucket<e>>>>) -> runtime-supervisor-bucket<e> */  {
  return { bucket_supervisors: bucket_supervisors, bucket_index: bucket_index };
}
// type runtime-supervisor-bucket-link
export function Runtime_supervisor_bucket_link(link_frame, link_bucket, link_registration) /* forall<e> (link-frame : internal/model/frame<<ui|e>>, link-bucket : runtime-supervisor-bucket<e>, link-registration : internal/registry/registry-registration<runtime-supervisor<e>>) -> runtime-supervisor-bucket-link<e> */  {
  return { link_frame: link_frame, link_bucket: link_bucket, link_registration: link_registration };
}
// type async-family
export function Async_family(family_supervisors, family_index, family_canceled, family_late_tasks, family_root_scope, family_dispatcher, family_runner) /* forall<e> (family-supervisors : internal/registry/registry<runtime-supervisor<e>>, family-index : internal/int-index/int-index<runtime-supervisor-bucket<e>>, family-canceled : ref<global,list<async/effects/async-scope>>, family-late-tasks : ref<global,bool>, family-root-scope : async/effects/async-scope, family-dispatcher : host-turn/host-turn-dispatcher, family-runner : host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>) -> async-family<e> */  {
  return { family_supervisors: family_supervisors, family_index: family_index, family_canceled: family_canceled, family_late_tasks: family_late_tasks, family_root_scope: family_root_scope, family_dispatcher: family_dispatcher, family_runner: family_runner };
}
// type async-lease-group
export function Async_lease_group(lease_group_entries) /* (lease-group-entries : internal/registry/registry<async/effects/dispose-fn>) -> async-lease-group */  {
  return lease_group_entries;
}
// type cancellation-reentry
export const Cancellation_retirement = 1; // cancellation-reentry
export const Cancellation_live_or_retirement = 2; // cancellation-reentry
// type generation-runtime
export function Generation_runtime(runtime_family) /* forall<e> (runtime-family : async-family<e>) -> generation-runtime<e> */  {
  return runtime_family;
}
// type task-payload
export function Task_payload(payload_portal, payload_resume, payload_label) /* forall<a,e> (payload-portal : integration/internal/reentry/reentry<<ui|e>>, payload-resume : taskresume<e,a>, payload-label : string) -> task-payload<a,e> */  {
  return { payload_portal: payload_portal, payload_resume: payload_resume, payload_label: payload_label };
}
// type generation-task
export function Generation_task(task_state, task_supervisor, task_cancel) /* forall<a,e> (task-state : async/internal/one-shot-task/one-shot-task<task-payload<a,e>,async/effects/await-result<a>,async/effects/dispose-fn>, task-supervisor : runtime-supervisor<e>, task-cancel : ref<global,maybe<async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>>>) -> generation-task<a,e> */  {
  return { task_state: task_state, task_supervisor: task_supervisor, task_cancel: task_cancel };
}
 
// declarations
 
 
// // Automatically generated. Retrieves the `cancellation-strand` constructor field of the `:task-cancellation` type.
export function task_cancellation_fs_cancellation_strand(_this) /* (task-cancellation) -> task-cancel-strand */  {
  return _this.cancellation_strand;
}
 
 
// // Automatically generated. Retrieves the `cancellation-dispose` constructor field of the `:task-cancellation` type.
export function task_cancellation_fs_cancellation_dispose(_this) /* (task-cancellation) -> async/effects/dispose-fn */  {
  return _this.cancellation_dispose;
}
 
export function task_cancellation_fs__copy(_this, cancellation_strand, cancellation_dispose) /* (task-cancellation, cancellation-strand : ? task-cancel-strand, cancellation-dispose : ? async/effects/dispose-fn) -> task-cancellation */  {
  if (cancellation_strand !== undefined) {
    var _x0 = cancellation_strand;
  }
  else {
    var _x0 = _this.cancellation_strand;
  }
  if (cancellation_dispose !== undefined) {
    var _x1 = cancellation_dispose;
  }
  else {
    var _x1 = _this.cancellation_dispose;
  }
  return Task_cancellation(_x0, _x1);
}
 
 
// // Automatically generated. Tests for the `Cancellation-retirement` constructor of the `:cancellation-reentry` type.
export function is_cancellation_retirement(cancellation_reentry) /* (cancellation-reentry : cancellation-reentry) -> bool */  {
  return (cancellation_reentry === 1);
}
 
 
// // Automatically generated. Tests for the `Cancellation-live-or-retirement` constructor of the `:cancellation-reentry` type.
export function is_cancellation_live_or_retirement(cancellation_reentry) /* (cancellation-reentry : cancellation-reentry) -> bool */  {
  return (cancellation_reentry === 2);
}
 
 
// // Automatically generated. Retrieves the `payload-portal` constructor field of the `:task-payload` type.
export function task_payload_fs_payload_portal(_this) /* forall<a,e> (task-payload<a,e>) -> integration/internal/reentry/reentry<<ui|e>> */  {
  return _this.payload_portal;
}
 
 
// // Automatically generated. Retrieves the `payload-resume` constructor field of the `:task-payload` type.
export function task_payload_fs_payload_resume(_this) /* forall<a,e> (task-payload<a,e>) -> taskresume<e,a> */  {
  return _this.payload_resume;
}
 
 
// // Automatically generated. Retrieves the `payload-label` constructor field of the `:task-payload` type.
export function task_payload_fs_payload_label(_this) /* forall<a,e> (task-payload<a,e>) -> string */  {
  return _this.payload_label;
}
 
 
// // monadic lift
export function task_payload_fs__mlift_copy_10564(_this, payload_label, payload_portal, _c_x10173) /* forall<a,e> (task-payload<a,e>, payload-label : ? string, payload-portal : ? (integration/internal/reentry/reentry<<ui|e>>), taskresume<e,a>) -> task-payload<a,e> */  {
  if (payload_portal !== undefined) {
    var _x2 = payload_portal;
  }
  else {
    var _x2 = _this.payload_portal;
  }
  if (payload_label !== undefined) {
    var _x3 = payload_label;
  }
  else {
    var _x3 = _this.payload_label;
  }
  return Task_payload(_x2, _c_x10173, _x3);
}
 
export function task_payload_fs__copy(_this, payload_portal, payload_resume, payload_label) /* forall<a,e> (task-payload<a,e>, payload-portal : ? (integration/internal/reentry/reentry<<ui|e>>), payload-resume : ? (taskresume<e,a>), payload-label : ? string) -> task-payload<a,e> */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10173 /* taskresume<737,736> */ ) {
      if (payload_portal !== undefined) {
        var _x4 = payload_portal;
      }
      else {
        var _x4 = _this.payload_portal;
      }
      if (payload_label !== undefined) {
        var _x5 = payload_label;
      }
      else {
        var _x5 = _this.payload_label;
      }
      return Task_payload(_x4, _c_x10173, _x5);
    });
  }
  else {
    if (payload_portal !== undefined) {
      var _x6 = payload_portal;
    }
    else {
      var _x6 = _this.payload_portal;
    }
    if (payload_resume !== undefined) {
      var _x7 = payload_resume;
    }
    else {
      var _x7 = _this.payload_resume;
    }
    if (payload_label !== undefined) {
      var _x8 = payload_label;
    }
    else {
      var _x8 = _this.payload_label;
    }
    return Task_payload(_x6, _x7, _x8);
  }
}
 
 
// // Automatically generated. Retrieves the `supervisor-scope` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_scope(_this) /* forall<e> (runtime-supervisor<e>) -> async/effects/async-scope */  {
  return _this.supervisor_scope;
}
 
 
// // Automatically generated. Retrieves the `supervisor-tasks` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_tasks(_this) /* forall<e> (runtime-supervisor<e>) -> async/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation> */  {
  return _this.supervisor_tasks;
}
 
 
// // Automatically generated. Retrieves the `supervisor-reason` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_reason(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,async/internal/one-shot-task/task-stop-reason> */  {
  return _this.supervisor_reason;
}
 
 
// // Automatically generated. Retrieves the `supervisor-owner` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_owner(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,maybe<internal/model/cleanup-registration<<ui|e>>>> */  {
  return _this.supervisor_owner;
}
 
 
// // Automatically generated. Retrieves the `supervisor-family` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_family(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,maybe<internal/registry/registry-registration<runtime-supervisor<e>>>> */  {
  return _this.supervisor_family;
}
 
 
// // Automatically generated. Retrieves the `supervisor-bucket-link` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_bucket_link(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,maybe<runtime-supervisor-bucket-link<e>>> */  {
  return _this.supervisor_bucket_link;
}
 
export function runtime_supervisor_fs__copy(_this, supervisor_scope, supervisor_tasks, supervisor_reason, supervisor_owner, supervisor_family, supervisor_bucket_link) /* forall<e> (runtime-supervisor<e>, supervisor-scope : ? async/effects/async-scope, supervisor-tasks : ? (async/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation>), supervisor-reason : ? (ref<global,async/internal/one-shot-task/task-stop-reason>), supervisor-owner : ? (ref<global,maybe<internal/model/cleanup-registration<<ui|e>>>>), supervisor-family : ? (ref<global,maybe<internal/registry/registry-registration<runtime-supervisor<e>>>>), supervisor-bucket-link : ? (ref<global,maybe<runtime-supervisor-bucket-link<e>>>)) -> runtime-supervisor<e> */  {
  if (supervisor_scope !== undefined) {
    var _x9 = supervisor_scope;
  }
  else {
    var _x9 = _this.supervisor_scope;
  }
  if (supervisor_tasks !== undefined) {
    var _x10 = supervisor_tasks;
  }
  else {
    var _x10 = _this.supervisor_tasks;
  }
  if (supervisor_reason !== undefined) {
    var _x11 = supervisor_reason;
  }
  else {
    var _x11 = _this.supervisor_reason;
  }
  if (supervisor_owner !== undefined) {
    var _x12 = supervisor_owner;
  }
  else {
    var _x12 = _this.supervisor_owner;
  }
  if (supervisor_family !== undefined) {
    var _x13 = supervisor_family;
  }
  else {
    var _x13 = _this.supervisor_family;
  }
  if (supervisor_bucket_link !== undefined) {
    var _x14 = supervisor_bucket_link;
  }
  else {
    var _x14 = _this.supervisor_bucket_link;
  }
  return Runtime_supervisor(_x9, _x10, _x11, _x12, _x13, _x14);
}
 
 
// // Automatically generated. Retrieves the `bucket-supervisors` constructor field of the `:runtime-supervisor-bucket` type.
export function runtime_supervisor_bucket_fs_bucket_supervisors(_this) /* forall<e> (runtime-supervisor-bucket<e>) -> internal/registry/registry<runtime-supervisor<e>> */  {
  return _this.bucket_supervisors;
}
 
 
// // Automatically generated. Retrieves the `bucket-index` constructor field of the `:runtime-supervisor-bucket` type.
export function runtime_supervisor_bucket_fs_bucket_index(_this) /* forall<e> (runtime-supervisor-bucket<e>) -> ref<global,maybe<internal/int-index/int-index-registration<runtime-supervisor-bucket<e>>>> */  {
  return _this.bucket_index;
}
 
export function runtime_supervisor_bucket_fs__copy(_this, bucket_supervisors, bucket_index) /* forall<e> (runtime-supervisor-bucket<e>, bucket-supervisors : ? (internal/registry/registry<runtime-supervisor<e>>), bucket-index : ? (ref<global,maybe<internal/int-index/int-index-registration<runtime-supervisor-bucket<e>>>>)) -> runtime-supervisor-bucket<e> */  {
  if (bucket_supervisors !== undefined) {
    var _x15 = bucket_supervisors;
  }
  else {
    var _x15 = _this.bucket_supervisors;
  }
  if (bucket_index !== undefined) {
    var _x16 = bucket_index;
  }
  else {
    var _x16 = _this.bucket_index;
  }
  return Runtime_supervisor_bucket(_x15, _x16);
}
 
 
// // Automatically generated. Retrieves the `link-frame` constructor field of the `:runtime-supervisor-bucket-link` type.
export function runtime_supervisor_bucket_link_fs_link_frame(_this) /* forall<e> (runtime-supervisor-bucket-link<e>) -> internal/model/frame<<ui|e>> */  {
  return _this.link_frame;
}
 
 
// // Automatically generated. Retrieves the `link-bucket` constructor field of the `:runtime-supervisor-bucket-link` type.
export function runtime_supervisor_bucket_link_fs_link_bucket(_this) /* forall<e> (runtime-supervisor-bucket-link<e>) -> runtime-supervisor-bucket<e> */  {
  return _this.link_bucket;
}
 
 
// // Automatically generated. Retrieves the `link-registration` constructor field of the `:runtime-supervisor-bucket-link` type.
export function runtime_supervisor_bucket_link_fs_link_registration(_this) /* forall<e> (runtime-supervisor-bucket-link<e>) -> internal/registry/registry-registration<runtime-supervisor<e>> */  {
  return _this.link_registration;
}
 
export function runtime_supervisor_bucket_link_fs__copy(_this, link_frame, link_bucket, link_registration) /* forall<e> (runtime-supervisor-bucket-link<e>, link-frame : ? (internal/model/frame<<ui|e>>), link-bucket : ? (runtime-supervisor-bucket<e>), link-registration : ? (internal/registry/registry-registration<runtime-supervisor<e>>)) -> runtime-supervisor-bucket-link<e> */  {
  if (link_frame !== undefined) {
    var _x17 = link_frame;
  }
  else {
    var _x17 = _this.link_frame;
  }
  if (link_bucket !== undefined) {
    var _x18 = link_bucket;
  }
  else {
    var _x18 = _this.link_bucket;
  }
  if (link_registration !== undefined) {
    var _x19 = link_registration;
  }
  else {
    var _x19 = _this.link_registration;
  }
  return Runtime_supervisor_bucket_link(_x17, _x18, _x19);
}
 
 
// // Automatically generated. Retrieves the `task-state` constructor field of the `:generation-task` type.
export function generation_task_fs_task_state(_this) /* forall<a,e> (generation-task<a,e>) -> async/internal/one-shot-task/one-shot-task<task-payload<a,e>,async/effects/await-result<a>,async/effects/dispose-fn> */  {
  return _this.task_state;
}
 
 
// // Automatically generated. Retrieves the `task-supervisor` constructor field of the `:generation-task` type.
export function generation_task_fs_task_supervisor(_this) /* forall<a,e> (generation-task<a,e>) -> runtime-supervisor<e> */  {
  return _this.task_supervisor;
}
 
 
// // Automatically generated. Retrieves the `task-cancel` constructor field of the `:generation-task` type.
export function generation_task_fs_task_cancel(_this) /* forall<a,e> (generation-task<a,e>) -> ref<global,maybe<async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>>> */  {
  return _this.task_cancel;
}
 
export function generation_task_fs__copy(_this, task_state, task_supervisor, task_cancel) /* forall<a,e> (generation-task<a,e>, task-state : ? (async/internal/one-shot-task/one-shot-task<task-payload<a,e>,async/effects/await-result<a>,async/effects/dispose-fn>), task-supervisor : ? (runtime-supervisor<e>), task-cancel : ? (ref<global,maybe<async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>>>)) -> generation-task<a,e> */  {
  if (task_state !== undefined) {
    var _x20 = task_state;
  }
  else {
    var _x20 = _this.task_state;
  }
  if (task_supervisor !== undefined) {
    var _x21 = task_supervisor;
  }
  else {
    var _x21 = _this.task_supervisor;
  }
  if (task_cancel !== undefined) {
    var _x22 = task_cancel;
  }
  else {
    var _x22 = _this.task_cancel;
  }
  return Generation_task(_x20, _x21, _x22);
}
 
 
// // Automatically generated. Retrieves the `family-supervisors` constructor field of the `:async-family` type.
export function async_family_fs_family_supervisors(_this) /* forall<e> (async-family<e>) -> internal/registry/registry<runtime-supervisor<e>> */  {
  return _this.family_supervisors;
}
 
 
// // Automatically generated. Retrieves the `family-index` constructor field of the `:async-family` type.
export function async_family_fs_family_index(_this) /* forall<e> (async-family<e>) -> internal/int-index/int-index<runtime-supervisor-bucket<e>> */  {
  return _this.family_index;
}
 
 
// // Automatically generated. Retrieves the `family-canceled` constructor field of the `:async-family` type.
export function async_family_fs_family_canceled(_this) /* forall<e> (async-family<e>) -> ref<global,list<async/effects/async-scope>> */  {
  return _this.family_canceled;
}
 
 
// // Automatically generated. Retrieves the `family-late-tasks` constructor field of the `:async-family` type.
export function async_family_fs_family_late_tasks(_this) /* forall<e> (async-family<e>) -> ref<global,bool> */  {
  return _this.family_late_tasks;
}
 
 
// // Automatically generated. Retrieves the `family-root-scope` constructor field of the `:async-family` type.
export function async_family_fs_family_root_scope(_this) /* forall<e> (async-family<e>) -> async/effects/async-scope */  {
  return _this.family_root_scope;
}
 
 
// // Automatically generated. Retrieves the `family-dispatcher` constructor field of the `:async-family` type.
export function async_family_fs_family_dispatcher(_this) /* forall<e> (async-family<e>) -> host-turn/host-turn-dispatcher */  {
  return _this.family_dispatcher;
}
 
 
// // Automatically generated. Retrieves the `family-runner` constructor field of the `:async-family` type.
export function async_family_fs_family_runner(_this) /* forall<e> (async-family<e>) -> host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>> */  {
  return _this.family_runner;
}
 
export function async_family_fs__copy(_this, family_supervisors, family_index, family_canceled, family_late_tasks, family_root_scope, family_dispatcher, family_runner) /* forall<e> (async-family<e>, family-supervisors : ? (internal/registry/registry<runtime-supervisor<e>>), family-index : ? (internal/int-index/int-index<runtime-supervisor-bucket<e>>), family-canceled : ? (ref<global,list<async/effects/async-scope>>), family-late-tasks : ? (ref<global,bool>), family-root-scope : ? async/effects/async-scope, family-dispatcher : ? host-turn/host-turn-dispatcher, family-runner : ? (host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>)) -> async-family<e> */  {
  if (family_supervisors !== undefined) {
    var _x23 = family_supervisors;
  }
  else {
    var _x23 = _this.family_supervisors;
  }
  if (family_index !== undefined) {
    var _x24 = family_index;
  }
  else {
    var _x24 = _this.family_index;
  }
  if (family_canceled !== undefined) {
    var _x25 = family_canceled;
  }
  else {
    var _x25 = _this.family_canceled;
  }
  if (family_late_tasks !== undefined) {
    var _x26 = family_late_tasks;
  }
  else {
    var _x26 = _this.family_late_tasks;
  }
  if (family_root_scope !== undefined) {
    var _x27 = family_root_scope;
  }
  else {
    var _x27 = _this.family_root_scope;
  }
  if (family_dispatcher !== undefined) {
    var _x28 = family_dispatcher;
  }
  else {
    var _x28 = _this.family_dispatcher;
  }
  if (family_runner !== undefined) {
    var _x29 = family_runner;
  }
  else {
    var _x29 = _this.family_runner;
  }
  return Async_family(_x23, _x24, _x25, _x26, _x27, _x28, _x29);
}
 
 
// // Automatically generated. Retrieves the `runtime-family` constructor field of the `:generation-runtime` type.
export function generation_runtime_fs_runtime_family(_this) /* forall<e> (generation-runtime<e>) -> async-family<e> */  {
  return _this;
}
 
export function generation_runtime_fs__copy(_this, runtime_family) /* forall<e> (generation-runtime<e>, runtime-family : ? (async-family<e>)) -> generation-runtime<e> */  {
  if (runtime_family !== undefined) {
    var _x30 = runtime_family;
  }
  else {
    var _x30 = _this;
  }
  return _x30;
}
 
 
// // A debug-only aggregate is intentionally not an ownership index. Task cells
// // remain owned exclusively by frames and lexical cancellation scopes.
export var outstanding_operations;
var outstanding_operations = $kokaine_reactive_internal_model.cell(0);
 
 
// // Debug-only cost counters for the async scale tests. Like the outstanding
// // aggregate above, they never influence scheduling or ownership.
export var supervisor_allocations;
var supervisor_allocations = $kokaine_reactive_internal_model.cell(0);
 
export var scope_cancellation_scans;
var scope_cancellation_scans = $kokaine_reactive_internal_model.cell(0);
 
export function generation_async_supervisor_allocations() /* () -> int */  {
  return $kokaine_reactive_internal_model.load(supervisor_allocations);
}
 
export function generation_async_scope_scans() /* () -> int */  {
  return $kokaine_reactive_internal_model.load(scope_cancellation_scans);
}
 
 
// // Automatically generated. Retrieves the `lease-group-entries` constructor field of the `:async-lease-group` type.
export function async_lease_group_fs_lease_group_entries(_this) /* (async-lease-group) -> internal/registry/registry<async/effects/dispose-fn> */  {
  return _this;
}
 
export function async_lease_group_fs__copy(_this, lease_group_entries) /* (async-lease-group, lease-group-entries : ? (internal/registry/registry<async/effects/dispose-fn>)) -> async-lease-group */  {
  if (lease_group_entries !== undefined) {
    var _x31 = lease_group_entries;
  }
  else {
    var _x31 = _this;
  }
  return _x31;
}
 
export function report_async_error(message) /* (message : string) -> ui () */  {
  return console.error(message);
}
 
 
// // `accept-task-result` is operationally a finite `ui` callback (cell updates
// // plus host-turn enqueue). Its `div` label only closes the recursive type SCC
// // formed by the parked continuation and the next generation handler.
export function as_host_action(action) /* (action : () -> <div,ui> ()) -> (() -> ui ()) */  {
  return action;
}
 
export function increment_outstanding() /* () -> () */  {
   
  var x_10029 = $kokaine_reactive_internal_model.load(outstanding_operations);
  return $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_10029,1));
}
 
export function decrement_outstanding() /* () -> () */  {
   
  var current = $kokaine_reactive_internal_model.load(outstanding_operations);
  var _x32 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
  return $kokaine_reactive_internal_model.store(outstanding_operations, _x32);
}
 
export function async_lease_group_fs_count(group) /* (group : async-lease-group) -> int */  {
  return $kokaine_internal_registry.load(group.registry_count);
}
 
 
// // Keep row-polymorphic family internals out of generated Koka 3.2 `.kki`
// // inline bodies; its interface printer otherwise emits an unparseable cache.
export function async_family_fs_scope_is_within(family, child, ancestor) /* forall<e> (family : async-family<e>, child : async/effects/async-scope, ancestor : async/effects/async-scope) -> bool */  {
  var _x34 = family.family_root_scope;
  var _x33 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(ancestor, _x34);
  if (_x33) {
    return true;
  }
  else {
    return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(child, ancestor);
  }
}
 
export function runtime_fs_is_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : async/effects/async-scope) -> bool */  {
  var _x35 = runtime.family_canceled;
  return $std_core_list.any($kokaine_reactive_internal_model.load(_x35), function(canceled /* async/effects/async-scope */ ) {
      var _x37 = runtime.family_root_scope;
      var _x36 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(canceled, _x37);
      if (_x36) {
        return true;
      }
      else {
        return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(scope, canceled);
      }
    });
}
 
export function runtime_fs_record_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : async/effects/async-scope) -> () */  {
  var _x38 = runtime_fs_is_canceled(runtime, scope);
  if (_x38) {
    return $std_core_types.Unit;
  }
  else {
    var _x39 = runtime.family_canceled;
    var _x40 = runtime.family_canceled;
    return $kokaine_reactive_internal_model.store(_x39, $std_core_types.Cons(scope, $kokaine_reactive_internal_model.load(_x40)));
  }
}
 
 
// // Exact removal matters for nested cancellation: releasing a drained child
// // must not revive it while an enclosing canceled scope is still live.
export function runtime_fs_release_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : async/effects/async-scope) -> () */  {
  var _x41 = runtime.family_canceled;
  var _x42 = runtime.family_canceled;
  return $kokaine_reactive_internal_model.store(_x41, $std_core_list.filter($kokaine_reactive_internal_model.load(_x42), function(current /* async/effects/async-scope */ ) {
         
        var b_10045 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(current, scope);
        return (b_10045) ? false : true;
      }));
}
 
 
// // monadic lift
export function runtime_supervisor_fs__mlift_detach_10565(supervisor, _c_x10174) /* forall<e> (supervisor : runtime-supervisor<e>, ()) -> () */  {
   
  var _x43 = supervisor.supervisor_family;
  var family = $kokaine_reactive_internal_model.load(_x43);
   
  var _x44 = supervisor.supervisor_family;
  $kokaine_reactive_internal_model.store(_x44, $std_core_types.Nothing);
  if (family === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _pat_14_0 = $kokaine_internal_registry.registry_registration_fs_take(family.value);
    return $std_core_types.Unit;
  }
}
 
export function runtime_supervisor_fs_detach(supervisor) /* forall<e> (supervisor : runtime-supervisor<e>) -> () */  {
   
  var _x43 = supervisor.supervisor_bucket_link;
  var link = $kokaine_reactive_internal_model.load(_x43);
   
  var _x44 = supervisor.supervisor_bucket_link;
  $kokaine_reactive_internal_model.store(_x44, $std_core_types.Nothing);
   
  if (link === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _pat_3_1 = $kokaine_internal_registry.registry_registration_fs_take(link.value.link_registration);
    var _x46 = $kokaine_internal_registry.load(link.value.link_bucket.bucket_supervisors.registry_count);
    var _x45 = $std_core_types._int_le(_x46,0);
    if (_x45) {
       
      var _x47 = link.value.link_bucket.bucket_index;
      var index = $kokaine_reactive_internal_model.load(_x47);
       
      var _x48 = link.value.link_bucket.bucket_index;
      $kokaine_reactive_internal_model.store(_x48, $std_core_types.Nothing);
      if (index === null) {
        $std_core_types.Unit;
      }
      else {
         
        var _pat_7_0 = $kokaine_internal_int_dash_index.int_index_registration_fs_take(index.value);
        $std_core_types.Unit;
      }
    }
    else {
      $std_core_types.Unit;
    }
  }
   
  var _x47 = supervisor.supervisor_owner;
  var owner = $kokaine_reactive_internal_model.load(_x47);
   
  var _x48 = supervisor.supervisor_owner;
  $kokaine_reactive_internal_model.store(_x48, $std_core_types.Nothing);
   
  if (owner === null) {
    var x_10619 = $std_core_types.Unit;
  }
  else {
     
    var _pat_11_0 = $kokaine_reactive_internal_runtime.cleanup_registration_fs_unregister(owner.value);
    var x_10619 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10174 /* () */ ) {
       
      var _x43 = supervisor.supervisor_family;
      var family = $kokaine_reactive_internal_model.load(_x43);
       
      var _x44 = supervisor.supervisor_family;
      $kokaine_reactive_internal_model.store(_x44, $std_core_types.Nothing);
      if (family === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var _pat_14_0 = $kokaine_internal_registry.registry_registration_fs_take(family.value);
        return $std_core_types.Unit;
      }
    });
  }
  else {
     
    var _x43 = supervisor.supervisor_family;
    var family_0 = $kokaine_reactive_internal_model.load(_x43);
     
    var _x44 = supervisor.supervisor_family;
    $kokaine_reactive_internal_model.store(_x44, $std_core_types.Nothing);
    if (family_0 === null) {
      return $std_core_types.Unit;
    }
    else {
       
      var _pat_14_0_0 = $kokaine_internal_registry.registry_registration_fs_take(family_0.value);
      return $std_core_types.Unit;
    }
  }
}
 
export function runtime_supervisor_fs_claim(supervisor, reason) /* forall<e> (supervisor : runtime-supervisor<e>, reason : async/internal/one-shot-task/task-stop-reason) -> list<task-cancellation> */  {
   
  var _x43 = supervisor.supervisor_reason;
  $kokaine_reactive_internal_model.store(_x43, reason);
  var _x44 = supervisor.supervisor_tasks;
  var _x43 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x44);
  if (_x43 === null) {
    return $std_core_types.Nil;
  }
  else {
     
    runtime_supervisor_fs_detach(supervisor);
    return _x43.value;
  }
}
 
export function run_task_cancel_strands(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10061 = ((loc).value);
        return (list_10061 === null) ? false : true;
      }, function() {
        var _x45 = ((loc).value);
        if (_x45 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x45.tail));
          return _x45.head.cancellation_strand();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function run_task_host_disposers(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10065 = ((loc).value);
        return (list_10065 === null) ? false : true;
      }, function() {
        var _x45 = ((loc).value);
        if (_x45 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x45.tail));
          return _x45.head.cancellation_dispose();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function run_task_cancellations(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return $std_core_hnd.finally_prompt(function() {
      return run_task_host_disposers(actions);
    }, run_task_cancel_strands(actions));
}
 
export function new_runtime_supervisor_bucket() /* forall<e> () -> runtime-supervisor-bucket<e> */  {
  return Runtime_supervisor_bucket($kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0)), $kokaine_reactive_internal_model.cell($std_core_types.Nothing));
}
 
export function runtime_supervisor_bucket_fs_find_frame(bucket, current) /* forall<e> (bucket : runtime-supervisor-bucket<e>, current : internal/model/frame<<ui|e>>) -> maybe<runtime-supervisor<e>> */  {
  var _x45 = bucket.bucket_supervisors;
  return $kokaine_internal_registry.registry_fs_find_readonly(_x45, function(supervisor /* runtime-supervisor<3017> */ ) {
      var _x47 = supervisor.supervisor_bucket_link;
      var _x46 = $kokaine_reactive_internal_model.load(_x47);
      if (_x46 === null) {
        return false;
      }
      else {
        var _x48 = _x46.value.link_frame.lifetime_token;
        var _x49 = current.lifetime_token;
        return Object.is(_x48,_x49);
      }
    });
}
 
 
// // monadic lift
export function _mlift_new_runtime_supervisor_10566(bucket, current, supervisor, bucket_registration) /* forall<e> (bucket : runtime-supervisor-bucket<e>, current : internal/model/frame<<ui|e>>, supervisor : runtime-supervisor<e>, bucket-registration : internal/registry/registry-registration<runtime-supervisor<e>>) -> <exn,div,effects/signal-write,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_18_10463 = $std_core_hnd._open_none1(function(_this_5 /* runtime-supervisor<3240> */ ) {
      return _this_5.supervisor_bucket_link;
    }, supervisor);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_18_10463, $std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, bucket_registration)));
  return supervisor;
}
 
 
// // monadic lift
export function _mlift_new_runtime_supervisor_10567(bucket, current, supervisor, family_registration) /* forall<e> (bucket : runtime-supervisor-bucket<e>, current : internal/model/frame<<ui|e>>, supervisor : runtime-supervisor<e>, family-registration : internal/registry/registry-registration<runtime-supervisor<e>>) -> <exn,div,effects/signal-write,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_13_10455 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<3240> */ ) {
      return _this_3.supervisor_family;
    }, supervisor);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_13_10455, $std_core_types.Just(family_registration));
   
  var _x_x1_15_10460 = $std_core_hnd._open_none1(function(_this_4 /* runtime-supervisor-bucket<3240> */ ) {
      return _this_4.bucket_supervisors;
    }, bucket);
   
  var x_10630 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* internal/registry/registry<runtime-supervisor<3240>> */ , value_0 /* runtime-supervisor<3240> */ ) {
      var _x50 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_0);
      if (_x50 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x50.value;
      }
    }, _x_x1_15_10460, supervisor);
   
  function next_10631(bucket_registration) /* (internal/registry/registry-registration<runtime-supervisor<3240>>) -> <exn,div,effects/signal-write,ui|3240> runtime-supervisor<3240> */  {
     
    var _x_x1_18_10463 = $std_core_hnd._open_none1(function(_this_5 /* runtime-supervisor<3240> */ ) {
        return _this_5.supervisor_bucket_link;
      }, supervisor);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_18_10463, $std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, bucket_registration)));
    return supervisor;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10631);
  }
  else {
    return next_10631(x_10630);
  }
}
 
 
// // monadic lift
export function _mlift_new_runtime_supervisor_10568(bucket, current, family, supervisor, owner) /* forall<e> (bucket : runtime-supervisor-bucket<e>, current : internal/model/frame<<ui|e>>, family : async-family<e>, supervisor : runtime-supervisor<e>, owner : internal/model/cleanup-registration<<ui|e>>) -> <exn,div,effects/signal-write,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_8_10447 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<3240> */ ) {
      return _this_1.supervisor_owner;
    }, supervisor);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_8_10447, $std_core_types.Just(owner));
   
  var _x_x1_10_10452 = $std_core_hnd._open_none1(function(_this_2 /* async-family<3240> */ ) {
      return _this_2.family_supervisors;
    }, family);
   
  var x_10636 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target /* internal/registry/registry<runtime-supervisor<3240>> */ , value /* runtime-supervisor<3240> */ ) {
      var _x50 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target, value);
      if (_x50 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x50.value;
      }
    }, _x_x1_10_10452, supervisor);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(family_registration /* internal/registry/registry-registration<runtime-supervisor<3240>> */ ) {
      return _mlift_new_runtime_supervisor_10567(bucket, current, supervisor, family_registration);
    });
  }
  else {
    return _mlift_new_runtime_supervisor_10567(bucket, current, supervisor, x_10636);
  }
}
 
export function new_runtime_supervisor(root, family, scope, current, bucket) /* forall<e> (root : internal/model/root<<ui|e>>, family : async-family<e>, scope : async/effects/async-scope, current : internal/model/frame<<ui|e>>, bucket : runtime-supervisor-bucket<e>) -> <effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var x_10326 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, supervisor_allocations);
   
  var _x_x2_10437 = $std_core_types._int_add(x_10326,1);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, supervisor_allocations, _x_x2_10437);
   
  var supervisor = Runtime_supervisor(scope, $std_core_hnd._open_none0($kokaine_async_internal_cancellation_dash_supervisor.new_cancellation_supervisor), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing));
   
  var x_10638 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
      var actions_0 = $std_core_hnd._open_none2(function(supervisor_0 /* runtime-supervisor<3240> */ , reason /* async/internal/one-shot-task/task-stop-reason */ ) {
           
          var _x50 = supervisor_0.supervisor_reason;
          $kokaine_reactive_internal_model.store(_x50, reason);
          var _x51 = supervisor_0.supervisor_tasks;
          var _x50 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x51);
          if (_x50 === null) {
            return $std_core_types.Nil;
          }
          else {
             
            runtime_supervisor_fs_detach(supervisor_0);
            return _x50.value;
          }
        }, supervisor, $kokaine_async_internal_one_dash_shot_dash_task.Task_retired);
      return $std_core_hnd._open_none1(function(actions_1 /* list<task-cancellation> */ ) {
          return $std_core_hnd.finally_prompt(function() {
              return run_task_host_disposers(actions_1);
            }, run_task_cancel_strands(actions_1));
        }, actions_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(owner /* internal/model/cleanup-registration<<ui|3240>> */ ) {
      return _mlift_new_runtime_supervisor_10568(bucket, current, family, supervisor, owner);
    });
  }
  else {
     
    var _x_x1_8_10447 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<3240> */ ) {
        return _this_1.supervisor_owner;
      }, supervisor);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_8_10447, $std_core_types.Just(x_10638));
     
    var _x_x1_10_10452 = $std_core_hnd._open_none1(function(_this_2 /* async-family<3240> */ ) {
        return _this_2.family_supervisors;
      }, family);
     
    var x_0_10643 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target /* internal/registry/registry<runtime-supervisor<3240>> */ , value /* runtime-supervisor<3240> */ ) {
        var _x50 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target, value);
        if (_x50 === null) {
          return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
        }
        else {
          return _x50.value;
        }
      }, _x_x1_10_10452, supervisor);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(family_registration /* internal/registry/registry-registration<runtime-supervisor<3240>> */ ) {
        return _mlift_new_runtime_supervisor_10567(bucket, current, supervisor, family_registration);
      });
    }
    else {
       
      var _x_x1_13_10455 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<3240> */ ) {
          return _this_3.supervisor_family;
        }, supervisor);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_13_10455, $std_core_types.Just(x_0_10643));
       
      var _x_x1_15_10460 = $std_core_hnd._open_none1(function(_this_4 /* runtime-supervisor-bucket<3240> */ ) {
          return _this_4.bucket_supervisors;
        }, bucket);
       
      var x_1_10646 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* internal/registry/registry<runtime-supervisor<3240>> */ , value_0 /* runtime-supervisor<3240> */ ) {
          var _x50 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_0);
          if (_x50 === null) {
            return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
          }
          else {
            return _x50.value;
          }
        }, _x_x1_15_10460, supervisor);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(bucket_registration /* internal/registry/registry-registration<runtime-supervisor<3240>> */ ) {
           
          var _x_x1_18_10463 = $std_core_hnd._open_none1(function(_this_5 /* runtime-supervisor<3240> */ ) {
              return _this_5.supervisor_bucket_link;
            }, supervisor);
           
          $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_18_10463, $std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, bucket_registration)));
          return supervisor;
        });
      }
      else {
         
        var _x_x1_18_10463_0 = $std_core_hnd._open_none1(function(_this_5_0 /* runtime-supervisor<3240> */ ) {
            return _this_5_0.supervisor_bucket_link;
          }, supervisor);
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_18_10463_0, $std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, x_1_10646)));
        return supervisor;
      }
    }
  }
}
 
 
// // monadic lift
export function _mlift_new_indexed_runtime_supervisor_10569(bucket, supervisor, registration) /* forall<e> (bucket : runtime-supervisor-bucket<e>, supervisor : runtime-supervisor<e>, registration : internal/int-index/int-index-registration<runtime-supervisor-bucket<e>>) -> <exn,div,effects/signal-write,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_2_10471 = $std_core_hnd._open_none1(function(_this_0 /* runtime-supervisor-bucket<3314> */ ) {
      return _this_0.bucket_index;
    }, bucket);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_2_10471, $std_core_types.Just(registration));
  return supervisor;
}
 
 
// // monadic lift
export function _mlift_new_indexed_runtime_supervisor_10570(bucket, family, scope, supervisor) /* forall<e> (bucket : runtime-supervisor-bucket<e>, family : async-family<e>, scope : async/effects/async-scope, supervisor : runtime-supervisor<e>) -> <effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_10466 = $std_core_hnd._open_none1(function(_this /* async-family<3314> */ ) {
      return _this.family_index;
    }, family);
   
  var _x_x2_10467 = $std_core_hnd._open_none1(function(scope_0 /* async/effects/async-scope */ ) {
      var _x51 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
      var _x50 = $std_core_types._int_eq(_x51,0);
      if (_x50) {
        return scope_0.scope_namespace;
      }
      else {
        return (scope_0.ids !== null) ? scope_0.ids.head : 0;
      }
    }, scope);
   
  var x_1_10653 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_10466, _x_x2_10467, bucket);
   
  function next_10654(registration) /* (internal/int-index/int-index-registration<runtime-supervisor-bucket<3314>>) -> <exn,div,effects/signal-write,ui|3314> runtime-supervisor<3314> */  {
     
    var _x_x1_2_10471 = $std_core_hnd._open_none1(function(_this_0 /* runtime-supervisor-bucket<3314> */ ) {
        return _this_0.bucket_index;
      }, bucket);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_2_10471, $std_core_types.Just(registration));
    return supervisor;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10654);
  }
  else {
    return next_10654(x_1_10653);
  }
}
 
export function new_indexed_runtime_supervisor(root, family, scope, current) /* forall<e> (root : internal/model/root<<ui|e>>, family : async-family<e>, scope : async/effects/async-scope, current : internal/model/frame<<ui|e>>) -> <effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var bucket = $std_core_hnd._open_none0(function() {
    return Runtime_supervisor_bucket($kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0)), $kokaine_reactive_internal_model.cell($std_core_types.Nothing));
  });
   
  var x_10658 = new_runtime_supervisor(root, family, scope, current, bucket);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(supervisor /* runtime-supervisor<3314> */ ) {
      return _mlift_new_indexed_runtime_supervisor_10570(bucket, family, scope, supervisor);
    });
  }
  else {
     
    var _x_x1_10466 = $std_core_hnd._open_none1(function(_this /* async-family<3314> */ ) {
        return _this.family_index;
      }, family);
     
    var _x_x2_10467 = $std_core_hnd._open_none1(function(scope_0 /* async/effects/async-scope */ ) {
        var _x51 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
        var _x50 = $std_core_types._int_eq(_x51,0);
        if (_x50) {
          return scope_0.scope_namespace;
        }
        else {
          return (scope_0.ids !== null) ? scope_0.ids.head : 0;
        }
      }, scope);
     
    var x_1_10661 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_10466, _x_x2_10467, bucket);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(registration /* internal/int-index/int-index-registration<runtime-supervisor-bucket<3314>> */ ) {
         
        var _x_x1_2_10471 = $std_core_hnd._open_none1(function(_this_0 /* runtime-supervisor-bucket<3314> */ ) {
            return _this_0.bucket_index;
          }, bucket);
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_2_10471, $std_core_types.Just(registration));
        return x_10658;
      });
    }
    else {
       
      var _x_x1_2_10471_0 = $std_core_hnd._open_none1(function(_this_0_0 /* runtime-supervisor-bucket<3314> */ ) {
          return _this_0_0.bucket_index;
        }, bucket);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_2_10471_0, $std_core_types.Just(x_1_10661));
      return x_10658;
    }
  }
}
 
 
// // A live completion turn leaves its emptied supervisor attached until the
// // resumed suffix returns (see `run-task-result`), so a suffix which awaits
// // again in the same scope and frame can reuse it instead of rebuilding six
// // cells, a cleanup registration, and two index entries. Reuse is allowed only
// // where a rebuild would be indistinguishable: the owner cleanup is still the
// // newest finalizer of its frame, and the supervisor is still the newest family
// // member. Retirement (LIFO finalizers) and family cancellation (registry
// // snapshot order) therefore visit it exactly where a fresh supervisor would
// // have been registered. Otherwise it is detached and rebuilt as before.
export function runtime_supervisor_fs_reusable_when_idle(supervisor, family) /* forall<e> (supervisor : runtime-supervisor<e>, family : async-family<e>) -> bool */  {
  var _x51 = supervisor.supervisor_bucket_link;
  var _x50 = $kokaine_reactive_internal_model.load(_x51);
  if (_x50 === null) {
    return false;
  }
  else {
    var _x53 = supervisor.supervisor_owner;
    var _x52 = $kokaine_reactive_internal_model.load(_x53);
    if (_x52 === null) {
      return false;
    }
    else {
      var _x55 = supervisor.supervisor_family;
      var _x54 = $kokaine_reactive_internal_model.load(_x55);
      if (_x54 === null) {
        return false;
      }
      else {
         
        var maybe_10020 = $kokaine_internal_registry.load(_x52.value.cleanup_node.registration_value);
        if (maybe_10020 !== null) {
          var _x56 = Object.is(($kokaine_internal_registry.load(_x52.value.cleanup_node.registration_back)),(_x50.value.link_frame.lifetime_finalizers.registry_head));
          if (_x56) {
             
            var maybe_10020_0 = $kokaine_internal_registry.load(_x54.value.registration_value);
            if (maybe_10020_0 !== null) {
              return Object.is(($kokaine_internal_registry.load(_x54.value.registration_back)),(family.family_supervisors.registry_head));
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
          return false;
        }
      }
    }
  }
}
 
 
// // monadic lift
export function runtime_fs__mlift_supervisor_10571(supervisor_0, wild) /* forall<e> (supervisor@0 : runtime-supervisor<e>, wild : ()) -> <exn,div,effects/signal-write,ui|e> runtime-supervisor<e> */  {
  return supervisor_0;
}
 
export function runtime_fs_supervisor(runtime, root, scope) /* forall<e> (runtime : generation-runtime<e>, root : internal/model/root<<ui|e>>, scope : async/effects/async-scope) -> <effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var family = $std_core_hnd._open_none1(function(_this /* generation-runtime<3705> */ ) {
      return _this;
    }, runtime);
   
  var _x_x1_1_10476 = $std_core_hnd._open_none1(function(root_0 /* internal/model/root<<ui|3705>> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var _x_x1_0_10475 = $std_core_hnd._open_none1(function(plane /* internal/model/plane<<ui|3705>> */ ) {
      return plane.plane_current_frame;
    }, _x_x1_1_10476);
   
  var current = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10475);
   
  var _x_x1_3_10478 = $std_core_hnd._open_none1(function(_this_0 /* async-family<3705> */ ) {
      return _this_0.family_index;
    }, family);
   
  var _x_x2_10479 = $std_core_hnd._open_none1(function(scope_0 /* async/effects/async-scope */ ) {
      var _x58 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
      var _x57 = $std_core_types._int_eq(_x58,0);
      if (_x57) {
        return scope_0.scope_namespace;
      }
      else {
        return (scope_0.ids !== null) ? scope_0.ids.head : 0;
      }
    }, scope);
  var _x57 = $std_core_hnd._open_none2($kokaine_internal_int_dash_index.int_index_fs_lookup, _x_x1_3_10478, _x_x2_10479);
  if (_x57 !== null) {
    var _x58 = $std_core_hnd._open_none2(function(bucket_0 /* runtime-supervisor-bucket<3705> */ , current_0 /* internal/model/frame<<ui|3705>> */ ) {
        var _x59 = bucket_0.bucket_supervisors;
        return $kokaine_internal_registry.registry_fs_find_readonly(_x59, function(supervisor /* runtime-supervisor<3705> */ ) {
            var _x61 = supervisor.supervisor_bucket_link;
            var _x60 = $kokaine_reactive_internal_model.load(_x61);
            if (_x60 === null) {
              return false;
            }
            else {
              var _x62 = _x60.value.link_frame.lifetime_token;
              var _x63 = current_0.lifetime_token;
              return Object.is(_x62,_x63);
            }
          });
      }, _x57.value, current);
    if (_x58 !== null) {
       
      var _x_x1_7_10484 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<3705> */ ) {
          return _this_1.supervisor_tasks;
        }, _x58.value);
      var _x64 = $std_core_types._int_gt(($std_core_hnd._open_none1($kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_count, _x_x1_7_10484)),0);
      if (_x64) {
        return _x58.value;
      }
      else {
        var _x65 = $std_core_hnd._open_none2(runtime_supervisor_fs_reusable_when_idle, _x58.value, family);
        if (_x65) {
           
          var x_1_10667 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_scheduler.check_frame_registration, root, current);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild /* () */ ) {
              return _x58.value;
            });
          }
          else {
            return _x58.value;
          }
        }
        else {
           
          $std_core_hnd._open_none1(runtime_supervisor_fs_detach, _x58.value);
           
          var _x_x1_12_10491 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor-bucket<3705> */ ) {
              return _this_2.bucket_index;
            }, _x57.value);
          var _x66 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_12_10491);
          if (_x66 !== null) {
            return new_runtime_supervisor(root, family, scope, current, _x57.value);
          }
          else {
            return new_indexed_runtime_supervisor(root, family, scope, current);
          }
        }
      }
    }
    else {
      return new_runtime_supervisor(root, family, scope, current, _x57.value);
    }
  }
  else {
    return new_indexed_runtime_supervisor(root, family, scope, current);
  }
}
 
export function runtime_supervisor_fs_detach_if_idle(supervisor) /* forall<e> (supervisor : runtime-supervisor<e>) -> () */  {
  var _x68 = supervisor.supervisor_tasks;
  var _x67 = $std_core_types._int_le(($kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_count(_x68)),0);
  if (_x67) {
    return runtime_supervisor_fs_detach(supervisor);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function task_fs_unlink_cancellation(task) /* forall<a,e> (task : generation-task<a,e>) -> () */  {
   
  var _x69 = task.task_cancel;
  var registration = $kokaine_reactive_internal_model.load(_x69);
   
  var _x70 = task.task_cancel;
  $kokaine_reactive_internal_model.store(_x70, $std_core_types.Nothing);
  if (registration === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x69 = registration.value;
    var maybe_10005 = $kokaine_internal_registry.registry_registration_fs_take(_x69);
    return $std_core_types.Unit;
  }
}
 
export function task_fs_detach_cancellation(task) /* forall<a,e> (task : generation-task<a,e>) -> () */  {
   
  var _x69 = task.task_cancel;
  var registration = $kokaine_reactive_internal_model.load(_x69);
   
  var _x70 = task.task_cancel;
  $kokaine_reactive_internal_model.store(_x70, $std_core_types.Nothing);
   
  if (registration === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _x71 = registration.value;
    var maybe_10005 = $kokaine_internal_registry.registry_registration_fs_take(_x71);
    $std_core_types.Unit;
  }
  var _x70 = task.task_supervisor.supervisor_tasks;
  var _x69 = $std_core_types._int_le(($kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_count(_x70)),0);
  if (_x69) {
    var _x71 = task.task_supervisor;
    return runtime_supervisor_fs_detach(_x71);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function reverse_cancellations_onto(values, collected) /* (values : list<task-cancellation>, collected : list<task-cancellation>) -> div list<task-cancellation> */  { tailcall: while(1)
{
  if (values === null) {
    return collected;
  }
  else {
    {
      // tail call
      var _x72 = $std_core_types.Cons(values.head, collected);
      values = values.tail;
      collected = _x72;
      continue tailcall;
    }
  }
}}
 
 
// // monadic lift
export function _mlift_claim_scope_supervisors_loop_10572(collected, _c_x10198) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10198, collected);
}
 
 
// // monadic lift
export function _mlift_claim_scope_supervisors_loop_10573(collected_0, _c_x10199) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10199, collected_0);
}
 
 
// // monadic lift
export function _mlift_claim_scope_supervisors_loop_10574(include_all, rest, scope, _c_x10201) /* forall<e> (include-all : bool, rest : list<runtime-supervisor<e>>, scope : async/effects/async-scope, list<task-cancellation>) -> list<task-cancellation> */  {
  return claim_scope_supervisors_loop(rest, scope, include_all, _c_x10201);
}
 
export function claim_scope_supervisors_loop(supervisors, scope_0, include_all_0, collected_1) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : async/effects/async-scope, include-all : bool, collected : list<task-cancellation>) -> div list<task-cancellation> */  { tailcall: while(1)
{
  if (supervisors === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected_1);
  }
  else {
     
    if (include_all_0) {
       
      var _x73 = supervisors.head.supervisor_reason;
      $kokaine_reactive_internal_model.store(_x73, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled);
       
      var _x75 = supervisors.head.supervisor_tasks;
      var _x74 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x75);
      if (_x74 === null) {
        var x_0_10675 = $std_core_types.Nil;
      }
      else {
         
        runtime_supervisor_fs_detach(supervisors.head);
        var x_0_10675 = _x74.value;
      }
      if ($std_core_hnd._yielding()) {
        var x_10672 = $std_core_hnd.yield_extend(function(_c_x10198_0 /* list<task-cancellation> */ ) {
          return _mlift_claim_scope_supervisors_loop_10572(collected_1, _c_x10198_0);
        });
      }
      else {
        var x_10672 = _mlift_claim_scope_supervisors_loop_10572(collected_1, x_0_10675);
      }
    }
    else {
      var _x74 = supervisors.head.supervisor_scope;
      var _x73 = $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(_x74, scope_0);
      if (_x73) {
         
        var _x75 = supervisors.head.supervisor_reason;
        $kokaine_reactive_internal_model.store(_x75, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled);
         
        var _x77 = supervisors.head.supervisor_tasks;
        var _x76 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x77);
        if (_x76 === null) {
          var x_1_10677 = $std_core_types.Nil;
        }
        else {
           
          runtime_supervisor_fs_detach(supervisors.head);
          var x_1_10677 = _x76.value;
        }
        if ($std_core_hnd._yielding()) {
          var x_10672 = $std_core_hnd.yield_extend(function(_c_x10199_0 /* list<task-cancellation> */ ) {
            return _mlift_claim_scope_supervisors_loop_10573(collected_1, _c_x10199_0);
          });
        }
        else {
          var x_10672 = _mlift_claim_scope_supervisors_loop_10573(collected_1, x_1_10677);
        }
      }
      else {
        var x_10672 = collected_1;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10201_0 /* list<task-cancellation> */ ) {
        return _mlift_claim_scope_supervisors_loop_10574(include_all_0, supervisors.tail, scope_0, _c_x10201_0);
      });
    }
    else {
      {
        // tail call
        supervisors = supervisors.tail;
        collected_1 = x_10672;
        continue tailcall;
      }
    }
  }
}}
 
export function claim_scope_supervisors(supervisors, scope, include_all) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : async/effects/async-scope, include-all : bool) -> div list<task-cancellation> */  {
  return claim_scope_supervisors_loop(supervisors, scope, include_all, $std_core_types.Nil);
}
 
 
// // monadic lift
export function _mlift_cancel_runtime_scope_10575(actions) /* forall<e> (actions : list<task-cancellation>) -> <div,ui,exn,effects/signal-write|e> () */  {
  return $std_core_hnd._open_none1(function(actions_0 /* list<task-cancellation> */ ) {
      return $std_core_hnd.finally_prompt(function() {
          return run_task_host_disposers(actions_0);
        }, run_task_cancel_strands(actions_0));
    }, actions);
}
 
 
// // monadic lift
export function _mlift_cancel_runtime_scope_10576(runtime, scope, _c_x10203) /* forall<e> (runtime : generation-runtime<e>, scope : async/effects/async-scope, bool) -> () */  {
  if (_c_x10203) {
    return $std_core_types.Unit;
  }
  else {
     
    $std_core_hnd._open_none2(runtime_fs_record_canceled, runtime, scope);
     
    var x_10377 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, scope_cancellation_scans);
     
    var _x_x2_1_10503 = $std_core_types._int_add(x_10377,1);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, scope_cancellation_scans, _x_x2_1_10503);
     
    var family = $std_core_hnd._open_none1(function(_this_1 /* generation-runtime<4328> */ ) {
        return _this_1;
      }, runtime);
     
    var _x_x1_9_10508 = $std_core_hnd._open_none1(function(_this_2 /* async-family<4328> */ ) {
        return _this_2.family_supervisors;
      }, family);
     
    var _x_x1_8_10505 = $std_core_hnd._open_none1(function(target /* internal/registry/registry<runtime-supervisor<4328>> */ ) {
        return $kokaine_internal_registry.snapshot_loop($kokaine_internal_registry.load(target.registry_head), $std_core_types.Nil);
      }, _x_x1_9_10508);
     
    var _x_x2_3_10511 = $std_core_hnd._open_none1(function(_this_3 /* async-family<4328> */ ) {
        return _this_3.family_root_scope;
      }, family);
     
    var _x_x3_10507 = $std_core_hnd._open_none2($kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_, scope, _x_x2_3_10511);
     
    var x_10681 = $std_core_hnd._open_none3(function(supervisors /* list<runtime-supervisor<4328>> */ , scope_0 /* async/effects/async-scope */ , include_all /* bool */ ) {
        return claim_scope_supervisors_loop(supervisors, scope_0, include_all, $std_core_types.Nil);
      }, _x_x1_8_10505, scope, _x_x3_10507);
     
    var next_10682 = function(actions /* list<task-cancellation> */ ) {
      return $std_core_hnd._open_none1(function(actions_0_0 /* list<task-cancellation> */ ) {
          return $std_core_hnd.finally_prompt(function() {
              return run_task_host_disposers(actions_0_0);
            }, run_task_cancel_strands(actions_0_0));
        }, actions);
    };
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_10682);
    }
    else {
      return next_10682(x_10681);
    }
  }
}
 
export function cancel_runtime_scope(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : async/effects/async-scope) -> <effects/signal-write,pure,ui|e> () */  {
   
  var _x73 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime, scope);
  if (_x73) {
     
    var _x_x1_2_10497 = $std_core_hnd._open_none1(function(_this_0 /* generation-runtime<4328> */ ) {
        return _this_0;
      }, runtime);
     
    var _x_x1_1_10496 = $std_core_hnd._open_none1(function(_this /* async-family<4328> */ ) {
        return _this.family_late_tasks;
      }, _x_x1_2_10497);
     
    var _x_x1_0_10495 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_1_10496);
    var x_10683 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_0_10495);
  }
  else {
    var x_10683 = false;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10203 /* bool */ ) {
      return _mlift_cancel_runtime_scope_10576(runtime, scope, _c_x10203);
    });
  }
  else {
    if (x_10683) {
      return $std_core_types.Unit;
    }
    else {
       
      $std_core_hnd._open_none2(runtime_fs_record_canceled, runtime, scope);
       
      var x_10377 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, scope_cancellation_scans);
       
      var _x_x2_1_10503 = $std_core_types._int_add(x_10377,1);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, scope_cancellation_scans, _x_x2_1_10503);
       
      var family = $std_core_hnd._open_none1(function(_this_1 /* generation-runtime<4328> */ ) {
          return _this_1;
        }, runtime);
       
      var _x_x1_9_10508 = $std_core_hnd._open_none1(function(_this_2 /* async-family<4328> */ ) {
          return _this_2.family_supervisors;
        }, family);
       
      var _x_x1_8_10505 = $std_core_hnd._open_none1(function(target /* internal/registry/registry<runtime-supervisor<4328>> */ ) {
          return $kokaine_internal_registry.snapshot_loop($kokaine_internal_registry.load(target.registry_head), $std_core_types.Nil);
        }, _x_x1_9_10508);
       
      var _x_x2_3_10511 = $std_core_hnd._open_none1(function(_this_3 /* async-family<4328> */ ) {
          return _this_3.family_root_scope;
        }, family);
       
      var _x_x3_10507 = $std_core_hnd._open_none2($kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_, scope, _x_x2_3_10511);
       
      var x_0_10686 = $std_core_hnd._open_none3(function(supervisors /* list<runtime-supervisor<4328>> */ , scope_0 /* async/effects/async-scope */ , include_all /* bool */ ) {
          return claim_scope_supervisors_loop(supervisors, scope_0, include_all, $std_core_types.Nil);
        }, _x_x1_8_10505, scope, _x_x3_10507);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(actions /* list<task-cancellation> */ ) {
          return $std_core_hnd._open_none1(function(actions_0_0 /* list<task-cancellation> */ ) {
              return $std_core_hnd.finally_prompt(function() {
                  return run_task_host_disposers(actions_0_0);
                }, run_task_cancel_strands(actions_0_0));
            }, actions);
        });
      }
      else {
        return $std_core_hnd._open_none1(function(actions_0_0_0 /* list<task-cancellation> */ ) {
            return $std_core_hnd.finally_prompt(function() {
                return run_task_host_disposers(actions_0_0_0);
              }, run_task_cancel_strands(actions_0_0_0));
          }, x_0_10686);
      }
    }
  }
}
 
export function release_runtime_scope(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : async/effects/async-scope) -> () */  {
  return runtime_fs_release_canceled(runtime, scope);
}
 
 
// // monadic lift
export function _mlift_register_owned_disposer_10577(committed, disposer_slot, registration) /* forall<e> (committed : ref<global,bool>, disposer-slot : ref<global,maybe<async/effects/dispose-fn>>, registration : internal/model/cleanup-registration<<ui|e>>) -> <exn,ui,div,effects/signal-write|e> (() -> ui bool) */  {
   
  $std_core_hnd._open_none0(function() {
     
    var x_0_10102 = $kokaine_reactive_internal_model.load(outstanding_operations);
    return $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_0_10102,1));
  });
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, committed, true);
  return function() {
     
    var b_10104 = $kokaine_reactive_internal_runtime.cleanup_registration_fs_unregister(registration);
    if (b_10104) {
       
      var current_0_0 = $kokaine_reactive_internal_model.load(disposer_slot);
       
      $kokaine_reactive_internal_model.store(disposer_slot, $std_core_types.Nothing);
      if (current_0_0 === null) {
        return false;
      }
      else {
         
        var current_1 = $kokaine_reactive_internal_model.load(outstanding_operations);
         
        var _x73 = ($std_core_types._int_le(current_1,0)) ? 0 : $std_core_types._int_sub(current_1,1);
        $kokaine_reactive_internal_model.store(outstanding_operations, _x73);
        return true;
      }
    }
    else {
      return false;
    }
  };
}
 
 
// // Some host resources outlive the await which creates them. Register their
// // disposer directly with the current reactive generation and return a
// // one-shot release action for ownership transfer. Both paths consume the same
// // slot before unlinking or invoking host code, so re-entry cannot double-run
// // either transition.
export function register_owned_disposer(root, dispose) /* forall<e> (root : internal/model/root<<ui|e>>, dispose : async/effects/dispose-fn) -> <effects/signal-write,pure,ui|e> async/effects/ownership-release-fn */  {
   
  var disposer_slot = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Just(dispose));
   
  var committed = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false);
   
  var x_10693 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
      var current = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, disposer_slot);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, disposer_slot, $std_core_types.Nothing);
      if (current === null) {
        return $std_core_types.Unit;
      }
      else {
         
        $std_core_hnd._open_none0(function() {
           
          var current_0 = $kokaine_reactive_internal_model.load(outstanding_operations);
          var _x73 = ($std_core_types._int_le(current_0,0)) ? 0 : $std_core_types._int_sub(current_0,1);
          return $kokaine_reactive_internal_model.store(outstanding_operations, _x73);
        });
        return $std_core_hnd._open_none0(current.value);
      }
    });
  if ($std_core_hnd._yielding()) {
    var _x74 = $std_core_hnd.yield_extend(function(registration /* internal/model/cleanup-registration<<ui|4541>> */ ) {
      return _mlift_register_owned_disposer_10577(committed, disposer_slot, registration);
    });
  }
  else {
    var _x74 = _mlift_register_owned_disposer_10577(committed, disposer_slot, x_10693);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x73 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, committed);
      if (_x73) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_hnd._open_none0(dispose);
      }
    }, _x74);
}
 
 
// // monadic lift
export function _mlift_register_task_10578(family_0, setup, task_0_0, cancellation_0) /* forall<a,e> (family@0 : async-family<e>, setup : async/effects/await-setup<a>, task@0@0 : generation-task<a,e>, cancellation@0 : async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>) -> <exn,div,ui,effects/signal-write|e> () */  {
   
  var _x_x1_9_10537 = $std_core_hnd._open_none1(function(_this_4 /* generation-task<7087,7088> */ ) {
      return _this_4.task_cancel;
    }, task_0_0);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_9_10537, $std_core_types.Just(cancellation_0));
   
  $std_core_hnd._open_none0(function() {
     
    var x_10117 = $kokaine_reactive_internal_model.load(outstanding_operations);
    return $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_10117,1));
  });
  var _x75 = $std_core_hnd._open_none1(setup, function(result_0_0 /* async/effects/await-result<7087> */ ) {
      return accept_task_result(task_0_0, family_0, result_0_0);
    });
  if (_x75._tag === 1) {
    return $std_core_hnd._open_none3(accept_task_result, task_0_0, family_0, $kokaine_async_effects.Exception(_x75.error));
  }
  else {
     
    var _x_x1_13_10544 = $std_core_hnd._open_none1(function(_this_5 /* generation-task<7087,7088> */ ) {
        return _this_5.task_state;
      }, task_0_0);
    var _x76 = $std_core_hnd._open_none2($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_13_10544, _x75.value);
    if (_x76 === null) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_hnd._open_none0(_x76.value);
    }
  }
}
 
 
// // monadic lift
export function _mlift_register_task_10579(family_0_0, label, portal, resume_action, setup_0, supervisor) /* forall<a,e> (family@0 : async-family<e>, label : string, portal : integration/internal/reentry/reentry<<ui|e>>, resume-action : (async/effects/await-result<a>) -> <async/effects/async,effects/signal-read,effects/signal-write,pure,ui|e> (), setup : async/effects/await-setup<a>, supervisor : runtime-supervisor<e>) -> <effects/signal-write,pure,ui|e> () */  {
   
  var state = $std_core_hnd._open_none1(function(payload_0 /* task-payload<7087,7088> */ ) {
      return $kokaine_async_internal_one_dash_shot_dash_task.cell($kokaine_async_internal_one_dash_shot_dash_task.Task_state_pending(payload_0, $std_core_types.Nothing));
    }, Task_payload(portal, resume_action, label));
   
  var task_0_0_0 = Generation_task(state, supervisor, $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing));
   
  var _x_x1_7_10534 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<7088> */ ) {
      return _this_3.supervisor_tasks;
    }, supervisor);
   
  var x_10695 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_7_10534, function() {
      return task_fs_claim_stop(task_0_0_0, family_0_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(cancellation_0_0 /* async/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
      return _mlift_register_task_10578(family_0_0, setup_0, task_0_0_0, cancellation_0_0);
    });
  }
  else {
    return _mlift_register_task_10578(family_0_0, setup_0, task_0_0_0, x_10695);
  }
}
 
 
// // monadic lift
export function _mlift_register_task_10580(family_0_1, label_0, portal_0, resume_action_0, root, runtime, scope, setup_1, _c_x10214) /* forall<a,e> (family@0 : async-family<e>, label : string, portal : integration/internal/reentry/reentry<<ui|e>>, resume-action : (async/effects/await-result<a>) -> <async/effects/async,effects/signal-read,effects/signal-write,pure,ui|e> (), root : internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : async/effects/async-scope, setup : async/effects/await-setup<a>, ()) -> () */  {
   
  var x_0_10697 = runtime_fs_supervisor(runtime, root, scope);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(supervisor_0 /* runtime-supervisor<7088> */ ) {
      return _mlift_register_task_10579(family_0_1, label_0, portal_0, resume_action_0, setup_1, supervisor_0);
    });
  }
  else {
    return _mlift_register_task_10579(family_0_1, label_0, portal_0, resume_action_0, setup_1, x_0_10697);
  }
}
 
 
// // monadic lift
export function _mlift_register_task_10581(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, portal_1) /* forall<a,e> (label : string, resume-action : (async/effects/await-result<a>) -> <async/effects/async,effects/signal-read,effects/signal-write,pure,ui|e> (), root : internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : async/effects/async-scope, setup : async/effects/await-setup<a>, portal : integration/internal/reentry/reentry<<ui|e>>) -> <exn,div,effects/signal-write,ui|e> () */  {
   
  var family_0_2 = $std_core_hnd._open_none1(function(_this_1 /* generation-runtime<7088> */ ) {
      return _this_1;
    }, runtime_0);
   
  var _x77 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0, scope_0);
  if (_x77) {
     
    var _x_x1_3_10529 = $std_core_hnd._open_none1(function(_this_2 /* async-family<7088> */ ) {
        return _this_2.family_late_tasks;
      }, family_0_2);
    var x_1_10699 = $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_3_10529, true);
  }
  else {
    var x_1_10699 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10214_0 /* () */ ) {
      return _mlift_register_task_10580(family_0_2, label_1, portal_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, _c_x10214_0);
    });
  }
  else {
    return _mlift_register_task_10580(family_0_2, label_1, portal_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, x_1_10699);
  }
}
 
 
// // monadic lift
export function _mlift_register_task_10582(label_2, resume_action_2, root_1, runtime_1, scope_1, setup_3, wild_0) /* forall<a,e> (label : string, resume-action : (async/effects/await-result<a>) -> <async/effects/async,effects/signal-read,effects/signal-write,pure,ui|e> (), root : internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : async/effects/async-scope, setup : async/effects/await-setup<a>, wild@0 : ()) -> <exn,div,effects/signal-write,ui|e> () */  {
   
  var x_2_10701 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_integration_internal_reentry.capture_reentry, root_1);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal_2 /* integration/internal/reentry/reentry<<ui|7088>> */ ) {
      return _mlift_register_task_10581(label_2, resume_action_2, root_1, runtime_1, scope_1, setup_3, portal_2);
    });
  }
  else {
    return _mlift_register_task_10581(label_2, resume_action_2, root_1, runtime_1, scope_1, setup_3, x_2_10701);
  }
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10583(label_0_0, rcontext, root_0_0, runtime_0_0, scope_0_0, setup_0_0, _y_x10226) /* forall<a,e> (label@0 : string, rcontext : hnd/resume-context<async/effects/await-result<a>,<async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,<async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,()>, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : async/effects/async-scope, setup@0 : async/effects/await-setup<a>, hnd/ev-index) -> <effects/signal-read,div,exn,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10226, false, function() {
      return register_task(root_0_0, runtime_0_0, scope_0_0, label_0_0, setup_0_0, function(result_1 /* async/effects/await-result<5176> */ ) {
          return $std_core_hnd.resume_shallow(rcontext, result_1);
        });
    });
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10584(family_1, label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10223) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<async/effects/await-result<a>,<async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,<async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,()>, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : async/effects/async-scope, setup@0 : async/effects/await-setup<a>, hnd/ev-index) -> <async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10223, false, function() {
      var _x77 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_1, scope_0_1);
      if (_x77) {
        return resume_generation(root_0_1, family_1, function() {
            return $std_core_hnd.resume_shallow(rcontext_0, $kokaine_async_effects.Cancel);
          });
      }
      else {
         
        var x_3_10703 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10226_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10583(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10226_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10583(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, x_3_10703);
        }
      }
    });
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10585(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10222) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<async/effects/await-result<a>,<async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,<async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,()>, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : async/effects/async-scope, setup@0 : async/effects/await-setup<a>, hnd/ev-index) -> <async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10222, false, function() {
       
      var x_4_10705 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10223_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10584(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10223_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10584(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, x_4_10705);
      }
    });
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10586(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10221) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<async/effects/await-result<a>,<async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,<async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,()>, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : async/effects/async-scope, setup@0 : async/effects/await-setup<a>, hnd/ev-index) -> <async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10221, false, function() {
       
      var x_5_10707 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10222_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10585(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10222_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10585(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, x_5_10707);
      }
    });
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10587(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10220) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<async/effects/await-result<a>,<async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,<async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e>,()>, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : async/effects/async-scope, setup@0 : async/effects/await-setup<a>, hnd/ev-index) -> <async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10220, false, function() {
       
      var x_6_10709 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10221_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10586(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10221_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10586(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, x_6_10709);
      }
    });
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10588(callback, label_0_0_0, root_0_5, runtime_0_5, scope_0_0_0, setup_0_0_0, _y_x10239) /* forall<a,e> (callback : (async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : async/effects/async-scope, setup@0@0 : async/effects/await-setup<a>, hnd/ev-index) -> <effects/signal-read,div,exn,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10239, false, function() {
      return register_task(root_0_5, runtime_0_5, scope_0_0_0, label_0_0_0, setup_0_0_0, function(result_0_0_0 /* async/effects/await-result<5295> */ ) {
          return $std_core_hnd._open_none1(callback, result_0_0_0);
        });
    });
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10589(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10238) /* forall<a,e> (callback : (async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : async/effects/async-scope, setup@0@0 : async/effects/await-setup<a>, hnd/ev-index) -> <async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10238, false, function() {
      var _x78 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_6, scope_0_0_1);
      if (_x78) {
        return $std_core_hnd._open_none1(callback_0, $kokaine_async_effects.Cancel);
      }
      else {
         
        var x_7_10711 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10239_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10588(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10239_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10588(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, x_7_10711);
        }
      }
    });
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10590(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10237) /* forall<a,e> (callback : (async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : async/effects/async-scope, setup@0@0 : async/effects/await-setup<a>, hnd/ev-index) -> <async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10237, false, function() {
       
      var x_8_10713 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10238_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10589(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10238_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10589(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, x_8_10713);
      }
    });
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10591(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10236) /* forall<a,e> (callback : (async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : async/effects/async-scope, setup@0@0 : async/effects/await-setup<a>, hnd/ev-index) -> <async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10236, false, function() {
       
      var x_9_10715 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10237_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10590(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10237_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10590(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, x_9_10715);
      }
    });
}
 
 
// // monadic lift
export function _mlift_interpret_generation_await_10592(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10235) /* forall<a,e> (callback : (async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : async/effects/async-scope, setup@0@0 : async/effects/await-setup<a>, hnd/ev-index) -> <async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10235, false, function() {
       
      var x_10_10717 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10236_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10591(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10236_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10591(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, x_10_10717);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10593(host_action, _y_x10250) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <exn,div,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10250, false, host_action);
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10594(host_action_0, _y_x10249) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10249, false, function() {
       
      var x_11_10720 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10250_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10593(host_action_0, _y_x10250_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10593(host_action_0, x_11_10720);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10595(host_action_1, _y_x10248) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <effects/signal-read,div,exn,effects/signal-write,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10248, false, function() {
       
      var x_12_10722 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10249_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10594(host_action_1, _y_x10249_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10594(host_action_1, x_12_10722);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10596(host_action_0_0, root_1_0, runtime_1_0, scope_1_0, _y_x10255) /* forall<e> (host-action@0 : () -> ui (), root@1 : internal/model/root<<ui|e>>, runtime@1 : generation-runtime<e>, scope@1 : async/effects/async-scope, hnd/ev-index) -> <effects/signal-read,div,exn,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10255, false, function() {
      return register_scheduled_ioc(root_1_0, runtime_1_0, scope_1_0, host_action_0_0);
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10597(dispose_0, root_1_1, _y_x10259) /* forall<e> (dispose@0 : async/effects/dispose-fn, root@1 : internal/model/root<<ui|e>>, hnd/ev-index) -> <effects/signal-read,div,exn,effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10259, false, function() {
      return register_owned_disposer(root_1_1, dispose_0);
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10598(dispose_0_0, root_1_2, _y_x10258) /* forall<e> (dispose@0 : async/effects/dispose-fn, root@1 : internal/model/root<<ui|e>>, hnd/ev-index) -> <async/effects/async-ioc,div,exn,effects/signal-read,effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10258, false, function() {
       
      var x_13_10724 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10259_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10597(dispose_0_0, root_1_2, _y_x10259_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10597(dispose_0_0, root_1_2, x_13_10724);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10599(runtime_1_1, scope_0_1_0, _y_x10265) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : async/effects/async-scope, hnd/ev-index) -> <effects/signal-read,div,exn,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10265, false, function() {
      return cancel_runtime_scope(runtime_1_1, scope_0_1_0);
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10600(runtime_1_2, scope_0_1_1, _y_x10264) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : async/effects/async-scope, hnd/ev-index) -> <async/effects/async-ownership,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10264, false, function() {
       
      var x_14_10726 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10265_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10599(runtime_1_2, scope_0_1_1, _y_x10265_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10599(runtime_1_2, scope_0_1_1, x_14_10726);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10601(runtime_1_3, scope_0_1_2, _y_x10263) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : async/effects/async-scope, hnd/ev-index) -> <async/effects/async-ioc,async/effects/async-ownership,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10263, false, function() {
       
      var x_15_10728 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10264_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10600(runtime_1_3, scope_0_1_2, _y_x10264_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10600(runtime_1_3, scope_0_1_2, x_15_10728);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10602(runtime_1_4, scope_1_0_0, _y_x10274) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : async/effects/async-scope, hnd/ev-index) -> <exn,div|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10274, false, function() {
      return runtime_fs_is_canceled(runtime_1_4, scope_1_0_0);
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10603(runtime_1_5, scope_1_0_1, _y_x10273) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : async/effects/async-scope, hnd/ev-index) -> <effects/signal-write,div,exn,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10273, false, function() {
       
      var x_16_10732 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10274_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10602(runtime_1_5, scope_1_0_1, _y_x10274_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10602(runtime_1_5, scope_1_0_1, x_16_10732);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10604(runtime_1_6, scope_1_0_2, _y_x10272) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : async/effects/async-scope, hnd/ev-index) -> <effects/signal-read,div,exn,effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10272, false, function() {
       
      var x_17_10734 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10273_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10603(runtime_1_6, scope_1_0_2, _y_x10273_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10603(runtime_1_6, scope_1_0_2, x_17_10734);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10605(runtime_1_7, scope_1_0_3, _y_x10271) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : async/effects/async-scope, hnd/ev-index) -> <async/effects/async-ownership,div,exn,effects/signal-read,effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10271, false, function() {
       
      var x_18_10736 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10272_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10604(runtime_1_7, scope_1_0_3, _y_x10272_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10604(runtime_1_7, scope_1_0_3, x_18_10736);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10606(runtime_1_8, scope_1_0_4, _y_x10270) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : async/effects/async-scope, hnd/ev-index) -> <async/effects/async-ioc,async/effects/async-ownership,div,exn,effects/signal-read,effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10270, false, function() {
       
      var x_19_10738 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10271_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10605(runtime_1_8, scope_1_0_4, _y_x10271_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10605(runtime_1_8, scope_1_0_4, x_19_10738);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10607(runtime_1_9, scope_2, _y_x10286) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : async/effects/async-scope, hnd/ev-index) -> <exn,div|e> () */  {
  return $std_core_hnd._mask_at(_y_x10286, false, function() {
      return release_runtime_scope(runtime_1_9, scope_2);
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10608(runtime_1_10, scope_2_0, _y_x10285) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : async/effects/async-scope, hnd/ev-index) -> <effects/signal-write,div,exn,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10285, false, function() {
       
      var x_20_10742 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10286_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10607(runtime_1_10, scope_2_0, _y_x10286_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10607(runtime_1_10, scope_2_0, x_20_10742);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10609(runtime_1_11, scope_2_1, _y_x10284) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : async/effects/async-scope, hnd/ev-index) -> <effects/signal-read,div,exn,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10284, false, function() {
       
      var x_21_10744 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10285_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10608(runtime_1_11, scope_2_1, _y_x10285_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10608(runtime_1_11, scope_2_1, x_21_10744);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10610(runtime_1_12, scope_2_2, _y_x10283) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : async/effects/async-scope, hnd/ev-index) -> <async/effects/async-ownership,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10283, false, function() {
       
      var x_22_10746 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10284_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10609(runtime_1_12, scope_2_2, _y_x10284_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10609(runtime_1_12, scope_2_2, x_22_10746);
      }
    });
}
 
 
// // monadic lift
export function _mlift_run_generation_async_with_family_10611(runtime_1_13, scope_2_3, _y_x10282) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : async/effects/async-scope, hnd/ev-index) -> <async/effects/async-ioc,async/effects/async-ownership,div,exn,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10282, false, function() {
       
      var x_23_10748 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10283_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10610(runtime_1_13, scope_2_3, _y_x10283_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10610(runtime_1_13, scope_2_3, x_23_10748);
      }
    });
}
 
export function accept_task_result(task, family, result) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>, result : async/effects/await-result<a>) -> <div,ui> () */  {
  var _x80 = task.task_state;
  var _x79 = $kokaine_async_internal_one_dash_shot_dash_task.load(_x80);
  if (_x79._tag === 1) {
     
    var _x81 = task.task_state;
    $kokaine_async_internal_one_dash_shot_dash_task.store(_x81, $kokaine_async_internal_one_dash_shot_dash_task.Task_state_ready(_x79.pending_payload, result, _x79.pending_disposer));
    var _x82 = family.family_dispatcher;
    var _x81 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_dispatcher_fs_dispatch(_x82, function() {
        return run_task_result(task, family);
      });
    if (_x81) {
      return $std_core_types.Unit;
    }
    else {
       
      var rejected = task_fs_claim_dispatch_rejection(task, family);
      if (rejected === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var actions_10115 = $std_core_types.Cons(rejected.value, $std_core_types.Nil);
        return $std_core_hnd.finally_prompt(function() {
            return run_task_host_disposers(actions_10115);
          }, run_task_cancel_strands(actions_10115));
      }
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function register_task(root_2, runtime_2, scope_3, label_3, setup_4, resume_action_3) /* forall<a,e> (root : internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : async/effects/async-scope, label : string, setup : async/effects/await-setup<a>, resume-action : (async/effects/await-result<a>) -> <pure,async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,effects/signal-read,effects/signal-write,ui|e> ()) -> <pure,effects/signal-write,ui|e> () */  {
   
  var x_24_10753 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "async suspension");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild_0_0 /* () */ ) {
      return _mlift_register_task_10582(label_3, resume_action_3, root_2, runtime_2, scope_3, setup_4, wild_0_0);
    });
  }
  else {
     
    var x_25_10756 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_integration_internal_reentry.capture_reentry, root_2);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(portal_3 /* integration/internal/reentry/reentry<<ui|7088>> */ ) {
        return _mlift_register_task_10581(label_3, resume_action_3, root_2, runtime_2, scope_3, setup_4, portal_3);
      });
    }
    else {
       
      var family_0_3 = $std_core_hnd._open_none1(function(_this_1_0 /* generation-runtime<7088> */ ) {
          return _this_1_0;
        }, runtime_2);
       
      var _x83 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_2, scope_3);
      if (_x83) {
         
        var _x_x1_3_10529_0 = $std_core_hnd._open_none1(function(_this_2_0 /* async-family<7088> */ ) {
            return _this_2_0.family_late_tasks;
          }, family_0_3);
        var x_26_10759 = $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_3_10529_0, true);
      }
      else {
        var x_26_10759 = $std_core_types.Unit;
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_c_x10214_1 /* () */ ) {
          return _mlift_register_task_10580(family_0_3, label_3, x_25_10756, resume_action_3, root_2, runtime_2, scope_3, setup_4, _c_x10214_1);
        });
      }
      else {
         
        var x_27_10762 = runtime_fs_supervisor(runtime_2, root_2, scope_3);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(supervisor_1 /* runtime-supervisor<7088> */ ) {
            return _mlift_register_task_10579(family_0_3, label_3, x_25_10756, resume_action_3, setup_4, supervisor_1);
          });
        }
        else {
           
          var state_0 = $std_core_hnd._open_none1(function(payload_0_0 /* task-payload<7087,7088> */ ) {
              return $kokaine_async_internal_one_dash_shot_dash_task.cell($kokaine_async_internal_one_dash_shot_dash_task.Task_state_pending(payload_0_0, $std_core_types.Nothing));
            }, Task_payload(x_25_10756, resume_action_3, label_3));
           
          var task_0_0_1 = Generation_task(state_0, x_27_10762, $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing));
           
          var _x_x1_7_10534_0 = $std_core_hnd._open_none1(function(_this_3_0 /* runtime-supervisor<7088> */ ) {
              return _this_3_0.supervisor_tasks;
            }, x_27_10762);
           
          var x_28_10765 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_7_10534_0, function() {
              return task_fs_claim_stop(task_0_0_1, family_0_3);
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(cancellation_0_1 /* async/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
              return _mlift_register_task_10578(family_0_3, setup_4, task_0_0_1, cancellation_0_1);
            });
          }
          else {
             
            var _x_x1_9_10537_0 = $std_core_hnd._open_none1(function(_this_4_0 /* generation-task<7087,7088> */ ) {
                return _this_4_0.task_cancel;
              }, task_0_0_1);
             
            $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_9_10537_0, $std_core_types.Just(x_28_10765));
             
            $std_core_hnd._open_none0(function() {
               
              var x_10117_0 = $kokaine_reactive_internal_model.load(outstanding_operations);
              return $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_10117_0,1));
            });
            var _x83 = $std_core_hnd._open_none1(setup_4, function(result_0_0_1 /* async/effects/await-result<7087> */ ) {
                return accept_task_result(task_0_0_1, family_0_3, result_0_0_1);
              });
            if (_x83._tag === 1) {
              return $std_core_hnd._open_none3(accept_task_result, task_0_0_1, family_0_3, $kokaine_async_effects.Exception(_x83.error));
            }
            else {
               
              var _x_x1_13_10544_0 = $std_core_hnd._open_none1(function(_this_5_0 /* generation-task<7087,7088> */ ) {
                  return _this_5_0.task_state;
                }, task_0_0_1);
              var _x84 = $std_core_hnd._open_none2($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_13_10544_0, _x83.value);
              if (_x84 === null) {
                return $std_core_types.Unit;
              }
              else {
                return $std_core_hnd._open_none0(_x84.value);
              }
            }
          }
        }
      }
    }
  }
}
 
 
// // Factoring the await interpreter is important for both dynamic and static
// // semantics. Dynamically, its prompt is installed inside the other base
// // handlers, so none of those handler frames become part of the parked suffix.
// // Statically, the shallow resumption retains the complete residual async row;
// // the caller below discharges those effects with the surrounding handlers.
export function interpret_generation_await(root_0_10, family_1_3, runtime_0_10, action_6) /* forall<e> (root : internal/model/root<<ui|e>>, family : async-family<e>, runtime : generation-runtime<e>, action : () -> <pure,async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,effects/signal-read,effects/signal-write,ui|e> ()) -> <pure,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,effects/signal-read,effects/signal-write,ui|e> () */  {
  return $kokaine_async_effects.async_await_fs__handle($kokaine_async_effects._Hnd_async_await(3, function(m /* hnd/marker<<async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|7098>,()> */ , ___wildcard_x606__16 /* hnd/ev<async/effects/async-await> */ , x_29 /* (async/effects/await-setup<_4995>, async/effects/async-scope, string) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<async/effects/await-result<_4995>,()>) -> <async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|7098> () */ ) {
             
            var x_30_10769 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
             
            function next_29_10770(_y_x10220_0) /* (hnd/ev-index) -> <async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,div,exn,effects/signal-read,effects/signal-write,ui|7098> () */  {
              return _mlift_interpret_generation_await_10587(family_1_3, x_29.thd, k, root_0_10, runtime_0_10, x_29.snd, x_29.fst, _y_x10220_0);
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_29_10770);
            }
            else {
              return next_29_10770(x_30_10769);
            }
          });
      }, $std_core_hnd.clause_tail1(function(_pat_x807__20 /* (async/effects/await-setup<_4998>, async/effects/async-scope, string, (async/effects/await-result<_4998>) -> ui ()) */ ) {
         
        var x_31_10772 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10235_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10592(_pat_x807__20.field4, _pat_x807__20.thd, root_0_10, runtime_0_10, _pat_x807__20.snd, _pat_x807__20.fst, _y_x10235_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10592(_pat_x807__20.field4, _pat_x807__20.thd, root_0_10, runtime_0_10, _pat_x807__20.snd, _pat_x807__20.fst, x_31_10772);
        }
      })), function(_res /* () */ ) {
      return _res;
    }, action_6);
}
 
 
// // Install this inside an already established Kokaine turn (in particular,
// // inside the action passed to `reenter`). A raw await returns from this handler,
// // allowing the surrounding re-entry batch to close. Each later completion
// // calls this function again only after entering a fresh generation-bound batch.
export function run_generation_async_with_family(root_1_3, family_2, action_0_0) /* forall<e> (root : internal/model/root<<ui|e>>, family : async-family<e>, action : () -> <pure,async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,effects/signal-read,effects/signal-write,ui|e> ()) -> <pure,effects/signal-read,effects/signal-write,ui|e> () */  {
   
  var runtime_1_14 = family_2;
  return $kokaine_async_effects.async_ioc_fs__handle($kokaine_async_effects._Hnd_async_ioc(1, $std_core_hnd.clause_tail1(function(host_action_2 /* () -> ui 5420 */ ) {
         
        var x_32_10774 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10248_0 /* hnd/ev-index */ ) {
            return _mlift_run_generation_async_with_family_10595(host_action_2, _y_x10248_0);
          });
        }
        else {
          return _mlift_run_generation_async_with_family_10595(host_action_2, x_32_10774);
        }
      }), function(m_0 /* hnd/marker<<div,exn,effects/signal-read,effects/signal-write,ui|7105>,()> */ , ev /* hnd/ev<async/effects/async-ioc> */ , x1_1 /* async/effects/async-scope */ , x2_1 /* () -> ui () */ ) {
        return $std_core_hnd.under2(ev, function(scope_1_1 /* async/effects/async-scope */ , host_action_0_1 /* () -> ui () */ ) {
             
            var x_33_10777 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10255_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10596(host_action_0_1, root_1_3, runtime_1_14, scope_1_1, _y_x10255_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10596(host_action_0_1, root_1_3, runtime_1_14, scope_1_1, x_33_10777);
            }
          }, x1_1, x2_1);
      }), function(_res_0 /* () */ ) {
      return _res_0;
    }, function() {
      return $kokaine_async_effects.async_ownership_fs__handle($kokaine_async_effects._Hnd_async_ownership(1, $std_core_hnd.clause_tail1(function(dispose_0_1 /* async/effects/dispose-fn */ ) {
             
            var x_34_10779 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10258_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10598(dispose_0_1, root_1_3, _y_x10258_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10598(dispose_0_1, root_1_3, x_34_10779);
            }
          })), function(_res_0_0 /* () */ ) {
          return _res_0_0;
        }, function() {
           
          var _value_async_scope_l875_c9 = $std_core_hnd._open_none1(function(_this_6 /* async-family<7105> */ ) {
              return _this_6.family_root_scope;
            }, family_2);
          return $kokaine_async_effects.async_cancel_fs__handle($kokaine_async_effects._Hnd_async_cancel(1, $std_core_hnd.clause_tail0(function() {
                return _value_async_scope_l875_c9;
              }), $std_core_hnd.clause_tail1(function(scope_0_1_3 /* async/effects/async-scope */ ) {
                 
                var x_35_10781 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10263_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10601(runtime_1_14, scope_0_1_3, _y_x10263_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10601(runtime_1_14, scope_0_1_3, x_35_10781);
                }
              }), $std_core_hnd.clause_tail1(function(scope_1_0_5 /* async/effects/async-scope */ ) {
                 
                var x_36_10783 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10270_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10606(runtime_1_14, scope_1_0_5, _y_x10270_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10606(runtime_1_14, scope_1_0_5, x_36_10783);
                }
              }), $std_core_hnd.clause_tail1(function(scope_2_4 /* async/effects/async-scope */ ) {
                 
                var x_37_10785 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10282_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10611(runtime_1_14, scope_2_4, _y_x10282_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10611(runtime_1_14, scope_2_4, x_37_10785);
                }
              })), function(_res_1 /* () */ ) {
              return _res_1;
            }, function() {
              return $kokaine_async_effects.discontinue_fs__handle($kokaine_async_effects._Hnd_discontinue(0, function(m_1 /* hnd/marker<<async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,div,exn,effects/signal-read,effects/signal-write,ui|7105>,()> */ , ___wildcard_x719__16 /* hnd/ev<async/effects/discontinue> */ ) {
                    return $std_core_hnd.yield_to_final(m_1, function(___wildcard_x719__43 /* (hnd/resume-result<5908,()>) -> <async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,div,exn,effects/signal-read,effects/signal-write,ui|7105> () */ ) {
                        return $std_core_types.Unit;
                      });
                  }), function(_res_2 /* () */ ) {
                  return _res_2;
                }, function() {
                  return interpret_generation_await(root_1_3, family_2, runtime_1_14, action_0_0);
                });
            });
        });
    });
}
 
export function resume_generation(root_2_0, family_3, action_1_0) /* forall<e> (root : internal/model/root<<ui|e>>, family : async-family<e>, action : () -> <pure,async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,effects/signal-read,effects/signal-write,ui|e> ()) -> <pure,effects/signal-read,effects/signal-write,ui|e> () */  {
  return run_generation_async_with_family(root_2_0, family_3, action_1_0);
}
 
export function run_task_result(task_1, family_4) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> <div,ui> () */  {
  var _x87 = task_1.task_state;
  var _x86 = $kokaine_async_internal_one_dash_shot_dash_task.load(_x87);
  if (_x86._tag === 2) {
    var _x85 = $std_core_types.Just(_x86.ready_payload);
  }
  else {
    var _x85 = $std_core_types.Nothing;
  }
  if (_x85 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var b_10130 = $kokaine_reactive_integration_internal_reentry.reentry_fs_can_run_live(_x85.value.payload_portal);
    if (b_10130) {
      var _x89 = task_1.task_state;
      var _x88 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_ready(_x89);
      if (_x88 === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var _x90 = task_1.task_cancel;
        var registration = $kokaine_reactive_internal_model.load(_x90);
         
        var _x91 = task_1.task_cancel;
        $kokaine_reactive_internal_model.store(_x91, $std_core_types.Nothing);
         
        if (registration === null) {
          $std_core_types.Unit;
        }
        else {
           
          var _x92 = registration.value;
          var maybe_10005 = $kokaine_internal_registry.registry_registration_fs_take(_x92);
          $std_core_types.Unit;
        }
         
        var current_0 = $kokaine_reactive_internal_model.load(outstanding_operations);
         
        var _x92 = ($std_core_types._int_le(current_0,0)) ? 0 : $std_core_types._int_sub(current_0,1);
        $kokaine_reactive_internal_model.store(outstanding_operations, _x92);
        return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_2 /* hnd/marker<ui,()> */ , ___wildcard_x672__16 /* hnd/ev<exn> */ , x_38 /* exception */ ) {
              return $std_core_hnd.yield_to_final(m_2, function(___wildcard_x672__45 /* (hnd/resume-result<22,()>) -> ui () */ ) {
                  var _x90 = x_38.message;
                  return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async exception (", $std_core_types._lp__plus__plus__rp_(_x88.value.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x90))));
                });
            }), function(_res_3 /* () */ ) {
            return _res_3;
          }, function() {
            if (_x88.value.claim_result === null) {
              var _x93 = $std_core_types.Unit;
            }
            else {
               
              var root_3_0 = $std_core_hnd._open_none1(function(value /* integration/internal/reentry/reentry<<ui|7121>> */ ) {
                  return value.reentry_root;
                }, _x88.value.claim_payload.payload_portal);
              var _x93 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_runner_fs_run($std_core_hnd._open_none1(function(_this_12 /* async-family<7121> */ ) {
                    return _this_12.family_runner;
                  }, family_4), function() {
                  return $kokaine_reactive_integration_internal_reentry.run_reentry(_x88.value.claim_payload.payload_portal, function() {
                      return resume_generation(root_3_0, family_4, function() {
                          return _x88.value.claim_payload.payload_resume(_x88.value.claim_result.value);
                        });
                    });
                });
            }
            return $std_core_hnd.finally_prompt(function() {
                 
                var _x_x1_10554 = $std_core_hnd._open_none1(function(_this_9 /* generation-task<7120,7121> */ ) {
                    return _this_9.task_state;
                  }, task_1);
                 
                var _pat_15_0_0 = $std_core_hnd._open_none1(function(task_3 /* async/internal/one-shot-task/one-shot-task<task-payload<7120,7121>,async/effects/await-result<7120>,async/effects/dispose-fn> */ ) {
                    var _x92 = task_3;
                    var _x91 = $kokaine_async_internal_one_dash_shot_dash_task.load(_x92);
                    if (_x91._tag === 3) {
                       
                      var _x93 = task_3;
                      $kokaine_async_internal_one_dash_shot_dash_task.store(_x93, $kokaine_async_internal_one_dash_shot_dash_task.Task_state_terminal($kokaine_async_internal_one_dash_shot_dash_task.Task_completed));
                      return true;
                    }
                    else {
                      return false;
                    }
                  }, _x_x1_10554);
                 
                var _x_x1_1_10556 = $std_core_hnd._open_none1(function(_this_11 /* generation-task<7120,7121> */ ) {
                    return _this_11.task_supervisor;
                  }, task_1);
                return $std_core_hnd._open_none1(function(supervisor_0_0 /* runtime-supervisor<7121> */ ) {
                    var _x92 = supervisor_0_0.supervisor_tasks;
                    var _x91 = $std_core_types._int_le(($kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_count(_x92)),0);
                    if (_x91) {
                      return runtime_supervisor_fs_detach(supervisor_0_0);
                    }
                    else {
                      return $std_core_types.Unit;
                    }
                  }, _x_x1_1_10556);
              }, _x93);
          });
      }
    }
    else {
       
      var retired = task_fs_claim_retired_ready(task_1, family_4);
      if (retired === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var actions_0_10132 = $std_core_types.Cons(retired.value, $std_core_types.Nil);
        return $std_core_hnd.finally_prompt(function() {
            return run_task_host_disposers(actions_0_10132);
          }, run_task_cancel_strands(actions_0_10132));
      }
    }
  }
}
 
export function stopped_task_cancellation(family_5, claim, reentry) /* forall<a,e> (family : async-family<e>, claim : async/internal/one-shot-task/task-claim<task-payload<a,e>,async/effects/await-result<a>,async/effects/dispose-fn>, reentry : cancellation-reentry) -> div task-cancellation */  {
  return Task_cancellation(function() {
      return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_3 /* hnd/marker<ui,()> */ , ___wildcard_x672__16_0 /* hnd/ev<exn> */ , x_39 /* exception */ ) {
            return $std_core_hnd.yield_to_final(m_3, function(___wildcard_x672__45_0 /* (hnd/resume-result<22,()>) -> ui () */ ) {
                var _x94 = x_39.message;
                return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async cancellation exception (", $std_core_types._lp__plus__plus__rp_(claim.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x94))));
              });
          }), function(_res_4 /* () */ ) {
          return _res_4;
        }, function() {
           
          var root_4_0 = $std_core_hnd._open_none1(function(value_0 /* integration/internal/reentry/reentry<<ui|7133>> */ ) {
              return value_0.reentry_root;
            }, claim.claim_payload.payload_portal);
          return $kokaine_reactive_async_internal_host_dash_turn.host_turn_runner_fs_run($std_core_hnd._open_none1(function(_this_13 /* async-family<7133> */ ) {
                return _this_13.family_runner;
              }, family_5), function() {
              if (reentry === 1) {
                return $kokaine_reactive_integration_internal_reentry.run_retirement_reentry(claim.claim_payload.payload_portal, function() {
                    return resume_generation(root_4_0, family_5, function() {
                        return claim.claim_payload.payload_resume($kokaine_async_effects.Cancel);
                      });
                  });
              }
              else {
                return $kokaine_reactive_integration_internal_reentry.run_cancellation_reentry(claim.claim_payload.payload_portal, function() {
                    return resume_generation(root_4_0, family_5, function() {
                        return claim.claim_payload.payload_resume($kokaine_async_effects.Cancel);
                      });
                  });
              }
            });
        });
    }, function() {
      if (claim.claim_disposer === null) {
        return $std_core_types.Unit;
      }
      else {
        return claim.claim_disposer.value();
      }
    });
}
 
export function task_fs_claim_detached_stop(task_2_0, family_6, reason, reentry_0) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>, reason : async/internal/one-shot-task/task-stop-reason, reentry : cancellation-reentry) -> div maybe<task-cancellation> */  {
  var _x96 = task_2_0.task_state;
  var _x95 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_stop(_x96, reason);
  if (_x95 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    task_fs_detach_cancellation(task_2_0);
     
    var current_0_0 = $kokaine_reactive_internal_model.load(outstanding_operations);
     
    var _x97 = ($std_core_types._int_le(current_0_0,0)) ? 0 : $std_core_types._int_sub(current_0_0,1);
    $kokaine_reactive_internal_model.store(outstanding_operations, _x97);
    return $std_core_types.Just(stopped_task_cancellation(family_6, _x95.value, reentry_0));
  }
}
 
export function task_fs_claim_dispatch_rejection(task_3_0, family_7) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
  return task_fs_claim_detached_stop(task_3_0, family_7, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled, Cancellation_live_or_retirement);
}
 
export function task_fs_claim_retired_ready(task_4, family_8) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
  return task_fs_claim_detached_stop(task_4, family_8, $kokaine_async_internal_one_dash_shot_dash_task.Task_retired, Cancellation_retirement);
}
 
export function task_fs_claim_stop(task_5, family_9) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
   
  var _x97 = task_5.task_supervisor.supervisor_reason;
  var reason_0 = $kokaine_reactive_internal_model.load(_x97);
  var _x98 = task_5.task_state;
  var _x97 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_stop(_x98, reason_0);
  if (_x97 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    var _x99 = task_5.task_cancel;
    $kokaine_reactive_internal_model.store(_x99, $std_core_types.Nothing);
     
    var current_1 = $kokaine_reactive_internal_model.load(outstanding_operations);
     
    var _x100 = ($std_core_types._int_le(current_1,0)) ? 0 : $std_core_types._int_sub(current_1,1);
    $kokaine_reactive_internal_model.store(outstanding_operations, _x100);
    return $std_core_types.Just(stopped_task_cancellation(family_9, _x97.value, Cancellation_retirement));
  }
}
 
 
// // Scheduled host actions are ordinary generation-owned tasks. Keep their
// // structural phase evidence live through registration; erasing it would make
// // owner cleanup masks invalid at runtime on Koka's JavaScript backend.
// //
// // A scheduled action is ready as soon as it is scheduled, so setup completes
// // the task synchronously: the task becomes Ready and the dispatcher posts the
// // one turn which runs the action in a fresh re-entry batch. Cancellation and
// // retirement claim the Ready task exactly as they claimed the Pending one,
// // and a dispatcher rejection cancels it through the ordinary Ready path.
export function register_scheduled_ioc(root_5, runtime_2_0, scope_3_0, host_action_1_0) /* forall<e> (root : internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : async/effects/async-scope, host-action : () -> ui ()) -> <pure,effects/signal-write,ui|e> () */  {
  return register_task(root_5, runtime_2_0, scope_3_0, "scheduled host action", function(resume /* (async/effects/await-result<()>) -> ui () */ ) {
       
      resume($kokaine_async_effects.Result($std_core_types.Unit));
      return $std_core_types.Ok(function() {
        return $std_core_types.Unit;
      });
    }, function(result_3 /* async/effects/await-result<()> */ ) {
      if (result_3._tag === 1) {
        return $std_core_hnd._open_none0(host_action_1_0);
      }
      else {
        return $std_core_types.Unit;
      }
    });
}
 
export function generation_async_outstanding() /* () -> int */  {
  return $kokaine_reactive_internal_model.load(outstanding_operations);
}
 
export function new_async_lease_group() /* () -> async-lease-group */  {
  return $kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0));
}
 
export function async_lease_group_fs_has_linked_entries(group) /* (group : async-lease-group) -> bool */  {
  return $kokaine_internal_registry.registry_fs_has_linked_nodes(group);
}
 
export function async_lease_release(registration) /* (registration : internal/registry/registry-registration<async/effects/dispose-fn>) -> async/effects/ownership-release-fn */  {
  return function() {
    var _x99 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    if (_x99 === null) {
      return false;
    }
    else {
       
      var current = $kokaine_reactive_internal_model.load(outstanding_operations);
       
      var _x100 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
      $kokaine_reactive_internal_model.store(outstanding_operations, _x100);
      return true;
    }
  };
}
 
export function async_lease_group_fs_own(group, dispose) /* (group : async-lease-group, dispose : async/effects/dispose-fn) -> ui async/effects/ownership-release-fn */  {
  var _x100 = $kokaine_internal_registry.registry_fs_try_insert(group, dispose);
  if (_x100 === null) {
     
    dispose();
    return function() {
      return false;
    };
  }
  else {
     
    var x_10157 = $kokaine_reactive_internal_model.load(outstanding_operations);
     
    $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_10157,1));
    return async_lease_release(_x100.value);
  }
}
 
export function account_async_lease_disposers(disposers) /* (disposers : list<async/effects/dispose-fn>) -> () */  {
  return function() {
     
    var loc = { value: disposers };
     
    var res = $std_core.$while(function() {
         
        var list_10162 = ((loc).value);
        return (list_10162 === null) ? false : true;
      }, function() {
        var _x101 = ((loc).value);
        if (_x101 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x101.tail));
           
          var current = $kokaine_reactive_internal_model.load(outstanding_operations);
          var _x102 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
          return $kokaine_reactive_internal_model.store(outstanding_operations, _x102);
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function run_async_lease_disposers(disposers) /* (disposers : list<async/effects/dispose-fn>) -> ui () */  {
  return function() {
     
    var loc = { value: disposers };
     
    var res = $std_core.$while(function() {
         
        var list_10168 = ((loc).value);
        return (list_10168 === null) ? false : true;
      }, function() {
        var _x101 = ((loc).value);
        if (_x101 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x101.tail));
          return _x101.head();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function async_lease_group_fs_dispose(group) /* (group : async-lease-group) -> ui () */  {
  var _x101 = $kokaine_internal_registry.registry_fs_seal_detach(group);
  if (_x101 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    account_async_lease_disposers(_x101.value);
    return run_async_lease_disposers(_x101.value);
  }
}
 
export function run_generation_async_with_host(root, dispatcher, runner, action) /* forall<e> (root : internal/model/root<<ui|e>>, dispatcher : host-turn/host-turn-dispatcher, runner : host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>, action : () -> <async/effects/async,effects/signal-read,effects/signal-write,pure,ui|e> ()) -> <effects/signal-read,effects/signal-write,pure,ui|e> () */  {
  return run_generation_async_with_family(root, Async_family($std_core_hnd._open_none0(function() {
        return $kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0));
      }), $std_core_hnd._open_none0($kokaine_internal_int_dash_index.new_int_index), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nil), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false), $std_core_hnd._open_none0($kokaine_async_effects.new_runtime_scope_root), dispatcher, runner), action);
}