/**
 * KSA Generator Module
 * Generates Knowledge, Skills, and Abilities (KSA) responses
 */

import { callOpenAI } from './client';
import { KSAResponses, AIResponse } from './types';

const SYSTEM_PROMPT = `You are a KSA (Knowledge, Skills, Abilities) response generator for federal job applications. Create compelling, evidence-based KSA responses.

CRITICAL RULES:
1. NEVER fabricate experience - only use evidence from the resume
2. Each response must cite specific accomplishments from the resume
3. Use CCAR format (Challenge-Context-Action-Result) where applicable
4. Include quantifiable metrics when available
5. Address the specific KSA requirement completely
6. Keep responses concise but comprehensive (150-250 words each)

KSA RESPONSE STRUCTURE:
- Opening: Direct statement addressing the KSA
- Evidence: Specific example(s) from resume with context
- Action: What YOU did (use strong action verbs)
- Result: Quantified outcome or impact

OUTPUT FORMAT - Return valid JSON only:
{
  "responses": [
    {
      "ksa_statement": "the exact KSA requirement",
      "response_text": "the complete KSA response (150-250 words)",
      "supporting_evidence": ["specific resume items that support this response"]
    }
  ],
  "overall_quality_score": number 0-100 based on completeness and evidence quality
}

Quality indicators:
- Specific examples from resume
- Quantified achievements
- Clear cause-and-effect
- Professional tone
- Complete addressing of KSA requirement`;

export interface KSAGeneratorInput {
  resumeText: string;
  ksaRequirements: string[];
  jobTitle?: string;
  gsLevel?: string;
}

/**
 * Generate KSA responses based on resume content
 * @param input - Resume text and KSA requirements
 * @returns Generated KSA responses
 */
export async function generateKSAResponses(
  input: KSAGeneratorInput
): Promise<AIResponse<KSAResponses>> {
  const { resumeText, ksaRequirements, jobTitle, gsLevel } = input;

  if (!resumeText || resumeText.trim().length === 0) {
    return {
      success: false,
      data: null,
      error: 'Resume text is required',
      tokens_used: 0,
      model: 'gpt-4o-mini',
    };
  }

  if (!ksaRequirements || ksaRequirements.length === 0) {
    return {
      success: false,
      data: null,
      error: 'At least one KSA requirement is required',
      tokens_used: 0,
      model: 'gpt-4o-mini',
    };
  }

  const userPrompt = `RESUME:\n${resumeText}\n\nKSA REQUIREMENTS TO ADDRESS:\n${ksaRequirements.map((ksa, i) => `${i + 1}. ${ksa}`).join('\n')}\n\n${jobTitle ? `TARGET POSITION: ${jobTitle}\n` : ''}${gsLevel ? `GS LEVEL: ${gsLevel}\n` : ''}\nGenerate KSA responses based ONLY on the resume content provided. Return valid JSON only.`;

  const { data, error, tokensUsed } = await callOpenAI<KSAResponses>(
    SYSTEM_PROMPT,
    userPrompt,
    { temperature: 0.2, maxTokens: 6000 }
  );

  return {
    success: error === null,
    data,
    error,
    tokens_used: tokensUsed,
    model: 'gpt-4o-mini',
  };
}

/**
 * Generate a single KSA response
 * @param resumeText - Resume content
 * @param ksaRequirement - Single KSA statement
 * @returns Single KSA response
 */
export async function generateSingleKSA(
  resumeText: string,
  ksaRequirement: string
): Promise<{ response: string; evidence: string[] } | null> {
  const result = await generateKSAResponses({
    resumeText,
    ksaRequirements: [ksaRequirement],
  });

  if (!result.success || !result.data || result.data.responses.length === 0) {
    return null;
  }

  const ksaResponse = result.data.responses[0];
  return {
    response: ksaResponse.response_text,
    evidence: ksaResponse.supporting_evidence,
  };
}

/**
 * Validate KSA response quality
 * @param response - KSA response text
 * @returns Quality assessment
 */
export function validateKSAResponse(response: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 100;

  const wordCount = response.split(/\s+/).filter(w => w.length > 0).length;

  // Check word count
  if (wordCount < 100) {
    feedback.push('Response is too short (aim for 150-250 words)');
    score -= 20;
  } else if (wordCount > 300) {
    feedback.push('Response is too long (aim for 150-250 words)');
    score -= 10;
  }

  // Check for metrics/numbers
  if (!/\d+/.test(response)) {
    feedback.push('No quantifiable metrics found - add numbers where possible');
    score -= 15;
  }

  // Check for action verbs
  const actionVerbs = /\b(developed|implemented|managed|led|created|designed|analyzed|improved|increased|reduced|coordinated|supervised|achieved|established|conducted|evaluated)\b/i;
  if (!actionVerbs.test(response)) {
    feedback.push('Consider using stronger action verbs');
    score -= 10;
  }

  // Check for first person
  if (!/\b(I|my|me)\b/i.test(response)) {
    feedback.push('Use first person (I, my) for clarity');
    score -= 5;
  }

  return {
    valid: score >= 70,
    score: Math.max(0, score),
    feedback,
  };
}

/**
 * Extract KSA requirements from job text
 * @param jobText - Job posting text
 * @returns Array of KSA statements
 */
export function extractKSAFromJobText(jobText: string): string[] {
  // Simple extraction - looks for KSA-related sections
  const ksaPatterns = [
    /knowledge[,:]?\s*([^\n]+)/gi,
    /skills[,:]?\s*([^\n]+)/gi,
    /abilities[,:]?\s*([^\n]+)/gi,
    /competencies[,:]?\s*([^\n]+)/gi,
  ];

  const matches: string[] = [];
  
  for (const pattern of ksaPatterns) {
    let match;
    while ((match = pattern.exec(jobText)) !== null) {
      const text = match[1]?.trim();
      if (text && text.length > 10) {
        matches.push(text);
      }
    }
  }

  return matches;
}
