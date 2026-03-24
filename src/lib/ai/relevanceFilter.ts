/**
 * Relevance Filter Module
 * Identifies which resume content is relevant to job requirements
 */

import { callOpenAI } from './client';
import { RelevanceAnalysis, AIResponse } from './types';

const SYSTEM_PROMPT = `You are a resume relevance filter. Score each resume bullet (0-10) based on direct support of Required Specialized Experience.

CRITICAL RULES:
1. Score 8-10: Direct, strong match to specialized experience
2. Score 5-7: Partial or related match
3. Score 0-4: No direct relevance to specialized experience
4. NEVER fabricate qualifications
5. Score based ONLY on explicit resume content

OUTPUT FORMAT - Return valid JSON only:
{
  "relevance_score": number 0-100,
  "matching_qualifications": ["bullets that directly support specialized experience"],
  "partial_matches": [
    {
      "requirement": "the specialized experience requirement",
      "resume_evidence": "relevant bullet text",
      "confidence": number 0-100
    }
  ],
  "gaps": ["specialized experience not demonstrated in resume"],
  "recommendations": ["suggestions for improvement"]
}`;

export interface RelevanceFilterInput {
  resumeText: string;
  requiredQualifications: string[];
  specializedExperience: string[];
}

/**
 * Filter resume content for relevance to job requirements
 * @param input - Resume text and job requirements
 * @returns Relevance analysis
 */
export async function filterRelevance(
  input: RelevanceFilterInput
): Promise<AIResponse<RelevanceAnalysis>> {
  const { resumeText, requiredQualifications, specializedExperience } = input;

  if (!resumeText || resumeText.trim().length === 0) {
    return {
      success: false,
      data: null,
      error: 'Resume text is required',
      tokens_used: 0,
      model: 'gpt-4o-mini',
    };
  }

  if (requiredQualifications.length === 0 && specializedExperience.length === 0) {
    return {
      success: false,
      data: null,
      error: 'At least one qualification is required',
      tokens_used: 0,
      model: 'gpt-4o-mini',
    };
  }

  const userPrompt = `RESUME:\n${resumeText}\n\nREQUIRED QUALIFICATIONS:\n${requiredQualifications.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\nSPECIALIZED EXPERIENCE REQUIREMENTS:\n${specializedExperience.map((e, i) => `${i + 1}. ${e}`).join('\n')}`;

  const { data, error, tokensUsed } = await callOpenAI<RelevanceAnalysis>(
    SYSTEM_PROMPT,
    userPrompt,
    { temperature: 0.1 }
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
 * Extract only relevant resume sections
 * @param resumeText - Full resume text
 * @param relevantSections - Array of section identifiers to keep
 * @returns Filtered resume text
 */
export async function extractRelevantSections(
  resumeText: string,
  relevantSections: string[]
): Promise<string> {
  // Simple implementation - can be enhanced with AI
  const sections = resumeText.split(/\n\n+/);
  
  return sections
    .filter(section => {
      const sectionLower = section.toLowerCase();
      return relevantSections.some(keyword => 
        sectionLower.includes(keyword.toLowerCase())
      );
    })
    .join('\n\n');
}

/**
 * Calculate coverage percentage
 * @param matchingCount - Number of matching qualifications
 * @param totalCount - Total number of qualifications
 * @returns Coverage percentage
 */
export function calculateCoveragePercent(
  matchingCount: number,
  totalCount: number
): number {
  if (totalCount === 0) return 0;
  return Math.round((matchingCount / totalCount) * 100);
}
