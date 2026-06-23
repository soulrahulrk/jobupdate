import type { Metadata } from "next";
import { Suspense } from "react";
import { jobFilterSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";
import { getJobs } from "@/features/jobs/queries";
import { JobCard } from "@/components/jobs/job-card";
import { FilterBar } from "@/components/jobs/filter-bar";
import { Pagination } from "@/components/ui/pagination";

export const metadata: Metadata = {
  title: "Browse Jobs",
  description: "Search verified fresher AI/ML, GenAI, Computer Vision and Python roles.",
};

type SP = Record<string, string | string[] | undefined>;

export default async function JobsPage({ searchParams }: { searchParams: SP }) {
  const flat = Object.fromEntries(
    Object.entries(searchParams).map(([k, v]) => [k, Array.isArray(v) ? v[0] : v])
  );
  const filter = jobFilterSchema.parse(flat);
  const session = await auth();
  const { items, total, page, pageCount } = await getJobs(filter, session?.user?.id);

  return (
    <div className="container py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Browse jobs</h1>
        <p className="text-sm text-muted">Verified fresher &amp; graduate-trainee roles · live data</p>
      </header>

      <Suspense>
        <FilterBar />
      </Suspense>

      <p className="my-4 text-sm text-muted">
        <span className="font-semibold text-ink">{total}</span> role{total === 1 ? "" : "s"} found
      </p>

      {items.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="card text-center text-sm text-muted">
          No roles match these filters. Try clearing some, or check back — new jobs are added regularly.
        </div>
      )}

      <Pagination page={page} pageCount={pageCount} params={flat as Record<string, string | undefined>} />
    </div>
  );
}
