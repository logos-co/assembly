# SDK Guides

*Consumer Layer — Language-specific bindings for spec-defined interfaces*

---

## Definition

SDK guides document libraries that provide language-idiomatic access to spec-defined interfaces. They translate protocol-level specifications into convenient programming abstractions.

## Role in the Framework

```
Executable Specification ← defines interface behavior
API Documentation ← documents raw interfaces
    ↓
SDK Guides ← language-specific wrappers
    ↓
Developer Guides ← patterns using SDKs
Tutorials ← learning with SDKs
```

## Relationship to Specifications

SDKs wrap spec-defined behavior in language-native patterns:

```python
# Specification defines behavior
@rpc_method("eth_getBalance")
def get_balance(address: Address, block: BlockParam) -> int:
    """Returns balance in wei"""
    pass
```

SDK provides idiomatic access:

```typescript
// TypeScript SDK
class Provider {
  /**
   * Get account balance.
   * 
   * Implements: SPEC-API-3.2.1 (eth_getBalance)
   * 
   * @param address - Account address
   * @param block - Block identifier (default: "latest")
   * @returns Balance in wei as BigInt
   */
  async getBalance(address: string, block: BlockTag = "latest"): Promise<bigint> {
    const result = await this.rpc("eth_getBalance", [address, block]);
    return BigInt(result);
  }
}
```

## SDK Documentation Structure

```markdown
## Getting Started

Install the SDK:
\`\`\`bash
npm install @org/protocol-sdk
\`\`\`

## Core Concepts

The SDK implements the Protocol Specification v2.3.
Key abstractions map to specification sections:

| SDK Class | Specification Section |
|-----------|----------------------|
| Provider | SPEC-API-2.x |
| Signer | SPEC-CRYPTO-3.x |
| Transaction | SPEC-TX-4.x |

## Specification Compliance

This SDK version implements Protocol Specification v2.3.
All methods produce results identical to the executable 
specification for corresponding inputs.
```

## Best Practices

- Map SDK versions to specification versions
- Document which spec requirements SDK handles automatically
- Provide escape hatches to raw protocol access
- Include spec references in method documentation
- Note client-agnostic behavior (works with all conformant clients)
