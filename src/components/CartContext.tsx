"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartLine, ExtraT, MenuItemT } from "@/lib/types";

type Ctx = {
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  addLine: (item: MenuItemT, qty: number, extras: ExtraT[]) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  remove: (key: string) => void;
  clear: () => void;
  qtyForItem: (itemId: number) => number;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  modalItem: MenuItemT | null;
  openItem: (item: MenuItemT) => void;
  closeModal: () => void;
};

const CartCtx = createContext<Ctx | null>(null);

export function lineKey(itemId: number, extras: ExtraT[]) {
  return `${itemId}|${extras.map((e) => e.id).sort((a, b) => a - b).join(",")}`;
}

const LS_KEY = "rr-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalItem, setModalItem] = useState<MenuItemT | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as CartLine[];
        queueMicrotask(() => setLines(saved));
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines]);

  const addLine = useCallback((item: MenuItemT, qty: number, extras: ExtraT[]) => {
    const key = lineKey(item.id, extras);
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) {
        return prev.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      }
      return [
        ...prev,
        {
          key,
          itemId: item.id,
          name: item.name,
          unitPriceCents: item.priceCents + extras.reduce((s, e) => s + e.priceCents, 0),
          qty,
          extras,
        },
      ];
    });
  }, []);

  const inc = useCallback((key: string) => {
    setLines((prev) => prev.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)));
  }, []);

  const dec = useCallback((key: string) => {
    setLines((prev) =>
      prev
        .map((l) => (l.key === key ? { ...l, qty: l.qty - 1 } : l))
        .filter((l) => l.qty > 0),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((prev) => prev.filter((l) => l.key !== key));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);
  const subtotalCents = useMemo(
    () => lines.reduce((s, l) => s + l.qty * l.unitPriceCents, 0),
    [lines],
  );

  const qtyForItem = useCallback(
    (itemId: number) =>
      lines.filter((l) => l.itemId === itemId).reduce((s, l) => s + l.qty, 0),
    [lines],
  );

  const openItem = useCallback((item: MenuItemT) => setModalItem(item), []);
  const closeModal = useCallback(() => setModalItem(null), []);

  const value = useMemo(
    () => ({
      lines,
      count,
      subtotalCents,
      addLine,
      inc,
      dec,
      remove,
      clear,
      qtyForItem,
      drawerOpen,
      setDrawerOpen,
      modalItem,
      openItem,
      closeModal,
    }),
    [lines, count, subtotalCents, addLine, inc, dec, remove, clear, qtyForItem, drawerOpen, modalItem, openItem, closeModal],
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error("useCart outside provider");
  return ctx;
}
