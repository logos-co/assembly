---
title: Specification Dependency Graph
tags:
  - sdd
---
Below is a dependency graph if each type of technical documentation and how it relates to specifications. Each node in the graph is clickable, which then will lead you to a document explaining what it is, and how it depends upon specifications. 

```mermaid
%%{init: {'theme': 'base', 'themeVariables': { 'primaryColor': '#4a90a4', 'primaryTextColor': '#161618', 'primaryBorderColor': '#2d5a6b', 'lineColor': '#5c7a8a', 'secondaryColor': '#6b8e9f', 'tertiaryColor': '#e8f4f8'}}}%%

flowchart TD
    subgraph implementation["Implementation Layer"]
        API[API Documentation]
        ARCH[Architecture Docs]
        CODE[Code & Comments]
    end

    subgraph integration["Integration Layer"]
        SDK[SDK Guides]
        PROTO[Protocol Docs]
        SCHEMA[Data Schemas]
    end

    subgraph consumption["Consumer Layer"]
        DEV[Developer Guides]
        TUT[Tutorials]
        REF[Reference Manuals]
    end

    implementation --> SPEC
    integration --> SPEC
    consumption --> SPEC

    subgraph foundation[" "]
        SPEC[("📋 SPECIFICATION<br/>─────────────<br/>Requirements<br/>Constraints<br/>Interfaces<br/>Behaviors")]
    end

    SPEC --> validation
    SPEC --> community

    subgraph validation["Validation Layer"]
        TEST[Test Suites]
        COMPLY[Compliance Checks]
        AUDIT[Audit Trails]
    end

    subgraph community["Community Layer"]
        CONTRIB[Contribution Guidelines]
        RFC[RFCs & Proposals]
        CHANGE[Changelogs]
    end

    API --> DEV
    ARCH --> DEV
    SDK --> TUT
    PROTO --> REF
    SCHEMA --> REF
    
    TEST --> AUDIT
    COMPLY --> AUDIT
    
    RFC --> CHANGE
    CHANGE --> CONTRIB
    CODE --> CONTRIB

    click SPEC "00-specification"
    click API "01-api-documentation"
    click ARCH "02-architecture-docs"
    click CODE "03-code-and-comments"
    click SDK "04-sdk-guides"
    click PROTO "05-protocol-docs"
    click SCHEMA "06-data-schemas"
    click DEV "07-developer-guides"
    click TUT "08-tutorials"
    click REF "09-reference-manuals"
    click TEST "10-test-suites"
    click COMPLY "11-compliance-checks"
    click AUDIT "12-audit-trails"
    click CONTRIB "13-contribution-guidelines"
    click RFC "14-rfcs-and-proposals"
    click CHANGE "15-changelogs"

    style SPEC fill:#2d5a6b,stroke:#1a3d4a,stroke-width:4px,color:#fff
    style foundation fill:#e8f4f8,stroke:#4a90a4,stroke-width:2px
    style implementation fill:#f0f7fa,stroke:#6b8e9f,color:#1a3d4a
    style integration fill:#f0f7fa,stroke:#6b8e9f,color:#1a3d4a
    style consumption fill:#f0f7fa,stroke:#6b8e9f,color:#1a3d4a
    style validation fill:#f0f7fa,stroke:#6b8e9f,color:#1a3d4a
    style community fill:#f0f7fa,stroke:#6b8e9f,color:#1a3d4a
```

