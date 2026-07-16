# Kokaine architecture

Kokaine is a continuation-trace reactive runtime for Koka 3.2.3. Inside a
reified calculator or binding, a synchronous tracked read captures the
computation suffix at that read. Sources index those actual continuation
capabilities, and writes schedule the affected resumptions. There is no retained
calculation action or separate Observer graph used to recompute a reactive
function from its beginning.

The async layer described here is deliberately a Web UI surface. It binds
browser completions to the same structural generations, cancellation, and
batched re-entry rules as DOM listeners and reactive effects.

The architecture deliberately separates three concerns: algebraic effects name
and delimit capabilities, raw continuations provide the precise incremental
execution unit, and frames plus the scheduler order and retire those units.
Having effect-typed signal operations alone would not establish the second
property; the previous Observer implementation already had such an API.

## Module boundaries

The public module, `src/kokaine/reactive.kk`, exposes opaque roots, signals,
memos, re-entry capabilities, and the `run-async` delimiter. Its implementation
is split by responsibility:

| Module | Responsibility |
| --- | --- |
| `reactive/effects.kk` | `signal-read` and `signal-write` operations |
| `internal/model.kk` | sources, traces, planes, scopes, frames, and work tickets |
| `internal/capture.kk` | raw-handler reification of synchronous read suffixes |
| `internal/lifetime.kk` | draft transactions, ownership, and finalization |
| `internal/scheduler.kk` | invalidation, queueing, resumption, and targeted settle |
| `internal/handlers.kk` | write interpretation, sampled reads, and dispatch |
| `internal/reentry.kk` | continuation-derived host re-entry |
| `internal/async-runtime.kk` | generation-owned Web awaits and continuation turns |
| `kokaine/internal/event-runtime.kk` | guarded multi-shot browser-event continuation |
| `internal/runtime.kk` | roots and high-level signal, memo, and effect operations |
| `internal/bridge.kk` | unambiguous calls from the opaque facade |
| `kokaine/async.kk` | public structured-async facade |
| `kokaine/async/effects.kk` | await, cancellation, and scope algebra |
| `kokaine/async/channel.kk` | queued structured-strand resumptions |
| `kokaine/async/structured.kk` | `parallel`, `race`, and timeout composition |
| `kokaine/async/web.kk` | browser timer, Promise, and Fetch adapters |
| `kokaine/resource.kk` | tracked-source, generation-bound async Resource |

Koka has no package-private visibility. Concrete internal types are therefore
public inside their modules so sibling modules can share them; the facade wraps
them in abstract public values so application code cannot inspect the runtime.

## Semantic division of labor

`signal-read`, `signal-write`, `html<e>`, and the four-label `async` alias are
algebraic effect interfaces. They let callers express requirements in effect
rows and let scopes override interpretation: `untrack` changes tracked reads to
samples, `batch` changes when writes settle, nested HTML handlers collect only
their own emitted children, and `run-async` interprets each Web suspension under
the structural generation current at its call site.

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

## Browser async turn boundary

`run-async(root, action)` is the explicit boundary between a synchronous
reactive turn and direct-style Web async. It is installed only while a Kokaine
generation is current—for example, inside the re-entry batch which resumes a
DOM event continuation. The action runs normally until it returns or performs
`do-await`.

The action has a closed
`<async,signal-read,signal-write,pure,ui>` capability row. The root may still
carry a wider ambient row for synchronous framework plumbing, but an arbitrary
application handler cannot be retained by the parked suffix: later turns
reconstruct only Kokaine's reactive and async interpreters.

At an await, the raw async handler captures the suffix, registers it with the
current structural frame, and returns without resuming it. This is the turn
boundary: the event continuation returns, the re-entry batch closes, and
reactive work produced before the await can settle without a browser operation
holding that batch open.

The host completion callback never resumes the suffix on its own stack. The
first completion changes the task from `Task-pending` to `Task-scheduled` and
queues a microtask. This applies even when setup invokes the completion callback
synchronously. The microtask then:

