# Database Analysis — schema, gaps, recommendations

**Source:** `platform/prisma/schema.prisma` (PostgreSQL). Reverse-engineered from the live models — not assumed.

---

## 1. Current schema (entities)
| Model | Key fields |
|---|---|
| **User** | id, name, email, passwordHash, image, role(USER/ADMIN), headline, location, skills[] |
| **Company** | id, slug, name, description, website, careersUrl, **logoUrl**, region, city, sizeRange, industries[], techStack[], hiringStatus, aiRelevance, phone, hrEmail, linkedinUrl, verifiedAt |
| **Job** | id, slug, title, companyId, description, skills[], workMode, region, location, experience, salaryMin, salaryMax, applyUrl, hrEmail, isFresher, isActive, postedAt, expiresAt, source |
| **Application** | userId, jobId, status(SAVED/APPLIED/INTERVIEW/OFFER/REJECTED), notes, appliedAt |
| **SavedJob / Bookmark / DismissedJob** | user↔job / user↔company join tables |
| **CompanyComment** | userId, companyId, body — candidate notes |
| **Resume** | userId, fileUrl, fileName, parsedText, aiReview(Json), isPrimary |
| **Notification** | userId, type, title, body, link, read |
| **Enums** | Role, WorkMode, Region, ExperienceLevel, ApplicationStatus, HiringStatus, NotificationType |

**Strengths:** clean relations, good indexes (`region,isFresher,isActive`), array fields for skills/industries/techStack, soft-delete via `isActive`, dedupe-friendly unique `slug`, audit `verifiedAt`/`source`.

## 2. Missing fields vs a modern job portal

### Job (high value)
| Field | Type | Why |
|---|---|---|
| `employmentType` | enum (FULL_TIME, INTERNSHIP, CONTRACT, PART_TIME, PPO) | Core filter; currently inferred from title only |
| `salaryPeriod` + `currency` | enum / string | Disambiguate stipend vs CTC; INR default |
| `responsibilities` / `requirements` / `benefits` | String[] | Structured JD → better UX + SEO + parsing |
| `openings` | Int | "3 positions" |
| `applicationDeadline` | DateTime | distinct from `expiresAt` |
| `views` / `applyClicks` | Int | analytics & ranking |
| `postedByUserId` | FK→User | recruiter ownership (see §4) |
| `seoTitle` / `seoDescription` | String | per-job meta override |

### Company (high value)
| Field | Type | Why |
|---|---|---|
| `foundedYear` | Int | profile completeness |
| `employeeCount` | Int (parsed from sizeRange) | sortable/filterable |
| `headquarters` | String | distinct from operating `city` |
| `internshipAvailable` / `remoteAvailable` | Boolean | facet filters |
| `benefits` | String[] | profile + SEO |
| `descriptionLong` | Text | the schema has one `description`; add short/long split |
| `seoTitle`/`seoDescription`/`seoKeywords[]` | String/String[] | company landing SEO |
| `crunchbaseUrl`/`glassdoorUrl` | String | trust signals |
| `claimedByUserId` | FK | company-claim flow |
| `isVerified` | Boolean | trust badge |

### New models to add
- **`Recruiter` / `EmployerProfile`** (or `User.role = RECRUITER` + `companyId`) → employer portal.
- **`SavedSearch`** (userId, query JSON, alertFrequency) → job alerts.
- **`JobAlert` / `AlertDelivery`** → email digests.
- **`AnalyticsEvent`** (type, jobId?, userId?, meta) → product analytics.
- **`Skill`** (canonical) + `JobSkill`/`CompanySkill` → normalized skills, autocomplete, SEO facets. *(Optional — arrays work for now.)*
- **`BlogPost`** (slug, title, body, tags[], seo…) → content/SEO engine.

## 3. Enum additions
- `Role`: add **`RECRUITER`**.
- New `EmploymentType`: FULL_TIME, INTERNSHIP, CONTRACT, PART_TIME, PPO, TRAINEE.
- `ExperienceLevel`: fine as-is.

## 4. Recommended migration order (low-risk → high-value)
1. **Job**: `employmentType`, `responsibilities[]`, `requirements[]`, `benefits[]`, `openings`, `applicationDeadline`, `views`, `applyClicks`, `currency`, `salaryPeriod`. *(additive, nullable/defaults → safe `prisma migrate`)*
2. **Company**: `foundedYear`, `employeeCount`, `headquarters`, `internshipAvailable`, `remoteAvailable`, `benefits[]`, `descriptionLong`, `seoTitle`, `seoDescription`, `seoKeywords[]`, `crunchbaseUrl`, `glassdoorUrl`, `isVerified`.
3. **Role.RECRUITER** + `User.companyId` + `Job.postedByUserId` → unlock employer portal.
4. **SavedSearch** + **AnalyticsEvent** + **BlogPost**.

## 5. Mapping note for the generated seed files
`companies_seed.json` / `jobs_seed.json` in this folder use a **superset schema** (the fields a mature portal needs). A provided loader (`scripts/load-seed-data.ts`) maps them down to the *current* Prisma schema (extra fields stored where they fit; the rest ready for the migration above). All inferred facts are labeled `"assumed": true` where applicable.
