# Now break it

Three "trend-driven" ADRs that the linter rejects, and a corrected version of each. Run:

```
python break-it/run.py
```

| Bad ADR | What the linter catches | Fixed version |
|---|---|---|
| [0101 service mesh because everyone does](bad/0101-service-mesh-because-everyone-does.md) | No review date; exit criteria is "None. It is strategic." (too short to be a plan) | [fixed/0101](fixed/0101-service-mesh-because-everyone-does.md): trial scope, measurable expiry condition, rollback |
| [0102 Kafka for everything](bad/0102-kafka-for-everything.md) | No alternatives section; one-line evidence; exit criteria "Revisit if it fails." | [fixed/0102](fixed/0102-kafka-for-everything.md): three alternatives, evidence to collect, a tested fallback |
| [0103 split into 11 services](bad/0103-split-into-11-services.md) | No review date; `TBD`, `TODO` and `<rollback plan>` placeholders left in required sections | [fixed/0103](fixed/0103-split-into-11-services.md): one extraction, baseline numbers, merge-back condition |

## What the linter does and does not catch

It checks **shape**: a valid status, a review date, and non-empty Alternatives considered, Evidence and Exit criteria sections with no placeholders. It does not judge whether your evidence is good, and it has no field for cost. The fixed versions carry cost in Evidence and in the exit estimate; put the numbers into the [calculator](https://benceroth.github.io/lesson-architecture-decisions/) to see whether the decision fits your complexity budget.

Try it: write a fourth bad ADR that passes the linter but is still a trend-driven decision, then decide what check would catch it.
