import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


class BreakItTests(unittest.TestCase):
    def test_runner_passes(self):
        result = subprocess.run(
            [sys.executable, str(ROOT / "break-it" / "run.py")],
            cwd=ROOT, capture_output=True, text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_each_bad_adr_fails_individually(self):
        for f in sorted((ROOT / "break-it" / "bad").glob("*.md")):
            result = subprocess.run(
                [sys.executable, str(ROOT / "tools" / "adr_lint.py"), str(f)],
                cwd=ROOT, capture_output=True, text=True,
            )
            self.assertEqual(result.returncode, 1, f.name)


if __name__ == "__main__":
    unittest.main()
