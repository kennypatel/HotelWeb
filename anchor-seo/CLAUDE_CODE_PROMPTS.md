# CLAUDE_CODE_PROMPTS.md — Paste These Into Claude Code, In Order

Run one phase per session. Review the diff before committing each phase.

---

## Phase 0 — Setup (5 min, you do this part)
1. Make a folder, e.g. `anchor-seo/`, and drop in: this file, `CLAUDE.md`, the `seo-system/` folder (all 22 deliverables), and `scripts/`.
2. Copy your real website source into `site/` (or connect the repo that deploys anchorforhotels.com).
3. Install and start Claude Code in that folder. Setup docs: https://docs.claude.com/en/docs/claude-code/overview
4. Paste Phase 1.

---

## Phase 1 — Technical foundation on existing pages

> Read CLAUDE.md, then seo-system/technical_implementation.md and seo-system/seo_audit.md. On the existing pages in site/ (index, hotel-ai-agent, hotel-front-desk-overflow, privacy): apply the updated title tags and meta descriptions exactly as written in technical_implementation.md; add the sitewide Organization JSON-LD to every page head; add Service JSON-LD to the two service pages; confirm each page has exactly one H1 and that the homepage's numbered call-type sections are real heading tags (fix if they're styled divs); add rel=canonical self-references. Create robots.txt and sitemap.xml per technical_implementation.md. Then validate: parse every JSON-LD block, check every internal href resolves, and show me a summary of every change before committing. Do not touch visible copy.

**Done when:** titles/metas/schema live on 4 pages, sitemap + robots exist, zero broken internal links.

---

## Phase 2 — Build the three written landing pages

> Read site/index.html and extract the exact shared template: header, nav, footer, CSS includes, and house styling patterns. Then build three production pages from seo-system/hotel-answering-service.md, overnight-hotel-call-answering.md, and missed-call-recovery-hotels.md — copy, FAQs, CTAs, and JSON-LD verbatim from those files, wrapped in the site's existing template so they're indistinguishable in design from current pages. Use clean extensionless URLs if our hosting supports it (check how the site is deployed and tell me); otherwise .html. Add the internal links specified in each file, add all three pages to the footer Services column per technical_implementation.md, update sitemap.xml. Validate JSON-LD and links as before. Show me each page rendered description before commit.

**Done when:** 3 new pages live in the site source, footer updated, sitemap regenerated.

---

## Phase 3 — Build the remaining 11 landing pages

> Read seo-system/seo_landing_pages.md. Build the remaining 11 pages (specs 2,4,5-upgrade,7,8,9,10,11,12,13,14) using the same site template. The spec gives you slug, title, meta, H1, H2 structure, CTA, internal links, and backlink angle — write the body copy yourself at 900–1,200 words per page, in the same voice as the three finished pages, truthful to the product as described in CLAUDE.md and the seo-system files. Each page gets Service + FAQPage JSON-LD (write 4–6 FAQs that appear visibly on the page). Follow the hub-and-spoke internal link plan in technical_implementation.md, including links FROM the existing hub pages TO new spokes. Work in batches of 3–4 pages and stop for my review between batches. For spec #5, upgrade the existing hotel-front-desk-overflow page rather than duplicating it.

**Done when:** all 14 landing pages live, hub-and-spoke links complete, sitemap regenerated, no orphan pages.

---

## Phase 4 — Verify the prospect database (read-only automation, allowed)

> Run scripts/verify_prospects.py against seo-system/backlink_prospects.csv. It checks each prospect URL's liveness, follows redirects, and probes common contact/submit paths — read-only GET requests, 1 request/second, identifying user agent, no form submissions, no email harvesting. Then review output/backlink_prospects_verified.csv: flag rows that 404ed or redirected to unrelated domains as DEAD, update moved URLs, and re-sort by priority. Summarize: how many verified live, how many dead, how many moved, and list the top 20 live prospects I should start with Monday.

**Done when:** verified CSV in output/, dead rows flagged, top-20 list produced.

---

## Phase 5 — Outreach prep (drafts only — I send everything myself)

> Run scripts/generate_outreach_drafts.py. It merges the top-priority verified prospects with the matching template from seo-system/outreach_templates.md into one draft file per prospect in output/outreach_drafts/, each with a [PERSONAL LINE — WRITE THIS YOURSELF] placeholder that must never be auto-filled. Then, for the top 20 prospects only: fetch each prospect's public site, read 2–3 recent articles or their about page, and append a RESEARCH NOTES section to that prospect's draft — 3 bullet points of what they've published recently and a suggested personalization angle. Do NOT write the personal line itself, do not draft anything as sent, and do not touch email. Finally, populate output/outreach_tracker_seeded.csv with the top 30 prospects in 'queued' status.

**Done when:** drafts + research notes exist for top 20, tracker seeded, nothing sent.

---

## Phase 6 — Blog scaffold

> Create the /blog/ structure per technical_implementation.md section 8 (URL pattern, five category hubs, post template with author box for Kenny, Article JSON-LD, dates). Then convert guest_post_ideas.md ideas #1 and #22 into the first two blog posts (1,000–1,300 words each, written in the established voice) — these are the two the 12-week plan publishes in Week 2. Each post links once to its target landing page with the anchor specified in the idea, plus the FAQ/internal-link conventions. Update sitemap. Note: the five guest_post_N.md articles are reserved for external publications — do NOT publish those on our blog.

**Done when:** blog structure + 2 posts live in site source.

---

## Standing instruction for every phase
Before committing: run the JSON-LD parse check, the internal-link check, and show a file-by-file diff summary. Never deploy without explicit approval. If anything in the strategy files contradicts the live site (pricing wording, features, claims), stop and ask rather than guessing.
