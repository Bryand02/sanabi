"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Package,
  ShoppingBag,
  User2,
  X,
} from "lucide-react";
import { useState } from "react";
import { logoutAction } from "@/lib/actions";

type Props = {
  isLoggedIn: boolean;
  isAdmin: boolean;
  userLabel: string;
};

export function MobileMenu({ isLoggedIn, isAdmin, userLabel }: Props) {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="relative md:hidden">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-[var(--color-primary-ink)]"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open ? (
        <div className="absolute right-0 top-[calc(100%+0.75rem)] w-[min(20rem,calc(100vw-2rem))] rounded-[1.75rem] border border-white/80 bg-white/98 p-4 shadow-[0_24px_60px_rgba(31,41,55,0.16)] backdrop-blur">
          <div className="mb-4 rounded-[1.25rem] bg-[var(--color-cloud)] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Cuenta
            </p>
            <p className="mt-1 text-base font-semibold text-[var(--color-primary-ink)]">
              {isLoggedIn ? userLabel : "Explora Sanabi Kids"}
            </p>
          </div>

          <div className="space-y-2">
            <Link
              href="/"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <ShoppingBag className="h-4 w-4" />
              Inicio
            </Link>

            <Link
              href="/catalogo"
              onClick={closeMenu}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Package className="h-4 w-4" />
              Catálogo
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/cuenta/pedidos"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <User2 className="h-4 w-4" />
                  Cuenta y pedidos
                </Link>

                {isAdmin ? (
                  <Link
                    href="/admin"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Panel administrador
                  </Link>
                ) : null}

                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <Link
                href="/login"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-2xl bg-[var(--color-primary-ink)] px-4 py-3 text-sm font-semibold text-white"
              >
                <LogIn className="h-4 w-4" />
                Ingresar
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
