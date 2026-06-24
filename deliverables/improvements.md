# Product Improvement Review

Reviewed through four lenses — **Founder** (growth/monetization), **Recruiter** (supply side), **Candidate** (demand side), **Product Manager** (execution). Prioritized by business impact.

---

## 🔴 Critical problems (fix first — they cap growth)
1. **No job alerts / email digests.** Without re-engagement, candidates visit once and leave. *Impact: retention, DAU.* → add `SavedSearch` + weekly email (Resend/Postmark).
2. **No recruiter/employer side.** You can't scale supply or monetize; data entry is manual/admin-only. *Impact: revenue, content scale.* → `Role.RECRUITER`, "Post a Job", company claim.
3. **Keyword-only search (`contains`).** Misses relevance, synonyms, typos → poor discovery. *Impact: core UX, SEO.* → Postgres full-text or embeddings (semantic).
4. **No SEO facet/landing pages.** The giants win Google for "ai engineer jobs in bengaluru". You have ~0 indexable long-tail. *Impact: free acquisition.* → generate `/jobs/[role]-[city]` pages from data + `seo_keywords.json`.
5. **Thin/duplicate-risk job data.** Single free-text JD, no structured requirements/benefits → weak pages, weak schema.org. → adopt structured fields (see `database_analysis.md`).

## 🟠 High-impact improvements
6. **AI search bar** (NL → filters) — showcases your AI edge on the homepage.
7. **Semantic recommendations** ("similar to jobs you saved") via embeddings — lifts apply rate.
8. **Company logos + verified badge** (`logoUrl`/`isVerified` exist/needed) — instant trust & polish.
9. **Application autofill + AI cover letter** — reduces friction, increases conversions.
10. **Employer analytics + applicant pipeline** — reuses the `Application` model.
11. **Notifications delivery** (the model exists; add in-app feed + email transport).
12. **Salary insights / company ratings** — Glassdoor-style trust; extend `CompanyComment`.

## 🟢 Quick wins (days, high ROI)
13. **Render `logoUrl`** on job/company cards (field already exists). Use Clearbit/logo.dev fallback by domain.
14. **Add filters already in schema:** employment type, remote toggle, posted-date, salary range UI.
15. **"Actively hiring" badge** from `hiringStatus=CONFIRMED` on cards.
16. **`/jobs` metadata + canonical per filter** (currently thin) → quick SEO.
17. **Empty-state CTAs** ("No results — set a job alert").
18. **Sitemap: add company + facet URLs** (currently jobs only likely).
19. **Open Graph images** per job (dynamic `@vercel/og`) → better social CTR.
20. **Seed real depth** — load `companies_seed.json` + `jobs_seed.json` so the platform looks mature (not a prototype) on first impression.

## Persona summary
- **Founder:** monetize via recruiter self-serve + featured listings; growth via SEO facet pages + alerts.
- **Recruiter:** "I can't post or see applicants" → biggest blocker to a two-sided marketplace.
- **Candidate:** "I can't get notified, search is weak, pages feel thin" → fix alerts + search + logos.
- **PM:** sequence = (1) seed data + logos + facet SEO [quick, compounding], (2) alerts [retention], (3) recruiter portal [revenue], (4) AI search/recommendations [differentiation].

## Suggested 30-day roadmap
- **Wk 1:** load seed data, logos, schema-existing filters, facet landing pages, sitemap/OG. 
- **Wk 2:** SavedSearch + weekly email digest. 
- **Wk 3:** recruiter role + Post-a-Job + applicant view. 
- **Wk 4:** AI search + semantic recommendations.
