# Not a Blockchain: How Logos's Package Manager Stacks Up Against apt, Flatpak, Snap, AppImage, F-Droid, and Nix

**Component:** Logos Core / Package Manager (LGX) — with Basecamp as the delivery vehicle
**Audience:** FOSS/HN-adjacent skeptics who read "blockchain" and expect snake oil
**Status:** Brief — substrate complete, prose not started
**Origin:** Franck (lead of ecosystem dev engineering), Slack, 2026-08-13: "a comparison article
of basecamp vs appimage vs flatpak vs ubuntu snap vs apt. Would be a good approach for FOSS
community that see blockchain as snake oil."

## The framing correction the brief needs before drafting

Basecamp already ships *as* an AppImage (Linux) / DMG (macOS) — so "Basecamp vs AppImage" as
literally posed is a category error, and a sharp reader catches it in the first comment.
Two layers, both need naming up front:

- **Layer A — how you get Basecamp itself.** AppImage / DMG / `nix build`. Not a competition;
  Basecamp is a consumer of AppImage here, nothing to argue.
- **Layer B — how you get modules and apps *into* Basecamp.** LGX format + Package Manager +
  release repositories. This is the actually-comparable layer.

Added two comparators beyond Franck's list because omitting them is the first gap an informed
reader would flag: **F-Droid** (closest existing analog — source-built, reproducible-build-backed
signing, permissionless-ish repo-by-URL) and **Nix/Guix** (Basecamp's own build tooling *is*
Nix — the reproducibility axis is already in the stack, should read as a strength already
present, not a case built from scratch).

## Angle

The honest version of this piece is not "Logos beats the incumbents." It's: here's what a
serious take on software supply-chain trust actually requires (trust root, confinement,
update/rollback, reproducibility, incident history), here's how each incumbent format scores
against that bar — leading with each one's own maintainers'/community's stated weak point, not
Logos's framing of it — and here's where LGX/Package Manager actually stands today, dated and
undersold rather than oversold. For this audience, a dated roadmap with concessions outperforms
a claim. The piece's sharpest move is the transparency-log section: Certificate Transparency,
Sigstore/Rekor, and the Go checksum database already prove you don't need a blockchain to make
misbehavior publicly, retroactively, undeniably visible — name that precedent, concede exactly
what it doesn't solve (who's trustworthy to sign in the first place; nothing prevents an attack
*before* it's logged), and only then explain what Codex/DHT is actually for (distribution cost
and censorship-resistance — a different axis, not a substitute).

## Why designed this way / privacy-security role / what's different — the three questions

Per the module-article rationale-layer requirement, even though this is a comparison piece:

1. **Why designed this way:** determinism-by-construction (LGX byte-identical builds via Nix)
   and p2p re-seeding (peers contribute downloaded packages back to the network, prior art is
   apt-p2p — the FURPS spec cites it directly, this isn't claimed as novel) are engineering
   choices with citable prior art, not ideology.
2. **What it enables for privacy/security:** a supply chain a reader can audit end-to-end —
   deterministic builds mean "what you got is checkable against what was submitted," which is
   the same property F-Droid's reproducible-build model and Guix's `guix git authenticate`
   both reach for from different angles.
3. **How is it different/novel:** honestly, not very, yet — and the piece should say that. The
   novel claim is p2p re-seeding as the default distribution mode once Testnet v0.4 ships;
   today it's GitHub Releases, same trust model as any GitHub-hosted project.

## Structure skeleton

1. Cold open: name the layer-split immediately.
2. The grid every format gets scored on — trust root, confinement, update/rollback,
   reproducibility, incident history — set up before scoring anyone.
3. Walk the incumbents (apt → Flatpak → Snap → AppImage → F-Droid → Nix/Guix), one weak point
   each, in their own maintainers'/communities' words where possible.
4. LGX/Package Manager on the same grid, dated, v0.2-vs-v0.4 stated plainly.
5. The transparency-log section — CT/Sigstore/`sum.golang.org` as the real "don't need a
   blockchain" argument, then what Codex/DHT is for that a log isn't.
6. Close: invitation to critique — live roadmap item, not a finished claim.

## Objections to pre-empt

- "You're comparing a testnet roadmap to shipped software." Concede directly — apt/Flatpak/Snap
  have 10-20 years of adversarial history, LGX has none; the fair comparison is design intent
  against dated prior art, said as much in the opening.
- "Module signing isn't done yet." True — `manifest.sig` exists, delegatable signing chains
  don't. Say the exact status.
- "Distribution is centralized on GitHub today." True — say it, with the Testnet v0.4 date for
  Codex/DHT attached.
- "Isn't p2p re-seeding just BitTorrent/apt-p2p?" Yes — name it as the prior art, not novelty.

## Facts and sources — do not re-derive, the substrate is already built

Full fact base, citations, UNVERIFIED flags, and a corrections section (widely-repeated claims
that turned out wrong) live in this repo's private working material:
`ideas/linux-software-distribution-substrate.md` (compiled 2026-08-10, extended 2026-08-13).
That file is the source of truth for every claim in this brief — pull specific citations from
there when drafting rather than re-searching.

Before drafting, resolve the two items its own checklist (§13) flags as highest-risk:

- **Verify the "Core's token exchange and caller allow lists restrict module API access" claim**
  — it's in the published Basecamp v0.2 draft but wasn't found in `context/docs` or
  `context/roadmap`. Confirm with the Core team before reusing it here; don't launder an
  unverified claim from one draft into another.
- Confirm current snapd `--hold` auto-update semantics haven't drifted since the substrate's
  research date.

Logos-side facts (LGX format, distribution status, signature status, confinement) are in the
substrate's §14, sourced from `context/roadmap/content/logoscore/` and
`context/docs/docs/core/build-modules/` — cross-referenced there, not repeated here.

## Open questions

- Publication target: blog post, forum.logos.co research post, or tweetstorm scale? Affects how
  much of the substrate's fact base survives into the draft.
- Does this go through Jonny for the module-article rationale-layer review, same as the v0.2
  series, or run as a standalone comms piece since it's not part of that series?
