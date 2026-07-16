#!/usr/bin/env python3
"""Assert that tracked reactive calculations cannot suspend."""

from __future__ import annotations

import pathlib
import subprocess
import sys
import tempfile


FIXTURES = (
    "derive-async-invalid.kk",
    "memo-async-invalid.kk",
    "resource-source-async-invalid.kk",
)


def main() -> int:
    if len(sys.argv) < 2:
        raise SystemExit("usage: async_effect_boundary.py /path/to/koka [flags]")

    root = pathlib.Path(__file__).resolve().parents[1]
    koka_command = sys.argv[1:]
    with tempfile.TemporaryDirectory(prefix="kokaine-async-boundary-") as output:
        for fixture_name in FIXTURES:
            fixture = root / "test" / fixture_name
            result = subprocess.run(
                [
                    *koka_command,
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
                raise AssertionError(
                    f"{fixture_name} unexpectedly admitted async suspension"
                )
            if "async-await" not in diagnostics:
                raise AssertionError(
                    f"{fixture_name} failed for an unexpected reason:\n{diagnostics}"
                )

    print("async-effect-boundary: derive, memo, and Resource source stay sync")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
