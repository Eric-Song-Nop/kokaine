// Koka generated module: kokaine/reactive/async/integration, koka version: 3.2.4
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
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $std_core from './std_core.mjs';
import * as $kokaine_reactive from './kokaine_reactive.mjs';
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_reactive_async_internal_host_dash_turn from './kokaine_reactive_async_internal_host_dash_turn.mjs';
import * as $kokaine_reactive_async_internal_runtime from './kokaine_reactive_async_internal_runtime.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
 
// externals
 
// type declarations
// type async-host-dispatcher
export function Async_host_dispatcher(internal_dispatcher) /* (internal-dispatcher : kokaine/reactive/async/internal/host-turn/host-turn-dispatcher) -> async-host-dispatcher */  {
  return internal_dispatcher;
}
 
// declarations
 
 
// Automatically generated. Retrieves the `internal-dispatcher` constructor field of the `:async-host-dispatcher` type.
export function async_host_dispatcher_fs_internal_dispatcher(_this) /* (async-host-dispatcher) -> kokaine/reactive/async/internal/host-turn/host-turn-dispatcher */  {
  return _this;
}
 
export function async_host_dispatcher_fs__copy(_this, internal_dispatcher) /* (async-host-dispatcher, internal-dispatcher : ? kokaine/reactive/async/internal/host-turn/host-turn-dispatcher) -> async-host-dispatcher */  {
  if (internal_dispatcher !== undefined) {
    var _x0 = internal_dispatcher;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
export function new_async_host_dispatcher(post_host_turn) /* (post-host-turn : (() -> ui ()) -> ui bool) -> async-host-dispatcher */  {
  return post_host_turn;
}
 
export function run_async_with_dispatcher(root, dispatcher, action) /* (root : kokaine/reactive/root<ui>, dispatcher : async-host-dispatcher, action : () -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> ()) -> <pure,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> () */  {
  return $kokaine_reactive_async_internal_runtime.run_generation_async_with_host($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
        return value;
      }, root), dispatcher, function(run_action /* () -> <exn,ui> 97 */ ) {
      return run_action();
    }, action);
}