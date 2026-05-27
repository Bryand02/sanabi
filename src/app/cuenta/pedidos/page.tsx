import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Mi cuenta
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">Estado de mis pedidos</h1>
      </div>
      <div className="space-y-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[2rem] bg-white p-6 shadow-xl">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{order.orderNumber}</p>
                <p className="text-sm text-slate-500">{formatDate(order.createdAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded-full bg-[var(--color-cloud)] px-3 py-1 text-[var(--color-primary-ink)]">
                  {orderStatusLabels[order.status]}
                </span>
                <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-slate-700">
                  Pago: {paymentStatusLabels[order.paymentStatus]}
                </span>
              </div>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {order.items.map((item) => (
                <div key={item.id} className="rounded-[1.5rem] bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    {item.quantity} x {formatPrice(item.price)}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex justify-end text-lg font-bold text-[var(--color-primary-ink)]">
              {formatPrice(order.total)}
            </div>
          </article>
        ))}
      </div>
      {orders.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-slate-900">Aún no tienes pedidos.</p>
        </div>
      ) : null}
    </section>
  );
}
