---
title: "Article: Logos Execution Zone — Composable Privacy by Default"
tags:
  - artifact
  - article
  - blockchain
  - lez
  - lee
type: article
status: proposed
date: 2026-02-25
---

## Summary

An article explaining what the Logos Execution Zone (LEZ) is, how its dual-state architecture enables protocol-level privacy, and what developers can build on it today. LEZ is a programmable zone on Logos Blockchain where public and private state coexist within the same execution model — developers write normal program logic once, and the protocol handles privacy, verification, and composability. Privacy is powered by the Logos Execution Environment (LEE), which uses the RISC Zero zkVM to generate zero-knowledge proofs for private transactions. As of Feb 2026, LEZ is integrated with Logos Blockchain, has a live block explorer, and supports an AMM, token program, cross-calls, and PDAs.

## Audience

**Primary:** Application developers and ZK engineers evaluating privacy-preserving execution environments; DeFi developers building on or studying private-state chains.
**Secondary:** Protocol researchers interested in dual-state architectures; blockchain-adjacent developers (Rust, zkVM) looking for concrete implementation examples.

## Key Angles

### Architecture
- **Dual-state model:** LEZ maintains two parallel states — a public on-chain mapping (visible and auditable) and a private commitment/nullifier structure (hidden but verifiable). One execution model governs both. Developers don't write separate private vs. public code paths.
- **Protocol-level privacy:** Unlike app-layer privacy (e.g., mixers, shielded pools bolted onto a transparent chain), privacy in LEZ is a first-class protocol property. Developers declare account inputs; the protocol handles the rest.
- **Same bytecode, two execution types:**
  - *Public execution:* on-chain, via RISC Zero VM, no ZK proof required — fast and cheap.
  - *Private execution:* off-chain on the user's device, generating a ZK proof; validators only verify the proof, not re-execute. Computational cost is at the edge, not the chain.
- **Account-based parallelism:** Stateless programs with explicit account declarations enable parallel execution — no hidden dependencies.

### What You Can Build
- **Private payments:** sender/receiver can fully hide balances and identities; sender needn't reveal any information about the receiver.
- **Confidential DeFi:** e.g., an AMM where users trade with private positions while staying fully composable with the public pool state. Private swaps on top of a public AMM — no separate shielded pool needed.
- **Selective disclosure:** users choose privacy level per transaction. Write a program once; run it publicly, privately, or in mixed mode simultaneously. Example: a voting program where you can prove you voted correctly without revealing your identity — and optionally de-shield the transaction later to reveal your vote.

### Current State (Feb 2026)
- **Full Logos Blockchain integration:** LEZ sequencer posts blocks on top of Logos Blockchain; an indexer parses and serves LEZ blocks; block explorer is live.
- **Wallet:** supports public and private native token transfers, public and private custom token transfers, Piñata faucet program, and full privacy-preserving CLI.
- **AMM program:** create pools, add/remove liquidity, execute swaps (fee model TBD).
- **Token program:** create and transfer custom tokens; NFT support; fixed supply at creation (freeze mechanism coming).
- **Cross-calls (tail calls):** programs can invoke other programs mid-execution. Enables composability — e.g., AMM calling token program to settle a swap.
- **PDAs (Program Derived Addresses):** public state support. Enables programs (like the AMM) to hold tokens in protocol-controlled accounts, not individual user accounts.
- **Written tutorials:** full deployment and wallet tutorials in the repo; workshop at Parallel Societies event.

### Q2 Roadmap (Challenges Investigated, Not Yet Shipped)
- **Mid-calls in cross-calls:** enables flash loans and flash swaps. Solution found; implementation queued.
- **Block context:** programs that need to know their execution block range (e.g., voting windows). Solution found; implementation queued.
- **Private account receivability:** currently private accounts can't receive funds directly — requires a new account the receiver claims. A solution via execution continuation is in the works.
- **Shared private accounts:** needed for private AMMs (shared private liquidity pools). Solution being finalized; minimal architecture changes targeted.
- **Decentralized sequencer:** currently centralized; decentralization is on the roadmap but not yet scoped.

## Sources

### Presentations
- Logos Team Update (Episode 2 of 3) — Logos Blockchain & LEZ, Feb 2026 (transcript on file)
  - Moody's LEZ section covers the full architecture, dual-state design, execution types, and live demo of the block explorer

### Code & Docs
- LEZ repo tutorials (deployment and wallet guides — linked from repo README)
- Block explorer: live alongside devnet (URL TBD in brief, confirm with team)
- RISC Zero zkVM: https://risczero.com

### Events
- Parallel Societies workshop — LEZ deployment and wallet workshop (date TBD)

## Notes

- **LEZ vs. LEE:** LEZ (Logos Execution Zone) is the zone itself — the programmable blockchain layer. LEE (Logos Execution Environment) is the underlying execution environment powering the VM. The article should distinguish these cleanly early on; most readers will encounter "LEZ" first.
- The composability angle is the key differentiator from most "private chain" projects: you don't have a separate shielded pool or a parallel private system — it's one execution model, one program, two state types. Lead with that.
- Contrast explicitly with how Ethereum + Tornado Cash / zkSync-style privacy works vs. LEZ's approach — it will resonate with DeFi-native readers.
- The selective disclosure feature (de-shield a vote after the fact, prove participation without revealing identity) is a surprisingly concrete and relatable example for non-technical readers. Consider leading with it.
- The block explorer demo exists but has a small bug (account listings in one view) — confirm it's resolved before citing it in the article.
- Cross-coordinate with the Logos Blockchain article: the SQLite Zone demo and the LEZ article together tell the story of "what zones can be" — one using a custom execution model (SQLite), one using a full zkVM (LEZ). Consider a brief callout.
