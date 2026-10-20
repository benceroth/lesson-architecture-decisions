# Decision exit plan

> Copy this next to the ADR it belongs to. Fill it in **before** adoption and test the rollback during the trial.

- **Decision:** <ADR number and title>
- **Owner of removal:** <named person or role>
- **Review date:** <YYYY-MM-DD>

## Triggers

Measurable conditions that start a removal or reconsideration, for example "fewer than three teams need independent traffic policy" or "pages per week above 10 for two months".

- <trigger 1>
- <trigger 2>

## Rollback steps

1. <first step, for example disable the feature per service>
2. <next step>
3. <last step, and how you confirm the system is healthy>

## Exit cost

| Item | Estimate (hours) | Notes |
|---|---|---|
| Data migration | <hours> | <what moves where> |
| Contract and compatibility changes | <hours> | <who is affected> |
| Decommissioning | <hours> | <what gets deleted> |

Feed the total into the calculator's "Estimated exit effort" field.

## Rollback test

- **Tested on:** <date, environment>
- **Result:** <what worked, what did not>
