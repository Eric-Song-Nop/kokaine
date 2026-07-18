// Koka generated module: kokaine/async/structured, koka version: 3.2.4
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
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_async_channel from './kokaine_async_channel.mjs';
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $kokaine_internal_registry from './kokaine_internal_registry.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
 
// externals
 
// type declarations
// type group-outcome
export function Group_values(values) /* forall<a> (values : list<(int, a)>) -> group-outcome<a> */  {
  return { _tag: 1, values: values };
}
export function Group_exception(error) /* forall<a> (error : exception) -> group-outcome<a> */  {
  return { _tag: 2, error: error };
}
export const Group_canceled = { _tag: 3 }; // forall<a> group-outcome<a>
export function Group_finalized($yield) /* forall<a> (yield : hnd/yield-info) -> group-outcome<a> */  {
  return { _tag: 4, $yield: $yield };
}
// type group-owned
export function Group_owned(group_owned_index, group_owned_discard) /* (group-owned-index : int, group-owned-discard : ref<global,maybe<kokaine/async/effects/dispose-fn>>) -> group-owned */  {
  return { group_owned_index: group_owned_index, group_owned_discard: group_owned_discard };
}
// type group-owned-registration
export function Group_owned_registration(registration_node, registration_discard) /* (registration-node : maybe<kokaine/internal/registry/registry-registration<group-owned>>, registration-discard : ref<global,maybe<kokaine/async/effects/dispose-fn>>) -> group-owned-registration */  {
  return { registration_node: registration_node, registration_discard: registration_discard };
}
// type group-state
export function Group_state(active, outcome, owned) /* forall<a> (active : int, outcome : group-outcome<a>, owned : kokaine/internal/registry/registry<group-owned>) -> group-state<a> */  {
  return { active: active, outcome: outcome, owned: owned };
}
// type ownership-guard
export function Ownership_guard(disposer) /* (disposer : ref<global,maybe<kokaine/async/effects/dispose-fn>>) -> ownership-guard */  {
  return disposer;
}
// type strand-group
export function Strand_group(state, require_all) /* forall<a> (state : ref<global,group-state<a>>, require-all : bool) -> strand-group<a> */  {
  return { state: state, require_all: require_all };
}
// type strand-outcome
export function Strand_value(value) /* forall<a> (value : a) -> strand-outcome<a> */  {
  return { _tag: 1, value: value };
}
export function Strand_exception(error) /* forall<a> (error : exception) -> strand-outcome<a> */  {
  return { _tag: 2, error: error };
}
export const Strand_canceled = { _tag: 3 }; // forall<a> strand-outcome<a>
export function Strand_finalized($yield) /* forall<a> (yield : hnd/yield-info) -> strand-outcome<a> */  {
  return { _tag: 4, $yield: $yield };
}
 
// declarations
 
 
// Automatically generated. Tests for the `Strand-value` constructor of the `:strand-outcome` type.
export function is_strand_value(strand_outcome) /* forall<a> (strand-outcome : strand-outcome<a>) -> bool */  {
  return (strand_outcome._tag === 1);
}
 
 
// Automatically generated. Tests for the `Strand-exception` constructor of the `:strand-outcome` type.
export function is_strand_exception(strand_outcome) /* forall<a> (strand-outcome : strand-outcome<a>) -> bool */  {
  return (strand_outcome._tag === 2);
}
 
 
// Automatically generated. Tests for the `Strand-canceled` constructor of the `:strand-outcome` type.
export function is_strand_canceled(strand_outcome) /* forall<a> (strand-outcome : strand-outcome<a>) -> bool */  {
  return (strand_outcome._tag === 3);
}
 
 
// Automatically generated. Tests for the `Strand-finalized` constructor of the `:strand-outcome` type.
export function is_strand_finalized(strand_outcome) /* forall<a> (strand-outcome : strand-outcome<a>) -> bool */  {
  return (strand_outcome._tag === 4);
}
 
 
// Automatically generated. Tests for the `Group-values` constructor of the `:group-outcome` type.
export function is_group_values(group_outcome) /* forall<a> (group-outcome : group-outcome<a>) -> bool */  {
  return (group_outcome._tag === 1);
}
 
 
// Automatically generated. Tests for the `Group-exception` constructor of the `:group-outcome` type.
export function is_group_exception(group_outcome) /* forall<a> (group-outcome : group-outcome<a>) -> bool */  {
  return (group_outcome._tag === 2);
}
 
 
// Automatically generated. Tests for the `Group-canceled` constructor of the `:group-outcome` type.
export function is_group_canceled(group_outcome) /* forall<a> (group-outcome : group-outcome<a>) -> bool */  {
  return (group_outcome._tag === 3);
}
 
 
// Automatically generated. Tests for the `Group-finalized` constructor of the `:group-outcome` type.
export function is_group_finalized(group_outcome) /* forall<a> (group-outcome : group-outcome<a>) -> bool */  {
  return (group_outcome._tag === 4);
}
 
 
// Automatically generated. Retrieves the `group-owned-index` constructor field of the `:group-owned` type.
export function group_owned_fs_group_owned_index(_this) /* (group-owned) -> int */  {
  return _this.group_owned_index;
}
 
 
// Automatically generated. Retrieves the `group-owned-discard` constructor field of the `:group-owned` type.
export function group_owned_fs_group_owned_discard(_this) /* (group-owned) -> ref<global,maybe<kokaine/async/effects/dispose-fn>> */  {
  return _this.group_owned_discard;
}
 
export function group_owned_fs__copy(_this, group_owned_index, group_owned_discard) /* (group-owned, group-owned-index : ? int, group-owned-discard : ? (ref<global,maybe<kokaine/async/effects/dispose-fn>>)) -> group-owned */  {
  if (group_owned_index !== undefined) {
    var _x0 = group_owned_index;
  }
  else {
    var _x0 = _this.group_owned_index;
  }
  if (group_owned_discard !== undefined) {
    var _x1 = group_owned_discard;
  }
  else {
    var _x1 = _this.group_owned_discard;
  }
  return Group_owned(_x0, _x1);
}
 
 
// Automatically generated. Retrieves the `registration-node` constructor field of the `:group-owned-registration` type.
export function group_owned_registration_fs_registration_node(_this) /* (group-owned-registration) -> maybe<kokaine/internal/registry/registry-registration<group-owned>> */  {
  return _this.registration_node;
}
 
 
// Automatically generated. Retrieves the `registration-discard` constructor field of the `:group-owned-registration` type.
export function group_owned_registration_fs_registration_discard(_this) /* (group-owned-registration) -> ref<global,maybe<kokaine/async/effects/dispose-fn>> */  {
  return _this.registration_discard;
}
 
