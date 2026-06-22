import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getUserStats } from "@/features/dashboard/queries";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardHome() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const stats = await getUserStats(session.user.id);

  const cards = [
    { label: "Saved jobs", value: stats.saved, href: "/dashboard/saved" },
    { label: "Applications", value: stats.applied, href: "/dashboard/applied" },
    { label: "Companies", value: stats.bookmarks, href: "/dashboard/bookmarks" },
    { label: "Resumes", value: stats.resumes, href: "/dashboard/resumes" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Overview</h1>
      <p className="text-sm text-muted">Your job-hunt at a glance.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="card transition hover:border-primary/50">
            <div className="text-3xl font-extrabold gradient-text">{c.value}</div>
            <div className="mt-1 text-sm text-muted">{c.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
