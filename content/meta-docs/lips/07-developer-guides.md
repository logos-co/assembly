# Developer Guides

*Consumer Layer — Task-oriented documentation for building with the system*

---

## Definition

Developer guides are task-oriented documents that teach developers how to accomplish specific goals using a system. Unlike reference documentation (which is comprehensive but not instructive), developer guides provide opinionated guidance, best practices, and worked examples.

## Relationship to the Specification

Developer guides synthesize information from multiple specification-derived sources—API documentation, architecture docs, protocol documentation—into practical guidance. They don't merely describe what's possible; they recommend what developers *should* do.

| Specification Context | Developer Guide Provides |
|----------------------|-------------------------|
| Multiple valid authentication methods | "For most applications, use OAuth2. Here's why and how." |
| Configurable retry behavior | "We recommend exponential backoff with jitter. Here's the pattern." |
| Flexible message formats | "Structure your messages like this for optimal performance." |
| Various error codes | "Here's how to handle the errors you'll encounter most often." |

## Core Components

- **Getting Started**: Quickest path from zero to working integration
- **Core Concepts**: Mental models for understanding the system
- **Common Tasks**: Step-by-step guides for frequent operations
- **Best Practices**: Recommendations based on experience and specification intent
- **Troubleshooting**: Common problems and their solutions
- **Architecture Patterns**: How to structure applications using the system

## Dependency Chain

```
Specification
    ↓
API Documentation ← interface definitions
Architecture Docs ← system structure
Protocol Docs ← communication patterns
    ↓
Developer Guides ← synthesizes into practical guidance
    ↓
Tutorials ← hands-on learning experiences
```

## Why Spec-Grounding Matters

Developer guides that aren't grounded in specifications provide arbitrary opinions rather than informed recommendations:

- **Outdated advice**: Recommendations that made sense for old spec versions may be wrong now
- **Anti-patterns**: Guidance that works around specification-mandated behaviors
- **Missing context**: Developers don't understand *why* recommendations exist
- **False confidence**: Developers follow guides without understanding underlying constraints

## Specification-Grounded Guidance Example

Poor guidance (no spec grounding):
```markdown
## Sending Messages

To send a message, call `client.send(message)`. Make sure your 
messages aren't too big or they might fail.
```

Good guidance (spec-grounded):
```markdown
## Sending Messages

Messages are subject to size limits defined in SPEC-3.4.1:
- Maximum payload: 64KB
- Maximum metadata: 4KB

For messages approaching these limits, consider:

1. **Chunking**: Split large content across multiple messages using 
   the chunking protocol (see SPEC-3.4.5)
   
2. **Compression**: Apply gzip compression before sending 
   (automatically handled if content-type is set per SPEC-3.2.8)
   
3. **External storage**: For very large content, store externally 
   and send a reference

The 64KB limit exists to ensure reliable delivery across all network 
conditions, including constrained relay nodes (see Architecture Guide, 
"Network Topology").
```

## Distinguishing Opinions from Requirements

Developer guides should clearly distinguish between:

- **Specification requirements**: "You must include a signature (SPEC-5.1.2)"
- **Strong recommendations**: "We strongly recommend using TLS 1.3 for transport"
- **Suggestions**: "Consider batching requests to reduce overhead"
- **Options**: "You can choose between polling and webhooks based on your needs"

## Best Practices

- Reference specification sections when explaining constraints or requirements
- Explain *why* recommendations exist, not just *what* to do
- Update guides when specifications change
- Include "What Can Go Wrong" sections that map to specification error conditions
- Provide escape hatches for developers who need to deviate from recommendations
- Link to API documentation and reference manuals for complete details
