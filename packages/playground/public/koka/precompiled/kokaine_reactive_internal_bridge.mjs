// Koka generated module: kokaine/reactive/internal/bridge, koka version: 3.2.4
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
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
import * as $kokaine_reactive_internal_handlers from './kokaine_reactive_internal_handlers.mjs';
 
// externals
 
// type declarations
 
// declarations
 
export function runtime_dispatch(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, action);
}
 
export function runtime_create_root(action) /* forall<a,e> (action : (kokaine/reactive/internal/model/root<e>) -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> (kokaine/reactive/internal/model/root<e>, a) */  {
  return $kokaine_reactive_internal_runtime.create_root(action);
}
 
export function runtime_dispose_root(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> <exn|e> () */  {
  return $kokaine_reactive_internal_runtime.root_fs_dispose(root);
}
 
export function runtime_root_is_disposed(root) /* forall<e> (root : kokaine/reactive/internal/model/root<e>) -> bool */  {
  return $kokaine_reactive_internal_runtime.root_fs_is_disposed(root);
}
 
export function runtime_update(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_runtime.update(root, action);
}
 
 
// monadic lift
export function _mlift_runtime_sample_10030(action, _y_x10017) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,kokaine/reactive/effects/signal-read|e> a */  {
  return $std_core_hnd._mask_at(_y_x10017, false, action);
}
 
export function runtime_sample(root, action) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_internal_handlers.dispatch_handled(root, function() {
       
      var x_10032 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10017 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10017, false, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10032, false, action);
      }
    });
}
 
export function runtime_signal_by(root, initial, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, equals : (a, a) -> bool) -> exn kokaine/reactive/internal/model/signal<a> */  {
  return $kokaine_reactive_internal_runtime.signal_by(root, initial, equals);
}
 
export function runtime_signal_get(value) /* forall<a> (value : kokaine/reactive/internal/model/signal<a>) -> kokaine/reactive/effects/signal-read a */  {
  return $kokaine_reactive_internal_runtime.signal_fs_get(value);
}
 
export function runtime_signal_set(value, next) /* forall<a> (value : kokaine/reactive/internal/model/signal<a>, next : a) -> kokaine/reactive/effects/signal-write () */  {
  return $kokaine_reactive_internal_runtime.signal_fs_set(value, next);
}
 
export function runtime_signal_modify(value, update) /* forall<a> (value : kokaine/reactive/internal/model/signal<a>, update : (a) -> a) -> kokaine/reactive/effects/signal-write () */  {
  return $kokaine_reactive_internal_runtime.signal_fs_modify(value, update);
}
 
export function runtime_batch(root, action) /* forall<a,e,e1> (root : kokaine/reactive/internal/model/root<e>, action : () -> <kokaine/reactive/effects/signal-write,pure|e1> a) -> <kokaine/reactive/effects/signal-write,pure|e1> a */  {
  return $kokaine_reactive_internal_runtime.batch(root, action);
}
 
export function runtime_untrack(action) /* forall<a,e> (action : () -> <kokaine/reactive/effects/signal-read,pure|e> a) -> <kokaine/reactive/effects/signal-read,pure|e> a */  {
  return $kokaine_reactive_internal_runtime.untrack(action);
}
 
export function runtime_derive_by(root, initial, calculate, equals) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, initial : a, calculate : () -> <kokaine/reactive/effects/signal-read,pure> a, equals : (a, a) -> bool) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/memo<a> */  {
  return $kokaine_reactive_internal_runtime.derive_by_inner(root, initial, calculate, equals);
}
 
export function runtime_memo_get(value) /* forall<a> (value : kokaine/reactive/internal/model/memo<a>) -> kokaine/reactive/effects/signal-read a */  {
  return $kokaine_reactive_internal_runtime.memo_fs_get(value);
}
 
export function runtime_create_effect(root, track, apply) /* forall<a,e> (root : kokaine/reactive/internal/model/root<e>, track : () -> <kokaine/reactive/effects/signal-read,pure> a, apply : (value : a) -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> <kokaine/reactive/effects/signal-write,pure> kokaine/reactive/internal/model/disposer<e> */  {
  return $kokaine_reactive_internal_runtime.create_effect_inner(root, track, apply);
}
 
 
// monadic lift
export function _mlift_runtime_on_cleanup_10031(_pat) /* forall<e> (kokaine/reactive/internal/model/cleanup-registration<e>) -> exn () */  {
  return $std_core_types.Unit;
}
 
export function runtime_on_cleanup(root, cleanup) /* forall<e> (root : kokaine/reactive/internal/model/root<e>, cleanup : () -> <kokaine/reactive/effects/signal-write,pure|e> ()) -> exn () */  {
   
  var x_10036 = $kokaine_reactive_internal_runtime.register_cleanup(root, cleanup);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1 /* kokaine/reactive/internal/model/cleanup-registration<579> */ ) {
      return $std_core_types.Unit;
    });
  }
  else {
    return $std_core_types.Unit;
  }
}