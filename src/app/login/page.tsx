import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect("/catalogo");
  }

  return (
    <section className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="self-center">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Bienvenida de vuelta
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-slate-900">
          Ingresa para comprar, pagar y hacer seguimiento a tus pedidos.
        </h1>
        <p className="mt-4 text-slate-600">
          Si aún no tienes cuenta, puedes crearla en pocos segundos.
        </p>
        <Link href="/registro" className="mt-6 inline-flex font-semibold text-[var(--color-primary-ink)]">
          Crear una cuenta
        </Link>
      </div>
      <LoginForm />
    </section>
  );
}
