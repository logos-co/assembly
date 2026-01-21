# Contribution Guidelines

*Community Layer — How to participate while maintaining compliance*

---

## Definition

Contribution guidelines document how to participate in specification and implementation development while maintaining compliance with the specification framework.

## Role in the Framework

```
Specification (prose + executable)
Client Implementations
    ↓
Contribution Guidelines ← how to change these correctly
    ↓
├── Specification contributions
├── Implementation contributions
├── Test contributions
└── Documentation contributions
```

## Contributing to Executable Specifications

```markdown
## Specification Contributions

### Before You Start

1. Check if an EIP exists for your proposed change
2. Discuss in community channels first
3. Understand the dual-spec model (prose + executable)

### Making Changes

1. **Fork the executable-specs repository**

2. **Make changes in the correct fork directory**
   Changes go in the upcoming fork (e.g., `ethereum/prague/`)
   
3. **Update both prose and executable spec**
   - Prose: Update relevant .md files
   - Executable: Update Python implementation
   
4. **Regenerate test fixtures**
   \`\`\`bash
   make generate-fixtures
   \`\`\`
   
5. **Run specification tests**
   \`\`\`bash
   make test-spec
   \`\`\`

6. **Submit PR with**
   - Prose changes
   - Executable changes
   - New/updated fixtures
   - EIP reference (if applicable)

### Review Criteria

- [ ] Prose and executable match
- [ ] All existing tests pass
- [ ] New behavior has tests
- [ ] Follows FURPS+ categorization
- [ ] Includes spec references
```

## Contributing to Client Implementations

```markdown
## Client Contributions

### Conformance Requirement

All changes must maintain specification conformance:

\`\`\`bash
# Before submitting
make run-spec-tests
# Must pass 100%
\`\`\`

### Traceability

Reference specification in code:

\`\`\`go
// Per SPEC-GAS-4.2.3: Cold SLOAD costs 2100 gas
const ColdSloadGas = 2100
\`\`\`

### Non-Spec Extensions

Client-specific features must be:
- Clearly documented as non-standard
- Behind feature flags
- Not affecting spec-defined behavior
```

## Best Practices

- Run conformance tests before submitting
- Reference specification sections in changes
- Update documentation alongside code
- Coordinate spec changes across both specs
- Participate in interoperability testing
