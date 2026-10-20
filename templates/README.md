# Sample ADRs to copy

Start from a filled-in example that is close to your decision, then replace the content with your own constraints and evidence. All are fictional RelayCart records with illustrative numbers.

| If your decision is... | Copy | Why it is a good model |
|---|---|---|
| A technology that earned its place | [`adr/0001-adopt-kubernetes.md`](../adr/0001-adopt-kubernetes.md) | Constraint, measure and exit condition all named |
| A technology you ended up removing | [`adr/0003-adopt-service-mesh.md`](../adr/0003-adopt-service-mesh.md) | Shows the expiry condition firing and the rollback path used |
| A trial without enough evidence yet | [`adr/0005-adopt-graphql.md`](../adr/0005-adopt-graphql.md) | States honestly what evidence is still missing |

Blank skeleton: [`adr/template.md`](../adr/template.md). Exit plan to pair with an ADR: [`decision-exit-plan.md`](decision-exit-plan.md). Check your copy with `python tools/adr_lint.py adr`.
