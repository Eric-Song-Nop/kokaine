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
 
 
// Run `action` against `root` with both signal capabilities handled: reads are
// sampled (no dependency is recorded) and writes commit immediately. The
// effect row is the caller's `e` plus `exn`; `signal-read` and `signal-write`
// are discharged here.
//
// Gotcha: nothing read inside `dispatch` is tracked. Use `derive`,
// `create-effect`, or a live HTML binding when a value should react to
// changes.
export function dispatch(root, action) /* forall<a,e> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var inner_0 = $std_core_hnd._open_none1(function(value /* root<482> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_handlers.dispatch_handled(inner_0, action);
}
 
 
// monadic lift
export function _mlift_create_root_10114(_y_x10057) /* forall<a,e> ((kokaine/reactive/internal/model/root<e>, a)) -> <exn|e> (root<e>, a) */  {
  return $std_core_types.Tuple2(_y_x10057.fst, _y_x10057.snd);
}
 
 
// Create a reactive root and run `action` to build its initial signals,
// derivations, and effects. Returns the root together with the action's
// result. The action may write signals (`signal-write`) and perform the
// caller's effects `e`; the call itself can raise `exn`.
//
// Construction is atomic: all initial work stays queued until `action` returns
// and the first flush drains. If the action or any initial calculation fails,
// the unpublished root and everything it registered are retired before the
// exception propagates. Calling `create-root` from inside a derivation is
// rejected.
export function create_root(action) /* forall<a,e> (action : (root<e>) -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> (root<e>, a) */  {
   
  var x_10123 = $kokaine_reactive_internal_runtime.create_root(function(internal /* kokaine/reactive/internal/model/root<546> */ ) {
    return action(internal);
  });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10057 /* (kokaine/reactive/internal/model/root<546>, 545) */ ) {
      return $std_core_types.Tuple2(_y_x10057.fst, _y_x10057.snd);
    });
  }
  else {
    return $std_core_types.Tuple2(x_10123.fst, x_10123.snd);
  }
}
 
 
// Retire the root: finalize every owned effect, derivation, cleanup, and
// parked resource continuation. Idempotent. Raises `exn` (plus the caller's
// `e`, from cleanup actions).
//
// Gotcha: disposing from inside a running computation, flush, or batch of the
// same root throws; dispose from an outer turn instead.
export function root_fs_dispose(root) /* forall<e> (root : root<e>) -> <exn|e> () */  {
   
  var inner_0 = $std_core_hnd._open_none1(function(value /* root<573> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.root_fs_dispose(inner_0);
}
 
 
// Whether `root.dispose` has completed for this root. Total: no effects.
export function root_fs_is_disposed(root) /* forall<e> (root : root<e>) -> bool */  {
  var _x3 = root;
  return $kokaine_reactive_internal_bridge.runtime_root_is_disposed(_x3);
}
 
 
// Run a write-only `action` as one turn on `root`, then flush. The action has
// `signal-write` plus the caller's `e`; the call adds `exn`.
//
// Besides ordinary writes, `update` is the explicit recovery boundary: effects
// quarantined after an earlier failure are re-admitted and retried even when
// the action writes nothing new.
export function update(root, action) /* forall<a,e> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
   
  var inner_0 = $std_core_hnd._open_none1(function(value /* root<634> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.update(inner_0, action);
}
 
 
// monadic lift
export function _mlift_sample_10115(action, _y_x10061) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,kokaine/reactive/effects/signal-read|e> a */  {
  return $std_core_hnd._mask_at(_y_x10061, false, action);
}
 
 
// Run a read-only `action` on `root` and return its result. Reads are sampled
// (not tracked) and produce settled derived values; writes are not available.
// Effect row: the caller's `e` plus `exn`.
export function sample(root, action) /* forall<a,e> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <exn|e> a */  {
   
  var root_0_10011 = $std_core_hnd._open_none1(function(value /* root<670> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_handlers.dispatch_handled(root_0_10011, function() {
       
      var x_10127 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10061 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10061, false, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10127, false, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_signal_by_10116(_y_x10064) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn signal<a> */  {
  return _y_x10064;
}
 
 
// Create a writable signal owned by `root` with an explicit equality function.
// A write whose value `equals` the current one is dropped before anything is
// invalidated. Raises `exn` when called inside a derivation (pure plane) or on
// a retired root.
export function signal_by(root, initial, equals) /* forall<a,e> (root : root<e>, initial : a, equals : (a, a) -> bool) -> exn signal<a> */  {
   
  var root_0_10013 = $std_core_hnd._open_none1(function(value /* root<719> */ ) {
      return value;
    }, root);
   
  var x_10131 = $kokaine_reactive_internal_runtime.signal_by(root_0_10013, initial, equals);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10064 /* kokaine/reactive/internal/model/signal<718> */ ) {
      return _y_x10064;
    });
  }
  else {
    return x_10131;
  }
}
 
 
// monadic lift
export function _mlift_signal_10117(_y_x10065) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn signal<a> */  {
  return _y_x10065;
}
 
 
// Create a writable signal owned by `root`, using the implicit `(==)` for the
// value type to suppress equal writes. Raises `exn` when called inside a
// derivation or on a retired root.
//
// Read with `.get` (tracked inside derivations, effects, and live bindings),
// write with `.set` or `.modify`. Unlike Solid, a signal is one value, not a
// getter/setter pair.
export function signal(root, initial, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : root<e>, initial : a, ?(==) : (a, a) -> bool) -> exn signal<a> */  {
   
  var root_0_10013 = $std_core_hnd._open_none1(function(value /* root<831> */ ) {
      return value;
    }, root);
   
  var x_10135 = $kokaine_reactive_internal_runtime.signal_by(root_0_10013, initial, _implicit_fs__lp__eq__eq__rp_);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10065 /* kokaine/reactive/internal/model/signal<830> */ ) {
      return _y_x10065;
    });
  }
  else {
    return x_10135;
  }
}
 
 
// monadic lift
export function _mlift_signal_always_10118(_y_x10066) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn signal<a> */  {
  return _y_x10066;
}
 
 
// Create a signal whose every write is treated as a change, so writing the
// same value again still notifies dependents. Raises `exn` like `signal`.
export function signal_always(root, initial) /* forall<a,e> (root : root<e>, initial : a) -> exn signal<a> */  {
   
  var root_1_10019 = $std_core_hnd._open_none1(function(value /* root<867> */ ) {
      return value;
    }, root);
   
  var x_10139 = $kokaine_reactive_internal_runtime.signal_by(root_1_10019, initial, function(___wildcard_x134__29 /* 866 */ , ___wildcard_x134__31 /* 866 */ ) {
      return false;
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10066 /* kokaine/reactive/internal/model/signal<866> */ ) {
      return _y_x10066;
    });
  }
  else {
    return x_10139;
  }
}
 
 
// Read the current value. Effect: `signal-read`. Inside a derivation,
// `create-effect` track function, or live HTML binding this read is tracked:
// the rest of that computation after this exact read is captured and resumed
// when the signal changes. Elsewhere (for example under `dispatch` or
// `untrack`) it is a plain sample.
export function signal_fs_get(value) /* forall<a> (value : signal<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var value_0_10022 = $std_core_hnd._open_none1(function(value_1 /* signal<897> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10022);
}
 
 
// Replace the value. Effect: `signal-write`. An equal value (per the signal's
// equality) is ignored; otherwise dependents are invalidated and, outside a
// `batch`, flushed before `set` returns.
//
// Gotcha: writes are rejected at runtime inside a derivation calculator; write
// from a `create-effect` apply function, an event handler, or `update`.
export function signal_fs_set(value, next) /* forall<a> (value : signal<a>, next : a) -> kokaine/reactive/effects/signal-write () */  {
   
  var value_0_10023 = $std_core_hnd._open_none1(function(value_1 /* signal<925> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023, next);
}
 
 
// Replace the value with `update(current)`. Effect: `signal-write`. Same
// equality and flushing rules as `set`; `update` itself must be total.
export function signal_fs_modify(value, update_0) /* forall<a> (value : signal<a>, update : (a) -> a) -> kokaine/reactive/effects/signal-write () */  {
   
  var value_0_10025 = $std_core_hnd._open_none1(function(value_1 /* signal<955> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.signal_fs_modify(value_0_10025, update_0);
}
 
 
// Run `action` with settling deferred until it returns, then flush once. The
// action's row (`signal-write`, `pure`, and its own `e1`) passes through.
// Inside the batch, newly written values are immediately readable; only
// downstream effects and derivations wait. Batches nest, and the outermost one
// flushes. Host event delivery is already one batched turn.
export function batch(root, action) /* forall<a,e,e1> (root : root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a) -> <kokaine/reactive/effects/signal-write,pure|e1> a */  {
   
  var root_0_10027 = $std_core_hnd._open_none1(function(value /* root<997> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.batch(root_0_10027, action);
}
 
 
// Run `action` with tracked reads turned into samples: reads inside it do not
// become dependencies of the surrounding derivation, effect, or binding.
// Derived values read here are still settled first. The `signal-read`, `pure`,
// and `e` row passes through unchanged.
export function untrack(action) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <kokaine/reactive/effects/signal-read,pure|e> a */  {
  return $kokaine_reactive_internal_runtime.untrack(action);
}
 
 
// monadic lift
export function _mlift_derive_by_10119(_y_x10072) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10072;
}
 
 
// Create a read-only derived value (`memo<a>`) with an explicit publication
// equality. `calculate` may only read signals (`signal-read`, `pure`); it
// cannot write. Creating the memo needs `signal-write` because it schedules
// the first calculation. Read the result with `.get`.
//
// `initial` is the memo's value before its first calculation runs. The first
// calculation is scheduled, not run inline, so it happens on the next flush
// (for example when `create-root` finishes construction); a tracked or sampled
// `.get` settles the memo first and observes the calculated value. A new value
// equal to the previous one does not invalidate dependents.
export function derive_by(root, initial, calculate, equals) /* forall<a,e> (root : root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_0_10030 = $std_core_hnd._open_none1(function(value /* root<1082> */ ) {
      return value;
    }, root);
   
  var x_10143 = $kokaine_reactive_internal_runtime.derive_by_inner(root_0_10030, initial, calculate, equals);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10072 /* kokaine/reactive/internal/model/memo<1081> */ ) {
      return _y_x10072;
    });
  }
  else {
    return x_10143;
  }
}
 
 
// monadic lift
export function _mlift_derive_10120(_y_x10073) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10073;
}
 
 
// Create a read-only derived value from the current values of the signals and
// memos that `calculate` reads, using the implicit `(==)` to cut propagation
// when the result is unchanged. `calculate` has row `<signal-read,pure>`;
// creating the memo has `<signal-write,pure>`.
//
// Gotcha: unlike Solid's `createMemo(fn)`, `derive(root, initial, calc)` takes
// an explicit `initial` value (the value before the first calculation), and
// the result is read through `.get`, not by calling it. Derivations are
// stateless: to accumulate across updates, keep the state in a `signal` and
// update it from a `create-effect`.
export function derive(root, initial, calculate, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e> (root : root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, ?(==) : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_0_10030 = $std_core_hnd._open_none1(function(value /* root<1198> */ ) {
      return value;
    }, root);
   
  var x_10147 = $kokaine_reactive_internal_runtime.derive_by_inner(root_0_10030, initial, calculate, _implicit_fs__lp__eq__eq__rp_);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10073 /* kokaine/reactive/internal/model/memo<1197> */ ) {
      return _y_x10073;
    });
  }
  else {
    return x_10147;
  }
}
 
 
// monadic lift
export function _mlift_derive_always_10121(_y_x10074) /* forall<a> (kokaine/reactive/internal/model/memo<a>) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
  return _y_x10074;
}
 
 
// Like `derive`, but every recalculation publishes and notifies dependents,
// even when the new value equals the old one.
export function derive_always(root, initial, calculate) /* forall<a,e> (root : root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a) -> <kokaine/reactive/effects/signal-write,pure> memo<a> */  {
   
  var root_1_10038 = $std_core_hnd._open_none1(function(value /* root<1238> */ ) {
      return value;
    }, root);
   
  var x_10151 = $kokaine_reactive_internal_runtime.derive_by_inner(root_1_10038, initial, calculate, function(___wildcard_x211__39 /* 1237 */ , ___wildcard_x211__41 /* 1237 */ ) {
      return false;
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10074 /* kokaine/reactive/internal/model/memo<1237> */ ) {
      return _y_x10074;
    });
  }
  else {
    return x_10151;
  }
}
 
 
// Read a derived value. Effect: `signal-read`. The memo is settled first, so
// the value always reflects the current inputs. Inside a derivation, effect
// track function, or live binding the read is tracked, exactly like
// `signal/get`.
export function memo_fs_get(value) /* forall<a> (value : memo<a>) -> kokaine/reactive/effects/signal-read a */  {
   
  var value_0_10042 = $std_core_hnd._open_none1(function(value_1 /* memo<1268> */ ) {
      return value_1;
    }, value);
  return $kokaine_reactive_internal_runtime.memo_fs_get(value_0_10042);
}
 
 
// Create an effect owned by the current owner (the root or the enclosing
// effect/binding generation). `track` reads its inputs (`<signal-read,pure>`)
// and is the only part whose reads become dependencies; `apply` receives the
// tracked value and may write signals and perform the root's effects `e`
// (`<signal-write,pure|e>`). Creating the effect has `<signal-write,pure>`.
// Returns a disposer that finalizes the effect and everything it owns.
//
// Gotcha: reads inside `apply` are not tracked. Effects and derivations
// created inside `apply` are owned by that run and retired when the effect
// re-runs or is disposed. A failing `apply` is quarantined (the rest of the
// flush still runs and the first failure is rethrown afterwards); it runs
// again only when its inputs change or at an explicit `update`.
export function create_effect(root, track, apply) /* forall<a,e> (root : root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> <kokaine/reactive/effects/signal-write,pure> disposer<e> */  {
   
  var root_0_10043 = $std_core_hnd._open_none1(function(value_0 /* root<1309> */ ) {
      return value_0;
    }, root);
  return $kokaine_reactive_internal_runtime.create_effect_publication(root_0_10043, track, function(value /* 1308 */ ) {
      return $kokaine_reactive_internal_handlers.interpret_write(root_0_10043, function() {
          return apply(value);
        });
    });
}
 
 
// monadic lift
export function _mlift_on_cleanup_10122(_pat) /* forall<e> (kokaine/reactive/internal/model/cleanup-registration<e>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// Register `cleanup` with the current owner: it runs once, when that owner (an
// effect run, a dynamic region generation, or the root) is retired. `cleanup`
// may write signals and perform `e`; registration can raise `exn` (for example
// inside a derivation, where registration is rejected).
export function on_cleanup(root, cleanup) /* forall<e> (root : root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn () */  {
   
  var root_0_10046 = $std_core_hnd._open_none1(function(value /* root<1340> */ ) {
      return value;
    }, root);
   
  var x_10155 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1 /* kokaine/reactive/internal/model/cleanup-registration<1340> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}