import { CartPage } from "@/components/cart/cart-page";

export default function CartRoutePage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Tu carrito
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Revisa tu selección</h1>
      </div>
      <CartPage />
    </section>
  );
}
