# Tricity Fresher Hiring Database — B.Tech CSE (AI/ML), June 2026

Built for 6 fresher job-seekers targeting Chandigarh, Mohali, Panchkula, Zirakpur, Kharar, Derabassi and surrounding Punjab/Haryana IT clusters.

## What's in here

| File | Deliverable | Status |
|---|---|---|
| [data/01_recruitment_agencies.csv](data/01_recruitment_agencies.csv) | D1: Recruitment agencies | 35 real, sourced agencies (27 Tricity + 8 Delhi-NCR), most with phone numbers |
| [data/02_companies.csv](data/02_companies.csv) | D2: Companies hiring | 95 real, sourced companies (64 Tricity + 20 NCR enterprises + 11 mid-size NCR product startups) |
| [data/10_paid_training_placement_programs.md](data/10_paid_training_placement_programs.md) | Fee-based options | Honest assessment of paid training/placement programs + scam-avoidance checklist |
| [data/03_active_openings.csv](data/03_active_openings.csv) | D3: Active openings | 2 real findings + live search-link toolkit for all 16 roles (refreshes daily, never goes stale) |
| [data/04_recruiter_search_toolkit.md](data/04_recruiter_search_toolkit.md) | D4: Recruiters/HR/TA | Search-string toolkit per named company (not a scraped 300-person list — see scope note) |
| [data/05_walkin_visit_plan.md](data/05_walkin_visit_plan.md) | D5: Walk-in routes | 3-day route plan from real addresses, clustered by area |
| [data/06_events_job_fairs.csv](data/06_events_job_fairs.csv) | D6: Events/job fairs | 6 confirmed live meetups (June 2026) + monitoring sources |
| [data/07_job_communities.csv](data/07_job_communities.csv) | D7: Job communities | Verified communities + scam-avoidance notes |
| [data/08_30day_execution_plan.md](data/08_30day_execution_plan.md) | D8: 30-day plan | Full daily/weekly plan with KPIs |
| [data/09_rankings.md](data/09_rankings.md) | D9: Rankings | Top 15 agencies, Top 28 companies ranked |

D10 (structured tables) = all of the above are CSV/Markdown tables, ready to paste into a spreadsheet.

## Scope note — read this before relying on the numbers

The original brief asked for 100 agencies, 200 companies, 300 named recruiters, live June-2026 job postings with hiring-manager names, and Google-Maps-optimized routes with travel times. After testing, several of these targets aren't achievable **without fabricating data**:

- **Phone/WhatsApp numbers, named contacts, ratings for 100 agencies**: most agencies don't publish this. What's in 01 is everything verifiable today, with source URLs.
- **HR/recruitment emails for 200 companies**: almost none are publicly listed; companies route hiring through ATS portals (linked in the Careers Page column).
- **300 named recruiters with LinkedIn URLs**: building this as a static scrape is a mass people-search exercise we won't do. The toolkit in 04 lets each person generate this themselves, which also gets better (personalized) results.
- **Live job postings with deadlines/hiring managers**: these change hourly. 03 instead gives live search links per role/portal that always show current results.
- **Maps travel times**: 05 sequences real addresses by geographic cluster; exact times need a live Maps query on the day of travel.

## Verification log

| Date | What was verified | Method |
|---|---|---|
| 2026-06-11 | All entries in 01, 02, 06, 07 | Web search + page fetches, source URL recorded per row |
| 2026-06-11 | Search-link formats in 03, 04 | Based on observed live URL patterns from Naukri/Indeed/LinkedIn/Internshala search results |
| 2026-06-14 | 7 new agencies added to 01 (now 27 Tricity), 6 new companies added to 02 (now 64 Tricity), 4 new active openings added to 03 | Web search + page fetches, source URL recorded per row |
| 2026-06-14 | Delhi-NCR expansion: 8 NCR agencies added to 01 (now 35 total, most with phone numbers), 20 NCR companies added to 02 (now 84 total). Phone numbers surfaced in both the Tricity database HTML and the interactive Hiring_Dashboard.html (clickable tel: links + a "call agencies directly" panel). | Web search + page fetches; blog/directory-sourced phone numbers flagged "verify" |
| 2026-06-14 | 11 mid-size NCR product startups added to 02 (now 95 total) — IndiaMART, Info Edge, PhysicsWallah, Innovaccer, Cars24, Urban Company, MobiKwik, Lenskart, Delhivery, Cvent, Pristyn Care; corporate phones included where published. | Web search + page fetches, source URL recorded per row |

## Recommended next steps

1. Each person picks 1-2 areas from [05_walkin_visit_plan.md](data/05_walkin_visit_plan.md) and **calls ahead** before visiting.
2. Start Week 1 of [08_30day_execution_plan.md](data/08_30day_execution_plan.md) immediately — don't wait for the database to be "complete."
3. As responses come in, add an "Actual Response" column to 01/02 and feed back into [09_rankings.md](data/09_rankings.md).
4. Periodically re-run the searches in 02/06 to expand the company list toward 200 — each new verified entry should include a source URL and date, same format as the existing rows.
