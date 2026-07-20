# Performance

*FURPS+ Requirements Category — How efficiently the system operates*

---

## Definition

Performance requirements define the speed, throughput, and resource efficiency of the system. For blockchain systems, this category extends to include **finality time**—how quickly transactions become irreversible—and **gas economics**—the computational cost model.

## Role in the Framework

Performance requirements establish the quantitative bounds within which the system must operate. They're particularly important in decentralized systems where performance directly impacts user experience and economic viability.

```
Performance Requirements (including Finality)
    ↓
Prose Specification ← documents targets and bounds
    ↓
Executable Specification ← implements gas calculations, timing logic
    ↓
Test Fixtures ← generates performance benchmarks
    ↓
Reference Implementation ← provides baseline measurements
```

## Core Subcategories

### Throughput
How much work the system can process:
- Transactions per second (TPS)
- Blocks per time unit
- Messages per second

### Latency
How quickly operations complete:
- Transaction confirmation time
- API response time
- Block propagation delay

### Resource Utilization
How efficiently resources are used:
- CPU usage
- Memory consumption
- Storage growth rate
- Network bandwidth

### Scalability
How performance changes with load:
- Linear vs. sub-linear scaling
- Degradation characteristics
- Maximum capacity

## Blockchain-Critical: Finality

Traditional performance metrics don't capture a crucial blockchain concern: when is a transaction truly irreversible?

### Finality Time

| Finality Type | Description | Example |
|---------------|-------------|---------|
| **Probabilistic** | Increasingly unlikely to reverse over time | Bitcoin (6 confirmations ≈ 1 hour) |
| **Economic** | Reversal requires destroying staked value | Ethereum PoS (2 epochs ≈ 13 minutes) |
| **Absolute** | Mathematically impossible to reverse | BFT chains (single block) |

```markdown
## PERF-FINAL-1: Finality Guarantees

Transaction finality SHALL be achieved as follows:
- PERF-FINAL-1.1: Preliminary confirmation within 12 seconds (1 slot)
- PERF-FINAL-1.2: Economic finality within 12.8 minutes (2 epochs)
- PERF-FINAL-1.3: After finalization, reversal requires mass slashing 
  of ≥1/3 staked ETH

Specification of finality time by confirmation depth:
| Depth | Time | Reversal Cost |
|-------|------|---------------|
| 1 slot | 12s | Proposer slash |
| 1 epoch | 6.4m | Attester slashes |
| 2 epochs | 12.8m | ≥1/3 stake slash |
```

### Gas Economics

Gas is performance-as-specification—it quantifies computational cost:

```markdown
## PERF-GAS-1: Operation Costs

Each EVM operation SHALL consume gas as specified:
- PERF-GAS-1.1: ADD/SUB: 3 gas
- PERF-GAS-1.2: MUL/DIV: 5 gas  
- PERF-GAS-1.3: SLOAD: 2100 gas (cold) / 100 gas (warm)
- PERF-GAS-1.4: SSTORE: 20000 gas (new) / 5000 gas (update)
- PERF-GAS-1.5: Block gas limit: 30,000,000 gas
```

## Relationship to Specifications

### Prose Specification
Documents performance targets and bounds:

```markdown
## PERF-2.1: Block Processing Performance

Block processing SHALL meet the following targets:
- PERF-2.1.1: Block validation MUST complete within 4 seconds
- PERF-2.1.2: State root computation MUST complete within 2 seconds
- PERF-2.1.3: Block propagation SHOULD reach 95% of peers within 1 second

Performance Degradation:
- Under maximum gas utilization, targets MAY be extended by 50%
- During sync, real-time validation is not required
```

### Executable Specification
Implements gas calculations and timing constraints:

```python
# Gas costs per EVM specification
GAS_COSTS = {
    'ADD': 3,
    'MUL': 5,
    'SLOAD_COLD': 2100,
    'SLOAD_WARM': 100,
    'SSTORE_NEW': 20000,
    'SSTORE_UPDATE': 5000,
}

def charge_gas(evm: EVM, operation: str) -> None:
    """
    Implements PERF-GAS-1: Operation Costs
    """
    cost = GAS_COSTS[operation]
    if evm.gas_remaining < cost:
        raise OutOfGas(
            required=cost,
            available=evm.gas_remaining,
            operation=operation
        )
    evm.gas_remaining -= cost
    evm.gas_used += cost

def sload(evm: EVM, slot: int) -> int:
    """
    Implements PERF-GAS-1.3: SLOAD costs
    """
    if slot in evm.accessed_storage:
        charge_gas(evm, 'SLOAD_WARM')
    else:
        charge_gas(evm, 'SLOAD_COLD')
        evm.accessed_storage.add(slot)
    
    return evm.storage.get(slot, 0)
```

## Downstream Dependencies

| Downstream Document | What It Derives |
|--------------------|-----------------|
| Test Fixtures | Benchmark test cases, gas calculation vectors |
| Reference Implementation | Baseline performance measurements |
| Developer Guides | Gas optimization strategies |
| API Documentation | Rate limits, timeout configurations |
| Operations Guides | Capacity planning, resource allocation |

## Performance Testing from Executable Specs

The executable specification enables automatic performance verification:

```python
class PerformanceTests:
    """
    Generated from PERF-2.1: Block Processing Performance
    """
    
    @performance_test(target_seconds=4.0)  # PERF-2.1.1
    def test_block_validation_time(self, block: Block):
        start = time.perf_counter()
        validate_block(block)
        elapsed = time.perf_counter() - start
        assert elapsed < 4.0, f"Validation took {elapsed}s, target is 4s"
    
    @performance_test(target_seconds=2.0)  # PERF-2.1.2
    def test_state_root_computation(self, state: State):
        start = time.perf_counter()
        compute_state_root(state)
        elapsed = time.perf_counter() - start
        assert elapsed < 2.0, f"State root took {elapsed}s, target is 2s"
```

## Quality Criteria

- **Quantified**: All targets have specific numbers
- **Measurable**: Performance can be objectively verified
- **Realistic**: Targets are achievable in practice
- **Bounded**: Worst-case performance is specified
- **Versioned**: Targets may change between protocol versions

## Best Practices

- Specify both average and percentile targets (p50, p95, p99)
- Document performance under various load conditions
- Include gas costs in executable specification
- Generate benchmark tests from performance requirements
- Track performance regression across versions
- Separate "MUST" performance (hard limits) from "SHOULD" (targets)
