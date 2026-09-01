# Changelog

All notable changes to scottwofford.com. Plans for larger changes live in [`plans/`](plans/).

---

## 2026-08-31 - Kids' games published at /games/ ([PR #22](https://github.com/scottwofford/personal-site/pull/22))

- The kids' games now live on the site at `scottwofford.com/games/`, with each kid at their own URL: [/games/adrian/](/games/adrian/), [/games/rafa/](/games/rafa/), [/games/gio/](/games/gio/), [/games/gabriel/](/games/gabriel/), [/games/victoria/](/games/victoria/). Previously they were only reachable at `scottwofford.github.io/adrian-maze-game/`.
- `games/` holds only the playable files (index.html, game.js, Rafa's drawing). The source of truth stays in [scottwofford/adrian-maze-game](https://github.com/scottwofford/adrian-maze-game); the dev notes, tests and learning folders are not copied.
- Added `.github/workflows/sync-kids-games.yml`: every 30 minutes (and on demand) it pulls the games repo and commits any change into `games/`, so a kid's change reaches the site without a manual copy. It uses the repo's own `GITHUB_TOKEN`, no extra secret.
- The camp page's embedded game now loads `/games/` instead of the github.io URL, so the games are served from this domain. Mirrored on the ES camp page.
- Verified with Playwright: all five games load from `/games/` with no console errors, the menu's five cards resolve, and the camp iframe points at `/games/`.

## 2026-08-31 - Camp visual schedule ([PR #21](https://github.com/scottwofford/personal-site/pull/21))

- Replaced the placeholder with a kid-readable horizontal schedule: times appear only in the leftmost column, color bands distinguish the blocks, and each day aligns to the same A–D blocks.
- Block A makes the office game-building and garage art-studio split explicit. Block B is the Shorewood Elementary walk and playground through lunch. Block C is karaoke and a dance party. Block D is outdoor play with the trampoline and soccer.
- The Monday playground block explicitly assigns Danna and Elizabeth to lead while Scott attends his 10:30–11:15 meeting and bikes over afterward.
- Removed the cancelled Tuesday sleepover.
- Simplified the schedule labels, removed the Spanish-instruction footnote, and made the 5:30 entry the same parent show-and-tell / concert across all three days.
- Added a 10:30 morning snack before the playground block.
- Uses cars for the arrival icon.
- Gives Monday's morning snack the same color as the walk/playground block to mark Scott's meeting window.
- Adds musical-instrument emojis to the 5:30 parent show-and-tell / concert.
- Mirrored on the Spanish camp page.

## 2026-06-17 - Writing Resources: source the writing principles ([PR #17](https://github.com/scottwofford/personal-site/pull/17))

- Principle 1 (weasel words) now quotes Wikipedia's definition verbatim, links the [Weasel word](https://en.wikipedia.org/wiki/Weasel_word) page, and gives three examples ("some people say," "it is believed," "research shows").
- Added inline source citations to the jargon and passive-voice principles ([Orwell](https://www.orwellfoundation.com/the-orwell-foundation/orwell/essays-and-other-works/politics-and-the-english-language/), [Strunk & White](https://www.gutenberg.org/ebooks/37134), [plainlanguage.gov](https://www.plainlanguage.gov/)).
- Rebuilt the Resources list with real links + one-line descriptors: Minto, Orwell, Elements of Style, On Writing Well, Wikipedia Weasel word / Words to watch / Signs of AI writing, plainlanguage.gov.
- Mirrored on the ES page. No em dashes; uses the site's existing " - " hyphen style.

## 2026-06-14 — Camp page: multi-game menu copy, language flag, section highlight ([PR #16](https://github.com/scottwofford/personal-site/pull/16))

- The embedded camp game now loads the kids' games menu (Adrian, Rafa, Victoria) instead of just Adrian's maze, so the Sampler copy was updated to match: heading "Try Adrian's Game" → "Play the Kids' Games", intro names all three games, the fixed Dinosaur/Robot controls became a generic "pick a game, each shows its own controls" line, and the Adrian-only "race to the green door" note generalized to "Built by kids with Claude Code."
- Added the site language flag to the sticky nav (EN → 🇪🇸, ES → 🇬🇧), matching the homepage `.lang-toggle` convention; placed in the nav so it doesn't collide with the breadcrumb.
- Sticky section nav now highlights the section currently in view (scroll-position based).
- Mirrored on the ES page. Verified with Playwright: no console errors, correct flag hrefs, scroll-spy tracks all five sections.

## 2026-06-07 — Mobile responsiveness for content pages ([PR #3](https://github.com/scottwofford/personal-site/pull/3))

- **styles.css**: added 768px and 480px breakpoints (reduced padding, scaled headings/tables/pre, flex-wrap siblings) plus a `.table-wrap` horizontal-scroll utility. Covers every content page that links the shared stylesheet (EN + ES).
- **blog/index.html**: added a 600px breakpoint (padding, heading, post-title, subscribe-box scaling).
- **luthien/shipping-log.html**, **luthien/customer-discovery.html** and their **es/** mirrors: added inline 768px + 480px breakpoints (these pages are self-contained and don't link `styles.css`).
- Rebuilt on current `main`: dropped the original branch's `index.html` edit, which was obsolete once the homepage moved to `home.css` (it carries its own breakpoints).

## 2026-06-04 — Faithful republish of the Claude config + system-prompt pages ([PR #11](https://github.com/scottwofford/personal-site/pull/11))

- The pages had drifted into a thin synthesis that omitted the real framework. Republished both as faithful, near-complete adaptations of the current artifacts; default flipped to include-everything, redact-with-reason.
- **building/claude-code-config.html**: real CLAUDE.md (identity + documented weaknesses, all always-on conventions, the three highest-emphasis rules, cross-surface behavior, the R1-R14 one-line index, when-helping-me-code, full push-back table). Evolution notes moved to a labeled appendix ("notes, not part of the file"); "Why This Works" removed.
- **productivity/claude-system-prompt.html**: real claude.ai "Instructions for Claude" (communication, human-compatible philosophy, working-with-me, technical problem-solving + action hierarchy, full in-all-replies meta-bracket).
- Redacted only names, money, internal specifics, private paths, and Drive/Trello/Dropbox IDs; dropped operational plumbing. Spanish mirrors rewritten. Sensitive-token + em-dash scan clean. Stale Context bio left as-is (separately backlogged).

## 2026-06-03 — Evolved Claude config pages ([PR #10](https://github.com/scottwofford/personal-site/pull/10))

- **building/claude-code-config.html**: added "How my setup has evolved (2026)" section showcasing the current framework (surface-agnostic behavioral requirements, verify-before-asserting + cite-primary-sources, Bayesian evidence weighting, separate-critic pressure-testing, positives-over-prohibitions / "pink elephant", show-conclusions-not-deliberation, prune-for-length). "Show don't tell" signal for collaborators / MATS advisors.
- **productivity/claude-system-prompt.html**: replaced the abandoned context-window-% line with the current context-rot self-check.
- Spanish mirrors updated for both; dates refreshed to June 2026.
- Curated + scrubbed to the existing public bar (no names, money, fundraising, internal strategy, paths, or IDs); sensitive-token scan clean.

## 2026-05-09 — /substances drug-harm chart (standalone, not linked from main)

- **substances/**: New standalone page hosting an updated 2026 version of the Wikipedia ["Drug danger and dependence" chart](https://en.wikipedia.org/wiki/File:Drug_danger_and_dependence-small.png) (originally Gable 2006 / methodology Gable 2004). Adds fentanyl, carfentanil, methamphetamine, oxycodone, alprazolam, GHB.
- **`noindex, nofollow`** meta + not linked from main nav — accessible only by direct URL.
- Includes above-the-fold reader warnings (acute-only, uncertainty, polysubstance, carfentanil-undetermined, author-additions disclaimer).
- Adversarial pre-publish review (`/devil`) flagged placement issues for 8+ substances and methodology gaps; flagged items are listed transparently on the page as unresolved. Chart shipped as draft / commentary, not authoritative reference.
- Conservative SVG fixes applied: title prefixed "Acute," subtitle corrected to Gable (2006) + 2004 methodology citation, legend "Narcotic" → "Opioid." Coordinate corrections from devil critique deliberately not yet applied (depend on which sources to trust; Scott to weigh in).

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
