// Koka generated module: kokaine/reactive, koka version: 3.2.4
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
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $kokaine_reactive_internal_bridge from './kokaine_reactive_internal_bridge.mjs';
import * as $kokaine_reactive_internal_structural from './kokaine_reactive_internal_structural.mjs';
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_reactive_internal_async_dash_runtime from './kokaine_reactive_internal_async_dash_runtime.mjs';
import * as $kokaine_reactive_internal_handlers from './kokaine_reactive_internal_handlers.mjs';
import * as $kokaine_reactive_internal_reentry from './kokaine_reactive_internal_reentry.mjs';
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
import * as $kokaine_reactive_internal_scheduler from './kokaine_reactive_internal_scheduler.mjs';
 
// externals
 
// type declarations
// type memo
export function Public_memo(internal_memo) /* forall<a> (internal-memo : kokaine/reactive/internal/model/memo<a>) -> memo<a> */  {
  return internal_memo;
}
// type reentry
export function Public_reentry(internal_reentry) /* forall<e> (internal-reentry : kokaine/reactive/internal/model/reentry<e>) -> reentry<e> */  {
  return internal_reentry;
}
// type root
export function Public_root(internal_root) /* forall<e> (internal-root : kokaine/reactive/internal/model/root<e>) -> root<e> */  {
  return internal_root;
}
// type signal
export function Public_signal(internal_signal) /* forall<a> (internal-signal : kokaine/reactive/internal/model/signal<a>) -> signal<a> */  {
  return internal_signal;
}
// type structural-owner
export function Public_structural_owner(internal_structural_owner) /* forall<e> (internal-structural-owner : kokaine/reactive/internal/structural/structural-owner<e>) -> structural-owner<e> */  {
  return internal_structural_owner;
}
// type structural-transaction
export function Public_structural_transaction(internal_structural_transaction) /* forall<e> (internal-structural-transaction : kokaine/reactive/internal/structural/structural-transaction<e>) -> structural-transaction<e> */  {
  return internal_structural_transaction;
}
 
// declarations
 
 
// Automatically generated. Retrieves the `internal-root` constructor field of the `:root` type.
export function root_fs_internal_root(root) /* forall<e> (root : root<e>) -> kokaine/reactive/internal/model/root<e> */  {
  return root;
}
 
