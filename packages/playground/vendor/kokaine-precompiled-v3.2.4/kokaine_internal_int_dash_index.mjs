// Koka generated module: kokaine/internal/int-index, koka version: 3.2.4
"use strict";
 
// imports
import * as $std_core_types from './std_core_types.mjs';
import * as $std_core_hnd from './std_core_hnd.mjs';
import * as $std_core_exn from './std_core_exn.mjs';
import * as $std_core_bool from './std_core_bool.mjs';
import * as $std_core_order from './std_core_order.mjs';
import * as $std_core_char from './std_core_char.mjs';
import * as $std_core_int from './std_core_int.mjs';
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
import * as $std_core_vector from './std_core_vector.mjs';
 
// externals
 
// type declarations
// type int-index-link
export const Int_index_end = null; // forall<a> int-index-link<a>
export function Int_index_link(link_key, link_value, link_back, link_next) /* forall<a> (link-key : int, link-value : ref<global,maybe<a>>, link-back : ref<global,ref<global,int-index-link<a>>>, link-next : ref<global,int-index-link<a>>) -> int-index-link<a> */  {
  return { link_key: link_key, link_value: link_value, link_back: link_back, link_next: link_next };
}
// type int-index
export function Int_index(index_buckets, index_count) /* forall<a> (index-buckets : ref<global,vector<ref<global,int-index-link<a>>>>, index-count : ref<global,int>) -> int-index<a> */  {
  return { index_buckets: index_buckets, index_count: index_count };
}
// type int-index-registration
export function Int_index_registration(registration_value, registration_back, registration_next, registration_owner) /* forall<a> (registration-value : ref<global,maybe<a>>, registration-back : ref<global,ref<global,int-index-link<a>>>, registration-next : ref<global,int-index-link<a>>, registration-owner : ref<global,maybe<int-index<a>>>) -> int-index-registration<a> */  {
  return { registration_value: registration_value, registration_back: registration_back, registration_next: registration_next, registration_owner: registration_owner };
}
 
// declarations
 
export var minimum_capacity;
var minimum_capacity = 16;
 
export function cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
 
// Automatically generated. Tests for the `Int-index-end` constructor of the `:int-index-link` type.
export function is_int_index_end(int_index_link) /* forall<a> (int-index-link : int-index-link<a>) -> bool */  {
  return (int_index_link === null);
}
 
 
// Automatically generated. Tests for the `Int-index-link` constructor of the `:int-index-link` type.
export function is_int_index_link(int_index_link) /* forall<a> (int-index-link : int-index-link<a>) -> bool */  {
  return (int_index_link !== null);
}
 
 
// Automatically generated. Retrieves the `index-buckets` constructor field of the `:int-index` type.
export function int_index_fs_index_buckets(_this) /* forall<a> (int-index<a>) -> ref<global,vector<ref<global,int-index-link<a>>>> */  {
  return _this.index_buckets;
}
 
 
// Automatically generated. Retrieves the `index-count` constructor field of the `:int-index` type.
export function int_index_fs_index_count(_this) /* forall<a> (int-index<a>) -> ref<global,int> */  {
  return _this.index_count;
}
 
export function int_index_fs__copy(_this, index_buckets, index_count) /* forall<a> (int-index<a>, index-buckets : ? (ref<global,vector<ref<global,int-index-link<a>>>>), index-count : ? (ref<global,int>)) -> int-index<a> */  {
  if (index_buckets !== undefined) {
    var _x0 = index_buckets;
  }
  else {
    var _x0 = _this.index_buckets;
  }
  if (index_count !== undefined) {
    var _x1 = index_count;
  }
  else {
    var _x1 = _this.index_count;
  }
  return Int_index(_x0, _x1);
}
 
 
// Automatically generated. Retrieves the `registration-value` constructor field of the `:int-index-registration` type.
export function int_index_registration_fs_registration_value(_this) /* forall<a> (int-index-registration<a>) -> ref<global,maybe<a>> */  {
  return _this.registration_value;
}
 
 
// Automatically generated. Retrieves the `registration-back` constructor field of the `:int-index-registration` type.
export function int_index_registration_fs_registration_back(_this) /* forall<a> (int-index-registration<a>) -> ref<global,ref<global,int-index-link<a>>> */  {
  return _this.registration_back;
}
 
 
// Automatically generated. Retrieves the `registration-next` constructor field of the `:int-index-registration` type.
export function int_index_registration_fs_registration_next(_this) /* forall<a> (int-index-registration<a>) -> ref<global,int-index-link<a>> */  {
  return _this.registration_next;
}
 
 
// Automatically generated. Retrieves the `registration-owner` constructor field of the `:int-index-registration` type.
export function int_index_registration_fs_registration_owner(_this) /* forall<a> (int-index-registration<a>) -> ref<global,maybe<int-index<a>>> */  {
  return _this.registration_owner;
}
 
