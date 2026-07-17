#!/usr/bin/env python3
"""Assert that unsupported lexical effects cannot enter retained callbacks."""

from __future__ import annotations

import pathlib
import subprocess
import sys
import tempfile


def main() -> int:
    if len(sys.argv) < 2:
        raise SystemExit("usage: event_effect_boundary.py /path/to/koka [flags]")

    root = pathlib.Path(__file__).resolve().parents[1]
    koka_command = sys.argv[1:]
    with tempfile.TemporaryDirectory(prefix="kokaine-event-boundary-") as output:
        for fixture_name in (
            "event-effect-boundary-invalid.kk",
            "event-root-effect-boundary-invalid.kk",
        ):
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
                    f"{fixture_name} unexpectedly admitted audit-effect"
                )
            if "audit-effect" not in diagnostics:
                raise AssertionError(
                    f"{fixture_name} failed for an unexpected reason:\n"
                    + diagnostics
                )

    print("event-effect-boundary: unsupported lexical callback effect rejected")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
