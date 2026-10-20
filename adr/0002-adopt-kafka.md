# ADR 0002: Adopt Kafka for order events

> **Illustrative.** RelayCart is a fictional company from [The Hidden Cost of Trend-Driven Architecture](https://medium.com/@benceroth/the-hidden-cost-of-trend-driven-architecture-78bca3f4c616). All numbers are carried over from the post and are illustrative, not client data or a benchmark.

- **Status:** Accepted
- **Date:** 2025-03-17
- **Review date:** 2025-11-28
- **Expiry condition:** Reconsider if no consumer has replayed events in a full review window and audit no longer needs the event history.
- **Owner:** Fulfillment team lead
- **Outcome:** KEEP

## Context

Fulfillment and audit both depend on a trustworthy history of order events. Point-to-point calls lose history and make it hard to rebuild a consumer's state after a defect.

## Constraints

- Audit requires a replayable record of order events.
- Fulfillment consumers must be able to recover from their own bugs without asking producers to resend.
- 18 engineers must be able to run it through an incident.

## Alternatives considered

1. **Database outbox table plus polling.** Simple and cheap; replay is possible but ad hoc and puts load on the primary database.
2. **Managed queue.** Less to operate; messages are consumed rather than retained, so replay is limited.
3. **Kafka.** Durable, replayable log; operations and schema evolution are real work.

## Decision

Use Kafka for order events only. Do not use it as a general integration bus.

## Trial scope

One producer (orders) and two consumers (fulfillment, audit) before any other team joins.

## Success measure

A consumer can be rebuilt from the log, and audit questions are answered from replayed events.

## Evidence

- The post states Kafka stays "because replayable order events support fulfillment and audit requirements".
- Gap (illustrative): the post does not give Kafka's operating hours or pages. Record them in the [before/after metrics](../scorecards/before-after-metrics.csv) when available.

## Exit criteria

Reconsider if the replay and audit needs disappear, or if a simpler store (for example an outbox with retention) meets them at lower operating cost. Rollback path: dual-write events to an outbox during the trial so consumers can be switched back. Exit cost: consumer rewrites and a history export for audit.

## Consequences

- Simpler: consumer recovery, audit questions.
- Harder: schema changes, retention, broker upgrades and recovery planning.
