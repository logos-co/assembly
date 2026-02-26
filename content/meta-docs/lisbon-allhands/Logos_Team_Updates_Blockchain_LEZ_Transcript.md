# Logos Team Updates — Transcript
*Episode 2 of 3 · Logos Blockchain & Logos Execution Zone (LEZ)*

---

## Introduction

**Host:** Hello everyone. Welcome back for another round of Logos team updates. These are effectively all-hands presentations so that we don't have to spend our one day together going through them — we can all do it beforehand and then spend our time talking and doing other things.

This time around we have David and Moody to talk about Logos Blockchain and the Logos Execution Zone (LEZ). Up first is David on Logos Blockchain. Take it away.

---

## Part 1 — Logos Blockchain
*Presenter: David*

**David:** Great. So I'm David, I lead the blockchain team. I'll talk about the blockchain and Moody will talk about LEZ afterwards.

I've spoken to quite a few people about the blockchain and tried to get their thoughts on it, and I think a lot of people don't fully understand what Logos Blockchain is and how to program it. There's a lot of uncertainty around: what is it, and how would you actually use it? We have no VM, no programming model. So beyond the team update, I want to give some background on what Logos Blockchain actually is, so people understand what we're building.

### What Is Logos Blockchain?

We're trying to build a **neutral, permissionless settlement layer for decentralized applications**. Breaking that down:

**Neutral** is a positive framing on censorship resistance. We want to make sure no single node has too much power, that nodes are free from coercion, don't feel like they have to restrict themselves when they participate, and aren't worried about being attacked or targeted.

**Permissionless** means very low requirements to join. Other protocols have quite high staking requirements or node requirements — we want to avoid all of that. We have no stake requirement. You can participate with one token, and there are very low hardware requirements to run a node.

**Settlement layer** refers to the distributed logs that decentralized applications generate when they run — transactions that are getting ordered and settled into the blockchain. Replicated logs are the foundational component of many distributed systems: you see them in databases (bin logs replicated from primaries to replicas), in Kafka-style queuing systems, and so on. We want to provide a replicated log that is maximally resilient and open to anyone.

### How We Achieve This: Two Prongs

**1. Private Proof of Stake (PPoS)**

PPoS makes it very easy for nodes to participate without risk. Our implementation uses two components: **Cryptarchia** and the **Blend Network**.

*Cryptarchia* is our consensus protocol — a Nakamoto-style protocol that uses a private stake lottery in place of Bitcoin's hash lottery. It has permissionless participation (zero stake requirements, one token is enough), and there is no slashing.

Cryptarchia alone is not sufficient for private proof of stake, because despite being a private stake lottery, anyone observing the mempool can triangulate block producers — you can find out which IP is generating blocks, and from the frequency of those blocks determine how much stake they have. So we layer on the *Blend Network*, an anonymization protocol that routes all block proposals through it. This obscures sender and receiver, so the people who receive a block proposal can't easily link it back to the proposer. They'd have to break the Blend Network to do that.

Why go to all this trouble? The end state is that we take on a lot of complexity into the protocol, and the outcome is a very low-stress, low-overhead node operation experience for end users. You're not exposed to the open internet, not worried about people finding out your node has a lot of stake, not worried about being targeted by hackers, not worried about consensus bugs causing a slash. If your node goes down, you might lose some block rewards — but you won't be slashed. It's a very low-overhead node operation.

**2. Minimal Execution Layer**

This is how we prevent censorship and prevent the network from centralizing too much. We want to be as free of MEV (maximal extractable value) as possible.

To contrast with Ethereum: Ethereum went with the Proposer-Builder Separation (PBS) architecture — builders operate separately from validators and produce the actual blocks. With roughly a million validators, a single entity (Titan) is currently producing 51% of Ethereum's blocks. Despite a highly decentralized validator set, one entity controls more than half of block production — that's a highly centralized system, and something we do not want.

