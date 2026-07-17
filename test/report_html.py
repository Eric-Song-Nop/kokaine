#!/usr/bin/env python3
"""Source-level architecture checks for the Kokaine-owned report page."""

from __future__ import annotations

import re
import sys
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
REPORT_DIR = ROOT / "docs" / "algebraic-effects-ui-report"
REPORT_HTML = REPORT_DIR / "index.html"
COUNTER_HTML = ROOT / "examples" / "counter" / "index.html"
REPORT_ENTRY = ROOT / "examples" / "report.kk"
REPORT_MODULES = ROOT / "examples" / "report"
COUNTER_ENTRY = ROOT / "examples" / "counter.kk"
COUNTER_MODULES = ROOT / "examples" / "counter"
BROWSER_ADAPTER = ROOT / "src" / "kokaine" / "web" / "window.kk"


class ShellParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.lang: str | None = None
        self.scripts: list[dict[str, str | None]] = []
        self.stylesheets: list[str] = []
        self.tags: list[str] = []
        self.buttons = 0
        self.sections = 0
        self.inline_handlers: list[str] = []
        self.app_depth = 0
        self.app_content: list[str] = []

    def handle_starttag(
        self, tag: str, attrs: list[tuple[str, str | None]]
    ) -> None:
        attributes = dict(attrs)
        self.tags.append(tag)
        if self.app_depth:
            self.app_depth += 1
            self.app_content.append(f"<{tag}>")
        elif attributes.get("id") == "app":
            self.app_depth = 1
        if tag == "html":
            self.lang = attributes.get("lang")
        if element_id := attributes.get("id"):
            self.ids.append(element_id)
        if tag == "script":
            self.scripts.append(attributes)
        if tag == "link" and attributes.get("rel") == "stylesheet":
            if href := attributes.get("href"):
                self.stylesheets.append(href)
        if tag == "button":
            self.buttons += 1
        if tag == "section":
            self.sections += 1
        self.inline_handlers.extend(
            name for name, _ in attrs if name.lower().startswith("on")
        )

    def handle_endtag(self, _tag: str) -> None:
        if self.app_depth:
            self.app_depth -= 1

    def handle_data(self, data: str) -> None:
        if self.app_depth and data.strip():
            self.app_content.append(data.strip())


def parse_shell(path: Path) -> tuple[str, ShellParser]:
    text = path.read_text(encoding="utf-8")
    parser = ShellParser()
    parser.feed(text)
    parser.close()
    return text, parser


def check_minimal_shell(
    path: Path,
    *,
    language: str,
    stylesheet: str,
    module_src: str,
    metadata_count: int,
) -> list[str]:
    text, parser = parse_shell(path)
    label = path.relative_to(ROOT)
    errors: list[str] = []
    if parser.lang != language:
        errors.append(f"{label}: expected lang={language}, got {parser.lang!r}")
    if parser.ids != ["app"]:
        errors.append(f"{label}: entry shell must contain only #app, got {parser.ids}")
    expected_tags = Counter(
        {
            "html": 1,
            "head": 1,
            "meta": metadata_count,
            "title": 1,
            "link": 1,
            "body": 1,
            "div": 1,
            "noscript": 1,
            "script": 1,
        }
    )
    if Counter(parser.tags) != expected_tags:
        errors.append(
            f"{label}: entry shell contains non-minimal markup: "
            f"{dict(Counter(parser.tags))}"
        )
    if parser.app_content:
        errors.append(f"{label}: #app must be an empty mount host")
    if parser.stylesheets != [stylesheet]:
        errors.append(
            f"{label}: expected only stylesheet {stylesheet!r}, got {parser.stylesheets}"
        )
    if parser.scripts != [{"type": "module", "src": module_src}]:
        errors.append(
            f"{label}: expected one compiled Koka module, got {parser.scripts}"
        )
    if parser.buttons or parser.sections:
        errors.append(
            f"{label}: report/application markup leaked into the HTML entry"
        )
    if parser.inline_handlers:
        errors.append(f"{label}: inline event handlers remain: {parser.inline_handlers}")
    if len(text.splitlines()) > 20:
        errors.append(f"{label}: entry is no longer minimal ({len(text.splitlines())} lines)")
    script_bodies = re.findall(r"<script\b[^>]*>(.*?)</script>", text, re.I | re.S)
    if any(body.strip() for body in script_bodies):
        errors.append(f"{label}: inline script content is forbidden")
    return errors


