# Architecture

Kokaine separates persistent reactive state, declarative structure, and host
mutation. This keeps the scheduling semantics independent of `jsweb` or
`wasmweb` and gives each algebraic effect one narrow meaning.

## Layers

1. `kokaine/reactive` owns signals, dynamically discovered edges, memo caches,
   the scheduler, transactions, and the ownership forest. It has no browser
   dependency.
2. `kokaine/html` defines immutable `view<e>` values and a tail-resumptive
   builder effect. It contains no string concatenation or DOM access.
3. `kokaine/ssr` and `kokaine/dom` are interpreters. The first produces escaped
   text; the second creates and updates browser nodes on the `jsweb` backend.
4. The WASM proof isolates the Emscripten handle/callback ABI needed by a future
   full `wasmweb` interpreter. It uses the same reactive core.

## Capability model

### Reads

`signal-read` has one polymorphic operation:

```koka
fun read-source(source : source<a>, tracked : bool) : a
```

The root handler first recursively settles a memo producer, then optionally
records the edge from the current observer to the source, and finally returns
the cell. A nested override handler implements `untrack` by forwarding the
operation with `tracked = False`.

`sample(root, action)` installs the read handler without creating a persistent
observer. An observer's tracked function runs with its identity in the root;
the apply half of a user effect runs with that identity cleared. A `sample`
nested inside apply therefore cannot accidentally subscribe the effect.

### Writes

`signal-write` represents source replacement, modification, internal memo
commit, batch entry/exit, and flush requests. The operations are handled by the
root that owns the source. Equality is tested before invalidation.

Memo calculators have the closed type:

```koka
(previous : a) -> <signal-read,pure> a
```

They cannot directly call a write operation or perform an arbitrary host
effect. Because higher-order code could capture a root and install a nested
write handler itself, the interpreter also rejects every public write or graph
registration while a dependency-tracking observer is current. Memo output is
committed through a private operation. The property is therefore both typed
and dynamically contained.

`update` handles writes, `sample` handles reads, and `dispatch` handles both.
The narrower entry points make application intent visible while sharing one
interpreter.

### HTML emission

`html<e>` contains a single tail-resumptive `emit(view<e>)` operation. The
outer `view` handler collects terminal nodes. Each tag installs an `override`
handler for its children, then emits exactly one element to its parent. This is
why ordinary Koka blocks can express nesting without macros, JSX, or a parser
extension.

Reactive regions remain ordinary values:

```koka
region fn()
  view fn()
    if visible.get then
      strong([],fn() text-live(fn() label.get))
```

The region thunk has `signal-read`; interpreting it is what creates an owned
observer.

## Graph representation

A root stores abstract sources and observers by integer identity. A source has
a value cell, equality function, rank, subscriber IDs, and an optional memo
producer. An observer stores its kind, rank, status, current dependencies,
owned children, cleanup callbacks, optional output source, and action.

Persistent identities use private `ref<global,_>` cells because DOM and WASM
callbacks outlive the lexical call to `main`. The state effect is discharged
inside the module with small `load`/`store` functions. Public APIs expose
domain capabilities (`signal-read` and `signal-write`) instead of leaking
implementation-level state effects.

Observers use four logical states plus an independent execution bit:

| State | Meaning |
| --- | --- |
| `Clean` | Every known producer is settled and the cached result is current. |
| `Pending` | A transitive producer is dirty, but equality may still prove this observer unaffected. |
| `Stale` | At least one direct input changed; the observer must execute. |
| `Disposed` | The observer is detached and cannot be scheduled or read as a producer. |

Keeping `executing` separate matters: a write during apply can invalidate an
observer without losing recursive-read detection.

## Propagation algorithm

When a source changes:

1. Its direct subscribers become `Stale` and enter their phase queue.
2. If a stale subscriber is a memo, subscribers of that memo's output become
   `Pending`, recursively. They are possible, not definite, invalidations.
3. The scheduler drains derivations before user effects. Each phase queue is
   ordered by the latest discovered graph rank and deduplicated by observer ID.
4. Settling a `Pending` observer recursively settles the producers it read last
   time. If none committed a different value, the observer becomes `Clean`
   without executing.
5. A memo that commits an unequal value changes its pending direct subscribers
   to `Stale`; an equal value prunes that branch.
6. Immediately before the observer action, old dependencies are detached.
   Reads rebuild the edge set actually encountered on that run and raise the
   observer's rank from the corresponding producer ranks.

This distinction between `Pending` and `Stale` is what makes both requirements
hold at once: a leaf memo read inside a batch is transitively fresh, while an
equal intermediate memo still prevents downstream work. It also keeps diamond
graphs coherent without running every descendant pessimistically.

Pulled memo reads use the same settling functions. An outer `is-flushing`
guard prevents their internal commit from starting a nested global flush, and
the directly settled observer is removed from its queue before execution. No
duplicate tombstones or arbitrary global iteration budget accumulate.

## Transactions and execution phases

`batch` is nestable. Writes update source cells immediately, but `flush` is a
no-op until the outermost `leave-batch`. The first real flush drains:

```text
ranked derivations -> newly queued derivations -> ranked user effects
```

