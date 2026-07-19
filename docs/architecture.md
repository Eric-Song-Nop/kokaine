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

## Layering target

The dependency direction is intentionally one-way:

```text
DOM renderer / reactive Async adapter
                 |
                 v
reactive integration capabilities
                 |
                 v
reactive continuation kernel
```

The kernel knows only sources, traces, planes, scheduling, and lifetime
retirement. Integration owns capabilities needed by an external system:
persistent lifetime scopes, provisional construction, and retained host
re-entry. DOM owns renderer publication and browser event policy. Reactive
Async owns host-turn closure, task leases, and cancellation policy. A lower
layer must not import a higher one; a static boundary canary enforces this rule
in addition to Koka's module graph.

## Module boundaries

The public module, `src/kokaine/reactive.kk`, exposes opaque roots, signals,
and memos. Host-facing capabilities live in
`src/kokaine/reactive/integration.kk`. Implementations are split by
responsibility:

| Module | Responsibility |
| --- | --- |
| `reactive/effects.kk` | `signal-read` and `signal-write` operations |
| `internal/model.kk` | sources, traces, planes, scopes, frames, and work tickets |
| `internal/capture.kk` | raw-handler reification of synchronous read suffixes |
| `internal/lifetime.kk` | detached, iterative two-phase retirement |
| `internal/work-transaction.kk` | deque frontiers and local bootstrap groups |
| `internal/scheduler.kk` | invalidation, queueing, resumption, and targeted settle |
| `internal/handlers.kk` | write interpretation, sampled reads, and dispatch |
| `reactive/integration.kk` | host re-entry, borrowed provisions, exclusive leases, and lifetime scopes |
| `reactive/integration/internal/lifetime-scope.kk` | persistent integration-owned lifetimes |
| `reactive/integration/internal/provision.kk` | provision lease state, local drain, promotion, and rollback retirement |
| `reactive/integration/internal/reentry.kk` | captured lifetime context and batched host re-entry |
| `kokaine/internal/registry.kk` | shared O(1) intrusive registration, claim, and unlink |
| `kokaine/async/internal/one-shot-task.kk` | atomic host-task state and winning claims |
| `kokaine/async/internal/cancellation-supervisor.kk` | claim-first lexical scope cancellation |
| `reactive/async.kk` | public generation-owned Async integration |
| `reactive/async/internal/host-turn.kk` | rank-2 closure of retained completion/cancellation turns |
| `reactive/async/internal/runtime.kk` | generation-bound Web awaits and task leases |
| `kokaine/internal/event-runtime.kk` | guarded multi-shot browser-event continuation |
| `kokaine/internal/key-index.kk` | persistent balanced key lookup shared by renderers |
| `kokaine/dom/internal/keyed-transaction.kk` | renderer-owned keyed publication journal |
| `kokaine/control.kk` | memo branches and list/vector keyed control flow |
| `internal/runtime.kk` | roots and high-level signal, derived memo, and effect operations |
| `internal/bridge.kk` | unambiguous calls from the opaque facade |
| `kokaine/async/{effects,structured,web}.kk` | async algebra, groups, and timer/fetch adapters |
| `kokaine/web/window.kk` | one-shot window awaits, focus, and geometry |
| `kokaine/resource.kk` | tracked-source async Resource |

Koka has no package-private visibility. Concrete internal types are therefore
public inside their modules so sibling modules can share them; the facade wraps
them in abstract public values so application code cannot inspect the runtime.

## Semantic division of labor

`signal-read`, `signal-write`, `html<e>`, and `async` are algebraic effect interfaces.
They let callers express requirements in effect rows and let scopes override
interpretation: `untrack` changes tracked reads to samples, `batch` changes when
writes settle, and nested HTML handlers collect only their own emitted children.

