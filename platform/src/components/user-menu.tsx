import Link from "next/link";
import { LayoutDashboard } from "lucide-react";
import { auth, signOut } from "@/lib/auth";

export async function UserMenu() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex items-center gap-1 text-sm">
        <Link href="/jobs" className="rounded-md px-3 py-2 text-muted hover:bg-surface-2 hover:text-ink">Jobs</Link>
        <Link href="/login" className="rounded-md bg-primary px-3.5 py-2 font-semibold text-primary-fg">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      <Link href="/jobs" className="rounded-md px-3 py-2 text-muted hover:bg-surface-2 hover:text-ink">Jobs</Link>
      <Link href="/dashboard" className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-muted hover:bg-surface-2 hover:text-ink">
        <LayoutDashboard className="h-4 w-4" /> Dashboard
      </Link>
      <form action={async () => { "use server"; await signOut({ redirectTo: "/" }); }}>
        <button type="submit" className="rounded-md border border-border px-3 py-2 hover:bg-surface-2">Sign out</button>
      </form>
    </div>
  );
}