If an effect write makes a derivation stale, the loop returns to the derivation
queue before selecting another effect. `is-flushing` makes propagation
non-reentrant; writes only add work to the current queues.

`create-root` performs setup inside an implicit batch. Late memo and effect
registration requests a flush, so constructors behave eagerly when used from
an `update` after setup while still avoiding partially initialized effects.

## Ownership, cleanup, and errors

The current owner is independent from the current tracking observer. This lets
the untracked apply half of an effect create live bindings that it owns without
turning its reads into dependencies.

Every effect rerun first disposes its previous child forest and runs its prior
cleanups. Disposal is two-phase:

1. Collect and mark the complete forest `Disposed`, remove queue entries, and
   detach every dependency edge.
2. Run all cleanup callbacks, continuing through failures, then unlink observer
   closures and memo sources from the root.

Marking the forest before the first cleanup prevents a cleanup write from
re-entering a sibling being torn down. Root disposal also sets a disposing
guard, suppresses propagation, and clears every graph collection in a `finally`
frame. Disposal is idempotent; creating a signal or observer in a dead root is
an error.

An observer failure restores tracking/ownership context and keeps the observer
stale and queued so it can retry. Cleanup failure occurs before detachment and
retains the prior subscriptions; an action failure retains any edges already
rebuilt by that attempt. A failed memo never becomes clean with its old cache.
Cleanup failure is exhaustive: later listener and DOM range cleanup still runs
before the original exception escapes.

## DOM interpretation

`mount` creates one constant owner effect enclosed by start/end comments. Its
disposer therefore owns the complete mounted range. Within it:

- live text, attributes, and properties are small child effects;
- listeners register the exact JavaScript wrapper returned by
  `addEventListener`, then remove that same identity during cleanup;
- regions keep stable comment anchors, clear the old range on rerun, and mount
  their next branch under the region effect's owner;
- elements and attribute/property/event names are validated before mutation;
- ordinary text uses `Text.data`, never markup parsing;
- only `trusted-html` uses a `<template>` parsing boundary.

Raw JavaScript exceptions are not Koka `exn` operations and would otherwise
unwind through effect masks and scheduler `finally` frames. Every potentially
throwing DOM primitive therefore executes inside a small JavaScript result box;
Koka inspects the box and raises a typed `exn` before returning to reactive
code. The browser suite verifies this with an invalid `querySelector` input.

Static structure is mounted once. Updating a signal touches only the binding
effects that tracked it; there is no render loop and no virtual-tree diff.

### Asynchronous browser re-entry

A browser listener fires after Koka's generated `main` and its dynamic handler
stack have returned. Calling a signal operation directly from that stack would
look well typed but find no handler at runtime.

The listener trampoline therefore snapshots stable event fields and installs a
fresh exception boundary before calling `dispatch`, which reinstalls the root's
read and write handlers. Listener exceptions are reported to `console.error`
instead of corrupting the handler stack. This behavior is covered by real
Playwright clicks and input events.

`callback<e>` fixes `ui` alongside signal read/write instead of leaving it in
the open row `e`. The DOM root already owns that `ui` capability; fixing it
prevents a full handler that calls `prevent-default` from inferring an invalid
duplicate `<ui,ui>` row. The open row is reserved for additional application
effects.

An arbitrary user-defined effect handler that surrounded the original mount is
also gone at this point. Such effects must be handled inside the callback or by
an application-specific runner freshly invoked by the event boundary.

The lifecycle fixture retains nodes from old regions, dispatches events on
them after replacement and after unmount, mutates sources after teardown, and
calls the disposer twice. This locks down listener identity, child-first
ownership cleanup, binding disposal, range removal, and idempotence together.

## WebAssembly boundary

`wasmweb` compiles Koka's C backend with Emscripten, so JavaScript DOM objects
cannot inhabit Koka `any` values directly. The bridge uses integer handles:

- JavaScript owns a table of host objects and passes `int32` IDs to C.
- C boxes IDs as `kk_box_t` and retains listener closures as `kk_function_t`.
- Each event duplicates the retained closure before `kk_function_call`, because
  an invocation consumes the function value.
- A complete listener-removal path must drop its stored closure exactly once.

The generated Koka main normally finalizes module globals immediately after
`main` returns. `NO_EXIT_RUNTIME` alone does not change that. The proof links a
small custom main that calls module init/run but defers module `done` until
process exit, keeping reactive cells and callbacks valid for asynchronous
events. This ABI/runtime constraint belongs entirely to the WASM host adapter;
the signal graph and HTML DSL are unchanged.

The executable bridge, custom main, fake DOM, and packaging script live in
`support/wasmweb-proof`; `make test-wasm` recompiles and runs the proof.

## Deliberate limits

- Computations are synchronous. A resumptive custom effect may not suspend a
  root while its tracking/ownership context remains installed; handle or close
  such effects at a safe application boundary.
- The DOM adapter assumes the browser's single JavaScript thread. The private
  global references are not a cross-thread scheduler.
- `region` replaces an owned range. Keyed list reconciliation, hydration, and
  async resources are separate higher-level facilities rather than hidden core
  behavior.
