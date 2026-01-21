# Usability

*FURPS+ Requirements Category — How easily the system can be used*

---

## Definition

Usability requirements define how easily developers, operators, and end users can interact with the system. In protocol specifications, this primarily concerns API ergonomics, error clarity, documentation quality, and developer experience.

## Role in the Framework

Usability requirements shape how the system *feels* to work with. While functionality defines what's possible, usability determines whether people can actually accomplish those things efficiently.

```
Usability Requirements
    ↓
Prose Specification ← documents UX expectations
    ↓
Executable Specification ← implements error handling, API patterns
    ↓
SDK Guides, Tutorials ← directly serve usability goals
```

## Core Subcategories

### API Ergonomics
How intuitive and consistent the programmatic interfaces are:
- Naming conventions
- Parameter ordering
- Return value consistency
- Method discoverability

### Error Clarity
How well the system communicates problems:
- Error message specificity
- Error code structure
- Diagnostic information
- Recovery guidance

### Documentation Quality
How well the system is explained:
- Completeness of reference materials
- Quality of examples
- Tutorial availability
- Conceptual explanations

### Developer Experience (DX)
The overall experience of building with the system:
- Time to first successful call
- Debugging ease
- Tooling availability
- Community support

## Blockchain-Specific Usability

Decentralized systems introduce unique usability concerns:

| Subcategory | Examples |
|-------------|----------|
| **Transaction Feedback** | Clear status reporting, confirmation tracking |
| **Gas Estimation** | Accurate cost prediction, explanation of costs |
| **Error Diagnosis** | Revert reason decoding, trace availability |
| **State Inspection** | Easy querying of current state, historical lookups |
| **Event Handling** | Log subscription, filter ergonomics |

## Relationship to Specifications

### Prose Specification
Documents usability expectations:

```markdown
## USAB-2.1: Error Response Format

All error responses SHALL include:
- USAB-2.1.1: Numeric error code from defined enumeration
- USAB-2.1.2: Human-readable message describing the error
- USAB-2.1.3: Context object with relevant parameters
- USAB-2.1.4: Suggested remediation when determinable

Example:
{
  "error": {
    "code": -32000,
    "message": "insufficient funds for gas * price + value",
    "data": {
      "required": "0x1bc16d674ec80000",
      "available": "0x0de0b6b3a7640000",
      "suggestion": "Reduce transaction value or add funds to account"
    }
  }
}
```

### Executable Specification
Implements error handling patterns:

```python
@dataclass
class RPCError:
    """
    Implements USAB-2.1: Error Response Format
    """
    code: int
    message: str
    data: Optional[Dict[str, Any]] = None
    
    def with_suggestion(self, suggestion: str) -> 'RPCError':
        if self.data is None:
            self.data = {}
        self.data['suggestion'] = suggestion
        return self

def check_balance(state: State, sender: Address, required: int) -> None:
    """Validates balance with usability-focused error."""
    available = get_balance(state, sender)
    if available < required:
        raise RPCError(
            code=-32000,
            message="insufficient funds for gas * price + value",
            data={
                "required": hex(required),
                "available": hex(available)
            }
        ).with_suggestion("Reduce transaction value or add funds to account")
```

## Downstream Dependencies

Usability requirements heavily influence consumer-facing documentation:

| Downstream Document | What It Derives |
|--------------------|-----------------|
| SDK Guides | Error handling patterns, API usage examples |
| Developer Guides | Best practices for common tasks |
| Tutorials | Learning paths designed for clarity |
| Reference Manuals | Complete error code listings |
| API Documentation | Clear parameter descriptions |

## Usability and Multi-Client Ecosystems

In systems with multiple client implementations, usability requirements ensure consistent developer experience:

```markdown
## USAB-4.1: Cross-Client Consistency

All client implementations SHALL:
- USAB-4.1.1: Use identical error codes for equivalent conditions
- USAB-4.1.2: Return equivalent response structures
- USAB-4.1.3: Support the same RPC method names
- USAB-4.1.4: Document client-specific extensions clearly
```

This prevents the situation where code works with one client but fails mysteriously with another.

## Quality Criteria

- **Learnable**: New developers can get started quickly
- **Efficient**: Experienced developers can work productively
- **Memorable**: Patterns are consistent enough to recall
- **Error-tolerant**: Mistakes are easy to diagnose and recover from
- **Satisfying**: The overall experience feels well-designed

## Best Practices

- Conduct developer experience testing with real users
- Measure time-to-first-success for common tasks
- Ensure error messages answer "what happened" and "what to do"
- Provide working examples for every API endpoint
- Make the happy path obvious and the error paths clear
- Document the "why" alongside the "how"
