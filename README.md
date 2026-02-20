# FreightMath Presentation - "Top 12 Traits of High-Performing Truckload Carriers"

A modular, interactive slide deck showcasing FreightMath's analysis of successful truckload carriers.

## 📁 Project Structure

```
/
├── index.html              # Main HTML structure (clean, references external assets)
├── styles.css              # All CSS styling (fonts, animations, layouts)
├── config.js               # Configuration data (cities, presentation metadata)
├── map.js                  # FreightMath map visualization (Leaflet integration)
├── presentation.js         # Slide navigation and interaction logic
├── slides_content.html     # Raw slide HTML content (to be integrated)
└── README.md               # This file
```

## 🔧 File Responsibilities

### `index.html`
- Clean HTML structure
- Loads external CSS and JavaScript
- Persistent UI elements (logo, navigation, section dots)
- Container for slide deck

### `styles.css`
- CSS custom properties (colors, fonts, transitions)
- Typography and layout classes
- Component styles (cards, stats, buttons, etc.)
- Responsive design breakpoints
- Map-specific styling

### `config.js`
- City coordinates for map visualizations
- Presentation metadata
- Section definitions
- Configurable constants

### `map.js`
- Leaflet map initialization
- City marker creation
- Animated route visualization
- Map layer management (core, inbound, outbound, freightmath)
- Auto-play functionality

### `presentation.js`
- Slide navigation engine
- Keyboard controls (←/→ arrows, Space, Page Up/Down)
- Section dot navigation
- Animation triggers
- Interactive element handlers (tabs, checklists, reveals)
- OR bar animations
- Survey visualization

### `slides_content.html`
- Complete slide HTML markup
- Needs to be integrated into index.html's `<div id="deck">` section

## 🚀 Quick Start

### Integration Steps

1. **Copy slide content into index.html:**
   ```html
   <!-- In index.html, replace the #deck div with content from slides_content.html -->
   ```

2. **Open in browser:**
   - Can be opened directly as a local file
   - Or serve via any web server (Python, Node, etc.)

3. **For local development:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (with npx http-server)
   npx http-server
   ```

## 🎯 Making Edits

### Updating Styles
Edit `styles.css`:
- Color scheme: CSS variables at top of file (`:root` section)
- Typography: Font sizes and families
- Layout: Grid/flexbox configurations
- Animations: Keyframes and transitions

### Modifying Slides
Edit `slides_content.html`:
- Add/remove/modify slide content
- Each slide is a `<div class="slide">` element
- Use data attributes: `data-section="Section Name"`

### Changing Navigation
Edit `presentation.js`:
- Slide transition logic
- Keyboard shortcuts
- Animation triggers
- Interactive element behaviors

### Updating Map
Edit `map.js`:
- City locations in `config.js`
- Route colors and styles
- Animation timing
- Layer definitions

### Configuration Changes
Edit `config.js`:
- City coordinates
- Section definitions
- Presentation metadata

## 🎨 Key Features

- **Smooth transitions**: CSS cubic-bezier animations
- **Keyboard navigation**: Arrow keys, Space, Page Up/Down
- **Section dots**: Quick navigation to different sections
- **Interactive elements**: 
  - Animated OR (Operating Ratio) bars
  - Click-to-reveal steps
  - Tab panels
  - Interactive checklists
  - Survey visualization
- **FreightMath map**: 
  - Leaflet-based interactive map
  - Animated truck routes
  - Core/inbound/outbound visualization
  - Auto-play mode

## 🎹 Keyboard Shortcuts

- `→` or `Space` - Next slide
- `←` - Previous slide
- `PageDown` - Next slide
- `PageUp` - Previous slide
- Click section dots - Jump to section

## 🌐 Dependencies

### External Libraries
- **Leaflet 1.9.4** - Interactive map visualization
- **Google Fonts** - Public Sans, JetBrains Mono
- **CartoDB** - Map tiles (dark theme)

### CDN Resources
All external resources are loaded via CDN (no local dependencies required).

## 📝 Development Workflow

1. **Edit CSS** → See immediate style changes
2. **Edit slides_content.html** → Update content
3. **Edit presentation.js** → Modify interactions
4. **Edit map.js** → Change visualizations
5. **Edit config.js** → Update data

## 🔗 GitHub Deployment

Ready for GitHub Pages deployment:

1. Commit all files
2. Enable GitHub Pages in repository settings
3. Select main branch as source
4. Presentation will be available at: `https://[username].github.io/[repo-name]/`

## 💡 Tips for Claude Collaboration

When asking Claude to make changes, be specific about which file:

- "Update the accent color" → `styles.css`
- "Add a new slide" → `slides_content.html`
- "Change the map animation speed" → `map.js`
- "Add a keyboard shortcut" → `presentation.js`
- "Update city coordinates" → `config.js`

## 📊 Presentation Outline

1. **Intro** - Title slide
2. **Agenda** - 12 Traits overview
3. **Trait 1** - Transparency & Financial Literacy
4. **Trait 2** - Delegation & Empowerment  
5. **Trait 3** - Centralized Pricing (BidRight)
6. **Trait 4** - Network Discipline
7. **Trait 5** - Power Lanes vs Spider Lanes
8. **Trait 6** - FreightMath Integration
9-23. Additional traits and case studies

## 📄 License

© KSM Transport Advisors - FreightMath

---

**Version**: 1.0 (Refactored February 2026)
**Author**: Chris Henry, KSM Transport Advisors
