"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

type Props = {
  item: {
    productId: string;
    slug: string;
    name: string;
    price: number;
    size: string;
    condition: string;
    imageUrl?: string;
  };
  disabled?: boolean;
};

export function AddToCartButton({ item, disabled }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => {
        addItem({ ...item, quantity: 1 });
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1800);
      }}
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:bg-slate-300"
    >
      <ShoppingBag className="h-4 w-4" />
      {added ? "Agregado" : disabled ? "Agotado" : "Agregar al carrito"}
    </button>
  );
}
