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
// type work-publication
export function Work_publication(publication_prepare, publication_publish, publication_rollback) /* forall<e> (publication-prepare : () -> <exn|e> (), publication-publish : () -> (), publication-rollback : () -> <exn|e> ()) -> work-publication<e> */  {
  return { publication_prepare: publication_prepare, publication_publish: publication_publish, publication_rollback: publication_rollback };
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
 
 
// Automatically generated. Retrieves the `publication-prepare` constructor field of the `:work-publication` type.
export function work_publication_fs_publication_prepare(_this) /* forall<e> (work-publication<e>) -> (() -> <exn|e> ()) */  {
  return _this.publication_prepare;
}
 
 
// Automatically generated. Retrieves the `publication-publish` constructor field of the `:work-publication` type.
export function work_publication_fs_publication_publish(_this) /* forall<e> (work-publication<e>) -> (() -> ()) */  {
  return _this.publication_publish;
}
 
 
// Automatically generated. Retrieves the `publication-rollback` constructor field of the `:work-publication` type.
export function work_publication_fs_publication_rollback(_this) /* forall<e> (work-publication<e>) -> (() -> <exn|e> ()) */  {
  return _this.publication_rollback;
}
 
 
// monadic lift
export function work_publication_fs__mlift_copy_10158(_c_x10148, _this, publication_publish, _c_x10150) /* forall<e> (() -> <exn|e> (), work-publication<e>, publication-publish : ? (() -> ()), () -> <exn|e> ()) -> work-publication<e> */  {
  if (publication_publish !== undefined) {
    var _x8 = publication_publish;
  }
  else {
    var _x8 = _this.publication_publish;
  }
  return Work_publication(_c_x10148, _x8, _c_x10150);
}
 
 
// monadic lift
export function work_publication_fs__mlift_copy_10159(_this, publication_publish, publication_rollback, _c_x10148) /* forall<e> (work-publication<e>, publication-publish : ? (() -> ()), publication-rollback : ? (() -> <exn|e> ()), () -> <exn|e> ()) -> work-publication<e> */  {
   
  function next_10161(_c_x10150) /* (() -> <exn|862> ()) -> work-publication<862> */  {
    if (publication_publish !== undefined) {
      var _x9 = publication_publish;
    }
    else {
      var _x9 = _this.publication_publish;
    }
    return Work_publication(_c_x10148, _x9, _c_x10150);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10161);
  }
  else {
    if (publication_rollback !== undefined) {
      var _x9 = publication_rollback;
    }
    else {
      var _x9 = _this.publication_rollback;
    }
    return next_10161(_x9);
  }
}
 
export function work_publication_fs__copy(_this, publication_prepare, publication_publish, publication_rollback) /* forall<e> (work-publication<e>, publication-prepare : ? (() -> <exn|e> ()), publication-publish : ? (() -> ()), publication-rollback : ? (() -> <exn|e> ())) -> work-publication<e> */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10148 /* () -> <exn|862> () */ ) {
      return work_publication_fs__mlift_copy_10159(_this, publication_publish, publication_rollback, _c_x10148);
    });
  }
  else {
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10150 /* () -> <exn|862> () */ ) {
        if (publication_prepare !== undefined) {
          var _x10 = publication_prepare;
        }
        else {
          var _x10 = _this.publication_prepare;
        }
        if (publication_publish !== undefined) {
          var _x11 = publication_publish;
        }
        else {
          var _x11 = _this.publication_publish;
        }
        return Work_publication(_x10, _x11, _c_x10150);
      });
    }
    else {
      if (publication_prepare !== undefined) {
        var _x12 = publication_prepare;
      }
      else {
        var _x12 = _this.publication_prepare;
      }
      if (publication_publish !== undefined) {
        var _x13 = publication_publish;
      }
      else {
        var _x13 = _this.publication_publish;
      }
      if (publication_rollback !== undefined) {
        var _x14 = publication_rollback;
      }
      else {
        var _x14 = _this.publication_rollback;
      }
      return Work_publication(_x12, _x13, _x14);
    }
  }
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
   
  var target_1_10027 = target.value;
  var _x15 = target_1_10027.deque_front;
  var _x16 = target_1_10027.deque_back;
  return ((target).value = (Deque($std_core_types.Cons(value, _x15), _x16)));
}
 
export function work_group_fs_prepend(group, value) /* forall<a> (group : work-group<a>, value : a) -> () */  {
   
  var _x17 = group.group_queue;
  var target_1_10027 = _x17.value;
  var _x17 = group.group_queue;
  var _x18 = target_1_10027.deque_front;
  var _x19 = target_1_10027.deque_back;
  return ((_x17).value = (Deque($std_core_types.Cons(value, _x18), _x19)));
}
 
export function work_queue_fs_append(target, value) /* forall<a> (target : work-queue<a>, value : a) -> () */  {
   
  var target_1_10037 = target.value;
  var _x20 = target_1_10037.deque_front;
  var _x21 = target_1_10037.deque_back;
  return ((target).value = (Deque(_x20, $std_core_types.Cons(value, _x21))));
}
 
