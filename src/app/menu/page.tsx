import { asc } from "drizzle-orm";
import { db } from "@/db";
import { categories, menuItems } from "@/db/schema";
import { MenuClient } from "@/components/MenuClient";
import type { CategoryT } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = { title: "Menu" };

export default async function MenuPage() {
  const [cats, items] = await Promise.all([
    db.select().from(categories).orderBy(asc(categories.sortOrder)),
    db.select().from(menuItems).orderBy(asc(menuItems.sortOrder)),
  ]);

  const shaped: CategoryT[] = cats.map((c) => ({
    ...c,
    items: items.filter((i) => i.categoryId === c.id && i.available),
  }));

  return <MenuClient categories={shaped} />;
}
