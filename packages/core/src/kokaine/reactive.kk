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

// Run `action` against `root` with both signal capabilities handled: reads are
// sampled (no dependency is recorded) and writes commit immediately. The
// effect row is the caller's `e` plus `exn`; `signal-read` and `signal-write`
// are discharged here.
//
// Gotcha: nothing read inside `dispatch` is tracked. Use `derive`,
// `create-effect`, or a live HTML binding when a value should react to
// changes.
pub fun dispatch(root : root<e>,
                 action : () -> <signal-read,signal-write,pure|e> a)
                : <exn|e> a
  // Keep the abstract wrapper elimination out of the effect-polymorphic call.
  // Koka 3.2.3 can otherwise lower the public and internal root constructors
  // inconsistently in generated native code.
  val inner = root.unwrap-root
  runtime-dispatch(inner,action)

// Create a reactive root and run `action` to build its initial signals,
// derivations, and effects. Returns the root together with the action's
// result. The action may write signals (`signal-write`) and perform the
// caller's effects `e`; the call itself can raise `exn`.
//
// Construction is atomic: all initial work stays queued until `action` returns
// and the first flush drains. If the action or any initial calculation fails,
// the unpublished root and everything it registered are retired before the
// exception propagates. Calling `create-root` from inside a derivation is
// rejected.
pub fun create-root(action : (root<e>) -> <signal-write,pure|e> a)
                   : <exn|e> (root<e>,a)
  val (inner,result) = runtime-create-root(
    fn(internal) action(Public-root(internal)))
  (Public-root(inner),result)

// Retire the root: finalize every owned effect, derivation, cleanup, and
// parked resource continuation. Idempotent. Raises `exn` (plus the caller's
// `e`, from cleanup actions).
//
// Gotcha: disposing from inside a running computation, flush, or batch of the
// same root throws; dispose from an outer turn instead.
pub fun root/dispose(root : root<e>) : <exn|e> ()
  val inner = root.unwrap-root
  runtime-dispose-root(inner)

// Whether `root.dispose` has completed for this root. Total: no effects.
pub noinline fun root/is-disposed(root : root<e>) : bool
  runtime-root-is-disposed(root.unwrap-root)

// Run a write-only `action` as one turn on `root`, then flush. The action has
// `signal-write` plus the caller's `e`; the call adds `exn`.
//
// Besides ordinary writes, `update` is the explicit recovery boundary: effects
// quarantined after an earlier failure are re-admitted and retried even when
// the action writes nothing new.
pub fun update(root : root<e>, action : () -> <signal-write,pure|e> a)
              : <exn|e> a
  // Koka 3.2.3 can mis-lower this effect-polymorphic facade beneath a handler
  // when the unwrap remains in the call argument, leaving its synthetic root
  // binder free in generated JavaScript.
  val inner = root.unwrap-root
  runtime-update(inner,action)

// Run a read-only `action` on `root` and return its result. Reads are sampled
// (not tracked) and produce settled derived values; writes are not available.
// Effect row: the caller's `e` plus `exn`.
pub fun sample(root : root<e>, action : () -> <signal-read,pure|e> a)
              : <exn|e> a
  runtime-sample(root.unwrap-root,action)

// Create a writable signal owned by `root` with an explicit equality function.
// A write whose value `equals` the current one is dropped before anything is
// invalidated. Raises `exn` when called inside a derivation (pure plane) or on
// a retired root.
pub fun signal-by(root : root<e>, initial : a,
                  equals : (a,a) -> bool) : exn signal<a>
  Public-signal(runtime-signal-by(root.unwrap-root,initial,equals))

// Create a writable signal owned by `root`, using the implicit `(==)` for the
// value type to suppress equal writes. Raises `exn` when called inside a
// derivation or on a retired root.
//
// Read with `.get` (tracked inside derivations, effects, and live bindings),
// write with `.set` or `.modify`. Unlike Solid, a signal is one value, not a
// getter/setter pair.
pub fun signal(root : root<e>, initial : a,
               ?(==) : (a,a) -> bool) : exn signal<a>
  signal-by(root,initial,(==))

// Create a signal whose every write is treated as a change, so writing the
// same value again still notifies dependents. Raises `exn` like `signal`.
pub fun signal-always(root : root<e>, initial : a) : exn signal<a>
  signal-by(root,initial,fn(_,_) False)

// Read the current value. Effect: `signal-read`. Inside a derivation,
// `create-effect` track function, or live HTML binding this read is tracked:
// the rest of that computation after this exact read is captured and resumed
// when the signal changes. Elsewhere (for example under `dispatch` or
// `untrack`) it is a plain sample.
pub fun signal/get(value : signal<a>) : signal-read a
  runtime-signal-get(value.unwrap-signal)

// Replace the value. Effect: `signal-write`. An equal value (per the signal's
// equality) is ignored; otherwise dependents are invalidated and, outside a
// `batch`, flushed before `set` returns.
//
// Gotcha: writes are rejected at runtime inside a derivation calculator; write
// from a `create-effect` apply function, an event handler, or `update`.
pub fun signal/set(value : signal<a>, next : a) : signal-write ()
  runtime-signal-set(value.unwrap-signal,next)

