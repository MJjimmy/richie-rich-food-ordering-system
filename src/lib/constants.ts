import type { OrderT } from "./types";
import { rand } from "./format";

export const RESTAURANT = {
  name: "Richie Rich",
  tagline: "Kota & Shisa Kitchen",
  address: "167 Thabo Sehume Street, Pretoria CBD",
  hours: "Mon – Sun · 08:00 – 22:00",
  phoneDisplay: "+27 71 590 0037",
  whatsapp: "27715900037",
};

export const DELIVERY_FEE_CENTS = 2500;
export const FREE_DELIVERY_OVER_CENTS = 35000;

export function waLink(message: string): string {
  return `https://wa.me/${RESTAURANT.whatsapp}?text=${encodeURIComponent(message)}`;
}

export function receiptText(order: OrderT): string {
  const lines = order.items
    .map(
      (i) =>
        `• ${i.qty}x ${i.itemName}${i.extrasText ? ` (${i.extrasText})` : ""} — ${rand(i.totalCents)}`,
    )
    .join("\n");
  return [
    `Hi ${RESTAURANT.name}! My receipt:`,
    `Order ${order.orderNumber} · ${order.orderType === "delivery" ? "Delivery" : "Pickup"}`,
    lines,
    `Total: ${rand(order.totalCents)} · Paid via ${order.paymentProvider}`,
    `Name: ${order.customerName} · ${order.phone}`,
  ].join("\n");
}
