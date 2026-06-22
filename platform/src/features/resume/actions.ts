"use server";

import { z } from "zod";
import { put, del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/ratelimit";
import { reviewResume, matchJob, type ResumeReview, type JobMatch } from "@/lib/ai";

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user.id;
}

export async function uploadResume(formData: FormData): Promise<{ ok: true } | { error: string }> {
  const userId = await requireUserId();
  if (!(await checkRateLimit(`resume-upload:${userId}`)).success) return { error: "Too many uploads, try again shortly." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { error: "No file provided." };
  if (file.type !== "application/pdf") return { error: "Please upload a PDF." };
  if (file.size > 5 * 1024 * 1024) return { error: "Max file size is 5 MB." };

  const blob = await put(`resumes/${userId}/${Date.now()}-${file.name}`, file, { access: "public" });
  const count = await db.resume.count({ where: { userId } });
  await db.resume.create({
    data: { userId, fileUrl: blob.url, fileName: file.name, isPrimary: count === 0 },
  });
  revalidatePath("/dashboard/resumes");
  return { ok: true };
}

export async function deleteResume(id: string) {
  const userId = await requireUserId();
  const resume = await db.resume.findFirst({ where: { id: z.string().cuid().parse(id), userId } });
  if (!resume) throw new Error("NOT_FOUND");
  await del(resume.fileUrl).catch(() => {});
  await db.resume.delete({ where: { id: resume.id } });
  revalidatePath("/dashboard/resumes");
}

export async function setPrimaryResume(id: string) {
  const userId = await requireUserId();
  const rid = z.string().cuid().parse(id);
  await db.$transaction([
    db.resume.updateMany({ where: { userId }, data: { isPrimary: false } }),
    db.resume.update({ where: { id: rid }, data: { isPrimary: true } }),
  ]);
  revalidatePath("/dashboard/resumes");
}

export async function runResumeReview(id: string): Promise<ResumeReview> {
  const userId = await requireUserId();
  if (!(await checkRateLimit(`ai-review:${userId}`)).success) throw new Error("RATE_LIMITED");
  const resume = await db.resume.findFirst({ where: { id: z.string().cuid().parse(id), userId } });
  if (!resume) throw new Error("NOT_FOUND");

  const res = await fetch(resume.fileUrl);
  const pdfBase64 = Buffer.from(await res.arrayBuffer()).toString("base64");
  const review = await reviewResume({ pdfBase64 });

  await db.resume.update({ where: { id: resume.id }, data: { aiReview: review } });
  revalidatePath("/dashboard/resumes");
  return review;
}

export async function runJobMatch(jobId: string): Promise<JobMatch> {
  const userId = await requireUserId();
  if (!(await checkRateLimit(`ai-match:${userId}`)).success) throw new Error("RATE_LIMITED");

  const [user, resume, job] = await Promise.all([
    db.user.findUnique({ where: { id: userId }, select: { skills: true } }),
    db.resume.findFirst({ where: { userId, isPrimary: true }, select: { parsedText: true } }),
    db.job.findUnique({ where: { id: z.string().cuid().parse(jobId) }, include: { company: { select: { name: true } } } }),
  ]);
  if (!job) throw new Error("NOT_FOUND");

  return matchJob({
    resumeText: resume?.parsedText ?? "",
    userSkills: user?.skills ?? [],
    job: { title: job.title, skills: job.skills, description: job.description, company: job.company.name },
  });
}
