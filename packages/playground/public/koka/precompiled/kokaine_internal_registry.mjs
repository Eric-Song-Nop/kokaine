// Koka generated module: kokaine/internal/registry, koka version: 3.2.4
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
// type registry-link
export const Registry_end = null; // forall<a> registry-link<a>
export function Registry_link(link_value, link_back, link_next) /* forall<a> (link-value : ref<global,maybe<a>>, link-back : ref<global,ref<global,registry-link<a>>>, link-next : ref<global,registry-link<a>>) -> registry-link<a> */  {
  return { link_value: link_value, link_back: link_back, link_next: link_next };
}
// type registry
export function Registry(registry_is_sealed, registry_head, registry_count) /* forall<a> (registry-is-sealed : ref<global,bool>, registry-head : ref<global,registry-link<a>>, registry-count : ref<global,int>) -> registry<a> */  {
  return { registry_is_sealed: registry_is_sealed, registry_head: registry_head, registry_count: registry_count };
}
// type registry-registration
export function Registry_registration(registration_value, registration_back, registration_next, registration_count) /* forall<a> (registration-value : ref<global,maybe<a>>, registration-back : ref<global,ref<global,registry-link<a>>>, registration-next : ref<global,registry-link<a>>, registration-count : ref<global,int>) -> registry-registration<a> */  {
  return { registration_value: registration_value, registration_back: registration_back, registration_next: registration_next, registration_count: registration_count };
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
 
 
// Automatically generated. Tests for the `Registry-end` constructor of the `:registry-link` type.
export function is_registry_end(registry_link) /* forall<a> (registry-link : registry-link<a>) -> bool */  {
  return (registry_link === null);
}
 
 
// Automatically generated. Tests for the `Registry-link` constructor of the `:registry-link` type.
export function is_registry_link(registry_link) /* forall<a> (registry-link : registry-link<a>) -> bool */  {
  return (registry_link !== null);
}
 
 
// Automatically generated. Retrieves the `registry-is-sealed` constructor field of the `:registry` type.
export function registry_fs_registry_is_sealed(registry) /* forall<a> (registry : registry<a>) -> ref<global,bool> */  {
  return registry.registry_is_sealed;
}
 
 
// Automatically generated. Retrieves the `registry-head` constructor field of the `:registry` type.
export function registry_fs_registry_head(registry) /* forall<a> (registry : registry<a>) -> ref<global,registry-link<a>> */  {
  return registry.registry_head;
}
 
 
// Automatically generated. Retrieves the `registry-count` constructor field of the `:registry` type.
export function registry_fs_registry_count(registry) /* forall<a> (registry : registry<a>) -> ref<global,int> */  {
  return registry.registry_count;
}
 
export function registry_fs__copy(_this, registry_is_sealed, registry_head, registry_count) /* forall<a> (registry<a>, registry-is-sealed : ? (ref<global,bool>), registry-head : ? (ref<global,registry-link<a>>), registry-count : ? (ref<global,int>)) -> registry<a> */  {
  if (registry_is_sealed !== undefined) {
    var _x0 = registry_is_sealed;
  }
  else {
    var _x0 = _this.registry_is_sealed;
  }
  if (registry_head !== undefined) {
    var _x1 = registry_head;
  }
  else {
    var _x1 = _this.registry_head;
  }
  if (registry_count !== undefined) {
    var _x2 = registry_count;
  }
  else {
    var _x2 = _this.registry_count;
  }
  return Registry(_x0, _x1, _x2);
}
 
 
// Automatically generated. Retrieves the `registration-value` constructor field of the `:registry-registration` type.
export function registry_registration_fs_registration_value(_this) /* forall<a> (registry-registration<a>) -> ref<global,maybe<a>> */  {
  return _this.registration_value;
}
 
 
// Automatically generated. Retrieves the `registration-back` constructor field of the `:registry-registration` type.
export function registry_registration_fs_registration_back(_this) /* forall<a> (registry-registration<a>) -> ref<global,ref<global,registry-link<a>>> */  {
  return _this.registration_back;
}
 
 
// Automatically generated. Retrieves the `registration-next` constructor field of the `:registry-registration` type.
export function registry_registration_fs_registration_next(_this) /* forall<a> (registry-registration<a>) -> ref<global,registry-link<a>> */  {
  return _this.registration_next;
}
 
 
// Automatically generated. Retrieves the `registration-count` constructor field of the `:registry-registration` type.
export function registry_registration_fs_registration_count(_this) /* forall<a> (registry-registration<a>) -> ref<global,int> */  {
  return _this.registration_count;
}
 
export function registry_registration_fs__copy(_this, registration_value, registration_back, registration_next, registration_count) /* forall<a> (registry-registration<a>, registration-value : ? (ref<global,maybe<a>>), registration-back : ? (ref<global,ref<global,registry-link<a>>>), registration-next : ? (ref<global,registry-link<a>>), registration-count : ? (ref<global,int>)) -> registry-registration<a> */  {
  if (registration_value !== undefined) {
    var _x3 = registration_value;
  }
  else {
    var _x3 = _this.registration_value;
  }
  if (registration_back !== undefined) {
    var _x4 = registration_back;
  }
  else {
    var _x4 = _this.registration_back;
  }
  if (registration_next !== undefined) {
    var _x5 = registration_next;
  }
  else {
    var _x5 = _this.registration_next;
  }
  if (registration_count !== undefined) {
    var _x6 = registration_count;
  }
  else {
    var _x6 = _this.registration_count;
  }
  return Registry_registration(_x3, _x4, _x5, _x6);
}
 
export function registry_link_fs_set_back(value, pointer) /* forall<a> (value : registry-link<a>, pointer : ref<global,registry-link<a>>) -> () */  {
  if (value === null) {
    return $std_core_types.Unit;
  }
  else {
    return (((value.link_back)).value = pointer);
  }
}
 
export function new_registry() /* forall<a> () -> registry<a> */  {
  return Registry({ value: false }, { value: Registry_end }, { value: 0 });
}
 
export function registry_fs_sealed(target) /* forall<a> (target : registry<a>) -> bool */  {
  return (target.registry_is_sealed).value;
}
 
export function registry_fs_count(target) /* forall<a> (target : registry<a>) -> int */  {
  return (target.registry_count).value;
}
 
 
// Internal observability for lifetime ownership tests. Unlike `count` or
// `snapshot`, this detects an empty tombstone still retained by the registry.
export function registry_fs_has_linked_nodes(target) /* forall<a> (target : registry<a>) -> bool */  {
  var _x7 = (target.registry_head).value;
  return (_x7 === null) ? false : true;
}
 
 
// monadic lift
export function registry_fs__mlift_try_insert_10136(count, head, next, slot, _c_x10119) /* forall<_e,_e1,_e2,a> (count : ref<global,int>, head : ref<global,registry-link<a>>, next : ref<global,registry-link<a>>, slot : ref<global,maybe<a>>, ()) -> maybe<registry-registration<a>> */  {
   
  var back_0 = { value: head };
   
  ((head).value = (Registry_link(slot, back_0, next)));
   
  var x_10039 = count.value;
   
  var value_7_10038 = $std_core_types._int_add(x_10039,1);
   
  ((count).value = value_7_10038);
  return $std_core_types.Just(Registry_registration(slot, back_0, next, count));
}
 
export function registry_fs_try_insert(target, value) /* forall<a> (target : registry<a>, value : a) -> maybe<registry-registration<a>> */  {
  var _x8 = (target.registry_is_sealed).value;
  if (_x8) {
    return $std_core_types.Nothing;
  }
  else {
     
    var slot = { value: ($std_core_types.Just(value)) };
     
    var value_2_10026 = (target.registry_head).value;
     
    var next = { value: value_2_10026 };
     
    var value_4_10030 = next.value;
     
    if (value_4_10030 === null) {
      var x_10138 = $std_core_types.Unit;
    }
    else {
      var x_10138 = (((value_4_10030.link_back)).value = next);
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10119 /* () */ ) {
        return registry_fs__mlift_try_insert_10136(target.registry_count, target.registry_head, next, slot, _c_x10119);
      });
    }
    else {
       
      var back_0 = { value: (target.registry_head) };
       
      (((target.registry_head)).value = (Registry_link(slot, back_0, next)));
       
      var x_10039 = (target.registry_count).value;
       
      var value_7_10038 = $std_core_types._int_add(x_10039,1);
       
      (((target.registry_count)).value = value_7_10038);
      return $std_core_types.Just(Registry_registration(slot, back_0, next, target.registry_count));
    }
  }
}
 
