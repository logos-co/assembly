# IFT Town Hall — Transcript
*February 20, 2026*

---

## Opening

*The session opens with an original song — "Keys in the Sand" — performed as the intro.*

> *I want my keys in the sand, not in your hand.*
> *My secrets drifting where the tide can't reach the land.*
> *Share what I choose and keep what I am.*
>
> *A thousand voices, not just one command.*
> *We'll whisper free in a crowded room and dance in our own little bloom.*
>
> *Maybe control was never meant for one.*
> *Maybe the sun belongs to everyone.*
> *So write our names in scattered constellations,*
> *each tiny light its own foundation.*

---

## Host Introduction & Announcements
*Host: Corey Petty*

Hello everyone, welcome to another week of town halls. I'm your host Corey Petty. JB couldn't make it today — he had an appointment — so I'll be handling the shoutouts myself.

### Shoutouts

**Frank** — from Danish: *"Silently steers the ship, making sure every moving part runs like a well-oiled machine, even when there are hundreds of them. His feedback is always sharp, succinct, and actually useful. He's been nothing but encouraging and motivating to the team, and genuinely cares about what drives each of us and that we're happy where we are. Everything you'd want in a great leader, all rolled into one. Appreciate you, Frank."*

**Maya** — from Balage: Shoutout to Maya in People Ops for always being there when we need her.

**Amelia** — from Chris: *"Shoutout to Amelia for being there in the trenches — one of the few people whose daily job is to patiently listen and talk to our community, to educate, to support, and to figure out what resonates and what doesn't, together with the people we are building for. Thank you for all the hard work and all that you do."* It's genuinely hard to sit and engage with the community day in and day out. Big shoutout.

**Moody and the LEZ team** — from Frank and the EcoDev Engineering team: *"The team is working on major features such as the integration of LEZ in the blockchain, yet they have been very responsive to red team queries, issues, and pull requests, and highly communicative. This is very much appreciated and we are looking forward to continuing to collaborate with them."*

**Juliano** — from Balage: *"Shoutout to Juliano for taking up the mantle of managing the Logos Storage team. It's not an easy duty, and I appreciate that it's not exactly his favorite pastime either — but he is still doing an amazing job. Thank you, Juliano, for continuing to lead."*

If you have shoutouts, send them to JB and the People Ops team and we'll feature them in the town hall. They also get posted in the town hall discussion and People Ops channels on Discord.

---

### Parallel Societies Update

We are about two weeks out, folks. It's coming up soon. For those of us who can make it to Lisbon:

- Your IFT free ticket should be waiting in your Status inbox. Make sure you have your QR code ready at the door. Check it now so there are no surprises.
- Tickets for friends, family, or plus-ones are available at **ps.logos.co**.
- If you haven't received your ticket, reach out to Amelia ASAP.
- If you know any developers, activists, or people who'd fit in — reach out to Lou and she may be able to get them in.

**Current attendance:**
- Day 1: 556 attendees (coalition partners, IFT contributors, and tickets sold)
- Day 2 (festival): 862 people

We still have room — let's fill this place up. The bigger this launch, the better people understand what we're doing.

**Recent speaker additions:**
- Brewster Kahle from the Internet Archive — thanks to Vloff for making that happen.
- Some folks from Sealand — thanks to Sterland.
- Jardosmali and others — thanks to Agata.

Anyone can bring people in. Every effort is appreciated. It's going to be awesome.

---

We have four presentations today, so it'll be a full schedule. Let's get into it.

---

## Presentation 1 — Intops: A Nim Integer Operations Library
*Presenter: Constantine*

**Constantine:** Hello, hope you can hear me. I'm in a hotel so my connection is a bit flimsy — I'll turn off my camera.

### What Is Intops?

Intops is a new Nim library that implements arithmetic operations for integers — 64-bit and 32-bit, signed and unsigned flavors. Operations include addition, subtraction, multiplication, division, and several combined operations like fused multiply-add (FMA/MAD) and others. There's also a composite operations module that combines primitives for convenience.

For each operation, Intops offers multiple **flavors** — saturating, wrapping, overflowing, and so on. And critically: it tries to pick the **best implementation for any given environment**. At compile time, if you're on a 32-bit Linux machine with GCC 14, Intops takes all of that into account and selects the optimal implementation from among the many available. At its core, the library is: many operations × many implementations × a dispatcher that picks the best one.

