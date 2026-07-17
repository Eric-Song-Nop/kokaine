#!/usr/bin/env python3
"""Regression checks for the cross-platform command lock runner."""

from __future__ import annotations

import ast
import errno
import importlib.util
import os
import signal
import subprocess
import sys
import tempfile
import time
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
RUNNER = PROJECT_ROOT / "support" / "run_locked.py"
SCRIPT = Path(__file__).resolve()
WAIT_SECONDS = 5


def load_runner():
    spec = importlib.util.spec_from_file_location("run_locked", RUNNER)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    previous = sys.dont_write_bytecode
    sys.dont_write_bytecode = True
    try:
        spec.loader.exec_module(module)
    finally:
        sys.dont_write_bytecode = previous
    return module


def check_python_38_import_compatibility() -> None:
    tree = ast.parse(RUNNER.read_text(), filename=str(RUNNER))
    deferred = any(
        isinstance(statement, ast.ImportFrom)
        and statement.module == "__future__"
        and any(name.name == "annotations" for name in statement.names)
        for statement in tree.body
    )
    eager_builtin_generics = any(
        isinstance(node, ast.Subscript)
        and isinstance(node.value, ast.Name)
        and node.value.id in {"dict", "list", "set", "tuple"}
        for node in ast.walk(tree)
    )
    assert deferred or not eager_builtin_generics, (
        "run_locked.py eagerly evaluates Python 3.9 generic annotations"
    )


class FakeWindowsLock:
    LK_NBLCK = 1
    LK_UNLCK = 2

    def __init__(self) -> None:
        self.calls: list[tuple[int, int]] = []

    def locking(self, _descriptor: int, mode: int, size: int) -> None:
        self.calls.append((mode, size))


def check_windows_backend_without_fcntl() -> None:
    missing = object()
    previous = sys.modules.get("fcntl", missing)
    sys.modules["fcntl"] = None
    try:
        runner = load_runner()
        with tempfile.TemporaryDirectory(
            prefix="kokaine-windows-lock-"
        ) as directory:
            lock_path = Path(directory) / "nested" / "dist.lock"
            windows_lock = FakeWindowsLock()
            with runner.exclusive_lock(
                lock_path,
                platform="nt",
                windows_api=windows_lock,
            ):
                assert lock_path.read_bytes() == b"\0"
                assert windows_lock.calls == [
                    (windows_lock.LK_NBLCK, 1)
                ]

            assert windows_lock.calls == [
                (windows_lock.LK_NBLCK, 1),
                (windows_lock.LK_UNLCK, 1),
            ]
    finally:
        if previous is missing:
            sys.modules.pop("fcntl", None)
        else:
            sys.modules["fcntl"] = previous


def check_command_status_passthrough() -> None:
    with tempfile.TemporaryDirectory(prefix="kokaine-lock-status-") as directory:
        lock_path = Path(directory) / "nested" / "dist.lock"
        result = subprocess.run(
            [
                sys.executable,
                str(RUNNER),
                str(lock_path),
                sys.executable,
                "-c",
                "raise SystemExit(23)",
            ],
            check=False,
        )
        assert result.returncode == 23, result.returncode


def hold_until_released(entered: Path, release: Path) -> int:
    entered.touch()
    deadline = time.monotonic() + WAIT_SECONDS
    while time.monotonic() < deadline:
        if release.exists():
            return 0
        time.sleep(0.01)
    print("timed out waiting to release the held command", file=sys.stderr)
    return 87


def hold_after_signal(
    entered: Path,
    signal_seen: Path,
    release: Path,
    pid_path: Path,
) -> int:
    def mark_signal(_number, _frame) -> None:
        signal_seen.touch()

    signal.signal(signal.SIGTERM, mark_signal)
    pid_path.write_text(str(os.getpid()))
    entered.touch()
    deadline = time.monotonic() + WAIT_SECONDS
    while time.monotonic() < deadline:
        if release.exists():
            return 0
        time.sleep(0.01)
    print("timed out waiting to release the signaled command", file=sys.stderr)
    return 87


def wait_for_entry(path: Path, process: subprocess.Popen) -> None:
    deadline = time.monotonic() + WAIT_SECONDS
    while time.monotonic() < deadline:
        if path.exists():
            return
        if process.poll() is not None:
            output = process.communicate()[0]
            raise AssertionError(
                f"lock worker exited before entering: {output}"
            )
        time.sleep(0.01)
    raise AssertionError(f"timed out waiting for {path.name}")


def wait_for_path(path: Path) -> None:
    deadline = time.monotonic() + WAIT_SECONDS
    while time.monotonic() < deadline:
        if path.exists():
            return
        time.sleep(0.01)
    raise AssertionError(f"timed out waiting for {path.name}")