export function group_owned_registration_fs__copy(_this, registration_node, registration_discard) /* (group-owned-registration, registration-node : ? (maybe<kokaine/internal/registry/registry-registration<group-owned>>), registration-discard : ? (ref<global,maybe<kokaine/async/effects/dispose-fn>>)) -> group-owned-registration */  {
  if (registration_node !== undefined) {
    var _x2 = registration_node;
  }
  else {
    var _x2 = _this.registration_node;
  }
  if (registration_discard !== undefined) {
    var _x3 = registration_discard;
  }
  else {
    var _x3 = _this.registration_discard;
  }
  return Group_owned_registration(_x2, _x3);
}
 
 
// Automatically generated. Retrieves the `active` constructor field of the `:group-state` type.
export function group_state_fs_active(_this) /* forall<a> (group-state<a>) -> int */  {
  return _this.active;
}
 
 
// Automatically generated. Retrieves the `outcome` constructor field of the `:group-state` type.
export function group_state_fs_outcome(_this) /* forall<a> (group-state<a>) -> group-outcome<a> */  {
  return _this.outcome;
}
 
 
// Automatically generated. Retrieves the `owned` constructor field of the `:group-state` type.
export function group_state_fs_owned(_this) /* forall<a> (group-state<a>) -> kokaine/internal/registry/registry<group-owned> */  {
  return _this.owned;
}
 
export function group_state_fs__copy(_this, active, outcome, owned) /* forall<a> (group-state<a>, active : ? int, outcome : ? (group-outcome<a>), owned : ? (kokaine/internal/registry/registry<group-owned>)) -> group-state<a> */  {
  if (active !== undefined) {
    var _x4 = active;
  }
  else {
    var _x4 = _this.active;
  }
  if (outcome !== undefined) {
    var _x5 = outcome;
  }
  else {
    var _x5 = _this.outcome;
  }
  if (owned !== undefined) {
    var _x6 = owned;
  }
  else {
    var _x6 = _this.owned;
  }
  return Group_state(_x4, _x5, _x6);
}
 
 
// Automatically generated. Retrieves the `require-all` constructor field of the `:strand-group` type.
export function strand_group_fs_require_all(_this) /* forall<a> (strand-group<a>) -> bool */  {
  return _this.require_all;
}
 
 
// Automatically generated. Retrieves the `state` constructor field of the `:strand-group` type.
export function strand_group_fs_state(_this) /* forall<a> (strand-group<a>) -> ref<global,group-state<a>> */  {
  return _this.state;
}
 
export function strand_group_fs__copy(_this, state, require_all) /* forall<a> (strand-group<a>, state : ? (ref<global,group-state<a>>), require-all : ? bool) -> strand-group<a> */  {
  if (state !== undefined) {
    var _x7 = state;
  }
  else {
    var _x7 = _this.state;
  }
  if (require_all !== undefined) {
    var _x8 = require_all;
  }
  else {
    var _x8 = _this.require_all;
  }
  return Strand_group(_x7, _x8);
}
 
 
// Automatically generated. Retrieves the `disposer` constructor field of the `:ownership-guard` type.
export function ownership_guard_fs_disposer(_this) /* (ownership-guard) -> ref<global,maybe<kokaine/async/effects/dispose-fn>> */  {
  return _this;
}
 
export function ownership_guard_fs__copy(_this, disposer) /* (ownership-guard, disposer : ? (ref<global,maybe<kokaine/async/effects/dispose-fn>>)) -> ownership-guard */  {
  if (disposer !== undefined) {
    var _x9 = disposer;
  }
  else {
    var _x9 = _this;
  }
  return _x9;
}
 
export function group_cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function group_load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function group_store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
export function new_ownership_guard(dispose) /* (dispose : kokaine/async/effects/dispose-fn) -> ownership-guard */  {
  return { value: ($std_core_types.Just(dispose)) };
}
 
export function ownership_guard_fs_retire(guard) /* (guard : ownership-guard) -> ui () */  {
   
  var current = guard.value;
   
  ((guard).value = ($std_core_types.Nothing));
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    return current.value();
  }
}
 
export function ownership_guard_fs_accept(guard) /* (guard : ownership-guard) -> () */  {
  return ((guard).value = ($std_core_types.Nothing));
}
 
export function ownership_guard_fs_as_disposer(guard) /* (guard : ownership-guard) -> kokaine/async/effects/dispose-fn */  {
  return function() {
    return ownership_guard_fs_retire(guard);
  };
}
 
 
// monadic lift
export function _mlift_release_ownership_10298(_c_x10100) /* (()) -> bool */  {
  return true;
}
 
export function release_ownership(release, guard) /* (release : kokaine/async/effects/ownership-release-fn, guard : ownership-guard) -> ui bool */  {
  var _x10 = release();
  if (_x10) {
     
    var x_10323 = ((guard).value = ($std_core_types.Nothing));
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_release_ownership_10298);
    }
    else {
      return true;
    }
  }
  else {
    return false;
  }
}
 
export function discard_ownership(release, guard) /* (release : kokaine/async/effects/ownership-release-fn, guard : ownership-guard) -> ui () */  {
   
  var _pat = release();
  return ownership_guard_fs_retire(guard);
}
 
export function ownership_discard_capability(release, guard) /* (release : kokaine/async/effects/ownership-release-fn, guard : ownership-guard) -> kokaine/async/effects/dispose-fn */  {
  return function() {
     
    var _pat = release();
    return ownership_guard_fs_retire(guard);
  };
}
 
export function group_lift_div(action) /* forall<a,e> (action : () -> e a) -> <div|e> a */  {
  return action();
}
 
 
// monadic lift
export function _mlift_group_lift_exn_10299(action, _y_x10103) /* forall<a,e> (action : () -> e a, hnd/ev-index) -> <exn|e> a */  {
  return $std_core_hnd._mask_at(_y_x10103, false, action);
}
 
export function group_lift_exn(action) /* forall<a,e> (action : () -> e a) -> <exn|e> a */  {
   
  var x_10327 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10103 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10103, false, action);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_10327, false, action);
  }
}
 
