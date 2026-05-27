import { ProductCondition } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { featured: true, stock: { gt: 0 } },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}

type ProductFilters = {
  size?: string;
  category?: string;
  gender?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};

export async function getProducts(filters: ProductFilters = {}) {
  return prisma.product.findMany({
    where: {
      stock: { gt: 0 },
      size: filters.size || undefined,
      category: filters.category || undefined,
      gender: filters.gender || undefined,
      condition: filters.condition
        ? (filters.condition as ProductCondition)
        : undefined,
      price: {
        gte: filters.minPrice,
        lte: filters.maxPrice,
      },
      OR: filters.search
        ? [
            { name: { contains: filters.search } },
            { description: { contains: filters.search } },
          ]
        : undefined,
    },
    include: { images: { orderBy: { position: "asc" } } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { images: { orderBy: { position: "asc" } } },
  });
}

export async function getAdminOverview() {
  const [products, orders, users] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
  ]);

  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { paymentStatus: "PAID" },
  });

  return {
    products,
    orders,
    users,
    revenue: revenue._sum.total ?? 0,
  };
}
