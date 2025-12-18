---
title: "The Anatomy of Exposure: How Blockchain Transactions Leak Information at Every Layer"
tags:
  - artifact
---
![[blockchain_privacy_leaks_meta|Who is this for and why?]]

> [!NOTE] This was written with the help of Claude Opus 4.5 Research. While it has been read and reviewed for reasonability, the claims have not been verified. 

**Every blockchain transaction leaks information to dozens of parties before, during, and after it appears on-chain—and most privacy tools address only a fraction of these exposures.** While users focus on application-layer privacy solutions like mixers and zero-knowledge proofs, the more pervasive privacy erosion happens at infrastructure and network layers that remain largely unaddressed. This creates a fundamental "privacy stack gap" where sophisticated on-chain privacy can be completely undermined by simple IP correlation, RPC provider logging, compromised frontends, or timing analysis at lower layers of the system.

The complete transaction lifecycle involves at least nine distinct stages, each exposing specific metadata to different parties: communication platforms, wallet software, RPC providers, ISPs, mempool observers, MEV searchers, block builders, validators, chain analytics firms, frontend infrastructure providers, and state actors. **Understanding this full exposure surface is essential** before relying on any single privacy solution.

---

## Stage 1: Pre-Transaction Coordination

Privacy leakage begins before any blockchain interaction occurs. When parties coordinate what a transaction should be—negotiating OTC trades, discussing multisig operations, or agreeing on payment terms—they create metadata trails that link real-world identities to eventual on-chain addresses.

**Communication channel metadata exposure:**

| Channel | Data Exposed | Who Learns It |
|---------|--------------|---------------|
| Signal | Phone numbers, timestamps, IP addresses (without VPN) | Signal servers (limited), ISPs |
| Telegram | Phone numbers, usernames, IP addresses, group memberships | Telegram servers, ISPs |
| Discord | Email, IP addresses, server memberships, activity patterns | Discord, server admins |
| Email | IP addresses (in headers), timestamps, subject lines | Email providers, ISPs |

The critical privacy failure occurs when wallet addresses shared during coordination become correlated with identifying information. Payment invoices containing both addresses and legal names, timing correlation between off-chain discussions and on-chain activity, and shared documents in OTC agreements all create permanent links between pseudonymous addresses and real identities.

**Operational security failures** compound these risks. Man-in-the-middle attacks on unencrypted channels, insider threats at trading desks, and social engineering targeting traders can expose entire transaction histories. Once coordination metadata links an address to an identity, that association propagates through all subsequent chain analysis.

---

## Stage 2: Transaction Construction in Wallet Software

Transaction construction reveals surprisingly detailed information to third parties—particularly RPC providers—before any transaction enters the network.

When a wallet constructs an Ethereum transaction, it typically makes several RPC calls: `eth_getTransactionCount` (revealing sender address and activity level), `eth_estimateGas` (revealing full transaction parameters including recipient, value, and calldata), `eth_gasPrice` (revealing timing of transaction preparation), and `eth_call` (simulating contract interactions). **Each call exposes transaction intent to the RPC provider before the user decides to submit.**

MetaMask's default provider Infura explicitly collects IP addresses and Ethereum wallet addresses when users send transactions, with data retained for at least 7 days. Alchemy's analytics dashboard maps user IP addresses geographically. This means centralized RPC providers can:

- Correlate wallet addresses with physical locations
- Observe behavioral patterns across time
- Map social graphs through transaction relationships
- Estimate wealth through balance queries
- Predict trading intentions from pre-trade queries

**ENS lookups create additional exposure.** Resolving `alice.eth` before sending funds reveals the intended recipient to the RPC provider. Reverse lookups querying addresses expose investigation patterns. ENS registration itself links identity to addresses unless funded through privacy-preserving means.

**Address derivation patterns** fingerprint wallet software. MetaMask uses `m/44'/60'/0'/0/{index}` while Ledger uses `m/44'/60'/{account}'/0/0`. These patterns, combined with gas estimation behaviors and nonce gaps, can identify which software constructed a transaction.

---

## Stage 3: Transaction Signing

Transaction signing is the most privacy-preserving stage—private keys correctly remain isolated—but the surrounding processes still leak information.

Software wallet signing exposes transactions to the potentially compromised browser or mobile environment. Hardware wallets (Ledger, Trezor) keep keys in secure elements, but their companion applications still make RPC calls that expose addresses. Research has revealed that while seeds are protected by secure elements, cryptographic operations on older models remain vulnerable to physical voltage glitching attacks with relatively inexpensive equipment.

