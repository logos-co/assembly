# Logos Team Updates — Transcript
*Episode 3 of 3 · Logos Messaging & Logos Storage*

---

## Introduction

**Host:** We're live. Welcome back everybody — round three of the Logos team updates. Today we have Juliano and Igor with Storage and Messaging respectively. We're going to start with Igor to give an update on Logos Messaging, how things are going, and he's got some sweet demos for us. Take it away.

---

## Part 1 — Logos Messaging
*Presenter: Igor*

**Igor:** I do have sweet demos — we'll do those at the end. I'll be talking about Logos Messaging, but at the bottom of my slides you'll see two instructions. Please run them now if you want to participate in the demo at the end. They'll stay visible throughout the presentation since the build takes some time.

### What Is Logos Messaging?

Logos Messaging consists of two main parts. Before the restructuring, this was all called Waku — Waku was split into a few teams, one of which is Logos Messaging.

Logos Messaging delivers two products:

- **Logos Delivery** — formerly called Nim-Waku, this is the transport layer.
- **Logos Chat** — a layer built on top of Logos Delivery.

Most of these things have been working for a while. For 2026, our goal is **batteries included** — one of the Logos requirements for mainnet. It should be easy to use Delivery, and easy to build a chat app. That's our focus now.

### Why Is Logos Delivery Hard to Use Today?

Let me walk through the developer experience as it stands. Imagine you're a developer who hears about Logos Delivery — a decentralized network, you want to send and receive messages peer-to-peer. Great. What do you do?

First, you need to find some peers. You input an ENR from the docs and use a bunch of protocols to discover them. Okay, you figured it out — it wasn't easy, but can you send a message now? Not quite. You first have to select a protocol to send your message, then select a protocol to receive it. You have to know the differences between them. You need to know which PubSub topic to publish to. You also need to know what a PubSub topic is.

Okay, so you've figured all that out and you're sending and receiving messages. Surely it guarantees delivery? Well... no. You can publish messages, but you're limited to 150 kilobytes, there are zero delivery guarantees, and your node might go offline. You need another layer on top for reliability — spam protection, segmentation, retransmission handling for disconnected nodes, redundant publishing to multiple nodes. A lot of things.

All of this is what we want to simplify for external developers.

### What We're Building: Two New APIs

We're building two layers on top of the existing stack:

**Messaging API** — handles peer discovery, protocol selection, PubSub topics, and peer-to-peer internals automatically. You just say: connect to Logos Testnet, set edge mode (there will be two modes — core for desktop and edge for mobile), and you're ready to send and subscribe. Everything else is handled internally.

**Reliable Channel API** — adds delivery guarantees: segmentation, retransmission, redundant publishing. Built on top of Messaging API.

Here's roughly how easy we want this to be:

```js
const node = logos.connect("testnet", { mode: "edge" });
node.send(topic, message);
node.subscribe(topic, handler);
```

PubSub topics, peer-to-peer, reliability — all handled internally.

### Current Status

**Messaging API** — developer preview. Send and health APIs are ready. Subscribe and receive are in progress. A developer preview should be merged before the Parallel Societies festival.