To reject that end state, we take the opposite approach. The EVM is very rich — you can program it with all sorts of contracts, and that richness attracts MEV. We have a very **minimal execution environment** that has only the minimal operations needed to run a zone. This gives zones the freedom to select their own transaction model and their own VM, while leaving the L1 free from the complexity of choosing any particular VM. When you select a VM, you're locked into that model. Logos Blockchain is not.

### The Programming Model: Channels & Zones

Zones use **channels** to post inscriptions on Logos Blockchain. Channels are hash-parent-ordered inscriptions — effectively a virtual chain on top of the Logos Blockchain. The contents of messages posted in these channels are just opaque binary blobs. We do no execution on Logos Blockchain itself.

You bring your own VM and select your own transaction model. For example, LEZ has a very sophisticated transaction model supporting zkVM groups — something you couldn't easily encode in Solidity if you were trying to build on a rich L1. This gives zones full freedom to evolve their execution model independently.

### Recent Work & Decisions

The largest change to our design recently is that **we're no longer targeting Data Availability (DA) for mainnet**. This was a difficult decision — we put significant effort into DA, both in research and implementation. But the way we see it: DA is a scaling solution, and we should bring it in when we have scale. We're already doing three separate distributed systems — Cryptarchia, the Blend Network, and the zone architecture. Adding DA on top of that means four systems to design, debug, and implement, and we likely won't be able to do all of them at a high level of quality. And if we don't have the scale to require DA in the first place, it's not the right use of time.

That said, we're still doing active DA research, and post-mainnet we'll bring back the next generation of DA we've developed and integrate it into Logos Blockchain.

**Devnet progress:** We've run seven productive devnets. All CCs are running nodes on their Raspberry Pis. Nodes from IFT Lab have joined. We have four nodes running on infrastructure. Our longest devnet ran for 4 days — not because we couldn't go longer, but because some devnets were too stable and we weren't learning much. We've found and resolved many bugs, developed a **Zone SDK**, and built the Logos Core blockchain module, which has successfully connected to a devnet and synced with the chain.

**Current node capabilities:** Start/stop the node, inspect wallet key balances, and do Bitcoin-style UTXO transfers. That's essentially all we'll support for the v0.1 testnet.

---

### Demo — SQLite Zone

I'll do a quick demo of a zone we built using the Zone SDK, which we're calling the **SQLite Zone**.

The motivation: SQLite is a massively deployed database with hundreds of thousands of open-source applications using it — password managers, note-taking apps, and so on. They all share the same problem: *how do you sync your SQLite database across devices?* If you have a local password manager that uses SQLite, how do you get that data to another device?

We built a zone that intercepts SQL transactions to SQLite, posts them to a channel on Logos Blockchain, and then replicates them to any node following that channel.

*(Demo in progress)* — I have a blockchain node running with a block explorer following it. You can see the block height increasing. Now I'll start the sequencer for the SQLite zone. You can see it started up, noticed it had no existing channel, and created a new one by generating a random channel ID. Channels are very lightweight — you create them just by writing to an empty channel ID.

The test database has one table called `menus`. Let me run an insert: `INSERT INTO menus VALUES ('jello', 'extra jiggly')`. There we go — the SQL zone SDK intercepted the transaction, wrote it to the blockchain, and you can see the inscription a few blocks back. If I inspect the transaction, you can see the SQL command embedded in it.

Now I'll spin up an indexer, give it the same channel ID, and have it follow the channel for new SQL transactions. I'll do a `SELECT * FROM menus` — it's synced. I'll do another insert: `INSERT INTO menus VALUES ('revenge', ...)`. And now querying on the indexer side — it's already there. The node accepted the inscription, proved the block, and the indexer applied it to its own local SQLite database.

**Why is this interesting?** There are thousands of SQLite-based open-source applications that currently have no good syncing story. Imagine a locally-running Rust password manager that writes encrypted data to SQLite. Run a Logos Blockchain node on your phone — these are very lightweight nodes — and you get low-effort state syncing across all your devices. I think this is genuinely compelling for a whole group of people who just want reliable, decentralized sync.