**Multi-signature coordination introduces substantial exposure.** Gnosis Safe (now Safe) multisig wallets reveal all signer addresses publicly on-chain—the entire ownership structure is visible to anyone. Off-chain signature collection through Safe Transaction Service means that service sees all pending transactions, who signed in what order, and approval/rejection patterns.

MPC (Multi-Party Computation) wallets offer better on-chain privacy—their signatures appear identical to single-key transactions—but the MPC coordinator service sees all transaction requests and which key-share holders participated. The privacy advantage shifts from on-chain to off-chain infrastructure trust.

---

## Stage 4: Network Submission

The moment a transaction leaves a user's device for the network represents **peak information leakage**. This is where IP addresses become permanently correlated with blockchain pseudonyms.

Major RPC providers explicitly document their data collection. Infura's November 2022 privacy policy update states they collect IP address and Ethereum wallet address when you send a transaction. This single data point—IP-to-address linkage—undermines most application-layer privacy solutions. Zero-knowledge proofs hide transaction content but not the IP address submitting the proof.

**Timing correlation attacks** work even on encrypted traffic. Research has demonstrated that passive adversaries at network border routers can correlate TCP packet timestamps with blockchain transaction confirmation times, linking IP addresses to blockchain pseudonyms using only metadata. The attack requires no decryption—just TCP quadruples (source IP, destination IP, ports) and timestamps.

ISPs observe:

- When users connect to RPC endpoints
- Traffic volume correlating with transaction sizes
- Timing patterns revealing trading sessions
- Connection frequency indicating activity levels

Research shows **60% of Bitcoin connections cross just 3 ISPs**, creating concentrated surveillance opportunities.

**Private mempool services** shift trust rather than eliminate it. Services like Flashbots Protect mean transactions bypass public mempool, visible only to trusted builders. This protects against MEV but the service operator learns full transaction details and IP (unless using Tor/VPN). MEV Blocker and similar services face the same fundamental tradeoff—they centralize visibility into user transaction flow with a single operator.

**Running your own node** eliminates RPC provider logging but still exposes IP to the P2P network. Transactions enter the public mempool visible to all nodes. True network-layer privacy requires combining own-node operation with Tor/I2P for transaction broadcast—a configuration almost no users implement.

---

## Stage 5: Mempool Propagation

Once transactions enter the peer-to-peer network, gossip protocol mechanics leak origin information through timing analysis.

Ethereum's execution layer uses DevP2P over TCP, propagating transactions via `NewPooledTransactionHashes` messages. Bitcoin uses diffusion broadcasting with random exponential delays. In both cases, **first-spy attacks** allow well-connected observers to identify transaction origins with significant accuracy.

Academic research quantifies this threat. Biryukov et al. (2014) demonstrated Bitcoin network deanonymization for approximately €1,500 by deploying supernodes that observed which peers first relayed transactions. Princeton's PERIMETER attack (2021) showed that AS-level adversaries can deanonymize **35%+ of Bitcoin clients** through completely passive BGP-level observation—no new connections required.

**Mempool observation infrastructure is extensive.** Blocknative maintains a 15+ TB archive of over 5 billion transactions with 27 data fields per transaction including regional timestamps. This powers real-time mempool streaming APIs that MEV searchers use to identify profitable opportunities.

MEV searchers learn detailed information about user behavior:

- Trading patterns and preferences
- Typical slippage tolerances
- Wallet addresses and connected identities
- DeFi protocol interactions
- Token holdings decoded from calldata

They operate infrastructure specifically designed to extract maximum information from pending transactions—multiple full nodes with modified clients, low-latency connections to block builders, and custom algorithms processing transactions in real-time.

**Network-layer privacy remains fundamentally underdeveloped.** Dandelion++ provides formal anonymity guarantees by routing transactions through a linear "stem" path before standard diffusion, but it's not yet implemented in Bitcoin Core (BIP-156 still under consideration) and absent from Ethereum entirely. Tor integration hides IP but faces Bitcoin-specific deanonymization attacks, and Tor usage itself is detectable, potentially drawing attention. I2P offers stronger resistance but has a smaller anonymity set and faces integration challenges.

---

## Stage 6: Block Building Centralization

Post-merge Ethereum's Proposer-Builder Separation (PBS) architecture has created unprecedented centralization in block construction—and with it, concentrated information exposure.

The numbers are stark: **top 2 builders (Beaverbuild, rsync) control over 85% of Ethereum blocks**. MEV-Boost accounts for approximately 90% of all blocks. This means a handful of entities see virtually all transaction ordering before inclusion.

