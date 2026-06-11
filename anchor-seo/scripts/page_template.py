"""Shared renderer for anchorforhotels.com landing pages.

Reproduces the live site's flat-file template (Georgia serif, parchment
palette, GA + Amplitude tags) so generated pages are indistinguishable from
existing ones. FAQ JSON-LD is generated from the same list that renders the
visible FAQ section, so the two can never drift apart.
"""
import json

ORG = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Anchor for Hotels",
    "url": "https://anchorforhotels.com",
    "logo": "https://anchorforhotels.com/favicon-512x512.png",
    "founder": {"@type": "Person", "name": "Kenny Patel"},
    "description": "24/7 AI phone answering service for hotels and motels. Ava answers guest calls, captures booking leads, and routes urgent calls to staff.",
    "telephone": "+1-256-809-0866",
    "areaServed": "US",
    "sameAs": [
        "https://www.linkedin.com/in/anchorforhotels/",
        "https://www.kickstarter.com/projects/anchorforhotels/anchor-for-hotels-build-ava-for-independent-hotels",
    ],
}

STYLE = "body{margin:0;font-family:Georgia,serif;color:#1a1410;background:#fbf6e9;line-height:1.6}main{max-width:900px;margin:0 auto;padding:64px 24px}a{color:#8a2818}h1{font-size:48px;line-height:1.05;margin-bottom:16px}h2{margin-top:36px}h3{margin-top:24px}.eyebrow,nav{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;text-transform:uppercase;letter-spacing:.12em;font-size:13px}nav{margin:28px 0;display:flex;gap:18px;flex-wrap:wrap}.cta{margin-top:32px;padding:24px;border-top:1px solid #a8957a;border-bottom:1px solid #a8957a}.links{padding:24px 0;border-top:1px solid #a8957a;border-bottom:1px solid #a8957a;margin-top:32px}"

NAV = (
    '<nav><a href="/hotel-answering-service.html">Hotel Answering Service</a>'
    '<a href="/hotel-ai-agent.html">Hotel AI Agent</a>'
    '<a href="/hotel-front-desk-overflow.html">Front Desk Overflow</a>'
    '<a href="/overnight-hotel-call-answering.html">Overnight Answering</a>'
    '<a href="/missed-call-recovery-hotels.html">Missed Call Recovery</a>'
    '<a href="/ai-receptionist-for-hotels.html">AI Receptionist</a></nav>'
)

HEAD_TAIL = """<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-7J8PBKMCG4"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag("js", new Date());

  gtag("config", "G-7J8PBKMCG4");
</script>
<script type="importmap">
{"imports":{"@amplitude/unified":"https://esm.sh/@amplitude/unified"}}
</script>
<script type="module" src="/amplitude-init.js"></script>"""

DEMO_TEL = '<a href="tel:+12568090866">(256) 809-0866</a>'
DEMO_MAIL = '<a href="mailto:ceo@anchorforhotels.com?subject=Demo%20details%20%2B%20missed-call%20estimate">Get the demo details →</a>'


def faq_jsonld(faqs):
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {"@type": "Question", "name": q,
             "acceptedAnswer": {"@type": "Answer", "text": a}}
            for q, a, *_ in faqs
        ],
    }


def faq_html(heading, faqs):
    out = [f"<h2>{heading}</h2>"]
    for q, a, *rich in faqs:
        out.append(f"<h3>{q}</h3>")
        out.append(f"<p>{rich[0] if rich else a}</p>")
    return "\n".join(out)


def render(slug, title, meta, jsonld_blocks, body_html, nav=NAV):
    canonical = f"https://anchorforhotels.com/{slug}"
    ld = "\n".join(
        '<script type="application/ld+json">\n%s\n</script>'
        % json.dumps(b, separators=(",", ":"), ensure_ascii=False)
        for b in [ORG] + jsonld_blocks
    )
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-48x48.png" type="image/png" sizes="48x48">
<link rel="icon" href="/favicon-96x96.png" type="image/png" sizes="96x96">
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1a1410">
<title>{title}</title>
<meta name="description" content="{meta}">
<link rel="canonical" href="{canonical}">
{ld}
<style>
{STYLE}
</style>
{HEAD_TAIL}
</head>
<body>
<main>
<p class="eyebrow"><a href="/">Anchor for Hotels</a></p>
{nav}
{body_html}
</main>
</body>
</html>
"""