export function int_index_registration_fs__copy(_this, registration_value, registration_back, registration_next, registration_owner) /* forall<a> (int-index-registration<a>, registration-value : ? (ref<global,maybe<a>>), registration-back : ? (ref<global,ref<global,int-index-link<a>>>), registration-next : ? (ref<global,int-index-link<a>>), registration-owner : ? (ref<global,maybe<int-index<a>>>)) -> int-index-registration<a> */  {
  if (registration_value !== undefined) {
    var _x2 = registration_value;
  }
  else {
    var _x2 = _this.registration_value;
  }
  if (registration_back !== undefined) {
    var _x3 = registration_back;
  }
  else {
    var _x3 = _this.registration_back;
  }
  if (registration_next !== undefined) {
    var _x4 = registration_next;
  }
  else {
    var _x4 = _this.registration_next;
  }
  if (registration_owner !== undefined) {
    var _x5 = registration_owner;
  }
  else {
    var _x5 = _this.registration_owner;
  }
  return Int_index_registration(_x2, _x3, _x4, _x5);
}
 
export function new_buckets(capacity) /* forall<a> (capacity : int) -> vector<ref<global,int-index-link<a>>> */  {
   
  var n_10009 = ($std_core_types._int_ge(16,capacity)) ? 16 : capacity;
  return $std_core_vector.vector_alloc_total($std_core_int.ssize__t(n_10009), function(i /* ssize_t */ ) {
       
      $std_core_types._int_from_int32(i);
      return cell(Int_index_end);
    });
}
 
 
// The bucket table is allocated by the first insert: an async family creates
// one index per `run-async`, and most families never register a task.
export function new_int_index() /* forall<a> () -> int-index<a> */  {
  return Int_index(cell($std_core_vector.vector_alloc_total(0, function(i /* ssize_t */ ) {
         
        $std_core_types._int_from_int32(i);
        return cell(Int_index_end);
      })), cell(0));
}
 
export function int_index_fs_count(target) /* forall<a> (target : int-index<a>) -> int */  {
  return load(target.index_count);
}
 
export function int_index_fs_capacity(target) /* forall<a> (target : int-index<a>) -> int */  {
   
  var v_10015 = load(target.index_buckets);
  return $std_core_types._int_from_int32((((v_10015).length)));
}
 
export function normalized_key(key) /* (key : int) -> int */  {
  if ($std_core_types._int_ge(key,0)) {
    return key;
  }
  else {
     
    var y_10017 = $std_core_types._int_add(key,1);
    return $std_core_types._int_sub(0,y_10017);
  }
}
 
export function bucket_offset(key, capacity) /* (key : int, capacity : int) -> int */  {
  if ($std_core_types._int_ge(key,0)) {
    var _x6 = key;
  }
  else {
     
    var y_10017 = $std_core_types._int_add(key,1);
    var _x6 = $std_core_types._int_sub(0,y_10017);
  }
  return $std_core_types._int_mod(_x6,capacity);
}
 
