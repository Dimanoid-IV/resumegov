import { openai } from "./client";

export interface CompressedResumeResult {
  compressed_text: string;
  word_count: number;
}

export async function compressResume(params: {
  resumeText: string;
  vacancyText: string;
  targetWordCount: number;
  hardLimit: number;
}): Promise<CompressedResumeResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0.3,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
You are a federal resume compression engine.

CRITICAL RULES:
- Preserve ALL factual information (employers, dates, certifications, duties).
- Do NOT invent or add any experience, employers, or dates.
- Maintain specialized experience language verbatim.
- Target word count: ${params.targetWordCount} words.
- Hard limit: ${params.hardLimit} words.
- Use concise language but preserve qualification details.
- Keep month/year dates and hours per week intact.

Output JSON schema:
{
  "compressed_text": string,
  "word_count": number
}
`,
      },
      {
        role: "user",
        content: `
VACANCY ANNOUNCEMENT:
${params.vacancyText}

RESUME TO COMPRESS:
${params.resumeText}

Compress this resume to ${params.targetWordCount} words while preserving all qualification-critical information.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  try {
    const parsed = JSON.parse(content) as CompressedResumeResult;

    if (!parsed.compressed_text || typeof parsed.word_count !== "number") {
      throw new Error("Invalid JSON structure from OpenAI");
    }

    return parsed;
  } catch (error) {
    console.error("Failed to parse OpenAI response:", error);
    throw new Error("OpenAI returned invalid JSON");
  }
}