---

### Roadmap to Mainnet

**Decentralized sequencing:** In the demo there was a single writer, many readers. For the final version, multiple devices should be able to write to the same channel, sync with each other, and resolve conflicts including reorgs. We aim to support this for mainnet, and hopefully for the June testnet — though I'm uncertain we can hit that.

**Bridging:** Support for bridging the Logos token from L1 up to zones and back. For this first testnet, Logos tokens on LEZ and on the L1 are two decoupled tokens — no bridging between layers. We'll add that before mainnet.

**Cross-zone messaging:** Support for synchronous and asynchronous cross-zone messages. For example, a state change in LEZ (like someone getting added to a DAO) could trigger a policy change in your SQLite-based password manager, automatically granting that person access to a shared password group. We have a design that supports both messaging modes and want this before mainnet.

---

**Host:** Thanks David. Now over to Moody for LEZ.

---

## Part 2 — Logos Execution Zone (LEZ)
*Presenter: Moody*

**Moody:** Hey, thank you David. I'll be talking about the Logos Execution Zone and the Logos Execution Environment.

First, I want to thank the Red Team, EcoDev team, smart contracts team, and everyone who has been writing programs and helping build cool things on LEZ — thank you all.

I'll give a brief overview of what LEZ is, what's changed since our last update in September, and if there's time, a quick demo of our block explorer.

### What Is LEZ?

The Logos Execution Zone is a **programmable blockchain with public and private state working together**. We offer protocol-level privacy, meaning developers write the same app logic regardless of whether inputs are public or private. For privacy, we use the RISC Zero zkVM to generate ZK proofs.

**How I like to describe it:** LEZ keeps the composability of a public chain while adding privacy by default. Users have the full spectrum — from fully private to fully public — and can mix them within the same application. There's also selective privacy, which I'll cover below.

The result:
- **Transparency:** The public state is visible and auditable.
- **Privacy:** The private state is hidden but verifiable.
- **Interoperability:** The same apps can touch both states without special handling or complicated transactions.

### Dual-State Architecture

We have two parallel states — one public, one private — but only one execution model.

**Public state** is an on-chain mapping from ID to account state — fully visible.

**Private state** uses commitments and nullifiers. Values are hidden within commitments; only whoever holds the viewing keys can read them. To prevent reuse of old private state, every commitment gets a nullifier when it's spent — once you nullify a commitment, it cannot be reused. Think of it as: `C1` is consumed (nullified), `C2` is consumed and has value `N2`, and the current commitment is `C3`.

The key design goal: **write programs without caring much about privacy, because privacy is handled at the protocol level.** Programs treat accounts uniformly — public or private — and the protocol handles all the privacy and verification.

Programs are stateless (no internal state; data is stored in accounts). Developers write normal program logic, explicitly declare account inputs, and use the same bytecode for both public and private state.

### Two Execution Types, One Bytecode

**Public execution:** On-chain, using the RISC Zero VM — no ZK proof required.

**Private execution:** Executed locally off-chain on the user's device. The user generates a ZK proof, which validators then verify on-chain. The only computational cost is proof generation on the user device.

This gives us:
- Fast public transactions (no ZK proof needed)
- Light validators for private transactions (they only verify proofs, not re-execute)
- Parallelism-friendly design (account-based model supports parallel execution)
- Composability by default (mix public and private accounts within the same app)

### What You Can Build on LEZ

The core design goal: provide the same services delivered by transparent blockchains, but with privacy-preserving features. Examples:

**Private payments** — sender and receiver can hide balances; the sender needn't reveal any information about the receiver.

**Confidential DeFi** — for example, an AMM where someone can trade with private positions while staying composable. Private swaps on top of a public AMM.

