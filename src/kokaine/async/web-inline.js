// JavaScript primitives for the Koka module `kokaine/async/web` (kokaine/async/web.kk).
//
// This is not an ES module. `extern import { js file "web-inline.js" }` in
// kokaine/async/web.kk makes the Koka compiler paste this file verbatim into the generated
// `kokaine_async_web.mjs` at compile time, so:
//   - it must contain only top-level function declarations (no imports,
//     exports, or top-level side effects) and runs in strict mode;
//   - every name shares the generated module's scope, hence the
//     `kokaineAsyncWeb` prefix;
//   - a missing or unreadable file fails the Koka build, never the browser.
// Each function backs exactly one `extern`; the Koka declaration keeps the
// type and the design comment, and calls it as `js inline "name(#1,...)"`.
// Unit tests: test/sidecar/*.test.mjs (`node --test`).

/** Backs `extern timer-setup-raw`. */
function kokaineAsyncWebTimerSetupRaw(milliseconds, fulfill, reject) {
  var maxDelay = 2147483647;
  var requested = Math.max(0, Number(milliseconds));
  var state = { fulfill: fulfill, reject: reject, handle: null, remaining: 0, started: 0, slice: 0, deadline: 0 };
  function clear() {
    state.fulfill = null;
    state.reject = null;
    state.handle = null;
  }
  function complete() {
    var callback = state.fulfill;
    clear();
    if (callback)
      callback();
  }
  function fail(error) {
    var callback = state.reject;
    clear();
    if (callback)
      callback(error);
  }
  function schedule(delay) {
    state.handle = setTimeout(tick, delay);
  }
  function arm() {
    state.slice = Math.min(maxDelay, Math.ceil(state.remaining));
    state.started = performance.now();
    state.deadline = state.started + state.slice;
    schedule(state.slice);
  }
  function tick() {
    state.handle = null;
    if (!state.fulfill)
      return;
    try {
      var now = performance.now();
      var until = state.deadline - now;
      if (until > 0) {
        schedule(Math.min(maxDelay, Math.ceil(until)));
        return;
      }
      state.remaining = Math.max(0, state.remaining - Math.max(state.slice, now - state.started));
      if (state.remaining <= 0)
        complete();
      else
        arm();
    } catch (error) {
      fail(error);
    }
  }
  if (!Number.isSafeInteger(requested)) {
    clear();
    return { ok: false, error: 'duration exceeds the exact browser timer range' };
  }
  state.remaining = requested;
  try {
    arm();
    return { ok: true, state: state };
  } catch (error) {
    clear();
    return { ok: false, error: error };
  }
}

/** Backs `extern host-error-message`. */
function kokaineAsyncWebHostErrorMessage(error) {
  try {
    var message = error && error.message;
    return String(message == null ? error : message);
  } catch (formatError) {
    try {
      var fallback = formatError && formatError.message;
      return String(fallback == null ? formatError : fallback);
    } catch (_) {
      return 'unprintable host error';
    }
  }
}

/** Backs `extern timer-retire`. */
function kokaineAsyncWebTimerRetire(value) {
  var state = value;
  if (!state)
    return;
  var handle = state.handle;
  state.fulfill = null;
  state.reject = null;
  state.handle = null;
  if (handle != null) {
    try {
      clearTimeout(handle);
    } catch (_) {
    }
  }
}

/** Backs `extern promise-subscribe`. */
function kokaineAsyncWebPromiseSubscribe(valueArg, fulfill, reject) {
  var state = { fulfill: fulfill, reject: reject };
  try {
    Promise.resolve(valueArg).then(function (value) {
      var callback = state.fulfill;
      state.fulfill = null;
      state.reject = null;
      if (callback)
        callback(value);
    }, function (error) {
      var callback = state.reject;
      state.fulfill = null;
      state.reject = null;
      if (callback)
        callback(error);
    });
    return { ok: true, state: state };
  } catch (error) {
    state.fulfill = null;
    state.reject = null;
    return { ok: false, error: error };
  }
}

/** Backs `extern promise-retire`. */
function kokaineAsyncWebPromiseRetire(value) {
  var state = value;
  if (state) {
    state.fulfill = null;
    state.reject = null;
  }
}

