---
title: Logos Brand Identity Context File
tags: 
  - resource
description: A context file for AI to help maintain Logos Brand identity
---

# Logos Brand Identity — Context File

> **Purpose:** Paste this into any Claude session (or add as a project file) to maintain Logos brand consistency across artifacts — presentations, HTML pages, React components, documents, diagrams, and any other creative output.

---

## Brand Overview

**Organization:** Logos (logos.co)
**Parent:** Institute of Free Technology (IFT)
**Tagline:** "Rebuilding civil society through decentralized technologies."
**Brand Mark:** The Greek lambda (λ) serves as the primary icon/logomark. Used standalone or as a text lockup: **λ Logos**

**Brand Personality:** Serious, sovereign, principled. The visual identity communicates institutional gravitas — not startup energy. Think academic press meets cypherpunk manifesto. The design should feel like it belongs to an entity that will outlast any single technology cycle.

---

## Color Palette

### Primary Palette (use these 80%+ of the time)

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| **Dark Primary** | Forest Black | `#0E2618` | 14, 38, 24 | Dark slide/section backgrounds, hero sections |
| **Dark Secondary** | Sage Charcoal | `#4E635E` | 78, 99, 94 | Content slide dark backgrounds, cards on light bg |
| **Light Primary** | Parchment | `#E2E0C9` | 226, 224, 201 | Light content backgrounds, body section fills |
| **Light Secondary** | Soft Gray | `#E5E5E5` | 229, 229, 229 | Borders, dividers, subtle fills, secondary backgrounds |
| **Light Tertiary** | Warm Gray | `#DDDED8` | 221, 222, 216 | Alternate light background, table headers |
| **Text Dark** | Black | `#000000` | 0, 0, 0 | Primary text on light backgrounds |
| **Text Light** | White | `#FFFFFF` | 255, 255, 255 | Primary text on dark backgrounds |

### Accent Colors (use sparingly for emphasis)

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| **Accent Primary** | Coral | `#E46962` | 228, 105, 98 | CTAs, highlights, alert states, key metrics |
| **Accent Warm** | Signal Orange | `#FA7B17` | 250, 123, 23 | Secondary emphasis, hover states |
| **Accent Alert** | Red | `#EA4335` | 234, 67, 53 | Warnings, critical indicators |

### Extended/Muted Tones

| Name | Hex | Usage |
|------|-----|-------|
| Muted Sage | `#808C78` | Secondary text on dark bg, icon fills, subtle labels |
| Deep Teal | `#0C2B2D` | Alternative deep background, gradient endpoint |
| Dark Ink | `#111520` | Ultra-dark alternative background |
| Charcoal | `#222021` | Near-black text alternative |

### Background Strategy

The brand uses a **dark-light alternating rhythm** (the "sandwich"):

- **Hero/Title sections:** Dark backgrounds (`#0E2618` or `#4E635E`) with white text
- **Content sections:** Light backgrounds (`#E2E0C9`, `#E5E5E5`, or `#FFFFFF`) with black text
- **Closing/CTA sections:** Return to dark backgrounds
- **Gradient imagery:** Deep teal-to-light gradient (`#0C2B2D` → light wash) used for atmospheric/photographic backgrounds

### What to Avoid

- No bright blues, purples, or neon tones
- No pure white (`#FFFFFF`) as a primary background — prefer `#E2E0C9` or `#E5E5E5` for warmth
- No high-saturation colors outside the accent palette
- The palette should always feel muted, institutional, and grounded

---

## Typography

### Font Stack

| Role | Font | Fallback | Weight | Usage |
|------|------|----------|--------|-------|
| **Headings** | Times | Times New Roman, Georgia, serif | Regular & Bold | All slide titles, section headers, hero text |
| **Display/Accent** | Gowun Batang | Georgia, serif | Regular | Subtitle text, pullquotes, elegant secondary headings |
| **Body** | Arial | Helvetica, sans-serif | Regular | Body copy, descriptions, list items, captions |
| **Code/Data** | Fira Code | Consolas, monospace | Regular | Code snippets, technical identifiers, data labels |

### Type Scale

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Hero/Title | 27–58pt | Bold | Largest text on any surface; use Times |
| Section Header | 20–27pt | Bold | Times; used for slide section titles |
| Subheading | 14–16pt | Bold | Arial or Gowun Batang |
| Body Text | 12–14pt | Regular | Arial; primary reading text |
| Caption/Label | 9–11pt | Regular | Arial; footer, metadata, small annotations |
| Numbered Markers | 13–16pt | Bold | Used for "01", "02", "03" section counters |

### Typography Rules

- **Headings are always serif** (Times). Never use sans-serif for main titles.
- **Body is always sans-serif** (Arial). Never use serif for body paragraphs.
- **Left-align body text.** Center-align only hero titles and single-line section headers.
- **Generous line spacing.** Aim for 1.4–1.6× line height on body text.
- **The lambda (λ) is rendered in Times** when used inline with the word "Logos."

### CSS/Web Font Mapping

```css
:root {
  --font-heading: 'Times New Roman', Times, Georgia, serif;
  --font-display: 'Gowun Batang', Georgia, serif;
  --font-body: Arial, Helvetica, sans-serif;
  --font-code: 'Fira Code', Consolas, 'Courier New', monospace;
}
```

For web artifacts, load Gowun Batang from Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Gowun+Batang&display=swap" rel="stylesheet">
```

---

## Layout Patterns

### Slide/Section Dimensions

- **Aspect ratio:** 16:9 (widescreen)
- **Margins:** Minimum 0.5" (≈5%) from all edges
- **Content width:** ~90% of container max

### Common Layout Templates

**Title Slide:**
- Dark background (`#0E2618`)
- Large λ mark (centered or left-aligned)
- Title in Times, 40–58pt, white
- Subtitle line beneath in lighter weight
- Date + URL ("logos.co") in small text, top or bottom
- "Logos EcoDev" or department label, small caps

