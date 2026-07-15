# Architecture

Kokaine separates persistent reactive state, declarative structure, and host
mutation. This keeps the scheduling semantics independent of `jsweb` or
`wasmweb` and gives each algebraic effect one narrow meaning.

## Layers

1. `kokaine/reactive` owns signals, source-local continuation subscriptions,
   memo caches, the scheduler, transactions, and ownership scopes. It has no
   browser dependency.
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

The root handler first validates a memo producer's captured checkpoints and
pulls the exact producer when needed. It then optionally subscribes the
current one-shot wake token directly to the source, records the stable version,
and returns the cell. A nested override handler implements `untrack` by
forwarding the operation with `tracked = False`.

`sample(root, action)` installs the read handler without creating a wake token.
An observer's tracked function runs with its current generation token; the
apply half of a user effect runs with that token cleared. A `sample` nested
inside apply therefore cannot accidentally subscribe the effect.

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
write handler itself, the interpreter also rejects every public write or
binding registration while a dependency-capture token is current. Memo output
is committed through a private operation. The property is therefore both
typed and dynamically contained.

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

## Continuation trace representation

There is no centralized dependency graph. A source contains its value,
equality function, commit version, optional effect-erased producer state, and
a local list of subscription closures. A tracked observer generation owns one
`wake-token`; its first read of a source installs a local link and captures a
version/producer checkpoint. Repeated reads reuse that checkpoint.

The token carries five pieces of state:

- `live`, which closes the generation;
- `fired`, which makes several invalidations resume it once;
- an owner-generation capability, which links an owned observer to the exact
  parent continuation generation that created it and shares that generation's
  dependency checkpoints; the capability also carries a transient validation
  latch so an ownership/checkpoint cycle fails explicitly instead of recursing;
- cancellation closures, which eagerly remove all source links on restart or
  disposal;
- dependency checkpoints, which recursively validate a clean memo before its
  cached value is returned.

A memo's `producer-state` contains only `live`, `dirty`, and `running` latches,
the captured owner-generation cell, and the checkpoint cell shared with its
last generation. It contains no wake closure and therefore cannot retain the
typed root or observer when an externally held memo outlives its owner.

An observer contains only its continuation process, scheduling latches,
capture token, captured owner generation, owned children and cleanup callbacks.
Scheduler queues and ownership scopes contain direct observer handles. Roots
are separated by an opaque capability key. The root has no source or observer
registry, integer identity, subscriber ID lists, rank, or reverse
observer-to-source list.

Persistent identities use private `ref<global,_>` cells because DOM and WASM
callbacks outlive the lexical call to `main`. The state effect is discharged
inside the module with small `load`/`store` functions. Public APIs expose
domain capabilities (`signal-read` and `signal-write`) instead of leaking
implementation-level state effects.

Observers use four independent latches:

| Latch | Meaning |
| --- | --- |
| `live` | The observer and its parked process may still be resumed. |
| `dirty` | Its next captured generation must execute. |
| `queued` | One direct scheduler ticket already exists. |
| `running` | A producer pull must reject recursive re-entry. |

These are execution facts, not graph states. In particular, there is no
possible-versus-definite `Pending`/`Stale` state machine.

### Observer continuations

Observer execution is continuation-backed even though signal reads stay on
their optimized tail-resumptive `fun` path. A private `observer-suspend`
control effect reifies each observer as a coroutine:

1. the first scheduler step bootstraps a process parked before user code;
2. a scheduler step resumes one raw, one-shot continuation;
3. one complete observer round executes under freshly installed root handlers;
4. success or failure becomes a first-class outcome;
5. the next generation parks after the user action and its inner finalizers;
   root handlers plus tracking/ownership restoration remain outside the
   captured continuation.

The parked continuation owns the normal restart loop. The original action is
retained only as a recovery seed: if abortive host control exits the round
before a successor can be published, the restoring frame queues the observer
and the next scheduler step reifies a fresh process. Publishing the next
parked generation before rethrowing an ordinary action failure preserves retry
semantics without using that fallback. The failed round's token is then
canceled before the observer is requeued, so partially created children cannot
run ahead of the retry. Disposal clears the seed and explicitly finalizes raw
parked contexts before running user cleanups and unlinking the observer.

