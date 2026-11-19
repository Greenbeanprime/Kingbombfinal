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
          <span className="text-gold-foil font-display text-[clamp(2.6rem,13vw,6.5rem)] font-black uppercase leading-[0.95] tracking-[0.06em]">
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
