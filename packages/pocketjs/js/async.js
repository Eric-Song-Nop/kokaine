import { onFrame } from "@pocketjs/framework/lifecycle";

const ASYNC_KEY = Symbol.for("kokaine.pocketjs.async");
const ASYNC_VERSION = 1;
const TICKS_PER_SECOND = 60;
const VALID_SIMULATION_HZ = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];

function describeVersion(value) {
  if (value !== null && typeof value === "object" && "version" in value) {
    return JSON.stringify(value.version);
  }
  return "unversioned";
}

function validateCallback(callback, method) {
  if (typeof callback !== "function") {
    throw new TypeError(`PocketJS async ${method}() requires a callback`);
  }
}

function normalizeSimulationHz(raw) {
  if (!Number.isFinite(raw) || raw <= 0) return TICKS_PER_SECOND;
  let best = VALID_SIMULATION_HZ[0];
  for (const value of VALID_SIMULATION_HZ) {
    if (Math.abs(value - raw) < Math.abs(best - raw)) best = value;
  }
  return best;
}

function createDispatcher(state) {
  return Object.freeze({
    post(callback) {
      validateCallback(callback, "post");
      if (!state.active) return false;
      state.queue.push(callback);
      return true;
    },

    afterMilliseconds(milliseconds, callback) {
      validateCallback(callback, "afterMilliseconds");
      if (!state.active) return false;

      const delay = Number(milliseconds);
      if (!Number.isSafeInteger(delay)) {
        throw new TypeError(
          "PocketJS async afterMilliseconds() requires a safe-integer delay"
        );
      }

      const timer = {
        at: 0,
        callback,
        pending: true,
        sequence: state.timerSequence++
      };
      const cancel = () => {
        if (!timer.pending) return;
        timer.pending = false;
        timer.callback = undefined;
        state.timers.delete(timer);
      };

      const normalizedDelay = Math.max(0, delay);
      const wholeSeconds = Math.floor(normalizedDelay / 1000);
      const remainingMilliseconds = normalizedDelay % 1000;
      const frames = Math.max(
        1,
        wholeSeconds * state.simulationHz
          + Math.ceil((remainingMilliseconds * state.simulationHz) / 1000)
      );
      const currentFrame = Math.max(0, state.frame);
      if (!Number.isSafeInteger(frames + currentFrame)) {
        throw new RangeError(
          "PocketJS async delay exceeds the exact virtual-frame range"
        );
      }
      timer.at = currentFrame + frames;
      state.timers.add(timer);
      return cancel;
    }
  });
}

function advanceTimers(state) {
  state.frame = state.frame < 0 ? 0 : state.frame + 1;
  if (!state.active || state.timers.size === 0) return;

  const due = [...state.timers]
    .filter((timer) => timer.at <= state.frame)
    .sort((left, right) => left.at - right.at || left.sequence - right.sequence);
  for (const timer of due) {
    if (!state.active) return;
    if (!timer.pending || !state.timers.delete(timer)) continue;
    timer.pending = false;
    const complete = timer.callback;
    timer.callback = undefined;
    if (complete) complete();
  }
}

function flush(state) {
  if (!state.active || state.queue.length === 0) return;

  const batch = state.queue;
  state.queue = [];
  for (let index = 0; index < batch.length; index += 1) {
    if (!state.active) {
      batch.fill(undefined, index);
      return;
    }

    const callback = batch[index];
    batch[index] = undefined;
    try {
      callback();
    } catch (error) {
      const remaining = batch.slice(index + 1);
      batch.fill(undefined, index + 1);
      if (state.active) state.queue = remaining.concat(state.queue);
      throw error;
    }
  }
}

/**
 * Install one mount-scoped async turn queue. This must run inside Pocket's
 * render owner so `onFrame` is removed with the native mount.
 */
export function createPocketAsyncScope() {
  const existing = globalThis[ASYNC_KEY];
  if (existing !== undefined) {
    if (
      existing === null
      || typeof existing !== "object"
      || existing.version !== ASYNC_VERSION
      || typeof existing.capture !== "function"
    ) {
      throw new Error(
        `Cannot install Kokaine PocketJS async bridge: ${describeVersion(existing)} bridge is incompatible with version ${ASYNC_VERSION}`
      );
    }
    throw new Error("Cannot install Kokaine PocketJS async bridge: a scope is already active");
  }

  const previousDescriptor = Object.getOwnPropertyDescriptor(globalThis, ASYNC_KEY);
  const state = {
    active: true,
    frame: -1,
    queue: [],
    simulationHz: normalizeSimulationHz(globalThis.__simHz),
    timers: new Set(),
    timerSequence: 0
  };
  const dispatcher = createDispatcher(state);
  const bridge = Object.freeze({
    version: ASYNC_VERSION,
    capture() {
      return dispatcher;
    }
  });

  Object.defineProperty(globalThis, ASYNC_KEY, {
    configurable: true,
    enumerable: false,
    value: bridge,
    writable: true
  });

  try {
    onFrame(() => {
      advanceTimers(state);
      flush(state);
    });
  } catch (error) {
    state.active = false;
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, ASYNC_KEY);
    if (descriptor && "value" in descriptor && descriptor.value === bridge) {
      if (previousDescriptor) {
        Object.defineProperty(globalThis, ASYNC_KEY, previousDescriptor);
      } else {
        delete globalThis[ASYNC_KEY];
      }
    }
    throw error;
  }

  let disposed = false;
  return function disposePocketAsyncScope() {
    if (disposed) return;
    disposed = true;
    state.active = false;
    state.queue.length = 0;
    for (const timer of state.timers) {
      timer.pending = false;
      timer.callback = undefined;
    }
    state.timers.clear();

    const descriptor = Object.getOwnPropertyDescriptor(globalThis, ASYNC_KEY);
    if (descriptor && "value" in descriptor && descriptor.value === bridge) {
      if (previousDescriptor) {
        Object.defineProperty(globalThis, ASYNC_KEY, previousDescriptor);
      } else {
        delete globalThis[ASYNC_KEY];
      }
    }
  };
}
