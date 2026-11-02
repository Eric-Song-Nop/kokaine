// Koka generated module: kokaine/reactive/internal/resource, koka version: 3.2.9
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
import * as $std_core_unsafe from './std_core_unsafe.mjs';
 
// externals
 
// type declarations
 
 
// // runtime tag for the effect `:resource-park`
export var resource_park_fs__tag;
var resource_park_fs__tag = "resource-park@resource";
// type resource-k
export const Resource_done = null; // forall<e> resource-k<e>
export function Resource_parked(resource_finalizer) /* forall<e> (resource-finalizer : ref<global,maybe<() -> <div,exn|e> ()>>) -> resource-k<e> */  {
  return { resource_finalizer: resource_finalizer };
}
// type resource-park
export function _Hnd_resource_park(_cfc, _ctl_park_resource) /* forall<e,a> (int, hnd/clause0<(),resource-park,e,a>) -> resource-park<e,a> */  {
  return { _cfc: _cfc, _ctl_park_resource: _ctl_park_resource };
}
 
// declarations
 
export function cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return (value).value;
}
 
export function store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
 
// // Automatically generated. Retrieves the `@cfc` constructor field of the `:resource-park` type.
export function resource_park_fs__cfc(_this) /* forall<e,a> (resource-park<e,a>) -> int */  {
  return _this._cfc;
}
 
 
// // handler for the effect `:resource-park`
export function resource_park_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : resource-park<e,b>, ret : (res : a) -> e b, action : () -> <resource-park|e> a) -> e b */  {
  return $std_core_hnd._hhandle(resource_park_fs__tag, hnd, ret, action);
}
 
 
// // Automatically generated. Retrieves the `@ctl-park-resource` constructor field of the `:resource-park` type.
export function resource_park_fs__ctl_park_resource(_this) /* forall<e,a> (resource-park<e,a>) -> hnd/clause0<(),resource-park,e,a> */  {
  return _this._ctl_park_resource;
}
 
 
// // select `park-resource` operation out of effect `:resource-park`
export function park_resource_fs__select(hnd) /* forall<e,a> (hnd : resource-park<e,a>) -> hnd/clause0<(),resource-park,e,a> */  {
  return hnd._ctl_park_resource;
}
 
 
// // Call the `ctl park-resource` operation of the effect `:resource-park`
export function park_resource() /* () -> resource-park () */  {
   
  var ev_10036 = $std_core_hnd._evv_at(0);
  return ev_10036.hnd._ctl_park_resource(ev_10036.marker, ev_10036);
}
 
 
// // Automatically generated. Tests for the `Resource-done` constructor of the `:resource-k` type.
export function is_resource_done(resource_k) /* forall<e> (resource-k : resource-k<e>) -> bool */  {
  return (resource_k === null);
}
 
 
// // Automatically generated. Tests for the `Resource-parked` constructor of the `:resource-k` type.
export function is_resource_parked(resource_k) /* forall<e> (resource-k : resource-k<e>) -> bool */  {
  return (resource_k !== null);
}
 
 
// // monadic lift
export function _mlift_run_finalizer_10030(finalizer, _y_x10010) /* forall<e> (finalizer : () -> <div,exn|e> (), hnd/ev-index) -> <resource-park,div,exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10010, false, finalizer);
}
 
export function run_finalizer(finalizer) /* forall<e> (finalizer : () -> <div,exn|e> ()) -> <resource-park,div,exn|e> () */  {
   
  var x_10038 = $std_core_hnd._evv_index(resource_park_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10010 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10010, false, finalizer);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_10038, false, finalizer);
  }
}
 
 
// // monadic lift
export function _mlift_capture_resource_10031(_pat) /* forall<e> (resource-k<e>) -> <div,exn|e> () */  {
  return $std_core_types.Unit;
}
 
 
// // monadic lift
export function _mlift_capture_resource_10032(finalizer, _y_x10013) /* forall<e> (finalizer : () -> <div,exn|e> (), hnd/ev-index) -> <resource-park,div,exn|e> () */  {
  return $std_core_hnd._mask_at(_y_x10013, false, finalizer);
}
 
 
// // monadic lift
export function _mlift_capture_resource_10033(wild_0) /* forall<e> (wild@0 : ()) -> <div,exn,resource-park|e> resource-k<e> */  {
  return Resource_done;
}
 
