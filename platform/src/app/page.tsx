import Link from "next/link";
import { ArrowRight, Brain, Eye, Sparkles, Target } from "lucide-react";

const features = [
  { icon: Brain, title: "GenAI & LLM roles", body: "Curated AI/ML, agentic-AI and LLM positions from verified hirers." },
  { icon: Eye, title: "Computer Vision", body: "ANPR, YOLO and OpenCV roles — the deep-tech niche, in one place." },
  { icon: Target, title: "AI match scoring", body: "See how well each role fits your skills before you apply." },
  { icon: Sparkles, title: "AI resume review", body: "Instant feedback, skill-gap analysis and interview prep." },
];

export default function Home() {
  return (
    <div className="container py-16 md:py-24">
      <section className="mx-auto max-w-3xl text-center animate-fade-in">
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
          <Sparkles className="h-3.5 w-3.5" /> Live · verified data
        </span>
        <h1 className="mt-5 text-balance text-4xl font-extrabold leading-tight md:text-6xl">
          Find your first <span className="gradient-text">AI/ML role</span>, faster.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-pretty text-muted md:text-lg">
          A discovery platform for fresher &amp; graduate-trainee tech jobs — GenAI, Computer Vision and Python — across
          Delhi-NCR, Tricity and Bengaluru. Real companies, real apply links, AI-powered matching.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/jobs" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-primary-fg transition hover:opacity-90">
            Browse jobs <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/login" className="rounded-md border border-border px-5 py-3 font-semibold hover:bg-surface-2">
            Create account
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-4xl gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.title} className="card transition hover:border-primary/50">
            <f.icon className="h-6 w-6 text-accent" />
            <h3 className="mt-3 font-semibold">{f.title}</h3>
            <p className="mt-1 text-sm text-muted">{f.body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
