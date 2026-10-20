# lesson-architecture-decisions

[![ADR lint and tests](../../actions/workflows/adr-lint.yml/badge.svg)](../../actions/workflows/adr-lint.yml)

**The question this repo answers:** how do you decide whether a technology earns its place, and how do you get out if it does not?

**After using it you can:** write an ADR with evidence and exit criteria, estimate the whole cost of a technology (not just the bill), run a bounded trial, and review a decision later against measures.

Companion to *The Hidden Cost of Trend-Driven Architecture* ([read the story](https://medium.com/@benceroth/the-hidden-cost-of-trend-driven-architecture-78bca3f4c616)). RelayCart is a **fictional** company; every RelayCart number here comes from the post and is **illustrative**, not client data or a benchmark.

## Try it in five minutes

No paid service, no build step, standard library only.

```
python tools/adr_lint.py adr                   # all five ADRs pass
python tools/adr_lint.py tests/fixtures        # the deliberately bad sample fails (exit code 1)
python break-it/run.py                         # trend-driven ADRs rejected, fixed ones accepted
python -m unittest discover -s tests -v        # linter + metrics consistency tests
node --test tests/tco.test.js                  # calculator logic + CSV parity + page checks
```

Use the [live calculator](https://benceroth.github.io/lesson-architecture-decisions/), or open [`calculator/web/index.html`](calculator/web/index.html) locally (published by `pages.yml`).

## Worked calculator example

The three presets with the documented defaults (illustrative assumptions, not measurements). Regenerate with `node tools/tco_example.js`.

| State | Services | Components | Infra / month | Operating hours / month | Complexity budget used |
|---|---|---|---|---|---|
| Before | 1 | 0 | $18,000 | 30.7 | 13.1% (within) |
| Nine months later | 11 | 4 | $47,000 | 255.9 | 109.4% (over) |
| After 60-day review | 8 | 3 | $29,000 | 162.3 | 69.3% (within) |

The budget is 10% of 18 engineers x 130 productive hours = 234 hours a month. Formulas: [docs/tco-formula.md](docs/tco-formula.md).

## Extend it

1. Add an `hourlyRate` scenario to [`tools/tco_example.js`](tools/tco_example.js) and compare the dollar total with the bill alone.
2. Teach [`tools/adr_lint.py`](tools/adr_lint.py) to require a measurable **Expiry condition**, and add a failing sample to [`break-it/bad/`](break-it/bad/).
3. Write an ADR from [`templates/`](templates/) for a technology your team is considering, pair it with a [decision exit plan](templates/decision-exit-plan.md), and run the linter.

## What is in here

| Path | Purpose |
|---|---|
| [`adr/`](adr/) | Five RelayCart ADRs and [`template.md`](adr/template.md) |
| [`trials/`](trials/) | Trial charter (30 days, 2 teams, 10% traffic, rollback) and review templates |
| [`calculator/`](calculator/) | [`tco-model.csv`](calculator/tco-model.csv), formulas in [`docs/tco-formula.md`](docs/tco-formula.md), and the static [web page](calculator/web/index.html) |
| [`scorecards/`](scorecards/) | [Radar lite](scorecards/technology-radar-lite.md) and [before/after metrics](scorecards/before-after-metrics.csv) |
| [`questions/`](questions/ten-questions-before-adopting.md) | Ten questions before adopting |
| [`templates/`](templates/) | Sample ADRs to copy and a [decision exit plan](templates/decision-exit-plan.md) |
| [`break-it/`](break-it/) | Three trend-driven ADRs the linter rejects, with corrected versions |
| [`tools/adr_lint.py`](tools/adr_lint.py) | ADR linter |
| [`docs/`](docs/) | [How to fill an ADR](docs/how-to-fill-an-adr.md), [reading metrics](docs/reading-metrics.md), [fork as starter](docs/fork-as-starter.md) |

## The RelayCart outcomes

| ADR | Decision | Outcome |
|---|---|---|
| [0001](adr/0001-adopt-kubernetes.md) | Kubernetes for fulfillment workers | Keep |
| [0002](adr/0002-adopt-kafka.md) | Kafka for order events | Keep |
| [0003](adr/0003-adopt-service-mesh.md) | Service mesh | Removed |
| [0004](adr/0004-split-monolith-11-services.md) | 11 services | Partially reversed: 11 to 8 |
| [0005](adr/0005-adopt-graphql.md) | GraphQL | Limited to storefront; evidence still needed |

Illustrative metrics (before / nine months later / after 60-day review): deployments 14 / 6 / 12 a week, MTTR 24 / 71 / 31 minutes, checkout P95 410 / 640 / 430 ms, infrastructure $18,000 / $47,000 / $29,000 a month, with 35% more traffic in the later two states.

## The linter

`tools/adr_lint.py` fails an ADR that lacks a valid **Status**, a **Review date** (`YYYY-MM-DD`), a non-empty **Alternatives considered**, **Evidence** or **Exit criteria** section. Unfilled placeholders (`<...>`, `TODO`, `TBD`) also fail. CI runs it on `adr/` and asserts that it rejects the bad sample in `tests/fixtures/`. This makes the lesson enforceable: no exit criterion, no merge.

## Known limits

- It is a method and a thinking aid, not a prediction engine; the calculator's assumptions are placeholders to replace.
- The linter checks presence and shape, not whether your evidence is good or your exit criterion is wise.
- The post gives no per-technology costs, so the ADRs do not invent any; gaps are stated in each Evidence section.
- Several changes landed together in the story, so individual effects cannot be attributed.
- No `.xlsx` is shipped (binary, unreviewable); use the CSV and documented formulas.
- No separate empty template repository; see [fork as starter](docs/fork-as-starter.md).
- Accessibility was checked with static tests and a quick manual pass, not a full audit.

## Further reading

- [Thoughtworks Technology Radar](https://www.thoughtworks.com/radar)
- [Cloud Native Computing Foundation Landscape](https://landscape.cncf.io/)
- [Architecture Decision Records](https://adr.github.io/)
- [Martin Fowler: Monolith First](https://martinfowler.com/bliki/MonolithFirst.html)
- [DORA](https://dora.dev/)

### Where to go next

| Repo | What it covers |
|---|---|
| [lesson-monolith-strangler](https://github.com/benceroth/lesson-monolith-strangler) | Moving off a monolith step by step instead of a rewrite |
| [lesson-year-two-diagnostics](https://github.com/benceroth/lesson-year-two-diagnostics) | Finding what a platform really costs in its second year |
| [lesson-bicep-modules](https://github.com/benceroth/lesson-bicep-modules) | Reusable infrastructure modules, so platform choices stay swappable |

## License

[MIT](LICENSE). See also [SECURITY.md](SECURITY.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

<sub>[Bence Roth](https://broth.hu/)</sub>
