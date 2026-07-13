# Logos Storage in Testnet v0.2: Hardening the Substrate

**Component:** Storage (formerly Codex)
**Audience:** Infrastructure engineers, privacy engineers, node operators
**Status:** First draft

---

Storage is the module nobody tweets about, and it's also the one that decides whether "decentralised app" means anything. Your smart contracts can be trustless, your messaging can be E2EE, and if the frontend loads from Cloudflare, your app has a kill switch with someone else's name on it. Serve the frontend from decentralised storage or stop claiming the adjective.

So what does Logos Storage do about it, and what changed in v0.2? The short version: the substrate got harder to break and quieter to query.

## Why content addressing

Logos Storage is content-addressed. You store a file, you get a CID derived from the content itself; you present a CID, you get the file, from whichever node has it. The address *is* the integrity check. There's no server to trust because there's nothing a server could lie about: if the bytes don't hash to the CID, they're not the file. Location-independence falls out of the same property, and that's what makes censorship expensive. You can't take down a file by taking down a host when the file's identity has nothing to do with where it lives.

Setup and usage are covered in the docs ([run a storage node](https://docs.logos.co/storage/get-started/run-logos-storage-node), [Storage UI](https://docs.logos.co/storage/get-started/set-up-and-use-logos-storage-ui)), so here I'll spend the words on what the docs don't say: where this is going, and what v0.2 actually moved.

## What shipped

**Anonymity-preserving DHT queries over the mixnet.** Finding content in a p2p network means asking a distributed hash table, and DHT lookups are a fantastic surveillance signal that most storage networks simply ignore. Who is looking for which CID, when, from where. Content can be public while the *interest* in it is sensitive; ask anyone researching something their government dislikes. In v0.2, DHT queries route over the same mix network the rest of the Logos stack uses, so a network observer watching the DHT no longer gets a map of who wants what. It's a PoC, not the final word, but it's the correct first move: metadata privacy for the lookup path.

**A more efficient block protocol.** Files move between nodes as blocks, and the block exchange protocol got architectural improvements aimed at faster, more stable file sharing. Unglamorous, load-bearing.

**Deployed to the testnet as a proper module, with OpenMetrics.** Storage now runs through Logos Core like everything else, and operators get Prometheus-compatible metrics out of it. Same story as the blockchain node in this release: nothing in the stack is a special child anymore.

NAT traversal, for nodes living behind home routers like actual humans have, is landing in v0.2.1. Worth flagging because "works on real residential networks" is the difference between a storage network run by twelve datacenters and one run by everyone.

## The honest part

Time to be honest, because the team's own roadmap is and I like that. Today's file sharing, as shipped, is not privacy-preserving. It looks like an IPFS or BitTorrent client: functional, content-addressed, censorship-resistant at the storage layer, and open about who's publishing and downloading what to anyone watching the network closely. DHT-over-mix is the first piece of a much bigger program.

That program, privacy-preserving file sharing, targets two properties: neither publisher nor downloader identifiable by third parties during query or retrieval, and plausible deniability for cache nodes, who should be able to convincingly deny knowing what content they hold. The design work draws on Tor's hidden services, Tribler's anonymous seeding specs, Freenet's routing lessons, and the internal libp2p mixnet spec. The roadmap even names the uncomfortable truth in the literature: Tribler explicitly disclaims protection against government-grade adversaries, and Tor has a body of published attacks against it. Building this means understanding exactly which compromises those systems made and which ones Logos is willing to make. Performance, privacy, release schedule: pick a balance and own it publicly. Estimated completion for that work is late 2026.

I'd rather have this staging than the alternative. A storage network that claims full anonymity on day one is describing its ambitions, not its properties. v0.2 ships the load-bearing substrate (content addressing, block exchange, testnet deployment) plus the first real metadata privacy primitive, and tells you plainly what it doesn't protect yet.

## Lifecycle position

In the transaction lifecycle framing this series keeps returning to: storage is where the artifacts live. App frontends, shared files, application state. The [blockchain article](logos-blockchain-testnet-v02-draft.md) covered private settlement and the messaging article private coordination; storage is the layer where *retrieval patterns* become the leak. What you read is as revealing as what you send, and DHT-over-mix is the stack starting to close that channel.

If you run a storage node on the testnet, the block protocol changes and metrics are the things to kick. And if you think the privacy-preserving file sharing plan is drawing from the wrong prior art, or you've got operational data on mix-routed DHT latency, holler at me. The design conversation is happening now, which is when input is worth something.

---

*Roadmap sources consulted (strip before publishing): `context/roadmap/content/testnets/v02.md`, `v02-release.md`, `context/roadmap/content/storage/roadmap/filesharing.md`, `privacy-preserving-filesharing.md`.*
