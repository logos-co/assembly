# The Transaction Supply Chain: A Threat Model

*Draft of a forum.logos.co research post. Companion tweet at the bottom. Status: First Draft (reworked from the earlier thesis draft per comms feedback: higher-level, threat-model-first, economic argument deferred).*

---

Everyone in this industry threat-models the contract. Auditors crawl the bytecode, formal verification gets funded, bug bounties pay seven figures. Almost nobody threat-models the *transaction*: the full chain of work that has to happen for an exchange to happen and hold. That chain is where the money actually dies. [Bybit lost \$1.5B](https://www.cnbc.com/2025/02/21/hackers-steal-1point5-billion-from-exchange-bybit-biggest-crypto-heist.html) while the contracts executed flawlessly.

A transaction is seven jobs: **discovery** (finding who has what you want), **diligence** (verifying they are who they claim), **negotiation** (agreeing price and terms), **contracting** (committing in enforceable form), **ordering** (deciding whose trade goes when), **settlement** (moving the value), and **enforcement** (making the outcome stick). Blockchains secured settlement. The other six run on infrastructure that watches, logs, and leaks.

This post maps the threat model for the whole chain: who's watching each link, what they gain, what it costs you, and why the patches on offer keep failing in the same way. I'm deliberately not arguing what closing the chain is worth; that argument deserves its own treatment and it's coming. This is the map. I want the forum's help stress-testing it, so the last section is open questions, and I mean them as questions.

## The adversaries

Four classes, distinguished by what they want and how long they'll wait. A useful threat model has to hold against all four at once, because they feed on the same substrate: the observable record of you transacting.

**The archivist** collects everything and monetizes it later. Chain-analytics firms cluster addresses, trace across bridges, and fingerprint behavior; [the market leader alone books hundreds of millions a year](https://sacra.com/c/chainalysis/) selling the graph to exchanges, funds, and governments. Mempool observers archive pending transactions wholesale; [one firm accumulated over 15TB of mempool history](https://web.archive.org/web/2025/https://www.blocknative.com/blog/blocknatives-historic-mempool-data) before winding down, [its team absorbed into Deloitte](https://www.theblock.co/post/401912/deloitte-absorbs-blocknative-team-as-crypto-infra-firm-winds-down-apis-and-gas-network). [RPC providers log your IP against your wallet address](https://www.theblock.co/post/189717/consensys-says-it-collects-ip-addresses-of-metamask-users-via-infura); it's in their privacy policies. The archivist's defining property: patience. The record can't decay, analysis improves every year, and what's safe against today's techniques is not safe against 2035's.

**The extractor** monetizes visible flow in real time. [Two builders assemble the large majority of Ethereum blocks](https://explorer.rated.network/builders) and read strategy straight out of calldata. MEV searchers watch the mempool and trade against you before you execute; [sandwich attacks alone have extracted \$400M+](https://eigenphi.io/mev/ethereum/sandwich) by EigenPhi's count, with total MEV extraction since 2020 in the billions. The extractor's defining property: speed. It doesn't care who you are, only what you're about to do.

**The predator** uses leaked information to steal directly. [Wallet drainers took \$494M in 2024](https://drops.scamsniffer.io/scam-sniffer-2024-web3-phishing-attacks-wallet-drainers-drain-494-million/) through phishing and malicious signatures. [Address-poisoning attacks](https://arxiv.org/abs/2501.16681) exploited transaction-history legibility 270 million times across Ethereum and BSC in two years, taking at least \$83.8M. And the leak goes kinetic: physical-coercion attacks against identified holders are a documented, growing category. The predator's defining property: targeting. Every leaked balance, position, and address pairing is target-selection data.

**The enforcer** pressures identifiable operators. At the post-Merge peak, [nearly 80% of Ethereum blocks flowed through OFAC-compliant relays](https://www.mevwatch.info/), assembled one squeezable intermediary at a time. This class plays by different rules: it doesn't need to break anything technical, only to find a nameable operator with something to lose. Its defining property: leverage. It attacks the people and companies around the protocol, not the protocol.

Notice what the four classes share. None of them breaks cryptography. The contract-level security this industry is good at is simply not where any of them operates.

## The chain, link by link

For each link: what leaks, who's watching, the observed damage, and the mitigation on offer today, with its trust assumption named. The trust assumptions are the point; watch what they have in common.

### 1. Discovery

Finding who has what you want happens through browsers, wallets, and hosted frontends. Your fingerprint, IP, balance queries, and the trackers embedded in nearly every dapp frontend broadcast your interest before you've committed to anything. Watching: archivists (trackers, RPC logs) and predators (target selection). Traditional finance treats intent as radioactive; institutional blocks route through dark pools, and [off-exchange trading has grown to roughly half of US equity volume](https://www.nasdaq.com/articles/exchange-trading-increases-across-all-types-stocks). Today's onchain mitigation: use a VPN, hope the frontend is honest. Trust assumption: the VPN provider and the frontend operator.

### 2. Diligence

Verifying a counterparty onchain takes no work, because the archivist already built the dossier and sells it. Your address history is the identity graph, and it cuts both ways: the same legibility that powers compliance powers the predator's [address poisoning](https://arxiv.org/abs/2501.16681). Today's mitigation: fresh addresses, manual hygiene. Trust assumption: your own operational discipline, forever, against an adversary whose analysis improves annually against your permanent record.

### 3. Negotiation

Size, terms, and reservation price leak through the channels we negotiate in. Telegram retains metadata even when content is encrypted. Public mempools broadcast terms before execution. The market's revealed answer: [roughly 80% of Ethereum DeFi interactions now route through private RPCs](https://arxiv.org/abs/2505.19708), per a CoW DAO research paper. Watch what that mitigation did: it moved the flow from a public mempool to a handful of private operators who now see everything. Trust assumption: the RPC operator, who is an archivist with a service agreement.

### 4. Contracting

The moment of commitment is the moment of maximum exposure. The frontend you sign on is unverifiable: DNS, hosting, and script injection make every signature an act of faith, and the signing surface is where the money dies at scale ([Bybit](https://www.cnbc.com/2025/02/21/hackers-steal-1point5-billion-from-exchange-bybit-biggest-crypto-heist.html), [drainers](https://drops.scamsniffer.io/scam-sniffer-2024-web3-phishing-attacks-wallet-drainers-drain-494-million/)). These are integrity failures rather than privacy leaks; the chain has to hold against both reading and rewriting, and the same unverifiable infrastructure enables both. Today's mitigation: hardware wallets (protects the key, not the payload you're signing) and "verify the URL." Trust assumption: DNS, the host, the extension store, and every script the page loads.

### 5. Ordering

Whose trade goes when is decided by whoever sees the pending flow, and the pending flow is public. Archivists store it, extractors trade against it, builders order it. Today's mitigation: private order flow to trusted builders, MEV-protection RPCs. Trust assumption: the builder duopoly you're routing around the mempool to reach.

### 6. Settlement

The one link crypto secured, and it secured it by publishing everything. Balances, approvals, positions, and validators sit in public, permanently. The ledger is the disclosure: every transparent settlement layer is a standing feed to the archivist, forever, retroactively. Today's mitigation: opt-in privacy tools and mixers. Trust assumptions and failure modes: opt-in privacy marks you as someone with something to hide, the crowd you hide in is only the others who opted in, and the tooling around the private core still leaks (the RPC you queried, the explorer you checked, the frontend you used).

### 7. Enforcement

Making the outcome stick depends on operators, and identifiable operators get pressured one by one; the OFAC-relay numbers above are what that looks like in production. Today's mitigation: jurisdiction shopping and operator goodwill. Trust assumption: that the operators between you and finality keep resisting pressure they have no structural reason to resist.

### The pattern

Every mitigation on offer is a trust swap, not a close. The leak doesn't stop; it relocates to a party you've agreed not to worry about: the VPN provider, the RPC operator, the builder, the relay. Each swap creates a new archivist with better data and a new pressure point for the enforcer. That's not an accident of immature tooling. It's what patching one link at a time structurally produces.

## Three dynamics that make it worse

**Weakest link, per property.** Your privacy is bounded by the leakiest link you didn't choose; your integrity by the weakest link you can't verify. Strong cryptography at settlement does nothing about the frontend that lied to you at contracting or the mempool that sold you out at ordering. The properties are only as strong as their weakest carrier, and the links carry different properties, so a complete threat model has to be built per-link and held simultaneously.

**The loop.** The chain of links isn't a line, it's a cycle. Everything archived from this transaction becomes the discovery and diligence input against your next one, and against everyone who has ever touched your addresses. The surveillance economy is the loop closing. This is why partial fixes decay rather than accumulate, and why "we'll add privacy later" is a plan to be retroactively deanonymized.

**Asymmetric time.** You defend in real time; the archivist attacks your history at leisure. Every defensive mistake is permanent; every adversary improvement is retroactive. This asymmetry is unique to transparent, immutable substrates: the same properties that make settlement credible make surveillance compound.

## What the defender is actually trying to get

Stating the goal precisely matters, because the sloppy version ("privacy") invites the sloppy rebuttal ("criminals"). The defender's goal is not opacity. It's **control over disclosure**: nothing leaks except what you choose to disclose, to whom, provably. A disclosure you choose (to a counterparty, an auditor, a regulator) is a relationship; a mempool archive you never consented to is a leak. Verifiability and disclosure are separable, which is the technical fact the whole design space turns on: zero-knowledge proofs let a network check that rules were followed without seeing the contents. Transparent-by-default systems bought their credibility by publishing everything because that was the only technology available when they shipped. It no longer is.

Mapped per link, control over disclosure requires: an interface that doesn't report you (discovery, diligence), coordination channels that don't leak intent (negotiation), signing surfaces you can verify (contracting), propagation that doesn't reveal origin (ordering), verifiability without disclosure at the ledger (settlement), and no single squeezable operator, with disclosure living at the application layer where it's chosen (enforcement). That property list is the requirements document for what we're building at Logos, and the honest status ledger lives in the docs and roadmap: [Basecamp](https://blog.logos.co/article/logos-basecamp) (local-first interface) is live; Messaging's protocol lineage runs in production; [Cryptarchia plus Blend](https://blog.logos.co/article/anonymous-block-proposers) delivers anonymous block proposals on testnet v0.2, with private transfers working in the execution zone; verifiable frontends, the networking-layer mixnet, and programmable privacy are roadmap. I'll take fire on any of that in the thread, but this post's claim is the threat model, not the product.

## Open questions, and I mean them as questions

**Is the adversary ranking right?** I've implicitly ranked the archivist as the apex threat (patience plus a non-decaying record). You could argue the enforcer is, since it operates on people rather than systems and no protocol fully escapes its own developers. Which ordering should drive design priority?

**The transparency dividend.** Open history is also diligence infrastructure: it's why onchain lending prices collateral instantly and why market makers quote tight. Selective disclosure claims to keep the dividend while killing the exposure (prove solvency without publishing history), but whether ZK proofs can substitute for open history at market scale is unproven. What would the experiment even look like?

**The trust-swap counterargument.** Dark pools and private RPCs show sophisticated capital satisfied with accountable trusted intermediaries. Maybe the trust swap is fine, and what looks like a structural flaw is just a functioning market for accountability. The counter-ledger is the logging, breach, and subpoena record of those intermediaries. Which way does the evidence actually point for institutional-scale flow?

**The scope limit.** The supply chain extends past any protocol: your OS, your browser, the group chat where the deal was first mentioned. If the unreachable links dominate the threat model, protocol-level coverage buys less than this post implies. Where's the crossover?

**The bootstrap problem.** Anonymity sets are only as strong as the crowd, and the loop punishes late arrivals: every year of delay adds to the archive that gets replayed against them. How does a new private-by-default network bootstrap a crowd against incumbents with a liquidity head start?

If you think the model's wrong, incomplete, or mis-ranked, that's exactly the feedback this post exists to collect. Bring the attack; the thread is the venue.

---

## Companion tweet (drives to forum)

Everyone threat-models the contract. Almost nobody threat-models the transaction.

Seven links. Four adversary classes. One permanent archive that gets sharper every year. And every patch on offer is a trust swap, not a fix.

The full threat model, open for attack: [FORUM LINK]

---

*Notes for reviewers: reworked from the earlier thesis draft per Jonny's feedback (2026-07-17): the economic/credible-commitment argument is deferred (whitepaper territory), the threat model is the piece. Carried over from the 3-round adversarial review: all primary-source links, the trust-swap framing, the per-property weakest-link claim, the loop, control-over-disclosure, and the open questions (which are the review's surviving attack surfaces, reframed as research questions for forum/KOL engagement). Capability claims per the public roadmap and v0.2 announce draft, 2026-07-17. The physical-coercion claim is deliberately unquantified pending a public source.*
