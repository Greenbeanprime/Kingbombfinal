"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";

export function AddToCart({ id, name, price }: { id: string; name: string; price: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        add({ id, name, price });
        setAdded(true);
        setTimeout(() => setAdded(false), 1200);
      }}
      className="min-h-12 w-full rounded-lg bg-gold-hi px-5 font-display text-sm font-bold uppercase tracking-[0.14em] text-ink active:translate-y-px"
      aria-label={`Add ${name} to cart`}
    >
      <span aria-live="polite">{added ? "Added ✓" : "Add to Cart"}</span>
    </button>
  );
}
