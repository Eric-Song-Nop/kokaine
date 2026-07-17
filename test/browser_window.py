"""Real-browser contracts for the narrow Kokaine window adapter."""

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


TRACK_WINDOW_EVENTS = """() => {
    const nativeAdd = window.addEventListener.bind(window);
    const nativeRemove = window.removeEventListener.bind(window);
    const tracker = {
        records: [],
        throwOnRemove: false
    };
    globalThis.__kokaineWindowTracker = tracker;
    window.addEventListener = (name, listener, options) => {
        if (name === 'scroll' || name === 'hashchange') {
            tracker.records.push({
                name,
                listener,
                active: true,
                removalAttempts: 0
            });
        }
        return nativeAdd(name, listener, options);
    };
    window.removeEventListener = (name, listener, options) => {
        const record = tracker.records.find(
            candidate => candidate.name === name &&
                candidate.listener === listener && candidate.active
        );
        if (record) {
            record.removalAttempts += 1;
            if (tracker.throwOnRemove) {
                throw new Error('forced window listener removal failure');
            }
        }
        const result = nativeRemove(name, listener, options);
        if (record) record.active = false;
        return result;
    };
}"""


def load_fixture(browser, origin: str, *, throw_add: bool = False):
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
    page.goto(origin)
    page.wait_for_load_state("networkidle")
    page.evaluate(
        """() => {
            const host = document.createElement('div');
            host.id = 'window-event-root';
            document.body.replaceChildren(host);
        }"""
    )
    page.evaluate(TRACK_WINDOW_EVENTS)
    if throw_add:
        page.evaluate(
            """() => {
                const trackedAdd = window.addEventListener;
                window.addEventListener = (name, listener, options) => {
                    if (name === 'scroll' || name === 'hashchange') {
                        throw new Error('forced window listener setup failure');
                    }
                    return trackedAdd(name, listener, options);
                };
            }"""
        )
    page.evaluate(
        """async () => {
            await import('/dist/test_window_dash_event_dash_lifecycle__main.mjs');
        }"""
    )
    expect(page.locator("#window-phase")).to_have_text(
        "monitor-error:browser window event setup failed: "
        "forced window listener setup failure"
        if throw_add
        else "waiting"
    )
    return page, page_errors, console_errors


