/**
 * Rule Engine Lite — Structured Compliance Validation Layer
 * 
 * This module enforces federal resume compliance rules.
 * AI operates within this fixed framework and cannot override rules.
 */

// ─── Regulatory Constants ─────────────────────────────────────────────────────

export const WORD_COUNT_TARGET_MIN = 950;
export const WORD_COUNT_TARGET_MAX = 1050;
export const WORD_COUNT_HARD_MAX = 1100;
export const WORD_COUNT_MIN_ACCEPTABLE = 850;

export const SPECIALIZED_EXPERIENCE_COVERAGE_STRONG = 85;
export const SPECIALIZED_EXPERIENCE_COVERAGE_MODERATE = 70;
export const SPECIALIZED_EXPERIENCE_COVERAGE_HIGH_RISK = 70;

export const COVERAGE_LOSS_THRESHOLD = 10; // Max acceptable loss %

// Scoring weights (must sum to 100)
export const SCORE_WEIGHT_KEYWORD = 40;
export const SCORE_WEIGHT_SPECIALIZED = 30;
export const SCORE_WEIGHT_COMPLIANCE = 20;
export const SCORE_WEIGHT_ACHIEVEMENT = 10;

// ─── Types ────────────────────────────────────────────────────────────────────

export type RiskLevel = 'Low' | 'Moderate' | 'High';

export interface ResumeStructure {
  hasJobTitle: boolean;
  hasEmployer: boolean;
  hasEmploymentDates: boolean;
  hasHoursPerWeek: boolean;
  hasDutiesDescription: boolean;
  achievementCount: number;
}

export interface SpecializedExperienceCoverage {
  total: number;
  covered: number;
  percentage: number;
  riskLevel: RiskLevel;
}

export interface WordCountAnalysis {
  original: number;
  final: number;
  status: 'Compliant' | 'Over Limit' | 'Under Target' | 'Critical';
  needsSecondPass: boolean;
  qualificationLossRisk: boolean;
}

export interface CompatibilityScoreBreakdown {
  keywordAlignment: number;      // 0-40
  specializedCoverage: number;   // 0-30
  federalCompliance: number;     // 0-20
  achievementDensity: number;    // 0-10
  total: number;                 // 0-100
}

export interface PreAIValidationResult {
  valid: boolean;
  structure: ResumeStructure;
  wordCount: number;
  errors: string[];
  warnings: string[];
}

export interface PostAIValidationResult {
  valid: boolean;
  wordCount: WordCountAnalysis;
  coverage: SpecializedExperienceCoverage;
  compatibilityScore: CompatibilityScoreBreakdown;
  riskLevel: RiskLevel;
  errors: string[];
  warnings: string[];
  needsRecompression: boolean;
}

// ─── Helper Functions ─────────────────────────────────────────────────────────

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function calculateRiskLevel(percentage: number): RiskLevel {
  if (percentage >= SPECIALIZED_EXPERIENCE_COVERAGE_STRONG) return 'Low';
  if (percentage >= SPECIALIZED_EXPERIENCE_COVERAGE_MODERATE) return 'Moderate';
  return 'High';
}

// ─── Pre-AI Validation ────────────────────────────────────────────────────────

/**
 * Validates resume structure BEFORE sending to AI
 */
export function validatePreAI(resumeText: string, jobText: string): PreAIValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  
  // Word count check
  const wordCount = countWords(resumeText);
  if (wordCount > WORD_COUNT_HARD_MAX) {
    warnings.push(`Resume exceeds hard limit (${wordCount}/${WORD_COUNT_HARD_MAX} words)`);
  }
  if (wordCount < WORD_COUNT_MIN_ACCEPTABLE) {
    warnings.push(`Resume may be too short (${wordCount} words, minimum ${WORD_COUNT_MIN_ACCEPTABLE})`);
  }

  // Structure validation (simplified regex-based detection)
  const structure: ResumeStructure = {
    hasJobTitle: /(?:title|position|role)\s*[:\-]?/i.test(resumeText),
    hasEmployer: /(?:agency|department|company|employer)\s*[:\-]?/i.test(resumeText),
    hasEmploymentDates: /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4}\b/i.test(resumeText),
    hasHoursPerWeek: /\b(?:hours? per week|hrs?\/?week|h\/w)\b/i.test(resumeText),
    hasDutiesDescription: /\b(?:duties|responsibilities|tasks)\s*[:\-]?/i.test(resumeText),
    achievementCount: (resumeText.match(/\b(?:increased|reduced|improved|achieved|completed|led|managed)\b/gi) || []).length,
  };

  // Mandatory elements check
  if (!structure.hasJobTitle) errors.push('Missing job title');
  if (!structure.hasEmployer) errors.push('Missing employer/agency name');
  if (!structure.hasEmploymentDates) errors.push('Missing employment dates (month/year format required)');
  if (!structure.hasHoursPerWeek) warnings.push('Missing hours per week (recommended for federal resumes)');
  if (!structure.hasDutiesDescription) errors.push('Missing duties description');

  // Achievement density warning
  if (structure.achievementCount === 0) {
    warnings.push('No measurable achievements detected');
  }

  const valid = errors.length === 0;

  return {
    valid,
    structure,
    wordCount,
    errors,
    warnings,
  };
}

// ─── Post-AI Validation ───────────────────────────────────────────────────────

/**
 * Validates AI output and calculates structured scores
 */
