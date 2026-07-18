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
      return { value: Int_index_end };
    });
}
 
export function new_int_index() /* forall<a> () -> int-index<a> */  {
   
  var n_10009 = ($std_core_types._int_ge(16,16)) ? 16 : 16;
   
  var value_10015 = $std_core_vector.vector_alloc_total($std_core_int.ssize__t(n_10009), function(i /* ssize_t */ ) {
       
      $std_core_types._int_from_int32(i);
      return { value: Int_index_end };
    });
  return Int_index({ value: value_10015 }, { value: 0 });
}
 
export function int_index_fs_count(target) /* forall<a> (target : int-index<a>) -> int */  {
  return (target.index_count).value;
}
 
export function int_index_fs_capacity(target) /* forall<a> (target : int-index<a>) -> int */  {
   
  var v_10021 = (target.index_buckets).value;
  return $std_core_types._int_from_int32((((v_10021).length)));
}
 
export function normalized_key(key) /* (key : int) -> int */  {
  if ($std_core_types._int_ge(key,0)) {
    return key;
  }
  else {
     
    var y_10025 = $std_core_types._int_add(key,1);
    return $std_core_types._int_sub(0,y_10025);
  }
}
 
export function bucket_offset(key, capacity) /* (key : int, capacity : int) -> int */  {
  if ($std_core_types._int_ge(key,0)) {
    var _x6 = key;
  }
  else {
     
    var y_10025 = $std_core_types._int_add(key,1);
    var _x6 = $std_core_types._int_sub(0,y_10025);
  }
  return $std_core_types._int_mod(_x6,capacity);
}
 
export function bucket_at(buckets, key) /* forall<a> (buckets : vector<ref<global,int-index-link<a>>>, key : int) -> ref<global,int-index-link<a>> */  {
   
  var capacity_10030 = $std_core_types._int_from_int32((((buckets).length)));
  if ($std_core_types._int_ge(key,0)) {
    var _x8 = key;
  }
  else {
     
    var y_10025 = $std_core_types._int_add(key,1);
    var _x8 = $std_core_types._int_sub(0,y_10025);
  }
  var _x7 = $std_core_vector.at(buckets, $std_core_types._int_mod(_x8,capacity_10030));
  if (_x7 !== null) {
    return _x7.value;
  }
  else {
    return { value: Int_index_end };
  }
}
 
export function int_index_link_fs_set_back(value, pointer) /* forall<a> (value : int-index-link<a>, pointer : ref<global,int-index-link<a>>) -> () */  {
  if (value === null) {
    return $std_core_types.Unit;
  }
  else {
    return (((value.link_back)).value = pointer);
  }
}
 
export function lookup_link(value, key) /* forall<a> (value : int-index-link<a>, key : int) -> div maybe<a> */  { tailcall: while(1)
{
  if (value === null) {
    return $std_core_types.Nothing;
  }
  else {
    if ($std_core_types._int_eq((value.link_key),key)) {
      return (value.link_value).value;
    }
    else {
      {
        // tail call
        var _x9 = (value.link_next).value;
        value = _x9;
        continue tailcall;
      }
    }
  }
}}
 
export function int_index_fs_lookup(target, key) /* forall<a> (target : int-index<a>, key : int) -> maybe<a> */  {
   
  var buckets = (target.index_buckets).value;
   
  var value_0_10042 = bucket_at(buckets, key);
  return lookup_link(value_0_10042.value, key);
}
 
 
// monadic lift
export function _mlift_move_links_10179(back, bucket, current, pending, rest, _c_x10138) /* forall<_e,h,a> (back : ref<global,ref<global,int-index-link<a>>>, bucket : ref<global,int-index-link<a>>, current : int-index-link<a>, pending : local-var<h,int-index-link<a>>, rest : int-index-link<a>, ()) -> () */  {
   
  ((back).value = bucket);
   
  ((bucket).value = current);
  return ((pending).value = rest);
}
 
