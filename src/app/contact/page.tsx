import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Ornament } from "@/components/Ornament";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "Contact KINGBOMB in Clearwater Beach, Florida. Send us a message about late night seafood platters, tacos, pho, catering, or events.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-xl px-4 py-10 md:py-14">
      <h1 className="text-center text-[clamp(2rem,9vw,3.25rem)]">
        <span className="text-gold-foil">Contact</span>
      </h1>
      <Ornament className="mb-4 mt-4" />
      <p className="mx-auto mb-8 max-w-[34ch] text-center text-cream/90">
        Questions, catering, or just want to say hi? Send us a message and we’ll get back to you.
      </p>
      <div className="badge-frame px-5 py-8 md:px-8">
        <ContactForm />
      </div>
    </div>
  );
}
