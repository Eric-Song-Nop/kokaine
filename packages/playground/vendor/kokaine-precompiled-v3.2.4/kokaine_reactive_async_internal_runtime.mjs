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
 
// externals
 
// type declarations
// type task-cancellation
export function Task_cancellation(cancellation_strand, cancellation_dispose) /* (cancellation-strand : task-cancel-strand, cancellation-dispose : kokaine/async/effects/dispose-fn) -> task-cancellation */  {
  return { cancellation_strand: cancellation_strand, cancellation_dispose: cancellation_dispose };
}
// type runtime-supervisor
export function Runtime_supervisor(supervisor_scope, supervisor_tasks, supervisor_reason, supervisor_owner, supervisor_family, supervisor_index) /* forall<e> (supervisor-scope : kokaine/async/effects/async-scope, supervisor-tasks : kokaine/async/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation>, supervisor-reason : ref<global,kokaine/async/internal/one-shot-task/task-stop-reason>, supervisor-owner : ref<global,maybe<kokaine/reactive/internal/model/cleanup-registration<<ui|e>>>>, supervisor-family : ref<global,maybe<kokaine/internal/registry/registry-registration<runtime-supervisor<e>>>>, supervisor-index : ref<global,maybe<kokaine/internal/int-index/int-index-registration<runtime-supervisor<e>>>>) -> runtime-supervisor<e> */  {
  return { supervisor_scope: supervisor_scope, supervisor_tasks: supervisor_tasks, supervisor_reason: supervisor_reason, supervisor_owner: supervisor_owner, supervisor_family: supervisor_family, supervisor_index: supervisor_index };
}
// type async-family
export function Async_family(family_supervisors, family_index, family_canceled, family_root_scope, family_dispatcher, family_runner) /* forall<e> (family-supervisors : kokaine/internal/registry/registry<runtime-supervisor<e>>, family-index : kokaine/internal/int-index/int-index<runtime-supervisor<e>>, family-canceled : ref<global,list<kokaine/async/effects/async-scope>>, family-root-scope : kokaine/async/effects/async-scope, family-dispatcher : kokaine/reactive/async/internal/host-turn/host-turn-dispatcher, family-runner : kokaine/reactive/async/internal/host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>) -> async-family<e> */  {
  return { family_supervisors: family_supervisors, family_index: family_index, family_canceled: family_canceled, family_root_scope: family_root_scope, family_dispatcher: family_dispatcher, family_runner: family_runner };
}
// type async-lease-group
export function Async_lease_group(lease_group_entries) /* (lease-group-entries : kokaine/internal/registry/registry<kokaine/async/effects/dispose-fn>) -> async-lease-group */  {
  return lease_group_entries;
}
// type cancellation-reentry
export const Cancellation_retirement = 1; // cancellation-reentry
export const Cancellation_live = 2; // cancellation-reentry
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
 
 
// Automatically generated. Tests for the `Cancellation-live` constructor of the `:cancellation-reentry` type.
export function is_cancellation_live(cancellation_reentry) /* (cancellation-reentry : cancellation-reentry) -> bool */  {
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
export function task_payload_fs__mlift_copy_10437(_this, payload_label, payload_portal, _c_x10151) /* forall<a,e> (task-payload<a,e>, payload-label : ? string, payload-portal : ? (kokaine/reactive/integration/internal/reentry/reentry<<ui|e>>), taskresume<e,a>) -> task-payload<a,e> */  {
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
  return Task_payload(_x2, _c_x10151, _x3);
}
 
export function task_payload_fs__copy(_this, payload_portal, payload_resume, payload_label) /* forall<a,e> (task-payload<a,e>, payload-portal : ? (kokaine/reactive/integration/internal/reentry/reentry<<ui|e>>), payload-resume : ? (taskresume<e,a>), payload-label : ? string) -> task-payload<a,e> */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10151 /* taskresume<649,648> */ ) {
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
      return Task_payload(_x4, _c_x10151, _x5);
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
 
 
// Automatically generated. Retrieves the `supervisor-index` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_index(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,maybe<kokaine/internal/int-index/int-index-registration<runtime-supervisor<e>>>> */  {
  return _this.supervisor_index;
}
 
export function runtime_supervisor_fs__copy(_this, supervisor_scope, supervisor_tasks, supervisor_reason, supervisor_owner, supervisor_family, supervisor_index) /* forall<e> (runtime-supervisor<e>, supervisor-scope : ? kokaine/async/effects/async-scope, supervisor-tasks : ? (kokaine/async/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation>), supervisor-reason : ? (ref<global,kokaine/async/internal/one-shot-task/task-stop-reason>), supervisor-owner : ? (ref<global,maybe<kokaine/reactive/internal/model/cleanup-registration<<ui|e>>>>), supervisor-family : ? (ref<global,maybe<kokaine/internal/registry/registry-registration<runtime-supervisor<e>>>>), supervisor-index : ? (ref<global,maybe<kokaine/internal/int-index/int-index-registration<runtime-supervisor<e>>>>)) -> runtime-supervisor<e> */  {
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
  if (supervisor_index !== undefined) {
    var _x14 = supervisor_index;
  }
  else {
    var _x14 = _this.supervisor_index;
  }
  return Runtime_supervisor(_x9, _x10, _x11, _x12, _x13, _x14);
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
    var _x15 = task_state;
  }
  else {
    var _x15 = _this.task_state;
  }
  if (task_supervisor !== undefined) {
    var _x16 = task_supervisor;
  }
  else {
    var _x16 = _this.task_supervisor;
  }
  if (task_cancel !== undefined) {
    var _x17 = task_cancel;
  }
  else {
    var _x17 = _this.task_cancel;
  }
  return Generation_task(_x15, _x16, _x17);
}
 
 
// Automatically generated. Retrieves the `family-supervisors` constructor field of the `:async-family` type.
export function async_family_fs_family_supervisors(_this) /* forall<e> (async-family<e>) -> kokaine/internal/registry/registry<runtime-supervisor<e>> */  {
  return _this.family_supervisors;
}
 
 
// Automatically generated. Retrieves the `family-index` constructor field of the `:async-family` type.
export function async_family_fs_family_index(_this) /* forall<e> (async-family<e>) -> kokaine/internal/int-index/int-index<runtime-supervisor<e>> */  {
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
 
export function async_family_fs__copy(_this, family_supervisors, family_index, family_canceled, family_root_scope, family_dispatcher, family_runner) /* forall<e> (async-family<e>, family-supervisors : ? (kokaine/internal/registry/registry<runtime-supervisor<e>>), family-index : ? (kokaine/internal/int-index/int-index<runtime-supervisor<e>>), family-canceled : ? (ref<global,list<kokaine/async/effects/async-scope>>), family-root-scope : ? kokaine/async/effects/async-scope, family-dispatcher : ? kokaine/reactive/async/internal/host-turn/host-turn-dispatcher, family-runner : ? (kokaine/reactive/async/internal/host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>)) -> async-family<e> */  {
  if (family_supervisors !== undefined) {
    var _x18 = family_supervisors;
  }
  else {
    var _x18 = _this.family_supervisors;
  }
  if (family_index !== undefined) {
    var _x19 = family_index;
  }
  else {
    var _x19 = _this.family_index;
  }
  if (family_canceled !== undefined) {
    var _x20 = family_canceled;
  }
  else {
    var _x20 = _this.family_canceled;
  }
  if (family_root_scope !== undefined) {
    var _x21 = family_root_scope;
  }
  else {
    var _x21 = _this.family_root_scope;
  }
  if (family_dispatcher !== undefined) {
    var _x22 = family_dispatcher;
  }
  else {
    var _x22 = _this.family_dispatcher;
  }
  if (family_runner !== undefined) {
    var _x23 = family_runner;
  }
  else {
    var _x23 = _this.family_runner;
  }
  return Async_family(_x18, _x19, _x20, _x21, _x22, _x23);
}
 
 
// Automatically generated. Retrieves the `runtime-family` constructor field of the `:generation-runtime` type.
export function generation_runtime_fs_runtime_family(_this) /* forall<e> (generation-runtime<e>) -> async-family<e> */  {
  return _this;
}
 
export function generation_runtime_fs__copy(_this, runtime_family) /* forall<e> (generation-runtime<e>, runtime-family : ? (async-family<e>)) -> generation-runtime<e> */  {
  if (runtime_family !== undefined) {
    var _x24 = runtime_family;
  }
  else {
    var _x24 = _this;
  }
  return _x24;
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
    var _x25 = lease_group_entries;
  }
  else {
    var _x25 = _this;
  }
  return _x25;
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
   
  var x_10026 = outstanding_operations.value;
   
  var value_10025 = $std_core_types._int_add(x_10026,1);
  return ((outstanding_operations).value = value_10025);
}
 
