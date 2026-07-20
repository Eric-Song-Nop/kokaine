# `@kokaine/pocketjs`

Experimental retained-mode PocketJS 0.6 adapter for Kokaine. It provides the
Koka module `kokaine/pocket` and a small JavaScript bridge over PocketJS's
public Solid renderer primitives.

PocketJS is a native UI runtime, not a DOM. This package therefore has its own
`View`/`Text`/`Image` vocabulary and does not reinterpret `kokaine/html`.

```koka
import kokaine/reactive
import kokaine/pocket
import std/core/unsafe

fun cell(value : a) : ref<global,a>
  unsafe-total { ref(value) }

fun load(value : ref<global,a>) : a
  unsafe-total { !value }

fun store(target : ref<global,a>, value : a) : ()
  unsafe-total { target := value }

pub fun main()
  host-entry fn()
    val (root,count) = create-root fn(root) signal(root,0)
    val committed = cell(False)
    finally(
      fn() { if load(committed) then () else root.dispose() },
      fn()
        val page = scene
          layout(props=[width(480),height(272),flex-column(),gap(8)])
            live/text(props=[text-color("#ffffff")]) {
              "Count " ++ count.get.show
            }
            pressable-write(
              fn() count.modify(fn(value) value + 1),
              props=[width(120)])
              text("Increment")
        val dispose-page = mount(root,page)
        store(committed,True)
        fn() host-entry fn() root.dispose()
    )
```

Compile the Koka entry as ordinary JavaScript and import the generated module
(not its auto-running `__main` wrapper) from the Pocket TS entry. The Koka entry
must use `host-entry` at each raw JavaScript boundary and return a cleanup
function. `mountKokaine` composes that cleanup with Pocket's native teardown:

```ts
import { mountKokaine } from "@kokaine/pocketjs";
import { main } from "./generated/app.mjs";

export const dispose = mountKokaine(main);
```

Import the adapter before generated Koka output. Its bridge includes the
narrow `console`/`process.stdout` prelude required while Koka 3.2 modules are
evaluated in Pocket's native QuickJS guest. Lower-level
`installPocketBridge()` and `createPocketRoot()` exports remain available for
hosts which need to compose Pocket's `mount` manually.

The entry must dispose a partially constructed Koka root if it throws before
returning its cleanup; the committed `finally` above supplies that transaction.
Once cleanup has been returned, the wrapper can roll it back together with the
native Koka root and bridge. Pocket 0.6 installs its own root layers and frame
handler before the render callback and has no public full-startup rollback, so
any later startup failure is fatal for that guest and must not be retried in
place.

Pocket 0.6's CLI expects to run from a full PocketJS checkout. To compile and
exercise this repository's example against the upstream Rust/WASM core:

```sh
git clone --branch v0.6.0 https://github.com/pocket-stack/pocketjs.git
cd pocketjs && bun install --frozen-lockfile && cd -
make test-pocketjs-wasm POCKETJS_CHECKOUT=/absolute/path/to/pocketjs
```

To open the same example in Pocket's official browser/WASM host, or exercise it
in real headless Chromium:

```sh
make serve-pocketjs-example POCKETJS_CHECKOUT=/absolute/path/to/pocketjs
make test-pocketjs-browser POCKETJS_CHECKOUT=/absolute/path/to/pocketjs
```

See [`docs/pocketjs.md`](../../docs/pocketjs.md) and the runnable composition
under [`examples/pocketjs`](../../examples/pocketjs).
