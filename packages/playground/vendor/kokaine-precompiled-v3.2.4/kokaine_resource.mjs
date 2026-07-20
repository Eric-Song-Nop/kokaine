// Koka generated module: kokaine/resource, koka version: 3.2.4
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
import * as $kokaine_reactive_async from './kokaine_reactive_async.mjs';
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $kokaine_reactive_async_internal_runtime from './kokaine_reactive_async_internal_runtime.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $kokaine_reactive_internal_handlers from './kokaine_reactive_internal_handlers.mjs';
 
// externals
 
// type declarations
// type request-terminal
export function Request_succeeded(value) /* forall<a> (value : a) -> request-terminal<a> */  {
  return { _tag: 1, value: value };
}
export function Request_failed(error) /* forall<a> (error : exception) -> request-terminal<a> */  {
  return { _tag: 2, error: error };
}
export const Request_canceled = { _tag: 3 }; // forall<a> request-terminal<a>
// type resource-command
export function Refresh_command(revision) /* (revision : int) -> resource-command */  {
  return { _tag: 1, revision: revision };
}
export function Cancel_command(revision) /* (revision : int) -> resource-command */  {
  return { _tag: 2, revision: revision };
}
// type resource-state
export const Unresolved = { _tag: 1 }; // forall<a> resource-state<a>
export function Pending(previous) /* forall<a> (previous : maybe<a>) -> resource-state<a> */  {
  return { _tag: 2, previous: previous };
}
export function Ready(value) /* forall<a> (value : a) -> resource-state<a> */  {
  return { _tag: 3, value: value };
}
export function Failed(error, previous) /* forall<a> (error : exception, previous : maybe<a>) -> resource-state<a> */  {
  return { _tag: 4, error: error, previous: previous };
}
// type resource
export function Resource(resource_state_source, resource_control_source) /* forall<a,b> (resource-state-source : kokaine/reactive/signal<resource-state<b>>, resource-control-source : kokaine/reactive/signal<resource-command>) -> resource<a,b> */  {
  return { resource_state_source: resource_state_source, resource_control_source: resource_control_source };
}
// type resource-input
export function Resource_input(source, command) /* forall<a> (source : maybe<a>, command : resource-command) -> resource-input<a> */  {
  return { source: source, command: command };
}
 
// declarations
 
 
// Automatically generated. Tests for the `Unresolved` constructor of the `:resource-state` type.
export function is_unresolved(resource_state) /* forall<a> (resource-state : resource-state<a>) -> bool */  {
  return (resource_state._tag === 1);
}
 
 
// Automatically generated. Tests for the `Pending` constructor of the `:resource-state` type.
export function is_pending(resource_state) /* forall<a> (resource-state : resource-state<a>) -> bool */  {
  return (resource_state._tag === 2);
}
 
 
// Automatically generated. Tests for the `Ready` constructor of the `:resource-state` type.
export function is_ready(resource_state) /* forall<a> (resource-state : resource-state<a>) -> bool */  {
  return (resource_state._tag === 3);
}
 
 
// Automatically generated. Tests for the `Failed` constructor of the `:resource-state` type.
export function is_failed(resource_state) /* forall<a> (resource-state : resource-state<a>) -> bool */  {
  return (resource_state._tag === 4);
}
 
 
// Automatically generated. Retrieves the `revision` constructor field of the `:resource-command` type.
export function resource_command_fs_revision(_this) /* (resource-command) -> int */  {
  return (_this._tag === 1) ? _this.revision : _this.revision;
}
 
 
// Automatically generated. Tests for the `Refresh-command` constructor of the `:resource-command` type.
export function is_refresh_command(resource_command) /* (resource-command : resource-command) -> bool */  {
  return (resource_command._tag === 1);
}
 
 
// Automatically generated. Tests for the `Cancel-command` constructor of the `:resource-command` type.
export function is_cancel_command(resource_command) /* (resource-command : resource-command) -> bool */  {
  return (resource_command._tag === 2);
}
 
 
// Automatically generated. Retrieves the `command` constructor field of the `:resource-input` type.
export function resource_input_fs_command(_this) /* forall<a> (resource-input<a>) -> resource-command */  {
  return _this.command;
}
 
 
// Automatically generated. Retrieves the `source` constructor field of the `:resource-input` type.
export function resource_input_fs_source(_this) /* forall<a> (resource-input<a>) -> maybe<a> */  {
  return _this.source;
}
 
export function resource_input_fs__copy(_this, source, command) /* forall<a> (resource-input<a>, source : ? (maybe<a>), command : ? resource-command) -> resource-input<a> */  {
  if (source !== undefined) {
    var _x0 = source;
  }
  else {
    var _x0 = _this.source;
  }
  if (command !== undefined) {
    var _x1 = command;
  }
  else {
    var _x1 = _this.command;
  }
  return Resource_input(_x0, _x1);
}
 
 
// Automatically generated. Tests for the `Request-succeeded` constructor of the `:request-terminal` type.
export function is_request_succeeded(request_terminal) /* forall<a> (request-terminal : request-terminal<a>) -> bool */  {
  return (request_terminal._tag === 1);
}
 
 
// Automatically generated. Tests for the `Request-failed` constructor of the `:request-terminal` type.
export function is_request_failed(request_terminal) /* forall<a> (request-terminal : request-terminal<a>) -> bool */  {
  return (request_terminal._tag === 2);
}
 
 
// Automatically generated. Tests for the `Request-canceled` constructor of the `:request-terminal` type.
export function is_request_canceled(request_terminal) /* forall<a> (request-terminal : request-terminal<a>) -> bool */  {
  return (request_terminal._tag === 3);
}
 
 
// Automatically generated. Retrieves the `resource-state-source` constructor field of the `:resource` type.
export function resource_fs_resource_state_source(resource_0) /* forall<a,b> (resource : resource<a,b>) -> kokaine/reactive/signal<resource-state<b>> */  {
  return resource_0.resource_state_source;
}
 
 
// Automatically generated. Retrieves the `resource-control-source` constructor field of the `:resource` type.
export function resource_fs_resource_control_source(resource_0) /* forall<a,b> (resource : resource<a,b>) -> kokaine/reactive/signal<resource-command> */  {
  return resource_0.resource_control_source;
}
 
