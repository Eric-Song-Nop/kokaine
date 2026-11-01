// Koka generated module: kokaine/reactive/internal/work-transaction, koka version: 3.2.4
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
 
// externals
 
// type declarations
// type deque
export function Deque(deque_front, deque_back) /* forall<a> (deque-front : list<a>, deque-back : list<a>) -> deque<a> */  {
  return { deque_front: deque_front, deque_back: deque_back };
}
// type work-transaction-state
export const Work_open = { _tag: 1 }; // work-transaction-state
export const Work_draining = { _tag: 2 }; // work-transaction-state
export const Work_ready = { _tag: 3 }; // work-transaction-state
export function Work_failed(work_failure) /* (work-failure : exception) -> work-transaction-state */  {
  return { _tag: 4, work_failure: work_failure };
}
export const Work_committed = { _tag: 5 }; // work-transaction-state
export const Work_aborted = { _tag: 6 }; // work-transaction-state
// type work-group
export function Work_group(group_state, group_queue, group_rollback) /* forall<a> (group-state : ref<global,work-transaction-state>, group-queue : work-queue<a>, group-rollback : work-queue<a>) -> work-group<a> */  {
  return { group_state: group_state, group_queue: group_queue, group_rollback: group_rollback };
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
 
 
// Automatically generated. Retrieves the `deque-front` constructor field of the `:deque` type.
export function deque_fs_deque_front(deque) /* forall<a> (deque : deque<a>) -> list<a> */  {
  return deque.deque_front;
}
 
 
// Automatically generated. Retrieves the `deque-back` constructor field of the `:deque` type.
export function deque_fs_deque_back(deque) /* forall<a> (deque : deque<a>) -> list<a> */  {
  return deque.deque_back;
}
 
export function deque_fs__copy(_this, deque_front, deque_back) /* forall<a> (deque<a>, deque-front : ? (list<a>), deque-back : ? (list<a>)) -> deque<a> */  {
  if (deque_front !== undefined) {
    var _x0 = deque_front;
  }
  else {
    var _x0 = _this.deque_front;
  }
  if (deque_back !== undefined) {
    var _x1 = deque_back;
  }
  else {
    var _x1 = _this.deque_back;
  }
  return Deque(_x0, _x1);
}
 
export function empty_deque() /* forall<a> () -> deque<a> */  {
  return Deque($std_core_types.Nil, $std_core_types.Nil);
}
 
export function deque_fs_prepend(target, value) /* forall<a> (target : deque<a>, value : a) -> deque<a> */  {
  var _x2 = target.deque_front;
  var _x3 = target.deque_back;
  return Deque($std_core_types.Cons(value, _x2), _x3);
}
 
export function deque_fs_append(target, value) /* forall<a> (target : deque<a>, value : a) -> deque<a> */  {
  var _x4 = target.deque_front;
  var _x5 = target.deque_back;
  return Deque(_x4, $std_core_types.Cons(value, _x5));
}
 
export function deque_fs_pop(target) /* forall<a> (target : deque<a>) -> (maybe<a>, deque<a>) */  {
  if (target.deque_front !== null) {
    var _x6 = target.deque_back;
    return $std_core_types.Tuple2($std_core_types.Just(target.deque_front.head), Deque(target.deque_front.tail, _x6));
  }
  else {
     
    var _x7 = target.deque_back;
    var values = $std_core_list.reverse_acc($std_core_types.Nil, _x7);
    if (values === null) {
      return $std_core_types.Tuple2($std_core_types.Nothing, Deque($std_core_types.Nil, $std_core_types.Nil));
    }
    else {
      return $std_core_types.Tuple2($std_core_types.Just(values.head), Deque(values.tail, $std_core_types.Nil));
    }
  }
}
 
export function deque_fs_values(target) /* forall<a> (target : deque<a>) -> list<a> */  {
   
  var _x7 = target.deque_back;
  var ys_10016 = $std_core_list.reverse_acc($std_core_types.Nil, _x7);
  var _x7 = target.deque_front;
  return $std_core_list.append(_x7, ys_10016);
}
 
export function new_work_queue() /* forall<a> () -> work-queue<a> */  {
  return { value: (Deque($std_core_types.Nil, $std_core_types.Nil)) };
}
 
 
// Automatically generated. Retrieves the `group-state` constructor field of the `:work-group` type.
export function work_group_fs_group_state(_this) /* forall<a> (work-group<a>) -> ref<global,work-transaction-state> */  {
  return _this.group_state;
}
 
 
// Automatically generated. Retrieves the `group-queue` constructor field of the `:work-group` type.
export function work_group_fs_group_queue(_this) /* forall<a> (work-group<a>) -> work-queue<a> */  {
  return _this.group_queue;
}
 
export function work_queue_fs_prepend(target, value) /* forall<a> (target : work-queue<a>, value : a) -> () */  {
   
  var target_1_10024 = target.value;
  var _x8 = target_1_10024.deque_front;
  var _x9 = target_1_10024.deque_back;
  return ((target).value = (Deque($std_core_types.Cons(value, _x8), _x9)));
}
 
export function work_group_fs_prepend(group, value) /* forall<a> (group : work-group<a>, value : a) -> () */  {
   
  var _x10 = group.group_queue;
  var target_1_10024 = _x10.value;
  var _x10 = group.group_queue;
  var _x11 = target_1_10024.deque_front;
  var _x12 = target_1_10024.deque_back;
  return ((_x10).value = (Deque($std_core_types.Cons(value, _x11), _x12)));
}
 
export function work_queue_fs_append(target, value) /* forall<a> (target : work-queue<a>, value : a) -> () */  {
   
  var target_1_10034 = target.value;
  var _x13 = target_1_10034.deque_front;
  var _x14 = target_1_10034.deque_back;
  return ((target).value = (Deque(_x13, $std_core_types.Cons(value, _x14))));
}
 
export function work_group_fs_append(group, value) /* forall<a> (group : work-group<a>, value : a) -> () */  {
   
  var _x15 = group.group_queue;
  var target_1_10034 = _x15.value;
  var _x15 = group.group_queue;
  var _x16 = target_1_10034.deque_front;
  var _x17 = target_1_10034.deque_back;
  return ((_x15).value = (Deque(_x16, $std_core_types.Cons(value, _x17))));
}
 
export function work_queue_fs_pop(target) /* forall<a> (target : work-queue<a>) -> maybe<a> */  {
  var _x18 = deque_fs_pop(target.value);
   
  ((target).value = (_x18.snd));
  return _x18.fst;
}
 
export function work_group_fs_pop(group) /* forall<a> (group : work-group<a>) -> maybe<a> */  {
  var _x20 = group.group_queue;
  var _x19 = deque_fs_pop(_x20.value);
   
  var _x21 = group.group_queue;
  ((_x21).value = (_x19.snd));
  return _x19.fst;
}
 
export function work_queue_fs_values(target) /* forall<a> (target : work-queue<a>) -> list<a> */  {
   
  var target_0_10145 = target.value;
   
  var _x21 = target_0_10145.deque_back;
  var ys_10016 = $std_core_list.reverse_acc($std_core_types.Nil, _x21);
  var _x21 = target_0_10145.deque_front;
  return $std_core_list.append(_x21, ys_10016);
}
 
export function work_group_fs_values(group) /* forall<a> (group : work-group<a>) -> list<a> */  {
   
  var _x22 = group.group_queue;
  var target_10146 = _x22.value;
   
  var _x23 = target_10146.deque_back;
  var ys_10016 = $std_core_list.reverse_acc($std_core_types.Nil, _x23);
  var _x22 = target_10146.deque_front;
  return $std_core_list.append(_x22, ys_10016);
}
 
export function _trmc_remove_first(values, matches, _acc) /* forall<a> (values : list<a>, matches : (a) -> bool, ctx<list<a>>) -> div list<a> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types._cctx_apply(_acc,($std_core_types.Nil));
  }
  else {
    var _x23 = matches(values.head);
    if (_x23) {
      return $std_core_types._cctx_apply(_acc,(values.tail));
    }
    else {
       
      var _trmc_x10149 = undefined;
       
      var _trmc_x10150 = $std_core_types.Cons(values.head, _trmc_x10149);
      {
        // tail call
        var _x24 = $std_core_types._cctx_extend(_acc,_trmc_x10150,({obj: _trmc_x10150, field_name: "tail"}));
        values = values.tail;
        _acc = _x24;
        continue tailcall;
      }
    }
  }
}}
 
export function remove_first(values_0, matches_0) /* forall<a> (values : list<a>, matches : (a) -> bool) -> div list<a> */  {
  return _trmc_remove_first(values_0, matches_0, $std_core_types._cctx_empty());
}
 
 
// O(n); used only on the failure path.
export function work_queue_fs_remove(target, matches) /* forall<a> (target : work-queue<a>, matches : (a) -> bool) -> () */  {
   
  var target_0_10147 = target.value;
   
  var _x25 = target_0_10147.deque_back;
  var ys_10016 = $std_core_list.reverse_acc($std_core_types.Nil, _x25);
   
  var _x26 = target_0_10147.deque_front;
  var values = $std_core_list.append(_x26, ys_10016);
   
  var value_0_10057 = Deque(_trmc_remove_first(values, matches, $std_core_types._cctx_empty()), $std_core_types.Nil);
  return ((target).value = value_0_10057);
}
 
export function work_queue_fs_clear(target) /* forall<a> (target : work-queue<a>) -> () */  {
  return ((target).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
}
 
export function append_values_loop(target, values) /* forall<a> (target : work-queue<a>, values : list<a>) -> div () */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Unit;
  }
  else {
     
    work_queue_fs_append(target, values.head);
    {
      // tail call
      values = values.tail;
      continue tailcall;
    }
  }
}}
 
