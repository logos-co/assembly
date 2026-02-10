# Understanding the Logos Tech Stack: An Operating System for Sovereignty

If you've ever used Linux, you already understand Logos.

A Linux distribution isn't just a kernel—it's the kernel plus a networking stack, a carefully chosen set of system services, and the applications that together create a complete operating system. Ubuntu, Arch, and Fedora all share the same Linux kernel, but each assembles a different experience on top of it.

Logos works the same way. At its foundation sits the **Logos Kernel**—a microkernel that handles the essential primitives every decentralized application needs. Above that, a networking layer provides peer discovery, connection management, and privacy-preserving communication through a mix-net. And above that sit **modules**—pluggable components for storage, messaging, blockchain, and whatever else developers need.

The **Logos App** is to Logos what Ubuntu is to Linux: a complete "distribution" that bundles the kernel, the default modules, and UI packages into a usable product. But just as you can build your own Linux distribution with different packages and configurations, you can assemble your own Logos-based platform with a different selection of modules.

## The Layers

The Logos tech stack is organized into distinct layers, each with a clear responsibility. From the bottom up:

### Logos Kernel: The Foundation

Every operating system needs a kernel, and the Logos Kernel follows the **microkernel** philosophy—it does as little as possible while enabling everything else.

In traditional operating systems, microkernels handle only the most fundamental operations: process management, memory allocation, and inter-process communication (IPC). Everything else—file systems, networking, device drivers—runs as separate processes in user space, communicating through the kernel's IPC mechanisms.

