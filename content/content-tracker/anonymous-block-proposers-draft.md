---
title: "Anonymous Block Proposers: How Logos Solves Leader Privacy in PoS"
tags:
  - draft
  - blockchain
  - article
type: draft
status: draft
date: 2026-02-22
---

# Anonymous Block Proposers: How Logos Solves Leader Privacy in PoS

Every ten minutes, Bitcoin miners compete to produce the next block. They do it blindly — no one knows who will win until the proof-of-work solution is broadcast, and by then it's too late to do anything about it. Ethereum works differently. Validators are assigned slots in advance, and their leader schedule is published at the start of each epoch. For roughly 6.4 minutes, the entire network knows exactly who is going to propose the next 32 blocks.

That advance disclosure is an attack surface. A known proposer can be censored before they get the chance to propose a block, DoS'd into missing their slot, or coerced (legally or physically) into excluding specific transactions. Over time, a patient adversary can observe the pattern of blocks and infer the proposer's stake, turning anonymity into a target.

Logos takes a different approach. Block proposers in Logos are anonymous — not pseudonymous, not just unlinkable by one avenue, but unknown to the network even after their block has propagated. This is Private Proof of Stake (PPoS), which is achieved through two interlocking systems: **Cryptarchia**, which runs the leadership lottery in zero-knowledge, and **Blend**, which anonymises the broadcast.

This article explains how each system works, how they compose, and why this privacy-preserving design is meaningful in practice.

---

## The problem: What a known proposer leaks

Before looking at the solution, it's worth being precise about the threat model.

**Censorship:** If an adversary knows slot N will be proposed by validator V, they can attempt to prevent V from seeing the transactions they want to include. By the time the block is supposed to be proposed, V's mempool has been poisoned or their connection severed.

**Coercion:** A proposer who can be identified — by network triangulation, long-run stake inference, or a compromised leader schedule — can be pressured. Validators in regulated jurisdictions or those holding a significant stake become targets for legal compulsion to comply with OFAC lists or other filtering requirements.

**Denial of service:** A known proposer is a known endpoint. Flooding their connection during their slot is trivial and effective, and a missed slot means lost rewards and reduced liveness for the network.

**Stake inference:** This is a subtler but important threat. Even if a proposer changes identity, the frequency with which they win the lottery reveals their relative stake. An adversary watching long enough can bucket validators as small, medium, or large — reducing the anonymity set and enabling them to target high-value nodes.

Ethereum's single secret leader election (SSLE) proposals address the first two of these threats by removing the public leader schedule, but they leave stake inference unaddressed. Logos aims to solve all four.

---

## Cryptarchia: Private leadership election

Cryptarchia is the consensus protocol at the heart of Logos Blockchain. It is derived from Ouroboros Crypsinous — the first PoS protocol to prove security against adaptive adversaries in a privacy-preserving setting — but extends it with design changes that make it practical to deploy today.

### How the lottery works

Time is divided into one-second slots. At each slot, every holder of a sufficiently aged **note** (a UTXO token on Logos Blockchain) can check whether they have won the leadership lottery. The lottery is weighted by the value of the note — a larger note wins more often — but crucially, **the check happens entirely inside the validator's local state**. Nothing is broadcast to the network at the time of this check.

The lottery threshold is computed as:

```
ticket := hash("LEAD_V1" || epoch_nonce || slot || noteID || sk)
threshold := stake × (t₀ + t₁ × stake)
```

If `ticket < threshold`, the note wins. The parameters `t₀` and `t₁` are public constants derived from the target block rate and the inferred total stake for the epoch. The note value and the secret key remain private. The slot activation coefficient `f = 1/30` means roughly 1 in 30 slots contain a block, providing enough breathing room for the network to propagate each block before the next arrives.

This is a private coin flip. The validator knows they've won, but no one else knows yet.

