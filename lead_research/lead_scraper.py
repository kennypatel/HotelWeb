#!/usr/bin/env python3
"""
Anchor for Hotels — B2B Lead Research Tool
Collects publicly listed US motel/hotel contact info for legitimate outreach.

Compliance:
  - Only reads publicly accessible pages (no login, no captcha bypass)
  - Respects robots.txt on every URL visited
  - Enforces a configurable delay between all requests
  - Never sends emails; output is for manual review only
"""

import os
import re
import csv
import time
import logging
import hashlib
import urllib.robotparser
from datetime import datetime
from typing import Optional
from urllib.parse import urlparse, urljoin

import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

# ── Configuration (override via .env) ─────────────────────────────────────────

LEADS_LIMIT   = int(os.getenv("LEADS_LIMIT", 100))
REQUEST_DELAY = float(os.getenv("REQUEST_DELAY", 2.5))   # seconds between requests
OUTPUT_FILE   = os.getenv("OUTPUT_FILE", "motel_hotel_leads.csv")
NO_EMAIL_FILE = os.getenv("NO_EMAIL_FILE", "no_email_found.csv")
LOG_FILE      = os.getenv("LOG_FILE", "lead_research.log")

SERPAPI_KEY   = os.getenv("SERPAPI_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
GOOGLE_CSE_ID  = os.getenv("GOOGLE_CSE_ID", "")

HEADERS = {
    "User-Agent": (
        "AnchorForHotels-LeadResearch/1.0 "
        "(legitimate B2B outreach research; "
        "contact anchor@anchorforhotels.com)"
    ),
    "Accept-Language": "en-US,en;q=0.9",
}

# ── Email classification ───────────────────────────────────────────────────────

GENERIC_PREFIXES = {
    "info", "reservations", "reservation", "frontdesk", "front.desk",
    "front-desk", "sales", "contact", "admin", "help", "support",
    "reception", "bookings", "booking", "hotel", "motel", "rooms",
    "stay", "inquiry", "inquiries", "general", "office",
    "management", "service", "services", "hello", "team", "noreply",
    "no-reply", "donotreply",
}

# ── Search queries ─────────────────────────────────────────────────────────────

SEARCH_QUERIES = [
    'independent motel "contact us" email United States',
    'boutique hotel "contact" email phone United States',
    '"motel" "front desk" email contact',
    '"independent hotel" owner OR manager email contact',
    '"small hotel" "contact" email city state',
    '"motel" email phone United States',
    '"bed and breakfast" OR motel email contact United States',
    'chamber of commerce motel email contact',
    'state lodging association independent hotel email',
    '"limited service hotel" contact email phone',
]

# Aggregator domains to skip — we want the hotel's own site
SKIP_DOMAINS = {
    "tripadvisor.com", "booking.com", "expedia.com", "hotels.com",
    "yelp.com", "yellowpages.com", "google.com", "bing.com",
    "wikipedia.org", "indeed.com", "linkedin.com", "glassdoor.com",
    "kayak.com", "priceline.com", "airbnb.com", "vrbo.com",
    "orbitz.com", "travelocity.com", "hoteltonight.com",
    "agoda.com", "marriott.com", "hilton.com", "ihg.com",
    "wyndhamhotels.com", "hyatt.com",
}

# Contact-rich paths to try on each hotel site
CONTACT_PATHS = [
    "/contact", "/contact-us", "/contact.html", "/contact.php",
    "/about", "/about-us", "/about.html",
    "/info", "/information",
]

# ── US geography ───────────────────────────────────────────────────────────────

US_STATES_ABBR = {
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
}

US_STATE_NAMES = {
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming",
}

# Map name → abbreviation
STATE_NAME_TO_ABBR = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
    "California": "CA", "Colorado": "CO", "Connecticut": "CT",
    "Delaware": "DE", "Florida": "FL", "Georgia": "GA", "Hawaii": "HI",
    "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
    "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME",
    "Maryland": "MD", "Massachusetts": "MA", "Michigan": "MI",
    "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
    "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
    "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM",
    "New York": "NY", "North Carolina": "NC", "North Dakota": "ND",
    "Ohio": "OH", "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA",
    "Rhode Island": "RI", "South Carolina": "SC", "South Dakota": "SD",
    "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
    "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
    "Wisconsin": "WI", "Wyoming": "WY",
}

# ── Logging ────────────────────────────────────────────────────────────────────

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE, encoding="utf-8"),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)

# ── Regex patterns ─────────────────────────────────────────────────────────────

EMAIL_RE = re.compile(
    r"[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}"
)

PHONE_RE = re.compile(
    r"(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}"
)

