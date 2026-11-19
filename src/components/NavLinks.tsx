"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";

function useIsActive() {
  const path = usePathname();
  return (href: string) => (href === "/" ? path === "/" : path.startsWith(href));
}

/** Top navigation for tablet and desktop. */
export function DesktopNav() {
  const isActive = useIsActive();
  return (
    <nav aria-label="Main" className="hidden md:block">
      <ul className="flex items-center gap-1">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-11 min-w-11 items-center rounded-md px-4 font-display text-sm font-semibold uppercase tracking-[0.16em] transition-colors ${
                  active ? "text-gold-hi" : "text-cream/85 hover:text-gold-hi"
                }`}
              >
                {item.label}
                {active && <span className="sr-only"> (current page)</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  "/": <path d="M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z" />,
  "/menu": (
    <>
      <path d="M6 3.5h10.5A1.5 1.5 0 0 1 18 5v15.5H7.5A1.5 1.5 0 0 1 6 19z" />
      <path d="M9 8h6M9 11.5h6M9 15h4" />
    </>
  ),
  "/catering": (
    <>
      <path d="M3 16.5h18M5 16.5a7 7 0 0 1 14 0" />
      <path d="M12 9.5V7.5M2.5 19.5h19" />
    </>
  ),
  "/vending": (
    <>
      <rect x="5" y="2.5" width="14" height="19" rx="1.5" />
      <rect x="7.5" y="5" width="6.5" height="10" rx=".5" />
      <path d="M16.5 6.5v2M16.5 11v1.5M7.5 18.5h6.5" />
    </>
  ),
  "/contact": (
    <>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" />
      <path d="m4 6.5 8 6.5 8-6.5" />
    </>
  ),
};

/** Bottom tab bar for phones — every tab within thumb reach. */
export function TabBar() {
  const isActive = useIsActive();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/50 bg-ink/95 backdrop-blur md:hidden pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="mx-auto grid h-[var(--tabbar-h)] max-w-lg grid-cols-5">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <li key={item.href} className="flex">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 w-full flex-col items-center justify-center gap-1 font-display text-[0.62rem] font-bold uppercase tracking-[0.04em] transition-colors min-[380px]:text-[0.68rem] min-[380px]:tracking-[0.08em] ${
                  active ? "text-gold-hi" : "text-cream/80 active:text-gold-hi"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {ICONS[item.href]}
                </svg>
                {item.label}
                <span
                  aria-hidden="true"
                  className={`h-0.5 w-6 rounded-full ${active ? "bg-gold-hi" : "bg-transparent"}`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
