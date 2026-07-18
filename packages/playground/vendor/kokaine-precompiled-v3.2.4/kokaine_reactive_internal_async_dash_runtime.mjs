// Koka generated module: kokaine/reactive/internal/async-runtime, koka version: 3.2.4
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
import * as $kokaine_async_internal_web_dash_schedule from './kokaine_async_internal_web_dash_schedule.mjs';
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_internal_reentry from './kokaine_reactive_internal_reentry.mjs';
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
import * as $kokaine_reactive_internal_application_dash_runner from './kokaine_reactive_internal_application_dash_runner.mjs';
import * as $kokaine_reactive_internal_one_dash_shot_dash_task from './kokaine_reactive_internal_one_dash_shot_dash_task.mjs';
import * as $kokaine_reactive_internal_cancellation_dash_supervisor from './kokaine_reactive_internal_cancellation_dash_supervisor.mjs';
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
export function Runtime_supervisor(supervisor_scope, supervisor_tasks, supervisor_reason, supervisor_owner, supervisor_family, supervisor_index) /* forall<e> (supervisor-scope : kokaine/async/effects/async-scope, supervisor-tasks : kokaine/reactive/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation>, supervisor-reason : ref<global,kokaine/reactive/internal/one-shot-task/task-stop-reason>, supervisor-owner : ref<global,maybe<kokaine/reactive/internal/model/cleanup-registration<<ui|e>>>>, supervisor-family : ref<global,maybe<kokaine/internal/registry/registry-registration<runtime-supervisor<e>>>>, supervisor-index : ref<global,maybe<kokaine/internal/int-index/int-index-registration<runtime-supervisor<e>>>>) -> runtime-supervisor<e> */  {
  return { supervisor_scope: supervisor_scope, supervisor_tasks: supervisor_tasks, supervisor_reason: supervisor_reason, supervisor_owner: supervisor_owner, supervisor_family: supervisor_family, supervisor_index: supervisor_index };
}
// type async-family
export function Async_family(family_supervisors, family_index, family_canceled, family_root_scope, family_runner) /* forall<e> (family-supervisors : kokaine/internal/registry/registry<runtime-supervisor<e>>, family-index : kokaine/internal/int-index/int-index<runtime-supervisor<e>>, family-canceled : ref<global,list<kokaine/async/effects/async-scope>>, family-root-scope : kokaine/async/effects/async-scope, family-runner : kokaine/reactive/internal/application-runner/app-runner<<exn,ui|e>,<exn,ui>>) -> async-family<e> */  {
  return { family_supervisors: family_supervisors, family_index: family_index, family_canceled: family_canceled, family_root_scope: family_root_scope, family_runner: family_runner };
}
// type async-lease-group
export function Async_lease_group(lease_group_entries) /* (lease-group-entries : kokaine/internal/registry/registry<kokaine/async/effects/dispose-fn>) -> async-lease-group */  {
  return lease_group_entries;
}
// type generation-runtime
export function Generation_runtime(runtime_family) /* forall<e> (runtime-family : async-family<e>) -> generation-runtime<e> */  {
  return runtime_family;
}
// type task-payload
export function Task_payload(payload_portal, payload_resume, payload_label) /* forall<a,e> (payload-portal : kokaine/reactive/internal/model/reentry<<ui|e>>, payload-resume : taskresume<e,a>, payload-label : string) -> task-payload<a,e> */  {
  return { payload_portal: payload_portal, payload_resume: payload_resume, payload_label: payload_label };
}
// type generation-task
export function Generation_task(task_state, task_supervisor, task_cancel) /* forall<a,e> (task-state : kokaine/reactive/internal/one-shot-task/one-shot-task<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn>, task-supervisor : runtime-supervisor<e>, task-cancel : ref<global,maybe<kokaine/reactive/internal/cancellation-supervisor/cancellation-registration<task-cancellation>>>) -> generation-task<a,e> */  {
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
 
 
// Automatically generated. Retrieves the `payload-portal` constructor field of the `:task-payload` type.
export function task_payload_fs_payload_portal(_this) /* forall<a,e> (task-payload<a,e>) -> kokaine/reactive/internal/model/reentry<<ui|e>> */  {
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
export function task_payload_fs__mlift_copy_10429(_this, payload_label, payload_portal, _c_x10149) /* forall<a,e> (task-payload<a,e>, payload-label : ? string, payload-portal : ? (kokaine/reactive/internal/model/reentry<<ui|e>>), taskresume<e,a>) -> task-payload<a,e> */  {
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
  return Task_payload(_x2, _c_x10149, _x3);
}
 
export function task_payload_fs__copy(_this, payload_portal, payload_resume, payload_label) /* forall<a,e> (task-payload<a,e>, payload-portal : ? (kokaine/reactive/internal/model/reentry<<ui|e>>), payload-resume : ? (taskresume<e,a>), payload-label : ? string) -> task-payload<a,e> */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10149 /* taskresume<613,612> */ ) {
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
      return Task_payload(_x4, _c_x10149, _x5);
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
export function runtime_supervisor_fs_supervisor_tasks(_this) /* forall<e> (runtime-supervisor<e>) -> kokaine/reactive/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation> */  {
  return _this.supervisor_tasks;
}
 
 
// Automatically generated. Retrieves the `supervisor-reason` constructor field of the `:runtime-supervisor` type.
export function runtime_supervisor_fs_supervisor_reason(_this) /* forall<e> (runtime-supervisor<e>) -> ref<global,kokaine/reactive/internal/one-shot-task/task-stop-reason> */  {
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
 
export function runtime_supervisor_fs__copy(_this, supervisor_scope, supervisor_tasks, supervisor_reason, supervisor_owner, supervisor_family, supervisor_index) /* forall<e> (runtime-supervisor<e>, supervisor-scope : ? kokaine/async/effects/async-scope, supervisor-tasks : ? (kokaine/reactive/internal/cancellation-supervisor/cancellation-supervisor<task-cancellation>), supervisor-reason : ? (ref<global,kokaine/reactive/internal/one-shot-task/task-stop-reason>), supervisor-owner : ? (ref<global,maybe<kokaine/reactive/internal/model/cleanup-registration<<ui|e>>>>), supervisor-family : ? (ref<global,maybe<kokaine/internal/registry/registry-registration<runtime-supervisor<e>>>>), supervisor-index : ? (ref<global,maybe<kokaine/internal/int-index/int-index-registration<runtime-supervisor<e>>>>)) -> runtime-supervisor<e> */  {
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
export function generation_task_fs_task_state(_this) /* forall<a,e> (generation-task<a,e>) -> kokaine/reactive/internal/one-shot-task/one-shot-task<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn> */  {
  return _this.task_state;
}
 
 
// Automatically generated. Retrieves the `task-supervisor` constructor field of the `:generation-task` type.
export function generation_task_fs_task_supervisor(_this) /* forall<a,e> (generation-task<a,e>) -> runtime-supervisor<e> */  {
  return _this.task_supervisor;
}
 
 
// Automatically generated. Retrieves the `task-cancel` constructor field of the `:generation-task` type.
export function generation_task_fs_task_cancel(_this) /* forall<a,e> (generation-task<a,e>) -> ref<global,maybe<kokaine/reactive/internal/cancellation-supervisor/cancellation-registration<task-cancellation>>> */  {
  return _this.task_cancel;
}
 
export function generation_task_fs__copy(_this, task_state, task_supervisor, task_cancel) /* forall<a,e> (generation-task<a,e>, task-state : ? (kokaine/reactive/internal/one-shot-task/one-shot-task<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn>), task-supervisor : ? (runtime-supervisor<e>), task-cancel : ? (ref<global,maybe<kokaine/reactive/internal/cancellation-supervisor/cancellation-registration<task-cancellation>>>)) -> generation-task<a,e> */  {
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
 
 
// Automatically generated. Retrieves the `family-runner` constructor field of the `:async-family` type.
export function async_family_fs_family_runner(_this) /* forall<e> (async-family<e>) -> kokaine/reactive/internal/application-runner/app-runner<<exn,ui|e>,<exn,ui>> */  {
  return _this.family_runner;
}
 
export function async_family_fs__copy(_this, family_supervisors, family_index, family_canceled, family_root_scope, family_runner) /* forall<e> (async-family<e>, family-supervisors : ? (kokaine/internal/registry/registry<runtime-supervisor<e>>), family-index : ? (kokaine/internal/int-index/int-index<runtime-supervisor<e>>), family-canceled : ? (ref<global,list<kokaine/async/effects/async-scope>>), family-root-scope : ? kokaine/async/effects/async-scope, family-runner : ? (kokaine/reactive/internal/application-runner/app-runner<<exn,ui|e>,<exn,ui>>)) -> async-family<e> */  {
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
  if (family_runner !== undefined) {
    var _x22 = family_runner;
  }
  else {
    var _x22 = _this.family_runner;
  }
  return Async_family(_x18, _x19, _x20, _x21, _x22);
}
 
 
// Automatically generated. Retrieves the `runtime-family` constructor field of the `:generation-runtime` type.
export function generation_runtime_fs_runtime_family(_this) /* forall<e> (generation-runtime<e>) -> async-family<e> */  {
  return _this;
}
 
export function generation_runtime_fs__copy(_this, runtime_family) /* forall<e> (generation-runtime<e>, runtime-family : ? (async-family<e>)) -> generation-runtime<e> */  {
  if (runtime_family !== undefined) {
    var _x23 = runtime_family;
  }
  else {
    var _x23 = _this;
  }
  return _x23;
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
    var _x24 = lease_group_entries;
  }
  else {
    var _x24 = _this;
  }
  return _x24;
}
 
export function report_async_error(message) /* (message : string) -> ui () */  {
  return console.error(message);
}
 
 
// `accept-task-result` is operationally a finite `ui` callback (cell updates
// plus microtask enqueue). Its `div` label only closes the recursive type SCC
// formed by the parked continuation and the next generation handler.
export function as_host_action(action) /* (action : () -> <div,ui> ()) -> (() -> ui ()) */  {
  return action;
}
 
export function increment_outstanding() /* () -> () */  {
   
  var x_10025 = outstanding_operations.value;
   
  var value_10024 = $std_core_types._int_add(x_10025,1);
  return ((outstanding_operations).value = value_10024);
}
 
export function decrement_outstanding() /* () -> () */  {
   
  var current = outstanding_operations.value;
   
  var value_0_10030 = ($std_core_types._int_le(current,0)) ? 0 : $std_core_types._int_sub(current,1);
  return ((outstanding_operations).value = value_0_10030);
}
 
export function async_lease_group_fs_count(group) /* (group : async-lease-group) -> int */  {
  return (group.registry_count).value;
}
 
 
// Keep row-polymorphic family internals out of generated Koka 3.2 `.kki`
// inline bodies; its interface printer otherwise emits an unparseable cache.
export function async_family_fs_scope_is_within(family, child, ancestor) /* forall<e> (family : async-family<e>, child : kokaine/async/effects/async-scope, ancestor : kokaine/async/effects/async-scope) -> bool */  {
  var _x26 = family.family_root_scope;
  var _x25 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(ancestor, _x26);
  if (_x25) {
    return true;
  }
  else {
    return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(child, ancestor);
  }
}
 
export function runtime_fs_is_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> bool */  {
  var _x27 = runtime.family_canceled;
  return $std_core_list.any(_x27.value, function(canceled /* kokaine/async/effects/async-scope */ ) {
      var _x29 = runtime.family_root_scope;
      var _x28 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(canceled, _x29);
      if (_x28) {
        return true;
      }
      else {
        return $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(scope, canceled);
      }
    });
}
 
export function runtime_fs_record_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
  var _x30 = runtime_fs_is_canceled(runtime, scope);
  if (_x30) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x31 = runtime.family_canceled;
    var value_10045 = $std_core_types.Cons(scope, _x31.value);
    var _x31 = runtime.family_canceled;
    return ((_x31).value = value_10045);
  }
}
 
 
// Exact removal matters for nested cancellation: releasing a drained child
// must not revive it while an enclosing canceled scope is still live.
export function runtime_fs_release_canceled(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
   
  var _x32 = runtime.family_canceled;
  var value_10050 = $std_core_list.filter(_x32.value, function(current /* kokaine/async/effects/async-scope */ ) {
       
      var b_10052 = $kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_(current, scope);
      return (b_10052) ? false : true;
    });
  var _x32 = runtime.family_canceled;
  return ((_x32).value = value_10050);
}
 
 
// monadic lift
export function runtime_supervisor_fs__mlift_detach_10430(_c_x10153) /* (bool) -> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function runtime_supervisor_fs__mlift_detach_10431(supervisor, _c_x10154) /* forall<_e,_e1,e2> (supervisor : runtime-supervisor<e2>, ()) -> () */  {
   
  var _x33 = supervisor.supervisor_family;
  var family = _x33.value;
   
  var _x34 = supervisor.supervisor_family;
  ((_x34).value = ($std_core_types.Nothing));
  if (family === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _pat_7_0 = $kokaine_internal_registry.registry_registration_fs_take(family.value);
    return $std_core_types.Unit;
  }
}
 
export function runtime_supervisor_fs_detach(supervisor) /* forall<e> (supervisor : runtime-supervisor<e>) -> () */  {
   
  var _x33 = supervisor.supervisor_index;
  var index = _x33.value;
   
  var _x34 = supervisor.supervisor_index;
  ((_x34).value = ($std_core_types.Nothing));
   
  if (index === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _pat_1_1 = $kokaine_internal_int_dash_index.int_index_registration_fs_take(index.value);
    $std_core_types.Unit;
  }
   
  var _x35 = supervisor.supervisor_owner;
  var owner = _x35.value;
   
  var _x36 = supervisor.supervisor_owner;
  ((_x36).value = ($std_core_types.Nothing));
   
  if (owner === null) {
    var x_10481 = $std_core_types.Unit;
  }
  else {
     
    var _x38 = owner.value.cleanup_node;
    var _x37 = $kokaine_internal_registry.registry_registration_fs_take(_x38);
    if (_x37 === null) {
      var x_0_10484 = false;
    }
    else {
       
      var _x39 = owner.value.cleanup_resource;
      var maybe_10016 = $kokaine_reactive_internal_resource.claim_resource(_x39);
      var x_0_10484 = (maybe_10016 !== null);
    }
    if ($std_core_hnd._yielding()) {
      var x_10481 = $std_core_hnd.yield_extend(runtime_supervisor_fs__mlift_detach_10430);
    }
    else {
      var x_10481 = $std_core_types.Unit;
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10154 /* () */ ) {
      return runtime_supervisor_fs__mlift_detach_10431(supervisor, _c_x10154);
    });
  }
  else {
     
    var _x33 = supervisor.supervisor_family;
    var family = _x33.value;
     
    var _x34 = supervisor.supervisor_family;
    ((_x34).value = ($std_core_types.Nothing));
    if (family === null) {
      return $std_core_types.Unit;
    }
    else {
       
      var _pat_7_0 = $kokaine_internal_registry.registry_registration_fs_take(family.value);
      return $std_core_types.Unit;
    }
  }
}
 
export function runtime_supervisor_fs_claim(supervisor, reason) /* forall<e> (supervisor : runtime-supervisor<e>, reason : kokaine/reactive/internal/one-shot-task/task-stop-reason) -> list<task-cancellation> */  {
   
  var _x33 = supervisor.supervisor_reason;
  ((_x33).value = reason);
  var _x34 = supervisor.supervisor_tasks;
  var _x33 = $kokaine_reactive_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x34);
  if (_x33 === null) {
    return $std_core_types.Nil;
  }
  else {
     
    runtime_supervisor_fs_detach(supervisor);
    return _x33.value;
  }
}
 
