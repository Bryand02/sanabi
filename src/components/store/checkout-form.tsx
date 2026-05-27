"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { colombiaLocations, paymentOptions } from "@/lib/constants";
import { createOrderAction } from "@/lib/actions";
import { formatPrice } from "@/lib/utils";

export function CheckoutForm({ userId, email, name }: { userId: string; email?: string | null; name?: string | null }) {
  const router = useRouter();
  const { items, clearCart, totalPrice } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const shipping = totalPrice >= 150000 || totalPrice === 0 ? 0 : 12000;

  return (
    <form
      className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);

        startTransition(async () => {
          const result = await createOrderAction(
            {
              shippingName: formData.get("shippingName"),
              shippingEmail: formData.get("shippingEmail"),
              shippingPhone: formData.get("shippingPhone"),
              shippingAddress: formData.get("shippingAddress"),
              shippingState: formData.get("shippingState"),
              shippingCity: formData.get("shippingCity"),
              shippingNotes: formData.get("shippingNotes"),
              paymentMethod: formData.get("paymentMethod"),
              cartItems: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            },
            userId,
          );

          if (result?.error) {
            setError(result.error);
            return;
          }

          clearCart();
          setError(null);
          setOrderNumber(result?.orderNumber ?? null);
          router.refresh();
        });
      }}
    >
      <div className="space-y-6 rounded-[2rem] bg-white p-6 shadow-xl">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Checkout</h1>
          <p className="mt-2 text-slate-600">
            Completa tu compra y recibe confirmación por correo electrónico.
          </p>
        </div>

        {orderNumber ? (
          <div className="rounded-[1.5rem] bg-[var(--color-cloud)] p-4 text-sm text-[var(--color-primary-ink)]">
            Compra confirmada. Tu número de pedido es <strong>{orderNumber}</strong>.
          </div>
        ) : null}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Nombre de quien recibe</label>
            <input
              name="shippingName"
              required
              defaultValue={name ?? ""}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Correo</label>
            <input
              name="shippingEmail"
              type="email"
              required
              defaultValue={email ?? ""}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Teléfono</label>
            <input
              name="shippingPhone"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Dirección</label>
            <input
              name="shippingAddress"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Departamento</label>
            <select
              name="shippingState"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            >
              <option value="">Selecciona</option>
              {[...new Set(colombiaLocations.map((item) => item.state))].map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Ciudad</label>
            <select
              name="shippingCity"
              required
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            >
              <option value="">Selecciona</option>
              {colombiaLocations.map((location) => (
                <option key={`${location.state}-${location.city}`} value={location.city}>
                  {location.city}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-slate-700">Notas de entrega</label>
            <textarea
              name="shippingNotes"
              rows={4}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900">Pago en línea</h2>
          <div className="mt-4 grid gap-3">
            {paymentOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer gap-3 rounded-[1.5rem] border border-slate-200 p-4"
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={option.value}
                  required
                  defaultChecked={option.value === "wompi_pse"}
                />
                <div>
                  <p className="font-semibold text-slate-900">{option.label}</p>
                  <p className="text-sm text-slate-600">{option.description}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      </div>

      <aside className="rounded-[2rem] bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-slate-900">Resumen del pedido</h2>
        <div className="mt-4 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between gap-4 text-sm">
              <div>
                <p className="font-medium text-slate-900">{item.name}</p>
                <p className="text-slate-500">
                  {item.quantity} x {formatPrice(item.price)}
                </p>
              </div>
              <span className="font-semibold text-slate-900">
                {formatPrice(item.quantity * item.price)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>{shipping === 0 ? "Gratis" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-slate-900">
            <span>Total</span>
            <span>{formatPrice(totalPrice + shipping)}</span>
          </div>
        </div>
        <button
          type="submit"
          disabled={items.length === 0 || isPending}
          className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[var(--color-primary)] px-5 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isPending ? "Procesando..." : "Pagar ahora"}
        </button>
      </aside>
    </form>
  );
}
