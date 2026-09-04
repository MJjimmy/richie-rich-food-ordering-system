"use client";

import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { rand } from "@/lib/format";
import type { ExtraT } from "@/lib/types";
import { IconCheck, IconFlame, IconMinus, IconPlus, IconX } from "./icons";

export function ItemModal() {
  const { modalItem, closeModal, addLine, setDrawerOpen } = useCart();
  const [extras, setExtras] = useState<ExtraT[]>([]);
  const [qty, setQty] = useState(1);
  const [catalog, setCatalog] = useState<ExtraT[]>([]);

  useEffect(() => {
    fetch("/api/menu")
      .then((r) => r.json())
      .then((d) => setCatalog(d.extras ?? []))
      .catch(() => setCatalog([]));
  }, []);

  useEffect(() => {
    if (modalItem) {
      queueMicrotask(() => {
        setExtras([]);
        setQty(1);
      });
    }
  }, [modalItem]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  if (!modalItem) return null;

  const extrasCents = extras.reduce((s, e) => s + e.priceCents, 0);
  const total = (modalItem.priceCents + extrasCents) * qty;

  const toggle = (e: ExtraT) =>
    setExtras((prev) =>
      prev.some((x) => x.id === e.id) ? prev.filter((x) => x.id !== e.id) : [...prev, e],
    );

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-label={modalItem.name}>
      <div className="absolute inset-0 bg-black/75" onClick={closeModal} />
      <div className="board relative w-full max-w-lg overflow-hidden">
        <button
          onClick={closeModal}
          className="press absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-coal/80 text-cream hover:bg-chili"
          aria-label="Close"
        >
          <IconX className="h-4 w-4" />
        </button>

        <div className="max-h-[80vh] overflow-y-auto p-6">
          <div className="flex items-start gap-3 pr-10">
            {modalItem.popular && (
              <span className="sticker mt-1 flex items-center gap-1 text-xs">
                <IconFlame className="h-3.5 w-3.5" /> Most ordered
              </span>
            )}
          </div>
          <h3 className="mt-2 font-display text-3xl leading-tight text-cream uppercase">
            {modalItem.name}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-dim">{modalItem.description}</p>
          <p className="mt-3 font-display text-2xl text-gold">{rand(modalItem.priceCents)}</p>

          {catalog.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-bold tracking-[0.2em] text-gold uppercase">
                Make it richer
              </p>
              <div className="mt-2 space-y-2">
                {catalog.map((e) => {
                  const on = extras.some((x) => x.id === e.id);
                  return (
                    <button
                      key={e.id}
                      onClick={() => toggle(e)}
                      className={`press flex w-full items-center justify-between rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                        on
                          ? "border-gold bg-gold/15 text-cream"
                          : "border-gold/20 bg-coal/60 text-dim hover:border-gold/50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`grid h-5 w-5 place-items-center rounded-md border ${
                            on ? "border-gold bg-gold text-coal" : "border-dim/40"
                          }`}
                        >
                          {on && <IconCheck className="h-3 w-3" />}
                        </span>
                        {e.name}
                      </span>
                      <span className="text-gold">+{rand(e.priceCents)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 rounded-full bg-coal px-2 py-1.5">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="press grid h-8 w-8 place-items-center rounded-full bg-board2 hover:bg-gold hover:text-coal"
                aria-label="Decrease quantity"
              >
                <IconMinus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center font-extrabold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="press grid h-8 w-8 place-items-center rounded-full bg-board2 hover:bg-gold hover:text-coal"
                aria-label="Increase quantity"
              >
                <IconPlus className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              onClick={() => {
                addLine(modalItem, qty, extras);
                closeModal();
                setDrawerOpen(true);
              }}
              className="press flex-1 rounded-full bg-gold py-3 font-display text-lg tracking-wider text-coal uppercase shadow-[4px_4px_0_rgba(0,0,0,.5)] hover:bg-cream"
            >
              Add · {rand(total)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
