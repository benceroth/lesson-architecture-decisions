# ADR 0102: Trial Kafka for order events

- **Status:** Trial
- **Date:** 2025-03-01
- **Review date:** 2025-04-15
- **Expiry condition:** Fall back to the existing database queue if consumer lag cannot be held under one minute.
- **Owner:** Platform lead (also owns removal)

## Context

Fulfillment needs to replay order events for audit. Today events are rows in a database table. Baseline: checkout P95 410 ms, 18 engineers.

## Alternatives considered

1. **Keep the database table and add a replay command.** No new system.
2. **Managed queue without replay.** Does not meet the audit need.
3. **Kafka.** Meets replay; adds a cluster to run, upgrade and learn.

## Decision

Publish order events to Kafka for the fulfillment workers only, alongside the existing table, for 30 days.

## Evidence

To be gathered during the trial: replay of one week of orders, consumer lag at peak, pages generated, and monthly cost next to the current bill. Results go into the TCO calculator.

## Exit criteria

Stop publishing and keep the table as the source of truth if lag exceeds one minute or the monthly cost exceeds the agreed budget. The table stays authoritative during the trial, so rollback is switching consumers back; test it in week two.
