"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { rand, PROVIDER_LABEL } from "@/lib/format";
import type { OrderT } from "@/lib/types";
import { ProviderMark } from "@/components/PaymentMarks";
import { IconBolt, IconCheck, IconClock, IconX } from "@/components/icons";

const BANKS = ["Absa", "Capitec", "FNB", "Nedbank", "Standard Bank", "TymeBank"];

const BRAND: Record<string, { name: string; color: string; blurb: string }> = {
  yoco: {
    name: "Yoco",
    color: "#00d0c0",
    blurb: "Card payment · Visa & Mastercard · 3-D Secure",
  },
  ozow: {
    name: "Ozow",
    color: "#7ac143",
    blurb: "Instant EFT · paid straight from your bank app",
  },
  payfast: {
    name: "PayFast",
    color: "#00c2f2",
    blurb: "Card, instant EFT & more — one secure rail",
  },
};

export default function PayPage() {
  const params = useParams<{ orderId: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const provider = (search.get("provider") ?? "yoco").toLowerCase();
  const brand = BRAND[provider] ?? BRAND.yoco;

  const [order, setOrder] = useState<OrderT | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [bank, setBank] = useState<string | null>(null);
  const [payfastMode, setPayfastMode] = useState<string | null>(null);
  const [card, setCard] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [stage, setStage] = useState<"idle" | "processing" | "done" | "failed">("idle");
  const [step, setStep] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    fetch(`/api/orders/${params.orderId}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("404"))))
      .then((d) => setOrder(d.order))
      .catch(() => setNotFound(true));
  }, [params.orderId]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const runProcessing = useCallback(() => {
    if (provider === "yoco") {
      if (card.replace(/\s/g, "").length !== 16 || !/^\d{2}\/\d{2}$/.test(cardExp) || cardCvc.length !== 3) {
        setStage("idle");
        return;
      }
    }
    setStage("processing");
    setStep(0);
    const labels = 3;
    for (let i = 1; i < labels; i++) {
      timers.current.push(window.setTimeout(() => setStep(i), i * 850));
    }
    timers.current.push(
      window.setTimeout(async () => {
        setStep(labels);
        try {
          const res = await fetch(`/api/orders/${params.orderId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ paymentStatus: "paid", status: "new" }),
          });
          if (!res.ok) throw new Error("patch failed");
          setStage("done");
          timers.current.push(
            window.setTimeout(() => router.replace(`/order/${params.orderId}?paid=1`), 1100),
          );
        } catch {
          setStage("failed");
        }
      }, labels * 850 + 400),
    );
  }, [card, cardCvc, cardExp, params.orderId, provider, router]);

  const cancel = async () => {
    await fetch(`/api/orders/${params.orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: "failed" }),
    }).catch(() => undefined);
    router.replace(`/order/${params.orderId}?cancelled=1`);
  };

  const canPay =
    provider === "yoco"
      ? card.replace(/\s/g, "").length === 16 && /^\d{2}\/\d{2}$/.test(cardExp) && cardCvc.length === 3
      : provider === "ozow"
        ? !!bank
        : !!payfastMode;

  if (notFound) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-4xl text-cream uppercase">Order not found</h1>
        <p className="mt-3 text-sm text-dim">That ticket doesn&apos;t exist on the pass.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="animate-flicker font-display text-2xl text-gold uppercase">
          Opening secure checkout…
        </p>
      </div>
    );
  }

  const steps = [
    `Connecting to ${brand.name}`,
    provider === "ozow" ? `Authorising with ${bank ?? "your bank"}` : "Authorising payment",
    "Confirming with Richie Rich kitchen",
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold tracking-[0.28em] text-dim uppercase">
          Secure checkout · test mode
        </p>
        <span className="flex items-center gap-1.5 rounded-full bg-leaf/15 px-3 py-1 text-xs font-bold text-leaf">
          <span className="h-2 w-2 rounded-full bg-leaf" /> encrypted
        </span>
      </div>

      <div className="board mt-4 overflow-hidden">
        {/* gateway header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: `linear-gradient(90deg, ${brand.color}22, transparent)` }}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: brand.color }}>
              <ProviderMark provider={provider} className="h-8 w-8" />
            </span>
            <div>
              <p className="font-display text-2xl tracking-wide text-cream uppercase">
                {brand.name}
              </p>
              <p className="text-xs text-dim">{brand.blurb}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-dim">Order {order.orderNumber}</p>
            <p className="font-display text-3xl text-gold">{rand(order.totalCents)}</p>
          </div>
        </div>

        <div className="p-6">
          {stage === "idle" && (
            <>
              {provider === "yoco" && (
                <>
                  <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr_1fr]">
                   <Labeled label="Card number">
                     <input
                       value={card}
                       onChange={(e) => setCard(e.target.value)}
                       className={inputCls}
                       inputMode="numeric"
                     />
                   </Labeled>
                   <Labeled label="Expiry">
                     <input value={cardExp} onChange={(e) => setCardExp(e.target.value)} placeholder="12/29" className={inputCls} />
                   </Labeled>
                   <Labeled label="CVC">
                     <input value={cardCvc} onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 3))} placeholder="123" className={inputCls} inputMode="numeric" />
                   </Labeled>
                  </div>
                  <button
                   onClick={() => {
                     setCard("4242 4242 4242 4242");
                     setCardExp("12/29");
                     setCardCvc("123");
                     setStage("idle");
                   }}
                   className="press mt-3 text-xs font-bold text-gold underline-offset-2 hover:underline"
                  >
                   Use demo card
                  </button>
                </>
              )}

              {provider === "ozow" && (
                <div>
                  <p className="text-sm font-bold text-cream">Choose your bank</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {BANKS.map((b) => (
                      <button
                        key={b}
                        onClick={() => setBank(b)}
                        className={`press rounded-xl border-2 px-4 py-3 text-sm font-bold ${
                          bank === b
                            ? "border-gold bg-gold/10 text-cream"
                            : "border-gold/20 text-dim hover:border-gold/50"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-dim">
                    You&apos;ll approve the payment in the {bank ?? "banking"} app — no card
                    details needed.
                  </p>
                </div>
              )}

              {provider === "payfast" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["card", "Credit / cheque card", "Visa, Mastercard, AMEX"],
                    ["eft", "Instant EFT", "All major SA banks"],
                  ].map(([id, title, sub]) => (
                    <button
                      key={id}
                      onClick={() => setPayfastMode(id)}
                      className={`press rounded-xl border-2 p-4 text-left ${
                        payfastMode === id
                          ? "border-gold bg-gold/10"
                          : "border-gold/20 hover:border-gold/50"
                      }`}
                    >
                      <p className="font-bold text-cream">{title}</p>
                      <p className="text-xs text-dim">{sub}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={runProcessing}
                  disabled={!canPay}
                  className="press flex flex-1 items-center justify-center gap-2 rounded-full py-4 font-display text-xl tracking-wider text-coal uppercase shadow-[5px_5px_0_rgba(0,0,0,.5)] disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: brand.color }}
                >
                  <IconBolt className="h-5 w-5" /> Pay {rand(order.totalCents)}
                </button>
                <button
                  onClick={cancel}
                  className="press rounded-full border-2 border-gold/30 px-6 py-4 font-display tracking-wider text-dim uppercase hover:border-chili hover:text-chili"
                >
                  Cancel
                </button>
              </div>
              <p className="mt-4 text-center text-xs text-dim">
                Simulated gateway — use the demo card above or pick any bank. No real money moves.
              </p>
            </>
          )}

          {stage === "processing" && (
            <div className="py-6">
              <p className="text-center font-display text-2xl tracking-wider text-cream uppercase">
                Processing {rand(order.totalCents)}
              </p>
              <ul className="mx-auto mt-6 max-w-sm space-y-3">
                {steps.map((s, i) => (
                  <li
                    key={s}
                    className={`flex items-center gap-3 text-sm font-semibold ${
                      step >= i ? "text-cream" : "text-dim/50"
                    }`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full ${
                        step > i
                          ? "bg-leaf text-coal"
                          : step === i
                            ? "animate-pulsedot bg-gold text-coal"
                            : "bg-board2 text-dim"
                      }`}
                    >
                      {step > i ? <IconCheck className="h-4 w-4" /> : <IconClock className="h-4 w-4" />}
                    </span>
                    {s}
                    {step > i && <span className="ml-auto text-xs text-leaf">done</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stage === "done" && (
            <div className="py-10 text-center">
              <span className="animate-pop mx-auto grid h-20 w-20 place-items-center rounded-full bg-leaf text-coal">
                <IconCheck className="h-10 w-10" />
              </span>
              <p className="mt-5 font-display text-3xl text-cream uppercase">Payment approved</p>
              <p className="mt-2 text-sm text-dim">
                Receipt sent to WhatsApp · ticket fired to the kitchen dashboard.
              </p>
            </div>
          )}

          {stage === "failed" && (
            <div className="py-10 text-center">
              <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-chili text-cream">
                <IconX className="h-10 w-10" />
              </span>
              <p className="mt-5 font-display text-3xl text-cream uppercase">
                Gateway didn&apos;t respond
              </p>
              <button
                onClick={() => setStage("idle")}
                className="press mt-6 rounded-full bg-gold px-8 py-3 font-display tracking-wider text-coal uppercase hover:bg-cream"
              >
                Try again
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-dim">
        Paying with {PROVIDER_LABEL[provider] ?? provider} · order {order.orderNumber} ·{" "}
        {order.orderType === "delivery" ? "delivery" : "pickup at 167 Thabo Sehume Str"}
      </p>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-gold/20 bg-coal px-4 py-3 font-mono text-cream outline-none focus:border-gold";

function Labeled({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold tracking-[0.18em] text-dim uppercase">
        {label}
      </span>
      {children}
    </label>
  );
}