export function resource_fs__copy(_this, resource_state_source, resource_control_source) /* forall<a,b> (resource<a,b>, resource-state-source : ? (kokaine/reactive/signal<resource-state<b>>), resource-control-source : ? (kokaine/reactive/signal<resource-command>)) -> resource<a,b> */  {
  if (resource_state_source !== undefined) {
    var _x2 = resource_state_source;
  }
  else {
    var _x2 = _this.resource_state_source;
  }
  if (resource_control_source !== undefined) {
    var _x3 = resource_control_source;
  }
  else {
    var _x3 = _this.resource_control_source;
  }
  return Resource(_x2, _x3);
}
 
export function cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function cell_fs_read(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function cell_fs_write(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
export function resource_command_fs_is_refresh(command) /* (command : resource-command) -> bool */  {
  return (command._tag === 1);
}
 
export function same_source(left, right, equals) /* forall<a> (left : maybe<a>, right : maybe<a>, equals : (a, a) -> bool) -> bool */  {
  if (left === null && right === null) {
    return true;
  }
  else if (left !== null && right !== null) {
    return equals(left.value, right.value);
  }
  else {
    return false;
  }
}
 
export function source_changed(previous, current, equals) /* forall<a> (previous : maybe<maybe<a>>, current : maybe<a>, equals : (a, a) -> bool) -> bool */  {
  if (previous === null) {
    return true;
  }
  else {
     
    if (previous.value === null && current === null) {
      var b_10007 = true;
    }
    else if (previous.value !== null && current !== null) {
      var b_10007 = equals(previous.value.value, current.value);
    }
    else {
      var b_10007 = false;
    }
    return (b_10007) ? false : true;
  }
}
 
export function canceled_state(previous) /* forall<a> (previous : maybe<a>) -> resource-state<a> */  {
  if (previous === null) {
    return Unresolved;
  }
  else {
    return Ready(previous.value);
  }
}
 
export function take_lease_group(slot) /* (slot : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>) -> maybe<kokaine/reactive/async/internal/runtime/async-lease-group> */  {
   
  var current = slot.value;
   
  ((slot).value = ($std_core_types.Nothing));
  return current;
}
 
export function dispose_lease_group(current) /* (current : maybe<kokaine/reactive/async/internal/runtime/async-lease-group>) -> ui () */  {
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    var _x4 = $kokaine_internal_registry.registry_fs_seal_detach(current.value);
    if (_x4 === null) {
      return $std_core_types.Unit;
    }
    else {
       
      $kokaine_reactive_async_internal_runtime.account_async_lease_disposers(_x4.value);
      return $kokaine_reactive_async_internal_runtime.run_async_lease_disposers(_x4.value);
    }
  }
}
 
 
// monadic lift
export function _mlift_in_resource_ownership_10365(action, _y_x10083) /* forall<a> (action : () -> <kokaine/async/effects/async,ui,exn> a, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/async-ownership,ui,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue,exn> a */  {
  return $std_core_hnd._mask_at(_y_x10083, true, action);
}
 
 
// Keep loader-acquired host values under the Resource rather than the
// create-effect generation which happened to observe this request. The
// Resource can then retain a successful previous value across refresh while
// still retiring failed, canceled, replaced, or unreachable values exactly
// once.
export function in_resource_ownership(group, action) /* forall<a> (group : kokaine/reactive/async/internal/runtime/async-lease-group, action : () -> <kokaine/async/effects/async,ui,exn> a) -> <kokaine/async/effects/async,ui,exn> a */  {
  return $kokaine_async_effects.async_ownership_fs__handle($kokaine_async_effects._Hnd_async_ownership(1, $std_core_hnd.clause_tail1(function(dispose /* kokaine/async/effects/dispose-fn */ ) {
        return $std_core_hnd._open_none2($kokaine_reactive_async_internal_runtime.async_lease_group_fs_own, group, dispose);
      })), function(_res /* 1064 */ ) {
      return _res;
    }, function() {
       
      var x_10385 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10083 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10083, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10385, true, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_settle_active_request_10366(previous_ownership, wild___2) /* (previous-ownership : maybe<kokaine/reactive/async/internal/runtime/async-lease-group>, wild_@2 : ()) -> kokaine/reactive/effects/signal-write () */  {
  return $std_core_hnd._open_none1(dispose_lease_group, previous_ownership);
}
 
 
// monadic lift
export function _mlift_settle_active_request_10367(current_ownership, wild___3) /* (current-ownership : maybe<kokaine/reactive/async/internal/runtime/async-lease-group>, wild_@3 : ()) -> kokaine/reactive/effects/signal-write () */  {
  return $std_core_hnd._open_none1(dispose_lease_group, current_ownership);
}
 
 
// monadic lift
export function _mlift_settle_active_request_10368(current_ownership, wild___4) /* (current-ownership : maybe<kokaine/reactive/async/internal/runtime/async-lease-group>, wild_@4 : ()) -> kokaine/reactive/effects/signal-write () */  {
  return $std_core_hnd._open_none1(dispose_lease_group, current_ownership);
}
 
export function settle_active_request(state_source, request_active, latest_success, active_ownership, latest_ownership, terminal) /* forall<a> (state-source : kokaine/reactive/signal<resource-state<a>>, request-active : ref<global,bool>, latest-success : ref<global,maybe<a>>, active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, terminal : request-terminal<a>) -> <kokaine/reactive/effects/signal-write,ui> () */  {
   
  var _x_x1_10259 = request_active.value;
  var _x5 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_10259);
  if (_x5) {
    return $std_core_types.Unit;
  }
  else {
     
    ((request_active).value = false);
     
    var current_ownership = $std_core_hnd._open_none1(take_lease_group, active_ownership);
    if (terminal._tag === 1) {
       
      var previous_ownership = $std_core_hnd._open_none1(take_lease_group, latest_ownership);
       
      ((latest_ownership).value = current_ownership);
       
      ((latest_success).value = ($std_core_types.Just(terminal.value)));
       
      var value_0_10023 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<resource-state<1260>> */ ) {
          return value_1_0;
        }, state_source);
       
      var x_10389 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023, Ready(terminal.value));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___2 /* () */ ) {
          return $std_core_hnd._open_none1(dispose_lease_group, previous_ownership);
        });
      }
      else {
        return $std_core_hnd._open_none1(dispose_lease_group, previous_ownership);
      }
    }
    else if (terminal._tag === 2) {
       
      var next_0_10023 = Failed(terminal.error, latest_success.value);
       
      var value_0_10023_0 = $std_core_hnd._open_none1(function(value_1_1 /* kokaine/reactive/signal<resource-state<1260>> */ ) {
          return value_1_1;
        }, state_source);
       
      var x_0_10394 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023_0, next_0_10023);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___3 /* () */ ) {
          return $std_core_hnd._open_none1(dispose_lease_group, current_ownership);
        });
      }
      else {
        return $std_core_hnd._open_none1(dispose_lease_group, current_ownership);
      }
    }
    else {
       
      var _x_x1_6_10266 = latest_success.value;
       
      var next_1_10026 = $std_core_hnd._open_none1(function(previous /* maybe<1260> */ ) {
          if (previous === null) {
            return Unresolved;
          }
          else {
            return Ready(previous.value);
          }
        }, _x_x1_6_10266);
       
      var value_0_10023_1 = $std_core_hnd._open_none1(function(value_1_2 /* kokaine/reactive/signal<resource-state<1260>> */ ) {
          return value_1_2;
        }, state_source);
       
      var x_1_10399 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023_1, next_1_10026);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___4 /* () */ ) {
          return $std_core_hnd._open_none1(dispose_lease_group, current_ownership);
        });
      }
      else {
        return $std_core_hnd._open_none1(dispose_lease_group, current_ownership);
      }
    }
  }
}
 
