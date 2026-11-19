"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { formatPrice } from "@/data/menu";
import { useCart } from "./CartProvider";

/** Sticky "View Cart / Checkout" bar that sits just above the phone tab bar. */
export function CartBar() {
  const { count, subtotal } = useCart();
  const path = usePathname();
  if (count === 0 || path.startsWith("/order")) return null;

  return (
    <div className="fixed inset-x-0 bottom-[calc(var(--tabbar-h)+env(safe-area-inset-bottom))] z-40 px-3 pb-2 md:bottom-0 md:pb-4">
      <Link
        href="/order"
        className="mx-auto flex min-h-14 max-w-md items-center justify-between gap-3 rounded-xl border-2 border-gold-hi bg-bomb px-5 font-display font-bold uppercase tracking-[0.1em] text-cream shadow-[0_10px_30px_-8px_rgb(0_0_0/0.8)] active:translate-y-px"
      >
        <span className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-full bg-cream text-sm text-bomb-dark">{count}</span>
          View Cart / Checkout
        </span>
        <span className="font-sans text-base tracking-normal">{formatPrice(subtotal)}</span>
      </Link>
    </div>
  );
}