export function work_queue_fs_append_values(target, values) /* forall<a> (target : work-queue<a>, values : list<a>) -> () */  {
  return append_values_loop(target, values);
}
 
 
// Automatically generated. Tests for the `Work-open` constructor of the `:work-transaction-state` type.
export function is_work_open(work_transaction_state) /* (work-transaction-state : work-transaction-state) -> bool */  {
  return (work_transaction_state._tag === 1);
}
 
 
// Automatically generated. Tests for the `Work-draining` constructor of the `:work-transaction-state` type.
export function is_work_draining(work_transaction_state) /* (work-transaction-state : work-transaction-state) -> bool */  {
  return (work_transaction_state._tag === 2);
}
 
 
// Automatically generated. Tests for the `Work-ready` constructor of the `:work-transaction-state` type.
export function is_work_ready(work_transaction_state) /* (work-transaction-state : work-transaction-state) -> bool */  {
  return (work_transaction_state._tag === 3);
}
 
 
// Automatically generated. Tests for the `Work-failed` constructor of the `:work-transaction-state` type.
export function is_work_failed(work_transaction_state) /* (work-transaction-state : work-transaction-state) -> bool */  {
  return (work_transaction_state._tag === 4);
}
 
 
// Automatically generated. Tests for the `Work-committed` constructor of the `:work-transaction-state` type.
export function is_work_committed(work_transaction_state) /* (work-transaction-state : work-transaction-state) -> bool */  {
  return (work_transaction_state._tag === 5);
}
 
 
// Automatically generated. Tests for the `Work-aborted` constructor of the `:work-transaction-state` type.
export function is_work_aborted(work_transaction_state) /* (work-transaction-state : work-transaction-state) -> bool */  {
  return (work_transaction_state._tag === 6);
}
 
 
// Automatically generated. Retrieves the `group-rollback` constructor field of the `:work-group` type.
export function work_group_fs_group_rollback(_this) /* forall<a> (work-group<a>) -> work-queue<a> */  {
  return _this.group_rollback;
}
 
