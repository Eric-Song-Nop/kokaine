import assert from "node:assert/strict";
import { afterEach, beforeEach, mock, test } from "bun:test";

const defaultRenderer = createRendererDouble();
const mountEvents = [];
const frameCallbacks = [];
let mountFailureAfterCode;
mock.module("@pocketjs/framework/solid/renderer", () => defaultRenderer.renderer);
mock.module("@pocketjs/framework/lifecycle", () => ({
  onFrame(callback) {
    frameCallbacks.push(callback);
  }
}));
mock.module("@pocketjs/framework", () => ({
  mount(code, options) {
    mountEvents.push(["pocket:mount", options]);
    const root = code();
    if (mountFailureAfterCode) throw mountFailureAfterCode;
    mountEvents.push(["pocket:root", root]);
    return () => {
      mountEvents.push(["pocket:dispose"]);
      frameCallbacks.length = 0;
    };
  }
}));

const { createPocketRoot, installPocketBridge } = await import("../js/bridge.js");
const { mountKokaine } = await import("../js/mount.js");

const BRIDGE_KEY = Symbol.for("kokaine.pocketjs.bridge");
const ASYNC_KEY = Symbol.for("kokaine.pocketjs.async");
const originalDescriptor = Object.getOwnPropertyDescriptor(globalThis, BRIDGE_KEY);
const originalAsyncDescriptor = Object.getOwnPropertyDescriptor(globalThis, ASYNC_KEY);
const originalSimulationHzDescriptor =
  Object.getOwnPropertyDescriptor(globalThis, "__simHz");

beforeEach(() => {
  delete globalThis[BRIDGE_KEY];
  delete globalThis[ASYNC_KEY];
  delete globalThis.__simHz;
  mountEvents.length = 0;
  frameCallbacks.length = 0;
  mountFailureAfterCode = undefined;
});

afterEach(() => {
  delete globalThis[BRIDGE_KEY];
  delete globalThis[ASYNC_KEY];
  if (originalDescriptor) {
    Object.defineProperty(globalThis, BRIDGE_KEY, originalDescriptor);
  }
  if (originalAsyncDescriptor) {
    Object.defineProperty(globalThis, ASYNC_KEY, originalAsyncDescriptor);
  }
  delete globalThis.__simHz;
  if (originalSimulationHzDescriptor) {
    Object.defineProperty(
      globalThis,
      "__simHz",
      originalSimulationHzDescriptor
    );
  }
});

function runFrame() {
  for (const callback of [...frameCallbacks]) callback(0);
}

function runFrames(count) {
  for (let index = 0; index < count; index += 1) runFrame();
}

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
  const textContent = calls[4][2];
  const image = bridge.createImage();
  bridge.replaceText(text, "goodbye");
  bridge.insertBefore(view, text, image);
  bridge.remove(view, text);
  bridge.discard(image);
  bridge.setFocusable(view, true);
  bridge.setSource(image, "hero");

  assert.deepEqual(calls, [
    ["createElement", "view"],
    ["createElement", "text"],
    ["setProp", text, "style", { fontSlot: 2 }, {}],
    ["createTextNode", "hello"],
    ["insertNode", text, textContent, null],
    ["createElement", "image"],
    ["replaceText", textContent, "goodbye"],
    ["insertNode", view, text, image],
    ["detachNode", view, text],
    ["release", image],
    ["setProp", view, "focusable", true],
    ["setProp", image, "src", "hero"]
  ]);
  restore();
});

test("discards both native text nodes when text assembly fails", () => {
  const { calls, renderer } = createRendererDouble();
  const failure = new Error("text insertion failed");
  let textElement;
  let textContent;
  renderer.createElement = (tag) => {
    calls.push(["createElement", tag]);
    textElement = { kind: tag };
    return textElement;
  };
  renderer.createTextNode = (value) => {
    calls.push(["createTextNode", value]);
    textContent = { kind: "text-node", value };
    return textContent;
  };
  renderer.insertNode = () => {
    throw failure;
  };
  const restore = installPocketBridge(renderer);
  const bridge = globalThis[BRIDGE_KEY];

  assert.throws(() => bridge.createText("hello"), (error) => error === failure);
  assert.deepEqual(calls, [
    ["createElement", "text"],
    ["setProp", textElement, "style", { fontSlot: 2 }, {}],
    ["createTextNode", "hello"],
    ["release", textContent],
    ["release", textElement]
  ]);
  restore();
});

