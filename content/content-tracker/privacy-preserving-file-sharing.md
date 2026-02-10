---
title: "Article: From Codex to Logos Storage — Building Privacy-Preserving Decentralized File Sharing"
tags:
  - artifact
  - article
  - storage
type: article
status: proposed
date: 2026-02-10
---

## Summary

An article covering the Logos Storage layer (formerly Codex): the rebrand, the current state of the decentralized file-sharing client, and the active research into provider/publisher anonymity using mixnet protocols. Combines a practical developer angle (the C wrapper with upload/download examples) with the deeper privacy research that differentiates Logos Storage from other decentralized storage solutions.

## Audience

**Primary:** Backend/infrastructure developers interested in decentralized storage, privacy engineers, IPFS/Filecoin developers looking at alternatives.
**Secondary:** Application developers who need private file sharing, researchers in anonymous communication systems.

## Key Angles

- The Codex → Logos Storage rebrand: what changed, what stayed, why it matters
- Architecture overview: how Logos Storage fits into the broader Logos stack
- The practical developer experience: libstorage C wrapper, uploading/downloading files, the console app
- Privacy track: provider/publisher anonymity research, echomix pigeonhole storage protocol
- Integrating mixnet protocols into file sharing — what this enables vs. existing solutions (IPFS, Filecoin, Arweave)
- Status integration: how Logos Storage plugs into status-go for community history archives
- Merkle tree spec improvements and what they mean for data integrity
- Evaluating libp2p KAD DHT as a Discv5 replacement

## Sources

### Code & Tools
- Simple C wrapper (easylibstorage) with examples: https://github.com/gmega/easylibstorage
  - File uploader: https://github.com/gmega/easylibstorage/blob/main/examples/uploader.c
  - File downloader: https://github.com/gmega/easylibstorage/blob/main/examples/downloader.c
  - Console app: https://github.com/gmega/easylibstorage/blob/main/examples/storageconsole.c
- Docker rename/rebrand: [logos-storage-nim#1387](https://github.com/logos-storage/logos-storage-nim/pull/1387)
- Codebase rename: [logos-storage-nim#1396](https://github.com/logos-storage/logos-storage-nim/issues/1396)
- Storage UI to QML: [logos-storage-ui#3](https://github.com/logos-co/logos-storage-ui/pull/3)
- Storage module Nix fix (macOS): [logos-storage-module#2](https://github.com/logos-co/logos-storage-module/pull/2)
- Node config example: [node-configs#1](https://github.com/logos-co/node-configs/pull/1)

### Specs
- Merkle tree spec (under review): [rfc-index#281](https://github.com/vacp2p/rfc-index/pull/281)
- Block exchange spec: `rfc-index/docs/storage/raw/codex-block-exchange.md`
- Store spec: `rfc-index/docs/storage/raw/codex-store.md`
- Manifest spec: `rfc-index/docs/storage/raw/manifest.md`
- DHT spec: `rfc-index/docs/storage/raw/dht.md`

### Research
- Echomix protocol exploration (provider/publisher anonymity): https://hackmd.io/@codex-storage/Hyy8v2nrZg (may require access)
- Speeding up RLN proofs (cross-team with AnonComms): https://forum.vac.dev/t/speeding-up-rln-proofs/663
- Mix meeting notes (Notion — internal)

### Integration
- Status-go integration PR: [status-go#7312](https://github.com/status-im/status-go/pull/7312)
- Storage FURPS: `roadmap/content/storage/furps/privacy-preserving-filesharing.md`

## Notes

- The C wrapper examples are the strongest developer hook — concrete, runnable code.
- The privacy angle (mixnet + storage) is genuinely novel in the decentralized storage space. Emphasize this as a differentiator.
- The echomix research may still be early — position it as "active research" rather than shipped capability.
- Consider a comparison section: Logos Storage vs. IPFS vs. Filecoin vs. Arweave on the privacy axis specifically.
- The Status integration story shows real-world usage — messaging history archives backed by decentralized storage.
