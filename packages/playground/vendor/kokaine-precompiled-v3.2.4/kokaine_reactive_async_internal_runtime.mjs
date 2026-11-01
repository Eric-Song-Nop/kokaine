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
export function task_payload_fs__mlift_copy_10483(_this, payload_label, payload_portal, _c_x10159) /* forall<a,e> (task-payload<a,e>, payload-label : ? string, payload-portal : ? (kokaine/reactive/integration/internal/reentry/reentry<<ui|e>>), taskresume<e,a>) -> task-payload<a,e> */  {
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
  return Task_payload(_x2, _c_x10159, _x3);
}
 
export function task_payload_fs__copy(_this, payload_portal, payload_resume, payload_label) /* forall<a,e> (task-payload<a,e>, payload-portal : ? (kokaine/reactive/integration/internal/reentry/reentry<<ui|e>>), payload-resume : ? (taskresume<e,a>), payload-label : ? string) -> task-payload<a,e> */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10159 /* taskresume<701,700> */ ) {
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
      return Task_payload(_x4, _c_x10159, _x5);
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
var outstanding_operations = $kokaine_reactive_internal_model.cell(0);
 
 
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
   
  var x_10028 = $kokaine_reactive_internal_model.load(outstanding_operations);
  return $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_10028,1));
}
 
export function decrement_outstanding() /* () -> () */  {
   
  var current = $kokaine_reactive_internal_model.load(outstanding_operations);
  var _x31 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
  return $kokaine_reactive_internal_model.store(outstanding_operations, _x31);
}
 
export function async_lease_group_fs_count(group) /* (group : async-lease-group) -> int */  {
  return $kokaine_internal_registry.load(group.registry_count);
}
 
 
// Keep row-polymorphic family internals out of generated Koka 3.2 `.kki`
// inline bodies; its interface printer otherwise emits an unparseable cache.
export function async_family_fs_scope_is_within(family, child, ancestor) /* forall<e> (family : async-family<e>, child : kokaine/async/effects/async-scope, ancestor : kokaine/async/effects/async-scope) -> bool */  {
  var _x33 = family.family_root_scope;
  var _x32 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(ancestor, _x33);
  if (_x32) {
    return true;
  }
  else {
    return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(child, ancestor);
  }
}
 
export function runtime_fs_is_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> bool */  {
  var _x34 = runtime.family_canceled;
  return $std_core_list.any($kokaine_reactive_internal_model.load(_x34), function(canceled /* kokaine/async/effects/async-scope */ ) {
      var _x36 = runtime.family_root_scope;
      var _x35 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(canceled, _x36);
      if (_x35) {
        return true;
      }
      else {
        return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(scope, canceled);
      }
    });
}
 
export function runtime_fs_record_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
  var _x37 = runtime_fs_is_canceled(runtime, scope);
  if (_x37) {
    return $std_core_types.Unit;
  }
  else {
    var _x38 = runtime.family_canceled;
    var _x39 = runtime.family_canceled;
    return $kokaine_reactive_internal_model.store(_x38, $std_core_types.Cons(scope, $kokaine_reactive_internal_model.load(_x39)));
  }
}
 
 
// Exact removal matters for nested cancellation: releasing a drained child
// must not revive it while an enclosing canceled scope is still live.
export function runtime_fs_release_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
  var _x40 = runtime.family_canceled;
  var _x41 = runtime.family_canceled;
  return $kokaine_reactive_internal_model.store(_x40, $std_core_list.filter($kokaine_reactive_internal_model.load(_x41), function(current /* kokaine/async/effects/async-scope */ ) {
         
        var b_10044 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(current, scope);
        return (b_10044) ? false : true;
      }));
}
 
 
// monadic lift
export function runtime_supervisor_fs__mlift_detach_10484(supervisor, _c_x10160) /* forall<e> (supervisor : runtime-supervisor<e>, ()) -> () */  {
   
  var _x42 = supervisor.supervisor_family;
  var family = $kokaine_reactive_internal_model.load(_x42);
   
  var _x43 = supervisor.supervisor_family;
  $kokaine_reactive_internal_model.store(_x43, $std_core_types.Nothing);
  if (family === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _pat_14_0 = $kokaine_internal_registry.registry_registration_fs_take(family.value);
    return $std_core_types.Unit;
  }
}
 
