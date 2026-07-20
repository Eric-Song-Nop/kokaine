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
import * as $kokaine_reactive_internal_handlers from './kokaine_reactive_internal_handlers.mjs';
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
 
// externals
 
// type declarations
// type memo
export function Public_memo(internal_memo) /* forall<a> (internal-memo : kokaine/reactive/internal/model/memo<a>) -> memo<a> */  {
  return internal_memo;
}
// type root
export function Public_root(internal_root) /* forall<e> (internal-root : kokaine/reactive/internal/model/root<e>) -> root<e> */  {
  return internal_root;
}
// type signal
export function Public_signal(internal_signal) /* forall<a> (internal-signal : kokaine/reactive/internal/model/signal<a>) -> signal<a> */  {
  return internal_signal;
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
export function memo_fs_internal_memo(memo) /* forall<a> (memo : memo<a>) -> kokaine/reactive/internal/model/memo<a> */  {
  return memo;
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
 
export function unwrap_root(value) /* forall<e> (value : root<e>) -> kokaine/reactive/internal/model/root<e> */  {
  return value;
}
 
 
// Koka has no package-private exports. Integration modules use this qualified
// capability to bind a public root without making the core depend on them.
export function internal_fs_root_handle(value) /* forall<e> (value : root<e>) -> kokaine/reactive/internal/model/root<e> */  {
  return value;
}
 
export function unwrap_signal(value) /* forall<a> (value : signal<a>) -> kokaine/reactive/internal/model/signal<a> */  {
  return value;
}
 
export function unwrap_memo(value) /* forall<a> (value : memo<a>) -> kokaine/reactive/internal/model/memo<a> */  {
  return value;
}
 
export function dispatch(root, action) /* forall<a,e> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var inner_0 = $std_core_hnd._open_none1(function(value /* root<482> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_handlers.dispatch_handled(inner_0, action);
}
 
 
// monadic lift
export function _mlift_create_root_10112(_y_x10057) /* forall<a,e> ((kokaine/reactive/internal/model/root<e>, a)) -> <exn|e> (root<e>, a) */  {
  return $std_core_types.Tuple2(_y_x10057.fst, _y_x10057.snd);
}
 
export function create_root(action) /* forall<a,e> (action : (root<e>) -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> (root<e>, a) */  {
   
  var x_10121 = $kokaine_reactive_internal_runtime.create_root(function(internal /* kokaine/reactive/internal/model/root<546> */ ) {
    return action(internal);
  });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10057 /* (kokaine/reactive/internal/model/root<546>, 545) */ ) {
      return $std_core_types.Tuple2(_y_x10057.fst, _y_x10057.snd);
    });
  }
  else {
    return $std_core_types.Tuple2(x_10121.fst, x_10121.snd);
  }
}
 
export function root_fs_dispose(root) /* forall<e> (root : root<e>) -> <exn|e> () */  {
   
  var inner_0 = $std_core_hnd._open_none1(function(value /* root<573> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.root_fs_dispose(inner_0);
}
 
export function root_fs_is_disposed(root) /* forall<e> (root : root<e>) -> bool */  {
  var _x3 = root;
  return $kokaine_reactive_internal_bridge.runtime_root_is_disposed(_x3);
}
 
export function update(root, action) /* forall<a,e> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var inner_0 = $std_core_hnd._open_none1(function(value /* root<634> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.update(inner_0, action);
}
 
 
// monadic lift
export function _mlift_sample_10113(action, _y_x10061) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,kokaine/reactive/effects/signal-read|e> a */  {
  return $std_core_hnd._mask_at(_y_x10061, false, action);
}
 
export function sample(root, action) /* forall<a,e> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <exn|e> a */  {
   
  var root_0_10011 = $std_core_hnd._open_none1(function(value /* root<670> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_handlers.dispatch_handled(root_0_10011, function() {
       
      var x_10125 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10061 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10061, false, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10125, false, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_signal_by_10114(_y_x10064) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn signal<a> */  {
  return _y_x10064;
}
 
export function signal_by(root, initial, equals) /* forall<a,e> (root : root<e>, initial : a, equals : (a, a) -> bool) -> exn signal<a> */  {
   
  var root_0_10013 = $std_core_hnd._open_none1(function(value /* root<719> */ ) {
      return value;
    }, root);
   
  var x_10129 = $kokaine_reactive_internal_runtime.signal_by(root_0_10013, initial, equals);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10064 /* kokaine/reactive/internal/model/signal<718> */ ) {
      return _y_x10064;
    });
  }
  else {
    return x_10129;
  }
}
 
 
// monadic lift
export function _mlift_signal_10115(_y_x10065) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn signal<a> */  {
  return _y_x10065;
}
 
export function signal(root, initial, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : root<e>, initial : a, ?(==) : (a, a) -> bool) -> exn signal<a> */  {
   
  var root_0_10013 = $std_core_hnd._open_none1(function(value /* root<831> */ ) {
      return value;
    }, root);
   
  var x_10133 = $kokaine_reactive_internal_runtime.signal_by(root_0_10013, initial, _implicit_fs__lp__eq__eq__rp_);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10065 /* kokaine/reactive/internal/model/signal<830> */ ) {
      return _y_x10065;
    });
  }
  else {
    return x_10133;
  }
}
 
 
// monadic lift
export function _mlift_signal_always_10116(_y_x10066) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn signal<a> */  {
  return _y_x10066;
}
 
