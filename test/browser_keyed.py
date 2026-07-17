"""Keyed example smoke and reconciliation contract tests."""

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
        page.add_init_script(
            """
            globalThis.__kokaineClosedLifecycleEvents = [];
            globalThis.__kokaineRecordClosedLifecycleEvents = false;
            if (!customElements.get('x-kokaine-closed-lifecycle')) {
                customElements.define(
                    'x-kokaine-closed-lifecycle',
                    class extends HTMLElement {
                        connectedCallback() {
                            if (
                                globalThis
                                    .__kokaineRecordClosedLifecycleEvents
                            ) {
                                globalThis.__kokaineClosedLifecycleEvents
                                    .push('connect');
                            }
                        }

                        disconnectedCallback() {
                            if (
                                globalThis
                                    .__kokaineRecordClosedLifecycleEvents
                            ) {
                                globalThis.__kokaineClosedLifecycleEvents
                                    .push('disconnect');
                            }
                        }

                        connectedMoveCallback() {
                            if (
                                globalThis
                                    .__kokaineRecordClosedLifecycleEvents
                            ) {
                                globalThis.__kokaineClosedLifecycleEvents
                                    .push('move');
                            }
                        }
                    }
                );
            }
            const preexistingClosedHost = document.createElement('div');
            preexistingClosedHost.id =
                'keyed-preexisting-closed-lifecycle';
            preexistingClosedHost.attachShadow({ mode: 'closed' }).append(
                document.createElement('x-kokaine-closed-lifecycle')
            );
            globalThis.__kokainePreexistingClosedLifecycleHost =
                preexistingClosedHost;
            """
        )
        page_errors: list[str] = []
        console_errors: list[str] = []
        response_errors: list[str] = []
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        page.on(
            "response",
            lambda response: response_errors.append(
                f"{response.status} {response.url}"
            )
            if response.status >= 400
            else None,
        )

        example_response = page.goto(f"{origin}/examples/keyed/")
        assert example_response is not None and example_response.ok
        page.wait_for_load_state("networkidle")

        rows = page.locator("#keyed-list > .specimen-row")
        expect(rows).to_have_count(3)
        row_seventeen = rows.filter(has_text="STABLE KEY / 17")
        expect(row_seventeen).to_have_count(1)
        row_handle = row_seventeen.element_handle()
        input_handle = row_seventeen.locator("input").element_handle()
        assert row_handle is not None
        assert input_handle is not None

        row_seventeen.locator("input").fill("retained-note")
        page.locator("#keyed-reverse").click()
        expect(page.locator(".specimen-row h2")).to_have_text(
            ["DOM range", "Structural owner", "Continuation"]
        )
        assert row_handle.evaluate(
            "node => node === document.querySelector('.specimen-row:last-child')"
        )
        assert input_handle.evaluate("node => node.value") == "retained-note"

        page.locator("#keyed-clear").click()
        expect(page.locator("#keyed-empty")).to_be_visible()
        expect(page.locator("#keyed-list")).to_have_count(0)
        page.locator("#keyed-reset").click()
        expect(page.locator("#keyed-list > .specimen-row")).to_have_count(3)

        counter_response = page.goto(f"{origin}/examples/counter/")
        assert counter_response is not None and counter_response.ok
        page.wait_for_load_state("networkidle")
        page.evaluate(
            """() => {
                for (const id of [
                    'keyed-main-root',
                    'keyed-duplicate-root',
                    'keyed-move-root',
                    'keyed-bootstrap-root',
                    'keyed-bootstrap-order-root',
                    'keyed-dispose-stress-root',
                    'keyed-rollback-stress-root'
                ]) {
                    const host = document.createElement('div');
                    host.id = id;
                    document.body.append(host);
                }
                const iframe = document.createElement('iframe');
                iframe.id = 'keyed-iframe';
                document.body.append(iframe);
                globalThis.__kokaineThrowKeyedBootstrap = true;
                globalThis.__kokaineEscapeKeyedDescendant = false;
                globalThis.__kokaineRetireKeyedMoveResult = null;
                globalThis.__kokaineUnmovableEvents = [];
                globalThis.__kokaineRecordUnmovableEvents = false;
                globalThis.__kokaineClosedLifecycleEvents = [];
                globalThis.__kokaineRecordClosedLifecycleEvents = false;
                globalThis.__kokaineKeyedBootstrapOrder = [];
                globalThis.__kokaineKeyedConnections = [];
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
                                const row = this.closest('li[data-key]');
                                if (row) {
                                    globalThis.__kokaineKeyedConnections.push(
                                        {
                                            list: row.parentElement.id,
                                            key: row.dataset.key,
                                            text: row.textContent,
                                            order: Array.from(
                                                row.parentElement.children
                                            ).map(node => node.dataset.key)
                                        }
                                    );
                                }
                            }
                        }
                    );
                }
                if (!customElements.get('x-kokaine-keyed-unmovable')) {
                    const UnmovableElement = class extends HTMLElement {
                        connectedCallback() {
                            if (globalThis.__kokaineRecordUnmovableEvents) {
                                globalThis.__kokaineUnmovableEvents.push(
                                    'connect'
                                );
                            }
                        }

                        disconnectedCallback() {
                            if (globalThis.__kokaineRecordUnmovableEvents) {
                                globalThis.__kokaineUnmovableEvents.push(
                                    'disconnect'
                                );
                            }
                        }
                    };
                    customElements.define(
                        'x-kokaine-keyed-unmovable',
                        UnmovableElement
                    );
                    UnmovableElement.prototype.connectedMoveCallback = () => {
                        globalThis.__kokaineUnmovableEvents.push('move');
                    };
                }
                globalThis.__createKokaineShadowInput = () => {
                    const host = document.createElement('div');
                    const input = document.createElement('input');
                    input.value = 'shadow-selection';
                    host.attachShadow({ mode: 'open' }).append(input);
                    return host;
                };
                globalThis.__createKokaineShadowEditor = () => {
                    const host = document.createElement('div');
                    const editor = document.createElement('strong');
                    editor.contentEditable = 'true';
                    editor.textContent = 'abcdef';
                    host.attachShadow({ mode: 'open' }).append(editor);
                    return host;
                };
                if (!customElements.get('x-kokaine-keyed-bootstrap-order')) {
                    customElements.define(
                        'x-kokaine-keyed-bootstrap-order',
                        class extends HTMLElement {
                            connectedCallback() {
                                globalThis.__kokaineKeyedBootstrapOrder.push(
                                    `connect:${this.dataset.key}`
                                );
                            }

                            set probe(value) {
                                globalThis.__kokaineKeyedBootstrapOrder.push(
                                    `apply:${this.dataset.key}:${value}`
                                );
                            }
                        }
                    );
                }
                if (!customElements.get('x-kokaine-keyed-escape')) {
                    customElements.define(
                        'x-kokaine-keyed-escape',
                        class extends HTMLElement {
                            disconnectedCallback() {
                                if (!globalThis.__kokaineEscapeKeyedDescendant) {
                                    return;
                                }
                                globalThis.__kokaineEscapeKeyedDescendant = false;
                                const parent = document.querySelector(
                                    '#keyed-main-list'
                                );
                                const boundary = Array.from(
                                    parent.childNodes
                                ).findLast(
                                    node => node.nodeType === Node.COMMENT_NODE &&
                                        node.data === '/kokaine:for'
                                );
                                Node.prototype.insertBefore.call(
                                    parent,
                                    this,
                                    boundary
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
        page.evaluate(
            """() => {
                const probe = document.createElement('x-kokaine-keyed-escape');
                probe.id = 'keyed-escaped-descendant';
                document.querySelector('#keyed-row-3').append(probe);
                globalThis.__kokaineEscapeKeyedDescendant = true;
            }"""
        )
        assert invoke(page, "deleteMiddle") is True
        expect(page.locator("#keyed-escaped-descendant")).to_have_count(0)
        assert order(page, "#keyed-main-list") == [0, 1, 5, 2, 4]
        assert not row_three.evaluate("node => node.isConnected")
        assert invoke(page, "readCleanups") == 2
        assert invoke(page, "pulse") is True
        assert invoke(page, "readRuns") == 2
        assert invoke(page, "readCleanups") == 2

        page.evaluate(
            """() => {
                const parent = document.querySelector('#keyed-main-list');
                Object.defineProperty(parent, 'moveBefore', {
                    configurable: true,
                    value: undefined
                });
                const host = globalThis.__createKokaineShadowInput();
                host.id = 'keyed-shadow-focus';
                document.querySelector('#keyed-row-2').append(host);
                const input = host.shadowRoot.querySelector('input');
                input.focus();
                input.setSelectionRange(1, 5, 'backward');
            }"""
        )
        assert invoke(page, "reverse") is True
        assert order(page, "#keyed-main-list") == [4, 2, 5, 1, 0]
        assert_indices(page, [4, 2, 5, 1, 0])
        assert page.locator("#keyed-shadow-focus").evaluate(
            """host => {
                const input = host.shadowRoot.querySelector('input');
                return host.shadowRoot.activeElement === input &&
                    input.selectionStart === 1 &&
                    input.selectionEnd === 5 &&
                    input.selectionDirection === 'backward';
            }"""
        ), "fallback keyed move lost shadow input focus or selection"
        page.evaluate(
            """() => {
                const host = globalThis.__createKokaineShadowEditor();
                host.id = 'keyed-contenteditable-focus';
                document.querySelector('#keyed-row-2').append(host);
                const editor = host.shadowRoot.querySelector('strong');
                editor.focus();
                const text = editor.firstChild;
                host.shadowRoot.getSelection().setBaseAndExtent(
                    text,
                    4,
                    text,
                    2
                );
            }"""
        )
        assert invoke(page, "permute") is True
        assert order(page, "#keyed-main-list") == [2, 0, 4, 1, 5]
        assert_indices(page, [2, 0, 4, 1, 5])
        assert page.locator("#keyed-contenteditable-focus").evaluate(
            """host => {
                const editor = host.shadowRoot.querySelector('strong');
                const selection = host.shadowRoot.getSelection();
                return host.shadowRoot.activeElement === editor &&
                    selection.anchorNode === editor.firstChild &&
                    selection.anchorOffset === 4 &&
                    selection.focusNode === editor.firstChild &&
                    selection.focusOffset === 2;
            }"""
        ), "fallback keyed move lost contenteditable selection"
        page.evaluate(
            """() => {
                const host = document.createElement('div');
                const input = document.createElement('input');
                host.id = 'keyed-closed-shadow-focus';
                host.attachShadow({ mode: 'closed' }).append(input);
                document.querySelector('#keyed-row-4').append(host);
                globalThis.__kokaineClosedShadowInput = input;
                input.focus();
            }"""
        )
        assert page.evaluate(
            """() => {
                const host = document.querySelector(
                    '#keyed-closed-shadow-focus'
                );
                const parent = document.querySelector('#keyed-main-list');
                return typeof parent.moveBefore === 'undefined' &&
                    document.activeElement === host &&
                    host.shadowRoot === null &&
                    globalThis.__kokaineClosedShadowInput.matches(':focus');
            }"""
        ), "closed-shadow fallback precondition was not established"
        assert invoke(page, "reverse") is False
        closed_shadow_order = order(page, "#keyed-main-list")
        assert closed_shadow_order == [2, 0, 4, 1, 5], closed_shadow_order
        assert page.evaluate(
            "globalThis.__kokaineClosedShadowInput.matches(':focus')"
        ), "an unsafe closed-shadow fallback move mutated the DOM"
        page.locator("#keyed-closed-shadow-focus").evaluate(
            "host => host.remove()"
        )
        assert invoke(page, "permute") is True
        assert order(page, "#keyed-main-list") == [2, 0, 4, 1, 5]
        page.evaluate(
            """() => {
                const host = globalThis.__createKokaineShadowEditor();
                host.id = 'keyed-unsupported-shadow-selection';
                document.querySelector('#keyed-row-4').append(host);
                const root = host.shadowRoot;
                const editor = root.querySelector('strong');
                editor.focus();
                root.getSelection().setBaseAndExtent(
                    editor.firstChild,
                    1,
                    editor.firstChild,
                    5
                );
                Object.defineProperty(root, 'getSelection', {
                    configurable: true,
                    value: undefined
                });
            }"""
        )
        assert page.evaluate(
            """() => {
                const host = document.querySelector(
                    '#keyed-unsupported-shadow-selection'
                );
                const root = host.shadowRoot;
                return typeof document.querySelector(
                        '#keyed-main-list'
                    ).moveBefore === 'undefined' &&
                    document.activeElement === host &&
                    root.activeElement === root.querySelector('strong') &&
                    root.querySelector('strong').getRootNode() === root &&
                    root.querySelector('strong').selectionStart === undefined &&
                    root.host === host &&
                    typeof root.getSelection === 'undefined';
            }"""
        ), "unsupported shadow-selection precondition was not established"
        assert invoke(page, "reverse") is False
        unsupported_selection_order = order(page, "#keyed-main-list")
        assert unsupported_selection_order == [2, 0, 4, 1, 5], (
            unsupported_selection_order
        )
        assert page.locator("#keyed-unsupported-shadow-selection").evaluate(
            "host => host.shadowRoot.activeElement === "
            "host.shadowRoot.querySelector('strong')"
        ), "an unsupported shadow-selection move mutated the DOM"
        page.locator("#keyed-unsupported-shadow-selection").evaluate(
            "host => host.remove()"
        )
        assert invoke(page, "permute") is True
        assert order(page, "#keyed-main-list") == [2, 0, 4, 1, 5]
        page.evaluate(
            """() => {
                delete document.querySelector('#keyed-main-list').moveBefore;
                document.querySelector('#keyed-shadow-focus').remove();
                document.querySelector('#keyed-contenteditable-focus').remove();
            }"""
        )
        assert_same(row_two, "#keyed-row-2")
        assert_same(input_two, "#keyed-input-2")
        assert input_two.evaluate("node => node.value") == "unfinished draft"

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
        page.evaluate("globalThis.__kokaineKeyedConnections = []")
        assert invoke(page, "duplicate") is False
        assert page.evaluate("globalThis.__kokaineKeyedConnections") == [], (
            "a rejected duplicate-key update connected a draft row"
        )
        assert order(page, "#keyed-duplicate-list") == [1, 2]
        assert_same(duplicate_one, "#keyed-duplicate-row-1")
        assert_same(duplicate_two, "#keyed-duplicate-row-2")
        assert invoke(page, "duplicateReset") is True

        move_one = page.locator("#keyed-move-row-1").element_handle()
        move_two = page.locator("#keyed-move-row-2").element_handle()
        move_three = page.locator("#keyed-move-row-3").element_handle()
        move_raw = page.locator(
            "#keyed-move-row-2 > .keyed-raw-probe"
        ).element_handle()
        assert move_raw is not None
        page.evaluate(
            """() => {
                const prototype = Element.prototype;
                const descriptor = Object.getOwnPropertyDescriptor(
                    prototype,
                    'moveBefore'
                );
                const nativeMove = descriptor.value;
                Object.defineProperty(prototype, 'moveBefore', {
                    ...descriptor,
                    value(node, before) {
                        const result = nativeMove.call(this, node, before);
                        if (++moves === 3) {
                            throw new Error(
                                'forced keyed move commit-then-throw'
                            );
                        }
                        return result;
                    }
                });
                let moves = 0;
                globalThis.__restoreKeyedInsert = () => {
                    Object.defineProperty(
                        prototype,
                        'moveBefore',
                        descriptor
                    );
                };
            }"""
        )
        assert invoke(page, "move") is False
        page.evaluate("globalThis.__restoreKeyedInsert()")
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        assert_same(move_one, "#keyed-move-row-1")
        assert_same(move_two, "#keyed-move-row-2")
        assert_same(move_three, "#keyed-move-row-3")
        assert_same(move_raw, "#keyed-move-row-2 > .keyed-raw-probe")
        assert invoke(page, "moveReset") is True
        page.evaluate(
            """() => {
                const input = document.createElement('input');
                input.id = 'keyed-native-selection-probe';
                input.value = 'native-selection';
                document.querySelector('#keyed-move-row-3').append(input);
                input.focus();
                input.setSelectionRange(1, 5, 'backward');
            }"""
        )
        page.evaluate(
            "() => new Promise(resolve => requestAnimationFrame(resolve))"
        )
        page.evaluate(
            """() => {
                const input = document.querySelector(
                    '#keyed-native-selection-probe'
                );
                const setSelectionRange = input.setSelectionRange;
                globalThis.__kokaineNativeSelectionReplays = 0;
                input.setSelectionRange = function(...args) {
                    globalThis.__kokaineNativeSelectionReplays += 1;
                    return setSelectionRange.apply(this, args);
                };
                globalThis.__removeNativeSelectionProbe = () => {
                    input.setSelectionRange = setSelectionRange;
                    input.remove();
                };
            }"""
        )
        assert invoke(page, "move") is True
        page.evaluate(
            "() => new Promise(resolve => requestAnimationFrame(resolve))"
        )
        assert page.evaluate("globalThis.__kokaineNativeSelectionReplays") == 0, (
            "native keyed move replayed an already-preserved selection"
        )
        assert page.locator("#keyed-native-selection-probe").evaluate(
            """input => document.activeElement === input &&
                input.selectionStart === 1 &&
                input.selectionEnd === 5 &&
                input.selectionDirection === 'backward'"""
        )
        assert order(page, "#keyed-move-list") == [3, 1, 2]
        assert_same(move_one, "#keyed-move-row-1")
        assert_same(move_two, "#keyed-move-row-2")
        assert_same(move_three, "#keyed-move-row-3")
        assert_same(move_raw, "#keyed-move-row-2 > .keyed-raw-probe")

        assert invoke(page, "moveReset") is True
        page.evaluate("globalThis.__removeNativeSelectionProbe()")
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        page.evaluate(
            """() => {
                const parent = document.querySelector('#keyed-move-list');
                Object.defineProperty(parent, 'moveBefore', {
                    configurable: true,
                    value: undefined
                });
                const probe = document.querySelector(
                    '#keyed-move-row-3 > .keyed-raw-probe'
                );
                probe.id = 'keyed-known-shadow-host-focus';
                probe.tabIndex = 0;
                probe.focus();
            }"""
        )
        assert invoke(page, "move") is True
        assert order(page, "#keyed-move-list") == [3, 1, 2]
        assert page.locator("#keyed-known-shadow-host-focus").evaluate(
            "node => document.activeElement === node"
        ), "fallback rejected or lost focus on a known ordinary div"
        page.evaluate(
            """() => {
                const probe = document.querySelector(
                    '#keyed-known-shadow-host-focus'
                );
                probe.removeAttribute('id');
                probe.removeAttribute('tabindex');
                delete document.querySelector('#keyed-move-list').moveBefore;
            }"""
        )
        assert invoke(page, "moveReset") is True
        assert order(page, "#keyed-move-list") == [1, 2, 3]

        iframe_handle = page.locator("#keyed-iframe").element_handle()
        assert iframe_handle is not None
        iframe = iframe_handle.content_frame()
        assert iframe is not None
        iframe.evaluate(
            """() => {
                const parent = document.querySelector('#keyed-iframe-list');
                Object.defineProperty(parent, 'moveBefore', {
                    configurable: true,
                    value: undefined
                });
                const input = document.createElement('input');
                input.id = 'keyed-iframe-focus';
                input.value = 'iframe-selection';
                document.querySelector('#keyed-iframe-row-3').append(input);
                input.focus();
                input.setSelectionRange(1, 4, 'backward');
            }"""
        )
        assert iframe.locator("#keyed-iframe-focus").evaluate(
            "input => document.activeElement === input"
        ), "iframe focus precondition was not established"
        assert invoke(page, "iframeMove") is True
        assert order(iframe, "#keyed-iframe-list") == [3, 1, 2]
        assert iframe.locator("#keyed-iframe-focus").evaluate(
            """input => document.activeElement === input &&
                input.selectionStart === 1 &&
                input.selectionEnd === 4 &&
                input.selectionDirection === 'backward'"""
        ), "fallback keyed move lost foreign-parent focus or selection"
        iframe.evaluate(
            """() => {
                document.querySelector('#keyed-iframe-focus').remove();
                delete document.querySelector('#keyed-iframe-list').moveBefore;
            }"""
        )
        assert invoke(page, "iframeMoveReset") is True
        assert order(iframe, "#keyed-iframe-list") == [1, 2, 3]
        page.evaluate(
            """() => {
                const parent = document.querySelector('#keyed-move-list');
                const nativeInsert = parent.insertBefore;
                const input = document.createElement('input');
                input.id = 'keyed-detached-focus-probe';
                document.querySelector('#keyed-move-row-3').append(input);
                input.focus();
                Object.defineProperty(parent, 'moveBefore', {
                    configurable: true,
                    value: undefined
                });
                let detached = false;
                parent.insertBefore = function detachFocusedNode(child, before) {
                    const result = nativeInsert.call(this, child, before);
                    if (!detached) {
                        detached = true;
                        input.remove();
                    }
                    return result;
                };
                globalThis.__restoreDetachedFocusMove = () => {
                    parent.insertBefore = nativeInsert;
                    delete parent.moveBefore;
                };
            }"""
        )
        assert invoke(page, "move") is False
        page.evaluate("globalThis.__restoreDetachedFocusMove()")
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        assert page.locator("#keyed-detached-focus-probe").count() == 0
        assert invoke(page, "moveReset") is True

        page.evaluate(
            """() => {
                const parent = document.querySelector('#keyed-move-list');
                Object.defineProperty(parent, 'moveBefore', {
                    configurable: true,
                    value: undefined
                });
                const host = document.createElement('div');
                host.id = 'keyed-tracked-closed-lifecycle';
                host.attachShadow({ mode: 'closed' }).append(
                    document.createElement('x-kokaine-closed-lifecycle')
                );
                document.querySelector('#keyed-move-row-3').append(host);
                globalThis.__kokaineClosedLifecycleEvents = [];
                globalThis.__kokaineRecordClosedLifecycleEvents = true;
            }"""
        )
        assert page.locator("#keyed-tracked-closed-lifecycle").evaluate(
            """host => {
                const tracker = globalThis[
                    Symbol.for('kokaine.dom.shadow-roots')
                ];
                return host.shadowRoot === null &&
                    tracker.known.has(host) && tracker.closed.has(host);
            }"""
        ), "post-mount closed-shadow host was not tracked"
        assert invoke(page, "move") is False
        assert page.evaluate("globalThis.__kokaineClosedLifecycleEvents") == [], (
            "a tracked closed shadow root exposed lifecycle callbacks"
        )
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        page.evaluate(
            """() => {
                globalThis.__kokaineRecordClosedLifecycleEvents = false;
                document.querySelector('#keyed-tracked-closed-lifecycle')
                    .remove();
                delete document.querySelector('#keyed-move-list').moveBefore;
            }"""
        )
        assert invoke(page, "moveReset") is True

        page.evaluate(
            """() => {
                const parent = document.querySelector('#keyed-move-list');
                Object.defineProperty(parent, 'moveBefore', {
                    configurable: true,
                    value: undefined
                });
                document.querySelector('#keyed-move-row-3').append(
                    globalThis.__kokainePreexistingClosedLifecycleHost
                );
                globalThis.__kokaineClosedLifecycleEvents = [];
                globalThis.__kokaineRecordClosedLifecycleEvents = true;
            }"""
        )
        assert page.locator(
            "#keyed-preexisting-closed-lifecycle"
        ).evaluate(
            """host => {
                const tracker = globalThis[
                    Symbol.for('kokaine.dom.shadow-roots')
                ];
                return host.shadowRoot === null &&
                    !tracker.known.has(host) && !tracker.closed.has(host);
            }"""
        ), "pre-mount closed-shadow host was accidentally tracked"
        assert invoke(page, "move") is False
        assert page.evaluate("globalThis.__kokaineClosedLifecycleEvents") == [], (
            "a preexisting closed shadow root exposed lifecycle callbacks"
        )
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        page.evaluate(
            """() => {
                globalThis.__kokaineRecordClosedLifecycleEvents = false;
                globalThis.__kokainePreexistingClosedLifecycleHost.remove();
                delete document.querySelector('#keyed-move-list').moveBefore;
            }"""
        )
        assert invoke(page, "moveReset") is True

        page.evaluate(
            """() => {
                const prototype = Element.prototype;
                const descriptor = Object.getOwnPropertyDescriptor(
                    prototype,
                    'attachShadow'
                );
                const trackedAttachShadow = descriptor.value;
                Object.defineProperty(prototype, 'attachShadow', {
                    ...descriptor,
                    value(...args) {
                        return trackedAttachShadow.apply(this, args);
                    }
                });
                globalThis.__restoreKokaineShadowTracker = () => {
                    Object.defineProperty(
                        prototype,
                        'attachShadow',
                        descriptor
                    );
                };
            }"""
        )
        assert invoke(page, "move") is False
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        page.evaluate("globalThis.__restoreKokaineShadowTracker()")
        assert invoke(page, "moveReset") is True

        page.evaluate(
            """() => {
                const parent = document.querySelector('#keyed-move-list');
                Object.defineProperty(parent, 'moveBefore', {
                    configurable: true,
                    value: undefined
                });
                const frame = document.createElement('iframe');
                document.body.append(frame);
                const foreign = frame.contentWindow;
                globalThis.__kokaineForeignLifecycleEvents = [];
                globalThis.__kokaineRecordForeignLifecycleEvents = false;
                foreign.customElements.define(
                    'x-kokaine-foreign-button',
                    class extends foreign.HTMLButtonElement {
                        connectedCallback() {
                            if (
                                globalThis
                                    .__kokaineRecordForeignLifecycleEvents
                            ) {
                                globalThis.__kokaineForeignLifecycleEvents
                                    .push('connect');
                            }
                        }

                        disconnectedCallback() {
                            if (
                                globalThis
                                    .__kokaineRecordForeignLifecycleEvents
                            ) {
                                globalThis.__kokaineForeignLifecycleEvents
                                    .push('disconnect');
                            }
                        }
                    },
                    { extends: 'button' }
                );
                const probe = foreign.document.createElement(
                    'button',
                    { is: 'x-kokaine-foreign-button' }
                );
                probe.id = 'keyed-foreign-lifecycle';
                document.querySelector('#keyed-move-row-3').append(probe);
                globalThis.__kokaineForeignLifecycleFrame = frame;
                globalThis.__kokaineForeignLifecycleEvents = [];
                globalThis.__kokaineRecordForeignLifecycleEvents = true;
            }"""
        )
        assert invoke(page, "move") is False
        assert page.evaluate("globalThis.__kokaineForeignLifecycleEvents") == [], (
            "a foreign-realm customized built-in bypassed lifecycle preflight"
        )
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        page.evaluate(
            """() => {
                globalThis.__kokaineRecordForeignLifecycleEvents = false;
                document.querySelector('#keyed-foreign-lifecycle').remove();
                globalThis.__kokaineForeignLifecycleFrame.remove();
                delete document.querySelector('#keyed-move-list').moveBefore;
            }"""
        )
        assert invoke(page, "moveReset") is True

        customized_attribute = page.evaluate(
            """() => {
                if (!customElements.get('x-kokaine-customized-button')) {
                    customElements.define(
                        'x-kokaine-customized-button',
                        class extends HTMLButtonElement {
                            /* [native code] is ordinary user source here. */
                            connectedCallback() {
                                if (
                                    globalThis
                                        .__kokaineRecordCustomizedEvents
                                ) {
                                    globalThis.__kokaineCustomizedEvents
                                        .push('connect');
                                }
                            }

                            disconnectedCallback() {
                                if (
                                    globalThis
                                        .__kokaineRecordCustomizedEvents
                                ) {
                                    globalThis.__kokaineCustomizedEvents
                                        .push('disconnect');
                                }
                            }
                        },
                        { extends: 'button' }
                    );
                }
                const parent = document.querySelector('#keyed-move-list');
                Object.defineProperty(parent, 'moveBefore', {
                    configurable: true,
                    value: undefined
                });
                const probe = document.createElement(
                    'button',
                    { is: 'x-kokaine-customized-button' }
                );
                Object.setPrototypeOf(
                    probe,
                    HTMLButtonElement.prototype
                );
                probe.id = 'keyed-customized-lifecycle';
                document.querySelector('#keyed-move-row-3').append(probe);
                globalThis.__kokaineCustomizedEvents = [];
                globalThis.__kokaineRecordCustomizedEvents = true;
                return probe.getAttribute('is');
            }"""
        )
        assert customized_attribute is None, (
            "customized built-in precondition unexpectedly became inspectable"
        )
        assert invoke(page, "move") is False
        assert page.evaluate("globalThis.__kokaineCustomizedEvents") == [], (
            "a customized built-in bypassed lifecycle preflight"
        )
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        page.evaluate(
            """() => {
                globalThis.__kokaineRecordCustomizedEvents = false;
                document.querySelector('#keyed-customized-lifecycle').remove();
                delete document.querySelector('#keyed-move-list').moveBefore;
            }"""
        )
        assert invoke(page, "moveReset") is True
        page.evaluate(
            """() => {
                const probe = document.createElement(
                    'x-kokaine-keyed-unmovable'
                );
                probe.id = 'keyed-unmovable-probe';
                document.querySelector('#keyed-move-row-3').append(probe);
                globalThis.__kokaineUnmovableEvents = [];
                globalThis.__kokaineRecordUnmovableEvents = true;
            }"""
        )
        assert invoke(page, "move") is False
        assert page.evaluate("globalThis.__kokaineUnmovableEvents") == [], (
            "a late-added move callback bypassed custom-element preflight"
        )
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        page.evaluate(
            """() => {
                globalThis.__kokaineRecordUnmovableEvents = false;
                document.querySelector('#keyed-unmovable-probe').remove();
            }"""
        )
        assert invoke(page, "moveReset") is True

        page.evaluate(
            """() => {
                const prototype = Element.prototype;
                const descriptor = Object.getOwnPropertyDescriptor(
                    prototype,
                    'moveBefore'
                );
                const nativeMove = descriptor.value;
                let injected = false;
                Object.defineProperty(prototype, 'moveBefore', {
                    ...descriptor,
                    value(node, before) {
                        const result = nativeMove.call(this, node, before);
                        if (!injected) {
                            injected = true;
                            const rogue = document.createElement('i');
                            rogue.id = 'keyed-move-rogue';
                            Node.prototype.insertBefore.call(
                                this,
                                rogue,
                                this.firstChild.nextSibling
                            );
                        }
                        return result;
                    }
                });
                globalThis.__restoreKeyedRogueMove = () => {
                    Object.defineProperty(
                        prototype,
                        'moveBefore',
                        descriptor
                    );
                };
            }"""
        )
        assert invoke(page, "move") is False
        page.evaluate("globalThis.__restoreKeyedRogueMove()")
        assert page.locator("#keyed-move-rogue").count() == 1
        assert order(page, "#keyed-move-list") == [1, 2, 3]
        assert_same(move_one, "#keyed-move-row-1")
        assert_same(move_two, "#keyed-move-row-2")
        assert_same(move_three, "#keyed-move-row-3")
        page.locator("#keyed-move-rogue").evaluate("node => node.remove()")
        assert invoke(page, "moveReset") is True
        assert invoke(page, "move") is True
        assert order(page, "#keyed-move-list") == [3, 1, 2]

        assert invoke(page, "moveReset") is True
        page.evaluate(
            """() => {
                const prototype = Element.prototype;
                const descriptor = Object.getOwnPropertyDescriptor(
                    prototype,
                    'moveBefore'
                );
                const nativeMove = descriptor.value;
                let retired = false;
                Object.defineProperty(prototype, 'moveBefore', {
                    ...descriptor,
                    value(node, before) {
                        const result = nativeMove.call(this, node, before);
                        if (!retired) {
                            retired = true;
                            globalThis.__kokaineRetireKeyedMoveResult =
                                globalThis.__kokaineKeyed.retireMove();
                        }
                        return result;
                    }
                });
                globalThis.__restoreKeyedRetireMove = () => {
                    Object.defineProperty(
                        prototype,
                        'moveBefore',
                        descriptor
                    );
                };
            }"""
        )
        assert invoke(page, "move") is False
        page.evaluate("globalThis.__restoreKeyedRetireMove()")
        assert page.evaluate("globalThis.__kokaineRetireKeyedMoveResult") is True
        assert page.locator("#keyed-move-root").evaluate(
            "node => node.childNodes.length"
        ) == 0
        for handle in (move_one, move_two, move_three):
            assert handle.evaluate("node => node.parentNode === null"), (
                "a retired keyed row was resurrected by move rollback"
            )

        assert invoke(page, "bootstrap") is False
        assert page.locator("#keyed-bootstrap-target").count() == 0
        assert page.locator("#keyed-bootstrap-list > *").count() == 0
        page.evaluate("globalThis.__kokaineThrowKeyedBootstrap = false")
        assert invoke(page, "bootstrapReset") is True
        assert invoke(page, "bootstrap") is True
        expect(page.locator("#keyed-bootstrap-target")).to_have_attribute(
            "data-boom", "seven"
        )

        assert invoke(page, "bootstrapOrder") is True
        bootstrap_order = page.evaluate(
            "globalThis.__kokaineKeyedBootstrapOrder"
        )
        assert bootstrap_order == [
            "connect:1",
            "connect:2",
            "apply:1:one",
            "apply:2:two",
        ], f"keyed rows bootstrapped before all drafts were built: {bootstrap_order!r}"

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
                Object.defineProperty(parent, 'moveBefore', {
                    configurable: true,
                    value: undefined
                });
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
                    delete parent.moveBefore;
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
            "#keyed-bootstrap-order-root",
            "#keyed-dispose-stress-root",
            "#keyed-rollback-stress-root",
        ):
            assert page.locator(selector).evaluate(
                "node => node.childNodes.length"
            ) == 0
        assert iframe.evaluate("document.body.childNodes.length") == 0

        assert page_errors == [], f"uncaught browser errors: {page_errors!r}"
        assert console_errors == [], f"console errors: {console_errors!r}"
        assert response_errors == [], f"HTTP resource errors: {response_errors!r}"
        browser.close()
