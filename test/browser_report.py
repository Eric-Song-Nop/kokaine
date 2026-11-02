"""End-to-end checks for the fully Kokaine-rendered executable report.

Run after ``make build-report build-counter``.  The suite serves the repository
from an OS-assigned local port so it can run beside a developer server or a
second checkout without contending for a fixed address.
"""

from __future__ import annotations

from contextlib import contextmanager
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread

from playwright.sync_api import expect, sync_playwright


PROJECT_ROOT = Path(__file__).resolve().parents[1]
SECTION_IDS = (
    "abstract",
    "journey",
    "flow-lab",
    "effects",
    "scheduler",
    "batching",
    "dynamic",
    "ownership",
    "comparison",
    "code",
    "wasm",
    "demo",
    "limits",
)


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


def capture_browser_errors(page, label: str, page_errors, console_errors) -> None:
    page.on("pageerror", lambda error: page_errors.append(f"{label}: {error}"))
    page.on(
        "console",
        lambda message: console_errors.append(f"{label}: {message.text}")
        if message.type == "error"
        else None,
    )


def assert_no_horizontal_overflow(page) -> None:
    metrics = page.evaluate(
        """() => ({
            scrollWidth: document.documentElement.scrollWidth,
            clientWidth: document.documentElement.clientWidth,
            viewportWidth: window.innerWidth
        })"""
    )
    assert metrics["scrollWidth"] <= metrics["viewportWidth"], (
        "the report overflows the viewport horizontally: " + repr(metrics)
    )


def assert_report_structure(page) -> None:
    expect(page.locator("h1")).to_have_count(1)
    expect(page.locator(".report-section")).to_have_count(len(SECTION_IDS))
    for section_id in SECTION_IDS:
        expect(page.locator(f"#{section_id}")).to_have_count(1)


def read_int(page, selector: str) -> int:
    content = page.locator(selector).text_content()
    assert content is not None, f"{selector} has no text content"
    return int(content.strip())


