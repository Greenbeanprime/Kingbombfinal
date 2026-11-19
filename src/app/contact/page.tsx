import type { Metadata } from "next";
import { pageMeta } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description:
    "Contact KINGBOMB, the late night food spot in Florida for seafood platters, tacos, pho, and catering.",
  path: "/contact",
});

// Intentionally empty for now. The heading is visually hidden so the page
// still has one <h1> for search engines and screen readers.
export default function ContactPage() {
  return (
    <div className="min-h-[40vh] flex-1">
      <h1 className="sr-only">Contact KINGBOMB</h1>
    </div>
  );
}
