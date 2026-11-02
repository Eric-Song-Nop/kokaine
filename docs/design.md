# Design notes

## Compiler and renderer targets

The core package supports Koka `>=3.2.3 <3.3.0`, and CI tests both 3.2.3 and
3.2.9. Generated applications pin Koka 3.2.9, and the browser Playground
ships a Koka 3.2.9 browser build. The same sources compile on all of them:
`kokaine/async/structured` propagates a child's final control through
`finally` instead of naming the standard-library finalization primitives that
Koka 3.2.8 renamed. On Koka 3.2.3's C backend that control path corrupts the
heap inside Koka's own runtime (fixed upstream in 3.2.8), so its tests run on
the JavaScript backend, which is the one Kokaine ships. The
source-local continuation index, two-plane scheduler, lifetime model, and
retained-host callback transport are renderer-neutral. The HTML vocabulary is
shared by DOM and SSR, but is deliberately not the native-UI abstraction. The
complete browser renderer targets `jsweb`; a smaller `wasmweb` proof separately
verifies the retained-callback ABI used to cross an asynchronous host boundary.

## Why algebraic effects and continuations

Algebraic effects and continuations do different jobs in Kokaine. Effect
operations state what a computation may ask for, and handlers decide how those
operations are interpreted. The continuation captured by a tracked read states
where incremental execution can continue. Neither role is a synonym for the
other:

| Capability     | Operation               | Handler responsibility                                                  |
| -------------- | ----------------------- | ----------------------------------------------------------------------- |
| `signal-read`  | `count.get`             | Validate a producer and interpret the read as tracked or sampled.        |
| `signal-write` | `count.set(1)`          | Apply equality, commit, invalidate, batch, and request settling.         |
| `html<e>`      | `text`, `div`, `region` | Collect a DOM/SSR-neutral HTML `view<e>`.                                |

The tracked-read handler installed by `reify-trace` is where the two ideas meet.
It handles the `signal-read` operation with `raw ctl`, reifies the exact
synchronous suffix after that `get`, resumes it immediately with the current
value, and indexes the resulting capability at the source. A later unequal
write queues that suffix. It does not call a saved component or calculator
closure.

This split has practical consequences. A memo calculator accepts
`signal-read` but not `signal-write`; an effect separates its tracked function
from its untracked apply function; `untrack` is a nested override handler; and
`batch` is a scoped interpretation of write operations.

An effect row describes operations that remain unhandled at a function
boundary; it does not prove that no operation was performed and handled inside
the function. Kokaine therefore adds a runtime pure phase around derivations;
see [Semantic division of labor](architecture.md#semantic-division-of-labor)
in the architecture notes.

## Scope

Kokaine does not yet provide hydration, suspense, or a complete WASM DOM
renderer. Ordinary `region` remains a whole-range replacement primitive for
general conditional structure. Keyed list/vector reconciliation is available
only through `for` from `kokaine/control`, where an explicit business key makes
row identity and lifetime unambiguous.

Browser listeners begin at an ordinary host ABI callback that re-enters the
owning generation and resumes a parked event continuation. That boundary
cannot reconstruct arbitrary user-defined handlers that lexically surrounded
`mount`, so listener callbacks keep a closed capability row and `mount` and
`run-async` accept only a `root<<ui>>`. See
[Host callbacks, event continuations, and re-entry](architecture.md#host-callbacks-event-continuations-and-re-entry)
for the full design.

## Design references

The [Koka book](https://koka-lang.github.io/koka/doc/book.html) is the language
and effect-handler reference. Solid's documentation for
[signals](https://docs.solidjs.com/concepts/signals),
[memos](https://docs.solidjs.com/concepts/derived-values/memos),
[effects](https://docs.solidjs.com/concepts/effects), and
[batching](https://docs.solidjs.com/reference/reactive-utilities/batch) supplied
the semantic baseline for fine-grained UI behavior.

The koka-community [HTML DSL](https://github.com/koka-community/html) and
[reactives](https://github.com/koka-community/reactives) repositories were
treated as design references, not dependencies. The scheduler, safety
boundaries, lifecycle, escaping, and asynchronous callback behavior here are
independently implemented and tested.
