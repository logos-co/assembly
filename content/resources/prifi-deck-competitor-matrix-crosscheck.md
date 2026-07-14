---
title: "PriFi deck: competitor matrix cross-check"
tags:
  - resource
description: Fact-check of the 8x7 competitor lifecycle matrix in the IR pitch deck (v2, slide 9), July 2026
---

# Cross-check: "Competitors protect separate links" matrix (PriFi deck v2, slide 9)

Internal memo. Checked all 56 cells (8 competitors x 7 stages) against public sources as of 2026-07-14. Four parallel research passes (Zcash/Monero, Zano/Aztec, Aleo/DarkFi, Dusk/Canton), each judging cells against the rubric below and current shipped state, not roadmaps.

## Rubric used

The deck defines stages on slides 4 and 6. No per-cell justification exists in the deck or appendix, so verdicts use this reading:

| Stage | Leak being rated |
|---|---|
| Discovery | counterparties, intent: is there private counterparty/liquidity discovery, or Telegram/public frontends? |
| Diligence | address history, identity graph: can surveillance firms graph the chain? |
| Negotiation | size, terms, reservation price: pre-trade leakage to RPCs, quote infra, operators |
| Contracting | frontend and signing context: verifiable/local-first frontends, signing leaks |
| Ordering | pending order flow: mempool visibility, MEV, network-origin (IP) protection |
| Settlement | balances, approvals, positions: on-chain privacy, default vs opt-in |
| Enforcement | identifiable operators: can block producers be identified and coerced? |

Scale: ● closed = leak closed by default architecture. ◑ partial = partially mitigated or opt-in. ○ leaks = essentially unaddressed. "Default vs opt-in" and "shipped vs roadmap" applied strictly, because an adversarial investor will.

## Scoreboard

Of 56 cells: 36 hold up, 8 are too generous to the competitor, 7 are too harsh, 5 are judgment calls that need a footnote to survive diligence. No cell is flat-out fabricated. The problems are consistency problems: the same standard applied to one project and not its neighbor.

## The five findings that matter

**1. Aleo Diligence ● and Settlement ● don't survive contact with Messari.** Only ~9.6% of Aleo mainnet transactions were private in Q2 2025; ~90% are public transitions with visible inputs, balances in public mappings, full address histories indexed by Aleoscan. Fee amounts are always public and the fee payer is visible unless fees come from private records. Program IDs are visible on every transaction. Both cells should be ◑, or carry a "private-transaction subset only" footnote. This is the pair a diligence associate finds in ten minutes.

**2. Zcash Settlement ● contradicts the deck's own default-vs-opt-in standard.** Shielding is opt-in: ~30% of supply shielded, ~59% of transactions at the Feb 2026 ATH, most exchange rails still t-address. And an Orchard soundness bug in late May 2026 drained ~14% of shielded ZEC before the emergency NU6.2 hard fork. Recommend ◑ with a footnote that shielded-pool settlement itself is strong. Every ◑ we hand Zcash strengthens the Logos row anyway.

**3. Zano and Aztec are rated backwards relative to each other, twice.**
- Diligence: Zano hides sender, receiver, amount, and asset type by default (dv-CLSAG, confidential assets); there is nothing for Chainalysis to graph except the opt-in alias registry. Aztec has first-class public state, small alpha anonymity sets, and its own docs call L1 deposit/withdraw correlation trivial. The deck gives Zano ◑ and Aztec ●. If either is ●, it's Zano.
- Enforcement: Zarcanum stakers reveal neither identity nor balance nor which output staked the block; anonymous block production is Zano's headline feature (~68% of supply staked). Aztec sequencers stake 200k AZTEC from identifiable L1 addresses. The deck gives Zano ○ and Aztec ◑. Backwards. Zano ◑ (the PoW half and pre-HF6 node IPs are the residual leaks), Aztec stays ◑.

**4. Monero Ordering ● overclaims.** Dandelion++ is default and mempool contents are encrypted (no amounts/parties visible pre-confirmation, no MEV), but the mempool itself is public, Dandelion++ gives weak guarantees against targeted adversaries, 2026 research (ProxyMark, arXiv 2607.07062) deanonymizes transactions even from Tor hidden-service nodes, Tor/I2P are not defaults, and the Aug 2025 Qubic incident produced a 6-block reorg of pending flow. ◑. Same logic caps Zano Ordering at ◑ until its SOCKS5/Tor hard fork actually activates (~Aug 25-27, 2026; not live today).

