# The Dispersive Medium
### How platform infrastructure dissolved civil society's coherence — and what it would take to restore it

---

I want to start with a claim that sounds like physics, because it is physics, and because the physics turns out to matter.

The difference between a signal and noise is not energy. It's not volume, or intent, or numbers. A coherent signal and an incoherent one can carry identical amounts of energy — the same people, the same passion, the same righteous anger. What separates them is something more subtle and, once you see it, more devastating: phase relationships. Whether the components of a system are locked together in a way that makes their contributions reinforce rather than cancel.

In physics, a wave packet — a localized burst of energy capable of carrying information across a medium — is not defined by any single frequency it contains. It's defined by the relationships between all of them. Destroy those relationships and the packet disperses. The energy doesn't go anywhere. The frequencies are all still present. But the signal loses its shape. It bleeds out into background noise, and you can no longer distinguish it from everything else.

Here is the thing about dispersion that most people don't know: it doesn't require anything to go wrong. There's no external force, no disruption, no bad actor. In any real medium, different frequencies travel at slightly different speeds. Given enough time, a packet that starts sharp will spread. This is the default state. Coherence is the thing that requires explanation.

Civil society is a wave packet. And for the last two decades, it has been dispersing. Not because the people disappeared, or the energy left, or the desire to organize evaporated. Because the medium changed.

You can watch it happen. Figure 1 below shows a wave packet in three states: dispersing, phase-locked, and soliton. Toggle between them. The dispersing mode is the default — the energy is all there, but the phase relationships drift and the packet spreads into noise. The phase-locked mode holds its shape because the components reinforce. The soliton holds its shape for a deeper reason — a structural property of the medium itself. Keep that distinction in mind. We'll come back to it.

---

## What coherence looked like

The space between the individual and the state — the space where communities actually form, where trust is built, where coordination happens below the level of power — has always depended on infrastructure. Not in a romantic sense. In a literal, technical sense: the physical and institutional substrate through which people communicate, coordinate, and remember.

For most of human history, that infrastructure was either community-owned or at minimum not adversarially controlled. The printing press was expensive, but once in your hands it was yours. Parish records were held by the parish. Letters were private by default — not private because a corporation decided to extend that privilege, but private because physical interception was costly and visible. The town square required no terms of service. An underground newspaper required only paper, a typewriter, and people willing to pass it hand to hand.

This matters because distributed infrastructure produces something specific in physics terms: a roughly flat dispersion relation. In a medium with a flat dispersion relation, all frequencies travel at the same speed. The phase relationships hold. A packet that forms stays sharp. Different kinds of communities, different rhythms and concerns and languages, can maintain their coherence simultaneously without one being systematically advantaged over another.

You can see what this looked like in practice when you look at its most extreme form: the samizdat networks of 1970s Czechoslovakia.

Václav Benda, mathematician, Roman Catholic, and Charter 77 signatory, understood the infrastructure problem with unusual clarity. Writing in 1978, in an essay that circulated as a handwritten and typed manuscript passed from apartment to apartment — distributed, by necessity, in the medium most resistant to state capture — he argued that moral dissent alone was insufficient. "An abstract moral stance," he wrote, "is merely a gesture; it may be terribly effective at the time, but it cannot be sustained for more than a few weeks or months." What was needed was not better arguments made through existing channels. What was needed was parallel infrastructure: parallel education, parallel culture, parallel communication networks, a parallel economy of trust.

The genius of samizdat was precisely its technical properties. No central exchange point. No single node that could be shut down. No algorithm mediating who received what based on engagement metrics. By mid-1989, H. Gordon Skilling estimated fifty to sixty typewritten journals were in circulation, covering drama, history, economics, literature, philosophy. The physical distribution mechanism — the thing that looked like weakness — was actually the source of its resilience. You couldn't take it down because there was nothing to take down. The medium had no chokepoint.

