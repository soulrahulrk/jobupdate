# Website Audit — jobupdate platform

**Audited:** 2026-06-24 · **Method:** source-of-truth review of `platform/` (Next.js 14 App Router) — more complete than a crawl because auth-gated routes are included. **Live:** https://jobupdate-ruddy.vercel.app

---

## 1. Stack
- **Framework:** Next.js 14 (App Router, RSC + Server Actions), React 18, TypeScript.
- **Styling:** Tailwind CSS, `next-themes` (dark/light), custom design tokens.
- **DB/ORM:** PostgreSQL + Prisma 5.
- **Auth:** NextAuth v5 (beta) — Credentials (bcrypt) + Google OAuth; roles `USER` / `ADMIN`; route protection via `middleware.ts`.
- **AI:** Google Gemini (`@google/genai`) — resume review + job-match scoring.
- **Infra:** Vercel hosting, Vercel Blob (resume files), Upstash Redis (rate limiting).
- **SEO:** dynamic `sitemap.ts`, `robots.ts`, JSON-LD on job & company pages, per-page metadata/OpenGraph.

## 2. Route map
| Area | Route | Access | Purpose |
|---|---|---|---|
| Public | `/` | all | Landing/home |
| Public | `/jobs` | all | Job listing + filters + pagination |
| Public | `/jobs/[slug]` | all | Job detail (JSON-LD, Save/Apply/Dismiss, AI match, similar jobs) |
| Public | `/companies/[slug]` | all | Company profile + open roles + candidate-notes (comments) |
| Auth | `/login`, `/register` | guest | Email/password + Google sign-in |
| Candidate | `/dashboard` | USER | Overview + stats |
| Candidate | `/dashboard/saved` | USER | Saved jobs |
| Candidate | `/dashboard/applied` | USER | Applications |
| Candidate | `/dashboard/bookmarks` | USER | Bookmarked companies |
| Candidate | `/dashboard/dismissed` | USER | Cancelled/not-relevant jobs |
| Candidate | `/dashboard/resumes` | USER | Resume upload + AI review |
| Admin | `/admin` | ADMIN | Analytics (counts) |
| Admin | `/admin/jobs`, `/admin/jobs/new`, `/admin/jobs/[id]/edit` | ADMIN | Job CRUD + active toggle |
| Admin | `/admin/companies`, `/admin/companies/new`, `/admin/companies/[id]/edit` | ADMIN | Company CRUD |
| Admin | `/admin/users` | ADMIN | User list + role assignment |
| API | `/api/auth/[...nextauth]` | system | Auth callbacks |
| System | `/sitemap.xml`, `/robots.txt` | crawlers | SEO |

## 3. Features (implemented)
**Candidate:** browse/search jobs, filters, save, mark applied (+ status), bookmark companies, dismiss/cancel jobs (leaves board), resume upload (Vercel Blob) with **AI resume review**, **AI job-match score** vs resume, company candidate-notes (comments), dashboard stats.
**Admin:** RBAC, analytics counts, full **Job CRUD** + activate/deactivate, full **Company CRUD**, user role management.
**Discovery:** "Quick role search" — generates live, newest-first LinkedIn/Naukri/Indeed/Internshala deep-links per role + selected region.
**Data integrity:** Zod validation, rate limiting on mutating actions, idempotent seed (`prisma/seed.ts`), automated weekly ATS refresh (`scripts/refresh-jobs.ts`).

## 4. Filters & taxonomy (`/jobs`)
- **Search (`q`):** title, skills, company name.
- **Region:** TRICITY · NCR · METRO · REMOTE · OTHER.
- **Work mode:** ONSITE · HYBRID · REMOTE.
- **Experience:** FRESHER · ZERO_ONE · ONE_TWO · TWO_PLUS.
- **Salary:** `salaryMin` (≥).
- **Fresher-only** toggle (`isFresher`).
- **Sort:** newest (`postedAt`) · salary.
- **Pagination:** `PAGE_SIZE` server-side.
- **Hiring status** (company): CONFIRMED · PROGRAM · VERIFY · CLOSED · UNKNOWN.

## 5. Gaps found during audit (detail in `improvements.md`)
1. **No public job filters for: employment type, industry, tech stack, posted-date, company size, salary *range* (only min).**
2. **No full-text relevance search / typo tolerance** (uses `contains`).
3. **No recruiter role/portal** — only ADMIN vs USER; no employer self-serve posting, applicant pipeline, or company-claim flow.
4. **No application tracking for recruiters** (Application model exists but no employer view).
5. **No email/notification delivery** — `Notification` model exists but no transport (email/in-app feed).
6. **No saved searches / job alerts.**
7. **No company logos rendered** (`logoUrl` field exists, unused in UI).
8. **No structured job description** (single text field; no responsibilities/requirements/benefits separation).
9. **Limited SEO surface** — no `/jobs` facet landing pages (e.g., `/jobs/ai-engineer-bengaluru`), no blog, thin metadata on list pages.
10. **No analytics events** (views, apply-clicks, conversion) beyond raw counts.

## 6. Accessibility & quality
- Semantic buttons with `aria-pressed`, keyboard-focusable; dark/light theme; responsive grid. Tests present (`*.test.ts` via Vitest). **Recommend:** add e2e (Playwright — `puppeteer` now in devDeps), Lighthouse CI, and per-route metadata coverage.
