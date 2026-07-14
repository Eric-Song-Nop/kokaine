# Kokaine

Kokaine is an experimental fine-grained UI runtime for
[Koka](https://koka-lang.github.io/koka/doc/book.html). Signals, derivations,
effects, batching, and ownership are expressed with Koka's algebraic effects;
the browser layer uses an effect-handled Koka DSL instead of JSX or a virtual
DOM.

The implementation targets Koka 3.2.3. The reactive graph and HTML vocabulary
are backend-neutral, the complete browser renderer targets `jsweb`, and a
small `wasmweb` bridge proves that retained Koka callbacks can safely re-enter
the graph after `main` returns.

## Why algebraic effects

Ordinary signal libraries hide a mutable dependency collector behind every
getter. Kokaine makes the capabilities visible in inferred effect rows:

| Capability     | Operation               | Handler responsibility                                               |
| -------------- | ----------------------- | -------------------------------------------------------------------- |
| `signal-read`  | `count.get`             | Return the value and, when tracking, record the dynamic edge.        |
| `signal-write` | `count.set(1)`          | Commit atomically, invalidate subscribers, and schedule propagation. |
| `html<e>`      | `text`, `div`, `region` | Collect emitted nodes into a backend-neutral `view<e>`.              |

This split has practical consequences. A memo calculator accepts
`signal-read` but not `signal-write`; an effect separates its tracked function
from its untracked apply function; `untrack` is a nested override handler; and
`batch` is a scoped interpretation of write operations. Runtime containment
also rejects a write handler smuggled into a derivation, so the static promise
survives higher-order code.

## Current guarantees

- Dynamic dependencies are rebuilt on every successful computation.
- Derivations settle before user effects and are ordered by graph rank.
- `Pending` propagation preserves equality pruning through memo chains, so
  diamonds never expose a mixture of old and new values.
- Queue entries are deduplicated and lazy reads recursively settle their
  producers without re-entering the global flush.
- Nested batches delay propagation while making the latest source values
  immediately readable.
- Effects own nested effects, cleanup callbacks, DOM listeners, and regions.
  Disposal is exhaustive, idempotent, and isolated from cleanup writes.
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
  graph capabilities.
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

## Project layout

```text
src/kokaine/reactive.kk  effect-typed graph, scheduler, batches, ownership
src/kokaine/html.kk      backend-neutral view values and handled HTML DSL
src/kokaine/ssr.kk       escaped deterministic string renderer
src/kokaine/dom.kk       jsweb DOM interpreter and asynchronous event boundary
examples/counter.kk      responsive interactive example
test/reactive.kk         scheduler, error, disposal, and containment invariants
test/html.kk             builder, liveness, escaping, and validation checks
test/browser_counter.py  browser events, host safety, lifecycle, responsive UI
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
