# Reference Manuals

*Consumer Layer — Comprehensive, authoritative technical reference*

---

## Definition

Reference manuals are comprehensive documents that provide complete, detailed information about a system. Unlike tutorials (which teach) or guides (which advise), reference manuals are designed to be *consulted*—developers look up specific information when they need it.

## Relationship to the Specification

Reference manuals are the most direct consumer-facing translation of the specification. They organize specification content for practical lookup while adding implementation details and usage examples.

| Specification Provides | Reference Manual Adds |
|-----------------------|----------------------|
| Abstract requirements | Concrete parameter values |
| Formal definitions | Usage examples |
| Normative language (SHALL, MUST) | Practical implications |
| Complete coverage | Organized navigation |

## Core Components

- **API Reference**: Every endpoint, method, parameter, and return value
- **Configuration Options**: All settings and their effects
- **Error Codes**: Complete enumeration with descriptions and resolutions
- **Data Types**: All structures, fields, and constraints
- **Constants and Enums**: All defined values
- **Glossary**: Precise definitions of terms
- **Index**: Multiple paths to find information

## Dependency Chain

```
Specification
    ↓
Protocol Docs ← communication details
Data Schemas ← data structure definitions
    ↓
Reference Manuals ← comprehensive lookup resource
    ↓
Developer Guides ← curated recommendations from reference content
Tutorials ← worked examples using reference information
```

## Why Spec-Grounding Matters

Reference manuals must be precise—they're consulted when developers need definitive answers. Ungrounded reference content causes:

- **Implementation errors**: Wrong parameters, missing validations
- **Integration failures**: Incompatible interpretations between systems
- **Debugging dead ends**: Actual behavior doesn't match documented behavior
- **Trust erosion**: Developers stop consulting unreliable references

## Structure of Specification-Grounded Reference Entries

Each reference entry should trace to specification:

```markdown
## client.sendMessage(message, options)

Sends a message to the specified recipient.

**Specification Reference**: SPEC-4.2.1 (Message Transmission)

### Parameters

| Parameter | Type | Required | Description | Spec |
|-----------|------|----------|-------------|------|
| message | `Message` | Yes | The message to send | SPEC-3.2.1 |
| options.timeout | `number` | No | Timeout in ms (default: 30000) | SPEC-4.2.3 |
| options.priority | `"normal" \| "high"` | No | Delivery priority | SPEC-4.2.4 |

### Returns

`Promise<MessageReceipt>` - Resolves when message is accepted by the network.

**Note**: Acceptance does not guarantee delivery. See SPEC-4.2.7 for 
delivery confirmation patterns.

### Errors

| Code | Specification | Description |
|------|--------------|-------------|
| `MESSAGE_TOO_LARGE` | SPEC-3.4.1 | Payload exceeds 64KB |
| `RECIPIENT_UNKNOWN` | SPEC-4.2.2 | Recipient not found in network |
| `RATE_LIMITED` | SPEC-4.5.1 | Exceeded 100 messages/minute |

### Example

    const receipt = await client.sendMessage({
        recipient: recipientId,
        content: "Hello, world!",
        contentType: "text/plain"
    });
    
    console.log(`Sent: ${receipt.messageId}`);
```

## Completeness Requirements

Reference manuals should cover:

- **Every public API surface**—no undocumented methods
- **Every error condition**—with specification-defined codes
- **Every configuration option**—with defaults and valid ranges
- **Every data type**—with all fields and constraints
- **Every constant**—with values and meanings

Gaps in reference coverage often indicate gaps in specification coverage.

## Best Practices

- Generate reference content from specification and code where possible
- Include specification section references for every behavior
- Keep reference content synchronized with specification versions
- Provide search functionality—developers need to find things quickly
- Include "See Also" links to related reference content
- Distinguish between stable API (per spec) and experimental features
- Use consistent formatting throughout for scannability
- Include both signature-level and behavioral documentation
