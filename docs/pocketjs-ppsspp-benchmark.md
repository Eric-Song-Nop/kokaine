# Kokaine PocketJS PPSSPP microbenchmark

Run date: 2026-07-23

## Result

Kokaine's PocketJS adapter runs successfully in the PSP QuickJS host under
PPSSPPHeadless. A single live text update is viable on the 60 Hz average CPU
budget, but its update frame is not: the 120-frame window averages 11.858 ms
while the maximum measured work is 20.991 ms. Fan-out and whole-region
replacement workloads are substantially over budget.

This is a PSP CPU submission-work microbenchmark, not a real-hardware FPS
measurement. PPSSPPHeadless is unthrottled, and the native timer excludes GPU
sync, vblank, swap, and capture dumping. Results are therefore compared with
the 16.667 ms CPU budget instead of being converted into emulator FPS.

## Scope

The comparison uses seven small workloads that fit Kokaine's current PocketJS
surface:

| Workload | Measured operation |
| --- | --- |
| `static-16` | Mount and draw 16 static text cells |
| `press-noop` | Resume a retained press callback without a state write |
| `signal-only` | Press plus one signal write with no subscriber |
| `text-one` | One signal write and one live text replacement |
| `text-fanout-16` | One signal write and 16 live text replacements |
| `style-fanout-16` | One signal write and 16 live color updates |
| `region-replace-8` | Replace a region containing eight text cells |

Each interactive workload receives 60 CIRCLE rising edges over a 120-frame
capture window. The Kokaine, Vue VDOM, Vue Vapor, and Solid paths use the same
logical tree, strings, styles, input script, and 480x272 viewport. All 120
framebuffers were byte-identical across all four paths for every workload.

The data does not reuse or combine the PocketJS draft branch's seven showcase
demo scores. Kokaine cannot implement those demos equivalently yet because its
current PocketJS API has no frame callback, native animation/spring, live image
source, class/focus variants, floating-point styles, programmatic focus, or
keyed reconciliation.

## Frame Work

Values are `average / maximum` CPU work per captured frame in milliseconds.
The average includes 60 update frames and 60 release frames.

| Workload | Kokaine | Vue VDOM | Vue Vapor | Solid |
| --- | ---: | ---: | ---: | ---: |
| Static 16 | 6.047 / 6.250 | 6.054 / 6.256 | 6.053 / 6.256 | 6.054 / 6.255 |
| Press no-op | 5.264 / 8.253 | 2.483 / 2.694 | 2.504 / 2.693 | 2.505 / 2.693 |
| Signal only | 6.063 / 9.821 | 15.851 / 29.781 | 2.574 / 2.803 | 2.554 / 2.759 |
| One live text | 11.858 / 20.991 | 20.944 / 39.457 | 5.598 / 8.265 | 5.802 / 8.649 |
| 16 live texts | 69.553 / 133.104 | 74.771 / 144.088 | 24.139 / 41.072 | 40.426 / 74.669 |
| 16 live styles | 63.084 / 122.750 | 60.577 / 120.384 | 26.350 / 48.042 | 56.506 / 109.519 |
| Region replace 8 | 65.336 / 128.159 | 47.685 / 92.351 | 14.691 / 25.524 | 36.095 / 69.095 |

The Kokaine assessment against a 16.667 ms frame budget is:

- Static, no-op callback, and unobserved signal writes remain within budget.
- One live text passes on window average but misses on the update frame.
- The three fan-out/structural workloads miss on both average and maximum.
- Kokaine beats Vue VDOM on signal-only, one-text, and 16-text work, but is
  slower than Vue Vapor and Solid on the reactive workloads.

Across the six strict same-topology workloads (everything except region
replacement), the geometric mean of Kokaine `avg_work` is 0.874x Vue VDOM,
2.041x Vue Vapor, and 1.641x Solid. The per-workload values are more useful
than this aggregate because the suite deliberately isolates different costs.

## Kokaine Isolation

Each Kokaine workload was rebuilt with the same layout and focus setup but no
CIRCLE edges. Since exactly half of the measured frames contain an update, the
estimated update increment is:

```text
2 * (average_with_updates - average_without_updates)
```