**Selective disclosure** — users choose the level of privacy they want moment to moment, and can reveal only what's necessary. For example, in a voting program: you can prove you executed the program and voted correctly while still hiding your identity. Later, you can choose to de-shield that transaction and reveal which vote was yours. Write the program once; run it publicly, privately, or both at the same time.

---

### Updates Since September

At the last all-hands in September, the architecture had: public/private state, privacy-preserving circuits, a wallet supporting only public native token transfers, and a centralized sequencer.

**What's changed:**

**Full integration with Logos Blockchain.** Our sequencer now posts LEZ blocks on top of Logos Blockchain. We have an indexer that parses these blocks from the blockchain, and a block explorer that can show every transaction, hash, block ID, and account ID — everything that's happening.

**Major wallet expansion.** We now support:
- Public and private native token transfers
- Public and private custom token transfers
- Piñata program (the wallet faucet — accounts can claim funds)
- Full privacy-preserving features for all wallet commands

**AMM program** — a basic AMM (no fees yet, but supports creating pools, adding/removing liquidity, and swaps).

**Token program** — create and transfer custom tokens, with NFT support. Fully working, with some limitations: fixed supply at creation, no freeze mechanism yet.

**Cross-calls (tail calls)** — a general mechanism for any program that needs to interact with other programs. Motivated by AMM swaps: when executing a swap, the AMM needs to internally invoke the token program to actually transfer tokens. Cross-calls enable that chaining. Our AMM is built on top of the token program and uses this mechanism.

**PDAs (Program Derived Addresses)** — implemented for public state. Motivated by the AMM: the AMM program needs to hold the tokens in a liquidity pool. Without PDAs, those tokens have nowhere to live. PDAs give the AMM program control over tokens not held by any individual user — the pool's remaining tokens live in a PDA controlled by the AMM.

**Written program tutorials** — full deployment and wallet tutorials added to the repo. These will also be covered in a workshop during the Parallel Societies event.

---

### Challenges Investigated (Q2 Implementation)

These are problems we've found solutions to but haven't yet implemented, having prioritized the blockchain integration:

**Mid-calls in cross-calls** — needed for flash loans and flash swaps. We've investigated and found a solution; implementation is queued.

**Block context** — some programs (e.g., voting) need to know the exact block range. We investigated and found an approach to add this to the architecture. Coming in Q2.

**Private account receivability** — right now, private accounts can't receive funds directly; you have to create a new account and have the receiver claim it. We found a way to allow sending to existing private accounts via execution continuation. Coming in Q2.

**Shared private accounts** — currently, private accounts can't be shared among multiple users. We investigated several approaches, settled on one, and still need to minimize the changes to the core architecture. This would enable things like a shared private pool for a private AMM.

**Still on the list:** The contention problem and decentralization of the sequencer.

---

### Demo — Block Explorer

*(Demo in progress)* — I'll run through this quickly. We have the Logos node running, the sequencer posting blocks on top of the blockchain, the indexer parsing LEZ blocks, and the wallet.

What I've done: created a public account, initialized it, and claimed some funds from the Piñata program. When I initialized the wallet, block 10 was submitted to the blockchain. When I claimed from the Piñata, another block was created (block 13). Both are parsed by the indexer.

Going to the block explorer: I can put in block ID 10 — it shows the hash, timestamp, and transaction. It has one transaction, one account involved — the account initialization. Clicking in, I can see there's no ZK proof (it's a public transaction), the hash, the program ID, and the account. Clicking on the account, I can see the balance is 150 tokens (what you get each time you claim from the Piñata), one nonce, the program owner, the account ID, and two transactions: the initialization and the Piñata claim. The claim shows two accounts involved — our public account and the Piñata account.

I can also look up block 13 by ID, or use the transaction hash directly. Both show all the relevant information. There's a small bug where account listings don't display in one view, but we're fixing it.

That's the LEZ update. Looking forward to seeing everyone at the all-hands.

---

## Q&A

