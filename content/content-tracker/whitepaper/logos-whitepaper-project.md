---
title: "Logos Whitepaper Project"
description: "Project management and progress tracking for the Logos litepaper, umbrella whitepaper, and per-component technical papers."
tags:
  - logos
  - whitepaper
  - litepaper
  - project-management
  - assembly
created: 2026-04-13
updated: 2026-04-13
status: active
owner: corey-petty
---

# Logos Whitepaper Project

> **One-line status:** Litepaper drafting in progress. Umbrella whitepaper and component papers queued behind it.

## Executive summary

Logos needs a documentation stack that serves three audiences without collapsing into any of them: **investors** evaluating capital allocation, **protocol engineers** evaluating technical credibility, and the **cypherpunk / sovereign-tech community** evaluating ideological alignment. Structural analysis of the full crypto whitepaper lineage (Bitcoin → Ethereum → Filecoin → Polkadot → Celestia) and adjacent genres (cypherpunk manifestos, IETF RFCs, academic papers, investor documents) points to a **three-tier documentation strategy**:

1. **Tier 1 — Litepaper (~20–25 pages)** — thesis-driven architectural overview. Publish first. Functions as investor narrative, community manifesto, and architectural north star.
2. **Tier 2 — Umbrella Whitepaper (~40–60 pages)** — comprehensive integrative architecture document. Publish 6–12 months after litepaper.
3. **Tier 3 — Per-component technical papers** — formal specifications for Blockchain, Storage, and Messaging. Extend existing work (Cryptarchia spec, Codex whitepaper, Waku IEEE paper). Published on independent timelines.

The closest structural precedents are **Tezos** (position paper → white paper, one month apart) for the thesis-first approach, **Filecoin** (umbrella + component reports) for the multi-component architecture, and **Polkadot's lightpaper** (17 pages, heavy visual design, one concept per page) as the litepaper exemplar.

**Strategic advantage Logos has over most projects at this stage:** existing published technical work for every component, a live testnet, and a book-length philosophical foundation (*Farewell to Westphalia*). The litepaper does not need to invent credibility — it needs to integrate receipts into a unified narrative.

**Full research report:** [[logos-whitepaper-research-report]] *(link once imported into Quartz)*

---

## Documentation map

```
┌─────────────────────────────────────────────────────────────┐
│  TIER 1: LITEPAPER (~20–25 pages)                           │
│  Thesis + architecture overview + ecosystem + roadmap        │
│  Audience: investors, community, press, general public       │
└────────────────────────┬────────────────────────────────────┘
                         │ references
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  TIER 2: UMBRELLA WHITEPAPER (~40–60 pages)                 │
│  Integrated architecture, threat model, security, economics │
│  Audience: developers, protocol evaluators, deep investors   │
└────────────────────────┬────────────────────────────────────┘
                         │ references
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  TIER 3: PER-COMPONENT TECHNICAL PAPERS                     │
│  ├── Logos Blockchain — Cryptarchia, Blend, Bedrock, Zones  │
│  ├── Logos Storage    — DDE framework, proofs, marketplace  │
│  └── Logos Messaging  — Protocol family, RLN, Store         │
│  Audience: implementers, auditors, formal reviewers          │
└─────────────────────────────────────────────────────────────┘
```

---

## Status dashboard

| Deliverable | Status | Owner | Target | Progress |
|---|---|---|---|---|
| Litepaper | 🟡 Drafting | Corey + contributors | TBD | 0% |
| Umbrella Whitepaper | ⚪ Queued | TBD | Litepaper + 6–12mo | 0% |
| Blockchain Technical Paper | 🟡 Partial (V1 spec exists) | Logos BC team | TBD | ~40% |
| Storage Technical Paper | 🟡 Partial (Codex WP exists) | Storage team | TBD | ~50% |
| Messaging Technical Paper | 🟢 Published (IEEE, Waku) | Vac | — | ~80% (needs Logos-framing update) |

**Legend:** 🟢 published / near-complete · 🟡 in progress · 🔴 blocked · ⚪ not started

---

## Phase 1 — Litepaper (active)

**Goal:** Publish a 20–25 page litepaper that can be handed to investors, referenced by press, and read by the sovereign-tech community as a credible statement of intent.

### Phase 1A — Pre-drafting

