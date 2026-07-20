# Logos Blockchain in Testnet v0.2: Privacy Reaches Consensus

**Component:** Blockchain (formerly Nomos)
**Audience:** Protocol engineers, node operators, privacy researchers
**Status:** Scaffold — needs drafting
**Campaign frame:** "From convergence to architectural readiness" — v0.1 proved the modules fit together; v0.2 hardens the protocols and adds core privacy primitives.

## Angle

Most chains treat privacy as an application-layer feature. v0.2 pushes it into consensus itself: Blend gives block proposers network-level anonymity on top of Cryptarchia (private PoS). Pair with the differentiation claims: privacy L2s ship one private execution layer, Logos ships the whole stack and pushes privacy into consensus; most rollups "decentralise the sequencer later," Logos decentralises Zone sequencing on testnet now.

## Overview / why it matters (don't duplicate docs)

The docs cover what Cryptarchia, Bedrock, Mantle, Blend, and Zones *are* — link, don't restate:

- [Introduction to the Logos Blockchain](https://docs.logos.co/blockchain/get-started/introduction-to-the-logos-blockchain)
- [About Cryptarchia](https://docs.logos.co/blockchain/concepts/about-cryptarchia)
- [About the Blend Network](https://docs.logos.co/blockchain/concepts/about-the-blend-network)
- [About Zones](https://docs.logos.co/blockchain/concepts/about-zones)

The article carries the rationale layer:

- **Why designed this way:** Why private PoS from the ground up instead of retrofitting privacy — ZK proofs alone don't help if the network layer deanonymises the proposer. Why Zones as the execution model (separation of agreement from execution) rather than a monolithic chain.
- **Privacy/security role in the transaction lifecycle:** Consensus is the last hop of every transaction — if the proposer is identifiable, staking amounts and validator identity leak regardless of how private the transaction itself was. Blend closes that hop. Sets up the transaction-lifecycle thesis (Pillar 1).
- **Different/novel:** Privacy L2s ship one private execution layer; Logos pushes privacy into consensus itself. Rollups "decentralise the sequencer later"; Logos decentralises Zone sequencing on testnet.

## What's new in v0.2

- **Blend Network live (P0 talking point)** — mixnet-based proposer privacy; block proposers can't be deanonymised by network observers. Framing: privacy now reaches the consensus layer.
- **Decentralised Zone sequencing** — Zones order their own transactions without a central sequencer (leads into v0.3). The decentralisation story other rollups defer.
- **Token bridging to/from Zones** — assets move between Zones; first taste of a multi-Zone economy. *Notion note: careful with bridging language.*
- **LEZ available as a module** — the execution zone runs inside the stack.
- **External validators** — mentioned in the long message; confirm scope with eng.

## Open questions

- Bridging language: what claims are safe? ("careful with language" flag in framework)
- What exactly shipped for decentralised sequencing vs. what lands in v0.3?
- External validators: how external? Permissioned set or open?

## Sources

- Notion: Messaging Framework (Testnet v0.2 Comms Program), fetched 2026-07-10
- Roadmap to consult: `context/roadmap/content/blockchain/`, `context/roadmap/content/testnets/`
