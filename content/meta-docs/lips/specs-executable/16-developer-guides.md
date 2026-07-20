# Developer Guides

*Consumer Layer — Task-oriented guidance for building applications*

---

## Definition

Developer guides provide practical, task-oriented documentation for building applications on the system. They synthesize specification knowledge into actionable guidance.

## Role in the Framework

```
Executable Specification ← defines behavior
API Documentation ← interface details
SDK Guides ← language bindings
    ↓
Developer Guides ← "how to accomplish X"
    ↓
Tutorials ← hands-on learning
```

## Specification-Grounded Guidance

Developer guides explain *why* as well as *how*:

```markdown
## Handling Transaction Confirmations

### The Problem

Transactions aren't instant—they go through stages:
1. Submitted to mempool
2. Included in block
3. Block finalized (irreversible)

### Specification Context

Per SPEC-FINAL-2.1, finality is achieved after 2 epochs (~13 minutes).
Before finality, reorganizations can occur (SPEC-REORG-3.2).

### Recommended Pattern

\`\`\`typescript
async function waitForFinality(txHash: string): Promise<Receipt> {
  // Wait for inclusion (SPEC-TX-4.1)
  const receipt = await provider.waitForTransaction(txHash);
  
  // Wait for finality (SPEC-FINAL-2.1)  
  await provider.waitForBlock(receipt.blockNumber + FINALITY_BLOCKS);
  
  return receipt;
}
\`\`\`

### Why This Matters

Treating unfinalized transactions as complete can lead to:
- Double-spend vulnerabilities
- State inconsistencies
- Failed downstream operations
```

## Best Practices

- Reference specification sections for constraints
- Explain rationale, not just steps
- Distinguish spec requirements from recommendations
- Update when specifications change
- Include "what can go wrong" sections