export function run_task_cancel_strands(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10076 = ((loc).value);
        return (list_10076 === null) ? false : true;
      }, function() {
        var _x35 = ((loc).value);
        if (_x35 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x35.tail));
          return _x35.head.cancellation_strand();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function run_task_host_disposers(actions) /* (actions : list<task-cancellation>) -> ui () */  {
  return function() {
     
    var loc = { value: actions };
     
    var res = $std_core.$while(function() {
         
        var list_10080 = ((loc).value);
        return (list_10080 === null) ? false : true;
      }, function() {
        var _x35 = ((loc).value);
        if (_x35 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x35.tail));
          return _x35.head.cancellation_dispose();
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
export function _mlift_new_runtime_supervisor_10432(supervisor, index_registration) /* forall<_e,e1> (supervisor : runtime-supervisor<e1>, index-registration : kokaine/internal/int-index/int-index-registration<runtime-supervisor<e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_2_10307 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<2571> */ ) {
      return _this_3.supervisor_index;
    }, supervisor);
   
  ((target_2_10307).value = ($std_core_types.Just(index_registration)));
  return supervisor;
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10433(family, scope, supervisor, family_registration) /* forall<_e,e1> (family : async-family<e1>, scope : kokaine/async/effects/async-scope, supervisor : runtime-supervisor<e1>, family-registration : kokaine/internal/registry/registry-registration<runtime-supervisor<e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_1_10301 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<2571> */ ) {
      return _this_1.supervisor_family;
    }, supervisor);
   
  ((target_1_10301).value = ($std_core_types.Just(family_registration)));
   
  var _x_x1_7_10377 = $std_core_hnd._open_none1(function(_this_2 /* async-family<2571> */ ) {
      return _this_2.family_index;
    }, family);
   
  var _x_x2_3_10378 = $std_core_hnd._open_none1(function(scope_0 /* kokaine/async/effects/async-scope */ ) {
      var _x36 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
      var _x35 = $std_core_types._int_eq(_x36,0);
      if (_x35) {
        return scope_0.scope_namespace;
      }
      else {
        return (scope_0.ids !== null) ? scope_0.ids.head : 0;
      }
    }, scope);
   
  var x_1_10492 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_7_10377, _x_x2_3_10378, supervisor);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(index_registration /* kokaine/internal/int-index/int-index-registration<runtime-supervisor<2571>> */ ) {
      return _mlift_new_runtime_supervisor_10432(supervisor, index_registration);
    });
  }
  else {
    return _mlift_new_runtime_supervisor_10432(supervisor, x_1_10492);
  }
}
 
 
// monadic lift
export function _mlift_new_runtime_supervisor_10434(family, scope, supervisor, owner) /* forall<_e,e1> (family : async-family<e1>, scope : kokaine/async/effects/async-scope, supervisor : runtime-supervisor<e1>, owner : kokaine/reactive/internal/model/cleanup-registration<<ui|e1>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e1> runtime-supervisor<e1> */  {
   
  var target_10295 = $std_core_hnd._open_none1(function(_this /* runtime-supervisor<2571> */ ) {
      return _this.supervisor_owner;
    }, supervisor);
   
  ((target_10295).value = ($std_core_types.Just(owner)));
   
  var _x_x1_3_10373 = $std_core_hnd._open_none1(function(_this_0 /* async-family<2571> */ ) {
      return _this_0.family_supervisors;
    }, family);
   
  var x_10494 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* kokaine/internal/registry/registry<runtime-supervisor<2571>> */ , value_4 /* runtime-supervisor<2571> */ ) {
      var _x35 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_4);
      if (_x35 === null) {
        return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
      }
      else {
        return _x35.value;
      }
    }, _x_x1_3_10373, supervisor);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(family_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<2571>> */ ) {
      return _mlift_new_runtime_supervisor_10433(family, scope, supervisor, family_registration);
    });
  }
  else {
    return _mlift_new_runtime_supervisor_10433(family, scope, supervisor, x_10494);
  }
}
 
