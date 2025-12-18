# Source Citations for "The Anatomy of Exposure"

This document maps specific claims in the article to their sources. Claims are organized by article section.

---

## Stage 2: Transaction Construction in Wallet Software

| Claim | Source |
|-------|--------|
| MetaMask's default provider Infura explicitly collects IP addresses and Ethereum wallet addresses when users send transactions, with data retained for at least 7 days | ConsenSys privacy policy update, November 2022. Reported by The Block: https://www.theblock.co/post/189717/consensys-says-it-collects-ip-addresses-of-metamask-users-via-infura |
| Alchemy's analytics dashboard maps user IP addresses geographically | Alchemy application monitoring documentation: https://medium.com/alchemy-api/how-to-use-alchemys-application-monitoring-tools-266102feede5 |
| MetaMask uses `m/44'/60'/0'/0/{index}` derivation path; Ledger uses `m/44'/60'/{account}'/0/0` | MyEtherWallet HD Wallets explanation: https://medium.com/myetherwallet/hd-wallets-and-derivation-paths-explained-865a643c7bf2 |

---

## Stage 3: Transaction Signing

| Claim | Source |
|-------|--------|
| Hardware wallet cryptographic operations vulnerable to voltage glitching attacks | Ledger security research on Trezor Safe 3/5, March 2025: https://www.mitrade.com/insights/news/live-news/article-3-694391-20250313 |
| Gnosis Safe multisig wallets reveal all signer addresses publicly on-chain | Gnosis Safe architecture documentation: https://medium.com/@prezzel/gnosis-safe-da50291519a8 |
| MPC wallets - signatures appear identical to single-key transactions | Cube Exchange MPC explanation: https://www.cube.exchange/what-is/mpc-multi-party-computation |

---

## Stage 4: Network Submission

| Claim | Source |
|-------|--------|
| Infura's November 2022 privacy policy states they collect IP address and Ethereum wallet address | CryptoSlate coverage: https://cryptoslate.com/consensys-updates-policy-to-collect-metamask-ip-data/ and Decrypt: https://decrypt.co/115486/infura-collect-metamask-users-ip-ethereum-addresses-after-privacy-policy-update |
| 60% of Bitcoin connections cross just 3 ISPs | CoinDesk analysis of Ethereum network data exposure, 2018: https://www.coindesk.com/markets/2018/11/08/the-little-known-ways-ethereum-reveals-user-location-data |
| Flashbots Protect - approximately 2.1 million Ethereum accounts | Flashbots writings: https://writings.flashbots.net/2m-protect-users |
| Flashbots Protect transactions bypass public mempool, visible only to trusted builders | Flashbots Protect documentation: https://docs.flashbots.net/flashbots-protect/overview |
| MEV Blocker mixes real transactions with AI-generated fakes | MEV Blocker documentation: https://mevblocker.io/ and CoW Protocol docs: https://docs.cow.fi/mevblocker/concepts/order-flow-auction |

---

## Stage 5: Mempool Propagation

| Claim | Source |
|-------|--------|
| Biryukov et al. (2014) demonstrated Bitcoin network deanonymization for approximately €1,500 | Academic paper: Biryukov, A., Khovratovich, D., & Pustogarov, I. (2014). "Deanonymisation of Clients in Bitcoin P2P Network." ACM CCS 2014. |
| Princeton PERIMETER attack - 35%+ of Bitcoin clients deanonymized through passive BGP observation | Academic paper: Apostolaki, M., Zohar, A., & Vanbever, L. (2017). "Hijacking Bitcoin: Routing Attacks on Cryptocurrencies." IEEE S&P. Extended in subsequent work on AS-level adversaries. |
| Blocknative maintains 15+ TB archive of over 5 billion transactions with 27 data fields | Blocknative mempool archive documentation: https://www.blocknative.com/blog/blocknatives-historic-mempool-data |

---

## Stage 6: Block Building Centralization

| Claim | Source |
|-------|--------|
| Top 2 builders (Beaverbuild, rsync) control over 85% of Ethereum blocks | MEV-Boost relay data, ongoing monitoring via mevboost.pics and Flashbots transparency dashboards |
| MEV-Boost accounts for approximately 90% of all blocks | Flashbots MEV-Boost adoption statistics |
| Over $7.2 billion in MEV extracted since 2020 | Flashbots MEV-Explore and EigenPhi MEV tracking dashboards |
| MEV breakdown: arbitrage (35%), sandwich attacks (30%), liquidations (25%) | EigenPhi and Flashbots MEV categorization data |
| March 2025 incident: trader lost $215,000 to sandwich attack, validator earned ~$200,000 | Industry reporting on MEV incidents, Q1 2025 |
| 72,000 sandwich attacks targeted 35,000+ victims in 30-day period | EigenPhi sandwich attack tracking data |
| ~60% of block value from private order flows | Flashbots order flow analysis |
| Private transactions: ~12% of volume but 54%+ of block rewards | Blocknative and Flashbots private transaction analysis |
| Five providers influence 50%+ of winning auctions (MEV-Share, MEV Blocker, jaredfromsubway.eth, Banana Gun, Maestro) | Order flow auction market share analysis via MEV research |