export function root_fs__copy(_this, internal_root) /* forall<e> (root<e>, internal-root : ? (kokaine/reactive/internal/model/root<e>)) -> root<e> */  {
  if (internal_root !== undefined) {
    var _x0 = internal_root;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
 
// Automatically generated. Retrieves the `internal-signal` constructor field of the `:signal` type.
export function signal_fs_internal_signal(signal_0) /* forall<a> (signal : signal<a>) -> kokaine/reactive/internal/model/signal<a> */  {
  return signal_0;
}
 
export function signal_fs__copy(_this, internal_signal) /* forall<a> (signal<a>, internal-signal : ? (kokaine/reactive/internal/model/signal<a>)) -> signal<a> */  {
  if (internal_signal !== undefined) {
    var _x1 = internal_signal;
  }
  else {
    var _x1 = _this;
  }
  return _x1;
}
 
 
// Automatically generated. Retrieves the `internal-memo` constructor field of the `:memo` type.
export function memo_fs_internal_memo(memo_0) /* forall<a> (memo : memo<a>) -> kokaine/reactive/internal/model/memo<a> */  {
  return memo_0;
}
 
export function memo_fs__copy(_this, internal_memo) /* forall<a> (memo<a>, internal-memo : ? (kokaine/reactive/internal/model/memo<a>)) -> memo<a> */  {
  if (internal_memo !== undefined) {
    var _x2 = internal_memo;
  }
  else {
    var _x2 = _this;
  }
  return _x2;
}
 
 
// Automatically generated. Retrieves the `internal-reentry` constructor field of the `:reentry` type.
export function reentry_fs_internal_reentry(reentry) /* forall<e> (reentry : reentry<e>) -> kokaine/reactive/internal/model/reentry<e> */  {
  return reentry;
}
 
export function reentry_fs__copy(_this, internal_reentry) /* forall<e> (reentry<e>, internal-reentry : ? (kokaine/reactive/internal/model/reentry<e>)) -> reentry<e> */  {
  if (internal_reentry !== undefined) {
    var _x3 = internal_reentry;
  }
  else {
    var _x3 = _this;
  }
  return _x3;
}
 
 
// Automatically generated. Retrieves the `internal-structural-owner` constructor field of the `:structural-owner` type.
export function structural_owner_fs_internal_structural_owner(_this) /* forall<e> (structural-owner<e>) -> kokaine/reactive/internal/structural/structural-owner<e> */  {
  return _this;
}
 
export function structural_owner_fs__copy(_this, internal_structural_owner) /* forall<e> (structural-owner<e>, internal-structural-owner : ? (kokaine/reactive/internal/structural/structural-owner<e>)) -> structural-owner<e> */  {
  if (internal_structural_owner !== undefined) {
    var _x4 = internal_structural_owner;
  }
  else {
    var _x4 = _this;
  }
  return _x4;
}
 
 
// Automatically generated. Retrieves the `internal-structural-transaction` constructor field of the `:structural-transaction` type.
export function structural_transaction_fs_internal_structural_transaction(_this) /* forall<e> (structural-transaction<e>) -> kokaine/reactive/internal/structural/structural-transaction<e> */  {
  return _this;
}
 
export function structural_transaction_fs__copy(_this, internal_structural_transaction) /* forall<e> (structural-transaction<e>, internal-structural-transaction : ? (kokaine/reactive/internal/structural/structural-transaction<e>)) -> structural-transaction<e> */  {
  if (internal_structural_transaction !== undefined) {
    var _x5 = internal_structural_transaction;
  }
  else {
    var _x5 = _this;
  }
  return _x5;
}
 
export function unwrap_root(value) /* forall<e> (value : root<e>) -> kokaine/reactive/internal/model/root<e> */  {
  return value;
}
 
export function unwrap_signal(value) /* forall<a> (value : signal<a>) -> kokaine/reactive/internal/model/signal<a> */  {
  return value;
}
 
export function unwrap_memo(value) /* forall<a> (value : memo<a>) -> kokaine/reactive/internal/model/memo<a> */  {
  return value;
}
 
export function unwrap_reentry(value) /* forall<e> (value : reentry<e>) -> kokaine/reactive/internal/model/reentry<e> */  {
  return value;
}
 
export function unwrap_structural_owner(value) /* forall<e> (value : structural-owner<e>) -> kokaine/reactive/internal/structural/structural-owner<e> */  {
  return value;
}
 
export function unwrap_structural_transaction(value) /* forall<e> (value : structural-transaction<e>) -> kokaine/reactive/internal/structural/structural-transaction<e> */  {
  return value;
}
 
export function dispatch(root, action) /* forall<a,e> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var root_0_10006 = $std_core_hnd._open_none1(function(value /* root<821> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_handlers.dispatch_handled(root_0_10006, action);
}
 
 
// monadic lift
export function _mlift_create_root_10205(_y_x10099) /* forall<a,e> ((kokaine/reactive/internal/model/root<e>, a)) -> <exn|e> (root<e>, a) */  {
  return $std_core_types.Tuple2(_y_x10099.fst, _y_x10099.snd);
}
 
export function create_root(action) /* forall<a,e> (action : (root<e>) -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> (root<e>, a) */  {
   
  var x_10220 = $kokaine_reactive_internal_runtime.create_root(function(internal /* kokaine/reactive/internal/model/root<885> */ ) {
    return action(internal);
  });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10099 /* (kokaine/reactive/internal/model/root<885>, 884) */ ) {
      return $std_core_types.Tuple2(_y_x10099.fst, _y_x10099.snd);
    });
  }
  else {
    return $std_core_types.Tuple2(x_10220.fst, x_10220.snd);
  }
}
 
