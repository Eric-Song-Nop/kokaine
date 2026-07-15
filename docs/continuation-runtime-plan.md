# Graph-free continuation runtime: capability assessment and decision record

Status: implemented
Toolchain: Koka 3.2.3
Scope: `src/kokaine/reactive.kk`; the high-level root/signal/memo API is unchanged

## Decision

Kokaine now uses one reactive execution model:

> Dynamic reads attach the current observer generation's one-shot wake
> capability directly to each source and record a version checkpoint for the
> captured read. A raw control effect parks the observer process between
> generations. Source-local wake capabilities, continuation-owned checkpoints,
> captured owner-generation scopes, direct queues, and exact producer pull
> provide incremental propagation.

The previous centralized dependency graph has been removed. There is no
root-wide source or observer registry, integer node identity, observer-to-source
reverse list, topological rank, or `Pending`/`Stale` state machine. There is
also no graph-backed fallback path hidden behind the continuation scheduler.

In this document, **graph-free** means that the runtime has no graph data
structure and performs no topology lookup or rank maintenance. Precise
invalidation still requires a source to retain a way to wake the generations
that read it. Kokaine represents that reachability as source-local,
continuation-indexed capabilities. Those capabilities are the sole propagation
mechanism.

## Evidence and capability judgement

The implementation decision follows from the following primary sources.

