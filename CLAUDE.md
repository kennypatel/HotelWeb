# stripe-launch — Claude Code Skill Product

This repo contains and sells a Claude Code skill called `stripe-launch`.

## What this repo is

- `SKILL.md` — the product: a Claude Code skill that adds Stripe payments to any web app
- `index.html` — the sales page (deployed via GitHub Pages)
- `README.md` — GitHub landing page
- `docs/` — setup guide and usage examples for buyers

## To update payment links

In `index.html` and `README.md`, replace:
- `STRIPE_PAYMENT_LINK_PLACEHOLDER` with your Stripe Payment Link URL
- `PAYPAL_PAYMENT_LINK_PLACEHOLDER` with your PayPal.me or PayPal button URL

## To enable the sales page (GitHub Pages)

1. Go to github.com/kennypatel/hotelweb → Settings → Pages
2. Source: Deploy from branch
3. Branch: main (or whichever branch this is merged to)
4. Folder: / (root)
5. Save — the page will be live at https://kennypatel.github.io/hotelweb

## To deliver the skill after purchase

When a buyer purchases, they need `SKILL.md`. Options:
- Direct download link from GitHub (link to the raw file)
- Gumroad: upload `SKILL.md` as the product file, paste your Stripe/PayPal link as the external checkout
- Email delivery: Stripe webhook → send email with attachment

## Skill maintenance

When Stripe updates their API, update `SKILL.md` accordingly. Buyers get the update automatically via GitHub.