export function root_fs_dispose(root) /* forall<e> (root : root<e>) -> <exn|e> () */  {
   
  var root_0_10009 = $std_core_hnd._open_none1(function(value /* root<911> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.root_fs_dispose(root_0_10009);
}
 
export function root_fs_is_disposed(root) /* forall<e> (root : root<e>) -> bool */  {
  var _x6 = root;
  return $kokaine_reactive_internal_bridge.runtime_root_is_disposed(_x6);
}
 
export function update(root, action) /* forall<a,e> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var inner_0 = $std_core_hnd._open_none1(function(value /* root<972> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.update(inner_0, action);
}
 
 
// monadic lift
export function _mlift_sample_10206(action, _y_x10103) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,kokaine/reactive/effects/signal-read|e> a */  {
  return $std_core_hnd._mask_at(_y_x10103, false, action);
}
 
export function sample(root, action) /* forall<a,e> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <exn|e> a */  {
   
  var root_0_10013 = $std_core_hnd._open_none1(function(value /* root<1008> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_handlers.dispatch_handled(root_0_10013, function() {
       
      var x_10224 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10103 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10103, false, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10224, false, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_signal_by_10207(_y_x10106) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn signal<a> */  {
  return _y_x10106;
}
 
export function signal_by(root, initial, equals) /* forall<a,e> (root : root<e>, initial : a, equals : (a, a) -> bool) -> exn signal<a> */  {
   
  var root_0_10015 = $std_core_hnd._open_none1(function(value /* root<1057> */ ) {
      return value;
    }, root);
   
  var x_10228 = $kokaine_reactive_internal_runtime.signal_by(root_0_10015, initial, equals);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10106 /* kokaine/reactive/internal/model/signal<1056> */ ) {
      return _y_x10106;
    });
  }
  else {
    return x_10228;
  }
}
 
 
// monadic lift
export function _mlift_signal_10208(_y_x10107) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn signal<a> */  {
  return _y_x10107;
}
 
export function signal(root, initial, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : root<e>, initial : a, ?(==) : (a, a) -> bool) -> exn signal<a> */  {
   
  var root_0_10015 = $std_core_hnd._open_none1(function(value /* root<1170> */ ) {
      return value;
    }, root);
   
  var x_10232 = $kokaine_reactive_internal_runtime.signal_by(root_0_10015, initial, _implicit_fs__lp__eq__eq__rp_);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10107 /* kokaine/reactive/internal/model/signal<1169> */ ) {
      return _y_x10107;
    });
  }
  else {
    return x_10232;
  }
}
 
 
// monadic lift
export function _mlift_signal_always_10209(_y_x10108) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn signal<a> */  {
  return _y_x10108;
}
 
export function signal_always(root, initial) /* forall<a,e> (root : root<e>, initial : a) -> exn signal<a> */  {
   
  var root_1_10021 = $std_core_hnd._open_none1(function(value /* root<1206> */ ) {
      return value;
    }, root);
   
  var x_10236 = $kokaine_reactive_internal_runtime.signal_by(root_1_10021, initial, function(___wildcard_x106__29 /* 1205 */ , ___wildcard_x106__31 /* 1205 */ ) {
      return false;
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10108 /* kokaine/reactive/internal/model/signal<1205> */ ) {
      return _y_x10108;
    });
  }
  else {
    return x_10236;
  }
}
 