export function runtime_supervisor_fs_detach(supervisor) /* forall<e> (supervisor : runtime-supervisor<e>) -> () */  {
   
  var _x42 = supervisor.supervisor_bucket_link;
  var link = $kokaine_reactive_internal_model.load(_x42);
   
  var _x43 = supervisor.supervisor_bucket_link;
  $kokaine_reactive_internal_model.store(_x43, $std_core_types.Nothing);
   
  if (link === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _pat_3_1 = $kokaine_internal_registry.registry_registration_fs_take(link.value.link_registration);
    var _x45 = $kokaine_internal_registry.load(link.value.link_bucket.bucket_supervisors.registry_count);
    var _x44 = $std_core_types._int_le(_x45,0);
    if (_x44) {
       
      var _x46 = link.value.link_bucket.bucket_index;
      var index = $kokaine_reactive_internal_model.load(_x46);
       
      var _x47 = link.value.link_bucket.bucket_index;
      $kokaine_reactive_internal_model.store(_x47, $std_core_types.Nothing);
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
   
  var _x46 = supervisor.supervisor_owner;
  var owner = $kokaine_reactive_internal_model.load(_x46);
   
  var _x47 = supervisor.supervisor_owner;
  $kokaine_reactive_internal_model.store(_x47, $std_core_types.Nothing);
   
  if (owner === null) {
    var x_10535 = $std_core_types.Unit;
  }
  else {
     
    var _pat_11_0 = $kokaine_reactive_internal_runtime.cleanup_registration_fs_unregister(owner.value);
    var x_10535 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10160 /* () */ ) {
       
      var _x42 = supervisor.supervisor_family;
      var family = $kokaine_reactive_internal_model.load(_x42);
       
      var _x43 = supervisor.supervisor_family;
      $kokaine_reactive_internal_model.store(_x43, $std_core_types.Nothing);
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
     
    var _x42 = supervisor.supervisor_family;
    var family_0 = $kokaine_reactive_internal_model.load(_x42);
     
    var _x43 = supervisor.supervisor_family;
    $kokaine_reactive_internal_model.store(_x43, $std_core_types.Nothing);
    if (family_0 === null) {
      return $std_core_types.Unit;
    }
    else {
       
      var _pat_14_0_0 = $kokaine_internal_registry.registry_registration_fs_take(family_0.value);
      return $std_core_types.Unit;
    }
  }
}
 
export function runtime_supervisor_fs_claim(supervisor, reason) /* forall<e> (supervisor : runtime-supervisor<e>, reason : kokaine/async/internal/one-shot-task/task-stop-reason) -> list<task-cancellation> */  {
   
  var _x42 = supervisor.supervisor_reason;
  $kokaine_reactive_internal_model.store(_x42, reason);
  var _x43 = supervisor.supervisor_tasks;
  var _x42 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x43);
  if (_x42 === null) {
    return $std_core_types.Nil;
  }
  else {
     
    runtime_supervisor_fs_detach(supervisor);
    return _x42.value;
  }
}
 
export function run_task_cancel_strands(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10060 = ((loc).value);
        return (list_10060 === null) ? false : true;
      }, function() {
        var _x44 = ((loc).value);
        if (_x44 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x44.tail));
          return _x44.head.cancellation_strand();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function run_task_host_disposers(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10064 = ((loc).value);
        return (list_10064 === null) ? false : true;
      }, function() {
        var _x44 = ((loc).value);
        if (_x44 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x44.tail));
          return _x44.head.cancellation_dispose();
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
 
export function runtime_supervisor_bucket_fs_find_frame(bucket, current) /* forall<e> (bucket : runtime-supervisor-bucket<e>, current : kokaine/reactive/internal/model/frame<<ui|e>>) -> maybe<runtime-supervisor<e>> */  {
  var _x44 = bucket.bucket_supervisors;
  return $kokaine_internal_registry.registry_fs_find_readonly(_x44, function(supervisor /* runtime-supervisor<2912> */ ) {
      var _x46 = supervisor.supervisor_bucket_link;
      var _x45 = $kokaine_reactive_internal_model.load(_x46);
      if (_x45 === null) {
        return false;
      }
      else {
        var _x47 = _x45.value.link_frame.lifetime_token;
        var _x48 = current.lifetime_token;
        return Object.is(_x47,_x48);
      }
    });
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10485(bucket, current, supervisor, bucket_registration) /* forall<e> (bucket : runtime-supervisor-bucket<e>, current : kokaine/reactive/internal/model/frame<<ui|e>>, supervisor : runtime-supervisor<e>, bucket-registration : kokaine/internal/registry/registry-registration<runtime-supervisor<e>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_16_10408 = $std_core_hnd._open_none1(function(_this_5 /* runtime-supervisor<3114> */ ) {
      return _this_5.supervisor_bucket_link;
    }, supervisor);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_16_10408, $std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, bucket_registration)));
  return supervisor;
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10486(bucket, current, supervisor, family_registration) /* forall<e> (bucket : runtime-supervisor-bucket<e>, current : kokaine/reactive/internal/model/frame<<ui|e>>, supervisor : runtime-supervisor<e>, family-registration : kokaine/internal/registry/registry-registration<runtime-supervisor<e>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_11_10400 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<3114> */ ) {
      return _this_3.supervisor_family;
    }, supervisor);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_11_10400, $std_core_types.Just(family_registration));
   
  var _x_x1_13_10405 = $std_core_hnd._open_none1(function(_this_4 /* runtime-supervisor-bucket<3114> */ ) {
      return _this_4.bucket_supervisors;
    }, bucket);
   
  var x_10546 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* kokaine/internal/registry/registry<runtime-supervisor<3114>> */ , value_0 /* runtime-supervisor<3114> */ ) {
      var _x49 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_0);
      if (_x49 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x49.value;
      }
    }, _x_x1_13_10405, supervisor);
   
  function next_10547(bucket_registration) /* (kokaine/internal/registry/registry-registration<runtime-supervisor<3114>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|3114> runtime-supervisor<3114> */  {
     
    var _x_x1_16_10408 = $std_core_hnd._open_none1(function(_this_5 /* runtime-supervisor<3114> */ ) {
        return _this_5.supervisor_bucket_link;
      }, supervisor);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_16_10408, $std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, bucket_registration)));
    return supervisor;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10547);
  }
  else {
    return next_10547(x_10546);
  }
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10487(bucket, current, family, supervisor, owner) /* forall<e> (bucket : runtime-supervisor-bucket<e>, current : kokaine/reactive/internal/model/frame<<ui|e>>, family : async-family<e>, supervisor : runtime-supervisor<e>, owner : kokaine/reactive/internal/model/cleanup-registration<<ui|e>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_6_10392 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<3114> */ ) {
      return _this_1.supervisor_owner;
    }, supervisor);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_6_10392, $std_core_types.Just(owner));
   
  var _x_x1_8_10397 = $std_core_hnd._open_none1(function(_this_2 /* async-family<3114> */ ) {
      return _this_2.family_supervisors;
    }, family);
   
  var x_10552 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target /* kokaine/internal/registry/registry<runtime-supervisor<3114>> */ , value /* runtime-supervisor<3114> */ ) {
      var _x49 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target, value);
      if (_x49 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x49.value;
      }
    }, _x_x1_8_10397, supervisor);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(family_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<3114>> */ ) {
      return _mlift_new_runtime_supervisor_10486(bucket, current, supervisor, family_registration);
    });
  }
  else {
    return _mlift_new_runtime_supervisor_10486(bucket, current, supervisor, x_10552);
  }
}
 
export function new_runtime_supervisor(root, family, scope, current, bucket) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, family : async-family<e>, scope : kokaine/async/effects/async-scope, current : kokaine/reactive/internal/model/frame<<ui|e>>, bucket : runtime-supervisor-bucket<e>) -> <kokaine/reactive/effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var supervisor = Runtime_supervisor(scope, $std_core_hnd._open_none0($kokaine_async_internal_cancellation_dash_supervisor.new_cancellation_supervisor), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing));
   
  var x_10554 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
      var actions_0 = $std_core_hnd._open_none2(function(supervisor_0 /* runtime-supervisor<3114> */ , reason /* kokaine/async/internal/one-shot-task/task-stop-reason */ ) {
           
          var _x49 = supervisor_0.supervisor_reason;
          $kokaine_reactive_internal_model.store(_x49, reason);
          var _x50 = supervisor_0.supervisor_tasks;
          var _x49 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x50);
          if (_x49 === null) {
            return $std_core_types.Nil;
          }
          else {
             
            runtime_supervisor_fs_detach(supervisor_0);
            return _x49.value;
          }
        }, supervisor, $kokaine_async_internal_one_dash_shot_dash_task.Task_retired);
      return $std_core_hnd._open_none1(function(actions_1 /* list<task-cancellation> */ ) {
          return $std_core_hnd.finally_prompt(function() {
              return run_task_host_disposers(actions_1);
            }, run_task_cancel_strands(actions_1));
        }, actions_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(owner /* kokaine/reactive/internal/model/cleanup-registration<<ui|3114>> */ ) {
      return _mlift_new_runtime_supervisor_10487(bucket, current, family, supervisor, owner);
    });
  }
  else {
     
    var _x_x1_6_10392 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<3114> */ ) {
        return _this_1.supervisor_owner;
      }, supervisor);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_6_10392, $std_core_types.Just(x_10554));
     
    var _x_x1_8_10397 = $std_core_hnd._open_none1(function(_this_2 /* async-family<3114> */ ) {
        return _this_2.family_supervisors;
      }, family);
     
    var x_0_10559 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target /* kokaine/internal/registry/registry<runtime-supervisor<3114>> */ , value /* runtime-supervisor<3114> */ ) {
        var _x49 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target, value);
        if (_x49 === null) {
          return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
        }
        else {
          return _x49.value;
        }
      }, _x_x1_8_10397, supervisor);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(family_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<3114>> */ ) {
        return _mlift_new_runtime_supervisor_10486(bucket, current, supervisor, family_registration);
      });
    }
    else {
       
      var _x_x1_11_10400 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<3114> */ ) {
          return _this_3.supervisor_family;
        }, supervisor);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_11_10400, $std_core_types.Just(x_0_10559));
       
      var _x_x1_13_10405 = $std_core_hnd._open_none1(function(_this_4 /* runtime-supervisor-bucket<3114> */ ) {
          return _this_4.bucket_supervisors;
        }, bucket);
       
      var x_1_10562 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* kokaine/internal/registry/registry<runtime-supervisor<3114>> */ , value_0 /* runtime-supervisor<3114> */ ) {
          var _x49 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_0);
          if (_x49 === null) {
            return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
          }
          else {
            return _x49.value;
          }
        }, _x_x1_13_10405, supervisor);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(bucket_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<3114>> */ ) {
           
          var _x_x1_16_10408 = $std_core_hnd._open_none1(function(_this_5 /* runtime-supervisor<3114> */ ) {
              return _this_5.supervisor_bucket_link;
            }, supervisor);
           
          $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_16_10408, $std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, bucket_registration)));
          return supervisor;
        });
      }
      else {
         
        var _x_x1_16_10408_0 = $std_core_hnd._open_none1(function(_this_5_0 /* runtime-supervisor<3114> */ ) {
            return _this_5_0.supervisor_bucket_link;
          }, supervisor);
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_16_10408_0, $std_core_types.Just(Runtime_supervisor_bucket_link(current, bucket, x_1_10562)));
        return supervisor;
      }
    }
  }
}
 
 
// monadic lift
export function runtime_fs__mlift_supervisor_10488(bucket_0_0, supervisor_0_0, registration) /* forall<e> (bucket@0@0 : runtime-supervisor-bucket<e>, supervisor@0@0 : runtime-supervisor<e>, registration : kokaine/internal/int-index/int-index-registration<runtime-supervisor-bucket<e>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_10_10426 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor-bucket<3284> */ ) {
      return _this_2.bucket_index;
    }, bucket_0_0);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10_10426, $std_core_types.Just(registration));
  return supervisor_0_0;
}
 
 
// monadic lift
export function runtime_fs__mlift_supervisor_10489(bucket_0_0, family, scope, supervisor_0_0) /* forall<e> (bucket@0@0 : runtime-supervisor-bucket<e>, family : async-family<e>, scope : kokaine/async/effects/async-scope, supervisor@0@0 : runtime-supervisor<e>) -> <kokaine/reactive/effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var _x_x1_7_10421 = $std_core_hnd._open_none1(function(_this_1 /* async-family<3284> */ ) {
      return _this_1.family_index;
    }, family);
   
  var _x_x2_1_10422 = $std_core_hnd._open_none1(function(scope_1 /* kokaine/async/effects/async-scope */ ) {
      var _x50 = (scope_1.ids !== null) ? scope_1.ids.head : 0;
      var _x49 = $std_core_types._int_eq(_x50,0);
      if (_x49) {
        return scope_1.scope_namespace;
      }
      else {
        return (scope_1.ids !== null) ? scope_1.ids.head : 0;
      }
    }, scope);
   
  var x_10569 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_7_10421, _x_x2_1_10422, bucket_0_0);
   
  function next_10570(registration) /* (kokaine/internal/int-index/int-index-registration<runtime-supervisor-bucket<3284>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|3284> runtime-supervisor<3284> */  {
     
    var _x_x1_10_10426 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor-bucket<3284> */ ) {
        return _this_2.bucket_index;
      }, bucket_0_0);
     
    $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10_10426, $std_core_types.Just(registration));
    return supervisor_0_0;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10570);
  }
  else {
    return next_10570(x_10569);
  }
}
 
