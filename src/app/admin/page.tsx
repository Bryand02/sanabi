import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { auth } from "@/lib/auth";
import { getAdminOverview } from "@/lib/data/store";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const overview = await getAdminOverview();

  return (
    <AdminShell title="Resumen">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[2rem] bg-white p-6 shadow-xl">
          <p className="text-sm text-slate-500">Productos activos</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{overview.products}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-xl">
          <p className="text-sm text-slate-500">Pedidos</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{overview.orders}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-xl">
          <p className="text-sm text-slate-500">Clientes</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{overview.users}</p>
        </div>
        <div className="rounded-[2rem] bg-white p-6 shadow-xl">
          <p className="text-sm text-slate-500">Ventas pagadas</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{formatPrice(overview.revenue)}</p>
        </div>
      </div>
    </AdminShell>
  );
}