```tikz
\usepackage{tikz}
\usetikzlibrary{arrows.meta, positioning, shapes.geometric, calc}
\begin{document}
\begin{tikzpicture}[
    >=Stealth,
    node distance=1.2cm and 1.8cm,
    box/.style={draw, rounded corners=4pt, minimum width=2.4cm, minimum height=1cm, align=center, font=\normalsize},
    private/.style={box, fill=black!10, draw=black!80},
    public/.style={box, fill=white, draw=black!80},
    decision/.style={draw, diamond, aspect=2, inner sep=2pt, align=center, font=\normalsize, fill=black!6, draw=black!80},
    lbl/.style={font=\small, text=black},
    arrow/.style={->, thick, black},
]

% --- Row 1: Private lottery ---
\node[private] (note) {Note\\[-2pt]{\small (stake)}};
\node[private, right=of note] (hash) {Compute\\[-2pt]ticket hash};
\node[decision, right=of hash] (check) {ticket $<$\\threshold?};

% --- Row 1 continued: proof + broadcast ---
\node[private, right=2cm of check] (zkp) {Construct\\[-2pt]ZK Proof};
\node[public, right=of zkp] (blend) {Blend\\[-2pt]Network};
\node[public, right=of blend] (network) {Network\\[-2pt]Verifies};

% --- Outcome ---
\node[lbl, below=0.6cm of check] (no) {\textit{No --- wait}};

% --- Arrows ---
\draw[arrow] (note) -- (hash);
\draw[arrow] (hash) -- (check);
\draw[arrow] (check) -- node[above, lbl] {Yes} (zkp);
\draw[arrow] (check) -- (no);
\draw[arrow] (zkp) -- (blend);
\draw[arrow] (blend) -- (network);

% --- Zone labels ---
\draw[thin, black!60]
    ($(note.south west)+(-0.15,-0.8)$) -- ++(0,-0.15) -- ($(check.south east)+(0.15,-0.95)$) -- ++(0,0.15);
\node[font=\small, text=black!70] at ($(note.south west)!0.5!(check.south east)+(0,-1.3)$)
    {Private --- validator's local state};

\draw[thin, black!60]
    ($(blend.south west)+(-0.15,-0.2)$) -- ++(0,-0.15) -- ($(network.south east)+(0.15,-0.35)$) -- ++(0,0.15);
\node[font=\small, text=black!70] at ($(blend.south west)!0.5!(network.south east)+(0,-0.7)$)
    {Anonymous broadcast};

\end{tikzpicture}
\end{document}
```

### Proving the win in zero-knowledge

The winner needs to convince the rest of the network that they legitimately won the lottery, without revealing which note they used, how much stake it holds, or any other identifying information.

They do this by constructing a **Proof of Leadership (PoL)** — a Groth16 zero-knowledge proof that attests to the following, without revealing any of the private inputs:

1. **The note exists and is aged:** The note's identifier appears in the ledger commitment taken at the start of the previous epoch (`ledger_AGED`), proving the note is old enough to participate.

2. **The note is unspent:** The note identifier still appears in the most recent ledger snapshot (`ledger_LATEST`).

3. **The note won the lottery:** The hash of the note's identifier, the epoch nonce, and the slot number falls below the threshold — meaning this note legitimately won this slot.

The proof also binds a one-time **leader public key** (`P_LEAD`) that will be used to sign the block. The key is single-use by design — reusing it would let observers link multiple winning slots to the same proposer, enabling stake inference.

The output is a 128-byte Groth16 proof that any node in the network can verify in milliseconds.

### Note ageing and epoch structure

The requirement that winning notes be aged is not arbitrary. If fresh notes could win the lottery immediately, an adversary who knows the epoch nonce `η` could generate notes until they find one that wins many slots, gaining an outsized share of leadership. This is called a grinding attack.

Notes must be on-chain before the start of the previous epoch to be eligible. The epoch itself is structured with a three-phase schedule: the stake snapshot phase, buffer phase, and lottery constants finalisation phase. This cascade of delays ensures that by the time the epoch nonce is finalised, the notes eligible to win it have been committed long enough that no one could have chosen them with foreknowledge of `η`.

---

## Blend: Anonymising the broadcast

A perfect zero-knowledge proof means the network can verify a block was proposed by a legitimate winner without learning which note won or how much stake it represented. But publishing this proof is not enough. The act of broadcasting a block to the network has a network-level signature: the block propagates outward from its source, and a well-resourced adversary watching traffic flows can triangulate the originating node.

