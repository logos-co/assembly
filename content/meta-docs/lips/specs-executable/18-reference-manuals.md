# Reference Manuals

*Consumer Layer — Comprehensive lookup with spec traceability*

---

## Definition

Reference manuals provide complete, detailed information for lookup. Every behavior, parameter, and error code is documented with specification traceability.

## Role in the Framework

```
Executable Specification ← authoritative behavior
Protocol Documentation ← wire formats
Data Schemas ← type definitions
    ↓
Reference Manuals ← comprehensive lookup
```

## Specification-Traced Reference Entries

Every entry traces to specification:

```markdown
## eth_call

Execute a call without creating a transaction.

**Specification**: SPEC-API-3.4.1

### Parameters

| Name | Type | Spec | Description |
|------|------|------|-------------|
| transaction | Object | SPEC-API-3.4.1.1 | Call parameters |
| block | BlockParam | SPEC-API-3.4.1.2 | State to query |

### Behavior

Per SPEC-API-3.4.1.3:
- Executes against specified block state
- Does not modify state
- Returns execution result or reverts

### Errors

| Code | Spec | Description |
|------|------|-------------|
| -32000 | SPEC-ERR-1.1 | Execution reverted |
| -32602 | SPEC-ERR-1.2 | Invalid params |

### Example

[Complete working example]
```

## Best Practices

- Include spec references for every behavior
- Generate from executable spec where possible
- Provide comprehensive error documentation
- Keep synchronized with specification versions
- Support multiple navigation paths (by topic, alphabetical)
