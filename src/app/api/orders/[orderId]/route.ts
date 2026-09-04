import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";

export const dynamic = "force-dynamic";

async function findOrder(param: string) {
  const row = param.toUpperCase().startsWith("RR-")
    ? await db.select().from(orders).where(eq(orders.orderNumber, param.toUpperCase())).then((r) => r[0])
    : await db
        .select()
        .from(orders)
        .where(eq(orders.id, Number.parseInt(param, 10)))
        .then((r) => r[0]);
  if (!row) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, row.id));
  return { ...row, items };
}

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await ctx.params;
  const order = await findOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  return NextResponse.json({ order });
}

const STATUSES = ["new", "preparing", "ready", "out_for_delivery", "completed", "cancelled"];
const PAY_STATUSES = ["awaiting", "paid", "failed", "pay_at_counter", "refunded"];

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await ctx.params;
  const existing = await findOrder(orderId);
  if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  let body: { status?: string; paymentStatus?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const patch: { status?: string; paymentStatus?: string; updatedAt: Date } = {
    updatedAt: new Date(),
  };
  if (body.status && STATUSES.includes(body.status)) patch.status = body.status;
  if (body.paymentStatus && PAY_STATUSES.includes(body.paymentStatus))
    patch.paymentStatus = body.paymentStatus;

  const [updated] = await db
    .update(orders)
    .set(patch)
    .where(eq(orders.id, existing.id))
    .returning();

  return NextResponse.json({ order: { ...updated, items: existing.items } });
}
