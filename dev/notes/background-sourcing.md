# Background Sourcing Plan (MacBook-Style)

## Goals
- Collect 5–10 high‑resolution, low‑clutter background images.
- Keep attribution and licensing clean.
- Optionally bias results to the visitor’s region without tracking identities.

## Preferred Sources (APIs, not scraping)
- Unsplash API
- Pexels API
- Pixabay API

These providers offer explicit licensing and rate limits. Avoid scraping unknown sites.

## Location-Aware (Privacy‑Safe)
- **Browser:** ask permission; use `navigator.geolocation`.
- **Server:** optional IP‑based geolocation (e.g., ipinfo/ipapi). Ask consent and allow opt‑out.
- Use location only to bias **search terms**, not to identify users.

## Query Strategy (MacBook‑style aesthetics)
- “macro leaves dew”
- “forest rain closeup”
- “minimal nature texture”
- “dark green foliage”
- “soft bokeh leaves”
- “moody botanical”

Filters:
- Landscape orientation
- Aspect ratio near 16:10 or 3:2
- Resolution >= 3840px wide
- Low visual clutter / strong negative space

## Pipeline (High Level)
1. Build query list (optionally add region/city to 1–2 queries).
2. Search via API; collect candidate URLs + metadata.
3. Filter by aspect ratio + minimum resolution.
4. Auto‑rank by palette/clutter heuristics (optional).
5. Save top N with attribution fields.

## Minimal Pseudocode
```
if user_consents:
  location = get_location()
  queries = build_queries(location, base_queries)
else:
  queries = base_queries

results = []
for q in queries:
  results += photo_api.search(q, orientation="landscape", min_width=3840)

filtered = filter_by_aspect_ratio(results, target=16/10)
scored = rank_by_palette_and_clutter(filtered)
save_top_n(scored, n=10)
```

## Attribution Fields to Store
- source (provider)
- photographer
- license / usage link
- original URL
- query used
- date fetched
