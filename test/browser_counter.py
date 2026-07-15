"""End-to-end checks for the jsweb counter example.

The checks deliberately inspect DOM state rather than implementation details,
so they exercise event dispatch, signals, memos, live bindings, and reactive
region cleanup together.
"""

from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import expect, sync_playwright


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_DIR = Path("/tmp/kokaine-browser")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, _format: str, *_args: object) -> None:
        pass


@contextmanager
def serve_project():
    handler = partial(QuietHandler, directory=PROJECT_ROOT)
    # Let the OS choose an unused port so the suite can run beside `make serve`
    # or another checkout without disturbing either process.
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_port}"
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def assert_no_horizontal_overflow(page) -> None:
    assert page.evaluate(
        "document.documentElement.scrollWidth <= window.innerWidth"
    ), "the responsive layout overflows the viewport"


with serve_project() as origin:
    base_url = f"{origin}/examples/counter/"
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page_errors: list[str] = []
        console_errors: list[str] = []

        desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
        desktop.on("pageerror", lambda error: page_errors.append(str(error)))
        desktop.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        desktop.goto(base_url)
        desktop.wait_for_load_state("networkidle")

        translated_error = desktop.evaluate(
            """async () => {
                await import('/dist/test_dom_dash_errors__main.mjs');
                return globalThis.__kokaineDomErrorResult;
            }"""
        )
        assert translated_error == "translated", (
            "a raw DOMException escaped the Koka exn boundary"
        )

        desktop.evaluate(
            """() => {
                const host = document.createElement('div');
                host.id = 'lifecycle-root';
                document.body.append(host);
            }"""
        )
        desktop.evaluate(
            """async () => {
                await import('/dist/test_dom_dash_lifecycle__main.mjs');
            }"""
        )

        lifecycle_count = desktop.locator("#lifecycle-count")
        old_branch = desktop.locator("#old-branch").element_handle()
        desktop.locator("#old-branch").click()
        expect(lifecycle_count).to_have_text("1")
        assert desktop.evaluate("__kokaineLifecycle.read()") == 1

        desktop.locator("#branch-toggle").click()
        expect(desktop.locator("#new-branch")).to_be_visible()
        old_branch.evaluate(
            "node => node.dispatchEvent(new MouseEvent('click'))"
        )
        assert desktop.evaluate("__kokaineLifecycle.read()") == 1, (
            "a detached region listener remained active"
        )
        expect(lifecycle_count).to_have_text("1")

        new_branch = desktop.locator("#new-branch").element_handle()
        count_node = lifecycle_count.element_handle()
        desktop.locator("#new-branch").click()
        expect(lifecycle_count).to_have_text("2")
        assert desktop.evaluate("__kokaineLifecycle.read()") == 2

        desktop.evaluate(
            """() => {
                __kokaineLifecycle.dispose();
                __kokaineLifecycle.dispose();
            }"""
        )
        expect(desktop.locator("#lifecycle-root")).to_be_empty()

        desktop.evaluate("__kokaineLifecycle.bump()")
        assert desktop.evaluate("__kokaineLifecycle.read()") == 3
        assert count_node.text_content() == "2", (
            "a live binding updated after unmount"
        )
        old_branch.evaluate(
            "node => node.dispatchEvent(new MouseEvent('click'))"
        )
        new_branch.evaluate(
            "node => node.dispatchEvent(new MouseEvent('click'))"
        )
        assert desktop.evaluate("__kokaineLifecycle.read()") == 3, (
            "an owned listener survived unmount"
        )

        reading = desktop.locator(".reading__number")
        square = desktop.locator(".reading__derived strong").nth(0)
        parity = desktop.locator(".reading__derived strong").nth(1)
        status = desktop.locator(".status p")
        panel = desktop.locator(".reading")

        expect(reading).to_have_text("0")
        expect(square).to_have_text("0")
        expect(parity).to_have_text("EVEN")
        expect(status).to_contain_text("System at rest")

        increase = desktop.get_by_role("button", name="Increase value")
        decrease = desktop.get_by_role("button", name="Decrease value")
        increase.click()
        increase.click()
        if reading.text_content() != "2":
            raise AssertionError(
                "click handler did not propagate; "
                f"page errors={page_errors!r}, console errors={console_errors!r}"
            )
        expect(reading).to_have_text("2")
        expect(square).to_have_text("4")
        expect(parity).to_have_text("EVEN")
        expect(status).to_contain_text("Positive phase")
        expect(panel).to_have_class("reading reading--even")
        expect(panel).to_have_attribute("style", "--level: 2")

        decrease.click()
        decrease.click()
        decrease.click()
        expect(reading).to_have_text("-1")
        expect(square).to_have_text("1")
        expect(parity).to_have_text("ODD")
        expect(status).to_contain_text("Negative phase")
        expect(panel).to_have_class("reading reading--odd")

        operator = desktop.get_by_label("OPERATOR")
        operator.fill("Ada")
        expect(operator).to_have_value("Ada")
        expect(desktop.locator("#greeting")).to_have_text("Signal received, Ada.")

        default_was_prevented = desktop.get_by_role("button", name="ZERO").evaluate(
            """button => {
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                });
                const dispatched = button.dispatchEvent(event);
                return event.defaultPrevented && !dispatched;
            }"""
        )
        assert default_was_prevented, "the full callback lost its UI capability"
        expect(reading).to_have_text("0")
        expect(status).to_contain_text("System at rest")
        assert_no_horizontal_overflow(desktop)

        ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
        desktop.screenshot(path=ARTIFACT_DIR / "counter-desktop.png", full_page=True)

        mobile = browser.new_page(viewport={"width": 375, "height": 812})
        mobile.on("pageerror", lambda error: page_errors.append(str(error)))
        mobile.goto(base_url)
        mobile.wait_for_load_state("networkidle")
        expect(mobile.locator(".reading__number")).to_have_text("0")
        assert_no_horizontal_overflow(mobile)
        mobile.screenshot(path=ARTIFACT_DIR / "counter-mobile.png", full_page=True)

        browser.close()

        assert not page_errors, "browser exceptions:\n" + "\n".join(page_errors)
        assert not console_errors, "browser console errors:\n" + "\n".join(console_errors)
        print(
            "browser: propagation, DOM safety, lifecycle, and responsive layout passed"
        )
