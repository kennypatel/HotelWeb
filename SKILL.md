# stripe-launch

Automatically adds complete Stripe payment infrastructure to any web project. Detects your framework, installs the right SDK, wires up checkout, webhooks, and customer portal, then commits production-ready code.

**Invoke:** `/stripe-launch`

**Optional args:** `/stripe-launch subscriptions` or `/stripe-launch one-time`

---

## What this skill produces

- Stripe Checkout session endpoint (one-time or subscription)
- Webhook handler with signature verification
- Customer portal endpoint (for subscriptions)
- `.env.example` updated with required Stripe keys
- Unit/integration tests for payment flows
- `STRIPE_SETUP.md` guide for going live

---

## Instructions

### Phase 1 — Recon

1. Read `package.json`, `requirements.txt`, `Gemfile`, `composer.json`, or `go.mod` to identify the framework and language.
2. Check for existing Stripe imports or environment variables. If Stripe is already partially set up, note what exists and build on it rather than overwriting.
3. Identify the entry point: `app.js`, `server.js`, `main.py`, `app.py`, `app.rb`, `routes/web.php`, etc.
4. Identify the frontend framework if one exists (React, Vue, Next.js, plain HTML).
5. Check for an existing `.env` or `.env.example`. Note the format.
6. Check for an existing test setup (Jest, pytest, RSpec, PHPUnit, Go test).

### Phase 2 — Install Stripe SDK

Based on the detected language/framework, run the appropriate install command:

- **Node.js / Next.js:** `npm install stripe @stripe/stripe-js`
- **Python / Django / FastAPI / Flask:** `pip install stripe` and update `requirements.txt`
- **Ruby on Rails:** `bundle add stripe`
- **PHP / Laravel:** `composer require stripe/stripe-php`
- **Go:** `go get github.com/stripe/stripe-go/v76`

Do NOT run the install command if Stripe is already in the dependency file.

### Phase 3 — Determine payment mode

If the user passed `subscriptions` as an argument, use subscription mode.
If the user passed `one-time` as an argument, use one-time payment mode.
If neither was passed:
- Look for clues in the codebase (words like "plan", "subscribe", "monthly", "tier" suggest subscriptions)
- Default to **one-time** if unclear, and note your choice in the summary

### Phase 4 — Create server-side payment files

Create all files under a `payments/` directory (or framework-appropriate location).

#### 4a. Checkout endpoint

Create a function/route that:
1. Accepts a POST request with `{ price_id, success_url, cancel_url }` (or reads these from env)
2. Creates a Stripe Checkout Session using `stripe.checkout.sessions.create`
3. Returns the session URL or session ID
4. Handles errors gracefully and returns appropriate HTTP status codes
5. Uses `STRIPE_SECRET_KEY` from environment variables — never hardcoded

For **subscriptions**, set `mode: 'subscription'` and include `allow_promotion_codes: true`.
For **one-time**, set `mode: 'payment'`.

#### 4b. Webhook handler

Create a route that handles `POST /webhook` (or `/api/webhook` for Next.js):
1. Reads the raw request body (critical for signature verification)
2. Verifies the signature using `stripe.webhooks.constructEvent` with `STRIPE_WEBHOOK_SECRET`
3. Handles these events with a switch/match:
   - `checkout.session.completed` — mark payment as successful, fulfill order
   - `invoice.payment_succeeded` (subscriptions only) — renew access
   - `invoice.payment_failed` (subscriptions only) — notify user, restrict access
   - `customer.subscription.deleted` (subscriptions only) — revoke access
4. Returns 200 immediately to acknowledge receipt
5. Includes a clear TODO comment for where to add database/fulfillment logic

**Raw body parsing is required.** Add the correct middleware:
- Express: `express.raw({ type: 'application/json' })` on the webhook route only
- Next.js: `export const config = { api: { bodyParser: false } }`
- Django: no body parsing needed (access `request.body` directly)
- Flask: use `request.data`

#### 4c. Customer portal (subscriptions only)

Create a `POST /portal` endpoint that:
1. Looks up the Stripe customer ID for the authenticated user
2. Creates a billing portal session via `stripe.billingPortal.sessions.create`
3. Redirects to the portal URL
4. Includes a TODO for where to fetch the customer ID from your database

### Phase 5 — Frontend integration

If a frontend framework is detected:

**React / Next.js:**
- Create `components/CheckoutButton.jsx` (or `.tsx` if TypeScript is used)
- The button calls your checkout endpoint, then redirects to `session.url`
- Show a loading spinner while the request is in flight
- Handle errors by displaying a user-friendly message

**Plain HTML:**
- Add a `<script>` block to the existing HTML that fetches the checkout endpoint on button click

**No frontend detected (API-only):**
- Skip frontend files and note in the summary that the buyer should call the checkout endpoint directly

### Phase 6 — Environment variables

Add these to `.env.example` (create it if it doesn't exist):

```
# Stripe — get these from https://dashboard.stripe.com/apikeys
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: your default Price ID from Stripe Dashboard
STRIPE_PRICE_ID=price_...
```

Never add actual key values. Only add to `.env.example`, never `.env`.

### Phase 7 — Write tests

Create tests appropriate for the detected test framework.

Test cases to cover:
1. Checkout endpoint returns a session URL when called with valid params
2. Checkout endpoint returns 400 when required params are missing
3. Webhook handler returns 200 for a valid signed event
4. Webhook handler returns 400 for an invalid signature
5. (Subscriptions) Webhook correctly handles `invoice.payment_failed`

Mock Stripe calls — do not make real API calls in tests.

### Phase 8 — Create STRIPE_SETUP.md

Create a `STRIPE_SETUP.md` file at the project root with these sections:

1. **Prerequisites** — Stripe account, keys, and where to find them
2. **Local testing** — How to install and use the Stripe CLI to forward webhooks
3. **Going live checklist** — Switch to live keys, set up webhook endpoint in dashboard, test with a real card
4. **Price ID setup** — How to create a product and price in the Stripe Dashboard and copy the `price_` ID
5. **Troubleshooting** — Common errors (wrong webhook secret, body parser conflicts, CORS issues)

### Phase 9 — Commit

Stage all created/modified files and create a commit:
```
git add .
git commit -m "feat: add Stripe payment infrastructure via stripe-launch"
```

### Phase 10 — Summary

Output a clean summary with:
- Framework detected
- Payment mode (one-time / subscription)
- Files created (list each with a one-line description)
- Next steps (numbered, actionable):
  1. Copy `.env.example` to `.env` and fill in your Stripe keys
  2. Run the Stripe CLI to test webhooks locally: `stripe listen --forward-to localhost:3000/webhook`
  3. Create a product in the Stripe Dashboard and paste the `price_` ID into your env
  4. Test with Stripe test card: `4242 4242 4242 4242`
  5. See `STRIPE_SETUP.md` for going-live checklist

---

## Quality rules

- All Stripe keys must come from environment variables. If you see a hardcoded key anywhere, remove it.
- Never commit `.env` files. If one exists without a `.gitignore` entry, add it.
- Webhook signature verification is not optional. If the framework makes it difficult, add a comment explaining the risk.
- Add a `// FULFILL ORDER HERE` or `# FULFILL ORDER HERE` comment in the webhook handler so the buyer knows exactly where to hook in their business logic.
- Keep files focused. One responsibility per file.
- Match the existing code style (spacing, quotes, semicolons, type annotations).
