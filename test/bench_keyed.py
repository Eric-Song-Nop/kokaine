"""Keyed reconciliation benchmark (`make bench-keyed`).

Mounts test/keyed-bench.kk with a 500-row list of about twenty DOM nodes per
row and measures four reorders: one row dragged from first to last, a full
reverse, a seeded shuffle, and appending 50 rows. For each scenario it counts
row moves by instrumenting `moveBefore` (native atomic moves) and
`insertBefore` (the fallback fragment path), then times uninstrumented runs.
Each measured update is followed by an untimed reset to the identity order.

Environment: KOKAINE_BENCH_ROWS (default 500), KOKAINE_BENCH_RUNS (default 15).
"""

import json
import os
import statistics
from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import sync_playwright


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ROWS = int(os.environ.get("KOKAINE_BENCH_ROWS", "500"))
RUNS = int(os.environ.get("KOKAINE_BENCH_RUNS", "15"))
APPEND = 50


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


# Installed once; `count(fn)` instruments only while `fn` runs.
HELPERS = """
(rows) => {
    const identity = n => Array.from({ length: n }, (_, i) => i);
    const seeded = seed => () => {
        seed = (seed + 0x6D2B79F5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const shuffle = (values, seed) => {
        const random = seeded(seed);
        const out = values.slice();
        for (let i = out.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [out[i], out[j]] = [out[j], out[i]];
        }
        return out;
    };
    const base = identity(rows);
    globalThis.__bench = {
        base,
        scenarios: {
            drag: () => base.slice(1).concat([0]),
            reverse: () => base.slice().reverse(),
            shuffle: run => shuffle(base, 1234 + run),
            append: () => base.concat(
                Array.from({ length: %d }, (_, i) => rows + i)),
        },
        set(order) {
            if (!globalThis.__kokaineKeyedBench.setOrder(order))
                throw new Error('keyed bench update failed');
        },
        keys() {
            return Array.from(
                document.querySelectorAll('#bench-list > li'),
                node => Number(node.dataset.key));
        },
        fallback(enabled) {
            const list = document.querySelector('#bench-list');
            if (enabled)
                Object.defineProperty(list, 'moveBefore', {
                    configurable: true, value: undefined });
            else
                delete list.moveBefore;
        },
        count(order) {
            const list = document.querySelector('#bench-list');
            const elementProto = Element.prototype;
            const nodeProto = Node.prototype;
            const moveDescriptor =
                Object.getOwnPropertyDescriptor(elementProto, 'moveBefore');
            const insertDescriptor =
                Object.getOwnPropertyDescriptor(nodeProto, 'insertBefore');
            const opening = node => node && node.nodeType === 8 &&
                node.data === 'kokaine:for-row';
            const counts = { rowMoves: 0, nodeMoves: 0 };
            if (moveDescriptor) {
                const nativeMove = moveDescriptor.value;
                Object.defineProperty(elementProto, 'moveBefore', {
                    ...moveDescriptor,
                    value(node, before) {
                        if (this === list) {
                            counts.nodeMoves++;
                            if (opening(node)) counts.rowMoves++;
                        }
                        return nativeMove.call(this, node, before);
                    }
                });
            }
            const nativeInsert = insertDescriptor.value;
            Object.defineProperty(nodeProto, 'insertBefore', {
                ...insertDescriptor,
                value(node, before) {
                    // A fragment with more than the two boundary comments is
                    // a moved row; a bare marker pair is a new row.
                    if (this === list && node.nodeType === 11 &&
                        node.childNodes.length > 2 && opening(node.firstChild)) {
                        counts.nodeMoves += node.childNodes.length;
                        counts.rowMoves++;
                    }
                    return nativeInsert.call(this, node, before);
                }
            });
            try {
                this.set(order);
            } finally {
                if (moveDescriptor)
                    Object.defineProperty(elementProto, 'moveBefore',
                        moveDescriptor);
                Object.defineProperty(nodeProto, 'insertBefore',
                    insertDescriptor);
            }
            return counts;
        },
        time(order) {
            const start = performance.now();
            this.set(order);
            return performance.now() - start;
        },
    };
}
""" % APPEND


def mount_bench(page, origin: str, rows: int) -> None:
    response = page.goto(f"{origin}/test/")
    assert response is not None and response.ok
    page.evaluate(
        """async () => {
            const host = document.createElement('div');
            host.id = 'bench-root';
            document.body.replaceChildren(host);
            await import('/dist/test_keyed_dash_bench__main.mjs');
        }"""
    )
    page.evaluate(HELPERS, rows)
    page.evaluate("globalThis.__bench.set(globalThis.__bench.base)")
    assert page.evaluate("globalThis.__bench.keys().length") == rows


def measure(page, scenario: str, runs: int) -> dict:
    counts = page.evaluate(
        f"globalThis.__bench.count(globalThis.__bench.scenarios.{scenario}(0))"
    )
    expected = page.evaluate(f"globalThis.__bench.scenarios.{scenario}(0)")
    assert page.evaluate("globalThis.__bench.keys()") == expected
    page.evaluate("globalThis.__bench.set(globalThis.__bench.base)")
    times = []
    for run in range(runs):
        times.append(
            page.evaluate(
                f"globalThis.__bench.time(globalThis.__bench.scenarios.{scenario}({run}))"
            )
        )
        page.evaluate("globalThis.__bench.set(globalThis.__bench.base)")
    return {
        "rowMoves": counts["rowMoves"],
        "nodeMoves": counts["nodeMoves"],
        "medianMs": round(statistics.median(times), 2),
        "minMs": round(min(times), 2),
    }


def main() -> None:
    results: dict[str, dict] = {}
    with serve_project() as origin, sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page()
        errors: list[str] = []
        page.on("pageerror", lambda error: errors.append(str(error)))
        mount_bench(page, origin, ROWS)
        nodes = page.evaluate(
            """() => {
                const row = document.querySelector('#bench-list > li');
                let count = 2; // the row's boundary comments
                const walk = node => { count++; node.childNodes.forEach(walk); };
                walk(row);
                return count;
            }"""
        )
        for mode in ("moveBefore", "fallback"):
            page.evaluate(
                f"globalThis.__bench.fallback({'true' if mode == 'fallback' else 'false'})"
            )
            for scenario in ("drag", "reverse", "shuffle", "append"):
                results[f"{mode}/{scenario}"] = measure(page, scenario, RUNS)
        assert errors == [], errors
        browser.close()
    print(f"keyed bench: {ROWS} rows x {nodes} nodes/row, {RUNS} timed runs")
    print(f"{'mode/scenario':<22}{'row moves':>10}{'node moves':>12}{'median ms':>11}{'min ms':>9}")
    for name, value in results.items():
        print(
            f"{name:<22}{value['rowMoves']:>10}{value['nodeMoves']:>12}"
            f"{value['medianMs']:>11}{value['minMs']:>9}"
        )
    if os.environ.get("KOKAINE_BENCH_JSON"):
        Path(os.environ["KOKAINE_BENCH_JSON"]).write_text(json.dumps(results, indent=2))


if __name__ == "__main__":
    main()
