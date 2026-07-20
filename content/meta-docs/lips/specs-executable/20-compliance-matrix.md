# Compliance Matrix

*Validation Layer — Systematic mapping of requirements to verification*

---

## Definition

A compliance matrix systematically maps every specification requirement to its verification status. It provides a comprehensive view of which requirements are tested, passing, and compliant.

## Role in the Framework

```
Specification Requirements (FURPS+)
    ↓
Test Fixtures ← generated for each requirement
    ↓
Conformance Tests ← execute fixtures
    ↓
Compliance Matrix ← aggregates results
```

## Matrix Structure

```markdown
# Compliance Matrix: Protocol Spec v2.3

## Summary

| Category | Requirements | Tested | Passing | Coverage |
|----------|-------------|--------|---------|----------|
| Functionality | 145 | 145 | 143 | 100% |
| Usability | 23 | 20 | 20 | 87% |
| Reliability | 67 | 67 | 67 | 100% |
| Performance | 31 | 28 | 26 | 90% |
| Supportability | 18 | 18 | 18 | 100% |
| Constraints | 42 | 42 | 41 | 100% |
| **Total** | **326** | **320** | **315** | **98%** |

## Detailed Matrix

### FUNC: Functionality Requirements

| Req ID | Description | Test | Status | Notes |
|--------|-------------|------|--------|-------|
| FUNC-1.1.1 | Basic value transfer | test_value_transfer | ✓ PASS | |
| FUNC-1.1.2 | Contract creation | test_contract_create | ✓ PASS | |
| FUNC-1.2.1 | EIP-1559 fees | test_eip1559_fees | ✓ PASS | |
| FUNC-1.2.2 | Blob transactions | test_blob_tx | ✗ FAIL | Geth gas calc |
| FUNC-1.2.3 | Access lists | test_access_list | ✓ PASS | |

### REL: Reliability Requirements

| Req ID | Description | Test | Status | Notes |
|--------|-------------|------|--------|-------|
| REL-1.1.1 | Byzantine tolerance | test_bft_safety | ✓ PASS | |
| REL-1.1.2 | Partition recovery | test_partition | ✓ PASS | |
```

## Client-Specific Matrices

Track compliance per client:

```markdown
## Client Compliance: Cancun Fork

| Requirement | Geth | Nethermind | Besu | Reth |
|-------------|------|------------|------|------|
| FUNC-1.1.1 | ✓ | ✓ | ✓ | ✓ |
| FUNC-1.2.2 | ✗ | ✓ | ✓ | ✓ |
| FUNC-1.2.3 | ✓ | ✓ | ✓ | ✓ |
| ... | ... | ... | ... | ... |
```

## Best Practices

- Generate matrix automatically from test results
- Update on every test run
- Highlight regressions prominently  
- Track coverage gaps (untested requirements)
- Version matrix with specification
