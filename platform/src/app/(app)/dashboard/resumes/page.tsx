import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ResumeUploader } from "@/components/resume/resume-uploader";
import { ResumeList } from "@/components/resume/resume-list";
import type { ResumeReview } from "@/lib/ai";

export const metadata: Metadata = { title: "Resumes & AI review" };

export default async function ResumesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const resumes = await db.resume.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, fileName: true, isPrimary: true, aiReview: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold">Resumes &amp; AI review</h1>
      <p className="mb-4 text-sm text-muted">Upload your résumé (PDF) for instant AI feedback, then run a match score on any job.</p>
      <ResumeUploader />
      <ResumeList resumes={resumes.map((r) => ({ ...r, aiReview: (r.aiReview as ResumeReview | null) }))} />
    </div>
  );
}
