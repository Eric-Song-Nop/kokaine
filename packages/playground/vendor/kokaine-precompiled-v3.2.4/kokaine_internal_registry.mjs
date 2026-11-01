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
    return store(value.link_back, pointer);
  }
}
 
export function new_registry() /* forall<a> () -> registry<a> */  {
  return Registry(cell(false), cell(Registry_end), cell(0));
}
 
export function registry_fs_sealed(target) /* forall<a> (target : registry<a>) -> bool */  {
  return load(target.registry_is_sealed);
}
 
export function registry_fs_count(target) /* forall<a> (target : registry<a>) -> int */  {
  return load(target.registry_count);
}
 
 
// Internal observability for lifetime ownership tests. Unlike `count` or
// `snapshot`, this detects an empty tombstone still retained by the registry.
export function registry_fs_has_linked_nodes(target) /* forall<a> (target : registry<a>) -> bool */  {
  var _x7 = load(target.registry_head);
  return (_x7 === null) ? false : true;
}
 
export function registry_fs_try_insert(target, value) /* forall<a> (target : registry<a>, value : a) -> maybe<registry-registration<a>> */  {
  var _x8 = load(target.registry_is_sealed);
  if (_x8) {
    return $std_core_types.Nothing;
  }
  else {
     
    var slot = cell($std_core_types.Just(value));
     
    var next = cell(load(target.registry_head));
     
    var value_0_10010 = load(next);
     
    if (value_0_10010 === null) {
      $std_core_types.Unit;
    }
    else {
      store(value_0_10010.link_back, next);
    }
     
    var back_0 = cell(target.registry_head);
     
    store(target.registry_head, Registry_link(slot, back_0, next));
     
    var x_10012 = load(target.registry_count);
     
    store(target.registry_count, $std_core_types._int_add(x_10012,1));
    return $std_core_types.Just(Registry_registration(slot, back_0, next, target.registry_count));
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
 
export function registry_registration_fs_take(registration) /* forall<a> (registration : registry-registration<a>) -> maybe<a> */  {
   
  var value = load(registration.registration_value);
   
  store(registration.registration_value, $std_core_types.Nothing);
  if (value === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    var predecessor = load(registration.registration_back);
     
    var successor = load(registration.registration_next);
     
    store(predecessor, successor);
     
    if (successor === null) {
      $std_core_types.Unit;
    }
    else {
      store(successor.link_back, predecessor);
    }
     
    var x_10018 = load(registration.registration_count);
     
    var j_10017 = $std_core_types._int_sub(x_10018,1);
     
    var _x10 = ($std_core_types._int_ge(0,j_10017)) ? 0 : j_10017;
    store(registration.registration_count, _x10);
     
    store(registration.registration_back, registration.registration_next);
     
    store(registration.registration_next, Registry_end);
    return $std_core_types.Just(value.value);
  }
}
 
export function snapshot_loop(values, collected) /* forall<a> (values : registry-link<a>, collected : list<a>) -> div list<a> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected);
  }
  else {
    var _x10 = load(values.link_value);
    if (_x10 === null) {
      {
        // tail call
        var _x11 = load(values.link_next);
        values = _x11;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        var _x12 = load(values.link_next);
        var _x13 = $std_core_types.Cons(_x10.value, collected);
        values = _x12;
        collected = _x13;
        continue tailcall;
      }
    }
  }
}}
 
export function registry_fs_snapshot(target) /* forall<a> (target : registry<a>) -> list<a> */  {
  return snapshot_loop(load(target.registry_head), $std_core_types.Nil);
}
 
 
// Allocation-free lookup for total predicates which neither enter user code
// nor mutate this registry.
export function find_readonly_loop(values, predicate) /* forall<a> (values : registry-link<a>, predicate : (a) -> bool) -> div maybe<a> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Nothing;
  }
  else {
    var _x14 = load(values.link_value);
    if (_x14 === null) {
      {
        // tail call
        var _x15 = load(values.link_next);
        values = _x15;
        continue tailcall;
      }
    }
    else {
      var _x16 = predicate(_x14.value);
      if (_x16) {
        return $std_core_types.Just(_x14.value);
      }
      else {
        {
          // tail call
          var _x17 = load(values.link_next);
          values = _x17;
          continue tailcall;
        }
      }
    }
  }
}}
 
export function registry_fs_find_readonly(target, predicate) /* forall<a> (target : registry<a>, predicate : (a) -> bool) -> maybe<a> */  {
  return find_readonly_loop(load(target.registry_head), predicate);
}
 
 
// Allocation-free traversal for internal callbacks which neither enter user
// code nor mutate this registry. Read the successor before invoking the
// callback so traversal never depends on the current node afterward. This
// deliberately has a narrower contract than `snapshot`.
export function visit_readonly_loop(values, action) /* forall<a> (values : registry-link<a>, action : (a) -> ()) -> div () */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var rest = load(values.link_next);
    var _x18 = load(values.link_value);
    if (_x18 === null) {
      {
        // tail call
        values = rest;
        continue tailcall;
      }
    }
    else {
       
      action(_x18.value);
      {
        // tail call
        values = rest;
        continue tailcall;
      }
    }
  }
}}
 
export function registry_fs_visit_readonly(target, action) /* forall<a> (target : registry<a>, action : (a) -> ()) -> () */  {
  return visit_readonly_loop(load(target.registry_head), action);
}
 
export function detach_loop(values, collected) /* forall<a> (values : registry-link<a>, collected : list<a>) -> div list<a> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected);
  }
  else {
     
    var rest = load(values.link_next);
     
    var value = load(values.link_value);
     
    store(values.link_value, $std_core_types.Nothing);
     
    store(values.link_back, values.link_next);
     
    store(values.link_next, Registry_end);
    if (value === null) {
      {
        // tail call
        values = rest;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        var _x19 = $std_core_types.Cons(value.value, collected);
        values = rest;
        collected = _x19;
        continue tailcall;
      }
    }
  }
}}
 
export function registry_fs_seal_detach(target) /* forall<a> (target : registry<a>) -> maybe<list<a>> */  {
  var _x20 = load(target.registry_is_sealed);
  if (_x20) {
    return $std_core_types.Nothing;
  }
  else {
     
    store(target.registry_is_sealed, true);
     
    var values = load(target.registry_head);
     
    store(target.registry_head, Registry_end);
     
    store(target.registry_count, 0);
    return $std_core_types.Just(detach_loop(values, $std_core_types.Nil));
  }
}