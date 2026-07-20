---
title: "Logos Litepaper — Draft v0.2"
description: "Merged litepaper draft incorporating Artem's technical content with thesis-driven structure from research report. Technical claims reviewed against normative sources."
tags:
  - logos
  - litepaper
  - draft
  - whitepaper
created: 2026-04-15
updated: 2026-04-15
status: draft
owner: corey-petty
version: "0.2-merged"
---

<!-- ============================================================
     EDITORIAL NOTES FOR REVIEWERS

     This is DRAFT v0.2 — a merge of:
     (a) Our research-report-driven scaffold (v0.1)
     (b) Artem's technical draft (Logos Litepaper .pdf)
     (c) Technical corrections from normative sources (team
         all-hands transcripts, specs, roadmap)

     KEY CHANGES FROM ARTEM'S DRAFT:
     - Added thesis, problem, positioning, ecosystem, roadmap
       sections per research report structure
     - CORRECTED: Data Availability removed as shipping feature
       (dropped from mainnet scope per Feb 2026 all-hands)
     - CORRECTED: "WASM-class environments" → RISC Zero zkVM
       (actual LEZ implementation)
     - CORRECTED: "LEE" reference removed (undefined in all sources)
     - ADDED: Cryptarchia specifics (note-based commitments,
       one-time leader keys, honest-majority model, no slashing)
     - ADDED: Blend circuit architecture details
     - ADDED: Messaging section (was empty placeholder)
     - ADDED: Storage section (was empty placeholder)
     - INTEGRATED: LSSA framework, sovereign rollups/zones
       distinction, user modules, Logos UI concepts from Artem

     Sources: Farewell to Westphalia, whitepaper research report,
     team presentations (Feb 2026), Cryptarchia spec, Codex WP,
     Waku IEEE paper, press.logos.co articles, roadmap.logos.co

     Target: 20-25 pages typeset.
     ============================================================ -->


---

> *"We have nothing to lose but the tyranny of centralised governance,
> its corruption and all of its barbed wire fences."*
>
> — Jarrad Hope & Peter Ludlow, *Farewell to Westphalia* (2025)

<!-- [EDITORIAL NOTE: Alternate epigraph candidates:
     - Timothy May, "A specter is haunting the modern world..."
       (Crypto Anarchist Manifesto, 1988)
     - Eric Hughes, "Privacy is necessary for an open society
       in the electronic age." (Cypherpunk's Manifesto, 1993)
     - Leibniz on divisible sovereignty (echoes FtW's argument
       that sovereignty is a multi-variable relation, not a
       Hobbesian monopoly)
     Decision needed: cypherpunk lineage vs. the project's own
     philosophical voice. The FtW quote roots it in Logos's
     intellectual tradition. ] -->

---

# Logos

**The private-by-default technology stack built to revitalise civil society**

Version 0.2 — Draft
[Date TBD]

Contributors: [Authorship model TBD]
Institute of Free Technology

---

## Table of Contents

1. The Thesis
2. The Problem
3. The Logos Stack: Architecture Overview
   - 3.1 Logos Core
   - 3.2 Logos Chain
   - 3.3 Execution Layer: Sovereign Rollups and Zones
   - 3.4 Logos Messaging
   - 3.5 Logos Storage
   - 3.6 Privacy and Network Primitives
   - 3.7 Logos UI
4. User Modules and Extensibility
5. Design Principles
6. Potential Applications
7. The Ecosystem
8. Positioning in the Lineage
9. Roadmap and Current Status
10. Economic Design Overview
11. What Comes Next

---

## 1. The Thesis

<!-- TARGET: 2-3 pages. Manifesto register — declarative, compressed,
     historically grounded. No hedging. -->

Sovereign nation states are human technologies. They were designed to solve a specific problem — containing the religious and ideological wars that tore through post-Reformation Europe — and formalized in the Peace of Westphalia in 1648. For nearly four centuries, territorial sovereignty has been the dominant organizing principle of human governance. Like all technologies of that era, it is not the optimal solution available today.

The Westphalian settlement was an achievement. It ended the Thirty Years' War. It established principles of territorial integrity and non-interference that, at their best, provided frameworks for coexistence between peoples with irreconcilable values. But the model carries structural failures that no amount of reform can address: it kettles people of conflicting values within artificial borders and forces them to fight over who controls the levers of power. It concentrates authority into single points of capture — and those points attract corruption with mathematical predictability. It draws lines on maps and then enforces those lines with violence.

The nation state is not destiny. It is an invention. And it is showing its age.

Adding more layers of centralised governance on top — the UN, the EU, international courts — merely reproduces the same structural problems at a higher level. The real dividing line in political organization is not socialist versus capitalist but centralizer versus decentralizer. What matters is whether authority flows to a central point of control or is distributed across a community that retains the capacity for self-governance.

The cypherpunk movement recognized this decades ago. Eric Hughes declared that privacy is necessary for an open society. Timothy May warned that cryptographic tools would alter the nature of government regulation. The Bitcoin whitepaper demonstrated that peer-to-peer value transfer could function without trusted intermediaries. Ethereum extended that vision to programmable agreements.

But the promise remains unfulfilled. Fifteen years after Bitcoin's genesis block, the infrastructure that was supposed to resist capture is being captured. Ethereum validators comply with OFAC sanctions. Block builders centralize into oligopolies — a single entity constructs nearly half of all Ethereum blocks. Decentralized applications store their data on Amazon Web Services. Users coordinate through platforms that surveil every message. The technology changed; the dependency on coercible infrastructure did not.

**Sovereignty requires a complete technology stack — not a single chain, but the full substrate of digital life: communication, coordination, and memory.** Each layer must be designed so that no operator, no validator, no service provider can be individually targeted, coerced, or shut down without compromising the integrity of the network as a whole.

