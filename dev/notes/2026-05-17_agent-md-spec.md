⚠️ DO NOT RELY ON THIS SOURCE AS AUTHORITATIVE. Claude-generated, Scott-unreviewed. Build date: 2026-05-17.

# AGENTS.md spec: what it is, whether to adopt

## What it is

[AGENTS.md](https://agents.md/) is a plain-Markdown file at a repo root that AI coding agents read at session start. "README for agents." No schema, no YAML front-matter, no required fields. Closest file in directory tree wins (nesting supported for monorepos; OpenAI's main repo has 88 nested AGENTS.md files).

Recommended sections (suggested, not enforced): project overview, build and test commands, code style, testing instructions, security, commit/PR guidelines, deployment.

## Origin and stewardship

Emerged from a collaboration between OpenAI Codex, Amp (Sourcegraph), Jules (Google), Cursor, and Factory. Now stewarded by the Agentic AI Foundation under the Linux Foundation. As of May 2026: 60k+ open-source projects use it.

Supported natively by: Codex, Jules, Factory, Aider, goose, VS Code, Devin, GitHub Copilot, Cursor, others.

## Relationship to CLAUDE.md

Claude Code does NOT natively read AGENTS.md. [GitHub issue #6235](https://github.com/anthropics/claude-code/issues/6235) (opened Aug 2025) requests support; no Anthropic response as of May 2026.

Three standard workarounds:

1. **Symlink** (`ln -sf AGENTS.md CLAUDE.md`). Single source of truth, transparent to Claude Code (follows symlinks). Loses ability to maintain Claude-specific instructions separately.
2. **`@import` in CLAUDE.md** (`@AGENTS.md` line inside CLAUDE.md). Claude inlines the referenced file. Claude-specific only; other tools don't honor `@import`.
3. **Pointer file** ("READ AGENTS.md FIRST!!!" in CLAUDE.md). Brittle, depends on agent compliance.

## Scott's current state

Mixed and inconsistent. Search across `~/build/` shows AGENTS.md already exists in:

- `~/build/AGENTS.md` → symlink to `CLAUDE.md` (CLAUDE.md canonical, points to `private-claude-code-docs/CLAUDE.md`)
- `~/build/luthien-proxy-readme-automode/AGENTS.md` (canonical file, 17.5KB) with `CLAUDE.md → AGENTS.md` symlink
- `~/build/counterweight/AGENTS.md` (canonical), plus nested in `progress/` and `asks/`
- `~/build/luthien-org/public-repo-internal-archive/2026-02-25-repo-simplification/AGENTS.md`

Main `luthien-proxy/` checkout: CLAUDE.md only, no AGENTS.md (the parent agent's claim that AGENTS.md is canonical there with CLAUDE.md as symlink is incorrect for the current checkout; it's true in the `luthien-proxy-readme-automode` worktree).

`private-claude-code-docs/`: CLAUDE.md only.

So two directions coexist in Scott's environment: AGENTS.md → CLAUDE.md (at `~/build/`) and CLAUDE.md → AGENTS.md (at `luthien-proxy-readme-automode/`).

## Should Scott adopt anything

**Recommendation: standardize on AGENTS.md as the canonical file with CLAUDE.md as the symlink, for repos Claude isn't the only agent touching.**

Reasoning:

- AGENTS.md is the cross-tool standard (60k repos, Linux Foundation stewardship). CLAUDE.md is Anthropic-proprietary.
- Scott uses Codex occasionally and may onboard others. If a teammate runs Codex / Cursor / Aider against luthien-proxy or luthien-org, they'd silently get no context unless the canonical file is AGENTS.md-named.
- The symlink direction at `luthien-proxy-readme-automode/` (AGENTS.md canonical) is the right one; the `~/build/AGENTS.md → CLAUDE.md` direction at the home dir is backwards relative to the convention but low-stakes (home-dir CLAUDE.md is Scott-personal).
- Risk of switching: zero behavior change for Claude Code (follows symlinks transparently). All Scott's CLAUDE.md sidecars, requirements docs, and skill references keep working.

**Concrete suggested actions** (not done; flagging for Scott's decision):

1. `luthien-proxy` main repo: rename `CLAUDE.md` to `AGENTS.md`, create `CLAUDE.md → AGENTS.md` symlink. The file is already titled "Repository Guidelines" (not "CLAUDE.md"), so the content is already agent-agnostic in tone.
2. `luthien-org`: same pattern if any repo-root CLAUDE.md exists.
3. `private-claude-code-docs`: leave alone. This file is Claude-Code-specific by design (mentions "Claude Code sessions," "Claude Code's mechanics," skill names, hook paths). Renaming to AGENTS.md would falsely advertise it as tool-agnostic. Keep as CLAUDE.md.
4. `~/build/AGENTS.md → CLAUDE.md`: reverse it (CLAUDE.md becomes the symlink, AGENTS.md the canonical) only if Scott wants Codex sessions at the home dir to load his personal preferences. Otherwise leave alone; it's harmless either direction.

**What Scott's CLAUDE.md setup could borrow from the AGENTS.md spec:**

Nothing structural. Scott's CLAUDE.md is already past the AGENTS.md recommended sections in sophistication (12 Rs, 7 tenets, surface-agnostic requirements, session-log workflow). The AGENTS.md spec is a minimum-viable convention; Scott is operating well above the floor.

The one borrow-worthy idea: **nested AGENTS.md per subdirectory** for monorepos with distinct sub-contexts (e.g., a `tests/AGENTS.md` with test-specific conventions, a `migrations/AGENTS.md` with schema-change rules). Already in use at `luthien-proxy-readme-automode/migrations/AGENTS.md` and `saas_infra/AGENTS.md`. Worth replicating to the main `luthien-proxy/` checkout if and when those subdirs accumulate distinct conventions.

## Sources

- [AGENTS.md spec site](https://agents.md/)
- [agentsmd/agents.md GitHub repo](https://github.com/agentsmd/agents.md) (21.5k stars, MIT)
- [OpenAI Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md)
- [Claude Code issue #6235: support AGENTS.md](https://github.com/anthropics/claude-code/issues/6235)
- [aihero.dev: A Complete Guide to AGENTS.md](https://www.aihero.dev/a-complete-guide-to-agents-md)
- [coding-with-ai.dev: Sync Claude Code, Codex, Cursor memory](https://coding-with-ai.dev/posts/sync-claude-code-codex-cursor-memory/)
- [InfoQ: AGENTS.md emerges as open standard](https://www.infoq.com/news/2025/08/agents-md/)
