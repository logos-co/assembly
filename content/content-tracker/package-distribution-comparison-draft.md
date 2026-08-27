---
title: "Not a Blockchain: How Logos's Package Manager Stacks Up Against apt, Flatpak, Snap, AppImage, F-Droid, and Nix"
description: "A trust-model comparison of Linux software distribution, and an honest accounting of where Logos's own package manager stands against it."
draft: false
tags:
  - logos
  - basecamp
  - package-manager
  - foss
  - supply-chain
---

## What this is not comparing

Logos Basecamp ships as an AppImage on Linux and a DMG on macOS. If your mental model of this article is "Basecamp versus AppImage," correct it now: Basecamp is a consumer of AppImage, not a competitor to it, and there is nothing to argue about at that layer. The interesting question sits one level in, at how Basecamp gets modules and apps installed once it is already running on your machine. That layer uses a format called LGX, plus a package manager, plus a set of release repositories, and that is the layer this piece actually compares against apt, Flatpak, Snap, AppImage, F-Droid, and Nix.

Six systems, not five. Franck's original list of comparators (apt, Flatpak, Snap, AppImage, and Basecamp) leaves out F-Droid, which is the closest existing analog to what Logos's package manager is reaching for: source-built verification and permissionless-ish repository addition. It also leaves out Nix, which matters because Basecamp's own build tooling already runs on Nix. Both omissions would read as convenient to a FOSS audience checking your work, so both are in.

This piece scores every system against the same five questions, and it scores Logos's own package manager last, on the same grid, dated. Where Logos has not shipped something, that gets stated as plainly as where an incumbent has a documented weakness. A roadmap with an honest gap next to a date is more credible to this audience than a claim without one.

## Five questions, one grid

You judge a software distribution system on five things, and almost every argument about formats is actually an argument about one of these five without saying so:

1. **Trust root.** What does the client verify, and against whose key?
2. **Who may publish.** Gatekept, or open, and enforced by what?
3. **Index freshness.** Can a stale or rolled-back view of the repository be served to you, and would you know?
4. **Confinement.** Once installed, what can the code reach?
5. **Build provenance.** Is what you downloaded verifiably the same thing the source produced?

By the end of this piece you will know, for each of six existing systems and for Logos's own package manager, which of these five questions has a real answer, which has a partial answer, and which has none yet.

## What the incumbents already answer

### apt / dpkg

Debian's own security manual states the boundary of its trust model without hedging: "trusting an archive does not mean that you trust its packages not to contain malicious code, but means that you trust the archive maintainer." apt verifies a signed `Release` file against keys shipped in `debian-archive-keyring`, and it explicitly does not defend against compromise of the signing key itself or the server that holds it. That is question one, answered honestly, by the people who built the system.

