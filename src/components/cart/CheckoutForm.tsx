"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/data/menu";
import { useCart } from "./CartProvider";

type Fulfillment = "pickup" | "delivery";

const field =
  "h-14 w-full rounded-lg border-2 border-gold/60 bg-ink/70 px-4 text-base text-cream placeholder:text-cream/45 focus:border-gold-hi focus:outline-none";
const labelCls = "mb-2 block font-display text-sm font-bold uppercase tracking-[0.14em] text-gold-hi";

export function CheckoutForm({ deliveryFee }: { deliveryFee: number }) {
  const { lines, subtotal, setQty } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("pickup");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (lines.length === 0) {
    return (
      <div className="badge-frame px-6 py-12 text-center">
        <p className="text-lg">Your cart is empty.</p>
        <Link
          href="/menu"
          className="mt-6 inline-flex min-h-12 items-center rounded-lg bg-gold-hi px-6 font-display font-bold uppercase tracking-[0.14em] text-ink"
        >
          Browse the Menu
        </Link>
      </div>
    );
  }

  const fee = fulfillment === "delivery" ? deliveryFee : 0;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const notes = String(data.get("notes") || "").trim();
    if (name.length < 2) return setError("Please enter your name.");
    if (phone.replace(/\D/g, "").length < 10) return setError("Please enter a phone number we can reach you at.");

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map((l) => ({ id: l.id, qty: l.qty })),
          fulfillment,
          name,
          phone,
          notes,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (res.ok && json.url) {
        window.location.assign(json.url);
        return;
      }
      setError(json.message || "Checkout is unavailable right now. Please try again.");
    } catch {
      setError("Network hiccup. Check your connection and try again.");
    }
    setLoading(false);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <section aria-labelledby="cart-h">
        <h2 id="cart-h" className="mb-3 text-xl text-gold-hi">
          Your Order
        </h2>
        <ul className="divide-y divide-gold/25 rounded-xl border border-gold/40 bg-ink/60">
          {lines.map((l) => (
            <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{l.name}</p>
                <p className="text-cream/70">{formatPrice(l.price * l.qty)}</p>
              </div>
              <div className="flex items-center gap-1" role="group" aria-label={`Quantity for ${l.name}`}>
                <button
                  type="button"
                  onClick={() => setQty(l.id, l.qty - 1)}
                  className="grid size-11 place-items-center rounded-lg border-2 border-gold/60 text-xl"
                  aria-label={l.qty === 1 ? `Remove ${l.name}` : `One less ${l.name}`}
                >
                  −
                </button>
                <span className="w-8 text-center text-lg tabular-nums" aria-live="polite">
                  {l.qty}
                </span>
                <button
                  type="button"
                  onClick={() => setQty(l.id, l.qty + 1)}
                  className="grid size-11 place-items-center rounded-lg border-2 border-gold/60 text-xl"
                  aria-label={`One more ${l.name}`}
                >
                  +
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <fieldset>
        <legend className={labelCls}>Pickup or Delivery?</legend>
        <div className="grid grid-cols-2 gap-3">
          {(["pickup", "delivery"] as const).map((opt) => (
            <label
              key={opt}
              className={`flex min-h-20 cursor-pointer flex-col items-center justify-center rounded-xl border-2 px-3 text-center font-display text-lg font-bold uppercase tracking-[0.12em] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-gold-hi ${
                fulfillment === opt ? "border-gold-hi bg-emerald text-gold-hi" : "border-gold/40 bg-ink/60 text-cream/85"
              }`}
            >
              <input
                type="radio"
                name="fulfillment"
                value={opt}
                checked={fulfillment === opt}
                onChange={() => setFulfillment(opt)}
                className="sr-only"
              />
              {opt === "pickup" ? "Pickup" : "Delivery"}
              {opt === "delivery" && deliveryFee > 0 && (
                <span className="mt-1 font-sans text-sm normal-case tracking-normal text-cream/75">
                  +{formatPrice(deliveryFee)}
                </span>
              )}
            </label>
          ))}
        </div>
        {fulfillment === "delivery" && (
          <p className="mt-3 text-cream/75">You’ll enter your delivery address on the secure payment page.</p>
        )}
      </fieldset>

      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="co-name" className={labelCls}>
            Name
          </label>
          <input id="co-name" name="name" type="text" autoComplete="name" enterKeyHint="next" required maxLength={80} className={field} />
        </div>
        <div>
          <label htmlFor="co-phone" className={labelCls}>
            Phone
          </label>
          <input
            id="co-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            enterKeyHint="next"
            required
            maxLength={20}
            placeholder="(555) 555-5555"
            className={field}
          />
        </div>
        <div>
          <label htmlFor="co-notes" className={labelCls}>
            Order Notes <span className="font-sans text-sm normal-case tracking-normal text-cream/60">(optional)</span>
          </label>
          <textarea
            id="co-notes"
            name="notes"
            rows={3}
            maxLength={450}
            placeholder="Allergies, extra sauce, gate code…"
            className={`${field} h-auto py-3`}
          />
        </div>
      </div>

      <div className="rounded-xl border border-gold/40 bg-ink/60 p-4">
        <dl className="flex flex-col gap-1">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          {fee > 0 && (
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatPrice(fee)}</dd>
            </div>
          )}
          <div className="mt-1 flex justify-between border-t border-gold/30 pt-2 font-display text-lg font-bold text-gold-hi">
            <dt>Total</dt>
            <dd>{formatPrice(subtotal + fee)}</dd>
          </div>
        </dl>
        <p className="mt-2 text-sm text-cream/70">Have a coupon code? Add it on the next screen.</p>
      </div>

      <p role="alert" className="min-h-6 text-base text-[#ff9aa9]">
        {error}
      </p>

      <button
        type="submit"
        disabled={loading}
        className="sticky bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+0.5rem)] min-h-14 w-full rounded-xl border-2 border-gold-hi bg-bomb px-6 font-display text-lg font-bold uppercase tracking-[0.12em] text-cream shadow-[0_10px_30px_-8px_rgb(0_0_0/0.8)] disabled:opacity-70 md:bottom-4"
      >
        {loading ? "Opening secure checkout…" : "Checkout"}
      </button>
      <p className="-mt-4 text-center text-sm text-cream/65">Secure payment by Stripe · Apple Pay &amp; Google Pay accepted</p>
    </form>
  );
}