An effect row reports operations that escape a function after local handling.
It does not attest that an operation was never performed inside the function,
and it does not say how reactivity propagates. Kokaine adds the missing runtime
boundary explicitly: every pure derivation bootstrap, resumption, and targeted
settlement enters a nested pure phase. Reactive writes, lifetime registration,
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
a continuation.

The initial calculation closure exists only in a one-shot bootstrap slot. The
slot is cleared before invocation. Once bootstrap has begun, neither a producer
nor a scheduler ticket retains `calculate`, `track`, or a full action as a
fallback; subsequent work comes from `trace-resume`. If that first bootstrap
fails or exits through final control, its starting scope is retired and the
cleared closure is not replayed. Pending retry applies only after a live trace
has been captured and invalidated.

## Source-local continuation indexing

A source contains its current cell, equality function, version, and a list of
rank-2 `packed-capture` values. Each package contains:

```text
(execution plane, captured read trace)
```

The rank-2 consumer can enqueue or inspect the capability without exposing its
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
4. changes each live trace to `Capture-pending` and queues
   `Resume-work(trace)`; and
5. flushes unless a batch or another flush is active.

`Capture-pending` and `Capture-running` describe the state of the actual
resumption. A write during a running suffix marks the same trace pending for a
later turn; it does not dirty a separate observer or enqueue a retained action.
Bootstrap tickets contain a scope whose one-shot bootstrap slot has not yet
been consumed.

Equality is the first propagation boundary. An equal write neither increments
the version nor visits the source index. `signal-always` and `derive-always`
select an equality function that always reports unequal; custom `signal-by`
and `derive-by` equality can deliberately stop a whole downstream suffix tree.

## Continuation frontier

The work queue is an index of candidate work, not the semantic source of
truth. A `Resume-work(trace)` ticket is runnable only while that trace is
`Capture-pending` and none of its parent gates is pending or running. This is
the current continuation frontier. It ensures that an earlier invalidated read
rebuilds its suffix before a nested read from the obsolete generation can run.

The queue is a mutable deque represented as a logical
`front ++ reverse(back)`. Invalidated resume tickets enter at the front; newly
registered bootstrap tickets enter at the back in amortized constant time.
Normalizing an exhausted back list is amortized across all preceding appends,
so wide registration does not repeatedly copy earlier capabilities.

Tickets blocked by an ancestor are deferred. Tickets whose trace became live,
draft, or dead are stale and are skipped while scanning the queue. Source
captures unlink themselves from their intrusive registry when retired, so no
later source compaction pass is required. On the effect plane, the active
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
a pure ticket whose parent lifetime first needs an effect-plane generation is
deferred while the scheduler scans the rest of the pure frontier. Only then
does the flush advance effect work.

During `memo/get`, the `validate-derived` operation settles that memo before its
output cell is read. Targeted settling walks only the requested producer's
parent gates, input producer capabilities, and nested child trace. It can resume
the necessary pure K immediately and reports `ok`, `deferred`, or `failed`; it
never drains unrelated pure tickets or any effect-plane queue. A per-producer
settling guard and trace/gate states detect cycles. This is why synchronous
reads remain coherent without a global topological rank or a full scheduler
drain.

## Derived values and accumulated state

`derive`, `derive-by`, and `derive-always` expose a stateless read-only
`memo<a>` backed by a source and pure producer. Bootstrap invokes the calculator
once, tracked reads capture calculator suffixes, and later invalidation resumes
those suffixes. The producer retains its pure scope and settling guard, not the
calculator. Publication passes through the selected equality function.

Accumulated values are modeled explicitly. A `signal` stores the mutable value;
a `create-effect` tracks the inputs and modifies that signal from its untracked
apply phase. This keeps history in the write/effect plane and leaves pure
derivations as functions of their current reactive inputs.

## Draft publication and failure

Resuming a pending trace creates a draft frame and records every continuation
captured during that attempt. A successful attempt retires the previous child
generation, publishes the new value or effect, activates the draft trace, and
marks its frame live.

