# Koka + Kokaine Playground

A multi-file browser workbench whose complete application UI and reactive state
are authored in Koka and rendered by Kokaine. Monaco, a persistent preview,
generated output, Chromium DevTools, and a stateful Koka REPL remain narrow host
capabilities behind that Koka-owned interface.

The runtime is browser-only. The Koka compiler, language server, and persistent
REPL run as WebAssembly in dedicated Web Workers. There is no native `koka`
child process, API route, WebSocket bridge, writable host filesystem, backend code
execution service, or container.

## Use it online

[Open the deployed Playground](https://kokaine-playground.pages.dev/), edit the
starter, and press Command/Control+Enter. No installation or account is needed.

## Run it

The frontend build requires Node.js `^20.19.0` or `>=22.12.0`. It does **not**
require a native Koka installation.

From the repository root:

```sh
pnpm install
pnpm --filter @kokaine/playground dev
```

Or use the Make target:

```sh
make serve-playground
```

Vite binds to `127.0.0.1`, serves the required cross-origin isolation headers,
and stages the pinned local DevTools and content-addressed runtime assets before
startup. Open the URL it prints and press Command/Control+Enter to compile.

## Included today

- An IndexedDB-backed Koka project with files, directories, rename/delete
  operations, open tabs, automatic snapshots, and deterministic project share
  links.
- Monaco syntax highlighting for Koka, bracket matching, snippets, and
  light/dark editor themes. Every project file is a separate text model.
- The real Koka language server compiled to WebAssembly: diagnostics, hover,
  completion, signatures, definitions, symbols, folding, code actions, and
  inlay hints across the complete project VFS.
- Koka-to-JavaScript compilation in a Web Worker against an isolated,
  immutable-at-request-boundary project snapshot containing the pinned Koka
  libraries and this checkout's Kokaine sources.
- A persistent, multi-line Koka REPL session in its own Web Worker. Expressions
  and type queries use the same project snapshot as builds.
- A sandboxed, opaque-origin preview iframe that retains the last successful
  build when a later edit fails.
- Generated JavaScript, build diagnostics, relayed runtime console output, and
  self-hosted Chii/Chobitsu Chromium DevTools connected to the preview.
- Resizable desktop panes, mobile panel navigation, responsive preview sizes,
  project persistence, automatic snapshots, and compressed share URLs.

No editor, compiler, preview, or DevTools resource is loaded from a CDN.

## Browser architecture

The main thread runs a Kokaine-owned workbench. Its Koka entry module owns the
signals, derived state, event handlers, and complete workbench DOM. A narrow,
framework-neutral TypeScript host owns capabilities that remain browser APIs:
IndexedDB, Monaco, compiler/language-server/REPL Workers, preview and DevTools
iframes, sharing, timers, and resizers. Browser notifications re-enter Koka
through DOM custom events installed by the renderer; the host never calls an
exported generated Koka function directly.

Before Vite development or production builds, `scripts/compile-workbench.mjs`
runs the pinned browser Koka compiler against `koka/playground/main.kk` and
stages its generated ES-module graph for bundling. This path uses WebAssembly,
not a native Koka installation. At runtime, a compiler Worker loads
`/koka/releases/<release-id>/koka-playground.wasm`; a separate language-server
Worker loads the matching `koka-lsp.wasm`, and the persistent session Worker
loads the pinned `koka-browser-repl.wasm`. `@bjorn3/browser_wasi_shim` exposes
only the browser-side in-memory filesystem and standard streams these programs
need. The compressed `koka-runtime.json.gz` bundle supplies the Koka standard
library and precompiled JavaScript modules, while Vite bundles the current
`src/kokaine/**/*.kk` tree into the same virtual filesystem. The asset scripts
validate and stage the runtime bundle, all three WASM programs, and the complete
precompiled module graph under a content-derived release ID.
This keeps a core or compiler refactor from being mixed with browser-cached
assets from another release.

Compilation returns an ES-module graph to the parent. The opaque preview
receives that graph through a tokenized `postMessage` protocol, rewrites its
relative imports to short-lived Blob URLs, and imports pinned precompiled
modules from `/koka/releases/<release-id>/precompiled/`. Replacing a build
revokes the old generated URLs.

Compiler and REPL requests have source-size limits and timeouts. Cancellation,
timeout, or a compiler crash terminates and recreates that Worker. The REPL
keeps one explicit session until project reload/reset; source changes reload the
same session rather than replaying browser-side history.

The project filesystem is the package-resolution boundary. The published
`@kokaine/cli` resolution model can later extend that VFS with installed npm
package contents without restoring a server or native compiler path.

## Pinned assets

The checked-in browser toolchain is intentionally reproducible:

- `scripts/sync-koka-assets.mjs` downloads the official Koka compiler and LSP
  browser build from the immutable commit recorded in that script, verifies
  their SHA-256 hashes, verifies the checked-in browser REPL built from its
  separately recorded upstream fork commit, rebuilds the compressed
  standard-library VFS, and writes `public/koka/assets.json`.
- `scripts/sync-devtools-assets.mjs` copies Chii and Chobitsu from the exact npm
  versions pinned in `pnpm-lock.yaml`, including their license files, into
  `public/devtools/`.

After changing `src/kokaine/**`, rebuild the Kokaine precompiled cache and its
runtime bundle from the repository root:

```sh
make playground-precompile
```

This uses the pinned browser compiler, verifies that it loads the generated
interfaces, then downloads and revalidates the browser assets at the existing
Koka pin before rebuilding `public/koka/assets.json`. It requires network
access. Do not hand-edit files under `vendor/kokaine-precompiled-*` or
`public/koka/precompiled/`.

To resync the Koka compiler and DevTools asset sets without rebuilding the
Kokaine cache, run:

```sh
make playground-sync-assets
```

When deliberately changing a pin, update the commit, compiler version, and
expected hashes together, then compile a representative Kokaine program and
exercise the LSP before committing the generated assets. Do not hand-edit files
under `public/devtools/`.

## Cross-origin isolation

The WASM language server and persistent REPL use `SharedArrayBuffer` and
`Atomics`, so the page must be `crossOriginIsolated`. Local Vite development and
preview send:

```text
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```

Cloudflare Pages applies the same policy from `public/_headers`. The versioned
Koka release and `/devtools/*` rules also allow cross-origin reads because the
sandboxed preview has an opaque origin. Do not replace those asset rules with a
global `Cross-Origin-Resource-Policy: same-origin`; that would break preview
imports even though their URLs are hosted by the same Pages project.

If `window.crossOriginIsolated` is false, fix the response headers or an
incompatible browser/embedding context. Running a native LSP is not a fallback.
The browser also needs WebAssembly, module Workers, and `DecompressionStream`.

## Static Cloudflare Pages deployment

Refresh the current core, run the WASM smoke test, and build the exact static
output intended for production:

```sh
make playground-release
```

For a frontend-only build and local inspection:

```sh
make playground-build
make playground-preview
```

Create the Direct Upload project once, then deploy the configured production
branch (`main` by default):

```sh
npx wrangler pages project create kokaine-playground --production-branch=main
make playground-deploy
```

Override the project name or deployment branch when needed. A production upload
must use the same branch configured when the project was created:

```sh
npx wrangler pages project create my-project --production-branch=release
make playground-deploy \
  PLAYGROUND_PAGES_PROJECT=my-project \
  PLAYGROUND_PAGES_BRANCH=release
```

The deployed directory is `packages/playground/dist`. Vite copies `_headers`, a
real `404.html`, and the content-addressed Koka release into it, so Pages only
serves static files; there are no Pages Functions, Cloudflare Workers, servers,
or containers. Each deployment intentionally contains only its current release;
refresh a tab that remained open across a deployment. The 404 page prevents a
stale release URL from being rewritten to `index.html`. Cloudflare Pages Direct
Upload has a 25 MiB per-file limit. Check `public/koka/assets.json` when updating
the Koka pin; every individual WASM asset must remain below that limit.

For CI, build the browser assets ahead of deployment and run Wrangler Direct
Upload with `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, and
explicit `--project-name` and `--branch` values. Never build a native Koka
toolchain inside Pages.

## Security boundary

Compiler, LSP, and REPL code execute in Workers against in-memory WASI
filesystems, not on a Kokaine server. Project persistence is confined to this
origin's IndexedDB. Generated programs execute in an iframe with
`sandbox="allow-scripts"` and therefore cannot read the parent DOM, origin
storage, or cookies.

This is still browser isolation, not a hardened general-purpose adversarial
sandbox. A generated program can consume the tab's CPU or memory and can make
network requests allowed by the browser. Treat untrusted share links as code,
and keep resource limits and explicit-run behavior in place.

## Current boundary

The DevTools pane inspects the browser DOM, console, sources, and network. A
Kokaine-specific continuation/source graph needs runtime instrumentation that
the framework does not emit yet; the UI leaves room for that protocol without
pretending ordinary browser inspection is a continuation debugger.

See [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) for upstream attribution
and licenses.