export function work_group_fs__copy(_this, group_state, group_queue, group_rollback) /* forall<a> (work-group<a>, group-state : ? (ref<global,work-transaction-state>), group-queue : ? (work-queue<a>), group-rollback : ? (work-queue<a>)) -> work-group<a> */  {
  if (group_state !== undefined) {
    var _x25 = group_state;
  }
  else {
    var _x25 = _this.group_state;
  }
  if (group_queue !== undefined) {
    var _x26 = group_queue;
  }
  else {
    var _x26 = _this.group_queue;
  }
  if (group_rollback !== undefined) {
    var _x27 = group_rollback;
  }
  else {
    var _x27 = _this.group_rollback;
  }
  return Work_group(_x25, _x26, _x27);
}
 
export function new_work_transaction_state() /* () -> ref<global,work-transaction-state> */  {
  return { value: Work_open };
}
 
export function new_work_group(state) /* forall<a> (state : ref<global,work-transaction-state>) -> work-group<a> */  {
  return Work_group(state, { value: (Deque($std_core_types.Nil, $std_core_types.Nil)) }, { value: (Deque($std_core_types.Nil, $std_core_types.Nil)) });
}
 
export function work_group_fs_state(group) /* forall<a> (group : work-group<a>) -> work-transaction-state */  {
  var _x28 = group.group_state;
  return _x28.value;
}
 
