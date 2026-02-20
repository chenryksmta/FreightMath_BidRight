# Integration Guide

## Quick Setup (3 Steps)

### Step 1: Copy Slide Content into index.html

The slide content is currently in `slides_content.html`. You need to copy it into the `<div id="deck">` section of `index.html`.

**In index.html, find this:**
```html
  <!-- Main Slide Deck Container -->
  <div id="deck">
    <!-- Slides will be inserted here -->
    <!-- See slides_content.html for full slide HTML -->
  </div>
```

**Replace with:**
```html
  <!-- Main Slide Deck Container -->
  <div id="deck">
    [PASTE ALL CONTENT FROM slides_content.html HERE]
  </div>
```

### Step 2: Test Locally

Open `index.html` in your browser. The presentation should work immediately with:
- Slide navigation (arrow keys, buttons)
- Section dots
- Interactive elements
- FreightMath map (on slide with map visualization)

### Step 3: Deploy to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add index.html styles.css config.js map.js presentation.js README.md

# Commit
git commit -m "Initial commit - Refactored FreightMath presentation"

# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push to GitHub
git push -u origin main

# Enable GitHub Pages
# Go to Settings > Pages > Select 'main' branch > Save
```

## File Organization Summary

```
Your Repo/
├── index.html              ← Main entry point
├── styles.css              ← All styling
├── config.js               ← Data & configuration  
├── map.js                  ← Map functionality
├── presentation.js         ← Navigation & interactions
└── README.md               ← Documentation
```

## Common Edits

### Change Colors
Edit `styles.css` at the top (`:root` section):
```css
:root {
  --accent: #E26E17;    /* Orange accent */
  --navy: #0A2463;      /* Dark blue background */
  /* etc. */
}
```

### Add/Modify Slides
Edit the slide HTML in `index.html` (inside `<div id="deck">`):
```html
<div class="slide slide-dark" data-section="New Section">
  <div class="center-content">
    <h2 class="slide-title">New Slide</h2>
    <p>Content here...</p>
  </div>
</div>
```

### Update Map Cities
Edit `config.js`:
```javascript
const cities = {
  newCity: { lat: 40.7128, lng: -74.0060, name: 'New York, NY' },
  // ...
};
```

### Modify Navigation Behavior
Edit `presentation.js` - look for functions like:
- `goToSlide(n)` - Jump to specific slide
- `navigate(dir)` - Go forward/back
- `updateUI()` - Update counter, progress bar, etc.

## Troubleshooting

### Slides Don't Appear
- Check that you copied content from `slides_content.html` into `index.html`
- Make sure the content is inside `<div id="deck">`

### Map Doesn't Load
- Check browser console for errors
- Ensure internet connection (Leaflet loads from CDN)
- Verify `config.js` is loaded before `map.js`

### Styles Look Wrong
- Verify `styles.css` is in the same directory as `index.html`
- Check that the `<link rel="stylesheet" href="styles.css">` tag is present in `index.html`

### JavaScript Errors
- Open browser DevTools (F12)
- Check Console tab for error messages
- Verify all `.js` files are in the same directory
- Ensure load order: config.js → map.js → presentation.js

## Advanced: Build Script (Optional)

If you want to combine files for deployment, create a simple Node.js build script:

```javascript
// build.js
const fs = require('fs');

const slides = fs.readFileSync('slides_content.html', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');

const combined = html.replace(
  '<!-- Slides will be inserted here -->',
  slides
);

fs.writeFileSync('dist/index.html', combined);
console.log('Build complete!');
```

Run with: `node build.js`

## Need Help?

Reference the README.md for full documentation on:
- Project structure
- File responsibilities
- Keyboard shortcuts
- Development workflow

