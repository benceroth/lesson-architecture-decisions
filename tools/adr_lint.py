#!/usr/bin/env python3
"""Lint architecture decision records (ADRs).

An ADR fails when it lacks any of:
  * a valid Status
  * a Review date (YYYY-MM-DD)
  * a non-empty "Alternatives considered" section
  * a non-empty "Evidence" section
  * a non-empty "Exit criteria" section

Usage:
    python tools/adr_lint.py adr            # lint every ADR in a folder
    python tools/adr_lint.py adr/0001-*.md  # lint specific files

Exit codes: 0 = all ADRs pass, 1 = at least one ADR fails, 2 = usage error.
Standard library only.
"""
from __future__ import annotations

import argparse
import datetime
import re
import sys
from pathlib import Path

VALID_STATUSES = (
    "proposed",
    "trial",
    "accepted",
    "rejected",
    "deprecated",
    "superseded",
    "removed",
    "partially reversed",
)
REQUIRED_SECTIONS = ("alternatives considered", "evidence", "exit criteria")
MIN_SECTION_CHARS = 30
SKIPPED_FILES = {"template.md", "readme.md"}

FIELD_RE = re.compile(r"^[-*]\s+\*\*(?P<key>[^*:]+):\*\*\s*(?P<value>.*?)\s*$")
HEADING_RE = re.compile(r"^##\s+(?P<title>.+?)\s*$")
COMMENT_RE = re.compile(r"<!--.*?-->", re.DOTALL)
PLACEHOLDER_RE = re.compile(r"<[A-Za-z][^>\n]*>|\b(TODO|TBD|FIXME)\b")


def parse(text: str) -> tuple[dict[str, str], dict[str, str]]:
    """Return (header fields, sections) with keys lower-cased."""
    text = COMMENT_RE.sub("", text)
    fields: dict[str, str] = {}
    sections: dict[str, list[str]] = {}
    current: str | None = None
    in_fence = False
    for line in text.splitlines():
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        if not in_fence:
            heading = HEADING_RE.match(line)
            if heading:
                current = heading.group("title").strip().lower()
                sections.setdefault(current, [])
                continue
            field = FIELD_RE.match(line)
            if field and current is None:
                fields[field.group("key").strip().lower()] = field.group("value")
                continue
        if current is not None:
            sections[current].append(line)
    return fields, {k: "\n".join(v).strip() for k, v in sections.items()}


def has_placeholder(value: str) -> bool:
    return bool(PLACEHOLDER_RE.search(value))


def lint_text(text: str) -> list[str]:
    """Return a list of problems; an empty list means the ADR passes."""
    problems: list[str] = []
    fields, sections = parse(text)

    status = fields.get("status", "").strip()
    if not status:
        problems.append("missing Status")
    elif has_placeholder(status) or not status.lower().startswith(VALID_STATUSES):
        problems.append(
            f"invalid Status {status!r} (expected one of: {', '.join(VALID_STATUSES)})"
        )

    review = fields.get("review date", "").strip()
    if not review:
        problems.append("missing Review date")
    else:
        try:
            datetime.date.fromisoformat(review.split()[0])
        except ValueError:
            problems.append(f"Review date {review!r} is not a YYYY-MM-DD date")

    for name in REQUIRED_SECTIONS:
        body = next((b for t, b in sections.items() if t.startswith(name)), None)
        label = name.capitalize()
        if body is None:
            problems.append(f"missing '{label}' section")
        elif has_placeholder(body):
            problems.append(f"'{label}' section still contains placeholder text")
        elif len(body) < MIN_SECTION_CHARS:
            problems.append(f"'{label}' section is empty or too short")
    return problems


def collect(paths: list[str]) -> list[Path]:
    files: list[Path] = []
    for raw in paths:
        p = Path(raw)
        if p.is_dir():
            files.extend(sorted(p.glob("*.md")))
        elif p.is_file():
            files.append(p)
        else:
            raise FileNotFoundError(raw)
    return [f for f in files if f.name.lower() not in SKIPPED_FILES]


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("paths", nargs="+", help="ADR files or folders")
    args = parser.parse_args(argv)
    try:
        files = collect(args.paths)
    except FileNotFoundError as exc:
        print(f"error: path not found: {exc}", file=sys.stderr)
        return 2
    if not files:
        print("error: no ADR files found", file=sys.stderr)
        return 2

    failed = 0
    for f in files:
        problems = lint_text(f.read_text(encoding="utf-8"))
        if problems:
            failed += 1
            print(f"FAIL {f}")
            for p in problems:
                print(f"  - {p}")
        else:
            print(f"ok   {f}")
    print(f"{len(files) - failed}/{len(files)} ADRs passed")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
