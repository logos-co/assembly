# Protocol Documentation

*Integration Layer — Wire formats and communication contracts*

---

## Definition

Protocol documentation describes the exact formats and sequences for communication between system components. In executable specification systems, wire formats are derived directly from spec-defined types and encoding rules.

## Role in the Framework

```
Executable Specification ← defines types and encoding
    ↓
Protocol Documentation ← documents wire formats
    ↓
Data Schemas ← formal type definitions
    ↓
Client Implementations ← encode/decode per protocol
```

## Derived from Executable Specification

Wire formats come directly from spec type definitions:

```python
# Executable specification defines the type
@dataclass
class BlockHeader:
    """Block header structure per SPEC-BLOCK-2.1"""
    parent_hash: Hash      # 32 bytes
    uncle_hash: Hash       # 32 bytes  
    coinbase: Address      # 20 bytes
    state_root: Hash       # 32 bytes
    tx_root: Hash          # 32 bytes
    receipt_root: Hash     # 32 bytes
    bloom: Bytes256        # 256 bytes
    difficulty: Uint256    # variable (RLP)
    number: Uint64         # variable (RLP)
    gas_limit: Uint64      # variable (RLP)
    gas_used: Uint64       # variable (RLP)
    timestamp: Uint64      # variable (RLP)
    extra_data: Bytes      # max 32 bytes
    mix_hash: Hash         # 32 bytes
    nonce: Bytes8          # 8 bytes

# Encoding is also specified
def encode_block_header(header: BlockHeader) -> bytes:
    """RLP encode block header per SPEC-ENCODE-3.1"""
    return rlp.encode([
        header.parent_hash,
        header.uncle_hash,
        # ... all fields in specified order
    ])
```

Protocol documentation extracts this:

```markdown
## Block Header Wire Format

**Specification Reference**: SPEC-BLOCK-2.1, SPEC-ENCODE-3.1

### Structure

| Field | Type | Size | Description |
|-------|------|------|-------------|
| parentHash | Hash | 32 | Parent block hash |
| uncleHash | Hash | 32 | Uncle blocks hash |
| coinbase | Address | 20 | Beneficiary address |
| stateRoot | Hash | 32 | State trie root |
| ... | ... | ... | ... |

### Encoding

RLP encoding in field order. See SPEC-ENCODE-3.1.

### Example (annotated hex)

\`\`\`
f90218                          # RLP list prefix
a0...                           # parentHash (32 bytes)
a0...                           # uncleHash (32 bytes)
94...                           # coinbase (20 bytes)
...
\`\`\`
```

## Encoding Specifications

Blockchain protocols use specific encodings:

| Layer | Encoding | Specification |
|-------|----------|---------------|
| Execution | RLP | SPEC-ENCODE-3.x |
| Consensus | SSZ | SPEC-SSZ-4.x |
| API | JSON | SPEC-API-2.x |
| Blobs | KZG | SPEC-BLOB-5.x |

Each encoding is fully specified in executable form.

## Best Practices

- Generate wire format docs from spec type definitions
- Include byte-level annotated examples
- Provide test vectors for encoding/decoding
- Document versioning and backwards compatibility
- Cross-reference related protocol messages
