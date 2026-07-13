# Logos Core in Testnet v0.2: The Microkernel Grows Up

**Component:** Core (runtime library: liblogos)
**Audience:** App developers, systems programmers
**Status:** First draft, adversarially reviewed (2 rounds; see changelog)

---

Every article in this series ends up back at the same sentence: "it now runs through Logos Core like everything else." Blockchain, storage, messaging, all of them stopped being standalone daemons in v0.2 and became modules under one runtime. This article is about the thing that sentence takes for granted.

Logos Core is a microkernel-style runtime: a small core that loads modules dynamically, manages their lifecycle, and mediates how they talk to each other. The kernel doesn't do storage or consensus; it does loading, isolation, and communication, and everything else is a module. If the series' operating-system framing sounded like a metaphor, Core is the part that makes it literal.

## Why a microkernel and not a node binary

The obvious way to ship a stack like this is one fat binary with everything compiled in. It's simpler, and nearly everyone does it. Logos didn't, for a reason that's political as much as technical: in a monolith, adding a capability to the network means getting your code merged into the one blessed binary, and whoever controls that repo decides what the network can become.

The standard rebuttal is that open-source monoliths are forkable, so capture doesn't stick. True as far as it goes, but a fork is an exit, not an extension: fork the node and you now maintain a second client, and everyone who wants your capability has to switch to it. In the Core model, nobody needs permission to ship a module. The runtime loads it, manages it, and lets it communicate with other modules exactly the way the default blockchain, storage, and messaging modules do. No fork, no merge request to a gatekeeper.

Core itself still has maintainers, and I won't pretend that isn't a trust point: whoever controls the runtime controls loading and the security model every module inherits. The difference is surface area. Capture a monolith and you own the feature set; capture Core and you own a small kernel that is easier to audit, and cheaper to fork, precisely because it's small.

The accepted tradeoff is real runtime complexity: dynamic loading, dependency management between modules (detecting dependency cycles is on the consolidation milestone, because someone will eventually ship one), and lifecycle handling for components the core has never seen before. That complexity is the price of a stack no single party controls, and I think it's the right purchase.

The docs cover the mechanics ([start a module from the CLI](https://docs.logos.co/core/build-modules/start-a-logos-module-from-the-cli), [build and run a core module](https://docs.logos.co/core/build-modules/build-and-run-a-logos-core-module), [wrap an existing C library](https://docs.logos.co/core/build-modules/wrap-a-c-library-as-a-logos-core-module)), so here's the v0.2 story.

## Daemon mode, and why the Node exists now

The headline: `logoscore` split into a daemon and a client, talking over TCP, with a Python wrapper (`logoscore-py`) for good measure. Headless operation technically existed in v0.1 (the Logos Node could already load the backend nodes on a server); v0.2 turns it from a capability into an operated mode, a daemon you manage remotely from a client or from Python, no desktop session anywhere in the picture.

That's the change that makes the [Logos Node](https://docs.logos.co/run-a-node/complete-node-blockchain-storage-delivery-modules/run-logos-node-blockchain-storage-delivery) a thing: the full stack (blockchain, storage, delivery) running headless on a server, managed remotely. The v0.2 scope has the testnet fleet itself running this way. Metrics matured alongside: the storage and delivery modules ship OpenMetrics support, and a dedicated OpenMetrics module exposes module metrics to Prometheus-compatible systems, so an operator gets node-level visibility instead of per-daemon guesswork.

## The security boundary got real

The part of this release I'd tell a security engineer about first: module API access is now restricted through token exchange and caller allow lists. A module doesn't get to call another module's API just because they share a process space; it gets the access it was granted, checked at the boundary. Your filesharing module asked for the storage API, it got the storage API, and its call to the chat module's API fails at the runtime instead of succeeding by default.

Square that with "nobody needs permission": nobody needs permission to *ship* a module, and a *loaded* module runs with exactly the access it was granted. Distribution stays permissionless; runtime access doesn't. That's the same split you already trust everywhere else in software: anyone can publish a package, and you still decide what runs on your machine and what it's allowed to touch. Who sets grant policy here in practice (operator, user, module manifest) is a question the release notes don't answer, and one I'd push on.

This matters because the runtime is where "private by default" either holds or doesn't. Blend can protect block proposers and MLS can protect group chats, but if any loaded module can reach into the messaging module's state, every one of those guarantees dies at the runtime layer. In a world where modules come from third parties (the whole point, see above), the runtime *is* the threat model.

Scope check, though: token exchange is access control at the API boundary. It stops a module from calling what it wasn't granted. It is not memory isolation, and a hostile native module sharing an address space is a different, harder threat. Basecamp already runs UI plugins in separate processes; the equivalent story for backend modules is the isolation roadmap I'm watching. API-level grants are the first layer of the wall, and the rest still has to be built.

Transport between components is also moving to CDDL-defined schemas encoded as CBOR. Ad-hoc serialization at a trust boundary is how two parsers end up disagreeing about what a message says, and parser disagreement is where exploits live; a schema both sides validate against is the boring fix.

## Developer experience, the compounding kind

Three things shipped that don't demo well but compound.

Code generation now gives module and UI developers type-safe access to module APIs, with the boilerplate generated. The consumer/provider logic moved into the C API and is wrapped by both `cpp-sdk` and `rust-sdk`, so bindings share one source of truth instead of three drifting reimplementations.

There's now a standard release path: `logos-modules-release-base` defines how modules and UI plugins get built and published into release indexes that Basecamp's package manager can load. A release index is a format, not a store: you publish your own, users add your repository through the package manager's repository management, or skip the package manager entirely and [load the module from the CLI](https://docs.logos.co/core/build-modules/start-a-logos-module-from-the-cli). Distribution stays as permissionless as the loading. The consolidation milestone moves all thirteen existing modules and apps onto that single build path; once the migration lands, the journey from "I wrote a module" to "someone installed my module" has an actual paved road.

And the p2p module: peerstore management, capability discovery, and custom protocol registration are all exposed to modules now. Your module can speak its own wire protocol over the shared networking layer without leaving the runtime's security model.

## Where this leaves the series

All of that tooling exists so the runtime can absorb modules it has never seen, and that's also Core's place in the lifecycle. Core doesn't have a stage in the transaction lifecycle; it's the floor the stages stand on. Coordination, storage, settlement, all of it runs as modules whose API boundaries Core checks. You can get component separation other ways (privilege-separated monoliths, process-per-service designs), but those assume you know your components at build time. Core's job is enforcing boundaries around components written by strangers, loaded after deployment. That's the answer to "why does a comms hub need a microkernel."

Open items I'm watching: the isolation roadmap past API tokens, and who sets grant policy. If you're building a module against the v0.2 SDKs, or you've hit walls in the codegen or the release tooling, holler at me. Runtime APIs get hard to change the moment third parties compile against them, code the core team can't recompile for you, so now's the moment to complain.

---

*Roadmap sources consulted (strip before publishing): `context/roadmap/content/testnets/v01.md`, `v02.md`, `v02-release.md`, `context/roadmap/content/logoscore/roadmap/milestones/2026-logoscore-consolidation.md`, `2026-developer-journey-modules-apps.md`, `context/roadmap/content/logoscore/furps/logos-core.md`.*
