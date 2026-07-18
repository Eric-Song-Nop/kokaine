// Koka generated module: kokaine/reactive/effects, koka version: 3.2.4
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
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
 
// externals
 
// type declarations
 
 
// runtime tag for the effect `:signal-read`
export var signal_read_fs__tag;
var signal_read_fs__tag = "signal-read@effects";
 
 
// runtime tag for the effect `:signal-write`
export var signal_write_fs__tag;
var signal_write_fs__tag = "signal-write@effects";
// type signal-read
export function _Hnd_signal_read(_cfc, _ctl_read_source, _fun_validate_derived) /* forall<e,a> (int, forall<b> hnd/clause1<(kokaine/reactive/internal/model/source<b>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>),b,signal-read,e,a>, hnd/clause1<kokaine/reactive/internal/model/derive-producer,(),signal-read,e,a>) -> signal-read<e,a> */  {
  return { _cfc: _cfc, _ctl_read_source: _ctl_read_source, _fun_validate_derived: _fun_validate_derived };
}
// type signal-write
export function _Hnd_signal_write(_cfc, _fun_enter_batch, _fun_leave_batch, _fun_modify_source, _fun_request_flush, _fun_write_source) /* forall<e,a> (int, hnd/clause1<kokaine/reactive/internal/model/root-key,(),signal-write,e,a>, hnd/clause1<kokaine/reactive/internal/model/root-key,(),signal-write,e,a>, forall<b> hnd/clause2<kokaine/reactive/internal/model/source<b>,(b) -> b,(),signal-write,e,a>, hnd/clause1<kokaine/reactive/internal/model/root-key,(),signal-write,e,a>, forall<b> hnd/clause2<kokaine/reactive/internal/model/source<b>,b,(),signal-write,e,a>) -> signal-write<e,a> */  {
  return { _cfc: _cfc, _fun_enter_batch: _fun_enter_batch, _fun_leave_batch: _fun_leave_batch, _fun_modify_source: _fun_modify_source, _fun_request_flush: _fun_request_flush, _fun_write_source: _fun_write_source };
}
 