export function bucket_at(buckets, key) /* forall<a> (buckets : vector<ref<global,int-index-link<a>>>, key : int) -> ref<global,int-index-link<a>> */  {
   
  var capacity_10022 = $std_core_types._int_from_int32((((buckets).length)));
  if ($std_core_types._int_ge(key,0)) {
    var _x8 = key;
  }
  else {
     
    var y_10017 = $std_core_types._int_add(key,1);
    var _x8 = $std_core_types._int_sub(0,y_10017);
  }
  var _x7 = $std_core_vector.at(buckets, $std_core_types._int_mod(_x8,capacity_10022));
  if (_x7 !== null) {
    return _x7.value;
  }
  else {
    return cell(Int_index_end);
  }
}
 
export function int_index_link_fs_set_back(value, pointer) /* forall<a> (value : int-index-link<a>, pointer : ref<global,int-index-link<a>>) -> () */  {
  if (value === null) {
    return $std_core_types.Unit;
  }
  else {
    return store(value.link_back, pointer);
  }
}
 
export function lookup_link(value, key) /* forall<a> (value : int-index-link<a>, key : int) -> div maybe<a> */  { tailcall: while(1)
{
  if (value === null) {
    return $std_core_types.Nothing;
  }
  else {
    if ($std_core_types._int_eq((value.link_key),key)) {
      return load(value.link_value);
    }
    else {
      {
        // tail call
        var _x9 = load(value.link_next);
        value = _x9;
        continue tailcall;
      }
    }
  }
}}
 
export function int_index_fs_lookup(target, key) /* forall<a> (target : int-index<a>, key : int) -> maybe<a> */  {
   
  var buckets = load(target.index_buckets);
  var _x10 = $std_core_types._int_eq(($std_core_types._int_from_int32((((buckets).length)))),0);
  if (_x10) {
    return $std_core_types.Nothing;
  }
  else {
    return lookup_link(load(bucket_at(buckets, key)), key);
  }
}
 