I'll consciously skip the specifics of algorithms (they're well-known) and implementation details (readable in the code). What I want to share is the path I took, the decisions I made, and why you should want to use Intops.

### Why Was It Created?

Before Intops, there was no single library implementing arithmetic operations that are by their nature shared across many consumers. Because it's such a fundamental thing — addition, subtraction — many libraries just implement these themselves inline. No single source of truth.

For example: **Stint** is a great library that had to implement a subset of arithmetic operations for its own needs. **BN Curve** needed some of those same primitives and ended up importing them from Stint's *private* modules. Private — as in, not intended to be imported externally. That created a weird coupling: BN Curve depended on Stint, while Stint never intended to be a dependency of BN Curve.

Additionally, operations implemented inside Stint or BN Curve weren't documented or benchmarked in isolation. There are benchmarks for Stint-as-a-library, but not for "saturating addition on a 32-bit Linux machine with GCC 14" — because that was never the point of those libraries.

Intops provides a single, reusable, well-documented, and benchmarked interface for all of this.

### Design Philosophy: Maintainability First

My top priority when building Intops was **maintainability**. Why? Because a performance-centric library is a never-ending pursuit — a new GCC version, a new CPU architecture, new intrinsics, and what was optimal yesterday might not be tomorrow. The library must be perpetually extendable and improvable. There are also many potential consumers, each with different needs and feature requests, so the design must accommodate unknown future requirements cleanly.

The three principles I followed from day one:

**1. Maximum decoupling.** Implementations live separately from the logic that picks implementations. You can experiment with either without touching the other. Any contributor can work on one isolated piece.

**2. Per-operation dispatch logic.** I initially assumed there might be universal answers — "if we can use intrinsics on this platform, always use them." It turns out that's not true. Each operation demands its own treatment. So dispatch logic is per-operation, per-type (e.g., unsigned 32-bit addition can be tuned independently of signed 64-bit multiplication).

**3. Availability checks are separate from selection logic.** Whether an implementation *can* run in a given environment is a different question from whether it *should* be chosen. These are handled in two separate places.

### Library Structure

- `impl/` — all implementation families (pure Nim, C intrinsics, inline assembly). Assembly implementations are split by ISA: `x86/`, `arm64/`, etc. New families and flavors can be added without touching anything else.
- `ops/` — all operation families (`add`, `sub`, `mul`, etc.). Each module contains **dispatchers**: templates that import all available implementations and contain the branching logic to select the right one.
- Top-level entry point — imports and re-exports all dispatchers. The happy path: just `import intops` and everything is available. If you want to be specific, `import intops/ops/add`. If you want to use a specific implementation directly, you can import it from `impl/` — the library gives you full access at every level.

### What a Dispatcher Looks Like

```nim
# Simplified example
proc saturatingAdd*(a, b: uint32): uint32 =
  when nimvm:
    # Compile-time: only pure Nim works here
    pureNimSaturatingAdd(a, b)
  else:
    when defined(gcc) and useIntrinsics:
      gccIntrinsicSaturatingAdd(a, b)
    elif defined(amd64) and useInlineAsm:
      x86SaturatingAdd(a, b)
    else:
      pureNimSaturatingAdd(a, b)
```

Globally defined constants let you compose conditions cleanly — checking for GCC vs. Clang vs. MSVC, checking compilation flags — so that reading the dispatcher code makes the intent obvious at a glance.

### Where Is Intops Used Today?

- **Stint** — a large portion of Stint's own arithmetic primitive code has been replaced with Intops. Stint now delegates those implementations to Intops.
- **BN Curve** — no longer depends on Stint's private modules. Now depends directly on Intops, as it should.
- **Nimbus-eth1 and Nimbus-eth2** — both now have Intops as a proxy dependency through their upgraded versions of Stint and BN Curve.

### How to Use Intops

1. Add `intops` to your `.nimble` file.
2. Check the API docs to see if the operations you need are available.
3. `import intops` for everything, or import specific operation modules as needed.

There are contributor guides for adding both new operations and new implementations — I wrote them before implementing features myself, then dog-fooded them to verify they work. If you want to contribute or have any questions, find me on Discord.

