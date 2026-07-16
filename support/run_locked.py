#!/usr/bin/env python3
"""Run a command while holding a cross-process file lock."""

import errno
import os
import subprocess
import sys
import time
from contextlib import contextmanager
from pathlib import Path


def _acquire_windows_lock(handle, windows_api) -> None:
    handle.seek(0, os.SEEK_END)
    if handle.tell() == 0:
        handle.write(b"\0")
        handle.flush()

    retry_errors = {errno.EACCES, errno.EAGAIN, errno.EDEADLK}
    while True:
        handle.seek(0)
        try:
            windows_api.locking(
                handle.fileno(), windows_api.LK_NBLCK, 1
            )
            return
        except OSError as problem:
            if (
                problem.errno not in retry_errors
                and getattr(problem, "winerror", None) not in {33, 36}
            ):
                raise
            time.sleep(0.05)


@contextmanager
def exclusive_lock(
    path: Path,
    platform: str = os.name,
    windows_api=None,
):
    """Hold an advisory lock, selecting only the current platform backend."""
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a+b") as handle:
        if platform == "nt":
            if windows_api is None:
                import msvcrt

                windows_api = msvcrt
            _acquire_windows_lock(handle, windows_api)
            try:
                yield
            finally:
                handle.seek(0)
                windows_api.locking(
                    handle.fileno(), windows_api.LK_UNLCK, 1
                )
        else:
            import fcntl

            fcntl.flock(handle, fcntl.LOCK_EX)
            try:
                yield
            finally:
                fcntl.flock(handle, fcntl.LOCK_UN)


def main(arguments: list[str]) -> int:
    if len(arguments) < 2:
        print(
            "usage: run_locked.py LOCK_FILE COMMAND [ARG ...]",
            file=sys.stderr,
        )
        return 2

    lock_path = Path(arguments[0])
    command = arguments[1:]
    with exclusive_lock(lock_path):
        return subprocess.run(command, check=False).returncode


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
