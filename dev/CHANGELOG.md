# Changelog

All notable changes to scottwofford.com. Plans for larger changes live in [`plans/`](plans/).

---

## 2026-05-02 — Should you try OpenClaw? ([PR #9](https://github.com/scottwofford/personal-site/pull/9))

- **shared/**: Added `should-you-try-openclaw.md` — practical-decision companion to the OpenClaw essay. Covers when it makes sense to try, why you don't need a Mac Mini (sandbox isolation works on a spare laptop), the separate-signal Mac Mini compute startup, and a 5-step practical baseline if you do start.

## 2026-05-02 — How I'm thinking about AI right now ([PR #7](https://github.com/scottwofford/personal-site/pull/7))

- **shared/**: Added `openclaw-and-ai-take.md` essay. Public-readable take on the OpenClaw clip making the rounds: real signal vs. hype, what OpenClaw actually is, and how I think about AI safety (deployment-boundary work over model-boundary work, why I work on this at Luthien).

## 2026-03-05 — Mike Mantell feedback: homepage + philosophy reframe ([PR #6](https://github.com/scottwofford/personal-site/pull/6))

- **Homepage**: Consolidated 3 paragraphs → 2 (personal + site orientation). Added intro text: "This site has my evolving philosophy, some side projects..."
- **Homepage**: Added Substack icon to social links (Font Awesome 6.5.1 → 6.7.2)
- **Homepage**: Fixed text selection highlighting on dark background (`::selection` in home.css)
- **Philosophy page**: Reframed "consequentialist with modifications" → "philosophical pragmatist"
- **Philosophy page**: Added KRS-One "My Philosophy" quote with Spotify link
- **Philosophy page**: Added SNL p(doom) cliché observation
- **Philosophy page**: Updated synthesis section to match pragmatist framing
- **Source doc**: Updated `dev/sources/scotts_ethics_and_philosophy.md` to match
- All changes mirrored on Spanish (ES) pages
- Mike Mantell debrief notes appended to Google Doc (site feedback, Luthien README feedback, product interest)

## 2026-03-03 — QA trial page update

- Updated QA trial page: README link points to v10, added calendar scheduling link (21c0fbb)

## 2026-02-26 — README link fix

- Fix README link to point to main after PR #179 merged (15a5852)

## 2026-02-24 — Luthien landing page + QA trial + analytics

- **Luthien landing page v8**: Added incidents database carousel, hero section, UX section, architecture diagram, before/after labels, category dots (335e7d9 → 582e5ab, ~20 commits)
- **QA trial page**: Added Upwork onboarding instructions with recording setup, warm-up exercises, play-by-play frustrations section (19751e0 → 0b189b8)
- **Spanish site**: Fixed camp page responsive, added "hijos chingones" translation (e5efa27, 4bc8e33, 331c8d5)
- **Analytics**: Added GoatCounter to all 62 remaining HTML pages (8a2ccf2)
- **QA pass**: Tablet responsive fixes, blog dark theme, sitemaps, dedup nav (4e2e464)

## 2026-02-23 — Summer camp + Spanish sync + mobile nav

- **Tio Escott's Summer Day Camp**: Added flyer page with philosophy, FAQ, schedule sections (43502ce → 50211b7)
- **Mobile nav**: Full-screen 2-column overlay on expand (a4eec5c)
- **Spanish sync**: Synced all Spanish pages with English nav, links, and content (d30df9b → ce48c51)
- **Shared CSS**: Extracted homepage styles into `home.css` used by EN + ES (3c9ef61)
- **ES toggle**: Fixed flag toggle positioning (58d381a, b56a212)

## 2026-02-19 — Dropbox content audit ([PR #5](https://github.com/scottwofford/personal-site/pull/5))

- Moved dropbox hydration scripts to drive-sync repo (a53988c)
- Restored OBJECTIVE.md to main version (ec1867c)

## 2026-02-18 — Spanish site + mobile responsive

- **Spanish translation**: Complete Spanish version of the site (e3177e0)
- **Mobile responsive**: Improved responsiveness across all pages (21848ca)
- **Style**: Replaced em dashes with colons/periods/commas across EN and ES (d90ad4f)

## 2026-02-08 — Cleanup

- Removed LinkedIn research files (moved to private repo) (9d71b13)
- Added personal Drive config, session objective and notes (e424c54)

## 2026-02-04 — GitHub + restructure

- Added GitHub icon to social links (ffae95d)
- Restructured: renamed `focus/` → `productivity/`, added Context Management post, moved Claude prompt (09fde3a)
- Added GitHub profile suggestions doc (112717d)

## 2026-01-31 — Philosophy section ([PR #1](https://github.com/scottwofford/personal-site/pull/1))

- **Philosophy & Epistemics section**: Personal philosophy page + Wrong on Internet page (be50b2f → a25e820)
- **Hover image previews**: Added hover previews for kids, Goodreads, Spotify links (050a15e)
- **Social links**: Added Goodreads icon, reordered links (d8b6699, 53b7231)

## 2026-01-27 — Content expansion + nav + analytics

- **Expand toggle**: [+] button in nav expands all dropdowns inline (d37ae66)
- **Making Decisions page**: Decision-making frameworks (0a31d87)
- **Section nav**: Wikipedia-style breadcrumb + sibling links on all content pages (03c6c8c)
- **Shared CSS**: Extracted inline styles to `/styles.css` (e3f5b8e)
- **Content pages**: Converted all markdown content to HTML (5 Choices, Mini-PRFAQ, Tracker Templates, Meeting Agenda, Book Snippets, Pyramid Principle, Writing Guide, and more)
- **Analytics**: GoatCounter integration (daa95a6)
- **Mobile nav**: Right-aligned 3x3 layout (2384d74)

## 2026-01-26 — Initial launch

- Homepage with dropdown navigation
- Content sections: Focus, Building, People, Reading, Writing
- Social links (LinkedIn, X, Instagram, Facebook, Spotify)
- GitHub Pages hosting with custom domain (scottwofford.com)
- CNAME, robots.txt blocking /luthien-docs/
