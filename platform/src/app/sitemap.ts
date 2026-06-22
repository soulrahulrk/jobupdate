import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

const BASE = "https://jobupdate-ruddy.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base: MetadataRoute.Sitemap = [
    { url: BASE, priority: 1 },
    { url: `${BASE}/jobs`, priority: 0.9 },
  ];
  try {
    const [jobs, companies] = await Promise.all([
      db.job.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
      db.company.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...base,
      ...jobs.map((j) => ({ url: `${BASE}/jobs/${j.slug}`, lastModified: j.updatedAt, priority: 0.7 })),
      ...companies.map((c) => ({ url: `${BASE}/companies/${c.slug}`, lastModified: c.updatedAt, priority: 0.6 })),
    ];
  } catch {
    return base; // DB unavailable at build time
  }
}
