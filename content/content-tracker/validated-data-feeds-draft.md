---
title: "Validated by Default: Why Logos Treats Every Data Feed Like a Blockchain Transaction"
description: "Modularity makes systems flexible. It does not make them trustworthy. Logos closes that gap by making cryptographic validation the default substrate for all inter-module communication: a property you can't opt out of rather than a feature you remember to add."
draft: false
tags:
 - logos
 - architecture
 - cryptography
 - p2p
---

## The assumption you never have to remember

When you send a transaction to a blockchain, you don't *decide* to trust that it's immutable. You don't add a mental footnote to verify it later. The immutability is the reason you're there. Everything you build on top assumes it: the smart contract, the trade, the NFT you're looking at. You reason about the chain *from* that assumption, not *toward* it.

That's a rare and valuable property in software. Most guarantees in most systems are things you have to actively maintain. Validate this input, sanitize that payload, check this signature, hope the other service did its job. The blockchain's trick is that it moved a guarantee from something you *do* into something that simply *is*. The structure of the system makes the guarantee free to assume.

Logos is built on a bet that this property, guarantee-as-substrate rather than guarantee-as-discipline, shouldn't be reserved for on-chain transactions. It should be how **every piece of data moves between every module in the stack.**

This article makes the case for that bet, explains the machinery that makes it real, and, because the relevant specifications are still being written, is honest about which parts are solved and which are open problems we're actively working through.

---

## Modularity is necessary. It is not sufficient.

Modular architecture is having a moment, and for good reason. Splitting a system into independent, composable modules gives you upgradability, parallel development, the ability to swap implementations, and clean boundaries between teams. The Logos stack is aggressively modular: consensus, storage, and messaging are separate modules, and the runtime is designed so that modules can be developed in their native languages and composed freely.

But modularity, on its own, buys you flexibility rather than safety. A boundary between two modules is just a place where data crosses from one trust domain into another. The moment Module A consumes a feed from Module B, A has to answer a question: *do I believe this?* And the default answer in most modular systems is an unexamined "yes," held together by the assumption that everything is running in the same process, on the same machine, under the same operator.

That assumption is exactly what breaks when you try to scale a decentralized system. The instant a module might run somewhere else, on a peer's machine, on a third party's server, behind a network boundary, "I'll just trust the data" stops being an architecture and starts being a liability. You either bolt on ad-hoc verification at every boundary that needs it (slow, inconsistent, easy to get wrong) or you accept that your "modular" system is actually a monolith that only works when everyone runs everything locally.

Logos's answer is to make validation a property of the boundary itself. Every inter-module message is structured so that its integrity can be checked against a commitment, the same way an Ethereum light client checks chain data. You don't remember to validate. You can't *not* validate.

---

## The existence proof already runs in production: Ethereum light clients

This isn't a thought experiment. The pattern Logos generalizes is already in production in Ethereum, and the talks underlying this article walk through it in detail.

Ethereum, post-Merge, splits a node into a **consensus layer** (the beacon node, which tracks the proof-of-stake protocol and determines the head of the chain) and an **execution layer** (which handles transactions, smart contracts, and user state). Most users never run either. They talk to a JSON-RPC provider, an untrusted third-party server, that *claims* to tell them the truth about the chain.

The naive version of this is dangerous: you're asking a stranger what your balance is and believing the answer. The robust version, which Ethereum actually supports and Status ships today, is a **light verifying proxy**. The [Nimbus Verified Proxy](https://github.com/status-im/nimbus-eth1/blob/master/nimbus_verified_proxy/README.md) is a working example: it exposes the standard Ethereum JSON-RPC Execution API, forwards calls to a configured but untrusted web3 provider, and verifies the responses by requesting Merkle proofs and checking them against the state hash. It follows the tip of the chain using the consensus-layer light client, which only needs the **sync committee**, a 512-member subset of validators, rather than the full validator set of roughly a million. That's what lets it run cheaply on a phone, and it turns an untrusted provider into a verified data source that any standard wallet can point at.

Two structural facts make this work, and both are the heart of why it generalizes:

1. **State is a tree, and trees produce proofs.** Ethereum represents its state as a tree structure. That means you can download the *specific* piece of data you asked for (your balance, one storage slot) and verify it with a Merkle proof, without holding or re-executing the full state. You fetch a little and check a little, instead of replicating everything.

