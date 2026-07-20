import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "bun:test";

const defaultRenderer = createRendererDouble();
const mountEvents = [];
let mountFailureAfterCode;
mock.module("@pocketjs/framework/solid/renderer", () => defaultRenderer.renderer);
mock.module("@pocketjs/framework", () => ({
  mount(code, options) {
    mountEvents.push(["pocket:mount", options]);
    const root = code();
    if (mountFailureAfterCode) throw mountFailureAfterCode;
    mountEvents.push(["pocket:root", root]);
    return () => mountEvents.push(["pocket:dispose"]);
  }
}));

const { createPocketRoot, installPocketBridge } = await import("../js/bridge.js");
const { mountKokaine } = await import("../js/mount.js");

const BRIDGE_KEY = Symbol.for("kokaine.pocketjs.bridge");
const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, BRIDGE_KEY);

beforeEach(() => {
  delete globalThis[BRIDGE_KEY];
  mountEvents.length = 0;
  mountFailureAfterCode = undefined;
});

afterEach(() => {
  delete globalThis[BRIDGE_KEY];
  if (originalDescriptor) {
    Object.defineProperty(globalThis, BRIDGE_KEY, originalDescriptor);
  }
});

function createRendererDouble() {
  const calls = [];
  const renderer = {
    createElement(tag) {
      calls.push(["createElement", tag]);
      return { kind: tag };
    },
    createTextNode(value) {
      calls.push(["createTextNode", value]);
      return { kind: "text-node", value };
    },
    replaceText(...args) {
      calls.push(["replaceText", ...args]);
    },
    insertNode(...args) {
      calls.push(["insertNode", ...args]);
    },
    release(...args) {
      calls.push(["release", ...args]);
    },
    detachNode(...args) {
      calls.push(["detachNode", ...args]);
    },
    getParentNode(node) {
      return node.parent ?? undefined;
    },
    setProp(...args) {
      calls.push(["setProp", ...args]);
      return args[2];
    }
  };
  return { calls, renderer };
}

function compatibleBridge(overrides = {}) {
  const bridge = { version: 1 };
  for (const name of [
    "createView",
    "createText",
    "createImage",
    "createRoot",
    "getRoot",
    "replaceText",
    "insertBefore",
    "remove",
    "discard",
    "setStyleNumber",
    "setStyleString",
    "setFocusable",
    "setSource",
    "setPress",
    "clearPress"
  ]) {
    bridge[name] = () => {};
  }
  return Object.assign(bridge, overrides);
}

test("installs a versioned bridge and restores it with idempotent disposers", () => {
  const restoreFirst = installPocketBridge();
  const bridge = globalThis[BRIDGE_KEY];

  assert.equal(bridge.version, 1);
  const restoreSecond = installPocketBridge(createRendererDouble().renderer);
  assert.equal(globalThis[BRIDGE_KEY], bridge);

  restoreFirst();
  restoreFirst();
  assert.equal(globalThis[BRIDGE_KEY], bridge);
  restoreSecond();
  restoreSecond();
  assert.equal(Object.hasOwn(globalThis, BRIDGE_KEY), false);
});

test("forwards node creation and structural operations without changing arguments", () => {
  const { calls, renderer } = createRendererDouble();
  const restore = installPocketBridge(renderer);
  const bridge = globalThis[BRIDGE_KEY];

  const view = bridge.createView();
  const text = bridge.createText("hello");
  const image = bridge.createImage();
  bridge.replaceText(text, "goodbye");
  bridge.insertBefore(view, text, image);
  bridge.remove(view, text);
  bridge.discard(image);
  bridge.setFocusable(view, true);
  bridge.setSource(image, "hero");

  assert.deepEqual(calls, [
    ["createElement", "view"],
    ["createTextNode", "hello"],
    ["createElement", "image"],
    ["replaceText", text, "goodbye"],
    ["insertNode", view, text, image],
    ["detachNode", view, text],
    ["release", image],
    ["setProp", view, "focusable", true],
    ["setProp", image, "src", "hero"]
  ]);
  restore();
});

