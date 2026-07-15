# Kokaine

Kokaine is an experimental fine-grained UI runtime for
[Koka](https://koka-lang.github.io/koka/doc/book.html). Signals, derivations,
effects, batching, and ownership are expressed with Koka's algebraic effects;
the browser layer uses an effect-handled Koka DSL instead of JSX or a virtual
DOM.

The implementation targets Koka 3.2.3. The source-local continuation trace,
one-shot observer scheduler, and HTML vocabulary are backend-neutral; the
complete browser renderer targets `jsweb`, and a small `wasmweb` bridge proves
that retained Koka callbacks can safely re-enter the runtime after `main`
returns.

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

| Capability     | Operation               | Handler responsibility                                               |
| -------------- | ----------------------- | -------------------------------------------------------------------- |
| `signal-read`  | `count.get`             | Validate its producer, then attach a wake token and version checkpoint. |
| `signal-write` | `count.set(1)`          | Commit atomically, fire source-local wake capabilities, and flush.    |
| `html<e>`      | `text`, `div`, `region` | Collect emitted nodes into a backend-neutral `view<e>`.               |

This split has practical consequences. A memo calculator accepts
`signal-read` but not `signal-write`; an effect separates its tracked function
from its untracked apply function; `untrack` is a nested override handler; and
`batch` is a scoped interpretation of write operations. Runtime containment
also rejects a write handler smuggled into a derivation, so the static promise
survives higher-order code.

## Current guarantees

- Dynamic source subscriptions are rebuilt for every observer generation;
  the previous token eagerly cancels its old-branch links.
- Observer rounds are driven by one-shot raw resumptions; action failures
  publish the next retry continuation, and disposal explicitly finalizes
  parked contexts.
- Abortive host control leaves an observer retryable through a retained
  recovery action. A resumptive or multi-shot host continuation must not
  escape an observer round; that remains outside the supported runtime model.
- There is no centralized dependency graph, node registry, topological rank,
  observer reverse-edge list, or `Pending`/`Stale` propagation state.
- Derivations settle before user effects. A memo read recursively validates
  its generation checkpoints and extracts only the exact dirty producer, so
  rank-free diamonds and dynamic depth changes do not mix old and new values
  or execute an unrelated queued sibling.
- Only an unequal signal or memo commit increments its source version and
  fires wake tokens. An equal intermediate leaves a clean downstream
  `memo(previous)` generation untouched.
- Direct-handle queues deduplicate observer work, and each generation's
  one-shot token deduplicates duplicate source wakeups; lazy validation follows
  only the producer checkpoints required by the requested value.
- Nested batches delay propagation while making the latest source values
  immediately readable.
- Effects own nested effects, cleanup callbacks, DOM listeners, and regions.
  Each child captures the exact parent continuation generation that created
  it, so a parent refresh retires stale child work independently of batch write
  order. Disposal is exhaustive, idempotent, and isolated from cleanup writes.
- Owner/checkpoint cycles are rejected before publication. In particular, an
  owner cannot track a memo created by its own replacement cleanup; a direct
  owner invalidation can still retire that scope and recover the root.
- Memo failures retry instead of exposing a stale cached value.
- Text and attributes are escaped in SSR. Inline `on*`, `srcdoc`, and
  markup-writing DOM properties are rejected; raw markup requires the explicit
  `unsafe-trusted-html` boundary.
- Native JavaScript DOM exceptions are translated to Koka `exn` before they
  cross a reactive handler or cleanup frame.

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
- `view`, common tag helpers, live text/attributes/properties, `region`, and
  typed listeners form the HTML DSL.
- `mount`/`unmount` interpret a view into DOM ranges; `render` safely interprets
  the same value to a string.

See [the architecture notes](docs/architecture.md) for the scheduler, handler,
browser re-entry, and WebAssembly design.

The [continuation runtime decision record](docs/continuation-runtime-plan.md)
records the research, capability assessment, and invariants behind the removal
of the centralized graph in favor of source-local, continuation-indexed wake
traces.

## Project layout

```text
src/kokaine/reactive.kk  source-local trace, continuation scheduler, ownership
src/kokaine/html.kk      backend-neutral view values and handled HTML DSL
src/kokaine/ssr.kk       escaped deterministic string renderer
src/kokaine/dom.kk       jsweb DOM interpreter and asynchronous event boundary
examples/counter.kk      responsive interactive example
test/reactive.kk         scheduler, error, disposal, and containment invariants
test/reactive-advanced.kk  deep diamonds, owner gates/cycles, 10k stale fan-out
test/reactive-stress.kk  fixed-seed differential sources, values, and run counts
test/continuation.kk     raw resume, failure retry, and finalize semantics
test/no_dependency_graph.py  structural assertion that graph machinery is gone
test/html.kk             builder, liveness, escaping, and validation checks
test/browser_counter.py  event bursts, lifecycle churn, disposal, responsive UI
test/dom-errors.kk       raw DOM exception translation fixture
test/dom-lifecycle.kk    detached-listener and idempotent-unmount fixture
support/wasmweb-proof/   retained-callback Emscripten ABI proof
```

## Scope

Kokaine does not yet provide hydration, keyed list reconciliation, suspense,
or a complete WASM DOM renderer. The current `region` primitive intentionally
replaces its owned range; it is the correct building block for conditional
structure, not an optimized list diff.

Browser callbacks run after the lexical handlers around `main` have gone out
of scope. Kokaine therefore reinstalls its signal and exception handlers on
every event. If a callback uses another user-defined algebraic effect, handle
that effect inside the callback (or install a fresh application runner at the
event boundary); do not rely on a handler that surrounded the original mount.

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
