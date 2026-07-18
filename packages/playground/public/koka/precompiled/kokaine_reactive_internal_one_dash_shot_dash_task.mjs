// Koka generated module: kokaine/reactive/internal/one-shot-task, koka version: 3.2.4
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
 
// externals
 
// type declarations
// type task-stop-reason
export const Task_canceled = 1; // task-stop-reason
export const Task_retired = 2; // task-stop-reason
// type task-terminal
export const Task_completed = null; // task-terminal
export function Task_stopped(task_stop_state) /* (task-stop-state : task-stop-reason) -> task-terminal */  {
  return { task_stop_state: task_stop_state };
}
// type task-state
export function Task_state_pending(pending_payload, pending_disposer) /* forall<a,b,c> (pending-payload : a, pending-disposer : maybe<c>) -> task-state<a,b,c> */  {
  return { _tag: 1, pending_payload: pending_payload, pending_disposer: pending_disposer };
}
export function Task_state_ready(ready_payload, ready_result, ready_disposer) /* forall<a,b,c> (ready-payload : a, ready-result : b, ready-disposer : maybe<c>) -> task-state<a,b,c> */  {
  return { _tag: 2, ready_payload: ready_payload, ready_result: ready_result, ready_disposer: ready_disposer };
}
export const Task_state_running = { _tag: 3 }; // forall<a,b,c> task-state<a,b,c>
export function Task_state_terminal(terminal_state) /* forall<a,b,c> (terminal-state : task-terminal) -> task-state<a,b,c> */  {
  return { _tag: 4, terminal_state: terminal_state };
}
// type one-shot-task
export function One_shot_task(task_cell) /* forall<a,b,c> (task-cell : ref<global,task-state<a,b,c>>) -> one-shot-task<a,b,c> */  {
  return task_cell;
}
// type task-claim
export function Task_claim(claim_payload, claim_result, claim_disposer) /* forall<a,b,c> (claim-payload : a, claim-result : maybe<b>, claim-disposer : maybe<c>) -> task-claim<a,b,c> */  {
  return { claim_payload: claim_payload, claim_result: claim_result, claim_disposer: claim_disposer };
}
// type task-phase
export const Task_pending = { _tag: 1 }; // task-phase
export const Task_ready = { _tag: 2 }; // task-phase
export const Task_running = { _tag: 3 }; // task-phase
export function Task_finished(task_terminal_state) /* (task-terminal-state : task-terminal) -> task-phase */  {
  return { _tag: 4, task_terminal_state: task_terminal_state };
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
 
 
// Automatically generated. Tests for the `Task-canceled` constructor of the `:task-stop-reason` type.
export function is_task_canceled(task_stop_reason) /* (task-stop-reason : task-stop-reason) -> bool */  {
  return (task_stop_reason === 1);
}
 
 
// Automatically generated. Tests for the `Task-retired` constructor of the `:task-stop-reason` type.
export function is_task_retired(task_stop_reason) /* (task-stop-reason : task-stop-reason) -> bool */  {
  return (task_stop_reason === 2);
}
 
 
// Automatically generated. Tests for the `Task-completed` constructor of the `:task-terminal` type.
export function is_task_completed(task_terminal) /* (task-terminal : task-terminal) -> bool */  {
  return (task_terminal === null);
}
 
 
// Automatically generated. Tests for the `Task-stopped` constructor of the `:task-terminal` type.
export function is_task_stopped(task_terminal) /* (task-terminal : task-terminal) -> bool */  {
  return (task_terminal !== null);
}
 
 
// Automatically generated. Tests for the `Task-pending` constructor of the `:task-phase` type.
export function is_task_pending(task_phase) /* (task-phase : task-phase) -> bool */  {
  return (task_phase._tag === 1);
}
 
 
// Automatically generated. Tests for the `Task-ready` constructor of the `:task-phase` type.
export function is_task_ready(task_phase) /* (task-phase : task-phase) -> bool */  {
  return (task_phase._tag === 2);
}
 
 
// Automatically generated. Tests for the `Task-running` constructor of the `:task-phase` type.
export function is_task_running(task_phase) /* (task-phase : task-phase) -> bool */  {
  return (task_phase._tag === 3);
}
 
 
// Automatically generated. Tests for the `Task-finished` constructor of the `:task-phase` type.
export function is_task_finished(task_phase) /* (task-phase : task-phase) -> bool */  {
  return (task_phase._tag === 4);
}
 
 
// Automatically generated. Retrieves the `claim-payload` constructor field of the `:task-claim` type.
export function task_claim_fs_claim_payload(_this) /* forall<a,b,c> (task-claim<a,b,c>) -> a */  {
  return _this.claim_payload;
}
 
 
// Automatically generated. Retrieves the `claim-result` constructor field of the `:task-claim` type.
export function task_claim_fs_claim_result(_this) /* forall<a,b,c> (task-claim<a,b,c>) -> maybe<b> */  {
  return _this.claim_result;
}
 
 
// Automatically generated. Retrieves the `claim-disposer` constructor field of the `:task-claim` type.
export function task_claim_fs_claim_disposer(_this) /* forall<a,b,c> (task-claim<a,b,c>) -> maybe<c> */  {
  return _this.claim_disposer;
}
 
export function task_claim_fs__copy(_this, claim_payload, claim_result, claim_disposer) /* forall<a,b,c> (task-claim<a,b,c>, claim-payload : ? a, claim-result : ? (maybe<b>), claim-disposer : ? (maybe<c>)) -> task-claim<a,b,c> */  {
  if (claim_payload !== undefined) {
    var _x0 = claim_payload;
  }
  else {
    var _x0 = _this.claim_payload;
  }
  if (claim_result !== undefined) {
    var _x1 = claim_result;
  }
  else {
    var _x1 = _this.claim_result;
  }
  if (claim_disposer !== undefined) {
    var _x2 = claim_disposer;
  }
  else {
    var _x2 = _this.claim_disposer;
  }
  return Task_claim(_x0, _x1, _x2);
}
 
 
// Automatically generated. Tests for the `Task-state-pending` constructor of the `:task-state` type.
export function is_task_state_pending(task_state) /* forall<a,b,c> (task-state : task-state<a,b,c>) -> bool */  {
  return (task_state._tag === 1);
}
 
 
// Automatically generated. Tests for the `Task-state-ready` constructor of the `:task-state` type.
export function is_task_state_ready(task_state) /* forall<a,b,c> (task-state : task-state<a,b,c>) -> bool */  {
  return (task_state._tag === 2);
}
 
 
// Automatically generated. Tests for the `Task-state-running` constructor of the `:task-state` type.
export function is_task_state_running(task_state) /* forall<a,b,c> (task-state : task-state<a,b,c>) -> bool */  {
  return (task_state._tag === 3);
}
 
 
// Automatically generated. Tests for the `Task-state-terminal` constructor of the `:task-state` type.
export function is_task_state_terminal(task_state) /* forall<a,b,c> (task-state : task-state<a,b,c>) -> bool */  {
  return (task_state._tag === 4);
}
 
 
// Automatically generated. Retrieves the `task-cell` constructor field of the `:one-shot-task` type.
export function one_shot_task_fs_task_cell(_this) /* forall<a,b,c> (one-shot-task<a,b,c>) -> ref<global,task-state<a,b,c>> */  {
  return _this;
}
 
export function one_shot_task_fs__copy(_this, task_cell) /* forall<a,b,c> (one-shot-task<a,b,c>, task-cell : ? (ref<global,task-state<a,b,c>>)) -> one-shot-task<a,b,c> */  {
  if (task_cell !== undefined) {
    var _x3 = task_cell;
  }
  else {
    var _x3 = _this;
  }
  return _x3;
}
 
export function new_one_shot_task(payload) /* forall<a,b,c> (payload : b) -> one-shot-task<b,c,a> */  {
  return { value: (Task_state_pending(payload, $std_core_types.Nothing)) };
}
 
export function one_shot_task_fs_phase(task) /* forall<a,b,c> (task : one-shot-task<b,c,a>) -> task-phase */  {
  var _x5 = task;
  var _x4 = _x5.value;
  if (_x4._tag === 1) {
    return Task_pending;
  }
  else if (_x4._tag === 2) {
    return Task_ready;
  }
  else if (_x4._tag === 3) {
    return Task_running;
  }
  else {
    return Task_finished(_x4.terminal_state);
  }
}
 
export function one_shot_task_fs_accept(task, result) /* forall<a,b,c> (task : one-shot-task<b,c,a>, result : c) -> bool */  {
  var _x7 = task;
  var _x6 = _x7.value;
  if (_x6._tag === 1) {
     
    var _x8 = task;
    ((_x8).value = (Task_state_ready(_x6.pending_payload, result, _x6.pending_disposer)));
    return true;
  }
  else {
    return false;
  }
}
 
 
// `Nothing` means the disposer was retained by the task. `Just(disposer)`
// transfers it back to setup code because another transition already won.
export function one_shot_task_fs_install_disposer(task, disposer) /* forall<a,b,c> (task : one-shot-task<b,c,a>, disposer : a) -> maybe<a> */  {
  var _x9 = task;
  var _x8 = _x9.value;
  if (_x8._tag === 1 && _x8.pending_disposer === null) {
     
    var _x10 = task;
    ((_x10).value = (Task_state_pending(_x8.pending_payload, $std_core_types.Just(disposer))));
    return $std_core_types.Nothing;
  }
  else if (_x8._tag === 2 && _x8.ready_disposer === null) {
     
    var _x10 = task;
    ((_x10).value = (Task_state_ready(_x8.ready_payload, _x8.ready_result, $std_core_types.Just(disposer))));
    return $std_core_types.Nothing;
  }
  else {
    return $std_core_types.Just(disposer);
  }
}
 
export function one_shot_task_fs_claim_ready(task) /* forall<a,b,c> (task : one-shot-task<b,c,a>) -> maybe<task-claim<b,c,a>> */  {
  var _x11 = task;
  var _x10 = _x11.value;
  if (_x10._tag === 2) {
     
    var _x12 = task;
    ((_x12).value = Task_state_running);
    return $std_core_types.Just(Task_claim(_x10.ready_payload, $std_core_types.Just(_x10.ready_result), _x10.ready_disposer));
  }
  else {
    return $std_core_types.Nothing;
  }
}
 
export function one_shot_task_fs_claim_stop(task, reason) /* forall<a,b,c> (task : one-shot-task<b,c,a>, reason : task-stop-reason) -> maybe<task-claim<b,c,a>> */  {
  var _x13 = task;
  var _x12 = _x13.value;
  if (_x12._tag === 1) {
     
    var _x14 = task;
    ((_x14).value = (Task_state_terminal(Task_stopped(reason))));
    return $std_core_types.Just(Task_claim(_x12.pending_payload, $std_core_types.Nothing, _x12.pending_disposer));
  }
  else if (_x12._tag === 2) {
     
    var _x14 = task;
    ((_x14).value = (Task_state_terminal(Task_stopped(reason))));
    return $std_core_types.Just(Task_claim(_x12.ready_payload, $std_core_types.Just(_x12.ready_result), _x12.ready_disposer));
  }
  else {
    return $std_core_types.Nothing;
  }
}
 
export function one_shot_task_fs_finish(task) /* forall<a,b,c> (task : one-shot-task<b,c,a>) -> bool */  {
  var _x15 = task;
  var _x14 = _x15.value;
  if (_x14._tag === 3) {
     
    var _x16 = task;
    ((_x16).value = (Task_state_terminal(Task_completed)));
    return true;
  }
  else {
    return false;
  }
}