---
title: logos-liblogos
description: Core microkernel runtime for the Logos tech stack
tags: [repo, repo-active, org-logos-co, component-core, audience-dev, lang-cpp]
aliases: [liblogos]
---

| | |
|---|---|
| **GitHub** | [logos-co/logos-liblogos](https://github.com/logos-co/logos-liblogos) |
| **Status** | Active |
| **Org** | logos-co |
| **Language** | C++ |

Core microkernel runtime for the Logos tech stack. Provides module lifecycle management, IPC between modules via Qt Remote Objects, and the host process that orchestrates the modular application architecture.

## Related repos

- [[logos-basecamp]] — primary consumer application built on this runtime
- [[logos-cpp-sdk]] — C++ SDK that wraps liblogos for module developers
- [[logos-module]] — module interface specification that liblogos implements
- [[logos-module-builder]] — scaffolding tool for creating new modules
- [[logos-capability-module]] — capability discovery protocol running on this runtime