export function signal_always(root, initial) /* forall<a,e> (root : root<e>, initial : a) -> exn signal<a> */  {
   
  var root_1_10019 = $std_core_hnd._open_none1(function(value /* root<867> */ ) {
      return value;
    }, root);
   
  var x_10137 = $kokaine_reactive_internal_runtime.signal_by(root_1_10019, initial, function(___wildcard_x87__29 /* 866 */ , ___wildcard_x87__31 /* 866 */ ) {
      return false;
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10066 /* kokaine/reactive/internal/model/signal<866> */ ) {
      return _y_x10066;
    });
  }
  else {
    return x_10137;
  }
}
 
export function signal_fs_get(value) /* forall<a> (value : signal<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var value_0_10022 = $std_core_hnd._open_none1(function(value_1 /* signal<897> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10022);
}
 
export function signal_fs_set(value, next) /* forall<a> (value : signal<a>, next : a) -> kokaine/reactive/effects/signal-write () */  {
   
  var value_0_10023 = $std_core_hnd._open_none1(function(value_1 /* signal<925> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023, next);
}
 
export function signal_fs_modify(value, update_0) /* forall<a> (value : signal<a>, update : (a) -> a) -> kokaine/reactive/effects/signal-write () */  {
   
  var value_0_10025 = $std_core_hnd._open_none1(function(value_1 /* signal<955> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_modify(value_0_10025, update_0);
}
 
export function batch(root, action) /* forall<a,e,e1> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a) -> <kokaine/reactive/effects/signal-write,pure|e1> a */  {
   
  var root_0_10027 = $std_core_hnd._open_none1(function(value /* root<997> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.batch(root_0_10027, action);
}
 
export function untrack(action) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <kokaine/reactive/effects/signal-read,pure|e> a */  {
  return $kokaine_reactive_internal_runtime.untrack(action);
}
 
 
// monadic lift
export function _mlift_derive_by_10117(_y_x10072) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10072;
}
 
export function derive_by(root, initial, calculate, equals) /* forall<a,e> (root : root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_0_10030 = $std_core_hnd._open_none1(function(value /* root<1082> */ ) {
      return value;
    }, root);
   
  var x_10141 = $kokaine_reactive_internal_runtime.derive_by_inner(root_0_10030, initial, calculate, equals);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10072 /* kokaine/reactive/internal/model/memo<1081> */ ) {
      return _y_x10072;
    });
  }
  else {
    return x_10141;
  }
}
 
 
// monadic lift
export function _mlift_derive_10118(_y_x10073) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10073;
}
 
export function derive(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, ?(==) : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_0_10030 = $std_core_hnd._open_none1(function(value /* root<1198> */ ) {
      return value;
    }, root);
   
  var x_10145 = $kokaine_reactive_internal_runtime.derive_by_inner(root_0_10030, initial, calculate, _implicit_fs__lp__eq__eq__rp_);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10073 /* kokaine/reactive/internal/model/memo<1197> */ ) {
      return _y_x10073;
    });
  }
  else {
    return x_10145;
  }
}
 
 
// monadic lift
export function _mlift_derive_always_10119(_y_x10074) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10074;
}
 
export function derive_always(root, initial, calculate) /* forall<a,e> (root : root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_1_10038 = $std_core_hnd._open_none1(function(value /* root<1238> */ ) {
      return value;
    }, root);
   
  var x_10149 = $kokaine_reactive_internal_runtime.derive_by_inner(root_1_10038, initial, calculate, function(___wildcard_x120__39 /* 1237 */ , ___wildcard_x120__41 /* 1237 */ ) {
      return false;
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10074 /* kokaine/reactive/internal/model/memo<1237> */ ) {
      return _y_x10074;
    });
  }
  else {
    return x_10149;
  }
}
 
export function memo_fs_get(value) /* forall<a> (value : memo<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var value_0_10042 = $std_core_hnd._open_none1(function(value_1 /* memo<1268> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.memo_fs_get(value_0_10042);
}
 
export function create_effect(root, track, apply) /* forall<a,e> (root : root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> <kokaine/reactive/effects/signal-write,pure> disposer<e> */  {
   
  var root_0_10043 = $std_core_hnd._open_none1(function(value /* root<1309> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043, track, apply);
}
 
 
// monadic lift
export function _mlift_on_cleanup_10120(_pat) /* forall<e> (kokaine/reactive/internal/model/cleanup-registration<e>) -> exn () */  {
  return $std_core_types.Unit;
}
 
export function on_cleanup(root, cleanup) /* forall<e> (root : root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn () */  {
   
  var root_0_10046 = $std_core_hnd._open_none1(function(value /* root<1340> */ ) {
      return value;
    }, root);
   
  var x_10153 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1 /* kokaine/reactive/internal/model/cleanup-registration<1340> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}