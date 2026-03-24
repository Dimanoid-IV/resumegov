import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Federal resume constraints
const WORDS_PER_PAGE = 500;
const PAGE_LIMIT = 2;
const TARGET_MIN = 950;
const TARGET_MAX = 1050;
const HARD_LIMIT = 1100;

// Status types
type WordCountStatus = 'within_limit' | 'borderline' | 'exceeds';

// Validation result interface
interface ValidationResult {
  word_count: number;
  page_estimate: number;
  status: '✅ Within Limit (<1050)' | '⚠ Borderline (1050–1100)' | '❌ Exceeds (>1100)';
  status_code: WordCountStatus;
  is_compliant: boolean;
  target_range: string;
  hard_limit: number;
  recommendations: string[];
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Calculate page estimate
 */
function calculatePageEstimate(wordCount: number): number {
  return wordCount / WORDS_PER_PAGE;
}

/**
 * Determine status based on word count
 */
function getStatus(wordCount: number): {
  status: ValidationResult['status'];
  status_code: WordCountStatus;
  is_compliant: boolean;
} {
  if (wordCount < TARGET_MIN) {
    return {
      status: '✅ Within Limit (<1050)',
      status_code: 'within_limit',
      is_compliant: true,
    };
  }
  
  if (wordCount <= TARGET_MAX) {
    return {
      status: '✅ Within Limit (<1050)',
      status_code: 'within_limit',
      is_compliant: true,
    };
  }
  
  if (wordCount <= HARD_LIMIT) {
    return {
      status: '⚠ Borderline (1050–1100)',
      status_code: 'borderline',
      is_compliant: true,
    };
  }
  
  return {
    status: '❌ Exceeds (>1100)',
    status_code: 'exceeds',
    is_compliant: false,
  };
}

/**
 * Generate recommendations
 */
function getRecommendations(wordCount: number, status_code: WordCountStatus): string[] {
  const recommendations: string[] = [];
  
  if (wordCount < TARGET_MIN) {
    recommendations.push('Consider adding more detail to your resume');
    recommendations.push('Include additional achievements or responsibilities');
    recommendations.push('Ensure all relevant experience is documented');
  } else if (status_code === 'within_limit') {
    recommendations.push('Resume is within optimal range');
    recommendations.push('Maintain current word count for best results');
  } else if (status_code === 'borderline') {
    recommendations.push('Resume is over target but within hard limit');
    recommendations.push('Consider minor compression if needed');
    recommendations.push('All qualifications will be preserved');
  } else {
    recommendations.push('Resume exceeds 1100 word hard limit');
    recommendations.push('Run optimization to compress content');
    recommendations.push('Redundant sections will be removed while preserving qualifications');
  }
  
  return recommendations;
}

/**
 * POST /api/validate-wordcount
 * Validates resume word count against federal requirements
 * Body: { resumeId?: string, text?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { resumeId, text } = body as { resumeId?: string; text?: string };

    let resumeText = text || '';

    // If resumeId provided, fetch from database
    if (resumeId && !text) {
      const { data: resumeData, error: resumeError } = await supabase
        .from('resumes')
        .select('original_text')
        .eq('id', resumeId)
        .single();

      if (resumeError || !resumeData) {
        return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
      }

      resumeText = (resumeData as { original_text: string }).original_text;
    }

    if (!resumeText) {
      return NextResponse.json(
        { error: 'Provide either resumeId or text field' },
        { status: 400 }
      );
    }

    // Calculate word count
    const wordCount = countWords(resumeText);
    const pageEstimate = calculatePageEstimate(wordCount);
    
    // Get status
    const { status, status_code, is_compliant } = getStatus(wordCount);
    
    // Generate recommendations
    const recommendations = getRecommendations(wordCount, status_code);

    // Build result
    const result: ValidationResult = {
      word_count: wordCount,
      page_estimate: Math.round(pageEstimate * 10) / 10,
      status,
      status_code,
      is_compliant,
      target_range: `${TARGET_MIN}-${TARGET_MAX}`,
      hard_limit: HARD_LIMIT,
      recommendations,
    };

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('Validate wordcount API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/validate-wordcount
 * Returns constraint information
 */
export async function GET() {
  return NextResponse.json({
    constraints: {
      words_per_page: WORDS_PER_PAGE,
      page_limit: PAGE_LIMIT,
      target_min: TARGET_MIN,
      target_max: TARGET_MAX,
      hard_limit: HARD_LIMIT,
    },
    statuses: {
      within_limit: '✅ Within Limit (<1050)',
      borderline: '⚠ Borderline (1050–1100)',
      exceeds: '❌ Exceeds (>1100)',
    },
  });
}
