import { z } from "zod";

export const Category = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Category name cannot be empty"),
  image: z.url("Invalid category image URL"),
  slug: z
    .string()
    .min(1, "Category slug cannot be empty")
    .regex(/^[a-z0-9-]+$/, "Invalid slug format"),
});
