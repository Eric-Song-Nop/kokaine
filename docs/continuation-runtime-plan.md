# Continuation runtime decision record

Status: implemented, including a guarded host-event continuation boundary.

## Decision

Kokaine implements fine-grained propagation by capturing the real synchronous
continuation suffix at each `get` occurrence in a calculator or binding running
under `reify-trace`. A source indexes those continuation capabilities directly.
Writes schedule and resume the affected suffixes; they do not wake an Observer
whose retained action reruns a reactive function from its beginning. Sampled
and ordinary dispatched reads return a cell value without leaving a trace.

Algebraic effects provide the typed operation and handler boundaries around
this mechanism; they are not, by themselves, the incremental mechanism. The
decision therefore has two independent parts:

1. keep `signal-read`, `signal-write`, and `html<e>` as composable capability
   interfaces; and
2. make the `raw ctl` continuation of synchronous `Track-read` the necessary
   unit of propagation.

An effect row records operations left unhandled by a function. A local handler
can discharge an operation before it reaches that boundary, so the design does
not claim that types alone detect a hidden or "smuggled" write handler. The
runtime closes that gap with a nested, runtime-wide pure phase around all
derivation execution and targeted settlement. Framework mutation, ownership
registration, disposal, and re-entry check that phase before changing state;
behavioral canaries cover same-root and cross-root attempts.

## Why this decision was necessary

The earlier runtime exposed effect-typed signal operations but propagated with
a conventional observer mechanism:

```text
get -> subscriber wake callback -> dirty observer -> queue -> retained action
```

A continuation was parked around that loop, but bypassing its resume path did
not change UI behavior. It therefore contributed lifetime wrapping rather than
incremental semantics.

The replacement had to make continuation use observable and necessary:

- invalidating a source must resume code after the corresponding read;
- code before that read must not run again;
- the queue must contain resumptions, not observer/action pairs; and
- removing the raw resume path must break propagation tests.

## Options considered

### Retain an Observer graph and improve its continuation wrapper

Rejected. It preserves behavior, but the graph, dirty state, and retained action
remain the semantic engine. Continuations can again be bypassed without changing
propagation.

### Require an explicit reactive `await`

Technically straightforward: a computation can suspend at an explicit point
and a write can resume it. It was rejected for ordinary signals because it
changes synchronous `get` into a different programming model and gives up the
desired direct-style API.

Event delivery does use an await-style capture, but not a one-shot loop. DOM
dispatch is synchronous and can nest before the outer action returns, so a loop
would not have parked its next K in time. Kokaine instead captures one
multi-shot master at `await-browser-event` and exposes it through an opaque
live/retired gate whose revocation is one-way.

### Capture the suffix of synchronous `get`

Chosen. `read-source` is a control operation; inside `reify-trace` its raw
handler receives an `rcontext` that is the exact remainder of the calculation
after that read. Nested reads naturally produce a trace, and dynamic branches
are rebuilt by whatever suffix actually runs.

Every tracked read occurrence inside that reified calculation is captured. Two
consecutive `get`s of the same source do not share a token: the second read is a
child trace inside the first read's suffix. If one write makes both pending, the
parent is the runnable frontier. Resuming it executes only code after the first
read, captures a new second-read child if control still reaches that operation,
and retires the old child on successful replacement. This is essential both for
the exact prefix/suffix guarantee and for branch-sensitive dependencies.

## Capability assessment

Koka 3.2.3 provides the required primitives:

- raw control handlers expose `resume` and `finalize`;
- abstract, effect-indexed types keep a continuation paired with its plane;
- rank-2 Church packaging can hide an ambient effect row while allowing a
  polymorphic source invalidation operation; and
- `finally` supplies dynamic rollback for exceptions and final control.

The central type risk is resuming an effectful continuation while pretending it
is pure. Kokaine avoids that conversion instead of casting it:

- derivations use `plane<total>`;
- effects use `plane<e>`; and
- a `derive-producer` can contain only a pure plane and pure scope.

Cross-plane owner relationships retain only a non-effectful continuation gate.
They can validate state or defer work, but cannot resume an erased effectful K.

Tracked propagation is explicitly **not affine**. A live trace retains typed resume and
finalize capabilities and can be invalidated and resumed on multiple turns;
state transitions prevent concurrent use or scheduling after retirement.
Failure while replacing an already captured generation leaves that same
continuation pending for retry instead of retaining the original calculation as
a fallback. The bootstrap closure is separately one-shot: it is cleared before
its first run, and an initial bootstrap failure retires the scope rather than
replaying that closure.

The event boundary also uses a multi-shot raw resumption, but exposes it only
through an opaque state cell. Retirement atomically replaces `Event-live(K)`
with `Event-retired`. While live, the capability intentionally supports
repeated and nested delivery; after the one-way transition, every resume is
rejected even though the underlying raw K would have been reusable.

## Runtime invariants

The implementation is accepted only while all of the following remain true:

