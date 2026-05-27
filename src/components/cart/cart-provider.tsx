"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  condition: string;
  imageUrl?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sanabi-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      window.setTimeout(() => {
        setHydrated(true);
      }, 0);
      return;
    }

    try {
      const parsed = JSON.parse(stored) as CartItem[];
      window.setTimeout(() => {
        setItems(parsed);
        setHydrated(true);
      }, 0);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      window.setTimeout(() => {
        setHydrated(true);
      }, 0);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      addItem(item) {
        setItems((current) => {
          const existing = current.find((entry) => entry.productId === item.productId);
          if (existing) {
            return current.map((entry) =>
              entry.productId === item.productId
                ? { ...entry, quantity: entry.quantity + item.quantity }
                : entry,
            );
          }

          return [...current, item];
        });
      },
      removeItem(productId) {
        setItems((current) => current.filter((item) => item.productId !== productId));
      },
      updateQuantity(productId, quantity) {
        setItems((current) =>
          current
            .map((item) =>
              item.productId === productId
                ? { ...item, quantity: Math.max(1, quantity) }
                : item,
            )
            .filter((item) => item.quantity > 0),
        );
      },
      clearCart() {
        setItems([]);
      },
      totalItems: items.reduce((accumulator, item) => accumulator + item.quantity, 0),
      totalPrice: items.reduce(
        (accumulator, item) => accumulator + item.price * item.quantity,
        0,
      ),
    }),
    [items],
  );

  return (
    <CartContext.Provider value={value}>
      {hydrated ? children : null}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }

  return context;
}
