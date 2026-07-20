# Supportability

*FURPS+ Requirements Category — How easily the system can be maintained and evolved*

---

## Definition

Supportability requirements define how easily the system can be configured, maintained, upgraded, and extended. For blockchain systems, this category critically includes **fork management**—the ability to coordinate protocol upgrades across a decentralized network.

## Role in the Framework

Supportability determines the long-term viability of a system. Protocols that are difficult to upgrade become frozen; those without observability become undebuggable.

```
Supportability Requirements (including Fork Management)
    ↓
Prose Specification ← documents upgrade mechanisms, extension points
    ↓
Executable Specification ← implements fork logic, versioning
    ↓
Changelogs ← tracks fork history
    ↓
Contribution Guidelines ← enables sustainable participation
```

## Core Subcategories

### Configurability
Ability to adjust system behavior:
- Runtime configuration options
- Feature flags
- Network parameters

### Maintainability
Ease of ongoing operation:
- Code modularity
- Documentation quality
- Debugging capabilities

### Extensibility
Ability to add new capabilities:
- Plugin architectures
- Extension points
- Backward-compatible additions

### Observability
Insight into system behavior:
- Logging standards
- Metrics exposure
- Tracing capabilities

## Blockchain-Critical: Fork Management

Traditional software upgrades don't apply to decentralized systems. Forks coordinate protocol changes across independent nodes that must reach consensus on when and how to upgrade.

### Fork Types

| Fork Type | Description | Consensus Impact |
|-----------|-------------|------------------|
| **Soft Fork** | Tightens rules; old nodes accept new blocks | Backward compatible |
| **Hard Fork** | Changes rules; old nodes reject new blocks | Requires coordination |
| **Contentious Fork** | Community disagrees on direction | May cause chain split |

### Fork Activation Mechanisms

```markdown
## SUPP-FORK-1: Fork Activation

Protocol upgrades SHALL be activated by one of:
- SUPP-FORK-1.1: Block number activation (at block N, new rules apply)
- SUPP-FORK-1.2: Timestamp activation (at time T, new rules apply)
- SUPP-FORK-1.3: TTD activation (at terminal total difficulty, transition)

Each fork SHALL be identified by:
- Unique name (e.g., "Cancun", "Dencun")
- Activation parameters per network (mainnet, testnet, devnet)
- Complete list of EIPs included
```

### Fork Organization in Executable Specs

The Ethereum EELS organizes specifications by fork:

```
ethereum/
├── frontier/          # Genesis rules
├── homestead/         # Fork 1
├── tangerine_whistle/ # Fork 2
├── spurious_dragon/   # Fork 3
├── byzantium/         # Fork 4
├── constantinople/    # Fork 5
├── istanbul/          # Fork 6
├── berlin/            # Fork 7
├── london/            # Fork 8
├── paris/             # The Merge
├── shanghai/          # Fork 9
├── cancun/            # Fork 10
└── prague/            # Fork 11 (upcoming)
```

Each fork directory is a complete snapshot—not a diff—enabling clear understanding of exact rules at any point.

## Relationship to Specifications

### Prose Specification
Documents upgrade mechanisms and extension points:

```markdown
## SUPP-2.1: Protocol Versioning

The protocol SHALL maintain version compatibility as follows:
- SUPP-2.1.1: Wire protocol includes version negotiation
- SUPP-2.1.2: Nodes MUST support current and previous major version
- SUPP-2.1.3: Deprecation notices MUST precede removal by 2 major versions
- SUPP-2.1.4: Breaking changes MUST increment major version

## SUPP-2.2: Extension Points

The following extension mechanisms are supported:
- SUPP-2.2.1: New transaction types via EIP-2718 envelope
- SUPP-2.2.2: New precompiled contracts at designated addresses
- SUPP-2.2.3: New opcodes in reserved ranges
- SUPP-2.2.4: State schema extensions via account versioning
```

### Executable Specification
Implements fork logic:

```python
@dataclass
class ForkConfig:
    """
    Implements SUPP-FORK-1: Fork Activation
    """
    name: str
    block_number: Optional[int] = None  # SUPP-FORK-1.1
    timestamp: Optional[int] = None      # SUPP-FORK-1.2
    ttd: Optional[int] = None            # SUPP-FORK-1.3

MAINNET_FORKS = [
    ForkConfig("Frontier", block_number=0),
    ForkConfig("Homestead", block_number=1150000),
    ForkConfig("London", block_number=12965000),
    ForkConfig("Paris", ttd=58750000000000000000000),
    ForkConfig("Shanghai", timestamp=1681338455),
    ForkConfig("Cancun", timestamp=1710338135),
]

def get_active_fork(chain_id: int, block: Block) -> str:
    """Determine which fork rules apply to a given block."""
    forks = get_fork_config(chain_id)
    active = "Frontier"
    
    for fork in forks:
        if fork.block_number and block.number >= fork.block_number:
            active = fork.name
        if fork.timestamp and block.timestamp >= fork.timestamp:
            active = fork.name
        if fork.ttd and get_total_difficulty(block.parent) >= fork.ttd:
            active = fork.name
    
    return active

def apply_fork_rules(fork: str, state: State, tx: Transaction) -> Receipt:
    """
    Execute transaction under fork-specific rules.
    Each fork module implements the complete state transition.
    """
    fork_module = import_module(f"ethereum.{fork.lower()}")
    return fork_module.process_transaction(state, tx)
```

## Downstream Dependencies

| Downstream Document | What It Derives |
|--------------------|-----------------|
| Changelogs | Fork history, activation dates, included EIPs |
| Client Implementations | Fork-aware processing logic |
| Operations Guides | Upgrade procedures, fork preparation |
| Test Fixtures | Per-fork test vectors |
| Developer Guides | Feature availability by fork |

## Client Diversity and Supportability

Supportability in multi-client ecosystems means ensuring all implementations can upgrade:

```markdown
## SUPP-3.1: Multi-Client Coordination

Protocol upgrades SHALL support client diversity:
- SUPP-3.1.1: Specification published ≥3 months before activation
- SUPP-3.1.2: Test fixtures available ≥2 months before activation
- SUPP-3.1.3: All major clients SHOULD implement before testnet activation
- SUPP-3.1.4: Mainnet activation SHOULD follow successful testnet period
```

## Quality Criteria

- **Upgradeable**: System can evolve without network disruption
- **Observable**: Operators can see what's happening
- **Debuggable**: Problems can be diagnosed
- **Extensible**: New features can be added cleanly
- **Documented**: Upgrade procedures are clear

## Best Practices

- Organize executable specs by fork as complete snapshots
- Document fork activation parameters for all networks
- Provide migration guides for breaking changes
- Include deprecation timelines in specifications
- Test fork transitions explicitly (before/after boundary)
- Maintain backwards compatibility where possible
