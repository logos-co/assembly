# Changelog: Logos Messaging in Testnet v0.2

Record of the adversarial review applied to [[logos-messaging-testnet-v02-draft|the messaging draft]]. Process: three independent critics (research advocate checking claims against the roadmap repo and docs.logos.co, narrative advocate, adversary) attack the draft in parallel; a synthesizer revises under the author's voice profile; repeat. Two rounds run; round-2 adversary reported no load-bearing flaws remaining. A parallel single-pass review caught two additional items, folded in after the debate.

## Issues found and fixed

| # | Found by | Issue | Fix |
|---|----------|-------|-----|
| 1 | Research advocate + adversary, R1 | Centerpiece dogfooding claim ("Chat uses the same surface any third party gets... not privileged internals") was unverifiable from ground truth, and first-party dogfooding is weak evidence for third-party DX | Concedes the weakness openly and claims only what dogfooding buys: the API survived contact with a real application, and those fixes landed in the public surface |
| 2 | Research advocate, R1 | Reliable Channels property list stated the milestone's FURPS *targets* as shipped present-tense behavior | List reframed as "the contract it's specified to deliver"; what v0.2 actually contains stated per `v02-release.md` (API spec/shape, SDS wiring, first SDS-Repair implementation, persistence); explicit "target, not a kept promise" |
| 3 | Adversary, R1 (sharpened R2) | Lede's "easy or safe" dichotomy falls to the Signal counterexample | Reframed as convenience vs metadata; Signal named as the easy-and-content-encrypted case; tightened in R2 to survive sealed-sender pedantry |
| 4 | Research advocate, R1 | "KeyPackage registry removes the out-of-band exchange that has annoyed users of every E2EE messenger" is false for Signal/WhatsApp, whose servers act as key directories | Scoped to E2EE systems without a server to distribute bundles; "doing it without the center is the actual work" |
| 5 | Adversary, R1 | Layering rationale argued against a strawman ("one clean interface is a lie at either extreme") and ignored the leaky-abstraction objection | Argues against the real alternative (high-level API accreting config flags); concedes p2p realities leak through any surface; health endpoint positioned as the design's answer |
| 6 | Adversary, R1/R2 | Costless-sounding claims: "multi-device for free", unhedged "tiers not flags" | Names the cost (MLS group state per conversation), framed as an explicit bet; "ask me again in three releases" hedge added |
| 7 | Research advocate, R1 | "Flagship messaging app" designation unsupported; "(browser, mobile)" overspecified edge mode | "Flagship" cut; "resource-restricted clients run in edge mode" per the milestone |
| 8 | Adversary, R1 | "Privacy of the eventual transaction is already compromised" stated as absolute | Softened to mechanism: coordination leakage hands over the who-deals-with-whom map; vault/sign-in-sheet image carries the stakes |
| 9 | Parallel review | Chat's v0.1→v0.2 integration transition missing: v0.1 embedded Delivery directly (privileged internals); v0.2 moved it to the public module surface per the Logos Core integration milestones | Transition added; it is the fact that makes the dogfooding section true |
| 10 | Parallel review | Missing scope limits a builder would trip over: RLN rate limiting out of scope for the Messaging API preview; Reliable Channels ships without segmentation or the rate-limit manager | Both named in the developer-preview paragraph, with GA as the stated vehicle |

## Critiques rejected (with reasons)

- Restructuring section 1 to put the layering rationale before the three floors (narrative advocate, R1): the floors must exist in the reader's head before "why layers" means anything. The orphaned QUIC sentence between them was fixed instead.
- Cutting "That's the point." (flagged as possible self-grading): retained; it is a claim about the design goal, not the essay, and is in the author's registered voice.

## Known weaknesses (unresolved by design)

1. Blockchain-article link is a relative draft filename until a published URL exists (publish-time TODO in the draft).
2. Evidence base is thin by the piece's own admission: no load numbers, no third-party developer reports. Thesis narrowed to "the design shipped; the test starts now." If OpenMetrics numbers land before publication, add one.
3. "Formerly Waku" is consistent with repos and docs but not stated verbatim in ground truth; sanity-check with comms.

*Ground truth consulted: `roadmap/content/testnets/v02.md`, `v02-release.md`, messaging milestones `2026-messaging-api-developer-preview.md`, `2026-reliable-channel-api-developer-preview.md`, `2026-chat-foundations.md`, Logos Core integration milestones; docs.logos.co URL index (llms.txt).*