export function new_strand_group(require_all) /* forall<a> (require-all : bool) -> strand-group<a> */  {
   
  var value_10025 = Group_state(0, Group_values($std_core_types.Nil), $kokaine_internal_registry.new_registry());
  return Strand_group({ value: value_10025 }, require_all);
}
 
export function _trmc_ordered_insert(values, entry, _acc) /* forall<a> (values : list<(int, a)>, entry : (int, a), ctx<list<(int, a)>>) -> list<(int, a)> */  { tailcall: while(1)
{
  if (values !== null) {
    var _x11 = values.head.fst;
    var _x12 = entry.fst;
    if ($std_core_types._int_lt(_x11,_x12)){
       
      var _trmc_x10092 = undefined;
       
      var _trmc_x10093 = $std_core_types.Cons(values.head, _trmc_x10092);
      {
        // tail call
        var _x13 = $std_core_types._cctx_extend(_acc,_trmc_x10093,({obj: _trmc_x10093, field_name: "tail"}));
        values = values.tail;
        _acc = _x13;
        continue tailcall;
      }
    }
  }
  return $std_core_types._cctx_apply(_acc,($std_core_types.Cons(entry, values)));
}}
 
export function ordered_insert(values_0, entry_0) /* forall<a> (values : list<(int, a)>, entry : (int, a)) -> list<(int, a)> */  {
  return _trmc_ordered_insert(values_0, entry_0, $std_core_types._cctx_empty());
}
 
export function group_outcome_fs_add(current, index, outcome, require_all) /* forall<a> (current : group-outcome<a>, index : int, outcome : strand-outcome<a>, require-all : bool) -> group-outcome<a> */  {
  if (require_all) {
    if (outcome._tag === 1) {
      if (current._tag === 1) {
        return Group_values(_trmc_ordered_insert(current.values, $std_core_types.Tuple2(index, outcome.value), $std_core_types._cctx_empty()));
      }
      else {
        return current;
      }
    }
    else if (outcome._tag === 2) {
      return Group_exception(outcome.error);
    }
    else if (outcome._tag === 4) {
      return Group_finalized(outcome.$yield);
    }
    else {
      return (current._tag === 1) ? Group_canceled : current;
    }
  }
  else {
    if (outcome._tag === 2) {
      return Group_exception(outcome.error);
    }
    else if (outcome._tag === 4) {
      return Group_finalized(outcome.$yield);
    }
    else if (outcome._tag === 1) {
      if (current._tag === 1 && current.values === null) {
        return Group_values($std_core_types.Cons($std_core_types.Tuple2(index, outcome.value), $std_core_types.Nil));
      }
      else {
        return current;
      }
    }
    else {
      return (current._tag === 1 && current.values === null) ? Group_canceled : current;
    }
  }
}
 
export function group_outcome_fs_resume(current) /* forall<a> (current : group-outcome<a>) -> <kokaine/async/effects/async,exn> list<a> */  {
  if (current._tag === 1) {
    return $std_core_list.map(current.values, $std_core_types.tuple2_fs_snd);
  }
  else if (current._tag === 2) {
    return $std_core_hnd._open_at1(5, $std_core_exn.untry, $std_core_types.$Error(current.error));
  }
  else if (current._tag === 3) {
    return $std_core_hnd._open_at0(4, function() {
         
        var ev_10334 = $std_core_hnd._evv_at(0);
        var _x14 = $kokaine_async_effects.discontinue_fs__select(ev_10334.hnd);
        return _x14(ev_10334.marker, ev_10334);
      });
  }
  else {
    return $std_core_hnd.unsafe_reyield(current.$yield);
  }
}
 
export function group_outcome_fs_keeps_owned(current, index, require_all) /* forall<a> (current : group-outcome<a>, index : int, require-all : bool) -> bool */  {
  if (current._tag === 1) {
    if (require_all) {
      return true;
    }
    else {
      return $std_core_list.any(current.values, function(entry /* (int, 1759) */ ) {
          var _x15 = entry.fst;
          return $std_core_types._int_eq(_x15,index);
        });
    }
  }
  else {
    return false;
  }
}
 
export function strand_group_fs_active(group) /* forall<a> (group : strand-group<a>) -> bool */  {
   
  var _this_10031 = (group.state).value;
  var _x16 = _this_10031.active;
  return $std_core_types._int_gt(_x16,0);
}
 
export function strand_group_fs_start(group) /* forall<a> (group : strand-group<a>) -> () */  {
  var _x17 = (group.state).value;
   
  var value_0_10037 = Group_state($std_core_types._int_add((_x17.active),1), _x17.outcome, _x17.owned);
  return (((group.state)).value = value_0_10037);
}
 
export function strand_group_fs_finish(group, index, result) /* forall<a> (group : strand-group<a>, index : int, result : strand-outcome<a>) -> () */  {
  var _x18 = (group.state).value;
   
  var value_0_10044 = Group_state($std_core_types._int_sub((_x18.active),1), group_outcome_fs_add(_x18.outcome, index, result, group.require_all), _x18.owned);
  return (((group.state)).value = value_0_10044);
}
 
export function strand_group_fs_track_owned(group, index, discard) /* forall<a> (group : strand-group<a>, index : int, discard : kokaine/async/effects/dispose-fn) -> group-owned-registration */  {
  var _x19 = (group.state).value;
   
  var discard_slot = { value: ($std_core_types.Just(discard)) };
   
  var node = $kokaine_internal_registry.registry_fs_try_insert(_x19.owned, Group_owned(index, discard_slot));
  return Group_owned_registration(node, discard_slot);
}
 
 
// Explicit release and group rollback race for the same entry. A live entry
// is physically removed before the lower ownership ledger is touched. The
// registration captures only its intrusive node and one-shot gate, never the
// group's sibling results. A kept winner's node may already be detached when
// its public release later consumes that independent gate.
export function group_owned_registration_fs_try_untrack(registration) /* (registration : group-owned-registration) -> bool */  {
   
  var discard = (registration.registration_discard).value;
   
  (((registration.registration_discard)).value = ($std_core_types.Nothing));
  if (discard === null) {
    return false;
  }
  else {
     
    if (registration.registration_node === null) {
      $std_core_types.Unit;
    }
    else {
       
      var _pat_5 = $kokaine_internal_registry.registry_registration_fs_take(registration.registration_node.value);
      $std_core_types.Unit;
    }
    return true;
  }
}
 
 
// monadic lift
export function _mlift_release_group_ownership_10300(_c_x10119) /* (()) -> bool */  {
  return true;
}
 
