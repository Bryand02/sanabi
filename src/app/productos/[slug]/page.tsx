import Image from "next/image";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/store/add-to-cart-button";
import { conditionLabels } from "@/lib/constants";
import { getProductBySlug } from "@/lib/data/store";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr]">
        <div className="grid gap-4">
          <div className="overflow-hidden rounded-[2.5rem] bg-white p-4 shadow-xl">
            <Image
              src={product.images[0]?.url ?? "/illustrations/product-placeholder.svg"}
              alt={product.images[0]?.alt ?? product.name}
              width={900}
              height={900}
              className="h-auto w-full rounded-[2rem]"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-[1.5rem] bg-white p-2 shadow-lg"
              >
                <Image
                  src={image.url}
                  alt={image.alt ?? product.name}
                  width={320}
                  height={320}
                  className="h-28 w-full rounded-[1rem] object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-[var(--color-cloud)] px-3 py-1 text-[var(--color-primary-ink)]">
              {product.category}
            </span>
            <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-slate-700">
              {conditionLabels[product.condition]}
            </span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
              Talla {product.size}
            </span>
            {product.gender ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
                {product.gender}
              </span>
            ) : null}
          </div>
          <h1 className="mt-4 text-4xl font-semibold text-slate-900">{product.name}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-600">{product.description}</p>

          <div className="mt-8 rounded-[2rem] bg-[var(--color-cloud)] p-6">
            <p className="text-3xl font-bold text-[var(--color-primary-ink)]">
              {formatPrice(product.price)}
            </p>
            <p className="mt-2 text-sm text-slate-600">
              {product.stock > 0
                ? `${product.stock} unidades disponibles`
                : "Producto agotado"}
            </p>
            <div className="mt-5">
              <AddToCartButton
                item={{
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: product.price,
                  size: product.size,
                  condition: product.condition,
                  imageUrl: product.images[0]?.url,
                }}
                disabled={product.stock < 1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