export function validatePostAI(params: {
  originalText: string;
  compressedText: string;
  specializedExperienceStatements: string[];
  extractedKeywords: string[];
}): PostAIValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Word count analysis
  const originalWordCount = countWords(params.originalText);
  const finalWordCount = countWords(params.compressedText);
  
  let wordStatus: WordCountAnalysis['status'] = 'Compliant';
  let needsSecondPass = false;
  let qualificationLossRisk = false;

  if (finalWordCount > WORD_COUNT_HARD_MAX) {
    wordStatus = 'Over Limit';
    needsSecondPass = true;
  } else if (finalWordCount > WORD_COUNT_TARGET_MAX) {
    wordStatus = 'Over Limit';
  } else if (finalWordCount < WORD_COUNT_TARGET_MIN && finalWordCount >= WORD_COUNT_MIN_ACCEPTABLE) {
    wordStatus = 'Under Target';
  } else if (finalWordCount < WORD_COUNT_MIN_ACCEPTABLE) {
    wordStatus = 'Critical';
    qualificationLossRisk = true;
  }

  const wordCount: WordCountAnalysis = {
    original: originalWordCount,
    final: finalWordCount,
    status: wordStatus,
    needsSecondPass,
    qualificationLossRisk,
  };

  // Specialized experience coverage
  const coveredCount = params.specializedExperienceStatements.filter(se =>
    params.compressedText.toLowerCase().includes(se.toLowerCase())
  ).length;
  
  const coveragePercentage = params.specializedExperienceStatements.length > 0
    ? Math.round((coveredCount / params.specializedExperienceStatements.length) * 100)
    : 0;

  const coverage: SpecializedExperienceCoverage = {
    total: params.specializedExperienceStatements.length,
    covered: coveredCount,
    percentage: coveragePercentage,
    riskLevel: calculateRiskLevel(coveragePercentage),
  };

  // Check for coverage loss
  if (coveragePercentage < SPECIALIZED_EXPERIENCE_COVERAGE_MODERATE) {
    errors.push(`Specialized experience coverage too low (${coveragePercentage}%)`);
  }

  // Compatibility score calculation (deterministic)
  // Keyword alignment (simplified - would need actual extraction logic)
  const keywordAlignment = Math.min(
    SCORE_WEIGHT_KEYWORD,
    Math.round(SCORE_WEIGHT_KEYWORD * 0.8) // Placeholder - actual implementation needed
  );

  // Specialized coverage score
  const specializedScore = Math.min(
    SCORE_WEIGHT_SPECIALIZED,
    Math.round((coveragePercentage / 100) * SCORE_WEIGHT_SPECIALIZED)
  );

  // Federal compliance score
  let compliancePenalties = 0;
  if (!wordCount.status.includes('Compliant')) compliancePenalties += 10;
  if (coverage.riskLevel === 'High') compliancePenalties += 15;
  const federalCompliance = Math.max(0, SCORE_WEIGHT_COMPLIANCE - compliancePenalties);

  // Achievement density score
  const achievementScore = Math.min(
    SCORE_WEIGHT_ACHIEVEMENT,
    Math.round((Math.min(wordCount.final / 200, 1)) * SCORE_WEIGHT_ACHIEVEMENT)
  );

  const compatibilityScore: CompatibilityScoreBreakdown = {
    keywordAlignment,
    specializedCoverage: specializedScore,
    federalCompliance,
    achievementDensity: achievementScore,
    total: keywordAlignment + specializedScore + federalCompliance + achievementScore,
  };

  // Overall risk level
  let riskLevel: RiskLevel = 'Low';
  if (errors.length > 0 || coverage.riskLevel === 'High' || wordStatus === 'Over Limit') {
    riskLevel = 'High';
  } else if (warnings.length > 0 || coverage.riskLevel === 'Moderate') {
    riskLevel = 'Moderate';
  }

  const valid = errors.length === 0 && !needsSecondPass;
  const needsRecompression = needsSecondPass || coveragePercentage < SPECIALIZED_EXPERIENCE_COVERAGE_MODERATE;

  return {
    valid,
    wordCount,
    coverage,
    compatibilityScore,
    riskLevel,
    errors,
    warnings,
    needsRecompression,
  };
}

// ─── No Fabrication Validator ─────────────────────────────────────────────────

/**
 * Ensures AI did not add experience not present in original
 */
export function validateNoFabrication(originalText: string, compressedText: string): {
  valid: boolean;
  confidence: number;
  warnings: string[];
} {
  const warnings: string[] = [];
  
  // Extract potential experience claims from compressed version
  const experiencePatterns = [
    /\b(?:managed|led|directed|oversaw)\s+(?:a|an|the)?\s*\w+/gi,
    /\b(?:responsible for|in charge of)\s+/gi,
    /\b(?:developed|created|implemented|designed)\s+/gi,
  ];

  const compressedClaims = new Set<string>();
  experiencePatterns.forEach(pattern => {
    const matches = compressedText.match(pattern) || [];
    matches.forEach(m => compressedClaims.add(m.toLowerCase()));
  });

  // Check if claims exist in original
  const originalLower = originalText.toLowerCase();
  let fabricationRisk = 0;

  compressedClaims.forEach(claim => {
    if (!originalLower.includes(claim)) {
      fabricationRisk++;
    }
  });

  const confidence = Math.max(0, 100 - (fabricationRisk * 10));
  const valid = confidence >= 80;

  if (!valid) {
    warnings.push('Potential fabrication detected - AI may have added experience not in original');
  }

  return {
    valid,
    confidence,
    warnings,
  };
}
