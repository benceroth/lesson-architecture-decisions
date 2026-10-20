import io
import subprocess
import sys
import unittest
from contextlib import redirect_stdout
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

import adr_lint  # noqa: E402

GOOD = """# ADR 1: Example

- **Status:** Accepted
- **Review date:** 2025-11-28

## Evidence

We measured checkout P95 before and after over a 30-day window.

## Exit criteria

Remove it if fewer than three teams need it; rollback tested in the trial.
"""


def without(text, needle):
    return text.replace(needle, "")


class LintTextTests(unittest.TestCase):
    def test_good_adr_passes(self):
        self.assertEqual(adr_lint.lint_text(GOOD), [])

    def test_missing_status(self):
        problems = adr_lint.lint_text(without(GOOD, "- **Status:** Accepted\n"))
        self.assertIn("missing Status", problems)

    def test_invalid_status(self):
        problems = adr_lint.lint_text(GOOD.replace("Accepted", "Vibes"))
        self.assertTrue(any("invalid Status" in p for p in problems))

    def test_missing_review_date(self):
        problems = adr_lint.lint_text(without(GOOD, "- **Review date:** 2025-11-28\n"))
        self.assertIn("missing Review date", problems)

    def test_bad_review_date(self):
        problems = adr_lint.lint_text(GOOD.replace("2025-11-28", "next spring"))
        self.assertTrue(any("not a YYYY-MM-DD" in p for p in problems))

    def test_missing_evidence(self):
        text = GOOD.replace("## Evidence", "## Notes")
        self.assertIn("missing 'Evidence' section", adr_lint.lint_text(text))

    def test_missing_exit_criteria(self):
        text = GOOD.replace("## Exit criteria", "## Other")
        self.assertIn("missing 'Exit criteria' section", adr_lint.lint_text(text))

    def test_empty_exit_criteria(self):
        text = GOOD.replace(
            "Remove it if fewer than three teams need it; rollback tested in the trial.",
            "TBD",
        )
        self.assertTrue(adr_lint.lint_text(text))

    def test_placeholder_rejected(self):
        text = GOOD.replace("We measured", "<what we measured>")
        self.assertTrue(any("placeholder" in p for p in adr_lint.lint_text(text)))

    def test_html_comment_does_not_count_as_content(self):
        text = GOOD.replace(
            "Remove it if fewer than three teams need it; rollback tested in the trial.",
            "<!-- Remove it if fewer than three teams need it; rollback tested in the trial. -->",
        )
        self.assertIn(
            "'Exit criteria' section is empty or too short", adr_lint.lint_text(text)
        )


class RepoTests(unittest.TestCase):
    def run_cli(self, *args):
        return subprocess.run(
            [sys.executable, str(ROOT / "tools" / "adr_lint.py"), *args],
            capture_output=True,
            text=True,
            cwd=ROOT,
        )

    def test_real_adrs_pass(self):
        result = self.run_cli("adr")
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertIn("5/5 ADRs passed", result.stdout)

    def test_bad_fixture_fails(self):
        result = self.run_cli("tests/fixtures")
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertIn("missing Review date", result.stdout)
        self.assertIn("missing 'Exit criteria' section", result.stdout)

    def test_missing_path_is_usage_error(self):
        self.assertEqual(self.run_cli("no-such-folder").returncode, 2)

    def test_main_in_process(self):
        buf = io.StringIO()
        with redirect_stdout(buf):
            code = adr_lint.main([str(ROOT / "tests" / "fixtures")])
        self.assertEqual(code, 1)


class MetricsConsistencyTests(unittest.TestCase):
    """The CSV must carry the post's numbers."""

    def test_before_after_matches_post(self):
        import csv

        with open(ROOT / "scorecards" / "before-after-metrics.csv", encoding="utf-8") as fh:
            rows = {r["metric"]: r for r in csv.DictReader(fh)}
        expect = {
            "engineers": ("18", "18", "18"),
            "deployed_services": ("1", "11", "8"),
            "deployments_per_week": ("14", "6", "12"),
            "mttr_minutes": ("24", "71", "31"),
            "checkout_p95_ms": ("410", "640", "430"),
            "monthly_infra_usd": ("18000", "47000", "29000"),
        }
        for metric, (a, b, c) in expect.items():
            r = rows[metric]
            self.assertEqual((r["before"], r["nine_months_later"], r["after_60_day_review"]), (a, b, c), metric)


if __name__ == "__main__":
    unittest.main()
