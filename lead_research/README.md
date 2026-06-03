# Anchor for Hotels — B2B Lead Research Tool

Finds publicly listed US motel and independent hotel contact information for legitimate B2B outreach. All data collected is publicly accessible; no logins, captchas, or paywalls are bypassed.

---

## Quick Start

```bash
# 1. Enter the directory
cd lead_research

# 2. Install dependencies
pip install -r requirements.txt

# 3. Copy and configure environment
cp .env.example .env
# Edit .env — at minimum add SERPAPI_KEY (see "API Keys" below)

# 4. Run
python lead_scraper.py
```

Output files appear in the directory where you ran the script:
- `motel_hotel_leads.csv` — leads with a public email address
- `no_email_found.csv` — leads with phone/website but no email
- `lead_research.log` — full request log

---

## Search API Keys

The tool supports three search backends, tried in order:

### Option A — SerpAPI (Recommended)

Best for production use; works from any IP including servers.

1. Sign up at [serpapi.com](https://serpapi.com) — 100 free searches/month
2. Copy your API key to `.env`:
   ```
   SERPAPI_KEY=your_api_key_here
   ```

### Option B — Google Custom Search API

100 free queries/day; $5 per 1,000 after that.

1. Create a project at [console.cloud.google.com](https://console.cloud.google.com), enable the **Custom Search API**
2. Create a search engine at [programmablesearchengine.google.com](https://programmablesearchengine.google.com) configured to **Search the entire web**
3. Add both keys to `.env`:
   ```
   GOOGLE_API_KEY=your_google_api_key
   GOOGLE_CSE_ID=your_search_engine_id
   ```

### Option C — DuckDuckGo (Free, no key)

No key needed, but **blocked on cloud/server IPs** (datacenter ranges). Works on residential or office internet connections.

Leave both `SERPAPI_KEY` and `GOOGLE_API_KEY` blank in `.env` to use this fallback.

---

## Running Modes

### Search mode (default)

Runs all built-in queries through your configured search backend and scrapes the resulting hotel websites.

```bash
python lead_scraper.py                  # collect up to 100 leads (default)
python lead_scraper.py --limit 25       # quick test run
python lead_scraper.py --limit 500      # large collection run
```

### URL-file mode (no search API needed)

Scrape a list of hotel URLs you already have. Useful when you have a directory export, a chamber of commerce member list, or a state lodging association roster.

```bash
# Plain text file — one URL per line
python lead_scraper.py --urls-file hotels.txt

# CSV file with a 'website' or 'url' column
python lead_scraper.py --urls-file hotels.csv --limit 50
```

**hotels.txt example:**
```
https://www.sunrisemotel.com
https://www.harborsideinn.net
https://www.mountainlodgemotel.com
```

**hotels.csv example:**
```csv
hotel_name,website
Sunrise Motel,https://www.sunrisemotel.com
Harborside Inn,https://www.harborsideinn.net
```

---

## Configuration (`.env`)

| Variable | Default | Description |
|---|---|---|
| `LEADS_LIMIT` | `100` | Max leads to collect per run |
| `REQUEST_DELAY` | `2.5` | Seconds between HTTP requests (rate limiting) |
| `OUTPUT_FILE` | `motel_hotel_leads.csv` | Leads with email |
| `NO_EMAIL_FILE` | `no_email_found.csv` | Leads without email |
| `LOG_FILE` | `lead_research.log` | Full request log |
| `SERPAPI_KEY` | *(blank)* | SerpAPI key |
| `GOOGLE_API_KEY` | *(blank)* | Google API key |
| `GOOGLE_CSE_ID` | *(blank)* | Google Custom Search Engine ID |

---

## Output Fields

| Column | Description |
|---|---|
| `hotel_name` | Name from search result title |
| `website` | Hotel's own website URL |
| `email` | Public business email (if found) |
| `phone` | Public phone number (if found) |
| `city` | City extracted from website content |
| `state` | State abbreviation (e.g. `TX`) |
| `source_url` | Exact page where contact info was found |
| `category` | `motel`, `boutique_hotel`, `limited_service_hotel`, `small_franchise_hotel`, or `independent_hotel` |
| `notes` | Email classification + brand status |

### Email classification in `notes`

| Value | Meaning |
|---|---|
| `likely_owner_or_manager` | Non-generic local part (e.g. `mike@sunrisemotel.com`) |
| `generic_contact_email` | Generic prefix like `info@`, `reservations@`, `frontdesk@` |
| `no_email_found` | No public email on the website |
| `invalid_format` | Malformed address (excluded from main CSV) |

---

## Sample Output

**`motel_hotel_leads.csv`** (leads with email):

| hotel_name | website | email | phone | city | state | category | notes |
|---|---|---|---|---|---|---|---|
| Sunrise Motel | sunrisemotel.com | owner@sunrisemotel.com | (512) 555-0142 | Austin | TX | motel | likely_owner_or_manager \| brand:independent |
| Pinehurst Inn | pinehurstinn.com | info@pinehurstinn.com | (615) 555-0293 | Nashville | TN | boutique_hotel | generic_contact_email \| brand:independent |
| Pacific Coast Motel | pacificcoastmotel.com | john@pacificcoastmotel.com | (805) 555-0662 | Santa Barbara | CA | motel | likely_owner_or_manager \| brand:independent |

**`no_email_found.csv`** (phone/website only, no email):

| hotel_name | website | phone | city | state | category |
|---|---|---|---|---|---|
| Canyon View Motel | canyonviewmotel.com | (928) 555-0821 | Flagstaff | AZ | motel |
| Magnolia Boutique Hotel | magnoliaboutiquehotel.com | (504) 555-0145 | New Orleans | LA | boutique_hotel |

Full sample files: [`sample_output/`](sample_output/)

---

## How It Works

1. **Search phase** — Runs 10 targeted search queries through the configured backend, filtering out aggregator sites (Tripadvisor, Booking.com, Expedia, etc.)
2. **Scrape phase** — For each hotel URL found, visits the homepage plus common contact paths (`/contact`, `/about`, `/contact-us`) while respecting `robots.txt`
3. **Extract** — Pulls emails (including `mailto:` links), phone numbers, and city/state from visible page text
4. **Classify** — Tags each email as `likely_owner_or_manager` or `generic_contact_email`; detects brand vs. independent status
5. **Deduplicate** — MD5-hashes hotel name + domain to skip exact duplicates
6. **Output** — Writes two CSVs; logs every source URL

---

## Compliance & Safety

- `robots.txt` is checked for every URL visited
- A configurable delay (`REQUEST_DELAY`, default 2.5 s) is enforced between all requests
- Aggregator sites and major chains are automatically skipped
- No emails are sent automatically — output is for manual review only
- Only publicly available business contact information is collected
- No captchas, logins, or paywalls are bypassed

---

## File Structure

```
lead_research/
├── lead_scraper.py          # main script
├── requirements.txt         # Python dependencies
├── .env.example             # configuration template
├── README.md                # this file
└── sample_output/
    ├── motel_hotel_leads_sample.csv
    └── no_email_found_sample.csv
```