# Matches proper city names: "Nashville, TN" / "New York, NY" / "Los Angeles, CA"
# Each word capitalized, at most 3 words, followed by a state abbreviation.
LOCATION_RE = re.compile(
    r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+){0,2}),\s*("
    + "|".join(sorted(US_STATES_ABBR, key=len, reverse=True))
    + r")\b"
)

# ── Utility helpers ────────────────────────────────────────────────────────────

def _uid(name: str, url: str) -> str:
    """Stable deduplication key."""
    key = f"{name.lower().strip()}|{urlparse(url).netloc.lower()}"
    return hashlib.md5(key.encode()).hexdigest()


def validate_email(email: str) -> bool:
    return bool(EMAIL_RE.fullmatch(email))


def is_generic_email(email: str) -> bool:
    local = email.split("@")[0].lower()
    # strip dots/dashes for matching
    normalized = re.sub(r"[.\-_]", "", local)
    return local in GENERIC_PREFIXES or normalized in GENERIC_PREFIXES


def classify_email(email: str) -> str:
    if not validate_email(email):
        return "invalid_format"
    if is_generic_email(email):
        return "generic_contact_email"
    return "likely_owner_or_manager"


def can_fetch(url: str) -> bool:
    """Check robots.txt. Default allow on any error."""
    try:
        parsed = urlparse(url)
        robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
        rp = urllib.robotparser.RobotFileParser()
        rp.set_url(robots_url)
        rp.read()
        return rp.can_fetch(HEADERS["User-Agent"], url)
    except Exception:
        return True


def safe_get(url: str, timeout: int = 12) -> Optional[requests.Response]:
    """Polite GET with mandatory delay."""
    time.sleep(REQUEST_DELAY)
    try:
        resp = requests.get(
            url, headers=HEADERS, timeout=timeout,
            allow_redirects=True
        )
        resp.raise_for_status()
        return resp
    except requests.exceptions.HTTPError as e:
        log.debug("HTTP %s for %s", e.response.status_code, url)
    except Exception as e:
        log.debug("Request failed %s — %s", url, e)
    return None


def extract_location(text: str) -> tuple[str, str]:
    """Best-effort extraction of city and state abbreviation."""
    m = LOCATION_RE.search(text)
    if m:
        return m.group(1).strip(), m.group(2).strip()
    # Fall back to state name scan
    for name, abbr in STATE_NAME_TO_ABBR.items():
        if name in text:
            return "", abbr
    return "", ""


def extract_emails_from_soup(soup: BeautifulSoup) -> list[str]:
    """Pull emails from visible text and mailto links."""
    emails: set[str] = set()

    # mailto: hrefs
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("mailto:"):
            addr = href[7:].split("?")[0].strip()
            if validate_email(addr):
                emails.add(addr.lower())

    # plain text
    for tag in soup(["script", "style"]):
        tag.decompose()
    text = soup.get_text(" ", strip=True)
    for m in EMAIL_RE.finditer(text):
        addr = m.group().lower()
        # skip image file extensions accidentally matched
        if not re.search(r"\.(png|jpg|gif|svg|ico|webp)$", addr):
            if validate_email(addr):
                emails.add(addr)

    return list(emails)


# ── Hotel website scraper ──────────────────────────────────────────────────────

def scrape_hotel_site(base_url: str) -> dict:
    """
    Visit the hotel's website (and common contact paths) to extract
    email, phone, and location. Returns a dict of found fields.
    """
    result = {
        "email": "", "phone": "", "city": "", "state": "",
        "notes": "", "source_url": base_url,
    }
    parsed_base = urlparse(base_url)
    base_root = f"{parsed_base.scheme}://{parsed_base.netloc}"

    urls_to_try = [base_url] + [
        base_root + path for path in CONTACT_PATHS
    ]

    all_emails: set[str] = set()
    all_phones: set[str] = set()

    for url in urls_to_try:
        if not can_fetch(url):
            log.debug("robots.txt blocks %s", url)
            continue

        resp = safe_get(url)
        if not resp:
            continue

        soup = BeautifulSoup(resp.text, "lxml")
        page_emails = extract_emails_from_soup(soup)
        all_emails.update(page_emails)

        # phones
        text = soup.get_text(" ", strip=True)
        for m in PHONE_RE.finditer(text):
            ph = re.sub(r"\s+", " ", m.group()).strip()
            if len(re.sub(r"\D", "", ph)) in (10, 11):
                all_phones.add(ph)

        # location (grab from first page that has it)
        if not result["city"]:
            city, state = extract_location(text)
            result["city"]  = city
            result["state"] = state

        result["source_url"] = url

        # Stop once we have what we need
        if all_emails and result["city"]:
            break

    # Prefer non-generic email; fall back to any found email
    non_generic = [e for e in all_emails if not is_generic_email(e)]
    generic_pool = [e for e in all_emails if is_generic_email(e)]
    chosen = (non_generic or generic_pool or [""])[0]

    result["email"] = chosen
    result["phone"] = sorted(all_phones)[0] if all_phones else ""
    result["notes"] = classify_email(chosen) if chosen else "no_email_found"

    return result


