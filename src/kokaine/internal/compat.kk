/*--------------------------------------------------------------------------
  Copyright (c) 2026 Kokaine contributors. SPDX-License-Identifier: MIT

  Compatibility adapters for the Koka standard library surface used by the
  runtime. Koka 3.2.3 exposes the one-argument exception adapter as
  `error/try`; later versions expose it as `try`. The two-argument exception
  handler is stable across both versions, so keep that spelling behind one
  Kokaine-owned boundary.
--------------------------------------------------------------------------*/
module kokaine/internal/compat

pub fun capture-error(action : () -> <exn|e> a) : e error<a>
  try(fn() Ok(action()),fn(problem) Error(problem))
