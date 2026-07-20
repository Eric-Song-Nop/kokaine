import { mount } from "@pocketjs/framework";
import {
  createPocketRoot,
  discardPocketRoot,
  installPocketBridge
} from "./bridge.js";

/**
 * Mount a Koka entry which returns its root cleanup function. Koka teardown
 * runs while the native mirror is still live, then Pocket destroys the scoped
 * root and the bridge installation is released.
 */
export function mountKokaine(start, options) {
  if (typeof start !== "function") {
    throw new TypeError("mountKokaine() requires a start function");
  }

  const restoreBridge = installPocketBridge();
  let cleanup;
  let disposePocket;
  let root;
  try {
    disposePocket = mount(
      () => {
        root = createPocketRoot(() => {
          cleanup = start();
          if (typeof cleanup !== "function") {
            throw new TypeError("mountKokaine() entry must return a cleanup function");
          }
        });
        return root;
      },
      options
    );
  } catch (error) {
    // Pocket can fail after code() returned but before mount() returned its
    // disposer. Roll back every completed layer while preserving that original
    // mount error even if a finalizer also fails.
    for (const rollback of [
      typeof cleanup === "function" ? cleanup : undefined,
      root ? () => discardPocketRoot(root) : undefined,
      restoreBridge
    ]) {
      try {
        rollback?.();
      } catch {
        // Best-effort rollback must not replace the causal mount failure.
      }
    }
    throw error;
  }

  let disposed = false;
  return function disposeKokaine() {
    if (disposed) return;
    disposed = true;

    let failed = false;
    let failure;
    for (const dispose of [cleanup, disposePocket, restoreBridge]) {
      try {
        dispose();
      } catch (error) {
        if (!failed) {
          failed = true;
          failure = error;
        }
      }
    }
    if (failed) throw failure;
  };
}
