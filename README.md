# Kokaine

Kokaine is an experimental fine-grained UI runtime for
[Koka](https://koka-lang.github.io/koka/doc/book.html). Signals, derivations,
effects, batching, and ownership are expressed with Koka's algebraic effects;
the browser layer uses an effect-handled Koka DSL instead of JSX or a virtual
DOM.

The implementation targets Koka 3.2.3. Its source-local continuation index,
two-plane scheduler, and HTML vocabulary are backend-neutral. The complete
browser renderer targets `jsweb`; a smaller `wasmweb` proof separately verifies
the retained-callback ABI used to cross an asynchronous host boundary.

## Interactive report

The Chinese report [代数效应如何驱动增量 UI](docs/algebraic-effects-ui-report/index.html)
explains the runtime from a UI engineer's perspective. It includes executable
continuation-trace visualizations, scheduler stepping, batching and ownership
experiments, a React/Vue/Solid comparison, and the real Koka counter demo.

```sh
make serve-report
```

Then open
`http://127.0.0.1:4173/docs/algebraic-effects-ui-report/`. Run the report's
static integrity checks with `make test-report`.

## Why algebraic effects

Ordinary signal libraries hide a mutable dependency collector behind every
getter. Kokaine makes the capabilities visible in inferred effect rows:

| Capability     | Operation               | Handler responsibility                                                  |
| -------------- | ----------------------- | ----------------------------------------------------------------------- |
| `signal-read`  | `count.get`             | Validate its producer and capture the exact synchronous read suffix.    |
| `signal-write` | `count.set(1)`          | Commit, invalidate source-indexed continuation capabilities, and flush. |
| `html<e>`      | `text`, `div`, `region` | Collect emitted nodes into a backend-neutral `view<e>`.                  |

This split has practical consequences. A memo calculator accepts
`signal-read` but not `signal-write`; an effect separates its tracked function
from its untracked apply function; `untrack` is a nested override handler; and
`batch` is a scoped interpretation of write operations. Runtime containment
also rejects a write handler smuggled into a derivation, so the static promise
survives higher-order code.

## Current guarantees

- A tracked synchronous `get` uses `raw ctl` to capture the continuation after
  that exact read. Invalidation resumes that suffix; code before the read is not
  replayed.
- Each source indexes rank-2 packages containing the actual execution plane,
  target trace, and owning read trace. There are no subscriber wake closures,
  retained calculation actions, or old-style Observer dependency graph.
- Scheduler tickets contain either an actual trace resumption or a one-shot
  bootstrap scope. The bootstrap slot is cleared before its initial calculation
  runs; a producer never retains `calculate` as a recovery fallback.
- `Capture-pending` and `Capture-running` are lifecycle states of resumptions,
  not dirty flags paired with a separately retained action. A write while a K
  is running marks that same capability for a later turn.
- Pure derivations run on `plane<total>`; user effects run on `plane<e>`. A
  synchronous memo read can therefore settle only the required producer chain
  without erasing an ambient user effect row or draining unrelated work.
- Stateful `memo(previous)` values retain an entry continuation that receives
  the latest successfully committed value. It does not subscribe the memo to
  its own output source.
- Unequal commits advance the source version and invalidate its indexed
  continuations. Equality cuts propagation before downstream work is scheduled.
- Replacement generations are built as drafts. Failure or abortive final
  control retires unpublished continuations and structural children while the
  committed source value and pending retry K remain explicit.
- Continuation frames own nested effects, derivations, cleanup callbacks, DOM
  listeners, and regions. Replacing a generation retires that complete extent;
  root disposal is exhaustive and idempotent.
- Nested batches delay settling while making newly committed source values
  immediately readable. Host re-entry is also one atomic batched turn.
- Browser listeners capture a typed `reentry<e>` containing their registering
  generation's root, gate, and frame. Re-entry restores that structural context
  and rejects a retired generation, so callback-created reactive work cannot
  escape to the root.
- Text and attributes are escaped in SSR. Inline `on*`, `srcdoc`, and
  markup-writing DOM properties are rejected; raw markup requires the explicit
  `unsafe-trusted-html` boundary. Native DOM exceptions become Koka `exn`.

## Quick start

Prerequisites are Koka 3.2.3 and `make`. The browser checks additionally use
[`uv`](https://docs.astral.sh/uv/) to run Playwright without adding project
dependencies.

```sh
make test
make browser-install
make test-browser
make test-wasm
```

To explore the responsive counter instrument:

```sh
make serve
```

Then open <http://127.0.0.1:4173/examples/counter/>. `make build-counter`
emits the `jsweb` ES modules into the ignored `dist/` directory.

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
    val doubled = memo(root,0,fn(_) count.get * 2)
    (count,doubled)

  val page = view fn()
    div([class("counter")],fn()
      button([kind("button"),
              on-click(fn(_) count.modify(fn(n) n + 1))],fn()
        text("Increment")
      )
      strong([],fn()
        text-live(fn() doubled.get.show)
      )
    )

  val stop = mount(root,query("#app"),page)
  ()
```

The `view fn() ...` block is normal Koka syntax. Tag helpers delimit nested
`html` handlers, while `text-live` installs a fine-grained binding when the
view is mounted. Static structure is created once; only the dependent text
node changes after a click.

For deterministic snapshots or server output, replace the DOM import with
`kokaine/ssr` and call `render(root,page)`.

## API shape

- `create-root`, `root.dispose`, `update`, `sample`, and `dispatch` delimit
  root-scoped reactive capabilities.
- `signal`, `signal-by`, and `signal-always` select equality behavior.
- `memo`, `memo-by`, and `memo-always` cache derived values and receive the
  previous successful value.
- `create-effect(root, track, apply)` tracks only `track`; reads performed by
  `apply` do not silently become dependencies.
- `on-cleanup` attaches work to the current owner. A returned disposer removes
  the complete owned subtree.
- `capture-reentry` and `reenter` let a host callback re-enter the exact
  continuation generation that registered it. They restore Kokaine's reactive
  structure, not arbitrary lexical effect handlers.
- `view`, common tag helpers, live text/attributes/properties, `region`, and
  typed listeners form the HTML DSL.
- `mount`/`unmount` interpret a view into DOM ranges; `render` safely interprets
  the same value to a string.

See [the architecture notes](docs/architecture.md) for the scheduler, handler,
browser re-entry, and WebAssembly design.

The [continuation runtime decision record](docs/continuation-runtime-plan.md)
records the capability assessment and invariants behind replacing the Observer
runtime with source-local indexes of actual continuation capabilities.

## Project layout

```text
src/kokaine/reactive.kk                    opaque public facade
src/kokaine/reactive/effects.kk            signal read/write effect operations
src/kokaine/reactive/internal/model.kk     traces, planes, scopes, and capabilities
src/kokaine/reactive/internal/capture.kk   exact read-suffix reification
src/kokaine/reactive/internal/lifetime.kk  draft transactions and finalization
src/kokaine/reactive/internal/scheduler.kk invalidation, queues, targeted settle
src/kokaine/reactive/internal/handlers.kk  signal interpreters and dispatch
src/kokaine/reactive/internal/reentry.kk   batched structural host re-entry
src/kokaine/reactive/internal/runtime.kk   roots and high-level reactive values
src/kokaine/reactive/internal/bridge.kk    names used by the public facade
src/kokaine/html.kk                        handled backend-neutral view DSL
src/kokaine/dom.kk                         jsweb renderer and event boundary
src/kokaine/ssr.kk                         escaped deterministic string renderer
test/trace-semantics.kk                    exact suffix and branching semantics
test/structural-scopes.kk                  ownership and cleanup generations
test/targeted-settle*.kk                   isolated and transitive memo settling
test/execution-planes.kk                   pure/effect plane behavior
test/stateful-entry-gates.kk               memo(previous) entry semantics
test/entry-targeted-settle.kk              entry routing and recovery canaries
test/final-control-rollback.kk              abandoned generation rollback
test/continuation-reentry.kk               callback-created ownership and staleness
test/reactive*.kk                          compatibility, advanced, and stress suites
test/html.kk                               builder, escaping, and validation checks
test/dom-lifecycle.kk                      listener, region, and re-entry fixture
test/browser_counter.py                    browser events, churn, and disposal
support/wasmweb-proof/                     retained-callback Emscripten ABI proof
```

## Scope

Kokaine does not yet provide hydration, keyed list reconciliation, suspense,
or a complete WASM DOM renderer. The current `region` primitive intentionally
replaces its owned range; it is the correct building block for conditional
structure, not an optimized list diff.

Browser event delivery still begins with an ordinary host callback; it does not
resume a parked event continuation. `reentry<e>` is
**continuation-derived structural re-entry**: it restores Kokaine's signal
handlers, continuation gate, and owning frame, then executes the callback as a
batched turn. It does not reconstruct arbitrary user-defined handlers that
lexically surrounded `mount` and have since returned. Handle such effects
inside the callback, or install a fresh application runner at the host boundary.

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
