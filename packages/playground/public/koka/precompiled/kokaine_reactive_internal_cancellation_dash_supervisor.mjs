// Koka generated module: kokaine/reactive/internal/cancellation-supervisor, koka version: 3.2.4
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
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
 
// externals
 
// type declarations
// type cancellation-entry
export function Cancellation_entry(claim_cancellation) /* forall<a> (claim-cancellation : () -> maybe<a>) -> cancellation-entry<a> */  {
  return claim_cancellation;
}
// type cancellation-registration
export function Cancellation_registration(cancellation_node) /* forall<a> (cancellation-node : kokaine/internal/registry/registry-registration<cancellation-entry<a>>) -> cancellation-registration<a> */  {
  return cancellation_node;
}
// type cancellation-supervisor
export function Cancellation_supervisor(cancellation_registry) /* forall<a> (cancellation-registry : kokaine/internal/registry/registry<cancellation-entry<a>>) -> cancellation-supervisor<a> */  {
  return cancellation_registry;
}
 
// declarations
 
 
// Automatically generated. Retrieves the `claim-cancellation` constructor field of the `:cancellation-entry` type.
export function cancellation_entry_fs_claim_cancellation(_this) /* forall<a> (cancellation-entry<a>) -> (() -> maybe<a>) */  {
  return _this;
}
 
export function cancellation_entry_fs__copy(_this, claim_cancellation) /* forall<a> (cancellation-entry<a>, claim-cancellation : ? (() -> maybe<a>)) -> cancellation-entry<a> */  {
  if (claim_cancellation !== undefined) {
    var _x0 = claim_cancellation;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
 
// Automatically generated. Retrieves the `cancellation-registry` constructor field of the `:cancellation-supervisor` type.
export function cancellation_supervisor_fs_cancellation_registry(_this) /* forall<a> (cancellation-supervisor<a>) -> kokaine/internal/registry/registry<cancellation-entry<a>> */  {
  return _this;
}
 
export function cancellation_supervisor_fs__copy(_this, cancellation_registry) /* forall<a> (cancellation-supervisor<a>, cancellation-registry : ? (kokaine/internal/registry/registry<cancellation-entry<a>>)) -> cancellation-supervisor<a> */  {
  if (cancellation_registry !== undefined) {
    var _x1 = cancellation_registry;
  }
  else {
    var _x1 = _this;
  }
  return _x1;
}
 
 
// Automatically generated. Retrieves the `cancellation-node` constructor field of the `:cancellation-registration` type.
export function cancellation_registration_fs_cancellation_node(_this) /* forall<a> (cancellation-registration<a>) -> kokaine/internal/registry/registry-registration<cancellation-entry<a>> */  {
  return _this;
}
 
export function cancellation_registration_fs__copy(_this, cancellation_node) /* forall<a> (cancellation-registration<a>, cancellation-node : ? (kokaine/internal/registry/registry-registration<cancellation-entry<a>>)) -> cancellation-registration<a> */  {
  if (cancellation_node !== undefined) {
    var _x2 = cancellation_node;
  }
  else {
    var _x2 = _this;
  }
  return _x2;
}
 
export function new_cancellation_supervisor() /* forall<a> () -> cancellation-supervisor<a> */  {
  return $kokaine_internal_registry.new_registry();
}
 
 
// monadic lift
export function cancellation_supervisor_fs__mlift_register_10025(_c_x10015) /* forall<a> (kokaine/internal/registry/registry-registration<cancellation-entry<a>>) -> cancellation-registration<a> */  {
  return _c_x10015;
}
 
export function cancellation_supervisor_fs_register(supervisor, claim) /* forall<a> (supervisor : cancellation-supervisor<a>, claim : () -> maybe<a>) -> exn cancellation-registration<a> */  {
   
  var target_10003 = $std_core_hnd._open_none1(function(_this /* cancellation-supervisor<289> */ ) {
      return _this;
    }, supervisor);
   
  var _x3 = $std_core_hnd._open_none2($kokaine_internal_registry.registry_fs_try_insert, target_10003, claim);
  if (_x3 === null) {
    var x_10026 = $std_core_exn.$throw("cannot register with a sealed lifetime registry");
  }
  else {
    var x_10026 = _x3.value;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10015 /* kokaine/internal/registry/registry-registration<cancellation-entry<289>> */ ) {
      return _c_x10015;
    });
  }
  else {
    return x_10026;
  }
}
 
export function cancellation_registration_fs_unregister(registration) /* forall<a> (registration : cancellation-registration<a>) -> bool */  {
   
  var _x3 = registration;
  var maybe_10005 = $kokaine_internal_registry.registry_registration_fs_take(_x3);
  return (maybe_10005 !== null);
}
 
export function claim_cancellations(entries, actions) /* forall<a> (entries : list<cancellation-entry<a>>, actions : list<a>) -> div list<a> */  { tailcall: while(1)
{
  if (entries === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, actions);
  }
  else {
    var _x3 = entries.head();
    if (_x3 === null) {
      {
        // tail call
        entries = entries.tail;
        continue tailcall;
      }
    }
    else {
      {
        // tail call
        var _x4 = $std_core_types.Cons(_x3.value, actions);
        entries = entries.tail;
        actions = _x4;
        continue tailcall;
      }
    }
  }
}}
 
export function cancellation_supervisor_fs_claim_cancel(supervisor) /* forall<a> (supervisor : cancellation-supervisor<a>) -> maybe<list<a>> */  {
  var _x6 = supervisor;
  var _x5 = $kokaine_internal_registry.registry_fs_seal_detach(_x6);
  if (_x5 === null) {
    return $std_core_types.Nothing;
  }
  else {
    return $std_core_types.Just(claim_cancellations(_x5.value, $std_core_types.Nil));
  }
}
 
export function cancellation_supervisor_fs_is_canceled(supervisor) /* forall<a> (supervisor : cancellation-supervisor<a>) -> bool */  {
  return (supervisor.registry_is_sealed).value;
}
 
export function cancellation_supervisor_fs_count(supervisor) /* forall<a> (supervisor : cancellation-supervisor<a>) -> int */  {
  return (supervisor.registry_count).value;
}