Benda called this project the Parallel Polis. His fellow dissident Václav Havel would later become its most famous voice, though Havel's analysis operated at a different register: not infrastructure, but compliance. In "The Power of the Powerless," written the same year, Havel described a greengrocer who places a slogan among his carrots and onions. The slogan was delivered from headquarters along with the vegetables. He doesn't believe it. But he displays it. And in displaying it, he becomes a small structural element of the system's reproduction. The sign in the window carries a message independent of its semantic content: *I can be depended upon. I am beyond reproach. I am obedient and therefore I have the right to be left in peace.* When the greengrocer stops displaying the sign, Havel writes, "he has not committed a simple, individual offense, but something incomparably more serious. By breaking the rules of the game, he has disrupted the game as such."

Both men were describing, from different angles, the same phenomenon: **the medium is the message**. Not as aphorism, but as mechanism.

---

## The capture

Marshall McLuhan said it in 1964. He meant it literally. It's not just what travels through the infrastructure that matters — it's the infrastructure itself that shapes what can be said, who can say it, who can hear it, and what happens to them when they do.

Consider what happened on the night of January 27, 2011.

Egyptian activists had spent months building coordination across platforms they did not own or control. The "We Are All Khaled Said" Facebook page, created anonymously by a Google marketing executive named Wael Ghonim, had grown to over 350,000 followers before January 25 — eventually surpassing three million. A University of Washington study found that tweets about political change in Egypt jumped from roughly 2,300 per day to 230,000 per day in the week before Mubarak's resignation. The platforms had functioned as coordination infrastructure in a way that impressed and excited almost everyone who observed it. Clay Shirky, writing in *Foreign Affairs* that same month, made what seemed at the time like a reasoned case for social media as "a prime vector for political change." The platforms had lowered the transaction costs of collective action. The signal was strong and sharp.

Then, at 22:12 UTC on January 27, the Egyptian government made a phone call. Then another. Then another. Over a thirteen-minute window, five internet service providers — Link Egypt, Vodafone, Telecom Egypt, Etisalat, Internet Egypt — withdrew approximately 3,500 BGP routes. Ninety-three percent of all Egyptian networks went dark. Jim Cowie, the CTO of network intelligence firm Renesys, described the aftermath with a precision that lands differently now than it did then: "There's no way around this with a proxy. There is literally no route. It's as if the entire country disappeared."

The mechanism was simple. Engineers at each ISP accessed their routers and deleted IP address lists. The entire communication infrastructure of a nation of eighty million people had been built through four major providers sharing a single main exchange point. One phone call per company. Thirteen minutes.

This is dispersion in its most acute form: not a gradual spreading of phase relationships, but an instantaneous severing. The packet didn't blur — it was switched off. And the reason it could be switched off was structural, not political. The infrastructure had a chokepoint. It always does when it's centralized.

The government had discovered, as Evgeny Morozov had predicted it would — in a book published that same month, which nobody wanted to read — that the internet's architecture was not inherently emancipatory. It was infrastructure. And infrastructure can be captured. "Those who were convinced of the Internet's liberating powers did not predict," Morozov wrote, "how useful it would prove for propaganda purposes, how masterfully dictators would learn to use it for surveillance, and how sophisticated modern systems of Internet censorship would become."

He was right. Vodafone's post-crisis statement confirmed what everyone suspected: the shutdown was not a technical failure but a direct order, executed under emergency powers, after which the same infrastructure was used to distribute pro-government SMS messages to the same population it had just silenced. The activist network that had spent months achieving phase-lock was dispersed in thirteen minutes. The same medium that had carried the signal dissolved it.

Egypt is the legible version of the story because it happened fast and visibly. The slower version is happening everywhere, continuously, and is much harder to see.

