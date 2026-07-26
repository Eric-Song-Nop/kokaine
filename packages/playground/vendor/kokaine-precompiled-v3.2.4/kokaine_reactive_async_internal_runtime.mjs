// Koka generated module: kokaine/reactive/async/internal/runtime, koka version: 3.2.4
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
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_integration_internal_reentry from './kokaine_reactive_integration_internal_reentry.mjs';
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
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
export function Task_cancellation(cancellation_strand, cancellation_dispose) /* (cancellation-strand : task-cancel-strand, cancellation-dispose : kokaine/async/effects/dispose-fn) -> task-cancellation */  {
  return { cancellation_strand: cancellation_strand, cancellation_dispose: cancellation_dispose };
}
// type runtime-supervisor
export function Runtime_supervisor(supervisor_scope, supervisor_tasks, supervisor_reason, supervisor_owner, supervisor_family, supervisor_bucket_link) /* forall<e> (supervisor-scope : kokaine/async/effects/async-scope, supervisor-tasks : kokaine/async/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation>, supervisor-reason : ref<global,kokaine/async/internal/one-shot-task/task-stop-reason>, supervisor-owner : ref<global,maybe<kokaine/reactive/internal/model/cleanup-registration<<ui|e>>>>, supervisor-family : ref<global,maybe<kokaine/internal/registry/registry-registration<runtime-supervisor<e>>>>, supervisor-bucket-link : ref<global,maybe<runtime-supervisor-bucket-link<e>>>) -> runtime-supervisor<e> */  {
  return { supervisor_scope: supervisor_scope, supervisor_tasks: supervisor_tasks, supervisor_reason: supervisor_reason, supervisor_owner: supervisor_owner, supervisor_family: supervisor_family, supervisor_bucket_link: supervisor_bucket_link };
}
// type runtime-supervisor-bucket
export function Runtime_supervisor_bucket(bucket_supervisors, bucket_index) /* forall<e> (bucket-supervisors : kokaine/internal/registry/registry<runtime-supervisor<e>>, bucket-index : ref<global,maybe<kokaine/internal/int-index/int-index-registration<runtime-supervisor-bucket<e>>>>) -> runtime-supervisor-bucket<e> */  {
  return { bucket_supervisors: bucket_supervisors, bucket_index: bucket_index };
}
// type runtime-supervisor-bucket-link
export function Runtime_supervisor_bucket_link(link_frame, link_bucket, link_registration) /* forall<e> (link-frame : kokaine/reactive/internal/model/frame<<ui|e>>, link-bucket : runtime-supervisor-bucket<e>, link-registration : kokaine/internal/registry/registry-registration<runtime-supervisor<e>>) -> runtime-supervisor-bucket-link<e> */  {
  return { link_frame: link_frame, link_bucket: link_bucket, link_registration: link_registration };
}
// type async-family
export function Async_family(family_supervisors, family_index, family_canceled, family_root_scope, family_dispatcher, family_runner) /* forall<e> (family-supervisors : kokaine/internal/registry/registry<runtime-supervisor<e>>, family-index : kokaine/internal/int-index/int-index<runtime-supervisor-bucket<e>>, family-canceled : ref<global,list<kokaine/async/effects/async-scope>>, family-root-scope : kokaine/async/effects/async-scope, family-dispatcher : kokaine/reactive/async/internal/host-turn/host-turn-dispatcher, family-runner : kokaine/reactive/async/internal/host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>) -> async-family<e> */  {
  return { family_supervisors: family_supervisors, family_index: family_index, family_canceled: family_canceled, family_root_scope: family_root_scope, family_dispatcher: family_dispatcher, family_runner: family_runner };
}
// type async-lease-group
export function Async_lease_group(lease_group_entries) /* (lease-group-entries : kokaine/internal/registry/registry<kokaine/async/effects/dispose-fn>) -> async-lease-group */  {
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
export function Task_payload(payload_portal, payload_resume, payload_label) /* forall<a,e> (payload-portal : kokaine/reactive/integration/internal/reentry/reentry<<ui|e>>, payload-resume : taskresume<e,a>, payload-label : string) -> task-payload<a,e> */  {
  return { payload_portal: payload_portal, payload_resume: payload_resume, payload_label: payload_label };
}
// type generation-task
export function Generation_task(task_state, task_supervisor, task_cancel) /* forall<a,e> (task-state : kokaine/async/internal/one-shot-task/one-shot-task<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn>, task-supervisor : runtime-supervisor<e>, task-cancel : ref<global,maybe<kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>>>) -> generation-task<a,e> */  {
  return { task_state: task_state, task_supervisor: task_supervisor, task_cancel: task_cancel };
}
 
// declarations
 
 
// Automatically generated. Retrieves the `cancellation-strand` constructor field of the `:task-cancellation` type.
export function task_cancellation_fs_cancellation_strand(_this) /* (task-cancellation) -> task-cancel-strand */  {
  return _this.cancellation_strand;
}
 
 
// Automatically generated. Retrieves the `cancellation-dispose` constructor field of the `:task-cancellation` type.
export function task_cancellation_fs_cancellation_dispose(_this) /* (task-cancellation) -> kokaine/async/effects/dispose-fn */  {
  return _this.cancellation_dispose;
}
 
export function task_cancellation_fs__copy(_this, cancellation_strand, cancellation_dispose) /* (task-cancellation, cancellation-strand : ? task-cancel-strand, cancellation-dispose : ? kokaine/async/effects/dispose-fn) -> task-cancellation */  {
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
 
 
// Automatically generated. Tests for the `Cancellation-retirement` constructor of the `:cancellation-reentry` type.
export function is_cancellation_retirement(cancellation_reentry) /* (cancellation-reentry : cancellation-reentry) -> bool */  {
  return (cancellation_reentry === 1);
}
 
 
// Automatically generated. Tests for the `Cancellation-live-or-retirement` constructor of the `:cancellation-reentry` type.
export function is_cancellation_live_or_retirement(cancellation_reentry) /* (cancellation-reentry : cancellation-reentry) -> bool */  {
  return (cancellation_reentry === 2);
}
 
 
// Automatically generated. Retrieves the `payload-portal` constructor field of the `:task-payload` type.
export function task_payload_fs_payload_portal(_this) /* forall<a,e> (task-payload<a,e>) -> kokaine/reactive/integration/internal/reentry/reentry<<ui|e>> */  {
  return _this.payload_portal;
}
 
 
// Automatically generated. Retrieves the `payload-resume` constructor field of the `:task-payload` type.
export function task_payload_fs_payload_resume(_this) /* forall<a,e> (task-payload<a,e>) -> taskresume<e,a> */  {
  return _this.payload_resume;
}
 
 
// Automatically generated. Retrieves the `payload-label` constructor field of the `:task-payload` type.
export function task_payload_fs_payload_label(_this) /* forall<a,e> (task-payload<a,e>) -> string */  {
  return _this.payload_label;
}
 
 
// monadic lift
export function task_payload_fs__mlift_copy_10492(_this, payload_label, payload_portal, _c_x10174) /* forall<a,e> (task-payload<a,e>, payload-label : ? string, payload-portal : ? (kokaine/reactive/integration/internal/reentry/reentry<<ui|e>>), taskresume<e,a>) -> task-payload<a,e> */  {
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
  return Task_payload(_x2, _c_x10174, _x3);
}
 
export function task_payload_fs__copy(_this, payload_portal, payload_resume, payload_label) /* forall<a,e> (task-payload<a,e>, payload-portal : ? (kokaine/reactive/integration/internal/reentry/reentry<<ui|e>>), payload-resume : ? (taskresume<e,a>), payload-label : ? string) -> task-payload<a,e> */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10174 /* taskresume<701,700> */ ) {
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
      return Task_payload(_x4, _c_x10174, _x5);
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
 
 
// Automatically generated. Retrieves the `supervisor-scope` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_scope(_this) /* forall<e> (runtime-supervisor<e>) -> kokaine/async/effects/async-scope */  {
  return _this.supervisor_scope;
}
 
 
// Automatically generated. Retrieves the `supervisor-tasks` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_tasks(_this) /* forall<e> (runtime-supervisor<e>) -> kokaine/async/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation> */  {
  return _this.supervisor_tasks;
}
 
 
// Automatically generated. Retrieves the `supervisor-reason` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_reason(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,kokaine/async/internal/one-shot-task/task-stop-reason> */  {
  return _this.supervisor_reason;
}
 
 
// Automatically generated. Retrieves the `supervisor-owner` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_owner(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,maybe<kokaine/reactive/internal/model/cleanup-registration<<ui|e>>>> */  {
  return _this.supervisor_owner;
}
 
 
// Automatically generated. Retrieves the `supervisor-family` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_family(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,maybe<kokaine/internal/registry/registry-registration<runtime-supervisor<e>>>> */  {
  return _this.supervisor_family;
}
 
 
// Automatically generated. Retrieves the `supervisor-bucket-link` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_bucket_link(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,maybe<runtime-supervisor-bucket-link<e>>> */  {
  return _this.supervisor_bucket_link;
}
 
