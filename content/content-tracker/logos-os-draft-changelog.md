---
title: "Changelog: Logos as Operating System Draft"
tags:
  - changelog
  - logoscore
date: 2026-02-19
---

Revision log for the [[logos-as-operating-system-draft|Logos as Operating System]] draft article. Changes based on technical review feedback received via the [VAC forum review thread](https://forum.vac.dev/t/request-for-draft-review-intro-to-logos-tech-stack-and-testnet-v0-1/664).

## 2026-02-19 — Review feedback pass

### Major: Corrected the Logos App / distribution analogy

The original draft positioned the **Logos App** as the "Ubuntu" of Logos — a complete distribution bundling the kernel and modules. Reviewer feedback clarified that this is architecturally incorrect:

- **The "Ubuntu" equivalent is the default module bundle** (Storage + Messaging + Blockchain) — an opinionated configuration that works out of the box.
- **The Logos App is a neutral launcher/shell** — it starts the runtime and loads whatever module profile is configured. It is module-agnostic, not a distribution itself.
- Anyone can assemble their own "distribution" by selecting different modules. The launcher loads whatever is configured.

This correction affected the intro analogy (previously "The Logos App is to Logos what Ubuntu is to Linux"), the Dapps section, and the closing. Language was changed from "bundles the kernel" to "starts the runtime" throughout.

### Major: Fixed "Linux kernel modules" terminology

The original draft compared Logos modules to "Linux kernel modules" that "can be loaded and unloaded." Reviewer pointed out that Linux kernel modules are a specific thing (drivers, filesystem modules) running in kernel space. Logos modules are closer to **user-space daemons/services** managed by something like `systemd`. Changed the analogy to "system services on Linux can be restarted" — consistent with the correct `systemd` comparison already present later in the article.

### Added: Microkernel vs. monolithic kernel distinction

Reviewer asked: "Isn't the networking stack technically part of the kernel?" In a monolithic kernel (Linux), yes. But Logos follows the microkernel philosophy where networking runs outside the kernel. Added an explicit contrast in the Kernel section explaining this design choice.

### Added: Android as a Linux distribution example

Added Android alongside Ubuntu, Arch, and Fedora in the opening paragraph. Android demonstrates how radically different a Linux-based system can look — strengthening the analogy for what's possible on a shared kernel.

### Clarified: Mix-net outbound phase

Added "during their outbound phase" to the mix-net description, specifying that messages are protected by the mix-net during sending rather than implying end-to-end mix-net routing.

### Softened: Networking layer agnosticism claim

The original stated flatly that "the Logos networking layer doesn't care" what modules do above it. Reviewer noted this is true today as a design goal but may need exceptions in the future. Reframed as design intent: "today, it treats all traffic alike" with acknowledgment that "future requirements may introduce protocol-level distinctions."

### Reframed: Audience for "build your own distribution"

The original "you can build your own Linux distribution" was developer-only language. Reframed to address both audiences: "Users choose which modules to run; developers can go further and assemble entirely different distributions."

### Added: Closing reinforcement

Added "Your choice of modules defines your distribution" to the closing paragraph, anchoring the corrected analogy at the end of the article.
