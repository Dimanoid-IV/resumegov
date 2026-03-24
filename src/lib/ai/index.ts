/**
 * AI Service Layer
 * Modular AI architecture for federal resume optimization
 */

// Export types
export * from './types';

// Export client utilities
export {
  getOpenAIClient,
  callOpenAI,
  DEFAULT_MODEL,
  MAX_TOKENS,
  TEMPERATURE,
  type OpenAICallOptions,
} from './client';

// Export Job Parser
export {
  parseJobPosting,
  extractGSLevel,
  extractRequiredQualifications,
} from './jobParser';

// Export Resume Analyzer
export {
  analyzeResume,
  countWords,
  checkWordCountCompliance,
  type AnalyzeResumeInput,
} from './resumeAnalyzer';

// Export Relevance Filter
export {
  filterRelevance,
  extractRelevantSections,
  calculateCoveragePercent,
  type RelevanceFilterInput,
} from './relevanceFilter';

// Export Compression Engine
export {
  compressResume,
  compressResumeIterative,
  countWords as countWordsCompression,
  calculateCompressionRatio,
  validateCompression,
  type CompressionInput,
} from './compressionEngine';

// Export KSA Generator
export {
  generateKSAResponses,
  generateSingleKSA,
  validateKSAResponse,
  extractKSAFromJobText,
  type KSAGeneratorInput,
} from './ksaGenerator';
