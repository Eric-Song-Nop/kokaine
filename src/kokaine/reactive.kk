/*--------------------------------------------------------------------------
  Kokaine continuation-native reactive API.

  Synchronous tracked reads capture their exact suffix. Sources index those
  actual continuation capabilities; no retained computation action or
  retained callback runtime participates in propagation.
--------------------------------------------------------------------------*/
module kokaine/reactive

import kokaine/reactive/internal/model
pub import kokaine/reactive/effects
import kokaine/reactive/internal/bridge

abstract value type root<e::E>
  Public-root(internal-root : kokaine/reactive/internal/model/root<e>)

abstract value type signal<a>
  Public-signal(internal-signal : kokaine/reactive/internal/model/signal<a>)

abstract value type memo<a>
  Public-memo(internal-memo : kokaine/reactive/internal/model/memo<a>)

pub alias disposer<e> = kokaine/reactive/internal/model/disposer<e>

fun unwrap-root(value : root<e>) : kokaine/reactive/internal/model/root<e>
  match value
    Public-root(inner) -> inner

// Koka has no package-private exports. Integration modules use this qualified
// capability to bind a public root without making the core depend on them.
pub fun internal/root-handle(value : root<e>)
    : kokaine/reactive/internal/model/root<e>
  value.unwrap-root

fun unwrap-signal(value : signal<a>)
                 : kokaine/reactive/internal/model/signal<a>
  match value
    Public-signal(inner) -> inner

fun unwrap-memo(value : memo<a>) : kokaine/reactive/internal/model/memo<a>
  match value
    Public-memo(inner) -> inner

pub fun dispatch(root : root<e>,
                 action : () -> <signal-read,signal-write,pure|e> a)
                : <exn|e> a
  // Keep the abstract wrapper elimination out of the effect-polymorphic call.
  // Koka 3.2.3 can otherwise lower the public and internal root constructors
  // inconsistently in generated native code.
  val inner = root.unwrap-root
  runtime-dispatch(inner,action)

pub fun create-root(action : (root<e>) -> <signal-write,pure|e> a)
                   : <exn|e> (root<e>,a)
  val (inner,result) = runtime-create-root(
    fn(internal) action(Public-root(internal)))
  (Public-root(inner),result)

pub fun root/dispose(root : root<e>) : <exn|e> ()
  val inner = root.unwrap-root
  runtime-dispose-root(inner)

pub noinline fun root/is-disposed(root : root<e>) : bool
  runtime-root-is-disposed(root.unwrap-root)

pub fun update(root : root<e>, action : () -> <signal-write,pure|e> a)
              : <exn|e> a
  // Koka 3.2.3 can mis-lower this effect-polymorphic facade beneath a handler
  // when the unwrap remains in the call argument, leaving its synthetic root
  // binder free in generated JavaScript.
  val inner = root.unwrap-root
  runtime-update(inner,action)

pub fun sample(root : root<e>, action : () -> <signal-read,pure|e> a)
              : <exn|e> a
  runtime-sample(root.unwrap-root,action)

pub fun signal-by(root : root<e>, initial : a,
                  equals : (a,a) -> bool) : exn signal<a>
  Public-signal(runtime-signal-by(root.unwrap-root,initial,equals))

pub fun signal(root : root<e>, initial : a,
               ?(==) : (a,a) -> bool) : exn signal<a>
  signal-by(root,initial,(==))

pub fun signal-always(root : root<e>, initial : a) : exn signal<a>
  signal-by(root,initial,fn(_,_) False)

pub fun signal/get(value : signal<a>) : signal-read a
  runtime-signal-get(value.unwrap-signal)

pub fun signal/set(value : signal<a>, next : a) : signal-write ()
  runtime-signal-set(value.unwrap-signal,next)

pub fun signal/modify(value : signal<a>, update : a -> a) : signal-write ()
  runtime-signal-modify(value.unwrap-signal,update)

pub fun batch(root : root<e>, action : () -> <signal-write,pure|e1> a)
             : <signal-write,pure|e1> a
  runtime-batch(root.unwrap-root,action)

pub fun untrack(action : () -> <signal-read,pure|e> a)
               : <signal-read,pure|e> a
  runtime-untrack(action)

pub fun derive-by(root : root<e>, initial : a,
                  calculate : () -> <signal-read,pure> a,
                  equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  Public-memo(runtime-derive-by(
    root.unwrap-root,initial,calculate,equals))

pub fun derive(root : root<e>, initial : a,
               calculate : () -> <signal-read,pure> a,
               ?(==) : (a,a) -> bool) : <signal-write,pure> memo<a>
  derive-by(root,initial,calculate,(==))

pub fun derive-always(root : root<e>, initial : a,
                      calculate : () -> <signal-read,pure> a)
                     : <signal-write,pure> memo<a>
  derive-by(root,initial,calculate,fn(_,_) False)

pub fun memo/get(value : memo<a>) : signal-read a
  runtime-memo-get(value.unwrap-memo)

pub fun create-effect(root : root<e>,
                      track : () -> <signal-read,pure> a,
                      apply : (value : a) -> <signal-write,pure|e> ())
                     : <signal-write,pure> disposer<e>
  runtime-create-effect(root.unwrap-root,track,apply)

pub fun on-cleanup(root : root<e>,
                   cleanup : () -> <signal-write,pure|e> ()) : exn ()
  runtime-on-cleanup(root.unwrap-root,cleanup)
