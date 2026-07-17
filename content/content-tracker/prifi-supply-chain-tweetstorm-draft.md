# PriFi tweet storm: the transaction supply chain, module by module

Thread for X. Supply-chain frame leads; each link gets its leak and the Logos module that closes it, with the Anatomy of Exposure article as the linked deep dive. All tweets verified ≤280 characters (links counted at t.co's 23).

**PLACEHOLDER in tweet 11**: testnet v0.2 announce article link. Swap in the real URL when it posts, or drop the tweet if the thread ships first.

---

1/
We keep saying blockchains secured transactions. They secured settlement. Settlement is one of seven jobs that have to get done for any exchange to happen and hold, and the other six still run on rails that log everything.

2/
The seven: discovery, diligence, negotiation, contracting, ordering, settlement, enforcement. Coase worked out in 1937 that firms exist because coordinating this chain is expensive. Later estimates put a 0.1% drop in transaction costs at enough to quadruple a country's wealth.

3/
Discovery and diligence: who has what you want, and are they who they claim. Your browser and wallet leak IP, fingerprint, and intent. A \$3B industry sells the graph.

Basecamp swaps that surface for a local-first UI, no trackers, no hosted frontend. https://blog.logos.co/article/logos-basecamp

4/
Negotiation: size, terms, reservation price. Telegram keeps metadata even when content is encrypted. Public mempools broadcast intent.

Logos Messaging does counterparty discovery and coordination anonymously, P2P. In production today, integrated by RAILGUN, Safe, and Status.

5/
Contracting: RPC providers log your IP next to your wallet address. You can't verify the frontend you sign on. Bybit lost \$1.5B without the chain breaking once.

Logos Storage is being built to serve verifiable, content-addressed frontends. File sharing runs on testnet today.

6/
Ordering: your pending tx sits in a public mempool archived wholesale, 15TB and counting. Two builders assemble most ETH blocks. Sandwich attacks pulled \$800M+.

Blend, live in v0.2, hides block proposers: anonymous broadcast purpose-built for consensus, not a general mixnet.

7/
Settlement: the link crypto did secure, by publishing it. Balances, positions, and the validator set sit in public permanently.

Cryptarchia plus Blend is private PoS: proposers can't be picked out of network traffic. On testnet now, private state next. https://blog.logos.co/article/anonymous-block-proposers

8/
Enforcement: identifiable operators get pressured one by one. At the peak, ~75% of ETH blocks came through OFAC-compliant relays. Swiss secrecy fell the same way.

Logos puts disclosure in Zones at the app layer, selective and voluntary by design. The base has nothing to squeeze.

9/
Then the record loops back. Everything archived from this transaction becomes the discovery and diligence data for your next one, and for everyone who has ever touched your addresses. Analysis techniques improve every year against a record that can't decay.

10/
A transaction is only as private as its weakest link, and every link's leak gets archived, so fixing one link just relocates the problem. That's why these are modules of one stack under one threat model, and why none of them works as a bolt-on.

11/
Some of this runs today, some is roadmap, and I'd rather be clear about which. Testnet v0.2 is live: blockchain, messaging, and storage in one desktop app, Blend running, node operators onboarding through Basecamp. [TESTNET V0.2 ARTICLE LINK — placeholder, swap when posted]

12/
The full walk-through of where each leak lives, with sources:

https://blog.logos.co/article/how-blockchain-transactions-leak-data

If you think the model is wrong somewhere, tell me. That feedback is the reason it's public.

---

## Notes for reviewers

Module-per-link mapping: Basecamp → Discovery/Diligence, Messaging → Negotiation, Storage → Contracting, Blend → Ordering, Cryptarchia → Settlement, Zones → Enforcement.

Capability language cross-checked 2026-07-17 against the public roadmap repo and the v0.2 announce draft. Live today: Blend private block proposals, Cryptarchia+Blend private PoS on testnet, all modules in Basecamp, Zone SDK bridging, Messaging in production. Roadmap: Storage verifiable frontends (serving-frontends deliverable, est. Oct 2026), private state, Zones selective disclosure. Decentralised sequencing delivered but not yet enabled.

Terminology: Blend is not a mixnet. It is an anonymous broadcast layer purpose-built for block proposals, part of private PoS with Cryptarchia (see the [anonymous block proposers article](https://blog.logos.co/article/anonymous-block-proposers)). The proper mixnet sits in the Logos networking layer (the mix protocol behind DHT-over-mix and file-sharing over mixnet; see the [[logos-messaging-testnet-v02-draft|messaging]] and [[logos-storage-testnet-v02-draft|storage]] v0.2 drafts). Transaction propagation privacy belongs to that networking-layer mixnet, not Blend.

All stats are publicly sourced; the lifecycle citations are in the [Anatomy of Exposure article](https://blog.logos.co/article/how-blockchain-transactions-leak-data).
