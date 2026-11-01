# Contributing to Kokaine

Thanks for helping. Kokaine is small enough that most changes are one focused
pull request with a test that fails before the change and passes after it.

## Toolchains

| You are changing | You need |
| --- | --- |
| The runtime (`src/`), tests in `test/` | Koka **3.2.3**, Python 3, `make` |
| DOM, HTML, SSR, or the report example | additionally [`uv`](https://docs.astral.sh/uv/) (runs Playwright) |
| The CLI, create package, or Playground | Node.js `>=22.12.0` and pnpm |
| The PocketJS adapter | additionally bun; Rust with `wasm32-unknown-unknown` for the exact lane |
| The `wasmweb` proof | additionally Emscripten 6.0.13 |

Koka 3.2.8 and later are not supported yet (they renamed standard-library
finalization primitives that `kokaine/async/structured` uses). If your system
Koka is newer, use the checksummed compiler the CLI manages:

```sh
pnpm install
make test-native KOKA="$(make -s print-managed-koka)"
```

## Everyday commands

```sh
make test-native            # all Koka suites in one program (test/all.kk) + boundary checks
make browser-install        # once: Playwright Chromium
make test-browser test-report
pnpm test                   # CLI and create package
make serve-playground       # Playground dev server
```

Koka test programs exit 0 even after an uncaught exception, so always run them
through `make` (which uses `test/all.kk` and `support/run_koka_test.py`), not
with a bare `koka -e`. A new native suite must be imported and called from
`test/all.kk`.

## When you change `src/`

The Playground ships a precompiled copy of Kokaine built by its own browser
Koka. Regenerate it and commit the result, or CI's drift check fails:

```sh
make playground-precompile
```

## Commits and pull requests

- Conventional commit subjects (`fix(reactive): ...`, `feat(dom): ...`).
- Explain behaviour changes in the PR description, especially anything that
  changes when effects run, retry, or are cleaned up.
- CI must be green; it runs the native suite on Linux and macOS, the browser
  and report suites, Playground tests and build, and tooling tests on Linux,
  macOS, and Windows.

## Releases

Maintainers bump versions, update `CHANGELOG.md`, and push a `v*` tag; the
`Release` workflow checks internal version ranges
(`node support/check-release.mjs --plan`) and publishes every version npm does
not have yet, with provenance.
