# Changelog

Versions are per package. Entries list the package and version they shipped in.

## Unreleased

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
- `@kokaine/cli`: the compiler archive extractor refuses entries written through
  an extracted symlink.

### Changed
- Package metadata declares MIT, matching the LICENSE file.
- Node `>=22.12.0` is required.
- The supported Koka range is `>=3.2.3 <3.2.8`.

## @kokaine/core 0.1.1, @kokaine/cli 0.1.0, @kokaine/create 0.1.0

First npm releases of core (0.1.0), cli, and create. The repository's core
version is 0.1.1, which has not been published yet; `@kokaine/pocketjs` 0.1.0
has not been published either.