export function release_group_ownership(registration, release, guard) /* (registration : group-owned-registration, release : kokaine/async/effects/ownership-release-fn, guard : ownership-guard) -> ui bool */  {
   
  var b_10057 = group_owned_registration_fs_try_untrack(registration);
  if (b_10057) {
    var _x20 = release();
    if (_x20) {
       
      var x_10336 = ((guard).value = ($std_core_types.Nothing));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_release_group_ownership_10300);
      }
      else {
        return true;
      }
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
}
 
export function group_ownership_release_capability(registration, release, guard) /* (registration : group-owned-registration, release : kokaine/async/effects/ownership-release-fn, guard : ownership-guard) -> kokaine/async/effects/ownership-release-fn */  {
  return function() {
    return release_group_ownership(registration, release, guard);
  };
}
 
 
// Claim every losing discard before invoking any of them. A re-entrant
// release therefore either won earlier or observes an already-retired slot.
export function _trmc_collect_group_discards(values, outcome, require_all, _acc) /* forall<a> (values : list<group-owned>, outcome : group-outcome<a>, require-all : bool, ctx<list<kokaine/async/effects/dispose-fn>>) -> list<kokaine/async/effects/dispose-fn> */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types._cctx_apply(_acc,($std_core_types.Nil));
  }
  else {
    if (outcome._tag === 1) {
      if (require_all) {
        {
          // tail call
          values = values.tail;
          continue tailcall;
        }
      }
      else {
        var _x21 = $std_core_list.any(outcome.values, function(entry_0 /* (int, 2250) */ ) {
            var _x22 = entry_0.fst;
            var _x23 = values.head.group_owned_index;
            return $std_core_types._int_eq(_x22,_x23);
          });
        if (_x21) {
          {
            // tail call
            values = values.tail;
            continue tailcall;
          }
        }
        else {
           
          var _x24 = values.head.group_owned_discard;
          var discard = _x24.value;
           
          var _x25 = values.head.group_owned_discard;
          ((_x25).value = ($std_core_types.Nothing));
          if (discard === null) {
            {
              // tail call
              values = values.tail;
              continue tailcall;
            }
          }
          else {
             
            var _trmc_x10094 = undefined;
             
            var _trmc_x10095 = $std_core_types.Cons(discard.value, _trmc_x10094);
            {
              // tail call
              var _x24 = $std_core_types._cctx_extend(_acc,_trmc_x10095,({obj: _trmc_x10095, field_name: "tail"}));
              values = values.tail;
              _acc = _x24;
              continue tailcall;
            }
          }
        }
      }
    }
    else {
       
      var _x25 = values.head.group_owned_discard;
      var discard_0 = _x25.value;
       
      var _x26 = values.head.group_owned_discard;
      ((_x26).value = ($std_core_types.Nothing));
      if (discard_0 === null) {
        {
          // tail call
          values = values.tail;
          continue tailcall;
        }
      }
      else {
         
        var _trmc_x10096 = undefined;
         
        var _trmc_x10097 = $std_core_types.Cons(discard_0.value, _trmc_x10096);
        {
          // tail call
          var _x25 = $std_core_types._cctx_extend(_acc,_trmc_x10097,({obj: _trmc_x10097, field_name: "tail"}));
          values = values.tail;
          _acc = _x25;
          continue tailcall;
        }
      }
    }
  }
}}
 
 
// Claim every losing discard before invoking any of them. A re-entrant
// release therefore either won earlier or observes an already-retired slot.
export function collect_group_discards(values_1, outcome_0, require_all_0) /* forall<a> (values : list<group-owned>, outcome : group-outcome<a>, require-all : bool) -> list<kokaine/async/effects/dispose-fn> */  {
  return _trmc_collect_group_discards(values_1, outcome_0, require_all_0, $std_core_types._cctx_empty());
}
 
 
// monadic lift
export function strand_group_fs__mlift_results_10301(outcome, wild__) /* forall<a> (outcome : group-outcome<a>, wild_ : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> list<a> */  {
  return group_outcome_fs_resume(outcome);
}
 
