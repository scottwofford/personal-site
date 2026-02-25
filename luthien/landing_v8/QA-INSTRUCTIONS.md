# Luthien QA Trial — User Onboarding Flow

**Goal:** Walk through Luthien's onboarding as a new user would. Report what's broken, confusing, or could be better.

**Time estimate:** 60–90 minutes

**What you need:**
- Mac or Linux machine
- Docker Desktop installed and running
- An Anthropic API key (from [console.anthropic.com](https://console.anthropic.com))
- Claude Code installed (`npm install -g @anthropic-ai/claude-code`)

---

## Part 1: Landing Page (10 min)

Open the landing page: **https://scottwofford.com/luthien/landing_v8/**

Answer these questions:

1. **First impression (30 seconds):** Without scrolling, what do you think this product does? Write your answer before scrolling.
2. **Scroll through the carousel.** Do the quotes load/animate correctly? Any broken cards?
3. **Click "more examples →".** Does the incidents page load? Do the filter pills work (click each one)? Does infinite scroll work?
4. **Back on the landing page:** Does the architecture diagram make sense? Could you explain what Luthien does to a coworker?
5. **Click "Book a Call"** — does it open a Google Calendar link?
6. **Click the GitHub link** — does it go to the right repo?
7. **Mobile:** Resize your browser to phone width. Does everything still look right?

**Report format:** For each issue, note:
- What you expected
- What actually happened
- Screenshot if visual

---

## Part 2: README Quick Start (45–60 min)

Now follow the Quick Start on the PR branch README:

**https://github.com/LuthienResearch/luthien-proxy/blob/feedback/tyler-feb-10/README.md**

Start from the top of the README and work your way down:

### 2a. Read the intro sections (5 min)

Before you start installing anything:

1. Read "What is it?" — Is it clear?
2. Look at the Before/After terminal mockups — Do the SVGs render? Do they make sense?
3. Read "How does it work?" — Does the ASCII diagram make sense?
4. Read "What can it do?" — Click the expandable code examples. Do they expand?

### 2b. Follow the Quick Start step by step (30–45 min)

Follow **every step exactly as written.** Do NOT skip ahead or improvise. The point is to test whether a new user can follow these instructions cold.

For each step, note:
- Did the instructions work as written? (yes/no)
- If no: what went wrong? Exact error message + screenshot
- Anything confusing or ambiguous?
- How long did this step take?

| Step | What it says | Your notes |
|------|-------------|------------|
| Prerequisites | Install Docker + uv | |
| Step 1 | Clone + cd | |
| Step 2 | Add Anthropic API key | |
| Step 3 | Run quick_start.sh | |
| Step 4 | Launch Claude Code through proxy | |
| Step 5 | See conversation history | |
| Step 6 | Set up a DeSlop policy | |
| Step 7 | Set up an LLM-as-judge policy | |

### 2c. Verify it actually works (10 min)

Once Claude Code is running through the proxy:

1. Ask Claude Code to do something simple (e.g., "create a hello world python script")
2. Check the conversation history UI — does your conversation show up?
3. If you set up the DeSlop policy: ask Claude Code to write something with em dashes or "I'd be happy to help" — does it get cleaned?
4. Check the activity monitor — do you see requests flowing?

---

## Part 3: Report

Create a Google Doc or markdown file with:

1. **Landing page issues** (Part 1)
2. **README issues** (Part 2a + 2b)
3. **Functionality issues** (Part 2c)
4. **Overall impressions:**
   - How long did the whole thing take?
   - On a scale of 1–5, how easy was it to get running?
   - What was the most confusing part?
   - What would you change first?

Send the report to scott@luthienresearch.org.

---

## Notes

- This is a real onboarding test — if something is broken or confusing, that's valuable feedback, not a failure on your part.
- Don't fix things yourself. Just document what's wrong.
- If you get completely stuck on a step for >10 minutes, note where you got stuck, skip it, and keep going.
- The Quick Start involves Docker building images locally, which can be slow the first time (~5–10 min). That's expected.