The Blend Protocol addresses this.

### How Blend works

Blend is a **privacy network** for block proposals, distinct from classical mix networks in how messages propagate. 

Block proposals don't travel directly from the proposer to their peers. Instead, the proposer selects a path through the Blend Network and encrypts the proposal in layers. The message is then injected into the network, where each **Blend node** (a core Blockchain node that has declared participation in the protocol) receives the message, attempts to strip one encryption layer, and disseminates the result to all its peers. A node can only successfully decrypt if it is on the sender's intended path — all other nodes receive and pass on encrypted noise. 

The message propagates outward with one fewer layer at each hop until the final node in the path can read and forward the plaintext to the gossip layer.

```tikz
\usepackage{tikz}
\usetikzlibrary{arrows.meta, positioning, calc}
\begin{document}
\begin{tikzpicture}[
    >=Stealth,
    node distance=2cm,
    core/.style={draw, circle, minimum size=1.4cm, font=\normalsize, fill=black!6, draw=black!80, inner sep=2pt},
    edge/.style={draw, rounded corners=4pt, minimum width=2cm, minimum height=1cm, font=\normalsize, fill=black!15, draw=black!80, align=center},
    lbl/.style={font=\small, text=black},
    data/.style={->, thick, black},
    cover/.style={->, densely dashed, black!50},
]

% --- Proposer ---
\node[edge] (proposer) {Proposer\\(edge)};

% --- Blend nodes (3 hops) ---
\node[core, right=2.2cm of proposer] (m1) {$B_1$};
\node[core, right=of m1] (m2) {$B_2$};
\node[core, right=of m2] (m3) {$B_3$};

% --- Gossip layer ---
\node[edge, right=2.2cm of m3] (gossip) {Gossip\\Layer};

% --- Extra core nodes for cover traffic ---
\node[core, above=1.2cm of m2] (c1) {$C_1$};
\node[core, below=1.2cm of m2] (c2) {$C_2$};

% --- Data path (onion encrypted) ---
\draw[data] (proposer) -- node[above, lbl] {$\{[\![m]\!]\}_3$} (m1);
\draw[data] (m1) -- node[above, lbl] {$\{[\![m]\!]\}_2$} (m2);
\draw[data] (m2) -- node[above, lbl] {$\{[\![m]\!]\}_1$} (m3);
\draw[data] (m3) -- node[above, lbl] {$m$} (gossip);

% --- Cover traffic ---
\draw[cover] (c1) -- (m1);
\draw[cover] (c1) -- (m3);
\draw[cover] (m1) -- (c2);
\draw[cover] (c2) -- (m3);
\draw[cover] (m2) -- (c1);
\draw[cover] (c2) -- (m2);

% --- Labels ---
\node[font=\small, text=black!70, below=0.4cm of m2] (note) {each node attempts to decrypt one layer (succeeds only if on path), disseminates to peers};
\node[font=\small, text=black!70, above right=-0.1cm and 0.2cm of c1] {cover traffic};

% --- Legend ---
\draw[data] ($(proposer.south west)+(-0.1,-1.0)$) -- ++(0.8,0) node[right, lbl] {data message};
\draw[cover] ($(proposer.south west)+(-0.1,-1.5)$) -- ++(0.8,0) node[right, lbl] {cover traffic};

\end{tikzpicture}
\end{document}
```

This model has the following key properties:

**Onion encryption:** When a proposer creates a data message, they select a path through the Blend network and encrypt the message in layers. Each Blend node on the path can only decrypt one layer, revealing the next hop. No node knows both the origin and the final destination.

**Cover traffic:** Every core node generates **cover messages** at a constant rate, in every round, independent of whether they have a block to propose. Cover messages are cryptographically indistinguishable from data messages. This is essential: cover traffic provides limited protection when messages are common, but for Blend — where block proposals are rare — without constant background traffic, there would be almost nothing to hide among.

**Timing delays:** Each Blend node holds messages for a random delay before forwarding. This disrupts traffic analysis that depends on correlating timing patterns across nodes.

