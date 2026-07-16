"""Real-browser checks for Kokaine's generation-bound Web async runtime."""

from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from time import sleep

from playwright.sync_api import expect, sync_playwright


PROJECT_ROOT = Path(__file__).resolve().parents[1]


class AsyncHandler(SimpleHTTPRequestHandler):
    def log_message(self, _format: str, *_args: object) -> None:
        pass

    def do_GET(self) -> None:  # noqa: N802 - stdlib handler API
        if self.path == "/async-ok.txt":
            payload = b"browser-ok"
            self.send_response(200)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)
            return
        if self.path == "/async-slow.txt":
            sleep(0.8)
            payload = b"too-late"
            try:
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.send_header("Content-Length", str(len(payload)))
                self.end_headers()
                self.wfile.write(payload)
            except (BrokenPipeError, ConnectionResetError):
                pass
            return
        if self.path == "/async-stream.txt":
            first = b"headers-arrived:"
            second = b"too-late"
            try:
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.send_header("Content-Length", str(len(first) + len(second)))
                self.end_headers()
                self.wfile.write(first)
                self.wfile.flush()
                sleep(0.8)
                self.wfile.write(second)
            except (BrokenPipeError, ConnectionResetError):
                pass
            return
        if self.path == "/async-error.txt":
            first = b"expected service failure:"
            second = b"too-late"
            try:
                self.send_response(503)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.send_header("Content-Length", str(len(first) + len(second)))
                self.end_headers()
                self.wfile.write(first)
                self.wfile.flush()
                sleep(0.8)
                self.wfile.write(second)
            except (BrokenPipeError, ConnectionResetError):
                pass
            return
        super().do_GET()


@contextmanager
def serve_project():
    handler = partial(AsyncHandler, directory=PROJECT_ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
    thread = Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_port}"
    finally:
        server.shutdown()
        server.server_close()
        thread.join()


def dispatch_and_read(page, selector: str) -> dict:
    return page.evaluate(
        """selector => {
            document.querySelector(selector).dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            }));
            return {
                phase: document.querySelector('#async-phase').textContent,
                outstanding: globalThis.__kokaineAsyncRuntime.outstanding()
            };
        }""",
        selector,
    )


def toggle_live_generation(page) -> None:
    page.locator("#async-toggle").click()


def format_page_error(error: object) -> str:
    stack = getattr(error, "stack", None)
    return stack if isinstance(stack, str) and stack else str(error)


