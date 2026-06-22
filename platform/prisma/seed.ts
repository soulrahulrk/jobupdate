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
  { slug: "sarvam-ai", name: "Sarvam AI", region: "METRO", city: "Bengaluru / Delhi", website: "https://www.sarvam.ai", careersUrl: "https://www.sarvam.ai/careers", industries: ["LLM Foundation Models"], techStack: ["Python", "PyTorch", "Transformers"], hiringStatus: "PROGRAM", aiRelevance: 10, sizeRange: "50-200",
    jobs: [{ slug: "sarvam-applied-ai-intern", title: "Applied AI Engineer / Intern", workMode: "HYBRID", region: "METRO", location: "Bengaluru", experience: "FRESHER", skills: ["Python", "PyTorch", "Transformers", "LLM"], applyUrl: "https://www.sarvam.ai/careers" }] },
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