export function registry_fs_insert(target, value) /* forall<a> (target : registry<a>, value : a) -> exn registry-registration<a> */  {
  var _x9 = $std_core_hnd._open_none2(registry_fs_try_insert, target, value);
  if (_x9 === null) {
    return $std_core_exn.$throw("cannot register with a sealed lifetime registry");
  }
  else {
    return _x9.value;
  }
}
 
 
// monadic lift
export function registry_registration_fs__mlift_take_10137(back, count, current, next, _c_x10124) /* forall<_e,_e1,a> (back : ref<global,ref<global,registry-link<a>>>, count : ref<global,int>, current : a, next : ref<global,registry-link<a>>, ()) -> maybe<a> */  {
   
  var x_10059 = count.value;
   
  var j_10058 = $std_core_types._int_sub(x_10059,1);
   
  var value_5_10056 = ($std_core_types._int_ge(0,j_10058)) ? 0 : j_10058;
   
  ((count).value = value_5_10056);
   
  ((back).value = next);
   
  ((next).value = Registry_end);
  return $std_core_types.Just(current);
}
 
export function registry_registration_fs_take(registration) /* forall<a> (registration : registry-registration<a>) -> maybe<a> */  {
   
  var value_0 = (registration.registration_value).value;
   
  (((registration.registration_value)).value = ($std_core_types.Nothing));
  if (value_0 === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    var predecessor = (registration.registration_back).value;
     
    var successor = (registration.registration_next).value;
     
    ((predecessor).value = successor);
     
    if (successor === null) {
      var x_10141 = $std_core_types.Unit;
    }
    else {
      var x_10141 = (((successor.link_back)).value = predecessor);
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10124 /* () */ ) {
        return registry_registration_fs__mlift_take_10137(registration.registration_back, registration.registration_count, value_0.value, registration.registration_next, _c_x10124);
      });
    }
    else {
       
      var x_10059 = (registration.registration_count).value;
       
      var j_10058 = $std_core_types._int_sub(x_10059,1);
       
      var value_5_10056 = ($std_core_types._int_ge(0,j_10058)) ? 0 : j_10058;
       
      (((registration.registration_count)).value = value_5_10056);
       
      (((registration.registration_back)).value = (registration.registration_next));
       
      (((registration.registration_next)).value = Registry_end);
      return $std_core_types.Just(value_0.value);
    }
  }
}
 
