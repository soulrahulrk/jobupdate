import { getAdminStats } from "@/features/admin/queries";

export default async function AdminHome() {
  const s = await getAdminStats();
  const cards = [
    { label: "Users", value: s.users },
    { label: "Companies", value: s.companies },
    { label: "Jobs", value: s.jobs },
    { label: "Active jobs", value: s.activeJobs },
    { label: "Applications", value: s.applications },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-sm text-muted">Platform at a glance.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="card">
            <div className="text-3xl font-extrabold gradient-text">{c.value}</div>
            <div className="mt-1 text-sm text-muted">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
