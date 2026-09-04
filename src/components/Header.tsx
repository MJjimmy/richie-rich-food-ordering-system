"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartContext";
import { IconCart, IconCrown } from "./icons";

const links = [
  { href: "/menu", label: "Menu" },
  { href: "/track", label: "Track order" },
  { href: "/kitchen", label: "Kitchen" },
];

export function Header() {
  const { count, setDrawerOpen } = useCart();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-gold/15 bg-coal/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="group flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-coal shadow-[3px_3px_0_rgba(0,0,0,.5)] transition-transform duration-300 group-hover:-rotate-12">
            <IconCrown className="h-5 w-5" />
          </span>
          <span className="leading-none">
            <span className="font-display text-xl tracking-wide text-cream uppercase">
              Richie <span className="text-gold">Rich</span>
            </span>
            <span className="mt-0.5 flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-dim uppercase">
              Kota &amp; Shisa Kitchen
              <span className="rounded-full bg-leaf/15 px-2 py-0.5 tracking-normal text-leaf">
                open
              </span>
            </span>
          </span>
        </Link>

        <span className="hidden items-center gap-1.5 text-xs font-semibold text-dim lg:flex">
          <span className="animate-pulsedot h-2 w-2 rounded-full bg-leaf" />
          accepting orders
        </span>

        <nav className="ml-auto hidden items-center gap-1 sm:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`press rounded-full px-4 py-2 text-sm font-semibold ${
                pathname === l.href
                  ? "bg-gold text-coal"
                  : "text-cream/80 hover:bg-board2 hover:text-gold"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          onClick={() => setDrawerOpen(true)}
          className="press relative ml-auto flex items-center gap-2 rounded-full bg-gold px-4 py-2.5 font-display text-sm tracking-wider text-coal uppercase shadow-[3px_3px_0_rgba(0,0,0,.5)] hover:bg-cream sm:ml-0"
          aria-label={`Open order basket, ${count} items`}
        >
          <IconCart className="h-5 w-5" />
          <span className="hidden sm:inline">Basket</span>
          {count > 0 && (
            <span
              key={count}
              className="animate-pop grid h-6 min-w-6 place-items-center rounded-full bg-chili px-1 text-xs font-extrabold text-cream"
            >
              {count}
            </span>
          )}
        </button>
      </div>

      <nav className="flex gap-1 overflow-x-auto border-t border-gold/10 px-4 py-2 no-scrollbar sm:hidden">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={`press shrink-0 rounded-full px-4 py-1.5 text-xs font-bold ${
              pathname === l.href ? "bg-gold text-coal" : "bg-board2 text-cream/80"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
