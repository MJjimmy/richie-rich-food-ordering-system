"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { clockTime, rand, PROVIDER_LABEL, STATUS_LABEL } from "@/lib/format";
import { receiptText, RESTAURANT, waLink } from "@/lib/constants";
import type { OrderT } from "@/lib/types";
import {
  IconArrow,
  IconBag,
  IconBike,
  IconCheck,
  IconChef,
  IconClock,
  IconPhone,
  IconReceipt,
  IconWhatsApp,
} from "@/components/icons";

const PICKUP_FLOW = ["new", "preparing", "ready", "completed"] as const;
const DELIVERY_FLOW = ["new", "preparing", "ready", "out_for_delivery", "completed"] as const;

export default function OrderPage() {
  const params = useParams<{ orderId: string }>();
  const search = useSearchParams();
  const [order, setOrder] = useState<OrderT | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    const load = () =>
      fetch(`/api/orders/${params.orderId}`)
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("404"))))
        .then((d) => alive && setOrder(d.order))
        .catch(() => alive && setNotFound(true));
    load();
    const iv = window.setInterval(load, 5000);
    return () => {
      alive = false;
      window.clearInterval(iv);
    };
  }, [params.orderId]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <h1 className="font-display text-4xl text-cream uppercase">Ticket not found</h1>
        <Link href="/track" className="press mt-6 inline-block rounded-full bg-gold px-6 py-3 font-display tracking-wider text-coal uppercase">
          Track an order
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <p className="animate-flicker font-display text-2xl text-gold uppercase">Pulling your ticket…</p>
      </div>
    );
  }

  const paid = order.paymentStatus === "paid";
  const cash = order.paymentStatus === "pay_at_counter";
  const failed = order.paymentStatus === "failed";
  const stageIdx =
    order.orderType === "delivery"
      ? DELIVERY_FLOW.indexOf(order.status as (typeof DELIVERY_FLOW)[number])
      : PICKUP_FLOW.indexOf(order.status as (typeof PICKUP_FLOW)[number]);
  const justPaid = search.get("paid") === "1";
  const isNew = search.get("new") === "1";

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.28em] text-gold uppercase">
            Order {order.orderNumber}
          </p>
          <h1 className="mt-2 font-display text-5xl text-cream uppercase sm:text-6xl">
            {order.status === "cancelled" ? (
              "Order cancelled"
            ) : failed ? (
              "Payment stopped"
            ) : order.status === "completed" ? (
              <>
                Enjoy, <span className="text-gold">{order.customerName.split(" ")[0]}</span>
              </>
            ) : (
              <>
                It&apos;s <span className="text-gold">firing</span>
              </>
            )}
          </h1>
          <p className="mt-2 text-sm text-dim">
            Placed {clockTime(order.createdAt)} · {order.orderType === "delivery" ? "Delivery" : "Pickup at 167 Thabo Sehume Str"} ·{" "}
            {PROVIDER_LABEL[order.paymentProvider]}
          </p>
        </div>
        <span className="sticker text-lg">
          {failed ? "Action needed" : cash ? "Pay on hand-over" : paid ? "Paid in full" : "Awaiting payment"}
        </span>
      </div>

      {(justPaid || isNew) && (
        <div className="board mt-6 flex items-center gap-4 border-leaf/60 p-5">
          <span className="animate-pop grid h-12 w-12 shrink-0 place-items-center rounded-full bg-leaf text-coal">
            <IconWhatsApp className="h-6 w-6" />
          </span>
          <div>
            <p className="font-bold text-cream">WhatsApp confirmation sent</p>
            <p className="text-sm text-dim">
              Your itemised receipt just landed on {order.phone} from {RESTAURANT.phoneDisplay}.
              The kitchen dashboard picked the ticket up at the same moment.
            </p>
          </div>
        </div>
      )}

      {failed && (
        <div className="board mt-6 flex flex-wrap items-center gap-4 border-chili/60 p-5">
          <p className="flex-1 text-sm text-cream">
            Payment was cancelled at the gateway. Your basket items are still on this ticket —
            retry payment whenever you&apos;re ready.
          </p>
          <Link
            href={`/pay/${order.id}?provider=${order.paymentProvider}`}
            className="press rounded-full bg-gold px-6 py-3 font-display tracking-wider text-coal uppercase hover:bg-cream"
          >
            Retry payment
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        {/* timeline */}
        <section className="board p-6">
          <h2 className="font-display text-xl tracking-wider text-gold uppercase">Live status</h2>
          <ol className="mt-5 space-y-0">
            {[
              { key: "placed", label: "Order placed", detail: `${clockTime(order.createdAt)} · online portal`, done: true, bad: false, icon: IconReceipt },
              {
                key: "paid",
                label: cash ? "Cash on hand-over" : "Payment confirmed",
                detail: cash
                  ? "Settle at the counter or with the driver"
                  : paid
                    ? `${PROVIDER_LABEL[order.paymentProvider]} · approved`
                    : failed
                      ? "Cancelled at gateway"
                      : "Waiting at gateway",
                done: paid || cash,
                bad: failed,
                icon: ProviderIconWrap,
              },
              { key: "new", label: "Fired in the kitchen", detail: "Ticket printed on the pass", done: stageIdx >= 0 && order.status !== "cancelled", bad: false, icon: IconChef },
              { key: "preparing", label: "On the flames", detail: "Grill, fryer & wrap station working", done: stageIdx >= 1, bad: false, icon: IconClock },
              {
                key: "ready",
                label: order.orderType === "delivery" ? "Ready for dispatch" : "Ready for collection",
                detail: order.orderType === "delivery" ? "Waiting for the driver" : "Collect at the counter",
                done: stageIdx >= 2,
                bad: false,
                icon: order.orderType === "delivery" ? IconBike : IconBag,
              },
              ...(order.orderType === "delivery"
                ? [
                    {
                      key: "out_for_delivery",
                      label: "Out for delivery",
                      detail: "Driver on the way",
                      done: stageIdx >= 3,
                      bad: false,
                      icon: IconBike,
                    },
                  ]
                : []),
              {
                key: "completed",
                label: "Handed over",
                detail: "Eat rich. Tell the group chat.",
                done: stageIdx >= (order.orderType === "delivery" ? 4 : 3),
                bad: false,
                icon: IconCheck,
              },
            ].map((s, i, arr) => (
              <li key={s.key} className="relative flex gap-4 pb-6 last:pb-0">
                {i < arr.length - 1 && (
                  <span
                    className={`absolute top-10 left-[19px] h-[calc(100%-2.2rem)] w-0.5 ${s.done ? "bg-gold" : "bg-gold/15"}`}
                  />
                )}
                <span
                  className={`z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 ${
                    s.bad
                      ? "border-chili bg-chili/20 text-chili"
                      : s.done
                        ? "border-gold bg-gold text-coal"
                        : "border-gold/25 bg-coal text-dim"
                  } ${s.done && !s.bad && order.status === s.key ? "animate-pulsedot" : ""}`}
                >
                  <s.icon className="h-5 w-5" />
                </span>
                <div className="pt-1">
                  <p className={`font-bold ${s.done ? "text-cream" : "text-dim"}`}>{s.label}</p>
                  <p className="text-xs text-dim">{s.detail}</p>
                </div>
                {order.status === s.key && order.status !== "completed" && (
                  <span className="ml-auto mt-1 rounded-full bg-gold/15 px-3 py-1 text-xs font-extrabold text-gold uppercase">
                    {STATUS_LABEL[order.status]}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* receipt */}
        <aside className="space-y-6">
          <div className="board p-6">
            <h2 className="font-display text-xl tracking-wider text-gold uppercase">Receipt</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {order.items.map((i) => (
                <li key={i.id} className="flex justify-between gap-3">
                  <span className="text-cream">
                    <strong className="text-gold">{i.qty}×</strong> {i.itemName}
                    {i.extrasText && <span className="block text-xs text-dim">+ {i.extrasText}</span>}
                  </span>
                  <span className="font-bold text-cream">{rand(i.totalCents)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-gold/20 pt-3 text-sm text-dim">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{rand(order.subtotalCents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>{order.orderType === "delivery" ? "Delivery" : "Pickup"}</dt>
                <dd>{order.deliveryFeeCents === 0 ? "Free" : rand(order.deliveryFeeCents)}</dd>
              </div>
              <div className="flex justify-between pt-1 text-base">
                <dt className="font-display tracking-wider text-cream uppercase">Total</dt>
                <dd className="font-display text-2xl text-gold">{rand(order.totalCents)}</dd>
              </div>
            </dl>
          </div>

          <div className="board p-6">
            <h2 className="font-display text-xl tracking-wider text-gold uppercase">Details</h2>
            <ul className="mt-3 space-y-2 text-sm text-dim">
              <li className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-gold" /> {order.phone}
              </li>
              {order.orderType === "delivery" && order.address && (
                <li className="flex items-start gap-2">
                  <IconBike className="mt-0.5 h-4 w-4 text-gold" /> {order.address}
                </li>
              )}
              {order.notes && <li className="text-xs italic">“{order.notes}”</li>}
            </ul>
            <a
              href={waLink(receiptText(order))}
              target="_blank"
              rel="noreferrer"
              className="press mt-4 flex items-center justify-center gap-2 rounded-full bg-leaf/20 py-3 font-display tracking-wider text-leaf uppercase hover:bg-leaf/30"
            >
              <IconWhatsApp className="h-5 w-5" /> WhatsApp my receipt
            </a>
            <Link
              href="/menu"
              className="press mt-3 flex items-center justify-center gap-2 rounded-full border-2 border-gold/30 py-3 font-display tracking-wider text-cream uppercase hover:border-gold hover:text-gold"
            >
              Order something else <IconArrow className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProviderIconWrap({ className }: { className?: string }) {
  return <IconReceipt className={className} />;
}
