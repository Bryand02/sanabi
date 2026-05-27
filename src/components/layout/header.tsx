import Link from "next/link";
import { HeartHandshake, LayoutDashboard, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { CartBadge } from "@/components/cart/cart-badge";

export async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent)] shadow-[0_12px_30px_rgba(255,193,139,0.35)]">
            <HeartHandshake className="h-6 w-6 text-[var(--color-primary-ink)]" />
          </div>
          <div>
            <p className="font-display text-2xl text-[var(--color-primary-ink)]">
              Sanabi
            </p>
            <p className="text-xs text-slate-500">Ropita tierna, segura y con historia</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/">Inicio</Link>
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/cuenta/pedidos">Mis pedidos</Link>
          {session?.user.role === "ADMIN" ? (
            <Link href="/admin" className="inline-flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          <CartBadge />
          {session?.user ? (
            <>
              <Link
                href="/cuenta/pedidos"
                className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 md:inline-flex"
              >
                {session.user.name?.split(" ")[0]}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-ink)] px-4 py-2 text-sm font-semibold text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              Ingresar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