with serve_project() as origin:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page()
        page_errors: list[str] = []
        console_errors: list[str] = []
        page.on("pageerror", lambda error: page_errors.append(format_page_error(error)))
        page.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )

        page.goto(origin)
        page.wait_for_load_state("networkidle")
        page.evaluate(
            """() => {
                const host = document.createElement('div');
                host.id = 'async-runtime-root';
                document.body.replaceChildren(host);

                const nativeFetch = globalThis.fetch.bind(globalThis);
                globalThis.__kokaineFetchAbortCount = 0;
                globalThis.__kokaineBodyCancelCount = 0;
                globalThis.fetch = (input, init = {}) => {
                    if (String(input).endsWith('/async-reject.txt')) {
                        return Promise.reject(new Error('forced fetch rejection'));
                    }
                    if (init.signal) {
                        init.signal.addEventListener('abort', () => {
                            globalThis.__kokaineFetchAbortCount += 1;
                        }, { once: true });
                    }
                    return nativeFetch(input, init).then(response => {
                        if (String(input).endsWith('/async-error.txt') && response.body) {
                            const nativeCancel = response.body.cancel.bind(response.body);
                            response.body.cancel = (...args) => {
                                globalThis.__kokaineBodyCancelCount += 1;
                                return nativeCancel(...args);
                            };
                        }
                        return response;
                    });
                };
            }"""
        )
        page.evaluate(
            """async () => {
                await import('/dist/test_dom_dash_async_dash_runtime__main.mjs');
            }"""
        )
        expect(page.locator("#async-phase")).to_have_text("idle")

        # The initiating event turn publishes before the timer completes.
        immediate = dispatch_and_read(page, "#async-timer")
        assert immediate == {"phase": "timer-before", "outstanding": 1}, immediate
        expect(page.locator("#async-phase")).to_have_text("timer-after")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        # Already-settled Promise delivery still crosses a later microtask turn.
        immediate = dispatch_and_read(page, "#async-promise")
        assert immediate == {"phase": "promise-before", "outstanding": 1}, immediate
        expect(page.locator("#async-phase")).to_have_text("promise-after")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        immediate = dispatch_and_read(page, "#async-promise-reject")
        assert immediate["phase"] == "promise-reject-before"
        expect(page.locator("#async-phase")).to_have_text(
            "promise-rejected:browser Promise rejected: expected rejection"
        )
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        # Even a hostile setup callback which fires twice synchronously resumes
        # once, after dispatchEvent has returned.
        immediate = dispatch_and_read(page, "#async-sync-double")
        assert immediate == {"phase": "sync-before", "outstanding": 1}, immediate
        expect(page.locator("#async-phase")).to_have_text("sync:first")
        assert page.evaluate("__kokaineAsyncRuntime.disposerCount") == 0
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        page.wait_for_timeout(20)
        expect(page.locator("#async-phase")).to_have_text("sync:first")

        immediate = dispatch_and_read(page, "#async-setup-failure")
        assert immediate["phase"] == "setup-before"
        expect(page.locator("#async-phase")).to_have_text(
            "setup-failed:expected setup failure"
        )
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        immediate = dispatch_and_read(page, "#async-fetch")
        assert immediate["phase"] == "fetch-before"
        expect(page.locator("#async-phase")).to_have_text("fetch:browser-ok")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        immediate = dispatch_and_read(page, "#async-fetch-reject")
        assert immediate["phase"] == "fetch-reject-before"
        expect(page.locator("#async-phase")).to_have_text(
            "fetch-rejected:browser Fetch rejected: forced fetch rejection"
        )
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        immediate = dispatch_and_read(page, "#async-http-error")
        assert immediate["phase"] == "http-error-before"
        expect(page.locator("#async-phase")).to_have_text(
            "http-error:HTTP request failed with status 503"
        )
        assert page.evaluate("__kokaineFetchAbortCount") == 1
        assert page.evaluate("__kokaineBodyCancelCount") == 1
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        console_errors = [
            message
            for message in console_errors
            if not ("Failed to load resource" in message and "503" in message)
        ]

        immediate = dispatch_and_read(page, "#async-parallel")
        assert immediate["phase"] == "parallel-before", immediate
        assert immediate["outstanding"] >= 2, immediate
        expect(page.locator("#async-phase")).to_have_text("parallel:left:right")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        immediate = dispatch_and_read(page, "#async-race")
        assert immediate["phase"] == "race-before", immediate
        assert immediate["outstanding"] >= 2, immediate
        expect(page.locator("#async-phase")).to_have_text("race:fast")
        expect(page.locator("#async-finalizers")).to_have_text("1")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        assert page.evaluate("__kokaineAsyncRuntime.log").count(
            "race-loser-finally"
        ) == 1

        immediate = dispatch_and_read(page, "#async-timeout")
        assert immediate["phase"] == "timeout-before", immediate
        assert immediate["outstanding"] >= 2, immediate
        expect(page.locator("#async-phase")).to_have_text("timeout:none")
        expect(page.locator("#async-finalizers")).to_have_text("2")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        assert page.evaluate("__kokaineAsyncRuntime.log").count(
            "timeout-loser-finally"
        ) == 1

        # A scheduled IOC belongs to the lexical cancellation scope at its
        # operation site. Canceling that child scope synchronously must revoke
        # the microtask even though the surrounding generation stays live.
        immediate = dispatch_and_read(page, "#async-schedule-scope")
        assert immediate == {
            "phase": "schedule-scope-after",
            "outstanding": 0,
        }, immediate
        page.wait_for_timeout(20)
        assert "canceled-schedule-ran" not in page.evaluate(
            "__kokaineAsyncRuntime.log"
        )

        # A completion already queued by setup loses to structural retirement.
        scheduled = page.evaluate(
            """() => {
                document.querySelector('#async-retire-scheduled').click();
                const before = document.querySelector('#async-phase').textContent;
                document.querySelector('#async-toggle').click();
                return {
                    before,
                    after: document.querySelector('#async-phase').textContent,
                    finalizers: document.querySelector('#async-finalizers').textContent,
                    disposers: __kokaineAsyncRuntime.disposerCount,
                    outstanding: __kokaineAsyncRuntime.outstanding()
                };
            }"""
        )
        assert scheduled == {
            "before": "retire-scheduled-before",
            "after": "retire-scheduled-before",
            "finalizers": "3",
            "disposers": 1,
            "outstanding": 0,
        }, scheduled
        page.wait_for_timeout(20)
        expect(page.locator("#async-phase")).to_have_text("retire-scheduled-before")

        # Timer retirement runs the parked strand's finally and makes the late
        # host callback inert.
        toggle_live_generation(page)
        immediate = dispatch_and_read(page, "#async-retire-timer")
        assert immediate["phase"] == "retire-timer-before"
        toggle_live_generation(page)
        expect(page.locator("#async-finalizers")).to_have_text("4")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        page.wait_for_timeout(240)
        expect(page.locator("#async-phase")).to_have_text("retire-timer-before")

        # Fetch retirement revokes callbacks first and then aborts the request.
        toggle_live_generation(page)
        immediate = dispatch_and_read(page, "#async-retire-fetch")
        assert immediate["phase"] == "retire-fetch-before"
        toggle_live_generation(page)
        expect(page.locator("#async-finalizers")).to_have_text("5")
        assert page.evaluate("__kokaineFetchAbortCount") == 2
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        page.wait_for_timeout(40)
        expect(page.locator("#async-phase")).to_have_text("retire-fetch-before")

        # Fetch resolves at headers, but the streaming body remains owned by
        # the resumed generation. Retiring that generation aborts the original
        # controller instead of merely dropping the Response.text callback.
        toggle_live_generation(page)
        immediate = dispatch_and_read(page, "#async-retire-stream")
        assert immediate["phase"] == "retire-stream-fetch-before"
        expect(page.locator("#async-phase")).to_have_text(
            "retire-stream-body-before"
        )
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 1
        toggle_live_generation(page)
        expect(page.locator("#async-finalizers")).to_have_text("6")
        assert page.evaluate("__kokaineFetchAbortCount") == 3
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        page.wait_for_timeout(40)
        expect(page.locator("#async-phase")).to_have_text(
            "retire-stream-body-before"
        )

        # Retiring a parent generation must not strand structured children
        # behind queue drivers owned by that same dead generation. This nests
        # race inside parallel so all three child disposers and finalizers are
        # exercised through both group levels.
        toggle_live_generation(page)
        immediate = dispatch_and_read(page, "#async-retire-structured")
        assert immediate["phase"] == "retire-structured-before"
        assert immediate["outstanding"] >= 3, immediate
        toggle_live_generation(page)
        expect(page.locator("#async-finalizers")).to_have_text("9")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        for child in (
            "retire-parallel-left",
            "retire-nested-race-left",
            "retire-nested-race-right",
        ):
            log = page.evaluate("__kokaineAsyncRuntime.log")
            assert log.count(f"{child}-dispose") == 1, log
            assert log.count(f"{child}-finally") == 1, log
        page.wait_for_timeout(40)
        expect(page.locator("#async-phase")).to_have_text(
            "retire-structured-before"
        )

        # Promise delivery buffers a normal child suffix and schedules the
        # group driver. Generation retirement then lands in the microtask gap
        # before that driver. The buffered result must be overridden with
        # Cancel, while both structured child finalizers still run once.
        toggle_live_generation(page)
        immediate = dispatch_and_read(
            page, "#async-retire-structured-delivered"
        )
        assert immediate["phase"] == "retire-structured-delivered-before"
        expect(page.locator("#async-retired-generation")).to_be_attached()
        expect(page.locator("#async-finalizers")).to_have_text("11")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        delivered_log = page.evaluate("__kokaineAsyncRuntime.log")
        assert "retire-delivered-left-after-await" not in delivered_log
        assert delivered_log.count("retire-delivered-left-finally") == 1
        assert delivered_log.count("retire-delivered-right-dispose") == 1
        assert delivered_log.count("retire-delivered-right-finally") == 1
        page.wait_for_timeout(20)
        expect(page.locator("#async-phase")).to_have_text(
            "retire-structured-delivered-before"
        )

        # An uncaught exception in a resumed suffix is reported at the stable
        # host boundary and does not poison a later turn.
        toggle_live_generation(page)
        immediate = dispatch_and_read(page, "#async-uncaught")
        assert immediate["phase"] == "uncaught-before"
        page.wait_for_timeout(20)
        assert any(
            "expected uncaught async exception" in message
            for message in console_errors
        ), console_errors
        console_errors = [
            message
            for message in console_errors
            if "expected uncaught async exception" not in message
        ]
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        immediate = dispatch_and_read(page, "#async-timer")
        assert immediate["phase"] == "timer-before"
        expect(page.locator("#async-phase")).to_have_text("timer-after")

        # Root retirement is transitive and idempotent.
        dispatch_and_read(page, "#async-retire-timer")
        page.evaluate("__kokaineAsyncRuntime.disposeRoot()")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        assert page.evaluate("__kokaineAsyncRuntime.log").count(
            "retire-timer-finally"
        ) == 2
        page.evaluate("__kokaineAsyncRuntime.disposeRoot()")
        page.wait_for_timeout(240)
        assert "retire-timer-stale" not in page.evaluate(
            "__kokaineAsyncRuntime.log"
        )

        # Resource runs against the same real generation adapter without a DOM
        # dependency. Its staged fake host covers refresh churn, stale callbacks,
        # failures, explicit cancel, previous-value retention, and root disposal.
        page.evaluate(
            """async () => {
                await import('/dist/test_async_dash_resource__main.mjs');
            }"""
        )
        page.wait_for_function(
            "globalThis.__kokaineAsyncResource?.done === true"
        )
        resource_result = page.evaluate("__kokaineAsyncResource")
        assert resource_result["ok"], resource_result["message"]

        browser.close()
        assert not page_errors, "browser page errors:\n" + "\n".join(page_errors)
        assert not console_errors, "browser console errors:\n" + "\n".join(
            console_errors
        )
        print(
            "browser-async: turns, Promise, timer, Fetch/abort, races, "
            "retirement, finalizers, and root disposal passed"
        )
