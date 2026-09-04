"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { rand } from "@/lib/format";
import { FREE_DELIVERY_OVER_CENTS } from "@/lib/constants";
import { IconArrow, IconMinus, IconPlus, IconTrash, IconX } from "./icons";

export function CartDrawer() {
  const { lines, drawerOpen, setDrawerOpen, inc, dec, remove, subtotalCents, count } = useCart();

  return (
    <div
      className={`fixed inset-0 z-50 transition ${drawerOpen ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!drawerOpen}
    >
      <div
        onClick={() => setDrawerOpen(false)}
        className={`absolute inset-0 bg-black/70 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
      />
      <aside
        className={`absolute top-0 right-0 flex h-full w-full max-w-md flex-col border-l-2 border-gold/40 bg-coal2 shadow-2xl transition-transform duration-300 ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Your order basket"
      >
        <div className="flex items-center justify-between border-b border-gold/20 px-5 py-4">
          <p className="font-display text-xl tracking-wider text-cream uppercase">
            Your pull <span className="text-gold">({count})</span>
          </p>
          <button
            onClick={() => setDrawerOpen(false)}
            className="press grid h-9 w-9 place-items-center rounded-full bg-board2 text-cream hover:bg-chili hover:text-cream"
            aria-label="Close basket"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="mt-16 text-center">
              <p className="font-display text-2xl text-gold uppercase">Basket empty</p>
              <p className="mx-auto mt-2 max-w-[24ch] text-sm text-dim">
                The board is loaded — kotas from R20, worsrolls from R25. Go pick your pull.
              </p>
              <Link
                href="/menu"
                onClick={() => setDrawerOpen(false)}
                className="press mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 font-display tracking-wider text-coal uppercase hover:bg-cream"
              >
                Browse menu <IconArrow className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {lines.map((l) => (
                <li key={l.key} className="board p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-cream">{l.name}</p>
                      {l.extras.length > 0 && (
                        <p className="mt-0.5 text-xs text-gold/90">
                          + {l.extras.map((e) => e.name).join(", ")}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-dim">{rand(l.unitPriceCents)} each</p>
                    </div>
                    <button
                      onClick={() => remove(l.key)}
                      className="press grid h-8 w-8 place-items-center rounded-full bg-board2 text-dim hover:bg-chili hover:text-cream"
                      aria-label={`Remove ${l.name}`}
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 rounded-full bg-coal px-2 py-1">
                      <button
                        onClick={() => dec(l.key)}
                        className="press grid h-7 w-7 place-items-center rounded-full bg-board2 text-cream hover:bg-gold hover:text-coal"
                        aria-label="Decrease quantity"
                      >
                        <IconMinus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-5 text-center font-extrabold text-cream">{l.qty}</span>
                      <button
                        onClick={() => inc(l.key)}
                        className="press grid h-7 w-7 place-items-center rounded-full bg-board2 text-cream hover:bg-gold hover:text-coal"
                        aria-label="Increase quantity"
                      >
                        <IconPlus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="font-display text-lg text-gold">{rand(l.unitPriceCents * l.qty)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-gold/20 bg-coal px-5 py-4">
            <div className="flex items-center justify-between text-sm text-dim">
              <span>Subtotal</span>
              <span className="font-display text-xl text-cream">{rand(subtotalCents)}</span>
            </div>
            <p className="mt-1 text-xs text-dim">
              {subtotalCents >= FREE_DELIVERY_OVER_CENTS
                ? "Free delivery unlocked — the driver is on us."
                : `Delivery R25.00 · free over ${rand(FREE_DELIVERY_OVER_CENTS)} · pickup always free`}
            </p>
            <Link
              href="/checkout"
              onClick={() => setDrawerOpen(false)}
              className="press mt-3 flex items-center justify-center gap-2 rounded-full bg-gold py-3 font-display text-lg tracking-wider text-coal uppercase shadow-[4px_4px_0_rgba(0,0,0,.5)] hover:bg-cream"
            >
              Checkout <IconArrow className="h-5 w-5" />
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
