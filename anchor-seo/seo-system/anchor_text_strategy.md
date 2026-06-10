# Anchor Text Strategy — Anchor for Hotels

## Target distribution (first 100 links)
A natural profile is brand-heavy. Penalized profiles are exact-match-heavy. Hold these ratios:

| Type | Share | Examples |
|---|---|---|
| Branded | 40% | Anchor for Hotels · Anchor · Ava by Anchor for Hotels |
| Naked URL | 20% | anchorforhotels.com · https://anchorforhotels.com |
| Generic | 10% | this answering service · their website · learn more · the company · this tool |
| Partial match | 15% | AI answering built for hotels · phone coverage for hotels · Anchor's hotel answering service |
| Long-tail | 10% | how hotels recover missed booking calls · 24/7 AI phone agent for limited-service hotels · what an unanswered 11pm call costs a hotel |
| Exact match (service) | 5% | hotel answering service · AI phone answering for hotels · overnight hotel call answering · missed call recovery for hotels |

**Hard rules:**
- Exact-match anchors ONLY in high-authority editorial placements (guest posts on real publications), never in directories or low-effort listings.
- Directories: always branded or naked URL (you usually can't control it anyway — that's fine).
- Never the same exact-match anchor from two different domains in the same week.
- Never an exact-match anchor pointing at the homepage; exact match points only at the matching landing page.
- A footer/sitewide link from a partner: branded anchor only, ideally nofollow.

## Per-page anchor assignments

| Target page | Exact (use ≤ 2 times total in first 100 links) | Partial/long-tail pool |
|---|---|---|
| / (home) | — (branded/naked only) | Anchor for Hotels · the team at Anchor · anchorforhotels.com |
| /hotel-answering-service | hotel answering service | answering service built for hotels · 24/7 hotel call coverage |
| /ai-phone-answering-for-hotels + /hotel-ai-agent.html | AI phone answering for hotels · hotel AI agent | an AI agent that answers hotel phones · Ava, Anchor's AI phone agent |
| /overnight-hotel-call-answering | overnight hotel call answering | overnight phone coverage for hotels · who answers your hotel phone at 2am |
| /after-hours-hotel-answering-service | after-hours hotel answering service | after-hours call coverage |
| /missed-call-recovery-hotels | missed call recovery for hotels | recovering missed booking calls · the revenue hiding in missed calls |
| /hotel-front-desk-overflow.html | front desk overflow support | overflow call handling when the desk is slammed |
| /ai-receptionist-for-hotels | AI receptionist for hotels | an AI receptionist built for lodging |
| /bilingual-hotel-call-answering | — | bilingual (English/Spanish) hotel answering |
| Segment pages (motel/boutique/independent/limited-service) | — | phone coverage for motels · answering support for boutique hotels etc. — partial only |

## Where each link type comes from (mapping to the prospect CSV)
- **Directories (≈45 links):** branded + naked URL → satisfies most of the 60% brand/naked quota automatically.
- **Podcasts/show notes (≈10):** branded ("Kenny Patel of Anchor for Hotels") + naked URL.
- **Founder interviews/press (≈8):** branded.
- **Guest posts (≈10):** this is your ONLY reliable source of partial/exact anchors — spend them on the money pages per the table above; author-bio link stays branded.
- **Resource pages (≈8):** partial match or branded, whatever the curator writes — suggest, don't insist.
- **Partnerships (≈10):** branded.

## Internal anchors (you control 100% — be more aggressive here)
Internal links CAN use exact-match anchors freely. Every blog post links to its cluster landing page with the exact target keyword once; vary subsequent internal anchors with partials. This is where exact-match relevance is built safely.

## Monitoring
- Log every acquired anchor in `backlink_tracker.csv`; run a monthly pivot (count by type) and compare to the target table.
- If exact match creeps past ~8%: pause exact-anchor guest-post placements, add directory/branded links to rebalance.
- If a site links with a spammy anchor you didn't choose (e.g., keyword-stuffed), request an edit once; if it's a garbage site entirely, just leave it (Google ignores most junk) — disavow only for clearly manipulative patterns at scale.