export function runtime_fs_supervisor(runtime, root, scope) /* forall<e> (runtime : generation-runtime<e>, root : kokaine/reactive/internal/model/root<<ui|e>>, scope : kokaine/async/effects/async-scope) -> <kokaine/reactive/effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var family = $std_core_hnd._open_none1(function(_this /* generation-runtime<3284> */ ) {
      return _this;
    }, runtime);
   
  var _x_x1_1_10413 = $std_core_hnd._open_none1(function(root_0 /* kokaine/reactive/internal/model/root<<ui|3284>> */ ) {
      return root_0.root_effect_plane;
    }, root);
   
  var _x_x1_0_10412 = $std_core_hnd._open_none1(function(plane /* kokaine/reactive/internal/model/plane<<ui|3284>> */ ) {
      return plane.plane_current_frame;
    }, _x_x1_1_10413);
   
  var current = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, _x_x1_0_10412);
   
  var _x_x1_3_10415 = $std_core_hnd._open_none1(function(_this_0 /* async-family<3284> */ ) {
      return _this_0.family_index;
    }, family);
   
  var _x_x2_10416 = $std_core_hnd._open_none1(function(scope_0 /* kokaine/async/effects/async-scope */ ) {
      var _x50 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
      var _x49 = $std_core_types._int_eq(_x50,0);
      if (_x49) {
        return scope_0.scope_namespace;
      }
      else {
        return (scope_0.ids !== null) ? scope_0.ids.head : 0;
      }
    }, scope);
  var _x49 = $std_core_hnd._open_none2($kokaine_internal_int_dash_index.int_index_fs_lookup, _x_x1_3_10415, _x_x2_10416);
  if (_x49 !== null) {
    var _x50 = $std_core_hnd._open_none2(function(bucket_0 /* runtime-supervisor-bucket<3284> */ , current_0 /* kokaine/reactive/internal/model/frame<<ui|3284>> */ ) {
        var _x51 = bucket_0.bucket_supervisors;
        return $kokaine_internal_registry.registry_fs_find_readonly(_x51, function(supervisor /* runtime-supervisor<3284> */ ) {
            var _x53 = supervisor.supervisor_bucket_link;
            var _x52 = $kokaine_reactive_internal_model.load(_x53);
            if (_x52 === null) {
              return false;
            }
            else {
              var _x54 = _x52.value.link_frame.lifetime_token;
              var _x55 = current_0.lifetime_token;
              return Object.is(_x54,_x55);
            }
          });
      }, _x49.value, current);
    if (_x50 !== null) {
      return _x50.value;
    }
    else {
      return new_runtime_supervisor(root, family, scope, current, _x49.value);
    }
  }
  else {
     
    var bucket_0_0 = $std_core_hnd._open_none0(function() {
      return Runtime_supervisor_bucket($kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0)), $kokaine_reactive_internal_model.cell($std_core_types.Nothing));
    });
     
    var x_1_10574 = new_runtime_supervisor(root, family, scope, current, bucket_0_0);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(supervisor_0_0 /* runtime-supervisor<3284> */ ) {
        return runtime_fs__mlift_supervisor_10489(bucket_0_0, family, scope, supervisor_0_0);
      });
    }
    else {
       
      var _x_x1_7_10421 = $std_core_hnd._open_none1(function(_this_1 /* async-family<3284> */ ) {
          return _this_1.family_index;
        }, family);
       
      var _x_x2_1_10422 = $std_core_hnd._open_none1(function(scope_1 /* kokaine/async/effects/async-scope */ ) {
          var _x57 = (scope_1.ids !== null) ? scope_1.ids.head : 0;
          var _x56 = $std_core_types._int_eq(_x57,0);
          if (_x56) {
            return scope_1.scope_namespace;
          }
          else {
            return (scope_1.ids !== null) ? scope_1.ids.head : 0;
          }
        }, scope);
       
      var x_2_10577 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_7_10421, _x_x2_1_10422, bucket_0_0);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(registration /* kokaine/internal/int-index/int-index-registration<runtime-supervisor-bucket<3284>> */ ) {
           
          var _x_x1_10_10426 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor-bucket<3284> */ ) {
              return _this_2.bucket_index;
            }, bucket_0_0);
           
          $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10_10426, $std_core_types.Just(registration));
          return x_1_10574;
        });
      }
      else {
         
        var _x_x1_10_10426_0 = $std_core_hnd._open_none1(function(_this_2_0 /* runtime-supervisor-bucket<3284> */ ) {
            return _this_2_0.bucket_index;
          }, bucket_0_0);
         
        $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_10_10426_0, $std_core_types.Just(x_2_10577));
        return x_1_10574;
      }
    }
  }
}
 
export function task_fs_detach_cancellation(task) /* forall<a,e> (task : generation-task<a,e>) -> () */  {
   
  var _x56 = task.task_cancel;
  var registration = $kokaine_reactive_internal_model.load(_x56);
   
  var _x57 = task.task_cancel;
  $kokaine_reactive_internal_model.store(_x57, $std_core_types.Nothing);
   
  if (registration === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _x58 = registration.value;
    var maybe_10005 = $kokaine_internal_registry.registry_registration_fs_take(_x58);
    $std_core_types.Unit;
  }
  var _x57 = task.task_supervisor.supervisor_tasks;
  var _x56 = $std_core_types._int_le(($kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_count(_x57)),0);
  if (_x56) {
    var _x58 = task.task_supervisor;
    return runtime_supervisor_fs_detach(_x58);
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
      var _x59 = $std_core_types.Cons(values.head, collected);
      values = values.tail;
      collected = _x59;
      continue tailcall;
    }
  }
}}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10490(collected, _c_x10176) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10176, collected);
}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10491(collected_0, _c_x10177) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10177, collected_0);
}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10492(include_all, rest, scope, _c_x10179) /* forall<e> (include-all : bool, rest : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, list<task-cancellation>) -> list<task-cancellation> */  {
  return claim_scope_supervisors_loop(rest, scope, include_all, _c_x10179);
}
 
