# Changelog: The Logos Networking Layer in Testnet v0.2

Record of the adversarial review applied to [[logos-networking-testnet-v02-draft|the networking draft]]. Process: three independent critics (research advocate checking claims against the roadmap repo and docs.logos.co, narrative advocate, adversary) attack the draft in parallel; a synthesizer revises under the author's voice profile; repeat. Two rounds run; no round-1 critique resurfaced in round 2, whose findings were narrower (stale status, pacing, prior-art depth) and were resolved in the final synthesis.

## Issues found and fixed

| # | Found by | Issue | Fix |
|---|----------|-------|-----|
| 1 | Adversary + research advocate, R1 | "Nobody, including the first hop, can link sender to message" overclaimed the mixnet | Explicit threat-model accounting added: defended (single curious relay, local observer), not defended (network-wide observer, colluding relays), with the unbuilt counters (cover traffic, large independent relay set) named; testnet-small relay set + demo-mode Sybil resistance → "route nothing sensitive through it yet" |
| 2 | Adversary, R1 | Tor/Nym "borrow the crowd" objection unanswered; I2P — the closest prior art and standing counterevidence to the crowd-compounding bet — absent | New section "Build a crowd or borrow one?": I2P engaged as the cautionary tale; novelty resized to componentized libp2p specs + delay-based mixing; adoption assumption named as the open question |
| 3 | Adversary, R1 | "Costs them twice" strawman: most stacks don't build fragmented anonymity, they build none | Section rebuilt around the real question: where does the capability live so modules actually get it |
| 4 | Adversary, R1 | Crowd argument ignored traffic classifiability; Blend carve-out quietly undercut the shared-crowd thesis | Indistinguishability caveat added (uniform Sphinx packets + cover traffic turn co-tenancy into anonymity); Blend carve-out now asks its own hostile follow-up (what else bails on mix latency; chat is the candidate) |
| 5 | Adversary, R1 | RLN demo-mode risks gestured at, not enumerated | Flanks stated: permissioned off-chain allocator (worse structure than Nym's plural gateways), undefined membership cost, signature-floor auth; "Sybil resistance rounds to nothing" flagged as inference to correct |
| 6 | Research advocate, R1 | The "[try it]" demo link pointed at a testnet v0.1 doc; the v0.2 chat-over-mix doc packet was still in review | v0.1 link removed with an explicit do-not-link note; doc packet moved to publish-time TODO pending it going live |
| 7 | Research advocate, R2 | Round-1 fixes overcorrected into underclaiming: client mode is implemented (PR approved, per 2026-04-06 update), Delivery integration is in dogfooding, and the base mix spec is already published at rfc.vac.dev | Status stated precisely in both directions; conflict between the two advocates resolved by reading the update files directly |
| 8 | Narrative advocate, R1 | Missing transition into the three jobs; discovery's sparse-service problem too abstract | Bridge sentence added; concrete niche-capability example added |

## Critiques rejected (with reasons)

- Quoting a hard number from the vac.dev random-walk analysis: unverifiable locally; an illustrative scenario is used instead and the author can insert a verified figure at publish time.
- Intro-list ordering nit and reordering the honesty section engagement-first: pacing choices; the honesty section's placement after the mechanism is deliberate.

## Known weaknesses (unresolved by design)

1. Build-versus-borrow is honestly unresolved in-text; the piece argues for arguing it in public.
2. Verify with the team before publishing: who operates the current testnet mix relays, and what auth the RLN membership module actually shipped with (simple signature vs Keycard).
3. The chat-over-mix doc packet URL was not confirmed live at review time.
4. The revision grew ~40% over the original; could take a tightening pass if length matters for the venue.

## Fresh-eyes validation pass (2 further rounds)

A second full debate was run on the revised draft with fresh critics. Round 1: narrative advocate converged immediately; research advocate 1 major + 2 minor; adversary 3 substantive + 2 minor. Round 2: research and narrative converged; adversary returned 5 sentence-level repairs, all applied. Nothing from the first debate resurfaced.

| # | Found by | Issue | Fix |
|---|----------|-------|-----|
| 1 | Research advocate (publication-blocking) | Draft called cover traffic "unbuilt" with "spec still to be written" in three places — stale sources. Roadmap updates 2026-04-13 → 2026-06-29 show it implemented, merged into nim-libp2p with a configurable cover-ratio option, and confirmed end-to-end on the five-node testnet-0.2 fleet | Corrected to: built and running; spec in-review, not published; no measurement yet of whether the chosen ratio buys meaningful K-anonymity at demo scale (~10 demo memberships) |
| 2 | Adversary | "Nobody builds a mixnet per module" was self-refuting: Blend is exactly that | Premise rebuilt: per-module anonymity gets built only for the traffic class that can't live without it; Blend named as the live example |
| 3 | Adversary | Build-or-borrow treated Tor as the main objection; Nym-as-transport is the strong version | Restructured: Tor's dismissal argued (TCP-only, exit semantics, anti-p2p stance); "why not speak Nym as a transport?" posed explicitly and left explicitly open; Nym's small user crowd sizes the borrow option honestly |
| 4 | Adversary | Chat as both flagship demo and likeliest defector was an unheld tension | Held together with a marked inference: chat likely lands on per-message opt-in, which keeps it in the crowd but shrinks the crowd to what opts in |
| 5 | Research advocate | RLN allocator and Nym-gateway claims stated beyond ground truth | Hedged: pre-baked fleet keystores read as project-allocated (flagged as inference); Nym gateways "plural and open to anyone willing to bond stake" |
| 6 | Research advocate | LIONESS glossed as generic tamper-proofing | Corrected to the tagging-attack property: a relay can't mark a packet at one hop and recognize it later |
| 7 | Both adversaries (opposite directions) | Registry-leak framing pulled between "new leak" and "no leak" | Settled on the defensible middle: enumeration exists on any Kademlia network; the registry changes the price (lookup instead of crawl) |
| 8 | Narrative advocate | ~40% growth flag from previous pass | Four redundancy cuts taken, mix mega-paragraph split; net length roughly flat because threat-model fixes cost text — trade endorsed by the round-2 narrative critic |

Rejected in the validation pass: accounting-paragraph placement, Blend-paragraph density, PR-number trivia (cosmetic; reasons in editorial notes).

Additional verify-before-publishing items raised: who runs the RLN membership allocator; whether chat-over-mix is per-message opt-in; whether latency is the stated rationale for Blend living outside the mix layer; the five-relay/ten-membership scale figures will go stale.

*Ground truth consulted (both passes): `anoncomms/roadmap/mix.md`, `discovery.md`, `testnet_v0.2/{mix,discovery,rln}_v0.2.md`, `anoncomms/updates/` 2026-02 through 2026-07 (notably 2026-04-13, 2026-04-27, 2026-06-22, 2026-06-29 for cover traffic and fleet deployment; 2026-07-13 for the chat mixnet demo), `testnets/v02.md`, `v02-release.md` (P2P Module); docs.logos.co URL index (llms.txt); external links (libp2p.io, rfc.vac.dev mix spec, vac.dev analysis, DISC-NG/IEEE) verified.*
