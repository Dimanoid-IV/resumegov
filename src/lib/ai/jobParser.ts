/**
 * Job Parser Module
 * Parses federal job postings and extracts structured data
 */

import { callOpenAI } from './client';
import { ParsedJobData, AIResponse } from './types';

const SYSTEM_PROMPT = `You are a federal job posting parser. Extract EXACT information from USAJOBS postings.

CRITICAL RULES - FOLLOW EXACTLY:
1. Extract ONLY information explicitly stated - VERBATIM
2. NEVER summarize or paraphrase qualification language
3. Preserve EXACT wording for all required qualifications
4. Identify GS level from vacancy announcement number or text
5. Return JSON ONLY - no commentary, no explanations

OUTPUT FORMAT - Return valid JSON only, no text before or after:
{
  "gs_level": "GS-12" or "" if not found,
  "title": "exact job title",
  "agency": "hiring agency name",
  "location": "duty station location",
  "salary_range": {
    "min": minimum annual salary as number or null,
    "max": maximum annual salary as number or null
  },
  "required_qualifications": ["EXACT qualification text 1", "EXACT qualification text 2"],
  "specialized_experience": ["EXACT specialized experience requirement 1", "EXACT specialized experience requirement 2"],
  "keywords": ["keyword1", "keyword2"],
  "duties": ["EXACT duty statement 1"],
  "ksa_requirements": ["EXACT KSA requirement"]
}

IMPORTANT: Use empty array [] if no items found. Never add extra text.`;

/**
 * Parse a federal job posting
 * @param jobText - Raw job posting text from USAJOBS
 * @returns Structured job data or error
 */
export async function parseJobPosting(
  jobText: string
): Promise<AIResponse<ParsedJobData>> {
  if (!jobText || jobText.trim().length === 0) {
    return {
      success: false,
      data: null,
      error: 'Job text is required',
      tokens_used: 0,
      model: 'gpt-4o-mini',
    };
  }

  const { data, error, tokensUsed } = await callOpenAI<ParsedJobData>(
    SYSTEM_PROMPT,
    `Parse this federal job posting and return structured JSON:\n\n${jobText}`,
    { temperature: 0.0 }
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
 * Extract GS level from job posting
 * @param jobText - Raw job posting text
 * @returns GS level string or null
 */
export async function extractGSLevel(jobText: string): Promise<string | null> {
  const result = await parseJobPosting(jobText);
  return result.success ? result.data?.gs_level || null : null;
}

/**
 * Extract required qualifications only
 * @param jobText - Raw job posting text
 * @returns Array of required qualifications
 */
export async function extractRequiredQualifications(
  jobText: string
): Promise<string[]> {
  const result = await parseJobPosting(jobText);
  return result.success ? result.data?.required_qualifications || [] : [];
}
