import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeResume } from '@/lib/ai';

// Analysis output interface
interface AnalysisOutput {
  compatibility_score: number;
  keyword_score: number;
  specialized_score: number;
  compliance_score: number;
  achievement_score: number;
  missing_elements: string[];
  weak_bullets: string[];
}

// Parse job JSON from stored format to required format for analyzer
interface StoredJobData {
  required_specialized_experience?: string[];
  key_competencies?: string[];
  required_keywords?: string[];
  gs_level?: string;
  mandatory_elements?: string[];
  parsed_json?: {
    required_qualifications?: string[];
    keywords?: string[];
    specialized_experience?: string[];
  };
}

// Resume data from database
interface ResumeData {
  original_text: string;
}

// Job post data from database
interface JobPostData {
  original_text: string;
  parsed_json: Record<string, unknown> | null;
}

// Validate analysis output format
function isValidAnalysis(data: unknown): data is AnalysisOutput {
  if (!data || typeof data !== 'object') return false;
  const obj = data as Record<string, unknown>;
  return (
    typeof obj.compatibility_score === 'number' &&
    typeof obj.keyword_score === 'number' &&
    typeof obj.specialized_score === 'number' &&
    typeof obj.compliance_score === 'number' &&
    typeof obj.achievement_score === 'number' &&
    Array.isArray(obj.missing_elements) &&
    Array.isArray(obj.weak_bullets)
  );
}

/**
 * POST /api/analyze
 * Analyzes resume against job posting
 * Body: { resumeId: string, jobPostId: string }
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
    const { resumeId, jobPostId } = body;

    if (!resumeId || !jobPostId) {
      return NextResponse.json(
        { error: 'Missing required fields: resumeId, jobPostId' },
        { status: 400 }
      );
    }

    // Fetch resume from database
    const { data: resumeData, error: resumeError } = await supabase
      .from('resumes')
      .select('original_text')
      .eq('id', resumeId)
      .single();

    if (resumeError || !resumeData) {
      return NextResponse.json(
        { error: 'Resume not found' },
        { status: 404 }
      );
    }

    const resume = resumeData as ResumeData;

    // Fetch job post from database
    const { data: jobPostData, error: jobError } = await supabase
      .from('job_posts')
      .select('original_text, parsed_json')
      .eq('id', jobPostId)
      .single();

    if (jobError || !jobPostData) {
      return NextResponse.json(
        { error: 'Job post not found' },
        { status: 404 }
      );
    }

    const jobPost = jobPostData as JobPostData;

    // Parse job data
    const jobData = (jobPost.parsed_json || {}) as StoredJobData;
    const parsedJobData = {
      required_qualifications: jobData.mandatory_elements || jobData.parsed_json?.required_qualifications || [],
      specialized_experience: jobData.required_specialized_experience || jobData.parsed_json?.specialized_experience || [],
      keywords: jobData.required_keywords || jobData.key_competencies || jobData.parsed_json?.keywords || [],
    };

    // Call AI analysis with retry logic
    const maxRetries = 3;
    let analysisResult: AnalysisOutput | null = null;
    let lastError: string | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const result = await analyzeResume({
        resumeText: resume.original_text,
        jobText: jobPost.original_text,
        parsedJobData,
      });

      if (!result.success || !result.data) {
        lastError = result.error || 'Unknown analysis error';
        console.error(`Analysis attempt ${attempt} failed:`, lastError);
        continue;
      }

      // Map to required output format with formula
      const aiData = result.data;
      const keywordScore = Math.min(40, aiData.keyword_score * 0.4);
      const specializedScore = Math.min(30, aiData.specialized_score * 0.3);
      const complianceScore = Math.min(20, aiData.compliance_score * 0.2);
      const achievementScore = Math.min(10, aiData.achievement_score * 0.1);

      const compatibilityScore = Math.round(
        keywordScore + specializedScore + complianceScore + achievementScore
      );

      const mappedResult: AnalysisOutput = {
        compatibility_score: Math.min(100, compatibilityScore),
        keyword_score: Math.round(keywordScore * 10) / 10,
        specialized_score: Math.round(specializedScore * 10) / 10,
        compliance_score: Math.round(complianceScore * 10) / 10,
        achievement_score: Math.round(achievementScore * 10) / 10,
        missing_elements: aiData.feedback?.qualification_gaps || aiData.feedback?.missing_keywords || [],
        weak_bullets: aiData.feedback?.improvements || [],
      };

      if (!isValidAnalysis(mappedResult)) {
        lastError = `Invalid analysis format on attempt ${attempt}`;
        continue;
      }

      analysisResult = mappedResult;
      break;
    }

    if (!analysisResult) {
      return NextResponse.json(
        { error: `Failed to analyze after ${maxRetries} attempts: ${lastError}` },
        { status: 422 }
      );
    }

    // Count words in resume
    const wordCount = resume.original_text.trim().split(/\s+/).filter((w: string) => w.length > 0).length;

    // Store results in analyses table (use any to bypass type inference issues)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: analysisRecord, error: insertError } = await (supabase as any)
      .from('analyses')
      .insert({
        user_id: user.id,
        resume_id: resumeId,
        job_post_id: jobPostId,
        compatibility_score: analysisResult.compatibility_score,
        keyword_score: analysisResult.keyword_score,
        specialized_score: analysisResult.specialized_score,
        compliance_score: analysisResult.compliance_score,
        achievement_score: analysisResult.achievement_score,
        word_count: wordCount,
        feedback_json: {
          missing_elements: analysisResult.missing_elements,
          weak_bullets: analysisResult.weak_bullets,
        },
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to store analysis:', insertError);
      return NextResponse.json(
        { error: 'Failed to store analysis results' },
        { status: 500 }
      );
    }

    return NextResponse.json(analysisResult, { status: 200 });
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
