# Building on Logos Core: The Modular Architecture and Package Manager

Every application on the Logos stack follows the same journey. Source code becomes a module. A module becomes a package. A package loads into the runtime. The runtime becomes an application. Understanding this pipeline is the fastest way to go from "what is Logos Core?" to shipping something that runs on it.

This article walks through that pipeline end-to-end — from scaffolding your first module to distributing it through the Logos package manager. If you've read ["Understanding the Logos Tech Stack: An Operating System for Sovereignty"](https://press.logos.co), you already understand the *why*. This is the *how*.

---

## The Pipeline

Logos Core's architecture is a five-stage pipeline. Every module — whether it's the wallet, the chat client, or something you build tomorrow — passes through these same stages:

**Source Files → Logos Module Builder → Logos Module → Logos Package (LGX) → LibLogos Core → Logos App**

Or, more concisely: **Build → Define → Distribute → Execute.**

Each stage has its own tooling, its own CLI commands, and its own concerns. Together they form a complete developer workflow — from writing code to having users install your module through the Logos Basecamp package manager. Let's walk through each one.

---

## Stage 1: Build — The Logos Module Builder

Every module starts with the Logos Module Builder. It's a Nix flake template that scaffolds the build system, dependency management, and configuration for a new module. One command:

```bash
nix flake init -t github:logos-co/logos-module-builder
```

This generates a project with a `module.yaml` configuration file and a minimal `flake.nix`. The key insight is what it *eliminates*. Before the module builder, creating a new module meant maintaining `nix/default.nix`, `nix/include.nix`, `nix/lib.nix`, a sprawling `CMakeLists.txt`, and a complex Nix flake — hundreds of lines of build configuration before you wrote a single line of application logic.

The module builder reduced this dramatically. CMakeLists.txt diffs show +10/-286 — 276 lines removed. Flake.nix diffs show +6/-64 — 58 lines removed. What remains is the minimum:

```nix
mkLogosModule {
  src = ./.;
  configFile = ./module.yaml;
}
```

Define your source files and your dependencies. The builder handles the rest. Nix commands are now standardized across every module in the ecosystem — `nix build`, `nix develop`, `nix flake check` — so the workflow for building the wallet module is identical to building the chat module or any third-party module.

This is configuration debt reduction as a design principle. Less boilerplate means fewer places for builds to break, faster onboarding for new contributors, and a consistent developer experience across the entire module catalog.

---

## Stage 2: Define — The Logos Module

Once your code compiles, the Logos Module Builder produces a **Logos Module** — the fundamental unit of the Logos Core ecosystem.

### The Abstraction Layer

A Logos Module is an abstraction layer over Qt Plugins. This is a deliberate architectural decision: by wrapping the plugin system behind the Logos Module API, the underlying technology can be swapped out without rewriting module logic. Your module code talks to the Logos Module interface, not to Qt directly. If the plugin system changes tomorrow, your module doesn't.

The Logos Module Library provides the programmatic interface:

```cpp
// Load a module from disk
auto plugin = LogosModule::loadFromPath(pluginPath);

// Introspect available methods
auto methods = LogosModule::getMethodsAsJson(plugin);
```

### The `lm` CLI

Every module ships with metadata that the `lm` CLI tool can inspect:

```bash
# View module metadata
$ lm metadata
name: logos-chat-module
version: 0.3.1
description: Chat module for Logos Core
author: Logos Collective
type: service
dependencies: [logos-waku-module, logos-capability-module]

# List available methods
$ lm methods
sendMessage(channel: string, content: string) -> MessageResult
getHistory(channel: string, limit: int) -> Message[]
onChatMessage -> Event<Message>
```

This is more than a convenience tool — it's the foundation for tooling, debugging, and the package manager's dependency resolution. Every module is self-describing.

### One API Pattern Across Three Languages

Logos Core provides SDKs for JavaScript, Nim, and C++. All three follow the same calling convention:

```
logos.<module_name>.<method>(params)
```

In practice:

```javascript
// JavaScript
const result = await logos.chat.sendMessage("general", "hello");
logos.chat.onChatMessage((msg) => console.log(msg));
```

```nim
# Nim
let result = logos.chat.sendMessage("general", "hello")
logos.chat.on("chatMessage", proc(msg: Message) = echo msg)
```

```cpp
// C++
auto result = logos->chat.sendMessage("general", "hello");
logos->chat.on("chatMessage", [](const Message& msg) {
    std::cout << msg << std::endl;
});
```

The naming convention shifts slightly per language — JavaScript uses `onChatMessage` while Nim and C++ use `on("chatMessage")` — but the conceptual model is identical. Learn one SDK and you understand all three. This matters because Logos Core modules are written in different languages: the blockchain module is in Nim, UI modules use C++ with QML, and developer tooling increasingly targets JavaScript. A unified API pattern means these modules compose naturally regardless of implementation language.

