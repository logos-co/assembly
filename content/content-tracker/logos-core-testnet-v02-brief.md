# Logos Core in Testnet v0.2: The Microkernel Grows Up

**Component:** Core (formerly liblogos)
**Audience:** App developers, systems programmers
**Status:** Scaffold — needs drafting
**Campaign frame:** "From convergence to architectural readiness" — modules talk to each other; running the stack is simpler.

## Angle

Core is the reason "Logos as an operating system" isn't just a metaphor: a microkernel runtime that dynamically loads modules and manages their lifecycle. v0.2's headline is daemon mode — the runtime now runs headless, which is what makes the Logos Node (full network: blockchain + storage + delivery, consolidated metrics) possible. The article can connect Core's maturity to the node story: v0.1 metrics were blockchain-only; with all modules integrated under one runtime, v0.2 measures the whole network.

## Overview / why it matters (don't duplicate docs)

Docs cover building and running modules — link, don't restate:

- [Start a Logos module from the CLI](https://docs.logos.co/core/build-modules/start-a-logos-module-from-the-cli)
- [Build and run a Logos core module](https://docs.logos.co/core/build-modules/build-and-run-a-logos-core-module)
- [Wrap a C library as a Logos core module](https://docs.logos.co/core/build-modules/wrap-a-c-library-as-a-logos-core-module)
- [Run a Logos node with blockchain, storage, and delivery](https://docs.logos.co/run-a-node/complete-node-blockchain-storage-delivery-modules/run-logos-node-blockchain-storage-delivery)

The article carries the rationale layer:

- **Why designed this way:** Why a microkernel with dynamic module loading instead of a monolithic node binary — modules can be added, replaced, and upgraded independently, and third-party modules are first-class rather than forks. The tradeoff accepted: runtime complexity in exchange for a stack that no single party controls.
- **Privacy/security role in the transaction lifecycle:** Core is where module boundaries are enforced — a compromised or malicious module shouldn't see another module's keys or traffic. The runtime is what makes "private by default" a system property rather than a per-module promise.
- **Different/novel:** Other stacks integrate at the RPC level (separate daemons, trust via localhost); Logos integrates at the runtime level with lifecycle management and inter-module communication under one security model. Prior art worth invoking: microkernels, plugin architectures — and where Logos deviates.

## What's new in v0.2

- **Daemon mode** — the runtime runs headless; foundation for the Logos Node.
- **Usability and stability improvements** — (vague in the framework; pull specifics from roadmap/eng before drafting.)
- **Node-level integration** — all modules integrated, consolidated metrics across the network rather than blockchain-only. (Confirm whether this belongs to Core or deserves its own node-operator piece.)

## Open questions

- What specifically stabilised? Crash recovery, module isolation, API freeze?
- Is "Logos Node" a Core deliverable or a separate artifact worth its own article?
- Consolidated metrics: what's measured, where do operators see it?

## Sources

- Notion: Messaging Framework (Testnet v0.2 Comms Program), fetched 2026-07-10
- Roadmap to consult: `context/roadmap/content/logoscore/`, `context/roadmap/content/testnets/`
