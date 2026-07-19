// Koka generated module: kokaine/dom, koka version: 3.2.4
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
import * as $kokaine_reactive_integration from './kokaine_reactive_integration.mjs';
import * as $kokaine_reactive_async from './kokaine_reactive_async.mjs';
import * as $kokaine_html from './kokaine_html.mjs';
import * as $kokaine_internal_event_dash_runtime from './kokaine_internal_event_dash_runtime.mjs';
import * as $kokaine_internal_key_dash_index from './kokaine_internal_key_dash_index.mjs';
import * as $kokaine_internal_compat from './kokaine_internal_compat.mjs';
import * as $kokaine_dom_internal_keyed_dash_transaction from './kokaine_dom_internal_keyed_dash_transaction.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_async_effects from './kokaine_async_effects.mjs';
import * as $kokaine_reactive_integration_internal_lifetime_dash_scope from './kokaine_reactive_integration_internal_lifetime_dash_scope.mjs';
import * as $kokaine_reactive_integration_internal_provision from './kokaine_reactive_integration_internal_provision.mjs';
import * as $kokaine_reactive_integration_internal_reentry from './kokaine_reactive_integration_internal_reentry.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
import * as $kokaine_reactive_async_internal_runtime from './kokaine_reactive_async_internal_runtime.mjs';
import * as $kokaine_reactive_internal_handlers from './kokaine_reactive_internal_handlers.mjs';
 
// externals
 
// type declarations
// type dom-listener
export function Dom_listener(value) /* (value : any) -> dom-listener */  {
  return value;
}
// type dom-owner-registration
export function Dom_owner_registration(value) /* (value : any) -> dom-owner-registration */  {
  return value;
}
// type dom-retirement
export function Dom_retirement(value) /* (value : any) -> dom-retirement */  {
  return value;
}
// type element
export function Dom_element(value) /* (value : any) -> element */  {
  return value;
}
// type keyed-participation
export function Keyed_owned(keyed_provision, keyed_lease, keyed_journal) /* (keyed-provision : kokaine/reactive/integration/provision<ui>, keyed-lease : kokaine/reactive/integration/provision-lease<ui>, keyed-journal : kokaine/dom/internal/keyed-transaction/keyed-transaction) -> keyed-participation */  {
  return { _tag: 1, keyed_provision: keyed_provision, keyed_lease: keyed_lease, keyed_journal: keyed_journal };
}
export function Keyed_joined(keyed_provision, keyed_journal) /* (keyed-provision : kokaine/reactive/integration/provision<ui>, keyed-journal : kokaine/dom/internal/keyed-transaction/keyed-transaction) -> keyed-participation */  {
  return { _tag: 2, keyed_provision: keyed_provision, keyed_journal: keyed_journal };
}
// type node
export function Dom_node(value) /* (value : any) -> node */  {
  return value;
}
// type keyed-row
export function Keyed_row(row_key, row_current_item, row_current_index, row_item_source, row_index_source, row_scope, row_first, row_last) /* forall<e,a,b> (row-key : b, row-current-item : ref<global,a>, row-current-index : ref<global,int>, row-item-source : kokaine/reactive/signal<a>, row-index-source : kokaine/reactive/signal<int>, row-scope : kokaine/reactive/integration/lifetime-scope<ui>, row-first : node, row-last : node) -> keyed-row<e,a,b> */  {
  return { row_key: row_key, row_current_item: row_current_item, row_current_index: row_current_index, row_item_source: row_item_source, row_index_source: row_index_source, row_scope: row_scope, row_first: row_first, row_last: row_last };
}
// type keyed-retirement
export function Keyed_retirement(retirement_row, retirement_handle) /* forall<e,a,b> (retirement-row : keyed-row<e,a,b>, retirement-handle : dom-retirement) -> keyed-retirement<e,a,b> */  {
  return { retirement_row: retirement_row, retirement_handle: retirement_handle };
}
// type keyed-table
export function Keyed_table(table_index, table_order, table_retirements) /* forall<e,a,b> (table-index : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, table-order : list<keyed-row<e,a,b>>, table-retirements : list<keyed-retirement<e,a,b>>) -> keyed-table<e,a,b> */  {
  return { table_index: table_index, table_order: table_order, table_retirements: table_retirements };
}
// type keyed-update
export function Keyed_update(update_row, update_item, update_index, update_item_changed, update_index_changed) /* forall<e,a,b> (update-row : keyed-row<e,a,b>, update-item : a, update-index : int, update-item-changed : bool, update-index-changed : bool) -> keyed-update<e,a,b> */  {
  return { update_row: update_row, update_item: update_item, update_index: update_index, update_item_changed: update_item_changed, update_index_changed: update_index_changed };
}
// type owner-match
export const Owner_none = { _tag: 1 }; // owner-match
export function Owner_live(owner_portal) /* (owner-portal : kokaine/reactive/integration/reentry<ui>) -> owner-match */  {
  return { _tag: 2, owner_portal: owner_portal };
}
export const Owner_retired = { _tag: 3 }; // owner-match
// type raw-event
export function Raw_event(value) /* (value : any) -> raw-event */  {
  return value;
}
// type toggle-state
export const Toggle_open = 1; // toggle-state
export const Toggle_closed = 2; // toggle-state
 
// declarations
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:node` type.
export function node_fs_value(node) /* (node : node) -> any */  {
  return node;
}
 
export function node_fs__copy(_this, value) /* (node, value : ? any) -> node */  {
  if (value !== undefined) {
    var _x0 = value;
  }
  else {
    var _x0 = _this;
  }
  return _x0;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:element` type.
export function element_fs_value(element) /* (element : element) -> any */  {
  return element;
}
 
