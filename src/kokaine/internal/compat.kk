/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Compatibility adapters for the Koka standard library surface used by the
  runtime. The standard library's `try` overloads changed shape between
  releases: Koka 3.2.3 takes `try(action, handler)` while 3.2.8+ takes
  `try(handler, action)` and turns `error<a>` into an alias of
  `result<a,exception>`. Handling the `exn` effect's `throw-exn` operation
  directly is stable across both, so keep that behind one Kokaine-owned
  boundary.
--------------------------------------------------------------------------*/
module kokaine/internal/compat

pub fun capture-error(action : () -> <exn|e> a) : e error<a>
  with final ctl throw-exn(problem) Error(problem)
  Ok(action())
