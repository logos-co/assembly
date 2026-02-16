---
title: "Article: Building on Logos Core — The Modular Architecture and Package Manager"
tags:
  - artifact
  - article
  - logoscore
type: article
status: proposed
date: 2026-02-10
updated: 2026-02-17
---

## Summary

A developer onboarding article explaining the Logos Core modular architecture — how logos-module, logos-liblogos, the C++ SDK, and the package manager work together to let developers build and distribute applications on the Logos stack. **Positioned as the hands-on developer companion** to the [[logos-as-operating-system-draft|"Logos as an Operating System"]] conceptual article (currently in review). The platform has matured significantly: multi-platform CI packaging, wallet/accounts UIs reworked in QML, blockchain module integrated, and the package manager now fetches from GitHub releases.

## Audience

**Primary:** Application developers who want to build on Logos — desktop/cross-platform devs familiar with C++/Qt/QML.
**Secondary:** Open-source contributors evaluating the Logos ecosystem, system architects interested in modular p2p frameworks.

## Key Angles

- Logos Core as a modular application platform: what the "operating system" metaphor means concretely
- The module system: logos-module API, how modules are loaded, dependency auto-loading via liblogos
- **logos-module-builder**: templates for creating new modules, recently improved with override fixes
- The package manager: installing modules, distributed builds, **now fetches packages from GitHub releases**
- **Multi-platform distribution**: CI actions for building portable libraries and binaries across OS/arch
- The C++ SDK: QStringList, QByteArray, QUrl arguments, LogosResult error handling
- The design system: unified UI components with primary/secondary text sizes
- **Wallet and Accounts UIs reworked in QML** — real production UI modules
- **Blockchain module integrated** into Logos Core with event emission, Nix C++ code generation
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
- Portable static library linking: [logos-package#11](https://github.com/logos-co/logos-package/pull/11)
- CI portability checks: [logos-package#10](https://github.com/logos-co/logos-package/pull/10)
- Package manager from GitHub releases: [logos-package-manager-module#25](https://github.com/logos-co/logos-package-manager-module/pull/25)
- Module builder template fixes: [logos-module-builder#3](https://github.com/logos-co/logos-module-builder/pull/3), [#4](https://github.com/logos-co/logos-module-builder/pull/4)

### Code — UI Modules (NEW)
- Wallet UI reworked in QML: [logos-wallet-ui#7](https://github.com/logos-co/logos-wallet-ui/pull/7)
- Accounts UI reworked in QML: [logos-accounts-ui#4](https://github.com/logos-co/logos-accounts-ui/pull/4)
- Blockchain UI submodule: [logos-modules#20](https://github.com/logos-co/logos-modules/pull/20)
- Blockchain module events + Nix codegen: [logos-blockchain-module#6](https://github.com/logos-blockchain/logos-blockchain-module/pull/6), [#9](https://github.com/logos-blockchain/logos-blockchain-module/pull/9)
- Module viewer path fix: [logos-module-viewer#2](https://github.com/logos-co/logos-module-viewer/pull/2)

### AnonComms Integration (Chat Demo — NOW DOGFOODING)
- Demo app doc packet: [logos-docs#173](https://github.com/logos-co/logos-docs/pull/173)
- Demo app dogfooding: [logos-chat-ui testnet demo](https://github.com/logos-co/logos-chat-ui/tree/logos-testnet-demo)
- Mix protocol fixes (delay, crash): [nim-libp2p#2094](https://github.com/vacp2p/nim-libp2p/pull/2094), [#2089](https://github.com/vacp2p/nim-libp2p/pull/2089)
- Capability discovery (fully spec compliant): [nim-libp2p#2103](https://github.com/vacp2p/nim-libp2p/pull/2103)

### Reference
- "Logos as an Operating System" draft: `assembly/content/content-tracker/logos-as-operating-system-draft.md`
- Assembly resources — module viewer, package manager, SDK docs: `assembly/content/resources/logos-docs/`

## Notes

- This article should explicitly reference and complement the "Logos as Operating System" piece — that one explains the *why*, this one shows the *how*.
- The wallet/accounts QML UIs are the first production-quality modules — screenshot them for the article.
- The module builder templates mean developers can scaffold a new module quickly — include a "create your first module" section.
- Multi-platform CI packaging is a maturity signal — Logos Core modules can now be distributed as portable binaries.
- The demo chat app is now being dogfooded internally — real usage, not just a demo. Strong proof point.
- Static library linking for portability addresses the Nix concern from the original brief.
