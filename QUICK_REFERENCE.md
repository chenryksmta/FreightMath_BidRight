# FreightMath Presentation - Quick Reference

## 📂 File Guide

| File | What It Does | Edit When... |
|------|-------------|--------------|
| `index.html` | Main HTML structure | Adding/removing structural elements |
| `styles.css` | All styling | Changing colors, fonts, layouts, animations |
| `config.js` | Configuration & data | Updating city coordinates, metadata |
| `map.js` | Map visualization | Changing map behavior, routes, animations |
| `presentation.js` | Navigation & interactions | Modifying slide transitions, keyboard controls |
| `slides_content.html` | Slide HTML content | Adding/editing slide content |

## 🎯 Common Tasks

### Change Color Scheme
**File:** `styles.css`
**Lines:** 1-20 (`:root` section)
```css
--accent: #E26E17;    /* Orange */
--navy: #0A2463;      /* Dark blue */
```

### Add New Slide
**File:** `slides_content.html`
```html
<div class="slide slide-dark" data-section="Section Name">
  <div class="center-content stagger">
    <h2 class="slide-title">Slide Title</h2>
    <p>Content...</p>
  </div>
</div>
```

### Update City on Map
**File:** `config.js`
```javascript
const cities = {
  cityName: { lat: 40.7128, lng: -74.0060, name: 'City, ST' }
};
```

### Modify Slide Transition Speed
**File:** `styles.css`
**Line:** ~45
```css
--slide-transition: 0.7s cubic-bezier(0.16, 1, 0.3, 1);
```

### Change Keyboard Shortcuts
**File:** `presentation.js`
**Search for:** `document.addEventListener('keydown'`

## 🎨 CSS Classes Reference

### Layout Classes
- `.center-content` - Centered, vertically aligned content
- `.split` - Two-column layout
- `.full-content` - Full-width content

### Typography
- `.headline` - Large hero text
- `.subtitle` - Secondary hero text
- `.slide-title` - Section heading
- `.section-label` - Small uppercase label

### Components
- `.card` - Elevated card with hover effect
- `.stat-card` - Metric display card
- `.flow-step` - Process step in horizontal flow
- `.bullet-list` - Styled list with orange dots

### Slide Backgrounds
- `.slide-hero` - Gradient radial background
- `.slide-dark` - Dark gradient
- `.slide-accent` - Accent gradient

### Animation
- `.stagger` - Children animate in sequence
- `.fade-up` - Fade and slide up animation

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` or `Space` | Next slide |
| `←` | Previous slide |
| `PageDown` | Next slide |
| `PageUp` | Previous slide |
| `Home` | First slide |
| `End` | Last slide |

## 🔧 Troubleshooting

### Problem: Slides don't appear
**Solution:** Copy content from `slides_content.html` into `<div id="deck">` in `index.html`

### Problem: Map doesn't load
**Check:**
- Internet connection (Leaflet loads from CDN)
- Browser console for errors
- `config.js` loads before `map.js`

### Problem: Styling broken
**Check:**
- `styles.css` is in same directory
- Link tag exists: `<link rel="stylesheet" href="styles.css">`
- No syntax errors in CSS

### Problem: Navigation broken
**Check:**
- All JS files loaded
- Load order: config.js → map.js → presentation.js
- Browser console for errors

## 🚀 Deployment Checklist

- [ ] Copy slides from `slides_content.html` into `index.html`
- [ ] Test locally in browser
- [ ] All files in same directory
- [ ] Commit to git
- [ ] Push to GitHub
- [ ] Enable GitHub Pages
- [ ] Test live URL

## 📝 Git Commands

```bash
# Initial setup
git init
git add .
git commit -m "Initial commit - FreightMath presentation"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO.git
git push -u origin main

# Making changes
git add .
git commit -m "Description of changes"
git push
```

## 🌐 GitHub Pages Setup

1. Go to repository Settings
2. Navigate to "Pages" section
3. Source: Select "main" branch
4. Folder: Select "/ (root)"
5. Click Save
6. Wait 1-2 minutes
7. Visit: `https://USERNAME.github.io/REPO-NAME/`

## 💡 Working with Claude

**Good prompts:**
- "Update the accent color to teal in styles.css"
- "Add a new slide about driver retention after slide 15"
- "Change the map zoom level to show more detail"
- "Add a fade-in animation to the stat cards"

**Include the file name** to make edits faster!

## 📚 Resources

- **Leaflet Docs:** https://leafletjs.com/reference.html
- **CSS Custom Properties:** https://developer.mozilla.org/en-US/docs/Web/CSS/--*
- **Flexbox Guide:** https://css-tricks.com/snippets/css/a-guide-to-flexbox/
- **Grid Guide:** https://css-tricks.com/snippets/css/complete-guide-grid/

---

**Version:** 1.0 | **Last Updated:** February 2026
