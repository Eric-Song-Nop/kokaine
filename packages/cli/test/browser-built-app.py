import sys

from playwright.sync_api import sync_playwright


url = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:4174"

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page_errors = []
    console_errors = []
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    page.on(
        "console",
        lambda message: console_errors.append(message.text)
        if message.type == "error"
        else None,
    )
    page.goto(url)
    page.wait_for_load_state("networkidle")
    assert page.get_by_role("heading", name="Kokaine").is_visible()
    counter = page.locator("strong")
    assert counter.inner_text() == "0"
    page.get_by_role("button", name="Increment").click()
    assert counter.inner_text() == "1"
    assert page_errors == [], page_errors
    assert console_errors == [], console_errors
    browser.close()
