import type { Metadata } from "next";
import Image from "next/image";
import { SignupForm } from "@/components/SignupForm";
import { Ornament, Waves } from "@/components/Ornament";
import { SITE, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "KINGBOMB | Late Night Food in Florida: Seafood Platters, Tacos & Pho",
  absoluteTitle: true,
  description:
    "Late night food in Florida done big. KINGBOMB serves Coastal Party Platters piled with seafood, street tacos, and steaming pho. Join the list for launch news.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pb-12 pt-8 text-center md:pt-14">
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-6 -z-10 aspect-square w-[min(115vw,46rem)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(218_190_127/0.18),transparent_65%)]"
        />
        <Image
          src={SITE.logo}
          alt={SITE.logoAlt}
          width={1600}
          height={1600}
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 26rem, 30rem"
          quality={85}
          loading="eager"
          fetchPriority="high"
          className="mx-auto h-auto w-[min(88vw,30rem)] drop-shadow-[0_20px_45px_rgb(0_0_0/0.7)]"
        />

        <h1 className="mx-auto mt-8 max-w-3xl text-[clamp(1.75rem,7.2vw,3.5rem)] font-black text-cream">
          Late-Night <span className="text-gold-foil">Seafood, Tacos</span> &amp;{" "}
          <span className="text-gold-foil">Pho</span>
        </h1>
        <Ornament className="mt-5" />
        <p className="mx-auto mt-5 max-w-[34ch] text-lg leading-relaxed text-cream/90 md:text-xl">
          Coastal Party Platters piled high, tacos that hit, and pho that heals. Served ultra late, Florida.
        </p>
      </section>

      <section aria-labelledby="signup-h" className="px-4">
        <div className="badge-frame mx-auto max-w-2xl px-5 py-10 text-center md:px-12">
          <h2 id="signup-h" className="text-[clamp(1.4rem,5.5vw,2.1rem)] font-bold text-gold-hi">
            Be First in Line
          </h2>
          <p className="mx-auto mb-6 mt-3 max-w-[36ch] text-cream/90">
            Get the menu drop, opening night news, and late-night deals before anyone else.
          </p>
          <SignupForm />
        </div>
      </section>

      <Waves className="mx-auto mt-14 h-6 w-full max-w-3xl px-4" />
    </>
  );
}
