export type ExtraT = {
  id: number;
  name: string;
  priceCents: number;
};

export type MenuItemT = {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  priceCents: number;
  popular: boolean;
  available: boolean;
};

export type CategoryT = {
  id: number;
  slug: string;
  name: string;
  tagline: string;
  image: string;
  items: MenuItemT[];
};

export type CartLine = {
  key: string;
  itemId: number;
  name: string;
  unitPriceCents: number;
  qty: number;
  extras: ExtraT[];
};

export type OrderItemT = {
  id: number;
  itemName: string;
  unitPriceCents: number;
  qty: number;
  extrasText: string;
  totalCents: number;
};

export type OrderT = {
  id: number;
  orderNumber: string;
  customerName: string;
  phone: string;
  email: string;
  orderType: string;
  address: string;
  notes: string;
  subtotalCents: number;
  deliveryFeeCents: number;
  totalCents: number;
  paymentProvider: string;
  paymentStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemT[];
};

export type Provider = "yoco" | "ozow" | "payfast" | "cash";
