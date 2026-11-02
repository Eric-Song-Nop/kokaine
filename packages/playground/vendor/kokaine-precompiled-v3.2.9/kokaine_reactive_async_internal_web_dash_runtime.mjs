// Koka generated module: kokaine/reactive/async/internal/web-runtime, koka version: 3.2.9
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
import * as $std_core_bytes from './std_core_bytes.mjs';
import * as $std_core_bslice from './std_core_bslice.mjs';
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
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_async_internal_web_dash_schedule from './kokaine_async_internal_web_dash_schedule.mjs';
import * as $kokaine_reactive_effects from './kokaine_reactive_effects.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_async_internal_host_dash_turn from './kokaine_reactive_async_internal_host_dash_turn.mjs';
import * as $kokaine_reactive_async_internal_runtime from './kokaine_reactive_async_internal_runtime.mjs';
 
// externals
 
// type declarations
 
// declarations
 
 
// // Every Web async family posts through this one queue. Turns accepted before
// // the next microtask drain share it; see `new-host-turn-coalescer`.
export var web_host_turns;
var web_host_turns = $kokaine_reactive_async_internal_host_dash_turn.new_host_turn_coalescer(function(turn /* () -> ui () */ ) {
   
  $kokaine_async_internal_web_dash_schedule.enqueue_microtask(turn);
  return true;
});
 
export function run_web_generation_async(root, action) /* (root : internal/model/root<ui>, action : () -> <pure,async/effects/async-await,async/effects/async-cancel,async/effects/async-ioc,async/effects/async-ownership,async/effects/discontinue,effects/signal-read,effects/signal-write,ui> ()) -> <pure,effects/signal-read,effects/signal-write,ui> () */  {
   
  var dispatcher = $std_core_hnd._open_none1(function(coalescer /* host-turn/host-turn-coalescer */ ) {
      return function(turn /* () -> ui () */ ) {
        return $kokaine_reactive_async_internal_host_dash_turn.host_turn_coalescer_fs_post(coalescer, turn);
      };
    }, web_host_turns);
  return $kokaine_reactive_async_internal_runtime.run_generation_async_with_host(root, dispatcher, function(run_action /* () -> <exn,ui> 71 */ ) {
      return run_action();
    }, action);
}