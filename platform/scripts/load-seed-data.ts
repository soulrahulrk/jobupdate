/**
 * load-seed-data.ts — maps deliverables/companies_seed.json + jobs_seed.json onto the
 * current Prisma schema and upserts them (idempotent, deterministic slugs, transaction, backup).
 *
 *   npm run load:seed -- --dry   preview (no DB writes)
 *   npm run load:seed            apply
 *
 * Generated/representative seed data — load deliberately. Salary estimates are NOT stored as
 * salaryMin/Max (kept in description) to avoid presenting estimates as facts.
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { join } from "path";

const db = new PrismaClient();
const DRY = process.argv.includes("--dry");
const NOW = new Date();
const ROOT = join(process.cwd(), "..", "deliverables");

type Region = "TRICITY" | "NCR" | "METRO" | "REMOTE" | "OTHER";

const read = (f: string) => JSON.parse(readFileSync(join(ROOT, f), "utf8"));
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function regionOf(hq: string): Region {
  const t = (hq || "").toLowerCase();
  if (/chandigarh|mohali|panchkula/.test(t)) return "TRICITY";
  if (/delhi|noida|gurugram|gurgaon|faridabad|ghaziabad/.test(t)) return "NCR";
  if (/bengaluru|bangalore|hyderabad|pune|chennai|mumbai|kolkata/.test(t)) return "METRO";
  if (/all-remote|remote/.test(t)) return "REMOTE";
  return "OTHER";
}
const hiringStatusOf = (s: string) =>
  s === "actively_hiring" ? "CONFIRMED" : s === "selective" ? "VERIFY" : "UNKNOWN";
const aiRelevanceOf = (cat: string) =>
  /ai/.test(cat) ? 9 : /healthtech|cyber/.test(cat) ? 7 : /fintech|saas|devtools/.test(cat) ? 6 : 5;
const expOf = (e: string) =>
  /fresher/i.test(e) ? "FRESHER" : /0-1/.test(e) ? "ZERO_ONE" : /1-2/.test(e) ? "ONE_TWO" : "FRESHER";
const workModeOf = (j: any): "ONSITE" | "HYBRID" | "REMOTE" =>
  j.remote ? "REMOTE" : /hybrid/i.test(j.location || "") ? "HYBRID" : "ONSITE";
const validRegion = (r: string): Region => (["TRICITY", "NCR", "METRO", "REMOTE", "OTHER"].includes(r) ? (r as Region) : "OTHER");

async function main() {
  const companies = read("companies_seed.json").companies as any[];
  const jobs = read("jobs_seed.json").jobs as any[];

  // backup
  const [allCo, allJob] = await Promise.all([db.company.findMany(), db.job.findMany()]);
  mkdirSync(join(process.cwd(), "backups"), { recursive: true });
  writeFileSync(join(process.cwd(), "backups", `backup-${NOW.toISOString().replace(/[:.]/g, "-")}.json`),
    JSON.stringify({ takenAt: NOW.toISOString(), companies: allCo, jobs: allJob }, null, 2));

  const report = { dry: DRY, companiesUpserted: 0, jobsUpserted: 0, jobsSkippedNoCompany: 0, skipped: [] as string[] };

  if (DRY) {
    console.log(`DRY: would upsert ${companies.length} companies and ${jobs.length} jobs.`);
    const dbSlugs = new Set(allCo.map((c) => c.slug).concat(companies.map((c) => c.slug)));
    jobs.forEach((j) => { if (!dbSlugs.has(j.company_slug)) report.skipped.push(j.company_slug); });
    console.log(`DRY: ${jobs.length - report.skipped.length} jobs resolvable; ${report.skipped.length} need a company first: ${[...new Set(report.skipped)].join(", ") || "none"}`);
    return;
  }

  await db.$transaction(async (tx) => {
    for (const c of companies) {
      const data = {
        name: c.name, website: c.website || null, careersUrl: c.careers_page || null, linkedinUrl: c.linkedin || null,
        region: regionOf(c.headquarters), city: c.headquarters || null, sizeRange: String(c.employee_count ?? "") || null,
        industries: c.industry ? [c.industry] : [], techStack: Array.isArray(c.skills_hiring_for) ? c.skills_hiring_for : [],
        hiringStatus: hiringStatusOf(c.hiring_status) as any, aiRelevance: aiRelevanceOf(c.category || c.industry || ""),
        description: c.description_long || c.description_short || null, verifiedAt: NOW,
      };
      await tx.company.upsert({ where: { slug: c.slug }, update: data, create: { slug: c.slug, ...data } });
      report.companiesUpserted++;
    }
    for (const j of jobs) {
      const co = await tx.company.findUnique({ where: { slug: j.company_slug }, select: { id: true } });
      if (!co) { report.jobsSkippedNoCompany++; report.skipped.push(j.company_slug); continue; }
      const slug = `${j.company_slug}-${slugify(j.title)}`.slice(0, 80);
      const exp = expOf(j.experience);
      const desc = [j.description, j.requirements?.length ? `Requirements: ${j.requirements.join("; ")}.` : "", j.salary_range ? `Salary (estimate): ${j.salary_range}.` : ""].filter(Boolean).join(" ");
      const data = {
        title: j.title, companyId: co.id, description: desc || null,
        skills: Array.isArray(j.skills) ? j.skills : [], workMode: workModeOf(j) as any,
        region: validRegion(j.region), location: j.location || null, experience: exp as any,
        applyUrl: j.apply_url || null, isFresher: exp === "FRESHER" || exp === "ZERO_ONE", isActive: true,
        postedAt: NOW, source: "seed:deliverables 2026-06-24",
      };
      await tx.job.upsert({ where: { slug }, update: data, create: { slug, ...data } });
      report.jobsUpserted++;
    }
  });

  console.log("LOAD_REPORT " + JSON.stringify(report, null, 2));
}

main().catch((e) => { console.error("FAIL", (e as Error)?.message || e); process.exit(1); }).finally(() => db.$disconnect());
