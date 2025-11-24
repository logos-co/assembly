The goal is clarity and alignment, here's how we get started. The following is a list of initiatives that bootstrap a unified understanding of Logos across the IFT Core Contributors as well as set the groundwork to expand into the larger Logos Community:

- Logos Praxis: This site
- Logos Circles
- Logos.co Website
- Strategy Roll-out and uptake
- Logos Broadcast Network
- Logos Stack Technical Diagram
- All Hands Planning

Let's look at each one to understand why adding clarity fosters unification.

## Logos Praxis
There needs to be a maintained resource that acts as a coordination hub of the organization, and it needs to have the following properties:
- open
- maintainable
- machine readable
- content is discoverable
- scalable

The process of adding/editing linked flat-files with rich metadata within a Github repo, served as a static site for all to see and contribute to, fulfills all those requirements. 

You can look at the [[index|homepage]] or [[site-plan/index|site plan]] to get a sense of what this is and what we have planned for it. 
### #resources
- Claude convos:
	- https://claude.ai/share/fc0109af-cc06-42e9-add2-370700040f6c
	- https://claude.ai/chat/5b7f03a2-674e-4f58-9005-a4ed500e488d

## Logos Circles
It is imperative that the organization at large understand the problems of the communities that we're fostering. Additionally, the requirements of those communities need to be formalized and understood such that we can be sure the Logos Stack satisfies them. 

The initial initiative here will be to work with the Logos Cirlces groups and their leaders to help unify the process of understanding the winnable issues and their associated requirements such that our engineering efforts can identify whether or not our technical solutions are aimed in the right direction.

## Logos.co Website
The website is the on-ramping of our culture. It proudly markets the lifestyle we aim to enable in others through the Logos movement. 

## Logos Launch Strategy

### Establish and maintain feedback loop
In order to ensure alignment, it's imperative that we maintain a tight feedback loop from those consuming the strategy and acting upon it. This means:
1. CC consumes current strategy and execution documentation
2. CC gives feedback where misalignment or misunderstanding occurs
3. Leadership consumes feedback and responds, either adding context or filing identified gap in strategy
4. Documentation is updated by responsible party

This gives the organization a chance to express their opinions and thoughts, which brings them into the process and work. It gives the organization the opportunity to continuously find gaps and fill them, or find better ways to explain what is there such that it gets received more fully. 

### Organize Launch Strategy and Derivative Documentation
I have received feedback that the Logos Launch Strategy document is "a lot to take in," which detracts from it being consumed and internalized completely. Furthermore, there is a lot of derivative documentation that needs to be generated from what exists today.

In order to ensure clarity and ease of consumption, it needs to be broken up and served in a manner that explains and re-explains all the moving parts _at different levels of abstraction_. There are many different types of people that need to understand the whole, but we can't expect everyone to understand everything, so we need to ensure they get the whole point at the appropriate level of abstraction, and understand their part in it in the most detailed way, simultaneously. 

Doing this also allows the documentation to be updated in parallel, by the people who intimately know their part, in real time. 

The below diagram is a proposal for how I see the hierarchy of information, measured against the "stability" of the content the document includes. This way, it's clear that the global strategy is solid and stable, but how we go about executing it is nimble and adaptive to our work and the external environment. 

It is important to note that my role in this is to foster the process, not own the updates. Domain owners do the updates, or at least point to things that need updating, and the previously mentioned feedback loop helps the process of getting the documents actually updated. 

![[strategy-doc-dependency-diagram.png]]
### Establish Reporting on Progress and Misalignment
As per the [[Logos Launch Strategy]], each track will have a dashboard and metrics associated with their goals. Additionally, each team will have their own execution roadmap that points to deliverables. 

Not only do these things need regular progress reports, but the alignment and adherence to Logos, both tech and culture, needs a progress report. Success of Logos is intimately tied to our unification and alignment towards the shared goals. 

To that end, a process of gauging alignment will be developed and regularly held to inform leadership, the org, and the broader community how we're doing, what gaps we've identified, and how we plan to fill them.

This includes but isn't limited to:
- regular alignment surveys to teams
- reports on the dashboards/metrics
- circles outcomes and winning stories
- analysis of cross team communication efficiency

## Logos Broadcast Network
As it currently stands, we create and broadcast a myriad of content. We form a number of groups and have follow-up conversations in various places. The LBN is the coordinated effort of unifying all of these efforts, establishing expectations around scheduling, applying available resources, and ensuring consistency throughout. 

Some examples of this are:
- IFT Townhall
- upcoming: Logos Launch Updates
- Dev Club
- Who is Logos podcast
- Communication Club
- AI/ML Club
- 

#### #resources 
- https://www.notion.so/Logos-Broadcast-Network-2798f96fb65c809ab9d4cc0a9d40d099

## Logos Technical Stack Diagram - Abstract diagram complete
> [!info] see the details in [[Logos Tech Stack Diagram]]

The creation of a technical diagram of the Logos Stack, as we ideally see it, would serve a number of initiatives simultaneously, all of which improving clarity across the ecosystem. 
### Marketing Clarity
Marketing needs to understand how things fit together but can't be expected to understand the technical details. A view of the highest abstractions and their dependencies allows them to see the big picture and how it fits together without them digging deep. 

When asking questions, having a diagram to reference helps them articulate their lack of understanding. As an example, there were recent questions around where the package manager fits in to the stack and how it relates to the rest of things. Pointing to the diagram allows for them to ask the right kind of question and for those who answer to explain with each other holding the same picture in their heads. 
### Justification of Organizational Structure
One of the stated responsibilities of the [[Head of Evangelism JD]] is 

> Connect teams teams internally to ensure they are aligned on the Logos mission, that they understand their role in it and with whom they need to collaborate.

The [[Logos Launch Strategy]] required significant organizational changes. The strategy that is being followed is that of [Conway's Law](https://en.wikipedia.org/wiki/Conway%27s_law), whereby organizational structure follows communication pipelines of the technology being built. 

Having a technical diagram serves as the reference justification for organizational structure. It gives intuition for teams on why they're broken up they way they are as well as who they should mostly likely be working with (technical dependencies). 

Furthermore, when changes inevitably come that lead to technical changes in the Logos stack, updates to the diagram _should_ serve to provide justification for team changes in the event those technical changes are large enough. 

#### #resources 
- [Study of Conway's Law on FreeBSD](https://link.springer.com/chapter/10.1007/978-3-642-38928-3_8)

### Article: Life of a Txn Through Logos
described in [[Lifecycle of a Logos Txn]]

#### #resources
- https://miro.com/app/board/uXjVJtcerQQ=/?focusWidget=3458764647770037520


## Contextual AI Everywhere
Considering previous reasoning around our prioritization and focus of creating artifacts, it then reasons to ingest all of these materials into a global RAG to be used for various AI purposes. 

LLMs are beautiful at providing an easy experience and helping people understand. RAGs are the current methodology for ensuring their answers are up to date on specific information. We already started this endeavor internally with the business intelligence team and the [CaaS](https://ask.free.technology) roll-out. 

### Expand CaaS

### Introduce a Logos MCP Server
Claire from the BI team is creating a PoC MPC server leveraging [Context7](https://context7.com/) to see how useful it would be to provide always-up-to-date Logos context to LLMs.