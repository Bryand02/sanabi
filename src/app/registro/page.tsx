import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/catalogo");
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="self-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Crear cuenta
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">
          Regístrate para comprar, pagar en línea y ver el estado de tus pedidos.
        </h1>
        <p className="mt-4 text-slate-600">
          Sanabi fue pensada para dar confianza a las familias desde el primer clic.
        </p>
        <Link href="/login" className="mt-6 inline-flex font-semibold text-[var(--color-primary-ink)]">
          Ya tengo una cuenta
        </Link>
      </div>
      <RegisterForm />
    </section>
  );
}
