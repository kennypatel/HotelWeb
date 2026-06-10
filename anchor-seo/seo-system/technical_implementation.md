# Technical Implementation — anchorforhotels.com

## 1. Updated title tags (≤ 60 chars, keyword first, brand last)

| Page | Title |
|---|---|
| / | Hotel Answering Service — 24/7 AI Phone Coverage \| Anchor |
| /hotel-ai-agent.html | AI Receptionist & Phone Agent for Hotels \| Anchor |
| /hotel-front-desk-overflow.html | Front Desk Overflow Call Handling for Hotels \| Anchor |
| /hotel-answering-service | Hotel Answering Service: 24/7 Call Coverage \| Anchor |
| /ai-phone-answering-for-hotels | AI Phone Answering for Hotels — Hear It Live \| Anchor |
| /overnight-hotel-call-answering | Overnight Hotel Call Answering (11pm–7am) \| Anchor |
| /after-hours-hotel-answering-service | After-Hours Hotel Answering Service \| Anchor |
| /missed-call-recovery-hotels | Missed Call Recovery for Hotels \| Anchor |
| /hotel-reservation-call-support | Hotel Reservation Call Support, 24/7 \| Anchor |
| /hotel-call-center-alternative | Hotel Call Center Alternative — Flat Monthly \| Anchor |
| /ai-receptionist-for-hotels | AI Receptionist for Hotels — Built for Lodging \| Anchor |
| /bilingual-hotel-call-answering | Bilingual Hotel Call Answering (EN/ES) \| Anchor |
| /phone-coverage-independent-hotels | Phone Coverage for Independent Hotels \| Anchor |
| /phone-coverage-motels | Motel Answering Service & Phone Coverage \| Anchor |
| /phone-coverage-boutique-hotels | Phone Answering for Boutique Hotels \| Anchor |
| /phone-coverage-limited-service-hotels | Phone Coverage for Limited-Service Hotels \| Anchor |
| /blog/ | Hotel Phone & Front Desk Operations Blog \| Anchor |

## 2. Updated meta descriptions (150–160 chars, keyword + outcome + CTA)

- **/** — "Stop losing bookings to voicemail. Anchor's AI agent Ava answers hotel calls 24/7, captures leads, and routes emergencies to staff. Call the live demo: (256) 809-0866."
- **/hotel-ai-agent.html** — "Ava is an AI phone agent built for hotels: bookings, group blocks, FAQs, Spanish support, and smart escalation to staff. No PMS integration required. Hear her live."
- **/hotel-front-desk-overflow.html** — "When the desk has a line and the phone keeps ringing, Ava picks up. Overflow call answering for busy hotels: leads captured, FAQs handled, urgent calls transferred."
- Per-landing-page descriptions are included in each page spec in `seo_landing_pages.md`.

## 3. Schema markup (JSON-LD)

**Sitewide (every page, in `<head>`):**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Anchor for Hotels",
  "url": "https://anchorforhotels.com",
  "logo": "https://anchorforhotels.com/assets/logo-512.png",
  "founder": {"@type": "Person", "name": "Kenny Patel"},
  "description": "24/7 AI phone answering service for hotels and motels. Ava answers guest calls, captures booking leads, and routes urgent calls to staff.",
  "telephone": "+1-256-809-0866",
  "areaServed": "US",
  "sameAs": [
    "https://www.linkedin.com/in/anchorforhotels/",
    "https://www.kickstarter.com/projects/anchorforhotels/anchor-for-hotels-build-ava-for-independent-hotels"
  ]
}
```
Add real profile URLs to `sameAs` as they're created (Crunchbase, G2, X, etc.).

**Service pages (one per landing page, edit name/description/url):**
```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Hotel answering service",
  "name": "24/7 Hotel Answering Service",
  "provider": {"@type": "Organization", "name": "Anchor for Hotels", "url": "https://anchorforhotels.com"},
  "areaServed": "US",
  "audience": {"@type": "BusinessAudience", "name": "Hotels and motels, 40-150 rooms"},
  "availableChannel": {"@type": "ServiceChannel", "servicePhone": {"@type": "ContactPoint", "telephone": "+1-256-809-0866", "availableLanguage": ["English","Spanish"]}},
  "url": "https://anchorforhotels.com/hotel-answering-service"
}
```

**FAQPage:** every landing page carries 4–6 real FAQs (see written pages for ready JSON-LD). Don't mark up questions that aren't visibly on the page.

**LocalBusiness** (only on the contact/about page, matching GBP exactly): name, address (the ONE canonical NAP), telephone, geo, openingHours "Mo-Su 00:00-23:59".

**BreadcrumbList:** add once the /blog/ and folder structure exists.

## 4. Internal link plan

**Hub-and-spoke clusters:**
- Hub: /hotel-answering-service → spokes: overnight, after-hours, missed-call-recovery, reservation-call-support, call-center-alternative, bilingual.
- Hub: /hotel-ai-agent.html → spokes: ai-phone-answering, ai-receptionist.
- Hub: /hotel-front-desk-overflow.html → spokes: limited-service, independent, motel, boutique pages.

**Rules:**
- Every landing page links to its hub + 2 sibling spokes + 1 relevant blog post, in body copy, with descriptive anchors.
- Every blog post links to exactly ONE landing page in the first half of the article (exact/partial-match anchor) and 1–2 other blog posts.
- Homepage links to all three hubs in body copy, not just nav.
- No orphan pages: anything in the sitemap must be reachable in ≤ 2 clicks from home.

## 5. Footer link plan
Four columns:
1. **Services:** Hotel Answering Service · AI Receptionist · Overnight Answering · Missed Call Recovery · Front Desk Overflow · Bilingual Answering (6 links max — not all 14; footer-stuffing dilutes).
2. **Who it's for:** Independent Hotels · Motels · Boutique Hotels · Limited-Service Hotels.
3. **Company:** About/Founder · Blog · Pricing · Privacy · Contact.
4. **Try it:** "Call the live demo: (256) 809-0866" (tel: link) + email capture.

## 6. Sitemap recommendations
- Generate `sitemap.xml` listing every indexable page with `<lastmod>` kept accurate (update on real content changes only).
- Exclude: thank-you pages, test pages.
- Submit in Google Search Console AND Bing Webmaster Tools; reference it in robots.txt.
- When the blog passes ~50 posts, split: `sitemap-pages.xml` + `sitemap-blog.xml` under a sitemap index.

## 7. robots.txt
```
User-agent: *
Allow: /
Disallow: /thank-you
Disallow: /test/