| Source | Relevant result | Consequence for Kokaine |
| --- | --- | --- |
| [The Koka book](https://koka-lang.github.io/koka/doc/book.html) | Ordinary `fun` operations are optimized tail-resumptive operations. A `raw ctl` handler can retain an `rcontext` beyond its lexical scope, but every retained context must eventually be resumed or finalized; finalization runs intervening `finally` clauses. | Keep reads on the fast `fun` path. Capture one raw context at an explicit observer boundary and make disposal finalize it. |
| [Compiling Self-Adjusting Programs with Continuations](https://software.imdea.org/~rleywild/publications/icfp08/icfp08.pdf) | Adaptive CPS can infer dynamic dependence, but a continuation is a coarse approximation to fine-grained dependence and the system still maintains a computation trace and memoized CPS functions. | Continuations do not make invalidation reachability disappear. Use them as generation boundaries and retain only source-local wake capabilities and captured read checkpoints. |
| [Deprecating the Observer Pattern with Scala.React](https://infoscience.epfl.ch/bitstreams/edac8552-b524-41c2-a4af-23abf42a0821/download) | Continuations make direct-style event flows possible, while signal propagation still needs dynamic dependency discovery and ordered settlement. | Capturing at every read is not, by itself, a glitch-freedom algorithm. Kokaine instead combines generation capture with recursive checkpoint validation and exact producer pull. |
| [Affect: An Affine Type and Effect System](https://popl25.sigplan.org/details/POPL-2025-popl-research-papers/5/Affect-An-Affine-Type-and-Effect-System) | Unrestricted multi-shot control interacts unsafely with linear resources and mutable state; affine use makes the continuation discipline explicit. | A reactive generation is one-shot. Kokaine never forks a retained observer context across mutable cells, cleanups, listeners, or owned children. |
| [Scoped Effects as Parameterized Algebraic Theories](https://homepages.inf.ed.ac.uk/slindley/papers/sepat.pdf) | Scoped operations describe computations whose interpretation delimits a body, rather than treating every operation as an ordinary resumptive command. | This supports keeping `batch`, ownership, cancellation, and `untrack` as scoped interpretations. It is a design inference, not a claim that the paper supplies a reactive scheduler. |

No source above demonstrates that per-read continuation capture alone can
remove all retained invalidation information while preserving dynamic
dependencies, memo equality cutoff, coherent diamonds, batching, and resource
lifetime. A system with no retained wake reachability must conservatively
restart a larger scope after each write. That is consistent, but it is not the
fine-grained runtime Kokaine is intended to be.

### Alternatives considered

| Design | Incremental granularity | Main cost or correctness issue | Decision |
| --- | --- | --- | --- |
| Resume one root continuation after any write | Whole root | Gives up source isolation and equality-pruned work | Rejected |
| Capture a one-shot suffix at every read | Potentially below an observer | Earlier invalidation must cancel every suffix that closed over the old prefix; fan-in and repeated reads still need generation identity and deduplication | Rejected for the runtime |
| Reuse read-site suffixes with multi-shot control | Potentially below an observer | Forks mutable reactive state and resource scopes; stale locals and duplicate finalization require a substantially stronger type/lifetime model | Rejected |
| Adaptive CPS plus a mutable computation trace | Fine-grained | Reintroduces an explicit trace/memoization subsystem with greater compiler and runtime complexity | Not adopted |
| Old dependency graph plus continuation lifecycle | Observer | Preserves duplicate graph/rank/status machinery and violates the single-model goal | Removed |
| One-shot observer generation plus source-local wake capabilities and read checkpoints | Observer | Stores one checkpoint per distinct source in a generation and requires disciplined token cancellation and validation | Implemented |

## Why capture a generation rather than every read suffix

Consider:

```koka
val left = a.get
val right = b.get
left + right
```

A suffix captured at `b.get` contains the old `left`. If `a` changes, that
suffix must be canceled before any later `b` change can resume it. Captures
later in a dynamic branch must likewise be invalidated when an earlier branch
condition changes. Repeated reads and fan-in add several resumptions for one
logical computation, so they still require a generation-wide fired latch and
cancellation scope.

Read-site reuse is more difficult for Kokaine specifically:

- `memo` passes the previous successful value to its calculator. A suffix can
  close over a `previous` value that is no longer the producer's current
  checkpoint. For `memo(root,0,fn(previous) previous + source.get)`, suffix
  replay after writes `1` and `2` would reuse `previous = 0` and publish `2`;
  whole-generation semantics correctly publish `1` and then `3`. Because
  `previous : a` is an arbitrary value, no handler can replace it inside an
  already captured continuation without changing the API to a thunk/effect.
- `untrack` is a nested override handler. A suffix that crosses its dynamic
  boundary must restore the correct tracking interpretation on every replay.
- owned children and cleanup callbacks are replaced as a generation reruns.
  Multi-shot replay could register or finalize the same resource more than
  once.
- raw Koka contexts are lifetime-bearing values. An abandoned suffix must be
  finalized, while a resumed one must not also be finalized through another
  branch.

Solving those issues would require prefix versions, suffix dominance and
invalidation, multi-shot-safe resource semantics, and new optimizer evidence.
It would be a different runtime, not a small removal of graph records. The
current design obtains the requested graph deletion with a much smaller
one-shot discipline: each observer reruns its tracked action, while effects and
captured contexts make that rerun precisely addressable and safely disposable.

This means the current incrementality boundary is the observer generation,
not an arbitrary expression suffix. The distinction is intentional and is
part of the supported semantics.

## Implemented representation

```text
root
  opaque root capability key
  derivation queue : direct observer handles
  user-effect queue: direct observer handles
  batch/flushing latches
  current wake token and current owner
  directly owned children and cleanups

source<a>
  current value, equality predicate, and commit version
  source-local subscriptions
  optional effect-erased producer latches and dependency checkpoints

dependency-stamp
  source version cell and version observed by one read
  optional effect-erased producer state for recursive validation

owner-generation
  live and fired latches shared with one wake token
  transient validation latch for controlled ownership/checkpoint-cycle rejection
  optional parent generation captured when an owned observer is created
  shared dependency checkpoints of the owning continuation generation

wake-token
  live and fired latches
  this token's owner-generation capability
  cancellation closures for this generation's subscriptions
  this generation's dependency checkpoints
  direct observer wake closure

observer
  live / dirty / queued / running latches
  current wake token
  captured owner-generation capability
  checkpoint cell shared with its producer state
  parked one-shot observer process
  direct children, cleanups, and unlink closure
```

The token object is the generation identity; source versions are commit
checkpoints, not node IDs or root epochs. The first tracked read of a source in
one round subscribes the token and records the returned version. Later reads
of that same source are recognized by the version-cell identity and reuse that
single link and checkpoint. Links from different sources can still fire the
same token, whose `fired` latch queues the observer once.

`producer-state` is not a graph node. It contains only effect-erased `live`,
`dirty`, and `running` latches, the captured owner-generation cell, and the
checkpoint cell of the last successful producer generation. It does not retain
the root, typed observer, or a wake closure. The runtime reaches an observer
only through a source subscription or its direct queue handle.

An owner-generation link is likewise not a data dependency. Each generation
has at most one parent, fixed when its observer is created; reads never add or
change these links. The chain is only a lifetime proof that the continuation
scope which created an owned observer is still current.

### Removed representation

The rewrite deletes all of the following from the runtime:

- `source-info`, root source registries, and source lookup;
- root observer registries and observer lookup;
- root, source, and observer integer IDs;
- observer-to-source dependency lists and duplicated edge bookkeeping;
- observer/source ranks and ranked queue insertion;
- the `Pending`/`Stale` observer status type and its propagation rules;
- producer wake closures that retain a typed root or observer;
- speculative memo-output invalidators and downstream dirty propagation;
- topology updates after dynamic branch changes.

Root containment uses an abstract `root-key` whose private cell identity is
compared directly. It rejects a signal used under the wrong or disposed root
without allocating an integer identity or participating in propagation.

The retained observer action is also not a shadow dependency scheduler. The
parked raw continuation is the normal execution path. The action is only a
recovery seed when an abortive/final host control operation exits before the
observer loop can publish its next parked context.

## Propagation algorithm

### 1. Start a generation

Before an observer round, the runtime cancels its previous token and removes
the token's source links. It creates and publishes a fresh one-shot token as
the replacement lifetime scope, tears down the previous owned generation,
installs the token as the current tracking capability, and resumes exactly one
parked observer context. Publishing before teardown lets cleanup code register
work only into the replacement scope.

The `signal-read` handler first settles a memo source if necessary, then
subscribes the current token when the read is tracked and appends a checkpoint
containing the returned source version and optional producer state. `untrack`
overrides the same operation with `tracked = False`, and an effect clears
tracking before running its `apply` function.

### 2. Invalidate locally

A raw signal write compares old and new values. An equal write stops. A real
change commits the cell, increments the source version, and fires the active
subscriptions stored by that source. A token fires only while its complete
owner-generation chain is live and unfired. Its one-shot `fired` latch turns
any number of links or writes in the same generation into one queued observer.

A memo follows the same publication rule: only an unequal commit increments
its version and fires subscribers. There is no speculative downstream dirty
wave. A downstream generation remains clean until one of the sources it
actually read publishes a different value.

### 3. Settle without ranks

Derivation and user-effect queues contain direct handles and use their
`queued` latches for deduplication. Flush always drains derivations before user
effects, but derivations have no topological order. A ticket whose captured
owner generation has fired or been canceled is stale and is discarded. Before
that decision, the scheduler recursively validates the owner's captured memo
checkpoints, so a latent parent invalidation becomes visible even when a child
derivation appears earlier in the rank-free queue. The owner's pending rerun
will dispose the stale observer before constructing its replacement scope.

Generation validation is guarded against re-entry. A parent round that tracks
a producer created by its own replacement cleanup would otherwise create an
owner-to-checkpoint-to-owned-work cycle; the runtime rejects this composition
before calculation or publication and leaves direct owner invalidation able to
retire the cyclic scope.

On a memo read, `settle-producer` validates the checkpoints captured by the
producer's last generation even if that producer is still marked clean. For
each memo checkpoint it recursively settles that dependency's producer first.
If the dependency commits a new version, its existing source subscription
fires the waiting token and makes the target producer dirty. If the version
differs without firing that token, the runtime reports an invariant violation
instead of returning a stale cache.

Once the requested producer is dirty, `take-queued-observer` extracts that
exact direct handle from the derivation queue by the private dirty-latch
identity and runs it. Pulling a producer never runs an arbitrary sibling.
The pull reports whether the requested producer actually executed; an outer
read starts a global flush only in that case, so reading an unrelated clean
memo cannot retry or expose another observer's pending failure.
Thus queue order, a converging diamond, or a dependency whose depth changes at
runtime cannot expose an old value or manufacture a false recursive cycle.
The `running` latch still rejects a real recursive self-pull.

An equal upstream memo commit leaves its version unchanged and fires nothing.
Checkpoint validation can therefore prove the dependent generation is still
valid without rerunning its calculator. This matters for `memo(previous)`: an
equal intermediate must not execute a stateful downstream calculation merely
because an ancestor was touched.

### 4. Batch and pull

Nested batches increment a root depth latch. Writes still commit and fire
tokens, but ordinary flushing waits for the outermost `leave-batch`. A memo
read inside a batch uses the same recursive checkpoint validation and exact
producer pull, so it observes the latest transitive value without globally
flushing user effects. A memo retained from an already invalidated owner scope
is rejected rather than executing stale owned work before the owner refresh.

### 5. Failure, cancellation, and disposal

`observer-suspend` is a private raw control effect. An observer process resumes
one context, executes one complete action, and captures the next context only
after the round and its inner finalizers. The next process is published before
an action error is rethrown, so the dirty observer can retry with a fresh
generation. Before that retry is queued, the failed partial generation's token
is canceled, making any children created before the error immediately stale.

Cancellation marks a token dead before running its cancellation closures.
Disposal first marks the complete directly owned subtree dead, then cancels
tokens, finalizes every parked raw context, runs cleanups, and unlinks handles.
Consequently a cleanup write cannot revive a sibling, and every retained
`rcontext` is consumed by either `resume` or `finalize`. Unlinking also clears
the captured owner generation so an externally retained disposer does not keep
an ancestor scope alive.

## Correctness invariants

1. **One source checkpoint and one enqueue.** A generation records a source
   once, and its live token transitions `fired` from false to true once,
   regardless of duplicate reads, fan-in, or repeated writes in a batch.
2. **No old-branch wake.** A rerun cancels every link owned by the old token
   before installing the new token. Dynamic branches therefore replace their
   subscriptions rather than accumulating active dependencies.
3. **Fresh producer before consumer.** A memo read recursively validates the
   captured producer checkpoints, then extracts and settles only the exact
   dirty producer; a running producer cannot be recursively read.
4. **Effects see committed derivations.** The derivation queue is drained
   before the user-effect queue, and only an unequal source commit fires a
   downstream token.
5. **Equality is the publication boundary.** An equal signal write does not
   fire or increment its version; an equal memo commit neither notifies nor
   reruns a clean downstream `memo(previous)` generation.
6. **Tracking is scoped.** Only reads in `track` attach the current token.
   Reads in `apply`, cleanup code, or `untrack` do not become dependencies.
7. **Ownership is generation-scoped.** A child runs only while every captured
   owner generation remains live and unfired. Parent invalidation therefore
   retires stale child work independently of batch write or queue order.
8. **Failure leaves retryable state.** An incomplete round is dirty and
   scheduled again after its partial generation is canceled, while the failed
   raw context is never resumed twice.
9. **Every context has one terminal action.** A parked `rcontext` is resumed
   once or finalized once; cancellation does not duplicate resource cleanup.
10. **Death precedes cleanup writes.** The owned subtree and its tokens become
   inert before cleanup callbacks execute.
11. **Root capability containment remains strict.** Reads, writes, batches,
    and registration reject the wrong or disposed root independently of the
    propagation representation.

## Validation matrix

The graph-free runtime is accepted only with the complete `make test-all`
gate. The individual evidence is:

| Property | Test or command | Evidence required |
| --- | --- | --- |
| No legacy graph machinery | `test/no_dependency_graph.py` | Forbids registries, node IDs, reverse edge lists, ranks, ranked insertion, graph lookup, producer wake closures, speculative downstream invalidation, and arbitrary sibling draining; requires source versions, token-owned checkpoints, owner-generation capabilities, raw resume/finalize, recursive validation, and exact producer pull. |
| Raw one-shot lifecycle | `test/continuation.kk` | Lazy bootstrap, one-step resume, retry after failure, fresh dynamic handlers, and explicit finalization. |
| Source isolation and generation deduplication | `test-captured-incrementality` | Independent fan-out does not rerun, duplicate reads wake once, and batched fan-in applies once. |
| Dynamic dependencies and tracking scope | `test-dynamic-dependencies`, `test-untrack`, `test-apply-is-untracked` | Old branches are canceled; untracked/apply reads install no wake link. |
| Equality cutoff and coherent diamonds | signals/memos, `test-generation-checkpoint-equality`, and `test-diamond` | Equal results do not publish or rerun a stateful downstream `memo(previous)`; a converging diamond exposes one complete value. |
| Rank-free exact pull | `test-transitive-batch-freshness`, `test-dynamic-depth-atomicity`, `test-targeted-producer-pull` | Dirty ancestors settle on demand, a dependency-depth change remains atomic, and pulling one producer never executes an unrelated queued sibling. |
| Combined continuation edge cases | `test/reactive-advanced.kk` | 105 checks compose a deep dynamic diamond, batch-local exact pull beside a failing sibling, stateful `previous` with duplicate fan-in, deep failure retry, failed-parent disposal, both parent/child write orders, a three-level ownership scope, rejected stale owned-memo pull, changed/equal lazy parent checkpoints, owner-validation failure retry without ticket loss, controlled owner/checkpoint-cycle recovery, guarded preflight pulls, and both queue orders of a 10,000-child stale ownership fan-out. |
| Deterministic differential stress | `test/reactive-stress.kk` | A fixed Park--Miller schedule compares raw sources, derived values, calculator runs, and effect applications against a pure reference model for 1,200 mixed transactions (18,016 assertions). Counters are checked before any derived sample can repair queued work. |
| Queue boundedness and stack behavior | `test-continuation-churn-coherence`, `test-large-stale-owner-fanout-is-stack-safe` | 10,002 batched set/read steps remain coherent; exact pull through a 10,000-child queue and tail-recursive retirement of 10,000 stale tickets complete without running retired children. |
| Failure and containment | exception, memo-error, cleanup-failure, clean-read-isolation, nested-handler, and final-control regressions in `test/reactive.kk` | Errors escape without exposing stale cache state; a clean read does not flush unrelated retry work; retry and runtime phase checks remain intact. |
| Ownership and disposal | cleanup, owned-child, self-disposal, dead-owner, disposal-isolation, and owner-generation regressions | Descendants and contexts are finalized once; cleanup writes do not revive dead work; an invalid parent scope cannot publish a stale child effect regardless of write order. |
| Native aggregate | `make test-native` | Smoke, continuation, 55 baseline reactive checks, 105 advanced checks, 18,016 stress assertions, HTML checks, and the structural no-graph assertion pass. |
| Browser lifetime | `make test-browser` | `jsweb` handles a 700-event counter burst, a 32-round branch churn after the initial replacement, detached-node replay, 64 post-disposal source updates, DOM exception translation, repeated no-op reset stability, unsafe-looking text, and the 780/781 px responsive boundary. |
| Retained callback ABI | `make test-wasm` | The `wasmweb` proof safely re-enters after `main` and releases retained callbacks. |
| Report integrity | `make test-report` | Report JavaScript parses and its required interactive structure remains valid. |

## Limits and risks

- The runtime is incremental at observer granularity. It does not resume an
  arbitrary suffix after an individual `get`; a dirty observer reruns its
  complete tracked action.
- A generation deduplicates repeated reads by linearly scanning its captured
  checkpoints for the same source-version cell. Peak storage is proportional
  to distinct tracked sources, while registration cost can become quadratic
  in that count for very wide observers.
- Pulling a clean memo may recursively validate its captured memo checkpoints
  before returning the cache. This avoids downstream recomputation after an
  equal intermediate and detects a captured producer disposed by an independent
  owner, at the cost of validation work along the demanded chain. Queue
  emptiness alone is therefore not a sound O(1) fast path.
- A source subscription strongly reaches its wake closure until cancellation.
  Eager cancellation and disposal are therefore lifetime requirements, not
  optional cleanup optimizations.
- Scheduling an owned observer validates a linear chain of captured
  owner-generation capabilities and any dirty memo checkpoints on that chain.
  Each layer rechecks its complete ancestor chain after effectful checkpoint
  settlement, so worst-case scope-only work is quadratic in ownership depth;
  checkpoint work follows only the owning generations' captured producer paths.
  Unlinking clears the child-side capability reference. A composition in which
  an owner tracks work created by its own cleanup is deliberately rejected as
  a checkpoint cycle; supporting it would require a transient multi-producer
  settlement stack rather than a single-candidate exemption.
- Raw continuations can capture more stack state than plain thunks. Native,
  `jsweb`, and `wasmweb` allocation and retention costs must continue to be
  measured independently.
- Abortive/final host control is retryable through the recovery action seed.
  An escaping resumptive or multi-shot application control effect is outside
  the supported observer model because it could fork one mutable generation.
- The scheduler assumes the current single-threaded root mutation model. It
  does not provide atomic synchronization for concurrently mutating threads.

Any future read-site suffix experiment must prove the invariants above under
`memo(previous)`, dynamic branches, `untrack`, failure, and owned-resource
finalization. It must be evaluated as an isolated replacement; the removed
graph/rank/`Pending` implementation is not an allowed fallback.
