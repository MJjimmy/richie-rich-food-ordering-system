import { NextRequest, NextResponse } from "next/server";
import { asc, eq, gte, inArray } from "drizzle-orm";
import { db } from "@/db";
import { menuItems, extras, orderItems, orders } from "@/db/schema";
import { DELIVERY_FEE_CENTS, FREE_DELIVERY_OVER_CENTS } from "@/lib/constants";

export const dynamic = "force-dynamic";

type LineIn = { itemId: number; qty: number; extraIds: number[] };

export async function GET(req: NextRequest) {
  const view = req.nextUrl.searchParams.get("view");
  if (view === "kitchen") {
    const [open, todayRows] = await Promise.all([
      db
        .select()
        .from(orders)
        .where(inArray(orders.status, ["new", "preparing", "ready", "out_for_delivery"]))
        .orderBy(asc(orders.createdAt)),
      db
        .select()
        .from(orders)
        .where(gte(orders.createdAt, startOfToday()))
        .orderBy(asc(orders.createdAt)),
    ]);
    const withItems = await attachItems(open);
    const completed = todayRows.filter((order) => order.status === "completed");
    const revenueToday = todayRows.reduce((sum, order) => sum + order.totalCents, 0);
    const averageFulfillmentMinutes =
      completed.length === 0
        ? null
        : Math.round(
            completed.reduce(
              (sum, order) =>
                sum + Math.max(0, order.updatedAt.getTime() - order.createdAt.getTime()),
              0,
            ) /
              completed.length /
              60000,
          );
    const activity = todayRows
      .slice()
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 20)
      .map((order) => ({
        orderNumber: order.orderNumber,
        phone: order.phone,
        status: order.status,
        updatedAt: order.updatedAt,
      }));

    return NextResponse.json({
      orders: withItems,
      completedToday: completed.length,
      ordersToday: todayRows.length,
      revenueToday,
      averageFulfillmentMinutes,
      activity,
    });
  }
  const all = await db.select().from(orders).orderBy(asc(orders.createdAt)).limit(50);
  return NextResponse.json({ orders: await attachItems(all) });
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function attachItems(rows: typeof orders.$inferSelect[]) {
  if (rows.length === 0) return [];
  const items = await db
    .select()
    .from(orderItems)
    .where(inArray(orderItems.orderId, rows.map((r) => r.id)));
  return rows.map((r) => ({
    ...r,
    items: items.filter((i) => i.orderId === r.id),
  }));
}

export async function POST(req: NextRequest) {
  let body: {
    customerName?: string;
    phone?: string;
    email?: string;
    orderType?: string;
    address?: string;
    notes?: string;
    provider?: string;
    lines?: LineIn[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const customerName = (body.customerName ?? "").trim();
  const phone = (body.phone ?? "").trim();
  const lines = body.lines ?? [];

  if (!customerName || phone.length < 9 || lines.length === 0) {
    return NextResponse.json(
      { error: "Name, valid phone number and at least one item are required." },
      { status: 400 },
    );
  }

  const [itemRows, extraRows] = await Promise.all([
    db.select().from(menuItems),
    db.select().from(extras),
  ]);
  const itemMap = new Map(itemRows.map((i) => [i.id, i]));
  const extraMap = new Map(extraRows.map((e) => [e.id, e]));

  let subtotal = 0;
  const resolved: {
    menuItemId: number;
    itemName: string;
    unitPriceCents: number;
    qty: number;
    extrasText: string;
    totalCents: number;
  }[] = [];

  for (const line of lines) {
    const item = itemMap.get(line.itemId);
    const qty = Math.min(50, Math.max(1, Math.floor(line.qty || 1)));
    if (!item || !item.available) {
      return NextResponse.json({ error: "An item in your basket is no longer on the board." }, { status: 400 });
    }
    const chosen = (line.extraIds ?? [])
      .map((id) => extraMap.get(id))
      .filter((e): e is NonNullable<typeof e> => Boolean(e));
    const extrasCents = chosen.reduce((s, e) => s + e.priceCents, 0);
    const unit = item.priceCents + extrasCents;
    subtotal += unit * qty;
    resolved.push({
      menuItemId: item.id,
      itemName: item.name,
      unitPriceCents: unit,
      qty,
      extrasText: chosen.map((c) => c.name).join(", "),
      totalCents: unit * qty,
    });
  }

  const orderType = body.orderType === "delivery" ? "delivery" : "pickup";
  const deliveryFee =
    orderType === "delivery" && subtotal < FREE_DELIVERY_OVER_CENTS ? DELIVERY_FEE_CENTS : 0;
  const provider = ["yoco", "ozow", "payfast", "cash"].includes(body.provider ?? "")
    ? (body.provider as string)
    : "cash";

  const [order] = await db
    .insert(orders)
    .values({
      orderNumber: "RR-0000",
      customerName,
      phone,
      email: (body.email ?? "").trim(),
      orderType,
      address: orderType === "delivery" ? (body.address ?? "").trim() : "",
      notes: (body.notes ?? "").trim(),
      subtotalCents: subtotal,
      deliveryFeeCents: deliveryFee,
      totalCents: subtotal + deliveryFee,
      paymentProvider: provider,
      paymentStatus: provider === "cash" ? "pay_at_counter" : "awaiting",
      status: provider === "cash" ? "new" : "new",
    })
    .returning();

  const orderNumber = `RR-${1000 + order.id}`;
  const [numbered] = await db
    .update(orders)
    .set({ orderNumber })
    .where(eq(orders.id, order.id))
    .returning();

  await db.insert(orderItems).values(
    resolved.map((r) => ({ ...r, orderId: order.id })),
  );

  return NextResponse.json({ order: { ...numbered, items: resolved.map((r, i) => ({ ...r, id: i })) } }, { status: 201 });
}
