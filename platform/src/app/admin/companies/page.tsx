import { listCompaniesAdmin } from "@/features/admin/queries";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

export default async function AdminCompanies() {
  const companies = await listCompaniesAdmin();
  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Companies <span className="text-base font-normal text-muted">({companies.length})</span></h1>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-surface-2 text-left text-xs uppercase tracking-wide text-muted">
            <tr><th className="p-3">Name</th><th className="p-3">Region</th><th className="p-3">Hiring</th><th className="p-3">AI</th><th className="p-3 text-right">Jobs</th></tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted">{c.region}</td>
                <td className="p-3">{c.hiringStatus === "CONFIRMED" ? <Badge variant="success">Hiring</Badge> : <Badge>{c.hiringStatus}</Badge>}</td>
                <td className="p-3 text-muted">{c.aiRelevance ?? "—"}</td>
                <td className="p-3 text-right font-semibold">{c._count.jobs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
