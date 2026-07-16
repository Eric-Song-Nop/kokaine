# Kokaine architecture

Kokaine is a continuation-trace reactive runtime for Koka 3.2.3. Inside a
reified calculator or binding, a synchronous tracked read captures the
computation suffix at that read. Sources index those actual continuation
capabilities, and writes schedule the affected resumptions. There is no retained
calculation action or separate Observer graph used to recompute a reactive
function from its beginning.

The architecture deliberately separates three concerns: algebraic effects name
and delimit capabilities, raw continuations provide the precise incremental
execution unit, and frames plus the scheduler order and retire those units.
Having effect-typed signal operations alone would not establish the second
property; the previous Observer implementation already had such an API.

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

## Semantic division of labor

`signal-read`, `signal-write`, and `html<e>` are algebraic effect interfaces.
They let callers express requirements in effect rows and let scopes override
interpretation: `untrack` changes tracked reads to samples, `batch` changes when
writes settle, and nested HTML handlers collect only their own emitted children.

An effect row reports operations that escape a function after local handling.
It does not attest that an operation was never performed inside the function,
and it does not say how reactivity propagates. Kokaine adds the missing runtime
boundary explicitly: every pure derivation bootstrap, resumption, and targeted
settlement enters a nested pure phase. Reactive writes, structural registration,
disposal, and re-entry fail before mutation in that phase, even when a local
wrapper handled their public effect row or targets another root. Separately,
continuation-native propagation is guaranteed structurally: sources store
captured read resumptions, queues store `Resume-work(trace)`, and no producer
retains a full calculation action after bootstrap.

The continuation capabilities are also not affine. A live read trace may be
invalidated and resumed on many turns; after failure, the same capability
remains pending for retry when replacing an existing generation. State and
generation gates prevent an invalid or concurrent resume. Only the initial
bootstrap closure is consumed exactly once, and its initial failure retires the
scope rather than replaying it.

## Effects and synchronous reads

The public effect rows distinguish capability from implementation:

```text
signal-read   validate a producer; read a source
signal-write  write/modify a source; enter/leave a batch; request a flush
html<e>       emit backend-neutral view values
```

`signal/get` performs `read-source(..., Track-read, ...)`. When a calculator or
binding is executing inside `reify-trace`, the handler in
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

For example, this direct-style calculation has two distinct capture points:

```text
prefix
x = source.get       K1 = everything after the first get
middle(x)
y = source.get       K2 = everything after the second get, nested under K1
suffix(x, y)
```

The second read is not de-duplicated merely because it addresses the same
source. Both `K1` and `K2` are indexed. When the source changes, both may become
pending, but the scheduler runs only the earliest pending frontier (`K1`). Its
new execution captures a replacement second-read continuation and successful
publication retires the old nested child. Reads in a branch not taken by the
replacement suffix disappear with that retired generation, which is how
dynamic dependencies change without explicit subscribe/unsubscribe logic.

`Sample-read`, used by `untrack`, resumes the raw context with the current value
without creating a trace or source entry. Outside `reify-trace`, the ordinary
dispatch read handler likewise validates and returns the cell without retaining
a continuation. `State-entry-read` inside stateful reification is different
again: it captures the memo entry described below but deliberately creates no
self-edge on the output source.

The initial calculation closure exists only in a one-shot bootstrap slot. The
slot is cleared before invocation. Once bootstrap has begun, neither a producer
nor a scheduler ticket retains `calculate`, `track`, or a full action as a
fallback; subsequent work comes from `trace-resume`. If that first bootstrap
fails or exits through final control, its starting scope is retired and the
cleared closure is not replayed. Pending retry applies only after a live trace
has been captured and invalidated.

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

Equality is the first propagation boundary. An equal write neither increments
the version nor visits the source index. `signal-always` and the `*-always`
derived forms select an equality function that always reports unequal; custom
`signal-by`, `derive-by`, and `memo-by` equality can deliberately stop a whole
downstream suffix tree.

## Continuation frontier

The work queue is an index of candidate work, not the semantic source of
truth. A `Resume-work(trace)` ticket is runnable only while that trace is
`Capture-pending` and none of its parent gates is pending or running. This is
the current continuation frontier. It ensures that an earlier invalidated read
rebuilds its suffix before a nested read from the obsolete generation can run.

Tickets blocked by an ancestor are deferred. Tickets whose trace became live,
draft, or dead are stale and are skipped by `take-work` while scanning the
queue. Source compaction is separate: it removes dead packed entries from a
source's capture index, not scheduler tickets. On the effect plane, the active
ticket also remains queued while it runs so a non-local final control operation
cannot lose the exact queued resumption ticket. These rules replace the
conventional combination of observer rank, dirty bit, and a queue entry
containing a retained action.

## Two execution planes and targeted settling

Each root owns two planes:

- `plane<total>` for derivations; and
- `plane<e>` for effects with the root's ambient host row.

This split is the type-safety boundary for synchronous memo reads. A
`derive-producer` can retain only a `plane<total>` and a pure continuation scope,
so targeted validation cannot accidentally resume an effectful UI continuation
under an erased effect row.

