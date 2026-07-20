"""Run the Koka Pocket example through PocketJS's real browser/WASM host."""

from __future__ import annotations

import os
import socket
import subprocess
import tempfile
import time
from http.client import HTTPConnection
from pathlib import Path
from urllib.request import urlopen

from playwright.sync_api import expect, sync_playwright


PROJECT_ROOT = Path(__file__).resolve().parents[1]


def available_port() -> int:
    with socket.socket() as listener:
        listener.bind(("127.0.0.1", 0))
        return listener.getsockname()[1]


def wait_for_server(process: subprocess.Popen[str], url: str) -> None:
    deadline = time.monotonic() + 30
    while time.monotonic() < deadline:
        if process.poll() is not None:
            output = process.stdout.read() if process.stdout else ""
            raise RuntimeError(f"PocketJS example server exited early:\n{output}")
        try:
            with urlopen(url, timeout=0.5) as response:
                if response.status == 200:
                    return
        except OSError:
            time.sleep(0.1)
    raise TimeoutError(f"PocketJS example server did not become ready: {url}")


def request_status(port: int, path: str) -> int:
    connection = HTTPConnection("127.0.0.1", port, timeout=2)
    try:
        connection.request("GET", path)
        response = connection.getresponse()
        response.read()
        return response.status
    finally:
        connection.close()


port = available_port()
origin = f"http://127.0.0.1:{port}"
environment = os.environ.copy()
environment["PORT"] = str(port)
server = subprocess.Popen(
    [environment.get("BUN", "bun"), "examples/pocketjs/serve.ts"],
    cwd=PROJECT_ROOT,
    env=environment,
    stdout=subprocess.PIPE,
    stderr=subprocess.STDOUT,
    text=True,
)

try:
    wait_for_server(server, origin)
    assert request_status(port, "/dist/") == 404
    assert request_status(port, "/%") == 400
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1100, "height": 850})
        page.add_init_script(
            """(() => {
                const calls = globalThis.__kokainePocketHostCalls = [];
                const wrapped = new WeakSet();
                let current;
                Object.defineProperty(globalThis, 'ui', {
                    configurable: true,
                    get: () => current,
                    set(value) {
                        current = value;
                        if (!value || wrapped.has(value)) return;
                        wrapped.add(value);
                        for (const name of [
                            'setText', 'replaceText', 'setFocus',
                            'loadFontAtlas'
                        ]) {
                            const original = value[name];
                            value[name] = (...args) => {
                                const result = original(...args);
                                const loggedArgs = args.map(arg =>
                                    ArrayBuffer.isView(arg)
                                        ? { byteLength: arg.byteLength }
                                        : arg
                                );
                                calls.push([name, ...loggedArgs]);
                                return result;
                            };
                        }
                    }
                });
            })()"""
        )
        page_errors: list[str] = []
        console_errors: list[str] = []
        response_errors: list[str] = []
        page.on("pageerror", lambda error: page_errors.append(str(error)))
        page.on(
            "console",
            lambda message: console_errors.append(message.text)
            if message.type == "error"
            else None,
        )
        page.on(
            "response",
            lambda response: response_errors.append(
                f"{response.status} {response.url}"
            )
            if response.status >= 400
            else None,
        )

        response = page.goto(f"{origin}/?demo=kokaine-pocket-demo")
        assert response is not None and response.ok
        page.wait_for_load_state("networkidle")
        expect(page.locator("#log")).to_contain_text("PocketJS wasm ready")
        expect(page.locator("#log")).to_contain_text("loaded kokaine-pocket-demo")
        expect(page.locator("#screen")).to_be_visible()
        assert page.evaluate("typeof globalThis.frame") == "function"
        host_calls = page.evaluate("globalThis.__kokainePocketHostCalls")
        assert any(
            len(call) > 2
            and call[0] in {"setText", "replaceText"}
            and call[2] == "Count 0"
            for call in host_calls
        ), f"initial Koka text did not reach Pocket HostOps: {host_calls}"
        assert any(
            call[0] == "loadFontAtlas"
            and call[1].get("byteLength", 0) > 0
            for call in host_calls
        ), f"PocketJS did not load the example's baked font atlas: {host_calls}"
        focus_calls_before = sum(call[0] == "setFocus" for call in host_calls)

        distinct_colors = page.locator("#screen").evaluate(
            """canvas => {
                const bytes = canvas.getContext('2d')
                    .getImageData(0, 0, canvas.width, canvas.height).data;
                const pixels = new Uint32Array(
                    bytes.buffer, bytes.byteOffset, bytes.byteLength / 4
                );
                const colors = new Set();
                for (const pixel of pixels) {
                    colors.add(pixel);
                    if (colors.size > 32) break;
                }
                return colors.size;
            }"""
        )
        assert distinct_colors > 8, "PocketJS browser canvas rendered a flat frame"
        bright_text_pixels = page.locator("#screen").evaluate(
            """canvas => {
                const { data } = canvas.getContext('2d').getImageData(20, 18, 260, 102);
                let bright = 0;
                for (let i = 0; i < data.length; i += 4) {
                    if (data[i] > 170 && data[i + 1] > 170 &&
                        data[i + 2] > 170 && data[i + 3] > 0) bright++;
                }
                return bright;
            }"""
        )
        assert bright_text_pixels > 20, (
            "Koka text did not rasterize into the Canvas; "
            f"HostOps calls: {host_calls}"
        )

        for selector in ['[data-btn="0x0040"]', '[data-btn="0x2000"]']:
            button = page.locator(selector)
            button.dispatch_event("mousedown")
            page.wait_for_timeout(80)
            button.dispatch_event("mouseup")
            page.wait_for_timeout(80)

        page.wait_for_function(
            """globalThis.__kokainePocketHostCalls.some(
                ([name, , text]) => name === 'replaceText' && text === 'Count 1'
            )"""
        )
        host_calls_after = page.evaluate("globalThis.__kokainePocketHostCalls")
        focus_calls_after = sum(call[0] == "setFocus" for call in host_calls_after)
        assert focus_calls_after > focus_calls_before, (
            "Pocket DOWN input did not move native focus"
        )
        expect(page.locator("#log")).not_to_contain_text("ERROR")

        screenshot = Path(
            os.environ.get(
                "POCKETJS_SCREENSHOT",
                Path(tempfile.gettempdir()) / "kokaine-pocketjs-browser.png",
            )
        )
        page.screenshot(path=screenshot, full_page=True)
        browser.close()

        assert page_errors == [], page_errors
        assert console_errors == [], console_errors
        assert response_errors == [], response_errors
        print(
            "pocketjs-browser: rendered visible text and updated Count 1 "
            f"({screenshot})"
        )
finally:
    server.terminate()
    try:
        server.wait(timeout=5)
    except subprocess.TimeoutExpired:
        server.kill()
        server.wait(timeout=5)