export function runtime_supervisor_fs__copy(_this, supervisor_scope, supervisor_tasks, supervisor_reason, supervisor_owner, supervisor_family, supervisor_bucket_link) /* forall<e> (runtime-supervisor<e>, supervisor-scope : ? kokaine/async/effects/async-scope, supervisor-tasks : ? (kokaine/async/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation>), supervisor-reason : ? (ref<global,kokaine/async/internal/one-shot-task/task-stop-reason>), supervisor-owner : ? (ref<global,maybe<kokaine/reactive/internal/model/cleanup-registration<<ui|e>>>>), supervisor-family : ? (ref<global,maybe<kokaine/internal/registry/registry-registration<runtime-supervisor<e>>>>), supervisor-bucket-link : ? (ref<global,maybe<runtime-supervisor-bucket-link<e>>>)) -> runtime-supervisor<e> */  {
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
 
 
// Automatically generated. Retrieves the `bucket-supervisors` constructor field of the `:runtime-supervisor-bucket` type.
export function runtime_supervisor_bucket_fs_bucket_supervisors(_this) /* forall<e> (runtime-supervisor-bucket<e>) -> kokaine/internal/registry/registry<runtime-supervisor<e>> */  {
  return _this.bucket_supervisors;
}
 
 
// Automatically generated. Retrieves the `bucket-index` constructor field of the `:runtime-supervisor-bucket` type.
export function runtime_supervisor_bucket_fs_bucket_index(_this) /* forall<e> (runtime-supervisor-bucket<e>) -> ref<global,maybe<kokaine/internal/int-index/int-index-registration<runtime-supervisor-bucket<e>>>> */  {
  return _this.bucket_index;
}
 
export function runtime_supervisor_bucket_fs__copy(_this, bucket_supervisors, bucket_index) /* forall<e> (runtime-supervisor-bucket<e>, bucket-supervisors : ? (kokaine/internal/registry/registry<runtime-supervisor<e>>), bucket-index : ? (ref<global,maybe<kokaine/internal/int-index/int-index-registration<runtime-supervisor-bucket<e>>>>)) -> runtime-supervisor-bucket<e> */  {
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
 
 
// Automatically generated. Retrieves the `link-frame` constructor field of the `:runtime-supervisor-bucket-link` type.
export function runtime_supervisor_bucket_link_fs_link_frame(_this) /* forall<e> (runtime-supervisor-bucket-link<e>) -> kokaine/reactive/internal/model/frame<<ui|e>> */  {
  return _this.link_frame;
}
 
 
// Automatically generated. Retrieves the `link-bucket` constructor field of the `:runtime-supervisor-bucket-link` type.
export function runtime_supervisor_bucket_link_fs_link_bucket(_this) /* forall<e> (runtime-supervisor-bucket-link<e>) -> runtime-supervisor-bucket<e> */  {
  return _this.link_bucket;
}
 
 
// Automatically generated. Retrieves the `link-registration` constructor field of the `:runtime-supervisor-bucket-link` type.
export function runtime_supervisor_bucket_link_fs_link_registration(_this) /* forall<e> (runtime-supervisor-bucket-link<e>) -> kokaine/internal/registry/registry-registration<runtime-supervisor<e>> */  {
  return _this.link_registration;
}
 
export function runtime_supervisor_bucket_link_fs__copy(_this, link_frame, link_bucket, link_registration) /* forall<e> (runtime-supervisor-bucket-link<e>, link-frame : ? (kokaine/reactive/internal/model/frame<<ui|e>>), link-bucket : ? (runtime-supervisor-bucket<e>), link-registration : ? (kokaine/internal/registry/registry-registration<runtime-supervisor<e>>)) -> runtime-supervisor-bucket-link<e> */  {
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
 
 
// Automatically generated. Retrieves the `task-state` constructor field of the `:generation-task` type.
export function generation_task_fs_task_state(_this) /* forall<a,e> (generation-task<a,e>) -> kokaine/async/internal/one-shot-task/one-shot-task<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn> */  {
  return _this.task_state;
}
 
 
// Automatically generated. Retrieves the `task-supervisor` constructor field of the `:generation-task` type.
export function generation_task_fs_task_supervisor(_this) /* forall<a,e> (generation-task<a,e>) -> runtime-supervisor<e> */  {
  return _this.task_supervisor;
}
 
 
// Automatically generated. Retrieves the `task-cancel` constructor field of the `:generation-task` type.
export function generation_task_fs_task_cancel(_this) /* forall<a,e> (generation-task<a,e>) -> ref<global,maybe<kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>>> */  {
  return _this.task_cancel;
}
 
export function generation_task_fs__copy(_this, task_state, task_supervisor, task_cancel) /* forall<a,e> (generation-task<a,e>, task-state : ? (kokaine/async/internal/one-shot-task/one-shot-task<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn>), task-supervisor : ? (runtime-supervisor<e>), task-cancel : ? (ref<global,maybe<kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>>>)) -> generation-task<a,e> */  {
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
 
 
// Automatically generated. Retrieves the `family-supervisors` constructor field of the `:async-family` type.
export function async_family_fs_family_supervisors(_this) /* forall<e> (async-family<e>) -> kokaine/internal/registry/registry<runtime-supervisor<e>> */  {
  return _this.family_supervisors;
}
 
 
// Automatically generated. Retrieves the `family-index` constructor field of the `:async-family` type.
export function async_family_fs_family_index(_this) /* forall<e> (async-family<e>) -> kokaine/internal/int-index/int-index<runtime-supervisor-bucket<e>> */  {
  return _this.family_index;
}
 
 
// Automatically generated. Retrieves the `family-canceled` constructor field of the `:async-family` type.
export function async_family_fs_family_canceled(_this) /* forall<e> (async-family<e>) -> ref<global,list<kokaine/async/effects/async-scope>> */  {
  return _this.family_canceled;
}
 
 
// Automatically generated. Retrieves the `family-root-scope` constructor field of the `:async-family` type.
export function async_family_fs_family_root_scope(_this) /* forall<e> (async-family<e>) -> kokaine/async/effects/async-scope */  {
  return _this.family_root_scope;
}
 
 
// Automatically generated. Retrieves the `family-dispatcher` constructor field of the `:async-family` type.
export function async_family_fs_family_dispatcher(_this) /* forall<e> (async-family<e>) -> kokaine/reactive/async/internal/host-turn/host-turn-dispatcher */  {
  return _this.family_dispatcher;
}
 
 
// Automatically generated. Retrieves the `family-runner` constructor field of the `:async-family` type.
export function async_family_fs_family_runner(_this) /* forall<e> (async-family<e>) -> kokaine/reactive/async/internal/host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>> */  {
  return _this.family_runner;
}
 
export function async_family_fs__copy(_this, family_supervisors, family_index, family_canceled, family_root_scope, family_dispatcher, family_runner) /* forall<e> (async-family<e>, family-supervisors : ? (kokaine/internal/registry/registry<runtime-supervisor<e>>), family-index : ? (kokaine/internal/int-index/int-index<runtime-supervisor-bucket<e>>), family-canceled : ? (ref<global,list<kokaine/async/effects/async-scope>>), family-root-scope : ? kokaine/async/effects/async-scope, family-dispatcher : ? kokaine/reactive/async/internal/host-turn/host-turn-dispatcher, family-runner : ? (kokaine/reactive/async/internal/host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>)) -> async-family<e> */  {
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
  if (family_root_scope !== undefined) {
    var _x26 = family_root_scope;
  }
  else {
    var _x26 = _this.family_root_scope;
  }
  if (family_dispatcher !== undefined) {
    var _x27 = family_dispatcher;
  }
  else {
    var _x27 = _this.family_dispatcher;
  }
  if (family_runner !== undefined) {
    var _x28 = family_runner;
  }
  else {
    var _x28 = _this.family_runner;
  }
  return Async_family(_x23, _x24, _x25, _x26, _x27, _x28);
}
 
 
// Automatically generated. Retrieves the `runtime-family` constructor field of the `:generation-runtime` type.
export function generation_runtime_fs_runtime_family(_this) /* forall<e> (generation-runtime<e>) -> async-family<e> */  {
  return _this;
}
 
export function generation_runtime_fs__copy(_this, runtime_family) /* forall<e> (generation-runtime<e>, runtime-family : ? (async-family<e>)) -> generation-runtime<e> */  {
  if (runtime_family !== undefined) {
    var _x29 = runtime_family;
  }
  else {
    var _x29 = _this;
  }
  return _x29;
}
 
 
// A debug-only aggregate is intentionally not an ownership index. Task cells
// remain owned exclusively by frames and lexical cancellation scopes.
export var outstanding_operations;
var outstanding_operations = { value: 0 };
 
 
// Automatically generated. Retrieves the `lease-group-entries` constructor field of the `:async-lease-group` type.
export function async_lease_group_fs_lease_group_entries(_this) /* (async-lease-group) -> kokaine/internal/registry/registry<kokaine/async/effects/dispose-fn> */  {
  return _this;
}
 
export function async_lease_group_fs__copy(_this, lease_group_entries) /* (async-lease-group, lease-group-entries : ? (kokaine/internal/registry/registry<kokaine/async/effects/dispose-fn>)) -> async-lease-group */  {
  if (lease_group_entries !== undefined) {
    var _x30 = lease_group_entries;
  }
  else {
    var _x30 = _this;
  }
  return _x30;
}
 
export function report_async_error(message) /* (message : string) -> ui () */  {
  return console.error(message);
}
 
 
// `accept-task-result` is operationally a finite `ui` callback (cell updates
// plus host-turn enqueue). Its `div` label only closes the recursive type SCC
// formed by the parked continuation and the next generation handler.
export function as_host_action(action) /* (action : () -> <div,ui> ()) -> (() -> ui ()) */  {
  return action;
}
 
export function increment_outstanding() /* () -> () */  {
   
  var x_10031 = outstanding_operations.value;
   
  var value_10030 = $std_core_types._int_add(x_10031,1);
  return ((outstanding_operations).value = value_10030);
}
 
export function decrement_outstanding() /* () -> () */  {
   
  var current = outstanding_operations.value;
   
  var value_0_10036 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
  return ((outstanding_operations).value = value_0_10036);
}
 
export function async_lease_group_fs_count(group) /* (group : async-lease-group) -> int */  {
  return (group.registry_count).value;
}
 
 
// Keep row-polymorphic family internals out of generated Koka 3.2 `.kki`
// inline bodies; its interface printer otherwise emits an unparseable cache.
export function async_family_fs_scope_is_within(family, child, ancestor) /* forall<e> (family : async-family<e>, child : kokaine/async/effects/async-scope, ancestor : kokaine/async/effects/async-scope) -> bool */  {
  var _x32 = family.family_root_scope;
  var _x31 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(ancestor, _x32);
  if (_x31) {
    return true;
  }
  else {
    return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(child, ancestor);
  }
}
 
export function runtime_fs_is_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> bool */  {
  var _x33 = runtime.family_canceled;
  return $std_core_list.any(_x33.value, function(canceled /* kokaine/async/effects/async-scope */ ) {
      var _x35 = runtime.family_root_scope;
      var _x34 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(canceled, _x35);
      if (_x34) {
        return true;
      }
      else {
        return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(scope, canceled);
      }
    });
}
 
export function runtime_fs_record_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
  var _x36 = runtime_fs_is_canceled(runtime, scope);
  if (_x36) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x37 = runtime.family_canceled;
    var value_10051 = $std_core_types.Cons(scope, _x37.value);
    var _x37 = runtime.family_canceled;
    return ((_x37).value = value_10051);
  }
}
 
 
// Exact removal matters for nested cancellation: releasing a drained child
// must not revive it while an enclosing canceled scope is still live.
export function runtime_fs_release_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
   
  var _x38 = runtime.family_canceled;
  var value_10056 = $std_core_list.filter(_x38.value, function(current /* kokaine/async/effects/async-scope */ ) {
       
      var b_10058 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(current, scope);
      return (b_10058) ? false : true;
    });
  var _x38 = runtime.family_canceled;
  return ((_x38).value = value_10056);
}
 
 
// monadic lift
export function runtime_supervisor_fs__mlift_detach_10493(_c_x10182) /* (bool) -> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function runtime_supervisor_fs__mlift_detach_10494(supervisor, _c_x10183) /* forall<_e,_e1,e2> (supervisor : runtime-supervisor<e2>, ()) -> () */  {
   
  var _x39 = supervisor.supervisor_family;
  var family = _x39.value;
   
  var _x40 = supervisor.supervisor_family;
  ((_x40).value = ($std_core_types.Nothing));
  if (family === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _pat_14_0 = $kokaine_internal_registry.registry_registration_fs_take(family.value);
    return $std_core_types.Unit;
  }
}
 
 
// monadic lift
export function runtime_supervisor_fs__mlift_detach_10495(bucket, _c_x10179) /* forall<_e,_e1,e2> (bucket : runtime-supervisor-bucket<e2>, int) -> () */  {
  if ($std_core_types._int_le(_c_x10179,0)) {
     
    var _x39 = bucket.bucket_index;
    var index = _x39.value;
     
    var _x40 = bucket.bucket_index;
    ((_x40).value = ($std_core_types.Nothing));
    if (index === null) {
      return $std_core_types.Unit;
    }
    else {
       
      var _pat_7_0 = $kokaine_internal_int_dash_index.int_index_registration_fs_take(index.value);
      return $std_core_types.Unit;
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// monadic lift
export function runtime_supervisor_fs__mlift_detach_10496(supervisor, _c_x10181) /* forall<_e,_e1,e2> (supervisor : runtime-supervisor<e2>, ()) -> () */  {
   
  var _x39 = supervisor.supervisor_owner;
  var owner = _x39.value;
   
  var _x40 = supervisor.supervisor_owner;
  ((_x40).value = ($std_core_types.Nothing));
   
  if (owner === null) {
    var x_10548 = $std_core_types.Unit;
  }
  else {
     
    var _x42 = owner.value.cleanup_node;
    var _x41 = $kokaine_internal_registry.registry_registration_fs_take(_x42);
    if (_x41 === null) {
      var x_0_10550 = false;
    }
    else {
       
      var _x43 = owner.value.cleanup_resource;
      var maybe_10016 = $kokaine_reactive_internal_resource.claim_resource(_x43);
      var x_0_10550 = (maybe_10016 !== null);
    }
    if ($std_core_hnd._yielding()) {
      var x_10548 = $std_core_hnd.yield_extend(runtime_supervisor_fs__mlift_detach_10493);
    }
    else {
      var x_10548 = $std_core_types.Unit;
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10183 /* () */ ) {
      return runtime_supervisor_fs__mlift_detach_10494(supervisor, _c_x10183);
    });
  }
  else {
    return runtime_supervisor_fs__mlift_detach_10494(supervisor, x_10548);
  }
}
 
export function runtime_supervisor_fs_detach(supervisor) /* forall<e> (supervisor : runtime-supervisor<e>) -> () */  {
   
  var _x39 = supervisor.supervisor_bucket_link;
  var link = _x39.value;
   
  var _x40 = supervisor.supervisor_bucket_link;
  ((_x40).value = ($std_core_types.Nothing));
   
  if (link === null) {
    var x_10552 = $std_core_types.Unit;
  }
  else {
     
    var _pat_3_1 = $kokaine_internal_registry.registry_registration_fs_take(link.value.link_registration);
     
    var x_0_10555 = (link.value.link_bucket.bucket_supervisors.registry_count).value;
    if ($std_core_hnd._yielding()) {
      var x_10552 = $std_core_hnd.yield_extend(function(_c_x10179 /* int */ ) {
        return runtime_supervisor_fs__mlift_detach_10495(link.value.link_bucket, _c_x10179);
      });
    }
    else {
      var x_10552 = runtime_supervisor_fs__mlift_detach_10495(link.value.link_bucket, x_0_10555);
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10181 /* () */ ) {
      return runtime_supervisor_fs__mlift_detach_10496(supervisor, _c_x10181);
    });
  }
  else {
     
    var _x39 = supervisor.supervisor_owner;
    var owner = _x39.value;
     
    var _x40 = supervisor.supervisor_owner;
    ((_x40).value = ($std_core_types.Nothing));
     
    if (owner === null) {
      var x_1_10557 = $std_core_types.Unit;
    }
    else {
       
      var _x42 = owner.value.cleanup_node;
      var _x41 = $kokaine_internal_registry.registry_registration_fs_take(_x42);
      if (_x41 === null) {
        var x_2_10560 = false;
      }
      else {
         
        var _x43 = owner.value.cleanup_resource;
        var maybe_10016 = $kokaine_reactive_internal_resource.claim_resource(_x43);
        var x_2_10560 = (maybe_10016 !== null);
      }
      if ($std_core_hnd._yielding()) {
        var x_1_10557 = $std_core_hnd.yield_extend(runtime_supervisor_fs__mlift_detach_10493);
      }
      else {
        var x_1_10557 = $std_core_types.Unit;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10183 /* () */ ) {
        return runtime_supervisor_fs__mlift_detach_10494(supervisor, _c_x10183);
      });
    }
    else {
       
      var _x39 = supervisor.supervisor_family;
      var family = _x39.value;
       
      var _x40 = supervisor.supervisor_family;
      ((_x40).value = ($std_core_types.Nothing));
      if (family === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var _pat_14_0 = $kokaine_internal_registry.registry_registration_fs_take(family.value);
        return $std_core_types.Unit;
      }
    }
  }
}
 
export function runtime_supervisor_fs_claim(supervisor, reason) /* forall<e> (supervisor : runtime-supervisor<e>, reason : kokaine/async/internal/one-shot-task/task-stop-reason) -> list<task-cancellation> */  {
   
  var _x39 = supervisor.supervisor_reason;
  ((_x39).value = reason);
  var _x40 = supervisor.supervisor_tasks;
  var _x39 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x40);
  if (_x39 === null) {
    return $std_core_types.Nil;
  }
  else {
     
    runtime_supervisor_fs_detach(supervisor);
    return _x39.value;
  }
}
 
