import { PrismaClient, ProductCondition, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const products = [
  {
    name: "Vestido Sol de Algodón",
    slug: "vestido-sol-de-algodon",
    description:
      "Vestido fresco con estampado floral, ideal para salidas familiares y celebraciones. Tela suave, respirable y delicada con la piel.",
    price: 62000,
    size: "4",
    gender: "Niña",
    category: "Vestidos",
    condition: ProductCondition.NEW,
    stock: 6,
    featured: true,
    images: [
      "/illustrations/product-dress-1.svg",
      "/illustrations/product-dress-2.svg",
    ],
  },
  {
    name: "Conjunto Aventuras del Bosque",
    slug: "conjunto-aventuras-del-bosque",
    description:
      "Set de camiseta y jogger en tonos salvia. Cómodo para jardín, parque y días activos.",
    price: 54000,
    size: "6",
    gender: "Unisex",
    category: "Conjuntos",
    condition: ProductCondition.NEW,
    stock: 8,
    featured: true,
    images: [
      "/illustrations/product-set-1.svg",
      "/illustrations/product-set-2.svg",
    ],
  },
  {
    name: "Chaqueta Nube Cariñosa",
    slug: "chaqueta-nube-carinosa",
    description:
      "Chaqueta acolchada para clima fresco, lavada y en excelente estado. Cierre completo y bolsillos frontales.",
    price: 48000,
    size: "8",
    gender: "Niño",
    category: "Chaquetas",
    condition: ProductCondition.PRELOVED,
    stock: 2,
    featured: false,
    images: ["/illustrations/product-jacket-1.svg"],
  },
  {
    name: "Pijama Luna Serena",
    slug: "pijama-luna-serena",
    description:
      "Pijama de dos piezas en algodón peinado. Muy suave y perfecta para noches tranquilas.",
    price: 39000,
    size: "2",
    gender: "Niña",
    category: "Pijamas",
    condition: ProductCondition.NEW,
    stock: 9,
    featured: true,
    images: ["/illustrations/product-pajama-1.svg"],
  },
  {
    name: "Overol Rayitas de Juego",
    slug: "overol-rayitas-de-juego",
    description:
      "Overol en denim liviano de segunda mano con muy poco uso. Ajuste cómodo y broches seguros.",
    price: 35000,
    size: "3",
    gender: "Unisex",
    category: "Overoles",
    condition: ProductCondition.PRELOVED,
    stock: 3,
    featured: false,
    images: ["/illustrations/product-overall-1.svg"],
  },
  {
    name: "Body Estrella Suave",
    slug: "body-estrella-suave",
    description:
      "Body para bebé con botones de presión y tejido hipoalergénico. Ideal para uso diario.",
    price: 28000,
    size: "12M",
    gender: "Unisex",
    category: "Bebé",
    condition: ProductCondition.NEW,
    stock: 12,
    featured: true,
    images: ["/illustrations/product-baby-1.svg"],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("AdminSanabi2026!", 10);

  await prisma.user.upsert({
    where: { email: "admin@sanabi.co" },
    update: {
      name: "Admin Sanabi",
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      name: "Admin Sanabi",
      email: "admin@sanabi.co",
      passwordHash,
      role: Role.ADMIN,
      phone: "3000000000",
    },
  });

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        description: product.description,
        price: product.price,
        size: product.size,
        gender: product.gender,
        category: product.category,
        condition: product.condition,
        stock: product.stock,
        featured: product.featured,
        images: {
          deleteMany: {},
          create: product.images.map((url, index) => ({
            url,
            alt: product.name,
            position: index,
          })),
        },
      },
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        size: product.size,
        gender: product.gender,
        category: product.category,
        condition: product.condition,
        stock: product.stock,
        featured: product.featured,
        images: {
          create: product.images.map((url, index) => ({
            url,
            alt: product.name,
            position: index,
          })),
        },
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