During a full flush, runnable pure derivations are advanced before user effects;
a pure ticket whose structural owner first needs an effect-plane generation is
deferred while the scheduler scans the rest of the pure frontier. Only then
does the flush advance effect work.

During `memo/get`, the `validate-derived` operation settles that memo before its
output cell is read. Targeted settling walks only the requested producer's
structural parent gates, input producer capabilities, state-entry target, and
nested child trace. It can resume the necessary pure K immediately and reports
`ok`, `deferred`, or `failed`; it never drains unrelated pure tickets or any
effect-plane queue. A per-producer settling guard and trace/gate states detect
cycles. This is why synchronous reads remain coherent without a global
topological rank or a full scheduler drain.

## `derive` and `memo(previous)`

Both APIs expose a read-only memo value backed by a source and pure producer,
and both pass publication through their selected equality function.

`derive` is stateless. Bootstrap invokes its calculator once, tracked reads
capture the calculator suffix, and later invalidation resumes those suffixes.
The producer retains its pure scope and settling guard, not the calculator.

`memo(previous)` adds state without subscribing to its own output. Before it
invokes the user calculator, bootstrap performs `State-entry-read` on the output
source. That operation captures a `Trace-entry` but does not add a source edge.
Each entry resume injects the latest successfully committed output as
`previous`, then executes the calculator suffix. The initial argument is used
until a value has committed successfully; a failed draft cannot become the next
state.

Reads beneath an entry target that entry capability rather than an ordinary
read node. Targeted settling checks the entry before and after input and child
settlement so work from an obsolete entry generation cannot win over the
replacement continuation. This state-entry routing is the semantic difference
between `memo(previous)` and a stateless `derive`; it is not a hidden mutable
observer field or an output self-dependency.

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

Every resumed suffix runs in a fresh draft frame. Work created during that
dynamic extent—child effect scopes, pure derivation scopes, and opaque resource
continuations for DOM listeners or region contents—is recorded in the frame's
ownership ledger. A resource's cleanup action is inside the parked K's
`finally`; the ledger stores only its abstract one-shot finalization capability.
On successful publication the draft frame becomes the live structural extent
of that trace node.

Replacing a generation first marks the old frame and its complete subtree dead,
then runs finalizers. This prevents cleanup code from attaching new reactive
work to a half-retired branch. A stale frame rejects registration, and root
disposal applies the same retirement transitively and idempotently.

This ownership ledger is explicit, but it is not part of dependency
propagation. Retirement first detaches the capability from its owner and then
calls `rcontext.finalize`, which enters the parked resource K's `finally` to
remove DOM listeners and ranges exactly once. No `Owned-cleanup` action closure
is retained as an alternate destruction path.

## Batching

A batch delays settling while writes still update source cells immediately.
Nested batches are counted on the root, and the outermost `leave-batch` flushes.
Synchronous memo reads remain coherent through targeted producer settlement.

Host re-entry is always one batched turn. This lets a callback register all of
its structural children before one of its writes can retire the registering
generation. At batch exit, an invalidated generation and every child created
during the callback are retired together.

## HTML builder and DOM live bindings

The `html<e>` effect is a synchronous, tail-resumptive view builder. `emit`
operations are handled by `view` and nested tag helpers to construct a
backend-neutral `view<e>` value. This makes ordinary Koka block syntax usable as
an HTML DSL, but the builder continuation is not retained or parked to drive
future UI updates.

The DOM adapter gives live nodes their reactive semantics at mount time:

- `Live-text`, `Live-attribute`, and `Live-property` each become a
  `create-effect` whose tracked half reads signals and whose apply half performs
  the untracked DOM mutation;
- `Region` becomes an effect whose tracked half returns the current child view
  and whose apply half mounts it between marker nodes; and
- static elements, text, fragments, and trusted HTML are mounted directly when
  their enclosing generation is created.

Consequently, updates resume the precise continuation of an affected live
binding, not a retained component-render closure and not the earlier HTML
builder. Replacing a region retires its old generation and owned reactive
children, clears the contents between its persistent marker pair, and then
mounts the new view. It is whole-range replacement, not keyed or virtual-DOM
reconciliation.

## Host callbacks and re-entry

Listener installation captures an opaque `reentry<e>` containing the current
root, continuation gate, and generation frame. When the browser later invokes
the ordinary retained callback, `reenter`:

1. rejects a retired or disposed frame;
2. sets the state-entry target to `Nothing`;
3. restores the captured effect-plane gate and frame;
4. installs fresh signal read/write handlers; and
5. runs the callback as one batch.

Reactive work created inside the callback is therefore owned by the exact DOM
generation that installed the listener and is retired with that region or
mount.

`reenter` does not itself advance a tracked-read K. It executes the ordinary
event callback under restored Kokaine structure; signal writes made by that
callback then invalidate and schedule the relevant read continuations in the
usual way.

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

The browser renderer currently replaces all content between a region's
persistent markers and does not provide keyed reconciliation, hydration,
suspense, or preservation of arbitrary outer handler stacks.