export function run_task_cancel_strands(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10089 = ((loc).value);
        return (list_10089 === null) ? false : true;
      }, function() {
        var _x41 = ((loc).value);
        if (_x41 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x41.tail));
          return _x41.head.cancellation_strand();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function run_task_host_disposers(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10093 = ((loc).value);
        return (list_10093 === null) ? false : true;
      }, function() {
        var _x41 = ((loc).value);
        if (_x41 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x41.tail));
          return _x41.head.cancellation_dispose();
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
  return Runtime_supervisor_bucket($kokaine_internal_registry.new_registry(), { value: ($std_core_types.Nothing) });
}
 
export function runtime_supervisor_bucket_fs_find_frame(bucket, current) /* forall<e> (bucket : runtime-supervisor-bucket<e>, current : kokaine/reactive/internal/model/frame<<ui|e>>) -> maybe<runtime-supervisor<e>> */  {
  var _x41 = bucket.bucket_supervisors;
  return $kokaine_internal_registry.registry_fs_find_readonly(_x41, function(supervisor /* runtime-supervisor<2912> */ ) {
      var _x43 = supervisor.supervisor_bucket_link;
      var _x42 = _x43.value;
      if (_x42 === null) {
        return false;
      }
      else {
        var _x44 = _x42.value.link_frame.lifetime_token;
        var _x45 = current.lifetime_token;
        return Object.is(_x44,_x45);
      }
    });
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10497(bucket, current, supervisor, bucket_registration) /* forall<_e,e1> (bucket : runtime-supervisor-bucket<e1>, current : kokaine/reactive/internal/model/frame<<ui|e1>>, supervisor : runtime-supervisor<e1>, bucket-registration : kokaine/internal/registry/registry-registration<runtime-supervisor<e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_3_10346 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<3114> */ ) {
      return _this_3.supervisor_bucket_link;
    }, supervisor);
   
  ((target_3_10346).value = ($std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, bucket_registration))));
  return supervisor;
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10498(bucket, current, supervisor, family_registration) /* forall<_e,e1> (bucket : runtime-supervisor-bucket<e1>, current : kokaine/reactive/internal/model/frame<<ui|e1>>, supervisor : runtime-supervisor<e1>, family-registration : kokaine/internal/registry/registry-registration<runtime-supervisor<e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_1_10340 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<3114> */ ) {
      return _this_1.supervisor_family;
    }, supervisor);
   
  ((target_1_10340).value = ($std_core_types.Just(family_registration)));
   
  var _x_x1_7_10431 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor-bucket<3114> */ ) {
      return _this_2.bucket_supervisors;
    }, bucket);
   
  var x_10568 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_2 /* kokaine/internal/registry/registry<runtime-supervisor<3114>> */ , value_6 /* runtime-supervisor<3114> */ ) {
      var _x46 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_2, value_6);
      if (_x46 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x46.value;
      }
    }, _x_x1_7_10431, supervisor);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(bucket_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<3114>> */ ) {
      return _mlift_new_runtime_supervisor_10497(bucket, current, supervisor, bucket_registration);
    });
  }
  else {
    return _mlift_new_runtime_supervisor_10497(bucket, current, supervisor, x_10568);
  }
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10499(bucket, current, family, supervisor, owner) /* forall<_e,e1> (bucket : runtime-supervisor-bucket<e1>, current : kokaine/reactive/internal/model/frame<<ui|e1>>, family : async-family<e1>, supervisor : runtime-supervisor<e1>, owner : kokaine/reactive/internal/model/cleanup-registration<<ui|e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_10334 = $std_core_hnd._open_none1(function(_this /* runtime-supervisor<3114> */ ) {
      return _this.supervisor_owner;
    }, supervisor);
   
  ((target_10334).value = ($std_core_types.Just(owner)));
   
  var _x_x1_3_10425 = $std_core_hnd._open_none1(function(_this_0 /* async-family<3114> */ ) {
      return _this_0.family_supervisors;
    }, family);
   
  var x_10570 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* kokaine/internal/registry/registry<runtime-supervisor<3114>> */ , value_4 /* runtime-supervisor<3114> */ ) {
      var _x46 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_4);
      if (_x46 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x46.value;
      }
    }, _x_x1_3_10425, supervisor);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(family_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<3114>> */ ) {
      return _mlift_new_runtime_supervisor_10498(bucket, current, supervisor, family_registration);
    });
  }
  else {
    return _mlift_new_runtime_supervisor_10498(bucket, current, supervisor, x_10570);
  }
}
 
