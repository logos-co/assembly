---
tags:
  - sdd
---
> [!NOTE] This document was generated using AI and has yet to be human reviewed
# RFCs & Proposals

*Community Layer — The process for evolving specifications*

---

## Definition

RFCs (Requests for Comments) and proposals are formal documents that propose changes to a specification. They provide a structured process for discussing, evaluating, and deciding on specification modifications before implementation.

## Relationship to the Specification

RFCs are the mechanism by which specifications evolve. They create a deliberate, documented process between "someone has an idea" and "the specification is updated."

| Current Specification | RFC Proposes |
|----------------------|--------------|
| "Messages limited to 64KB" | "Increase limit to 1MB for multimedia support" |
| "Ed25519 signatures required" | "Add support for secp256k1 signatures" |
| "Synchronous request-response" | "Add streaming message support" |
| *No specification exists* | "Define new capability X" |

## RFC Lifecycle

```
    ┌────────────┐
    │   Draft    │ ← Author creates proposal
    └─────┬──────┘
          │ Submit for review
          ▼
    ┌────────────┐
    │  Review    │ ← Community discusses
    └─────┬──────┘
          │ Iterate based on feedback
          ▼
    ┌────────────┐
    │ Final Call │ ← Last chance for objections
    └─────┬──────┘
          │
    ┌─────┴─────┐
    ▼           ▼
┌────────┐  ┌──────────┐
│Accepted│  │ Rejected │
└───┬────┘  └──────────┘
    │
    ▼
┌────────────────┐
│ Specification  │ ← Spec updated
│    Updated     │
└───────┬────────┘
        │
        ▼
┌────────────────┐
│ Implementation │ ← Now code can be written
└────────────────┘
```

## Dependency Chain

```
Audit Trails ← identify gaps motivating RFCs
Compliance Checks ← reveal specification problems
    ↓
RFCs & Proposals ← propose specification changes
    ↓
Specification ← updated based on accepted RFCs
    ↓
Changelogs ← document the evolution
All downstream docs ← cascade updates from spec changes
```

## Why Spec-Grounding Matters

RFCs must engage with the existing specification:

- **Context**: What does the current spec say? Why is change needed?
- **Impact**: What spec sections are affected? What breaks?
- **Compatibility**: How do existing implementations migrate?
- **Completeness**: Does the proposal fully specify the new behavior?

RFCs that ignore existing specification create fragmented, inconsistent specs.

## RFC Structure

```markdown
# RFC-0042: Support for Streaming Messages

## Summary

Add streaming message support to enable real-time data transfer without
message size limitations.

## Motivation

Current specification (SPEC-3.4.1) limits messages to 64KB. This prevents
use cases requiring continuous data streams (audio, video, telemetry).

Audit findings (Q4 2024) identified this as the #1 requested feature.

## Specification Changes

### Modified Sections

**SPEC-3.4 Message Size**

Current:
> Messages SHALL NOT exceed 65,536 bytes.

Proposed:
> Standard messages SHALL NOT exceed 65,536 bytes.
> Streaming messages have no size limit but SHALL be chunked per SPEC-3.6.

**NEW: SPEC-3.6 Streaming Messages**

> 3.6.1 Streaming messages are identified by header flag 0x02.
> 3.6.2 Chunks SHALL NOT exceed 16,384 bytes.
> 3.6.3 End-of-stream is signaled by empty chunk.
> ...

### New Sections

- SPEC-3.6: Streaming Messages (new)
- SPEC-4.3: Stream Delivery Semantics (new)

### Affected Sections

- SPEC-3.2: Message Format (header flag addition)
- SPEC-4.2: Message Delivery (streaming delivery semantics)
- SPEC-5.1: Message Signing (streaming authentication)

## Compatibility

### Breaking Changes

None. Standard messages continue to work unchanged.

### Migration Path

Implementations MAY add streaming support incrementally. Implementations
not supporting streaming MUST reject streaming messages with error
STREAM_NOT_SUPPORTED.

## Implementation Notes

Reference implementation: https://github.com/example/streaming-poc

Estimated effort: 2-3 weeks for compliant implementation.

## Alternatives Considered

1. **Increase message size limit**: Rejected due to memory constraints
   on constrained devices (SPEC-1.2 Compatibility Requirements).

2. **External chunking**: Rejected as it pushes complexity to applications
   and creates interoperability issues.

## Open Questions

1. Should streams have maximum duration limits?
2. How should stream priority interact with message priority (SPEC-4.2.4)?

## References

- Current specification: https://spec.example.com/v2.1
- Related RFC: RFC-0038 (Large Message Handling, rejected)
- Audit report: audit_q4_2024.pdf
```

## RFC Evaluation Criteria

When reviewing RFCs:

- **Necessity**: Is the change actually needed? What problem does it solve?
- **Completeness**: Is the proposed specification complete and implementable?
- **Compatibility**: What breaks? Is the migration path acceptable?
- **Consistency**: Does it fit coherently with existing specification?
- **Testability**: Can compliance be verified?
- **Implementability**: Is it practical to implement?

## Best Practices

- Require specification diffs showing exactly what changes
- Include test vectors for new behaviors
- Document rationale for rejected alternatives
- Track RFC status publicly
- Link accepted RFCs to resulting specification versions
- Archive rejected RFCs with reasons (they're valuable history)
- Set time limits on review phases to prevent stagnation
