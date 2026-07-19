# `@kokaine/cli`

`@kokaine/cli` is the npm-native compiler and Vite driver for Kokaine
applications. It resolves installed npm dependencies from each parent package,
discovers packages with `koka.sources`, validates Koka's single global module
space, selects the exact configured compiler, and invokes Koka without a shell.

Install it in a Kokaine application:

```sh
npm install --save-dev @kokaine/cli
```

```sh
kokaine doctor [--json]
kokaine check
kokaine build
kokaine dev [--host 127.0.0.1] [--port 5173]
```

The project configuration belongs in the root `package.json`:

```json
{
  "kokaine": {
    "entry": "src/app/main.kk",
    "sources": ["src"],
    "compiler": "3.2.3",
    "target": "jsweb"
  }
}
```

The CLI never changes dependencies or lockfiles. By default it downloads the
official compiler release for the configured version and verifies the pinned
SHA-256 digest before atomically publishing it under the user cache. Set
`KOKAINE_CACHE_DIR` to relocate the cache. `--koka` and `KOKA_BIN` opt into a
local binary, whose reported version must still match exactly.

See the repository's [package guide](../../docs/npm-packages.md) for the full
application and library manifest contracts.
