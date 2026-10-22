# Your History Is the Attack Surface: Quantum Computers, AI, and the Logos Stack

*Draft. Status: First Draft. Audience: privacy-curious general readers and crypto folks who've heard "quantum" and "AI" used as scare words and want the actual shape of the problem. Open questions for the cryptography team are collected at the bottom; resolve before publishing.*

---

Someone asked me recently what Logos is doing about quantum computers and AI. I sent them a [forum post](https://forum.research.logos.co/t/logos-techstack-pq-readiness/719) and two research-call recordings ([one](https://www.youtube.com/watch?v=M-hIwizTRE8), [two](https://www.youtube.com/watch?v=MeI52qWyVRs)) from our applied cryptography folks. That's a great answer if you enjoy an hour on Groth16 proof sizes (I do, sue me (don't)). This is the version for everyone else.

Quantum computers and AI get talked about as two separate scary things. For privacy, they're the same threat: both make your past cheaper to read. A quantum computer breaks the math that keeps old encrypted data secret. AI breaks the economics that kept old public data from being useful. Neither one has to touch you today. They just need the record of what you did, and on a blockchain that record gets longer every block and never goes away.

## Two threats, one shape

Every privacy system you use leans on one of two kinds of protection.

The first is **math**. Your data is encrypted, and decrypting it without the key would take longer than the universe has left. That's computational hardness, and it's what quantum computers attack.

The second is **cost**. The data is technically visible (pseudonymous addresses, timestamps, who talks to whom, how you write) but turning it into knowledge about *you* takes so much human effort that nobody bothers, except for the people they really care about. Bruce Schneier [put this well in 2023](https://www.schneier.com/blog/archives/2023/12/ai-and-mass-spying.html): surveillance went bulk and automatic decades ago, but understanding what was collected stayed limited by human labor. That limit is what AI removes.

Both attacks share a property that makes them nasty: they're retroactive. Every improvement applies to everything already collected. In the [transaction supply chain threat model](https://logos-co.github.io/assembly/content-tracker/transaction-supply-chain-threat-model-draft) I called this adversary the archivist: collect everything, wait, monetize later. Quantum and AI are the two upgrades the archivist is waiting for. And blockchains are the archivist's dream, because every full node keeps a complete copy of history, for free, forever.

## The quantum part, with actual numbers

A large enough quantum computer running Shor's algorithm breaks RSA and elliptic curve cryptography (ECC). ECC is what nearly every blockchain uses for signatures and what most of the internet uses for key exchange. The question was always *when*, and the answer has been moving toward us fast:

- **2019:** breaking RSA-2048 was estimated at ~20 million noisy qubits.
- **May 2025:** Craig Gidney [cut that to under 1 million qubits, in under a week](https://arxiv.org/abs/2505.15917).
- **March 2026:** Google Quantum AI, with Justin Drake (Ethereum Foundation) and Dan Boneh (Stanford), [estimated](https://quantumai.google/static/site-assets/downloads/cryptocurrency-whitepaper.pdf) that the elliptic curve Bitcoin and Ethereum use can be broken with **fewer than 500,000 physical qubits**, about 20x fewer than the 2023 estimate. A pre-warmed machine would need roughly 9 minutes from seeing a public key to recovering the private key. That's about one Bitcoin block.
- **Same day:** a Caltech/Oratomic team [estimated](https://arxiv.org/abs/2603.28627) a different 256-bit curve could fall in a few days on 26,000 neutral-atom qubits.

Elliptic curves turn out to be the *easier* target compared to RSA. The Google paper didn't separately estimate Ed25519 (one of the curves Logos uses), but it's the same size class.

Nobody has that machine. Google's Willow chip, the one that made headlines in December 2024, has 105 qubits. The 26 experts surveyed in the Global Risk Institute's [latest report](https://globalriskinstitute.org/publication/quantum-threat-timeline-report-2025b/) put a cryptographically relevant quantum computer at 28–49% likely within ten years. Google and Cloudflare both moved their own migration deadlines to [2029](https://blog.cloudflare.com/post-quantum-roadmap) after the 2026 papers landed.

I'm not gonna tell you when Q-day is. I'm gonna tell you it doesn't matter for half the problem.

### Harvest now, decrypt later

Record encrypted traffic today; decrypt it whenever the machine shows up. It's the standard assumption about state intelligence agencies, which is why Signal and Apple shipped post-quantum key exchange in [2023](https://signal.org/blog/pqxdh/) and [2024](https://security.apple.com/blog/imessage-pq3/), long before anyone has a quantum computer worth worrying about.

For a blockchain, nobody even has to do the recording. The network does it for them. Google's paper says the most pressing quantum danger for Zcash is the retroactive degradation of privacy, and that privacy can't be fully restored for data already sitting on Zcash or Monero. Both launched when this looked like a 2040 problem. Launch timing matters a lot here, and I'll come back to it.

So for anything encrypted, the deadline is today.

## Not everything breaks backward

| Primitive | What a quantum computer does to it | Does the damage reach the past? |
|---|---|---|
| Encryption keyed by elliptic-curve key exchange | Recovers the key, reads the data | **Yes.** Everything ever recorded |
| Signatures (Ed25519, Schnorr, ECDSA) | Forges signatures, may recover signing keys | Only while the system still accepts that signature scheme |
| Zero-knowledge proofs like Groth16 | Forges new proofs | Only while accepted. Old proofs reveal nothing about their secrets, even to an unlimited attacker |
| Hiding commitments (what private chains put on-chain instead of amounts) | Can break *binding* (enables forgery), can't break *hiding* | The hidden values stay hidden |
| Hash functions, symmetric ciphers | Grover's algorithm roughly halves the security level | No. 256-bit stays safe |

The [Google paper](https://quantumai.google/static/site-assets/downloads/cryptocurrency-whitepaper.pdf) and Zcash's Sean Bowe ([here](https://seanbowe.com/blog/zcash-and-quantum-computers/)) both lay out this split. Confidentiality fails backward in time. Authenticity only fails going forward. A forged signature is useful only while someone will accept it. Once the network stops accepting the old scheme, a quantum attacker who can forge it is holding a key to a door that's been bricked over.

That gives you a plan:

1. **Encryption goes post-quantum before mainnet**, because anything encrypted the old way and published is exposed forever.
2. **Signatures and proofs get swapped later**, with a cutover where the old ones stop being accepted, ahead of anyone having a quantum computer.

That's what the Logos cryptography team laid out. Marvin Jones's [forum post](https://forum.research.logos.co/t/logos-techstack-pq-readiness/719) states it directly: Logos *will* be harvest-now-decrypt-later secure before mainnet, and is not yet fully post-quantum, by design. Mehmet's [talk](https://www.youtube.com/watch?v=M-hIwizTRE8) breaks the blockchain side into four phases:

- **Phase 0:** node-to-node connections switch to a hybrid post-quantum key exchange. Target: end of 2026.
- **Phase 1:** Blend, the layer that hides who proposed a block, replaces its elliptic-curve key exchange with a post-quantum one. Before mainnet. Candidates are ML-KEM (the NIST standard) with code-based fallbacks (Classic McEliece, HQC), benchmarked on a Raspberry Pi 5, because Pi-class hardware running a node is a design goal they're not willing to give up.
- **Phase 2:** Ed25519 signatures move to post-quantum ones (ML-DSA, Falcon, or SLH-DSA). After mainnet.
- **Phase 3:** Groth16 zero-knowledge proofs get replaced. After mainnet, and the hardest.

You might be thinking "why not just do all of it now?" Cost. Post-quantum keys, signatures, and ciphertexts run 10x to 100x larger than what they replace. Proofs are worse. A Groth16 proof of block leadership in Logos is 128 bytes. The post-quantum candidates (STARKs, mostly) run kilobytes to hundreds of kilobytes. In RLN, Logos' anonymous spam protection, a proof rides along with every single message. Marvin's line on this: "we kind of are spoiled with Groth16." Doing the work in this order spends the expensive upgrades where breaks are retroactive and buys research time where they aren't. On phase 3, Mehmet's own assessment is that he hopes they can solve it.

## Designing so a broken key isn't a stolen account

Deferring signatures only works if a quantum attacker who breaks one can't turn it against your history or your holdings. Bitcoin is the cautionary tale. Public keys sit exposed on-chain, and the Google paper counts roughly 6.7 million BTC in addresses with exposed keys, about 2.3 million of which haven't moved in five-plus years. Owners who don't migrate in time lose their coins to whoever builds the machine first, so the Bitcoin community is stuck arguing about whether to [freeze old coins](https://bips.dev/361/) preemptively. There's no good answer there, only chosen harms.

Logos was built to avoid that position:

- **Blockchain keys are hashes.** Your public key is a hash of your secret key, and "signing" is a zero-knowledge proof that you know what hashes to it. A quantum computer can forge that proof (until Groth16 is replaced) but can't run a hash backward to get your secret. After the proof system is swapped, people keep the same key.
- **LEZ public accounts derive their signing key from the account secret through SHA-256.** A harvested signing key gets an attacker a disposable key, not the account. When the network stops accepting the old signatures, owners prove ownership with the account secret whenever they come back. In Marvin's words: "we do not forfeit inactive accounts."
- **Block proposers sign with one-time keys.** A public key that's used once and thrown away gives a forger nothing to come back to.
- **Groth16 is perfectly zero-knowledge.** Old leadership and quota proofs reveal nothing about the secrets behind them, quantum computer or not.

Cool. But where private data *is* encrypted and published, it has to be post-quantum now. Here's what's already shipped:

- **LEZ private account state** is encrypted with ML-KEM-768 (NIST's standardized post-quantum key exchange). The cost: viewing keys went from 32 bytes to about a kilobyte. Marvin's review: "our viewing key sucks." Worth it.
- **LEZ shared accounts** seal their group secret to new members with ML-KEM-768 ([docs](https://docs.logos.co/lez/accounts/set-up-shared-private-lez-account)).
- **Logos Chat** uses X-Wing, a hybrid of classical X25519 and ML-KEM-768. Hybrid matters: brand-new post-quantum code is where implementation bugs live (researchers have used deep learning to pull secrets out of [real Kyber implementations](https://eprint.iacr.org/2022/1713) via power analysis), so you keep the classical layer as a floor. Marvin ranks chat as the most important piece to get right, because the people who need private chat most (whistleblowers, abuse survivors) are exactly the people a revealed history hurts most.

## The AI part: "nobody will bother" is over

No credible source I found shows AI breaking a modern cryptographic primitive. What it breaks is the cost assumption.

**Deanonymization.** In February 2026, researchers including Nicholas Carlini and Florian Tramèr [showed](https://arxiv.org/abs/2602.16800) LLM agents matching pseudonymous Hacker News accounts to real identities at 68% recall with 90% precision. The best pre-LLM method got close to zero. Their conclusion: "practical obscurity protecting pseudonymous users online no longer holds."

**Traffic analysis.** Machine learning has been eating anonymity networks for a while. [DeepCorr](https://arxiv.org/abs/1808.07285) correlated Tor flows at 96% accuracy back in 2018. More relevant to us: [MixMatch](https://petsymposium.org/popets/2024/popets-2024-0050.php) ran deep-learning flow matching against the live Nym mixnet and caught about 60% of flows at a 1% false-positive rate. Cover traffic made it substantially harder.

**Finding bugs.** Anthropic's [SCONE-bench](https://www.anthropic.com/research/smart-contracts) had AI agents exploit 51% of 405 real-world previously-exploited smart contracts in simulation, scanning a fresh contract for about $1.22, with exploit revenue doubling roughly every 1.3 months. Their Mythos Preview model [found thousands](https://www.anthropic.com/glasswing) of high-severity vulnerabilities across major operating systems and browsers; Mozilla fixed 271 in a single Firefox release. Nobody's confirmed an AI-found DeFi exploit in the wild yet; [analytics firms suspect](https://www.bloomberg.com/news/articles/2026-05-15/ai-hacking-threat-pushes-130-billion-crypto-sector-to-the-brink) AI helped pick targets in the April 2026 heists.

The pattern: anything protected by "nobody will bother" is now protected by nothing. Your on-chain history, your timing, your writing style, the code you deployed three years ago. All of it can now be read by something tireless and cheap.

And the two threats compound. Quantum opens the archive; AI reads it. A decrypted history of private transactions, fed to a model that correlates it with everything else you've ever posted, isn't a list of amounts. It's your social graph.

## Logos vs. AI: don't emit the signal

You can't out-compute a classifier that gets better every year. You can give it less to learn from. A model infers what's in the data; it can't infer what was never there.

- **Blend** (the block-proposer anonymity layer) wraps proposals in layers of encryption, holds each one for a random delay at every hop, and has every core node send cover messages at a constant rate whether it has a block or not. Cover messages are indistinguishable from real ones, [even to Blend nodes run by the adversary](https://docs.logos.co/blockchain/concepts/about-the-blend-network). The Blend spec puts linking a proposal to its sender at 300x+ harder; an adversary with 10% of stake targeting a 0.1%-stake node would need over 10 years of observation. A rare real message buried in constant, uniform noise is exactly the case where a traffic classifier has the least to learn from.
- **Cryptarchia** (private proof-of-stake) has leaders prove eligibility in zero knowledge. Stake and identity are never published, so there's nothing for a model to fit.
- **LEZ private state lives on your device.** The chain only sees commitments and nullifiers. Data that's never published can't be decrypted later, correlated later, or fed to a model later. That's the one defense that handles quantum and AI at the same time.
- **RLN** rate-limits spam without identifying anyone. An AI-generated spam flood gets priced out, and nobody builds a dataset of who sent what in the process.

Where this falls short today:

- Cover traffic degrades machine-learning attacks; MixMatch shows it doesn't eliminate them. Logos Mix (the general-purpose mixnet, separate from Blend) [doesn't yet defend against an observer who can watch the whole network](https://logos-co.github.io/assembly/content-tracker/logos-networking-testnet-v02-draft), runs on a five-node testnet fleet, and nobody's measured its anonymity set.
- In Blend, edge nodes (lighter nodes that don't relay) get less protection than core nodes. Research is ongoing.
- AI finds bugs in our code too. The blockchain and LEZ cryptography audits are still open. I'm not claiming immunity to anything here.

## The scoreboard

As of the team's August 2026 writeups:

| Component | Post-quantum status | Notes |
|---|---|---|
| LEZ private account encryption | **Done** (ML-KEM-768) | Viewing keys grew from 32 B to ~1 KB |
| LEZ shared account sealing | **Done** (ML-KEM-768) | |
| LEZ public account keys | **Safe against key recovery** (hash-derived) | Post-quantum signature scheme not chosen yet |
| Logos Chat encryption | **Done** (X-Wing hybrid) | |
| Logos Chat signatures | Ed25519, migrate later | Forgery-only exposure |
| Node-to-node connections | Phase 0, target end of 2026 | Key exchange only; authentication later |
| Blend message encryption | Phase 1, before mainnet | The remaining harvest-now-decrypt-later gap on the blockchain |
| RLN membership hashes | 128-bit Poseidon; move to 256-bit under discussion | Team is split on urgency |
| Block and node signatures (Ed25519) | Phase 2, after mainnet | |
| Zero-knowledge proofs (Groth16: leadership, quota, rewards, RLN) | Phase 3, **unsolved** | Proof size is the problem |
| Logos Mix, Logos Storage, peer discovery | **Not yet assessed** | Mix uses EC key derivation and AES-128 |

## Why launching late is an advantage here

Bitcoin, Ethereum, Zcash, and Monero are all doing this as a retrofit. Their archives already hold the data, and some of it can't be protected after the fact. Logos doesn't have a mainnet archive yet. Mehmet's point in the talk: harvesting isn't even possible right now, because there are no real transactions to harvest.

If phases 0 and 1 land before mainnet like the team says, Logos launches with nothing on the wire or on-chain that a future quantum computer can retroactively open, and with private state designed to never hit the chain in the first place. That's an "if," and I'm going to hold us to it in public.

## Methodology (holler at me)

The Logos-specific claims come from the team's own public material: Marvin Jones's [forum post](https://forum.research.logos.co/t/logos-techstack-pq-readiness/719), Mehmet's and Marvin's IFT research calls ([1](https://www.youtube.com/watch?v=M-hIwizTRE8), [2](https://www.youtube.com/watch?v=MeI52qWyVRs)), the Logos roadmap, and [docs.logos.co](https://docs.logos.co). The external numbers link to the primary papers and vendor posts. Where the team's own sources disagree with each other (like whether RLN is already harvest-safe), I've reported the more cautious version. Quantum resource estimates move every few months; these are as of October 2026.

If you think I've got the threat model wrong, or that some part of the stack deserves more worry than I'm giving it, I want to hear it. Reply on the [forum thread](https://forum.research.logos.co/t/logos-techstack-pq-readiness/719) or hit me up on X.

*[Corey: AI-assistance acknowledgment line per voice profile.]*

---

## Open questions for the crypto team (strip before publishing)

1. **RLN**: forum body says "RLN is HNDL secure," forum table says not until Poseidon-256. Draft reports the cautious version. Confirm with Marvin.
2. **Phase 0**: has the hybrid TLS key exchange landed (target end 2026)? Update the scoreboard if so.
3. **"Waku" in Mehmet's talk** assumed to mean Blend. Confirm.
4. **Blend phase-1 KEM**: did the finalized candidates doc pick one? Name it if public.
5. **LEZ on-chain proofs**: raw Risc0 STARKs or Groth16-wrapped? If wrapped, LEZ has its own phase-3 exposure and the scoreboard needs a row.
6. **STARK size comparator**: "kilobytes to hundreds of kilobytes" is a safe range; get the actual number for a Logos circuit if possible.
7. **docs.logos.co LEZ transfer page** still says "ephemeral ECDH"; stale since #474? Flag to docs team.
8. **Mehmet says the March 2026 qubit-estimate paper "used AI."** Not verified; omitted. If true, it's a great AI-accelerates-quantum hook.
9. **Pending PQ blog post** ("How Logos is Preparing for the Post-Quantum Future") on the roadmap: coordinate so this doesn't step on it.

## Sources consulted (strip before publishing)

- Logos: forum #719; IFT research calls M-hIwizTRE8 (Mehmet, up. 2026-08-04) and MeI52qWyVRs (Marvin, up. 2026-08-10); roadmap `blockchain/updates/2026-03-02` through `2026-07-06` (PQ research tag), `anoncomms/roadmap/identity.md`; docs Blend, Cryptarchia, LEZ shared accounts, LEZ intro; assembly drafts `anonymous-block-proposers-draft` (128-byte PoL proof, ≥300x / >10 yr Blend figures), `logos-networking-testnet-v02-draft` (Mix limits), `transaction-supply-chain-threat-model-draft` (archivist).
- Full research notes with timestamps and confidence tags: `logos-tech-writing/ideas/quantum-and-ai-threats-research/` (private repo).