1. A `Track-read` handled inside `reify-trace` captures the raw suffix at that
   synchronous read; sampled or ordinary dispatched reads leave no trace.
2. A source entry contains an actual typed plane, target trace, and owning read
   trace, not a wake callback.
3. A resume ticket contains a trace. It never contains an observer plus action.
4. `derive-producer` contains a pure plane, continuation scope, and cycle guard;
   it does not contain `calculate`.
5. The only initial calculation closure is in a one-shot bootstrap slot, and
   that slot is cleared before invocation.
6. Source versions detect writes that happen while a continuation generation is
   still a draft.
7. Draft traces are activated only after publication succeeds. Failed or
   abandoned drafts are finalized.
8. A pending replacement K remains retryable after failure or final control
   without replaying the prefix before its read; an initial bootstrap failure
   instead retires its one-shot scope.
9. Synchronous memo validation follows only typed pure-producer capabilities.
10. Structural children belong to the continuation frame that created them and
    cannot register from a retired frame.
11. Re-entry restores a captured effect-plane gate and frame, resets the
    state-entry target, and executes one batched turn.
12. A DOM callback snapshots the event and resumes `Event-live(K)` under that
    re-entry; retirement drops K before listener removal, and `Event-retired`
    rejects every later callback.
13. Repeated tracked read occurrences are distinct nested traces; the scheduler
    runs only the earliest pending ancestor on the current frontier.

## What “no dependency graph” means here

The old Observer graph, node/rank machinery, subscriber closures, dirty flags,
and retained actions are gone. The runtime still has graph-shaped data:

- a source-local list of packed continuation capabilities;
- parent gates and nested trace children; and
- explicit pending/running scheduler states.

These are the continuation trace and its index, not a second graph whose nodes
stand in for computations. Documentation should say “no separate Observer
dependency graph,” not claim that the runtime contains no relationships or
queues at all.

## Frontier scheduling and typed settlement

An unequal source commit increments its version, walks the source-local packed
captures, and queues `Resume-work(target)` for each newly pending target. The
package also retains the owning read so dead generations can be ignored and a
state-entry target can be distinguished from the read that indexed it. Equality
cuts propagation before this walk.

The queue does not make every ticket immediately runnable. A pending trace whose
parent is also pending or running is below the current continuation frontier
and is deferred. The earliest pending ancestor resumes first and replaces the
nested generation; stale descendant tickets are later skipped by state. This
is the continuation equivalent of ordering work, without observer ranks or
dirty/action pairs.

Each root has a pure `plane<total>` for derivations and a `plane<e>` for user
effects. Full flushes advance the runnable pure frontier before effect work.
More importantly, a synchronous derived read calls `validate-derived` and
settles only that producer's typed parent gates, input producers, entry target,
and child trace. It cannot drain unrelated pure work or resume an effectful UI
continuation through an erased row. `ok`, `deferred`, and `failed` results plus
a per-producer guard make dependency ordering and cycle behavior explicit.

## Stateless and stateful derivations

`derive` is stateless. Its bootstrap invokes the calculator once, then retained
read continuations calculate future values from current sources. Publication
passes through the derived source's equality function, so equal results do not
invalidate downstream traces.

`memo(previous)` cannot subscribe to its own output and then behave like an
ordinary acyclic memo. It instead captures a distinct state-entry continuation.
Each entry resume injects the latest committed value. Reads under that entry
target the entry K so a change restarts the correct stateful suffix. Targeted
settlement checks the entry before and after nested work to discard obsolete
branch failures and deferrals.

## Frames and lifetime

A trace is both an execution boundary and the parent of a structural
generation. Each replacement resume runs in a draft frame that records child
effects, derived scopes, and opaque parked resource continuations for listeners
and region contents created by that suffix. The cleanup action lives in the
resource K's `finally`; the owner ledger retains only its one-shot finalize
capability. Only a successful publication activates the draft. Replacement
marks the previous frame subtree dead before finalizing its resources, so
cleanup cannot register new work into a half-retired generation.

This explicit owner ledger is necessary even though the Observer graph was
removed. It answers "what must be finalized with this continuation generation,"
not "which calculations should a source wake." Root disposal walks the same
structure and is exhaustive and idempotent.

## Failure and final control

A replacement attempt executes in a draft frame. Every raw continuation and
structural child created during the attempt is recorded. On failure, or when a
final control operation abandons the dynamic call without returning an error,
finalizers retire the draft synchronously.

The triggering source commit remains committed. The affected trace remains
pending, so a later flush retries the same captured suffix with current source
state. This is deliberately not rollback to a retained old action.

That retry rule applies after a live trace has been invalidated. Initial
bootstrap is different: its slot is cleared before invocation, and bootstrap
failure or abort retires the starting scope. There is no initial calculation
closure left to replay.

The public construction boundaries add one more transaction layer. `create-root`
keeps its initial batch unpublished until the action and first drain succeed;
failure retires the candidate root instead of flushing queued work during
unwind. DOM `mount` retains its outer disposer before flushing descendants and
uses it to roll back the whole mount if a later child bootstrap fails.