/** Backs `extern fetch-subscribe`. */
function kokaineAsyncWebFetchSubscribe(valueArg, fulfill, reject) {
  var controller = null;
  var state = { fulfill: fulfill, reject: reject, controller: null };
  try {
    controller = new AbortController();
    state.controller = controller;
    var request = valueArg;
    globalThis.fetch(request.url, Object.assign({}, request.init, { signal: controller.signal })).then(function (value) {
      var callback = state.fulfill;
      var activeController = state.controller;
      state.fulfill = null;
      state.reject = null;
      if (callback)
        callback({ response: value, controller: activeController, release: null });
    }, function (error) {
      var callback = state.reject;
      state.fulfill = null;
      state.reject = null;
      state.controller = null;
      if (callback)
        callback(error);
    });
    return { ok: true, state: state };
  } catch (error) {
    state.fulfill = null;
    state.reject = null;
    state.controller = null;
    return { ok: false, error: error };
  }
}

/** Backs `extern fetch-retire`. */
function kokaineAsyncWebFetchRetire(value) {
  var state = value;
  if (!state)
    return;
  var controller = state.controller;
  state.fulfill = null;
  state.reject = null;
  state.controller = null;
  if (controller) {
    try {
      controller.abort();
    } catch (_) {
    }
  }
}

/** Backs `extern response-retire`. */
function kokaineAsyncWebResponseRetire(value) {
  var wrapper = value;
  if (!wrapper)
    return;
  var response = wrapper.response;
  var controller = wrapper.controller;
  var body = response && response.body;
  wrapper.release = null;
  wrapper.controller = null;
  if (controller) {
    try {
      controller.abort();
    } catch (_) {
    }
  }
  if (body && !body.locked) {
    try {
      var canceled = body.cancel();
      if (canceled && canceled.catch)
        canceled.catch(function () {
        });
    } catch (_) {
    }
  }
}

/** Backs `extern response/discard`. */
function kokaineAsyncWebResponseDiscard(value) {
  var wrapper = value;
  if (!wrapper)
    return;
  var response = wrapper.response;
  var release = wrapper.release;
  var controller = wrapper.controller;
  var body = response && response.body;
  wrapper.release = null;
  wrapper.controller = null;
  if (release) {
    try {
      release();
    } catch (_) {
    }
  }
  if (controller) {
    try {
      controller.abort();
    } catch (_) {
    }
  }
  if (body && !body.locked) {
    try {
      var canceled = body.cancel();
      if (canceled && canceled.catch)
        canceled.catch(function () {
        });
    } catch (_) {
    }
  }
}

/** Backs `extern response-body-subscribe`. */
function kokaineAsyncWebResponseBodySubscribe(value, asJson, fulfill, reject) {
  var wrapper = value;
  var response = wrapper.response;
  var release = wrapper.release;
  var state = { fulfill: fulfill, reject: reject, controller: wrapper.controller, body: response.body };
  wrapper.release = null;
  wrapper.controller = null;
  function clear() {
    state.controller = null;
    state.body = null;
  }
  function stop() {
    var controller = state.controller;
    var body = state.body;
    state.fulfill = null;
    state.reject = null;
    clear();
    if (controller) {
      try {
        controller.abort();
      } catch (_) {
      }
    }
    if (body && !body.locked) {
      try {
        var canceled = body.cancel();
        if (canceled && canceled.catch)
          canceled.catch(function () {
          });
      } catch (_) {
      }
    }
  }
  try {
    if (release)
      release();
    var pending = (asJson ? response.json() : response.text());
    Promise.resolve(pending).then(function (result) {
      var callback = state.fulfill;
      state.fulfill = null;
      state.reject = null;
      clear();
      if (callback)
        callback(result);
    }, function (error) {
      var callback = state.reject;
      state.fulfill = null;
      state.reject = null;
      clear();
      if (callback)
        callback(error);
    });
    return { ok: true, state: state };
  } catch (error) {
    stop();
    return { ok: false, error: error };
  }
}

/** Backs `extern response-body-retire`. */
function kokaineAsyncWebResponseBodyRetire(value) {
  var state = value;
  if (!state)
    return;
  var controller = state.controller;
  var body = state.body;
  state.fulfill = null;
  state.reject = null;
  state.controller = null;
  state.body = null;
  if (controller) {
    try {
      controller.abort();
    } catch (_) {
    }
  }
  if (body && !body.locked) {
    try {
      var canceled = body.cancel();
      if (canceled && canceled.catch)
        canceled.catch(function () {
        });
    } catch (_) {
    }
  }
}
