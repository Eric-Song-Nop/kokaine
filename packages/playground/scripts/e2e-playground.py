import json
import os
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

from playwright.sync_api import TimeoutError as PlaywrightTimeoutError
from playwright.sync_api import expect, sync_playwright


URL = os.environ.get("KOKAINE_PLAYGROUND_URL", "http://127.0.0.1:4175")
CHROMIUM = os.environ.get(
    "PLAYWRIGHT_CHROMIUM_EXECUTABLE",
    str(
        Path.home()
        / "Library/Caches/ms-playwright/chromium-1208/chrome-mac-arm64"
        / "Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
    ),
)


def step(label):
    print(f"[e2e] {label}", flush=True)


with sync_playwright() as playwright:
    launch_options = {"headless": True}
    if CHROMIUM and Path(CHROMIUM).is_file():
        launch_options["executable_path"] = CHROMIUM
    browser = playwright.chromium.launch(**launch_options)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.set_default_timeout(180_000)

    requests = []
    websocket_urls = []
    page_errors = []
    console_messages = []
    failed_requests = []
    page.on("request", lambda request: requests.append(request.url))
    page.on("websocket", lambda socket: websocket_urls.append(socket.url))
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on("console", lambda message: console_messages.append(
        f"{message.type}: {message.text}"
    ))
    page.on("requestfailed", lambda request: failed_requests.append(
        f"{request.url}: {request.failure}"
    ))

    page.goto(URL, wait_until="domcontentloaded")
    page.wait_for_function(
        "() => globalThis.crossOriginIsolated === true "
        "&& typeof globalThis.SharedArrayBuffer === 'function'"
    )
    step("cross-origin isolation ready")

    page.locator(".signal-chip--build").wait_for(state="visible")
    page.wait_for_function(
        "() => document.querySelector('.signal-chip--build')?.textContent?.includes('Built in')"
    )
    step("WASM build ready")
    page.wait_for_function(
        "() => document.querySelector('.signal-chip--ready')?.textContent?.includes('LSP ready')"
    )
    step("WASM LSP ready")
    problem_chip = page.locator(".signal-chip--problem")
    try:
        problem_chip.wait_for(state="visible", timeout=10_000)
    except PlaywrightTimeoutError:
        pass
    initial_problem_count = 0
    if problem_chip.count() > 0:
        initial_problem_count = int(re.search(r"\d+", problem_chip.inner_text()).group())

    preview_frame_element = page.locator(
        'iframe[title="Kokaine compiled application"]'
    )
    preview_frame_element.wait_for(state="visible")
    sandbox = preview_frame_element.get_attribute("sandbox") or ""
    assert "allow-scripts" in sandbox
    assert "allow-same-origin" not in sandbox

    preview = page.frame_locator('iframe[title="Kokaine compiled application"]')
    try:
        preview.get_by_role("button", name="Increment").wait_for(
            state="visible", timeout=30_000
        )
    except PlaywrightTimeoutError as error:
        preview_text = preview.locator("body").inner_text(timeout=5_000)
        raise AssertionError(json.dumps({
            "previewText": preview_text,
            "pageErrors": page_errors,
            "previewConsole": [
                message for message in console_messages
                if "[Kokaine preview" in message and "cdp-command" not in message
            ][-50:],
            "console": console_messages[-30:],
            "failedRequests": failed_requests,
        }, ensure_ascii=False, indent=2)) from error
    step("sandboxed preview ready")
    counter = preview.locator("strong")
    counter.wait_for(state="visible")
    assert counter.inner_text().strip() == "0"
    preview.get_by_role("button", name="Increment").click()
    expect(counter).to_have_text("1")
    step("preview interaction ready")

    page.get_by_role("tab", name=re.compile(r"^Output")).click()
    generated = page.locator(".code-output code")
    generated.wait_for(state="visible")
    generated_js_chars = len(generated.inner_text())
    assert generated_js_chars > 200
    page.get_by_role("tab", name=re.compile(r"^Preview")).click()
    step("generated output ready")

    editor_surface = page.locator(".monaco-editor").first
    editor_surface.wait_for(state="visible")
    editor_surface.click(position={"x": 240, "y": 180})
    page.keyboard.press("Meta+ArrowDown" if sys.platform == "darwin" else "Control+End")
    page.keyboard.insert_text("\n\n// 中文 UTF-8 framing probe\nval broken = missing-name\n")
    page.wait_for_function(
        "baseline => {"
        "  const text = document.querySelector('.signal-chip--problem')?.textContent ?? '';"
        "  return Number(text.match(/\\d+/)?.[0] ?? 0) > baseline;"
        "}",
        arg=initial_problem_count,
        timeout=30_000,
    )
    page.locator(".signal-chip--ready").wait_for(state="visible")
    diagnostic_problem_count = int(re.search(r"\d+", problem_chip.inner_text()).group())
    step(
        f"Unicode LSP diagnostic ready ({initial_problem_count} -> "
        f"{diagnostic_problem_count})"
    )

    page.get_by_role("button", name="Show DevTools").click()
    devtools_frame_element = page.locator(
        'iframe[title="Kokaine Chromium DevTools"]'
    )
    devtools_frame_element.wait_for(state="visible")
    devtools = page.frame_locator('iframe[title="Kokaine Chromium DevTools"]')
    devtools.locator(".root-view").wait_for(state="visible", timeout=30_000)
    step("self-hosted DevTools ready")

    assert not websocket_urls, f"Unexpected WebSocket connections: {websocket_urls}"
    assert not [url for url in requests if "/api/" in url], "Native API request detected"
    assert not [url for url in requests if "jsdelivr" in url], "External CDN request detected"
    expected_origin = urlparse(URL)
    external_requests = [
        url
        for url in requests
        if urlparse(url).scheme in {"http", "https"}
        and (urlparse(url).scheme, urlparse(url).netloc)
        != (expected_origin.scheme, expected_origin.netloc)
    ]
    assert not external_requests, f"External runtime requests: {external_requests}"
    critical_errors = [
        error
        for error in page_errors
        if "ResizeObserver loop" not in error
    ]
    assert not critical_errors, f"Browser page errors: {critical_errors}"

    result = {
        "crossOriginIsolated": page.evaluate("crossOriginIsolated"),
        "lsp": "ready",
        "initialProblems": initial_problem_count,
        "counter": counter.inner_text().strip(),
        "generatedJsChars": generated_js_chars,
        "sandbox": sandbox,
        "requests": len(requests),
        "websockets": len(websocket_urls),
        "devtools": "loaded",
    }
    print(json.dumps(result, ensure_ascii=False, indent=2))
    browser.close()
