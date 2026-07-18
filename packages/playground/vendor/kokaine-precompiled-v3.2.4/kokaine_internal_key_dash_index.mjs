// Koka generated module: kokaine/internal/key-index, koka version: 3.2.4
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
 
// externals
 
// type declarations
// type key-index
export const Key_index_empty = null; // forall<a,b> key-index<a,b>
export function Key_index_node(index_height, index_key, index_value, index_left, index_right) /* forall<a,b> (index-height : int, index-key : a, index-value : b, index-left : key-index<a,b>, index-right : key-index<a,b>) -> key-index<a,b> */  {
  return { index_height: index_height, index_key: index_key, index_value: index_value, index_left: index_left, index_right: index_right };
}
// type insert-result
export function Inserted(index) /* forall<a,b> (index : key-index<a,b>) -> insert-result<a,b> */  {
  return { _tag: 1, index: index };
}
export function Duplicate(existing) /* forall<a,b> (existing : b) -> insert-result<a,b> */  {
  return { _tag: 2, existing: existing };
}
 
// declarations
 
 
// Automatically generated. Tests for the `Key-index-empty` constructor of the `:key-index` type.
export function is_key_index_empty(key_index) /* forall<a,b> (key-index : key-index<a,b>) -> bool */  {
  return (key_index === null);
}
 
 
// Automatically generated. Tests for the `Key-index-node` constructor of the `:key-index` type.
export function is_key_index_node(key_index) /* forall<a,b> (key-index : key-index<a,b>) -> bool */  {
  return (key_index !== null);
}
 
 
// Automatically generated. Tests for the `Inserted` constructor of the `:insert-result` type.
export function is_inserted(insert_result) /* forall<a,b> (insert-result : insert-result<a,b>) -> bool */  {
  return (insert_result._tag === 1);
}
 
 
// Automatically generated. Tests for the `Duplicate` constructor of the `:insert-result` type.
export function is_duplicate(insert_result) /* forall<a,b> (insert-result : insert-result<a,b>) -> bool */  {
  return (insert_result._tag === 2);
}
 
export function empty() /* forall<a,b> () -> key-index<a,b> */  {
  return Key_index_empty;
}
 
export function height(index) /* forall<a,b> (index : key-index<a,b>) -> int */  {
  return (index === null) ? 0 : index.index_height;
}
 
export function make_node(left, key, value, right) /* forall<a,b> (left : key-index<a,b>, key : a, value : b, right : key-index<a,b>) -> key-index<a,b> */  {
   
  var _x1 = (left === null) ? 0 : left.index_height;
  var _x2 = (right === null) ? 0 : right.index_height;
  var _x0 = $std_core_types._int_ge(_x1,_x2);
  if (_x0) {
    var y_10001 = (left === null) ? 0 : left.index_height;
  }
  else {
    var y_10001 = (right === null) ? 0 : right.index_height;
  }
  return Key_index_node($std_core_types._int_add(1,y_10001), key, value, left, right);
}
 
