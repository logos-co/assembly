# Specification

*The foundational reference for all downstream technical work*

---

## Definition

A specification is a formal document that defines the requirements, constraints, interfaces, and expected behaviors of a system, protocol, or component. It serves as the authoritative source of truth from which all other technical documentation and implementation work derives.

Unlike implementation-focused documentation, a specification describes *what* a system must do and the boundaries within which it must operate—rather than *how* it currently does something. This distinction is critical: implementations can change, but the specification defines the contract.

## Core Components

A well-formed specification typically includes:

- **Requirements**: Mandatory behaviors and capabilities the system must exhibit
- **Constraints**: Boundaries, limitations, and invariants that must be preserved
- **Interfaces**: The contracts between components, including data formats, protocols, and APIs
- **Behaviors**: Expected responses to inputs, state transitions, and edge cases
- **Definitions**: Precise terminology to eliminate ambiguity

## Why Specifications Matter

Without a specification, technical work becomes anchored to implementation details. This creates several problems:

1. **Documentation drift**: When docs describe "how things work" rather than "how things should work," they become stale the moment code changes
2. **Inconsistent implementations**: Multiple teams implementing the same system may make incompatible choices
3. **Untestable claims**: Without defined requirements, there's no objective basis for determining correctness
4. **Knowledge silos**: Understanding lives in people's heads rather than in shared artifacts

## Relationship to Downstream Work

Every document type in the technical documentation ecosystem traces its authority back to the specification:

- **Implementation docs** translate spec requirements into working systems
- **Integration docs** explain how to connect with spec-defined interfaces
- **Consumer docs** teach users to work within spec-defined behaviors
- **Validation docs** verify that implementations match spec requirements
- **Community docs** propose changes to the spec or track its evolution

The specification doesn't contain all knowledge—but it contains the *canonical* knowledge from which everything else flows.

## Characteristics of Good Specifications

- **Precise**: Uses unambiguous language; defines terms explicitly
- **Complete**: Covers all required behaviors; acknowledges areas left unspecified
- **Testable**: Every requirement can be verified through observation
- **Stable**: Changes infrequently and through deliberate process
- **Versioned**: Tracks evolution over time with clear compatibility semantics