2. **The proof travels with the data.** The server can be adversarial, slow, or wrong, and the worst it can do is fail your verification check. It cannot feed you a false answer that passes.

But here's the part that's easy to state too cleanly, and it's worth being exact about, because the whole design philosophy downstream depends on getting it right. Verification does not *eliminate* trust. It *relocates and shrinks* it.

If you run a full node yourself, you trust it implicitly: you trust your own hardware and the client software to compute the right answer. If you run a light client against a third-party node, you've swapped that for trusting the *light-client software* to perform verification correctly, plus a small anchor of external trust (the Nimbus proxy, for instance, has to be handed a recent trusted block root to start syncing from). You haven't removed the trusted thing. You've traded a large, hard-to-audit trusted process for a small, easy-to-reason-about one.

That reframing is the actual goal, and it's a better story than "trust the math." The journey is to make the verification component ever smaller and easier to reason about, until it's small enough to run *everywhere*, the way TLS quietly runs under every connection you make without you thinking about it. A verifier you can audit and embed ubiquitously is worth far more than a vague appeal to cryptographic magic.

With that correction in hand, the light client is still the thesis in miniature: **you can consume data from a machine you have every reason to distrust, and reduce what you must trust down to a small, auditable verifier plus a known-good anchor, because correctness is carried by the data rather than vouched for by the source.**

Now ask the obvious question. If this works for "what's the state of the Ethereum chain," why is it limited to that? Why isn't *every* data feed in *every* system built this way?

The answer is mostly historical: nobody made it the default. Ethereum built the proof machinery for chain state specifically. Logos's move is to recognize that nothing about the pattern is chain-specific, and to make it the substrate for the entire module system.

---

## How Logos generalizes it

