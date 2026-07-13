# Changelog: Logos Blockchain in Testnet v0.2

Record of the adversarial review applied to [[logos-blockchain-testnet-v02-draft|the blockchain draft]]. Process: three independent critics (research advocate checking claims against the roadmap repo and docs.logos.co, narrative advocate, adversary) attack the draft in parallel; a synthesizer revises under the author's voice profile; repeat. Two rounds run; round 1 yielded 20 substantive critiques, round 2 four minor ones, all resolved.

## Issues found and fixed

| # | Found by | Issue | Fix |
|---|----------|-------|-----|
| 1 | Research advocate, R1 | "No usable correlation" and "without exposing their identity or their stake" overclaimed Blend's guarantees; the docs describe probabilistic cost-raising, and the draft's own open questions contradicted the absolutes | Reframed: "Not impossible, expensive. Anyone selling you 'impossible' for a low-latency anonymity system is selling" |
| 2 | Research advocate, R1 | Blend's mechanism was described as onion-style relay routing down a path; `about-the-blend-network.md` describes dissemination/flooding with layered encryption, random delays, and cover traffic | Mechanism paragraph rewritten to match the documented design |
| 3 | Research advocate, R1 | "Deposits atomic with the Zone's inscription" maps to an *unchecked* checklist item in `blockchain_bridging.md` | Cut. Bridging section now claims only what ground truth supports: permissionless deposits, threshold-signed withdrawals (also honors the author's keep-bridging-minimal directive) |
| 4 | Adversary, R1 | "Most chains accept this as the cost of doing business. Logos didn't" erased prior art | Crypsinous lineage and Ethereum's Whisk added; novelty reframed as running the full answer end to end in a live network |
| 5 | Adversary, R1 | Conclusion sold proposer privacy as transaction privacy (scope creep) | Close now states it outright: "That's operator privacy, not transaction privacy" |
| 6 | Adversary, R1 | Sequencing section had no tradeoffs while the Blend section did (asymmetric candor) | Added from the project's own risk register: latency inheritance, throughput reduction, invalid channel messages; plus the untested-bottleneck admission |
| 7 | Research advocate, R1 | Maturity language exceeded release-note strength in several places | Pinned throughout: "completing a major part" of PPoS; design scope vs shipped-and-hardened distinguished |
| 8 | Adversary + research advocate, R2 | Lede falsifiable via Dandelion++/Tor (shipped network-layer protections exist); "rollups defer" needed a source | Lede rescoped to "nothing shipped protects the people keeping the chain alive"; L2Beat citation added for the sequencer tally; Whisk link verified |

## Critiques rejected (with reasons)

- Seeding the series frame in the lede (narrative advocate, R1): partially rejected; the ending was fixed to introduce the transaction-lifecycle frame as new information rather than pretending the reader had it all along.

## Known weaknesses (unresolved by design)

1. Bridging finality handling stays deliberately unexplained pending validation with eng.
2. Two open technical questions are carried in-text on purpose: fork-rate behavior under adversarial Blend latency, and threshold-withdrawal liveness when a Zone's sequencer set goes mostly offline.
3. The lede's "nothing shipped protects the operators" is the most exposed remaining claim if a shipped proposer-side counterexample surfaces.

*Ground truth consulted: `roadmap/content/testnets/v02.md`, `v02-release.md`, `blockchain/roadmap/blockchain_blend.md`, `blockchain_cryptarchia.md`, `blockchain_decentralized_sequencing.md`, `blockchain_bridging.md`; `docs/blockchain/concepts/*`; docs.logos.co URL index (llms.txt). External citations (Whisk, L2Beat) verified live.*
