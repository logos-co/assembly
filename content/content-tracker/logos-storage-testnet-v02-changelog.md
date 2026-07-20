# Changelog: Logos Storage in Testnet v0.2

Record of the adversarial review applied to [[logos-storage-testnet-v02-draft|the storage draft]]. Process: three independent critics (research advocate checking claims against the roadmap repo and docs.logos.co, narrative advocate, adversary) attack the draft in parallel; a synthesizer revises under the author's voice profile; repeat. Two rounds run; effectively converged in round 2.

## Issues found and fixed

| # | Found by | Issue | Fix |
|---|----------|-------|-----|
| 1 | Research advocate, R1 | Draft said NAT traversal "is landing in v0.2.1" — no roadmap file mentions a v0.2.1 release; the label existed only in the comms brief | Reframed to what sources support: package complete (TCP hole-punching transfers landed late June per `storage/updates/2026-06-22.md`), absent from v0.2 release notes, expected in a follow-up release |
| 2 | Research advocate + adversary, R1 (independently) | "A network observer no longer gets a map of who wants what" overclaimed the DHT-over-mix PoC and contradicted the draft's own later admission that retrieval is watchable | Rescoped: PoC, lookup path only, passive observer; retrieval explicitly still visible |
| 3 | Adversary, R1 | The draft conceded the shipped product looks like IPFS but never answered the "why not IPFS?" comparison its audience would make | New paragraph: integration (Logos Core module, Status archival-storage integration) is the shipped answer, the privacy program the promised one, with the explicit concession that "IPFS with extra steps" becomes a fair review if the program slips |
| 4 | Adversary, R1 | Content addressing oversold as censorship resistance; availability ignored | Added the caveat: takedown-resistance is content addressing plus replication, which also gives the NAT traversal section its stakes |
| 5 | Research advocate, R1 | "Late 2026" imprecise; "same mix network" wrong (blockchain uses Blend, not the mix protocol); "most storage networks simply ignore" unsupported sweep; "nothing is a special child anymore" too broad | October 2026 per `privacy-preserving-filesharing.md`; "same mix protocol"; property claim about vanilla Kademlia DHTs; narrowed to the two components the release notes support |
| 6 | Research advocate, R1 | "Architectural improvements" to the block protocol undersold it: the old protocol was known-broken; v0.2 ships a new one | Rewritten as "a new block protocol" with the roadmap's own "broken in many ways" framing |
| 7 | Narrative advocate, R1 | "The honest part" opened by announcing honesty (voice-profile violation); dense privacy-program paragraph; vague operator ask | Section opens with its strongest sentence; paragraph split; ask made concrete (scrape OpenMetrics, hammer large transfers) |

## Critiques rejected (with reasons)

- Cutting the content-addressing section to reach the release notes faster (narrative advocate, R1): rejected; the section now carries the availability caveat the adversary required.
- Softening the lede ultimatum ("serve the frontend from decentralised storage or stop claiming the adjective") (adversary, R2): retained as deliberate stance; the voice profile mandates taking positions, and the adversary itself judged it rhetorical exposure rather than a logical flaw.

## Known weaknesses (unresolved by design)

1. The lede ultimatum is attackable by readers who count ENS+IPFS gateways as adequate; it is an opinion and framed as one.
2. Cross-article links point at content-tracker draft filenames until published URLs exist (publish-time TODO in the draft).
3. "Expect it in a follow-up release" (NAT traversal) is inference from package completion, not a sourced commitment.

*Ground truth consulted: `roadmap/content/testnets/v02.md`, `v02-release.md`, `storage/roadmap/filesharing.md`, `privacy-preserving-filesharing.md`, `storage/roadmap/tracks/v0.1-filesharing.md`, `storage/updates/2026-06-22.md`, `2026-06-29.md`; docs.logos.co URL index (llms.txt).*
