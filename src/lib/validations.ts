import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Ingresa un nombre válido."),
  email: z.string().email("Ingresa un correo válido."),
  phone: z.string().min(7, "Ingresa un teléfono válido."),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres."),
});

export const loginSchema = z.object({
  email: z.string().email("Ingresa un correo válido."),
  password: z.string().min(6, "Ingresa tu contraseña."),
});

export const productSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(12),
  size: z.string().min(1),
  gender: z.string().optional(),
  category: z.string().min(1),
  condition: z.enum(["NEW", "PRELOVED"]),
  price: z.coerce.number().int().positive(),
  stock: z.coerce.number().int().min(0),
  featured: z.coerce.boolean().optional().default(false),
  imageUrls: z.array(z.string().min(1)).min(1, "Agrega al menos una imagen."),
});

export const checkoutSchema = z.object({
  shippingName: z.string().min(3),
  shippingEmail: z.string().email(),
  shippingPhone: z.string().min(7),
  shippingAddress: z.string().min(8),
  shippingState: z.string().min(2),
  shippingCity: z.string().min(2),
  shippingNotes: z.string().optional(),
  paymentMethod: z.enum(["wompi_pse", "mercado_pago_pse"]),
  cartItems: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1),
      }),
    )
    .min(1),
});
