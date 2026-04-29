---
title: "Basecamp: Your Base of Operations on the Logos Frontier"
status: First Draft
date: 2026-04-01
author: NickMolty (AI) — for editorial review
audience: General / ecosystem builders / crypto-curious technical readers
target: press.logos.co
brief: "[[basecamp-brief]]"
---

# Basecamp: Your Base of Operations on the Logos Frontier

Every expedition needs a base of operations. A place that's already equipped — shelter, supplies, communication — so you can spend your time exploring, not building camp from scratch.

That's Basecamp.

Basecamp is the ready-to-run distribution for the Logos stack. Install it and you land on new ground already equipped: the Logos Runtime is running, the core modules are loaded, and a set of applications — wallet, messenger, file sharing, blockchain explorer — are ready to use from day one. You don't have to assemble anything. You're already in.

---

## What Basecamp Actually Is

Basecamp is the launcher and unified surface of the Logos stack. It is an executable that wraps the Logos Runtime and does three things:

1. Initialises the Logos Core environment on startup
2. Discovers and loads UI plugins from whatever modules are installed
3. Presents a unified interface where users interact with everything

That last point matters: Basecamp doesn't *do* the work — it *surfaces* it. The wallet logic lives in the blockchain module. The messaging logic lives in the comms module. The file-sharing logic lives in the storage module. Basecamp is the place all of those show up, consistently, in one place.

Think of it as the launcher you didn't know you needed — the thing that turns a collection of powerful, interoperable modules into a coherent experience.

---

## What You Get Out of the Box

The default Basecamp installation ships with Simple Apps for each core module:

- **Wallet** — for managing accounts and assets on the Logos blockchain
- **Chat interface** — encrypted messaging via the Logos comms layer
- **Filesharing tool** — private, decentralised file storage and sharing
- **Blockchain/LEZ explorer** — inspect the chain, transactions, and execution zones

These aren't separate apps you stitch together. They load from Basecamp's unified shell, using a consistent design system, discovered automatically by the Package Manager.

---

## Module-Agnostic by Design

Basecamp doesn't care which modules are installed. It discovers them, loads their UI plugins, and surfaces them — whatever the configured profile contains.

This is intentional. The stack composition is defined by which modules are selected, not by the launcher. A developer building a specialised Logos distribution can swap the module set entirely; Basecamp loads what's there. One launcher. Many possible stacks.

This composability is where Basecamp draws from its inspirations: the [Mist Browser](https://github.com/ethereum/mist) was an early reference point — an entry-level gateway into an ecosystem — and [LeechCraft](https://leechcraft.org/), a modular live environment where every capability is a plugin. Basecamp's ambition is to go further: composability at the ecosystem layer, built on a privacy-preserving, decentralised foundation.

---

## For Developers: QML Is the Easy Path

Basecamp is also where the module-building story lands. Once you've scaffolded a module with the `lm` CLI and the module-builder tooling, Basecamp is how you actually run it. The Package Manager integration means there's no manual wiring — Basecamp detects your module and loads its UI automatically.

The team is moving toward a QML-only UI layer for module frontends, with the C++ application backend running in a separate process. The practical upshot: if you build your module UI in QML, it works in Basecamp without friction. That's intentional — the examples and tooling are being built to make QML the path of least resistance.

Current support: **Linux and macOS**, with **C++** for module development. Windows, Android, iOS, and additional SDK languages (Rust, JS, Nim) are in active development.

---

## The Road Ahead

Basecamp is currently in active development on the Testnet v0.2 milestone, with Testnet v0.3 marking a significant UX step forward: a new docking widget system (KDDockWidgets), onboarding flows, and settings encryption. That's when Basecamp stops being a developer testing surface and becomes the first-class user experience the frontier deserves.

---

## Start Here

Basecamp is available now for Linux and macOS.

- **Repository:** [github.com/logos-co/logos-basecamp](https://github.com/logos-co/logos-basecamp)
- **Builder Hub:** [build.logos.co](https://build.logos.co)

The frontier is already there. Basecamp is how you get into it.
