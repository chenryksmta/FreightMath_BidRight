# FreightMath BidRight — Quick Reference

## File Guide

| File | What It Does | Edit When... |
|------|-------------|--------------|
| `index.html` | All 18 slides with HTML content | Adding/editing slide content |
| `styles.css` | All styling | Changing colors, fonts, layouts, animations |
| `config.js` | Presentation metadata | Updating section definitions |
| `map.js` | Map visualization (unused) | Adding map features |
| `presentation.js` | Navigation & interactions | Modifying transitions, adding interactivity |

## Common Tasks

### Change Color Scheme
**File:** `styles.css` — `:root` section
```css
--accent: #E26E17;    /* Orange */
--navy: #0A2463;      /* Dark blue */
```

### Add New Slide
**File:** `index.html` — inside `<div id="deck">`
```html
<div class="slide slide-dark" data-section="Section Name">
  <div class="full-content stagger">
    <div class="section-label">Label</div>
    <h2 class="slide-title">Title</h2>
    <p>Content...</p>
  </div>
</div>
```

### Modify Slide Transition Speed
**File:** `styles.css`
```css
--slide-transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1);
```

## CSS Classes Reference

### Layout
- `.center-content` — Centered, vertically aligned
- `.split` — Two-column layout
- `.full-content` — Full-width content

### Typography
- `.headline` — Large hero text
- `.subtitle` — Secondary hero text
- `.slide-title` — Section heading
- `.section-label` — Small uppercase label

### Components
- `.card` — Elevated card with hover effect
- `.stat-card` — Metric display card
- `.flow-step` — Process step in horizontal flow
- `.bullet-list` — Styled list with orange dots
- `.check-item` — Interactive checklist item
- `.cycle-step` — Cycle diagram step
- `.cta-card` — Call-to-action card

### Slide Backgrounds
- `.slide-hero` — Radial gradient
- `.slide-dark` — Dark gradient
- `.slide-accent` — Accent gradient

### Animation
- `.stagger` — Children animate in sequence

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` / `↓` | Next slide |
| `←` / `↑` | Previous slide |
| Section dots | Jump to slide |

## Troubleshooting

### Slides don't appear
Check that `index.html` has slides inside `<div id="deck">`

### Styling broken
- Verify `styles.css` is in same directory
- Check `<link>` tag in `<head>`

### Navigation broken
- All JS files in same directory
- Load order: config.js → map.js → presentation.js
- Check browser console for errors

## Deployment Checklist

- [ ] Test locally in browser
- [ ] All files in same directory
- [ ] Arrow keys navigate all 18 slides
- [ ] Tab panels switch correctly
- [ ] Click-to-reveal flows work
- [ ] Responsive at different sizes
- [ ] No JS console errors
- [ ] Commit and push

---

**Version:** 2.0 | **Last Updated:** February 2026
