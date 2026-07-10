# Logos Basecamp in Testnet v0.2: The Whole Stack, One Window

**Component:** Basecamp (formerly Logos App)
**Audience:** General/privacy-curious users, node operators, developers evaluating the stack
**Status:** Scaffold — needs drafting
**Campaign frame:** Pillar 3, "Built for real life" — all modules available in a simple UI.

## Angle

Basecamp is where "architectural readiness" becomes visible to someone who isn't reading protocol specs. v0.1 packaged the stack; in v0.2 every module — blockchain, messaging, storage, LEZ — is accessible from Basecamp, including running a full node. The claim worth leading with (from the framework): Logos is the only stack where compute, communication, and storage are private-by-default and decentralised, available on a desktop. This piece is the consumer-facing anchor of the v0.2 series; keep it lighter than the module deep-dives and link out to them.

## Overview / why it matters (don't duplicate docs)

Docs cover install and module loading — link, don't restate:

- [Install Logos Basecamp](https://docs.logos.co/basecamp/get-started/install-logos-basecamp)
- [Install and load a module in Logos Basecamp](https://docs.logos.co/core/build-modules/install-and-load-a-module-in-logos-basecamp)

The article carries the rationale layer:

- **Why designed this way:** Why a desktop distribution instead of a web app — the browser is a privacy liability (cf. the published Stage 0 article), and local-first means the user's node, keys, and data live on hardware they control. Why one shell for all modules rather than one app per module.
- **Privacy/security role in the transaction lifecycle:** Basecamp is where the lifecycle starts and ends — the user's entry point. Process isolation means a compromised app/module can't reach across the stack; running your own node means no trusted intermediary sees your queries, messages, or transactions.
- **Different/novel:** Every other privacy stack ships protocols and leaves users to assemble them (or trust a hosted gateway). Basecamp ships the assembled stack — compute, communication, storage, private by default, one install.

## What's new in v0.2

- **All modules accessible in Basecamp** — the full stack in one UI, including LEZ.
- **Process isolation security** — modules run isolated from each other. (Get the threat model from eng: what does isolation protect against?)
- **Node UX improvements** — running nodes from Basecamp is simpler; Logos Node accessible via Basecamp.
- **Ecosystem hooks** — Lambda Prize for builders, Node Operator program. (Confirm whether these belong in this article or separate announcements.)

## Open questions

- Process isolation: sandboxing approach and what threat it addresses?
- Which platforms in v0.2?
- Lambda Prize / Node Operator program: in scope here or standalone pieces?

## Sources

- Notion: Messaging Framework (Testnet v0.2 Comms Program), fetched 2026-07-10
- Roadmap to consult: `context/roadmap/content/logoscore/` (Basecamp lives with Core work), `context/roadmap/content/testnets/`
- Prior art: Stage 0 browser-privacy article (published), Basecamp launch article (published May 2026)