export function move_links(value, buckets) /* forall<a> (value : int-index-link<a>, buckets : vector<ref<global,int-index-link<a>>>) -> () */  {
  return function() {
     
    var loc = { value: value };
     
    var loc_0 = { value: true };
     
    var res_0 = $std_core.$while(function() {
        return ((loc_0).value);
      }, function() {
        var _x11 = ((loc).value);
        if (_x11 === null) {
          return ((loc_0).value = false);
        }
        else {
           
          var rest = load(_x11.link_next);
           
          var bucket = bucket_at(buckets, _x11.link_key);
           
          var successor = load(bucket);
           
          store(_x11.link_next, successor);
           
          if (successor === null) {
            $std_core_types.Unit;
          }
          else {
            store(successor.link_back, _x11.link_next);
          }
           
          store(_x11.link_back, bucket);
           
          store(bucket, _x11);
          return ((loc).value = rest);
        }
      });
     
    var res = $std_core_hnd.prompt_local_var(loc_0, res_0);
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
export function int_index_fs_resize(target, requested) /* forall<a> (target : int-index<a>, requested : int) -> () */  {
   
  var old_buckets = load(target.index_buckets);
   
  var next_buckets = new_buckets(requested);
  var _x11 = function() {
     
    var loc = { value: 0 };
     
    var res = $std_core.$while(function() {
        return $std_core_types._int_lt((((loc).value)),($std_core_types._int_from_int32((((old_buckets).length)))));
      }, function() {
         
        var _x12 = $std_core_vector.at(old_buckets, ((loc).value));
        if (_x12 === null) {
          $std_core_types.Unit;
        }
        else {
           
          var values = load(_x12.value);
           
          store(_x12.value, Int_index_end);
          move_links(values, next_buckets);
        }
         
        var x_10034 = ((loc).value);
        return ((loc).value = ($std_core_types._int_add(x_10034,1)));
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
  return store(target.index_buckets, next_buckets);
}
 
export function int_index_fs_ensure_insert_capacity(target) /* forall<a> (target : int-index<a>) -> () */  {
   
   
  var v_10037 = load(target.index_buckets);
  var capacity = $std_core_types._int_from_int32((((v_10037).length)));
  if ($std_core_types._int_lt(capacity,16)) {
    return int_index_fs_resize(target, 16);
  }
  else {
     
    var x_10038 = load(target.index_count);
    var _x12 = $std_core_types._int_gt(($std_core_types._int_mul(($std_core_types._int_add(x_10038,1)),4)),($std_core_types._int_mul(capacity,3)));
    if (_x12) {
      return int_index_fs_resize(target, $std_core_types._int_mul(capacity,2));
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
export function int_index_fs_reclaim_delete_capacity(target) /* forall<a> (target : int-index<a>) -> () */  {
   
   
  var v_10042 = load(target.index_buckets);
  var capacity = $std_core_types._int_from_int32((((v_10042).length)));
  if ($std_core_types._int_gt(capacity,16)) {
    var _x14 = load(target.index_count);
    var _x13 = $std_core_types._int_le(($std_core_types._int_mul(_x14,4)),capacity);
    if (_x13) {
       
      var j_10045 = $std_core_types._int_div(capacity,2);
      var _x15 = ($std_core_types._int_ge(16,j_10045)) ? 16 : j_10045;
      return int_index_fs_resize(target, _x15);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function int_index_fs_insert(target, key, value) /* forall<a> (target : int-index<a>, key : int, value : a) -> exn int-index-registration<a> */  {
  var _x16 = $std_core_hnd._open_none2(int_index_fs_lookup, target, key);
  if (_x16 !== null) {
    return $std_core_exn.$throw("cannot register a duplicate integer index key");
  }
  else {
     
    $std_core_hnd._open_none1(int_index_fs_ensure_insert_capacity, target);
     
    var buckets = $std_core_hnd._open_none1(load, target.index_buckets);
     
    var bucket = $std_core_hnd._open_none2(bucket_at, buckets, key);
     
    var slot = $std_core_hnd._open_none1(cell, $std_core_types.Just(value));
     
    var _x_x1_4_10083 = $std_core_hnd._open_none1(load, bucket);
     
    var next = $std_core_hnd._open_none1(cell, _x_x1_4_10083);
     
    var _x_x1_6_10085 = $std_core_hnd._open_none1(load, next);
     
    $std_core_hnd._open_none2(function(value_0 /* int-index-link<2189> */ , pointer /* ref<global,int-index-link<2189>> */ ) {
        if (value_0 === null) {
          return $std_core_types.Unit;
        }
        else {
          return store(value_0.link_back, pointer);
        }
      }, _x_x1_6_10085, next);
     
    var back_0 = $std_core_hnd._open_none1(cell, bucket);
     
    $std_core_hnd._open_none2(store, bucket, Int_index_link(key, slot, back_0, next));
     
    var x_10072 = $std_core_hnd._open_none1(load, target.index_count);
     
    var _x_x2_3_10093 = $std_core_types._int_add(x_10072,1);
     
    $std_core_hnd._open_none2(store, target.index_count, _x_x2_3_10093);
    return Int_index_registration(slot, back_0, next, $std_core_hnd._open_none1(cell, $std_core_types.Just(target)));
  }
}
 
export function int_index_registration_fs_take(registration) /* forall<a> (registration : int-index-registration<a>) -> maybe<a> */  {
   
  var value = load(registration.registration_value);
   
  store(registration.registration_value, $std_core_types.Nothing);
   
  var owner = load(registration.registration_owner);
   
  store(registration.registration_owner, $std_core_types.Nothing);
  if (value !== null && owner !== null) {
     
    var predecessor = load(registration.registration_back);
     
    var successor = load(registration.registration_next);
     
    store(predecessor, successor);
     
    if (successor === null) {
      $std_core_types.Unit;
    }
    else {
      store(successor.link_back, predecessor);
    }
     
     
    var x_10051 = load(owner.value.index_count);
     
    var j_10050 = $std_core_types._int_sub(x_10051,1);
    var _x17 = ($std_core_types._int_ge(0,j_10050)) ? 0 : j_10050;
    store(owner.value.index_count, _x17);
     
    store(registration.registration_back, registration.registration_next);
     
    store(registration.registration_next, Int_index_end);
     
    int_index_fs_reclaim_delete_capacity(owner.value);
    return $std_core_types.Just(value.value);
  }
  else {
    return $std_core_types.Nothing;
  }
}