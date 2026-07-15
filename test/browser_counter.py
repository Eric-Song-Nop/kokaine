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


def assert_counter_state(page, value: int) -> None:
    """Assert every public projection of the counter's current value."""
    parity = "EVEN" if value % 2 == 0 else "ODD"
    phase = (
        "System at rest"
        if value == 0
        else "Positive phase"
        if value > 0
        else "Negative phase"
    )
    expect(page.locator(".reading__number")).to_have_text(str(value))
    expect(page.locator(".reading__derived strong").nth(0)).to_have_text(
        str(value * value)
    )
    expect(page.locator(".reading__derived strong").nth(1)).to_have_text(parity)
    expect(page.locator(".status p")).to_contain_text(phase)
    expect(page.locator(".reading")).to_have_class(
        f"reading reading--{parity.lower()}"
    )
    expect(page.locator(".reading")).to_have_attribute(
        "style", f"--level: {abs(value) % 9}"
    )


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
        desktop.locator("#new-branch").click()
        expect(lifecycle_count).to_have_text("2")
        assert desktop.evaluate("__kokaineLifecycle.read()") == 2

        stale_branches = [old_branch]
        for _ in range(32):
            current = desktop.locator("#old-branch, #new-branch").element_handle()
            current_id = current.get_attribute("id")
            stale_branches.append(current)
            desktop.locator("#branch-toggle").click()
            next_id = "new-branch" if current_id == "old-branch" else "old-branch"
            expect(desktop.locator(f"#{next_id}")).to_be_visible()
            assert not current.evaluate("node => node.isConnected"), (
                "a replaced branch remained connected"
            )

        for stale in stale_branches:
            stale.evaluate(
                """node => node.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                }))"""
            )
        assert desktop.evaluate("__kokaineLifecycle.read()") == 2, (
            "a detached branch listener remained active after churn"
        )
        expect(lifecycle_count).to_have_text("2")

        connected_branch = desktop.locator("#old-branch, #new-branch")
        connected_branch.click()
        expect(lifecycle_count).to_have_text("3")
        assert desktop.evaluate("__kokaineLifecycle.read()") == 3
        retained_branch = connected_branch.element_handle()
        count_node = lifecycle_count.element_handle()

        desktop.evaluate(
            """() => {
                __kokaineLifecycle.dispose();
                __kokaineLifecycle.dispose();
            }"""
        )
        expect(desktop.locator("#lifecycle-root")).to_be_empty()

        desktop.evaluate(
            """() => {
                for (let index = 0; index < 64; index += 1) {
                    __kokaineLifecycle.bump();
                }
            }"""
        )
        assert desktop.evaluate("__kokaineLifecycle.read()") == 67
        assert count_node.text_content() == "3", (
            "a live binding updated after unmount"
        )
        for stale in [*stale_branches, new_branch, retained_branch]:
            stale.evaluate(
                "node => node.dispatchEvent(new MouseEvent('click', {bubbles: true}))"
            )
        assert desktop.evaluate("__kokaineLifecycle.read()") == 67, (
            "an owned listener survived unmount"
        )

        reading = desktop.locator(".reading__number")
        assert_counter_state(desktop, 0)

        increase = desktop.get_by_role("button", name="Increase value")
        decrease = desktop.get_by_role("button", name="Decrease value")
        increase.click()
        increase.click()
        if reading.text_content() != "2":
            raise AssertionError(
                "click handler did not propagate; "
                f"page errors={page_errors!r}, console errors={console_errors!r}"
            )
        assert_counter_state(desktop, 2)

        decrease.click()
        decrease.click()
        decrease.click()
        assert_counter_state(desktop, -1)

        zero = desktop.get_by_role("button", name="ZERO")
        default_was_prevented = zero.evaluate(
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
        assert_counter_state(desktop, 0)

        desktop.evaluate(
            """() => {
                const increase = document.querySelector(
                    '[aria-label="Increase value"]'
                );
                const decrease = document.querySelector(
                    '[aria-label="Decrease value"]'
                );
                for (let index = 0; index < 700; index += 1) {
                    const target = index % 7 < 4 ? increase : decrease;
                    target.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true
                    }));
                }
            }"""
        )
        assert_counter_state(desktop, 100)

        desktop.evaluate(
            """() => {
                const decrease = document.querySelector(
                    '[aria-label="Decrease value"]'
                );
                const increase = document.querySelector(
                    '[aria-label="Increase value"]'
                );
                for (let index = 0; index < 143; index += 1) {
                    decrease.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                }
                for (let index = 0; index < 31; index += 1) {
                    increase.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                }
            }"""
        )
        assert_counter_state(desktop, -12)

        operator = desktop.get_by_label("OPERATOR")
        unsafe_name = "Ada <effect> & 李 λ"
        operator.fill("")
        operator.fill(unsafe_name)
        expect(operator).to_have_value(unsafe_name)
        expect(desktop.locator("#greeting")).to_have_text(
            f"Signal received, {unsafe_name}."
        )
        assert desktop.locator("#greeting").evaluate(
            "node => node.childElementCount"
        ) == 0, "an operator name was interpreted as HTML"
        increase.click()
        assert_counter_state(desktop, -11)
        expect(desktop.locator("#greeting")).to_have_text(
            f"Signal received, {unsafe_name}."
        )

        zero.click()
        assert_counter_state(desktop, 0)
        stable_status = desktop.locator(".status p").element_handle()
        reset_results = zero.evaluate(
            """button => Array.from({length: 50}, () => {
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true
                });
                const dispatched = button.dispatchEvent(event);
                return event.defaultPrevented && !dispatched;
            })"""
        )
        assert all(reset_results), "a repeated ZERO event lost preventDefault"
        assert stable_status.evaluate("node => node.isConnected"), (
            "no-op reset callbacks rebuilt a stable reactive region"
        )
        assert stable_status.text_content().startswith("System at rest")
        assert_counter_state(desktop, 0)
        assert_no_horizontal_overflow(desktop)

        ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
        desktop.screenshot(path=ARTIFACT_DIR / "counter-desktop.png", full_page=True)

        mobile = browser.new_page(viewport={"width": 375, "height": 812})
        mobile.on("pageerror", lambda error: page_errors.append(str(error)))
        mobile.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        mobile.goto(base_url)
        mobile.wait_for_load_state("networkidle")
        assert_counter_state(mobile, 0)
        mobile.evaluate(
            """() => {
                const increase = document.querySelector(
                    '[aria-label="Increase value"]'
                );
                const decrease = document.querySelector(
                    '[aria-label="Decrease value"]'
                );
                for (let index = 0; index < 13; index += 1) {
                    increase.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                }
                for (let index = 0; index < 29; index += 1) {
                    decrease.dispatchEvent(new MouseEvent('click', {bubbles: true}));
                }
            }"""
        )
        assert_counter_state(mobile, -16)
        mobile.get_by_label("OPERATOR").fill("移动 λ")
        expect(mobile.locator("#greeting")).to_have_text("Signal received, 移动 λ.")
        assert_no_horizontal_overflow(mobile)

        mobile.set_viewport_size({"width": 780, "height": 1000})
        narrow_reading = mobile.locator(".reading").bounding_box()
        narrow_controls = mobile.locator(".controls").bounding_box()
        assert narrow_controls["y"] >= (
            narrow_reading["y"] + narrow_reading["height"] - 2
        ), "the 780px layout did not stack its controls"

        mobile.set_viewport_size({"width": 781, "height": 1000})
        wide_reading = mobile.locator(".reading").bounding_box()
        wide_controls = mobile.locator(".controls").bounding_box()
        assert wide_controls["x"] >= (
            wide_reading["x"] + wide_reading["width"] - 2
        ), "the 781px layout did not restore its two-column console"

        mobile.set_viewport_size({"width": 375, "height": 812})
        mobile.get_by_role("button", name="ZERO").click()
        assert_counter_state(mobile, 0)
        assert_no_horizontal_overflow(mobile)
        mobile.screenshot(path=ARTIFACT_DIR / "counter-mobile.png", full_page=True)

        browser.close()

        assert not page_errors, "browser exceptions:\n" + "\n".join(page_errors)
        assert not console_errors, "browser console errors:\n" + "\n".join(console_errors)
        print(
            "browser: burst propagation, DOM safety, lifecycle churn, disposal, "
            "and responsive layout passed"
        )