export function balance(left, key, value, right) /* forall<a,b> (left : key-index<a,b>, key : a, value : b, right : key-index<a,b>) -> key-index<a,b> */  {
  var _x1 = (left === null) ? 0 : left.index_height;
  var _x2 = (right === null) ? 0 : right.index_height;
  var _x0 = $std_core_types._int_gt(_x1,($std_core_types._int_add(_x2,1)));
  if (_x0) {
    if (left === null) {
      return make_node(left, key, value, right);
    }
    else {
      var _x4 = (left.index_left === null) ? 0 : left.index_left.index_height;
      var _x5 = (left.index_right === null) ? 0 : left.index_right.index_height;
      var _x3 = $std_core_types._int_ge(_x4,_x5);
      if (_x3) {
         
        var right_0_10025 = make_node(left.index_right, key, value, right);
         
        var _x7 = (left.index_left === null) ? 0 : left.index_left.index_height;
        var _x8 = (right_0_10025 === null) ? 0 : right_0_10025.index_height;
        var _x6 = $std_core_types._int_ge(_x7,_x8);
        if (_x6) {
          var y_10001 = (left.index_left === null) ? 0 : left.index_left.index_height;
        }
        else {
          var y_10001 = (right_0_10025 === null) ? 0 : right_0_10025.index_height;
        }
        return Key_index_node($std_core_types._int_add(1,y_10001), left.index_key, left.index_value, left.index_left, right_0_10025);
      }
      else {
        if (left.index_right === null) {
          return make_node(left, key, value, right);
        }
        else {
           
          var left_1_10026 = make_node(left.index_left, left.index_key, left.index_value, left.index_right.index_left);
           
          var right_1_10029 = make_node(left.index_right.index_right, key, value, right);
           
          var _x7 = (left_1_10026 === null) ? 0 : left_1_10026.index_height;
          var _x8 = (right_1_10029 === null) ? 0 : right_1_10029.index_height;
          var _x6 = $std_core_types._int_ge(_x7,_x8);
          if (_x6) {
            var y_10001_0 = (left_1_10026 === null) ? 0 : left_1_10026.index_height;
          }
          else {
            var y_10001_0 = (right_1_10029 === null) ? 0 : right_1_10029.index_height;
          }
          return Key_index_node($std_core_types._int_add(1,y_10001_0), left.index_right.index_key, left.index_right.index_value, left_1_10026, right_1_10029);
        }
      }
    }
  }
  else {
    var _x7 = (right === null) ? 0 : right.index_height;
    var _x8 = (left === null) ? 0 : left.index_height;
    var _x6 = $std_core_types._int_gt(_x7,($std_core_types._int_add(_x8,1)));
    if (_x6) {
      if (right === null) {
        return make_node(left, key, value, right);
      }
      else {
        var _x10 = (right.index_right === null) ? 0 : right.index_right.index_height;
        var _x11 = (right.index_left === null) ? 0 : right.index_left.index_height;
        var _x9 = $std_core_types._int_ge(_x10,_x11);
        if (_x9) {
           
          var left_2_10030 = make_node(left, key, value, right.index_left);
           
          var _x13 = (left_2_10030 === null) ? 0 : left_2_10030.index_height;
          var _x14 = (right.index_right === null) ? 0 : right.index_right.index_height;
          var _x12 = $std_core_types._int_ge(_x13,_x14);
          if (_x12) {
            var y_10001_1 = (left_2_10030 === null) ? 0 : left_2_10030.index_height;
          }
          else {
            var y_10001_1 = (right.index_right === null) ? 0 : right.index_right.index_height;
          }
          return Key_index_node($std_core_types._int_add(1,y_10001_1), right.index_key, right.index_value, left_2_10030, right.index_right);
        }
        else {
          if (right.index_left === null) {
            return make_node(left, key, value, right);
          }
          else {
             
            var left_3_10034 = make_node(left, key, value, right.index_left.index_left);
             
            var right_3_10037 = make_node(right.index_left.index_right, right.index_key, right.index_value, right.index_right);
             
            var _x13 = (left_3_10034 === null) ? 0 : left_3_10034.index_height;
            var _x14 = (right_3_10037 === null) ? 0 : right_3_10037.index_height;
            var _x12 = $std_core_types._int_ge(_x13,_x14);
            if (_x12) {
              var y_10001_2 = (left_3_10034 === null) ? 0 : left_3_10034.index_height;
            }
            else {
              var y_10001_2 = (right_3_10037 === null) ? 0 : right_3_10037.index_height;
            }
            return Key_index_node($std_core_types._int_add(1,y_10001_2), right.index_left.index_key, right.index_left.index_value, left_3_10034, right_3_10037);
          }
        }
      }
    }
    else {
      return make_node(left, key, value, right);
    }
  }
}
 
export function find(index, key, cmp) /* forall<a,b> (index : key-index<a,b>, key : a, cmp : (a, a) -> order) -> maybe<b> */  { tailcall: while(1)
{
  if (index === null) {
    return $std_core_types.Nothing;
  }
  else {
    var _x12 = cmp(key, index.index_key);
    if (_x12 === 1) {
      {
        // tail call
        index = index.index_left;
        continue tailcall;
      }
    }
    else if (_x12 === 2) {
      return $std_core_types.Just(index.index_value);
    }
    else {
      {
        // tail call
        index = index.index_right;
        continue tailcall;
      }
    }
  }
}}
 
export function insert(index, key, value, cmp) /* forall<a,b> (index : key-index<a,b>, key : a, value : b, cmp : (a, a) -> order) -> insert-result<a,b> */  {
  if (index === null) {
     
    var _x15 = Key_index_empty;
    var _x14 = (_x15 === null) ? 0 : _x15.index_height;
    var _x17 = Key_index_empty;
    var _x16 = (_x17 === null) ? 0 : _x17.index_height;
    var _x13 = $std_core_types._int_ge(_x14,_x16);
    if (_x13) {
      var _x18 = Key_index_empty;
      var y_10001 = (_x18 === null) ? 0 : _x18.index_height;
    }
    else {
      var _x19 = Key_index_empty;
      var y_10001 = (_x19 === null) ? 0 : _x19.index_height;
    }
    return Inserted(Key_index_node($std_core_types._int_add(1,y_10001), key, value, Key_index_empty, Key_index_empty));
  }
  else {
    var _x13 = cmp(key, index.index_key);
    if (_x13 === 2) {
      return Duplicate(index.index_value);
    }
    else if (_x13 === 1) {
      var _x14 = insert(index.index_left, key, value, cmp);
      if (_x14._tag === 2) {
        return Duplicate(_x14.existing);
      }
      else {
        return Inserted(balance(_x14.index, index.index_key, index.index_value, index.index_right));
      }
    }
    else {
      var _x15 = insert(index.index_right, key, value, cmp);
      if (_x15._tag === 2) {
        return Duplicate(_x15.existing);
      }
      else {
        return Inserted(balance(index.index_left, index.index_key, index.index_value, _x15.index));
      }
    }
  }
}
 
export function size(index) /* forall<a,b> (index : key-index<a,b>) -> int */  {
  if (index === null) {
    return 0;
  }
  else {
     
    var y_0_10021 = size(index.index_left);
     
    var x_10018 = $std_core_types._int_add(1,y_0_10021);
     
    var y_10019 = size(index.index_right);
    return $std_core_types._int_add(x_10018,y_10019);
  }
}