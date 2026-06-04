# Setup Guide — stripe-launch

## Step 1: Purchase

Buy from the [product page](https://kennypatel.github.io/hotelweb). You'll receive the `SKILL.md` file.

## Step 2: Install in your project

```bash
# Create the skills directory inside your project
mkdir -p your-project/.claude/skills

# Copy the skill file
cp stripe-launch.md your-project/.claude/skills/stripe-launch.md
```

## Step 3: Open your project in Claude Code

```bash
cd your-project
claude
```

## Step 4: Run the skill

```
/stripe-launch
```

For subscriptions:
```
/stripe-launch subscriptions
```

For one-time payments explicitly:
```
/stripe-launch one-time
```

## Step 5: Add your Stripe keys

After the skill runs, copy `.env.example` to `.env` and fill in:

```bash
cp .env.example .env
```

Get your test keys from: https://dashboard.stripe.com/test/apikeys

## Step 6: Test with Stripe CLI

```bash
# Install Stripe CLI: https://stripe.com/docs/stripe-cli
stripe listen --forward-to localhost:3000/api/webhook
```

In another terminal, trigger a test event:
```bash
stripe trigger checkout.session.completed
```

## Step 7: Test checkout with a test card

Card number: `4242 4242 4242 4242`  
Expiry: any future date  
CVC: any 3 digits  

## Going live

See `STRIPE_SETUP.md` in your project root after running the skill.