# ── Search backends ────────────────────────────────────────────────────────────

def search_serpapi(query: str, num: int = 10) -> list[dict]:
    """SerpAPI Google Search (requires SERPAPI_KEY env var)."""
    params = {
        "q": query, "num": num,
        "gl": "us", "hl": "en",
        "api_key": SERPAPI_KEY,
    }
    time.sleep(REQUEST_DELAY)
    try:
        r = requests.get("https://serpapi.com/search", params=params, timeout=20)
        r.raise_for_status()
        items = r.json().get("organic_results", [])
        return [
            {
                "title":   i.get("title", ""),
                "link":    i.get("link", ""),
                "snippet": i.get("snippet", ""),
            }
            for i in items
        ]
    except Exception as e:
        log.warning("SerpAPI error: %s", e)
        return []


def search_google_cse(query: str, num: int = 10) -> list[dict]:
    """Google Custom Search API (requires GOOGLE_API_KEY + GOOGLE_CSE_ID)."""
    params = {
        "key": GOOGLE_API_KEY, "cx": GOOGLE_CSE_ID,
        "q": query, "num": min(num, 10), "gl": "us",
    }
    time.sleep(REQUEST_DELAY)
    try:
        r = requests.get(
            "https://www.googleapis.com/customsearch/v1",
            params=params, timeout=20,
        )
        r.raise_for_status()
        items = r.json().get("items", [])
        return [
            {
                "title":   i.get("title", ""),
                "link":    i.get("link", ""),
                "snippet": i.get("snippet", ""),
            }
            for i in items
        ]
    except Exception as e:
        log.warning("Google CSE error: %s", e)
        return []


def search_duckduckgo(query: str) -> list[dict]:
    """
    Metasearch via ddgs library (no API key needed).
    Tries multiple backends with exponential backoff on rate limits.
    """
    # ddgs supersedes duckduckgo_search; try both import paths
    DDGS = None
    try:
        from ddgs import DDGS  # type: ignore[no-redef]
    except ImportError:
        try:
            from duckduckgo_search import DDGS  # type: ignore[no-redef]
        except ImportError:
            log.warning("ddgs not installed; run: pip install ddgs")
            return []

    backends = ["auto", "html", "lite"]
    for attempt, backend in enumerate(backends):
        wait = REQUEST_DELAY * (2 ** attempt)
        time.sleep(wait)
        try:
            results = []
            kwargs = {"region": "us-en", "max_results": 10}
            if backend != "auto":
                kwargs["backend"] = backend
            with DDGS() as ddgs_client:
                for r in ddgs_client.text(query, **kwargs):
                    results.append({
                        "title":   r.get("title", ""),
                        "link":    r.get("href", r.get("url", "")),
                        "snippet": r.get("body", r.get("description", "")),
                    })
            if results:
                return results
        except Exception as e:
            log.debug("DDG backend=%s failed: %s", backend, e)

    log.warning("All DDG backends failed for query: %s", query[:60])
    return []


def run_search(query: str) -> list[dict]:
    """
    Run query using best available backend.

    Priority:
      1. SerpAPI       — set SERPAPI_KEY in .env
      2. Google CSE    — set GOOGLE_API_KEY + GOOGLE_CSE_ID in .env
      3. DuckDuckGo    — free, but blocked from cloud/datacenter IPs
    """
    if SERPAPI_KEY:
        results = search_serpapi(query)
        if results:
            log.debug("SerpAPI returned %d results", len(results))
            return results
        log.warning("SerpAPI key set but returned 0 results — check your key/quota")
    if GOOGLE_API_KEY and GOOGLE_CSE_ID:
        results = search_google_cse(query)
        if results:
            log.debug("Google CSE returned %d results", len(results))
            return results
        log.warning("Google CSE returned 0 results — check key/quota")
    # Free fallback — works on residential/office IPs; blocked on cloud servers
    results = search_duckduckgo(query)
    if not results:
        log.warning(
            "All search backends returned 0 results for: %s\n"
            "  → On cloud/server environments, set SERPAPI_KEY in .env\n"
            "  → Alternatively, use --urls-file to provide hotel URLs directly",
            query[:80],
        )
    return results


