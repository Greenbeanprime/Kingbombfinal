# KINGBOMB launch checklist

Plain-language steps to take kingbomb.food live. Do them in order.

---

## 1. Put the code on GitHub

1. Go to https://github.com/new
2. Repository name: `kingbomb` · choose **Private** · do **not** add a README, .gitignore or license.
3. Click **Create repository**, then run these in this project folder (replace `YOUR-USERNAME`):

```bash
git remote add origin https://github.com/YOUR-USERNAME/kingbomb.git
git push -u origin main
```

Your `.env.local` (secret keys) is ignored by Git and will **not** be uploaded.

---

## 2. Import into Vercel

1. Go to https://vercel.com/new and sign in with GitHub.
2. Pick the `kingbomb` repo → **Import**. Framework is detected as Next.js. Leave the build settings alone.
3. Before clicking Deploy, open **Environment Variables** and add the ones in step 3.
4. Click **Deploy**.

---

## 3. Environment variables (Vercel → Project → Settings → Environment Variables)

| Name | Where to get it |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://kingbomb.food` |
| `MAILCHIMP_API_KEY` | Mailchimp → profile icon → **Profile → Extras → API keys → Create A Key** |
| `MAILCHIMP_LIST_ID` | `cdcadb44fa` (your audience ID, from your embed code) |
| `MAILCHIMP_SERVER_PREFIX` | `us15` (the end of your API key after the dash) |
| `STRIPE_SECRET_KEY` | Stripe → **Developers → API keys** → Secret key (`sk_test_…` first, `sk_live_…` at launch) |
| `STRIPE_PUBLISHABLE_KEY` | Same page → Publishable key (`pk_test_…` first, your `pk_live_…` at launch) |
| `STRIPE_WEBHOOK_SECRET` | From step 5 (`whsec_…`) |
| `RESEND_API_KEY` | Resend → **API Keys → Create API Key** (Sending access) |
| `ORDER_NOTIFICATION_EMAIL` | The inbox where you want new-order emails (several allowed, separated by commas) |
| `ORDER_FROM_EMAIL` *(optional)* | Defaults to `KINGBOMB <orders@kingbomb.food>` |

After changing variables, redeploy: **Deployments → ⋯ → Redeploy**.

**Never** paste secret keys (`sk_…`, `whsec_…`, `re_…`, Mailchimp key) into chats, emails, or code.

### Mailchimp double opt-in
Nothing extra to switch on. New signups are added as "pending" and Mailchimp automatically emails them a confirmation link. To brand that email, go to **Audience → Signup forms → Form builder → "Opt-in confirmation email"**.

---

## 4. Connect kingbomb.food (Spaceship DNS)

1. In Vercel: **Project → Settings → Domains → Add** `kingbomb.food`, then add `www.kingbomb.food` too.
   Choose "Redirect www.kingbomb.food to kingbomb.food".
2. In Spaceship: **Launchpad → Domain Manager → kingbomb.food → Nameservers & DNS → Advanced DNS** (make sure nameservers are "Spaceship nameservers").
3. Delete the two existing **A** records on `@` (`34.216.117.25` and `54.149.79.189`, Spaceship's parking page) and any **CNAME** on `www`. Then add these (exact values from Vercel for the `kingbombfinal` project):

| Type | Host | Value | TTL |
|---|---|---|---|
| A | `@` | `216.198.79.1` | Automatic / 30 min |
| A | `@` | `64.29.17.1` | Automatic / 30 min |
| CNAME | `www` | `bb976d73db9c5bc7.vercel-dns-017.com` | Automatic / 30 min |

> Already done in Vercel: `kingbomb.food` and `www.kingbomb.food` are attached to the **kingbombfinal** project, with www redirecting to kingbomb.food.

4. Wait 5–60 minutes. When Vercel shows **Valid Configuration** for both, HTTPS is issued automatically.

---

## 5. Stripe webhook

1. Stripe → **Developers → Webhooks → Add endpoint** (in Test mode first).
2. Endpoint URL: `https://kingbomb.food/api/stripe/webhook`
3. Events: `checkout.session.completed` and `checkout.session.async_payment_succeeded`
4. Save → reveal the **Signing secret** (`whsec_…`) → put it in Vercel as `STRIPE_WEBHOOK_SECRET` → redeploy.
5. When you go live, switch Stripe to Live mode and **repeat** these steps. Live mode has its own webhook secret.

**Apple Pay / Google Pay:** Stripe → **Settings → Payment methods** → turn on Apple Pay and Google Pay. Stripe-hosted Checkout handles domain verification for you.
**Coupons:** Stripe → **Product catalog → Coupons → Create**, then add a **Promotion code** (the code customers type). Checkout already shows the "Add promotion code" box.
**Sales tax (optional):** to have Stripe add tax, turn on Stripe Tax and ask to have `automatic_tax` enabled in `src/app/api/checkout/route.ts`.

---

## 6. Verify kingbomb.food with Resend

1. Resend → **Domains → Add Domain** → `kingbomb.food` (region: US East).
2. Resend shows about 3–4 records. Add each one in Spaceship Advanced DNS **exactly** as shown. They look like:

| Type | Host | Value |
|---|---|---|
| TXT | `resend._domainkey` | `p=MIGfMA0GCSq…` (long DKIM key from Resend) |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` · priority `10` |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| TXT *(recommended)* | `_dmarc` | `v=DMARC1; p=none;` |

3. Click **Verify DNS Records** in Resend and wait for "Verified".
4. These don't conflict with the Vercel records. Only add a root `@` MX record if you're setting up an inbox for the domain.

---

## 7. Test everything in TEST mode first

Use `sk_test_` / `pk_test_` keys and the test-mode webhook secret.

**Email signup:** sign up on the home page with your own email → you should get Mailchimp's confirmation email → click it → you show up as "Subscribed" in your Audience. Try a bad email to see the error message.

**Turn on ordering for testing:**
1. In `src/data/menu.ts`, add at least one item with `available: true` and set `ORDERING_ENABLED = true`.
2. Visit /menu → Add to Cart → the "View Cart / Checkout" bar appears → Checkout.
3. Pay with test card `4242 4242 4242 4242`, any future date, any CVC, any ZIP.
4. Try a coupon code you made in Test mode.
5. Check that the customer email and your order email both arrive. Check Stripe → Webhooks → your endpoint → events show `200`.

**Testing webhooks on your computer (optional):** install the Stripe CLI, then:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_…` it prints into `.env.local` as `STRIPE_WEBHOOK_SECRET`.

**Go live:** swap to the live Stripe keys and the live webhook secret in Vercel, then redeploy. Place one small real order and refund it from Stripe.

---

## Editing later

- **Menu:** `src/data/menu.ts` (photos go in `public/menu/`).
- **Turn ordering on/off:** `ORDERING_ENABLED` in the same file.
- **Contact page:** `src/app/contact/page.tsx`.
- **Colors:** top of `src/app/globals.css`.