// declarations
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:signal-read` type.
export function signal_read_fs__cfc(_this) /* forall<e,a> (signal-read<e,a>) -> int */  {
  return _this._cfc;
}
 
 
// handler for the effect `:signal-read`
export function signal_read_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : signal-read<e,b>, ret : (res : a) -> e b, action : () -> <signal-read|e> a) -> e b */  {
  return $std_core_hnd._hhandle(signal_read_fs__tag, hnd, ret, action);
}
 
 
// Automatically generated. Retrieves the `@fun-validate-derived` constructor field of the `:signal-read` type.
export function signal_read_fs__fun_validate_derived(_this) /* forall<e,a> (signal-read<e,a>) -> hnd/clause1<kokaine/reactive/internal/model/derive-producer,(),signal-read,e,a> */  {
  return _this._fun_validate_derived;
}
 
 
// select `validate-derived` operation out of effect `:signal-read`
export function validate_derived_fs__select(hnd) /* forall<e,a> (hnd : signal-read<e,a>) -> hnd/clause1<kokaine/reactive/internal/model/derive-producer,(),signal-read,e,a> */  {
  return hnd._fun_validate_derived;
}
 
 
// Call the `fun validate-derived` operation of the effect `:signal-read`
export function validate_derived(producer) /* (producer : kokaine/reactive/internal/model/derive-producer) -> signal-read () */  {
   
  var ev_10010 = $std_core_hnd._evv_at(0);
  return ev_10010.hnd._fun_validate_derived(ev_10010.marker, ev_10010, producer);
}
 
 
// Automatically generated. Retrieves the `@ctl-read-source` constructor field of the `:signal-read` type.
export function signal_read_fs__ctl_read_source(_this) /* forall<e,a,b> (signal-read<e,a>) -> hnd/clause1<(kokaine/reactive/internal/model/source<b>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>),b,signal-read,e,a> */  {
  return _this._ctl_read_source;
}
 
 
// select `read-source` operation out of effect `:signal-read`
export function read_source_fs__select(hnd) /* forall<a,e,b> (hnd : signal-read<e,b>) -> hnd/clause1<(kokaine/reactive/internal/model/source<a>, kokaine/reactive/internal/model/read-mode, maybe<kokaine/reactive/internal/model/derive-producer>),a,signal-read,e,b> */  {
  return hnd._ctl_read_source;
}
 
 
// Call the `ctl read-source` operation of the effect `:signal-read`
export function read_source(source, mode, producer) /* forall<a> (source : kokaine/reactive/internal/model/source<a>, mode : kokaine/reactive/internal/model/read-mode, producer : maybe<kokaine/reactive/internal/model/derive-producer>) -> signal-read a */  {
  return $std_core_hnd._perform3($std_core_hnd._evv_at(0), read_source_fs__select, source, mode, producer);
}
 
 
// Automatically generated. Retrieves the `@cfc` constructor field of the `:signal-write` type.
export function signal_write_fs__cfc(_this) /* forall<e,a> (signal-write<e,a>) -> int */  {
  return _this._cfc;
}
 
 
// handler for the effect `:signal-write`
export function signal_write_fs__handle(hnd, ret, action) /* forall<a,e,b> (hnd : signal-write<e,b>, ret : (res : a) -> e b, action : () -> <signal-write|e> a) -> e b */  {
  return $std_core_hnd._hhandle(signal_write_fs__tag, hnd, ret, action);
}
 
 
// Automatically generated. Retrieves the `@fun-write-source` constructor field of the `:signal-write` type.
export function signal_write_fs__fun_write_source(_this) /* forall<e,a,b> (signal-write<e,a>) -> hnd/clause2<kokaine/reactive/internal/model/source<b>,b,(),signal-write,e,a> */  {
  return _this._fun_write_source;
}
 
 
// select `write-source` operation out of effect `:signal-write`
export function write_source_fs__select(hnd) /* forall<a,e,b> (hnd : signal-write<e,b>) -> hnd/clause2<kokaine/reactive/internal/model/source<a>,a,(),signal-write,e,b> */  {
  return hnd._fun_write_source;
}
 
 
// Call the `fun write-source` operation of the effect `:signal-write`
export function write_source(source, value) /* forall<a> (source : kokaine/reactive/internal/model/source<a>, value : a) -> signal-write () */  {
   
  var evx_10014 = $std_core_hnd._evv_at(0);
  var _x0 = evx_10014.hnd._fun_write_source;
  return _x0(evx_10014.marker, evx_10014, source, value);
}
 
 
// Automatically generated. Retrieves the `@fun-modify-source` constructor field of the `:signal-write` type.
export function signal_write_fs__fun_modify_source(_this) /* forall<e,a,b> (signal-write<e,a>) -> hnd/clause2<kokaine/reactive/internal/model/source<b>,(b) -> b,(),signal-write,e,a> */  {
  return _this._fun_modify_source;
}
 
 
// select `modify-source` operation out of effect `:signal-write`
export function modify_source_fs__select(hnd) /* forall<a,e,b> (hnd : signal-write<e,b>) -> hnd/clause2<kokaine/reactive/internal/model/source<a>,(a) -> a,(),signal-write,e,b> */  {
  return hnd._fun_modify_source;
}
 
 
// Call the `fun modify-source` operation of the effect `:signal-write`
export function modify_source(source, update) /* forall<a> (source : kokaine/reactive/internal/model/source<a>, update : (a) -> a) -> signal-write () */  {
   
  var evx_10018 = $std_core_hnd._evv_at(0);
  var _x1 = evx_10018.hnd._fun_modify_source;
  return _x1(evx_10018.marker, evx_10018, source, update);
}
 
 
// Automatically generated. Retrieves the `@fun-enter-batch` constructor field of the `:signal-write` type.
export function signal_write_fs__fun_enter_batch(_this) /* forall<e,a> (signal-write<e,a>) -> hnd/clause1<kokaine/reactive/internal/model/root-key,(),signal-write,e,a> */  {
  return _this._fun_enter_batch;
}
 
 
// select `enter-batch` operation out of effect `:signal-write`
export function enter_batch_fs__select(hnd) /* forall<e,a> (hnd : signal-write<e,a>) -> hnd/clause1<kokaine/reactive/internal/model/root-key,(),signal-write,e,a> */  {
  return hnd._fun_enter_batch;
}
 
 
// Call the `fun enter-batch` operation of the effect `:signal-write`
export function enter_batch(key) /* (key : kokaine/reactive/internal/model/root-key) -> signal-write () */  {
   
  var ev_10022 = $std_core_hnd._evv_at(0);
  return ev_10022.hnd._fun_enter_batch(ev_10022.marker, ev_10022, key);
}
 
 
// Automatically generated. Retrieves the `@fun-leave-batch` constructor field of the `:signal-write` type.
export function signal_write_fs__fun_leave_batch(_this) /* forall<e,a> (signal-write<e,a>) -> hnd/clause1<kokaine/reactive/internal/model/root-key,(),signal-write,e,a> */  {
  return _this._fun_leave_batch;
}
 
 
// select `leave-batch` operation out of effect `:signal-write`
export function leave_batch_fs__select(hnd) /* forall<e,a> (hnd : signal-write<e,a>) -> hnd/clause1<kokaine/reactive/internal/model/root-key,(),signal-write,e,a> */  {
  return hnd._fun_leave_batch;
}
 
 
// Call the `fun leave-batch` operation of the effect `:signal-write`
export function leave_batch(key) /* (key : kokaine/reactive/internal/model/root-key) -> signal-write () */  {
   
  var ev_10025 = $std_core_hnd._evv_at(0);
  return ev_10025.hnd._fun_leave_batch(ev_10025.marker, ev_10025, key);
}
 
 
// Automatically generated. Retrieves the `@fun-request-flush` constructor field of the `:signal-write` type.
export function signal_write_fs__fun_request_flush(_this) /* forall<e,a> (signal-write<e,a>) -> hnd/clause1<kokaine/reactive/internal/model/root-key,(),signal-write,e,a> */  {
  return _this._fun_request_flush;
}
 
 
// select `request-flush` operation out of effect `:signal-write`
export function request_flush_fs__select(hnd) /* forall<e,a> (hnd : signal-write<e,a>) -> hnd/clause1<kokaine/reactive/internal/model/root-key,(),signal-write,e,a> */  {
  return hnd._fun_request_flush;
}
 
 
// Call the `fun request-flush` operation of the effect `:signal-write`
export function request_flush(key) /* (key : kokaine/reactive/internal/model/root-key) -> signal-write () */  {
   
  var ev_10028 = $std_core_hnd._evv_at(0);
  return ev_10028.hnd._fun_request_flush(ev_10028.marker, ev_10028, key);
}