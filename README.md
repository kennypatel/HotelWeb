# stripe-launch — Claude Code Skill

> Add complete Stripe payment infrastructure to any web project in one command.

[![Price](https://img.shields.io/badge/price-%2499%20one--time-brightgreen)](#buy-now)
[![Works with](https://img.shields.io/badge/works%20with-Next.js%20%7C%20React%20%7C%20Django%20%7C%20Rails%20%7C%20Laravel%20%7C%20Go-blue)]

**[→ View sales page](https://htmlpreview.github.io/?https://raw.githubusercontent.com/kennypatel/HotelWeb/main/index.html)**

## What it does

Run `/stripe-launch` in any project and Claude Code will:

1. **Detect your framework** — Next.js, React+Express, Django, Flask, FastAPI, Rails, Laravel, or Go
2. **Install Stripe** — right package for your language, no manual npm/pip/bundle steps
3. **Build your checkout endpoint** — one-time payment or subscription, clean and production-ready
4. **Wire up webhooks** — with proper signature verification and every critical event handled
5. **Add customer portal** — let subscribers manage their own billing (subscriptions mode)
6. **Create a React/HTML checkout button** — ready to drop into your UI
7. **Write tests** — mocked Stripe calls, covering happy path and error cases
8. **Generate a go-live guide** — step-by-step `STRIPE_SETUP.md` tailored to your project

What normally takes **6–10 hours** of reading Stripe docs, debugging webhook signatures, and wiring up edge cases — done in **under 5 minutes**.

---

## Buy Now — $99 (one-time)

**[→ Purchase with Stripe](STRIPE_PAYMENT_LINK_PLACEHOLDER)**

**[→ Purchase with PayPal](PAYPAL_PAYMENT_LINK_PLACEHOLDER)**

After purchase you receive:
- The `SKILL.md` file to drop into any project
- Lifetime updates via this repo
- Access to the private Discord for questions

---

## Installation (after purchase)

```bash
# 1. Clone or download this repo
git clone https://github.com/kennypatel/hotelweb.git

# 2. Copy SKILL.md into your project's .claude/skills/ directory
mkdir -p your-project/.claude/skills
cp hotelweb/SKILL.md your-project/.claude/skills/stripe-launch.md

# 3. Open your project in Claude Code and invoke the skill
/stripe-launch
# or for subscriptions:
/stripe-launch subscriptions
```

---

## Demo

### Before
```
$ ls src/
index.js  routes/  models/  components/
```

### After `/stripe-launch`
```
$ ls src/
index.js  routes/  models/  components/
payments/
  checkout.js      ← Stripe Checkout session endpoint
  webhook.js       ← Webhook handler with signature verification
  portal.js        ← Customer portal (subscriptions)
components/
  CheckoutButton.jsx  ← Drop-in React component
STRIPE_SETUP.md     ← Your go-live checklist
.env.example        ← Updated with all required keys
```

---

## Works with

| Framework | Language | Status |
|-----------|----------|--------|
| Next.js | TypeScript / JS | ✅ Full support |
| React + Express | JavaScript | ✅ Full support |
| Django | Python | ✅ Full support |
| Flask / FastAPI | Python | ✅ Full support |
| Ruby on Rails | Ruby | ✅ Full support |
| Laravel | PHP | ✅ Full support |
| Go (net/http) | Go | ✅ Full support |
| Plain HTML + Node | JavaScript | ✅ Full support |

---

## FAQ

**Q: Do I need a Stripe account?**  
Yes, free at stripe.com. The skill walks you through finding your API keys.

**Q: Will it overwrite my existing code?**  
No. If Stripe is already partially set up, the skill detects it and builds on what you have.

**Q: Does it work with TypeScript?**  
Yes. The skill detects `.ts`/`.tsx` files and outputs typed code.

**Q: One-time purchase or subscription?**  
One-time, $99. Use it on unlimited projects forever.

**Q: What if my framework isn't listed?**  
Open an issue. I add new frameworks within 48 hours.

---

## License

Personal and commercial use on unlimited projects. Resale or redistribution prohibited.

---

*Built for [Claude Code](https://claude.ai/code) — the AI coding tool by Anthropic.*