Sitemap: https://anchorforhotels.com/sitemap.xml
```
Do NOT block AI crawlers (GPTBot, ClaudeBot, PerplexityBot) — being cited by AI assistants is a growing discovery channel for "best hotel answering service" queries, and Anchor benefits from it.

## 8. Blog structure
- URL pattern: `/blog/post-slug` (no dates in URLs).
- Categories (also hub pages): Missed Calls & Revenue · Front Desk Operations · Overnight & After-Hours · AI for Hotels · Owner-Operator Life.
- Every post: 1 target keyword, H1 = title, FAQ block where natural, author box (Kenny, photo, 2-line bio, LinkedIn link — E-E-A-T), Article schema, 1 landing-page link, publish date + updated date.
- Cadence: 2/week for 12 weeks (calendar in `12_week_execution_plan.md`), then 1/week evergreen + refresh cycle.

## 9. CTA improvements
- **Primary CTA everywhere: "Call the live demo: (256) 809-0866."** It's the most credible CTA in the category — competitors hide behind "book a demo" forms. Make the number a sticky element on mobile.
- Secondary CTA: "Get the missed-call estimate template" (email capture — already on the homepage; add to every landing page bottom).
- Add one mid-page CTA on long pages; never more than 3 CTA blocks per page.
- Above the fold on every landing page: keyword H1 + one-sentence value + demo number + email field. Nothing else.

## 10. Tracking recommendations
- **GA4** with events: `demo_call_click` (tel: link), `email_capture`, `outbound_demo_request`; mark first two as key events.
- **Google Search Console + Bing Webmaster Tools:** weekly query export; watch the 8 core keywords.
- **Call tracking:** use a distinct forwarding number on the website vs. directories if you want per-channel attribution (keep the GBP/NAP number canonical and consistent — only vary the website-embedded number if you accept the NAP tradeoff; safer alternative: ask "how did you hear about us" in Ava's intake).
- **Rank tracking:** free tier of any rank tracker, or weekly manual GSC position checks for the 8 keywords.
- **Backlinks:** Ahrefs Webmaster Tools (free for your own site) + GSC links report, exported monthly into `backlink_tracker.csv`.
- **UTM discipline:** tag links you control (LinkedIn, directories that allow it, email signatures): `?utm_source=linkedin&utm_medium=social&utm_campaign=founder`.

## 11. URL & infrastructure cleanup (do before scaling pages)
- Move from `.html` flat files to extension-less URLs (`/hotel-ai-agent`), 301 the old paths. Cheap at 4 pages, painful at 40.
- Force one canonical host: https + non-www (or www — pick one), 301 everything else.
- Page speed: self-host fonts, compress hero images to WebP ≤ 150 KB, inline critical CSS, defer non-essential JS, target LCP < 2.5s on mobile (test with PageSpeed Insights; fix the specific items it flags).
- Add `rel=canonical` self-references on every page.
