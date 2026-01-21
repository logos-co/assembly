# Executable Specification

*Canonical Specification Layer — Code-as-specification with exact behavior*

---

## Definition

An executable specification is a formal specification written as runnable code. It defines exact system behavior in a form that can be executed, tested, and used to generate test fixtures. The code *is* the specification—not documentation about an implementation, but the authoritative definition of correct behavior.

## Role in the Framework

The executable specification is the precision engine of the framework. It eliminates ambiguity by expressing requirements as code that can be run and verified.

```
FURPS+ Requirements
    ↓
Prose Specification ← human-readable requirements
    ↕ (bidirectional sync)
Executable Specification ← machine-precise behavior
    ↓
├── Test Fixtures (generated)
├── Reference Implementation (derived)
└── Client Implementations (must match)
```

## The Ethereum Model: EELS

Ethereum's Execution Layer Specification (EELS) exemplifies executable specifications:

```python
def execute_transaction(state: State, tx: Transaction) -> Tuple[State, Receipt]:
    """
    Execute a transaction and return the resulting state and receipt.
    
    This function IS the specification for transaction execution.
    All client implementations must produce identical results.
    """
    sender = recover_sender(tx)
    
    # Validate transaction
    validate_transaction(state, tx)
    
    # Deduct upfront cost
    max_cost = tx.gas_limit * tx.gas_price
    state = deduct_balance(state, sender, max_cost)
    
    # Execute
    if tx.to is None:
        result = create_contract(state, tx)
    else:
        result = call_contract(state, tx.to, tx.data, tx.value)
    
    # Calculate refund
    refund = (tx.gas_limit - result.gas_used) * tx.gas_price
    state = credit_balance(state, sender, refund)
    
    # Generate receipt
    receipt = Receipt(
        status=result.success,
        gas_used=result.gas_used,
        logs=result.logs,
        bloom=create_bloom(result.logs)
    )
    
    return state, receipt
```

This code isn't documentation—it's the authoritative definition that all clients must match exactly.

## Core Characteristics

### Clarity Over Performance

Executable specs prioritize readability over optimization:

```python
# GOOD: Clear, matches conceptual model
def compute_state_root(state: State) -> Hash:
    trie = MerklePatriciaTrie()
    for address, account in state.accounts.items():
        trie.insert(keccak256(address), rlp_encode(account))
    return trie.root()

# BAD for specification: Optimized but obscures logic
def compute_state_root_fast(state: State) -> Hash:
    # Parallel processing, caching, incremental updates...
    # Hard to verify this matches the conceptual model
```

### Fork-by-Fork Organization

Each protocol version is a complete snapshot:

```
ethereum/
├── __init__.py
├── frontier/
│   ├── __init__.py
│   ├── state.py
│   ├── transactions.py
│   ├── vm/
│   │   ├── __init__.py
│   │   ├── instructions.py
│   │   └── gas.py
│   └── fork.py
├── homestead/
│   └── ... (complete snapshot, not diff)
├── london/
│   └── ... (complete snapshot)
└── cancun/
    └── ... (complete snapshot)
```

This organization means you can examine exactly what rules applied at any fork.

### Self-Documenting Through Types

Type annotations serve as specification:

```python
from typing import NewType, Literal

# Types ARE specification
Address = NewType('Address', bytes)  # 20 bytes
Hash = NewType('Hash', bytes)        # 32 bytes
Uint256 = NewType('Uint256', int)    # 0 <= n < 2**256

@dataclass
class Transaction:
    """EIP-1559 transaction structure."""
    chain_id: int
    nonce: Uint256
    max_priority_fee_per_gas: Uint256
    max_fee_per_gas: Uint256
    gas_limit: Uint256
    to: Optional[Address]  # None for contract creation
    value: Uint256
    data: bytes
    access_list: List[Tuple[Address, List[Hash]]]
    signature: Signature
```

### Assertion-Based Constraints

Invariants are executable:

