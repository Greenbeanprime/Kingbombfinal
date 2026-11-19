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
        aria-label={`View cart and checkout: ${count} ${count === 1 ? "item" : "items"}, ${formatPrice(subtotal)}`}
        className="mx-auto flex min-h-14 max-w-md items-center justify-between gap-3 whitespace-nowrap rounded-xl border-2 border-gold-hi bg-bomb px-4 font-display text-sm font-bold uppercase tracking-[0.08em] text-cream shadow-[0_10px_30px_-8px_rgb(0_0_0/0.8)] active:translate-y-px min-[400px]:px-5 min-[400px]:text-base"
      >
        <span className="flex items-center gap-2">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-cream text-sm text-bomb-dark">{count}</span>
          <span>
            <span className="hidden min-[400px]:inline">View Cart / </span>Checkout
          </span>
        </span>
        <span className="font-sans text-base tracking-normal">{formatPrice(subtotal)}</span>
      </Link>
    </div>
  );
}
