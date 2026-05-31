# STANDARD OPERATING PROCEDURES — AppointFlow Fulfillment

## SOP 1: New Client Onboarding

**Trigger:** Payment received OR free trial agreement confirmed

**Steps:**
1. Send welcome email (template below) within 2 hours of sign-up
2. Share onboarding Google Form link (create once, reuse for every client)
3. Schedule kick-off call via Calendly link (30 min)
4. Create client tab in Google Sheets master CRM
5. Create client-specific lead pipeline sheet (share read-only with client)

**Welcome Email Template:**
```
Subject: Welcome to AppointFlow — next steps inside

Hi [Name],

You're all set! We're excited to start filling your calendar.

Here's what happens next:

1. Fill out this 5-minute onboarding form: [Google Form link]
2. Book your 30-min kick-off call: [Calendly link]

Once we have the form and the call done, we'll start building your lead list within 24 hours and begin outreach within 48 hours.

If you have any questions before the call, just reply to this email.

Looking forward to getting you some great appointments.

[Your Name]
AppointFlow
```

---

## SOP 2: Building a Lead List

**Goal:** 100 qualified prospects per client per week

**Tools:** Apollo.io (free tier), Google Maps, LinkedIn (manual search)

**Steps:**
1. Open Apollo.io → set filters: industry, location (client's city + 25-mile radius), company size 1–20 employees
2. Export 50 contacts (max free tier per month — rotate between Gmail accounts if needed, or use Google Maps to supplement)
3. For Google Maps: Search "[client niche] in [city]" → collect Name, business, email from website, phone
4. Copy all leads into Client Lead Sheet columns: | First Name | Last Name | Business | Email | Phone | Source | Status | Date Added |
5. Mark status as "Not Contacted"
6. Verify emails using Hunter.io free (25/month) or email:guess format ([firstname]@[domain].com)

**Quality check before sending:**
- Real business (has active listing or website)
- In client's service area
- Not already a client of AppointFlow client
- Email looks valid (not info@ or webmaster@ — get owner email)

---

## SOP 3: Writing Outreach Copy (Per Client)

**Do once per client, then reuse with minor personalization:**

1. Write Email 1, 2, 3 using the templates from outreach-assets.md
2. Customize: niche name, city name, specific pain points of that niche
3. Get client approval via email (send drafts in the kick-off or right after)
4. Save approved templates in client's folder

**Personalization for each individual prospect:**
- Change [First Name] to actual first name
- Change [Business Name] to actual business name
- Add 1 specific line based on their Google review, website, or LinkedIn: 
  "I noticed you specialize in [specific service from their website]..."

---

## SOP 4: Sending Outreach

**Daily limits to avoid spam:**
- Week 1–2: Max 30 emails/day per Gmail account
- Week 3–4: Max 50 emails/day
- Week 5+: Max 75 emails/day (if no deliverability issues)

**Sending process:**
1. Open Gmail
2. Paste personalized Email 1 to first 30–50 prospects for the day
3. CC yourself BCC (use Gmass free or manual tracking)
4. Log each send in the Client Lead Sheet: Status → "Email 1 Sent", Date → today

**Tracking responses:**
- Set Gmail filter: Label all incoming emails from prospect domain as "[Client Name] Replies"
- Check twice daily: 9 AM and 2 PM

---

## SOP 5: Handling Responses

**Response type A: Interested / "Tell me more"**
1. Reply within 2 hours
2. Use interest response template:
   ```
   Hi [Name], great to hear from you! Here's a 2-min overview of how it works: [brief 3-sentence explanation]
   
   The easiest next step is a quick 10-minute call — I can answer all your questions and see if it's a fit.
   
   Here's my calendar: [client's Calendly link]
   
   What day works best this week?
   ```
3. Update Lead Sheet: Status → "Responded - Interested"

**Response type B: Not right now / Too busy**
1. Reply with:
   ```
   Totally understand — timing is everything. Mind if I follow up in 30 days? And if you ever want to revisit sooner, my calendar is always open: [Calendly link]
   ```
2. Update Lead Sheet: Status → "Follow Up in 30 Days"
3. Set reminder in Google Calendar

**Response type C: Not interested / Remove me**
1. Reply: "Understood — removed you from my list. Best of luck with everything!"
2. Update Lead Sheet: Status → "Unsubscribed"
3. Never contact again

**Response type D: No response after Email 1**
1. Day 4: Send Email 2 (follow-up)
2. Day 10: Send Email 3 (final)
3. After Email 3 + no response: Status → "No Response - Archived"

---

## SOP 6: Booking the Appointment

1. When prospect agrees to a call, send client's Calendly link
2. Confirm they booked: check Calendly dashboard
3. Send prospect a confirmation with a 1-sentence reminder of what the call is about:
   ```
   Great — you're booked for [day/time] with [Client Name] at [Business Name].
   They'll walk you through how they can help with [specific need discussed]. Talk soon!
   ```
4. Update Lead Sheet: Status → "Appointment Booked", Date → appointment date
5. Notify client via email or Slack:
   ```
   Subject: New appointment booked 🎉
   
   [Prospect Name] from [area] booked a [date/time] call with you. 
   They need help with [what they mentioned]. Calendar invite is on your calendar.
   ```

---

## SOP 7: Weekly Report (Every Friday)

**Report template (Google Doc or Google Sheet, shared with client):**

```
AppointFlow Weekly Report — Week of [Date]
Client: [Business Name]

SUMMARY
Emails sent this week: [X]
Responses received: [X]
Interest rate: [X]%
Appointments booked this week: [X]
Total appointments booked to date: [X]

PIPELINE BREAKDOWN
- Not Contacted: [X]
- Email 1 Sent: [X]
- Email 2 Sent (follow-up): [X]
- Responded - Interested: [X]
- Appointment Booked: [X]
- No Response - Archived: [X]

HIGHLIGHTS
[Brief note: e.g., "Strong response from HVAC prospects in the downtown area. Opening rate looks good — would recommend a small tweak to subject line next week."]

NEXT WEEK
Sending to [X] new prospects
Following up with [X] prospects
Estimated additional appointments: [X–X]
```

---

## SOP 8: Client Check-In Call (Every 2 Weeks, 15 Min)

**Agenda:**
1. How did the appointments go? (Close rate, quality, any issues?)
2. Any adjustments to target profile or messaging?
3. Pipeline health — any areas of concern?
4. Upsell check: are they happy? Ready to move to Growth plan?

**Notes to keep in client's CRM row:**
Date | Call summary | Issues flagged | Upsell status
