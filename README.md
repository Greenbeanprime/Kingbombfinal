# KINGBOMB

Website for **KINGBOMB**, a late-night food spot in Clearwater Beach, Florida: Coastal Party Platters, tacos, and pho. Live at **https://kingbomb.food**.

Built with Next.js (App Router) and Tailwind CSS, deployed on Vercel.

## Run it locally

```bash
npm install
cp .env.example .env.local   # then fill in your keys
npm run dev
```

Open http://localhost:3000.

## Where to edit things

| What | File |
|---|---|
| Menu items (name, description, price, category, image, available) | `src/data/menu.ts` |
| Turn online ordering on/off | `ORDERING_ENABLED` in `src/data/menu.ts` |
| Menu photos | `public/menu/` |
| Contact page | `src/app/contact/page.tsx` |
| Colors | top of `src/app/globals.css` |
| Logo | `public/kingbomb-logo.png` |

## How it works

- **Email list:** `/api/subscribe` adds people to Mailchimp with double opt-in. The API key stays on the server.
- **Checkout:** `/api/checkout` creates a Stripe Checkout session (Apple Pay, Google Pay and promo codes supported). Prices always come from `src/data/menu.ts`.
- **Order emails:** `/api/stripe/webhook` verifies Stripe's signature on `checkout.session.completed`, then emails the customer and the owner through Resend.

Secret keys live only in `.env.local` (never committed) and in Vercel's Environment Variables. See `.env.example` for the list.

## Launching

See **[LAUNCH-CHECKLIST.md](LAUNCH-CHECKLIST.md)** for GitHub → Vercel, environment variables, DNS at Spaceship, the Stripe webhook, and Resend domain verification.
