import pathlib
import sys

from playwright.sync_api import sync_playwright


url = sys.argv[1]
source_file = pathlib.Path(sys.argv[2])
original = source_file.read_text()

try:
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        page.wait_for_load_state("networkidle")
        assert page.get_by_role("heading", name="Kokaine", exact=True).is_visible()
        source_file.write_text(original.replace('h1("Kokaine")', 'h1("Kokaine Dev")'))
        page.get_by_role("heading", name="Kokaine Dev", exact=True).wait_for(
            state="visible", timeout=30_000
        )
        assert page.locator("strong").inner_text() == "0"
        browser.close()
finally:
    source_file.write_text(original)