If calculation, cleanup, or publication fails, the draft continuations and
owned lifetime children are finalized. The source write that triggered the
turn is not rolled back. The original continuation capability remains pending
and can be retried by a later flush; there is no recovery action that reruns
the whole calculation. An abortive final control operation follows the same
dynamic rollback path even though it does not return an `Error` value.

## Continuation and integration lifetimes

Every resumed suffix runs in a fresh draft frame. Work created during that
dynamic extent—child effect scopes, pure derivation scopes, and opaque resource
continuations for DOM listeners or region contents—is inserted into removable
child or finalizer registries on the frame's lifetime owner. Each registration
has an O(1), idempotent unlink handle. A resource's cleanup action remains
inside the parked K's `finally`; the registry retains only its abstract
one-shot finalization capability. On successful publication the draft frame
becomes the live lifetime extent of that trace node.

Replacing a generation first marks the old frame and its complete subtree dead,
then runs finalizers. This prevents cleanup code from attaching new reactive
work to a half-retired branch. A stale frame rejects registration, and root
disposal applies the same retirement transitively and idempotently.

Lifetime ownership is explicit, but it is not part of dependency propagation.
Retirement seals and detaches the complete owned subtree, marks every
scope dead, and only then runs collected finalizers iteratively. Cleanup calls
`rcontext.finalize`, which enters the parked resource K's `finally` to remove
DOM listeners and ranges exactly once. Explicit unregistration consumes the
resource capability as well as its registry handle.

Integrations sometimes require a lifetime that outlasts any one trace
generation. `kokaine/reactive/integration` exposes a persistent lifetime scope
for that purpose. The scope contains only a lifetime frame, captured generation
gate, and removable registration under its parent; it owns no queue or
publication journal. Each keyed region opens one integration scope, and every
business key opens a child row scope. Reordering retains that child scope,
deletion unlinks and retires it exactly once, and retiring the enclosing region
or root reaches the same row subtree transitively.

## Batching

A batch delays settling while writes still update source cells immediately.
Nested batches are counted on the root, and the outermost `leave-batch` flushes.
Synchronous memo reads remain coherent through targeted producer settlement.

Host re-entry is always one batched turn. This lets a callback register all of
its lifetime children before one of its writes can retire the registering
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
mounts the new view. An ordinary `Region` is whole-range replacement; keyed
reconciliation is represented separately by `Keyed-region`.

Mount construction is a commit boundary. The outer mount disposer is retained
before its bootstrap batch may flush; if any descendant bootstrap fails or
control abandons the call, that disposer retires the complete partially
published mount before the error escapes. Root construction applies the same
principle at a wider boundary and retires the unpublished root on action or
initial-drain failure. Before constructing the first view, `mount` also installs
an idempotent `attachShadow` observer on the parent's DOM realm. Kokaine-created
elements and trusted-HTML parse results are recorded at their creation boundary;
imperative and declarative closed-shadow hosts are recorded separately.

Managed element and trusted-HTML roots carry an internal same-root re-entry
capability in a `WeakMap`. A later `mount` into such a node restores that exact
generation before registering its own scope, so physical nesting under a
dynamic region also becomes lifetime ownership. `mount-independent` opts out
when an independently disposed nested root is intentional. Retirement clears
the live portal and leaves only a numeric same-root tombstone, so an externally
retained stale node is rejected without retaining its root or generation frame.
Marker pairs are installed together, and range cleanup validates common
parentage and endpoint reachability before removing any node; a damaged range
therefore fails closed instead of scanning into foreign siblings. Cleanup
snapshots the validated nodes and then detaches each from its current parent, so
a custom element's synchronous `disconnectedCallback` cannot create a
half-removed range merely by moving a later node elsewhere.

## Native control flow and keyed reconciliation

