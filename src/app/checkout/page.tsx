import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutForm } from "@/components/store/checkout-form";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Pago y envío
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-4xl font-semibold text-slate-900">Finaliza tu compra</h1>
          <Link href="/carrito" className="font-semibold text-[var(--color-primary-ink)]">
            Volver al carrito
          </Link>
        </div>
      </div>
      <CheckoutForm
        userId={session.user.id}
        email={session.user.email}
        name={session.user.name}
      />
    </section>
  );
}
