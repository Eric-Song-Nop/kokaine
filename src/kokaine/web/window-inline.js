// JavaScript primitives for the Koka module `kokaine/web/window` (kokaine/web/window.kk).
//
// This is not an ES module. `extern import { js file "window-inline.js" }` in
// kokaine/web/window.kk makes the Koka compiler paste this file verbatim into the generated
// `kokaine_web_window.mjs` at compile time, so:
//   - it must contain only top-level function declarations (no imports,
//     exports, or top-level side effects) and runs in strict mode;
//   - every name shares the generated module's scope, hence the
//     `kokaineWindow` prefix;
//   - a missing or unreadable file fails the Koka build, never the browser.
// Each function backs exactly one `extern`; the Koka declaration keeps the
// type and the design comment, and calls it as `js inline "name(#1,...)"`.
// Unit tests: test/sidecar/*.test.mjs (`node --test`).

/** Backs `extern window-event-setup-raw`. */
function kokaineWindowEventSetupRaw(name, complete, reject) {
  var eventName = name;
  var state = { complete: complete, reject: reject, listener: null };
  var listener = function () {
    var callback = state.complete;
    var fail = state.reject;
    state.complete = null;
    state.reject = null;
    state.listener = null;
    try {
      window.removeEventListener(eventName, listener);
    } catch (error) {
      if (fail)
        fail(error);
      return;
    }
    if (callback)
      callback();
  };
  state.listener = listener;
  try {
    window.addEventListener(eventName, listener, { passive: eventName === 'scroll' });
    return { ok: true, state: state, name: eventName };
  } catch (error) {
    state.complete = null;
    state.reject = null;
    state.listener = null;
    try {
      window.removeEventListener(eventName, listener);
    } catch (_) {
    }
    return { ok: false, error: error };
  }
}

/** Backs `extern host-attempt-raw`. */
function kokaineWindowHostAttemptRaw(action) {
  try {
    return { ok: true, value: (action)() };
  } catch (error) {
    return { ok: false, error: error };
  }
}

/** Backs `extern host-error-message`. */
function kokaineWindowHostErrorMessage(error) {
  try {
    var message = error && error.message;
    return String(message == null ? error : message);
  } catch (formatError) {
    try {
      return String(formatError);
    } catch (_) {
      return 'unprintable host error';
    }
  }
}

/** Backs `extern retire-window-event`. */
function kokaineWindowRetireWindowEvent(value) {
  var wrapper = value;
  if (!wrapper)
    return;
  var state = wrapper.state;
  if (!state)
    return;
  var listener = state.listener;
  state.complete = null;
  state.reject = null;
  state.listener = null;
  if (listener) {
    try {
      window.removeEventListener(wrapper.name, listener);
    } catch (_) {
    }
  }
  wrapper.state = null;
}

/** Backs `extern focus-selector-raw`. */
function kokaineWindowFocusSelectorRaw(selector) {
  try {
    var target = document.querySelector(selector);
    if (!target)
      throw new Error('DOM selector did not match: ' + selector);
    target.focus();
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error };
  }
}

/** Backs `extern viewport-bounds-raw`. */
function kokaineWindowViewportBoundsRaw(selector) {
  try {
    var target = document.querySelector(selector);
    if (!target)
      throw new Error('DOM selector did not match: ' + selector);
    var rectangle = target.getBoundingClientRect();
    return { ok: true, top: Math.round(rectangle.top), bottom: Math.round(rectangle.bottom) };
  } catch (error) {
    return { ok: false, error: error };
  }
}

/** Backs `extern location-fragment-raw`. */
function kokaineWindowLocationFragmentRaw() {
  var raw = String(window.location.hash || '');
  if (raw.charCodeAt(0) === 35)
    raw = raw.slice(1);
  try {
    return decodeURIComponent(raw);
  } catch (error) {
    if (typeof URIError === 'function' && error instanceof URIError)
      return raw;
    throw error;
  }
}

/** Backs `extern log-window-error`. */
function kokaineWindowLogWindowError(message) {
  try {
    if (globalThis.console && typeof globalThis.console.error === 'function')
      globalThis.console.error(message);
  } catch (_) {
  }
}
