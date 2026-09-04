"use client";

import { useCart } from "./CartContext";
import { rand } from "@/lib/format";
import type { MenuItemT } from "@/lib/types";
import { IconFlame, IconPlus } from "./icons";

export type PopularSeed = { item: MenuItemT; image: string; category: string };

export function HomePopular({ seeds }: { seeds: PopularSeed[] }) {
  const { openItem, addLine, qtyForItem } = useCart();

  return (
    <div className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
      {seeds.map((s) => {
        const qty = qtyForItem(s.item.id);
        return (
          <div
            key={s.item.id}
            role="button"
            tabIndex={0}
            onClick={() => openItem(s.item)}
            onKeyDown={(e) => {
              if (e.key === "Enter") openItem(s.item);
            }}
            className="group board w-64 shrink-0 cursor-pointer overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1.5 lg:w-auto"
          >
            <div className="relative h-36 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.image}
                alt={s.item.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <span className="sticker absolute top-2 left-2 text-xs">{s.category}</span>
              {qty > 0 && (
                <span className="animate-pop absolute top-2 right-2 grid h-7 min-w-7 place-items-center rounded-full bg-chili px-1.5 font-extrabold text-cream">
                  {qty}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="flex items-center gap-1.5 font-bold text-cream">
                {s.item.popular && <IconFlame className="h-4 w-4 text-chili" />}
                {s.item.name}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-dim">
                {s.item.description}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-display text-xl text-gold">{rand(s.item.priceCents)}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addLine(s.item, 1, []);
                  }}
                  className="press grid h-9 w-9 place-items-center rounded-full bg-gold text-coal shadow-[3px_3px_0_rgba(0,0,0,.5)] hover:bg-cream"
                  aria-label={`Add ${s.item.name} to basket`}
                >
                  <IconPlus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
