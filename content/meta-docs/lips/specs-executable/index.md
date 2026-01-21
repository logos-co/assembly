---
title: Documentation Dependency Framework
tags:
  - specs
---
## FURPS+ Requirements with Executable Specifications

*A comprehensive guide to specification-driven documentation for decentralized systems*

---

## Overview

This framework integrates two powerful approaches to technical specification:

1. **FURPS+** — A structured requirements classification ensuring comprehensive coverage
2. **Executable Specifications** — Code-as-specification enabling precise behavior definition and automated test generation

Together, they create a documentation ecosystem where specifications are simultaneously complete (covering all requirement domains), precise (expressed as runnable code), testable (generating verification fixtures), and traceable (linking requirements through to compliance evidence).

---

## Framework Structure

### Requirements Layer (FURPS+)

These categories ensure no requirement domain is overlooked:

| Document | Description |
|----------|-------------|
| [Functionality](01-functionality.md) | Core protocol operations, features, security mechanisms |
| [Usability](02-usability.md) | Developer experience, API ergonomics, error clarity |
| [Reliability](03-reliability.md) | Availability, recovery, safety guarantees, liveness |
| [Performance](04-performance.md) | Throughput, latency, gas costs, finality time |
| [Supportability](05-supportability.md) | Upgradability, monitoring, fork management |
| [Constraints (+)](06-constraints-plus.md) | Consensus, decentralization, interface requirements |

### Canonical Specification Layer

The dual-specification model that enables both human understanding and machine precision:

| Document | Description |
|----------|-------------|
| [Prose Specification](07-prose-specification.md) | Human-readable requirements with rationale and FURPS+ structure |
| [Executable Specification](08-executable-specification.md) | Code-as-spec defining exact behavior, generating tests |

### Generated Artifacts Layer

Artifacts produced directly from the executable specification:

| Document | Description |
|----------|-------------|
| [Test Fixtures](09-test-fixtures.md) | JSON test vectors generated from executable spec |
| [Reference Implementation](10-reference-implementation.md) | Canonical implementation derived from executable spec |

### Implementation Layer

Multiple independent implementations achieving consensus through shared specification:

| Document | Description |
|----------|-------------|
| [Client Implementations](11-client-implementations.md) | Independent clients deriving from executable spec |

### Integration Layer

Documents enabling system integration per specification:

| Document | Description |
|----------|-------------|
| [API Documentation](12-api-documentation.md) | Programmatic interfaces from spec-defined contracts |
| [Protocol Documentation](13-protocol-documentation.md) | Wire formats and communication contracts |
| [Data Schemas](14-data-schemas.md) | Formal structure definitions (SSZ, RLP, etc.) |

### Consumer Layer

Documents helping developers build on the system:

| Document | Description |
|----------|-------------|
| [SDK Guides](15-sdk-guides.md) | Language-specific bindings for spec-defined interfaces |
| [Developer Guides](16-developer-guides.md) | Task-oriented guidance for building applications |
| [Tutorials](17-tutorials.md) | Hands-on learning experiences |
| [Reference Manuals](18-reference-manuals.md) | Comprehensive lookup with spec traceability |

### Validation Layer

Documents verifying and evidencing specification compliance:

| Document | Description |
|----------|-------------|
| [Conformance Tests](19-conformance-tests.md) | Executable verification against spec-generated fixtures |
| [Compliance Matrix](20-compliance-matrix.md) | Systematic mapping of requirements to verification |
| [Audit Trails](21-audit-trails.md) | Evidence of compliance over time |

### Community Layer

Documents governing participation and evolution:

| Document | Description |
|----------|-------------|
| [EIPs and RFCs](22-eips-and-rfcs.md) | Proposals with executable spec implementations |
| [Contribution Guidelines](23-contribution-guidelines.md) | How to participate while maintaining compliance |
| [Changelogs](24-changelogs.md) | Fork history and specification evolution |

---

## The Dependency Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    FURPS+ REQUIREMENTS                       │
│  Functionality │ Usability │ Reliability │ Performance │ +  │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              CANONICAL SPECIFICATION LAYER                   │
│                                                              │
│   ┌─────────────────┐         ┌─────────────────┐           │
│   │  PROSE SPEC     │◄───────►│ EXECUTABLE SPEC │           │
│   │  Requirements   │         │  Python Code    │           │
│   │  Rationale      │         │  State Machines │           │
│   │  Constraints    │         │  Fork Snapshots │           │
│   └─────────────────┘         └────────┬────────┘           │
└────────────────────────────────────────┼────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
             ┌───────────┐        ┌───────────┐        ┌───────────┐
             │   Test    │        │ Reference │        │  Client   │
             │ Fixtures  │        │   Impl    │        │  Impls    │
             └─────┬─────┘        └───────────┘        └───────────┘
                   │                                         ▲
                   └──────────── validates ──────────────────┘
```

---

## Key Principles

1. **Dual Specification**: Prose for humans, executable for machines—kept in sync
2. **Generated Tests**: Test fixtures flow from executable spec, not written manually
3. **Multi-Client Consensus**: Multiple implementations validate against same fixtures
4. **FURPS+ Completeness**: Structured categories prevent requirement blindspots
5. **Blockchain Augmentation**: Safety, liveness, finality, consensus as first-class concerns
6. **Proposal = Implementation**: EIPs/RFCs require executable spec code, not just prose