export function element_fs__copy(_this, value) /* (element, value : ? any) -> element */  {
  if (value !== undefined) {
    var _x1 = value;
  }
  else {
    var _x1 = _this;
  }
  return _x1;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:raw-event` type.
export function raw_event_fs_value(_this) /* (raw-event) -> any */  {
  return _this;
}
 
export function raw_event_fs__copy(_this, value) /* (raw-event, value : ? any) -> raw-event */  {
  if (value !== undefined) {
    var _x2 = value;
  }
  else {
    var _x2 = _this;
  }
  return _x2;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:dom-listener` type.
export function dom_listener_fs_value(_this) /* (dom-listener) -> any */  {
  return _this;
}
 
export function dom_listener_fs__copy(_this, value) /* (dom-listener, value : ? any) -> dom-listener */  {
  if (value !== undefined) {
    var _x3 = value;
  }
  else {
    var _x3 = _this;
  }
  return _x3;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:dom-owner-registration` type.
export function dom_owner_registration_fs_value(_this) /* (dom-owner-registration) -> any */  {
  return _this;
}
 
export function dom_owner_registration_fs__copy(_this, value) /* (dom-owner-registration, value : ? any) -> dom-owner-registration */  {
  if (value !== undefined) {
    var _x4 = value;
  }
  else {
    var _x4 = _this;
  }
  return _x4;
}
 
 
// Automatically generated. Retrieves the `value` constructor field of the `:dom-retirement` type.
export function dom_retirement_fs_value(_this) /* (dom-retirement) -> any */  {
  return _this;
}
 
export function dom_retirement_fs__copy(_this, value) /* (dom-retirement, value : ? any) -> dom-retirement */  {
  if (value !== undefined) {
    var _x5 = value;
  }
  else {
    var _x5 = _this;
  }
  return _x5;
}
 
 
// Automatically generated. Tests for the `Owner-none` constructor of the `:owner-match` type.
export function is_owner_none(owner_match) /* (owner-match : owner-match) -> bool */  {
  return (owner_match._tag === 1);
}
 
 
// Automatically generated. Tests for the `Owner-live` constructor of the `:owner-match` type.
export function is_owner_live(owner_match) /* (owner-match : owner-match) -> bool */  {
  return (owner_match._tag === 2);
}
 
 
// Automatically generated. Tests for the `Owner-retired` constructor of the `:owner-match` type.
export function is_owner_retired(owner_match) /* (owner-match : owner-match) -> bool */  {
  return (owner_match._tag === 3);
}
 
 
// Automatically generated. Tests for the `Toggle-open` constructor of the `:toggle-state` type.
export function is_toggle_open(toggle_state) /* (toggle-state : toggle-state) -> bool */  {
  return (toggle_state === 1);
}
 
 
// Automatically generated. Tests for the `Toggle-closed` constructor of the `:toggle-state` type.
export function is_toggle_closed(toggle_state) /* (toggle-state : toggle-state) -> bool */  {
  return (toggle_state === 2);
}
 
 
// Automatically generated. Retrieves the `row-key` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_key(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> b */  {
  return _this.row_key;
}
 
 
// Automatically generated. Retrieves the `row-current-item` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_current_item(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> ref<global,a> */  {
  return _this.row_current_item;
}
 
 
// Automatically generated. Retrieves the `row-current-index` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_current_index(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> ref<global,int> */  {
  return _this.row_current_index;
}
 
 
// Automatically generated. Retrieves the `row-item-source` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_item_source(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> kokaine/reactive/signal<a> */  {
  return _this.row_item_source;
}
 
 
// Automatically generated. Retrieves the `row-index-source` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_index_source(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> kokaine/reactive/signal<int> */  {
  return _this.row_index_source;
}
 
 
// Automatically generated. Retrieves the `row-scope` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_scope(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> kokaine/reactive/integration/lifetime-scope<ui> */  {
  return _this.row_scope;
}
 
 
// Automatically generated. Retrieves the `row-first` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_first(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> node */  {
  return _this.row_first;
}
 
 
// Automatically generated. Retrieves the `row-last` constructor field of the `:keyed-row` type.
export function keyed_row_fs_row_last(_this) /* forall<e,a,b> (keyed-row<e,a,b>) -> node */  {
  return _this.row_last;
}
 
export function keyed_row_fs__copy(_this, row_key, row_current_item, row_current_index, row_item_source, row_index_source, row_scope, row_first, row_last) /* forall<e,a,b> (keyed-row<e,a,b>, row-key : ? b, row-current-item : ? (ref<global,a>), row-current-index : ? (ref<global,int>), row-item-source : ? (kokaine/reactive/signal<a>), row-index-source : ? (kokaine/reactive/signal<int>), row-scope : ? (kokaine/reactive/integration/lifetime-scope<ui>), row-first : ? node, row-last : ? node) -> keyed-row<e,a,b> */  {
  if (row_key !== undefined) {
    var _x6 = row_key;
  }
  else {
    var _x6 = _this.row_key;
  }
  if (row_current_item !== undefined) {
    var _x7 = row_current_item;
  }
  else {
    var _x7 = _this.row_current_item;
  }
  if (row_current_index !== undefined) {
    var _x8 = row_current_index;
  }
  else {
    var _x8 = _this.row_current_index;
  }
  if (row_item_source !== undefined) {
    var _x9 = row_item_source;
  }
  else {
    var _x9 = _this.row_item_source;
  }
  if (row_index_source !== undefined) {
    var _x10 = row_index_source;
  }
  else {
    var _x10 = _this.row_index_source;
  }
  if (row_scope !== undefined) {
    var _x11 = row_scope;
  }
  else {
    var _x11 = _this.row_scope;
  }
  if (row_first !== undefined) {
    var _x12 = row_first;
  }
  else {
    var _x12 = _this.row_first;
  }
  if (row_last !== undefined) {
    var _x13 = row_last;
  }
  else {
    var _x13 = _this.row_last;
  }
  return Keyed_row(_x6, _x7, _x8, _x9, _x10, _x11, _x12, _x13);
}
 
 
// Automatically generated. Retrieves the `update-row` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_row(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> keyed-row<e,a,b> */  {
  return _this.update_row;
}
 
 
// Automatically generated. Retrieves the `update-item` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_item(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> a */  {
  return _this.update_item;
}
 
 
// Automatically generated. Retrieves the `update-index` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_index(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> int */  {
  return _this.update_index;
}
 
 
// Automatically generated. Retrieves the `update-item-changed` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_item_changed(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> bool */  {
  return _this.update_item_changed;
}
 
 
// Automatically generated. Retrieves the `update-index-changed` constructor field of the `:keyed-update` type.
export function keyed_update_fs_update_index_changed(_this) /* forall<e,a,b> (keyed-update<e,a,b>) -> bool */  {
  return _this.update_index_changed;
}
 
export function keyed_update_fs__copy(_this, update_row, update_item, update_index, update_item_changed, update_index_changed) /* forall<e,a,b> (keyed-update<e,a,b>, update-row : ? (keyed-row<e,a,b>), update-item : ? a, update-index : ? int, update-item-changed : ? bool, update-index-changed : ? bool) -> keyed-update<e,a,b> */  {
  if (update_row !== undefined) {
    var _x14 = update_row;
  }
  else {
    var _x14 = _this.update_row;
  }
  if (update_item !== undefined) {
    var _x15 = update_item;
  }
  else {
    var _x15 = _this.update_item;
  }
  if (update_index !== undefined) {
    var _x16 = update_index;
  }
  else {
    var _x16 = _this.update_index;
  }
  if (update_item_changed !== undefined) {
    var _x17 = update_item_changed;
  }
  else {
    var _x17 = _this.update_item_changed;
  }
  if (update_index_changed !== undefined) {
    var _x18 = update_index_changed;
  }
  else {
    var _x18 = _this.update_index_changed;
  }
  return Keyed_update(_x14, _x15, _x16, _x17, _x18);
}
 
 
// Automatically generated. Retrieves the `retirement-row` constructor field of the `:keyed-retirement` type.
export function keyed_retirement_fs_retirement_row(_this) /* forall<e,a,b> (keyed-retirement<e,a,b>) -> keyed-row<e,a,b> */  {
  return _this.retirement_row;
}
 
 
// Automatically generated. Retrieves the `retirement-handle` constructor field of the `:keyed-retirement` type.
export function keyed_retirement_fs_retirement_handle(_this) /* forall<e,a,b> (keyed-retirement<e,a,b>) -> dom-retirement */  {
  return _this.retirement_handle;
}
 
export function keyed_retirement_fs__copy(_this, retirement_row, retirement_handle) /* forall<e,a,b> (keyed-retirement<e,a,b>, retirement-row : ? (keyed-row<e,a,b>), retirement-handle : ? dom-retirement) -> keyed-retirement<e,a,b> */  {
  if (retirement_row !== undefined) {
    var _x19 = retirement_row;
  }
  else {
    var _x19 = _this.retirement_row;
  }
  if (retirement_handle !== undefined) {
    var _x20 = retirement_handle;
  }
  else {
    var _x20 = _this.retirement_handle;
  }
  return Keyed_retirement(_x19, _x20);
}
 
 
// Automatically generated. Retrieves the `table-index` constructor field of the `:keyed-table` type.
export function keyed_table_fs_table_index(_this) /* forall<e,a,b> (keyed-table<e,a,b>) -> kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>> */  {
  return _this.table_index;
}
 
 
// Automatically generated. Retrieves the `table-order` constructor field of the `:keyed-table` type.
export function keyed_table_fs_table_order(_this) /* forall<e,a,b> (keyed-table<e,a,b>) -> list<keyed-row<e,a,b>> */  {
  return _this.table_order;
}
 
 
// Automatically generated. Retrieves the `table-retirements` constructor field of the `:keyed-table` type.
export function keyed_table_fs_table_retirements(_this) /* forall<e,a,b> (keyed-table<e,a,b>) -> list<keyed-retirement<e,a,b>> */  {
  return _this.table_retirements;
}
 
export function keyed_table_fs__copy(_this, table_index, table_order, table_retirements) /* forall<e,a,b> (keyed-table<e,a,b>, table-index : ? (kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>), table-order : ? (list<keyed-row<e,a,b>>), table-retirements : ? (list<keyed-retirement<e,a,b>>)) -> keyed-table<e,a,b> */  {
  if (table_index !== undefined) {
    var _x21 = table_index;
  }
  else {
    var _x21 = _this.table_index;
  }
  if (table_order !== undefined) {
    var _x22 = table_order;
  }
  else {
    var _x22 = _this.table_order;
  }
  if (table_retirements !== undefined) {
    var _x23 = table_retirements;
  }
  else {
    var _x23 = _this.table_retirements;
  }
  return Keyed_table(_x21, _x22, _x23);
}
 
 
// Automatically generated. Tests for the `Keyed-owned` constructor of the `:keyed-participation` type.
export function is_keyed_owned(keyed_participation) /* (keyed-participation : keyed-participation) -> bool */  {
  return (keyed_participation._tag === 1);
}
 
 
// Automatically generated. Retrieves the `keyed-provision` constructor field of the `:keyed-participation` type.
export function keyed_participation_fs_keyed_provision(_this) /* (keyed-participation) -> kokaine/reactive/integration/provision<ui> */  {
  return (_this._tag === 1) ? _this.keyed_provision : _this.keyed_provision;
}
 
 
// Automatically generated. Retrieves the `keyed-journal` constructor field of the `:keyed-participation` type.
export function keyed_participation_fs_keyed_journal(_this) /* (keyed-participation) -> kokaine/dom/internal/keyed-transaction/keyed-transaction */  {
  return (_this._tag === 1) ? _this.keyed_journal : _this.keyed_journal;
}
 
 
// Automatically generated. Tests for the `Keyed-joined` constructor of the `:keyed-participation` type.
export function is_keyed_joined(keyed_participation) /* (keyed-participation : keyed-participation) -> bool */  {
  return (keyed_participation._tag === 2);
}
 
export function keyed_participation_fs_journal(current) /* (current : keyed-participation) -> kokaine/dom/internal/keyed-transaction/keyed-transaction */  {
  return (current._tag === 1) ? current.keyed_journal : current.keyed_journal;
}
 
export function keyed_participation_fs_is_owned(current) /* (current : keyed-participation) -> bool */  {
  return (current._tag === 1);
}
 
 
// monadic lift
export function _mlift_open_keyed_participation_11398(_y_x10292) /* (kokaine/reactive/integration/internal/provision/provision-lease<ui>) -> exn keyed-participation */  {
   
  var lease = _y_x10292;
   
  var current = $std_core_hnd._open_none1(function(lease_0 /* kokaine/reactive/integration/provision-lease<ui> */ ) {
      var _x24 = lease_0;
      return _x24;
    }, lease);
  return Keyed_owned(current, lease, $std_core_hnd._open_none0($kokaine_dom_internal_keyed_dash_transaction.new_keyed_transaction));
}
 
 
// monadic lift
export function _mlift_open_keyed_participation_11399(current_0, _y_x10293) /* (current@0 : kokaine/reactive/integration/provision<ui>, kokaine/dom/internal/keyed-transaction/keyed-transaction) -> exn keyed-participation */  {
  return Keyed_joined(current_0, _y_x10293);
}
 
 
// monadic lift
export function _mlift_open_keyed_participation_11400(renderer, root, _y_x10291) /* (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, maybe<kokaine/reactive/integration/provision<ui>>) -> exn keyed-participation */  {
  if (_y_x10291 === null) {
     
    var x_11575 = $kokaine_reactive_integration_internal_provision.open_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
        return value;
      }, root));
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_open_keyed_participation_11398);
    }
    else {
      return _mlift_open_keyed_participation_11398(x_11575);
    }
  }
  else {
     
    var x_0_11577 = $kokaine_dom_internal_keyed_dash_transaction.current_keyed_transaction(renderer, _y_x10291.value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10293 /* kokaine/dom/internal/keyed-transaction/keyed-transaction */ ) {
        return Keyed_joined(_y_x10291.value, _y_x10293);
      });
    }
    else {
      return Keyed_joined(_y_x10291.value, x_0_11577);
    }
  }
}
 
export function open_keyed_participation(renderer, root) /* (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>) -> exn keyed-participation */  {
   
  var x_11581 = $kokaine_reactive_integration.current_provision(root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10291 /* maybe<kokaine/reactive/integration/provision<ui>> */ ) {
      return _mlift_open_keyed_participation_11400(renderer, root, _y_x10291);
    });
  }
  else {
    if (x_11581 === null) {
       
      var x_0_11584 = $kokaine_reactive_integration_internal_provision.open_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_open_keyed_participation_11398);
      }
      else {
         
        var lease = x_0_11584;
         
        var current = $std_core_hnd._open_none1(function(lease_0 /* kokaine/reactive/integration/provision-lease<ui> */ ) {
            var _x24 = lease_0;
            return _x24;
          }, lease);
        return Keyed_owned(current, lease, $std_core_hnd._open_none0($kokaine_dom_internal_keyed_dash_transaction.new_keyed_transaction));
      }
    }
    else {
       
      var x_1_11587 = $kokaine_dom_internal_keyed_dash_transaction.current_keyed_transaction(renderer, x_11581.value);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10293 /* kokaine/dom/internal/keyed-transaction/keyed-transaction */ ) {
          return Keyed_joined(x_11581.value, _y_x10293);
        });
      }
      else {
        return Keyed_joined(x_11581.value, x_1_11587);
      }
    }
  }
}
 
export function drain_keyed_participation(renderer, current) /* (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, current : keyed-participation) -> <pure,ui> () */  {
  if (current._tag === 1) {
    return $kokaine_dom_internal_keyed_dash_transaction.with_keyed_transaction(renderer, current.keyed_provision, current.keyed_journal, function() {
        return $kokaine_reactive_integration_internal_provision.drain_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/provision-lease<ui> */ ) {
            return value;
          }, current.keyed_lease));
      });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function promote_keyed_participation(current) /* (current : keyed-participation) -> <pure,ui> () */  {
  if (current._tag === 1) {
    return $kokaine_reactive_integration_internal_provision.promote_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/provision-lease<ui> */ ) {
        return value;
      }, current.keyed_lease));
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function discard_keyed_participation(current) /* (current : keyed-participation) -> <exn,ui> () */  {
  if (current._tag === 1) {
    return $std_core_hnd.finally_prompt(function() {
        return $kokaine_dom_internal_keyed_dash_transaction.abort_keyed_transaction(current.keyed_journal);
      }, $kokaine_reactive_integration_internal_provision.discard_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/provision-lease<ui> */ ) {
          return value;
        }, current.keyed_lease)));
  }
  else {
    return $std_core_types.Unit;
  }
}
 
 
// Transaction state must survive abortive control while mount bootstraps are
// flushing. Keep this adapter-local and inaccessible to user code.
export function transaction_cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function transaction_load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function transaction_store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
export function query_raw(selector) /* (selector : string) -> ui any */  {
  return document.querySelector(selector);
}
 
export function any_is_null(value) /* (value : any) -> bool */  {
  return (value == null);
}
 
export function any_node(value) /* (value : any) -> node */  {
  return value;
}
 
export function any_reentry(value) /* (value : any) -> kokaine/reactive/integration/reentry<ui> */  {
  return value;
}
 
 
// JavaScript DOM APIs throw native exceptions, which do not automatically
// become Koka's `exn` effect. Keep raw exceptions inside this tiny result box
// and rethrow them through Koka so handler/finally state is always restored.
export function dom_attempt_raw(action) /* forall<a> (action : () -> ui a) -> ui any */  {
  return (function(){ try { return { ok:true, value:(action)() }; } catch(error) { return { ok:false, message:String(error && error.message != null ? error.message : error) }; } })();
}
 
export function dom_attempt_ok(result) /* (result : any) -> bool */  {
  return !!(result).ok;
}
 
export function dom_attempt_value(result) /* forall<a> (result : any) -> a */  {
  return (result).value;
}
 
export function dom_attempt_message(result) /* (result : any) -> string */  {
  return String((result).message);
}
 
 
// Closed shadow roots are intentionally opaque, so a keyed move cannot inspect
// them for custom-element callbacks after the fact. Install one wrapper per DOM
// realm before mount construction and remember both observed closed hosts and
// elements whose provenance proves that they had no pre-existing closed root.
// If another host shim replaces the wrapper, later moves fail closed. As with
// the rest of the DOM adapter, direct calls through deliberately retained or
// foreign native primitives are outside the cooperative host contract.
export function dom_install_shadow_tracker(parent) /* (parent : node) -> ui () */  {
  return (function(parent){ var doc=parent && (parent.nodeType===9 ? parent : parent.ownerDocument); var view=doc && doc.defaultView; if(!view || !view.Element) throw new Error('cannot install Kokaine shadow-root tracking outside a DOM realm'); var key=Symbol.for('kokaine.dom.shadow-roots'); var tracker=globalThis[key]; if(!tracker){ tracker={ version:1, known:new WeakSet(), closed:new WeakSet(), realms:new WeakMap() }; tracker.remember=function(root){ var pending=root && root.childNodes ? Array.prototype.slice.call(root.childNodes) : []; while(pending.length){ var current=pending.pop(); if(current && current.nodeType===1){ tracker.known.add(current); if(current.localName==='template' && current.content){ var mode=current.getAttribute('shadowrootmode'); if(mode && mode.toLowerCase()==='closed' && current.parentNode && current.parentNode.nodeType===1) tracker.closed.add(current.parentNode); var templateChildren=Array.prototype.slice.call(current.content.childNodes); for(var j=0;j<templateChildren.length;j++) pending.push(templateChildren[j]); } } var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; for(var i=0;i<children.length;i++) pending.push(children[i]); } }; globalThis[key]=tracker; } if(tracker.version!==1 || !tracker.known || !tracker.closed || !tracker.realms || typeof tracker.remember!=='function') throw new Error('invalid Kokaine shadow-root tracker'); var prototype=view.Element.prototype; var state=tracker.realms.get(view); if(state){ var intact=state.wrapper ? prototype.attachShadow===state.wrapper : typeof prototype.attachShadow!=='function'; if(state.prototype!==prototype || !intact) throw new Error('Kokaine shadow-root tracking was replaced'); return; } var descriptor=Object.getOwnPropertyDescriptor(prototype,'attachShadow'); if(!descriptor || typeof descriptor.value!=='function'){ if(typeof prototype.attachShadow==='function') throw new Error('cannot safely wrap this DOM realm attachShadow implementation'); tracker.realms.set(view,{ prototype:prototype, wrapper:null }); return; } var original=descriptor.value; var wrapper=function attachShadow(){ var root=original.apply(this,arguments); tracker.known.add(this); try { var mode=root && root.mode; if(mode!=='open') tracker.closed.add(this); } catch(error) { tracker.closed.add(this); throw error; } return root; }; Object.defineProperty(prototype,'attachShadow',{ configurable:descriptor.configurable, enumerable:descriptor.enumerable, writable:descriptor.writable, value:wrapper }); tracker.realms.set(view,{ prototype:prototype, wrapper:wrapper }); })(parent);
}
 
export function dom_create_element(parent, name) /* (parent : node, name : string) -> ui element */  {
  return (function(parent,name){ var doc=parent && (parent.nodeType===9 ? parent : parent.ownerDocument); if(!doc) throw new Error('cannot create a Kokaine element without an owner document'); var value=doc.createElement(name); var tracker=globalThis[Symbol.for('kokaine.dom.shadow-roots')]; if(tracker && tracker.known) tracker.known.add(value); return value; })(parent,name);
}
 
export function dom_create_text(value) /* (value : string) -> ui node */  {
  return document.createTextNode(value);
}
 
export function dom_create_comment(value) /* (value : string) -> ui node */  {
  return document.createComment(value);
}
 
export function element_node(value) /* (value : element) -> node */  {
  return value;
}
 
 
// Nodes created by a managed generation remember its structural re-entry
// capability. The registry gives each live root a weakly keyed numeric ID:
// retired node tombstones can therefore reject stale same-root adoption without
// retaining the root or its generation portal.
export function dom_record_owner(value, root, portal) /* (value : node, root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>) -> ui dom-owner-registration */  {
  return (function(){ var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(root); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(root,ownerId); } var entry={ ownerId:ownerId, portal:portal, retired:false }; registry.owners.set(value,entry); return [{ node:value, ownerId:ownerId, entry:entry }]; })();
}
 
export function dom_retire_owners(value) /* (value : dom-owner-registration) -> ui () */  {
  return (function(){ var registry=globalThis[Symbol.for('kokaine.dom.owners')]; var handles=value || []; for(var i=0;i<handles.length;i++){ var handle=handles[i]; var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry && registry.owners && handle.node){ var current=registry.owners.get(handle.node); if(current===entry && current.ownerId===handle.ownerId){ registry.owners.set(handle.node,entry); } } handle.node=null; handle.entry=null; } })();
}
 
export function dom_find_owner(value, root) /* (value : node, root : kokaine/reactive/root<ui>) -> ui any */  {
  return (function(){ var registry=globalThis[Symbol.for('kokaine.dom.owners')]; if(!registry || !registry.owners || !registry.roots) return { state:0 }; var ownerId=registry.roots.get(root); if(ownerId==null) return { state:0 }; var current=value; while(current){ var entry=registry.owners.get(current); if(entry && entry.ownerId===ownerId){ if(entry.retired || !entry.portal) return { state:2 }; return { state:1, portal:entry.portal }; } current=current.parentNode || current.host || null; } return { state:0 }; })();
}
 
export function dom_owner_state(value) /* (value : any) -> int */  {
  return Number((value).state);
}
 
export function dom_owner_portal(value) /* (value : any) -> any */  {
  return (value).portal;
}
 
export function dom_append(parent, child) /* (parent : node, child : node) -> ui () */  {
  return (parent).appendChild(child);
}
 
export function dom_insert_before(parent, child, before) /* (parent : node, child : node, before : node) -> ui () */  {
  return (parent).insertBefore(child,before);
}
 
 
// Assemble boundary markers off-tree and publish them with one host mutation.
// If the final append/insert throws, neither endpoint has become observable in
// the target DOM.
export function dom_append_marker_pair(parent, first, last) /* (parent : node, first : node, last : node) -> ui () */  {
  return (function(){ var rangeFirst=first; var rangeLast=last; var fragment=document.createDocumentFragment(); fragment.appendChild(rangeFirst); fragment.appendChild(rangeLast); try { (parent).appendChild(fragment); } catch(error) { try { if(rangeFirst.parentNode) Node.prototype.removeChild.call(rangeFirst.parentNode,rangeFirst); } catch(_) {} try { if(rangeLast.parentNode) Node.prototype.removeChild.call(rangeLast.parentNode,rangeLast); } catch(_) {} throw error; } })();
}
 
export function dom_insert_marker_pair_before(parent, first, last, before) /* (parent : node, first : node, last : node, before : node) -> ui () */  {
  return (function(){ var rangeFirst=first; var rangeLast=last; var fragment=document.createDocumentFragment(); fragment.appendChild(rangeFirst); fragment.appendChild(rangeLast); try { (parent).insertBefore(fragment,before); } catch(error) { try { if(rangeFirst.parentNode) Node.prototype.removeChild.call(rangeFirst.parentNode,rangeFirst); } catch(_) {} try { if(rangeLast.parentNode) Node.prototype.removeChild.call(rangeLast.parentNode,rangeLast); } catch(_) {} throw error; } })();
}
 
export function dom_same_node(left, right) /* (left : node, right : node) -> bool */  {
  return (left === right);
}
 
 
// Validate a complete managed range before exposing either cursor.  The DOM
// can be mutated by application JavaScript, custom-element callbacks, or test
// fault injection, so reconciliation never trusts retained marker handles.
export function dom_range_first(parent, first, last) /* (parent : node, first : node, last : node) -> ui node */  {
  return (function(rangeParent,rangeFirst,rangeLast){ if(!rangeParent || !rangeFirst || !rangeLast || rangeFirst===rangeLast || rangeFirst.parentNode!==rangeParent || rangeLast.parentNode!==rangeParent){ throw new Error('invalid Kokaine DOM range: endpoints do not share the expected parent'); } var n=rangeFirst; while(n && n!==rangeLast) n=n.nextSibling; if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } return rangeFirst.nextSibling; })(parent,first,last);
}
 
export function dom_range_next(parent, first, last) /* (parent : node, first : node, last : node) -> ui node */  {
  return (function(rangeParent,rangeFirst,rangeLast){ if(!rangeParent || !rangeFirst || !rangeLast || rangeFirst===rangeLast || rangeFirst.parentNode!==rangeParent || rangeLast.parentNode!==rangeParent){ throw new Error('invalid Kokaine DOM range: endpoints do not share the expected parent'); } var n=rangeFirst; while(n && n!==rangeLast) n=n.nextSibling; if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } var next=rangeLast.nextSibling; if(!next){ throw new Error('invalid Kokaine keyed DOM range: row has no following boundary'); } return next; })(parent,first,last);
}
 
 
// Move one inclusive row range with verified host operations.  Validation is
// deliberately complete before extraction.  Custom-element-shaped nodes,
// opaque shadow hosts, and opaque focused subtrees fail before movement because
// their synchronous or hidden state cannot be published atomically.  If
// extraction, insertion,
// focus restoration, or a commit-then-throw host primitive fails, every
// snapshotted node is pulled back before the original successor through the
// same-realm parent prototype.  No node is cloned, so ordinary object identity,
// listeners, form values, and owner registrations are retained.
export function dom_validate_range_move_lifecycle(parent, first, last) /* (parent : node, first : node, last : node) -> ui () */  {
  return (function(rangeParent,rangeFirst,rangeLast){ var doc=rangeParent && (rangeParent.nodeType===9 ? rangeParent : rangeParent.ownerDocument); var view=doc && doc.defaultView; var tracker=globalThis[Symbol.for('kokaine.dom.shadow-roots')]; var state=view && tracker && tracker.realms && tracker.realms.get(view); var prototype=view && view.Element && view.Element.prototype; var intact=state && state.prototype===prototype && (state.wrapper ? prototype.attachShadow===state.wrapper : typeof prototype.attachShadow!=='function'); if(!tracker || tracker.version!==1 || !tracker.known || !tracker.closed || !state || !intact) throw new Error('cannot safely move keyed row: shadow-root tracking is unavailable'); var documentPrototype=view.Document && view.Document.prototype; var createElement=documentPrototype && documentPrototype.createElement; var createElementNS=documentPrototype && documentPrototype.createElementNS; var outerHTMLDescriptor=prototype && Object.getOwnPropertyDescriptor(prototype,'outerHTML'); var serializeOuterHTML=outerHTMLDescriptor && outerHTMLDescriptor.get; if(typeof createElement!=='function' || typeof createElementNS!=='function' || typeof serializeOuterHTML!=='function') throw new Error('cannot safely move keyed row: native element inspection is unavailable'); function canHostShadow(element){ var name=element.localName || ''; return name.indexOf('-')>=0 || ['article','aside','blockquote','body','div','footer','h1','h2','h3','h4','h5','h6','header','main','nav','p','section','span'].indexOf(name)>=0; } function hasCustomPrototype(element){ var name=element.localName || ''; if(name.indexOf('-')>=0) return true; var namespace=element.namespaceURI; var baseline=namespace ? createElementNS.call(doc,namespace,name) : createElement.call(doc,name); return Object.getPrototypeOf(element)!==Object.getPrototypeOf(baseline); } function hasSerializedIsValue(element){ var serialized=serializeOuterHTML.call(element); var end=serialized.indexOf('>'); return end>=0 && serialized.slice(0,end).indexOf(' is="')>=0; } var pending=[]; var n=rangeFirst; while(n){ pending.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast) throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); while(pending.length){ var current=pending.pop(); if(current && current.nodeType===1){ if(!(current instanceof view.Element)) throw new Error('cannot safely move keyed row: foreign-realm element lifecycle state is opaque'); var customized=current.getAttribute('is'); if(customized || hasCustomPrototype(current) || hasSerializedIsValue(current)) throw new Error('cannot safely move keyed row: custom-element move callbacks are synchronous and cannot be atomically published'); if(tracker.closed.has(current)) throw new Error('cannot safely move keyed row: closed shadow roots are opaque'); if(state.wrapper && !current.shadowRoot && canHostShadow(current) && !tracker.known.has(current)) throw new Error('cannot safely move keyed row: an external shadow host may contain an untracked closed root'); } var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; if(current && current.shadowRoot) children=children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes)); for(var i=0;i<children.length;i++) pending.push(children[i]); } })(parent,first,last);
}
 
export function dom_validate_range_move_focus(parent, first, last) /* (parent : node, first : node, last : node) -> ui () */  {
  return (function(rangeParent,rangeFirst,rangeLast){ var rangeDocument=rangeParent && (rangeParent.nodeType===9 ? rangeParent : rangeParent.ownerDocument); var rangeView=rangeDocument && rangeDocument.defaultView; if(!rangeDocument || !rangeView) throw new Error('cannot inspect keyed-row focus outside a DOM realm'); function movePrimitive(parent){ if(rangeView.Document && parent instanceof rangeView.Document && typeof rangeView.Document.prototype.moveBefore==='function') return rangeView.Document.prototype.moveBefore; if(rangeView.DocumentFragment && parent instanceof rangeView.DocumentFragment && typeof rangeView.DocumentFragment.prototype.moveBefore==='function') return rangeView.DocumentFragment.prototype.moveBefore; if(rangeView.Element && parent instanceof rangeView.Element && typeof rangeView.Element.prototype.moveBefore==='function') return rangeView.Element.prototype.moveBefore; return null; } var primitive=movePrimitive(rangeParent); if(primitive && rangeParent.moveBefore===primitive) return; var pending=[]; var all=[]; var n=rangeFirst; while(n){ pending.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast) throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); while(pending.length){ var current=pending.pop(); all.push(current); var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; if(current && current.shadowRoot) children=children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes)); for(var i=0;i<children.length;i++) pending.push(children[i]); } var active=rangeDocument.activeElement; while(active && active.shadowRoot && active.shadowRoot.activeElement) active=active.shadowRoot.activeElement; if(!active || all.indexOf(active)<0) return; if(active.localName==='iframe') throw new Error('cannot safely move keyed row: fallback DOM moves cannot inspect the focused subtree'); if(typeof active.selectionStart==='number' && typeof active.selectionEnd==='number') return; var selectionRoot=active.getRootNode ? active.getRootNode() : rangeDocument; if(selectionRoot && selectionRoot.host && typeof selectionRoot.getSelection!=='function') throw new Error('cannot safely move keyed row: this browser cannot inspect shadow-root selections'); var selection=selectionRoot && typeof selectionRoot.getSelection==='function' ? selectionRoot.getSelection() : rangeDocument.getSelection(); if(selection && selection.rangeCount>0 && typeof selection.setBaseAndExtent!=='function') throw new Error('cannot safely move keyed row: this browser cannot restore directional DOM selections'); })(parent,first,last);
}
 
export function dom_capture_range_focus(parent, first, last) /* (parent : node, first : node, last : node) -> ui any */  {
  return (function(rangeParent,rangeFirst,rangeLast){ var rangeDocument=rangeParent && (rangeParent.nodeType===9 ? rangeParent : rangeParent.ownerDocument); if(!rangeDocument) throw new Error('cannot capture keyed-row focus without an owner document'); var nodes=[]; var n=rangeFirst; while(n){ nodes.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast) throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); function deepActive(){ var active=rangeDocument.activeElement; while(active && active.shadowRoot && active.shadowRoot.activeElement) active=active.shadowRoot.activeElement; return active; } function composedParent(node){ if(!node) return null; if(node.parentNode) return node.parentNode; var tree=node.getRootNode ? node.getRootNode() : null; return tree && tree.host ? tree.host : null; } function belongs(node){ var current=node; while(current){ if(nodes.indexOf(current)>=0) return true; current=composedParent(current); } return false; } function sameControlSelection(active,selection){ return active.selectionStart===selection[0] && active.selectionEnd===selection[1] && active.selectionDirection===selection[2]; } function sameDomSelection(selection,snapshot){ return selection.anchorNode===snapshot[0] && selection.anchorOffset===snapshot[1] && selection.focusNode===snapshot[2] && selection.focusOffset===snapshot[3]; } var active=deepActive(); var ownsFocus=!!active && belongs(active); var controlSelection=null; var domSelection=null; if(ownsFocus && typeof active.selectionStart==='number' && typeof active.selectionEnd==='number'){ controlSelection=[active.selectionStart,active.selectionEnd,active.selectionDirection]; } else if(ownsFocus){ var selectionRoot=active.getRootNode ? active.getRootNode() : rangeDocument; var selection=selectionRoot && typeof selectionRoot.getSelection==='function' ? selectionRoot.getSelection() : rangeDocument.getSelection(); if(selection && selection.rangeCount>0 && belongs(selection.anchorNode) && belongs(selection.focusNode)){ domSelection=[selection.anchorNode,selection.anchorOffset,selection.focusNode,selection.focusOffset]; } } return { restore:function(){ if(!ownsFocus) return; if(!active.isConnected) throw new Error('cannot restore keyed-row focus: the focused node was detached'); if(deepActive()!==active){ if(typeof active.focus!=='function') throw new Error('cannot restore keyed-row focus: the focused node is not focusable'); try { active.focus({ preventScroll:true }); } catch(_) { active.focus(); } if(deepActive()!==active) throw new Error('cannot restore keyed-row focus: focus restoration did not take effect'); } if(controlSelection){ if(typeof active.setSelectionRange!=='function') throw new Error('cannot restore keyed-row selection: the focused control has no selection API'); if(!sameControlSelection(active,controlSelection)) active.setSelectionRange(controlSelection[0],controlSelection[1],controlSelection[2]); if(!sameControlSelection(active,controlSelection)) throw new Error('cannot restore keyed-row selection: control selection restoration did not take effect'); } else if(domSelection){ if(!domSelection[0].isConnected || !domSelection[2].isConnected) throw new Error('cannot restore keyed-row selection: a selection endpoint was detached'); var selectionRoot=active.getRootNode ? active.getRootNode() : rangeDocument; var selection=selectionRoot && typeof selectionRoot.getSelection==='function' ? selectionRoot.getSelection() : rangeDocument.getSelection(); if(!selection || typeof selection.setBaseAndExtent!=='function') throw new Error('cannot restore keyed-row selection: the directional selection API is unavailable'); if(!sameDomSelection(selection,domSelection)) selection.setBaseAndExtent(domSelection[0],domSelection[1],domSelection[2],domSelection[3]); if(!sameDomSelection(selection,domSelection)) throw new Error('cannot restore keyed-row selection: DOM selection restoration did not take effect'); } } }; })(parent,first,last);
}
 
export function dom_move_range_before(parent, first, last, before, focus) /* (parent : node, first : node, last : node, before : node, focus : any) -> ui () */  {
  return (function(rangeParent,rangeFirst,rangeLast,target,focusState){ if(!rangeParent || !rangeFirst || !rangeLast || !target || rangeFirst===rangeLast || rangeFirst.parentNode!==rangeParent || rangeLast.parentNode!==rangeParent || target.parentNode!==rangeParent){ throw new Error('invalid Kokaine DOM move: range and target must share the expected parent'); } var rangeDocument=rangeParent.nodeType===9 ? rangeParent : rangeParent.ownerDocument; var rangeView=rangeDocument && rangeDocument.defaultView; if(!rangeDocument || !rangeView || !rangeView.Node) throw new Error('cannot move a keyed row outside a DOM realm'); var nodePrototype=rangeView.Node.prototype; function movePrimitive(parent){ if(rangeView.Document && parent instanceof rangeView.Document && typeof rangeView.Document.prototype.moveBefore==='function') return rangeView.Document.prototype.moveBefore; if(rangeView.DocumentFragment && parent instanceof rangeView.DocumentFragment && typeof rangeView.DocumentFragment.prototype.moveBefore==='function') return rangeView.DocumentFragment.prototype.moveBefore; if(rangeView.Element && parent instanceof rangeView.Element && typeof rangeView.Element.prototype.moveBefore==='function') return rangeView.Element.prototype.moveBefore; return null; } var nodes=[]; var n=rangeFirst; while(n){ nodes.push(n); if(n===rangeLast) break; n=n.nextSibling; } if(n!==rangeLast){ throw new Error('invalid Kokaine DOM move: closing marker is not reachable after opening marker'); } if(nodes.indexOf(target)>=0){ throw new Error('invalid Kokaine DOM move: target lies inside the moved range'); } if(rangeLast.nextSibling===target) return; var originalNext=rangeLast.nextSibling; var nativeMove=movePrimitive(rangeParent); var preserveMoves=!!nativeMove && rangeParent.moveBefore===nativeMove; function restoreFocus(){ if(focusState && typeof focusState.restore==='function') focusState.restore(); } function gather(values){ var fragment=rangeDocument.createDocumentFragment(); for(var i=0;i<values.length;i++) nodePrototype.appendChild.call(fragment,values[i]); return fragment; } function place(anchor){ if(preserveMoves){ for(var i=0;i<nodes.length;i++) nativeMove.call(rangeParent,nodes[i],anchor); } else { rangeParent.insertBefore(gather(nodes),anchor); } } function detachMoved(){ var passes=Math.max(2,nodes.length+2); while(passes-- > 0){ var attached=false; for(var i=0;i<nodes.length;i++){ var parent=nodes[i].parentNode; if(parent){ attached=true; nodePrototype.removeChild.call(parent,nodes[i]); } } if(!attached) return; } throw new Error('a retired keyed range was synchronously reinserted'); } function verify(anchor){ for(var i=0;i<nodes.length;i++){ if(nodes[i].parentNode!==rangeParent) throw new Error('a moved node escaped its keyed range'); if(i>0 && nodes[i-1].nextSibling!==nodes[i]) throw new Error('the keyed range became non-contiguous'); } if(nodes[nodes.length-1].nextSibling!==anchor) throw new Error('the keyed range was not placed at its requested boundary'); } function rollback(){ if(originalNext && originalNext.parentNode!==rangeParent){ detachMoved(); throw new Error('the original keyed range successor was detached'); } var anchor=originalNext || null; if(preserveMoves){ for(var i=0;i<nodes.length;i++) nativeMove.call(rangeParent,nodes[i],anchor); } else { nodePrototype.insertBefore.call(rangeParent,gather(nodes),anchor); } restoreFocus(); verify(anchor); } try { place(target); restoreFocus(); verify(target); } catch(error) { try { rollback(); } catch(rollbackError) { throw new Error(String(error && error.message != null ? error.message : error) + '; keyed DOM move rollback failed: ' + String(rollbackError && rollbackError.message != null ? rollbackError.message : rollbackError)); } throw error; } })(parent,first,last,before,focus);
}
 
export function dom_set_text(value, content) /* (value : node, content : string) -> ui () */  {
  return ((value).data = content);
}
 
export function dom_set_attribute(value, name, content) /* (value : element, name : string, content : string) -> ui () */  {
  return (value).setAttribute(name,content);
}
 
export function dom_remove_attribute(value, name) /* (value : element, name : string) -> ui () */  {
  return (value).removeAttribute(name);
}
 
export function dom_set_string_property(value, name, content) /* (value : element, name : string, content : string) -> ui () */  {
  return ((value)[name] = content);
}
 
export function dom_set_bool_property(value, name, content) /* (value : element, name : string, content : bool) -> ui () */  {
  return ((value)[name] = content);
}
 
export function dom_set_int_property(value, name, content) /* (value : element, name : string, content : string) -> ui () */  {
  return ((value)[name] = Number(content));
}
 
export function dom_clean_range(first, last, inclusive) /* (first : node, last : node, inclusive : bool) -> ui () */  {
  return (function(){ var rangeFirst=first; var rangeLast=last; var includeEndpoints=inclusive; var firstParent=rangeFirst && rangeFirst.parentNode; var lastParent=rangeLast && rangeLast.parentNode; if(!firstParent && !lastParent) return; if(!firstParent || firstParent!==lastParent || rangeFirst===rangeLast){ throw new Error('invalid Kokaine DOM range: endpoints do not share a parent'); } var roots=[]; var n=includeEndpoints ? rangeFirst : rangeFirst.nextSibling; while(n && n!==rangeLast){ roots.push(n); n=n.nextSibling; } if(n!==rangeLast){ throw new Error('invalid Kokaine DOM range: closing marker is not reachable after opening marker'); } if(includeEndpoints) roots.push(rangeLast); var descendants=[]; var pending=roots.slice(); while(pending.length){ var current=pending.pop(); var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; if(current && current.shadowRoot) children=children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes)); for(var i=0;i<children.length;i++){ descendants.push(children[i]); pending.push(children[i]); } } function retained(node){ var current=node; while(current){ for(var i=0;i<roots.length;i++){ if(roots[i]===current || Node.prototype.contains.call(roots[i],current)) return true; } var tree=current.getRootNode ? current.getRootNode() : null; current=tree && tree.host ? tree.host : null; } return false; } var passes=Math.max(2,roots.length+descendants.length+2); while(passes-- > 0){ var attached=false; for(var i=0;i<roots.length;i++){ var parent=roots[i].parentNode; if(parent){ attached=true; Node.prototype.removeChild.call(parent,roots[i]); } } for(var j=0;j<descendants.length;j++){ var childParent=descendants[j].parentNode; if(childParent && !retained(descendants[j])){ attached=true; Node.prototype.removeChild.call(childParent,descendants[j]); } } if(!attached) return; } for(var i=0;i<roots.length;i++){ if(roots[i].parentNode){ throw new Error('invalid Kokaine DOM cleanup: a removed node was synchronously reinserted'); } } for(var j=0;j<descendants.length;j++){ if(descendants[j].parentNode && !retained(descendants[j])){ throw new Error('invalid Kokaine DOM cleanup: a removed descendant escaped its range'); } } })();
}
 
export function dom_clear_between(first, last) /* (first : node, last : node) -> ui () */  {
  return dom_clean_range(first, last, false);
}
 
export function dom_remove_range(first, last) /* (first : node, last : node) -> ui () */  {
  return dom_clean_range(first, last, true);
}
 
 
// Validate and snapshot an inclusive row range without changing the DOM.
export function dom_stage_retirement(first, last) /* (first : node, last : node) -> ui dom-retirement */  {
  return (function(){ var rangeFirst=first; var rangeLast=last; var parent=rangeFirst && rangeFirst.parentNode; if(!parent) throw new Error('invalid Kokaine keyed retirement range: opening marker is detached'); if(parent!==rangeLast.parentNode) throw new Error('invalid Kokaine keyed retirement range: endpoints have different parents'); if(rangeFirst===rangeLast) throw new Error('invalid Kokaine keyed retirement range: endpoints are identical'); var roots=[]; var node=rangeFirst; while(node){ roots.push(node); if(node===rangeLast) break; node=node.nextSibling; } if(node!==rangeLast) throw new Error('invalid Kokaine keyed retirement range: closing marker is unreachable'); var descendants=[]; var pending=roots.slice(); while(pending.length){ var current=pending.pop(); var children=current && current.childNodes ? Array.prototype.slice.call(current.childNodes) : []; if(current && current.shadowRoot) children=children.concat(Array.prototype.slice.call(current.shadowRoot.childNodes)); for(var i=0;i<children.length;i++){ descendants.push(children[i]); pending.push(children[i]); } } var doc=rangeFirst.ownerDocument; var view=doc && doc.defaultView; var proto=view && view.Node && view.Node.prototype; if(!proto || typeof proto.removeChild!=='function' || typeof proto.contains!=='function') throw new Error('cannot stage Kokaine keyed retirement without its DOM realm'); return { roots:roots, descendants:descendants, proto:proto }; })();
}
 
 
// Detach a staged snapshot. If a host primitive throws before detaching its
// target, stop immediately so the complete remaining row stays retryable. A
// commit-then-throw is recognized by inspecting the target after the throw.
export function dom_run_retirement(value) /* (value : dom-retirement) -> ui () */  {
  return (function(handle){ if(!handle || !handle.roots) return; var roots=handle.roots; var descendants=handle.descendants; var proto=handle.proto; var removeChild=proto && proto.removeChild; var contains=proto && proto.contains; if(typeof removeChild!=='function' || typeof contains!=='function') throw new Error('cannot run Kokaine keyed retirement without its DOM realm'); function retained(node){ var current=node; while(current){ for(var i=0;i<roots.length;i++){ if(roots[i]===current || contains.call(roots[i],current)) return true; } var tree=current.getRootNode ? current.getRootNode() : null; current=tree && tree.host ? tree.host : null; } return false; } function detach(node,escaped){ var parent=node && node.parentNode; if(!parent || (escaped && retained(node))) return; try { removeChild.call(parent,node); } catch(error) { if(node.parentNode && (!escaped || !retained(node))) throw error; } } var passes=Math.max(2,roots.length+descendants.length+2); while(passes-- > 0){ for(var i=0;i<roots.length;i++) detach(roots[i],false); for(var j=0;j<descendants.length;j++) detach(descendants[j],true); var pending=false; for(var r=0;r<roots.length;r++){ if(roots[r].parentNode){ pending=true; break; } } if(!pending){ for(var d=0;d<descendants.length;d++){ if(descendants[d].parentNode && !retained(descendants[d])){ pending=true; break; } } } if(!pending) return; } throw new Error('invalid Kokaine DOM cleanup: staged keyed nodes were synchronously reinserted'); })(value);
}
 
export function dom_release_retirement(value) /* (value : dom-retirement) -> ui () */  {
  return (function(handle){ if(!handle) return; handle.roots=null; handle.descendants=null; handle.proto=null; })(value);
}
 
export function dom_append_html(parent, content, root, portal) /* (parent : node, content : string, root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>) -> ui dom-owner-registration */  {
  return (function(parent){ var doc=parent && (parent.nodeType===9 ? parent : parent.ownerDocument); if(!doc) throw new Error('cannot create Kokaine trusted HTML without an owner document'); var template=doc.createElement('template'); template.innerHTML=content; var tracker=globalThis[Symbol.for('kokaine.dom.shadow-roots')]; if(!tracker || typeof tracker.remember!=='function') throw new Error('cannot register Kokaine trusted HTML without shadow-root tracking'); tracker.remember(template.content); var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(root); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(root,ownerId); } var handles=[]; Array.from(template.content.childNodes).forEach(function(child){ var entry={ ownerId:ownerId, portal:portal, retired:false }; registry.owners.set(child,entry); handles.push({ node:child, ownerId:ownerId, entry:entry }); }); try { parent.appendChild(template.content); return handles; } catch(error) { handles.forEach(function(handle){ var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry.owners.get(handle.node)===entry) registry.owners.set(handle.node,entry); handle.node=null; handle.entry=null; }); throw error; } })(parent);
}
 
export function dom_insert_html_before(parent, before, content, root, portal) /* (parent : node, before : node, content : string, root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>) -> ui dom-owner-registration */  {
  return (function(parent,before){ var doc=parent && (parent.nodeType===9 ? parent : parent.ownerDocument); if(!doc) throw new Error('cannot create Kokaine trusted HTML without an owner document'); var template=doc.createElement('template'); template.innerHTML=content; var tracker=globalThis[Symbol.for('kokaine.dom.shadow-roots')]; if(!tracker || typeof tracker.remember!=='function') throw new Error('cannot register Kokaine trusted HTML without shadow-root tracking'); tracker.remember(template.content); var key=Symbol.for('kokaine.dom.owners'); var registry=globalThis[key]; if(!registry || !registry.owners || !registry.roots){ registry={ owners:new WeakMap(), roots:new WeakMap(), nextId:1 }; globalThis[key]=registry; } var ownerId=registry.roots.get(root); if(ownerId==null){ ownerId=registry.nextId++; registry.roots.set(root,ownerId); } var handles=[]; Array.from(template.content.childNodes).forEach(function(child){ var entry={ ownerId:ownerId, portal:portal, retired:false }; registry.owners.set(child,entry); handles.push({ node:child, ownerId:ownerId, entry:entry }); }); try { parent.insertBefore(template.content,before); return handles; } catch(error) { handles.forEach(function(handle){ var entry=handle.entry; if(entry){ entry.portal=null; entry.retired=true; } if(registry.owners.get(handle.node)===entry) registry.owners.set(handle.node,entry); handle.node=null; handle.entry=null; }); throw error; } })(parent,before);
}
 
export function dom_listen(value, name, action) /* (value : element, name : string, action : (raw-event) -> ui ()) -> ui dom-listener */  {
  return (function(){ var state={ action:action }; var f=function(ev){ var current=state.action; return current ? current(ev) : undefined; }; f.__kokaineListenerState=state; try { (value).addEventListener(name,f); return f; } catch(error) { state.action=null; try { (value).removeEventListener(name,f); } catch(_) {} throw error; } })();
}
 
 
// Drop the Koka closure before asking an unreliable host to detach the ABI
// trampoline. A callback retained after failed removal is then inert and no
// longer keeps the root, structural portal, or event K reachable.
export function dom_retire_listener(listener) /* (listener : dom-listener) -> ui () */  {
  return (function(){ var state=(listener).__kokaineListenerState; if(state) state.action=null; })();
}
 
export function dom_unlisten(value, name, listener) /* (value : element, name : string, listener : dom-listener) -> ui () */  {
  return (value).removeEventListener(name,listener);
}
 
export function raw_event_value(value) /* (value : raw-event) -> ui string */  {
  return (function(){ var t=(value).currentTarget || (value).target; return (t && t.value != null ? String(t.value) : ''); })();
}
 
export function raw_event_checked(value) /* (value : raw-event) -> ui bool */  {
  return (function(){ var t=(value).currentTarget || (value).target; return !!(t && t.checked); })();
}
 
export function raw_event_key(value) /* (value : raw-event) -> ui string */  {
  return String((value).key == null ? '' : (value).key);
}
 
export function raw_event_any(value) /* (value : raw-event) -> any */  {
  return value;
}
 
export function event_prevent_default(value) /* (value : any) -> ui () */  {
  return (value).preventDefault();
}
 
export function event_stop_propagation(value) /* (value : any) -> ui () */  {
  return (value).stopPropagation();
}
 
 
// Validate and invoke within one host action. The surrounding `dom-attempt`
// then translates both adapter validation failures and native DOM exceptions.
// Native Web IDL getters provide realm-neutral brand checks: unlike
// `instanceof`, they accept genuine nodes created by another same-origin realm.
export function dom_require_dialog_target(target, message) /* (target : node, message : string) -> ui () */  {
  return (function(target,message){ if(typeof HTMLDialogElement !== 'function') throw new Error('HTMLDialogElement is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,'open'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('HTMLDialogElement.open is not supported by this browser'); try { Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError(message); } })(target,message);
}
 
export function dom_require_element_target(target, message) /* (target : node, message : string) -> ui () */  {
  return (function(target,message){ if(typeof Element !== 'function') throw new Error('Element is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(Element.prototype,'localName'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('Element.localName is not supported by this browser'); try { Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError(message); } })(target,message);
}
 
 
// Read the platform reflection getter directly. An own `popover` class field on
// a custom element must neither hide a real content attribute nor manufacture
// popover state where the browser has none.
export function dom_require_popover_target(target, message) /* (target : node, message : string) -> ui () */  {
  return (function(target,message){ if(typeof HTMLElement !== 'function') throw new Error('HTMLElement is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(HTMLElement.prototype,'popover'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('HTMLElement.popover is not supported by this browser'); var mode; try { mode=Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError(message); } if(mode!=='auto' && mode!=='manual' && mode!=='hint') throw new TypeError(message); })(target,message);
}
 
export function dom_dialog_show(target) /* (target : node) -> ui () */  {
  return (function(target){ if(typeof target.show !== 'function') throw new Error('HTMLDialogElement.show() is not supported by this browser'); target.show(); })(target);
}
 
export function dom_dialog_show_modal(target) /* (target : node) -> ui () */  {
  return (function(target){ if(typeof target.showModal !== 'function') throw new Error('HTMLDialogElement.showModal() is not supported by this browser'); target.showModal(); })(target);
}
 
export function dom_dialog_close(target, result) /* (target : node, result : string) -> ui () */  {
  return (function(target,result){ if(typeof target.close !== 'function') throw new Error('HTMLDialogElement.close() is not supported by this browser'); target.close(result); })(target,result);
}
 
 
// `close()` cannot emulate the cancellable `cancel` event from requestClose.
export function dom_dialog_request_close(target, result) /* (target : node, result : string) -> ui () */  {
  return (function(target,result){ if(typeof target.requestClose !== 'function') throw new Error('HTMLDialogElement.requestClose() is not supported by this browser'); target.requestClose(result); })(target,result);
}
 
export function dom_dialog_is_open(target) /* (target : node) -> ui bool */  {
  return !!(target).open;
}
 
export function dom_dialog_is_modal(target) /* (target : node) -> ui bool */  {
  return (function(target){ if(typeof Element !== 'function' || typeof Element.prototype.matches !== 'function') throw new Error('Element.matches() is not supported by this browser'); try { return Reflect.apply(Element.prototype.matches,target,[':modal']); } catch(error) { if(!error || error.name!=='SyntaxError') throw error; } if(typeof HTMLDialogElement !== 'function') throw new Error('HTMLDialogElement is not supported by this browser'); var openDescriptor=Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,'open'); var showModal=HTMLDialogElement.prototype.showModal; if(!openDescriptor || typeof openDescriptor.get!=='function') throw new Error('HTMLDialogElement.open is not supported by this browser'); if(typeof showModal!=='function') throw new Error('HTMLDialogElement.showModal() is not supported by this browser'); if(!Reflect.apply(openDescriptor.get,target,[])) return false; try { Reflect.apply(showModal,target,[]); return true; } catch(error) { if(error && error.name==='InvalidStateError') return false; throw error; } })(target);
}
 
export function dom_dialog_return_value(target) /* (target : node) -> ui string */  {
  return String((target).returnValue);
}
 
 
// A recognized reflected `popover` value distinguishes enabled elements from
// arbitrary nodes. Do not infer state or simulate unsupported native methods.
export function dom_popover_show(target) /* (target : node) -> ui () */  {
  return (function(target){ if(typeof target.showPopover !== 'function') throw new Error('Element.showPopover() is not supported by this browser'); target.showPopover(); })(target);
}
 
export function dom_popover_hide(target) /* (target : node) -> ui () */  {
  return (function(target){ if(typeof target.hidePopover !== 'function') throw new Error('Element.hidePopover() is not supported by this browser'); target.hidePopover(); })(target);
}
 
 
// Some older implementations return `undefined`; querying the selector after
// the call gives Koka the authoritative post-toggle state in every case.
export function dom_popover_toggle(target) /* (target : node) -> ui bool */  {
  return (function(target){ if(typeof target.togglePopover !== 'function') throw new Error('Element.togglePopover() is not supported by this browser'); target.togglePopover(); if(typeof target.matches !== 'function') throw new Error('Element.matches() is not supported by this browser'); return target.matches(':popover-open'); })(target);
}
 
 
// The force overload arrived after the core Popover API. Compare state first so
// older implementations which ignore that argument still provide a true setter.
// A same-state force call still performs native validity checks; delegate an
// invalid case to the unforced method so its DOMException is not suppressed.
// `:modal` covers modal dialogs and the target's own fullscreen flag. Unlike
// `:fullscreen`, it does not match a retargeted shadow host.
export function dom_popover_set_open(target, open) /* (target : node, open : bool) -> ui () */  {
  return (function(target,open){ if(typeof target.togglePopover !== 'function') throw new Error('Element.togglePopover() is not supported by this browser'); if(typeof Node !== 'function') throw new Error('Node is not supported by this browser'); if(typeof Document !== 'function') throw new Error('Document is not supported by this browser'); if(typeof Element !== 'function' || typeof Element.prototype.matches !== 'function') throw new Error('Element.matches() is not supported by this browser'); var connectedDescriptor=Object.getOwnPropertyDescriptor(Node.prototype,'isConnected'); var documentDescriptor=Object.getOwnPropertyDescriptor(Node.prototype,'ownerDocument'); var viewDescriptor=Object.getOwnPropertyDescriptor(Document.prototype,'defaultView'); if(!connectedDescriptor || typeof connectedDescriptor.get!=='function') throw new Error('Node.isConnected is not supported by this browser'); if(!documentDescriptor || typeof documentDescriptor.get!=='function') throw new Error('Node.ownerDocument is not supported by this browser'); if(!viewDescriptor || typeof viewDescriptor.get!=='function') throw new Error('Document.defaultView is not supported by this browser'); var nativeMatches=Element.prototype.matches; var matches=function(selector){ return Reflect.apply(nativeMatches,target,[selector]); }; var current=matches(':popover-open'); var desired=!!open; if(current!==desired){ target.togglePopover(); return; } if(desired){ if(typeof target.showPopover !== 'function') throw new Error('Element.showPopover() is not supported by this browser'); target.showPopover(); return; } var doc=Reflect.apply(documentDescriptor.get,target,[]); var view=Reflect.apply(viewDescriptor.get,doc,[]); var connected=Reflect.apply(connectedDescriptor.get,target,[]); var inactive=!connected || !view; if(!inactive){ try { if(view.document!==doc) inactive=true; while(!inactive && view.parent!==view){ var parent=view.parent; var listed=false; for(var i=0;i<parent.length;i++){ if(parent[i]===view){ listed=true; break; } } if(!listed){ inactive=true; break; } view=parent; } } catch(_) { inactive=true; } } if(inactive || matches(':modal')) target.togglePopover(); })(target,open);
}
 
export function dom_popover_is_open(target) /* (target : node) -> ui bool */  {
  return (function(target){ if(typeof target.matches !== 'function') throw new Error('Element.matches() is not supported by this browser'); return target.matches(':popover-open'); })(target);
}
 
export function dom_toggle_state(value) /* (value : any) -> ui int */  {
  return (function(event){ if(!event || typeof event!=='object') throw new TypeError('toggle/state requires a DOM event'); if(event.type!=='toggle' && event.type!=='beforetoggle') throw new TypeError('toggle/state requires a toggle or beforetoggle event'); var target=event.currentTarget; if(typeof Element !== 'function') throw new Error('Element is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(Element.prototype,'localName'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('Element.localName is not supported by this browser'); try { Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError('toggle/state event must have an Element currentTarget'); } if(event.newState==='open') return 1; if(event.newState==='closed') return 0; throw new TypeError('toggle/state event must have an open or closed newState'); })(value);
}
 
export function dom_dialog_event_return_value(value) /* (value : any) -> ui string */  {
  return (function(event){ if(!event || typeof event!=='object' || event.type!=='close') throw new TypeError('dialog/event-return-value requires a close event'); var target=event.currentTarget; if(typeof HTMLDialogElement !== 'function') throw new Error('HTMLDialogElement is not supported by this browser'); var descriptor=Object.getOwnPropertyDescriptor(HTMLDialogElement.prototype,'open'); if(!descriptor || typeof descriptor.get!=='function') throw new Error('HTMLDialogElement.open is not supported by this browser'); try { Reflect.apply(descriptor.get,target,[]); } catch(_) { throw new TypeError('dialog/event-return-value event must have an HTMLDialogElement currentTarget'); } return String(target.returnValue); })(value);
}
 
export function dom_report_error(message) /* (message : string) -> ui () */  {
  return console.error(message);
}
 
export function dom_attempt(action) /* forall<a> (action : () -> ui a) -> <ui,exn> a */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, action);
  var _x24 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x24) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_query_11401(selector, result) /* (selector : string, result : any) -> <ui,exn> node */  {
  var _x25 = $std_core_hnd._open_none1(any_is_null, result);
  if (_x25) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("DOM selector did not match: ", selector));
  }
  else {
    return $std_core_hnd._open_none1(any_node, result);
  }
}
 
export function query(selector) /* (selector : string) -> <exn,ui> node */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return query_raw(selector);
    });
   
  var _x26 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x26) {
    var x_11594 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11594 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(result_0 /* any */ ) {
      return _mlift_query_11401(selector, result_0);
    });
  }
  else {
    var _x26 = $std_core_hnd._open_none1(any_is_null, x_11594);
    if (_x26) {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("DOM selector did not match: ", selector));
    }
    else {
      return $std_core_hnd._open_none1(any_node, x_11594);
    }
  }
}
 
export function body() /* () -> <exn,ui> node */  {
  return query("body");
}
 
export function prevent_default(value) /* (value : kokaine/html/event) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      var _x27 = value.original;
      return event_prevent_default(_x27);
    });
  var _x27 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x27) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function stop_propagation(value) /* (value : kokaine/html/event) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      var _x28 = value.original;
      return event_stop_propagation(_x28);
    });
  var _x28 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x28) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_show(target) /* (target : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/show target must be an HTMLDialogElement");
      return dom_dialog_show(target);
    });
  var _x29 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x29) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_show_modal(target) /* (target : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/show-modal target must be an HTMLDialogElement");
      return dom_dialog_show_modal(target);
    });
  var _x30 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x30) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_close(target, result) /* (target : node, result : ? string) -> <exn,ui> () */  {
   
  var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/close target must be an HTMLDialogElement");
      var _x31 = (result !== undefined) ? result : "";
      return dom_dialog_close(target, _x31);
    });
  var _x31 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
  if (_x31) {
    return $std_core_hnd._open_none1(dom_attempt_value, result_0);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
  }
}
 
export function dialog_fs_request_close(target, result) /* (target : node, result : ? string) -> <exn,ui> () */  {
   
  var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/request-close target must be an HTMLDialogElement");
      var _x32 = (result !== undefined) ? result : "";
      return dom_dialog_request_close(target, _x32);
    });
  var _x32 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
  if (_x32) {
    return $std_core_hnd._open_none1(dom_attempt_value, result_0);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
  }
}
 
export function dialog_fs_is_open(target) /* (target : node) -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/is-open target must be an HTMLDialogElement");
      return dom_dialog_is_open(target);
    });
  var _x33 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x33) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_is_modal(target) /* (target : node) -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/is-modal target must be an HTMLDialogElement");
      return dom_dialog_is_modal(target);
    });
  var _x34 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x34) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_return_value(target) /* (target : node) -> <exn,ui> string */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_dialog_target(target, "dialog/return-value target must be an HTMLDialogElement");
      return dom_dialog_return_value(target);
    });
  var _x35 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x35) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function dialog_fs_event_return_value(value) /* (value : kokaine/html/event) -> <exn,ui> string */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      var _x36 = value.original;
      return dom_dialog_event_return_value(_x36);
    });
  var _x36 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x36) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_show(target) /* (target : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/show target must be an Element");
       
      dom_require_popover_target(target, "popover/show target must have a valid popover attribute");
      return dom_popover_show(target);
    });
  var _x37 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x37) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_hide(target) /* (target : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/hide target must be an Element");
       
      dom_require_popover_target(target, "popover/hide target must have a valid popover attribute");
      return dom_popover_hide(target);
    });
  var _x38 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x38) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_toggle(target) /* (target : node) -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/toggle target must be an Element");
       
      dom_require_popover_target(target, "popover/toggle target must have a valid popover attribute");
      return dom_popover_toggle(target);
    });
  var _x39 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x39) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_set_open(target, open) /* (target : node, open : bool) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/set-open target must be an Element");
       
      dom_require_popover_target(target, "popover/set-open target must have a valid popover attribute");
      return dom_popover_set_open(target, open);
    });
  var _x40 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x40) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function popover_fs_is_open(target) /* (target : node) -> <exn,ui> bool */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
       
      dom_require_element_target(target, "popover/is-open target must be an Element");
       
      dom_require_popover_target(target, "popover/is-open target must have a valid popover attribute");
      return dom_popover_is_open(target);
    });
  var _x41 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x41) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function toggle_fs__mlift_state_11402(state) /* (state : int) -> <ui,exn> toggle-state */  {
  return ($std_core_types._int_eq(state,1)) ? Toggle_open : Toggle_closed;
}
 
export function toggle_fs_state(value) /* (value : kokaine/html/event) -> <exn,ui> toggle-state */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      var _x42 = value.original;
      return dom_toggle_state(_x42);
    });
   
  var _x43 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x43) {
    var x_11613 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11613 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(toggle_fs__mlift_state_11402);
  }
  else {
    return ($std_core_types._int_eq(x_11613,1)) ? Toggle_open : Toggle_closed;
  }
}
 
 
// monadic lift
export function _mlift_tracked_11403(read, _y_x10326) /* forall<a> (read : () -> kokaine/reactive/effects/signal-read a, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> a */  {
  return $std_core_hnd._mask_at(_y_x10326, false, read);
}
 
export function tracked(read) /* forall<a> (read : () -> kokaine/reactive/effects/signal-read a) -> <kokaine/reactive/effects/signal-read,pure> a */  {
   
  var x_11618 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10326 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10326, false, read);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11618, false, read);
  }
}
 
 
// monadic lift
export function _mlift_constant_track_11404(_y_x10330) /* (hnd/ev-index) -> <exn,div> () */  {
  return $std_core_hnd._mask_at(_y_x10330, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_constant_track_11405(_y_x10329) /* (hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn> () */  {
  return $std_core_hnd._mask_at(_y_x10329, false, function() {
       
      var x_11623 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_constant_track_11404);
      }
      else {
        return $std_core_hnd._mask_at(x_11623, false, function() {
            return $std_core_types.Unit;
          });
      }
    });
}
 
export function constant_track() /* () -> <pure,kokaine/reactive/effects/signal-read> () */  {
   
  var x_11625 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_constant_track_11405);
  }
  else {
    return $std_core_hnd._mask_at(x_11625, false, function() {
         
        var x_0_11628 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(_mlift_constant_track_11404);
        }
        else {
          return $std_core_hnd._mask_at(x_0_11628, false, function() {
              return $std_core_types.Unit;
            });
        }
      });
  }
}
 
 
// monadic lift
export function _mlift_reactive_ui_exn_11406(action, _y_x10333) /* forall<a,e> (action : () -> <ui,exn> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10333, false, function() {
      return $std_core_hnd._open_at0($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), action);
    });
}
 
export function reactive_ui_exn(action) /* forall<a,e> (action : () -> <ui,exn> a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11631 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10333 /* hnd/ev-index */ ) {
      return _mlift_reactive_ui_exn_11406(action, _y_x10333);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11631, false, function() {
        return $std_core_hnd._open_at0($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), action);
      });
  }
}
 
 
// monadic lift
export function _mlift_reactive_ui_exn_open_11407(action, _y_x10337) /* forall<a,e> (action : () -> <ui,exn|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10337, false, action);
}
 
export function reactive_ui_exn_open(action) /* forall<a,e> (action : () -> <ui,exn|e> a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11636 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10337 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10337, false, action);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11636, false, action);
  }
}
 
 
// monadic lift
export function _mlift_reactive_sample_11408(action, root, _y_x10340) /* forall<a> (action : () -> <kokaine/reactive/effects/signal-read,pure> a, root : kokaine/reactive/root<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> a */  {
  return $std_core_hnd._mask_at(_y_x10340, false, function() {
      return $kokaine_reactive.sample(root, action);
    });
}
 
 
// Row renderers are sampled once while their live closures retain the item and
// index accessors.  Widen the handled sample back to the DOM apply row so Koka
// does not prematurely close a surrounding lifetime-scope action at `<ui>`.
export function reactive_sample(root, action) /* forall<a> (root : kokaine/reactive/root<ui>, action : () -> <kokaine/reactive/effects/signal-read,pure> a) -> <kokaine/reactive/effects/signal-write,pure,ui> a */  {
   
  var x_11641 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10340 /* hnd/ev-index */ ) {
      return _mlift_reactive_sample_11408(action, root, _y_x10340);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11641, false, function() {
        return $kokaine_reactive.sample(root, action);
      });
  }
}
 
 
// monadic lift
export function _mlift_reactive_write_ui_11409(action, _y_x10344) /* forall<a,e> (action : () -> kokaine/reactive/effects/signal-write a, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-write|e> a */  {
  return $std_core_hnd._mask_at(_y_x10344, false, function() {
      return $std_core_hnd._open_at0($std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag), action);
    });
}
 
export function reactive_write_ui(action) /* forall<a,e> (action : () -> kokaine/reactive/effects/signal-write a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11647 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10344 /* hnd/ev-index */ ) {
      return _mlift_reactive_write_ui_11409(action, _y_x10344);
    });
  }
  else {
    return _mlift_reactive_write_ui_11409(action, x_11647);
  }
}
 
 
// monadic lift
export function _mlift_reactive_integration_11410(action, _y_x10349) /* forall<a,e> (action : () -> <div,exn,ui|e> a, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui|e> a */  {
  return $std_core_hnd._mask_at(_y_x10349, false, action);
}
 
export function reactive_integration(action) /* forall<a,e> (action : () -> <div,exn,ui|e> a) -> <kokaine/reactive/effects/signal-write,pure,ui|e> a */  {
   
  var x_11649 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10349 /* hnd/ev-index */ ) {
      return $std_core_hnd._mask_at(_y_x10349, false, action);
    });
  }
  else {
    return $std_core_hnd._mask_at(x_11649, false, action);
  }
}
 
export function insert(parent, before, child) /* (parent : node, before : maybe<node>, child : node) -> <exn,ui> () */  {
  if (before === null) {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_append(parent, child);
      });
    var _x42 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x42) {
      return $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
  }
  else {
     
    var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_insert_before(parent, child, before.value);
      });
    var _x43 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
    if (_x43) {
      return $std_core_hnd._open_none1(dom_attempt_value, result_0);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
    }
  }
}
 
export function insert_marker_pair(parent, before, first, last) /* (parent : node, before : maybe<node>, first : node, last : node) -> <exn,ui> () */  {
  if (before === null) {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_append_marker_pair(parent, first, last);
      });
    var _x44 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x44) {
      return $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
  }
  else {
     
    var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_insert_marker_pair_before(parent, first, last, before.value);
      });
    var _x45 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
    if (_x45) {
      return $std_core_hnd._open_none1(dom_attempt_value, result_0);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
    }
  }
}
 
export function range_first(parent, first, last) /* (parent : node, first : node, last : node) -> <exn,ui> node */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_range_first(parent, first, last);
    });
  var _x46 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x46) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function range_next(parent, first, last) /* (parent : node, first : node, last : node) -> <exn,ui> node */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_range_next(parent, first, last);
    });
  var _x47 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x47) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_validate_range_move_lifecycle_11411(first, last, parent, wild__) /* (first : node, last : node, parent : node, wild_ : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first, last);
    });
  var _x48 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x48) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function validate_range_move_lifecycle(parent, first, last) /* (parent : node, first : node, last : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_lifecycle(parent, first, last);
    });
   
  var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x49) {
    var x_11661 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11661 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_validate_range_move_lifecycle_11411(first, last, parent, wild__);
    });
  }
  else {
     
    var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_focus(parent, first, last);
      });
    var _x49 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
    if (_x49) {
      return $std_core_hnd._open_none1(dom_attempt_value, result_0);
    }
    else {
      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
    }
  }
}
 
 
// monadic lift
export function _mlift_move_range_before_11412(before, first, last, parent, focus) /* (before : node, first : node, last : node, parent : node, focus : any) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_move_range_before(parent, first, last, before, focus);
    });
  var _x50 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x50) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_move_range_before_11413(before, first, last, parent, wild___0) /* (before : node, first : node, last : node, parent : node, wild_@0 : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_capture_range_focus(parent, first, last);
    });
   
  var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x51) {
    var x_11667 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11667 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(focus /* any */ ) {
      return _mlift_move_range_before_11412(before, first, last, parent, focus);
    });
  }
  else {
    return _mlift_move_range_before_11412(before, first, last, parent, x_11667);
  }
}
 
 
// monadic lift
export function _mlift_move_range_before_11414(before, first, last, parent, wild__) /* (before : node, first : node, last : node, parent : node, wild_ : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first, last);
    });
   
  var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x51) {
    var x_11670 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11670 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_move_range_before_11413(before, first, last, parent, wild___0);
    });
  }
  else {
    return _mlift_move_range_before_11413(before, first, last, parent, x_11670);
  }
}
 
export function move_range_before(parent, first, last, before) /* (parent : node, first : node, last : node, before : node) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_lifecycle(parent, first, last);
    });
   
  var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x51) {
    var x_11673 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11673 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_move_range_before_11414(before, first, last, parent, wild__);
    });
  }
  else {
     
    var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_focus(parent, first, last);
      });
     
    var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
    if (_x51) {
      var x_0_11677 = $std_core_hnd._open_none1(dom_attempt_value, result_0);
    }
    else {
      var x_0_11677 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_move_range_before_11413(before, first, last, parent, wild___0);
      });
    }
    else {
       
      var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_capture_range_focus(parent, first, last);
        });
       
      var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
      if (_x51) {
        var x_1_11681 = $std_core_hnd._open_none1(dom_attempt_value, result_1);
      }
      else {
        var x_1_11681 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(focus /* any */ ) {
          return _mlift_move_range_before_11412(before, first, last, parent, focus);
        });
      }
      else {
         
        var result_2 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_move_range_before(parent, first, last, before, x_1_11681);
          });
        var _x51 = $std_core_hnd._open_none1(dom_attempt_ok, result_2);
        if (_x51) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_2);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_2)));
        }
      }
    }
  }
}
 
export function retire_owner_registration(value) /* (value : dom-owner-registration) -> <exn,ui> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_retire_owners(value);
    });
  var _x52 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x52) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_register_owner_cleanup_11415(_pat_1) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_register_owner_cleanup_11416(value, _y_x10370) /* (value : dom-owner-registration, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10370, false, function() {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_retire_owners(value);
        });
      var _x53 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x53) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    });
}
 
 
// monadic lift
export function _mlift_register_owner_cleanup_11417(committed, wild__) /* forall<_e> (committed : ref<global,bool>, wild_ : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return ((committed).value = true);
}
 
export function register_owner_cleanup(root, value) /* (root : kokaine/reactive/root<ui>, value : dom-owner-registration) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var committed = { value: false };
   
  var x_11692 = $std_core_hnd._open_at2(0, function(root_0 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value_3 /* kokaine/reactive/root<ui> */ ) {
          return value_3;
        }, root_0);
       
      var x_0_11694 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_register_owner_cleanup_11415);
      }
      else {
        return $std_core_types.Unit;
      }
    }, root, function() {
       
      var x_1_11696 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10370 /* hnd/ev-index */ ) {
          return _mlift_register_owner_cleanup_11416(value, _y_x10370);
        });
      }
      else {
        return _mlift_register_owner_cleanup_11416(value, x_1_11696);
      }
    });
  if ($std_core_hnd._yielding()) {
    var _x56 = $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return ((committed).value = true);
    });
  }
  else {
    var _x56 = ((committed).value = true);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x54 = committed.value;
      if (_x54) {
        return $std_core_types.Unit;
      }
      else {
        return $std_core_hnd._open_at1(0, function(value_2 /* dom-owner-registration */ ) {
             
            var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                return dom_retire_owners(value_2);
              });
            var _x55 = $std_core_hnd._open_none1(dom_attempt_ok, result);
            if (_x55) {
              return $std_core_hnd._open_none1(dom_attempt_value, result);
            }
            else {
              return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
            }
          }, value);
      }
    }, _x56);
}
 
 
// monadic lift
export function _mlift_record_owner_11418(root, registered) /* (root : kokaine/reactive/root<ui>, registered : dom-owner-registration) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return register_owner_cleanup(root, registered);
}
 
 
// monadic lift
export function _mlift_record_owner_11419(_y_x10376) /* (kokaine/reactive/integration/internal/reentry/reentry<ui>) -> exn kokaine/reactive/integration/reentry<ui> */  {
  return _y_x10376;
}
 
 
// monadic lift
export function _mlift_record_owner_11420(root, value, portal) /* (root : kokaine/reactive/root<ui>, value : node, portal : kokaine/reactive/integration/reentry<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_11700 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_record_owner(value, root, portal);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(registered /* dom-owner-registration */ ) {
      return register_owner_cleanup(root, registered);
    });
  }
  else {
    return register_owner_cleanup(root, x_11700);
  }
}
 
export function record_owner(root, value) /* (root : kokaine/reactive/root<ui>, value : node) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_11704 = $std_core_hnd._open_at1(0, function(root_0 /* kokaine/reactive/root<ui> */ ) {
       
      var x_0_11707 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
          return value_0;
        }, root_0));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_record_owner_11419);
      }
      else {
        return x_0_11707;
      }
    }, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal /* kokaine/reactive/integration/reentry<ui> */ ) {
      return _mlift_record_owner_11420(root, value, portal);
    });
  }
  else {
     
    var x_1_11709 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_record_owner(value, root, x_11704);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(registered /* dom-owner-registration */ ) {
        return register_owner_cleanup(root, registered);
      });
    }
    else {
      return register_owner_cleanup(root, x_1_11709);
    }
  }
}
 
 
// monadic lift
export function _mlift_find_owner_11421(found) /* (found : any) -> <ui,exn> owner-match */  {
  var _x57 = $std_core_hnd._open_none1(dom_owner_state, found);
  if (_x57 === 0) {
    return Owner_none;
  }
  else if (_x57 === 1) {
     
    var _x_x1_0_11147 = $std_core_hnd._open_none1(dom_owner_portal, found);
    return Owner_live($std_core_hnd._open_none1(any_reentry, _x_x1_0_11147));
  }
  else {
    return Owner_retired;
  }
}
 
export function find_owner(root, value) /* (root : kokaine/reactive/root<ui>, value : node) -> <exn,ui> owner-match */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_find_owner(value, root);
    });
   
  var _x58 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x58) {
    var x_11714 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11714 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_find_owner_11421);
  }
  else {
    var _x58 = $std_core_hnd._open_none1(dom_owner_state, x_11714);
    if (_x58 === 0) {
      return Owner_none;
    }
    else if (_x58 === 1) {
       
      var _x_x1_0_11147 = $std_core_hnd._open_none1(dom_owner_portal, x_11714);
      return Owner_live($std_core_hnd._open_none1(any_reentry, _x_x1_0_11147));
    }
    else {
      return Owner_retired;
    }
  }
}
 
 
// monadic lift
export function _mlift_insert_html_11422(root, _c_x10386) /* (root : kokaine/reactive/root<ui>, dom-owner-registration) -> () */  {
  return register_owner_cleanup(root, _c_x10386);
}
 
 
// monadic lift
export function _mlift_insert_html_11423(_y_x10382) /* (kokaine/reactive/integration/internal/reentry/reentry<ui>) -> exn kokaine/reactive/integration/reentry<ui> */  {
  return _y_x10382;
}
 
 
// monadic lift
export function _mlift_insert_html_11424(before, content, parent, root, portal) /* (before : maybe<node>, content : string, parent : node, root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  if (before === null) {
    var x_11718 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_append_html(parent, content, root, portal);
      });
  }
  else {
    var x_11718 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_insert_html_before(parent, before.value, content, root, portal);
      });
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10386 /* dom-owner-registration */ ) {
      return register_owner_cleanup(root, _c_x10386);
    });
  }
  else {
    return register_owner_cleanup(root, x_11718);
  }
}
 
export function insert_html(root, parent, before, content) /* (root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, content : string) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_11722 = $std_core_hnd._open_at1(0, function(root_0 /* kokaine/reactive/root<ui> */ ) {
       
      var x_0_11725 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
          return value;
        }, root_0));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_insert_html_11423);
      }
      else {
        return x_0_11725;
      }
    }, root);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(portal /* kokaine/reactive/integration/reentry<ui> */ ) {
      return _mlift_insert_html_11424(before, content, parent, root, portal);
    });
  }
  else {
     
    if (before === null) {
      var x_1_11727 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_append_html(parent, content, root, x_11722);
        });
    }
    else {
      var x_1_11727 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_insert_html_before(parent, before.value, content, root, x_11722);
        });
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10386 /* dom-owner-registration */ ) {
        return register_owner_cleanup(root, _c_x10386);
      });
    }
    else {
      return register_owner_cleanup(root, x_1_11727);
    }
  }
}
 
export function set_attribute(value, name, content) /* (value : element, name : string, content : maybe<string>) -> <exn,ui> () */  {
   
  var _x_x1_11153 = $std_core_hnd._open_none1($kokaine_html.is_valid_attribute_name, name);
  var _x59 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_11153);
  if (_x59) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid HTML attribute name: ", name));
  }
  else {
    if (content === null) {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_remove_attribute(value, name);
        });
      var _x60 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x60) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    }
    else {
       
      var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_set_attribute(value, name, content.value);
        });
      var _x61 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
      if (_x61) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_0);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
      }
    }
  }
}
 
export function set_property(value, name, content) /* (value : element, name : string, content : kokaine/html/property-value) -> <exn,ui> () */  {
   
  var _x_x1_11155 = $std_core_hnd._open_none1($kokaine_html.is_valid_property_name, name);
  var _x62 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, _x_x1_11155);
  if (_x62) {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("invalid or markup-writing DOM property: ", name));
  }
  else {
    if (content._tag === 1) {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_set_string_property(value, name, content.value);
        });
      var _x63 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x63) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    }
    else if (content._tag === 2) {
       
      var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_set_bool_property(value, name, content.value);
        });
      var _x64 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
      if (_x64) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_0);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
      }
    }
    else {
       
      var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_set_int_property(value, name, $std_core_int.show(content.value));
        });
      var _x65 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
      if (_x65) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_1);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
      }
    }
  }
}
 
export function snapshot(value) /* (value : raw-event) -> <exn,ui> kokaine/html/event */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return $kokaine_html.Event(raw_event_value(value), raw_event_checked(value), raw_event_key(value), raw_event_any(value));
    });
  var _x66 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x66) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_invoke_event_11425(_pat_1_2) /* (bool) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_invoke_event_11426(continuation, portal, root, captured) /* forall<_e> (continuation : kokaine/internal/event-runtime/event-continuation, portal : kokaine/reactive/integration/reentry<ui>, root : kokaine/reactive/root<ui>, captured : kokaine/html/event) -> <exn,ui> () */  {
  var _x67 = $std_core_hnd._open_none1(function(value_1 /* kokaine/internal/event-runtime/event-continuation */ ) {
      var _x68 = value_1.value;
      return (_x68 !== null);
    }, continuation);
  if (_x67) {
    return $kokaine_reactive_integration_internal_reentry.run_reentry($std_core_hnd._open_none1(function(value_0_0 /* kokaine/reactive/integration/reentry<ui> */ ) {
          return value_0_0;
        }, portal), function() {
        return $kokaine_reactive_async_internal_runtime.run_generation_async($std_core_hnd._open_none1(function(value_3 /* kokaine/reactive/root<ui> */ ) {
              return value_3;
            }, root), function() {
             
            var x_11738 = $kokaine_internal_event_dash_runtime.event_continuation_fs_resume(continuation, captured);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(_mlift_invoke_event_11425);
            }
            else {
              return $std_core_types.Unit;
            }
          });
      });
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function invoke_event(root, portal, continuation, value) /* (root : kokaine/reactive/root<ui>, portal : kokaine/reactive/integration/reentry<ui>, continuation : kokaine/internal/event-runtime/event-continuation, value : raw-event) -> ui () */  {
  return $std_core_exn.exn_fs__handle($std_core_exn._Hnd_exn(0, function(m /* hnd/marker<ui,()> */ , ___wildcard_x654__16 /* hnd/ev<exn> */ , x /* exception */ ) {
        return $std_core_hnd.yield_to_final(m, function(___wildcard_x654__45 /* (hnd/resume-result<10004,()>) -> ui () */ ) {
            var _x69 = x.message;
            return dom_report_error($std_core_types._lp__plus__plus__rp_("uncaught Kokaine event exception: ", _x69));
          });
      }), function(_res /* () */ ) {
      return _res;
    }, function() {
      var _x70 = $std_core_hnd._open_none1(function(value_0 /* kokaine/internal/event-runtime/event-continuation */ ) {
          var _x71 = value_0.value;
          return (_x71 !== null);
        }, continuation);
      if (_x70) {
         
        var x_0_11741 = snapshot(value);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(captured /* kokaine/html/event */ ) {
            return _mlift_invoke_event_11426(continuation, portal, root, captured);
          });
        }
        else {
          return _mlift_invoke_event_11426(continuation, portal, root, x_0_11741);
        }
      }
      else {
        return $std_core_types.Unit;
      }
    });
}
 
export function retire_event_listener(target, name, continuation, listener) /* (target : element, name : string, continuation : kokaine/internal/event-runtime/event-continuation, listener : ref<global,maybe<dom-listener>>) -> <exn,ui> () */  {
  return $std_core_hnd.finally_prompt(function() {
      var _x72 = listener.value;
      if (_x72 === null) {
        return $std_core_types.Unit;
      }
      else {
         
        ((listener).value = ($std_core_types.Nothing));
         
        $std_core_hnd._open_none1(dom_retire_listener, _x72.value);
         
        var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_unlisten(target, name, _x72.value);
          });
        var _x73 = $std_core_hnd._open_none1(dom_attempt_ok, result);
        if (_x73) {
          return $std_core_hnd._open_none1(dom_attempt_value, result);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
        }
      }
    }, $std_core_hnd._open_none1(function(value_2 /* kokaine/internal/event-runtime/event-continuation */ ) {
        return ((value_2).value = ($kokaine_internal_event_dash_runtime.Event_retired));
      }, continuation));
}
 
 
// monadic lift
export function _mlift_capture_event_listener_11427(captured, _y_x10412) /* forall<_e> (captured : ref<global,maybe<kokaine/internal/event-runtime/event-continuation>>, kokaine/internal/event-runtime/event-continuation) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> () */  {
  return ((captured).value = ($std_core_types.Just(_y_x10412)));
}
 
 
// monadic lift
export function _mlift_capture_event_listener_11428(captured, wild__) /* forall<_e> (captured : ref<global,maybe<kokaine/internal/event-runtime/event-continuation>>, wild_ : ()) -> <exn,ui> kokaine/internal/event-runtime/event-continuation */  {
  var _x74 = captured.value;
  if (_x74 !== null) {
    return _x74.value;
  }
  else {
    return $std_core_exn.$throw("event continuation capture did not complete synchronously");
  }
}
 
export function capture_event_listener(root, action) /* (root : kokaine/reactive/root<ui>, action : kokaine/html/callback) -> <exn,ui> kokaine/internal/event-runtime/event-continuation */  {
   
  var captured = { value: ($std_core_types.Nothing) };
   
  var root_0_10004 = $std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
      return value_0;
    }, root);
   
  var x_11746 = $kokaine_reactive_internal_handlers.dispatch_handled(root_0_10004, function() {
      return $kokaine_reactive_async_internal_runtime.run_generation_async($std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/root<ui> */ ) {
            return value_1;
          }, root), function() {
           
          var x_0_11749 = $kokaine_internal_event_dash_runtime.capture_event(action);
           
          function next_0_11750(_y_x10412) /* (kokaine/internal/event-runtime/event-continuation) -> <pure,kokaine/async/effects/async-await,kokaine/async/effects/async-cancel,kokaine/async/effects/async-ioc,kokaine/async/effects/async-ownership,kokaine/async/effects/discontinue,kokaine/reactive/effects/signal-read,kokaine/reactive/effects/signal-write,ui> () */  {
            return ((captured).value = ($std_core_types.Just(_y_x10412)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(next_0_11750);
          }
          else {
            return next_0_11750(x_0_11749);
          }
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_capture_event_listener_11428(captured, wild__);
    });
  }
  else {
    var _x75 = captured.value;
    if (_x75 !== null) {
      return _x75.value;
    }
    else {
      return $std_core_exn.$throw("event continuation capture did not complete synchronously");
    }
  }
}
 
 
// monadic lift
export function _mlift_install_event_listener_11429(continuation, listener, name, target, _y_x10422) /* (continuation : kokaine/internal/event-runtime/event-continuation, listener : ref<global,maybe<dom-listener>>, name : string, target : element, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10422, false, function() {
      return retire_event_listener(target, name, continuation, listener);
    });
}
 
 
// monadic lift
export function _mlift_install_event_listener_11430(committed, _pat_1) /* forall<_e> (committed : ref<global,bool>, kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return ((committed).value = true);
}
 
 
// monadic lift
export function _mlift_install_event_listener_11431(committed, continuation, listener, name, root, target, installed) /* forall<_e> (committed : ref<global,bool>, continuation : kokaine/internal/event-runtime/event-continuation, listener : ref<global,maybe<dom-listener>>, name : string, root : kokaine/reactive/root<ui>, target : element, installed : dom-listener) -> <ui,exn> () */  {
   
  ((listener).value = ($std_core_types.Just(installed)));
   
  var root_0_10046 = $std_core_hnd._open_none1(function(value_5 /* kokaine/reactive/root<ui> */ ) {
      return value_5;
    }, root);
   
  var x_11754 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, function() {
       
      var x_0_11756 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10422 /* hnd/ev-index */ ) {
          return _mlift_install_event_listener_11429(continuation, listener, name, target, _y_x10422);
        });
      }
      else {
        return _mlift_install_event_listener_11429(continuation, listener, name, target, x_0_11756);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_pat_1_0 /* kokaine/reactive/internal/model/cleanup-registration<ui> */ ) {
      return ((committed).value = true);
    });
  }
  else {
    return ((committed).value = true);
  }
}
 
 
// monadic lift
export function _mlift_install_event_listener_11432(continuation, name, root, target, _y_x10418) /* forall<_e,_e1,_e2> (continuation : kokaine/internal/event-runtime/event-continuation, name : string, root : kokaine/reactive/root<ui>, target : element, kokaine/reactive/integration/internal/reentry/reentry<ui>) -> exn () */  {
   
  var listener = { value: ($std_core_types.Nothing) };
   
  var committed = { value: false };
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_listen(target, name, function(value_3 /* raw-event */ ) {
          return invoke_event(root, _y_x10418, continuation, value_3);
        });
    });
   
  var _x76 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x76) {
    var x_11762 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11762 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    var _x77 = $std_core_hnd.yield_extend(function(installed /* dom-listener */ ) {
      return _mlift_install_event_listener_11431(committed, continuation, listener, name, root, target, installed);
    });
  }
  else {
    var _x77 = _mlift_install_event_listener_11431(committed, continuation, listener, name, root, target, x_11762);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x76 = committed.value;
      if (_x76) {
        return $std_core_types.Unit;
      }
      else {
        return retire_event_listener(target, name, continuation, listener);
      }
    }, _x77);
}
 
 
// monadic lift
export function _mlift_install_event_listener_11433(name, root, target, continuation) /* forall<_e,_e1,_e2> (name : string, root : kokaine/reactive/root<ui>, target : element, continuation : kokaine/internal/event-runtime/event-continuation) -> <exn,ui> () */  {
   
  var x_11765 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
      return value;
    }, root));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10418 /* kokaine/reactive/integration/internal/reentry/reentry<ui> */ ) {
      return _mlift_install_event_listener_11432(continuation, name, root, target, _y_x10418);
    });
  }
  else {
    return _mlift_install_event_listener_11432(continuation, name, root, target, x_11765);
  }
}
 
export function install_event_listener(root, target, name, action) /* (root : kokaine/reactive/root<ui>, target : element, name : string, action : kokaine/html/callback) -> <exn,ui> () */  {
   
  var x_11767 = capture_event_listener(root, action);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(continuation /* kokaine/internal/event-runtime/event-continuation */ ) {
      return _mlift_install_event_listener_11433(name, root, target, continuation);
    });
  }
  else {
     
    var x_0_11770 = $kokaine_reactive_integration_internal_reentry.capture_reentry($std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
        return value;
      }, root));
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10418 /* kokaine/reactive/integration/internal/reentry/reentry<ui> */ ) {
        return _mlift_install_event_listener_11432(x_11767, name, root, target, _y_x10418);
      });
    }
    else {
       
      var listener = { value: ($std_core_types.Nothing) };
       
      var committed = { value: false };
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_listen(target, name, function(value_3 /* raw-event */ ) {
              return invoke_event(root, x_0_11770, x_11767, value_3);
            });
        });
       
      var _x78 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x78) {
        var x_1_11775 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_1_11775 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        var _x79 = $std_core_hnd.yield_extend(function(installed /* dom-listener */ ) {
          return _mlift_install_event_listener_11431(committed, x_11767, listener, name, root, target, installed);
        });
      }
      else {
        var _x79 = _mlift_install_event_listener_11431(committed, x_11767, listener, name, root, target, x_1_11775);
      }
      return $std_core_hnd.finally_prompt(function() {
          var _x78 = committed.value;
          if (_x78) {
            return $std_core_types.Unit;
          }
          else {
            return retire_event_listener(target, name, x_11767, listener);
          }
        }, _x79);
    }
  }
}
 
 
// monadic lift
export function _mlift_mount_attribute_11434(read, _y_x10431) /* (read : () -> kokaine/reactive/effects/signal-read maybe<string>, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> maybe<string> */  {
  return $std_core_hnd._mask_at(_y_x10431, false, read);
}
 
 
// monadic lift
export function _mlift_mount_attribute_11435(name_2, target, value_1_0, _y_x10434) /* (name@2 : string, target : element, value@1@0 : maybe<string>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10434, false, function() {
      return set_attribute(target, name_2, value_1_0);
    });
}
 
 
// monadic lift
export function _mlift_mount_attribute_11436(_y_x10438) /* (kokaine/reactive/internal/model/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_attribute_11437(read_0_0, _y_x10439) /* (read@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/property-value, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> kokaine/html/property-value */  {
  return $std_core_hnd._mask_at(_y_x10439, false, read_0_0);
}
 
 
// monadic lift
export function _mlift_mount_attribute_11438(name_3, target, value_2_0, _y_x10442) /* (name@3 : string, target : element, value@2@0 : kokaine/html/property-value, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10442, false, function() {
      return set_property(target, name_3, value_2_0);
    });
}
 
 
// monadic lift
export function _mlift_mount_attribute_11439(_y_x10446) /* (kokaine/reactive/internal/model/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_attribute_11440(action_1, name_4, root, target, _y_x10449) /* (action@1 : kokaine/html/callback, name@4 : string, root : kokaine/reactive/root<ui>, target : element, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10449, false, function() {
      return install_event_listener(root, target, name_4, action_1);
    });
}
 
 
// monadic lift
export function _mlift_mount_attribute_11441(action_1, name_4, root, target, _c_x10448) /* (action@1 : kokaine/html/callback, name@4 : string, root : kokaine/reactive/root<ui>, target : element, ()) -> () */  {
   
  var x_11783 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10449 /* hnd/ev-index */ ) {
      return _mlift_mount_attribute_11440(action_1, name_4, root, target, _y_x10449);
    });
  }
  else {
    return _mlift_mount_attribute_11440(action_1, name_4, root, target, x_11783);
  }
}
 
export function mount_attribute(root, target, attribute) /* forall<e> (root : kokaine/reactive/root<ui>, target : element, attribute : kokaine/html/attribute<e>) -> <kokaine/reactive/effects/signal-write,ui,pure> () */  {
  if (attribute._tag === 1) {
    return $std_core_hnd._open_at3(0, set_attribute, target, attribute.name, $std_core_types.Just(attribute.value));
  }
  else if (attribute._tag === 2) {
    if (attribute.enabled) {
      var _x80 = $std_core_types.Just("");
    }
    else {
      var _x80 = $std_core_types.Nothing;
    }
    return $std_core_hnd._open_at3(0, set_attribute, target, attribute.name, _x80);
  }
  else if (attribute._tag === 3) {
    return $std_core_hnd._open_at3(0, set_property, target, attribute.name, attribute.value);
  }
  else if (attribute._tag === 4) {
     
    var root_0_10043 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/root<ui> */ ) {
        return value_1;
      }, root);
     
    var x_11785 = $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043, function() {
         
        var x_0_11788 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10431 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10431, false, attribute.read);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_0_11788, false, attribute.read);
        }
      }, function(value_1_0 /* maybe<string> */ ) {
         
        var x_1_11790 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10434 /* hnd/ev-index */ ) {
            return _mlift_mount_attribute_11435(attribute.name, target, value_1_0, _y_x10434);
          });
        }
        else {
          return _mlift_mount_attribute_11435(attribute.name, target, value_1_0, x_1_11790);
        }
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_mount_attribute_11436);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else if (attribute._tag === 5) {
     
    var root_0_10043_0 = $std_core_hnd._open_none1(function(value_2 /* kokaine/reactive/root<ui> */ ) {
        return value_2;
      }, root);
     
    var x_2_11792 = $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043_0, function() {
         
        var x_3_11795 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10439 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10439, false, attribute.read);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_3_11795, false, attribute.read);
        }
      }, function(value_2_0 /* kokaine/html/property-value */ ) {
         
        var x_4_11797 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10442 /* hnd/ev-index */ ) {
            return _mlift_mount_attribute_11438(attribute.name, target, value_2_0, _y_x10442);
          });
        }
        else {
          return _mlift_mount_attribute_11438(attribute.name, target, value_2_0, x_4_11797);
        }
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(_mlift_mount_attribute_11439);
    }
    else {
      return $std_core_types.Unit;
    }
  }
  else {
     
    var _x_x1_4_11178 = $std_core_hnd._open_none1($kokaine_html.is_valid_event_name, attribute.name);
     
    var _x81 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_4_11178);
    if (_x81) {
       
      var _x_x1_6_11180 = $std_core_types._lp__plus__plus__rp_("invalid DOM event name: ", attribute.name);
      var x_5_11799 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, _x_x1_6_11180);
    }
    else {
      var x_5_11799 = $std_core_types.Unit;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10448 /* () */ ) {
        return _mlift_mount_attribute_11441(attribute.action, attribute.name, root, target, _c_x10448);
      });
    }
    else {
       
      var x_6_11802 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10449 /* hnd/ev-index */ ) {
          return _mlift_mount_attribute_11440(attribute.action, attribute.name, root, target, _y_x10449);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_6_11802, false, function() {
            return install_event_listener(root, target, attribute.name, attribute.action);
          });
      }
    }
  }
}
 
export function throw_keyed_row_failure(failure) /* (failure : ref<global,error<()>>) -> exn () */  {
  return $std_core_exn.untry(failure.value);
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11442(failure, wild__) /* forall<e> (failure : ref<global,error<()>>, wild_ : ()) -> <exn|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), throw_keyed_row_failure, failure);
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11443(completed, _c_x10461) /* forall<_e> (completed : ref<global,bool>, ()) -> () */  {
  return ((completed).value = true);
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11444(completed_0, failure_0, previous, _y_x10460) /* forall<_e,e1> (completed : ref<global,bool>, failure : ref<global,error<()>>, previous : error<()>, error<()>) -> e1 () */  {
   
  if (_y_x10460._tag === 1) {
    var x_11806 = ((failure_0).value = ($std_core_types.$Error(_y_x10460.error)));
  }
  else {
    var x_11806 = ((failure_0).value = previous);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10461_0 /* () */ ) {
      return _mlift_run_keyed_row_actions_11443(completed_0, _c_x10461_0);
    });
  }
  else {
    return _mlift_run_keyed_row_actions_11443(completed_0, x_11806);
  }
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11445(action, completed_1, failure_1, row, _y_x10458) /* forall<_e,_e1,a,b,e2,e3> (action : (keyed-row<e2,a,b>) -> <exn|e3> (), completed : ref<global,bool>, failure : ref<global,error<()>>, row : keyed-row<e2,a,b>, hnd/ev-index) -> <exn|e3> () */  {
  return $std_core_hnd._mask_at(_y_x10458, false, function() {
       
      var previous_0 = failure_1.value;
       
      ((failure_1).value = ($std_core_types.Ok($std_core_types.Unit)));
       
      var x_0_11808 = $kokaine_internal_compat.capture_error(function() {
        return action(row);
      });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10460_0 /* error<()> */ ) {
          return _mlift_run_keyed_row_actions_11444(completed_1, failure_1, previous_0, _y_x10460_0);
        });
      }
      else {
        return _mlift_run_keyed_row_actions_11444(completed_1, failure_1, previous_0, x_0_11808);
      }
    });
}
 
 
// monadic lift
export function _mlift_run_keyed_row_actions_11446(action_0, failure_2, rest, wild___2) /* forall<a,b,e,e1> (action : (keyed-row<e,a,b>) -> <exn|e1> (), failure : ref<global,error<()>>, rest : list<keyed-row<e,a,b>>, wild_@2 : ()) -> <exn|e1> () */  {
  return run_keyed_row_actions(rest, action_0, failure_2);
}
 
export function run_keyed_row_actions(rows, action_1, failure_3) /* forall<a,b,e,e1> (rows : list<keyed-row<e,a,b>>, action : (keyed-row<e,a,b>) -> <exn|e1> (), failure : ref<global,error<()>>) -> <exn|e1> () */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var completed_2 = { value: false };
     
    var x_3_11817 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
     
    if ($std_core_hnd._yielding()) {
      var _x82 = $std_core_hnd.yield_extend(function(_y_x10458_0 /* hnd/ev-index */ ) {
        return _mlift_run_keyed_row_actions_11445(action_1, completed_2, failure_3, rows.head, _y_x10458_0);
      });
    }
    else {
      var _x82 = _mlift_run_keyed_row_actions_11445(action_1, completed_2, failure_3, rows.head, x_3_11817);
    }
    var x_1_11810 = $std_core_hnd.finally_prompt(function() {
        var _x81 = completed_2.value;
        if (_x81) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_2_11815 = run_keyed_row_actions(rows.tail, action_1, failure_3);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
              return _mlift_run_keyed_row_actions_11442(failure_3, wild___0);
            });
          }
          else {
            return _mlift_run_keyed_row_actions_11442(failure_3, x_2_11815);
          }
        }
      }, _x82);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___2_0 /* () */ ) {
        return _mlift_run_keyed_row_actions_11446(action_1, failure_3, rows.tail, wild___2_0);
      });
    }
    else {
      {
        // tail call
        rows = rows.tail;
        continue tailcall;
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_exhaust_keyed_row_actions_11447(failure, wild__) /* forall<e> (failure : ref<global,error<()>>, wild_ : ()) -> <exn|e> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), throw_keyed_row_failure, failure);
}
 
export function exhaust_keyed_row_actions(rows, action) /* forall<a,b,e,e1> (rows : list<keyed-row<e,a,b>>, action : (keyed-row<e,a,b>) -> <exn|e1> ()) -> <exn|e1> () */  {
   
  var failure = { value: ($std_core_types.Ok($std_core_types.Unit)) };
   
  var x_11819 = run_keyed_row_actions(rows, action, failure);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), throw_keyed_row_failure, failure);
    });
  }
  else {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index($std_core_exn.exn_fs__tag), throw_keyed_row_failure, failure);
  }
}
 
export function dispose_keyed_rows(rows) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  {
  return exhaust_keyed_row_actions(rows, function(row /* keyed-row<5987,5985,5986> */ ) {
       
      var scope_10087 = $std_core_hnd._open_none1(function(_this /* keyed-row<5987,5985,5986> */ ) {
          return _this.row_scope;
        }, row);
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value;
        }, scope_10087));
    });
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11448(first_10281, last, last_0_10282, parent, focus) /* (first@10281 : node, last : node, last@0@10282 : node, parent : node, focus : any) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_move_range_before(parent, first_10281, last_0_10282, last, focus);
    });
  var _x81 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x81) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11449(first_10281, last, last_0_10282, parent, wild___0) /* (first@10281 : node, last : node, last@0@10282 : node, parent : node, wild_@0 : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_capture_range_focus(parent, first_10281, last_0_10282);
    });
   
  var _x82 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x82) {
    var x_11825 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11825 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(focus /* any */ ) {
      return _mlift_rollback_keyed_order_11448(first_10281, last, last_0_10282, parent, focus);
    });
  }
  else {
    return _mlift_rollback_keyed_order_11448(first_10281, last, last_0_10282, parent, x_11825);
  }
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11450(first_10281, last, last_0_10282, parent, wild__) /* (first@10281 : node, last : node, last@0@10282 : node, parent : node, wild_ : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first_10281, last_0_10282);
    });
   
  var _x82 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x82) {
    var x_11828 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11828 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_rollback_keyed_order_11449(first_10281, last, last_0_10282, parent, wild___0);
    });
  }
  else {
    return _mlift_rollback_keyed_order_11449(first_10281, last, last_0_10282, parent, x_11828);
  }
}
 
 
// monadic lift
export function _mlift_rollback_keyed_order_11451(last, parent, row, next) /* forall<a,b,e> (last : node, parent : node, row : keyed-row<e,a,b>, next : node) -> <ui,exn> () */  {
  var _x82 = $std_core_hnd._open_none2(dom_same_node, next, last);
  if (_x82) {
    return $std_core_types.Unit;
  }
  else {
     
    var first_10281 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<6111,6109,6110> */ ) {
        return _this_1.row_first;
      }, row);
     
    var last_0_10282 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<6111,6109,6110> */ ) {
        return _this_2.row_last;
      }, row);
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_lifecycle(parent, first_10281, last_0_10282);
      });
     
    var _x83 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x83) {
      var x_11831 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_11831 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
        return _mlift_rollback_keyed_order_11450(first_10281, last, last_0_10282, parent, wild__);
      });
    }
    else {
      return _mlift_rollback_keyed_order_11450(first_10281, last, last_0_10282, parent, x_11831);
    }
  }
}
 
export function rollback_keyed_order(parent, last, rows) /* forall<a,b,e> (parent : node, last : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  {
  return exhaust_keyed_row_actions(rows, function(row /* keyed-row<6111,6109,6110> */ ) {
       
      var first_10089 = $std_core_hnd._open_none1(function(_this /* keyed-row<6111,6109,6110> */ ) {
          return _this.row_first;
        }, row);
       
      var last_0_10090 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6111,6109,6110> */ ) {
          return _this_0.row_last;
        }, row);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_next(parent, first_10089, last_0_10090);
        });
       
      var _x83 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x83) {
        var x_11834 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_11834 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(next_0 /* node */ ) {
          return _mlift_rollback_keyed_order_11451(last, parent, row, next_0);
        });
      }
      else {
        return _mlift_rollback_keyed_order_11451(last, parent, row, x_11834);
      }
    });
}
 
 
// monadic lift
export function _mlift_validate_keyed_move_lifecycles_11452(first_10092, last_10093, parent, wild__) /* (first@10092 : node, last@10093 : node, parent : node, wild_ : ()) -> <ui,exn> () */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent, first_10092, last_10093);
    });
  var _x83 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x83) {
    return $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
}
 
export function validate_keyed_move_lifecycles(parent, rows) /* forall<a,b,e> (parent : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  {
  return $std_core_list.foreach(rows, function(row /* keyed-row<6195,6193,6194> */ ) {
       
      var first_10092 = $std_core_hnd._open_none1(function(_this /* keyed-row<6195,6193,6194> */ ) {
          return _this.row_first;
        }, row);
       
      var last_10093 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6195,6193,6194> */ ) {
          return _this_0.row_last;
        }, row);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_validate_range_move_lifecycle(parent, first_10092, last_10093);
        });
       
      var _x84 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x84) {
        var x_11838 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_11838 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
          return _mlift_validate_keyed_move_lifecycles_11452(first_10092, last_10093, parent, wild__);
        });
      }
      else {
        return _mlift_validate_keyed_move_lifecycles_11452(first_10092, last_10093, parent, x_11838);
      }
    });
}
 
 
// monadic lift
export function _mlift_validate_keyed_order_11453(last, parent, rest, next) /* forall<a,b,e> (last : node, parent : node, rest : list<keyed-row<e,a,b>>, next : node) -> <ui,exn> () */  {
  return validate_keyed_order(parent, last, next, rest);
}
 
export function validate_keyed_order(parent_0, last_0, cursor, rows) /* forall<a,b,e> (parent : node, last : node, cursor : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> () */  { tailcall: while(1)
{
  if (rows === null) {
    var _x84 = $std_core_hnd._open_none2(dom_same_node, cursor, last_0);
    if (_x84) {
      return $std_core_types.Unit;
    }
    else {
      return $std_core_exn.$throw("invalid Kokaine keyed DOM: unmanaged nodes remain in the region");
    }
  }
  else {
     
    var _x_x2_0_11198 = $std_core_hnd._open_none1(function(_this /* keyed-row<6353,6351,6352> */ ) {
        return _this.row_first;
      }, rows.head);
     
    var _x_x1_0_11196 = $std_core_hnd._open_none2(dom_same_node, cursor, _x_x2_0_11198);
    var _x85 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_0_11196);
    if (_x85) {
      return $std_core_exn.$throw("invalid Kokaine keyed DOM: retained row ranges are out of order");
    }
    else {
       
      var first_10095 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6353,6351,6352> */ ) {
          return _this_0.row_first;
        }, rows.head);
       
      var last_0_10096 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<6353,6351,6352> */ ) {
          return _this_1.row_last;
        }, rows.head);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_next(parent_0, first_10095, last_0_10096);
        });
       
      var _x86 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x86) {
        var x_11841 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_11841 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(next_1 /* node */ ) {
          return _mlift_validate_keyed_order_11453(last_0, parent_0, rows.tail, next_1);
        });
      }
      else {
        {
          // tail call
          cursor = x_11841;
          rows = rows.tail;
          continue tailcall;
        }
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_keyed_order_matches_11454(last, parent, rest, next) /* forall<a,b,e> (last : node, parent : node, rest : list<keyed-row<e,a,b>>, next : node) -> <ui,exn> bool */  {
  return keyed_order_matches(parent, last, next, rest);
}
 
export function keyed_order_matches(parent_0, last_0, cursor, rows) /* forall<a,b,e> (parent : node, last : node, cursor : node, rows : list<keyed-row<e,a,b>>) -> <ui,exn> bool */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_hnd._open_none2(dom_same_node, cursor, last_0);
  }
  else {
     
    var _x_x2_0_11206 = $std_core_hnd._open_none1(function(_this /* keyed-row<6484,6482,6483> */ ) {
        return _this.row_first;
      }, rows.head);
     
    var _x_x1_0_11204 = $std_core_hnd._open_none2(dom_same_node, cursor, _x_x2_0_11206);
    var _x86 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, _x_x1_0_11204);
    if (_x86) {
      return false;
    }
    else {
       
      var first_10098 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6484,6482,6483> */ ) {
          return _this_0.row_first;
        }, rows.head);
       
      var last_0_10099 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<6484,6482,6483> */ ) {
          return _this_1.row_last;
        }, rows.head);
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_next(parent_0, first_10098, last_0_10099);
        });
       
      var _x87 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x87) {
        var x_11845 = $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        var x_11845 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(next_1 /* node */ ) {
          return _mlift_keyed_order_matches_11454(last_0, parent_0, rows.tail, next_1);
        });
      }
      else {
        {
          // tail call
          cursor = x_11845;
          rows = rows.tail;
          continue tailcall;
        }
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11455(cursor, parent, rest, wild___1) /* forall<a,b,e> (cursor : node, parent : node, rest : list<keyed-update<e,a,b>>, wild_@1 : ()) -> <ui,exn> node */  {
  return place_keyed_updates(parent, cursor, rest);
}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11456(cursor_0, first_10285, last_10286, parent_0, rest_0, focus) /* forall<a,b,e> (cursor : node, first@10285 : node, last@10286 : node, parent : node, rest : list<keyed-update<e,a,b>>, focus : any) -> <ui,exn> node */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_move_range_before(parent_0, first_10285, last_10286, cursor_0, focus);
    });
   
  var _x87 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x87) {
    var x_11849 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_11849 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_0 /* () */ ) {
      return _mlift_place_keyed_updates_11455(cursor_0, parent_0, rest_0, wild___1_0);
    });
  }
  else {
    return _mlift_place_keyed_updates_11455(cursor_0, parent_0, rest_0, x_11849);
  }
}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11457(cursor_1, first_10285_0, last_10286_0, parent_1, rest_1, wild___0) /* forall<a,b,e> (cursor : node, first@10285 : node, last@10286 : node, parent : node, rest : list<keyed-update<e,a,b>>, wild_@0 : ()) -> <ui,exn> node */  {
   
  var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_capture_range_focus(parent_1, first_10285_0, last_10286_0);
    });
   
  var _x87 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
  if (_x87) {
    var x_0_11852 = $std_core_hnd._open_none1(dom_attempt_value, result_0);
  }
  else {
    var x_0_11852 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(focus_0 /* any */ ) {
      return _mlift_place_keyed_updates_11456(cursor_1, first_10285_0, last_10286_0, parent_1, rest_1, focus_0);
    });
  }
  else {
    return _mlift_place_keyed_updates_11456(cursor_1, first_10285_0, last_10286_0, parent_1, rest_1, x_0_11852);
  }
}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11458(cursor_2, first_10285_1, last_10286_1, parent_2, rest_2, wild__) /* forall<a,b,e> (cursor : node, first@10285 : node, last@10286 : node, parent : node, rest : list<keyed-update<e,a,b>>, wild_ : ()) -> <ui,exn> node */  {
   
  var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_validate_range_move_focus(parent_2, first_10285_1, last_10286_1);
    });
   
  var _x87 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
  if (_x87) {
    var x_1_11855 = $std_core_hnd._open_none1(dom_attempt_value, result_1);
  }
  else {
    var x_1_11855 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0_0 /* () */ ) {
      return _mlift_place_keyed_updates_11457(cursor_2, first_10285_1, last_10286_1, parent_2, rest_2, wild___0_0);
    });
  }
  else {
    return _mlift_place_keyed_updates_11457(cursor_2, first_10285_1, last_10286_1, parent_2, rest_2, x_1_11855);
  }
}
 
 
// monadic lift
export function _mlift_place_keyed_updates_11459(cursor_3, parent_3, rest_3, row, next_2) /* forall<a,b,e> (cursor : node, parent : node, rest : list<keyed-update<e,a,b>>, row : keyed-row<e,a,b>, next : node) -> <ui,exn> node */  {
   
  var _x_x2_11214 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<6660,6658,6659> */ ) {
      return _this_2.row_first;
    }, row);
  var _x87 = $std_core_hnd._open_none2(dom_same_node, cursor_3, _x_x2_11214);
  if (_x87) {
    return place_keyed_updates(parent_3, next_2, rest_3);
  }
  else {
     
    var first_10285_2 = $std_core_hnd._open_none1(function(_this_3 /* keyed-row<6660,6658,6659> */ ) {
        return _this_3.row_first;
      }, row);
     
    var last_10286_2 = $std_core_hnd._open_none1(function(_this_4 /* keyed-row<6660,6658,6659> */ ) {
        return _this_4.row_last;
      }, row);
     
    var result_2 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_validate_range_move_lifecycle(parent_3, first_10285_2, last_10286_2);
      });
     
    var _x88 = $std_core_hnd._open_none1(dom_attempt_ok, result_2);
    if (_x88) {
      var x_2_11858 = $std_core_hnd._open_none1(dom_attempt_value, result_2);
    }
    else {
      var x_2_11858 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_2)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___2 /* () */ ) {
        return _mlift_place_keyed_updates_11458(cursor_3, first_10285_2, last_10286_2, parent_3, rest_3, wild___2);
      });
    }
    else {
      return _mlift_place_keyed_updates_11458(cursor_3, first_10285_2, last_10286_2, parent_3, rest_3, x_2_11858);
    }
  }
}
 
export function place_keyed_updates(parent_4, cursor_4, updates) /* forall<a,b,e> (parent : node, cursor : node, updates : list<keyed-update<e,a,b>>) -> <ui,exn> node */  { tailcall: while(1)
{
  if (updates === null) {
    return cursor_4;
  }
  else {
     
    var row_0 = $std_core_hnd._open_none1(function(_this /* keyed-update<6660,6658,6659> */ ) {
        return _this.update_row;
      }, updates.head);
     
    var first_10101 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<6660,6658,6659> */ ) {
        return _this_0.row_first;
      }, row_0);
     
    var last_10102 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<6660,6658,6659> */ ) {
        return _this_1.row_last;
      }, row_0);
     
    var result_3 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        return dom_range_next(parent_4, first_10101, last_10102);
      });
     
    var _x88 = $std_core_hnd._open_none1(dom_attempt_ok, result_3);
    if (_x88) {
      var x_3_11861 = $std_core_hnd._open_none1(dom_attempt_value, result_3);
    }
    else {
      var x_3_11861 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_3)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(next_5 /* node */ ) {
        return _mlift_place_keyed_updates_11459(cursor_4, parent_4, updates.tail, row_0, next_5);
      });
    }
    else {
       
      var _x_x2_11214_0 = $std_core_hnd._open_none1(function(_this_2_0 /* keyed-row<6660,6658,6659> */ ) {
          return _this_2_0.row_first;
        }, row_0);
      var _x88 = $std_core_hnd._open_none2(dom_same_node, cursor_4, _x_x2_11214_0);
      if (_x88) {
        {
          // tail call
          cursor_4 = x_3_11861;
          updates = updates.tail;
          continue tailcall;
        }
      }
      else {
         
        var first_10285_3 = $std_core_hnd._open_none1(function(_this_3_0 /* keyed-row<6660,6658,6659> */ ) {
            return _this_3_0.row_first;
          }, row_0);
         
        var last_10286_3 = $std_core_hnd._open_none1(function(_this_4_0 /* keyed-row<6660,6658,6659> */ ) {
            return _this_4_0.row_last;
          }, row_0);
         
        var result_4 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_validate_range_move_lifecycle(parent_4, first_10285_3, last_10286_3);
          });
         
        var _x89 = $std_core_hnd._open_none1(dom_attempt_ok, result_4);
        if (_x89) {
          var x_4_11865 = $std_core_hnd._open_none1(dom_attempt_value, result_4);
        }
        else {
          var x_4_11865 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_4)));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___3 /* () */ ) {
            return _mlift_place_keyed_updates_11458(cursor_4, first_10285_3, last_10286_3, parent_4, updates.tail, wild___3);
          });
        }
        else {
           
          var result_5 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
              return dom_validate_range_move_focus(parent_4, first_10285_3, last_10286_3);
            });
           
          var _x89 = $std_core_hnd._open_none1(dom_attempt_ok, result_5);
          if (_x89) {
            var x_5_11869 = $std_core_hnd._open_none1(dom_attempt_value, result_5);
          }
          else {
            var x_5_11869 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_5)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___0_1 /* () */ ) {
              return _mlift_place_keyed_updates_11457(cursor_4, first_10285_3, last_10286_3, parent_4, updates.tail, wild___0_1);
            });
          }
          else {
             
            var result_6 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                return dom_capture_range_focus(parent_4, first_10285_3, last_10286_3);
              });
             
            var _x89 = $std_core_hnd._open_none1(dom_attempt_ok, result_6);
            if (_x89) {
              var x_6_11873 = $std_core_hnd._open_none1(dom_attempt_value, result_6);
            }
            else {
              var x_6_11873 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_6)));
            }
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(focus_1 /* any */ ) {
                return _mlift_place_keyed_updates_11456(cursor_4, first_10285_3, last_10286_3, parent_4, updates.tail, focus_1);
              });
            }
            else {
               
              var result_7 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                  return dom_move_range_before(parent_4, first_10285_3, last_10286_3, cursor_4, x_6_11873);
                });
               
              var _x89 = $std_core_hnd._open_none1(dom_attempt_ok, result_7);
              if (_x89) {
                var x_7_11877 = $std_core_hnd._open_none1(dom_attempt_value, result_7);
              }
              else {
                var x_7_11877 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_7)));
              }
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(wild___1_1 /* () */ ) {
                  return _mlift_place_keyed_updates_11455(cursor_4, parent_4, updates.tail, wild___1_1);
                });
              }
              else {
                {
                  // tail call
                  updates = updates.tail;
                  continue tailcall;
                }
              }
            }
          }
        }
      }
    }
  }
}}
 
export function _trmc_collect_stale_rows(rows, next, compare, _acc) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>, next : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, compare : (b, b) -> order, ctx<list<keyed-row<e,a,b>>>) -> list<keyed-row<e,a,b>> */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_types._cctx_apply(_acc,($std_core_types.Nil));
  }
  else {
    var _x90 = rows.head.row_key;
    var _x89 = $kokaine_internal_key_dash_index.find(next, _x90, compare);
    if (_x89 !== null) {
      {
        // tail call
        rows = rows.tail;
        continue tailcall;
      }
    }
    else {
       
      var _trmc_x10289 = undefined;
       
      var _trmc_x10290 = $std_core_types.Cons(rows.head, _trmc_x10289);
      {
        // tail call
        var _x91 = $std_core_types._cctx_extend(_acc,_trmc_x10290,({obj: _trmc_x10290, field_name: "tail"}));
        rows = rows.tail;
        _acc = _x91;
        continue tailcall;
      }
    }
  }
}}
 
export function collect_stale_rows(rows_0, next_0, compare_0) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>, next : kokaine/internal/key-index/key-index<b,keyed-row<e,a,b>>, compare : (b, b) -> order) -> list<keyed-row<e,a,b>> */  {
  return _trmc_collect_stale_rows(rows_0, next_0, compare_0, $std_core_types._cctx_empty());
}
 
 
// monadic lift
export function _mlift_stage_keyed_retirements_loop_11460(collected, rest, row, staged) /* forall<a,b,e> (collected : list<keyed-retirement<e,a,b>>, rest : list<keyed-row<e,a,b>>, row : keyed-row<e,a,b>, staged : dom-retirement) -> <ui,exn> list<keyed-retirement<e,a,b>> */  {
  return stage_keyed_retirements_loop(rest, $std_core_types.Cons(Keyed_retirement(row, staged), collected));
}
 
export function stage_keyed_retirements_loop(rows, collected_0) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>, collected : list<keyed-retirement<e,a,b>>) -> <ui,exn> list<keyed-retirement<e,a,b>> */  { tailcall: while(1)
{
  if (rows === null) {
    return $std_core_list.reverse_acc($std_core_types.Nil, collected_0);
  }
  else {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        var _x92 = rows.head.row_first;
        var _x93 = rows.head.row_last;
        return dom_stage_retirement(_x92, _x93);
      });
     
    var _x94 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x94) {
      var x_11881 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_11881 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(staged_0 /* dom-retirement */ ) {
        return _mlift_stage_keyed_retirements_loop_11460(collected_0, rows.tail, rows.head, staged_0);
      });
    }
    else {
      {
        // tail call
        var _x92 = $std_core_types.Cons(Keyed_retirement(rows.head, x_11881), collected_0);
        rows = rows.tail;
        collected_0 = _x92;
        continue tailcall;
      }
    }
  }
}}
 
export function stage_keyed_retirements(rows) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>) -> <ui,exn> list<keyed-retirement<e,a,b>> */  {
  return stage_keyed_retirements_loop(rows, $std_core_types.Nil);
}
 
export function release_keyed_retirements(values) /* forall<a,b,e> (values : list<keyed-retirement<e,a,b>>) -> ui () */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var _x93 = values.head.retirement_handle;
    dom_release_retirement(_x93);
    {
      // tail call
      values = values.tail;
      continue tailcall;
    }
  }
}}
 
 
// monadic lift
export function _mlift_detach_keyed_retirements_loop_11461(current, detached, index, order, rest, table, wild__) /* forall<_e,_e1,a,b,e2> (current : keyed-retirement<e2,a,b>, detached : ref<global,list<keyed-row<e2,a,b>>>, index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, order : list<keyed-row<e2,a,b>>, rest : list<keyed-retirement<e2,a,b>>, table : ref<global,keyed-table<e2,a,b>>, wild_ : ()) -> <ui,exn> () */  {
   
  ((table).value = (Keyed_table(index, order, rest)));
   
  var _x_x1_11218 = $std_core_hnd._open_none1(function(_this_0 /* keyed-retirement<7244,7242,7243> */ ) {
      return _this_0.retirement_handle;
    }, current);
   
  $std_core_hnd._open_none1(dom_release_retirement, _x_x1_11218);
   
  var value_1_10892 = $std_core_types.Cons($std_core_hnd._open_none1(function(_this_1 /* keyed-retirement<7244,7242,7243> */ ) {
        return _this_1.retirement_row;
      }, current), detached.value);
   
  ((detached).value = value_1_10892);
  return detach_keyed_retirements_loop(table, detached);
}
 
export function detach_keyed_retirements_loop(table_0, detached_0) /* forall<a,b,e> (table : ref<global,keyed-table<e,a,b>>, detached : ref<global,list<keyed-row<e,a,b>>>) -> <pure,ui> () */  { tailcall: while(1)
{
  var _x93 = table_0.value;
  if (_x93.table_retirements === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
        var _x94 = _x93.table_retirements.head.retirement_handle;
        return dom_run_retirement(_x94);
      });
     
    var _x95 = $std_core_hnd._open_none1(dom_attempt_ok, result);
    if (_x95) {
      var x_11885 = $std_core_hnd._open_none1(dom_attempt_value, result);
    }
    else {
      var x_11885 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
        return _mlift_detach_keyed_retirements_loop_11461(_x93.table_retirements.head, detached_0, _x93.table_index, _x93.table_order, _x93.table_retirements.tail, table_0, wild___0);
      });
    }
    else {
       
      ((table_0).value = (Keyed_table(_x93.table_index, _x93.table_order, _x93.table_retirements.tail)));
       
      var _x_x1_11218_0 = $std_core_hnd._open_none1(function(_this_0_0 /* keyed-retirement<7244,7242,7243> */ ) {
          return _this_0_0.retirement_handle;
        }, _x93.table_retirements.head);
       
      $std_core_hnd._open_none1(dom_release_retirement, _x_x1_11218_0);
       
      var value_1_10892_0 = $std_core_types.Cons($std_core_hnd._open_none1(function(_this_1_0 /* keyed-retirement<7244,7242,7243> */ ) {
            return _this_1_0.retirement_row;
          }, _x93.table_retirements.head), detached_0.value);
       
      ((detached_0).value = value_1_10892_0);
      {
        // tail call
        continue tailcall;
      }
    }
  }
}}
 
 
// monadic lift
export function _mlift_drain_keyed_retirements_11462(rows) /* forall<a,b,e> (rows : list<keyed-row<e,a,b>>) -> <exn,ui> () */  {
  return exhaust_keyed_row_actions(rows, function(row /* keyed-row<7357,7355,7356> */ ) {
       
      var scope_10087 = $std_core_hnd._open_none1(function(_this /* keyed-row<7357,7355,7356> */ ) {
          return _this.row_scope;
        }, row);
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value;
        }, scope_10087));
    });
}
 
export function drain_keyed_retirements(table) /* forall<a,b,e> (table : ref<global,keyed-table<e,a,b>>) -> <ui,exn> () */  {
   
  var detached = { value: ($std_core_types.Nil) };
  return $std_core_hnd.finally_prompt(function() {
       
      var xs_10896 = detached.value;
       
      var x_11892 = $std_core_list.reverse_acc($std_core_types.Nil, xs_10896);
       
      function next_11893(rows) /* (list<keyed-row<7357,7355,7356>>) -> <exn,ui> () */  {
        return exhaust_keyed_row_actions(rows, function(row /* keyed-row<7357,7355,7356> */ ) {
             
            var scope_10087 = $std_core_hnd._open_none1(function(_this /* keyed-row<7357,7355,7356> */ ) {
                return _this.row_scope;
              }, row);
            return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
                return value;
              }, scope_10087));
          });
      }
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_11893);
      }
      else {
        return next_11893(x_11892);
      }
    }, detach_keyed_retirements_loop(table, detached));
}
 
 
// monadic lift
export function _mlift_commit_keyed_update_11463(row, update, wild___1) /* forall<_e,a,b,e1> (row : keyed-row<e1,a,b>, update : keyed-update<e1,a,b>, wild_@1 : ()) -> kokaine/reactive/effects/signal-write () */  {
   
  var target_0_10911 = $std_core_hnd._open_none1(function(_this_8 /* keyed-row<7589,7587,7588> */ ) {
      return _this_8.row_current_index;
    }, row);
   
  var value_3_10912 = $std_core_hnd._open_none1(function(_this_9 /* keyed-update<7589,7587,7588> */ ) {
      return _this_9.update_index;
    }, update);
  return ((target_0_10911).value = value_3_10912);
}
 
 
// monadic lift
export function _mlift_commit_keyed_update_11464(row, update, wild__) /* forall<_e,a,b,e1> (row : keyed-row<e1,a,b>, update : keyed-update<e1,a,b>, wild_ : ()) -> kokaine/reactive/effects/signal-write () */  {
   
  var target_10903 = $std_core_hnd._open_none1(function(_this_3 /* keyed-row<7589,7587,7588> */ ) {
      return _this_3.row_current_item;
    }, row);
   
  var value_0_10904 = $std_core_hnd._open_none1(function(_this_4 /* keyed-update<7589,7587,7588> */ ) {
      return _this_4.update_item;
    }, update);
  return ((target_10903).value = value_0_10904);
}
 
 
// monadic lift
export function _mlift_commit_keyed_update_11465(row, update, _c_x10517) /* forall<_e,a,b,e1> (row : keyed-row<e1,a,b>, update : keyed-update<e1,a,b>, ()) -> () */  {
  var _x94 = $std_core_hnd._open_none1(function(_this_5 /* keyed-update<7589,7587,7588> */ ) {
      return _this_5.update_index_changed;
    }, update);
  if (_x94) {
     
    var value_2_10120 = $std_core_hnd._open_none1(function(_this_6 /* keyed-row<7589,7587,7588> */ ) {
        return _this_6.row_index_source;
      }, row);
     
    var next_0_10121 = $std_core_hnd._open_none1(function(_this_7 /* keyed-update<7589,7587,7588> */ ) {
        return _this_7.update_index;
      }, update);
     
    var value_0_10023_0 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<int> */ ) {
        return value_1_0;
      }, value_2_10120);
     
    var x_11894 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023_0, next_0_10121);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
        return _mlift_commit_keyed_update_11463(row, update, wild___1);
      });
    }
    else {
      return _mlift_commit_keyed_update_11463(row, update, x_11894);
    }
  }
  else {
    return $std_core_types.Unit;
  }
}
 
export function commit_keyed_update(update) /* forall<a,b,e> (update : keyed-update<e,a,b>) -> kokaine/reactive/effects/signal-write () */  {
   
  var row = $std_core_hnd._open_none1(function(_this /* keyed-update<7589,7587,7588> */ ) {
      return _this.update_row;
    }, update);
   
  var _x95 = $std_core_hnd._open_none1(function(_this_0 /* keyed-update<7589,7587,7588> */ ) {
      return _this_0.update_item_changed;
    }, update);
  if (_x95) {
     
    var value_10117 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<7589,7587,7588> */ ) {
        return _this_1.row_item_source;
      }, row);
     
    var next_10118 = $std_core_hnd._open_none1(function(_this_2 /* keyed-update<7589,7587,7588> */ ) {
        return _this_2.update_item;
      }, update);
     
    var value_0_10023 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/signal<7587> */ ) {
        return value_1;
      }, value_10117);
     
    var x_0_11899 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023, next_10118);
    if ($std_core_hnd._yielding()) {
      var x_11896 = $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
        return _mlift_commit_keyed_update_11464(row, update, wild__);
      });
    }
    else {
      var x_11896 = _mlift_commit_keyed_update_11464(row, update, x_0_11899);
    }
  }
  else {
    var x_11896 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10517 /* () */ ) {
      return _mlift_commit_keyed_update_11465(row, update, _c_x10517);
    });
  }
  else {
    var _x95 = $std_core_hnd._open_none1(function(_this_5 /* keyed-update<7589,7587,7588> */ ) {
        return _this_5.update_index_changed;
      }, update);
    if (_x95) {
       
      var value_2_10120 = $std_core_hnd._open_none1(function(_this_6 /* keyed-row<7589,7587,7588> */ ) {
          return _this_6.row_index_source;
        }, row);
       
      var next_0_10121 = $std_core_hnd._open_none1(function(_this_7 /* keyed-update<7589,7587,7588> */ ) {
          return _this_7.update_index;
        }, update);
       
      var value_0_10023_0 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<int> */ ) {
          return value_1_0;
        }, value_2_10120);
       
      var x_1_11901 = $kokaine_reactive_internal_runtime.signal_fs_set(value_0_10023_0, next_0_10121);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___1 /* () */ ) {
          return _mlift_commit_keyed_update_11463(row, update, wild___1);
        });
      }
      else {
         
        var target_0_10911 = $std_core_hnd._open_none1(function(_this_8 /* keyed-row<7589,7587,7588> */ ) {
            return _this_8.row_current_index;
          }, row);
         
        var value_3_10912 = $std_core_hnd._open_none1(function(_this_9 /* keyed-update<7589,7587,7588> */ ) {
            return _this_9.update_index;
          }, update);
        return ((target_0_10911).value = value_3_10912);
      }
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11466(scope, _y_x10522) /* (scope : kokaine/reactive/integration/lifetime-scope<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10522, false, function() {
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_4 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value_4;
        }, scope));
    });
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11467(first, row_last, _y_x10529) /* (first : node, row-last : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10529, false, function() {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first, row_last, true);
        });
      var _x96 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x96) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    });
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11468(committed, first_0, identity, index, index_source, item, item_source, row_last_0, scope_0, wild___3) /* forall<_e,_e1,a,b,e2> (committed : ref<global,bool>, first : node, identity : a, index : int, index-source : kokaine/reactive/signal<int>, item : b, item-source : kokaine/reactive/signal<b>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, wild_@3 : ()) -> <pure,kokaine/reactive/effects/signal-write,ui> keyed-row<e2,b,a> */  {
   
  var row = Keyed_row(identity, { value: item }, { value: index }, item_source, index_source, scope_0, first_0, row_last_0);
   
  ((committed).value = true);
  return row;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11469(_y_x10553) /* forall<e> (list<kokaine/html/view<e>>) -> <kokaine/reactive/effects/signal-read,div,exn> kokaine/html/view<e> */  {
  if (_y_x10553 === null) {
    return $kokaine_html.Empty;
  }
  else if (_y_x10553 !== null && _y_x10553.tail === null) {
    return _y_x10553.head;
  }
  else {
    return $kokaine_html.Fragment(_y_x10553);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11470(committed_0, first_1, identity_0, index_0, index_source_0, item_0, item_source_0, parent, renderer, root, row_last_1, scope_1, tree) /* forall<_e,_e1,a,b,e2> (committed : ref<global,bool>, first : node, identity : a, index : int, index-source : kokaine/reactive/signal<int>, item : b, item-source : kokaine/reactive/signal<b>, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, tree : kokaine/html/view<e2>) -> <kokaine/reactive/effects/signal-write,div,exn,ui> keyed-row<e2,b,a> */  {
   
  var x_11907 = mount_view(renderer, root, parent, $std_core_types.Just(row_last_1), tree);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3_0 /* () */ ) {
      return _mlift_create_keyed_row_11468(committed_0, first_1, identity_0, index_0, index_source_0, item_0, item_source_0, row_last_1, scope_1, wild___3_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11468(committed_0, first_1, identity_0, index_0, index_source_0, item_0, item_source_0, row_last_1, scope_1, x_11907);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11471(children, committed_1, first_2, identity_1, index_1, index_source_1, item_1, item_source_1, parent_0, renderer_0, root_0, row_last_2, scope_2, _y_x10549) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, index-source : kokaine/reactive/signal<int>, item : b, item-source : kokaine/reactive/signal<b>, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> keyed-row<e2,b,a> */  {
   
  var x_0_11909 = $std_core_hnd._mask_at(_y_x10549, false, function() {
      return $kokaine_reactive.sample(root_0, function() {
           
          var x_1_11912 = $kokaine_html.collect(function() {
            return $std_core_hnd._open2($std_core_vector.unvlist($std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Nil))), children, function() {
                 
                var value_0_10022 = $std_core_hnd._open_none1(function(value_1_0 /* kokaine/reactive/signal<10799> */ ) {
                    return value_1_0;
                  }, item_source_1);
                return $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10022);
              }, function() {
                 
                var value_0_10022_0 = $std_core_hnd._open_none1(function(value_1_1 /* kokaine/reactive/signal<int> */ ) {
                    return value_1_1;
                  }, index_source_1);
                return $kokaine_reactive_internal_runtime.signal_fs_get(value_0_10022_0);
              });
          });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10553_0 /* list<kokaine/html/view<10800>> */ ) {
              return _mlift_create_keyed_row_11469(_y_x10553_0);
            });
          }
          else {
            return _mlift_create_keyed_row_11469(x_1_11912);
          }
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(tree_0 /* kokaine/html/view<10800> */ ) {
      return _mlift_create_keyed_row_11470(committed_1, first_2, identity_1, index_1, index_source_1, item_1, item_source_1, parent_0, renderer_0, root_0, row_last_2, scope_2, tree_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11470(committed_1, first_2, identity_1, index_1, index_source_1, item_1, item_source_1, parent_0, renderer_0, root_0, row_last_2, scope_2, x_0_11909);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11472(_y_x10547) /* (kokaine/reactive/internal/model/signal<int>) -> exn kokaine/reactive/signal<int> */  {
  return _y_x10547;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11473(children_0, committed_2, first_3, identity_2, index_2, item_2, item_source_2, parent_1, renderer_1, root_1, row_last_3, scope_3, index_source_2) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, item : b, item-source : kokaine/reactive/signal<b>, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, index-source : kokaine/reactive/signal<int>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e2,b,a> */  {
   
  var x_2_11914 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10549_0 /* hnd/ev-index */ ) {
      return _mlift_create_keyed_row_11471(children_0, committed_2, first_3, identity_2, index_2, index_source_2, item_2, item_source_2, parent_1, renderer_1, root_1, row_last_3, scope_3, _y_x10549_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11471(children_0, committed_2, first_3, identity_2, index_2, index_source_2, item_2, item_source_2, parent_1, renderer_1, root_1, row_last_3, scope_3, x_2_11914);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11474(_y_x10545) /* forall<a> (kokaine/reactive/internal/model/signal<a>) -> exn kokaine/reactive/signal<a> */  {
  return _y_x10545;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11475(children_1, committed_3, first_4, identity_3, index_3, item_3, parent_2, renderer_2, root_2, row_last_4, scope_4, item_source_3) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, item : b, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, item-source : kokaine/reactive/signal<b>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e2,b,a> */  {
   
  var x_3_11916 = $std_core_hnd._open_at2(0, function(root_3 /* kokaine/reactive/root<ui> */ , initial_0 /* int */ ) {
       
      var root_1_10019_0 = $std_core_hnd._open_none1(function(value_11 /* kokaine/reactive/root<ui> */ ) {
          return value_11;
        }, root_3);
       
      var x_4_11918 = $kokaine_reactive_internal_runtime.signal_by(root_1_10019_0, initial_0, function(___wildcard_x82__29_0 /* int */ , ___wildcard_x82__31_0 /* int */ ) {
          return false;
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_create_keyed_row_11472);
      }
      else {
        return _mlift_create_keyed_row_11472(x_4_11918);
      }
    }, root_2, index_3);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(index_source_3 /* kokaine/reactive/signal<int> */ ) {
      return _mlift_create_keyed_row_11473(children_1, committed_3, first_4, identity_3, index_3, item_3, item_source_3, parent_2, renderer_2, root_2, row_last_4, scope_4, index_source_3);
    });
  }
  else {
    return _mlift_create_keyed_row_11473(children_1, committed_3, first_4, identity_3, index_3, item_3, item_source_3, parent_2, renderer_2, root_2, row_last_4, scope_4, x_3_11916);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11476(_pat_6_0) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11477(first_5, row_last_5, _y_x10540) /* (first : node, row-last : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10540, false, function() {
       
      var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_5, row_last_5, true);
        });
      var _x97 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
      if (_x97) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_0);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
      }
    });
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11478(children_2, committed_4, first_6, identity_4, index_4, item_4, parent_3, range_owned, renderer_3, root_4, row_last_6, scope_5, wild___1) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, item : b, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, wild_@1 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e2,b,a> */  {
   
  ((range_owned).value = true);
   
  var x_5_11922 = $std_core_hnd._open_at2(0, function(root_2_0 /* kokaine/reactive/root<ui> */ , initial /* 10799 */ ) {
       
      var root_1_10019 = $std_core_hnd._open_none1(function(value_10 /* kokaine/reactive/root<ui> */ ) {
          return value_10;
        }, root_2_0);
       
      var x_6_11924 = $kokaine_reactive_internal_runtime.signal_by(root_1_10019, initial, function(___wildcard_x82__29 /* 10799 */ , ___wildcard_x82__31 /* 10799 */ ) {
          return false;
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10545_0 /* kokaine/reactive/internal/model/signal<10799> */ ) {
          return _mlift_create_keyed_row_11474(_y_x10545_0);
        });
      }
      else {
        return _mlift_create_keyed_row_11474(x_6_11924);
      }
    }, root_4, item_4);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(item_source_4 /* kokaine/reactive/signal<10799> */ ) {
      return _mlift_create_keyed_row_11475(children_2, committed_4, first_6, identity_4, index_4, item_4, parent_3, renderer_3, root_4, row_last_6, scope_5, item_source_4);
    });
  }
  else {
    return _mlift_create_keyed_row_11475(children_2, committed_4, first_6, identity_4, index_4, item_4, parent_3, renderer_3, root_4, row_last_6, scope_5, x_5_11922);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11479(children_3, committed_5, first_7, identity_5, index_5, installed, item_5, parent_4, range_owned_0, renderer_4, root_5, row_last_7, scope_6, wild__) /* forall<_e,_e1,a,b,e2> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, installed : ref<global,bool>, item : b, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, row-last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, wild_ : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> keyed-row<e2,b,a> */  {
   
  ((installed).value = true);
   
  var x_7_11926 = $std_core_hnd._open_at2(0, function(root_1_0 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value_8 /* kokaine/reactive/root<ui> */ ) {
          return value_8;
        }, root_1_0);
       
      var x_8_11928 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_create_keyed_row_11476);
      }
      else {
        return _mlift_create_keyed_row_11476(x_8_11928);
      }
    }, root_5, function() {
       
      var x_9_11930 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10540_0 /* hnd/ev-index */ ) {
          return _mlift_create_keyed_row_11477(first_7, row_last_7, _y_x10540_0);
        });
      }
      else {
        return _mlift_create_keyed_row_11477(first_7, row_last_7, x_9_11930);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_0 /* () */ ) {
      return _mlift_create_keyed_row_11478(children_3, committed_5, first_7, identity_5, index_5, item_5, parent_4, range_owned_0, renderer_4, root_5, row_last_7, scope_6, wild___1_0);
    });
  }
  else {
    return _mlift_create_keyed_row_11478(children_3, committed_5, first_7, identity_5, index_5, item_5, parent_4, range_owned_0, renderer_4, root_5, row_last_7, scope_6, x_7_11926);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11480(children_4, committed_6, first_8, identity_6, index_6, installed_0, item_6, last, parent_5, range_owned_1, renderer_5, root_6, scope_7, row_last_8) /* forall<_e,_e1,_e2,a,b,e3> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, first : node, identity : a, index : int, installed : ref<global,bool>, item : b, last : node, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, scope : kokaine/reactive/integration/lifetime-scope<ui>, row-last : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> keyed-row<e3,b,a> */  {
   
  var x_11_11936 = $std_core_hnd._open_at4(0, function(parent_0_0 /* node */ , before /* maybe<node> */ , first_1_0 /* node */ , last_1 /* node */ ) {
      if (before === null) {
         
        var result_1 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_append_marker_pair(parent_0_0, first_1_0, last_1);
          });
        var _x98 = $std_core_hnd._open_none1(dom_attempt_ok, result_1);
        if (_x98) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_1);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_1)));
        }
      }
      else {
         
        var result_2 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_insert_marker_pair_before(parent_0_0, first_1_0, last_1, before.value);
          });
        var _x99 = $std_core_hnd._open_none1(dom_attempt_ok, result_2);
        if (_x99) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_2);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_2)));
        }
      }
    }, parent_5, $std_core_types.Just(last), first_8, row_last_8);
  if ($std_core_hnd._yielding()) {
    var _x100 = $std_core_hnd.yield_extend(function(wild___0 /* () */ ) {
      return _mlift_create_keyed_row_11479(children_4, committed_6, first_8, identity_6, index_6, installed_0, item_6, parent_5, range_owned_1, renderer_5, root_6, row_last_8, scope_7, wild___0);
    });
  }
  else {
    var _x100 = _mlift_create_keyed_row_11479(children_4, committed_6, first_8, identity_6, index_6, installed_0, item_6, parent_5, range_owned_1, renderer_5, root_6, row_last_8, scope_7, x_11_11936);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x98 = installed_0.value;
      if (_x98) {
         
        var _x_x1_4_11239 = range_owned_1.value;
        var _x99 = $std_core_hnd._open_none1(function(b /* bool */ ) {
            return (b) ? false : true;
          }, _x_x1_4_11239);
        if (_x99) {
           
          var x_10_11934 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10529_0 /* hnd/ev-index */ ) {
              return _mlift_create_keyed_row_11467(first_8, row_last_8, _y_x10529_0);
            });
          }
          else {
            return _mlift_create_keyed_row_11467(first_8, row_last_8, x_10_11934);
          }
        }
        else {
          return $std_core_types.Unit;
        }
      }
      else {
        return $std_core_types.Unit;
      }
    }, _x100);
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11481(children_5, committed_7, identity_7, index_7, installed_1, item_7, last_0, parent_6, range_owned_2, renderer_6, root_7, scope_8, first_9) /* forall<_e,_e1,_e2,a,b,e3> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed : ref<global,bool>, identity : a, index : int, installed : ref<global,bool>, item : b, last : node, parent : node, range-owned : ref<global,bool>, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, scope : kokaine/reactive/integration/lifetime-scope<ui>, first : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> keyed-row<e3,b,a> */  {
   
  var x_12_11940 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:for-row");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(row_last_9 /* node */ ) {
      return _mlift_create_keyed_row_11480(children_5, committed_7, first_9, identity_7, index_7, installed_1, item_7, last_0, parent_6, range_owned_2, renderer_6, root_7, scope_8, row_last_9);
    });
  }
  else {
    return _mlift_create_keyed_row_11480(children_5, committed_7, first_9, identity_7, index_7, installed_1, item_7, last_0, parent_6, range_owned_2, renderer_6, root_7, scope_8, x_12_11940);
  }
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11482(_y_x10520) /* (kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<ui>) -> exn kokaine/reactive/integration/lifetime-scope<ui> */  {
  return _y_x10520;
}
 
 
// monadic lift
export function _mlift_create_keyed_row_11483(children_6, identity_8, index_8, item_8, last_2, parent_7, renderer_7, root_8, scope_9) /* forall<_e,_e1,_e2,a,b,e3> (children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), identity : a, index : int, item : b, last : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, scope : kokaine/reactive/integration/lifetime-scope<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> keyed-row<e3,b,a> */  {
   
  var committed_8 = { value: false };
   
  var installed_2 = { value: false };
   
  var range_owned_3 = { value: false };
  return $std_core_hnd.finally_prompt(function() {
      var _x101 = committed_8.value;
      if (_x101) {
        return $std_core_types.Unit;
      }
      else {
         
        var x_13_11944 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10522_0 /* hnd/ev-index */ ) {
            return _mlift_create_keyed_row_11466(scope_9, _y_x10522_0);
          });
        }
        else {
          return _mlift_create_keyed_row_11466(scope_9, x_13_11944);
        }
      }
    }, $kokaine_reactive_integration.with_lifetime_scope(root_8, scope_9, function() {
         
        var x_14_11946 = $std_core_hnd._open_at1(0, dom_attempt, function() {
            return dom_create_comment("kokaine:for-row");
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(first_10 /* node */ ) {
            return _mlift_create_keyed_row_11481(children_6, committed_8, identity_8, index_8, installed_2, item_8, last_2, parent_7, range_owned_3, renderer_7, root_8, scope_9, first_10);
          });
        }
        else {
          return _mlift_create_keyed_row_11481(children_6, committed_8, identity_8, index_8, installed_2, item_8, last_2, parent_7, range_owned_3, renderer_7, root_8, scope_9, x_14_11946);
        }
      }));
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11484(drafts, wild___0_0) /* forall<_e,a,b,e1> (drafts : ref<global,list<keyed-row<e1,a,b>>>, wild_@0@0 : ()) -> <ui,exn> () */  {
   
  var rows_10161 = drafts.value;
  return exhaust_keyed_row_actions(rows_10161, function(row_0 /* keyed-row<10818,10816,10817> */ ) {
       
      var scope_1_10163 = $std_core_hnd._open_none1(function(_this /* keyed-row<10818,10816,10817> */ ) {
          return _this.row_scope;
        }, row_0);
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_28 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value_28;
        }, scope_1_10163));
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11485(drafts_0, last_0_0, move_phase, old_order, parent_0_0_0, participation, staged_retirements, _y_x10569) /* forall<_e,a,b,e1> (drafts : ref<global,list<keyed-row<e1,a,b>>>, last@0@0 : node, move-phase : ref<global,bool>, old-order : list<keyed-row<e1,a,b>>, parent@0@0 : node, participation : keyed-participation, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10569, false, function() {
      return $std_core_hnd.finally_prompt(function() {
          var _x102 = move_phase.value;
          if (_x102) {
            return rollback_keyed_order(parent_0_0_0, last_0_0, old_order);
          }
          else {
            return $std_core_types.Unit;
          }
        }, $std_core_hnd.finally_prompt(function() {
             
            var _x_x1_1_11259 = staged_retirements.value;
             
            var x_15_11953 = $std_core_hnd._open_none1(release_keyed_retirements, _x_x1_1_11259);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___0_0_0 /* () */ ) {
                return _mlift_reconcile_keyed_11484(drafts_0, wild___0_0_0);
              });
            }
            else {
              return _mlift_reconcile_keyed_11484(drafts_0, x_15_11953);
            }
          }, discard_keyed_participation(participation)));
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11486(table, _y_x10632) /* forall<a,b,e> (table : ref<global,keyed-table<e,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10632, false, function() {
      return drain_keyed_retirements(table);
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11487(final_updates, _y_x10626) /* forall<a,b,e> (final-updates : list<keyed-update<e,a,b>>, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-write> () */  {
  return $std_core_hnd._mask_at(_y_x10626, false, function() {
      return $std_core_list.foreach(final_updates, function(update_1 /* keyed-update<10818,10816,10817> */ ) {
          return commit_keyed_update(update_1);
        });
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11488(committed_0_0, final_index, final_order, retirements, staged_retirements_0, table_0, wild___18) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, wild_@18 : ()) -> <ui,div,exn,kokaine/reactive/effects/signal-write> () */  {
   
  ((table_0).value = (Keyed_table(final_index, final_order, retirements)));
   
  ((staged_retirements_0).value = ($std_core_types.Nil));
   
  ((committed_0_0).value = true);
   
  var x_16_11957 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10632_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11486(table_0, _y_x10632_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11486(table_0, x_16_11957);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11489(committed_0_1, final_index_0, final_order_0, final_updates_0, retirements_0, staged_retirements_1, table_1, wild___17) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, wild_@17 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_18_11962 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
   
  if ($std_core_hnd._yielding()) {
    var x_17_11959 = $std_core_hnd.yield_extend(function(_y_x10626_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11487(final_updates_0, _y_x10626_0);
    });
  }
  else {
    var x_17_11959 = _mlift_reconcile_keyed_11487(final_updates_0, x_18_11962);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___18_0 /* () */ ) {
      return _mlift_reconcile_keyed_11488(committed_0_1, final_index_0, final_order_0, retirements_0, staged_retirements_1, table_1, wild___18_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11488(committed_0_1, final_index_0, final_order_0, retirements_0, staged_retirements_1, table_1, x_17_11959);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11490(committed_0_2, final_index_1, final_order_1, final_updates_1, publication_transaction, retirements_1, staged_retirements_2, table_2, _y_x10623) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_19_11964 = $std_core_hnd._mask_at(_y_x10623, false, function() {
      return $kokaine_dom_internal_keyed_dash_transaction.publish_keyed_transaction(publication_transaction);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___17_0 /* () */ ) {
      return _mlift_reconcile_keyed_11489(committed_0_2, final_index_1, final_order_1, final_updates_1, retirements_1, staged_retirements_2, table_2, wild___17_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11489(committed_0_2, final_index_1, final_order_1, final_updates_1, retirements_1, staged_retirements_2, table_2, x_19_11964);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11491(committed_0_3, final_index_2, final_order_2, final_updates_2, publication_transaction_0, retirements_2, staged_retirements_3, table_3, wild___16) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, wild_@16 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_20_11966 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10623_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11490(committed_0_3, final_index_2, final_order_2, final_updates_2, publication_transaction_0, retirements_2, staged_retirements_3, table_3, _y_x10623_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11490(committed_0_3, final_index_2, final_order_2, final_updates_2, publication_transaction_0, retirements_2, staged_retirements_3, table_3, x_20_11966);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11492(committed_0_4, final_index_3, final_order_3, final_updates_3, participation_0, publication_transaction_1, retirements_3, staged_retirements_4, table_4, _y_x10619) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_21_11968 = $std_core_hnd._mask_at(_y_x10619, false, function() {
      if (participation_0._tag === 1) {
        return $kokaine_reactive_integration_internal_provision.promote_provision($std_core_hnd._open_none1(function(value_54 /* kokaine/reactive/integration/provision-lease<ui> */ ) {
            return value_54;
          }, participation_0.keyed_lease));
      }
      else {
        return $std_core_types.Unit;
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___16_0 /* () */ ) {
      return _mlift_reconcile_keyed_11491(committed_0_4, final_index_3, final_order_3, final_updates_3, publication_transaction_1, retirements_3, staged_retirements_4, table_4, wild___16_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11491(committed_0_4, final_index_3, final_order_3, final_updates_3, publication_transaction_1, retirements_3, staged_retirements_4, table_4, x_21_11968);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11493(committed_0_5, final_index_4, final_order_4, final_updates_4, participation_1, publication_transaction_2, retirements_4, staged_retirements_5, table_5, wild___15) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, wild_@15 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_22_11970 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10619_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11492(committed_0_5, final_index_4, final_order_4, final_updates_4, participation_1, publication_transaction_2, retirements_4, staged_retirements_5, table_5, _y_x10619_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11492(committed_0_5, final_index_4, final_order_4, final_updates_4, participation_1, publication_transaction_2, retirements_4, staged_retirements_5, table_5, x_22_11970);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11494(committed_0_6, final_index_5, final_order_5, final_updates_5, participation_2, publication_transaction_3, retirements_5, staged_retirements_6, table_6, _y_x10616) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, retirements : list<keyed-retirement<e1,a,b>>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_23_11972 = $std_core_hnd._mask_at(_y_x10616, false, function() {
      return $kokaine_dom_internal_keyed_dash_transaction.prepare_keyed_transaction(publication_transaction_3);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___15_0 /* () */ ) {
      return _mlift_reconcile_keyed_11493(committed_0_6, final_index_5, final_order_5, final_updates_5, participation_2, publication_transaction_3, retirements_5, staged_retirements_6, table_6, wild___15_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11493(committed_0_6, final_index_5, final_order_5, final_updates_5, participation_2, publication_transaction_3, retirements_5, staged_retirements_6, table_6, x_23_11972);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11495(committed_0_7, final_index_6, final_order_6, final_updates_6, participation_3, publication_transaction_4, staged_retirements_7, table_7, retirements_6) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, table : ref<global,keyed-table<e1,a,b>>, retirements : list<keyed-retirement<e1,a,b>>) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  ((staged_retirements_7).value = retirements_6);
   
  var x_24_11974 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10616_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11494(committed_0_7, final_index_6, final_order_6, final_updates_6, participation_3, publication_transaction_4, retirements_6, staged_retirements_7, table_7, _y_x10616_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11494(committed_0_7, final_index_6, final_order_6, final_updates_6, participation_3, publication_transaction_4, retirements_6, staged_retirements_7, table_7, x_24_11974);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11496(committed_0_8, final_index_7, final_order_7, final_updates_7, participation_4, publication_transaction_5, staged_retirements_8, stale, table_8, wild___13) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, wild_@13 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_25_11976 = $std_core_hnd._open_at1(0, function(rows_0 /* list<keyed-row<10818,10816,10817>> */ ) {
      return stage_keyed_retirements_loop(rows_0, $std_core_types.Nil);
    }, stale);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(retirements_7 /* list<keyed-retirement<10818,10816,10817>> */ ) {
      return _mlift_reconcile_keyed_11495(committed_0_8, final_index_7, final_order_7, final_updates_7, participation_4, publication_transaction_5, staged_retirements_8, table_8, retirements_7);
    });
  }
  else {
    return _mlift_reconcile_keyed_11495(committed_0_8, final_index_7, final_order_7, final_updates_7, participation_4, publication_transaction_5, staged_retirements_8, table_8, x_25_11976);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11497(committed_0_9, final_index_8, final_order_8, final_updates_8, participation_5, publication_transaction_6, root_0_0, scope_0_0, staged_retirements_9, stale_0, table_9, _y_x10611) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_26_11978 = $std_core_hnd._mask_at(_y_x10611, false, function() {
      return $kokaine_reactive_integration.with_lifetime_scope(root_0_0, scope_0_0, function() {
          return $std_core_types.Unit;
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___13_0 /* () */ ) {
      return _mlift_reconcile_keyed_11496(committed_0_9, final_index_8, final_order_8, final_updates_8, participation_5, publication_transaction_6, staged_retirements_9, stale_0, table_9, wild___13_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11496(committed_0_9, final_index_8, final_order_8, final_updates_8, participation_5, publication_transaction_6, staged_retirements_9, stale_0, table_9, x_26_11978);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11498(committed_0_10, final_index_9, final_order_9, final_updates_9, participation_6, publication_transaction_7, root_0_0_0, scope_0_0_0, staged_retirements_10, stale_1, table_10, wild___12) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, wild_@12 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_27_11980 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10611_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11497(committed_0_10, final_index_9, final_order_9, final_updates_9, participation_6, publication_transaction_7, root_0_0_0, scope_0_0_0, staged_retirements_10, stale_1, table_10, _y_x10611_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11497(committed_0_10, final_index_9, final_order_9, final_updates_9, participation_6, publication_transaction_7, root_0_0_0, scope_0_0_0, staged_retirements_10, stale_1, table_10, x_27_11980);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11499(committed_0_11, final_index_10, final_order_10, final_updates_10, last_0_0_0, parent_0_0_1, participation_7, physical_order, publication_transaction_8, root_0_0_1, scope_0_0_1, staged_retirements_11, stale_2, table_11, placed) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, last@0@0 : node, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, placed : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_28_11982 = $std_core_hnd._open_at4(0, validate_keyed_order, parent_0_0_1, last_0_0_0, placed, physical_order);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___12_0 /* () */ ) {
      return _mlift_reconcile_keyed_11498(committed_0_11, final_index_10, final_order_10, final_updates_10, participation_7, publication_transaction_8, root_0_0_1, scope_0_0_1, staged_retirements_11, stale_2, table_11, wild___12_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11498(committed_0_11, final_index_10, final_order_10, final_updates_10, participation_7, publication_transaction_8, root_0_0_1, scope_0_0_1, staged_retirements_11, stale_2, table_11, x_28_11982);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11500(_y_x10606) /* (node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11501(final_updates_11, parent_0_0_2, cursor) /* forall<a,b,e> (final-updates : list<keyed-update<e,a,b>>, parent@0@0 : node, cursor : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_29_11984 = $std_core_hnd._open_at3(0, place_keyed_updates, parent_0_0_2, cursor, final_updates_11);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_reconcile_keyed_11500);
  }
  else {
    return _mlift_reconcile_keyed_11500(x_29_11984);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11502(final_updates_12, first_0_0, last_0_0_1, move_phase_0, parent_0_0_3, wild___9) /* forall<_e,a,b,e1> (final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, wild_@9 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  ((move_phase_0).value = true);
   
  var x_30_11986 = $std_core_hnd._open_at3(0, function(parent_3_0 /* node */ , first_5_0 /* node */ , last_5 /* node */ ) {
       
      var result_3 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_3_0, first_5_0, last_5);
        });
      var _x103 = $std_core_hnd._open_none1(dom_attempt_ok, result_3);
      if (_x103) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_3);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_3)));
      }
    }, parent_0_0_3, first_0_0, last_0_0_1);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(cursor_0 /* node */ ) {
      return _mlift_reconcile_keyed_11501(final_updates_12, parent_0_0_3, cursor_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11501(final_updates_12, parent_0_0_3, x_30_11986);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11503(committed_0_12, final_index_11, final_order_11, final_updates_13, first_0_0_0, last_0_0_2, parent_0_0_4, participation_8, physical_order_0, publication_transaction_9, root_0_0_2, scope_0_0_2, staged_retirements_12, stale_3, table_12, _c_x10607) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, ()) -> () */  {
   
  var x_31_11989 = $std_core_hnd._open_at3(0, function(parent_4_0 /* node */ , first_6_0 /* node */ , last_6 /* node */ ) {
       
      var result_4 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_4_0, first_6_0, last_6);
        });
      var _x103 = $std_core_hnd._open_none1(dom_attempt_ok, result_4);
      if (_x103) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_4);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_4)));
      }
    }, parent_0_0_4, first_0_0_0, last_0_0_2);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(placed_0 /* node */ ) {
      return _mlift_reconcile_keyed_11499(committed_0_12, final_index_11, final_order_11, final_updates_13, last_0_0_2, parent_0_0_4, participation_8, physical_order_0, publication_transaction_9, root_0_0_2, scope_0_0_2, staged_retirements_12, stale_3, table_12, placed_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11499(committed_0_12, final_index_11, final_order_11, final_updates_13, last_0_0_2, parent_0_0_4, participation_8, physical_order_0, publication_transaction_9, root_0_0_2, scope_0_0_2, staged_retirements_12, stale_3, table_12, x_31_11989);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11504(committed_0_13, final_index_12, final_order_12, final_updates_14, first_0_0_1, last_0_0_3, move_phase_1, parent_0_0_5, participation_9, physical_order_1, publication_transaction_10, root_0_0_3, scope_0_0_3, staged_retirements_13, stale_4, table_13, _y_x10602) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, bool) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var order_changed = $std_core_hnd._open_none1(function(b_1 /* bool */ ) {
      return (b_1) ? false : true;
    }, _y_x10602);
   
  if (order_changed) {
     
    var x_33_11994 = $std_core_hnd._open_at2(0, validate_keyed_move_lifecycles, parent_0_0_5, physical_order_1);
    if ($std_core_hnd._yielding()) {
      var x_32_11992 = $std_core_hnd.yield_extend(function(wild___9_0 /* () */ ) {
        return _mlift_reconcile_keyed_11502(final_updates_14, first_0_0_1, last_0_0_3, move_phase_1, parent_0_0_5, wild___9_0);
      });
    }
    else {
      var x_32_11992 = _mlift_reconcile_keyed_11502(final_updates_14, first_0_0_1, last_0_0_3, move_phase_1, parent_0_0_5, x_33_11994);
    }
  }
  else {
    var x_32_11992 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10607_0 /* () */ ) {
      return _mlift_reconcile_keyed_11503(committed_0_13, final_index_12, final_order_12, final_updates_14, first_0_0_1, last_0_0_3, parent_0_0_5, participation_9, physical_order_1, publication_transaction_10, root_0_0_3, scope_0_0_3, staged_retirements_13, stale_4, table_13, _c_x10607_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11503(committed_0_13, final_index_12, final_order_12, final_updates_14, first_0_0_1, last_0_0_3, parent_0_0_5, participation_9, physical_order_1, publication_transaction_10, root_0_0_3, scope_0_0_3, staged_retirements_13, stale_4, table_13, x_32_11992);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11505(committed_0_14, final_index_13, final_order_13, final_updates_15, first_0_0_2, last_0_0_4, move_phase_2, parent_0_0_6, participation_10, physical_order_2, publication_transaction_11, root_0_0_4, scope_0_0_4, staged_retirements_14, stale_5, table_14, current_cursor) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, participation : keyed-participation, physical-order : list<keyed-row<e1,a,b>>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, current-cursor : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_34_11996 = $std_core_hnd._open_at4(0, keyed_order_matches, parent_0_0_6, last_0_0_4, current_cursor, physical_order_2);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10602_0 /* bool */ ) {
      return _mlift_reconcile_keyed_11504(committed_0_14, final_index_13, final_order_13, final_updates_15, first_0_0_2, last_0_0_4, move_phase_2, parent_0_0_6, participation_10, physical_order_2, publication_transaction_11, root_0_0_4, scope_0_0_4, staged_retirements_14, stale_5, table_14, _y_x10602_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11504(committed_0_14, final_index_13, final_order_13, final_updates_15, first_0_0_2, last_0_0_4, move_phase_2, parent_0_0_6, participation_10, physical_order_2, publication_transaction_11, root_0_0_4, scope_0_0_4, staged_retirements_14, stale_5, table_14, x_34_11996);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11506(committed_0_15, final_index_14, final_order_14, final_updates_16, first_0_0_3, last_0_0_5, move_phase_3, parent_0_0_7, participation_11, publication_transaction_12, root_0_0_5, scope_0_0_5, staged_retirements_15, stale_6, table_15, wild___8) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, wild_@8 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var physical_order_3 = $std_core_list.append(final_order_14, stale_6);
   
  var x_35_11998 = $std_core_hnd._open_at3(0, function(parent_2_0 /* node */ , first_4_0 /* node */ , last_4 /* node */ ) {
       
      var result_5 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_2_0, first_4_0, last_4);
        });
      var _x103 = $std_core_hnd._open_none1(dom_attempt_ok, result_5);
      if (_x103) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_5);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_5)));
      }
    }, parent_0_0_7, first_0_0_3, last_0_0_5);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(current_cursor_0 /* node */ ) {
      return _mlift_reconcile_keyed_11505(committed_0_15, final_index_14, final_order_14, final_updates_16, first_0_0_3, last_0_0_5, move_phase_3, parent_0_0_7, participation_11, physical_order_3, publication_transaction_12, root_0_0_5, scope_0_0_5, staged_retirements_15, stale_6, table_15, current_cursor_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11505(committed_0_15, final_index_14, final_order_14, final_updates_16, first_0_0_3, last_0_0_5, move_phase_3, parent_0_0_7, participation_11, physical_order_3, publication_transaction_12, root_0_0_5, scope_0_0_5, staged_retirements_15, stale_6, table_15, x_35_11998);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11507(committed_0_16, final_index_15, final_order_15, final_updates_17, first_0_0_4, last_0_0_6, move_phase_4, parent_0_0_8, participation_12, publication_transaction_13, renderer_0_0, root_0_0_6, scope_0_0_6, staged_retirements_16, stale_7, table_16, _y_x10597) /* forall<_e,a,b,e1> (committed@0 : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e1,a,b>>, final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e1,a,b>>>, stale : list<keyed-row<e1,a,b>>, table : ref<global,keyed-table<e1,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_36_12001 = $std_core_hnd._mask_at(_y_x10597, false, function() {
      if (participation_12._tag === 1) {
        return $kokaine_dom_internal_keyed_dash_transaction.with_keyed_transaction(renderer_0_0, participation_12.keyed_provision, participation_12.keyed_journal, function() {
            return $kokaine_reactive_integration_internal_provision.drain_provision($std_core_hnd._open_none1(function(value /* kokaine/reactive/integration/provision-lease<ui> */ ) {
                return value;
              }, participation_12.keyed_lease));
          });
      }
      else {
        return $std_core_types.Unit;
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___8_0 /* () */ ) {
      return _mlift_reconcile_keyed_11506(committed_0_16, final_index_15, final_order_15, final_updates_17, first_0_0_4, last_0_0_6, move_phase_4, parent_0_0_8, participation_12, publication_transaction_13, root_0_0_6, scope_0_0_6, staged_retirements_16, stale_7, table_16, wild___8_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11506(committed_0_16, final_index_15, final_order_15, final_updates_17, first_0_0_4, last_0_0_6, move_phase_4, parent_0_0_8, participation_12, publication_transaction_13, root_0_0_6, scope_0_0_6, staged_retirements_16, stale_7, table_16, x_36_12001);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11508(root_0_0_7, scope_0_0_7, wild___26) /* (root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, wild_@26 : ()) -> <ui,exn> () */  {
  return $kokaine_reactive_integration.with_lifetime_scope(root_0_0_7, scope_0_0_7, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11509(final_order_16, last_0_0_7, parent_0_0_9, root_0_0_8, scope_0_0_8, placed_0_0) /* forall<a,b,e> (final-order : list<keyed-row<e,a,b>>, last@0@0 : node, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, placed@0 : node) -> <ui,exn> () */  {
   
  var x_37_12005 = validate_keyed_order(parent_0_0_9, last_0_0_7, placed_0_0, final_order_16);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___26_0 /* () */ ) {
      return _mlift_reconcile_keyed_11508(root_0_0_8, scope_0_0_8, wild___26_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11508(root_0_0_8, scope_0_0_8, x_37_12005);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11510(_y_x10645) /* (node) -> <ui,exn> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11511(final_updates_18, parent_0_0_10, cursor_0_0) /* forall<a,b,e> (final-updates : list<keyed-update<e,a,b>>, parent@0@0 : node, cursor@0 : node) -> <ui,exn> () */  {
   
  var x_38_12007 = place_keyed_updates(parent_0_0_10, cursor_0_0, final_updates_18);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_reconcile_keyed_11510);
  }
  else {
    return _mlift_reconcile_keyed_11510(x_38_12007);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11512(final_updates_19, first_0_0_5, last_0_0_8, move_phase_5, parent_0_0_11, wild___23) /* forall<_e,a,b,e1> (final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, wild_@23 : ()) -> <ui,exn> () */  {
   
  ((move_phase_5).value = true);
   
  var result_6 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_range_first(parent_0_0_11, first_0_0_5, last_0_0_8);
    });
   
  var _x103 = $std_core_hnd._open_none1(dom_attempt_ok, result_6);
  if (_x103) {
    var x_39_12009 = $std_core_hnd._open_none1(dom_attempt_value, result_6);
  }
  else {
    var x_39_12009 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_6)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(cursor_0_1 /* node */ ) {
      return _mlift_reconcile_keyed_11511(final_updates_19, parent_0_0_11, cursor_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11511(final_updates_19, parent_0_0_11, x_39_12009);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11513(final_order_17, first_0_0_6, last_0_0_9, parent_0_0_12, root_0_0_9, scope_0_0_9, _c_x10646) /* forall<a,b,e> (final-order : list<keyed-row<e,a,b>>, first@0@0 : node, last@0@0 : node, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, ()) -> () */  {
   
  var result_7 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_range_first(parent_0_0_12, first_0_0_6, last_0_0_9);
    });
   
  var _x103 = $std_core_hnd._open_none1(dom_attempt_ok, result_7);
  if (_x103) {
    var x_40_12012 = $std_core_hnd._open_none1(dom_attempt_value, result_7);
  }
  else {
    var x_40_12012 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_7)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(placed_0_1 /* node */ ) {
      return _mlift_reconcile_keyed_11509(final_order_17, last_0_0_9, parent_0_0_12, root_0_0_9, scope_0_0_9, placed_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11509(final_order_17, last_0_0_9, parent_0_0_12, root_0_0_9, scope_0_0_9, x_40_12012);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11514(final_order_18, final_updates_20, first_0_0_7, last_0_0_10, move_phase_6, parent_0_0_13, root_0_0_10, scope_0_0_10, _y_x10642) /* forall<_e,a,b,e1> (final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, bool) -> <ui,exn> () */  {
   
  var order_changed_0 = $std_core_hnd._open_none1(function(b_4 /* bool */ ) {
      return (b_4) ? false : true;
    }, _y_x10642);
   
  if (order_changed_0) {
     
    var x_42_12017 = validate_keyed_move_lifecycles(parent_0_0_13, final_order_18);
    if ($std_core_hnd._yielding()) {
      var x_41_12015 = $std_core_hnd.yield_extend(function(wild___23_0 /* () */ ) {
        return _mlift_reconcile_keyed_11512(final_updates_20, first_0_0_7, last_0_0_10, move_phase_6, parent_0_0_13, wild___23_0);
      });
    }
    else {
      var x_41_12015 = _mlift_reconcile_keyed_11512(final_updates_20, first_0_0_7, last_0_0_10, move_phase_6, parent_0_0_13, x_42_12017);
    }
  }
  else {
    var x_41_12015 = $std_core_types.Unit;
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10646_0 /* () */ ) {
      return _mlift_reconcile_keyed_11513(final_order_18, first_0_0_7, last_0_0_10, parent_0_0_13, root_0_0_10, scope_0_0_10, _c_x10646_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11513(final_order_18, first_0_0_7, last_0_0_10, parent_0_0_13, root_0_0_10, scope_0_0_10, x_41_12015);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11515(final_order_19, final_updates_21, first_0_0_8, last_0_0_11, move_phase_7, parent_0_0_14, root_0_0_11, scope_0_0_11, current_cursor_0_0) /* forall<_e,a,b,e1> (final-order : list<keyed-row<e1,a,b>>, final-updates : list<keyed-update<e1,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, parent@0@0 : node, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, current-cursor@0 : node) -> <ui,exn> () */  {
   
  var x_43_12019 = keyed_order_matches(parent_0_0_14, last_0_0_11, current_cursor_0_0, final_order_19);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10642_0 /* bool */ ) {
      return _mlift_reconcile_keyed_11514(final_order_19, final_updates_21, first_0_0_8, last_0_0_11, move_phase_7, parent_0_0_14, root_0_0_11, scope_0_0_11, _y_x10642_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11514(final_order_19, final_updates_21, first_0_0_8, last_0_0_11, move_phase_7, parent_0_0_14, root_0_0_11, scope_0_0_11, x_43_12019);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11516(enlisted, wild___28) /* forall<_e> (enlisted : ref<global,bool>, wild_@28 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return ((enlisted).value = true);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11517(committed_0_17, drafts_1, enlisted_0, final_index_16, final_order_20, final_updates_22, first_0_0_9, last_0_0_12, move_phase_8, old_order_0, parent_0_0_15, publication_transaction_14, root_0_0_12, scope_0_0_12, table_17, _y_x10640) /* forall<_e,_e1,a,b,e2> (committed@0 : ref<global,bool>, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, final-order : list<keyed-row<e2,a,b>>, final-updates : list<keyed-update<e2,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, old-order : list<keyed-row<e2,a,b>>, parent@0@0 : node, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e2,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_44_12021 = $std_core_hnd._mask_at(_y_x10640, false, function() {
      return $kokaine_dom_internal_keyed_dash_transaction.stage_keyed_publication(publication_transaction_14, function() {
           
          var result_8 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
              return dom_range_first(parent_0_0_15, first_0_0_9, last_0_0_12);
            });
           
          var _x103 = $std_core_hnd._open_none1(dom_attempt_ok, result_8);
          if (_x103) {
            var x_45_12023 = $std_core_hnd._open_none1(dom_attempt_value, result_8);
          }
          else {
            var x_45_12023 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_8)));
          }
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(current_cursor_0_1 /* node */ ) {
              return _mlift_reconcile_keyed_11515(final_order_20, final_updates_22, first_0_0_9, last_0_0_12, move_phase_8, parent_0_0_15, root_0_0_12, scope_0_0_12, current_cursor_0_1);
            });
          }
          else {
            return _mlift_reconcile_keyed_11515(final_order_20, final_updates_22, first_0_0_9, last_0_0_12, move_phase_8, parent_0_0_15, root_0_0_12, scope_0_0_12, x_45_12023);
          }
        }, function() {
           
          ((table_17).value = (Keyed_table(final_index_16, final_order_20, $std_core_types.Nil)));
          return ((committed_0_17).value = true);
        }, function() {
           
          var rows_1_10216 = drafts_1.value;
          return $std_core_hnd.finally_prompt(function() {
              var _x103 = move_phase_8.value;
              if (_x103) {
                return rollback_keyed_order(parent_0_0_15, last_0_0_12, old_order_0);
              }
              else {
                return $std_core_types.Unit;
              }
            }, exhaust_keyed_row_actions(rows_1_10216, function(row_1 /* keyed-row<10818,10816,10817> */ ) {
                 
                var scope_2_10218 = $std_core_hnd._open_none1(function(_this_4 /* keyed-row<10818,10816,10817> */ ) {
                    return _this_4.row_scope;
                  }, row_1);
                return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_60 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
                    return value_60;
                  }, scope_2_10218));
              }));
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___28_0 /* () */ ) {
      return _mlift_reconcile_keyed_11516(enlisted_0, wild___28_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11516(enlisted_0, x_44_12021);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11518(committed_0_18, drafts_2, enlisted_1, final_index_17, final_order_21, final_updates_23, first_0_0_10, last_0_0_13, move_phase_9, old_order_1, parent_0_0_16, publication_transaction_15, root_0_0_13, scope_0_0_13, table_18, _c_x10639) /* forall<_e,_e1,a,b,e2> (committed@0 : ref<global,bool>, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, final-order : list<keyed-row<e2,a,b>>, final-updates : list<keyed-update<e2,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, old-order : list<keyed-row<e2,a,b>>, parent@0@0 : node, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e2,a,b>>, ()) -> () */  {
   
  var x_46_12028 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10640_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11517(committed_0_18, drafts_2, enlisted_1, final_index_17, final_order_21, final_updates_23, first_0_0_10, last_0_0_13, move_phase_9, old_order_1, parent_0_0_16, publication_transaction_15, root_0_0_13, scope_0_0_13, table_18, _y_x10640_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11517(committed_0_18, drafts_2, enlisted_1, final_index_17, final_order_21, final_updates_23, first_0_0_10, last_0_0_13, move_phase_9, old_order_1, parent_0_0_16, publication_transaction_15, root_0_0_13, scope_0_0_13, table_18, x_46_12028);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11519(committed_0_19, drafts_3, enlisted_2, final_index_18, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, old_order_2, owns_provision, parent_0_0_17, participation_13, publication_transaction_16, renderer_0_1, root_0_0_14, scope_0_0_14, staged_retirements_17, stale_8, table_19, final_order_22) /* forall<_e,_e1,a,b,e2> (committed@0 : ref<global,bool>, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, final-index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, final-updates : list<keyed-update<e2,a,b>>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, old-order : list<keyed-row<e2,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e2,a,b>>>, stale : list<keyed-row<e2,a,b>>, table : ref<global,keyed-table<e2,a,b>>, final-order : list<keyed-row<e2,a,b>>) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
  if (owns_provision) {
     
    var x_47_12030 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10597_0 /* hnd/ev-index */ ) {
        return _mlift_reconcile_keyed_11507(committed_0_19, final_index_18, final_order_22, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, parent_0_0_17, participation_13, publication_transaction_16, renderer_0_1, root_0_0_14, scope_0_0_14, staged_retirements_17, stale_8, table_19, _y_x10597_0);
      });
    }
    else {
      return _mlift_reconcile_keyed_11507(committed_0_19, final_index_18, final_order_22, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, parent_0_0_17, participation_13, publication_transaction_16, renderer_0_1, root_0_0_14, scope_0_0_14, staged_retirements_17, stale_8, table_19, x_47_12030);
    }
  }
  else {
     
    var _x_x1_31_11326 = $std_core_hnd._open_none1(function(list /* list<keyed-row<10818,10816,10817>> */ ) {
        return (list === null);
      }, old_order_2);
     
    var _x103 = $std_core_hnd._open_none1(function(b_2 /* bool */ ) {
        return (b_2) ? false : true;
      }, _x_x1_31_11326);
    if (_x103) {
      var x_48_12032 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "joined keyed reconciliation must be initial construction");
    }
    else {
       
      var _x_x1_34_11330 = $std_core_hnd._open_none1(function(list_0 /* list<keyed-row<10818,10816,10817>> */ ) {
          return (list_0 === null);
        }, stale_8);
      var _x104 = $std_core_hnd._open_none1(function(b_3 /* bool */ ) {
          return (b_3) ? false : true;
        }, _x_x1_34_11330);
      if (_x104) {
        var x_48_12032 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "joined keyed reconciliation must be initial construction");
      }
      else {
        var x_48_12032 = $std_core_types.Unit;
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10639_0 /* () */ ) {
        return _mlift_reconcile_keyed_11518(committed_0_19, drafts_3, enlisted_2, final_index_18, final_order_22, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, old_order_2, parent_0_0_17, publication_transaction_16, root_0_0_14, scope_0_0_14, table_19, _c_x10639_0);
      });
    }
    else {
      return _mlift_reconcile_keyed_11518(committed_0_19, drafts_3, enlisted_2, final_index_18, final_order_22, final_updates_24, first_0_0_11, last_0_0_14, move_phase_10, old_order_2, parent_0_0_17, publication_transaction_16, root_0_0_14, scope_0_0_14, table_19, x_48_12032);
    }
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11520(current_index, existing, item_changed, item_0_0, position, updates, _c_x10589) /* forall<_e,_e1,a,b,e2> (current-index : int, existing : keyed-row<e2,a,b>, item-changed : bool, item@0@0 : a, position : ref<global,int>, updates : ref<global,list<keyed-update<e2,a,b>>>, ()) -> () */  {
   
  var value_39_0_10990 = $std_core_hnd._open_none1(function(_this_1 /* keyed-row<10818,10816,10817> */ ) {
      return _this_1.row_current_index;
    }, existing);
   
  var update = Keyed_update(existing, item_0_0, current_index, item_changed, $std_core_types._int_ne((value_39_0_10990.value),current_index));
   
  var value_40_10993 = $std_core_types.Cons(update, updates.value);
   
  ((updates).value = value_40_10993);
   
  var value_42_10996 = $std_core_types._int_add(current_index,1);
  return ((position).value = value_42_10996);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11521(current_index_0, draft, item_0_0_0, position_0, updates_0, _c_x10592) /* forall<_e,_e1,a,b,e2> (current-index : int, draft : keyed-row<e2,a,b>, item@0@0 : a, position : ref<global,int>, updates : ref<global,list<keyed-update<e2,a,b>>>, ()) -> () */  {
   
  var value_46_0_11007 = $std_core_hnd._open_none1(function(_this_2 /* keyed-row<10818,10816,10817> */ ) {
      return _this_2.row_current_index;
    }, draft);
   
  var update_0 = Keyed_update(draft, item_0_0_0, current_index_0, false, $std_core_types._int_ne((value_46_0_11007.value),current_index_0));
   
  var value_47_11010 = $std_core_types.Cons(update_0, updates_0.value);
   
  ((updates_0).value = value_47_11010);
   
  var value_49_11013 = $std_core_types._int_add(current_index_0,1);
  return ((position_0).value = value_49_11013);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11522(compare, current_index_1, drafts_4, identity_0_0, item_0_0_1, next_index, position_1, updates_1, draft_0) /* forall<_e,_e1,a,b,e2> (compare : (b, b) -> order, current-index : int, drafts : ref<global,list<keyed-row<e2,a,b>>>, identity@0@0 : b, item@0@0 : a, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>>, position : ref<global,int>, updates : ref<global,list<keyed-update<e2,a,b>>>, draft : keyed-row<e2,a,b>) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var value_43_11000 = $std_core_types.Cons(draft_0, drafts_4.value);
   
  ((drafts_4).value = value_43_11000);
   
  var _x_x1_16_11290 = next_index.value;
   
  var _x103 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_16_11290, identity_0_0, draft_0, compare);
  if (_x103._tag === 2) {
    var x_49_12034 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
  }
  else {
    var x_49_12034 = ((next_index).value = (_x103.index));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10592_0 /* () */ ) {
      return _mlift_reconcile_keyed_11521(current_index_1, draft_0, item_0_0_1, position_1, updates_1, _c_x10592_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11521(current_index_1, draft_0, item_0_0_1, position_1, updates_1, x_49_12034);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11523(committed_0_20, compare_0, drafts_5, enlisted_3, first_0_0_12, last_0_0_15, move_phase_11, next_index_0, old_order_3, owns_provision_0, parent_0_0_18, participation_14, publication_transaction_17, renderer_0_2, root_0_0_15, scope_0_0_15, staged_retirements_18, table_20, updates_2, wild___7) /* forall<_e,_e1,a,b,e2> (committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, last@0@0 : node, move-phase : ref<global,bool>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>>, old-order : list<keyed-row<e2,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e2,a,b>>>, table : ref<global,keyed-table<e2,a,b>>, updates : ref<global,list<keyed-update<e2,a,b>>>, wild_@7 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var xs_0_11016 = updates_2.value;
   
  var final_updates_25 = $std_core_list.reverse_acc($std_core_types.Nil, xs_0_11016);
   
  var final_index_19 = next_index_0.value;
   
  var stale_9 = $std_core_hnd._open_none3(collect_stale_rows, old_order_3, final_index_19, compare_0);
   
  var x_50_12036 = $std_core_list.map(final_updates_25, function(update_0_0 /* keyed-update<10818,10816,10817> */ ) {
      return $std_core_hnd._open_none1(function(_this_3 /* keyed-update<10818,10816,10817> */ ) {
          return _this_3.update_row;
        }, update_0_0);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(final_order_23 /* list<keyed-row<10818,10816,10817>> */ ) {
      return _mlift_reconcile_keyed_11519(committed_0_20, drafts_5, enlisted_3, final_index_19, final_updates_25, first_0_0_12, last_0_0_15, move_phase_11, old_order_3, owns_provision_0, parent_0_0_18, participation_14, publication_transaction_17, renderer_0_2, root_0_0_15, scope_0_0_15, staged_retirements_18, stale_9, table_20, final_order_23);
    });
  }
  else {
    return _mlift_reconcile_keyed_11519(committed_0_20, drafts_5, enlisted_3, final_index_19, final_updates_25, first_0_0_12, last_0_0_15, move_phase_11, old_order_3, owns_provision_0, parent_0_0_18, participation_14, publication_transaction_17, renderer_0_2, root_0_0_15, scope_0_0_15, staged_retirements_18, stale_9, table_20, x_50_12036);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11524(children_0_0, committed_0_21, compare_1, drafts_6, enlisted_4, first_0_0_13, item_equals, keyed_items, last_0_0_16, move_phase_12, next_index_1, old_index, old_order_4, owns_provision_1, parent_0_0_19, participation_15, position_2, publication_transaction_18, renderer_0_3, root_0_0_16, scope_0_0_16, staged_retirements_19, table_21, updates_3, wild___3_0_0) /* forall<_e,_e1,a,b,e2> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e2>,kokaine/reactive/effects/signal-read> (), committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e2,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, item-equals : (a, a) -> bool, keyed-items : ref<global,list<(a, b)>>, last@0@0 : node, move-phase : ref<global,bool>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>>, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e2,a,b>>, old-order : list<keyed-row<e2,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, position : ref<global,int>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e2,a,b>>>, table : ref<global,keyed-table<e2,a,b>>, updates : ref<global,list<keyed-update<e2,a,b>>>, wild_@3@0 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var xs_10977 = keyed_items.value;
   
  var x_51_12038 = $std_core_list.foreach($std_core_list.reverse_acc($std_core_types.Nil, xs_10977), function(keyed_item /* (10816, 10817) */ ) {
       
      var current_index_2 = position_2.value;
      var _x103 = $std_core_hnd._open_none3($kokaine_internal_key_dash_index.find, old_index, keyed_item.snd, compare_1);
      if (_x103 !== null) {
         
        var value_37_10983 = $std_core_hnd._open_none1(function(_this_0 /* keyed-row<10818,10816,10817> */ ) {
            return _this_0.row_current_item;
          }, _x103.value);
         
        var _x_x1_11_11281 = value_37_10983.value;
         
        var _x_x1_10_11279 = $std_core_hnd._open_none2(item_equals, _x_x1_11_11281, keyed_item.fst);
         
        var item_changed_0 = $std_core_hnd._open_none1(function(b_0 /* bool */ ) {
            return (b_0) ? false : true;
          }, _x_x1_10_11279);
         
        var _x_x1_13_11283 = next_index_1.value;
         
        var _x104 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_13_11283, keyed_item.snd, _x103.value, compare_1);
        if (_x104._tag === 2) {
          var x_52_12040 = $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
        }
        else {
          var x_52_12040 = ((next_index_1).value = (_x104.index));
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_c_x10589_0 /* () */ ) {
            return _mlift_reconcile_keyed_11520(current_index_2, _x103.value, item_changed_0, keyed_item.fst, position_2, updates_3, _c_x10589_0);
          });
        }
        else {
          return _mlift_reconcile_keyed_11520(current_index_2, _x103.value, item_changed_0, keyed_item.fst, position_2, updates_3, x_52_12040);
        }
      }
      else {
         
        var x_53_12042 = create_keyed_row(renderer_0_3, root_0_0_16, parent_0_0_19, last_0_0_16, keyed_item.snd, keyed_item.fst, current_index_2, children_0_0);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(draft_1 /* keyed-row<10818,10816,10817> */ ) {
            return _mlift_reconcile_keyed_11522(compare_1, current_index_2, drafts_6, keyed_item.snd, keyed_item.fst, next_index_1, position_2, updates_3, draft_1);
          });
        }
        else {
          return _mlift_reconcile_keyed_11522(compare_1, current_index_2, drafts_6, keyed_item.snd, keyed_item.fst, next_index_1, position_2, updates_3, x_53_12042);
        }
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___7_0 /* () */ ) {
      return _mlift_reconcile_keyed_11523(committed_0_21, compare_1, drafts_6, enlisted_4, first_0_0_13, last_0_0_16, move_phase_12, next_index_1, old_order_4, owns_provision_1, parent_0_0_19, participation_15, publication_transaction_18, renderer_0_3, root_0_0_16, scope_0_0_16, staged_retirements_19, table_21, updates_3, wild___7_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11523(committed_0_21, compare_1, drafts_6, enlisted_4, first_0_0_13, last_0_0_16, move_phase_12, next_index_1, old_order_4, owns_provision_1, parent_0_0_19, participation_15, publication_transaction_18, renderer_0_3, root_0_0_16, scope_0_0_16, staged_retirements_19, table_21, updates_3, x_51_12038);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11525(children_0_1, committed_0_22, compare_2, drafts_7, enlisted_5, first_0_0_14, item_equals_0, items, key, last_0_0_17, move_phase_13, next_index_2, old_index_0, old_order_5, owns_provision_2, parent_0_0_20, participation_16, position_3, publication_transaction_19, renderer_0_4, root_0_0_17, scope_0_0_17, staged_retirements_20, table_22, updates_4, wild___1_0_0) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e3,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, move-phase : ref<global,bool>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>>, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>, old-order : list<keyed-row<e3,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, position : ref<global,int>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e3,a,b>>>, table : ref<global,keyed-table<e3,a,b>>, updates : ref<global,list<keyed-update<e3,a,b>>>, wild_@1@0 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var seen_identities = { value: ($kokaine_internal_key_dash_index.Key_index_empty) };
   
  var keyed_items_0 = { value: ($std_core_types.Nil) };
   
  var x_54_12044 = $std_core_list.foreach(items, function(item_0_1 /* 10816 */ ) {
       
      var identity_0_1 = $std_core_hnd._open_none1(key, item_0_1);
       
      var _x_x1_7_11270 = seen_identities.value;
      var _x103 = $std_core_hnd._open_none4($kokaine_internal_key_dash_index.insert, _x_x1_7_11270, identity_0_1, identity_0_1, compare_2);
      if (_x103._tag === 2) {
        return $std_core_hnd._open_at2(0, $std_core_exn.$throw, "duplicate key in keyed For");
      }
      else {
         
        ((seen_identities).value = (_x103.index));
         
        var value_33_0_10975 = $std_core_types.Cons($std_core_types.Tuple2(item_0_1, identity_0_1), keyed_items_0.value);
        return ((keyed_items_0).value = value_33_0_10975);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3_0_1 /* () */ ) {
      return _mlift_reconcile_keyed_11524(children_0_1, committed_0_22, compare_2, drafts_7, enlisted_5, first_0_0_14, item_equals_0, keyed_items_0, last_0_0_17, move_phase_13, next_index_2, old_index_0, old_order_5, owns_provision_2, parent_0_0_20, participation_16, position_3, publication_transaction_19, renderer_0_4, root_0_0_17, scope_0_0_17, staged_retirements_20, table_22, updates_4, wild___3_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11524(children_0_1, committed_0_22, compare_2, drafts_7, enlisted_5, first_0_0_14, item_equals_0, keyed_items_0, last_0_0_17, move_phase_13, next_index_2, old_index_0, old_order_5, owns_provision_2, parent_0_0_20, participation_16, position_3, publication_transaction_19, renderer_0_4, root_0_0_17, scope_0_0_17, staged_retirements_20, table_22, updates_4, x_54_12044);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11526(children_0_2, committed_0_23, compare_3, drafts_8, enlisted_6, first_0_0_15, item_equals_1, items_0, key_0, last_0_0_18, move_phase_14, next_index_3, old_index_1, old_order_6, owns_provision_3, parent_0_0_21, participation_17, position_4, publication_transaction_20, renderer_0_5, root_0_0_18, scope_0_0_18, staged_retirements_21, table_23, updates_5, old_cursor) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@0 : ref<global,bool>, compare : (b, b) -> order, drafts : ref<global,list<keyed-row<e3,a,b>>>, enlisted : ref<global,bool>, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, move-phase : ref<global,bool>, next-index : ref<global,kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>>, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>, old-order : list<keyed-row<e3,a,b>>, owns-provision : bool, parent@0@0 : node, participation : keyed-participation, position : ref<global,int>, publication-transaction : kokaine/dom/internal/keyed-transaction/keyed-transaction, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, staged-retirements : ref<global,list<keyed-retirement<e3,a,b>>>, table : ref<global,keyed-table<e3,a,b>>, updates : ref<global,list<keyed-update<e3,a,b>>>, old-cursor : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_55_12046 = $std_core_hnd._open_at4(0, validate_keyed_order, parent_0_0_21, last_0_0_18, old_cursor, old_order_6);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_0_1 /* () */ ) {
      return _mlift_reconcile_keyed_11525(children_0_2, committed_0_23, compare_3, drafts_8, enlisted_6, first_0_0_15, item_equals_1, items_0, key_0, last_0_0_18, move_phase_14, next_index_3, old_index_1, old_order_6, owns_provision_3, parent_0_0_21, participation_17, position_4, publication_transaction_20, renderer_0_5, root_0_0_18, scope_0_0_18, staged_retirements_21, table_23, updates_5, wild___1_0_1);
    });
  }
  else {
    return _mlift_reconcile_keyed_11525(children_0_2, committed_0_23, compare_3, drafts_8, enlisted_6, first_0_0_15, item_equals_1, items_0, key_0, last_0_0_18, move_phase_14, next_index_3, old_index_1, old_order_6, owns_provision_3, parent_0_0_21, participation_17, position_4, publication_transaction_20, renderer_0_5, root_0_0_18, scope_0_0_18, staged_retirements_21, table_23, updates_5, x_55_12046);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11527(children_0_3, compare_4, first_0_0_16, item_equals_2, items_1, key_1, last_0_0_19, old_index_2, old_order_7, parent_0_0_22, renderer_0_6, root_0_0_19, scope_0_0_19, table_24, participation_18) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>, old-order : list<keyed-row<e3,a,b>>, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e3,a,b>>, participation : keyed-participation) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var owns_provision_4 = $std_core_hnd._open_none1(function(current_0 /* keyed-participation */ ) {
      return (current_0._tag === 1);
    }, participation_18);
   
  var publication_transaction_21 = $std_core_hnd._open_none1(function(current_0_0 /* keyed-participation */ ) {
      return (current_0_0._tag === 1) ? current_0_0.keyed_journal : current_0_0.keyed_journal;
    }, participation_18);
   
  var next_index_4 = { value: ($kokaine_internal_key_dash_index.Key_index_empty) };
   
  var updates_6 = { value: ($std_core_types.Nil) };
   
  var drafts_9 = { value: ($std_core_types.Nil) };
   
  var position_5 = { value: 0 };
   
  var move_phase_15 = { value: false };
   
  var committed_0_24 = { value: false };
   
  var enlisted_7 = { value: false };
   
  var staged_retirements_22 = { value: ($std_core_types.Nil) };
   
  var x_57_12052 = $std_core_hnd._open_at3(0, function(parent_1_0 /* node */ , first_3_0 /* node */ , last_3 /* node */ ) {
       
      var result_9 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_range_first(parent_1_0, first_3_0, last_3);
        });
      var _x103 = $std_core_hnd._open_none1(dom_attempt_ok, result_9);
      if (_x103) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_9);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_9)));
      }
    }, parent_0_0_22, first_0_0_16, last_0_0_19);
  if ($std_core_hnd._yielding()) {
    var _x105 = $std_core_hnd.yield_extend(function(old_cursor_0 /* node */ ) {
      return _mlift_reconcile_keyed_11526(children_0_3, committed_0_24, compare_4, drafts_9, enlisted_7, first_0_0_16, item_equals_2, items_1, key_1, last_0_0_19, move_phase_15, next_index_4, old_index_2, old_order_7, owns_provision_4, parent_0_0_22, participation_18, position_5, publication_transaction_21, renderer_0_6, root_0_0_19, scope_0_0_19, staged_retirements_22, table_24, updates_6, old_cursor_0);
    });
  }
  else {
    var _x105 = _mlift_reconcile_keyed_11526(children_0_3, committed_0_24, compare_4, drafts_9, enlisted_7, first_0_0_16, item_equals_2, items_1, key_1, last_0_0_19, move_phase_15, next_index_4, old_index_2, old_order_7, owns_provision_4, parent_0_0_22, participation_18, position_5, publication_transaction_21, renderer_0_6, root_0_0_19, scope_0_0_19, staged_retirements_22, table_24, updates_6, x_57_12052);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x103 = committed_0_24.value;
      if (_x103) {
        return $std_core_types.Unit;
      }
      else {
        var _x104 = enlisted_7.value;
        if (_x104) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_56_12050 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10569_0 /* hnd/ev-index */ ) {
              return _mlift_reconcile_keyed_11485(drafts_9, last_0_0_19, move_phase_15, old_order_7, parent_0_0_22, participation_18, staged_retirements_22, _y_x10569_0);
            });
          }
          else {
            return _mlift_reconcile_keyed_11485(drafts_9, last_0_0_19, move_phase_15, old_order_7, parent_0_0_22, participation_18, staged_retirements_22, x_56_12050);
          }
        }
      }
    }, _x105);
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11528(children_0_4, compare_5, first_0_0_17, item_equals_3, items_2, key_2, last_0_0_20, old_index_3, old_order_8, parent_0_0_23, renderer_0_7, root_0_0_20, scope_0_0_20, table_25, _y_x10566) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, old-index : kokaine/internal/key-index/key-index<b,keyed-row<e3,a,b>>, old-order : list<keyed-row<e3,a,b>>, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e3,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_58_12055 = $std_core_hnd._mask_at(_y_x10566, false, function() {
      return open_keyed_participation(renderer_0_7, root_0_0_20);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(participation_19 /* keyed-participation */ ) {
      return _mlift_reconcile_keyed_11527(children_0_4, compare_5, first_0_0_17, item_equals_3, items_2, key_2, last_0_0_20, old_index_3, old_order_8, parent_0_0_23, renderer_0_7, root_0_0_20, scope_0_0_20, table_25, participation_19);
    });
  }
  else {
    return _mlift_reconcile_keyed_11527(children_0_4, compare_5, first_0_0_17, item_equals_3, items_2, key_2, last_0_0_20, old_index_3, old_order_8, parent_0_0_23, renderer_0_7, root_0_0_20, scope_0_0_20, table_25, x_58_12055);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11529(children_0_5, compare_6, first_0_0_18, item_equals_4, items_3, key_3, last_0_0_21, parent_0_0_24, renderer_0_8, root_0_0_21, scope_0_0_21, table_26, wild___5) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e3,a,b>>, wild_@5 : ()) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  var _x106 = table_26.value;
   
  var x_59_12057 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10566_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11528(children_0_5, compare_6, first_0_0_18, item_equals_4, items_3, key_3, last_0_0_21, _x106.table_index, _x106.table_order, parent_0_0_24, renderer_0_8, root_0_0_21, scope_0_0_21, table_26, _y_x10566_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11528(children_0_5, compare_6, first_0_0_18, item_equals_4, items_3, key_3, last_0_0_21, _x106.table_index, _x106.table_order, parent_0_0_24, renderer_0_8, root_0_0_21, scope_0_0_21, table_26, x_59_12057);
  }
}
 
 
// monadic lift
export function _mlift_reconcile_keyed_11530(children_0_6, compare_7, first_0_0_19, item_equals_5, items_4, key_4, last_0_0_22, parent_0_0_25, renderer_0_9, root_0_0_22, scope_0_0_22, table_27, _y_x10562) /* forall<_e,_e1,_e2,a,b,e3> (children@0 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare : (b, b) -> order, first@0@0 : node, item-equals : (a, a) -> bool, items : list<a>, key : (a) -> b, last@0@0 : node, parent@0@0 : node, renderer@0 : kokaine/dom/internal/keyed-transaction/keyed-context, root@0@0 : kokaine/reactive/root<ui>, scope@0@0 : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e3,a,b>>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
   
  var x_60_12059 = $std_core_hnd._mask_at(_y_x10562, false, function() {
      return drain_keyed_retirements(table_27);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___5_0 /* () */ ) {
      return _mlift_reconcile_keyed_11529(children_0_6, compare_7, first_0_0_19, item_equals_5, items_4, key_4, last_0_0_22, parent_0_0_25, renderer_0_9, root_0_0_22, scope_0_0_22, table_27, wild___5_0);
    });
  }
  else {
    return _mlift_reconcile_keyed_11529(children_0_6, compare_7, first_0_0_19, item_equals_5, items_4, key_4, last_0_0_22, parent_0_0_25, renderer_0_9, root_0_0_22, scope_0_0_22, table_27, x_60_12059);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11531(scope_1_0, _y_x10663) /* (scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10663, false, function() {
      return $kokaine_reactive_integration_internal_lifetime_dash_scope.lifetime_scope_fs_dispose($std_core_hnd._open_none1(function(value_68 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
          return value_68;
        }, scope_1_0));
    });
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11532(first_1_0_0, last_1_0, _y_x10670) /* (first@1@0 : node, last@1@0 : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10670, false, function() {
       
      var result_10 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_1_0_0, last_1_0, true);
        });
      var _x107 = $std_core_hnd._open_none1(dom_attempt_ok, result_10);
      if (_x107) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_10);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_10)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11533(read, _y_x10683) /* forall<a> (read : () -> kokaine/reactive/effects/signal-read a, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> a */  {
  return $std_core_hnd._mask_at(_y_x10683, false, read);
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11534(children_1_0, compare_0_0, first_1_0_1, item_equals_0_0, items_0_0, key_0_0, last_1_0_0, parent_1_0_0, renderer_1_0, root_1_0_0, scope_1_0_0, table_0_0, wild___3_1) /* forall<_e,a,b,e1> (children@1 : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e1>,kokaine/reactive/effects/signal-read> (), compare@0 : (b, b) -> order, first@1@0 : node, item-equals@0 : (a, a) -> bool, items@0 : ref<global,list<a>>, key@0 : (a) -> b, last@1@0 : node, parent@1@0 : node, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, table@0 : ref<global,keyed-table<e1,a,b>>, wild_@3@1 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var xs_2_11083 = items_0_0.value;
  return reconcile_keyed(renderer_1_0, root_1_0_0, parent_1_0_0, first_1_0_1, last_1_0_0, scope_1_0_0, table_0_0, $std_core_list.reverse_acc($std_core_types.Nil, xs_2_11083), key_0_0, compare_0_0, item_equals_0_0, children_1_0);
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11535(committed_1_0, _y_x10689) /* forall<_e> (committed@1 : ref<global,bool>, kokaine/reactive/internal/model/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
   
  ((committed_1_0).value = true);
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11536(_pat_38_0) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11537(first_1_0_2, last_1_0_1, _y_x10678) /* (first@1@0 : node, last@1@0 : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10678, false, function() {
       
      var result_11 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_1_0_2, last_1_0_1, true);
        });
      var _x108 = $std_core_hnd._open_none1(dom_attempt_ok, result_11);
      if (_x108) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_11);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_11)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11538(children_1_1, committed_1_1, compare_0_1, first_1_0_3, item_equals_0_1, key_0_1, last_1_0_2, parent_1_0_1, range_owned_0_0, read_0, renderer_1_1, root_1_0_1, scope_1_0_1, walk, wild___1_1) /* forall<_e,_e1,_e2,a,b,c,e3> (children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, first@1@0 : node, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, last@1@0 : node, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), wild_@1@1 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  ((range_owned_0_0).value = true);
   
  var table_0_1 = { value: (Keyed_table($kokaine_internal_key_dash_index.Key_index_empty, $std_core_types.Nil, $std_core_types.Nil)) };
   
  var root_0_10043 = $std_core_hnd._open_none1(function(value_75 /* kokaine/reactive/root<ui> */ ) {
      return value_75;
    }, root_1_0_1);
   
  var x_61_12068 = $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043, function() {
       
      var x_62_12070 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10683_0 /* hnd/ev-index */ ) {
          return _mlift_mount_keyed_fields_11533(read_0, _y_x10683_0);
        });
      }
      else {
        return _mlift_mount_keyed_fields_11533(read_0, x_62_12070);
      }
    }, function(snapshot_0 /* 10835 */ ) {
      return $kokaine_reactive_integration.with_lifetime_scope(root_1_0_1, scope_1_0_1, function() {
           
          var items_0_1 = { value: ($std_core_types.Nil) };
           
          var x_63_12072 = walk(snapshot_0, function(item_1_0 /* 10836 */ ) {
               
              var value_77_11081 = $std_core_types.Cons(item_1_0, items_0_1.value);
              return ((items_0_1).value = value_77_11081);
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___3_1_0 /* () */ ) {
              return _mlift_mount_keyed_fields_11534(children_1_1, compare_0_1, first_1_0_3, item_equals_0_1, items_0_1, key_0_1, last_1_0_2, parent_1_0_1, renderer_1_1, root_1_0_1, scope_1_0_1, table_0_1, wild___3_1_0);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11534(children_1_1, compare_0_1, first_1_0_3, item_equals_0_1, items_0_1, key_0_1, last_1_0_2, parent_1_0_1, renderer_1_1, root_1_0_1, scope_1_0_1, table_0_1, x_63_12072);
          }
        });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10689_0 /* kokaine/reactive/internal/model/disposer<ui> */ ) {
      return _mlift_mount_keyed_fields_11535(committed_1_1, _y_x10689_0);
    });
  }
  else {
    return _mlift_mount_keyed_fields_11535(committed_1_1, x_61_12068);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11539(children_1_2, committed_1_2, compare_0_2, first_1_0_4, installed_0_0, item_equals_0_2, key_0_2, last_1_0_3, parent_1_0_2, range_owned_0_1, read_1, renderer_1_2, root_1_0_2, scope_1_0_2, walk_0, wild___29) /* forall<_e,_e1,_e2,a,b,c,e3> (children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, first@1@0 : node, installed@0 : ref<global,bool>, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, last@1@0 : node, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), wild_@29 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  ((installed_0_0).value = true);
   
  var x_64_12074 = $std_core_hnd._open_at2(0, function(root_6_0 /* kokaine/reactive/root<ui> */ , cleanup_0 /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046_0 = $std_core_hnd._open_none1(function(value_72 /* kokaine/reactive/root<ui> */ ) {
          return value_72;
        }, root_6_0);
       
      var x_65_12076 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046_0, cleanup_0);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_keyed_fields_11536);
      }
      else {
        return _mlift_mount_keyed_fields_11536(x_65_12076);
      }
    }, root_1_0_2, function() {
       
      var x_66_12078 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10678_0 /* hnd/ev-index */ ) {
          return _mlift_mount_keyed_fields_11537(first_1_0_4, last_1_0_3, _y_x10678_0);
        });
      }
      else {
        return _mlift_mount_keyed_fields_11537(first_1_0_4, last_1_0_3, x_66_12078);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_1_0 /* () */ ) {
      return _mlift_mount_keyed_fields_11538(children_1_2, committed_1_2, compare_0_2, first_1_0_4, item_equals_0_2, key_0_2, last_1_0_3, parent_1_0_2, range_owned_0_1, read_1, renderer_1_2, root_1_0_2, scope_1_0_2, walk_0, wild___1_1_0);
    });
  }
  else {
    return _mlift_mount_keyed_fields_11538(children_1_2, committed_1_2, compare_0_2, first_1_0_4, item_equals_0_2, key_0_2, last_1_0_3, parent_1_0_2, range_owned_0_1, read_1, renderer_1_2, root_1_0_2, scope_1_0_2, walk_0, x_64_12074);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11540(before_0, children_1_3, committed_1_3, compare_0_3, first_1_0_5, installed_0_1, item_equals_0_3, key_0_3, parent_1_0_3, range_owned_0_2, read_2, renderer_1_3, root_1_0_3, scope_1_0_3, walk_1, last_1_0_4) /* forall<_e,_e1,_e2,a,b,c,e3> (before@0 : maybe<node>, children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, first@1@0 : node, installed@0 : ref<global,bool>, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), last@1@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_68_12084 = $std_core_hnd._open_at4(0, insert_marker_pair, parent_1_0_3, before_0, first_1_0_5, last_1_0_4);
  if ($std_core_hnd._yielding()) {
    var _x111 = $std_core_hnd.yield_extend(function(wild___29_0 /* () */ ) {
      return _mlift_mount_keyed_fields_11539(children_1_3, committed_1_3, compare_0_3, first_1_0_5, installed_0_1, item_equals_0_3, key_0_3, last_1_0_4, parent_1_0_3, range_owned_0_2, read_2, renderer_1_3, root_1_0_3, scope_1_0_3, walk_1, wild___29_0);
    });
  }
  else {
    var _x111 = _mlift_mount_keyed_fields_11539(children_1_3, committed_1_3, compare_0_3, first_1_0_5, installed_0_1, item_equals_0_3, key_0_3, last_1_0_4, parent_1_0_3, range_owned_0_2, read_2, renderer_1_3, root_1_0_3, scope_1_0_3, walk_1, x_68_12084);
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x109 = installed_0_1.value;
      if (_x109) {
         
        var _x_x1_4_11342 = range_owned_0_2.value;
        var _x110 = $std_core_hnd._open_none1(function(b_5 /* bool */ ) {
            return (b_5) ? false : true;
          }, _x_x1_4_11342);
        if (_x110) {
           
          var x_67_12082 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10670_0 /* hnd/ev-index */ ) {
              return _mlift_mount_keyed_fields_11532(first_1_0_5, last_1_0_4, _y_x10670_0);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11532(first_1_0_5, last_1_0_4, x_67_12082);
          }
        }
        else {
          return $std_core_types.Unit;
        }
      }
      else {
        return $std_core_types.Unit;
      }
    }, _x111);
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11541(before_0_0, children_1_4, committed_1_4, compare_0_4, installed_0_2, item_equals_0_4, key_0_4, parent_1_0_4, range_owned_0_3, read_3, renderer_1_4, root_1_0_4, scope_1_0_4, walk_2, first_1_0_6) /* forall<_e,_e1,_e2,a,b,c,e3> (before@0 : maybe<node>, children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), committed@1 : ref<global,bool>, compare@0 : (c, c) -> order, installed@0 : ref<global,bool>, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, parent@1@0 : node, range-owned@0 : ref<global,bool>, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), first@1@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_69_12086 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:for");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(last_1_0_5 /* node */ ) {
      return _mlift_mount_keyed_fields_11540(before_0_0, children_1_4, committed_1_4, compare_0_4, first_1_0_6, installed_0_2, item_equals_0_4, key_0_4, parent_1_0_4, range_owned_0_3, read_3, renderer_1_4, root_1_0_4, scope_1_0_4, walk_2, last_1_0_5);
    });
  }
  else {
    return _mlift_mount_keyed_fields_11540(before_0_0, children_1_4, committed_1_4, compare_0_4, first_1_0_6, installed_0_2, item_equals_0_4, key_0_4, parent_1_0_4, range_owned_0_3, read_3, renderer_1_4, root_1_0_4, scope_1_0_4, walk_2, x_69_12086);
  }
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11542(_y_x10661) /* (kokaine/reactive/integration/internal/lifetime-scope/lifetime-scope<ui>) -> exn kokaine/reactive/integration/lifetime-scope<ui> */  {
  return _y_x10661;
}
 
 
// monadic lift
export function _mlift_mount_keyed_fields_11543(before_0_1, children_1_5, compare_0_5, item_equals_0_5, key_0_5, parent_1_0_5, read_4, renderer_1_5, root_1_0_5, walk_3, scope_1_0_5) /* forall<_e,_e1,_e2,a,b,c,e3> (before@0 : maybe<node>, children@1 : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e3>,kokaine/reactive/effects/signal-read> (), compare@0 : (c, c) -> order, item-equals@0 : (b, b) -> bool, key@0 : (b) -> c, parent@1@0 : node, read : () -> kokaine/reactive/effects/signal-read a, renderer@1 : kokaine/dom/internal/keyed-transaction/keyed-context, root@1@0 : kokaine/reactive/root<ui>, walk : forall<e4> (a, (b) -> e4 ()) -> e4 (), scope@1@0 : kokaine/reactive/integration/lifetime-scope<ui>) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var committed_1_5 = { value: false };
   
  var installed_0_3 = { value: false };
   
  var range_owned_0_4 = { value: false };
  return $std_core_hnd.finally_prompt(function() {
      var _x112 = committed_1_5.value;
      if (_x112) {
        return $std_core_types.Unit;
      }
      else {
         
        var x_70_12090 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10663_0 /* hnd/ev-index */ ) {
            return _mlift_mount_keyed_fields_11531(scope_1_0_5, _y_x10663_0);
          });
        }
        else {
          return _mlift_mount_keyed_fields_11531(scope_1_0_5, x_70_12090);
        }
      }
    }, $kokaine_reactive_integration.with_lifetime_scope(root_1_0_5, scope_1_0_5, function() {
         
        var x_71_12092 = $std_core_hnd._open_at1(0, dom_attempt, function() {
            return dom_create_comment("kokaine:for");
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(first_1_0_7 /* node */ ) {
            return _mlift_mount_keyed_fields_11541(before_0_1, children_1_5, committed_1_5, compare_0_5, installed_0_3, item_equals_0_5, key_0_5, parent_1_0_5, range_owned_0_4, read_4, renderer_1_5, root_1_0_5, scope_1_0_5, walk_3, first_1_0_7);
          });
        }
        else {
          return _mlift_mount_keyed_fields_11541(before_0_1, children_1_5, committed_1_5, compare_0_5, installed_0_3, item_equals_0_5, key_0_5, parent_1_0_5, range_owned_0_4, read_4, renderer_1_5, root_1_0_5, scope_1_0_5, walk_3, x_71_12092);
        }
      }));
}
 
 
// monadic lift
export function _mlift_mount_view_11544(before_1, parent_3_0_0, target_20) /* (before@1 : maybe<node>, parent@3@0 : node, target@20 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
  return $std_core_hnd._open_at3(0, insert, parent_3_0_0, before_1, target_20);
}
 
 
// monadic lift
export function _mlift_mount_view_11545(read_1_0, _y_x10700) /* (read@1 : () -> kokaine/reactive/effects/signal-read string, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> string */  {
  return $std_core_hnd._mask_at(_y_x10700, false, read_1_0);
}
 
 
// monadic lift
export function _mlift_mount_view_11546(target_0_0, value_82, _y_x10703) /* (target@0@0 : node, value@82 : string, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10703, false, function() {
       
      var result_12 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_set_text(target_0_0, value_82);
        });
      var _x113 = $std_core_hnd._open_none1(dom_attempt_ok, result_12);
      if (_x113) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_12);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_12)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_view_11547(_y_x10707) /* (kokaine/reactive/internal/model/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_view_11548(read_1_1, root_3_0, target_0_0_0, wild___30) /* (read@1 : () -> kokaine/reactive/effects/signal-read string, root@3@0 : kokaine/reactive/root<ui>, target@0@0 : node, wild_@30 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var root_0_10043_0 = $std_core_hnd._open_none1(function(value_81 /* kokaine/reactive/root<ui> */ ) {
      return value_81;
    }, root_3_0);
   
  var x_72_12097 = $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043_0, function() {
       
      var x_73_12099 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10700_0 /* hnd/ev-index */ ) {
          return _mlift_mount_view_11545(read_1_1, _y_x10700_0);
        });
      }
      else {
        return _mlift_mount_view_11545(read_1_1, x_73_12099);
      }
    }, function(value_82_0 /* string */ ) {
       
      var x_74_12101 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10703_0 /* hnd/ev-index */ ) {
          return _mlift_mount_view_11546(target_0_0_0, value_82_0, _y_x10703_0);
        });
      }
      else {
        return _mlift_mount_view_11546(target_0_0_0, value_82_0, x_74_12101);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_mount_view_11547);
  }
  else {
    return _mlift_mount_view_11547(x_72_12097);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11549(before_1_0, parent_3_0_1, read_1_2, root_3_0_0, target_0_0_1) /* (before@1 : maybe<node>, parent@3@0 : node, read@1 : () -> kokaine/reactive/effects/signal-read string, root@3@0 : kokaine/reactive/root<ui>, target@0@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_75_12103 = $std_core_hnd._open_at3(0, insert, parent_3_0_1, before_1_0, target_0_0_1);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___30_0 /* () */ ) {
      return _mlift_mount_view_11548(read_1_2, root_3_0_0, target_0_0_1, wild___30_0);
    });
  }
  else {
    return _mlift_mount_view_11548(read_1_2, root_3_0_0, target_0_0_1, x_75_12103);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11550(before_1_1, parent_3_0_2, target_1_0, wild___2_2) /* (before@1 : maybe<node>, parent@3@0 : node, target@1@0 : element, wild_@2@2 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var _x_x3_1_11369 = $std_core_hnd._open_none1(element_node, target_1_0);
  return $std_core_hnd._open_at3(0, function(parent_8 /* node */ , before_2 /* maybe<node> */ , child_0 /* node */ ) {
      if (before_2 === null) {
         
        var result_13 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_append(parent_8, child_0);
          });
        var _x114 = $std_core_hnd._open_none1(dom_attempt_ok, result_13);
        if (_x114) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_13);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_13)));
        }
      }
      else {
         
        var result_14 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_insert_before(parent_8, child_0, before_2.value);
          });
        var _x115 = $std_core_hnd._open_none1(dom_attempt_ok, result_14);
        if (_x115) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_14);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_14)));
        }
      }
    }, parent_3_0_2, before_1_1, _x_x3_1_11369);
}
 
 
// monadic lift
export function _mlift_mount_view_11551(before_1_2, children_3_0, parent_3_0_3, renderer_3_0, root_3_0_1, target_1_0_0, wild___1_2) /* forall<e> (before@1 : maybe<node>, children@3 : list<kokaine/html/view<e>>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, target@1@0 : element, wild_@1@2 : ()) -> <div,exn,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_76_12107 = $std_core_list.foreach(children_3_0, function(child /* kokaine/html/view<10864> */ ) {
      return mount_view(renderer_3_0, root_3_0_1, $std_core_hnd._open_none1(element_node, target_1_0_0), $std_core_types.Nothing, child);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___2_2_0 /* () */ ) {
      return _mlift_mount_view_11550(before_1_2, parent_3_0_3, target_1_0_0, wild___2_2_0);
    });
  }
  else {
    return _mlift_mount_view_11550(before_1_2, parent_3_0_3, target_1_0_0, x_76_12107);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11552(attributes, before_1_3, children_3_1, parent_3_0_4, renderer_3_1, root_3_0_2, target_1_0_1, wild___0_2) /* forall<e> (attributes : list<kokaine/html/attribute<e>>, before@1 : maybe<node>, children@3 : list<kokaine/html/view<e>>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, target@1@0 : element, wild_@0@2 : ()) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_77_12109 = $std_core_list.foreach(attributes, function(attribute /* kokaine/html/attribute<10864> */ ) {
      return mount_attribute(root_3_0_2, target_1_0_1, attribute);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___1_2_0 /* () */ ) {
      return _mlift_mount_view_11551(before_1_3, children_3_1, parent_3_0_4, renderer_3_1, root_3_0_2, target_1_0_1, wild___1_2_0);
    });
  }
  else {
    return _mlift_mount_view_11551(before_1_3, children_3_1, parent_3_0_4, renderer_3_1, root_3_0_2, target_1_0_1, x_77_12109);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11553(attributes_0, before_1_4, children_3_2, parent_3_0_5, renderer_3_2, root_3_0_3, target_1_0_2) /* forall<e> (attributes : list<kokaine/html/attribute<e>>, before@1 : maybe<node>, children@3 : list<kokaine/html/view<e>>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, target@1@0 : element) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_78_12111 = record_owner(root_3_0_3, $std_core_hnd._open_none1(element_node, target_1_0_2));
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___0_2_0 /* () */ ) {
      return _mlift_mount_view_11552(attributes_0, before_1_4, children_3_2, parent_3_0_5, renderer_3_2, root_3_0_3, target_1_0_2, wild___0_2_0);
    });
  }
  else {
    return _mlift_mount_view_11552(attributes_0, before_1_4, children_3_2, parent_3_0_5, renderer_3_2, root_3_0_3, target_1_0_2, x_78_12111);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11554(read_0_0_0, _y_x10725) /* forall<e> (read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, hnd/ev-index) -> <exn,div,kokaine/reactive/effects/signal-read> kokaine/html/view<e> */  {
  return $std_core_hnd._mask_at(_y_x10725, false, read_0_0_0);
}
 
 
// monadic lift
export function _mlift_mount_view_11555(_pat_44_0) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_view_11556(first_2_0, last_2_0, _y_x10729) /* (first@2@0 : node, last@2@0 : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10729, false, function() {
       
      var result_15 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first_2_0, last_2_0, false);
        });
      var _x116 = $std_core_hnd._open_none1(dom_attempt_ok, result_15);
      if (_x116) {
        return $std_core_hnd._open_none1(dom_attempt_value, result_15);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_15)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_view_11557(last_2_0_0, next_1_0, parent_3_0_6, renderer_3_3, root_3_0_4, wild___4_2) /* forall<e> (last@2@0 : node, next@1 : kokaine/html/view<e>, parent@3@0 : node, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, wild_@4@2 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
  return mount_view(renderer_3_3, root_3_0_4, parent_3_0_6, $std_core_types.Just(last_2_0_0), next_1_0);
}
 
 
// monadic lift
export function _mlift_mount_view_11558(_y_x10735) /* (kokaine/reactive/internal/model/disposer<ui>) -> <kokaine/reactive/effects/signal-write,pure> () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_view_11559(first_2_0_0, last_2_0_1, parent_3_0_7, read_0_0_0_0, renderer_3_4, root_3_0_5, wild___3_2) /* forall<e> (first@2@0 : node, last@2@0 : node, parent@3@0 : node, read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, wild_@3@2 : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var root_0_10043_1 = $std_core_hnd._open_none1(function(value_83 /* kokaine/reactive/root<ui> */ ) {
      return value_83;
    }, root_3_0_5);
   
  var x_79_12116 = $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043_1, function() {
       
      var x_80_12118 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10725_0 /* hnd/ev-index */ ) {
          return _mlift_mount_view_11554(read_0_0_0_0, _y_x10725_0);
        });
      }
      else {
        return _mlift_mount_view_11554(read_0_0_0_0, x_80_12118);
      }
    }, function(next_1_1 /* kokaine/html/view<10864> */ ) {
       
      var x_81_12120 = $std_core_hnd._open_at2(0, function(root_10 /* kokaine/reactive/root<ui> */ , cleanup_1 /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
           
          var root_0_10046_1 = $std_core_hnd._open_none1(function(value_84 /* kokaine/reactive/root<ui> */ ) {
              return value_84;
            }, root_10);
           
          var x_82_12122 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046_1, cleanup_1);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(_mlift_mount_view_11555);
          }
          else {
            return _mlift_mount_view_11555(x_82_12122);
          }
        }, root_3_0_5, function() {
           
          var x_83_12124 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10729_0 /* hnd/ev-index */ ) {
              return _mlift_mount_view_11556(first_2_0_0, last_2_0_1, _y_x10729_0);
            });
          }
          else {
            return _mlift_mount_view_11556(first_2_0_0, last_2_0_1, x_83_12124);
          }
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___4_2_0 /* () */ ) {
          return _mlift_mount_view_11557(last_2_0_1, next_1_1, parent_3_0_7, renderer_3_4, root_3_0_5, wild___4_2_0);
        });
      }
      else {
        return _mlift_mount_view_11557(last_2_0_1, next_1_1, parent_3_0_7, renderer_3_4, root_3_0_5, x_81_12120);
      }
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_mount_view_11558);
  }
  else {
    return _mlift_mount_view_11558(x_79_12116);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11560(before_1_5, first_2_0_1, parent_3_0_8, read_0_0_0_1, renderer_3_5, root_3_0_6, last_2_0_2) /* forall<e> (before@1 : maybe<node>, first@2@0 : node, parent@3@0 : node, read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, last@2@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_84_12126 = $std_core_hnd._open_at4(0, insert_marker_pair, parent_3_0_8, before_1_5, first_2_0_1, last_2_0_2);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild___3_2_0 /* () */ ) {
      return _mlift_mount_view_11559(first_2_0_1, last_2_0_2, parent_3_0_8, read_0_0_0_1, renderer_3_5, root_3_0_6, wild___3_2_0);
    });
  }
  else {
    return _mlift_mount_view_11559(first_2_0_1, last_2_0_2, parent_3_0_8, read_0_0_0_1, renderer_3_5, root_3_0_6, x_84_12126);
  }
}
 
 
// monadic lift
export function _mlift_mount_view_11561(before_1_6, parent_3_0_9, read_0_0_0_2, renderer_3_6, root_3_0_7, first_2_0_2) /* forall<e> (before@1 : maybe<node>, parent@3@0 : node, read@0@0@0 : () -> kokaine/reactive/effects/signal-read kokaine/html/view<e>, renderer@3 : kokaine/dom/internal/keyed-transaction/keyed-context, root@3@0 : kokaine/reactive/root<ui>, first@2@0 : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_85_12128 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:region");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(last_2_0_3 /* node */ ) {
      return _mlift_mount_view_11560(before_1_6, first_2_0_2, parent_3_0_9, read_0_0_0_2, renderer_3_6, root_3_0_7, last_2_0_3);
    });
  }
  else {
    return _mlift_mount_view_11560(before_1_6, first_2_0_2, parent_3_0_9, read_0_0_0_2, renderer_3_6, root_3_0_7, x_85_12128);
  }
}
 
export function create_keyed_row(renderer_9, root_9, parent_9, last_7, identity_9, item_9, index_9, children_7) /* forall<a,b,e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, last : node, identity : a, item : b, index : int, children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> <pure,kokaine/reactive/effects/signal-write,ui> keyed-row<e,b,a> */  {
   
  var x_86_12130 = $std_core_hnd._open_at1(0, function(root_0_1 /* kokaine/reactive/root<ui> */ ) {
       
      var x_87_12133 = $kokaine_reactive_integration_internal_lifetime_dash_scope.open_lifetime_scope($std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
          return value_0;
        }, root_0_1));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_create_keyed_row_11482);
      }
      else {
        return _mlift_create_keyed_row_11482(x_87_12133);
      }
    }, root_9);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(scope_10 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
      return _mlift_create_keyed_row_11483(children_7, identity_9, index_9, item_9, last_7, parent_9, renderer_9, root_9, scope_10);
    });
  }
  else {
     
    var committed_9 = { value: false };
     
    var installed_3 = { value: false };
     
    var range_owned_4 = { value: false };
    return $std_core_hnd.finally_prompt(function() {
        var _x117 = committed_9.value;
        if (_x117) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_88_12137 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10522_1 /* hnd/ev-index */ ) {
              return _mlift_create_keyed_row_11466(x_86_12130, _y_x10522_1);
            });
          }
          else {
            return _mlift_create_keyed_row_11466(x_86_12130, x_88_12137);
          }
        }
      }, $kokaine_reactive_integration.with_lifetime_scope(root_9, x_86_12130, function() {
           
          var x_89_12139 = $std_core_hnd._open_at1(0, dom_attempt, function() {
              return dom_create_comment("kokaine:for-row");
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(first_11 /* node */ ) {
              return _mlift_create_keyed_row_11481(children_7, committed_9, identity_9, index_9, installed_3, item_9, last_7, parent_9, range_owned_4, renderer_9, root_9, x_86_12130, first_11);
            });
          }
          else {
            return _mlift_create_keyed_row_11481(children_7, committed_9, identity_9, index_9, installed_3, item_9, last_7, parent_9, range_owned_4, renderer_9, root_9, x_86_12130, x_89_12139);
          }
        }));
  }
}
 
export function reconcile_keyed(renderer_0_10, root_0_0_23, parent_0_0_26, first_0_0_20, last_0_0_23, scope_0_0_23, table_28, items_5, key_5, compare_8, item_equals_6, children_0_7) /* forall<a,b,e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, first : node, last : node, scope : kokaine/reactive/integration/lifetime-scope<ui>, table : ref<global,keyed-table<e,a,b>>, items : list<a>, key : (a) -> b, compare : (b, b) -> order, item-equals : (a, a) -> bool, children : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_90_12141 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10562_0 /* hnd/ev-index */ ) {
      return _mlift_reconcile_keyed_11530(children_0_7, compare_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, parent_0_0_26, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, _y_x10562_0);
    });
  }
  else {
     
    var x_91_12144 = $std_core_hnd._mask_at(x_90_12141, false, function() {
        return drain_keyed_retirements(table_28);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(wild___5_1 /* () */ ) {
        return _mlift_reconcile_keyed_11529(children_0_7, compare_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, parent_0_0_26, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, wild___5_1);
      });
    }
    else {
      var _x118 = table_28.value;
       
      var x_92_12148 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10566_1 /* hnd/ev-index */ ) {
          return _mlift_reconcile_keyed_11528(children_0_7, compare_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, _x118.table_index, _x118.table_order, parent_0_0_26, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, _y_x10566_1);
        });
      }
      else {
         
        var x_93_12151 = $std_core_hnd._mask_at(x_92_12148, false, function() {
            return open_keyed_participation(renderer_0_10, root_0_0_23);
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(participation_20 /* keyed-participation */ ) {
            return _mlift_reconcile_keyed_11527(children_0_7, compare_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, _x118.table_index, _x118.table_order, parent_0_0_26, renderer_0_10, root_0_0_23, scope_0_0_23, table_28, participation_20);
          });
        }
        else {
           
          var owns_provision_5 = $std_core_hnd._open_none1(function(current_1 /* keyed-participation */ ) {
              return (current_1._tag === 1);
            }, x_93_12151);
           
          var publication_transaction_22 = $std_core_hnd._open_none1(function(current_0_1 /* keyed-participation */ ) {
              return (current_0_1._tag === 1) ? current_0_1.keyed_journal : current_0_1.keyed_journal;
            }, x_93_12151);
           
          var next_index_5 = { value: ($kokaine_internal_key_dash_index.Key_index_empty) };
           
          var updates_7 = { value: ($std_core_types.Nil) };
           
          var drafts_10 = { value: ($std_core_types.Nil) };
           
          var position_6 = { value: 0 };
           
          var move_phase_16 = { value: false };
           
          var committed_0_25 = { value: false };
           
          var enlisted_8 = { value: false };
           
          var staged_retirements_23 = { value: ($std_core_types.Nil) };
           
          var x_95_12158 = $std_core_hnd._open_at3(0, function(parent_1_1 /* node */ , first_3_1 /* node */ , last_3_0 /* node */ ) {
               
              var result_16 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                  return dom_range_first(parent_1_1, first_3_1, last_3_0);
                });
              var _x119 = $std_core_hnd._open_none1(dom_attempt_ok, result_16);
              if (_x119) {
                return $std_core_hnd._open_none1(dom_attempt_value, result_16);
              }
              else {
                return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_16)));
              }
            }, parent_0_0_26, first_0_0_20, last_0_0_23);
          if ($std_core_hnd._yielding()) {
            var _x121 = $std_core_hnd.yield_extend(function(old_cursor_1 /* node */ ) {
              return _mlift_reconcile_keyed_11526(children_0_7, committed_0_25, compare_8, drafts_10, enlisted_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, move_phase_16, next_index_5, _x118.table_index, _x118.table_order, owns_provision_5, parent_0_0_26, x_93_12151, position_6, publication_transaction_22, renderer_0_10, root_0_0_23, scope_0_0_23, staged_retirements_23, table_28, updates_7, old_cursor_1);
            });
          }
          else {
            var _x121 = _mlift_reconcile_keyed_11526(children_0_7, committed_0_25, compare_8, drafts_10, enlisted_8, first_0_0_20, item_equals_6, items_5, key_5, last_0_0_23, move_phase_16, next_index_5, _x118.table_index, _x118.table_order, owns_provision_5, parent_0_0_26, x_93_12151, position_6, publication_transaction_22, renderer_0_10, root_0_0_23, scope_0_0_23, staged_retirements_23, table_28, updates_7, x_95_12158);
          }
          return $std_core_hnd.finally_prompt(function() {
              var _x119 = committed_0_25.value;
              if (_x119) {
                return $std_core_types.Unit;
              }
              else {
                var _x120 = enlisted_8.value;
                if (_x120) {
                  return $std_core_types.Unit;
                }
                else {
                   
                  var x_94_12156 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(function(_y_x10569_1 /* hnd/ev-index */ ) {
                      return _mlift_reconcile_keyed_11485(drafts_10, last_0_0_23, move_phase_16, _x118.table_order, parent_0_0_26, x_93_12151, staged_retirements_23, _y_x10569_1);
                    });
                  }
                  else {
                    return _mlift_reconcile_keyed_11485(drafts_10, last_0_0_23, move_phase_16, _x118.table_order, parent_0_0_26, x_93_12151, staged_retirements_23, x_94_12156);
                  }
                }
              }
            }, _x121);
        }
      }
    }
  }
}
 
export function mount_keyed_fields(renderer_1_6, root_1_0_6, parent_1_0_6, before_0_2, read_5, walk_4, key_0_6, compare_0_6, item_equals_0_6, children_1_6) /* forall<a,b,c,e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, read : () -> kokaine/reactive/effects/signal-read a, walk : forall<e1> (a, (b) -> e1 ()) -> e1 (), key : (b) -> c, compare : (c, c) -> order, item-equals : (b, b) -> bool, children : (item : kokaine/html/accessor<b>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
   
  var x_96_12161 = $std_core_hnd._open_at1(0, function(root_5_0 /* kokaine/reactive/root<ui> */ ) {
       
      var x_97_12164 = $kokaine_reactive_integration_internal_lifetime_dash_scope.open_lifetime_scope($std_core_hnd._open_none1(function(value_63 /* kokaine/reactive/root<ui> */ ) {
          return value_63;
        }, root_5_0));
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_keyed_fields_11542);
      }
      else {
        return _mlift_mount_keyed_fields_11542(x_97_12164);
      }
    }, root_1_0_6);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(scope_1_0_6 /* kokaine/reactive/integration/lifetime-scope<ui> */ ) {
      return _mlift_mount_keyed_fields_11543(before_0_2, children_1_6, compare_0_6, item_equals_0_6, key_0_6, parent_1_0_6, read_5, renderer_1_6, root_1_0_6, walk_4, scope_1_0_6);
    });
  }
  else {
     
    var committed_1_6 = { value: false };
     
    var installed_0_4 = { value: false };
     
    var range_owned_0_5 = { value: false };
    return $std_core_hnd.finally_prompt(function() {
        var _x122 = committed_1_6.value;
        if (_x122) {
          return $std_core_types.Unit;
        }
        else {
           
          var x_98_12168 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10663_1 /* hnd/ev-index */ ) {
              return _mlift_mount_keyed_fields_11531(x_96_12161, _y_x10663_1);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11531(x_96_12161, x_98_12168);
          }
        }
      }, $kokaine_reactive_integration.with_lifetime_scope(root_1_0_6, x_96_12161, function() {
           
          var x_99_12170 = $std_core_hnd._open_at1(0, dom_attempt, function() {
              return dom_create_comment("kokaine:for");
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(first_1_0_8 /* node */ ) {
              return _mlift_mount_keyed_fields_11541(before_0_2, children_1_6, committed_1_6, compare_0_6, installed_0_4, item_equals_0_6, key_0_6, parent_1_0_6, range_owned_0_5, read_5, renderer_1_6, root_1_0_6, x_96_12161, walk_4, first_1_0_8);
            });
          }
          else {
            return _mlift_mount_keyed_fields_11541(before_0_2, children_1_6, committed_1_6, compare_0_6, installed_0_4, item_equals_0_6, key_0_6, parent_1_0_6, range_owned_0_5, read_5, renderer_1_6, root_1_0_6, x_96_12161, walk_4, x_99_12170);
          }
        }));
  }
}
 
export function mount_keyed_plan(renderer_2_0, root_2_0_0, parent_2_0_0, before_0_0_0, plan) /* forall<e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, plan : kokaine/html/keyed-plan<e>) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
  return mount_keyed_fields(renderer_2_0, root_2_0_0, parent_2_0_0, before_0_0_0, plan.plan_spec.keyed_read, plan.plan_spec.keyed_walk, plan.plan_spec.keyed_key, plan.plan_spec.keyed_compare, plan.plan_spec.keyed_item_equals, plan.plan_spec.keyed_children);
}
 
export function mount_view(renderer_3_7, root_3_0_8, parent_3_0_10, before_1_7, tree_0_0) /* forall<e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, before : maybe<node>, tree : kokaine/html/view<e>) -> <pure,kokaine/reactive/effects/signal-write,ui> () */  {
  if (tree_0_0._tag === 1) {
    return $std_core_types.Unit;
  }
  else if (tree_0_0._tag === 2) {
     
    var x_100_12172 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_create_text(tree_0_0.content);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(target_20_0 /* node */ ) {
        return _mlift_mount_view_11544(before_1_7, parent_3_0_10, target_20_0);
      });
    }
    else {
      return $std_core_hnd._open_at3(0, insert, parent_3_0_10, before_1_7, x_100_12172);
    }
  }
  else if (tree_0_0._tag === 3) {
     
    var x_101_12175 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_create_text("");
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(target_0_0_2 /* node */ ) {
        return _mlift_mount_view_11549(before_1_7, parent_3_0_10, tree_0_0.read, root_3_0_8, target_0_0_2);
      });
    }
    else {
       
      var x_102_12178 = $std_core_hnd._open_at3(0, insert, parent_3_0_10, before_1_7, x_101_12175);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild___30_1 /* () */ ) {
          return _mlift_mount_view_11548(tree_0_0.read, root_3_0_8, x_101_12175, wild___30_1);
        });
      }
      else {
         
        var root_0_10043_0_0 = $std_core_hnd._open_none1(function(value_81_0 /* kokaine/reactive/root<ui> */ ) {
            return value_81_0;
          }, root_3_0_8);
         
        var x_103_12181 = $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043_0_0, function() {
             
            var x_104_12184 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10700_1 /* hnd/ev-index */ ) {
                return _mlift_mount_view_11545(tree_0_0.read, _y_x10700_1);
              });
            }
            else {
              return _mlift_mount_view_11545(tree_0_0.read, x_104_12184);
            }
          }, function(value_82_1 /* string */ ) {
             
            var x_105_12186 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(_y_x10703_1 /* hnd/ev-index */ ) {
                return _mlift_mount_view_11546(x_101_12175, value_82_1, _y_x10703_1);
              });
            }
            else {
              return _mlift_mount_view_11546(x_101_12175, value_82_1, x_105_12186);
            }
          });
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(_mlift_mount_view_11547);
        }
        else {
          return $std_core_types.Unit;
        }
      }
    }
  }
  else if (tree_0_0._tag === 4) {
     
    var _x_x1_4_11360 = $std_core_hnd._open_none1($kokaine_html.is_valid_element_name, tree_0_0.name);
    var _x123 = $std_core_hnd._open_none1(function(b_6 /* bool */ ) {
        return (b_6) ? false : true;
      }, _x_x1_4_11360);
    if (_x123) {
       
      var _x_x1_6_11362 = $std_core_types._lp__plus__plus__rp_("invalid HTML element name: ", tree_0_0.name);
      return $std_core_hnd._open_at2(0, $std_core_exn.$throw, _x_x1_6_11362);
    }
    else {
       
      var x_106_12188 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_create_element(parent_3_0_10, tree_0_0.name);
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(target_1_0_3 /* element */ ) {
          return _mlift_mount_view_11553(tree_0_0.attributes, before_1_7, tree_0_0.children, parent_3_0_10, renderer_3_7, root_3_0_8, target_1_0_3);
        });
      }
      else {
         
        var x_107_12191 = record_owner(root_3_0_8, $std_core_hnd._open_none1(element_node, x_106_12188));
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___0_2_1 /* () */ ) {
            return _mlift_mount_view_11552(tree_0_0.attributes, before_1_7, tree_0_0.children, parent_3_0_10, renderer_3_7, root_3_0_8, x_106_12188, wild___0_2_1);
          });
        }
        else {
           
          var x_108_12194 = $std_core_list.foreach(tree_0_0.attributes, function(attribute_0 /* kokaine/html/attribute<10864> */ ) {
              return mount_attribute(root_3_0_8, x_106_12188, attribute_0);
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(wild___1_2_1 /* () */ ) {
              return _mlift_mount_view_11551(before_1_7, tree_0_0.children, parent_3_0_10, renderer_3_7, root_3_0_8, x_106_12188, wild___1_2_1);
            });
          }
          else {
             
            var x_109_12197 = $std_core_list.foreach(tree_0_0.children, function(child_1 /* kokaine/html/view<10864> */ ) {
                return mount_view(renderer_3_7, root_3_0_8, $std_core_hnd._open_none1(element_node, x_106_12188), $std_core_types.Nothing, child_1);
              });
            if ($std_core_hnd._yielding()) {
              return $std_core_hnd.yield_extend(function(wild___2_2_1 /* () */ ) {
                return _mlift_mount_view_11550(before_1_7, parent_3_0_10, x_106_12188, wild___2_2_1);
              });
            }
            else {
               
              var _x_x3_1_11369_0 = $std_core_hnd._open_none1(element_node, x_106_12188);
              return $std_core_hnd._open_at3(0, function(parent_8_0 /* node */ , before_2_0 /* maybe<node> */ , child_0_0 /* node */ ) {
                  if (before_2_0 === null) {
                     
                    var result_17 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                        return dom_append(parent_8_0, child_0_0);
                      });
                    var _x124 = $std_core_hnd._open_none1(dom_attempt_ok, result_17);
                    if (_x124) {
                      return $std_core_hnd._open_none1(dom_attempt_value, result_17);
                    }
                    else {
                      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_17)));
                    }
                  }
                  else {
                     
                    var result_18 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
                        return dom_insert_before(parent_8_0, child_0_0, before_2_0.value);
                      });
                    var _x125 = $std_core_hnd._open_none1(dom_attempt_ok, result_18);
                    if (_x125) {
                      return $std_core_hnd._open_none1(dom_attempt_value, result_18);
                    }
                    else {
                      return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_18)));
                    }
                  }
                }, parent_3_0_10, before_1_7, _x_x3_1_11369_0);
            }
          }
        }
      }
    }
  }
  else if (tree_0_0._tag === 5) {
    return $std_core_list.foreach(tree_0_0.children, function(child_0_0_0 /* kokaine/html/view<10864> */ ) {
        return mount_view(renderer_3_7, root_3_0_8, parent_3_0_10, before_1_7, child_0_0_0);
      });
  }
  else if (tree_0_0._tag === 6) {
     
    var x_110_12202 = $std_core_hnd._open_at1(0, dom_attempt, function() {
        return dom_create_comment("kokaine:region");
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(first_2_0_3 /* node */ ) {
        return _mlift_mount_view_11561(before_1_7, parent_3_0_10, tree_0_0.read, renderer_3_7, root_3_0_8, first_2_0_3);
      });
    }
    else {
       
      var x_111_12205 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_create_comment("/kokaine:region");
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(last_2_0_4 /* node */ ) {
          return _mlift_mount_view_11560(before_1_7, x_110_12202, parent_3_0_10, tree_0_0.read, renderer_3_7, root_3_0_8, last_2_0_4);
        });
      }
      else {
         
        var x_112_12208 = $std_core_hnd._open_at4(0, insert_marker_pair, parent_3_0_10, before_1_7, x_110_12202, x_111_12205);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(wild___3_2_1 /* () */ ) {
            return _mlift_mount_view_11559(x_110_12202, x_111_12205, parent_3_0_10, tree_0_0.read, renderer_3_7, root_3_0_8, wild___3_2_1);
          });
        }
        else {
           
          var root_0_10043_1_0 = $std_core_hnd._open_none1(function(value_83_0 /* kokaine/reactive/root<ui> */ ) {
              return value_83_0;
            }, root_3_0_8);
           
          var x_113_12211 = $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043_1_0, function() {
               
              var x_114_12214 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(_y_x10725_1 /* hnd/ev-index */ ) {
                  return _mlift_mount_view_11554(tree_0_0.read, _y_x10725_1);
                });
              }
              else {
                return _mlift_mount_view_11554(tree_0_0.read, x_114_12214);
              }
            }, function(next_1_2 /* kokaine/html/view<10864> */ ) {
               
              var x_115_12216 = $std_core_hnd._open_at2(0, function(root_10_0 /* kokaine/reactive/root<ui> */ , cleanup_1_0 /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
                   
                  var root_0_10046_1_0 = $std_core_hnd._open_none1(function(value_84_0 /* kokaine/reactive/root<ui> */ ) {
                      return value_84_0;
                    }, root_10_0);
                   
                  var x_116_12218 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046_1_0, cleanup_1_0);
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(_mlift_mount_view_11555);
                  }
                  else {
                    return _mlift_mount_view_11555(x_116_12218);
                  }
                }, root_3_0_8, function() {
                   
                  var x_117_12220 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
                  if ($std_core_hnd._yielding()) {
                    return $std_core_hnd.yield_extend(function(_y_x10729_1 /* hnd/ev-index */ ) {
                      return _mlift_mount_view_11556(x_110_12202, x_111_12205, _y_x10729_1);
                    });
                  }
                  else {
                    return _mlift_mount_view_11556(x_110_12202, x_111_12205, x_117_12220);
                  }
                });
              if ($std_core_hnd._yielding()) {
                return $std_core_hnd.yield_extend(function(wild___4_2_1 /* () */ ) {
                  return _mlift_mount_view_11557(x_111_12205, next_1_2, parent_3_0_10, renderer_3_7, root_3_0_8, wild___4_2_1);
                });
              }
              else {
                return _mlift_mount_view_11557(x_111_12205, next_1_2, parent_3_0_10, renderer_3_7, root_3_0_8, x_115_12216);
              }
            });
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(_mlift_mount_view_11558);
          }
          else {
            return $std_core_types.Unit;
          }
        }
      }
    }
  }
  else if (tree_0_0._tag === 7) {
    return mount_keyed_plan(renderer_3_7, root_3_0_8, parent_3_0_10, before_1_7, tree_0_0.plan);
  }
  else {
    return insert_html(root_3_0_8, parent_3_0_10, before_1_7, $std_core_hnd._open_none1(function(value_0_0 /* kokaine/html/trusted-html */ ) {
          return value_0_0;
        }, tree_0_0.content));
  }
}
 
 
// monadic lift
export function _mlift_mount_effect_11562(_y_x10740) /* (hnd/ev-index) -> <exn,div> () */  {
  return $std_core_hnd._mask_at(_y_x10740, false, function() {
      return $std_core_types.Unit;
    });
}
 
 
// monadic lift
export function _mlift_mount_effect_11563(_y_x10739) /* (hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn> () */  {
  return $std_core_hnd._mask_at(_y_x10739, false, function() {
       
      var x_12223 = $std_core_hnd._evv_index($std_core_exn.exn_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_effect_11562);
      }
      else {
        return $std_core_hnd._mask_at(x_12223, false, function() {
            return $std_core_types.Unit;
          });
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_effect_11564(_pat_2) /* (kokaine/reactive/internal/model/cleanup-registration<ui>) -> exn () */  {
  return $std_core_types.Unit;
}
 
 
// monadic lift
export function _mlift_mount_effect_11565(first, last, _y_x10750) /* (first : node, last : node, hnd/ev-index) -> <kokaine/reactive/effects/signal-write,div,exn,ui> () */  {
  return $std_core_hnd._mask_at(_y_x10750, false, function() {
       
      var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
          return dom_clean_range(first, last, true);
        });
      var _x126 = $std_core_hnd._open_none1(dom_attempt_ok, result);
      if (_x126) {
        return $std_core_hnd._open_none1(dom_attempt_value, result);
      }
      else {
        return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_effect_11566(last, parent, renderer, root, tree, wild___0) /* forall<e> (last : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, wild_@0 : ()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
  return mount_view(renderer, root, parent, $std_core_types.Just(last), tree);
}
 
 
// monadic lift
export function _mlift_mount_effect_11567(first, last, parent, renderer, root, tree, wild__) /* forall<e> (first : node, last : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, wild_ : ()) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_12227 = $std_core_hnd._open_at2(0, function(root_1 /* kokaine/reactive/root<ui> */ , cleanup /* () -> <kokaine/reactive/effects/signal-write,pure,ui> () */ ) {
       
      var root_0_10046 = $std_core_hnd._open_none1(function(value_0 /* kokaine/reactive/root<ui> */ ) {
          return value_0;
        }, root_1);
       
      var x_0_12229 = $kokaine_reactive_internal_runtime.register_cleanup(root_0_10046, cleanup);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_effect_11564);
      }
      else {
        return $std_core_types.Unit;
      }
    }, root, function() {
       
      var x_1_12231 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_write_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10750 /* hnd/ev-index */ ) {
          return _mlift_mount_effect_11565(first, last, _y_x10750);
        });
      }
      else {
        return _mlift_mount_effect_11565(first, last, x_1_12231);
      }
    });
   
  function next_12228(wild___0) /* (()) -> <exn,div,kokaine/reactive/effects/signal-write,ui> () */  {
    return mount_view(renderer, root, parent, $std_core_types.Just(last), tree);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_12228);
  }
  else {
    return next_12228(x_12227);
  }
}
 
 
// monadic lift
export function _mlift_mount_effect_11568(first, parent, renderer, root, tree, last) /* forall<e> (first : node, parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, last : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_12239 = $std_core_hnd._open_at4(0, function(parent_0 /* node */ , before /* maybe<node> */ , first_0 /* node */ , last_0 /* node */ ) {
      if (before === null) {
         
        var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_append_marker_pair(parent_0, first_0, last_0);
          });
        var _x127 = $std_core_hnd._open_none1(dom_attempt_ok, result);
        if (_x127) {
          return $std_core_hnd._open_none1(dom_attempt_value, result);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
        }
      }
      else {
         
        var result_0 = $std_core_hnd._open_none1(dom_attempt_raw, function() {
            return dom_insert_marker_pair_before(parent_0, first_0, last_0, before.value);
          });
        var _x128 = $std_core_hnd._open_none1(dom_attempt_ok, result_0);
        if (_x128) {
          return $std_core_hnd._open_none1(dom_attempt_value, result_0);
        }
        else {
          return $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result_0)));
        }
      }
    }, parent, $std_core_types.Nothing, first, last);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_mount_effect_11567(first, last, parent, renderer, root, tree, wild__);
    });
  }
  else {
    return _mlift_mount_effect_11567(first, last, parent, renderer, root, tree, x_12239);
  }
}
 
 
// monadic lift
export function _mlift_mount_effect_11569(parent, renderer, root, tree, first) /* forall<e> (parent : node, renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e>, first : node) -> <exn,ui,div,kokaine/reactive/effects/signal-write> () */  {
   
  var x_12243 = $std_core_hnd._open_at1(0, dom_attempt, function() {
      return dom_create_comment("/kokaine:mount");
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(last /* node */ ) {
      return _mlift_mount_effect_11568(first, parent, renderer, root, tree, last);
    });
  }
  else {
    return _mlift_mount_effect_11568(first, parent, renderer, root, tree, x_12243);
  }
}
 
export function mount_effect(renderer, root, parent, tree) /* forall<e> (renderer : kokaine/dom/internal/keyed-transaction/keyed-context, root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>) -> <kokaine/reactive/effects/signal-write,ui,pure> kokaine/reactive/disposer<ui> */  {
   
  var root_0_10043 = $std_core_hnd._open_none1(function(value /* kokaine/reactive/root<ui> */ ) {
      return value;
    }, root);
  return $kokaine_reactive_internal_runtime.create_effect_inner(root_0_10043, function() {
       
      var x_12245 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(_mlift_mount_effect_11563);
      }
      else {
        return _mlift_mount_effect_11563(x_12245);
      }
    }, function(___wildcard_x1447__40 /* () */ ) {
       
      var x_0_12247 = $std_core_hnd._open_at1(0, dom_attempt, function() {
          return dom_create_comment("kokaine:mount");
        });
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(first /* node */ ) {
          return _mlift_mount_effect_11569(parent, renderer, root, tree, first);
        });
      }
      else {
        return _mlift_mount_effect_11569(parent, renderer, root, tree, x_0_12247);
      }
    });
}
 
 
// monadic lift
export function _mlift_mount_transaction_11570(pending, dispose_0) /* forall<_e> (pending : ref<global,maybe<() -> <exn,ui> ()>>, dispose@0 : () -> <exn,ui> ()) -> <kokaine/reactive/effects/signal-write,ui,pure> (() -> <exn,ui> ()) */  {
   
  ((pending).value = ($std_core_types.Just(dispose_0)));
  return dispose_0;
}
 
 
// monadic lift
export function _mlift_mount_transaction_11571(register, _y_x10768) /* (register : () -> <div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()), hnd/ev-index) -> <kokaine/reactive/effects/signal-read,div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()) */  {
  return $std_core_hnd._mask_at(_y_x10768, false, register);
}
 
 
// monadic lift
export function _mlift_mount_transaction_11572(register, root, _y_x10764) /* (register : () -> <div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()), root : kokaine/reactive/root<ui>, owner-match) -> <exn,ui> (() -> <exn,ui> ()) */  {
  if (_y_x10764._tag === 1) {
     
    var inner_0_0 = $std_core_hnd._open_none1(function(value_6 /* kokaine/reactive/root<ui> */ ) {
        return value_6;
      }, root);
    return $kokaine_reactive_internal_runtime.update(inner_0_0, function() {
         
        var root_0_10027_0 = $std_core_hnd._open_none1(function(value_7 /* kokaine/reactive/root<ui> */ ) {
            return value_7;
          }, root);
        return $kokaine_reactive_internal_runtime.batch(root_0_10027_0, register);
      });
  }
  else if (_y_x10764._tag === 3) {
    return $std_core_exn.$throw("cannot mount into a retired Kokaine DOM generation");
  }
  else {
    return $kokaine_reactive_integration_internal_reentry.run_reentry($std_core_hnd._open_none1(function(value_0_0 /* kokaine/reactive/integration/reentry<ui> */ ) {
          return value_0_0;
        }, _y_x10764.owner_portal), function() {
         
        var x_12249 = $std_core_hnd._evv_index($kokaine_reactive_effects.signal_read_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10768 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10768, false, register);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_12249, false, register);
        }
      });
  }
}
 
 
// monadic lift
export function _mlift_mount_transaction_11573(committed, _c_x10772) /* forall<_e> (committed : ref<global,bool>, () -> <exn,ui> ()) -> (() -> <exn,ui> ()) */  {
   
  ((committed).value = true);
  return _c_x10772;
}
 
 
// monadic lift
export function _mlift_mount_transaction_11574(inherit_owner, parent, root, tree, wild__) /* forall<_e,_e1,_e2,e3> (inherit-owner : bool, parent : node, root : kokaine/reactive/root<ui>, tree : kokaine/html/view<e3>, wild_ : ()) -> <ui,exn> (() -> <exn,ui> ()) */  {
   
  var renderer = $std_core_hnd._open_none0($kokaine_dom_internal_keyed_dash_transaction.new_keyed_context);
   
  var pending = { value: ($std_core_types.Nothing) };
   
  var committed = { value: false };
   
  function register() /* () -> <div,exn,kokaine/reactive/effects/signal-write,ui> (() -> <exn,ui> ()) */  {
     
    var x_12255 = mount_effect(renderer, root, parent, tree);
     
    function next_12256(dispose_0) /* (kokaine/reactive/disposer<ui>) -> <kokaine/reactive/effects/signal-write,ui,pure> (() -> <exn,ui> ()) */  {
       
      ((pending).value = ($std_core_types.Just(dispose_0)));
      return dispose_0;
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_12256);
    }
    else {
      return next_12256(x_12255);
    }
  }
   
  var _x127 = $std_core_hnd._open_none1(function(b /* bool */ ) {
      return (b) ? false : true;
    }, inherit_owner);
  if (_x127) {
     
    var inner_0 = $std_core_hnd._open_none1(function(value_4 /* kokaine/reactive/root<ui> */ ) {
        return value_4;
      }, root);
    var x_0_12259 = $kokaine_reactive_internal_runtime.update(inner_0, function() {
         
        var root_0_10027 = $std_core_hnd._open_none1(function(value_5 /* kokaine/reactive/root<ui> */ ) {
            return value_5;
          }, root);
        return $kokaine_reactive_internal_runtime.batch(root_0_10027, register);
      });
  }
  else {
     
    var x_1_12261 = find_owner(root, parent);
    if ($std_core_hnd._yielding()) {
      var x_0_12259 = $std_core_hnd.yield_extend(function(_y_x10764 /* owner-match */ ) {
        return _mlift_mount_transaction_11572(register, root, _y_x10764);
      });
    }
    else {
      var x_0_12259 = _mlift_mount_transaction_11572(register, root, x_1_12261);
    }
  }
  if ($std_core_hnd._yielding()) {
    var _x129 = $std_core_hnd.yield_extend(function(_c_x10772 /* () -> <exn,ui> () */ ) {
       
      ((committed).value = true);
      return _c_x10772;
    });
  }
  else {
     
    ((committed).value = true);
    var _x129 = x_0_12259;
  }
  return $std_core_hnd.finally_prompt(function() {
      var _x127 = committed.value;
      if (_x127) {
        return $std_core_types.Unit;
      }
      else {
        var _x128 = pending.value;
        if (_x128 === null) {
          return $std_core_types.Unit;
        }
        else {
          return _x128.value();
        }
      }
    }, _x129);
}
 
export function mount_transaction(root, parent, tree, inherit_owner) /* forall<e> (root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>, inherit-owner : bool) -> <ui,exn> kokaine/reactive/disposer<ui> */  {
   
  var result = $std_core_hnd._open_none1(dom_attempt_raw, function() {
      return dom_install_shadow_tracker(parent);
    });
   
  var _x130 = $std_core_hnd._open_none1(dom_attempt_ok, result);
  if (_x130) {
    var x_12265 = $std_core_hnd._open_none1(dom_attempt_value, result);
  }
  else {
    var x_12265 = $std_core_exn.$throw($std_core_types._lp__plus__plus__rp_("browser DOM exception: ", $std_core_hnd._open_none1(dom_attempt_message, result)));
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return _mlift_mount_transaction_11574(inherit_owner, parent, root, tree, wild__);
    });
  }
  else {
     
    var renderer = $std_core_hnd._open_none0($kokaine_dom_internal_keyed_dash_transaction.new_keyed_context);
     
    var pending = { value: ($std_core_types.Nothing) };
     
    var committed = { value: false };
     
    var register = function() {
       
      var x_0_12271 = mount_effect(renderer, root, parent, tree);
       
      var next_0_12272 = function(dispose_0 /* () -> <exn,ui> () */ ) {
         
        ((pending).value = ($std_core_types.Just(dispose_0)));
        return dispose_0;
      };
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(next_0_12272);
      }
      else {
        return next_0_12272(x_0_12271);
      }
    };
     
    var _x130 = $std_core_hnd._open_none1(function(b /* bool */ ) {
        return (b) ? false : true;
      }, inherit_owner);
    if (_x130) {
       
      var inner_0 = $std_core_hnd._open_none1(function(value_4 /* kokaine/reactive/root<ui> */ ) {
          return value_4;
        }, root);
      var x_1_12275 = $kokaine_reactive_internal_runtime.update(inner_0, function() {
           
          var root_0_10027 = $std_core_hnd._open_none1(function(value_5 /* kokaine/reactive/root<ui> */ ) {
              return value_5;
            }, root);
          return $kokaine_reactive_internal_runtime.batch(root_0_10027, register);
        });
    }
    else {
       
      var x_2_12277 = find_owner(root, parent);
      if ($std_core_hnd._yielding()) {
        var x_1_12275 = $std_core_hnd.yield_extend(function(_y_x10764 /* owner-match */ ) {
          return _mlift_mount_transaction_11572(register, root, _y_x10764);
        });
      }
      else {
        var x_1_12275 = _mlift_mount_transaction_11572(register, root, x_2_12277);
      }
    }
    if ($std_core_hnd._yielding()) {
      var _x132 = $std_core_hnd.yield_extend(function(_c_x10772 /* () -> <exn,ui> () */ ) {
         
        ((committed).value = true);
        return _c_x10772;
      });
    }
    else {
       
      ((committed).value = true);
      var _x132 = x_1_12275;
    }
    return $std_core_hnd.finally_prompt(function() {
        var _x130 = committed.value;
        if (_x130) {
          return $std_core_types.Unit;
        }
        else {
          var _x131 = pending.value;
          if (_x131 === null) {
            return $std_core_types.Unit;
          }
          else {
            return _x131.value();
          }
        }
      }, _x132);
  }
}
 
export function mount(root, parent, tree) /* forall<e> (root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>) -> <ui,exn> kokaine/reactive/disposer<ui> */  {
  return mount_transaction(root, parent, tree, true);
}
 
 
// Opt out of physical DOM ownership inheritance for intentionally independent
// roots mounted inside a managed subtree. The caller then owns the returned
// disposer and must retire it explicitly.
export function mount_independent(root, parent, tree) /* forall<e> (root : kokaine/reactive/root<ui>, parent : node, tree : kokaine/html/view<e>) -> <ui,exn> kokaine/reactive/disposer<ui> */  {
  return mount_transaction(root, parent, tree, false);
}
 
export function unmount(dispose) /* forall<e> (dispose : kokaine/reactive/disposer<<ui|e>>) -> <ui,exn|e> () */  {
  return dispose();
}