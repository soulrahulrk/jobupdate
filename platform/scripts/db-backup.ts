import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const db = new PrismaClient();

async function main() {
  const [companies, jobs] = await Promise.all([
    db.company.findMany({ orderBy: { name: "asc" } }),
    db.job.findMany({ orderBy: { createdAt: "asc" } }),
  ]);
  const dir = join(process.cwd(), "backups");
  mkdirSync(dir, { recursive: true });
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const file = join(dir, `backup-${ts}.json`);
  writeFileSync(file, JSON.stringify({ takenAt: new Date().toISOString(), companies, jobs }, null, 2));
  console.log(`BACKUP_OK file=${file}`);
  console.log(`COUNTS companies=${companies.length} jobs=${jobs.length} active=${jobs.filter((j) => j.isActive).length}`);
  // Compact inventory for planning (no secrets)
  for (const c of companies) {
    const cj = jobs.filter((j) => j.companyId === c.id);
    console.log(`CO ${c.slug} | ${c.name} | ${c.region} | ${c.hiringStatus} | jobs=${cj.length}`);
  }
}
main().catch((e) => { console.error("BACKUP_FAIL", e?.message || e); process.exit(1); }).finally(() => db.$disconnect());