export function snapshot_loop(values, collected) /* forall<a> (values : registry-link<a>, collected : list<a>) -> div list<a> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected);
  }
  else {
    var _x10 = (values.link_value).value;
    if (_x10 === null) {
      {
        // tail call
        var _x11 = (values.link_next).value;
        values = _x11;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        var _x12 = (values.link_next).value;
        var _x13 = $std_core_types.Cons(_x10.value, collected);
        values = _x12;
        collected = _x13;
        continue tailcall;
      }
    }
  }
}}
 
export function registry_fs_snapshot(target) /* forall<a> (target : registry<a>) -> list<a> */  {
  return snapshot_loop((target.registry_head).value, $std_core_types.Nil);
}
 
export function detach_loop(values, collected) /* forall<a> (values : registry-link<a>, collected : list<a>) -> div list<a> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected);
  }
  else {
     
    var rest = (values.link_next).value;
     
    var value_1 = (values.link_value).value;
     
    (((values.link_value)).value = ($std_core_types.Nothing));
     
    (((values.link_back)).value = (values.link_next));
     
    (((values.link_next)).value = Registry_end);
    if (value_1 === null) {
      {
        // tail call
        values = rest;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        var _x14 = $std_core_types.Cons(value_1.value, collected);
        values = rest;
        collected = _x14;
        continue tailcall;
      }
    }
  }
}}
 
export function registry_fs_seal_detach(target) /* forall<a> (target : registry<a>) -> maybe<list<a>> */  {
  var _x15 = (target.registry_is_sealed).value;
  if (_x15) {
    return $std_core_types.Nothing;
  }
  else {
     
    (((target.registry_is_sealed)).value = true);
     
    var values = (target.registry_head).value;
     
    (((target.registry_head)).value = Registry_end);
     
    (((target.registry_count)).value = 0);
    return $std_core_types.Just(detach_loop(values, $std_core_types.Nil));
  }
}