# ── Category + brand detection ─────────────────────────────────────────────────

CHAIN_BRANDS = [
    "Best Western", "Choice Hotels", "IHG", "Marriott", "Hilton",
    "Hyatt", "Wyndham", "Days Inn", "Super 8", "Econo Lodge",
    "Comfort Inn", "Comfort Suites", "Holiday Inn", "Motel 6",
    "Red Roof", "La Quinta", "Quality Inn", "Sleep Inn",
    "Hampton Inn", "Courtyard", "Radisson", "Ramada",
]


def detect_category(title: str, snippet: str, url: str) -> str:
    text = f"{title} {snippet} {url}".lower()
    if any(w in text for w in ["motel", "motor inn", "motor lodge"]):
        return "motel"
    if any(w in text for w in ["boutique", "bed and breakfast", "b&b", "inn"]):
        return "boutique_hotel"
    if any(w in text for w in ["limited service", "budget hotel", "economy"]):
        return "limited_service_hotel"
    for b in CHAIN_BRANDS:
        if b.lower() in text:
            return "small_franchise_hotel"
    return "independent_hotel"


def detect_brand_status(title: str, snippet: str) -> str:
    text = f"{title} {snippet}"
    for brand in CHAIN_BRANDS:
        if brand.lower() in text.lower():
            return f"franchise ({brand})"
    return "independent"


def is_us_property(title: str, snippet: str, url: str) -> bool:
    """Rough filter to exclude obviously non-US results."""
    text = f"{title} {snippet}".lower()
    non_us = [
        "canada", "uk ", "united kingdom", "australia", "india",
        "mexico", "europe", "asia", ".ca ", ".uk ", ".au ",
    ]
    if any(w in text for w in non_us):
        return False
    # If any US state appears, accept
    combined = f"{title} {snippet} {url}"
    for abbr in US_STATES_ABBR:
        if re.search(r"\b" + abbr + r"\b", combined):
            return True
    # No explicit state found — allow (many US sites don't name the state)
    return True


# ── CSV output ─────────────────────────────────────────────────────────────────

CSV_FIELDS = [
    "hotel_name", "website", "email", "phone",
    "city", "state", "source_url", "category", "notes",
]


