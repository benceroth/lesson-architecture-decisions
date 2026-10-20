# ADR 0001: Adopt Kubernetes for fulfillment workers

> **Illustrative.** RelayCart is a fictional company from [The Hidden Cost of Trend-Driven Architecture](https://medium.com/@benceroth/the-hidden-cost-of-trend-driven-architecture-78bca3f4c616). All numbers are carried over from the post and are illustrative, not client data or a benchmark.

- **Status:** Accepted
- **Date:** 2025-02-10
- **Review date:** 2025-11-28
- **Expiry condition:** Reconsider if fewer than two workloads need independent scaling, or if platform upkeep exceeds the complexity budget in the [calculator](../calculator/web/index.html) for two consecutive months.
- **Owner:** Platform lead
- **Outcome:** KEEP

## Context

RelayCart (18 engineers) ran a modular monolith: 14 deployments a week, MTTR 24 minutes, checkout P95 410 ms, infrastructure $18,000 a month. Fulfillment workers have bursty load that is unrelated to checkout load, and they could not scale on their own.

## Constraints

- 18 engineers, no dedicated platform team at the start.
- Traffic expected to grow (it later grew 35%).
- Fulfillment must keep up during dispatch peaks.
- Every added operating model competes with delivery speed.

## Alternatives considered

1. **Stay on the existing VM scale sets and tune them.** Cheapest to operate, but scaling units stay coupled to the monolith.
2. **Managed container service without an orchestrator.** Less to learn; weaker support for the consistent deployment model the team wanted for workers.
3. **Kubernetes.** Most capable; largest operating and learning burden.

## Decision

Run the fulfillment workers on Kubernetes, with one owning team. Do not move the rest of the estate unless a measured constraint requires it.

## Trial scope

Fulfillment workers only; two teams; time-boxed evidence window before wider use (see [trial charter template](../trials/trial-charter-template.md)).

## Success measure

Workers scale independently during dispatch peaks without hurting checkout latency, and deployments of workers are consistent across environments.

## Evidence

- The post states Kubernetes stays "because the fulfillment workers need independent scaling and consistent deployment".
- After the 60-day review RelayCart still supports 35% more traffic than before the changes, with checkout P95 430 ms and 12 deployments a week.
- Gap (illustrative): no per-component cost split is given in the post. Infrastructure cost fell from $47,000 to $29,000 a month overall, and the $11,000 a month above the original bill is attributed to demonstrated scaling and event-stream needs.

## Exit criteria

Remove or shrink the cluster if the fulfillment workloads no longer need independent scaling, or if cluster upgrades and on-call pages exceed the agreed share of team capacity for two consecutive months. Rollback path: the workers can be packaged back into the monolith deployment; this was rehearsed during the trial. Exit cost is mostly pipeline and manifest rework.

## Consequences

- Simpler: consistent worker deployment, independent scaling.
- Harder: upgrades, certificates, cluster incidents. Someone must own these next year, not just at launch.
