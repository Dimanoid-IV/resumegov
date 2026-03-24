/**
 * AI Service Types
 * Structured JSON types for all AI module outputs
 */

// Job Parser Output
export interface ParsedJobData {
  gs_level: string | null;
  title: string;
  agency: string;
  location: string;
  salary_range: {
    min: number | null;
    max: number | null;
  };
  required_qualifications: string[];
  specialized_experience: string[];
  keywords: string[];
  duties: string[];
  ksa_requirements: string[];
}

// Resume Analyzer Output
export interface ResumeAnalysis {
  compatibility_score: number;
  keyword_score: number;
  specialized_score: number;
  compliance_score: number;
  achievement_score: number;
  word_count: number;
  feedback: {
    strengths: string[];
    improvements: string[];
    missing_keywords: string[];
    compliance_issues: string[];
    qualification_gaps: string[];
  };
}

// Relevance Filter Output
export interface RelevanceAnalysis {
  relevance_score: number;
  matching_qualifications: string[];
  partial_matches: Array<{
    requirement: string;
    resume_evidence: string;
    confidence: number;
  }>;
  gaps: string[];
  recommendations: string[];
}

// Compression Engine Output
export interface CompressedResume {
  compressed_text: string;
  original_word_count: number;
  final_word_count: number;
  compression_ratio: number;
  qualification_coverage_percent: number;
  preserved_qualifications: string[];
  removed_content_summary: string[];
  compliance_status: {
    within_word_limit: boolean;
    within_page_limit: boolean;
    all_qualifications_preserved: boolean;
  };
}

// KSA Generator Output
export interface KSAResponses {
  responses: Array<{
    ksa_statement: string;
    response_text: string;
    supporting_evidence: string[];
  }>;
  overall_quality_score: number;
}

// OpenAI Response Wrapper
export interface AIResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
  tokens_used: number;
  model: string;
}
