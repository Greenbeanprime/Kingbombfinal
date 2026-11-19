import type { Metadata } from "next";
import Image from "next/image";
import { SignupForm } from "@/components/SignupForm";
import { Ornament, Waves } from "@/components/Ornament";
import { SITE, pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "KINGBOMB | Late Night Food in Clearwater Beach, FL: Seafood Platters, Tacos & Pho",
  absoluteTitle: true,
  description:
    "Late night food in Clearwater Beach, Florida. KINGBOMB serves Coastal Party Platters piled with seafood, street tacos, and steaming pho. Join the list for launch news.",
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
          width={2048}
          height={2048}
          sizes="(max-width: 640px) 88vw, (max-width: 1024px) 26rem, 30rem"
          quality={92}
          loading="eager"
          fetchPriority="high"
          className="mx-auto h-auto w-[min(88vw,30rem)] drop-shadow-[0_20px_45px_rgb(0_0_0/0.7)]"
        />

        <h1 className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-[clamp(1.3rem,6.6vw,3.25rem)] leading-tight">
          <span className="text-gold-foil whitespace-nowrap">Clearwater Beach,</span>{" "}
          <span className="text-gold-foil">Florida</span>
        </h1>
        <Ornament className="mt-5" />
      </section>

      <section aria-labelledby="signup-h" className="px-4">
        <div className="badge-frame mx-auto max-w-2xl px-5 py-10 text-center md:px-12">
          <h2 id="signup-h" className="text-[clamp(1.4rem,5.5vw,2.1rem)] text-gold-hi">
            Be First in Line
          </h2>
          <p className="mx-auto mb-6 mt-3 max-w-[36ch] text-cream/90">
            Get opening night news and late-night deals before anyone else.
          </p>
          <SignupForm />
        </div>
      </section>

      <Waves className="mx-auto mt-14 h-6 w-full max-w-3xl px-4" />
    </>
  );
}