Facebook's average organic page reach declined from roughly sixteen percent in 2012 to under two percent by 2022. For the activist or community organization, this means a page that once reliably reached one in six followers now reaches one in fifty. A 2025 academic study found reactions to news content on the platform declined by seventy-eight percent between 2021 and 2024. The platform's chief financial officer noted on an earnings call, with a candor that deserves a longer look, that "organic distribution of an individual page's posts" would "gradually decline over time." This was presented as normal. It is, in the specific technical sense, a change to the dispersion relation of the medium. Your community is still there. The frequencies are all still present. But the platform now determines at what speed they travel — and it has set that speed, for you, much slower than for the advertiser.

Figure 2 lets you see what this means for a real audience. Set your follower count, pick the year you started building, and watch the algorithm's cut. The decay curve is not a bug or a temporary condition — it is the dispersion relation of the medium you chose to build on.

The Myanmar case is where the logic of this arrives at its most terrible conclusion. When mobile data prices dropped from roughly a thousand dollars per SIM card to about a dollar in early 2014, Facebook became, for approximately twenty million people, synonymous with the internet itself. The UN Fact-Finding Mission would later conclude that Facebook played a "significant" — its chair would later say "determining" — role in the genocide of the Rohingya that followed. Meta's own commissioned assessment admitted the platform was "not doing enough to help prevent our platform from being used to foment division and incite offline violence." The algorithm that had been tuned for engagement amplified the content most likely to generate reactions — and the content most likely to generate reactions in a context of ethnic fear was the content calling for violence. The medium did not need to be malevolent. It needed only to optimize for something other than the community's coherence. The dispersion — of Rohingya life, of social fabric, of the possibility of peaceful coexistence — followed from the architecture.

Then there is the subtler mechanism, the one that works before any particular community forms.

After Edward Snowden's disclosures in June 2013, researchers began measuring something they called the chilling effect. Jon Penney found an immediate drop of roughly twenty percent in Wikipedia traffic to terrorism-related articles — a change in the secular trend that persisted. Alex Marthews and Catherine Tucker analyzed Google search behavior across eleven countries and found significant declines in searches on topics flagged as sensitive to government attention. PEN America surveyed over five hundred American writers and found a quarter had curtailed social media activity; a sixth had self-censored on topics they would otherwise have addressed. Bruce Schneier estimated that approximately 706 million people worldwide changed their online behavior following the Snowden revelations.

The most direct evidence for what this means for coordination came from qualitative research in Uganda and Zimbabwe, where activists described in precise terms what happens when you know or suspect you might be watched. "I think just increasing the level of distrust is enough to ensure that there isn't an effective offline movement," one participant said. Another: "You become secretive. You have to disguise your objectives, your movements. That disrupts your ability to organize, to coordinate." A third: "Requiring a 'chain of trust' before mobilization will negatively affect a group's potential mass appeal, limiting participation to a select few."

This is phase-lock failing to form. Not because anything visible happened to anyone. Because the medium had been structured such that the cost of coordination — the exposure, the risk, the uncertainty — was high enough that trust couldn't crystallize. The packet never coheres. It disperses before it forms. The Stasi, which had roughly one informant per sixty-three citizens at its peak, understood this as a management principle: you don't need to punish everyone. You only need to make people uncertain about who is watching. Research on reunified Germany found that higher historical spy density still predicted lower interpersonal trust, lower institutional trust, and lower incomes more than two decades after the Wall came down. The dispersion of phase relationships outlasts the mechanism that produced it by a generation.

And then there is memory.

A 2024 Pew Research study found that twenty-five percent of all webpages that existed between 2013 and 2023 are no longer accessible. From 2013 specifically, thirty-eight percent are gone. Figure 3 checks the sources cited in this very article, live, in your browser — you can watch the results come in. The Harvard Law School found that nearly half of URLs in published US Supreme Court opinions no longer produce their originally cited content. In 2019, MySpace confirmed that over fifty million songs by fourteen million artists — twelve years of recorded independent music — had been lost in a server migration. One in three links in Wikipedia articles leads nowhere. GeoCities, which once housed thirty-eight million user pages, was shut down by Yahoo in 2009; a volunteer rescue operation saved roughly one million accounts before the deadline. The Internet Archive — one organization, running on donations, responsible for the primary safety net against digital amnesia for the entire English-speaking world — was successfully attacked in October 2024, exposing thirty-one million user records and taking the site offline for days.

