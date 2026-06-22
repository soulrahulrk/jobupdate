import Link from "next/link";
import { MapPin, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatSalary, REGION_LABEL, EXP_LABEL } from "@/lib/utils";
import type { JobWithCompany } from "@/features/jobs/queries";

export function JobCard({ job }: { job: JobWithCompany }) {
  const salary = formatSalary(job.salaryMin, job.salaryMax);
  return (
    <Link
      href={`/jobs/${job.slug}`}
      className="card group flex flex-col gap-3 transition hover:-translate-y-0.5 hover:border-primary/50"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold leading-snug group-hover:text-primary">{job.title}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
            <Building2 className="h-3.5 w-3.5" /> {job.company.name}
          </p>
        </div>
        {job.company.aiRelevance ? (
          <Badge variant="accent" title="AI/ML relevance">AI {job.company.aiRelevance}</Badge>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {job.skills.slice(0, 4).map((s) => (
          <span key={s} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-muted">{s}</span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1 text-xs">
        <Badge variant="primary">{EXP_LABEL[job.experience]}</Badge>
        <Badge>{job.workMode}</Badge>
        <span className="flex items-center gap-1 text-muted">
          <MapPin className="h-3.5 w-3.5" /> {job.location ?? REGION_LABEL[job.region]}
        </span>
        {salary ? <span className="ml-auto font-semibold text-success">{salary}</span> : null}
      </div>
    </Link>
  );
}