Question three has a real gap. The `Valid-Until` field exists in the `Release` file, but per the [Debian repository format spec](https://wiki.debian.org/DebianRepository/Format), "client behaviour on expired Release files is unspecified." apt's actual anti-rollback check is a `Date` monotonicity comparison against the client's own cache, not an archive-wide freshness guarantee.

Question four has no answer at all. apt runs maintainer scripts as root at install time, and nothing sandboxes the resulting application afterward. This is the single biggest liability apt carries into any comparison with Flatpak or Snap, and it is worth stating plainly rather than around.

Question five is improving on a real timeline. Debian's testing branch began blocking package migrations that fail a reproducibility check in May 2026, and the project has stated its intent to make [Debian 14 "Forky"](https://itsfoss.com/news/debian-makes-reproducible-builds-mandatory/) the first major general-purpose distribution to mandate reproducible builds across the board. Independent verification of what actually ships on the mirrors, as opposed to controlled test-lab rebuilds, is a separate and less mature effort.

### Flatpak / Flathub

Flathub's model is structurally different from apt's in one respect worth naming: the artifact you install is built by Flathub, on Flathub's own infrastructure, without network access during the build, from a manifest that went through human review. Sources are validated against checksums declared in that manifest, and the build fails on mismatch. That gives Flathub a real answer to question five that apt does not have in the same form.

Question two has an explicit and narrow exception. Roughly 6% of Flathub apps ship as `extra-data`, meaning the manifest declares a URL and checksum for an existing binary, often proprietary, and the actual download happens at install time from the vendor's own server, outside Flathub's build and review entirely. Flathub's own documentation calls this path "heavily scrutinized" and accepted "only as a last resort," which is the right instinct applied to a real hole.

Question four is where Flatpak's own advocates and critics converge on the same fact: granting `--talk-name=org.freedesktop.Flatpak` to an app is a full sandbox escape, and GNOME's own tooling uses it for exactly that reason. Apps carrying broad `--filesystem=home` or `--filesystem=host` permissions undermine the sandbox in the same way. Flathub reviews permission changes by hand before release, which mitigates the problem without eliminating it. Whether the underlying OSTree index carries rollback or freeze protection comparable to apt's `Date` check is not documented anywhere Flathub has published, and that gap should be stated as a gap rather than assumed either way.

### Snap

Snap's trust root is the strongest single technical fact in this entire comparison, and it is verifiable in one file. snapd ships with a compiled-in, hardcoded trust anchor: exactly one Canonical account and one Canonical root key, in [`asserts/sysdb/trusted.go`](https://github.com/canonical/snapd/blob/master/asserts/sysdb/trusted.go). You can override the store URL snapd talks to with an environment variable, but that does not relocate the trust root. Every assertion snapd accepts, regardless of which server served it, has to chain back to that one hardcoded key. A stock snapd client cannot be pointed at an independently-run store without patching and recompiling snapd itself, and the Snap Store's backend is licensed as Canonical proprietary software.

Question three has a genuinely settled answer that gets misreported constantly. `snap refresh --hold=forever` works, `forever` is the default when you give it no duration, and this has been true since snapd 2.58. The real, still-live constraint is narrower: the `refresh.hold` configuration route caps at 90 days regardless of what you set. Print the correct number if you cite this at all; the 60-day figure that circulates is wrong.

Question four has three disclosed local-privilege-escalation CVEs against snap-confine in the last five years, two of them in 2026: CVE-2026-3888 in March and CVE-2026-8933 in July, both root escalations via race conditions in the sandbox setup path. The second one has a detail worth sitting with: Canonical hardened snap-confine by moving it from a set-uid-root binary to a set-capabilities model specifically to reduce privilege, and that hardening change introduced the race condition that made the escape possible. A security improvement that opened a new hole is a more useful story here than "Snap is insecure," because it is true and specific.

The incident history matters more than the CVEs for this audience, because it demonstrates something the sandbox cannot fix. In February 2024, a snap calling itself "Exodus Bitcoin Wallet" harvested twelve-word recovery phrases through a fake restore dialog, and one confirmed victim lost roughly $490,000 in Bitcoin before it was pulled. The app never touched the host filesystem or escaped confinement. Confinement worked exactly as designed and was irrelevant to the attack that actually happened, because the attack was social engineering wearing a legitimate sandbox. Canonical's response was to move to manual review of new snap name registrations, which is a real fix for a different problem than the one confinement solves.

### AppImage

AppImage has no trust root, by design, and its own documentation does not pretend otherwise. Signing is optional, implemented by shelling out to GPG if you have it configured, and the [official signing documentation](https://docs.appimage.org/packaging-guide/optional/signatures.html) is explicit that displaying a signature is not the same as validating one: "this does not tell you whether the signature is valid or not." Validation requires a separate tool most users never run. Question two does not apply in any meaningful sense, since anyone can host a file and there is no repository to gatekeep. Questions three and five likewise have no answer, because there is no index and no build system in the picture at all. AppImage is the honest floor this comparison starts from, and Basecamp's own Layer-A distribution sits at exactly that floor deliberately: the interesting design decisions happen one layer in, not in how the outer shell gets to your disk.

### F-Droid

F-Droid answers question five in a way nothing else on this list does. It builds every app from source on its own infrastructure, then compares that build byte-for-byte against the developer's own published binary. Where the two match, F-Droid distributes the app under the developer's own signature rather than its own, using a tool called `apksigcopier`. Where an app is not marked reproducible, F-Droid falls back to a dedicated signing key generated on an air-gapped machine per app. Either way, question one has a real answer: you are trusting a build-and-compare process, not a bare assertion of identity.

F-Droid's index format also has something apt does not: the index carries both a timestamp and an explicit expiry, which is a cleaner answer to question three than apt's unspecified-behavior `Valid-Until` field.

The documented weakness is operational, not cryptographic. A 2022 external security review noted F-Droid's build infrastructure ran an end-of-life release of Debian for several months, and separately noted that the air-gapped signing step, precisely because it is air-gapped, requires a human to manually trigger it, which slows down how fast a fix can actually ship. F-Droid published a third-party audit in December 2022 as a direct response, and you should read both if you cite this section, because the critique and the audit are in tension and a reader will check.

The most consequential fact here is not technical. In September 2025, F-Droid stated publicly that Google's new developer-verification requirement for Android, which takes effect for most devices in September 2026, "will end the F-Droid project and other free/open-source app distribution sources as we know them today." Every other row in this comparison is about a trust model. This one is about whether permissionless distribution on a major platform survives contact with a platform owner's policy decision, and it is the sharpest illustration in this piece of a threat none of the cryptography here defends against.

### Nix and Guix

Nix's default addressing scheme is the fact people get wrong most often, so get it right: an input-addressed store path is a function of the derivation that produced an output, not of the output's own bytes. Two byte-identical files built by two different derivations land at two different store paths. The path tells you how something was supposedly built, not what it actually contains, and detecting a compromised builder still requires either a signature from a trusted party or an independent rebuild-and-compare. Nix's [own manual](https://nix.dev/manual/nix/2.28/command-ref/conf-file.html) states the practical consequence directly: a `trusted-users` account can "import unsigned realisations or unsigned input-addressed store objects," which is a documented way to place attacker-chosen bytes at a store path the system otherwise treats as legitimate. Question one, for a default Nix install, comes down to a single signing key at `cache.nixos.org`.

Guix answers a question nothing else in this piece answers at all: what happens when a legitimately authorized party's own repository gets compromised. `guix git authenticate` requires every commit to trace back through a chain of authorized signing keys defined in `.guix-authorizations`, evaluated at each commit's parent, all the way to a fixed introductory commit. Ludovic Courtès, who designed it, states its limit as clearly as anyone in this piece states anything: it defends against a compromised git server or history rewrite, and it explicitly does not defend against a legitimately authorized committer who goes bad, which is the exact shape of the 2024 xz-utils backdoor. Guix's Full-Source Bootstrap takes reproducibility to its logical end, rooting a package graph of more than 22,000 nodes in a 357-byte seed binary, which is the strongest available answer to "how far back does your trust chain actually go" of anything covered here.

## Where Logos actually stands

Score Logos's own package manager on the same five questions, and the honest picture is: two real answers, one partial, two not yet.

Question five, build provenance, has a real answer today. LGX is a deterministic package format: given identical inputs, it produces byte-identical archives, using a USTAR-based layout with Unicode NFC path normalization so the same package hashes the same way on macOS and Linux. Basecamp itself builds through Nix, which puts the reproducibility argument already in the stack rather than bolted on for this article.

Question one is partial. LGX manifests carry a `manifest.sig` field, and a CLI command exists to inspect the raw signature bytes. The format reserves COSE, the CBOR signing standard from RFC 9052, as its intended signing mechanism, but COSE support is a reservation, not a shipped verification path. Delegatable signing chains, the mechanism that would let a publisher's authority be verified independently of Logos's own infrastructure, are stated as a requirement in the package manager's own specification and are not confirmed implemented.

Questions two and three have the same honest answer: today, module distribution runs through GitHub Releases, fetched by a tool called `lgpd`. That is a centralized, single-host trust model, structurally identical to any project that ships binaries through GitHub. Decentralized distribution over Codex or a DHT, with peers re-seeding what they have already downloaded, is explicitly out of scope for the current testnet cycle and tracked for a later one. The package manager's own specification cites the apt-p2p research paper directly and sizes its bandwidth targets against real Debian archive churn, which is a better sign than most decentralization pitches give you: someone read the prior art before designing around it, rather than skipping straight to the pitch.

Question four has a partial, verifiable answer. Modules run in an isolated `logos_host` process, with process-group isolation added mid-2026. UI apps run inside a sandboxed QML engine with a deny-all network manager by default, and network calls have to route through an explicit bridge. That is a real confinement boundary, and it is a narrower one than Flatpak's bubblewrap-plus-portals model, which has years of adversarial history that LGX's confinement has not had yet.

None of the two genuinely novel bets here, byte-identical builds and peer re-seeding, require a blockchain or a token to work. Neither does the third bet, delegatable signing chains, once it ships. That is worth stating directly, because the next section is where the actual "you don't need a blockchain for this" argument gets made, and it is not made by pointing at Logos's own design.

## The case that already exists, and what it does not cover

Three systems already prove you can make misbehavior by a trusted party publicly and retroactively visible without a blockchain, a token, or a consensus protocol. All you need is an append-only Merkle tree, a way to prove a record is in it, and a way to prove the tree has not been rewritten since you last checked.

The Go checksum database at `sum.golang.org` is the cleanest deployed example. It is a Merkle tree of module hashes, backed by Google's Trillian, and the `go` command checks an inclusion proof and a consistency proof before trusting a new line in your `go.sum` file. Go's own description of the guarantee is precise: "a proxy or origin server can't intentionally, arbitrarily, or accidentally start giving you the wrong code without getting caught." Russ Cox, who designed the underlying construction, also states its limit precisely, in ["Transparent Logs for Skeptical Clients"](https://research.swtch.com/tlog): "if a devious server can distinguish individual clients, it can still serve different logs to different clients." A log gives you append-only history from the point of view of a single observer. It does not, by itself, prove two different observers are looking at the same history.

Certificate Transparency ran into exactly that gap and never fully closed it. Split-view attacks, where a malicious log serves different content to different observers, are only detectable through gossip between clients, and the gossip protocol CT needed was drafted, never became an RFC, and was never widely deployed. Academic modeling of what partial gossip deployment would actually catch puts detection at roughly 42% after twenty rounds of comparison, even with aggregation at network intermediaries. Sigstore's Rekor log solves the same class of problem for software artifacts and reached general availability in October 2025, after a redesign whose own announcement post is titled, plainly, "cheaper to run, simpler to maintain." Running one of these at internet scale costs real money, and pretending otherwise does this argument no favors.

The rigorous version of a signed, verifiable package index was specified for PyPI, the Python package index, in 2022, using TUF, The Update Framework. The tracking issue for actually deploying it has been open since February 2022. PyPI shipped a simpler attestation scheme, PEP 740, instead. Rigor lost to deployability, in public, on a multi-year timeline, at one of the largest package registries that exists. That is not an argument against transparency logs. It is an argument against assuming the most rigorous available design is the one that ships.

So: a witnessed Merkle log already gets you most of what a trust-minimized package distribution system needs, at a fraction of the operational cost of a blockchain, and it has already been built more than once. What it does not solve is who gets to publish in the first place, whether anyone is actually watching the log for discrepancies, and non-equivocation across observers without a deployed gossip layer, which remains a real and mostly unsolved gap in every system covered in this piece, including the ones with a decade of production history. That is the honest scope of the argument, and it is a narrower claim than most pitches for decentralized package distribution make. Overclaiming past that scope, in front of this specific audience, is the fastest way to lose the argument you are actually right about.

Read the [LGX format specification](https://github.com/logos-co/logos-package/blob/master/docs/spec.md) and the [package manager milestone tracker](https://github.com/logos-co/logos-workspace/issues/45) if you want the primary sources instead of this summary. Both are public, both are dated, and neither one is finished. Ship the signing chain and the peer distribution before anyone calls this decentralized, because a package format nobody can verify or fetch without trusting one host is just apt with extra steps, and dressing that up as more than it currently is would be bullshit.