export function new_runtime_supervisor(root, family, scope) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, family : async-family<e>, scope : kokaine/async/effects/async-scope) -> <kokaine/reactive/effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var supervisor = Runtime_supervisor(scope, $std_core_hnd._open_none0(function() {
      return $kokaine_internal_registry.new_registry();
    }), { value: ($kokaine_reactive_internal_one_dash_shot_dash_task.Task_canceled) }, { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) }, { value: ($std_core_types.Nothing) });
   
  var x_10496 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
      var actions_0 = $std_core_hnd._open_none2(function(supervisor_0 /* runtime-supervisor<2571> */ , reason /* kokaine/reactive/internal/one-shot-task/task-stop-reason */ ) {
           
          var _x35 = supervisor_0.supervisor_reason;
          ((_x35).value = reason);
          var _x36 = supervisor_0.supervisor_tasks;
          var _x35 = $kokaine_reactive_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x36);
          if (_x35 === null) {
            return $std_core_types.Nil;
          }
          else {
             
            runtime_supervisor_fs_detach(supervisor_0);
            return _x35.value;
          }
        }, supervisor, $kokaine_reactive_internal_one_dash_shot_dash_task.Task_retired);
      return $std_core_hnd._open_none1(function(actions_0_0 /* list<task-cancellation> */ ) {
          return $std_core_hnd.finally_prompt(function() {
              return run_task_host_disposers(actions_0_0);
            }, run_task_cancel_strands(actions_0_0));
        }, actions_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(owner /* kokaine/reactive/internal/model/cleanup-registration<<ui|2571>> */ ) {
      return _mlift_new_runtime_supervisor_10434(family, scope, supervisor, owner);
    });
  }
  else {
     
    var target_10295 = $std_core_hnd._open_none1(function(_this /* runtime-supervisor<2571> */ ) {
        return _this.supervisor_owner;
      }, supervisor);
     
    ((target_10295).value = ($std_core_types.Just(x_10496)));
     
    var _x_x1_3_10373 = $std_core_hnd._open_none1(function(_this_0 /* async-family<2571> */ ) {
        return _this_0.family_supervisors;
      }, family);
     
    var x_0_10501 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), function(target_0 /* kokaine/internal/registry/registry<runtime-supervisor<2571>> */ , value_4 /* runtime-supervisor<2571> */ ) {
        var _x35 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_0, value_4);
        if (_x35 === null) {
          return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
        }
        else {
          return _x35.value;
        }
      }, _x_x1_3_10373, supervisor);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(family_registration /* kokaine/internal/registry/registry-registration<runtime-supervisor<2571>> */ ) {
        return _mlift_new_runtime_supervisor_10433(family, scope, supervisor, family_registration);
      });
    }
    else {
       
      var target_1_10301 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<2571> */ ) {
          return _this_1.supervisor_family;
        }, supervisor);
       
      ((target_1_10301).value = ($std_core_types.Just(x_0_10501)));
       
      var _x_x1_7_10377 = $std_core_hnd._open_none1(function(_this_2 /* async-family<2571> */ ) {
          return _this_2.family_index;
        }, family);
       
      var _x_x2_3_10378 = $std_core_hnd._open_none1(function(scope_0 /* kokaine/async/effects/async-scope */ ) {
          var _x36 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
          var _x35 = $std_core_types._int_eq(_x36,0);
          if (_x35) {
            return scope_0.scope_namespace;
          }
          else {
            return (scope_0.ids !== null) ? scope_0.ids.head : 0;
          }
        }, scope);
       
      var x_2_10504 = $std_core_hnd._open_at3($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_internal_int_dash_index.int_index_fs_insert, _x_x1_7_10377, _x_x2_3_10378, supervisor);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(index_registration /* kokaine/internal/int-index/int-index-registration<runtime-supervisor<2571>> */ ) {
          return _mlift_new_runtime_supervisor_10432(supervisor, index_registration);
        });
      }
      else {
         
        var target_2_10307 = $std_core_hnd._open_none1(function(_this_3 /* runtime-supervisor<2571> */ ) {
            return _this_3.supervisor_index;
          }, supervisor);
         
        ((target_2_10307).value = ($std_core_types.Just(x_2_10504)));
        return supervisor;
      }
    }
  }
}
 
export function runtime_fs_supervisor(runtime, root, scope) /* forall<e> (runtime : generation-runtime<e>, root : kokaine/reactive/internal/model/root<<ui|e>>, scope : kokaine/async/effects/async-scope) -> <kokaine/reactive/effects/signal-write,pure,ui|e> runtime-supervisor<e> */  {
   
  var family = $std_core_hnd._open_none1(function(_this /* generation-runtime<2635> */ ) {
      return _this;
    }, runtime);
   
  var _x_x1_0_10384 = $std_core_hnd._open_none1(function(_this_0 /* async-family<2635> */ ) {
      return _this_0.family_index;
    }, family);
   
  var _x_x2_10385 = $std_core_hnd._open_none1(function(scope_0 /* kokaine/async/effects/async-scope */ ) {
      var _x36 = (scope_0.ids !== null) ? scope_0.ids.head : 0;
      var _x35 = $std_core_types._int_eq(_x36,0);
      if (_x35) {
        return scope_0.scope_namespace;
      }
      else {
        return (scope_0.ids !== null) ? scope_0.ids.head : 0;
      }
    }, scope);
  var _x35 = $std_core_hnd._open_none2($kokaine_internal_int_dash_index.int_index_fs_lookup, _x_x1_0_10384, _x_x2_10385);
  if (_x35 !== null) {
    return _x35.value;
  }
  else {
    return new_runtime_supervisor(root, family, scope);
  }
}
 