### Roadmap

- **Replace more Stint private module dependencies.** If you maintain a library that imports Stint's private modules, contact me — I'd like to replace that with Intops.
- **Expand to more libraries.** If you maintain a library that implements its own arithmetic primitives and would rather delegate that work, reach out. We can either extend Intops with what you need or you may find it already covers you.
- **Deprecate parts of STEW.** STEW is a Nim utility collection with some overlapping functionality. The `SaturatingArith` module in STEW is already deprecated (replaced by Intops). The next obvious candidate is `BitOps`. There may be others.
- **Reliable benchmarking infrastructure.** Intops is currently 100% covered by benchmarks, but they run on GitHub Actions, which has hardware variability. The results are somewhat flimsy — sometimes showing phantom performance drops. We've discussed setting up a dedicated benchmarking machine (like the one used for Nimbus benchmarks) with Siddhartha, and he's eager to help. Benchmark results are currently published to **codspeed.io**, which I recommend for visualizing and tracking performance regressions — it's a great service.

---

**Host:** That's great. This is clearly going to be useful as a core abstraction — so much of what we do uses big integer operations as a fundamental primitive, and especially in cryptography you want that to be solid. Thanks a lot. Find Constantine on Discord if you want to learn more.

---

## Presentation 2 — Logos Contribute: The Contributor Portal
*Presenter: Gho*

**Gho:** Hi everyone. I'd like to give you an update on **Logos Contribute** — our contributor portal designed to support and celebrate open source contributors across the Logos ecosystem.

The goal is simple:
1. **Recognize** the amazing work our community is already doing.
2. **Make it easy** for new joiners to make their first contribution to the Logos ecosystem.

Open source contributions can feel unclear — you may not know where to start, what to work on, or whether your work matters. Logos Contribute helps make contributions more visible, structured, and rewarding. You can visit it at **contribute.logos.co**.

### What's There Today

**Contribution statistics** — a year of consistent activity across GitHub issues, pull requests, reviews, translations, events, and more. What's encouraging is not just the volume but the diversity: it's not only engineering. Open source contributors do writing, translation, and event organizing too. Contributing to Logos is not limited to developers — anyone in the community can participate and create impact.

**Leaderboard** — a bit of fun and friendly competition, but more importantly: visual recognition for contributors. Each type of contribution earns points:
- Opening GitHub issues
- Merging pull requests
- Reviewing code
- Writing docs or blog posts
- Translation
- Designing assets
- Organizing meetups or giving talks

GitHub-related contributions are fully automated. We've also manually awarded points to key contributors. We're intentionally rewarding more than just code, because open source is about the entire ecosystem that supports it.

### What's Changing: Logos Contribute → Logos Builder Hub

The contribute portal is evolving. Instead of just being a contribution tracker, **Logos Contribute will become the Logos Builder Hub**, managed by the EcoDev team. The shift is from tracking contributions to actively supporting the community of builders end-to-end. EcoDev will share more on the builder hub details later.

Specifically:
- **Proposals** will be more structured and transparent, moving to **forum.logos.co** under a dedicated proposals category. Community members can post ideas, discussions are open, and everything stays in one place with full community feedback.
- **Issues** will be organized with labels across our GitHub orgs and repos, so contributors can easily discover tasks that match their interests or skill sets.
- **Onboarding** will be more comprehensive, guiding contributors from first contact through to sustained contribution.

Logos is pioneering a new era of freedom — it's a grassroots social movement. We need the community to help build the decentralized technology stack to revitalize civil society. The builder hub will be the gateway for anyone who wants to be part of that.

---

**Host:** Great work. I like the scoring system — especially the fact that you've included more than just developers. Everything that bleeds off the development work matters too. See you in a few weeks.

---

## Presentation 3 — Logos Improvement Proposals (LIPs)
*Presenter: Philip*

**Philip:** Hi everyone, nice to see you all. I'll talk about the **LIPs** — Logos Improvement Proposals, previously called RFCs — currently live at **lips.logos.co**.

### New Interface

The old RFC index was non-interactive and not user-friendly. We migrated from Docusaurus to **GitBook**. This is still a beta version, but already much better:

