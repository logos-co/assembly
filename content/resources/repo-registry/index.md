---
title: Repository Registry
description: A navigable map of all IFT repositories across GitHub organizations
tags:
  - resources
  - repo
---

The IFT / Logos ecosystem spans multiple GitHub organizations and dozens of repositories. This registry provides a centralized, browsable map of what exists, what state it's in, who it's for, and how repos relate to each other.

Each repository has its own page with metadata, a short description, and wiki-links to related repos. The **graph** on the right visualizes how repositories connect to each other. Use **tags** to filter by any dimension.

## Browse by status

| Status | Tag page |
|--------|----------|
| Active | [[tags/repo-active]] |
| Maintenance | [[tags/repo-maintenance]] |
| Experimental | [[tags/repo-experimental]] |
| Archived | [[tags/repo-archived]] |
| Deprecated | [[tags/repo-deprecated]] |

## Browse by organization

| Org | Tag page |
|-----|----------|
| logos-co | [[tags/org-logos-co]] |
| logos-messaging | [[tags/org-logos-messaging]] |
| logos-storage | [[tags/org-logos-storage]] |
| status-im | [[tags/org-status-im]] |
| vacp2p | [[tags/org-vacp2p]] |
| acid-info | [[tags/org-acid-info]] |
| logos-blockchain | [[tags/org-logos-blockchain]] |

## Browse by component

| Component | Tag page |
|-----------|----------|
| Logos Core | [[tags/component-core]] |
| Messaging | [[tags/component-messaging]] |
| Storage | [[tags/component-storage]] |
| Blockchain | [[tags/component-blockchain]] |
| UI | [[tags/component-ui]] |
| Tooling | [[tags/component-tooling]] |
| Infrastructure | [[tags/component-infra]] |
| Documentation | [[tags/component-docs]] |

## Browse by audience

| Audience | Tag page |
|----------|----------|
| Developers | [[tags/audience-dev]] |
| Ops / Infrastructure | [[tags/audience-ops]] |
| Researchers | [[tags/audience-researcher]] |
| Community / External | [[tags/audience-community]] |

## Adding a new repo

1. Copy any existing repo page in this folder
2. Update the frontmatter: title, description, and tags (status, org, component, audience, language)
3. Fill in the metadata table and short description
4. Add `## Related repos` with `[[wiki-links]]` to connected repositories
5. Commit and the site will auto-generate tag pages, graph links, and folder listings