export function work_group_fs_same_transaction(left, right) /* forall<a,b> (left : work-group<a>, right : work-group<b>) -> bool */  {
  var _x29 = left.group_state;
  var _x30 = right.group_state;
  return Object.is(_x29,_x30);
}
 
 
// A bootstrap enters the runnable queue once but remains in the rollback
// ledger until the complete transaction commits or aborts. Drain-time requeues
// use `append`/`prepend` and therefore cannot duplicate transaction ownership.
export function work_group_fs_track(group, value) /* forall<a> (group : work-group<a>, value : a) -> () */  {
   
  var _x31 = group.group_rollback;
  var target_1_10034 = _x31.value;
   
  var _x32 = group.group_rollback;
  var _x33 = target_1_10034.deque_front;
  var _x34 = target_1_10034.deque_back;
  ((_x32).value = (Deque(_x33, $std_core_types.Cons(value, _x34))));
   
  var _x35 = group.group_queue;
  var target_1_10034_0 = _x35.value;
  var _x31 = group.group_queue;
  var _x32 = target_1_10034_0.deque_front;
  var _x33 = target_1_10034_0.deque_back;
  return ((_x31).value = (Deque(_x32, $std_core_types.Cons(value, _x33))));
}
 
export function work_group_fs_append_values(group, values) /* forall<a> (group : work-group<a>, values : list<a>) -> () */  {
  var _x34 = group.group_queue;
  return append_values_loop(_x34, values);
}
 
