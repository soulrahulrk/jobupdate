import { auth } from "@/lib/auth";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <div className="container grid gap-8 py-8 md:grid-cols-[210px_1fr]">
      <aside>
        <p className="mb-4 text-xs text-muted">
          Signed in as
          <br />
          <span className="font-semibold text-ink">{session?.user?.name ?? session?.user?.email}</span>
        </p>
        <SidebarNav />
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
