# Kokaine

Kokaine is an experimental fine-grained UI runtime for
[Koka](https://koka-lang.github.io/koka/doc/book.html). Signal operations and
the HTML vocabulary are exposed as algebraic effects; propagation resumes
captured continuations, while continuation frames record structural lifetime.
The browser layer uses an effect-handled Koka DSL instead of JSX or a virtual
DOM.

The implementation targets Koka 3.2.3. Its source-local continuation index,
two-plane scheduler, and HTML vocabulary are backend-neutral. The complete
browser renderer targets `jsweb`; a smaller `wasmweb` proof separately verifies
the retained-callback ABI used to cross an asynchronous host boundary.

## Interactive report

The Chinese report [代数效应与续体如何组成增量 UI](docs/algebraic-effects-ui-report/index.html)
explains the runtime from a UI engineer's perspective. It includes executable
continuation-trace visualizations, scheduler stepping, batching and ownership
experiments, a React/Vue/Solid comparison, and the real Koka Continuation Lab.
Its core data-flow, Koka feature atlas, dynamic-dependency, and ownership
sections are themselves authored with Kokaine: four DOM islands share one
Koka root and are compiled from `examples/report/*.kk`. The small host script
is reserved for document concerns such as scroll position and the explicitly
labelled scheduler simulations.

```sh
make serve-report
```

Then open
`http://127.0.0.1:4173/docs/algebraic-effects-ui-report/`. Run the report's
static integrity checks with `make test-report`.

## Why algebraic effects and continuations

Algebraic effects and continuations do different jobs in Kokaine. Effect
operations state what a computation may ask for, and handlers decide how those
operations are interpreted. The continuation captured by a tracked read states
where incremental execution can continue. Neither role is a synonym for the
other:

| Capability     | Operation               | Handler responsibility                                                  |
| -------------- | ----------------------- | ----------------------------------------------------------------------- |
| `signal-read`  | `count.get`             | Validate a producer and interpret the read as tracked or sampled.        |
| `signal-write` | `count.set(1)`          | Apply equality, commit, invalidate, batch, and request settling.         |
| `html<e>`      | `text`, `div`, `region` | Collect emitted nodes into a backend-neutral `view<e>`.                  |

The tracked-read handler installed by `reify-trace` is where the two ideas meet.
It handles the `signal-read` operation with `raw ctl`, reifies the exact
synchronous suffix after that `get`, resumes it immediately with the current
value, and indexes the resulting capability at the source. A later unequal
write queues that suffix. It does not call a saved component or calculator
closure.

This split has practical consequences. A memo calculator accepts
`signal-read` but not `signal-write`; an effect separates its tracked function
from its untracked apply function; `untrack` is a nested override handler; and
`batch` is a scoped interpretation of write operations.

An effect row describes operations that remain unhandled at a function
boundary. It does not prove that no operation was performed and handled inside
that function. Consequently, an effect-typed API is valuable capability
documentation and composition, but it is not by itself a sufficient purity
boundary. Kokaine therefore enters a runtime-wide pure phase around derivation
bootstrap, resumption, and targeted settlement. Framework writes, ownership
registration, disposal, and re-entry are rejected in that phase even when a
local public wrapper handled their outward effect row, including cross-root
attempts.

## Current guarantees

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
- Each source indexes rank-2 packages containing the actual execution plane,
  target trace, and owning read trace. There are no subscriber wake closures,
  retained calculation actions, or old-style Observer dependency graph.
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
  same K pending for retry. The bootstrap closure is deliberately one-shot; an
  initial bootstrap failure retires its scope instead of replaying that closure.
- The scheduler admits only the current continuation frontier: a pending trace
  is runnable when no ancestor is pending or running. Blocked or retired tickets
  may remain in a queue temporarily and are deferred or skipped by state.
- Pure derivations run on `plane<total>`; user effects run on `plane<e>`. A
  synchronous memo read can therefore settle only the required producer chain
  without erasing an ambient user effect row or draining unrelated work.
- The pure plane is dynamically read-only. Hidden signal writes and structural
  registration are rejected before mutating a source, queue, or lifetime registry;
  the phase is restored across exceptions and abortive final control.
- `derive` is stateless: its captured read suffix calculates from current
  inputs. `memo(previous)` adds a separate state-entry continuation that
  injects the latest successfully committed output without subscribing to its
  own source. Both publish through source equality before downstream work is
  invalidated.
- Unequal commits advance the source version and invalidate its indexed
  continuations. Equality cuts propagation before downstream work is scheduled.
- Replacement generations are built as drafts. Failure or abortive final
  control retires unpublished continuations and structural children while the
  committed source value and pending retry K remain explicit.
- Continuation frames own nested effects, derivations, and opaque parked
  resource continuations through removable lifetime registrations. Retirement
  seals and detaches the complete child/finalizer registries before invoking
  any resource K's `finally`; root disposal follows the same exhaustive,
  idempotent path.
- Nested batches delay settling while making newly committed source values
  immediately readable. Host re-entry is also one atomic batched turn.
- Browser listeners capture a typed `reentry<e>` containing their registering
  generation's root, gate, and frame, plus a guarded multi-shot event K that
  contains the user action. Re-entry restores the structural context and
  synchronously resumes that K; a retired generation rejects later delivery,
  so event-created reactive work cannot escape to the root.
- Text and attributes are escaped in SSR. Inline `on*`, `srcdoc`, and
  markup-writing DOM properties are rejected; raw markup requires the explicit
  `unsafe-trusted-html` boundary. Native DOM exceptions become Koka `exn`.
- `kokaine/control` provides memo-driven `branch`/`when` and keyed `for`
  overloads for lists and vectors. Browser reconciliation retains row DOM,
  listeners, local state, and row-owned reactive work by business key; SSR
  walks the same backend-neutral plan as one deterministic snapshot. Duplicate
  keys fail before publication in both backends.

## Quick start

Prerequisites are Koka 3.2.3, Python 3, and `make`. Set `PYTHON=/path/to/python`
when the Python 3 executable is not named `python3`. The browser checks
additionally use [`uv`](https://docs.astral.sh/uv/) to run Playwright without
adding project dependencies.

```sh
make test
make browser-install
make test-browser
make test-wasm
```

To explore the responsive Continuation Lab:

```sh
make serve
```

Then open <http://127.0.0.1:4173/examples/counter/>. `make build-counter`
emits the `jsweb` ES modules into the ignored `dist/` directory.

The smaller native top-layer example is available separately:

```sh
make serve-top-layer
```

Open <http://127.0.0.1:4173/examples/top-layer/> to try a modal dialog with a
native `method="dialog"` form and an auto popover controlled entirely through
`popovertarget` attributes. The page also shows browser-driven close/toggle
state being written back through Kokaine event handlers.

The keyed reconciliation bench makes DOM identity directly observable:

```sh
make serve-keyed
```

Open <http://127.0.0.1:4173/examples/keyed/>, type into a row's uncontrolled
note field, then reverse, prepend, revise, or delete rows. The changing index
readout follows position while the input value and focus stay with the stable
business key.

The lab is intentionally a multi-file application rather than one oversized
demo component:

| Module | What it demonstrates |
| --- | --- |
| `model.kk` | Sources, dynamic `derive`, custom equality, `memo(previous)`, `untrack`, `signal-always`, and a tracked/apply effect sink. |
| `actions.kk` | Ordinary writes, explicit batches, and callback-created effects and cleanups. |
| `controls.kk` | Typed events plus live value, checked, and disabled DOM properties. |
| `meter.kk` | Fine-grained live text/attributes and a visible `source -> captured suffix -> DOM effect` trace. |
| `probe.kk` | Dynamic regions, host re-entry, generation ownership, and exact retirement. |
| `app.kk` | Static page composition across the feature modules. |

`examples/counter.kk` is only the browser entry point: it creates the root and
model, composes the page, and mounts it. In the lab, changing the inactive
channel demonstrates dependency pruning and switching the selector replaces
the dynamic branch; crossing zero shows custom equality and state entry;
editing the operator separates tracked reads from `untrack`; repeatedly
publishing heartbeat `0` demonstrates `signal-always`; and retiring the probe
region removes its listener, child effect, and cleanup as one
continuation-owned generation.

`make test-wasm` additionally requires Emscripten and Node. It compiles the
isolated `wasmweb` proof and verifies two asynchronous fake-DOM events.

## A small application

```koka
module counter

import kokaine/reactive
import kokaine/html
import kokaine/dom

pub fun main()
  val (root,(count,doubled)) = create-root fn(root)
    val count = signal(root,0)
    val doubled = derive(root,0,fn() count.get * 2)
    (count,doubled)

  val page = view
    div(attrs=[class("counter")])
      button("Increment",attrs=[
        kind("button"),
        on-click(fn(_) count.modify(fn(n) n + 1))
      ])
      strong
        text { doubled.get.show }

  val stop = mount(root,query("#app"),page)
  ()
```

The indented `view` and tag blocks are normal Koka trailing-lambda syntax. Pass
attributes through the optional `attrs` argument; a single static text child
can use the string overload directly. A trailing lambda selects a live binding,
as in `text { doubled.get.show }`, while `dynamic` delimits live structure.
Tag helpers delimit nested `html` handlers. This synchronous builder algebraic
effect produces a `view` without retaining its continuation as the propagation
engine. When mounted, live text, attributes/properties, and dynamic regions
become continuation-backed effects. Static
structure is created once; each live binding owns the continuation-backed
effect targeting its node, while mount and dynamic scopes own DOM ranges.

For deterministic snapshots or server output, replace the DOM import with
`kokaine/ssr` and call `render(root,page)`.

## Native dialog and Popover

Kokaine uses the browser's native top layer instead of relocating overlay DOM.
`dialog` and elements carrying `popover(...)` remain ordinary children of the
view which created them, so the existing owner, listener, cleanup, and SSR
rules apply unchanged. The browser supplies modal inertness, focus placement,
Escape handling, light dismiss, and popover stacking.

The backend-neutral `kokaine/html` vocabulary includes:

- `dialog { ... }` and `dialog("text")` builders;
- `popover(Popover-auto|Popover-manual|Popover-hint)`;
- `popover-target(id)` and
  `popover-target-action(Popover-toggle|Popover-show|Popover-hide)`;
- `dialog-form-method()`, `autofocus()`, and
  `dialog-closed-by(Dialog-close-any|Dialog-close-request|Dialog-close-explicit)`.

These helpers serialize as ordinary HTML attributes. In particular, Kokaine
does not provide a live `open` attribute: a dialog or popover can also close
because of Escape, light dismiss, form submission, or another popover. Listen
for native `close`, `cancel`, `beforetoggle`, or `toggle` events and read the
browser's resulting state instead of treating it as a one-way signal.

The `kokaine/dom` command layer is deliberately thin:

```text
dialog/show(node)                 popover/show(node)
dialog/show-modal(node)           popover/hide(node)
dialog/close(node,result="")      popover/toggle(node) -> bool
dialog/request-close(node,result="")
dialog/is-open(node) -> bool      popover/set-open(node,bool)
dialog/is-modal(node) -> bool     popover/is-open(node) -> bool
dialog/return-value(node) -> string
```

Every command and state read above has a `<ui,exn>` effect row.
`toggle/state(event)` reads `ToggleEvent.newState`, and
`dialog/event-return-value(event)` reads the closing dialog's `returnValue`.
Targets and event shapes are validated, and native host failures cross the
same DOM-exception-to-Koka-`exn` boundary as the rest of the renderer.
`dialog/request-close` never falls back to `close`, because only the former
fires the cancelable `cancel` event first.

Browser support follows the platform: core [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
is widely available across browsers since March 2022, the core
[`popover` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)
is Baseline 2024, and
[`requestClose()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/requestClose)
is Baseline 2025. Applications supporting older engines should feature-detect
newer pieces independently; for example:

```js
const hasDialog = typeof HTMLDialogElement === "function";
const hasPopover =
  typeof HTMLElement === "function" &&
  "popover" in HTMLElement.prototype &&
  typeof HTMLElement.prototype.showPopover === "function" &&
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("selector(:popover-open)");
const hasRequestClose =
  hasDialog &&
  typeof HTMLDialogElement.prototype.requestClose === "function";
const hasClosedBy = hasDialog && "closedBy" in HTMLDialogElement.prototype;
let hasHintPopover = false;
if (hasPopover) {
  const hintProbe = document.createElement("div");
  hintProbe.popover = "hint";
  hasHintPopover = hintProbe.popover === "hint";
}
```

Unsupported command methods produce a clear Koka exception. Kokaine does not
silently install partial polyfills for `requestClose`, `closedby`, or hint
popover semantics.

## Responsive control flow

`kokaine/control` adds conditional and keyed structure without making the HTML
builder or either renderer collection-specific:

```koka
import kokaine/control

val ready = derive(root,False,fn() todos.get.length > 0)

when(ready,
  fn()
    ul
      for(fn() todos.get,fn(todo) todo/id(todo)) fn(item,index)
        li
          text { (index() + 1).show ++ ". " ++ todo/title(item()) }
  ,fallback=fn() p("Nothing to do."))
```

`branch(value, children)` rebuilds its conditional region when the supplied
memo publishes. `when(condition, children, fallback)` is its boolean form; the
fallback defaults to an empty view. Both accept tracked reads inside the child
builder and use ordinary dynamic-region lifetime.

The list and vector `for` overloads accept a tracked collection reader, a
business-key function, and a row builder. They walk their native collection in
sequence—the list overload is never converted to a vector. The row builder
receives read-only `item()` and `index()` accessors. When a retained key receives
a changed item or moves, those accessors publish the new value while the row's
DOM nodes, listener continuations, owned derivations/effects/resources, and
uncontrolled form state remain intact. Custom key comparison and item equality
functions are optional; equality suppresses needless item publications.

Keys must be unique within a snapshot. A duplicate throws and leaves the last
committed browser order and row sources unchanged; SSR rejects the same input.
The shared persistent balanced-tree index makes lookup and insertion
`O(log n)`, so a complete reconciliation is `O(n log n)` plus the required DOM
range moves. DOM interpretation is incremental and transactional; SSR renders
the current sequence once in source order.

## API shape

- `create-root`, `root.dispose`, `update`, `sample`, and `dispatch` delimit
  root-scoped reactive capabilities. Root construction commits only after its
  initial queue drains successfully; a failed action or bootstrap retires the
  unpublished root and its registered resources.
- `signal`, `signal-by`, and `signal-always` select equality behavior.
- `derive`, `derive-by`, and `derive-always` cache stateless derived values.
- `memo`, `memo-by`, and `memo-always` add a state entry that receives the
  previous successfully committed value.
- `create-effect(root, track, apply)` tracks only `track`; reads performed by
  `apply` do not silently become dependencies.
- `on-cleanup` parks a one-shot resource continuation under the current owner.
  Disposers returned by `create-effect` finalize the complete owned subtree.
- `capture-reentry` and `reenter` let a host callback re-enter the exact
  continuation generation that registered it. They restore Kokaine's reactive
  structure, not arbitrary lexical effect handlers. DOM listeners additionally
  park the user action in an opaque multi-shot event continuation; the host
  callback only snapshots the event and synchronously resumes that capability.
- `view`, common tag helpers, live text/attributes/properties, `region`, and
  typed listeners form the HTML DSL. A listener callback has the closed
  `<signal-read,signal-write,ui,pure>` capability row; unsupported application
  effects are rejected instead of escaping into a later host turn.
- `branch` and `when` consume memos and delimit conditional regions. List and
  vector `for` consume a sequential collection reader plus stable-key function;
  row item/index accessors are reactive but read-only.
- `mount`/`unmount` interpret a view into validated DOM ranges. A mount into a
  managed element inherits the exact same-root DOM generation which created
  that element, while `mount-independent` is the explicit opt-out. Mount
  construction is transactional, so a descendant bootstrap failure cannot
  leave caller-inaccessible DOM or listeners. Retired managed nodes keep only a
  numeric stale-owner tombstone: remount is rejected without retaining the old
  root or generation portal. `render` safely interprets the same value to a
  string.
- Native dialog and Popover elements stay in those same ranges even while the
  browser presents them in the top layer. Branch replacement, unmount, and
  `root.dispose` remove an open surface and retire its listeners exactly like
  any other owned DOM node; no portal or ownership exception is involved.

See [the architecture notes](docs/architecture.md) for the scheduler, handler,
browser re-entry, and WebAssembly design.

The [continuation runtime decision record](docs/continuation-runtime-plan.md)
records the capability assessment and invariants behind replacing the Observer
runtime with source-local indexes of actual continuation capabilities.

## Project layout

```text
examples/counter.kk                         thin browser entry point
examples/top-layer.kk                       native dialog and Popover example
examples/top-layer/                         standalone top-layer page and styles
examples/keyed.kk                           keyed control-flow specimen bench
examples/keyed/                             interactive keyed example shell and styles
examples/report.kk                          self-hosted report entry point
examples/report/*.kk                        report model and executable islands
examples/counter/model.kk                   sources and derived state
examples/counter/actions.kk                 mutations, batches, child effects
examples/counter/controls.kk                source controls and live properties
examples/counter/meter.kk                   live projections and trace ledger
examples/counter/probe.kk                   dynamic region and re-entry lifetime
examples/counter/app.kk                     page composition
src/kokaine/reactive.kk                    opaque public facade
src/kokaine/reactive/effects.kk            signal read/write effect operations
src/kokaine/reactive/internal/model.kk     traces, planes, scopes, and capabilities
src/kokaine/reactive/internal/capture.kk   exact read-suffix reification
src/kokaine/reactive/internal/registry.kk  removable O(1) lifetime registrations
src/kokaine/reactive/internal/lifetime.kk  detached two-phase retirement
src/kokaine/reactive/internal/resource.kk  opaque parked resource continuations
src/kokaine/reactive/internal/work-transaction.kk deque and local work groups
src/kokaine/reactive/internal/scheduler.kk invalidation, queues, targeted settle
src/kokaine/reactive/internal/structural.kk retained owners and transaction leases
src/kokaine/reactive/internal/handlers.kk  signal interpreters and dispatch
src/kokaine/reactive/internal/reentry.kk   batched structural host re-entry
src/kokaine/reactive/internal/runtime.kk   roots and high-level reactive values
src/kokaine/reactive/internal/bridge.kk    names used by the public facade
src/kokaine/internal/event-runtime.kk      guarded multi-shot browser event K
src/kokaine/internal/key-index.kk          persistent balanced keyed-row index
src/kokaine/control.kk                     branch, when, and list/vector keyed For
src/kokaine/html.kk                        handled backend-neutral view DSL
src/kokaine/dom.kk                         jsweb renderer and event boundary
src/kokaine/ssr.kk                         escaped deterministic string renderer
test/trace-semantics.kk                    exact suffix and branching semantics
test/resource-finalization.kk              resource-K parking and finalization
test/structural-scopes.kk                  ownership and cleanup generations
test/targeted-settle*.kk                   isolated and transitive memo settling
test/execution-planes.kk                   pure/effect plane behavior
test/stateful-entry-gates.kk               memo(previous) entry semantics
test/entry-targeted-settle.kk              entry routing and recovery canaries
test/final-control-rollback.kk              abandoned generation rollback
test/continuation-reentry.kk               callback-created ownership and staleness
test/reactive*.kk                          compatibility, advanced, and stress suites
test/control-flow.kk                       branch/when/For snapshots and duplicate keys
test/key-index.kk                          balanced-index correctness and growth bound
test/structural-transactions.kk            retained lifetime and joined-drain leases
test/html.kk                               builder, escaping, and validation checks
test/dom-lifecycle.kk                      listener, region, and re-entry fixture
test/dom-event-continuation.kk              nested synchronous event-K fixture
test/root-construction.kk                  unpublished-root rollback checks
test/dom-mount-rollback.kk                 descendant bootstrap rollback fixture
test/dom-ownership.kk                      physical same-root ownership fixture
test/dom-range-safety.kk                   marker and re-entrant cleanup safety
test/event_effect_boundary.py              closed callback-row compile canary
test/browser_counter.py                    browser events, churn, rollback, and disposal
test/dom-top-layer.kk                      dialog/Popover browser command fixture
test/browser_top_layer.py                  native top-layer behavior and disposal
support/wasmweb-proof/                     retained-callback Emscripten ABI proof
```

## Scope

Kokaine does not yet provide hydration, suspense, or a complete WASM DOM
renderer. Ordinary `region` remains a whole-range replacement primitive for
general conditional structure. Keyed list/vector reconciliation is available
only through `for` from `kokaine/control`, where an explicit business key makes
row identity and lifetime unambiguous.

Browser delivery still begins at an ordinary host ABI callback, but that
callback no longer calls the user action directly. Listener installation parks
the action behind `await-browser-event`; delivery snapshots the event, restores
the structural/reactive context with `reentry<e>`, and synchronously resumes the
opaque multi-shot event K. Multi-shot is required because DOM dispatch may nest
before the outer action returns. Retirement changes the capability to
`Event-retired`, clears the trampoline's retained action cell, and only then
attempts host listener removal; even a host removal failure leaves no live Koka
closure behind.

`capture-reentry` itself remains non-resumptive: it restores Kokaine's signal
handlers, continuation gate, and owning frame around the event-K resume. It
does not reconstruct arbitrary user-defined handlers that lexically surrounded
`mount` and have since returned. The public listener type therefore keeps a
closed capability row; handle additional effects inside the callback. A future
explicit application runner could widen that row only by reinstalling its
handlers at every host turn.

## Design references

The [Koka book](https://koka-lang.github.io/koka/doc/book.html) is the language
and effect-handler reference. Solid's documentation for
[signals](https://docs.solidjs.com/concepts/signals),
[memos](https://docs.solidjs.com/concepts/derived-values/memos),
[effects](https://docs.solidjs.com/concepts/effects), and
[batching](https://docs.solidjs.com/reference/reactive-utilities/batch) supplied
the semantic baseline for fine-grained UI behavior.

The koka-community [HTML DSL](https://github.com/koka-community/html) and
[reactives](https://github.com/koka-community/reactives) repositories were
treated as design references, not dependencies. The scheduler, safety
boundaries, lifecycle, escaping, and asynchronous callback behavior here are
independently implemented and tested.
