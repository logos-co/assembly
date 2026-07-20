# Changelog: Logos Basecamp in Testnet v0.2

Record of the adversarial review applied to [[logos-basecamp-testnet-v02-draft|the basecamp draft]]. Process: three independent critics (research advocate checking claims against the roadmap repo and docs.logos.co, narrative advocate, adversary) attack the draft in parallel; a synthesizer revises under the author's voice profile; repeat. Two rounds run; the narrative advocate converged in round 2, and the three residual research/adversary items were fixed in the final synthesis.

## Issues found and fixed

| # | Found by | Issue | Fix |
|---|----------|-------|-----|
| 1 | Research advocate, R1 | "Zero terminal windows" was falsified by the draft's own install-doc link: Linux requires `chmod +x` | Now "zero on macOS, one `chmod +x` on Linux (AppImages gonna AppImage)"; the qualifier reused as the closing beat |
| 2 | Adversary, R1 | The browser argument proved too much: Basecamp's binary and Package Manager apps also come from servers | Objection stated in-text with the real distinction: explicit user-initiated re-trust on update vs silent per-visit re-trust |
| 3 | Research advocate, R1 | "No intermediary at all" false (relays exist; testnet bootstrap is project-run); "mixnet underneath everything" (mix is optional in chat); "OpenMetrics exposes everything" (module metrics); "chat app can use storage" (unsupported) | Each corrected: the absent thing is the identity-logging gateway view; mix marked optional; metrics scoped; composition examples replaced with sourced ones (AMM on LEZ, filesharing on Storage) |
| 4 | Adversary, R1 | One-shell-vs-separate-apps was a false dichotomy ignoring the shared-local-daemon alternative | Engages the real alternative: shared daemon gets you shared infrastructure but per-app updaters, auth, and version opinions; the shell solves those once |
| 5 | Adversary, R1 | Operator-recruitment claim stated as causal fact | Reframed as an explicit stance with the confounder conceded: click-to-run nodes don't carry a network; recruitment-funnel argument owned as opinion |
| 6 | Research advocate, R1 | v0.1 characterization vague | Accurate texture from `v01.md`: alpha UIs, out-of-band key-bundle swaps, mix routing in a separate demo app |
| 7 | Narrative advocate, R1 | Feature wall in prose was a wall | Converted to a list |
| 8 | Research advocate + adversary, R2 | Residual overclaims in the isolation section | "Judge for yourself" framing: release notes read boundary-first; changelog is public |

## Critiques rejected (with reasons)

- A user-benefit explainer for the composition paragraph (narrative advocate): conflicted with two density complaints about the same section; density won.
- Further softening of "better than the walled gardens" (adversary): would violate the voice profile's over-hedging ban; it is a stated obligation, not a claimed achievement.
- Residual density note on the browser paragraph: the paragraph carries the piece's most-attacked argument and earns its length.

## Known weaknesses (unresolved by design)

1. **Lambda Prize remains unverified against any ground truth** — kept to one hedged sentence with an explicit "details being confirmed"; confirm with comms before publishing. Node Operator program cut entirely pending the same.
2. The three round-2 fixes had no fresh-critic validation (round cap).
3. Testnet caveats are generic because ground truth has no specific known-issues list.

*Ground truth consulted: `roadmap/content/testnets/v02.md`, `v02-release.md`, `v01.md`, `logos-node-operator-guide.md`; docs.logos.co URL index (llms.txt) — all docs links and the blog link verified live.*
