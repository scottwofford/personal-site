# scottwofford.com — Repository Guidelines

## Project Structure

- `dev/` — Development tracking and context
  - `CHANGELOG.md` — Record of all changes with dates and PR links
  - `OBJECTIVE.md` — Current objective
  - `TODO.md` — Outstanding items
  - `plans/` — Session plans (linked from CHANGELOG)
  - `sources/` — Source documents for site content
  - `notes/` — Scratchpad
- `es/` — Spanish translations (mirror English structure)
- `home.css` — Shared homepage styles (EN + ES)
- `styles.css` — Shared styles for content pages

## Conventions

- **Check existing files before creating new ones.** This repo has its own structure — don't import conventions from luthien-proxy or other repos without checking what's already here.
- **CHANGELOG lives at `dev/CHANGELOG.md`** — not at root. Update it when completing work.
- **Plans go in `dev/plans/`** — named `YYYY-MM-DD_<topic>.md`, linked from CHANGELOG.
- **Spanish pages mirror English** — every EN content change should be reflected in `es/`.
- **CSS**: `home.css` for both homepages, `styles.css` for all content pages. Don't create page-specific CSS unless truly necessary.
- **Font Awesome**: Currently 6.7.2 via cdnjs CDN (referenced in both `index.html` and `es/index.html`).
- **Analytics**: GoatCounter (`scwoff.goatcounter.com`) on all pages.
- **Hosting**: GitHub Pages with custom domain `scottwofford.com`.

## Workflow

1. Create a feature branch (don't commit directly to main)
2. Make changes, mirror on ES pages
3. Test locally: `python3 -m http.server 8080`
4. Commit, push, create PR
5. Update `dev/CHANGELOG.md` with date, summary, and PR link
