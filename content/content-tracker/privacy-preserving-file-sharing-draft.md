---
title: "Introducing Logos Storage: Decentralized Storage for the Logos Tech Stack"
tags:
  - draft
  - storage
  - article
type: draft
status: draft
date: 2026-02-23
---

# Introducing Logos Storage: Decentralized Storage for the Logos Tech Stack

In ["Understanding the Logos Tech Stack"](https://press.logos.co) we described Logos as an operating system — a kernel, a networking layer, and modules that together provide the infrastructure for self-sovereign applications. In ["Building on Logos Core"](https://press.logos.co) we showed how those modules are built, packaged, and distributed.

This article goes deep on one of the three foundational modules: **Logos Storage** — the decentralized storage and data persistence layer for the Logos tech stack. What it is, what it's designed to do, how it fits into the broader architecture, and what you can use today.

---

## Why Decentralized Storage

Every meaningful application needs to store data. Today, that overwhelmingly means centralized cloud providers — AWS, Google Cloud, Azure. The trade-off is familiar: convenience in exchange for control. Your data lives on someone else's servers, subject to their terms of service, their jurisdictional obligations, and their business model.

Decentralized storage projects — IPFS, Filecoin, Arweave — address the control problem. They distribute data across a network of independent nodes, remove single points of failure, and make censorship harder. This is real progress.

But they introduce a new problem: **privacy**. Decentralized storage as it exists today is transparent by default. IPFS broadcasts who is storing what and who is requesting what. Filecoin's on-chain deals are public records. The network layer leaks metadata that centralized providers at least have the option of shielding behind access controls.

Decentralized storage without privacy is surveillance infrastructure with extra steps.

Logos Storage — formerly known as Codex — is built on a different premise. Privacy is not a feature to be added later; it is a design constraint that shapes the protocol from the ground up.

---

## What Logos Storage Is

Logos Storage is a peer-to-peer storage protocol designed to provide durable, censorship-resistant data persistence with built-in privacy guarantees. It serves as the storage layer for the Logos tech stack, handling everything from application asset delivery to long-term data archival.

At its core, the system is built on **content-addressed blocks**. When you store a file, it is split into fixed-size blocks, erasure-coded for redundancy, organized into a Merkle tree for integrity verification, and distributed across storage providers. Retrieval reverses the process: request blocks by their content identifiers (CIDs), verify them against the Merkle root, reconstruct the original file.

This architecture serves three primary functions within the Logos ecosystem:

1. **Module storage and delivery.** Logos Core modules — the building blocks described in the modular architecture article — need to be stored, versioned, and distributed. Logos Storage provides the decentralized backend for this.
2. **Application data persistence.** Any application built on Logos — a chat client archiving message history, a DeFi app storing state, a web application serving assets — uses Logos Storage as its data layer.
3. **General-purpose file storage.** Store a file, get back a CID. Provide a CID, get back the file. The simplest use case, and the one available in testnet v0.1 today.

---

## The Architecture

Logos Storage is designed around six core subsystems. Together they form a complete storage protocol that handles data from the moment it enters the network to long-term persistence, verification, and retrieval.

### Erasure Coding and Data Redundancy

Durability starts with redundancy. Logos Storage uses **Reed-Solomon erasure coding** — the same family of error-correcting codes used in RAID arrays and deep-space communication — to ensure that data survives node failures.

When a file enters the system, it is split into fixed-size blocks and organized into **slots**. Each slot is then erasure-coded: the original data blocks become the systematic portion, and additional parity blocks are generated so that the full data can be reconstructed from any sufficient subset of blocks. The redundancy level is configurable — higher redundancy means more storage overhead but greater durability.

The target is **99.99% data availability** — meaning that even with significant node churn and failures across the network, your data is retrievable.

All blocks are organized into a **Merkle tree**, where each leaf is a block and the root hash serves as the content identifier for the complete dataset. This structure enables efficient integrity verification: a client downloading a single block can verify it against the Merkle root without downloading the entire dataset. A **manifest** accompanies each dataset, containing the Merkle root, block layout, erasure coding parameters, and metadata needed for retrieval.

### Storage Proofs

How do you know a storage provider is actually storing your data? You can't check directly — the whole point of decentralized storage is that you don't need to trust individual providers. Instead, the protocol verifies storage cryptographically.

Logos Storage uses **zero-knowledge proofs of retrievability** — specifically, **Groth16 proofs** — to verify that providers hold the data they claim to hold. The process works like this:

1. The protocol issues a **random challenge** to a storage provider.
2. The provider must generate a proof that demonstrates possession of specific blocks without revealing the blocks themselves.
3. The proof is verified on-chain. If the provider fails to respond or produces an invalid proof, the protocol triggers penalties.

This is not a simple "ping the node and see if it responds" check. The zero-knowledge property means the verification is cryptographically sound — a provider cannot fake the proof without actually possessing the data. Proof scheduling is **stochastic**, meaning providers cannot predict when they will be challenged, preventing them from discarding data between checks.

### The Marketplace

Storage costs resources. Providers need hardware, bandwidth, and uptime. Logos Storage aligns incentives through a **marketplace** — a decentralized economic system where storage capacity is traded between providers and clients.

The marketplace operates through the Logos blockchain:

- **Storage requests.** A client posts a request specifying the data size, desired duration, number of storage slots, and the payment offered.
- **Slot reservation.** Storage providers browse open requests and reserve slots they can fulfill. Reservation requires posting **collateral** — a stake that can be slashed if the provider fails to meet their obligations.
- **Proof-based verification.** Throughout the storage period, providers must submit storage proofs on schedule. Missed proofs trigger slashing conditions against the provider's collateral.
- **Repair and reallocation.** When a provider fails, the protocol triggers **data repair** — remaining providers reconstruct the lost blocks using erasure coding and redistribute them to new providers. This happens automatically.

The marketplace is not active in testnet v0.1 — the initial release focuses on the file-sharing protocol itself. But the marketplace is central to how Logos Storage achieves durable, long-term storage in an adversarial environment. Without economic incentives, you're relying on altruism; with them, the network's durability guarantees are backed by skin in the game.

### Content Discovery

Storing data is only useful if you can find it again. Logos Storage uses a **Kademlia Distributed Hash Table (DHT)** for content discovery — the same class of DHT used by IPFS, BitTorrent, and other large-scale decentralized systems.

The DHT maps content identifiers (CIDs) to the providers storing them. When a client wants to retrieve a file, they query the DHT with the CID and receive a list of providers who hold the relevant blocks. The Kademlia topology provides **logarithmic routing** — in a network of N nodes, any content can be located in O(log N) hops.

Provider records in the DHT advertise storage availability — which CIDs a provider holds, how to connect to them, and their current capacity. The DHT also handles peer discovery, allowing new nodes to find and join the network without centralized bootstrap servers.

### Data Repair

Nodes go offline. Hardware fails. Providers disappear. In a decentralized network, this is not an exception — it's the norm. Logos Storage handles this through **automated data repair**.

The repair system monitors the network's redundancy levels continuously:

1. **Failure detection.** When a storage provider misses proof deadlines, the protocol marks them as failed.
2. **Redundancy assessment.** The system checks whether the remaining providers hold enough blocks to reconstruct the full dataset using erasure coding.
3. **Lazy repair.** Rather than immediately reconstructing all lost data, the protocol uses a lazy repair mechanism — it triggers reconstruction only when redundancy falls below a configured threshold. This minimizes unnecessary bandwidth usage.
4. **Slot reallocation.** Reconstructed blocks are assigned to new providers who post collateral and begin submitting their own storage proofs.

The result is a self-healing storage network. Data durability is maintained not through manual intervention but through protocol-enforced repair triggered by cryptographic verification.

### Privacy

This is where Logos Storage diverges most sharply from existing decentralized storage systems.

Standard decentralized file sharing leaks metadata at every stage:

**Discovery.** To find which peers hold a file, you query the DHT. The DHT now knows what you're looking for. In a sufficiently observed network, the pattern of queries is equivalent to a download log.

**Transfer.** When you download blocks from a storage provider, the provider knows your IP address, which CIDs you requested, and the timing of your requests. Even with transport encryption, the traffic pattern is distinctive.

**Publishing.** When you upload a file, the storage providers know who stored it. If the content is later deemed sensitive, you are identifiable as the source.

Logos Storage is designed to address all three leakage points:

- **Anonymous retrieval.** File requests are routed through the Logos **mix-net** — the same anonymous communication layer that protects messaging traffic across the Logos stack. Rather than connecting directly to a storage provider, requests are wrapped in layers of encryption and forwarded through a sequence of mix nodes. This is not onion routing; mix networks add cover traffic and timing delays to defeat traffic analysis even against adversaries observing the network's edges. A [draft approach for anonymous downloads](https://hackmd.io/@codex-storage/rkCIGuuw-g) has been published and is being developed in collaboration with the AnonComms team.
- **Anonymous publishing.** Hidden services over the mix protocol will allow storage providers to serve files without revealing their network identity. This is the next research target after anonymous downloads.
- **Query privacy.** DHT queries are being designed to protect query content and source identity, preventing the discovery layer from becoming a surveillance tool.
- **Encrypted metadata.** Manifests and metadata are encrypted, so storage providers hold blocks without knowing what the content is or who it belongs to.

A [comprehensive privacy analysis](https://github.com/logos-storage/logos-storage-research/pull/209) of Logos Storage's file-sharing components has been completed and is under review. This analysis maps every component of the file-sharing pipeline to its privacy requirements — identifying exactly where metadata leaks, what the threat model looks like, and what mitigations are needed.

Privacy is not a future feature. It is the architectural constraint that drives every design decision.

---

## How It Fits Into the Logos Stack

Logos Storage doesn't exist in isolation. It's one layer in a stack designed to work together.

Recall the Logos architecture: a **microkernel** at the base, a **networking layer** (with mix-net privacy) above it, **modules** providing capabilities, and **applications** on top. Logos Storage is a module — specifically, one of the three foundational modules alongside Messaging and Blockchain.

This integration matters in several concrete ways:

**The module system.** Logos Storage runs as a Logos Core module (`logos-storage-module`). It loads through LibLogos, communicates with other modules through the kernel's IPC layer, and follows the same build-package-distribute pipeline described in the modular architecture article. Developers interact with it through the standard `logos.storage.<method>` API pattern, the same convention used for every other module.

**The networking layer.** Storage traffic flows through the Logos networking stack, which means it benefits from the mix-net's privacy guarantees. File retrieval can be routed through mix nodes; capability discovery lets storage nodes find each other without centralized infrastructure.

**The blockchain.** The storage marketplace operates through the Logos blockchain. Storage contracts, proof verification, collateral management, and payment settlement all happen on-chain. This is where Logos Storage's economic security comes from — providers post collateral enforced by consensus.

**Applications.** At the top of the stack, applications compose these modules. The simple filesharing app in testnet v0.1 uses the storage module directly. The Status messaging app uses Logos Storage for community message history archives. Future applications will use it for asset hosting, data persistence, module distribution, and more.

---

## What You Can Use Today

Testnet v0.1 is where Logos Storage becomes tangible. The focus of the initial testnet is testing backends — not polished UX, but working infrastructure.

### The Simple Filesharing App

The Logos App includes a **simple filesharing application** that demonstrates the storage module:

- **Store a file** — select a file, upload it to the network, receive a CID.
- **Retrieve a file** — enter a CID, download the file.

This is the basic content-addressed storage loop. It works today.

### The Storage Module API

Developers can test the storage module directly through its API. The module runs as a Logos Core module, loadable through LibLogos in either UI or headless mode. Headless mode is suitable for server deployments, CLI tools, and automated pipelines.

For C and C++ developers, [easylibstorage](https://github.com/gmega/easylibstorage) provides a lightweight wrapper with examples for uploading, downloading, and interacting with the storage API. The [storage module](https://github.com/logos-co/logos-storage-module) itself provides C bindings for integration into any application running on LibLogos Core.

### The Storage Node

The Logos Node — the headless runtime — can load and start a storage node alongside blockchain and messaging nodes. This is the infrastructure mode: run a node, contribute storage to the network, and test the protocol in a real decentralized environment.

### What's Not Yet Available

The **marketplace** is not active in testnet v0.1. The v0.3.0 release deliberately removed marketplace components to focus on getting the file-sharing protocol right first. Storage proofs, collateral, and the economic system are planned for subsequent testnet releases.

**Privacy features** — anonymous downloads via the mix-net, anonymous publishing through hidden services — are in active research with published drafts, but are not yet integrated into the testnet. [Rate-Limiting Nullifiers (RLN)](https://forum.vac.dev/t/speeding-up-rln-proofs/663), the zero-knowledge system that will prevent spam in anonymous retrieval, is being developed in collaboration with the AnonComms team and is a cross-cutting effort shared with the messaging and blockchain layers.

---

## What Comes Next

Logos Storage is being built from the inside out — the core file-sharing protocol first, then the economic layer, then privacy integration.

The near-term roadmap:

- **Marketplace activation.** Storage proofs, collateral management, and the economic incentive system will be introduced in subsequent testnet versions. This is what turns file sharing into durable, verifiable storage.
- **Privacy integration.** The anonymous download approach using the mix protocol has a published draft. Hidden services for anonymous publishing are next. The completed privacy analysis provides a concrete map of what needs to be built and where.
- **Deeper ecosystem integration.** The package manager will use Logos Storage as its backend for module distribution. Application data persistence patterns will mature. The storage module's integration with the blockchain for marketplace operations will come online.

The goal is a storage layer where you can store data with cryptographic durability guarantees, retrieve it without revealing who you are, and pay for it through a decentralized marketplace — all running on infrastructure you control, as part of a stack designed for sovereignty from the ground up.

---

## Sources

### Code & Tools
- Logos Storage codebase: https://github.com/logos-storage/logos-storage-nim
- easylibstorage (C wrapper): https://github.com/gmega/easylibstorage
- Storage Module (Logos Core integration): https://github.com/logos-co/logos-storage-module
- Storage Module tutorial: [logos-storage-module#9](https://github.com/logos-co/logos-storage-module/pull/9)

### Specs
- Merkle tree: [rfc-index#281](https://github.com/vacp2p/rfc-index/pull/281)
- Block exchange, store, manifest, DHT specs: [rfc-index](https://github.com/vacp2p/rfc-index)

### Research & Privacy
- Privacy analysis: [logos-storage-research#209](https://github.com/logos-storage/logos-storage-research/pull/209), tracking [#206](https://github.com/logos-storage/logos-storage-research/issues/206)
- Anonymous download draft: https://hackmd.io/@codex-storage/rkCIGuuw-g
- Echomix protocol: https://hackmd.io/@codex-storage/Hyy8v2nrZg
- RLN proof performance: https://forum.vac.dev/t/speeding-up-rln-proofs/663

### Context
- "Understanding the Logos Tech Stack: An Operating System for Sovereignty" — [press.logos.co](https://press.logos.co)
- "Building on Logos Core: The Modular Architecture and Package Manager" — [press.logos.co](https://press.logos.co)
- Testnet v0.1 scope: [Logos roadmap](https://github.com/logos-co/roadmap)
