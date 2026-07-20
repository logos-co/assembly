# Client Implementations

*Implementation Layer — Independent implementations achieving consensus through shared specification*

---

## Definition

Client implementations are independent software implementations of a protocol specification. In decentralized systems, multiple clients written by different teams in different languages must all produce identical results when processing the same inputs.

## Role in the Framework

Client diversity is a feature, not a bug. Multiple implementations:
- Reduce single points of failure
- Catch specification ambiguities
- Provide resilience against bugs
- Enable ecosystem choice

```
Executable Specification
    ↓
Test Fixtures (generated)
    ↓
┌─────────────────────────────────────────────┐
│           Client Implementations             │
├──────────┬──────────┬──────────┬────────────┤
│   Geth   │Nethermind│   Besu   │   Reth     │
│   (Go)   │   (C#)   │  (Java)  │  (Rust)    │
└──────────┴──────────┴──────────┴────────────┘
    ↓              ↓           ↓            ↓
    └──────────────┴───────────┴────────────┘
                       │
              All produce identical
              results for same inputs
```

## The Multi-Client Imperative

For blockchain consensus, all clients must agree on state:

| Input | Geth | Nethermind | Besu | Reth |
|-------|------|------------|------|------|
| Block N | State Root X | State Root X | State Root X | State Root X |
| Tx Hash | Receipt Y | Receipt Y | Receipt Y | Receipt Y |

If any client produces different results, the network could split. The executable specification prevents this by providing:
1. Unambiguous behavior definition
2. Generated test fixtures all clients must pass
3. A reference to compare against when debugging

## Relationship to Specifications

### Derived From, Not Defining

Client implementations derive behavior from the specification—they don't define it:

```
Specification says: "SLOAD costs 2100 gas for cold access"
                           ↓
Client implements: sloadGas := 2100  // Per spec
                           ↓
Fixture verifies: Input state + SLOAD → Expected gas consumed
```

If a client implements different behavior:
- **Bug**: The client is wrong, not the spec
- **Ambiguity**: The spec needs clarification (rare with executable specs)

### Specification Traceability

Good client implementations trace back to spec:

```go
// Geth implementation
func opSload(pc *uint64, interpreter *EVMInterpreter, scope *ScopeContext) ([]byte, error) {
    // Per EIP-2929 / SPEC-GAS-4.2.3
    loc := scope.Stack.peek()
    
    if interpreter.evm.StateDB.AddressInAccessList(scope.Contract.Address(), loc.Bytes32()) {
        // Warm access: 100 gas per SPEC-GAS-4.2.3.2
        scope.Contract.UseGas(100)
    } else {
        // Cold access: 2100 gas per SPEC-GAS-4.2.3.1
        scope.Contract.UseGas(2100)
        interpreter.evm.StateDB.AddSlotToAccessList(scope.Contract.Address(), loc.Bytes32())
    }
    // ...
}
```

## Client Architecture Patterns

### Execution-Consensus Split

Post-Merge Ethereum separates concerns:

```
┌─────────────────────────────────────┐
│        Consensus Client             │
│  (Lighthouse, Prysm, Teku, etc.)    │
│  - Beacon chain logic               │
│  - Validator duties                 │
│  - Fork choice                      │
└─────────────────┬───────────────────┘
                  │ Engine API
                  │
┌─────────────────┴───────────────────┐
│        Execution Client             │
│  (Geth, Nethermind, Besu, etc.)     │
│  - Transaction execution            │
│  - State management                 │
│  - EVM                              │
└─────────────────────────────────────┘
```

Each layer has its own specification, fixtures, and multiple implementations.

### Modular Components

Clients share common patterns:
- **State database**: Stores account/storage data
- **EVM**: Executes smart contracts  
- **Transaction pool**: Manages pending transactions
- **P2P networking**: Communicates with peers
- **JSON-RPC**: Serves API requests

Each component implements corresponding specification sections.

## Conformance Verification

Clients prove conformance by passing fixture tests:

```bash
# Run execution-spec-tests against client
$ execute-spec-tests --client geth --fork cancun

Running 15,234 state transition tests...
✓ test_value_transfer_simple
✓ test_contract_creation
✓ test_eip1559_fee_calculation
...
Results: 15,234 passed, 0 failed

Running 8,456 VM tests...
✓ test_add_basic
✓ test_sload_cold_access
...
Results: 8,456 passed, 0 failed

OVERALL: PASS - Client conforms to Cancun specification
```

## Handling Specification Changes

When the specification updates (new fork):

```
1. Specification updated
         ↓
2. New fixtures generated
         ↓
3. Each client team implements changes
         ↓
4. Clients pass new fixtures
         ↓
5. Fork activated on testnets
         ↓
6. Fork activated on mainnet
```

Timeline coordination ensures all clients are ready before activation.

## Client-Specific Documentation

Each client maintains documentation for:
- **Installation**: How to run this client
- **Configuration**: Client-specific options
- **APIs**: Any extensions beyond spec
- **Operations**: Monitoring, maintenance

This documentation should clearly distinguish:
- Spec-required behavior (all clients must match)
- Client-specific features (unique to this client)

## Downstream Dependencies

| Downstream | Relationship |
|------------|--------------|
| Conformance Tests | Run fixtures against clients |
| Operations Guides | Client-specific procedures |
| Developer Guides | May reference client-specific tools |
| Contribution Guidelines | How to contribute to each client |

## Quality Criteria

- **Conformant**: Passes all specification test fixtures
- **Performant**: Meets performance requirements
- **Reliable**: Operates stably in production
- **Maintained**: Actively updated for new forks
- **Documented**: Clear usage and operations docs

## Best Practices

- Run fixture tests in CI for every change
- Participate in interoperability testing
- Trace implementation back to specification sections
- Document client-specific extensions clearly
- Coordinate with other clients on specification interpretation
- Report ambiguities discovered during implementation
