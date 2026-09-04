"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { IconArrow, IconTicket } from "@/components/icons";

export default function TrackPage() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const q = value.trim().toUpperCase();
    if (!q) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/orders/${q}`);
      if (!res.ok) throw new Error("nope");
      const data = await res.json();
      router.push(`/order/${data.order.id}`);
    } catch {
      setError(`No ticket found for “${q}”. Check the number on your WhatsApp receipt, e.g. RR-1001.`);
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-20">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-board2 text-gold">
        <IconTicket className="h-7 w-7" />
      </span>
      <h1 className="mt-6 font-display text-5xl text-cream uppercase">
        Track your <span className="text-gold">pull</span>
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-dim">
        Punch in the order number from your WhatsApp receipt and watch the ticket move from
        the pass to your hand — live.
      </p>

      <form onSubmit={submit} className="mt-8 flex gap-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="RR-1001"
          className="flex-1 rounded-full border-2 border-gold/30 bg-coal2 px-6 py-4 font-display text-xl tracking-widest text-cream uppercase outline-none placeholder-dim/40 focus:border-gold"
          aria-label="Order number"
        />
        <button
          type="submit"
          disabled={busy || !value.trim()}
          className="press flex items-center gap-2 rounded-full bg-gold px-7 py-4 font-display text-lg tracking-wider text-coal uppercase shadow-[4px_4px_0_rgba(0,0,0,.5)] hover:bg-cream disabled:opacity-40"
        >
          {busy ? "…" : "Find"} <IconArrow className="h-5 w-5" />
        </button>
      </form>
      {error && <p className="mt-4 rounded-lg bg-chili/15 px-4 py-3 text-sm font-bold text-chili">{error}</p>}
    </div>
  );
}
