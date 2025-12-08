# Changelogs

*Community Layer — Documenting the evolution of specification and implementation*

---

## Definition

Changelogs are chronological records of changes to a project. In a specification-grounded ecosystem, changelogs document both specification evolution and implementation changes—maintaining clear links between the two.

## Relationship to the Specification

Changelogs track how the specification has changed over time and how implementations have evolved to match. They create historical context that explains *why* things are the way they are.

| Change Type | Changelog Documents |
|-------------|---------------------|
| Specification update | Which requirements changed, why, and when |
| Implementation change | How code was updated to match spec changes |
| Bug fix | Whether fix restored spec compliance |
| New feature | Which spec requirements it implements |

## Changelog Types

### Specification Changelog
Tracks changes to the specification itself:

```markdown
# Specification Changelog

## v2.2.0 (2024-03-01)

### Added
- SPEC-3.6: Streaming Messages (RFC-0042)
- SPEC-4.3: Stream Delivery Semantics (RFC-0042)

### Changed
- SPEC-3.4.1: Clarified that 64KB limit applies to standard messages only
- SPEC-5.1.3: Updated signature algorithm recommendations

### Deprecated
- SPEC-5.1.2a: SHA-1 based signatures (removed in v3.0)

### Fixed
- SPEC-4.2.3: Corrected timeout value from 50ms to 500ms (errata)

## v2.1.3 (2024-01-15)

### Fixed
- SPEC-3.2.1: Clarified byte order for multi-byte fields (ambiguity)
```

### Implementation Changelog
Tracks changes to implementation, referencing spec compliance:

```markdown
# Implementation Changelog

## v4.2.0 (2024-03-15)

### Added
- Streaming message support per SPEC-3.6 (spec v2.2.0)
- New `client.createStream()` API

### Changed
- Message validation updated for SPEC-3.4.1 clarification

### Fixed
- #4521: Message size validation off-by-one error
  - Restored compliance with SPEC-3.4.1
  - Regression introduced in v4.1.0

### Compliance
- Now compliant with specification v2.2.0
- Full compliance test results: audit_v4.2.0.log

## v4.1.2 (2024-02-01)

### Fixed
- #4498: Timeout handling now matches SPEC-4.2.3 (500ms, not 50ms)
  - Caused by spec errata in v2.1.3
```

## Dependency Chain

```
RFCs & Proposals ← propose changes
    ↓
Specification ← updated per accepted RFCs
    ↓
Changelogs ← document spec changes
    ↓
Implementation ← code updated
    ↓
Changelogs ← document implementation changes with spec references
    ↓
Contribution Guidelines ← reference changelog practices
```

## Why Spec-Grounding Matters

Changelogs without specification grounding lose critical context:

- **Why did this change?** Without spec references, rationale is lost
- **Is this a breaking change?** Unclear without knowing which spec requirements changed
- **When was compliance achieved?** No record of spec compliance milestones
- **What version do I need?** Can't determine which implementation version matches which spec

## Changelog Entry Structure

Effective entries link changes to specifications:

```markdown
### Fixed
- **Signature verification timeout** (#4532)
  - Issue: Signatures validated after 60-second timeout expired
  - Root cause: Timeout timer started before signature computation
  - Fix: Timer now starts after computation completes
  - Spec reference: SPEC-5.1.4 (Signature Verification Timing)
  - Regression: None (new compliance, previously unverified)
```

```markdown
### Changed
- **Default retry count increased from 3 to 5**
  - Motivation: RFC-0047 updated SPEC-4.4.2 retry requirements
  - Spec version: v2.2.0
  - Migration: Configuration unchanged if explicitly set
  - Breaking: No (default change only)
```

## Version Correlation

Maintain clear mapping between spec and implementation versions:

```markdown
# Version Compatibility Matrix

| Implementation | Specification | Notes |
|---------------|---------------|-------|
| v4.2.x | v2.2.0 | Current |
| v4.1.x | v2.1.3 | Maintenance |
| v4.0.x | v2.1.0 | End of life 2024-06-01 |
| v3.x | v2.0.x | Unsupported |
```

## Keep a Changelog Format

Following the [Keep a Changelog](https://keepachangelog.com/) convention:

- **Added**: New features (with spec references)
- **Changed**: Changes to existing functionality (with spec references)
- **Deprecated**: Features to be removed (with spec timeline)
- **Removed**: Removed features (with spec references)
- **Fixed**: Bug fixes (noting if spec compliance was restored)
- **Security**: Security-related changes (with spec security requirements)

## Best Practices

- Write changelog entries when making changes, not at release time
- Include specification references for all behavior changes
- Document whether changes affect specification compliance
- Link to RFCs, issues, and audit findings that motivated changes
- Note breaking changes prominently with migration guidance
- Maintain separate changelogs for spec and implementation
- Include version compatibility information
- Use consistent, parseable format for automation
