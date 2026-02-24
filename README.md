# FreightMath BidRight — Interactive Primer & Demo

An interactive slide deck presenting FreightMath + BidRight: the complete bid lifecycle platform for truckload carriers.

## Project Structure

```
/
├── index.html              # Main HTML — all 18 slides
├── styles.css              # All CSS styling (fonts, animations, layouts)
├── config.js               # Presentation metadata & section definitions
├── map.js                  # Map visualization (Leaflet, available but unused)
├── presentation.js         # Slide navigation and interaction logic
├── README.md               # This file
├── QUICK_REFERENCE.md      # Quick lookup guide
└── INTEGRATION_GUIDE.md    # Setup & deployment guide
```

## Slide Outline (18 Slides)

### Section 1 — The Why (Chris leads)
| # | Title | Type | Interactive |
|---|-------|------|-------------|
| 0 | Hero / Title | `slide-hero` | Stagger animation |
| 1 | The Problem | `slide-dark` | Animated stat cards |
| 2 | Why Pricing Is Broken | `slide-accent` | Click-to-reveal flow |
| 3 | The Measurement Engine | `slide-dark` | Tab panels (3 tabs) |
| 4 | How Carriers Use FM Today | `slide-accent` | Animated OR bars |

### Section 2 — The Bridge (Handoff)
| # | Title | Type | Interactive |
|---|-------|------|-------------|
| 5 | From Intelligence to Action | `slide-dark` | Auto-reveal flow |
| 6 | Introducing BidRight | `slide-hero` | Hero branding |

### Section 3 — BidRight Story (Tyler leads)
| # | Title | Type | Interactive |
|---|-------|------|-------------|
| 7 | Manual, Slow, Error-Prone | `slide-accent` | Before/After split |
| 8 | From SalesScope to BidRight | `slide-dark` | Click-to-reveal timeline |
| 9 | The Impact at Scale | `slide-accent` | Animated stat cards |

### Section 4 — What BidRight Does (Co-lead)
| # | Title | Type | Interactive |
|---|-------|------|-------------|
| 10 | FM + BidRight Together | `slide-dark` | Click-to-reveal 4-step flow |
| 11 | Automated Intelligence | `slide-accent` | Tab panels (3 tabs) |
| 12 | FM-Powered Bid Construction | `slide-dark` | Interactive checklist |
| 13 | Continuous Improvement | `slide-accent` | Click-to-reveal cycle diagram |
| 14 | High-Level Capabilities | `slide-dark` | 6-card grid |

### Section 5 — Call to Action (Chris)
| # | Title | Type | Interactive |
|---|-------|------|-------------|
| 15 | Why Now | `slide-accent` | Bullet list |
| 16 | Ways to Engage | `slide-dark` | 3-column card grid |
| 17 | Ready to BidRight? | `slide-hero` | 2x2 CTA grid |

## Quick Start

1. Open `index.html` in any modern browser
2. Navigate with arrow keys, buttons, or section dots
3. Click interactive elements (flows, checklists, tabs)

## File Responsibilities

- **index.html** — All 18 slides with HTML content and interactive markup
- **styles.css** — CSS custom properties, typography, layout, components, animations, responsive breakpoints
- **config.js** — Presentation metadata and section definitions
- **presentation.js** — Slide engine, keyboard/touch nav, tab switching, click-to-reveal handlers, animation triggers
- **map.js** — Leaflet map (available, not actively used in this deck)

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `↓` | Next slide |
| `←` / `↑` | Previous slide |
| Section dots | Jump to any slide |

## Interactive Elements

1. **Stagger animations** — All slides cascade children on entry
2. **Animated stat cards** — Slides 1, 9
3. **Click-to-reveal flows** — Slides 2, 8, 10, 13
4. **Tab panels** — Slides 3, 11
5. **Animated OR bars** — Slide 4
6. **Auto-reveal flow** — Slide 5 (bridge animation)
7. **Split layout** — Slide 7 (before/after)
8. **Interactive checklist** — Slide 12
9. **Card grids** — Slides 14, 16
10. **CTA grid** — Slide 17

## Dependencies

- **Leaflet 1.9.4** (CDN) — available for map features
- **Google Fonts** (CDN) — Public Sans, JetBrains Mono

## Deployment

Ready for GitHub Pages:

1. Commit all files
2. Enable GitHub Pages (Settings > Pages > main branch)
3. Available at `https://[username].github.io/[repo-name]/`

---

**Version**: 2.0 (February 2026)
**Authors**: Chris Henry (KSM Transport Advisors), Tyler Dietrich (Nussbaum Technology)