test("lets an explicit font slot override the Pocket default", () => {
  const { calls, renderer } = createRendererDouble();
  const restore = installPocketBridge(renderer);
  const bridge = globalThis[BRIDGE_KEY];
  const text = bridge.createText("hello");

  calls.length = 0;
  bridge.setStyleNumber(text, "fontSlot", 9);

  assert.deepEqual(calls, [
    ["setProp", text, "style", { fontSlot: 9 }, { fontSlot: 2 }]
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

test("preserves a startup failure when root rollback also fails", () => {
  const { renderer } = createRendererDouble();
  const startupFailure = new Error("startup failed");
  renderer.release = () => {
    throw new Error("rollback failed");
  };
  const restore = installPocketBridge(renderer);

  assert.throws(
    () => createPocketRoot(() => {
      throw startupFailure;
    }),
    (error) => error === startupFailure
  );
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
  let cleanupPostAccepted;
  let dispatcher;
  let schedulerFrame;
  const dispose = mountKokaine(() => {
    mountEvents.push(["koka:start"]);
    dispatcher = globalThis[ASYNC_KEY].capture();
    schedulerFrame = frameCallbacks[0];
    return () => {
      mountEvents.push(["koka:dispose"]);
      cleanupPostAccepted = dispatcher.post(
        () => mountEvents.push(["async:cleanup"])
      );
    };
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
  assert.equal(cleanupPostAccepted, true);
  schedulerFrame(0);
  assert.equal(
    mountEvents.some(([name]) => name === "async:cleanup"),
    false
  );
  assert.equal(Object.hasOwn(globalThis, BRIDGE_KEY), false);
  assert.equal(Object.hasOwn(globalThis, ASYNC_KEY), false);
});

test("flushes mount-scoped async work before later frame hooks in FIFO turns", () => {
  const events = [];
  let dispatcher;
  const dispose = mountKokaine(() => {
    const bridge = globalThis[ASYNC_KEY];
    assert.equal(bridge.version, 1);
    dispatcher = bridge.capture();
    frameCallbacks.push(() => events.push("app:frame"));
    return () => events.push("koka:dispose");
  });

  assert.equal(dispatcher, globalThis[ASYNC_KEY].capture());
  assert.equal(
    dispatcher.post(() => {
      events.push("async:first");
      dispatcher.post(() => events.push("async:nested"));
    }),
    true
  );
  assert.equal(dispatcher.post(() => events.push("async:second")), true);

  runFrame();
  assert.deepEqual(events, ["async:first", "async:second", "app:frame"]);

  runFrame();
  assert.deepEqual(events, [
    "async:first",
    "async:second",
    "app:frame",
    "async:nested",
    "app:frame"
  ]);
  dispose();
});

test("delivers virtual-clock timers through the frame queue and cancels them", () => {
  const events = [];
  let dispatcher;
  const dispose = mountKokaine(() => {
    dispatcher = globalThis[ASYNC_KEY].capture();
    return () => {};
  });

  runFrame();
  const cancelFirst = dispatcher.afterMilliseconds(
    125,
    () => dispatcher.post(() => events.push("timer:first"))
  );
  const cancelSecond = dispatcher.afterMilliseconds(
    -10,
    () => dispatcher.post(() => events.push("timer:second"))
  );
  cancelSecond();
  cancelSecond();
  runFrames(7);
  assert.deepEqual(events, []);
  runFrame();
  assert.deepEqual(events, ["timer:first"]);

  cancelFirst();
  cancelFirst();
  dispose();
});

test("rounds virtual delays upward at the normalized simulation rate", () => {
  globalThis.__simHz = 29;
  const events = [];
  let dispatcher;
  const dispose = mountKokaine(() => {
    dispatcher = globalThis[ASYNC_KEY].capture();
    return () => {};
  });

  dispatcher.afterMilliseconds(0, () => events.push("boot-zero"));
  runFrame();
  assert.deepEqual(events, []);
  runFrame();
  assert.deepEqual(events, ["boot-zero"]);

  dispatcher.afterMilliseconds(40, () => events.push("forty"));
  runFrame();
  assert.deepEqual(events, ["boot-zero"]);
  runFrame();
  assert.deepEqual(events, ["boot-zero", "forty"]);
  dispose();
});

test("keeps exact millisecond frame boundaries exact", () => {
  globalThis.__simHz = 60;
  const events = [];
  let dispatcher;
  const dispose = mountKokaine(() => {
    dispatcher = globalThis[ASYNC_KEY].capture();
    return () => {};
  });

  runFrame();
  dispatcher.afterMilliseconds(4150, () => events.push("exact"));
  runFrames(248);
  assert.deepEqual(events, []);
  runFrame();
  assert.deepEqual(events, ["exact"]);
  dispose();
});

test("does not scan long-lived timers before the earliest deadline", () => {
  let dispatcher;
  const dispose = mountKokaine(() => {
    dispatcher = globalThis[ASYNC_KEY].capture();
    return () => {};
  });

  for (let index = 0; index < 1024; index += 1) {
    dispatcher.afterMilliseconds(60_000 + index, () => {});
  }

  const setIterator = Set.prototype[Symbol.iterator];
  let timerScans = 0;
  Set.prototype[Symbol.iterator] = function timerIterator() {
    timerScans += 1;
    return setIterator.call(this);
  };
  try {
    runFrames(120);
  } finally {
    Set.prototype[Symbol.iterator] = setIterator;
  }

  assert.equal(timerScans, 0);
  dispose();
});

test("coalesces earliest-deadline scans across bulk timer cancellation", () => {
  let dispatcher;
  const dispose = mountKokaine(() => {
    dispatcher = globalThis[ASYNC_KEY].capture();
    return () => {};
  });

  const cancel = [];
  for (let index = 0; index < 1024; index += 1) {
    cancel.push(dispatcher.afterMilliseconds(60_000, () => {}));
  }
  dispatcher.afterMilliseconds(120_000, () => {});

  const setIterator = Set.prototype[Symbol.iterator];
  let timerScans = 0;
  Set.prototype[Symbol.iterator] = function timerIterator() {
    timerScans += 1;
    return setIterator.call(this);
  };
  try {
    for (const cancelTimer of cancel) cancelTimer();
    assert.equal(timerScans, 0);
    runFrames(1);
    assert.equal(timerScans, 1);
  } finally {
    Set.prototype[Symbol.iterator] = setIterator;
  }

  dispose();
});

test("rejects inexact virtual delays before allocating a Pocket timer", () => {
  let dispatcher;
  const dispose = mountKokaine(() => {
    dispatcher = globalThis[ASYNC_KEY].capture();
    return () => {};
  });

  for (const delay of [0.5, Number.MAX_SAFE_INTEGER + 1, Number.NaN]) {
    assert.throws(
      () => dispatcher.afterMilliseconds(delay, () => {}),
      /safe-integer delay/
    );
  }
  runFrames(10);
  dispose();
});

test("makes queued work, timers, and captured dispatchers inert on disposal", () => {
  const events = [];
  let bridge;
  let dispatcher;
  const dispose = mountKokaine(() => {
    bridge = globalThis[ASYNC_KEY];
    dispatcher = bridge.capture();
    return () => events.push("koka:dispose");
  });
  const schedulerFrame = frameCallbacks[0];
  dispatcher.post(() => events.push("queued"));
  dispatcher.afterMilliseconds(
    100,
    () => dispatcher.post(() => events.push("timer"))
  );

  dispose();
  assert.deepEqual(events, ["koka:dispose"]);
  assert.equal(Object.hasOwn(globalThis, ASYNC_KEY), false);
  assert.equal(dispatcher.post(() => events.push("late")), false);
  assert.equal(
    dispatcher.afterMilliseconds(100, () => events.push("later")),
    false
  );
  assert.equal(bridge.capture(), dispatcher);

  for (let index = 0; index < 10; index += 1) schedulerFrame(0);
  assert.deepEqual(events, ["koka:dispose"]);
});

test("makes async work inert when Pocket rolls back after Koka startup", () => {
  const failure = new Error("post-start mount failure");
  const events = [];
  let cleanupPostAccepted;
  let dispatcher;
  let schedulerFrame;
  mountFailureAfterCode = failure;

  assert.throws(
    () => mountKokaine(() => {
      dispatcher = globalThis[ASYNC_KEY].capture();
      schedulerFrame = frameCallbacks[0];
      dispatcher.post(() => events.push("queued"));
      dispatcher.afterMilliseconds(
        100,
        () => dispatcher.post(() => events.push("timer"))
      );
      return () => {
        events.push("koka:dispose");
        cleanupPostAccepted = dispatcher.post(
          () => events.push("async:cleanup")
        );
      };
    }),
    (error) => error === failure
  );

  assert.deepEqual(events, ["koka:dispose"]);
  assert.equal(cleanupPostAccepted, true);
  assert.equal(Object.hasOwn(globalThis, ASYNC_KEY), false);
  assert.equal(dispatcher.post(() => events.push("late")), false);
  for (let index = 0; index < 10; index += 1) schedulerFrame(0);
  assert.deepEqual(events, ["koka:dispose"]);
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
