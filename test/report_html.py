#!/usr/bin/env python3
"""Static integrity checks for the executable HTML report."""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
REPORT = ROOT / "docs" / "algebraic-effects-ui-report" / "index.html"
REPORT_SCRIPT = REPORT.with_name("report.js")
VOID_ELEMENTS = {
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
}
REQUIRED_SECTIONS = {
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


class ReportParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[tuple[str, int]] = []
        self.ids: set[str] = set()
        self.duplicate_ids: list[str] = []
        self.internal_links: list[tuple[str, int]] = []
        self.local_resources: list[tuple[str, int]] = []
        self.errors: list[str] = []
        self.h1_count = 0
        self.button_count = 0
        self.interactive_button_count = 0
        self.lang: str | None = None
        self.external_hosts: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = dict(attrs)
        line = self.getpos()[0]
        if tag not in VOID_ELEMENTS:
            self.stack.append((tag, line))

        element_id = attributes.get("id")
        if element_id:
            if element_id in self.ids:
                self.duplicate_ids.append(element_id)
            self.ids.add(element_id)

        if tag == "html":
            self.lang = attributes.get("lang")
        if tag == "h1":
            self.h1_count += 1
        if tag == "svg":
            self.errors.append(f"line {line}: inline SVG is not used by this report")
        if tag == "button":
            self.button_count += 1
            if attributes.get("type") == "button":
                self.interactive_button_count += 1
            else:
                self.errors.append(f"line {line}: button is missing type=button")

        for attribute in ("href", "src"):
            value = attributes.get(attribute)
            if not value:
                continue
            parsed = urlsplit(value)
            if parsed.scheme in {"http", "https"}:
                if parsed.hostname:
                    self.external_hosts.add(parsed.hostname)
            elif value.startswith("#"):
                self.internal_links.append((value[1:], line))
            elif not value.startswith(("data:", "mailto:", "javascript:")):
                self.local_resources.append((parsed.path, line))

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self.handle_starttag(tag, attrs)
        if tag not in VOID_ELEMENTS:
            self.handle_endtag(tag)

    def handle_endtag(self, tag: str) -> None:
        line = self.getpos()[0]
        if not self.stack:
            self.errors.append(f"line {line}: unexpected closing </{tag}>")
            return
        open_tag, open_line = self.stack.pop()
        if open_tag != tag:
            self.errors.append(
                f"line {line}: closing </{tag}> does not match <{open_tag}> from line {open_line}"
            )


def main() -> int:
    report_text = REPORT.read_text(encoding="utf-8")
    script_text = REPORT_SCRIPT.read_text(encoding="utf-8")
    parser = ReportParser()
    parser.feed(report_text)
    parser.close()

    errors = list(parser.errors)
    if parser.stack:
        errors.extend(f"line {line}: unclosed <{tag}>" for tag, line in parser.stack)
    if parser.duplicate_ids:
        errors.append(f"duplicate IDs: {', '.join(sorted(set(parser.duplicate_ids)))}")
    if parser.lang != "zh-CN":
        errors.append(f"expected html lang=zh-CN, got {parser.lang!r}")
    if parser.h1_count != 1:
        errors.append(f"expected exactly one h1, got {parser.h1_count}")
    if parser.button_count < 20:
        errors.append(f"expected a rich interactive report, found only {parser.button_count} buttons")
    if parser.button_count != parser.interactive_button_count:
        errors.append("not every button declares type=button")

    missing_sections = REQUIRED_SECTIONS - parser.ids
    if missing_sections:
        errors.append(f"missing report sections: {', '.join(sorted(missing_sections))}")

    for target, line in parser.internal_links:
        if target and target not in parser.ids:
            errors.append(f"line {line}: internal link points to missing #{target}")

    report_dir = REPORT.parent
    for resource, line in parser.local_resources:
        candidate = (report_dir / resource).resolve()
        if not candidate.exists():
            errors.append(f"line {line}: local resource does not exist: {resource}")

    expected_sources = {"react.dev", "vuejs.org", "docs.solidjs.com"}
    missing_sources = expected_sources - parser.external_hosts
    if missing_sources:
        errors.append(f"missing official comparison sources: {', '.join(sorted(missing_sources))}")

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
        "&lt;signal-read,signal-write,ui,pure&gt;",
        "类型检查拒绝",
        "semantic simulation",
    }
    missing_semantics = {
        term for term in required_semantics if term not in report_text
    }
    if missing_semantics:
        errors.append(
            "missing continuation-native concepts: "
            + ", ".join(sorted(missing_semantics))
        )

    forbidden_semantics = {
        "普通 JS callback + structural reentry",
        "不能恢复一个并不存在的“事件 continuation”",
        "does not resume a parked event continuation",
    }
    stale_semantics = {term for term in forbidden_semantics if term in report_text}
    if stale_semantics:
        errors.append(
            "stale callback-only event claims remain: "
            + ", ".join(sorted(stale_semantics))
        )

    required_html_dsl = {
        "trailing lambda",
        "block brace elision",
        "attrs 默认 []",
        'h1("Signal console")',
        "string leaf",
        "class { if expanded.get",
        "text { square.get.show }",
        "input(attrs=[",
        "checked { expanded.get }",
        "    dynamic\n",
        "dynamic → Region",
        "void helper",
        "static overloading",
    }
    missing_html_dsl = {
        term for term in required_html_dsl if term not in report_text
    }
    if missing_html_dsl:
        errors.append(
            "missing indentation-first HTML DSL examples: "
            + ", ".join(sorted(missing_html_dsl))
        )

    forbidden_html_dsl = {
        "legacy *-live helper": (
            r"\b(?:text|attr|prop|value|checked|disabled)-live\s*\("
        ),
        "legacy positional tag attributes": (
            r"\b(?:main-tag|div|span|section|header|footer|h1|h2|p|strong|"
            r"ul|ol|li|button|label|a|input|hr)\s*\(\s*\["
        ),
        "legacy view lambda": r"\bview\s+fn\s*\(",
        "legacy region helper": r"\bregion\s*(?:fn\s*)?\(",
    }
    legacy_html_dsl = {
        label
        for label, pattern in forbidden_html_dsl.items()
        if re.search(pattern, report_text)
    }
    if legacy_html_dsl:
        errors.append(
            "legacy HTML DSL examples remain: "
            + ", ".join(sorted(legacy_html_dsl))
        )

    forbidden_legacy = {
        "fired latch",
        "root.root-current-token",
        "subscribe-source(",
        "settle-source(",
        "one-shot generation token",
        "旧 generation token",
        "当前 token",
        "标脏并排入",
    }
    combined_text = report_text + "\n" + script_text
    legacy_hits = {term for term in forbidden_legacy if term in combined_text}
    if legacy_hits:
        errors.append(
            "legacy observer/token semantics remain: "
            + ", ".join(sorted(legacy_hits))
        )

    required_simulation_behaviors = {
        "summary@double-old",
        "stale ticket",
        "capability 保持 Pending",
        "write/version/notify",
        "旧 child 变 Dead",
    }
    missing_behaviors = {
        term for term in required_simulation_behaviors if term not in script_text
    }
    if missing_behaviors:
        errors.append(
            "report simulator misses continuation behavior: "
            + ", ".join(sorted(missing_behaviors))
        )

    if errors:
        print("report HTML checks failed:", file=sys.stderr)
        for error in errors:
            print(f"  - {error}", file=sys.stderr)
        return 1

    print(
        "report HTML checks passed: "
        f"{len(parser.ids)} IDs, {parser.button_count} controls, "
        f"{len(parser.local_resources)} local resources"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
