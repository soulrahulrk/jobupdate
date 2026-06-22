import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Enter your name"),
});

export const jobFilterSchema = z.object({
  q: z.string().trim().max(80).optional(),
  region: z.enum(["TRICITY", "NCR", "METRO", "REMOTE", "OTHER"]).optional(),
  workMode: z.enum(["ONSITE", "HYBRID", "REMOTE"]).optional(),
  experience: z.enum(["FRESHER", "ZERO_ONE", "ONE_TWO", "TWO_PLUS"]).optional(),
  fresher: z.coerce.boolean().optional(),
  salaryMin: z.coerce.number().int().nonnegative().optional(),
  sort: z.enum(["recent", "salary", "relevance"]).catch("recent"),
  page: z.coerce.number().int().min(1).catch(1),
});

export type JobFilter = z.infer<typeof jobFilterSchema>;
export const PAGE_SIZE = 12;
