# Logos Storage in Testnet v0.2: Hardening the Substrate

**Component:** Storage (formerly Codex)
**Audience:** Infrastructure engineers, privacy engineers, node operators
**Status:** Scaffold — needs drafting
**Campaign frame:** "From convergence to architectural readiness" — v0.2 hardens core protocols.

## Angle

Storage is the least flashy module and the one everything depends on — you can't have a decentralised app if the frontend lives on S3. v0.2's changes are unglamorous on purpose: NAT traversal (real-world nodes live behind routers), DHT queries over the mixnet (metadata privacy for lookups, not just content), and an improved block protocol. The story is what "architectural readiness" looks like at the storage layer: privacy extended to *queries*, and nodes that work on networks people actually have.

## Overview / why it matters (don't duplicate docs)

Docs cover setup and usage — link, don't restate:

- [Run a Logos storage node](https://docs.logos.co/storage/get-started/run-logos-storage-node)
- [Set up and use the Logos Storage UI](https://docs.logos.co/storage/get-started/set-up-and-use-logos-storage-ui)

The article carries the rationale layer:

- **Why designed this way:** Why content addressing (CIDs) — integrity and location-independence come from the address itself, so no server is trusted or trustable. Why durability guarantees belong at the protocol layer rather than being an SLA someone promises.
- **Privacy/security role in the transaction lifecycle:** Storage is where transaction artifacts, app state, and frontends live — the lifecycle isn't private if retrieval patterns leak who reads what. DHT-over-mix extends privacy from content to queries, the metadata layer most storage networks ignore.
- **Different/novel:** Storage point-solutions decentralise the bytes but leak the lookups and leave frontends on CDNs; Logos Storage serves the whole app (frontend included) and routes discovery through the mixnet shared with the rest of the stack.

## What's new in v0.2

- **NAT traversal (v0.2.1)** — nodes behind home routers participate without manual config.
- **DHT queries over the mixnet** — who-is-looking-up-what is hidden from network observers; privacy extended from content to metadata.
- **Improved block protocol** — architectural improvements to block exchange. (Get specifics from eng/roadmap: what changed, what it fixes.)

## Open questions

- Block protocol: what concretely changed? Performance numbers available?
- Is DHT-over-mix on by default or opt-in in v0.2?
- NAT traversal technique (hole punching? relays?) and success rates?

## Sources

- Notion: Messaging Framework (Testnet v0.2 Comms Program), fetched 2026-07-10
- Roadmap to consult: `context/roadmap/content/storage/`, `context/roadmap/content/testnets/`
