# Plan: Debrief Mike Mantell Convo & Update scottwofford.com

**Date:** 2026-03-05
**PR:** [#6](https://github.com/scottwofford/personal-site/pull/6)
**Status:** Implemented

## Context

Scott had a conversation with Mike Mantell (Feb 15, 2026) that included feedback on scottwofford.com and Luthien's README. The Google Doc for site notes (`1PDWfnRvuUHY0LQ-IcxeYE-49pTRqS8JYz4yAEsLUMQQ`) was started but barely filled in. Scott also wanted to update his philosophy page to shift from "consequentialist" to "pragmatist" framing, add an SNL p(doom) reference, and add a "My Philosophy" by BDP Spotify link.

**Scope:** scottwofford.com only. Luthien README feedback captured in debrief notes for Scott's follow-up call with Mike.

## Steps

### Step 1: Append Mike Mantell debrief to Google Doc
Appended structured notes covering site feedback (action items), Luthien README feedback (for reference), and Mike's product interest (for follow-up).

### Step 2: Update homepage
- Added intro/orientation text (workshopped from Mike's suggestion)
- Added Substack icon to social links (required FA 6.5.1 → 6.7.2 upgrade)
- Consolidated 3 paragraphs → 2 (personal info + site description)
- Fixed text selection highlighting on dark background

### Step 3: Update philosophy page
- Replaced "consequentialist with modifications" → "philosophical pragmatist"
- Added KRS-One "My Philosophy" quote with Spotify link
- Added SNL p(doom) cliché observation
- Updated synthesis section

### Step 4: Update source doc
Updated `dev/sources/scotts_ethics_and_philosophy.md` to match pragmatist reframe.

### Step 5: Update Spanish pages
All changes mirrored on ES versions.

## Mike's Feedback (Full Reference)

### Site feedback — ACTION ITEMS
- **Homepage needs orientation text** — Mike suggested: "This site is some of the core tenets of my philosophy." → Workshopped into: "This site has my evolving philosophy, some side projects, and some content I've found useful for working with people to build things."
- **~~"Writing" tab is confusing~~** — Already addressed separately.
- **Casual tone works** — confirmed the right vibe.

### Luthien README feedback — FOR REFERENCE
- **PAS framework** (Problem → Agitate → Solution) — currently missing the "agitate" step
- **"Couldn't I just use CLAUDE.md?"** — biggest pushback, README needs explicit comparison
- **"Will a Claude Code update break this?"** — stability concern not addressed
- **Docker is a barrier** — Mike doesn't typically run Docker
- **Marketing framing split** — GitHub README = near-term tool, Website = bigger vision

### Mike as potential user — FOR REFERENCE
- Trader using `dangerouslySkipPermissions` in Claude Code
- Worried about: crypto wallet transactions, unauthorized contract calls, automated Polymarket disputes
- Wants to automate disputes (99%+ correct resolutions, catch ~0.5% wrong with >75% accuracy)
- **Follow-up:** Schedule call; Mike writes rules for things he doesn't want AI to do