export function signal_fs_get(value) /* forall<a> (value : signal<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var value_0_10024 = $std_core_hnd._open_none1(function(value_1 /* signal<1236> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10024);
}
 
export function signal_fs_set(value, next) /* forall<a> (value : signal<a>, next : a) -> kokaine/reactive/effects/signal-write () */  {
   
  var value_0_10025 = $std_core_hnd._open_none1(function(value_1 /* signal<1264> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10025, next);
}
 
export function signal_fs_modify(value, update_0) /* forall<a> (value : signal<a>, update : (a) -> a) -> kokaine/reactive/effects/signal-write () */  {
   
  var value_0_10027 = $std_core_hnd._open_none1(function(value_1 /* signal<1294> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_modify(value_0_10027, update_0);
}
 
export function signal_fs_update(value, update_0) /* forall<a> (value : signal<a>, update : (a) -> a) -> kokaine/reactive/effects/signal-write () */  {
   
  var value_1_10031 = $std_core_hnd._open_none1(function(value_2 /* signal<1329> */ ) {
      return value_2;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_modify(value_1_10031, update_0);
}
 
export function batch(root, action) /* forall<a,e,e1> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a) -> <kokaine/reactive/effects/signal-write,pure|e1> a */  {
   
  var root_0_10033 = $std_core_hnd._open_none1(function(value /* root<1371> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.batch(root_0_10033, action);
}
 
export function untrack(action) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <kokaine/reactive/effects/signal-read,pure|e> a */  {
  return $kokaine_reactive_internal_runtime.untrack(action);
}
 
 
// monadic lift
export function _mlift_derive_by_10210(_y_x10115) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10115;
}
 
export function derive_by(root, initial, calculate, equals) /* forall<a,e> (root : root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_0_10036 = $std_core_hnd._open_none1(function(value /* root<1456> */ ) {
      return value;
    }, root);
   
  var x_10240 = $kokaine_reactive_internal_runtime.derive_by_inner(root_0_10036, initial, calculate, equals);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10115 /* kokaine/reactive/internal/model/memo<1455> */ ) {
      return _y_x10115;
    });
  }
  else {
    return x_10240;
  }
}
 
 
// monadic lift
export function _mlift_derive_10211(_y_x10116) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10116;
}
 
export function derive(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, ?(==) : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_0_10036 = $std_core_hnd._open_none1(function(value /* root<1573> */ ) {
      return value;
    }, root);
   
  var x_10244 = $kokaine_reactive_internal_runtime.derive_by_inner(root_0_10036, initial, calculate, _implicit_fs__lp__eq__eq__rp_);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10116 /* kokaine/reactive/internal/model/memo<1572> */ ) {
      return _y_x10116;
    });
  }
  else {
    return x_10244;
  }
}
 
 
// monadic lift
export function _mlift_derive_always_10212(_y_x10117) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10117;
}
 
export function derive_always(root, initial, calculate) /* forall<a,e> (root : root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_1_10044 = $std_core_hnd._open_none1(function(value /* root<1613> */ ) {
      return value;
    }, root);
   
  var x_10248 = $kokaine_reactive_internal_runtime.derive_by_inner(root_1_10044, initial, calculate, function(___wildcard_x142__39 /* 1612 */ , ___wildcard_x142__41 /* 1612 */ ) {
      return false;
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10117 /* kokaine/reactive/internal/model/memo<1612> */ ) {
      return _y_x10117;
    });
  }
  else {
    return x_10248;
  }
}
 
 
// monadic lift
export function _mlift_memo_by_10213(_y_x10118) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10118;
}
 
export function memo_by(root, initial, calculate, equals) /* forall<a,e> (root : root<e>, initial : a, calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_0_10048 = $std_core_hnd._open_none1(function(value /* root<1666> */ ) {
      return value;
    }, root);
   
  var x_10252 = $kokaine_reactive_internal_runtime.memo_by_inner(root_0_10048, initial, calculate, equals);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10118 /* kokaine/reactive/internal/model/memo<1665> */ ) {
      return _y_x10118;
    });
  }
  else {
    return x_10252;
  }
}
 
 
// monadic lift
export function _mlift_memo_10214(_y_x10119) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10119;
}
 
export function memo(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : root<e>, initial : a, calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a, ?(==) : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_0_10048 = $std_core_hnd._open_none1(function(value /* root<1782> */ ) {
      return value;
    }, root);
   
  var x_10256 = $kokaine_reactive_internal_runtime.memo_by_inner(root_0_10048, initial, calculate, _implicit_fs__lp__eq__eq__rp_);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10119 /* kokaine/reactive/internal/model/memo<1781> */ ) {
      return _y_x10119;
    });
  }
  else {
    return x_10256;
  }
}
 
 
// monadic lift
export function _mlift_memo_always_10215(_y_x10120) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10120;
}
 