- [ ] Confirm litepaper authorship model (single author vs. editorial team)
- [ ] Confirm review chain (IFT leadership, Logos team leads, external reviewers)
- [ ] Decide publishing venue (press.logos.co, PDF on logos.co, both)
- [ ] Decide on visual design approach (commission designer vs. in-house; Polkadot lightpaper as benchmark)
- [ ] Select epigraph candidate(s) — cypherpunk tradition or Westphalia-era sovereignty text
- [ ] Align on version numbering and public changelog policy
- [ ] Set up working repo / doc location (Obsidian vault section, GitHub draft repo, or both)

### Phase 1B — Section drafting

Section-by-section status. Each section has a target page count and primary audience.

#### Section 0 — Epigraph + Frontmatter *(~0.5 pg)*
- [ ] Select final epigraph
- [ ] Finalize title, subtitle, author attribution
- [ ] Version number + date

#### Section 1 — The Thesis *(2–3 pg · manifesto register)*
*Primary audience: everyone*
- [ ] Draft opening moral axiom (cypherpunk manifesto energy)
- [ ] Historical framing — 380 years post-Westphalia, governance tech upgrade
- [ ] Articulate sovereignty-requires-full-stack argument
- [ ] Cite concrete capture example (Tornado Cash validator censorship)
- [ ] Compress ruthlessly — this section must carry conviction, not hedge
- [ ] Review pass: does it match the *Farewell to Westphalia* intellectual register?

#### Section 2 — The Problem *(2–3 pg)*
*Primary audience: investors, technical evaluators*
- [ ] Failure mode 1: consensus leader exposure (OFAC, MEV-Boost relay censorship)
- [ ] Failure mode 2: communication surveillance (no protocol-level CR messaging)
- [ ] Failure mode 3: storage centralization (AWS/Pinata dependency, IPFS gateway takedowns)
- [ ] Each failure mode must include specific real-world example with citation
- [ ] Numbered enumeration (mirrors Polkadot §2 structure)

#### Section 3 — The Logos Stack: Architecture Overview *(4–5 pg)*
*Primary audience: technical evaluators, developers*
- [ ] Full-page system diagram (Blockchain + Storage + Messaging + integration)
- [ ] **Logos Blockchain** (~1.5 pg): Cryptarchia, Blend, Bedrock + Zones
- [ ] **Logos Storage** (~1 pg): DDE framework, differentiation from Filecoin
- [ ] **Logos Messaging** (~1 pg): RLN, Store, adaptive nodes; Whisper lineage
- [ ] Integration narrative (~0.5 pg): composition into unified sovereign infra
- [ ] Every design choice paired with architectural rationale (not just what, but why)
- [ ] Filecoin-style "Elementary Components" enumeration on first page of section

#### Section 4 — Design Principles *(1 pg)*
*Primary audience: developers, ideologically-aligned community*
- [ ] Enumerate 4–6 principles (privacy by default, political neutrality, resilience under adversarial conditions, modularity, minimal trust assumptions)
- [ ] Each principle: 2–3 sentences + concrete example of how it constrains design
- [ ] Cross-check principles against Polkadot's "Philosophy of Polkadot" structure

#### Section 5 — The Ecosystem *(2 pg)*
*Primary audience: investors, team/traction evaluators*
- [ ] IFT organizational substrate (contributor count, distribution model)
- [ ] Status, Nimbus, Keycard, Vac — each as evidence of execution capability
- [ ] Logos Circles — community infrastructure
- [ ] Testnet v0.1 status
- [ ] GitHub stats (current numbers, not stale)
- [ ] Avoid team-page cringe (no headshots, no LinkedIn links)

#### Section 6 — Positioning in the Lineage *(1–2 pg)*
*Primary audience: crypto-native evaluators*
- [ ] Bitcoin comparison — shared security model, extended vision
- [ ] Ethereum comparison — privacy gap diagnosis
- [ ] Filecoin/Arweave comparison — DDE vs raw capacity
- [ ] Urbit comparison — modular vs monolithic, protocol vs proprietary
- [ ] Honest acknowledgment of what predecessors got right

#### Section 7 — Roadmap and Current Status *(1–2 pg)*
*Primary audience: investors, potential contributors*
- [ ] What exists today (testnet v0.1, integrated modules, working Blend)
- [ ] Near-term milestones (public testnet phases, incentivized testnet for Storage)
- [ ] Mainnet target (early 2027)
- [ ] Explicitly label what is NOT committed (token launch specifics, speculative features)

