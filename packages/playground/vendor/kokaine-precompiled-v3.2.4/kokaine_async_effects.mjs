// Koka generated module: kokaine/async/effects, koka version: 3.2.4
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
import * as $std_core_unsafe from './std_core_unsafe.mjs';
 
// externals
 
// type declarations
 
 
// runtime tag for the effect `:async-await`
export var async_await_fs__tag;
var async_await_fs__tag = "async-await@effects";
 
 
// runtime tag for the effect `:async-cancel`
export var async_cancel_fs__tag;
var async_cancel_fs__tag = "async-cancel@effects";
 
 
// runtime tag for the effect `:async-ioc`
export var async_ioc_fs__tag;
var async_ioc_fs__tag = "async-ioc@effects";
 
 
// runtime tag for the effect `:async-ownership`
export var async_ownership_fs__tag;
var async_ownership_fs__tag = "async-ownership@effects";
 
 
// runtime tag for the effect `:discontinue`
export var discontinue_fs__tag;
var discontinue_fs__tag = "discontinue@effects";
// type async-scope
export function Scope(ids, scope_namespace) /* (ids : list<scope-id>, scope-namespace : int) -> async-scope */  {
  return { ids: ids, scope_namespace: scope_namespace };
}
// type await-result
export function Result(value) /* forall<a> (value : a) -> await-result<a> */  {
  return { _tag: 1, value: value };
}
export function Exception(error) /* forall<a> (error : exception) -> await-result<a> */  {
  return { _tag: 2, error: error };
}
export const Cancel = { _tag: 3 }; // forall<a> await-result<a>
// type async-await
export function _Hnd_async_await(_cfc, _ctl_do_await, _fun_no_await) /* forall<e,a> (int, forall<b> hnd/clause1<(await-setup<b>, async-scope, string),await-result<b>,async-await,e,a>, forall<b> hnd/clause1<(await-setup<b>, async-scope, string, (await-result<b>) -> ui ()),(),async-await,e,a>) -> async-await<e,a> */  {
  return { _cfc: _cfc, _ctl_do_await: _ctl_do_await, _fun_no_await: _fun_no_await };
}
// type async-cancel
export function _Hnd_async_cancel(_cfc, _val_async_scope, _fun_cancel_scope, _fun_is_scope_canceled, _fun_release_canceled_scope) /* forall<e,a> (int, hnd/clause0<async-scope,async-cancel,e,a>, hnd/clause1<async-scope,(),async-cancel,e,a>, hnd/clause1<async-scope,bool,async-cancel,e,a>, hnd/clause1<async-scope,(),async-cancel,e,a>) -> async-cancel<e,a> */  {
  return { _cfc: _cfc, _val_async_scope: _val_async_scope, _fun_cancel_scope: _fun_cancel_scope, _fun_is_scope_canceled: _fun_is_scope_canceled, _fun_release_canceled_scope: _fun_release_canceled_scope };
}
// type async-ioc
export function _Hnd_async_ioc(_cfc, _fun_async_ioc, _fun_async_schedule_ioc) /* forall<e,a> (int, forall<b> hnd/clause1<() -> ui b,b,async-ioc,e,a>, hnd/clause2<async-scope,() -> ui (),(),async-ioc,e,a>) -> async-ioc<e,a> */  {
  return { _cfc: _cfc, _fun_async_ioc: _fun_async_ioc, _fun_async_schedule_ioc: _fun_async_schedule_ioc };
}
// type async-ownership
export function _Hnd_async_ownership(_cfc, _fun_async_own_disposer) /* forall<e,a> (int, hnd/clause1<dispose-fn,ownership-release-fn,async-ownership,e,a>) -> async-ownership<e,a> */  {
  return { _cfc: _cfc, _fun_async_own_disposer: _fun_async_own_disposer };
}
// type discontinue
export function _Hnd_discontinue(_cfc, _brk_discontinue) /* forall<e,a> (int, forall<b> hnd/clause0<b,discontinue,e,a>) -> discontinue<e,a> */  {
  return { _cfc: _cfc, _brk_discontinue: _brk_discontinue };
}
 
