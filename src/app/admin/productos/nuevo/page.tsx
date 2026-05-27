import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { createProductAction } from "@/lib/actions";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  async function action(formData: FormData) {
    "use server";
    await createProductAction(formData);
  }

  return (
    <AdminShell title="Crear producto">
      <ProductForm action={action} submitLabel="Guardar producto" />
    </AdminShell>
  );
}
