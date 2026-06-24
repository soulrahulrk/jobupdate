import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();
const NOW = new Date();
const NOTE =
  "2026-06-24 maintenance: Sarvam public careers (Ashby) list only 3-5yr/senior roles; no current fresher/intern opening verified via official source.";

async function main() {
  const changes: unknown[] = [];

  await db.$transaction(async (tx) => {
    const sarvam = await tx.company.findUnique({ where: { slug: "sarvam-ai" }, include: { jobs: true } });
    if (sarvam) {
      if (sarvam.hiringStatus !== "VERIFY") {
        await tx.company.update({ where: { id: sarvam.id }, data: { hiringStatus: "VERIFY", verifiedAt: NOW } });
        changes.push({ type: "company-update", slug: "sarvam-ai", field: "hiringStatus", from: sarvam.hiringStatus, to: "VERIFY" });
      }
      for (const j of sarvam.jobs) {
        if (j.isActive) {
          await tx.job.update({ where: { id: j.id }, data: { isActive: false, source: NOTE } });
          changes.push({ type: "job-deactivate", slug: j.slug, title: j.title });
        }
      }
    }
  });

  console.log("CHANGES " + JSON.stringify(changes, null, 2));

  // ---- QA re-query ----
  const [companies, jobs, active] = await Promise.all([
    db.company.count(),
    db.job.count(),
    db.job.count({ where: { isActive: true } }),
  ]);
  const sarvamAfter = await db.company.findUnique({
    where: { slug: "sarvam-ai" },
    include: { jobs: { select: { slug: true, isActive: true } } },
  });
  const activeNoUrl = await db.job.findMany({
    where: { isActive: true, OR: [{ applyUrl: null }, { applyUrl: "" }] },
    select: { slug: true },
  });
  console.log(`QA companies=${companies} jobs=${jobs} active=${active}`);
  console.log("QA sarvam " + JSON.stringify({ status: sarvamAfter?.hiringStatus, jobs: sarvamAfter?.jobs }));
  console.log(`QA active_jobs_without_applyUrl=${activeNoUrl.length} ${JSON.stringify(activeNoUrl.map((j) => j.slug))}`);
}

main().catch((e) => { console.error("FAIL", (e as Error)?.message || e); process.exit(1); }).finally(() => db.$disconnect());
