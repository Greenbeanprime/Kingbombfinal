import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CheckoutForm } from "@/components/cart/CheckoutForm";
import { Ornament } from "@/components/Ornament";
import { DELIVERY_FEE, orderingOn } from "@/data/menu";

export const metadata: Metadata = {
  title: "Your Cart & Checkout",
  description: "Review your KINGBOMB order and check out securely for pickup or delivery.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/order" },
};

export default function OrderPage() {
  if (!orderingOn()) notFound();
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10">
      <h1 className="text-center text-[clamp(2rem,9vw,3.25rem)]">
        <span className="text-gold-foil">Checkout</span>
      </h1>
      <Ornament className="mb-8 mt-4" />
      <CheckoutForm deliveryFee={DELIVERY_FEE} />
    </div>
  );
}
