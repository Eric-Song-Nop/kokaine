"""End-to-end checks for the jsweb Continuation Lab example.

The public example exercises dynamic tracked suffixes, equality publication
boundaries, stateful memo entries, untracked sampling, explicit batching,
host re-entry, and structural cleanup. The separate lifecycle fixture keeps
the lower-level disposal and stale-listener stress checks.
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


def read_int(page, selector: str) -> int:
    return int(page.locator(selector).text_content())


def assert_active_state(page, value: int) -> None:
    """Assert the direct public projections of the selected source."""
    parity = "EVEN" if value % 2 == 0 else "ODD"
    expect(page.locator("#active-value")).to_have_text(str(value))
    expect(page.locator("#square-value")).to_have_text(str(value * value))
    expect(page.locator("#parity-value")).to_have_text(parity)
    expect(page.locator("#reading-panel")).to_have_class(
        f"reading-card reading-card--{parity.lower()}"
    )
    assert page.locator("#reading-panel").evaluate(
        "node => node.style.getPropertyValue('--level').trim()"
    ) == str(abs(value) % 9)


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
        assert desktop.evaluate("__kokaineLifecycle.childRuns()") == 1, (
            "event-created child did not bootstrap"
        )
        assert desktop.evaluate("__kokaineLifecycle.childCleanups()") == 0

        desktop.locator("#branch-toggle").click()
        expect(desktop.locator("#new-branch")).to_be_visible()
        assert desktop.evaluate("__kokaineLifecycle.childCleanups()") == 1, (
            "event-created child escaped its registering continuation branch"
        )
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
        assert desktop.evaluate("__kokaineLifecycle.childRuns()") == 1, (
            "a retired event-created child reacted to a later source write"
        )

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
        assert desktop.evaluate("__kokaineLifecycle.childRuns()") == 1
        assert desktop.evaluate("__kokaineLifecycle.childCleanups()") == 1

        # Initial bootstrap publishes each stateful/effect entry exactly once.
        assert_active_state(desktop, 0)
        expect(desktop.locator("#channel-a")).to_have_text("0")
        expect(desktop.locator("#channel-b")).to_have_text("10")
        expect(desktop.locator("#total-value")).to_have_text("10")
        expect(desktop.locator("#peak-value")).to_have_text("0")
        expect(desktop.locator("#band-index")).to_have_text("ZERO")
        expect(desktop.locator("#band-entered-at")).to_have_text("0")
        expect(desktop.locator("#band-revisions")).to_have_text("1")
        expect(desktop.locator("#sampled-operator")).to_have_text("Koka")
        expect(desktop.locator("#heartbeat")).to_have_text("0")
        expect(desktop.locator("#heartbeat-runs")).to_have_text("1")
        expect(desktop.locator("#effect-runs")).to_have_text("1")
        expect(desktop.locator("#effect-snapshot")).to_have_text("A → 0")
        expect(desktop.locator("#probe-active")).to_have_text("NO")
        expect(desktop.locator("#probe-runs")).to_have_text("0")
        expect(desktop.locator("#probe-cleanups")).to_have_text("0")

        # An inactive source updates fan-in but cannot resume the selected suffix.
        initial_scope = desktop.locator("#channel-scope").element_handle()
        desktop.locator("#channel-b-inc").click()
        expect(desktop.locator("#channel-b")).to_have_text("11")
        expect(desktop.locator("#total-value")).to_have_text("11")
        assert_active_state(desktop, 0)
        expect(desktop.locator("#effect-runs")).to_have_text("1")
        expect(desktop.locator("#band-revisions")).to_have_text("1")
        assert initial_scope.evaluate("node => node.isConnected"), (
            "an inactive source write rebuilt the structural region"
        )

        # Switching the selector retires the old branch and captures channel B.
        desktop.locator("#active-b").check()
        assert_active_state(desktop, 11)
        expect(desktop.locator("#effect-runs")).to_have_text("2")
        expect(desktop.locator("#effect-snapshot")).to_have_text("B → 11")
        expect(desktop.locator("#band-index")).to_have_text("POSITIVE")
        expect(desktop.locator("#band-entered-at")).to_have_text("11")
        expect(desktop.locator("#band-revisions")).to_have_text("2")
        assert not initial_scope.evaluate("node => node.isConnected"), (
            "the old selected-channel region generation stayed connected"
        )

        # Channel A is now absent from the active continuation suffix.
        desktop.locator("#channel-a-inc").click()
        expect(desktop.locator("#channel-a")).to_have_text("1")
        expect(desktop.locator("#total-value")).to_have_text("12")
        assert_active_state(desktop, 11)
        expect(desktop.locator("#effect-runs")).to_have_text("2")

        # derive-by recomputes but its equality boundary suppresses publication.
        desktop.locator("#active-inc").click()
        assert_active_state(desktop, 12)
        expect(desktop.locator("#band-index")).to_have_text("POSITIVE")
        expect(desktop.locator("#band-entered-at")).to_have_text("11")
        expect(desktop.locator("#band-revisions")).to_have_text("2")
        expect(desktop.locator("#peak-value")).to_have_text("12")

        # The greeting tracks input, while the untracked sample waits for active.
        operator = desktop.get_by_label("OPERATOR")
        unsafe_name = "Ada <effect> & 李 λ"
        operator.fill(unsafe_name)
        expect(operator).to_have_value(unsafe_name)
        expect(desktop.locator("#greeting")).to_have_text(
            f"Signal received, {unsafe_name}."
        )
        assert desktop.locator("#greeting").evaluate(
            "node => node.childElementCount"
        ) == 0, "an operator name was interpreted as HTML"
        expect(desktop.locator("#sampled-operator")).to_have_text("Koka")
        desktop.locator("#active-inc").click()
        assert_active_state(desktop, 13)
        expect(desktop.locator("#sampled-operator")).to_have_text(unsafe_name)
        expect(desktop.locator("#peak-value")).to_have_text("13")

        # A same-value signal still resumes its downstream state entry.
        effect_before_pulses = read_int(desktop, "#effect-runs")
        desktop.locator("#pulse-heartbeat").click()
        desktop.locator("#pulse-heartbeat").click()
        expect(desktop.locator("#heartbeat")).to_have_text("0")
        expect(desktop.locator("#heartbeat-runs")).to_have_text("3")
        assert read_int(desktop, "#effect-runs") == effect_before_pulses

        # The explicit swap batch exposes only its final coherent DOM state.
        desktop.evaluate(
            """() => {
                const active = document.querySelector('#active-value');
                const total = document.querySelector('#total-value');
                globalThis.__labMutations = { active: [], total: [] };
                globalThis.__labObservers = [
                    new MutationObserver(records => {
                        records.forEach(() => {
                            globalThis.__labMutations.active.push(active.textContent);
                        });
                    }),
                    new MutationObserver(records => {
                        records.forEach(() => {
                            globalThis.__labMutations.total.push(total.textContent);
                        });
                    })
                ];
                globalThis.__labObservers[0].observe(active, {
                    characterData: true, childList: true, subtree: true
                });
                globalThis.__labObservers[1].observe(total, {
                    characterData: true, childList: true, subtree: true
                });
            }"""
        )
        desktop.locator("#swap-batch").click()
        expect(desktop.locator("#channel-a")).to_have_text("13")
        expect(desktop.locator("#channel-b")).to_have_text("1")
        expect(desktop.locator("#active-value")).to_have_text("1")
        expect(desktop.locator("#total-value")).to_have_text("14")
        desktop.evaluate("() => new Promise(resolve => setTimeout(resolve, 0))")
        mutations = desktop.evaluate(
            """() => {
                globalThis.__labObservers.forEach(observer => observer.disconnect());
                return globalThis.__labMutations;
            }"""
        )
        assert mutations["active"] == ["1"], (
            f"swap exposed intermediate active DOM states: {mutations!r}"
        )
        assert mutations["total"] == [], (
            f"equal fan-in output republished during swap: {mutations!r}"
        )
        expect(desktop.locator("#peak-value")).to_have_text("13")

        # Cross equality bands and verify previous state advances only there.
        zero = desktop.get_by_role("button", name="ZERO")
        zero.click()
        assert_active_state(desktop, 0)
        expect(desktop.locator("#band-index")).to_have_text("ZERO")
        expect(desktop.locator("#band-entered-at")).to_have_text("0")
        expect(desktop.locator("#band-revisions")).to_have_text("3")
        desktop.locator("#active-dec").click()
        assert_active_state(desktop, -1)
        expect(desktop.locator("#band-index")).to_have_text("NEGATIVE")
        expect(desktop.locator("#band-entered-at")).to_have_text("-1")
        expect(desktop.locator("#band-revisions")).to_have_text("4")
        desktop.locator("#active-dec").click()
        assert_active_state(desktop, -2)
        expect(desktop.locator("#band-entered-at")).to_have_text("-1")
        expect(desktop.locator("#band-revisions")).to_have_text("4")

        for _ in range(12):
            desktop.locator("#active-dec").click()
        assert_active_state(desktop, -14)
        expect(desktop.locator("#peak-value")).to_have_text("14")

        # checked-live and disabled-live update actual DOM properties.
        desktop.locator("#freeze-toggle").check()
        expect(desktop.locator("#freeze-toggle")).to_be_checked()
        expect(desktop.locator("#active-inc")).to_be_disabled()
        expect(desktop.locator("#active-b")).to_be_disabled()
        expect(desktop.locator("#operator")).to_be_disabled()
        frozen_value = read_int(desktop, "#channel-b")
        desktop.locator("#active-inc").evaluate("node => node.click()")
        assert read_int(desktop, "#channel-b") == frozen_value
        desktop.locator("#freeze-toggle").uncheck()
        expect(desktop.locator("#active-inc")).to_be_enabled()
        desktop.locator("#active-inc").click()
        assert_active_state(desktop, -13)

        # Full callback capability preserves preventDefault; equal sets do not
        # publish or replace the stable structural branch.
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
        assert_active_state(desktop, 0)
        stable_scope = desktop.locator("#channel-scope").element_handle()
        stable_effect_runs = read_int(desktop, "#effect-runs")
        stable_band_revisions = read_int(desktop, "#band-revisions")
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
        assert stable_scope.evaluate("node => node.isConnected"), (
            "equal source writes rebuilt the stable region"
        )
        assert read_int(desktop, "#effect-runs") == stable_effect_runs
        assert read_int(desktop, "#band-revisions") == stable_band_revisions

        # Event-created child work belongs to this exact region generation.
        armed_scope = desktop.locator("#channel-scope").element_handle()
        old_arm = desktop.locator("#probe-arm").element_handle()
        desktop.locator("#probe-arm").click()
        expect(desktop.locator("#probe-active")).to_have_text("YES")
        expect(desktop.locator("#probe-arm")).to_be_disabled()
        expect(desktop.locator("#probe-runs")).to_have_text("1")
        expect(desktop.locator("#probe-cleanups")).to_have_text("0")
        desktop.locator("#active-inc").click()
        expect(desktop.locator("#probe-runs")).to_have_text("2")
        assert armed_scope.evaluate("node => node.isConnected"), (
            "a selected source write rebuilt the region instead of its binding"
        )
        desktop.locator("#pulse-heartbeat").click()
        expect(desktop.locator("#probe-runs")).to_have_text("3")

        desktop.locator("#active-b").uncheck()
        expect(desktop.locator("#probe-active")).to_have_text("NO")
        expect(desktop.locator("#probe-cleanups")).to_have_text("1")
        assert not armed_scope.evaluate("node => node.isConnected")
        retired_runs = read_int(desktop, "#probe-runs")
        old_arm.evaluate(
            """node => node.dispatchEvent(new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            }))"""
        )
        desktop.locator("#pulse-heartbeat").click()
        assert read_int(desktop, "#probe-runs") == retired_runs, (
            "a retired event-created child resumed after branch replacement"
        )
        expect(desktop.locator("#probe-active")).to_have_text("NO")

        desktop.locator("#probe-arm").click()
        expect(desktop.locator("#probe-active")).to_have_text("YES")
        assert read_int(desktop, "#probe-runs") == retired_runs + 1
        second_scope = desktop.locator("#channel-scope").element_handle()
        desktop.locator("#probe-toggle").uncheck()
        expect(desktop.locator("#probe-active")).to_have_text("NO")
        expect(desktop.locator("#probe-cleanups")).to_have_text("2")
        assert not second_scope.evaluate("node => node.isConnected")
        hidden_scope = desktop.locator("#channel-scope").element_handle()
        desktop.locator("#probe-toggle").check()
        assert not hidden_scope.evaluate("node => node.isConnected")
        expect(desktop.locator("#probe-arm")).to_be_visible()

        # Restore public defaults through a multi-source batch, then stress the
        # captured read suffixes with synchronous browser event delivery.
        desktop.locator("#reset-batch").click()
        expect(desktop.locator("#channel-a")).to_have_text("0")
        expect(desktop.locator("#channel-b")).to_have_text("10")
        expect(desktop.locator("#active-b")).not_to_be_checked()
        expect(desktop.locator("#operator")).to_have_value("Koka")
        assert_active_state(desktop, 0)
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
        assert_active_state(desktop, 100)
        expect(desktop.locator("#channel-a")).to_have_text("100")
        expect(desktop.locator("#channel-b")).to_have_text("10")
        expect(desktop.locator("#total-value")).to_have_text("110")
        assert_no_horizontal_overflow(desktop)

        source_box = desktop.locator("#source-board").bounding_box()
        ledger_box = desktop.locator("#continuation-ledger").bounding_box()
        assert ledger_box["x"] >= source_box["x"] + source_box["width"] - 2, (
            "the desktop continuation ledger did not sit beside the source board"
        )

        ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)
        desktop.screenshot(
            path=ARTIFACT_DIR / "continuation-lab-desktop.png", full_page=True
        )

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
        assert_active_state(mobile, 0)
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
        assert_active_state(mobile, -16)
        mobile.get_by_label("OPERATOR").fill("移动 λ")
        expect(mobile.locator("#greeting")).to_have_text("Signal received, 移动 λ.")
        assert_no_horizontal_overflow(mobile)

        mobile_source = mobile.locator("#source-board").bounding_box()
        mobile_ledger = mobile.locator("#continuation-ledger").bounding_box()
        assert mobile_ledger["y"] >= (
            mobile_source["y"] + mobile_source["height"] - 2
        ), "the mobile continuation ledger did not stack below the source board"
        mobile.screenshot(
            path=ARTIFACT_DIR / "continuation-lab-mobile.png", full_page=True
        )

        browser.close()

        assert not page_errors, "browser exceptions:\n" + "\n".join(page_errors)
        assert not console_errors, "browser console errors:\n" + "\n".join(console_errors)
        print(
            "browser: continuation features, batching, host re-entry, lifecycle "
            "churn, DOM safety, disposal, and responsive layout passed"
        )