**Host:** Awesome. We've come a long way over the past year — not even a year, really. Pretty significant. Let's take some questions from the chat.

---

**Uger:** There's no slashing — what's the disincentivization for malicious behavior?

**David:** Great question. The malicious behavior we care about most is double-proposing: a malicious node, when it wins a slot, proposes multiple different blocks forking off the parent using the same lottery win. This does reduce network security beyond 51%, but under reasonable assumptions about the proportion of malicious nodes, the longest chain will prevail.

Our finality times are quite long — about 18 hours. That gives the longest chain rule 18 hours to resolve a fork caused by malicious behavior.

**Host:** It's worth thinking about it in Bitcoin's framing: this is proof-of-stake but with a similar security model to proof-of-work. The longer finality time means not only is it transparent that an attack is happening — you also have quite a bit of time to respond, because the attacker has to sustain that behavior.

What's the rough percentage of stake that would threaten the chain?

**David:** It's difficult to pin down exactly, but it's very close to Bitcoin's security model, minus a small reduction for the double-proposal attack (which Bitcoin doesn't face because you'd have to mine a whole separate block, not just propose one). So it's slightly less than 51%, but still better than BFT — which assumes one-third faulty nodes. We're somewhere between BFT and 51%.

**Host:** I'd be curious to see an article comparing this to Bitcoin's proof-of-work and Cryptarchia's proof-of-stake, analyzing exactly where the boundaries are — something we could dig into as we grow.

**Thomas (chat):** A lottery winner is also limited in how many times they can use Blend, which is another layer on this.

**David:** That's right. You route your block proposals through Blend and use something like RLN to prevent spamming of the Blend network. If you reuse an RLN token, you get banned from Blend — your proposals won't be accepted. So the attacker would have to bypass Blend entirely, putting their proposals directly on the network and revealing themselves.

**Host:** That's an extra layer of rate-limiting built into the protocol — almost forcing honest use of Blend.

---

**Question (chat):** How are concurrent writes handled in the SQLite Zone?

**David:** The demo I showed was the centralized model — one primary writer, many readers — similar to a MySQL primary/replica setup. Concurrent writes in that model just get ordered by the primary.

Once we get to decentralized sequencing, it gets more interesting. Channels are first-write-wins. Different instances writing to the same channel concurrently may have to revert and reorg onto whatever was actually accepted on-chain. This isn't so different from how traditional web apps work — many concurrent HTTP calls hammering a MySQL instance, with retry logic on conflicts.

In our final design, we'll maintain two SQLite instances when running distributed sequencing: one for the **finalized state** and one for the **tip state**. When you write, you write to your tip state and push that to the blockchain. When the blockchain finalizes a transaction, the indexer applies it to your finalized SQLite instance. If there's ever a reorg, you throw away your current tip state and replay from finalized state to the new tip on the new branch.

It's not so different from how the EVM handles reorgs — you revert your state and come back to a new one. This won't be an ACID database. It's a decentralized, eventually consistent, globally replicated SQLite database.

---

**Joe (chat):** What about SQLCipher (the encrypted SQLite variant used by Status)?

**David:** We'd have to look at it. I imagine it should work depending on how SQLCipher does its encryption — whether it encrypts at the individual transaction level or the whole database file. To be continued.

---

**Host:** Daniel, is there anything else you'd like to add?

**Daniel:** Just want to thank the presenters — great work. Looking forward to seeing everyone soon.

**Host:** Everyone's now updated on the blockchain side of things. Tomorrow we'll have Messaging and Storage, which wraps up the Logos team updates. We may also have the EcoDev team doing a demo or video on their efforts, which I'll distribute separately — useful context for seeing what they've been up to. The more we can frontload status reports, the more time we save at the all-hands for things that actually require us being together.

Thanks everyone — the rate at which you've all been delivering is awesome and astounding. Keep it up.

**David / Moody:** Thank you. See you tomorrow.
