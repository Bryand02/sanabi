import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag } from "lucide-react";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/logout-button";
import { AdminNotificationCenter } from "@/components/admin/admin-notification-center";
import { CartBadge } from "@/components/cart/cart-badge";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { getAdminNotificationCenter } from "@/lib/data/store";
import { getPublicVapidKey, pushNotificationsConfigured } from "@/lib/notifications";

type NotificationCenterItem = {
  id: string;
  title: string;
  body: string;
  href: string | null;
  readAt: Date | null;
  createdAt: Date;
};

export async function Header() {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";
  const firstName = session?.user.name?.split(" ")[0] ?? "Mi cuenta";
  const notificationCenter =
    isAdmin && session?.user.id
      ? await getAdminNotificationCenter(session.user.id)
      : null;

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0 flex items-center gap-3">
          <div className="relative h-16 w-36 shrink-0 overflow-hidden rounded-[1.4rem] border border-white/80 bg-white shadow-[0_12px_30px_rgba(255,193,139,0.22)] sm:h-18 sm:w-40">
            <Image
              src="/brand/sanabi-kids-logo.jpeg"
              alt="Logo de Sanabi Kids"
              fill
              sizes="(max-width: 640px) 144px, 160px"
              className="object-cover"
              priority
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-xl tracking-[0.01em] text-[var(--color-primary-ink)] sm:text-2xl">
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
          {isAdmin && notificationCenter ? (
            <AdminNotificationCenter
              initialNotifications={notificationCenter.notifications.map((notification: NotificationCenterItem) => ({
                id: notification.id,
                title: notification.title,
                body: notification.body,
                href: notification.href,
                readAt: notification.readAt?.toISOString() ?? null,
                createdAt: notification.createdAt.toISOString(),
              }))}
              initialUnreadCount={notificationCenter.unreadCount}
              vapidPublicKey={getPublicVapidKey()}
              pushConfigured={pushNotificationsConfigured()}
            />
          ) : null}

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
