import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin } from "lucide-react";
import { getCompanyBySlug } from "@/features/jobs/queries";
import { JobCard } from "@/components/jobs/job-card";
import { Badge } from "@/components/ui/badge";
import { REGION_LABEL } from "@/lib/utils";

const HIRING: Record<string, { label: string; variant: "success" | "warning" | "default" }> = {
  CONFIRMED: { label: "Hiring freshers", variant: "success" },
  PROGRAM: { label: "Grad program", variant: "warning" },
  VERIFY: { label: "Verify status", variant: "warning" },
  CLOSED: { label: "Closed", variant: "default" },
  UNKNOWN: { label: "Unconfirmed", variant: "default" },
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const c = await getCompanyBySlug(params.slug);
  return c ? { title: c.name, description: c.description ?? `${c.name} — open roles and hiring status.` } : { title: "Company" };
}

export default async function CompanyPage({ params }: { params: { slug: string } }) {
  const company = await getCompanyBySlug(params.slug);
  if (!company) notFound();
  const status = HIRING[company.hiringStatus];

  return (
    <div className="container max-w-3xl py-8">
      <Link href="/jobs" className="text-sm text-muted hover:text-ink">← Back to jobs</Link>

      <div className="card mt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{company.name}</h1>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
              <MapPin className="h-3.5 w-3.5" /> {company.city ?? REGION_LABEL[company.region]}
            </p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>

        {company.description ? <p className="mt-4 text-sm leading-relaxed text-muted">{company.description}</p> : null}

        {company.techStack.length ? (
          <div className="mt-4">
            <h2 className="text-sm font-semibold">Tech stack</h2>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {company.techStack.map((t) => <span key={t} className="rounded-md bg-surface-2 px-2.5 py-1 text-xs">{t}</span>)}
            </div>
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-3 text-sm">
          {company.careersUrl ? (
            <a href={company.careersUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline">
              Careers page <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          {company.phone ? <a href={`tel:${company.phone}`} className="text-muted hover:text-ink">📞 {company.phone}</a> : null}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="mb-4 text-lg font-bold">Open roles ({company.jobs.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {company.jobs.map((j) => <JobCard key={j.id} job={j} />)}
        </div>
      </section>
    </div>
  );
}
