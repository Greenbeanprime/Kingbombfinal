import Image from "next/image";
import Link from "next/link";
import { NAV, SITE } from "@/lib/site";
import { SignupForm } from "./SignupForm";
import { Waves } from "./Ornament";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-gold/40 bg-ink-2/80">
      <Waves className="h-4 w-full" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 md:grid-cols-[auto_1fr_minmax(0,24rem)] md:items-start md:gap-12">
        <Link href="/" aria-label="KINGBOMB home" className="mx-auto block w-fit rounded-full md:mx-0">
          <Image
            src={SITE.logo}
            alt={SITE.logoAlt}
            width={128}
            height={128}
            sizes="128px"
            className="size-28 md:size-32"
          />
        </Link>

        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2 md:grid-cols-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-12 items-center justify-center rounded-md border border-gold/30 px-4 font-display text-sm font-semibold uppercase tracking-[0.16em] text-cream/90 hover:border-gold-hi hover:text-gold-hi md:justify-start md:border-0 md:px-0"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section aria-labelledby="footer-signup">
          <h2 id="footer-signup" className="mb-3 text-center text-lg text-gold-hi md:text-left">
            Get the Late-Night Drop
          </h2>
          <SignupForm compact />
        </section>
      </div>
      <p className="px-4 pb-[calc(var(--tabbar-h)+env(safe-area-inset-bottom)+1.5rem)] text-center text-sm text-cream/60 md:pb-8">
        © {SITE.name} · kingbomb.food · Seafood platters, tacos &amp; pho, late night in Florida
      </p>
    </footer>
  );
}
