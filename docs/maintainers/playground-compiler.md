# Building the Playground's Koka compiler

The browser Playground runs three Koka programs compiled to WebAssembly and a
library archive. They are built by hand from a Koka source branch and published
as files of an immutable GitHub Release of this repository:

```
https://github.com/Eric-Song-Nop/kokaine/releases/download/playground-koka-3.2.9-1/<file>
```

| File | Contents |
| --- | --- |
| `koka-playground.wasm` | batch compiler (`exe:koka-playground`) |
| `koka-lsp.wasm` | language server (`exe:koka-lsp-wasm`) |
| `koka-browser-repl.wasm` | persistent REPL (`exe:koka-browser-repl`, fork only) |
| `koka-browser-lib.tar.gz` | Koka `LICENSE`, `lib/std/**` sources, and the precompiled `precompiled/*.{kki,mjs}` |
| `LICENSE`, `SHA256SUMS` | the Koka licence and the hashes of the above |

`packages/playground/scripts/sync-koka-assets.mjs` pins the commits, the tag and
each file's SHA-256, and caches the downloads under
`~/.cache/kokaine/playground/sha256/`. Nothing above is tracked in git. To try a
build before it is published, set `KOKAINE_PLAYGROUND_ASSET_DIR=<dir>`: files come
from that directory instead of the release, and are still checked against the
pins. It is the only network-free path that works on a cold cache.

## Source

Koka's `dev` branch reports 3.3.0, outside Kokaine's supported `>=3.2.3 <3.3.0`,
so the build starts from a release tag plus the commits below. All three
programs are built from the one resulting commit.

| | |
| --- | --- |
| Base | `koka-lang/koka` tag `v3.2.9` (`facb7932ce6871fdb063f762a304bd8238f35fba`) |
| Fork branch | `kokaine-playground-3.2.9` on `Eric-Song-Nop/koka` |
| Build commit | `BUILD_COMMIT` in `sync-koka-assets.mjs` |
| REPL commits | fork `8c97470` (add the REPL) and `32fee7e` (invalidate only changed modules), cherry-picked without conflicts |
| Upstream fix | `koka-lang/koka` `e38005d9` on `dev`, required (below) |
| Local fix | `41c5ba15`, `realPath` on WASI, required (below); not upstream |

The plain tag cannot compile in the browser, for two reasons:

- `vfsCompose` is `M.union find2 find2`, so a nested `withVFS` drops the outer
  files. `koka-playground.wasm` compiles a virtual module and nests the generated
  `@main` inside it, so every compile fails with
  `unable to read /@virtual/<module>.kk`. Fixed upstream in `e38005d9`.
- `realPath` does not resolve `..` on WASI, because `canonicalizePath` does not,
  and `joinPaths` collapses only one pair of consecutive parents. A module searches
  its imports from `<dir>/..` per module part, so at depth 3 or more the unresolved
  path becomes the module name: `could not find module: kokaine//std/core`. The
  upstream `dev` branch still has this as of `d23ee7cd`. Worth proposing upstream.

Drop either commit when a later tag contains the fix.

## Toolchain

Versions used for `playground-koka-3.2.9-1`, on macOS arm64:

| Tool | Version | Source |
| --- | --- | --- |
| `wasm32-wasi-ghc` | 9.12.4.20260731 | `ghc-wasm-meta`, `FLAVOUR=9.12` |
| `wasm32-wasi-cabal` | 3.14.2.0 | same |
| `wasm-opt` (binaryen) | 131 | same |
| `alex` | 3.5.4.2 | any native install on `PATH` |
| native `koka` | 3.2.9 release | `make -s print-managed-koka KOKA_VERSION=3.2.9` |

Upstream's `util/playground.kk` drives the same steps through a stack-built
native Koka (`lts-24.43`, GHC 9.10.3) and a generated `koka.cabal`. This build
uses the release binary of the same tag from the CLI's pinned manifest instead,
which needs no second GHC. `koka.cabal` is tracked at the tag, so `hpack` is not
needed. The WASM flavour's GHC is unrelated to the native one.

```sh
FLAVOUR=9.12 sh <(curl -sL https://gitlab.haskell.org/ghc/ghc-wasm-meta/-/raw/master/bootstrap.sh)
```

## Build

Run these with `bash`. The WASM builds took about 8 minutes on an 8-core Mac with
part of `~/.ghc-wasm/.cabal/store` already populated, and a rebuild after a compiler
change about 3.

