import Link from "next/link";
import { HeartHandshake, LayoutDashboard, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { CartBadge } from "@/components/cart/cart-badge";
import { MobileMenu } from "@/components/layout/mobile-menu";

export async function Header() {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";
  const firstName = session?.user.name?.split(" ")[0] ?? "Mi cuenta";

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0 flex items-center gap-3">
          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(180deg,var(--color-accent),#ffc29c)] shadow-[0_12px_30px_rgba(255,193,139,0.4)]">
            <HeartHandshake className="h-6 w-6 text-[var(--color-primary-ink)]" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-2xl tracking-[0.01em] text-[var(--color-primary-ink)]">
              Sanabi Kids
            </p>
            <p className="line-clamp-2 text-xs font-medium text-slate-500">
              Moda infantil con identidad, color y confianza
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          <Link href="/">Inicio</Link>
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/cuenta/pedidos">Mis pedidos</Link>
          {isAdmin ? (
            <Link href="/admin" className="inline-flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <CartBadge />

          {session?.user ? (
            <>
              <Link
                href={isAdmin ? "/admin" : "/cuenta/pedidos"}
                className="hidden rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 md:inline-flex"
              >
                {isAdmin ? "Panel admin" : firstName}
              </Link>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            </>
          ) : (
            <Link
              href="/login"
              className="hidden items-center gap-2 rounded-full bg-[var(--color-primary-ink)] px-4 py-2 text-sm font-semibold text-white md:inline-flex"
            >
              <ShoppingBag className="h-4 w-4" />
              Ingresar
            </Link>
          )}

          <MobileMenu
            isLoggedIn={Boolean(session?.user)}
            isAdmin={Boolean(isAdmin)}
            userLabel={isAdmin ? "Administrador" : firstName}
          />
        </div>
      </div>
    </header>
  );
}