export function decrement_outstanding() /* () -> () */  {
   
  var current = outstanding_operations.value;
   
  var value_0_10031 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
  return ((outstanding_operations).value = value_0_10031);
}
 
export function async_lease_group_fs_count(group) /* (group : async-lease-group) -> int */  {
  return (group.registry_count).value;
}
 
 
// Keep row-polymorphic family internals out of generated Koka 3.2 `.kki`
// inline bodies; its interface printer otherwise emits an unparseable cache.
export function async_family_fs_scope_is_within(family, child, ancestor) /* forall<e> (family : async-family<e>, child : kokaine/async/effects/async-scope, ancestor : kokaine/async/effects/async-scope) -> bool */  {
  var _x27 = family.family_root_scope;
  var _x26 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(ancestor, _x27);
  if (_x26) {
    return true;
  }
  else {
    return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(child, ancestor);
  }
}
 
export function runtime_fs_is_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> bool */  {
  var _x28 = runtime.family_canceled;
  return $std_core_list.any(_x28.value, function(canceled /* kokaine/async/effects/async-scope */ ) {
      var _x30 = runtime.family_root_scope;
      var _x29 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(canceled, _x30);
      if (_x29) {
        return true;
      }
      else {
        return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(scope, canceled);
      }
    });
}
 
export function runtime_fs_record_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
  var _x31 = runtime_fs_is_canceled(runtime, scope);
  if (_x31) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x32 = runtime.family_canceled;
    var value_10046 = $std_core_types.Cons(scope, _x32.value);
    var _x32 = runtime.family_canceled;
    return ((_x32).value = value_10046);
  }
}
 
 
// Exact removal matters for nested cancellation: releasing a drained child
// must not revive it while an enclosing canceled scope is still live.
export function runtime_fs_release_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
   
  var _x33 = runtime.family_canceled;
  var value_10051 = $std_core_list.filter(_x33.value, function(current /* kokaine/async/effects/async-scope */ ) {
       
      var b_10053 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(current, scope);
      return (b_10053) ? false : true;
    });
  var _x33 = runtime.family_canceled;
  return ((_x33).value = value_10051);
}
 
 
// monadic lift
export function runtime_supervisor_fs__mlift_detach_10438(_c_x10155) /* (bool) -> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function runtime_supervisor_fs__mlift_detach_10439(supervisor, _c_x10156) /* forall<_e,_e1,e2> (supervisor : runtime-supervisor<e2>, ()) -> () */  {
   
  var _x34 = supervisor.supervisor_family;
  var family = _x34.value;
   
  var _x35 = supervisor.supervisor_family;
  ((_x35).value = ($std_core_types.Nothing));
  if (family === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _pat_7_0 = $kokaine_internal_registry.registry_registration_fs_take(family.value);
    return $std_core_types.Unit;
  }
}
 
export function runtime_supervisor_fs_detach(supervisor) /* forall<e> (supervisor : runtime-supervisor<e>) -> () */  {
   
  var _x34 = supervisor.supervisor_index;
  var index = _x34.value;
   
  var _x35 = supervisor.supervisor_index;
  ((_x35).value = ($std_core_types.Nothing));
   
  if (index === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _pat_1_1 = $kokaine_internal_int_dash_index.int_index_registration_fs_take(index.value);
    $std_core_types.Unit;
  }
   
  var _x36 = supervisor.supervisor_owner;
  var owner = _x36.value;
   
  var _x37 = supervisor.supervisor_owner;
  ((_x37).value = ($std_core_types.Nothing));
   
  if (owner === null) {
    var x_10489 = $std_core_types.Unit;
  }
  else {
     
    var _x39 = owner.value.cleanup_node;
    var _x38 = $kokaine_internal_registry.registry_registration_fs_take(_x39);
    if (_x38 === null) {
      var x_0_10492 = false;
    }
    else {
       
      var _x40 = owner.value.cleanup_resource;
      var maybe_10016 = $kokaine_reactive_internal_resource.claim_resource(_x40);
      var x_0_10492 = (maybe_10016 !== null);
    }
    if ($std_core_hnd._yielding()) {
      var x_10489 = $std_core_hnd.yield_extend(runtime_supervisor_fs__mlift_detach_10438);
    }
    else {
      var x_10489 = $std_core_types.Unit;
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10156 /* () */ ) {
      return runtime_supervisor_fs__mlift_detach_10439(supervisor, _c_x10156);
    });
  }
  else {
     
    var _x34 = supervisor.supervisor_family;
    var family = _x34.value;
     
    var _x35 = supervisor.supervisor_family;
    ((_x35).value = ($std_core_types.Nothing));
    if (family === null) {
      return $std_core_types.Unit;
    }
    else {
       
      var _pat_7_0 = $kokaine_internal_registry.registry_registration_fs_take(family.value);
      return $std_core_types.Unit;
    }
  }
}
 
export function runtime_supervisor_fs_claim(supervisor, reason) /* forall<e> (supervisor : runtime-supervisor<e>, reason : kokaine/async/internal/one-shot-task/task-stop-reason) -> list<task-cancellation> */  {
   
  var _x34 = supervisor.supervisor_reason;
  ((_x34).value = reason);
  var _x35 = supervisor.supervisor_tasks;
  var _x34 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x35);
  if (_x34 === null) {
    return $std_core_types.Nil;
  }
  else {
     
    runtime_supervisor_fs_detach(supervisor);
    return _x34.value;
  }
}
 
