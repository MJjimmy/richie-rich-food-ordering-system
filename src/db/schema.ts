import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  tagline: text("tagline").notNull().default(""),
  image: text("image").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  priceCents: integer("price_cents").notNull(),
  popular: boolean("popular").notNull().default(false),
  available: boolean("available").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const extras = pgTable("extras", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  priceCents: integer("price_cents").notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  customerName: text("customer_name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  orderType: text("order_type").notNull().default("pickup"), // delivery | pickup
  address: text("address").notNull().default(""),
  notes: text("notes").notNull().default(""),
  subtotalCents: integer("subtotal_cents").notNull().default(0),
  deliveryFeeCents: integer("delivery_fee_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  paymentProvider: text("payment_provider").notNull().default("cash"), // yoco | ozow | payfast | cash
  paymentStatus: text("payment_status").notNull().default("awaiting"), // awaiting | paid | failed | pay_at_counter
  status: text("status").notNull().default("new"), // new | preparing | ready | out_for_delivery | completed | cancelled
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: integer("menu_item_id"),
  itemName: text("item_name").notNull(),
  unitPriceCents: integer("unit_price_cents").notNull().default(0),
  qty: integer("qty").notNull().default(1),
  extrasText: text("extras_text").notNull().default(""),
  totalCents: integer("total_cents").notNull().default(0),
});
