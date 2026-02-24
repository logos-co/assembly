---
title: "Article: Building on Logos Core — The Modular Architecture and Package Manager"
tags:
  - artifact
  - article
  - logoscore
type: article
status: first-draft
date: 2026-02-10
updated: 2026-02-23
---

## Summary

A developer onboarding article explaining the Logos Core modular architecture through its **5-stage pipeline**: Source Files → Logos Module Builder → Logos Module → Logos Package (LGX) → LibLogos (Core) → Logos App/Terminal (**Build → Define → Distribute → Execute**). Covers how logos-module, logos-liblogos, the multi-language SDKs (JS, Nim, C++), and the package manager work together to let developers build and distribute applications on the Logos stack. **Positioned as the hands-on developer companion** to the [[logos-as-operating-system-draft|"Logos as an Operating System"]] conceptual article (currently in review). The platform has matured significantly: multi-platform CI packaging, wallet/accounts UIs reworked in QML, blockchain module integrated, package manager fetches from GitHub releases, and **Logos Basecamp** (ALPHA v0.1.3) now provides an end-user interface to the full module ecosystem.

## Audience

**Primary:** Application developers who want to build on Logos — desktop/cross-platform devs familiar with C++, JavaScript, or Nim (the unified SDK supports all three with the same API pattern).
**Secondary:** Open-source contributors evaluating the Logos ecosystem, system architects interested in modular p2p frameworks, DevOps engineers interested in headless/server deployment via the `logoscore` CLI.

## Key Angles

### The Pipeline (article structure)
- **The 5-stage pipeline as article backbone**: Source Files → Logos Module Builder (Build) → Logos Module (Define) → Logos Package/LGX (Distribute) → LibLogos Core (Execute) → Logos App/Terminal
- Each stage maps to a section of the article, walking the reader from source code to running application

### Build: Logos Module Builder
- **logos-module-builder**: templates for creating new modules — scaffold with `nix flake init -t github:logos-co/logos-module-builder`
- **Configuration debt reduction**: eliminates `nix/default.nix`, `nix/include.nix`, `nix/lib.nix`; CMakeLists.txt goes from +10/-286 (276 lines removed); Flake.nix goes from +6/-64 (58 lines removed)
- Devs now only define source + dependencies; Flake.nix reduced to `mkLogosModule { src = ./.; configFile = ./module.yaml; }`
- Standardized Nix commands across all modules

### Define: Logos Module
- **Logos Module as abstraction layer**: wraps QT Plugin underneath, but the abstraction means the underlying technology can be swapped out without rewriting module logic — future-proofing architectural decision
- **Logos Module Library**: `LogosModule::loadFromPath(pluginPath)` for loading, `LogosModule::getMethodsAsJson(plugin)` for introspection
- **`lm` CLI tool**: `lm metadata` (name, version, description, author, type, dependencies), `lm methods` (available methods)
- **Unified API pattern across languages — "One Pattern to Rule Them All"**: `logos.<module_name>.<method>(params)` — same pattern in JS, Nim, and C++
- Event handling consistent across SDKs: `logos.chat.onChatMessage` (JS) / `logos.chat.on("chatMessage")` (Nim) / `logos->chat.on("chatMessage", ...)` (C++)

### Distribute: Logos Package (LGX)
- **LGX package format**: `.lgx` files (tar.gz archives) containing `manifest.json` + `variants/` directory with per-platform binaries (e.g., `linux-amd64/libfoo.so`, `darwin-arm64/libfoo.dylib`)
- **`lgx` CLI tool**: `lgx create`, `lgx add` (with variant/file flags), `lgx extract` — exists as both library and CLI
- **`lgpm` package manager CLI**: `lgpm list`, `lgpm search`, `lgpm install` — categories include Accounts, Blockchain, Chat, Management, Protocol, Security, Wallet
- **Multi-platform distribution**: CI actions for building portable libraries and binaries across OS/arch
- Package manager **now fetches packages from GitHub releases**

