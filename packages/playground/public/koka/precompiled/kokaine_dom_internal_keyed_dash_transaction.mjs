// Koka generated module: kokaine/dom/internal/keyed-transaction, koka version: 3.2.4
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
import * as $kokaine_reactive_integration from './kokaine_reactive_integration.mjs';
import * as $std_core_unsafe from './std_core_unsafe.mjs';
import * as $std_core_undiv from './std_core_undiv.mjs';
import * as $kokaine_reactive_integration_internal_provision from './kokaine_reactive_integration_internal_provision.mjs';
 
// externals
 
// type declarations
// type keyed-publication
export function Keyed_publication(publication_prepare, publication_publish, publication_rollback) /* (publication-prepare : () -> <ui,exn> (), publication-publish : () -> (), publication-rollback : () -> <ui,exn> ()) -> keyed-publication */  {
  return { publication_prepare: publication_prepare, publication_publish: publication_publish, publication_rollback: publication_rollback };
}
// type keyed-transaction-state
export const Keyed_open = 1; // keyed-transaction-state
export const Keyed_prepared = 2; // keyed-transaction-state
export const Keyed_committed = 3; // keyed-transaction-state
export const Keyed_aborted = 4; // keyed-transaction-state
// type keyed-transaction
export function Keyed_transaction(transaction_state, transaction_publications) /* (transaction-state : ref<global,keyed-transaction-state>, transaction-publications : ref<global,list<keyed-publication>>) -> keyed-transaction */  {
  return { transaction_state: transaction_state, transaction_publications: transaction_publications };
}
// type keyed-entry
export function Keyed_entry(entry_provision, entry_transaction) /* (entry-provision : kokaine/reactive/integration/provision<ui>, entry-transaction : keyed-transaction) -> keyed-entry */  {
  return { entry_provision: entry_provision, entry_transaction: entry_transaction };
}
// type keyed-context
export function Keyed_context(context_active) /* (context-active : ref<global,list<keyed-entry>>) -> keyed-context */  {
  return context_active;
}
 
// declarations
 
export function cell(value) /* forall<a> (value : a) -> ref<global,a> */  {
  return { value: value };
}
 
export function load(value) /* forall<a> (value : ref<global,a>) -> a */  {
  return value.value;
}
 
export function store(target, value) /* forall<a> (target : ref<global,a>, value : a) -> () */  {
  return ((target).value = value);
}
 
 
// Automatically generated. Retrieves the `publication-prepare` constructor field of the `:keyed-publication` type.
export function keyed_publication_fs_publication_prepare(_this) /* (keyed-publication) -> (() -> <exn,ui> ()) */  {
  return _this.publication_prepare;
}
 
 
// Automatically generated. Retrieves the `publication-publish` constructor field of the `:keyed-publication` type.
export function keyed_publication_fs_publication_publish(_this) /* (keyed-publication) -> (() -> ()) */  {
  return _this.publication_publish;
}
 
 
// Automatically generated. Retrieves the `publication-rollback` constructor field of the `:keyed-publication` type.
export function keyed_publication_fs_publication_rollback(_this) /* (keyed-publication) -> (() -> <exn,ui> ()) */  {
  return _this.publication_rollback;
}
 
 
// monadic lift
export function keyed_publication_fs__mlift_copy_10116(_c_x10040, _this, publication_publish, _c_x10042) /* (() -> <ui,exn> (), keyed-publication, publication-publish : ? (() -> ()), () -> <ui,exn> ()) -> keyed-publication */  {
  if (publication_publish !== undefined) {
    var _x0 = publication_publish;
  }
  else {
    var _x0 = _this.publication_publish;
  }
  return Keyed_publication(_c_x10040, _x0, _c_x10042);
}
 
 
// monadic lift
export function keyed_publication_fs__mlift_copy_10117(_this, publication_publish, publication_rollback, _c_x10040) /* (keyed-publication, publication-publish : ? (() -> ()), publication-rollback : ? (() -> <ui,exn> ()), () -> <ui,exn> ()) -> keyed-publication */  {
   
  function next_10123(_c_x10042) /* (() -> <ui,exn> ()) -> keyed-publication */  {
    if (publication_publish !== undefined) {
      var _x1 = publication_publish;
    }
    else {
      var _x1 = _this.publication_publish;
    }
    return Keyed_publication(_c_x10040, _x1, _c_x10042);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10123);
  }
  else {
    if (publication_rollback !== undefined) {
      var _x1 = publication_rollback;
    }
    else {
      var _x1 = _this.publication_rollback;
    }
    return next_10123(_x1);
  }
}
 
