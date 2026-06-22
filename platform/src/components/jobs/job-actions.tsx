"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Check, Plus, Loader2 } from "lucide-react";
import { toggleSavedJob, setApplied, removeApplication } from "@/features/jobs/actions";
import { cn } from "@/lib/utils";

function useAction() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const run = (fn: () => Promise<void>) =>
    start(async () => {
      try {
        await fn();
      } catch (e) {
        if (e instanceof Error && e.message === "UNAUTHENTICATED") router.push("/login");
      }
    });
  return { pending, run };
}

export function SaveButton({ jobId, initialSaved }: { jobId: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved);
  const { pending, run } = useAction();
  return (
    <button
      onClick={() => run(async () => setSaved((await toggleSavedJob(jobId)).saved))}
      disabled={pending}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-4 py-3 font-semibold transition",
        saved ? "border-primary/50 bg-primary/10 text-primary" : "border-border hover:bg-surface-2"
      )}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saved" : "Save"}
    </button>
  );
}

export function AppliedButton({ jobId, initialApplied }: { jobId: string; initialApplied: boolean }) {
  const [applied, setAppliedState] = useState(initialApplied);
  const { pending, run } = useAction();
  return (
    <button
      onClick={() =>
        run(async () => {
          if (applied) { await removeApplication(jobId); setAppliedState(false); }
          else { await setApplied(jobId); setAppliedState(true); }
        })
      }
      disabled={pending}
      aria-pressed={applied}
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-4 py-3 font-semibold transition",
        applied ? "border-success/50 bg-success/10 text-success" : "border-border hover:bg-surface-2"
      )}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : applied ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {applied ? "Applied" : "Mark applied"}
    </button>
  );
}
