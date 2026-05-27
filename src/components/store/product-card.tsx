import Image from "next/image";
import Link from "next/link";
import { conditionLabels } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { AddToCartButton } from "@/components/store/add-to-cart-button";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string;
    price: number;
    size: string;
    stock: number;
    condition: "NEW" | "PRELOVED";
    category: string;
    images: Array<{ url: string; alt: string | null }>;
  };
};

export function ProductCard({ product }: Props) {
  const image = product.images[0];

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-white/80 bg-white p-4 shadow-[0_24px_60px_rgba(157,181,170,0.18)] transition hover:-translate-y-1">
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-[var(--color-cloud)]">
          <Image
            src={image?.url ?? "/illustrations/product-placeholder.svg"}
            alt={image?.alt ?? product.name}
            width={480}
            height={480}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </div>
      </Link>

      <div className="mt-4 space-y-3">
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="rounded-full bg-[var(--color-cloud)] px-3 py-1 text-[var(--color-primary-ink)]">
            {product.category}
          </span>
          <span className="rounded-full bg-[var(--color-accent-soft)] px-3 py-1 text-slate-700">
            {conditionLabels[product.condition]}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
            Talla {product.size}
          </span>
        </div>

        <div>
          <Link
            href={`/productos/${product.slug}`}
            className="text-lg font-semibold text-slate-900"
          >
            {product.name}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-slate-600">{product.description}</p>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-[var(--color-primary-ink)]">
              {formatPrice(product.price)}
            </p>
            <p className="text-xs text-slate-500">
              {product.stock > 0 ? `${product.stock} disponibles` : "Sin inventario"}
            </p>
          </div>
          <AddToCartButton
            item={{
              productId: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              size: product.size,
              condition: product.condition,
              imageUrl: image?.url,
            }}
            disabled={product.stock < 1}
          />
        </div>
      </div>
    </article>
  );
}
