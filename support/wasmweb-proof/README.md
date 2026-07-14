# wasmweb proof

This is a narrow executable proof of the Koka-to-Emscripten boundary. It is
not a second renderer. It demonstrates that:

- DOM objects can remain in JavaScript behind `int32` handles boxed as Koka
  `any` values;
- an owned `kk_function_t` can be retained after Koka setup returns and safely
  duplicated for each invocation;
- two asynchronous browser events can enter a live reactive root; and
- Kokaine's signal effect updates DOM text from `0` to `2`.

Run the automated wasmweb build under a small fake DOM in Node:

```sh
./support/wasmweb-proof/run.sh test
```

Build browser artifacts without the fake DOM into a chosen directory:

```sh
./support/wasmweb-proof/run.sh build /tmp/kokaine-wasmweb-proof
python3 -m http.server --directory /tmp/kokaine-wasmweb-proof/dist
```

Then open `http://localhost:8000`. The proof mounts a button, schedules two
clicks, and logs `wasmweb-proof: ok (count=2)` after checking the rendered
text.

The bridge intentionally has a tiny fixed listener table and page-lifetime DOM
handles. A production adapter must add structured listener/node disposal and
translate bridge failures into its typed host effect.
