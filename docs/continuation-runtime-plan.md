# Continuation runtime decision record

Status: implemented, with the host-event boundary explicitly limited below.

## Decision

Kokaine implements fine-grained propagation by capturing the real synchronous
continuation suffix at each tracked `get`. A source indexes those continuation
capabilities directly. Writes schedule and resume the affected suffixes; they do
not wake an Observer whose retained action reruns a reactive function from its
beginning.

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

An await-style continuation loop remains a possible future design for event
delivery, where the host operation is inherently asynchronous.

### Capture the suffix of synchronous `get`

Chosen. `read-source` is a control operation handled with `raw ctl`; its
`rcontext` is the exact remainder of the calculation after that read. Nested
reads naturally produce a trace, and dynamic branches are rebuilt by whatever
suffix actually runs.

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

The design does not require a public affine abstraction. A trace owns its typed
resume and finalize capabilities, and state transitions prevent scheduling a
retired generation. Retry semantics reuse the retained continuation capability;
they do not retain the original calculation as a fallback.

## Runtime invariants

The implementation is accepted only while all of the following remain true:

1. `Track-read` captures the raw suffix at the synchronous read.
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
8. A pending K remains retryable after failure or final control without replaying
   the prefix before its read.
9. Synchronous memo validation follows only typed pure-producer capabilities.
10. Structural children belong to the continuation frame that created them and
    cannot register from a retired frame.
11. Re-entry restores a captured effect-plane gate and frame, resets the
    state-entry target, and executes one batched turn.

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

## Stateful derivations

`memo(previous)` cannot subscribe to its own output and then behave like an
ordinary acyclic memo. It instead captures a distinct state-entry continuation.
Each entry resume injects the latest committed value. Reads under that entry
target the entry K so a change restarts the correct stateful suffix. Targeted
settlement checks the entry before and after nested work to discard obsolete
branch failures and deferrals.

## Failure and final control

A replacement attempt executes in a draft frame. Every raw continuation and
structural child created during the attempt is recorded. On failure, or when a
final control operation abandons the dynamic call without returning an error,
finalizers retire the draft synchronously.

The triggering source commit remains committed. The affected trace remains
pending, so a later flush retries the same captured suffix with current source
state. This is deliberately not rollback to a retained old action.

## Host re-entry decision

Browser listeners must outlive the lexical call to `mount`, but a normal host
callback does not preserve Koka's dynamic handler stack. The implemented
`reentry<e>` therefore stores only the typed structural capability needed by the
reactive runtime: root, continuation checkpoint, and generation frame.

On invocation it reinstalls Kokaine's signal handlers and structural context,
then batches the whole callback. This makes callback-created memos, effects, and
cleanups retire with the listener's generation.

This is not an event continuation loop. JavaScript still calls an ordinary Koka
closure, and `reenter` does not reconstruct arbitrary outer user handlers. A
strict continuation-driven event design would require a parked `await-event`
resumption per listener, resuming it for one event, capturing the next K, and
finalizing the parked K on retirement. That remains a separate future decision.

## Consequences

- Prefix side effects before a tracked read run once; suffix side effects run on
  that read's invalidations. Tests must assert this exact boundary.
- Source invalidation is local, but source capture compaction and deep retirement
  still have costs that should be measured under large traces.
- The structural ownership ledger remains explicit because raw continuations,
  cleanup actions, DOM ranges, and listeners require deterministic retirement.
- Arbitrary application effects used by an asynchronous callback need a handler
  installed inside that callback or at a new host runner.
- Region updates replace their owned DOM range; the continuation runtime does
  not imply keyed reconciliation.

## Verification and mutation canaries

The important tests are behavioral rather than source-string checks:

- `trace-semantics.kk` proves prefixes are not replayed and dynamic suffixes are.
- `targeted-settle-canary.kk` fails if a synchronous memo read skips producer
  validation.
- `execution-planes.kk` exercises target isolation and pure/effect separation.
- `entry-targeted-settle.kk` fails if state-entry routing is bypassed.
- `final-control-rollback.kk` proves abandoned drafts retry through the exact K.
- `continuation-reentry.kk` fails if re-entry is changed to plain root dispatch.
- `dom-lifecycle.kk` and `browser_counter.py` prove event-created work retires
  with the DOM generation that registered its listener.

A mutation that replaces trace resume with a retained full-action call must not
be possible without adding a new forbidden runtime path. A mutation that drops
the re-entry frame/gate must fail ownership and cleanup checks even if signal
values still propagate.
