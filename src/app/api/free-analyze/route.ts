import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { parseJobPosting } from '@/lib/ai/jobParser';
import { analyzeResume } from '@/lib/ai/resumeAnalyzer';
import { validatePreAI, validatePostAI } from '@/lib/ruleEngine';

// ─── Debug: Log environment on import ──────────────────────────────────────────
console.log('[free-analyze] Module loaded, env vars:', {
  nodeEnv: process.env.NODE_ENV,
  hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
  hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  openAIKeyStarts: process.env.OPENAI_API_KEY?.slice(0, 10) ?? 'NOT FOUND',
});

// ─── Regulatory constants ─────────────────────────────────────────────────────
const FREE_LIMIT = 3;
const RATE_LIMIT_SECONDS = 30;        // Min seconds between analyses
const MAX_RESUME_WORDS = 12_000;
const MAX_JOB_WORDS = 6_000;

// Cost weights matching the scoring formula
const KW_WEIGHT = 0.40;
const SE_WEIGHT = 0.30;
const CO_WEIGHT = 0.20;
const AE_WEIGHT = 0.10;

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * POST /api/free-analyze
 * Rate-limited free analysis endpoint (max FREE_LIMIT per user).
 * Body: { resumeText: string, jobText: string }
 * Auth: Required (Supabase magic link session)
 */