```python
def apply_state_transition(
    state: State, 
    block: Block
) -> State:
    """
    Apply a block to state, returning new state.
    
    Invariants (these ARE the specification):
    - State root must match block.state_root after application
    - Total balance must be conserved (minus burned fees)
    - All transactions must be valid
    """
    initial_balance = sum_all_balances(state)
    
    for tx in block.transactions:
        state = execute_transaction(state, tx)
    
    # Invariant checks
    assert compute_state_root(state) == block.state_root
    assert sum_all_balances(state) <= initial_balance  # Fees burned
    
    return state
```

## Relationship to Prose Specification

### Complementary Roles

| Aspect | Prose Spec | Executable Spec |
|--------|-----------|-----------------|
| Rationale | ✓ Explains why | ✗ Just behavior |
| Precision | May have ambiguity | Exact by construction |
| Accessibility | Readable by all | Requires code literacy |
| Executability | ✗ Static text | ✓ Runnable |
| Test generation | ✗ Manual | ✓ Automatic |

### Synchronization Requirement

When prose and executable specs diverge, resolution is required:

```markdown
## Divergence Resolution Process

1. Identify divergence (prose says X, code does Y)
2. Determine intent:
   - If prose captures intent → fix executable spec (bug)
   - If code captures intent → update prose spec (documentation)
3. Update both to match
4. Regenerate test fixtures
5. Verify all clients still pass
```

## Test Fixture Generation

The executable specification generates test vectors:

```python
def generate_test_fixtures():
    """
    Generate JSON test fixtures from executable spec.
    These fixtures are the compliance tests for all clients.
    """
    fixtures = []
    
    # State transition tests
    for scenario in state_transition_scenarios():
        pre_state = scenario.initial_state
        block = scenario.block
        
        # Execute using the spec
        post_state = apply_state_transition(pre_state, block)
        
        fixtures.append({
            "name": scenario.name,
            "pre": serialize_state(pre_state),
            "block": serialize_block(block),
            "post": serialize_state(post_state),
            "postStateRoot": compute_state_root(post_state).hex()
        })
    
    return fixtures
```

These fixtures become the conformance tests for all client implementations.

## Downstream Dependencies

| Downstream | Relationship |
|------------|--------------|
| Test Fixtures | Generated directly from executable spec |
| Reference Implementation | The executable spec IS a reference implementation |
| Client Implementations | Must produce identical outputs |
| Protocol Documentation | Derives exact formats from spec types |
| Data Schemas | Generated from spec type definitions |
| Conformance Tests | Run fixtures against implementations |

## Multi-Client Consensus

The executable specification is what makes multi-client architectures possible:

```
                    Executable Spec
                          │
           ┌──────────────┼──────────────┐
           │              │              │
           ▼              ▼              ▼
        ┌──────┐      ┌──────┐      ┌──────┐
        │ Geth │      │Nether│      │ Besu │
        │ (Go) │      │(C#)  │      │(Java)│
        └──┬───┘      └──┬───┘      └──┬───┘
           │             │             │
           └─────────────┼─────────────┘
                         │
                         ▼
              Test Fixtures (JSON)
                         │
           ┌─────────────┼─────────────┐
           │             │             │
           ▼             ▼             ▼
        Same          Same          Same
       Results       Results       Results
```

If any client produces different results than the executable spec, that client has a consensus bug.

## Quality Criteria

- **Executable**: Code runs and produces outputs
- **Clear**: Logic is understandable, not optimized to obscurity
- **Complete**: Covers all specified behaviors
- **Testable**: Can generate comprehensive test fixtures
- **Versioned**: Each fork is a complete snapshot
- **Typed**: Strong types document structure

## Best Practices

- Write for clarity, not performance
- Use descriptive names that match prose spec terminology
- Include docstrings linking to prose spec sections
- Organize by fork as complete snapshots
- Generate, don't hand-write, test fixtures
- Run specification against itself as validation
- Maintain executable spec as the source of truth for exact behavior
