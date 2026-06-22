import "server-only";
import { GoogleGenAI } from "@google/genai";

const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ?? "" });
const MODEL = "gemini-2.5-flash"; // free tier, reads PDFs natively

/** Robustly extract a JSON object from Gemini's text response. */
function parseJson<T>(text: string): T {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("AI did not return JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}

export type ResumeReview = {
  score: number; // 0–100
  summary: string;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  atsKeywords: string[];
};

export type JobMatch = {
  score: number; // 0–100
  verdict: string;
  matchedSkills: string[];
  missingSkills: string[];
  interviewQuestions: string[];
  prepTips: string[];
};

/** AI Resume Review — accepts the resume as a PDF (base64) or plain text. */
export async function reviewResume(input: { pdfBase64?: string; text?: string }): Promise<ResumeReview> {
  const parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }> = [];
  if (input.pdfBase64) {
    parts.push({ inlineData: { mimeType: "application/pdf", data: input.pdfBase64 } });
  }
  parts.push({
    text:
      `Review this resume for a fresher targeting AI/ML, GenAI, Computer Vision and Python software roles in India. ` +
      (input.text ? `Resume text:\n${input.text}\n\n` : "") +
      `Respond with ONLY a JSON object, no prose, matching exactly: ` +
      `{"score": <0-100 integer>, "summary": "<one sentence>", "strengths": ["..."], "gaps": ["..."], "suggestions": ["..."], "atsKeywords": ["..."]}.`,
  });

  const response = await client.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts }],
    config: {
      systemInstruction: "You are a precise, encouraging technical recruiter. Output only valid minified JSON.",
      responseMimeType: "application/json",
      maxOutputTokens: 2000,
    },
  });
  return parseJson<ResumeReview>(response.text ?? "");
}

/** AI Job Match Score + Skill-Gap + Interview Prep in one call. */
export async function matchJob(input: {
  resumeText: string;
  userSkills: string[];
  job: { title: string; skills: string[]; description?: string | null; company: string };
}): Promise<JobMatch> {
  const prompt =
    `Candidate skills: ${input.userSkills.join(", ") || "(see resume)"}\n` +
    `Candidate resume:\n${input.resumeText.slice(0, 6000)}\n\n` +
    `Role: ${input.job.title} at ${input.job.company}\n` +
    `Required skills: ${input.job.skills.join(", ")}\n` +
    (input.job.description ? `Description: ${input.job.description}\n` : "") +
    `\nRespond with ONLY a JSON object matching exactly: ` +
    `{"score": <0-100 integer fit>, "verdict": "<one sentence>", "matchedSkills": ["..."], "missingSkills": ["..."], "interviewQuestions": ["<5 likely questions>"], "prepTips": ["<3 concrete prep tips>"]}.`;

  const response = await client.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      systemInstruction: "You are a technical hiring manager. Be honest and specific. Output only valid minified JSON.",
      responseMimeType: "application/json",
      maxOutputTokens: 1800,
    },
  });
  return parseJson<JobMatch>(response.text ?? "");
}
