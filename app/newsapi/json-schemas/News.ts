import { z } from "zod";

// Схема для вкладеного об'єкта джерела (source)
const SourceSchema = z.object({
  // id може бути рядком або null, якщо джерело не є офіційно зареєстрованим у системі
  id: z.string().nullable(),
  name: z.string().min(1, "Назва джерела не може бути порожньою"),
});

// Схема для однієї статті (article) з глибокою валідацією полів
const ArticleSchema = z.object({
  source: SourceSchema,
  // Автори іноді відсутні в API відповідях
  author: z.string().url("Некоректний формат URL для автора").nullable().or(z.string()),
  title: z.string().min(1, "Заголовок обов'язковий"),
  description: z.string().nullable(),
  url: z.string().url("Некоректний формат посилання на статтю"),
  urlToImage: z.string().url("Некоректний формат посилання на зображення").nullable(),
  // Валідуємо, що рядок відповідає правильному формату ISO дати та часу
  publishedAt: z.string().datetime({ message: "Некоректний формат ISO дати" }),
  content: z.string().nullable(),
});

// Головна схема для всієї відповіді API
export const NewsApiResponseSchema = z.object({
  // Обмежуємо статус конкретним літералом, оскільки ми очікуємо лише успіх
  status: z.literal("ok"),
  // Перевіряємо, що кількість результатів є невід'ємним числом
  totalResults: z.number().int().nonnegative(),
  // Масив статей, що підлягає глибокій перевірці
  articles: z.array(ArticleSchema),
});

// Експорт типу TypeScript на основі створеної Zod схеми
export type NewsApiResponse = z.infer<typeof NewsApiResponseSchema>;
