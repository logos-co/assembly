# Logos Team Updates — Transcript
*Episode 1 of 3 · Logos Core & Anonymous Communications*

---

## Introduction

**Host:** Hello everyone. We do not have introductory music today. We're starting off this three-part series of team updates from all the Logos engineering teams, in the effort of making sure that when we get to the all-hands in like a week, we're all going to be on the same page — and that we're not spending that precious day just listening to updates and getting tired when we're all together.

Being together is really important. It's a precious time. So I'm trying to frontload as much of that work as we can so that you can all watch these things before we get there, and we spend that time together wisely.

We're going to do this in the order of the stack diagram. We'll start at the bottom with **Logos Kernel and Logos Core** with Yuri, then move up to **Anonymous Communications** with Hano. Tomorrow we'll cover the **Blockchain team** — both the consensus layer and the execution environments with LE/Leaz — and then on Wednesday we'll do **Logos Storage and Logos Messaging**. Up first: Yuri, take it away.

---

## Part 1 — Logos Core
*Presenter: Yuri*

**Yuri:** Welcome to the presentation on Logos Core. We're going to talk about the different components we've been working on for the developer journey, and at the end I'll show a quick demo of the app we've built.

The CCs have been developing modules and apps for Logos Core, and we learned a lot from that. There are some changes we've made to come up with better tooling and a better developer experience, so that when external CCs start to develop for this platform, there's a better experience waiting for them. You should also see in this presentation not just where we are, but where we're going.

### Build Tooling — Logos Module Builder

The first step in the pipeline is the build process itself. The issue we faced — and it's still currently the case — is that there's a lot of configuration files needed. It gets a bit messy: lots of makefiles, Nix files, and things that have to happen under the hood. This led to some inconsistency between projects. For example, some would have code generation, others would not, and this would lead to things not working as expected, and different conventions across the board.

So we built the **Logos Module Builder** to simplify all of this. From running it in one of the modules, it essentially removes most of the Nix files, massively simplifies CMake to just a few lines, and also simplifies the flake massively. It does everything under the hood — everything that's actually specific to Logos — so the developer only needs to worry about their specific dependencies or libraries they're using. We achieved this by essentially referencing the Logos module as the main input, and then it takes care of everything else.

This has multiple advantages: it makes the development process far easier than currently, and if we update the underlying technology, everything should just work for the module developer — they don't need to change anything. We can automatically push changes to all modules at once. There's a command to scaffold a new Logos module from a template, and there are also AI skills to create new modules and update existing ones. The skill to update existing modules is quite handy — it does a pretty good job.

Right now, most modules aren't actually using this yet. We plan to upgrade them after the all-hands.

### Logos Module Abstraction

There's a common misunderstanding that we're doing Qt plugins or using Qt — that's not the right way to think about it. What we're doing is a **Logos module** that just happens, at the moment, to be implemented in Qt. This might or might not be the case in the future.

From the developer perspective, they're creating a Logos module. They shouldn't care about the underlying implementation. They just care that they're doing a Logos module that has particular properties and works in a particular way within the context of Logos Core.

We introduced this library to make that abstraction clearer. We're in the process of upgrading things — right now it's a bit in-between, with a lot of things still referring to Qt directly, but the intention is to upgrade everything to the Logos module abstraction. That way, if we ever update the plugin implementation from Qt to something else, no changes are required from any module developer.

For example, right now loading a Logos module requires defining a Qt plugin loader and a Qt object. With Logos module, you just say `logos_module.load(this)` — nothing to do with Qt. We also provide a command line to load a module, see its metadata, inspect methods, and interact with it.

### SDK / API

This all leads to the **API and SDK**, which provides a consistent interface across all platforms. The pattern is: `logos.{module_name}.{method}(parameters)`. You can see this looks very similar across JavaScript, C++, and Rust — slight syntax differences due to language conventions, but the same pattern. The same applies to the event system — developers have consistent event names they can rely on and a consistent way to handle them.

