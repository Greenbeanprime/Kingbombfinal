import Link from "next/link";
import { Ornament } from "@/components/Ornament";

export default function NotFound() {
  return (
    <div className="mx-auto w-full max-w-xl flex-1 px-4 py-16 text-center">
      <h1 className="text-[clamp(2rem,9vw,3rem)]">
        <span className="text-gold-foil">Page Not Found</span>
      </h1>
      <Ornament className="my-5" />
      <p className="text-lg">That page went off like a bomb. Let’s get you back.</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-gold-hi px-6 font-display font-bold uppercase tracking-[0.14em] text-ink"
      >
        Back Home
      </Link>
    </div>
  );
}
