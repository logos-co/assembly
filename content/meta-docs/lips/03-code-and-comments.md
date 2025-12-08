---
tags:
  - sdd
---
> [!NOTE] This document was generated using AI and has yet to be human reviewed
# Code & Comments

*Implementation Layer — The executable realization of specification requirements*

---

## Definition

Code is the executable implementation of a system. Comments are the inline documentation that explains intent, constraints, and non-obvious decisions within that code. Together, they represent the most concrete artifact in the documentation chain.

## Relationship to the Specification

Code is where specification requirements become operational. Every function, module, and line of logic should ultimately trace back to some aspect of the specification—whether implementing a required behavior, enforcing a constraint, or providing an interface.

| Specification Element | Code Manifestation |
|----------------------|-------------------|
| Required behavior | Function or method implementation |
| Constraint | Validation logic, assertions, guards |
| Interface definition | API signatures, type definitions |
| State machine | Control flow, state variables |
| Data schema | Structs, classes, database models |

## The Role of Comments

Comments bridge the gap between *what* code does (readable from the code itself) and *why* it does it (requiring context from specification or design decisions).

Effective spec-grounded comments:

```go
// validateMessageSize enforces SPEC-3.4.1: Messages must not exceed 64KB.
// This limit exists to ensure compatibility with legacy relay nodes.
func validateMessageSize(msg []byte) error {
    if len(msg) > 65536 {
        return ErrMessageTooLarge
    }
    return nil
}
```

```rust
/// Implements the handshake protocol per SPEC-2.1.
/// 
/// Note: The 3-second timeout (SPEC-2.1.4) is intentionally short
/// to prevent resource exhaustion under adversarial conditions.
pub async fn perform_handshake(peer: &Peer) -> Result<Session> {
    // ...
}
```

## Dependency Chain

```
Specification
    ↓
Architecture Docs ← high-level structure
    ↓
Code & Comments ← executable implementation
    ↓
Test Suites ← verify code against spec
    ↓
Contribution Guidelines ← how to modify code correctly
```

## Why Spec-Grounding Matters

Code without specification grounding is just "stuff that runs." Problems emerge when:

- **Magic numbers**: Values appear without explanation; are they arbitrary or mandated by spec?
- **Unexplained logic**: Complex code paths exist without rationale; are they implementing requirements or working around bugs?
- **Unsafe refactoring**: Developers change code without knowing which specification constraints it enforces
- **Lost intent**: As teams change, the reasons behind implementations are forgotten

## Anti-Patterns

### Comments That Describe What (Useless)
```python
# Increment counter
counter += 1
```

### Comments That Describe Why Without Spec Reference (Better, but Incomplete)
```python
# Prevent overflow
counter += 1
```

### Comments That Ground in Specification (Ideal)
```python
# Per SPEC-7.2: Counter must reset every 2^16 operations to maintain 
# compatibility with 16-bit observers.
counter = (counter + 1) % 65536
```

## Best Practices

- Reference specification sections in comments for non-obvious constraints
- Use structured comment formats (`@spec`, `SPEC-X.Y.Z`) that tooling can extract
- Distinguish between spec-mandated behavior and implementation choices
- Keep spec references up to date when specifications are versioned
- Consider generating code directly from specification where appropriate (schema compilers, protocol buffers)
