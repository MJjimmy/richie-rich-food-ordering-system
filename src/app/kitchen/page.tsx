"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { rand, timeAgo, PROVIDER_LABEL } from "@/lib/format";
import type { OrderT } from "@/lib/types";
import { ProviderMark } from "@/components/PaymentMarks";
import {
  IconBag,
  IconBike,
  IconChef,
  IconCheck,
  IconClock,
  IconFlame,
  IconPhone,
} from "@/components/icons";

type KitchenActivity = {
  orderNumber: string;
  phone: string;
  status: string;
  updatedAt: string;
};

type Kitchen = {
  orders: OrderT[];
  completedToday: number;
  ordersToday: number;
  revenueToday: number;
  averageFulfillmentMinutes: number | null;
  activity: KitchenActivity[];
};

const COLS: {
  status: string;
  title: string;
  action: (order: OrderT) => string;
  next: (order: OrderT) => string;
  icon: typeof IconChef;
}[] = [
  { status: "new", title: "New tickets", action: () => "Start cooking", next: () => "preparing", icon: IconClock },
  { status: "preparing", title: "On the flames", action: () => "Mark ready", next: () => "ready", icon: IconFlame },
  {
    status: "ready",
    title: "Ready for hand-over",
    action: (order) => (order.orderType === "delivery" ? "Send with driver" : "Hand over"),
    next: (order) => (order.orderType === "delivery" ? "out_for_delivery" : "completed"),
    icon: IconBag,
  },
  {
    status: "out_for_delivery",
    title: "Out for delivery",
    action: () => "Mark delivered",
    next: () => "completed",
    icon: IconBike,
  },
];

