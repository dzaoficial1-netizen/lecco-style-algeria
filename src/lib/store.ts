import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "./products";

const safeStorage = createJSONStorage(() =>
  typeof window !== "undefined"
    ? window.localStorage
    : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as any),
);

export interface CartLine {
  id: string;            // product.id + size + color
  product: Product;
  size: string;
  color: string;
  qty: number;
}

interface CartState {
  lines: CartLine[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, size: string, color: string, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  total: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      open: false,
      setOpen: (v) => set({ open: v }),
      add: (p, size, color, qty = 1) => {
        const id = `${p.id}__${size}__${color}`;
        const existing = get().lines.find((l) => l.id === id);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.id === id ? { ...l, qty: l.qty + qty } : l,
            ),
            open: true,
          });
        } else {
          set({
            lines: [...get().lines, { id, product: p, size, color, qty }],
            open: true,
          });
        }
      },
      remove: (id) => set({ lines: get().lines.filter((l) => l.id !== id) }),
      setQty: (id, qty) =>
        set({
          lines: get().lines.map((l) =>
            l.id === id ? { ...l, qty: Math.max(1, qty) } : l,
          ),
        }),
      clear: () => set({ lines: [] }),
      total: () => get().lines.reduce((s, l) => s + l.product.price * l.qty, 0),
      count: () => get().lines.reduce((s, l) => s + l.qty, 0),
    }),
    {
      name: "lecco-cart",
      storage: safeStorage,
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

interface WishState {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set({
          ids: get().ids.includes(id)
            ? get().ids.filter((x) => x !== id)
            : [...get().ids, id],
        }),
      has: (id) => get().ids.includes(id),
    }),
    { name: "lecco-wish", storage: safeStorage },
  ),
);

/** Avoid SSR/CSR mismatch when reading persisted state. */
import { useEffect, useState } from "react";
export function useHydrated() {
  const [h, setH] = useState(false);
  useEffect(() => setH(true), []);
  return h;
}