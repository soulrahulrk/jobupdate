/**
 * refresh-jobs.ts — weekly verified job ingester.
 *
 *   npm run refresh           apply changes to the DB
 *   npm run refresh -- --dry  fetch + filter + print only (no DB writes)
 *
 * Pulls live, currently-open postings from each company's ATS public API,
 * keeps only AI/ML/Python/data + fresher/0-1 roles, upserts companies & jobs
 * (deterministic slugs), and de-activates ATS jobs that disappeared from the
 * feed. A timestamped JSON backup is written before any change.
 */
import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { sources, type Source } from "./sources";

const db = new PrismaClient();
const DRY = process.argv.includes("--dry");
const NOW = new Date();

type Norm = {
  atsId: string; title: string; location: string; applyUrl?: string;
  descriptionHtml?: string; postedAt?: string; remote?: boolean; workplaceType?: string;
};

async function getJson(url: string): Promise<any> {
  const r = await fetch(url, { headers: { "User-Agent": "jobupdate-refresh/1.0", Accept: "application/json" } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.json();
}

async function fetchAts(s: Source): Promise<Norm[]> {
  if (s.ats === "greenhouse") {
    const d = await getJson(`https://boards-api.greenhouse.io/v1/boards/${s.token}/jobs?content=true`);
    return (d.jobs || []).map((x: any) => ({
      atsId: String(x.id), title: x.title, location: x.location?.name || "",
      applyUrl: x.absolute_url, descriptionHtml: x.content, postedAt: x.updated_at,
      remote: /remote/i.test(x.location?.name || ""),
    }));
  }
  if (s.ats === "lever") {
    const d = await getJson(`https://api.lever.co/v0/postings/${s.token}?mode=json`);
    return (d || []).map((x: any) => ({
      atsId: String(x.id), title: x.text, location: x.categories?.location || "",
      applyUrl: x.hostedUrl, descriptionHtml: x.descriptionPlain || x.description,
      postedAt: x.createdAt ? new Date(x.createdAt).toISOString() : undefined,
      remote: /remote/i.test(x.categories?.location || "") || x.workplaceType === "remote", workplaceType: x.workplaceType,
    }));
  }
  if (s.ats === "ashby") {
    const d = await getJson(`https://api.ashbyhq.com/posting-api/job-board/${s.token}?includeCompensation=false`);
    return (d.jobs || []).filter((x: any) => x.isListed !== false).map((x: any) => ({
      atsId: String(x.id), title: x.title, location: x.location || x.locationName || "",
      applyUrl: x.jobUrl || x.applyUrl, descriptionHtml: x.descriptionHtml || x.descriptionPlain,
      postedAt: x.publishedDate || x.publishedAt, remote: !!x.isRemote, workplaceType: x.employmentType,
    }));
  }
  // workable (best-effort public widget endpoint)
  const d = await getJson(`https://apply.workable.com/api/v1/widget/accounts/${s.token}?details=true`);
  return (d.jobs || []).map((x: any) => ({
    atsId: String(x.shortcode || x.id), title: x.title,
    location: [x.city, x.state, x.country].filter(Boolean).join(", "),
    applyUrl: x.shortlink || x.url || x.application_url, descriptionHtml: x.description,
    postedAt: x.created_at || x.published_on, remote: !!x.telecommuting, workplaceType: x.employment_type,
  }));
}

const txt = (h?: string) => (h || "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const ENTRY = /(fresher|graduate|trainee|associate|junior|intern|entry[\s-]?level|new[\s-]?grad|campus|0[\s-]?1|0 to 1)/i;
const SENIOR = /(senior|sr\.?\s|\blead\b|principal|staff|\bmanager\b|\bhead\b|director|\bvp\b|architect|\biii\b|[3-9]\+\s*year|[3-9]\s*-\s*[0-9]\s*year)/i;
const PROFILE = /(\bai\b|\bml\b|machine learning|deep learning|data scien|data analyst|\bnlp\b|computer vision|\bllm\b|gen[\s-]?ai|generative|python|fastapi|backend|software engineer|\bsde\b|data engineer|applied ai|\brag\b|analytics)/i;

const SKILLS = ["Python","SQL","Machine Learning","Deep Learning","NLP","Computer Vision","OpenCV","YOLO","LLM","GenAI","RAG","LangChain","LangGraph","ChromaDB","FastAPI","PyTorch","TensorFlow","Scikit-learn","Pandas","NumPy","Docker","Kubernetes","AWS","React","Node","Java","Power BI","Spark","Airflow"];
const skillsOf = (s: string) => SKILLS.filter((k) => new RegExp(`(^|[^a-z])${k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^a-z]|$)`, "i").test(s));

function regionOf(loc: string, fb?: Source["region"]): "TRICITY" | "NCR" | "METRO" | "REMOTE" | "OTHER" {
  const t = loc.toLowerCase();
  if (/remote/.test(t)) return "REMOTE";
  if (/chandigarh|mohali|panchkula|zirakpur/.test(t)) return "TRICITY";
  if (/delhi|noida|gurugram|gurgaon|faridabad|ghaziabad/.test(t)) return "NCR";
  if (/bengaluru|bangalore|hyderabad|pune|chennai|mumbai|kolkata/.test(t)) return "METRO";
  return fb || "OTHER";
}
const isIndia = (loc: string) =>
  /remote|india|chandigarh|mohali|panchkula|delhi|noida|gurugram|gurgaon|faridabad|ghaziabad|bengaluru|bangalore|hyderabad|pune|chennai|mumbai|kolkata/i.test(loc);
function workModeOf(n: Norm): "ONSITE" | "HYBRID" | "REMOTE" {
  if (n.remote || /remote/i.test(n.location)) return "REMOTE";
  if (/hybrid/i.test(n.location) || /hybrid/i.test(n.workplaceType || "")) return "HYBRID";
  return "ONSITE";
}
const expOf = (title: string): "FRESHER" | "ZERO_ONE" =>
  /(intern|0[\s-]?1|0 to 1|junior|associate)/i.test(title) ? "ZERO_ONE" : "FRESHER";

async function main() {
  // backup
  const [allCo, allJob] = await Promise.all([db.company.findMany(), db.job.findMany()]);
  const dir = join(process.cwd(), "backups");
  mkdirSync(dir, { recursive: true });
  const ts = NOW.toISOString().replace(/[:.]/g, "-");
  writeFileSync(join(dir, `backup-${ts}.json`), JSON.stringify({ takenAt: NOW.toISOString(), companies: allCo, jobs: allJob }, null, 2));

  const report = {
    date: NOW.toISOString(), dry: DRY, sources: sources.length,
    examined: 0, matched: 0, companiesUpserted: 0, jobsUpserted: 0, jobsDeactivated: 0,
    errors: [] as { source: string; ats: string; error: string }[],
    inserted: [] as { company: string; title: string; location: string; region: string; applyUrl?: string }[],
  };

  for (const s of sources) {
    let raw: Norm[];
    try {
      raw = await fetchAts(s);
    } catch (e) {
      report.errors.push({ source: s.slug, ats: s.ats, error: (e as Error)?.message || String(e) });
      continue;
    }
    report.examined += raw.length;
    const good = raw.filter((n) => PROFILE.test(n.title) && ENTRY.test(n.title) && !SENIOR.test(n.title) && (isIndia(n.location) || !!s.region));
    report.matched += good.length;

    if (DRY) {
      console.log(`DRY ${s.slug} [${s.ats}] raw=${raw.length} matched=${good.length}`);
      good.forEach((n) => console.log(`   • ${n.title} | ${n.location} | ${n.applyUrl}`));
      continue;
    }

    const baseCo = { name: s.name, website: s.website ?? undefined, careersUrl: s.careersUrl ?? undefined, region: s.region ?? "OTHER", aiRelevance: s.aiRelevance ?? undefined, verifiedAt: NOW } as const;
    const co = await db.company.upsert({
      where: { slug: s.slug },
      // Only PROMOTE to CONFIRMED when we actually see live roles; never downgrade on an empty feed (company may hire elsewhere).
      update: { ...baseCo, ...(good.length ? { hiringStatus: "CONFIRMED" as const } : {}) },
      create: { slug: s.slug, ...baseCo, hiringStatus: good.length ? "CONFIRMED" : "UNKNOWN", industries: [], techStack: [] },
    });
    report.companiesUpserted++;

    const seen: string[] = [];
    for (const n of good) {
      const slug = `${s.slug}-${slugify(n.atsId)}`.slice(0, 70);
      seen.push(slug);
      const data = {
        title: n.title, companyId: co.id,
        description: txt(n.descriptionHtml).slice(0, 1200) || null,
        skills: skillsOf(`${n.title} ${txt(n.descriptionHtml)}`),
        workMode: workModeOf(n), region: regionOf(n.location, s.region), location: n.location || null,
        experience: expOf(n.title), applyUrl: n.applyUrl || s.careersUrl || null,
        isFresher: true, isActive: true,
        postedAt: n.postedAt ? new Date(n.postedAt) : NOW, source: `ats:${s.ats}:${s.token}`,
      };
      await db.job.upsert({ where: { slug }, update: data, create: { slug, ...data } });
      report.jobsUpserted++;
      report.inserted.push({ company: s.name, title: n.title, location: n.location, region: data.region, applyUrl: data.applyUrl ?? undefined });
    }

    // de-activate ATS jobs from THIS source that are no longer in the live feed (never touches admin-added jobs)
    const stale = await db.job.updateMany({
      where: { companyId: co.id, source: `ats:${s.ats}:${s.token}`, slug: { notIn: seen }, isActive: true },
      data: { isActive: false },
    });
    report.jobsDeactivated += stale.count;
  }

  console.log(`${DRY ? "DRY_REPORT" : "REPORT"} ${JSON.stringify(report, null, 2)}`);
}

main().catch((e) => { console.error("FAIL", (e as Error)?.message || e); process.exit(1); }).finally(() => db.$disconnect());
