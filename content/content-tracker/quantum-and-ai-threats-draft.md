# Your History Is the Attack Surface: Quantum Computers, AI, and the Archive You're Building

*Draft. Status: Second Draft, restructured per the 2026-10-27 review with Jonny, adversarially reviewed (3 rounds). The in-depth, component-by-component analysis lives in the technical companion, [[quantum-and-ai-threats-technical-draft]], headed for the research forum. Open questions are collected at the bottom; resolve before publishing.*

---

Picture somebody who did everything right with their crypto. Keys on hardware wallets, funds in a multisig, never posted an address. They still left behind a public list of the five addresses that control their money, and once anyone ties those addresses to people, it's a list of whom to visit.

Someone asked me recently what Logos is doing about quantum computers and AI. The short answer: both threaten the same thing, an archive of everything you've done that you're already feeding and that keeps getting cheaper to read. AI makes it cheap to put your name on that archive. Quantum computers will make it possible to open the parts you thought were sealed.

## The transaction supply chain builds the archive

Back to our somebody: a fund, a family office, a whale. Funds sit in a **3-of-5 Safe multisig**, five keyholders on five hardware wallets. Transactions go through a **private RPC** so bots can't front-run them. No ENS name, no doxxed wallet. Deals get talked through in a **group chat** with partners, the way basically every crypto deal gets done.

Now follow one ordinary payment. Logos' [PriFi work](https://logos.co/media/article/pri-fi-securing-transaction-supply-chain) treats a transaction as a supply chain of seven stages, from finding a counterparty to making the outcome stick. Settlement on the chain is only one of them, and the PriFi article calls it the glass-vault problem: "a vault with exceptionally strong locks and perfectly transparent glass walls." Every stage, on-chain or off, leaves a record with somebody (grouping a few stages together):

- **Discovery and diligence:** creating the Safe published its address, the five owner addresses, and who funded it. Anyone can pull its full history.
- **Negotiation:** the price got hashed out in the group chat, which sits on the chat provider's servers unless it's end-to-end encrypted. Then the standard Safe interface posted the proposed transaction (recipient, amount, timing) to Safe's hosted Transaction Service, a third-party index, before the other signers had approved it.
- **Contracting:** executing the payment published every signature, and every signer is recoverable from them, forever.
- **Ordering:** the private RPC kept the transaction out of the public mempool by handing the whole payload, plus the sender's IP address and timing, to one company.
- **Settlement and enforcement:** the amount, the parties, and the new balances, public and permanent; every operator of the Safe linkable by anyone with a block explorer.

![[qa-archive-feed.png]]
*Figure 1. Where the archive comes from. One well-protected multisig payment, using the common defaults, and the records it leaves with other people. An encrypted chat and private proposal coordination would remove the top two; the rest stay. Nothing here was hacked.*

Together those records are an archive: who controls the money, who they deal with, what they intended to do before they did it, and the keys they sign with. A transaction is only as private as its leakiest stage, and here every stage leaked.

