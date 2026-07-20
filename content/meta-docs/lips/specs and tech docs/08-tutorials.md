---
tags:
  - sdd
---
> [!NOTE] This document was generated using AI and has yet to be human reviewed
# Tutorials

*Consumer Layer — Hands-on learning experiences for developers*

---

## Definition

Tutorials are step-by-step learning experiences that guide developers through building something concrete. Unlike reference documentation (which you consult) or guides (which you read), tutorials are designed to be *followed*—the reader types commands, writes code, and sees results.

## Relationship to the Specification

Tutorials teach developers to work within the system's specification-defined boundaries by having them *experience* those boundaries firsthand. The specification informs what tutorials can teach and what constraints learners will encounter.

| Specification Context | Tutorial Experience |
|----------------------|---------------------|
| Required authentication flow | "First, let's set up authentication..." |
| Message size limits | "Notice the error—our message was too large. Let's fix it." |
| Required handshake sequence | "The connection won't work until we complete the handshake." |
| Supported data formats | "We'll encode our data as JSON, which the system accepts." |

## Core Components

- **Learning Objectives**: What the reader will know/be able to do after completion
- **Prerequisites**: What knowledge or setup is required before starting
- **Step-by-Step Instructions**: Numbered, concrete actions to take
- **Code Samples**: Complete, working code at each stage
- **Checkpoints**: Ways to verify progress ("You should see...")
- **Explanations**: Context for why each step matters
- **Next Steps**: Where to go after completing the tutorial

## Dependency Chain

```
Specification
    ↓
SDK Guides ← language-specific tools
Developer Guides ← patterns and best practices
    ↓
Tutorials ← hands-on learning using SDKs and patterns
    ↓
Community adoption ← developers who learned via tutorials
```

## Why Spec-Grounding Matters

Tutorials teach by example. If those examples violate or ignore specification constraints, learners develop incorrect mental models:

- **Brittle habits**: Code that works in tutorials but fails in production
- **Misunderstanding**: Learners don't know which behaviors are guaranteed vs. incidental
- **Debugging difficulties**: When things break, learners don't understand the underlying contract
- **Anti-pattern propagation**: Bad examples get copied into real codebases

## Teaching Specification Concepts Through Experience

Good tutorials surface specification constraints naturally:

```markdown
## Step 5: Handling Message Size Limits

Let's try sending a larger message:

    const bigMessage = "x".repeat(100000);  // 100KB
    await client.send(bigMessage);

You should see an error:

    Error: MESSAGE_TOO_LARGE - Payload exceeds 64KB limit (SPEC-3.4.1)

This is expected! The system limits message sizes to ensure reliable 
delivery across all network conditions.

Let's fix this by chunking our message:

    const chunks = chunkMessage(bigMessage, 60000);  // 60KB chunks
    for (const chunk of chunks) {
        await client.send(chunk);
    }
```

This approach teaches the constraint, explains why it exists, and demonstrates the solution.

## Tutorial Design Principles

### 1. Start with Success
Begin with something that works, then introduce complexity:
```markdown
✓ Send a simple message → works!
✓ Send a larger message → error (now we understand the constraint)
✓ Apply chunking → works again!
```

### 2. Fail Intentionally
Show what happens when specification constraints are violated:
```markdown
"Try connecting without authentication. You'll see error AUTH_REQUIRED.
This is the system enforcing SPEC-2.1.1."
```

### 3. Explain the "Why"
Don't just show steps—explain the specification reasoning:
```markdown
"We use Ed25519 signatures because the specification requires them for
message authentication (SPEC-5.1). This ensures messages can't be
tampered with in transit."
```

## Best Practices

- Test tutorials regularly—they rot faster than other documentation
- Include complete, runnable code (not just snippets)
- Design for the specification version being taught
- Explicitly note when tutorial examples differ from production recommendations
- Include "What You Learned" summaries that map back to specification concepts
- Provide troubleshooting for common errors (with specification error code references)
- Update tutorials when specifications change—or clearly version them
