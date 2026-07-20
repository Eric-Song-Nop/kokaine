# PocketJS browser example

This example renders Kokaine through PocketJS's official browser/WASM host.
The Koka application and Pocket entry live in this directory; the development
server serves `host-web` from the lockfile-pinned `@pocketjs/framework` package
so the repository does not fork Pocket's Canvas engine or Rust renderer. The
exact source checkout is used only by Pocket's current compiler.

Prepare an exact PocketJS 0.6.0 checkout once:

```sh
git clone --branch v0.6.0 https://github.com/pocket-stack/pocketjs.git
cd pocketjs
bun install --frozen-lockfile
```

Install this repository's locked npm dependencies with `npm ci` before serving.

Build the Koka bundle and Pocket pak, then serve them with the locked
browser/WASM host:

```sh
make serve-pocketjs-example POCKETJS_CHECKOUT=/absolute/path/to/pocketjs
```

Open <http://127.0.0.1:8130/>. The demo is selected automatically. Press DOWN
then CIRCLE (or use the matching on-screen buttons) to change `Count 0` to
`Count 1`.

Run the same flow in headless Chromium:

```sh
make browser-install # once per machine
make test-pocketjs-browser POCKETJS_CHECKOUT=/absolute/path/to/pocketjs
```

The test asserts that Koka text is visibly rasterized into the real Canvas and
that Pocket input moves native focus, reaches the Koka callback, and replaces
the live text with `Count 1`. It also fails on page, console, or HTTP errors.