export function settle_request(state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership, ownership, generation, terminal) /* forall<a> (state-source : kokaine/reactive/signal<resource-state<a>>, request-generation : ref<global,int>, request-active : ref<global,bool>, latest-success : ref<global,maybe<a>>, active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, ownership : kokaine/reactive/async/internal/runtime/async-lease-group, generation : int, terminal : request-terminal<a>) -> <kokaine/reactive/effects/signal-write,ui> () */  {
  var _x6 = $std_core_types._int_ne((request_generation.value),generation);
  if (_x6) {
    return $std_core_hnd._open_none1(function(group /* kokaine/reactive/async/internal/runtime/async-lease-group */ ) {
        var _x7 = $kokaine_internal_registry.registry_fs_seal_detach(group);
        if (_x7 === null) {
          return $std_core_types.Unit;
        }
        else {
           
          $kokaine_reactive_async_internal_runtime.account_async_lease_disposers(_x7.value);
          return $kokaine_reactive_async_internal_runtime.run_async_lease_disposers(_x7.value);
        }
      }, ownership);
  }
  else {
    return settle_active_request(state_source, request_active, latest_success, active_ownership, latest_ownership, terminal);
  }
}
 
 
// monadic lift
export function _mlift_clear_resource_10369(active, latest, wild___1) /* (active : maybe<kokaine/reactive/async/internal/runtime/async-lease-group>, latest : maybe<kokaine/reactive/async/internal/runtime/async-lease-group>, wild_@1 : ()) -> kokaine/reactive/effects/signal-write () */  {
  return $std_core_hnd.finally_prompt(function() {
      return $std_core_hnd._open_none1(dispose_lease_group, latest);
    }, $std_core_hnd._open_none1(dispose_lease_group, active));
}
 
