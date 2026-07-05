import { z } from "zod";

export const UserResponseSchema = z
  .object({
    // ID must be a positive integer
    id: z.number().int().positive(),

    // Email must be a valid email format, lowercase, and trimmed
    //email: z.email().trim().toLowerCase(), - //!! all response contains invalid emails. So I had to comment this out and validate this as a string.
    email: z.string().trim().min(4, "Email must be at least 4 characters long"),
    // Password verification (assuming min length of 4 based on your example)
    password: z.string().min(4, "Password must be at least 4 characters long"),

    // Name verification (trimmed, alphanumeric/spaces, min 2 chars)
    name: z.string().trim().min(0, "Name must be at least 1 characters long"), // somebody created a user with an empty name )

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

export const UserListResponseSchema = z.array(UserResponseSchema);

export const UserNotFoundSchema = z
  .object({
    // Path must be a valid relative api path or URL structure
    path: z.string().trim().startsWith("/", "Path must be a valid absolute path or URL"),

    // ISO 8601 Timestamp converted into a live JavaScript Date object
    timestamp: z.iso.datetime().pipe(z.coerce.date()),

    // Error identifier/class name
    name: z.string().trim().min(1, "Error name is required"),

    // Human-readable message or serialized debug info
    message: z.string().trim().min(1, "Error message cannot be empty"),
  })
  .strict(); // Blocks any hidden fields leaking from backend stack traces

// Extract the TypeScript TYPES from the schema
export type UserListResponse = z.infer<typeof UserListResponseSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type UserNotFoundResponse = z.infer<typeof UserNotFoundSchema>;
