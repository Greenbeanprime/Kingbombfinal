/**
 * Social and delivery-app links shown in the site footer.
 * Paste each profile/store link into `url`. While `url` is empty the
 * emblem still shows, just not clickable.
 */
export type SocialId = "facebook" | "instagram" | "tiktok" | "x" | "grubhub" | "ubereats" | "doordash";

export const SOCIALS: { id: SocialId; name: string; url: string }[] = [
  { id: "facebook", name: "Facebook", url: "" },
  { id: "instagram", name: "Instagram", url: "" },
  { id: "tiktok", name: "TikTok", url: "" },
  { id: "x", name: "X", url: "" },
  { id: "grubhub", name: "Grubhub", url: "" },
  { id: "ubereats", name: "Uber Eats", url: "" },
  { id: "doordash", name: "DoorDash", url: "" },
];