#### Section 8 — Economic Design Overview *(1–2 pg)*
*Primary audience: investors, tokenomics evaluators*
- [ ] Three-component economic flywheel
- [ ] Storage marketplace dynamics
- [ ] Messaging incentivization model
- [ ] Blockchain staking / security budget
- [ ] How privacy-preserving staking reinforces sovereignty thesis
- [ ] Explicitly defer detailed vesting / emission to dedicated tokenomics doc

#### Section 9 — Documentation Roadmap *(0.5 pg)*
*Primary audience: all*
- [ ] List forthcoming documents (umbrella WP, per-component tech papers)
- [ ] Reference existing published work (Waku IEEE, Codex WP, Cryptarchia spec)
- [ ] Link to research forum + GitHub
- [ ] Frame this litepaper explicitly as v1 in a series

### Phase 1C — Assembly and review

- [ ] Full-document read-through for register consistency (manifesto → technical → investor without jarring shifts)
- [ ] Verify every claim has a receipt (existing paper, testnet artifact, or shipped product)
- [ ] Skimmability pass — bold 2–3 critical facts per section
- [ ] Diagrams finalized and exported at print resolution
- [ ] Internal review: IFT leadership
- [ ] Internal review: Logos team leads (Blockchain, Storage, Messaging)
- [ ] External review: 2–3 aligned technical readers (suggestion: pick readers from each audience segment)
- [ ] External review: 1–2 investor-side readers for market-facing register
- [ ] Copyedit pass
- [ ] Legal / disclaimers pass
- [ ] Final typeset / design pass

### Phase 1D — Publication

- [ ] Publish HTML version on press.logos.co with schema markup
- [ ] Publish PDF version with versioned URL
- [ ] Update logos.co landing to point to litepaper
- [ ] Coordinate announcement (blog post, social, podcast mentions)
- [ ] Ensure GEO readiness (llms.txt, transcript alignment if podcast coverage planned)
- [ ] Archive canonical version in GitHub with DOI or IPFS hash
- [ ] Seed into LLM training data pipelines per existing GEO playbook

---

## Phase 2 — Umbrella Whitepaper (queued)

**Goal:** Publish a 40–60 page integrative technical document that an independent team could use, together with the component specs, to implement the stack.

**Target window:** Litepaper publication + 6–12 months. Exact timing contingent on mainnet readiness and component-paper status.

### Planning

- [ ] Confirm authorship and editorial model
- [ ] Define formalism conventions (notation, RFC-style normative language for MUST/SHOULD/MAY)
- [ ] Decide citation style
- [ ] Set structure based on Filecoin-style register (abstract, paper organization, formal threat model)

### Drafting

- [ ] Abstract (~300 words)
- [ ] Introduction + Paper Organization
- [ ] Threat Model and Security Requirements (formalize litepaper §2)
- [ ] System Architecture with formal interface definitions
- [ ] Logos Blockchain — moderate technical depth, references component spec
- [ ] Logos Storage — moderate depth, references Codex papers
- [ ] Logos Messaging — moderate depth, references Waku IEEE paper
- [ ] Integration and Composition (shared infra, libp2p, cross-layer interactions)
- [ ] Economic Design (formal game-theoretic treatment)
- [ ] Security Analysis (attack vectors and mitigations)
- [ ] Governance
- [ ] Current Status and Future Work
- [ ] Conclusion

### Review and publication

- [ ] Internal technical review (team leads)
- [ ] External academic review (at least one formal reviewer per component)
- [ ] Security review
- [ ] Publication pipeline (HTML, PDF, arXiv if appropriate, GitHub canonical)

---

## Phase 3 — Per-component technical papers

### Logos Blockchain technical paper

**Status:** 🟡 Partial — Cryptarchia specification and V1 specs exist; need consolidation + formalization pass.

- [ ] Audit existing Cryptarchia spec for whitepaper-readiness
- [ ] Consolidate Blend network documentation
- [ ] Formalize Bedrock + Zones architecture description
- [ ] Security proofs / analysis
- [ ] Editorial pass for paper format
- [ ] Review and publish

### Logos Storage technical paper

**Status:** 🟡 Partial — Codex whitepaper and tokenomics litepaper exist; need Logos-integration update + DDE framework expansion.

