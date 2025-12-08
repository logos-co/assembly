# Contribution Guidelines

*Community Layer — How to participate in specification-governed development*

---

## Definition

Contribution guidelines document how external contributors can participate in a project—submitting code, documentation, bug reports, and proposals. In a specification-grounded ecosystem, these guidelines ensure contributions maintain compliance with specification requirements.

## Relationship to the Specification

The specification defines what the system must do. Contribution guidelines ensure that changes to the system maintain specification compliance and that proposals for new behavior follow appropriate channels.

| Specification Context | Contribution Guideline |
|----------------------|------------------------|
| Required behaviors | "All code must pass specification compliance tests" |
| Interface contracts | "API changes require specification review" |
| Protocol requirements | "Protocol modifications require RFC process" |
| Security requirements | "Security-sensitive changes require audit" |

## Core Components

- **Getting Started**: How to set up a development environment
- **Coding Standards**: Style, formatting, and quality requirements
- **Testing Requirements**: What tests contributions must include
- **Compliance Verification**: How to verify spec compliance before submitting
- **Review Process**: How contributions are evaluated and merged
- **RFC Process**: How to propose specification changes
- **Communication Channels**: Where to discuss contributions

## Dependency Chain

```
Specification
    ↓
Code & Comments ← implementation to contribute to
Test Suites ← tests contributions must pass
Changelogs ← track accepted contributions
    ↓
Contribution Guidelines ← how to participate correctly
    ↓
RFCs & Proposals ← channel for suggesting spec changes
```

## Why Spec-Grounding Matters

Contribution guidelines without specification grounding produce inconsistent results:

- **Compliance regressions**: Contributions break spec compliance without anyone noticing
- **Scope confusion**: Contributors don't know if changes require spec modifications
- **Review overhead**: Maintainers repeatedly explain the same compliance requirements
- **Rejected contributions**: Well-intentioned changes that violate spec get rejected late in process

## Specification-Grounded Contribution Requirements

### Code Contributions

```markdown
## Before Submitting Code

1. **Verify Specification Compliance**
   
   All code must pass the specification compliance suite:
   
       make spec-compliance
   
   This verifies your changes against all SPEC requirements.

2. **Add Specification References**
   
   For code implementing specification requirements, include references:
   
       // Implements SPEC-4.2.3 (Delivery Timeout)
       func (c *Client) sendWithTimeout(msg Message) error {
           ...
       }

3. **Update Tests**
   
   New behaviors must have tests with specification references:
   
       def test_delivery_timeout():
           """Verifies SPEC-4.2.3: 500ms delivery SLA"""
           ...

4. **Check for Specification Scope**
   
   If your change requires behavior not covered by the specification:
   - STOP: This may require an RFC first
   - Open an issue to discuss before proceeding
   - See "Proposing Specification Changes" below
```

### Documentation Contributions

```markdown
## Documentation Requirements

Documentation must maintain specification traceability:

- **API documentation**: Reference specification sections for behaviors
- **Tutorials**: Teach within specification-defined constraints  
- **Guides**: Distinguish spec requirements from recommendations
- **Reference**: Include spec references for all behaviors

When updating documentation:

1. Check that changes align with current specification
2. Update specification references if they've changed
3. Flag any documented behavior that extends beyond spec
```

## Contribution Review Criteria

Pull requests are evaluated against specification compliance:

```markdown
## Review Checklist

Maintainers verify before merging:

- [ ] All specification compliance tests pass
- [ ] New code includes appropriate SPEC references
- [ ] Changes don't violate existing SPEC requirements
- [ ] If behavior extends beyond SPEC: is this intentional? documented?
- [ ] Tests added for new SPEC-related behaviors
- [ ] Documentation updated with SPEC references
- [ ] CHANGELOG entry includes SPEC references if applicable
```

## Proposing Specification Changes

When contributions require specification modifications:

```markdown
## When to Propose Specification Changes

Your contribution may require an RFC if:

- It adds behavior not covered by current specification
- It changes behavior defined in the specification
- It removes or deprecates specification-required features
- It affects interoperability with other implementations

## RFC Process

1. Open an issue describing the proposed change
2. Discuss with maintainers to confirm RFC is needed
3. Draft RFC following template in `/rfcs/template.md`
4. Submit RFC for community review
5. Iterate based on feedback
6. Once approved, specification is updated
7. THEN implementation can proceed

Do not submit implementation PRs for changes that require specification
modifications until the RFC is accepted.
```

## Best Practices

- Include specification compliance in CI/CD pipelines
- Provide tools to help contributors verify compliance locally
- Document the boundary between "implementation detail" and "specification requirement"
- Make RFC process lightweight enough that contributors use it
- Mentor new contributors on specification-grounded development
- Thank contributors for maintaining specification compliance
