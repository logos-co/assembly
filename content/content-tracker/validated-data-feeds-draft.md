---
title: "Validated by Default: Why Logos Treats Every Data Feed Like a Blockchain Transaction"
description: "Modularity makes systems flexible, not trustworthy. Logos closes that gap by making cryptographic validation the default for all inter-module communication."
draft: false
tags:
  - logos
  - architecture
  - cryptography
  - p2p
---

## The assumption you never have to remember

When you send a transaction to a blockchain, you don't decide to trust that it's immutable. The immutability is why you're there in the first place. Your smart contract, your trade, the NFT you're staring at, all of it assumes the ledger doesn't rewrite itself under you. You reason from that assumption. You never sit down and re-derive it.

Most guarantees in software work the other way around. Validate the input. Sanitize the payload. Check the signature. Cross your fingers the other service did its job. The blockchain took one guarantee and moved it out of "stuff you have to keep doing" and into "stuff that's just true because of how the thing is built." That's the move worth stealing.

Logos steals it for a much bigger surface: every piece of data moving between modules in the stack, not just transactions hitting a chain. Below I'll walk through the mechanism, and I'll be straight about which parts are actually specified and which are still half-built, because the specs are in active draft and pretending otherwise would be dishonest.

## Modularity is necessary. It is not sufficient.

Modularity gets you upgradability, parallel development, swappable implementations, clean boundaries between teams. The Logos stack leans into it hard: consensus, storage, and messaging are separate modules, written in their own native languages, composed together.

Here's the catch. Modularity buys flexibility. It does not buy safety. Every boundary between two modules is a spot where data crosses from one trust domain into another, and when Module A pulls a feed from Module B, A has to decide whether to believe it. In most systems that decision is an unexamined "yeah, sure," propped up by the assumption that everything's running in one process, on one machine, under one operator.

That assumption dies the second a module runs somewhere else. A peer's machine. A third party's server. The far side of a network hop. Now "I'll just trust the data" isn't an architecture, it's a liability. Your options are to bolt ad-hoc verification onto every boundary that needs it (slow, inconsistent, easy to screw up) or admit your "modular" system is a monolith that only works when everybody runs everything locally.

Logos makes validation a property of the boundary itself. Every inter-module message is shaped so its integrity checks against a commitment, the same way an Ethereum light client checks chain data. You don't remember to validate. You can't skip it.

## The pattern already runs in production: Nimbus' Ethereum light clients

Ethereum, post-Merge, splits a node in two. The consensus layer (the beacon node) tracks the proof-of-stake protocol and decides the head of the chain. The execution layer handles transactions, smart contracts, and user state. Most people run neither. They ask a JSON-RPC provider, some untrusted third-party server, to tell them the state of the chain, and they believe the answer.