export function capture_resource(finalizer) /* forall<e> (finalizer : () -> <div,exn|e> ()) -> resource-k<e> */  {
   
  var pending = cell($std_core_types.Nothing);
  return resource_park_fs__handle(_Hnd_resource_park(3, function(m /* hnd/marker<<div,exn|637>,resource-k<637>> */ , ___wildcard_x698__16 /* hnd/ev<resource-park> */ ) {
        return $std_core_hnd.yield_to(m, function(k /* (hnd/resume-result<(),resource-k<637>>) -> <div,exn|637> resource-k<637> */ ) {
             
            $std_core_hnd._open_none2(store, pending, $std_core_types.Just(function() {
                 
                var x_10044 = k($std_core_hnd.Finalize(Resource_done));
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_pat_2 /* resource-k<637> */ ) {
                    return $std_core_types.Unit;
                  });
                }
                else {
                  return $std_core_types.Unit;
                }
              }));
            return Resource_parked(pending);
          });
      }), function(_res /* resource-k<637> */ ) {
      return _res;
    }, function() {
       
      var x_1_10049 = $std_core_hnd.finally_prompt(function() {
           
          var x_2_10053 = $std_core_hnd._evv_index(resource_park_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10013 /* hnd/ev-index */ ) {
              return $std_core_hnd._mask_at(_y_x10013, false, finalizer);
            });
          }
          else {
            return $std_core_hnd._mask_at(x_2_10053, false, finalizer);
          }
        }, $std_core_hnd._open_at0($std_core_hnd._evv_index(resource_park_fs__tag), function() {
             
            var ev_10057 = $std_core_hnd._evv_at(0);
            return ev_10057.hnd._ctl_park_resource(ev_10057.marker, ev_10057);
          }));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild_0 /* () */ ) {
          return Resource_done;
        });
      }
      else {
        return Resource_done;
      }
    });
}
 
export function claim_resource(resource) /* forall<e> (resource : resource-k<e>) -> maybe<() -> <div,exn|e> ()> */  {
  if (resource === null) {
    return $std_core_types.Nothing;
  }
  else {
     
    var claimed = load(resource.resource_finalizer);
     
    store(resource.resource_finalizer, $std_core_types.Nothing);
    return claimed;
  }
}
 
 
// // Internal observability for ownership tests. This reports whether an aliased
// // resource still retains the parked continuation closure, not merely whether
// // that continuation is allowed to run.
export function resource_retains_finalizer(resource) /* forall<e> (resource : resource-k<e>) -> bool */  {
  if (resource === null) {
    return false;
  }
  else {
     
    var maybe_10005 = load(resource.resource_finalizer);
    return (maybe_10005 !== null);
  }
}
 
export function finalize_resource(resource) /* forall<e> (resource : resource-k<e>) -> <div,exn|e> () */  {
  var _x0 = $std_core_hnd._open_none1(function(resource_0 /* resource-k<751> */ ) {
      if (resource_0 === null) {
        return $std_core_types.Nothing;
      }
      else {
         
        var claimed = load(resource_0.resource_finalizer);
         
        store(resource_0.resource_finalizer, $std_core_types.Nothing);
        return claimed;
      }
    }, resource);
  if (_x0 === null) {
    return $std_core_types.Unit;
  }
  else {
    return _x0.value();
  }
}
 
 
// // monadic lift
export function _mlift_discard_resource_10034(_c_x10023) /* forall<e> (maybe<() -> <div,exn|e> ()>) -> bool */  {
  return (_c_x10023 !== null);
}
 
 
// // Explicit unregistration consumes the capability without entering its
// // parked finalizer. This is intentionally distinct from retirement: callers
// // can prove that a detached cleanup can never be observed again.
export function discard_resource(resource) /* forall<e> (resource : resource-k<e>) -> bool */  {
   
  if (resource === null) {
    var x_10060 = $std_core_types.Nothing;
  }
  else {
     
    var claimed = load(resource.resource_finalizer);
     
    store(resource.resource_finalizer, $std_core_types.Nothing);
    var x_10060 = claimed;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10023 /* maybe<() -> <div,exn|777> ()> */ ) {
      return (_c_x10023 !== null);
    });
  }
  else {
    return (x_10060 !== null);
  }
}