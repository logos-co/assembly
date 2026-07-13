# Logos Core in Testnet v0.2: The Microkernel Grows Up

**Component:** Core (formerly liblogos)
**Audience:** App developers, systems programmers
**Status:** First draft

---

Every article in this series ends up back at the same sentence: "it now runs through Logos Core like everything else." Blockchain, storage, messaging, all of them stopped being standalone daemons in v0.2 and became modules under one runtime. This article is about the thing that sentence takes for granted.

Logos Core is a microkernel-style runtime: a small core that loads modules dynamically, manages their lifecycle, and mediates how they talk to each other. If you've read the "Logos as an operating system" piece, Core is the part that makes the metaphor literal. The kernel doesn't do storage or consensus; it does loading, isolation, and communication, and everything else is a module.

## Why a microkernel and not a node binary

The obvious way to ship a stack like this is one fat binary with everything compiled in. It's simpler, and nearly everyone does it. Logos didn't, for a reason that's political as much as technical: a monolith has a maintainer, and a maintainer is a capture point. If adding a capability to the network means getting your code merged into the one blessed binary, then whoever controls that repo controls what the network can become.

In the Core model, third-party modules are first-class. The runtime loads them, manages them, and lets them communicate with other modules exactly the way the default blockchain, storage, and messaging modules do. Nobody needs permission to extend the stack. The accepted tradeoff is real runtime complexity: dynamic loading, dependency management between modules (v0.2 added acyclic dependency detection, because someone will eventually ship a dependency cycle), and lifecycle handling for components the core has never seen before. That complexity is the price of a stack no single party controls, and I think it's the right purchase.

The docs cover the mechanics ([start a module from the CLI](https://docs.logos.co/core/build-modules/start-a-logos-module-from-the-cli), [build and run a core module](https://docs.logos.co/core/build-modules/build-and-run-a-logos-core-module), [wrap an existing C library](https://docs.logos.co/core/build-modules/wrap-a-c-library-as-a-logos-core-module)), so here's the v0.2 story.

## Daemon mode, and why the Node exists now

The headline: `logoscore` split into a daemon and a client, talking over TCP, with a Python wrapper (`logoscore-py`) for good measure. The runtime no longer needs a desktop session wrapped around it.

That's the change that makes the [Logos Node](https://docs.logos.co/run-a-node/complete-node-blockchain-storage-delivery-modules/run-logos-node-blockchain-storage-delivery) a thing: the full stack (blockchain, storage, delivery) running headless on a server, managed remotely. The testnet fleet itself runs this way, which is the kind of dogfooding I trust. And because every module now exposes OpenMetrics, operators get consolidated, Prometheus-compatible metrics across the whole node. v0.1's metrics were blockchain-only; v0.2 measures the network as a network.

## The security boundary got real

The part of this release I'd tell a security engineer about first: module API access is now restricted through token exchange and caller allow lists. A module doesn't get to call another module's API just because they share a process space; it gets the access it was granted, checked at the boundary.

This matters because the runtime is where "private by default" either holds or doesn't. Blend can protect block proposers and MLS can protect group chats, but if any loaded module can reach into the messaging module's state or intercept another module's traffic, every one of those guarantees dies at the runtime layer. Per-module isolation with explicit, auditable grants is what makes the stack's privacy a system property instead of a stack of individual promises. In a world where modules come from third parties (the whole point, see above), the runtime *is* the threat model.

Transport between components is also moving to CDDL-defined schemas encoded as CBOR: boring, precise, and exactly what you want at a trust boundary instead of ad-hoc serialization.

## Developer experience, the compounding kind

Two things shipped that don't demo well but compound:

Code generation now gives module and UI developers type-safe access to module APIs, with the boilerplate generated. The consumer/provider logic moved into the C API and is wrapped by both `cpp-sdk` and `rust-sdk`, so bindings share one source of truth instead of three drifting reimplementations.

And there's now a standard release path: `logos-modules-release-base` defines how modules and UI plugins get built and published into release indexes that Basecamp's package manager can load. Combined with the module builder migration (all thirteen existing modules and apps now build through one path), the developer journey from "I wrote a module" to "someone installed my module" has an actual paved road.

The p2p module rounds it out: peerstore management, capability discovery, and custom protocol registration are all exposed to modules now. Your module can speak its own wire protocol over the shared networking layer, mixnet and all, without leaving the runtime's security model.

## Where this leaves the series

Core doesn't have a stage in the transaction lifecycle; it's the floor the stages stand on. Coordination, storage, settlement, all of it runs as modules whose boundaries Core enforces. That's the answer to "why does a comms hub need a microkernel": because the alternative is trusting every component with every other component's secrets, forever.

Open items I'm watching: process isolation is per-module today at the API-token level, and I want to understand the roadmap for stronger isolation (the Basecamp article gets into the process-level work on the UI side). If you're building a module against the v0.2 SDKs, or you've hit walls in the codegen or the release tooling, holler at me. Runtime APIs are the hardest thing in the stack to change later, so now's the moment to complain.

---

*Roadmap sources consulted (strip before publishing): `context/roadmap/content/testnets/v02.md`, `v02-release.md`, `context/roadmap/content/logoscore/roadmap/milestones/2026-logoscore-consolidation.md`.*