This recovery rule covers abortive/final control. It does not make a host
resumption safe to retain outside an observer round: the root's flush and
tracking frames remain installed until that resumption is resumed or
finalized, and multi-shot resumption would fork writes to one observer process
slot. Escaping resumptive host control is therefore unsupported.

The same generation token is the dependency trace. It is captured by the
observer process, installed by the `signal-read` handler, fired by sources, and
finalized by ownership disposal. See the
[continuation runtime plan](continuation-runtime-plan.md) for the evidence and
the rejected alternatives.

## Propagation algorithm

When a source changes:

1. An unequal source commit stores the value, increments its version, and fires
   each live source-local token whose complete owner-generation chain remains
   current. A token's `fired` latch creates at most one scheduler action even
   when the generation read several changed sources.
2. Only direct subscribers become dirty. A memo becoming dirty does not
   speculatively dirty or execute its downstream consumers.
3. Before returning a memo cache, the read handler recursively validates the
   producer checkpoints captured by its clean generation. A dependency memo
   is settled before its recorded version is compared.
4. When validation makes the requested producer dirty, the scheduler extracts
   that exact observer from the derivation queue by its opaque latch and runs
   it. It never executes an arbitrary sibling as a pull fallback, and a clean
   read does not globally flush unrelated retry work.
5. An unequal memo commit increments its version and fires downstream tokens.
   An equal commit changes neither; even a stateful `memo(previous)` downstream
   remains asleep.
6. The global flush drains derivations before user effects. Before an owned
   observer runs, its owner-generation chain recursively settles captured memo
   checkpoints; this exposes a latent parent invalidation even if the child is
   earlier in the rank-free queue. A generation that has then fired or been
   canceled is stale and is never resumed; its owner rerun disposes it. Before
   each valid resume, the old token cancels all links, and new control flow
   captures exactly the source-local links and checkpoints encountered by the
   next generation.

This keeps a diamond coherent without rank. If a join is selected before one
branch, checkpoint validation pulls that exact branch first; an equal branch
commit is cut off without executing the join. User effects remain behind the
derivation phase barrier.

## Transactions and execution phases

`batch` is nestable. Writes update source cells immediately, but `flush` is a
no-op until the outermost `leave-batch`. The first real flush drains:

```text
dirty derivation continuations -> newly dirtied derivations -> user continuations
```

If an effect write makes a derivation dirty, the loop returns to the derivation
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

1. Mark the complete direct-handle forest dead and cancel every generation's
   source-local subscriptions.
2. Finalize every parked process, run all cleanup callbacks while continuing
   through failures, then unlink the ownership handles.

Marking the forest before the first cleanup prevents a cleanup write from
re-entering a sibling being torn down. Root disposal also sets a disposing
guard, suppresses token firing, and clears both work queues and ownership
scopes in a `finally` frame. Disposal is idempotent; creating a signal or
observer in a dead root is an error.

Each child also captures the parent's current generation capability. If a
batch invalidates both, the parent's `fired` latch makes the old child's ticket
stale immediately, independent of source write order or queue insertion order.
The same check follows the capability chain through arbitrary ownership depth;
it first settles the owner's captured memo checkpoints, then rejects an
externally retained memo from a stale owner generation rather than pulling it.
Cleanup-created work belongs to the replacement generation. If the owner's
next tracked round reads that same owned producer, however, ownership and data
checkpoints form a cycle. The runtime detects re-entrant generation validation
and rejects it before either side publishes; a direct owner invalidation can
then retire the cyclic child and recover normally.

An observer failure restores capture/ownership context, cancels the incomplete
generation, and queues a retry. A cleanup failure has already canceled the
prior generation but leaves a direct retry ticket. A failed memo never becomes
clean with its old cache. Cleanup failure is exhaustive: later listener and DOM
range cleanup still runs before the original exception escapes. A cleanup may
dispose its own observer; the scheduler checks `live` again before resuming.
Registration under a dead current owner is rejected instead of creating an
orphan observer.

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
the continuation-indexed signal trace and HTML DSL are unchanged.

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
