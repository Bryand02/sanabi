"use client";

import { useActionState } from "react";
import { loginUserAction } from "@/lib/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(
    async (_state: { error?: string } | undefined, formData: FormData) =>
      loginUserAction(formData),
    undefined,
  );

  return (
    <form action={action} className="space-y-4 rounded-[2rem] bg-white p-8 shadow-xl">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Correo</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Contraseña</label>
        <input
          type="password"
          name="password"
          required
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none"
        />
      </div>
      {state?.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-[var(--color-primary-ink)] px-5 py-3 font-semibold text-white"
      >
        {pending ? "Ingresando..." : "Iniciar sesión"}
      </button>
    </form>
  );
}
