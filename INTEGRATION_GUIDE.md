# FreightMath BidRight — Integration Guide

## Quick Setup (2 Steps)

### Step 1: Test Locally

Open `index.html` in your browser. The presentation works immediately with:
- 18 slides with full navigation (arrow keys, buttons, section dots)
- Interactive elements (tabs, click-to-reveal, checklists)
- Animated stat cards and OR bars

### Step 2: Deploy to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add index.html styles.css config.js map.js presentation.js README.md QUICK_REFERENCE.md INTEGRATION_GUIDE.md

# Commit
git commit -m "FreightMath BidRight — Interactive Primer & Demo"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main

# Enable GitHub Pages
# Go to Settings > Pages > Select 'main' branch > Save
```

## File Organization

```
Your Repo/
├── index.html              ← Main entry point (all 18 slides)
├── styles.css              ← All styling
├── config.js               ← Presentation metadata
├── map.js                  ← Map functionality (available, unused)
├── presentation.js         ← Navigation & interactions
├── README.md               ← Full documentation
├── QUICK_REFERENCE.md      ← Quick lookup guide
└── INTEGRATION_GUIDE.md    ← This file
```

## Common Edits

### Change Colors
Edit `styles.css` at the top (`:root` section):
```css
:root {
  --accent: #E26E17;    /* Orange accent */
  --navy: #0A2463;      /* Dark blue background */
}
```

### Add/Modify Slides
Edit `index.html` (inside `<div id="deck">`):
```html
<div class="slide slide-dark" data-section="New Section">
  <div class="full-content stagger">
    <div class="section-label">Label</div>
    <h2 class="slide-title">New Slide</h2>
    <p>Content here...</p>
  </div>
</div>
```

### Modify Navigation Behavior
Edit `presentation.js`:
- `goToSlide(n)` — Jump to specific slide
- `navigate(dir)` — Go forward/back
- `updateUI()` — Update counter, progress bar

### Add New Interactive Elements
Edit `presentation.js`:
- Add reveal/reset function pair
- Wire into MutationObserver for auto-reset on slide entry
- Add `onclick` handler in `index.html`

## Troubleshooting

### Slides Don't Appear
- Verify slides are inside `<div id="deck">` in `index.html`

### Styles Look Wrong
- Verify `styles.css` is in the same directory as `index.html`
- Check `<link rel="stylesheet" href="styles.css">` tag

### JavaScript Errors
- Open browser DevTools (F12)
- Check Console tab for errors
- Verify all `.js` files in same directory
- Ensure load order: config.js → map.js → presentation.js

### Interactive Elements Don't Work
- Check `onclick` handlers in HTML match function names in `presentation.js`
- Verify element IDs match between HTML and JS

## Need Help?

Reference `README.md` for full documentation including:
- Complete slide outline
- All interactive element types
- CSS class reference
- Keyboard shortcuts