export default function KitchenPage() {
  const [data, setData] = useState<Kitchen | null>(null);
  const [now, setNow] = useState(0);

  const load = useCallback(() => {
    fetch("/api/orders?view=kitchen")
      .then((r) => r.json())
      .then((d) => setData(d as Kitchen))
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    load();
    queueMicrotask(() => setNow(Date.now()));
    const iv = window.setInterval(load, 4000);
    const tick = window.setInterval(() => setNow(Date.now()), 30000);
    return () => {
      window.clearInterval(iv);
      window.clearInterval(tick);
    };
  }, [load]);

  const advance = async (order: OrderT, next: string) => {
    setData((prev) =>
      prev
        ? {
            ...prev,
            orders: prev.orders.map((o) => (o.id === order.id ? { ...o, status: next } : o)),
            completedToday:
              next === "completed" ? prev.completedToday + 1 : prev.completedToday,
          }
        : prev,
    );
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    }).catch(() => undefined);
    load();
  };

  const newCount = data?.orders.filter((o) => o.status === "new").length ?? 0;

  return (
    <div className="min-h-[80vh] px-4 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold tracking-[0.28em] text-gold uppercase">
              <span className="animate-pulsedot h-2.5 w-2.5 rounded-full bg-gold" />
              Live · refreshes every 4s
            </p>
            <h1 className="mt-2 font-display text-5xl text-cream uppercase sm:text-6xl">
              Kitchen <span className="text-gold">pass</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 text-center">
            <Stat big={String(data?.ordersToday ?? 0)} small="orders today" />
            <Stat big={rand(data?.revenueToday ?? 0)} small="revenue today" />
            <Stat big={String(data?.orders.length ?? 0)} small="in progress" hot={newCount > 0} />
            <Stat
              big={data?.averageFulfillmentMinutes == null ? "—" : `${data.averageFulfillmentMinutes}m`}
              small="avg. fulfilment"
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-4">
          {COLS.map((col) => {
            const list = data?.orders.filter((o) => o.status === col.status) ?? [];
            return (
              <section key={col.status} className="board flex min-h-[420px] flex-col p-4">
                <header className="flex items-center justify-between px-1 pb-3">
                  <h2 className="flex items-center gap-2 font-display text-xl tracking-wider text-cream uppercase">
                    <col.icon className="h-5 w-5 text-gold" /> {col.title}
                  </h2>
                  <span className="sticker text-sm">{list.length}</span>
                </header>

                <div className="flex-1 space-y-3 overflow-y-auto pr-1">
                  {list.length === 0 && (
                    <div className="grid h-40 place-items-center rounded-xl border-2 border-dashed border-gold/15 text-center">
                      <p className="max-w-[18ch] text-sm text-dim">
                        {col.status === "new"
                          ? "Quiet on the pass… next ticket lands here instantly."
                          : "Nothing here right now."}
                      </p>
                    </div>
                  )}
                  {list.map((o) => (
                    <Ticket
                      key={o.id}
                      order={o}
                      now={now}
                      action={col.action(o)}
                      onNext={() => advance(o, col.next(o))}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="board mt-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl tracking-wider text-cream uppercase">
                WhatsApp automation
              </h2>
              <p className="mt-1 text-sm text-dim">
                Status updates are ready to send automatically — no manual typing.
              </p>
            </div>
            <span className="rounded-full bg-leaf/15 px-3 py-1 text-xs font-bold text-leaf">
              {data?.activity.length ?? 0} recent events
            </span>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {(data?.activity ?? []).slice(0, 8).map((event) => (
              <div key={`${event.orderNumber}-${event.updatedAt}`} className="rounded-xl border border-gold/15 bg-coal2 p-3">
                <p className="text-xs font-bold text-cream">
                  → {event.phone} · {event.orderNumber}
                </p>
                <p className="mt-1 text-xs text-dim">{activityLabel(event.status)}</p>
              </div>
            ))}
            {!data?.activity.length && (
              <p className="text-sm text-dim">Messages sent to customers will appear here automatically.</p>
            )}
          </div>
        </section>

        <p className="mt-6 text-center text-xs text-dim">
          Tablet-ready dashboard from the Core Automation Package ·{" "}
          <Link href="/menu" className="text-gold underline-offset-2 hover:underline">
            back to the storefront
          </Link>
        </p>
      </div>
    </div>
  );
}

function activityLabel(status: string) {
  if (status === "new") return "Order confirmed · ticket fired";
  if (status === "preparing") return "Your order is being prepared";
  if (status === "ready") return "Order ready for hand-over";
  if (status === "out_for_delivery") return "Order is out for delivery";
  if (status === "completed") return "Order handed over";
  return "Order status updated";
}

function Stat({ big, small, hot }: { big: string; small: string; hot?: boolean }) {
  return (
    <div
      className={`board min-w-[92px] px-4 py-3 ${hot ? "border-chili/70" : ""}`}
    >
      <p className={`font-display text-3xl ${hot ? "animate-flicker text-chili" : "text-gold"}`}>
        {big}
      </p>
      <p className="text-[10px] font-bold tracking-[0.18em] text-dim uppercase">{small}</p>
    </div>
  );
}

function Ticket({
  order,
  now,
  action,
  onNext,
}: {
  order: OrderT;
  now: number;
  action: string;
  onNext: () => void;
}) {
  const mins = Math.max(
    0,
    Math.floor((now - new Date(order.createdAt).getTime()) / 60000),
  );
  const late = mins >= 20;
  return (
    <article
      className={`rounded-xl border-2 bg-coal p-4 ${
        order.status === "new" ? "animate-pulsedot border-gold" : "border-gold/20"
      }`}
    >
      <header className="flex items-start justify-between gap-2">
        <div>
          <p className="font-display text-2xl tracking-wider text-cream uppercase">
            {order.orderNumber}
          </p>
          <p className={`text-xs font-bold ${late ? "text-chili" : "text-dim"}`}>
            {timeAgo(order.createdAt)} · {mins} min on the clock
          </p>
        </div>
        <span
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold uppercase ${
            order.orderType === "delivery" ? "bg-gold/15 text-gold" : "bg-board2 text-cream/80"
          }`}
        >
          {order.orderType === "delivery" ? <IconBike className="h-3.5 w-3.5" /> : <IconBag className="h-3.5 w-3.5" />}
          {order.orderType}
        </span>
      </header>

      <ul className="mt-3 space-y-1.5 border-y border-gold/15 py-3 text-sm">
        {order.items.map((i) => (
          <li key={i.id}>
            <p className="font-bold text-cream">
              <span className="text-gold">{i.qty}×</span> {i.itemName}
            </p>
            {i.extrasText && <p className="text-xs text-gold/80">+ {i.extrasText}</p>}
          </li>
        ))}
        {order.notes && <li className="text-xs text-chili italic">note: {order.notes}</li>}
      </ul>

      <div className="mt-3 flex items-center justify-between text-xs text-dim">
        <span className="flex items-center gap-1.5">
          <ProviderMark provider={order.paymentProvider} className="h-4 w-4 text-gold" />
          {order.paymentStatus === "paid"
            ? `Paid · ${PROVIDER_LABEL[order.paymentProvider]}`
            : order.paymentStatus === "pay_at_counter"
              ? "Cash on hand-over"
              : PROVIDER_LABEL[order.paymentProvider]}
        </span>
        <span className="font-display text-lg text-gold">{rand(order.totalCents)}</span>
      </div>

      {order.orderType === "delivery" && order.address && (
        <p className="mt-2 text-xs text-dim">
          <IconBike className="mr-1 inline h-3.5 w-3.5 text-gold" />
          {order.address}
        </p>
      )}
      <p className="mt-1 flex items-center gap-1.5 text-xs text-dim">
        <IconPhone className="h-3.5 w-3.5 text-gold" />
        {order.customerName} · {order.phone}
      </p>

      <button
        onClick={onNext}
        className="press mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gold py-2.5 font-display tracking-wider text-coal uppercase shadow-[3px_3px_0_rgba(0,0,0,.5)] hover:bg-cream"
      >
        <IconCheck className="h-4 w-4" /> {action}
      </button>
    </article>
  );
}