export function clear_resource(state_source, request_active, latest_success, active_ownership, latest_ownership) /* forall<a> (state-source : kokaine/reactive/signal<resource-state<a>>, request-active : ref<global,bool>, latest-success : ref<global,maybe<a>>, active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>) -> <kokaine/reactive/effects/signal-write,ui> () */  {
   
  var active = $std_core_hnd._open_none1(take_lease_group, active_ownership);
   
  var latest = $std_core_hnd._open_none1(take_lease_group, latest_ownership);
   
  ((request_active).value = false);
   
  ((latest_success).value = ($std_core_types.Nothing));
   
  var value_0_10023 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<resource-state<1456>> */ ) {
      return value_1_0;
    }, state_source);
   
  var x_10406 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023, Unresolved);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
      return $std_core_hnd.finally_prompt(function() {
          return $std_core_hnd._open_none1(dispose_lease_group, latest);
        }, $std_core_hnd._open_none1(dispose_lease_group, active));
    });
  }
  else {
    return $std_core_hnd.finally_prompt(function() {
        return $std_core_hnd._open_none1(dispose_lease_group, latest);
      }, $std_core_hnd._open_none1(dispose_lease_group, active));
  }
}
 
 
// monadic lift
export function _mlift_start_request_10370(action_4, _y_x10099) /* forall<a> (action@4 : () -> <kokaine/async/effects/async,ui,exn> error<a>, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/async-ownership,ui,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue,exn> error<a> */  {
  return $std_core_hnd._mask_at(_y_x10099, true, action_4);
}
 
 
// monadic lift
export function _mlift_start_request_10371(active_ownership, generation, latest_ownership, latest_success, ownership, request_active, request_generation, state_source, outcome) /* forall<a> (active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, generation : int, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-success : ref<global,maybe<a>>, ownership : kokaine/reactive/async/internal/runtime/async-lease-group, request-active : ref<global,bool>, request-generation : ref<global,int>, state-source : kokaine/reactive/signal<resource-state<a>>, outcome : error<a>) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn,ui,kokaine/reactive/effects/signal-write,div,kokaine/reactive/effects/signal-read> () */  {
  if (outcome._tag === 2) {
    return $std_core_hnd._open_at0(7, function() {
        return settle_request(state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership, ownership, generation, Request_succeeded(outcome.value));
      });
  }
  else {
    return $std_core_hnd._open_at0(7, function() {
        return settle_request(state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership, ownership, generation, Request_failed(outcome.error));
      });
  }
}
 
 
// monadic lift
export function _mlift_start_request_10372(active_ownership, generation, latest_ownership, latest_success, load, ownership, request_active, request_generation, root, snapshot, state_source, _y_x10097) /* forall<a,b> (active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, generation : int, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-success : ref<global,maybe<a>>, load : (b) -> <kokaine/async/effects/async,ui,exn> a, ownership : kokaine/reactive/async/internal/runtime/async-lease-group, request-active : ref<global,bool>, request-generation : ref<global,int>, root : kokaine/reactive/root<ui>, snapshot : b, state-source : kokaine/reactive/signal<resource-state<a>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10097, false, function() {
       
      var inner_0_0 = $std_core_hnd._open_none1(function(value_3 /* kokaine/reactive/root<ui> */ ) {
          return value_3;
        }, root);
      return $kokaine_reactive_internal_handlers.dispatch_handled(inner_0_0, function() {
          return $kokaine_reactive_async_internal_runtime.run_generation_async($std_core_hnd._open_none1(function(value_4 /* kokaine/reactive/root<ui> */ ) {
                return value_4;
              }, root), function() {
               
              var x_10413 = $std_core_hnd._open2($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Cons(5, $std_core_types.Nil))))))), function(group /* kokaine/reactive/async/internal/runtime/async-lease-group */ , action_4 /* () -> <kokaine/async/effects/async,ui,exn> error<1708> */ ) {
                  return $kokaine_async_effects.async_ownership_fs__handle($kokaine_async_effects._Hnd_async_ownership(1, $std_core_hnd.clause_tail1(function(dispose /* kokaine/async/effects/dispose-fn */ ) {
                        return $std_core_hnd._open_none2($kokaine_reactive_async_internal_runtime.async_lease_group_fs_own, group, dispose);
                      })), function(_res /* error<1708> */ ) {
                      return _res;
                    }, function() {
                       
                      var x_0_10415 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
                      if ($std_core_hnd._yielding()) {
                        return $std_core_hnd.yield_extend(function(_y_x10099 /* hnd/ev-index */ ) {
                          return $std_core_hnd._mask_at(_y_x10099, true, action_4);
                        });
                      }
                      else {
                        return $std_core_hnd._mask_at(x_0_10415, true, action_4);
                      }
                    });
                }, ownership, function() {
                  return $kokaine_internal_compat.capture_error(function() {
                    return $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Cons(5, $std_core_types.Nil))))))), load, snapshot);
                  });
                });
              if ($std_core_hnd._yielding()) {
                var _x8 = $std_core_hnd.yield_extend(function(outcome /* error<1708> */ ) {
                  return _mlift_start_request_10371(active_ownership, generation, latest_ownership, latest_success, ownership, request_active, request_generation, state_source, outcome);
                });
              }
              else {
                var _x8 = _mlift_start_request_10371(active_ownership, generation, latest_ownership, latest_success, ownership, request_active, request_generation, state_source, x_10413);
              }
              return $std_core_hnd.finally_prompt(function() {
                  return $std_core_hnd._open_at0(7, function() {
                      return settle_request(state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership, ownership, generation, Request_canceled);
                    });
                }, _x8);
            });
        });
    });
}
 
 
// monadic lift
export function _mlift_start_request_10373(active_ownership, generation, latest_ownership, latest_success, load, ownership, request_active, request_generation, root, snapshot, state_source, superseded_ownership, wild___1) /* forall<a,b> (active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, generation : int, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-success : ref<global,maybe<a>>, load : (b) -> <kokaine/async/effects/async,ui,exn> a, ownership : kokaine/reactive/async/internal/runtime/async-lease-group, request-active : ref<global,bool>, request-generation : ref<global,int>, root : kokaine/reactive/root<ui>, snapshot : b, state-source : kokaine/reactive/signal<resource-state<a>>, superseded-ownership : maybe<kokaine/reactive/async/internal/runtime/async-lease-group>, wild_@1 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_10422 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    var _x9 = $std_core_hnd.yield_extend(function(_y_x10097 /* hnd/ev-index */ ) {
      return _mlift_start_request_10372(active_ownership, generation, latest_ownership, latest_success, load, ownership, request_active, request_generation, root, snapshot, state_source, _y_x10097);
    });
  }
  else {
    var _x9 = _mlift_start_request_10372(active_ownership, generation, latest_ownership, latest_success, load, ownership, request_active, request_generation, root, snapshot, state_source, x_10422);
  }
  return $std_core_hnd.finally_prompt(function() {
      return $std_core_hnd._open_none1(dispose_lease_group, superseded_ownership);
    }, _x9);
}
 