export function move_links(value, buckets) /* forall<a> (value : int-index-link<a>, buckets : vector<ref<global,int-index-link<a>>>) -> () */  {
  return function() {
     
    var loc = { value: value };
     
    var loc_0 = { value: true };
     
    var res_0 = $std_core.$while(function() {
        return ((loc_0).value);
      }, function() {
        var _x10 = ((loc).value);
        if (_x10 === null) {
          return ((loc_0).value = false);
        }
        else {
           
          var rest = (_x10.link_next).value;
           
          var bucket = bucket_at(buckets, _x10.link_key);
           
          var successor = bucket.value;
           
          (((_x10.link_next)).value = successor);
           
          if (successor === null) {
            var x_10190 = $std_core_types.Unit;
          }
          else {
            var x_10190 = (((successor.link_back)).value = (_x10.link_next));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_c_x10138 /* () */ ) {
              return _mlift_move_links_10179(_x10.link_back, bucket, _x10, loc, rest, _c_x10138);
            });
          }
          else {
            return _mlift_move_links_10179(_x10.link_back, bucket, _x10, loc, rest, x_10190);
          }
        }
      });
     
    var res = $std_core_hnd.prompt_local_var(loc_0, res_0);
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
}
 
 
// monadic lift
export function int_index_fs__mlift_resize_10180(offset, _c_x10140) /* forall<h> (offset : local-var<h,int>, ()) -> () */  {
   
  var x_10062 = ((offset).value);
  return ((offset).value = ($std_core_types._int_add(x_10062,1)));
}
 
