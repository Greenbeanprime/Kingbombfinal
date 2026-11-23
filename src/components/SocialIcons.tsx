import { siDoordash, siFacebook, siGrubhub, siInstagram, siLinkedin, siTiktok, siUbereats, siX } from "simple-icons";
import { SOCIALS, type SocialId } from "@/data/socials";

const ICONS: Record<SocialId, { path: string; bg: string }> = {
  facebook: { path: siFacebook.path, bg: "#0866FF" },
  instagram: { path: siInstagram.path, bg: "#E1306C" },
  tiktok: { path: siTiktok.path, bg: "#000000" },
  x: { path: siX.path, bg: "#000000" },
  linkedin: { path: siLinkedin.path, bg: "#0A66C2" },
  grubhub: { path: siGrubhub.path, bg: "#F63440" },
  ubereats: { path: siUbereats.path, bg: "#06C167" },
  doordash: { path: siDoordash.path, bg: "#FF3008" },
};

/** Round brand emblems with a gold ring, echoing the logo. Links once a URL is set in data/socials.ts. */
export function SocialIcons() {
  return (
    <ul className="flex flex-wrap justify-center gap-3" aria-label="KINGBOMB on social media and delivery apps">
      {SOCIALS.map((s) => {
        const icon = ICONS[s.id];
        const circle = (
          <span
            className="grid size-12 place-items-center rounded-full ring-2 ring-gold shadow-[0_0_0_4px_rgb(10_10_8)]"
            style={{ background: icon.bg }}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="#ffffff" aria-hidden="true" focusable="false">
              <path d={icon.path} />
            </svg>
          </span>
        );
        return (
          <li key={s.id}>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`KINGBOMB on ${s.name}`}
                className="block rounded-full transition-transform hover:scale-105"
              >
                {circle}
              </a>
            ) : (
              <span role="img" aria-label={`${s.name} (coming soon)`} title={`${s.name}: coming soon`} className="block">
                {circle}
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}
