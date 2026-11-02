# Current guarantees

This page lists the behavioral guarantees the runtime currently makes and its
test suites check. [The architecture notes](architecture.md) explain the
mechanisms behind them: trace capture, the continuation frontier, execution
planes, draft publication, lifetimes, and host re-entry.

- Inside a calculator or binding running under `reify-trace`, each synchronous
  `Track-read` uses `raw ctl` to capture the continuation after that exact read.
  Invalidation resumes that suffix; code before the read is not replayed.
  Sampled reads and ordinary reads handled by `dispatch` return the current cell
  directly and leave no trace.
- Every such tracked read occurrence creates its own trace node, including
  repeated reads of the same source. Later reads are nested beneath earlier
  reads. If one write invalidates several nodes in that chain, frontier
  scheduling advances the earliest runnable ancestor and lets replacement
  retire or supersede its old descendants; there is no read de-duplication token
  or dirty observer.
- Each source indexes rank-2 packages containing the actual execution plane and
  captured read trace. There are no subscriber wake closures, retained
  calculation actions, or old-style Observer dependency graph.
- This index, parent gates, and child traces are graph-shaped runtime data. The
  precise claim is **no separate Observer dependency graph**, not "no graph at
  all."
- Scheduler tickets contain either an actual trace resumption or a one-shot
  bootstrap scope. The bootstrap slot is cleared before its initial calculation
  runs; a producer never retains `calculate` as a recovery fallback.
- `Capture-pending` and `Capture-running` are lifecycle states of resumptions,
  not dirty flags paired with a separately retained action. A write while a K
  is running marks that same capability for a later turn.
- Resume capabilities are not modeled as affine or one-shot. A live trace can
  be invalidated and resumed again, and a failed replacement attempt keeps the
  same K pending for retry. A failed effect K is quarantined rather than left
  at the queue front: the rest of the flush still drains, the first failure is
  rethrown once the queue is empty, and the K runs again only when one of its
  own inputs changes or at an explicit `update` boundary. The bootstrap closure
  is deliberately one-shot; an initial bootstrap failure retires its scope
  instead of replaying that closure.
- The scheduler admits only the current continuation frontier: a pending trace
  is runnable when no ancestor is pending or running. Blocked or retired tickets
  may remain in a queue temporarily and are deferred or skipped by state.
- Pure derivations run on `plane<total>`; user effects run on `plane<e>`. A
  synchronous memo read can therefore settle only the required producer chain
  without erasing an ambient user effect row or draining unrelated work.
- The pure plane is dynamically read-only. Hidden signal writes and structural
  registration are rejected before mutating a source, queue, or lifetime registry;
  the phase is restored across exceptions and abortive final control.
- The `derive` family is stateless: its captured read suffix calculates from
  current inputs and publishes through source equality before downstream work
  is invalidated. Accumulated values are explicit state: a `signal` stores the
  value and `create-effect` tracks the inputs before modifying that signal.
- Unequal commits advance the source version and invalidate its indexed
  continuations. Equality cuts propagation before downstream work is scheduled.
- Replacement generations are built as drafts. Failure or abortive final
  control retires unpublished continuations and lifetime children while the
  committed source value and pending retry K remain explicit.
- Continuation frames own nested effects, derivations, and opaque parked
  resource continuations through removable lifetime registrations. Retirement
  seals and detaches the complete child/finalizer registries before invoking
  any resource K's `finally`; root disposal follows the same exhaustive,
  idempotent path.
- Nested batches delay settling while making newly committed source values
  immediately readable. Host re-entry is also one atomic batched turn.
- Browser listeners use the integration layer's typed `reentry<e>` containing
  their registering generation's root, gate, and frame, plus a guarded
  multi-shot event K that
  contains the user action. Re-entry restores the owning lifetime context and
  synchronously resumes that K; a retired generation rejects later delivery,
  so event-created reactive work cannot escape to the root.
- A listener's `run-async` delimiter executes direct-style code only through
  its first suspension. The initiating reactive batch then closes. Every
  completion, including one reported synchronously during setup, goes through
  the active host dispatcher, which revalidates and re-enters the exact owning
  generation as a fresh batched turn. The Web adapter posts microtasks; Pocket
  flushes a mount-scoped FIFO during deterministic virtual frames.
- Every outstanding host await is a one-shot, generation-owned capability.
  Completion and retirement first revoke the retained continuation and host
  callbacks. Cancellation is final control rather than an ordinary exception,
  so it cannot be caught as a failure and still unwinds the strand's `finally`
  clauses. A cancellation batch unwinds every claimed strand before any host
  disposer is invoked, so one re-entrant disposer cannot kill a sibling's
  cleanup context. A Fetch response retains
  the request's controller from header delivery until it is explicitly
  discarded or body consumption takes ownership, so retirement during either
  interval aborts the request. Long browser sleeps are split into signed
  32-bit-safe chunks and guarded by a monotonic deadline for each chunk.
- `parallel`, `race`, and `timeout` are structured: a parent does not return
  while a canceled child still has an outstanding await or finalizer. A queued
  completion keeps its host disposer until the child suffix accepts it, and a
  value made unreachable by a later group failure is discarded immediately.
  Web Timer, Promise, and Fetch adapters and Pocket virtual timers all use the
  same revocable await protocol.
- A Resource tracks only its synchronous source calculation. Its loader
  receives an immutable source snapshot and has no `signal-read` capability;
  equality can therefore preserve an active request, while refresh, source
  replacement, cancellation, or owner retirement creates a clear generation
  boundary for results.
- Text and attributes are escaped in SSR. Inline `on*`, `srcdoc`, and
  markup-writing DOM properties are rejected; raw markup requires the explicit
  `unsafe-trusted-html` boundary. URL attributes and properties (`href`, `src`,
  `action`, `formaction`, `xlink:href`, `data`, `poster`, `cite`, `background`,
  `ping`) accept only relative, `http(s)`, `mailto`, and `tel` URLs, plus
  `data:image/*` for `src` and `poster`; anything else, such as `javascript:`,
  needs `unsafe-trusted-url`. SVG and MathML elements are created in their
  namespaces, as an HTML parser would create them from the SSR output. Native
  DOM exceptions become Koka `exn`.
- `kokaine/control` provides memo-driven `branch`/`when` and keyed `for`
  overloads for lists and vectors. Browser reconciliation retains row DOM,
  listeners, local state, and row-owned reactive work by business key; SSR
  walks the same HTML plan as one deterministic snapshot. Duplicate keys fail
  before publication in both backends.
