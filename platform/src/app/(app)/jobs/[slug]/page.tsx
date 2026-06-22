import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, MapPin, Building2, Briefcase } from "lucide-react";
import { getJobBySlug, getSimilarJobs } from "@/features/jobs/queries";
import { JobCard } from "@/components/jobs/job-card";
import { Badge } from "@/components/ui/badge";
import { formatSalary, REGION_LABEL, EXP_LABEL } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const job = await getJobBySlug(params.slug);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} · ${job.company.name}`,
    description: `${job.title} at ${job.company.name} — ${EXP_LABEL[job.experience]}, ${job.location ?? REGION_LABEL[job.region]}.`,
  };
}

export default async function JobPage({ params }: { params: { slug: string } }) {
  const job = await getJobBySlug(params.slug);
  if (!job) notFound();
  const similar = await getSimilarJobs(job.id, job.region, job.skills);
  const salary = formatSalary(job.salaryMin, job.salaryMax);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    datePosted: job.postedAt.toISOString(),
    employmentType: job.workMode,
    hiringOrganization: { "@type": "Organization", name: job.company.name, sameAs: job.company.website ?? undefined },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location ?? REGION_LABEL[job.region], addressCountry: "IN" } },
    ...(job.salaryMin && { baseSalary: { "@type": "MonetaryAmount", currency: "INR", value: { "@type": "QuantitativeValue", minValue: job.salaryMin, maxValue: job.salaryMax ?? job.salaryMin, unitText: "YEAR" } } }),
  };

  return (
    <div className="container max-w-3xl py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/jobs" className="text-sm text-muted hover:text-ink">← Back to jobs</Link>

      <div className="card mt-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <Link href={`/companies/${job.company.slug}`} className="mt-1 inline-flex items-center gap-1.5 text-muted hover:text-primary">
              <Building2 className="h-4 w-4" /> {job.company.name}
            </Link>
          </div>
          {job.company.aiRelevance ? <Badge variant="accent">AI {job.company.aiRelevance}/10</Badge> : null}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
          <Badge variant="primary"><Briefcase className="mr-1 h-3 w-3" />{EXP_LABEL[job.experience]}</Badge>
          <Badge>{job.workMode}</Badge>
          <span className="flex items-center gap-1 text-muted"><MapPin className="h-3.5 w-3.5" />{job.location ?? REGION_LABEL[job.region]}</span>
          {salary ? <span className="ml-auto text-lg font-bold text-success">{salary}</span> : null}
        </div>

        {job.description ? <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted">{job.description}</p> : null}

        <div className="mt-5">
          <h2 className="text-sm font-semibold">Skills</h2>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.skills.map((s) => <span key={s} className="rounded-md bg-surface-2 px-2.5 py-1 text-xs">{s}</span>)}
          </div>
        </div>

        {job.applyUrl ? (
          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-fg transition hover:opacity-90">
            Apply now <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>

      {similar.length ? (
        <section className="mt-10">
          <h2 className="mb-4 text-lg font-bold">Similar roles</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {similar.map((j) => <JobCard key={j.id} job={j} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
