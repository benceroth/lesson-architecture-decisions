# Technology radar (lite)

The [Thoughtworks Technology Radar](https://www.thoughtworks.com/radar) uses adopt, trial, assess and hold. This is a small internal version: confidence grows as evidence accumulates.

> **Illustrative.** The RelayCart rows reflect the post's outcomes at the 60-day review. The post does not discuss other technologies.

| Ring | Meaning | Evidence needed to enter | Rules of use |
|---|---|---|---|
| **Adopt** | Default choice for the stated constraint. | Completed trial review with measures met and a rehearsed exit. | Owner and review date on the ADR. |
| **Trial** | Bounded use. | Trial charter: one capability, 2 teams, 10% of eligible traffic, 30 days, rollback. | Not a company standard. |
| **Assess** | Worth understanding. | A named constraint it might address. | Reading and prototypes only; no production traffic. |
| **Hold** | Do not start new use. | Review showed no justifying constraint, or cost exceeded value. | Existing use has an owner and removal plan. |

## RelayCart (illustrative)

| Technology | Ring | Scope | Why | ADR |
|---|---|---|---|---|
| Kubernetes | Adopt | Fulfillment workers | Independent scaling, consistent deployment | [0001](../adr/0001-adopt-kubernetes.md) |
| Kafka | Adopt | Order events | Replayable events for fulfillment and audit | [0002](../adr/0002-adopt-kafka.md) |
| Service mesh | Hold | None (removed) | Traffic-policy features not used | [0003](../adr/0003-adopt-service-mesh.md) |
| Service split (11 services) | Adopt (8 services) | Five consolidated into two domain modules | Boundaries earn their cost only where change and scale differ | [0004](../adr/0004-split-monolith-11-services.md) |
| GraphQL | Trial | Storefront only | Evidence still being collected | [0005](../adr/0005-adopt-graphql.md) |

## How to use it for your stack

1. List every platform component you operate.
2. Place each in a ring using the evidence column, not enthusiasm.
3. For each Trial or Hold entry, check the linked ADR has an owner, exit criteria and a review date (`python tools/adr_lint.py adr`).
4. Revisit on the ADR review dates.