The [Nimbus Verified Proxy](https://github.com/status-im/nimbus-eth1/blob/master/nimbus_verified_proxy/README.md) shows the better way. It exposes the standard Ethereum JSON-RPC Execution API, forwards your calls to a configured-but-untrusted web3 provider, and verifies the responses by requesting Merkle proofs and checking them against the state hash. It follows the tip of the chain with the consensus-layer light client, which tracks the sync committee (a 512-member subset of validators) instead of the full set of roughly a million. That's what makes it cheap enough to run on a phone, and it turns an untrusted provider into a verified source any normal wallet can point at.

Two things make it work:

1. **State is a tree, and trees produce proofs.** Ethereum stores its state as a tree. You can request one value, your balance, a single storage slot, and verify it with a Merkle proof against the state root, without holding or re-executing the whole state.

2. **The proof travels with the data.** An adversarial, slow, or wrong server can only ever fail your check. It can't hand you a false answer that passes.

Now, the part people get wrong when they get excited: verification doesn't eliminate trust. It relocates and shrinks it. Run a full node and you trust your own hardware and client software to compute the right answer. Run a light client against a third-party node and you swap that for trusting the light-client software to verify correctly, plus one small external anchor (the Nimbus proxy has to be handed a recent trusted block root to start syncing). You didn't delete the trusted thing. You traded a big, hard-to-audit trusted process for a small, auditable one. The whole game is making that verifier small enough to run everywhere, the way TLS quietly runs under every connection you make without you thinking about it.

So you can pull data from a machine you have no reason to trust and shrink what you actually have to trust down to a small verifier plus a known-good anchor, because correctness rides along with the data instead of being vouched for by the source. Ethereum built this rig for chain state and nothing else. But nothing about it is chain-specific.

## How Logos generalizes it

Turning "data carries its own proof" into a general property of inter-module comms takes three pieces. The Logos module specs, in draft as [LIP PR #317](https://github.com/logos-co/logos-lips/pull/317), define them.

**Canonical bytes: deterministic CBOR (dCBOR).** You can't hash data meaningfully if the same logical value can serialize two different ways. [CBOR](https://cbor.io/) is a compact binary serialization format; deterministic CBOR pins it down so a given value has exactly one valid encoding. No canonical bytes, no agreement on a hash, no anything.

**A description of shape: CDDL.** [CDDL](https://datatracker.ietf.org/doc/html/rfc8610) describes the structure of the data: what fields exist, what types they hold, how messages are shaped. It lets a module introspect another module's API instead of hardcoding assumptions about it, which matters a lot when the two ends might be running different versions. And since the schema is itself data, you can hash and version it too.

**A commitment: merkleization.** Data described by CDDL and encoded as dCBOR compresses into a Merkle tree whose single root hash stands in for the whole structure. A consumer holding the expected root verifies received data against it, proving only the fields it actually needs, exactly like the light client verifying chain state.

Module emits a feed. Feed is canonically encoded, schema-described, merkleized. Any consumer, local or remote, verifies it against a commitment before acting on it. The thing that makes this a differentiator instead of a footnote: it's the default path, wired into the runtime and the codegen, not a library some careful developer has to remember to call.

## The trust model is plural

Logos does not have one clean trust model that reduces to a single Merkle check, and you should be suspicious of anyone who tells you it does. The dCBOR and CDDL machinery gives Logos a native trust model for data that originates inside Logos. The rest of the world does not speak one proof system.

Ethereum shows this inside its own light client. The execution layer commits to state with Merkle-Patricia-Trie roots. The consensus layer commits with SSZ roots. The two aren't interoperable, so the software has to translate across the seam: verify against one root system, re-anchor into the other. That translation point is a trust bridge, a spot where one verified domain hands off to another and something has to vouch for the crossing.

These bridges chain, the way TLS certificate chains do. You verify a website by walking a chain of certificates up to a root you already trust, each link vouching for the next. Logos ends up in the same place: trust modules that verify one proof system and bridge it into another, composed into chains that terminate at an anchor you picked.

Under that model, "verify a Merkle proof against a known-good root" is just one verification primitive among several. TLS fits the same framework: "I trust whatever this certificate signed" is a different check ("validate the certificate") sitting in the same slot where another module runs "validate the Merkle proof." That's what lets Logos consume and re-verify data from systems that will never touch dCBOR, without dropping the guarantee at its core.

## Why this scales

Conventional decentralized systems pay a tax: to avoid trusting anyone, everyone runs everything. A node validates by re-executing. That chains the whole stack to the weakest device on the network. The resource-heavy parts, storage, indexing, computation, either get centralized (which defeats the point) or get crammed onto hardware that can't handle them (which chokes the network).

Self-verifying feeds cut that tax by splitting where computation happens from where trust lives. A resource-heavy module runs on a big machine and broadcasts its output to lightweight instances that verify it cheaply. The phone doesn't re-run the computation, it checks a proof. Same trust guarantee as running it locally, a fraction of the cost.

- Without validated feeds: decentralize trust, replicate computation, get bound by the weakest device.
- With validated feeds: decentralize trust, verify instead of replicate, put computation wherever it's most efficient.

The specs already anticipate running modules on remote servers controlled by third parties, which is exactly why Logos Core is being built to authenticate data against consensus. The verification layer exists because remote, untrusted execution is the destination, not an afterthought.

## What validation does and doesn't guarantee

Being precise here matters, because the audience that cares is the audience that will catch you overclaiming.

**It guarantees** that the data you got is the data the producer committed to: unaltered in transit, conforming to a schema you both agree on, matching the root hash you expected. Integrity and authenticity. The producer can't corrupt, truncate, or reshape the data without failing your check.

**It does not guarantee** that the producer computed the right answer. A proof that data matches a commitment is not a proof that the committed data reflects reality. If a module is supposed to return the median of a dataset and instead commits to a wrong number, merkleization will faithfully prove you received that wrong number, fully intact.

There's one case where the distinction collapses: when the commitment is consensus. If the root you're checking against is anchored to the blockchain, "matches the commitment" and "is true" become the same statement, modulo the residual trust in your verifier and your anchor. That's the light-client case.

So the guarantee is layered. For consensus-anchored feeds, validation gives you truth, because the commitment is the canonical state. For arbitrary module-to-module feeds, it gives you integrity and authenticity against an agreed schema, which is the base you build correctness on with extra mechanisms stacked on top: verifiable computation, staking and slashing, reputation, redundancy. Most modular systems don't give you even that second property by default.

## What's still being built

The specs are in active draft. The open problems are where the hard work lives, so here they are.

**Schema versioning and proof-path fragility.** A Merkle proof is a path through a tree. Change the shape of the data (add a field, reorder, remove something) and the path changes, so proofs and interfaces can break across versions. One proposed discipline is strict additive evolution: new versions may only add, never remove, because removal breaks existing proofs. Another proposal on the review is a tree hash over the schema itself, so recurring structures (a "date" object, say) become independently recognizable and versionable wherever they show up. Not settled.

**Canonical schema representation.** To hash a schema you first need a parser-independent canonical form of what the schema says. The draft introduces a deterministic CDDL layer (called *cdCDDLe* in the PR) for exactly this, deliberately kept below Logos-specific semantics so the canonical-bytes layer and the policy layer don't tangle together. Early days, test vectors still going in.

**Determinism constraints leak into the type system.** Floats are a problem for reproducible hashing, so the working direction is to pull floating-point types out of the normative interface model rather than hand-wave the non-determinism. That's a real expressiveness cost, taken on purpose to buy verifiability.

**The commitment model and hash profile are raw.** The contributors themselves flag the commitment model and physical hash profile as heavily work-in-progress: hash-input bytes, digest vectors, suite selection, runtime integration, all still being nailed down.

**The cost lands on the producer, and it isn't zero.** Verification is cheap, which is the whole reason a phone can check a server's work. Producing validated feeds is not free: canonical encoding, merkleization, and proof generation all cost something. But that cost gets paid once by the producer and amortized across every consumer, and it's bounded and predictable instead of ad-hoc.

## Why Logos is different

CBOR, CDDL, merkleization, light-client verification: all known, all available, all off-the-shelf. Anyone could assemble them. "We use Merkle trees" is not a moat. What Logos actually does is make the verifiable path the default, system-wide: generated by the toolchain, wired into the runtime, applied at every boundary whether the module on the other side sits in your process or on a stranger's server. The parts everyone else skips, canonical schema hashing, deterministic encoding, versionable proof paths, the codegen that hides all of it from module developers, are the parts getting specified right now.

- **Secure:** data crossing a module boundary carries its own proof, and the consumer verifies integrity and authenticity against a commitment before acting, the same mechanism that lets an Ethereum light client safely consume data from an untrusted RPC.
- **Scalable:** self-verifying feeds split where computation runs from where trust lives, so heavy work runs on heavy machines and broadcasts safely to light ones.
- **Different:** most systems treat validation as a feature you add to specific data paths. Logos treats it as a property you can't opt out of.

Blockchains work because immutability is a property of the system, not a chore users keep up with. This is the same trick applied to validated data across an entire application stack. That's the pitch, and it's checkable against the spec instead of taken on faith.

---

*The interface, runtime, and transport specs discussed here are in active draft as [logos-co/logos-lips PR #317](https://github.com/logos-co/logos-lips/pull/317). Anything I called work-in-progress is exactly that. Holler if you think I got the trust model wrong.*
