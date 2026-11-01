"""Mount/toggle/update benchmark for the browser DOM adapter.

Loads dist/test_dom_dash_perf_dash_mount__main.mjs (built by
`make build-browser-fixtures`) in a fresh page per sample and reports:

- mount: 2,000 rows (live text, live attribute, two listeners each) plus a
  region wrapping a 300-row table;
- toggle-off / toggle-on: retire and rebuild that region;
- flat-off / flat-on: the same for a region whose 300 rows are sibling roots;
- update: one write that updates every live text and attribute;
- allocation proxies: retained JS heap after mount, and the sampling heap
  profiler's estimate of bytes allocated (including collected garbage)
  during each phase.

It also checks that the fixture still behaves (listeners deliver, the table
retires and returns, live bindings update), so a broken build cannot report
a fast but meaningless number.  Usage: `make bench-browser` (or run with
`--samples N` / `--json`).
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
MODULE = "/dist/test_dom_dash_perf_dash_mount__main.mjs"


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


def load_fixture(page, origin: str) -> None:
    page.goto(f"{origin}/test/")
    page.evaluate(
        """async (module) => {
            const host = document.createElement('div');
            host.id = 'perf-root';
            document.body.replaceChildren(host);
            await import(module);
        }""",
        MODULE,
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


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--samples", type=int, default=9)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()

    times: dict[str, list[float]] = {
        "mount": [], "toggle-off": [], "toggle-on": [],
        "flat-off": [], "flat-on": [], "update": [],
    }
    with serve_project() as origin:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)
            errors: list[str] = []

            page = browser.new_page()
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on(
                "console",
                lambda message: errors.append(message.text)
                if message.type == "error" else None,
            )
            load_fixture(page, origin)
            timed(page, "mount")
            check_behaviour(page)
            page.close()

            # Warm-up page so the first timed sample is not a cold compile.
            for sample in range(args.samples + 1):
                page = browser.new_page()
                page.on("pageerror", lambda error: errors.append(str(error)))
                load_fixture(page, origin)
                mount = timed(page, "mount")
                toggles = []
                for _ in range(3):
                    off = timed(page, "toggle")
                    on = timed(page, "toggle")
                    toggles.append((off, on))
                flats = []
                for _ in range(3):
                    off = timed(page, "toggleFlat")
                    on = timed(page, "toggleFlat")
                    flats.append((off, on))
                updates = [timed(page, "bump") for _ in range(5)]
                if sample > 0:
                    times["mount"].append(mount)
                    times["toggle-off"].append(statistics.median(t[0] for t in toggles))
                    times["toggle-on"].append(statistics.median(t[1] for t in toggles))
                    times["flat-off"].append(statistics.median(t[0] for t in flats))
                    times["flat-on"].append(statistics.median(t[1] for t in flats))
                    times["update"].append(statistics.median(updates))
                page.close()

            page = browser.new_page()
            cdp = page.context.new_cdp_session(page)
            cdp.send("HeapProfiler.enable")
            load_fixture(page, origin)
            before = heap_used(cdp)
            alloc_mount = allocated(cdp, page, "mount")
            retained = heap_used(cdp) - before
            alloc_off = allocated(cdp, page, "toggle")
            alloc_on = allocated(cdp, page, "toggle")
            alloc_flat_off = allocated(cdp, page, "toggleFlat")
            alloc_flat_on = allocated(cdp, page, "toggleFlat")
            alloc_update = allocated(cdp, page, "bump")
            page.close()
            browser.close()
            assert not errors, f"benchmark page reported errors: {errors!r}"

    result = {
        "ms": {name: round(statistics.median(values), 2) for name, values in times.items()},
        "ms_min": {name: round(min(values), 2) for name, values in times.items()},
        "retained_kb_after_mount": round(retained / 1024),
        "allocated_kb": {
            "mount": round(alloc_mount / 1024),
            "toggle-off": round(alloc_off / 1024),
            "toggle-on": round(alloc_on / 1024),
            "flat-off": round(alloc_flat_off / 1024),
            "flat-on": round(alloc_flat_on / 1024),
            "update": round(alloc_update / 1024),
        },
    }
    if args.json:
        print(json.dumps(result))
    else:
        print(f"perf-mount ({args.samples} samples, median / min ms)")
        for name in times:
            print(f"  {name:<11} {result['ms'][name]:>8.2f} / {result['ms_min'][name]:.2f}")
        print(f"  retained heap after mount: {result['retained_kb_after_mount']} KiB")
        for name, value in result["allocated_kb"].items():
            print(f"  allocated during {name}: ~{value} KiB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
