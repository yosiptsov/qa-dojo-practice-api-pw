import { z } from "zod";

export const UserResponseSchema = z
  .object({
    // ID must be a positive integer
    id: z.number().int().positive(),

    // Email must be a valid email format, lowercase, and trimmed
    email: z.email().trim().toLowerCase(),

    // Password verification (assuming min length of 4 based on your example)
    password: z.string().min(4, "Password must be at least 4 characters long"),

    // Name verification (trimmed, alphanumeric/spaces, min 2 chars)
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long")
      .regex(/^[a-zA-Z0-9\s-_]+$/, "Name contains invalid characters"),

    // Role restricted to specific literal values
    role: z.enum(["customer", "admin"]),

    // Avatar must be a valid URL format
    avatar: z.url("Avatar must be a valid URL"),

    // Deep verification for ISO 8601 Date strings (coerces string to a real JS Date object)
    creationAt: z.iso.datetime().pipe(z.coerce.date()),
    updatedAt: z.iso.datetime().pipe(z.coerce.date()),
  })
  // Ensures no extra/unexpected fields are injected into the response
  .strict();

// Extract the TypeScript type from the schema
export type UserResponse = z.infer<typeof UserResponseSchema>;
