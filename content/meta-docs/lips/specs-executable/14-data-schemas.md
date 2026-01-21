# Data Schemas

*Integration Layer — Formal structure definitions (SSZ, RLP, etc.)*

---

## Definition

Data schemas are formal, machine-readable definitions of data structures. In executable specification systems, schemas are generated from spec type definitions, ensuring perfect alignment between specification and validation.

## Role in the Framework

```
Executable Specification ← defines types with Python dataclasses
    ↓
Data Schemas ← exported as JSON Schema, SSZ, Protobuf
    ↓
Protocol Documentation ← references schemas
API Documentation ← uses schemas for request/response
Client Implementations ← validates against schemas
```

## Generated from Executable Specification

Schemas are derived directly from spec types:

```python
# Executable specification type
@dataclass
class Withdrawal:
    """Withdrawal from beacon chain per SPEC-WITHDRAWAL-1.1"""
    index: uint64
    validator_index: uint64
    address: Address  # 20 bytes
    amount: uint64    # in Gwei
```

Generated JSON Schema:
```json
{
  "$id": "withdrawal.json",
  "title": "Withdrawal",
  "description": "SPEC-WITHDRAWAL-1.1",
  "type": "object",
  "required": ["index", "validator_index", "address", "amount"],
  "properties": {
    "index": {"type": "string", "pattern": "^0x[0-9a-f]+$"},
    "validator_index": {"type": "string", "pattern": "^0x[0-9a-f]+$"},
    "address": {"type": "string", "pattern": "^0x[0-9a-f]{40}$"},
    "amount": {"type": "string", "pattern": "^0x[0-9a-f]+$"}
  }
}
```

## Blockchain Serialization Formats

### RLP (Recursive Length Prefix)
Used by execution layer:
```python
# Spec defines RLP encoding
def rlp_encode_withdrawal(w: Withdrawal) -> bytes:
    return rlp.encode([w.index, w.validator_index, w.address, w.amount])
```

### SSZ (Simple Serialize)
Used by consensus layer:
```python
# Spec defines SSZ schema
class WithdrawalSSZ(Container):
    index: uint64
    validator_index: uint64  
    address: Bytes20
    amount: uint64
```

## Best Practices

- Generate schemas from executable specification types
- Include specification references in schema metadata
- Provide validation tools using schemas
- Version schemas with specification version
- Support multiple export formats (JSON Schema, SSZ, Protobuf)