- All types of filters
- Sortable columns
- Clickable sidebar links
- View multiple specs simultaneously
- Easily accessible spec template
- **Previous versions of a spec** visible directly in the spec itself — increasingly useful as specs evolve over time

### Spec Anatomy

You'll see me and Florentin commenting on specs going forward — we're now code owners on the RFC index repo. Here's what we look for in each spec:

- Metadata header
- Abstract
- Background
- Specification
- Security considerations
- Privacy considerations
- Copyright and license
- References

This template is currently inherited from COSS (Consensus-Oriented Specification System), the first spec in the index. It's open to refinement — we're always happy to discuss what project teams would find more suitable. Our comments are proposals, not mandates. The ultimate decision belongs to the spec authors. We want uniformity, but everything is open to discussion.

### Specification Lifecycle

Based on COSS, the current lifecycle states are: **Raw → Draft → Stable → Deprecated → Edited → Deleted**.

Most specs in the index today are Raw or Draft. We have very few Stable specs. That's fine — if you have even the very beginning of a spec without all the required elements, it can go in as Raw and we'll work on it together. Tag us on GitHub or ping us on Discord and we'll help.

The happy path: write a raw spec → add to the RFC index → implement and iterate → propose Draft status → reviews → once there are a couple of implementations, discuss moving to Stable. Moving to Stable requires meaningful implementation work, so it's unlikely before mainnet in most cases.

### What's Next for LIPs

- **Change notifications** — improve how they work
- **Better search** — and linking between specs
- **Cross-linking to documentation** — we're aware specs aren't always the only source of truth. We want to link specs to related documentation in the ecosystem
- **Better previous-version dashboards**
- **Refine the process itself** — COSS works well enough today, but it needs iteration

Your feedback is genuinely very useful. Report anything: open a GitHub issue, ping us on Discord, or post in the RFC-PM channel on VAC Discord.

### Adversarial Spec Tool

A couple of weeks ago Corey mentioned the **adversarial spec tool**. The link is in the slides (shared on Notion). This is a tool we want to offer as a way to help with spec writing — not to write specs for you, but to improve the process.

**Corey:** The idea is to fork it so that the output of whatever argument happens between the LLMs is structured to produce documents in the COSS format we use. Right now, Zach Cole built the original version around PRDs (Product Requirements Documents) and technical specifications, which don't map directly to our process. The goal is: by the time you're done using the tool, it's checked off all the things we care about and spits out a document in the right format. More tooling to make sure the right document gets produced, that it gets integrated into the RFC index, and that you've thought about all the aspects you should be thinking about when writing specs.

**Philip:** Exactly. The tool is live but I want to research and refine it a bit more before we make it ours — maybe even brand it for Logos. The end goal is to use AI to help write better specs for things that are usually time-consuming.

**Key links:**
- lips.logos.co
- [The RFC index repo on GitHub]
- [The COSS process documentation]

Reach out to me or Florentin directly, or post in RFC-PM on VAC Discord. Don't be shy — bad feedback is even better than good feedback. Hope to see you soon.

---

**Host:** Very near and dear to my heart. We'll have a lot of conversations around this at the all-hands and off-site — with leads and anyone else who has opinions on what specs are, how to do them, and how individual projects' documentation relates to specifications. The more we can visually surface how these things are actually put into practice, the easier it is for people to understand how they're used.

**Philip:** Exactly — specs might not always be the central piece of documentation, but they should be, and other documentation can help define them better.

---

## Presentation 4 — Status Network Update
*Presenter: Cyprian*

**Cyprian:** We have a lot to cover, so please bear with me.

### What Is Status Network?

**Status Network** is a fully gasless chain based on reputation. It features network-level spam protection, is designed for two use cases (humans and bots), unlocks composable privacy across all apps, and scales Ethereum using Linea's open-source L2 stack (a ZKVM stack).

### Why Gasless?

Gaslessness is a new privacy primitive. A fully gasless chain unlocks several things:

**Ephemeral stealth accounts and relayers.** You can have gasless bots and relayers batching and delaying transactions arbitrarily, which lets you avoid timing correlations — a huge problem in privacy. If you make a swap, it's normally easy to trace: this token swapped with that, ended up in that account, at that time. With a gasless chain, you can say "I want this swap done, but I'm fine if it happens anywhere in the next 24 hours." Timing correlation becomes vastly harder.

