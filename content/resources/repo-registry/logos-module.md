---
title: logos-module
description: Module interface specification for the Logos runtime
tags: [repo, repo-active, org-logos-co, component-core, audience-dev, lang-cpp]
aliases: [logos-module]
---

| | |
|---|---|
| **GitHub** | [logos-co/logos-module](https://github.com/logos-co/logos-module) |
| **Status** | Active |
| **Org** | logos-co |
| **Language** | C++ |

Defines the module interface specification that all Logos runtime modules must implement. The contract between the microkernel and loadable modules.

## Related repos

- [[logos-liblogos]] — runtime that loads modules conforming to this interface
- [[logos-module-builder]] — scaffolding tool that generates new modules from this spec
- [[logos-cpp-sdk]] — SDK that simplifies implementing this interface
- [[rfc-index]] — formal specification documents