The Logos Kernel applies this same principle. Implemented through [`liblogos`](https://github.com/logos-co/logos-liblogos), it provides module lifecycle management (loading, starting, stopping modules), IPC between modules via Qt Remote Objects, and a host process that orchestrates everything. It doesn't store files, relay messages, or validate transactions—those responsibilities belong to the modules above it.

This separation matters. A bug in the storage module can't crash the messaging layer. A blockchain upgrade doesn't require rebuilding the kernel. Each component can be developed, tested, and updated independently—just as Linux kernel modules can be loaded and unloaded without rebooting the system.

### Discovery, Peering, and Mix-net: The Networking Stack

Above the kernel sits the networking layer—analogous to the TCP/IP stack in Linux. This layer handles how Logos nodes find each other, establish connections, and communicate.

But unlike TCP/IP, this layer has privacy built in from the ground up. The **mix-net** routes messages through multiple relay nodes, mixing traffic patterns so that observers can't determine who is talking to whom. A [**capability discovery protocol**](https://lip.logos.co/ift-ts/raw/extended-kad-disco.html#api-specification) lets nodes advertise and find services without centralized registries. And the peering layer manages connections across the decentralized network.

Think of it this way: in Linux, the networking stack doesn't care whether you're running a web server or a database—it just moves packets. Similarly, the Logos networking layer doesn't care whether modules above it are storing files, sending chat messages, or processing transactions. It provides private, reliable communication as a shared foundation.

This is the layer where the AnonComms team's work lives—building the [libp2p mixnet](https://github.com/logos-co/anoncomms-pm/milestone/2), implementing [RLN-based DoS protection](https://lip.logos.co/ift-ts/raw/mix-spam-protection-rln.html) to prevent spam without sacrificing anonymity, and developing the capability discovery protocol that lets the whole network self-organize.

### Modules: The System Services

This is where things get interesting. Sitting atop the networking layer are **modules**—self-contained components that provide specific capabilities. Logos ships with three foundational modules, but the architecture is open for anyone to create their own.

**Storage** provides decentralized file storage and retrieval, using content-addressed (CID-based) data. Need to host a frontend? Serve assets? Store user data without relying on corporate cloud providers? The [storage module](https://github.com/logos-storage/logos-storage-nim) handles it. Developers interact with it through a straightforward API: store a file, get back a CID; provide a CID, get back the file.

**Messaging** handles coordination—private, censorship-resistant communication between parties. Built around the [Logos Messaging Nim (LMN)](https://github.com/logos-messaging/logos-messaging-nim) node, it provides publish-subscribe messaging, reliable delivery, and is evolving toward a [ChatSDK](https://github.com/logos-messaging/libchat) that simplifies building encrypted communication into applications. The messaging layer currently embeds LMN directly into the chat node; future versions will separate it into a standalone module with a full API for init, send, subscribe, and health monitoring.

**Blockchain** provides decentralized compute and consensus. This isn't just another L1—it's a purpose-built blockchain using **Cryptarchia**, a private proof-of-stake consensus mechanism where validator identities and stake amounts remain hidden. The **Blend Network** provides network-level anonymity for block propagation. And the **Logos Execution Zone (LEZ)** enables programmable state—both public and private—where developers can deploy programs, run AMMs, transfer tokens, and build financial primitives with built-in privacy. The team recently published a [Proposer Privacy blog post](https://press.logos.co/article/why-proposer-anonymity) explaining why this matters.

**User Modules** are the wild card. Because Logos follows the microkernel pattern, anyone can build modules that plug into the same IPC infrastructure. The Logos Kernel loads them, manages their lifecycle, and enables them to communicate with other modules—whether they're Logos defaults or third-party additions. The new [`logos-module`](https://github.com/logos-co/logos-module) library and CLI tool abstracts this interaction, and a [`logos-module-builder`](https://github.com/logos-co/logos-module-builder) simplifies the build process. SDKs exist for [C++](https://github.com/logos-co/logos-cpp-sdk), with Rust and other languages in development.

The module architecture mirrors how Linux system services work. Just as `systemd` manages daemons—starting, stopping, and monitoring them—`liblogos` manages modules. And just as Linux services communicate through D-Bus, sockets, or shared memory, Logos modules communicate through the kernel's IPC layer.

### Dapps: The Applications

At the top of the stack sit the decentralized applications that people actually use. These compose the modules below them—a chat app uses the messaging module and the storage module; a DeFi application uses the blockchain module and the LEZ; a filesharing app uses storage.

The [**Logos App**](https://github.com/logos-co/logos-app-poc) provides the primary user interface, hosting "Simple Apps" that let users interact with the various modules: a wallet for managing tokens, a [chat interface](https://github.com/logos-co/logos-chat-ui) for encrypted messaging, a filesharing tool for storing and retrieving files, and an explorer for inspecting blockchain and LEZ activity. A new [design system repository](https://github.com/logos-co/logos-design-system) provides unified UI components and styling across the platform.

But the Logos App is just one distribution. The headless **Logos Node** runs the same modules without a UI—ideal for validators, infrastructure operators, or backend services. And developers can build entirely custom applications that select only the modules they need.

## Where It Stands: Testnet v0.1

This isn't theoretical architecture. The first testnet is coming together, and recent weekly engineering reports give a concrete picture of what's being built.

**The kernel is operational.** `liblogos` loads modules from GitHub, the Logos App hosts module UIs, and the Logos Node runs headless with blockchain, storage, and chat nodes. The new [`logos-module`](https://github.com/logos-co/logos-module/pull/1) library and CLI tool abstracts module interaction, and a [package manager](https://github.com/logos-co/logos-package-manager) using the `lgx` format handles installation and dependency resolution. The package manager has been [extracted as a standalone library](https://github.com/logos-co/logos-package-manager-module/pull/21) to improve modularity and reusability.

**The networking layer is advancing.** The AnonComms team closed their DoS/Sybil protection deliverable with the publication of an [RLN DoS Protection LIP](https://lip.logos.co/ift-ts/raw/mix-spam-protection-rln.html) for libp2p mix. The [capability discovery protocol implementation](https://github.com/vacp2p/nim-libp2p/pull/2055) is in review. Mix message routing works in simulation, with optimizations including [concurrent proof generation and delay](https://github.com/vacp2p/nim-libp2p/pull/2069) underway. The demo chat app has been [enhanced with stats](https://github.com/logos-co/logos-chat-ui/pull/4) and mix improvements for [tag management](https://github.com/vacp2p/nim-libp2p/pull/2066) and [node pool handling](https://github.com/vacp2p/nim-libp2p/pull/2067).

**Storage is transitioning.** The codebase has been fully rebranded—[Docker images renamed](https://github.com/logos-storage/logos-storage-nim/pull/1387), [final Codex references removed](https://github.com/logos-storage/logos-storage-nim/issues/1396)—and the v0.3.0 release removed marketplace components to focus on filesharing. An [improved Merkle tree spec](https://github.com/vacp2p/rfc-index/pull/281) is published and under review. Provider anonymity research is progressing through study of the [echomix pigeonhole storage protocol](https://hackmd.io/@codex-storage/Hyy8v2nrZg). A [simple C wrapper over libstorage](https://github.com/gmega/easylibstorage) with example [uploader](https://github.com/gmega/easylibstorage/blob/main/examples/uploader.c), [downloader](https://github.com/gmega/easylibstorage/blob/main/examples/downloader.c), and [console application](https://github.com/gmega/easylibstorage/blob/main/examples/storageconsole.c) makes integration more accessible. The module integrates with Logos Core, with [UI migrating from QWidgets to QML](https://github.com/logos-co/logos-storage-ui/pull/3).

**Messaging is taking shape.** The first [Send API iteration](https://github.com/logos-messaging/logos-messaging-nim/pull/3669) is complete for Logos Messaging Nim. The ChatSDK has working [double-ratchet encryption](https://github.com/logos-messaging/libchat/pull/32) with [FFI bindings](https://github.com/logos-messaging/libchat/pull/25), [conversation initialization](https://github.com/logos-messaging/libchat/pull/24), and [payload handling](https://github.com/logos-messaging/libchat/pull/44). A chat-cli demo app with local file transport and persistence is done. The first external PR to `libchat`—a [CI workflow](https://github.com/logos-messaging/libchat/pull/39)—signals the beginning of open-source collaboration beyond the core team. The [chatsdk UI module](https://github.com/logos-co/logos-modules/pull/13) has been added to logos-modules.

**Blockchain is maturing fast.** Leaders can now claim rewards anonymously through [Proof of Claim](https://github.com/logos-blockchain/logos-blockchain/pull/2050). The [Zone-SDK v0](https://github.com/logos-blockchain/logos-blockchain/pull/2088) supports end-to-end inscription posting. A [Sequencer-Indexer-Explorer integration](https://github.com/logos-blockchain/lssa/pull/316) is underway for LEZ, backed by a [Sequencer-Indexer architecture document](https://www.notion.so/Sequencer-Indexer-architecture-2f68f96fb65c8047bb80e3bfd210be1e). Research into [multi-owner private accounts](https://www.notion.so/Private-accounts-owned-by-multiple-users-2f78f96fb65c8030a814fadd3bab79d0) and [chain calls](https://www.notion.so/LSSA-2d78f96fb65c80329551fed21a8d8675?p=2f68f96fb65c80d996d2f5cfcdc62616&pm=s) is documented and being implemented. The [Proposer Privacy blog post](https://press.logos.co/article/why-proposer-anonymity) and [Overwatch framework presentation](https://www.youtube.com/watch?v=RLiZLA0EdK8) at Logos Dev Club mark growing public communication.

**RLN is a cross-cutting success story.** The [RLN Prover milestone](https://github.com/logos-co/anoncomms-pm/milestone/4) for gasless L2 transactions is complete, including a [whitepaper draft](https://github.com/vacp2p/rfc-index/pull/286). [Multi-burn RLN proof support](https://github.com/vacp2p/zerokit/pull/375) is implemented. An [RLN aggregator node](https://github.com/status-im/status-network-monorepo/pull/139) for authenticated slashing is launched. And RLN membership allocation through LEE programs with Merkle trees is progressing—connecting the blockchain and anonymous communications teams in a concrete, shared deliverable. The Storage team's [blog post on speeding up RLN proofs](https://forum.vac.dev/t/speeding-up-rln-proofs/663) exemplifies the cross-team collaboration driving this forward.

## Why This Architecture Matters

Most blockchain projects build monoliths—single systems where consensus, execution, storage, and networking are tightly coupled. Upgrading one component means upgrading everything. Privacy is an afterthought bolted on at the application layer while metadata leaks freely at every layer below.

Logos takes a fundamentally different approach.

**Modularity means resilience.** Each layer and module can be developed, audited, and upgraded independently. A storage bug can't take down messaging. A consensus upgrade doesn't require rebuilding the networking stack. This isn't just good engineering—in adversarial environments, it's a survival trait.

**Privacy is structural, not cosmetic.** The mix-net obscures communication patterns at the networking layer. Cryptarchia hides validator identities and stakes at the consensus layer. LEZ supports private state at the execution layer. Storage research is advancing [provider and publisher anonymity](https://hackmd.io/@codex-storage/Hyy8v2nrZg). Privacy isn't an app feature—it's a property of the infrastructure itself.

**Composability enables sovereignty.** When you run a Logos node, you're running infrastructure you control. Your messages don't route through company servers. Your files don't sit in corporate data centers. Your transactions don't require permission from intermediaries. And because the stack is modular, you choose exactly which capabilities you need.

## Building on Logos

If you understand how Linux works, you understand Logos.

The kernel handles the fundamentals. The networking layer connects nodes privately. Modules provide capabilities. Applications deliver value to users. And just like Linux, the whole stack is open for you to modify, extend, and make your own.

Testnet v0.1 is where this architecture becomes tangible—where you can run a node, store a file, send a message, transfer tokens, and push messages through a mix-net. Not on someone else's infrastructure. On yours.