**No funding trails.** You can't tell which account funded which other accounts.

**No gas fingerprinting.** Scripts and bots often use hardcoded gas values, which can be used to link accounts. Gone.

**Free cover traffic.** Cover traffic means creating a flood of cheap, legitimate-looking transactions in the privacy layer. On a gasless chain, cover traffic is essentially free to generate, which massively increases the size of anonymity sets — something that practically doesn't exist anywhere today.

### Network-Level Spam Protection

We use RLN (Rate Limiting Nullifiers) — thanks to the Noncoms team for helping with that. Here's how it works for Status Network:

**Karma** — a soulbound reputation token. You earn it by contributing to the network's growth: staking SNT, providing liquidity, using apps, developing apps, paying sequencing tips, making donations to the funding pool, and more. Karma is non-transferable and non-purchasable. It represents your reputation on the network.

Karma determines:
- Your level of free transactions — ranging from ~2 per day to ~500,000 per day depending on karma level
- Your governance power over the native yield

### Native Yield

Most chains today rely on gas fees as revenue. The problem: gas fee revenue is trending toward zero across all L1s and L2s. Status Network replaces gas fees with two revenue sources:

1. **Productive capital yield on L1.** Every ETH and every stablecoin bridged to the L2 is deployed productively at the L1 level to generate yield. That yield is bridged back to the L2 funding pool.
2. **Native app fees.** All native apps on the L2 generate fees that flow into the funding pool.

The funding pool therefore grows with two metrics: **TVL** (more total value locked → more yield) and **volume** (more app activity → more fees). Congestion is no longer the main revenue driver — usage is. That's a fundamentally different model.

Karma holders govern the allocation of this native yield. It flows in two main directions:
- **Liquidity providers** — to ensure deep liquidity on the chain
- **App builders** — to incentivize more app development

### What It Unlocks

**For humans:**
- Private interactions with any app
- Confidential yield, borrowing, swapping, fundraising
- Free-to-use chain — no ETH needed to get started
- Seamless onboarding via session keys — no gas approval pop-ups
- Governance power over the network's funding by simply using it

**For bots:**
- Confidential strategies and confidential balances
- Predictable execution — pay zero or a flat fee; no gas estimation, no price spikes
- **Per-block LP rebalancing at zero cost** — at each block, an LP with sufficient karma can rebalance their position continuously. Tighter spreads, more productive liquidity, significantly less LVR (loss-versus-rebalancing, a form of MEV).
- Free DeFi automations — liquidations, arbitrage, yield harvesting, compounding, all free

### Network Updates

**Open-sourced Abraasax** — the first implementation of a native SN L2 with built-in spam protection using RLN. Available on our GitHub now.

**Timeline:**
- Testnet v2 public release: early March
- The off-site in March will have a private/internal version running for testing
- Mid-March: public testnet v2 release (assuming all goes well)
- **Mainnet target: April** — we're really hoping to hit April. May or June would be disappointing.

**Infrastructure:** Using internal Kubernetes deployments for DevNet, allowing faster iteration on technical workflows.

**Future work:**
- **Decentralized slashing** — if you spam the network, your karma (reputation) gets slashed. Currently working on making that slashing process fully decentralized.
- **Gas kill switch** — in the event of a major coordinated bot attack, a kill switch can flip the chain back to requiring gas fees, instantly wrecking all coordinated bots. Critical for long-term security.
- **User-level epoch limits** — another defense layer against coordinated attacks

### Ecosystem & Deployments

- **Hub is live** — check it at **hub.status.network**
- **Snappy API** — live. (The API is a little hedgehog named Snappy.)
- **Karma SDK** — the way apps access reputation/karma levels; being updated ahead of mainnet
- **Infrastructure providers** selected for launch; contracts being signed and invoices being paid
- **Pre-deposit vaults** — open at **hub.status.network/predeposits**. Currently ~$7.3M deposited ($1.2M from treasury, rest from depositors). Some LPs could deposit up to $20M in ETH/USD, but the recent market downturn makes it hard to guarantee the liquid reward yields they're targeting. Waiting for mainnet to attract that tier of liquidity.

### Native Apps

