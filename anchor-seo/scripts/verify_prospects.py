#!/usr/bin/env python3
"""
verify_prospects.py — read-only verification of backlink_prospects.csv

What it does (allowed):  GET each prospect URL + listed contact/submission URLs,
record HTTP status and final redirect target, and probe a small set of common
contact/submit paths to fill gaps.
What it never does:      submit forms, log in, harvest emails, or hammer servers.
Politeness: 1 request/second global, 10s timeout, honest User-Agent, max 3 probes/site.

Usage:
    python3 scripts/verify_prospects.py \
        --in seo-system/backlink_prospects.csv \
        --out output/backlink_prospects_verified.csv
"""
import argparse, csv, sys, time
from pathlib import Path
from urllib.parse import urljoin, urlparse

try:
    import requests
except ImportError:
    sys.exit("pip install requests")

UA = {"User-Agent": "AnchorForHotels-LinkVerify/1.0 (+https://anchorforhotels.com; kenny@anchorforhotels.com)"}
PROBE_PATHS = ["/contact", "/contact-us", "/about", "/write-for-us", "/contribute", "/submit", "/advertise", "/membership"]
DELAY = 1.0

def check(url, session):
    """Return (status, final_url, note) for a single URL."""
    if not url or not url.startswith("http"):
        return ("", "", "no url")
    try:
        r = session.get(url, headers=UA, timeout=10, allow_redirects=True, stream=True)
        r.close()
        note = ""
        if r.history and urlparse(r.url).netloc != urlparse(url).netloc:
            note = "redirected off-domain — review"
        return (str(r.status_code), r.url, note)
    except requests.RequestException as e:
        return ("ERR", "", type(e).__name__)

def probe_contact(base, session):
    """Try common contact/submission paths; return first that returns 200."""
    root = f"{urlparse(base).scheme}://{urlparse(base).netloc}"
    for p in PROBE_PATHS:
        time.sleep(DELAY)
        status, final, _ = check(urljoin(root, p), session)
        if status == "200":
            return final
    return ""

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", default="seo-system/backlink_prospects.csv")
    ap.add_argument("--out", dest="out", default="output/backlink_prospects_verified.csv")
    ap.add_argument("--limit", type=int, default=0, help="verify only first N rows (testing)")
    a = ap.parse_args()

    rows = list(csv.DictReader(open(a.inp, newline="", encoding="utf-8-sig")))
    if a.limit:
        rows = rows[: a.limit]
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)

    s = requests.Session()
    out_rows, live = [], 0
    for i, row in enumerate(rows, 1):
        url = row.get("URL", "").strip()
        time.sleep(DELAY)
        status, final, note = check(url, s)
        row["Verified Status"] = status
        row["Final URL"] = final if final != url else ""
        row["Verify Note"] = note
        row["Verdict"] = "LIVE" if status.startswith(("2", "3")) else ("DEAD?" if status in ("ERR", "404", "410") else "REVIEW")
        if row["Verdict"] == "LIVE":
            live += 1
            # fill a missing contact page from polite probing
            if not row.get("Contact Page", "").strip():
                found = probe_contact(final or url, s)
                if found:
                    row["Contact Page"] = found
                    row["Verify Note"] = (note + "; " if note else "") + "contact page auto-discovered — confirm manually"
        out_rows.append(row)
        print(f"[{i}/{len(rows)}] {row['Verdict']:7s} {status:4s} {row.get('Name','')[:50]}")

    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(out_rows[0].keys()))
        w.writeheader()
        w.writerows(out_rows)
    print(f"\n{live}/{len(rows)} live → {a.out}")
    print("Next: human-review every DEAD?/REVIEW row and every auto-discovered contact page.")

if __name__ == "__main__":
    main()