export function start_request(root, state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership, generation, snapshot, load) /* forall<a,b> (root : kokaine/reactive/root<ui>, state-source : kokaine/reactive/signal<resource-state<a>>, request-generation : ref<global,int>, request-active : ref<global,bool>, latest-success : ref<global,maybe<a>>, active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, generation : int, snapshot : b, load : (b) -> <kokaine/async/effects/async,ui,exn> a) -> <kokaine/reactive/effects/signal-write,pure,ui> () */  {
   
  var superseded_ownership = $std_core_hnd._open_none1(take_lease_group, active_ownership);
   
  var ownership = $std_core_hnd._open_none0(function() {
    return $kokaine_internal_registry.new_registry();
  });
   
  ((active_ownership).value = ($std_core_types.Just(ownership)));
   
  ((request_active).value = true);
   
  var _x_x2_10278 = Pending(latest_success.value);
   
  var x_10424 = $std_core_hnd._open_at2(1, function(value_1 /* kokaine/reactive/signal<resource-state<1708>> */ , next_0 /* resource-state<1708> */ ) {
       
      var value_0_10023 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<resource-state<1708>> */ ) {
          return value_1_0;
        }, value_1);
      return $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023, next_0);
    }, state_source, _x_x2_10278);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
      return _mlift_start_request_10373(active_ownership, generation, latest_ownership, latest_success, load, ownership, request_active, request_generation, root, snapshot, state_source, superseded_ownership, wild___1);
    });
  }
  else {
     
    var x_0_10430 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
    if ($std_core_hnd._yielding()) {
      var _x10 = $std_core_hnd.yield_extend(function(_y_x10097 /* hnd/ev-index */ ) {
        return _mlift_start_request_10372(active_ownership, generation, latest_ownership, latest_success, load, ownership, request_active, request_generation, root, snapshot, state_source, _y_x10097);
      });
    }
    else {
      var _x10 = _mlift_start_request_10372(active_ownership, generation, latest_ownership, latest_success, load, ownership, request_active, request_generation, root, snapshot, state_source, x_0_10430);
    }
    return $std_core_hnd.finally_prompt(function() {
        return $std_core_hnd._open_none1(dispose_lease_group, superseded_ownership);
      }, _x10);
  }
}
 