export function run_task_cancel_strands(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10077 = ((loc).value);
        return (list_10077 === null) ? false : true;
      }, function() {
        var _x36 = ((loc).value);
        if (_x36 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x36.tail));
          return _x36.head.cancellation_strand();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function run_task_host_disposers(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10081 = ((loc).value);
        return (list_10081 === null) ? false : true;
      }, function() {
        var _x36 = ((loc).value);
        if (_x36 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x36.tail));
          return _x36.head.cancellation_dispose();
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
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10440(supervisor, index_registration) /* forall<_e,e1> (supervisor : runtime-supervisor<e1>, index-registration : kokaine/internal/int-index/int-index-registration<runtime-supervisor<e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_2_10312 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<2638> */ ) {
      return _this_3.supervisor_index;
    }, supervisor);
   
  ((target_2_10312).value = ($std_core_types.Just(index_registration)));
  return supervisor;
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10441(family, scope, supervisor, family_registration) /* forall<_e,e1> (family : async-family<e1>, scope : kokaine/async/effects/async-scope, supervisor : runtime-supervisor<e1>, family-registration : kokaine/internal/registry/registry-registration<runtime-supervisor<e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_1_10306 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<2638> */ ) {
      return _this_1.supervisor_family;
    }, supervisor);
   
  ((target_1_10306).value = ($std_core_types.Just(family_registration)));
   
  var _x_x1_7_10384 = $std_core_hnd._open_none1(function(_this_2 /* async-family<2638> */ ) {
      return _this_2.family_index;
    }, family);
   
  var _x_x2_3_10385 = $std_core_hnd._open_none1(function(scope_0 /* kokaine/async/effects/async-scope */ ) {
      var _x37 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
      var _x36 = $std_core_types._int_eq(_x37,0);
      if (_x36) {
        return scope_0.scope_namespace;
      }
      else {
        return (scope_0.ids !== null) ? scope_0.ids.head : 0;
      }
    }, scope);
   
  var x_1_10500 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_7_10384, _x_x2_3_10385, supervisor);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(index_registration /* kokaine/internal/int-index/int-index-registration<runtime-supervisor<2638>> */ ) {
      return _mlift_new_runtime_supervisor_10440(supervisor, index_registration);
    });
  }
  else {
    return _mlift_new_runtime_supervisor_10440(supervisor, x_1_10500);
  }
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10442(family, scope, supervisor, owner) /* forall<_e,e1> (family : async-family<e1>, scope : kokaine/async/effects/async-scope, supervisor : runtime-supervisor<e1>, owner : kokaine/reactive/internal/model/cleanup-registration<<ui|e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_10300 = $std_core_hnd._open_none1(function(_this /* runtime-supervisor<2638> */ ) {
      return _this.supervisor_owner;
    }, supervisor);
   
  ((target_10300).value = ($std_core_types.Just(owner)));
   
  var _x_x1_3_10380 = $std_core_hnd._open_none1(function(_this_0 /* async-family<2638> */ ) {
      return _this_0.family_supervisors;
    }, family);
   
  var x_10502 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* kokaine/internal/registry/registry<runtime-supervisor<2638>> */ , value_4 /* runtime-supervisor<2638> */ ) {
      var _x36 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_4);
      if (_x36 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x36.value;
      }
    }, _x_x1_3_10380, supervisor);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(family_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<2638>> */ ) {
      return _mlift_new_runtime_supervisor_10441(family, scope, supervisor, family_registration);
    });
  }
  else {
    return _mlift_new_runtime_supervisor_10441(family, scope, supervisor, x_10502);
  }
}
 
export function new_runtime_supervisor(root, family, scope) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, family : async-family<e>, scope : kokaine/async/effects/async-scope) -> <kokaine/reactive/effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var supervisor = Runtime_supervisor(scope, $std_core_hnd._open_none0(function() {
      return $kokaine_internal_registry.new_registry();
    }), { value: ($kokaine_async_internal_one_dash_shot_dash_task.Task_canceled) }, { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) });
   
  var x_10504 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
      var actions_0 = $std_core_hnd._open_none2(function(supervisor_0 /* runtime-supervisor<2638> */ , reason /* kokaine/async/internal/one-shot-task/task-stop-reason */ ) {
           
          var _x36 = supervisor_0.supervisor_reason;
          ((_x36).value = reason);
          var _x37 = supervisor_0.supervisor_tasks;
          var _x36 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x37);
          if (_x36 === null) {
            return $std_core_types.Nil;
          }
          else {
             
            runtime_supervisor_fs_detach(supervisor_0);
            return _x36.value;
          }
        }, supervisor, $kokaine_async_internal_one_dash_shot_dash_task.Task_retired);
      return $std_core_hnd._open_none1(function(actions_0_0 /* list<task-cancellation> */ ) {
          return $std_core_hnd.finally_prompt(function() {
              return run_task_host_disposers(actions_0_0);
            }, run_task_cancel_strands(actions_0_0));
        }, actions_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(owner /* kokaine/reactive/internal/model/cleanup-registration<<ui|2638>> */ ) {
      return _mlift_new_runtime_supervisor_10442(family, scope, supervisor, owner);
    });
  }
  else {
     
    var target_10300 = $std_core_hnd._open_none1(function(_this /* runtime-supervisor<2638> */ ) {
        return _this.supervisor_owner;
      }, supervisor);
     
    ((target_10300).value = ($std_core_types.Just(x_10504)));
     
    var _x_x1_3_10380 = $std_core_hnd._open_none1(function(_this_0 /* async-family<2638> */ ) {
        return _this_0.family_supervisors;
      }, family);
     
    var x_0_10509 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* kokaine/internal/registry/registry<runtime-supervisor<2638>> */ , value_4 /* runtime-supervisor<2638> */ ) {
        var _x36 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_4);
        if (_x36 === null) {
          return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
        }
        else {
          return _x36.value;
        }
      }, _x_x1_3_10380, supervisor);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(family_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<2638>> */ ) {
        return _mlift_new_runtime_supervisor_10441(family, scope, supervisor, family_registration);
      });
    }
    else {
       
      var target_1_10306 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<2638> */ ) {
          return _this_1.supervisor_family;
        }, supervisor);
       
      ((target_1_10306).value = ($std_core_types.Just(x_0_10509)));
       
      var _x_x1_7_10384 = $std_core_hnd._open_none1(function(_this_2 /* async-family<2638> */ ) {
          return _this_2.family_index;
        }, family);
       
      var _x_x2_3_10385 = $std_core_hnd._open_none1(function(scope_0 /* kokaine/async/effects/async-scope */ ) {
          var _x37 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
          var _x36 = $std_core_types._int_eq(_x37,0);
          if (_x36) {
            return scope_0.scope_namespace;
          }
          else {
            return (scope_0.ids !== null) ? scope_0.ids.head : 0;
          }
        }, scope);
       
      var x_2_10512 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_7_10384, _x_x2_3_10385, supervisor);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(index_registration /* kokaine/internal/int-index/int-index-registration<runtime-supervisor<2638>> */ ) {
          return _mlift_new_runtime_supervisor_10440(supervisor, index_registration);
        });
      }
      else {
         
        var target_2_10312 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<2638> */ ) {
            return _this_3.supervisor_index;
          }, supervisor);
         
        ((target_2_10312).value = ($std_core_types.Just(x_2_10512)));
        return supervisor;
      }
    }
  }
}
 
export function runtime_fs_supervisor(runtime, root, scope) /* forall<e> (runtime : generation-runtime<e>, root : kokaine/reactive/internal/model/root<<ui|e>>, scope : kokaine/async/effects/async-scope) -> <kokaine/reactive/effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var family = $std_core_hnd._open_none1(function(_this /* generation-runtime<2702> */ ) {
      return _this;
    }, runtime);
   
  var _x_x1_0_10391 = $std_core_hnd._open_none1(function(_this_0 /* async-family<2702> */ ) {
      return _this_0.family_index;
    }, family);
   
  var _x_x2_10392 = $std_core_hnd._open_none1(function(scope_0 /* kokaine/async/effects/async-scope */ ) {
      var _x37 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
      var _x36 = $std_core_types._int_eq(_x37,0);
      if (_x36) {
        return scope_0.scope_namespace;
      }
      else {
        return (scope_0.ids !== null) ? scope_0.ids.head : 0;
      }
    }, scope);
  var _x36 = $std_core_hnd._open_none2($kokaine_internal_int_dash_index.int_index_fs_lookup, _x_x1_0_10391, _x_x2_10392);
  if (_x36 !== null) {
    return _x36.value;
  }
  else {
    return new_runtime_supervisor(root, family, scope);
  }
}
 
