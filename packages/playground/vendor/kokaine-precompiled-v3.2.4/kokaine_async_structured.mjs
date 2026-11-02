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
export const Group_finalized = { _tag: 4 }; // forall<a> group-outcome<a>
// type group-owned
export function Group_owned(group_owned_index, group_owned_discard) /* (group-owned-index : int, group-owned-discard : ref<global,maybe<kokaine/async/effects/dispose-fn>>) -> group-owned */  {
  return { group_owned_index: group_owned_index, group_owned_discard: group_owned_discard };
}
// type group-owned-registration
export function Group_owned_registration(registration_node, registration_discard) /* (registration-node : maybe<kokaine/internal/registry/registry-registration<group-owned>>, registration-discard : ref<global,maybe<kokaine/async/effects/dispose-fn>>) -> group-owned-registration */  {
  return { registration_node: registration_node, registration_discard: registration_discard };
}
// type group-state
export function Group_state(active, outcome, owned, escapes) /* forall<a> (active : int, outcome : group-outcome<a>, owned : kokaine/internal/registry/registry<group-owned>, escapes : int) -> group-state<a> */  {
  return { active: active, outcome: outcome, owned: owned, escapes: escapes };
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
export const Strand_finalized = { _tag: 4 }; // forall<a> strand-outcome<a>
 
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
 
 
// Automatically generated. Retrieves the `escapes` constructor field of the `:group-state` type.
export function group_state_fs_escapes(_this) /* forall<a> (group-state<a>) -> int */  {
  return _this.escapes;
}
 
 
// Automatically generated. Retrieves the `owned` constructor field of the `:group-state` type.
export function group_state_fs_owned(_this) /* forall<a> (group-state<a>) -> kokaine/internal/registry/registry<group-owned> */  {
  return _this.owned;
}
 
export function group_state_fs__copy(_this, active, outcome, owned, escapes) /* forall<a> (group-state<a>, active : ? int, outcome : ? (group-outcome<a>), owned : ? (kokaine/internal/registry/registry<group-owned>), escapes : ? int) -> group-state<a> */  {
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
  if (escapes !== undefined) {
    var _x7 = escapes;
  }
  else {
    var _x7 = _this.escapes;
  }
  return Group_state(_x4, _x5, _x6, _x7);
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
    var _x8 = state;
  }
  else {
    var _x8 = _this.state;
  }
  if (require_all !== undefined) {
    var _x9 = require_all;
  }
  else {
    var _x9 = _this.require_all;
  }
  return Strand_group(_x8, _x9);
}
 
 
// Automatically generated. Retrieves the `disposer` constructor field of the `:ownership-guard` type.
export function ownership_guard_fs_disposer(_this) /* (ownership-guard) -> ref<global,maybe<kokaine/async/effects/dispose-fn>> */  {
  return _this;
}
 
export function ownership_guard_fs__copy(_this, disposer) /* (ownership-guard, disposer : ? (ref<global,maybe<kokaine/async/effects/dispose-fn>>)) -> ownership-guard */  {
  if (disposer !== undefined) {
    var _x10 = disposer;
  }
  else {
    var _x10 = _this;
  }
  return _x10;
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
  return group_cell($std_core_types.Just(dispose));
}
 
export function ownership_guard_fs_retire(guard) /* (guard : ownership-guard) -> ui () */  {
   
  var current = group_load(guard);
   
  group_store(guard, $std_core_types.Nothing);
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    return current.value();
  }
}
 
export function ownership_guard_fs_accept(guard) /* (guard : ownership-guard) -> () */  {
  return group_store(guard, $std_core_types.Nothing);
}
 
export function ownership_guard_fs_as_disposer(guard) /* (guard : ownership-guard) -> kokaine/async/effects/dispose-fn */  {
  return function() {
     
    var current = group_load(guard);
     
    group_store(guard, $std_core_types.Nothing);
    if (current === null) {
      return $std_core_types.Unit;
    }
    else {
      return current.value();
    }
  };
}
 
export function release_ownership(release, guard) /* (release : kokaine/async/effects/ownership-release-fn, guard : ownership-guard) -> ui bool */  {
  var _x11 = release();
  if (_x11) {
     
    group_store(guard, $std_core_types.Nothing);
    return true;
  }
  else {
    return false;
  }
}
 
export function discard_ownership(release, guard) /* (release : kokaine/async/effects/ownership-release-fn, guard : ownership-guard) -> ui () */  {
   
  var _pat = release();
   
  var current = group_load(guard);
   
  group_store(guard, $std_core_types.Nothing);
  if (current === null) {
    return $std_core_types.Unit;
  }
  else {
    return current.value();
  }
}
 
export function ownership_discard_capability(release, guard) /* (release : kokaine/async/effects/ownership-release-fn, guard : ownership-guard) -> kokaine/async/effects/dispose-fn */  {
  return function() {
    return discard_ownership(release, guard);
  };
}
 
export function group_lift_div(action) /* forall<a,e> (action : () -> e a) -> <div|e> a */  {
  return action();
}
 
 
// monadic lift
export function _mlift_group_lift_exn_10277(action, _y_x10062) /* forall<a,e> (action : () -> e a, hnd/ev-index) -> <exn|e> a */  {
  return $std_core_hnd._mask_at(_y_x10062, false, action);
}
 
export function group_lift_exn(action) /* forall<a,e> (action : () -> e a) -> <exn|e> a */  {
   
  var x_10299 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10062 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10062, false, action);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_10299, false, action);
  }
}
 
