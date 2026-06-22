"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { uploadResume } from "@/features/resume/actions";

export function ResumeUploader() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await uploadResume(new FormData(e.currentTarget));
    setLoading(false);
    if ("error" in res) setError(res.error);
    else formRef.current?.reset();
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="card flex flex-wrap items-center gap-3">
      <input name="file" type="file" accept="application/pdf" required className="text-sm text-muted file:mr-3 file:rounded-md file:border-0 file:bg-surface-2 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-ink" />
      <button type="submit" disabled={loading}
        className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-fg disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} Upload PDF
      </button>
      {error ? <p className="w-full text-sm text-danger">{error}</p> : null}
    </form>
  );
}
