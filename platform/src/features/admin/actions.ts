"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireAdmin, slugify } from "@/lib/admin";

const jobSchema = z.object({
  id: z.string().cuid().optional().or(z.literal("")),
  title: z.string().min(2, "Title is required"),
  companyId: z.string().cuid("Pick a company"),
  description: z.string().optional(),
  skills: z.string().optional(),
  workMode: z.enum(["ONSITE", "HYBRID", "REMOTE"]),
  region: z.enum(["TRICITY", "NCR", "METRO", "REMOTE", "OTHER"]),
  location: z.string().optional(),
  experience: z.enum(["FRESHER", "ZERO_ONE", "ONE_TWO", "TWO_PLUS"]),
  salaryMin: z.coerce.number().int().nonnegative().optional().or(z.literal("")),
  salaryMax: z.coerce.number().int().nonnegative().optional().or(z.literal("")),
  applyUrl: z.string().url().optional().or(z.literal("")),
});

export type FormResult = { ok: true } | { error: string };

export async function upsertJob(_prev: unknown, fd: FormData): Promise<FormResult> {
  await requireAdmin();
  const parsed = jobSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return { error: parsed.error.errors[0]?.message ?? "Invalid input" };
  const d = parsed.data;
  const skills = (d.skills ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  const data = {
    title: d.title,
    companyId: d.companyId,
    description: d.description || null,
    skills,
    workMode: d.workMode,
    region: d.region,
    location: d.location || null,
    experience: d.experience,
    salaryMin: d.salaryMin === "" ? null : (d.salaryMin ?? null),
    salaryMax: d.salaryMax === "" ? null : (d.salaryMax ?? null),
    applyUrl: d.applyUrl || null,
    isFresher: d.experience === "FRESHER" || d.experience === "ZERO_ONE",
  };
  if (d.id) await db.job.update({ where: { id: d.id }, data });
  else await db.job.create({ data: { ...data, slug: `${slugify(d.title)}-${Math.random().toString(36).slice(2, 7)}` } });
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  return { ok: true };
}

export async function deleteJob(id: string) {
  await requireAdmin();
  await db.job.delete({ where: { id } });
  revalidatePath("/admin/jobs");
}

export async function toggleJobActive(id: string) {
  await requireAdmin();
  const job = await db.job.findUnique({ where: { id }, select: { isActive: true } });
  await db.job.update({ where: { id }, data: { isActive: !job?.isActive } });
  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
}

export async function setUserRole(id: string, role: "USER" | "ADMIN") {
  await requireAdmin();
  await db.user.update({ where: { id }, data: { role } });
  revalidatePath("/admin/users");
}
