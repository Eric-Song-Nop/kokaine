/*--------------------------------------------------------------------------
  Unambiguous bridge names used by the opaque public facade.
--------------------------------------------------------------------------*/
module kokaine/reactive/internal/bridge

import kokaine/reactive/internal/model
import kokaine/reactive/effects
import kokaine/reactive/internal/runtime
import kokaine/reactive/internal/reentry
import kokaine/reactive/internal/structural

pub fun runtime-dispatch(root : root<e>,
                         action : () -> <signal-read,signal-write,pure|e> a)
                        : <exn|e> a
  kokaine/reactive/internal/runtime/dispatch(root,action)

pub fun runtime-create-root(action : (root<e>) -> <signal-write,pure|e> a)
                           : <exn|e> (root<e>,a)
  kokaine/reactive/internal/runtime/create-root(action)

pub fun runtime-dispose-root(root : root<e>) : <exn|e> ()
  kokaine/reactive/internal/runtime/root/dispose(root)

pub noinline fun runtime-root-is-disposed(root : root<e>) : bool
  kokaine/reactive/internal/runtime/root/is-disposed(root)

pub fun runtime-update(root : root<e>,
                       action : () -> <signal-write,pure|e> a) : <exn|e> a
  kokaine/reactive/internal/runtime/update(root,action)

pub fun runtime-sample(root : root<e>,
                       action : () -> <signal-read,pure|e> a) : <exn|e> a
  kokaine/reactive/internal/runtime/sample(root,action)

pub fun runtime-signal-by(root : root<e>, initial : a,
                          equals : (a,a) -> bool) : exn signal<a>
  kokaine/reactive/internal/runtime/signal-by(root,initial,equals)

pub fun runtime-signal-get(value : signal<a>) : signal-read a
  kokaine/reactive/internal/runtime/signal/get(value)

pub fun runtime-signal-set(value : signal<a>, next : a) : signal-write ()
  kokaine/reactive/internal/runtime/signal/set(value,next)

pub fun runtime-signal-modify(value : signal<a>, update : a -> a)
                          : signal-write ()
  kokaine/reactive/internal/runtime/signal/modify(value,update)

pub fun runtime-batch(root : root<e>,
                      action : () -> <signal-write,pure|e1> a)
                     : <signal-write,pure|e1> a
  kokaine/reactive/internal/runtime/batch(root,action)

pub fun runtime-untrack(action : () -> <signal-read,pure|e> a)
                       : <signal-read,pure|e> a
  kokaine/reactive/internal/runtime/untrack(action)

pub fun runtime-derive-by(root : root<e>, initial : a,
                          calculate : () -> <signal-read,pure> a,
                          equals : (a,a) -> bool)
                         : <signal-write,pure> memo<a>
  kokaine/reactive/internal/runtime/derive-by(
    root,initial,calculate,equals)

pub fun runtime-memo-by(root : root<e>, initial : a,
                        calculate : (previous : a) -> <signal-read,pure> a,
                        equals : (a,a) -> bool)
                       : <signal-write,pure> memo<a>
  kokaine/reactive/internal/runtime/memo-by(
    root,initial,calculate,equals)

pub fun runtime-memo-get(value : memo<a>) : signal-read a
  kokaine/reactive/internal/runtime/memo/get(value)

pub fun runtime-create-effect(root : root<e>,
                              track : () -> <signal-read,pure> a,
                              apply : (value : a) -> <signal-write,pure|e> ())
                             : <signal-write,pure> disposer<e>
  kokaine/reactive/internal/runtime/create-effect(root,track,apply)

pub fun runtime-on-cleanup(root : root<e>,
                           cleanup : () -> <signal-write,pure|e> ()) : exn ()
  kokaine/reactive/internal/runtime/on-cleanup(root,cleanup)

pub fun runtime-capture-reentry(root : root<e>) : exn reentry<e>
  kokaine/reactive/internal/reentry/capture-reentry(root)

pub fun runtime-run-reentry(value : reentry<e>,
                            action : () -> <signal-read,signal-write,pure|e> a)
                           : <exn|e> a
  kokaine/reactive/internal/reentry/run-reentry(value,action)

pub fun runtime-open-structural-owner(root : root<e>)
                                     : exn structural-owner<e>
  open-structural-owner(root)

pub fun runtime-with-structural-owner(root : root<r>,
                                     owner : structural-owner<r>,
                                     action : () -> <div,exn|e> a)
                                    : <div,exn|e> a
  with-structural-owner(root,owner,action)

pub fun runtime-dispose-structural-owner(owner : structural-owner<e>)
                                        : <exn|e> ()
  dispose-structural-owner(owner)

pub fun runtime-compact-structural-owner(owner : structural-owner<e>) : ()
  compact-structural-owner(owner)

pub fun runtime-bootstrap-structural-owner(owner : structural-owner<e>)
                                          : <div,exn|e> ()
  bootstrap-structural-owner(owner)

pub fun runtime-bootstrap-structural-owners(
          owners : list<structural-owner<e>>) : <div,exn|e> ()
  bootstrap-structural-owners(owners)
