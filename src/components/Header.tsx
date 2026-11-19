import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { DesktopNav } from "./NavLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-ink/90 backdrop-blur supports-[backdrop-filter]:bg-ink/75 pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-4 px-4 py-2 md:justify-between md:py-3">
        <Link
          href="/"
          className="flex min-h-11 items-center gap-3 rounded-full"
          aria-label="KINGBOMB home"
        >
          <Image
            src={SITE.logo}
            alt="KINGBOMB logo"
            width={56}
            height={56}
            sizes="56px"
            quality={85}
            loading="eager"
            className="size-12 md:size-14"
          />
          <span className="font-deco text-xl font-bold tracking-[0.06em] text-cream md:text-2xl">
            KINGBOMB
          </span>
        </Link>
        <DesktopNav />
      </div>
    </header>
  );
}
