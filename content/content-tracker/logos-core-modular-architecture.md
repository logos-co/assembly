---
title: "Article: Building on Logos Core — The Modular Architecture and Package Manager"
tags:
  - artifact
  - article
  - logoscore
type: article
status: proposed
date: 2026-02-10
---

## Summary

A developer onboarding article explaining the Logos Core modular architecture — how logos-module, logos-liblogos, the C++ SDK, and the package manager work together to let developers build and distribute applications on the Logos stack. Includes the demo chat app as a concrete example tying together mix networking, extended Kademlia discovery, and real-time messaging.

## Audience

**Primary:** Application developers who want to build on Logos — desktop/cross-platform devs familiar with C++/Qt/QML.
**Secondary:** Open-source contributors evaluating the Logos ecosystem, system architects interested in modular p2p frameworks.

## Key Angles

- Logos Core as a modular application platform: what the "operating system" metaphor means concretely
- The module system: logos-module API, how modules are loaded, dependency auto-loading via liblogos
- The package manager: installing modules, distributed builds, DMG distribution
- The C++ SDK: QStringList, QByteArray, QUrl argument support, building native modules
- The design system: consistent UI across Logos apps
- Walkthrough: the demo chat app — mix integration, extended-kad-disco, logos-chat-ui
- How the Nix build system ties it all together

## Sources

### Code
- logos-module API improvements: [logos-module#2](https://github.com/logos-co/logos-module/pull/2)
- liblogos auto-load dependencies: [logos-liblogos#52](https://github.com/logos-co/logos-liblogos/pull/52)
- liblogos process lifecycle: [logos-liblogos#53](https://github.com/logos-co/logos-liblogos/pull/53)
- liblogos process stats refactor: [logos-liblogos#51](https://github.com/logos-co/logos-liblogos/pull/51)
- C++ SDK argument types: [logos-cpp-sdk#10](https://github.com/logos-co/logos-cpp-sdk/pull/10)
- Package manager module extraction: [logos-package-manager-module#21](https://github.com/logos-co/logos-package-manager-module/pull/21)
- Package manager UI distributed flag: [logos-package-manager-ui#10](https://github.com/logos-co/logos-package-manager-ui/pull/10)
- Design system: [logos-design-system](https://github.com/logos-co/logos-design-system)
- App PoC design updates: [logos-app-poc#43](https://github.com/logos-co/logos-app-poc/pull/43), [logos-app-poc#50](https://github.com/logos-co/logos-app-poc/pull/50)
- Demo chat UI: [logos-chat-ui#4](https://github.com/logos-co/logos-chat-ui/pull/4)

### AnonComms Integration (for chat demo)
- Mix tag management: [nim-libp2p#2066](https://github.com/vacp2p/nim-libp2p/pull/2066)
- Mix node pool: [nim-libp2p#2067](https://github.com/vacp2p/nim-libp2p/pull/2067)
- Extended Kademlia discovery spec: `rfc-index/docs/ift-ts/raw/extended-kad-disco.md`
- Capability discovery spec: `rfc-index/docs/ift-ts/raw/logos-capability-discovery.md`
- Capability discovery implementation: [nim-libp2p#2055](https://github.com/vacp2p/nim-libp2p/pull/2055)

### Reference
- Assembly doc — Logos as an Operating System: `assembly/content/content-tracker/Logos as an Operating System.md`
- Assembly resources — module viewer, package manager, SDK docs: `assembly/content/resources/logos-docs/`

## Notes

- This is effectively a "Getting Started with Logos Core" piece — should feel inviting, not overwhelming.
- The Nix build story is both a strength (reproducibility) and a hurdle (developer familiarity). Address both honestly.
- The demo chat app is the strongest hook — lead with "here's what you can build" then unpack the architecture.
- Coordinate with the Logos Core team on whether any of the repos need cleanup before driving external attention to them.