export function keyed_publication_fs__copy(_this, publication_prepare, publication_publish, publication_rollback) /* (keyed-publication, publication-prepare : ? (() -> <ui,exn> ()), publication-publish : ? (() -> ()), publication-rollback : ? (() -> <ui,exn> ())) -> keyed-publication */  {
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_c_x10040 /* () -> <ui,exn> () */ ) {
      return keyed_publication_fs__mlift_copy_10117(_this, publication_publish, publication_rollback, _c_x10040);
    });
  }
  else {
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_c_x10042 /* () -> <ui,exn> () */ ) {
        if (publication_prepare !== undefined) {
          var _x2 = publication_prepare;
        }
        else {
          var _x2 = _this.publication_prepare;
        }
        if (publication_publish !== undefined) {
          var _x3 = publication_publish;
        }
        else {
          var _x3 = _this.publication_publish;
        }
        return Keyed_publication(_x2, _x3, _c_x10042);
      });
    }
    else {
      if (publication_prepare !== undefined) {
        var _x4 = publication_prepare;
      }
      else {
        var _x4 = _this.publication_prepare;
      }
      if (publication_publish !== undefined) {
        var _x5 = publication_publish;
      }
      else {
        var _x5 = _this.publication_publish;
      }
      if (publication_rollback !== undefined) {
        var _x6 = publication_rollback;
      }
      else {
        var _x6 = _this.publication_rollback;
      }
      return Keyed_publication(_x4, _x5, _x6);
    }
  }
}
 
 
// Automatically generated. Tests for the `Keyed-open` constructor of the `:keyed-transaction-state` type.
export function is_keyed_open(keyed_transaction_state) /* (keyed-transaction-state : keyed-transaction-state) -> bool */  {
  return (keyed_transaction_state === 1);
}
 
 
// Automatically generated. Tests for the `Keyed-prepared` constructor of the `:keyed-transaction-state` type.
export function is_keyed_prepared(keyed_transaction_state) /* (keyed-transaction-state : keyed-transaction-state) -> bool */  {
  return (keyed_transaction_state === 2);
}
 
 
// Automatically generated. Tests for the `Keyed-committed` constructor of the `:keyed-transaction-state` type.
export function is_keyed_committed(keyed_transaction_state) /* (keyed-transaction-state : keyed-transaction-state) -> bool */  {
  return (keyed_transaction_state === 3);
}
 
 
// Automatically generated. Tests for the `Keyed-aborted` constructor of the `:keyed-transaction-state` type.
export function is_keyed_aborted(keyed_transaction_state) /* (keyed-transaction-state : keyed-transaction-state) -> bool */  {
  return (keyed_transaction_state === 4);
}
 
 
// Automatically generated. Retrieves the `transaction-state` constructor field of the `:keyed-transaction` type.
export function keyed_transaction_fs_transaction_state(_this) /* (keyed-transaction) -> ref<global,keyed-transaction-state> */  {
  return _this.transaction_state;
}
 
 
// Automatically generated. Retrieves the `transaction-publications` constructor field of the `:keyed-transaction` type.
export function keyed_transaction_fs_transaction_publications(_this) /* (keyed-transaction) -> ref<global,list<keyed-publication>> */  {
  return _this.transaction_publications;
}
 
export function keyed_transaction_fs__copy(_this, transaction_state, transaction_publications) /* (keyed-transaction, transaction-state : ? (ref<global,keyed-transaction-state>), transaction-publications : ? (ref<global,list<keyed-publication>>)) -> keyed-transaction */  {
  if (transaction_state !== undefined) {
    var _x7 = transaction_state;
  }
  else {
    var _x7 = _this.transaction_state;
  }
  if (transaction_publications !== undefined) {
    var _x8 = transaction_publications;
  }
  else {
    var _x8 = _this.transaction_publications;
  }
  return Keyed_transaction(_x7, _x8);
}
 
 
// Automatically generated. Retrieves the `entry-provision` constructor field of the `:keyed-entry` type.
export function keyed_entry_fs_entry_provision(_this) /* (keyed-entry) -> kokaine/reactive/integration/provision<ui> */  {
  return _this.entry_provision;
}
 
 
// Automatically generated. Retrieves the `entry-transaction` constructor field of the `:keyed-entry` type.
export function keyed_entry_fs_entry_transaction(_this) /* (keyed-entry) -> keyed-transaction */  {
  return _this.entry_transaction;
}
 