**The PBS information exposure model:**

| Party | What They See |
|-------|---------------|
| **Block Builders** | Full transaction contents, MEV opportunities, user trading strategies |
| **Relays** | All submitted blocks, bid amounts, builder identities, patterns |
| **Proposers (Validators)** | Only block header + payment (blinded to transaction contents) |

Builders profit from this visibility. **Over \$7.2 billion in MEV has been extracted since 2020** —arbitrage (35%), sandwich attacks (30%), and liquidations (25%). The March 2025 incident where a trader lost \$215,000 to a sandwich attack while the validator earned approximately \$200,000 illustrates the scale. Over 72,000 sandwich attacks targeted 35,000+ victims in a recent 30-day period.

**Private order flow dominance** reinforces centralization. Approximately 60% of block value comes from private order flows. Private transactions constitute only around 12% of transaction volume but **over 54% of block rewards**. Five providers (MEV-Share, MEV Blocker, jaredfromsubway.eth, Banana Gun, Maestro) influence more than 50% of winning auctions.

Relay operators—"doubly-trusted" intermediaries with no cryptographic guarantees on data handling—see all submitted blocks from all builders. Their position enables comprehensive tracking of MEV activity and builder behavior patterns.

---

## Stage 7: Post-Inclusion Surveillance Infrastructure

After block inclusion, a sophisticated surveillance apparatus extracts, analyzes, and monetizes transaction data.

**Block explorers** create IP-to-address links when users view their own addresses. Ethereum core developer Peter Szilagyi documented in 2018 that Etherscan's Google Analytics and Disqus integrations share user IP addresses with Facebook, Twitter, YouTube, and numerous other services whenever users check addresses—creating permanent off-chain identity correlations.

**Chain analytics companies** have built comprehensive surveillance infrastructure:

- **Chainalysis**: 25+ blockchains, 17 million assets, 220 million bridge transactions indexed. Claims instrumental role in seizing $34 billion in illicit funds. Contracts with FBI, DEA, IRS, ICE across 60+ countries.
- **Elliptic**: 100 billion+ data points, 47+ blockchains, 99% market coverage by trading volume. JP Morgan strategic investment.
- **Nansen**: **500+ million labeled wallet addresses** across 30+ networks. Smart Money tracking identifies profitable traders and whale investors.
- **TRM Labs**: 28+ blockchains, 74 million cross-chain swaps. Proprietary ML-based pattern detection.

**Graph analysis techniques** power deanonymization. The Common Input Ownership Heuristic clusters addresses that appear as inputs to the same transaction. Change Address Detection identifies return addresses through amount patterns and transaction structure. Ethereum-specific heuristics using deposit address reuse have clustered **17.9% of active EOA addresses** into approximately 340,000 entities.

Cross-chain tracking has eliminated bridge-based obfuscation as a privacy strategy. Elliptic's Holistic Screening treats multiple blockchains as a unified, queryable graph, automatically tracing through bridges, DEXs, and asset swaps. Academic tools like ABCTracer achieve **91.75% bidirectional tracing accuracy** across 12 DeFi bridges.

**Behavioral fingerprinting** identifies users without explicit address labels. Transaction timing reveals geographic location. Gas price patterns create wallet signatures. DeFi interaction sequences—lending, staking, farming—form unique behavioral profiles. Temporal features provide the most discriminating information for entity classification.

Exchange KYC data serves as identity anchors. Deposit and withdrawal addresses linked to verified identities propagate through graph analysis to connected addresses. The FATF Travel Rule, now enforced under EU MiCA since December 30, 2024, mandates VASPs share originator/beneficiary data—creating surveillance corridors between compliant exchanges.

---

## Stage 8: Frontend Infrastructure and Supply Chain Vulnerabilities

Perhaps the most insidious category of information leakage occurs through the web infrastructure that users interact with to access blockchain applications. **The "decentralized" backend means nothing when the frontend is a single point of compromise.**

### The Bybit/Safe Frontend Attack (February 2025)

The largest single hack in Web3 history—$1.46 billion stolen—originated not from smart contract vulnerabilities but from compromised frontend infrastructure. North Korea's Lazarus Group compromised a Safe{Wallet} developer's machine, gaining access to AWS S3 bucket deployment credentials. They uploaded malicious JavaScript that specifically targeted Bybit's cold wallet.

