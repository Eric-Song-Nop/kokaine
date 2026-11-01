"""Mount/toggle/update benchmark for the browser DOM adapter.

Loads dist/test_dom_dash_perf_dash_mount__main.mjs (built by
`make build-browser-fixtures`) in a fresh page per sample and reports:

- mount: 2,000 rows (live text, live attribute, two listeners each) plus a
  region wrapping a 300-row table;
- toggle-off / toggle-on: retire and rebuild that region;
- flat-off / flat-on: the same for a region whose 300 rows are sibling roots;
- update: one write that updates every live text and attribute;
- first-click / click: synchronous delivery of the first and later clicks
  to one listener;
- allocation proxies: retained JS heap after mount, and the sampling heap
  profiler's estimate of bytes allocated (including collected garbage)
  during each phase.

It also checks that the fixture still behaves (listeners deliver, the table
retires and returns, live bindings update), so a broken build cannot report
a fast but meaningless number.  Usage: `make bench-browser`, or run with
`--samples N`, `--json`, and `--dist DIR` (repeatable) to compare builds of
the fixture with interleaved samples.
"""

from __future__ import annotations

import argparse
import json
import statistics
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODULE = "test_dom_dash_perf_dash_mount__main.mjs"


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, _format: str, *_args: object) -> None:
        pass


@contextmanager
def serve_project():
    handler = partial(QuietHandler, directory=PROJECT_ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_port}"
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def load_fixture(page, origin: str, dist: str = "dist") -> None:
    page.goto(f"{origin}/test/")
    page.evaluate(
        """async (module) => {
            const host = document.createElement('div');
            host.id = 'perf-root';
            document.body.replaceChildren(host);
            await import(module);
        }""",
        f"/{dist}/{MODULE}",
    )


def click_ms(page, index: int) -> float:
    """Time one synchronous click delivery to the index-th "+" button."""
    return page.evaluate(
        """(index) => {
            const button = document.querySelectorAll('.perf-inc')[index];
            const start = performance.now();
            button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
            return performance.now() - start;
        }""",
        index,
    )


def timed(page, control: str) -> float:
    result = page.evaluate(
        """(control) => {
            const start = performance.now();
            const ok = globalThis.__kokainePerfMount[control]();
            const elapsed = performance.now() - start;
            return { ok, elapsed };
        }""",
        control,
    )
    assert result["ok"], f"perf control {control} failed"
    return result["elapsed"]


def collect(cdp) -> None:
    cdp.send("HeapProfiler.collectGarbage")
    cdp.send("HeapProfiler.collectGarbage")


def heap_used(cdp) -> int:
    collect(cdp)
    return int(cdp.send("Runtime.getHeapUsage")["usedSize"])


def allocated(cdp, page, control: str) -> int:
    """Estimated bytes allocated by one control call, garbage included."""
    collect(cdp)
    cdp.send(
        "HeapProfiler.startSampling",
        {
            "samplingInterval": 512,
            "includeObjectsCollectedByMajorGC": True,
            "includeObjectsCollectedByMinorGC": True,
        },
    )
    timed(page, control)
    profile = cdp.send("HeapProfiler.stopSampling")["profile"]
    return int(sum(sample["size"] for sample in profile["samples"]))


def check_behaviour(page) -> None:
    assert page.locator(".perf-row").count() == 2000
    assert page.locator("#perf-table tr").count() == 300
    page.locator(".perf-inc").nth(7).click()
    page.locator(".perf-inc").nth(1999).click()
    page.locator(".perf-dec").nth(3).click()
    assert page.evaluate("__kokainePerfMount.read()") == 1
    timed(page, "bump")
    assert page.locator(".perf-value").nth(5).text_content() == "6"
    assert page.locator(".perf-badge").nth(5).get_attribute("title") == "tick 1"
    timed(page, "toggle")
    assert page.locator("#perf-table").count() == 0
    assert page.locator("#perf-table-hidden").count() == 1
    timed(page, "toggle")
    assert page.locator("#perf-table tr").count() == 300
    timed(page, "toggleFlat")
    assert page.locator(".perf-flat").count() == 0
    timed(page, "toggleFlat")
    assert page.locator(".perf-flat").count() == 300
    page.locator(".perf-inc").nth(0).click()
    assert page.evaluate("__kokainePerfMount.read()") == 2
    timed(page, "dispose")
    assert page.locator("#perf-root").evaluate("node => node.childNodes.length") == 0


