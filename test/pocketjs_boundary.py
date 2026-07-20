#!/usr/bin/env python3
"""Keep the experimental native renderer independent from browser layers."""

from __future__ import annotations

import json
import pathlib


ROOT = pathlib.Path(__file__).resolve().parents[1]


def main() -> int:
    pocket = (ROOT / "packages/pocketjs/src/kokaine/pocket.kk").read_text()
    bridge = (ROOT / "packages/pocketjs/js/bridge.js").read_text()
    guest = (ROOT / "packages/pocketjs/js/guest.js").read_text()
    manifest = json.loads((ROOT / "packages/pocketjs/package.json").read_text())

    forbidden_imports = (
        "import kokaine/html",
        "import kokaine/dom",
        "import kokaine/async",
        "import kokaine/reactive/async",
        "import kokaine/web",
    )
    for forbidden in forbidden_imports:
        if forbidden in pocket:
            raise AssertionError(f"Pocket renderer crossed browser boundary: {forbidden}")

    expected_renderer = 'from "@pocketjs/framework/solid/renderer"'
    if bridge.count(expected_renderer) != 1:
        raise AssertionError("bridge must use exactly one public Pocket renderer import")
    if not bridge.startswith('import "./guest.js";'):
        raise AssertionError("QuickJS guest compatibility must load before Pocket/Koka modules")
    if "globalThis.ui" in bridge:
        raise AssertionError("bridge bypassed Pocket's renderer with raw HostOps")
    if "process" not in guest or "stdout" not in guest or "console" not in guest:
        raise AssertionError("QuickJS guest prelude no longer covers Koka 3.2 console probes")

    if manifest["koka"]["targets"] != ["jsweb"]:
        raise AssertionError("Pocket renderer must not masquerade as a Koka target")
    if manifest["peerDependencies"]["@pocketjs/framework"] != ">=0.6.0 <0.7.0":
        raise AssertionError("Pocket pre-1.0 compatibility window drifted")
    if manifest["license"] != "MIT" or not (ROOT / "packages/pocketjs/LICENSE").is_file():
        raise AssertionError("published Pocket package must carry the repository license")
    if manifest["exports"]["."]["default"] != "./js/index.js":
        raise AssertionError("package root must expose composed mount and bridge helpers")

    core_files = [ROOT / "src/kokaine/reactive.kk"]
    core_files.extend((ROOT / "src/kokaine/reactive").rglob("*.kk"))
    for source in core_files:
        if "import kokaine/pocket" in source.read_text():
            raise AssertionError(f"reactive core depends on Pocket renderer: {source}")

    print("pocketjs-boundary: renderer, compiler target, and packager stay separate")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
