# PocketJS backend feasibility

Kokaine's PocketJS backend is experimental and currently targets
[PocketJS 0.6.0](https://pocketjs.dev/docs/architecture/). In this document,
"backend" means a UI renderer and native packaging path. PocketJS is **not** a
database, persistence service, or BaaS: it is a retained native UI stack whose
application code runs in QuickJS and sends synchronous `ui.*` mutations to a
shared Rust core.

## Decision

PocketJS is a feasible additional renderer, with a deliberately narrower first
release. Koka's existing `jsweb` output is JavaScript that PocketJS can bundle
for its QuickJS guest. Kokaine's signal, continuation, scheduler, lifetime, and
host re-entry layers do not depend on the DOM. The integration can therefore
reuse that kernel while supplying a Pocket-specific view algebra and renderer.

It must not emulate the DOM or reinterpret `kokaine/html`. HTML elements,
attributes, browser events, SSR escaping, and DOM range reconciliation encode
browser semantics that PocketJS does not have. Keeping a separate native view
type also lets unsupported capabilities fail at Koka compile time instead of
becoming silent host no-ops.

Three independent axes are involved:

| Axis | Browser application | PocketJS application |
| --- | --- | --- |
| Koka compiler target | `jsweb` | `jsweb` |
| View vocabulary and renderer | `kokaine/html` + DOM | Pocket-specific `View`, `Text`, and `Image` algebra |
| Bundle and host | Vite + browser APIs | Pocket CLI + QuickJS + Rust retained UI core |

"PocketJS" is consequently not a new Koka compiler target. It is a renderer
and packager selected after Koka compilation. That distinction keeps future
renderers from multiplying compiler-target conditionals through the reactive
core.

## Integration boundary

The JavaScript bridge calls PocketJS's public
`@pocketjs/framework/solid/renderer` adapter rather than calling the raw
`globalThis.ui` HostOps table. The adapter owns the JavaScript mirror tree,
input registration, detach/reinsert semantics, and end-of-frame reclamation.
Bypassing it would create a second, subtly incompatible implementation of those
rules.

The bridge is a small, versioned capability installed before Koka application
code renders. Koka owns reactive tracking and generation lifetime; the bridge
owns only native node creation, insertion/removal, text replacement, inline
property updates, image sources, focusability, and `onPress` transport. Host
delivery uses the generic typed continuation in
`kokaine/reactive/integration/event`, plus a captured generation re-entry, so a
retired region or disposed root cannot run a stale handler.

The dependency direction remains one-way:

```text
Pocket view algebra, renderer, and virtual-time dispatcher
              |
              v
reactive integration (lifetime, re-entry, typed event, Async host turn)
              |
              v
reactive continuation kernel
```

The core package does not import PocketJS. `@kokaine/pocketjs` carries both the
Koka source adapter and the JavaScript bridge and declares PocketJS as a peer.

## Build composition and asset scan

A Pocket application needs a small `.ts` or `.tsx` entry. It imports
`mountKokaine` before the generated application module and passes it a Koka
entry which returns its root cleanup function. The wrapper installs the bridge,
calls Pocket's `mount`, installs one frame-bound async scope inside the Pocket
owner, scopes Koka rendering through `createPocketRoot`, and on teardown
disposes the Koka root and async queue before Pocket destroys the native mirror.
Import the generated application module, not Koka's auto-running `__main` wrapper.
Pocket's manifest still selects its supported framework adapter; Kokaine is
composed beneath that entry rather than added as a third Pocket framework mode.

The Koka entry must bracket its own partial startup until it returns cleanup;
the wrapper cannot call a disposer that was never returned. The runnable
example uses a committed `finally` to retire a Koka root if view construction or
mounting throws. After cleanup has been returned, the wrapper rollback boundary
covers that cleanup, the native Koka root, and the installed bridge.

Pocket 0.6's own `render()` installs its application/overlay layers and frame
handler before invoking the renderer callback, but exposes no public rollback
when a later startup operation throws. Consequently, any startup failure after
that point must be treated as a fatal application-start failure and must not be
retried in the same guest. Full host rollback requires an upstream transactional
`mount()` implementation; the adapter deliberately does not reach into Pocket's
private renderer state.

Generated Koka exports also need a modeled-exception handler at every raw
JavaScript call edge. Wrap the entry and returned disposer with `host-entry`;
it closes Koka's `exn` effect and converts a failure into a native error so the
JavaScript wrapper can roll back. The adapter import additionally installs the
narrow `console` and `process.stdout` shapes needed while Koka 3.2's console
module is evaluated in a native QuickJS realm. The bundle smoke test removes
Node's versions of both globals before evaluation to keep this contract honest.

Pocket 0.6's published CLI delegates compilation to scripts in a complete
PocketJS checkout; installing the npm CLI alone is not a standalone compiler.
The repository target therefore requires `POCKETJS_CHECKOUT` to point at the
exact v0.6.0 tag (`1f848dcdb2629e3c6373710cd0aa16d775ea2ad3`) after `bun install`;
the Make target rejects a different version or commit. This is an upstream integration cost,
not a new Koka compiler target:

```sh
make test-pocketjs-wasm POCKETJS_CHECKOUT=/path/to/pocketjs-v0.6.0
make test-pocketjs-browser POCKETJS_CHECKOUT=/path/to/pocketjs-v0.6.0
```

Pocket's build is two-pass. The first pass transforms the reachable TypeScript
and TSX graph while collecting class literals, text codepoints, and image
filenames; it then bakes styles, font atlases, and assets. The second pass
bundles the transformed graph. Literals that exist only in Koka-generated
`.mjs` are bundled, but do not participate in the first-pass collector.

That creates two explicit rules for this adapter:

- use the Pocket Koka API's inline style properties; class-based dynamic styles
  from generated Koka are not supported in the first release;
- repeat every non-ASCII glyph and image filename used only by Koka in a
  TypeScript sidecar visible to the collector. `--extra-chars` is also suitable
  for glyph coverage. Missing declarations may produce tofu glyphs or missing
  packaged images even though the JavaScript bundle itself is valid.

Pocket 0.6 bakes its default 16px regular atlas into font slot 2, while a raw
core text node defaults to slot 0. Pocket's text-size and font-weight utilities
select an atlas slot explicitly. Kokaine uses inline styles, so its bridge
initializes each native `Text` wrapper with slot 2; an explicit
`font-slot(...)` property still overrides it.
Without this adapter default, HostOps receives the correct string but the text
run has zero height and renders no glyphs.

See Pocket's [build pipeline](https://pocketjs.dev/docs/build-pipeline/) and
[native contract](https://pocketjs.dev/docs/native-contract/) for the upstream
rules. A later integration could generate the sidecar automatically, but it
must remain an explicit build artifact rather than pretending the current
collector scans Koka modules.

## Runtime constraints

Device builds execute application JavaScript in QuickJS, not in a browser.
There is no DOM, browser `fetch`, `setTimeout`, `MessageChannel`, or
`performance` clock. Pocket supplies frame-based lifecycle and a Promise-based
microtask shim, but that does not make browser scheduling APIs available. The
adapter's tiny console/process compatibility prelude exists only for Koka's
generated console ABI; it is not a general Node polyfill.

Synchronous `Press` remains a separate closed callback path. `Async-press`
captures the same revocable algebraic-effect continuation used by DOM events,
but each invocation starts a fresh Pocket `run-async` family inside the owning
generation. Await completion never resumes that continuation from a Promise or
timer callback. It posts a `ui`-only turn into a mount-scoped FIFO; the next
Pocket frame validates generation ownership, restores re-entry, opens a fresh
reactive transaction, and resumes the suffix.

`sleep` and `timeout` take integer milliseconds and use a mount-scoped deadline
queue driven by Pocket's deterministic lifecycle frames. Pocket 0.6 maps the
public lifecycle subpath into compiled framework applications, but does not map
the clock subpath for external adapters; importing that subpath can create a
second clock singleton that the host never advances. The bridge instead latches
Pocket's normalized simulation rate and counts deadlines in its lifecycle hook.
This also keeps the bundle independent from Koka 3.2's generated
`std/time/duration` module graph, which Pocket 0.6 cannot bundle correctly.

Delays round upward to a simulation-frame boundary, with `yield()` and
`sleep(0)` still waiting one frame. Each frame advances due deadlines before
flushing the dispatcher, so a due timer can post and resume later in that same
host frame. Work posted by a running async turn is snapshot-isolated until the
next frame. Root cleanup runs before the frame scope closes, canceling timers
and revoking every retained K.

The browser example is a development preview, not a production Web backend. It
serves the physical `host-web` directory and `pocketjs.wasm` shipped inside the
lockfile-pinned framework package because Pocket 0.6 does not export that host
as a public package API. The server supplies Pocket's dynamic `/demos` endpoint,
and the upstream engine evaluates the compiled IIFE with `new Function`; a
strict Content Security Policy would therefore require a different loader or
`unsafe-eval`. The software renderer uses a fixed 480x272 framebuffer and copies
it to Canvas every frame. It is useful for layout, text, and input correctness,
but it is not evidence of QuickJS compatibility, PSP memory usage, GPU behavior,
or device frame rate. The fixture intentionally provides no HMR or production
deployment layer.

## First-release surface

Included:

- `View`, `Text`, `Image`, fragments, and dynamic regions;
- reactive text and supported per-node inline style properties;
- image sources, focusability, synchronous `onPress`, and async press;
- generation-owned `run-async`, structured concurrency, virtual
  `sleep`/`yield`, and `timeout`;
- exact generation ownership, stale-callback revocation, and root disposal.

Not included:

- `kokaine/html`, DOM nodes/events/attributes, or trusted HTML;
- Web Async, direct Promise/Fetch interop, wall-clock timers, or browser globals;
- generic Pocket host-I/O effects or async `Resource`;
- keyed reconciliation, SSR, hydration, portals, or browser control helpers;
- class-based dynamic styling from Koka-generated modules;
- a claim of PSP memory or frame-rate parity with native Pocket demos.

This split is intentional. Keyed rows and future host-I/O effects need native
publication and frame-turn contracts of their own; copying the DOM transaction
or Web scheduler would give them the wrong semantics.

## Version policy and verification

The adapter is implemented against `@pocketjs/framework` 0.6.0. Because
PocketJS is pre-1.0 and the renderer subpath is the critical compatibility
boundary, development uses the exact 0.6.0 release and the peer range excludes
0.7.0. Upgrade the range only after the bridge contract and generated bundle
have been revalidated.

Verification is layered; passing an earlier layer is not evidence for a later
one:

1. Koka/native and JavaScript bridge tests verify typed callback transport,
   node mutation ordering, inline-style snapshots, failed-insert rollback,
   revocation, and composed Koka/Pocket disposal.
2. Pocket's headless/Bun host verifies the bundled renderer contract without a
   display or device toolchain.
3. The Pocket browser/WASM host verifies visible layout, text, and input against
   the shared Rust core.
4. PPSSPP verifies the packaged PSP artifact, QuickJS host contract, controls,
   and emulator-observable memory behavior.
5. A real PSP verifies the actual 8 MB budget, allocator pressure, display/input
   behavior, and sustained frame rate.

The checked-in verification currently covers typed Koka callback/lifetime and
dispatcher-rejection tests, virtual timer/timeout cancellation, queued-turn
retirement, multi-shot async press, and the JavaScript bridge contract. An exact
0.6.0 `pocket compile` runs the real async press through a QuickJS-like
no-console/no-process bundle smoke and observes its synchronous `waiting` and
next-frame `resumed` publications. The upstream Rust/WASM core and real headless
Chromium host repeat that cross-frame check while also verifying layout, native
focus, the baked font atlas, visible Canvas text, and `Count 1` without page,
console, or HTTP errors.
A controlled [PPSSPP microbenchmark](pocketjs-ppsspp-benchmark.md) has now run
the Kokaine bridge inside the native PSP QuickJS host and compared seven
byte-identical workloads with the experimental Vue VDOM, Vue Vapor, and Solid
paths. The comparison uses an older draft PocketJS branch because that is the
only branch containing all three reference renderers; it is not verification of
the exact supported 0.6.0 release host. Memory profiling and real hardware have
still **not** been run. In particular, PPSSPP CPU submission-work timings are
not a device FPS result; real PSP behavior remains unverified until tested on a
device.

Upstream references: [getting started](https://pocketjs.dev/docs/getting-started/),
[frameworks](https://pocketjs.dev/docs/frameworks/), and
[API](https://pocketjs.dev/docs/api/).
