import Link from "next/link";
import { Package2, ReceiptText, Store } from "lucide-react";

export function AdminShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
            Panel administrativo
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-slate-900">{title}</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            <Store className="h-4 w-4" />
            Resumen
          </Link>
          <Link
            href="/admin/productos"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            <Package2 className="h-4 w-4" />
            Productos
          </Link>
          <Link
            href="/admin/pedidos"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700"
          >
            <ReceiptText className="h-4 w-4" />
            Pedidos
          </Link>
        </div>
      </div>
      {children}
    </section>
  );
}
