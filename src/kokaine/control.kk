/*--------------------------------------------------------------------------
  Native Koka responsive control flow.

  `branch` and `when` remain ordinary dynamic HTML with memo equality as their
  publication barrier.  The two `for` overloads share one packed sequential
  plan interpreted incrementally by DOM and as a snapshot by SSR.
--------------------------------------------------------------------------*/
module kokaine/control

import kokaine/reactive
import kokaine/html


pub fun branch(value : memo<a>,
               children : (a) -> <html<e>,signal-read> ()) : html<e> ()
  dynamic fn()
    children(value.get)

pub fun when(condition : memo<bool>,
             children : () -> <html<e>,signal-read> (),
             fallback : () -> <html<e>,signal-read> () = fn() ())
            : html<e> ()
  branch(condition) fn(visible)
    if visible then children() else fallback()

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