```bash
set -euo pipefail
git clone --recurse-submodules https://github.com/koka-lang/koka.git koka-build
cd koka-build
git remote add fork https://github.com/Eric-Song-Nop/koka.git
git fetch fork
git checkout kokaine-playground-3.2.9      # the build commit, from the fork
git submodule update --init --recursive

# 1. The three WASM programs.
unset GHC_PACKAGE_PATH
source ~/.ghc-wasm/env
wasm32-wasi-cabal update
wasm32-wasi-cabal build lib:koka koka:exe:koka-playground
wasm32-wasi-cabal build koka:exe:koka-lsp-wasm
wasm32-wasi-cabal build koka:exe:koka-browser-repl

mkdir -p ../koka-wasm
wasm-opt -O4 "$(wasm32-wasi-cabal list-bin koka:exe:koka-playground)" \
  -o ../koka-wasm/koka-playground.wasm
wasm-opt -O4 "$(wasm32-wasi-cabal list-bin koka:exe:koka-lsp-wasm)" \
  -o ../koka-wasm/koka-lsp.wasm
wasm-opt -O4 "$(wasm32-wasi-cabal list-bin koka:exe:koka-browser-repl)" \
  -o ../koka-wasm/koka-browser-repl.wasm

# 2. The precompiled library, as do-precompile in util/playground.kk does it.
#    --sharedir makes module names resolve against this checkout's lib/.
KOKA_BIN=/path/to/native/koka        # make -s print-managed-koka KOKA_VERSION=3.2.9
"$KOKA_BIN" --sharedir="$PWD" --target=js --outputdir="$PWD/../koka-precompiled" \
  --library lib/toc.kk
samples=()
while IFS= read -r f; do
  case "$f" in                       # excluded-samples in util/playground.kk
    samples/all.kk|samples/basic/rbtree.kk|samples/basic/rbtree-fbip.kk|samples/learn/lazycons.kk|samples/learn/implicits-talk.kk) ;;
    *) samples+=("$f") ;;
  esac
done < <(find samples -name '*.kk' | LC_ALL=C sort)
"$KOKA_BIN" --sharedir="$PWD" --target=js --outputdir="$PWD/../koka-precompiled" \
  --include=samples "${samples[@]}"
cd ..

# 3. The release directory. Fails if a WASM program reaches the 25 MiB limit.
node <kokaine>/packages/playground/scripts/pack-koka-release.mjs \
  --koka koka-build --precompiled koka-precompiled --wasm koka-wasm --out koka-release
```

The WASM files are not expected to be byte-reproducible between builds, so the
hosted files, not a rebuild, are the source of truth. `koka-browser-lib.tar.gz`
was byte-identical across repeated packing of the same inputs.

## Pin and verify

```bash
cd <kokaine>
export KOKAINE_PLAYGROUND_ASSET_DIR="$PWD/../koka-release"
# Edit sync-koka-assets.mjs: COMPILER_VERSION, UPSTREAM_COMMIT, BUILD_COMMIT,
# RELEASE_TAG, EXPECTED_WASM, LIBRARY_ARCHIVE_SHA256 (from SHA256SUMS). See
# "Bumping Koka" for a new version. Then, because ensure mode refuses an assets.json
# that disagrees with the pins (it needs the vendored manifest's compilerVersion and
# compilerCommit to match them too):
node packages/playground/scripts/sync-koka-assets.mjs --update
pnpm --filter @kokaine/playground run precompile:kokaine
pnpm --filter @kokaine/playground run test:wasm
pnpm --filter @kokaine/playground run test:architecture
pnpm --filter @kokaine/playground run build
pnpm --filter @kokaine/playground run test
cd packages/playground
npx vite preview --host 127.0.0.1 --port 4175 --strictPort &
uv run --with "playwright==1.61.0" python scripts/e2e-playground.py
```

`assets.json` pins the gzipped runtime bundle and CI's drift check compares it on
Node.js 22, so a hash produced by another zlib would fail there. For this build the
hash was identical on Node.js 22.19 and 26.13. Watch for it after a Node upgrade.

## Publish

Order matters: the commit must be resolvable before anything points at it, and CI
on the Kokaine branch cannot pass until the release exists.

1. Push `kokaine-playground-3.2.9` to the fork. Its commit is the `BUILD_COMMIT`
   named in `THIRD_PARTY_NOTICES.md`, which is how the Apache-2.0 modification
   notice and the source offer resolve.
2. Create the release and upload every file in the release directory:

   ```sh
   gh release create playground-koka-3.2.9-1 koka-release/* \
     --repo Eric-Song-Nop/kokaine --title "Playground Koka 3.2.9 build 1" \
     --notes "Koka v3.2.9 plus the browser REPL commits, for the browser Playground. See docs/maintainers/playground-compiler.md."
   ```

3. Merge the Kokaine branch. Never replace files in a published tag; a new build is
   a new tag (`playground-koka-3.2.9-2`), because old commits keep resolving against
   the old one.

## Bumping Koka

1. Cherry-pick the commits onto the new tag, on a new
   `kokaine-playground-<version>` branch, dropping any the tag already contains:

   ```sh
   git checkout -b kokaine-playground-<version> v<version>
   git cherry-pick 8c974708c97645014a6a706e63524599f8da23c6 \
                   32fee7eda6397dee81f4752ff7cab4e4001d3eb2
   git cherry-pick -x e38005d977eb337e58f00eac4857da087a3ebd23
   git cherry-pick 41c5ba15b9c14ea64b2af167cae80f2a41860369
   git submodule update --init --recursive
   ```

   The REPL compiles against `Compile.BuildContext`, which has no stability promise;
   expect to touch `src/Main/repl/BrowserRepl/Session.hs`.
2. Read `git diff <old-tag> <new-tag> -- src/Main/playground src/Platform/wasm src/Main/langserver web/playground/src/workers`.
   The worker protocol is what `packages/playground/src/{wasm,repl}` depend on.
3. Build, pack, and update the pins. Then break the bootstrap cycle: rename
   `vendor/kokaine-precompiled-v<version>` and its references in the scripts,
   `.gitattributes`, `ci.yml`, and `packages/playground/README.md`, set
   `compilerVersion` and `compilerCommit` in its `manifest.json` to the new values,
   and run `node scripts/sync-koka-assets.mjs --update` so `assets.json` matches the
   pins. `precompile:kokaine` then replaces the vendored files with real output.
4. Verify as above. Check the sizes against the 25 MiB per-file limit of Cloudflare
   Pages; `pack-koka-release.mjs` refuses to pass a WASM program over it.
5. Update `README.md`, `docs/design.md`, and `THIRD_PARTY_NOTICES.md` (the commits
   and every modification they make), publish, and merge.
