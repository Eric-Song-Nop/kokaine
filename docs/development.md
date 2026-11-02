# Repository development

This page is for working on Kokaine itself. To build an application with
Kokaine, start from the [README quick start](../README.md#quick-start).

## Prerequisites and tests

Prerequisites are Koka 3.2.3–3.2.9 (CI runs both), Python 3, and `make`. Set `PYTHON=/path/to/python`
when the Python 3 executable is not named `python3`. The browser checks
additionally use [`uv`](https://docs.astral.sh/uv/) to run Playwright without
adding project dependencies.

```sh
make test-tooling
make test
make browser-install
make test-browser
make test-wasm
```

`make test` includes the async algebra, structured-concurrency, and compile-time
capability checks. `make test-browser` builds and exercises the Web adapters,
turn boundary, generation retirement, hostile late completions, and Resource
churn in Chromium. These aggregate commands are the authoritative async test
entry points.

## Playground

This path requires Node.js `>=22.12.0` and [pnpm](https://pnpm.io/), but does
not require native Koka:

```sh
git clone https://github.com/Eric-Song-Nop/kokaine.git
cd kokaine
pnpm install
pnpm --filter @kokaine/playground dev
```

Open the URL printed by Vite.

From the repository root, the same development server is also available as:

```sh
make serve-playground
```

The first run downloads about 38 MiB of hash-pinned Koka browser assets into
`~/.cache/kokaine/playground` (they are not tracked in git); later runs reuse
that cache. The playground itself does not need a native Koka installation. Its workbench
DOM, reactive state, and event handlers are authored in Koka and mounted with
Kokaine; a framework-neutral TypeScript host owns Monaco and other browser-only
capabilities. The Koka compiler and real Koka LSP both run as WebAssembly in
browser Workers against an in-memory filesystem containing the Koka standard
library and this checkout's Kokaine sources. The playground includes Monaco
syntax highlighting, a sandboxed live preview, generated/build/runtime output,
and self-hosted Chromium DevTools. The published `@kokaine/cli`
package-resolution model can later extend the browser VFS with installed npm
package contents without introducing a compiler server.

The app is fully static and deploys to Cloudflare Pages without a container,
Cloudflare Worker, or Pages Function. Vite and `public/_headers` provide the
COOP/COEP headers required by the WASM LSP's `SharedArrayBuffer` transport:

```sh
make playground-precompile   # after changing packages/core/src/kokaine/**
make playground-build
make playground-preview
make playground-deploy       # precompile, smoke-test, build, then production upload
```

See [`packages/playground/README.md`](../packages/playground/README.md) for the
pinned-asset workflow, Pages setup, browser requirements, and security
boundary.

## Examples

### Continuation Lab

To explore the responsive Continuation Lab:

```sh
make serve
```

Then open <http://127.0.0.1:4173/examples/counter/>. `make build-counter`
emits the `jsweb` ES modules into the ignored `dist/` directory.

The lab is intentionally a multi-file application rather than one oversized
demo component:

| Module | What it demonstrates |
| --- | --- |
| `model.kk` | Sources, dynamic `derive`, custom equality, explicit accumulated signals, `untrack`, `signal-always`, and tracked/apply effect sinks. |
| `actions.kk` | Ordinary writes, explicit batches, and callback-created effects and cleanups. |
| `controls.kk` | Typed events plus live value, checked, and disabled DOM properties. |
| `meter.kk` | Fine-grained live text/attributes and a visible `source -> captured suffix -> DOM effect` trace. |
| `probe.kk` | Dynamic regions, host re-entry, generation ownership, and exact retirement. |
| `app.kk` | Static page composition across the feature modules. |

`examples/counter.kk` is only the browser entry point: it creates the root and
model, composes the page, and mounts it. In the lab, changing the inactive
channel demonstrates dependency pruning and switching the selector replaces
the dynamic branch; crossing zero shows custom equality and explicit
accumulation through a signal/effect pair;
editing the operator separates tracked reads from `untrack`; repeatedly
publishing heartbeat `0` demonstrates `signal-always`; and retiring the probe
region removes its listener, child effect, and cleanup as one
continuation-owned generation.

### Native top layer

Run the native top-layer example from a repository checkout:

```sh
make serve-top-layer
```

Open <http://127.0.0.1:4173/examples/top-layer/> to try a modal dialog with a
native `method="dialog"` form and an auto popover controlled entirely through
`popovertarget` attributes. The page also shows browser-driven close/toggle
state being written back through Kokaine event handlers.

See [Native dialog and Popover](top-layer.md) for the API.

### Keyed reconciliation

The keyed reconciliation bench makes DOM identity directly observable:

```sh
make serve-keyed
```

Open <http://127.0.0.1:4173/examples/keyed/>, type into a row's uncontrolled
note field, then reverse, prepend, revise, or delete rows. The changing index
readout follows position while the input value and focus stay with the stable
business key.

### PocketJS

The [PocketJS browser example](../examples/pocketjs/README.md) runs the generated
Koka application through Pocket's official Canvas/WASM host. With an exact
PocketJS 0.6.0 checkout prepared as described there, use:

```sh
make serve-pocketjs-example POCKETJS_CHECKOUT=/absolute/path/to/pocketjs
make test-pocketjs-browser POCKETJS_CHECKOUT=/absolute/path/to/pocketjs
```

See [PocketJS feasibility and boundaries](pocketjs.md) for the backend's scope
and constraints.

### WebAssembly proof

`make test-wasm` additionally requires Emscripten and Node. It compiles the
isolated `wasmweb` proof and verifies two asynchronous fake-DOM events.

## Interactive report

The Chinese report [代数效应与续体如何组成增量 UI](algebraic-effects-ui-report/index.html)
explains the runtime from a UI engineer's perspective. It includes executable
continuation-trace visualizations, scheduler stepping, batching and ownership
experiments, a React/Vue/Solid comparison, and the real Koka Continuation Lab.
Its core data-flow, Koka feature atlas, dynamic-dependency, and ownership
sections—and the document shell, scheduler, batching lab, comparison, code
tabs, navigation, and embedded-demo lifecycle—are all authored in Koka. One
Kokaine root mounts one page view from `examples/report/*.kk`; the checked-in
HTML is only the stylesheet/module entry shell, with no handwritten JavaScript.

```sh
make serve-report
```

Then open
`http://127.0.0.1:4173/docs/algebraic-effects-ui-report/`. Run the report's
source-architecture and real-browser checks with `make test-report`.
