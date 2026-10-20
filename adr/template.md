> **Illustrative template.** Copy this file to `adr/NNNN-short-title.md`. The linter skips `template.md` itself but rejects copies that still contain `<placeholders>`, `TODO` or `TBD`.

# ADR NNNN: <Decision title>

- **Status:** <Proposed | Trial | Accepted | Rejected | Deprecated | Superseded | Removed | Partially reversed>
- **Date:** <YYYY-MM-DD>
- **Review date:** <YYYY-MM-DD, or the date this decision is next tested against its exit criteria>
- **Expiry condition:** <measurable condition that forces an earlier review>
- **Owner:** <a named role or person who also owns removal>
- **Outcome:** <KEEP | REMOVE | LIMIT | PARTIALLY REVERSE | PENDING>

## Context

<What is happening? Which business or operational constraint is under pressure? Include the baseline numbers.>

## Constraints

<Hard limits: traffic, team size, compliance, skills, budget, deadlines.>

## Alternatives considered

<At least two, including "do nothing / improve what exists". Say why each was not chosen.>

## Decision

<What we will do, in one or two sentences.>

## Trial scope

<Capability, teams involved, share of traffic, time limit, comparison baseline. See `trials/trial-charter-template.md`.>

## Success measure

<The measure that will show whether it helped, and the threshold.>

## Evidence

<What was measured, over what window, against which baseline. Numbers beat adjectives.>

## Exit criteria

<The condition that makes us remove or reconsider it, the rollback plan, how it was (or will be) tested, and what leaving costs.>

## Consequences

<What becomes simpler, what becomes harder, what we now have to operate.>
