#!/usr/bin/env python3
"""Run a command while holding a cross-process file lock."""

from __future__ import annotations

import errno
import os
import signal
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


def _forward_signal(process: subprocess.Popen, number: int) -> None:
    try:
        if os.name == "nt":
            if number == signal.SIGINT:
                process.send_signal(signal.CTRL_C_EVENT)
            elif number == getattr(signal, "SIGBREAK", None):
                process.send_signal(signal.CTRL_BREAK_EVENT)
            else:
                process.terminate()
        else:
            os.killpg(process.pid, number)
    except ProcessLookupError:
        pass


def _run_command(command):
    received_signals = []
    forwarded_count = 0
    process = None

    def forward_pending() -> None:
        nonlocal forwarded_count
        while process is not None and forwarded_count < len(received_signals):
            _forward_signal(process, received_signals[forwarded_count])
            forwarded_count += 1

    def handle_signal(number, _frame) -> None:
        received_signals.append(number)
        forward_pending()

    handled_signals = []
    for name in ("SIGHUP", "SIGINT", "SIGTERM", "SIGBREAK"):
        number = getattr(signal, name, None)
        if number is not None and number not in handled_signals:
            handled_signals.append(number)

    previous_handlers = {}
    for number in handled_signals:
        previous_handlers[number] = signal.getsignal(number)
        signal.signal(number, handle_signal)

    try:
        options = {}
        if os.name == "nt":
            options["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP
        else:
            options["start_new_session"] = True
        process = subprocess.Popen(command, **options)
        forward_pending()
        returncode = process.wait()
    finally:
        for number, handler in previous_handlers.items():
            signal.signal(number, handler)

    received = received_signals[0] if received_signals else None
    return returncode, received


def _exit_with_signal(number: int) -> int:
    signal.signal(number, signal.SIG_DFL)
    os.kill(os.getpid(), number)
    return 128 + number


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
        returncode, received_signal = _run_command(command)

    if received_signal is not None:
        return _exit_with_signal(received_signal)
    if returncode < 0:
        return _exit_with_signal(-returncode)
    return returncode


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