---

## Stage 7: Post-Inclusion Surveillance Infrastructure

| Claim | Source |
|-------|--------|
| Etherscan's Google Analytics and Disqus integrations share user IP addresses with Facebook, Twitter, YouTube | Peter Szilagyi (Ethereum core developer) documentation, 2018: https://www.coindesk.com/markets/2018/11/08/the-little-known-ways-ethereum-reveals-user-location-data |
| Chainalysis: 25+ blockchains, 17 million assets, 220 million bridge transactions indexed | Chainalysis product documentation: https://www.chainalysis.com/law-enforcement/ |
| Chainalysis claims instrumental role in seizing $34 billion in illicit funds | Chainalysis marketing materials and law enforcement case studies |
| Chainalysis contracts with FBI, DEA, IRS, ICE across 60+ countries | Public contract records and Chainalysis customer documentation |
| Elliptic: 100 billion+ data points, 47+ blockchains, 99% market coverage by trading volume | Elliptic product documentation: https://www.elliptic.co/ and https://www.elliptic.co/industries/law-enforcement |
| Nansen: 500+ million labeled wallet addresses across 30+ networks | Nansen product documentation and MEXC analysis: https://blog.mexc.com/what-is-nansen/ |
| TRM Labs: 28+ blockchains, 74 million cross-chain swaps | TRM Labs product documentation |
| 17.9% of active EOA addresses clustered into ~340,000 entities | Academic paper: "Address clustering heuristics for Ethereum" - Financial Cryptography 2020: https://fc20.ifca.ai/preproceedings/31.pdf |
| Common Input Ownership Heuristic and address clustering techniques | Wiley research paper: https://ietresearch.onlinelibrary.wiley.com/doi/full/10.1049/blc2.12014 and Nansen explanation: https://www.nansen.ai/post/what-is-transaction-clustering-in-crypto-address-analysis |
| ABCTracer achieves 91.75% bidirectional tracing accuracy across 12 DeFi bridges | Academic research on cross-chain tracing |
| FATF Travel Rule enforced under EU MiCA since December 30, 2024 | EU MiCA regulation text and Crypto.com KYC documentation: https://crypto.com/en/university/what-is-kyc-in-crypto |
| Stealth addresses (ERC-5564) | QuickNode guide: https://www.quicknode.com/guides/ethereum-development/wallets/how-to-use-stealth-addresses-on-ethereum-eip-5564 |

---

## Stage 8: Frontend Infrastructure and Supply Chain Vulnerabilities

### Bybit/Safe Frontend Attack (February 2025)

| Claim | Source |
|-------|--------|
| $1.46 billion stolen - largest single hack in Web3 history | CoinDCX report: https://coindcx.com/blog/crypto-news-global/lessons-from-bybit-hack/ |
| Lazarus Group compromised Safe{Wallet} developer machine | The Block reporting: https://www.theblock.co/post/343530/lazarus-appears-to-compromise-safe-developer-machine-in-lead-up-to-1-5-billion-bybit-hack-report |
| Attack via AWS S3 bucket access, malicious JavaScript injection | IPFS blog analysis: https://blog.ipfs.tech/2025-could-ipfs-prevent-bybit-hack/ |
| Malicious code specifically targeted Bybit's cold wallet addresses | Bitcoin Ethereum News: https://bitcoinethereumnews.com/tech/bybit-1-4b-theft-originated-from-compromised-safe-ui/ |
| Forensic analysis by Sygnia Labs and Verichain | CoinDCX and The Block reporting |
| Safe rebuilt infrastructure, rotated all credentials post-incident | Decrypt coverage: https://decrypt.co/resources/what-is-gnosis-learn-article |
| Gnosis founder shared IPFS-hosted "Eternal Safe" fork after hack | IPFS blog: https://blog.ipfs.tech/2025-could-ipfs-prevent-bybit-hack/ |

### BadgerDAO Attack (December 2021)

| Claim | Source |
|-------|--------|
| $120 million stolen via Cloudflare API key compromise | The Block: https://www.theblockcrypto.com/post/126072/defi-protocol-badgerdao-exploited-for-120-million-in-front-end-attack and Decrypt: https://decrypt.co/87415/bitcoin-defi-project-badgerdao-hacked-120m |
| $54 million of stolen funds belonged to Celsius Network | CryptoNews: https://cryptonews.net/news/security/2875857/ |
| Malicious script injected via Cloudflare, intercepted transactions | CryptoNews and UseTheBitcoin analysis: https://usethebitcoin.com/the-decentralized-web-can-help-prevent-badgerdao-style-hacks/ |
| Front end approval attacks can drain wallets weeks/months later | Medium DAO analysis: https://medium.com/paradigm-research/daos-badgerdao-front-end-exploit-sushiswap-dao-restructuring-proposals-updates-on-fei-rari-1ba9087a1be4 |

