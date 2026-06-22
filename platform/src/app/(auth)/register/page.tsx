import type { Metadata } from "next";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-10">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold">Create your account</h1>
        <p className="mb-6 mt-1 text-center text-sm text-muted">Save jobs, track applications, get AI feedback.</p>
        <div className="card">
          <RegisterForm />
        </div>
        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