export function new_strand_group(require_all) /* forall<a> (require-all : bool) -> strand-group<a> */  {
  return Strand_group(group_cell(Group_state(0, Group_values($std_core_types.Nil), $kokaine_internal_registry.Registry($kokaine_internal_registry.cell(false), $kokaine_internal_registry.cell($kokaine_internal_registry.Registry_end), $kokaine_internal_registry.cell(0)), 0)), require_all);
}
 
export function _trmc_ordered_insert(values, entry, _acc) /* forall<a> (values : list<(int, a)>, entry : (int, a), ctx<list<(int, a)>>) -> list<(int, a)> */  { tailcall: while(1)
{
  if (values !== null) {
    var _x12 = values.head.fst;
    var _x13 = entry.fst;
    if ($std_core_types._int_lt(_x12,_x13)){
       
      var _trmc_x10055 = undefined;
       
      var _trmc_x10056 = $std_core_types.Cons(values.head, _trmc_x10055);
      {
        // tail call
        var _x14 = $std_core_types._cctx_extend(_acc,_trmc_x10056,({obj: _trmc_x10056, field_name: "tail"}));
        values = values.tail;
        _acc = _x14;
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
      return Group_finalized;
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
      return Group_finalized;
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
         
        var ev_10306 = $std_core_hnd._evv_at(0);
        var _x15 = $kokaine_async_effects.discontinue_fs__select(ev_10306.hnd);
        return _x15(ev_10306.marker, ev_10306);
      });
  }
  else {
    return $std_core_debug.impossible("structured group returned after a final control", $std_core_types._lp__plus__plus__rp_("kokaine/async/structured.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(167), ")"))));
  }
}
 
export function group_outcome_fs_keeps_owned(current, index, require_all) /* forall<a> (current : group-outcome<a>, index : int, require-all : bool) -> bool */  {
  if (current._tag === 1) {
    if (require_all) {
      return true;
    }
    else {
      return $std_core_list.any(current.values, function(entry /* (int, 1821) */ ) {
          var _x16 = entry.fst;
          return $std_core_types._int_eq(_x16,index);
        });
    }
  }
  else {
    return false;
  }
}
 
export function strand_group_fs_active(group) /* forall<a> (group : strand-group<a>) -> bool */  {
   
  var _this_10021 = group_load(group.state);
  var _x17 = _this_10021.active;
  return $std_core_types._int_gt(_x17,0);
}
 
export function strand_group_fs_start(group) /* forall<a> (group : strand-group<a>) -> () */  {
  var _x18 = group_load(group.state);
  return group_store(group.state, Group_state($std_core_types._int_add((_x18.active),1), _x18.outcome, _x18.owned, _x18.escapes));
}
 
export function strand_group_fs_finish(group, index, result) /* forall<a> (group : strand-group<a>, index : int, result : strand-outcome<a>) -> () */  {
  var _x19 = group_load(group.state);
  var _x20 = (result._tag === 4) ? 1 : 0;
  return group_store(group.state, Group_state($std_core_types._int_sub((_x19.active),1), group_outcome_fs_add(_x19.outcome, index, result, group.require_all), _x19.owned, $std_core_types._int_add((_x19.escapes),_x20)));
}
 
export function strand_group_fs_escapes(group) /* forall<a> (group : strand-group<a>) -> int */  {
   
  var _this_10028 = group_load(group.state);
  return _this_10028.escapes;
}
 
export function strand_group_fs_track_owned(group, index, discard) /* forall<a> (group : strand-group<a>, index : int, discard : kokaine/async/effects/dispose-fn) -> group-owned-registration */  {
  var _x21 = group_load(group.state);
   
  var discard_slot = group_cell($std_core_types.Just(discard));
   
  var node = $kokaine_internal_registry.registry_fs_try_insert(_x21.owned, Group_owned(index, discard_slot));
  return Group_owned_registration(node, discard_slot);
}
 
 
// Explicit release and group rollback race for the same entry. A live entry
// is physically removed before the lower ownership ledger is touched. The
// registration captures only its intrusive node and one-shot gate, never the
// group's sibling results. A kept winner's node may already be detached when
// its public release later consumes that independent gate.
export function group_owned_registration_fs_try_untrack(registration) /* (registration : group-owned-registration) -> bool */  {
   
  var discard = group_load(registration.registration_discard);
   
  group_store(registration.registration_discard, $std_core_types.Nothing);
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
 
export function release_group_ownership(registration, release, guard) /* (registration : group-owned-registration, release : kokaine/async/effects/ownership-release-fn, guard : ownership-guard) -> ui bool */  {
   
  var b_10029 = group_owned_registration_fs_try_untrack(registration);
  if (b_10029) {
    var _x22 = release();
    if (_x22) {
       
      group_store(guard, $std_core_types.Nothing);
      return true;
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
        var _x23 = $std_core_list.any(outcome.values, function(entry_0 /* (int, 2364) */ ) {
            var _x24 = entry_0.fst;
            var _x25 = values.head.group_owned_index;
            return $std_core_types._int_eq(_x24,_x25);
          });
        if (_x23) {
          {
            // tail call
            values = values.tail;
            continue tailcall;
          }
        }
        else {
           
          var _x26 = values.head.group_owned_discard;
          var discard = group_load(_x26);
           
          var _x27 = values.head.group_owned_discard;
          group_store(_x27, $std_core_types.Nothing);
          if (discard === null) {
            {
              // tail call
              values = values.tail;
              continue tailcall;
            }
          }
          else {
             
            var _trmc_x10057 = undefined;
             
            var _trmc_x10058 = $std_core_types.Cons(discard.value, _trmc_x10057);
            {
              // tail call
              var _x26 = $std_core_types._cctx_extend(_acc,_trmc_x10058,({obj: _trmc_x10058, field_name: "tail"}));
              values = values.tail;
              _acc = _x26;
              continue tailcall;
            }
          }
        }
      }
    }
    else {
       
      var _x27 = values.head.group_owned_discard;
      var discard_0 = group_load(_x27);
       
      var _x28 = values.head.group_owned_discard;
      group_store(_x28, $std_core_types.Nothing);
      if (discard_0 === null) {
        {
          // tail call
          values = values.tail;
          continue tailcall;
        }
      }
      else {
         
        var _trmc_x10059 = undefined;
         
        var _trmc_x10060 = $std_core_types.Cons(discard_0.value, _trmc_x10059);
        {
          // tail call
          var _x27 = $std_core_types._cctx_extend(_acc,_trmc_x10060,({obj: _trmc_x10060, field_name: "tail"}));
          values = values.tail;
          _acc = _x27;
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
 
export function strand_group_fs_discard_losers(group) /* forall<a> (group : strand-group<a>) -> kokaine/async/effects/async () */  {
  var _x28 = $std_core_hnd._open_none1(group_load, group.state);
   
  var _x29 = $std_core_hnd._open_none1($kokaine_internal_registry.registry_fs_seal_detach, _x28.owned);
  var snapshot = (_x29 === null) ? $std_core_types.Nil : _x29.value;
   
  var discards = $std_core_hnd._open_none3(collect_group_discards, snapshot, _x28.outcome, group.require_all);
  return $std_core_list.foreach(discards, function(discard /* kokaine/async/effects/dispose-fn */ ) {
      return $kokaine_async_effects.async_host(discard);
    });
}
 
 
// monadic lift
export function strand_group_fs__mlift_results_10278(group, wild__) /* forall<a> (group : strand-group<a>, wild_ : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> list<a> */  {
   
  var _x_x1_0_10224 = $std_core_hnd._open_none1(group_load, group.state);
  return group_outcome_fs_resume($std_core_hnd._open_none1(function(_this /* group-state<2510> */ ) {
      return _this.outcome;
    }, _x_x1_0_10224));
}
 
export function strand_group_fs_results(group) /* forall<a> (group : strand-group<a>) -> <kokaine/async/effects/async,exn> list<a> */  {
   
  var x_10308 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Nil)))))), strand_group_fs_discard_losers, group);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
       
      var _x_x1_0_10224 = $std_core_hnd._open_none1(group_load, group.state);
      return group_outcome_fs_resume($std_core_hnd._open_none1(function(_this /* group-state<2510> */ ) {
          return _this.outcome;
        }, _x_x1_0_10224));
    });
  }
  else {
     
    var _x_x1_0_10224_0 = $std_core_hnd._open_none1(group_load, group.state);
    return group_outcome_fs_resume($std_core_hnd._open_none1(function(_this_0 /* group-state<2510> */ ) {
        return _this_0.outcome;
      }, _x_x1_0_10224_0));
  }
}
 
 
// monadic lift
export function strand_group_fs__mlift_unwind_escape_10279(group, wild__) /* forall<a> (group : strand-group<a>, wild_ : ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn> () */  {
   
  var _x_x1_1_10228 = $std_core_hnd._open_none1(group_load, group.state);
  var _x29 = $std_core_hnd._open_none1(function(_this_0 /* group-state<2630> */ ) {
      return _this_0.outcome;
    }, _x_x1_1_10228);
  if (_x29._tag === 2) {
    return $std_core_hnd._open_at1(5, $std_core_exn.untry, $std_core_types.$Error(_x29.error));
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// Runs from `run-group`'s `finally`. Only an outer final control raised by a
// child reaches here with `escapes > 0`; parent retirement keeps its existing
// path. The rollback matches `results`, and a later cleanup exception
// replaces the pending control, as Koka's `finally` rule prescribes.
export function strand_group_fs_unwind_escape(group) /* forall<a> (group : strand-group<a>) -> <kokaine/async/effects/async,exn> () */  {
  var _x30 = $std_core_types._int_gt(($std_core_hnd._open_none1(function(group_0 /* strand-group<2630> */ ) {
       
      var _this_10040 = group_load(group_0.state);
      return _this_10040.escapes;
    }, group)),0);
  if (_x30) {
     
    var x_10313 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Nil)))))), strand_group_fs_discard_losers, group);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
        return strand_group_fs__mlift_unwind_escape_10279(group, wild__);
      });
    }
    else {
       
      var _x_x1_1_10228 = $std_core_hnd._open_none1(group_load, group.state);
      var _x31 = $std_core_hnd._open_none1(function(_this_0 /* group-state<2630> */ ) {
          return _this_0.outcome;
        }, _x_x1_1_10228);
      if (_x31._tag === 2) {
        return $std_core_hnd._open_at1(5, $std_core_exn.untry, $std_core_types.$Error(_x31.error));
      }
      else {
        return $std_core_types.Unit;
      }
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// Once a race has a winner, or a parallel group has failed/canceled, every
// later queued ordinary result is a loser. It must take the retained Cancel
// path instead of running user code after its await.
export function strand_group_fs_is_settled(group) /* forall<a> (group : strand-group<a>) -> bool */  {
   
  var _this_10041 = group_load(group.state);
  if (_this_10041.outcome._tag === 1 && _this_10041.outcome.values === null) {
    return false;
  }
  else if (_this_10041.outcome._tag === 1) {
    return (group.require_all) ? false : true;
  }
  else {
    return true;
  }
}
 
 
// monadic lift
export function _mlift_in_strand_scope_10280(action, _y_x10087) /* forall<a,e> (action : () -> <kokaine/async/effects/async|e> a, hnd/ev-index) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-cancel,kokaine/async/effects/async-await,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> a */  {
  return $std_core_hnd._mask_at(_y_x10087, true, action);
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
             
            var ev_10316 = $std_core_hnd._evv_at(0);
            var _x32 = $kokaine_async_effects.cancel_scope_fs__select(ev_10316.hnd);
            return _x32(ev_10316.marker, ev_10316, scope_0);
          }, current);
      }), $std_core_hnd.clause_tail1(function(current_0 /* kokaine/async/effects/async-scope */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_1 /* kokaine/async/effects/async-scope */ ) {
             
            var ev_0_10319 = $std_core_hnd._evv_at(0);
            var _x33 = $kokaine_async_effects.is_scope_canceled_fs__select(ev_0_10319.hnd);
            return _x33(ev_0_10319.marker, ev_0_10319, scope_1);
          }, current_0);
      }), $std_core_hnd.clause_tail1(function(current_1 /* kokaine/async/effects/async-scope */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_2 /* kokaine/async/effects/async-scope */ ) {
             
            var ev_1_10322 = $std_core_hnd._evv_at(0);
            var _x34 = $kokaine_async_effects.release_canceled_scope_fs__select(ev_1_10322.hnd);
            return _x34(ev_1_10322.marker, ev_1_10322, scope_2);
          }, current_1);
      })), function(_res /* 2864 */ ) {
      return _res;
    }, function() {
       
      var x_2_10325 = $std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10087 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10087, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_2_10325, true, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_in_strand_ownership_10281(group, guard, index, release) /* forall<a,e> (group : strand-group<a>, guard : ownership-guard, index : int, release : () -> ui bool) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue|e> kokaine/async/effects/ownership-release-fn */  {
   
  var _x_x3_10239 = $std_core_hnd._open_none2(function(release_0 /* kokaine/async/effects/ownership-release-fn */ , guard_0_0 /* ownership-guard */ ) {
      return function() {
        return discard_ownership(release_0, guard_0_0);
      };
    }, release, guard);
   
  var registration = $std_core_hnd._open_none3(function(group_0 /* strand-group<3019> */ , index_0 /* int */ , discard /* kokaine/async/effects/dispose-fn */ ) {
      var _x35 = group_load(group_0.state);
       
      var discard_slot = group_cell($std_core_types.Just(discard));
       
      var node = $kokaine_internal_registry.registry_fs_try_insert(_x35.owned, Group_owned(index_0, discard_slot));
      return Group_owned_registration(node, discard_slot);
    }, group, index, _x_x3_10239);
  return $std_core_hnd._open_none3(function(registration_0 /* group-owned-registration */ , release_1 /* kokaine/async/effects/ownership-release-fn */ , guard_1 /* ownership-guard */ ) {
      return function() {
        return release_group_ownership(registration_0, release_1, guard_1);
      };
    }, registration, release, guard);
}
 
 
// monadic lift
export function _mlift_in_strand_ownership_10282(action, _y_x10092) /* forall<a,e> (action : () -> <kokaine/async/effects/async|e> a, hnd/ev-index) -> <kokaine/async/effects/async-ownership,kokaine/async/effects/async-ownership,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/discontinue|e> a */  {
  return $std_core_hnd._mask_at(_y_x10092, true, action);
}
 
 
// Record ownership acquired inside a child dynamic extent. The outer runtime
// still owns the actual one-shot lease; this nearer handler retains only its
// discard capability so an unreachable group result can be rolled back.
export function in_strand_ownership(group, index, action) /* forall<a,b,e> (group : strand-group<a>, index : int, action : () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> b) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> b */  {
  return $kokaine_async_effects.async_ownership_fs__handle($kokaine_async_effects._Hnd_async_ownership(1, $std_core_hnd.clause_tail1(function(dispose /* kokaine/async/effects/dispose-fn */ ) {
         
        var guard = $std_core_hnd._open_none1(function(dispose_0 /* kokaine/async/effects/dispose-fn */ ) {
            return group_cell($std_core_types.Just(dispose_0));
          }, dispose);
         
        var _x_x1_0_10235 = $std_core_hnd._open_none1(function(guard_0 /* ownership-guard */ ) {
            return function() {
               
              var current = group_load(guard_0);
               
              group_store(guard_0, $std_core_types.Nothing);
              if (current === null) {
                return $std_core_types.Unit;
              }
              else {
                return current.value();
              }
            };
          }, guard);
         
        var x_10329 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), function(dispose_1 /* kokaine/async/effects/dispose-fn */ ) {
             
            var ev_10331 = $std_core_hnd._evv_at(0);
            var _x35 = $kokaine_async_effects.async_own_disposer_fs__select(ev_10331.hnd);
            return _x35(ev_10331.marker, ev_10331, dispose_1);
          }, _x_x1_0_10235);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(release /* () -> ui bool */ ) {
            return _mlift_in_strand_ownership_10281(group, guard, index, release);
          });
        }
        else {
          return _mlift_in_strand_ownership_10281(group, guard, index, x_10329);
        }
      })), function(_res /* 3020 */ ) {
      return _res;
    }, function() {
       
      var x_1_10334 = $std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10092 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10092, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_1_10334, true, action);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_strand_10283(body_done, result_1) /* forall<a,e> (body-done : ref<global,bool>, result@1 : maybe<error<a>>) -> <kokaine/async/effects/async|e> maybe<error<a>> */  {
   
  $std_core_hnd._open_none2(group_store, body_done, true);
  return result_1;
}
 
 
// monadic lift
export function _mlift_run_strand_10284(group, index, require_all, outcome_2) /* forall<a,e> (group : strand-group<a>, index : int, require-all : bool, outcome@2 : maybe<error<a>>) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-await,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  if (outcome_2 !== null && outcome_2.value._tag === 2) {
     
    $std_core_hnd._open_none3(function(group_3 /* strand-group<3284> */ , index_2 /* int */ , result_2 /* strand-outcome<3284> */ ) {
        var _x35 = group_load(group_3.state);
        var _x36 = (result_2._tag === 4) ? 1 : 0;
        return group_store(group_3.state, Group_state($std_core_types._int_sub((_x35.active),1), group_outcome_fs_add(_x35.outcome, index_2, result_2, group_3.require_all), _x35.owned, $std_core_types._int_add((_x35.escapes),_x36)));
      }, group, index, Strand_value(outcome_2.value.value));
    var _x35 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
        return (b_0) ? false : true;
      }, require_all);
    if (_x35) {
      return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.cancel_outstanding);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else if (outcome_2 !== null && outcome_2.value._tag === 1) {
     
    $std_core_hnd._open_none3(function(group_4 /* strand-group<3284> */ , index_3 /* int */ , result_3 /* strand-outcome<3284> */ ) {
        var _x36 = group_load(group_4.state);
        var _x37 = (result_3._tag === 4) ? 1 : 0;
        return group_store(group_4.state, Group_state($std_core_types._int_sub((_x36.active),1), group_outcome_fs_add(_x36.outcome, index_3, result_3, group_4.require_all), _x36.owned, $std_core_types._int_add((_x36.escapes),_x37)));
      }, group, index, Strand_exception(outcome_2.value.error));
    return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.cancel_outstanding);
  }
  else {
     
    $std_core_hnd._open_none3(function(group_5 /* strand-group<3284> */ , index_4 /* int */ , result_4 /* strand-outcome<3284> */ ) {
        var _x36 = group_load(group_5.state);
        var _x37 = (result_4._tag === 4) ? 1 : 0;
        return group_store(group_5.state, Group_state($std_core_types._int_sub((_x36.active),1), group_outcome_fs_add(_x36.outcome, index_4, result_4, group_5.require_all), _x36.owned, $std_core_types._int_add((_x36.escapes),_x37)));
      }, group, index, Strand_canceled);
    return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.cancel_outstanding);
  }
}
 
 
// monadic lift
export function _mlift_run_strand_10285(action, group, index, require_all, _y_x10095) /* forall<a,e> (action : () -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> a, group : strand-group<a>, index : int, require-all : bool, bool) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-await,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  if (_y_x10095) {
    return $std_core_hnd._open_none3(function(group_1 /* strand-group<3284> */ , index_0 /* int */ , result /* strand-outcome<3284> */ ) {
        var _x36 = group_load(group_1.state);
        var _x37 = (result._tag === 4) ? 1 : 0;
        return group_store(group_1.state, Group_state($std_core_types._int_sub((_x36.active),1), group_outcome_fs_add(_x36.outcome, index_0, result, group_1.require_all), _x36.owned, $std_core_types._int_add((_x36.escapes),_x37)));
      }, group, index, Strand_canceled);
  }
  else {
     
    var body_done = $std_core_hnd._open_none1(group_cell, false);
     
    var x_0_10342 = $kokaine_async_effects.unsafe_uncancel(function() {
      return $kokaine_internal_compat.capture_error(action);
    });
     
    if ($std_core_hnd._yielding()) {
      var _x39 = $std_core_hnd.yield_extend(function(result_1 /* maybe<error<3284>> */ ) {
         
        $std_core_hnd._open_none2(group_store, body_done, true);
        return result_1;
      });
    }
    else {
       
      $std_core_hnd._open_none2(group_store, body_done, true);
      var _x39 = x_0_10342;
    }
    var x_10338 = $std_core_hnd.finally_prompt(function() {
         
        var _x_x1_2_10250 = $std_core_hnd._open_none1(group_load, body_done);
        var _x38 = $std_core_hnd._open_none1(function(b /* bool */ ) {
            return (b) ? false : true;
          }, _x_x1_2_10250);
        if (_x38) {
           
          $std_core_hnd._open_none3(function(group_2 /* strand-group<3284> */ , index_1 /* int */ , result_0 /* strand-outcome<3284> */ ) {
              var _x39 = group_load(group_2.state);
              var _x40 = (result_0._tag === 4) ? 1 : 0;
              return group_store(group_2.state, Group_state($std_core_types._int_sub((_x39.active),1), group_outcome_fs_add(_x39.outcome, index_1, result_0, group_2.require_all), _x39.owned, $std_core_types._int_add((_x39.escapes),_x40)));
            }, group, index, Strand_finalized);
          return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.cancel_outstanding);
        }
        else {
          return $std_core_types.Unit;
        }
      }, _x39);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(outcome_2 /* maybe<error<3284>> */ ) {
        return _mlift_run_strand_10284(group, index, require_all, outcome_2);
      });
    }
    else {
      return _mlift_run_strand_10284(group, index, require_all, x_10338);
    }
  }
}
 
