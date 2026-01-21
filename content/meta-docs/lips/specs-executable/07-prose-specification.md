# Prose Specification

*Canonical Specification Layer — Human-readable requirements with rationale*

---

## Definition

A prose specification is a formal, human-readable document that defines system requirements, constraints, and expected behaviors using natural language augmented with precise terminology. It serves as the authoritative source for understanding *what* the system must do and *why*.

## Role in the Framework

The prose specification is one half of the dual-specification model. It provides what executable specifications cannot: rationale, context, design discussion, and accessibility to non-technical stakeholders.

```
FURPS+ Requirements
    ↓
Prose Specification ← documents requirements in structured natural language
    ↕ (bidirectional sync)
Executable Specification ← implements precise behavior
    ↓
All downstream documentation
```

## Relationship to Executable Specification

The prose and executable specifications are **two views of the same truth**:

| Prose Specification | Executable Specification |
|---------------------|-------------------------|
| Human-readable | Machine-readable |
| Explains "why" | Defines "what exactly" |
| Includes rationale | Pure behavior |
| Accessible to all stakeholders | Requires technical expertise |
| May have ambiguity | Precise by construction |
| Normative intent | Normative behavior |

They must remain synchronized. When they diverge, either:
1. The prose spec needs updating (behavior changed)
2. The executable spec has a bug (doesn't match intent)

## Core Components

### Metadata
Standard identification and versioning:
```yaml
---
title: Message Protocol Specification
short-name: MSG-SPEC
version: 2.1.0
status: Stable
editor: Protocol Team
date: 2024-03-15
---
```

### Scope and Purpose
What the specification covers and why it exists:
```markdown
## 1. Purpose

This specification defines the message protocol for peer-to-peer 
communication in the network. It ensures interoperability between 
independent client implementations.

## 2. Scope

This specification covers:
- Message format and encoding (Section 3)
- Message validation rules (Section 4)
- Delivery semantics (Section 5)

This specification does NOT cover:
- Transport layer (see Transport Spec)
- Cryptographic primitives (see Crypto Spec)
```

### Requirements
Formal statements using RFC 2119 keywords:

```markdown
## 3. Message Format

### 3.1 Message Structure

A message MUST contain the following fields:
- 3.1.1: `id` — Unique identifier (UUIDv4)
- 3.1.2: `sender` — Sender's public key (32 bytes)
- 3.1.3: `payload` — Message content (max 64KB)
- 3.1.4: `timestamp` — Unix milliseconds
- 3.1.5: `signature` — Ed25519 signature over id||payload||timestamp

A message MAY contain:
- 3.1.6: `reply_to` — ID of message being replied to
- 3.1.7: `metadata` — Application-specific key-value pairs
```

### Rationale
Explanation of design decisions:

```markdown
### 3.2 Rationale

**64KB payload limit (3.1.3)**: This limit ensures reliable delivery 
across constrained relay nodes. Larger messages should use the chunking 
protocol (Section 7).

**Ed25519 signatures (3.1.5)**: Chosen over secp256k1 for:
- Faster verification (important for high-throughput nodes)
- Resistance to implementation vulnerabilities
- Simpler constant-time implementation

Alternative considered: BLS signatures would enable aggregation but 
add pairing complexity not needed for point-to-point messages.
```

### Cross-References
Links to related specifications and executable spec:

```markdown
### 3.3 References

- Executable implementation: `ethereum/message/format.py`
- Test vectors: `tests/fixtures/message_format.json`
- Related: Transport Spec Section 4 (message framing)
```

## FURPS+ Organization

Prose specifications should organize requirements by FURPS+ category:

```markdown
## 4. Functional Requirements
[Core capabilities the system provides]

## 5. Usability Requirements
[API design, error handling, developer experience]

## 6. Reliability Requirements
[Availability, fault tolerance, safety, liveness]

## 7. Performance Requirements
[Throughput, latency, gas costs, finality]

## 8. Supportability Requirements
[Upgradability, observability, fork management]

## 9. Constraints
[Design, implementation, interface, consensus, decentralization]
```

## Prose-Executable Synchronization

### Linking Requirements to Code

Each prose requirement should reference its executable implementation:

```markdown
### 4.2.3 Transaction Validation

A transaction SHALL be rejected if any of the following conditions hold:
- 4.2.3.1: Signature is invalid
- 4.2.3.2: Nonce does not match sender's current nonce  
- 4.2.3.3: Sender balance is insufficient for gas × price + value
- 4.2.3.4: Gas limit exceeds block gas limit

**Implementation**: `ethereum/transaction/validation.py:validate_transaction()`
**Test vectors**: `tests/fixtures/transaction_validation/`
```

### Detecting Divergence

Synchronization can be verified by:

```markdown
## Appendix A: Traceability Matrix

| Requirement | Executable Location | Test Coverage |
|-------------|--------------------| --------------|
| 4.2.3.1 | validation.py:42 | test_invalid_signature |
| 4.2.3.2 | validation.py:56 | test_nonce_mismatch |
| 4.2.3.3 | validation.py:63 | test_insufficient_balance |
| 4.2.3.4 | validation.py:71 | test_gas_limit_exceeded |
```

## Audience Considerations

Prose specifications serve multiple audiences:

| Audience | What They Need |
|----------|---------------|
| Implementers | Precise requirements, test vectors |
| Auditors | Security properties, threat models |
| Researchers | Formal properties, correctness arguments |
| Regulators | Compliance-relevant behaviors |
| Community | Design rationale, tradeoffs |

The prose spec must be accessible to all while maintaining precision for implementers.

## Quality Criteria

- **Complete**: All FURPS+ categories addressed
- **Precise**: Uses RFC 2119 keywords correctly
- **Traceable**: Requirements link to executable spec
- **Rationale**: Design decisions are explained
- **Versioned**: Changes tracked with clear history
- **Accessible**: Readable by non-implementer stakeholders

## Best Practices

- Use unique identifiers for every requirement (e.g., 4.2.3.1)
- Include rationale for non-obvious decisions
- Cross-reference the executable specification
- Maintain a traceability matrix
- Version prose and executable specs together
- Review prose spec when executable spec changes
- Include diagrams for complex state machines or flows