test("scopes Koka mounting to the node returned from Pocket render", () => {
  const { calls, renderer } = createRendererDouble();
  const restore = installPocketBridge(renderer);
  const bridge = globalThis[BRIDGE_KEY];
  let observed;

  assert.throws(() => bridge.getRoot(), /inside createPocketRoot/);
  const root = createPocketRoot(() => {
    observed = bridge.getRoot();
  });

  assert.equal(observed, root);
  assert.deepEqual(calls, [["createElement", "view"]]);
  assert.throws(() => bridge.getRoot(), /inside createPocketRoot/);
  restore();
});

test("releases a detached Pocket root when Koka startup fails", () => {
  const { calls, renderer } = createRendererDouble();
  const restore = installPocketBridge(renderer);
  const bridge = globalThis[BRIDGE_KEY];
  const failure = new Error("startup failed");
  let root;

  assert.throws(
    () => createPocketRoot(() => {
      root = bridge.getRoot();
      throw failure;
    }),
    (error) => error === failure
  );
  assert.deepEqual(calls, [
    ["createElement", "view"],
    ["release", root]
  ]);
  restore();
});

test("sends complete independent style snapshots as next and previous values", () => {
  const { calls, renderer } = createRendererDouble();
  const restore = installPocketBridge(renderer);
  const bridge = globalThis[BRIDGE_KEY];
  const node = {};

  bridge.setStyleNumber(node, "width", "120");
  bridge.setStyleString(node, "bgColor", "#ff0000");

  assert.deepEqual(calls, [
    ["setProp", node, "style", { width: 120 }, {}],
    [
      "setProp",
      node,
      "style",
      { width: 120, bgColor: "#ff0000" },
      { width: 120 }
    ]
  ]);
  assert.notEqual(calls[0][3], calls[1][3]);
  assert.equal("bgColor" in calls[1][4], false);
  restore();
});

test("registers and clears press handlers through onPress", () => {
  const { calls, renderer } = createRendererDouble();
  const restore = installPocketBridge(renderer);
  const bridge = globalThis[BRIDGE_KEY];
  const node = {};
  let presses = 0;
  const handler = () => {
    presses += 1;
  };
  let installed;
  renderer.setProp = (target, name, value, previous) => {
    calls.push(["setProp", target, name, value, previous]);
    if (value === previous) return value;
    installed = value;
    return value;
  };

  bridge.setPress(node, handler);
  const trampoline = installed;
  assert.notEqual(trampoline, handler);
  trampoline();
  bridge.clearPress(node);
  trampoline();

  assert.deepEqual(calls, [
    ["setProp", node, "onPress", trampoline, undefined],
    ["setProp", node, "onPress", undefined, trampoline]
  ]);
  assert.equal(presses, 1);
  assert.equal(installed, undefined);
  restore();
});

test("severs press callbacks before a native clear failure", () => {
  const { renderer } = createRendererDouble();
  const failure = new Error("native clear failed");
  let installed;
  renderer.setProp = (_target, _name, value) => {
    if (value === undefined) throw failure;
    installed = value;
    return value;
  };
  const restore = installPocketBridge(renderer);
  const bridge = globalThis[BRIDGE_KEY];
  const node = {};
  let presses = 0;

  bridge.setPress(node, () => {
    presses += 1;
  });
  installed();
  assert.throws(() => bridge.clearPress(node), (error) => error === failure);
  installed();

  assert.equal(presses, 1);
  restore();
});

test("leaves an existing compatible bridge untouched", () => {
  const existing = compatibleBridge();
  globalThis[BRIDGE_KEY] = existing;

  const restore = installPocketBridge(createRendererDouble().renderer);
  assert.equal(globalThis[BRIDGE_KEY], existing);
  restore();
  assert.equal(globalThis[BRIDGE_KEY], existing);
});