export function task_fs_detach_cancellation(task) /* forall<a,e> (task : generation-task<a,e>) -> () */  {
   
  var _x36 = task.task_cancel;
  var registration = _x36.value;
   
  var _x37 = task.task_cancel;
  ((_x37).value = ($std_core_types.Nothing));
   
  if (registration === null) {
    $std_core_types.Unit;
  }
  else {
     
    var _x38 = registration.value;
    var maybe_10005 = $kokaine_internal_registry.registry_registration_fs_take(_x38);
    $std_core_types.Unit;
  }
  var _x37 = task.task_supervisor.supervisor_tasks;
  var _x36 = $std_core_types._int_le(($kokaine_reactive_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_count(_x37)),0);
  if (_x36) {
    var _x38 = task.task_supervisor;
    return runtime_supervisor_fs_detach(_x38);
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
      var _x39 = $std_core_types.Cons(values.head, collected);
      values = values.tail;
      collected = _x39;
      continue tailcall;
    }
  }
}}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10435(collected, _c_x10165) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10165, collected);
}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10436(collected_0, _c_x10166) /* (collected : list<task-cancellation>, list<task-cancellation>) -> list<task-cancellation> */  {
  return reverse_cancellations_onto(_c_x10166, collected_0);
}
 
 
// monadic lift
export function _mlift_claim_scope_supervisors_loop_10437(include_all, rest, scope, _c_x10168) /* forall<e> (include-all : bool, rest : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, list<task-cancellation>) -> list<task-cancellation> */  {
  return claim_scope_supervisors_loop(rest, scope, include_all, _c_x10168);
}
 
export function claim_scope_supervisors_loop(supervisors, scope_0, include_all_0, collected_1) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, include-all : bool, collected : list<task-cancellation>) -> div list<task-cancellation> */  { tailcall: while(1)
{
  if (supervisors === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected_1);
  }
  else {
     
    if (include_all_0) {
       
      var _x40 = supervisors.head.supervisor_reason;
      ((_x40).value = ($kokaine_reactive_internal_one_dash_shot_dash_task.Task_canceled));
       
      var _x42 = supervisors.head.supervisor_tasks;
      var _x41 = $kokaine_reactive_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x42);
      if (_x41 === null) {
        var x_0_10510 = $std_core_types.Nil;
      }
      else {
         
        runtime_supervisor_fs_detach(supervisors.head);
        var x_0_10510 = _x41.value;
      }
      if ($std_core_hnd._yielding()) {
        var x_10507 = $std_core_hnd.yield_extend(function(_c_x10165_0 /* list<task-cancellation> */ ) {
          return _mlift_claim_scope_supervisors_loop_10435(collected_1, _c_x10165_0);
        });
      }
      else {
        var x_10507 = _mlift_claim_scope_supervisors_loop_10435(collected_1, x_0_10510);
      }
    }
    else {
      var _x41 = supervisors.head.supervisor_scope;
      var _x40 = $kokaine_async_effects.async_scope_fs__lp__lt__eq__rp_(_x41, scope_0);
      if (_x40) {
         
        var _x42 = supervisors.head.supervisor_reason;
        ((_x42).value = ($kokaine_reactive_internal_one_dash_shot_dash_task.Task_canceled));
         
        var _x44 = supervisors.head.supervisor_tasks;
        var _x43 = $kokaine_reactive_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_claim_cancel(_x44);
        if (_x43 === null) {
          var x_1_10512 = $std_core_types.Nil;
        }
        else {
           
          runtime_supervisor_fs_detach(supervisors.head);
          var x_1_10512 = _x43.value;
        }
        if ($std_core_hnd._yielding()) {
          var x_10507 = $std_core_hnd.yield_extend(function(_c_x10166_0 /* list<task-cancellation> */ ) {
            return _mlift_claim_scope_supervisors_loop_10436(collected_1, _c_x10166_0);
          });
        }
        else {
          var x_10507 = _mlift_claim_scope_supervisors_loop_10436(collected_1, x_1_10512);
        }
      }
      else {
        var x_10507 = collected_1;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10168_0 /* list<task-cancellation> */ ) {
        return _mlift_claim_scope_supervisors_loop_10437(include_all_0, supervisors.tail, scope_0, _c_x10168_0);
      });
    }
    else {
      {
        // tail call
        supervisors = supervisors.tail;
        collected_1 = x_10507;
        continue tailcall;
      }
    }
  }
}}
 
export function claim_scope_supervisors(supervisors, scope, include_all) /* forall<e> (supervisors : list<runtime-supervisor<e>>, scope : kokaine/async/effects/async-scope, include-all : bool) -> div list<task-cancellation> */  {
  return claim_scope_supervisors_loop(supervisors, scope, include_all, $std_core_types.Nil);
}
 
 
// monadic lift
export function _mlift_cancel_runtime_scope_10438(actions) /* forall<e> (actions : list<task-cancellation>) -> <div,ui,exn,kokaine/reactive/effects/signal-write|e> () */  {
  return $std_core_hnd._open_none1(function(actions_0 /* list<task-cancellation> */ ) {
      return $std_core_hnd.finally_prompt(function() {
          return run_task_host_disposers(actions_0);
        }, run_task_cancel_strands(actions_0));
    }, actions);
}
 
export function cancel_runtime_scope(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> <kokaine/reactive/effects/signal-write,pure,ui|e> () */  {
   
  $std_core_hnd._open_none2(runtime_fs_record_canceled, runtime, scope);
   
  var family = $std_core_hnd._open_none1(function(_this /* generation-runtime<3143> */ ) {
      return _this;
    }, runtime);
   
  var _x_x1_2_10394 = $std_core_hnd._open_none1(function(_this_0 /* async-family<3143> */ ) {
      return _this_0.family_supervisors;
    }, family);
   
  var _x_x1_1_10391 = $std_core_hnd._open_none1($kokaine_internal_registry.registry_fs_snapshot, _x_x1_2_10394);
   
  var _x_x2_1_10397 = $std_core_hnd._open_none1(function(_this_1 /* async-family<3143> */ ) {
      return _this_1.family_root_scope;
    }, family);
   
  var _x_x3_10393 = $std_core_hnd._open_none2($kokaine_async_effects.async_scope_fs__lp__eq__eq__rp_, scope, _x_x2_1_10397);
   
  var x_10516 = $std_core_hnd._open_none3(function(supervisors /* list<runtime-supervisor<3143>> */ , scope_0 /* kokaine/async/effects/async-scope */ , include_all /* bool */ ) {
      return claim_scope_supervisors_loop(supervisors, scope_0, include_all, $std_core_types.Nil);
    }, _x_x1_1_10391, scope, _x_x3_10393);
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
      }, x_10516);
  }
}
 