export function strand_group_fs_results(group) /* forall<a> (group : strand-group<a>) -> <kokaine/async/effects/async,exn> list<a> */  {
  var _x26 = (group.state).value;
   
  var _x27 = $std_core_hnd._open_none1($kokaine_internal_registry.registry_fs_seal_detach, _x26.owned);
  var snapshot = (_x27 === null) ? $std_core_types.Nil : _x27.value;
   
  var discards = $std_core_hnd._open_none3(collect_group_discards, snapshot, _x26.outcome, group.require_all);
   
  var x_10339 = $std_core_list.foreach(discards, function(discard /* kokaine/async/effects/dispose-fn */ ) {
      return $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Nil)))))), $kokaine_async_effects.async_host, discard);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return group_outcome_fs_resume(_x26.outcome);
    });
  }
  else {
    return group_outcome_fs_resume(_x26.outcome);
  }
}
 
 
// Once a race has a winner, or a parallel group has failed/canceled, every
// later queued ordinary result is a loser. It must take the retained Cancel
// path instead of running user code after its await.
export function strand_group_fs_is_settled(group) /* forall<a> (group : strand-group<a>) -> bool */  {
   
  var _this_10073 = (group.state).value;
  if (_this_10073.outcome._tag === 1 && _this_10073.outcome.values === null) {
    return false;
  }
  else if (_this_10073.outcome._tag === 1) {
    return (group.require_all) ? false : true;
  }
  else {
    return true;
  }
}
 
 
// monadic lift
export function _mlift_in_strand_scope_10302(action, _y_x10138) /* forall<a,e> (action : () -> <kokaine/async/effects/async|e> a, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-cancel,kokaine/async/effects/async-await,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> a */  {
  return $std_core_hnd._mask_at(_y_x10138, true, action);
}
 
 
// Install one explicit group scope inside the routing handler. The route is
// deliberately outermost: when its captured strand resumes in a later browser
// turn, the fixed scope override remains part of that continuation, including
// for second and subsequent awaits.
export function in_strand_scope(scope, action) /* forall<a,e> (scope : kokaine/async/effects/async-scope, action : () -> <kokaine/async/effects/async|e> a) -> <kokaine/async/effects/async|e> a */  {
  return $kokaine_async_effects.async_cancel_fs__handle($kokaine_async_effects._Hnd_async_cancel(1, $std_core_hnd.clause_tail0(function() {
        return scope;
      }), $std_core_hnd.clause_tail1(function(current /* kokaine/async/effects/async-scope */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_0 /* kokaine/async/effects/async-scope */ ) {
             
            var ev_10344 = $std_core_hnd._evv_at(0);
            var _x27 = $kokaine_async_effects.cancel_scope_fs__select(ev_10344.hnd);
            return _x27(ev_10344.marker, ev_10344, scope_0);
          }, current);
      }), $std_core_hnd.clause_tail1(function(current_0 /* kokaine/async/effects/async-scope */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_1 /* kokaine/async/effects/async-scope */ ) {
             
            var ev_0_10347 = $std_core_hnd._evv_at(0);
            var _x28 = $kokaine_async_effects.is_scope_canceled_fs__select(ev_0_10347.hnd);
            return _x28(ev_0_10347.marker, ev_0_10347, scope_1);
          }, current_0);
      }), $std_core_hnd.clause_tail1(function(current_1 /* kokaine/async/effects/async-scope */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_2 /* kokaine/async/effects/async-scope */ ) {
             
            var ev_1_10350 = $std_core_hnd._evv_at(0);
            var _x29 = $kokaine_async_effects.release_canceled_scope_fs__select(ev_1_10350.hnd);
            return _x29(ev_1_10350.marker, ev_1_10350, scope_2);
          }, current_1);
      })), function(_res /* 2590 */ ) {
      return _res;
    }, function() {
       
      var x_2_10353 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10138 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10138, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_2_10353, true, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_in_strand_ownership_10303(group, guard, index, release) /* forall<a,e> (group : strand-group<a>, guard : ownership-guard, index : int, release : () -> ui bool) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue|e> kokaine/async/effects/ownership-release-fn */  {
   
  var _x_x3_10263 = $std_core_hnd._open_none2(function(release_0 /* kokaine/async/effects/ownership-release-fn */ , guard_1 /* ownership-guard */ ) {
      return function() {
         
        var _pat = release_0();
        return ownership_guard_fs_retire(guard_1);
      };
    }, release, guard);
   
  var registration = $std_core_hnd._open_none3(strand_group_fs_track_owned, group, index, _x_x3_10263);
  return $std_core_hnd._open_none3(function(registration_0 /* group-owned-registration */ , release_2 /* kokaine/async/effects/ownership-release-fn */ , guard_3 /* ownership-guard */ ) {
      return function() {
        return release_group_ownership(registration_0, release_2, guard_3);
      };
    }, registration, release, guard);
}
 
 
// monadic lift
export function _mlift_in_strand_ownership_10304(action, _y_x10143) /* forall<a,e> (action : () -> <kokaine/async/effects/async|e> a, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/async-ownership,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue|e> a */  {
  return $std_core_hnd._mask_at(_y_x10143, true, action);
}
 
 
// Record ownership acquired inside a child dynamic extent. The outer runtime
// still owns the actual one-shot lease; this nearer handler retains only its
// discard capability so an unreachable group result can be rolled back.
export function in_strand_ownership(group, index, action) /* forall<a,b,e> (group : strand-group<a>, index : int, action : () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> b) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> b */  {
  return $kokaine_async_effects.async_ownership_fs__handle($kokaine_async_effects._Hnd_async_ownership(1, $std_core_hnd.clause_tail1(function(dispose /* kokaine/async/effects/dispose-fn */ ) {
         
        var guard = $std_core_hnd._open_none1(new_ownership_guard, dispose);
         
        var _x_x1_0_10259 = $std_core_hnd._open_none1(function(guard_0 /* ownership-guard */ ) {
            return function() {
              return ownership_guard_fs_retire(guard_0);
            };
          }, guard);
         
        var x_10357 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), function(dispose_0 /* kokaine/async/effects/dispose-fn */ ) {
             
            var ev_10359 = $std_core_hnd._evv_at(0);
            var _x30 = $kokaine_async_effects.async_own_disposer_fs__select(ev_10359.hnd);
            return _x30(ev_10359.marker, ev_10359, dispose_0);
          }, _x_x1_0_10259);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(release /* () -> ui bool */ ) {
            return _mlift_in_strand_ownership_10303(group, guard, index, release);
          });
        }
        else {
          return _mlift_in_strand_ownership_10303(group, guard, index, x_10357);
        }
      })), function(_res /* 2746 */ ) {
      return _res;
    }, function() {
       
      var x_1_10362 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10143 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10143, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_1_10362, true, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_strand_10305(group, index, require_all, outcome) /* forall<a,e> (group : strand-group<a>, index : int, require-all : bool, outcome : either<hnd/yield-info,maybe<error<a>>>) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  if (outcome._tag === 2 && outcome.right !== null && outcome.right.value._tag === 2) {
     
    $std_core_hnd._open_none3(strand_group_fs_finish, group, index, Strand_value(outcome.right.value.value));
    var _x30 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, require_all);
    if (_x30) {
      return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.cancel_outstanding);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else if (outcome._tag === 2 && outcome.right !== null && outcome.right.value._tag === 1) {
     
    $std_core_hnd._open_none3(strand_group_fs_finish, group, index, Strand_exception(outcome.right.value.error));
    return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.cancel_outstanding);
  }
  else if (outcome._tag === 2 && outcome.right === null) {
     
    $std_core_hnd._open_none3(strand_group_fs_finish, group, index, Strand_canceled);
    return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.cancel_outstanding);
  }
  else {
     
    $std_core_hnd._open_none3(strand_group_fs_finish, group, index, Strand_finalized(outcome.left));
    return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.cancel_outstanding);
  }
}
 
 
// monadic lift
export function _mlift_run_strand_10306(action, group, index, require_all, _y_x10146) /* forall<a,e> (action : () -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> a, group : strand-group<a>, index : int, require-all : bool, bool) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-await,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  if (_y_x10146) {
    return $std_core_hnd._open_none3(strand_group_fs_finish, group, index, Strand_canceled);
  }
  else {
     
    var x_10366 = $std_core_hnd.try_finalize_prompt($kokaine_async_effects.unsafe_uncancel(function() {
      return $kokaine_internal_compat.capture_error(action);
    }));
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(outcome /* either<hnd/yield-info,maybe<error<2992>>> */ ) {
        return _mlift_run_strand_10305(group, index, require_all, outcome);
      });
    }
    else {
      return _mlift_run_strand_10305(group, index, require_all, x_10366);
    }
  }
}
 