export function keyed_entry_fs__copy(_this, entry_provision, entry_transaction) /* (keyed-entry, entry-provision : ? (kokaine/reactive/integration/provision<ui>), entry-transaction : ? keyed-transaction) -> keyed-entry */  {
  if (entry_provision !== undefined) {
    var _x9 = entry_provision;
  }
  else {
    var _x9 = _this.entry_provision;
  }
  if (entry_transaction !== undefined) {
    var _x10 = entry_transaction;
  }
  else {
    var _x10 = _this.entry_transaction;
  }
  return Keyed_entry(_x9, _x10);
}
 
 
// Automatically generated. Retrieves the `context-active` constructor field of the `:keyed-context` type.
export function keyed_context_fs_context_active(_this) /* (keyed-context) -> ref<global,list<keyed-entry>> */  {
  return _this;
}
 
export function keyed_context_fs__copy(_this, context_active) /* (keyed-context, context-active : ? (ref<global,list<keyed-entry>>)) -> keyed-context */  {
  if (context_active !== undefined) {
    var _x11 = context_active;
  }
  else {
    var _x11 = _this;
  }
  return _x11;
}
 
export function new_keyed_context() /* () -> keyed-context */  {
  return { value: ($std_core_types.Nil) };
}
 
export function new_keyed_transaction() /* () -> keyed-transaction */  {
  return Keyed_transaction({ value: Keyed_open }, { value: ($std_core_types.Nil) });
}
 
export function find_keyed_transaction(values, expected) /* (values : list<keyed-entry>, expected : kokaine/reactive/integration/provision<ui>) -> exn keyed-transaction */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_exn.$throw("active provision does not belong to this renderer transaction");
  }
  else {
     
    var _x_x1_10109 = $std_core_hnd._open_none1(function(_this /* keyed-entry */ ) {
        return _this.entry_provision;
      }, values.head);
    var _x12 = $std_core_hnd._open_none2(function(left /* kokaine/reactive/integration/provision<ui> */ , right /* kokaine/reactive/integration/provision<ui> */ ) {
        var _x13 = left;
        var _x14 = right;
        return $kokaine_reactive_integration_internal_provision.provision_fs_same(_x13, _x14);
      }, _x_x1_10109, expected);
    if (_x12) {
      return $std_core_hnd._open_none1(function(_this_0 /* keyed-entry */ ) {
          return _this_0.entry_transaction;
        }, values.head);
    }
    else {
      {
        // tail call
        values = values.tail;
        continue tailcall;
      }
    }
  }
}}
 
export function current_keyed_transaction(renderer, expected) /* (renderer : keyed-context, expected : kokaine/reactive/integration/provision<ui>) -> exn keyed-transaction */  {
  return find_keyed_transaction(renderer.value, expected);
}
 
export function with_keyed_transaction(renderer, current, transaction, action) /* forall<a,e> (renderer : keyed-context, current : kokaine/reactive/integration/provision<ui>, transaction : keyed-transaction, action : () -> <div,exn|e> a) -> <div,exn|e> a */  {
   
  var previous = renderer.value;
   
  ((renderer).value = ($std_core_types.Cons(Keyed_entry(current, transaction), previous)));
  return $std_core_hnd.finally_prompt(function() {
      return ((renderer).value = previous);
    }, action());
}
 
export function stage_keyed_publication(transaction, prepare, publish, rollback) /* (transaction : keyed-transaction, prepare : () -> <exn,ui> (), publish : () -> (), rollback : () -> <exn,ui> ()) -> exn () */  {
  var _x15 = (transaction.transaction_state).value;
  if (_x15 === 1) {
     
    var value_0_10086 = $std_core_types.Cons(Keyed_publication(prepare, publish, rollback), (transaction.transaction_publications).value);
    return (((transaction.transaction_publications)).value = value_0_10086);
  }
  else {
    return $std_core_exn.$throw("cannot enlist publication in a closed keyed transaction");
  }
}
 
 
// monadic lift
export function _mlift_prepare_publications_10118(rest, _y_x10056) /* (rest : list<keyed-publication>, ()) -> <exn,ui> () */  {
  var _x16 = rest;
  return prepare_publications(_x16);
}
 
export function prepare_publications(values) /* (values : list<keyed-publication>) -> <exn,ui> () */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var prepare = $std_core_hnd._open_none1(function(_this /* keyed-publication */ ) {
        return _this.publication_prepare;
      }, values.head);
     
    var x_10140 = prepare();
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10056_0 /* () */ ) {
        return _mlift_prepare_publications_10118(values.tail, _y_x10056_0);
      });
    }
    else {
      {
        // tail call
        var _x17 = values.tail;
        values = _x17;
        continue tailcall;
      }
    }
  }
}}
 
