# Architecture

Kokaine separates the system into three interpretable layers.

1. The reactive core owns signals, dependency edges, a rank-ordered scheduler,
   batches, and the owner tree. It has no browser dependency.
2. The HTML layer is a Koka DSL that constructs a typed view description. A
   builder handler gives nested elements normal block syntax without JSX.
3. A host adapter interprets views. The first adapter is the browser DOM on
   Koka's `jsweb` backend; tests use a native in-memory host.

## Why algebraic effects

Signal access is not modeled as an ordinary closure read. A read performs a
tail-resumptive `signal-read` operation, and the root handler decides whether
to record a dependency before returning the stored value. `untrack` is a nested
override handler that delegates the read while suppressing tracking.

Writes use a distinct `signal-write` effect. Memo callbacks mention only
`signal-read` in their effect row, so mutating a signal from a derivation is a
compile-time error. Event and application callbacks may use both effects.

The runtime stores persistent identity in global references because browser
callbacks outlive the lexical invocation of `main`. Those references are
private implementation details: their state effects are discharged internally,
while the public API exposes the more meaningful read/write capabilities.

## Scheduling invariants

- A source stores subscriber computation IDs, never callbacks.
- A computation removes its old edges before every run, so dependencies follow
  the branch actually taken during the latest synchronous execution.
- Derivations run before user effects. Within each phase the lowest graph rank
  runs first.
- Queue state deduplicates converging invalidations.
- A write during a flush only queues work; it never re-enters a downstream
  computation.
- Equal signal or memo values do not notify downstream subscribers.
- Nested batches expose the latest raw values immediately but delay propagation
  until the outer batch closes.

These rules make diamonds settle to one coherent value instead of exposing an
intermediate mixture of old and new branches.

## Browser and WebAssembly

Koka's `jsweb` target is an ES-module JavaScript backend. Its DOM adapter can
therefore hold browser objects directly through `any` extern values.

Koka's `wasmweb` target instead compiles the C backend with Emscripten. It needs
a JavaScript-side handle table plus a C bridge that retains and invokes
`kk_function_t` callbacks. The core and HTML DSL do not depend on either
representation; only the host adapter does.