export function release_runtime_scope(runtime, scope) /* forall<e> (runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope) -> () */  {
  return runtime_fs_release_canceled(runtime, scope);
}
 
 
// monadic lift
export function _mlift_register_owned_disposer_10439(disposer_slot, _c_x10174) /* forall<_e,_e1> (disposer-slot : ref<global,maybe<kokaine/async/effects/dispose-fn>>, bool) -> bool */  {
  if (_c_x10174) {
     
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
export function _mlift_register_owned_disposer_10440(committed, disposer_slot, registration) /* forall<_e,_e1,e2> (committed : ref<global,bool>, disposer-slot : ref<global,maybe<kokaine/async/effects/dispose-fn>>, registration : kokaine/reactive/internal/model/cleanup-registration<<ui|e2>>) -> <exn,ui,div,kokaine/reactive/effects/signal-write|e2> (() -> ui bool) */  {
   
  $std_core_hnd._open_none0(function() {
     
    var x_10025 = outstanding_operations.value;
     
    var value_10024 = $std_core_types._int_add(x_10025,1);
    return ((outstanding_operations).value = value_10024);
  });
   
  ((committed).value = true);
  return function() {
     
    var _x41 = registration.cleanup_node;
    var _x40 = $kokaine_internal_registry.registry_registration_fs_take(_x41);
    if (_x40 === null) {
      var x_10521 = false;
    }
    else {
       
      var _x42 = registration.cleanup_resource;
      var maybe_10016 = $kokaine_reactive_internal_resource.claim_resource(_x42);
      var x_10521 = (maybe_10016 !== null);
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10174 /* bool */ ) {
        return _mlift_register_owned_disposer_10439(disposer_slot, _c_x10174);
      });
    }
    else {
      return _mlift_register_owned_disposer_10439(disposer_slot, x_10521);
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
   
  var x_10525 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_runtime.register_cleanup, root, function() {
       
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
    var _x41 = $std_core_hnd.yield_extend(function(registration /* kokaine/reactive/internal/model/cleanup-registration<<ui|3357>> */ ) {
      return _mlift_register_owned_disposer_10440(committed, disposer_slot, registration);
    });
  }
  else {
    var _x41 = _mlift_register_owned_disposer_10440(committed, disposer_slot, x_10525);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x40 = committed.value;
      if (_x40) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_hnd._open_none0(dispose);
      }
    }, _x41);
}
 
 
// monadic lift
export function _mlift_register_task_10441(family_0, setup, task_0, cancellation) /* forall<_e,_e1,a,e2> (family@0 : async-family<e2>, setup : kokaine/async/effects/await-setup<a>, task@0 : generation-task<a,e2>, cancellation : kokaine/reactive/internal/cancellation-supervisor/cancellation-registration<task-cancellation>) -> <exn,div,ui,kokaine/reactive/effects/signal-write|e2> () */  {
   
  var target_10342 = $std_core_hnd._open_none1(function(_this_2 /* generation-task<5478,5479> */ ) {
      return _this_2.task_cancel;
    }, task_0);
   
  ((target_10342).value = ($std_core_types.Just(cancellation)));
   
  $std_core_hnd._open_none0(function() {
     
    var x_10025 = outstanding_operations.value;
     
    var value_10024 = $std_core_types._int_add(x_10025,1);
    return ((outstanding_operations).value = value_10024);
  });
  var _x42 = $std_core_hnd._open_none1(setup, function(result_0 /* kokaine/async/effects/await-result<5478> */ , is_done /* bool */ ) {
      return accept_task_result(task_0, family_0, result_0, is_done);
    });
  if (_x42._tag === 1) {
    return $std_core_hnd._open_none4(accept_task_result, task_0, family_0, $kokaine_async_effects.Exception(_x42.error), true);
  }
  else {
     
    var _x_x1_8_10415 = $std_core_hnd._open_none1(function(_this_3 /* generation-task<5478,5479> */ ) {
        return _this_3.task_state;
      }, task_0);
    var _x43 = $std_core_hnd._open_none2($kokaine_reactive_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_8_10415, _x42.value);
    if (_x43 === null) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_hnd._open_none0(_x43.value);
    }
  }
}
 
 
// monadic lift
export function _mlift_register_task_10442(family_0_0, label, portal, resume_action, setup_0, supervisor) /* forall<_e,_e1,_e2,a,e3> (family@0 : async-family<e3>, label : string, portal : kokaine/reactive/internal/model/reentry<<ui|e3>>, resume-action : (kokaine/async/effects/await-result<a>, bool) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e3> (), setup : kokaine/async/effects/await-setup<a>, supervisor : runtime-supervisor<e3>) -> <kokaine/reactive/effects/signal-write,pure,ui|e3> () */  {
   
  var state = $std_core_hnd._open_none1($kokaine_reactive_internal_one_dash_shot_dash_task.new_one_shot_task, Task_payload(portal, resume_action, label));
   
  var task_0_0 = Generation_task(state, supervisor, { value: ($std_core_types.Nothing) });
   
  var _x_x1_3_10406 = $std_core_hnd._open_none1(function(_this_1 /* runtime-supervisor<5479> */ ) {
      return _this_1.supervisor_tasks;
    }, supervisor);
   
  var x_10527 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_3_10406, function() {
      return task_fs_claim_stop(task_0_0, family_0_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(cancellation_0 /* kokaine/reactive/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
      return _mlift_register_task_10441(family_0_0, setup_0, task_0_0, cancellation_0);
    });
  }
  else {
    return _mlift_register_task_10441(family_0_0, setup_0, task_0_0, x_10527);
  }
}
 
 
// monadic lift
export function _mlift_register_task_10443(label_0, resume_action_0, root, runtime, scope, setup_1, portal_0) /* forall<_e,_e1,_e2,a,e3> (label : string, resume-action : (kokaine/async/effects/await-result<a>, bool) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e3> (), root : kokaine/reactive/internal/model/root<<ui|e3>>, runtime : generation-runtime<e3>, scope : kokaine/async/effects/async-scope, setup : kokaine/async/effects/await-setup<a>, portal : kokaine/reactive/internal/model/reentry<<ui|e3>>) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e3> () */  {
   
  var family_0_1 = $std_core_hnd._open_none1(function(_this_0 /* generation-runtime<5479> */ ) {
      return _this_0;
    }, runtime);
   
  var x_0_10529 = runtime_fs_supervisor(runtime, root, scope);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(supervisor_0 /* runtime-supervisor<5479> */ ) {
      return _mlift_register_task_10442(family_0_1, label_0, portal_0, resume_action_0, setup_1, supervisor_0);
    });
  }
  else {
    return _mlift_register_task_10442(family_0_1, label_0, portal_0, resume_action_0, setup_1, x_0_10529);
  }
}
 
 
// monadic lift
export function _mlift_register_task_10444(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, wild__) /* forall<_e,_e1,_e2,a,e3> (label : string, resume-action : (kokaine/async/effects/await-result<a>, bool) -> <kokaine/async/effects/async,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure,ui|e3> (), root : kokaine/reactive/internal/model/root<<ui|e3>>, runtime : generation-runtime<e3>, scope : kokaine/async/effects/async-scope, setup : kokaine/async/effects/await-setup<a>, wild_ : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui|e3> () */  {
   
  var x_1_10531 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_reentry.capture_reentry, root_0);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal_1 /* kokaine/reactive/internal/model/reentry<<ui|5479>> */ ) {
      return _mlift_register_task_10443(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, portal_1);
    });
  }
  else {
    return _mlift_register_task_10443(label_1, resume_action_1, root_0, runtime_0, scope_0, setup_2, x_1_10531);
  }
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10445(label_0_0, rcontext, root_0_0, runtime_0_0, scope_0_0, setup_0_0, _y_x10191) /* forall<a,e> (label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10191, false, function() {
      return register_task(root_0_0, runtime_0_0, scope_0_0, label_0_0, setup_0_0, function(result_1 /* kokaine/async/effects/await-result<3901> */ , ___wildcard_x612__31 /* bool */ ) {
          return $std_core_hnd.resume_shallow(rcontext, result_1);
        });
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10446(family_1, label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10188) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10188, false, function() {
      var _x44 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_1, scope_0_1);
      if (_x44) {
        return resume_generation(root_0_1, family_1, function() {
            return $std_core_hnd.resume_shallow(rcontext_0, $kokaine_async_effects.Cancel);
          });
      }
      else {
         
        var x_2_10533 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10191_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10445(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, _y_x10191_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10445(label_0_1, rcontext_0, root_0_1, runtime_0_1, scope_0_1, setup_0_1, x_2_10533);
        }
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10447(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10187) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10187, false, function() {
       
      var x_3_10535 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10188_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10446(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, _y_x10188_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10446(family_1_0, label_0_2, rcontext_1, root_0_2, runtime_0_2, scope_0_2, setup_0_2, x_3_10535);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10448(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10186) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10186, false, function() {
       
      var x_4_10537 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10187_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10447(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, _y_x10187_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10447(family_1_1, label_0_3, rcontext_2, root_0_3, runtime_0_3, scope_0_3, setup_0_3, x_4_10537);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10449(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10185) /* forall<a,e> (family@1 : async-family<e>, label@0 : string, rcontext : hnd/resume-context<kokaine/async/effects/await-result<a>,<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,<kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e>,()>, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0 : kokaine/async/effects/async-scope, setup@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10185, false, function() {
       
      var x_5_10539 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10186_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10448(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, _y_x10186_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10448(family_1_2, label_0_4, rcontext_3, root_0_4, runtime_0_4, scope_0_4, setup_0_4, x_5_10539);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10450(callback, label_0_0_0, root_0_5, runtime_0_5, scope_0_0_0, setup_0_0_0, _y_x10204) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10204, false, function() {
      return register_task(root_0_5, runtime_0_5, scope_0_0_0, label_0_0_0, setup_0_0_0, function(result_0_0 /* kokaine/async/effects/await-result<4020> */ , ___wildcard_x627__31 /* bool */ ) {
          return $std_core_hnd._open_none1(callback, result_0_0);
        });
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10451(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10203) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10203, false, function() {
      var _x45 = $std_core_hnd._open_none2(runtime_fs_is_canceled, runtime_0_6, scope_0_0_1);
      if (_x45) {
        return $std_core_hnd._open_none1(callback_0, $kokaine_async_effects.Cancel);
      }
      else {
         
        var x_6_10541 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10204_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10450(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, _y_x10204_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10450(callback_0, label_0_0_1, root_0_6, runtime_0_6, scope_0_0_1, setup_0_0_1, x_6_10541);
        }
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10452(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10202) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10202, false, function() {
       
      var x_7_10543 = $std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10203_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10451(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, _y_x10203_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10451(callback_1, label_0_0_2, root_0_7, runtime_0_7, scope_0_0_2, setup_0_0_2, x_7_10543);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10453(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10201) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10201, false, function() {
       
      var x_8_10545 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10202_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10452(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, _y_x10202_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10452(callback_2, label_0_0_3, root_0_8, runtime_0_8, scope_0_0_3, setup_0_0_3, x_8_10545);
      }
    });
}
 
 
// monadic lift
export function _mlift_interpret_generation_await_10454(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10200) /* forall<a,e> (callback : (kokaine/async/effects/await-result<a>) -> ui (), label@0@0 : string, root@0 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@0 : generation-runtime<e>, scope@0@0 : kokaine/async/effects/async-scope, setup@0@0 : kokaine/async/effects/await-setup<a>, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10200, false, function() {
       
      var x_9_10547 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10201_0 /* hnd/ev-index */ ) {
          return _mlift_interpret_generation_await_10453(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, _y_x10201_0);
        });
      }
      else {
        return _mlift_interpret_generation_await_10453(callback_3, label_0_0_4, root_0_9, runtime_0_9, scope_0_0_4, setup_0_0_4, x_9_10547);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10455(host_action, _y_x10215) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <exn,div,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10215, false, host_action);
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10456(host_action_0, _y_x10214) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10214, false, function() {
       
      var x_10_10550 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10215_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10455(host_action_0, _y_x10215_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10455(host_action_0, x_10_10550);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10457(host_action_1, _y_x10213) /* forall<a,e> (host-action : () -> ui a, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10213, false, function() {
       
      var x_11_10552 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10214_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10456(host_action_1, _y_x10214_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10456(host_action_1, x_11_10552);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10458(host_action_0_0, root_1, runtime_1, scope_1, _y_x10220) /* forall<e> (host-action@0 : () -> ui (), root@1 : kokaine/reactive/internal/model/root<<ui|e>>, runtime@1 : generation-runtime<e>, scope@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10220, false, function() {
      return register_scheduled_ioc(root_1, runtime_1, scope_1, host_action_0_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10459(dispose_0, root_1_0, _y_x10224) /* forall<e> (dispose@0 : kokaine/async/effects/dispose-fn, root@1 : kokaine/reactive/internal/model/root<<ui|e>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10224, false, function() {
      return register_owned_disposer(root_1_0, dispose_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10460(dispose_0_0, root_1_1, _y_x10223) /* forall<e> (dispose@0 : kokaine/async/effects/dispose-fn, root@1 : kokaine/reactive/internal/model/root<<ui|e>>, hnd/ev-index) -> <kokaine/async/effects/async-ioc,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> (() -> ui bool) */  {
  return $std_core_hnd._mask_at(_y_x10223, false, function() {
       
      var x_12_10554 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10224_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10459(dispose_0_0, root_1_1, _y_x10224_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10459(dispose_0_0, root_1_1, x_12_10554);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10461(runtime_1_0, scope_0_1_0, _y_x10230) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10230, false, function() {
      return cancel_runtime_scope(runtime_1_0, scope_0_1_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10462(runtime_1_1, scope_0_1_1, _y_x10229) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10229, false, function() {
       
      var x_13_10556 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10230_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10461(runtime_1_1, scope_0_1_1, _y_x10230_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10461(runtime_1_1, scope_0_1_1, x_13_10556);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10463(runtime_1_2, scope_0_1_2, _y_x10228) /* forall<e> (runtime@1 : generation-runtime<e>, scope@0@1 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10228, false, function() {
       
      var x_14_10558 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10229_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10462(runtime_1_2, scope_0_1_2, _y_x10229_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10462(runtime_1_2, scope_0_1_2, x_14_10558);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10464(runtime_1_3, scope_1_0, _y_x10239) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <exn,div|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10239, false, function() {
      return runtime_fs_is_canceled(runtime_1_3, scope_1_0);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10465(runtime_1_4, scope_1_0_0, _y_x10238) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10238, false, function() {
       
      var x_15_10562 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10239_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10464(runtime_1_4, scope_1_0_0, _y_x10239_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10464(runtime_1_4, scope_1_0_0, x_15_10562);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10466(runtime_1_5, scope_1_0_1, _y_x10237) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10237, false, function() {
       
      var x_16_10564 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10238_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10465(runtime_1_5, scope_1_0_1, _y_x10238_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10465(runtime_1_5, scope_1_0_1, x_16_10564);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10467(runtime_1_6, scope_1_0_2, _y_x10236) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10236, false, function() {
       
      var x_17_10566 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10237_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10466(runtime_1_6, scope_1_0_2, _y_x10237_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10466(runtime_1_6, scope_1_0_2, x_17_10566);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10468(runtime_1_7, scope_1_0_3, _y_x10235) /* forall<e> (runtime@1 : generation-runtime<e>, scope@1@0 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> bool */  {
  return $std_core_hnd._mask_at(_y_x10235, false, function() {
       
      var x_18_10568 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10236_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10467(runtime_1_7, scope_1_0_3, _y_x10236_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10467(runtime_1_7, scope_1_0_3, x_18_10568);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10469(runtime_1_8, scope_2, _y_x10251) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <exn,div|e> () */  {
  return $std_core_hnd._mask_at(_y_x10251, false, function() {
      return release_runtime_scope(runtime_1_8, scope_2);
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10470(runtime_1_9, scope_2_0, _y_x10250) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10250, false, function() {
       
      var x_19_10572 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10251_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10469(runtime_1_9, scope_2_0, _y_x10251_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10469(runtime_1_9, scope_2_0, x_19_10572);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10471(runtime_1_10, scope_2_1, _y_x10249) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10249, false, function() {
       
      var x_20_10574 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10250_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10470(runtime_1_10, scope_2_1, _y_x10250_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10470(runtime_1_10, scope_2_1, x_20_10574);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10472(runtime_1_11, scope_2_2, _y_x10248) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10248, false, function() {
       
      var x_21_10576 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10249_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10471(runtime_1_11, scope_2_2, _y_x10249_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10471(runtime_1_11, scope_2_2, x_21_10576);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_generation_async_with_family_10473(runtime_1_12, scope_2_3, _y_x10247) /* forall<e> (runtime@1 : generation-runtime<e>, scope@2 : kokaine/async/effects/async-scope, hnd/ev-index) -> <kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $std_core_hnd._mask_at(_y_x10247, false, function() {
       
      var x_22_10578 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10248_0 /* hnd/ev-index */ ) {
          return _mlift_run_generation_async_with_family_10472(runtime_1_12, scope_2_3, _y_x10248_0);
        });
      }
      else {
        return _mlift_run_generation_async_with_family_10472(runtime_1_12, scope_2_3, x_22_10578);
      }
    });
}
 
export function accept_task_result(task, family, result, ___wildcard_x381__50) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>, result : kokaine/async/effects/await-result<a>, bool) -> <div,ui> () */  {
  var _x47 = task.task_state;
  var _x46 = $kokaine_reactive_internal_one_dash_shot_dash_task.one_shot_task_fs_accept(_x47, result);
  if (_x46) {
    return $kokaine_async_internal_web_dash_schedule.enqueue_microtask(function() {
      return run_task_result(task, family);
    });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function register_task(root_2, runtime_2, scope_3, label_2, setup_3, resume_action_2) /* forall<a,e> (root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, label : string, setup : kokaine/async/effects/await-setup<a>, resume-action : (kokaine/async/effects/await-result<a>, bool) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> ()) -> <pure,kokaine/reactive/effects/signal-write,ui|e> () */  {
   
  var x_23_10581 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_model.check_not_pure_plane, "async suspension");
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_register_task_10444(label_2, resume_action_2, root_2, runtime_2, scope_3, setup_3, wild___0);
    });
  }
  else {
     
    var x_24_10584 = $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_reentry.capture_reentry, root_2);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(portal_2 /* kokaine/reactive/internal/model/reentry<<ui|5479>> */ ) {
        return _mlift_register_task_10443(label_2, resume_action_2, root_2, runtime_2, scope_3, setup_3, portal_2);
      });
    }
    else {
       
      var family_0_2 = $std_core_hnd._open_none1(function(_this_0_0 /* generation-runtime<5479> */ ) {
          return _this_0_0;
        }, runtime_2);
       
      var x_25_10587 = runtime_fs_supervisor(runtime_2, root_2, scope_3);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(supervisor_1 /* runtime-supervisor<5479> */ ) {
          return _mlift_register_task_10442(family_0_2, label_2, x_24_10584, resume_action_2, setup_3, supervisor_1);
        });
      }
      else {
         
        var state_0 = $std_core_hnd._open_none1($kokaine_reactive_internal_one_dash_shot_dash_task.new_one_shot_task, Task_payload(x_24_10584, resume_action_2, label_2));
         
        var task_0_1 = Generation_task(state_0, x_25_10587, { value: ($std_core_types.Nothing) });
         
        var _x_x1_3_10406_0 = $std_core_hnd._open_none1(function(_this_1_0 /* runtime-supervisor<5479> */ ) {
            return _this_1_0.supervisor_tasks;
          }, x_25_10587);
         
        var x_26_10590 = $std_core_hnd._open_at2($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $kokaine_reactive_internal_cancellation_dash_supervisor.cancellation_supervisor_fs_register, _x_x1_3_10406_0, function() {
            return task_fs_claim_stop(task_0_1, family_0_2);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(cancellation_1 /* kokaine/reactive/internal/cancellation-supervisor/cancellation-registration<task-cancellation> */ ) {
            return _mlift_register_task_10441(family_0_2, setup_3, task_0_1, cancellation_1);
          });
        }
        else {
           
          var target_10342_0 = $std_core_hnd._open_none1(function(_this_2_0 /* generation-task<5478,5479> */ ) {
              return _this_2_0.task_cancel;
            }, task_0_1);
           
          ((target_10342_0).value = ($std_core_types.Just(x_26_10590)));
           
          $std_core_hnd._open_none0(function() {
             
            var x_10025_0 = outstanding_operations.value;
             
            var value_10024_0 = $std_core_types._int_add(x_10025_0,1);
            return ((outstanding_operations).value = value_10024_0);
          });
          var _x48 = $std_core_hnd._open_none1(setup_3, function(result_0_1 /* kokaine/async/effects/await-result<5478> */ , is_done_0 /* bool */ ) {
              return accept_task_result(task_0_1, family_0_2, result_0_1, is_done_0);
            });
          if (_x48._tag === 1) {
            return $std_core_hnd._open_none4(accept_task_result, task_0_1, family_0_2, $kokaine_async_effects.Exception(_x48.error), true);
          }
          else {
             
            var _x_x1_8_10415_0 = $std_core_hnd._open_none1(function(_this_3_0 /* generation-task<5478,5479> */ ) {
                return _this_3_0.task_state;
              }, task_0_1);
            var _x49 = $std_core_hnd._open_none2($kokaine_reactive_internal_one_dash_shot_dash_task.one_shot_task_fs_install_disposer, _x_x1_8_10415_0, _x48.value);
            if (_x49 === null) {
              return $std_core_types.Unit;
            }
            else {
              return $std_core_hnd._open_none0(_x49.value);
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
export function interpret_generation_await(root_0_10, family_1_3, runtime_0_10, action_5) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, family : async-family<e>, runtime : generation-runtime<e>, action : () -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> ()) -> <pure,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return $kokaine_async_effects.async_await_fs__handle($kokaine_async_effects._Hnd_async_await(3, function(m /* hnd/marker<<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5489>,()> */ , ___wildcard_x598__16 /* hnd/ev<kokaine/async/effects/async-await> */ , x_27 /* (kokaine/async/effects/await-setup<_3720>, kokaine/async/effects/async-scope, string) */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<kokaine/async/effects/await-result<_3720>,()>) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5489> () */ ) {
             
            var x_28_10594 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
             
            function next_27_10595(_y_x10185_0) /* (hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5489> () */  {
              return _mlift_interpret_generation_await_10449(family_1_3, x_27.thd, k, root_0_10, runtime_0_10, x_27.snd, x_27.fst, _y_x10185_0);
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_27_10595);
            }
            else {
              return next_27_10595(x_28_10594);
            }
          });
      }, $std_core_hnd.clause_tail1(function(_pat_x789__20 /* (kokaine/async/effects/await-setup<_3723>, kokaine/async/effects/async-scope, string, (kokaine/async/effects/await-result<_3723>) -> ui ()) */ ) {
         
        var x_29_10597 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10200_0 /* hnd/ev-index */ ) {
            return _mlift_interpret_generation_await_10454(_pat_x789__20.field4, _pat_x789__20.thd, root_0_10, runtime_0_10, _pat_x789__20.snd, _pat_x789__20.fst, _y_x10200_0);
          });
        }
        else {
          return _mlift_interpret_generation_await_10454(_pat_x789__20.field4, _pat_x789__20.thd, root_0_10, runtime_0_10, _pat_x789__20.snd, _pat_x789__20.fst, x_29_10597);
        }
      })), function(_res /* () */ ) {
      return _res;
    }, action_5);
}
 
 
// Install this inside an already established Kokaine turn (in particular,
// inside the action passed to `reenter`). A raw await returns from this handler,
// allowing the surrounding re-entry batch to close. Each later completion
// calls this function again only after entering a fresh generation-bound batch.
export function run_generation_async_with_family(root_1_2, family_2, action_0_0) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, family : async-family<e>, action : () -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> ()) -> <pure,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|e> () */  {
   
  var runtime_1_13 = family_2;
  return $kokaine_async_effects.async_ioc_fs__handle($kokaine_async_effects._Hnd_async_ioc(1, $std_core_hnd.clause_tail1(function(host_action_2 /* () -> ui 4145 */ ) {
         
        var x_30_10599 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10213_0 /* hnd/ev-index */ ) {
            return _mlift_run_generation_async_with_family_10457(host_action_2, _y_x10213_0);
          });
        }
        else {
          return _mlift_run_generation_async_with_family_10457(host_action_2, x_30_10599);
        }
      }), function(m_0 /* hnd/marker<<div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5496>,()> */ , ev /* hnd/ev<kokaine/async/effects/async-ioc> */ , x1_1 /* kokaine/async/effects/async-scope */ , x2_1 /* () -> ui () */ ) {
        return $std_core_hnd.under2(ev, function(scope_1_1 /* kokaine/async/effects/async-scope */ , host_action_0_1 /* () -> ui () */ ) {
             
            var x_31_10602 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10220_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10458(host_action_0_1, root_1_2, runtime_1_13, scope_1_1, _y_x10220_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10458(host_action_0_1, root_1_2, runtime_1_13, scope_1_1, x_31_10602);
            }
          }, x1_1, x2_1);
      }), function(_res_0 /* () */ ) {
      return _res_0;
    }, function() {
      return $kokaine_async_effects.async_ownership_fs__handle($kokaine_async_effects._Hnd_async_ownership(1, $std_core_hnd.clause_tail1(function(dispose_0_1 /* kokaine/async/effects/dispose-fn */ ) {
             
            var x_32_10604 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10223_0 /* hnd/ev-index */ ) {
                return _mlift_run_generation_async_with_family_10460(dispose_0_1, root_1_2, _y_x10223_0);
              });
            }
            else {
              return _mlift_run_generation_async_with_family_10460(dispose_0_1, root_1_2, x_32_10604);
            }
          })), function(_res_0_0 /* () */ ) {
          return _res_0_0;
        }, function() {
           
          var _value_async_scope_l671_c9 = $std_core_hnd._open_none1(function(_this_4 /* async-family<5496> */ ) {
              return _this_4.family_root_scope;
            }, family_2);
          return $kokaine_async_effects.async_cancel_fs__handle($kokaine_async_effects._Hnd_async_cancel(1, $std_core_hnd.clause_tail0(function() {
                return _value_async_scope_l671_c9;
              }), $std_core_hnd.clause_tail1(function(scope_0_1_3 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_33_10606 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10228_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10463(runtime_1_13, scope_0_1_3, _y_x10228_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10463(runtime_1_13, scope_0_1_3, x_33_10606);
                }
              }), $std_core_hnd.clause_tail1(function(scope_1_0_4 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_34_10608 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10235_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10468(runtime_1_13, scope_1_0_4, _y_x10235_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10468(runtime_1_13, scope_1_0_4, x_34_10608);
                }
              }), $std_core_hnd.clause_tail1(function(scope_2_4 /* kokaine/async/effects/async-scope */ ) {
                 
                var x_35_10610 = $std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag);
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10247_0 /* hnd/ev-index */ ) {
                    return _mlift_run_generation_async_with_family_10473(runtime_1_13, scope_2_4, _y_x10247_0);
                  });
                }
                else {
                  return _mlift_run_generation_async_with_family_10473(runtime_1_13, scope_2_4, x_35_10610);
                }
              })), function(_res_1 /* () */ ) {
              return _res_1;
            }, function() {
              return $kokaine_async_effects.discontinue_fs__handle($kokaine_async_effects._Hnd_discontinue(0, function(m_1 /* hnd/marker<<kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5496>,()> */ , ___wildcard_x701__16 /* hnd/ev<kokaine/async/effects/discontinue> */ ) {
                    return $std_core_hnd.yield_to_final(m_1, function(___wildcard_x701__43 /* (hnd/resume-result<4633,()>) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,div,exn,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui|5496> () */ ) {
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
  var _x51 = task_1.task_state;
  var _x50 = $kokaine_reactive_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_ready(_x51);
  if (_x50 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    task_fs_detach_cancellation(task_1);
     
    decrement_outstanding();
    return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_2 /* hnd/marker<ui,()> */ , ___wildcard_x654__16 /* hnd/ev<exn> */ , x_36 /* exception */ ) {
          return $std_core_hnd.yield_to_final(m_2, function(___wildcard_x654__45 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
              var _x52 = x_36.message;
              return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async exception (", $std_core_types._lp__plus__plus__rp_(_x50.value.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x52))));
            });
        }), function(_res_3 /* () */ ) {
        return _res_3;
      }, function() {
        if (_x50.value.claim_result === null) {
          var _x53 = $std_core_types.Unit;
        }
        else {
           
          var runner_10115 = $std_core_hnd._open_none1(function(_this_7 /* async-family<5512> */ ) {
              return _this_7.family_runner;
            }, family_4);
          var _x53 = $kokaine_reactive_internal_application_dash_runner.app_runner_fs_run(runner_10115, function() {
              return $kokaine_reactive_internal_reentry.run_reentry(_x50.value.claim_payload.payload_portal, function() {
                  return resume_generation(_x50.value.claim_payload.payload_portal.reentry_root, family_4, function() {
                      return _x50.value.claim_payload.payload_resume(_x50.value.claim_result.value, true);
                    });
                });
            });
        }
        return $std_core_hnd.finally_prompt(function() {
             
            var _x_x1_10425 = $std_core_hnd._open_none1(function(_this_6 /* generation-task<5511,5512> */ ) {
                return _this_6.task_state;
              }, task_1);
             
            var _pat_4_0_0_0 = $std_core_hnd._open_none1($kokaine_reactive_internal_one_dash_shot_dash_task.one_shot_task_fs_finish, _x_x1_10425);
            return $std_core_types.Unit;
          }, _x53);
      });
  }
}
 
export function stopped_task_cancellation(family_5, claim) /* forall<a,e> (family : async-family<e>, claim : kokaine/reactive/internal/one-shot-task/task-claim<task-payload<a,e>,kokaine/async/effects/await-result<a>,kokaine/async/effects/dispose-fn>) -> div task-cancellation */  {
  return Task_cancellation(function() {
      return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m_3 /* hnd/marker<ui,()> */ , ___wildcard_x654__16_0 /* hnd/ev<exn> */ , x_37 /* exception */ ) {
            return $std_core_hnd.yield_to_final(m_3, function(___wildcard_x654__45_0 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
                var _x54 = x_37.message;
                return report_async_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine async cancellation exception (", $std_core_types._lp__plus__plus__rp_(claim.claim_payload.payload_label, $std_core_types._lp__plus__plus__rp_("): ", _x54))));
              });
          }), function(_res_4 /* () */ ) {
          return _res_4;
        }, function() {
           
          var runner_0_10122 = $std_core_hnd._open_none1(function(_this_8 /* async-family<5524> */ ) {
              return _this_8.family_runner;
            }, family_5);
          return $kokaine_reactive_internal_application_dash_runner.app_runner_fs_run(runner_0_10122, function() {
              return $kokaine_reactive_internal_reentry.run_retirement_reentry(claim.claim_payload.payload_portal, function() {
                  return resume_generation(claim.claim_payload.payload_portal.reentry_root, family_5, function() {
                      return claim.claim_payload.payload_resume($kokaine_async_effects.Cancel, true);
                    });
                });
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
 
export function task_fs_claim_stop(task_2, family_6) /* forall<a,e> (task : generation-task<a,e>, family : async-family<e>) -> div maybe<task-cancellation> */  {
   
  var _x55 = task_2.task_supervisor.supervisor_reason;
  var reason = _x55.value;
  var _x56 = task_2.task_state;
  var _x55 = $kokaine_reactive_internal_one_dash_shot_dash_task.one_shot_task_fs_claim_stop(_x56, reason);
  if (_x55 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    var _x57 = task_2.task_cancel;
    ((_x57).value = ($std_core_types.Nothing));
     
    decrement_outstanding();
    return $std_core_types.Just(stopped_task_cancellation(family_6, _x55.value));
  }
}
 
 
// Scheduled host actions are ordinary generation-owned tasks. Keep their
// structural phase evidence live through registration; erasing it would make
// owner cleanup masks invalid at runtime on Koka's JavaScript backend.
export function register_scheduled_ioc(root_5, runtime_2_0, scope_3_0, host_action_1_0) /* forall<e> (root : kokaine/reactive/internal/model/root<<ui|e>>, runtime : generation-runtime<e>, scope : kokaine/async/effects/async-scope, host-action : () -> ui ()) -> <pure,kokaine/reactive/effects/signal-write,ui|e> () */  {
  return register_task(root_5, runtime_2_0, scope_3_0, "scheduled host action", function(resume /* (kokaine/async/effects/await-result<()>, bool) -> ui () */ ) {
       
      $kokaine_async_internal_web_dash_schedule.enqueue_microtask(function() {
        return resume($kokaine_async_effects.Result($std_core_types.Unit), true);
      });
      return $std_core_types.Ok(function() {
        return $std_core_types.Unit;
      });
    }, function(result_3 /* kokaine/async/effects/await-result<()> */ , ___wildcard_x571__36 /* bool */ ) {
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
    var _x57 = $kokaine_internal_registry.registry_registration_fs_take(registration);
    if (_x57 === null) {
      return false;
    }
    else {
       
      decrement_outstanding();
      return true;
    }
  };
}
 
export function async_lease_group_fs_own(group, dispose) /* (group : async-lease-group, dispose : kokaine/async/effects/dispose-fn) -> ui kokaine/async/effects/ownership-release-fn */  {
  var _x58 = $kokaine_internal_registry.registry_fs_try_insert(group, dispose);
  if (_x58 === null) {
     
    dispose();
    return function() {
      return false;
    };
  }
  else {
     
    var x_10025 = outstanding_operations.value;
     
    var value_10024 = $std_core_types._int_add(x_10025,1);
     
    ((outstanding_operations).value = value_10024);
    return function() {
      var _x59 = $kokaine_internal_registry.registry_registration_fs_take(_x58.value);
      if (_x59 === null) {
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
         
        var list_10138 = ((loc).value);
        return (list_10138 === null) ? false : true;
      }, function() {
        var _x60 = ((loc).value);
        if (_x60 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x60.tail));
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
         
        var list_10142 = ((loc).value);
        return (list_10142 === null) ? false : true;
      }, function() {
        var _x60 = ((loc).value);
        if (_x60 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          ((loc).value = (_x60.tail));
          return _x60.head();
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function async_lease_group_fs_dispose(group) /* (group : async-lease-group) -> ui () */  {
  var _x60 = $kokaine_internal_registry.registry_fs_seal_detach(group);
  if (_x60 === null) {
    return $std_core_types.Unit;
  }
  else {
     
    account_async_lease_disposers(_x60.value);
    return run_async_lease_disposers(_x60.value);
  }
}
 
export function run_generation_async(root, action) /* (root : kokaine/reactive/internal/model/root<ui>, action : () -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> ()) -> <pure,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> () */  {
  return run_generation_async_with_family(root, Async_family($std_core_hnd._open_none0($kokaine_internal_registry.new_registry), $std_core_hnd._open_none0($kokaine_internal_int_dash_index.new_int_index), { value: ($std_core_types.Nil) }, $std_core_hnd._open_none0($kokaine_async_effects.new_runtime_scope_root), function(run_action /* () -> <exn,ui> 5990 */ ) {
        return run_action();
      }), action);
}