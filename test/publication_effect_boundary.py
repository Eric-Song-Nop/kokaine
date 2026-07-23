#!/usr/bin/env python3
"""Assert that publication-only effects cannot expose signal writes."""

from __future__ import annotations

import pathlib
import subprocess
import sys
import tempfile


def main() -> int:
    if len(sys.argv) < 2:
        raise SystemExit("usage: publication_effect_boundary.py /path/to/koka [flags]")

    root = pathlib.Path(__file__).resolve().parents[1]
    fixture = root / "test" / "publication-effect-write-invalid.kk"
    with tempfile.TemporaryDirectory(prefix="kokaine-publication-boundary-") as output:
        result = subprocess.run(
            [
                *sys.argv[1:],
                "-j1",
                f"-i{root / 'src'}",
                "--target=jsweb",
                f"--outputdir={output}",
                f"--buildname={fixture.stem}",
                str(fixture),
            ],
            cwd=root,
            capture_output=True,
            text=True,
            check=False,
        )

    diagnostics = result.stdout + result.stderr
    if result.returncode == 0:
        raise AssertionError("publication effect unexpectedly admitted signal-write")
    if "signal-write" not in diagnostics or "expected effect: <ui,exn>" not in diagnostics:
        raise AssertionError(
            "publication fixture failed for an unexpected reason:\n" + diagnostics
        )

    print("publication-effect-boundary: signal-write rejected by closed UI row")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
