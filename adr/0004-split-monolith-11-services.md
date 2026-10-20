# ADR 0004: Split the monolith into 11 services (partially reversed)

> **Illustrative.** RelayCart is a fictional company from [The Hidden Cost of Trend-Driven Architecture](https://medium.com/@benceroth/the-hidden-cost-of-trend-driven-architecture-78bca3f4c616). All numbers are carried over from the post and are illustrative, not client data or a benchmark.

- **Status:** Partially reversed
- **Date:** 2025-01-27
- **Review date:** 2025-11-28
- **Expiry condition:** Reconsider any service that changes infrequently and is not independently scaled or deployed by a separate team.
- **Owner:** Architecture lead (also owns consolidation)
- **Outcome:** PARTIALLY REVERSE

## Context

RelayCart ran one deployed modular monolith with 18 engineers. Boundaries felt clear on paper, so the monolith was split into 11 services over the nine-month adoption period.

## Constraints

- One team of 18 engineers, not many autonomous teams.
- Service boundaries are hard to identify early (see Fowler's [Monolith First](https://martinfowler.com/bliki/MonolithFirst.html)).
- Checkout latency and delivery speed must not regress.

## Alternatives considered

1. **Stay a modular monolith and enforce module boundaries.** Keeps the option to distribute later.
2. **Extract only the parts with a demonstrated independent need** (such as fulfillment workers).
3. **Split everything into 11 services now.**

## Decision

Split into 11 services (alternative 3). Reviewed after nine months and 60 further days.

## Trial scope

Not trialled in a bounded way. The split went broadly, which made the consequences hard to attribute.

## Success measure

Deployment frequency up or stable, MTTR and checkout P95 not worse, and infrastructure cost proportional to traffic.

## Evidence

- Nine months after the changes: traffic +35%, but deployments fell from 14 to six a week, MTTR rose from 24 to 71 minutes, checkout P95 rose from 410 to 640 ms, and infrastructure rose from $18,000 to $47,000 a month. Other adoptions happened in the same period, so the split is one contributor among several.
- After the 60-day review: five services that change infrequently were consolidated into two domain modules. 11 - 5 + 2 = 8 deployed services. Deployments recovered to 12 a week, MTTR to 31 minutes, checkout P95 to 430 ms, infrastructure to $29,000 a month.

## Exit criteria

A service stays separate only if it changes often, scales independently, or needs a separate deploy cadence. Rollback path: merge the code into a domain module behind the existing interfaces and retire the extra pipeline. Exit cost was acceptable here because modules kept their boundaries.

## Consequences

- Simpler: fewer pipelines, fewer network hops, easier cross-service diagnosis.
- Harder: module boundaries must be defended in code review because the network no longer enforces them.