export function retire_resource(state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership) /* forall<a> (state-source : kokaine/reactive/signal<resource-state<a>>, request-generation : ref<global,int>, request-active : ref<global,bool>, latest-success : ref<global,maybe<a>>, active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>) -> <kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_10208 = request_generation.value;
   
  var value_10207 = $std_core_types._int_add(x_10208,1);
   
  ((request_generation).value = value_10207);
  return clear_resource(state_source, request_active, latest_success, active_ownership, latest_ownership);
}
 
export function apply_input(root, state_source, last_source, last_command_revision, request_generation, request_active, latest_success, active_ownership, latest_ownership, equals, load, input) /* forall<a,b> (root : kokaine/reactive/root<ui>, state-source : kokaine/reactive/signal<resource-state<a>>, last-source : ref<global,maybe<maybe<b>>>, last-command-revision : ref<global,int>, request-generation : ref<global,int>, request-active : ref<global,bool>, latest-success : ref<global,maybe<a>>, active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, equals : (b, b) -> bool, load : (b) -> <kokaine/async/effects/async,ui,exn> a, input : resource-input<b>) -> <kokaine/reactive/effects/signal-write,pure,ui> () */  {
   
  var _x_x1_10314 = last_source.value;
   
  var changed = $std_core_hnd._open_none3(function(previous /* maybe<maybe<2063>> */ , current /* maybe<2063> */ , equals_0 /* (2063, 2063) -> bool */ ) {
      if (previous === null) {
        return true;
      }
      else {
         
        if (previous.value === null && current === null) {
          var b_10042 = true;
        }
        else if (previous.value !== null && current !== null) {
          var b_10042 = equals_0(previous.value.value, current.value);
        }
        else {
          var b_10042 = false;
        }
        return (b_10042) ? false : true;
      }
    }, _x_x1_10314, input.source, equals);
   
  var command_changed = $std_core_types._int_ne((last_command_revision.value),($std_core_hnd._open_none1(function(_this /* resource-command */ ) {
      return (_this._tag === 1) ? _this.revision : _this.revision;
    }, input.command)));
   
  ((last_source).value = ($std_core_types.Just(input.source)));
   
  var value_2_10218 = $std_core_hnd._open_none1(function(_this_0 /* resource-command */ ) {
      return (_this_0._tag === 1) ? _this_0.revision : _this_0.revision;
    }, input.command);
   
  ((last_command_revision).value = value_2_10218);
   
  var x_10220 = request_generation.value;
   
  var generation = $std_core_types._int_add(x_10220,1);
   
  ((request_generation).value = generation);
  if (input.source === null) {
    if (changed) {
      return $std_core_hnd._open_at0(1, function() {
          return clear_resource(state_source, request_active, latest_success, active_ownership, latest_ownership);
        });
    }
    else {
      if (command_changed) {
        return $std_core_hnd._open_at0(1, function() {
            return clear_resource(state_source, request_active, latest_success, active_ownership, latest_ownership);
          });
      }
      else {
        return $std_core_types.Unit;
      }
    }
  }
  else {
    if (command_changed) {
       
      var _x_x1_4_10329 = $std_core_hnd._open_none1(function(command_0 /* resource-command */ ) {
          return (command_0._tag === 1);
        }, input.command);
      var _x11 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
          return (b_0) ? false : true;
        }, _x_x1_4_10329);
      if (_x11) {
        return $std_core_hnd._open_at0(1, function() {
            return settle_active_request(state_source, request_active, latest_success, active_ownership, latest_ownership, Request_canceled);
          });
      }
      else {
        if (changed) {
          return start_request(root, state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership, generation, input.source.value, load);
        }
        else {
          if (command_changed) {
            var _x12 = $std_core_hnd._open_none1(function(command_1 /* resource-command */ ) {
                return (command_1._tag === 1);
              }, input.command);
            if (_x12) {
              return start_request(root, state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership, generation, input.source.value, load);
            }
            else {
              return $std_core_types.Unit;
            }
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }
    }
    else {
      if (changed) {
        return start_request(root, state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership, generation, input.source.value, load);
      }
      else {
        if (command_changed) {
          var _x13 = $std_core_hnd._open_none1(function(command_2 /* resource-command */ ) {
              return (command_2._tag === 1);
            }, input.command);
          if (_x13) {
            return start_request(root, state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership, generation, input.source.value, load);
          }
          else {
            return $std_core_types.Unit;
          }
        }
        else {
          return $std_core_types.Unit;
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_resource_by_10374(_pat_9) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_resource_by_10375(control_source, state_source, wild__) /* forall<a,b> (control-source : kokaine/reactive/signal<resource-command>, state-source : kokaine/reactive/signal<resource-state<a>>, wild_ : ()) -> <exn,div,kokaine/reactive/effects/signal-write> resource<b,a> */  {
  return Resource(state_source, control_source);
}
 
 
// monadic lift
export function _mlift_resource_by_10376(_y_x10140, _y_x10142) /* forall<a> (maybe<a>, resource-command) -> <kokaine/reactive/effects/signal-read,div,exn> resource-input<a> */  {
  return Resource_input(_y_x10140, _y_x10142);
}
 
 
// monadic lift
export function _mlift_resource_by_10377(control_source, _y_x10140) /* forall<a> (control-source : kokaine/reactive/signal<resource-command>, maybe<a>) -> <kokaine/reactive/effects/signal-read,div,exn> resource-input<a> */  {
   
  var x_10432 = $std_core_hnd._open_at1(1, function(value_11 /* kokaine/reactive/signal<resource-command> */ ) {
       
      var value_0_10022 = $std_core_hnd._open_none1(function(value_1_1 /* kokaine/reactive/signal<resource-command> */ ) {
          return value_1_1;
        }, value_11);
      return $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10022);
    }, control_source);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10142 /* resource-command */ ) {
      return Resource_input(_y_x10140, _y_x10142);
    });
  }
  else {
    return Resource_input(_y_x10140, x_10432);
  }
}
 
 
// monadic lift
export function _mlift_resource_by_10378(active_ownership, control_source, latest_ownership, latest_success, request_active, request_generation, root, state_source, _y_x10144) /* forall<a,b> (active-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, control-source : kokaine/reactive/signal<resource-command>, latest-ownership : ref<global,maybe<kokaine/reactive/async/internal/runtime/async-lease-group>>, latest-success : ref<global,maybe<a>>, request-active : ref<global,bool>, request-generation : ref<global,int>, root : kokaine/reactive/root<ui>, state-source : kokaine/reactive/signal<resource-state<a>>, kokaine/reactive/internal/model/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> resource<b,a> */  {
   
  var x_10436 = $std_core_hnd._open_at2(0, function(root_4 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value_12 /* kokaine/reactive/root<ui> */ ) {
          return value_12;
        }, root_4);
       
      var x_0_10438 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_resource_by_10374);
      }
      else {
        return $std_core_types.Unit;
      }
    }, root, function() {
      return $std_core_hnd._open_at0(1, function() {
          return retire_resource(state_source, request_generation, request_active, latest_success, active_ownership, latest_ownership);
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return Resource(state_source, control_source);
    });
  }
  else {
    return Resource(state_source, control_source);
  }
}
 
 
// monadic lift
export function _mlift_resource_by_10379(control_source, equals, load, root, state_source, _y_x10138) /* forall<_e,a,b> (control-source : kokaine/reactive/signal<resource-command>, equals : (b, b) -> bool, load : (b) -> <kokaine/async/effects/async,ui,exn> a, root : kokaine/reactive/root<ui>, state-source : kokaine/reactive/signal<resource-state<a>>, kokaine/reactive/internal/model/memo<maybe<b>>) -> <kokaine/reactive/effects/signal-write,pure> resource<b,a> */  {
   
  var last_source = { value: ($std_core_types.Nothing) };
   
  var last_command_revision = { value: (-1) };
   
  var request_generation = { value: 0 };
   
  var request_active = { value: false };
   
  var latest_success = { value: ($std_core_types.Nothing) };
   
  var active_ownership = { value: ($std_core_types.Nothing) };
   
  var latest_ownership = { value: ($std_core_types.Nothing) };
   
  var root_0_10043 = $std_core_hnd._open_none1(function(value_9 /* kokaine/reactive/root<ui> */ ) {
      return value_9;
    }, root);
   
  var x_10443 = $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043, function() {
       
      var x_0_10445 = $std_core_hnd._open_at1(1, function(value_10 /* kokaine/reactive/memo<maybe<2467>> */ ) {
           
          var value_0_10042 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/memo<maybe<2467>> */ ) {
              return value_1_0;
            }, value_10);
          return $kokaine_reactive_internal_runtime.memo_fs_get(value_0_10042);
        }, _y_x10138);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10140 /* maybe<2467> */ ) {
          return _mlift_resource_by_10377(control_source, _y_x10140);
        });
      }
      else {
        return _mlift_resource_by_10377(control_source, x_0_10445);
      }
    }, function(input /* resource-input<2467> */ ) {
      return apply_input(root, state_source, last_source, last_command_revision, request_generation, request_active, latest_success, active_ownership, latest_ownership, equals, load, input);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10144 /* kokaine/reactive/internal/model/disposer<ui> */ ) {
      return _mlift_resource_by_10378(active_ownership, control_source, latest_ownership, latest_success, request_active, request_generation, root, state_source, _y_x10144);
    });
  }
  else {
    return _mlift_resource_by_10378(active_ownership, control_source, latest_ownership, latest_success, request_active, request_generation, root, state_source, x_10443);
  }
}
 
 
// monadic lift
export function _mlift_resource_by_10380(_y_x10136) /* (kokaine/reactive/internal/model/signal<resource-command>) -> exn kokaine/reactive/signal<resource-command> */  {
  return _y_x10136;
}
 
 
// monadic lift
export function _mlift_resource_by_10381(equals, load, root, source, state_source, control_source) /* forall<_e,a,b> (equals : (b, b) -> bool, load : (b) -> <kokaine/async/effects/async,ui,exn> a, root : kokaine/reactive/root<ui>, source : () -> kokaine/reactive/effects/signal-read maybe<b>, state-source : kokaine/reactive/signal<resource-state<a>>, control-source : kokaine/reactive/signal<resource-command>) -> <exn,div,kokaine/reactive/effects/signal-write> resource<b,a> */  {
   
  var root_0_10030 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/root<ui> */ ) {
      return value_1;
    }, root);
   
  var x_10447 = $kokaine_reactive_internal_runtime.derive_by_inner(root_0_10030, $std_core_types.Nothing, function() {
      return $std_core_hnd._open_at0(1, source);
    }, function(left_0 /* maybe<2467> */ , right_0 /* maybe<2467> */ ) {
      if (left_0 === null && right_0 === null) {
        return true;
      }
      else if (left_0 !== null && right_0 !== null) {
        return equals(left_0.value, right_0.value);
      }
      else {
        return false;
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10138 /* kokaine/reactive/internal/model/memo<maybe<2467>> */ ) {
      return _mlift_resource_by_10379(control_source, equals, load, root, state_source, _y_x10138);
    });
  }
  else {
    return _mlift_resource_by_10379(control_source, equals, load, root, state_source, x_10447);
  }
}
 
 
// monadic lift
export function _mlift_resource_by_10382(_y_x10134) /* forall<a> (kokaine/reactive/internal/model/signal<resource-state<a>>) -> exn kokaine/reactive/signal<resource-state<a>> */  {
  return _y_x10134;
}
 
 
// monadic lift
export function _mlift_resource_by_10383(equals, load, root, source, state_source) /* forall<_e,a,b> (equals : (b, b) -> bool, load : (b) -> <kokaine/async/effects/async,ui,exn> a, root : kokaine/reactive/root<ui>, source : () -> kokaine/reactive/effects/signal-read maybe<b>, state-source : kokaine/reactive/signal<resource-state<a>>) -> <exn,div,kokaine/reactive/effects/signal-write> resource<b,a> */  {
   
  var x_10449 = $std_core_hnd._open_at3(0, function(root_1 /* kokaine/reactive/root<ui> */ , initial_0 /* resource-command */ , equals_0 /* (resource-command, resource-command) -> bool */ ) {
       
      var root_0_10013 = $std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
          return value_0;
        }, root_1);
       
      var x_0_10451 = $kokaine_reactive_internal_runtime.signal_by(root_0_10013, initial_0, equals_0);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_resource_by_10380);
      }
      else {
        return x_0_10451;
      }
    }, root, Refresh_command(0), function(left /* resource-command */ , right /* resource-command */ ) {
      var _x14 = (left._tag === 1) ? left.revision : left.revision;
      var _x15 = (right._tag === 1) ? right.revision : right.revision;
      return $std_core_types._int_eq(_x14,_x15);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(control_source /* kokaine/reactive/signal<resource-command> */ ) {
      return _mlift_resource_by_10381(equals, load, root, source, state_source, control_source);
    });
  }
  else {
    return _mlift_resource_by_10381(equals, load, root, source, state_source, x_10449);
  }
}
 
