import type { Metadata } from "next";

export const SITE = {
  name: "KINGBOMB",
  url: "https://kingbomb.food",
  tagline: "Ultra Late Night Delivery",
  description:
    "KINGBOMB is a late night food spot in Clearwater Beach, Florida serving Coastal Party Platters, seafood platters, tacos, and pho, plus catering for your crew.",
  logo: "/kingbomb-logo.png",
  logoAlt:
    "KINGBOMB logo: a round green and gold badge with a red bomb, palm trees, a pho bowl, a taco, and ocean waves, reading Ultra Late Night Delivery and Coastal Party Platters",
  cuisines: ["Seafood", "Mexican", "Tacos", "Vietnamese", "Pho"],
} as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/catering", label: "Catering" },
  { href: "/vending", label: "Vending" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Full per-page metadata: unique title + description, canonical URL,
 * and matching Open Graph / Twitter tags (the logo image comes from
 * app/opengraph-image.png and app/twitter-image.png automatically).
 */
export function pageMeta({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const full = absoluteTitle ? title : `${title} | ${SITE.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      locale: "en_US",
      url: path,
      title: full,
      description,
    },
    twitter: { card: "summary_large_image", title: full, description },
  };
}

/** Base URL for building absolute links (Stripe redirects, emails). */
export function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || SITE.url).replace(/\/$/, "");
}
