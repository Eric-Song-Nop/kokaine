# Koka + Kokaine Playground

A single-file, Solid-powered playground for editing and running Kokaine in the
browser. It keeps the useful Solid Playground workbench shape: Monaco on the
left, a persistent preview on the right, generated output, and embedded
Chromium DevTools.

The runtime is browser-only. Both the Koka compiler and Koka language server
run as WebAssembly in dedicated Web Workers. There is no native `koka` child
process, API route, WebSocket bridge, writable host filesystem, backend code
execution service, or container.

## Use it online

[Open the deployed Playground](https://kokaine-playground.pages.dev/), edit the
starter, and press Command/Control+Enter. No installation or account is needed.

## Run it

The frontend build requires Node.js `^20.19.0` or `>=22.12.0`. It does **not**
require a native Koka installation.

From the repository root:

```sh
npm install
npm run dev --workspace @kokaine/playground
```

Or use the Make target:

```sh
make serve-playground
```

Vite binds to `127.0.0.1`, serves the required cross-origin isolation headers,
and stages the pinned local DevTools and content-addressed runtime assets before
startup. Open the URL it prints and press Command/Control+Enter to compile.

## Included today

- Monaco syntax highlighting for Koka, bracket matching, snippets, and a
  light/dark editor theme.
- The real Koka language server compiled to WebAssembly: diagnostics, hover,
  completion, signatures, definitions, symbols, folding, code actions, and
  inlay hints.
- Koka-to-JavaScript compilation in a Web Worker against an in-memory WASI
  filesystem containing the pinned Koka libraries and this checkout's Kokaine
  sources.
- A sandboxed, opaque-origin preview iframe that retains the last successful
  build when a later edit fails.
- Generated JavaScript, build diagnostics, and relayed runtime console output.
- Self-hosted Chii/Chobitsu Chromium DevTools connected to the preview.
- Resizable desktop panes, mobile panel navigation, responsive preview sizes,
  local source persistence, and compressed share URLs.

No editor, compiler, preview, or DevTools resource is loaded from a CDN.

## Browser architecture

The main thread owns Solid, Monaco, and the workbench state. A compiler Worker
loads `/koka/releases/<release-id>/koka-playground.wasm`; a separate
language-server Worker loads the matching `koka-lsp.wasm` from that release.
`@bjorn3/browser_wasi_shim` exposes only the browser-side in-memory filesystem
and standard streams that those programs need. The compressed
`koka-runtime.json.gz` bundle supplies the Koka standard library and precompiled
JavaScript modules, while Vite bundles the current `src/kokaine/**/*.kk` tree
into the same virtual filesystem. Before development or production builds, the
asset script validates and stages the runtime bundle, compiler WASM,
language-server WASM, and complete precompiled module graph under a
content-derived release ID. This keeps a core or compiler refactor from being
mixed with browser-cached assets from another release.

Compilation returns an ES-module graph to the parent. The opaque preview
receives that graph through a tokenized `postMessage` protocol, rewrites its
relative imports to short-lived Blob URLs, and imports pinned precompiled
modules from `/koka/releases/<release-id>/precompiled/`. Replacing a build
revokes the old generated URLs.

Active compilation has a source-size limit and a timeout. Cancellation,
timeout, or a compiler crash terminates and recreates the compiler Worker, so
compiler state is not shared between abandoned runs.

Issue #11 can extend the virtual filesystem/package-resolution step with
`@kokaine/cli` and npm package contents. It does not need to restore a server
or native compiler path.

## Pinned assets

The checked-in browser toolchain is intentionally reproducible:

- `scripts/sync-koka-assets.mjs` downloads the official Koka browser build from
  the immutable commit recorded in that script, verifies both WASM files by
  SHA-256, rebuilds the compressed standard-library VFS, and writes
  `public/koka/assets.json`.
- `scripts/sync-devtools-assets.mjs` copies Chii and Chobitsu from the exact npm
  versions in the repository root `package-lock.json`, including their license
  files, into `public/devtools/`.

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

The WASM language server uses `SharedArrayBuffer` and `Atomics`, so the page
must be `crossOriginIsolated`. Local Vite development and preview send:

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

Compiler and LSP code execute in Workers against an in-memory WASI filesystem,
not on a Kokaine server. Generated programs execute in an iframe with
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
