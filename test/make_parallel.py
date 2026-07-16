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
WAIT_SECONDS = 10


def wait_for(path: Path) -> bool:
    """Wait for an explicit peer signal; the timeout only guards deadlocks."""
    deadline = time.monotonic() + WAIT_SECONDS
    while time.monotonic() < deadline:
        if path.exists():
            return True
        time.sleep(0.01)
    return False


def fake_koka(arguments: list[str]) -> int:
    """Fail if the two application entry points compile concurrently."""
    control = Path(os.environ["KOKAINE_FAKE_KOKA_LOCK"]).parent
    ready = control / "first-ready"
    release = control / "release-first"
    if arguments == ["--release-first"]:
        if not wait_for(ready):
            print("timed out waiting for the first fake Koka", file=sys.stderr)
            return 87
        release.touch()
        return 0

    if APP_SOURCES.isdisjoint(arguments):
        return 0

    lock = Path(os.environ["KOKAINE_FAKE_KOKA_LOCK"])
    entry = next(argument for argument in arguments if argument in APP_SOURCES)
    with (lock.parent / "calls").open("a") as calls:
        print(entry, file=calls, flush=True)
    try:
        lock.mkdir()
    except FileExistsError:
        # Unblock the first entrant so a broken parallel DAG fails promptly.
        release.touch()
        print("overlapping fake Koka invocation", file=sys.stderr)
        return 86

    try:
        ready.touch()
        if not wait_for(release):
            print("timed out waiting for the release target", file=sys.stderr)
            return 87
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
        release_makefile = temporary / "release.mk"
        release_makefile.write_text(
            ".PHONY: release-fake-koka\n"
            "release-fake-koka:\n"
            "\t$(KOKA) --release-first\n"
        )
        result = subprocess.run(
            [
                "make",
                "-f",
                str(MAKEFILE),
                "-f",
                str(release_makefile),
                "-j2",
                f"KOKA={fake_command}",
                "build-browser-fixtures",
                # The standalone goal must share the fixture build's node in
                # the Make DAG instead of launching a duplicate compilation.
                "build-top-layer",
                # With the correct dependency chain this occupies the spare
                # job slot and releases the first fake compiler. A broken DAG
                # fills both slots with compilers, which overlap deterministically.
                "release-fake-koka",
            ],
            cwd=temporary,
            env=environment,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )
        calls = (temporary / "calls").read_text().splitlines()
        assert calls == ["examples/counter.kk", "examples/top-layer.kk"], (
            f"expected ordered, unique browser application builds, got {calls}"
        )
        assert result.returncode == 0, (
            "parallel browser-fixture prerequisites overlapped:\n" + result.stdout
        )

    print("make-parallel: browser fixture prerequisites are serialized")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--fake-koka":
        raise SystemExit(fake_koka(sys.argv[2:]))
    check_parallel_build()