This is the insight that separates Logos from its predecessors: **a blockchain alone cannot deliver sovereignty.** A blockchain with private messaging cannot deliver sovereignty. Only a complete stack — consensus, communication, and storage — engineered from the ground up with privacy as a protocol-level guarantee, can provide the infrastructure on which self-governing communities can actually be built.

Logos is that stack. Three protocol layers — blockchain for coordination, messaging for communication, storage for memory — composed into a unified system where privacy is not an application-layer feature but a structural property of the network itself.

The thesis is simple, and it is old: **people who cannot communicate freely, coordinate without permission, and preserve their knowledge against censorship cannot govern themselves.** The technology to make this possible now exists. What remains is to build it correctly — with the right architecture, the right threat model, and the right values embedded at the protocol level.

This litepaper describes that architecture.

<!-- [EDITORIAL NOTE: Review pass needed:
     1. Does the register match FtW's intellectual tone without
        being derivative?
     2. The "centralizer vs decentralizer" framing is directly
        from FtW — decide whether to cite explicitly
     3. Verify current MEV-Boost builder concentration stats
     4. OPEN QUESTION: explicit FtW citation or independent voice?
        Options: (a) footnote, (b) inline reference, (c) keep
        independent. ] -->


---

## 2. The Problem

<!-- TARGET: 2-3 pages. Precision diagnosis — specific failure modes,
     real-world examples, numbered enumeration. -->

Existing blockchain infrastructure suffers from three structural vulnerabilities. Each represents a point where the promise of decentralization collapses under real-world adversarial pressure.

### Failure Mode 1: Consensus Leader Exposure

In every major proof-of-stake protocol, the set of validators is public. Leader schedules are deterministic or predictable. This means that any state actor, regulator, or sufficiently motivated adversary can identify exactly who is producing the next block — and apply pressure accordingly.

This is not theoretical. Following the Tornado Cash sanctions in August 2022, MEV-Boost relays began filtering transactions to comply with OFAC requirements. At peak, over 70% of Ethereum blocks were OFAC-compliant — not because the protocol required it, but because relay operators and block builders chose compliance over the risk of enforcement. The protocol's transparency made this choice trivially easy: every participant is identified, every action is attributable.

The fundamental issue is architectural: **public validator sets are coercion surfaces**. Any protocol that exposes who produces blocks, when they produce them, and what transactions they include is a protocol that can be censored at the infrastructure layer. Adding mixers or privacy tools at the application layer does not solve the problem — it merely moves the coercion target from the validator to the mixer operator, as Tornado Cash demonstrated.

<!-- [NEEDS INPUT: Updated OFAC compliance rate for Ethereum
     blocks as of 2026. The 70% figure is from 2022 peak.
     Also verify: is Titan still building ~50% of blocks? ] -->

### Failure Mode 2: Communication Surveillance

No major blockchain provides censorship-resistant messaging at the protocol level. Users coordinate through centralized platforms — Discord, Telegram, Twitter — where every message is surveilled, accounts can be suspended, and entire servers can be removed.

The consequences extend beyond convenience. When infrastructure operators must coordinate through surveilled channels, their communications become an attack surface. Validator coordination, governance discussions, and incident response all flow through platforms with terms of service that can change without notice and with law enforcement access that is routine rather than exceptional.

The gap is not accidental. Messaging is hard — the combination of privacy, reliability, spam resistance, and decentralization involves fundamental engineering tradeoffs that most protocol teams have chosen not to address. The result is a paradox: networks designed to resist censorship rely on censorable communication channels for their own operation.

<!-- [EDITORIAL NOTE: Consider adding a specific incident —
     e.g., Discord server bans affecting crypto project
     coordination, Telegram channel restrictions. ] -->

### Failure Mode 3: Storage Centralization

Decentralized applications overwhelmingly depend on centralized storage infrastructure. Front-ends are hosted on AWS or Vercel. NFT metadata lives on centralized servers or IPFS gateways operated by a small number of companies. Critical application data has single points of failure.

When Cloudflare or AWS experiences an outage, swaths of "decentralized" applications go offline. When IPFS gateway operators receive takedown requests, content becomes inaccessible. The blockchain itself may be censorship-resistant, but the data that applications need to function sits behind infrastructure that is not.

Existing decentralized storage solutions address part of the problem but introduce their own limitations. Filecoin optimizes for raw storage capacity with high hardware requirements. Arweave provides permanence but at the cost of flexibility. Neither integrates privacy-preserving retrieval into the protocol itself — who accesses what data remains observable.

### The Structural Diagnosis

These three failure modes share a common root: **existing blockchain infrastructure was designed for transparency, not for resistance to coercion**. Transparency was the original innovation — Bitcoin proved that a public ledger could replace trusted intermediaries. But transparency and resistance to capture are not the same thing. A transparent system is one where anyone can verify. A sovereign system is one where no one can coerce.

Building sovereign infrastructure requires addressing all three vulnerabilities simultaneously. A private blockchain with public messaging is still censorable through its communication channels. Private messaging with centralized storage is still censorable through its data layer. Only a complete stack — consensus, communication, and storage — with privacy guarantees at every layer provides genuine resistance to infrastructure capture.


---

## 3. The Logos Stack: Architecture Overview

<!-- TARGET: 6-8 pages. Technical core. This is the longest section
     and the heart of the litepaper. -->

Logos is a modular technology stack composed of three protocol layers — **Blockchain**, **Messaging**, and **Storage** — unified by a microkernel runtime and connected through privacy-preserving network primitives. Together, they provide the three capabilities that self-governing communities cannot outsource:

