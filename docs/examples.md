# Examples — stripe-launch

## Next.js SaaS App

```
/stripe-launch subscriptions
```

Creates:
- `app/api/checkout/route.ts` — Creates Stripe checkout session
- `app/api/webhook/route.ts` — Handles subscription lifecycle events
- `app/api/portal/route.ts` — Customer billing portal
- `components/CheckoutButton.tsx` — React component with TypeScript
- `__tests__/payments.test.ts` — Jest tests with mocked Stripe
- `STRIPE_SETUP.md` — Go-live checklist

## Django E-commerce

```
/stripe-launch one-time
```

Creates:
- `payments/views.py` — Checkout and webhook views
- `payments/urls.py` — URL patterns
- `payments/tests.py` — Django test cases
- Updates `requirements.txt` with `stripe`
- `STRIPE_SETUP.md`

## Express API (no frontend)

```
/stripe-launch
```

The skill detects no frontend and creates server-only files:
- `routes/payments.js` — Checkout and webhook routes
- `tests/payments.test.js` — Jest tests
- `.env.example` updated
- `STRIPE_SETUP.md`

Usage note in the summary: call `POST /checkout` with `{ price_id, success_url, cancel_url }` from your frontend.

## Ruby on Rails

```
/stripe-launch subscriptions
```

Creates:
- `app/controllers/payments_controller.rb`
- `config/routes.rb` updated with payment routes
- `spec/controllers/payments_spec.rb` (RSpec)
- `STRIPE_SETUP.md`
