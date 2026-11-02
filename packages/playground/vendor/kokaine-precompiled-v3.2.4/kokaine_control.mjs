// Koka generated module: kokaine/control, koka version: 3.2.4
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
import * as $kokaine_html from './kokaine_html.mjs';
import * as $kokaine_reactive_internal_model from './kokaine_reactive_internal_model.mjs';
import * as $kokaine_reactive_internal_runtime from './kokaine_reactive_internal_runtime.mjs';
 
// externals
 
// type declarations
 
// declarations
 
 
// Emit a dynamic region that is rebuilt with `children(v)` each time the memo
// `value` publishes a new value `v`. The region's previous generation (its
// DOM, listeners, effects, and cleanups) is retired on every rebuild. Effect:
// `html<e>`; `children` may emit HTML and read signals.
//
// Gotcha: any tracked read performed directly in `children` (not inside a live
// binding such as `text { ... }`) also rebuilds the whole region. Keep
// fine-grained values in live bindings, and rely on the memo's equality to
// avoid needless rebuilds.
export function branch(value, children) /* forall<a,e> (value : kokaine/reactive/memo<a>, children : (a) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()) -> (kokaine/html/html<e>) () */  {
  return $kokaine_html.dynamic(function() {
     
    var x_10053 = $std_core_hnd._open_at1(1, function(value_0 /* kokaine/reactive/memo<110> */ ) {
         
        var value_0_10042 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/memo<110> */ ) {
            return value_1;
          }, value_0);
        return $kokaine_reactive_internal_runtime.memo_fs_get(value_0_10042);
      }, value);
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(children);
    }
    else {
      return children(x_10053);
    }
  });
}
 
 
// monadic lift
export function _mlift_when_10052(children, fallback, visible_10002) /* forall<e> (children : () -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), fallback : ? (() -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ()), visible@10002 : bool) -> <kokaine/reactive/effects/signal-read,kokaine/html/html<e>> () */  {
  if (visible_10002) {
    return children();
  }
  else {
    if (fallback !== undefined) {
      return fallback();
    }
    else {
      return $std_core_types.Unit;
    }
  }
}
 
 
// Boolean form of `branch`: render `children` while `condition` is `True` and
// `fallback` (default: nothing) while it is `False`. Effect: `html<e>`. The
// condition must be a memo, for example `derive(root, False, fn() ...)`, not a
// plain boolean or signal.
export function when(condition, children, fallback) /* forall<e> (condition : kokaine/reactive/memo<bool>, children : () -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), fallback : ? (() -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> ())) -> (kokaine/html/html<e>) () */  {
  return $kokaine_html.dynamic(function() {
     
    var x_10055 = $std_core_hnd._open_at1(1, function(value_0 /* kokaine/reactive/memo<bool> */ ) {
         
        var value_0_10042 = $std_core_hnd._open_none1(function(value_1 /* kokaine/reactive/memo<bool> */ ) {
            return value_1;
          }, value_0);
        return $kokaine_reactive_internal_runtime.memo_fs_get(value_0_10042);
      }, condition);
     
    function next_10056(visible_10002) /* (bool) -> <kokaine/reactive/effects/signal-read,kokaine/html/html<156>> () */  {
      if (visible_10002) {
        return children();
      }
      else {
        if (fallback !== undefined) {
          return fallback();
        }
        else {
          return $std_core_types.Unit;
        }
      }
    }
    if ($std_core_hnd._yielding()) {
      return $std_core_hnd.yield_extend(next_10056);
    }
    else {
      return next_10056(x_10055);
    }
  });
}
 
 
// Keyed list rendering. `each` reads the current list (tracked), `key` maps an
// item to a stable business key, and `children` builds one row from read-only
// `item()` and `index()` accessors. Effect: `html<e>`. Optional implicit `cmp`
// orders keys and `(==)` suppresses publishing unchanged items.
//
// A row whose key survives keeps its DOM nodes, listeners, local form state,
// and owned reactive work; only its accessors publish new values. Removed keys
// retire their rows. Gotcha: keys must be unique within one snapshot; a
// duplicate throws and leaves the last committed rows unchanged (SSR rejects
// it as well). Read row data through `item()` and `index()` inside live
// bindings so a moved or updated row does not rebuild.
export function list_fs_for(each, key, children, _implicit_fs_cmp, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e,b> (each : () -> kokaine/reactive/effects/signal-read list<a>, key : (a) -> b, children : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), ?cmp : (b, b) -> order, ?(==) : (a, a) -> bool) -> (kokaine/html/html<e>) () */  {
  return $kokaine_html.keyed($std_core_hnd._open_none0(function() {
    return $kokaine_html.Keyed_plan($kokaine_html.Keyed_spec(each, function(items /* list<378> */ , action /* (378) -> 220 () */ ) {
        return $std_core_list.foreach(items, action);
      }, key, _implicit_fs_cmp, _implicit_fs__lp__eq__eq__rp_, children));
  }));
}
 
 
// Keyed vector rendering. Same contract as `list/for`, walking the vector in
// order: `each` (tracked), `key`, and a `children(item, index)` row builder
// with read-only accessors. Effect: `html<e>`. Keys must be unique.
export function vector_fs_for(each, key, children, _implicit_fs_cmp, _implicit_fs__lp__eq__eq__rp_) /* forall<a,e,b> (each : () -> kokaine/reactive/effects/signal-read vector<a>, key : (a) -> b, children : (item : kokaine/html/accessor<a>, index : kokaine/html/accessor<int>) -> <kokaine/html/html<e>,kokaine/reactive/effects/signal-read> (), ?cmp : (b, b) -> order, ?(==) : (a, a) -> bool) -> (kokaine/html/html<e>) () */  {
  return $kokaine_html.keyed($std_core_hnd._open_none0(function() {
    return $kokaine_html.Keyed_plan($kokaine_html.Keyed_spec(each, function(items /* vector<607> */ , action /* (607) -> 449 () */ ) {
        return $std_core_vector.foreach(items, action);
      }, key, _implicit_fs_cmp, _implicit_fs__lp__eq__eq__rp_, children));
  }));
}