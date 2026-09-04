"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { lineKey, useCart } from "./CartContext";
import { rand } from "@/lib/format";
import type { CategoryT, MenuItemT } from "@/lib/types";
import {
  IconArrow,
  IconCart,
  IconFlame,
  IconMinus,
  IconPlus,
  IconSearch,
} from "./icons";

export function MenuClient({ categories }: { categories: CategoryT[] }) {
  const { openItem, addLine, inc, dec, lines, qtyForItem, count, subtotalCents, setDrawerOpen } =
    useCart();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(categories[0]?.slug ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY + 200;
      let current = categories[0]?.slug ?? "";
      for (const c of categories) {
        const el = sectionRefs.current[c.slug];
        if (el && el.offsetTop <= y) current = c.slug;
      }
      setActive(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [categories]);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      q
        ? categories
            .map((c) => ({
              ...c,
              items: c.items.filter(
                (i) =>
                  i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q),
              ),
            }))
            .filter((c) => c.items.length > 0)
        : categories,
    [categories, q],
  );

  const jump = (slug: string) => {
    const el = sectionRefs.current[slug];
    if (el) window.scrollTo({ top: el.offsetTop - 150, behavior: "smooth" });
  };

  return (
    <div className="pb-28 lg:pb-16">
      {/* board header */}
      <div className="border-b-2 border-gold/25 bg-board/60">
        <div className="mx-auto max-w-5xl px-4 pt-10 pb-6">
          <p className="text-xs font-bold tracking-[0.28em] text-gold uppercase">
            The full board · updated daily
          </p>
          <h1 className="mt-2 font-display text-5xl text-cream uppercase sm:text-6xl">
            Today at <span className="text-gold">Richie Rich</span>
          </h1>
          <div className="mt-6 flex items-center gap-3 rounded-full border-2 border-gold/30 bg-coal px-5 py-3 focus-within:border-gold">
            <IconSearch className="h-5 w-5 text-gold" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search kotas, wraps, wings, shawarma…"
              className="w-full bg-transparent text-cream placeholder-dim/70 outline-none"
              aria-label="Search the menu"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="press text-xs font-bold text-dim hover:text-gold"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* category rail */}
        {!q && (
          <div className="no-scrollbar mx-auto flex max-w-5xl gap-2 overflow-x-auto px-4 pb-4">
            {categories.map((c) => (
              <button
                key={c.slug}
                onClick={() => jump(c.slug)}
                className={`press shrink-0 rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap ${
                  active === c.slug
                    ? "bg-gold text-coal shadow-[3px_3px_0_rgba(0,0,0,.45)]"
                    : "bg-coal/70 text-cream/80 hover:text-gold"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-10">
        {filtered.length === 0 && (
          <div className="board mx-auto max-w-md p-10 text-center">
            <p className="font-display text-3xl text-gold uppercase">Nothing on the board</p>
            <p className="mt-2 text-sm text-dim">
              No dish matches “{query}”. Try “kota”, “wors”, “wrap” or “wings”.
            </p>
          </div>
        )}

        {filtered.map((c) => (
          <section
            key={c.id}
            id={c.slug}
            ref={(el) => {
              sectionRefs.current[c.slug] = el;
            }}
            className="scroll-mt-40 pb-14"
          >
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-gold shadow-[0_0_0_4px_rgba(11,18,16,.9)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div>
                <h2 className="font-display text-3xl tracking-wide text-cream uppercase sm:text-4xl">
                  {c.name}
                </h2>
                <p className="text-sm text-dim">{c.tagline}</p>
              </div>
              <span className="sticker ml-auto hidden text-sm sm:inline-block">
                {c.items.length} dishes
              </span>
            </div>

            <ul className="mt-5 space-y-3">
              {c.items.map((item) => (
                <ItemRow
                  key={item.id}
                  item={item}
                  onOpen={() => openItem(item)}
                  onQuickAdd={() => addLine(item, 1, [])}
                  qty={qtyForItem(item.id)}
                  baseQty={lines.find((l) => l.key === lineKey(item.id, []))?.qty ?? 0}
                  baseKey={lineKey(item.id, [])}
                  onInc={(k) => inc(k)}
                  onDec={(k) => dec(k)}
                  onShowBasket={() => setDrawerOpen(true)}
                />
              ))}
            </ul>
          </section>
        ))}

        <div className="board flex flex-col items-center gap-4 p-8 text-center">
          <p className="font-display text-2xl text-cream uppercase">
            Looking for something else?
          </p>
          <p className="max-w-md text-sm text-dim">
            Message Richie on WhatsApp for catering trays, events and off-menu pulls —
            the kitchen loves a challenge.
          </p>
          <a
            href="https://wa.me/27715900037?text=Hi%20Richie%20Rich!%20I%20want%20something%20off%20the%20menu."
            target="_blank"
            rel="noreferrer"
            className="press rounded-full bg-leaf/20 px-6 py-3 font-display tracking-wider text-leaf uppercase hover:bg-leaf/30"
          >
            Message the kitchen
          </a>
        </div>
      </div>

      {/* mobile basket bar */}
      {count > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-gold/40 bg-coal/95 p-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setDrawerOpen(true)}
            className="press flex w-full items-center justify-between rounded-full bg-gold px-6 py-3.5 font-display text-lg tracking-wider text-coal uppercase shadow-[4px_4px_0_rgba(0,0,0,.5)]"
          >
            <span className="flex items-center gap-2">
              <IconCart className="h-5 w-5" /> {count} in basket
            </span>
            <span className="flex items-center gap-2">
              {rand(subtotalCents)} <IconArrow className="h-5 w-5" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

function ItemRow({
  item,
  onOpen,
  onQuickAdd,
  qty,
  baseQty,
  baseKey,
  onInc,
  onDec,
  onShowBasket,
}: {
  item: MenuItemT;
  onOpen: () => void;
  onQuickAdd: () => void;
  qty: number;
  baseQty: number;
  baseKey: string;
  onInc: (k: string) => void;
  onDec: (k: string) => void;
  onShowBasket: () => void;
}) {
  return (
    <li>
      <div
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(e) => {
          if (e.key === "Enter") onOpen();
        }}
        className="board group flex cursor-pointer items-center gap-4 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-gold sm:p-5"
      >
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-2 font-bold text-cream group-hover:text-gold">
            {item.name}
            {item.popular && (
              <span className="flex items-center gap-1 rounded-full bg-chili/20 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-chili uppercase">
                <IconFlame className="h-3 w-3" /> most ordered
              </span>
            )}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-dim">{item.description}</p>
          <p className="mt-2 font-display text-xl text-gold">{rand(item.priceCents)}</p>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          {baseQty > 0 ? (
            <div className="flex items-center gap-2 rounded-full bg-coal px-2 py-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDec(baseKey);
                }}
                className="press grid h-8 w-8 place-items-center rounded-full bg-board2 hover:bg-chili"
                aria-label={`Remove one ${item.name}`}
              >
                <IconMinus className="h-3.5 w-3.5" />
              </button>
              <span className="w-5 text-center font-extrabold text-cream">{baseQty}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInc(baseKey);
                }}
                className="press grid h-8 w-8 place-items-center rounded-full bg-board2 hover:bg-gold hover:text-coal"
                aria-label={`Add one ${item.name}`}
              >
                <IconPlus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onQuickAdd();
              }}
              className="press grid h-11 w-11 place-items-center rounded-full bg-gold text-coal shadow-[3px_3px_0_rgba(0,0,0,.5)] hover:bg-cream"
              aria-label={`Add ${item.name} to basket`}
            >
              <IconPlus className="h-5 w-5" />
            </button>
          )}
          {qty > 0 && baseQty === 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShowBasket();
              }}
              className="press rounded-full bg-chili/20 px-3 py-1 text-xs font-extrabold text-chili"
            >
              {qty} in basket
            </button>
          )}
          <span className="text-[11px] font-bold tracking-wider text-dim uppercase opacity-0 transition-opacity group-hover:opacity-100">
            customise
          </span>
        </div>
      </div>
    </li>
  );
}