A couple of town halls back I made quick demos using the SDKs to take the chat module and use it in an Electron app, in a terminal chat app, and inside the Logos app — completely different technologies, yet the base module was the same. This is what we aim for: take our technology and make it very easy for anyone to use in any platform without worrying about the details.

### Logos Package (LGX)

Now that we have the module, we need a way to distribute it. We have the **Logos Package**, which we call LGX. It's essentially a tar.gz file with a manifest and per-platform variants. Those variants can contain multiple files, generally with a main file. We'll be adding digital signatures to ensure integrity. We provide a command line to interact with these packages, which is useful for developers building them.

### Package Manager (LLPM)

For distribution, we built **LLPM** (the Logos package manager) — a tool for listing, searching, and installing modules. It's available as both a command line and a library (a pattern we aim for throughout: maximum flexibility). At this stage, since it's a proof of concept, we're publishing and downloading packages from GitHub. You can check the Logos Modules repo to find all the modules in the releases. The intention is to eventually fetch and download packages from a decentralized system — that's the next stage.

### Execution — LibLogos

Finally, the execution phase, where **LibLogos** runs each module in an isolated manner for security and stability. Currently they run in the same process, but it's quite possible that later modules will run in containers or even on different machines — and yet they can all talk to each other.

The graph might be a bit misleading because it looks like everything only talks to Logos Core, but modules actually can talk to each other directly. The core ensures they have permissions to communicate with the right ones — you might authorize a module to talk to your wallet, but you don't necessarily want all modules to have that access. The core also manages sessions, so modules can run on different machines while the developer uses the same API regardless. The routing of messages is completely abstracted.

