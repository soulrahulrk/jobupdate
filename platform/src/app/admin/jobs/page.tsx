import Link from "next/link";
import { Plus } from "lucide-react";
import { listJobsAdmin } from "@/features/admin/queries";
import { JobRowActions } from "@/components/admin/row-actions";
import { Badge } from "@/components/ui/badge";

export default async function AdminJobs() {
  const jobs = await listJobsAdmin();
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Jobs <span className="text-base font-normal text-muted">({jobs.length})</span></h1>
        <Link href="/admin/jobs/new" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3.5 py-2 text-sm font-semibold text-primary-fg">
          <Plus className="h-4 w-4" /> New job
        </Link>
      </div>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-3">Title</th><th className="p-3">Company</th><th className="p-3">Region</th><th className="p-3">Status</th><th className="p-3 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-t border-border">
                <td className="p-3 font-medium">{j.title}</td>
                <td className="p-3 text-muted">{j.company.name}</td>
                <td className="p-3 text-muted">{j.region}</td>
                <td className="p-3">{j.isActive ? <Badge variant="success">Active</Badge> : <Badge>Inactive</Badge>}</td>
                <td className="p-3"><JobRowActions id={j.id} active={j.isActive} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
