"use server";

import { PaymentStatus, ProductCondition, Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email/send-order-confirmation";
import { createPaymentSession } from "@/lib/payments";
import { prisma } from "@/lib/prisma";
import { cleanupUnusedUploadUrls, moveImagesToProductFolder } from "@/lib/uploads";
import { checkoutSchema, loginSchema, productSchema, registerSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function registerUserAction(formData: FormData) {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "No fue posible registrarte." };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });

  if (existingUser) {
    return { error: "Este correo ya está registrado." };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      passwordHash,
      role: Role.USER,
    },
  });

  await signIn("credentials", {
    email: parsed.data.email.toLowerCase(),
    password: parsed.data.password,
    redirectTo: "/catalogo",
  });
}

export async function loginUserAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa tus datos." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/catalogo",
    });
  } catch {
    return { error: "Correo o contraseña incorrectos." };
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/" });
}

function extractImageUrls(formData: FormData) {
  return formData
    .getAll("imageUrls")
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function productInputFromFormData(formData: FormData) {
  const featuredValue = formData.get("featured");

  return productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    size: formData.get("size"),
    gender: formData.get("gender") || undefined,
    category: formData.get("category"),
    condition: formData.get("condition"),
    price: Number(formData.get("price")),
    stock: Number(formData.get("stock")),
    featured: featuredValue === "on" || featuredValue === "true",
    imageUrls: extractImageUrls(formData),
  });
}

export async function createProductAction(formData: FormData) {
  const parsed = productInputFromFormData(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "No fue posible crear el producto." };
  }

  const baseSlug = slugify(parsed.data.name);
  let slug = baseSlug;
  let suffix = 1;

  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${suffix++}`;
  }

  const normalizedImageUrls = await moveImagesToProductFolder(
    parsed.data.imageUrls,
    slug,
  );

  await prisma.product.create({
    data: {
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      size: parsed.data.size,
      gender: parsed.data.gender,
      category: parsed.data.category,
      condition: parsed.data.condition as ProductCondition,
      price: parsed.data.price,
      stock: parsed.data.stock,
      featured: parsed.data.featured,
      images: {
        create: normalizedImageUrls.map((url, index) => ({
          url,
          alt: parsed.data.name,
          position: index,
        })),
      },
    },
  });

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  redirect("/admin/productos");
}

export async function updateProductAction(productId: string, formData: FormData) {
  const parsed = productInputFromFormData(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "No fue posible actualizar el producto." };
  }

  const currentProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true },
  });

  if (!currentProduct) {
    return { error: "El producto ya no existe." };
  }

  const nextImageUrls = parsed.data.imageUrls;
  const removedUrls = currentProduct.images
    .map((image) => image.url)
    .filter((url) => !nextImageUrls.includes(url));

  const nextSlug = slugify(parsed.data.name);
  const normalizedImageUrls = await moveImagesToProductFolder(
    parsed.data.imageUrls,
    nextSlug,
  );

  await prisma.product.update({
    where: { id: productId },
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      size: parsed.data.size,
      gender: parsed.data.gender,
      category: parsed.data.category,
      condition: parsed.data.condition as ProductCondition,
      price: parsed.data.price,
      stock: parsed.data.stock,
      featured: parsed.data.featured,
      slug: nextSlug,
      images: {
        deleteMany: {},
        create: normalizedImageUrls.map((url, index) => ({
          url,
          alt: parsed.data.name,
          position: index,
        })),
      },
    },
  });

  await cleanupUnusedUploadUrls(removedUrls);

  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
  redirect("/admin/productos");
}

export async function deleteProductAction(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  if (!productId) {
    return;
  }

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { images: true, orderItems: true },
  });

  if (!product) {
    return;
  }

  const imageUrls = product.images.map((image) => image.url);

  if (product.orderItems.length > 0) {
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: 0,
        featured: false,
        images: { deleteMany: {} },
      },
    });
  } else {
    await prisma.product.delete({ where: { id: productId } });
  }

  await cleanupUnusedUploadUrls(imageUrls);
  revalidatePath("/admin/productos");
  revalidatePath("/catalogo");
}

export async function updateOrderStatusAction(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!orderId || !status) {
    return;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status: status as "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELLED",
      paymentStatus:
        status === "PAID" || status === "DELIVERED" || status === "SHIPPED"
          ? PaymentStatus.PAID
          : undefined,
    },
  });

  revalidatePath("/admin/pedidos");
  revalidatePath("/cuenta/pedidos");
}

export async function createOrderAction(input: unknown, userId: string) {
  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Revisa la información del pedido." };
  }

  const productIds = parsed.data.cartItems.map((item) => item.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (products.length !== productIds.length) {
    return { error: "Uno o más productos ya no están disponibles." };
  }

  const items = parsed.data.cartItems.map((item) => {
    const product = products.find((current) => current.id === item.productId);
    if (!product) {
      throw new Error("Producto no encontrado.");
    }
    return {
      product,
      quantity: item.quantity,
    };
  });

  for (const item of items) {
    if (item.quantity > item.product.stock) {
      return { error: `No hay suficiente inventario para ${item.product.name}.` };
    }
  }

  const subtotal = items.reduce(
    (accumulator, item) => accumulator + item.product.price * item.quantity,
    0,
  );
  const shippingCost = subtotal >= 150000 ? 0 : 12000;
  const total = subtotal + shippingCost;
  const orderNumber = `SNA-${Date.now().toString().slice(-8)}`;

  const payment = await createPaymentSession({
    orderNumber,
    amount: total,
    customerEmail: parsed.data.shippingEmail,
    paymentMethod: parsed.data.paymentMethod,
  });

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId,
      subtotal,
      shippingCost,
      total,
      paymentMethod: parsed.data.paymentMethod,
      paymentProvider: payment.provider,
      paymentStatus: payment.status,
      status: payment.status === "PAID" ? "PAID" : "PENDING",
      shippingName: parsed.data.shippingName,
      shippingEmail: parsed.data.shippingEmail,
      shippingPhone: parsed.data.shippingPhone,
      shippingAddress: parsed.data.shippingAddress,
      shippingState: parsed.data.shippingState,
      shippingCity: parsed.data.shippingCity,
      shippingNotes: parsed.data.shippingNotes,
      items: {
        create: items.map(({ product, quantity }) => ({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          size: product.size,
          condition: product.condition,
          imageUrl: product.images[0]?.url,
        })),
      },
      payments: {
        create: {
          provider: payment.provider,
          reference: payment.reference,
          amount: total,
          status: payment.status,
          providerOrderId: payment.providerOrderId,
          metadata: payment.raw ? JSON.stringify(payment.raw) : undefined,
        },
      },
    },
    include: { items: true },
  });

  const updatedProducts = await Promise.all(
    items.map(async ({ product, quantity }) =>
      prisma.product.update({
        where: { id: product.id },
        data: { stock: { decrement: quantity } },
        include: { images: true },
      }),
    ),
  );

  await Promise.all(
    updatedProducts.map(async (product) => {
      if (product.stock > 0) {
        return;
      }

      const imageUrls = product.images.map((image) => image.url);

      await prisma.product.update({
        where: { id: product.id },
        data: {
          featured: false,
          images: { deleteMany: {} },
        },
      });

      await cleanupUnusedUploadUrls(imageUrls);
    }),
  );

  await sendOrderConfirmationEmail({
    to: order.shippingEmail,
    name: order.shippingName,
    orderNumber: order.orderNumber,
    total: order.total,
    items: order.items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  });

  revalidatePath("/catalogo");
  revalidatePath("/cuenta/pedidos");

  return { success: true, orderNumber: order.orderNumber };
}