- [ ] Update Codex whitepaper with current Logos Storage naming and framing
- [ ] Expand DDE (Decentralized Durability Engine) specification
- [ ] Formalize tunable durability guarantees
- [ ] Erasure coding + ZK storage proofs details
- [ ] Lazy repair mechanism specification
- [ ] Marketplace design
- [ ] Review and publish

### Logos Messaging technical paper

**Status:** 🟢 Near-complete — Waku IEEE paper published; needs Logos-framing refresh + RLN deep-dive.

- [ ] Re-frame Waku IEEE paper content under Logos Messaging naming
- [ ] Expanded RLN specification
- [ ] Store protocol specification
- [ ] Adaptive nodes documentation
- [ ] Review and publish

---

## Cross-cutting workstreams

### Diagrams and visual assets
- [ ] System architecture diagram (litepaper hero diagram)
- [ ] Three-component interaction diagram
- [ ] Blockchain layer internal diagram (Cryptarchia flow)
- [ ] Storage layer internal diagram (DDE flow)
- [ ] Messaging layer internal diagram (RLN + Store)
- [ ] Comparative positioning diagram (Bitcoin/Ethereum/Filecoin/Urbit/Logos)
- [ ] Roadmap timeline visual

### Visual design / typography
- [ ] Litepaper design template (Polkadot lightpaper as benchmark)
- [ ] Typography selection (consistent with existing logos.co / press.logos.co identity)
- [ ] Cover design
- [ ] Section dividers / chapter markers
- [ ] Code / spec block styling for per-component papers

### External validation
- [ ] Identify 3–5 target external reviewers across the three audience segments
- [ ] Draft reviewer brief
- [ ] Reviewer coordination timeline (2-week windows)
- [ ] Consolidate feedback and decide what to address vs defer

### GEO / discoverability
- [ ] Schema markup for published litepaper page
- [ ] llms.txt entries
- [ ] Training data inclusion strategy
- [ ] Podcast coverage plan (The Bitcoin Podcast + external shows)
- [ ] Transcript restructuring for podcast episodes referencing the litepaper

---

## Open questions and decisions needed

> Track decisions here. Close them out with a date and rationale.

- [ ] **Litepaper publication venue** — press.logos.co, standalone PDF, or both? *(decision needed before Phase 1B starts)*
- [ ] **Authorship byline** — single author, editorial team, or "Institute of Free Technology"?
- [ ] **Token-related content depth** — how much of the economic design goes in the litepaper vs. deferred to a dedicated tokenomics document? *(legal review input needed)*
- [ ] **Visual designer** — external commission or in-house? *(budget + timeline implication)*
- [ ] **Relationship to *Farewell to Westphalia*** — explicit citations in Section 1, or keep the philosophical framing independent to avoid binding the litepaper's register to the book?
- [ ] **Version control** — is the litepaper a living document (like XMTP litepaper on GitHub) or a fixed versioned artifact (like Bitcoin whitepaper)?

---

## Risks and blockers

- **Register drift risk** — the hardest challenge is maintaining tonal consistency across manifesto / technical / investor sections. Mitigation: single author or tight editorial coupling, with explicit register checks during review.
- **Over-promising risk** — mainnet timelines and token specifics are the two places litepapers most commonly damage credibility. Mitigation: explicit "not committed" labeling in Sections 7 and 8.
- **Component drift risk** — if the three components evolve on independent timelines, the litepaper's architecture description can become stale fast. Mitigation: version the litepaper explicitly; plan for a v1.1 shortly after major component changes.
- **Review bottleneck risk** — multi-audience review can create contradictory feedback. Mitigation: separate review passes by audience segment, with an editor reconciling rather than the author trying to serve everyone simultaneously.

---

## Reference material

- Research report: *Whitepaper architecture for a sovereign technology stack* (full analysis that generated this plan)
- Structural precedents most relevant to Logos:
  - Tezos position paper (2014) — thesis-first approach
  - Filecoin whitepaper (2017) — umbrella + component model
  - Polkadot Lightpaper (2020) — 17-page visual design exemplar
  - Arweave Lightpaper v2 (2023) — three-component framing
- Existing Logos documentation to integrate:
  - *Farewell to Westphalia* (Hope & Ludlow, 2025)
  - Cryptarchia specification
  - Logos Blockchain V1 specs
  - Codex whitepaper + tokenomics litepaper
  - Waku IEEE paper (2022)
  - press.logos.co back-catalog

---

## Changelog

- **2026-04-13** — Initial project plan created from research report.