`kokaine/control` builds two kinds of backend-neutral structure. `branch`
accepts a memo and emits an ordinary dynamic region; `when` is its boolean
specialization with an optional empty fallback. `for` has list and vector
overloads. Each packages a tracked collection reader, native sequential walker,
business-key function, comparator, item equality, and row builder into an
existential `keyed-plan`. The plan deliberately exposes no indexing operation,
so the list path never detours through a vector.

The row builder receives read-only item and index accessors. DOM interpretation
backs those accessors with row-owned sources. A retained key therefore keeps
its marker range, actual DOM objects, listeners, continuation frame, local form
state, and nested reactive/resource ownership; only unequal item values and
changed indexes publish. A deleted key retires the row owner after a successful
commit.

Reconciliation uses a persistent AVL key index. One sequential source walk
constructs the desired table and update list with `O(log n)` lookup/insertion,
so table construction is `O(n log n)`. Draft bootstrap uses a deque-backed
provision rather than scanning the global frontier. `provision` is a borrowed
identity; only its `provision-lease` can drain, promote, or discard the local
work. This lets integrations decide participation without giving a nested
joiner authority over its owner.
Inserting a duplicate key fails the draft. DOM ordering is then a four-part
transaction:

1. build draft rows and validate keys/equality without publishing the new table
   or any retained-row source updates;
2. drain only the provision-local bootstrap FIFO while resumptions remain on
   the global frontier; nested keyed construction enlists a two-phase
   prepare/publish participant in the mount's renderer-owned journal;
3. prepare and revalidate every enlisted DOM change, promote the independent
   provision lease, and only then publish the renderer journal plus the outer
   keyed table; and
4. retire stale rows through an explicit pending-retirement ledger which keeps
   a failed host cleanup retryable without making unmanaged DOM invisible to
   the authoritative table.

On bootstrap failure or abortive final control, reconciliation aborts and
detaches the local work groups before cleanup can re-enter, then disposes every
rollback-reachable draft and rolls back every enlisted publication. On a move
or participant-prepare failure, it restores the previous row order and disposes
draft owners before rethrowing. A nested adapter receives only a borrowed
`provision`, so it cannot steal promote/discard authority from its outer owner
or publish merely because its own call returned. The mount-level keyed context
maps that exact provision identity to the renderer journal. If an active
provision belongs to another integration, keyed reconciliation fails closed;
Reactive neither stores the journal nor decides renderer ownership.
Joined keyed reconciliation is intentionally initial-only: updating retained
rows would require signal writes in the journal's total publication suffix, so
that case fails closed instead of weakening the two-phase contract.

The pending-retirement ledger is part of the authoritative keyed table, not a
best-effort cleanup list kept off to the side. Each entry owns a one-time DOM
snapshot of the complete stale range. Successful physical removal pops the
entry before owner cleanup runs; a host failure leaves the unconsumed suffix in
the table and later reconciliation retries from the snapshot even when marker
endpoints were already detached by a commit-then-throw primitive. Explicit
reactive `update` boundaries flush previously failed work even when the new
signal value compares equal, so an exact-value retry can make progress after
the host primitive recovers.

The range primitive validates
common parentage, endpoint reachability, and an out-of-range insertion target
before extraction;
it moves existing nodes rather than cloning them and restores focus/selection
when the host move disturbs it. The snapshot follows open shadow roots and
retains input selection direction or DOM Selection anchor/focus direction. It
starts from the keyed parent's own document rather than the module's global
document, so same-origin iframe mounts use that document's active element,
Selection, fragment, and native Node operations. It replays state only when it
changed, so a native state-preserving move does not redundantly invoke focus or
selection restoration. A fragment fallback fails before the first move when
focus is retargeted through an opaque shadow host or the host cannot inspect and
restore a shadow-root selection. Every restoration is verified; a detached
endpoint, ineffective `focus()`, or missing Selection API becomes a move
failure. If host interference makes restoration itself impossible, the adapter
raises a combined rollback error instead of publishing the new table or
retained-row sources.

