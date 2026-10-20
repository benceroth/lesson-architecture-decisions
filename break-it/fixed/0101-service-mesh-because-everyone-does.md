# ADR 0101: Limit the service mesh to a two-team trial

- **Status:** Trial
- **Date:** 2025-03-01
- **Review date:** 2025-04-01
- **Expiry condition:** Remove if fewer than three teams need independent traffic policy by the review date.
- **Owner:** Platform lead (also owns removal)

## Context

Eleven services are planned and nobody has yet named a traffic policy (routing, retries, access rules) that platform networking cannot provide. Baseline: MTTR 24 minutes, 14 deployments a week.

## Alternatives considered

1. **Platform networking plus library-level timeouts and retries.** Cheapest; no new layer to operate.
2. **Merge chatty services** so fewer calls cross the network.
3. **Service mesh.** Adds upgrades, sidecars and one more layer to debug.

## Decision

Trial the mesh on two services owned by two teams, with 10% of eligible traffic, for 30 days.

## Evidence

Nothing yet beyond a vendor demo. During the trial we will record the policies teams actually use, extra on-call pages, and upgrade hours, and enter them in the TCO calculator next to the baseline.

## Exit criteria

Remove the mesh if fewer than three teams need independent traffic policy at the review date. Rollback: disable sidecar injection per service, then remove the control plane; test this in week one. Estimated exit cost: about 40 hours.