export function claim_scope_supervisors_loop(supervisors, scope_0, include_all_0, collected_1) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, include-all : bool, collected : list<task-cancellation>) -> div list<task-cancellation> */  { tailcall: while(1)
{
  if (supervisors === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected_1);
  }
  else {
     
    if (include_all_0) {
       
      var _x60 = supervisors.head.supervisor_reason;
      $kokaine_reactive_internal_model.store(_x60, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled);
       
      var _x62 = supervisors.head.supervisor_tasks;
      var _x61 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x62);
      if (_x61 === null) {
        var x_0_10586 = $std_core_types.Nil;
      }
      else {
         
        runtime_supervisor_fs_detach(supervisors.head);
        var x_0_10586 = _x61.value;
      }
      if ($std_core_hnd._yielding()) {
        var x_10583 = $std_core_hnd.yield_extend(function(_c_x10176_0 /* list<task-cancellation> */ ) {
          return _mlift_claim_scope_supervisors_loop_10490(collected_1, _c_x10176_0);
        });
      }
      else {
        var x_10583 = _mlift_claim_scope_supervisors_loop_10490(collected_1, x_0_10586);
      }
    }
    else {
      var _x61 = supervisors.head.supervisor_scope;
      var _x60 = $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(_x61, scope_0);
      if (_x60) {
         
        var _x62 = supervisors.head.supervisor_reason;
        $kokaine_reactive_internal_model.store(_x62, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled);
         
        var _x64 = supervisors.head.supervisor_tasks;
        var _x63 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x64);
        if (_x63 === null) {
          var x_1_10588 = $std_core_types.Nil;
        }
        else {
           
          runtime_supervisor_fs_detach(supervisors.head);
          var x_1_10588 = _x63.value;
        }
        if ($std_core_hnd._yielding()) {
          var x_10583 = $std_core_hnd.yield_extend(function(_c_x10177_0 /* list<task-cancellation> */ ) {
            return _mlift_claim_scope_supervisors_loop_10491(collected_1, _c_x10177_0);
          });
        }
        else {
          var x_10583 = _mlift_claim_scope_supervisors_loop_10491(collected_1, x_1_10588);
        }
      }
      else {
        var x_10583 = collected_1;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10179_0 /* list<task-cancellation> */ ) {
        return _mlift_claim_scope_supervisors_loop_10492(include_all_0, supervisors.tail, scope_0, _c_x10179_0);
      });
    }
    else {
      {
        // tail call
        supervisors = supervisors.tail;
        collected_1 = x_10583;
        continue tailcall;
      }
    }
  }
}}
 
export function claim_scope_supervisors(supervisors, scope, include_all) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, include-all : bool) -> div list<task-cancellation> */  {
  return claim_scope_supervisors_loop(supervisors, scope, include_all, $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_cancel_runtime_scope_10493(actions) /* forall<e> (actions : list<task-cancellation>) -> <div,ui,exn,kokaine/reactive/effects/signal-write|e> () */  {
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
   
  var _x_x1_2_10435 = $std_core_hnd._open_none1(function(_this_0 /* async-family<3792> */ ) {
      return _this_0.family_supervisors;
    }, family);
   
  var _x_x1_1_10432 = $std_core_hnd._open_none1(function(target /* kokaine/internal/registry/registry<runtime-supervisor<3792>> */ ) {
      return $kokaine_internal_registry.snapshot_loop($kokaine_internal_registry.load(target.registry_head), $std_core_types.Nil);
    }, _x_x1_2_10435);
   
  var _x_x2_1_10438 = $std_core_hnd._open_none1(function(_this_1 /* async-family<3792> */ ) {
      return _this_1.family_root_scope;
    }, family);
   
  var _x_x3_10434 = $std_core_hnd._open_none2($kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_, scope, _x_x2_1_10438);
   
  var x_10592 = $std_core_hnd._open_none3(function(supervisors /* list<runtime-supervisor<3792>> */ , scope_0 /* kokaine/async/effects/async-scope */ , include_all /* bool */ ) {
      return claim_scope_supervisors_loop(supervisors, scope_0, include_all, $std_core_types.Nil);
    }, _x_x1_1_10432, scope, _x_x3_10434);
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
      }, x_10592);
  }
}
 