export function run_strand(require_all, group, queue, scope, index, action) /* forall<a,e> (require-all : bool, group : strand-group<a>, queue : kokaine/async/channel/resume-queue<(force-cancel : bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> ()>, scope : kokaine/async/effects/async-scope, index : int, action : () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,exn|e> a) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
   
  $std_core_hnd._open_none1(function(group_0 /* strand-group<3284> */ ) {
      var _x38 = group_load(group_0.state);
      return group_store(group_0.state, Group_state($std_core_types._int_add((_x38.active),1), _x38.outcome, _x38.owned, _x38.escapes));
    }, group);
  return $kokaine_async_channel.route_awaits(queue, function() {
      return in_strand_scope(scope, function() {
          return in_strand_ownership(group, index, function() {
               
              var x_10346 = $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $kokaine_async_effects.is_canceled);
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(_y_x10095 /* bool */ ) {
                  return _mlift_run_strand_10285(action, group, index, require_all, _y_x10095);
                });
              }
              else {
                return _mlift_run_strand_10285(action, group, index, require_all, x_10346);
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
      var _x38 = $kokaine_async_channel.load(queue);
      return (_x38.front === null && _x38.back === null) ? false : true;
    }, function() {
      var _x39 = $kokaine_async_channel.resume_queue_fs_try_take(queue);
      if (_x39 === null) {
        return $std_core_types.Unit;
      }
      else {
        return _x39.value(true);
      }
    });
}
 
 
// A child's outer final control is unwinding the driver. Keep driving every
// remaining strand, across browser turns if their cleanup awaits, exactly as
// the ordinary loop would after a settled outcome. A further escape from a
// sibling's cleanup restarts this drain (and later replaces the pending
// control); a parent cancellation falls back to the synchronous drain.
// `step` and `fallback` are the driver's own loop body and synchronous drain,
// passed as closures so the queue row stays inferred in `drive-strands`.
export function drain_escaped(group, step, fallback) /* forall<a,e> (group : strand-group<a>, step : () -> <div|e> (), fallback : () -> <div|e> ()) -> <div|e> () */  {
   
   
  var _this_10044 = group_load(group.state);
  var seen = _this_10044.escapes;
  return $std_core_hnd.finally_prompt(function() {
       
      var _this_0_10045 = group_load(group.state);
      var _x41 = _this_0_10045.active;
      var _x40 = $std_core_types._int_gt(_x41,0);
      if (_x40) {
         
        var _this_1_10046 = group_load(group.state);
        var _x43 = _this_1_10046.escapes;
        var _x42 = $std_core_types._int_gt(_x43,seen);
        if (_x42) {
          return drain_escaped(group, step, fallback);
        }
        else {
          return fallback();
        }
      }
      else {
        return $std_core_types.Unit;
      }
    }, $std_core.$while(function() {
         
        var _this_2_10047 = group_load(group.state);
        var _x44 = _this_2_10047.active;
        return $std_core_types._int_gt(_x44,0);
      }, step));
}
 
 
// monadic lift
export function _mlift_drive_strands_10286(group, select) /* forall<a,e> (group : strand-group<a>, select : (bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> ()) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  return select($std_core_hnd._open_none1(function(group_0 /* strand-group<3748> */ ) {
       
      var _this_10041 = group_load(group_0.state);
      if (_this_10041.outcome._tag === 1 && _this_10041.outcome.values === null) {
        return false;
      }
      else if (_this_10041.outcome._tag === 1) {
        return (group_0.require_all) ? false : true;
      }
      else {
        return true;
      }
    }, group));
}
 
 
// monadic lift
export function _mlift_drive_strands_10287(group, queue, step, wild__) /* forall<a,e> (group : strand-group<a>, queue : kokaine/async/channel/resume-queue<(bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> ()>, step : () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div|e> (), wild_ : ()) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-await,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div|e> () */  {
  var _x45 = $std_core_types._int_gt(($std_core_hnd._open_none1(function(group_0_0 /* strand-group<3748> */ ) {
       
      var _this_10050 = group_load(group_0_0.state);
      return _this_10050.escapes;
    }, group)),0);
  if (_x45) {
    return drain_escaped(group, step, function() {
        return cancel_queued(queue);
      });
  }
  else {
    return cancel_queued(queue);
  }
}
 
 
// monadic lift
export function _mlift_drive_strands_10288(group, step, wild___0) /* forall<a,e> (group : strand-group<a>, step : () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div|e> (), wild_@0 : ()) -> <div,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
  return $std_core.$while(function() {
      return $std_core_hnd._open_none1(function(group_1 /* strand-group<3748> */ ) {
           
          var _this_0_10053 = group_load(group_1.state);
          var _x46 = _this_0_10053.active;
          return $std_core_types._int_gt(_x46,0);
        }, group);
    }, step);
}
 
 
// monadic lift
export function _mlift_drive_strands_10289(actions, group, queue, require_all, _y_x10121) /* forall<a,e> (actions : list<() -> <kokaine/async/effects/async,exn|e> a>, group : strand-group<a>, queue : kokaine/async/channel/resume-queue<(bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> ()>, require-all : bool, kokaine/async/effects/async-scope) -> <kokaine/async/effects/async-cancel,kokaine/async/effects/async-await,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> () */  {
   
  var scope = $std_core_hnd._open_none1($kokaine_async_effects.new_child_scope, _y_x10121);
   
  function step() /* () -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,div|3749> () */  {
     
    var x_10353 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_channel.resume_queue_fs_take, queue);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(select /* (bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|3749> () */ ) {
        return _mlift_drive_strands_10286(group, select);
      });
    }
    else {
      return _mlift_drive_strands_10286(group, x_10353);
    }
  }
   
  var x_3_10367 = $std_core_list.foreach_indexed(actions, function(index /* int */ , action_2_0 /* () -> <kokaine/async/effects/async,exn|3749> 3748 */ ) {
      return run_strand(require_all, group, queue, scope, index, action_2_0);
    });
  if ($std_core_hnd._yielding()) {
    var _x49 = $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_drive_strands_10288(group, step, wild___0);
    });
  }
  else {
    var _x49 = _mlift_drive_strands_10288(group, step, x_3_10367);
  }
  return $std_core_hnd.finally_prompt(function() {
       
      var x_1_10362 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_1 /* kokaine/async/effects/async-scope */ ) {
           
          var ev_0_10364 = $std_core_hnd._evv_at(0);
          var _x47 = $kokaine_async_effects.cancel_scope_fs__select(ev_0_10364.hnd);
          return _x47(ev_0_10364.marker, ev_0_10364, scope_1);
        }, scope);
      if ($std_core_hnd._yielding()) {
        var _x48 = $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
          return _mlift_drive_strands_10287(group, queue, step, wild__);
        });
      }
      else {
        var _x48 = _mlift_drive_strands_10287(group, queue, step, x_1_10362);
      }
      return $std_core_hnd.finally_prompt(function() {
          return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_0 /* kokaine/async/effects/async-scope */ ) {
               
              var ev_10359 = $std_core_hnd._evv_at(0);
              var _x47 = $kokaine_async_effects.release_canceled_scope_fs__select(ev_10359.hnd);
              return _x47(ev_10359.marker, ev_10359, scope_0);
            }, scope);
        }, _x48);
    }, _x49);
}
 
