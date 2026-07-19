// Koka generated module: kokaine/reactive/integration, koka version: 3.2.4
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
import * as $kokaine_reactive_integration_internal_lifetime_dash_scope from './kokaine_reactive_integration_internal_lifetime_dash_scope.mjs';
import * as $kokaine_reactive_integration_internal_provision from './kokaine_reactive_integration_internal_provision.mjs';
import * as $kokaine_reactive_integration_internal_reentry from './kokaine_reactive_integration_internal_reentry.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
 
// externals
 
// type declarations
// type lifetime-scope
export function Public_lifetime_scope(internal_lifetime_scope) /* forall<e> (internal-lifetime-scope : kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<e>) -> lifetime-scope<e> */  {
  return internal_lifetime_scope;
}
// type provision
export function Public_provision(internal_provision) /* forall<e> (internal-provision : kokaine/reactive/integration/internal/provision/provision<e>) -> provision<e> */  {
  return internal_provision;
}
// type provision-lease
export function Public_provision_lease(internal_provision_lease) /* forall<e> (internal-provision-lease : kokaine/reactive/integration/internal/provision/provision-lease<e>) -> provision-lease<e> */  {
  return internal_provision_lease;
}
// type reentry
export function Public_reentry(internal_reentry) /* forall<e> (internal-reentry : kokaine/reactive/integration/internal/reentry/reentry<e>) -> reentry<e> */  {
  return internal_reentry;
}
 
// declarations
 
 
// Automatically generated. Retrieves the `internal-lifetime-scope` constructor field of the `:lifetime-scope` type.
export function lifetime_scope_fs_internal_lifetime_scope(_this) /* forall<e> (lifetime-scope<e>) -> kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<e> */  {
  return _this;
}
 
export function lifetime_scope_fs__copy(_this, internal_lifetime_scope) /* forall<e> (lifetime-scope<e>, internal-lifetime-scope : ? (kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<e>)) -> lifetime-scope<e> */  {
  if (internal_lifetime_scope !== undefined) {
    var _x0 = internal_lifetime_scope;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
 
// Automatically generated. Retrieves the `internal-reentry` constructor field of the `:reentry` type.
export function reentry_fs_internal_reentry(reentry) /* forall<e> (reentry : reentry<e>) -> kokaine/reactive/integration/internal/reentry/reentry<e> */  {
  return reentry;
}
 
export function reentry_fs__copy(_this, internal_reentry) /* forall<e> (reentry<e>, internal-reentry : ? (kokaine/reactive/integration/internal/reentry/reentry<e>)) -> reentry<e> */  {
  if (internal_reentry !== undefined) {
    var _x1 = internal_reentry;
  }
  else {
    var _x1 = _this;
  }
  return _x1;
}
 
 
// Automatically generated. Retrieves the `internal-provision` constructor field of the `:provision` type.
export function provision_fs_internal_provision(provision) /* forall<e> (provision : provision<e>) -> kokaine/reactive/integration/internal/provision/provision<e> */  {
  return provision;
}
 
export function provision_fs__copy(_this, internal_provision) /* forall<e> (provision<e>, internal-provision : ? (kokaine/reactive/integration/internal/provision/provision<e>)) -> provision<e> */  {
  if (internal_provision !== undefined) {
    var _x2 = internal_provision;
  }
  else {
    var _x2 = _this;
  }
  return _x2;
}
 
 
// Automatically generated. Retrieves the `internal-provision-lease` constructor field of the `:provision-lease` type.
export function provision_lease_fs_internal_provision_lease(_this) /* forall<e> (provision-lease<e>) -> kokaine/reactive/integration/internal/provision/provision-lease<e> */  {
  return _this;
}
 
export function provision_lease_fs__copy(_this, internal_provision_lease) /* forall<e> (provision-lease<e>, internal-provision-lease : ? (kokaine/reactive/integration/internal/provision/provision-lease<e>)) -> provision-lease<e> */  {
  if (internal_provision_lease !== undefined) {
    var _x3 = internal_provision_lease;
  }
  else {
    var _x3 = _this;
  }
  return _x3;
}
 
export function unwrap_lifetime_scope(value) /* forall<e> (value : lifetime-scope<e>) -> kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<e> */  {
  return value;
}
 
export function unwrap_reentry(value) /* forall<e> (value : reentry<e>) -> kokaine/reactive/integration/internal/reentry/reentry<e> */  {
  return value;
}
 
export function unwrap_provision(value) /* forall<e> (value : provision<e>) -> kokaine/reactive/integration/internal/provision/provision<e> */  {
  return value;
}
 
export function unwrap_provision_lease(value) /* forall<e> (value : provision-lease<e>) -> kokaine/reactive/integration/internal/provision/provision-lease<e> */  {
  return value;
}
 
 
// monadic lift
export function _mlift_open_lifetime_scope_10041(_y_x10008) /* forall<e> (kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<e>) -> exn lifetime-scope<e> */  {
  return _y_x10008;
}
 
export function open_lifetime_scope(root) /* forall<e> (root : kokaine/reactive/root<e>) -> exn lifetime-scope<e> */  {
   
  var x_10045 = $kokaine_reactive_integration_internal_lifetime_dash_scope.open_lifetime_scope($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<429> */ ) {
      return value;
    }, root));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10008 /* kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<429> */ ) {
      return _y_x10008;
    });
  }
  else {
    return x_10045;
  }
}
 
