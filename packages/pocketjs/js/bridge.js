import "./guest.js";
import {
  createElement,
  createTextNode,
  detachNode,
  getParentNode,
  insertNode,
  release,
  replaceText,
  setProp
} from "@pocketjs/framework/solid/renderer";

const BRIDGE_KEY = Symbol.for("kokaine.pocketjs.bridge");
const BRIDGE_VERSION = 1;

const BRIDGE_METHODS = [
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
];

const RENDERER_METHODS = [
  "createElement",
  "createTextNode",
  "detachNode",
  "getParentNode",
  "replaceText",
  "insertNode",
  "release",
  "setProp"
];

const defaultRenderer = {
  createElement,
  createTextNode,
  detachNode,
  getParentNode,
  replaceText,
  insertNode,
  release,
  setProp
};

const ownedBridges = new WeakMap();

function isCompatibleBridge(value) {
  return value !== null
    && typeof value === "object"
    && value.version === BRIDGE_VERSION
    && BRIDGE_METHODS.every((name) => typeof value[name] === "function");
}

function validateRenderer(renderer) {
  if (renderer === null || typeof renderer !== "object") {
    throw new TypeError("PocketJS renderer must be an object");
  }
  for (const name of RENDERER_METHODS) {
    if (typeof renderer[name] !== "function") {
      throw new TypeError(`PocketJS renderer is missing ${name}()`);
    }
  }
}

function createBridge(renderer, roots) {
  const inlineStyles = new WeakMap();
  const pressHandlers = new WeakMap();

  function setInlineStyle(node, name, value) {
    const previous = inlineStyles.get(node) ?? {};
    const next = { ...previous, [name]: value };
    const result = renderer.setProp(node, "style", next, previous);
    inlineStyles.set(node, next);
    return result;
  }

  function discardNode(node) {
    const parent = renderer.getParentNode(node);
    return parent
      ? renderer.detachNode(parent, node)
      : renderer.release(node);
  }

  return Object.freeze({
    version: BRIDGE_VERSION,

    createView() {
      return renderer.createElement("view");
    },

    createText(value) {
      return renderer.createTextNode(value);
    },

    createImage() {
      return renderer.createElement("image");
    },

    createRoot(start) {
      const root = renderer.createElement("view");
      roots.push(root);
      try {
        start();
        return root;
      } catch (error) {
        discardNode(root);
        throw error;
      } finally {
        const popped = roots.pop();
        if (popped !== root) {
          roots.length = 0;
          throw new Error("Kokaine PocketJS root stack was corrupted");
        }
      }
    },

    getRoot() {
      const root = roots.at(-1);
      if (!root) {
        throw new Error("Kokaine PocketJS rendering must run inside createPocketRoot()");
      }
      return root;
    },

    replaceText(node, value) {
      return renderer.replaceText(node, value);
    },

    insertBefore(parent, node, anchor) {
      return renderer.insertNode(parent, node, anchor);
    },

    remove(parent, node) {
      return renderer.detachNode(parent, node);
    },

    discard(node) {
      return discardNode(node);
    },

    setStyleNumber(node, name, value) {
      return setInlineStyle(node, name, Number(value));
    },

    setStyleString(node, name, value) {
      return setInlineStyle(node, name, value);
    },

    setFocusable(node, value) {
      return renderer.setProp(node, "focusable", value);
    },

    setSource(node, value) {
      return renderer.setProp(node, "src", value);
    },

    setPress(node, handler) {
      const previous = pressHandlers.get(node);
      if (previous) {
        pressHandlers.delete(node);
        previous.state.action = undefined;
      }

      const state = { action: handler };
      const trampoline = (...args) => state.action?.(...args);
      try {
        const result = renderer.setProp(
          node,
          "onPress",
          trampoline,
          previous?.trampoline
        );
        pressHandlers.set(node, { state, trampoline });
        return result;
      } catch (error) {
        // The host may have partially installed this callback before failing.
        // Make either the old or new trampoline inert before the error escapes.
        state.action = undefined;
        throw error;
      }
    },

    clearPress(node) {
      const previous = pressHandlers.get(node);
      if (previous === undefined) return undefined;
      pressHandlers.delete(node);
      previous.state.action = undefined;
      return renderer.setProp(node, "onPress", undefined, previous.trampoline);
    }
  });
}

function describeVersion(value) {
  if (value !== null && typeof value === "object" && "version" in value) {
    return JSON.stringify(value.version);
  }
  return "unversioned";
}

function ownedDisposer(state) {
  state.references += 1;
  let disposed = false;
  return function restorePocketBridge() {
    if (disposed) return;
    disposed = true;
    state.references -= 1;
    if (state.references !== 0) return;

    ownedBridges.delete(state.bridge);
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, BRIDGE_KEY);
    if (!descriptor || !("value" in descriptor) || descriptor.value !== state.bridge) return;

    if (state.previousDescriptor) {
      Object.defineProperty(globalThis, BRIDGE_KEY, state.previousDescriptor);
    } else {
      delete globalThis[BRIDGE_KEY];
    }
  };
}

function compatibleDisposer(bridge) {
  const state = ownedBridges.get(bridge);
  return state ? ownedDisposer(state) : () => {};
}

export function installPocketBridge(renderer = defaultRenderer) {
  const existing = globalThis[BRIDGE_KEY];
  if (existing !== undefined) {
    if (!isCompatibleBridge(existing)) {
      throw new Error(
        `Cannot install Kokaine PocketJS bridge: ${describeVersion(existing)} bridge is incompatible with version ${BRIDGE_VERSION}`
      );
    }
    return compatibleDisposer(existing);
  }

  validateRenderer(renderer);
  const roots = [];
  const bridge = createBridge(renderer, roots);
  const previousDescriptor = Object.getOwnPropertyDescriptor(globalThis, BRIDGE_KEY);
  const state = { bridge, previousDescriptor, references: 0, renderer, roots };
  Object.defineProperty(globalThis, BRIDGE_KEY, {
    configurable: true,
    enumerable: false,
    value: bridge,
    writable: true
  });
  ownedBridges.set(bridge, state);
  return ownedDisposer(state);
}

export function createPocketRoot(start) {
  if (typeof start !== "function") {
    throw new TypeError("createPocketRoot() requires a start function");
  }
  const bridge = globalThis[BRIDGE_KEY];
  if (!isCompatibleBridge(bridge)) {
    throw new Error("createPocketRoot() requires a compatible @kokaine/pocketjs bridge");
  }
  return bridge.createRoot(start);
}

// Internal composition hook used when Pocket throws after the render callback
// returned but before mount handed its disposer back to the caller.
export function discardPocketRoot(root) {
  const bridge = globalThis[BRIDGE_KEY];
  if (!isCompatibleBridge(bridge)) {
    throw new Error("discardPocketRoot() requires a compatible @kokaine/pocketjs bridge");
  }
  return bridge.discard(root);
}