export function drive_strands(actions, require_all, group) /* forall<a,e> (actions : list<() -> <kokaine/async/effects/async,exn|e> a>, require-all : bool, group : strand-group<a>) -> <kokaine/async/effects/async|e> () */  {
   
  var queue = $std_core_hnd._open_none0(function() {
    return $kokaine_async_channel.cell($kokaine_async_channel.Queue_state($std_core_types.Nil, $std_core_types.Nil, $std_core_types.Nil));
  });
   
  var x_10370 = $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function() {
       
      var ev_10373 = $std_core_hnd._evv_at(0);
      var _x50 = $kokaine_async_effects._val_async_scope_fs__select(ev_10373.hnd);
      return _x50(ev_10373.marker, ev_10373);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10121 /* kokaine/async/effects/async-scope */ ) {
      return _mlift_drive_strands_10289(actions, group, queue, require_all, _y_x10121);
    });
  }
  else {
     
    var scope = $std_core_hnd._open_none1($kokaine_async_effects.new_child_scope, x_10370);
     
    var step = function() {
       
      var x_0_10376 = $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Nil)))))), $kokaine_async_channel.resume_queue_fs_take, queue);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(select /* (bool) -> <kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|3749> () */ ) {
          return _mlift_drive_strands_10286(group, select);
        });
      }
      else {
        return _mlift_drive_strands_10286(group, x_0_10376);
      }
    };
     
    var x_4_10390 = $std_core_list.foreach_indexed(actions, function(index /* int */ , action_2_0 /* () -> <kokaine/async/effects/async,exn|3749> 3748 */ ) {
        return run_strand(require_all, group, queue, scope, index, action_2_0);
      });
    if ($std_core_hnd._yielding()) {
      var _x52 = $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_drive_strands_10288(group, step, wild___0);
      });
    }
    else {
      var _x52 = _mlift_drive_strands_10288(group, step, x_4_10390);
    }
    return $std_core_hnd.finally_prompt(function() {
         
        var x_2_10385 = $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_1 /* kokaine/async/effects/async-scope */ ) {
             
            var ev_1_10387 = $std_core_hnd._evv_at(0);
            var _x50 = $kokaine_async_effects.cancel_scope_fs__select(ev_1_10387.hnd);
            return _x50(ev_1_10387.marker, ev_1_10387, scope_1);
          }, scope);
        if ($std_core_hnd._yielding()) {
          var _x51 = $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
            return _mlift_drive_strands_10287(group, queue, step, wild__);
          });
        }
        else {
          var _x51 = _mlift_drive_strands_10287(group, queue, step, x_2_10385);
        }
        return $std_core_hnd.finally_prompt(function() {
            return $std_core_hnd._open_at1($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), function(scope_0 /* kokaine/async/effects/async-scope */ ) {
                 
                var ev_0_10382 = $std_core_hnd._evv_at(0);
                var _x50 = $kokaine_async_effects.release_canceled_scope_fs__select(ev_0_10382.hnd);
                return _x50(ev_0_10382.marker, ev_0_10382, scope_0);
              }, scope);
          }, _x51);
      }, _x52);
  }
}
 
 
// monadic lift
export function _mlift_run_group_10290(group, wild__) /* forall<a,e> (group : strand-group<a>, wild_ : ()) -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> list<a> */  {
  return $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), strand_group_fs_results, group);
}
 
 
// monadic lift
export function _mlift_run_group_10291(actions, group, require_all, _y_x10142) /* forall<a,e> (actions : list<() -> <kokaine/async/effects/async,exn|e> a>, group : strand-group<a>, require-all : bool, hnd/ev-index) -> <exn,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue|e> list<a> */  {
   
  var x_10393 = $std_core_hnd._mask_at(_y_x10142, false, function() {
      return drive_strands(actions, require_all, group);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_run_group_10290(group, wild__);
    });
  }
  else {
    return _mlift_run_group_10290(group, x_10393);
  }
}
 
