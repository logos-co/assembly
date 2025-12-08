# Data Schemas

*Integration Layer — Formal definitions of data structures*

---

## Definition

Data schemas are formal, machine-readable definitions of data structures used throughout a system. They specify the shape, types, constraints, and relationships of data objects—enabling validation, code generation, and interoperability.

## Relationship to the Specification

The specification defines *what* data a system processes and *what* constraints that data must satisfy. Data schemas encode those definitions in a format that tools and implementations can consume directly.

| Specification Defines | Schema Provides |
|----------------------|-----------------|
| "User ID shall be a 128-bit UUID" | `userId: { type: "string", format: "uuid" }` |
| "Message content limited to 4096 bytes" | `content: { type: "string", maxLength: 4096 }` |
| "Timestamp in Unix milliseconds" | `timestamp: { type: "integer", minimum: 0 }` |
| "Status must be one of: pending, active, closed" | `status: { enum: ["pending", "active", "closed"] }` |

## Core Schema Formats

- **JSON Schema**: For JSON data validation and documentation
- **Protocol Buffers**: For efficient binary serialization
- **OpenAPI/AsyncAPI**: For API request/response definitions
- **GraphQL SDL**: For GraphQL type systems
- **Avro/Thrift**: For cross-language data serialization
- **SQL DDL**: For relational database structures

## Dependency Chain

```
Specification
    ↓
Data Schemas ← formal encoding of data requirements
    ↓
API Documentation ← uses schemas for request/response
    ↓
Protocol Docs ← references schemas for message payloads
    ↓
Code & Comments ← generates types from schemas
    ↓
Test Suites ← validates data against schemas
```

## Why Spec-Grounding Matters

Schemas that drift from specifications cause systemic problems:

- **Validation gaps**: Constraints in the spec aren't enforced because they're missing from schemas
- **Incompatible implementations**: Different services interpret data differently
- **Silent failures**: Data passes validation but violates specification intent
- **Documentation mismatch**: Human-readable docs describe different structures than schemas define

## Specification-Grounded Schema Example

Consider a specification excerpt:

> **SPEC-3.2.1**: A Message object shall contain:
> - `id`: A unique identifier (UUIDv4, required)
> - `sender`: The author's public key (32 bytes, required)
> - `content`: The message body (string, max 4096 characters, required)
> - `timestamp`: Creation time (Unix milliseconds, required)
> - `signature`: Ed25519 signature over id||content||timestamp (64 bytes, required)

The corresponding JSON Schema:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/message.json",
  "title": "Message",
  "description": "Implements SPEC-3.2.1 (Message Object)",
  "type": "object",
  "required": ["id", "sender", "content", "timestamp", "signature"],
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid",
      "description": "SPEC-3.2.1: Unique identifier (UUIDv4)"
    },
    "sender": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{64}$",
      "description": "SPEC-3.2.1: Author's public key (32 bytes, hex-encoded)"
    },
    "content": {
      "type": "string",
      "maxLength": 4096,
      "description": "SPEC-3.2.1: Message body (max 4096 characters)"
    },
    "timestamp": {
      "type": "integer",
      "minimum": 0,
      "description": "SPEC-3.2.1: Creation time (Unix milliseconds)"
    },
    "signature": {
      "type": "string",
      "pattern": "^[a-fA-F0-9]{128}$",
      "description": "SPEC-3.2.1: Ed25519 signature (64 bytes, hex-encoded)"
    }
  },
  "additionalProperties": false
}
```

## Schema Evolution

When specifications change, schemas must evolve. Good practices:

- Version schemas explicitly (semantic versioning preferred)
- Document breaking vs. non-breaking changes
- Provide migration guides when schemas change
- Maintain backwards compatibility where spec allows
- Include specification version in schema metadata

## Best Practices

- Generate schemas from specification definitions where possible
- Include specification references in schema descriptions
- Use schema validation in CI/CD pipelines
- Generate code (types, classes) from schemas to ensure consistency
- Test schemas against specification-derived test vectors
- Publish schemas alongside API documentation