## HTML and UI consequence

The `html<e>` handler and the reactive continuation runtime are complementary,
not the same mechanism. `view` and nested tag handlers synchronously consume
`emit` operations to build a backend-neutral tree. The HTML builder
continuation is not retained as a component render loop.

At DOM mount time, each live text, attribute, property, or region is translated
into `create-effect(track, apply)`. The tracked half runs inside `reify-trace`
and captures its synchronous signal-read suffixes; the apply half mutates the
DOM without adding dependencies. A region keeps a persistent marker pair; its
generation owns the mounted children and cleanup that clears between those
markers. Replacing the binding's continuation generation retires those children
and clears the old contents before mounting the replacement. This is
fine-grained live binding plus whole-region replacement, not virtual-DOM
reconciliation.

## Host re-entry decision

Browser listeners must outlive the lexical call to `mount`, but a normal host
callback does not preserve Koka's dynamic handler stack. Listener installation
therefore captures two separate capabilities:

- `reentry<<ui>>` stores the structural capability needed by the DOM runtime:
  root, generation gate, and generation frame; and
- `event-continuation` stores the user action after a handled
  `await-browser-event` operation as an opaque raw multi-shot resumption.

On invocation the JavaScript callback snapshots the raw DOM event, reinstalls
Kokaine's signal handlers and structural context, and synchronously resumes the
event continuation inside one batch. This both preserves native nested
`dispatchEvent` ordering and makes event-created memos, effects, and cleanups
retire with the listener's generation.

The raw master is deliberately multi-shot. A one-shot `await-event` loop cannot
capture its next K until the current action returns, so a nested DOM dispatch
would be delayed or reordered. An opaque `Event-live` / `Event-retired` cell
makes retirement one-way while permitting repeated delivery when live. Cleanup
gates it first, drops the sole stored resumption, and then removes the
JavaScript listener. It also clears the trampoline's mutable action cell before
that host call, so failed removal cannot retain the root/portal closure. The
parked suffix has not begun the user action and owns no acquired finalizer, so
dropping it is cancellation rather than an unrun cleanup. `reentry` still does
not fabricate arbitrary outer user handlers; that is why the callback row
remains closed.

## Consequences

- Invalidating a captured read does not replay code before that capture. Such a
  prefix can still lie inside an ancestor read's suffix and run when that
  ancestor is invalidated; tests assert each exact boundary.
- Source invalidation is local, but source capture compaction and deep retirement
  still have costs that should be measured under large traces.
- The structural ownership ledger remains explicit because raw continuations,
  parked resource Ks, DOM ranges, and listeners require deterministic
  retirement. Resource cleanup is entered by `rcontext.finalize`, not by an
  owner-stored action closure.
- JavaScript remains the event transport ABI, while the user action is entered
  only by resuming the guarded event continuation under structural re-entry.
- The public callback row is closed over the capabilities reinstalled by this
  boundary. Arbitrary application effects need a handler inside the callback;
  otherwise type checking rejects the listener. A future host runner may widen
  this contract explicitly. Until such a runner exists, DOM mounts and
  `run-async` accept only `root<<ui>>`.
- Modeled Koka `exn` (included by `pure`) unwinds and closes the host batch. A
  raw JavaScript throw from an extern declared merely `ui` violates its FFI
  effect contract; adapters must translate such failures at the innermost host
  boundary instead of relying on a top-level listener catch.
- Region updates replace contents between persistent marker nodes; the
  continuation runtime does not imply keyed reconciliation.
- Later mounts into same-root managed DOM inherit the creating continuation
  generation. Explicit `mount-independent` is required to opt into a separately
  owned nested lifetime.

## Verification and mutation canaries

The important tests are behavioral rather than source-string checks:

- `trace-semantics.kk` proves prefixes are not replayed and dynamic suffixes are.
- `targeted-settle-canary.kk` fails if a synchronous memo read skips producer
  validation.
- `execution-planes.kk` exercises target isolation and pure/effect separation.
- `entry-targeted-settle.kk` fails if state-entry routing is bypassed.
- `final-control-rollback.kk` proves abandoned drafts retry through the exact K.
- `continuation-reentry.kk` fails if re-entry is changed to plain root dispatch.
- `resource-finalization.kk` proves resource capture is parked, one-shot, LIFO,
  and cannot skip sibling finalizers after a failure.
- `dom-lifecycle.kk` and `browser_counter.py` prove event-created work retires
  with the DOM generation that registered its listener.
- `dom-event-continuation.kk` proves repeated and nested browser dispatches
  synchronously resume event K, including `preventDefault`, and that retirement
  closes the capability.
- `event_effect_boundary.py` proves a lexical-only effect cannot escape into a
  retained listener or its root and fail later at the JavaScript host turn.

A mutation that replaces trace resume with a retained full-action call must not
be possible without adding a new forbidden runtime path. A mutation that drops
the re-entry frame/gate must fail ownership and cleanup checks even if signal
values still propagate.
