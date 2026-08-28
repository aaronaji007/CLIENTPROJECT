---
name: Carte Clinique
description: A premier private-clinic identity for a global surgery and care concierge.
colors:
  ink: "#0e2a34"
  ink-soft: "#163a46"
  paper: "#f6f4ef"
  paper-deep: "#edeae2"
  sage: "#b8c4c0"
  sage-soft: "#e2e7e4"
  signal: "#c94f3d"
  signal-deep: "#b13f2f"
  line: "rgba(14, 42, 52, 0.12)"
  line-invert: "rgba(246, 244, 239, 0.16)"
typography:
  display:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(2.25rem, 4vw + 1rem, 4rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Newsreader, Georgia, serif"
    fontSize: "clamp(1.5rem, 2vw + 0.5rem, 2.25rem)"
    fontWeight: 500
    lineHeight: 1.15
  body:
    fontFamily: "Instrument Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "IBM Plex Mono, ui-monospace, monospace"
    fontSize: "0.688rem"
    fontWeight: 500
    letterSpacing: "0.14em"
    textTransform: "uppercase"
rounded:
  sm: "2px"
  md: "8px"
  lg: "8px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "80px"
components:
  button-primary:
    backgroundColor: "{colors.signal}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.signal-deep}"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
  button-ghost:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    border: "1px solid {colors.ink}"
    rounded: "{rounded.sm}"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    border: "1px solid {colors.line}"
  panel-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
  input:
    backgroundColor: "rgba(255, 255, 255, 0.4)"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    border: "1px solid rgba(14, 42, 52, 0.2)"
---

# Carte Clinique — Design System

## Overview

Carte Clinique is a medical-tourism and healthcare concierge rendered as a deliverable from a premier private medical institution. Every surface reads as a document from a place a patient would trust with surgery: a calm clinical charter voice, a deep ink-teal institutional ground paired with warm medical paper, and a single surgical signal-red reserved for the primary action. The system pairs the reassurance of a confidential patient file with the discipline of a measured, coordinated journey (Discovery → Travel → Treatment).

The North Star is **"The Clinic Charter"** — an institutional identity program where navigation, editorial type, fine rule lines, an emblem seal, and calibrated mono readouts carry the grammar of an elite private clinic.

## Colors

Primary is the surgical signal-red, used only for the primary action (`button-primary`, `::selection`, focus rings, and small accent markers). The working ground is warm medical paper; structural text and dark surfaces use the deep ink-teal. Sage is a soft secondary utility tone.

- **Ink** `#0e2a34` — institutional ground, dark panels, footer, headline accents, primary text on light.
- **Paper** `#f6f4ef` — the warm medical-paper ground of most surfaces.
- **Sage** `#b8c4c0` — secondary utility tone (scrollbar, muted separators).
- **Signal** `#c94f3d` — the one reserved accent: primary actions, selection, focus, small markers. Never scattered.

Tints reference their hue: secondary text on light derives from ink at reduced alpha; text on dark surfaces derives from paper at reduced alpha — never a foreign gray.

## Typography

Three faces voice the system:

- **Newsreader** (display) — the charter voice for headings and the wordmark; medium weight, tight tracking, high line-height, generous display sizes up to ~4rem.
- **Instrument Sans** (body/UI) — legible workhorse for paragraphs, nav, buttons, and inputs.
- **IBM Plex Mono** (label/data) — uppercase tracked micro-labels, journey-phase numerals, panel labels, and any measured/calibrated readout (tabular feel for "at a glance" facts).

Display measure is capped by container width (~65–70ch for body). Headings carry their own weight; redundant kickers are avoided.

## Layout

A single restrained max-width container (`max-w-6xl`, ~72rem) for page columns, with dense `px-5` gutters scaling up on large screens. Layout uses a calm single rail: sticky header, single content column that occasionally splits to a 1.6:1 detail column with a sticky facts panel.

- Generous section rhythm (~5rem–7rem vertical), more space above a heading than below it.
- Card grids use a `gap-px` hairline technique over `bg-line` for crisp 1px separators without heavy borders.
- The 3-phase journey is a vertical center-ruled timeline (single axis on desktop, left rail on mobile).
- Responsive: the specialty grid is 4→2→1 columns; packages 3→2→1; the header collapses to a mobile menu.

## Elevation & Depth

Depth is soft and real — a single panel shadow token with an offset and a blur:

```
--shadow-panel: 0 1.5px 2.5px rgba(14,42,52,0.08),
                0 12px 32px -12px rgba(14,42,52,0.28);
```

Cards lift 0.5px on hover with a gentle translate. Dark surfaces (footer, hero panels) are flat tonal planes, not elevation. No hard offset block shadows.

## Shapes

Corner language is tight and institutional: `2px` for buttons and inputs (sharp, clinical), `8px` for cards and panels. Nothing is heavily rounded or pill-shaped — the geometry reads precise and medical. The emblem is a circular seal with concentric rings. Rule lines are 1px hairlines (line/line-invert).

## Components

- **Button primary** — signal-red, 2px radius, white text, panel shadow; hover deepens to signal-deep. Reserved for the single conversion action ("Plan your care", "Confirm this time").
- **Button ink** — dark institutional button for secondary actions on light ground.
- **Button ghost** — paper with ink outline for tertiary actions; invert borders on dark.
- **Card** — paper, 8px radius, hairline border + panel shadow; used for specialties, packages, posts.
- **Panel dark** — ink ground with paper type for "at a glance" facts and package side panels.
- **Input** — translucent white on paper, ink type, 2px radius, signal caret and focus ring, visible error/disabled states.
- **Inquiry modal** — multi-step dialog with step progress rail, file upload, and disabled-until-valid Continue; focus returns to trigger context.
- **Header/Footer** — emblem seal + wordmark + mono sublabel; sticky on scroll.

## Do's and Don'ts

Do keep the warm paper and deep ink-teal as the dominant identity, and reserve signal-red for the one primary action on a surface.

Do use the three-face typographic system: Newsreader for voice, Instrument Sans for body, Plex Mono for measured readouts and labels.

Do keep radius small and geometry precise; use hairline rules and the seal emblem; use the soft offset panel shadow.

Do author real, labeled copy and clearly mark placeholder pricing and unverified medical claims as placeholders.

Do not scatter accent color, gradient text, or over-rounded, pill-everything styling.

Do not use glass/blur decoration or emoji/unicode glyphs in place of drawn SVG icons.

Do not present invented credentials, accreditation, patient proof, or verified outcomes as fact — this is a concept site until real content replaces placeholders.
