// Federal Resume Regulatory Constraints
export const FEDERAL_RESUME_CONSTRAINTS = {
  WORD_COUNT: {
    TARGET_MIN: 950,
    TARGET_MAX: 1050,
    HARD_LIMIT: 1100,
  },
  PAGE_LIMIT: 2,
  EFFECTIVE_DATE: '2025-09-27',
} as const;

// Analysis result type
export interface AnalysisResult {
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
  };
}

// Optimized resume result type
export interface OptimizedResume {
  compressed_text: string;
  qualification_coverage_percent: number;
  final_word_count: number;
  ksa_text: string;
}

// Parsed job post type
export interface ParsedJobPost {
  gs_level: string | null;
  title: string;
  agency: string;
  location: string;
  salary_range: {
    min: number;
    max: number;
  } | null;
  required_qualifications: string[];
  specialized_experience: string[];
  keywords: string[];
  duties: string[];
}

// Plan types
export type PlanType = 'free' | 'basic' | 'pro' | 'enterprise';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  credits: number;
  features: string[];
}

export const PLANS: Record<PlanType, Plan> = {
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    credits: 3,
    features: ['3 resume analyses', 'Basic compatibility score'],
  },
  basic: {
    id: 'basic',
    name: 'Basic',
    price: 999, // $9.99
    credits: 10,
    features: ['10 resume analyses', 'Full scoring', 'Keyword optimization'],
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 2999, // $29.99
    credits: 50,
    features: ['50 resume analyses', 'AI optimization', 'KSA generation', 'Priority support'],
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 9999, // $99.99
    credits: -1, // Unlimited
    features: ['Unlimited analyses', 'Custom integrations', 'Dedicated support', 'API access'],
  },
};
