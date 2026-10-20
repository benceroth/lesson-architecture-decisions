# ADR 0005: Adopt GraphQL for the storefront (limited, needs evidence)

> **Illustrative.** RelayCart is a fictional company from [The Hidden Cost of Trend-Driven Architecture](https://medium.com/@benceroth/the-hidden-cost-of-trend-driven-architecture-78bca3f4c616). All numbers are carried over from the post and are illustrative, not client data or a benchmark. The post does not say how GraphQL performed; this ADR deliberately shows a decision whose evidence is still thin.

- **Status:** Trial
- **Date:** 2025-06-23
- **Review date:** 2025-12-15
- **Expiry condition:** If the evidence below is not collected by the review date, the default is to remove GraphQL rather than extend the trial.
- **Owner:** Storefront team lead
- **Outcome:** LIMIT

## Context

Storefront clients need flexible queries over catalogue and cart data. GraphQL can give clients that flexibility. It was first used more broadly, which added another operating model.

## Constraints

- Scope must stay small: GraphQL is used for the storefront only, not for service-to-service communication (as in the post).
- No change may regress checkout P95 (410 ms before, 430 ms after review).

## Alternatives considered

1. **Keep REST endpoints with purpose-built view models.**
2. **GraphQL for the storefront only.**
3. **GraphQL everywhere**, including service-to-service calls.

## Decision

Keep GraphQL, limited to the storefront (alternative 2), as a trial until the evidence is in.

## Trial scope

Storefront team only; no service-to-service use; compare against the REST view models for the same screens.

## Success measure

Fewer client round trips or less client-driven endpoint churn for storefront screens, without worsening checkout P95 or adding pages.

## Evidence

- Known: GraphQL is restricted to the storefront after the 60-day review.
- Missing (illustrative): no before/after measurement of round trips, endpoint-change lead time, or pages from the GraphQL gateway. Until these exist this is a preference, not yet an architecture decision. The first action is to collect them.
- Window: 30 days from the date of the trial restart, measured against the REST baseline.

## Exit criteria

Remove GraphQL from the storefront and return to REST view models if the measures above show no improvement at the review date, or if it needs more than one engineer's regular attention. Rollback path: keep the REST view models alive in parallel during the trial so clients can switch back. Exit cost: client query rewrites.

## Consequences

- Simpler (if it works): fewer bespoke endpoints for the storefront.
- Harder: query cost control, schema governance, another thing to learn and monitor.
