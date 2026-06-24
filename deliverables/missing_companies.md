# Missing Companies — gap analysis

**Method:** compared the **30 companies currently in your DB** against the **56 in `companies_seed.json`** and the broader industry. Below are the **41 companies not yet in your DB**, ranked by how much they'd strengthen the platform for your AI/ML-fresher audience (fresher-friendliness × AI relevance × hiring volume × brand/SEO value).

> Already in DB (not repeated): AgNext, CrossML, Endoenergy, Impressico, Innovaccer, ORI, Sarvam, Soft Radix, Spyne, Vehant, Voxomos, XenonStack, AAPNA, Affine, Appnox, Fractal, Gram Vaani, Grazitti, HPE, Incture, Mad Street Den, Mu Sigma, Newgen, Relinns, SigTuple, Tiger Analytics, Valiance, Mobile Programming, XLSCOUT.

---

## 🔴 HIGHEST PRIORITY (add first)
*High fresher/grad intake in India + strong AI/data + SEO brand pull.*

| Company | Why add |
|---|---|
| **Freshworks** | Public SaaS, large Chennai grad program — high fresher volume + brand. |
| **Zoho** | Massive, hires/ trains freshers from non-metro India — perfect for your audience. |
| **Razorpay** | Top fintech, active SDE/ML hiring + interns — huge candidate demand. |
| **Groww** | Fast-growing fintech, strong fresher SDE intake in Bengaluru. |
| **MongoDB** | Gurugram (NCR) grad hiring, database+AI brand — fills NCR depth. |
| **Databricks** | Data+AI lakehouse, Bengaluru new-grad roles — premium AI brand. |
| **Atlassian** | "Team Anywhere" remote + Bengaluru R&D + grad program — remote *and* India. |
| **Quantiphi** | Applied AI/GenAI + cloud, active early-career ML tracks. |
| **Yellow.ai** | Conversational AI/LLM, hires NLP engineers + interns. |
| **PhysicsWallah** | EdTech unicorn (Noida/NCR), rapid SDE hiring. |
| **Postman** | Elite dev-tools brand (Bengaluru), intern + new-grad pull. |
| **CloudSEK** | AI cybersecurity, actively hires AI/ML freshers — covers cyber niche. |
| **Qure.ai** | Medical-imaging CV/AI — strong for your computer-vision candidates. |

## 🟠 MEDIUM PRIORITY
*Solid AI/data or remote employers; more selective or smaller intake.*

| Company | Why add |
|---|---|
| **Darwinbox** | HR SaaS unicorn (Hyderabad), good SDE volume. |
| **MoEngage** | MarTech + big-data/ML roles. |
| **BrowserStack** | Dev-tools at scale, active hiring. |
| **Hasura** | GraphQL/dev-tools, remote, backend talent. |
| **Atlan** | Remote-first data catalog — adds remote supply. |
| **Scaler** | EdTech + AI, learning-oriented brand. |
| **Uniphore / Observe.AI** | Conversational/speech AI — NLP roles. |
| **CropIn / Pixxel** | Geospatial CV/ML — deep-tech CV candidates. |
| **Wadhwani AI** | AI-for-good, intern-friendly, mission pull. |
| **Druva / Saviynt / Sequretek** | Cloud + cybersecurity depth. |
| **CRED / Juspay** | Premium fintech engineering brands. |
| **Niramai** | Healthcare CV/ML niche. |
| **Vercel / GitLab / Zapier / Weights & Biases / Canva** | Top **remote** dev-tools/SaaS — expand the REMOTE region, strong global brand for SEO. |

## 🟢 LOWER PRIORITY (brand/aspirational)
*World-class brands but very selective and largely not India-fresher pipelines — keep for SEO, "dream companies" lists, and remote stretch goals.*

| Company | Why add (later) |
|---|---|
| **OpenAI, Anthropic, Cohere, Hugging Face, Scale AI** | Frontier AI brand + SEO magnets ("openai careers"), occasional remote/intern roles; set realistic expectations. |
| **Stripe** | Elite fintech infra; selective, some India + remote. |

---

## Recommended action
Load **🔴 + 🟠** now (they map cleanly to FRESHER/ZERO_ONE roles and to your TRICITY/NCR/METRO/REMOTE regions), and add **🟢** as `hiringStatus=SELECTIVE/UNKNOWN` brand entries for SEO + aspirational lists. The loader (`scripts/load-seed-data.ts`) upserts by slug, so this is safe and idempotent.

**Coverage after loading 🔴+🟠 (~30 new):** your DB roughly doubles to ~60 companies with much stronger **remote**, **fintech**, **SaaS**, **dev-tools**, **healthtech** and **cyber** representation — turning it from a Tricity/NCR board into a credible pan-India + remote AI/tech platform.