There are three ways to execute: (1) a dedicated app using the SDK with whatever language you want, (2) running the Logos Core command line in headless mode, or (3) using the Logos super app. Headless mode lets you pass a folder of modules, choose which ones to load, and automatically handles dependencies (e.g., loading the chat module will automatically load the wallet module since it's a dependency).

### Logos Base Camp (App Demo)

For the end user we have the **Logos app**, which we're calling **Logos Base Camp**. As Jared put it: "Logos is the parallel society; Logos Base Camp is the interface to it." It includes a package manager as a built-in app, plus wallet, chat, storage, accounts, and others at launch.

*(Demo section)* — So this is the current app. We do actually have the icons working; there was a last-minute technical issue in the demo but it all works. You can see the Logos Core entries loaded, CPU and memory usage, the Wacu module running (using quite a bit of CPU since it's running as a full node), the chat interface, accounts, the wallet using the Go Waku/Go Wallet SDK, and the package manager installing modules. Other teams will demo their specific apps, so I'll leave those for them.

**Host:** Quite the progress there, Yuri. Daniel will be here and we can take questions at the end. For now, let's move on with Hano and anonymous communications. Thanks, Yuri. Take it away, Hano.

---

## Part 2 — Anonymous Communications (Noncoms)
*Presenter: Hano*

**Hano:** I'll be giving an update on what the Noncoms team has been doing, and also using this as an opportunity to introduce the team to those who don't know us. After the reorg, many teams map to something that existed before, but Noncoms is one of the new teams.

I had a little chuckle at our officially published road map description: *"the Noncoms team is the team that does anonymous communication"* — which is exactly not helpful at all. I hope to hereby make amends.

Think of Noncoms as a merger of what used to be the ACZ team, the VAC team, and the Waku Research teams. Many of the tracks we work on are continuations of that prior work, and now it's consolidated against the Logos launch strategy.

### Team Philosophy

I want to take a leaf out of Frank's book and explain the methodology we follow, because I think it illuminates the update that follows.

**Protocols are products.** For a research-based team, this is very important. Practically, it means our specifications themselves are first-class deliverables.

**Modularity and reuse.** You'll hear me say things like "API" and "interface" a lot — in a world of modular components, your API specification and interfaces are how you communicate about protocols and how they integrate into various stacks and applications.

**Build early PoCs.** In some cases, these PoCs are even the point at which we hand over an implementation to another team for full development. This allows us to get very fast feedback on how well a protocol works, which feeds back into the protocol itself. Where we hand over implementation, we continue to act as a red team to battle-test it.

**Language:** N and Rust depending on the track.

I'll go through each track answering three questions: What do we do? What are we building and why does it matter for Logos? And what have we done so far / what are the next steps?

---

### Track 1 — Capability Discovery

This is the **top priority** for the team. The best way to explain it is to sketch the problem.

Within any peer-to-peer topology, the first thing a peer that joins the network needs to do is find other peers to connect to — this is the process of discovery. Within Logos, of course, we want this discovery method itself to be decentralized. If you have a centralized way of discovering peers, you can very easily take down the whole network by attacking that single point.

There already exist decentralized discovery protocols — most are based on DHTs (Distributed Hash Tables). These allow you to find random groups of peers that participate in a specific P2P topology. But these protocols don't currently allow for an efficient way to discover peers that support *specific capabilities* — peers that support the specific protocols necessary for your application.

If you have a very specific type of service you need to find nodes for, the best you can do is grab a bunch of random peers and hope the ones you're interested in are among them. This is famously called the "needle in a haystack" problem for discovery, and the more heterogeneous your environment, the more difficult it becomes.

In this track, Noncoms is developing an efficient, **decentralized capability discovery mechanism**.

Why does it matter for Logos? This is the critical cornerstone — Logos is an extremely heterogeneous environment with all kinds of modules, applications, and stacks. Each needs to find the peers that matter for that application to work properly, and you need an efficient way to do that without losing the integrity of the system. We're building this as a general discovery module that can be incorporated into any Logos app.

**Progress so far:**
- Three new specifications published: (1) encoding capabilities within P2P sign records, (2) filtering based on capability within Kad-DHT discovery (fully implemented and part of our demo app for testnet), and (3) the full capability discovery protocol with published API and near-complete PoC implementation.
- This is mostly an adaptation of a paper by EF researchers called "DiscovNG" (Discovery Next Generation).
- Working on integration into Logos Chat and Logos Delivery as first steps.
- Benchmarking will be critical — we know the new protocol will greatly improve efficiency, but large-scale simulations are needed to answer "is it good enough?" We'll collaborate with TSD here.
- Discovery at the protocol level is not anonymous, so we'll be introducing ways to anonymize these interactions.

---

### Track 2 — Mix (Anonymity Layer)

This is where the bulk of the "anon" in Noncoms is currently happening — developing all of the tools to **anonymize communications at the routing level**. Practically, we're developing the Lipid Mix protocols (plural), which is a set of interacting features providing a modular suite of anonymity features, combined into one or more mix layers for Logos communications.

If the word "mix" is new to you: conceptually, think of it as infrastructure-layer routing anonymity. You mix packets of communication into a large anonymity pool, send them over multiple hops, introduce random delays, so that eventually all traffic looks exactly the same — and there's no way to correlate where messages are coming from, where they're going, or what applications they belong to.

Much of the Lipid Mix protocol was already developed before the consolidated Noncoms effort. One of the first challenges we addressed as the Noncoms team was designing a way to protect the mix layer itself against DoS and Sybil attacks. We developed a **pluggable mechanism based on RLN** — pluggable because we want this to be useful for other applications that may want to set up their own mix layers with different authentication rules.

Why does it matter for Logos? This is core to the ethos. You can't really have sovereign communities if your infrastructure itself doesn't provide the kind of privacy preservation that's foundational to setting up those communities.

We've had very fruitful collaboration with the Logos Storage team to use Mix to anonymize various parts of file sharing — storage researchers have been great partners.

**Progress so far:**
- Mix spec and implementation ready.
- Pluggable protection mechanism with RLN: spec ready, PoC implementation done.
- Mix integrated into **Logos Delivery** (the new name for what was the Waku module).
- Demo chat app available for testing — will be part of the upcoming Logos testnet. You can already use Mix to publish messages anonymously. The demo app also demonstrates the capability discovery API (this is how the mix network is formed).

**Next steps:**
- Ongoing collaboration with Storage for file sharing anonymization.
- Upcoming Mix features: long-lived mix circuits, cover traffic generation, provider anonymity, multiple mix layers for different application needs.
- Service incentivization for the mix layer.

---

### Track 3 — Service Incentivization

This is a continuation of prior research — we're developing a **privacy-preserving payment protocol**, with the first aim of using it to incentivize decentralized service provision. "Services" here means infrastructure-based services we rely on: serving historical messages, acting as storage providers, providing anonymous publishing endpoints, and so on.

The first step is a mostly off-chain protocol backed by an on-chain privacy-preserving payment stream on Leaz as the rail.

Why does it matter? Robust infrastructure is decentralized infrastructure. With a growing focus on mobile adoption, reliance on service infrastructure will only grow — this is one way to incentivize decentralization and avoid single points of failure and censorship. Community members should be able to participate in service provision and be compensated for it. The protocol is also pluggable for general incentivization use cases, and there are good conversations happening about translating payment streams to Leaz.

**Progress so far:**
- Raw spec (LIP) for the off-chain part of the protocol published — go read it and comment.
- Active collaboration with the Leaz sub-team and others on challenges for implementing payment streams in the Leaz environment.
- Working to demonstrate how this practically works within the Waku Store protocol first.

---

### Track 4 — DMLS (Decentralized Messaging Layer Security)

MLS is the industry standard protocol for secure group messaging, with many excellent features. However, it contains two very centralized parts: (1) how messages are delivered between group members, and (2) group authentication and key distribution.

We're building **DMLS** — addressing both points of centralization. Message delivery is relatively straightforward (plug in Logos Delivery/Waku). For authentication and key agreement, we're building a new **off-chain consensus protocol** with group voting and dispute resolution mechanisms.

Why does it matter? This will most likely be the first fully decentralized protocol for group messaging that has all the wonderful features of MLS. If you're a sovereign community, the communication between members is extremely important. We're integrating it into the Logos Chat module — this is how group chats will work.

**Progress so far:**
- DMLS fully specified.
- Rust implementation complete.
- API published with specification.
- A sub-module for off-chain consensus is also separable and reusable on its own.
- Working with the Logos Chat team to integrate DMLS into the chat stack for group messages.
- More advanced features in progress: multi-stakeholder groups, Leaz resyncing, and more.

---

### Track 5 — Rate Limiting Nullifiers (RLN)

RLN is being used quite fundamentally across a wide variety of Logos use cases. There are general RLN problems requiring dedicated attention, so this is now its own track.

Currently one contributor is focusing on the first milestone: addressing a specific bottleneck to RLN adoption — obtaining RLN membership. For RLN, you need an on-chain membership (requiring an on-chain transaction) before you can use an RLN-backed service. Even if you make this free, it's a psychological hurdle.

We're developing a **membership allocation protocol** — a service module that distributes RLN memberships based on a pluggable authentication mechanism. In the process, we're also porting RLN from an EVM-based environment to Leaz.

Why does it matter? RLN is already essential for Logos Chat and is now the way we protect the mix layer against DoS and Sybil attacks. EF researchers recently published a proposal on using RLN for payment mechanisms for APIs. Medium-term, we want Logos modules requiring RLN memberships — for chat, for the mix layer — to get sufficient memberships without requiring each user to do an on-chain transaction, using pluggable authentication instead.

This is also, as far as we know, the first Merkle tree implementation on Leaz.

**Progress so far:**
- Raw spec for membership allocation protocol published (WIP).
- Active collaboration on implementing RLN within Leaz.
- Notable contribution from Storage Research on improving Poseidon hash generation in Leaz.

**Longer-term:** Improved proof generation, slashing, better UX, expanding applications — this all falls under this track.

---

### Track 6 — Gasless Transactions

In this track, Noncoms is more of a service unit supporting the Status L2 effort to enable free transactions on Status L2, based on reputation measured by some Comm balance. The mechanism is based on RLN.

We're developing the RLN tools necessary to support this — specifically an **RLN prover module**. One thing I'm particularly excited about: as part of this effort, we're adding a way to burn multiple message IDs in a single RLN proof. This shifts RLN from pure rate-limiting to something more like *quota limiting* — a more precise tool. Instead of "X messages per second," you can say "you have this bandwidth available." We haven't fully realized the potential of this improvement yet.

We're also developing a reusable RLN prover module and testing RLN for high-rate use cases and other scenarios it hasn't been tested for before.

**Progress so far:**
- Spec and implementation ready for the RLN prover module.
- Draft white paper on achieving gasless L2 transactions with RLN — I encourage people to read it. We're planning to submit it to the SPC conference.
- Planning to eventually allow local proof generation from the wallet with a ZeroKit-backed approach.

---

### ZeroKit

ZeroKit is our Rust-based collection of zero-knowledge modules specifically for RLN. We are the maintainers of this library, and it's the foundational library for all RLN integrations across Logos. API available in Rust with FFI, C, and WASM.

We just finished a major API rework — it's all much simpler now. There's a new API spec I'd encourage people to experiment with.

**Upcoming:**
- Improved Poseidon hash generation (based on Storage Research's suggestion — we saw almost a 300% improvement in proof generation time).
- Multi-ID burning for RLN flexibility.

---

### Closing

If you scan the QR code, it takes you to our landing page on the Logos road map. And that's it from me.

**Hano:** That's it. Nothing else. That's not a lot. I can keep talking, by the way.

---

## Q&A

**Host:** Thanks, Hano. Yuri and Daniel, you're up on screen. If there are any questions, feel free to ask them in the chat and we'll handle them live. Otherwise, throw them in a Discord channel and ping me. Is there anything you want to add, Daniel or Yuri?

**Daniel:** Nothing to add from my side. We'll have an overview at the offsite across the testnets, but that'll be part of the offsite agenda.

**Host:** I'll have the agenda published by end of week so everyone has a general idea of the flow of the day before the Parallel Societies event. Juliano has a question for Yuri.

---

**Juliano:** Do we have — or will we have — a skeleton generator for Logos apps, like we have for modules? Or maybe compact documentation with a small example to refer to?

**Yuri:** Yes, we will have that. We'll focus first on pure Logos modules, then do something for the apps themselves.

**Host:** I saw Andrea from the smart contracts team shipped a demo of something like a Foundry equivalent for Logos. Is that related to what Juliano is asking about, or different?

**Yuri:** I believe those are different things. Juliano, I think you're referring to a generator and template for building the UI part of Logos apps — similar to what we're now doing for modules themselves?

**Host:** Right.

**Yuri / Host:** So adding to that — the Foundry model is for deploying things on Leaz, and then EcoDev will be building a scaffolding layer on top that uses your components. That's planned for after Testnet v0.1. We'll also get much better documentation on how to write modules and apps. Between automation, scaffolding, and documentation, it should be much easier.

As a heads up: Frank was hoping to be part of this town hall but couldn't make it. He's recording a video on EcoDev's efforts — which probably includes some of that scaffolding — that we'll distribute alongside these recordings.

**Yuri:** Yes. From the Logos R&D side, we need to provide better documentation. I just had a call with Frank — EcoDev will focus first on deploying contracts on Leaz, since that's already testable and needed for external apps. For the scaffolding, they're waiting on better documentation, which makes sense — it's better to have them red-team the docs with fresh eyes rather than having us guide them through, since we might assume too much prior knowledge.

---

## Closing

**Host:** I don't see any other questions. Thanks, Juliano, for speaking up.

**Tomorrow:** Blockchain team — both Mantle and the execution zones (Leaz and Logos Blockchain). That'll take up the hour.

**Wednesday:** Storage and Messaging — that wraps up all the engineering teams for status updates.

This should mean we're all on the same page when we get to Lisbon for the all-hands. Very much looking forward to it all. If you need something, want something, or don't know something about what's going to happen at the all-hands, please message me now — it's all pretty wrapped up at this point, but maybe I can fit something in.

Remember: at the end of the event, and even during the festival part, we have the room for off-site focused work. So: all-hands event, then focused work afterwards. Looking forward to it. See you tomorrow.