export function int_index_fs_resize(target, requested) /* forall<a> (target : int-index<a>, requested : int) -> () */  {
   
  var old_buckets = (target.index_buckets).value;
   
  var next_buckets = new_buckets(requested);
  var _x10 = function() {
     
    var loc = { value: 0 };
     
    var res = $std_core.$while(function() {
        return $std_core_types._int_lt((((loc).value)),($std_core_types._int_from_int32((((old_buckets).length)))));
      }, function() {
         
        var _x11 = $std_core_vector.at(old_buckets, ((loc).value));
        if (_x11 === null) {
          var x_10194 = $std_core_types.Unit;
        }
        else {
           
          var values = (_x11.value).value;
           
          (((_x11.value)).value = Int_index_end);
          var x_10194 = move_links(values, next_buckets);
        }
         
        function next_10195(_c_x10140) /* (()) -> () */  {
           
          var x_10062 = ((loc).value);
          return ((loc).value = ($std_core_types._int_add(x_10062,1)));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(next_10195);
        }
        else {
          return next_10195(x_10194);
        }
      });
    return $std_core_hnd.prompt_local_var(loc, res);
  }();
  return (((target.index_buckets)).value = next_buckets);
}
 
 
// monadic lift
export function int_index_fs__mlift_ensure_insert_capacity_10181(capacity, target, _c_x10143) /* forall<a> (capacity : int, target : int-index<a>, int) -> () */  {
  var _x11 = $std_core_types._int_gt(($std_core_types._int_mul(($std_core_types._int_add(_c_x10143,1)),4)),($std_core_types._int_mul(capacity,3)));
  if (_x11) {
    return int_index_fs_resize(target, $std_core_types._int_mul(capacity,2));
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function int_index_fs_ensure_insert_capacity(target) /* forall<a> (target : int-index<a>) -> () */  {
   
  var capacity = int_index_fs_capacity(target);
   
  var x_10198 = (target.index_count).value;
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10143 /* int */ ) {
      return int_index_fs__mlift_ensure_insert_capacity_10181(capacity, target, _c_x10143);
    });
  }
  else {
    var _x12 = $std_core_types._int_gt(($std_core_types._int_mul(($std_core_types._int_add(x_10198,1)),4)),($std_core_types._int_mul(capacity,3)));
    if (_x12) {
      return int_index_fs_resize(target, $std_core_types._int_mul(capacity,2));
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function int_index_fs__mlift_reclaim_delete_capacity_10182(capacity, target, _c_x10144) /* forall<a> (capacity : int, target : int-index<a>, int) -> () */  {
  var _x13 = $std_core_types._int_le(($std_core_types._int_mul(_c_x10144,4)),capacity);
  if (_x13) {
     
    var j_10067 = $std_core_types._int_div(capacity,2);
    var _x14 = ($std_core_types._int_ge(16,j_10067)) ? 16 : j_10067;
    return int_index_fs_resize(target, _x14);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function int_index_fs_reclaim_delete_capacity(target) /* forall<a> (target : int-index<a>) -> () */  {
   
  var capacity = int_index_fs_capacity(target);
  if ($std_core_types._int_gt(capacity,16)) {
     
    var x_10201 = (target.index_count).value;
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10144 /* int */ ) {
        return int_index_fs__mlift_reclaim_delete_capacity_10182(capacity, target, _c_x10144);
      });
    }
    else {
      var _x15 = $std_core_types._int_le(($std_core_types._int_mul(x_10201,4)),capacity);
      if (_x15) {
         
        var j_10067 = $std_core_types._int_div(capacity,2);
        var _x16 = ($std_core_types._int_ge(16,j_10067)) ? 16 : j_10067;
        return int_index_fs_resize(target, _x16);
      }
      else {
        return $std_core_types.Unit;
      }
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function int_index_fs_insert(target, key, value) /* forall<a> (target : int-index<a>, key : int, value : a) -> exn int-index-registration<a> */  {
  var _x17 = $std_core_hnd._open_none2(int_index_fs_lookup, target, key);
  if (_x17 !== null) {
    return $std_core_exn.$throw("cannot register a duplicate integer index key");
  }
  else {
     
    $std_core_hnd._open_none1(int_index_fs_ensure_insert_capacity, target);
     
    var buckets = (target.index_buckets).value;
     
    var bucket = $std_core_hnd._open_none2(bucket_at, buckets, key);
     
    var slot = { value: ($std_core_types.Just(value)) };
     
    var value_2_10159 = bucket.value;
     
    var next = { value: value_2_10159 };
     
    var _x_x1_2_10177 = next.value;
     
    $std_core_hnd._open_none2(function(value_4 /* int-index-link<1977> */ , pointer /* ref<global,int-index-link<1977>> */ ) {
        if (value_4 === null) {
          return $std_core_types.Unit;
        }
        else {
          return (((value_4.link_back)).value = pointer);
        }
      }, _x_x1_2_10177, next);
     
    var back_0 = { value: bucket };
     
    ((bucket).value = (Int_index_link(key, slot, back_0, next)));
     
    var x_10168 = (target.index_count).value;
     
    var value_7_10167 = $std_core_types._int_add(x_10168,1);
     
    (((target.index_count)).value = value_7_10167);
    return Int_index_registration(slot, back_0, next, { value: ($std_core_types.Just(target)) });
  }
}
 
 
// monadic lift
export function int_index_registration_fs__mlift_take_10183(back, current, next, target_1, _c_x10151) /* forall<_e,a> (back : ref<global,ref<global,int-index-link<a>>>, current : a, next : ref<global,int-index-link<a>>, target@1 : int-index<a>, ()) -> maybe<a> */  {
   
  ((back).value = next);
   
  ((next).value = Int_index_end);
   
  int_index_fs_reclaim_delete_capacity(target_1);
  return $std_core_types.Just(current);
}
 
 
// monadic lift
export function int_index_registration_fs__mlift_take_10184(back, current, next, target_1, _c_x10150) /* forall<_e,_e1,a> (back : ref<global,ref<global,int-index-link<a>>>, current : a, next : ref<global,int-index-link<a>>, target@1 : int-index<a>, ()) -> maybe<a> */  {
   
   
  var x_10098 = (target_1.index_count).value;
   
  var j_10097 = $std_core_types._int_sub(x_10098,1);
   
  var value_7_10095 = ($std_core_types._int_ge(0,j_10097)) ? 0 : j_10097;
  var x_10204 = (((target_1.index_count)).value = value_7_10095);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10151 /* () */ ) {
      return int_index_registration_fs__mlift_take_10183(back, current, next, target_1, _c_x10151);
    });
  }
  else {
    return int_index_registration_fs__mlift_take_10183(back, current, next, target_1, x_10204);
  }
}
 
export function int_index_registration_fs_take(registration) /* forall<a> (registration : int-index-registration<a>) -> maybe<a> */  {
   
  var value_0 = (registration.registration_value).value;
   
  (((registration.registration_value)).value = ($std_core_types.Nothing));
   
  var owner = (registration.registration_owner).value;
   
  (((registration.registration_owner)).value = ($std_core_types.Nothing));
  if (value_0 !== null && owner !== null) {
     
    var predecessor = (registration.registration_back).value;
     
    var successor = (registration.registration_next).value;
     
    ((predecessor).value = successor);
     
    if (successor === null) {
      var x_10206 = $std_core_types.Unit;
    }
    else {
      var x_10206 = (((successor.link_back)).value = predecessor);
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10150 /* () */ ) {
        return int_index_registration_fs__mlift_take_10184(registration.registration_back, value_0.value, registration.registration_next, owner.value, _c_x10150);
      });
    }
    else {
       
       
      var x_10098 = (owner.value.index_count).value;
       
      var j_10097 = $std_core_types._int_sub(x_10098,1);
       
      var value_7_10095 = ($std_core_types._int_ge(0,j_10097)) ? 0 : j_10097;
      var x_0_10209 = (((owner.value.index_count)).value = value_7_10095);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_c_x10151 /* () */ ) {
          return int_index_registration_fs__mlift_take_10183(registration.registration_back, value_0.value, registration.registration_next, owner.value, _c_x10151);
        });
      }
      else {
         
        (((registration.registration_back)).value = (registration.registration_next));
         
        (((registration.registration_next)).value = Int_index_end);
         
        int_index_fs_reclaim_delete_capacity(owner.value);
        return $std_core_types.Just(value_0.value);
      }
    }
  }
  else {
    return $std_core_types.Nothing;
  }
}