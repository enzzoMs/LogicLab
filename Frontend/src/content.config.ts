import {defineCollection} from "astro/content/config";
import {glob} from "astro/loaders";
import {z} from "astro/zod";

const lessons = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/lessons" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    minutesDuration: z.number(),
    difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  })
});

export const collections = { lessons };