### Execute: LibLogos Core
- **Process isolation architecture**: modules run in separate processes — a crash in one module does not affect the Core
- **Built-in IPC**: Inter-Process Communication channels between LibLogos Core hub and modules (Chat, Waku, Wallet, etc.)
- Dependency auto-loading via liblogos
- **Headless execution via `logoscore` CLI**: run the core engine without a UI for server/testing environments — flags: `-m` (module directory), `--load-modules` (specify module), `-c` (execute method)

### Logos Basecamp (End-User Application)
- **"Logos is the parallel society. Logos Basecamp is the interface to it."** — Jarrad Hope
- Basecamp is the user-facing application powered by LibLogos backend, currently **ALPHA v0.1.3**
- Provides a **package manager UI** for browsing and installing Logos Core Modules
- Full module catalog: logos-accounts-module, logos-accounts-ui, logos-blockchain-module, logos-blockchain-ui, logos-capability-module, logos-chat-module, logos-chat-ui, logos-irc-module, logos-package-manager, logos-storage-module, logos-waku-module, logos-wallet-module, logos-wallet-ui
- POC Applications: Package Manager, Wallet, Chat, Blockchain Node Manager, Storage
- **UI cleanup**: removed legacy UI modules section from the app POC, macOS traffic buttons now overlay the application window for native look-and-feel

### Existing Modules & Integration
- The design system: unified UI components with primary/secondary text sizes
- **Wallet and Accounts UIs reworked in QML** — real production UI modules
- **Blockchain module integrated** into Logos Core with event emission, Nix C++ code generation, constructor logosAPI crash fix
- Walkthrough: the demo chat app — mix integration, extended-kad-disco, now dogfooding
- How the Nix build system ties it all together (with portability improvements via static linking)

## Sources

