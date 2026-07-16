#!/usr/bin/env python3
"""Regression checks for the cross-platform command lock runner."""

import importlib.util
import subprocess
import sys
import tempfile
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
RUNNER = PROJECT_ROOT / "support" / "run_locked.py"


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


if __name__ == "__main__":
    check_windows_backend_without_fcntl()
    check_command_status_passthrough()
    print("run-locked: portable backend and status passthrough passed")
