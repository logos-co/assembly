# Basecamp — Content Brief

**Status:** Draft  
**Last updated:** 2026-03-31  
**Prepared by:** NickMolty (AI)  
**Sources:** roadmap repo, assembly repo, press.logos.co Linux article, HackMD repo list

---

## What Is Basecamp?

**Basecamp** is the renamed, evolved version of **Logos App** (previously `logos-app-poc`). The rename happened in March 2026 ([PR #92](https://github.com/logos-co/logos-basecamp/pull/92) in the `logos-basecamp` repo).

Basecamp is the **default launcher and application shell for the Logos stack**. It is a thin executable wrapper around `liblogos` (the Logos Kernel) that:

1. Initialises and starts the Logos Core runtime
2. Detects and loads UI plugins (apps) from installed modules
3. Provides a unified interface where users interact with all loaded modules
4. Surfaces "Simple Apps" for each default module (chat, wallet, filesharing, blockchain explorer)

Think of it as the **launcher and unified surface** of the Logos stack — module-agnostic, composable, and designed to surface whatever capabilities the loaded modules expose. It doesn't do the work itself; it orchestrates the modules that do.

The repo is: [`github.com/logos-co/logos-basecamp`](https://github.com/logos-co/logos-basecamp)

---

## Where It Sits in the Stack

```
┌─────────────────────────────────────────────────────┐
│                  BASECAMP (Launcher)                 │
│  Wallet UI │ Chat UI │ Filesharing UI │ Explorer UI  │
├─────────────────────────────────────────────────────┤
│                     MODULES                          │
│  Blockchain │ Storage │ Messaging │ Accounts │ ...   │
├─────────────────────────────────────────────────────┤
│         NETWORKING (Mixnet + Capability Discovery)   │
├─────────────────────────────────────────────────────┤
│              LOGOS KERNEL (liblogos)                 │
└─────────────────────────────────────────────────────┘
```

Basecamp is module-agnostic. It loads whatever module profile is configured. The *stack composition* is defined by which modules are selected, not by the launcher itself.

---

## Current State (Testnet v0.1 → v0.2 transition)

As of late March 2026, active development on Basecamp is focused on:

- **Package Manager integration:** Basecamp now leverages `logos-package-manager-module` for module/UI-plugin detection ([PR #110](https://github.com/logos-co/logos-basecamp/pull/110)), replacing manual manifest parsing
- **Async UI loading:** UI plugins are being loaded asynchronously for better startup performance ([PR #112](https://github.com/logos-co/logos-basecamp/pull/112), open)
- **Design system adoption:** QML path updated for the new `logos-design-system` ([PR #109](https://github.com/logos-co/logos-basecamp/pull/109))
- **Module interface unification:** Now uses the `logos-module` interface directly rather than `liblogos` ([PR #108](https://github.com/logos-co/logos-basecamp/pull/108))
- **MCP server + integration tests** added ([PR #100](https://github.com/logos-co/logos-basecamp/pull/100))
- **Dev vs. portable package variants** now discriminated ([PR #94](https://github.com/logos-co/logos-basecamp/pull/94))

---

## Roadmap Context

From the official Logos Core roadmap:

| Testnet | Basecamp work |
|---------|---------------|
| v0.1 | Logos App (now Basecamp) provides Simple App UIs; loads modules from GitHub |
| v0.2 | Logoscore Consolidation, improved Developer Journey — Basecamp adopts module-builder, package-manager integration |
| **v0.3** | **Basecamp UX overhaul:** remove QtWidgets MDI → add KDDockWidgets; onboarding + settings encryption; sqlcipher module |
| v0.4 | Decentralized Package Manager |

The v0.3 milestone is where Basecamp becomes a first-class user experience — not just a dev testing surface.

---

## What Basecamp Is Not

- **Not** a wallet or messaging app itself — those are modules it loads
- **Not** the Logos Node (headless server mode; no UI)
- **Not** the Logos Kernel (`liblogos`) — Basecamp wraps it
- **Not** a replacement for the module ecosystem — it's the surface those modules expose themselves through

---

## Design Inspirations (from the Basecamp lead)

Two explicit references shared by the lead developer:

- **[Mist Browser](https://github.com/ethereum/mist)** — Ethereum's early browser/wallet launcher (now deprecated). Mist was the entry point to the Ethereum ecosystem; Basecamp is playing an analogous role for Logos. The ambition is to surpass it in capability and UX.
- **[LeechCraft](https://leechcraft.org/)** — A free, open-source, cross-platform *modular live environment*. Plugin-based architecture where modules provide a browser, IM client, BitTorrent client, RSS reader, media player, package manager — all composable. Philosophically very close to how Basecamp loads UI plugins for Logos modules.

The vision: something more capable than Mist, with the composability of LeechCraft, built on top of a privacy-preserving decentralized stack.

---

## Architecture Direction (from lead, March 2026)

A significant architectural direction is in progress:

**QML-only UI layer, C++ backend in a separate process.**

- UI/Apps (module frontends loaded by Basecamp) will be **QML-only** — providing a more sandboxed, "locked down" surface for module UIs
- The App C++ backend runs in a **separate process** from the UI layer
- This separation improves security posture (a misbehaving UI can't directly access the C++ runtime) and consistency across modules

**Developer implications:** The "easy path" is QML for UI. The goal is that examples, tutorials, and the module-builder all push QML-only as the default, making it the path of least resistance. Modules built this way will Just Work in Basecamp without additional integration effort.

This is still actively being worked on — guarantees about the sandboxing model are TBD.

---

## Key Technical Details (for accurate writing)

| Detail | Value |
|--------|-------|
| Old name | Logos App / `logos-app-poc` |
| New name | Basecamp / `logos-basecamp` |
| Rename PR | [#92](https://github.com/logos-co/logos-basecamp/pull/92) — March 2026 |
| Built with | Qt / QML, C++, Nix |
| Kernel it wraps | `liblogos` |
| Module loading | Via `logos-package-manager-module` |
| UI component library | `logos-design-system` (QML) |
| Languages supported | C++, Rust (SDK), JS (SDK), Nim (SDK) |
| Platforms targeted | Linux, Windows, macOS, Android, iOS |

---

## Narrative Angles

### 1. ~~The OS metaphor~~ — retire this framing ⚠️
The strict "Linux" analogy (Logos = Linux, Basecamp = GNOME/KDE) has been used in published content but the team wants to move away from it. The published press.logos.co article leans on it heavily — future Basecamp-specific content should **not** extend or repeat this framing. Find analogies that stand on their own. The Mist + LeechCraft inspirations (see above) may offer better footing.

### 2. "Your stack, your choice"
Basecamp is module-agnostic by design. The same launcher can run completely different Logos distributions. This is philosophically important — it separates the *experience* from the *infrastructure*, giving builders the freedom to assemble their own distributions.

### 3. The rename story
Logos App → Basecamp reflects a maturation in thinking. The app isn't a PoC anymore — it's becoming the primary surface of a sovereign computing environment. "Basecamp" implies: base of operations, stable ground from which you venture out. Worth unpacking in a launch or changelog post when v0.3 ships.

### 4. Developer onboarding
With module-builder, `metadata.json` as single source of truth, the `lm` CLI, and now package manager integration in Basecamp, there's a compelling developer story: scaffold a module → build it → Basecamp discovers and loads it automatically. This could anchor a developer experience post or tutorial.

---

## Existing Content to Reference

| Piece | Where | Relevance |
|-------|-------|-----------|
| "The Logos Tech Stack: An Operating System for Sovereignty" | press.logos.co | Published anchor — establishes Logos App (now Basecamp) as the launcher. **Note:** heavy Linux analogy throughout; new Basecamp content should not extend this framing |
| Assembly draft: `logos-as-operating-system-draft.md` | assembly repo | Source draft of the above |
| Assembly draft: `logos-core-modular-architecture-draft.md` | assembly repo | Developer-facing deep dive; references "Logos Basecamp package manager" explicitly |
| Testnet v0.1 roadmap | roadmap repo | Technical scope of what Basecamp exposes at v0.1 |
| LogosCore roadmap index | roadmap repo | v0.3 Basecamp milestone details |

---

## Suggested Content Pieces

1. **"Basecamp: The New Name for Logos App"** — short changelog/announcement post when v0.3 ships. Cover the rename, what changed, what's coming.
2. **"Running Your First Module in Basecamp"** — developer tutorial building on the existing tutorial repo work.
3. **"What Basecamp Is (and Isn't)"** — explainer piece for non-technical audiences. Explains the launcher/module separation without leaning on the Linux/OS metaphor.
4. **Basecamp section on build.logos.co** — if the builder hub doesn't already surface Basecamp as the primary way to *run* what you build, it should.

---

## Open Questions

- Is there a public-facing Basecamp landing page or docs page planned? (not currently visible on build.logos.co or logos.co)
- Is "Basecamp" the final marketing name or still internal? (the repo rename suggests it's becoming official)
- Any screenshots / design mockups for v0.3 UX (KDDockWidgets migration) we can use for visual content?
- Positioning relative to the headless Logos Node — when should builders use one vs. the other?