Native app fees feed the native yield, so native apps are critical to the network's health. Already announced:
- **Orvex** — native DEX
- **Firm** — native CDP (decentralized stablecoin backed by SNT via Liquity v2). If you hold SNT, you'll be able to mint a stablecoin and leverage your SNT.
- **Native launchpad** (finalizing) and **native privacy layer** (finalizing) — to be announced within the next month, both present at the off-site

**GUSD Vaults on L1:**
GUSD = Generic USD. Deposit any stablecoin (USDC, USDT, USDS) on L1; mint a new stablecoin called GUSD on the L2. GUSD can be yield-bearing because the underlying L1 vault generates yield that gets bridged to L2. Built in partnership with Aragon, with plans to expand to other L2s.

**SNT staking** and the **karma system** are both live on testnet; ready to deploy on testnet v2 at launch.

**Karma NFTs** — in progress. Little dragon NFTs, soulbound at the karma tier level, with tradeable assets (skins, weapons, shields) that unlock at different karma tiers. Full gamification system in development — expect a preview at the off-site.

**Bring ID** — new team building zkID and zkKYC solutions. For a privacy chain, you want a wide range of reputation sources while keeping identity private. Bring ID is one of them.

**Six ecosystem apps** already building on testnet v1, to be migrated to v2 and then mainnet: games, privacy protocols, and more.

### Marketing

Running a new strategy around SEO and **GEO** (Generative Engine Optimization — essentially SEO for AI bots and LLMs). Creating content that AI systems can parse and surface in response to prompts about gasless networks, yield-based networks, privacy, etc. Shoutout to Camila who is leading this — she just set up Claude Bot integrations, so it'll be interesting to see the results.

Pre-deposit campaign has generated ~100K views on Twitter/X since launch, growing organically from a fresh account that's less than a year old.

---

### Q&A

**Host:** What's the main holdback for not hitting April?

**Cyprian:** No single major blocker — we know what we're doing. The risk is that we have so many parallel tracks that if even one derails, it can substantially affect the release date. For example: if the governance isn't quite ready, we could probably launch mainnet and add governance shortly after — that's manageable. But if our infra provider (Gateway) has a major issue, or the vault bridging pipeline isn't tested and solid, that's more serious. We also still have audits in progress. So: many tracks, any one of which could slip the timeline. We're super heads-down. If I take more than 2-3 days to reply to a message, just ping me again — I'm flooded.

---

**Chat question (via Chris):** Someone asked — why launch an L2 for Status while also launching an L1 that includes Logos Messaging? How do we position these?

**Host:** Quick answer: what Logos is building is still in very early phases. We're in devnets, we'll have a testnet by the all-hands, but the infrastructure to support the kind of momentum Status Network currently has doesn't exist yet in Logos. While we build out the lower layers of privacy infrastructure, Status can run full speed catering to the Ethereum ecosystem and current L2 market. We can assess how to merge the two down the line when Logos is ready to handle the momentum and growth Status is pushing for. The Logos infrastructure simply isn't ready for what Status is currently pushing with the Linea L2.

**Cyprian:** Two things to add. First: Status Network is essentially our **guinea pig for Logos mainnet**. We're figuring out everything needed to launch a new chain — infra providers, liquidity, oracles, RPCs, everything. That work will directly inform when and how we launch Logos mainnet or even testnet. We're acquiring that operational knowledge now.

Second: the longer-term vision is to push our DA (Data Availability) layer to Logos as bedrock. Status Network is very Ethereum-focused — and every new ecosystem faces the question of how to get liquidity in. Status Network will act as the bridge between Ethereum's liquidity and the Logos ecosystem. We're planning to launch a new core private asset called **ZE** (slightly leveraged ETH with high yield, privately held) in about 6-8 months, with the goal of eventually bridging that into Logos. The idea: high-yielding, already-private ETH-based assets that flow from Ethereum into Logos, arriving with a solid privacy baseline. That's the long-term bridge between the two ecosystems.

**Host:** There's a lot of work ahead, but it's great to see the headway. I'm staked all the way.

**Cyprian:** Me too.

---

## Closing

**Host:** That's all we have for today. All the slides and links from today's presentations are in the Notion page, which I'll drop in the YouTube description. They'll also be in the IFT Town Halls discussion channel on Discord. Thanks everyone — see you in Lisbon in a couple of weeks.

*All:* Looking forward to it. Bye!
