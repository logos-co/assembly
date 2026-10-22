# Your History Is the Attack Surface: Quantum Computers, AI, and the Logos Stack

*Draft. Status: First Draft, adversarially reviewed (3 rounds). Audience: privacy-curious general readers and crypto folks who've heard "quantum" and "AI" used as scare words and want the actual shape of the problem. Open questions for the cryptography team are collected at the bottom; resolve before publishing.*

---

Someone asked me recently what Logos is doing about quantum computers and AI. I sent them a [forum post](https://forum.research.logos.co/t/logos-techstack-pq-readiness/719) and two research-call recordings ([one](https://www.youtube.com/watch?v=M-hIwizTRE8), [two](https://www.youtube.com/watch?v=MeI52qWyVRs)) from our applied cryptography folks. That's a great answer if you enjoy an hour on Groth16 proof sizes (I do, sue me (don't)). This is the version for everyone else.

Quantum computers and AI get talked about as two separate scary things. They are different weapons pointed at the same target: the permanent record of what you've already done. A quantum computer breaks the math that keeps old encrypted data secret. AI collapses the cost of figuring out whose data it is. Quantum opens the archive; AI puts names on it. Quantum also threatens what you hold *right now*, and that's where Logos' plan is thinnest.

Say in 2027 you send money from a private account to a legal-defense fund and message the organizer about it. Nothing happens. In 2037 someone runs the recorded ciphertext through a quantum computer and gets a list of payments between pseudonymous keys. Then they hand that list to a model that matches the amounts, the timing, and the organizer's public posts against everything you've written online since, and now it names you. On a private chain, the contents need the quantum computer and the name needs the model. (On a transparent chain, the model alone is enough.) Nobody had to touch you in 2027; they just needed the record, and on a blockchain every full node keeps that record for free, forever.

## Three ways privacy holds

Privacy systems lean on some mix of three protections.

**Math.** Decrypting without the key would take longer than the universe has left. Quantum computers attack this one.

**Cost.** The data is technically visible (addresses, timestamps, who talks to whom, how you write) but turning it into knowledge about *you* takes effort. On public blockchains this stopped protecting most people years ago: chain-analysis firms have been clustering Bitcoin and Ethereum addresses at scale with plain heuristics for a long time. What AI adds is reach. Bruce Schneier [put it well in 2023](https://www.schneier.com/blog/archives/2023/12/ai-and-mass-spying.html): collection went bulk long ago, but *understanding* what was collected stayed limited by human labor. Matching writing styles across platforms and correlating on-chain timing with off-chain life was the expensive part, and it's getting cheap.

**Absence.** Data that was never published can't be decrypted or correlated later. This is the one that ages best, and it's the one Logos leans on hardest.

The first two fail retroactively: every improvement in quantum hardware or AI applies to everything already collected. In the [transaction supply chain threat model](https://logos-co.github.io/assembly/content-tracker/transaction-supply-chain-threat-model-draft) I called this adversary the archivist: collect everything, wait, monetize later. Quantum and AI are the two upgrades the archivist is waiting for. The exception is forgery, which threatens the present instead of the past; more on that below.

## The quantum part, with actual numbers

A large enough quantum computer running Shor's algorithm breaks RSA and elliptic curve cryptography (ECC). ECC is what nearly every blockchain uses for signatures and what most of the internet uses for key exchange. For years the benchmark target was RSA-2048, but ECC turns out to be the *easier* one: a 2026 estimate puts RSA-2048 at [one to two orders of magnitude longer](https://arxiv.org/abs/2603.28627) to break than a 256-bit curve. The estimates have been falling fast:

- **2019:** breaking RSA-2048 was estimated at [~20 million noisy qubits](https://arxiv.org/abs/1905.09749).
- **May 2025:** Craig Gidney [cut that to under 1 million, in under a week](https://arxiv.org/abs/2505.15917).
- **March 2026:** Google Quantum AI, with Justin Drake (Ethereum Foundation) and Dan Boneh (Stanford), [estimated](https://quantumai.google/static/site-assets/downloads/cryptocurrency-whitepaper.pdf) that the curve Bitcoin and Ethereum use falls to **fewer than 500,000 physical qubits**. On the fastest kind of machine, a pre-warmed attack takes about 9 minutes on average from seeing a public key, close to Bitcoin's 10-minute block time. The paper puts the odds of stealing a coin while its transaction waits to confirm at a bit under 41%.
- **Same day:** a Caltech/Oratomic team [estimated](https://arxiv.org/abs/2603.28627) a 256-bit curve could fall in a few days on 26,000 neutral-atom qubits.

For scale: Google's Willow chip, the one that made headlines in December 2024, has 105 qubits, and nobody has yet shown error correction working at the scale these attacks need. Google's estimate didn't cover Ed25519 (one of the curves Logos uses) specifically, but it's the same size class.

The 26 experts in the Global Risk Institute's [latest survey](https://globalriskinstitute.org/publication/quantum-threat-timeline-report-2025b/) rate a cryptographically relevant quantum computer as "quite possible" (28–49%) within ten years and "likely" (51–70%) within fifteen. People call that day Q-day. Google [set a 2029 deadline](https://blog.google/innovation-and-ai/technology/safety-security/cryptography-migration-timeline/) for its own migration, and Cloudflare [pulled its target forward to 2029](https://blog.cloudflare.com/post-quantum-roadmap), citing the two 2026 papers.

## For encryption, the deadline is the day you start publishing

Record encrypted data today; decrypt it whenever the machine shows up. Apple's [explanation](https://security.apple.com/blog/imessage-pq3/) of why it shipped post-quantum iMessage in 2024 is exactly this, and Signal [shipped](https://signal.org/blog/pqxdh/) the same protection in 2023. For a blockchain, nobody even has to do the recording. Google's paper says the most pressing quantum danger for Zcash is retroactive loss of privacy, and that privacy can't be fully restored for data already sitting on Zcash or Monero.

So the deadline for encryption isn't Q-day. It's the day real data starts going out. For the Logos chain that's mainnet, and Mehmet (a cryptography researcher on the blockchain team) made the point in his talk: there's nothing worth harvesting from the chain yet, because there are no real transactions. That's why the team's plan does encryption first and before launch. The caveat is anything people use for real *now*, like testnet chat. Message contents there are already upgraded (more below); the network connections underneath them haven't been assessed yet, so who-talked-to-whom traffic is still harvestable.

## Read, forge, link

Encryption isn't the only thing quantum computers break, and the other breaks don't all reach backward.

| Primitive | What a quantum computer can do | Does it reach the past? |
|---|---|---|
| Encryption keyed by elliptic-curve key exchange | Read the data | **Yes.** Everything ever recorded |
| Signatures and zero-knowledge proofs (proofs that something is true without revealing why; Groth16 is the kind Logos uses) | Forge new ones | Mostly no, once the network stops accepting the old scheme. Two catches below |
| Hash functions and hash commitments (sealed fingerprints of data) | Grover's algorithm, a quantum speedup for brute-force search, roughly halves their strength | No at 256-bit security. 128-bit is a judgment call (RLN, below) |

Confidentiality fails backward in time; authenticity mostly fails going forward. A forged signature is useful only while someone will accept it. Once the network stops accepting the old scheme (the "cutover"), a quantum attacker who can forge it holds a key to a door that's been bricked over. The [Google paper](https://quantumai.google/static/site-assets/downloads/cryptocurrency-whitepaper.pdf) and Zcash's Sean Bowe ([here](https://seanbowe.com/blog/zcash-and-quantum-computers/)) both lay out this split. Old Groth16 proofs also reveal nothing about their secrets, even to an unlimited attacker, so archived proofs aren't a privacy leak.

The two catches on "mostly no." First, a proof-of-stake chain's history is made of signatures and proofs. Picture a new node joining in 2037. Someone shows it a forged version of 2028 in which the attacker held all the stake, with valid-looking leadership proofs, and the node has no way to tell. Cryptarchia's bootstrapping rule exists so new nodes can pick the right chain [without having to trust another node](https://docs.logos.co/blockchain/concepts/about-cryptarchia), and that rule rests on exactly the proofs that become forgeable. Checkpoints would fix it, at the cost of that trust model. I didn't find this addressed in the team's writeups. Second, old signatures stop being evidence. If anyone can forge a 2027 signature in 2037, a signed 2027 message proves nothing.

**Linking** is the third thing to check, and it's where quantum feeds AI: a quantum computer can hand a model a *linked graph* without decrypting anything. On Zcash, the Google paper says a quantum attacker can recover viewing keys and tie a wallet's supposedly separate addresses together. For LEZ, Logos' execution layer for accounts and apps, account identifiers are SHA-256 hashes and state commitments are hash-based, so there's no elliptic curve there to break; how nullifiers (the one-time tags that mark old state as spent) are derived is something I still want the team to confirm. Blend, the network layer that hides which node proposed a block, is the real linkage risk today. Mehmet's talk spells it out: break Blend's key exchange on recorded traffic and you can sort core nodes from edge nodes and follow messages through the network. That's why the Blend fix is scheduled before mainnet.

RLN, the system that rate-limits anonymous senders in Logos messaging, sits right at this intersection. Each message carries a nullifier and a share of the sender's membership secret, which is how it catches spammers. RLN uses Poseidon at a 128-bit security level. If that's not enough against a quantum attacker, an archive of RLN messages could someday be tied back to members, and an audience member at Marvin's talk pointed out the same secret controls staked funds. The forum post calls the 256-bit upgrade necessary in one place and calls RLN harvest-safe in another, and Marvin said he's torn. A failure here is retroactive and can't be patched once the archive exists, so I'd do the upgrade before mainnet.

## What Logos has done, and what's next

The 2027 donation has two pieces of encrypted data in it: the payment and the message. Per the team's August 2026 writeups, both are already on post-quantum encryption:

- **The payment (LEZ private accounts).** The account state is encrypted and posted on-chain (so the owner and recipients can recover it), alongside a hash commitment, a nullifier, and a zero-knowledge proof. The encryption is ML-KEM-768, NIST's standardized post-quantum key exchange; the change [merged in June 2026](https://github.com/logos-blockchain/logos-execution-zone/pull/474). The cost: viewing keys (the key that lets someone read your private account) went from 32 bytes to about a kilobyte, roughly 2,000 characters if you have to paste one to someone. Marvin Jones, one of our applied cryptographers, who wrote the forum post: "our viewing key sucks." Worth it, because the ciphertext sits on every node forever and the key is a one-time annoyance. Shared accounts seal their group secret to new members the same way ([docs](https://docs.logos.co/lez/accounts/set-up-shared-private-lez-account)).
- **The message (Logos Chat).** Per Marvin, Chat encrypts with X-Wing, a hybrid of classical X25519 and ML-KEM-768. Hybrid means an attacker has to break both, which hedges against the new math turning out weaker than hoped. That has happened: SIKE, a post-quantum candidate NIST was still evaluating, was [broken on a single CPU core](https://eprint.iacr.org/2022/975) in 2022. Marvin calls Chat the most crucial piece to make harvest-safe, because the people who need private chat most (whistleblowers, abuse survivors) are exactly the people a revealed history hurts most.

Chat gets the hybrid, but LEZ's on-chain state, the data that lives forever, uses ML-KEM-768 alone. ML-KEM is NIST's primary standard and I'm not aware of any weakness in it. But if someone ever finds a classical break, every LEZ ciphertext on-chain is exposed with nothing behind it. By the hybrid argument, the permanent data is the one that most deserves belt and suspenders, and I'd like the team to explain the choice.

The blockchain itself has four phases, per Mehmet's [talk](https://www.youtube.com/watch?v=M-hIwizTRE8):

- **Phase 0, end of 2026:** hybrid post-quantum key exchange for connections between nodes, so recorded node traffic can't be read later.
- **Phase 1, before mainnet:** post-quantum key exchange inside Blend, closing the linkage risk above.
- **Phase 2, not required before mainnet:** post-quantum signatures, so blocks and messages can't be forged.
- **Phase 3, not required before mainnet:** replace the Groth16 proofs behind block leadership, spam quotas, reward claims, and wallet ownership. The hardest.

Marvin's overall target is 2030: "certainly by 2030 Logos will be fully PQ secure. I'm not worried about that." That's a year behind the 2029 targets Google and Cloudflare set for themselves.

Why not do all of it now? Cost. Post-quantum keys, signatures, and ciphertexts run 10x to 100x larger than what they replace. Proofs are worse. A Groth16 proof is a few hundred bytes at most (128 bytes for Logos' block-leadership proof); the post-quantum candidates (STARKs, mostly) run kilobytes to hundreds of kilobytes, and RLN attaches a proof to every single message. Marvin: "we kind of are spoiled with Groth16." The team also benchmarks every candidate on a Raspberry Pi 5, because they want ordinary people running nodes. That's a choice, and it trades proof-size headroom for who gets to participate; whether it's the right trade is a fair thing to ask. Some chains launched with hash-based post-quantum signatures from day one (QRL, in 2018), but they don't carry zero-knowledge proofs. Which means the pieces that make Logos private (anonymous block production, anonymous rate-limiting, private wallet ownership) are exactly the pieces without a post-quantum answer yet.

Phases 0 and 1 are dated and look on track by the team's account. Phase 2 is engineering: bigger signatures, maybe bigger blocks, nothing unknown. Phase 3 has no chosen proof system and no date of its own; Mehmet's words were "We can solve. I hope we can solve." With expert odds of Q-day climbing past even somewhere in the next ten to fifteen years, and Marvin's target at 2030, that's not much slack for an unsolved research problem. Phase 3 is the biggest risk in the plan.

## Recoverable, not immune

If a capable quantum computer shows up before phase 3 ships, Logos is in a worse spot than Bitcoin.

Groth16 is forgeable by a quantum computer, and worse, its one-time setup hides a trapdoor that a quantum attacker could recover, letting them forge *any* proof. The Google paper describes [exactly this attack](https://quantumai.google/static/site-assets/downloads/cryptocurrency-whitepaper.pdf) against Tornado Cash, which uses the same proof system. On Logos, wallet ownership is a Groth16 proof, so every wallet is forgeable. Block leadership is a Groth16 proof too, so the attacker can win every slot, and because block producers are anonymous by design, that would look like normal operation while they censor the fix. Bitcoin's exposure is the roughly 6.7 million BTC in addresses with revealed public keys, plus any coin caught in flight; Logos' exposure in that window is everything, including the chain itself. Getting out would take the social layer (a coordinated hard fork from an agreed checkpoint), which is the same kind of governance fight Bitcoin is already having over whether to [freeze or rescue old coins](https://bips.dev/361/).

What Logos gets right is what happens after the fix. Blockchain wallet keys are hashes: your public key is a hash of your secret key, and "signing" is a zero-knowledge proof that you know what hashes to it. Quantum computers don't run hashes backward, so the secret survives, and once a post-quantum proof system exists you prove ownership with the same secret. LEZ public accounts derive their signing key from the account secret through SHA-256. A quantum attacker can recover that signing key and drain the account until LEZ stops accepting the old signatures, but the account secret survives, and owners can reclaim later. Marvin, on LEZ: "we do not forfeit inactive accounts." Nobody has to be online during a migration window. Ethereum has an [emergency plan](https://ethresear.ch/t/how-to-hard-fork-to-save-most-users-funds-in-a-quantum-emergency/18901) on the same idea for wallets derived from seed phrases, and Bitcoin's rescue proposals reach for it too. Logos makes it the default for every account from day one.

So the hash-key design makes Logos recoverable, not immune. It turns the quantum problem into a race with a finish line (ship phase 3 before Q-day). Losing that race is worse than Bitcoin's mess, at least for a while.

## The AI part: cheap names, cheap bugs

No credible source I found shows AI breaking a modern cryptographic primitive. What AI makes cheap is naming people and finding bugs.

**Naming.** In February 2026, researchers including Nicholas Carlini and Florian Tramèr [showed](https://arxiv.org/abs/2602.16800) LLM agents matching pseudonymous Hacker News accounts to their owners' LinkedIn profiles at up to 68% recall with 90% precision (picking from 1,000 candidates). The best pre-LLM method got close to zero. Their conclusion: "practical obscurity protecting pseudonymous users online no longer holds." That result is about writing style. My extrapolation is that the same cross-referencing works on amounts and timing matched against public posts; nobody's published that experiment on a private chain that I know of.

**Traffic.** [MixMatch](https://petsymposium.org/popets/2024/popets-2024-0050.php) ran deep-learning flow matching against the Nym mixnet, the same family of design as Blend and Logos Mix. In the lab, after 100 observations, it matched about 60% of flows at a 1% false-positive rate. On the live network that dropped to about 26%, and the authors found Nym's cover traffic substantially weakened older Tor-style attacks. Mixnets help, and they don't make you invisible.

**Bugs.** Anthropic's [SCONE-bench](https://www.anthropic.com/research/smart-contracts) (yes, a model vendor's benchmark) had AI agents, ten models combined, exploit about half of 405 real, previously exploited smart contracts in simulation, at about $1.22 to scan a fresh one. The riskiest code in this article is ours: a new ML-KEM integration, a new hybrid in Chat, and zero-knowledge circuits, with the cryptography audits for the blockchain and LEZ still open as of the July roadmap. The same tools work for defenders, and whoever points them at a codebase first has the advantage. I want to see Logos doing that to itself, publicly.

## What helps against cheap correlation

Today the user-side protections are thinner than the network-side ones. Everything below is plain metadata minimization, which predates LLMs. You can't out-compute a classifier that improves every year; you can give it less to learn from, and the defenses that held before AI are the ones still holding.

**For the user:**

- **LEZ private accounts** publish only sealed material: a hash commitment, a nullifier, a proof, and ML-KEM ciphertext. Plaintext stays on your device. What's still visible is *when* things happen and when money moves between public and private accounts, and that boundary is where researchers have done most real-world deanonymization of Zcash ([Kappos et al., 2018](https://www.usenix.org/conference/usenixsecurity18/presentation/kappos)). Every on-ramp crosses it. Absence only works if users manage it, and the Zcash data says many don't. Keeping plaintext on your device also makes your device the target, which is where AI bug-finding is strongest.
- **Chat messages** ride on Logos Delivery, whose relay is designed so observers can't link a publisher to a message or a subscriber to a topic ([docs](https://docs.logos.co/messaging/concepts/understand-logos-delivery-security-features)). Other Delivery services (Store, Filter) are linkable to your peer ID, and the docs say so. Routing through Logos Mix for real sender anonymity works on testnet but is early: a five-node relay fleet, no defense yet against an observer who can watch the whole network, and no post-quantum assessment, so recorded Mix traffic is exactly the kind of archive this piece is about.
- **RLN** is designed to rate-limit spam without identifying anyone, so floods cost money instead of producing a dataset of who sent what. On today's testnet, memberships are handed out in demo mode, so there's no real price yet.

**For the network:**

- **Blend** wraps block proposals in layers of encryption, holds each one for a random delay at every hop, and has nodes keep generating cover messages that look identical to real ones, [even to Blend nodes run by the adversary](https://docs.logos.co/blockchain/concepts/about-the-blend-network). Combined with **Cryptarchia**, Logos' private proof-of-stake, nobody publishes who produced a block or how much stake they hold. That matters to users because validators whose identity and stake are known can be pressured, bribed, or raided. The team's Blend analysis says that for an adversary with 10% of stake targeting a node with 0.1%, linking proposals to that node takes at least 300x longer than without Blend. That's a model number; nobody has pointed a MixMatch-style classifier at Blend yet. Somebody should.

## Where this leaves us

Run the 2027 donation through Logos as currently planned, with phases 0 and 1 done:

- **The payment's contents** are ML-KEM ciphertext plus hash commitments. A 2037 quantum computer gets nothing to read.
- **The message to the organizer** is X-Wing encrypted, per Marvin. Same, pending confirmation that it covers Chat's group (MLS) setup.
- **The timing**, and any hop between public and private accounts, is still on the record for a model to correlate. So are your public posts. This is now the bigger exposure, and quantum computers have nothing to do with it.
- **Your signatures** stop counting as evidence once they're forgeable, which cuts both ways.
- **Your funds** are safe from the 2037 quantum computer only if phase 3 (and the LEZ signature cutover) shipped first.

| Component | Harvest-now-decrypt-later | Quantum forgery | What a correlator still sees |
|---|---|---|---|
| LEZ private accounts | Merged (ML-KEM-768, not hybrid) | Depends on LEZ's proof format (open question) | Timing, public↔private crossings |
| LEZ public accounts | n/a (public by design) | Signing key until cutover; account secret survives | Everything; they're public |
| Logos Chat | Hybrid, per Marvin | Ed25519 signatures until migrated | Peer-level metadata on Store/Filter |
| Node connections | Phase 0, end of 2026 | Phase 2 | n/a |
| Blend | Phase 1, before mainnet | Phase 2 and 3 | Model says little; untested against ML classifiers |
| Block production and wallets | n/a | Phase 3, unsolved | Stake inference slowed by Blend |
| RLN | 128-bit Poseidon; 256-bit upgrade debated | Groth16, needs replacing | Nothing tying messages to members, unless membership secrets fall |

Logos Mix, Logos Storage, peer discovery, and the Delivery transport underneath Chat haven't been assessed for any of this yet.

What I want from the team, in public:

1. A date for phase 3, a fallback if no post-quantum proof system fits by 2030, and why 2030 instead of the 2029 the big players are using.
2. How nodes syncing after the cutover will reject forged history, and what the plan is if Q-day beats phase 3.
3. Why LEZ's on-chain encryption isn't hybrid when Chat's is.
4. The RLN 256-bit upgrade before mainnet.
5. A post-quantum assessment of Mix, Storage, discovery, and Delivery.
6. AI-assisted auditing of Logos' own new cryptography, with results published.

Bitcoin and Ethereum have an exposed-key problem. Zcash and Monero have privacy data already on-chain that no upgrade can protect after the fact; Zcash is working on [quantum recoverability](https://seanbowe.com/blog/zcash-and-quantum-computers/) for funds and a redesign that stops putting note secrets on-chain. Logos gets to launch with its chain and account encryption already upgraded, and on signatures and proofs it's a retrofitter like everyone else, with recovery built in and an unsolved problem in the middle.

I'm going to hold us to the dates we have, and keep asking for the ones we don't.

## Methodology (holler at me)

Disclosure first: I work at Logos, and the Logos-specific claims come from the team's own public material: Marvin's [forum post](https://forum.research.logos.co/t/logos-techstack-pq-readiness/719), Mehmet's and Marvin's IFT research calls ([1](https://www.youtube.com/watch?v=M-hIwizTRE8), [2](https://www.youtube.com/watch?v=MeI52qWyVRs)), the Logos roadmap, and [docs.logos.co](https://docs.logos.co). "Merged" means merged into pre-mainnet code, not audited. Several claims are "per Marvin" because his talk is the only source; treat them as the team's word until there's a release note. External numbers link to primary papers and vendor posts; I left out 2026 estimates I could only find in press coverage. Where the team's sources disagree with each other (whether RLN is already harvest-safe), I've gone with the cautious version.

If you think I've got the threat model wrong, or that some part of the stack deserves more worry than I'm giving it, I want to hear it. Reply on the [forum thread](https://forum.research.logos.co/t/logos-techstack-pq-readiness/719) or hit me up on X.

*[Corey: AI-assistance acknowledgment line per voice profile.]*

---

## Open questions for the crypto team (strip before publishing)

1. **RLN**: forum body says "RLN is HNDL secure," forum table says not until Poseidon-256. Draft goes with the cautious version and asks for the upgrade. Confirm with Marvin.
2. **Phase 0**: has the hybrid TLS key exchange landed (target end 2026)?
3. **"Waku" in Mehmet's talk** assumed to mean Blend; the core/edge-linkage claim is attributed to his talk on that assumption. Confirm.
4. **LEZ nullifier / npk derivation**: hash-based or EC? Also confirm LEZ commitments are hash-based (forum says "hash of the account's state").
5. **LEZ on-chain proofs**: raw Risc0 STARKs or Groth16-wrapped? Determines the LEZ forgery row and whether "phase 3" language needs to cover LEZ.
6. **STARK size for a Logos circuit**; RLN's Groth16 proof size (draft avoids the number).
7. **docs.logos.co LEZ transfer page** still says "ephemeral ECDH". **Blocks publication**: fix the docs or note that the page predates PR #474.
8. **Why is LEZ ML-KEM-only while Chat is hybrid?** Draft asks publicly.
9. **History pinning / Q-day-before-phase-3 contingency** (checkpoints vs. Cryptarchia's trustless bootstrapping). Draft asks publicly.
10. **Phase 3 date / fallback; why 2030 vs industry 2029.** Draft asks publicly.
11. **Groth16 setup trapdoor and consensus capture**: confirm framing (trapdoor recovery ⇒ forge leadership + wallet proofs), and whether the ceremony design changes anything.
12. **Chat X-Wing**: only Marvin's word ("removed briefly" then restored). Roadmap says 1:1 chat was rebuilt as a two-person MLS group in v0.2; does X-Wing cover that? Cite a release or changelog.
13. **LEZ public account keys**: roadmap describes #362 as BIP-341-based; Marvin describes SHA-256 derivation. Confirm the draft's description matches what shipped.
14. **Marvin's title / naming**: draft says "one of our applied cryptographers" (Corey's wording). Confirm he's fine being named; same for Mehmet.
15. **Blend ≥300x figure**: public spec link? Currently via the unpublished anonymous-block-proposers draft.
16. **AI-assisted auditing**: is the team already doing this? If yes, say so instead of asking.
17. **QRL 2018**: add a source link (mainnet launch announcement) or cut.
18. **Chain-analysis clustering claim**: add a citation (e.g. Chainalysis/Elliptic methodology, or academic clustering papers) if a reviewer wants one.
19. **Mehmet's "they used AI"** for the qubit paper: not verified; omitted.
20. **Pending PQ blog post** ("How Logos is Preparing for the Post-Quantum Future"): coordinate.
21. **Audit status**: re-check after a roadmap pull (local copy is from July 2026).

## Sources consulted (strip before publishing)

- Logos: forum #719; IFT research calls M-hIwizTRE8 (Mehmet, up. 2026-08-04) and MeI52qWyVRs (Marvin, up. 2026-08-10); roadmap `blockchain/updates/2026-03-02` through `2026-07-06` (PQ research tag), `anoncomms/roadmap/identity.md`, `testnets/v02-release.md`; docs Blend, Cryptarchia (bootstrapping rule), LEZ shared accounts, LEZ intro, LEZ transfer page, zone-sdk pages, Delivery security features; assembly drafts `anonymous-block-proposers-draft` (128-byte PoL proof, ≥300x Blend figure), `logos-networking-testnet-v02-draft` (Mix and RLN demo-mode limits), `transaction-supply-chain-threat-model-draft` (archivist).
- Full research notes with timestamps and confidence tags: `logos-tech-writing/ideas/quantum-and-ai-threats-research/` (private repo). Adversarial review trail: `ideas/quantum-and-ai-threats-draft-debate/`.