// declarations
 
 
// Automatically generated. Tests for the `Result` constructor of the `:await-result` type.
export function is_result(await_result) /* forall<a> (await-result : await-result<a>) -> bool */  {
  return (await_result._tag === 1);
}
 
 
// Automatically generated. Tests for the `Exception` constructor of the `:await-result` type.
export function is_exception(await_result) /* forall<a> (await-result : await-result<a>) -> bool */  {
  return (await_result._tag === 2);
}
 
 
// Automatically generated. Tests for the `Cancel` constructor of the `:await-result` type.
export function is_cancel(await_result) /* forall<a> (await-result : await-result<a>) -> bool */  {
  return (await_result._tag === 3);
}
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:async-await` type.
export function async_await_fs__cfc(_this) /* forall<e,a> (async-await<e,a>) -> int */  {
  return _this._cfc;
}
 
 
// handler for the effect `:async-await`
export function async_await_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : async-await<e,b>, ret : (res : a) -> e b, action : () -> <async-await|e> a) -> e b */  {
  return $std_core_hnd._hhandle(async_await_fs__tag, hnd, ret, action);
}
 
 
// Automatically generated. Retrieves the `@ctl-do-await` constructor field of the `:async-await` type.
export function async_await_fs__ctl_do_await(_this) /* forall<e,a,b> (async-await<e,a>) -> hnd/clause1<(await-setup<b>, async-scope, string),await-result<b>,async-await,e,a> */  {
  return _this._ctl_do_await;
}
 
 
// select `do-await` operation out of effect `:async-await`
export function do_await_fs__select(hnd) /* forall<a,e,b> (hnd : async-await<e,b>) -> hnd/clause1<(await-setup<a>, async-scope, string),await-result<a>,async-await,e,b> */  {
  return hnd._ctl_do_await;
}
 
 
// Suspend the current strand until the host handler supplies a result.
// Call the `ctl do-await` operation of the effect `:async-await`
export function do_await(setup, scope, label) /* forall<a> (setup : await-setup<a>, scope : async-scope, label : string) -> async-await await-result<a> */  {
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), do_await_fs__select, setup, scope, label);
}
 
 
// Automatically generated. Retrieves the `@fun-no-await` constructor field of the `:async-await` type.
export function async_await_fs__fun_no_await(_this) /* forall<e,a,b> (async-await<e,a>) -> hnd/clause1<(await-setup<b>, async-scope, string, (await-result<b>) -> ui ()),(),async-await,e,a> */  {
  return _this._fun_no_await;
}
 
 
// select `no-await` operation out of effect `:async-await`
export function no_await_fs__select(hnd) /* forall<a,e,b> (hnd : async-await<e,b>) -> hnd/clause1<(await-setup<a>, async-scope, string, (await-result<a>) -> ui ()),(),async-await,e,b> */  {
  return hnd._fun_no_await;
}
 
 
// concurrency uses this to route completions into its own scheduler.
// Call the `fun no-await` operation of the effect `:async-await`
export function no_await(setup, scope, label, callback) /* forall<a> (setup : await-setup<a>, scope : async-scope, label : string, callback : (await-result<a>) -> ui ()) -> async-await () */  {
  return $std_core_hnd._perform4($std_core_hnd._evv_at(0), no_await_fs__select, setup, scope, label, callback);
}
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:async-cancel` type.
export function async_cancel_fs__cfc(_this) /* forall<e,a> (async-cancel<e,a>) -> int */  {
  return _this._cfc;
}
 
 
// handler for the effect `:async-cancel`
export function async_cancel_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : async-cancel<e,b>, ret : (res : a) -> e b, action : () -> <async-cancel|e> a) -> e b */  {
  return $std_core_hnd._hhandle(async_cancel_fs__tag, hnd, ret, action);
}
 
 
// select `@val-async-scope` operation out of effect `:async-cancel`
export function _val_async_scope_fs__select(hnd) /* forall<e,a> (hnd : async-cancel<e,a>) -> hnd/clause0<async-scope,async-cancel,e,a> */  {
  return hnd._val_async_scope;
}
 
 
// Call the `val async-scope` operation of the effect `:async-cancel`
export function _val_async_scope() /* () -> async-cancel async-scope */  {
   
  var ev_10222 = $std_core_hnd._evv_at(0);
  return ev_10222.hnd._val_async_scope(ev_10222.marker, ev_10222);
}
 
 
// Automatically generated. Retrieves the `@val-async-scope` constructor field of the `:async-cancel` type.
export function async_cancel_fs__val_async_scope(_this) /* forall<e,a> (async-cancel<e,a>) -> hnd/clause0<async-scope,async-cancel,e,a> */  {
  return _this._val_async_scope;
}
 
 
// Call the `val async-scope` operation of the effect `:async-cancel`
export var async_scope;
var async_scope = $std_core_types._Valueop;
 
 
// Automatically generated. Retrieves the `@fun-cancel-scope` constructor field of the `:async-cancel` type.
export function async_cancel_fs__fun_cancel_scope(_this) /* forall<e,a> (async-cancel<e,a>) -> hnd/clause1<async-scope,(),async-cancel,e,a> */  {
  return _this._fun_cancel_scope;
}
 
 
// select `cancel-scope` operation out of effect `:async-cancel`
export function cancel_scope_fs__select(hnd) /* forall<e,a> (hnd : async-cancel<e,a>) -> hnd/clause1<async-scope,(),async-cancel,e,a> */  {
  return hnd._fun_cancel_scope;
}
 
 
// Call the `fun cancel-scope` operation of the effect `:async-cancel`
export function cancel_scope(scope) /* (scope : async-scope) -> async-cancel () */  {
   
  var ev_10224 = $std_core_hnd._evv_at(0);
  return ev_10224.hnd._fun_cancel_scope(ev_10224.marker, ev_10224, scope);
}
 
 
// Automatically generated. Retrieves the `@fun-release-canceled-scope` constructor field of the `:async-cancel` type.
export function async_cancel_fs__fun_release_canceled_scope(_this) /* forall<e,a> (async-cancel<e,a>) -> hnd/clause1<async-scope,(),async-cancel,e,a> */  {
  return _this._fun_release_canceled_scope;
}
 
 
// select `release-canceled-scope` operation out of effect `:async-cancel`
export function release_canceled_scope_fs__select(hnd) /* forall<e,a> (hnd : async-cancel<e,a>) -> hnd/clause1<async-scope,(),async-cancel,e,a> */  {
  return hnd._fun_release_canceled_scope;
}
 
 
// marker cannot be discarded merely because its current host tasks stopped.
// Call the `fun release-canceled-scope` operation of the effect `:async-cancel`
export function release_canceled_scope(scope) /* (scope : async-scope) -> async-cancel () */  {
   
  var ev_10227 = $std_core_hnd._evv_at(0);
  return ev_10227.hnd._fun_release_canceled_scope(ev_10227.marker, ev_10227, scope);
}
 
 
// Automatically generated. Retrieves the `@fun-is-scope-canceled` constructor field of the `:async-cancel` type.
export function async_cancel_fs__fun_is_scope_canceled(_this) /* forall<e,a> (async-cancel<e,a>) -> hnd/clause1<async-scope,bool,async-cancel,e,a> */  {
  return _this._fun_is_scope_canceled;
}
 
 
// select `is-scope-canceled` operation out of effect `:async-cancel`
export function is_scope_canceled_fs__select(hnd) /* forall<e,a> (hnd : async-cancel<e,a>) -> hnd/clause1<async-scope,bool,async-cancel,e,a> */  {
  return hnd._fun_is_scope_canceled;
}
 
 
// Call the `fun is-scope-canceled` operation of the effect `:async-cancel`
export function is_scope_canceled(scope) /* (scope : async-scope) -> async-cancel bool */  {
   
  var ev_10230 = $std_core_hnd._evv_at(0);
  return ev_10230.hnd._fun_is_scope_canceled(ev_10230.marker, ev_10230, scope);
}
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:async-ioc` type.
export function async_ioc_fs__cfc(_this) /* forall<e,a> (async-ioc<e,a>) -> int */  {
  return _this._cfc;
}
 
 
// handler for the effect `:async-ioc`
export function async_ioc_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : async-ioc<e,b>, ret : (res : a) -> e b, action : () -> <async-ioc|e> a) -> e b */  {
  return $std_core_hnd._hhandle(async_ioc_fs__tag, hnd, ret, action);
}
 
 
// Automatically generated. Retrieves the `@fun-async-ioc` constructor field of the `:async-ioc` type.
export function async_ioc_fs__fun_async_ioc(_this) /* forall<e,a,b> (async-ioc<e,a>) -> hnd/clause1<() -> ui b,b,async-ioc,e,a> */  {
  return _this._fun_async_ioc;
}
 
 
// select `async-ioc` operation out of effect `:async-ioc`
export function async_ioc_fs__select(hnd) /* forall<a,e,b> (hnd : async-ioc<e,b>) -> hnd/clause1<() -> ui a,a,async-ioc,e,b> */  {
  return hnd._fun_async_ioc;
}
 
 
// Call the `fun async-ioc` operation of the effect `:async-ioc`
export function async_ioc(action) /* forall<a> (action : () -> ui a) -> async-ioc a */  {
   
  var ev_10234 = $std_core_hnd._evv_at(0);
  var _x0 = ev_10234.hnd._fun_async_ioc;
  return _x0(ev_10234.marker, ev_10234, action);
}
 
 
// Automatically generated. Retrieves the `@fun-async-schedule-ioc` constructor field of the `:async-ioc` type.
export function async_ioc_fs__fun_async_schedule_ioc(_this) /* forall<e,a> (async-ioc<e,a>) -> hnd/clause2<async-scope,() -> ui (),(),async-ioc,e,a> */  {
  return _this._fun_async_schedule_ioc;
}
 
 
// select `async-schedule-ioc` operation out of effect `:async-ioc`
export function async_schedule_ioc_fs__select(hnd) /* forall<e,a> (hnd : async-ioc<e,a>) -> hnd/clause2<async-scope,() -> ui (),(),async-ioc,e,a> */  {
  return hnd._fun_async_schedule_ioc;
}
 
 
// Call the `fun async-schedule-ioc` operation of the effect `:async-ioc`
export function async_schedule_ioc(scope, action) /* (scope : async-scope, action : () -> ui ()) -> async-ioc () */  {
   
  var evx_10237 = $std_core_hnd._evv_at(0);
  return evx_10237.hnd._fun_async_schedule_ioc(evx_10237.marker, evx_10237, scope, action);
}
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:async-ownership` type.
export function async_ownership_fs__cfc(_this) /* forall<e,a> (async-ownership<e,a>) -> int */  {
  return _this._cfc;
}
 
 
// handler for the effect `:async-ownership`
export function async_ownership_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : async-ownership<e,b>, ret : (res : a) -> e b, action : () -> <async-ownership|e> a) -> e b */  {
  return $std_core_hnd._hhandle(async_ownership_fs__tag, hnd, ret, action);
}
 
 
// Automatically generated. Retrieves the `@fun-async-own-disposer` constructor field of the `:async-ownership` type.
export function async_ownership_fs__fun_async_own_disposer(_this) /* forall<e,a> (async-ownership<e,a>) -> hnd/clause1<dispose-fn,ownership-release-fn,async-ownership,e,a> */  {
  return _this._fun_async_own_disposer;
}
 
 
// select `async-own-disposer` operation out of effect `:async-ownership`
export function async_own_disposer_fs__select(hnd) /* forall<e,a> (hnd : async-ownership<e,a>) -> hnd/clause1<dispose-fn,ownership-release-fn,async-ownership,e,a> */  {
  return hnd._fun_async_own_disposer;
}
 
 
// release action transfers ownership without running the disposer.
// Call the `fun async-own-disposer` operation of the effect `:async-ownership`
export function async_own_disposer(dispose) /* (dispose : dispose-fn) -> async-ownership ownership-release-fn */  {
   
  var ev_10242 = $std_core_hnd._evv_at(0);
  return ev_10242.hnd._fun_async_own_disposer(ev_10242.marker, ev_10242, dispose);
}
 
 
// Automatically generated. Retrieves the `ids` constructor field of the `:async-scope` type.
export function async_scope_fs_ids(_this) /* (async-scope) -> list<scope-id> */  {
  return _this.ids;
}
 
 
// Automatically generated. Retrieves the `scope-namespace` constructor field of the `:async-scope` type.
export function async_scope_fs_scope_namespace(_this) /* (async-scope) -> int */  {
  return _this.scope_namespace;
}
 