export function run_strand(require_all, group, queue, scope, index, action) /* forall<a,e> (require-all : bool, group : strand-group<a>, queue : kokaine/async/channel/resume-queue<(force-cancel : bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> ()>, scope : kokaine/async/effects/async-scope, index : int, action : () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn|e> a) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
   
  $std_core_hnd._open_none1(strand_group_fs_start, group);
  return $kokaine_async_channel.route_awaits(queue, function() {
      return in_strand_scope(scope, function() {
          return in_strand_ownership(group, index, function() {
               
              var x_10369 = $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.is_canceled);
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(_y_x10146 /* bool */ ) {
                  return _mlift_run_strand_10306(action, group, index, require_all, _y_x10146);
                });
              }
              else {
                return _mlift_run_strand_10306(action, group, index, require_all, x_10369);
              }
            });
        });
    });
}
 
 
// Every queued item selects between its real completion and a first synthetic
// cancellation. Parent retirement enters this drain through the driver's
// `finally` while the async interpreter is still installed, so no later
// browser turn or live structural frame is needed to unwind child finalizers.
// `noinline` also keeps this higher-rank queue row out of Koka 3.2's cached
// inline printer.
export function cancel_queued(queue) /* forall<e> (queue : kokaine/async/channel/resume-queue<(bool) -> e ()>) -> <div|e> () */  {
  return $std_core.$while(function() {
      var _x31 = queue.value;
      return (_x31.front === null && _x31.back === null) ? false : true;
    }, function() {
      var _x32 = $kokaine_async_channel.resume_queue_fs_try_take(queue);
      if (_x32 === null) {
        return $std_core_types.Unit;
      }
      else {
        return _x32.value(true);
      }
    });
}
 
 
// monadic lift
export function _mlift_drive_strands_10307(queue, wild__) /* forall<e> (queue : kokaine/async/channel/resume-queue<(force-cancel : bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> ()>, wild_ : ()) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-await,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div|e> () */  {
  return cancel_queued(queue);
}
 
 
// monadic lift
export function _mlift_drive_strands_10308(group, select) /* forall<a,e> (group : strand-group<a>, select : (force-cancel : bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  return select($std_core_hnd._open_none1(strand_group_fs_is_settled, group));
}
 
 
// monadic lift
export function _mlift_drive_strands_10309(group, queue, scope, _y_x10168) /* forall<_e,a,e1> (group : strand-group<a>, queue : kokaine/async/channel/resume-queue<(force-cancel : bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e1> ()>, scope : kokaine/async/effects/async-scope, ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e1> () */  {
  return $std_core_hnd.finally_prompt(function() {
       
      var x_0_10379 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_1 /* kokaine/async/effects/async-scope */ ) {
           
          var ev_0_10381 = $std_core_hnd._evv_at(0);
          var _x33 = $kokaine_async_effects.cancel_scope_fs__select(ev_0_10381.hnd);
          return _x33(ev_0_10381.marker, ev_0_10381, scope_1);
        }, scope);
      if ($std_core_hnd._yielding()) {
        var _x34 = $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
          return cancel_queued(queue);
        });
      }
      else {
        var _x34 = cancel_queued(queue);
      }
      return $std_core_hnd.finally_prompt(function() {
          return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_0 /* kokaine/async/effects/async-scope */ ) {
               
              var ev_10376 = $std_core_hnd._evv_at(0);
              var _x33 = $kokaine_async_effects.release_canceled_scope_fs__select(ev_10376.hnd);
              return _x33(ev_10376.marker, ev_10376, scope_0);
            }, scope);
        }, _x34);
    }, $std_core.$while(function() {
        return $std_core_hnd._open_none1(function(group_0 /* strand-group<3214> */ ) {
             
            var _this_10031 = (group_0.state).value;
            var _x35 = _this_10031.active;
            return $std_core_types._int_gt(_x35,0);
          }, group);
      }, function() {
         
        var x_2_10388 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_channel.resume_queue_fs_take, queue);
         
        function next_0_10389(select) /* ((force-cancel : bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|3215> ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|3215> () */  {
          return select($std_core_hnd._open_none1(strand_group_fs_is_settled, group));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(next_0_10389);
        }
        else {
          return next_0_10389(x_2_10388);
        }
      }));
}
 
 
// monadic lift
export function _mlift_drive_strands_10310(actions, group, queue, require_all, _y_x10166) /* forall<_e,a,e1> (actions : list<() -> <kokaine/async/effects/async,exn|e1> a>, group : strand-group<a>, queue : kokaine/async/channel/resume-queue<(force-cancel : bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e1> ()>, require-all : bool, kokaine/async/effects/async-scope) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-await,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e1> () */  {
   
  var scope = $std_core_hnd._open_none1($kokaine_async_effects.new_child_scope, _y_x10166);
   
  var x_10392 = $std_core_list.foreach_indexed(actions, function(index /* int */ , action /* () -> <kokaine/async/effects/async,exn|3215> 3214 */ ) {
      return run_strand(require_all, group, queue, scope, index, action);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10168 /* () */ ) {
      return _mlift_drive_strands_10309(group, queue, scope, _y_x10168);
    });
  }
  else {
    return _mlift_drive_strands_10309(group, queue, scope, x_10392);
  }
}
 