Civil society's memory is stored on servers it doesn't own, in formats it doesn't control, subject to retention policies it never agreed to and cannot negotiate. When Tumblr changed its content policy in December 2018, monthly traffic dropped by a hundred and fifty million visits within three months. Sixty-four percent of LGBTQ people between sixteen and thirty-five had used the platform; research found that use among queer users was more than halved. The community didn't die because of external pressure. It died because a platform updated its terms. The medium changed. The community dispersed.

---

## The energy didn't go anywhere

This is the point that gets missed, and it's important enough to dwell on.

Every movement that got de-platformed, every community that watched its organic reach throttled to noise, every organizing effort that collapsed because the coordination channel was surveilled or shut down — those people didn't stop caring. The desire to organize, to resist, to build, to remember didn't disappear. The grief and the anger and the solidarity were still there. They are still there.

What dispersed was the phase relationship between them.

This matters because it changes the diagnosis — and therefore the prescription. If the problem were energy, the solution would be more energy: more people, more passion, more effort on the same platforms, better content, stronger messaging. Build a bigger audience on Instagram. Optimize for the algorithm. Get verified. Find workarounds.

But you cannot solve a dispersion problem by adding energy to a dispersive medium. The packet spreads regardless. The SNR stays the same. Amplifying a signal that has already lost its phase relationships gives you a louder version of noise.

Zeynep Tufekci, in *Twitter and Tear Gas*, described this with the precision of someone who had watched it happen repeatedly. Networked movements can organize a march in days that would have taken the civil rights movement months to plan. But the civil rights movement "progressed through multiple major tactical innovations, from bus boycott to sit-ins to freedom-rides" across a decade. Networked movements, by contrast, tend to "pull off a spectacular action, but are unable to change tactics along the way." The platform becomes the organizational form. Its affordances become constraints. What looks like the movement's strength — its speed, its viral reach — is also its fragility, because the infrastructure that amplified it can change its terms at any moment, and the movement has no fallback.

This is Tufekci's "tactical freeze." It's Ghonim's revolution that ousted Mubarak and then couldn't hold its coordination together long enough to determine what came next. It's every activist organization that spent years building a Facebook following, only to have its reach cut to two percent when the algorithm changed. The energy was real. The coherence was borrowed from infrastructure they didn't own.

Havel understood the mechanism from the other direction. The greengrocer doesn't display the slogan because he agrees with it. He displays it because the medium of his daily life — his shop, his suppliers, his customers, his position in a system he cannot exit — has been structured such that compliance is the path of least resistance. The sign in the window isn't ideology. It's infrastructure compliance. And accepting the platform's terms of service, building your community's coordination on infrastructure you don't control, structuring your organization's memory in formats that belong to someone else — these are the contemporary versions of the sign in the window. Not because you endorse the surveillance or the algorithmic throttling or the unilateral policy changes. But because the medium is available and free and where everyone already is, and the cost of non-compliance is invisibility.

The medium is the message. Not as aphorism. As mechanism.

---

## What a different medium looks like

In 1978, Benda was not arguing for cleverer dissent. He was arguing that the form of the infrastructure determined what was possible. He proposed six domains for parallel institution-building: civic monitoring, culture, education, information, economy, politics. The first requirement of each was the same: that it exist outside the system's medium. Not reform of the medium. Not better use of the medium. A different medium entirely.

