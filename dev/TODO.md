# TODO

## High Priority

- [ ] **Recreate Been app account** - Traveling link needs destination

## UX Improvements

- [ ] **Nav "Show All" affordance** - Add a way for users to see everything from all dropdowns at once (see UX patterns below)

## Nice to Have

- [ ] **Spotify "Now Playing" widget** - Show current/last played track
- [ ] **Add favicon**

---

## UX Patterns for "Show All" Nav

Options to explore:

1. **Sitemap Link** - Add a "View All →" link that goes to a dedicated /sitemap.html page showing all content organized by category

2. **Mega Menu on Hover** - When hovering over a "☰" or "All" button, show a full-width dropdown with all categories side-by-side

3. **Expand All Toggle** - A button/link that expands all dropdowns simultaneously (CSS-only using `:target` or a small JS toggle)

4. **Footer Directory** - Full site directory in the footer (common pattern - users scroll down to find everything)

5. **Keyboard Shortcut** - Press `/` or `?` to reveal a command palette / full nav overlay (power user pattern)

**Recommendation**: Start with #1 (Sitemap page) - simplest to implement, always works, mobile-friendly
