"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2 } from "lucide-react";
import { runJobMatch } from "@/features/resume/actions";
import type { JobMatch } from "@/lib/ai";
import { Badge } from "@/components/ui/badge";

export function MatchButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [m, setM] = useState<JobMatch | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="mt-6">
      {!m ? (
        <button
          onClick={() =>
            start(async () => {
              setError(null);
              try {
                setM(await runJobMatch(jobId));
              } catch (e) {
                if (e instanceof Error && e.message === "UNAUTHENTICATED") router.push("/login");
                else setError("Couldn't run the match — set a primary résumé in your dashboard first.");
              }
            })
          }
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-md border border-primary/50 bg-primary/10 px-4 py-2.5 font-semibold text-primary disabled:opacity-60"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} AI match score
        </button>
      ) : null}
      {error ? <p className="mt-2 text-sm text-danger">{error}</p> : null}
      {m ? (
        <div className="mt-2 rounded-lg border border-border bg-bg/40 p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl font-extrabold gradient-text">{m.score}<span className="text-base text-muted">/100</span></div>
            <p className="text-sm text-muted">{m.verdict}</p>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-muted">You have</h4>
              <div className="mt-1 flex flex-wrap gap-1.5">{m.matchedSkills.map((s) => <Badge key={s} variant="success">{s}</Badge>)}</div>
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-muted">Skill gaps</h4>
              <div className="mt-1 flex flex-wrap gap-1.5">{m.missingSkills.map((s) => <Badge key={s} variant="warning">{s}</Badge>)}</div>
            </div>
          </div>
          <h4 className="mt-4 text-xs font-bold uppercase tracking-wide text-muted">Likely interview questions</h4>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{m.interviewQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul>
          <h4 className="mt-3 text-xs font-bold uppercase tracking-wide text-muted">Prep tips</h4>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">{m.prepTips.map((t, i) => <li key={i}>{t}</li>)}</ul>
        </div>
      ) : null}
    </div>
  );
}