export function resource_by(root, source, load, equals) /* forall<a,b> (root : kokaine/reactive/root<ui>, source : () -> kokaine/reactive/effects/signal-read maybe<b>, load : (b) -> <kokaine/async/effects/async,ui,exn> a, equals : (b, b) -> bool) -> <kokaine/reactive/effects/signal-write,pure> resource<b,a> */  {
   
  var x_10453 = $std_core_hnd._open_at2(0, function(root_0 /* kokaine/reactive/root<ui> */ , initial /* resource-state<2466> */ ) {
       
      var root_1_10019 = $std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root_0);
       
      var x_0_10456 = $kokaine_reactive_internal_runtime.signal_by(root_1_10019, initial, function(___wildcard_x87__29 /* resource-state<2466> */ , ___wildcard_x87__31 /* resource-state<2466> */ ) {
          return false;
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10134 /* kokaine/reactive/internal/model/signal<resource-state<2466>> */ ) {
          return _y_x10134;
        });
      }
      else {
        return x_0_10456;
      }
    }, root, Unresolved);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(state_source /* kokaine/reactive/signal<resource-state<2466>> */ ) {
      return _mlift_resource_by_10383(equals, load, root, source, state_source);
    });
  }
  else {
     
    var x_1_10459 = $std_core_hnd._open_at3(0, function(root_1 /* kokaine/reactive/root<ui> */ , initial_0 /* resource-command */ , equals_0 /* (resource-command, resource-command) -> bool */ ) {
         
        var root_0_10013 = $std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
            return value_0;
          }, root_1);
         
        var x_2_10462 = $kokaine_reactive_internal_runtime.signal_by(root_0_10013, initial_0, equals_0);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(_mlift_resource_by_10380);
        }
        else {
          return x_2_10462;
        }
      }, root, Refresh_command(0), function(left /* resource-command */ , right /* resource-command */ ) {
        var _x14 = (left._tag === 1) ? left.revision : left.revision;
        var _x15 = (right._tag === 1) ? right.revision : right.revision;
        return $std_core_types._int_eq(_x14,_x15);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(control_source /* kokaine/reactive/signal<resource-command> */ ) {
        return _mlift_resource_by_10381(equals, load, root, source, x_10453, control_source);
      });
    }
    else {
       
      var root_0_10030 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/root<ui> */ ) {
          return value_1;
        }, root);
       
      var x_3_10464 = $kokaine_reactive_internal_runtime.derive_by_inner(root_0_10030, $std_core_types.Nothing, function() {
          return $std_core_hnd._open_at0(1, source);
        }, function(left_0 /* maybe<2467> */ , right_0 /* maybe<2467> */ ) {
          if (left_0 === null && right_0 === null) {
            return true;
          }
          else if (left_0 !== null && right_0 !== null) {
            return equals(left_0.value, right_0.value);
          }
          else {
            return false;
          }
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10138 /* kokaine/reactive/internal/model/memo<maybe<2467>> */ ) {
          return _mlift_resource_by_10379(x_1_10459, equals, load, root, x_10453, _y_x10138);
        });
      }
      else {
         
        var last_source = { value: ($std_core_types.Nothing) };
         
        var last_command_revision = { value: (-1) };
         
        var request_generation = { value: 0 };
         
        var request_active = { value: false };
         
        var latest_success = { value: ($std_core_types.Nothing) };
         
        var active_ownership = { value: ($std_core_types.Nothing) };
         
        var latest_ownership = { value: ($std_core_types.Nothing) };
         
        var root_0_10043 = $std_core_hnd._open_none1(function(value_9 /* kokaine/reactive/root<ui> */ ) {
            return value_9;
          }, root);
         
        var x_4_10467 = $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043, function() {
             
            var x_5_10470 = $std_core_hnd._open_at1(1, function(value_10 /* kokaine/reactive/memo<maybe<2467>> */ ) {
                 
                var value_0_10042 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/memo<maybe<2467>> */ ) {
                    return value_1_0;
                  }, value_10);
                return $kokaine_reactive_internal_runtime.memo_fs_get(value_0_10042);
              }, x_3_10464);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10140 /* maybe<2467> */ ) {
                return _mlift_resource_by_10377(x_1_10459, _y_x10140);
              });
            }
            else {
              return _mlift_resource_by_10377(x_1_10459, x_5_10470);
            }
          }, function(input /* resource-input<2467> */ ) {
            return apply_input(root, x_10453, last_source, last_command_revision, request_generation, request_active, latest_success, active_ownership, latest_ownership, equals, load, input);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10144 /* kokaine/reactive/internal/model/disposer<ui> */ ) {
            return _mlift_resource_by_10378(active_ownership, x_1_10459, latest_ownership, latest_success, request_active, request_generation, root, x_10453, _y_x10144);
          });
        }
        else {
           
          var x_6_10472 = $std_core_hnd._open_at2(0, function(root_4 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
               
              var root_0_10046 = $std_core_hnd._open_none1(function(value_12 /* kokaine/reactive/root<ui> */ ) {
                  return value_12;
                }, root_4);
               
              var x_7_10475 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(_mlift_resource_by_10374);
              }
              else {
                return $std_core_types.Unit;
              }
            }, root, function() {
              return $std_core_hnd._open_at0(1, function() {
                  return retire_resource(x_10453, request_generation, request_active, latest_success, active_ownership, latest_ownership);
                });
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
              return Resource(x_10453, x_1_10459);
            });
          }
          else {
            return Resource(x_10453, x_1_10459);
          }
        }
      }
    }
  }
}
 
