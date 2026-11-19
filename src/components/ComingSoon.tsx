import { Ornament, Waves } from "./Ornament";

/** Shared "COMING SOON" treatment for Menu and Catering. */
export function ComingSoon({ eyebrow }: { eyebrow: string }) {
  return (
    <section className="mx-auto flex w-full max-w-3xl flex-1 items-center px-4 py-10 md:py-16">
      <div className="badge-frame w-full overflow-hidden px-5 pb-0 pt-10 text-center md:px-10 md:pt-14">
        <h1 className="flex flex-col items-center gap-4">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.4em] text-cream/85 md:text-base">
            {eyebrow}
          </span>
          <Ornament />
          <span className="text-gold-foil font-deco text-[clamp(2.1rem,10.5vw,5.75rem)] font-bold uppercase leading-[1.1] tracking-[0.04em]">
            Coming
            <br />
            Soon
          </span>
        </h1>
        <Waves className="mx-auto mt-10 h-6 w-full" />
      </div>
    </section>
  );
}
