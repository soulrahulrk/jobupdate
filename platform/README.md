# Tech Job Discovery Platform

Production rebuild of the Fresher Hiring Hub — Next.js 14 (App Router) · TypeScript · PostgreSQL (Neon) · Prisma · Auth.js · Tailwind.

> Lives in `platform/` on the `next-rebuild` branch. The original static site on `main` stays live until this is ready to cut over.

## Stack
| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router, Server Actions + Route Handlers |
| Language | TypeScript (strict) |
| DB | Neon Postgres + Prisma ORM |
| Auth | Auth.js v5 (Google + email/password), JWT sessions, RBAC |
| Validation | Zod | 
| Rate limit | Upstash Redis |
| Files | Vercel Blob (resumes) |
| AI | Google Gemini (resume review, match score, skill-gap) |
| UI | Tailwind + Radix/shadcn-style primitives, dark mode |

## Local setup
```bash
cd platform
cp .env.example .env        # fill DATABASE_URL (Neon), AUTH_SECRET, Google creds
npm install
npm run db:push             # create tables
npm run db:seed             # migrate curated companies + jobs
npm run dev                 # http://localhost:3000
```

## Roadmap
- [x] Phase 0 — Foundation (config, schema, db, auth skeleton, tokens, seed)
- [ ] Phase 1 — Job board (search/filter/sort/paginate, job + company pages)
- [ ] Phase 2 — Auth + user dashboard (saved/applied/bookmarks)
- [ ] Phase 3 — Admin (CRUD + analytics)
- [ ] Phase 4 — Resume + AI features
- [ ] Phase 5 — Polish (a11y, Lighthouse > 95, tests)
