import Image from "next/image";
import Link from "next/link";
import { ArrowRight, PackageCheck, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { ProductCard } from "@/components/store/product-card";
import { getFeaturedProducts } from "@/lib/data/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div>
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-20">
        <div className="self-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--color-primary-ink)] shadow-lg">
            <Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
            Sanabi Kids · moda infantil con identidad
          </div>
          <h1 className="mt-6 max-w-2xl font-display text-5xl leading-[1.05] text-[var(--color-primary-ink)] md:text-7xl">
            Estilo infantil para crecer, explorar y expresarse.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Sanabi Kids reúne moda infantil nueva y de segunda mano en excelente estado,
            con pagos online, envíos a todo Colombia y una experiencia pensada para que
            familias y cuidadores compren con confianza.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-4 font-semibold text-white shadow-[0_16px_35px_rgba(240,142,125,0.35)]"
            >
              Ver catálogo
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/registro"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-stroke)] bg-white px-6 py-4 font-semibold text-[var(--color-primary-ink)]"
            >
              Crear cuenta
            </Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <div className="card-soft rounded-[1.75rem] p-4">
              <ShieldCheck className="h-6 w-6 text-[var(--color-primary)]" />
              <p className="mt-3 font-semibold text-slate-900">Compra segura</p>
              <p className="mt-1 text-sm text-slate-600">Roles, autenticación y pago preparado para PSE.</p>
            </div>
            <div className="card-soft rounded-[1.75rem] p-4">
              <Truck className="h-6 w-6 text-[var(--color-primary)]" />
              <p className="mt-3 font-semibold text-slate-900">Envíos nacionales</p>
              <p className="mt-1 text-sm text-slate-600">Despachos a todo Colombia con seguimiento del pedido.</p>
            </div>
            <div className="card-soft rounded-[1.75rem] p-4">
              <PackageCheck className="h-6 w-6 text-[var(--color-primary)]" />
              <p className="mt-3 font-semibold text-slate-900">Selección cuidada</p>
              <p className="mt-1 text-sm text-slate-600">Cada producto se publica con talla, estado y stock real.</p>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-[3rem] bg-[rgba(255,214,165,0.55)] blur-3xl" />
          <div className="relative overflow-hidden rounded-[3rem] border border-white/80 bg-white p-5 shadow-[0_28px_70px_rgba(116,146,136,0.22)]">
            <Image
              src="/illustrations/hero-sanabi.svg"
              alt="Ilustración principal de Sanabi Kids"
              width={900}
              height={900}
              priority
              className="h-auto w-full rounded-[2.4rem]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Selección destacada
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Favoritos de la semana
            </h2>
          </div>
          <Link href="/catalogo" className="text-sm font-semibold text-[var(--color-primary-ink)]">
            Ver todos
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