To turn "data carries its own proof" from an Ethereum-specific feature into a universal property of inter-module communication, you need three things. The Logos module specifications, currently in draft as [LIP PR #317](https://github.com/logos-co/logos-lips/pull/317), define them.

### 1. Canonical bytes: deterministic CBOR (dCBOR)

You cannot hash data meaningfully if the same logical message can serialize two different ways. Hashing is byte-exact; "the same thing" must mean "the same bytes." [CBOR](https://cbor.io/) (Concise Binary Object Representation) is a compact binary serialization format. **Deterministic CBOR (dCBOR)** constrains it so that a given logical value has exactly *one* valid encoding. Canonical bytes are the non-negotiable foundation. Without them, no two parties can ever agree on a hash, and the entire proof structure collapses.

### 2. A description of shape: CDDL

[CDDL](https://datatracker.ietf.org/doc/html/rfc8610) (Concise Data Definition Language) describes the *structure* of the data: what fields exist, what types they hold, how messages are shaped. This is what lets a module **introspect** another module's API rather than hardcoding assumptions about it, which matters enormously in a system where the two ends may be running different versions. The schema is the contract, and because it's data, the contract itself can be hashed and versioned.

### 3. A commitment: merkleization

Structured data described by CDDL and encoded as dCBOR can be compressed into a Merkle tree, where a **single root hash represents the entire structure.** That root is the commitment. A consumer holding the expected root can verify that data received from an untrusted producer matches it, field by field, with proofs for just the parts it cares about, exactly as the Ethereum light client verifies chain state against consensus.

Put together: **a Logos module emits a feed; the feed is canonically encoded, schema-described, and merkleized; any consumer, local or remote, trusted or not, can verify it against a commitment before acting on it.** That is a validated data feed. And the architectural decision that makes it a differentiator rather than a footnote is that this is the *default path*, wired into the runtime and the codegen, rather than an optional library a careful developer might remember to call.

---

## The trust model is plural, and that's the interesting part

It would be convenient to claim Logos has one uniform "native" trust model and everything reduces to a single kind of Merkle check. That's not true, and pretending otherwise would collapse under the first real integration. The dCBOR and CDDL machinery establishes a *native* trust model for data that originates inside Logos. But Logos does not live in a vacuum, and the wider world does not speak one proof system.

Ethereum itself already shows this. Inside the light client there's a seam between the execution layer, which commits to state with Merkle-Patricia-Trie roots, and the consensus layer, which commits with SSZ roots. Those two proof systems are not interoperable. The software has to *translate* across the boundary, verifying against one root system and re-anchoring into the other. That translation point is a **trust bridge**: a spot where one verified domain hands off to another, and something has to vouch for the crossing.

These bridges chain, the way TLS certificate chains do. You don't verify a website by checking one signature; you follow a chain of certificates up to a root you already trust, and each link vouches for the next. The likely shape of Logos over time is the same idea generalized: **trust modules** that can verify one proof system and bridge it into another, composed into chains that terminate at some anchor you've chosen to trust.

Under that lens, "verify a Merkle proof against a known-good root" stops being the only verification primitive and becomes one option among several. TLS itself becomes expressible as a verification mechanism in this framework: "I trust whatever this particular certificate signed" is just a different check ("validate the certificate") sitting in the same slot where another module might do "validate the Merkle proof." The native Logos model is the well-lit center; the trust bridges are how it reaches everything it doesn't natively control. This is more honest than a one-model story, and it's a more powerful architecture, because it means Logos can consume and re-verify data from systems that will never adopt dCBOR, without abandoning the guarantee at its core.

---

## Why this unlocks scale that other architectures can't reach

Here is the payoff, and it's the strongest part of the argument.

Conventional decentralized systems face a brutal tax: to avoid trusting anyone, **everyone has to run everything.** Your node validates because it re-executes. That forces the entire stack down to the capability of the weakest participating device: laptops, desktops, phones. The resource-hungry parts of the system (heavy storage, indexing, computation) either get centralized (defeating the point) or get crammed onto hardware that can't really handle them (throttling the whole network).

Validated data feeds break this tax by **separating where computation happens from where trust lives.**

If a feed is self-verifying, then a resource-demanding module can run on a large machine (a server, a datacenter, a beefy peer) and *broadcast its output to lightweight instances that verify it cheaply.* The phone doesn't re-run the computation. It checks a proof. The trust guarantee is identical to running it locally; the resource cost is a tiny fraction.

This is more than a minor optimization. It inverts the usual relationship between decentralization and resource demands:

- **Without validated feeds:** decentralize trust, must replicate computation, bounded by weakest device.
- **With validated feeds:** decentralize trust, verify instead of replicate, computation lives wherever it's most efficient.

The talks underlying this article are explicit that this is the *intended destination* rather than a happy accident: the specifications anticipate a shift toward running modules on remote servers controlled by third parties, and that is precisely *why* Logos Core is being designed to authenticate data against consensus in the first place. The verification layer exists because remote, untrusted execution is the goal. The network gets to scale the way a decentralized network naturally should, with heavy lifting on heavy machines and verification everywhere.

---

## Being precise about what validation does and doesn't guarantee

This is where the argument has to be careful, because the most damaging thing we could do is overclaim to exactly the audience capable of checking. So, plainly:

**What a validated feed guarantees:** the data you received is *the data the producer committed to*, unaltered in transit, conforming to a schema both sides agree on, and matching the root hash you expected. Integrity and authenticity. The producer cannot quietly corrupt, truncate, or reshape the data without failing your check.

**What it does not, by itself, guarantee:** that the producer *computed the right answer.* A proof that data matches a commitment is not a proof that the committed data reflects reality. If a module is supposed to return the median of a dataset and instead commits to a wrong number, merkleization will faithfully prove you received that wrong number, intact.

This distinction has a crucial special case where it collapses, and that case is the most powerful one. **When the commitment *is* consensus**, when the root you're checking against is anchored to the blockchain, then "matches the commitment" and "is true" become the same statement, modulo the residual trust we were careful about above: you're still trusting your verifier and your choice of anchor. That's the Ethereum light-client case, where checking against the sync committee's signed root is as good as the chain's own guarantee.

So the honest framing is layered:

- For **consensus-anchored feeds**, validation gives you truth, because the commitment is the canonical state.
- For **arbitrary module-to-module feeds**, validation gives you *integrity and authenticity against an agreed schema*. You are guaranteed to be seeing exactly what the producer published, which is the foundation correctness can be built on, with additional mechanisms layered on top: verifiable computation, staking and slashing, reputation, redundancy.

Both are enormous. Neither requires hype. And the second is *still* a property almost no modular system offers by default. Most can't even guarantee you received unaltered data conforming to a shared contract, let alone do it automatically at every boundary.

---

## The honest part: what's still being built

The specifications are in active draft, and the engineering tensions are real. Naming them strengthens the argument rather than weakening it. It's what separates a vision from a sales pitch, and the open problems are exactly where the hard, differentiating work lives.

**Schema versioning and the fragility of proof paths.** This is the deepest open problem, and it shows up in both the talks and the spec review. A Merkle proof is a path through a tree. Change the shape of the data (add a field, reorder, remove something) and the path changes, which means *proofs and interfaces can break across versions.* One proposed discipline is strict additive evolution: new versions may only *add*, never remove, because removal breaks existing proofs. Another live proposal in the review is a **tree hash over the schema itself**, so that recurring structures (a "date" object, say) become independently recognizable and versionable wherever they appear. This is not settled. It's being worked.

**Canonical schema representation.** Before you can hash a schema, you need a parser-independent canonical form of what the schema says. The draft introduces a deterministic CDDL layer (referred to in the PR as *cdCDDLe*) for exactly this, and it deliberately stays *below* Logos-specific semantics, so the canonical-bytes layer and the policy layer don't entangle. Early-stage, with test vectors still being added.

**Determinism constraints leak into the type system.** Determinism is demanding. Floating-point numbers, for instance, are problematic for reproducible hashing, and the working direction is to **remove floats from the normative interface model** rather than wave away the non-determinism. That's a real expressiveness cost, accepted deliberately in exchange for verifiability. It's the kind of tradeoff that signals the work is serious.

**The commitment model and hash profile are raw.** As of the latest pushes, the contributors themselves flag the commitment model and physical hash profile as heavily work-in-progress: hash-input bytes, digest vectors, suite selection, and runtime integration are all still being specified.

**The cost is real, even if verification is cheap.** "Validation for free" is the seductive shorthand, and it's wrong in the direction that matters. *Verification* is cheap, which is the whole point; it's what lets a phone check a server's work. But *producing* validated feeds has a real cost: canonical encoding, merkleization, proof generation. The honest claim isn't that it's free. The cost is **paid once by the producer and amortized across every consumer**, and it's bounded and predictable rather than ad-hoc. Cheap to verify, worth the cost to produce.

---

## So why is Logos different, with proof rather than hype?

It's worth being precise about what the moat actually is, because "we use Merkle trees" is not a moat. CBOR, CDDL, merkleization, and light-client verification are all known, available primitives. Anyone *could* assemble them.

The differentiator is architectural commitment: **Logos makes the verifiable path the path of least resistance, system-wide.** Validation isn't a library you import for the one feed you remembered to secure. It's the default substrate of the module system, generated by the toolchain, wired into the runtime, applied at every boundary whether the module on the other side is in your process or on a stranger's server. The hard parts others skip (canonical schema hashing, deterministic encoding, versionable proof paths, the codegen that makes it invisible to module developers) are precisely the parts being specified in the open right now.

That's what lets us point to *why* Logos is private and secure without resorting to adjectives:

- **Why secure:** because data crossing a module boundary carries its own proof, and a consumer verifies integrity and authenticity against a commitment before acting, the same mechanism that lets an Ethereum light client safely consume data from an untrusted RPC.
- **Why scalable:** because self-verifying feeds decouple *where computation runs* from *where trust lives*, so heavy work can live on heavy machines and broadcast safely to light ones, instead of forcing the whole network down to the weakest device.
- **Why different:** because everyone else treats validation as a feature you add to specific data paths, and Logos treats it as a property you can't opt out of.

Bring it back to where we started. The reason blockchains work is that immutability isn't something users maintain. It's something the system *is*, an assumption solid enough to build a trillion-dollar ecosystem on without anyone consciously invoking it. Logos's bet is that *validated data* can become that same kind of assumption for an entire application stack: a floor you stand on rather than a discipline you practice.

We're not asking developers to remember to verify. We're building a system where they never have to.

---

*The module interface, runtime, and transport specifications discussed here are in active draft as [logos-co/logos-lips PR #317](https://github.com/logos-co/logos-lips/pull/317). The architecture is real and the direction is set; the specifics cited as work-in-progress are exactly that, and are being worked in the open.*
