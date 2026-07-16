"""Browser contract tests for keyed ``For`` reconciliation."""

from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import expect, sync_playwright


PROJECT_ROOT = Path(__file__).resolve().parents[1]


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


def invoke(page, name: str):
    return page.evaluate(f"globalThis.__kokaineKeyed.{name}()")


def order(page, list_selector: str) -> list[int]:
    return page.locator(f"{list_selector} > li").evaluate_all(
        "nodes => nodes.map(node => Number(node.dataset.key))"
    )


def assert_same(handle, selector: str) -> None:
    assert handle.evaluate(
        "(node, selector) => node === document.querySelector(selector)", selector
    ), f"keyed reconciliation replaced {selector}"


def assert_indices(page, expected: list[int]) -> None:
    for index, identity in enumerate(expected):
        expect(
            page.locator(f"#keyed-row-{identity} > .keyed-index")
        ).to_have_text(str(index))


with serve_project() as origin:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page()
        page_errors: list[str] = []
        console_errors: list[str] = []
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )

        page.goto(f"{origin}/examples/counter/")
        page.wait_for_load_state("networkidle")
        page.evaluate(
            """() => {
                for (const id of [
                    'keyed-main-root',
                    'keyed-duplicate-root',
                    'keyed-move-root',
                    'keyed-bootstrap-root',
                    'keyed-dispose-stress-root',
                    'keyed-rollback-stress-root'
                ]) {
                    const host = document.createElement('div');
                    host.id = id;
                    document.body.append(host);
                }
                globalThis.__kokaineThrowKeyedBootstrap = true;
                globalThis.__kokaineInjectKeyedRogue = false;
                if (!customElements.get('x-kokaine-keyed-fail')) {
                    customElements.define(
                        'x-kokaine-keyed-fail',
                        class extends HTMLElement {
                            set boom(value) {
                                if (globalThis.__kokaineThrowKeyedBootstrap) {
                                    throw new Error(
                                        'forced keyed row bootstrap failure'
                                    );
                                }
                                this.dataset.boom = value;
                            }
                        }
                    );
                }
                if (!customElements.get('x-kokaine-keyed-move-hook')) {
                    customElements.define(
                        'x-kokaine-keyed-move-hook',
                        class extends HTMLElement {
                            connectedCallback() {
                                const parent = this.closest('#keyed-move-list');
                                if (!parent || !globalThis.__kokaineInjectKeyedRogue) {
                                    return;
                                }
                                globalThis.__kokaineInjectKeyedRogue = false;
                                const rogue = document.createElement('i');
                                rogue.id = 'keyed-move-rogue';
                                Node.prototype.insertBefore.call(
                                    parent,
                                    rogue,
                                    parent.firstChild.nextSibling
                                );
                            }
                        }
                    );
                }
            }"""
        )
        page.evaluate(
            """async () => {
                await import('/dist/test_dom_dash_keyed__main.mjs');
            }"""
        )

        assert order(page, "#keyed-main-list") == [1, 2, 3]
        assert_indices(page, [1, 2, 3])
        row_two = page.locator("#keyed-row-2").element_handle()
        row_three = page.locator("#keyed-row-3").element_handle()
        input_two = page.locator("#keyed-input-2").element_handle()
        hit_two = page.locator("#keyed-hit-2").element_handle()
        tag_twenty_one = page.locator("#keyed-tag-2-21").element_handle()
        assert all(
            handle is not None
            for handle in (row_two, row_three, input_two, hit_two, tag_twenty_one)
        )

        page.locator("#keyed-hit-2").click()
        assert invoke(page, "readClicks") == 1
        page.locator("#keyed-arm-3").click()
        assert invoke(page, "readRuns") == 1
        assert invoke(page, "readCleanups") == 0
        page.locator("#keyed-input-2").fill("unfinished draft")
        page.locator("#keyed-input-2").evaluate(
            "node => { node.focus(); node.setSelectionRange(2, 8); }"
        )

        assert invoke(page, "prepend") is True
        assert order(page, "#keyed-main-list") == [0, 1, 2, 3]
        assert_indices(page, [0, 1, 2, 3])
        assert_same(row_two, "#keyed-row-2")
        assert_same(row_three, "#keyed-row-3")
        assert_same(input_two, "#keyed-input-2")
        assert_same(hit_two, "#keyed-hit-2")
        assert_same(tag_twenty_one, "#keyed-tag-2-21")
        assert input_two.evaluate("node => node.value") == "unfinished draft"
        assert input_two.evaluate("node => document.activeElement === node")
        assert input_two.evaluate(
            "node => [node.selectionStart, node.selectionEnd]"
        ) == [2, 8]
        hit_two.click()
        assert invoke(page, "readClicks") == 2

        assert invoke(page, "pulse") is True
        assert invoke(page, "readRuns") == 2
        assert invoke(page, "readCleanups") == 1

        assert invoke(page, "append") is True
        assert order(page, "#keyed-main-list") == [0, 1, 2, 3, 4]
        assert invoke(page, "insertMiddle") is True
        assert order(page, "#keyed-main-list") == [0, 1, 5, 2, 3, 4]
        assert invoke(page, "deleteMiddle") is True
        assert order(page, "#keyed-main-list") == [0, 1, 5, 2, 4]
        assert not row_three.evaluate("node => node.isConnected")
        assert invoke(page, "readCleanups") == 2
        assert invoke(page, "pulse") is True
        assert invoke(page, "readRuns") == 2
        assert invoke(page, "readCleanups") == 2

        input_two.evaluate(
            "node => { node.focus(); node.setSelectionRange(3, 9); }"
        )
        assert invoke(page, "reverse") is True
        assert order(page, "#keyed-main-list") == [4, 2, 5, 1, 0]
        assert_indices(page, [4, 2, 5, 1, 0])
        assert input_two.evaluate("node => document.activeElement === node")
        assert input_two.evaluate(
            "node => [node.selectionStart, node.selectionEnd]"
        ) == [3, 9]
        assert invoke(page, "permute") is True
        assert order(page, "#keyed-main-list") == [2, 0, 4, 1, 5]
        assert_indices(page, [2, 0, 4, 1, 5])
        assert_same(row_two, "#keyed-row-2")
        assert_same(input_two, "#keyed-input-2")
        assert input_two.evaluate("node => node.value") == "unfinished draft"
        assert input_two.evaluate("node => document.activeElement === node")

        assert invoke(page, "toggleMode") is True
        expect(page.locator("#keyed-row-2 .keyed-mode")).to_have_text("compact")
        assert_same(row_two, "#keyed-row-2")
        assert_same(input_two, "#keyed-input-2")

        assert invoke(page, "updateItem") is True
        assert order(page, "#keyed-main-list") == [2, 0, 4, 1, 5]
        expect(page.locator("#keyed-row-2 > .keyed-label")).to_have_text("BETA")
        assert page.locator("#keyed-row-2 .keyed-tags > li").evaluate_all(
            "nodes => nodes.map(node => Number(node.dataset.tag))"
        ) == [22, 21, 23]
        expect(page.locator("#keyed-tag-2-21")).to_have_text("1:RED")
        assert_same(row_two, "#keyed-row-2")
        assert_same(input_two, "#keyed-input-2")
        assert_same(tag_twenty_one, "#keyed-tag-2-21")
        assert input_two.evaluate("node => node.value") == "unfinished draft"

        page.locator("#keyed-arm-2").click()
        assert invoke(page, "readRuns") == 3
        assert invoke(page, "hide") is True
        expect(page.locator("#keyed-hidden")).to_have_text("hidden")
        assert page.locator("#keyed-main-list").count() == 0
        assert invoke(page, "readCleanups") == 3
        assert invoke(page, "pulse") is True
        assert invoke(page, "readRuns") == 3
        assert invoke(page, "show") is True
        assert order(page, "#keyed-main-list") == [2, 0, 4, 1, 5]
        assert not row_two.evaluate(
            "node => node === document.querySelector('#keyed-row-2')"
        )

        duplicate_one = page.locator(
            "#keyed-duplicate-row-1"
        ).element_handle()
        duplicate_two = page.locator(
            "#keyed-duplicate-row-2"
        ).element_handle()
        assert order(page, "#keyed-duplicate-list") == [1, 2]
        assert invoke(page, "duplicate") is False
        assert order(page, "#keyed-duplicate-list") == [1, 2]
        assert_same(duplicate_one, "#keyed-duplicate-row-1")
        assert_same(duplicate_two, "#keyed-duplicate-row-2")
        assert invoke(page, "duplicateReset") is True

        move_one = page.locator("#keyed-move-row-1").element_handle()
        move_two = page.locator("#keyed-move-row-2").element_handle()
        move_three = page.locator("#keyed-move-row-3").element_handle()
        page.evaluate(
            """() => {
                const parent = document.querySelector('#keyed-move-list');
                const nativeInsert = parent.insertBefore;
                let failed = false;
                parent.insertBefore = function insertThenThrow(child, before) {
                    const result = nativeInsert.call(this, child, before);
                    if (!failed && child.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                        failed = true;
                        throw new Error('forced keyed move commit-then-throw');
                    }
                    return result;
                };
                globalThis.__restoreKeyedInsert = () => {
                    parent.insertBefore = nativeInsert;
                };
            }"""
        )
        assert invoke(page, "move") is False
        page.evaluate("globalThis.__restoreKeyedInsert()")
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        assert_same(move_one, "#keyed-move-row-1")
        assert_same(move_two, "#keyed-move-row-2")
        assert_same(move_three, "#keyed-move-row-3")
        assert invoke(page, "moveReset") is True
        assert invoke(page, "move") is True
        assert order(page, "#keyed-move-list") == [3, 1, 2]
        assert_same(move_one, "#keyed-move-row-1")
        assert_same(move_two, "#keyed-move-row-2")
        assert_same(move_three, "#keyed-move-row-3")

        assert invoke(page, "moveReset") is True
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        page.evaluate("globalThis.__kokaineInjectKeyedRogue = true")
        assert invoke(page, "move") is False
        assert page.locator("#keyed-move-rogue").count() == 1
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        assert_same(move_one, "#keyed-move-row-1")
        assert_same(move_two, "#keyed-move-row-2")
        assert_same(move_three, "#keyed-move-row-3")
        page.locator("#keyed-move-rogue").evaluate("node => node.remove()")
        assert invoke(page, "moveReset") is True
        assert invoke(page, "move") is True
        assert order(page, "#keyed-move-list") == [3, 1, 2]

        assert invoke(page, "bootstrap") is False
        assert page.locator("#keyed-bootstrap-target").count() == 0
        assert page.locator("#keyed-bootstrap-list > *").count() == 0
        page.evaluate("globalThis.__kokaineThrowKeyedBootstrap = false")
        assert invoke(page, "bootstrapReset") is True
        assert invoke(page, "bootstrap") is True
        expect(page.locator("#keyed-bootstrap-target")).to_have_attribute(
            "data-boom", "seven"
        )

        compaction = page.evaluate(
            """() => {
                try {
                    return {
                        value: globalThis.__kokaineKeyed.compactLedger(),
                        error: null
                    };
                } catch (error) {
                    return {
                        value: null,
                        error: `${error.name}: ${error.message}`
                    };
                }
            }"""
        )
        assert compaction == {
            "value": True,
            "error": None,
        }, f"structural ledger compaction was not stack-safe: {compaction!r}"

        assert invoke(page, "bulkRetirement") is True

        disposal = page.evaluate(
            """() => {
                try {
                    return {
                        value: globalThis.__kokaineKeyed.disposeStress(),
                        error: null
                    };
                } catch (error) {
                    return {
                        value: null,
                        error: `${error.name}: ${error.message}`
                    };
                }
            }"""
        )
        assert disposal == {
            "value": True,
            "error": None,
        }, f"bulk keyed disposal was not stack-safe: {disposal!r}"
        expect(page.locator("#keyed-dispose-stress-list > li")).to_have_count(0)

        rollback_list = "#keyed-rollback-stress-list"
        rollback_order = order(page, rollback_list)
        assert len(rollback_order) == 4096
        rollback_first = page.locator(
            f"#keyed-rollback-stress-row-{rollback_order[0]}"
        ).element_handle()
        rollback_middle = page.locator(
            f"#keyed-rollback-stress-row-{rollback_order[2048]}"
        ).element_handle()
        rollback_last = page.locator(
            f"#keyed-rollback-stress-row-{rollback_order[-1]}"
        ).element_handle()
        assert all(
            handle is not None
            for handle in (rollback_first, rollback_middle, rollback_last)
        )
        page.evaluate(
            """() => {
                const parent = document.querySelector(
                    '#keyed-rollback-stress-list'
                );
                const nativeInsert = parent.insertBefore;
                let moves = 0;
                parent.insertBefore = function insertThenThrow(child, before) {
                    const result = nativeInsert.call(this, child, before);
                    if (
                        child.nodeType === Node.DOCUMENT_FRAGMENT_NODE &&
                        ++moves === 64
                    ) {
                        throw new Error('forced keyed stress move');
                    }
                    return result;
                };
                globalThis.__restoreKeyedStressInsert = () => {
                    parent.insertBefore = nativeInsert;
                };
            }"""
        )
        rollback = page.evaluate(
            """() => {
                try {
                    return {
                        value: globalThis.__kokaineKeyed.rollbackStress(),
                        error: null
                    };
                } catch (error) {
                    return {
                        value: null,
                        error: `${error.name}: ${error.message}`
                    };
                }
            }"""
        )
        page.evaluate("globalThis.__restoreKeyedStressInsert()")
        assert rollback == {
            "value": False,
            "error": None,
        }, f"bulk keyed rollback was not stack-safe: {rollback!r}"
        assert order(page, rollback_list) == rollback_order
        assert_same(
            rollback_first,
            f"#keyed-rollback-stress-row-{rollback_order[0]}",
        )
        assert_same(
            rollback_middle,
            f"#keyed-rollback-stress-row-{rollback_order[2048]}",
        )
        assert_same(
            rollback_last,
            f"#keyed-rollback-stress-row-{rollback_order[-1]}",
        )
        assert invoke(page, "rollbackStressReset") is True

        invoke(page, "dispose")
        for selector in (
            "#keyed-main-root",
            "#keyed-duplicate-root",
            "#keyed-move-root",
            "#keyed-bootstrap-root",
            "#keyed-dispose-stress-root",
            "#keyed-rollback-stress-root",
        ):
            assert page.locator(selector).evaluate(
                "node => node.childNodes.length"
            ) == 0

        assert page_errors == [], f"uncaught browser errors: {page_errors!r}"
        assert console_errors == [], f"console errors: {console_errors!r}"
        browser.close()
