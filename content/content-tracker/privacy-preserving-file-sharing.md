---
title: "Article: From Codex to Logos Storage — Building Privacy-Preserving Decentralized File Sharing"
tags:
  - artifact
  - article
  - storage
type: article
status: proposed
date: 2026-02-10
updated: 2026-02-17
---

## Summary

An article covering the Logos Storage layer (formerly Codex): the rebrand, the current state of the decentralized file-sharing client, and the active research into provider/publisher anonymity using mixnet protocols. Combines a practical developer angle (C wrapper examples, new C bindings in the Storage Module) with the deeper privacy research that differentiates Logos Storage from other decentralized storage solutions. Privacy analysis of file-sharing components is now **complete and under review**.

## Audience

**Primary:** Backend/infrastructure developers interested in decentralized storage, privacy engineers, IPFS/Filecoin developers looking at alternatives.
**Secondary:** Application developers who need private file sharing, researchers in anonymous communication systems.

## Key Angles

- The Codex → Logos Storage rebrand: what changed, what stayed, why it matters
- Architecture overview: how Logos Storage fits into the broader Logos stack
- The practical developer experience: libstorage C wrapper, C bindings APIs in the Storage Module, uploading/downloading files
- **Privacy analysis complete**: file-sharing components and privacy requirements analyzed, document under review
- **Anonymous download via mix protocol**: initial approach being drafted — integrating mixnet into file retrieval
- **Discv5 → libp2p Kademlia DHT**: investigation complete, replacement initiated. Trade-offs: losing UDP support and SPR provider records
- Partial Groth16 proof generation for RLN integrated into zerokit (cross-team with AnonComms)
- Status integration: ArchiveService refactored with new hierarchy (ArchiveManager, technology-specific backends)
- Block exchange protocol improvements: codex proof support in serialization, BDP-based adaptive pipelining
- Merkle tree spec improvements

## Sources

### Code & Tools
- Simple C wrapper (easylibstorage) with examples: https://github.com/gmega/easylibstorage
  - File uploader: https://github.com/gmega/easylibstorage/blob/main/examples/uploader.c
  - File downloader: https://github.com/gmega/easylibstorage/blob/main/examples/downloader.c
  - Console app: https://github.com/gmega/easylibstorage/blob/main/examples/storageconsole.c
- **C bindings APIs in Storage Module** (NEW): [logos-storage-module#7](https://github.com/logos-co/logos-storage-module/pull/7)
- Docker rename/rebrand: [logos-storage-nim#1387](https://github.com/logos-storage/logos-storage-nim/pull/1387)
- Codebase rename: [logos-storage-nim#1396](https://github.com/logos-storage/logos-storage-nim/issues/1396)
- Storage UI to QML: [logos-storage-ui#3](https://github.com/logos-co/logos-storage-ui/pull/3)
- Storage module Nix fix (macOS): [logos-storage-module#2](https://github.com/logos-co/logos-storage-module/pull/2)

### Specs
- Merkle tree spec (under review): [rfc-index#281](https://github.com/vacp2p/rfc-index/pull/281)
- Block exchange spec: `rfc-index/docs/storage/raw/codex-block-exchange.md`
- Store spec: `rfc-index/docs/storage/raw/codex-store.md`
- Manifest spec: `rfc-index/docs/storage/raw/manifest.md`
- DHT spec: `rfc-index/docs/storage/raw/dht.md`

### Research & Privacy (UPDATED)
- **Privacy analysis of file-sharing components** (complete, under review): [logos-storage-research#209](https://github.com/logos-storage/logos-storage-research/pull/209), tracking issue [#206](https://github.com/logos-storage/logos-storage-research/issues/206)
- Echomix protocol exploration (provider/publisher anonymity): https://hackmd.io/@codex-storage/Hyy8v2nrZg (may require access)
- **Anonymous download approach using mix protocol**: being drafted (cross-team with AnonComms)
- Partial Groth16 proof generation for RLN: [zerokit#373](https://github.com/vacp2p/zerokit/pull/373)
- Speeding up RLN proofs: https://forum.vac.dev/t/speeding-up-rln-proofs/663
- Mix meeting notes (Notion — internal)

### Infrastructure Changes (NEW)
- **Discv5 → libp2p Kademlia DHT replacement**: [logos-storage-nim#1368](https://github.com/logos-storage/logos-storage-nim/issues/1368) — investigation complete, replacement initiated
- Node shutdown fixes: [logos-storage-nim#1400](https://github.com/logos-storage/logos-storage-nim/pull/1400), [nim-datastore#83](https://github.com/logos-storage/nim-datastore/pull/83)
- Removed callbacks from synchronous libstorage calls: [logos-storage-nim#1401](https://github.com/logos-storage/logos-storage-nim/pull/1401)

### Integration
- Status-go ArchiveService refactor: [status-go#7312](https://github.com/status-im/status-go/pull/7312)
- Full LogosStorage integration branch: [status-go#7201](https://github.com/status-im/status-go/pull/7201)
- Storage FURPS: `roadmap/content/storage/furps/privacy-preserving-filesharing.md`

## Related
- [[browser-privacy-stage0|Stage 0: Your Browser Has Already Betrayed You]] — establishes the browser-level privacy problems that storage anonymity must also address
- [[blockchain_privacy_leaks|Blockchain Privacy Leaks]] — full-stack privacy context

## Notes

- The completed privacy analysis document is a key new source — reference it prominently.
- The anonymous download via mix protocol is genuinely novel — even if early, position it as active R&D with a clear direction.
- The discv5 → KAD DHT decision has real trade-offs (losing UDP, SPR challenges) — be honest about them. Shows mature engineering judgment.
- C bindings in the Storage Module mean developers can integrate Logos Storage into C/C++ applications — stronger practical hook than just the standalone wrapper.
- The Status integration shows real production demand for decentralized storage — messaging history archives.
- Consider a comparison section: Logos Storage vs. IPFS vs. Filecoin vs. Arweave specifically on the privacy axis.
