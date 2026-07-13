# Logos Messaging in Testnet v0.2: A Real API Surface

**Component:** Messaging (formerly Waku)
**Audience:** App developers, Rust/FFI devs, protocol engineers
**Status:** First draft

---

Messaging protocols have a habit of being either easy to use or safe to use. The easy ones hide a server somewhere in the middle (and everything that server can see and log). The safe ones hand you a pile of p2p protocols and wish you luck. I've spent years around the second kind, and I can tell you exactly where developers give up: somewhere around the third protocol they're forced to understand before sending one message.

Testnet v0.2 is Logos Messaging deciding that this is an API design problem, and shipping the design.

## One library, three floors

Delivery is now a single library, `liblogosdelivery`, with a tiered API. Think of it as three floors of the same building:

**The Kernel API** is the ground floor: low-level control for people who need to reach the protocols directly. If you're building infrastructure or doing something the higher tiers didn't anticipate, this is your escape hatch, and its existence is what lets the other tiers stay simple without becoming cages.

**The Messaging API** is where most builders should live. Send, subscribe, health. Behind the scenes it picks the right protocols for your situation: full nodes relay, resource-restricted clients (browser, mobile) use light protocols for sending and receiving. The design goal stated in the roadmap is my favorite kind: remove the foot-guns. There's no store-as-CDN anti-pattern to fall into, because message retrieval isn't a separate thing you manage; it happens inside `subscribe`, with the reliability protocol filling gaps for you. You don't need to know what a relay or a light push is. That's the point.

**The Reliable Channels API**, new in v0.2 as a developer preview, is the floor I'm most interested in. It gives a channel these properties: every message is eventually received by all participants, senders learn when messages are acknowledged, missing messages are detected and fetched automatically, unacknowledged sends are resent, and everything is causally ordered with Lamport timestamps. Encryption is delegated to whatever the consumer provides, and when you apply it, the sync envelope itself is encrypted. Under the hood this is the [Scalable Data Sync](https://github.com/vacp2p/rfc-index/blob/main/vac/raw/sds.md) protocol plus SDS-Repair, an extension that reduces reliance on store services and improves receiver anonymity over the base protocol.

Developer preview means what it says. SDS hasn't been hammered in production, and repair traffic needs careful tuning so a lossy network doesn't turn into a repair-request storm. The team knows it. If you build on it and find the sharp edges, that's the feedback the preview exists to collect.

There's also QUIC transport support now, which matters more than it sounds for anything running on real-world networks.

Why a layered API instead of one clean interface? Because "one clean interface" is a lie at either extreme. Make it low-level and you've excluded everyone without a networking background. Make it high-level only and the first developer with an unusual requirement forks your library. Layers are how the protocol gets to evolve underneath without breaking the apps on top. The docs cover [how the protocols work](https://docs.logos.co/messaging/concepts/understand-logos-messaging-protocols) and [how to use the Delivery module from an app](https://docs.logos.co/messaging/delivery-module/use-logos-delivery-module-api-from-app), so I won't restate them here.

## Chat eats its own cooking

The strongest evidence the API design works: Logos Chat, the flagship messaging app, is built on it. Not on privileged internals. The [Chat module](https://docs.logos.co/messaging/chat-module/build-logos-module-that-uses-chat-module-api) consumes the Delivery module through the same surface any third-party developer gets.

And Chat did real work in v0.2:

Group chats are backed by decentralised MLS (de-MLS), meaning end-to-end encrypted groups without a central delivery service handling membership. One-to-one chat was rebuilt as a two-person MLS group, which sounds like an implementation detail until you realize it's what makes multi-device support fall out for free. A KeyPackage registry removes the out-of-band key-bundle exchange that has annoyed users of every E2EE messenger since forever. Identity and conversation state now persist, and causal-history gap detection catches the messages your device missed while it was asleep.

Where this sits in the transaction lifecycle: coordination. Before anything touches the chain, parties negotiate, quote, agree, and coordinate, and if that layer leaks, the privacy of the eventual transaction is already compromised. Private settlement (covered in the [blockchain article](logos-blockchain-testnet-v02-draft.md)) needs private coordination or the adversary just watches you talk instead of watching you transact.

## What I'd push on

The delivery module is deployed to the testnet with OpenMetrics support, so the network's behavior is measurable, and I want to see those numbers under load. My open questions: how does the Messaging API's edge mode hold up on hostile mobile networks, and where does SDS-Repair's backoff land between "responsive" and "storm". If you're building against the preview APIs and hit either, holler at me. This is exactly the release cycle where that feedback changes the design instead of arriving too late to matter.

---

*Roadmap sources consulted (strip before publishing): `context/roadmap/content/testnets/v02.md`, `v02-release.md`, `context/roadmap/content/messaging/roadmap/milestones/2026-messaging-api-developer-preview.md`, `2026-reliable-channel-api-developer-preview.md`.*
