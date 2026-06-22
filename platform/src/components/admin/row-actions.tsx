"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Loader2, Pencil, Power, Trash2 } from "lucide-react";
import { toggleJobActive, deleteJob, setUserRole } from "@/features/admin/actions";

export function JobRowActions({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link href={`/admin/jobs/${id}/edit`} className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-ink" title="Edit">
        <Pencil className="h-4 w-4" />
      </Link>
      <button onClick={() => start(() => toggleJobActive(id))} disabled={pending}
        className="rounded-md p-1.5 text-muted hover:bg-surface-2 hover:text-ink" title={active ? "Deactivate" : "Activate"}>
        <Power className={active ? "h-4 w-4 text-success" : "h-4 w-4"} />
      </button>
      <button onClick={() => confirm("Delete this job?") && start(() => deleteJob(id))} disabled={pending}
        className="rounded-md p-1.5 text-muted hover:bg-danger/10 hover:text-danger" title="Delete">
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function UserRoleToggle({ id, role }: { id: string; role: "USER" | "ADMIN" }) {
  const [pending, start] = useTransition();
  return (
    <button
      onClick={() => start(() => setUserRole(id, role === "ADMIN" ? "USER" : "ADMIN"))}
      disabled={pending}
      className="rounded-md border border-border px-2.5 py-1 text-xs font-semibold hover:bg-surface-2 disabled:opacity-60"
    >
      {pending ? "…" : role === "ADMIN" ? "Demote to user" : "Make admin"}
    </button>
  );
}