**Content Slide (3-Column Feature Grid):**
- Light background (`#E2E0C9` or white)
- Section title top-left, Times bold, dark
- Three columns with numbered markers: `01`, `02`, `03`
- Each column: bold heading + body description in Arial
- Thin vertical or horizontal dividers between columns
- "Replaces" callout at bottom: lists what legacy tech this replaces, in muted text

**Problem/Narrative Slide:**
- Dark green background (`#4E635E`)
- Large serif title ("Problem", "The Browser")
- Body text in white, left-aligned, 12–14pt
- Pull-quote or key statement in bold/italic at bottom
- Section number in corner

**CTA/Closing Slide:**
- Dark background with photographic/gradient overlay
- Large λ symbol
- Action-oriented text: "Join the Movement"
- Bullet list of actions with bullet character `•`
- QR code if linking to a URL

### Recurring UI Patterns

- **Section numbering:** Two-digit format (`01`, `02`, `03`...) used as persistent navigation/progress markers
- **Footer bar:** "Logos.co" bottom-left, slide/page number bottom-right
- **Divider lines:** Thin lines (`#E5E5E5` on dark, `#4E635E` on light) separate content zones
- **"Replaces" pattern:** A line at the bottom of feature slides listing legacy alternatives, formatted as: `Replaces: Item A · Item B · Item C` using middle-dot separators

---

## Tailwind CSS Mapping

For React/HTML artifacts using Tailwind:

```javascript
// tailwind.config.js theme extension
colors: {
  logos: {
    forest: '#0E2618',
    sage: '#4E635E',
    parchment: '#E2E0C9',
    gray: '#E5E5E5',
    warmgray: '#DDDED8',
    coral: '#E46962',
    orange: '#FA7B17',
    red: '#EA4335',
    muted: '#808C78',
    teal: '#0C2B2D',
    ink: '#111520',
  }
}
```

When Tailwind custom config isn't available, use inline styles with the hex values above.

---

## CSS Custom Properties (Full Set)

```css
:root {
  /* Colors */
  --color-forest: #0E2618;
  --color-sage: #4E635E;
  --color-parchment: #E2E0C9;
  --color-gray: #E5E5E5;
  --color-warm-gray: #DDDED8;
  --color-coral: #E46962;
  --color-orange: #FA7B17;
  --color-red: #EA4335;
  --color-muted: #808C78;
  --color-teal: #0C2B2D;
  --color-ink: #111520;
  --color-black: #000000;
  --color-white: #FFFFFF;

  /* Typography */
  --font-heading: 'Times New Roman', Times, Georgia, serif;
  --font-display: 'Gowun Batang', Georgia, serif;
  --font-body: Arial, Helvetica, sans-serif;
  --font-code: 'Fira Code', Consolas, 'Courier New', monospace;

  /* Spacing */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;
  --space-xl: 4rem;

  /* Border */
  --border-subtle: 1px solid #E5E5E5;
  --border-dark: 1px solid #4E635E;
}
```

---

## Voice & Tone

### Writing Style

- **Declarative, not promotional.** State what Logos does and why it matters. Avoid hype language.
- **Institutional gravity.** The tone should read like a white paper or policy brief, not a product launch.
- **Technically precise.** Use correct terminology (e.g., "sender-receiver unlinkability" not "private messaging"). Define terms when needed but don't oversimplify.
- **Sovereignty as a theme.** Recurring conceptual anchors: sovereignty, civil liberties, resistance to capture, parallel institutions, neutrality.
- **Problem-solution framing.** Lead with the systemic failure, then present Logos as the structural remedy.

### Key Phrases & Vocabulary

- "The Sovereign Stack"
- "Rebuilding civil society through decentralized technologies"
- "Hard coded to defend civil liberties"
- "Parallel institutions"
- "Infrastructure capture" (what Logos resists)
- "In-protocol privacy" (not bolted-on)
- Use "sovereign" over "decentralized" when possible — it's the brand's differentiator

### Product Stack Terminology

| Component | Full Name | Description |
|-----------|-----------|-------------|
| **Logos** | Logos (The Sovereign Stack) | The full technology stack |
| **Core** | Logos Core | Unified SDK/runtime integrating all three modules |
| **App** | Logos App | End-user interface for discovering and running sovereign applications |
| **Blockchain** | Logos Blockchain | Sovereign base layer with in-protocol privacy |
| **Execution Zone** | Logos Execution Zone | State-separated execution layer with selective disclosure |
| **Messaging** | Logos Messaging | Anonymous, censorship-resistant p2p communication |
| **Storage** | Logos Storage | Encrypted, self-verifying distributed data persistence |

---

## Quick Reference — Do's and Don'ts

### Do

- Use the λ symbol prominently on title/hero elements
- Alternate dark and light section backgrounds
- Use serif (Times) for all headings
- Use numbered section markers (`01`, `02`, `03`)
- Include "Logos.co" footer on every page/slide
- Use middle-dot (`·`) separators in inline lists
- Keep coral/orange accents rare and purposeful
- Maintain generous whitespace and margins

### Don't

- Use bright/saturated colors outside the defined accent palette
- Use sans-serif for headings or serif for body text
- Create busy, cluttered layouts — the brand is about breathing room
- Use casual/startup tone ("awesome", "game-changing", "revolutionary")
- Use pure white backgrounds — opt for parchment or soft gray
- Forget the dark-light-dark rhythm across sections
- Use accent underlines beneath titles (reads as generic AI output)
- Mix more than 2 background colors on a single slide/section
