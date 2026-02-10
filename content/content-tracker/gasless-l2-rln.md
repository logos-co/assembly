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
---

## Summary

An article explaining how Rate Limiting Nullifiers (RLN) enable gasless L2 transactions — removing the need for users to hold native tokens to interact with the network. Covers the ZK proof mechanism, the multi-prover architecture, and the deny-list/decentralized-slashing model. Timed to the AnonComms team hitting their milestone and completing the whitepaper draft.

## Audience

**Primary:** ZK/cryptography engineers and L2 developers interested in novel fee models and spam prevention.
**Secondary:** DApp developers looking for gasless UX patterns, DeFi researchers studying economic models.

## Key Angles

- The problem: gas fees as a UX barrier and how RLN offers an alternative
- How RLN proofs work — membership sets, nullifiers, rate limiting via ZK
- Multi-burn RLN: burning multiple IDs in a single proof for higher throughput
- The gasless L2 architecture: prover modules, shared databases, aggregator nodes
- Deny list abstraction and decentralized slashing model
- RLN membership allocation service — decoupling payment from registration
- Practical integration path for developers

## Sources

### Specs & Code
- RLN v1 spec: `rfc-index/docs/ift-ts/raw/32/rln-v1.md`
- RLN v2 spec: `rfc-index/docs/ift-ts/raw/rln-v2.md`
- Multi-message-ID burn RLN spec: `rfc-index/docs/ift-ts/raw/multi-message_id-burn-rln.md`
- ZeroKit API spec: `rfc-index/docs/ift-ts/raw/zerokit-api.md`
- RLN prover shared DB PR (milestone achieved): [status-network-monorepo#127](https://github.com/status-im/status-network-monorepo/pull/127)
- Multi-burn draft implementation: [zerokit#375](https://github.com/vacp2p/zerokit/pull/375)
- RLN aggregator node: [status-network-monorepo#139](https://github.com/status-im/status-network-monorepo/pull/139)
- Gasless L2 RFC PR: [rfc-index#286](https://github.com/vacp2p/rfc-index/pull/286)

### Research & Writing
- Gasless L2 whitepaper (Overleaf — internal): https://www.overleaf.com/project/692fda5d2d807ddc704fd353
- Speeding up RLN proofs forum post: https://forum.vac.dev/t/speeding-up-rln-proofs/663
- Concurrent proof generation optimization: [nim-libp2p#2069](https://github.com/vacp2p/nim-libp2p/pull/2069)

### Context
- AnonComms FURPS — RLN: `roadmap/content/anoncomms/furps/rln.md`
- AnonComms FURPS — ZeroKit RLN: `roadmap/content/anoncomms/furps/zerokit-rln.md`
- AnonComms milestone (delivered): https://github.com/logos-co/anoncomms-pm/milestone/4

## Notes

- The whitepaper is the strongest source — the article should distill its core contribution for a broader developer audience.
- Include a diagram showing the prover → aggregator → L2 flow.
- The multi-burn feature is still in progress but worth previewing as it unlocks higher throughput.
- LEZ (Logos Execution Environment) interaction with time-based conditions for payment streams is an open research question worth flagging.
