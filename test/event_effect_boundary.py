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
    fixture = root / "test" / "event-effect-boundary-invalid.kk"
    koka_command = sys.argv[1:]
    with tempfile.TemporaryDirectory(prefix="kokaine-event-boundary-") as output:
        result = subprocess.run(
            [
                *koka_command,
                "-j1",
                f"-i{root / 'src'}",
                "--target=jsweb",
                f"--outputdir={output}",
                "--buildname=event-effect-boundary-invalid",
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
            "unsupported audit-effect callback unexpectedly typechecked"
        )
    if "audit-effect" not in diagnostics:
        raise AssertionError(
            "callback was rejected for an unexpected reason:\n" + diagnostics
        )

    print("event-effect-boundary: unsupported lexical callback effect rejected")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