export function async_scope_fs__copy(_this, ids, scope_namespace) /* (async-scope, ids : ? (list<scope-id>), scope-namespace : ? int) -> async-scope */  {
  if (ids !== undefined) {
    var _x1 = ids;
  }
  else {
    var _x1 = _this.ids;
  }
  if (scope_namespace !== undefined) {
    var _x2 = scope_namespace;
  }
  else {
    var _x2 = _this.scope_namespace;
  }
  return Scope(_x1, _x2);
}
 
 
// Kokaine's browser runtime is single-threaded. Keep scope identity allocation
// behind total helpers just like the rest of its opaque generation metadata.
export var next_scope_id;
var next_scope_id = { value: 1 };
 
 
// The public root is used by standalone interpreters. Generation runtimes
// allocate separate cancellation namespaces from the same identity source.
export var root_scope;
var root_scope = Scope($std_core_types.Cons(0, $std_core_types.Nil), 0);
 
export function fresh_scope_id() /* () -> int */  {
   
  var current = next_scope_id.value;
   
  ((next_scope_id).value = ($std_core_types._int_add(current,1)));
  return current;
}
 
 
// Runtime support: every interpreter gets an isolated cancellation namespace.
export function new_runtime_scope_root() /* () -> async-scope */  {
   
  var current = next_scope_id.value;
   
  ((next_scope_id).value = ($std_core_types._int_add(current,1)));
  return Scope($std_core_types.Cons(0, $std_core_types.Nil), current);
}
 
export function async_scope_fs_show(_pat_x118__26) /* (async-scope) -> string */  {
   
  var xs_10004 = $std_core_list.map(_pat_x118__26.ids, $std_core_int.show);
  return $std_core_list.joinsep(xs_10004, "<");
}
 
export function await_result_fs_show(result, _implicit_fs_show) /* forall<a> (result : await-result<a>, ?show : (a) -> string) -> string */  {
  if (result._tag === 1) {
    return $std_core_types._lp__plus__plus__rp_("Result(", $std_core_types._lp__plus__plus__rp_(_implicit_fs_show(result.value), ")"));
  }
  else if (result._tag === 2) {
    var _x3 = result.error.message;
    return $std_core_types._lp__plus__plus__rp_("Exception(", $std_core_types._lp__plus__plus__rp_(_x3, ")"));
  }
  else {
    return "Cancel";
  }
}
 
export function new_child_scope(_pat_x121__25) /* (async-scope) -> async-scope */  {
   
  var current = next_scope_id.value;
   
  ((next_scope_id).value = ($std_core_types._int_add(current,1)));
  return Scope($std_core_types.Cons(current, _pat_x121__25.ids), _pat_x121__25.scope_namespace);
}
 
export function current_scope_id(_pat_x124__22) /* (async-scope) -> scope-id */  {
  return (_pat_x124__22.ids !== null) ? _pat_x124__22.ids.head : 0;
}
 
 
// Namespace membership is part of equality and ancestry even though hash keys
// are globally unique. Cancellation capabilities cannot cross runtimes.
export function async_scope_fs_same_namespace(left, right) /* (left : async-scope, right : async-scope) -> bool */  {
  return $std_core_types._int_eq((left.scope_namespace),(right.scope_namespace));
}
 
export function async_scope_fs__lp__eq__eq__rp_(left, right) /* (left : async-scope, right : async-scope) -> bool */  {
  if ($std_core_types._int_eq((left.scope_namespace),(right.scope_namespace))) {
    var _x4 = (left.ids !== null) ? left.ids.head : 0;
    var _x5 = (right.ids !== null) ? right.ids.head : 0;
    return $std_core_types._int_eq(_x4,_x5);
  }
  else {
    return false;
  }
}
 
 
// Runtime-root namespaces consume the same global ID source as children, so
// the root namespace and every non-root head ID are mutually unique hash keys.
export function async_scope_fs_identity_key(scope) /* (scope : async-scope) -> int */  {
  var _x7 = (scope.ids !== null) ? scope.ids.head : 0;
  var _x6 = $std_core_types._int_eq(_x7,0);
  if (_x6) {
    return scope.scope_namespace;
  }
  else {
    return (scope.ids !== null) ? scope.ids.head : 0;
  }
}
 