export function task_fs_detach_cancellation(task) /* forall<a,e> (task : generation-task<a,e>) -> () */  {
   
  var _x37 = task.task_cancel;
  var registration = _x37.value;
   
  var _x38 = task.task_cancel;
  ((_x38).value = ($std_core_types.Nothing));
   
  if (registration === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _x39 = registration.value;
    var maybe_10005 = $kokaine_internal_registry.registry_registration_fs_take(_x39);
    $std_core_types.Unit;
  }
  var _x38 = task.task_supervisor.supervisor_tasks;
  var _x37 = $std_core_types._int_le(($kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_count(_x38)),0);
  if (_x37) {
    var _x39 = task.task_supervisor;
    return runtime_supervisor_fs_detach(_x39);
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
      var _x40 = $std_core_types.Cons(values.head, collected);
      values = values.tail;
      collected = _x40;
      continue tailcall;
    }
  }
}}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10443(collected, _c_x10167) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10167, collected);
}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10444(collected_0, _c_x10168) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10168, collected_0);
}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10445(include_all, rest, scope, _c_x10170) /* forall<e> (include-all : bool, rest : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, list<task-cancellation>) -> list<task-cancellation> */  {
  return claim_scope_supervisors_loop(rest, scope, include_all, _c_x10170);
}
 
export function claim_scope_supervisors_loop(supervisors, scope_0, include_all_0, collected_1) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, include-all : bool, collected : list<task-cancellation>) -> div list<task-cancellation> */  { tailcall: while(1)
{
  if (supervisors === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected_1);
  }
  else {
     
    if (include_all_0) {
       
      var _x41 = supervisors.head.supervisor_reason;
      ((_x41).value = ($kokaine_async_internal_one_dash_shot_dash_task.Task_canceled));
       
      var _x43 = supervisors.head.supervisor_tasks;
      var _x42 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x43);
      if (_x42 === null) {
        var x_0_10518 = $std_core_types.Nil;
      }
      else {
         
        runtime_supervisor_fs_detach(supervisors.head);
        var x_0_10518 = _x42.value;
      }
      if ($std_core_hnd._yielding()) {
        var x_10515 = $std_core_hnd.yield_extend(function(_c_x10167_0 /* list<task-cancellation> */ ) {
          return _mlift_claim_scope_supervisors_loop_10443(collected_1, _c_x10167_0);
        });
      }
      else {
        var x_10515 = _mlift_claim_scope_supervisors_loop_10443(collected_1, x_0_10518);
      }
    }
    else {
      var _x42 = supervisors.head.supervisor_scope;
      var _x41 = $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(_x42, scope_0);
      if (_x41) {
         
        var _x43 = supervisors.head.supervisor_reason;
        ((_x43).value = ($kokaine_async_internal_one_dash_shot_dash_task.Task_canceled));
         
        var _x45 = supervisors.head.supervisor_tasks;
        var _x44 = $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x45);
        if (_x44 === null) {
          var x_1_10520 = $std_core_types.Nil;
        }
        else {
           
          runtime_supervisor_fs_detach(supervisors.head);
          var x_1_10520 = _x44.value;
        }
        if ($std_core_hnd._yielding()) {
          var x_10515 = $std_core_hnd.yield_extend(function(_c_x10168_0 /* list<task-cancellation> */ ) {
            return _mlift_claim_scope_supervisors_loop_10444(collected_1, _c_x10168_0);
          });
        }
        else {
          var x_10515 = _mlift_claim_scope_supervisors_loop_10444(collected_1, x_1_10520);
        }
      }
      else {
        var x_10515 = collected_1;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10170_0 /* list<task-cancellation> */ ) {
        return _mlift_claim_scope_supervisors_loop_10445(include_all_0, supervisors.tail, scope_0, _c_x10170_0);
      });
    }
    else {
      {
        // tail call
        supervisors = supervisors.tail;
        collected_1 = x_10515;
        continue tailcall;
      }
    }
  }
}}
 
export function claim_scope_supervisors(supervisors, scope, include_all) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, include-all : bool) -> div list<task-cancellation> */  {
  return claim_scope_supervisors_loop(supervisors, scope, include_all, $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_cancel_runtime_scope_10446(actions) /* forall<e> (actions : list<task-cancellation>) -> <div,ui,exn,kokaine/reactive/effects/signal-write|e> () */  {
  return $std_core_hnd._open_none1(function(actions_0 /* list<task-cancellation> */ ) {
      return $std_core_hnd.finally_prompt(function() {
          return run_task_host_disposers(actions_0);
        }, run_task_cancel_strands(actions_0));
    }, actions);
}
 
export function cancel_runtime_scope(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> <kokaine/reactive/effects/signal-write,pure,ui|e> () */  {
   
  $std_core_hnd._open_none2(runtime_fs_record_canceled, runtime, scope);
   
  var family = $std_core_hnd._open_none1(function(_this /* generation-runtime<3210> */ ) {
      return _this;
    }, runtime);
   
  var _x_x1_2_10401 = $std_core_hnd._open_none1(function(_this_0 /* async-family<3210> */ ) {
      return _this_0.family_supervisors;
    }, family);
   
  var _x_x1_1_10398 = $std_core_hnd._open_none1($kokaine_internal_registry.registry_fs_snapshot, _x_x1_2_10401);
   
  var _x_x2_1_10404 = $std_core_hnd._open_none1(function(_this_1 /* async-family<3210> */ ) {
      return _this_1.family_root_scope;
    }, family);
   
  var _x_x3_10400 = $std_core_hnd._open_none2($kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_, scope, _x_x2_1_10404);
   
  var x_10524 = $std_core_hnd._open_none3(function(supervisors /* list<runtime-supervisor<3210>> */ , scope_0 /* kokaine/async/effects/async-scope */ , include_all /* bool */ ) {
      return claim_scope_supervisors_loop(supervisors, scope_0, include_all, $std_core_types.Nil);
    }, _x_x1_1_10398, scope, _x_x3_10400);
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
      }, x_10524);
  }
}
 
