---
title: "Article: libchat — Building E2E Encrypted Messaging with the Logos Chat SDK"
tags:
  - artifact
  - article
  - messaging
type: article
status: proposed
date: 2026-02-10
---

## Summary

A developer-facing walkthrough of building encrypted messaging applications using libchat, the Logos Chat SDK. Covers the Rust FFI architecture, X3DH key exchange, payload handling, sqlite persistence, and the working chat-cli demo. Positioned as a practical "build your first private chat app" tutorial with deeper dives into the cryptographic underpinnings.

## Audience

**Primary:** Application developers building messaging features — Rust developers, mobile/desktop developers working with FFI, privacy-focused app builders.
**Secondary:** Cryptography engineers interested in the X3DH + MLS approach, open-source messaging protocol researchers.

## Key Angles

- What libchat is: a Rust SDK for building E2E encrypted messaging with Waku as the transport layer
- The architecture: Rust core → FFI → platform bindings (with Logos Core QML UI module)
- Key exchange: X3DH (Extended Triple Diffie-Hellman) for establishing sessions
- Payload handling and the IntroBundle protobuf format
- Persistence: sqlite integration for conversation storage
- The chat-cli demo: a working example using local file transport
- Waku integration: relay, filter, store, lightpush as the messaging backbone
- De-MLS: the path toward decentralized group messaging with multi-steward support
- First external contribution — what the developer experience is like today

## Sources

### Code
- libchat repo (core SDK):
  - Safer FFI migration: [libchat#47](https://github.com/logos-messaging/libchat/pull/47)
  - Conversation handles over FFI: [libchat#46](https://github.com/logos-messaging/libchat/pull/46)
  - Byte slice content: [libchat#45](https://github.com/logos-messaging/libchat/pull/45)
  - Payload handling: [libchat#44](https://github.com/logos-messaging/libchat/pull/44)
  - Code cleanup: [libchat#42](https://github.com/logos-messaging/libchat/pull/42)
  - First external PR (CI workflow): [libchat#39](https://github.com/logos-messaging/libchat/pull/39)
  - SQLite integration branch: https://github.com/logos-messaging/libchat/tree/storage-chat
  - Chat-cli demo app: https://github.com/logos-messaging/libchat/tree/storage-chat/chat-clis
- Chat protobuf definitions (IntroBundle): [chat_proto#8](https://github.com/logos-messaging/chat_proto/pull/8)
- Logos modules chat SDK UI: [logos-modules#13](https://github.com/logos-co/logos-modules/pull/13)

### Specs
- X3DH spec: `rfc-index/docs/messaging/standards/application/53/x3dh.md`
- X3DH sessions spec: `rfc-index/docs/messaging/standards/application/54/x3dh-sessions.md`
- Waku v2 base spec: `rfc-index/docs/messaging/standards/core/10/waku2.md`
- Relay spec: `rfc-index/docs/messaging/standards/core/11/relay.md`
- Store spec: `rfc-index/docs/messaging/standards/core/13/store.md`
- Filter spec: `rfc-index/docs/messaging/standards/core/12/filter.md`
- Lightpush spec: `rfc-index/docs/messaging/standards/core/19/lightpush.md`
- Message format spec: `rfc-index/docs/messaging/standards/core/14/message.md`
- Payload format spec: `rfc-index/docs/messaging/standards/application/26/payload.md`

### De-MLS (Group Messaging — Future Direction)
- De-MLS API and multi-steward spec PR: [rfc-index#235](https://github.com/vacp2p/rfc-index/pull/235)
- De-MLS implementation: [de-mls#47](https://github.com/vacp2p/de-mls/pull/47)
- De-MLS FURPS: `roadmap/content/anoncomms/furps/de-mls.md`

### Waku API / Delivery
- LogosDelivery receive handling: [logos-messaging-nim#3710](https://github.com/logos-messaging/logos-messaging-nim/issues/3710)
- LogosDelivery FFI c-library: [logos-messaging-nim#3709](https://github.com/logos-messaging/logos-messaging-nim/issues/3709)

## Notes

- The chat-cli demo is the strongest entry point — start with "run this, see it work" then unpack the layers.
- The FFI story matters: developers building mobile/desktop apps need to understand the Rust → C → platform bridge.
- X3DH is well-understood in the Signal Protocol world — position this as "Signal-grade crypto on a decentralized transport."
- De-MLS is still in progress but worth previewing as the group messaging future. Frame as "what's coming" rather than "what's shipped."
- The first external PR is a good signal — mention it to show the project is open to contributors.
- Coordinate with messaging team on whether the storage-chat branch will be merged to main before publication.
