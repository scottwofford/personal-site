# 2026-07-06: Design system extraction

Trello: [Create Scott's design system](https://trello.com/c/zmqZ2VBe)

Goal: write down the site's de-facto design language as an explicit system. Codification only; the site looks identical after this change. No redesign decisions, no cleanup applied yet.

## What shipped

1. **`/tokens.css`**: CSS custom properties for the dominant existing style (colors, type scale, spacing rhythm, radii, layout, transitions). Every value copied verbatim from `styles.css` / `home.css`.
2. **`/design-system/index.html`**: human-readable reference: palette swatches, type specimens, spacing/radii, components in use. Standard content page (styles.css, section-nav, GoatCounter). Not yet linked from the sitemap or homepage nav, and no `es/` mirror yet; both deferred so Scott can decide whether the page should be publicly navigable.
3. **`blog/index.html`** wired to tokens as the single demo page (chosen because it has no `es/` twin and a small inline style block). Hex values in its inline block replaced with `var()` references that resolve to the identical values.

## Inconsistency report (follow-up cleanup, NOT applied)

| Where | Deviation | Cleanup would |
|---|---|---|
| `luthien/customer-discovery.html`, `luthien/shipping-log.html` + `es/` mirrors | Full inline copy of styles.css that has drifted: `p` color `#aaa` vs `#bbb`, `p` margin-bottom `1rem` vs `0.5rem`, `h2` margin `2rem 0 1rem` vs `1.25rem 0 0.5rem`, `h3` margin `1.5rem` vs `1rem` | Link `/styles.css`, delete the duplicated rules, keep only page-specific extras |
| `projects/summer-camp-2026.html` + `es/` mirror | Self-contained inline styles (on-palette); imports Inconsolata `400;600;700` while the rest of the site loads `400;600` | Link `/styles.css` + `/tokens.css`; align the font import |
| `reading/goodreads.html` + `es/` mirror | Self-contained inline styles; links are `#fff` instead of the `#6b9fff` accent | Link shared styles; adopt accent for links (or confirm white links are intentional here) |
| `blog/index.html` | Mobile breakpoint at 600px vs the shared 768px/480px pair | Align breakpoints |
| Accent hover | `#8bb4ff` (blog button) vs `#93b8ff` (landing_v8) vs plain `#6b9fff`-to-`#fff` elsewhere | Standardize on one hover value for accent backgrounds (`#8bb4ff` tokenized as the dominant one) |
| `luthien/landing_v8/`, `luthien/landing_v8-instructions/` | Entirely different design language (Inter + JetBrains Mono on `#09090b`) | Probably intentionally exempt (Luthien product mockups); Scott to confirm |
| `shared/victoria-*.html` (untracked) | Comic Sans on pastel gradient, kid pages | Intentionally exempt |

## Deferred decisions for Scott

- Link `/design-system/` from sitemap and/or homepage nav (needs `es/` mirror per repo convention)?
- Point `styles.css` / `home.css` at the tokens (mechanical, touches every page, needs its own PR)?
- Apply the cleanup table above?