export async function POST(request: NextRequest) {
  try {
    // Debug: Log environment status (without exposing secrets)
    console.log('[free-analyze] Environment check:', {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    });

    // ── Auth ─────────────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[free-analyze] Auth error:', authError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[free-analyze] User authenticated:', user.id);

    // ── Parse body ────────────────────────────────────────────────────────────
    let body: { resumeText?: string; jobText?: string; jobUrl?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { resumeText, jobText, jobUrl } = body;

    if (!resumeText || typeof resumeText !== 'string' || !resumeText.trim()) {
      return NextResponse.json({ error: 'Missing resumeText' }, { status: 400 });
    }
    if (!jobText || typeof jobText !== 'string' || !jobText.trim()) {
      return NextResponse.json({ error: 'Missing jobText' }, { status: 400 });
    }

    // Validate optional jobUrl
    const safeJobUrl = (typeof jobUrl === 'string' && jobUrl.trim())
      ? jobUrl.trim().slice(0, 2048)
      : null;

    // ── Input size limits (security) ─────────────────────────────────────────
    const resumeWords = countWords(resumeText);
    const jobWords = countWords(jobText);

    if (resumeWords > MAX_RESUME_WORDS) {
      return NextResponse.json(
        { error: `Resume exceeds ${MAX_RESUME_WORDS.toLocaleString()} word limit` },
        { status: 422 }
      );
    }
    if (jobWords > MAX_JOB_WORDS) {
      return NextResponse.json(
        { error: `Job announcement exceeds ${MAX_JOB_WORDS.toLocaleString()} word limit` },
        { status: 422 }
      );
    }

    // ── Fetch user profile (rate limit + free count check) ────────────────────
    let profile: {
      free_analysis_count: number;
      last_free_analysis_at: string | null;
      plan_type: string;
    } | null = null;

    const { data: profileData, error: profileError } = await supabase
      .from('users')
      .select('free_analysis_count, last_free_analysis_at, plan_type')
      .eq('id', user.id)
      .single();

    // If profile doesn't exist, create it
    if (profileError || !profileData) {
      // Create user profile with defaults
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newProfile, error: createError } = await (supabase as any)
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          plan_type: 'free',
          free_analysis_count: 0,
          credits_remaining: 3,
        })
        .select('free_analysis_count, last_free_analysis_at, plan_type')
        .single();
      
      if (createError || !newProfile) {
        console.error('Failed to create user profile:', createError);
        return NextResponse.json(
          { error: 'Failed to initialize user profile' },
          { status: 500 }
        );
      }
      
      profile = newProfile;
    } else {
      profile = profileData;
    }

    const freeCount = profile?.free_analysis_count ?? 0;
    const planType = profile?.plan_type ?? 'free';

    // Free users only: enforce hard cap
    if (planType === 'free' && freeCount >= FREE_LIMIT) {
      return NextResponse.json(
        {
          error: 'Free analysis limit reached. Upgrade to continue.',
          code: 'FREE_LIMIT_EXCEEDED',
          remaining: 0,
        },
        { status: 429 }
      );
    }

    // Rate limiting: prevent rapid repeated submissions
    if (profile?.last_free_analysis_at) {
      const lastAt = new Date(profile.last_free_analysis_at).getTime();
      const secondsAgo = (Date.now() - lastAt) / 1000;
      if (secondsAgo < RATE_LIMIT_SECONDS) {
        return NextResponse.json(
          {
            error: `Please wait ${Math.ceil(RATE_LIMIT_SECONDS - secondsAgo)} seconds before submitting again.`,
            code: 'RATE_LIMITED',
          },
          { status: 429 }
        );
      }
    }

    // ── Sanitize text inputs ──────────────────────────────────────────────────
    const safeResume = resumeText.slice(0, 80_000).replace(/\0/g, '');
    const safeJob = jobText.slice(0, 40_000).replace(/\0/g, '');

    // ── Parse job posting ─────────────────────────────────────────────────────
    console.log('[free-analyze] Starting job parsing...');
    const parseResult = await parseJobPosting(safeJob);
    console.log('[free-analyze] Job parsing result:', { success: parseResult.success, error: parseResult.error });

    if (!parseResult.success || !parseResult.data) {
      console.error('[free-analyze] Job parsing failed:', parseResult.error);
      return NextResponse.json(
        { error: 'Failed to parse vacancy announcement. Verify the job text is a complete USAJOBS posting.' },
        { status: 422 }
      );
    }

    const parsedJob = parseResult.data;
    console.log('[free-analyze] Job parsed successfully, gs_level:', parsedJob.gs_level);

    // ── Store resume ──────────────────────────────────────────────────────────
    console.log('[free-analyze] Storing resume...');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: resumeRecord, error: resumeError } = await (supabase as any)
      .from('resumes')
      .insert({ user_id: user.id, original_text: safeResume })
      .select('id')
      .single();
    
    if (resumeError) {
      console.error('[free-analyze] Resume insert error:', resumeError);
      return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 });
    }
    console.log('[free-analyze] Resume stored:', resumeRecord?.id);

    const storedResumeId = (resumeRecord as { id: string } | null)?.id ?? null;

    // ── Store job post ────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: jobRecord } = await (supabase as any)
      .from('job_posts')
      .insert({
        user_id: user.id,
        original_text: safeJob,
        parsed_json: parsedJob,
        gs_level: parsedJob.gs_level ?? null,
        job_url: safeJobUrl,
      })
      .select('id')
      .single();

    const storedJobPostId = (jobRecord as { id: string } | null)?.id ?? null;

    // ── PRE-AI VALIDATION (Rule Engine) ───────────────────────────────────────
    const preValidation = validatePreAI(safeResume, safeJob);
    
    if (!preValidation.valid) {
      return NextResponse.json(
        { 
          error: 'Resume structure validation failed',
          details: preValidation.errors,
        },
        { status: 422 }
      );
    }

    // ── Run analysis ──────────────────────────────────────────────────────────
    const analysisResult = await analyzeResume({
      resumeText: safeResume,
      jobText: safeJob,
      parsedJobData: {
        required_qualifications: parsedJob.required_qualifications || [],
        specialized_experience: parsedJob.specialized_experience || [],
        keywords: parsedJob.keywords || [],
      },
    });

    if (!analysisResult.success || !analysisResult.data) {
      return NextResponse.json(
        { error: 'Analysis engine failed. Please try again.' },
        { status: 422 }
      );
    }

    const aiData = analysisResult.data;

    // ── POST-AI VALIDATION (Rule Engine) ─────────────────────────────────────
    const postValidation = validatePostAI({
      originalText: safeResume,
      compressedText: safeResume, // Using original for free analysis
      specializedExperienceStatements: parsedJob.specialized_experience || [],
      extractedKeywords: parsedJob.keywords || [],
    });

    // Weighted scoring formula (deterministic)
    const keywordScore = Math.min(40, aiData.keyword_score * KW_WEIGHT);
    const specializedScore = Math.min(30, aiData.specialized_score * SE_WEIGHT);
    const complianceScore = Math.min(20, aiData.compliance_score * CO_WEIGHT);
    const achievementScore = Math.min(10, aiData.achievement_score * AE_WEIGHT);
    const compatibilityScore = Math.min(100, Math.round(
      keywordScore + specializedScore + complianceScore + achievementScore
    ));

    const wordCount = countWords(safeResume);

    // ── Store analysis ────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: analysisRecord } = await (supabase as any)
      .from('analyses')
      .insert({
        user_id: user.id,
        resume_id: storedResumeId,
        job_post_id: storedJobPostId,
        compatibility_score: compatibilityScore,
        keyword_score: Math.round(keywordScore * 10) / 10,
        specialized_score: Math.round(specializedScore * 10) / 10,
        compliance_score: Math.round(complianceScore * 10) / 10,
        achievement_score: Math.round(achievementScore * 10) / 10,
        word_count: wordCount,
        word_count_original: postValidation.wordCount.original,
        word_count_final: postValidation.wordCount.final,
        coverage_original: postValidation.coverage.percentage,
        coverage_final: postValidation.coverage.percentage,
        risk_level: postValidation.riskLevel,
        feedback_json: {
          missing_elements: aiData.feedback?.qualification_gaps || [],
          weak_bullets: aiData.feedback?.improvements || [],
          rule_engine_warnings: postValidation.warnings,
        },
      })
      .select('id')
      .single();

    const analysisId = (analysisRecord as { id: string } | null)?.id;

    if (!analysisId) {
      return NextResponse.json({ error: 'Failed to store analysis results' }, { status: 500 });
    }

    // ── Increment free_analysis_count (admin client, bypasses RLS) ────────────
    const admin = createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (admin as any)
      .from('users')
      .update({
        free_analysis_count: freeCount + 1,
        last_free_analysis_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    const remaining = planType === 'free' ? Math.max(0, FREE_LIMIT - (freeCount + 1)) : null;

    return NextResponse.json({
      analysisId,
      remaining,
      scores: {
        compatibility_score: compatibilityScore,
        keyword_score: Math.round(keywordScore * 10) / 10,
        specialized_score: Math.round(specializedScore * 10) / 10,
        compliance_score: Math.round(complianceScore * 10) / 10,
        achievement_score: Math.round(achievementScore * 10) / 10,
        word_count: wordCount,
      },
    });
  } catch (error) {
    // Comprehensive error logging
    console.error('[free-analyze] FATAL ERROR:', error);
    console.error('[free-analyze] Error type:', typeof error);
    console.error('[free-analyze] Error message:', error instanceof Error ? error.message : String(error));
    console.error('[free-analyze] Error stack:', error instanceof Error ? error.stack : 'No stack');
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
