import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Ornament } from "@/components/Ornament";
import { ClearCart } from "@/components/cart/ClearCart";
import { orderingOn } from "@/data/menu";

export const metadata: Metadata = {
  title: "Order Confirmed",
  description: "Thanks for ordering from KINGBOMB.",
  robots: { index: false, follow: false },
};

export default function SuccessPage() {
  if (!orderingOn()) notFound();
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-14 text-center">
      <ClearCart />
      <div className="badge-frame px-6 py-12">
        <h1 className="text-[clamp(2rem,9vw,3rem)] font-black">
          <span className="text-gold-foil">Order In!</span>
        </h1>
        <Ornament className="my-5" />
        <p className="text-lg">
          Thanks for ordering. Your confirmation email with your order number is on its way.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-gold-hi px-6 font-display font-bold uppercase tracking-[0.14em] text-ink"
        >
          Back Home
        </Link>
      </div>
    </div>
  );
}