export function run_group(actions, require_all) /* forall<a,e> (actions : list<() -> <kokaine/async/effects/async,exn|e> a>, require-all : bool) -> <kokaine/async/effects/async,exn|e> list<a> */  {
   
  var group = $std_core_hnd._open_none1(new_strand_group, require_all);
   
  var x_10397 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    var _x53 = $std_core_hnd.yield_extend(function(_y_x10142 /* hnd/ev-index */ ) {
      return _mlift_run_group_10291(actions, group, require_all, _y_x10142);
    });
  }
  else {
    var _x53 = _mlift_run_group_10291(actions, group, require_all, x_10397);
  }
  return $std_core_hnd.finally_prompt(function() {
      return $std_core_hnd._open1($std_core_vector.unvlist($std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_await_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_cancel_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ioc_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.async_ownership_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($kokaine_async_effects.discontinue_fs__tag), $std_core_types.Cons($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), $std_core_types.Nil))))))), strand_group_fs_unwind_escape, group);
    }, _x53);
}
 
 
// monadic lift
export function _mlift_parallel_10292(_y_x10147) /* forall<a,b,e> (a) -> <kokaine/async/effects/async,exn|e> either<a,b> */  {
  return $std_core_types.Left(_y_x10147);
}
 
 
// monadic lift
export function _mlift_parallel_10293(_y_x10148) /* forall<a,b,e> (b) -> <kokaine/async/effects/async,exn|e> either<a,b> */  {
  return $std_core_types.Right(_y_x10148);
}
 
 
// monadic lift
export function _mlift_parallel_10294(results) /* forall<a,b,e> (results : list<either<a,b>>) -> <kokaine/async/effects/async,exn|e> (a, b) */  {
  if (results !== null && results.head._tag === 1 && results.tail !== null && results.tail.head._tag === 2 && results.tail.tail === null) {
    return $std_core_types.Tuple2(results.head.left, results.tail.head.right);
  }
  else {
    return $std_core_debug.impossible("parallel completed without both ordered results", $std_core_types._lp__plus__plus__rp_("kokaine/async/structured.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(482), ")"))));
  }
}
 
 
// Run both actions concurrently and preserve argument/result order. Internal
// completion order is nondeterministic, but a successful pair is not.
export function parallel(left, right) /* forall<a,b,e> (left : () -> <kokaine/async/effects/async,exn|e> a, right : () -> <kokaine/async/effects/async,exn|e> b) -> <kokaine/async/effects/async,exn|e> (a, b) */  {
   
  var x_10399 = run_group($std_core_types.Cons(function() {
         
        var x_0_10402 = left();
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10147 /* 3972 */ ) {
            return $std_core_types.Left(_y_x10147);
          });
        }
        else {
          return $std_core_types.Left(x_0_10402);
        }
      }, $std_core_types.Cons(function() {
           
          var x_1_10405 = right();
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10148 /* 3973 */ ) {
              return $std_core_types.Right(_y_x10148);
            });
          }
          else {
            return $std_core_types.Right(x_1_10405);
          }
        }, $std_core_types.Nil)), true);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(results /* list<either<3972,3973>> */ ) {
      return _mlift_parallel_10294(results);
    });
  }
  else {
    if (x_10399 !== null && x_10399.head._tag === 1 && x_10399.tail !== null && x_10399.tail.head._tag === 2 && x_10399.tail.tail === null) {
      return $std_core_types.Tuple2(x_10399.head.left, x_10399.tail.head.right);
    }
    else {
      return $std_core_debug.impossible("parallel completed without both ordered results", $std_core_types._lp__plus__plus__rp_("kokaine/async/structured.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(482), ")"))));
    }
  }
}
 
 
// monadic lift
export function _mlift_race_10295(_y_x10151) /* forall<a,e> (list<a>) -> <kokaine/async/effects/async,exn|e> a */  {
  if (_y_x10151 !== null) {
    return _y_x10151.head;
  }
  else {
    return $std_core_debug.impossible("race completed without a result", $std_core_types._lp__plus__plus__rp_("kokaine/async/structured.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(490), ")"))));
  }
}
 
 
// Settle on the first terminal outcome, cancel the loser, and keep driving the
// group until every loser finalizer has run.
export function race(left, right) /* forall<a,e> (left : () -> <kokaine/async/effects/async,exn|e> a, right : () -> <kokaine/async/effects/async,exn|e> a) -> <kokaine/async/effects/async,exn|e> a */  {
   
  var x_10408 = run_group($std_core_types.Cons(left, $std_core_types.Cons(right, $std_core_types.Nil)), false);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10151 /* list<4057> */ ) {
      return _mlift_race_10295(_y_x10151);
    });
  }
  else {
    if (x_10408 !== null) {
      return x_10408.head;
    }
    else {
      return $std_core_debug.impossible("race completed without a result", $std_core_types._lp__plus__plus__rp_("kokaine/async/structured.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(490), ")"))));
    }
  }
}
 
 
// monadic lift
export function _mlift_timeout_with_10296(wild__) /* forall<a,e> (wild_ : ()) -> <kokaine/async/effects/async,exn|e> maybe<a> */  {
  return $std_core_types.Nothing;
}
 
 
// monadic lift
export function _mlift_timeout_with_10297(_y_x10154) /* forall<a,e> (a) -> <kokaine/async/effects/async,exn|e> maybe<a> */  {
  return $std_core_types.Just(_y_x10154);
}
 
 
// The facade supplies a browser timer action, keeping this leaf independent
// of Web timer representation and avoiding an import cycle.
export function timeout_with(timer_action, action) /* forall<a,e> (timer-action : () -> <kokaine/async/effects/async,exn|e> (), action : () -> <kokaine/async/effects/async,exn|e> a) -> <kokaine/async/effects/async,exn|e> maybe<a> */  {
  return race(function() {
       
      var x_10411 = timer_action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
          return $std_core_types.Nothing;
        });
      }
      else {
        return $std_core_types.Nothing;
      }
    }, function() {
       
      var x_0_10414 = action();
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10154 /* 4100 */ ) {
          return $std_core_types.Just(_y_x10154);
        });
      }
      else {
        return $std_core_types.Just(x_0_10414);
      }
    });
}