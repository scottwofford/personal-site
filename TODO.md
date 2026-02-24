# TODO

## Blog Post Ideas

- [ ] **"Learning to Code at 37 with AI"** (recommended for Substack post #2)
  - Why I decided to learn (not to become an engineer, but to remove bottlenecks)
  - What "AI-assisted development" actually looks like day-to-day
  - What I can do now vs. 6 months ago
  - Honest assessment: what AI handles well, what still requires humans
- [ ] "Why I'm Building Luthien" — connect personal philosophy values to the product
- [ ] "My Community Notes Hobby" — deeper dive into fact-checking, Spanish-language work
- [ ] "From Amazon to AI Safety" — career transition narrative

## Site Improvements

- [ ] Create Spanish version of site
- [ ] Add HPMOR review to site (see `dev/notes/hpmor-review.md` for options)
- [ ] Automate Goodreads hover image so it doesn't get stale (ideas: Goodreads API, scheduled screenshot, or embed widget)
- [ ] Automate Spotify hover image so it doesn't get stale (ideas: Spotify API, scheduled screenshot, or embed widget)
- [ ] Sustainable i18n solution for EN/ES homepage — currently duplicated HTML with shared CSS (`home.css`). Consider a template system (Jinja, Nunjucks, or simple build script) that generates both pages from one template + two content files to eliminate drift

## Open Note Network / Community Notes Automation

- [ ] Clone Steve's repo: `git clone https://github.com/scisley/opennotenetwork.git`
- [ ] Read the [detailed writeup](https://github.com/scisley/opennotenetwork/blob/main/docs/writeup/final_writeup.md) to understand the architecture
- [ ] Ask Claude Code to explore the codebase and identify what's needed to run it
- [ ] Try to get a local instance working
- [ ] Experiment with automating Community Note generation using Claude Code / Cowork
