"use client";

import { useState, useTransition } from "react";
import { FileText, Loader2, Sparkles, Star, Trash2 } from "lucide-react";
import { runResumeReview, deleteResume, setPrimaryResume } from "@/features/resume/actions";
import type { ResumeReview } from "@/lib/ai";
import { ReviewCard } from "@/components/resume/review-card";
import { Badge } from "@/components/ui/badge";

type Item = { id: string; fileName: string; isPrimary: boolean; aiReview: ResumeReview | null };

export function ResumeList({ resumes }: { resumes: Item[] }) {
  const [reviews, setReviews] = useState<Record<string, ResumeReview>>(
    Object.fromEntries(resumes.filter((r) => r.aiReview).map((r) => [r.id, r.aiReview as ResumeReview]))
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [, start] = useTransition();

  if (!resumes.length) return <p className="mt-4 text-sm text-muted">No resumes yet — upload a PDF above to get an AI review.</p>;

  return (
    <div className="mt-4 space-y-4">
      {resumes.map((r) => (
        <div key={r.id} className="card">
          <div className="flex flex-wrap items-center gap-2">
            <FileText className="h-4 w-4 text-muted" />
            <span className="font-semibold">{r.fileName}</span>
            {r.isPrimary ? <Badge variant="primary">Primary</Badge> : null}
            <div className="ml-auto flex gap-1.5">
              <button
                onClick={async () => { setBusy(r.id); try { setReviews((p) => ({ ...p, [r.id]: await runResumeReview(r.id) })); } finally { setBusy(null); } }}
                disabled={busy === r.id}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-fg disabled:opacity-60">
                {busy === r.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />} AI review
              </button>
              {!r.isPrimary ? (
                <button onClick={() => start(() => setPrimaryResume(r.id))} className="rounded-md border border-border p-1.5 text-muted hover:text-ink" title="Set primary">
                  <Star className="h-4 w-4" />
                </button>
              ) : null}
              <button onClick={() => confirm("Delete this resume?") && start(() => deleteResume(r.id))} className="rounded-md border border-border p-1.5 text-muted hover:text-danger" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {reviews[r.id] ? <ReviewCard review={reviews[r.id]} /> : null}
        </div>
      ))}
    </div>
  );
}