**5. Canton's three ● cells hold only under a threat model the Enforcement ○ rating contradicts.** Canton's privacy is from other market participants. Your participant node operator (the common case is operator-hosted parties), the app provider (a stakeholder on most workflow contracts), and any regulator with a subpoena see everything. Canton Coin is deliberately public: every Super Validator sees every transfer. If the matrix's threat model includes coercible intermediaries, which Enforcement=○ implies, then Diligence/Negotiation/Settlement can't be ●. Keep the ●s only with an explicit footnote: "closed against other participants and public surveillance, not against your own operator." Sub-transaction correlation attacks (Halborn) are additional ammunition against "closed."

## Secondary consistency issues

- **Contracting, Zcash ○ vs Monero ◑.** Structurally identical situations: no smart contracts, local open-source wallets, no web-frontend signing. Rate them the same (◑ fits both).
- **Enforcement, Monero ○ vs Zcash ◑.** Monero: anonymous CPU mining (RandomX), P2Pool, but the Qubic 51% scare is real. Zcash: two identifiable pools at ~66% combined (ViaBTC ~37%, Foundry ~29%, and Foundry is a KYC'd US corporation). Hard to defend Monero rating worse on "can operators be identified and coerced." Either equalize or be ready with the Qubic reorg as the tiebreaker.
- **DarkFi cells apply testnet credit inconsistently.** DarkFi has no mainnet (alpha testnet v0.3-r1, reset June 2026, pre-audit). The deck gives ◑ credit for unshipped design in Diligence/Ordering/Settlement but ○ in Discovery and Enforcement where the same design (DarkIRC anonymous coordination, RandomX mining behind Tor) would earn ◑. Pick one rule, e.g. "design rating capped at ◑ until mainnet," and apply it to all seven cells. Also: rating a pre-mainnet project at all invites "is this even live?"; disclose status on the slide.
- **Aztec Discovery ◑.** Name one shipped private discovery mechanism on a 3-month-old alpha mainnet. By the deck's own shipped-vs-roadmap standard it's ○. Same strictness cuts the other way on Contracting: the PXE runs execution/proving locally, so ○ there deserves a footnote.
- **Dusk Negotiation ◑ is the weakest Dusk cell in our favor.** No shipped pre-trade privacy exists; NPEX is a KYC'd order book visible to its operator; Hedger is announced, not proven. Strict reading says ○. Downgrading it helps the Logos row, so this one is free.
- **Monero Negotiation ●.** Haveno negotiation over Tor supports it, but the dominant real flow is CEX/instant-swap where the operator sees terms. First question from anyone technical: "what fraction of XMR volume negotiates through Haveno?" ◑ is the defensible rating.
- **Monero Diligence ◑ is too harsh post-FCMP++.** Since the Jan 2026 hard fork the anonymity set is the full output set (>150M outputs). No analytics firm has demonstrated reliable tracing post-FCMP++. Rating Monero's identity-graph exposure equal to Zcash's (40%+ fully transparent activity) is the least defensible equivalence in the matrix. Lean ●.

## The flag nobody asked for

The Logos row is seven ● on a stack whose mainnet is slide 18's 2027 roadmap item, with testnet v0.1 live now. Every correction above tightens the shipped-vs-roadmap standard, and that standard applied to us puts most of our row at ◑ or footnoted. Options: (a) retitle the row "Logos (at mainnet)" or "by design, mainnet 2027," (b) rate Logos-as-shipped honestly and show the design targets as a second row, (c) keep it and accept that any investor who checks one competitor cell will apply the same knife to ours. I'd take (a); the deck already says testnet v0.1 elsewhere, so the claim is survivable if labeled.

## Suggested corrected matrix

Applying the verdicts above, one standard everywhere:

| Solution | Disc | Dil | Neg | Cont | Ord | Set | Enf |
|---|---|---|---|---|---|---|---|
| Logos (by design, mainnet 2027) | ● | ● | ● | ● | ● | ● | ● |
| Zcash | ○ | ◑ | ○ | ◑ | ○ | ◑ | ◑ |
| Monero | ◑ | ● | ◑ | ◑ | ◑ | ● | ○ |
| Zano | ◑ | ● | ◑ | ◑ | ◑ (● post-HF6) | ● | ◑ |
| Aztec | ○ | ◑ | ◑ | ○ | ◑ | ● | ◑ |
| Aleo | ◑ | ◑ | ◑ | ○ | ○ | ◑ | ◑ |
| DarkFi (testnet) | ◑ | ◑ | ◑ | ◑ | ◑ | ◑ | ◑ |
| Dusk | ○ | ◑ | ○ | ○ | ◑ | ◑ | ◑ |
| Canton | ◑ | ●¹ | ●¹ | ◑ | ◑ | ●¹ | ○ |

¹ Closed against other participants and public surveillance; participant operators, app providers, and regulators retain full visibility.

Net effect: Zcash, Aleo, and Dusk get slightly worse; Monero, Zano, and DarkFi get slightly better; Aztec roughly nets out; Canton keeps its ●s with an asterisk. The "only full-stack architecture" headline survives every change. Nobody else covers Discovery through Enforcement, corrected or not.

## Cell-by-cell verdicts

Verdicts: AGREE / GEN (too generous, should be worse) / HARSH (too harsh, should be better) / JC (judgment call, footnote required).

### Zcash

| Stage | Claimed | Verdict | Evidence |
|---|---|---|---|
| Discovery | ○ | AGREE | No private discovery layer. Zashi/NEAR Intents swaps ($1.5B cumulative ZEC volume by Mar 2026) are liquidity access, not private discovery; solvers see intent and size. |
| Diligence | ◑ | AGREE | Transparent pool fully graphable (Chainalysis/Elliptic support ZEC); shielded share 59.3% of txs (Feb 2026 ATH), ~30% of supply. Opt-in privacy = ◑. |
| Negotiation | ○ | AGREE | NEAR Intents solvers see size/pair pre-execution; lightwalletd sees wallet queries; Zashi Tor (2.1, beta) protects IP, not terms. |
| Contracting | ○ | HARSH | No smart contracts; signing is local open-source wallets (Zashi, Ywallet). Same situation as Monero's ◑. Make both ◑. |
| Ordering | ○ | AGREE (borderline) | No Dandelion++, no default Tor; transparent txs fully visible in mempool. Counterpoint: shielded txs reveal nothing even in mempool and MEV is negligible, so ◑ is arguable. |
| Settlement | ● | GEN | Opt-in shielding, ~70% of supply transparent, May 2026 Orchard soundness bug + emergency NU6.2 fork. ◑ with a "shielded pool itself is ●" footnote. |
| Enforcement | ◑ | AGREE | Permissionless PoW, but ViaBTC ~37% + Foundry ~29% (KYC'd US pool) = ~66% identifiable. ◑ holds; the asymmetry with Monero doesn't. |

### Monero

| Stage | Claimed | Verdict | Evidence |
|---|---|---|---|
| Discovery | ◑ | AGREE | Haveno/RetoSwap: P2P orderbooks over Tor with multisig escrow, live and mature, but low-liquidity and niche; most volume is CEX after LocalMonero shut (2024). Serai unlaunched. |
| Diligence | ◑ | HARSH | Post-FCMP++ (Jan 2026 fork): anonymity set = full output set (>150M), stealth addresses, no demonstrated tracing at scale. Residuals: EAE endpoint attacks, pre-2026 history. Lean ●. |
| Negotiation | ● | GEN | Haveno negotiation is Tor + encrypted; but dominant flow is CEX/instant-swap where operators see all terms. ● describes the best case, not the default. ◑. |
| Contracting | ◑ | AGREE | Local open-source wallets, Haveno 2-of-3 escrow. Must match Zcash's cell. |
| Ordering | ● | GEN | Default Dandelion++, encrypted mempool contents, no MEV: real. But public mempool timing/fees, weak Dandelion++ guarantees, ProxyMark deanonymization (arXiv 2607.07062), Tor not default, Qubic 6-block reorg. ◑. |
| Settlement | ● | AGREE | Mandatory privacy; FCMP++ full-chain anonymity set, ~2.71 KB proofs. Caveat: pre-FCMP++ history keeps ring-16. |
| Enforcement | ○ | AGREE (flag) | Qubic claimed >51% (Aug 2025), 6-block reorg, Kraken paused deposits. But RandomX/P2Pool = anonymous mining, and Zcash's identifiable ~66% rates ◑. Defend the asymmetry or equalize. |

### Zano

| Stage | Claimed | Verdict | Evidence |
|---|---|---|---|
| Discovery | ◑ | AGREE | Zano Trade P2P marketplace + zDEX (Ionic Swaps) exist; hosted web frontend, order interest visible. |
| Diligence | ◑ | HARSH | Sender, receiver, amount, asset type hidden by default; nothing to graph except opt-in alias registry. ● with alias footnote. |
| Negotiation | ◑ | AGREE | zDEX order matching is on-chain (pre-trade price/size signals); P2P escrow terms via hosted platform. |
| Contracting | ◑ | AGREE | Local open-source desktop wallet + on-chain escrow; hosted trading frontend and remote-node Lite Wallet (May 2026) keep it ◑. |
| Ordering | ● | GEN | Mempool contents private (hidden amounts, ring sigs, no MEV), but no IP protection until HF6 SOCKS5/Tor activates ~Aug 25-27, 2026. ◑ today, ● after HF6 ships. |
| Settlement | ● | AGREE | Default-on dv-CLSAG, hidden amounts, stealth addressing, confidential assets with asset-type obfuscation. Shipped since Zarcanum HF (Mar 2024). |
| Enforcement | ○ | HARSH | Zarcanum PoS: stakers reveal neither identity, balance, nor staking output; ~68% of supply staked. Residuals: ProgPowZ PoW pools, pre-HF6 node IPs. ◑. |

### Aztec

| Stage | Claimed | Verdict | Evidence |
|---|---|---|---|
| Discovery | ◑ | GEN | Alpha mainnet is 3 months old (Apr 1, 2026); no shipped private discovery mechanism; coordination via ordinary frontends/Discord. Architecture enables it; rubric says shipped. ○. |
| Diligence | ● | JC (lean GEN) | Private state by default, but public state is first-class and analyzable, alpha anonymity sets small, and Aztec's own material calls L1 deposit/quick-withdraw correlation trivial. ◑ safer. |
| Negotiation | ◑ | AGREE | Client-side execution keeps calls private pre-broadcast; standard RPC/frontends for quotes; Aztec docs list leaks via public args, msg_sender, fee payment, tx shape. |
| Contracting | ○ | AGREE (caveat) | Conventional hosted frontends leak signing context. Counterpoint worth a footnote: PXE runs execution/proving/secrets locally. |
| Ordering | ◑ | AGREE | Private functions reach the sequencer as ZK proofs (contents unreadable, kills classic MEV); public calls visible to sequencer; timing/fee/IP metadata leaks; no network-layer anonymization. |
| Settlement | ● | JC | Private-by-default for private-state tokens, client-side proving. Challenges: public state coexists per-app, fee payer identifiable without opt-in private FPC, unpatched critical vuln awaiting v5 (due July 2026), legacy Aztec Connect exploited for $2.19M (June 2026). Keep ● only with footnotes. |
| Enforcement | ◑ | AGREE | Permissionless sequencing, 3,400+ sequencers / 185+ operators, but staked from identifiable L1 addresses; enumerable and coercible. |

### Aleo

| Stage | Claimed | Verdict | Evidence |
|---|---|---|---|
| Discovery | ◑ | AGREE | Arcane Finance RFQ DEX (encrypted-record swaps) exists; discovery still via public frontends/listings. |
| Diligence | ● | GEN | ~90% of txs public (Messari Q2 2025: 9.6% private); public mappings expose balances/histories; even private txs reveal program ID and serial numbers. ◑. |
| Negotiation | ◑ | AGREE | RPC providers see queries; Arcane RFQ discloses parameters to quoting market makers pre-execution. |
| Contracting | ○ | AGREE | Standard web frontends + browser extensions (Leo, Puzzle); no local-first story. |
| Ordering | ○ | JC (lean HARSH) | Private txs in mempool = serial numbers + commitments + proof, unreadable by validators. But ~90% of flow is public, no IP protection, 25-33 identifiable validators see pending flow. Internal consistency: if Settlement gets record-architecture credit, Ordering can't get zero. |
| Settlement | ● | GEN | Opt-in in practice (~90% public), fee amounts always public, fee payer visible unless paid from private records, program IDs visible. ◑. |
| Enforcement | ◑ | AGREE (caveat) | 25-33 validators, 10M ALEO stake floor, onboarding via application form, ARC-101 conduct rules: small, identifiable, curated. ◑ holds only because expansion (target 40) is real; hostile reading is ○. |

### DarkFi

All cells rate testnet software: no mainnet, alpha testnet v0.3-r1 (reset June 2026), pre-audit. Disclose on the slide.

| Stage | Claimed | Verdict | Evidence |
|---|---|---|---|
| Discovery | ○ | JC (lean HARSH) | DarkIRC (anonymous P2P chat over Tor) is the designed OTC coordination channel: a native private coordination primitive, better than Telegram. No liquidity/discovery mechanism though, and nothing on mainnet. ◑ if testnet credit is given anywhere. |
| Diligence | ◑ | AGREE | Design is anonymous-by-default (Sapling-style money contract, nothing to graph). ◑ = design says ●, testnet status caps it. Say that on the slide or it looks arbitrary. |
| Negotiation | ◑ | AGREE | OTC terms negotiated over DarkIRC / out-of-band (`drk otc init/join/sign`); public IRC channels leak terms unless DMs/secret channels used. |
| Contracting | ◑ | AGREE (lean HARSH) | Entirely local-first CLI, swap halves signed locally, no web frontend at all: rubric-wise near ●. Unaudited alpha justifies ◑. |
| Ordering | ◑ | AGREE | Tx contents anonymous even in mempool; RandomX PoW, Tor/I2P transports supported but opt-in; testnet hashrate trivial. |
| Settlement | ◑ | AGREE | Anonymous transfers/swaps/DAO default-on in design; nothing settles on mainnet. Footnote: "anonymous-by-default design, testnet-only status." |
| Enforcement | ○ | HARSH | RandomX CPU mining via xmrig, minable behind Tor: anonymous block production is the design goal. ○ only works on unshipped grounds, which contradicts the ◑s above. ◑ with the same testnet cap. |

### Dusk

| Stage | Claimed | Verdict | Evidence |
|---|---|---|---|
| Discovery | ○ | AGREE | No private discovery layer; flagship venue is Dusk Trade/NPEX, a KYC'd licensed MTF order book (rolling out 2026): identified discovery. |
| Diligence | ◑ | AGREE | Phoenix (shielded) breaks graph analysis for shielded funds; Moonlight is fully transparent, staking public, DuskEVM transparent. Citadel (ZK-KYC) still repo-stage. |
| Negotiation | ◑ | GEN | No shipped pre-trade privacy; NPEX order book visible to operator; Hedger announced, unproven. Strict reading: ○. Downgrading helps our row. |
| Contracting | ○ | AGREE | Conventional hosted web apps; DuskEVM contract interaction public. Rusk CLI wallet exists but isn't the default path. |
| Ordering | ◑ | AGREE | Phoenix mempool txs hide amounts/parties (blunts MEV); Kadcast has no origin anonymity; DuskEVM is OP Stack with a single operator-run sequencer. |
| Settlement | ◑ | AGREE (borderline HARSH) | Phoenix is shielded by architecture but is one of two co-equal models; Moonlight public, staking transparent, growth strategy runs through transparent DuskEVM with opt-in Hedger. "Choose your model" = ◑. |
| Enforcement | ◑ | AGREE (risk GEN) | Permissionless staking, but the anonymous blind-bid design was abandoned; Succinct Attestation sortition uses visible consensus keys and the DuskEVM sequencer is one company. Defense is permissionlessness, not anonymity. |

### Canton

| Stage | Claimed | Verdict | Evidence |
|---|---|---|---|
| Discovery | ◑ | AGREE | Deal discovery inside permissioned Daml apps: hidden from the public, visible to app provider and participant operators, gated by institutional identity. |
| Diligence | ● | AGREE (flag) | No global ledger; each participant stores only its projection; Chainalysis-style analysis architecturally impossible. But KYC'd identity is the network's premise, and Canton Coin activity is visible to all Super Validators + Scan. Needs the threat-model footnote. |
| Negotiation | ● | JC (lean AGREE) | Quotes/proposals are Daml contracts visible only to stakeholders; no public RFQ leakage. But the app provider is typically a stakeholder on every negotiation contract and hosted users' operators see terms. ● vs the market, ◑ vs intermediaries. |
| Contracting | ◑ | AGREE | Contracts visible only to signatories/observers; participant operators see everything for hosted parties, and hosted is the common case. |
| Ordering | ◑ | AGREE | Global Synchronizer sees encrypted envelopes only (no contents, no public mempool, no classic MEV) but, per Canton's own docs, learns "transaction status and the parties involved" plus timing/size: a traffic-analysis surface in one permissioned operator set. |
| Settlement | ● | AGREE (asterisk) | Sub-transaction privacy is default and shipped ($100B+/day repo; DvP: bank sees cash leg, registrar sees securities leg). Asterisk: private from other participants, not from your operator/app provider/regulators; Canton Coin is deliberately public. Halborn documents sub-transaction correlation attacks. |
| Enforcement | ○ | AGREE | ~13 invitation-only, publicly listed Super Validators (DTCC, Circle, ...) approved by the Canton Foundation. Fully identified, legally domiciled, coercible. Clearest cell in the matrix. |

## Methodology

Rubric inferred from slides 4 and 6 (the deck ships no per-cell justification). Four independent research passes with live web search, July 2026. Verdicts penalize opt-in privacy and unshipped roadmap items symmetrically, including for us. Cells marked JC genuinely turn on threat-model choices the deck doesn't state; they need footnotes, not different dots. Holler if you think a verdict is wrong, several are close calls and I'd rather lose the argument here than in a partner meeting.

## Sources

Zcash: [NEAR Intents/Zashi volume](https://www.coindesk.com/markets/2025/10/09/near-intents-activity-spikes-as-zcash-s-zashi-wallet-taps-it-for-private-swaps) · [shielded supply ~30%](https://crypto.news/why-30-of-zcash-supply-is-now-in-the-shielded-pool/) · [shielded pool growth](https://www.theblock.co/post/378232/zcash-shielded-pool-climbs-23-supply-network-usage-surges) · [Zashi 2.1 Tor beta](https://forum.zcashcommunity.com/t/zashi-2-1-enhanced-privacy-with-tor-beta/51865) · [Q2 2026 report incl. Orchard bug](https://pineanalytics.substack.com/p/zcash-quarterly-report-q2-2026) · [Foundry pool launch](https://www.coindesk.com/business/2026/03/10/mining-giant-foundry-to-introduce-institutional-zcash-mining-pool) · [Foundry 29% hashrate](https://finance.yahoo.com/markets/crypto/articles/foundry-captures-29-zcash-hashrate-140239028.html) · [ViaBTC 51% episode](https://blockworks.com/news/zcash-privacy-coin-mining-pool-51-percent-hashing-power)

Monero: [FCMP++ overview](https://coincraddle.com/monero-fcmp-plus) · [FCMP++ HF milestone](https://github.com/monero-project/monero/milestone/1) · [Haveno](https://haveno.exchange/) · [ProxyMark deanonymization](https://arxiv.org/abs/2607.07062v1) · [Tor hidden-service deanonymization (ACM)](https://dl.acm.org/doi/10.1145/3589335.3651487) · [Qubic 51% claim](https://www.coindesk.com/business/2025/08/12/qubic-claims-majority-control-of-monero-hashrate-raising-51-attack-fears) · [Halborn on the Qubic attack](https://www.halborn.com/blog/post/explained-the-monero-51-percent-attack-august-2025) · [dissent on 51% proof](https://riat.at/qubic-attack-on-xmr-monero-no-51-attack-proven/)

Zano: [features](https://zano.org/features) · [HF6 countdown (Tor/SOCKS5)](https://blog.zano.org/the-countdown-to-hard-fork-6-has-begun/) · [Zarcanum paper](https://eprint.iacr.org/2021/1478) · [ZPoS](https://blog.zano.org/zarcanum-a-private-proof-of-stake-scheme-with-confidential-transactions-and-hidden-amounts/) · [aliases](https://docs.zano.org/docs/use/aliases/) · [Ionic Swaps](https://docs.zano.org/docs/build/confidential-assets/ionic-swaps/) · [Zano Trade](https://trade.zano.org/dex) · [Lite Wallet](https://news.bitcoin.com/zano-ships-desktop-lite-wallet-beta-connecting-users-to-remote-nodes-instantly/)

Aztec: [Road to Mainnet](https://aztec.network/blog/road-to-mainnet) · [alpha mainnet launch](https://www.kucoin.com/news/flash/aztec-network-launches-alpha-mainnet-first-ethereum-l2-with-full-privacy-smart-contracts) · [private/public state](https://aztec.network/blog/the-best-of-both-worlds-how-aztec-blends-private-and-public-state) · [anonymity-set caveats](https://aztec.network/blog/infinite-privacy-new-anonymity-paradigms-with-aztec-network) · [fees & leakage](https://docs.aztec.network/developers/docs/concepts/fees) · [transactions/PXE](https://docs.aztec.network/developers/docs/foundational-topics/transactions) · [sequencer decentralization (L2BEAT)](https://medium.com/l2beat/decentralised-sequencing-4441edf5852a) · [Aztec Connect incident](https://aztec-labs.com/blog/aztec-connect-incident.html)

Aleo: [Messari Q2 2025 (9.6% private)](https://messari.io/report/state-of-aleo-q2-2025) · [public vs private state](https://developer.aleo.org/concepts/fundamentals/public_private/) · [fees always public](https://github.com/AleoNet/welcome/blob/master/documentation/concepts/fundamentals/03A_transaction_fees.md) · [staking/10M floor](https://developer.aleo.org/concepts/network/staking/) · [validator expansion](https://aleo.org/post/new-aleo-validators/) · [ARC-101](https://aleo.org/post/arc-101-aleo-validators/) · [Arcane RFQ DEX](https://dorahacks.io/buidl/7114) · [Equilibrium deep dive](https://equilibrium.co/writing/privacy-blockchains-and-aleo-deep-dive)

DarkFi: [insights index (testnet v0.3-r1)](https://dark.fi/insights/) · [atomic swap guide](https://darkrenaissance.github.io/darkfi/testnet/atomic-swap.html) · [Tor node guide (opt-in)](https://dark.fi/book/misc/nodes/tor-guide.html) · [repo](https://github.com/darkrenaissance/darkfi)

Dusk: [DuskDS tx models](https://docs.dusk.network/learn/deep-dive/duskds-tx-models/) · [multilayer evolution](https://dusk.network/news/multilayer-evolution/) · [Hedger](https://dusk.network/news/hedger-confidential-duskevm) · [DuskEVM](https://docs.dusk.network/learn/deep-dive/dusk-evm/) · [Succinct Attestation](https://docs.dusk.network/learn/deep-dive/succinct-attestation/) · [Citadel repo](https://github.com/dusk-network/citadel) · [NPEX partnership](https://dusk.network/news/dusk-and-npex-partnership/)

Canton: [institutional privacy](https://www.canton.network/blog/how-canton-network-delivers-institutional-grade-privacy) · [Global Synchronizer](https://www.canton.network/global-synchronizer) · [Halborn on Canton privacy](https://www.halborn.com/blog/post/need-to-know-privacy-how-canton-solves-the-confidentiality-integrity-trade-off) · [external parties](https://docs.digitalasset.com/overview/3.4/explanations/canton/external-party.html) · [Canton Coin whitepaper](https://www.digitalasset.com/hubfs/Canton%20Network%20Files/Documents%20(whitepapers,%20etc...)/Canton%20Coin_%20A%20Canton-Network-native%20payment%20application.pdf) · [Super Validators (Scan)](https://www.cantonscan.com/supervalidators) · [Messari Canton overview](https://messari.io/report/understanding-canton-network-a-comprehensive-overview)