export function memo_always(root, initial, calculate) /* forall<a,e> (root : root<e>, initial : a, calculate : (previous : a) -> <kokaine/reactive/effects/signal-read,pure> a) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_1_10056 = $std_core_hnd._open_none1(function(value /* root<1821> */ ) {
      return value;
    }, root);
   
  var x_10260 = $kokaine_reactive_internal_runtime.memo_by_inner(root_1_10056, initial, calculate, function(___wildcard_x158__37 /* 1820 */ , ___wildcard_x158__39 /* 1820 */ ) {
      return false;
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10120 /* kokaine/reactive/internal/model/memo<1820> */ ) {
      return _y_x10120;
    });
  }
  else {
    return x_10260;
  }
}
 
export function memo_fs_get(value) /* forall<a> (value : memo<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var value_0_10060 = $std_core_hnd._open_none1(function(value_1 /* memo<1851> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.memo_fs_get(value_0_10060);
}
 
export function create_effect(root, track, apply) /* forall<a,e> (root : root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> <kokaine/reactive/effects/signal-write,pure> disposer<e> */  {
   
  var root_0_10061 = $std_core_hnd._open_none1(function(value /* root<1892> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10061, track, apply);
}
 
 
// monadic lift
export function _mlift_on_cleanup_10216(_pat) /* forall<e> (kokaine/reactive/internal/model/cleanup-registration<e>) -> exn () */  {
  return $std_core_types.Unit;
}
 
export function on_cleanup(root, cleanup) /* forall<e> (root : root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn () */  {
   
  var root_0_10064 = $std_core_hnd._open_none1(function(value /* root<1923> */ ) {
      return value;
    }, root);
   
  var x_10264 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10064, cleanup);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1 /* kokaine/reactive/internal/model/cleanup-registration<1923> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// monadic lift
export function _mlift_capture_reentry_10217(_y_x10124) /* forall<e> (kokaine/reactive/internal/model/reentry<e>) -> exn reentry<e> */  {
  return _y_x10124;
}
 
 
// Host callbacks capture the continuation generation which registered them.
// Work created during re-entry is structurally owned by that generation.
export function capture_reentry(root) /* forall<e> (root : root<e>) -> exn reentry<e> */  {
   
  var root_0_10066 = $std_core_hnd._open_none1(function(value /* root<1957> */ ) {
      return value;
    }, root);
   
  var x_10268 = $kokaine_reactive_internal_reentry.capture_reentry(root_0_10066);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10124 /* kokaine/reactive/internal/model/reentry<1957> */ ) {
      return _y_x10124;
    });
  }
  else {
    return x_10268;
  }
}
 
export function reenter(value, action) /* forall<a,e> (value : reentry<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var value_0_10067 = $std_core_hnd._open_none1(function(value_1 /* reentry<1991> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_reentry.run_reentry(value_0_10067, action);
}
 
 
// monadic lift
export function internal_fs__mlift_open_structural_owner_10218(_y_x10126) /* forall<e> (kokaine/reactive/internal/structural/structural-owner<e>) -> exn structural-owner<e> */  {
  return _y_x10126;
}
 
 
// Koka has no package-private exports. These qualified names form the narrow
// backend bridge used by `kokaine/dom` and are not application API.
export function internal_fs_open_structural_owner(root) /* forall<e> (root : root<e>) -> exn structural-owner<e> */  {
   
  var root_0_10069 = $std_core_hnd._open_none1(function(value /* root<2027> */ ) {
      return value;
    }, root);
   
  var x_10272 = $kokaine_reactive_internal_structural.open_structural_owner(root_0_10069);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10126 /* kokaine/reactive/internal/structural/structural-owner<2027> */ ) {
      return _y_x10126;
    });
  }
  else {
    return x_10272;
  }
}
 
export function internal_fs_with_structural_owner(root, owner, action) /* forall<a,e,e1> (root : root<e1>, owner : structural-owner<e1>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
   
  var root_0_10070 = $std_core_hnd._open_none1(function(value /* root<2078> */ ) {
      return value;
    }, root);
   
  var owner_0_10071 = $std_core_hnd._open_none1(function(value_0 /* structural-owner<2078> */ ) {
      return value_0;
    }, owner);
  return $kokaine_reactive_internal_structural.with_structural_owner(root_0_10070, owner_0_10071, action);
}
 