The Paralelní Polis that opened in Prague's Holešovice district in 2014 — founded explicitly in Benda's name, housing the world's first bitcoin-only café alongside a hackerspace and an Institute of Cryptoanarchy — understood this connection directly. Pavol Lupták, one of its founders, described it plainly: "Benda's vision can be achieved on the internet with crypto-anarchist technologies." The argument was structural: what the dissident samizdat networks achieved through physical distribution and personal trust, cryptographic infrastructure achieves through mathematics. Private by physics, not by policy. Decentralized by architecture, not by aspiration.

This is what a change to the dispersion relation of the medium actually looks like.

Civil society has three dependencies it cannot afford to outsource. Three things that, if captured, change the dispersion relation of the medium. Communication — how it speaks, organizes, dissents. Coordination — how it agrees, transacts, builds binding commitments. Memory — how it persists, records, and remembers across time. Capture any one of them and you've handed someone else a dial that controls how fast your signal spreads into noise.

The sovereign answer to each is structural, not technical in the narrow sense. Communication private by physics rather than policy — where end-to-end encryption is a property of the protocol, not a feature a platform can revoke. Coordination grounded in verifiable consensus rather than institutional trust — where an agreement is enforced by mathematics rather than by a platform's willingness to honor it. Memory distributed across infrastructure no single actor can delete — where a record's persistence doesn't depend on a corporation's continued interest in maintaining it.

This is what Logos is building. Not three products that sit on top of existing infrastructure. Three changes to the dispersion relation of the medium: Logos Messaging, Logos Blockchain, Logos Storage. Communication, coordination, memory — the three things civil society cannot outsource.

I want to be precise about what this means and doesn't mean. It doesn't mean the technology is sufficient by itself, or that infrastructure alone produces coherence. Benda was building samizdat networks with people who trusted each other, in a context of shared stakes and genuine risk. The technology is a necessary condition, not a sufficient one. A medium in which coherence can hold is not the same as a coherent community.

But a medium in which coherence cannot hold guarantees that it won't. And that is where we are.

---

## What remains

There is something important in the fact that the energy didn't disperse.

The movements are still there, in some form. The communities that got de-platformed rebuilt, partially, elsewhere. The activists who went quiet under surveillance found other ways. The organizing that failed on Facebook continued in Signal groups and encrypted chats and physical meetings in spaces not indexed by any algorithm. The desire to coordinate, to resist, to build something that holds — it persists. It has always persisted. That's not the problem.

The problem is that every medium they've used to do it has eventually been captured, or turned against them, or simply ceased to exist. GeoCities. Tumblr. MySpace. Twitter, in its pre-Musk form. Facebook, before organic reach became a pay-to-play feature. Each platform offered, for a time, a medium in which certain kinds of coordination were possible. Each was eventually restructured in ways that served the platform's interests over the community's coherence. This is not conspiracy. It's architecture. Platforms built on advertising revenue optimize for engagement, which means they optimize for the medium of advertiser relationships, not the medium of community coherence. The dispersion relation changes not through malice but through structural incentives pointing in a different direction.

What's needed is not a better platform. It's a different medium.

Benda described the goal clearly: "The mission of the parallel polis is constantly to conquer new territory, to make its parallelness constantly more substantial and more present." Writing in 1978, he could not have imagined the specific territory that would need to be conquered forty-five years later. But the logic is the same. Not arguing for better behavior from the existing infrastructure. Not hoping the platforms will reform. Not building ever-more-sophisticated workarounds within a medium someone else controls.

Building outside it. Building in a medium where the phase relationships — the trust, the coordination, the shared memory — can hold. Where dispersion is not the default. Where coherence doesn't require permission.

Civil society has the energy. It has always had the energy. What it has lacked, repeatedly, is a medium in which the shape holds.

That is the medium worth building.

---

*Corey Petty is Chief Evangelist at the Institute of Free Technology, the organization building the Logos ecosystem. This essay was adapted from a keynote address delivered at the IFT All-Hands, Lisbon, March 2026.*
