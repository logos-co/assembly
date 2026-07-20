---
title: logos-chatsdk-module
description: Chat SDK integration module for the Logos runtime
tags: [repo, repo-active, org-logos-co, component-messaging, audience-dev, lang-cpp]
aliases: [chatsdk-module]
---

| | |
|---|---|
| **GitHub** | [logos-co/logos-chatsdk-module](https://github.com/logos-co/logos-chatsdk-module) |
| **Status** | Active |
| **Org** | logos-co |
| **Language** | C++ |

Runtime module that integrates the libchat SDK into the Logos module system. Bridges the chat library into the microkernel architecture so UI modules can access chat functionality.

## Related repos

- [[libchat]] — chat SDK this module wraps
- [[logos-chat-ui]] — UI module that consumes this SDK module
- [[logos-liblogos]] — runtime this module loads into
- [[logos-module]] — interface specification this implements