| Layer | Capability | Key Innovation |
|-------|-----------|----------------|
| **Logos Chain** | Coordination & settlement | Private Proof of Stake — anonymous block proposers via Cryptarchia + Blend mix network |
| **Logos Messaging** | Communication | Privacy-preserving P2P messaging with Rate-Limit Nullifiers for spam resistance |
| **Logos Storage** | Persistent memory | Decentralized file sharing with privacy-preserving retrieval circuits |

<!-- [DIAGRAM: Hero architecture diagram. Artem's title-page diagram
     is a good starting point — shows the layered stack:
     Dapps → λ Logos [Storage | Messaging | Blockchain (Execution Zone,
     DA & Consensus)] → Discovery/Peering/Mix-net → Logos Kernel.

     CORRECTION NEEDED in diagram: "Data Availability and Consensus"
     should be "Consensus and Block Propagation" — DA was dropped
     from mainnet scope. Or keep DA if the team has re-scoped it
     since Feb 2026.

     Also add: User Modules layer should be more prominent since
     it's a key architectural concept from Artem's draft. ] -->


### 3.1 Logos Core

Logos Core is the execution, composition, and node runtime of the Logos stack. It defines how applications execute, how nodes participate in the network, and how protocol primitives are exposed to developers. Its design ensures that applications inherit the security, privacy, and decentralisation properties of the underlying stack without relying on bespoke infrastructure or trusted intermediaries.

**Design goals:**

- **Minimal trusted surface** — a small, auditable kernel responsible only for functions critical to safety and liveness: consensus participation, block verification, peer discovery, and message routing. All other functionality is implemented outside the kernel.
- **Deterministic execution** — identical outcomes across heterogeneous nodes, with a strict separation between protocol logic and application logic.
- **Composable primitives** — applications are assembled from reusable modules exposing protocol-level capabilities: messaging, coordination, storage, identity and access control, governance, and payment or settlement interfaces.
- **Infrastructure independence** — no reliance on centralised gateways, cloud-only services, or trusted intermediaries. A Logos Core node can run on commodity hardware, including Raspberry Pis.

**Architecture.** Logos Core is structured around a minimal kernel and pluggable runtime modules. The kernel manages secure isolation and lifecycle control for execution runtimes. All other functionality — application logic, UI, extended protocol features — is implemented as modules outside the kernel, keeping the trusted computing base as small and auditable as possible.

**Operational role.** A Logos Core node may simultaneously secure the network, host application logic and state, and serve application interfaces. This collapses the traditional separation between node operation, backend services, and application execution into a single, verifiable runtime environment.

Regardless of deployment model, all applications share the same execution semantics and security guarantees.


### 3.2 Logos Chain

Logos Chain is the base blockchain layer of the Logos stack. It provides consensus, block propagation, and settlement with **privacy and censorship resistance enforced at both the protocol and network layers**.

#### Cryptarchia Consensus

Consensus in Logos Chain is provided by **Cryptarchia**, a Proof-of-Stake protocol built around private leader election.

Where Bitcoin uses a hash lottery to select block producers (proof of work), Cryptarchia uses a **private stake lottery**. Stakers hold note-based commitments — analogous to Bitcoin's UTXO model — and prove their right to produce a block using zero-knowledge proofs, without revealing their identity, their stake amount, or their position in the validator set. Proposer selection remains stake-weighted but unpredictable, preventing adversaries from pre-identifying or targeting future block producers.

**One-time leader keys** ensure that even after a block is produced and propagated, observers cannot correlate multiple blocks to the same producer by analyzing key reuse patterns.

This design allows validators to participate without operating under long-lived, publicly linkable roles, while preserving economic security and liveness under adversarial conditions.

**Security model.** Cryptarchia operates under an honest-majority assumption — security holds as long as the majority of stake is honest. This is closer to Bitcoin's security model than to BFT protocols, which typically assume at most one-third faulty participants. The tradeoff: probabilistic finality (~18 hours, comparable to Bitcoin's convention of waiting for confirmations) rather than the instant finality of BFT. The benefit: a more permissive participation model.

**No minimum stake. No slashing.** If your node goes down, you miss block rewards — but you lose nothing. This is a deliberate design choice, not a limitation. Slashing creates a coercion surface: an adversary who can identify a staker can threaten to trigger slashing conditions through targeted attacks. By eliminating slashing, Cryptarchia removes this leverage entirely. The worst-case outcome for any participant is opportunity cost — never loss of principal.

<!-- [EDITORIAL NOTE: The "~18 hours" probabilistic finality
     figure comes from team presentations. Verify this is
     still the current estimate. Also: the security threshold
     is "slightly below 51%" due to double-proposal attacks —
     include this nuance or keep it for the whitepaper? ] -->

#### Blend: Private Block Propagation

Anonymous leader election alone is insufficient. If block proposals are broadcast from identifiable network addresses, an observer can triangulate producers through traffic analysis — even if the ZK proof reveals nothing about the proposer's identity.

Block and vote propagation in Logos Chain is handled by **Blend**, a privacy-preserving dissemination layer integrated into the consensus process. Blend routes all block proposals through encrypted, multi-hop circuit paths, introducing indirection between block creation and reception. By obscuring network-level metadata during proposal and propagation, Blend prevents observers from reliably linking finalized blocks to their proposers, even in the presence of global network monitoring.

The combination — ZK-proven leader election plus mix-network proposal routing — makes Logos the first proof-of-stake protocol where block producers are **anonymous** (not merely pseudonymous) even under network-level surveillance.

**Rate-limiting via Proof of Quota (PoQ).** Access to the Blend network is governed by zero-knowledge proofs of message budget. Each leader key index is usable once; reuse generates a duplicate nullifier, and Blend drops the message. This prevents abuse of the anonymization layer without requiring identity revelation or banning.

