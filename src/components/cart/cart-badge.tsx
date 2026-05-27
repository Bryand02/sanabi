"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export function CartBadge() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/carrito"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-cloud)] text-[var(--color-primary-ink)]"
      aria-label="Ver carrito"
    >
      <ShoppingBag className="h-5 w-5" />
      <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[11px] font-bold text-white">
        {totalItems}
      </span>
    </Link>
  );
}
