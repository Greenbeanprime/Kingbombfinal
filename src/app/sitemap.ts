import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE.url}/menu`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE.url}/catering`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE.url}/vending`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE.url}/contact`, changeFrequency: "monthly", priority: 0.5 },
  ];
}
