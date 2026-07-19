// Koka generated module: kokaine/reactive/async/internal/host-turn, koka version: 3.2.4
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
// type host-turn-runner
export function Host_turn_runner(run_host_turn) /* forall<e,e1> (run-host-turn : forall<a> (() -> e a) -> e1 a) -> host-turn-runner<e,e1> */  {
  return run_host_turn;
}
 
// declarations
 
 
// Automatically generated. Retrieves the `run-host-turn` constructor field of the `:host-turn-runner` type.
export function host_turn_runner_fs_run_host_turn(_this) /* forall<e,e1,a> (host-turn-runner<e,e1>) -> ((() -> e a) -> e1 a) */  {
  return _this;
}
 
 
// monadic lift
export function host_turn_runner_fs__mlift_copy_10006(_c_x10002) /* forall<a,e,e1> ((() -> e a) -> e1 a) -> (forall<a> (() -> e a) -> e1 a) */  {
  return _c_x10002;
}
 
 
// monadic lift
export function host_turn_runner_fs__mlift_copy_10007(_c_x10003) /* forall<e,e1> (forall<a> (() -> e a) -> e1 a) -> host-turn-runner<e,e1> */  {
  return _c_x10003;
}
 
export function host_turn_runner_fs__copy(_this, run_host_turn) /* forall<e,e1> (host-turn-runner<e,e1>, run-host-turn : ? (forall<a> (() -> e a) -> e1 a)) -> host-turn-runner<e,e1> */  {
   
  if (run_host_turn !== undefined) {
    var x_10008 = run_host_turn;
  }
  else {
    if ($std_core_hnd._yielding()) {
      var x_10008 = $std_core_hnd.yield_extend(function(_c_x10002 /* (() -> 122 89) -> 123 89 */ ) {
        return _c_x10002;
      });
    }
    else {
      var _x0 = _this;
      var x_10008 = _x0;
    }
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10003 /* forall<a> (() -> 122 a) -> 123 a */ ) {
      return _c_x10003;
    });
  }
  else {
    return x_10008;
  }
}
 
export function host_turn_runner_fs_run(runner, action) /* forall<a,e,e1> (runner : host-turn-runner<e,e1>, action : () -> e a) -> e1 a */  {
  return runner(action);
}