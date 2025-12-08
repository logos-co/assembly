This document keeps track of the various directives and thoughts that have been handed down from IFT leadership. It is important to keep track of these and understand where they come from and under what guidance they were given such that the organization reacts appropriately and builds out understanding that is aligned. 

## Jarrad's views
> The specification / LIPs process needs to be owned and driven and Ksr has a lot on his plate, so if its alright with him pushing this with Florian would solve downstream issues both in comms &amp; documentation. - Jarrad

The following links were provided as examples of how the IETF defines a process of for RFCs and the subsequent tooling that has been created to facilitate the writing and standardization of them:
- https://authors.ietf.org/en/choosing-a-format-and-tools
- https://github.com/danyork/writing-internet-drafts-in-markdown
- https://github.com/martinthomson/i-d-template
- https://github.com/martinthomson/i-d-template/blob/master/doc/FEATURES.md
- https://github.com/cabo/kramdown-rfc
- https://github.com/mmarkdown/mmark

> ...solid math and empirical data showing how devasting interruptions are to attention & productivity, something I already knew but seeing the actual data drives it home differently
>
> https://justoffbyone.com/posts/math-of-why-you-cant-focus-at-work/

It is crucial to Jarrad that we find ways to not interrupt contributors. The above article is an outstanding explanation and model to show just how sensitive our productivity is to distractions.

In my eyes, a culture of specification driven development drastically reduces the **need** to communicate in order to get work down, thus drastically reducing the number of potential distractions that could pop up for any given contributor. 

## Jacek's views
Jacek spent some time discussing and explaining specs and how they make his job easier at the Storage Offsite in Sevilla. I took some notes and wanted to elaborate on them with my perspective.

> Specs are the medium that research and engineering use to communicate.

The process that connects research to engineering is a tough one to ensure remains efficient. Researchers and Engineers don't typically approach problems the same way, operate on different expectations of timelines, and use various languages and tooling to get their work done. Specifications serve as an artifact of agreement when it comes to understanding. Their specific language of formalization doesn't concern researchers with implementation language nuances or engineers with overly generalized math abstractions. By formalizing what a specification is and then using it as the conduit between research and development, you're ensuring that the expectations of functionality (and the boundaries of that functionality) derived from research can be implemented by engineers exactly, without ambiguity. 

> A spec is the minimal document that allows me to derive everything I care about 

In Jacek's eyes, a specification is the main context he wants to have when considering if, what, and how he will contribute to any given project. In the event he doesn't have one available, he must do additional work to find out what he needs to know to make those choices. If that work is too much, his likelihood to contribute dwindles rapidly. 

> A spec allows for a clean room implementation

> A spec enables the ability to switch languages easily

The above two quotes point to the fact that a well made specification delivers everything needed in order to create an implementation with any language the developer chooses. Once a specification is "stable," meaning that the nuances of the work are smoothed out and finalized, the speed of development is also drastically improved. 

> A spec serves many purposes before software "is ready"

This quote was around a conversation that points to the tremendous amount of work that happens _before_ a given specification can be labeled as "stable," and the benefits that parallel _specification development_ yield up until that point. For instance, before writing a single line of code for a given project, the purpose and functionality of the project is discussed and agreed upon. By formalizing this into a set of requirements and constraints (FURPS), you are already starting to build out the specification. These then serve to ensure that all people working on the project are under the same set of expectations of what the project is supposed to do and not do. 