export function drive_strands(actions, require_all, group) /* forall<a,e> (actions : list<() -> <kokaine/async/effects/async,exn|e> a>, require-all : bool, group : strand-group<a>) -> <kokaine/async/effects/async|e> () */  {
   
  var queue = $std_core_hnd._open_none0($kokaine_async_channel.new_resume_queue);
   
  var x_10394 = $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function() {
       
      var ev_10397 = $std_core_hnd._evv_at(0);
      var _x36 = $kokaine_async_effects._val_async_scope_fs__select(ev_10397.hnd);
      return _x36(ev_10397.marker, ev_10397);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10166 /* kokaine/async/effects/async-scope */ ) {
      return _mlift_drive_strands_10310(actions, group, queue, require_all, _y_x10166);
    });
  }
  else {
     
    var scope = $std_core_hnd._open_none1($kokaine_async_effects.new_child_scope, x_10394);
     
    var x_0_10399 = $std_core_list.foreach_indexed(actions, function(index /* int */ , action /* () -> <kokaine/async/effects/async,exn|3215> 3214 */ ) {
        return run_strand(require_all, group, queue, scope, index, action);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10168 /* () */ ) {
        return _mlift_drive_strands_10309(group, queue, scope, _y_x10168);
      });
    }
    else {
      return $std_core_hnd.finally_prompt(function() {
           
          var x_2_10409 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_1 /* kokaine/async/effects/async-scope */ ) {
               
              var ev_1_10411 = $std_core_hnd._evv_at(0);
              var _x36 = $kokaine_async_effects.cancel_scope_fs__select(ev_1_10411.hnd);
              return _x36(ev_1_10411.marker, ev_1_10411, scope_1);
            }, scope);
          if ($std_core_hnd._yielding()) {
            var _x37 = $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
              return cancel_queued(queue);
            });
          }
          else {
            var _x37 = cancel_queued(queue);
          }
          return $std_core_hnd.finally_prompt(function() {
              return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_0 /* kokaine/async/effects/async-scope */ ) {
                   
                  var ev_0_10406 = $std_core_hnd._evv_at(0);
                  var _x36 = $kokaine_async_effects.release_canceled_scope_fs__select(ev_0_10406.hnd);
                  return _x36(ev_0_10406.marker, ev_0_10406, scope_0);
                }, scope);
            }, _x37);
        }, $std_core.$while(function() {
            return $std_core_hnd._open_none1(function(group_0 /* strand-group<3214> */ ) {
                 
                var _this_10031 = (group_0.state).value;
                var _x38 = _this_10031.active;
                return $std_core_types._int_gt(_x38,0);
              }, group);
          }, function() {
             
            var x_4_10418 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_channel.resume_queue_fs_take, queue);
             
            var next_2_10419 = function(select /* (force-cancel : bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|3215> () */ ) {
              return select($std_core_hnd._open_none1(strand_group_fs_is_settled, group));
            };
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(next_2_10419);
            }
            else {
              return next_2_10419(x_4_10418);
            }
          }));
    }
  }
}
 
 
// monadic lift
export function _mlift_run_group_10311(group, wild__) /* forall<a,e> (group : strand-group<a>, wild_ : ()) -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> list<a> */  {
  return $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), strand_group_fs_results, group);
}
 
 
// monadic lift
export function _mlift_run_group_10312(actions, group, require_all, _y_x10184) /* forall<a,e> (actions : list<() -> <kokaine/async/effects/async,exn|e> a>, group : strand-group<a>, require-all : bool, hnd/ev-index) -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> list<a> */  {
   
  var x_10422 = $std_core_hnd._mask_at(_y_x10184, false, function() {
      return drive_strands(actions, require_all, group);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_run_group_10311(group, wild__);
    });
  }
  else {
    return _mlift_run_group_10311(group, x_10422);
  }
}
 
