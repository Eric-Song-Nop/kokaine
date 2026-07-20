import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const bundle = process.argv[2];
if (!bundle) {
  throw new Error("usage: node test/pocketjs-bundle-smoke.mjs /path/to/bundle.js");
}

const calls = [];
const source = await readFile(bundle, "utf8");
let nextId = 2;
const record = (name) => (...args) => calls.push([name, ...args]);

globalThis.ui = {
  createNode(type) {
    const id = nextId++;
    calls.push(["createNode", type, id]);
    return id;
  },
  destroyNode: record("destroyNode"),
  insertBefore: record("insertBefore"),
  removeChild: record("removeChild"),
  setStyle: record("setStyle"),
  setProp: record("setProp"),
  setText: record("setText"),
  replaceText: record("replaceText"),
  uploadTexture() {
    calls.push(["uploadTexture"]);
    return 1;
  },
  setImage: record("setImage"),
  setSprite: record("setSprite"),
  animate() {
    calls.push(["animate", ...arguments]);
    return 1;
  },
  cancelAnim: record("cancelAnim"),
  setFocus: record("setFocus"),
  setActive: record("setActive"),
  loadStyles: record("loadStyles"),
  loadFontAtlas: record("loadFontAtlas"),
  measureText() {
    return 0;
  }
};

// Match Pocket's native QuickJS guest: it starts without browser or Node
// console/process globals. The TS prelude must make Koka's generated console
// module safe before Pocket mount installs its devtools bridge.
const consoleDescriptor = Object.getOwnPropertyDescriptor(globalThis, "console");
const processDescriptor = Object.getOwnPropertyDescriptor(globalThis, "process");
delete globalThis.console;
delete globalThis.process;

try {
  (0, eval)(source);

  assert.equal(typeof globalThis.frame, "function", "Pocket frame handler was installed");
  assert.ok(
    calls.some(([name, , text]) =>
      (name === "setText" || name === "replaceText") && text === "Count 0"),
    "Koka live text did not reach the real Pocket renderer"
  );
  assert.ok(
    calls.some(([name]) => name === "setProp"),
    "Koka inline styles did not reach Pocket HostOps"
  );

  const DOWN = 0x0040;
  const CIRCLE = 0x2000;
  const ANALOG_CENTER = 0x8080;
  globalThis.frame(DOWN, ANALOG_CENTER);
  globalThis.frame(0, ANALOG_CENTER);
  globalThis.frame(CIRCLE, ANALOG_CENTER);

  assert.ok(
    calls.some(([name, id]) => name === "setFocus" && id !== 0),
    "Pocket input did not focus the Koka pressable"
  );
  assert.ok(
    calls.some(([name, , text]) => name === "replaceText" && text === "Count 1"),
    "Pocket onPress did not synchronously re-enter the Koka reactive root"
  );
} finally {
  delete globalThis.ui;
  delete globalThis.frame;
  delete globalThis.console;
  delete globalThis.process;
  if (consoleDescriptor) Object.defineProperty(globalThis, "console", consoleDescriptor);
  if (processDescriptor) Object.defineProperty(globalThis, "process", processDescriptor);
}
