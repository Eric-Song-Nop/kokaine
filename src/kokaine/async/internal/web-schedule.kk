/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Minimal Web microtask ABI used by the generation runtime. Keeping this
  unit-returning extern separate lets backend-neutral reactive modules remain
  type-checkable on Koka's native test backend without importing Promise,
  Fetch, Response, or other browser-only value externs.
--------------------------------------------------------------------------*/
module kokaine/async/internal/web-schedule

// The callback is latent: enqueueing performs only `ui`; the browser invokes
// it later with its declared row.
pub extern enqueue-microtask(action : () -> <ui|e> ()) : ui ()
  js inline "(function(){ var callback=#1; if(typeof queueMicrotask==='function'){ queueMicrotask(callback); } else { Promise.resolve().then(callback); } })()"
