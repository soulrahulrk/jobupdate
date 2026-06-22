import "server-only";
import { db } from "@/lib/db";

export async function getUserStats(userId: string) {
  const [saved, applied, bookmarks, resumes] = await Promise.all([
    db.savedJob.count({ where: { userId } }),
    db.application.count({ where: { userId } }),
    db.bookmark.count({ where: { userId } }),
    db.resume.count({ where: { userId } }),
  ]);
  return { saved, applied, bookmarks, resumes };
}

export function getSavedJobs(userId: string) {
  return db.savedJob.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { job: { include: { company: true } } },
  });
}

export function getApplications(userId: string) {
  return db.application.findMany({
    where: { userId },
    orderBy: { appliedAt: "desc" },
    include: { job: { include: { company: true } } },
  });
}

export function getBookmarks(userId: string) {
  return db.bookmark.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { company: { include: { jobs: { where: { isActive: true }, select: { id: true } } } } },
  });
}
