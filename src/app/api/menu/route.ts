import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, extras, menuItems } from "@/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const [cats, items, extraRows] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
    db.select().from(menuItems).orderBy(asc(menuItems.sortOrder)),
    db.select().from(extras).orderBy(asc(extras.id)),
  ]);

  const shaped = cats.map((c) => ({
    ...c,
    items: items
      .filter((i) => i.categoryId === c.id && i.available)
      .map((i) => ({ ...i })),
  }));

  return NextResponse.json({ categories: shaped, extras: extraRows });
}