export function publish_publications(values) /* (values : list<keyed-publication>) -> () */  { tailcall: while(1)
{
  if (values === null) {
    return $std_core_types.Unit;
  }
  else {
    {
      // tail call
      var _x19 = values.head.publication_publish();
      var _x18 = values.tail;
      values = _x18;
      continue tailcall;
    }
  }
}}
 
export function rollback_publications(values) /* (values : list<keyed-publication>) -> <exn,ui> () */  {
  if (values === null) {
    return $std_core_types.Unit;
  }
  else {
     
    var rollback = $std_core_hnd._open_none1(function(_this /* keyed-publication */ ) {
        return _this.publication_rollback;
      }, values.head);
    return $std_core_hnd.finally_prompt(function() {
        return rollback_publications(values.tail);
      }, rollback());
  }
}
 
 
// monadic lift
export function _mlift_prepare_keyed_transaction_10119(state, wild__) /* forall<_e> (state : ref<global,keyed-transaction-state>, wild_ : ()) -> <exn,ui> () */  {
  return ((state).value = Keyed_prepared);
}
 
 
// monadic lift
export function _mlift_prepare_keyed_transaction_10120(state, values) /* forall<_e> (state : ref<global,keyed-transaction-state>, values : list<keyed-publication>) -> <exn,ui> () */  {
   
  var x_10145 = prepare_publications(values);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
      return ((state).value = Keyed_prepared);
    });
  }
  else {
    return ((state).value = Keyed_prepared);
  }
}
 
export function prepare_keyed_transaction(transaction) /* (transaction : keyed-transaction) -> <exn,ui> () */  {
  var _x20 = (transaction.transaction_state).value;
  if (_x20 === 1) {
     
    var xs_10091 = (transaction.transaction_publications).value;
     
    var x_10149 = $std_core_list.reverse_acc($std_core_types.Nil, xs_10091);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(values /* list<keyed-publication> */ ) {
        return _mlift_prepare_keyed_transaction_10120(transaction.transaction_state, values);
      });
    }
    else {
       
      var x_0_10152 = prepare_publications(x_10149);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(wild__ /* () */ ) {
          return (((transaction.transaction_state)).value = Keyed_prepared);
        });
      }
      else {
        return (((transaction.transaction_state)).value = Keyed_prepared);
      }
    }
  }
  else {
    return $std_core_exn.$throw("keyed transaction can only prepare while open");
  }
}
 
 
// monadic lift
export function _mlift_publish_keyed_transaction_10121(publications, state, values) /* forall<_e> (publications : ref<global,list<keyed-publication>>, state : ref<global,keyed-transaction-state>, values : list<keyed-publication>) -> exn () */  {
   
  ((publications).value = ($std_core_types.Nil));
   
  ((state).value = Keyed_committed);
  return $std_core_hnd._open_none1(publish_publications, values);
}
 
export function publish_keyed_transaction(transaction) /* (transaction : keyed-transaction) -> exn () */  {
  var _x21 = (transaction.transaction_state).value;
  if (_x21 === 2) {
     
    var xs_10096 = (transaction.transaction_publications).value;
     
    var x_10157 = $std_core_list.reverse_acc($std_core_types.Nil, xs_10096);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(values /* list<keyed-publication> */ ) {
        return _mlift_publish_keyed_transaction_10121(transaction.transaction_publications, transaction.transaction_state, values);
      });
    }
    else {
       
      (((transaction.transaction_publications)).value = ($std_core_types.Nil));
       
      (((transaction.transaction_state)).value = Keyed_committed);
      return $std_core_hnd._open_none1(publish_publications, x_10157);
    }
  }
  else {
    return $std_core_exn.$throw("keyed transaction must prepare before publication");
  }
}
 
export function abort_keyed_transaction(transaction) /* (transaction : keyed-transaction) -> <exn,ui> () */  {
  var _x22 = (transaction.transaction_state).value;
  if (_x22 === 3) {
    return $std_core_types.Unit;
  }
  else if (_x22 === 4) {
    return $std_core_types.Unit;
  }
  else {
     
    var values = (transaction.transaction_publications).value;
     
    (((transaction.transaction_publications)).value = ($std_core_types.Nil));
     
    (((transaction.transaction_state)).value = Keyed_aborted);
    return rollback_publications(values);
  }
}