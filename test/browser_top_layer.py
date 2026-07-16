"""Browser acceptance checks for native dialog and Popover top-layer APIs."""

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


def assert_ok(result: str) -> None:
    assert result == "ok", f"top-layer command failed: {result}"


def assert_error(result: str, *fragments: str) -> None:
    lowered = result.lower()
    assert lowered.startswith("error:"), f"expected a translated error, got {result!r}"
    for fragment in fragments:
        assert fragment.lower() in lowered, (
            f"translated error {result!r} did not mention {fragment!r}"
        )


with serve_project() as origin:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page_errors: list[str] = []
        console_errors: list[str] = []

        example = browser.new_page(viewport={"width": 1280, "height": 900})
        example.on("pageerror", lambda error: page_errors.append(str(error)))
        example.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        example.goto(f"{origin}/examples/top-layer/")
        example.wait_for_load_state("networkidle")

        dialog = example.locator("#settings-dialog")
        popover = example.locator("#help-popover")
        expect(dialog).to_have_attribute("closedby", "closerequest")
        expect(popover).to_have_attribute("popover", "auto")
        expect(example.locator("#open-help-popover")).to_have_attribute(
            "popovertarget", "help-popover"
        )
        expect(example.locator("#open-help-popover")).to_have_attribute(
            "popovertargetaction", "show"
        )
        expect(example.locator("#toggle-help-popover")).to_have_attribute(
            "popovertargetaction", "toggle"
        )
        expect(example.locator("#close-help-popover")).to_have_attribute(
            "popovertargetaction", "hide"
        )
        assert dialog.evaluate("node => node instanceof HTMLDialogElement")

        has_closed_by = example.evaluate(
            "'closedBy' in HTMLDialogElement.prototype"
        )
        if has_closed_by:
            assert dialog.evaluate("node => node.closedBy") == "closerequest"

        has_popover = example.evaluate(
            "'showPopover' in HTMLElement.prototype && "
            "CSS.supports('selector(:popover-open)')"
        )
        assert has_popover, "Playwright Chromium does not expose the core Popover API"

        example.locator("#open-help-popover").click()
        assert popover.evaluate("node => node.matches(':popover-open')")
        expect(example.locator("#popover-state")).to_have_text("OPEN")

        example.locator("#close-help-popover").click()
        assert not popover.evaluate("node => node.matches(':popover-open')")
        expect(example.locator("#popover-state")).to_have_text("CLOSED")

        example.locator("#toggle-help-popover").click()
        assert popover.evaluate("node => node.matches(':popover-open')")
        example.locator("#toggle-help-popover").focus()
        example.keyboard.press("Enter")
        assert not popover.evaluate("node => node.matches(':popover-open')")

        # Auto popovers use the browser's light-dismiss behavior.
        example.locator("#open-help-popover").click()
        example.locator(".masthead").click(position={"x": 4, "y": 4})
        assert not popover.evaluate("node => node.matches(':popover-open')")
        expect(example.locator("#popover-state")).to_have_text("CLOSED")

        original_url = example.url
        example.locator("#open-settings-dialog").click()
        assert dialog.evaluate("node => node.open && node.matches(':modal')")
        assert example.evaluate("document.activeElement.id") == "save-dialog"
        assert dialog.evaluate(
            "node => getComputedStyle(node, '::backdrop').backgroundColor"
        ) not in {"transparent", "rgba(0, 0, 0, 0)"}
        expect(example.locator("#dialog-state")).to_have_text("MODAL")

        # A cancel handler can keep the native modal open.
        example.locator("#keep-dialog-open").check()
        example.keyboard.press("Escape")
        assert dialog.evaluate("node => node.open && node.matches(':modal')")
        expect(example.locator("#dialog-cancel-count")).to_have_text("1")

        example.locator("#keep-dialog-open").uncheck()
        example.keyboard.press("Escape")
        assert not dialog.evaluate("node => node.open")
        expect(example.locator("#dialog-state")).to_have_text("CLOSED")
        expect(example.locator("#dialog-cancel-count")).to_have_text("2")

        # method="dialog" closes natively, does not navigate, and records the
        # activated submit button's value through the event adapter.
        example.locator("#open-settings-dialog").click()
        example.locator("#save-dialog").click()
        assert not dialog.evaluate("node => node.open")
        expect(example.locator("#dialog-result")).to_have_text("SAVE")
        assert example.url == original_url

        fixture = browser.new_page(viewport={"width": 1000, "height": 760})
        fixture.on("pageerror", lambda error: page_errors.append(str(error)))
        fixture.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        fixture.goto(f"{origin}/test/browser_top_layer.html")
        fixture.wait_for_function("globalThis.__kokaineTopLayer !== undefined")

        controls = "globalThis.__kokaineTopLayer"
        command_dialog = fixture.locator("#fixture-dialog")

        assert_ok(fixture.evaluate(f"{controls}.dialog.show()"))
        assert fixture.evaluate(f"{controls}.dialog.isOpen()")
        assert not fixture.evaluate(f"{controls}.dialog.isModal()")
        assert command_dialog.evaluate("node => node.open && !node.matches(':modal')")
        wrong_modal_state = fixture.evaluate(f"{controls}.dialog.showModal()")
        assert_error(wrong_modal_state, "browser dom exception", "non-modal")
        assert_ok(fixture.evaluate(f"{controls}.dialog.close('non-modal')"))
        assert fixture.evaluate(f"{controls}.dialog.returnValue()") == "non-modal"

        assert_ok(fixture.evaluate(f"{controls}.dialog.showModal()"))
        assert fixture.evaluate(f"{controls}.dialog.isOpen()")
        assert fixture.evaluate(f"{controls}.dialog.isModal()")
        assert command_dialog.evaluate("node => node.matches(':modal')")
        wrong_non_modal_state = fixture.evaluate(f"{controls}.dialog.show()")
        assert_error(wrong_non_modal_state, "browser dom exception", "modal")
        assert_ok(fixture.evaluate(f"{controls}.dialog.close('modal')"))

        has_request_close = fixture.evaluate(
            "typeof HTMLDialogElement.prototype.requestClose === 'function'"
        )
        if has_request_close:
            assert_ok(
                fixture.evaluate(f"{controls}.dialog.setCancelBlocked(true)")
            )
            assert_ok(fixture.evaluate(f"{controls}.dialog.showModal()"))
            assert_ok(
                fixture.evaluate(f"{controls}.dialog.requestClose('blocked')")
            )
            assert fixture.evaluate(f"{controls}.dialog.isOpen()"), (
                "preventDefault in the Koka cancel handler did not block requestClose"
            )
            assert_ok(
                fixture.evaluate(f"{controls}.dialog.setCancelBlocked(false)")
            )
            assert_ok(
                fixture.evaluate(f"{controls}.dialog.requestClose('requested')")
            )
            assert not fixture.evaluate(f"{controls}.dialog.isOpen()")
            assert fixture.evaluate(f"{controls}.dialog.returnValue()") == "requested"

            # Removing the host method models an older browser. The adapter
            # must report unsupported requestClose instead of falling back to
            # close(), which has different cancel semantics.
            assert_ok(fixture.evaluate(f"{controls}.dialog.showModal()"))
            unsupported = fixture.evaluate(
                f"""() => {{
                    const proto = HTMLDialogElement.prototype;
                    const descriptor = Object.getOwnPropertyDescriptor(
                        proto, 'requestClose'
                    );
                    Object.defineProperty(proto, 'requestClose', {{
                        configurable: true,
                        value: undefined
                    }});
                    try {{
                        return {controls}.dialog.requestClose('unsupported');
                    }} finally {{
                        Object.defineProperty(proto, 'requestClose', descriptor);
                    }}
                }}"""
            )
            assert_error(unsupported, "requestclose", "support")
            assert command_dialog.evaluate("node => node.open")
            assert_ok(fixture.evaluate(f"{controls}.dialog.close('cleanup')"))
        else:
            assert_ok(fixture.evaluate(f"{controls}.dialog.showModal()"))
            unsupported = fixture.evaluate(
                f"{controls}.dialog.requestClose('unsupported')"
            )
            assert_error(unsupported, "requestclose", "support")
            assert command_dialog.evaluate("node => node.open")
            assert_ok(fixture.evaluate(f"{controls}.dialog.close('cleanup')"))

        assert_error(
            fixture.evaluate(f"{controls}.dialog.wrongTarget()"), "dialog"
        )
        assert_error(
            fixture.evaluate(f"{controls}.dialog.detachedModal()"),
            "browser dom exception",
        )
        assert_error(
            fixture.evaluate(f"{controls}.dialog.invalidEvent()"),
            "currenttarget",
        )

        manual = fixture.locator("#fixture-manual-popover")
        assert not fixture.evaluate(f"{controls}.popover.beforeState()")
        assert_ok(fixture.evaluate(f"{controls}.popover.showManual()"))
        assert fixture.evaluate(f"{controls}.popover.beforeState()"), (
            "toggle/state did not read beforetoggle.newState='open'"
        )
        assert fixture.evaluate(f"{controls}.popover.isManualOpen()")
        fixture.locator("#fixture-outside").click()
        assert manual.evaluate("node => node.matches(':popover-open')"), (
            "a manual popover was light-dismissed"
        )
        assert_ok(fixture.evaluate(f"{controls}.popover.hideManual()"))
        assert not fixture.evaluate(f"{controls}.popover.beforeState()"), (
            "toggle/state did not read beforetoggle.newState='closed'"
        )

        # Older Popover implementations returned undefined from
        # togglePopover(). The Koka adapter must still inspect :popover-open.
        legacy_toggle = fixture.evaluate(
            f"""() => {{
                const target = document.querySelector('#fixture-manual-popover');
                const nativeToggle = target.togglePopover;
                target.togglePopover = function(force) {{
                    nativeToggle.call(this, force);
                    return undefined;
                }};
                try {{
                    return {controls}.popover.toggleManual();
                }} finally {{
                    delete target.togglePopover;
                }}
            }}"""
        )
        assert legacy_toggle is True
        assert manual.evaluate("node => node.matches(':popover-open')")
        assert_ok(fixture.evaluate(f"{controls}.popover.hideManual()"))

        # Core Popover implementations predating the force overload ignore the
        # boolean argument and perform an ordinary toggle. set-open must remain
        # idempotent on those engines instead of reversing the requested state.
        ignored_force = fixture.evaluate(
            f"""() => {{
                const target = document.querySelector('#fixture-manual-popover');
                const nativeToggle = target.togglePopover;
                target.togglePopover = function(_force) {{
                    return nativeToggle.call(this);
                }};
                try {{
                    const first = {controls}.popover.setManual(true);
                    const afterFirst = target.matches(':popover-open');
                    const second = {controls}.popover.setManual(true);
                    const afterSecond = target.matches(':popover-open');
                    return {{ first, afterFirst, second, afterSecond }};
                }} finally {{
                    delete target.togglePopover;
                    if (target.matches(':popover-open')) target.hidePopover();
                }}
            }}"""
        )
        assert_ok(ignored_force["first"])
        assert ignored_force["afterFirst"]
        assert_ok(ignored_force["second"])
        assert ignored_force["afterSecond"], (
            "set-open toggled a popover that was already in the requested state"
        )

        assert fixture.evaluate(f"{controls}.popover.toggleManual()")
        assert manual.evaluate("node => node.matches(':popover-open')")
        assert not fixture.evaluate(f"{controls}.popover.toggleManual()")
        assert not manual.evaluate("node => node.matches(':popover-open')")

        assert_ok(fixture.evaluate(f"{controls}.popover.setManual(true)"))
        assert_ok(fixture.evaluate(f"{controls}.popover.setManual(true)"))
        assert manual.evaluate("node => node.matches(':popover-open')")
        assert_ok(fixture.evaluate(f"{controls}.popover.setManual(false)"))
        assert_ok(fixture.evaluate(f"{controls}.popover.setManual(false)"))
        assert not manual.evaluate("node => node.matches(':popover-open')")

        assert_error(
            fixture.evaluate(f"{controls}.popover.wrongTarget()"), "popover"
        )
        assert_error(
            fixture.evaluate(f"{controls}.popover.detached()"),
            "browser dom exception",
        )
        # Native togglePopover(false) still validates a hidden target. The
        # legacy-force compatibility path must not turn this failure into a
        # successful no-op merely because the requested state already matches.
        assert_error(
            fixture.evaluate(f"{controls}.popover.detachedSetClosed()"),
            "browser dom exception",
        )
        assert_error(
            fixture.evaluate(f"{controls}.popover.invalidEvent()"),
            "currenttarget",
        )

        auto = fixture.locator("#fixture-auto-popover")
        assert_ok(fixture.evaluate(f"{controls}.popover.showAuto()"))
        assert auto.evaluate("node => node.matches(':popover-open')")
        fixture.locator("#fixture-outside").click()
        assert not auto.evaluate("node => node.matches(':popover-open')")

        hint_supported = fixture.evaluate(
            """() => {
                const probe = document.createElement('div');
                probe.popover = 'hint';
                return probe.popover === 'hint';
            }"""
        )
        if hint_supported:
            hint_one = fixture.locator("#fixture-hint-one")
            hint_two = fixture.locator("#fixture-hint-two")
            assert_ok(fixture.evaluate(f"{controls}.popover.showAuto()"))
            assert_ok(fixture.evaluate(f"{controls}.popover.showHintOne()"))
            assert auto.evaluate("node => node.matches(':popover-open')")
            assert hint_one.evaluate("node => node.matches(':popover-open')")

            assert_ok(fixture.evaluate(f"{controls}.popover.showHintTwo()"))
            assert auto.evaluate("node => node.matches(':popover-open')")
            assert not hint_one.evaluate("node => node.matches(':popover-open')")
            assert hint_two.evaluate("node => node.matches(':popover-open')")
            fixture.locator("#fixture-outside").click()
        else:
            # `hint` is a newer extension. Attribute emission is still
            # testable, but stack semantics are intentionally not inferred.
            expect(fixture.locator("#fixture-hint-one")).to_have_attribute(
                "popover", "hint"
            )

        # Nodes keep the Web IDL brand of the realm which created them even
        # after the main document adopts them. Adapter validation must accept
        # those genuine nodes without relying on the main realm's instanceof.
        foreign_realm = fixture.evaluate(
            f"""() => {{
                const originalDialog =
                    document.querySelector('#fixture-dialog');
                const originalPopover =
                    document.querySelector('#fixture-manual-popover');
                const frame = document.body.appendChild(
                    document.createElement('iframe')
                );
                const foreignWindow = frame.contentWindow;
                const foreignDocument = frame.contentDocument;
                const dialog = foreignDocument.createElement('dialog');
                const popover = foreignDocument.createElement('div');
                dialog.id = 'fixture-dialog';
                popover.id = 'fixture-manual-popover';
                popover.popover = 'manual';
                originalDialog.id = 'fixture-dialog-main-realm';
                originalPopover.id = 'fixture-popover-main-realm';
                document.body.append(dialog, popover);

                try {{
                    const result = {{
                        dialogMainInstance:
                            dialog instanceof HTMLDialogElement,
                        popoverMainInstance: popover instanceof Element
                    }};

                    result.dialogShow = {controls}.dialog.show();
                    result.dialogOpen = {controls}.dialog.isOpen();
                    result.dialogNonModal = !{controls}.dialog.isModal();
                    result.dialogClose =
                        {controls}.dialog.close('foreign-non-modal');
                    result.dialogReturn = {controls}.dialog.returnValue();
                    result.dialogShowModal = {controls}.dialog.showModal();
                    result.dialogModal = {controls}.dialog.isModal();
                    result.dialogCloseModal =
                        {controls}.dialog.close('foreign-modal');
                    result.dialogHasRequestClose =
                        typeof dialog.requestClose === 'function';
                    if (result.dialogHasRequestClose) {{
                        result.dialogShowForRequest =
                            {controls}.dialog.showModal();
                        result.dialogRequestClose =
                            {controls}.dialog.requestClose('foreign-request');
                        result.dialogRequestReturn =
                            {controls}.dialog.returnValue();
                    }}

                    result.popoverShow = {controls}.popover.showManual();
                    result.popoverOpen =
                        {controls}.popover.isManualOpen();
                    result.popoverHide = {controls}.popover.hideManual();
                    result.popoverToggleOpen =
                        {controls}.popover.toggleManual();
                    result.popoverToggleClosed =
                        {controls}.popover.toggleManual();
                    result.popoverSet =
                        {controls}.popover.setManual(true);
                    result.popoverSetOpen =
                        {controls}.popover.isManualOpen();
                    result.popoverUnset =
                        {controls}.popover.setManual(false);

                    let toggleRead = 'listener-not-called';
                    popover.addEventListener('toggle', event => {{
                        toggleRead = {controls}.popover.readEvent(event);
                    }}, {{ once: true }});
                    const toggleEvent = new foreignWindow.ToggleEvent(
                        'toggle',
                        {{ oldState: 'closed', newState: 'open' }}
                    );
                    popover.dispatchEvent(toggleEvent);
                    result.toggleEventMainInstance = toggleEvent instanceof Event;
                    result.toggleRead = toggleRead;

                    dialog.returnValue = 'foreign-event';
                    let closeRead = 'listener-not-called';
                    dialog.addEventListener('close', event => {{
                        closeRead = {controls}.dialog.readEvent(event);
                    }}, {{ once: true }});
                    const closeEvent = new foreignWindow.Event('close');
                    dialog.dispatchEvent(closeEvent);
                    result.closeEventMainInstance = closeEvent instanceof Event;
                    result.closeRead = closeRead;
                    return result;
                }} finally {{
                    if (dialog.open) dialog.close();
                    if (popover.matches(':popover-open')) popover.hidePopover();
                    dialog.remove();
                    popover.remove();
                    originalDialog.id = 'fixture-dialog';
                    originalPopover.id = 'fixture-manual-popover';
                    frame.remove();
                }}
            }}"""
        )
        assert not foreign_realm["dialogMainInstance"]
        assert not foreign_realm["popoverMainInstance"]
        assert not foreign_realm["toggleEventMainInstance"]
        assert not foreign_realm["closeEventMainInstance"]
        assert_ok(foreign_realm["dialogShow"])
        assert foreign_realm["dialogOpen"]
        assert foreign_realm["dialogNonModal"]
        assert_ok(foreign_realm["dialogClose"])
        assert foreign_realm["dialogReturn"] == "foreign-non-modal"
        assert_ok(foreign_realm["dialogShowModal"])
        assert foreign_realm["dialogModal"]
        assert_ok(foreign_realm["dialogCloseModal"])
        if foreign_realm["dialogHasRequestClose"]:
            assert_ok(foreign_realm["dialogShowForRequest"])
            assert_ok(foreign_realm["dialogRequestClose"])
            assert foreign_realm["dialogRequestReturn"] == "foreign-request"
        assert_ok(foreign_realm["popoverShow"])
        assert foreign_realm["popoverOpen"]
        assert_ok(foreign_realm["popoverHide"])
        assert foreign_realm["popoverToggleOpen"]
        assert not foreign_realm["popoverToggleClosed"]
        assert_ok(foreign_realm["popoverSet"])
        assert foreign_realm["popoverSetOpen"]
        assert_ok(foreign_realm["popoverUnset"])
        assert foreign_realm["toggleRead"] == "open"
        assert foreign_realm["closeRead"] == "foreign-event"

        # Removing an open ordinary node through its Kokaine owner also takes
        # it out of the top layer. A retained JS handle cannot reactivate the
        # retired Koka event continuation.
        fixture.evaluate(
            "globalThis.__staleOwnedDialog = document.querySelector('#owned-dialog')"
        )
        assert_ok(fixture.evaluate(f"{controls}.owned.openDialog()"))
        assert fixture.evaluate("__staleOwnedDialog.matches(':modal')")
        assert_ok(fixture.evaluate(f"{controls}.owned.retire()"))
        assert fixture.locator("#owned-dialog").count() == 0
        assert not fixture.evaluate("__staleOwnedDialog.isConnected")
        dialog_events = fixture.evaluate(f"{controls}.owned.eventCount()")
        fixture.evaluate(
            "__staleOwnedDialog.dispatchEvent(new Event('close'))"
        )
        assert fixture.evaluate(f"{controls}.owned.eventCount()") == dialog_events

        assert_ok(fixture.evaluate(f"{controls}.owned.restore()"))
        fixture.locator("#owned-popover").wait_for(state="attached")
        fixture.evaluate(
            "globalThis.__staleOwnedPopover = document.querySelector('#owned-popover')"
        )
        popover_events = fixture.evaluate(f"{controls}.owned.eventCount()")
        assert_ok(fixture.evaluate(f"{controls}.owned.openPopover()"))
        fixture.wait_for_function(
            f"value => {controls}.owned.eventCount() > value",
            arg=popover_events,
        )
        assert fixture.evaluate("__staleOwnedPopover.matches(':popover-open')")
        assert_ok(fixture.evaluate(f"{controls}.owned.retire()"))
        assert fixture.locator("#owned-popover").count() == 0
        assert not fixture.evaluate("__staleOwnedPopover.isConnected")
        retired_events = fixture.evaluate(f"{controls}.owned.eventCount()")
        fixture.evaluate(
            "__staleOwnedPopover.dispatchEvent(new Event('toggle'))"
        )
        assert fixture.evaluate(f"{controls}.owned.eventCount()") == retired_events

        fixture.evaluate(
            """() => {
                globalThis.__rootDisposeDialog =
                    document.querySelector('#root-dispose-dialog');
                globalThis.__rootDisposePopover =
                    document.querySelector('#root-dispose-popover');
            }"""
        )
        assert_ok(fixture.evaluate(f"{controls}.dispose.openPopover()"))
        assert fixture.evaluate(
            "__rootDisposePopover.matches(':popover-open')"
        )
        assert_ok(fixture.evaluate(f"{controls}.dispose.openDialog()"))
        assert fixture.evaluate("__rootDisposeDialog.matches(':modal')")
        assert_ok(fixture.evaluate(f"{controls}.dispose.root()"))
        assert not fixture.evaluate("__rootDisposeDialog.isConnected")
        assert not fixture.evaluate("__rootDisposePopover.isConnected")

        mobile = browser.new_page(viewport={"width": 375, "height": 812})
        mobile.goto(f"{origin}/examples/top-layer/")
        mobile.wait_for_load_state("networkidle")
        assert mobile.evaluate(
            "document.documentElement.scrollWidth <= window.innerWidth"
        ), "the top-layer example overflows a mobile viewport"

        browser.close()

        assert not page_errors, "browser exceptions:\n" + "\n".join(page_errors)
        assert not console_errors, "browser console errors:\n" + "\n".join(
            console_errors
        )

        print(
            "browser: dialog modal/non-modal commands, cancelable close, form "
            "returnValue, declarative and imperative popovers, stack behavior, "
            "translated failures, and top-layer disposal passed"
        )