What does someone do with it? Physical "wrench attacks," where criminals coerce crypto holders in person, are a real and growing category: Chainalysis puts realized theft from them at over $30 million in the first half of 2026 alone, and Jameson Lopp keeps a [running list of cases](https://github.com/jlopp/physical-bitcoin-attacks). They start with visible wealth tied to a person, and that link often comes from leaked customer data or social media. A list of addresses guarding a fortune is harmless until someone ties it to people. That's the expensive step, and it's the one AI is making cheap.

## Now it's you: AI makes profiling cheap

The usual reaction: "I'm not a whale. Who cares about me?"

That used to be a reasonable bet. On public blockchains, the cheap half of profiling was automated years ago: chain-analysis firms cluster addresses at scale with plain heuristics, and Chainalysis, the biggest name in the field, was [estimated at roughly $190 million](https://sacra.com/c/chainalysis/) in annual revenue in 2023 selling that graph. The expensive half was connecting a cluster of addresses to a *person*, which took analysts, so it only got done to people worth the cost.

AI is eating that half. Bathang laid out the mechanism in [Metadata in the Age of AI Inference](https://logos.co/media/article/metadata-ai-inference): metadata comes in three flavors, who, when, and where, and while "a single piece of metadata rarely says much," pieced together it forms a mosaic. Research backs that up:

- Researchers at ETH Zurich [showed](https://arxiv.org/abs/2310.07298) GPT-4 inferring location, income, and other personal details from people's Reddit posts at about 100x lower cost and 240x faster than humans.
- In February 2026, two days after Bathang's piece, a team including Nicholas Carlini and Florian Tramèr [showed](https://arxiv.org/abs/2602.16800) LLM agents matching pseudonymous Hacker News accounts to their owners' LinkedIn profiles, at up to 68% recall with 90% precision when picking from 1,000 candidates. The best pre-LLM method got close to zero. Their conclusion: "practical obscurity protecting pseudonymous users online no longer holds."

Those results are about text, not transactions, but text is how an address becomes a person. Your version looks like this: one hot wallet, used for everything. A handle you've had since 2019. A post saying you just bought into some token, ten minutes after a swap from that wallet. Nobody's going to line those up by hand for you. A model will, for pennies, along with everyone else's. What it's good for: phishing that quotes your actual holdings, or a scam timed to the day you got paid.

So "who cares about me" is the wrong question. Nobody has to care. And you have fewer of the whale's safeguards, not more.

## Quantum computers open what's sealed and forge what's signed

If AI reads what's readable, the obvious defense is to seal more of it: encrypt the payment, encrypt the conversation, publish only the sealed version. Quantum computers are the threat to exactly that, on two different clocks.

**It reads old encrypted data, and that clock is already running.** Much of the encryption deployed over the last few decades sets up its keys with elliptic-curve math, which a big enough quantum computer breaks. Anyone who recorded the encrypted traffic can read it years later. That's called harvest-now-decrypt-later, and it means the deadline for encryption is the day data starts going out, not the day the machine arrives. If you've done the right thing and encrypted, this is the clock that's about you. Big players have moved: Signal [added post-quantum encryption](https://signal.org/blog/pqxdh/) in 2023, Apple [did it for iMessage](https://security.apple.com/blog/imessage-pq3/) in 2024, and as of April 2026 Cloudflare says [over 65% of human traffic](https://blog.cloudflare.com/post-quantum-roadmap) through its network is protected this way. On a blockchain, nobody even has to do the recording: Google's quantum team says the biggest quantum danger to Zcash is [retroactive loss of privacy](https://quantumai.google/static/site-assets/downloads/cryptocurrency-whitepaper.pdf), which can't be fully undone for data already on Zcash or Monero.

**It forges signatures, and that clock runs forward.** A quantum computer turns a public key into the matching private key. Every Safe execution published its signers' signatures, and the public keys come right out of those; five hardware wallets and a 3-of-5 threshold don't matter once three of those keys can be computed from the chain. Your version is simpler: the first time your hot wallet sent anything, its public key went on-chain for good. Bitcoin has the same problem at scale, with [about 6.7 million BTC](https://quantumai.google/static/site-assets/downloads/cryptocurrency-whitepaper.pdf) in addresses whose public keys are already exposed, plus any coin whose public key shows up while its transaction waits to confirm.

The difference from encryption is that a forged signature mostly only works while a network still accepts the old kind, so you can swap schemes ahead of the machine. Once that's done, a quantum attacker who can forge the old scheme holds a key to a door that's been bricked over. (There are catches, covered in the technical companion: new nodes still check old blocks, and old signatures stop counting as evidence.)

When does the machine arrive? Nobody knows, but the estimates of what it takes keep dropping:

![[qa-qubit-estimates.png]]
*Figure 2. Published estimates of the qubits needed to break RSA-2048 and 256-bit elliptic curves, next to headline machines. Each estimate assumes a particular kind of hardware, so compare like with like.*

The estimate that matters most for blockchains came in March 2026: Google Quantum AI, with Justin Drake (Ethereum Foundation) and Dan Boneh (Stanford), estimated that the curve Bitcoin and Ethereum use falls to fewer than 500,000 superconducting qubits, about 9 minutes per key once the machine is warmed up. A Caltech team put a similar curve at 26,000 neutral atoms, running for days. Today's machines range from about a hundred high-quality superconducting qubits to a few thousand atoms held in place, and none of them has shown error-corrected computation at anything near those scales; that's the hard part. The 26 experts in the Global Risk Institute's [latest survey](https://globalriskinstitute.org/publication/quantum-threat-timeline-report-2025b/) put the odds of a cryptographically relevant machine within ten years at "quite possible" (28–49%). That's enough for Google to [set 2029](https://blog.google/innovation-and-ai/technology/safety-security/cryptography-migration-timeline/) as its own migration deadline, and for Cloudflare to [move to 2029](https://blog.cloudflare.com/post-quantum-roadmap) too.

That's the link between the two threats. Sealing is the defense against cheap AI reading, and sealing only works long-term if the seal is post-quantum *before* you publish. Any privacy system has to meet that bar, and I'm going to hold Logos to it below.

## The same payment on Ethereum and on Logos

What does it look like to stop feeding the archive? I've been building a demo app on Logos called [Muster](https://github.com/corpetty/muster) (a personal project; disclaimer at the bottom) to show exactly that: do the same intended action on different rails and record what leaves the room at each stage.

Some of the whale's leaks are a tooling choice. When Muster drives a Safe, the signers agree on the proposal among themselves and share only a 32-byte fingerprint of it, so the negotiation never touches a third-party index; any Ethereum user can coordinate that way today. What nothing around a Safe on Ethereum can hide is the *togetherness*: the owner set, the signers, the amount, and the parties all become public at execution, because a public chain verifies things by showing them.

On Logos, the payment happens inside an end-to-end encrypted chat room, as a private transfer. Here's Figure 1 again, on Logos:

![[qa-archive-feed-logos.png]]
*Figure 3. The same intended payment as a private-to-private transfer in Muster on Logos testnet. Compared with Figure 1: the chat, proposal, and settlement archives are gone; discovery, negotiation, and the agreement stay in the encrypted room; the chain gets sealed data. What still leaks is metadata: the testnet sequencer sees the sealed transaction plus your IP address and timing, and the messaging network sees who connected when. Diligence and enforcement weren't measured.*

It isn't quite the whale's payment, though. Logos has shared private accounts, which look like a single account on-chain, so the member list isn't published. But today they're any-member-can-spend, and a real 3-of-5 threshold has to be built as a program on top. Muster hasn't built that yet, so Figure 3 is a single-signer transfer.

Muster tells you what each option discloses before you choose, and what escaped afterward. (LEZ is the testnet token; "Private λ" marks a private account.)

![[qa-muster-send-dialog.png]]
*Figure 4. Choosing how to pay. Private-to-private hides the amount and both parties; public-to-private leaves the amount and the sender on the public record.*

![[qa-muster-receipt.png]]
*Figure 5. The receipt. You see your own amount (20 LEZ); the public record doesn't. "What left the room": amount, who paid, and who was paid, not disclosed. That it happened, and when, on the record.*

You can get much of this from existing tools: Signal for the conversation, a privacy chain like Zcash for the payment. The trouble is in the seams. You copy a shielded address out of one app and paste it into another; the chat operator sees when you talked, the wallet's RPC sees your IP when you paid, and the timestamps line up; and no app can tell you what left the room, because no app sees the whole transaction. Logos isn't past that yet either: Figure 3 still has two observers, the messaging network and the sequencer. What one stack buys today is one place that can account for what left. What it's meant to buy is both observers closed under one threat model, with Logos Mix hiding who talks to whom and the sequencer no longer a single operator. Neither is done.

Where it falls short today:

- **AI still gets what's left.** Timing, any move between public and private accounts, and everything you post publicly are exactly what models are good at lining up. Logos removes the contents and the counterparties from the record; it doesn't remove your habits.
- **Getting in is visible.** Your funds probably start on an exchange or a public chain, and moving them into a private account shows the amount and the sender, on a testnet where the crowd you're hiding in is small.
- **The network layer isn't closed.** This demo doesn't route through Logos Mix, which is still early, and even working mixnets only blunt traffic analysis: a deep-learning attack called [MixMatch](https://petsymposium.org/popets/2024/popets-2024-0050.php) still matched about a quarter of message flows on the live Nym mixnet. Muster's disclosure panel also doesn't yet tell you that the sequencer sees your IP.
- **The whale would be giving things up.** No 3-of-5 threshold yet, no hardware-wallet flow. If you're the whale, don't move a treasury onto a testnet.
- **I built the thing doing the measuring.** The leak inventory and the code are public in the [Muster repo](https://github.com/corpetty/muster); please check my work.

## What Logos is doing about quantum

By the rule above, Logos has to seal its data before it publishes. Here's where that stands, per the team's forum post and talks from August 2026; "done" means merged into pre-mainnet code, not audited. (The [technical companion](https://logos-co.github.io/assembly/content-tracker/quantum-and-ai-threats-technical-draft) has the full status.)

- **Your private payments, done:** the sealed account data Logos posts on-chain uses ML-KEM-768, the post-quantum key exchange NIST standardized, [merged in June 2026](https://github.com/logos-blockchain/logos-execution-zone/pull/474). It's post-quantum only, not a hybrid with classical crypto like Signal's, which is a choice I've asked the team to explain.
- **Your messages, done per Marvin:** Logos Chat uses a hybrid of classical and post-quantum encryption, according to our cryptographer Marvin Jones, pending confirmation that it covers the group-chat protocol that one-on-one chats now use too.
- **Who-talked-to-whom, partly scheduled:** post-quantum protection for connections between nodes is targeted for the end of 2026, and for Blend, the layer that hides which node produced a block, before mainnet. Logos Mix, Logos Storage, peer discovery, and the messaging transport underneath Chat haven't been assessed yet. By my own rule, that's the uncomfortable part: network traffic on testnet today isn't protected against harvest-now-decrypt-later, and some of it isn't scheduled to be.
- **Signatures and proofs, after mainnet:** post-quantum signatures first, then replacing the zero-knowledge proofs behind block production on the Logos chain. That last one is unsolved; the known replacements are tens to thousands of times bigger. Marvin's target for being fully post-quantum is 2030, a year behind the deadlines Google and Cloudflare set for themselves.

That last item matters more for a private chain than a public one. Transparency buys something real: anyone can audit the supply. A private chain earns that back with zero-knowledge proofs, and those proofs are exactly what a quantum computer could forge, including proofs that mint money nobody can see. On the base Logos chain, one proof system guards block production and every wallet at once. Those wallets are designed so a quantum computer can't recover the secret behind them, so once the proofs are swapped, owners keep their accounts without having to be online during a migration window. Until then it's a race, and if a capable quantum computer arrives first, the base chain is in a worse spot than Bitcoin for a while: Bitcoin's exposure is exposed keys and coins caught in flight, Logos' would be everything at once. The execution layer, where Muster's payments live, is a separate question: its public accounts can be drained until the old signatures are retired, and whether its private-account proofs are post-quantum is still open.

## What you can do today

You can't un-publish what's already in somebody's archive. You can stop adding to it.

**For your one hot wallet, today:**

- **Use fresh addresses per counterparty**, and don't post about trades from the handle you've had for years.
- **Talk about money on end-to-end encrypted, post-quantum messaging.** Signal already does this.
- **If you share a multisig,** coordinate proposals among the signers instead of through a hosted transaction service.

**If you want to stop feeding it altogether:**

- **Keep the whole transaction in one place, on your machine.** Many leaks happen in the seams between tools run by other people. [Basecamp](https://logos.co/basecamp) runs the Logos stack on your own computer, and apps like Muster do discovery, negotiation, and payment in one encrypted room, talking out only to the messaging network and, on testnet, one sequencer. It's testnet today, so it's for trying, not for your savings.
- **Shield first, then pay, and don't make it obvious.** "Shielding" means moving funds into a private account before using them; paying straight out of a public account leaves you and the amount on the record. The shielding step itself is visible, so don't shield the exact amount right before you pay. Linking those in-and-out moves is how researchers deanonymized many Zcash transactions ([Kappos et al., 2018](https://www.usenix.org/conference/usenixsecurity18/presentation/kappos)).
- **Ask every tool what left the room.** If it can't tell you, assume the answer is "everything."

The clock that reaches backward is encryption, and on Logos the data a quantum computer would most want from the chain, your private payments, is already sealed against it, ahead of mainnet. On metadata, Logos today beats the Ethereum defaults and isn't yet good enough: the network layer and the proofs are still work in progress. That's work you can watch happen, and push on.

## Methodology (holler at me)

I work at Logos, and the Logos-specific claims come from the team's own public material: Marvin's [forum post](https://forum.research.logos.co/t/logos-techstack-pq-readiness/719), two IFT research calls ([1](https://www.youtube.com/watch?v=M-hIwizTRE8), [2](https://www.youtube.com/watch?v=MeI52qWyVRs)), the Logos roadmap, and [docs.logos.co](https://docs.logos.co). The Ethereum vs Logos comparison comes from Muster's leak inventory, derived from Muster's code and a local end-to-end test, not from mainnet measurements. Muster is a personal project of mine, not a project of, affiliated with, or endorsed by Logos Collective Association or IFT Studio Pte. Ltd. External numbers link to primary sources where I could find them. The [technical companion](https://logos-co.github.io/assembly/content-tracker/quantum-and-ai-threats-technical-draft) has the full component status, the open problems, and what I'm asking the team for. Thanks to a friend with a quantum computing background for checking the quantum section.

If you think I've got the threat model wrong, or that some part of this deserves more worry than I'm giving it, I want to hear it. Reply on the [forum thread](https://forum.research.logos.co/t/logos-techstack-pq-readiness/719) or hit me up on X.

*[Corey: AI-assistance acknowledgment line per voice profile.]*

---

## Open questions (strip before publishing)

1. **Quantum-section acknowledgement**: thanks "a friend with a quantum computing background"; swap in a name once confirmed.
2. **Wrench-attack figure**: "$30M+ realized theft, H1 2026" is Chainalysis ("Violent Wrench Attacks 2026", per `ideas/podcast-privacy-substrate.md`). **Add the Chainalysis URL**; it's the only unlinked number in the piece.
3. **Images**: `qa-archive-feed.png`, `qa-archive-feed-logos.png`, `qa-qubit-estimates.png`, `qa-muster-send-dialog.png`, `qa-muster-receipt.png` in `content/attachments/`. Confirm they render on Pages. `qa-rails-diff.png` is unused here; candidate for the Muster series.
4. **Shared private accounts "look like a single account on-chain"**: inferred from docs.logos.co (every member derives the same keys from one group secret). Confirm, and whether Muster plans a threshold program.
5. **Sequencer visibility** ("sealed transaction plus your IP address and timing"): inferred from Muster connecting directly to testnet.lez.logos.co without Mix. Confirm; consider adding it to Muster's disclosure panel, then update the "doesn't yet tell you" line.
6. **Chat hybrid encryption**: only Marvin's word; v0.2 rebuilt 1:1 chat as a two-person MLS group, so the MLS-ciphersuite question covers all Chat (technical companion OQ12).
7. **LEZ private-account proofs**: raw Risc0 STARKs or Groth16-wrapped? Determines whether "whether its private-account proofs are post-quantum is still open" can be resolved (companion OQ5).
8. **"tens to thousands of times bigger" proofs** and the **base-chain "worse spot than Bitcoin" / invisible-inflation framing**: confirm with the crypto team before it goes out under a Logos byline.
9. **Wallet-key claims** (base-chain wallets designed so the secret can't be recovered; LEZ public accounts drainable until cutover): per Mehmet's talk, Marvin's forum post, and the companion; companion OQ4/OQ13 on exact LEZ key derivation still open.
10. **"A Caltech team put a similar curve at 26,000 neutral atoms"**: that estimate is for P-256 (labelled in Figure 2).
11. **Technical companion link**: swap for the forum URL once posted.
12. **Basecamp link**: logos.co/basecamp vs logos.co/get-started.
13. **Carl's "be somewhat hyperbolic" note** vs Corey's "give people hope": Corey's call.
14. All technical-companion open questions still apply.

## Sources consulted (strip before publishing)

- Meeting: Corey + Jonny, 2026-10-27 (petty-notes/meetings/mnemosyne).
- Logos: PriFi article (logos.co, 2026-09-15); Bathang, "Metadata in the Age of AI Inference" (logos.co, 2026-02-16); forum #719 and #723; IFT research calls; Muster leak inventory and posts (`muster-articles/`); docs.logos.co LEZ shared private accounts; testnet v0.2 release notes; technical companion and its sources.
- Figures: `ideas/quantum-and-ai-threats-figures.py` renders `qa-archive-feed.png`, `qa-archive-feed-logos.png`, `qa-qubit-estimates.png` (and `qa-rails-diff.png`, unused here); screenshot crops `qa-muster-send-dialog.png`, `qa-muster-receipt.png`.
- Research notes: `logos-tech-writing/ideas/quantum-and-ai-threats-research/`; review trails: `ideas/quantum-and-ai-threats-draft-debate/` (technical), `ideas/quantum-and-ai-threats-story-debate/` (story).
