# Changelog: Logos Core in Testnet v0.2

Record of the adversarial review applied to [[logos-core-testnet-v02-draft|the core draft]]. Process: three independent critics (research advocate checking claims against the roadmap repo and docs.logos.co, narrative advocate, adversary) attack the draft in parallel; a synthesizer revises under the author's voice profile; repeat. Two rounds run; in round 2 the research and narrative advocates reported no major issues and the adversary's two residual items were fixed in the final synthesis.

## Issues found and fixed

| # | Found by | Issue | Fix |
|---|----------|-------|-----|
| 1 | Research advocate, R1 | Shipped-vs-planned conflations: "every module now exposes OpenMetrics" (release notes support storage/delivery + the OpenMetrics module); "v0.2 added acyclic dependency detection" and "all thirteen modules build through one path" (consolidation-milestone tasks, not deliveries); "v0.1's metrics were blockchain-only" and "mixnet and all" (no ground truth) | Each scoped to release-note strength or reframed as milestone work in progress; unsupported claims cut |
| 2 | Research advocate, R1 | Headless mode presented as new; `v01.md` shows v0.1 already had it | Reframed: v0.2's story is the daemon/client split, TCP remote control, and `logoscore-py`, turning a capability into an operated mode |
| 3 | Adversary, R1 | The capture-point argument defeated itself (Core also has maintainers) and ignored that monoliths are forkable | Rebuilt: fork-as-exit vs module-as-extension distinction added; Core conceded as a trust point; the residual argument is surface area (small kernel, easier to audit, cheaper to fork) |
| 4 | Adversary, R1 | Security section oversold token exchange as if it were isolation; "makes privacy a system property" too strong | Scope-check paragraph added: API-boundary access control is not memory isolation; hostile native module named as the harder threat; isolation roadmap positioned as the open work |
| 5 | Adversary, R1/R2 | "Nobody needs permission" vs caller allow lists read as a contradiction; release indexes read as a new gatekeeper | Reconciled: ship freely, run with granted access (publish-a-package analogy); indexes clarified as a format, repositories user-managed, CLI loading bypasses the store entirely |
| 6 | Research advocate, R1 | "(formerly liblogos)" wrong; liblogos is the current runtime library, not a former name | Header corrected to "runtime library: liblogos" |
| 7 | Narrative advocate, R1 | CBOR/CDDL sentence gave no reason to care | Now explains the actual stakes: parser disagreement at trust boundaries is where exploits live |

## Critiques rejected (with reasons)

- Making the lede standalone for cold readers (narrative advocate, R1): paragraph 2 was made self-contained instead; a stakes sentence would pad.
- Deny-by-default reading of the filesharing example (research advocate, R2 nitpick): reasonable inference from the release notes; flagged as inferred rather than restated.
- "Cheaper to fork ignores distribution rails" (adversary, R2): mooted by the release-index clarification.

## Known weaknesses (unresolved by design)

1. Who sets grant policy (operator, user, module manifest) is unanswered in the release notes; the article flags it as an open question rather than inventing an answer.
2. The surface-area defense of Core-as-trust-point is an argument a skeptic can still reject.
3. The testnet-fleet claim rests on the planned-scope doc (marked "subject to change"); worth a firsthand check before publishing.
4. Deny-by-default semantics for module API access are inferred, not stated in ground truth.

*Ground truth consulted: `roadmap/content/testnets/v02.md`, `v02-release.md`, `v01.md`, `logoscore/roadmap/milestones/2026-logoscore-consolidation.md`, `2026-developer-journey-modules-apps.md`; docs.logos.co URL index (llms.txt) — all four docs links verified.*
