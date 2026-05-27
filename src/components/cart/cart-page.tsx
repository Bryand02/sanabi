"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";
import { formatPrice } from "@/lib/utils";

export function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const shipping = totalPrice >= 150000 || totalPrice === 0 ? 0 : 12000;

  if (items.length === 0) {
    return (
      <div className="rounded-[2rem] bg-white p-10 text-center shadow-xl">
        <p className="text-lg font-semibold text-slate-900">Tu carrito está vacío.</p>
        <p className="mt-2 text-slate-600">
          Explora el catálogo y agrega prendas para tu siguiente compra.
        </p>
        <Link
          href="/catalogo"
          className="mt-6 inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex gap-4 rounded-[2rem] bg-white p-4 shadow-[0_18px_45px_rgba(157,181,170,0.14)]"
          >
            <div className="relative h-28 w-28 overflow-hidden rounded-[1.25rem] bg-[var(--color-cloud)]">
              <Image
                src={item.imageUrl ?? "/illustrations/product-placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between gap-3">
              <div>
                <Link href={`/productos/${item.slug}`} className="text-lg font-semibold text-slate-900">
                  {item.name}
                </Link>
                <p className="text-sm text-slate-500">
                  Talla {item.size} · {item.condition === "NEW" ? "Nuevo" : "Segunda mano"}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center rounded-full border border-slate-200">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="px-3 py-2"
                  >
                    -
                  </button>
                  <span className="px-3 text-sm font-semibold">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="px-3 py-2"
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[var(--color-primary-ink)]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="text-sm text-rose-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <aside className="rounded-[2rem] bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">Resumen</h2>
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Envío</span>
            <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
            <span>Total</span>
            <span>{formatPrice(totalPrice + shipping)}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
        >
          Continuar al pago
        </Link>
      </aside>
    </div>
  );
}
