# Reliability

*FURPS+ Requirements Category — How dependably the system operates*

---

## Definition

Reliability requirements define how consistently and dependably the system performs its functions. For blockchain systems, this category expands significantly to include **safety** (the system never does something wrong) and **liveness** (the system eventually does something right).

## Role in the Framework

Reliability requirements are particularly critical in decentralized systems where failures can result in lost funds, consensus splits, or network halts.

```
Reliability Requirements (including Safety & Liveness)
    ↓
Prose Specification ← documents guarantees and failure modes
    ↓
Executable Specification ← implements recovery logic, state machines
    ↓
Test Fixtures ← generates fault injection tests
    ↓
Conformance Tests ← verifies reliability properties
```

## Core Subcategories

### Availability
System uptime and accessibility:
- Target availability percentage (e.g., 99.9%)
- Planned maintenance windows
- Degraded operation modes

### Recoverability
Ability to restore correct operation after failures:
- State recovery mechanisms
- Transaction replay
- Checkpoint/restore capabilities

### Fault Tolerance
Behavior in presence of failures:
- Byzantine fault tolerance thresholds
- Network partition handling
- Message loss recovery

### Data Integrity
Protection against data corruption:
- Checksums and verification
- Merkle proofs
- State consistency guarantees

## Blockchain-Critical: Safety and Liveness

Traditional FURPS+ reliability is insufficient for consensus systems. Two properties become paramount:

### Safety
**"Nothing bad ever happens"** — The system never produces incorrect results.

| Safety Property | Meaning |
|-----------------|---------|
| **Agreement** | No two honest nodes finalize conflicting transactions |
| **Validity** | Only valid transactions are finalized |
| **Integrity** | Finalized state accurately reflects executed transactions |

```markdown
## REL-SAFETY-1: Transaction Finality Safety

Once a transaction is finalized:
- REL-SAFETY-1.1: No reorganization SHALL reverse the transaction
- REL-SAFETY-1.2: All honest nodes SHALL agree on the transaction's effects
- REL-SAFETY-1.3: The transaction's state changes SHALL be permanent
```

### Liveness
**"Something good eventually happens"** — The system makes progress.

| Liveness Property | Meaning |
|-------------------|---------|
| **Termination** | Valid transactions eventually finalize |
| **Progress** | The chain continues to grow |
| **Censorship Resistance** | Valid transactions cannot be excluded indefinitely |

```markdown
## REL-LIVE-1: Transaction Inclusion Liveness

For any valid transaction submitted to the network:
- REL-LIVE-1.1: The transaction SHALL be included within N blocks 
  under normal network conditions
- REL-LIVE-1.2: If network partitions heal, pending transactions 
  SHALL eventually be processed
- REL-LIVE-1.3: No single entity SHALL be able to prevent inclusion
  indefinitely
```

### The Safety-Liveness Tradeoff

The FLP impossibility theorem proves that in asynchronous networks with potential failures, you cannot guarantee both safety and liveness simultaneously. Specifications must document the tradeoff:

```markdown
## REL-TRADEOFF-1: Consensus Properties Under Partition

During network partition:
- REL-TRADEOFF-1.1: The system SHALL prioritize safety over liveness
- REL-TRADEOFF-1.2: Blocks MAY stop being finalized
- REL-TRADEOFF-1.3: When partition heals, liveness SHALL resume
- REL-TRADEOFF-1.4: No conflicting finalization SHALL occur
```

## Relationship to Specifications

### Prose Specification
Documents reliability guarantees and failure modes:

```markdown
## REL-3.1: Message Delivery Guarantees

The protocol provides at-least-once delivery semantics:
- REL-3.1.1: Messages MAY be delivered multiple times
- REL-3.1.2: Receivers MUST handle duplicate messages idempotently
- REL-3.1.3: Messages SHALL NOT be silently dropped under normal conditions
- REL-3.1.4: Network partitions MAY cause temporary message loss

Failure Modes:
- FM-3.1.1: Network timeout → retry with exponential backoff
- FM-3.1.2: Invalid message → reject and log
- FM-3.1.3: Resource exhaustion → apply backpressure
```

### Executable Specification
Implements recovery logic and state machines:

```python
class MessageHandler:
    """
    Implements REL-3.1: Message Delivery Guarantees
    """
    def __init__(self):
        self.seen_messages: Set[MessageId] = set()
    
    def handle_message(self, msg: Message) -> None:
        # REL-3.1.2: Idempotent handling
        if msg.id in self.seen_messages:
            return  # Duplicate, safe to ignore
        
        self.seen_messages.add(msg.id)
        self.process(msg)
    
    def send_with_retry(self, msg: Message, max_retries: int = 3) -> bool:
        """
        Implements FM-3.1.1: Retry with exponential backoff
        """
        for attempt in range(max_retries):
            try:
                self.transport.send(msg)
                return True
            except Timeout:
                delay = 2 ** attempt  # Exponential backoff
                time.sleep(delay)
        return False
```

## Downstream Dependencies

| Downstream Document | What It Derives |
|--------------------|-----------------|
| Test Fixtures | Fault injection scenarios, partition tests |
| Conformance Tests | Safety and liveness verification |
| Operations Guides | Failure mode handling procedures |
| Architecture Docs | Fault tolerance design rationale |
| Audit Trails | Reliability incident history |

## Quality Criteria

- **Bounded**: Failure probabilities are quantified
- **Recoverable**: Every failure mode has a recovery path
- **Observable**: Failures are detectable and diagnosable
- **Documented**: All guarantees and limitations are explicit
- **Tested**: Reliability properties are verified under stress

## Best Practices

- Explicitly state safety vs. liveness tradeoffs
- Document failure modes alongside success paths
- Include Byzantine fault scenarios in specifications
- Specify recovery procedures in executable form
- Test reliability through chaos engineering approaches
- Make reliability guarantees version-specific (they may change with upgrades)
