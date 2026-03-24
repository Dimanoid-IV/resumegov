/**
 * Compression Engine Module
 * Compresses resumes to meet federal 2-page limit (950-1050 words, hard limit 1100)
 */

import { callOpenAI } from './client';
import { CompressedResume, AIResponse } from './types';

const SYSTEM_PROMPT = `You are a federal resume compression engine. Compress resumes to meet the 2-page limit while preserving ALL required qualifications.

CRITICAL REGULATORY CONSTRAINTS (effective Sept 27, 2025):
- Target word count: 950-1050 words
- Hard limit: 1100 words (NEVER exceed)
- NEVER fabricate experience
- NEVER remove required qualification language
- Preserve all demonstrated qualifications

COMPRESSION STRATEGIES (in priority order):
1. Remove redundant phrases and wordiness
2. Consolidate similar accomplishments
3. Shorten older/less relevant positions
4. Use concise action verbs
5. Remove non-essential details while keeping metrics
6. Abbreviate dates and locations if needed

PRESERVATION REQUIREMENTS:
- All job titles and dates
- All GS levels and federal positions
- All education credentials
- All certifications
- All quantified achievements (keep numbers)
- All required qualifications evidence

OUTPUT FORMAT - Return valid JSON only:
{
  "compressed_text": "the full compressed resume text",
  "original_word_count": number,
  "final_word_count": number,
  "compression_ratio": number (e.g., 0.75 for 25% reduction),
  "qualification_coverage_percent": number 0-100,
  "preserved_qualifications": ["list of qualifications preserved"],
  "removed_content_summary": ["summary of what was removed/condensed"],
  "compliance_status": {
    "within_word_limit": boolean,
    "within_page_limit": boolean,
    "all_qualifications_preserved": boolean
  }
}

If you cannot meet the word limit while preserving all qualifications, prioritize compliance_status.all_qualifications_preserved over the word limit.`;

export interface CompressionInput {
  resumeText: string;
  targetWordCount?: number;
  hardWordLimit?: number;
  requiredQualifications: string[];
  mustPreserveSections?: string[];
}

const DEFAULT_TARGET_MIN = 950;
const DEFAULT_TARGET_MAX = 1050;
const DEFAULT_HARD_LIMIT = 1100;

/**
 * Compress a resume to meet federal word count requirements
 * @param input - Resume text and compression parameters
 * @returns Compressed resume with compliance status
 */
export async function compressResume(
  input: CompressionInput
): Promise<AIResponse<CompressedResume>> {
  const {
    resumeText,
    targetWordCount = DEFAULT_TARGET_MAX,
    hardWordLimit = DEFAULT_HARD_LIMIT,
    requiredQualifications,
    mustPreserveSections = [],
  } = input;

  if (!resumeText || resumeText.trim().length === 0) {
    return {
      success: false,
      data: null,
      error: 'Resume text is required',
      tokens_used: 0,
      model: 'gpt-4o-mini',
    };
  }

  const originalWordCount = countWords(resumeText);

  // If already within limits, return as-is
  if (originalWordCount <= hardWordLimit) {
    return {
      success: true,
      data: {
        compressed_text: resumeText,
        original_word_count: originalWordCount,
        final_word_count: originalWordCount,
        compression_ratio: 1.0,
        qualification_coverage_percent: 100,
        preserved_qualifications: requiredQualifications,
        removed_content_summary: ['No compression needed - already within limits'],
        compliance_status: {
          within_word_limit: originalWordCount <= DEFAULT_TARGET_MAX,
          within_page_limit: originalWordCount <= DEFAULT_HARD_LIMIT,
          all_qualifications_preserved: true,
        },
      },
      error: null,
      tokens_used: 0,
      model: 'gpt-4o-mini',
    };
  }

  const userPrompt = `ORIGINAL RESUME (${originalWordCount} words):\n${resumeText}\n\nTARGET WORD COUNT: ${targetWordCount}\nHARD LIMIT: ${hardWordLimit} words (NEVER exceed)\n\nREQUIRED QUALIFICATIONS TO PRESERVE:\n${requiredQualifications.map((q, i) => `${i + 1}. ${q}`).join('\n')}\n\n${mustPreserveSections.length > 0 ? `SECTIONS THAT MUST BE PRESERVED:\n${mustPreserveSections.join('\n')}` : ''}\n\nCompress this resume to meet federal requirements. Return valid JSON only.`;

  const { data, error, tokensUsed } = await callOpenAI<CompressedResume>(
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
 * Iterative compression - compress in stages if needed
 * @param input - Resume text and compression parameters
 * @returns Compressed resume
 */
export async function compressResumeIterative(
  input: CompressionInput
): Promise<AIResponse<CompressedResume>> {
  const { resumeText, hardWordLimit = DEFAULT_HARD_LIMIT } = input;
  
  let currentText = resumeText;
  let attempts = 0;
  const maxAttempts = 3;
  
  while (attempts < maxAttempts) {
    const result = await compressResume({
      ...input,
      resumeText: currentText,
    });

    if (!result.success || !result.data) {
      return result;
    }

    // Check if we've met the hard limit
    if (result.data.final_word_count <= hardWordLimit) {
      return result;
    }

    // If still over limit, try again with more aggressive compression
    currentText = result.data.compressed_text;
    attempts++;
  }

  // Return the best attempt even if not perfect
  const finalResult = await compressResume({
    ...input,
    resumeText: currentText,
  });

  if (finalResult.success && finalResult.data) {
    finalResult.data.compliance_status.within_word_limit = 
      finalResult.data.final_word_count <= DEFAULT_TARGET_MAX;
    finalResult.data.compliance_status.within_page_limit = 
      finalResult.data.final_word_count <= hardWordLimit;
  }

  return finalResult;
}

/**
 * Count words in text
 * @param text - Text to count
 * @returns Word count
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
}

/**
 * Calculate compression ratio
 * @param original - Original word count
 * @param compressed - Compressed word count
 * @returns Ratio (e.g., 0.75 means 25% reduction)
 */
export function calculateCompressionRatio(
  original: number,
  compressed: number
): number {
  if (original === 0) return 1;
  return Math.round((compressed / original) * 100) / 100;
}

/**
 * Validate compressed resume compliance
 * @param compressedResume - The compression result
 * @returns Validation result
 */
export function validateCompression(
  compressedResume: CompressedResume
): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (compressedResume.final_word_count > DEFAULT_HARD_LIMIT) {
    issues.push(`Word count (${compressedResume.final_word_count}) exceeds hard limit (${DEFAULT_HARD_LIMIT})`);
  }

  if (!compressedResume.compliance_status.all_qualifications_preserved) {
    issues.push('Not all qualifications were preserved during compression');
  }

  if (compressedResume.qualification_coverage_percent < 90) {
    issues.push(`Qualification coverage (${compressedResume.qualification_coverage_percent}%) is below 90%`);
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}