// Replace the value with `update(current)`. Effect: `signal-write`. Same
// equality and flushing rules as `set`; `update` itself must be total.
pub fun signal/modify(value : signal<a>, update : a -> a) : signal-write ()
  runtime-signal-modify(value.unwrap-signal,update)

// Run `action` with settling deferred until it returns, then flush once. The
// action's row (`signal-write`, `pure`, and its own `e1`) passes through.
// Inside the batch, newly written values are immediately readable; only
// downstream effects and derivations wait. Batches nest, and the outermost one
// flushes. Host event delivery is already one batched turn.
pub fun batch(root : root<e>, action : () -> <signal-write,pure|e1> a)
             : <signal-write,pure|e1> a
  runtime-batch(root.unwrap-root,action)

// Run `action` with tracked reads turned into samples: reads inside it do not
// become dependencies of the surrounding derivation, effect, or binding.
// Derived values read here are still settled first. The `signal-read`, `pure`,
// and `e` row passes through unchanged.
pub fun untrack(action : () -> <signal-read,pure|e> a)
               : <signal-read,pure|e> a
  runtime-untrack(action)

// Create a read-only derived value (`memo<a>`) with an explicit publication
// equality. `calculate` may only read signals (`signal-read`, `pure`); it
// cannot write. Creating the memo needs `signal-write` because it schedules
// the first calculation. Read the result with `.get`.
//
// `initial` is the memo's value before its first calculation runs. The first
// calculation is scheduled, not run inline, so it happens on the next flush
// (for example when `create-root` finishes construction); a tracked or sampled
// `.get` settles the memo first and observes the calculated value. A new value
// equal to the previous one does not invalidate dependents.
pub fun derive-by(root : root<e>, initial : a,
                  calculate : () -> <signal-read,pure> a,
                  equals : (a,a) -> bool) : <signal-write,pure> memo<a>
  Public-memo(runtime-derive-by(
    root.unwrap-root,initial,calculate,equals))

// Create a read-only derived value from the current values of the signals and
// memos that `calculate` reads, using the implicit `(==)` to cut propagation
// when the result is unchanged. `calculate` has row `<signal-read,pure>`;
// creating the memo has `<signal-write,pure>`.
//
// Gotcha: unlike Solid's `createMemo(fn)`, `derive(root, initial, calc)` takes
// an explicit `initial` value (the value before the first calculation), and
// the result is read through `.get`, not by calling it. Derivations are
// stateless: to accumulate across updates, keep the state in a `signal` and
// update it from a `create-effect`.
pub fun derive(root : root<e>, initial : a,
               calculate : () -> <signal-read,pure> a,
               ?(==) : (a,a) -> bool) : <signal-write,pure> memo<a>
  derive-by(root,initial,calculate,(==))

// Like `derive`, but every recalculation publishes and notifies dependents,
// even when the new value equals the old one.
pub fun derive-always(root : root<e>, initial : a,
                      calculate : () -> <signal-read,pure> a)
                     : <signal-write,pure> memo<a>
  derive-by(root,initial,calculate,fn(_,_) False)

// Read a derived value. Effect: `signal-read`. The memo is settled first, so
// the value always reflects the current inputs. Inside a derivation, effect
// track function, or live binding the read is tracked, exactly like
// `signal/get`.
pub fun memo/get(value : memo<a>) : signal-read a
  runtime-memo-get(value.unwrap-memo)

// Create an effect owned by the current owner (the root or the enclosing
// effect/binding generation). `track` reads its inputs (`<signal-read,pure>`)
// and is the only part whose reads become dependencies; `apply` receives the
// tracked value and may write signals and perform the root's effects `e`
// (`<signal-write,pure|e>`). Creating the effect has `<signal-write,pure>`.
// Returns a disposer that finalizes the effect and everything it owns.
//
// Gotcha: reads inside `apply` are not tracked. Effects and derivations
// created inside `apply` are owned by that run and retired when the effect
// re-runs or is disposed. A failing `apply` is quarantined (the rest of the
// flush still runs and the first failure is rethrown afterwards); it runs
// again only when its inputs change or at an explicit `update`.
pub fun create-effect(root : root<e>,
                      track : () -> <signal-read,pure> a,
                      apply : (value : a) -> <signal-write,pure|e> ())
                     : <signal-write,pure> disposer<e>
  runtime-create-effect(root.unwrap-root,track,apply)

// Register `cleanup` with the current owner: it runs once, when that owner (an
// effect run, a dynamic region generation, or the root) is retired. `cleanup`
// may write signals and perform `e`; registration can raise `exn` (for example
// inside a derivation, where registration is rejected).
pub fun on-cleanup(root : root<e>,
                   cleanup : () -> <signal-write,pure|e> ()) : exn ()
  runtime-on-cleanup(root.unwrap-root,cleanup)
