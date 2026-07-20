import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";

const [bundlePath, pakPath, checkout] = process.argv.slice(2);
if (!bundlePath || !pakPath || !checkout) {
  throw new Error(
    "usage: bun test/pocketjs-wasm-smoke.mjs bundle.js bundle.pak /path/to/pocketjs"
  );
}

const { createWasmUi } = await import(
  pathToFileURL(`${checkout}/host-web/wasm-ops.js`).href
);
const wasmBytes = await Bun.file(`${checkout}/host-web/pocketjs.wasm`).arrayBuffer();
const wasm = await createWasmUi(wasmBytes);
const calls = [];
const recordedOps = new Proxy(wasm.ops, {
  get(target, name, receiver) {
    const value = Reflect.get(target, name, receiver);
    if (typeof value !== "function") return value;
    return (...args) => {
      calls.push([String(name), ...args]);
      return Reflect.apply(value, target, args);
    };
  }
});

globalThis.ui = recordedOps;
globalThis.__pak = await Bun.file(pakPath).arrayBuffer();
globalThis.frame = undefined;

try {
  const source = await Bun.file(bundlePath).text();
  (0, eval)(source);
  assert.equal(typeof globalThis.frame, "function", "Pocket frame handler was installed");

  const tick = (buttons) => {
    globalThis.frame(buttons, 0x8080);
    wasm.tick();
    return wasm.render().slice();
  };
  const distinctPixels = (rgba) => {
    const values = new Set();
    const pixels = new Uint32Array(rgba.buffer, rgba.byteOffset, rgba.byteLength / 4);
    for (const value of pixels) {
      values.add(value);
      if (values.size > 16) break;
    }
    return values.size;
  };

  tick(0);
  tick(0x0040); // DOWN focuses the only pressable.
  const focused = tick(0);
  tick(0x2000); // CIRCLE invokes the Koka callback.
  tick(0);

  assert.ok(distinctPixels(focused) > 2, "Pocket Rust/WASM rendered a flat frame");
  assert.ok(
    calls.some(([name, , text]) => name === "replaceText" && text === "Count 1"),
    "Pocket input did not deliver onPress into the Koka reactive root"
  );
} finally {
  delete globalThis.ui;
  delete globalThis.__pak;
  delete globalThis.frame;
}