---

## Stage 3: Distribute — The Logos Package (LGX)

A compiled Logos Module needs to reach users on different operating systems and architectures. This is the job of the **LGX package format** and its associated tooling.

### The LGX Format

An `.lgx` file is a tar.gz archive with a defined structure:

```
my-module.lgx
├── manifest.json
└── variants/
    ├── linux-amd64/
    │   └── libmy-module.so
    ├── linux-arm64/
    │   └── libmy-module.so
    ├── darwin-amd64/
    │   └── libmy-module.dylib
    └── darwin-arm64/
        └── libmy-module.dylib
```

The `manifest.json` contains module metadata — name, version, description, dependencies — and the `variants/` directory holds per-platform binaries. One package, every supported platform.

### The `lgx` CLI

The `lgx` tool creates and manipulates LGX packages:

```bash
# Create a new package
$ lgx create --name my-module --version 0.1.0

# Add a platform variant
$ lgx add --variant linux-amd64 --file build/libmy-module.so

# Add another variant
$ lgx add --variant darwin-arm64 --file build/libmy-module.dylib

# Extract a package
$ lgx extract my-module.lgx
```

`lgx` exists as both a library and a CLI, so CI pipelines can automate package creation programmatically.

### The `lgpm` Package Manager

End users and developers interact with modules through `lgpm` — the Logos package manager:

```bash
# List installed modules
$ lgpm list

# Search for available modules
$ lgpm search chat
logos-chat-module      0.3.1   Chat module for Logos Core
logos-chat-ui          0.2.0   Chat UI for Logos App
logos-irc-module       0.1.0   IRC bridge module

# Install a module
$ lgpm install logos-chat-module
```

Modules are organized into categories — Accounts, Blockchain, Chat, Management, Protocol, Security, Wallet — reflecting the breadth of the ecosystem. The package manager fetches packages from GitHub releases, making distribution as straightforward as cutting a release on a GitHub repository.

### Multi-Platform CI

The distribution story is backed by CI actions that build portable libraries and binaries across operating systems and architectures. Static library linking ensures that modules built with Nix are portable outside of Nix environments — a critical requirement for adoption, since not every user or deployment target has a Nix installation. CI portability checks validate that packages work correctly on target platforms before release.

---

## Stage 4: Execute — LibLogos Core

