---
title: logos-basecamp
description: Main Logos application that hosts the modular runtime
tags: [repo, repo-active, org-logos-co, component-core, component-ui, audience-dev, audience-community, lang-cpp]
aliases: [basecamp, logos-app]
---

| | |
|---|---|
| **GitHub** | [logos-co/logos-basecamp](https://github.com/logos-co/logos-basecamp) |
| **Status** | Active |
| **Org** | logos-co |
| **Language** | C++ |

The main Logos application (formerly logos-app-poc). Hosts the liblogos microkernel runtime and loads UI modules for chat, wallet, storage, and other features. This is the end-user-facing application that ties the ecosystem together.

## Related repos

- [[logos-liblogos]] — core runtime library this application is built on
- [[logos-chat-ui]] — chat interface module loaded by Basecamp
- [[logos-wallet-ui]] — wallet interface module
- [[logos-accounts-ui]] — accounts/identity module
- [[logos-storage-ui]] — storage/file management module
- [[logos-design-system]] — shared UI components and design tokens
- [[logos-package-manager-module]] — package discovery/installation within the app
