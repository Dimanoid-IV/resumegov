import { openai } from "./client";

export interface FederalResumeAnalysis {
  required_keywords: string[];
  specialized_experience_statements: string[];
  missing_compliance_elements: string[];
  achievement_count: number;
  semantic_match_score: number;
}

export async function analyzeResume(params: {
  resumeText: string;
  vacancyText: string;
}): Promise<FederalResumeAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-4.1",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `
You are a federal resume compliance extraction engine.

CRITICAL RULES:
- Do not fabricate any information.
- Do not add employers, dates, certifications, or experience.
- Only extract data explicitly present in the provided text.
- If information is missing, return empty array or zero.
- Return valid JSON only. No markdown, no explanations.
- Preserve exact wording from vacancy announcement.

Output JSON schema:
{
  "required_keywords": string[],
  "specialized_experience_statements": string[],
  "missing_compliance_elements": string[],
  "achievement_count": number,
  "semantic_match_score": number
}
`,
      },
      {
        role: "user",
        content: `
VACANCY ANNOUNCEMENT:
${params.vacancyText}

RESUME:
${params.resumeText}

Extract structured compliance data according to the schema above.`,
      },
    ],
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  try {
    const parsed = JSON.parse(content) as FederalResumeAnalysis;
    
    // Validate required fields
    if (
      !Array.isArray(parsed.required_keywords) ||
      !Array.isArray(parsed.specialized_experience_statements) ||
      !Array.isArray(parsed.missing_compliance_elements) ||
      typeof parsed.achievement_count !== "number" ||
      typeof parsed.semantic_match_score !== "number"
    ) {
      throw new Error("Invalid JSON structure from OpenAI");
    }

    return parsed;
  } catch (error) {
    console.error("Failed to parse OpenAI response:", error);
    throw new Error("OpenAI returned invalid JSON");
  }
}