export function new_runtime_supervisor(root, family, scope, current, bucket) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, family : async-family<e>, scope : kokaine/async/effects/async-scope, current : kokaine/reactive/internal/model/frame<<ui|e>>, bucket : runtime-supervisor-bucket<e>) -> <kokaine/reactive/effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var supervisor = Runtime_supervisor(scope, $std_core_hnd._open_none0(function() {
      return $kokaine_internal_registry.new_registry();
    }), { value: ($kokaine_async_internal_one_dash_shot_dash_task.Task_canceled) }, { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) });
   
  var x_10572 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
      var actions_0 = $std_core_hnd._open_none2(function(supervisor_0 /* runtime-supervisor<3114> */ , reason /* kokaine/async/internal/one-shot-task/task-stop-reason */ ) {
           
          var _x46 = supervisor_0.supervisor_reason;
          ((_x46).value = reason);
          var _x47 = supervisor_0.supervisor_tasks;
          var _x46 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x47);
          if (_x46 === null) {
            return $std_core_types.Nil;
          }
          else {
             
            runtime_supervisor_fs_detach(supervisor_0);
            return _x46.value;
          }
        }, supervisor, $kokaine_async_internal_one_dash_shot_dash_task.Task_retired);
      return $std_core_hnd._open_none1(function(actions_0_0 /* list<task-cancellation> */ ) {
          return $std_core_hnd.finally_prompt(function() {
              return run_task_host_disposers(actions_0_0);
            }, run_task_cancel_strands(actions_0_0));
        }, actions_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(owner /* kokaine/reactive/internal/model/cleanup-registration<<ui|3114>> */ ) {
      return _mlift_new_runtime_supervisor_10499(bucket, current, family, supervisor, owner);
    });
  }
  else {
     
    var target_10334 = $std_core_hnd._open_none1(function(_this /* runtime-supervisor<3114> */ ) {
        return _this.supervisor_owner;
      }, supervisor);
     
    ((target_10334).value = ($std_core_types.Just(x_10572)));
     
    var _x_x1_3_10425 = $std_core_hnd._open_none1(function(_this_0 /* async-family<3114> */ ) {
        return _this_0.family_supervisors;
      }, family);
     
    var x_0_10577 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* kokaine/internal/registry/registry<runtime-supervisor<3114>> */ , value_4 /* runtime-supervisor<3114> */ ) {
        var _x46 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_4);
        if (_x46 === null) {
          return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
        }
        else {
          return _x46.value;
        }
      }, _x_x1_3_10425, supervisor);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(family_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<3114>> */ ) {
        return _mlift_new_runtime_supervisor_10498(bucket, current, supervisor, family_registration);
      });
    }
    else {
       
      var target_1_10340 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<3114> */ ) {
          return _this_1.supervisor_family;
        }, supervisor);
       
      ((target_1_10340).value = ($std_core_types.Just(x_0_10577)));
       
      var _x_x1_7_10431 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor-bucket<3114> */ ) {
          return _this_2.bucket_supervisors;
        }, bucket);
       
      var x_1_10580 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_2 /* kokaine/internal/registry/registry<runtime-supervisor<3114>> */ , value_6 /* runtime-supervisor<3114> */ ) {
          var _x46 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_2, value_6);
          if (_x46 === null) {
            return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
          }
          else {
            return _x46.value;
          }
        }, _x_x1_7_10431, supervisor);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(bucket_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<3114>> */ ) {
          return _mlift_new_runtime_supervisor_10497(bucket, current, supervisor, bucket_registration);
        });
      }
      else {
         
        var target_3_10346 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<3114> */ ) {
            return _this_3.supervisor_bucket_link;
          }, supervisor);
         
        ((target_3_10346).value = ($std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, x_1_10580))));
        return supervisor;
      }
    }
  }
}
 
 
// monadic lift
export function runtime_fs__mlift_supervisor_10500(bucket_0, supervisor_0, registration) /* forall<_e,e1> (bucket@0 : runtime-supervisor-bucket<e1>, supervisor@0 : runtime-supervisor<e1>, registration : kokaine/internal/int-index/int-index-registration<runtime-supervisor-bucket<e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_10361 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor-bucket<3284> */ ) {
      return _this_2.bucket_index;
    }, bucket_0);
   
  ((target_10361).value = ($std_core_types.Just(registration)));
  return supervisor_0;
}
 
 
// monadic lift
export function runtime_fs__mlift_supervisor_10501(bucket_0, family, scope, supervisor_0) /* forall<_e,e1> (bucket@0 : runtime-supervisor-bucket<e1>, family : async-family<e1>, scope : kokaine/async/effects/async-scope, supervisor@0 : runtime-supervisor<e1>) -> <kokaine/reactive/effects/signal-write,pure,ui|e1> runtime-supervisor<e1> */  {
   
  var _x_x1_6_10444 = $std_core_hnd._open_none1(function(_this_1 /* async-family<3284> */ ) {
      return _this_1.family_index;
    }, family);
   
  var _x_x2_1_10445 = $std_core_hnd._open_none1(function(scope_1 /* kokaine/async/effects/async-scope */ ) {
      var _x47 = (scope_1.ids !== null) ? scope_1.ids.head : 0;
      var _x46 = $std_core_types._int_eq(_x47,0);
      if (_x46) {
        return scope_1.scope_namespace;
      }
      else {
        return (scope_1.ids !== null) ? scope_1.ids.head : 0;
      }
    }, scope);
   
  var x_10583 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_6_10444, _x_x2_1_10445, bucket_0);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/int-index/int-index-registration<runtime-supervisor-bucket<3284>> */ ) {
      return runtime_fs__mlift_supervisor_10500(bucket_0, supervisor_0, registration);
    });
  }
  else {
    return runtime_fs__mlift_supervisor_10500(bucket_0, supervisor_0, x_10583);
  }
}
 
export function runtime_fs_supervisor(runtime, root, scope) /* forall<e> (runtime : generation-runtime<e>, root : kokaine/reactive/internal/model/root<<ui|e>>, scope : kokaine/async/effects/async-scope) -> <kokaine/reactive/effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var family = $std_core_hnd._open_none1(function(_this /* generation-runtime<3284> */ ) {
      return _this;
    }, runtime);
   
  var _x_x1_0_10436 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<<ui|3284>> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var value_10350 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<<ui|3284>> */ ) {
      return plane.plane_current_frame;
    }, _x_x1_0_10436);
   
  var current = value_10350.value;
   
  var _x_x1_2_10438 = $std_core_hnd._open_none1(function(_this_0 /* async-family<3284> */ ) {
      return _this_0.family_index;
    }, family);
   
  var _x_x2_10439 = $std_core_hnd._open_none1(function(scope_0 /* kokaine/async/effects/async-scope */ ) {
      var _x47 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
      var _x46 = $std_core_types._int_eq(_x47,0);
      if (_x46) {
        return scope_0.scope_namespace;
      }
      else {
        return (scope_0.ids !== null) ? scope_0.ids.head : 0;
      }
    }, scope);
  var _x46 = $std_core_hnd._open_none2($kokaine_internal_int_dash_index.int_index_fs_lookup, _x_x1_2_10438, _x_x2_10439);
  if (_x46 !== null) {
    var _x47 = $std_core_hnd._open_none2(runtime_supervisor_bucket_fs_find_frame, _x46.value, current);
    if (_x47 !== null) {
      return _x47.value;
    }
    else {
      return new_runtime_supervisor(root, family, scope, current, _x46.value);
    }
  }
  else {
     
    var bucket_0 = $std_core_hnd._open_none0(function() {
      return Runtime_supervisor_bucket($kokaine_internal_registry.new_registry(), { value: ($std_core_types.Nothing) });
    });
     
    var x_1_10585 = new_runtime_supervisor(root, family, scope, current, bucket_0);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(supervisor_0 /* runtime-supervisor<3284> */ ) {
        return runtime_fs__mlift_supervisor_10501(bucket_0, family, scope, supervisor_0);
      });
    }
    else {
       
      var _x_x1_6_10444 = $std_core_hnd._open_none1(function(_this_1 /* async-family<3284> */ ) {
          return _this_1.family_index;
        }, family);
       
      var _x_x2_1_10445 = $std_core_hnd._open_none1(function(scope_1 /* kokaine/async/effects/async-scope */ ) {
          var _x49 = (scope_1.ids !== null) ? scope_1.ids.head : 0;
          var _x48 = $std_core_types._int_eq(_x49,0);
          if (_x48) {
            return scope_1.scope_namespace;
          }
          else {
            return (scope_1.ids !== null) ? scope_1.ids.head : 0;
          }
        }, scope);
       
      var x_2_10588 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_6_10444, _x_x2_1_10445, bucket_0);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/int-index/int-index-registration<runtime-supervisor-bucket<3284>> */ ) {
          return runtime_fs__mlift_supervisor_10500(bucket_0, x_1_10585, registration);
        });
      }
      else {
         
        var target_10361 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor-bucket<3284> */ ) {
            return _this_2.bucket_index;
          }, bucket_0);
         
        ((target_10361).value = ($std_core_types.Just(x_2_10588)));
        return x_1_10585;
      }
    }
  }
}
 
