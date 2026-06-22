import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { getBookmarks } from "@/features/dashboard/queries";
import { Badge } from "@/components/ui/badge";
import { REGION_LABEL } from "@/lib/utils";

export const metadata: Metadata = { title: "Bookmarked companies" };

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const bookmarks = await getBookmarks(session.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold">Bookmarked companies</h1>
      {bookmarks.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {bookmarks.map((b) => (
            <Link key={b.id} href={`/companies/${b.company.slug}`} className="card transition hover:border-primary/50">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold">{b.company.name}</h3>
                {b.company.aiRelevance ? <Badge variant="accent">AI {b.company.aiRelevance}</Badge> : null}
              </div>
              <p className="mt-1 text-sm text-muted">{b.company.city ?? REGION_LABEL[b.company.region]}</p>
              <p className="mt-2 text-xs text-muted">{b.company.jobs.length} open role{b.company.jobs.length === 1 ? "" : "s"}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card mt-6 text-center text-sm text-muted">
          No bookmarked companies yet. Open a company page and bookmark it.
        </div>
      )}
    </div>
  );
}
