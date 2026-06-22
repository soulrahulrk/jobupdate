import "server-only";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { type JobFilter, PAGE_SIZE } from "@/lib/validations";

export async function getJobs(f: JobFilter) {
  const where: Prisma.JobWhereInput = { isActive: true };
  if (f.fresher) where.isFresher = true;
  if (f.region) where.region = f.region;
  if (f.workMode) where.workMode = f.workMode;
  if (f.experience) where.experience = f.experience;
  if (f.salaryMin) where.salaryMax = { gte: f.salaryMin };
  if (f.q) {
    where.OR = [
      { title: { contains: f.q, mode: "insensitive" } },
      { skills: { has: f.q } },
      { company: { is: { name: { contains: f.q, mode: "insensitive" } } } },
    ];
  }

  const orderBy: Prisma.JobOrderByWithRelationInput =
    f.sort === "salary" ? { salaryMax: { sort: "desc", nulls: "last" } } : { postedAt: "desc" };

  const [items, total] = await Promise.all([
    db.job.findMany({
      where,
      orderBy,
      include: { company: true },
      skip: (f.page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.job.count({ where }),
  ]);

  return { items, total, page: f.page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getJobBySlug(slug: string) {
  return db.job.findUnique({ where: { slug }, include: { company: true } });
}

export async function getSimilarJobs(jobId: string, region: string, skills: string[]) {
  return db.job.findMany({
    where: {
      id: { not: jobId },
      isActive: true,
      OR: [{ region: region as Prisma.EnumRegionFilter["equals"] }, { skills: { hasSome: skills } }],
    },
    include: { company: true },
    orderBy: { postedAt: "desc" },
    take: 4,
  });
}

export async function getCompanyBySlug(slug: string) {
  return db.company.findUnique({
    where: { slug },
    include: { jobs: { where: { isActive: true }, orderBy: { postedAt: "desc" }, include: { company: true } } },
  });
}

export type JobWithCompany = Prisma.JobGetPayload<{ include: { company: true } }>;