export function task_fs_detach_cancellation(task) /* forall<a,e> (task : generation-task<a,e>) -> () */  {
   
  var _x48 = task.task_cancel;
  var registration = _x48.value;
   
  var _x49 = task.task_cancel;
  ((_x49).value = ($std_core_types.Nothing));
   
  if (registration === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _x50 = registration.value;
    var maybe_10005 = $kokaine_internal_registry.registry_registration_fs_take(_x50);
    $std_core_types.Unit;
  }
  var _x49 = task.task_supervisor.supervisor_tasks;
  var _x48 = $std_core_types._int_le(($kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_count(_x49)),0);
  if (_x48) {
    var _x50 = task.task_supervisor;
    return runtime_supervisor_fs_detach(_x50);
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
      var _x51 = $std_core_types.Cons(values.head, collected);
      values = values.tail;
      collected = _x51;
      continue tailcall;
    }
  }
}}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10502(collected, _c_x10199) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10199, collected);
}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10503(collected_0, _c_x10200) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10200, collected_0);
}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10504(include_all, rest, scope, _c_x10202) /* forall<e> (include-all : bool, rest : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, list<task-cancellation>) -> list<task-cancellation> */  {
  return claim_scope_supervisors_loop(rest, scope, include_all, _c_x10202);
}
 
export function claim_scope_supervisors_loop(supervisors, scope_0, include_all_0, collected_1) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, include-all : bool, collected : list<task-cancellation>) -> div list<task-cancellation> */  { tailcall: while(1)
{
  if (supervisors === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected_1);
  }
  else {
     
    if (include_all_0) {
       
      var _x52 = supervisors.head.supervisor_reason;
      ((_x52).value = ($kokaine_async_internal_one_dash_shot_dash_task.Task_canceled));
       
      var _x54 = supervisors.head.supervisor_tasks;
      var _x53 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x54);
      if (_x53 === null) {
        var x_0_10594 = $std_core_types.Nil;
      }
      else {
         
        runtime_supervisor_fs_detach(supervisors.head);
        var x_0_10594 = _x53.value;
      }
      if ($std_core_hnd._yielding()) {
        var x_10591 = $std_core_hnd.yield_extend(function(_c_x10199_0 /* list<task-cancellation> */ ) {
          return _mlift_claim_scope_supervisors_loop_10502(collected_1, _c_x10199_0);
        });
      }
      else {
        var x_10591 = _mlift_claim_scope_supervisors_loop_10502(collected_1, x_0_10594);
      }
    }
    else {
      var _x53 = supervisors.head.supervisor_scope;
      var _x52 = $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(_x53, scope_0);
      if (_x52) {
         
        var _x54 = supervisors.head.supervisor_reason;
        ((_x54).value = ($kokaine_async_internal_one_dash_shot_dash_task.Task_canceled));
         
        var _x56 = supervisors.head.supervisor_tasks;
        var _x55 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x56);
        if (_x55 === null) {
          var x_1_10596 = $std_core_types.Nil;
        }
        else {
           
          runtime_supervisor_fs_detach(supervisors.head);
          var x_1_10596 = _x55.value;
        }
        if ($std_core_hnd._yielding()) {
          var x_10591 = $std_core_hnd.yield_extend(function(_c_x10200_0 /* list<task-cancellation> */ ) {
            return _mlift_claim_scope_supervisors_loop_10503(collected_1, _c_x10200_0);
          });
        }
        else {
          var x_10591 = _mlift_claim_scope_supervisors_loop_10503(collected_1, x_1_10596);
        }
      }
      else {
        var x_10591 = collected_1;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10202_0 /* list<task-cancellation> */ ) {
        return _mlift_claim_scope_supervisors_loop_10504(include_all_0, supervisors.tail, scope_0, _c_x10202_0);
      });
    }
    else {
      {
        // tail call
        supervisors = supervisors.tail;
        collected_1 = x_10591;
        continue tailcall;
      }
    }
  }
}}
 
export function claim_scope_supervisors(supervisors, scope, include_all) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, include-all : bool) -> div list<task-cancellation> */  {
  return claim_scope_supervisors_loop(supervisors, scope, include_all, $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_cancel_runtime_scope_10505(actions) /* forall<e> (actions : list<task-cancellation>) -> <div,ui,exn,kokaine/reactive/effects/signal-write|e> () */  {
  return $std_core_hnd._open_none1(function(actions_0 /* list<task-cancellation> */ ) {
      return $std_core_hnd.finally_prompt(function() {
          return run_task_host_disposers(actions_0);
        }, run_task_cancel_strands(actions_0));
    }, actions);
}
 
export function cancel_runtime_scope(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> <kokaine/reactive/effects/signal-write,pure,ui|e> () */  {
   
  $std_core_hnd._open_none2(runtime_fs_record_canceled, runtime, scope);
   
  var family = $std_core_hnd._open_none1(function(_this /* generation-runtime<3792> */ ) {
      return _this;
    }, runtime);
   
  var _x_x1_2_10456 = $std_core_hnd._open_none1(function(_this_0 /* async-family<3792> */ ) {
      return _this_0.family_supervisors;
    }, family);
   
  var _x_x1_1_10453 = $std_core_hnd._open_none1($kokaine_internal_registry.registry_fs_snapshot, _x_x1_2_10456);
   
  var _x_x2_1_10459 = $std_core_hnd._open_none1(function(_this_1 /* async-family<3792> */ ) {
      return _this_1.family_root_scope;
    }, family);
   
  var _x_x3_10455 = $std_core_hnd._open_none2($kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_, scope, _x_x2_1_10459);
   
  var x_10600 = $std_core_hnd._open_none3(function(supervisors /* list<runtime-supervisor<3792>> */ , scope_0 /* kokaine/async/effects/async-scope */ , include_all /* bool */ ) {
      return claim_scope_supervisors_loop(supervisors, scope_0, include_all, $std_core_types.Nil);
    }, _x_x1_1_10453, scope, _x_x3_10455);
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
      }, x_10600);
  }
}
 
