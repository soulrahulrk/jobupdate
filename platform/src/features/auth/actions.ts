"use server";

import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validations";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/ratelimit";

export type RegisterResult = { ok: true } | { error: string };

export async function registerUser(formData: FormData): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };

  const { name, email, password } = parsed.data;
  if (!(await checkRateLimit(`register:${email}`)).success) return { error: "Too many attempts. Try again shortly." };

  const exists = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (exists) return { error: "An account with this email already exists." };

  const passwordHash = await bcrypt.hash(password, 12);
  await db.user.create({ data: { name, email, passwordHash } });
  return { ok: true };
}
