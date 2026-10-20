# Trial review template

> **Illustrative template.** Complete at the end of the evidence window and attach the result to the linked ADR's Evidence section.

- **Trial / ADR:**
- **Review date:**
- **Reviewers:**

## 1. Results against the charter

| Measure | Baseline | Result | Success threshold met? | Rollback threshold hit? |
|---|---|---|---|---|
| Checkout P95 (ms) | | | | |
| MTTR (minutes) | | | | |
| Deployment frequency (per week) | | | | |
| Pages from the new component | | | | |
| Upkeep hours | | | | |
| Infrastructure cost (monthly) | | | | |

## 2. What else changed in the window?

List other releases, traffic changes, hires, or incidents. Several changes landing together makes attribution weak; say so rather than claim the trial caused the result (correlation is not cause; see `docs/reading-metrics.md`).

## 3. Was the exit tested?

- Rollback run during the trial? Result:
- Cost of leaving today (hours, data, contracts):

## 4. Decision

Choose one and record it in the ADR with a new review date:

- [ ] **Adopt** (limited scope, owner, next review date)
- [ ] **Extend** (only with a specific missing measurement and a new end date)
- [ ] **Hold** (keep as is, no expansion)
- [ ] **Remove** (owner, deadline, acceptance criteria for removal)

## 5. Actions

| Action | Owner | Due |
|---|---|---|
| | | |