| Workload | No-CIRCLE baseline | Window average | Estimated update increment | Estimated update frame |
| --- | ---: | ---: | ---: | ---: |
| Press no-op | 2.297 ms | 5.264 ms | 5.934 ms | 8.231 ms |
| Signal only | 2.328 ms | 6.063 ms | 7.470 ms | 9.798 ms |
| One live text | 2.916 ms | 11.858 ms | 17.884 ms | 20.800 ms |
| 16 live texts | 6.444 ms | 69.553 ms | 126.218 ms | 132.662 ms |
| 16 live styles | 4.478 ms | 63.084 ms | 117.212 ms | 121.690 ms |
| Region replace 8 | 4.027 ms | 65.336 ms | 122.618 ms | 126.645 ms |

The corresponding JavaScript isolation indicates:

- Input edge processing without a callback costs about 0.374 ms per edge in
  this harness.
- Resuming Kokaine's retained event continuation adds about 6.100 ms of JS
  beyond that raw edge path.
- The unobserved signal write adds about 1.530 ms beyond the no-op callback.
- One live text subscriber adds about 6.204 ms of JS plus native text/layout
  work beyond the signal-only path.
- Sixteen text and style subscribers add approximately 6.43 ms and 6.83 ms of
  JS per subscriber respectively.

The dominant cost is synchronous JS. It follows the Kokaine path through event
continuation re-entry, the signal transaction, exact-read continuation
generation, cleanup/publication, bridge exception boxing, and the renderer
mutation. Promise jobs and GE rendering are not the primary Kokaine overhead.

## Startup

The one-live-text workload gives a representative startup comparison:

| Path | Bundle | Eval | Boot to frame 0 |
| --- | ---: | ---: | ---: |
| Kokaine | 119,729 B | 1,675.560 ms | 1,730.293 ms |
| Vue VDOM | 85,841 B | 1,288.939 ms | 1,346.576 ms |
| Vue Vapor | 131,359 B | 1,995.200 ms | 2,047.276 ms |
| Solid | 30,157 B | 562.046 ms | 612.510 ms |

Kokaine's generated runtime is roughly 3.97x the Solid bundle and takes about
2.98x as long to evaluate for this workload.

## Method

- Kokaine commit: `6f8ee9ebfeaa1f7f1ae7ce8f60d935348a837771`
- Koka compiler: 3.2.3
- Supported PocketJS baseline: `v0.6.0` at
  `1f848dcdb2629e3c6373710cd0aa16d775ea2ad3`
- Four-path comparison branch: draft PocketJS PR 6 at
  `28aa0f27184fe61a0de92f0964096f1e646ebe50`
- PPSSPP: `676724ee5e0283cbb879f45e1e88383cf821abd3`
- rust-psp: `2cbaf8c9bc72569c76240a1d9743de10731e5f6b`
- quickjs-rs: `0fc946fb670c0c29bc0135f510bcb0f595415a61`
- Graphics backend: software
- Samples: seven per workload and path

The comparison branch required three explicit harness corrections:

1. `-ffreestanding` was added to PSP C flags so LLVM 22 could not include host
   glibc headers after the PSP Newlib headers.
2. The experimental Solid primitive was corrected to retain reactive
   `children`, `class`, and `style` getters. Without this, the displayed count
   remained zero and the apparent Solid result did not execute the workload.
3. The experimental Solid renderer subpath was exported for the Kokaine bridge.

PSP-side timers were identical across all seven repetitions of a given EBOOT;
PPSSPP's emulated clock is deterministic for this run. Host wall time varied
but is intentionally excluded from the performance conclusion.

Machine-readable summarized results are in
[`pocketjs-ppsspp-benchmark-results.json`](pocketjs-ppsspp-benchmark-results.json).

## Limits

The Vue VDOM comparison exists only on an older experimental PocketJS branch,
while Kokaine officially targets PocketJS 0.6.0. The benchmark therefore
measures a controlled four-path compatibility harness, not a supported release
matrix.

No real PSP was used. The run does not establish sustained hardware FPS, GPU
frame time, allocator headroom, or the 8 MB device memory budget. Those require
the exact supported 0.6.0 host and physical hardware profiling.
