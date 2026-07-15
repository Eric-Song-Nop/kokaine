# Kokaine architecture

Kokaine is a continuation-trace reactive runtime for Koka 3.2.3. A synchronous
tracked read captures the computation suffix at that read. Sources index those
actual continuation capabilities, and writes schedule the affected resumptions.
There is no retained calculation action or separate Observer graph used to
recompute a reactive function from its beginning.

## Module boundaries

The public module, `src/kokaine/reactive.kk`, exposes opaque roots, signals,
memos, and re-entry capabilities. Its implementation is split by responsibility:

| Module | Responsibility |
| --- | --- |
| `reactive/effects.kk` | `signal-read` and `signal-write` operations |
| `internal/model.kk` | sources, traces, planes, scopes, frames, and work tickets |
| `internal/capture.kk` | raw-handler reification of synchronous read suffixes |
| `internal/lifetime.kk` | draft transactions, ownership, and finalization |
| `internal/scheduler.kk` | invalidation, queueing, resumption, and targeted settle |
| `internal/handlers.kk` | write interpretation, sampled reads, and dispatch |
| `internal/reentry.kk` | continuation-derived host re-entry |
| `internal/runtime.kk` | roots and high-level signal, memo, and effect operations |
| `internal/bridge.kk` | unambiguous calls from the opaque facade |

Koka has no package-private visibility. Concrete internal types are therefore
public inside their modules so sibling modules can share them; the facade wraps
them in abstract public values so application code cannot inspect the runtime.

## Effects and synchronous reads

The public effect rows distinguish capability from implementation:

```text
signal-read   validate a producer; read a source
signal-write  write/modify a source; enter/leave a batch; request a flush
html<e>       emit backend-neutral view values
```

`signal/get` performs `read-source(..., Track-read, ...)`. The handler in
`internal/capture.kk` handles that operation with `raw ctl` and constructs a
`Trace-read` containing:

- the actual resumption after this read;
- its typed execution plane;
- its generation gate and frame;
- the nested trace produced by later reads;
- a finalizer and source unlink operation; and
- a source-version stale check.

The handler immediately resumes the new continuation with the current source
value to complete the initial calculation. If there are several reads, their
captured suffixes form a nested trace. Code before a tracked read is outside its
resumption and is not replayed when that read is invalidated.

The initial calculation closure exists only in a one-shot bootstrap slot. The
slot is cleared before invocation. Once bootstrap has begun, neither a producer
nor a scheduler ticket retains `calculate`, `track`, or a full action as a
fallback; subsequent work comes from `trace-resume`.

## Source-local continuation indexing

A source contains its current cell, equality function, version, and a list of
rank-2 `packed-capture` values. Each package contains a typed triple:

```text
(execution plane, target trace, owning read trace)
```

The rank-2 consumer can enqueue or inspect the pair without exposing its
ambient effect row. The source does not store a subscriber callback, node ID,
rank, or retained observer action.

This is a source-local index over graph-shaped continuation relationships. The
claim is not that the runtime contains no links or scheduler state; it is that
there is no second, independently maintained Observer dependency graph whose
nodes are later mapped back to user actions.

## Writes and scheduling

For an unequal write, the write handler:

1. commits the source cell;
2. increments its version;
3. visits its active packed continuation capabilities;
4. changes each live target to `Capture-pending` and queues
   `Resume-work(target)`; and
5. flushes unless a batch or another flush is active.

`Capture-pending` and `Capture-running` describe the state of the actual
resumption. A write during a running suffix marks the same trace pending for a
later turn; it does not dirty a separate observer or enqueue a retained action.
Bootstrap tickets contain a scope whose one-shot bootstrap slot has not yet
been consumed.

## Two execution planes

Each root owns two planes:

- `plane<total>` for derivations; and
- `plane<e>` for effects with the root's ambient host row.

This split is the type-safety boundary for synchronous memo reads. A
`derive-producer` can retain only a `plane<total>` and a pure continuation scope,
so targeted validation cannot accidentally resume an effectful UI continuation
under an erased effect row.

