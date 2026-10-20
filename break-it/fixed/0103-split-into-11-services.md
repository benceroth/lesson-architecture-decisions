# ADR 0103: Extract one service from the monolith

- **Status:** Trial
- **Date:** 2025-03-01
- **Review date:** 2025-05-01
- **Expiry condition:** Merge the service back if weekly deployments do not improve or MTTR rises above 30 minutes.
- **Owner:** Engineering manager (also owns removal)

## Context

Checkout releases are blocked by unrelated fulfillment changes. Baseline: 14 deployments a week, MTTR 24 minutes, $18,000 a month infrastructure.

## Alternatives considered

1. **Keep the modular monolith and enforce module boundaries.** Cheapest; no network hops.
2. **Extract fulfillment only.** One new deployable, one pipeline.
3. **Split into 11 services.** Highest operating cost and the least evidence that boundaries are right.

## Decision

Extract fulfillment as one service and measure for 60 days before considering any further split.

## Evidence

Baseline is measured. Over the 60 days we track deployments a week, MTTR, checkout P95 and infrastructure bill, and compare them with the baseline in the TCO calculator.

## Exit criteria

Merge the service back into the monolith if the expiry condition triggers. Rollback: route calls back to the in-process module, which stays in the codebase during the trial. Estimated exit cost: about 60 hours.
