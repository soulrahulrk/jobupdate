// ─────────────────────────────────────────────────────────────────────────────
// SOURCES — the companies the weekly refresh pulls live jobs from.
//
// HOW TO ADD A COMPANY (one line each):
//   Look at the company's careers URL and read the ATS token:
//     https://boards.greenhouse.io/<token>          -> ats: "greenhouse"
//     https://job-boards.greenhouse.io/<token>       -> ats: "greenhouse"
//     https://jobs.lever.co/<token>                  -> ats: "lever"
//     https://jobs.ashbyhq.com/<token>               -> ats: "ashby"
//     https://<token>.workable.com  (or apply.workable.com/<token>) -> ats: "workable"
//   Then add: { slug, name, ats, token, region, aiRelevance }
//
// The refresh job only ingests AI/ML/Python/data + fresher/graduate/0-1 roles,
// tags region/work-mode/experience automatically, and de-activates roles that
// disappear from the feed. Adding/removing a line here is the whole workflow.
// ─────────────────────────────────────────────────────────────────────────────

export type Ats = "greenhouse" | "lever" | "ashby" | "workable";

export type Source = {
  slug: string; // deterministic company slug in the DB
  name: string;
  ats: Ats;
  token: string; // the ATS account/board token from the careers URL
  region?: "TRICITY" | "NCR" | "METRO" | "REMOTE" | "OTHER";
  website?: string;
  careersUrl?: string;
  aiRelevance?: number;
};

export const sources: Source[] = [
  // ✅ Verified-working examples (real ATS tokens):
  { slug: "agnext", name: "AgNext Technologies", ats: "workable", token: "agnext-technologies", region: "TRICITY", website: "https://agnext.com", careersUrl: "https://apply.workable.com/agnext-technologies/", aiRelevance: 9 },
  { slug: "sarvam-ai", name: "Sarvam AI", ats: "ashby", token: "sarvam", region: "METRO", website: "https://www.sarvam.ai", careersUrl: "https://jobs.ashbyhq.com/sarvam", aiRelevance: 10 },

  // ➕ Add more below — find the token in the company's careers URL:
  // { slug: "fractal-analytics", name: "Fractal Analytics", ats: "greenhouse", token: "fractalanalytics", region: "NCR", aiRelevance: 9 },
  // { slug: "some-startup", name: "Some Startup", ats: "lever", token: "somestartup", region: "METRO", aiRelevance: 8 },
];
