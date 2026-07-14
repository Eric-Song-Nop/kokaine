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


BASE_URL = "http://127.0.0.1:4173/examples/counter/"
PROJECT_ROOT = Path(__file__).resolve().parents[1]
ARTIFACT_DIR = Path("/tmp/kokaine-browser")


class QuietHandler(SimpleHTTPRequestHandler):
    def log_message(self, _format: str, *_args: object) -> None:
        pass


@contextmanager
def serve_project():
    handler = partial(QuietHandler, directory=PROJECT_ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 4173), handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def assert_no_horizontal_overflow(page) -> None:
    assert page.evaluate(
        "document.documentElement.scrollWidth <= window.innerWidth"
    ), "the responsive layout overflows the viewport"


with serve_project():
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
        desktop.goto(BASE_URL)
        desktop.wait_for_load_state("networkidle")

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

        desktop.get_by_role("button", name="ZERO").click()
        expect(reading).to_have_text("0")
        expect(status).to_contain_text("System at rest")
        assert_no_horizontal_overflow(desktop)

        ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
        desktop.screenshot(path=ARTIFACT_DIR / "counter-desktop.png", full_page=True)

        mobile = browser.new_page(viewport={"width": 375, "height": 812})
        mobile.on("pageerror", lambda error: page_errors.append(str(error)))
        mobile.goto(BASE_URL)
        mobile.wait_for_load_state("networkidle")
        expect(mobile.locator(".reading__number")).to_have_text("0")
        assert_no_horizontal_overflow(mobile)
        mobile.screenshot(path=ARTIFACT_DIR / "counter-mobile.png", full_page=True)

        browser.close()

        assert not page_errors, "browser exceptions:\n" + "\n".join(page_errors)
        assert not console_errors, "browser console errors:\n" + "\n".join(console_errors)
        print("browser: counter propagation and responsive layout passed")
