---
title: "Article: Introducing Logos Storage — Decentralized Storage for the Logos Tech Stack"
tags:
  - artifact
  - article
  - storage
type: article
status: first-draft
date: 2026-02-10
updated: 2026-02-23
---

## Summary

The first in-depth introduction to Logos Storage — the decentralized storage layer of the Logos tech stack. This article establishes what Logos Storage is, why it exists, how it fits into the broader Logos ecosystem (as introduced in the "Logos as Operating System" and "Modular Architecture" articles), and what it's designed to accomplish. It draws on the project's original SRS to frame the full vision — erasure-coded data persistence with storage proofs, a marketplace for storage providers, content discovery, and privacy as a foundational design constraint — while grounding readers in what's concretely available today in testnet v0.1: a simple filesharing app and a storage module API.

Formerly known as Codex (mentioned briefly, not dwelled on). The rebrand narrative and detailed technical updates (DHT migration, block exchange refactoring, Status integration, etc.) are reserved for a future technical update article.

## Audience

**Primary:** Developers and infrastructure engineers interested in understanding what Logos Storage is and how it fits into the Logos ecosystem. Readers of the prior "Logos as Operating System" and "Modular Architecture" articles who want to go deeper on the storage layer.
**Secondary:** Privacy engineers, IPFS/Filecoin developers looking at alternatives, anyone evaluating decentralized storage solutions.

## Key Angles

### What Logos Storage Is
- The decentralized storage and data persistence layer for the Logos tech stack
- Formerly known as Codex (brief mention — not a narrative focus)
- A peer-to-peer file-sharing system built on content-addressed blocks
- Designed as one of the three foundational Logos modules (alongside Messaging and Blockchain)

### The Full Vision (from the SRS)
- **Erasure coding and data redundancy:** Files split into blocks, erasure-coded (Reed-Solomon), organized into Merkle trees, distributed across storage providers. Targets 99.99% data durability.
- **Storage proofs:** Zero-knowledge proof-of-retrievability so the network can verify providers are actually storing data. Uses Groth16 proof generation.
- **Marketplace:** Economic system where storage providers post collateral, clients post storage requests, and the protocol enforces durability through slashing conditions and repair mechanisms.
- **Content discovery:** Kademlia DHT for CID-based lookups and provider discovery.
- **Data repair:** Lazy repair mechanisms triggered when storage proofs fail — automatic data reconstruction and slot reallocation to maintain redundancy.
- **Privacy as a design constraint:** Not an afterthought. Anonymous content retrieval, query privacy, encrypted metadata, plausible deniability — designed into the protocol from the start.

### How It Fits Into the Logos Stack
- References the layered architecture from "Logos as Operating System": kernel → networking → modules → dapps
- Storage is one of the three default modules shipped with Logos
- Integrates through the Logos Core module system (as described in the "Modular Architecture" article)
- Available as a Logos Core module (`logos-storage-module`) with C bindings, headless mode, and developer tutorials
- Interacts with the networking layer's mix-net for privacy, and with the blockchain layer for marketplace operations

### What's Available Today (Testnet v0.1)
- **Simple Filesharing App** in the Logos App: store a file, enter a CID and get it back
- **Storage module API** for developers to test against
- **Storage Node** loadable through Logos Core (headless or with UI)
- The marketplace is not yet in testnet v0.1 (v0.3.0 removed marketplace to focus on filesharing first)
- Privacy features (anonymous downloads via mixnet, anonymous publishing) are in active research

### What Differentiates Logos Storage
- Privacy-first design — most decentralized storage projects leak metadata at discovery, transfer, and publishing stages
- Integration with the Logos mixnet for anonymous file retrieval (in research)
- Storage proofs via ZK rather than simple replication checks
- Native integration with the Logos ecosystem (module system, blockchain marketplace, mix-net privacy)
- Not a standalone product — designed as infrastructure for the Logos parallel society

## Article Structure (Proposed)

1. **Introduction** — What Logos Storage is and where it sits in the stack. Brief mention of formerly being called Codex. Reference to prior articles for ecosystem context.
2. **The Problem** — Why decentralized storage matters. What centralized alternatives get wrong. What existing decentralized storage (IPFS, Filecoin, Arweave) gets right but also where they fall short on privacy.
3. **The Design** — Core architecture: content-addressed blocks, erasure coding, Merkle trees, storage proofs, marketplace, content discovery, data repair. Frame the full vision.
4. **Privacy by Design** — The privacy dimension that distinguishes Logos Storage. Discovery, transfer, and publishing metadata leaks. How the protocol addresses each.
5. **Where It Stands Today** — Testnet v0.1 scope: what you can do right now. The storage module, the filesharing app, the developer API.
6. **What Comes Next** — Marketplace activation, privacy features moving from research to implementation, deeper ecosystem integration.

## Sources

### Core Reference
- Logos Storage SRS (internal): `/Documents/logos-wiki-markdown/markdown-output/decentralised-tech-stack/logos-codex-srs.md`
- Testnet v0.1 scope: `roadmap/content/testnets/v01.md`

### Prior Articles in Series
- "Understanding the Logos Tech Stack: An Operating System for Sovereignty" — establishes the layered architecture
- "Building on Logos Core: The Modular Architecture and Package Manager" — explains how modules work

### Code & Tools
- Logos Storage codebase: https://github.com/logos-storage/logos-storage-nim
- Simple C wrapper (easylibstorage): https://github.com/gmega/easylibstorage
- Storage Module (Logos Core integration): https://github.com/logos-co/logos-storage-module
- Storage Module tutorial: [logos-storage-module#9](https://github.com/logos-co/logos-storage-module/pull/9)

### Specs
- Merkle tree spec: [rfc-index#281](https://github.com/vacp2p/rfc-index/pull/281)
- Block exchange, store, manifest, DHT specs: [rfc-index](https://github.com/vacp2p/rfc-index)

### Research & Privacy
- Privacy analysis of file-sharing components: [logos-storage-research#209](https://github.com/logos-storage/logos-storage-research/pull/209)
- Anonymous download approach (mix protocol): https://hackmd.io/@codex-storage/rkCIGuuw-g
- Echomix protocol (provider/publisher anonymity): https://hackmd.io/@codex-storage/Hyy8v2nrZg

## Related
- [[logos-as-operating-system-draft|Understanding the Logos Tech Stack: An Operating System for Sovereignty]] — prerequisite context
- [[logos-core-modular-architecture-draft|Building on Logos Core: The Modular Architecture and Package Manager]] — how modules work
- [[browser-privacy-stage0|Stage 0: Your Browser Has Already Betrayed You]] — browser-level privacy context
- [[blockchain_privacy_leaks|Blockchain Privacy Leaks]] — full-stack privacy context

## Notes

- This is now framed as the **introductory article** for Logos Storage, not a technical update.
- Detailed engineering updates (DHT migration, block exchange refactoring, Status integration, Storage Module headless improvements) should be saved for a **separate technical update article** later.
- The SRS provides excellent framing for the full vision. Use it to paint the complete picture while being honest about what's implemented vs. what's planned.
- Keep the Codex mention brief — "formerly known as Codex" — no need to explain the rebrand rationale.
- Readers should come away understanding: (1) what Logos Storage will be, (2) how it fits into Logos, (3) what they can try today, (4) what's coming.
