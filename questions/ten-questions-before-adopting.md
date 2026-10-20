# Ten questions before adopting a technology

The post lists six questions; these ten extend them into a checklist for a design review. Answer in writing, in the ADR. "We don't know yet" is a valid answer if it becomes a trial measure.

1. **Which constraint does it address?** Name it, with a number if possible. "Companies at scale use it" is not a constraint.
2. **What measure will show whether it helped?** Pick it and record the baseline now (deployment frequency, MTTR, P95, cost).
3. **What condition would make us remove or reconsider it?** Make it testable, such as "fewer than three teams need independent traffic policy".
4. **What will become simpler or unnecessary?** If it removes no tool, process or responsibility, it is probably another layer.
5. **What will it take to operate next year?** Upgrades, certificate rotation, schema changes, recovery planning, and what happens when the champion leaves.
6. **Can we test the exit?** Rehearse the rollback during the trial, before more teams and traffic depend on it.
7. **Are we testing the work, or standardizing the choice?** Limit scope: one capability, two teams, 10% of eligible traffic, 30 days.
8. **Does it work in real business conditions?** Checkout during a promotion, fulfillment during a busy dispatch period.
9. **Who owns removal?** Consolidation needs time, acceptance criteria and an owner, just like a rollout.
10. **What does the whole cost look like?** Execution, operations, cognitive load and exit. Try the [calculator](../calculator/web/index.html).

If you cannot answer questions 1 to 3, you may have a technology preference rather than an architecture decision.
