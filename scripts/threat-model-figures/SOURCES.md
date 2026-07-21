# Figure sources — transaction supply chain threat model

Every datapoint in the generated figures, with its source. Regenerate figures with `python3 make_figures.py` (matplotlib; outputs SVG to `content/attachments/`).

## tsc-private-rpc.svg

- 45% of DeFi order-flow volume via private RPCs, Nov 2023: Flashbots, [Illuminating Ethereum's Order Flow Landscape](https://writings.flashbots.net/illuminate-the-order-flow) (Jan 2024).
- ~80% of Ethereum DeFi interactions via private RPCs, 2025: [arXiv 2505.19708](https://arxiv.org/abs/2505.19708) (CoW DAO Research).

## tsc-ofac-relays.svg

- 79% peak, Nov 2022: widely reported (Labrys/mevwatch), see [mevwatch.info](https://www.mevwatch.info/).
- ~45% early 2023 after relay-mix shift: mevwatch.info historical reporting.
- ~30% in 2026: [mevwatch.info](https://www.mevwatch.info/) snapshot; refresh from the live dashboard before publication.

## tsc-builder-share.svg

- Titan >50%, BuilderNet 27-35% (midpoint 30% used): [rated.network builder explorer](https://explorer.rated.network/builders), as cited in [The Anatomy of Exposure](https://blog.logos.co/article/how-blockchain-transactions-leak-data). Snapshot figures; refresh before publication.

## tsc-extraction-ledger.svg

- Bybit \$1.5B (2025): [CNBC](https://www.cnbc.com/2025/02/21/hackers-steal-1point5-billion-from-exchange-bybit-biggest-crypto-heist.html).
- Wallet drainers \$494M (2024) and \$295M (2023): [Scam Sniffer annual reports](https://drops.scamsniffer.io/scam-sniffer-2024-web3-phishing-attacks-wallet-drainers-drain-494-million/).
- Sandwich MEV ~\$410M cumulative through mid-2024: EigenPhi via [Cointelegraph](https://cointelegraph.com/research/exclusive-data-from-eigenphi-reveals-that-sandwich-attacks-on-ethereum-have-waned); live dashboard at [eigenphi.io](https://eigenphi.io/mev/ethereum/sandwich).
- Address poisoning \$83.8M, Jul 2022 - Jun 2024, Ethereum+BSC: [arXiv 2501.16681](https://arxiv.org/abs/2501.16681) (USENIX Security '25).

## tsc-deanon-cost.svg

- 2014, ~EUR 1,500 active-infrastructure attack, up to 60% of Bitcoin clients: [Biryukov, Khovratovich & Pustogarov, CCS '14](https://arxiv.org/abs/1405.7418).
- 2020, address-reuse clustering at chain scale: [FC '20](https://fc20.ifca.ai/preproceedings/31.pdf).
- 2021, passive BGP-level deanonymization of >35% of clients: [PERIMETER, Princeton](https://collaborate.princeton.edu/en/publications/perimeter-a-network-layer-attack-on-the-anonymity-of-cryptocurren/).
- 2025, >90% cross-chain bridge tracing accuracy: [arXiv 2504.01822](https://arxiv.org/html/2504.01822v1).
- Y-axis is explicitly qualitative (cost/capability required); the figure claims ordering, not magnitude.

## Conceptual figures (hand-drawn SVG, in content/attachments/)

- `tsc-supply-chain-loop.svg` — the seven links as a cycle with the archive closing the loop.
- `tsc-adversary-matrix.svg` — adversary class x link exposure matrix. Cell values are the post's claims (each defended in its link section); the matrix exists to be disputed cell-by-cell.