The result is that by the time a block proposal reaches the gossip layer and begins propagating to all nodes, it has passed through enough hops, with enough delay and noise, that the originating node cannot be determined from network observation alone.

### The numbers

The Blend specification states that the protocol increases the time required to link a sender to a proposal by at least **300×**, making stake inference highly impractical in practice. For an adversary controlling 10% of network stake and targeting a node with 0.1% stake, inferring that stake through timing analysis would take over **10 years**.

### Edge and core nodes

Not every Logos node participates in blending. Core nodes, those that have declared themselves as Blend participants via the Service Declaration Protocol, form the mix network and relay messages. Edge nodes connect to core nodes and inject their proposals into the Blend network without running the protocol themselves. 

As edge nodes connect to the Blend Network but do not run it, this configuration can reduce bandwidth requirements for validators on consumer hardware. Currently, edge nodes receive less privacy protection than core nodes — from the Blend Network's perspective, an edge node sends a message in and a different message emerges after a delay, but the edge node's interaction with the network is not itself hidden. Research into improving edge-node privacy is ongoing.

### Rate-limiting via Proof of Quota

Blend's anonymity depends on all legitimate proposals flowing through it. An adversary who bypasses Blend entirely — submitting proposals directly to the gossip layer — immediately exposes themselves as the originating node, defeating any privacy the protocol provides.

To enforce honest use, the protocol requires each message submission to carry a **Proof of Quota (PoQ)** — a zero-knowledge proof that the sender is within their allotted message budget. Each key index within a quota period can be used at most once. Attempting to reuse an index generates a duplicate nullifier, which the Blend Network detects and then drops the message. There is no ban: the node remains in the network and can continue sending with non-duplicated indexes. Enforcement is per-message; only the duplicated proposal is discarded.

The practical effect of this system is that rational proposers have a strong incentive to use Blend correctly. A proposer who bypasses the Blend network both violates the protocol and immediately deanonymises themselves.

---

## Putting it together: Private Proof of Stake

The combination of Cryptarchia and Blend achieves what neither does alone.

Cryptarchia ensures that the contents of a block provide no information about the proposer's identity or stake. The PoL proof reveals only that *some* eligible note won *this* slot — nothing more. The leader public key is used only once, so no two winning blocks can be linked to the same proposer by inspecting the proofs themselves.

Blend ensures that the act of proposing a block provides no information about the proposer's network position. The cascade of encrypted relays and cover traffic makes traffic analysis prohibitively expensive.

Together, they satisfy the core requirements of PPoS:

- **Block proposals are not linkable to a leader**, neither by inspecting the proof nor by watching the network.
- **Proposer stake is not revealed**, the ZK proof hides the note value, and the mix network prevents frequency analysis.
- **Leaders are protected against network triangulation**, as Blend's routing and cover traffic raise the cost of deanonymisation to impractical levels.

This PPoS implementation is live today on the Logos Blockchain devnet. The first release is running internally, with a faucet, Swagger API docs for node interaction, Prometheus metrics, and multiplatform Docker images.

---

## Security model: Closer to Bitcoin than BFT

Cryptarchia's security model is deliberately closer to Bitcoin's proof-of-work (PoW) than to Byzantine Fault Tolerant (BFT) consensus protocols like Tendermint or Gasper.

BFT protocols tolerate up to one-third of nodes behaving maliciously — above that threshold, they break. Cryptarchia's honest-majority threshold sits just below 51%, much closer to Bitcoin. The attack that differentiates it from pure PoW is **double-proposing**: a malicious node that wins a slot can broadcast two conflicting blocks from the same lottery win, creating a fork. In PoW, forking requires mining a full alternative block — expensive. In PoS, the conflicting proposal is cheap to create. This reduces the effective threshold slightly below 51%, but the protocol remains substantially more resilient than BFT.

The practical consequence is **finality time**. Logos Blockchain targets approximately 18-hour economic finality — long enough for the longest-chain rule to resolve any fork caused by malicious behaviour under realistic network conditions. Compared to BFT chains that finalise in seconds, this is a meaningful trade-off: an attacker must continuously outpace the honest chain, and probabilistic finality accumulates block by block. The low slot occupancy rate of roughly 1 block every 30 slots is a related design choice, giving nodes time to synchronise and propagate each block before the next slot arrives, which matters especially given Blend's routing delays.

