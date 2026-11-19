import type { Metadata } from "next";
import Image from "next/image";
import { ComingSoon } from "@/components/ComingSoon";
import { Ornament } from "@/components/Ornament";
import { AddToCart } from "@/components/cart/AddToCart";
import { pageMeta } from "@/lib/site";
import { CATEGORIES, availableItems, formatPrice, hasMenu, orderingOn } from "@/data/menu";

export const metadata: Metadata = pageMeta({
  title: "Menu: Seafood Platters, Tacos & Pho",
  description:
    "The KINGBOMB menu: Coastal Party Platters, seafood platters, tacos, and pho for late night food in Florida. Full menu coming soon.",
  path: "/menu",
});

export default function MenuPage() {
  if (!hasMenu()) return <ComingSoon eyebrow="Our Menu" />;

  const items = availableItems();
  const ordering = orderingOn();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 pb-28">
      <h1 className="text-center text-[clamp(2.2rem,10vw,4.5rem)]">
        <span className="text-gold-foil">Menu</span>
      </h1>
      <Ornament className="mt-4" />

      {CATEGORIES.map((cat) => {
        const list = items.filter((i) => i.category === cat);
        if (!list.length) return null;
        return (
          <section key={cat} aria-labelledby={`cat-${cat}`} className="mt-12">
            <h2 id={`cat-${cat}`} className="mb-5 text-center text-2xl text-gold-hi md:text-left">
              {cat}
            </h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((item) => (
                <li key={item.id} className="badge-frame flex flex-col overflow-hidden">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={`${item.name}: ${item.description}`}
                      width={1200}
                      height={900}
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 30vw"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  )}
                  <div className="relative flex flex-1 flex-col gap-2 p-5">
                    <div className="flex items-baseline justify-between gap-3">
                      <h3 className="text-lg text-cream">{item.name}</h3>
                      <p className="shrink-0 font-semibold text-gold-hi">{formatPrice(item.price)}</p>
                    </div>
                    <p className="flex-1 text-cream/80">{item.description}</p>
                    {ordering && (
                      <div className="mt-3">
                        <AddToCart id={item.id} name={item.name} price={item.price} />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