export function release_runtime_scope(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
  return runtime_fs_release_canceled(runtime, scope);
}
 
 
// monadic lift
export function _mlift_register_owned_disposer_10506(disposer_slot, _c_x10208) /* forall<_e,_e1> (disposer-slot : ref<global,maybe<kokaine/async/effects/dispose-fn>>, bool) -> bool */  {
  if (_c_x10208) {
     
    var current_0 = disposer_slot.value;
     
    ((disposer_slot).value = ($std_core_types.Nothing));
    if (current_0 === null) {
      return false;
    }
    else {
       
      decrement_outstanding();
      return true;
    }
  }
  else {
    return false;
  }
}
 
 
// monadic lift
export function _mlift_register_owned_disposer_10507(committed, disposer_slot, registration) /* forall<_e,_e1,e2> (committed : ref<global,bool>, disposer-slot : ref<global,maybe<kokaine/async/effects/dispose-fn>>, registration : kokaine/reactive/internal/model/cleanup-registration<<ui|e2>>) -> <exn,ui,div,kokaine/reactive/effects/signal-write|e2> (() -> ui bool) */  {
   
  $std_core_hnd._open_none0(function() {
     
    var x_10031 = outstanding_operations.value;
     
    var value_10030 = $std_core_types._int_add(x_10031,1);
    return ((outstanding_operations).value = value_10030);
  });
   
  ((committed).value = true);
  return function() {
     
    var _x53 = registration.cleanup_node;
    var _x52 = $kokaine_internal_registry.registry_registration_fs_take(_x53);
    if (_x52 === null) {
      var x_10605 = false;
    }
    else {
       
      var _x54 = registration.cleanup_resource;
      var maybe_10016 = $kokaine_reactive_internal_resource.claim_resource(_x54);
      var x_10605 = (maybe_10016 !== null);
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10208 /* bool */ ) {
        return _mlift_register_owned_disposer_10506(disposer_slot, _c_x10208);
      });
    }
    else {
      return _mlift_register_owned_disposer_10506(disposer_slot, x_10605);
    }
  };
}
 
 
// Some host resources outlive the await which creates them. Register their
// disposer directly with the current reactive generation and return a
// one-shot release action for ownership transfer. Both paths consume the same
// slot before unlinking or invoking host code, so re-entry cannot double-run
// either transition.
export function register_owned_disposer(root, dispose) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, dispose : kokaine/async/effects/dispose-fn) -> <kokaine/reactive/effects/signal-write,pure,ui|e> kokaine/async/effects/ownership-release-fn */  {
   
  var disposer_slot = { value: ($std_core_types.Just(dispose)) };
   
  var committed = { value: false };
   
  var x_10609 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
      var current = disposer_slot.value;
       
      ((disposer_slot).value = ($std_core_types.Nothing));
      if (current === null) {
        return $std_core_types.Unit;
      }
      else {
         
        $std_core_hnd._open_none0(decrement_outstanding);
        return $std_core_hnd._open_none0(current.value);
      }
    });
  if ($std_core_hnd._yielding()) {
    var _x53 = $std_core_hnd.yield_extend(function(registration /* kokaine/reactive/internal/model/cleanup-registration<<ui|4006>> */ ) {
      return _mlift_register_owned_disposer_10507(committed, disposer_slot, registration);
    });
  }
  else {
    var _x53 = _mlift_register_owned_disposer_10507(committed, disposer_slot, x_10609);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x52 = committed.value;
      if (_x52) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_hnd._open_none0(dispose);
      }
    }, _x53);
}
 
 
// monadic lift
export function _mlift_register_task_10508(family_0, setup, task_0, cancellation_0) /* forall<_e,_e1,a,e2> (family@0 : async-family<e2>, setup : kokaine/async/effects/await-setup<a>, task@0 : generation-task<a,e2>, cancellation@0 : kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>) -> <exn,div,ui,kokaine/reactive/effects/signal-write|e2> () */  {
   
  var target_10392 = $std_core_hnd._open_none1(function(_this_3 /* generation-task<6551,6552> */ ) {
      return _this_3.task_cancel;
    }, task_0);
   
  ((target_10392).value = ($std_core_types.Just(cancellation_0)));
   
  $std_core_hnd._open_none0(function() {
     
    var x_10031 = outstanding_operations.value;
     
    var value_10030 = $std_core_types._int_add(x_10031,1);
    return ((outstanding_operations).value = value_10030);
  });
  var _x54 = $std_core_hnd._open_none1(setup, function(result_0 /* kokaine/async/effects/await-result<6551> */ ) {
      return accept_task_result(task_0, family_0, result_0);
    });
  if (_x54._tag === 1) {
    return $std_core_hnd._open_none3(accept_task_result, task_0, family_0, $kokaine_async_effects.Exception(_x54.error));
  }
  else {
     
    var _x_x1_8_10476 = $std_core_hnd._open_none1(function(_this_4 /* generation-task<6551,6552> */ ) {
        return _this_4.task_state;
      }, task_0);
    var _x55 = $std_core_hnd._open_none2($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_8_10476, _x54.value);
    if (_x55 === null) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_hnd._open_none0(_x55.value);
    }
  }
}
 
 
// monadic lift
export function _mlift_register_task_10509(family_0_0, label, portal, resume_action, setup_0, supervisor) /* forall<_e,_e1,_e2,a,e3> (family@0 : async-family<e3>, label : string, portal : kokaine/reactive/integration/internal/reentry/reentry<<ui|e3>>, resume-action : (kokaine/async/effects/await-result<a>) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e3> (), setup : kokaine/async/effects/await-setup<a>, supervisor : runtime-supervisor<e3>) -> <kokaine/reactive/effects/signal-write,pure,ui|e3> () */  {
   
  var state = $std_core_hnd._open_none1($kokaine_async_internal_one_dash_shot_dash_task.new_one_shot_task, Task_payload(portal, resume_action, label));
   
  var task_0_0 = Generation_task(state, supervisor, { value: ($std_core_types.Nothing) });
   
  var _x_x1_3_10468 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor<6552> */ ) {
      return _this_2.supervisor_tasks;
    }, supervisor);
   
  var x_10611 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_3_10468, function() {
      return task_fs_claim_stop(task_0_0, family_0_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(cancellation_0_0 /* kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
      return _mlift_register_task_10508(family_0_0, setup_0, task_0_0, cancellation_0_0);
    });
  }
  else {
    return _mlift_register_task_10508(family_0_0, setup_0, task_0_0, x_10611);
  }
}
 
 
// monadic lift
export function _mlift_register_task_10510(label_0, resume_action_0, root, runtime, scope, setup_1, portal_0) /* forall<_e,_e1,_e2,a,e3> (label : string, resume-action : (kokaine/async/effects/await-result<a>) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e3> (), root : kokaine/reactive/internal/model/root<<ui|e3>>, runtime : generation-runtime<e3>, scope : kokaine/async/effects/async-scope, setup : kokaine/async/effects/await-setup<a>, portal : kokaine/reactive/integration/internal/reentry/reentry<<ui|e3>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e3> () */  {
   
  var family_0_1 = $std_core_hnd._open_none1(function(_this_1 /* generation-runtime<6552> */ ) {
      return _this_1;
    }, runtime);
   
  var x_0_10613 = runtime_fs_supervisor(runtime, root, scope);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(supervisor_0 /* runtime-supervisor<6552> */ ) {
      return _mlift_register_task_10509(family_0_1, label_0, portal_0, resume_action_0, setup_1, supervisor_0);
    });
  }
  else {
    return _mlift_register_task_10509(family_0_1, label_0, portal_0, resume_action_0, setup_1, x_0_10613);
  }
}
 
 
// monadic lift
export function _mlift_register_task_10511(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, wild__) /* forall<_e,_e1,_e2,a,e3> (label : string, resume-action : (kokaine/async/effects/await-result<a>) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e3> (), root : kokaine/reactive/internal/model/root<<ui|e3>>, runtime : generation-runtime<e3>, scope : kokaine/async/effects/async-scope, setup : kokaine/async/effects/await-setup<a>, wild_ : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e3> () */  {
   
  var x_1_10615 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_integration_internal_reentry.capture_reentry, root_0);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal_1 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|6552>> */ ) {
      return _mlift_register_task_10510(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, portal_1);
    });
  }
  else {
    return _mlift_register_task_10510(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, x_1_10615);
  }
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10512(label_0_0, rcontext, root_0_0, runtime_0_0, scope_0_0, setup_0_0, _y_x10226) /* forall<a,e> (label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10226, false, function() {
      return register_task(root_0_0, runtime_0_0, scope_0_0, label_0_0, setup_0_0, function(result_1 /* kokaine/async/effects/await-result<4611> */ ) {
          return $std_core_hnd.resume_shallow(rcontext, result_1);
        });
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10513(family_1, label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10223) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10223, false, function() {
      var _x56 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_1, scope_0_1);
      if (_x56) {
        return resume_generation(root_0_1, family_1, function() {
            return $std_core_hnd.resume_shallow(rcontext_0, $kokaine_async_effects.Cancel);
          });
      }
      else {
         
        var x_2_10617 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10226_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10512(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10226_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10512(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, x_2_10617);
        }
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10514(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10222) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10222, false, function() {
       
      var x_3_10619 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10223_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10513(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10223_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10513(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, x_3_10619);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10515(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10221) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10221, false, function() {
       
      var x_4_10621 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10222_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10514(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10222_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10514(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, x_4_10621);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10516(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10220) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10220, false, function() {
       
      var x_5_10623 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10221_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10515(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10221_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10515(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, x_5_10623);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10517(callback, label_0_0_0, root_0_5, runtime_0_5, scope_0_0_0, setup_0_0_0, _y_x10239) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10239, false, function() {
      return register_task(root_0_5, runtime_0_5, scope_0_0_0, label_0_0_0, setup_0_0_0, function(result_0_0 /* kokaine/async/effects/await-result<4730> */ ) {
          return $std_core_hnd._open_none1(callback, result_0_0);
        });
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10518(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10238) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10238, false, function() {
      var _x57 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_6, scope_0_0_1);
      if (_x57) {
        return $std_core_hnd._open_none1(callback_0, $kokaine_async_effects.Cancel);
      }
      else {
         
        var x_6_10625 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10239_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10517(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10239_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10517(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, x_6_10625);
        }
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10519(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10237) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10237, false, function() {
       
      var x_7_10627 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10238_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10518(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10238_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10518(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, x_7_10627);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10520(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10236) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10236, false, function() {
       
      var x_8_10629 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10237_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10519(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10237_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10519(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, x_8_10629);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10521(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10235) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10235, false, function() {
       
      var x_9_10631 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10236_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10520(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10236_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10520(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, x_9_10631);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10522(host_action, _y_x10250) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <exn,div,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10250, false, host_action);
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10523(host_action_0, _y_x10249) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10249, false, function() {
       
      var x_10_10634 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10250_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10522(host_action_0, _y_x10250_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10522(host_action_0, x_10_10634);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10524(host_action_1, _y_x10248) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10248, false, function() {
       
      var x_11_10636 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10249_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10523(host_action_1, _y_x10249_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10523(host_action_1, x_11_10636);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10525(host_action_0_0, root_1, runtime_1, scope_1, _y_x10255) /* forall<e> (host-action@0 : () -> ui (), root@1 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@1 : generation-runtime<e>, scope@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10255, false, function() {
      return register_scheduled_ioc(root_1, runtime_1, scope_1, host_action_0_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10526(dispose_0, root_1_0, _y_x10259) /* forall<e> (dispose@0 : kokaine/async/effects/dispose-fn, root@1 : kokaine/reactive/internal/model/root<<ui|e>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10259, false, function() {
      return register_owned_disposer(root_1_0, dispose_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10527(dispose_0_0, root_1_1, _y_x10258) /* forall<e> (dispose@0 : kokaine/async/effects/dispose-fn, root@1 : kokaine/reactive/internal/model/root<<ui|e>>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10258, false, function() {
       
      var x_12_10638 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10259_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10526(dispose_0_0, root_1_1, _y_x10259_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10526(dispose_0_0, root_1_1, x_12_10638);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10528(runtime_1_0, scope_0_1_0, _y_x10265) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10265, false, function() {
      return cancel_runtime_scope(runtime_1_0, scope_0_1_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10529(runtime_1_1, scope_0_1_1, _y_x10264) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10264, false, function() {
       
      var x_13_10640 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10265_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10528(runtime_1_1, scope_0_1_1, _y_x10265_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10528(runtime_1_1, scope_0_1_1, x_13_10640);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10530(runtime_1_2, scope_0_1_2, _y_x10263) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10263, false, function() {
       
      var x_14_10642 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10264_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10529(runtime_1_2, scope_0_1_2, _y_x10264_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10529(runtime_1_2, scope_0_1_2, x_14_10642);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10531(runtime_1_3, scope_1_0, _y_x10274) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <exn,div|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10274, false, function() {
      return runtime_fs_is_canceled(runtime_1_3, scope_1_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10532(runtime_1_4, scope_1_0_0, _y_x10273) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10273, false, function() {
       
      var x_15_10646 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10274_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10531(runtime_1_4, scope_1_0_0, _y_x10274_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10531(runtime_1_4, scope_1_0_0, x_15_10646);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10533(runtime_1_5, scope_1_0_1, _y_x10272) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10272, false, function() {
       
      var x_16_10648 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10273_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10532(runtime_1_5, scope_1_0_1, _y_x10273_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10532(runtime_1_5, scope_1_0_1, x_16_10648);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10534(runtime_1_6, scope_1_0_2, _y_x10271) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10271, false, function() {
       
      var x_17_10650 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10272_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10533(runtime_1_6, scope_1_0_2, _y_x10272_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10533(runtime_1_6, scope_1_0_2, x_17_10650);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10535(runtime_1_7, scope_1_0_3, _y_x10270) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10270, false, function() {
       
      var x_18_10652 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10271_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10534(runtime_1_7, scope_1_0_3, _y_x10271_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10534(runtime_1_7, scope_1_0_3, x_18_10652);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10536(runtime_1_8, scope_2, _y_x10286) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <exn,div|e> () */  {
  return $std_core_hnd._mask_at(_y_x10286, false, function() {
      return release_runtime_scope(runtime_1_8, scope_2);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10537(runtime_1_9, scope_2_0, _y_x10285) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10285, false, function() {
       
      var x_19_10656 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10286_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10536(runtime_1_9, scope_2_0, _y_x10286_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10536(runtime_1_9, scope_2_0, x_19_10656);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10538(runtime_1_10, scope_2_1, _y_x10284) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10284, false, function() {
       
      var x_20_10658 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10285_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10537(runtime_1_10, scope_2_1, _y_x10285_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10537(runtime_1_10, scope_2_1, x_20_10658);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10539(runtime_1_11, scope_2_2, _y_x10283) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10283, false, function() {
       
      var x_21_10660 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10284_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10538(runtime_1_11, scope_2_2, _y_x10284_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10538(runtime_1_11, scope_2_2, x_21_10660);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10540(runtime_1_12, scope_2_3, _y_x10282) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10282, false, function() {
       
      var x_22_10662 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10283_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10539(runtime_1_12, scope_2_3, _y_x10283_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10539(runtime_1_12, scope_2_3, x_22_10662);
      }
    });
}
 
export function accept_task_result(task, family, result) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>, result : kokaine/async/effects/await-result<a>) -> <div,ui> () */  {
  var _x59 = task.task_state;
  var _x58 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_accept(_x59, result);
  if (_x58) {
    var _x61 = family.family_dispatcher;
    var _x60 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_dispatcher_fs_dispatch(_x61, function() {
        return run_task_result(task, family);
      });
    if (_x60) {
      return $std_core_types.Unit;
    }
    else {
       
      var rejected = task_fs_claim_dispatch_rejection(task, family);
      if (rejected === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var actions_10123 = $std_core_types.Cons(rejected.value, $std_core_types.Nil);
        return $std_core_hnd.finally_prompt(function() {
            return run_task_host_disposers(actions_10123);
          }, run_task_cancel_strands(actions_10123));
      }
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function register_task(root_2, runtime_2, scope_3, label_2, setup_3, resume_action_2) /* forall<a,e> (root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, label : string, setup : kokaine/async/effects/await-setup<a>, resume-action : (kokaine/async/effects/await-result<a>) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> ()) -> <pure,kokaine/reactive/effects/signal-write,ui|e> () */  {
   
  var x_23_10667 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "async suspension");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_register_task_10511(label_2, resume_action_2, root_2, runtime_2, scope_3, setup_3, wild___0);
    });
  }
  else {
     
    var x_24_10670 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_integration_internal_reentry.capture_reentry, root_2);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(portal_2 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|6552>> */ ) {
        return _mlift_register_task_10510(label_2, resume_action_2, root_2, runtime_2, scope_3, setup_3, portal_2);
      });
    }
    else {
       
      var family_0_2 = $std_core_hnd._open_none1(function(_this_1_0 /* generation-runtime<6552> */ ) {
          return _this_1_0;
        }, runtime_2);
       
      var x_25_10673 = runtime_fs_supervisor(runtime_2, root_2, scope_3);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(supervisor_1 /* runtime-supervisor<6552> */ ) {
          return _mlift_register_task_10509(family_0_2, label_2, x_24_10670, resume_action_2, setup_3, supervisor_1);
        });
      }
      else {
         
        var state_0 = $std_core_hnd._open_none1($kokaine_async_internal_one_dash_shot_dash_task.new_one_shot_task, Task_payload(x_24_10670, resume_action_2, label_2));
         
        var task_0_1 = Generation_task(state_0, x_25_10673, { value: ($std_core_types.Nothing) });
         
        var _x_x1_3_10468_0 = $std_core_hnd._open_none1(function(_this_2_0 /* runtime-supervisor<6552> */ ) {
            return _this_2_0.supervisor_tasks;
          }, x_25_10673);
         
        var x_26_10676 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_3_10468_0, function() {
            return task_fs_claim_stop(task_0_1, family_0_2);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(cancellation_0_1 /* kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
            return _mlift_register_task_10508(family_0_2, setup_3, task_0_1, cancellation_0_1);
          });
        }
        else {
           
          var target_10392_0 = $std_core_hnd._open_none1(function(_this_3_0 /* generation-task<6551,6552> */ ) {
              return _this_3_0.task_cancel;
            }, task_0_1);
           
          ((target_10392_0).value = ($std_core_types.Just(x_26_10676)));
           
          $std_core_hnd._open_none0(function() {
             
            var x_10031_0 = outstanding_operations.value;
             
            var value_10030_0 = $std_core_types._int_add(x_10031_0,1);
            return ((outstanding_operations).value = value_10030_0);
          });
          var _x62 = $std_core_hnd._open_none1(setup_3, function(result_0_1 /* kokaine/async/effects/await-result<6551> */ ) {
              return accept_task_result(task_0_1, family_0_2, result_0_1);
            });
          if (_x62._tag === 1) {
            return $std_core_hnd._open_none3(accept_task_result, task_0_1, family_0_2, $kokaine_async_effects.Exception(_x62.error));
          }
          else {
             
            var _x_x1_8_10476_0 = $std_core_hnd._open_none1(function(_this_4_0 /* generation-task<6551,6552> */ ) {
                return _this_4_0.task_state;
              }, task_0_1);
            var _x63 = $std_core_hnd._open_none2($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_8_10476_0, _x62.value);
            if (_x63 === null) {
              return $std_core_types.Unit;
            }
            else {
              return $std_core_hnd._open_none0(_x63.value);
            }
          }
        }
      }
    }
  }
}
 
 
// Factoring the await interpreter is important for both dynamic and static
// semantics. Dynamically, its prompt is installed inside the other base
// handlers, so none of those handler frames become part of the parked suffix.
// Statically, the shallow resumption retains the complete residual async row;
// the caller below discharges those effects with the surrounding handlers.
export function interpret_generation_await(root_0_10, family_1_3, runtime_0_10, action_6) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, family : async-family<e>, runtime : generation-runtime<e>, action : () -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> ()) -> <pure,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $kokaine_async_effects.async_await_fs__handle($kokaine_async_effects._Hnd_async_await(3, function(m /* hnd/marker<<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|6562>,()> */ , ___wildcard_x598__16 /* hnd/ev<kokaine/async/effects/async-await> */ , x_27 /* (kokaine/async/effects/await-setup<_4430>, kokaine/async/effects/async-scope, string) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<kokaine/async/effects/await-result<_4430>,()>) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|6562> () */ ) {
             
            var x_28_10680 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
             
            function next_27_10681(_y_x10220_0) /* (hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|6562> () */  {
              return _mlift_interpret_generation_await_10516(family_1_3, x_27.thd, k, root_0_10, runtime_0_10, x_27.snd, x_27.fst, _y_x10220_0);
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_27_10681);
            }
            else {
              return next_27_10681(x_28_10680);
            }
          });
      }, $std_core_hnd.clause_tail1(function(_pat_x789__20 /* (kokaine/async/effects/await-setup<_4433>, kokaine/async/effects/async-scope, string, (kokaine/async/effects/await-result<_4433>) -> ui ()) */ ) {
         
        var x_29_10683 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10235_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10521(_pat_x789__20.field4, _pat_x789__20.thd, root_0_10, runtime_0_10, _pat_x789__20.snd, _pat_x789__20.fst, _y_x10235_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10521(_pat_x789__20.field4, _pat_x789__20.thd, root_0_10, runtime_0_10, _pat_x789__20.snd, _pat_x789__20.fst, x_29_10683);
        }
      })), function(_res /* () */ ) {
      return _res;
    }, action_6);
}
 
 
// Install this inside an already established Kokaine turn (in particular,
// inside the action passed to `reenter`). A raw await returns from this handler,
// allowing the surrounding re-entry batch to close. Each later completion
// calls this function again only after entering a fresh generation-bound batch.
export function run_generation_async_with_family(root_1_2, family_2, action_0_0) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, family : async-family<e>, action : () -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> ()) -> <pure,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
   
  var runtime_1_13 = family_2;
  return $kokaine_async_effects.async_ioc_fs__handle($kokaine_async_effects._Hnd_async_ioc(1, $std_core_hnd.clause_tail1(function(host_action_2 /* () -> ui 4855 */ ) {
         
        var x_30_10685 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10248_0 /* hnd/ev-index */ ) {
            return _mlift_run_generation_async_with_family_10524(host_action_2, _y_x10248_0);
          });
        }
        else {
          return _mlift_run_generation_async_with_family_10524(host_action_2, x_30_10685);
        }
      }), function(m_0 /* hnd/marker<<div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|6569>,()> */ , ev /* hnd/ev<kokaine/async/effects/async-ioc> */ , x1_1 /* kokaine/async/effects/async-scope */ , x2_1 /* () -> ui () */ ) {
        return $std_core_hnd.under2(ev, function(scope_1_1 /* kokaine/async/effects/async-scope */ , host_action_0_1 /* () -> ui () */ ) {
             
            var x_31_10688 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10255_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10525(host_action_0_1, root_1_2, runtime_1_13, scope_1_1, _y_x10255_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10525(host_action_0_1, root_1_2, runtime_1_13, scope_1_1, x_31_10688);
            }
          }, x1_1, x2_1);
      }), function(_res_0 /* () */ ) {
      return _res_0;
    }, function() {
      return $kokaine_async_effects.async_ownership_fs__handle($kokaine_async_effects._Hnd_async_ownership(1, $std_core_hnd.clause_tail1(function(dispose_0_1 /* kokaine/async/effects/dispose-fn */ ) {
             
            var x_32_10690 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10258_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10527(dispose_0_1, root_1_2, _y_x10258_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10527(dispose_0_1, root_1_2, x_32_10690);
            }
          })), function(_res_0_0 /* () */ ) {
          return _res_0_0;
        }, function() {
           
          var _value_async_scope_l791_c9 = $std_core_hnd._open_none1(function(_this_5 /* async-family<6569> */ ) {
              return _this_5.family_root_scope;
            }, family_2);
          return $kokaine_async_effects.async_cancel_fs__handle($kokaine_async_effects._Hnd_async_cancel(1, $std_core_hnd.clause_tail0(function() {
                return _value_async_scope_l791_c9;
              }), $std_core_hnd.clause_tail1(function(scope_0_1_3 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_33_10692 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10263_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10530(runtime_1_13, scope_0_1_3, _y_x10263_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10530(runtime_1_13, scope_0_1_3, x_33_10692);
                }
              }), $std_core_hnd.clause_tail1(function(scope_1_0_4 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_34_10694 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10270_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10535(runtime_1_13, scope_1_0_4, _y_x10270_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10535(runtime_1_13, scope_1_0_4, x_34_10694);
                }
              }), $std_core_hnd.clause_tail1(function(scope_2_4 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_35_10696 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10282_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10540(runtime_1_13, scope_2_4, _y_x10282_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10540(runtime_1_13, scope_2_4, x_35_10696);
                }
              })), function(_res_1 /* () */ ) {
              return _res_1;
            }, function() {
              return $kokaine_async_effects.discontinue_fs__handle($kokaine_async_effects._Hnd_discontinue(0, function(m_1 /* hnd/marker<<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|6569>,()> */ , ___wildcard_x701__16 /* hnd/ev<kokaine/async/effects/discontinue> */ ) {
                    return $std_core_hnd.yield_to_final(m_1, function(___wildcard_x701__43 /* (hnd/resume-result<5343,()>) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|6569> () */ ) {
                        return $std_core_types.Unit;
                      });
                  }), function(_res_2 /* () */ ) {
                  return _res_2;
                }, function() {
                  return interpret_generation_await(root_1_2, family_2, runtime_1_13, action_0_0);
                });
            });
        });
    });
}
 
export function resume_generation(root_2_0, family_3, action_1_0) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, family : async-family<e>, action : () -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> ()) -> <pure,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return run_generation_async_with_family(root_2_0, family_3, action_1_0);
}
 
export function run_task_result(task_1, family_4) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> <div,ui> () */  {
  var _x65 = task_1.task_state;
  var _x64 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_peek_ready_payload(_x65);
  if (_x64 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var b_10135 = $kokaine_reactive_integration_internal_reentry.reentry_fs_can_run_live(_x64.value.payload_portal);
    if (b_10135) {
      var _x67 = task_1.task_state;
      var _x66 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_ready(_x67);
      if (_x66 === null) {
        return $std_core_types.Unit;
      }
      else {
         
        task_fs_detach_cancellation(task_1);
         
        decrement_outstanding();
        return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_2 /* hnd/marker<ui,()> */ , ___wildcard_x654__16 /* hnd/ev<exn> */ , x_36 /* exception */ ) {
              return $std_core_hnd.yield_to_final(m_2, function(___wildcard_x654__45 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
                  var _x68 = x_36.message;
                  return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async exception (", $std_core_types._lp__plus__plus__rp_(_x66.value.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x68))));
                });
            }), function(_res_3 /* () */ ) {
            return _res_3;
          }, function() {
            if (_x66.value.claim_result === null) {
              var _x69 = $std_core_types.Unit;
            }
            else {
               
              var root_3_0 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|6585>> */ ) {
                  return value_1.reentry_root;
                }, _x66.value.claim_payload.payload_portal);
              var _x69 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_runner_fs_run($std_core_hnd._open_none1(function(_this_9 /* async-family<6585> */ ) {
                    return _this_9.family_runner;
                  }, family_4), function() {
                  return $kokaine_reactive_integration_internal_reentry.run_reentry(_x66.value.claim_payload.payload_portal, function() {
                      return resume_generation(root_3_0, family_4, function() {
                          return _x66.value.claim_payload.payload_resume(_x66.value.claim_result.value);
                        });
                    });
                });
            }
            return $std_core_hnd.finally_prompt(function() {
                 
                var _x_x1_10486 = $std_core_hnd._open_none1(function(_this_8 /* generation-task<6584,6585> */ ) {
                    return _this_8.task_state;
                  }, task_1);
                 
                var _pat_15_0_0 = $std_core_hnd._open_none1($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_finish, _x_x1_10486);
                return $std_core_types.Unit;
              }, _x69);
          });
      }
    }
    else {
       
      var retired = task_fs_claim_retired_ready(task_1, family_4);
      if (retired === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var actions_0_10137 = $std_core_types.Cons(retired.value, $std_core_types.Nil);
        return $std_core_hnd.finally_prompt(function() {
            return run_task_host_disposers(actions_0_10137);
          }, run_task_cancel_strands(actions_0_10137));
      }
    }
  }
}
 
export function stopped_task_cancellation(family_5, claim, reentry) /* forall<a,e> (family : async-family<e>, claim : kokaine/async/internal/one-shot-task/task-claim<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn>, reentry : cancellation-reentry) -> div task-cancellation */  {
  return Task_cancellation(function() {
      return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_3 /* hnd/marker<ui,()> */ , ___wildcard_x654__16_0 /* hnd/ev<exn> */ , x_37 /* exception */ ) {
            return $std_core_hnd.yield_to_final(m_3, function(___wildcard_x654__45_0 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
                var _x70 = x_37.message;
                return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async cancellation exception (", $std_core_types._lp__plus__plus__rp_(claim.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x70))));
              });
          }), function(_res_4 /* () */ ) {
          return _res_4;
        }, function() {
           
          var root_4_0 = $std_core_hnd._open_none1(function(value_2 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|6597>> */ ) {
              return value_2.reentry_root;
            }, claim.claim_payload.payload_portal);
          return $kokaine_reactive_async_internal_host_dash_turn.host_turn_runner_fs_run($std_core_hnd._open_none1(function(_this_10 /* async-family<6597> */ ) {
                return _this_10.family_runner;
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
 
export function task_fs_claim_detached_stop(task_2, family_6, reason, reentry_0) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>, reason : kokaine/async/internal/one-shot-task/task-stop-reason, reentry : cancellation-reentry) -> div maybe<task-cancellation> */  {
  var _x72 = task_2.task_state;
  var _x71 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_stop(_x72, reason);
  if (_x71 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    task_fs_detach_cancellation(task_2);
     
    decrement_outstanding();
    return $std_core_types.Just(stopped_task_cancellation(family_6, _x71.value, reentry_0));
  }
}
 
export function task_fs_claim_dispatch_rejection(task_3, family_7) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
  return task_fs_claim_detached_stop(task_3, family_7, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled, Cancellation_live_or_retirement);
}
 
export function task_fs_claim_retired_ready(task_4, family_8) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
  return task_fs_claim_detached_stop(task_4, family_8, $kokaine_async_internal_one_dash_shot_dash_task.Task_retired, Cancellation_retirement);
}
 
export function task_fs_claim_stop(task_5, family_9) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
   
  var _x73 = task_5.task_supervisor.supervisor_reason;
  var reason_0 = _x73.value;
  var _x74 = task_5.task_state;
  var _x73 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_stop(_x74, reason_0);
  if (_x73 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    var _x75 = task_5.task_cancel;
    ((_x75).value = ($std_core_types.Nothing));
     
    decrement_outstanding();
    return $std_core_types.Just(stopped_task_cancellation(family_9, _x73.value, Cancellation_retirement));
  }
}
 
 
// Scheduled host actions are ordinary generation-owned tasks. Keep their
// structural phase evidence live through registration; erasing it would make
// owner cleanup masks invalid at runtime on Koka's JavaScript backend.
export function register_scheduled_ioc(root_5, runtime_2_0, scope_3_0, host_action_1_0) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, host-action : () -> ui ()) -> <pure,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return register_task(root_5, runtime_2_0, scope_3_0, "scheduled host action", function(resume /* (kokaine/async/effects/await-result<()>) -> ui () */ ) {
      var _x76 = runtime_2_0.family_dispatcher;
      var _x75 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_dispatcher_fs_dispatch(_x76, function() {
          return resume($kokaine_async_effects.Result($std_core_types.Unit));
        });
      if (_x75) {
        return $std_core_types.Ok(function() {
          return $std_core_types.Unit;
        });
      }
      else {
        return $std_core_types.$Error($std_core_exn.Exception("async host dispatcher rejected scheduled action", $std_core_exn.ExnError));
      }
    }, function(result_3 /* kokaine/async/effects/await-result<()> */ ) {
      if (result_3._tag === 1) {
        return $std_core_hnd._open_none0(host_action_1_0);
      }
      else {
        return $std_core_types.Unit;
      }
    });
}
 
export function generation_async_outstanding() /* () -> int */  {
  return outstanding_operations.value;
}
 
export function new_async_lease_group() /* () -> async-lease-group */  {
  return $kokaine_internal_registry.new_registry();
}
 
export function async_lease_group_fs_has_linked_entries(group) /* (group : async-lease-group) -> bool */  {
  return $kokaine_internal_registry.registry_fs_has_linked_nodes(group);
}
 
export function async_lease_release(registration) /* (registration : kokaine/internal/registry/registry-registration<kokaine/async/effects/dispose-fn>) -> kokaine/async/effects/ownership-release-fn */  {
  return function() {
    var _x77 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    if (_x77 === null) {
      return false;
    }
    else {
       
      decrement_outstanding();
      return true;
    }
  };
}
 
export function async_lease_group_fs_own(group, dispose) /* (group : async-lease-group, dispose : kokaine/async/effects/dispose-fn) -> ui kokaine/async/effects/ownership-release-fn */  {
  var _x78 = $kokaine_internal_registry.registry_fs_try_insert(group, dispose);
  if (_x78 === null) {
     
    dispose();
    return function() {
      return false;
    };
  }
  else {
     
    var x_10031 = outstanding_operations.value;
     
    var value_10030 = $std_core_types._int_add(x_10031,1);
     
    ((outstanding_operations).value = value_10030);
    return function() {
      var _x79 = $kokaine_internal_registry.registry_registration_fs_take(_x78.value);
      if (_x79 === null) {
        return false;
      }
      else {
         
        decrement_outstanding();
        return true;
      }
    };
  }
}
 
export function account_async_lease_disposers(disposers) /* (disposers : list<kokaine/async/effects/dispose-fn>) -> () */  {
  return function() {
     
    var loc = { value: disposers };
     
    var res = $std_core.$while(function() {
         
        var list_10163 = ((loc).value);
        return (list_10163 === null) ? false : true;
      }, function() {
        var _x80 = ((loc).value);
        if (_x80 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x80.tail));
          return decrement_outstanding();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function run_async_lease_disposers(disposers) /* (disposers : list<kokaine/async/effects/dispose-fn>) -> ui () */  {
  return function() {
     
    var loc = { value: disposers };
     
    var res = $std_core.$while(function() {
         
        var list_10167 = ((loc).value);
        return (list_10167 === null) ? false : true;
      }, function() {
        var _x80 = ((loc).value);
        if (_x80 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x80.tail));
          return _x80.head();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function async_lease_group_fs_dispose(group) /* (group : async-lease-group) -> ui () */  {
  var _x80 = $kokaine_internal_registry.registry_fs_seal_detach(group);
  if (_x80 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    account_async_lease_disposers(_x80.value);
    return run_async_lease_disposers(_x80.value);
  }
}
 
export function run_generation_async_with_host(root, dispatcher, runner, action) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, dispatcher : kokaine/reactive/async/internal/host-turn/host-turn-dispatcher, runner : kokaine/reactive/async/internal/host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>, action : () -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e> ()) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e> () */  {
  return run_generation_async_with_family(root, Async_family($std_core_hnd._open_none0($kokaine_internal_registry.new_registry), $std_core_hnd._open_none0($kokaine_internal_int_dash_index.new_int_index), { value: ($std_core_types.Nil) }, $std_core_hnd._open_none0($kokaine_async_effects.new_runtime_scope_root), dispatcher, runner), action);
}