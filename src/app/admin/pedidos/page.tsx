import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { updateOrderStatusAction } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { orderStatusLabels, paymentStatusLabels } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const orders = await prisma.order.findMany({
    include: { items: true, user: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="Pedidos">
      <div className="space-y-5">
        {orders.map((order) => (
          <article key={order.id} className="rounded-[2rem] bg-white p-4 shadow-xl sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-900">{order.orderNumber}</p>
                <p className="text-sm text-slate-500">
                  {order.user.name} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                  {orderStatusLabels[order.status]}
                </span>
                <span className="rounded-full bg-[var(--color-cloud)] px-3 py-1 text-sm text-[var(--color-primary-ink)]">
                  {paymentStatusLabels[order.paymentStatus]}
                </span>
                <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-sm text-slate-700">
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Cliente
                </p>
                <p className="mt-2 font-semibold text-slate-900">{order.user.name}</p>
                <p className="text-sm text-slate-500">{order.shippingEmail}</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Envío
                </p>
                <p className="mt-2 font-semibold text-slate-900">{order.shippingCity}</p>
                <p className="text-sm text-slate-500">{order.shippingState}</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Método de pago
                </p>
                <p className="mt-2 font-semibold text-slate-900">{order.paymentProvider}</p>
                <p className="text-sm text-slate-500">{order.paymentMethod}</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Dirección
                </p>
                <p className="mt-2 font-semibold text-slate-900">{order.shippingAddress}</p>
                <p className="text-sm text-slate-500">{order.shippingPhone}</p>
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

            <form
              action={updateOrderStatusAction}
              className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <input type="hidden" name="orderId" value={order.id} />
              <select
                name="status"
                defaultValue={order.status}
                className="min-h-12 rounded-2xl border border-slate-200 px-4 py-3"
              >
                {Object.entries(orderStatusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="min-h-12 rounded-full bg-[var(--color-primary-ink)] px-5 py-3 font-semibold text-white"
              >
                Actualizar estado
              </button>
            </form>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
