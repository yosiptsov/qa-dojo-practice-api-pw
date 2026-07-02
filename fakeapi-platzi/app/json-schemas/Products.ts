import { z } from "zod";
import { Category } from "./Category";

export const Products = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3, "Title is too short").max(150, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug cannot be empty")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  price: z.number().positive("Price must be greater than 0"),
  description: z.string().min(5, "Description should be more descriptive"),
  images: z.array(z.httpUrl("Invalid product image URL")).min(1, "At least one image is required"),
  category: Category,
  creationAt: z.iso.datetime({ local: true }),
  updatedAt: z.iso.datetime({ local: true }),
});

// Типізація на основі схеми для використання в тестах чи контролерах
export type ProductResponse = z.infer<typeof Products>;