def write_csv(path: str, rows: list[dict]) -> None:
    with open(path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=CSV_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    log.info("Saved %d rows → %s", len(rows), path)


# ── URL-file mode (no search API needed) ──────────────────────────────────────

def load_urls_file(path: str) -> list[dict]:
    """
    Load a plain-text or CSV file of hotel URLs to scrape directly.

    Supported formats:
      - One URL per line  (plain .txt)
      - CSV with columns: url  (or: url, name)
      - CSV with columns: website  (or: website, hotel_name)
    """
    urls = []
    with open(path, encoding="utf-8") as f:
        first_line = f.readline().strip()
        f.seek(0)

        # Detect CSV
        if "," in first_line or first_line.lower().startswith(("url", "website", "http")):
            reader = csv.DictReader(f)
            if reader.fieldnames and any(
                k.lower() in ("url", "website", "link") for k in reader.fieldnames
            ):
                url_col  = next(
                    k for k in reader.fieldnames
                    if k.lower() in ("url", "website", "link")
                )
                name_col = next(
                    (k for k in reader.fieldnames if k.lower() in ("name", "hotel_name", "title")),
                    None,
                )
                for row in reader:
                    u = row[url_col].strip()
                    if u.startswith("http"):
                        urls.append({
                            "link":    u,
                            "title":   row[name_col].strip() if name_col else urlparse(u).netloc,
                            "snippet": "",
                        })
                return urls

        # Plain text — one URL per line
        for line in f:
            u = line.strip()
            if u.startswith("http"):
                urls.append({
                    "link":    u,
                    "title":   urlparse(u).netloc,
                    "snippet": "",
                })
    return urls


# ── Main run ───────────────────────────────────────────────────────────────────

def run(limit: int = LEADS_LIMIT, urls_file: Optional[str] = None) -> None:
    log.info(
        "=== Anchor for Hotels — Lead Researcher  [%s]  limit=%d ===",
        datetime.now().strftime("%Y-%m-%d %H:%M"), limit,
    )

    leads:    list[dict] = []
    no_email: list[dict] = []
    seen:     set[str]   = set()
    processed: int       = 0

    # ── Determine result source ────────────────────────────────────────────────
    if urls_file:
        log.info("Mode: URL-file  (%s)", urls_file)
        all_items = load_urls_file(urls_file)[:limit]
        log.info("Loaded %d URLs from file", len(all_items))
        query_groups = [("url-file", all_items)]
    else:
        if SERPAPI_KEY:
            log.info("Search backend: SerpAPI")
        elif GOOGLE_API_KEY and GOOGLE_CSE_ID:
            log.info("Search backend: Google Custom Search")
        else:
            log.info(
                "Search backend: DuckDuckGo (free fallback — "
                "requires non-datacenter IP; set SERPAPI_KEY for reliable use)"
            )
        query_groups = [(q, None) for q in SEARCH_QUERIES]

    for query, prefetched in query_groups:
        if processed >= limit:
            break

        if prefetched is not None:
            result_items = prefetched
        else:
            log.info("── Query: %s", query)
            result_items = run_search(query)

        for item in result_items:
            if processed >= limit:
                break

            url     = item.get("link", "").strip()
            title   = item.get("title", "").strip()
            snippet = item.get("snippet", "").strip()

            if not url or not url.startswith("http"):
                continue

            parsed = urlparse(url)
            domain = parsed.netloc.lower().lstrip("www.")

            # Skip aggregators
            if any(skip in domain for skip in SKIP_DOMAINS):
                log.debug("Skipping aggregator: %s", domain)
                continue

            # Skip non-US (rough filter)
            if not is_us_property(title, snippet, url):
                log.debug("Skipping likely non-US: %s", url)
                continue

            uid = _uid(title, url)
            if uid in seen:
                log.debug("Duplicate skipped: %s", title)
                continue
            seen.add(uid)

            processed += 1
            log.info("[%d/%d] %s  →  %s", processed, limit, title[:50], domain)

            contact  = scrape_hotel_site(url)
            category = detect_category(title, snippet, url)
            brand    = detect_brand_status(title, snippet)

            row = {
                "hotel_name": title,
                "website":    url,
                "email":      contact["email"],
                "phone":      contact["phone"],
                "city":       contact["city"],
                "state":      contact["state"],
                "source_url": contact["source_url"],
                "category":   category,
                "notes":      f"{contact['notes']} | brand:{brand}",
            }

            if contact["email"]:
                leads.append(row)
            else:
                no_email.append(row)

    log.info(
        "=== Complete: %d with email, %d without, %d total processed ===",
        len(leads), len(no_email), processed,
    )

    write_csv(OUTPUT_FILE, leads)
    write_csv(NO_EMAIL_FILE, no_email)

    # ── Preview ───────────────────────────────────────────────────────────────
    sep = "─" * 90
    print(f"\n{sep}")
    print(f"  Leads with email   : {len(leads)}")
    print(f"  No email found     : {len(no_email)}")
    print(f"  Total processed    : {processed}")
    print(f"{sep}")
    if leads:
        print(f"\n  Sample leads (first 5 with email):")
        print(f"  {'Hotel Name':<42} {'Email':<35} {'Phone':<16} State")
        print(f"  {'─'*42} {'─'*35} {'─'*16} ─────")
        for r in leads[:5]:
            print(
                f"  {r['hotel_name'][:41]:<42}"
                f" {r['email'][:34]:<35}"
                f" {r['phone'][:15]:<16}"
                f" {r['state']}"
            )
    print(f"\n  Output files saved in: {os.path.abspath('.')}")
    print(f"    {OUTPUT_FILE}")
    print(f"    {NO_EMAIL_FILE}")
    print(f"    {LOG_FILE}")
    print(f"{sep}\n")


# ── CLI entry ──────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="Anchor for Hotels — B2B Lead Research Tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Modes:
  Search mode (default):
    python lead_scraper.py                        # 100 leads via search API
    python lead_scraper.py --limit 25             # quick 25-lead test

  URL-file mode (no search API needed):
    python lead_scraper.py --urls-file hotels.txt # scrape a list of hotel URLs
    python lead_scraper.py --urls-file hotels.csv --limit 50

Search API setup (set in .env):
  SerpAPI   → SERPAPI_KEY=your_key   (recommended; 100 free searches/month)
  Google CSE → GOOGLE_API_KEY=... + GOOGLE_CSE_ID=...  (100 free/day)
  Fallback  → free DuckDuckGo (works on home/office IPs, blocked on servers)
        """,
    )
    parser.add_argument(
        "--limit", type=int, default=LEADS_LIMIT,
        help=f"Maximum leads to collect (default: {LEADS_LIMIT})",
    )
    parser.add_argument(
        "--urls-file", metavar="FILE",
        help="Path to a .txt or .csv file with hotel URLs to scrape directly",
    )
    args = parser.parse_args()
    run(limit=args.limit, urls_file=args.urls_file)
