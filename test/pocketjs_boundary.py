#!/usr/bin/env python3
"""Keep the experimental native renderer independent from browser layers."""

from __future__ import annotations

import json
import pathlib


ROOT = pathlib.Path(__file__).resolve().parents[1]


def main() -> int:
    pocket_sources = sorted((ROOT / "packages/pocketjs/src").rglob("*.kk"))
    bridge = (ROOT / "packages/pocketjs/js/bridge.js").read_text()
    async_bridge = (ROOT / "packages/pocketjs/js/async.js").read_text()
    guest = (ROOT / "packages/pocketjs/js/guest.js").read_text()
    manifest = json.loads((ROOT / "packages/pocketjs/package.json").read_text())
    core_manifest = json.loads((ROOT / "package.json").read_text())

    forbidden_modules = {
        "kokaine/html",
        "kokaine/dom",
        "kokaine/async/web",
        "kokaine/async/internal/web-schedule",
        "kokaine/reactive/async",
    }
    for source in pocket_sources:
        for line in source.read_text().splitlines():
            words = line.strip().split()
            if not words:
                continue
            if words[0] == "import" and len(words) >= 2:
                imported = words[1]
            elif words[:2] == ["pub", "import"] and len(words) >= 3:
                imported = words[2]
            else:
                continue
            if imported in forbidden_modules or imported.startswith("kokaine/web"):
                raise AssertionError(
                    f"Pocket renderer crossed browser boundary in {source}: {imported}"
                )

    expected_renderer = 'from "@pocketjs/framework/solid/renderer"'
    if bridge.count(expected_renderer) != 1:
        raise AssertionError("bridge must use exactly one public Pocket renderer import")
    expected_async_import = 'from "@pocketjs/framework/lifecycle"'
    if async_bridge.count(expected_async_import) != 1:
        raise AssertionError(
            f"async bridge must use one public Pocket import: {expected_async_import}"
        )
    if "@pocketjs/framework/clock" in async_bridge:
        raise AssertionError(
            "Pocket 0.6 would bundle a second, unadvanced clock instance"
        )
    for forbidden_host_api in ("Promise", "setTimeout", "fetch", "performance"):
        if forbidden_host_api in async_bridge:
            raise AssertionError(
                f"Pocket async bridge used a non-deterministic host API: "
                f"{forbidden_host_api}"
            )
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
    expected_core = f"^{core_manifest['version']}"
    if manifest["peerDependencies"]["@kokaine/core"] != expected_core:
        raise AssertionError(
            "Pocket peer range must require the core release containing its integration API"
        )
    if manifest["license"] != "MIT" or not (ROOT / "packages/pocketjs/LICENSE").is_file():
        raise AssertionError("published Pocket package must carry the repository license")
    if manifest["exports"]["."]["default"] != "./js/index.js":
        raise AssertionError("package root must expose composed mount and bridge helpers")
    if manifest["exports"].get("./async") != {
        "types": "./js/async.d.ts",
        "default": "./js/async.js",
    }:
        raise AssertionError("package async subpath must expose its JS bridge and types")

    core_files = [ROOT / "src/kokaine/reactive.kk"]
    core_files.extend((ROOT / "src/kokaine/reactive").rglob("*.kk"))
    for source in core_files:
        if "import kokaine/pocket" in source.read_text():
            raise AssertionError(f"reactive core depends on Pocket renderer: {source}")

    print("pocketjs-boundary: renderer, compiler target, and packager stay separate")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
