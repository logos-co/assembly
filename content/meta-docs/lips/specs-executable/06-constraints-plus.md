# Constraints (+)

*FURPS+ Extension Categories — Design, implementation, and domain constraints*

---

## Definition

The "+" in FURPS+ represents constraint categories that bound how requirements can be satisfied. The original categories—Design, Implementation, Interface, and Physical constraints—require significant augmentation for blockchain systems to include **Consensus**, **Decentralization**, and domain-specific constraints.

## Role in the Framework

Constraints don't define what the system does (that's Functionality) but rather *how* it must do it. They narrow the solution space and often drive architectural decisions.

```
Constraint Requirements
    ↓
Prose Specification ← documents mandatory constraints
    ↓
Executable Specification ← implements constraint checking
    ↓
Architecture Docs ← explains constraint-driven decisions
    ↓
Compliance Matrix ← verifies constraint satisfaction
```

## Traditional + Categories

### Design Constraints
Mandatory architectural patterns:
- Must use microservices architecture
- Must separate consensus and execution layers
- Must support horizontal scaling

### Implementation Constraints
Technology and methodology requirements:
- Must be implemented in memory-safe language
- Must use approved cryptographic libraries
- Must follow secure coding standards

### Interface Constraints
External interaction requirements:
- Must support JSON-RPC API
- Must use SSZ for consensus encoding
- Must implement EIP-4844 blob format

### Physical Constraints
Hardware and infrastructure requirements:
- Must run on commodity hardware (32GB RAM, 2TB SSD)
- Must operate over public internet
- Must support 100Mbps network connections

## Blockchain-Critical: Consensus Constraints

Consensus constraints define how distributed agreement is achieved:

```markdown
## CONS-1: Byzantine Fault Tolerance

The consensus mechanism SHALL tolerate Byzantine faults:
- CONS-1.1: System remains safe with <1/3 Byzantine validators
- CONS-1.2: System remains live with <1/3 Byzantine validators
- CONS-1.3: Safety is preserved even if liveness is lost

## CONS-2: Validator Requirements

Validators SHALL meet the following constraints:
- CONS-2.1: Minimum stake: 32 ETH
- CONS-2.2: Must run both execution and consensus clients
- CONS-2.3: Must maintain 99% uptime or face penalties
- CONS-2.4: Must attest within 1 epoch or lose rewards

## CONS-3: Finality Mechanism

Finality SHALL be achieved through Casper FFG:
- CONS-3.1: Supermajority (2/3) attestations required for justification
- CONS-3.2: Two consecutive justified epochs required for finalization
- CONS-3.3: Conflicting finalizations require ≥1/3 stake to be slashable
```

## Blockchain-Critical: Decentralization Constraints

Decentralization constraints prevent centralization of control:

```markdown
## DECN-1: Censorship Resistance

The protocol SHALL resist transaction censorship:
- DECN-1.1: No single entity can exclude transactions indefinitely
- DECN-1.2: Proposer selection MUST be unpredictable
- DECN-1.3: Block builders MUST NOT have persistent advantages

## DECN-2: Geographic Distribution

The network SHALL support global participation:
- DECN-2.1: Protocol MUST NOT assume low-latency connections
- DECN-2.2: Slot times MUST accommodate global propagation
- DECN-2.3: No region-specific dependencies

## DECN-3: Stake Distribution

Healthy stake distribution SHALL be maintained:
- DECN-3.1: No entity SHOULD control >33% of stake
- DECN-3.2: Protocol SHOULD incentivize distributed staking
- DECN-3.3: Liquid staking protocols SHOULD limit concentration
```

## Interface Constraints: Wire Formats

Blockchain protocols require precise interface constraints:

```markdown
## INTF-1: Encoding Formats

Data encoding SHALL use specified formats:
- INTF-1.1: Execution layer: RLP encoding per Ethereum Yellow Paper
- INTF-1.2: Consensus layer: SSZ encoding per consensus specs
- INTF-1.3: JSON-RPC: Standard JSON with hex encoding for bytes
- INTF-1.4: Blob data: EIP-4844 blob format (4096 field elements)

## INTF-2: Network Protocols

P2P communication SHALL use:
- INTF-2.1: devp2p for execution layer peer discovery
- INTF-2.2: libp2p for consensus layer communication
- INTF-2.3: discv5 for node discovery
- INTF-2.4: SSZ-snappy compression for consensus messages
```

