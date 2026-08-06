import type { ResumeAnalysis } from '@/lib/ai/types';
import type { PreAIValidationResult } from '@/lib/ruleEngine';

const STOP_WORDS = new Set([
  'and', 'the', 'for', 'with', 'that', 'this', 'from', 'into', 'your', 'you',
  'are', 'will', 'have', 'has', 'job', 'work', 'using', 'required', 'experience',
]);

function normalize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9+#./-]+/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

export function calculateKeywordCoverage(resumeText: string, keywords: string[]): number {
  const resumeTokens = new Set(normalize(resumeText));
  const usefulKeywords = keywords
    .map(keyword => normalize(keyword))
    .filter(tokens => tokens.length > 0);

  if (usefulKeywords.length === 0) return 0;

  const totalCoverage = usefulKeywords.reduce((sum, tokens) => {
    const matches = tokens.filter(token => resumeTokens.has(token)).length;
    return sum + matches / tokens.length;
  }, 0);

  return Math.round((totalCoverage / usefulKeywords.length) * 100);
}

function calculateComplianceScore(structure: PreAIValidationResult['structure'], wordCount: number): number {
  let score = 0;
  if (structure.hasJobTitle) score += 3;
  if (structure.hasEmployer) score += 3;
  if (structure.hasEmploymentDates) score += 4;
  if (structure.hasHoursPerWeek) score += 4;
  if (structure.hasDutiesDescription) score += 2;
  score += Math.min(3, structure.achievementCount);

  // Text length is only an evidence-completeness signal. Page count still
  // depends on the rendered document and is never treated as a legal word cap.
  if (wordCount >= 500) score += 1;

  return Math.min(20, score);
}

function calculateAchievementScore(resumeText: string, achievementCount: number): number {
  const metricCount = (
    resumeText.match(/(?:\$[\d,.]+|\b\d+(?:\.\d+)?%|\b\d+[+]?(?:\s|$))/g) || []
  ).length;
  return Math.min(10, achievementCount * 2 + Math.min(4, metricCount));
}

export interface EvidenceScoreInput {
  resumeText: string;
  keywords: string[];
  specializedExperience: string[];
  aiAnalysis: ResumeAnalysis;
  preValidation: PreAIValidationResult;
}

export interface EvidenceScoreResult {
  compatibilityScore: number;
  keywordScore: number;
  specializedScore: number;
  complianceScore: number;
  achievementScore: number;
  keywordCoveragePercent: number;
  confidenceCap: number;
}

export function scoreResumeEvidence(input: EvidenceScoreInput): EvidenceScoreResult {
  const { resumeText, keywords, specializedExperience, aiAnalysis, preValidation } = input;
  const wordCount = preValidation.wordCount;
  const keywordCoveragePercent = calculateKeywordCoverage(resumeText, keywords);
  const keywordScore = Math.round((keywordCoveragePercent / 100) * 40);

  const gaps = aiAnalysis.feedback?.qualification_gaps?.length ?? 0;
  const aiSpecialized = Math.round((Math.max(0, Math.min(100, aiAnalysis.specialized_score)) / 100) * 30);
  const requirementCap = specializedExperience.length > 0
    ? Math.max(0, 30 - Math.min(24, gaps * 6))
    : 15;
  const lengthCap = wordCount < 250 ? 6 : wordCount < 500 ? 12 : wordCount < 750 ? 20 : 30;
  const specializedScore = Math.min(aiSpecialized, requirementCap, lengthCap);

  const complianceScore = calculateComplianceScore(preValidation.structure, wordCount);
  const achievementScore = calculateAchievementScore(
    resumeText,
    preValidation.structure.achievementCount
  );

  let confidenceCap = 100;
  if (wordCount < 250) confidenceCap = 45;
  else if (wordCount < 500) confidenceCap = 58;
  else if (wordCount < 750) confidenceCap = 72;

  if (!preValidation.structure.hasEmploymentDates || !preValidation.structure.hasHoursPerWeek) {
    confidenceCap = Math.min(confidenceCap, 79);
  }
  if (gaps >= 3) confidenceCap = Math.min(confidenceCap, 64);

  const rawTotal = keywordScore + specializedScore + complianceScore + achievementScore;
  const compatibilityScore = Math.min(confidenceCap, rawTotal);

  return {
    compatibilityScore,
    keywordScore,
    specializedScore,
    complianceScore,
    achievementScore,
    keywordCoveragePercent,
    confidenceCap,
  };
}
