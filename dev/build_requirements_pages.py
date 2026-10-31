"""Build the two requirements pages on scottwofford.com from the public copy.

Source: the redacted, generated copies in LuthienResearch/luthien-contributors
(process/requirements/). Those are made by Scott's private export script, which
applies the redactions; this script only renders them as site pages.

Run from the repo root:
  uv run --with markdown python dev/build_requirements_pages.py [path/to/luthien-contributors]
"""
import posixpath
import re
import sys
from pathlib import Path

import markdown

# Where the public copy lives (default: a sibling checkout of luthien-contributors).
CONTRIB = Path(sys.argv[1] if len(sys.argv) > 1 else Path.home() / "build/luthien-contributors")
PROCESS = CONTRIB / "process"

# Links in the docs are relative to their home in Scott's private repo.
# Rewrite them to absolute GitHub URLs so they don't break on this site.
PRIVATE_BASE = {
    "requirements/scott-response-req.md": "https://github.com/scottwofford/sw-prv/blob/main/requirements/personal/",
    "requirements/cross-surface-context-mgmt-req.md": "https://github.com/scottwofford/sw-prv/blob/main/requirements/",
    "scott-claude-md.md": "https://github.com/scottwofford/sw-prv/blob/main/",
}
# The private file each page mirrors (its source of truth).
PRIVATE_NAME = {
    "requirements/scott-response-req.md": "scott-response-req.md",
    "requirements/cross-surface-context-mgmt-req.md": "cross-surface-context-mgmt-req.md",
    "scott-claude-md.md": "CLAUDE.md",
}
INTRO_REQ = ('The full bodies behind the one-line index on <a href="/building/claude-code-config.html">my CLAUDE.md page</a>. '
             "Generated from my private docs with personal details, other people's private business, and money amounts removed.")
INTRO_CLAUDE = ('<a href="https://code.claude.com/docs/en/best-practices#write-an-effective-claude-md"><code>CLAUDE.md</code></a> '
                "is a special file Claude Code reads at the start of every conversation. This is mine, generated from the real file "
                "with personal details, other people's private business, and money amounts removed.")

# Each page: source file, output path, page title.
PAGES = [
    ("requirements/scott-response-req.md", "building/response-requirements.html", "My response requirements", INTRO_REQ),
    ("requirements/cross-surface-context-mgmt-req.md", "building/cross-surface-requirements.html", "My cross-surface requirements", INTRO_REQ),
    ("scott-claude-md.md", "building/claude-code-config.html", "My CLAUDE.md", INTRO_CLAUDE),
]

PUBLIC_COPY = "https://github.com/LuthienResearch/luthien-contributors/tree/main/process/requirements"

TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} - Scott Wofford</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div class="section-nav">
    <a href="/">← home</a> / <a href="/building/" class="section-name">building</a>
    <div class="siblings">
      <a href="/building/day-1-philosophy.html">Day 1</a>
      <a href="/building/making-decisions.html">Decisions</a>
      <a href="/building/mini-prfaq-template.html">Mini-PRFAQ</a>
      <a href="/building/tracker-templates.html">Trackers</a>
      <a href="/building/onboarding-reading-list.html">Onboarding</a>
      <a href="/building/claude-code-config.html"{cur_claude}>CLAUDE.md</a>
      <a href="/building/response-requirements.html"{cur_resp}>Requirements</a>
      <a href="/building/cross-surface-requirements.html"{cur_cross}>Cross-surface</a>
    </div>
  </div>
  <h1>{title}</h1>

  <div class="callout">
    <p>{intro} Source of truth: <a href="{private_src}">my private {private_name}</a>; this page is a redacted mirror and may lag behind it.</p>
  </div>

  <hr>

{body}

  <hr>

  <p><em>Last updated: {date}.</em></p>
  <!-- GoatCounter analytics -->
  <script data-goatcounter="https://scwoff.goatcounter.com/count"
          async src="//gc.zgo.at/count.js"></script>
</body>
</html>
"""


def absolutize(text, base):
    # Turn markdown links like (../foo.md) or (bar.md#x) into absolute private-repo URLs.
    def fix(m):
        url = m.group(2)
        if re.match(r"^(https?:|mailto:|#)", url):
            return m.group(0)
        # Resolve "../" against the doc's private folder so GitHub can open the URL.
        root, folder = base.split("/blob/main/")
        return f"{m.group(1)}({root}/blob/main/{posixpath.normpath(folder + url)})"
    return re.sub(r"(\[[^\]]*\])\(([^)\s]+)\)", fix, text)


for src, out, title, intro in PAGES:
    text = (PROCESS / src).read_text()
    # Drop the generated-copy header line and the doc's own H1; the page supplies both.
    date = re.search(r"on (\d{4}-\d{2}-\d{2})", text.splitlines()[0]).group(1)
    lines = [l for l in text.splitlines() if not l.startswith("> Generated from")]
    if lines and not lines[0].strip():
        lines = lines[1:]
    if lines and lines[0].startswith("# "):
        lines = lines[1:]
    md = absolutize("\n".join(lines), PRIVATE_BASE[src])
    body = markdown.markdown(md, extensions=["tables", "fenced_code", "toc", "sane_lists"])
    html = TEMPLATE.format(
        title=title,
        body=body,
        date=date,
        public_copy=PUBLIC_COPY,
        private_src=PRIVATE_BASE[src] + PRIVATE_NAME[src],
        private_name=PRIVATE_NAME[src],
        intro=intro,
        cur_claude=' class="current"' if "claude-code" in out else "",
        cur_resp=' class="current"' if "response" in out else "",
        cur_cross=' class="current"' if "cross-surface" in out else "",
    )
    Path(out).write_text(html)
    print(f"wrote {out}")
