import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDismissedJobs } from "@/features/dashboard/queries";
import { JobCard } from "@/components/jobs/job-card";

export const metadata: Metadata = { title: "Cancelled jobs" };

export default async function DismissedPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const dismissed = await getDismissedJobs(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Cancelled / not relevant</h1>
      <p className="mt-1 text-sm text-muted">
        Hidden from your main board. Open one and tap <span className="font-semibold">Cancelled — undo</span> to restore it.
      </p>
      {dismissed.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {dismissed.map((d) => <JobCard key={d.id} job={d.job} />)}
        </div>
      ) : (
        <div className="card mt-6 text-center text-sm text-muted">
          Nothing cancelled yet. On any job, tap <span className="font-semibold">Not relevant</span> to remove it from your board.{" "}
          <Link href="/jobs" className="font-semibold text-primary hover:underline">Browse jobs</Link>
        </div>
      )}
    </div>
  );
}
