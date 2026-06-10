# CLAUDE.md — Anchor for Hotels SEO Execution

You are executing a pre-built SEO system for Anchor for Hotels (anchorforhotels.com). The strategy is DONE — it lives in `/seo-system/`. Your job is implementation: build pages, wire technical SEO, verify prospect data, and prepare (never send) outreach. Do not re-plan, re-audit, or second-guess the strategy files unless they conflict with the live site's reality.

## Business context
- Product: Ava, a 24/7 AI phone agent for hotels/motels (EN/ES, no PMS integration, lead capture + staff escalation)
- Founder: Kenny Patel · Demo line: (256) 809-0866 · Segment: 40–150 room limited-service, franchise + independent
- Live pages: `/` (index), `/hotel-ai-agent.html`, `/hotel-front-desk-overflow.html`, `/privacy.html` — static .html site

## Hard guardrails (non-negotiable, from the project owner)
1. NEVER log into third-party websites, submit third-party forms, or send email. All outreach and directory submissions are HUMAN actions. You prepare; Kenny sends.
2. NEVER scrape or harvest email addresses. Scripts may verify URLs and discover public contact/submission PAGES only.
3. No PBNs, link farms, hidden links, fake reviews/comments, impersonation, or anything that risks a penalty.
4. Anchor-text distribution per `seo-system/anchor_text_strategy.md` (60% branded/naked; exact-match only in editorial placements).
5. One canonical NAP everywhere. Confirm it with Kenny before writing it into any file.
6. All new page copy must be truthful to the actual product. If a claim isn't supported by `seo-system/` files or the live site, ask.

## Repo layout
- `seo-system/` — the 22 strategy/content deliverables (source of truth)
- `site/` — the website source (Kenny: copy your actual site files here, or tell Claude Code where they live / give repo access)
- `scripts/` — automation that's allowed: `verify_prospects.py`, `generate_outreach_drafts.py`
- `output/` — generated artifacts (verified CSVs, outreach drafts)

## Conventions for new pages
- Match the EXISTING site's header, footer, CSS, and voice exactly — read `site/index.html` first and reuse its template verbatim. Do not introduce a new design system.
- Every page: one H1, unique title ≤60 chars and meta 150–160 chars (already written in `seo-system/technical_implementation.md` and `seo_landing_pages.md` — use them verbatim), JSON-LD from the page spec, FAQ section matching the FAQPage schema, demo-line CTA above the fold and at the end, internal links per the hub-and-spoke plan.
- URLs: if the host supports clean URLs, build extensionless paths and 301 the old `.html` paths; otherwise keep `.html` and note it.
- After any page work: regenerate `sitemap.xml`, keep `robots.txt` per `technical_implementation.md`, validate JSON-LD (parse it; no trailing commas), and run an internal link check (no 404s, no orphans).

## Definition of done per phase
See `CLAUDE_CODE_PROMPTS.md`. Work one phase per session; commit with clear messages; never push without Kenny's review of copy diffs.
