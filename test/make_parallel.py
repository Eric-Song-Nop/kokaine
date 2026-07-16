"""Regression check for parallel browser-fixture build serialization."""

import os
import shlex
import subprocess
import sys
import tempfile
import time
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MAKEFILE = PROJECT_ROOT / "Makefile"
SCRIPT = Path(__file__).resolve()
APP_SOURCES = {"examples/counter.kk", "examples/top-layer.kk"}


def fake_koka(arguments: list[str]) -> int:
    """Fail if the two application entry points compile concurrently."""
    if APP_SOURCES.isdisjoint(arguments):
        return 0

    lock = Path(os.environ["KOKAINE_FAKE_KOKA_LOCK"])
    entry = next(argument for argument in arguments if argument in APP_SOURCES)
    with (lock.parent / "calls").open("a") as calls:
        print(entry, file=calls, flush=True)
    try:
        lock.mkdir()
    except FileExistsError:
        print("overlapping fake Koka invocation", file=sys.stderr)
        return 86

    try:
        time.sleep(1)
    finally:
        lock.rmdir()
    return 0


def check_parallel_build() -> None:
    with tempfile.TemporaryDirectory(prefix="kokaine-make-parallel-") as directory:
        temporary = Path(directory)
        environment = os.environ.copy()
        environment.pop("MAKEFLAGS", None)
        environment.pop("MFLAGS", None)
        environment["KOKAINE_FAKE_KOKA_LOCK"] = str(temporary / "koka-lock")

        fake_command = shlex.join(
            [sys.executable, str(SCRIPT), "--fake-koka"]
        )
        result = subprocess.run(
            [
                "make",
                "-f",
                str(MAKEFILE),
                "-j2",
                f"KOKA={fake_command}",
                "build-browser-fixtures",
            ],
            cwd=temporary,
            env=environment,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )
        calls = (temporary / "calls").read_text().splitlines()
        assert sorted(calls) == sorted(APP_SOURCES), (
            f"expected both browser application builds, got {calls}"
        )
        assert result.returncode == 0, (
            "parallel browser-fixture prerequisites overlapped:\n" + result.stdout
        )

    print("make-parallel: browser fixture prerequisites are serialized")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--fake-koka":
        raise SystemExit(fake_koka(sys.argv[2:]))
    check_parallel_build()
