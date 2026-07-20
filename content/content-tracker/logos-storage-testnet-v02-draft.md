# Logos Storage in Testnet v0.2: Hardening the Substrate

**Component:** Storage (formerly Codex)
**Audience:** Infrastructure engineers, privacy engineers, node operators
**Status:** First draft, adversarially reviewed (2 rounds; see changelog)

---

Storage is the module nobody tweets about, and it's also the one that decides whether "decentralised app" means anything. Your smart contracts can be trustless, your messaging can be E2EE, and if the frontend loads from Cloudflare, your app has a kill switch with someone else's name on it. Serve the frontend from decentralised storage or stop claiming the adjective.

So what does Logos Storage do about it, and what changed in v0.2? The short version: the substrate got harder to break and quieter to query.

## Why content addressing

Logos Storage is content-addressed. You store a file, you get a CID derived from the content itself; you present a CID, you get the file, from whichever node has it. The address *is* the integrity check. There's no server to trust because there's nothing a server could lie about: if the bytes don't hash to the CID, they're not the file.

Location-independence falls out of the same property, and that's most of what makes censorship expensive. Most, not all: content addressing means nobody can lie about a file, but somebody still has to hold it. If one node pins the bytes and goes dark, the CID resolves to nothing, ask anyone with a graveyard of dead IPFS links. Takedown-resistance is content addressing *plus* replication, and replication is people actually running nodes. Hold that thought for the NAT traversal bit below.

Setup and usage are covered in the docs ([run a storage node](https://docs.logos.co/storage/get-started/run-logos-storage-node), [Storage UI](https://docs.logos.co/storage/get-started/set-up-and-use-logos-storage-ui)), so here I'll spend the words on what the docs don't say: where this is going, and what v0.2 actually moved.

## What shipped

**Anonymity-preserving DHT queries over mix.** Finding content in a p2p network means asking a distributed hash table, and a vanilla Kademlia DHT hands out a surveillance signal to anyone who asks: who is looking for which CID, when, from where. Content can be public while the *interest* in it is sensitive; ask anyone researching something their government dislikes. In v0.2, DHT queries can route over mix, built on the same mix protocol the rest of the Logos stack builds on, so a passive observer watching the DHT no longer gets the lookup map for free. Scope it honestly: it's a PoC, it covers the lookup path only, and retrieval is still visible (more on that below). But lookups are the cheapest surveillance channel a DHT-based network leaks, and closing the cheap channel first is the correct order.

**A new block protocol.** Files move between nodes as blocks, and the block protocol was one of the known-broken parts of the inherited Codex codebase; the team's own roadmap calls the old one "broken in many ways" and treated the v0.1 fixes as provisional. v0.2's storage module ships an all-new filesharing protocol aimed at robustness and efficiency. Unglamorous, load-bearing.

**Deployed to the testnet as a proper module, with OpenMetrics.** Storage now runs through Logos Core, and operators get Prometheus-compatible metrics out of it. Same story as the blockchain node in this release: one more component that used to be special-cased and now runs like the rest of the stack.

One thing that didn't make the release: NAT traversal, for nodes living behind home routers like actual humans have. The package is done (first file transfers over NATted nodes via TCP hole punching landed in late June), so expect it in a follow-up release. It matters because of the replication point above: a storage network that only runs in datacenters replicates like one. NAT traversal alone doesn't get you a network run by everyone, people still need reasons to keep nodes up, but you don't get there without it.

## The honest part

Today's file sharing, as shipped, is not privacy-preserving. The roadmap says so in as many words: the initial version "should look pretty much like an IPFS/Bittorrent client." Functional, content-addressed, and open about who's publishing and downloading what to anyone watching the network closely. DHT-over-mix is the first piece of a much bigger program. I like that the team writes this down where anyone can read it instead of leaving me to discover it.

Fair question at this point: IPFS already exists, so why run this? Two answers, one of which is still a promise. The shipped answer is integration: storage runs as a Logos Core module, so apps on the stack get content-addressed storage without bolting on an external daemon, and the integration making it an archival-storage option in the Status app just merged. The promised answer is the privacy program below. If that program doesn't land, "IPFS with extra steps" becomes a fair review, and I'll be the one writing it.

The program, privacy-preserving file sharing, targets two properties: neither publisher nor downloader identifiable by third parties during query or retrieval, and plausible deniability for cache nodes, who should be able to convincingly deny knowing what content they hold. Estimated completion is October 2026, with the error bars roadmap dates always have.

The design work draws on Tor's hidden services, Tribler's anonymous seeding specs, Freenet's routing lessons, and the internal libp2p mixnet spec. The roadmap also names the uncomfortable truth in the literature: Tribler explicitly disclaims protection against government-grade adversaries, and Tor has a body of published attacks against it. Building this means understanding exactly which compromises those systems made and which ones Logos is willing to make. Performance, privacy, release schedule: pick a balance and own it publicly.

You could argue for a third path: ship nothing until the privacy design is settled. The roadmap's own risk table takes that seriously, flagging the chance that building filesharing first means discovering you need a different protocol altogether. I still take the staging as shipped. A working substrate generates the operational data the privacy design needs, and a storage network that claims full anonymity on day one is describing its ambitions, not its properties.

## Lifecycle position

This series reads the Logos stack through the lifecycle of a transaction: the [blockchain article](logos-blockchain-testnet-v02-draft.md) covered private settlement, the [messaging article](logos-messaging-testnet-v02-draft.md) private coordination, and storage is where the artifacts live. App frontends, shared files, application state. It's also the layer where *retrieval patterns* become the leak: downloading the protest-organizing kit says as much about you as publishing it, and DHT-over-mix is the stack starting to close that channel.

If you run a storage node on the testnet, kick the new block protocol and the metrics: scrape the OpenMetrics endpoint with Prometheus, hammer some large transfers, and tell me where it falls over. And if you think the privacy-preserving file sharing plan is drawing from the wrong prior art, or you've got operational data on mix-routed DHT latency, holler at me. The design conversation is happening now, which is when input is worth something.

---

*Roadmap sources consulted (strip before publishing): `context/roadmap/content/testnets/v02.md`, `v02-release.md`, `context/roadmap/content/storage/roadmap/filesharing.md`, `privacy-preserving-filesharing.md`, `context/roadmap/content/storage/roadmap/tracks/v0.1-filesharing.md`, `context/roadmap/content/storage/updates/2026-06-22.md`, `2026-06-29.md`.*

*Publish-time TODO: replace the blockchain/messaging article links with their published URLs.*
