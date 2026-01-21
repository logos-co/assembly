# Reference Implementation

*Generated Artifacts Layer — Canonical implementation derived from executable spec*

---

## Definition

A reference implementation is a canonical, authoritative implementation that demonstrates correct behavior. In the executable specification model, the executable spec itself *is* the reference implementation—not a separate artifact.

## Role in the Framework

The reference implementation provides a working example that other implementations can compare against. It resolves any remaining ambiguity by showing exactly how the specification behaves.

```
Executable Specification = Reference Implementation
    ↓
├── Test Fixture Generation
├── Behavior Verification
└── Client Comparison Baseline
```

## The Identity: Spec IS Implementation

In traditional development:
```
Prose Spec → Implementation → Tests verify implementation
```

In executable specification model:
```
Executable Spec = Reference Implementation → Tests generated from it
```

The executable specification serves dual roles:
1. **Specification**: The authoritative definition of correct behavior
2. **Reference Implementation**: A working implementation you can run

```python
# This code is BOTH specification AND reference implementation
def process_withdrawal(
    state: State, 
    withdrawal: Withdrawal
) -> State:
    """
    Process a withdrawal from the beacon chain.
    
    As specification: defines exactly what withdrawal processing means
    As implementation: actually executes and produces results
    """
    recipient = withdrawal.address
    amount = withdrawal.amount
    
    # Credit the withdrawal amount
    current_balance = get_balance(state, recipient)
    new_balance = current_balance + amount
    state = set_balance(state, recipient, new_balance)
    
    return state
```

## Characteristics

### Clarity Over Optimization

Reference implementations prioritize understanding:

```python
# Reference implementation (clear, specification-grade)
def compute_merkle_root(leaves: List[bytes]) -> bytes:
    """Compute Merkle root of leaves."""
    if len(leaves) == 0:
        return EMPTY_ROOT
    
    if len(leaves) == 1:
        return leaves[0]
    
    # Pad to power of 2
    while len(leaves) & (len(leaves) - 1):
        leaves.append(ZERO_HASH)
    
    # Build tree bottom-up
    while len(leaves) > 1:
        next_level = []
        for i in range(0, len(leaves), 2):
            combined = hash(leaves[i] + leaves[i+1])
            next_level.append(combined)
        leaves = next_level
    
    return leaves[0]
```

Production implementations may optimize differently:

```go
// Production client (optimized, may use different algorithm)
func ComputeMerkleRoot(leaves [][]byte) []byte {
    // Parallel computation, caching, incremental updates...
    // Must produce SAME RESULTS as reference
}
```

### Complete Coverage

The reference implementation covers all specified behaviors:

```python
# Every opcode has a reference implementation
OPCODE_IMPLEMENTATIONS = {
    0x00: op_stop,
    0x01: op_add,
    0x02: op_mul,
    # ... every single opcode
    0xFF: op_selfdestruct,
}

def op_add(evm: EVM) -> None:
    """ADD opcode reference implementation."""
    a = pop_stack(evm)
    b = pop_stack(evm)
    charge_gas(evm, GAS_VERY_LOW)
    result = (a + b) % (2**256)
    push_stack(evm, result)
    evm.pc += 1
```

### Runnable

You can actually execute the reference implementation:

```bash
# Run the reference implementation
$ python -m ethereum.execute \
    --pre state.json \
    --block block.json \
    --fork cancun
    
{
  "postStateRoot": "0x...",
  "receipts": [...],
  "logs": [...]
}
```

## Uses of Reference Implementation

### 1. Fixture Generation

The reference implementation generates test fixtures:

```python
def generate_fixture(scenario: Scenario) -> Fixture:
    # Run reference implementation
    result = execute_block(scenario.pre_state, scenario.block)
    
    # Capture as fixture
    return Fixture(
        pre=scenario.pre_state,
        block=scenario.block,
        post=result.post_state  # From reference implementation
    )
```

### 2. Client Debugging

When a client fails a test, compare with reference:

```bash
# Client produces unexpected result
$ geth --execute block.json
Result: 0xABC...

# Check reference implementation  
$ python -m ethereum.execute block.json
Result: 0xDEF...

# Reference is correct by definition - client has bug
```

### 3. Specification Validation

Run the reference implementation to validate specification:

```python
def validate_specification():
    """
    Run specification against itself to verify internal consistency.
    """
    for test in internal_consistency_tests():
        pre_state = test.pre_state
        block = test.block
        
        # Execute
        post_state = execute_block(pre_state, block)
        
        # Verify invariants
        assert state_root(post_state) == block.state_root
        assert total_balance(post_state) <= total_balance(pre_state)
```

### 4. Rapid Prototyping

Test protocol changes in reference implementation first:

```python
# Prototype EIP-XXXX in reference implementation
def execute_new_opcode(evm: EVM) -> None:
    """NEW_OP: Proposed in EIP-XXXX"""
    # Implement proposed behavior
    value = pop_stack(evm)
    result = new_operation(value)
    push_stack(evm, result)
    charge_gas(evm, GAS_NEW_OP)

# Test it immediately
evm = create_evm(code=bytes([NEW_OP]))
execute(evm)
# Does it behave as expected?
```

## Relationship to Production Clients

| Aspect | Reference Implementation | Production Client |
|--------|-------------------------|-------------------|
| Language | Python (readable) | Go/Rust/Java (performant) |
| Priority | Clarity | Performance |
| Optimization | None | Heavy |
| Purpose | Define correctness | Serve users |
| Authority | Specification | Must match reference |

Production clients must produce **identical results** to the reference implementation for all inputs, but may use completely different algorithms internally.

## Downstream Dependencies

| Downstream | Relationship |
|------------|--------------|
| Test Fixtures | Generated by running reference implementation |
| Client Implementations | Must match reference outputs |
| Protocol Documentation | Derives exact behavior from reference |
| Conformance Tests | Compare clients against reference |

## Quality Criteria

- **Executable**: Actually runs and produces outputs
- **Clear**: Prioritizes readability over performance
- **Complete**: Covers all specified behaviors
- **Correct**: Is the definition of correctness (by construction)
- **Accessible**: Written in widely-understood language

## Best Practices

- Keep reference implementation simple and readable
- Never optimize at the cost of clarity
- Provide CLI tools to run reference implementation
- Document any known differences from production patterns
- Use reference implementation for all fixture generation
- Treat reference implementation bugs as specification bugs
