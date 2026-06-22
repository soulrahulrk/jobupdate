"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { upsertJob, type FormResult } from "@/features/admin/actions";

type JobInput = {
  id?: string; title?: string; companyId?: string; description?: string | null;
  skills?: string[]; workMode?: string; region?: string; location?: string | null;
  experience?: string; salaryMin?: number | null; salaryMax?: number | null; applyUrl?: string | null;
};

const input = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

export function JobForm({ companies, job }: { companies: { id: string; name: string }[]; job?: JobInput }) {
  const [state, action] = useFormState<FormResult | null, FormData>(upsertJob, null);
  const router = useRouter();
  useEffect(() => {
    if (state && "ok" in state && state.ok) router.push("/admin/jobs");
  }, [state, router]);

  return (
    <form action={action} className="max-w-xl space-y-3">
      {job?.id ? <input type="hidden" name="id" defaultValue={job.id} /> : null}
      <input name="title" className={input} placeholder="Job title" defaultValue={job?.title} required />
      <select name="companyId" className={input} defaultValue={job?.companyId ?? ""} required>
        <option value="">Select company…</option>
        {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <textarea name="description" className={input} rows={4} placeholder="Description" defaultValue={job?.description ?? ""} />
      <input name="skills" className={input} placeholder="Skills (comma separated)" defaultValue={job?.skills?.join(", ")} />
      <div className="grid grid-cols-3 gap-2">
        <select name="workMode" className={input} defaultValue={job?.workMode ?? "ONSITE"}>
          {["ONSITE", "HYBRID", "REMOTE"].map((v) => <option key={v}>{v}</option>)}
        </select>
        <select name="region" className={input} defaultValue={job?.region ?? "NCR"}>
          {["TRICITY", "NCR", "METRO", "REMOTE", "OTHER"].map((v) => <option key={v}>{v}</option>)}
        </select>
        <select name="experience" className={input} defaultValue={job?.experience ?? "FRESHER"}>
          {["FRESHER", "ZERO_ONE", "ONE_TWO", "TWO_PLUS"].map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>
      <input name="location" className={input} placeholder="Location" defaultValue={job?.location ?? ""} />
      <div className="grid grid-cols-2 gap-2">
        <input name="salaryMin" type="number" className={input} placeholder="Salary min (₹/yr)" defaultValue={job?.salaryMin ?? ""} />
        <input name="salaryMax" type="number" className={input} placeholder="Salary max (₹/yr)" defaultValue={job?.salaryMax ?? ""} />
      </div>
      <input name="applyUrl" type="url" className={input} placeholder="Apply URL" defaultValue={job?.applyUrl ?? ""} />
      {state && "error" in state ? <p className="text-sm text-danger">{state.error}</p> : null}
      <SubmitButton editing={!!job?.id} />
    </form>
  );
}

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-fg disabled:opacity-60">
      {pending ? "Saving…" : editing ? "Update job" : "Create job"}
    </button>
  );
}