def main() -> None:
    with serve_project() as origin:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)

            # Test the adapter state cell itself, below the async runtime. This
            # prevents the task lease's own terminal gate from masking a stale
            # Koka callback retained by the host subscription.
            raw = browser.new_page()
            raw.goto(origin)
            raw.wait_for_load_state("networkidle")
            raw.evaluate(TRACK_WINDOW_EVENTS)
            raw_result = raw.evaluate(
                """async () => {
                    const adapter = await import('/dist/kokaine_web_window.mjs');
                    globalThis.__rawWindowRuns = 0;
                    globalThis.__rawWindowRejects = [];

                    const completed = adapter.window_event_setup_raw(
                        'scroll',
                        () => { globalThis.__rawWindowRuns += 1; },
                        error => __rawWindowRejects.push(String(error?.message ?? error))
                    );
                    window.dispatchEvent(new Event('scroll'));
                    adapter.retire_window_event(completed);
                    window.dispatchEvent(new Event('scroll'));

                    const retired = adapter.window_event_setup_raw(
                        'hashchange',
                        () => { globalThis.__rawWindowRuns += 10; },
                        error => __rawWindowRejects.push(String(error?.message ?? error))
                    );
                    __kokaineWindowTracker.throwOnRemove = true;
                    adapter.retire_window_event(retired);
                    const activeAfterThrow = __kokaineWindowTracker.records[1].active;
                    window.dispatchEvent(new Event('hashchange'));
                    const rejectsAfterRetiredThrow = __rawWindowRejects.length;
                    __kokaineWindowTracker.throwOnRemove = false;
                    window.dispatchEvent(new Event('hashchange'));

                    const removalFailure = adapter.window_event_setup_raw(
                        'scroll',
                        () => { globalThis.__rawWindowRuns += 100; },
                        error => __rawWindowRejects.push(String(error?.message ?? error))
                    );
                    __kokaineWindowTracker.throwOnRemove = true;
                    window.dispatchEvent(new Event('scroll'));
                    const activeAfterCompletionThrow =
                        __kokaineWindowTracker.records[2].active;
                    __kokaineWindowTracker.throwOnRemove = false;
                    window.dispatchEvent(new Event('scroll'));

                    return {
                        completedOk: completed.ok,
                        retiredOk: retired.ok,
                        removalFailureOk: removalFailure.ok,
                        runs: globalThis.__rawWindowRuns,
                        rejects: globalThis.__rawWindowRejects,
                        activeAfterThrow,
                        rejectsAfterRetiredThrow,
                        activeAfterStaleDelivery:
                            __kokaineWindowTracker.records[1].active,
                        activeAfterCompletionThrow,
                        activeAfterRepeatedDelivery:
                            __kokaineWindowTracker.records[2].active,
                        removalAttempts: __kokaineWindowTracker.records.map(
                            record => record.removalAttempts
                        )
                    };
                }"""
            )
            assert raw_result == {
                "completedOk": True,
                "retiredOk": True,
                "removalFailureOk": True,
                "runs": 1,
                "rejects": ["forced window listener removal failure"],
                "activeAfterThrow": True,
                "rejectsAfterRetiredThrow": 0,
                "activeAfterStaleDelivery": False,
                "activeAfterCompletionThrow": True,
                "activeAfterRepeatedDelivery": False,
                "removalAttempts": [1, 3, 2],
            }, raw_result
            raw.close()

            # One winner resumes exactly once. The race loser and the already
            # completed winner are both inert even when their raw closures are
            # retained and invoked directly by a hostile host.
            page, page_errors, console_errors = load_fixture(browser, origin)
            initial = page.evaluate(
                """() => __kokaineWindowTracker.records.slice(0, 2).map(
                    record => record.name
                )"""
            )
            assert initial == ["scroll", "hashchange"], initial
            page.evaluate("window.dispatchEvent(new Event('scroll'))")
            page.wait_for_function("__kokaineWindowFixture.runs === 1")
            page.evaluate(
                """() => {
                    __kokaineWindowTracker.records[0].listener();
                    __kokaineWindowTracker.records[1].listener();
                }"""
            )
            page.wait_for_timeout(20)
            assert page.evaluate("__kokaineWindowFixture.runs") == 1
            assert page.evaluate(
                """() => __kokaineWindowTracker.records.slice(0, 2).map(
                    record => ({
                        active: record.active,
                        attempts: record.removalAttempts
                    })
                )"""
            ) == [
                {"active": False, "attempts": 1},
                {"active": False, "attempts": 1},
            ]
            assert not page_errors, page_errors
            assert not console_errors, console_errors
            page.close()

            # Retirement clears callbacks before attempting host removal. A
            # throwing removeEventListener may leave native closures attached,
            # but those closures must no longer retain or resume Koka code.
            page, page_errors, console_errors = load_fixture(browser, origin)
            retired = page.evaluate(
                """() => {
                    __kokaineWindowTracker.throwOnRemove = true;
                    __kokaineWindowFixture.disposeRoot();
                    return __kokaineWindowTracker.records.map(record => ({
                        name: record.name,
                        active: record.active,
                        attempts: record.removalAttempts
                    }));
                }"""
            )
            assert retired == [
                {"name": "scroll", "active": True, "attempts": 1},
                {"name": "hashchange", "active": True, "attempts": 1},
            ], retired
            page.evaluate(
                """() => {
                    __kokaineWindowTracker.throwOnRemove = false;
                    window.dispatchEvent(new Event('scroll'));
                    window.dispatchEvent(new Event('hashchange'));
                }"""
            )
            page.wait_for_timeout(20)
            assert page.evaluate("__kokaineWindowFixture.runs") == 0
            assert page.evaluate(
                """() => __kokaineWindowTracker.records.map(record => ({
                    name: record.name,
                    active: record.active,
                    attempts: record.removalAttempts
                }))"""
            ) == [
                {"name": "scroll", "active": False, "attempts": 2},
                {"name": "hashchange", "active": False, "attempts": 2},
            ]
            assert not page_errors, page_errors
            assert not console_errors, console_errors
            page.close()

            # Native setup failure is translated to modeled Koka exn.
            page, page_errors, console_errors = load_fixture(
                browser, origin, throw_add=True
            )
            assert not page_errors, page_errors
            assert not console_errors, console_errors
            page.close()

            # Once delivery has won, failure to detach its native listener is
            # an operation error, not a successful event. It must reject the
            # await while leaving the now-inert native closure harmless.
            page, page_errors, console_errors = load_fixture(browser, origin)
            page.evaluate(
                """() => {
                    __kokaineWindowTracker.throwOnRemove = true;
                    window.dispatchEvent(new Event('scroll'));
                }"""
            )
            expect(page.locator("#window-phase")).to_have_text(
                "monitor-error:browser window event completion failed: "
                "forced window listener removal failure"
            )
            assert page.evaluate("__kokaineWindowFixture.runs") == 0
            assert page.evaluate(
                "__kokaineWindowTracker.records.length"
            ) == 2
            assert not page_errors, page_errors
            assert not console_errors, console_errors
            page.close()

            # Synchronous host property and API failures must be caught at the
            # innermost FFI boundary so Koka catch/finally still run.
            page, page_errors, console_errors = load_fixture(browser, origin)
            page.evaluate(
                """() => Object.defineProperty(window, 'innerHeight', {
                    configurable: true,
                    get() { throw new Error('forced viewport height failure'); }
                })"""
            )
            page.locator("#window-height").click()
            expect(page.locator("#window-phase")).to_have_text(
                "caught:browser window viewport height failed: "
                "forced viewport height failure"
            )
            page.evaluate(
                """() => {
                    window.matchMedia = () => {
                        throw new Error('forced reduced motion failure');
                    };
                }"""
            )
            page.locator("#window-motion").click()
            expect(page.locator("#window-phase")).to_have_text(
                "caught:browser window reduced motion query failed: "
                "forced reduced motion failure"
            )
            page.evaluate(
                """() => {
                    history.replaceState(null, '', '#fixture');
                    globalThis.decodeURIComponent = () => {
                        throw new Error('forced fragment decoder failure');
                    };
                }"""
            )
            page.locator("#window-fragment").click()
            expect(page.locator("#window-phase")).to_have_text(
                "caught:browser window location fragment failed: "
                "forced fragment decoder failure"
            )

            # Error reporting is a last-resort boundary and therefore cannot
            # itself leak a native console failure into the Koka runtime.
            page.evaluate(
                """() => {
                    console.error = () => {
                        throw new Error('forced console failure');
                    };
                }"""
            )
            page.locator("#window-log").click()
            expect(page.locator("#window-phase")).to_have_text("logged")
            assert not page_errors, page_errors
            assert not console_errors, console_errors
            page.close()

            browser.close()

    print(
        "browser window: one-shot races, retirement, host errors, and "
        "inert stale callbacks passed"
    )


if __name__ == "__main__":
    main()