An attacker attempting to flood Blend to overwhelm its anonymity properties will find their messages dropped by PoQ nullifier deduplication, or must fall back to direct gossip propagation — making the attack visible at exactly the moment it escalates. Deanonymising the network and attacking the consensus simultaneously becomes far harder than either alone.

---

## Comparing Logos PPoS to Ethereum's Secret Leader Election

Ethereum's validator community has proposed several approaches to secret leader election, motivated by the same concerns. The most developed is SSLE (EIP-7441 and related work), which uses shuffle-based cryptographic protocols to publish a slot's leader only to that leader themselves in advance, while the network learns the identity only when the block is proposed.

SSLE removes the public leader schedule and addresses the risk of censorship and coercion, but it has limits:

- **Stake inference remains possible:** Even without a pre-announced schedule, an observer who watches which validator key proposes each block can, over time, infer the distribution of stake, especially if validator keys are reused across slots.
- **Network triangulation is unaddressed:** The block still propagates from a known originating node. An adversary controlling enough network vantage points can triangulate the source.
- **The anonymity set is bounded by the validator set:** SSLE hides which of the 1 million-ish Ethereum validators will propose next, but the validator set is public and staking amounts are linkable to deposit transactions.

Cryptarchia and Blend address all three gaps. Note values are hidden in the ZK proof, preventing on-chain stake inference; one-time leader keys prevent cross-slot linkage; and the Blend network severs the connection between block proposal and network position.

The cost of this anonymity is latency. Blend's routing delays add seconds to block propagation compared to gossip-only protocols. The slot activation coefficient of 1/30 partially compensates for this — most slots are empty, giving the network time to settle before the next block is expected. But this is a real trade-off: Cryptarchia is not optimised for high throughput or low latency. It optimises for resilience and proposer privacy.

---

## What this means for running a node

Private Proof of Stake is an interesting academic construction, but it also changes what it means to operate a validator in practice.

On most PoS chains, running a high-value node is a serious operational commitment. You maintain a known network presence, guard against targeted DoS attacks, manage the risk of stake inference exposing your position, and face slashing if consensus bugs or network interruptions cause inadvertent misbehaviour.

Logos removes most of that overhead. Your network identity is shielded by Blend. Your stake is hidden inside a ZK proof. There is no slashing: if your node goes down, you miss some block rewards. That's the extent of it. The goal is a validator experience that is genuinely low-stress for individual participants running consumer hardware, not just institutional operators with 24/7 uptime guarantees and legal teams on retainer.

This permissionlessness is what makes the neutral settlement layer credible. A chain where only sophisticated, highly-capitalised operators can safely validate is not, in practice, permissionless — regardless of what the protocol specification says.

---

## Try it out

The internal devnet is live. You can spin up a Logos node with the multiplatform Docker images, get test tokens from the faucet, and interact with the chain through the Swagger API docs. Prometheus metrics expose chain behaviour in real time.

The devnet is the best place to observe Cryptarchia in operation — watch the slot timing, the PoL verification, and the block propagation through Blend. The specs referenced throughout this article (Cryptarchia PoL Spec, Cryptarchia v1 Protocol, Blend Protocol) are the normative sources for everything described here.

Proposer anonymity in PoS is a hard problem. Logos' answer is to treat privacy as a first-class requirement, not an afterthought, and to build the cryptographic infrastructure needed to solve it end-to-end.

> [!NOTE] INSERT CTA LINKS HERE

---

*Sources: [Cryptarchia PoL Spec](../../../rfc-index/docs/blockchain/raw/cryptarchia-proof-of-leadership.md) · [Cryptarchia v1 Protocol](../../../rfc-index/docs/blockchain/raw/nomos-cryptarchia-v1-protocol.md) · [Blend Protocol Spec](../../../rfc-index/docs/blockchain/raw/nomos-blend-protocol.md) · [Why Proposer Anonymity Matters](https://press.logos.co/article/why-proposer-anonymity)*
