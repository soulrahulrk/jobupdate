import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  page,
  pageCount,
  params,
}: {
  page: number;
  pageCount: number;
  params: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;
  const href = (p: number) => {
    const q = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v && k !== "page") q.set(k, v);
    q.set("page", String(p));
    return `?${q.toString()}`;
  };
  return (
    <nav className="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
      {page > 1 ? (
        <Link href={href(page - 1)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-surface-2">
          <ChevronLeft className="h-4 w-4" /> Prev
        </Link>
      ) : null}
      <span className="px-2 text-sm text-muted">Page {page} of {pageCount}</span>
      {page < pageCount ? (
        <Link href={href(page + 1)} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-2 text-sm hover:bg-surface-2">
          Next <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}
