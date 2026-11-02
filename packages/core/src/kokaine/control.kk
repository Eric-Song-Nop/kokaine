/*--------------------------------------------------------------------------
  Native Koka responsive control flow.

  `branch` and `when` remain ordinary dynamic HTML with memo equality as their
  publication barrier.  The two `for` overloads share one packed sequential
  plan interpreted incrementally by DOM and as a snapshot by SSR.
--------------------------------------------------------------------------*/
module kokaine/control

import kokaine/reactive
import kokaine/html


// Emit a dynamic region that is rebuilt with `children(v)` each time the memo
// `value` publishes a new value `v`. The region's previous generation (its
// DOM, listeners, effects, and cleanups) is retired on every rebuild. Effect:
// `html<e>`; `children` may emit HTML and read signals.
//
// Gotcha: any tracked read performed directly in `children` (not inside a live
// binding such as `text { ... }`) also rebuilds the whole region. Keep
// fine-grained values in live bindings, and rely on the memo's equality to
// avoid needless rebuilds.
pub fun branch(value : memo<a>,
               children : (a) -> <html<e>,signal-read> ()) : html<e> ()
  dynamic fn()
    children(value.get)

// Boolean form of `branch`: render `children` while `condition` is `True` and
// `fallback` (default: nothing) while it is `False`. Effect: `html<e>`. The
// condition must be a memo, for example `derive(root, False, fn() ...)`, not a
// plain boolean or signal.
pub fun when(condition : memo<bool>,
             children : () -> <html<e>,signal-read> (),
             fallback : () -> <html<e>,signal-read> () = fn() ())
            : html<e> ()
  branch(condition) fn(visible)
    if visible then children() else fallback()

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
pub fun list/for(
          each : () -> signal-read list<a>,
          key : (a) -> k,
          children : (item : accessor<a>, index : accessor<int>)
                     -> <html<e>,signal-read> (),
          ?cmp : (k,k) -> order,
          ?(==) : (a,a) -> bool) : html<e> ()
  keyed(internal/pack-keyed-plan(
    each,
    fn(items,action) items.foreach(action),
    key,cmp,(==),children
  ))

// Keyed vector rendering. Same contract as `list/for`, walking the vector in
// order: `each` (tracked), `key`, and a `children(item, index)` row builder
// with read-only accessors. Effect: `html<e>`. Keys must be unique.
pub fun vector/for(
          each : () -> signal-read vector<a>,
          key : (a) -> k,
          children : (item : accessor<a>, index : accessor<int>)
                     -> <html<e>,signal-read> (),
          ?cmp : (k,k) -> order,
          ?(==) : (a,a) -> bool) : html<e> ()
  keyed(internal/pack-keyed-plan(
    each,
    fn(items,action) items.foreach(action),
    key,cmp,(==),children
  ))