PHASES = ("mount", "toggle-off", "toggle-on", "flat-off", "flat-on", "update",
          "first-click", "click")


def sample_page(browser, origin: str, dist: str, errors: list[str]) -> dict[str, float]:
    page = browser.new_page()
    page.on("pageerror", lambda error: errors.append(str(error)))
    load_fixture(page, origin, dist)
    mount = timed(page, "mount")
    toggles = [(timed(page, "toggle"), timed(page, "toggle")) for _ in range(3)]
    flats = [(timed(page, "toggleFlat"), timed(page, "toggleFlat")) for _ in range(3)]
    updates = [timed(page, "bump") for _ in range(5)]
    first_click = click_ms(page, 10)
    clicks = [click_ms(page, 10) for _ in range(5)]
    page.close()
    return {
        "mount": mount,
        "toggle-off": statistics.median(t[0] for t in toggles),
        "toggle-on": statistics.median(t[1] for t in toggles),
        "flat-off": statistics.median(t[0] for t in flats),
        "flat-on": statistics.median(t[1] for t in flats),
        "update": statistics.median(updates),
        "first-click": first_click,
        "click": statistics.median(clicks),
    }


def allocation_page(browser, origin: str, dist: str) -> dict[str, int]:
    page = browser.new_page()
    cdp = page.context.new_cdp_session(page)
    cdp.send("HeapProfiler.enable")
    load_fixture(page, origin, dist)
    before = heap_used(cdp)
    result = {"mount": allocated(cdp, page, "mount")}
    result["retained-after-mount"] = heap_used(cdp) - before
    result["toggle-off"] = allocated(cdp, page, "toggle")
    result["toggle-on"] = allocated(cdp, page, "toggle")
    result["flat-off"] = allocated(cdp, page, "toggleFlat")
    result["flat-on"] = allocated(cdp, page, "toggleFlat")
    result["update"] = allocated(cdp, page, "bump")
    page.close()
    return {name: round(value / 1024) for name, value in result.items()}


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--samples", type=int, default=9)
    parser.add_argument(
        "--dist", action="append",
        help="output directory holding the built fixture (default dist); "
             "repeat to compare builds with interleaved samples",
    )
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    dists = args.dist or ["dist"]

    times = {dist: {name: [] for name in PHASES} for dist in dists}
    allocations = {}
    errors: list[str] = []
    with serve_project() as origin:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            for dist in dists:
                page = browser.new_page()
                page.on("pageerror", lambda error: errors.append(str(error)))
                page.on(
                    "console",
                    lambda message: errors.append(message.text)
                    if message.type == "error" else None,
                )
                load_fixture(page, origin, dist)
                timed(page, "mount")
                check_behaviour(page)
                page.close()

            # The first round warms the browser and is discarded.
            for sample in range(args.samples + 1):
                for dist in dists:
                    measured = sample_page(browser, origin, dist, errors)
                    if sample > 0:
                        for name in PHASES:
                            times[dist][name].append(measured[name])
            for dist in dists:
                allocations[dist] = allocation_page(browser, origin, dist)
            browser.close()
    assert not errors, f"benchmark page reported errors: {errors!r}"

    result = {
        dist: {
            "ms": {name: round(statistics.median(v), 2) for name, v in times[dist].items()},
            "ms_min": {name: round(min(v), 2) for name, v in times[dist].items()},
            "kib": allocations[dist],
        }
        for dist in dists
    }
    if args.json:
        print(json.dumps(result))
        return 0
    print(f"perf-mount: {args.samples} fresh pages per build, median ms (min)")
    print("  " + f"{'':<22}" + "".join(f"{dist:>22}" for dist in dists))
    for name in PHASES:
        cells = "".join(
            f"{result[d]['ms'][name]:>13.2f} ({result[d]['ms_min'][name]:>6.2f})" for d in dists
        )
        print(f"  {name + ' ms':<22}{cells}")
    for name in allocations[dists[0]]:
        label = "retained KiB after mount" if name == "retained-after-mount" else f"allocated KiB {name}"
        print(f"  {label:<22}" + "".join(f"{allocations[d][name]:>22}" for d in dists))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
