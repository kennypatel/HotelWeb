#!/usr/bin/env python3
"""
generate_outreach_drafts.py — merge prospects + templates into per-prospect DRAFTS.

Human-in-the-loop by design:
- Every draft contains a [PERSONAL LINE — WRITE THIS YOURSELF] placeholder.
- Nothing is sent, queued, or addressed; output is markdown files Kenny edits and sends manually.
- Caps at --top N (default 30) to enforce the ≤30/day volume rule.

Usage:
    python3 scripts/generate_outreach_drafts.py \
        --in output/backlink_prospects_verified.csv \
        --outdir output/outreach_drafts --top 30
"""
import argparse, csv, re
from pathlib import Path

# Map prospect Category (loose match) -> template number in outreach_templates.md
TEMPLATE_MAP = [
    (r"publication|blog|media|magazine|newsletter", "1 — Guest post pitch"),
    (r"podcast", "2 — Podcast pitch"),
    (r"ai director", "8 — AI directory request"),
    (r"saas|software|review director|b2b", "7 — SaaS directory request"),
    (r"startup|launch|company database|founder community", "3 — Directory submission"),
    (r"vendor|association|lodging|hospitality assoc|owner assoc", "9 — Hotel vendor listing request"),
    (r"resource", "4 — Resource page request"),
    (r"founder|interview|press|journalist", "6 — Founder story pitch"),
    (r"chamber|local|business director", "3 — Directory submission"),
    (r"pms|tech vendor|partner", "10 — Partnership backlink request"),
]

def pick_template(category: str) -> str:
    c = (category or "").lower()
    for pat, name in TEMPLATE_MAP:
        if re.search(pat, c):
            return name
    return "3 — Directory submission"

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", default="output/backlink_prospects_verified.csv")
    ap.add_argument("--outdir", default="output/outreach_drafts")
    ap.add_argument("--top", type=int, default=30)
    a = ap.parse_args()

    rows = list(csv.DictReader(open(a.inp, newline="", encoding="utf-8-sig")))
    prio_col = next((c for c in rows[0] if c.lower().startswith("priority")), None)
    rows = [r for r in rows if r.get("Verdict", "LIVE") == "LIVE"]
    rows.sort(key=lambda r: -float(r.get(prio_col, 0) or 0))
    rows = rows[: a.top]

    out = Path(a.outdir); out.mkdir(parents=True, exist_ok=True)
    for i, r in enumerate(rows, 1):
        name = re.sub(r"[^A-Za-z0-9]+", "-", r.get("Name", "prospect")).strip("-")[:60]
        tmpl = pick_template(r.get("Category", ""))
        draft = f"""# OUTREACH DRAFT — {r.get('Name','')}
**Status:** DRAFT — not sent. Kenny writes the personal line, verifies the contact, and sends manually.

| Field | Value |
|---|---|
| Site | {r.get('URL','')} |
| Category | {r.get('Category','')} |
| Contact page | {r.get('Contact Page','') or 'FIND ONE — do not send without a named human or official form'} |
| Submission URL | {r.get('Submission URL','')} |
| Target page | {r.get('Suggested Target Page','')} |
| Anchor (suggest only) | {r.get('Suggested Anchor Text','')} |
| Pitch angle | {r.get('Pitch Angle','')} |
| Template to use | #{tmpl} (see seo-system/outreach_templates.md) |

## Opening line
[PERSONAL LINE — WRITE THIS YOURSELF after reading something they actually published]

## Body
Copy template #{tmpl} from seo-system/outreach_templates.md, then:
1. Replace the personalization slot with your line above.
2. Adjust the ask to this prospect's pitch angle (table above).
3. Check anchor_text_strategy.md before suggesting any anchor.
4. Log the send in outreach_tracker.csv (Date Sent, template #, personalization note).

## RESEARCH NOTES
(Claude Code Phase 5 appends 3 bullets here for top-20 prospects: recent articles, themes, suggested angle.)
"""
        (out / f"{i:02d}_{name}.md").write_text(draft, encoding="utf-8")
    print(f"{len(rows)} drafts → {a.outdir} (placeholders intact; nothing sent)")

if __name__ == "__main__":
    main()
