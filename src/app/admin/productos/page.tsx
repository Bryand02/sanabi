import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { deleteProductAction } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { conditionLabels } from "@/lib/constants";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";

export default async function AdminProductsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminShell title="Productos">
      <div className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-[2rem] bg-white p-5 shadow-xl">
          <div>
            <p className="text-lg font-semibold text-slate-900">Inventario de ropa</p>
            <p className="text-sm text-slate-500">
              Desde aquí puedes agregar, modificar o eliminar prendas con todas sus fotos y datos.
            </p>
          </div>
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex rounded-full bg-[var(--color-primary)] px-5 py-3 font-semibold text-white"
          >
            Agregar ropa
          </Link>
        </div>
      </div>

      <div className="space-y-4 md:hidden">
        {products.map((product) => (
          <article key={product.id} className="rounded-[2rem] bg-white p-4 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-slate-900">{product.name}</p>
                <p className="text-sm text-slate-500">{product.category}</p>
              </div>
              <span
                className={
                  product.stock > 0
                    ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                    : "rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700"
                }
              >
                {product.stock > 0 ? `${product.stock} u.` : "Agotado"}
              </span>
            </div>

            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {product.images.length > 0 ? (
                product.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100"
                  >
                    <Image
                      src={image.url}
                      alt={image.alt ?? product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <div className="rounded-2xl bg-slate-50 px-4 py-6 text-sm text-slate-400">
                  Sin fotos
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-slate-500">Estado</p>
                <p className="mt-1 font-semibold text-slate-900">
                  {conditionLabels[product.condition]}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-slate-500">Talla</p>
                <p className="mt-1 font-semibold text-slate-900">Talla {product.size}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-slate-500">Precio</p>
                <p className="mt-1 font-semibold text-slate-900">{formatPrice(product.price)}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <p className="text-slate-500">Stock</p>
                <p className="mt-1 font-semibold text-slate-900">{product.stock}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Link
                href={`/admin/productos/${product.id}`}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700"
              >
                Editar
              </Link>
              <form action={deleteProductAction}>
                <input type="hidden" name="productId" value={product.id} />
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-full border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600"
                >
                  Eliminar
                </button>
              </form>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-[2rem] bg-white shadow-xl md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-4">Producto</th>
              <th className="px-5 py-4">Fotos</th>
              <th className="px-5 py-4">Estado</th>
              <th className="px-5 py-4">Talla</th>
              <th className="px-5 py-4">Precio</th>
              <th className="px-5 py-4">Stock</th>
              <th className="px-5 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="px-5 py-4">
                  <p className="font-semibold text-slate-900">{product.name}</p>
                  <p className="text-slate-500">{product.category}</p>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    {product.images.length > 0 ? (
                      product.images.slice(0, 3).map((image) => (
                        <div
                          key={image.id}
                          className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-100"
                        >
                          <Image
                            src={image.url}
                            alt={image.alt ?? product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-400">Sin fotos</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4">{conditionLabels[product.condition]}</td>
                <td className="px-5 py-4">Talla {product.size}</td>
                <td className="px-5 py-4">{formatPrice(product.price)}</td>
                <td className="px-5 py-4">
                  <span
                    className={
                      product.stock > 0
                        ? "rounded-full bg-emerald-50 px-3 py-1 text-emerald-700"
                        : "rounded-full bg-amber-50 px-3 py-1 text-amber-700"
                    }
                  >
                    {product.stock > 0 ? product.stock : "Agotado"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/productos/${product.id}`}
                      className="rounded-full border border-slate-200 px-4 py-2"
                    >
                      Editar
                    </Link>
                    <form action={deleteProductAction}>
                      <input type="hidden" name="productId" value={product.id} />
                      <button
                        type="submit"
                        className="rounded-full border border-rose-200 px-4 py-2 text-rose-600"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