The adapter resolves `moveBefore` from the keyed parent's same-realm prototype
(`Element`, `DocumentFragment`, or `Document`) and uses it only when the parent
exposes that exact primitive. Forward movement and rollback therefore share the
same state-preserving operation and cannot be split by an instance polyfill.

Every custom-element-shaped node reachable through light DOM or an open shadow
root in a keyed region whose physical order changes makes the update fail before
touching the DOM. This includes autonomous names and customized built-ins—even
when `getAttribute("is")` does not reflect their internal `is` value, their
prototype metadata is altered, or their definition lives in a scoped or foreign
registry. Custom-element lifecycle callbacks are captured when the definition
is registered, are not introspectable later, and run synchronously during a
move; even a
`connectedMoveCallback` could observe a partial physical order before retained
item/index sources commit.

Closed roots need a provenance check because the platform does not expose their
contents. The per-realm observer records every closed root created through the
current `attachShadow` primitive. A tracked closed host is rejected; a
pre-mount external element that could host an untracked closed root is rejected
conservatively; foreign-realm elements and a replaced observer also fail
closed. Framework-created elements and trusted HTML remain eligible for the
validated native or fragment paths, including ordinary `div`/`span` content.
Initial mounts, data-only updates, and keyed updates whose physical order
already matches remain unaffected.

The atomicity claim coordinates two independent owners: Reactive owns draft
bootstrap work, while the renderer owns authoritative table/source publication.
No joined or outer state becomes visible until every renderer prepare succeeds.
Browser DOM preparation itself is not a reversible database transaction.
Ordinary ranges are restored on modeled failure, and
custom-element or opaque lifecycle cases which could synchronously observe an
unrecoverable partial move are rejected before mutation. Stale-row removal is
deliberately post-commit; while it is pending, the table explicitly records the
physical retirement rather than pretending the leftover DOM is unmanaged.
Arbitrary external MutationObserver callbacks or hostile DOM monkeypatches may
observe transient preparation steps, but cannot silently transfer or erase the
adapter's publication/rollback authority.

This provenance guarantee assumes cooperative DOM code. JavaScript can retain
or borrow an unwrapped native `attachShadow` function and thereby create a
closed root that no standards API can enumerate afterward. Direct calls through
such saved or foreign primitives, masking native DOM accessors, and mutation of
Kokaine's internal registries are outside the adapter contract; detectable
prototype replacement still fails closed.

SSR eliminates the same keyed plan as one snapshot. It performs the native
sequential walk, checks keys through the balanced index, constructs constant
item/index accessors for each row, and renders in source order. It does not
retain row state, but it applies the same duplicate-key rule as the browser.

## Host callbacks, event continuations, and re-entry

Listener installation captures both an opaque `reentry<<ui>>` and an opaque
`event-continuation`. The latter is a real raw continuation parked at the
handled `await-browser-event` operation; its suffix contains the user action.
The retained JavaScript function is only the transport/ABI trampoline. When the
browser invokes it, the adapter snapshots the event and `reenter`:

1. rejects a retired or disposed frame;
2. restores the captured effect-plane gate and lifetime frame;
3. installs fresh signal read/write handlers; and
4. synchronously resumes the event continuation as one batch.

Reactive work created inside the callback is therefore owned by the exact DOM
generation that installed the listener and is retired with that region or
mount.

`reenter` does not itself advance a tracked-read K and remains non-resumptive.
It supplies the lifetime/reactive handler context in which the separate event
K is resumed. Signal writes made by the resumed action then invalidate and
schedule tracked-read continuations in the usual way.

The event master is multi-shot so repeated and synchronously nested DOM
dispatches preserve native ordering. An opaque live/retired cell prevents a raw
resumption after ownership retirement. Cleanup gates the capability before
detaching the JavaScript listener, drops the only stored K, and clears the
trampoline's mutable action cell. Thus even failed host removal leaves an inert
function that no longer retains the root or portal. The parked suffix has not
begun the user action and therefore owns no acquired cleanup.

