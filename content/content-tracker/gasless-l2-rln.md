---
title: "Article: Gasless L2 Transactions via RLN — A Zero-Knowledge Approach"
tags:
  - artifact
  - article
  - anoncomms
  - zk
type: article
status: proposed
date: 2026-02-10
updated: 2026-02-17
---

## Summary

An article explaining how Rate Limiting Nullifiers (RLN) enable gasless L2 transactions — removing the need for users to hold native tokens to interact with the network. Covers the ZK proof mechanism, the multi-prover architecture, and the deny-list/decentralized-slashing model. The RLN prover milestone is complete, the whitepaper is delivered, and the multi-message-id feature is now **fully implemented across all modules**.

## Audience

**Primary:** ZK/cryptography engineers and L2 developers interested in novel fee models and spam prevention.
**Secondary:** DApp developers looking for gasless UX patterns, DeFi researchers studying economic models.

## Key Angles

- The problem: gas fees as a UX barrier and how RLN offers an alternative
- How RLN proofs work — membership sets, nullifiers, rate limiting via ZK
- **Multi-burn RLN: now complete** — burning multiple IDs in a single proof for higher throughput, implemented across all modules, examples, and documentation
- The gasless L2 architecture: prover modules, shared databases, aggregator nodes
- Deny list abstraction and decentralized slashing model (aggregator + slashing node code in progress)
- **RLN membership allocation service going public** — repo prepared at [logos-lez-rln](https://github.com/logos-co/logos-lez-rln), decoupling payment from registration
- Batch Groth16 proving (~2.5x speedup) from storage/AnonComms collaboration on partial proof generation
- Practical integration path for developers

## Sources

### Specs & Code
- RLN v1 spec: `rfc-index/docs/ift-ts/raw/32/rln-v1.md`
- RLN v2 spec: `rfc-index/docs/ift-ts/raw/rln-v2.md`
- Multi-message-ID burn RLN spec: `rfc-index/docs/ift-ts/raw/multi-message_id-burn-rln.md`
- ZeroKit API spec: `rfc-index/docs/ift-ts/raw/zerokit-api.md`
- RLN prover shared DB PR (milestone achieved): [status-network-monorepo#127](https://github.com/status-im/status-network-monorepo/pull/127)
- **Multi-burn complete implementation** (all modules, examples, docs): [zerokit#375](https://github.com/vacp2p/zerokit/pull/375)
- RLN aggregator node + slashing node: [status-network-monorepo#139](https://github.com/status-im/status-network-monorepo/pull/139)
- Gasless L2 RFC PR: [rfc-index#286](https://github.com/vacp2p/rfc-index/pull/286)
- **RLN membership allocation** (public repo): [logos-lez-rln](https://github.com/logos-co/logos-lez-rln) — reworked auth between registry, merkle tree, and tokens

### Research & Writing
- Gasless L2 whitepaper (Overleaf — internal): https://www.overleaf.com/project/692fda5d2d807ddc704fd353
- Speeding up RLN proofs forum post: https://forum.vac.dev/t/speeding-up-rln-proofs/663
- Partial Groth16 proof generation for RLN: [zerokit#373](https://github.com/vacp2p/zerokit/pull/373) (storage team collaboration)
- Concurrent proof generation optimization: [nim-libp2p#2069](https://github.com/vacp2p/nim-libp2p/pull/2069)

### Context
- AnonComms FURPS — RLN: `roadmap/content/anoncomms/furps/rln.md`
- AnonComms FURPS — ZeroKit RLN: `roadmap/content/anoncomms/furps/zerokit-rln.md`
- AnonComms milestone (delivered): https://github.com/logos-co/anoncomms-pm/milestone/4
- New milestone: [Extend gasless L2 with multi-burn RLN and decentralized slashing](https://github.com/logos-co/anoncomms-pm/milestone/8)

## Notes

- Multi-burn is now shipped, not preview — update tone accordingly.
- The membership allocation service going public is a developer-facing milestone worth highlighting.
- Batch Groth16 proving (~2.5x speedup) from the storage team's collaboration shows cross-team synergy — good narrative.
- LEZ interaction with time-based conditions for payment streams is an open research question — AnonComms is currently going through LEZ tutorial and writing up timestamp/block context exposure analysis.
- Slashing node + aggregator node still in progress — frame as the enforcement layer being built.
