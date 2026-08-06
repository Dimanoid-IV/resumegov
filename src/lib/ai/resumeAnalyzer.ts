/**
 * Resume Analyzer Module
 * Analyzes resume against job requirements and provides scoring
 */

import { callOpenAI } from './client';
import { ResumeAnalysis, AIResponse } from './types';

const SYSTEM_PROMPT = `You are a federal resume analyzer. Compare a resume against job requirements and provide detailed scoring.

CRITICAL RULES:
1. Be objective and consistent in scoring
2. Score based on explicit evidence in the resume
3. Never assume qualifications not stated in the resume
4. Consider federal resume best practices (CCAR format, metrics, etc.)
5. Word count must include ALL text in the resume

SCORING CRITERIA (0-100 each):
- compatibility_score: Overall match between resume and job requirements
- keyword_score: Presence of important job keywords in resume
- specialized_score: Evidence of specialized experience requirements
- compliance_score: Adherence to federal resume format and rules
- achievement_score: Quality of accomplishments (metrics, impact, CCAR format)

FEDERAL RESUME COMPLIANCE RULES (effective Sept 27, 2025):
- The submitted resume must render to no more than 2 pages
- Word count alone cannot prove page-count compliance
- Must include all relevant experience
- Must use CCAR format (Challenge-Context-Action-Result)
- Must quantify achievements where possible

REWRITE PREVIEW:
- Select one real line from the resume that can be improved for this vacancy
- Rewrite it using ONLY facts already present in the resume
- Do not add a metric, tool, responsibility, result, credential, or scope that is not explicit in the source
- If no safe rewrite is possible, return null

OUTPUT FORMAT - Return valid JSON only:
{
  "compatibility_score": number 0-100,
  "keyword_score": number 0-100,
  "specialized_score": number 0-100,
  "compliance_score": number 0-100,
  "achievement_score": number 0-100,
  "word_count": exact word count as number,
  "feedback": {
    "strengths": ["list of resume strengths"],
    "improvements": ["specific improvement suggestions"],
    "missing_keywords": ["important keywords not found in resume"],
    "compliance_issues": ["any compliance problems"],
    "qualification_gaps": ["required qualifications not demonstrated"],
    "rewrite_preview": {
      "before": "exact or minimally shortened source line",
      "after": "truth-preserving vacancy-targeted rewrite",
      "rationale": "what changed and why"
    }
  }
}`;

export interface AnalyzeResumeInput {
  resumeText: string;
  jobText: string;
  parsedJobData?: {
    required_qualifications: string[];
    specialized_experience: string[];
    keywords: string[];
  };
}

/**
 * Analyze a resume against a job posting
 * @param input - Resume text, job text, and optional parsed job data
 * @returns Detailed analysis with scores and feedback
 */
export async function analyzeResume(
  input: AnalyzeResumeInput
): Promise<AIResponse<ResumeAnalysis>> {
  const { resumeText, jobText, parsedJobData } = input;

  if (!resumeText || resumeText.trim().length === 0) {
    return {
      success: false,
      data: null,
      error: 'Resume text is required',
      tokens_used: 0,
      model: 'gpt-4o-mini',
    };
  }

  if (!jobText || jobText.trim().length === 0) {
    return {
      success: false,
      data: null,
      error: 'Job text is required',
      tokens_used: 0,
      model: 'gpt-4o-mini',
    };
  }

  // Build user prompt
  let userPrompt = `RESUME:\n${resumeText}\n\nJOB POSTING:\n${jobText}`;

  if (parsedJobData) {
    userPrompt += `\n\nPARSED JOB REQUIREMENTS:\n`;
    userPrompt += `Required Qualifications:\n${parsedJobData.required_qualifications.join('\n')}\n\n`;
    userPrompt += `Specialized Experience:\n${parsedJobData.specialized_experience.join('\n')}\n\n`;
    userPrompt += `Key Keywords:\n${parsedJobData.keywords.join(', ')}`;
  }

  const { data, error, tokensUsed } = await callOpenAI<ResumeAnalysis>(
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
 * Quick word count check
 * @param resumeText - Resume text
 * @returns Word count
 */
export function countWords(resumeText: string): number {
  return resumeText.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Return a planning signal. The rendered page count remains authoritative.
 * @param wordCount - Current word count
 * @returns Compliance status
 */
export function checkWordCountCompliance(wordCount: number): {
  compliant: boolean;
  status: 'under' | 'optimal' | 'over' | 'exceeded';
  message: string;
} {
  if (wordCount < 950) {
    return {
      compliant: false,
      status: 'under',
      message: `Resume may need more qualification evidence (${wordCount} words detected)`,
    };
  }
  
  if (wordCount <= 1050) {
    return {
      compliant: true,
      status: 'optimal',
      message: `Resume is within the internal planning range (${wordCount} words); verify rendered pages`,
    };
  }
  
  if (wordCount <= 1100) {
    return {
      compliant: true,
      status: 'over',
      message: `Resume may require formatting review (${wordCount} words detected)`,
    };
  }
  
  return {
    compliant: false,
    status: 'exceeded',
      message: `Resume has a high two-page overflow risk (${wordCount} words detected)`,
  };
}