export function release_runtime_scope(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
  return runtime_fs_release_canceled(runtime, scope);
}
 
 
// monadic lift
export function _mlift_register_owned_disposer_10447(disposer_slot, _c_x10176) /* forall<_e,_e1> (disposer-slot : ref<global,maybe<kokaine/async/effects/dispose-fn>>, bool) -> bool */  {
  if (_c_x10176) {
     
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
export function _mlift_register_owned_disposer_10448(committed, disposer_slot, registration) /* forall<_e,_e1,e2> (committed : ref<global,bool>, disposer-slot : ref<global,maybe<kokaine/async/effects/dispose-fn>>, registration : kokaine/reactive/internal/model/cleanup-registration<<ui|e2>>) -> <exn,ui,div,kokaine/reactive/effects/signal-write|e2> (() -> ui bool) */  {
   
  $std_core_hnd._open_none0(function() {
     
    var x_10026 = outstanding_operations.value;
     
    var value_10025 = $std_core_types._int_add(x_10026,1);
    return ((outstanding_operations).value = value_10025);
  });
   
  ((committed).value = true);
  return function() {
     
    var _x42 = registration.cleanup_node;
    var _x41 = $kokaine_internal_registry.registry_registration_fs_take(_x42);
    if (_x41 === null) {
      var x_10529 = false;
    }
    else {
       
      var _x43 = registration.cleanup_resource;
      var maybe_10016 = $kokaine_reactive_internal_resource.claim_resource(_x43);
      var x_10529 = (maybe_10016 !== null);
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10176 /* bool */ ) {
        return _mlift_register_owned_disposer_10447(disposer_slot, _c_x10176);
      });
    }
    else {
      return _mlift_register_owned_disposer_10447(disposer_slot, x_10529);
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
   
  var x_10533 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
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
    var _x42 = $std_core_hnd.yield_extend(function(registration /* kokaine/reactive/internal/model/cleanup-registration<<ui|3424>> */ ) {
      return _mlift_register_owned_disposer_10448(committed, disposer_slot, registration);
    });
  }
  else {
    var _x42 = _mlift_register_owned_disposer_10448(committed, disposer_slot, x_10533);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x41 = committed.value;
      if (_x41) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_hnd._open_none0(dispose);
      }
    }, _x42);
}
 
 
// monadic lift
export function _mlift_register_task_10449(family_0, setup, task_0, cancellation_0) /* forall<_e,_e1,a,e2> (family@0 : async-family<e2>, setup : kokaine/async/effects/await-setup<a>, task@0 : generation-task<a,e2>, cancellation@0 : kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation>) -> <exn,div,ui,kokaine/reactive/effects/signal-write|e2> () */  {
   
  var target_10347 = $std_core_hnd._open_none1(function(_this_3 /* generation-task<5790,5791> */ ) {
      return _this_3.task_cancel;
    }, task_0);
   
  ((target_10347).value = ($std_core_types.Just(cancellation_0)));
   
  $std_core_hnd._open_none0(function() {
     
    var x_10026 = outstanding_operations.value;
     
    var value_10025 = $std_core_types._int_add(x_10026,1);
    return ((outstanding_operations).value = value_10025);
  });
  var _x43 = $std_core_hnd._open_none1(setup, function(result_0 /* kokaine/async/effects/await-result<5790> */ ) {
      return accept_task_result(task_0, family_0, result_0);
    });
  if (_x43._tag === 1) {
    return $std_core_hnd._open_none3(accept_task_result, task_0, family_0, $kokaine_async_effects.Exception(_x43.error));
  }
  else {
     
    var _x_x1_8_10421 = $std_core_hnd._open_none1(function(_this_4 /* generation-task<5790,5791> */ ) {
        return _this_4.task_state;
      }, task_0);
    var _x44 = $std_core_hnd._open_none2($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_8_10421, _x43.value);
    if (_x44 === null) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_hnd._open_none0(_x44.value);
    }
  }
}
 
 
// monadic lift
export function _mlift_register_task_10450(family_0_0, label, portal, resume_action, setup_0, supervisor) /* forall<_e,_e1,_e2,a,e3> (family@0 : async-family<e3>, label : string, portal : kokaine/reactive/integration/internal/reentry/reentry<<ui|e3>>, resume-action : (kokaine/async/effects/await-result<a>) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e3> (), setup : kokaine/async/effects/await-setup<a>, supervisor : runtime-supervisor<e3>) -> <kokaine/reactive/effects/signal-write,pure,ui|e3> () */  {
   
  var state = $std_core_hnd._open_none1($kokaine_async_internal_one_dash_shot_dash_task.new_one_shot_task, Task_payload(portal, resume_action, label));
   
  var task_0_0 = Generation_task(state, supervisor, { value: ($std_core_types.Nothing) });
   
  var _x_x1_3_10413 = $std_core_hnd._open_none1(function(_this_2 /* runtime-supervisor<5791> */ ) {
      return _this_2.supervisor_tasks;
    }, supervisor);
   
  var x_10535 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_3_10413, function() {
      return task_fs_claim_stop(task_0_0, family_0_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(cancellation_0_0 /* kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
      return _mlift_register_task_10449(family_0_0, setup_0, task_0_0, cancellation_0_0);
    });
  }
  else {
    return _mlift_register_task_10449(family_0_0, setup_0, task_0_0, x_10535);
  }
}
 
 
// monadic lift
export function _mlift_register_task_10451(label_0, resume_action_0, root, runtime, scope, setup_1, portal_0) /* forall<_e,_e1,_e2,a,e3> (label : string, resume-action : (kokaine/async/effects/await-result<a>) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e3> (), root : kokaine/reactive/internal/model/root<<ui|e3>>, runtime : generation-runtime<e3>, scope : kokaine/async/effects/async-scope, setup : kokaine/async/effects/await-setup<a>, portal : kokaine/reactive/integration/internal/reentry/reentry<<ui|e3>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e3> () */  {
   
  var family_0_1 = $std_core_hnd._open_none1(function(_this_1 /* generation-runtime<5791> */ ) {
      return _this_1;
    }, runtime);
   
  var x_0_10537 = runtime_fs_supervisor(runtime, root, scope);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(supervisor_0 /* runtime-supervisor<5791> */ ) {
      return _mlift_register_task_10450(family_0_1, label_0, portal_0, resume_action_0, setup_1, supervisor_0);
    });
  }
  else {
    return _mlift_register_task_10450(family_0_1, label_0, portal_0, resume_action_0, setup_1, x_0_10537);
  }
}
 
 
// monadic lift
export function _mlift_register_task_10452(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, wild__) /* forall<_e,_e1,_e2,a,e3> (label : string, resume-action : (kokaine/async/effects/await-result<a>) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e3> (), root : kokaine/reactive/internal/model/root<<ui|e3>>, runtime : generation-runtime<e3>, scope : kokaine/async/effects/async-scope, setup : kokaine/async/effects/await-setup<a>, wild_ : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e3> () */  {
   
  var x_1_10539 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_integration_internal_reentry.capture_reentry, root_0);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal_1 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|5791>> */ ) {
      return _mlift_register_task_10451(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, portal_1);
    });
  }
  else {
    return _mlift_register_task_10451(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, x_1_10539);
  }
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10453(label_0_0, rcontext, root_0_0, runtime_0_0, scope_0_0, setup_0_0, _y_x10194) /* forall<a,e> (label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10194, false, function() {
      return register_task(root_0_0, runtime_0_0, scope_0_0, label_0_0, setup_0_0, function(result_1 /* kokaine/async/effects/await-result<4029> */ ) {
          return $std_core_hnd.resume_shallow(rcontext, result_1);
        });
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10454(family_1, label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10191) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10191, false, function() {
      var _x45 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_1, scope_0_1);
      if (_x45) {
        return resume_generation(root_0_1, family_1, function() {
            return $std_core_hnd.resume_shallow(rcontext_0, $kokaine_async_effects.Cancel);
          });
      }
      else {
         
        var x_2_10541 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10194_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10453(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10194_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10453(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, x_2_10541);
        }
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10455(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10190) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10190, false, function() {
       
      var x_3_10543 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10191_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10454(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10191_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10454(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, x_3_10543);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10456(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10189) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10189, false, function() {
       
      var x_4_10545 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10190_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10455(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10190_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10455(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, x_4_10545);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10457(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10188) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10188, false, function() {
       
      var x_5_10547 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10189_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10456(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10189_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10456(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, x_5_10547);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10458(callback, label_0_0_0, root_0_5, runtime_0_5, scope_0_0_0, setup_0_0_0, _y_x10207) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10207, false, function() {
      return register_task(root_0_5, runtime_0_5, scope_0_0_0, label_0_0_0, setup_0_0_0, function(result_0_0 /* kokaine/async/effects/await-result<4148> */ ) {
          return $std_core_hnd._open_none1(callback, result_0_0);
        });
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10459(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10206) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10206, false, function() {
      var _x46 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_6, scope_0_0_1);
      if (_x46) {
        return $std_core_hnd._open_none1(callback_0, $kokaine_async_effects.Cancel);
      }
      else {
         
        var x_6_10549 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10207_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10458(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10207_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10458(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, x_6_10549);
        }
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10460(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10205) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10205, false, function() {
       
      var x_7_10551 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10206_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10459(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10206_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10459(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, x_7_10551);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10461(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10204) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10204, false, function() {
       
      var x_8_10553 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10205_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10460(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10205_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10460(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, x_8_10553);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10462(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10203) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10203, false, function() {
       
      var x_9_10555 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10204_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10461(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10204_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10461(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, x_9_10555);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10463(host_action, _y_x10218) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <exn,div,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10218, false, host_action);
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10464(host_action_0, _y_x10217) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10217, false, function() {
       
      var x_10_10558 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10218_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10463(host_action_0, _y_x10218_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10463(host_action_0, x_10_10558);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10465(host_action_1, _y_x10216) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10216, false, function() {
       
      var x_11_10560 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10217_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10464(host_action_1, _y_x10217_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10464(host_action_1, x_11_10560);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10466(host_action_0_0, root_1, runtime_1, scope_1, _y_x10223) /* forall<e> (host-action@0 : () -> ui (), root@1 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@1 : generation-runtime<e>, scope@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10223, false, function() {
      return register_scheduled_ioc(root_1, runtime_1, scope_1, host_action_0_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10467(dispose_0, root_1_0, _y_x10227) /* forall<e> (dispose@0 : kokaine/async/effects/dispose-fn, root@1 : kokaine/reactive/internal/model/root<<ui|e>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10227, false, function() {
      return register_owned_disposer(root_1_0, dispose_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10468(dispose_0_0, root_1_1, _y_x10226) /* forall<e> (dispose@0 : kokaine/async/effects/dispose-fn, root@1 : kokaine/reactive/internal/model/root<<ui|e>>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10226, false, function() {
       
      var x_12_10562 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10227_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10467(dispose_0_0, root_1_1, _y_x10227_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10467(dispose_0_0, root_1_1, x_12_10562);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10469(runtime_1_0, scope_0_1_0, _y_x10233) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10233, false, function() {
      return cancel_runtime_scope(runtime_1_0, scope_0_1_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10470(runtime_1_1, scope_0_1_1, _y_x10232) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10232, false, function() {
       
      var x_13_10564 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10233_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10469(runtime_1_1, scope_0_1_1, _y_x10233_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10469(runtime_1_1, scope_0_1_1, x_13_10564);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10471(runtime_1_2, scope_0_1_2, _y_x10231) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10231, false, function() {
       
      var x_14_10566 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10232_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10470(runtime_1_2, scope_0_1_2, _y_x10232_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10470(runtime_1_2, scope_0_1_2, x_14_10566);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10472(runtime_1_3, scope_1_0, _y_x10242) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <exn,div|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10242, false, function() {
      return runtime_fs_is_canceled(runtime_1_3, scope_1_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10473(runtime_1_4, scope_1_0_0, _y_x10241) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10241, false, function() {
       
      var x_15_10570 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10242_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10472(runtime_1_4, scope_1_0_0, _y_x10242_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10472(runtime_1_4, scope_1_0_0, x_15_10570);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10474(runtime_1_5, scope_1_0_1, _y_x10240) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10240, false, function() {
       
      var x_16_10572 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10241_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10473(runtime_1_5, scope_1_0_1, _y_x10241_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10473(runtime_1_5, scope_1_0_1, x_16_10572);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10475(runtime_1_6, scope_1_0_2, _y_x10239) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10239, false, function() {
       
      var x_17_10574 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10240_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10474(runtime_1_6, scope_1_0_2, _y_x10240_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10474(runtime_1_6, scope_1_0_2, x_17_10574);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10476(runtime_1_7, scope_1_0_3, _y_x10238) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10238, false, function() {
       
      var x_18_10576 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10239_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10475(runtime_1_7, scope_1_0_3, _y_x10239_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10475(runtime_1_7, scope_1_0_3, x_18_10576);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10477(runtime_1_8, scope_2, _y_x10254) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <exn,div|e> () */  {
  return $std_core_hnd._mask_at(_y_x10254, false, function() {
      return release_runtime_scope(runtime_1_8, scope_2);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10478(runtime_1_9, scope_2_0, _y_x10253) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10253, false, function() {
       
      var x_19_10580 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10254_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10477(runtime_1_9, scope_2_0, _y_x10254_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10477(runtime_1_9, scope_2_0, x_19_10580);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10479(runtime_1_10, scope_2_1, _y_x10252) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10252, false, function() {
       
      var x_20_10582 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10253_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10478(runtime_1_10, scope_2_1, _y_x10253_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10478(runtime_1_10, scope_2_1, x_20_10582);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10480(runtime_1_11, scope_2_2, _y_x10251) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10251, false, function() {
       
      var x_21_10584 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10252_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10479(runtime_1_11, scope_2_2, _y_x10252_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10479(runtime_1_11, scope_2_2, x_21_10584);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10481(runtime_1_12, scope_2_3, _y_x10250) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10250, false, function() {
       
      var x_22_10586 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10251_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10480(runtime_1_12, scope_2_3, _y_x10251_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10480(runtime_1_12, scope_2_3, x_22_10586);
      }
    });
}
 
export function accept_task_result(task, family, result) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>, result : kokaine/async/effects/await-result<a>) -> <div,ui> () */  {
  var _x48 = task.task_state;
  var _x47 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_accept(_x48, result);
  if (_x47) {
    var _x50 = family.family_dispatcher;
    var _x49 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_dispatcher_fs_dispatch(_x50, function() {
        return run_task_result(task, family);
      });
    if (_x49) {
      return $std_core_types.Unit;
    }
    else {
       
      var rejected = task_fs_claim_dispatch_rejection(task, family);
      if (rejected === null) {
        return $std_core_types.Unit;
      }
      else {
         
        var actions_10104 = $std_core_types.Cons(rejected.value, $std_core_types.Nil);
        return $std_core_hnd.finally_prompt(function() {
            return run_task_host_disposers(actions_10104);
          }, run_task_cancel_strands(actions_10104));
      }
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function register_task(root_2, runtime_2, scope_3, label_2, setup_3, resume_action_2) /* forall<a,e> (root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, label : string, setup : kokaine/async/effects/await-setup<a>, resume-action : (kokaine/async/effects/await-result<a>) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> ()) -> <pure,kokaine/reactive/effects/signal-write,ui|e> () */  {
   
  var x_23_10591 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "async suspension");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_register_task_10452(label_2, resume_action_2, root_2, runtime_2, scope_3, setup_3, wild___0);
    });
  }
  else {
     
    var x_24_10594 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_integration_internal_reentry.capture_reentry, root_2);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(portal_2 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|5791>> */ ) {
        return _mlift_register_task_10451(label_2, resume_action_2, root_2, runtime_2, scope_3, setup_3, portal_2);
      });
    }
    else {
       
      var family_0_2 = $std_core_hnd._open_none1(function(_this_1_0 /* generation-runtime<5791> */ ) {
          return _this_1_0;
        }, runtime_2);
       
      var x_25_10597 = runtime_fs_supervisor(runtime_2, root_2, scope_3);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(supervisor_1 /* runtime-supervisor<5791> */ ) {
          return _mlift_register_task_10450(family_0_2, label_2, x_24_10594, resume_action_2, setup_3, supervisor_1);
        });
      }
      else {
         
        var state_0 = $std_core_hnd._open_none1($kokaine_async_internal_one_dash_shot_dash_task.new_one_shot_task, Task_payload(x_24_10594, resume_action_2, label_2));
         
        var task_0_1 = Generation_task(state_0, x_25_10597, { value: ($std_core_types.Nothing) });
         
        var _x_x1_3_10413_0 = $std_core_hnd._open_none1(function(_this_2_0 /* runtime-supervisor<5791> */ ) {
            return _this_2_0.supervisor_tasks;
          }, x_25_10597);
         
        var x_26_10600 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_async_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_3_10413_0, function() {
            return task_fs_claim_stop(task_0_1, family_0_2);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(cancellation_0_1 /* kokaine/async/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
            return _mlift_register_task_10449(family_0_2, setup_3, task_0_1, cancellation_0_1);
          });
        }
        else {
           
          var target_10347_0 = $std_core_hnd._open_none1(function(_this_3_0 /* generation-task<5790,5791> */ ) {
              return _this_3_0.task_cancel;
            }, task_0_1);
           
          ((target_10347_0).value = ($std_core_types.Just(x_26_10600)));
           
          $std_core_hnd._open_none0(function() {
             
            var x_10026_0 = outstanding_operations.value;
             
            var value_10025_0 = $std_core_types._int_add(x_10026_0,1);
            return ((outstanding_operations).value = value_10025_0);
          });
          var _x51 = $std_core_hnd._open_none1(setup_3, function(result_0_1 /* kokaine/async/effects/await-result<5790> */ ) {
              return accept_task_result(task_0_1, family_0_2, result_0_1);
            });
          if (_x51._tag === 1) {
            return $std_core_hnd._open_none3(accept_task_result, task_0_1, family_0_2, $kokaine_async_effects.Exception(_x51.error));
          }
          else {
             
            var _x_x1_8_10421_0 = $std_core_hnd._open_none1(function(_this_4_0 /* generation-task<5790,5791> */ ) {
                return _this_4_0.task_state;
              }, task_0_1);
            var _x52 = $std_core_hnd._open_none2($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_8_10421_0, _x51.value);
            if (_x52 === null) {
              return $std_core_types.Unit;
            }
            else {
              return $std_core_hnd._open_none0(_x52.value);
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
  return $kokaine_async_effects.async_await_fs__handle($kokaine_async_effects._Hnd_async_await(3, function(m /* hnd/marker<<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5801>,()> */ , ___wildcard_x598__16 /* hnd/ev<kokaine/async/effects/async-await> */ , x_27 /* (kokaine/async/effects/await-setup<_3848>, kokaine/async/effects/async-scope, string) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<kokaine/async/effects/await-result<_3848>,()>) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5801> () */ ) {
             
            var x_28_10604 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
             
            function next_27_10605(_y_x10188_0) /* (hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5801> () */  {
              return _mlift_interpret_generation_await_10457(family_1_3, x_27.thd, k, root_0_10, runtime_0_10, x_27.snd, x_27.fst, _y_x10188_0);
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_27_10605);
            }
            else {
              return next_27_10605(x_28_10604);
            }
          });
      }, $std_core_hnd.clause_tail1(function(_pat_x789__20 /* (kokaine/async/effects/await-setup<_3851>, kokaine/async/effects/async-scope, string, (kokaine/async/effects/await-result<_3851>) -> ui ()) */ ) {
         
        var x_29_10607 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10203_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10462(_pat_x789__20.field4, _pat_x789__20.thd, root_0_10, runtime_0_10, _pat_x789__20.snd, _pat_x789__20.fst, _y_x10203_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10462(_pat_x789__20.field4, _pat_x789__20.thd, root_0_10, runtime_0_10, _pat_x789__20.snd, _pat_x789__20.fst, x_29_10607);
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
  return $kokaine_async_effects.async_ioc_fs__handle($kokaine_async_effects._Hnd_async_ioc(1, $std_core_hnd.clause_tail1(function(host_action_2 /* () -> ui 4273 */ ) {
         
        var x_30_10609 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10216_0 /* hnd/ev-index */ ) {
            return _mlift_run_generation_async_with_family_10465(host_action_2, _y_x10216_0);
          });
        }
        else {
          return _mlift_run_generation_async_with_family_10465(host_action_2, x_30_10609);
        }
      }), function(m_0 /* hnd/marker<<div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5808>,()> */ , ev /* hnd/ev<kokaine/async/effects/async-ioc> */ , x1_1 /* kokaine/async/effects/async-scope */ , x2_1 /* () -> ui () */ ) {
        return $std_core_hnd.under2(ev, function(scope_1_1 /* kokaine/async/effects/async-scope */ , host_action_0_1 /* () -> ui () */ ) {
             
            var x_31_10612 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10223_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10466(host_action_0_1, root_1_2, runtime_1_13, scope_1_1, _y_x10223_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10466(host_action_0_1, root_1_2, runtime_1_13, scope_1_1, x_31_10612);
            }
          }, x1_1, x2_1);
      }), function(_res_0 /* () */ ) {
      return _res_0;
    }, function() {
      return $kokaine_async_effects.async_ownership_fs__handle($kokaine_async_effects._Hnd_async_ownership(1, $std_core_hnd.clause_tail1(function(dispose_0_1 /* kokaine/async/effects/dispose-fn */ ) {
             
            var x_32_10614 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10226_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10468(dispose_0_1, root_1_2, _y_x10226_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10468(dispose_0_1, root_1_2, x_32_10614);
            }
          })), function(_res_0_0 /* () */ ) {
          return _res_0_0;
        }, function() {
           
          var _value_async_scope_l708_c9 = $std_core_hnd._open_none1(function(_this_5 /* async-family<5808> */ ) {
              return _this_5.family_root_scope;
            }, family_2);
          return $kokaine_async_effects.async_cancel_fs__handle($kokaine_async_effects._Hnd_async_cancel(1, $std_core_hnd.clause_tail0(function() {
                return _value_async_scope_l708_c9;
              }), $std_core_hnd.clause_tail1(function(scope_0_1_3 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_33_10616 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10231_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10471(runtime_1_13, scope_0_1_3, _y_x10231_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10471(runtime_1_13, scope_0_1_3, x_33_10616);
                }
              }), $std_core_hnd.clause_tail1(function(scope_1_0_4 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_34_10618 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10238_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10476(runtime_1_13, scope_1_0_4, _y_x10238_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10476(runtime_1_13, scope_1_0_4, x_34_10618);
                }
              }), $std_core_hnd.clause_tail1(function(scope_2_4 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_35_10620 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10250_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10481(runtime_1_13, scope_2_4, _y_x10250_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10481(runtime_1_13, scope_2_4, x_35_10620);
                }
              })), function(_res_1 /* () */ ) {
              return _res_1;
            }, function() {
              return $kokaine_async_effects.discontinue_fs__handle($kokaine_async_effects._Hnd_discontinue(0, function(m_1 /* hnd/marker<<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5808>,()> */ , ___wildcard_x701__16 /* hnd/ev<kokaine/async/effects/discontinue> */ ) {
                    return $std_core_hnd.yield_to_final(m_1, function(___wildcard_x701__43 /* (hnd/resume-result<4761,()>) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5808> () */ ) {
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
  var _x54 = task_1.task_state;
  var _x53 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_ready(_x54);
  if (_x53 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    task_fs_detach_cancellation(task_1);
     
    decrement_outstanding();
    return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_2 /* hnd/marker<ui,()> */ , ___wildcard_x654__16 /* hnd/ev<exn> */ , x_36 /* exception */ ) {
          return $std_core_hnd.yield_to_final(m_2, function(___wildcard_x654__45 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
              var _x55 = x_36.message;
              return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async exception (", $std_core_types._lp__plus__plus__rp_(_x53.value.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x55))));
            });
        }), function(_res_3 /* () */ ) {
        return _res_3;
      }, function() {
        if (_x53.value.claim_result === null) {
          var _x56 = $std_core_types.Unit;
        }
        else {
           
          var root_3_0 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|5824>> */ ) {
              return value_1.reentry_root;
            }, _x53.value.claim_payload.payload_portal);
          var _x56 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_runner_fs_run($std_core_hnd._open_none1(function(_this_8 /* async-family<5824> */ ) {
                return _this_8.family_runner;
              }, family_4), function() {
              return $kokaine_reactive_integration_internal_reentry.run_reentry(_x53.value.claim_payload.payload_portal, function() {
                  return resume_generation(root_3_0, family_4, function() {
                      return _x53.value.claim_payload.payload_resume(_x53.value.claim_result.value);
                    });
                });
            });
        }
        return $std_core_hnd.finally_prompt(function() {
             
            var _x_x1_10431 = $std_core_hnd._open_none1(function(_this_7 /* generation-task<5823,5824> */ ) {
                return _this_7.task_state;
              }, task_1);
             
            var _pat_4_1_0_0 = $std_core_hnd._open_none1($kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_finish, _x_x1_10431);
            return $std_core_types.Unit;
          }, _x56);
      });
  }
}
 
export function stopped_task_cancellation(family_5, claim, reentry) /* forall<a,e> (family : async-family<e>, claim : kokaine/async/internal/one-shot-task/task-claim<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn>, reentry : cancellation-reentry) -> div task-cancellation */  {
  return Task_cancellation(function() {
      return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_3 /* hnd/marker<ui,()> */ , ___wildcard_x654__16_0 /* hnd/ev<exn> */ , x_37 /* exception */ ) {
            return $std_core_hnd.yield_to_final(m_3, function(___wildcard_x654__45_0 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
                var _x57 = x_37.message;
                return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async cancellation exception (", $std_core_types._lp__plus__plus__rp_(claim.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x57))));
              });
          }), function(_res_4 /* () */ ) {
          return _res_4;
        }, function() {
           
          var root_4_0 = $std_core_hnd._open_none1(function(value_2 /* kokaine/reactive/integration/internal/reentry/reentry<<ui|5836>> */ ) {
              return value_2.reentry_root;
            }, claim.claim_payload.payload_portal);
          return $kokaine_reactive_async_internal_host_dash_turn.host_turn_runner_fs_run($std_core_hnd._open_none1(function(_this_9 /* async-family<5836> */ ) {
                return _this_9.family_runner;
              }, family_5), function() {
              if (reentry === 1) {
                return $kokaine_reactive_integration_internal_reentry.run_retirement_reentry(claim.claim_payload.payload_portal, function() {
                    return resume_generation(root_4_0, family_5, function() {
                        return claim.claim_payload.payload_resume($kokaine_async_effects.Cancel);
                      });
                  });
              }
              else {
                return $kokaine_reactive_integration_internal_reentry.run_reentry(claim.claim_payload.payload_portal, function() {
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
 
export function task_fs_claim_dispatch_rejection(task_2, family_6) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
  var _x59 = task_2.task_state;
  var _x58 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_stop(_x59, $kokaine_async_internal_one_dash_shot_dash_task.Task_canceled);
  if (_x58 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    task_fs_detach_cancellation(task_2);
     
    decrement_outstanding();
    return $std_core_types.Just(stopped_task_cancellation(family_6, _x58.value, Cancellation_live));
  }
}
 
export function task_fs_claim_stop(task_3, family_7) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
   
  var _x60 = task_3.task_supervisor.supervisor_reason;
  var reason = _x60.value;
  var _x61 = task_3.task_state;
  var _x60 = $kokaine_async_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_stop(_x61, reason);
  if (_x60 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    var _x62 = task_3.task_cancel;
    ((_x62).value = ($std_core_types.Nothing));
     
    decrement_outstanding();
    return $std_core_types.Just(stopped_task_cancellation(family_7, _x60.value, Cancellation_retirement));
  }
}
 
 
// Scheduled host actions are ordinary generation-owned tasks. Keep their
// structural phase evidence live through registration; erasing it would make
// owner cleanup masks invalid at runtime on Koka's JavaScript backend.
export function register_scheduled_ioc(root_5, runtime_2_0, scope_3_0, host_action_1_0) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, host-action : () -> ui ()) -> <pure,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return register_task(root_5, runtime_2_0, scope_3_0, "scheduled host action", function(resume /* (kokaine/async/effects/await-result<()>) -> ui () */ ) {
      var _x63 = runtime_2_0.family_dispatcher;
      var _x62 = $kokaine_reactive_async_internal_host_dash_turn.host_turn_dispatcher_fs_dispatch(_x63, function() {
          return resume($kokaine_async_effects.Result($std_core_types.Unit));
        });
      if (_x62) {
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
    var _x64 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    if (_x64 === null) {
      return false;
    }
    else {
       
      decrement_outstanding();
      return true;
    }
  };
}
 
export function async_lease_group_fs_own(group, dispose) /* (group : async-lease-group, dispose : kokaine/async/effects/dispose-fn) -> ui kokaine/async/effects/ownership-release-fn */  {
  var _x65 = $kokaine_internal_registry.registry_fs_try_insert(group, dispose);
  if (_x65 === null) {
     
    dispose();
    return function() {
      return false;
    };
  }
  else {
     
    var x_10026 = outstanding_operations.value;
     
    var value_10025 = $std_core_types._int_add(x_10026,1);
     
    ((outstanding_operations).value = value_10025);
    return function() {
      var _x66 = $kokaine_internal_registry.registry_registration_fs_take(_x65.value);
      if (_x66 === null) {
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
         
        var list_10140 = ((loc).value);
        return (list_10140 === null) ? false : true;
      }, function() {
        var _x67 = ((loc).value);
        if (_x67 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x67.tail));
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
         
        var list_10144 = ((loc).value);
        return (list_10144 === null) ? false : true;
      }, function() {
        var _x67 = ((loc).value);
        if (_x67 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x67.tail));
          return _x67.head();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function async_lease_group_fs_dispose(group) /* (group : async-lease-group) -> ui () */  {
  var _x67 = $kokaine_internal_registry.registry_fs_seal_detach(group);
  if (_x67 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    account_async_lease_disposers(_x67.value);
    return run_async_lease_disposers(_x67.value);
  }
}
 
export function run_generation_async_with_host(root, dispatcher, runner, action) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, dispatcher : kokaine/reactive/async/internal/host-turn/host-turn-dispatcher, runner : kokaine/reactive/async/internal/host-turn/host-turn-runner<<exn,ui|e>,<exn,ui>>, action : () -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e> ()) -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e> () */  {
  return run_generation_async_with_family(root, Async_family($std_core_hnd._open_none0($kokaine_internal_registry.new_registry), $std_core_hnd._open_none0($kokaine_internal_int_dash_index.new_int_index), { value: ($std_core_types.Nil) }, $std_core_hnd._open_none0($kokaine_async_effects.new_runtime_scope_root), dispatcher, runner), action);
}