def exercise_report(page) -> None:
    # The report shell itself is a single Kokaine mount. Comment markers are
    # expected around live/dynamic ranges, so all assertions target elements.
    assert_report_structure(page)

    toc = page.locator("#toc")
    toc_toggle = page.locator("#toc-toggle")
    expect(toc_toggle).to_have_attribute("aria-expanded", "false")
    expect(toc).to_have_class("toc")
    toc_toggle.dispatch_event("click")
    expect(toc_toggle).to_have_attribute("aria-expanded", "true")
    expect(toc).to_have_class("toc is-open")
    toc_toggle.dispatch_event("click")
    expect(toc_toggle).to_have_attribute("aria-expanded", "false")
    expect(toc).to_have_class("toc")

    # A TOC selection also owns and closes the drawer state.
    toc_toggle.dispatch_event("click")
    flow_link = toc.locator('a[href="#flow-lab"]')
    flow_link.click()
    expect(flow_link).to_have_class("is-active")
    expect(toc).to_have_class("toc")

    # Manual scrolling and hash/history navigation feed generic browser
    # geometry into the Koka-owned section-selection policy.
    page.locator("#scheduler").evaluate(
        "node => node.scrollIntoView({block: 'start', behavior: 'instant'})"
    )
    scheduler_link = toc.locator('a[href="#scheduler"]')
    expect(scheduler_link).to_have_class("is-active")
    expect(scheduler_link).to_have_attribute("aria-current", "true")
    page.evaluate("window.location.hash = '#wasm'")
    wasm_link = toc.locator('a[href="#wasm"]')
    expect(wasm_link).to_have_class("is-active")
    expect(wasm_link).to_have_attribute("aria-current", "true")

    # Pure derivations and explicit accumulated state share one reactive root.
    expect(page.locator("#kk-flow-count")).to_have_text("2")
    expect(page.locator("#kk-flow-square")).to_have_text("4")
    expect(page.locator("#kk-flow-revision")).to_have_text("1")
    expect(page.locator("#kk-flow-peak")).to_have_text("2")
    page.locator("#kk-flow-plus").click()
    expect(page.locator("#kk-flow-count")).to_have_text("3")
    expect(page.locator("#kk-flow-square")).to_have_text("9")
    expect(page.locator("#kk-flow-parity")).to_have_text("奇数")
    expect(page.locator("#kk-flow-revision")).to_have_text("2")
    expect(page.locator("#kk-flow-peak")).to_have_text("3")
    page.locator("#kk-flow-batch").click()
    expect(page.locator("#kk-flow-count")).to_have_text("6")
    expect(page.locator("#kk-flow-square")).to_have_text("36")
    expect(page.locator("#kk-flow-parity")).to_have_text("偶数")
    expect(page.locator("#kk-flow-revision")).to_have_text("3")
    expect(page.locator("#kk-flow-peak")).to_have_text("6")
    page.locator("#kk-flow-reset").click()
    expect(page.locator("#kk-flow-count")).to_have_text("2")
    expect(page.locator("#kk-flow-square")).to_have_text("4")
    expect(page.locator("#kk-flow-revision")).to_have_text("4")
    expect(page.locator("#kk-flow-peak")).to_have_text("6")

    # Feature atlas structure is replaced by a Kokaine dynamic region.
    control_tab = page.locator("#kk-feature-control")
    control_tab.click()
    expect(control_tab).to_have_attribute("aria-pressed", "true")
    expect(page.locator("#kk-feature-panel")).to_contain_text(
        "FUN / CTL / RAW CTL"
    )

    # Walk a scheduler scenario, reset it, then pause and resume the
    # lifecycle-owned Kokaine timer without skipping semantic steps.
    expect(page.locator("#scheduler-progress")).to_have_text("0 / 0")
    expect(page.locator("#diamond-count strong span")).to_have_text("2")
    page.locator("#scheduler-plus-one").click()
    expect(page.locator("#scheduler-progress")).to_have_text("1 / 6")
    expect(page.locator("#diamond-count strong span")).to_have_text("3")
    expect(page.locator("#diamond-parity")).to_have_class(
        "diamond-node is-pending"
    )
    expect(page.locator("#derive-queue li")).to_have_count(2)
    page.locator("#scheduler-step").click()
    expect(page.locator("#scheduler-progress")).to_have_text("2 / 6")
    expect(page.locator("#diamond-parity")).to_have_class(
        "diamond-node is-running"
    )
    page.locator("#scheduler-reset").click()
    expect(page.locator("#scheduler-progress")).to_have_text("0 / 0")
    expect(page.locator("#diamond-count strong span")).to_have_text("2")
    scheduler_auto = page.locator("#scheduler-auto")
    scheduler_auto.click()
    expect(scheduler_auto).to_have_attribute("aria-pressed", "true")
    expect(scheduler_auto).to_have_text("暂停")
    expect(page.locator("#scheduler-progress")).to_have_text("1 / 6")
    scheduler_auto.click()
    expect(scheduler_auto).to_have_attribute("aria-pressed", "false")
    expect(scheduler_auto).to_have_text("自动播放")
    page.wait_for_timeout(1_000)
    expect(page.locator("#scheduler-progress")).to_have_text("1 / 6")
    scheduler_auto.click()
    expect(scheduler_auto).to_have_attribute("aria-pressed", "true")
    expect(page.locator("#scheduler-progress")).to_have_text(
        "6 / 6", timeout=7_000
    )
    expect(scheduler_auto).to_have_attribute("aria-pressed", "false")
    expect(scheduler_auto).to_have_text("自动播放")
    expect(page.locator("#diamond-count strong span")).to_have_text("4")
    expect(page.locator("#diamond-summary")).to_have_class(
        "diamond-node is-live"
    )

    # Manual intervention at the last step must retire autoplay immediately,
    # rather than leaving the toggle pressed until its old timeout arrives.
    scheduler_auto.click()
    scheduler_step = page.locator("#scheduler-step")
    for _ in range(5):
        scheduler_step.dispatch_event("click")
    expect(page.locator("#scheduler-progress")).to_have_text("6 / 6")
    expect(scheduler_auto).to_have_attribute("aria-pressed", "false")
    expect(scheduler_auto).to_have_text("自动播放")

    # The fixed ten-write scenario is rendered from Koka lists rather than
    # imperative replaceChildren calls.
    writes_ten = page.locator('[data-writes="10"]')
    writes_ten.click()
    expect(writes_ten).to_have_attribute("aria-pressed", "true")
    expect(writes_ten).to_have_class("segment is-active")
    expect(page.locator('[data-value="naive-compute"]')).to_have_text("20")
    expect(page.locator('[data-value="batch-compute"]')).to_have_text("2")
    expect(page.locator('[data-value="naive-dom"]')).to_have_text("30")
    expect(page.locator('[data-value="batch-dom"]')).to_have_text("3")
    expect(page.locator("#naive-timeline li")).to_have_count(30)
    expect(page.locator("#batch-timeline li")).to_have_count(12)
    expect(page.locator("#batch-result")).to_contain_text(
        "10 次 write/version/notify"
    )

    # Editing the inactive source must not resume the selected output suffix.
    dynamic_output = page.locator("#kk-dynamic-output")
    dynamic_runs = page.locator("#kk-dynamic-runs")
    expect(dynamic_output).to_have_text("访客 Koka")
    initial_runs = read_int(page, "#kk-dynamic-runs")
    page.locator("#kk-dynamic-count").fill("77")
    expect(dynamic_output).to_have_text("访客 Koka")
    expect(dynamic_runs).to_have_text(str(initial_runs))
    page.locator("#kk-dynamic-name").fill("Ada")
    expect(dynamic_output).to_have_text("访客 Ada")
    expect(dynamic_runs).to_have_text(str(initial_runs + 1))
    page.locator("#kk-mode-count").click()
    expect(dynamic_output).to_have_text("当前计数 77")
    selected_count_runs = read_int(page, "#kk-dynamic-runs")
    page.locator("#kk-dynamic-name").fill("Retired branch")
    expect(dynamic_output).to_have_text("当前计数 77")
    expect(dynamic_runs).to_have_text(str(selected_count_runs))

    # Event-created effect and cleanup are retired with their dynamic branch.
    expect(page.locator("#kk-owner-active")).to_have_text("NO")
    expect(page.locator("#kk-owner-cleanups")).to_have_text("0")
    old_arm = page.locator("#kk-owner-arm").element_handle()
    page.locator("#kk-owner-arm").click()
    expect(page.locator("#kk-owner-active")).to_have_text("YES")
    expect(page.locator("#kk-owner-arm")).to_be_disabled()
    expect(page.locator("#kk-owner-runs")).to_have_text("1")
    page.locator("#kk-owner-toggle").click()
    expect(page.locator("#kk-owner-active")).to_have_text("NO")
    expect(page.locator("#kk-owner-cleanups")).to_have_text("1")
    expect(page.locator("#kk-owner-region")).to_contain_text("RETIRED")
    assert old_arm is not None
    assert not old_arm.evaluate("node => node.isConnected")
    old_arm.evaluate(
        """node => node.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true
        }))"""
    )
    owner_runs = read_int(page, "#kk-owner-runs")
    page.locator("#kk-flow-plus").click()
    expect(page.locator("#kk-owner-runs")).to_have_text(str(owner_runs))
    expect(page.locator("#kk-owner-active")).to_have_text("NO")

    # Framework routes are Koka data projected through a dynamic region.
    branch_scenario = page.locator('[data-scenario="branch"]')
    branch_scenario.click()
    expect(branch_scenario).to_have_attribute("aria-pressed", "true")
    kokaine_card = page.locator('[data-framework="kokaine"]')
    expect(kokaine_card.locator("[data-route]")).to_contain_text(
        "outer K Pending"
    )
    expect(kokaine_card.locator("[data-route]")).to_contain_text(
        "publish Live branch"
    )
    expect(kokaine_card.locator("[data-work]")).to_have_attribute(
        "style", "width: 39%"
    )
    expect(kokaine_card.locator(".work-meter em")).to_have_text(
        "continuation frame"
    )

    # Click selection and keyboard selection both update ARIA state and panel
    # visibility without an external tab controller.
    effect_tab = page.locator("#code-tab-effect")
    effect_tab.click()
    expect(effect_tab).to_have_attribute("aria-selected", "true")
    expect(effect_tab).to_be_focused()
    expect(page.locator("#code-panel-effect")).to_be_visible()
    expect(page.locator("#code-panel-signal")).to_be_hidden()
    effect_tab.press("ArrowRight")
    expect(page.locator("#code-tab-state")).to_have_attribute(
        "aria-selected", "true"
    )
    expect(page.locator("#code-tab-state")).to_be_focused()
    expect(page.locator("#code-panel-state")).to_be_visible()
    expect(page.locator("#code-panel-effect")).to_be_hidden()

    # Rebuilding the dynamic iframe region produces a new revision URL and a
    # disconnected old generation, while the embedded counter still mounts.
    frame = page.locator("#koka-demo")
    expect(frame).to_have_attribute(
        "src", "../../examples/counter/index.html?revision=0"
    )
    old_frame = frame.element_handle()
    page.locator("#demo-reload").click()
    expect(page.locator("#koka-demo")).to_have_attribute(
        "src", "../../examples/counter/index.html?revision=1"
    )
    assert old_frame is not None
    assert not old_frame.evaluate("node => node.isConnected")
    expect(
        page.frame_locator("#koka-demo").locator("#active-value")
    ).to_have_text("0")

    assert_no_horizontal_overflow(page)


