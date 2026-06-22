import "server-only";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY
const MODEL = "claude-opus-4-8";

/** Robustly extract a JSON object from Claude's first text block. */
function parseJson<T>(msg: Anthropic.Message): T {
  const block = msg.content.find((b) => b.type === "text");
  const text = block && "text" in block ? block.text : "";
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
  const content: Anthropic.MessageParam["content"] = [];
  if (input.pdfBase64) {
    content.push({ type: "document", source: { type: "base64", media_type: "application/pdf", data: input.pdfBase64 } });
  }
  content.push({
    type: "text",
    text:
      `Review this resume for a fresher targeting AI/ML, GenAI, Computer Vision and Python software roles in India. ` +
      (input.text ? `Resume text:\n${input.text}\n\n` : "") +
      `Respond with ONLY a JSON object, no prose, matching exactly: ` +
      `{"score": <0-100 integer>, "summary": "<one sentence>", "strengths": ["..."], "gaps": ["..."], "suggestions": ["..."], "atsKeywords": ["..."]}.`,
  });

  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: "You are a precise, encouraging technical recruiter. Output only valid minified JSON.",
    messages: [{ role: "user", content }],
  });
  return parseJson<ResumeReview>(msg);
}

/** AI Job Match Score + Skill-Gap + Interview Prep in one call. */
export async function matchJob(input: {
  resumeText: string;
  userSkills: string[];
  job: { title: string; skills: string[]; description?: string | null; company: string };
}): Promise<JobMatch> {
  const msg = await client.messages.create({
    model: MODEL,
    max_tokens: 1800,
    system: "You are a technical hiring manager. Be honest and specific. Output only valid minified JSON.",
    messages: [
      {
        role: "user",
        content:
          `Candidate skills: ${input.userSkills.join(", ") || "(see resume)"}\n` +
          `Candidate resume:\n${input.resumeText.slice(0, 6000)}\n\n` +
          `Role: ${input.job.title} at ${input.job.company}\n` +
          `Required skills: ${input.job.skills.join(", ")}\n` +
          (input.job.description ? `Description: ${input.job.description}\n` : "") +
          `\nRespond with ONLY a JSON object matching exactly: ` +
          `{"score": <0-100 integer fit>, "verdict": "<one sentence>", "matchedSkills": ["..."], "missingSkills": ["..."], "interviewQuestions": ["<5 likely questions>"], "prepTips": ["<3 concrete prep tips>"]}.`,
      },
    ],
  });
  return parseJson<JobMatch>(msg);
}