export function work_group_fs_append(group, value) /* forall<a> (group : work-group<a>, value : a) -> () */  {
   
  var _x22 = group.group_queue;
  var target_1_10037 = _x22.value;
  var _x22 = group.group_queue;
  var _x23 = target_1_10037.deque_front;
  var _x24 = target_1_10037.deque_back;
  return ((_x22).value = (Deque(_x23, $std_core_types.Cons(value, _x24))));
}
 
export function work_queue_fs_pop(target) /* forall<a> (target : work-queue<a>) -> maybe<a> */  {
  var _x25 = deque_fs_pop(target.value);
   
  ((target).value = (_x25.snd));
  return _x25.fst;
}
 
export function work_group_fs_pop(group) /* forall<a> (group : work-group<a>) -> maybe<a> */  {
  var _x27 = group.group_queue;
  var _x26 = deque_fs_pop(_x27.value);
   
  var _x28 = group.group_queue;
  ((_x28).value = (_x26.snd));
  return _x26.fst;
}
 
export function work_queue_fs_values(target) /* forall<a> (target : work-queue<a>) -> list<a> */  {
   
  var target_0_10142 = target.value;
   
  var _x28 = target_0_10142.deque_back;
  var ys_10016 = $std_core_list.reverse_acc($std_core_types.Nil, _x28);
  var _x28 = target_0_10142.deque_front;
  return $std_core_list.append(_x28, ys_10016);
}
 
export function work_group_fs_values(group) /* forall<a> (group : work-group<a>) -> list<a> */  {
   
  var _x29 = group.group_queue;
  var target_10143 = _x29.value;
   
  var _x30 = target_10143.deque_back;
  var ys_10016 = $std_core_list.reverse_acc($std_core_types.Nil, _x30);
  var _x29 = target_10143.deque_front;
  return $std_core_list.append(_x29, ys_10016);
}
 
export function work_queue_fs_clear(target) /* forall<a> (target : work-queue<a>) -> () */  {
  return ((target).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
}
 
export function work_queue_fs_same(left, right) /* forall<a> (left : work-queue<a>, right : work-queue<a>) -> bool */  {
  return Object.is(left,right);
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
    var _x30 = group_state;
  }
  else {
    var _x30 = _this.group_state;
  }
  if (group_queue !== undefined) {
    var _x31 = group_queue;
  }
  else {
    var _x31 = _this.group_queue;
  }
  if (group_rollback !== undefined) {
    var _x32 = group_rollback;
  }
  else {
    var _x32 = _this.group_rollback;
  }
  return Work_group(_x30, _x31, _x32);
}
 
export function new_work_transaction_state() /* () -> ref<global,work-transaction-state> */  {
  return { value: Work_open };
}
 
export function new_work_group(state) /* forall<a> (state : ref<global,work-transaction-state>) -> work-group<a> */  {
  return Work_group(state, { value: (Deque($std_core_types.Nil, $std_core_types.Nil)) }, { value: (Deque($std_core_types.Nil, $std_core_types.Nil)) });
}
 
export function work_group_fs_state(group) /* forall<a> (group : work-group<a>) -> work-transaction-state */  {
  var _x33 = group.group_state;
  return _x33.value;
}
 
export function work_group_fs_same_transaction(left, right) /* forall<a,b> (left : work-group<a>, right : work-group<b>) -> bool */  {
  var _x34 = left.group_state;
  var _x35 = right.group_state;
  return Object.is(_x34,_x35);
}
 
 
// A bootstrap enters the runnable queue once but remains in the rollback
// ledger until the complete transaction commits or aborts. Drain-time requeues
// use `append`/`prepend` and therefore cannot duplicate transaction ownership.
export function work_group_fs_track(group, value) /* forall<a> (group : work-group<a>, value : a) -> () */  {
   
  var _x36 = group.group_rollback;
  var target_1_10037 = _x36.value;
   
  var _x37 = group.group_rollback;
  var _x38 = target_1_10037.deque_front;
  var _x39 = target_1_10037.deque_back;
  ((_x37).value = (Deque(_x38, $std_core_types.Cons(value, _x39))));
   
  var _x40 = group.group_queue;
  var target_1_10037_0 = _x40.value;
  var _x36 = group.group_queue;
  var _x37 = target_1_10037_0.deque_front;
  var _x38 = target_1_10037_0.deque_back;
  return ((_x36).value = (Deque(_x37, $std_core_types.Cons(value, _x38))));
}
 
export function work_group_fs_append_values(group, values) /* forall<a> (group : work-group<a>, values : list<a>) -> () */  {
  var _x39 = group.group_queue;
  return append_values_loop(_x39, values);
}
 
