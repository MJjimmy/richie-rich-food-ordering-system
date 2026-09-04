"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { PROVIDERS } from "@/components/PaymentMarks";
import { rand } from "@/lib/format";
import { DELIVERY_FEE_CENTS, FREE_DELIVERY_OVER_CENTS } from "@/lib/constants";
import {
  IconArrow,
  IconBag,
  IconBike,
  IconCart,
  IconTrash,
  IconMinus,
  IconPlus,
} from "@/components/icons";

export default function CheckoutPage() {
  const { lines, subtotalCents, clear, inc, dec } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [provider, setProvider] = useState<string>("yoco");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const deliveryFee =
    orderType === "delivery" && subtotalCents < FREE_DELIVERY_OVER_CENTS
      ? DELIVERY_FEE_CENTS
      : 0;
  const total = subtotalCents + deliveryFee;

  const canSubmit = useMemo(
    () =>
      lines.length > 0 &&
      name.trim().length > 1 &&
      phone.trim().length >= 9 &&
      (orderType === "pickup" || address.trim().length > 5),
    [lines, name, phone, orderType, address],
  );

  const submit = async () => {
    if (!canSubmit || busy) return;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          email,
          orderType,
          address,
          notes,
          provider,
          lines: lines.map((l) => ({
            itemId: l.itemId,
            qty: l.qty,
            extraIds: l.extras.map((e) => e.id),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not place the order.");
      clear();
      if (provider === "cash") {
        router.push(`/order/${data.order.id}?new=1`);
      } else {
        router.push(`/pay/${data.order.id}?provider=${provider}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-board2 text-gold">
          <IconCart className="h-7 w-7" />
        </span>
        <h1 className="mt-6 font-display text-4xl text-cream uppercase">Basket is empty</h1>
        <p className="mt-3 text-sm text-dim">
          Load up on the board first — kotas from R20, worsrolls from R25, share boxes for
          the whole crew.
        </p>
        <Link
          href="/menu"
          className="press mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 font-display text-lg tracking-wider text-coal uppercase shadow-[4px_4px_0_rgba(0,0,0,.5)] hover:bg-cream"
        >
          Back to the menu <IconArrow className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs font-bold tracking-[0.28em] text-gold uppercase">Checkout</p>
      <h1 className="mt-2 font-display text-5xl text-cream uppercase">
        Lock it <span className="text-gold">in</span>
      </h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
        {/* form */}
        <div className="space-y-6">
          <section className="board p-6">
            <h2 className="font-display text-xl tracking-wider text-gold uppercase">
              1 · Who&apos;s eating?
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Name & surname">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Thabo M."
                  className={inputCls}
                />
              </Field>
              <Field label="WhatsApp number">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="071 590 0037"
                  inputMode="tel"
                  className={inputCls}
                />
              </Field>
              <Field label="Email (optional)" full>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@mail.co.za"
                  inputMode="email"
                  className={inputCls}
                />
              </Field>
            </div>
          </section>

          <section className="board p-6">
            <h2 className="font-display text-xl tracking-wider text-gold uppercase">
              2 · Pickup or delivery?
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                onClick={() => setOrderType("pickup")}
                className={`press flex items-center gap-3 rounded-xl border-2 p-4 text-left ${
                  orderType === "pickup"
                    ? "border-gold bg-gold/10"
                    : "border-gold/20 hover:border-gold/50"
                }`}
              >
                <IconBag className={`h-6 w-6 ${orderType === "pickup" ? "text-gold" : "text-dim"}`} />
                <span>
                  <span className="block font-bold text-cream">Pickup</span>
                  <span className="block text-xs text-dim">167 Thabo Sehume Str · free</span>
                </span>
              </button>
              <button
                onClick={() => setOrderType("delivery")}
                className={`press flex items-center gap-3 rounded-xl border-2 p-4 text-left ${
                  orderType === "delivery"
                    ? "border-gold bg-gold/10"
                    : "border-gold/20 hover:border-gold/50"
                }`}
              >
                <IconBike className={`h-6 w-6 ${orderType === "delivery" ? "text-gold" : "text-dim"}`} />
                <span>
                  <span className="block font-bold text-cream">Delivery</span>
                  <span className="block text-xs text-dim">
                    R25 · free over {rand(FREE_DELIVERY_OVER_CENTS)}
                  </span>
                </span>
              </button>
            </div>
            {orderType === "delivery" && (
              <div className="mt-4">
                <Field label="Delivery address">
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, suburb, landmark… e.g. 442 Makhubo St, Atteridgeville (blue gate)"
                    rows={2}
                    className={inputCls}
                  />
                </Field>
              </div>
            )}
            <div className="mt-4">
              <Field label="Note for the kitchen (optional)">
                <input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Extra achar on the side, no onion…"
                  className={inputCls}
                />
              </Field>
            </div>
          </section>

          <section className="board p-6">
            <h2 className="font-display text-xl tracking-wider text-gold uppercase">
              3 · Pay your way
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setProvider(p.id)}
                  className={`press flex items-center gap-3 rounded-xl border-2 p-4 text-left ${
                    provider === p.id
                      ? "border-gold bg-gold/10"
                      : "border-gold/20 hover:border-gold/50"
                  }`}
                >
                  <p.Mark className={`h-7 w-7 ${provider === p.id ? "text-gold" : "text-dim"}`} />
                  <span>
                    <span className="block font-bold text-cream">{p.name}</span>
                    <span className="block text-xs text-dim">{p.detail}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-dim">
              Prototype mode — gateway screens are simulated end to end, no real money moves.
            </p>
          </section>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="board p-6">
            <h2 className="font-display text-xl tracking-wider text-gold uppercase">
              The damage
            </h2>
            <ul className="mt-4 max-h-72 space-y-3 overflow-y-auto pr-1">
              {lines.map((l) => (
                <li key={l.key} className="flex items-start gap-3 text-sm">
                  <div className="flex items-center gap-2 rounded-full bg-coal px-1.5 py-1">
                    <button
                      onClick={() => dec(l.key)}
                      className="press grid h-6 w-6 place-items-center rounded-full bg-board2 hover:bg-chili"
                      aria-label="Decrease"
                    >
                      <IconMinus className="h-3 w-3" />
                    </button>
                    <span className="w-4 text-center font-extrabold">{l.qty}</span>
                    <button
                      onClick={() => inc(l.key)}
                      className="press grid h-6 w-6 place-items-center rounded-full bg-board2 hover:bg-gold hover:text-coal"
                      aria-label="Increase"
                    >
                      <IconPlus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-cream">{l.name}</p>
                    {l.extras.length > 0 && (
                      <p className="text-xs text-gold/80">+ {l.extras.map((e) => e.name).join(", ")}</p>
                    )}
                  </div>
                  <span className="font-bold text-cream">{rand(l.unitPriceCents * l.qty)}</span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-2 border-t border-gold/20 pt-4 text-sm">
              <div className="flex justify-between text-dim">
                <dt>Subtotal</dt>
                <dd className="font-bold text-cream">{rand(subtotalCents)}</dd>
              </div>
              <div className="flex justify-between text-dim">
                <dt>{orderType === "delivery" ? "Delivery" : "Pickup"}</dt>
                <dd className="font-bold text-cream">
                  {deliveryFee === 0 ? "Free" : rand(deliveryFee)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-gold/20 pt-3">
                <dt className="font-display text-lg tracking-wider text-cream uppercase">Total</dt>
                <dd className="font-display text-3xl text-gold">{rand(total)}</dd>
              </div>
            </dl>

            {error && (
              <p className="mt-3 rounded-lg bg-chili/15 px-3 py-2 text-sm font-bold text-chili">
                {error}
              </p>
            )}

            <button
              onClick={submit}
              disabled={!canSubmit || busy}
              className="press mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-4 font-display text-xl tracking-wider text-coal uppercase shadow-[5px_5px_0_rgba(0,0,0,.5)] hover:bg-cream disabled:cursor-not-allowed disabled:opacity-40"
            >
              {busy
                ? "Placing order…"
                : provider === "cash"
                  ? `Place order · ${rand(total)}`
                  : `Pay ${rand(total)} securely`}
              <IconArrow className="h-5 w-5" />
            </button>
            {!canSubmit && (
              <p className="mt-2 text-center text-xs text-dim">
                Add your name, a valid phone number
                {orderType === "delivery" ? " and delivery address" : ""} to continue.
              </p>
            )}
            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-dim">
              <IconTrash className="h-3.5 w-3.5" />
              Basket clears once the order is fired.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-gold/20 bg-coal px-4 py-3 text-cream placeholder-dim/50 outline-none transition-colors focus:border-gold";

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-xs font-bold tracking-[0.18em] text-dim uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
