"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/ratelimit";

const id = z.string().cuid();

async function requireUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("UNAUTHENTICATED");
  return session.user.id;
}

async function guard(userId: string, action: string) {
  if (!(await checkRateLimit(`${action}:${userId}`)).success) throw new Error("RATE_LIMITED");
}

export async function toggleSavedJob(jobId: string): Promise<{ saved: boolean }> {
  const userId = await requireUserId();
  await guard(userId, "save");
  const job = id.parse(jobId);
  const existing = await db.savedJob.findUnique({ where: { userId_jobId: { userId, jobId: job } } });
  if (existing) await db.savedJob.delete({ where: { id: existing.id } });
  else await db.savedJob.create({ data: { userId, jobId: job } });
  revalidatePath("/dashboard/saved");
  revalidatePath(`/jobs`);
  return { saved: !existing };
}

export async function toggleBookmark(companyId: string): Promise<{ bookmarked: boolean }> {
  const userId = await requireUserId();
  await guard(userId, "bookmark");
  const company = id.parse(companyId);
  const existing = await db.bookmark.findUnique({ where: { userId_companyId: { userId, companyId: company } } });
  if (existing) await db.bookmark.delete({ where: { id: existing.id } });
  else await db.bookmark.create({ data: { userId, companyId: company } });
  revalidatePath("/dashboard/bookmarks");
  return { bookmarked: !existing };
}

export async function setApplied(jobId: string): Promise<{ applied: boolean }> {
  const userId = await requireUserId();
  await guard(userId, "apply");
  const job = id.parse(jobId);
  await db.application.upsert({
    where: { userId_jobId: { userId, jobId: job } },
    update: {},
    create: { userId, jobId: job, status: "APPLIED" },
  });
  revalidatePath("/dashboard/applied");
  return { applied: true };
}

export async function removeApplication(jobId: string): Promise<{ applied: boolean }> {
  const userId = await requireUserId();
  const job = id.parse(jobId);
  await db.application.deleteMany({ where: { userId, jobId: job } });
  revalidatePath("/dashboard/applied");
  return { applied: false };
}

// Cancel / hide a job (wrong or not relevant) — it leaves the main board.
export async function toggleDismissed(jobId: string): Promise<{ dismissed: boolean }> {
  const userId = await requireUserId();
  await guard(userId, "dismiss");
  const job = id.parse(jobId);
  const existing = await db.dismissedJob.findUnique({ where: { userId_jobId: { userId, jobId: job } } });
  if (existing) await db.dismissedJob.delete({ where: { id: existing.id } });
  else await db.dismissedJob.create({ data: { userId, jobId: job } });
  revalidatePath("/jobs");
  revalidatePath("/dashboard/dismissed");
  return { dismissed: !existing };
}

const commentSchema = z.object({ companyId: z.string().cuid(), body: z.string().trim().min(1).max(2000) });

// User comment about a company — stored so AI can learn from real candidate feedback.
export async function addCompanyComment(companyId: string, body: string): Promise<void> {
  const userId = await requireUserId();
  await guard(userId, "comment");
  const data = commentSchema.parse({ companyId, body });
  await db.companyComment.create({ data: { userId, companyId: data.companyId, body: data.body } });
}

export async function deleteCompanyComment(commentId: string): Promise<void> {
  const userId = await requireUserId();
  await db.companyComment.deleteMany({ where: { id: id.parse(commentId), userId } });
}
