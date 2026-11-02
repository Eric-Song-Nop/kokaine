# Changelog

Versions are per package. Entries list the package and version they shipped in.

## @kokaine/core 0.2.0, @kokaine/cli 0.2.0, @kokaine/create 0.2.0

### Fixed
- `@kokaine/core`: clean memo reads validate each producer once per read
  instead of once per path (exponential on chained diamonds).
- `@kokaine/core`: a `finally` inside a tracked computation no longer runs
  again when the trace retires.
- `@kokaine/core`: a failing effect no longer blocks unrelated work queued
  behind it; it retries when its own input changes or at an `update` boundary.
- `@kokaine/core`: URL attributes and properties reject `javascript:` and
  similar schemes; `unsafe-trusted-url` opts in explicitly.
- `@kokaine/core`: SVG and MathML elements are created in their namespaces.
- `@kokaine/core`: a later patch of `attachShadow` no longer breaks mounting.
- `@kokaine/core`: `monitor-window-events` no longer drops events fired between
  iterations or while its action runs; repeats of a pending kind coalesce.
- `@kokaine/cli`: the compiler archive extractor refuses entries written through
  an extracted symlink.

### Performance
- `@kokaine/core`: keyed reconciliation moves only rows outside the longest
  increasing subsequence and validates each moved row once. Rows that stay put
  are no longer inspected, so an unmovable element in one no longer blocks a
  reorder.
- `@kokaine/core`: region cleanup memoizes its escape sweep, live bindings check
  names once (URL schemes are still checked per value), and listener
  continuations are captured on first delivery.
- `@kokaine/core`: async completions share one microtask and batch per drain,
  scheduled actions take one turn, sequential awaits reuse their supervisor, and
  a race scans the family once when cancelling.

### Changed
- Package metadata declares MIT, matching the LICENSE file.
- Node `>=22.12.0` is required.
- `async-schedule` actions now run in program order with sibling completions
  reported synchronously from setup (one host turn instead of two).
- The supported Koka range is `>=3.2.3 <3.3.0`; new applications pin 3.2.9.
  `kokaine/async/structured` no longer depends on the standard-library
  finalization primitives that Koka 3.2.8 renamed.

## @kokaine/core 0.1.0, @kokaine/cli 0.1.0, @kokaine/create 0.1.0

First npm releases. The repository's core version reached 0.1.1 but that
version was never published. `@kokaine/pocketjs` has not been published; it is
frozen at PocketJS 0.6 and marked private.
