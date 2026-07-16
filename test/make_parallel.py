"""Regression checks for serialized builds that share the dist directory."""

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
BROWSER_APP_SOURCES = [
    "examples/counter.kk",
    "examples/top-layer.kk",
]
BROWSER_FIXTURE_SOURCES = [
    "test/dom-errors.kk",
    "test/dom-lifecycle.kk",
    "test/dom-range-safety.kk",
    "test/dom-mount-rollback.kk",
    "test/dom-ownership.kk",
    "test/dom-event-continuation.kk",
    "test/dom-top-layer.kk",
]
BROWSER_BUILD_SOURCES = [*BROWSER_APP_SOURCES, *BROWSER_FIXTURE_SOURCES]
REPORT_SOURCE = "examples/report.kk"
DIST_BUILD_SOURCES = {*BROWSER_BUILD_SOURCES, REPORT_SOURCE}
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
    """Fail if two compiler processes write the shared dist directory."""
    control = Path(os.environ["KOKAINE_FAKE_KOKA_LOCK"]).parent
    ready = control / "first-ready"
    release = control / "release-first"
    if arguments == ["--release-first"]:
        if not wait_for(ready):
            print("timed out waiting for the first fake Koka", file=sys.stderr)
            return 87
        release.touch()
        return 0

    if DIST_BUILD_SOURCES.isdisjoint(arguments):
        return 0

    lock = Path(os.environ["KOKAINE_FAKE_KOKA_LOCK"])
    entry = next(
        argument for argument in arguments if argument in DIST_BUILD_SOURCES
    )
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


def dry_run(temporary: Path, *goals: str) -> str:
    result = subprocess.run(
        [
            "make",
            "-n",
            "-f",
            str(MAKEFILE),
            "KOKA=fake-koka",
            *goals,
        ],
        cwd=temporary,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        check=False,
    )
    assert result.returncode == 0, result.stdout
    return result.stdout


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
                "-j4",
                f"KOKA={fake_command}",
                "build-browser-fixtures",
                # The standalone goal must share the fixture build's node in
                # the Make DAG instead of launching a duplicate compilation.
                "build-top-layer",
                # Report writes the same dist directory. The fourth job slot
                # lets the control target release the active fake compiler
                # while another dist build waits on the serialization lock.
                "build-report",
                "release-fake-koka",
            ],
            cwd=temporary,
            env=environment,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )
        assert result.returncode == 0, (
            "parallel dist builds overlapped:\n" + result.stdout
        )
        calls = (temporary / "calls").read_text().splitlines()
        assert sorted(calls) == sorted([*BROWSER_BUILD_SOURCES, REPORT_SOURCE]), (
            f"expected one invocation per dist build, got {calls}"
        )
        browser_calls = [call for call in calls if call != REPORT_SOURCE]
        assert set(browser_calls[:2]) == set(BROWSER_APP_SOURCES), (
            f"expected independent browser applications first, got {browser_calls}"
        )
        assert browser_calls[2:] == BROWSER_FIXTURE_SOURCES, (
            f"expected ordered browser fixtures, got {browser_calls}"
        )

        report_dry_run = dry_run(temporary, "build-report")
        assert REPORT_SOURCE in report_dry_run
        assert "examples/counter.kk" not in report_dry_run
        assert "examples/top-layer.kk" not in report_dry_run

        top_layer_dry_run = dry_run(temporary, "build-top-layer")
        assert "examples/counter.kk" not in top_layer_dry_run
        assert REPORT_SOURCE not in top_layer_dry_run

    print("make-parallel: shared dist builds are serialized and independent")


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--fake-koka":
        raise SystemExit(fake_koka(sys.argv[2:]))
    check_parallel_build()
