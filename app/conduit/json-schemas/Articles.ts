import { z } from "zod";

// ==========================================
// 1. БАЗОВІ СХЕМИ (СПІЛЬНІ ЕЛЕМЕНТИ)
// ==========================================

export const AuthorSchema = z.object({
  username: z.string().optional(),
  bio: z.string().nullable().optional(),
  image: z.url().optional(),
});

// Додаткова схема автора, яка приходить у Response (там поля зазвичай обов'язкові)
export const AuthorResponseSchema = z.object({
  username: z.string().min(1, "Username cannot be empty"),
  image: z.url().nullable().optional(),
  following: z.boolean(),
});

// ==========================================
// 2. СХЕМА ДЛЯ PAYLOAD (ЗАПИТ / CREATE / UPDATE)
// ==========================================

const ArticlePayloadFieldsSchema = z.object({
  author: AuthorSchema,
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  body: z.string().min(1, "Body cannot be empty"),
  tagList: z.array(z.string()),
});

export const ArticlePayloadSchema = z.object({
  article: ArticlePayloadFieldsSchema,
});

// ==========================================
// 3. СХЕМА ДЛЯ RESPONSE (ВІДПОВІДЬ API)
// ==========================================

const ArticleResponseFieldsSchema = z.object({
  slug: z.string().min(1, "Slug cannot be empty"),
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  body: z.string().min(1, "Body cannot be empty"),

  // Виправлено: z.string().datetime() замість z.datetime()
  createdAt: z.iso.datetime({ local: true }),
  updatedAt: z.iso.datetime({ local: true }),

  tagList: z.array(z.string()),
  favorited: z.boolean(),
  favoritesCount: z.number().int().nonnegative(),
  author: AuthorResponseSchema,
});

export const ArticleResponseSchema = z.object({
  article: ArticleResponseFieldsSchema,
});

// ==========================================
// 4. TYPESCRIPT ТИПИ
// ==========================================

// Типи для Payload (Request)
export type ArticlePayload = z.infer<typeof ArticlePayloadSchema>;
export type ArticlePayloadFields = z.infer<typeof ArticlePayloadFieldsSchema>;

// Типи для Response (API Response)
export type ArticleResponse = z.infer<typeof ArticleResponseSchema>;
export type ArticleResponseFields = z.infer<typeof ArticleResponseFieldsSchema>;