### DNS Hijacking Attacks

| Claim | Source |
|-------|--------|
| Cream Finance & PancakeSwap DNS hijacking (March 2021) via GoDaddy | The Record: https://therecord.media/two-cryptocurrency-portals-are-experiencing-a-dns-hijack-at-the-same-time |
| Additional GoDaddy victims: Liquid.com, NiceHash.com, Bibox.com, Celsius.network, Wirex.app | The Record coverage of 2020-2021 incidents |
| DNS hijacking attack vectors (BGP hijacking, social engineering, registrar vulnerabilities) | arXiv paper on Web3 supply chain security: https://arxiv.org/pdf/2511.12274 |

### Ledger ConnectKit Supply Chain Attack (December 2023)

| Claim | Source |
|-------|--------|
| Former Ledger employee phished, NPM credentials stolen | TechCrunch: https://techcrunch.com/2023/12/14/supply-chain-attack-targeting-ledger-crypto-wallet-leaves-users-hacked/ and Ledger official report: https://www.ledger.com/blog/security-incident-report |
| Malicious versions 1.1.5, 1.1.6, 1.1.7 published | SlowMist analysis: https://slowmist.medium.com/supply-chain-attack-on-ledger-connect-kit-analyzing-the-impact-and-preventive-measures-520894aa1f20 |
| Over 100 frontends affected | Blockaid report: https://www.blockaid.io/blog/attack-report-ledger-connect-kit |
| $600,000+ stolen | The Hacker News: https://thehackernews.com/2023/12/crypto-hardware-wallet-ledgers-supply.html and Blockworks: https://blockworks.co/news/ledger-wallet-vulnerability-connectkit |
| Angel Drainer malware-as-a-service identified | Ledger security incident report: https://www.ledger.com/blog/security-incident-report |
| Affected platforms: Zapper, Sushi, Revoke.cash | Blockaid and SlowMist reporting |
| NPM lacked multi-authorization for publishing | Cycode analysis: https://cycode.com/blog/three-lessons-from-the-ledger-connect-kit-supply-chain-attack/ |
| 2FA bypassed via session token theft | Ledger CEO letter: https://www.ledger.com/blog/a-letter-from-ledger-chairman-ceo-pascal-gauthier-regarding-ledger-connect-kit-exploit |
| Malicious code live for ~5 hours, active draining window ~2 hours | Ledger security incident report |
| Tether froze attacker's USDT | Ledger security incident report |

### Radiant Capital Attack (October 2024)

| Claim | Source |
|-------|--------|
| $58M hack via compromised signer machines, Safe frontend displayed legitimate data while malicious transactions signed | BlockThreat newsletter: https://newsletter.blockthreat.io/p/blockthreat-week-42-2024 |

---

## Additional Context Sources

| Topic | Source |
|-------|--------|
| Ethereum privacy "HTTPS moment" - privacy as default infrastructure | WuBlock Substack analysis: https://wublock.substack.com/p/ethereum-privacys-https-moment-from |
| Alchemy private transactions overview | Alchemy documentation: https://www.alchemy.com/overviews/ethereum-private-transactions |
| Crypto compliance provider comparison | TyN Magazine: https://tynmagazine.com/crypto-compliance-providers-compared-2022/ |
| OpenZeppelin Gnosis Safe backdoor research | OpenZeppelin blog: https://blog.openzeppelin.com/backdooring-gnosis-safe-multisig-wallets |
| Gnosis Safe token approval risks | De.Fi blog: https://de.fi/blog/manage-revoke-gnosis-token-approvals |

---

## Academic Papers Referenced (not hyperlinked)

1. **Biryukov, A., Khovratovich, D., & Pustogarov, I. (2014)**. "Deanonymisation of Clients in Bitcoin P2P Network." ACM Conference on Computer and Communications Security (CCS).

2. **Apostolaki, M., Zohar, A., & Vanbever, L. (2017)**. "Hijacking Bitcoin: Routing Attacks on Cryptocurrencies." IEEE Symposium on Security and Privacy.

3. **Meiklejohn, S., et al. (2013)**. "A Fistful of Bitcoins: Characterizing Payments Among Men with No Names." IMC '13.

4. **Victor, F. (2020)**. "Address Clustering Heuristics for Ethereum." Financial Cryptography and Data Security (FC 2020).

5. **Biryukov, A., & Pustogarov, I. (2015)**. "Bitcoin over Tor isn't a good idea." IEEE Symposium on Security and Privacy.

---

## Notes on Data Currency

- MEV extraction totals, builder market share, and block statistics are continuously updated. Figures cited reflect data available through Q1 2025.
- Chain analytics company statistics (addresses labeled, blockchains covered) are from company marketing materials and may be promotional.
- Incident financial losses are estimates that may have been revised as investigations concluded.
