# API Documentation

*Integration Layer — Programmatic interfaces from specification-defined contracts*

---

## Definition

API documentation describes the programmatic interfaces through which software components interact with the system. In the executable specification model, APIs are derived from spec-defined interfaces, ensuring documentation matches actual behavior.

## Role in the Framework

```
Prose Specification ← defines interface requirements
Executable Specification ← implements exact interface behavior
    ↓
API Documentation ← documents how to invoke interfaces
    ↓
SDK Guides ← wraps APIs in language bindings
```

## Relationship to Specifications

### Derived from Executable Spec

API documentation is extracted from the executable specification's interface definitions:

```python
# Executable specification defines the interface
@rpc_method("eth_sendTransaction")
def send_transaction(tx: TransactionRequest) -> Hash:
    """
    Submit a transaction to the network.
    
    Args:
        tx: Transaction parameters
        
    Returns:
        Transaction hash
        
    Raises:
        InvalidTransaction: If transaction validation fails
        InsufficientFunds: If sender lacks balance
    """
    validated = validate_transaction_request(tx)
    return submit_to_pool(validated)
```

API documentation extracts this into user-facing format:

```markdown
## eth_sendTransaction

Submit a transaction to the network.

### Parameters

| Name | Type | Required | Description |
|------|------|----------|-------------|
| tx | TransactionRequest | Yes | Transaction parameters |

### Returns

`Hash` - The transaction hash (32 bytes)

### Errors

| Code | Message | Description |
|------|---------|-------------|
| -32000 | Invalid transaction | Transaction validation failed |
| -32001 | Insufficient funds | Sender balance too low |

### Example

Request:
\`\`\`json
{
  "jsonrpc": "2.0",
  "method": "eth_sendTransaction",
  "params": [{
    "from": "0x...",
    "to": "0x...",
    "value": "0x1000"
  }],
  "id": 1
}
\`\`\`
```

### Cross-Client Consistency

API documentation must apply to ALL client implementations:

```markdown
## API Conformance Note

This API is defined by the JSON-RPC specification (SPEC-API-2.1).
All conformant clients (Geth, Nethermind, Besu, Reth, Erigon) 
implement identical behavior for these methods.

Client-specific extensions are documented separately and clearly
marked as non-standard.
```

## Specification Traceability

Each API method traces to specification:

```markdown
## eth_getBalance

Get the balance of an address.

**Specification Reference**: SPEC-API-3.2.1

### Behavior per Specification

- SPEC-API-3.2.1.1: Returns balance in wei as hex string
- SPEC-API-3.2.1.2: Block parameter determines state snapshot
- SPEC-API-3.2.1.3: Non-existent accounts return "0x0"
```

## Best Practices

- Generate API documentation from executable spec type definitions
- Include specification references for all behaviors
- Document error codes with spec-defined meanings
- Provide working examples for every method
- Distinguish standard API from client-specific extensions
- Version API documentation with specification version