The attack was surgically precise: the malicious code only activated for Bybit's specific multisig addresses. Other Safe users saw the legitimate interface. When Bybit's signers initiated a routine fund rotation, they saw legitimate-looking transaction data in the Safe UI while the actual malicious payload was sent to their Ledger devices for signing. The frontend displayed one thing; the hardware wallet signed another.

**Key exposure points:**

- Developer machine compromise (social engineering/malware)
- AWS S3 bucket credentials stored on developer machines
- CDN/hosting infrastructure as single point of failure
- No cryptographic verification of frontend code integrity
- "Blind signing" on hardware wallets showing incomplete transaction data

### The BadgerDAO Cloudflare Compromise (December 2021)

BadgerDAO lost $120 million when attackers compromised their Cloudflare API key and injected malicious scripts into the frontend. The attack didn't touch BadgerDAO's smart contracts—those were fine. Instead, the frontend prompted users to approve malicious token allowances.

Users who interacted with the compromised frontend unknowingly granted unlimited spending approval to attacker-controlled contracts. Some victims had funds drained weeks later when they deposited additional assets, as the malicious approvals persisted.

**The dependency chain problem:** BadgerDAO's "decentralized" protocol relied entirely on centralized infrastructure—Cloudflare for CDN, traditional DNS, standard web hosting. The same is true for Uniswap, SushiSwap, Compound, Aave, and virtually every major DeFi protocol.

### DNS Hijacking Attacks

Multiple cryptocurrency platforms have suffered DNS hijacking attacks, where attackers modify DNS records to redirect users to pixel-perfect clones of legitimate sites:

- **Cream Finance & PancakeSwap (March 2021)**: Both platforms simultaneously hijacked via compromised GoDaddy accounts, redirecting users to phishing sites requesting seed phrases.
- **Multiple GoDaddy incidents**: Liquid.com, NiceHash.com, Bibox.com, Celsius.network, Wirex.app all suffered DNS hijacks through GoDaddy credential compromise.

DNS attacks are particularly devastating because users navigate to the correct URL and their browser shows the expected domain. There is no visual indication of compromise. When users connect wallets and sign transactions, they authorize transfers to attacker addresses while believing they're using the legitimate service.

**Attack vectors for DNS compromise:**

- BGP hijacking to reroute DNS queries
- Social engineering against domain registrars
- Phishing attacks targeting platform IT staff
- Exploitation of vulnerabilities in DNS providers

### The Ledger ConnectKit Supply Chain Attack (December 2023)

A phishing attack against a former Ledger employee yielded NPM credentials, allowing attackers to push malicious versions of the @ledgerhq/connect-kit library (versions 1.1.5, 1.1.6, 1.1.7). This library is used by hundreds of dApps to connect to Ledger hardware wallets.

The attack impacted over 100 frontends simultaneously—any dApp using the compromised library served malicious code to users. Affected platforms included Zapper, Sushi, Revoke.cash, and countless others. The malicious payload, identified as "Angel Drainer" malware-as-a-service, crafted transactions designed to drain connected wallets.

**Critical failures exposed:**

- NPM package publishing lacked multi-authorization requirements
- CDN caching propagated malicious code globally
- No mechanism for users to verify frontend code integrity
- Widespread dependency on shared JavaScript libraries
- 2FA bypassed via session token theft

### The Frontend Trust Problem

Every interaction with a blockchain application involves implicit trust in multiple centralized parties:

| Layer | Trusted Parties | Attack Surface |
|-------|-----------------|----------------|
| **DNS** | Registrar, DNS providers, ISPs | Hijacking, cache poisoning |
| **TLS/SSL** | Certificate authorities | Mis-issuance, compromise |
| **Hosting** | AWS, Cloudflare, Vercel | Credential theft, insider access |
| **CDN** | Content delivery networks | Cache poisoning, code injection |
| **Dependencies** | NPM, package maintainers | Supply chain attacks |
| **Browser** | Browser vendors, extensions | Malicious extensions, vulnerabilities |

Users have no practical way to verify that the JavaScript executing in their browser matches what developers intended to deploy. Content-addressable systems like IPFS could provide verification, but adoption remains minimal. The Gnosis founder shared an IPFS-hosted fork of Safe ("Eternal Safe") after the Bybit hack, highlighting the gap between what's possible and what's deployed.

**The fundamental contradiction:** Users interact with "decentralized" protocols through entirely centralized, unverified web infrastructure. The blockchain itself may be trustless, but the path to reach it is not.

---

## Stage 9: The Downstream Data Economy