def main() -> None:
    page_errors: list[str] = []
    console_errors: list[str] = []

    with serve_project() as origin:
        report_url = f"{origin}/docs/algebraic-effects-ui-report/"
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch(headless=True)

            desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
            desktop.set_default_timeout(10_000)
            capture_browser_errors(
                desktop, "desktop", page_errors, console_errors
            )
            desktop.goto(report_url)
            desktop.wait_for_load_state("networkidle")
            expect(desktop.locator("#abstract")).to_be_visible()
            assert_no_horizontal_overflow(desktop)
            exercise_report(desktop)

            mobile = browser.new_page(viewport={"width": 375, "height": 812})
            mobile.set_default_timeout(10_000)
            capture_browser_errors(mobile, "mobile", page_errors, console_errors)
            mobile.goto(f"{report_url}#scheduler")
            mobile.wait_for_load_state("networkidle")
            expect(mobile.locator("#abstract")).to_be_visible()
            assert_report_structure(mobile)
            assert_no_horizontal_overflow(mobile)
            expect(
                mobile.locator('#toc a[href="#scheduler"]')
            ).to_have_attribute("aria-current", "true")

            # Verify the small-screen drawer while returning it to its closed
            # state before the final overflow measurement.
            expect(mobile.locator("#toc")).to_have_class("toc")
            mobile.locator("#toc-toggle").click()
            expect(mobile.locator("#toc")).to_have_class("toc is-open")
            expect(mobile.locator("#toc-toggle")).to_have_attribute(
                "aria-expanded", "true"
            )
            mobile.locator('#toc a[href="#abstract"]').click()
            expect(mobile.locator("#toc")).to_have_class("toc")
            expect(mobile.locator("#toc-toggle")).to_have_attribute(
                "aria-expanded", "false"
            )
            assert_no_horizontal_overflow(mobile)

            # An invalid percent escape is still a legal raw URL fragment.
            # It must not abort main before the Kokaine window listeners own
            # later navigation and scroll turns.
            mobile.goto(f"{report_url}#%")
            mobile.wait_for_load_state("networkidle")
            expect(mobile.locator("#abstract")).to_be_visible()
            mobile.locator("#scheduler").evaluate(
                "node => node.scrollIntoView({block: 'start', behavior: 'instant'})"
            )
            expect(
                mobile.locator('#toc a[href="#scheduler"]')
            ).to_have_attribute("aria-current", "true")
            assert_no_horizontal_overflow(mobile)

            browser.close()

    assert not page_errors, "browser exceptions:\n" + "\n".join(page_errors)
    assert not console_errors, "browser console errors:\n" + "\n".join(
        console_errors
    )
    print(
        "browser report: Kokaine rendering, controls, dynamic ownership, "
        "iframe replacement, and responsive layout passed"
    )


if __name__ == "__main__":
    main()
