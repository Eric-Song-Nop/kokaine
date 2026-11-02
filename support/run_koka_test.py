#!/usr/bin/env python3
"""Run a Koka test command and fail if the program threw.

`koka -e` and compiled Koka programs print "uncaught exception: ..." and still
exit 0 on both the C and JavaScript backends, so a plain make recipe cannot
see a failing test. This wrapper streams the output and turns that line into
a nonzero exit.
"""
import subprocess
import sys


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: run_koka_test.py <command> [args...]", file=sys.stderr)
        return 2
    process = subprocess.Popen(
        sys.argv[1:], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True
    )
    threw = False
    assert process.stdout is not None
    for line in process.stdout:
        sys.stdout.write(line)
        if line.startswith("uncaught exception:"):
            threw = True
    status = process.wait()
    if status != 0:
        return status
    if threw:
        print("run_koka_test: the program threw an uncaught exception", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
