import type { ResumeReview } from "@/lib/ai";
import { Badge } from "@/components/ui/badge";

function List({ title, items, color }: { title: string; items: string[]; color: "success" | "warning" | "primary" | "accent" }) {
  if (!items?.length) return null;
  return (
    <div className="mt-3">
      <h4 className="text-xs font-bold uppercase tracking-wide text-muted">{title}</h4>
      <ul className="mt-1 space-y-1">
        {items.map((s, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <Badge variant={color} className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full p-0" />
            <span>{s}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ReviewCard({ review }: { review: ResumeReview }) {
  return (
    <div className="mt-3 rounded-lg border border-border bg-bg/40 p-4">
      <div className="flex items-center gap-3">
        <div className="text-3xl font-extrabold gradient-text">{review.score}<span className="text-base text-muted">/100</span></div>
        <p className="text-sm text-muted">{review.summary}</p>
      </div>
      <List title="Strengths" items={review.strengths} color="success" />
      <List title="Gaps" items={review.gaps} color="warning" />
      <List title="Suggestions" items={review.suggestions} color="primary" />
      {review.atsKeywords?.length ? (
        <div className="mt-3">
          <h4 className="text-xs font-bold uppercase tracking-wide text-muted">ATS keywords to add</h4>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {review.atsKeywords.map((k) => <span key={k} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs">{k}</span>)}
          </div>
        </div>
      ) : null}
    </div>
  );
}