export function internal_fs_dispose_structural_owner(owner) /* forall<e> (owner : structural-owner<e>) -> <exn|e> () */  {
   
  var owner_0_10073 = $std_core_hnd._open_none1(function(value /* structural-owner<2107> */ ) {
      return value;
    }, owner);
  return $kokaine_reactive_internal_structural.dispose_structural_owner(owner_0_10073);
}
 
 
// monadic lift
export function internal_fs__mlift_open_structural_transaction_10219(_y_x10129) /* forall<e> (kokaine/reactive/internal/structural/structural-transaction<e>) -> exn structural-transaction<e> */  {
  return _y_x10129;
}
 
export function internal_fs_open_structural_transaction(root) /* forall<e> (root : root<e>) -> exn structural-transaction<e> */  {
   
  var root_0_10074 = $std_core_hnd._open_none1(function(value /* root<2140> */ ) {
      return value;
    }, root);
   
  var x_10276 = $kokaine_reactive_internal_structural.open_structural_transaction(root_0_10074);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10129 /* kokaine/reactive/internal/structural/structural-transaction<2140> */ ) {
      return _y_x10129;
    });
  }
  else {
    return x_10276;
  }
}
 
export function internal_fs_drain_structural_transaction(transaction) /* forall<e> (transaction : structural-transaction<e>) -> <div,exn|e> () */  {
   
  var transaction_0_10075 = $std_core_hnd._open_none1(function(value /* structural-transaction<2164> */ ) {
      return value;
    }, transaction);
  if (transaction_0_10075.structural_authority === 1) {
    return $kokaine_reactive_internal_scheduler.drain_work_transaction(transaction_0_10075.structural_transaction_root, transaction_0_10075.structural_scheduler);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function internal_fs_structural_transaction_owned(transaction) /* forall<e> (transaction : structural-transaction<e>) -> bool */  {
  return (transaction.structural_authority === 1);
}
 
export function internal_fs_stage_structural_publication(transaction, prepare, publish, rollback) /* forall<e> (transaction : structural-transaction<e>, prepare : () -> <exn|e> (), publish : () -> (), rollback : () -> <exn|e> ()) -> exn () */  {
   
  var transaction_0_10078 = $std_core_hnd._open_none1(function(value /* structural-transaction<2223> */ ) {
      return value;
    }, transaction);
  return $kokaine_reactive_internal_scheduler.stage_work_publication(transaction_0_10078.structural_transaction_root, transaction_0_10078.structural_scheduler, prepare, publish, rollback);
}
 
export function internal_fs_commit_structural_transaction(transaction) /* forall<e> (transaction : structural-transaction<e>) -> <div,exn|e> () */  {
   
  var transaction_0_10082 = $std_core_hnd._open_none1(function(value /* structural-transaction<2247> */ ) {
      return value;
    }, transaction);
  if (transaction_0_10082.structural_authority === 1) {
    return $kokaine_reactive_internal_scheduler.commit_work_transaction(transaction_0_10082.structural_transaction_root, transaction_0_10082.structural_scheduler);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function internal_fs_abort_structural_transaction(transaction) /* forall<e> (transaction : structural-transaction<e>) -> <exn|e> () */  {
   
  var transaction_0_10083 = $std_core_hnd._open_none1(function(value /* structural-transaction<2270> */ ) {
      return value;
    }, transaction);
  if (transaction_0_10083.structural_authority === 1) {
    return $kokaine_reactive_internal_scheduler.abort_work_transaction(transaction_0_10083.structural_transaction_root, transaction_0_10083.structural_scheduler);
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// Run a direct-style browser task under the exact structural generation which
// is current at the call site. Each suspension is registered with that owner;
// later completion re-enters through a fresh Kokaine batch.
export function run_async(root, action) /* (root : root<ui>, action : () -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> ()) -> <pure,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var root_0_10084 = $std_core_hnd._open_none1(function(value /* root<ui> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_async_dash_runtime.run_generation_async(root_0_10084, action);
}