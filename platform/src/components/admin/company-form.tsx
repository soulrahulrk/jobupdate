"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { upsertCompany, type FormResult } from "@/features/admin/actions";

type CompanyInput = {
  id?: string; name?: string; region?: string; city?: string | null;
  website?: string | null; careersUrl?: string | null; industries?: string[];
  techStack?: string[]; hiringStatus?: string; aiRelevance?: number | null;
  phone?: string | null; hrEmail?: string | null; linkedinUrl?: string | null;
};

const input = "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary";

export function CompanyForm({ company }: { company?: CompanyInput }) {
  const [state, action] = useFormState<FormResult | null, FormData>(upsertCompany, null);
  const router = useRouter();
  useEffect(() => {
    if (state && "ok" in state && state.ok) router.push("/admin/companies");
  }, [state, router]);

  return (
    <form action={action} className="max-w-xl space-y-3">
      {company?.id ? <input type="hidden" name="id" defaultValue={company.id} /> : null}
      <input name="name" className={input} placeholder="Company name" defaultValue={company?.name} required />
      <div className="grid grid-cols-2 gap-2">
        <select name="region" className={input} defaultValue={company?.region ?? "NCR"}>
          {["TRICITY", "NCR", "METRO", "REMOTE", "OTHER"].map((v) => <option key={v}>{v}</option>)}
        </select>
        <select name="hiringStatus" className={input} defaultValue={company?.hiringStatus ?? "CONFIRMED"}>
          {["CONFIRMED", "PROGRAM", "VERIFY", "CLOSED", "UNKNOWN"].map((v) => <option key={v}>{v}</option>)}
        </select>
      </div>
      <input name="city" className={input} placeholder="City (e.g. Noida (Sec 62))" defaultValue={company?.city ?? ""} />
      <input name="industries" className={input} placeholder="Industries (comma separated)" defaultValue={company?.industries?.join(", ")} />
      <input name="techStack" className={input} placeholder="Tech stack (comma separated)" defaultValue={company?.techStack?.join(", ")} />
      <div className="grid grid-cols-2 gap-2">
        <input name="website" type="url" className={input} placeholder="Website URL" defaultValue={company?.website ?? ""} />
        <input name="careersUrl" type="url" className={input} placeholder="Careers URL" defaultValue={company?.careersUrl ?? ""} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <input name="aiRelevance" type="number" min={0} max={10} className={input} placeholder="AI score 0-10" defaultValue={company?.aiRelevance ?? ""} />
        <input name="phone" className={input} placeholder="Phone" defaultValue={company?.phone ?? ""} />
        <input name="hrEmail" type="email" className={input} placeholder="HR email" defaultValue={company?.hrEmail ?? ""} />
      </div>
      <input name="linkedinUrl" type="url" className={input} placeholder="LinkedIn URL" defaultValue={company?.linkedinUrl ?? ""} />
      {state && "error" in state ? <p className="text-sm text-danger">{state.error}</p> : null}
      <SubmitButton editing={!!company?.id} />
    </form>
  );
}

function SubmitButton({ editing }: { editing: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}
      className="rounded-md bg-primary px-5 py-2.5 font-semibold text-primary-fg disabled:opacity-60">
      {pending ? "Saving…" : editing ? "Update company" : "Create company"}
    </button>
  );
}
