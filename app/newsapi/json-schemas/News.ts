import { z } from "zod";

const SourceSchema = z.object({
  id: z.string().nullable(),
  name: z.string().min(1, "Назва джерела не може бути порожньою"),
});

const ArticleSchema = z.object({
  source: SourceSchema,
  author: z.url("Некоректний формат URL для автора").nullable().or(z.string()),
  title: z.string().min(1, "Заголовок обов'язковий"),
  description: z.string().nullable(),
  url: z.url("Некоректний формат посилання на статтю"),
  urlToImage: z.url("Некоректний формат посилання на зображення").nullable(),
  publishedAt: z.string().datetime({ message: "Некоректний формат ISO дати" }),
  content: z.string().nullable(),
});

export const NewsApiResponseSchema = z.object({
  status: z.literal("ok"),
  totalResults: z.number().int().nonnegative(),
  articles: z.array(ArticleSchema),
});

export type NewsApiResponse = z.infer<typeof NewsApiResponseSchema>;
