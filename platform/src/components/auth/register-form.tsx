"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { registerUser } from "@/features/auth/actions";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await registerUser(fd);
    if ("error" in res) {
      setError(res.error);
      setLoading(false);
      return;
    }
    await signIn("credentials", {
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      callbackUrl: "/dashboard",
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input name="name" required placeholder="Full name" aria-label="Full name"
        className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary" />
      <input name="email" type="email" required placeholder="Email" aria-label="Email"
        className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary" />
      <input name="password" type="password" required minLength={8} placeholder="Password (min 8 chars)" aria-label="Password"
        className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary" />
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button type="submit" disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-fg disabled:opacity-60">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Create account
      </button>
    </form>
  );
}
