import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProductAction } from "@/lib/actions";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function EditProductPage({ params }: { params: Params }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/");

  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!product) {
    redirect("/admin/productos");
  }

  const currentProduct = product;

  async function action(formData: FormData) {
    "use server";
    await updateProductAction(currentProduct.id, formData);
  }

  return (
    <AdminShell title={`Editar ${currentProduct.name}`}>
      <ProductForm
        action={action}
        submitLabel="Actualizar producto"
        values={{
          name: currentProduct.name,
          description: currentProduct.description,
          size: currentProduct.size,
          gender: currentProduct.gender,
          category: currentProduct.category,
          condition: currentProduct.condition,
          price: currentProduct.price,
          stock: currentProduct.stock,
          featured: currentProduct.featured,
          imageUrls: currentProduct.images.map((image) => image.url),
        }}
      />
    </AdminShell>
  );
}