export function run_group(actions, require_all) /* forall<a,e> (actions : list<() -> <kokaine/async/effects/async,exn|e> a>, require-all : bool) -> <kokaine/async/effects/async,exn|e> list<a> */  {
   
  var group = $std_core_hnd._open_none1(new_strand_group, require_all);
   
  var x_10424 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10184 /* hnd/ev-index */ ) {
      return _mlift_run_group_10312(actions, group, require_all, _y_x10184);
    });
  }
  else {
     
    var x_0_10427 = $std_core_hnd._mask_at(x_10424, false, function() {
        return drive_strands(actions, require_all, group);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
        return _mlift_run_group_10311(group, wild__);
      });
    }
    else {
      return $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), strand_group_fs_results, group);
    }
  }
}
 
 
// monadic lift
export function _mlift_parallel_10313(results) /* forall<a,b,e> (results : list<either<a,b>>) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn|e> (a, b) */  {
  if (results !== null && results.head._tag === 1 && results.tail !== null && results.tail.head._tag === 2 && results.tail.tail === null) {
    return $std_core_types.Tuple2(results.head.left, results.tail.head.right);
  }
  else {
    return $std_core_debug.impossible("parallel completed without both ordered results", $std_core_types._lp__plus__plus__rp_("kokaine/async/structured.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(402), ")"))));
  }
}
 
 
// monadic lift
export function _mlift_parallel_10314(_y_x10189) /* forall<a,b,e> (a) -> <kokaine/async/effects/async,exn|e> either<a,b> */  {
  return $std_core_types.Left(_y_x10189);
}
 
 
// monadic lift
export function _mlift_parallel_10315(_y_x10190) /* forall<a,b,e> (b) -> <kokaine/async/effects/async,exn|e> either<a,b> */  {
  return $std_core_types.Right(_y_x10190);
}
 
 
// monadic lift
export function _mlift_parallel_10316(group, wild__) /* forall<a,b,e> (group : strand-group<either<a,b>>, wild_ : ()) -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> (a, b) */  {
   
  var x_10430 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), strand_group_fs_results, group);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(results /* list<either<3420,3421>> */ ) {
      return _mlift_parallel_10313(results);
    });
  }
  else {
    return _mlift_parallel_10313(x_10430);
  }
}
 
 
// monadic lift
export function _mlift_parallel_10317(group, left, right, _y_x10188) /* forall<a,b,e> (group : strand-group<either<a,b>>, left : () -> <kokaine/async/effects/async,exn|e> a, right : () -> <kokaine/async/effects/async,exn|e> b, hnd/ev-index) -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> (a, b) */  {
   
  var x_10432 = $std_core_hnd._mask_at(_y_x10188, false, function() {
      return drive_strands($std_core_types.Cons(function() {
             
            var x_0_10434 = left();
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10189 /* 3420 */ ) {
                return $std_core_types.Left(_y_x10189);
              });
            }
            else {
              return $std_core_types.Left(x_0_10434);
            }
          }, $std_core_types.Cons(function() {
               
              var x_1_10437 = right();
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(_y_x10190 /* 3421 */ ) {
                  return $std_core_types.Right(_y_x10190);
                });
              }
              else {
                return $std_core_types.Right(x_1_10437);
              }
            }, $std_core_types.Nil)), true, group);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_parallel_10316(group, wild__);
    });
  }
  else {
    return _mlift_parallel_10316(group, x_10432);
  }
}
 
 
// Run both actions concurrently and preserve argument/result order. Internal
// completion order is nondeterministic, but a successful pair is not.
export function parallel(left, right) /* forall<a,b,e> (left : () -> <kokaine/async/effects/async,exn|e> a, right : () -> <kokaine/async/effects/async,exn|e> b) -> <kokaine/async/effects/async,exn|e> (a, b) */  {
   
  var group = $std_core_hnd._open_none1(function(require_all /* bool */ ) {
       
      var value_10025 = Group_state(0, Group_values($std_core_types.Nil), $kokaine_internal_registry.new_registry());
      return Strand_group({ value: value_10025 }, require_all);
    }, true);
   
  var x_10440 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10188 /* hnd/ev-index */ ) {
      return _mlift_parallel_10317(group, left, right, _y_x10188);
    });
  }
  else {
     
    var x_0_10443 = $std_core_hnd._mask_at(x_10440, false, function() {
        return drive_strands($std_core_types.Cons(function() {
               
              var x_1_10446 = left();
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(_y_x10189 /* 3420 */ ) {
                  return $std_core_types.Left(_y_x10189);
                });
              }
              else {
                return $std_core_types.Left(x_1_10446);
              }
            }, $std_core_types.Cons(function() {
                 
                var x_2_10449 = right();
                if ($std_core_hnd._yielding()) {
                  return $std_core_hnd.yield_extend(function(_y_x10190 /* 3421 */ ) {
                    return $std_core_types.Right(_y_x10190);
                  });
                }
                else {
                  return $std_core_types.Right(x_2_10449);
                }
              }, $std_core_types.Nil)), true, group);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
        return _mlift_parallel_10316(group, wild__);
      });
    }
    else {
       
      var x_3_10452 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), strand_group_fs_results, group);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(results /* list<either<3420,3421>> */ ) {
          return _mlift_parallel_10313(results);
        });
      }
      else {
        if (x_3_10452 !== null && x_3_10452.head._tag === 1 && x_3_10452.tail !== null && x_3_10452.tail.head._tag === 2 && x_3_10452.tail.tail === null) {
          return $std_core_types.Tuple2(x_3_10452.head.left, x_3_10452.tail.head.right);
        }
        else {
          return $std_core_debug.impossible("parallel completed without both ordered results", $std_core_types._lp__plus__plus__rp_("kokaine/async/structured.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(402), ")"))));
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_race_10318(_y_x10198) /* forall<a,e> (list<a>) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn|e> a */  {
  if (_y_x10198 !== null) {
    return _y_x10198.head;
  }
  else {
    return $std_core_debug.impossible("race completed without a result", $std_core_types._lp__plus__plus__rp_("kokaine/async/structured.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(410), ")"))));
  }
}
 
 
// monadic lift
export function _mlift_race_10319(group, wild__) /* forall<a,e> (group : strand-group<a>, wild_ : ()) -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> a */  {
   
  var x_10455 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), strand_group_fs_results, group);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10198 /* list<3505> */ ) {
      return _mlift_race_10318(_y_x10198);
    });
  }
  else {
    return _mlift_race_10318(x_10455);
  }
}
 
 
// monadic lift
export function _mlift_race_10320(group, left, right, _y_x10195) /* forall<a,e> (group : strand-group<a>, left : () -> <kokaine/async/effects/async,exn|e> a, right : () -> <kokaine/async/effects/async,exn|e> a, hnd/ev-index) -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> a */  {
   
  var x_10457 = $std_core_hnd._mask_at(_y_x10195, false, function() {
      return drive_strands($std_core_types.Cons(left, $std_core_types.Cons(right, $std_core_types.Nil)), false, group);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_race_10319(group, wild__);
    });
  }
  else {
    return _mlift_race_10319(group, x_10457);
  }
}
 
 
// Settle on the first terminal outcome, cancel the loser, and keep driving the
// group until every loser finalizer has run.
export function race(left, right) /* forall<a,e> (left : () -> <kokaine/async/effects/async,exn|e> a, right : () -> <kokaine/async/effects/async,exn|e> a) -> <kokaine/async/effects/async,exn|e> a */  {
   
  var group = $std_core_hnd._open_none1(function(require_all /* bool */ ) {
       
      var value_10025 = Group_state(0, Group_values($std_core_types.Nil), $kokaine_internal_registry.new_registry());
      return Strand_group({ value: value_10025 }, require_all);
    }, false);
   
  var x_10459 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10195 /* hnd/ev-index */ ) {
      return _mlift_race_10320(group, left, right, _y_x10195);
    });
  }
  else {
     
    var x_0_10462 = $std_core_hnd._mask_at(x_10459, false, function() {
        return drive_strands($std_core_types.Cons(left, $std_core_types.Cons(right, $std_core_types.Nil)), false, group);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
        return _mlift_race_10319(group, wild__);
      });
    }
    else {
       
      var x_1_10465 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), strand_group_fs_results, group);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10198 /* list<3505> */ ) {
          return _mlift_race_10318(_y_x10198);
        });
      }
      else {
        if (x_1_10465 !== null) {
          return x_1_10465.head;
        }
        else {
          return $std_core_debug.impossible("race completed without a result", $std_core_types._lp__plus__plus__rp_("kokaine/async/structured.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(410), ")"))));
        }
      }
    }
  }
}
 
 
// monadic lift
export function _mlift_timeout_with_10321(wild__) /* forall<a,e> (wild_ : ()) -> <kokaine/async/effects/async,exn|e> maybe<a> */  {
  return $std_core_types.Nothing;
}
 
 
// monadic lift
export function _mlift_timeout_with_10322(_y_x10201) /* forall<a,e> (a) -> <kokaine/async/effects/async,exn|e> maybe<a> */  {
  return $std_core_types.Just(_y_x10201);
}
 
 
// The facade supplies a browser timer action, keeping this leaf independent
// of Web timer representation and avoiding an import cycle.
export function timeout_with(timer_action, action) /* forall<a,e> (timer-action : () -> <kokaine/async/effects/async,exn|e> (), action : () -> <kokaine/async/effects/async,exn|e> a) -> <kokaine/async/effects/async,exn|e> maybe<a> */  {
  return race(function() {
       
      var x_10468 = timer_action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
          return $std_core_types.Nothing;
        });
      }
      else {
        return $std_core_types.Nothing;
      }
    }, function() {
       
      var x_0_10471 = action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10201 /* 3548 */ ) {
          return $std_core_types.Just(_y_x10201);
        });
      }
      else {
        return $std_core_types.Just(x_0_10471);
      }
    });
}