This boundary is intentionally precise. Browser delivery begins with an ABI
callback, then performs generation re-entry and an actual event-continuation
resume. It still cannot reconstruct arbitrary user-defined handlers whose
lexical extent around `mount` has already returned. Accordingly, `callback` has
the closed `<signal-read,signal-write,ui,async,pure>` capability row. An
unsupported application effect must be handled inside the callback and is
otherwise rejected during type checking; it cannot silently become a delayed
missing-handler failure. DOM event delivery already has a closed public
callback row and does not use the Async host-turn runner. Its ABI trampoline
enters the integration-owned `reentry` capability directly before resuming the
separate event continuation.

Koka's `pure` row includes modeled `exn`/`div`; such exceptions are reported by
the event boundary and unwind the batch normally. A native JavaScript throw from
an extern declared only as `ui` is instead an FFI contract violation: it bypasses
Koka handlers and `finally`. Adapter externs must catch native failures at their
innermost boundary and translate them to Koka `exn`, as the DOM adapter does.

## Browser async task leases

`kokaine/reactive/async.run-async(root, action)` is the explicit boundary for
direct-style Web async. The reactive core does not import this integration
module; it supplies only the root and generation capabilities used by it.
An await parks only its suffix and returns from the initiating reactive turn.
Even a synchronously reported setup result is queued as a microtask, so every
continuation after an await enters a fresh reactive batch through the captured
generation. Before that retained callback runs, the Async adapter closes the
complete turn through its rank-2 `host-turn-runner`.

Each host operation is a task lease backed by `one-shot-task`'s single state
cell. Its only winning transitions are Pending to Ready, Ready to Running, and
Pending or Ready to Terminal. Payload, result, and disposer are removed from
the cell by the winning claim before any host callback, parked continuation, or
user finalizer runs. A disposer returned after another transition has already
won is returned to setup code and invoked immediately.

Tasks in one active lexical `async-scope` share a registry-backed cancellation
supervisor and one lifetime cleanup registration. Normal completion claims
Ready, unlinks its cancellation registration in O(1), and detaches the empty
supervisor before re-entry. Cancellation or lifetime retirement instead:

1. seals and detaches the supervisor registry;
2. claims every sibling task state;
3. unlinks the aggregate lifetime, family, and direct-index registrations;
4. unwinds every cancel continuation and lexical `finally`; and only then
5. invokes the detached host disposers.

Subtree cancellation applies the same claim/unwind/dispose phases across every
matching scope supervisor. A hostile disposer can therefore re-enter only after
all affected tasks are terminal and every registry count is zero. The family
indexes active scope supervisors directly by opaque scope identity and keeps a
separate intrusive registry for subtree enumeration. Steady-state completion and
sibling-heavy setup therefore do not scan or compact a stale task list. The
direct index is a reclaimable hash table: intrusive registrations unlink in
O(1), geometric rehashing is amortized O(1), and deletion shrinks capacity back
toward the number of active scopes instead of retaining a historical ID/vector
high-water. Scope equality and ancestry require both namespace and process-wide
identity, so a foreign root cannot cancel or mark the family's native scopes.
The actual family root still claims every family-owned supervisor explicitly,
including a deliberately routed foreign scope.

Every lifetime in one root execution plane shares a retirement coordinator.
If a detached cleanup snapshot requests `root.dispose()`, the root immediately
enters `disposing` (rejecting new ownership and suppressing flush) but remains
readable/writable to already-claimed cleanup. The request is coalesced until the
outermost snapshot drains, then the private root retirement runs exactly once.
Coordinators are per root, so nested cleanup may retire another root without
consuming or blocking the first root's deferred request.