export function async_scope_fs_parent(_pat_x144__5) /* (async-scope) -> async-scope */  {
  if (_pat_x144__5.ids !== null && _pat_x144__5.ids.tail !== null) {
    return Scope(_pat_x144__5.ids.tail, _pat_x144__5.scope_namespace);
  }
  else {
    return Scope(_pat_x144__5.ids, _pat_x144__5.scope_namespace);
  }
}
 
 
// Is `child` the same scope as, or a descendant of, `ancestor`?
export function async_scope_fs_is_within(child, ancestor) /* (child : async-scope, ancestor : async-scope) -> bool */  {
   
  var b_10019 = $std_core_types._int_eq((child.scope_namespace),(ancestor.scope_namespace));
  if (b_10019) {
    return $std_core_list.any(child.ids, function(id /* scope-id */ ) {
        var _x8 = (ancestor.ids !== null) ? ancestor.ids.head : 0;
        return $std_core_types._int_eq(id,_x8);
      });
  }
  else {
    return false;
  }
}
 
export function async_scope_fs__lp__lt__eq__rp_(child, ancestor) /* (child : async-scope, ancestor : async-scope) -> bool */  {
  return async_scope_fs_is_within(child, ancestor);
}
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:discontinue` type.
export function discontinue_fs__cfc(discontinue_0) /* forall<e,a> (discontinue : discontinue<e,a>) -> int */  {
  return discontinue_0._cfc;
}
 
 
// handler for the effect `:discontinue`
export function discontinue_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : discontinue<e,b>, ret : (res : a) -> e b, action : () -> <discontinue|e> a) -> e b */  {
  return $std_core_hnd._hhandle(discontinue_fs__tag, hnd, ret, action);
}
 
 
// Automatically generated. Retrieves the `@brk-discontinue` constructor field of the `:discontinue` type.
export function discontinue_fs__brk_discontinue(discontinue_0) /* forall<e,a,b> (discontinue : discontinue<e,a>) -> hnd/clause0<b,discontinue,e,a> */  {
  return discontinue_0._brk_discontinue;
}
 
 
// select `discontinue` operation out of effect `:discontinue`
export function discontinue_fs__select(hnd) /* forall<a,e,b> (hnd : discontinue<e,b>) -> hnd/clause0<a,discontinue,e,b> */  {
  return hnd._brk_discontinue;
}
 
 
// operation still unwinds Koka `finally` clauses in the canceled strand.
// Call the `final ctl discontinue` operation of the effect `:discontinue`
export function discontinue() /* forall<a> () -> discontinue a */  {
   
  var ev_10246 = $std_core_hnd._evv_at(0);
  var _x9 = ev_10246.hnd._brk_discontinue;
  return _x9(ev_10246.marker, ev_10246);
}
 
 
// Perform browser-host work through the active generation interpreter.
export function async_host(action) /* forall<a> (action : () -> ui a) -> async a */  {
  return $std_core_hnd._open_at1(2, function(action_0 /* () -> ui 3418 */ ) {
       
      var ev_10248 = $std_core_hnd._evv_at(0);
      var _x10 = ev_10248.hnd._fun_async_ioc;
      return _x10(ev_10248.marker, ev_10248, action_0);
    }, action);
}
 
 
// monadic lift
export function _mlift_async_schedule_10201(action, _y_x10054) /* (action : () -> ui (), async-scope) -> <async-cancel,async-ioc,async-await,async-ownership,discontinue> () */  {
  return $std_core_hnd._open_at2(2, function(scope /* async-scope */ , action_0 /* () -> ui () */ ) {
       
      var evx_10251 = $std_core_hnd._evv_at(0);
      return evx_10251.hnd._fun_async_schedule_ioc(evx_10251.marker, evx_10251, scope, action_0);
    }, _y_x10054, action);
}
 
 
// Schedule browser work through the active generation interpreter.
export function async_schedule(action) /* (action : () -> ui ()) -> <async-await,async-cancel,async-ioc,async-ownership,discontinue> () */  {
   
  var x_10255 = $std_core_hnd._open_at0(1, function() {
       
      var ev_10258 = $std_core_hnd._evv_at(0);
      return ev_10258.hnd._val_async_scope(ev_10258.marker, ev_10258);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10054 /* async-scope */ ) {
      return _mlift_async_schedule_10201(action, _y_x10054);
    });
  }
  else {
    return $std_core_hnd._open_at2(2, function(scope /* async-scope */ , action_0 /* () -> ui () */ ) {
         
        var evx_10260 = $std_core_hnd._evv_at(0);
        return evx_10260.hnd._fun_async_schedule_ioc(evx_10260.marker, evx_10260, scope, action_0);
      }, x_10255, action);
  }
}
 
 
// monadic lift
export function _mlift_async_own_10202(release) /* (release : () -> ui bool) -> <async-ownership,async-await,async-cancel,async-ioc,discontinue> (() -> ui ()) */  {
  return function() {
     
    var _pat = release();
    return $std_core_types.Unit;
  };
}
 
 
// Acquire a lease for a host resource. By default it follows the reactive
// generation rather than a structured cancellation scope; a nearer structured
// or Resource ledger may further constrain or promote that lifetime.
export function async_own(dispose) /* (dispose : dispose-fn) -> <async-await,async-cancel,async-ioc,async-ownership,discontinue> dispose-fn */  {
   
  var x_10264 = $std_core_hnd._open_at1(3, function(dispose_0 /* dispose-fn */ ) {
       
      var ev_10267 = $std_core_hnd._evv_at(0);
      return ev_10267.hnd._fun_async_own_disposer(ev_10267.marker, ev_10267, dispose_0);
    }, dispose);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_async_own_10202);
  }
  else {
    return function() {
       
      var _pat_3_0 = x_10264();
      return $std_core_types.Unit;
    };
  }
}
 
export function error_fs_await_result(result) /* forall<a> (result : error<a>) -> await-result<a> */  {
  if (result._tag === 2) {
    return Result(result.value);
  }
  else {
    return Exception(result.error);
  }
}
 
 
// This is the single conversion point for cancellation. It performs final
// control rather than returning an error value or throwing an exception.
export function await_result_fs_error(result, label) /* forall<a> (result : await-result<a>, label : ? string) -> discontinue error<a> */  {
  if (result._tag === 1) {
    return $std_core_types.Ok(result.value);
  }
  else if (result._tag === 2) {
    return $std_core_types.$Error(result.error);
  }
  else {
     
    var ev_10270 = $std_core_hnd._evv_at(0);
    var _x11 = ev_10270.hnd._brk_discontinue;
    return _x11(ev_10270.marker, ev_10270);
  }
}
 
 
// monadic lift
export function setup_fs__mlift_await_error1_10203(label, result_0) /* forall<a> (label : ? string, result@0 : await-result<a>) -> <async-await,async-cancel,discontinue,async-ioc,async-ownership> error<a> */  {
  var _x12 = (label !== undefined) ? label : "";
  return $std_core_hnd._open_at2(4, await_result_fs_error, result_0, _x12);
}
 
 
// monadic lift
export function setup_fs__mlift_await_error1_10204(label, setup, _y_x10062) /* forall<a> (label : ? string, setup : ((error<a>) -> ui ()) -> ui error<dispose-fn>, async-scope) -> <async-cancel,async-await,discontinue,async-ioc,async-ownership> error<a> */  {
   
  var _x14 = (label !== undefined) ? label : "";
  var x_10272 = $std_core_hnd._open_at3(0, function(setup_0 /* await-setup<3641> */ , scope /* async-scope */ , label_0 /* string */ ) {
      return $std_core_hnd._perform3($std_core_hnd._evv_at(0), do_await_fs__select, setup_0, scope, label_0);
    }, function(complete /* (await-result<3641>, bool) -> ui () */ ) {
      return setup(function(value /* error<3641> */ ) {
        if (value._tag === 2) {
          var _x13 = Result(value.value);
        }
        else {
          var _x13 = Exception(value.error);
        }
        return complete(_x13, true);
      });
    }, _y_x10062, _x14);
   
  function next_10273(result_0) /* (await-result<3641>) -> <async-await,async-cancel,discontinue,async-ioc,async-ownership> error<3641> */  {
    var _x15 = (label !== undefined) ? label : "";
    return $std_core_hnd._open_at2(4, await_result_fs_error, result_0, _x15);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10273);
  }
  else {
    return next_10273(x_10272);
  }
}
 
 
// Variant whose completion callback already carries `error<a>`.
export function setup_fs_await_error1(label, setup) /* forall<a> (label : ? string, setup : ((error<a>) -> ui ()) -> ui error<dispose-fn>) -> async error<a> */  {
   
  var x_10276 = $std_core_hnd._open_at0(1, function() {
       
      var ev_10279 = $std_core_hnd._evv_at(0);
      return ev_10279.hnd._val_async_scope(ev_10279.marker, ev_10279);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10062 /* async-scope */ ) {
      return setup_fs__mlift_await_error1_10204(label, setup, _y_x10062);
    });
  }
  else {
     
    var _x14 = (label !== undefined) ? label : "";
    var x_0_10281 = $std_core_hnd._open_at3(0, function(setup_0 /* await-setup<3641> */ , scope /* async-scope */ , label_0 /* string */ ) {
        return $std_core_hnd._perform3($std_core_hnd._evv_at(0), do_await_fs__select, setup_0, scope, label_0);
      }, function(complete /* (await-result<3641>, bool) -> ui () */ ) {
        return setup(function(value /* error<3641> */ ) {
          if (value._tag === 2) {
            var _x13 = Result(value.value);
          }
          else {
            var _x13 = Exception(value.error);
          }
          return complete(_x13, true);
        });
      }, x_10276, _x14);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(result_0 /* await-result<3641> */ ) {
        var _x13 = (label !== undefined) ? label : "";
        return $std_core_hnd._open_at2(4, await_result_fs_error, result_0, _x13);
      });
    }
    else {
      var _x14 = (label !== undefined) ? label : "";
      return $std_core_hnd._open_at2(4, await_result_fs_error, x_0_10281, _x14);
    }
  }
}
 
 
// monadic lift
export function setup_fs__mlift_await_10205(_y_x10065) /* forall<a> (error<a>) -> <async-await,async-cancel,async-ioc,async-ownership,discontinue,exn> a */  {
  return $std_core_hnd._open_at1(5, $std_core_exn.untry, _y_x10065);
}
 
 
// Await a setup whose completion callback carries an `error<a>`.
export function setup_fs_await(label, setup) /* forall<a> (label : ? string, setup : ((error<a>) -> ui ()) -> ui error<dispose-fn>) -> <async,exn> a */  {
   
  var _x15 = (label !== undefined) ? label : "";
  var x_10286 = $std_core_hnd._open2($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Nil)))))), setup_fs_await_error1, _x15, setup);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10065 /* error<3684> */ ) {
      return $std_core_hnd._open_at1(5, $std_core_exn.untry, _y_x10065);
    });
  }
  else {
    return $std_core_hnd._open_at1(5, $std_core_exn.untry, x_10286);
  }
}
 
 
// monadic lift
export function _mlift_await1_10206(_y_x10067) /* forall<a> (error<a>) -> <async-await,async-cancel,async-ioc,async-ownership,discontinue,exn> a */  {
  return $std_core_hnd._open_at1(5, $std_core_exn.untry, _y_x10067);
}
 
 
// Await a callback whose setup may fail and which returns a real disposer.
export function await1(label, setup) /* forall<a> (label : ? string, setup : ((a) -> ui ()) -> ui error<dispose-fn>) -> <async,exn> a */  {
   
  var _x15 = (label !== undefined) ? label : "";
  var x_10290 = $std_core_hnd._open2($std_core_vector.unvlist($std_core_types.Cons(0, $std_core_types.Cons(1, $std_core_types.Cons(2, $std_core_types.Cons(3, $std_core_types.Cons(4, $std_core_types.Nil)))))), setup_fs_await_error1, _x15, function(complete /* (error<3738>) -> ui () */ ) {
      return setup(function(value /* 3738 */ ) {
        return complete($std_core_types.Ok(value));
      });
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10067 /* error<3738> */ ) {
      return $std_core_hnd._open_at1(5, $std_core_exn.untry, _y_x10067);
    });
  }
  else {
    return $std_core_hnd._open_at1(5, $std_core_exn.untry, x_10290);
  }
}
 
export function await0(label, setup) /* (label : ? string, setup : (() -> ui ()) -> ui error<dispose-fn>) -> <async-await,async-cancel,async-ioc,async-ownership,discontinue,exn> () */  {
  var _x15 = (label !== undefined) ? label : "";
  return await1(_x15, function(resume /* (()) -> ui () */ ) {
      return setup(function() {
        return resume($std_core_types.Unit);
      });
    });
}
 
 
// monadic lift
export function setup_fs__mlift_await_error_10207(label, result) /* forall<a> (label : ? string, result : await-result<a>) -> <async-await,async-cancel,discontinue,async-ioc,async-ownership> error<a> */  {
  var _x16 = (label !== undefined) ? label : "";
  return $std_core_hnd._open_at2(4, await_result_fs_error, result, _x16);
}
 
 
// monadic lift
export function setup_fs__mlift_await_error_10208(label, setup, _y_x10072) /* forall<a> (label : ? string, setup : ((a) -> ui ()) -> ui error<dispose-fn>, async-scope) -> <async-cancel,async-await,discontinue,async-ioc,async-ownership> error<a> */  {
   
  var _x17 = (label !== undefined) ? label : "";
  var x_10294 = $std_core_hnd._open_at3(0, function(setup_0 /* await-setup<3858> */ , scope /* async-scope */ , label_0 /* string */ ) {
      return $std_core_hnd._perform3($std_core_hnd._evv_at(0), do_await_fs__select, setup_0, scope, label_0);
    }, function(complete /* (await-result<3858>, bool) -> ui () */ ) {
      return setup(function(value /* 3858 */ ) {
        return complete(Result(value), true);
      });
    }, _y_x10072, _x17);
   
  function next_10295(result) /* (await-result<3858>) -> <async-await,async-cancel,discontinue,async-ioc,async-ownership> error<3858> */  {
    var _x18 = (label !== undefined) ? label : "";
    return $std_core_hnd._open_at2(4, await_result_fs_error, result, _x18);
  }
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(next_10295);
  }
  else {
    return next_10295(x_10294);
  }
}
 
 
// Await a plain completion and preserve asynchronous exceptions as an
// explicit `error<a>`. Cancellation still discontinues the strand.
export function setup_fs_await_error(label, setup) /* forall<a> (label : ? string, setup : ((a) -> ui ()) -> ui error<dispose-fn>) -> async error<a> */  {
   
  var x_10298 = $std_core_hnd._open_at0(1, function() {
       
      var ev_10301 = $std_core_hnd._evv_at(0);
      return ev_10301.hnd._val_async_scope(ev_10301.marker, ev_10301);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10072 /* async-scope */ ) {
      return setup_fs__mlift_await_error_10208(label, setup, _y_x10072);
    });
  }
  else {
     
    var _x17 = (label !== undefined) ? label : "";
    var x_0_10303 = $std_core_hnd._open_at3(0, function(setup_0 /* await-setup<3858> */ , scope /* async-scope */ , label_0 /* string */ ) {
        return $std_core_hnd._perform3($std_core_hnd._evv_at(0), do_await_fs__select, setup_0, scope, label_0);
      }, function(complete /* (await-result<3858>, bool) -> ui () */ ) {
        return setup(function(value /* 3858 */ ) {
          return complete(Result(value), true);
        });
      }, x_10298, _x17);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(result /* await-result<3858> */ ) {
        var _x17 = (label !== undefined) ? label : "";
        return $std_core_hnd._open_at2(4, await_result_fs_error, result, _x17);
      });
    }
    else {
      var _x18 = (label !== undefined) ? label : "";
      return $std_core_hnd._open_at2(4, await_result_fs_error, x_0_10303, _x18);
    }
  }
}
 
 
// monadic lift
export function setup_fs__mlift_await_noexn_10209(result) /* forall<a> (result : error<a>) -> async a */  {
  if (result._tag === 2) {
    return result.value;
  }
  else {
    return $std_core_debug.impossible($std_core_types._lp__plus__plus__rp_("unexpected exception from non-throwing async await: ", $std_core_hnd._open_none1(function(exn /* exception */ ) {
            return exn.message;
          }, result.error)), $std_core_types._lp__plus__plus__rp_("kokaine/async/effects.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(241), ")"))));
  }
}
 
 
// Primitive wrapper for setup functions which return plain values and a
// disposer but cannot fail during setup or completion.
export function setup_fs_await_noexn(label, setup) /* forall<a> (label : ? string, setup : ((a) -> ui ()) -> ui dispose-fn) -> async a */  {
   
  var _x19 = (label !== undefined) ? label : "";
  var x_10308 = setup_fs_await_error(_x19, function(complete /* (3963) -> ui () */ ) {
      return $std_core_types.Ok(setup(complete));
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(result /* error<3963> */ ) {
      return setup_fs__mlift_await_noexn_10209(result);
    });
  }
  else {
    if (x_10308._tag === 2) {
      return x_10308.value;
    }
    else {
      return $std_core_debug.impossible($std_core_types._lp__plus__plus__rp_("unexpected exception from non-throwing async await: ", $std_core_hnd._open_none1(function(exn /* exception */ ) {
              return exn.message;
            }, x_10308.error)), $std_core_types._lp__plus__plus__rp_("kokaine/async/effects.kk", $std_core_types._lp__plus__plus__rp_("(", $std_core_types._lp__plus__plus__rp_($std_core_int.show(241), ")"))));
    }
  }
}
 
export function await1_noexn(label, setup) /* forall<a> (label : ? string, setup : ((a) -> ui ()) -> ui ()) -> async a */  {
  var _x19 = (label !== undefined) ? label : "";
  return setup_fs_await_noexn(_x19, function(complete /* (4005) -> ui () */ ) {
       
      setup(complete);
      return function() {
        return $std_core_types.Unit;
      };
    });
}
 
export function await0_noexn(label, setup) /* (label : ? string, setup : (() -> ui ()) -> ui ()) -> <async-await,async-cancel,async-ioc,async-ownership,discontinue> () */  {
  var _x20 = (label !== undefined) ? label : "";
  return setup_fs_await_noexn(_x20, function(complete /* (()) -> ui () */ ) {
       
      setup(function() {
        return complete($std_core_types.Unit);
      });
      return function() {
        return $std_core_types.Unit;
      };
    });
}
 
 
// monadic lift
export function _mlift_cancel_outstanding_10210(scope_10030) /* (scope@10030 : async-scope) -> async-cancel () */  {
   
  var ev_10311 = $std_core_hnd._evv_at(0);
  return ev_10311.hnd._fun_cancel_scope(ev_10311.marker, ev_10311, scope_10030);
}
 
export function cancel_outstanding() /* () -> async-cancel () */  {
   
  var ev_10317 = $std_core_hnd._evv_at(0);
   
  var x_10314 = ev_10317.hnd._val_async_scope(ev_10317.marker, ev_10317);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_cancel_outstanding_10210);
  }
  else {
     
    var ev_0_10319 = $std_core_hnd._evv_at(0);
    return ev_0_10319.hnd._fun_cancel_scope(ev_0_10319.marker, ev_0_10319, x_10314);
  }
}
 
 
// monadic lift
export function _mlift_is_canceled_10211(scope_10031) /* (scope@10031 : async-scope) -> async-cancel bool */  {
   
  var ev_10322 = $std_core_hnd._evv_at(0);
  return ev_10322.hnd._fun_is_scope_canceled(ev_10322.marker, ev_10322, scope_10031);
}
 
export function is_canceled() /* () -> async-cancel bool */  {
   
  var ev_10328 = $std_core_hnd._evv_at(0);
   
  var x_10325 = ev_10328.hnd._val_async_scope(ev_10328.marker, ev_10328);
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(_mlift_is_canceled_10211);
  }
  else {
     
    var ev_0_10330 = $std_core_hnd._evv_at(0);
    return ev_0_10330.hnd._fun_is_scope_canceled(ev_0_10330.marker, ev_0_10330, x_10325);
  }
}
 
 
// monadic lift
export function _mlift_cancelation_scope_10212(scope, _c_x10087) /* forall<h,e> (scope : async-scope, ()) -> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_0 /* async-scope */ ) {
       
      var ev_10333 = $std_core_hnd._evv_at(0);
      return ev_10333.hnd._fun_cancel_scope(ev_10333.marker, ev_10333, scope_0);
    }, scope);
}
 
 
// monadic lift
export function _mlift_cancelation_scope_10213(scope_0_0, _y_x10090) /* forall<h,e> (scope@0@0 : async-scope, bool) -> <local<h>,async-cancel,async-await,async-ioc,async-ownership,discontinue|e> bool */  {
  if (_y_x10090) {
    return true;
  }
  else {
    return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_1 /* async-scope */ ) {
         
        var ev_10336 = $std_core_hnd._evv_at(0);
        return ev_10336.hnd._fun_is_scope_canceled(ev_10336.marker, ev_10336, scope_1);
      }, scope_0_0);
  }
}
 
 
// monadic lift
export function _mlift_cancelation_scope_10214(scope_1_0, _c_x10098) /* forall<h,e> (scope@1@0 : async-scope, ()) -> () */  {
  return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_3 /* async-scope */ ) {
       
      var ev_10339 = $std_core_hnd._evv_at(0);
      return ev_10339.hnd._fun_release_canceled_scope(ev_10339.marker, ev_10339, scope_3);
    }, scope_1_0);
}
 
 
// monadic lift
export function _mlift_cancelation_scope_10215(action, child, _y_x10101) /* forall<h,a,e> (action : () -> <async|e> a, child : async-scope, hnd/ev-index) -> <async-cancel,async-cancel,local<h>,async-await,async-ioc,async-ownership,discontinue|e> a */  {
  return $std_core_hnd._mask_at(_y_x10101, true, function() {
      return $std_core_hnd.finally_prompt(function() {
          return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_4 /* async-scope */ ) {
               
              var ev_10344 = $std_core_hnd._evv_at(0);
              return ev_10344.hnd._fun_release_canceled_scope(ev_10344.marker, ev_10344, scope_4);
            }, child);
        }, action());
    });
}
 
 
// monadic lift
export function _mlift_cancelation_scope_10216(action, _y_x10085) /* forall<_e,h,a,e1> (action : () -> <async|e1> a, async-scope) -> <async-cancel,async-await,async-ioc,async-ownership,discontinue,local<h>|e1> a */  {
   
  var child = $std_core_hnd._open_none1(function(_pat_x121__25 /* async-scope */ ) {
       
      var current = next_scope_id.value;
       
      ((next_scope_id).value = ($std_core_types._int_add(current,1)));
      return Scope($std_core_types.Cons(current, _pat_x121__25.ids), _pat_x121__25.scope_namespace);
    }, _y_x10085);
   
  var loc = { value: false };
   
  var res = async_cancel_fs__handle(_Hnd_async_cancel(1, $std_core_hnd.clause_tail0(function() {
        return child;
      }), $std_core_hnd.clause_tail1(function(scope /* async-scope */ ) {
         
        var _x21 = $std_core_hnd._open_none2(async_scope_fs__lp__eq__eq__rp_, scope, child);
        if (_x21) {
          var x_10350 = ((loc).value = true);
        }
        else {
          var x_10350 = $std_core_types.Unit;
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_c_x10087 /* () */ ) {
            return _mlift_cancelation_scope_10212(scope, _c_x10087);
          });
        }
        else {
          return _mlift_cancelation_scope_10212(scope, x_10350);
        }
      }), $std_core_hnd.clause_tail1(function(scope_0_0 /* async-scope */ ) {
        var _x21 = $std_core_hnd._open_none2(async_scope_fs_is_within, scope_0_0, child);
        if (_x21) {
           
          var x_0_10352 = ((loc).value);
          if ($std_core_hnd._yielding()) {
            return $std_core_hnd.yield_extend(function(_y_x10090 /* bool */ ) {
              return _mlift_cancelation_scope_10213(scope_0_0, _y_x10090);
            });
          }
          else {
            return _mlift_cancelation_scope_10213(scope_0_0, x_0_10352);
          }
        }
        else {
          return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_2 /* async-scope */ ) {
               
              var ev_10354 = $std_core_hnd._evv_at(0);
              return ev_10354.hnd._fun_is_scope_canceled(ev_10354.marker, ev_10354, scope_2);
            }, scope_0_0);
        }
      }), $std_core_hnd.clause_tail1(function(scope_1_0 /* async-scope */ ) {
         
        var _x22 = $std_core_hnd._open_none2(async_scope_fs__lp__eq__eq__rp_, scope_1_0, child);
        if (_x22) {
          var x_2_10357 = ((loc).value = false);
        }
        else {
          var x_2_10357 = $std_core_types.Unit;
        }
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_c_x10098 /* () */ ) {
            return _mlift_cancelation_scope_10214(scope_1_0, _c_x10098);
          });
        }
        else {
          return _mlift_cancelation_scope_10214(scope_1_0, x_2_10357);
        }
      })), function(_res /* 4614 */ ) {
      return _res;
    }, function() {
       
      var x_3_10359 = $std_core_hnd._evv_index(async_cancel_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10101 /* hnd/ev-index */ ) {
          return _mlift_cancelation_scope_10215(action, child, _y_x10101);
        });
      }
      else {
        return _mlift_cancelation_scope_10215(action, child, x_3_10359);
      }
    });
  return $std_core_hnd.prompt_local_var(loc, res);
}
 
export function cancelation_scope(action) /* forall<a,e> (action : () -> <async|e> a) -> <async|e> a */  {
  return function() {
     
    var x_10361 = $std_core_hnd._open_at0($std_core_hnd._evv_index(async_cancel_fs__tag), function() {
         
        var ev_10363 = $std_core_hnd._evv_at(0);
        return ev_10363.hnd._val_async_scope(ev_10363.marker, ev_10363);
      });
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(function(_y_x10085 /* async-scope */ ) {
        return _mlift_cancelation_scope_10216(action, _y_x10085);
      });
    }
    else {
      return _mlift_cancelation_scope_10216(action, x_10361);
    }
  }();
}
 
 
// monadic lift
export function _mlift_in_parent_scope_10217(action, _y_x10118) /* forall<a,e> (action : () -> <async|e> a, hnd/ev-index) -> <async-cancel,async-cancel,async-await,async-ioc,async-ownership,discontinue|e> a */  {
  return $std_core_hnd._mask_at(_y_x10118, true, action);
}
 
 
// monadic lift
export function _mlift_in_parent_scope_10218(action, _y_x10111) /* forall<a,e> (action : () -> <async|e> a, async-scope) -> <async-cancel,async-await,async-ioc,async-ownership,discontinue|e> a */  {
   
  var _value_async_scope_l330_c9 = $std_core_hnd._open_none1(function(_pat_x144__5 /* async-scope */ ) {
      if (_pat_x144__5.ids !== null && _pat_x144__5.ids.tail !== null) {
        return Scope(_pat_x144__5.ids.tail, _pat_x144__5.scope_namespace);
      }
      else {
        return Scope(_pat_x144__5.ids, _pat_x144__5.scope_namespace);
      }
    }, _y_x10111);
  return async_cancel_fs__handle(_Hnd_async_cancel(1, $std_core_hnd.clause_tail0(function() {
        return _value_async_scope_l330_c9;
      }), $std_core_hnd.clause_tail1(function(scope /* async-scope */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_0 /* async-scope */ ) {
             
            var ev_10365 = $std_core_hnd._evv_at(0);
            return ev_10365.hnd._fun_cancel_scope(ev_10365.marker, ev_10365, scope_0);
          }, scope);
      }), $std_core_hnd.clause_tail1(function(scope_0_0 /* async-scope */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_1 /* async-scope */ ) {
             
            var ev_0_10368 = $std_core_hnd._evv_at(0);
            return ev_0_10368.hnd._fun_is_scope_canceled(ev_0_10368.marker, ev_0_10368, scope_1);
          }, scope_0_0);
      }), $std_core_hnd.clause_tail1(function(scope_1_0 /* async-scope */ ) {
        return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_2 /* async-scope */ ) {
             
            var ev_1_10371 = $std_core_hnd._evv_at(0);
            return ev_1_10371.hnd._fun_release_canceled_scope(ev_1_10371.marker, ev_1_10371, scope_2);
          }, scope_1_0);
      })), function(_res /* 4803 */ ) {
      return _res;
    }, function() {
       
      var x_2_10374 = $std_core_hnd._evv_index(async_cancel_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10118 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10118, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_2_10374, true, action);
      }
    });
}
 
 
// Splice an action into the surrounding scope. Structured combinators use
// this for bookkeeping which must outlive a nested child cancellation.
export function in_parent_scope(action) /* forall<a,e> (action : () -> <async|e> a) -> <async|e> a */  {
   
  var x_10378 = $std_core_hnd._open_at0($std_core_hnd._evv_index(async_cancel_fs__tag), function() {
       
      var ev_10381 = $std_core_hnd._evv_at(0);
      return ev_10381.hnd._val_async_scope(ev_10381.marker, ev_10381);
    });
  if ($std_core_hnd._yielding()) {
    return $std_core_hnd.yield_extend(function(_y_x10111 /* async-scope */ ) {
      return _mlift_in_parent_scope_10218(action, _y_x10111);
    });
  }
  else {
     
    var _value_async_scope_l330_c9 = $std_core_hnd._open_none1(function(_pat_x144__5 /* async-scope */ ) {
        if (_pat_x144__5.ids !== null && _pat_x144__5.ids.tail !== null) {
          return Scope(_pat_x144__5.ids.tail, _pat_x144__5.scope_namespace);
        }
        else {
          return Scope(_pat_x144__5.ids, _pat_x144__5.scope_namespace);
        }
      }, x_10378);
    return async_cancel_fs__handle(_Hnd_async_cancel(1, $std_core_hnd.clause_tail0(function() {
          return _value_async_scope_l330_c9;
        }), $std_core_hnd.clause_tail1(function(scope /* async-scope */ ) {
          return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_0 /* async-scope */ ) {
               
              var ev_0_10383 = $std_core_hnd._evv_at(0);
              return ev_0_10383.hnd._fun_cancel_scope(ev_0_10383.marker, ev_0_10383, scope_0);
            }, scope);
        }), $std_core_hnd.clause_tail1(function(scope_0_0 /* async-scope */ ) {
          return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_1 /* async-scope */ ) {
               
              var ev_1_10386 = $std_core_hnd._evv_at(0);
              return ev_1_10386.hnd._fun_is_scope_canceled(ev_1_10386.marker, ev_1_10386, scope_1);
            }, scope_0_0);
        }), $std_core_hnd.clause_tail1(function(scope_1_0 /* async-scope */ ) {
          return $std_core_hnd._open_at1($std_core_hnd._evv_index(async_cancel_fs__tag), function(scope_2 /* async-scope */ ) {
               
              var ev_2_10389 = $std_core_hnd._evv_at(0);
              return ev_2_10389.hnd._fun_release_canceled_scope(ev_2_10389.marker, ev_2_10389, scope_2);
            }, scope_1_0);
        })), function(_res /* 4803 */ ) {
        return _res;
      }, function() {
         
        var x_3_10392 = $std_core_hnd._evv_index(async_cancel_fs__tag);
        if ($std_core_hnd._yielding()) {
          return $std_core_hnd.yield_extend(function(_y_x10118 /* hnd/ev-index */ ) {
            return $std_core_hnd._mask_at(_y_x10118, true, action);
          });
        }
        else {
          return $std_core_hnd._mask_at(x_3_10392, true, action);
        }
      });
  }
}
 
 
// monadic lift
export function _mlift_unsafe_uncancel_10219(action, _y_x10121) /* forall<a,e> (action : () -> <async|e> a, hnd/ev-index) -> <discontinue,discontinue,async-await,async-cancel,async-ioc,async-ownership|e> a */  {
  return $std_core_hnd._mask_at(_y_x10121, true, action);
}
 
 
// Internal escape hatch for structured combinators which must observe a
// canceled strand while still draining sibling finalizers. Application code
// should not suppress cancellation.
export function unsafe_uncancel(action) /* forall<a,e> (action : () -> <async|e> a) -> <async|e> maybe<a> */  {
  return discontinue_fs__handle(_Hnd_discontinue(0, function(m /* hnd/marker<<discontinue,async-await,async-cancel,async-ioc,async-ownership|4932>,maybe<4931>> */ , ___wildcard_x701__16 /* hnd/ev<discontinue> */ ) {
        return $std_core_hnd.yield_to_final(m, function(___wildcard_x701__43 /* (hnd/resume-result<4893,maybe<4931>>) -> <discontinue,async-await,async-cancel,async-ioc,async-ownership|4932> maybe<4931> */ ) {
            return $std_core_types.Nothing;
          });
      }), function(value /* 4931 */ ) {
      return $std_core_types.Just(value);
    }, function() {
       
      var x_10397 = $std_core_hnd._evv_index(discontinue_fs__tag);
      if ($std_core_hnd._yielding()) {
        return $std_core_hnd.yield_extend(function(_y_x10121 /* hnd/ev-index */ ) {
          return $std_core_hnd._mask_at(_y_x10121, true, action);
        });
      }
      else {
        return $std_core_hnd._mask_at(x_10397, true, action);
      }
    });
}