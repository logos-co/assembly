# Logos Basecamp in Testnet v0.2: The Whole Stack, One Window

**Component:** Basecamp (formerly Logos App)
**Audience:** General/privacy-curious users, node operators, developers evaluating the stack
**Status:** First draft, adversarially reviewed (2 rounds; see changelog)

---

Here's a test I apply to every privacy project: how many terminal windows does it take before a normal person is actually using it? Plenty of privacy tools pass it now (Signal, Tor Browser, a good VPN client), but those hand you a client and keep the infrastructure somewhere else. The harder version of the test is passing it with the whole stack, node included, on your own machine. For projects attempting that, the honest answer is usually "they never get there." The protocols are real, the papers are peer-reviewed, and the user story is a README with fourteen prerequisite steps. We build cathedrals and wonder why nobody comes in.

Basecamp is the Logos attempt at the harder test, and in v0.2 the answer is: zero terminal windows on macOS, one `chmod +x` on Linux (AppImages gonna AppImage). [Install Basecamp](https://docs.logos.co/basecamp/get-started/install-logos-basecamp), and the full stack (blockchain, messaging, storage, the Logos Execution Zone) is there in one desktop app, including running your own node.

> **Demo:** [Guru walks through installing Basecamp](https://x.com/hackyguru/status/2075525817682039245).

## Why a desktop app, of all things

A desktop distribution sounds almost old-fashioned, so it's worth stating why it's a deliberate architecture call and not nostalgia.

The browser is enemy territory for privacy software. I've written about this before ([your browser has already betrayed you](https://blog.logos.co/article/browser-betrayed-you)): fingerprinting, extension spyware, the fact that every "decentralised" web app still loads its code from someone's server on every visit. You might object that Basecamp comes from someone's server too, and you'd be right: it's a binary off a release page, and updates re-trust that repository each time you take one. The difference is you take them explicitly, when you choose, and every launch in between runs code already on your disk. A web app re-trusts its server silently on every page load; a compromised server today rewrites the app you run today. That's a real distinction, not a rhetorical one, and it's why local-first is the call even though downloads aren't magic.

Two more browser problems, and they're structural, not incidental. JavaScript itself: every mainstream browser executes whatever script a page hands it, on every visit, because the standard was built for compatibility, not security. A binary on disk gets reviewed once, when you choose to run it; a script re-fetched on each page load gets no review, ever, and you can't diff today's version against yesterday's. That script is frequently there to fingerprint you and phone the result home to a server that profits from the record: the same tracking problem as the browser itself, one layer down in the stack.

Then there's the scale of it. A handful of companies now decide what the web is, and your speech, your money, and your social graph run through infrastructure you don't own and can lose access to without appeal. Chrome, the browser most people run, killed its own replacement for third-party cookies (the Privacy Sandbox APIs) in October 2025 and left the cookies in place, opt-in by default for whoever clicks through the prompt, because the company selling the browser also sells ads against your behavior. A vendor whose revenue depends on watching you isn't going to ship anonymity as the default, and a web built on a handful of platforms isn't built to let you leave.

Local-first means your node, your keys, and your data live on hardware you control. When you send a message or a transaction from Basecamp, it enters the p2p network from your own machine, as a peer. Other nodes relay your traffic, and on testnet your first hop is bootstrap infrastructure the project runs. What no relay gets is the gateway view: a hosted RPC provider sees your queries in the clear and logs which address asked for what, and that log is the thing no later privacy layer can fix. Basecamp is where the transaction lifecycle starts, and a step-zero record tying your identity to your intent stays tied no matter how well the later stages mix.

One shell for all modules, rather than one app per module, is the other half of the design. The obvious alternative is separate apps sharing a local daemon, which is how half of crypto works today (a wallet pointed at your node). That gets you shared infrastructure but leaves every app shipping its own updater, its own auth story, and its own opinion about module versions. The shell solves those once, and it makes composition a first-class thing: the AMM app runs on the LEZ module, the filesharing app runs on Storage, and modules call each other's APIs through one runtime that permissions the calls (Core's token exchange and caller allow lists restrict module API access).

## What's actually in it now

v0.1 packaged the stack with alpha UIs, and alpha meant it: chat required swapping key bundles out of band, and mix routing lived in its own demo app off to the side. v0.2 makes Basecamp a place you can do things:

- **Chat**: E2EE messaging on de-MLS groups, with 1:1 rebuilt as a two-person group (which is what gets you multi-device). Mix routing optional.
- **File sharing** storing and retrieving through Logos Storage.
- **LEZ wallet**: native transfers including public-to-private and private-to-public moves, plus creating and transferring custom tokens in both states.
- **An LEZ explorer, a blockchain dashboard, and an AMM app** running against a real DEX program deployed on the LEZ, alongside oracle and token programs.

All of it testnet software: test tokens, rough edges, things will break. But every item above is something you can poke at from Basecamp today.

> **Demo:** [Guru's general overview of Basecamp](https://x.com/hackyguru/status/2074092719773773957) — chat, storage, and the LEZ wallet in one pass through the shell.

The App Manager and refreshed Package Manager are the adoption story: install, update, and remove apps from release repositories through a UI, with proper upgrade-state handling. Combined with the standard module publishing path that landed in [Core](https://docs.logos.co/core/build-modules/install-and-load-a-module-in-logos-basecamp), the third-party story is now end-to-end: a developer publishes a module to a release index, a user adds the repository and installs it. No blessed app store, no gatekeeper.

## Isolation, because apps are strangers

That "no gatekeeper" sentence should make you slightly nervous. If anyone can publish a module, Basecamp is going to run code from strangers. v0.2's security work is aimed exactly there.

UI apps now load their Qt plugins in separate processes, so an app that crashes (or misbehaves on purpose) doesn't take the shell or its siblings with it. The QML sandbox got hardened and auth-token handling for UI backends corrected, which pairs with the runtime-level work in Core (token exchange and caller allow lists on module APIs) to give the same shape of boundary at two layers: the process level for UI code, the API level for modules. This is what an open app model costs. You don't get to skip building isolation; you have to be better at it than the walled gardens, because you can't fall back on review-and-ban.

Full disclosure on maturity: this is testnet software and I'm not going to pretend the sandbox has survived a decade of adversarial attention like a browser's has. What I'll say is the threat model is the honest one (assume apps are hostile), and the v0.2 release notes read boundary-first: process isolation, sandbox hardening, auth-token fixes, API access restrictions. Judge for yourself whether that's where the effort went; the changelog is public.

There's no dedicated demo for this, but the walkthrough above has a moment where Rahul gets Doom running inside Basecamp, which is as good a proof as any that the app model isn't limited to wallets and explorers. If a shell can run that, the isolation work above is what keeps it from touching anything else.

## The operator story

Basecamp also became the front door for infrastructure. Running a node used to mean the CLI (which [still works](https://docs.logos.co/run-a-node/complete-node-blockchain-storage-delivery-modules/run-logos-node-blockchain-storage-delivery), and headless daemon mode is the serious operator path). Now Basecamp can run and manage node modules directly, with the OpenMetrics module exposing module metrics to Prometheus-compatible tooling. Will click-to-run laptop nodes carry a network by themselves? No; serious operators still need uptime and bandwidth, and that's what the daemon path is for. But a permissionless network needs a supply of people who graduate from curious to operating, and I'd rather recruit them from everyone who installed an app than from everyone who survived a README.

For builders, there's the Lambda Prize, an incentive program for shipping modules and apps on the stack. Scope and details are still being confirmed as I write this, so I'll leave it at: it exists, it targets exactly the publishing path described above, and it'll get its own piece once the details are firm.

If you install v0.2, the thing I most want to hear about is friction: where you got stuck, what wasn't obvious, which app broke first. Send it. Usability reports on testnet software are worth more than praise, and this release is the first one where "just install Basecamp" is a sentence I can say with only one qualifier, and it's a `chmod`.

---

*Roadmap sources consulted (strip before publishing): `context/roadmap/content/testnets/v02.md`, `v02-release.md`, `v01.md`, `logos-node-operator-guide.md`. Lambda Prize mentioned per messaging framework; scope unconfirmed with comms; confirm before publishing.*

*Added per Jonny's request (2026-07-13/14), cross-checked against the "Basecamp Ideology Blog Brief" (Notion) and the "Basecamp v0.2 Article" plan to merge that brief into this draft: ideological-spice paragraphs on JavaScript's execution model and browser/web centralization, completing the brief's four messaging points (native/local and browser-not-neutral were already in the draft). Privacy Sandbox shutdown (Oct 2025) and cookie opt-in default per web search Jul 2026; confirm before publishing.*

*Demo embeds resolved 2026-07-14. Corey confirmed all three of Guru's X posts: [general overview](https://x.com/hackyguru/status/2074092719773773957) (= `basecamp1-final.mp4` from the Drive folder, includes the Doom cameo, no separate Doom clip exists), [install tutorial](https://x.com/hackyguru/status/2075525817682039245), and [LGX format overview](https://x.com/hackyguru/status/2076631857374851179) (a different topic, not used here — may fit the separate "LGX Format and Why" blog on the comms roadmap). Two embeds now in the draft: general overview under "What's actually in it now," install tutorial up top next to the install link.*
