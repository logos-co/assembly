# Conformance Tests

*Validation Layer — Executable verification against spec-generated fixtures*

---

## Definition

Conformance tests verify that implementations produce identical results to the executable specification. They run spec-generated fixtures against clients to prove compliance.

## Role in the Framework

```
Executable Specification
    ↓
Test Fixtures (generated)
    ↓
Conformance Tests ← run fixtures against clients
    ↓
├── Client A: PASS/FAIL
├── Client B: PASS/FAIL
└── Client C: PASS/FAIL
```

## The Conformance Loop

```python
def run_conformance_test(client: Client, fixture: Fixture) -> TestResult:
    """
    Verify client produces spec-defined results.
    """
    # Load pre-state into client
    client.load_state(fixture.pre_state)
    
    # Execute operation
    result = client.execute(fixture.input)
    
    # Compare against spec-defined expected output
    if result.state_root != fixture.expected.state_root:
        return TestResult.FAIL(
            message=f"State root mismatch",
            expected=fixture.expected.state_root,
            actual=result.state_root,
            spec_reference=fixture.spec_reference
        )
    
    return TestResult.PASS()
```

## Running Conformance Tests

```bash
# Run all Cancun fixtures against Geth
$ execution-spec-tests --client geth --fork cancun

State Transition Tests:
  ✓ test_simple_transfer (SPEC-TX-4.1.1)
  ✓ test_contract_creation (SPEC-TX-4.2.1)
  ✗ test_blob_transaction (SPEC-BLOB-5.1.3)
    Expected: 0xabc...
    Actual:   0xdef...
    
VM Tests:
  ✓ 8,234 / 8,234 passed

SUMMARY: 15,233 passed, 1 failed
```

## Failure Analysis

When conformance fails:

```markdown
## Conformance Failure Report

**Test**: test_blob_transaction
**Specification**: SPEC-BLOB-5.1.3
**Client**: Geth v1.13.0

### Expected (from executable spec)
State root: 0xabc123...
Gas used: 125000

### Actual (from client)
State root: 0xdef456...
Gas used: 124000

### Analysis
Client under-charges gas for blob commitment verification.
Reference: executable-spec/ethereum/cancun/blob.py:142

### Resolution
Client bug. Fix required before Cancun activation.
```

## Best Practices

- Run conformance tests in CI for every client change
- Test all clients against same fixtures
- Report failures with spec references
- Track conformance over time
- Block releases on conformance failures
