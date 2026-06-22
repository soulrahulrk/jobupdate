"use client";

import { useCallback, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

const SELECTS = [
  { name: "region", label: "All regions", options: [["TRICITY", "Tricity"], ["NCR", "Delhi-NCR"], ["METRO", "Metro"], ["REMOTE", "Remote"]] },
  { name: "workMode", label: "Any mode", options: [["ONSITE", "Onsite"], ["HYBRID", "Hybrid"], ["REMOTE", "Remote"]] },
  { name: "experience", label: "Any experience", options: [["FRESHER", "Fresher"], ["ZERO_ONE", "0–1 yr"], ["ONE_TWO", "1–2 yr"]] },
  { name: "sort", label: "Newest", options: [["recent", "Newest"], ["salary", "Highest salary"]] },
] as const;

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [pending, start] = useTransition();

  const update = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(key, value);
      else next.delete(key);
      next.delete("page"); // reset pagination on filter change
      start(() => router.push(`${pathname}?${next.toString()}`, { scroll: false }));
    },
    [params, pathname, router]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[220px] flex-1">
        {pending ? (
          <Loader2 className="absolute left-3 top-2.5 h-4 w-4 animate-spin text-muted" />
        ) : (
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted" />
        )}
        <input
          defaultValue={params.get("q") ?? ""}
          placeholder="Search role, skill, or company…"
          onKeyDown={(e) => e.key === "Enter" && update("q", (e.target as HTMLInputElement).value)}
          className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm outline-none focus:border-primary"
        />
      </div>
      {SELECTS.map((s) => (
        <select
          key={s.name}
          defaultValue={params.get(s.name) ?? ""}
          onChange={(e) => update(s.name, e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">{s.label}</option>
          {s.options.map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      ))}
      <label className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-2 text-sm">
        <input
          type="checkbox"
          defaultChecked={params.get("fresher") === "true"}
          onChange={(e) => update("fresher", e.target.checked ? "true" : "")}
          className="accent-primary"
        />
        Freshers only
      </label>
    </div>
  );
}
