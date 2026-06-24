import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

type Seed = {
  slug: string; name: string; region: "TRICITY" | "NCR" | "METRO";
  city: string; website?: string; careersUrl?: string; industries: string[];
  techStack: string[]; hiringStatus: "CONFIRMED" | "VERIFY" | "PROGRAM"; aiRelevance: number;
  sizeRange?: string; phone?: string;
  jobs: {
    slug: string; title: string; workMode: "ONSITE" | "HYBRID" | "REMOTE";
    region: "TRICITY" | "NCR" | "METRO" | "REMOTE"; location: string;
    experience: "FRESHER" | "ZERO_ONE" | "ONE_TWO"; skills: string[];
    applyUrl: string; salaryMin?: number; salaryMax?: number;
  }[];
};

const data: Seed[] = [
  { slug: "xenonstack", name: "XenonStack", region: "TRICITY", city: "Mohali (STPI, Sec 75)", website: "https://www.xenonstack.com", careersUrl: "https://www.xenonstack.com/careers/", industries: ["Agentic AI", "Data", "Cloud"], techStack: ["Python", "LLM", "Kubernetes"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "500-1000",
    jobs: [
      { slug: "xenonstack-associate-software-engineer", title: "Associate Software Engineer", workMode: "ONSITE", region: "TRICITY", location: "Mohali", experience: "FRESHER", skills: ["Python", "DSA", "SQL"], applyUrl: "https://xenonstack.jobs/", salaryMin: 300000, salaryMax: 500000 },
      { slug: "xenonstack-agentic-ai-engineer", title: "Agentic AI Engineer", workMode: "ONSITE", region: "TRICITY", location: "Mohali", experience: "ZERO_ONE", skills: ["Python", "LLM", "LangChain", "RAG"], applyUrl: "https://xenonstack.jobs/" },
    ] },
  { slug: "agnext", name: "AgNext Technologies", region: "TRICITY", city: "Mohali (STPI, Sec 75)", website: "https://agnext.com", careersUrl: "https://apply.workable.com/agnext-technologies/", industries: ["AgTech", "Computer Vision"], techStack: ["Python", "OpenCV", "PyTorch"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "200-500",
    jobs: [{ slug: "agnext-ml-engineer", title: "ML / Computer Vision Engineer", workMode: "ONSITE", region: "TRICITY", location: "Mohali", experience: "FRESHER", skills: ["Python", "OpenCV", "Deep Learning"], applyUrl: "https://apply.workable.com/agnext-technologies/" }] },
  { slug: "soft-radix", name: "Soft Radix", region: "TRICITY", city: "Mohali (Phase 8B)", website: "https://softradix.com", careersUrl: "https://softradix.com/careers", industries: ["AI Services", "Web"], techStack: ["Python", "GenAI", "LLM"], hiringStatus: "CONFIRMED", aiRelevance: 8, sizeRange: "50-200",
    jobs: [{ slug: "soft-radix-ai-ml-engineer", title: "AI/ML Engineer (Fresher)", workMode: "ONSITE", region: "TRICITY", location: "Mohali", experience: "FRESHER", skills: ["Python", "GenAI", "LLM", "Agents"], applyUrl: "https://softradix.com/careers" }] },
  { slug: "endoenergy", name: "Endoenergy Systems", region: "TRICITY", city: "Mohali (STPI, Sec 75)", website: "https://endoenergy.com", careersUrl: "https://endoenergy.com/careers/", industries: ["Robotics", "Embedded"], techStack: ["ROS2", "Python", "C++"], hiringStatus: "CONFIRMED", aiRelevance: 7, sizeRange: "11-50", phone: "+91 98767 74566",
    jobs: [{ slug: "endoenergy-ros2-engineer", title: "ROS2 Developer / Graduate Engineer", workMode: "ONSITE", region: "TRICITY", location: "Mohali", experience: "FRESHER", skills: ["ROS2", "Python", "Robotics"], applyUrl: "https://endoenergy.com/careers/" }] },
  { slug: "crossml", name: "CrossML", region: "TRICITY", city: "Chandigarh (Ind. Area Ph 1)", website: "https://www.crossml.com", careersUrl: "https://www.crossml.com/contact-us/", industries: ["AI/ML Consulting"], techStack: ["Python", "LLM", "MLOps"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "50-200",
    jobs: [{ slug: "crossml-ai-ml-developer", title: "AI/ML Developer", workMode: "HYBRID", region: "TRICITY", location: "Chandigarh", experience: "FRESHER", skills: ["Python", "LLM", "RAG"], applyUrl: "https://www.crossml.com/contact-us/" }] },
  { slug: "impressico", name: "Impressico Business Solutions", region: "NCR", city: "Noida (Sec 7)", website: "https://www.impressico.com", careersUrl: "https://www.impressico.com/careers/", industries: ["GenAI", "Data"], techStack: ["Python", "GenAI", "React", "Node"], hiringStatus: "CONFIRMED", aiRelevance: 8, sizeRange: "500-1000", phone: "+91 120 419 0000",
    jobs: [{ slug: "impressico-genai-python-trainee", title: "GenAI / Python Full-Stack Trainee", workMode: "HYBRID", region: "NCR", location: "Noida", experience: "FRESHER", skills: ["Python", "GenAI", "FastAPI", "React"], applyUrl: "https://www.impressico.com/careers/", salaryMin: 400000, salaryMax: 700000 }] },
  { slug: "spyne", name: "Spyne", region: "NCR", city: "Gurugram (Sec 32)", website: "https://www.spyne.ai", careersUrl: "https://www.spyne.ai/careers", industries: ["Computer Vision", "Auto E-commerce"], techStack: ["Python", "PyTorch", "OpenCV"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "200-500", phone: "+91 80438 20733",
    jobs: [{ slug: "spyne-computer-vision-engineer", title: "Computer Vision Engineer", workMode: "HYBRID", region: "NCR", location: "Gurugram", experience: "ZERO_ONE", skills: ["Python", "OpenCV", "Deep Learning", "YOLO"], applyUrl: "https://www.spyne.ai/careers" }] },
  { slug: "vehant", name: "Vehant Technologies", region: "NCR", city: "Noida (Sec 59)", website: "https://www.vehant.com", careersUrl: "https://www.vehant.com/careers/", industries: ["Computer Vision", "Security AI"], techStack: ["Python", "OpenCV", "Deep Learning"], hiringStatus: "VERIFY", aiRelevance: 9, sizeRange: "500-1000", phone: "+91 120 461 0200",
    jobs: [{ slug: "vehant-cv-engineer-anpr", title: "Computer Vision Engineer (ANPR/Video Analytics)", workMode: "ONSITE", region: "NCR", location: "Noida", experience: "ZERO_ONE", skills: ["Python", "OpenCV", "ANPR", "Deep Learning"], applyUrl: "https://www.vehant.com/careers/" }] },
  { slug: "voxomos", name: "Voxomos", region: "NCR", city: "Noida (Sec 62)", website: "https://voxomos.com", careersUrl: "https://voxomos.com/", industries: ["GenAI", "Voice/Image AI"], techStack: ["Python", "LLM", "Speech", "CV"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "50-200", phone: "+91 98733 88114",
    jobs: [{ slug: "voxomos-ai-engineer", title: "AI Engineer (Voice/Image/LLM)", workMode: "ONSITE", region: "NCR", location: "Noida", experience: "FRESHER", skills: ["Python", "LLM", "Speech", "Computer Vision"], applyUrl: "https://voxomos.com/" }] },
  { slug: "oriserve", name: "ORI (Oriserve)", region: "NCR", city: "Noida (Sec 3)", website: "https://oriserve.com", careersUrl: "https://oriserve.com/careers/", industries: ["Conversational AI", "GenAI"], techStack: ["Python", "LLM", "NLP"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "50-200", phone: "+91 98707 83507",
    jobs: [{ slug: "oriserve-backend-software-engineer", title: "Backend Software Engineer (Fresher)", workMode: "ONSITE", region: "NCR", location: "Noida", experience: "FRESHER", skills: ["Python", "FastAPI", "NLP", "LLM"], applyUrl: "https://oriserve.com/careers/" }] },
  { slug: "innovaccer", name: "Innovaccer", region: "NCR", city: "Noida (Sec 62)", website: "https://innovaccer.com", careersUrl: "https://innovaccer.com/careers", industries: ["Healthcare AI", "Data"], techStack: ["Python", "ML", "Cloud"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "1000+", phone: "+91 120 431 1139",
    jobs: [{ slug: "innovaccer-data-engineer", title: "Associate Data / ML Engineer", workMode: "HYBRID", region: "NCR", location: "Noida", experience: "FRESHER", skills: ["Python", "SQL", "ML", "Data"], applyUrl: "https://innovaccer.com/careers" }] },
  // Sarvam: public Ashby board lists only 3-5yr/senior roles (verified 2026-06-24) — no current fresher opening, so VERIFY + no fresher job.
  { slug: "sarvam-ai", name: "Sarvam AI", region: "METRO", city: "Bengaluru / Delhi", website: "https://www.sarvam.ai", careersUrl: "https://www.sarvam.ai/careers", industries: ["LLM Foundation Models"], techStack: ["Python", "PyTorch", "Transformers"], hiringStatus: "VERIFY", aiRelevance: 10, sizeRange: "50-200",
    jobs: [] },

  // ===== Added 16 Jun 2026 — all regions =====
  { slug: "incture", name: "Incture Technologies", region: "TRICITY", city: "Mohali (STPI, Sec 75)", website: "https://incture.com", careersUrl: "https://incture.com/careers/", industries: ["SAP BTP", "Enterprise Apps"], techStack: ["Java", "Python", "SAP", "React"], hiringStatus: "CONFIRMED", aiRelevance: 5, sizeRange: "1000+",
    jobs: [{ slug: "incture-eklavya-graduate-engineer", title: "Graduate Engineer (Eklavya Program)", workMode: "ONSITE", region: "TRICITY", location: "Mohali", experience: "FRESHER", skills: ["Java", "Python", "SQL"], applyUrl: "https://incture.com/careers/" }] },
  { slug: "softprodigy", name: "SoftProdigy", region: "TRICITY", city: "Mohali (Sec 67)", website: "https://softprodigy.com", careersUrl: "https://softprodigy.com/careers/", industries: ["Web/Mobile Dev", "AI"], techStack: ["JavaScript", "PHP", "React", "Python"], hiringStatus: "CONFIRMED", aiRelevance: 6, sizeRange: "50-200", phone: "+91 95013 36765",
    jobs: [{ slug: "softprodigy-software-engineer-trainee", title: "Software Engineer Trainee (Intern→Job)", workMode: "ONSITE", region: "TRICITY", location: "Mohali", experience: "FRESHER", skills: ["JavaScript", "React", "PHP"], applyUrl: "https://softprodigy.com/careers/" }] },
  { slug: "relinns", name: "Relinns Technologies", region: "TRICITY", city: "Mohali (STPI, Sec 75)", website: "https://relinns.com", careersUrl: "https://careers.relinns.com/", industries: ["SaaS", "AI/ML", "Chatbots"], techStack: ["Python", "Node", "LLM"], hiringStatus: "CONFIRMED", aiRelevance: 7, sizeRange: "100-250", phone: "+91 70090 75311",
    jobs: [{ slug: "relinns-ai-ml-developer", title: "AI/ML Developer (Fresher)", workMode: "HYBRID", region: "TRICITY", location: "Mohali", experience: "FRESHER", skills: ["Python", "LLM", "Node"], applyUrl: "https://careers.relinns.com/" }] },
  { slug: "grazitti", name: "Grazitti Interactive", region: "TRICITY", city: "Panchkula (Sec 22)", website: "https://www.grazitti.com", careersUrl: "https://www.grazitti.com/company/careers/job-listing/", industries: ["Marketing Tech", "Salesforce", "Data/AI"], techStack: ["PHP", "Python", "Salesforce"], hiringStatus: "PROGRAM", aiRelevance: 6, sizeRange: "500-1000", phone: "+91 97798 62521",
    jobs: [{ slug: "grazitti-trainee-software-engineer", title: "Trainee Software Engineer", workMode: "HYBRID", region: "TRICITY", location: "Panchkula", experience: "FRESHER", skills: ["PHP", "JavaScript", "SQL"], applyUrl: "https://www.grazitti.com/company/careers/job-listing/" }] },
  { slug: "fractal-analytics", name: "Fractal Analytics", region: "NCR", city: "Gurugram (Sec 44)", website: "https://fractal.ai", careersUrl: "https://fractal.ai/careers/", industries: ["AI/ML", "Decision Analytics"], techStack: ["Python", "ML", "SQL"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "1000+",
    jobs: [{ slug: "fractal-data-scientist-fresher", title: "Data Scientist (Fresher)", workMode: "HYBRID", region: "NCR", location: "Gurugram", experience: "FRESHER", skills: ["Python", "ML", "SQL", "Statistics"], applyUrl: "https://fractal.ai/careers/" }] },
  { slug: "tiger-analytics", name: "Tiger Analytics", region: "NCR", city: "Gurugram", website: "https://www.tigeranalytics.com", careersUrl: "https://www.tigeranalytics.com/careers/", industries: ["AI", "Data Science"], techStack: ["Python", "ML", "SQL"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "1000+",
    jobs: [{ slug: "tiger-analytics-ds-analyst", title: "Data Science Analyst (Graduate)", workMode: "HYBRID", region: "NCR", location: "Gurugram", experience: "FRESHER", skills: ["Python", "ML", "SQL"], applyUrl: "https://www.tigeranalytics.com/careers/" }] },
  { slug: "affine", name: "Affine", region: "NCR", city: "Gurugram (Sec 44)", website: "https://affine.ai", careersUrl: "https://affine.ai/careers/", industries: ["GenAI", "ML Analytics"], techStack: ["Python", "ML", "GenAI"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "500-1000",
    jobs: [{ slug: "affine-associate-ml-engineer", title: "Associate ML / GenAI Engineer", workMode: "HYBRID", region: "NCR", location: "Gurugram", experience: "FRESHER", skills: ["Python", "ML", "GenAI"], applyUrl: "https://affine.ai/careers/" }] },
  { slug: "aapna-infotech", name: "AAPNA Infotech", region: "NCR", city: "Gurugram (Udyog Vihar, Sec 20)", website: "https://www.aapnainfotech.com", careersUrl: "https://www.aapnainfotech.com/careers/", industries: ["AI Engineering", "LLM"], techStack: ["Python", "LangChain", "PyTorch"], hiringStatus: "CONFIRMED", aiRelevance: 8, sizeRange: "200-500", phone: "+91 72919 99669",
    jobs: [{ slug: "aapna-ai-engineer", title: "AI Engineer (0-1 yr)", workMode: "REMOTE", region: "REMOTE", location: "Remote / Gurugram", experience: "ZERO_ONE", skills: ["Python", "LangChain", "PyTorch", "LLM"], applyUrl: "https://www.aapnainfotech.com/careers/" }] },
  { slug: "valiance-solutions", name: "Valiance Solutions", region: "NCR", city: "Noida (Sec 62)", website: "https://valiancesolutions.com", careersUrl: "https://valiancesolutions.com/contact-us/", industries: ["AI/ML", "Custom Solutions"], techStack: ["Python", "ML", "Deep Learning"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "50-200", phone: "+91 81781 57404",
    jobs: [{ slug: "valiance-applied-ai-engineer", title: "Applied AI / ML Engineer (Fresher)", workMode: "HYBRID", region: "NCR", location: "Noida", experience: "FRESHER", skills: ["Python", "ML", "Deep Learning"], applyUrl: "https://valiancesolutions.com/contact-us/" }] },
  { slug: "appnox", name: "Appnox Technologies", region: "NCR", city: "Noida (Sec 142)", website: "https://appnox.ai", careersUrl: "https://appnox.ai/", industries: ["AI/ML", "Data Science"], techStack: ["Python", "ML", "Node"], hiringStatus: "CONFIRMED", aiRelevance: 8, sizeRange: "50-200", phone: "+91 99532 14026",
    jobs: [{ slug: "appnox-ai-ml-developer", title: "AI/ML Developer (Fresher)", workMode: "ONSITE", region: "NCR", location: "Noida", experience: "FRESHER", skills: ["Python", "ML", "Data Science"], applyUrl: "https://appnox.ai/" }] },
  { slug: "gram-vaani", name: "Gram Vaani", region: "NCR", city: "Delhi (Sarvapriya Vihar)", website: "https://gramvaani.org", careersUrl: "https://gramvaani.org/", industries: ["NLP", "Voice AI", "Tech-for-good"], techStack: ["Python", "NLP", "Django"], hiringStatus: "CONFIRMED", aiRelevance: 8, sizeRange: "50-200", phone: "+91 70710 00444",
    jobs: [{ slug: "gram-vaani-nlp-python-developer", title: "NLP / Python Developer (Fresher)", workMode: "HYBRID", region: "NCR", location: "Delhi", experience: "FRESHER", skills: ["Python", "NLP", "Django"], applyUrl: "https://gramvaani.org/" }] },
  { slug: "newgen-software", name: "Newgen Software", region: "NCR", city: "Noida (Sec 144)", website: "https://newgensoft.com", careersUrl: "https://newgensoft.com/company/careers/", industries: ["Low-code", "BPM Product", "AI"], techStack: ["Java", "Python", "SQL"], hiringStatus: "PROGRAM", aiRelevance: 6, sizeRange: "5000+",
    jobs: [{ slug: "newgen-graduate-engineer-trainee", title: "Graduate Engineer Trainee", workMode: "ONSITE", region: "NCR", location: "Noida", experience: "FRESHER", skills: ["Java", "Python", "SQL"], applyUrl: "https://newgensoft.com/company/careers/" }] },
  { slug: "hpe", name: "HPE", region: "METRO", city: "Bengaluru", website: "https://www.hpe.com", careersUrl: "https://careers.hpe.com/", industries: ["Enterprise Tech", "AI/ML"], techStack: ["Python", "ML", "Cloud"], hiringStatus: "PROGRAM", aiRelevance: 9, sizeRange: "50000+",
    jobs: [{ slug: "hpe-ai-ml-engineer-offcampus", title: "AI/ML Engineer (Off-campus 2026)", workMode: "HYBRID", region: "METRO", location: "Bengaluru", experience: "FRESHER", skills: ["Python", "ML", "SQL"], applyUrl: "https://careers.hpe.com/" }] },
  { slug: "mad-street-den", name: "Mad Street Den", region: "METRO", city: "Bengaluru / Chennai", website: "https://www.madstreetden.com", careersUrl: "https://www.madstreetden.com/careers/", industries: ["Retail Computer Vision", "AI"], techStack: ["Python", "OpenCV", "Deep Learning"], hiringStatus: "CONFIRMED", aiRelevance: 9, sizeRange: "200-500",
    jobs: [{ slug: "mad-street-den-cv-engineer", title: "Computer Vision Engineer", workMode: "HYBRID", region: "METRO", location: "Bengaluru", experience: "ZERO_ONE", skills: ["Python", "OpenCV", "Deep Learning"], applyUrl: "https://www.madstreetden.com/careers/" }] },
  { slug: "sigtuple", name: "SigTuple", region: "METRO", city: "Bengaluru", website: "https://sigtuple.com", careersUrl: "https://sigtuple.com/careers/", industries: ["Healthcare Computer Vision", "AI"], techStack: ["Python", "OpenCV", "Deep Learning"], hiringStatus: "VERIFY", aiRelevance: 9, sizeRange: "50-200",
    jobs: [{ slug: "sigtuple-ml-cv-engineer", title: "ML / Computer Vision Engineer", workMode: "ONSITE", region: "METRO", location: "Bengaluru", experience: "FRESHER", skills: ["Python", "OpenCV", "Deep Learning"], applyUrl: "https://sigtuple.com/careers/" }] },
  { slug: "mu-sigma", name: "Mu Sigma", region: "METRO", city: "Bengaluru", website: "https://www.mu-sigma.com", careersUrl: "https://www.mu-sigma.com/careers", industries: ["Decision Sciences", "Analytics"], techStack: ["Python", "SQL", "Statistics"], hiringStatus: "PROGRAM", aiRelevance: 7, sizeRange: "3000+",
    jobs: [{ slug: "mu-sigma-decision-scientist-trainee", title: "Decision Scientist (Trainee)", workMode: "ONSITE", region: "METRO", location: "Bengaluru", experience: "FRESHER", skills: ["Python", "SQL", "Statistics"], applyUrl: "https://www.mu-sigma.com/careers" }] },
];

async function main() {
  for (const c of data) {
    const { jobs, ...company } = c;
    const saved = await db.company.upsert({
      where: { slug: company.slug },
      update: { ...company, verifiedAt: new Date() },
      create: { ...company, verifiedAt: new Date() },
    });
    for (const j of jobs) {
      await db.job.upsert({
        where: { slug: j.slug },
        update: { ...j, companyId: saved.id, isFresher: true, isActive: true },
        create: { ...j, companyId: saved.id, isFresher: true, isActive: true },
      });
    }
  }
  const [c, j] = await Promise.all([db.company.count(), db.job.count()]);
  console.log(`Seeded ${c} companies, ${j} jobs.`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => db.$disconnect());