export function with_lifetime_scope(root, scope, action) /* forall<a,e,e1> (root : kokaine/reactive/root<e1>, scope : lifetime-scope<e1>, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
  return $kokaine_reactive_integration_internal_lifetime_dash_scope.with_lifetime_scope($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<483> */ ) {
        return value;
      }, root), $std_core_hnd._open_none1(function(value_0 /* lifetime-scope<483> */ ) {
        return value_0;
      }, scope), action);
}
 
export function lifetime_scope_fs_dispose(scope) /* forall<e> (scope : lifetime-scope<e>) -> <exn|e> () */  {
  return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* lifetime-scope<518> */ ) {
      return value;
    }, scope));
}
 
 
// monadic lift
export function _mlift_capture_reentry_10042(_y_x10011) /* forall<e> (kokaine/reactive/integration/internal/reentry/reentry<e>) -> exn reentry<e> */  {
  return _y_x10011;
}
 
 
// Host callbacks capture the continuation generation which registered them.
// Work created during re-entry remains owned by that generation.
export function capture_reentry(root) /* forall<e> (root : kokaine/reactive/root<e>) -> exn reentry<e> */  {
   
  var x_10049 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<553> */ ) {
      return value;
    }, root));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10011 /* kokaine/reactive/integration/internal/reentry/reentry<553> */ ) {
      return _y_x10011;
    });
  }
  else {
    return x_10049;
  }
}
 
export function reenter(value, action) /* forall<a,e> (value : reentry<e>, action : () -> <kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,pure|e> a) -> <exn|e> a */  {
  return $kokaine_reactive_integration_internal_reentry.run_reentry($std_core_hnd._open_none1(function(value_0 /* reentry<590> */ ) {
        return value_0;
      }, value), action);
}
 
 
// monadic lift
export function _mlift_current_provision_10043(_y_x10013) /* forall<e> (maybe<kokaine/reactive/integration/internal/provision/provision<e>>) -> exn maybe<provision<e>> */  {
  if (_y_x10013 === null) {
    return $std_core_types.Nothing;
  }
  else {
    return $std_core_types.Just(_y_x10013.value);
  }
}
 
export function current_provision(root) /* forall<e> (root : kokaine/reactive/root<e>) -> exn maybe<provision<e>> */  {
   
  var x_10053 = $kokaine_reactive_integration_internal_provision.current_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<646> */ ) {
      return value;
    }, root));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10013 /* maybe<kokaine/reactive/integration/internal/provision/provision<646>> */ ) {
      if (_y_x10013 === null) {
        return $std_core_types.Nothing;
      }
      else {
        return $std_core_types.Just(_y_x10013.value);
      }
    });
  }
  else {
    if (x_10053 === null) {
      return $std_core_types.Nothing;
    }
    else {
      return $std_core_types.Just(x_10053.value);
    }
  }
}
 
 
// monadic lift
export function _mlift_open_provision_10044(_y_x10015) /* forall<e> (kokaine/reactive/integration/internal/provision/provision-lease<e>) -> exn provision-lease<e> */  {
  return _y_x10015;
}
 
export function open_provision(root) /* forall<e> (root : kokaine/reactive/root<e>) -> exn provision-lease<e> */  {
   
  var x_10057 = $kokaine_reactive_integration_internal_provision.open_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<683> */ ) {
      return value;
    }, root));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10015 /* kokaine/reactive/integration/internal/provision/provision-lease<683> */ ) {
      return _y_x10015;
    });
  }
  else {
    return x_10057;
  }
}
 
export function provision_lease_fs_provision(lease) /* forall<e> (lease : provision-lease<e>) -> provision<e> */  {
  var _x4 = lease;
  return _x4;
}
 
export function provision_fs_same(left, right) /* forall<e> (left : provision<e>, right : provision<e>) -> bool */  {
  var _x5 = left;
  var _x6 = right;
  return $kokaine_reactive_integration_internal_provision.provision_fs_same(_x5, _x6);
}
 
export function drain_provision(lease) /* forall<e> (lease : provision-lease<e>) -> <div,exn|e> () */  {
  return $kokaine_reactive_integration_internal_provision.drain_provision($std_core_hnd._open_none1(function(value /* provision-lease<786> */ ) {
      return value;
    }, lease));
}
 
export function promote_provision(lease) /* forall<e> (lease : provision-lease<e>) -> <div,exn|e> () */  {
  return $kokaine_reactive_integration_internal_provision.promote_provision($std_core_hnd._open_none1(function(value /* provision-lease<811> */ ) {
      return value;
    }, lease));
}
 
export function discard_provision(lease) /* forall<e> (lease : provision-lease<e>) -> <exn|e> () */  {
  return $kokaine_reactive_integration_internal_provision.discard_provision($std_core_hnd._open_none1(function(value /* provision-lease<836> */ ) {
      return value;
    }, lease));
}