1. wins only if the task is still scheduled;
2. moves the continuation, result, and structural portal into local values and
   clears every retained slot;
3. validates and re-enters the captured generation; and
4. installs a fresh async interpreter inside that re-entry batch before
   resuming the suffix.

Every continuation segment therefore runs in a finite, generation-validated
reactive turn. A later await repeats the same protocol. If retirement wins
before the microtask, the scheduled task is revoked and the microtask becomes
inert before it can touch reactive or user state.

The parked suffix is resumed shallowly and the primitive await prompt is the
innermost runtime prompt. Consequently none of the previous turn's base async
handlers are restored with the suffix: the interpreter installed by the new
re-entry turn is the nearest handler for its next operation. Fresh turn-local
handler state shares only a typed task family, so cancellation can still find
structured siblings which suspended in an earlier turn.

`async-host` performs a synchronous browser operation through the active
interpreter; `async-schedule` turns a browser action into another owned
microtask. These operations keep adapter work inside the same generation and
turn rules instead of letting a delayed callback retain an unguarded Koka
closure.

## Async generation ownership and cancellation

Every primitive await is represented by a one-shot generation task. Before
calling adapter setup, registration captures a `reentry<<ui|e>>`, links an
`on-cleanup` finalizer into the active frame, and records the task in its lexical
cancellation scope. Only after that owner link is durable may setup retain the
completion callback. A synchronous setup failure follows the same scheduled
completion path as an asynchronous exception.

The task state machine is:

```text
Task-pending -> Task-scheduled -> Task-running -> Task-completed
       |              |
       +--------------+-----> Task-canceled | Task-retired
```

Completion and cancellation race on this state, so only one path owns the
continuation. Both terminal paths revoke the result, portal, resumption, and
host disposer slots before invoking any callback or disposer. A patched or
hostile disposer may synchronously call the old completion function, but it
then observes a terminal task with no Koka payload. Timer cancellation clears
its handle, Promise cancellation clears its callback cell, and Fetch
cancellation clears both callbacks before aborting its controller.

The shared family contains active capabilities only. A terminal task is pruned
before user code is resumed, and its structural owner link is cleared through
a one-shot indirection. The long-lived owner ledger is left with only an empty
cell: it can no longer reach the family, task identity, continuation, portal,
or disposer after settlement. This keeps cross-turn structured cancellation
without turning either the family or owner ledger into a completed-task log.

`Cancel` is distinct from `Exception`. Public await wrappers translate it to
the final `discontinue` operation, so ordinary `catch` cannot turn cancellation
into a value. Final control still unwinds Koka `finally` clauses. During owner
retirement, a private retirement re-entry supplies only the handlers needed to
discontinue the already-owned strand; new async registration still sees the
dead frame and is rejected.

Cancellation scopes form an ancestor chain. `cancelation-scope` creates a
child, `cancel-outstanding` cancels its current scope, and a scope cancellation
visits only active descendant tasks. A task installed after its scope has been
canceled is retired immediately. The cancellation marker remains visible while
the lexical scope and its cancellation finalizers unwind, then is released;
structured groups release theirs only after every queued Cancel resumption has
drained. Root disposal and reactive generation replacement reach the same task
cleanup through the ordinary structural owner ledger, so explicit cancellation
and structural retirement share the one-shot finalization path.

Each resumed async turn also installs a fresh exception boundary. An exception
which is not handled by the resumed strand is reported as an uncaught Kokaine
async exception after its turn unwinds; it does not escape into a later browser
callback without a Koka handler.

## Web adapters

`kokaine/async/web` exposes direct-style operations over the primitive await
protocol:

- `sleep` and `yield` use a revocable timer subscription;
- `promise.await` wraps fulfillment and rejection in a callback cell which can
  be cleared even though settlement itself cannot be stopped;
- `fetch` owns an `AbortController`; `response.text` and `response.json`
  transfer that controller into the body await so retirement after headers
  still aborts a streaming body, while `response.require-ok` aborts and cancels
  an unconsumed non-OK body before raising the HTTP exception; and
- `timeout` composes a timer and action through structured `race`.

