# Logos Messaging in Testnet v0.2: A Real API Surface

**Component:** Messaging (formerly Waku)
**Audience:** App developers, Rust/FFI devs, protocol engineers
**Status:** Scaffold — needs drafting
**Campaign frame:** "From convergence to architectural readiness" — v0.2 drops builder friction across the stack.

## Angle

v0.1 showed messaging working inside the stack; v0.2 gives developers a layered API surface they can actually build against: Kernel API (low-level control), Messaging API (message abstraction), reliable channels API. Proof point: Chat is no longer a special case — the Chat module is itself a consumer of the Messaging module. Dogfooding as architecture argument.

## Overview / why it matters (don't duplicate docs)

Docs cover the protocol concepts and APIs — link, don't restate:

- [Understand Logos Messaging protocols](https://docs.logos.co/messaging/concepts/understand-logos-messaging-protocols)
- [Use the Logos Delivery module API from an app](https://docs.logos.co/messaging/delivery-module/use-logos-delivery-module-api-from-app)
- [Understand Logos Messaging security features](https://docs.logos.co/messaging/concepts/understand-logos-messaging-security-features)
- [Build a Logos module that uses the Chat module API](https://docs.logos.co/messaging/chat-module/build-logos-module-that-uses-chat-module-api)

The article carries the rationale layer:

- **Why designed this way:** Why a layered API (Kernel → Messaging → reliable channels) instead of one monolithic surface — different builders need different levels of control, and abstraction boundaries are where protocols can evolve without breaking apps. Why light protocols are a design requirement, not an afterthought (browser and mobile can't run full nodes).
- **Privacy/security role in the transaction lifecycle:** Messaging is the coordination layer — transactions and multi-party operations need private communication *before* anything touches the chain. E2EE (double-ratchet, PFS) plus network-level DoS protection means both content and availability are defended.
- **Different/novel:** Point-solution messengers solve one layer with centralised infrastructure somewhere in the stack; Logos Messaging is p2p transport integrated with storage and consensus. Chat consuming the public Messaging API — not privileged internals — is the proof the abstraction holds.

## What's new in v0.2

- **Delivery module ready with new API** — pub-sub transport is now a stable surface.
- **Kernel API** — low-level control for builders who need it.
- **Messaging API** — message abstraction over delivery.
- **Reliable channels API** — (Notion entry unfinished; confirm what it provides with eng.)
- **Chat module consumes the Messaging module** — the E2EE chat app is built on the same public APIs third parties get.

## Open questions

- Reliable channels API: guarantees? Ordering, at-least-once, resumption?
- Which APIs are stable vs. experimental in v0.2?
- Light protocol status for browser/mobile in this release?

## Sources

- Notion: Messaging Framework (Testnet v0.2 Comms Program), fetched 2026-07-10
- Roadmap to consult: `context/roadmap/content/messaging/`, `context/roadmap/content/testnets/`
