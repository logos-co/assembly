# Dispersive Medium — Agent Handoff

## What This Is

A ~4000-word article using wave packet coherence as a metaphor for civil society fragility. Covers Egypt internet shutdown, Facebook organic reach collapse (16%→<2%), Myanmar/Rohingya genocide, Snowden chilling effects, link rot (25% of 2013–2023 pages gone), Tufekci's "tactical freeze," and proposes Logos sovereign stack as the answer.

It's modeled after the browser privacy article (see reference below) — the goal is a Logos Press piece with embedded interactive components that *do* something to make the physics legible, not just illustrate it.

---

## Files

| File | Purpose |
|------|---------|
| `/home/petty/assembly/quartz/static/dispersive-medium-preview.html` | Self-contained preview with all three interactives inlined. **This is the working file.** |
| `/home/petty/assembly/content/content-tracker/dispersive-medium-draft.md` | Article draft — unmodified, still needs a human voice pass |
| `/home/petty/assembly/quartz/static/stage0-browser-privacy.html` | Reference article — style and mechanic to match |

**Preview server:** `cd /home/petty/assembly/quartz/static && python3 -m http.server 8765 --bind 0.0.0.0`
Then open: http://192.168.1.136:8765/dispersive-medium-preview.html

---

## The Three Interactive Components

All three live in `dispersive-medium-preview.html`. CSS uses `dm-` prefix throughout for style scoping.

### 1. `dm-reach` — Organic Reach Calculator
Two sliders: follower count (100–500K) and start year (2012–2024). Maps to historical Facebook organic reach data: 16% in 2012 → 1.4% in 2024. Canvas sparkline shows the decay curve. **Placement:** after the Facebook stat in the "capture" section.

### 2. `dm-rot` — Link Rot Live Checker
Seven cited sources from the article fetched via no-cors HEAD request, 8s timeout, staggered 600ms. Shows Live/Gone/Archived/Blocked/Timeout per URL. **Placement:** alongside the Pew stat in the "memory" section.

### 3. `dm-wave` — Wave Packet Visualizer (two-panel)

This is the most important and most iterated component. Read this section carefully before touching it.

#### Why it's two panels (design rationale)

Earlier versions had three mode buttons (Dispersing / Phase-locked / Soliton) on a single canvas. The problem: Phase-locked and Dispersing looked too similar at low dispersion settings. Viewers couldn't see *why* the soliton was special — it just looked like it "held" without a visible reason.

The core argument of the article isn't "phase-locked vs. incoherent." It's **"linear medium vs. nonlinear medium."** The soliton isn't just a better-coherenced wave — it's a structurally different solution. The same dispersion that destroys a normal packet is present in the nonlinear medium too — the soliton ignores it because nonlinear self-focusing exactly cancels dispersion (γP₀ = β₂/2T₀²).

So the redesign puts both panels side by side with identical initial conditions and shared controls. The *divergence between the panels* is the argument.

#### Current implementation

- **LEFT panel (red) — Linear medium:** 10 colored frequency components (rainbow, slow→fast), Gaussian envelope. Components drift at different phase velocities controlled by the dispersion slider. Packet spreads.
- **RIGHT panel (green) — Nonlinear medium:** Same 10-component dispersive chaos shown as faint background traces (the medium is just as hostile), but a sech² soliton rides over it unchanged. Soliton width is fixed regardless of dispersion setting — that's the point.
- **Shared controls:**
  - Dispersion strength slider (0–3×) — cranking it makes the left panel fall apart faster; right panel doesn't care
  - Phase coherence slider (aligned→random) — changes left panel starting conditions; it still spreads. Soliton unaffected.
- **Balance indicator:** Shows γP₀ = β₂/2T₀² condition, goes green in the meaningful regime, plain-language explanation of what's being balanced.
- **Animation:** ~10 second loop, footer text updates dynamically based on slider positions.

#### Known issues / what still needs work on the wave visualizer

- At low dispersion settings, the linear panel doesn't spread dramatically enough to be visually compelling — may need to exaggerate the effect for low values
- The soliton background traces (the "what the medium would do to a normal wave") could be more visible/dramatic to make the contrast land harder
- Footer copy could be tightened

---

## Remaining Article Work

1. **Voice pass** — the draft has too many AI-isms, needs to sound like Corey wrote it
2. **Accuracy check** — verify specific claims (reach percentages, link rot stats, timeline details)
3. **Interactive integration** — drop the three components into the article at their placement points
4. **Format:** Article uses Quartz/MDX; reference the browser privacy article for how interactives are embedded

### Style reference: browser privacy article

Published at: https://press.logos.co/article/browser-betrayed-you
Local file: `/home/petty/assembly/quartz/static/stage0-browser-privacy.html`

Key mechanic: it **fingerprints you before explaining what fingerprinting is** — *doing the thing* before naming it. If there's an equivalent move for this piece (making the reader experience dispersion before explaining it), that's worth finding.

Technical conventions: `s0-` CSS prefix, scoped CSS, single script block, self-contained HTML.