All setup boundaries catch browser setup failures and turn them into Koka
exceptions. One-shot task state also rejects duplicate completion from a
misbehaving source. `unsafe-promise` is intentionally named: the adapter cannot
prove that a JavaScript value matches its asserted Koka type. JSON likewise
remains `any` until a domain boundary validates it.

Adapter authors use `setup/await` when setup can fail and returns a disposer,
or the smaller `await0`/`await1` variants. The completion callback carries an
explicit `Result`, `Exception`, or `Cancel`; it is transport into the
generation runtime, not permission to resume user code directly.

## Structured concurrency

`parallel` and `race` do not expose detached child tasks. Each invocation owns
an isolated strand group and a child cancellation scope. `route-awaits` turns a
child's suspension into a registered non-blocking await whose completion
enqueues a phase-aware resumption selector. The parent driver consumes them
one at a time under its active async interpreter, preserving
browser-observed completion order without letting a host callback execute a
child suffix. Values are buffered before the driver is woken, so parent
retirement in the intervening microtask gap can still consume the cancellation
path and unwind the child.

The selector injects at most one synthetic `Cancel` into a losing strand. Once
that strand is unwinding, an await performed by its cleanup receives its real
host result; cleanup in a parent scope can therefore finish, while a real
`Cancel` from a canceled scope still discontinues it.

`parallel` waits for both values and preserves argument order. The first child
exception cancels its siblings, but the group continues driving until every
child has returned or completed cancellation unwinding. `race` records the
first terminal result, cancels the loser, and likewise drains the loser before
returning the winner. This makes loser disposers and `finally` clauses part of
the combinator's completion contract: an exception or final control raised by
cleanup replaces the provisional result, matching Koka's ordinary `finally`
semantics. `timeout-with` and the Web `timeout` adapter are ordinary `race`
compositions and inherit the same draining rule.

## Resource source and loader boundary

`kokaine/resource` binds a synchronous reactive source to a generation-owned
async loader. Its public state is one atomic signal:

```text
Unresolved
Pending(previous : maybe<a>)
Ready(value : a)
Failed(error : exception, previous : maybe<a>)
```

The source has the closed shape `() -> signal-read maybe<s>`. A `derive-by`
first applies source equality, then a `create-effect` tracks only that derived
snapshot and the Resource's private refresh/cancel signal. If an upstream write
produces an equal snapshot, the equality cut prevents effect invalidation, so
the current request generation and its host operation remain live.

The loader has the deliberately different shape
`s -> <async,ui,exn> a`. It receives the immutable selected snapshot and has no
`signal-read` capability. Reads before or after suspension therefore cannot
silently become dependencies; the compile-time boundary rejects an async
source and rejects async work inside pure `derive` or `memo` calculators.

Each unequal source change or refresh advances a logical request generation and
publishes `Pending(latest-success)`. The active loader is also structurally
owned by the corresponding effect generation, so replacement or root disposal
cancels its awaits and runs its finalizers. A numeric generation guard remains
at completion as defense against a host which invokes an already retired
callback. Only the winning generation may publish `Ready` or `Failed`.

The last successful value is retained across refresh and failure and is exposed
by `resource.latest`. Explicit `resource.cancel` retires an active loader and
restores `Ready(previous)` or `Unresolved`; a later unequal source change can
start work again. A `Nothing` source publishes `Unresolved` and clears the
cached success. State publication is atomic, so observers never have to combine
independent loading, value, and error signals into a possibly torn snapshot.

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

Mount construction is a commit boundary. The outer mount disposer is retained
before its bootstrap batch may flush; if any descendant bootstrap fails or
control abandons the call, that disposer retires the complete partially
published mount before the error escapes. Root construction applies the same
principle at a wider boundary and retires the unpublished root on action or
initial-drain failure.

