import { title } from "process";
import { z } from "zod";

export const todoSchema = z.object({
  title: z.string().min(3).max(100),
  isCompleted: z.boolean(),
});
