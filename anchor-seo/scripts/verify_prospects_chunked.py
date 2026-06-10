#!/usr/bin/env python3
"""
verify_prospects_chunked.py — chunk-capable COPY of verify_prospects.py (Phase 4).

Differences from the original (verify_prospects.py):
- --start/--end row-range support so runs fit inside the Bash tool's 10-min timeout;
  chunk outputs are merged afterwards.
- Build-environment awareness: this sandbox's egress proxy returns
  `403` with an `x-deny-reason: host_not_allowed` header for non-allowlisted hosts.
  Those (and connection-refused/proxy errors/timeouts) are classified UNVERIFIED,
  per project policy: only real 404/410s and redirects to unrelated domains are DEAD.
Everything else (politeness, UA, read-only GETs, 1 req/sec, no form submissions,
no email harvesting) is identical to the original.
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


def registrable(netloc: str) -> str:
    """Loose 'same site' check: compare last two labels of the hostname."""
    parts = netloc.lower().lstrip("www.").split(":")[0].split(".")
    return ".".join(parts[-2:]) if len(parts) >= 2 else netloc.lower()


def check(url, session):
    """Return (status, final_url, note). status may be BLOCKED for policy denials."""
    if not url or not url.startswith("http"):
        return ("", "", "no url")
    try:
        r = session.get(url, headers=UA, timeout=10, allow_redirects=True, stream=True)
        r.close()
        if r.status_code == 403 and "x-deny-reason" in r.headers:
            return ("BLOCKED", "", f"egress policy: {r.headers.get('x-deny-reason')}")
        note = ""
        if r.history and registrable(urlparse(r.url).netloc) != registrable(urlparse(url).netloc):
            note = "redirected off-domain — review"
        return (str(r.status_code), r.url, note)
    except requests.RequestException as e:
        return ("ERR", "", type(e).__name__)


def probe_contact(base, session):
    root = f"{urlparse(base).scheme}://{urlparse(base).netloc}"
    for p in PROBE_PATHS:
        time.sleep(DELAY)
        status, final, _ = check(urljoin(root, p), session)
        if status == "BLOCKED":
            return ""  # whole host is policy-blocked; stop probing
        if status == "200":
            return final
    return ""


def verdict(status, note):
    if status in ("BLOCKED", "ERR"):
        return "UNVERIFIED"           # policy-blocked / unreachable from build env — NOT dead
    if status in ("404", "410"):
        return "DEAD"
    if status.startswith(("2", "3")):
        return "DEAD?" if "off-domain" in note else "LIVE"
    return "REVIEW"                   # real 4xx/5xx from the site itself


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in", dest="inp", default="seo-system/backlink_prospects.csv")
    ap.add_argument("--out", dest="out", required=True)
    ap.add_argument("--start", type=int, default=0, help="first row index (0-based, inclusive)")
    ap.add_argument("--end", type=int, default=0, help="last row index (exclusive); 0 = all")
    a = ap.parse_args()

    rows = list(csv.DictReader(open(a.inp, newline="", encoding="utf-8-sig")))
    end = a.end or len(rows)
    rows = rows[a.start:end]
    Path(a.out).parent.mkdir(parents=True, exist_ok=True)

    s = requests.Session()
    out_rows, counts = [], {}
    for i, row in enumerate(rows, 1):
        url = row.get("URL", "").strip()
        time.sleep(DELAY)
        status, final, note = check(url, s)
        v = verdict(status, note)
        row["Verified Status"] = status
        row["Final URL"] = final if final != url else ""
        row["Verify Note"] = note
        row["Verdict"] = v
        if v == "LIVE" and not row.get("Contact Page", "").strip():
            found = probe_contact(final or url, s)
            if found:
                row["Contact Page"] = found
                row["Verify Note"] = (note + "; " if note else "") + "contact page auto-discovered — confirm manually"
        counts[v] = counts.get(v, 0) + 1
        out_rows.append(row)
        print(f"[{a.start + i}/{end}] {v:10s} {status:7s} {row.get('Name','')[:50]}", flush=True)

    with open(a.out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(out_rows[0].keys()))
        w.writeheader()
        w.writerows(out_rows)
    print(f"\ndone rows {a.start}..{end} → {a.out} | {counts}")


if __name__ == "__main__":
    main()
