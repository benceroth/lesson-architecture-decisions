# TCO model formulas

The calculator is a **thinking aid, not a prediction**. Inputs marked "assumption" in [`calculator/tco-model.csv`](../calculator/tco-model.csv) are placeholders to replace with your own data. Only engineers, services and the monthly infrastructure bill come from the post.

All values are monthly unless noted. `WEEKS_PER_MONTH = 4.33`.

```
executionCost      = infraMonthly + licencesMonthly
upgradeHoursTotal  = tools * upgradeHours
serviceHoursTotal  = services * serviceHours
oncallHours        = pagesPerWeek * 4.33 * hoursPerPage
operationsHours    = upgradeHoursTotal + serviceHoursTotal + oncallHours
incidentHoursTotal = incidentHours * responders
cognitiveHours     = engineers * tools * learningHours
exitHoursPerMonth  = exitHours / amortMonths
totalHours         = operationsHours + incidentHoursTotal + cognitiveHours + exitHoursPerMonth

capacityHours      = engineers * productiveHours
budgetHours        = capacityHours * budgetPct / 100
budgetUsedPct      = totalHours / budgetHours * 100
status             = within (<= 80%) | near (<= 100%) | over (> 100%)

hoursCost          = totalHours * hourlyRate        (0 by default)
totalMonthlyCost   = executionCost + hoursCost
```

## Mapping to the post's four costs

| Post cost | Variables |
|---|---|
| Execution | `infraMonthly`, `licencesMonthly` |
| Operations | `upgradeHours`, `serviceHours`, `pagesPerWeek`, `hoursPerPage`, `incidentHours`, `responders` |
| Cognitive load | `learningHours` x `engineers` x `tools` |
| Exit | `exitHours`, `amortMonths` |

## Spreadsheet use

Import the CSV into any spreadsheet and enter the formulas above in the output rows (the `formula` column lists them in the same notation). No binary workbook is shipped, so changes stay reviewable in Git.

## Limits

- Linear model: no interaction effects, no learning curve, no cost of delay.
- Hours are estimates; the default `hourlyRate` of 0 avoids false precision.
- The 80% and 100% thresholds are conventions, not research results.
- The CSV and the JavaScript are kept in sync by `tests/tco.test.js`.