def assert_native_lock_is_held(lock_path: Path) -> None:
    with lock_path.open("a+b") as handle:
        if os.name == "nt":
            import msvcrt

            handle.seek(0, os.SEEK_END)
            if handle.tell() == 0:
                raise AssertionError(
                    "run_locked.py did not initialize its Windows lock byte"
                )
            handle.seek(0)
            try:
                msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
            except OSError as problem:
                if (
                    problem.errno in {errno.EACCES, errno.EAGAIN, errno.EDEADLK}
                    or getattr(problem, "winerror", None) in {33, 36}
                ):
                    return
                raise
            else:
                handle.seek(0)
                msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
        else:
            import fcntl

            try:
                fcntl.flock(handle, fcntl.LOCK_EX | fcntl.LOCK_NB)
            except OSError as problem:
                if problem.errno in {errno.EACCES, errno.EAGAIN}:
                    return
                raise
            else:
                fcntl.flock(handle, fcntl.LOCK_UN)

    raise AssertionError("run_locked.py did not hold the native file lock")


def check_process_contention() -> None:
    with tempfile.TemporaryDirectory(prefix="kokaine-lock-contention-") as directory:
        control = Path(directory)
        lock_path = control / "nested" / "dist.lock"
        lock_path.parent.mkdir()
        first_entered = control / "first-entered"
        release_first = control / "release-first"
        second_entered = control / "second-entered"
        first = subprocess.Popen(
            [
                sys.executable,
                str(RUNNER),
                str(lock_path),
                sys.executable,
                str(SCRIPT),
                "--hold-lock",
                str(first_entered),
                str(release_first),
            ],
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        second = None
        try:
            wait_for_entry(first_entered, first)
            assert_native_lock_is_held(lock_path)

            second = subprocess.Popen(
                [
                    sys.executable,
                    str(RUNNER),
                    str(lock_path),
                    sys.executable,
                    "-c",
                    "from pathlib import Path; import sys; "
                    "Path(sys.argv[1]).touch()",
                    str(second_entered),
                ],
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
            )
            time.sleep(0.2)
            assert second.poll() is None, second.communicate()[0]
            assert not second_entered.exists(), (
                "the second command entered before the first released its lock"
            )

            release_first.touch()
            first_output = first.communicate(timeout=WAIT_SECONDS)[0]
            assert first.returncode == 0, first_output
            second_output = second.communicate(timeout=WAIT_SECONDS)[0]
            assert second.returncode == 0, second_output
            assert second_entered.exists()
        finally:
            release_first.touch()
            for process in (first, second):
                if process is not None and process.poll() is None:
                    process.terminate()
                    process.wait(timeout=WAIT_SECONDS)


def check_termination_keeps_lock_until_command_exits() -> None:
    if os.name == "nt":
        return

    with tempfile.TemporaryDirectory(
        prefix="kokaine-lock-termination-"
    ) as directory:
        control = Path(directory)
        lock_path = control / "dist.lock"
        first_entered = control / "first-entered"
        signal_seen = control / "signal-seen"
        release_first = control / "release-first"
        child_pid_path = control / "child-pid"
        second_entered = control / "second-entered"
        first = subprocess.Popen(
            [
                sys.executable,
                str(RUNNER),
                str(lock_path),
                sys.executable,
                str(SCRIPT),
                "--hold-after-signal",
                str(first_entered),
                str(signal_seen),
                str(release_first),
                str(child_pid_path),
            ],
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
        second = None
        child_pid = None
        try:
            wait_for_entry(first_entered, first)
            child_pid = int(child_pid_path.read_text())
            first.terminate()

            second = subprocess.Popen(
                [
                    sys.executable,
                    str(RUNNER),
                    str(lock_path),
                    sys.executable,
                    "-c",
                    "from pathlib import Path; import sys; "
                    "Path(sys.argv[1]).touch()",
                    str(second_entered),
                ],
                text=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
            )

            wait_for_path(signal_seen)
            time.sleep(0.2)
            assert first.poll() is None, (
                "the lock wrapper exited before its command finished"
            )
            assert second.poll() is None, (
                "the next command acquired the lock before the first exited"
            )
            assert not second_entered.exists()

            release_first.touch()
            first_output = first.communicate(timeout=WAIT_SECONDS)[0]
            assert first.returncode == -signal.SIGTERM, first_output
            second_output = second.communicate(timeout=WAIT_SECONDS)[0]
            assert second.returncode == 0, second_output
            assert second_entered.exists()
        finally:
            release_first.touch()
            for process in (first, second):
                if process is not None and process.poll() is None:
                    process.terminate()
                    try:
                        process.wait(timeout=WAIT_SECONDS)
                    except subprocess.TimeoutExpired:
                        process.kill()
                        process.wait(timeout=WAIT_SECONDS)
            if child_pid is not None:
                try:
                    os.kill(child_pid, 0)
                except ProcessLookupError:
                    pass
                else:
                    os.kill(child_pid, signal.SIGKILL)


if __name__ == "__main__":
    if len(sys.argv) == 4 and sys.argv[1] == "--hold-lock":
        raise SystemExit(
            hold_until_released(Path(sys.argv[2]), Path(sys.argv[3]))
        )
    if len(sys.argv) == 6 and sys.argv[1] == "--hold-after-signal":
        raise SystemExit(
            hold_after_signal(
                Path(sys.argv[2]),
                Path(sys.argv[3]),
                Path(sys.argv[4]),
                Path(sys.argv[5]),
            )
        )
    check_python_38_import_compatibility()
    check_windows_backend_without_fcntl()
    check_command_status_passthrough()
    check_process_contention()
    check_termination_keeps_lock_until_command_exits()
    print(
        "run-locked: portable backend, contention, and status passthrough passed"
    )
