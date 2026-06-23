import "server-only";
import { db } from "@/lib/db";

export async function getAdminStats() {
  const [users, companies, jobs, activeJobs, applications] = await Promise.all([
    db.user.count(),
    db.company.count(),
    db.job.count(),
    db.job.count({ where: { isActive: true } }),
    db.application.count(),
  ]);
  return { users, companies, jobs, activeJobs, applications };
}

export function listJobsAdmin() {
  return db.job.findMany({ orderBy: { createdAt: "desc" }, include: { company: { select: { name: true } } }, take: 200 });
}

export function listCompaniesAdmin() {
  return db.company.findMany({ orderBy: { name: "asc" }, include: { _count: { select: { jobs: true } } } });
}

export function listUsers() {
  return db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { applications: true } } },
  });
}

export function getJobForEdit(id: string) {
  return db.job.findUnique({ where: { id } });
}

export function getCompanyForEdit(id: string) {
  return db.company.findUnique({ where: { id } });
}

export function companyOptions() {
  return db.company.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
}