## Relationship to Specifications

### Prose Specification
Documents constraints formally:

```markdown
## IMPL-1: Cryptographic Standards

All cryptographic operations SHALL use:
- IMPL-1.1: secp256k1 for ECDSA signatures (execution layer)
- IMPL-1.2: BLS12-381 for aggregate signatures (consensus layer)
- IMPL-1.3: Keccak-256 for hashing (execution layer)
- IMPL-1.4: SHA-256 for hashing (consensus layer)

Non-compliant cryptographic implementations SHALL be rejected.
```

### Executable Specification
Implements constraint verification:

```python
from typing import Literal

# IMPL-1.1: secp256k1 constraint
ALLOWED_SIGNATURE_SCHEMES: set[str] = {"secp256k1"}

# INTF-1.1: RLP encoding constraint
def encode_transaction(tx: Transaction) -> bytes:
    """
    Encodes transaction per INTF-1.1: RLP encoding.
    Other encodings are not permitted.
    """
    return rlp.encode([
        tx.nonce,
        tx.gas_price,
        tx.gas_limit,
        tx.to,
        tx.value,
        tx.data,
        tx.v,
        tx.r,
        tx.s
    ])

# CONS-1.1: Byzantine fault tolerance constraint
def is_safe_supermajority(attestations: list[Attestation], total_stake: int) -> bool:
    """
    Verifies CONS-1.1: Safety with <1/3 Byzantine validators.
    Requires 2/3 attestation weight for safety guarantee.
    """
    attesting_stake = sum(a.stake for a in attestations)
    return attesting_stake * 3 >= total_stake * 2

# DECN-1.2: Unpredictable proposer selection
def select_proposer(
    validators: list[Validator],
    slot: int,
    randao: bytes
) -> Validator:
    """
    Implements DECN-1.2: Proposer selection MUST be unpredictable.
    Uses RANDAO mix to prevent prediction.
    """
    seed = hash(randao + slot.to_bytes(8, 'little'))
    index = int.from_bytes(seed[:8], 'little') % len(validators)
    return validators[index]
```

## Downstream Dependencies

| Downstream Document | What It Derives |
|--------------------|-----------------|
| Architecture Docs | Explains constraint-driven design choices |
| Protocol Documentation | Wire format specifications |
| Client Implementations | Must satisfy all constraints |
| Compliance Matrix | Verifies constraint satisfaction |
| Security Audits | Reviews constraint enforcement |

## Constraint Verification

Constraints should be verifiable through the executable specification:

```python
class ConstraintTests:
    """
    Verifies + constraint satisfaction
    """
    
    def test_byzantine_fault_tolerance(self):
        """CONS-1.1: System safe with <1/3 Byzantine"""
        validators = create_validators(100)
        byzantine = validators[:33]  # Exactly 1/3
        honest = validators[33:]
        
        # With 1/3 Byzantine, should still be safe (but borderline)
        # With >1/3 Byzantine, safety could be violated
        assert can_achieve_safety(honest)
    
    def test_encoding_compliance(self):
        """INTF-1.1: Must use RLP encoding"""
        tx = create_transaction()
        encoded = encode_transaction(tx)
        
        # Verify it's valid RLP
        decoded = rlp.decode(encoded)
        assert decoded is not None
        
        # Verify roundtrip
        assert decode_transaction(encoded) == tx
    
    def test_proposer_unpredictability(self):
        """DECN-1.2: Proposer selection unpredictable"""
        validators = create_validators(1000)
        
        # Different RANDAO should give different proposers
        proposers = set()
        for i in range(100):
            randao = os.urandom(32)
            proposer = select_proposer(validators, slot=1, randao=randao)
            proposers.add(proposer.id)
        
        # Should have significant variety
        assert len(proposers) > 50
```

## Quality Criteria

- **Justified**: Each constraint has clear rationale
- **Minimal**: No unnecessary constraints
- **Enforceable**: Constraints can be verified
- **Compatible**: Constraints don't conflict
- **Documented**: Constraint implications are explained

## Best Practices

- Document the rationale for each constraint
- Distinguish hard constraints (MUST) from preferences (SHOULD)
- Verify constraints through executable specification
- Review constraints when protocol evolves
- Consider constraint interactions (constraints may conflict)
- Make decentralization constraints explicit, not assumed
