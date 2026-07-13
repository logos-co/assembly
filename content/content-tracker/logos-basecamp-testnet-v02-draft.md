# Logos Basecamp in Testnet v0.2: The Whole Stack, One Window

**Component:** Basecamp (formerly Logos App)
**Audience:** General/privacy-curious users, node operators, developers evaluating the stack
**Status:** First draft

---

Here's a test I apply to every privacy project: how many terminal windows does it take before a normal person is actually using it? For most of this industry the honest answer is "they never get there." The protocols are real, the papers are peer-reviewed, and the user story is a README with fourteen prerequisite steps. We build cathedrals and wonder why nobody comes in.

Basecamp is the Logos answer to that test, and in v0.2 the answer is: zero terminal windows. [Install Basecamp](https://docs.logos.co/basecamp/get-started/install-logos-basecamp), and the full stack (blockchain, messaging, storage, the Logos Execution Zone) is there in one desktop app, including running your own node.

## Why a desktop app, of all things

A desktop distribution sounds almost old-fashioned, so it's worth stating why it's a deliberate architecture call and not nostalgia.

The browser is enemy territory for privacy software. I've written about this before ([Stage 0: your browser has already betrayed you](https://blog.logos.co/article/browser-betrayed-you)): fingerprinting, extension spyware, the fact that every "decentralised" web app still loads its code from someone's server on every visit. Shipping a privacy stack as a web app means building on a foundation that leaks by design.

Basecamp is local-first instead. Your node, your keys, and your data live on hardware you control. When you send a message or a transaction from Basecamp, it goes from your machine into the p2p network through your own modules. There's no hosted gateway watching your queries, no RPC provider logging your address, no intermediary at all. That's the lifecycle argument for this piece: Basecamp is where the transaction lifecycle *starts*, and if step zero routes through someone else's server, the privacy of every later stage is already spent.

One shell for all modules, rather than one app per module, is the other half of the design. Modules compose: the chat app can use storage, the AMM app runs on the LEZ, everything shares the runtime and the mixnet underneath. Ship them as separate apps and you'd get separate processes with separate nodes, duplicated infrastructure, and no composition.

## What's actually in it now

v0.1 Basecamp packaged the stack and proved it launched. v0.2 makes it a place you can do things:

The chat app does E2EE messaging (group chats included, mix routing optional). The file sharing app stores and retrieves through Logos Storage. The LEZ wallet handles native transfers including public-to-private and private-to-public moves, plus creating and transferring custom tokens in both states. There's an LEZ explorer, a blockchain dashboard, and an AMM app running against a real DEX program deployed on the LEZ, alongside oracle and token programs. Every module article in this series describes something you can poke at from Basecamp, today, on a testnet.

The App Manager and refreshed Package Manager are the adoption story: install, update, and remove apps from release repositories through a UI, with proper upgrade-state handling. Combined with the standard module publishing path that landed in [Core](https://docs.logos.co/core/build-modules/install-and-load-a-module-in-logos-basecamp), the third-party story is now end-to-end: a developer publishes a module to a release index, a user adds the repository and installs it. No blessed app store, no gatekeeper.

## Isolation, because apps are strangers

That "no gatekeeper" sentence should make you slightly nervous. If anyone can publish a module, Basecamp is going to run code from strangers. v0.2's security work is aimed exactly there.

UI apps now load their Qt plugins in separate processes, so an app that crashes (or misbehaves on purpose) doesn't take the shell or its siblings with it. The QML sandbox got hardened and auth-token handling for UI backends corrected, which pairs with the runtime-level work in Core (token exchange and caller allow lists on module APIs) to give the same shape of boundary at two layers: the process level for UI code, the API level for modules. This is what an open app model costs. You don't get to skip building isolation; you have to be better at it than the walled gardens, because you can't fall back on review-and-ban.

Full disclosure on maturity: this is testnet software and I'm not going to pretend the sandbox has survived a decade of adversarial attention like a browser's has. What I'll say is the threat model is the honest one (assume apps are hostile) and the v0.2 investment went to the boundaries rather than the demo.

## The operator story

Basecamp also became the front door for infrastructure. Running a node used to mean the CLI (which [still works](https://docs.logos.co/run-a-node/complete-node-blockchain-storage-delivery-modules/run-logos-node-blockchain-storage-delivery), and headless daemon mode is the serious operator path). Now Basecamp can run and manage node modules directly, with the OpenMetrics module exposing everything to Prometheus-compatible tooling. The gap between "curious user" and "node operator" shrank to a few clicks, and shrinking that gap is how a permissionless network actually gets its operators.

For builders, there's the Lambda Prize as an incentive to ship modules and apps on the stack; details are worth their own piece rather than a paragraph here.

If you install v0.2, the thing I most want to hear about is friction: where you got stuck, what wasn't obvious, which app broke first. Send it. Usability reports on testnet software are worth more than praise, and this release is the first one where "just install Basecamp" is a sentence I can say without qualifiers.

---

*Roadmap sources consulted (strip before publishing): `context/roadmap/content/testnets/v02.md`, `v02-release.md`. Lambda Prize and Node Operator program mentioned per messaging framework; confirm scope before publishing.*