export function resource(root, source, load, _implicit_fs__lp__eq__eq__rp_) /* forall<a,b> (root : kokaine/reactive/root<ui>, source : () -> kokaine/reactive/effects/signal-read maybe<b>, load : (b) -> <kokaine/async/effects/async,ui,exn> a, ?(==) : (b, b) -> bool) -> <kokaine/reactive/effects/signal-write,pure> resource<b,a> */  {
  return resource_by(root, source, load, _implicit_fs__lp__eq__eq__rp_);
}
 
export function resource_fs_state(value) /* forall<a,b> (value : resource<b,a>) -> kokaine/reactive/effects/signal-read resource-state<a> */  {
   
  var value_0_10022 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/signal<resource-state<2625>> */ ) {
      return value_1;
    }, value.resource_state_source);
  return $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10022);
}
 
 
// monadic lift
export function resource_fs__mlift_latest_10384(_y_x10151) /* forall<a> (resource-state<a>) -> kokaine/reactive/effects/signal-read maybe<a> */  {
  if (_y_x10151._tag === 1) {
    return $std_core_types.Nothing;
  }
  else if (_y_x10151._tag === 2) {
    return _y_x10151.previous;
  }
  else if (_y_x10151._tag === 3) {
    return $std_core_types.Just(_y_x10151.value);
  }
  else {
    return _y_x10151.previous;
  }
}
 
export function resource_fs_latest(value) /* forall<a,b> (value : resource<b,a>) -> kokaine/reactive/effects/signal-read maybe<a> */  {
   
  var value_0_10022 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<resource-state<2687>> */ ) {
      return value_1_0;
    }, value.resource_state_source);
   
  var x_10480 = $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10022);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10151 /* resource-state<2687> */ ) {
      if (_y_x10151._tag === 1) {
        return $std_core_types.Nothing;
      }
      else if (_y_x10151._tag === 2) {
        return _y_x10151.previous;
      }
      else if (_y_x10151._tag === 3) {
        return $std_core_types.Just(_y_x10151.value);
      }
      else {
        return _y_x10151.previous;
      }
    });
  }
  else {
    if (x_10480._tag === 1) {
      return $std_core_types.Nothing;
    }
    else if (x_10480._tag === 2) {
      return x_10480.previous;
    }
    else if (x_10480._tag === 3) {
      return $std_core_types.Just(x_10480.value);
    }
    else {
      return x_10480.previous;
    }
  }
}
 
export function resource_fs_refresh(value) /* forall<a,b> (value : resource<b,a>) -> kokaine/reactive/effects/signal-write () */  {
   
  var value_0_10025 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/signal<resource-command> */ ) {
      return value_1;
    }, value.resource_control_source);
  return $kokaine_reactive_internal_runtime.signal_fs_modify(value_0_10025, function(command /* resource-command */ ) {
      var _x14 = (command._tag === 1) ? command.revision : command.revision;
      return Refresh_command($std_core_types._int_add(_x14,1));
    });
}
 
export function resource_fs_cancel(value) /* forall<a,b> (value : resource<b,a>) -> kokaine/reactive/effects/signal-write () */  {
   
  var value_0_10025 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/signal<resource-command> */ ) {
      return value_1;
    }, value.resource_control_source);
  return $kokaine_reactive_internal_runtime.signal_fs_modify(value_0_10025, function(command /* resource-command */ ) {
      var _x15 = (command._tag === 1) ? command.revision : command.revision;
      return Cancel_command($std_core_types._int_add(_x15,1));
    });
}