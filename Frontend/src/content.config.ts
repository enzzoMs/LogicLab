import {defineCollection} from "astro/content/config";
import {glob} from "astro/loaders";
import {z} from "astro/zod";

const lessons = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/contents/lessons" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    minutesDuration: z.number(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
    order: z.number()
  })
});

const quizzes = defineCollection({
  loader: glob({ pattern: "*.json", base: "./src/contents/quizzes" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    minutesDuration: z.number(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
    order: z.number(),
    questions: z.array(z.object({
      question: z.string(),
      options: z.array(z.string()),
      correctOption: z.number()
    })),
  })
})

export const collections = { lessons, quizzes };