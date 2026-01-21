# EIPs and RFCs

*Community Layer — Proposals with executable specification implementations*

---

## Definition

EIPs (Ethereum Improvement Proposals) and RFCs are formal documents proposing specification changes. In the executable specification model, proposals must include working implementations in the executable spec, not just prose descriptions.

## Role in the Framework

```
Identified Need (from audits, community, research)
    ↓
EIP/RFC ← proposal with executable implementation
    ↓
Review ← community evaluates proposal + implementation
    ↓
Acceptance
    ↓
├── Prose Specification updated
├── Executable Specification merged
├── New Test Fixtures generated
└── Changelogs updated
```

## The Executable Implementation Requirement

Modern EIPs increasingly require executable specification code:

```markdown
# EIP-XXXX: New Precompile for Widget Operations

## Abstract
Add a precompile at address 0x0B for widget operations.

## Specification

### Prose Description
The precompile accepts 64 bytes of input and returns 32 bytes...

### Executable Implementation

\`\`\`python
# ethereum/cancun/precompiles/widget.py

WIDGET_ADDRESS = Address(0x0B)
WIDGET_GAS_COST = 3000

def widget_precompile(input_data: bytes) -> bytes:
    """
    EIP-XXXX: Widget precompile implementation.
    
    Input: 64 bytes (two 32-byte values)
    Output: 32 bytes (widget operation result)
    """
    if len(input_data) != 64:
        raise PrecompileError("Invalid input length")
    
    a = int.from_bytes(input_data[:32], 'big')
    b = int.from_bytes(input_data[32:], 'big')
    
    result = widget_operation(a, b)
    
    return result.to_bytes(32, 'big')
\`\`\`

### Test Vectors

| Input | Expected Output | Gas |
|-------|-----------------|-----|
| 0x00...01 + 0x00...02 | 0x00...03 | 3000 |
| 0xff...ff + 0x00...01 | 0x00...00 | 3000 |

### Generated Fixtures

See: tests/fixtures/eip_xxxx_widget.json
```

## EIP Lifecycle with Executable Specs

```
Draft → Review → Last Call → Final
  │        │         │         │
  │        │         │         └── Merged to main spec
  │        │         └── Final fixture generation
  │        └── Executable impl reviewed
  └── Author provides executable impl
```

## Benefits of Executable EIPs

| Aspect | Prose-Only EIP | Executable EIP |
|--------|----------------|----------------|
| Ambiguity | Possible | Eliminated |
| Test vectors | Manual | Generated |
| Review quality | Conceptual | Verifiable |
| Implementation time | Longer | Shorter |
| Client agreement | Requires interpretation | Automatic |

## Best Practices

- Require executable implementation for all behavior changes
- Generate test fixtures from EIP implementation
- Run implementation against existing test suite (no regressions)
- Include gas benchmarks for new operations
- Provide migration considerations for breaking changes