With modules built, defined, and packaged, **LibLogos Core** is the runtime that brings them to life. It is the kernel described in the ["Logos as an Operating System"](https://press.logos.co) article — the microkernel that loads modules, manages their lifecycles, and provides the IPC infrastructure for them to communicate.

### Process Isolation

Each module runs in its own process. This is the defining architectural choice of LibLogos Core. A crash in the chat module doesn't take down the wallet. A misbehaving third-party module can't corrupt the blockchain node. The Core is a hub — it starts module processes, monitors their health, and restarts them if they fail.

This is the same philosophy as a microkernel operating system. Just as a crashed printer driver on a microkernel OS doesn't bring down the filesystem, a crashed Logos module doesn't bring down the Core.

### Inter-Process Communication

Modules communicate through built-in IPC channels managed by LibLogos Core. When the wallet module needs to query the blockchain module for a balance, it doesn't call functions directly — it sends a message through the Core's IPC layer. This decoupling means modules can be written in different languages, run on different schedules, and be updated independently.

The IPC architecture also enables dependency auto-loading. When a module declares a dependency on another module, LibLogos automatically loads the dependency first. Install the chat UI module, and LibLogos will pull in the chat module, the Waku module, and any other dependencies declared in the chain.

### Headless Execution

Not every deployment needs a UI. The `logoscore` CLI runs the full LibLogos Core runtime without any graphical interface:

```bash
# Run with a specific module directory
$ logoscore -m /path/to/modules

# Load specific modules
$ logoscore --load-modules logos-blockchain-module,logos-waku-module

# Execute a method directly
$ logoscore -c "logos.blockchain.getLatestBlock()"
```

This enables server-side deployments — validators, infrastructure nodes, CI test environments — where modules run as background services. It's the daemon mode for Logos: the same runtime, the same modules, the same IPC, without a window.

---

## What's Running Today: The Module Ecosystem

The pipeline isn't theoretical. Thirteen modules are built, packaged, and distributed through it today:

| Module | Type | Description |
|---|---|---|
| logos-accounts-module | Service | Account management and identity |
| logos-accounts-ui | UI | Accounts interface (QML) |
| logos-blockchain-module | Service | Blockchain node with event emission |
| logos-blockchain-ui | UI | Blockchain node manager (QML) |
| logos-capability-module | Service | Capability discovery protocol |
| logos-chat-module | Service | Encrypted messaging |
| logos-chat-ui | UI | Chat interface |
| logos-irc-module | Service | IRC bridge |
| logos-package-manager | Management | Package installation and resolution |
| logos-storage-module | Service | Decentralized file storage |
| logos-waku-module | Protocol | Waku relay protocol |
| logos-wallet-module | Service | Wallet and token management |
| logos-wallet-ui | UI | Wallet interface (QML) |

The UI modules — wallet, accounts, blockchain — have been reworked in QML, a declarative language for building fluid, modern interfaces. These aren't placeholder mockups; they're production UI code backed by real module APIs.

The blockchain module integrates directly with the Logos blockchain, emitting events that other modules can subscribe to through the IPC layer. Nix-based C++ code generation automates the binding between blockchain data types and the module's C++ interface, reducing the manual glue code that typically makes blockchain integrations brittle.

The demo chat application — built on the chat module, the Waku module, and the capability discovery protocol — is now being dogfooded internally by the Logos team. It's real usage over a real network, not a conference demo. Mix protocol integration provides network-level privacy for message routing, and capability discovery (fully spec-compliant with the [extended-kad-disco specification](https://lip.logos.co/ift-ts/raw/extended-kad-disco.html#api-specification)) lets nodes find each other without centralized infrastructure.

A unified [design system](https://github.com/logos-co/logos-design-system) provides shared UI components and typography across all modules, ensuring visual consistency as the module catalog grows.

---

## Logos Basecamp: The Interface to It All

> *"Logos is the parallel society. Logos Basecamp is the interface to it."* — Jarrad Hope

Everything described above — the build pipeline, the module abstraction, the package format, the runtime — converges in **Logos Basecamp**, currently in ALPHA v0.1.3.

Basecamp is the user-facing application powered by the LibLogos backend. It provides a graphical package manager for browsing, installing, and managing Logos Core modules. Open the package manager, browse the catalog, install the modules you want, and Basecamp handles dependency resolution, platform-appropriate binary selection, and module lifecycle management.

Five proof-of-concept applications ship with Basecamp today:

- **Package Manager** — browse and install modules from the catalog
- **Wallet** — manage tokens and view balances
- **Chat** — encrypted messaging over the Logos network
- **Blockchain Node Manager** — run and monitor a blockchain node
- **Storage** — decentralized file storage and retrieval

Each application is composed entirely of Logos Core modules running through LibLogos. The wallet app is the wallet module plus the wallet UI module plus the accounts module. The chat app is the chat module plus the Waku module plus the chat UI module. Basecamp doesn't implement these features — it loads the modules that do.

This is the modular architecture made tangible. Users don't need to understand Nix, LGX packages, or IPC channels. They see applications. Developers see a distribution platform for their modules.

---

## Getting Started

The fastest path from zero to a running module:

**1. Scaffold**
```bash
nix flake init -t github:logos-co/logos-module-builder
```

**2. Configure** — edit `module.yaml` with your module's metadata and dependencies.

**3. Build**
```bash
nix build
```

**4. Inspect**
```bash
lm metadata
lm methods
```

**5. Package**
```bash
lgx create --name my-module --version 0.1.0
lgx add --variant linux-amd64 --file result/lib/libmy-module.so
```

**6. Test locally**
```bash
logoscore -m ./result --load-modules my-module
```

**7. Distribute** — push the `.lgx` to a GitHub release, and the package manager picks it up.

The module builder handles the build complexity. The LGX format handles cross-platform distribution. LibLogos handles runtime orchestration. You focus on what your module does.

---

## What Comes Next

Logos Core is in active development. The module builder templates are stabilizing, the package manager is fetching from GitHub releases, and Basecamp provides the first end-user interface to the ecosystem. The blockchain module integration, the QML UI rework, and the demo chat app dogfooding all represent the platform moving from proof-of-concept to production readiness.

The architecture is designed to scale with the ecosystem. New modules plug into the same pipeline. New languages get SDKs that follow the same `logos.<module>.<method>` pattern. New platforms get CI targets and LGX variants. The pipeline stays the same; what flows through it grows.

For developers building on Logos, the path is clear: scaffold a module, define its API, package it for distribution, and let LibLogos handle the rest. The operating system for sovereignty now has a developer experience to match.

---

*This article is the hands-on developer companion to ["Understanding the Logos Tech Stack: An Operating System for Sovereignty"](https://press.logos.co). That piece explains the architecture's purpose — modularity, privacy, and user sovereignty. This one shows you how to build on it.*
