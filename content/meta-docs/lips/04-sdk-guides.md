# SDK Guides

*Integration Layer — Language-specific bindings for specification-defined interfaces*

---

## Definition

SDK (Software Development Kit) guides document the libraries, tools, and bindings that allow developers to integrate with a system using their preferred programming language. They wrap raw APIs and protocols in idiomatic, language-native abstractions.

## Relationship to the Specification

SDKs are a translation layer. They take specification-defined interfaces and make them accessible through language-specific idioms. The specification defines the contract; the SDK provides a convenient way to fulfill that contract.

| Specification Defines | SDK Provides |
|----------------------|-------------|
| Message format (protobuf/JSON schema) | Native objects with serialization |
| Authentication protocol | Credential management, token refresh |
| Error codes and semantics | Typed exceptions, error handling patterns |
| Retry requirements | Built-in retry logic with backoff |
| Connection lifecycle | Connection pooling, automatic reconnection |

## Core Components

- **Installation**: How to add the SDK to a project
- **Configuration**: Setting up credentials, endpoints, options
- **Core Concepts**: Mapping specification concepts to SDK abstractions
- **Method Reference**: Available functions and their parameters
- **Error Handling**: How spec-defined errors surface in the language
- **Examples**: Idiomatic code samples for common use cases
- **Migration Guides**: Moving between SDK versions as specs evolve

## Dependency Chain

```
Specification
    ↓
API Documentation ← raw interface definitions
    ↓
SDK Guides ← language-idiomatic wrappers
    ↓
Tutorials ← task-oriented learning using SDKs
    ↓
Developer Guides ← pattern guidance for SDK usage
```

## Why Spec-Grounding Matters

SDKs that aren't grounded in specifications create false abstractions:

- **Leaky abstractions**: SDK hides spec details until edge cases expose them unexpectedly
- **Inconsistent behavior across languages**: Each SDK interprets the protocol differently
- **Version mismatch**: SDK version doesn't clearly map to specification version
- **Undocumented constraints**: Limits and requirements from spec aren't surfaced to developers

## Specification Mapping Example

Consider a specification requirement:

> **SPEC-5.3.2**: Connections must send a heartbeat every 30 seconds. Failure to receive a heartbeat response within 10 seconds shall trigger reconnection.

The SDK guide should explain how this manifests:

```markdown
## Connection Keepalive

The SDK automatically manages heartbeats per SPEC-5.3.2. By default:
- Heartbeats are sent every 30 seconds
- Reconnection triggers after 10 seconds without response

You can monitor connection health via the `onConnectionStateChange` callback:

    client.onConnectionStateChange((state) => {
        if (state === 'reconnecting') {
            // Heartbeat timeout triggered reconnection
        }
    });

To disable automatic heartbeats (advanced usage, requires manual compliance 
with SPEC-5.3.2):

    const client = new Client({ autoHeartbeat: false });
```

## Best Practices

- Clearly map SDK versions to specification versions they implement
- Document which spec requirements are handled automatically vs. requiring developer action
- Surface specification constraints through types (e.g., message size limits as type constraints)
- Provide escape hatches to raw protocol access when SDK abstractions are insufficient
- Include changelogs that reference specification changes driving SDK updates