export function release_runtime_scope(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
  return runtime_fs_release_canceled(runtime, scope);
}
 
 
// monadic lift
export function _mlift_register_owned_disposer_10494(committed, disposer_slot, registration) /* forall<e> (committed : ref<global,bool>, disposer-slot : ref<global,maybe<kokaine/async/effects/dispose-fn>>, registration : kokaine/reactive/internal/model/cleanup-registration<<ui|e>>) -> <exn,ui,div,kokaine/reactive/effects/signal-write|e> (() -> ui bool) */  {
   
  $std_core_hnd._open_none0(function() {
     
    var x_0_10089 = $kokaine_reactive_internal_model.load(outstanding_operations);
    return $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_0_10089,1));
  });
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, committed, true);
  return function() {
     
    var b_10091 = $kokaine_reactive_internal_runtime.cleanup_registration_fs_unregister(registration);
    if (b_10091) {
       
      var current_0_0 = $kokaine_reactive_internal_model.load(disposer_slot);
       
      $kokaine_reactive_internal_model.store(disposer_slot, $std_core_types.Nothing);
      if (current_0_0 === null) {
        return false;
      }
      else {
         
        var current_1 = $kokaine_reactive_internal_model.load(outstanding_operations);
         
        var _x60 = ($std_core_types._int_le(current_1,0)) ? 0 : $std_core_types._int_sub(current_1,1);
        $kokaine_reactive_internal_model.store(outstanding_operations, _x60);
        return true;
      }
    }
    else {
      return false;
    }
  };
}
 
 
// Some host resources outlive the await which creates them. Register their
// disposer directly with the current reactive generation and return a
// one-shot release action for ownership transfer. Both paths consume the same
// slot before unlinking or invoking host code, so re-entry cannot double-run
// either transition.
export function register_owned_disposer(root, dispose) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, dispose : kokaine/async/effects/dispose-fn) -> <kokaine/reactive/effects/signal-write,pure,ui|e> kokaine/async/effects/ownership-release-fn */  {
   
  var disposer_slot = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Just(dispose));
   
  var committed = $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, false);
   
  var x_10599 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
      var current = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, disposer_slot);
       
      $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, disposer_slot, $std_core_types.Nothing);
      if (current === null) {
        return $std_core_types.Unit;
      }
      else {
         
        $std_core_hnd._open_none0(function() {
           
          var current_0 = $kokaine_reactive_internal_model.load(outstanding_operations);
          var _x60 = ($std_core_types._int_le(current_0,0)) ? 0 : $std_core_types._int_sub(current_0,1);
          return $kokaine_reactive_internal_model.store(outstanding_operations, _x60);
        });
        return $std_core_hnd._open_none0(current.value);
      }
    });
  if ($std_core_hnd._yielding()) {
    var _x61 = $std_core_hnd.yield_extend(function(registration /* kokaine/reactive/internal/model/cleanup-registration<<ui|4006>> */ ) {
      return _mlift_register_owned_disposer_10494(committed, disposer_slot, registration);
    });
  }
  else {
    var _x61 = _mlift_register_owned_disposer_10494(committed, disposer_slot, x_10599);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x60 = $std_core_hnd._open_none1($kokaine_reactive_internal_model.load, committed);
      if (_x60) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_hnd._open_none0(dispose);
      }
    }, _x61);
}
 
 
// monadic lift
export function _mlift_register_task_10495(family_0, setup, task_0_0, cancellation_0) /* forall<a,e> (family@0 : async-family<e>, setup : kokaine/async/effects/await-setup<a>, task@0@0 : generation-task<a,e>, cancellation@0 : kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>) -> <exn,div,ui,kokaine/reactive/effects/signal-write|e> () */  {
   
  var _x_x1_6_10459 = $std_core_hnd._open_none1(function(_this_3 /* generation-task<6551,6552> */ ) {
      return _this_3.task_cancel;
    }, task_0_0);
   
  $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_6_10459, $std_core_types.Just(cancellation_0));
   
  $std_core_hnd._open_none0(function() {
     
    var x_10104 = $kokaine_reactive_internal_model.load(outstanding_operations);
    return $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_10104,1));
  });
  var _x62 = $std_core_hnd._open_none1(setup, function(result_0_0 /* kokaine/async/effects/await-result<6551> */ ) {
      return accept_task_result(task_0_0, family_0, result_0_0);
    });
  if (_x62._tag === 1) {
    return $std_core_hnd._open_none3(accept_task_result, task_0_0, family_0, $kokaine_async_effects.Exception(_x62.error));
  }
  else {
     
    var _x_x1_10_10466 = $std_core_hnd._open_none1(function(_this_4 /* generation-task<6551,6552> */ ) {
        return _this_4.task_state;
      }, task_0_0);
    var _x63 = $std_core_hnd._open_none2($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_10_10466, _x62.value);
    if (_x63 === null) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_hnd._open_none0(_x63.value);
    }
  }
}
 
 
// monadic lift
export function _mlift_register_task_10496(family_0_0, label, portal, resume_action, setup_0, supervisor) /* forall<a,e> (family@0 : async-family<e>, label : string, portal : kokaine/reactive/integration/internal/reentry/reentry<<ui|e>>, resume-action : (kokaine/async/effects/await-result<a>) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e> (), setup : kokaine/async/effects/await-setup<a>, supervisor : runtime-supervisor<e>) -> <kokaine/reactive/effects/signal-write,pure,ui|e> () */  {
   
  var state = $std_core_hnd._open_none1(function(payload_0 /* task-payload<6551,6552> */ ) {
      return $kokaine_async_internal_one_dash_shot_dash_task.cell($kokaine_async_internal_one_dash_shot_dash_task.Task_state_pending(payload_0, $std_core_types.Nothing));
    }, Task_payload(portal, resume_action, label));
   
  var task_0_0_0 = Generation_task(state, supervisor, $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing));
   
  var _x_x1_4_10456 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor<6552> */ ) {
      return _this_2.supervisor_tasks;
    }, supervisor);
   
  var x_10601 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_4_10456, function() {
      return task_fs_claim_stop(task_0_0_0, family_0_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(cancellation_0_0 /* kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
      return _mlift_register_task_10495(family_0_0, setup_0, task_0_0_0, cancellation_0_0);
    });
  }
  else {
    return _mlift_register_task_10495(family_0_0, setup_0, task_0_0_0, x_10601);
  }
}
 
 
// monadic lift
export function _mlift_register_task_10497(label_0, resume_action_0, root, runtime, scope, setup_1, portal_0) /* forall<a,e> (label : string, resume-action : (kokaine/async/effects/await-result<a>) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e> (), root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, setup : kokaine/async/effects/await-setup<a>, portal : kokaine/reactive/integration/internal/reentry/reentry<<ui|e>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e> () */  {
   
  var family_0_1 = $std_core_hnd._open_none1(function(_this_1 /* generation-runtime<6552> */ ) {
      return _this_1;
    }, runtime);
   
  var x_0_10603 = runtime_fs_supervisor(runtime, root, scope);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(supervisor_0 /* runtime-supervisor<6552> */ ) {
      return _mlift_register_task_10496(family_0_1, label_0, portal_0, resume_action_0, setup_1, supervisor_0);
    });
  }
  else {
    return _mlift_register_task_10496(family_0_1, label_0, portal_0, resume_action_0, setup_1, x_0_10603);
  }
}
 
 
// monadic lift
export function _mlift_register_task_10498(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, wild___0) /* forall<a,e> (label : string, resume-action : (kokaine/async/effects/await-result<a>) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e> (), root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, setup : kokaine/async/effects/await-setup<a>, wild_@0 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e> () */  {
   
  var x_1_10605 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_integration_internal_reentry.capture_reentry, root_0);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal_1 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|6552>> */ ) {
      return _mlift_register_task_10497(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, portal_1);
    });
  }
  else {
    return _mlift_register_task_10497(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, x_1_10605);
  }
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10499(label_0_0, rcontext, root_0_0, runtime_0_0, scope_0_0, setup_0_0, _y_x10201) /* forall<a,e> (label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10201, false, function() {
      return register_task(root_0_0, runtime_0_0, scope_0_0, label_0_0, setup_0_0, function(result_1 /* kokaine/async/effects/await-result<4611> */ ) {
          return $std_core_hnd.resume_shallow(rcontext, result_1);
        });
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10500(family_1, label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10198) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10198, false, function() {
      var _x64 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_1, scope_0_1);
      if (_x64) {
        return resume_generation(root_0_1, family_1, function() {
            return $std_core_hnd.resume_shallow(rcontext_0, $kokaine_async_effects.Cancel);
          });
      }
      else {
         
        var x_2_10607 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10201_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10499(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10201_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10499(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, x_2_10607);
        }
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10501(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10197) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10197, false, function() {
       
      var x_3_10609 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10198_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10500(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10198_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10500(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, x_3_10609);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10502(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10196) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10196, false, function() {
       
      var x_4_10611 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10197_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10501(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10197_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10501(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, x_4_10611);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10503(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10195) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10195, false, function() {
       
      var x_5_10613 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10196_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10502(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10196_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10502(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, x_5_10613);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10504(callback, label_0_0_0, root_0_5, runtime_0_5, scope_0_0_0, setup_0_0_0, _y_x10214) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10214, false, function() {
      return register_task(root_0_5, runtime_0_5, scope_0_0_0, label_0_0_0, setup_0_0_0, function(result_0_0_0 /* kokaine/async/effects/await-result<4730> */ ) {
          return $std_core_hnd._open_none1(callback, result_0_0_0);
        });
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10505(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10213) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10213, false, function() {
      var _x65 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_6, scope_0_0_1);
      if (_x65) {
        return $std_core_hnd._open_none1(callback_0, $kokaine_async_effects.Cancel);
      }
      else {
         
        var x_6_10615 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10214_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10504(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10214_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10504(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, x_6_10615);
        }
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10506(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10212) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10212, false, function() {
       
      var x_7_10617 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10213_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10505(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10213_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10505(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, x_7_10617);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10507(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10211) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10211, false, function() {
       
      var x_8_10619 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10212_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10506(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10212_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10506(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, x_8_10619);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10508(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10210) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10210, false, function() {
       
      var x_9_10621 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10211_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10507(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10211_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10507(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, x_9_10621);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10509(host_action, _y_x10225) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <exn,div,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10225, false, host_action);
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10510(host_action_0, _y_x10224) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10224, false, function() {
       
      var x_10_10624 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10225_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10509(host_action_0, _y_x10225_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10509(host_action_0, x_10_10624);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10511(host_action_1, _y_x10223) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10223, false, function() {
       
      var x_11_10626 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10224_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10510(host_action_1, _y_x10224_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10510(host_action_1, x_11_10626);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10512(host_action_0_0, root_1, runtime_1, scope_1, _y_x10230) /* forall<e> (host-action@0 : () -> ui (), root@1 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@1 : generation-runtime<e>, scope@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10230, false, function() {
      return register_scheduled_ioc(root_1, runtime_1, scope_1, host_action_0_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10513(dispose_0, root_1_0, _y_x10234) /* forall<e> (dispose@0 : kokaine/async/effects/dispose-fn, root@1 : kokaine/reactive/internal/model/root<<ui|e>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10234, false, function() {
      return register_owned_disposer(root_1_0, dispose_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10514(dispose_0_0, root_1_1, _y_x10233) /* forall<e> (dispose@0 : kokaine/async/effects/dispose-fn, root@1 : kokaine/reactive/internal/model/root<<ui|e>>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10233, false, function() {
       
      var x_12_10628 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10234_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10513(dispose_0_0, root_1_1, _y_x10234_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10513(dispose_0_0, root_1_1, x_12_10628);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10515(runtime_1_0, scope_0_1_0, _y_x10240) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10240, false, function() {
      return cancel_runtime_scope(runtime_1_0, scope_0_1_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10516(runtime_1_1, scope_0_1_1, _y_x10239) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10239, false, function() {
       
      var x_13_10630 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10240_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10515(runtime_1_1, scope_0_1_1, _y_x10240_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10515(runtime_1_1, scope_0_1_1, x_13_10630);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10517(runtime_1_2, scope_0_1_2, _y_x10238) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10238, false, function() {
       
      var x_14_10632 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10239_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10516(runtime_1_2, scope_0_1_2, _y_x10239_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10516(runtime_1_2, scope_0_1_2, x_14_10632);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10518(runtime_1_3, scope_1_0, _y_x10249) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <exn,div|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10249, false, function() {
      return runtime_fs_is_canceled(runtime_1_3, scope_1_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10519(runtime_1_4, scope_1_0_0, _y_x10248) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10248, false, function() {
       
      var x_15_10636 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10249_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10518(runtime_1_4, scope_1_0_0, _y_x10249_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10518(runtime_1_4, scope_1_0_0, x_15_10636);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10520(runtime_1_5, scope_1_0_1, _y_x10247) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10247, false, function() {
       
      var x_16_10638 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10248_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10519(runtime_1_5, scope_1_0_1, _y_x10248_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10519(runtime_1_5, scope_1_0_1, x_16_10638);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10521(runtime_1_6, scope_1_0_2, _y_x10246) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10246, false, function() {
       
      var x_17_10640 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10247_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10520(runtime_1_6, scope_1_0_2, _y_x10247_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10520(runtime_1_6, scope_1_0_2, x_17_10640);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10522(runtime_1_7, scope_1_0_3, _y_x10245) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10245, false, function() {
       
      var x_18_10642 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10246_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10521(runtime_1_7, scope_1_0_3, _y_x10246_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10521(runtime_1_7, scope_1_0_3, x_18_10642);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10523(runtime_1_8, scope_2, _y_x10261) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <exn,div|e> () */  {
  return $std_core_hnd._mask_at(_y_x10261, false, function() {
      return release_runtime_scope(runtime_1_8, scope_2);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10524(runtime_1_9, scope_2_0, _y_x10260) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10260, false, function() {
       
      var x_19_10646 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10261_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10523(runtime_1_9, scope_2_0, _y_x10261_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10523(runtime_1_9, scope_2_0, x_19_10646);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10525(runtime_1_10, scope_2_1, _y_x10259) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10259, false, function() {
       
      var x_20_10648 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10260_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10524(runtime_1_10, scope_2_1, _y_x10260_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10524(runtime_1_10, scope_2_1, x_20_10648);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10526(runtime_1_11, scope_2_2, _y_x10258) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10258, false, function() {
       
      var x_21_10650 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10259_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10525(runtime_1_11, scope_2_2, _y_x10259_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10525(runtime_1_11, scope_2_2, x_21_10650);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10527(runtime_1_12, scope_2_3, _y_x10257) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10257, false, function() {
       
      var x_22_10652 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10258_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10526(runtime_1_12, scope_2_3, _y_x10258_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10526(runtime_1_12, scope_2_3, x_22_10652);
      }
    });
}
 
export function accept_task_result(task, family, result) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>, result : kokaine/async/effects/await-result<a>) -> <div,ui> () */  {
  var _x67 = task.task_state;
  var _x66 = $kokaine_async_internal_one_dash_shot_dash_task.load(_x67);
  if (_x66._tag === 1) {
     
    var _x68 = task.task_state;
    $kokaine_async_internal_one_dash_shot_dash_task.store(_x68, $kokaine_async_internal_one_dash_shot_dash_task.Task_state_ready(_x66.pending_payload, result, _x66.pending_disposer));
    var _x69 = family.family_dispatcher;
    var _x68 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_dispatcher_fs_dispatch(_x69, function() {
        return run_task_result(task, family);
      });
    if (_x68) {
      return $std_core_types.Unit;
    }
    else {
       
      var rejected = task_fs_claim_dispatch_rejection(task, family);
      if (rejected === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var actions_10102 = $std_core_types.Cons(rejected.value, $std_core_types.Nil);
        return $std_core_hnd.finally_prompt(function() {
            return run_task_host_disposers(actions_10102);
          }, run_task_cancel_strands(actions_10102));
      }
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function register_task(root_2, runtime_2, scope_3, label_2, setup_3, resume_action_2) /* forall<a,e> (root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, label : string, setup : kokaine/async/effects/await-setup<a>, resume-action : (kokaine/async/effects/await-result<a>) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> ()) -> <pure,kokaine/reactive/effects/signal-write,ui|e> () */  {
   
  var x_23_10657 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "async suspension");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0_0 /* () */ ) {
      return _mlift_register_task_10498(label_2, resume_action_2, root_2, runtime_2, scope_3, setup_3, wild___0_0);
    });
  }
  else {
     
    var x_24_10660 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_integration_internal_reentry.capture_reentry, root_2);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(portal_2 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|6552>> */ ) {
        return _mlift_register_task_10497(label_2, resume_action_2, root_2, runtime_2, scope_3, setup_3, portal_2);
      });
    }
    else {
       
      var family_0_2 = $std_core_hnd._open_none1(function(_this_1_0 /* generation-runtime<6552> */ ) {
          return _this_1_0;
        }, runtime_2);
       
      var x_25_10663 = runtime_fs_supervisor(runtime_2, root_2, scope_3);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(supervisor_1 /* runtime-supervisor<6552> */ ) {
          return _mlift_register_task_10496(family_0_2, label_2, x_24_10660, resume_action_2, setup_3, supervisor_1);
        });
      }
      else {
         
        var state_0 = $std_core_hnd._open_none1(function(payload_0_0 /* task-payload<6551,6552> */ ) {
            return $kokaine_async_internal_one_dash_shot_dash_task.cell($kokaine_async_internal_one_dash_shot_dash_task.Task_state_pending(payload_0_0, $std_core_types.Nothing));
          }, Task_payload(x_24_10660, resume_action_2, label_2));
         
        var task_0_0_1 = Generation_task(state_0, x_25_10663, $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nothing));
         
        var _x_x1_4_10456_0 = $std_core_hnd._open_none1(function(_this_2_0 /* runtime-supervisor<6552> */ ) {
            return _this_2_0.supervisor_tasks;
          }, x_25_10663);
         
        var x_26_10666 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_4_10456_0, function() {
            return task_fs_claim_stop(task_0_0_1, family_0_2);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(cancellation_0_1 /* kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
            return _mlift_register_task_10495(family_0_2, setup_3, task_0_0_1, cancellation_0_1);
          });
        }
        else {
           
          var _x_x1_6_10459_0 = $std_core_hnd._open_none1(function(_this_3_0 /* generation-task<6551,6552> */ ) {
              return _this_3_0.task_cancel;
            }, task_0_0_1);
           
          $std_core_hnd._open_none2($kokaine_reactive_internal_model.store, _x_x1_6_10459_0, $std_core_types.Just(x_26_10666));
           
          $std_core_hnd._open_none0(function() {
             
            var x_10104_0 = $kokaine_reactive_internal_model.load(outstanding_operations);
            return $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_10104_0,1));
          });
          var _x70 = $std_core_hnd._open_none1(setup_3, function(result_0_0_1 /* kokaine/async/effects/await-result<6551> */ ) {
              return accept_task_result(task_0_0_1, family_0_2, result_0_0_1);
            });
          if (_x70._tag === 1) {
            return $std_core_hnd._open_none3(accept_task_result, task_0_0_1, family_0_2, $kokaine_async_effects.Exception(_x70.error));
          }
          else {
             
            var _x_x1_10_10466_0 = $std_core_hnd._open_none1(function(_this_4_0 /* generation-task<6551,6552> */ ) {
                return _this_4_0.task_state;
              }, task_0_0_1);
            var _x71 = $std_core_hnd._open_none2($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_10_10466_0, _x70.value);
            if (_x71 === null) {
              return $std_core_types.Unit;
            }
            else {
              return $std_core_hnd._open_none0(_x71.value);
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
             
            var x_28_10670 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
             
            function next_27_10671(_y_x10195_0) /* (hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|6562> () */  {
              return _mlift_interpret_generation_await_10503(family_1_3, x_27.thd, k, root_0_10, runtime_0_10, x_27.snd, x_27.fst, _y_x10195_0);
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_27_10671);
            }
            else {
              return next_27_10671(x_28_10670);
            }
          });
      }, $std_core_hnd.clause_tail1(function(_pat_x789__20 /* (kokaine/async/effects/await-setup<_4433>, kokaine/async/effects/async-scope, string, (kokaine/async/effects/await-result<_4433>) -> ui ()) */ ) {
         
        var x_29_10673 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10210_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10508(_pat_x789__20.field4, _pat_x789__20.thd, root_0_10, runtime_0_10, _pat_x789__20.snd, _pat_x789__20.fst, _y_x10210_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10508(_pat_x789__20.field4, _pat_x789__20.thd, root_0_10, runtime_0_10, _pat_x789__20.snd, _pat_x789__20.fst, x_29_10673);
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
         
        var x_30_10675 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10223_0 /* hnd/ev-index */ ) {
            return _mlift_run_generation_async_with_family_10511(host_action_2, _y_x10223_0);
          });
        }
        else {
          return _mlift_run_generation_async_with_family_10511(host_action_2, x_30_10675);
        }
      }), function(m_0 /* hnd/marker<<div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|6569>,()> */ , ev /* hnd/ev<kokaine/async/effects/async-ioc> */ , x1_1 /* kokaine/async/effects/async-scope */ , x2_1 /* () -> ui () */ ) {
        return $std_core_hnd.under2(ev, function(scope_1_1 /* kokaine/async/effects/async-scope */ , host_action_0_1 /* () -> ui () */ ) {
             
            var x_31_10678 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10230_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10512(host_action_0_1, root_1_2, runtime_1_13, scope_1_1, _y_x10230_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10512(host_action_0_1, root_1_2, runtime_1_13, scope_1_1, x_31_10678);
            }
          }, x1_1, x2_1);
      }), function(_res_0 /* () */ ) {
      return _res_0;
    }, function() {
      return $kokaine_async_effects.async_ownership_fs__handle($kokaine_async_effects._Hnd_async_ownership(1, $std_core_hnd.clause_tail1(function(dispose_0_1 /* kokaine/async/effects/dispose-fn */ ) {
             
            var x_32_10680 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10233_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10514(dispose_0_1, root_1_2, _y_x10233_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10514(dispose_0_1, root_1_2, x_32_10680);
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
                 
                var x_33_10682 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10238_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10517(runtime_1_13, scope_0_1_3, _y_x10238_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10517(runtime_1_13, scope_0_1_3, x_33_10682);
                }
              }), $std_core_hnd.clause_tail1(function(scope_1_0_4 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_34_10684 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10245_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10522(runtime_1_13, scope_1_0_4, _y_x10245_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10522(runtime_1_13, scope_1_0_4, x_34_10684);
                }
              }), $std_core_hnd.clause_tail1(function(scope_2_4 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_35_10686 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10257_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10527(runtime_1_13, scope_2_4, _y_x10257_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10527(runtime_1_13, scope_2_4, x_35_10686);
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
  var _x74 = task_1.task_state;
  var _x73 = $kokaine_async_internal_one_dash_shot_dash_task.load(_x74);
  if (_x73._tag === 2) {
    var _x72 = $std_core_types.Just(_x73.ready_payload);
  }
  else {
    var _x72 = $std_core_types.Nothing;
  }
  if (_x72 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var b_10117 = $kokaine_reactive_integration_internal_reentry.reentry_fs_can_run_live(_x72.value.payload_portal);
    if (b_10117) {
      var _x76 = task_1.task_state;
      var _x75 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_ready(_x76);
      if (_x75 === null) {
        return $std_core_types.Unit;
      }
      else {
         
        task_fs_detach_cancellation(task_1);
         
        var current = $kokaine_reactive_internal_model.load(outstanding_operations);
         
        var _x77 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
        $kokaine_reactive_internal_model.store(outstanding_operations, _x77);
        return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_2 /* hnd/marker<ui,()> */ , ___wildcard_x654__16 /* hnd/ev<exn> */ , x_36 /* exception */ ) {
              return $std_core_hnd.yield_to_final(m_2, function(___wildcard_x654__45 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
                  var _x77 = x_36.message;
                  return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async exception (", $std_core_types._lp__plus__plus__rp_(_x75.value.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x77))));
                });
            }), function(_res_3 /* () */ ) {
            return _res_3;
          }, function() {
            if (_x75.value.claim_result === null) {
              var _x78 = $std_core_types.Unit;
            }
            else {
               
              var root_3_0 = $std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/internal/reentry/reentry<<ui|6585>> */ ) {
                  return value.reentry_root;
                }, _x75.value.claim_payload.payload_portal);
              var _x78 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_runner_fs_run($std_core_hnd._open_none1(function(_this_9 /* async-family<6585> */ ) {
                    return _this_9.family_runner;
                  }, family_4), function() {
                  return $kokaine_reactive_integration_internal_reentry.run_reentry(_x75.value.claim_payload.payload_portal, function() {
                      return resume_generation(root_3_0, family_4, function() {
                          return _x75.value.claim_payload.payload_resume(_x75.value.claim_result.value);
                        });
                    });
                });
            }
            return $std_core_hnd.finally_prompt(function() {
                 
                var _x_x1_10476 = $std_core_hnd._open_none1(function(_this_8 /* generation-task<6584,6585> */ ) {
                    return _this_8.task_state;
                  }, task_1);
                 
                var _pat_15_0_0 = $std_core_hnd._open_none1(function(task_3 /* kokaine/async/internal/one-shot-task/one-shot-task<task-payload<6584,6585>,kokaine/async/effects/await-result<6584>,kokaine/async/effects/dispose-fn> */ ) {
                    var _x79 = task_3;
                    var _x78 = $kokaine_async_internal_one_dash_shot_dash_task.load(_x79);
                    if (_x78._tag === 3) {
                       
                      var _x80 = task_3;
                      $kokaine_async_internal_one_dash_shot_dash_task.store(_x80, $kokaine_async_internal_one_dash_shot_dash_task.Task_state_terminal($kokaine_async_internal_one_dash_shot_dash_task.Task_completed));
                      return true;
                    }
                    else {
                      return false;
                    }
                  }, _x_x1_10476);
                return $std_core_types.Unit;
              }, _x78);
          });
      }
    }
    else {
       
      var retired = task_fs_claim_retired_ready(task_1, family_4);
      if (retired === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var actions_0_10119 = $std_core_types.Cons(retired.value, $std_core_types.Nil);
        return $std_core_hnd.finally_prompt(function() {
            return run_task_host_disposers(actions_0_10119);
          }, run_task_cancel_strands(actions_0_10119));
      }
    }
  }
}
 
export function stopped_task_cancellation(family_5, claim, reentry) /* forall<a,e> (family : async-family<e>, claim : kokaine/async/internal/one-shot-task/task-claim<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn>, reentry : cancellation-reentry) -> div task-cancellation */  {
  return Task_cancellation(function() {
      return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_3 /* hnd/marker<ui,()> */ , ___wildcard_x654__16_0 /* hnd/ev<exn> */ , x_37 /* exception */ ) {
            return $std_core_hnd.yield_to_final(m_3, function(___wildcard_x654__45_0 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
                var _x79 = x_37.message;
                return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async cancellation exception (", $std_core_types._lp__plus__plus__rp_(claim.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x79))));
              });
          }), function(_res_4 /* () */ ) {
          return _res_4;
        }, function() {
           
          var root_4_0 = $std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|6597>> */ ) {
              return value_0.reentry_root;
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
 
export function task_fs_claim_detached_stop(task_2_0, family_6, reason, reentry_0) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>, reason : kokaine/async/internal/one-shot-task/task-stop-reason, reentry : cancellation-reentry) -> div maybe<task-cancellation> */  {
  var _x81 = task_2_0.task_state;
  var _x80 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_stop(_x81, reason);
  if (_x80 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    task_fs_detach_cancellation(task_2_0);
     
    var current_0 = $kokaine_reactive_internal_model.load(outstanding_operations);
     
    var _x82 = ($std_core_types._int_le(current_0,0)) ? 0 : $std_core_types._int_sub(current_0,1);
    $kokaine_reactive_internal_model.store(outstanding_operations, _x82);
    return $std_core_types.Just(stopped_task_cancellation(family_6, _x80.value, reentry_0));
  }
}
 
export function task_fs_claim_dispatch_rejection(task_3_0, family_7) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
  return task_fs_claim_detached_stop(task_3_0, family_7, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled, Cancellation_live_or_retirement);
}
 
export function task_fs_claim_retired_ready(task_4, family_8) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
  return task_fs_claim_detached_stop(task_4, family_8, $kokaine_async_internal_one_dash_shot_dash_task.Task_retired, Cancellation_retirement);
}
 
export function task_fs_claim_stop(task_5, family_9) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
   
  var _x82 = task_5.task_supervisor.supervisor_reason;
  var reason_0 = $kokaine_reactive_internal_model.load(_x82);
  var _x83 = task_5.task_state;
  var _x82 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_stop(_x83, reason_0);
  if (_x82 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    var _x84 = task_5.task_cancel;
    $kokaine_reactive_internal_model.store(_x84, $std_core_types.Nothing);
     
    var current_1 = $kokaine_reactive_internal_model.load(outstanding_operations);
     
    var _x85 = ($std_core_types._int_le(current_1,0)) ? 0 : $std_core_types._int_sub(current_1,1);
    $kokaine_reactive_internal_model.store(outstanding_operations, _x85);
    return $std_core_types.Just(stopped_task_cancellation(family_9, _x82.value, Cancellation_retirement));
  }
}
 
 
// Scheduled host actions are ordinary generation-owned tasks. Keep their
// structural phase evidence live through registration; erasing it would make
// owner cleanup masks invalid at runtime on Koka's JavaScript backend.
export function register_scheduled_ioc(root_5, runtime_2_0, scope_3_0, host_action_1_0) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, host-action : () -> ui ()) -> <pure,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return register_task(root_5, runtime_2_0, scope_3_0, "scheduled host action", function(resume /* (kokaine/async/effects/await-result<()>) -> ui () */ ) {
      var _x85 = runtime_2_0.family_dispatcher;
      var _x84 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_dispatcher_fs_dispatch(_x85, function() {
          return resume($kokaine_async_effects.Result($std_core_types.Unit));
        });
      if (_x84) {
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
  return $kokaine_reactive_internal_model.load(outstanding_operations);
}
 
export function new_async_lease_group() /* () -> async-lease-group */  {
  return $kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0));
}
 
export function async_lease_group_fs_has_linked_entries(group) /* (group : async-lease-group) -> bool */  {
  return $kokaine_internal_registry.registry_fs_has_linked_nodes(group);
}
 
export function async_lease_release(registration) /* (registration : kokaine/internal/registry/registry-registration<kokaine/async/effects/dispose-fn>) -> kokaine/async/effects/ownership-release-fn */  {
  return function() {
    var _x86 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    if (_x86 === null) {
      return false;
    }
    else {
       
      var current = $kokaine_reactive_internal_model.load(outstanding_operations);
       
      var _x87 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
      $kokaine_reactive_internal_model.store(outstanding_operations, _x87);
      return true;
    }
  };
}
 
export function async_lease_group_fs_own(group, dispose) /* (group : async-lease-group, dispose : kokaine/async/effects/dispose-fn) -> ui kokaine/async/effects/ownership-release-fn */  {
  var _x87 = $kokaine_internal_registry.registry_fs_try_insert(group, dispose);
  if (_x87 === null) {
     
    dispose();
    return function() {
      return false;
    };
  }
  else {
     
    var x_10145 = $kokaine_reactive_internal_model.load(outstanding_operations);
     
    $kokaine_reactive_internal_model.store(outstanding_operations, $std_core_types._int_add(x_10145,1));
    return async_lease_release(_x87.value);
  }
}
 
export function account_async_lease_disposers(disposers) /* (disposers : list<kokaine/async/effects/dispose-fn>) -> () */  {
  return function() {
     
    var loc = { value: disposers };
     
    var res = $std_core.$while(function() {
         
        var list_10150 = ((loc).value);
        return (list_10150 === null) ? false : true;
      }, function() {
        var _x88 = ((loc).value);
        if (_x88 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x88.tail));
           
          var current = $kokaine_reactive_internal_model.load(outstanding_operations);
          var _x89 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
          return $kokaine_reactive_internal_model.store(outstanding_operations, _x89);
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function run_async_lease_disposers(disposers) /* (disposers : list<kokaine/async/effects/dispose-fn>) -> ui () */  {
  return function() {
     
    var loc = { value: disposers };
     
    var res = $std_core.$while(function() {
         
        var list_10156 = ((loc).value);
        return (list_10156 === null) ? false : true;
      }, function() {
        var _x88 = ((loc).value);
        if (_x88 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x88.tail));
          return _x88.head();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function async_lease_group_fs_dispose(group) /* (group : async-lease-group) -> ui () */  {
  var _x88 = $kokaine_internal_registry.registry_fs_seal_detach(group);
  if (_x88 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    account_async_lease_disposers(_x88.value);
    return run_async_lease_disposers(_x88.value);
  }
}
 
export function run_generation_async_with_host(root, dispatcher, runner, action) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, dispatcher : kokaine/reactive/async/internal/host-turn/host-turn-dispatcher, runner : kokaine/reactive/async/internal/host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>, action : () -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e> ()) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e> () */  {
  return run_generation_async_with_family(root, Async_family($std_core_hnd._open_none0(function() {
        return $kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0));
      }), $std_core_hnd._open_none0($kokaine_internal_int_dash_index.new_int_index), $std_core_hnd._open_none1($kokaine_reactive_internal_model.cell, $std_core_types.Nil), $std_core_hnd._open_none0($kokaine_async_effects.new_runtime_scope_root), dispatcher, runner), action);
}