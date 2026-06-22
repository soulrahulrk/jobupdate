import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold">Welcome back</h1>
        <p className="mb-6 mt-1 text-center text-sm text-muted">Sign in to track your applications.</p>
        <div className="card">
          <LoginForm />
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          New here?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