test("creates roots through a compatible bridge owned by another package copy", () => {
  const root = {};
  let started = false;
  const existing = compatibleBridge({
    createRoot(start) {
      started = true;
      start();
      return root;
    }
  });
  globalThis[BRIDGE_KEY] = existing;

  const restore = installPocketBridge(createRendererDouble().renderer);
  assert.equal(createPocketRoot(() => {}), root);
  assert.equal(started, true);
  restore();
  assert.equal(globalThis[BRIDGE_KEY], existing);
});

test("composes Koka cleanup before Pocket teardown and bridge restoration", () => {
  const options = { pak: new ArrayBuffer(0) };
  const dispose = mountKokaine(() => {
    mountEvents.push(["koka:start"]);
    return () => mountEvents.push(["koka:dispose"]);
  }, options);

  assert.equal(globalThis[BRIDGE_KEY].version, 1);
  assert.deepEqual(mountEvents.map(([name]) => name), [
    "pocket:mount",
    "koka:start",
    "pocket:root"
  ]);
  assert.equal(mountEvents[0][1], options);

  dispose();
  dispose();
  assert.deepEqual(mountEvents.map(([name]) => name), [
    "pocket:mount",
    "koka:start",
    "pocket:root",
    "koka:dispose",
    "pocket:dispose"
  ]);
  assert.equal(Object.hasOwn(globalThis, BRIDGE_KEY), false);
});

test("restores the bridge when a Koka entry omits its cleanup contract", () => {
  assert.throws(
    () => mountKokaine(() => undefined),
    /entry must return a cleanup function/
  );
  assert.equal(Object.hasOwn(globalThis, BRIDGE_KEY), false);
});

test("rolls back Koka and its root when Pocket fails after startup", () => {
  const failure = new Error("post-start mount failure");
  const callsAtStart = defaultRenderer.calls.length;
  mountFailureAfterCode = failure;

  assert.throws(
    () => mountKokaine(() => {
      mountEvents.push(["koka:start"]);
      return () => mountEvents.push(["koka:dispose"]);
    }),
    (error) => error === failure
  );

  assert.deepEqual(mountEvents.map(([name]) => name), [
    "pocket:mount",
    "koka:start",
    "koka:dispose"
  ]);
  assert.ok(
    defaultRenderer.calls.slice(callsAtStart).some(([name]) => name === "release"),
    "detached Pocket root was not released"
  );
  assert.equal(Object.hasOwn(globalThis, BRIDGE_KEY), false);
});

test("rejects incompatible and malformed bridge versions without replacing them", () => {
  for (const existing of [{ version: 2 }, { version: 1 }]) {
    globalThis[BRIDGE_KEY] = existing;
    assert.throws(
      () => installPocketBridge(createRendererDouble().renderer),
      /incompatible with version 1/
    );
    assert.equal(globalThis[BRIDGE_KEY], existing);
  }
});

test("does not clobber a replacement bridge during restore", () => {
  const restore = installPocketBridge(createRendererDouble().renderer);
  const replacement = compatibleBridge();
  globalThis[BRIDGE_KEY] = replacement;

  restore();
  assert.equal(globalThis[BRIDGE_KEY], replacement);
});

test("propagates renderer failures and commits style snapshots only after success", () => {
  const { calls, renderer } = createRendererDouble();
  const failure = new Error("native failure");
  const setProp = renderer.setProp;
  let fail = true;
  renderer.setProp = (...args) => {
    if (fail) {
      fail = false;
      throw failure;
    }
    return setProp(...args);
  };
  const restore = installPocketBridge(renderer);
  const bridge = globalThis[BRIDGE_KEY];
  const node = {};

  assert.throws(() => bridge.setStyleNumber(node, "width", 80), (error) => error === failure);
  bridge.setStyleNumber(node, "height", 40);
  assert.deepEqual(calls, [
    ["setProp", node, "style", { height: 40 }, {}]
  ]);
  restore();
});
