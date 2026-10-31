"""Build the two requirements pages on scottwofford.com from the public copy.

Source: the redacted, generated copies in LuthienResearch/luthien-contributors
(process/requirements/). Those are made by Scott's private export script, which
applies the redactions; this script only renders them as site pages.

Run from the repo root:
  uv run --with markdown python dev/build_requirements_pages.py [path/to/luthien-contributors]
"""
import hashlib
import posixpath
import re
import sys
from pathlib import Path

import markdown

# Where the public copy lives (default: a sibling checkout of luthien-contributors).
# First argument that is not a flag (like --stamp) is the luthien-contributors checkout.
ARGS = [a for a in sys.argv[1:] if not a.startswith("--")]
CONTRIB = Path(ARGS[0] if ARGS else Path.home() / "build/luthien-contributors")
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

# Interface text per language. Spanish pages render Claude-made translations
# (not reviewed by a person) kept in dev/sources/es/. Each translation's first
# line records the hash of the English text it was made from; when English
# changes, the build warns and the Spanish page says it is out of date.
LANG = {
    "en": dict(lang="en", p="/", home="home", section="building", day1="Day 1", decisions="Decisions",
               trackers="Trackers", req="Requirements", cross="Cross-surface", updated="Last updated",
               sot='Source of truth: <a href="{src}">my private {name}</a>; this page is a redacted mirror and may lag behind it.'),
    "es": dict(lang="es", p="/es/", home="inicio", section="construir", day1="Día 1", decisions="Decisiones",
               trackers="Seguimiento", req="Requisitos", cross="Entre superficies", updated="Última actualización",
               sot='Versión en inglés: <a href="{en_url}">{en_title}</a>. Fuente de verdad: <a href="{src}">mi {name} privado</a>. Esta página es una traducción automática, hecha por Claude y sin revisión humana, de una copia con partes omitidas.',
               stale='<strong>Esta traducción está atrasada respecto de la <a href="{en_url}">versión en inglés</a>.</strong> '),
}
INTRO_REQ_ES = ('Los cuerpos completos detrás del índice de una línea en <a href="/es/building/claude-code-config.html">mi página de CLAUDE.md</a>. '
                "Generados a partir de mis documentos privados, sin detalles personales, asuntos privados de otras personas ni montos de dinero.")
INTRO_CLAUDE_ES = ('<a href="https://code.claude.com/docs/en/best-practices#write-an-effective-claude-md"><code>CLAUDE.md</code></a> '
                   "es un archivo especial que Claude Code lee al inicio de cada conversación. Este es el mío, generado a partir del archivo real "
                   "sin detalles personales, asuntos privados de otras personas ni montos de dinero.")
ES_SOURCES = Path("dev/sources/es")
ES_PAGES = [
    ("requirements/scott-response-req.md", "es/building/response-requirements.html", "Mis requisitos de respuesta", INTRO_REQ_ES),
    ("requirements/cross-surface-context-mgmt-req.md", "es/building/cross-surface-requirements.html", "Mis requisitos entre superficies", INTRO_REQ_ES),
    ("scott-claude-md.md", "es/building/claude-code-config.html", "Mi CLAUDE.md", INTRO_CLAUDE_ES),
]

PUBLIC_COPY = "https://github.com/LuthienResearch/luthien-contributors/tree/main/process/requirements"

TEMPLATE = """<!DOCTYPE html>
<html lang="{lang}">
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
    <a href="{p}">← {home}</a> / <a href="{p}building/" class="section-name">{section}</a>
    <div class="siblings">
      <a href="{p}building/day-1-philosophy.html">{day1}</a>
      <a href="{p}building/making-decisions.html">{decisions}</a>
      <a href="{p}building/mini-prfaq-template.html">Mini-PRFAQ</a>
      <a href="{p}building/tracker-templates.html">{trackers}</a>
      <a href="{p}building/onboarding-reading-list.html">Onboarding</a>
      <a href="{p}building/claude-code-config.html"{cur_claude}>CLAUDE.md</a>
      <a href="{p}building/response-requirements.html"{cur_resp}>{req}</a>
      <a href="{p}building/cross-surface-requirements.html"{cur_cross}>{cross}</a>
    </div>
  </div>
  <h1>{title}</h1>

  <div class="callout">
    <p>{intro} {sot}</p>
  </div>

  <hr>

{body}

  <hr>

  <p><em>{updated}: {date}.</em></p>
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


def en_hash(src):
    """Hash of the English copy without its first line (the export banner, whose date changes every run)."""
    body = (PROCESS / src).read_text().split("\n", 1)[1]
    return hashlib.sha256(body.encode()).hexdigest()[:12]


# --stamp: after updating a translation, record the English hash it now matches.
if "--stamp" in sys.argv:
    for src, _out, _title, _intro in ES_PAGES:
        f = ES_SOURCES / Path(src).name
        first, rest = f.read_text().split("\n", 1)
        first = re.sub(r"en-sha256: [0-9a-f]+", f"en-sha256: {en_hash(src)}", first)
        f.write_text(first + "\n" + rest)
        print(f"stamped {f}")
    sys.exit(0)

EN_BY_SRC = {src: (out, title) for src, out, title, _ in PAGES}
JOBS = [("en", src, out, title, intro, PROCESS / src) for src, out, title, intro in PAGES]
JOBS += [("es", src, out, title, intro, ES_SOURCES / Path(src).name) for src, out, title, intro in ES_PAGES]

for lang, src, out, title, intro, path in JOBS:
    text = path.read_text()
    L = LANG[lang]
    en_out, en_title = EN_BY_SRC[src]
    stale = ""
    if lang == "es":
        m = re.search(r"en-sha256: ([0-9a-f]+)", text.splitlines()[0])
        if not m or m.group(1) != en_hash(src):
            print(f"WARNING: {path} is out of date with the English copy; re-translate, then run with --stamp")
            stale = L["stale"].format(en_url="/" + en_out)
    # Drop the generated-copy header (first line, a blockquote) and the doc's own H1; the page supplies both.
    date = re.search(r"(\d{4}-\d{2}-\d{2})", text.splitlines()[0]).group(1)
    lines = text.splitlines()
    if lines and lines[0].startswith("> "):
        lines = lines[1:]
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
        sot=stale + L["sot"].format(src=PRIVATE_BASE[src] + PRIVATE_NAME[src], name=PRIVATE_NAME[src],
                                    en_url="/" + en_out, en_title=en_title),
        intro=intro,
        **{k: v for k, v in L.items() if k not in ("sot", "stale")},
        cur_claude=' class="current"' if "claude-code" in out else "",
        cur_resp=' class="current"' if "response" in out else "",
        cur_cross=' class="current"' if "cross-surface" in out else "",
    )
    Path(out).write_text(html)
    print(f"wrote {out}")
