# Launch Guide — stripe-launch on Gumroad

Gumroad is completely free to start. They take ~10% when you make a sale (so ~$89 per $99 sale).
No monthly fees. No credit card to sign up. They handle payments, file delivery, and the product page.

---

## Step 1 — Create free Gumroad account (2 min)

1. Go to **https://gumroad.com/signup**
2. Enter your email and create a password
3. Verify your email (check spam if needed)
4. Done — you're in the dashboard

---

## Step 2 — Connect your payment method (2 min)

In the Gumroad dashboard:
1. Click your profile icon (top right) → **Settings**
2. Click **Payments** tab
3. Choose one (or both):
   - **PayPal**: Enter your PayPal email address
   - **Bank account**: Add your bank for direct deposit
4. Save

---

## Step 3 — Create the product (5 min)

1. In the dashboard, click **+ New product**
2. Choose **Digital product**
3. Fill in:

**Name:**
```
stripe-launch — Add Stripe Payments to Any App in 5 Minutes
```

**Price:** `$99`

**Description:** Copy everything from `gumroad-description.txt` in this repo and paste it into the description field.

4. Under **Content**, click **Add a file** → upload `SKILL.md` from this repo
   - Direct download: https://raw.githubusercontent.com/kennypatel/HotelWeb/main/SKILL.md
   - Right-click that link → Save As → `stripe-launch.md`
   - Upload that file to Gumroad

5. Click **Publish**

---

## Step 4 — Get your product URL

After publishing, your product page is live at:
```
https://YOUR_USERNAME.gumroad.com/l/stripe-launch
```

Copy this URL. This is your sales link.

---

## Step 5 — Share it (start making sales)

Post on these platforms (all free):

**Twitter/X:**
```
I just shipped a Claude Code skill that adds complete Stripe payment 
infrastructure to any web app in one command.

One-time payments, subscriptions, webhooks, customer portal, tests — all generated automatically.

Works with Next.js, Django, Rails, Laravel, Go.

$99, one-time: [YOUR GUMROAD LINK]
```

**Reddit — post in these subreddits:**
- r/ClaudeAI
- r/SideProject
- r/Entrepreneur
- r/webdev
- r/nextjs
- r/django

**Post title for Reddit:**
```
I built a Claude Code skill that adds complete Stripe integration to any app 
in one command — webhook handler, customer portal, tests included [$99]
```

**Indie Hackers:**
- Post in the Products section
- Include your terminal demo screenshot

**Product Hunt:**
- Submit as a new product
- Category: Developer Tools

---

## What happens after a sale

1. Gumroad charges the buyer $99
2. Gumroad automatically emails them the `stripe-launch.md` file
3. You get ~$89 deposited to your account (after Gumroad's 10% fee)
4. You can transfer to your bank at any time (free)

You don't have to do anything per sale. It's fully automatic.

---

## Optional: Add a nicer landing page

If you want the polished `index.html` sales page live on the web:

1. Go to **https://netlify.com/drop** in your browser (no account needed)
2. Drag the entire `HotelWeb` folder onto the page
3. You get a free URL like `peaceful-mcclintock-abc123.netlify.app`
4. In `index.html`, replace `STRIPE_PAYMENT_LINK_HERE` with your Gumroad product URL
5. Drag the folder again to update

That's it. Free forever, no account required.
