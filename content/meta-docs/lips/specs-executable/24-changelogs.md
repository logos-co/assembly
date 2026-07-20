# Changelogs

*Community Layer — Fork history and specification evolution*

---

## Definition

Changelogs document the evolution of specifications and implementations over time. In blockchain systems, they particularly track **fork history**—the sequence of protocol upgrades.

## Role in the Framework

```
EIPs/RFCs ← propose changes
    ↓
Specification updated (prose + executable)
    ↓
Changelogs ← document the evolution
    ↓
├── What changed
├── Why it changed (EIP references)
├── When it activates (fork parameters)
└── Migration guidance
```

## Specification Changelog

```markdown
# Protocol Specification Changelog

## v2.4.0 — Prague (Upcoming)

**Activation**: TBD

### Added
- SPEC-EOF-1.x: EVM Object Format (EIP-7692)
- SPEC-VERKLE-2.x: Verkle tree state (EIP-6800)

### Changed  
- SPEC-GAS-4.2.3: SLOAD cost adjusted for Verkle

### EIPs Included
- EIP-7692: EOF
- EIP-6800: Verkle Trees
- EIP-XXXX: ...

---

## v2.3.0 — Cancun (Active)

**Activation**: 
- Mainnet: Block 19426587 (2024-03-13)
- Goerli: Block 10388176

### Added
- SPEC-BLOB-5.x: Blob transactions (EIP-4844)
- SPEC-MCOPY-6.x: Memory copy opcode (EIP-5656)

### Changed
- SPEC-SELF-7.1: SELFDESTRUCT behavior (EIP-6780)

### EIPs Included
- EIP-4844: Proto-Danksharding
- EIP-5656: MCOPY
- EIP-6780: SELFDESTRUCT changes
```

## Fork History

```markdown
# Ethereum Fork History

| Fork | Block/Time | Spec Version | Key Changes |
|------|------------|--------------|-------------|
| Frontier | 0 | v1.0 | Genesis |
| Homestead | 1150000 | v1.1 | DELEGATECALL |
| DAO Fork | 1920000 | v1.1.1 | State intervention |
| ... | ... | ... | ... |
| London | 12965000 | v2.0 | EIP-1559 |
| Paris (Merge) | TTD | v2.1 | Proof of Stake |
| Shanghai | 1681338455 | v2.2 | Withdrawals |
| Cancun | 1710338135 | v2.3 | Blobs |
| Prague | TBD | v2.4 | EOF, Verkle |
```

## Implementation Changelog

```markdown
# Geth Changelog

## v1.14.0 (2024-04-XX)

### Specification Compliance
- Implements Protocol Spec v2.4.0 (Prague)
- All Prague fixtures passing

### Changes
- feat: EOF implementation per EIP-7692
- feat: Verkle tree support per EIP-6800
- fix: Gas calculation for SPEC-GAS-4.2.3

### Spec References
- SPEC-EOF-1.1: Container validation (#29001)
- SPEC-VERKLE-2.3: State proof generation (#29156)
```

## Best Practices

- Link changelog entries to EIPs and spec sections
- Include activation parameters for each fork
- Document migration requirements
- Track both spec and implementation changelogs
- Provide version compatibility matrix
