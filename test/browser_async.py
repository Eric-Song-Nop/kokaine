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
        if self.path == "/async-header-gap.txt":
            first = b"headers-owned:"
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

                const nativeSetTimeout = globalThis.setTimeout.bind(globalThis);
                const nativeClearTimeout = globalThis.clearTimeout.bind(globalThis);
                const nativePerformanceNow = performance.now.bind(performance);
                const longTimer = {
                    enabled: false,
                    now: 0,
                    nextId: 1,
                    tasks: [],
                    delays: [],
                    clears: 0,
                    setCalls: 0,
                    throwOnCall: null,
                    ignoreClear: false,
                    enable(throwOnCall = null, ignoreClear = false) {
                        this.enabled = true;
                        this.now = 0;
                        this.nextId = 1;
                        this.tasks = [];
                        this.delays = [];
                        this.clears = 0;
                        this.setCalls = 0;
                        this.throwOnCall = throwOnCall;
                        this.ignoreClear = ignoreClear;
                    },
                    disable() {
                        this.enabled = false;
                    },
                    advance(milliseconds) {
                        this.now += milliseconds;
                        while (true) {
                            this.tasks.sort((left, right) => left.at - right.at);
                            const index = this.tasks.findIndex(task => task.at <= this.now);
                            if (index < 0) break;
                            const [task] = this.tasks.splice(index, 1);
                            if (!task.canceled) task.callback();
                        }
                    },
                    fireNextEarly() {
                        this.tasks.sort((left, right) => left.at - right.at);
                        const task = this.tasks.shift();
                        if (task && !task.canceled) task.callback();
                    }
                };
                globalThis.__kokaineLongTimer = longTimer;
                globalThis.setTimeout = (callback, delay = 0, ...args) => {
                    if (!longTimer.enabled) {
                        return nativeSetTimeout(callback, delay, ...args);
                    }
                    longTimer.setCalls += 1;
                    if (longTimer.setCalls === longTimer.throwOnCall) {
                        throw new Error('forced long timer reschedule failure');
                    }
                    const task = {
                        id: longTimer.nextId++,
                        at: longTimer.now + Math.max(0, Number(delay)),
                        callback: () => callback(...args),
                        canceled: false
                    };
                    longTimer.delays.push(Number(delay));
                    longTimer.tasks.push(task);
                    return { __kokaineLongTimerTask: task };
                };
                globalThis.clearTimeout = handle => {
                    const task = handle?.__kokaineLongTimerTask;
                    if (!task) return nativeClearTimeout(handle);
                    if (!task.canceled) longTimer.clears += 1;
                    if (longTimer.ignoreClear) return;
                    task.canceled = true;
                    longTimer.tasks = longTimer.tasks.filter(current => current !== task);
                };
                Object.defineProperty(performance, 'now', {
                    configurable: true,
                    value: () => longTimer.enabled ? longTimer.now : nativePerformanceNow()
                });

                const nativeFetch = globalThis.fetch.bind(globalThis);
                globalThis.__kokaineFetchAbortCount = 0;
                globalThis.__kokaineBodyCancelCount = 0;
                globalThis.__kokaineHeaderGapBodyStarts = 0;
                globalThis.__kokaineStructuredFetchAbortCount = 0;
                globalThis.__kokaineStructuredBodyCancelCount = 0;
                globalThis.fetch = (input, init = {}) => {
                    const structuredOwned = String(input).endsWith(
                        '/async-structured-owned.txt'
                    );
                    if (String(input).endsWith('/async-reject.txt')) {
                        return Promise.reject(new Error('forced fetch rejection'));
                    }
                    if (init.signal && !structuredOwned) {
                        init.signal.addEventListener('abort', () => {
                            globalThis.__kokaineFetchAbortCount += 1;
                        }, { once: true });
                    }
                    if (structuredOwned) {
                        if (init.signal) {
                            init.signal.addEventListener('abort', () => {
                                globalThis.__kokaineStructuredFetchAbortCount += 1;
                            }, { once: true });
                        }
                        const body = {
                            locked: false,
                            cancel() {
                                globalThis.__kokaineStructuredBodyCancelCount += 1;
                                this.locked = true;
                                return Promise.resolve();
                            }
                        };
                        const response = {
                            status: 200,
                            ok: true,
                            url: String(input),
                            body
                        };
                        return {
                            then(fulfill, _reject) {
                                fulfill(response);
                                return this;
                            }
                        };
                    }
                    return nativeFetch(input, init).then(response => {
                        if (String(input).endsWith('/async-header-gap.txt')) {
                            const nativeText = response.text.bind(response);
                            response.text = (...args) => {
                                globalThis.__kokaineHeaderGapBodyStarts += 1;
                                return nativeText(...args);
                            };
                        }
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

        # Browser timers use a signed 32-bit delay. A longer sleep must be
        # deadline-driven across bounded chunks instead of wrapping to ~1ms.
        page.evaluate("__kokaineLongTimer.enable()")
        immediate = dispatch_and_read(page, "#async-long-timer")
        assert immediate == {
            "phase": "long-timer-before",
            "outstanding": 1,
        }, immediate
        assert page.evaluate("__kokaineLongTimer.delays") == [2147483647]
        early = page.evaluate(
            """() => {
                __kokaineLongTimer.fireNextEarly();
                return {
                    phase: document.querySelector('#async-phase').textContent,
                    outstanding: __kokaineAsyncRuntime.outstanding(),
                    delays: __kokaineLongTimer.delays,
                    pending: __kokaineLongTimer.tasks.length
                };
            }"""
        )
        assert early == {
            "phase": "long-timer-before",
            "outstanding": 1,
            "delays": [2147483647, 2147483647],
            "pending": 1,
        }, early
        middle = page.evaluate(
            """() => {
                __kokaineLongTimer.advance(2147483647);
                return {
                    phase: document.querySelector('#async-phase').textContent,
                    outstanding: __kokaineAsyncRuntime.outstanding(),
                    delays: __kokaineLongTimer.delays,
                    pending: __kokaineLongTimer.tasks.length
                };
            }"""
        )
        assert middle == {
            "phase": "long-timer-before",
            "outstanding": 1,
            "delays": [2147483647, 2147483647, 1],
            "pending": 1,
        }, middle
        page.evaluate(
            """() => {
                __kokaineLongTimer.advance(1);
                __kokaineLongTimer.disable();
            }"""
        )
        expect(page.locator("#async-phase")).to_have_text("long-timer-after")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        # Failure of the first bounded chunk remains a setup error and leaves
        # no fake timer behind.
        page.evaluate("__kokaineLongTimer.enable(1)")
        immediate = dispatch_and_read(page, "#async-long-timer-failure")
        assert immediate == {
            "phase": "long-timer-failure-before",
            "outstanding": 1,
        }, immediate
        page.evaluate("__kokaineLongTimer.disable()")
        expect(page.locator("#async-phase")).to_have_text(
            "long-timer-failed:browser timer setup failed: "
            "forced long timer reschedule failure"
        )
        assert page.evaluate("__kokaineLongTimer.tasks.length") == 0
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        # A later chunk can fail even when initial setup succeeded. That error
        # must settle the same await instead of escaping the host callback.
        page.evaluate("__kokaineLongTimer.enable(2)")
        immediate = dispatch_and_read(page, "#async-long-timer-failure")
        assert immediate == {
            "phase": "long-timer-failure-before",
            "outstanding": 1,
        }, immediate
        assert page.evaluate("__kokaineLongTimer.delays") == [2147483647]
        page.evaluate(
            """() => {
                __kokaineLongTimer.advance(2147483647);
                __kokaineLongTimer.disable();
            }"""
        )
        expect(page.locator("#async-phase")).to_have_text(
            "long-timer-failed:browser timer failed: "
            "forced long timer reschedule failure"
        )
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

        immediate = dispatch_and_read(page, "#async-promise-hostile-reject")
        assert immediate["phase"] == "promise-hostile-reject-before"
        expect(page.locator("#async-phase")).to_have_text(
            "promise-hostile-rejected:browser Promise rejected: "
            "message getter exploded"
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

        immediate = dispatch_and_read(page, "#async-parallel-fetch-queued-cancel")
        assert immediate["phase"] == "parallel-fetch-queued-before", immediate
        expect(page.locator("#async-phase")).to_have_text(
            "parallel-fetch-queued-failed:expected setup failure"
        )
        assert page.evaluate(
            "__kokaineAsyncRuntime.log"
        ).count("parallel-fetch-queued-after") == 0
        assert page.evaluate("__kokaineStructuredFetchAbortCount") == 1
        assert page.evaluate("__kokaineStructuredBodyCancelCount") == 0
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        immediate = dispatch_and_read(page, "#async-parallel-fetch-owned-rollback")
        assert immediate["phase"] == "parallel-fetch-owned-before", immediate
        expect(page.locator("#async-phase")).to_have_text(
            "parallel-fetch-owned-failed:expected setup failure"
        )
        assert page.evaluate(
            "__kokaineAsyncRuntime.log"
        ).count("parallel-fetch-owned-after") == 1
        assert page.evaluate("__kokaineStructuredFetchAbortCount") == 2
        assert page.evaluate("__kokaineStructuredBodyCancelCount") == 1
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        immediate = dispatch_and_read(page, "#async-parallel-released-ownership")
        assert immediate["phase"] == "parallel-released-ownership-before", immediate
        expect(page.locator("#async-phase")).to_have_text(
            "parallel-released-ownership-failed:expected setup failure"
        )
        assert page.evaluate(
            "__kokaineAsyncRuntime.structuredOwnedDisposeCount"
        ) == 0
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0

        immediate = dispatch_and_read(page, "#async-race")
        assert immediate["phase"] == "race-before", immediate
        assert immediate["outstanding"] >= 2, immediate
        expect(page.locator("#async-phase")).to_have_text("race:fast")
        expect(page.locator("#async-finalizers")).to_have_text("1")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        assert page.evaluate("__kokaineAsyncRuntime.log").count(
            "race-loser-after-cleanup-await"
        ) == 1
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

        # Cancellation after the first bounded chunk clears the replacement
        # handle, and advancing the fake clock cannot revive the dead suffix.
        toggle_live_generation(page)
        page.evaluate("__kokaineLongTimer.enable(null, true)")
        immediate = dispatch_and_read(page, "#async-retire-long-timer")
        assert immediate == {
            "phase": "retire-long-timer-before",
            "outstanding": 1,
        }, immediate
        page.evaluate("__kokaineLongTimer.advance(2147483647)")
        assert page.evaluate("__kokaineLongTimer.delays") == [2147483647, 1]
        toggle_live_generation(page)
        expect(page.locator("#async-finalizers")).to_have_text("5")
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        canceled_long_timer = page.evaluate(
            """() => {
                const pendingBeforeLateCallback = __kokaineLongTimer.tasks.length;
                __kokaineLongTimer.advance(1);
                const pendingAfterLateCallback = __kokaineLongTimer.tasks.length;
                __kokaineLongTimer.disable();
                return {
                    pendingBeforeLateCallback,
                    pendingAfterLateCallback,
                    clears: __kokaineLongTimer.clears
                };
            }"""
        )
        assert canceled_long_timer == {
            "pendingBeforeLateCallback": 1,
            "pendingAfterLateCallback": 0,
            "clears": 1,
        }
        page.wait_for_timeout(20)
        expect(page.locator("#async-phase")).to_have_text(
            "retire-long-timer-before"
        )

        # Fetch retirement revokes callbacks first and then aborts the request.
        toggle_live_generation(page)
        immediate = dispatch_and_read(page, "#async-retire-fetch")
        assert immediate["phase"] == "retire-fetch-before"
        toggle_live_generation(page)
        expect(page.locator("#async-finalizers")).to_have_text("6")
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
        expect(page.locator("#async-finalizers")).to_have_text("7")
        assert page.evaluate("__kokaineFetchAbortCount") == 3
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        page.wait_for_timeout(40)
        expect(page.locator("#async-phase")).to_have_text(
            "retire-stream-body-before"
        )

        # Fetch completes at response headers. Until body consumption starts,
        # the delivered Response must itself retain generation ownership of
        # the controller. Retirement aborts it without starting response.text.
        toggle_live_generation(page)
        aborts_before_header_gap = page.evaluate(
            "__kokaineFetchAbortCount"
        )
        finalizers_before_header_gap = int(
            page.locator("#async-finalizers").text_content()
        )
        immediate = dispatch_and_read(page, "#async-retire-header-gap")
        assert immediate["phase"] == "retire-header-gap-fetch-before"
        expect(page.locator("#async-phase")).to_have_text(
            "retire-header-gap-headers"
        )
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 2
        assert page.evaluate("__kokaineHeaderGapBodyStarts") == 0
        toggle_live_generation(page)
        expect(page.locator("#async-finalizers")).to_have_text(
            str(finalizers_before_header_gap + 1)
        )
        assert page.evaluate("__kokaineFetchAbortCount") == (
            aborts_before_header_gap + 1
        )
        assert page.evaluate("__kokaineAsyncRuntime.outstanding()") == 0
        page.wait_for_timeout(840)
        expect(page.locator("#async-phase")).to_have_text(
            "retire-header-gap-headers"
        )
        assert page.evaluate("__kokaineHeaderGapBodyStarts") == 0

        # Retiring a parent generation must not strand structured children
        # behind queue drivers owned by that same dead generation. This nests
        # race inside parallel so all three child disposers and finalizers are
        # exercised through both group levels.
        toggle_live_generation(page)
        immediate = dispatch_and_read(page, "#async-retire-structured")
        assert immediate["phase"] == "retire-structured-before"
        assert immediate["outstanding"] >= 3, immediate
        toggle_live_generation(page)
        expect(page.locator("#async-finalizers")).to_have_text("11")
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
        expect(page.locator("#async-finalizers")).to_have_text("13")
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

        # Completed awaits must physically unlink their structural cleanup
        # registrations instead of leaving one owner tombstone per turn.
        page.evaluate(
            """async () => {
                await import('/dist/test_async_dash_owner_dash_registration__main.mjs');
            }"""
        )
        page.wait_for_function("globalThis.__kokaineAsyncOwner?.done === true")
        owner_result = page.evaluate("__kokaineAsyncOwner")
        assert owner_result == {
            "done": True,
            "owned": 0,
            "outstanding": 0,
            "leasedOwned": 1,
            "leasedOutstanding": 1,
            "leaseDisposals": 0,
            "snapshotLeaseDisposals": 1,
        }, owner_result

        browser.close()
        assert not page_errors, "browser page errors:\n" + "\n".join(page_errors)
        assert not console_errors, "browser console errors:\n" + "\n".join(
            console_errors
        )
        print(
            "browser-async: turns, Promise, timer, Fetch/abort, races, "
            "retirement, finalizers, and root disposal passed"
        )