The information leaked throughout the transaction lifecycle doesn't disappear—it accumulates and flows to an ever-expanding set of parties.

**Data aggregation and resale:** Chain analytics firms don't just serve law enforcement. They sell products to:

- Exchanges (for compliance and risk scoring)
- Venture capital firms (for deal sourcing and due diligence)
- Trading firms (for alpha generation)
- Insurance companies (for risk assessment)
- Tax authorities (for enforcement)

**Wallet scoring and reputation systems:** Services like Chainalysis's "Know Your Transaction" assign risk scores to addresses. These scores propagate through the ecosystem—a low score can result in frozen funds at exchanges, rejected transactions, or service denial. Users have no visibility into how scores are calculated or ability to contest them.

**Legal compulsion:** All of the centralized infrastructure discussed—RPC providers, exchanges, frontend hosts, domain registrars—are subject to legal process in their jurisdictions. Subpoenas, national security letters, and court orders can compel disclosure of:

- IP address logs
- User account information
- Transaction histories
- Access patterns and timestamps

The EU's MiCA regulation and FATF Travel Rule create legal mandates for information sharing between virtual asset service providers, institutionalizing surveillance corridors.

---

## The Privacy Stack Gap

The fundamental insight from this lifecycle analysis: **application-layer privacy solutions address only one layer of a multi-layer exposure surface.**

Zero-knowledge proofs hide transaction content but not:

- The IP address submitting the transaction
- The timing of transaction submission
- The RPC endpoint receiving the transaction
- Metadata about which contracts are being interacted with
- The frontend infrastructure the user accessed

A user employing Railgun's zk-SNARKs for transaction privacy while using Infura as their RPC provider has their IP address linked to their wallet. A mixer user who checks their output address on Etherscan has their IP correlated through Google Analytics. A stealth address recipient who accesses funds through a compromised frontend has their transaction intercepted entirely.

**Current privacy tool coverage by layer:**

| Layer | Privacy Exposure | Typical User Coverage |
|-------|------------------|----------------------|
| **Coordination** (messaging, negotiation) | Identity, intent, relationships | Minimal |
| **Frontend** (web interface) | Full transaction interception possible | None |
| **RPC/Infrastructure** (node access) | IP, addresses, queries, timing | Very low |
| **Network** (P2P propagation) | IP, timing, origin identification | Minimal |
| **Mempool** (pre-inclusion) | Full transaction content to observers | Growing (~10%) |
| **Application** (on-chain content) | Transaction graph, amounts, participants | Moderate |

**The inversion of attention:** The ecosystem has invested heavily in application-layer privacy—mixers, ZK proofs, stealth addresses—while the lower layers where most practical deanonymization occurs remain largely unaddressed. An adversary doesn't need to break cryptography when they can simply observe network traffic, subpoena RPC providers, or compromise frontend infrastructure.

---

## Conclusion: A Comprehensive Surveillance Surface

The blockchain transaction lifecycle exposes users to a comprehensive surveillance apparatus operating across nine distinct stages. From the moment parties coordinate a transaction through messaging platforms, to the final display of confirmed transactions on block explorers, information leaks to communication providers, wallet software, RPC endpoints, ISPs, mempool observers, MEV searchers, block builders, validators, chain analytics firms, frontend infrastructure providers, and ultimately to any party with legal authority to compel disclosure.

Three structural problems emerge from this analysis:

**First, the IP-to-address correlation problem.** Once established—through RPC providers, block explorers, frontend services, or network observation—this link propagates through all chain analysis. No amount of on-chain mixing helps if observers know which addresses belong to which IP. This correlation can occur at any of the nine stages.

**Second, the centralization creates surveillance nexuses.** RPC providers serving millions of users, block builders constructing 85%+ of blocks, chain analytics firms with billions of data points, and frontend hosting providers represent concentrated points where comprehensive surveillance becomes feasible. The "decentralized" protocol layer sits atop deeply centralized infrastructure.

**Third, the frontend trust problem.** Every user interaction flows through unverified web infrastructure—DNS, hosting, CDNs, JavaScript dependencies—creating attack surfaces that bypass all on-chain security entirely. The $1.46 billion Bybit hack demonstrated that smart contract security is irrelevant when the frontend can be compromised.

Application-layer privacy tools address perhaps 20% of total information leakage. The remaining 80% occurs at coordination, frontend, infrastructure, and network layers where most users have no protection. Until privacy is addressed as a full-stack problem—from human coordination through network propagation to frontend delivery—blockchain privacy will remain partial solutions to a comprehensive surveillance apparatus.