export function work_group_fs_clear(group) /* forall<a> (group : work-group<a>) -> () */  {
   
  var _x40 = group.group_queue;
  ((_x40).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
  var _x40 = group.group_rollback;
  return ((_x40).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
}
 
export function work_group_fs_take_all(group) /* forall<a> (group : work-group<a>) -> list<a> */  {
   
  var values = work_group_fs_values(group);
   
  var _x41 = group.group_queue;
  ((_x41).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
  return values;
}
 
export function work_group_fs_take_rollback(group) /* forall<a> (group : work-group<a>) -> list<a> */  {
   
  var _x41 = group.group_rollback;
  var target_10144 = _x41.value;
   
  var _x42 = target_10144.deque_back;
  var ys_10016 = $std_core_list.reverse_acc($std_core_types.Nil, _x42);
   
  var _x43 = target_10144.deque_front;
  var values = $std_core_list.append(_x43, ys_10016);
   
  var _x44 = group.group_rollback;
  ((_x44).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
  return values;
}
 
export function work_group_fs_release_rollback(group) /* forall<a> (group : work-group<a>) -> () */  {
  var _x41 = group.group_rollback;
  return ((_x41).value = (Deque($std_core_types.Nil, $std_core_types.Nil)));
}
 
export function work_group_fs_begin_drain(group) /* forall<a> (group : work-group<a>) -> bool */  {
  var _x42 = work_group_fs_state(group);
  if (_x42._tag === 1) {
     
    var _x43 = group.group_state;
    ((_x43).value = Work_draining);
    return true;
  }
  else {
    return false;
  }
}
 
export function work_group_fs_mark_ready(group) /* forall<a> (group : work-group<a>) -> bool */  {
  var _x43 = work_group_fs_state(group);
  if (_x43._tag === 2) {
     
    var _x44 = group.group_state;
    ((_x44).value = Work_ready);
    return true;
  }
  else {
    return false;
  }
}
 
export function work_group_fs_mark_failed(group, failure) /* forall<a> (group : work-group<a>, failure : exception) -> bool */  {
  var _x44 = work_group_fs_state(group);
  if (_x44._tag === 1) {
     
    var _x45 = group.group_state;
    ((_x45).value = (Work_failed(failure)));
    return true;
  }
  else if (_x44._tag === 2) {
     
    var _x45 = group.group_state;
    ((_x45).value = (Work_failed(failure)));
    return true;
  }
  else {
    return false;
  }
}
 
export function work_group_fs_mark_committed(group) /* forall<a> (group : work-group<a>) -> bool */  {
  var _x45 = work_group_fs_state(group);
  if (_x45._tag === 3) {
     
    var _x46 = group.group_state;
    ((_x46).value = Work_committed);
    return true;
  }
  else {
    return false;
  }
}
 
export function work_group_fs_mark_aborted(group) /* forall<a> (group : work-group<a>) -> bool */  {
  var _x46 = work_group_fs_state(group);
  if (_x46._tag === 5) {
    return false;
  }
  else if (_x46._tag === 6) {
    return false;
  }
  else {
     
    var _x47 = group.group_state;
    ((_x47).value = Work_aborted);
     
    work_group_fs_clear(group);
    return true;
  }
}
 
export function route_resume(global, value) /* forall<a> (global : work-queue<a>, value : a) -> () */  {
  return work_queue_fs_prepend(global, value);
}
 
export function route_bootstrap(global, active, value) /* forall<a> (global : work-queue<a>, active : maybe<work-group<a>>, value : a) -> () */  {
  if (active !== null) {
    var _x47 = work_group_fs_state(active.value);
    if (_x47._tag === 1) {
       
      var _x48 = active.value.group_rollback;
      var target_1_10037 = _x48.value;
       
      var _x49 = active.value.group_rollback;
      var _x50 = target_1_10037.deque_front;
      var _x51 = target_1_10037.deque_back;
      ((_x49).value = (Deque(_x50, $std_core_types.Cons(value, _x51))));
       
      var _x52 = active.value.group_queue;
      var target_1_10037_0 = _x52.value;
      var _x48 = active.value.group_queue;
      var _x49 = target_1_10037_0.deque_front;
      var _x50 = target_1_10037_0.deque_back;
      return ((_x48).value = (Deque(_x49, $std_core_types.Cons(value, _x50))));
    }
    else if (_x47._tag === 2) {
       
      var _x51 = active.value.group_rollback;
      var target_1_10037_1 = _x51.value;
       
      var _x52 = active.value.group_rollback;
      var _x53 = target_1_10037_1.deque_front;
      var _x54 = target_1_10037_1.deque_back;
      ((_x52).value = (Deque(_x53, $std_core_types.Cons(value, _x54))));
       
      var _x55 = active.value.group_queue;
      var target_1_10037_2 = _x55.value;
      var _x51 = active.value.group_queue;
      var _x52 = target_1_10037_2.deque_front;
      var _x53 = target_1_10037_2.deque_back;
      return ((_x51).value = (Deque(_x52, $std_core_types.Cons(value, _x53))));
    }
    else {
      return work_queue_fs_append(global, value);
    }
  }
  else {
    return work_queue_fs_append(global, value);
  }
}