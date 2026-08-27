# Safe (Ethereum) — Per-Stage Leak Inventory

Reference for the "contracting" article (part 2). The *control* side of the
contrast: the best version of transparent coordination vs. the private-to-private
Logos testnet transfer. Same intended action (send value / do a thing together);
one variable: the rail. The deliverable is the **diff of the two "what left the
room" artifacts** — an experiment, not a gotcha.

> **VERIFIED (2026-08-20) against the actual muster build**, commit `1b015d4`
> ("module: real Safe coordination in the hosted module (P2 + hosted unify)").
> **Added 2026-08-20:** §8 — Information-flow disclosure (the user-facing deliverable
> shape; the design north star from the morning: "provide utility, and show how
> information moves").
> Sources: `module/src/drivers/safe.nim` (Safe 1.4.1 driver, EIP-712),
> `module/src/drivers/safe_rpc.nim` (execTransaction assembly + JSON-RPC),
> `module/nim-lib/muster_module.nim` (propose/approve/status surface),
> `module/tests/safe_anvil_e2e.nim` (e2e vs. anvil, asserts local safeTxHash ==
> on-chain getTxHash). Type hashes are the published Safe 1.4.1 constants,
> checked against on-chain constants in the test.

Convention per stage:
- **LEAKS** — the specific data that escapes.
- **WHERE / TO WHOM** — the infrastructure + the party that receives it.
- **BY DESIGN or BY OPERATION** — structural (can't be removed without changing
  the protocol) vs. operational (mitigable by provider/config choice).
- **HOW TO MEASURE** — what to actually capture to produce the artifact.

---

## 0. The one non-obvious point (the punchline)

**The transparent rail doesn't just leak the transaction. It leaks the *togetherness*
itself.** The owner set, the threshold, who signed what, and who executed are all
public *by construction* at the execution moment — the M signatures are in the
`execTransaction` calldata and every one of the M signers is publicly recoverable.
In the Logos path that structure stays in the E2EE room; only the outcome you choose
to publish is public.

**Second non-obvious point (new, from the build): the "togetherness" leak before
settlement is a function of your *choice of coordination layer*, not of the rail.**
There are three rails for the same action (see §8), and only the *canonical* one
(public Safe Transaction Service) leaks the negotiation. The muster build
self-coordinates: negotiation stays private, only the final `execTransaction` is
public.

---

## 1. Discovery — finding who has what you want

- **LEAKS:** the Safe address (a persistent public handle) + the creator/funder EOA.
- **WHERE / TO WHOM:** anyone with a block explorer.
- **BY DESIGN.** The Safe proxy address is a permanent, linkable, addressable
  identity. Contrast: Logos chat address is derived per session, MLS room, E2EE —
  not a durable public handle.
- **HOW TO MEASURE:** record the Safe proxy address + the `from` of the creation tx.
  The handle is *durable* (reusable across future joint actions) — a persistent link,
  not a one-shot.
- *Note (muster build):* the SafeDriver holds `chainId, safe, owners, threshold` as
  **local config** — the owner set is in your machine's driver config (and, by
  definition, also in the Safe contract's on-chain state).

## 2. Diligence — verifying they are who they claim

- **LEAKS:** the full Safe address history (every tx, every execution, every
  ownership change) + the owner EOAs linked to it. The Safe is a **cluster node**
  in the address graph: every owner EOA is permanently linked to every other owner
  and to all Safe activity.
- **WHERE / TO WHOM:** block explorers, indexing services, the $3B+ surveillance
  industry that monetizes the graph.
- **BY DESIGN.** This is the "address history / identity graph" leak, and the Safe
  makes it *structural and durable*: the owner set is a public, permanent cluster.
  High-value target for address poisoning precisely because the history is long and
  public.
- **HOW TO MEASURE:** dump the full Safe history (tx list + ownership events). Count
  the distinct EOAs permanently linked. That link count *is* the diligence-stage
  leak.

## 3. Negotiation — agreeing on price and terms  ← **corrected vs. v1 of this doc**

- **In the flow muster built (self-coordination):**
  - `musterPropose(effectJson)` maps the effect (to/value/nonce) to a SafeTx and
    computes the `safeTxHash` **locally** (EIP-712, Safe 1.4.1), records it as the
    pending hash, advances the intent to `proposed`. **Nothing leaves the machine at
    the propose step.**
  - For each co-signer to independently derive the *same* hash (invariant 1: the
    client re-derives locally rather than trusting a proposer's copy), the **action
    fields** (to, value, data, nonce, gas terms) must be communicated to them —
    over the parties' *own* channel. In the muster architecture that's the private
    (E2EE) channel; in a raw deployment it's whatever the owners trust.
  - **LEAKS (self-coordinated):** the action fields move *between the principals
    only* — to the same parties who are already the "togetherness." What crosses the
    room boundary is the **32-byte safeTxHash digest** (one-way: it doesn't reveal
    to/value/data) so everyone signs the same thing.
  - **BY DESIGN** of self-coordination: there is no third-party coordination layer
    to leak to. The negotiation profile is as private as the channel the owners
    already share.
- **In the canonical flow (Safe + Gnosis Safe Transaction Service)** — *the*
  transparent-coordination variant, worth keeping as rail A in the article:
  - **LEAKS:** the *proposed transaction* (to, value, data, nonce) **before** any
    approval, plus a timestamp.
  - **WHERE / TO WHOM:** the Safe Transaction Service / Safe Gateway — a public
    third-party index you don't own.
  - **BY DESIGN (of the de facto UI layer).** "We are about to send X to Y with
    value V" is public, with a timestamp, before anyone agrees. Each confirmation is
    public + timestamped; the *sequence and timing of confirmations* leaks
    negotiation dynamics.
  - The muster build **explicitly does not do this**: `safe_rpc.nim` — "No indexer
    or Safe service — just the user's RPC endpoint (invariant 8: untrusted,
    user-configurable infrastructure)."
- **HOW TO MEASURE (self-coordinated):** record (a) what the propose step emitted
  (the local intent state — `proposed`, not public), (b) the channel the action
  fields crossed (which room/channel, and that it's E2EE), (c) the safeTxHash digest
  that is the shared signing artifact. The "what left the room" line for this stage
  is: *the action fields, between principals only; the digest, to everyone.*

## 4. Contracting — committing in enforceable form  ← **the article's stage; the wall, verified**

This is where the real hard problem lives.

- **LEAKS (at execution, when the signatures are published):**
  - The `safeTxHash` (in the signed payload) and the full M-of-N **signatures** —
    recovered signers: every one of the M owners is publicly recoverable from the
    `execTransaction` calldata (the e2e test's assertion is the proof: the
    on-chain `checkSignatures` passed ⇒ local hashes matched; the same bytes are
    what anyone with the calldata can recover).
  - The executor EOA (`from` of the `eth_sendTransaction` / relayer) — the
    *caller is not required to be an owner*; any EOA that pays gas and carries a
    valid threshold set can execute. That arbitrary EOA is publicly revealed.
- **WHERE / TO WHOM:** on-chain, permanent.
- **BY DESIGN** for the action; **the wall is by construction** for the context.

### 4a. The contracting-stage wall (verified against the actual field list)

The `safeTxHash` commits to exactly:

```
domain:  chainId, verifyingContract (the Safe)
SafeTx:  to, value, data, operation,
         safeTxGas, baseGas, gasPrice, gasToken, refundReceiver, nonce
```

It does **not** commit to the **signing context**: *why* the user is signing, the
narrative, the counterparty's off-chain promise, "what the UI said," the agreed
intent. The Safe verifies the **action**, not the **context** of the action.

Two extra properties the build gives us (worth one line each in the article):
- **Invariant 1 — re-derivation:** the client re-derives the safeTxHash locally
  rather than trusting a proposer's copy (the e2e cross-validates local vs.
  on-chain `getTxHash`).
- **Invariant 2 — replay binding:** because the hash commits to `chainId`, the
  Safe address, and the nonce, a signature is worthless against a different chain,
  Safe, or nonce.

So at the contracting stage:
- The "what left the room" artifact is **strong where the Safe is strong** (the
  action is fully auditable; signatures permanent; execution verified on-chain) —
  and **exposes a wall where the attack actually lives** (the signing context is
  outside the hash, off-chain, unverifiable).

This is exactly where wallet-drainers and phishing operate (~$0.5B/yr, per the
Part-1 table), and the Safe's hash *cannot close it*, because the context was never
in the hash. **The Safe delivers confidence about the action, not about the
agreement.** The gap between "the agreed action (in chat)" and "the verified action
(in safeTxHash)" *is* the contracting-stage leak.

Contrast with the Logos path: the *entire conversation* (the agreement) is the
security/privacy context — MLS room, E2EE, shared local log — and "what left the
room" shows exactly what that context disclosed. In the Safe path the context is
outside the protocol entirely — on **every** rail (see §8).

## 5. Ordering — deciding whose trade goes when  ← **corrected vs. v1**

- **LEAKS:** the pending `execTransaction` in the **public mempool** (if submitted
  over a public RPC): the full payload — to, value, data, **all M signatures**,
  nonce — plus the executor/relayer EOA as `from`.
- **WHERE / TO WHOM:** the mempool / RPC node; sandwich/MEV actors.
- **BY OPERATION** (mitigable by private RPC — the 80% stat), but note: routing
  through a private RPC *concentrates* the entire "togetherness" (all signers, the
  full payload) in a **single middleman who sees it in the clear**. You trade a
  broadcast leak for a trusted-middleman leak.
- **In the build:** submission is `eth_sendTransaction` to the **user-configured**
  RPC endpoint (anvil in the e2e); receipt watched via `eth_getTransactionReceipt`.
  No indexer or Safe service in the loop (invariant 8).
- **HOW TO MEASURE:** capture the pending tx in the mempool (or record which RPC
  path was used and that the middleman now holds the full joint state).

## 6. Settlement — the one link where value moves  ← **corrected detail**

- **LEAKS:** the Safe's `Execution` event (to, value, data, operation, gas terms)
  + the internal token-transfer events (ERC-20 `Transfer`) + post-state (balances,
  approvals). **The signers' addresses are NOT emitted as events in this flow** —
  the build uses raw `execTransaction` (no `approveSignature`), so signer
  attribution is **purely via ECDSA recovery from the calldata**. (The Safe's
  `Approval` event only exists on the `approveSignature()` path, which this build
  does not use — do not cite `Approval` events for this flow.)
- **WHERE / TO WHOM:** on-chain, permanent.
- **BY DESIGN.**
- **HOW TO MEASURE:** the on-chain state diff before/after. Record the Execution
  event + Transfer events + recovered signers + executor. This is the 1/7 — the
  *only* stage the transparent rail was ever designed to protect.

## 7. Enforcement — making the outcome stick

- **LEAKS:** **identifiable operators** — the full, permanent, linkable set: the
  creator/funder, every owner EOA, every recovered signer, the executor/relayer.
  The governance + execution history is public and permanent.
- **WHERE / TO WHOM:** block explorers, legal/enforcement processes.
- **BY DESIGN.**
- **HOW TO MEASURE:** the union of all EOAs linked to the Safe across its life.
  That set is the "identifiable operators" leak. (Contrast: the post-settlement
  selective-enforcement / $4.2B frozen — the ability to *reach* the operators is
  the leak.)

---

## "What left the room" — Safe-path template (verified shape)

Analogous to the post-transfer message in the Logos path. Fill per joint action:

```
ACTION:        <to / value / data / nonce>            (fields)
TOGETHERNESS:   owners = [ ... ]  threshold = N        (public from creation; also in local driver config)
CREATED BY:    <creator/funder EOA>
NEGOTIATION:    action fields shared between principals only (private channel)
                shared artifact = the safeTxHash digest (32 bytes, one-way)
                [if rail A: proposed tx public on tx-service BEFORE approval, timestamped]
SIGNED BY:      [M recovered signers]                  (from execTransaction calldata — public at execution)
EXECUTED BY:    <relayer/executor EOA>                 (arbitrary; not necessarily an owner)
ON-CHAIN:       Execution event + Transfer events + post-state diff
STILL IN ROOM:  the *context* — the agreement, the narrative, the intent.
                (Outside safeTxHash on every rail. Off-chain. Unverifiable. This is the gap.)
```

Everything above the last block is **auditable**; the context is **not** — and the
context is where the real attack surface (drainers/phishing) lives.

---

## Contrast table — rails

| Stage | (A) Safe + public tx-service | (B) Safe + self-coordination (muster build) | (C) Logos private transfer |
|---|---|---|---|
| Discovery | durable public handle (Safe addr) + creator EOA | same | per-session derived address, MLS, E2EE |
| Diligence | full history + owner cluster node (durable) | same | not disclosed (stays in room) |
| Negotiation | **proposed tx public BEFORE approval, timestamped; confirmations public + timed** | action fields between principals only (private channel); only the hash digest is shared | stays in E2EE room |
| Contracting | action public + M signatures permanent; **context outside the hash** | same action/signature leak at execution; **context outside the hash** | context *is* the security/privacy context |
| Ordering | mempool / private-RPC middleman holds full payload + all sigs | same (user-configured RPC) | (per design — confirm) |
| Settlement | Execution + Transfer + post-state, permanent; signers via calldata recovery | same | zk-shielded; minimal disclosure |
| Enforcement | identifiable operators, permanent, linkable | same | (per design — confirm) |

**The diff, in one line:** rails A and B both hand the full "togetherness" to the
chain at execution (and rail A additionally hands the *negotiation* to a public
third party before agreement); rail C keeps the togetherness in the room and shows
you exactly what escaped. And on **all three rails**, the signing *context* — the
agreement itself — never enters any hash. **The contracting-stage wall is
universal; the togetherness leak is a choice of coordination layer.**

---

## Preemptions (say these up front)

1. **"Unfair comparison."** "You compared a shielded lane on a private testnet
   against a public highway on Ethereum."
   → The method is *same action, same intent, one variable (the rail)*. We're not
   measuring *whether* it leaks (yes, obviously) but **what, at which link, to
   whom**. The output is the **diff of the "what left the room" artifacts** — an
   experiment, not a gotcha.

2. **"It's only private because it's a testnet / the central sequencer."**
   → Already half-conceded in Part 1 (central sequencer at testnet.lez). State it
   plainly: the contrast is about the **shape** of the leak profile, not the
   absolute privacy level; the private transfer's residual trust (the sequencer) is
   disclosed. One line defuses the whole attack.

---

## Measurement plan (how to produce the artifact)

For the Safe path (the muster flow), capture a **public-state diff** at each
transition:
1. **Pre-creation** baseline (explorer state for all involved addresses).
2. **On creation** — factory event (owners, threshold, funder).
3. **On propose** — *local* intent state (`proposed`); record the channel the
   action fields crossed (private, between principals) and the shared safeTxHash
   digest. (Nothing public here in rail B; in rail A this is the tx-service entry.)
4. **On each approve** — a 65-byte signature over the hash arrives at the
   coordinator; the signer is not yet public (recovery only matters once the
   signature is published in the execution calldata).
5. **On execution** — mempool capture (if public RPC) or record the RPC path +
   that the middleman holds the full payload.
6. **Post-settlement** — `Execution` event, `Transfer` events, balance/approval
   diff, recovered signers (from calldata), executor/relayer.

Each capture is one line of the "what left the room" template. The **union across
the joint action's life** is the Safe's leak profile. Run the identical procedure
on the Logos path and the **diff is the article.**

---

## 8. Information-flow disclosure — the user-facing deliverable  ← **added 2026-08-20**

> **Design north star (Corey, 2026-08-20):** "There's two parts to muster:
> **provide utility, and show how information moves.** Depending on services is ok
> in the event the user is **informed**. If there are other more private options
> (like **muster-only coordination**) we provide it as an option. There are always
> tradeoffs — we need to **understand them and show them**."

§1–§7 measured *what* leaks on each rail. This section is the *telling* side of
that: what the user is shown **before** they choose, and the format for showing it.
Three rules:

1. **Disclose, don't hide.** Every service in the path is named, and what it sees
   is stated.
2. **Offer the private alternative.** If a more-private coordination exists, it is
   an explicit choice — not a footnote.
3. **State the tradeoff in one line.** Every option carries one honest sentence
   about what it gives up.

### 8.1 The disclosure card (per-rail template)

```
PATH:              <name>
WHAT MOVES (by stage):
  create:          ...
  propose:         ...
  approve:         ...
  execute:         ...
  settle:          ...
SERVICES IN PATH:   <each named service — what it sees, who runs it>
PRIVATE ALTERNATIVE: <the named more-private option, or "none — this is the
                     most private rail">
TRADEOFF (one line): ...
```

### 8.2 Rail A — standard Safe + public Transaction Service

- **WHAT MOVES:** creation → Safe address + owner set + creator EOA, public
  permanently. propose → the *full proposed tx* (to/value/data/nonce) public,
  **timestamped, before any approval**. approve → each confirmation public +
  timestamped (sequence/timing leaks negotiation dynamics). execute → all M
  signatures + executor EOA. settle → `Execution`/`Transfer` events + post-state.
- **SERVICES IN PATH:** Safe Transaction Service / Gateway — a **public index you
  don't run**; it sees every proposal and confirmation. Your RPC provider — sees
  the submitted tx; over a public RPC the mempool sees it too.
- **PRIVATE ALTERNATIVE:** rail B — muster self-coordination; the negotiation
  never leaves the principals.
- **TRADEOFF (one line):** "Your negotiation — what you're *about to* do — is
  public, with a timestamp, before anyone has agreed."

### 8.3 Rail B — Safe + self-coordination (what muster builds)

- **WHAT MOVES:** creation → same as rail A (the Safe is a public object; the
  owner set is on-chain — that's rail B's floor, by design). propose → action
  fields cross **between principals only**, over their own private channel; the
  shared artifact is the 32-byte safeTxHash digest (one-way — doesn't reveal
  to/value/data). approve → signatures exist locally; **nothing is public**.
  execute → the full `execTransaction` (action + all M signatures + executor)
  becomes public — **this is the first public state of the negotiation at all**.
  settle → `Execution`/`Transfer` + post-state.
- **SERVICES IN PATH:** your own RPC endpoint (untrusted, user-configurable —
  invariant 8). **No indexer, no transaction service, no coordination service.**
  The coordination layer is the user's own machine ("muster only coordination").
- **PRIVATE ALTERNATIVE:** rail C — Logos private settlement; the action itself
  never becomes public.
- **TRADEOFF (one line):** "Only the executed action is public — but the *why*
  (the agreement) lives in your chat, and no hash protects it there."

### 8.4 Rail C — Logos private transfer

- **WHAT MOVES:** what the user **chooses** to publish post-settlement (confirm
  vs. design). The togetherness — who was in the room, what was agreed — stays in
  the E2EE room.
- **SERVICES IN PATH:** (per design — confirm.)
- **PRIVATE ALTERNATIVE:** none — this is the most private rail.
- **TRADEOFF (one line):** "Nothing about the action is public — including the
  proof of who did what. You give up the public auditability that rails A and B
  get for free."

### 8.5 The informed-consent moment

When the user picks a path, they see **that path's card before the first action
is taken.** Concretely, on the standard Safe path (A): one line — "This path
publishes your proposal (to/value/nonce) with a timestamp before anyone approves,
and publishes all signatures at execution. A more-private option exists:
muster-only coordination (rail B)." Then the two cards side by side. The user's
choice **is** the disclosure event; the product's job is to make the choice
legible — not to steer it.

### 8.6 What the choice actually changes

- **A ↔ B** — same settlement (public chain), different **coordination layer**.
  A one-click product choice. This is the "muster only coordination" switch.
- **B ↔ C** — different **settlement rail**. A product-level decision, not a
  toggle.

Naming the difference matters: it's exactly the distinction the north star is
about — *show how information moves*. The two knobs move information differently:
the first changes **who sees the negotiation before execution**, the second
changes **what is public at all**.

### 8.7 The honest boundary (say it out loud, on every rail)

safeTxHash commits to the **action**, not the **signing context** — the *why*,
the narrative, the counterparty's off-chain promise (§4a). **No rail closes that
gap.** The one-line claim muster can make — and should make — is: "The joint
action is cryptographically certain, and the information movement is visible. The
off-chain agreement is still a human-trust problem, and we say so rather than
pretend otherwise."

That line *is* the product's credibility: it's the part most coordination
tools fake, and saying it out loud is the difference between disclosure and
marketing.
