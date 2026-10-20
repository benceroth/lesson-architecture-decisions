# How to fill in an ADR

Copy [`adr/template.md`](../adr/template.md) to `adr/NNNN-short-title.md` and complete every section. The linter (`python tools/adr_lint.py adr`) fails a file with no valid status, no review date, or empty Evidence or Exit criteria.

## Header fields

- **Status:** Proposed, Trial, Accepted, Rejected, Deprecated, Superseded, Removed, or Partially reversed.
- **Review date:** `YYYY-MM-DD`. A date by which the decision is tested against its exit criteria. "When we have time" is not a date.
- **Expiry condition:** A measurable trigger for an earlier review. "Revisit if fewer than three teams need independent traffic policy" can be tested; "strategic platform" cannot.
- **Owner:** A named role that also owns removal.
- **Outcome:** KEEP, REMOVE, LIMIT, PARTIALLY REVERSE or PENDING.

## Sections

| Section | Write | Weak example | Strong example |
|---|---|---|---|
| Context | Baseline and pressure. | "We need to modernize." | "18 engineers, 14 deployments a week, MTTR 24 min." |
| Constraints | Hard limits. | "Must be scalable." | "Fulfillment must scale independently of checkout." |
| Alternatives | At least two, including doing nothing. | One option. | Three, each with why not. |
| Evidence | What was measured, window, baseline; include gaps. | "Demo worked." | "30-day window, 10% traffic, P95 430 ms vs 410 ms baseline." |
| Exit criteria | Trigger, rollback, rehearsal, cost of leaving. | "TBD". | "Remove if X; rollback rehearsed on date." |

## Common mistakes

- Writing the ADR after rollout; the evidence then supports the decision instead of testing it.
- Evidence that is only adjectives.
- Exit criteria that cannot fail.
- Attributing an outcome to one change when several landed together.

## Illustrative status

The ADRs in this repo describe the fictional RelayCart. Keep the "Illustrative" banner out of your own ADRs.