During a full flush, runnable pure derivations are advanced before user effects.
During `memo/get`, targeted settling follows only the requested producer's gate,
input producer, entry target, and child trace. It reports `ok`, `deferred`, or
`failed`; it does not drain unrelated pure or effect tickets. A per-producer
settling guard and gate states detect cycles.

## Stateful memos

`memo(previous)` starts with `State-entry-read` on its own output source. That
operation captures a `Trace-entry`, but deliberately does not add a source edge
back to the memo itself. When the entry is resumed, it injects the latest
successfully committed value as `previous` and executes the entry suffix.

Reads beneath an entry target the entry capability. Targeted settling checks
the entry before and after input and child settlement so work from an obsolete
entry generation cannot win over the replacement continuation.

## Draft publication and failure

Resuming a pending trace creates a draft frame and records every continuation
captured during that attempt. A successful attempt retires the previous child
generation, publishes the new value or effect, activates the draft trace, and
marks its frame live.

If calculation, cleanup, or publication fails, the draft continuations and
structural children are finalized. The source write that triggered the turn is
not rolled back. The original continuation capability remains pending and can
be retried by a later flush; there is no recovery action that reruns the whole
calculation. An abortive final control operation follows the same dynamic
rollback path even though it does not return an `Error` value.

## Structural lifetime

Continuation frames own a structural list of child scopes, pure derivation
scopes, and cleanup actions. Replacing a generation first marks its complete
subtree dead, then runs finalizers. This prevents cleanup code from attaching
new reactive work to a half-retired branch. A stale frame rejects registration.

This ownership ledger is explicit, but it is not part of dependency
propagation. Its purpose is to finalize raw continuations, remove DOM listeners
and ranges, and retire callback-created work exactly once.

## Batching

A batch delays settling while writes still update source cells immediately.
Nested batches are counted on the root, and the outermost `leave-batch` flushes.
Synchronous memo reads remain coherent through targeted producer settlement.

Host re-entry is always one batched turn. This lets a callback register all of
its structural children before one of its writes can retire the registering
generation. At batch exit, an invalidated generation and every child created
during the callback are retired together.

## DOM and host re-entry

The DOM adapter mounts live text, attributes, properties, and regions with
continuation-backed effects. Listener installation captures an opaque
`reentry<e>` containing the current root, continuation gate, and generation
frame. When the browser later invokes the listener, `reenter`:

1. rejects a retired or disposed frame;
2. sets the state-entry target to `Nothing`;
3. restores the captured effect-plane gate and frame;
4. installs fresh signal read/write handlers; and
5. runs the callback as one batch.

Reactive work created inside the callback is therefore owned by the exact DOM
generation that installed the listener and is retired with that region or
mount.

This boundary is intentionally precise: re-entry is **continuation-derived
structural re-entry**. Browser event delivery itself is still an ordinary host
callback and does not resume a parked event continuation. Nor can it reconstruct
arbitrary user-defined handlers whose lexical extent around `mount` has already
returned. Such effects must be handled inside the callback or by a fresh
application runner installed at the host boundary.

## Verification map

- `trace-semantics.kk` checks exact suffix capture and dynamic branches.
- `targeted-settle*.kk` and `execution-planes.kk` check isolated producer
  settlement and the pure/effect split.
- `stateful-entry-gates.kk`, `entry-targeted-settle.kk`, and
  `entry-structural.kk` check state-entry routing and ownership.
- `structural-scopes.kk` checks replacement cleanup and stale-frame rejection.
- `final-control-rollback.kk` checks abandoned drafts and exact-K retry.
- `continuation-reentry.kk` checks callback-created ownership and stale re-entry.
- `dom-lifecycle.kk` plus `browser_counter.py` check listener, region, and mount
  retirement in a real browser.

The browser renderer currently replaces region ranges wholesale and does not
provide keyed reconciliation, hydration, suspense, or preservation of arbitrary
outer handler stacks.
