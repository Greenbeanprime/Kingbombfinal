import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Catering: Seafood Party Platters, Tacos & Pho",
  description:
    "KINGBOMB catering is coming soon. Coastal Party Platters, seafood platters, taco spreads, and pho for parties, events, and late night crews in Florida.",
  path: "/catering",
});

export default function CateringPage() {
  return <ComingSoon eyebrow="Catering" />;
}
