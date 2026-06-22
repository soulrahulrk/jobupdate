import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getSavedJobs } from "@/features/dashboard/queries";
import { JobCard } from "@/components/jobs/job-card";

export const metadata: Metadata = { title: "Saved jobs" };

export default async function SavedPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const saved = await getSavedJobs(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Saved jobs</h1>
      {saved.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {saved.map((s) => <JobCard key={s.id} job={s.job} />)}
        </div>
      ) : (
        <div className="card mt-6 text-center text-sm text-muted">
          No saved jobs yet. <Link href="/jobs" className="font-semibold text-primary hover:underline">Browse jobs</Link> and tap Save.
        </div>
      )}
    </div>
  );
}
