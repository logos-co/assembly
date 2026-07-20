---
title: "Article: libchat — Building E2E Encrypted Messaging with the Logos Chat SDK"
tags:
  - artifact
  - article
  - messaging
type: article
status: proposed
date: 2026-02-10
updated: 2026-02-17
---

## Summary

A developer-facing walkthrough of building encrypted messaging applications using libchat, the Logos Chat SDK. Covers the Rust FFI architecture, X3DH key exchange, payload handling, sqlite persistence, and the working demos. Now strengthened by **de-MLS published to crates.io** (real library, real package), demo chat app under dogfooding, Health API implementation, and multiple chat module instances running in Logos Core. The messaging team is also planning a rename from logos-messaging to logos-delivery, signaling architectural maturity.

## Audience

**Primary:** Application developers building messaging features — Rust developers, mobile/desktop developers working with FFI, privacy-focused app builders.
**Secondary:** Cryptography engineers interested in the X3DH + MLS approach, open-source messaging protocol researchers.

## Key Angles

- What libchat is: a Rust SDK for building E2E encrypted messaging with Waku as the transport layer
- The architecture: Rust core → FFI → platform bindings (with Logos Core QML UI module)
- Key exchange: X3DH (Extended Triple Diffie-Hellman) for establishing sessions
- **PrivateV1 ConvoId** — new conversation identity model
- Payload handling and the IntroBundle protobuf format
- Persistence: sqlite integration for conversation storage
- **Multiple chat module instances** running in Logos Core simultaneously
- **Health API** implemented for monitoring messaging node status
- The chat-cli demo: working example, now being dogfooded
- **de-MLS published to crates.io** — decentralized group messaging is a real, installable library
- Hashgraph-like consensus crate also published — the dependency stack is going public
- logos-messaging → logos-delivery rename planned — what it signals about architecture
- nim-sds nimble integration — improved build management

## Sources

### Code — libchat
- PrivateV1 ConvoId: [libchat#54](https://github.com/logos-messaging/libchat/pull/54)
- CI Tests: [libchat#52](https://github.com/logos-messaging/libchat/pull/52)
- Decrypt Initial Message: [libchat#48](https://github.com/logos-messaging/libchat/pull/48)
- Introduction Bundle Encoding: [libchat#43](https://github.com/logos-messaging/libchat/pull/43)
- Safer FFI Migration: [libchat#47](https://github.com/logos-messaging/libchat/pull/47)
- Conversation handles over FFI: [libchat#46](https://github.com/logos-messaging/libchat/pull/46)
- Byte slice content: [libchat#45](https://github.com/logos-messaging/libchat/pull/45)
- Payload handling: [libchat#44](https://github.com/logos-messaging/libchat/pull/44)
- First external PR (CI workflow): [libchat#39](https://github.com/logos-messaging/libchat/pull/39)
- SQLite integration branch: https://github.com/logos-messaging/libchat/tree/storage-chat
- Chat-cli demo app: https://github.com/logos-messaging/libchat/tree/storage-chat/chat-clis

### Code — Logos Core Integration
- Build Logos Chat: [logos-app-poc#59](https://github.com/logos-co/logos-app-poc/pull/59)
- LogosChat build tests: [logos-app-poc#62](https://github.com/logos-co/logos-app-poc/pull/62)
- Libchat Integration: [logos-app-poc#55](https://github.com/logos-co/logos-app-poc/pull/55)
- **Multiple chat module instances**: [logos-chat-ui#2](https://github.com/logos-co/logos-chat-ui/pull/2) (placeholder — from weekly)
- Chat SDK UI module: [logos-modules#13](https://github.com/logos-co/logos-modules/pull/13)
- Chat protobuf definitions (IntroBundle): [chat_proto#8](https://github.com/logos-messaging/chat_proto/pull/8)

### Code — Delivery / Waku API (NEW)
- **Health API** implemented in nwaku
- Planned: liblogosdelivery (implementation ready, holding for module readiness)
- Planned: logos-delivery-module
- Planned: receive/subscribe API
- Planned: logos.dev messaging fleet deployment
- nim-sds nimble integration: [nim-sds#52](https://github.com/logos-messaging/nim-sds/pull/52)
- Planned rename: logos-messaging-* → logos-delivery*

### de-MLS — Decentralized Group Messaging (MAJOR UPDATE)
- **First API implementation merged**: [de-mls#47](https://github.com/vacp2p/de-mls/pull/47)
- **Published to crates.io**: https://crates.io/crates/de-mls
- Logos-messaging integrated in Delivery Service: [de-mls#49](https://github.com/vacp2p/de-mls/pull/49)
- **Hashgraph-like consensus crate published**: https://crates.io/crates/hashgraph-like-consensus
- Multi-steward and advanced group management: in progress, peer scoring system next

### Specs
- X3DH spec: `rfc-index/docs/messaging/standards/application/53/x3dh.md`
- X3DH sessions spec: `rfc-index/docs/messaging/standards/application/54/x3dh-sessions.md`
- Waku v2 base spec: `rfc-index/docs/messaging/standards/core/10/waku2.md`
- Relay spec: `rfc-index/docs/messaging/standards/core/11/relay.md`
- Store spec: `rfc-index/docs/messaging/standards/core/13/store.md`
- De-MLS spec PR: [rfc-index#235](https://github.com/vacp2p/rfc-index/pull/235)

## Related
- [[browser-privacy-stage0|Stage 0: Your Browser Has Already Betrayed You]] — contextualizes why private messaging infrastructure matters

## Notes

- de-MLS on crates.io is a headline — it's a real, installable Rust library for decentralized group messaging. Lead with this.
- The PrivateV1 ConvoId suggests the identity model is crystallizing — worth explaining the design decisions.
- Multiple chat instances in Logos Core shows the module system working in practice — modules are composable.
- The logos-messaging → logos-delivery rename signals a shift from "messaging protocol" to "reliable delivery infrastructure" — worth noting the architectural philosophy.
- Health API is important for production readiness — monitoring is a sign of maturity.
- The first external PR is still worth mentioning — community contributions signal an open project.
- Coordinate with messaging team on timing: the rename and logos.dev fleet deployment could affect article content.
