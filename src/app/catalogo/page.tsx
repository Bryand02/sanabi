import { CatalogFilters } from "@/components/store/filters";
import { ProductCard } from "@/components/store/product-card";
import { getProducts } from "@/lib/data/store";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const filters = {
    search: typeof params.search === "string" ? params.search : undefined,
    category: typeof params.category === "string" ? params.category : undefined,
    size: typeof params.size === "string" ? params.size : undefined,
    condition: typeof params.condition === "string" ? params.condition : undefined,
    gender: typeof params.gender === "string" ? params.gender : undefined,
  };
  const products = await getProducts(filters);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Catálogo Sanabi
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">
          Ropa infantil nueva y de segunda mano
        </h1>
      </div>
      <CatalogFilters selected={filters} />
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 ? (
        <div className="mt-10 rounded-[2rem] bg-white p-8 text-center shadow-xl">
          <p className="text-lg font-semibold text-slate-900">
            No encontramos prendas con esos filtros.
          </p>
        </div>
      ) : null}
    </section>
  );
}
