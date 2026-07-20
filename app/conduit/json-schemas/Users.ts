import { z } from "zod";

// Schema for the nested user payload object
const UserPayloadSchema = z.object({
  // Validate that it is a proper email and not empty
  email: z.email("Invalid email format").min(1, "Email is a required field"),

  // Validate the password. Even if "1" is sent right now,
  // there are usually minimum length requirements
  password: z.string().min(1, "Password cannot be empty"),

  // Validate the unique username
  username: z.string().min(1, "Username is required").max(50, "Username is too long"),
});

// Main schema wrapping the user object inside the "user" key
export const CreateUserPayloadSchema = z.object({
  user: UserPayloadSchema,
});

// Regular expression for basic verification of the JWT format (header.payload.signature)
const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;

// Schema for the nested user response object
const UserResponseSchema = z.object({
  username: z.string().min(1, "Username cannot be empty"),
  email: z.email("Invalid email format"),
  // Deep validation of the token to ensure a valid JWT structure
  token: z.string().min(1, "Token is required").regex(jwtRegex, "String is not a valid JWT token"),
});

// Main schema for the API response
export const CreateUserResponseSchema = z.object({
  user: UserResponseSchema,
});

// Schema for the user profile response object
export const UserProfileResponseSchema = z.object({
  // Validate that it is a proper email format and not empty
  email: z.email("Invalid email format").min(1, "Email is a required field"),

  // Validate the username
  username: z.string().min(1, "Username cannot be empty"),

  // Bio can be a string or null if the user hasn't filled it out
  bio: z.string().nullable(),
});

// Automatic export of the TypeScript type based on the schema
export type UserProfileResponse = z.infer<typeof UserProfileResponseSchema>;

// Automatic export of the TypeScript type based on the created response schema
export type CreateUserResponse = z.infer<typeof CreateUserResponseSchema>;
// Export of the TypeScript type based on the created payload schema
export type CreateUserPayload = z.infer<typeof CreateUserPayloadSchema>;
