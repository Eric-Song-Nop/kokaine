// Koka generated module: kokaine/internal/compat, koka version: 3.2.4
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
 
// declarations
 
 
// monadic lift
export function _mlift_capture_error_10004(_y_x10002) /* forall<a,e> (a) -> <exn|e> result<a,exception> */  {
  return $std_core_types.Ok(_y_x10002);
}
 
export function capture_error(action) /* forall<a,e> (action : () -> <exn|e> a) -> e error<a> */  {
  return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m /* hnd/marker<65,error<64>> */ , ___wildcard_x654__16 /* hnd/ev<exn> */ , x /* exception */ ) {
        return $std_core_hnd.yield_to_final(m, function(___wildcard_x654__45 /* (hnd/resume-result<10004,error<64>>) -> 65 error<64> */ ) {
            return $std_core_types.$Error(x);
          });
      }), function(_res /* error<64> */ ) {
      return _res;
    }, function() {
       
      var x_0_10006 = action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10002 /* 64 */ ) {
          return $std_core_types.Ok(_y_x10002);
        });
      }
      else {
        return $std_core_types.Ok(x_0_10006);
      }
    });
}