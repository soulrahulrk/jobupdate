"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: String(fd.get("email")),
      password: String(fd.get("password")),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) setError("Invalid email or password.");
    else router.push("/dashboard");
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
        className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface py-2.5 font-semibold hover:bg-surface-2"
      >
        <span className="text-lg">G</span> Continue with Google
      </button>
      <div className="flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <input name="email" type="email" required placeholder="Email" aria-label="Email"
          className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary" />
        <input name="password" type="password" required placeholder="Password" aria-label="Password"
          className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary" />
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <button type="submit" disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 font-semibold text-primary-fg disabled:opacity-60">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Sign in
        </button>
      </form>
    </div>
  );
}
