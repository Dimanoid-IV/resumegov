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
- Target word count: 950-1050 words
- Hard limit: 1100 words
- Must include all relevant experience
- Must use CCAR format (Challenge-Context-Action-Result)
- Must quantify achievements where possible

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
    "qualification_gaps": ["required qualifications not demonstrated"]
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
 * Check if resume meets federal word count requirements
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
      message: `Resume is ${950 - wordCount} words under the target minimum of 950 words`,
    };
  }
  
  if (wordCount <= 1050) {
    return {
      compliant: true,
      status: 'optimal',
      message: `Resume is within optimal range (${wordCount} words)`,
    };
  }
  
  if (wordCount <= 1100) {
    return {
      compliant: true,
      status: 'over',
      message: `Resume is ${wordCount - 1050} words over target but within hard limit`,
    };
  }
  
  return {
    compliant: false,
    status: 'exceeded',
    message: `Resume exceeds hard limit by ${wordCount - 1100} words (max: 1100)`,
  };
}
