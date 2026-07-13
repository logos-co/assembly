# Logos Messaging in Testnet v0.2: A Real API Surface

**Component:** Messaging (formerly Waku)
**Audience:** App developers, Rust/FFI devs, protocol engineers
**Status:** First draft, adversarially reviewed (2 rounds; see changelog)

---

Messaging protocols have a habit of making you choose between convenience and metadata. The easy ones put a server in the middle: your content might be end-to-end encrypted (Signal does this well), but somebody's infrastructure still sees connection times, IP addresses, and traffic patterns, and hiding who-talks-to-whom from your own server takes engineering most operators never do. The serverless ones hand you a pile of p2p protocols and wish you luck. I've spent years around the second kind, and I can tell you exactly where developers give up: somewhere around the third protocol (relay? store? filter? light push?) they have to understand before sending one message.

Testnet v0.2 is Logos Messaging deciding that this is an API design problem, and shipping the design.

## One library, three floors

Delivery is now a single library, `liblogosdelivery`, with a tiered API. Think of it as three floors of the same building:

**The Kernel API** is the ground floor: low-level control for people who need to reach the protocols directly. If you're building infrastructure or doing something the higher tiers didn't anticipate, this is your escape hatch, and its existence is what lets the other tiers stay simple without becoming cages.

**The Messaging API** is where most builders should live. Send, subscribe, health. Behind the scenes it picks the right protocols for your situation: full nodes relay, resource-restricted clients run in edge mode and use light protocols for sending and receiving. The design goal stated in the roadmap is my favorite kind: remove the foot-guns. There's no store-as-CDN anti-pattern to fall into, because message retrieval isn't a separate thing you manage; it happens inside `subscribe`, with the reliability protocol filling gaps for you. You don't need to know what a relay or a light push is. That's the point.

**The Reliable Channels API**, new in v0.2 as a developer preview, is the floor I'm most interested in. The contract it's specified to deliver:

- every message in a channel is eventually received by all participants
- senders learn when their messages are acknowledged
- missing messages are detected and fetched automatically
- unacknowledged sends are resent
- everything is causally ordered with Lamport timestamps

Encryption is delegated to whatever the consumer provides, and when you apply it, the sync envelope itself is encrypted. Under the hood this is the [Scalable Data Sync](https://github.com/vacp2p/rfc-index/blob/main/vac/raw/sds.md) protocol plus SDS-Repair, an extension that reduces reliance on store services and improves receiver anonymity over the base protocol. What v0.2 actually contains: the API spec and shape, SDS wired into the channel implementation, the first SDS-Repair implementation, and a persistence layer. The contract above is the target the preview exists to converge on, not a promise the testnet has already kept.

Developer preview means what it says. SDS hasn't been hammered in production, and repair traffic needs careful tuning so a lossy network doesn't turn into a repair-request storm (the team's own risk notes say the linear backoff should become exponential). Two scope limits worth knowing before you build: RLN-based rate limiting is explicitly out of scope for the Messaging API preview, and Reliable Channels ships without message segmentation or the rate-limit manager (both slated for general availability). If you build on the previews and find the sharp edges, that's the feedback they exist to collect.

Why a layered API instead of one clean interface? The serious alternative isn't some strawman single-function library; it's what most SDKs do, one high-level API sprouting configuration flags every time somebody needs an exception. That road ends with the flags becoming the real API, undocumented and load-bearing. Tiers move the exceptions to a different floor instead of a different flag (ask me again in three releases whether that stayed true). And I won't pretend layers make the mess below disappear: p2p realities (peer churn, lossy links, NATs) leak through the cleanest surface, which is exactly why the Messaging API ships a health endpoint instead of a promise. Layers don't hide the network; they decide who has to care about which part of it.

There's also QUIC transport support now, which for anything living on real-world networks means connections that survive the stuff that kills TCP sessions, like mobile handoffs and unfriendly NATs. The docs cover [how the protocols work](https://docs.logos.co/messaging/concepts/understand-logos-messaging-protocols) and [how to use the Delivery module from an app](https://docs.logos.co/messaging/delivery-module/use-logos-delivery-module-api-from-app), so I won't restate them here.

## Chat eats its own cooking

Logos Chat is built on this API surface, and that's new. In v0.1, Chat embedded Delivery directly as a library dependency, exactly the privileged-internals shortcut you'd expect from a first release. v0.2 is where it moved onto the public surface: the [Chat module](https://docs.logos.co/messaging/chat-module/build-logos-module-that-uses-chat-module-api) now consumes the Delivery module as a module, the same integration path the docs describe for everyone else. I'll be honest about what that does and doesn't prove: dogfooding by the team that owns the API is weaker evidence than a third-party success story, because when the internal consumer hits a wall, the API can bend to fit. What it does do is force the tiers to survive contact with a real application, and the fixes that contact forced in v0.2 landed in the same API you get. Your walls will be your own; the ones Chat already found shouldn't be among them.

And Chat did real work in v0.2:

Group chats are backed by decentralised MLS (de-MLS), meaning end-to-end encrypted groups without a central delivery service handling membership. A KeyPackage registry removes the out-of-band key-bundle exchange that plagues E2EE systems with no server to hand the bundles out (centralized messengers solved this ages ago; doing it without the center is the actual work). Identity and conversation state now persist, and causal-history gap detection catches the messages your device missed while it was asleep.

The move I keep chewing on: one-to-one chat was rebuilt as a two-person MLS group. Sounds like an implementation detail until you notice it buys multi-device support with machinery the group-chat work already had to build. The price is carrying MLS group state for every conversation, including the two-person ones. The bet is that one hardened code path beats two special-cased ones, and I think it's the right bet, but it is a bet.

Why does chat plumbing matter to a network whose endgame is private settlement? Because transactions don't start on the chain. Parties negotiate, quote, agree, and coordinate first, and if that coordination layer leaks, the adversary gets the map of who's dealing with whom before anything settles. Private settlement with leaky coordination (the settlement side is covered in the [blockchain article](logos-blockchain-testnet-v02-draft.md)) is a vault with a sign-in sheet: contents safe, visitors logged.

## What I'd push on

The delivery module is deployed to the testnet with OpenMetrics support, so the network's behavior is measurable, and I want to see those numbers under load. Everything above describes a design and its first internal consumer; whether the design *works* is what this testnet cycle exists to find out. My open questions: how does the Messaging API's edge mode hold up on hostile mobile networks, and where does SDS-Repair's backoff land between "responsive" and the repair-storm scenario above. If you're building against the preview APIs and hit either, holler at me. This is exactly the release cycle where that feedback changes the design instead of arriving too late to matter.

---

*Roadmap sources consulted (strip before publishing): `context/roadmap/content/testnets/v02.md`, `v02-release.md`, `context/roadmap/content/messaging/roadmap/milestones/2026-messaging-api-developer-preview.md`, `2026-reliable-channel-api-developer-preview.md`.*

*Publish-time TODO: replace the relative blockchain-article link with its published URL.*