**Reliable Channel API** — scheduled for the next testnet. Prerequisites are ready: the segmentation library has been extracted from Status, and the SDS library is ready to go. (I know Hano tried to avoid acronyms — I'm going to do the opposite and use all of them and hope you know them.)

**Support Status track** — we've integrated SDS into Status Communities. Phase one (unwrapping messages) is done. After two release cycles we'll introduce wrapping messages, which will actually start using SDS.

**Nim FFI library** — this has been implemented, which is very important for Logos Core integration. It allows building Nim bindings, C bindings, and so on.

**Build system** — we're switching from Nimbus's build system to Nimble. Coming very soon, let's say March.

### What's Next

- Messaging API moves to general availability (tested and dog-fooded) by next testnet
- Subscribe/receive API fully supports edge mode
- Reliable Channel API introduced by testnet v0.2, using RLN on Logos Execution Zone
- Logos Chat switches from its current low-level kernel API to the Messaging API
- Status Communities fully switches to SDS
- Longer-term: migrate Status to Logos Delivery and eventually to Logos Chat — two very big tasks, somewhere down the road

### Logos Delivery Module in Logos Core

Here's roughly how the Logos Delivery module API looks in Logos Core today. It's very simple: create a node, start it, send messages, subscribe to content topics, and receive messages through signals. That's the Messaging API. Reliable Channel API will come later.

---

### Logos Chat

So now, as our developer character — surely I can have secure conversations with my friend using Logos Delivery now? Not quite. And that's where Logos Chat comes in.

**Goal:** Implement secure, decentralized conversations using Logos Delivery as the transport.

**Architecture** — the most important thing we've done so far. It's modular: you can replace encryption, transport, or individual components. Conversation types are abstracted cleanly.

**What's done:**
- Ephemeral 1:1 encrypted chats are ready (ephemeral meaning: close the app, restart it, history is gone — persistent history is an extension that developers can implement their own way)
- Forward secrecy and post-compromise security via the Extended Triple Diffie-Hellman and Double Ratchet protocols
- Standard end-to-end conversation privacy
- Content topics for routing
- Introduction bundles with identity and encryption information (currently served out-of-band — this will be improved later)
- Content types are up to the consuming app — Logos Chat is an SDK

**What's coming:**
- Group chats via DMLS from the Noncoms team
- Conversation and message persistence (two separate concerns: persisting ratchet keys/secrets vs. persisting chat history)
- Post-quantum encryption
- Contact discovery (listed twice on the slide because it's very important)
- Identity (a large, important upcoming piece)

Most of what's listed — especially group chats and identity — is targeted at testnet v0.2.

### Module Structure in Logos Core

We deliver two modules for Logos Core: **Chat SDK Module** and **Chat SDK UI**. (Don't confuse these with Logos Chat Module and Logos Chat UI, which are earlier proof-of-concept names — we'll clean that up.)

For testnet v0.1, the Delivery module is still embedded inside the Chat module. For testnet v0.2, Chat will consume the Delivery module as a separate module. Further out: identity module, peer-to-peer module, capability discovery, and more — all wiring together.

---

### Demo — Logos Chat

*(Demo in progress)* — For those who managed to build it ahead of time, you can participate now. I'm sharing my introduction bundle in the stream chat — if you're watching on YouTube and want to join, you'll need it. Note: each introduction bundle is single-use, so only the first person to use each one gets a chat.

I'm running Logos Core without the Logos Base Camp app — just the raw modules. The app is running two modules: Chat SDK Module and Chat SDK UI.

Creating an introduction bundle, copying it to clipboard. Now from a second instance: typing "Hello from All Hands" and sending. Let me restart just in case there's been a disconnection — we're not using the Reliable Channel API yet, so no retries. Using the introduction bundle again... and there it is. Message received.

*(Additional instances join)* — We have a few chats open. Messages are flowing. The Logos Delivery node is running on infrastructure, not locally — these messages are actually transiting the internet.

And someone just texted me: "Hello from Jazz." Hello Jazz! Not arranged in advance. Thanks Jazz for participating.

*(Demo ends)* — Not too bad. I thought it was going to be worse.

---

**Host:** Awesome, thanks Igor. Looking forward to playing with it more at the all-hands.

**Igor:** I hope it'll actually work fully by then.

**Host:** I tried it on Fedora and it wasn't quite there — which means Frank gets to fix that since he also uses Fedora. Great work from the messaging team.

---

## Part 2 — Logos Storage
*Presenter: Juliano*

**Juliano:** All right, let's talk about Logos Storage.

### What Is Logos Storage?

The most straightforward answer: it's the storage layer for the Logos stack. But to understand what that means in practice, you need to look at where Logos Storage is today, and where we want to take it.

**Today**, Logos Storage looks a lot like file sharing — it allows you to publish, download, and replicate files over the network.

### The API

Let me walk through the raw C++ Logos Storage module API, which is what we want to refine over time. (There will also be other bindings via lib storage, but C++ is the main thing today.)

**Publishing a file:**
1. You have a Logos modules object provided by the lib logos runtime during module initialization.
2. Configure and start the node — a simple synchronous call that gives you back a result object.
3. Call `start()` — this is asynchronous, so you listen on a signal/event to know whether it succeeded.
4. Call `uploadURL(path)` — this publishes a local file to the network. Despite the name "upload," you're not sending it to anyone; you're making it available on the network.
5. On completion, you get back a **Content ID (CID)** — a string that uniquely identifies your file in the network. You share this CID with others so they can download it.

**Downloading a file:**
1. Same node setup process.
2. Call `downloadURL(cid, localPath)` — this fetches the file corresponding to that CID from the network and writes it locally.

### How the Network Actually Works

Suppose you're Node A and you publish a file. Under the covers, your node is part of a DHT (Distributed Hash Table) with the other nodes in the network. When you publish:
- The DHT finds the node closest to your CID.
- You add yourself as a provider at that node (replicated across roughly the 8 nearest nodes).
- The result: the subset of nodes responsible for that CID has a list saying "A is providing this file."

When Node B wants to download:
- B does a `get_providers` query against the same nodes.
- B learns that A is sharing the file.
- B connects directly to A and downloads blocks using a BitSwap-like protocol.
- As B accumulates blocks, it can start serving them to other peers — slowly building a full replica.

If more peers download, they form a mesh with gossip-like properties: randomized connections, churn resilience, and load balancing. This is a model proven since BitTorrent — roughly 20 years of validation. The network tries to maintain a k-regular graph, so no single node has to serve too many peers at once. In practice, this scales reasonably well with good load balancing.

### The Problems

**No persistence guarantees.** The replication model is organic: you download a file, you replicate it, you share it. If nobody cares about your file, it doesn't replicate. If you go offline, your file disappears from the network. There's no attempt to guarantee persistence.

**Privacy leaks everywhere.** When you query for a file, people can learn your IP and tie it to your CID query. When you retrieve a file, the serving node knows you're retrieving it and knows your IP. When you serve a file, the downloader knows you're doing that. In this sense it's not very different from IPFS or BitTorrent — they share the same problems, and so do we currently.

### What We've Done Over the Past Months

You might look at this and wonder what we've been doing. To explain: Codex — the predecessor to Logos Storage — was a full-fledged persistent storage solution with a marketplace and minimal privacy. We were running as a somewhat isolated team without proper specs, and the Logos requirements were quite different from Codex's goals.

**What we did:**

**Refocused and simplified.** We stripped the codebase down to minimum requirements: file sharing. That's what our codebase reflects now.

**Rewrote and optimized file sharing** — because it turns out Codex was actually bad at file sharing:
- Slow, with practical transfer rates of about 5 MB/s even in data center conditions.
- Couldn't handle files much larger than a few gigabytes.
- Download swarms couldn't be bigger than a few dozen peers before performance degraded.

The rewrite is a simpler protocol. Chris is currently testing it with very large synthetic file sizes. Results: transfer rates about **20x faster** than before, petabyte-scale file sizes, and swarms of hundreds of peers tested successfully. (There appear to be some remaining bottlenecks in the peer-to-peer layer, so it could get faster still.)

**Improved collaboration:**
- API bindings work — underway for a while, even before the Logos restructuring.
- Refactoring the Status cacheable startup service together with the Status team, so Logos Storage can serve as an option for their archival service instead of BitTorrent.
- Extensive joint research with the Noncoms team on RLN and privacy-preserving protocols.

**Focused the team.** We went from 20 people to a much smaller, more focused team. Painful restructuring, but the right call.

**Specs.** We had none. Now we have a few — still a long way to go, but quality and spec culture are improving steadily.

### What's Next

**By mainnet — privacy-preserving file sharing.**

We want to address the privacy leaks in the file sharing protocol: neither publishers nor downloaders should be linkable to their actions. The starting point we're looking at is Tribler and Tor.

Here's a flavor of how this could work. In the current model, Node A publishes itself as a provider for a CID. In Tribler's model:
1. Node A creates a Tor-like circuit. The tip of the circuit is called an **entry point**.
2. Instead of publishing A as the provider, it publishes the entry point as the provider. This hides A's identity both as publisher and server — people contact the entry point, not A, and the entry point doesn't know who A is.
3. Node B (wanting to download) also creates a circuit. B's circuit tip is an **exit point**.
4. B does its discovery query through the exit point and learns about the entry point.
5. B then creates a **rendezvous node** — a circuit to a separate node that acts as a meeting point.
6. B tells the entry point: "I want this data, use my rendezvous node."
7. A builds a circuit to the rendezvous node. Now A and B can exchange data without either knowing the other's identity.

The rendezvous node separation also helps with load balancing — for popular datasets, you don't funnel all traffic through a single entry point.

Note: what we've been investigating with Noncoms is more **mix-based** rather than circuit-based — mix networks are circuit-less. So our final privacy-preserving file sharing protocol may look somewhat different from Tribler, but the conceptual goal is the same.

**Longer term — incentivized durable persistence.**

Rather than organic persistence (waiting for people to download and happen to replicate your file), we want to instruct the network to replicate and store data, and incentivize providers to do so — with the usual dance of compensating honest providers and penalizing misbehaving ones.

We understand how to build this well in the non-private case. When you add the fully anonymous component, things get significantly more complicated. We still have meaningful research to do before we can design this confidently.

**Summary:** For the foreseeable future, Logos Storage is essentially **Logos File Sharing**, targeting privacy-preserving file sharing by mainnet. Incentivized durable persistence comes after.

---

### Demo — Logos Storage UI

*(Demo with Arno)* — Arno, my colleague, is joining from somewhere with a 16-hour flight distance from me here in Brazil.

The setup guide in the app walks you through network configuration — I'm using UPnP since I have it set up on my router. Reachability check... good. Arno is going to upload a file to his node and share the CID.

*(Arno uploads)* — Here's the CID. Let me fetch... a bunch of dead peers on my first attempt, fetch failed. Second time: fetched the metadata. Downloading... it's a dancing dog. Very good, Arno.

Now I'm going to share something a bit more constructive: Jared's book. Sharing the CID with Arno...

*(Arno downloads)* — Oh, immediate. Yes, very good. That was quick.

---

**Host:** All right — we've got file sharing, we've got chat, we've got message delivery. Things are working just in time.

**Host:** It's worth pointing out how significant the refocus has been across all these teams — messaging, storage, Noncoms — since Jared's launch strategy document was released. An enormous amount of effort has gone into refocusing all projects to funnel through Logos Core and building up the unified framework. That's a tremendous amount of work that doesn't get talked about enough. You all deserve a lot of credit for it.

**Juliano:** I wanted to say exactly the same thing. Yes. Special thanks to Arno who did the Logos Core integration on the storage side, Pablo and Zoltan doing great work, Patrick on the messaging side, and Yuri managing the Logos Core side. Very short notice for all of these things.

**Host:** One thing I want to add for future context: Logos Storage will be used for the **decentralized package manager**. So we'll be able to download additional Logos Core modules and apps in a fully decentralized way via Logos Storage. That's not visible in the testnet v0.1 yet, but it's on the testnet v0.2 roadmap.

And if you haven't seen it — in the All Hands / PS 2026 Discord channel, Frank from EcoDev posted a video covering all the efforts from the red team, EcoDev engineering, and ecosystem development: what's going on on the other side of engineering. I strongly recommend watching it alongside these updates. Together they give a really complete picture of where we are today.

---

## Closing

**Host:** All of this together — these three sessions plus the EcoDev video — means that as we come together in Lisbon in a few days, we should all be on a reasonably level page: what everyone's been up to, the status of how things fit together, what capabilities exist, and where the gaps are. That makes conversations much more productive.

If you know someone on your team who hasn't watched these, make them watch them. We're going to have a much better time together because we're all on the same page — I'm going to keep repeating that because it's very important.

I'll have the all-hands agenda — at least a work-in-progress draft — published by end of day. There are a few changes to shore up. In essence: four blocks of an hour and a half each, covering *what is Logos*, *how are we going to do it*, *who are we building for*, and *getting ready to go into the community*. Details to follow.

No questions in the chat today except Daario saying "Beautiful job, Arno" and that he "feels more decentralized just looking at it."

The transformation of the storage UI from when I last tried it to now — in about a week and a half, two weeks — is drastic. Arno works fast.

We're going to start seeing the fruits of all this labor very soon. Thank you everyone. See you next week.

**Igor / Juliano / Arno:** Thank you. Take care. Bye.