def main() -> int:
    errors = check_minimal_shell(
        REPORT_HTML,
        language="zh-CN",
        stylesheet="./report.css",
        module_src="../../dist/examples_report__main.mjs",
        metadata_count=4,
    )
    errors.extend(
        check_minimal_shell(
            COUNTER_HTML,
            language="en",
            stylesheet="./style.css",
            module_src="../../dist/examples_counter__main.mjs",
            metadata_count=3,
        )
    )

    legacy_script = REPORT_DIR / "report.js"
    if legacy_script.exists():
        errors.append("the handwritten report.js runtime still exists")

    report_paths = [REPORT_ENTRY, *sorted(REPORT_MODULES.glob("*.kk"))]
    counter_paths = [COUNTER_ENTRY, *sorted(COUNTER_MODULES.glob("*.kk"))]
    application_paths = [*report_paths, *counter_paths]
    missing_paths = [path for path in application_paths if not path.exists()]
    if missing_paths:
        errors.append("missing report Koka sources: " + ", ".join(map(str, missing_paths)))
    koka_text = "\n".join(
        path.read_text(encoding="utf-8") for path in report_paths if path.exists()
    )
    application_text = "\n".join(
        path.read_text(encoding="utf-8")
        for path in application_paths
        if path.exists()
    )
    entry_text = REPORT_ENTRY.read_text(encoding="utf-8")
    counter_entry_text = COUNTER_ENTRY.read_text(encoding="utf-8")
    browser_adapter_text = (
        BROWSER_ADAPTER.read_text(encoding="utf-8")
        if BROWSER_ADAPTER.exists()
        else ""
    )

    if 'query("#app")' not in entry_text:
        errors.append("report entry does not mount the single #app host")
    if entry_text.count("mount(") != 1:
        errors.append("report entry must perform exactly one Kokaine mount")
    if entry_text.count("run-async(") != 1:
        errors.append("report entry must own exactly one structured async driver")
    old_island_queries = re.findall(r'query\("#koka-[^"]+-app"\)', entry_text)
    if old_island_queries:
        errors.append("old independently mounted islands remain: " + ", ".join(old_island_queries))
    if 'query("#app")' not in counter_entry_text:
        errors.append("counter entry does not mount the single #app host")
    if counter_entry_text.count("mount(") != 1:
        errors.append("counter entry must perform exactly one Kokaine mount")

    forbidden_koka_shortcuts = {
        "unsafe-trusted-html": "raw HTML shortcut",
        "Raw-html": "raw HTML view",
        "js inline": "report-local JavaScript FFI",
        "extern ": "report-local host extern",
    }
    for token, label in forbidden_koka_shortcuts.items():
        if token in application_text:
            errors.append(
                f"{label} remains in report/counter application Koka ({token!r})"
            )

    if not BROWSER_ADAPTER.exists():
        errors.append("the shared browser host adapter is missing")
    required_async_surface = {
        "setup/await(": "one-shot browser event await",
        "await-window-event(": "typed window event adapter",
        "Ok(fn()": "revocable host subscription disposer",
    }
    for token, label in required_async_surface.items():
        if token not in browser_adapter_text:
            errors.append(f"browser adapter misses {label}: {token!r}")
    forbidden_reentry = {
        "capture-reentry": "captured reactive reentry",
        "reenter(": "manual reactive reentry",
        "event-continuation": "duplicated DOM event continuation",
        "reactive/internal/reentry": "internal reactive reentry import",
        "internal/event-runtime": "internal DOM event runtime import",
    }
    for token, label in forbidden_reentry.items():
        if token in browser_adapter_text:
            errors.append(f"browser adapter contains {label}: {token!r}")

    scheduler_path = REPORT_MODULES / "scheduler.kk"
    scheduler_text = (
        scheduler_path.read_text(encoding="utf-8")
        if scheduler_path.exists()
        else ""
    )
    if "sleep(" not in scheduler_text:
        errors.append("scheduler autoplay must await kokaine/async/web.sleep")
    forbidden_report_callbacks = {
        "listen-window(": "legacy window continuation bridge",
        "after(": "legacy callback timer",
    }
    for token, label in forbidden_report_callbacks.items():
        if token in koka_text:
            errors.append(f"report retains {label}: {token!r}")

    javascript_suffixes = (".js", ".mjs", ".cjs")
    authored_javascript = {
        path.relative_to(ROOT)
        for directory in (REPORT_DIR, REPORT_MODULES, COUNTER_MODULES)
        for suffix in javascript_suffixes
        for path in directory.rglob(f"*{suffix}")
    }
    authored_javascript.update(
        path.relative_to(ROOT)
        for stem in ("report", "counter")
        for suffix in javascript_suffixes
        if (path := ROOT / "examples" / f"{stem}{suffix}").exists()
    )
    if authored_javascript:
        errors.append(
            "authored report/counter JavaScript remains: "
            + ", ".join(map(str, sorted(authored_javascript)))
        )

    required_sections = {
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
    }
    missing_sections = {
        section for section in required_sections if f'id("{section}")' not in koka_text
    }
    if missing_sections:
        errors.append("Koka page misses sections: " + ", ".join(sorted(missing_sections)))

    required_controls = {
        "toc-toggle",
        "scheduler-plus-one",
        "scheduler-plus-two",
        "scheduler-step",
        "scheduler-auto",
        "scheduler-reset",
        "kk-flow-plus",
        "kk-flow-batch",
        "kk-feature-control",
        "kk-mode-name",
        "kk-owner-toggle",
        "demo-reload",
    }
    missing_controls = {
        control for control in required_controls if f'"{control}"' not in koka_text
    }
    if missing_controls:
        errors.append("Koka page misses controls: " + ", ".join(sorted(missing_controls)))

    required_semantics = {
        "Trace-read",
        "Trace-entry",
        "Resume-work(trace)",
        "source-local",
        "prefix",
        "suffix",
        "Draft",
        "Live",
        "Pending",
        "Running",
        "Dead",
        "pure plane",
        "effect plane",
        "targeted settle",
        "State-entry-read",
        "memo(previous)",
        "final control",
        "html.emit",
        "structural reentry",
        "ABI callback",
        "event continuation",
        "resume event K",
        "semantic simulation",
        "summary@double-old",
        "stale ticket",
        "capability 保持 Pending",
        "write/version/notify",
        "旧 child 变 Dead",
    }
    missing_semantics = {term for term in required_semantics if term not in koka_text}
    if missing_semantics:
        errors.append(
            "Koka report misses continuation semantics: "
            + ", ".join(sorted(missing_semantics))
        )

    required_sources = {
        "react.dev",
        "vuejs.org",
        "docs.solidjs.com",
        "koka-lang.github.io",
    }
    missing_sources = {host for host in required_sources if host not in koka_text}
    if missing_sources:
        errors.append("Koka report misses official sources: " + ", ".join(missing_sources))

    if errors:
        print("report architecture checks failed:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "report architecture checks passed: minimal report/counter shells, "
        f"one report mount, {len(required_sections)} Koka-owned sections"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