Managed element and trusted-HTML roots carry an internal same-root re-entry
capability in a `WeakMap`. A later `mount` into such a node restores that exact
generation before registering its own scope, so physical nesting under a
dynamic region also becomes structural ownership. `mount-independent` opts out
when an independently disposed nested root is intentional. Retirement clears
the live portal and leaves only a numeric same-root tombstone, so an externally
retained stale node is rejected without retaining its root or generation frame.
Marker pairs are installed together, and range cleanup validates common
parentage and endpoint reachability before removing any node; a damaged range
therefore fails closed instead of scanning into foreign siblings. Cleanup
snapshots the validated nodes and then detaches each from its current parent, so
a custom element's synchronous `disconnectedCallback` cannot create a
half-removed range merely by moving a later node elsewhere.

## Host callbacks, event continuations, and re-entry

Listener installation captures both an opaque `reentry<e>` and an opaque
`event-continuation`. The latter is a real raw continuation parked at the
handled `await-browser-event` operation; its suffix contains the user action.
The retained JavaScript function is only the transport/ABI trampoline. When the
browser invokes it, the adapter snapshots the event, `reenter`s, and installs
`run-async` around the event-K resume:

1. rejects a retired or disposed frame;
2. sets the state-entry target to `Nothing`;
3. restores the captured effect-plane gate and frame;
4. installs fresh signal read/write handlers; and
5. synchronously resumes the event continuation as one batch until its first
   Web suspension.

Reactive work created inside the callback is therefore owned by the exact DOM
generation that installed the listener and is retired with that region or
mount.

`reenter` does not itself advance a tracked-read K and remains non-resumptive.
It supplies the structural/reactive handler context in which the separate event
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
callback, then performs structural re-entry and an actual event-continuation
resume. It still cannot reconstruct arbitrary user-defined handlers whose
lexical extent around `mount` has already returned. Accordingly, `callback` has
the closed `<signal-read,signal-write,ui,async,pure>` capability row. Kokaine
reinstalls the async handlers for every continuation turn. Any other
application effect must be handled inside the callback and is otherwise
rejected during type checking; it cannot silently become a delayed
missing-handler failure.

Koka's `pure` row includes modeled `exn`/`div`; such exceptions are reported by
the event boundary and unwind the batch normally. A native JavaScript throw from
an extern declared only as `ui` is instead an FFI contract violation: it bypasses
Koka handlers and `finally`. Adapter externs must catch native failures at their
innermost boundary and translate them to Koka `exn`, as the DOM adapter does.

## Verification map

Run the complete algebra and compile-time checks with `make test`. Install the
browser once with `make browser-install`, then run all real-browser lifecycle,
async, and Resource checks with `make test-browser`.

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
- `dom-event-continuation.kk` checks repeated multi-shot delivery, synchronous
  nested dispatch and `preventDefault`, plus rejection after retirement.
- `root-construction.kk`, `dom-mount-rollback.kk`, `dom-ownership.kk`, and
  `dom-range-safety.kk` check construction rollback, physical ownership, and
  non-destructive marker failure in native and real-browser paths.
- `event_effect_boundary.py` checks that a lexical-only application effect
  cannot enter a retained callback.
- `async-effects.kk` checks await result conversion, final cancellation, and
  scope ancestry with a deterministic handler.
- `structured-async.kk` checks ordered `parallel`, winning `race`, sibling
  cancellation, and loser finalizer draining without timing dependence.
- `derive-async-invalid.kk`, `memo-async-invalid.kk`,
  `resource-source-async-invalid.kk`, `run-async-effect-boundary-invalid.kk`,
  `enqueue-microtask-effect-boundary-invalid.kk`, and
  `async_effect_boundary.py` are
  compile-time canaries for the tracked/untracked async capability boundary.
- `dom-async-runtime.kk` plus `browser_async.py` check the microtask turn
  boundary, Promise and Fetch adapters, structured combinators, duplicate and
  late callbacks, setup failure, generation replacement, and root disposal in
  Chromium.
- `async-resource.kk` checks explicit equality, refresh/failure retention,
  explicit cancellation, rapid source churn, stale completions, and owner
  retirement in the browser.

The browser renderer currently replaces all content between a region's
persistent markers and does not provide keyed reconciliation, hydration,
suspense, or preservation of arbitrary outer handler stacks.