### Code — Core Platform
- logos-module API improvements: [logos-module#2](https://github.com/logos-co/logos-module/pull/2), debug output suppression [#5](https://github.com/logos-co/logos-module/pull/5)
- liblogos auto-load dependencies: [logos-liblogos#52](https://github.com/logos-co/logos-liblogos/pull/52)
- liblogos process lifecycle: [logos-liblogos#53](https://github.com/logos-co/logos-liblogos/pull/53)
- liblogos modulePath property: [logos-liblogos#57](https://github.com/logos-co/logos-liblogos/pull/57)
- C++ SDK argument types: [logos-cpp-sdk#10](https://github.com/logos-co/logos-cpp-sdk/pull/10), LogosResult: [#14](https://github.com/logos-co/logos-cpp-sdk/pull/14)
- Design system: [logos-design-system](https://github.com/logos-co/logos-design-system), text sizes [#2](https://github.com/logos-co/logos-design-system/pull/2)

### Code — Packaging & Distribution (NEW)
- Multi-OS/arch package building: [logos-modules#16](https://github.com/logos-co/logos-modules/pull/16)
- Module path corrections: [logos-modules#15](https://github.com/logos-co/logos-modules/pull/15), version bumps: [#14](https://github.com/logos-co/logos-modules/pull/14)
- Portable static library linking: [logos-package#11](https://github.com/logos-co/logos-package/pull/11)
- CI portability checks: [logos-package#10](https://github.com/logos-co/logos-package/pull/10)
- Package manager from GitHub releases: [logos-package-manager-module#25](https://github.com/logos-co/logos-package-manager-module/pull/25)
- Module builder template fixes: [logos-module-builder#3](https://github.com/logos-co/logos-module-builder/pull/3), [#4](https://github.com/logos-co/logos-module-builder/pull/4)

### Code — UI Modules (NEW)
- Wallet UI dependency update: [logos-wallet-ui#6](https://github.com/logos-co/logos-wallet-ui/pull/6), QML rework: [#7](https://github.com/logos-co/logos-wallet-ui/pull/7)
- Accounts UI dependency update: [logos-accounts-ui#3](https://github.com/logos-co/logos-accounts-ui/pull/3), QML rework: [#4](https://github.com/logos-co/logos-accounts-ui/pull/4)
- Blockchain UI submodule: [logos-modules#20](https://github.com/logos-co/logos-modules/pull/20)
- Blockchain module events + Nix codegen: [logos-blockchain-module#6](https://github.com/logos-blockchain/logos-blockchain-module/pull/6), [#9](https://github.com/logos-blockchain/logos-blockchain-module/pull/9), constructor crash fix: [#10](https://github.com/logos-blockchain/logos-blockchain-module/pull/10)
- App POC: removed UI modules section [logos-app-poc#66](https://github.com/logos-co/logos-app-poc/pull/66), macOS traffic buttons overlay [#65](https://github.com/logos-co/logos-app-poc/pull/65)
- Module viewer path fix: [logos-module-viewer#2](https://github.com/logos-co/logos-module-viewer/pull/2)

### AnonComms Integration (Chat Demo — NOW DOGFOODING)
- Demo app doc packet: [logos-docs#173](https://github.com/logos-co/logos-docs/pull/173)
- Demo app dogfooding: [logos-chat-ui testnet demo](https://github.com/logos-co/logos-chat-ui/tree/logos-testnet-demo)
- Mix protocol fixes (delay, crash): [nim-libp2p#2094](https://github.com/vacp2p/nim-libp2p/pull/2094), [#2089](https://github.com/vacp2p/nim-libp2p/pull/2089)
- Capability discovery (fully spec compliant): [nim-libp2p#2103](https://github.com/vacp2p/nim-libp2p/pull/2103)

### Presentation — Logos Team Updates (NEW)
- Video: [Logos Team Updates](https://youtube.com/live/KfPpmQTFPNc) — lead's walkthrough of the full Logos Core architecture (~52 min, Logos Core section at beginning)
- Slides: [Logos Core presentation](https://drive.google.com/file/d/1lOPto2nyh2nwl8Q0bRbaGTQZZmin4nFQ/view?usp=sharing) — 23 slides covering the pipeline from source to execution, module abstraction, LGX format, CLI tools, LibLogos architecture, headless execution, and Logos Basecamp
- *Note: Video transcript pending YouTube processing — update brief with verbal framing once available*

### Reference
- "Logos as an Operating System" draft: `assembly/content/content-tracker/logos-as-operating-system-draft.md`
- Assembly resources — module viewer, package manager, SDK docs: `assembly/content/resources/logos-docs/`
- **First draft**: `assembly/content/content-tracker/logos-core-modular-architecture-draft.md`

## Notes

- This article should explicitly reference and complement the "Logos as Operating System" piece — that one explains the *why*, this one shows the *how*.
- **Use the 5-stage pipeline as the article's structural backbone** — each stage (Build → Define → Distribute → Execute) maps to a section, giving the reader a clear mental model of the full journey from source code to running application.
- The wallet/accounts QML UIs are the first production-quality modules — screenshot them for the article.
- **Screenshot Logos Basecamp's package manager UI** — the module catalog view is a strong visual showing the breadth of the ecosystem (13+ modules across 5 POC apps).
- The module builder templates mean developers can scaffold a new module quickly — include a "create your first module" section using `nix flake init -t github:logos-co/logos-module-builder`.
- **Configuration debt reduction metrics are concrete proof of DX improvement** — 276 lines removed from CMakeLists.txt, 58 from Flake.nix. Use these numbers.
- Multi-platform CI packaging is a maturity signal — Logos Core modules can now be distributed as portable binaries via the LGX format.
- The demo chat app is now being dogfooded internally — real usage, not just a demo. Strong proof point.
- Static library linking for portability addresses the Nix concern from the original brief.
- **Headless execution (`logoscore` CLI) is an important DevOps/testing story** — modules can run server-side without any UI, enabling CI testing and daemon-style deployments.
- **Logos Basecamp as the "why this matters to end users" conclusion** — the Jarrad Hope quote ("Logos is the parallel society. Logos Basecamp is the interface to it.") ties the technical architecture back to the mission.
- **Pending: YouTube transcript** — once the video transcript is available, update the brief with the presenter's verbal framing of the architecture (may differ from or enrich the slide content).