<!-- [TECHNICAL NOTE: DA section from Artem's draft removed.
     Per Feb 2026 all-hands: Data Availability was explicitly
     dropped from mainnet roadmap. Research continues post-mainnet.
     If DA has been re-scoped since then, this section should be
     revisited.

     If DA is re-included, Artem's framing was good: "verifiable
     data availability as a first-class protocol service... block
     data is encoded and distributed such that nodes can verify
     availability through sampling, without requiring full
     replication." ] -->


### 3.3 Execution Layer: Sovereign Rollups and Zones

Logos Chain does not execute smart contracts at the base layer. Instead, it provides a settlement surface for multiple, independent execution environments that operate over the chain's shared security and ordering guarantees.

This layer is structured around **sovereign rollups**, **zones**, and the **Logos State Separation Architecture (LSSA)**.

#### Sovereign rollups and zones

**Sovereign rollups** are autonomous execution environments that define their own state transition logic, execution rules, and upgrade paths. They rely on Logos Chain for ordering, but not for validity enforcement. This decouples execution from consensus, allowing rollups to evolve independently while inheriting base-layer guarantees.

**Zones** are long-lived sovereign execution domains intended for persistent applications, communities, or systems. A zone may host one or more applications and define its own execution environment and policy boundaries. Zones are not shards of a global state machine; they are independent execution contexts that coexist over shared infrastructure.

Zones post their state commitments to the blockchain via hash-ordered **Channels**. The contents of Channel inscriptions are opaque binary blobs to the base layer — Logos Chain cannot inspect, censor, or reorder transactions based on content.

This design prevents the MEV (Maximal Extractable Value) centralization that plagues systems with base-layer execution. Because Logos Chain performs zero content inspection, there is no transaction content to extract value from at the settlement layer.

#### Logos State Separation Architecture (LSSA)

Execution within rollups and zones follows the **LSSA**, which separates system state into **public state** and **private state**.

**Public state** is represented as a conventional key-value map of public accounts. State transitions are deterministic and fully visible.

**Private state** is represented indirectly, through cryptographic commitments and nullifiers, with private account contents remaining hidden. Correctness of private execution is enforced using zero-knowledge proofs, which attest to valid state transitions without revealing underlying data.

LSSA supports:
- Public-to-public execution
- Private-to-private execution
- Explicit public-private and private-public bridging flows

These flows allow value and state to move between public and private domains while preserving correctness, authorization, and balance constraints.

#### The Logos Execution Zone (LEZ)

The **Logos Execution Zone** is the first zone built on Logos Chain — a privacy-preserving smart contract platform using the **RISC Zero zkVM**. LEZ demonstrates the LSSA framework in practice:

- **Public execution** runs on-chain using the RISC Zero VM — no ZK proof needed
- **Private execution** runs off-chain on the user's device, with a ZK proof generated locally and submitted for on-chain verification

Programs are stateless — no internal state; data is stored in accounts with explicit input declarations. The same bytecode runs in both public and private contexts, meaning developers write applications without worrying about the privacy boundary. The protocol handles privacy and verification.

Applications live on LEZ today include token programs (create and transfer custom tokens), an AMM (create pools, add/remove liquidity, swaps), and account management with both public and private native token transfers.

<!-- [EDITORIAL NOTE: The LSSA framework and sovereign rollups/zones
     distinction from Artem's draft is valuable and well-articulated.
     Preserved largely intact. The LEZ description was corrected:
     Artem's draft referenced "WASM-class environments" but the
     actual implementation uses RISC Zero zkVM per team presentations.
     Verify with blockchain team whether WASM is a planned future
     target or whether this was an error. ] -->

#### Coordination and composition

Execution environments do not implicitly share state. Coordination between rollups and zones occurs through explicit mechanisms such as messaging and verifiable data publication, rather than through a shared global state. This preserves sovereignty and privacy while allowing composition where explicitly desired.

**The execution layer guarantees that:**
- Private state is never made globally readable
- Public effects are explicitly declared and verifiable
- Execution environments remain isolated unless they opt into coordination


### 3.4 Logos Messaging

<!-- TARGET: ~1.5 pages -->

Logos Messaging provides the communication layer of the sovereign stack — privacy-preserving, censorship-resistant channels that operate at the protocol level rather than as application-layer add-ons.

The system descends from Ethereum's original Whisper protocol — the messaging layer that Gavin Wood envisioned as part of the "Holy Trinity" (consensus, messaging, storage) but which was never completed. Logos Messaging realizes that vision with modern cryptographic tools.

#### Logos Delivery

**Logos Delivery** is the transport layer — a decentralized peer-to-peer messaging network that handles peer discovery, protocol selection, topic management, and message routing internally. It provides a developer-facing interface that abstracts the complexity of decentralized messaging: connect to the network, send messages to topics, subscribe to topics.

Nodes operate in two modes:
- **Core** (desktop, full participation) — relays traffic and provides storage
- **Edge** (mobile, lightweight) — minimal resource footprint for constrained devices

#### Rate-Limit Nullifiers (RLN)

Every decentralized messaging system faces the spam problem: without a central authority to ban abusers, how do you prevent flooding?

**RLN** solves this using zero-knowledge proofs. Each participant proves membership in the network and proves they have not exceeded their message budget — without revealing who they are. If a participant exceeds their rate limit, the proof system generates a duplicate nullifier that causes the message to be dropped. No banning, no identity revelation — cryptographic enforcement of fair usage. RLN membership is allocated through the Logos Execution Zone, creating a natural integration point between the messaging and execution layers.

#### Logos Chat

**Logos Chat** builds on top of Delivery to provide secure conversations:
- **1:1 messaging** — end-to-end encrypted using the Double Ratchet protocol (forward secrecy) and Extended Triple Diffie-Hellman (post-compromise security)
- **Group chat** — via Distributed Messaging Layer Security (DMLS), in development
- **Post-quantum encryption** — on the roadmap
- **Store protocol** — enables offline message retrieval; nodes persist and replay historical messages, enabling asynchronous communication without centralized servers

<!-- [NEEDS INPUT: Current throughput numbers for Logos Delivery.
     Network size metrics. Any published benchmarks. ] -->


### 3.5 Logos Storage

<!-- TARGET: ~1 page -->

Logos Storage provides the memory layer of the sovereign stack — the ability to store, retrieve, and share data without relying on centralized infrastructure.

**How it works.** A user publishes a file, receiving a Content ID (CID). The network's distributed hash table (DHT) locates nodes closest to that CID and publishes a provider list. Downloaders query the DHT, discover providers, and connect directly for transfer. Replication is organic — peers who download content become providers.

**Performance.** The current implementation achieves transfer rates exceeding 100 MB/s (a 20x improvement over predecessor systems), supports petabyte-scale file sizes, and handles swarms of hundreds of peers.

**Privacy-preserving retrieval** is the key architectural innovation. File sharing systems leak information at every step: who published what, who downloaded what, which IP addresses accessed which content. Logos Storage addresses this through a circuit-based architecture:

- **Entry points** — the publisher creates a circuit and publishes the entry point as the provider, hiding the publisher's identity
- **Exit points** — the downloader creates a separate circuit
- **Rendezvous nodes** — a meeting point where entry and exit circuits exchange data without either party knowing the other's identity

This architecture ensures that no single node in the network can link a file's publisher to its consumers.

**Serving frontends.** A critical application of Logos Storage is serving application front-ends without centralized hosting. When front-ends are stored and retrieved through Logos Storage, applications can function entirely on sovereign infrastructure — no AWS, no CDN, no centralized gateway required.

**Toward incentivized durability.** Organic replication provides no persistence guarantees — if no one cares about a file, it disappears. The longer-term roadmap includes incentivized durable persistence: users can instruct the network to replicate and store data, compensating providers and penalizing non-compliance with cryptographic verification. Fully anonymous incentivized storage remains an active area of research.

<!-- [NEEDS INPUT: Relationship to prior Codex work. How much of
     the DDE (Decentralized Durability Engine) framework applies?
     Naming/framing alignment with storage team needed. ] -->


### 3.6 Privacy and Network Primitives

The three protocol layers share a common foundation of privacy-preserving network infrastructure:

**Blend mix network** — circuit-based anonymous routing used by Logos Chain for block propagation (described in 3.2) and available as infrastructure for cross-layer anonymous communication.

**nim-libp2p** — the networking substrate providing peer discovery, transport protocols, and pubsub. Used by Delivery, Storage, and Blockchain. Logos's implementation includes enhancements for mix protocol integration and capability discovery.

**zerokit** — a zero-knowledge cryptography library (Rust) providing the proof infrastructure for Cryptarchia's leader election, RLN spam protection, Proof of Quota for Blend access, and LSSA's private state verification.

These primitives are shared across all three layers, ensuring consistent privacy guarantees and avoiding the fragmentation that results from each layer implementing its own anonymization.


### 3.7 Logos UI

Logos UI is the user-facing interface layer of the Logos stack. It defines how users discover, access, and interact with sovereign applications running on Logos Core, without relying on trusted gateways, custodial wallets, or centralised frontends.

Logos UI is not a single application. It is a standard interaction surface and reference interface for Logos-native applications.

**Design goals:**
- **Gateway minimisation** — no dependence on centralised RPCs, CDNs, or app stores
- **Local-first interaction** — users interact through their own node or a user-selected peer
- **Privacy-preserving access** — no global accounts or publicly linkable identities required
- **Composable user experience** — multiple applications and modules coexist within a unified interface

**Architecture.** Logos UI sits directly on top of Logos Core and interacts with the stack through verifiable, local interfaces. It communicates with the local runtime or an explicitly chosen peer, rather than implicit third-party infrastructure. Application frontends are discovered and retrieved through Logos-native messaging and storage primitives.

The UI operates as a thin client over verifiable execution. It does not execute application logic — it reflects state and interaction surfaces defined by applications running within Logos Core.

**Interaction model.** Interaction is governed by capability-based permissions rather than global identities. Applications request only the permissions required for a given interaction, and users explicitly grant or deny those capabilities. Applications cannot silently escalate permissions. Interaction does not imply persistent or globally linkable identity.

**Deployment.** Logos UI can be deployed as a local desktop or mobile application, or served through decentralized storage and accessed via a minimal web interface backed by a user-controlled node. In all cases, users interact with applications through verifiable infrastructure under their control.

**Logos Basecamp** is the reference implementation — a user-facing application shipping with Logos Core and a curated set of default modules (accounts, wallet, chat, blockchain node management, storage, package manager). Additional modules can be discovered and installed through the built-in package manager. Basecamp alpha v0.1.3 is live.


---

## 4. User Modules and Extensibility

<!-- TARGET: 1-1.5 pages. From Artem's draft — well-articulated. -->

The Logos stack is designed so that applications are **composed rather than monolithic**. Developers build sovereign applications by assembling modular components that run on top of Logos Core and the execution layer, inheriting privacy, availability, and censorship-resistance guarantees by default.

These components, referred to as **user modules**, define application logic, state, and interfaces in a way that remains independent of any single frontend or deployment. Modules may operate over public state, private state, or both, following the Logos State Separation Architecture, and can be combined to form higher-level systems such as social platforms, identity frameworks, payment networks, and governance mechanisms.

### Modular application model

A user module is a self-contained unit of execution. It defines its own state model, exposes explicit interfaces, and declares the permissions it requires. Modules execute within the Logos Core runtime and can be deployed, upgraded, or replaced without coordinated changes to the underlying protocol or other applications.

Applications evolve incrementally — by composing additional modules rather than redeploying entire systems.

### Composition and reuse

Logos does not impose a fixed application framework. Developers compose functionality explicitly from reusable modules, selecting only the primitives required for a given application.

Common module categories include:
- Identity and access control
- Social and coordination primitives
- Payment and settlement logic
- Governance and upgrade mechanisms

Different applications may combine these modules in different ways, without relying on shared global state or implicit trust assumptions.

### Extensibility and sovereignty

Modules are sovereign by design. Each module defines its own execution logic, state visibility, and upgrade rules. There is no global registry or approval process for deploying new modules, and no requirement that modules conform to a single governance or identity model.

Extensibility is therefore permissionless, while composition remains explicit and auditable.

### Inter-module interaction

Modules do not implicitly read or write each other's state. Interaction occurs through explicit mechanisms such as message passing or verifiable data publication, with dependencies and permissions declared upfront.

**At the module level, Logos guarantees that:**
- State access is explicit and scoped
- Privacy boundaries are preserved unless intentionally bridged
- Modules cannot silently depend on or interfere with one another

User modules are the mechanism by which Logos scales its ecosystem: not by standardising applications, but by standardising **how applications are composed**.


---

## 5. Design Principles

<!-- TARGET: 1 page. -->

Every technical decision in the Logos stack is constrained by a set of core principles. These are not aspirations — they are architectural requirements that shape what gets built and what gets rejected.

**Privacy by default.** Users should not need to opt into privacy. The base layer protects participant identity as a protocol guarantee. Cryptarchia does not offer an "anonymous mode" — all block production is anonymous. There is no way to produce a block that reveals your identity, even voluntarily, at the consensus level.

**Political neutrality.** The protocol serves communities with irreconcilable values without privileging any of them. Infrastructure cannot have opinions. Logos Chain performs zero execution at the base layer — it cannot censor transactions based on content because it cannot inspect content.

**Resistance to coercion.** The system remains operational even when individual operators are compromised, coerced, or shut down. No slashing means a compromised validator's worst-case outcome is missing block rewards. This eliminates the leverage that slashing-based systems give to coercive actors.

**Modularity.** No component assumes the presence of any other. Each layer is independently useful and independently replaceable. A future consensus mechanism could replace Cryptarchia without requiring changes to Messaging or Storage.

**Minimal trust assumptions.** Prefer cryptographic guarantees over economic incentives. Prefer economic incentives over social coordination. Prefer social coordination over institutional trust. RLN spam protection uses zero-knowledge proofs rather than reputation systems — a new participant has the same protection as a long-standing one.

**Minimal resource requirements.** The stack runs on commodity hardware. Testnet nodes operate on Raspberry Pis. This is a sovereignty guarantee: if running a node requires expensive infrastructure, participation concentrates among those who can afford it.


---

## 6. Potential Applications

<!-- TARGET: 1 page. Application categories from Artem's draft,
     expanded with concrete framing. -->

Logos provides the infrastructure for a new class of privacy-first applications. The combination of private execution (LSSA), censorship-resistant messaging, and decentralized storage enables systems that cannot be built on transparent-by-default chains.

### Private Financial Infrastructure

- **Darkpool DEXs** with encrypted order flow and verifiable settlement — trading without front-running or surveillance
- **Private lending and real-world assets** — confidential positions with auditable proofs for compliance where needed
- **Payment rails** with selective disclosure — users choose what to reveal, to whom, and when

### Private Coordination

- **Governance systems** with verifiable voting outcomes but private individual votes — enabling honest participation without social pressure or retaliation
- **Private messaging** with censorship-proof delivery and metadata obfuscation — communication that cannot be surveilled or disrupted
- **Group coordination** for DAOs, unions, and campaigns where privacy is not a feature but a survival requirement

### Private Data and Compute

- **Agent marketplaces** that handle data, compute, and liquidity with full privacy — enabling AI agents to operate over sensitive data without exposing it
- **Collaborative analytics** for multi-party computation workflows using private datasets
- **Confidential compute services** that enable verifiable computation without revealing inputs

### Censorship-Resistant Frontends

Logos Storage enables application frontends to be served entirely through decentralized infrastructure. Combined with Logos UI's local-first interaction model, this eliminates the last centralization chokepoint: the web server hosting the application interface.

<!-- [EDITORIAL NOTE: Artem noted "borrow from EcoDev deck or
     IR pitch deck" — review those for additional use cases
     that demonstrate market demand to investors. ] -->


---

## 7. The Ecosystem

<!-- TARGET: 2 pages. Evidence of execution capability. -->

Logos is developed within the **Institute of Free Technology (IFT)** — a fully distributed organization of 220+ contributors building public goods for digital sovereignty. IFT provides the organizational substrate; the work is the evidence.

### Shipped products

The IFT ecosystem has delivered production systems that collectively demonstrate the engineering capability behind Logos:

**Status** — a blockchain-native messaging application with millions of users. Status is the original application that drove the development of the messaging stack that became Logos Messaging. It provides real-world validation of the protocols at scale.

**Nimbus** — an Ethereum consensus client implemented in Nim, designed for resource-restricted environments. Nimbus runs on devices from Raspberry Pis to cloud servers, demonstrating protocol engineering competence and the team's commitment to low hardware requirements.

**Keycard** — an open-source hardware security module for cryptocurrency key management. Demonstrates the ability to ship physical products and manage the full stack from silicon to software.

**Vac** — a research organization producing peer-reviewed academic work, including the Waku IEEE paper (2022). Vac provides the formal research foundation for Logos's protocol designs.

### Development activity

<!-- [NEEDS INPUT: Current GitHub statistics across logos-co,
     vacp2p, status-im organizations. Active contributors,
     total repos, recent commit activity. ] -->

### Testnet status

Logos testnet v0.1 launched in February 2026 with all three protocol layers integrated:

- Cryptarchia consensus with anonymous block production via Blend
- Logos Execution Zone with token programs, AMM, and account management
- Ephemeral 1:1 encrypted chat via Logos Chat
- Decentralized file sharing via Logos Storage
- Nodes running on commodity hardware (Raspberry Pis)
- Seven productive devnets completed; the longest ran continuously for four days


---

## 8. Positioning in the Lineage

<!-- TARGET: 1-2 pages. -->

Logos builds on — and diverges from — the work of every major protocol project that came before it.

### Bitcoin

Logos shares Bitcoin's security model (honest-majority assumption), its UTXO-like state representation (note-based commitments in Cryptarchia), and its cypherpunk ethos. Bitcoin proved that a decentralized network could resist capture for over fifteen years.

**What Bitcoin got right:** Minimal design. Resistance to capture through simplicity.
**Where Logos diverges:** Bitcoin's transparency is a feature for money but a vulnerability for infrastructure. Logos extends the vision beyond money into complete sovereign infrastructure while making block producers anonymous rather than pseudonymous.

### Ethereum

Ethereum proved that programmable agreements could function on a decentralized network. But Ethereum's design made a fundamental tradeoff: transparency over privacy. Public validator sets, deterministic leader schedules, and MEV extraction have created centralization pressures that undermine the original promise.

**What Ethereum got right:** Programmability. Composability. Ecosystem scale.
**Where Logos diverges:** Logos addresses the structural vulnerability that allows validators to be coerced — not by adding privacy at the application layer, but by making anonymity a protocol-level guarantee.

### Filecoin / Arweave

Both projects advanced decentralized storage. Filecoin optimizes for raw capacity with proof-of-replication; Arweave pursues permanence through an economic endowment.

**What they got right:** Proving that decentralized storage markets can function.
**Where Logos diverges:** Logos Storage prioritizes tunable durability over raw capacity, with lower hardware requirements and privacy-preserving retrieval circuits that ensure storage providers cannot surveil access patterns.

### Urbit

Urbit is the closest philosophical sibling — both projects pursue digital sovereignty as a first principle and envision a complete stack.

**What Urbit got right:** The full-stack thesis. The insistence that sovereignty requires owning every layer.
**Where Logos diverges:** Architecture. Logos is modular and open-protocol; Urbit is monolithic with its own language, VM, and networking stack built from scratch. Logos builds on battle-tested foundations (libp2p, established cryptographic research). Logos has zero stake requirements for participation; Urbit's address space is a fixed-supply scarce resource.


---

## 9. Roadmap and Current Status

<!-- TARGET: 1-2 pages. -->

### What exists today (Q1 2026)

- **Cryptarchia consensus** — implemented and running on testnet with anonymous block production via Blend
- **Logos Execution Zone** — dual-state (public/private) smart contracts with token programs, AMM, and account management
- **Logos Messaging** — ephemeral 1:1 encrypted chat operational; Logos Delivery transport integrated
- **Logos Storage** — decentralized file sharing with 100+ MB/s transfer rates
- **Logos Core** — modular runtime with 13+ modules, process isolation, multi-language SDK
- **Logos Basecamp** — alpha v0.1.3, user-facing application with built-in package manager
- **Testnet v0.1** — all three protocol layers integrated, running on Raspberry Pis

### Near-term milestones

- **Testnet v0.2** — group chat (DMLS), Reliable Channel API, cross-zone messaging, decentralized sequencing
- **Public testnet phases** — progressive opening to external participants
- **Incentivized testnet for Storage** — testing economic mechanisms for durable persistence

### Medium-term

- **Mainnet target: early 2027**

### What is explicitly not committed

- Token launch specifics (timing, distribution)
- Data Availability at the base layer (active research, post-mainnet)
- Fully anonymous incentivized storage (open research problem)
- Specific TPS or throughput targets (the architecture prioritizes sovereignty over raw throughput)

<!-- [NEEDS INPUT: Confirm mainnet target. Verify milestone
     specifics with team leads. The "explicitly not committed"
     section is a trust-building move — review whether it helps
     or hurts with the intended audience. ] -->


---

## 10. Economic Design Overview

<!-- TARGET: 1-1.5 pages. High-level flywheel only. -->

The Logos economic design creates reinforcing incentive loops across all three protocol layers. Detailed tokenomics — vesting schedules, emission curves, and formal game-theoretic analysis — will be published in a dedicated economics document.

### Three-component economic flywheel

**Blockchain security budget.** Cryptarchia's block rewards incentivize stake participation, securing the settlement layer. Because there is no slashing, the economic risk of participation is limited to opportunity cost — stakers cannot lose their principal. This lowers the barrier to entry and broadens the validator set.

**Storage marketplace.** Users pay storage providers to persist data with specified durability guarantees. Providers compete on price and reliability. The marketplace creates organic demand for the settlement layer (payments flow through Logos Chain) and for messaging (coordination between clients and providers).

**Messaging incentivization.** Core messaging nodes that relay traffic and provide Store services are compensated for bandwidth and storage contributions. RLN membership — the right to send messages at a given rate — is allocated through the Logos Execution Zone, creating demand for LEZ transactions.

### Privacy reinforces the economic model

Privacy-preserving staking prevents the targeting of large stakers by adversaries. In transparent PoS systems, the largest stakers are identifiable and become high-value targets for coercion. Cryptarchia's privacy eliminates this attack vector, allowing participants to stake with confidence that their participation cannot be used against them.

<!-- [NEEDS INPUT: Review against DRAFT LOGOS Token Economics
     Notion document. Legal review needed — the litepaper should
     not constitute an informal prospectus. ] -->


---

## 11. What Comes Next

This litepaper is the first in a series of documents providing progressively deeper specification of the Logos stack.

### Forthcoming documents

| Document | Scope | Target |
|----------|-------|--------|
| **Logos Umbrella Whitepaper** | Integrated architecture, threat model, security analysis, formal economic design | Litepaper + 6-12 months |
| **Logos Blockchain Technical Specification** | Cryptarchia, Blend, Channels & Zones | Independent timeline |
| **Logos Storage Technical Specification** | Durability engine, erasure coding, ZK storage proofs, marketplace | Independent timeline |
| **Logos Messaging Protocol Specification** | Protocol family, RLN, Store, adaptive nodes | Independent timeline |

### Existing published work

- **Waku IEEE Paper** (2022) — peer-reviewed academic publication on the messaging protocol family
- **Codex Whitepaper** — technical specification of the decentralized durability engine
- **Cryptarchia Specification** — formal description of private proof-of-stake consensus
- **Logos Blockchain V1 Specifications** — protocol-level spec of the testnet implementation
- ***Farewell to Westphalia*** (Hope & Ludlow, 2025) — book-length philosophical foundation
- **press.logos.co** — ongoing technical writing on architecture, privacy, and design rationale

### Open resources

- **Logos Roadmap:** roadmap.logos.co
- **Specification Hub (LIPs):** lip.logos.co
- **RFC Index:** github.com/vacp2p/rfc-index
- **GitHub:** github.com/logos-co

---

**Additional links**

Run a node | Build on Logos | Join the community

<!-- [NEEDS INPUT: Actual URLs for node program, developer
     onboarding, community channels (Discord, X, website). ] -->

---

**Disclaimers**

<!-- [NEEDS INPUT: Legal disclaimers. This section is mandatory
     but content depends on legal review. Standard crypto litepaper
     disclaimers cover: forward-looking statements, no guarantee
     of returns, regulatory uncertainty, technology risk, etc. ] -->


---

<!-- ============================================================
     APPENDIX: REVIEW NOTES AND OPEN ITEMS

     TECHNICAL CORRECTIONS APPLIED (from Artem's draft):
     -------------------------------------------------------
     1. DATA AVAILABILITY: Artem claimed DA as a "first-class
        protocol service." Per Feb 2026 all-hands, DA was dropped
        from mainnet scope. Removed from this draft. If team has
        re-scoped, re-add with accurate framing.

     2. EXECUTION MODEL: Artem wrote "WASM-class environments
        serving as the baseline abstraction." The actual LEZ
        implementation uses RISC Zero zkVM. Corrected. Verify
        whether WASM is a planned future target.

     3. "LEE" REFERENCE: Artem's heading said "LEZ and LEE" but
        LEE was never defined anywhere — not in specs, not in
        presentations. Removed. If LEE is a real concept, define
        it and add back.

     4. CRYPTARCHIA SPECIFICS: Artem's description was too generic.
        Added: note-based commitments, one-time leader keys,
        honest-majority model, no-slashing design rationale,
        probabilistic finality estimate, PoQ for Blend access.

     5. BLEND DETAILS: Artem described it as "encrypted, multi-hop
        paths" without explaining the threat model (traffic analysis).
        Added circuit architecture explanation and PoQ rate limiting.

     STRUCTURAL CHANGES (from Artem → merged):
     -------------------------------------------------------
     - ADDED: Sections 1, 2, 8, 9, 10 (Thesis, Problem, Positioning,
       Roadmap, Economics) — entirely absent from Artem's draft
     - ADDED: Section 7 (Ecosystem) — no execution evidence in
       Artem's draft
     - ADDED: Section 6 (Potential Applications) — expanded from
       Artem's bullet-point outline
     - PRESERVED: Logos Core, LSSA, Sovereign Rollups/Zones, User
       Modules, Logos UI — Artem's technical content was sound
     - MOVED: Design principles into a standalone section rather
       than scattered through component descriptions
     - REORDERED: Thesis → Problem → Architecture follows the
       research report's recommended narrative arc

     OPEN QUESTIONS FOR TEAM:
     -------------------------------------------------------
     1. Is DA back in scope? If so, at what commitment level?
     2. WASM vs RISC Zero — is WASM a future target for LEZ?
     3. What is "LEE"? Was this a planned concept or an error?
     4. Mainnet target still early 2027?
     5. Codex → Logos Storage naming: how do we frame the lineage?
     6. Token content depth in litepaper vs. dedicated document?
     7. Authorship model: single author, editorial team, or IFT?
     8. Visual designer: external commission or in-house?
     9. Publication venue: press.logos.co, PDF, or both?

     DIAGRAMS NEEDED:
     -------------------------------------------------------
     1. Hero architecture diagram (Artem's is a good start;
        needs DA label corrected)
     2. Cryptarchia flow: ZK lottery → Blend → block propagation
     3. LSSA state separation: public vs private execution paths
     4. Storage retrieval circuits: entry → rendezvous → exit
     5. Messaging stack: Delivery → Chat → RLN integration
     6. Comparative positioning: Bitcoin/Ethereum/Filecoin/Urbit/Logos
     7. Roadmap timeline visual

     QUANTITATIVE GAPS:
     -------------------------------------------------------
     - Current OFAC compliance rate for Ethereum blocks
     - GitHub stats (repos, contributors, commits)
     - Messaging throughput benchmarks
     - Storage transfer rate citation (100+ MB/s claim)
     - Testnet uptime/reliability metrics

     ============================================================ -->
