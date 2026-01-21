# Tutorials

*Consumer Layer — Hands-on learning experiences*

---

## Definition

Tutorials are step-by-step learning experiences that teach by doing. They guide learners through building something concrete while naturally encountering specification-defined behaviors.

## Role in the Framework

```
SDK Guides ← tools to use
Developer Guides ← patterns to follow
    ↓
Tutorials ← learn by building
    ↓
Developers who understand spec constraints
```

## Teaching Specification Through Experience

Tutorials surface specification constraints naturally:

```markdown
## Step 5: Sending Your First Transaction

Let's send a transaction:

\`\`\`javascript
const tx = await wallet.sendTransaction({
  to: recipient,
  value: ethers.parseEther("1.0")
});
console.log("Submitted:", tx.hash);
\`\`\`

**What's happening?**

The transaction is now in the mempool waiting for inclusion.
Per the protocol specification (SPEC-TX-4.1), your transaction 
will be:
1. Validated by nodes
2. Included in a block by a proposer
3. Executed, changing state

Let's wait for confirmation:

\`\`\`javascript
const receipt = await tx.wait();
console.log("Confirmed in block:", receipt.blockNumber);
\`\`\`

**Important**: This confirmation is NOT final! Per SPEC-FINAL-2.1,
true finality takes ~13 minutes. For high-value transactions,
wait longer:

\`\`\`javascript
await tx.wait(64); // Wait 64 confirmations for finality
\`\`\`
```

## Best Practices

- Let learners encounter spec constraints naturally
- Explain the "why" when constraints appear
- Include spec references for deeper learning
- Test tutorials against current spec version
- Update when specifications change
