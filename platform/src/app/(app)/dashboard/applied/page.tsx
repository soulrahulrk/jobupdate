import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getApplications } from "@/features/dashboard/queries";
import { JobCard } from "@/components/jobs/job-card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Applications" };

const STATUS: Record<string, "primary" | "success" | "warning" | "default"> = {
  SAVED: "default", APPLIED: "primary", INTERVIEW: "warning", OFFER: "success", REJECTED: "default",
};

export default async function AppliedPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const apps = await getApplications(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Applications</h1>
      {apps.length ? (
        <div className="mt-6 space-y-4">
          {apps.map((a) => (
            <div key={a.id}>
              <Badge variant={STATUS[a.status]} className="mb-1.5">{a.status}</Badge>
              <JobCard job={a.job} />
            </div>
          ))}
        </div>
      ) : (
        <div className="card mt-6 text-center text-sm text-muted">
          No applications tracked yet. Open a job and tap <span className="font-semibold">Mark applied</span>.
          <br /><Link href="/jobs" className="font-semibold text-primary hover:underline">Browse jobs</Link>
        </div>
      )}
    </div>
  );
}
