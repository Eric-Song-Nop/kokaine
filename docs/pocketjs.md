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
Pocket view algebra and renderer
              |
              v
reactive integration (lifetime, re-entry, typed host event)
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
calls Pocket's `mount`, scopes Koka rendering through `createPocketRoot`, and on
teardown disposes the Koka root before Pocket destroys the native mirror. Import
the generated application module, not Koka's auto-running `__main` wrapper.
Pocket's manifest still selects its supported framework adapter; Kokaine is
composed beneath that entry rather than added as a third Pocket framework mode.

That rollback boundary covers the state Kokaine owns: the Koka cleanup,
detached Koka root, and installed bridge. Pocket 0.6's own `render()` installs
its application/overlay layers and frame handler before invoking the renderer
callback, but exposes no public rollback when a later startup operation throws.
Consequently, a Pocket-side mount failure after that point must be treated as a
fatal application-start failure and must not be retried in the same guest. Full
host rollback requires an upstream transactional `mount()` implementation; the
adapter deliberately does not reach into Pocket's private renderer state.

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

The initial Pocket callback row is therefore synchronous: signal reads and
writes, Kokaine UI lifetime work, and modeled exceptions are allowed; the Web
Async adapter, timers, Fetch, and browser window operations are not. Native
animation and future Pocket-specific effects should be modeled against Pocket's
frame boundary rather than routed through `kokaine/async/web`.

## First-release surface

Included:

- `View`, `Text`, `Image`, fragments, and dynamic regions;
- reactive text and supported per-node inline style properties;
- image sources, focusability, and synchronous `onPress`;
- exact generation ownership, stale-callback revocation, and root disposal.

Not included:

- `kokaine/html`, DOM nodes/events/attributes, or trusted HTML;
- Web Async, wall-clock timers, Fetch, or browser globals;
- keyed reconciliation, SSR, hydration, portals, or browser control helpers;
- class-based dynamic styling from Koka-generated modules;
- a claim of PSP memory or frame-rate parity with native Pocket demos.

This split is intentional. Keyed rows and an async effect shell need native
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

The checked-in verification currently covers typed Koka callback/lifetime tests,
the JavaScript bridge contract, an exact 0.6.0 `pocket compile`, a QuickJS-like
no-console/no-process bundle smoke test with injected HostOps, and the upstream
Rust/WASM layout/raster core. It also drives Pocket's DOWN/CIRCLE input path and
observes the Koka live-text update.
PPSSPP, the native QuickJS PSP host, memory/frame profiling, and real hardware
have **not** been run. In particular, compiler or Rust/WASM success is not a
device-performance result; real PSP behavior remains unverified until tested on
a device.

Upstream references: [getting started](https://pocketjs.dev/docs/getting-started/),
[frameworks](https://pocketjs.dev/docs/frameworks/), and
[API](https://pocketjs.dev/docs/api/).
