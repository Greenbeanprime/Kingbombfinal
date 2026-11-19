import type { Metadata } from "next";
import { ComingSoon } from "@/components/ComingSoon";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Vending",
  description:
    "KINGBOMB vending is coming soon to Clearwater Beach, Florida. Late night food from the makers of Coastal Party Platters, tacos, and pho.",
  path: "/vending",
});

export default function VendingPage() {
  return <ComingSoon eyebrow="Vending" />;
}
