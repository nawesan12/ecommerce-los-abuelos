import { z } from "zod";

export const checkoutItemSchema = z.object({
  productId: z.string().trim().min(1, "productId es requerido"),
  variantId: z.string().trim().min(1).optional(),
  quantity: z
    .number()
    .int("quantity debe ser entero")
    .positive("quantity debe ser mayor a 0")
    .max(100, "quantity demasiado alta"),
});

export const checkoutCustomerSchema = z.object({
  email: z.string().trim().email("email inválido"),
  name: z.string().trim().min(1).max(120).optional(),
  phone: z.string().trim().min(5).max(30).optional(),
});

export const checkoutRequestSchema = z.object({
  tenantSlug: z.string().trim().min(1).optional(),
  customer: checkoutCustomerSchema,
  notes: z.string().trim().max(500).optional(),
  items: z.array(checkoutItemSchema).min(1, "Debe enviar al menos un item").max(100),
});

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
