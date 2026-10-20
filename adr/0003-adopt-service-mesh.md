# ADR 0003: Adopt a service mesh (removed)

> **Illustrative.** RelayCart is a fictional company from [The Hidden Cost of Trend-Driven Architecture](https://medium.com/@benceroth/the-hidden-cost-of-trend-driven-architecture-78bca3f4c616). All numbers are carried over from the post and are illustrative, not client data or a benchmark.

- **Status:** Removed
- **Date:** 2025-05-12
- **Review date:** 2025-11-28
- **Expiry condition:** Re-adopt only if at least three teams need independent traffic policy.
- **Owner:** Platform lead (also owns removal)
- **Outcome:** REMOVE

## Context

With the monolith being split into 11 services, a service mesh looked like the standard way to manage service-to-service traffic.

## Constraints

- 18 engineers and eight to eleven deployed services, not hundreds.
- Every extra operating model adds upgrades, debugging layers and concepts to learn.

## Alternatives considered

1. **No mesh; use platform networking and library-level timeouts and retries.**
2. **Service mesh.**
3. **Merge chatty services so that fewer calls cross the network** (partly pursued in [ADR 0004](0004-split-monolith-11-services.md)).

## Decision

Adopt the service mesh across all services. (Superseded by the review below.)

## Trial scope

This was not run as a bounded trial: it went to all services at once. That is the process failure this ADR exists to record. A 30-day window, two teams and 10% of eligible traffic would have exposed the problem sooner.

## Success measure

Traffic policy (routing, retries, fine-grained access rules) is used by services and reduces incidents or delivery effort.

## Evidence

- The 60-day review found that RelayCart "does not use the traffic-policy capabilities that would justify its operational burden".
- The trigger that revealed it: while reviewing why MTTR had risen from 24 to 71 minutes and checkout P95 from 410 to 640 ms, responders had to reason about one more network layer, yet no team could name a policy that depended on the mesh.
- After removal and the other changes, MTTR was 31 minutes and checkout P95 430 ms. Several changes landed together, so the mesh's individual share is not established (correlation, not proof).

## Exit criteria

The condition to reconsider was: "revisit if fewer than three teams need independent traffic policy". Fewer than three did, so the mesh was removed. Rollback path used: disable sidecar injection per service, then remove the control plane. Exit cost was low because no application contract depended on mesh features.

## Consequences

- Simpler: one fewer layer to debug during incidents, fewer upgrades.
- Harder: if traffic policy needs grow, the capability must be added again, deliberately and with a trial.