Ordinary host completion uses validated `run-reentry`. Retirement has a
narrower internal re-entry which restores the already captured reactive context
solely to discontinue the parked strand after its frame is dead. Both paths run
inside the Async-owned `host-turn-runner`. The current public `ui` surface uses
an identity runtime function, but the rank-2 field is the type-level boundary
which closes the whole completion or cancellation turn. Any attempt by a
canceling `finally` to register fresh work is rejected by the dead frame.

Promise, timer, Fetch, window-event, structured concurrency, and `Resource`
adapters all use this protocol. The window adapter races revocable one-shot
`scroll` and `hashchange` awaits; its ABI callback only clears the subscription
and completes the await, while application policy runs after generation
re-entry. Host values which intentionally outlive one await use a separate
one-shot disposer lease; Fetch transfers that lease from header delivery to
body consumption or explicit discard instead of leaving it in the completed
task. Both generation lease groups and structured child discard ledgers use the
shared intrusive registry: explicit transfer is O(1), seal-detach claims the
complete rollback snapshot, and stale handles no longer retain sibling values.

## Verification map

- `trace-semantics.kk` checks exact suffix capture and dynamic branches.
- `targeted-settle*.kk` and `execution-planes.kk` check isolated producer
  settlement and the pure/effect split.
- `derived-structural.kk` and `structural-scopes.kk` check derived replacement,
  cleanup, and stale-frame rejection.
- `integration-boundaries.kk` checks persistent row ownership, exact borrowed
  provision identity, exclusive leases, and failed-prefix cleanup. Renderer
  journal ordering is guarded separately by `keyed_transaction_boundary.py`
  and the keyed browser fixture.
- `control-flow.kk` checks conditional/list/vector snapshots and duplicate-key
  parity; `key-index.kk` checks balanced lookup under adversarial insertion.
- `final-control-rollback.kk` checks abandoned drafts and exact-K retry.
- `continuation-reentry.kk` checks callback-created ownership and stale re-entry.
- `dom-lifecycle.kk` plus `browser_counter.py` check listener, region, and mount
  retirement in a real browser.
- `dom-keyed.kk` exercises retained node identity, item/index publication,
  reorder/insert/delete, focus, event re-entry, cleanup, rollback, and exact-
  value recovery of a failed pending retirement.
- `dom-event-continuation.kk` checks repeated multi-shot delivery, synchronous
  nested dispatch and `preventDefault`, plus rejection after retirement.
- `root-construction.kk`, `dom-mount-rollback.kk`, `dom-ownership.kk`, and
  `dom-range-safety.kk` check construction rollback, physical ownership, and
  non-destructive marker failure in native and real-browser paths.
- `event_effect_boundary.py` checks that a lexical-only application effect
  cannot enter a retained callback.
- `async-effects.kk` and `structured-async.kk` check await, final
  cancellation, ordered groups, loser draining, and cleanup failure rules.
- `internal-int-index.kk` checks 12,000 keyed registrations, geometric growth
  and shrink, collision unlink, key reuse, and stale-handle severance.
- `async-owner-registration.kk` checks both completion-first and
  retirement-first races and requires every disposer/finally to observe all
  same-scope task and owner registrations already detached. It also covers
  hostile sibling/family disposers, deferred root retirement, retained lease
  cleanup, and nested disposal of two independent roots.
- `async-runtime-scale.kk` checks 12,000 completions, pending cancellations,
  distinct-scope claims, explicit lease unlinks, and lease retirement without
  recursive cleanup or stale task scans; `browser_async.py` exercises the full
  host protocol.
- `async-resource.kk` checks refresh, cancellation, stale results, and host
  value lease promotion/replacement.
- `report_html.py` and `browser_report.py` require one Koka-owned document,
  revocable window awaits, scheduler sleep ownership, responsive navigation,
  and the complete report interaction surface in Chromium.

The browser renderer still replaces all content between an ordinary region's
persistent markers. `Keyed-region` adds explicit business-key reconciliation;
hydration, suspense, and preservation of arbitrary outer handler stacks remain
outside the current scope.
