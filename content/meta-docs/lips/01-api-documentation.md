# API Documentation

*Implementation Layer — Translating specification interfaces into callable contracts*

---

## Definition

API documentation describes the programmatic interfaces through which software components interact. It provides developers with the information needed to make requests, handle responses, and integrate with a system.

## Relationship to the Specification

API documentation is a direct derivative of the specification's interface definitions. The specification defines *what* the interface contract is; API documentation explains *how* to invoke it.

| Specification Says | API Documentation Provides |
|-------------------|---------------------------|
| "The system shall accept authentication tokens" | Endpoint paths, header formats, token schemas |
| "Queries must support pagination" | Parameter names, default values, response structures |
| "Errors shall include diagnostic codes" | Error code enumerations, troubleshooting guidance |

When API documentation diverges from the specification, one of two things has happened:
1. The implementation has drifted from the spec (a bug)
2. The spec is out of date (a documentation debt)

## Core Components

- **Endpoints/Methods**: The callable entry points and their paths
- **Parameters**: Required and optional inputs, their types, and constraints
- **Request/Response Schemas**: Data structures for input and output
- **Authentication**: How callers establish identity and permissions
- **Error Handling**: Failure modes, error codes, and recovery guidance
- **Examples**: Concrete invocations demonstrating typical usage

## Dependency Chain

```
Specification
    ↓
API Documentation ← derives interface contracts
    ↓
SDK Guides ← wraps API calls in language bindings
    ↓
Developer Guides ← teaches patterns using APIs
```

## Why Spec-Grounding Matters

Without specification grounding, API documentation becomes descriptive rather than prescriptive. It tells you what the API *does* today, not what it *should* do. This creates problems:

- **Breaking changes go unnoticed**: If the spec says "pagination is required" but the docs just describe current behavior, removing pagination might seem like a valid choice
- **Ambiguity in edge cases**: When docs describe only happy paths, undefined behavior becomes implementation-dependent
- **Testing gaps**: QA can only verify documented behaviors; spec-grounded docs ensure coverage of requirements

## Best Practices

- Reference specification section numbers when documenting behaviors derived from requirements
- Flag any documented behavior that extends beyond the specification as "implementation-specific"
- Version API documentation in lockstep with specification versions
- Include machine-readable schemas (OpenAPI, AsyncAPI, etc.) that can be validated against spec definitions
