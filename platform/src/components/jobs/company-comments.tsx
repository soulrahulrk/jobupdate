"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { addCompanyComment, deleteCompanyComment } from "@/features/jobs/actions";

type CommentItem = {
  id: string;
  body: string;
  createdAt: string | Date;
  userId: string;
  user: { name: string | null };
};

export function CompanyComments({
  companyId,
  comments,
  currentUserId,
}: {
  companyId: string;
  comments: CommentItem[];
  currentUserId?: string;
}) {
  const [body, setBody] = useState("");
  const [pending, start] = useTransition();
  const router = useRouter();

  function submit() {
    const text = body.trim();
    if (!text) return;
    start(async () => {
      try {
        await addCompanyComment(companyId, text);
        setBody("");
        router.refresh();
      } catch (e) {
        if (e instanceof Error && e.message === "UNAUTHENTICATED") router.push("/login");
      }
    });
  }

  function remove(id: string) {
    start(async () => {
      try {
        await deleteCompanyComment(id);
        router.refresh();
      } catch {
        /* ignore */
      }
    });
  }

  return (
    <section className="mt-10">
      <h2 className="text-lg font-bold">Candidate notes ({comments.length})</h2>
      <p className="mb-3 mt-1 text-xs text-muted">
        Share what you know — interview process, fresher-friendliness, work culture, salary. Helps other applicants and trains the AI.
      </p>

      <div className="flex flex-col gap-2">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="Add a note about this company…"
          className="w-full rounded-md border border-border bg-surface-2 p-3 text-sm outline-none focus:border-primary"
        />
        <button
          onClick={submit}
          disabled={pending || !body.trim()}
          className="inline-flex items-center gap-2 self-end rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-fg transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Post note
        </button>
      </div>

      <ul className="mt-5 flex flex-col gap-3">
        {comments.map((c) => (
          <li key={c.id} className="card">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold">{c.user.name ?? "User"}</span>
              <span className="text-xs text-muted">{new Date(c.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="mt-1 whitespace-pre-line text-sm text-muted">{c.body}</p>
            {currentUserId && c.userId === currentUserId ? (
              <button
                onClick={() => remove(c.id)}
                className="mt-2 inline-flex items-center gap-1 text-xs text-muted transition hover:text-ink"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