export function work_group_fs_clear(group) /* forall<a> (group : work-group<a>) -> () */  {
   
  var _x35 = group.group_queue;
  ((_x35).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
  var _x35 = group.group_rollback;
  return ((_x35).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
}
 
export function work_group_fs_take_all(group) /* forall<a> (group : work-group<a>) -> list<a> */  {
   
  var values = work_group_fs_values(group);
   
  var _x36 = group.group_queue;
  ((_x36).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
  return values;
}
 
export function work_group_fs_take_rollback(group) /* forall<a> (group : work-group<a>) -> list<a> */  {
   
  var _x36 = group.group_rollback;
  var target_10148 = _x36.value;
   
  var _x37 = target_10148.deque_back;
  var ys_10016 = $std_core_list.reverse_acc($std_core_types.Nil, _x37);
   
  var _x38 = target_10148.deque_front;
  var values = $std_core_list.append(_x38, ys_10016);
   
  var _x39 = group.group_rollback;
  ((_x39).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
  return values;
}
 
export function work_group_fs_release_rollback(group) /* forall<a> (group : work-group<a>) -> () */  {
  var _x36 = group.group_rollback;
  return ((_x36).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
}
 
export function work_group_fs_begin_drain(group) /* forall<a> (group : work-group<a>) -> bool */  {
  var _x37 = work_group_fs_state(group);
  if (_x37._tag === 1) {
     
    var _x38 = group.group_state;
    ((_x38).value = Work_draining);
    return true;
  }
  else {
    return false;
  }
}
 
export function work_group_fs_mark_ready(group) /* forall<a> (group : work-group<a>) -> bool */  {
  var _x38 = work_group_fs_state(group);
  if (_x38._tag === 2) {
     
    var _x39 = group.group_state;
    ((_x39).value = Work_ready);
    return true;
  }
  else {
    return false;
  }
}
 
export function work_group_fs_mark_failed(group, failure) /* forall<a> (group : work-group<a>, failure : exception) -> bool */  {
  var _x39 = work_group_fs_state(group);
  if (_x39._tag === 1) {
     
    var _x40 = group.group_state;
    ((_x40).value = (Work_failed(failure)));
    return true;
  }
  else if (_x39._tag === 2) {
     
    var _x40 = group.group_state;
    ((_x40).value = (Work_failed(failure)));
    return true;
  }
  else {
    return false;
  }
}
 
export function work_group_fs_mark_committed(group) /* forall<a> (group : work-group<a>) -> bool */  {
  var _x40 = work_group_fs_state(group);
  if (_x40._tag === 3) {
     
    var _x41 = group.group_state;
    ((_x41).value = Work_committed);
    return true;
  }
  else {
    return false;
  }
}
 
export function work_group_fs_mark_aborted(group) /* forall<a> (group : work-group<a>) -> bool */  {
  var _x41 = work_group_fs_state(group);
  if (_x41._tag === 5) {
    return false;
  }
  else if (_x41._tag === 6) {
    return false;
  }
  else {
     
    var _x42 = group.group_state;
    ((_x42).value = Work_aborted);
     
    work_group_fs_clear(group);
    return true;
  }
}
 
export function route_resume(global, value) /* forall<a> (global : work-queue<a>, value : a) -> () */  {
  return work_queue_fs_prepend(global, value);
}
 
export function route_bootstrap(global, active, value) /* forall<a> (global : work-queue<a>, active : maybe<work-group<a>>, value : a) -> () */  {
  if (active !== null) {
    var _x42 = work_group_fs_state(active.value);
    if (_x42._tag === 1) {
       
      var _x43 = active.value.group_rollback;
      var target_1_10034 = _x43.value;
       
      var _x44 = active.value.group_rollback;
      var _x45 = target_1_10034.deque_front;
      var _x46 = target_1_10034.deque_back;
      ((_x44).value = (Deque(_x45, $std_core_types.Cons(value, _x46))));
       
      var _x47 = active.value.group_queue;
      var target_1_10034_0 = _x47.value;
      var _x43 = active.value.group_queue;
      var _x44 = target_1_10034_0.deque_front;
      var _x45 = target_1_10034_0.deque_back;
      return ((_x43).value = (Deque(_x44, $std_core_types.Cons(value, _x45))));
    }
    else if (_x42._tag === 2) {
       
      var _x46 = active.value.group_rollback;
      var target_1_10034_1 = _x46.value;
       
      var _x47 = active.value.group_rollback;
      var _x48 = target_1_10034_1.deque_front;
      var _x49 = target_1_10034_1.deque_back;
      ((_x47).value = (Deque(_x48, $std_core_types.Cons(value, _x49))));
       
      var _x50 = active.value.group_queue;
      var target_1_10034_2 = _x50.value;
      var _x46 = active.value.group_queue;
      var _x47 = target_1_10034_2.deque_front;
      var _x48 = target_1_10034_2.deque_back;
      return ((_x46).value = (Deque(_x47, $std_core_types.Cons(value, _x48))));
    }
    else {
      return work_queue_fs_append(global, value);
    }
  }
  else {
    return work_queue_fs_append(global, value);
  }
}