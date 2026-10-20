#!/usr/bin/env python3
"""Run the ADR linter on the trend-driven ADRs (must fail) and their corrected versions (must pass).

Usage: python break-it/run.py
"""
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LINT = [sys.executable, str(ROOT / "tools" / "adr_lint.py")]


def run(folder: str) -> int:
    print(f"\n$ python tools/adr_lint.py break-it/{folder}")
    return subprocess.run(LINT + [str(ROOT / "break-it" / folder)], cwd=ROOT).returncode


def main() -> int:
    bad = run("bad")
    fixed = run("fixed")
    ok = bad == 1 and fixed == 0
    print("\nAs expected: bad ADRs rejected, fixed ADRs accepted." if ok else "\nUnexpected result.")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
