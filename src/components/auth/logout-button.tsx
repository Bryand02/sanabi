"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/actions";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
      >
        <LogOut className="h-4 w-4" />
        Salir
      </button>
    </form>
  );
}
