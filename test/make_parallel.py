"""Regression checks for serialized builds that share the dist directory."""

from __future__ import annotations

import os
import shlex
import shutil
import subprocess
import sys
import tempfile
import time
from pathlib import Path
from typing import Optional


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
MAKE = shutil.which("make")

assert MAKE is not None, "make is required for this regression check"


def shell_command(arguments: list[str], platform: str = os.name) -> str:
    return shlex.join(arguments)


def check_shell_command_encoding() -> None:
    windows_arguments = [
        r"C:\Program Files\Python 3.8\python.exe",
        r"C:\work tree\test\make_parallel.py",
        "--fake-koka",
    ]
    assert shell_command(
        windows_arguments,
        platform="nt",
    ) == subprocess.list2cmdline(windows_arguments)

    posix_arguments = [
        "/opt/Python 3.8/bin/python3",
        "/work tree/test/make_parallel.py",
        "--fake-koka",
    ]
    assert shell_command(
        posix_arguments,
        platform="posix",
    ) == shlex.join(posix_arguments)


def handshake_path(control: Path, stage: str, entry: str) -> Path:
    token = entry.replace("/", "--")
    return control / f"{stage}-{token}"


def wait_for(path: Path, abort: Optional[Path] = None) -> bool:
    """Wait for an explicit peer signal; the timeout only guards deadlocks."""
    deadline = time.monotonic() + WAIT_SECONDS
    while time.monotonic() < deadline:
        if path.exists():
            return True
        if abort is not None and abort.exists():
            return False
        time.sleep(0.01)
    return False


def release_dist_builds(control: Path) -> int:
    abort = control / "abort"
    pending = set(DIST_BUILD_SOURCES)
    ready_deadline = time.monotonic() + WAIT_SECONDS
    while pending:
        ready_entry = next(
            (
                entry
                for entry in sorted(pending)
                if handshake_path(control, "ready", entry).exists()
            ),
            None,
        )
        if ready_entry is None:
            if abort.exists():
                return 86
            if time.monotonic() >= ready_deadline:
                print(
                    f"timed out waiting for fake Koka calls: "
                    f"{sorted(pending)}",
                    file=sys.stderr,
                )
                return 87
            time.sleep(0.01)
            continue

        handshake_path(control, "release", ready_entry).touch()
        done = handshake_path(control, "done", ready_entry)
        if not wait_for(done, abort):
            if abort.exists():
                return 86
            print(
                f"timed out finishing fake Koka for {ready_entry}",
                file=sys.stderr,
            )
            return 87
        pending.remove(ready_entry)
        ready_deadline = time.monotonic() + WAIT_SECONDS
    return 0


def fake_koka(arguments: list[str]) -> int:
    """Fail if two compiler processes write the shared dist directory."""
    control = Path(os.environ["KOKAINE_FAKE_KOKA_LOCK"]).parent
    if arguments == ["--release-dist-builds"]:
        return release_dist_builds(control)

    if DIST_BUILD_SOURCES.isdisjoint(arguments):
        return 0

    lock = Path(os.environ["KOKAINE_FAKE_KOKA_LOCK"])
    abort = control / "abort"
    entry = next(
        argument for argument in arguments if argument in DIST_BUILD_SOURCES
    )
    ready = handshake_path(control, "ready", entry)
    release = handshake_path(control, "release", entry)
    done = handshake_path(control, "done", entry)
    with (lock.parent / "calls").open("a") as calls:
        print(entry, file=calls, flush=True)
    try:
        lock.mkdir()
    except FileExistsError:
        # Wake every waiter so a broken serialization lock fails promptly.
        abort.touch()
        print("overlapping fake Koka invocation", file=sys.stderr)
        return 86

    try:
        ready.touch()
        if not wait_for(release, abort):
            if abort.exists():
                return 86
            print(
                f"timed out waiting to release fake Koka for {entry}",
                file=sys.stderr,
            )
            return 87
    finally:
        lock.rmdir()
        done.touch()
    return 0


def dry_run(temporary: Path, *goals: str) -> str:
    result = subprocess.run(
        [
            MAKE,
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


def check_configurable_python() -> None:
    with tempfile.TemporaryDirectory(prefix="kokaine-make-python-") as directory:
        temporary = Path(directory)
        shim_directory = temporary / "bin"
        shim_directory.mkdir()
        hard_coded_python = shim_directory / "python3"
        hard_coded_python.write_text("#!/bin/sh\nexit 91\n")
        hard_coded_python.chmod(0o755)

        environment = os.environ.copy()
        environment["PATH"] = (
            str(shim_directory)
            + os.pathsep
            + environment.get("PATH", "")
        )
        fake_koka = shell_command([sys.executable, "-c", ""])
        result = subprocess.run(
            [
                MAKE,
                "-f",
                str(MAKEFILE),
                f"PYTHON={sys.executable}",
                f"KOKA={fake_koka}",
                "build-report",
            ],
            cwd=temporary,
            env=environment,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )
        assert result.returncode == 0, (
            "Makefile ignored the configured Python interpreter:\n"
            + result.stdout
        )


def check_dist_recipe_wiring() -> None:
    with tempfile.TemporaryDirectory(prefix="kokaine-make-wiring-") as directory:
        result = subprocess.run(
            [
                MAKE,
                "-n",
                "-f",
                str(MAKEFILE),
                "KOKA=UNSERIALIZED_KOKA",
                "DIST_KOKA=SERIALIZED_KOKA",
                "build-browser-fixtures",
                "build-report",
            ],
            cwd=directory,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            check=False,
        )
        assert result.returncode == 0, result.stdout
        assert "UNSERIALIZED_KOKA" not in result.stdout, (
            "a dist recipe bypassed the serialized compiler:\n"
            + result.stdout
        )
        assert result.stdout.count("SERIALIZED_KOKA") == len(
            DIST_BUILD_SOURCES
        ), result.stdout
        for source in DIST_BUILD_SOURCES:
            assert result.stdout.count(source) == 1, result.stdout


def check_parallel_build() -> None:
    with tempfile.TemporaryDirectory(prefix="kokaine-make-parallel-") as directory:
        temporary = Path(directory)
        environment = os.environ.copy()
        environment.pop("MAKEFLAGS", None)
        environment.pop("MFLAGS", None)
        environment["KOKAINE_FAKE_KOKA_LOCK"] = str(temporary / "koka-lock")

        fake_command = shell_command(
            [sys.executable, str(SCRIPT), "--fake-koka"]
        )
        release_makefile = temporary / "release.mk"
        release_makefile.write_text(
            ".PHONY: release-fake-koka\n"
            "release-fake-koka:\n"
            "\t$(KOKA) --release-dist-builds\n"
        )
        result = subprocess.run(
            [
                MAKE,
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
                # lets the control target release every active fake compiler
                # while other dist builds wait on the serialization lock.
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
        assert not (temporary / "abort").exists()
        for marker in ("ready", "release", "done"):
            markers = {
                path.name for path in temporary.glob(f"{marker}-*")
            }
            expected = {
                handshake_path(temporary, marker, entry).name
                for entry in DIST_BUILD_SOURCES
            }
            assert markers == expected, (
                f"expected one {marker} handshake per dist build, "
                f"got {sorted(markers)}"
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
    check_shell_command_encoding()
    check_configurable_python()
    check_dist_recipe_wiring()
    check_parallel_build()
