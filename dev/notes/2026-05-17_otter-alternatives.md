> ⚠️ **DO NOT RELY ON THIS SOURCE AS AUTHORITATIVE.** Claude-generated, Scott-unreviewed. Built 2026-05-17 from public vendor sites (linked inline). All accuracy / feature claims are vendor marketing; no third-party benchmarks pulled. Verify pricing and feature flags before switching.

# Otter alternatives: Fathom, Jamie, Fireflies

Researched per [Trello: Evaluate Otter AI alternatives - Fathom, Jamie, Fireflies](https://trello.com/c/EuQ9Dsf1).

## TL;DR

**Stay on Otter.** None of the three alternatives clearly win on the specific axis that matters for the Plaud → cloud-transcription pipeline (unlimited external audio file uploads on a cheap or free tier), and switching cost (re-training workflow + breaking the Plaud handoff) dominates any marginal AI-summary upside.

Closest real contender: **Fireflies free tier** (audio upload supported, $0, 800 min storage), worth a side-by-side test on a single Plaud recording before committing.

## Comparison

| Vendor | Cheapest plan with audio upload | AI summary claims | Auto-join behavior | Audio file upload | Differentiator (their words) |
|---|---|---|---|---|---|
| [Otter](https://otter.ai) | Business $19.99/mo | "Automated summaries capturing decisions and action items"; Claude / ChatGPT MCP integration | Bot joins Zoom / Meet / Teams | Yes (Business: "Unlimited audio/video file imports") | "World's only Conversational Knowledge Engine" |
| [Fathom](https://fathom.ai) | Free (unlimited recordings + transcripts); Premium $20/mo for advanced summaries | "Shockingly accurate transcripts"; "Ask Fathom" Q&A; AI-generated action items | Bot or bot-free desktop capture | **Not advertised on pricing page**; appears to be a meeting-recorder, not a file-upload service | "Capture notes your way: bot or no bot" |
| [Jamie](https://meetjamie.ai) | Free (10 meetings/mo, 30 min cap); Plus €21/mo | "Human-like summaries in 99+ languages"; ask-anything Q&A across meetings | **No bot**; runs as local app | Not specified | "The privacy-first AI note taker. Without a bot." |
| [Fireflies](https://fireflies.ai) | **Free** (unlimited transcription, 800 min storage, audio upload included); Pro $10/mo annual | "Industry leader in transcription accuracy" (95% claim); overview + bullets + action items + custom notes | Bot auto-joins calendar meetings; also invitable | **Yes, on free tier**: MP3, MP4, WAV, M4A | "Transcribe, summarize, search across all team conversations" |

## What matters for Scott's actual workflow

Plaud Note Pro records audio. The transcription happens after the fact, asynchronously, via upload. So the load-bearing feature is **audio file upload on a cheap tier**, not "bot quality at joining live calls."

That collapses the field:

- **Fathom**: built around live-meeting capture (bot or desktop app). Pricing page doesn't surface audio-file upload at all. Likely a poor fit for the Plaud pipeline; ruled out.
- **Jamie**: "without a bot" is the entire pitch, but their model is local-desktop capture of live meetings. No mention of file upload. Also EUR-priced, suggests Europe-first product. Ruled out.
- **Fireflies free**: audio upload included, unlimited transcription, 800 min storage cap. The cap is the friction; for Scott's volume (multiple user interviews + investor calls per week, each ~30 to 60 min), 800 min ≈ 13 hours of stored recordings, which fills up fast. Free is a real trial-able option; Pro at $10/mo annual ($120/yr) beats Otter Business at $19.99/mo ($240/yr) by half.
- **Otter (incumbent)**: $19.99/mo, Business tier explicitly lists unlimited audio/video imports, has MCP integration with Claude (potentially useful given Scott's Claude Code workflow).

## Pricing comparison (Scott-relevant tiers only)

| Plan | $/month | $/year | Audio upload | Notes |
|---|---|---|---|---|
| Otter Basic (free) | $0 | $0 | No | Live meetings only |
| Otter Business | $19.99 | $240 | Unlimited | Current Scott plan presumably |
| Fireflies Free | $0 | $0 | Yes | 800 min storage cap |
| Fireflies Pro (annual) | $10 | $120 | Yes | 8,000 min storage, unlimited summaries |
| Fathom Free | $0 | $0 | Unclear | Built for live meetings |
| Fathom Premium | $20 | $240 ($192 annual) | Unclear | Adds advanced summaries |
| Jamie Free | €0 | €0 | Unclear | 10 meetings/mo, 30 min cap |
| Jamie Plus | €21 | €250 | Unclear | 20 meetings/mo, 2hr cap |

## Stay or switch

**Stay on Otter.**

Reasoning:
1. **Switching cost is real.** Plaud → Otter pipeline works; muscle memory for finding past transcripts is built; existing transcript history is searchable in Otter. None of the alternatives offer a 10x feature that justifies re-learning the workflow during a fundraise.
2. **Fireflies is the only plausible threat**, and only on price ($120/yr vs $240/yr). Not enough to justify the switch unless Scott runs a 1-week side-by-side trial on identical Plaud recordings and Fireflies wins clearly on transcription accuracy or summary quality.
3. **Fathom and Jamie are misaligned with the asynchronous-upload use case.** They're built around live-meeting capture and AI-during-the-call. Wrong shape for Plaud workflow.
4. **Otter's Claude MCP integration is a real-and-growing edge** given Scott's Claude Code stack; that's strictly better than the alternatives on the dimension where Scott's tool integration matters most.

## If Scott wants to validate cheaply

Run a 30-minute test on one Plaud recording:
- Upload the same audio to Fireflies Free and Otter
- Compare: transcription accuracy on Scott-specific terms ("Luthien," "Jai," investor names), summary quality, action-item extraction
- If Fireflies wins on both axes and the $120/yr savings matters, switch. Otherwise stay.

Estimated Scott time: 20 min (upload + read both transcripts + compare).
